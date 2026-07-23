const fse = require('fs-extra');
const yaml = require('js-yaml');
const path = require('path');



function processProperty(propertyName, propertyDetails, required, currentSchemaFilePath, wrapInDetails = true) {
    let markdownContent = '';

    if (propertyName === 'type') {
        //skip rendering the type property as it should be rendered at the top level
        return markdownContent;
    }   
    
    if (wrapInDetails) { markdownContent += "<details>\n" };
    markdownContent += `  <summary><code>${propertyName}</code>${required ? " <strong>(required)</strong>" : ""}</summary>\n\n`;
    
    //Note this block doesn't support inline property definitions... only base types and references, 
    //  it will not render an object or array defined inline beyond stating that it is one
    if (propertyDetails.type) {
        //if enum doesn't exist, its ignored
        markdownContent += renderType(propertyDetails.type, propertyDetails.enum) + "\n";

        if (propertyDetails.type == "object") {
            if (propertyDetails.properties && Object.entries(propertyDetails.properties).length > 0) {
                markdownContent += '**Subproperties:**\n\n';
                
                for (const [subpropertyName, subpropertyDetails] of Object.entries(propertyDetails.properties)) {
                    let subPropRequired = propertyDetails?.required?.includes(subpropertyName) ?? false;
                    markdownContent += processProperty(subpropertyName, subpropertyDetails, subPropRequired, currentSchemaFilePath);
                };
            } else if (propertyDetails.additionalProperties && Object.entries(propertyDetails.additionalProperties).length > 0) {
                markdownContent += processProperty("Additional Properties", propertyDetails.additionalProperties, false, currentSchemaFilePath);
            } else {
                console.warn(`    No sub or additional properties defined for object property ${propertyName}`);
            }
        } else if (propertyDetails.type == "array") {
            if (propertyDetails.items) {
                markdownContent += processProperty("Items", propertyDetails.items, false, currentSchemaFilePath);
            } else {
                console.warn(`    No type defined for array ${propertyName} items, property details:\n${JSON.stringify(propertyDetails, null, 2)}`);
            }
        }
    } else if (propertyDetails.$ref) {
        markdownContent += renderRef(propertyDetails.$ref, currentSchemaFilePath) + "\n";
    } else if (propertyDetails.oneOf || propertyDetails.anyOf || propertyDetails.allOf) {
        //this block assumes composite properties are composed base types or references, doesn't support inline object or array definitions
        markdownContent += `${propertyDetails.oneOf ? "**One of:**" : propertyDetails.anyOf ? "**Any of:**" : propertyDetails.allOf ? "**All of:**" : ""}\n\n`;
        const typeArr = propertyDetails.oneOf ?? propertyDetails.anyOf ?? propertyDetails.allOf;
        markdownContent += `${typeArr.map((item) => {
            if (item.type){
                //if enum doesn't exist its ignored
                return "- " + renderType(item.type, item.enum);
            } else if (item.$ref) {
                return "- " + renderRef(item.$ref, currentSchemaFilePath);
            } else {
                console.warn(`    Failed to determine property type for composite property ${propertyName}, property details:\n${JSON.stringify(propertyDetails, null, 2)}`);
            }
        }).join('')}\n`;
    } else {
        console.warn(`    Failed to determine property type for ${propertyName}, property details:\n${JSON.stringify(propertyDetails, null, 2)}`);
    }

    if (propertyDetails.description != null) {
        markdownContent += `${escapeExperimental(propertyDetails.description)}\n\n`;
    }

    if (propertyDetails.examples) {
        propertyDetails.examples.forEach((example) => {
            markdownContent += `\n**Example**: \n\n`;
            markdownContent += `\`\`\`js\n${JSON.stringify(example, null, 2)}\n\`\`\`\n\n`;
        });
    }

    if (wrapInDetails) { markdownContent += "</details>" }
    markdownContent += "\n\n";
    
    return markdownContent;
}

function renderType(type, optionalEnum) {
    if (optionalEnum) {
        return `**type**: \`${type}\` with values:\n${optionalEnum.map((item) => `- \`${item}\``).join(',\n')}\n`;
    } else {
        return `**type**: \`${type}\`\n`;
    }
}

