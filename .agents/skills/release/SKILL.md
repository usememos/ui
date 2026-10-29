---
name: release
description: Publish a new version of @usememos/ui to npm by running the Release workflow on main. Checks CI, shows what will ship and the expected version, asks for a go-ahead, dispatches the workflow and reports the published version.
argument-hint: "[--dry-run | --yes]"
allowed-tools: Bash(bash ${CLAUDE_SKILL_DIR}/scripts/preflight.sh*), Bash(gh run *), Bash(gh workflow run *), Bash(git fetch *), Bash(npm view *)
---

# Release

Publish `@usememos/ui` by running the Release workflow (`.github/workflows/release.yml`) on `main`. The workflow owns the version (CalVer `year.month.n`, see "Releasing" in `AGENTS.md`), the tests and the publish. This skill only decides whether to start it, starts it, and reports what came out. Nothing is ever published from this machine: trusted publishing works only from the workflow.

Arguments: `$ARGUMENTS`

- `--dry-run`: stop after the preflight report.
- `--yes`: skip the confirmation in step 2.

## 1. Preflight

Run the preflight script and show its output to the user:

```sh
bash ${CLAUDE_SKILL_DIR}/scripts/preflight.sh
```

It fetches `origin/main` (the commit the workflow releases, whatever is checked out locally), checks that CI passed on it, that no Release run is already in flight, finds the last released commit from the last successful Release run, lists the commits since, flags `!` breaking commits, and predicts the version.

- Exit 0: continue.
- Exit 1: do not dispatch. Tell the user the reasons the script printed. If a Release run is in flight, offer to watch it instead (step 3 from "Watch"). If CI is still running, offer to wait for it and run the preflight again.
- Exit 2: a tool or login is missing. Say what, and stop.

With `--dry-run`, stop here.

## 2. Confirm

Summarize in a few lines: the target commit, the expected version, the number of commits and the breaking ones, then ask for a yes. Wait for it. An npm publish cannot be undone, so never skip this because the session is autonomous. Only `--yes` skips it.

## 3. Dispatch and watch

Dispatch:

```sh
gh workflow run release.yml -R usememos/ui --ref main
```

`gh workflow run` does not print the run id. Find it by listing runs until one appears that was created after the dispatch (retry a few times a few seconds apart):

```sh
gh run list -R usememos/ui --workflow=release.yml --limit 1 --json databaseId,status,createdAt,url
```

Watch it in the background; it takes one to two minutes:

```sh
gh run watch -R usememos/ui <id> --exit-status
```

## 4. Report

On success, read the version from the run log and confirm npm has it. The registry can lag by a few seconds, so retry `npm view` a few times, ten seconds apart:

```sh
gh run view -R usememos/ui <id> --log | grep -E 'Publishing |\+ @usememos/ui@'
npm view @usememos/ui version
```

Report:

- the published version and `https://www.npmjs.com/package/@usememos/ui/v/<version>`
- the run URL
- the commits it includes, from the preflight output

On failure, show the failing step:

```sh
gh run view -R usememos/ui <id> --log-failed
```

Say plainly whether anything was published. If the failed step comes before `npm publish` (version, typecheck or tests), nothing shipped and `main` is unchanged, so fixing the cause and running `/release` again is safe. If `npm publish` itself failed, check `npm view @usememos/ui version` before saying either way.

## Not part of a release

No git tag, no GitHub release, no changelog, no version bump in `package.json` (it stays `0.0.0` in the repo). Apps pin an exact version; `!` in commit summaries marks what breaks.
