// Keeps the stylesheets in sync with the token tables in docs/.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");
const docs = (name: string) => read(`../../../docs/${name}`);
const tokensCss = read("../src/styles/tokens.css");
const stylesCss = read("../src/styles/styles.css");

const themes = ["light", "dark", "contrast"] as const;
type Theme = (typeof themes)[number];

const normalize = (value: string) => value.replace(/`/g, "").replace(/\s+/g, " ").replace(/\s*,\s*/g, ",").trim();

/** Custom properties declared in each rule of a stylesheet, keyed by selector. */
function rules(css: string) {
  const out = new Map<string, Map<string, string>>();
  const source = css.replace(/\/\*[\s\S]*?\*\//g, "");
  for (const [, selector, body] of source.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const declarations = new Map<string, string>();
    for (const [, name, value] of body.matchAll(/([\w-]+)\s*:\s*([^;]+);/g)) declarations.set(name, value.trim());
    out.set(normalize(selector), declarations);
  }
  return out;
}

const tokenRules = rules(tokensCss);
const themeRule: Record<Theme, Map<string, string>> = {
  light: tokenRules.get(':where(:root,:host,.mu-root:not([data-theme] *)),[data-theme="light"]')!,
  dark: tokenRules.get('[data-theme="dark"]')!,
  contrast: tokenRules.get('[data-theme="contrast"]')!,
};
const staticRule = tokenRules.get(":where(:root,:host,.mu-root)")!;

/** Rows of every Markdown table whose first cell is a backticked token name. */
function tableRows(markdown: string) {
  return markdown
    .split("\n")
    .filter((line) => /^\| `[\w-]+` \|/.test(line))
    .map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()));
}

describe("tokens.css", () => {
  it("declares every theme", () => {
    for (const theme of themes) expect(themeRule[theme], theme).toBeDefined();
    expect(staticRule).toBeDefined();
  });

  it("matches the color tokens in docs/color.md", () => {
    const rows = tableRows(docs("color.md"));
    expect(rows.length).toBeGreaterThan(20);
    for (const [name, light, dark, contrast] of rows) {
      const token = `--${name.replace(/`/g, "")}`;
      const expected = { light, dark, contrast };
      for (const theme of themes) {
        expect(normalize(themeRule[theme].get(token) ?? ""), `${token} in ${theme}`).toBe(normalize(expected[theme]));
      }
    }
    const documented = new Set(rows.map(([name]) => `--${name.replace(/`/g, "")}`));
    for (const theme of themes) {
      const colors = [...themeRule[theme].keys()].filter((name) => name.startsWith("--") && !name.startsWith("--shadow-"));
      expect(colors.filter((name) => !documented.has(name)), `undocumented colors in ${theme}`).toEqual([]);
    }
  });

  it("matches the shadow tokens in docs/depth.md", () => {
    const depth = docs("depth.md");
    const names = { light: "Light", dark: "Dark", contrast: "High contrast" };
    for (const theme of themes) {
      const block = depth.match(new RegExp(`### ${names[theme]}\\n\\n\`\`\`css\\n([\\s\\S]*?)\`\`\``))?.[1];
      expect(block, theme).toBeDefined();
      const shadows = [...block!.matchAll(/(--shadow-[\w-]+):\s*([^;]+);/g)];
      expect(shadows).toHaveLength(5);
      for (const [, name, value] of shadows) {
        expect(normalize(themeRule[theme].get(name) ?? ""), `${name} in ${theme}`).toBe(normalize(value));
      }
    }
  });

  it("matches the size, spacing, radius, layout, layer and motion tokens in the docs", () => {
    const rows = [...tableRows(docs("layout.md")), ...tableRows(docs("motion.md"))];
    expect(rows.length).toBeGreaterThan(30);
    for (const [name, value] of rows) {
      const token = `--${name.replace(/`/g, "")}`;
      expect(normalize(staticRule.get(token) ?? ""), token).toBe(normalize(value));
    }
  });

  it("matches the font stacks in docs/typography.md", () => {
    const rows = docs("typography.md")
      .split("\n")
      .filter((line) => /^\| `--font-/.test(line))
      .map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()));
    expect(rows).toHaveLength(2);
    for (const [name, stack] of rows) {
      expect(normalize(staticRule.get(name.replace(/`/g, "")) ?? ""), name).toBe(normalize(stack));
    }
  });
});

describe("styles.css", () => {
  const styleRules = rules(stylesCss);

  it("has a class for every type style in docs/typography.md", () => {
    const rows = tableRows(docs("typography.md")).filter(([name]) => !name.startsWith("`--"));
    expect(rows).toHaveLength(13);
    for (const row of rows) {
      const name = row[0].replace(/`/g, "");
      const [size, line] = row[1].replace("px", "").split("/").map((part) => `${part.trim()}px`);
      const rule = styleRules.get(`.mu-${name}`);
      expect(rule, name).toBeDefined();
      expect(rule!.get("font-size"), name).toBe(size);
      expect(rule!.get("line-height"), name).toBe(line);
      expect(rule!.get("font-weight"), name).toBe(row[2]);
      // Headings list letter spacing (with a typographic minus) and optical size.
      if (row.length === 6) {
        const spacing = row[3].replace("−", "-");
        expect(rule!.get("letter-spacing") ?? "0", name).toBe(spacing);
        const opsz = rule!.get("font-variation-settings");
        expect(opsz ? opsz.replace(/\D/g, "") : "text", name).toBe(row[4]);
      }
    }
  });

  it("only uses classes that start with mu-", () => {
    const classes = [...stylesCss.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/\.([a-zA-Z][\w-]*)/g)].map(([, name]) => name);
    expect(classes.filter((name) => !name.startsWith("mu-") && name !== "lucide")).toEqual([]);
  });
});
