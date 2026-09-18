import type {
  ClassDeclaration,
  FunctionDeclaration,
  InterfaceDeclaration,
  KindToNodeMappings,
  MethodDeclaration,
  SourceFile,
  TypeAliasDeclaration,
  VariableStatement,
} from 'ts-morph';
import { createRequire } from 'node:module';
import { Project, SyntaxKind } from 'ts-morph';

// CJS default export (message-await) via require so emitted ESM runs under plain node (no tsx/esbuild)
const requireModule = createRequire(import.meta.url);
const messageAwaitMod = requireModule('message-await') as { default?: (...args: unknown[]) => unknown };
const print = (messageAwaitMod.default ?? messageAwaitMod) as (
  message: string,
  options?: { spinner?: boolean }
) => {
  updateMessage: (message: string, force?: boolean) => void;
  complete: (success: boolean, message: string) => void;
};

const APP_REQUEST_MESSAGE = 'AppRequestMessage';
const AGENT_RESPONSE_MESSAGE = 'AgentResponseMessage';
const AGENT_EVENT_MESSAGE = 'AgentEventMessage';

const project = new Project();

// Types + fast (is<X>) predicates: what every internal consumer (fdc3-get-agent, fdc3-agent-proxy,
// fdc3-web-impl) actually uses. Message unions are only meaningful for the browser API schema.
processGeneratedFile({
  typesPath: './generated/api/BrowserTypes.ts',
  validationPath: './generated/api/BrowserTypesValidation.ts',
  generatePredicates: true,
});

processGeneratedFile({
  typesPath: './generated/bridging/BridgingTypes.ts',
  validationPath: './generated/bridging/BridgingTypesValidation.ts',
  generatePredicates: false,
});

project.saveSync();

/**
 * Processes a single quicktype-generated file:
 * - (optionally) rewrites the request/response/event message unions and writes is<X> / isValid<X> / <X>_TYPE
 * - extracts the runtime validation machinery (the `Convert` class, the quicktype helper functions it relies
 *   on, and its type map) into a companion "Validation" file
 *
 * Nothing in this repo uses `isValid<X>` or `Convert` directly - only the `is<X>` fast predicates and the
 * plain interfaces are used internally - but leaving that ~150KB runtime inline made it unavoidably reachable
 * (and therefore un-tree-shakeable) for every consumer of `@finos/fdc3-schema`, including ones that only ever
 * call `getAgent()`. See https://github.com/finos/FDC3/issues/1901.
 */
function processGeneratedFile(options: { typesPath: string; validationPath: string; generatePredicates: boolean }) {
  const { typesPath, validationPath, generatePredicates } = options;
  const sourceFile = project.addSourceFileAtPath(typesPath);

  // Snapshot the runtime pieces quicktype emitted, before this script adds anything of its own.
  const convertClass = sourceFile.getClass('Convert');
  const helperFunctions = sourceFile.getChildrenOfKind(SyntaxKind.FunctionDeclaration);
  const helperVariableStatements = sourceFile.getChildrenOfKind(SyntaxKind.VariableStatement);

  if (generatePredicates) {
    writeMessageUnionTypes(sourceFile);
  }

  if (convertClass != null) {
    // Work out which interfaces/type aliases from the main file the Convert class' method signatures
    // reference, before it (and its text) is moved out - so we can re-import just those into the
    // validation file. Computed from the syntax directly (not ts-morph's fixMissingImports, which uses
    // the language service and chokes on a file this large) so it stays fast and simple.
    const referencedTypeNames = findReferencedTypeNames(sourceFile, convertClass);

    const validationSourceFile = project.createSourceFile(validationPath, '', { overwrite: true });

    if (generatePredicates) {
      writeTypePredicates(sourceFile, validationSourceFile, convertClass);
    }

    moveValidationRuntime(validationSourceFile, convertClass, helperFunctions, helperVariableStatements);

    validationSourceFile.formatText();

    // Inserted as raw leading text (rather than via createSourceFile's initial content, or ts-morph's
    // statement-insertion APIs) because ts-morph's statement-insertion machinery errors on a file this large.
    const typesModuleSpecifier = `./${typesPath.split('/').pop()!.replace(/\.ts$/, '.js')}`;
    const importStatement =
      referencedTypeNames.length > 0
        ? `import type { ${referencedTypeNames.join(', ')} } from '${typesModuleSpecifier}';\n\n`
        : '';
    validationSourceFile.insertText(
      0,
      `${importStatement}/**
 * Runtime validation for the message types in ${typesModuleSpecifier}.
 *
 * Split out from the main generated file so that consumers who only need the message type
 * interfaces and the fast \`is<X>\` predicates (i.e. everyone using getAgent()) don't pull this
 * validation runtime into their bundles. See https://github.com/finos/FDC3/issues/1901.
 */
`
    );
  }

  sourceFile.formatText();
}

