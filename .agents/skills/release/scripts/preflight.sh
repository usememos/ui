#!/usr/bin/env bash
# Preflight for a release: says what a Release workflow run on main would
# publish, and whether it is safe to start one. Read only: it never
# dispatches, pushes or publishes anything.
#
# Exit codes:
#   0  a release can be dispatched
#   1  do not dispatch (reasons are printed after "Do not dispatch")
#   2  a tool is missing or a lookup failed
#
# Needs git, gh (logged in), npm and node.
set -euo pipefail

repo=usememos/ui
pkg=@usememos/ui
workflow=release.yml
ci_workflow=ci.yml

cd "$(git rev-parse --show-toplevel)"

for tool in git gh npm node; do
  command -v "$tool" >/dev/null 2>&1 || { echo "Missing tool: $tool"; exit 2; }
done
gh auth status >/dev/null 2>&1 || { echo "gh is not logged in (run: gh auth login)"; exit 2; }

blockers=()

# What the workflow will release: the tip of main on GitHub, never the
# local checkout.
git fetch -q origin main
target=$(git rev-parse origin/main)
echo "Target: origin/main at $(git log -1 --format='%h %s' origin/main)"
if [ "$(git rev-parse HEAD)" != "$target" ]; then
  ahead=$(git rev-list --count origin/main..HEAD)
  behind=$(git rev-list --count HEAD..origin/main)
  echo "Note: local HEAD is not origin/main ($ahead ahead, $behind behind); the local commits will not be released"
fi
if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
  echo "Note: the working tree has uncommitted changes; they will not be released"
fi
echo

# A Release run already going: two runs would compute the same version
# and the second publish fails. "completed" is the only final status.
inflight=$(gh run list -R "$repo" --workflow="$workflow" --limit 10 \
  --json status,createdAt,headSha,url \
  --jq '.[] | select(.status != "completed") | "  \(.status) since \(.createdAt) on \(.headSha[:7])  \(.url)"')
if [ -n "$inflight" ]; then
  echo "Release run already in flight:"
  echo "$inflight"
  blockers+=("a Release run is already in flight; watch it with: gh run watch -R $repo <id> --exit-status")
  echo
fi

# CI on the target commit. The Release workflow repeats typecheck and the
# unit tests, so a red CI here means a red release.
ci=$(gh run list -R "$repo" --workflow="$ci_workflow" --commit "$target" --limit 1 \
  --json status,conclusion,url --jq '.[0] // empty | "\(.status) \(.conclusion) \(.url)"')
if [ -z "$ci" ]; then
  echo "CI: no run found for $target"
  blockers+=("CI has not run on the target commit")
else
  read -r ci_status ci_conclusion ci_url <<< "$ci"
  if [ "$ci_status" != "completed" ]; then
    echo "CI: $ci_status  $ci_url"
    blockers+=("CI is still running on the target commit; wait for it: gh run watch -R $repo ${ci_url##*/} --exit-status")
  else
    echo "CI: $ci_conclusion  $ci_url"
    [ "$ci_conclusion" = "success" ] || blockers+=("CI did not pass on the target commit ($ci_conclusion)")
  fi
fi
echo

# One npm lookup for everything below: the latest version, when each
# version was published, and the version list.
npm_meta=$(npm view "$pkg" dist-tags.latest time versions --json 2>/dev/null) || { echo "Could not read $pkg from npm"; exit 2; }
read -r latest published_at <<< "$(echo "$npm_meta" | node -e '
  const meta = JSON.parse(require("fs").readFileSync(0, "utf8"));
  const latest = meta["dist-tags.latest"];
  console.log(latest, meta.time[latest] ?? "");
')"
[ -n "$published_at" ] || { echo "Could not read the publish time of $pkg@$latest from npm"; exit 2; }

# The previous release. There are no git tags, and a run can publish and
# still end as cancelled or failed, so do not trust run conclusions: find
# the Release run that was going when the latest version was published.
# Trusted publishing means nothing is published outside the workflow.
last=$(gh run list -R "$repo" --workflow="$workflow" --limit 30 \
  --json headSha,url,createdAt,conclusion \
  | PUBLISHED_AT="$published_at" node -e '
    const runs = JSON.parse(require("fs").readFileSync(0, "utf8"));
    const at = Date.parse(process.env.PUBLISHED_AT);
    // The newest run started before the publish, and not more than 30 minutes before.
    const run = runs
      .filter((r) => Date.parse(r.createdAt) <= at && at - Date.parse(r.createdAt) < 30 * 60 * 1000)
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))[0];
    if (run) console.log(run.headSha, run.url, run.conclusion);
  ')
if [ -z "$last" ]; then
  echo "Last release: $latest on npm at $published_at; no Release run matches that time"
  last_sha=""
else
  read -r last_sha last_url last_conclusion <<< "$last"
  echo "Last release: $latest from $(git log -1 --format='%h %s' "$last_sha" 2>/dev/null || echo "${last_sha:0:7} (commit not in this clone)")"
  echo "              $last_url"
  if [ "$last_conclusion" != "success" ]; then
    echo "              (that run ended as $last_conclusion, but npm got the version)"
  fi
fi
echo

# What is new since then.
if [ -n "$last_sha" ] && git cat-file -e "$last_sha^{commit}" 2>/dev/null; then
  if git merge-base --is-ancestor "$last_sha" "$target"; then
    if [ "$last_sha" = "$target" ]; then
      echo "Commits since the last release: none"
      blockers+=("origin/main is the commit already released as $latest; a new version would ship the same code")
    else
      commits=$(git log --format='%h %s' "$last_sha".."$target")
      echo "Commits since the last release ($(echo "$commits" | wc -l | tr -d ' ')):"
      echo "$commits" | sed 's/^/  /'
      breaking=$(echo "$commits" | grep -E '^[0-9a-f]+ [a-z]+(\([^)]*\))?!:' || true)
      if [ -n "$breaking" ]; then
        echo
        echo "Breaking changes (marked with !):"
        echo "$breaking" | sed 's/^/  /'
      fi
    fi
  else
    echo "Commits since the last release: unknown; the last released commit ${last_sha:0:7} is not an ancestor of origin/main"
  fi
else
  echo "Commits since the last release: unknown; check by hand that origin/main has something new before dispatching"
fi
echo

# The version the workflow would pick: year.month.n in UTC, n counting this
# month's releases on npm from 0. Same rule as release.yml, which decides.
expected=$(echo "$npm_meta" | node -e '
  const list = [].concat(JSON.parse(require("fs").readFileSync(0, "utf8")).versions);
  const d = new Date();
  const month = `${d.getUTCFullYear() % 100}.${d.getUTCMonth() + 1}`;
  const prefix = month + ".";
  const ns = list.filter((v) => v.startsWith(prefix) && /^\d+$/.test(v.slice(prefix.length)));
  console.log(`${month}.${Math.max(-1, ...ns.map((v) => Number(v.slice(prefix.length)))) + 1}`);
')
echo "Expected version: $expected (the workflow decides, from the UTC date and npm at run time)"
echo

if [ ${#blockers[@]} -eq 0 ]; then
  echo "OK to dispatch: gh workflow run $workflow -R $repo --ref main"
  exit 0
fi
echo "Do not dispatch:"
for b in "${blockers[@]}"; do echo "  - $b"; done
exit 1
