import { resolve } from 'node:path';
import ts from 'typescript';

/** Props declared by this package, including inherited local interfaces and union branches. */
export function publicComponentProps() {
  const entry = resolve(__dirname, '../src/index.ts');
  const program = ts.createProgram([entry], {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    jsx: ts.JsxEmit.ReactJSX,
    skipLibCheck: true,
    strict: true,
  });
  const checker = program.getTypeChecker();
  const source = program.getSourceFile(entry)!;
  const inventory: Record<string, string[]> = {};
  const visit = (symbol: ts.Symbol, name: string) => {
    if (symbol.flags & ts.SymbolFlags.Alias) symbol = checker.getAliasedSymbol(symbol);
    if (!symbol.valueDeclaration) return;
    const type = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
    const signature = type.getCallSignatures()[0];
    if (signature) {
      const parameter = signature.getParameters()[0];
      if (!parameter) return;
      const props = checker.getTypeOfSymbolAtLocation(parameter, parameter.valueDeclaration ?? symbol.valueDeclaration);
      const selected = new Set<string>();
      const collectPickedProps = (node: ts.Node) => {
        if (ts.isTypeReferenceNode(node) && node.typeName.getText() === 'Pick' && node.typeArguments?.[1]) {
          const keys = checker.getTypeFromTypeNode(node.typeArguments[1]);
          for (const key of keys.isUnion() ? keys.types : [keys]) {
            if (key.isStringLiteral()) selected.add(key.value);
          }
        }
        ts.forEachChild(node, collectPickedProps);
      };
      if (name.endsWith('.Popup')) collectPickedProps(symbol.valueDeclaration.getSourceFile());
      inventory[name] = checker.getPropertiesOfType(props).filter((prop) => prop.declarations?.some((declaration) =>
        declaration.getSourceFile().fileName.includes('/packages/ui/src/components/'),
      ) || selected.has(prop.name)).map((prop) => prop.name).sort();
    } else if (symbol.flags & ts.SymbolFlags.Module) {
      for (const part of checker.getExportsOfModule(symbol)) {
        if (/^[A-Z]/.test(part.name)) visit(part, `${name}.${part.name}`);
      }
    }
  };
  for (const component of checker.getExportsOfModule(checker.getSymbolAtLocation(source)!)) {
    if (/^[A-Z]/.test(component.name)) visit(component, component.name);
  }
  return inventory;
}

/** Explicit JSX inputs exercised in a component suite; behavior is asserted by the neighboring tests. */
export function exercisedProps(source: string) {
  const file = ts.createSourceFile('props.test.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const exercised = new Set<string>();
  const visit = (node: ts.Node) => {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const name = node.tagName.getText(file);
      exercised.add(`${name}.__rendered`);
      for (const prop of node.attributes.properties) {
        if (ts.isJsxAttribute(prop)) exercised.add(`${name}.${prop.name.getText(file)}`);
      }
      if (ts.isJsxOpeningElement(node) && ts.isJsxElement(node.parent) && node.parent.children.some((child) =>
        !ts.isJsxText(child) || child.text.trim().length > 0,
      )) exercised.add(`${name}.children`);
    }
    ts.forEachChild(node, visit);
  };
  visit(file);
  return exercised;
}