/**
 * Replaces the existing interfaces AppRequestMessage, AgentResponseMessage and AgentEventMessage with unions of Interfaces instead of a base type
 */
function writeMessageUnionTypes(sourceFile: SourceFile) {
  const typeAliases = sourceFile.getChildrenOfKind(SyntaxKind.TypeAliasDeclaration);

  writeMessageUnion(sourceFile, APP_REQUEST_MESSAGE, 'RequestMessageType', typeAliases);
  writeMessageUnion(sourceFile, AGENT_RESPONSE_MESSAGE, 'ResponseMessageType', typeAliases);
  writeMessageUnion(sourceFile, AGENT_EVENT_MESSAGE, 'EventMessageType', typeAliases);
}

function writeMessageUnion(
  sourceFile: SourceFile,
  unionName: string,
  typeUnionName: string,
  typeAliases: TypeAliasDeclaration[]
) {
  const awaitMessage = print(`Writing ${unionName} (finding types)`, { spinner: true });

  // get the types listed in the types union type
  // i.e. look for: export type RequestMessageType = "addContextListenerRequest" | "whatever"
  const requestMessageTypeUnion = findUnionType(typeAliases, typeUnionName);
  if (requestMessageTypeUnion != null) {
    //remove existing type alias
    findExisting(sourceFile, unionName, SyntaxKind.TypeAliasDeclaration).forEach(node => node.remove());

    awaitMessage.updateMessage(`Writing ${unionName} (writing union)`, true);

    // Write a union type of all interfaces that have a type that extends RequestMessageType
    // i.e. export type AppRequestMessage = AddContextListenerRequest | AddEventListenerRequest | AddIntentListenerRequest;
    writeUnionType(sourceFile, unionName, requestMessageTypeUnion);
  }

  awaitMessage.complete(true, `Writing ${unionName}`);
}

/**
 * Writes type predicates for all interfaces found that have a matching convert function.
 *
 * The fast `is<X>` predicates and `<X>_TYPE` constants are written to the main types file - they have no
 * runtime dependency on `Convert`. The `isValid<X>` predicates are written to the validation file, since
 * they call into `Convert` for full JSON-schema-shaped validation.
 */
function writeTypePredicates(sourceFile: SourceFile, validationSourceFile: SourceFile, convert: ClassDeclaration) {
  const awaitMessage = print(`Writing Type Predicates (finding convert functions)`, { spinner: true });

  // get a list of all conversion functions in the Convert class that return a string
  const convertFunctions = convert
    .getChildrenOfKind(SyntaxKind.MethodDeclaration)
    .filter(func => func.getReturnType().getText() === 'string');

  awaitMessage.updateMessage(`Writing Type Predicates (finding message interfaces)`, true);

  //get a list of all interfaces in the file
  const messageInterfaces = sourceFile.getChildrenOfKind(SyntaxKind.InterfaceDeclaration);

  // generate a list of Interfaces that have an associated conversion function
  const matchedInterfaces = convertFunctions
    .map(func => {
      const valueParameter = func.getParameter('value');

      const matchingInterface = messageInterfaces.find(interfaceNode => {
        /// Find an interface who's name matches the type passed into the value parameter of the convert function
        return valueParameter?.getType().getText(valueParameter) === interfaceNode.getName();
      });

      if (matchingInterface != null) {
        return { func, matchingInterface };
      }

      return undefined;
    })
    .filter(isDefined);

  const allFunctionDeclarations = sourceFile.getChildrenOfKind(SyntaxKind.FunctionDeclaration);

  // write a type predicate for each matched interface
  matchedInterfaces.forEach((matched, index) => {
    awaitMessage.updateMessage(`Writing Type Predicates (${index}/${matchedInterfaces.length})`, true);

    writeFastPredicate(sourceFile, matched.matchingInterface, allFunctionDeclarations);
    writeValidPredicate(validationSourceFile, matched.matchingInterface, matched.func);
    writeTypeConstant(sourceFile, matched.matchingInterface);
  });

  awaitMessage.complete(true, `Writing Type Predicates`);
}