function renderEnum(ref) {
    // for each item in ref, wrap it in backticks and join with a comma
    return `**possible values**:\n${ref.map((item) => `- \`${item}\``).join(',\n')}\n`;
}

function renderRef(contextRef, currentSchemaFilePath) {
    //There are three main types of refs to handle:
    // - refs to internal definitions
    // - refs to other context schemas
    // - refs to API types
    //References should be treated like URLs, they are either resolved absolutely, relatively or relative to the current doc's root
    //  most refs in current context docs are relative, but we can't assume they always will be
    //  We may also being dealing with definitions with the current file or other files.

    //Examples:
    // - ../api/api.schema.json#/definitions/AppIdentifier
    // - #/$defs/AgentResponseMeta
    // - instrument.schema.json
    // - context.schema.json#/definitions/BaseContext

    const [filePath, objectPath] = contextRef.split('#'); // ../api/api.schema.json, /definitions/AppIdentifier
    let schemaData = null;
    let standardPart = null;
    if (!filePath && objectPath) {
        //its a path inside the current file
        schemaData = retrieveSchemaFile(currentSchemaFilePath);

        //render the content as it won't have its own page
        const referencedSchemaData = retrievePathInSchema(schemaData, objectPath);
        const referencedTitle = referencedSchemaData.title ?? "";
        
        return processProperty(referencedTitle, referencedSchemaData, false, currentSchemaFilePath, false);

    } else {
        //its a ref to a different file
        schemaData = retrieveSchemaFile(filePath, currentSchemaFilePath);

        //determine if the reference is to a different section, e.g. to the API schemas
        standardPart = retrieveFolderName(filePath);

        const title = retrieveTitleFromSchemaData(schemaData,objectPath);
        const outputDocName = `${title.replace(/\s+/g, '')}`;

        if (!standardPart) {
            //its either in an unknown part or the current part of the Standard

            //handle the generic Context type as it doesn't have a reference page
            if (title == "Context"){
                return `**type**: [Context](/docs/next/context/spec#the-context-interface)\n\n`;
            } else {
                return `**type**: [${title}](${outputDocName})\n`;
            }
        } else if (standardPart === "api") {
            //link to the unified Types page with an anchor for the specific type
            const anchor = title.toLowerCase().replace(/\s+/g, '-');
            return `**type**: [${title}](/docs/next/api/ref/Types#${anchor})\n`;
        } else {
            //custom handling for other standard parts...
            return `**type**: ${standardPart}/${title}\n`;
        }
    }
    
    
}

function hasAllOf(allOfArray) {
    return Array.isArray(allOfArray) && 
        allOfArray.length > 0 && 
        allOfArray[0] != null && 
        allOfArray[0].properties != null
}

/**
 * Extract category from a context type string.
 * E.g., "fdc3.security.userRequest" -> "security"
 *       "fdc3.chat.message" -> "chat"
 *       "fdc3.contact" -> null (no subcategory)
 * 
 * @param {string} typeString - The context type (e.g., "fdc3.security.userRequest")
 * @returns {string|null} - The category name or null if no subcategory
 */
function extractCategoryFromType(typeString) {
    if (!typeString) return null;
    
    // Match patterns like fdc3.category.* where category has subcontent
    const match = typeString.match(/^fdc3\.([a-z]+)\..+$/i);
    if (match) {
        return match[1]; // e.g., "security", "chat"
    }
    return null;
}

function hasProperties(schema) {
    return schema.properties != null;
}

