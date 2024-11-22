import { InterfaceDeclaration, MethodDeclaration, Project, SyntaxKind } from "ts-morph"

// open a new project with just BrowserTypes as the only source file 
const project = new Project();
const sourceFile = project.addSourceFileAtPath("./generated/api/BrowserTypes.ts");

const typeAliases = sourceFile.getChildrenOfKind(SyntaxKind.TypeAliasDeclaration);

/**
 * We generate the union types and remove the existing interfaces first so that we are not left with a generated type predicate for the removed base interface
 */

// get the types listed in the types union type
// i.e. look for: export type RequestMessageType = "addContextListenerRequest" | "whatever"
const requestMessageUnion = findUnionType("RequestMessageType");
if(requestMessageUnion != null){
    // Write a union type of all interfaces that have a type that extends RequestMessageType
    writeUnionType("AppRequestMessage", requestMessageUnion);
}

const responseMessageUnion = findUnionType("ResponseMessageType");
if(responseMessageUnion != null){
    writeUnionType("AgentResponseMessage", responseMessageUnion);
}

const eventMessageUnion = findUnionType("EventMessageType");
if(eventMessageUnion != null){
    writeUnionType("AgentEventMessage", eventMessageUnion);
}

// get a list of all conversion functions in the Convert class
const convert = sourceFile.getClass("Convert");
const convertFunctions = (convert?.getChildrenOfKind(SyntaxKind.MethodDeclaration) ?? []).filter(func => func.getReturnType().getText() === "string");


//get a list of all interfaces in the file
let messageInterfaces = sourceFile.getChildrenOfKind(SyntaxKind.InterfaceDeclaration);

// generate a list of Interfaces that have an associated conversion function
const matchedInterfaces = convertFunctions.map(func => {
    const valueParameter = func.getParameter("value");

    const matchingInterface = messageInterfaces.find(interfaceNode => {
        return valueParameter?.getType().getText(valueParameter) === interfaceNode.getName();
    });


    if (matchingInterface != null) {
        return { func, matchingInterface };
    }

    return undefined;
}).filter(((value => value != null) as <T>(value: T | null | undefined) => value is T));

// write a type predicate for each matched interface
matchedInterfaces.forEach(matched => {
    writePredicate(matched.matchingInterface, matched.func)
    writeTypeConstant(matched.matchingInterface)
});


/**
 * Looks for a string union type in the form:
 * export type NAME = "stringOne" | "stringTwo" | "stringThree";
 * and returns the string values
 * if the union type is not found returns undefined
 * @param name 
 * @returns 
 */
function findUnionType(name: string): string[] | undefined {
    const typeAlias = typeAliases.find(alias => {
        const identifiers = alias.getChildrenOfKind(SyntaxKind.Identifier);
    
        return identifiers[0].getText() === name;
    
    });

    return typeAlias?.getChildrenOfKind(SyntaxKind.UnionType)?.[0]
        .getDescendantsOfKind(SyntaxKind.StringLiteral)
        .map(literal => literal.getLiteralText());
}




function findExisting<T extends SyntaxKind>(name: string, kind: T) {
    return sourceFile.getChildrenOfKind(kind).filter(child => {
        const identifier = child.getDescendantsOfKind(SyntaxKind.Identifier)[0];

        return identifier?.getText() === name;
    })
}

function writePredicate(matchingInterface: InterfaceDeclaration, func: MethodDeclaration): void {
    const predicateName = `is${matchingInterface.getName()}`;

    // remove existing instances
    findExisting(predicateName, SyntaxKind.FunctionDeclaration).forEach(node => node.remove());

    sourceFile.addStatements(`
export function ${predicateName}(value: any): value is ${matchingInterface.getName()} {
    try{
        Convert.${func.getName()}(value);
        return true;
    } catch(_e: any){
        return false; 
    }
}`);
}


function writeTypeConstant(matchingInterface: InterfaceDeclaration): void {

    const constantName = `${matchingInterface.getName().replaceAll(/([A-Z])/g, '_$1').toUpperCase().substring(1)}_TYPE`;

    //remove existing
    findExisting(constantName, SyntaxKind.VariableStatement).forEach(node => node.remove());

    sourceFile.addStatements(`
        export const ${matchingInterface.getName().replaceAll(/([A-Z])/g, '_$1').toUpperCase().substring(1)}_TYPE = "${matchingInterface.getName()}";`);

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
        const typeProperty = currentInterface.getChildrenOfKind(SyntaxKind.PropertySignature).filter(propertySignature => {
            return propertySignature.getChildrenOfKind(SyntaxKind.Identifier).find(identifier => identifier.getText() === "type") != null;
        })[0];

        if(typeProperty == null){
            return false;
        }

        const stringLiterals = typeProperty.getDescendantsOfKind(SyntaxKind.StringLiteral)
            .map(literal => literal.getLiteralText());

        return stringLiterals.some(literal => typeValues.some(typeValue => typeValue === literal));
    })
    
    //remove existing Type
    findExisting(unionName, SyntaxKind.InterfaceDeclaration).forEach(node => node.remove());

    sourceFile.addStatements(`
    export type ${unionName} = ${matchingInterfaces.map(match => match.getName()).join(" | ")}; `);
}

sourceFile.formatText();

project.saveSync();