/**
 * Looks for a string union type in the form:
 * export type NAME = "stringOne" | "stringTwo" | "stringThree";
 * and returns the string values
 * if the union type is not found returns undefined
 * @param name
 * @returns
 */
function findUnionType(typeAliases: TypeAliasDeclaration[], name: string): string[] | undefined {
  const typeAlias = typeAliases.find(alias => {
    const identifiers = alias.getChildrenOfKind(SyntaxKind.Identifier);

    return identifiers[0].getText() === name;
  });

  return typeAlias
    ?.getChildrenOfKind(SyntaxKind.UnionType)?.[0]
    .getDescendantsOfKind(SyntaxKind.StringLiteral)
    .map(literal => literal.getLiteralText());
}

/**
 * Finds an existing declaration with the given type and name
 * @param name
 * @param kind
 * @returns
 */
function findExisting<T extends SyntaxKind>(
  sourceFile: SourceFile,
  name: string,
  kind: T,
  allDeclarationsOfType?: KindToNodeMappings[T][]
) {
  const declarations = allDeclarationsOfType ?? sourceFile.getChildrenOfKind(kind);

  return declarations.filter(child => {
    const identifier = child.getDescendantsOfKind(SyntaxKind.Identifier)[0];

    return identifier?.getText() === name;
  });
}

/**
 * Writes a type predicate for the given interface using the Convert method declaration. Written to the
 * validation file, alongside the `Convert` class it calls into.
 * @param matchingInterface
 * @param func
 */
function writeValidPredicate(
  validationSourceFile: SourceFile,
  matchingInterface: InterfaceDeclaration,
  func: MethodDeclaration
): void {
  const predicateName = `isValid${matchingInterface.getName()}`;

  validationSourceFile.addStatements(`
/**
 * Returns true if value is a valid ${matchingInterface.getName()}. This checks the type against the json schema for the message and will be slower
 */
export function ${predicateName}(value: any): value is ${matchingInterface.getName()} {
    try{
        Convert.${func.getName()}(value);
        return true;
    } catch(_e: any){
        return false;
    }
}`);
}

/**
 * Writes a type predicate for the given interface checking just the value of the type property
 * @param matchingInterface
 * @param func
 */
function writeFastPredicate(
  sourceFile: SourceFile,
  matchingInterface: InterfaceDeclaration,
  allFunctionDeclarations: KindToNodeMappings[SyntaxKind.FunctionDeclaration][]
): void {
  const predicateName = `is${matchingInterface.getName()}`;

  // remove existing instances
  findExisting(sourceFile, predicateName, SyntaxKind.FunctionDeclaration, allFunctionDeclarations).forEach(node =>
    node.remove()
  );

  const typePropertyValue = extractTypePropertyValue(matchingInterface);

  if (typePropertyValue == null) {
    return;
  }

  sourceFile.addStatements(`
/**
 * Returns true if the value has a type property with value '${typePropertyValue}'. This is a fast check that does not check the format of the message
 */
export function ${predicateName}(value: any): value is ${matchingInterface.getName()} {
    return value != null && value.type === '${typePropertyValue}';
}`);
}

function writeTypeConstant(sourceFile: SourceFile, matchingInterface: InterfaceDeclaration): void {
  const constantName = `${matchingInterface
    .getName()
    .replaceAll(/([A-Z])/g, '_$1')
    .toUpperCase()
    .substring(1)}_TYPE`;

  //remove existing
  findExisting(sourceFile, constantName, SyntaxKind.VariableStatement).forEach(node => node.remove());

  sourceFile.addStatements(`
        export const ${matchingInterface
          .getName()
          .replaceAll(/([A-Z])/g, '_$1')
          .toUpperCase()
          .substring(1)}_TYPE = "${matchingInterface.getName()}";`);
}