// Function to generate Markdown content from JSON schema
function generateObjectMD(schema, objectName, schemaFolderName, filePath) {
    //If the schema doesn't contain a title, 
    // it may have been embedded in a definition who's name would have been passed in
    title = schema.title ?? objectName;

    let markdownContent = `# ${title}\n\n`;

    if (schema.description != null) {
        markdownContent += `${escapeExperimental(schema.description)}\n\n`; 
    }

    //If the schema has a top level enum (e.g. API error schemas) then it needs rendering here.
    if (schema.enum) {
        markdownContent += renderEnum(schema.enum) + "\n";
    }

    //if working on windows you may have the wrong slashes...
    const workingPath = filePath.replaceAll("\\","/");
    const url = schema.$id;
    const docusaurusUrl = url.replace("https://fdc3.finos.org", "pathname://");
    const githubUrl = workingPath.includes('context') 
        ? workingPath.replace("static/schemas/next/", `https://github.com/finos/FDC3/tree/main/packages/fdc3-context/schemas/`)
        : workingPath.replace("static/schemas/next/", `https://github.com/finos/FDC3/tree/main/packages/fdc3-schema/schemas/`);

        markdownContent += `## Schema\n\n[${url}](${docusaurusUrl}) ([github](${githubUrl}))\n\n`;

    if (hasAllOf(schema.allOf) || hasProperties(schema)) {
        // Extract properties, required fields, and $ref from the first allOf object
        let root = schema;
        if (hasAllOf(schema.allOf)) {
            root = schema.allOf[0];
        }
        
        const properties = root.properties;
        const requiredProperties = root.required;
        const typeString = properties?.type?.const;
        const ref = root.$ref;
                
        markdownContent += `## Type\n\n`;
        markdownContent += `\`${typeString}\`\n\n`;
        markdownContent += `## Properties\n\n`; 

        for (const [propertyName, propertyDetails] of Object.entries(properties)) {
            if (propertyName != "type"){
                const required = !!requiredProperties?.includes(propertyName);
                markdownContent += processProperty(propertyName, propertyDetails, required, workingPath);
            }
        }

        if (ref) {
            markdownContent += `ref: ${ref}\n\n`;
        }

        if (schema.examples && schema.examples.length > 0) {
            if (schema.examples.length > 1) {
                markdownContent += `## Examples\n\n`;
            } else {
                markdownContent += `## Example\n\n`;
            }
            
            schema.examples.forEach((example) => {
                markdownContent += '```json\n';
                markdownContent += JSON.stringify(example, null, 2);
                markdownContent += '\n```\n\n';
            });
        }

        const frontMatter = generateFrontMatter(title, schema.description);

        // outputDocName must not contain any spaces
        const outputDocName = `${title.replace(/\s+/g, '')}`;
        
        // Check if this context belongs to a subcategory
        const category = extractCategoryFromType(typeString);
        
        let outputDocsPath, outputFilePath;
        if (category) {
            outputDocsPath = `${schemaFolderName}/ref/${category}/${outputDocName}`;
            outputFilePath = `./docs/${schemaFolderName}/ref/${category}/${outputDocName}.md`;
        } else {
            outputDocsPath = `${schemaFolderName}/ref/${outputDocName}`;
            outputFilePath = `./docs/${schemaFolderName}/ref/${outputDocName}.md`;
        }

        fse.outputFileSync(outputFilePath, `---\n${yaml.dump(frontMatter)}\n---\n\n${markdownContent}`);

        return { path: outputDocsPath, category: category, title: title };
    }
}

function escapeExperimental(text) {
    return text.replace(/@experimental/g, '[@experimental](/docs/fdc3-compliance#experimental-features)');
}

function generateFrontMatter(title, description) {
    return {
        title: title,
        sidebar_label: title,
    };
}

function processSchemaFile(schemaFile, schemaFolderName) {
    const schemaData = fse.readJSONSync(schemaFile);

    // if there is allOf, then it is an object
    const allOfArray = schemaData.allOf;
    let sidebarItems = [];
    if (Array.isArray(allOfArray) && allOfArray.length > 0) {
        const result = generateObjectMD(schemaData, null, schemaFolderName, schemaFile);
        if (result) sidebarItems.push(result);
    }
    if (schemaData.definitions) {
        for (const [objectName, objectDetails] of Object.entries(schemaData.definitions)) {
            const result = generateObjectMD(objectDetails, objectName, schemaFolderName, schemaFile);
            if (result) sidebarItems.push(result);
        }
    }

    return sidebarItems;
}
/**
 * Given a path to a schema file, retrieves the schema file contents.
 * If a currentFilePath is specified the path is resolved relative to it 
 * (as it is assumed that the path to be resolved is relative to that file).
 * 
 * Does not support retrieving schemas via a full URL.
 * 
 * @param {string} schemaFilePath 
 * @param {string} currentFilePath 
 * @returns Contents of the referenced schema file
 */
function retrieveSchemaFile (schemaFilePath, currentFilePath) {
    let resolvedPath = schemaFilePath;

    if (currentFilePath) {
        //resolve the file path relative to the current file
        const currentFilePathData = path.parse(currentFilePath);
        const schemaFilePathData = path.parse(schemaFilePath);
        const pathComponents = [];
        if (currentFilePathData.dir) {pathComponents.push(currentFilePathData.dir);}
        if (schemaFilePathData.dir) {pathComponents.push(schemaFilePathData.dir);}
        pathComponents.push(schemaFilePathData.base);
        resolvedPath = path.join(...pathComponents);
    }
    
    //read the file
    return fse.readJSONSync(resolvedPath);
}

function retrieveFolderName (schemaFilePath) {
    const schemaFilePathData = path.parse(schemaFilePath);
    //fix windows paths
    const workingPath = schemaFilePathData.dir.replaceAll("\\","/");
    const parts = workingPath.split("/");
    return parts[parts.length-1];
}

