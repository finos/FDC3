import { InterfaceDeclaration, MethodDeclaration, Project, SyntaxKind } from "ts-morph"

// open a new project with just BrowserTypes as the only source file 
const project = new Project();
const sourceFile = project.addSourceFileAtPath("./generated/api/BrowserTypes.ts")

//get a list of all interfaces in the file
const interfaces = sourceFile.getChildrenOfKind(SyntaxKind.InterfaceDeclaration);

// get a list of all conversion functions in the Convert class
const convert = sourceFile.getClass("Convert");
const convertFunctions = (convert?.getChildrenOfKind(SyntaxKind.MethodDeclaration) ?? []).filter(func => func.getReturnType().getText() === "string");

// generate a list of Interfaces that have an associated conversion function
const matchedInterfaces = convertFunctions.map(func => {
    const valueParameter = func.getParameter("value");

    const matchingInterface = interfaces.find(interfaceNode => {
        return valueParameter?.getType().getText(valueParameter) === interfaceNode.getName();
    });


    if (matchingInterface != null) {
        return { func, matchingInterface };
    }

    return undefined;
}).filter(((value => value != null) as <T>(value: T | null | undefined) => value is T));

// write a type predicate for each matched interface
matchedInterfaces.forEach(matched => writePredicate(matched.matchingInterface, matched.func));

writeUnionType("RequestMessage", interfaces, "Request");
writeUnionType("ResponseMessage", interfaces, "Response");
writeUnionType("EventMessage", interfaces, "Event");

function writePredicate(matchingInterface: InterfaceDeclaration, func: MethodDeclaration): void {
    const predicateName = `is${matchingInterface.getName()}`;

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



function writeUnionType(unionName: string, interfaces: InterfaceDeclaration[], nameEndsWith: string): void {
    const matchingInterfaces = interfaces
        .map(currentInterface => currentInterface.getName())
        .filter(interfaceName => interfaceName.length > nameEndsWith.length && interfaceName.indexOf(nameEndsWith) === interfaceName.length - nameEndsWith.length);

    sourceFile.addStatements(`
export type ${unionName} = ${matchingInterfaces.join(" | ")};`);
}

sourceFile.formatText();

project.saveSync();