/**
 * Writes a union type of all the interfaces that have a type property that extends the type values passed in.
 * For example:
 * export type RequestMessage = AddContextListenerRequest | AddEventListenerRequest ...
 * @param unionName
 * @param interfaces
 * @param typeValues
 */
function writeUnionType(sourceFile: SourceFile, unionName: string, typeValues: string[]): void {
  // generate interfaces list again as we may have just removed some
  const unionInterfaces = sourceFile.getChildrenOfKind(SyntaxKind.InterfaceDeclaration);

  // look for interfaces that have a type property that extends one of the values in typeValues
  const matchingInterfaces = unionInterfaces.filter(currentInterface => {
    const typePropertyValue = extractTypePropertyValue(currentInterface);

    return typeValues.some(typeValue => typeValue === typePropertyValue);
  });

  //remove existing Type
  findExisting(sourceFile, unionName, SyntaxKind.InterfaceDeclaration).forEach(node => node.remove());

  sourceFile.addStatements(`
    export type ${unionName} = ${matchingInterfaces.map(match => match.getName()).join(' | ')}; `);
}

/**
 * Finds the interfaces/type aliases declared in `sourceFile` that `convertClass`'s method signatures
 * (parameter and return types) reference by name, so the validation file can import just those.
 */
function findReferencedTypeNames(sourceFile: SourceFile, convertClass: ClassDeclaration): string[] {
  const declaredNames = new Set([
    ...sourceFile.getChildrenOfKind(SyntaxKind.InterfaceDeclaration).map(node => node.getName()),
    ...sourceFile.getChildrenOfKind(SyntaxKind.TypeAliasDeclaration).map(node => node.getName()),
  ]);

  const referenced = new Set<string>();

  convertClass.getMethods().forEach(method => {
    const returnTypeName = method.getReturnTypeNode()?.getText();
    if (returnTypeName != null && declaredNames.has(returnTypeName)) {
      referenced.add(returnTypeName);
    }

    method.getParameters().forEach(param => {
      const paramTypeName = param.getTypeNode()?.getText();
      if (paramTypeName != null && declaredNames.has(paramTypeName)) {
        referenced.add(paramTypeName);
      }
    });
  });

  return [...referenced].sort();
}

/**
 * Moves the `Convert` class and the quicktype runtime helpers/type map it depends on out of the main
 * source file and into the validation file. `remove()`s them from wherever they were captured from
 * (they're always children of the main types file - see the `sourceFile.getChildrenOfKind(...)` calls
 * in `processGeneratedFile`).
 */
function moveValidationRuntime(
  validationSourceFile: SourceFile,
  convertClass: ClassDeclaration,
  helperFunctions: FunctionDeclaration[],
  helperVariableStatements: VariableStatement[]
): void {
  const movedNodes: (ClassDeclaration | FunctionDeclaration | VariableStatement)[] = [
    convertClass,
    ...helperFunctions,
    ...helperVariableStatements,
  ];

  const movedText = movedNodes.map(node => node.getText()).join('\n\n');

  validationSourceFile.addStatements(movedText);

  movedNodes.forEach(node => node.remove());
}

/**
 * Extract the type string constant from an interface such as
 * interface ExampleMessage{
 *     type: "stringConstant";
 * }
 * @param parentInterface
 * @returns
 */
function extractTypePropertyValue(parentInterface: InterfaceDeclaration): string | undefined {
  const typeProperty = parentInterface.getChildrenOfKind(SyntaxKind.PropertySignature).filter(propertySignature => {
    return (
      propertySignature.getChildrenOfKind(SyntaxKind.Identifier).find(identifier => identifier.getText() === 'type') !=
      null
    );
  })[0];

  return typeProperty?.getDescendantsOfKind(SyntaxKind.StringLiteral).map(literal => literal.getLiteralText())[0];
}

/**
 * Type predicate to test that value is defined
 */
function isDefined<T>(value: T | null | undefined): value is T {
  return value != null;
}
