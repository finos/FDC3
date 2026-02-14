import {
  InterfaceDeclaration,
  KindToNodeMappings,
  MethodDeclaration,
  Project,
  SyntaxKind,
  TypeAliasDeclaration,
} from 'ts-morph';
import messageAwait from 'message-await';

// Normalise export of message-await so it works with tsx and ts-node
const print: typeof messageAwait = (messageAwait as any).default ?? messageAwait;

// open a new project with just BrowserTypes as the only source file
const project = new Project();
const sourceFile = project.addSourceFileAtPath('./generated/api/BrowserTypes.ts');

const APP_REQUEST_MESSAGE = 'AppRequestMessage';
const AGENT_RESPONSE_MESSAGE = 'AgentResponseMessage';
const AGENT_EVENT_MESSAGE = 'AgentEventMessage';

/**
 * We generate the union types and remove the existing interfaces first so that we are not left with a generated type predicate for the removed base interface
 */
writeMessageUnionTypes();
writeTypePredicates();

sourceFile.formatText();
project.saveSync();

/**
 * Replaces the existing interfaces AppRequestMessage, AgentResponseMessage and AgentEventMessage with unions of INterfaces instead of a base type
 */
function writeMessageUnionTypes() {
  const typeAliases = sourceFile.getChildrenOfKind(SyntaxKind.TypeAliasDeclaration);

  writeMessageUnion(APP_REQUEST_MESSAGE, 'RequestMessageType', typeAliases);
  writeMessageUnion(AGENT_RESPONSE_MESSAGE, 'ResponseMessageType', typeAliases);
  writeMessageUnion(AGENT_EVENT_MESSAGE, 'EventMessageType', typeAliases);
}

function writeMessageUnion(unionName: string, typeUnionName: string, typeAliases: TypeAliasDeclaration[]) {
  let awaitMessage = print(`Writing ${unionName} (finding types)`, { spinner: true });

  // get the types listed in the types union type
  // i.e. look for: export type RequestMessageType = "addContextListenerRequest" | "whatever"
  const requestMessageTypeUnion = findUnionType(typeAliases, typeUnionName);
  if (requestMessageTypeUnion != null) {
    //remove existing type alias
    findExisting(unionName, SyntaxKind.TypeAliasDeclaration).forEach(node => node.remove());

    awaitMessage.updateMessage(`Writing ${unionName} (writing union)`, true);

    // Write a union type of all interfaces that have a type that extends RequestMessageType
    // i.e. export type AppRequestMessage = AddContextListenerRequest | AddEventListenerRequest | AddIntentListenerRequest;
    writeUnionType(unionName, requestMessageTypeUnion);
  }

  awaitMessage.complete(true, `Writing ${unionName}`);
}

/**
 * Writes type predicates for all interfaces found that have a matching convert function
 */
function writeTypePredicates() {
  let awaitMessage = print(`Writing Type Predicates (finding convert functions)`, { spinner: true });

  // get a list of all conversion functions in the Convert class that return a string
  const convert = sourceFile.getClass('Convert');
  const convertFunctions = (convert?.getChildrenOfKind(SyntaxKind.MethodDeclaration) ?? []).filter(
    func => func.getReturnType().getText() === 'string'
  );

  awaitMessage.updateMessage(`Writing Type Predicates (finding message interfaces)`, true);

  //get a list of all interfaces in the file
  let messageInterfaces = sourceFile.getChildrenOfKind(SyntaxKind.InterfaceDeclaration);

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

    writeFastPredicate(matched.matchingInterface, allFunctionDeclarations);
    writeValidPredicate(matched.matchingInterface, matched.func, allFunctionDeclarations);
    writeTypeConstant(matched.matchingInterface);
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
function findExisting<T extends SyntaxKind>(name: string, kind: T, allDeclarationsOfType?: KindToNodeMappings[T][]) {
  allDeclarationsOfType = allDeclarationsOfType ?? sourceFile.getChildrenOfKind(kind);

  return sourceFile.getChildrenOfKind(kind).filter(child => {
    const identifier = child.getDescendantsOfKind(SyntaxKind.Identifier)[0];

    return identifier?.getText() === name;
  });
}

/**
 * Writes a type predicate for the given interface using the Convert method declaration
 * @param matchingInterface
 * @param func
 */
function writeValidPredicate(
  matchingInterface: InterfaceDeclaration,
  func: MethodDeclaration,
  allFunctionDeclarations: KindToNodeMappings[SyntaxKind.FunctionDeclaration][]
): void {
  const predicateName = `isValid${matchingInterface.getName()}`;

  // remove existing instances
  findExisting(predicateName, SyntaxKind.FunctionDeclaration, allFunctionDeclarations).forEach(node => node.remove());

  sourceFile.addStatements(`
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
  matchingInterface: InterfaceDeclaration,
  allFunctionDeclarations: KindToNodeMappings[SyntaxKind.FunctionDeclaration][]
): void {
  const predicateName = `is${matchingInterface.getName()}`;

  // remove existing instances
  findExisting(predicateName, SyntaxKind.FunctionDeclaration, allFunctionDeclarations).forEach(node => node.remove());

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

function writeTypeConstant(matchingInterface: InterfaceDeclaration): void {
  const constantName = `${matchingInterface
    .getName()
    .replaceAll(/([A-Z])/g, '_$1')
    .toUpperCase()
    .substring(1)}_TYPE`;

  //remove existing
  findExisting(constantName, SyntaxKind.VariableStatement).forEach(node => node.remove());

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
function writeUnionType(unionName: string, typeValues: string[]): void {
  // generate interfaces list again as we may have just removed some
  const unionInterfaces = sourceFile.getChildrenOfKind(SyntaxKind.InterfaceDeclaration);

  // look for interfaces that have a type property that extends one of the values in typeValues
  const matchingInterfaces = unionInterfaces.filter(currentInterface => {
    const typePropertyValue = extractTypePropertyValue(currentInterface);

    return typeValues.some(typeValue => typeValue === typePropertyValue);
  });

  //remove existing Type
  findExisting(unionName, SyntaxKind.InterfaceDeclaration).forEach(node => node.remove());

  sourceFile.addStatements(`
    export type ${unionName} = ${matchingInterfaces.map(match => match.getName()).join(' | ')}; `);
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