/**
 * Retrieve the content at a particular path in a schema object.
 * @param {*} schemaData 
 * @param {*} pathInSchema 
 * @returns 
 */
function retrievePathInSchema(schemaData, pathInSchema) {
    let outputData = schemaData;
    const pathComponents = pathInSchema.split("/");
    pathComponents.forEach((component) => {
        if (component && outputData) { outputData = outputData[component]; }
    });
    if (!outputData){
        console.error(`    Failed to retrieve path: ${pathInSchema} from schema data: ${JSON.stringify(schemaData, null, 2)}`);
    }
    return outputData;
}

/**
 * Retrieves the title element from a schema object, with an optional path 
 * (e.g. to a definition) within that schema.
 * @param {*} schemaData 
 * @param {*} pathInSchema 
 * @returns 
 */
function retrieveTitleFromSchemaData(schemaData, pathInSchema) {
    //if a path within the schema was specified, navigate to it
    if (pathInSchema){
        schemaData = retrievePathInSchema(schemaData, pathInSchema);
    }
    
    if (schemaData?.title) {
        return schemaData.title;
    } else {
        if (pathInSchema) {
            console.warn(`    Reference: ${pathInSchema} didn't have a title in the provided schemaData, returning the name of the reference instead. schemaData: ${JSON.stringify(schemaData, null, 2)}`);
            return pathInSchema.split('/').pop().split('.')[0];
        } else {
            console.error(`    Failed to retrieve title  from schemaData: ${JSON.stringify(schemaData, null, 2)}`);
        }

        return null;
    }
}

function parseSchemaFolder(schemaFolderName) {
    const schemaFolder = `./static/schemas/next/${schemaFolderName}`;
    
    console.debug("Parsing schema folder: ", schemaFolder);

    // Read all files in the schema folder
    const schemaFiles = fse.readdirSync(schemaFolder)
        .filter(file => file.endsWith('.json'))
        // nosemgrep
        .map(file => path.join(schemaFolder, file));

    // Process each schema file - collect items with category info
    let allItems = [];
    for (const schemaFile of schemaFiles) {
        
        if (path.basename(schemaFile) === "context.schema.json"){
            console.log(`  Skipping ${schemaFile}`);
        } else {
            console.log(`  Processing schema File: ${schemaFile}`);
            const items = processSchemaFile(schemaFile, schemaFolderName);
            allItems.push(...items);
        }
    }

    // Filter out null values
    allItems = allItems.filter(item => item);

    // Group items by category
    const categorized = {};
    const uncategorized = [];
    
    for (const item of allItems) {
        if (item.category) {
            if (!categorized[item.category]) {
                categorized[item.category] = [];
            }
            categorized[item.category].push(item.path);
        } else {
            uncategorized.push(item.path);
        }
    }

    // Build sidebar structure with categories as subcategories
    let sidebarItems = [...uncategorized];
    
    // Add categorized items as nested categories
    for (const [category, items] of Object.entries(categorized)) {
        // Capitalize first letter for display
        const label = category.charAt(0).toUpperCase() + category.slice(1);
        sidebarItems.push({
            type: "category",
            label: label,
            items: items.sort()
        });
    }

    return sidebarItems;
}

function main() {
    console.log("Generating Context reference pages...")
    //generate markdown docs for the current schema versions in the current docs draft

    let sidebarObject = fse.readJsonSync(`./sidebars.json`)    

    let sidebarContextObject = {
        "type": "category",
        "label": "Context Data Part",
        "items": ["context/spec"]
    }

    sidebarContextObject.items = sidebarContextObject.items.concat(parseSchemaFolder('context'));

    if (sidebarObject.docs["FDC3 Standard"] == null) {
        sidebarObject.docs["FDC3 Standard"] = [];
    }

    //replace existing element
    let foundIt = false;
    sidebarObject.docs["FDC3 Standard"].map((elem) => {

        if (elem.label == "Context Data Part"){
            foundIt = true;
            elem.items = sidebarContextObject.items;
            console.log("Replaced content of 'Context Data Part' of website navigation.");
        }
        
    });

    //or create it if not found
    if (!foundIt){
        console.warn("'Context Data Part' not found in website navigation, adding it as a new section...");
        sidebarObject.docs["FDC3 Standard"].push(sidebarContextObject)
    }
    fse.outputJSONSync(
        `./sidebars.json`,
        sidebarObject, { spaces: 2 });

}

if (require.main === module) {
    main();
}
