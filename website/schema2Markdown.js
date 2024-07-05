const fse = require('fs-extra');
const yaml = require('js-yaml');
const path = require('path');

function processProperty(propertyName, propertyDetails, schemaExamples, required) {
    let markdownContent = '';

    if (propertyName === 'type') {
        //skip rendering the type property as it should be rendered at the top level
        return markdownContent;
    }   
    markdownContent += `### \`${propertyName}\`\n\n`;
    if (required) { markdownContent += `**(required)**\n`; }

    if (propertyDetails.description != null) {
        markdownContent += `${escape(propertyDetails.description)}\n\n`;
    }

    if (propertyDetails.type) {
        markdownContent += renderType(propertyDetails.type);
    } else {
        const contextRef = propertyDetails.properties?.context?.$ref || propertyDetails.$ref;

        if (contextRef) {
            markdownContent += renderRef(contextRef);
        }
    }

    if (propertyDetails.enum) {
        markdownContent += renderEnum(propertyDetails.enum);
    }

    if (propertyDetails.allOf) {
        markdownContent += `${propertyDetails.allOf.map((item) => renderRef(item.$ref)).join(', ')}\n\n`;
    }

    
    if (propertyDetails.properties && Object.entries(propertyDetails.properties).length > 0) {
        // console.log("Sub props for "+propertyName+" - ",propertyDetails.properties.entries())
        markdownContent += '#### Subproperties\n';
        for (const [subpropertyName, subpropertyDetails] of Object.entries(propertyDetails.properties)) {
            markdownContent += `##### ${subpropertyName}\n`;
            markdownContent += `- Type: \`${subpropertyDetails.type}\`\n`;
            markdownContent += `- Description: \`${subpropertyDetails.description}\`\n\n`;
        };
    }

    if (schemaExamples) {
        schemaExamples.forEach((example) => {
            markdownContent += `\n**Example Value**: \n`;
            if (typeof example[propertyName] === 'object') {
                markdownContent += `\`\`\`json\n${JSON.stringify(example[propertyName], null, 2)}\n\`\`\`\n\n`;
            } else if (example[propertyName]) {
                markdownContent += `\`${example[propertyName]}\`\n\n`;
            }
        });
    }
    
    return markdownContent;
}

function renderType(ref) {
    return `**Type**: \`${ref}\`\n\n`;
}

function renderEnum(ref) {
    // for each item in ref, wrap it in backticks and join with a comma
    return `**Possible values**: ${ref.map((item) => `\`${item}\``).join(', ')}\n\n`;
}

function renderRef(contextRef) {
    const [filePath, objectPath] = contextRef.split('#'); // ../api/api.schema.json, /definitions/AppIdentifier
    const objectType = filePath.split('/').pop().split('.')[0]; // api

    // FROM ../api/api.schema.json#/definitions/AppIdentifier
    // TO   ../api/schemas/Appidentifier

    // FROM timerange.schema.json#
    // TO   timerange/schemas/timerange

    let objectName = objectType;
    if (objectPath) {
        objectName = objectPath.split('/').pop(); // AppIdentifier
    }

    let objectRef = objectName;
    if (filePath.startsWith('../')) {
        objectRef = "../../" + objectType + "/schemas/" + objectName;
    }

    let refLabel = `${objectType}/${objectName}`;
    if (objectType == objectName) {
        refLabel = objectName;
    }
    // We need to prepend ../ since Docusaurus forces a trailing slash at the end of each URL
    return `**Reference**: [${refLabel}](../${objectRef})\n\n`;
}

function hasAllOf(allOfArray) {
    return Array.isArray(allOfArray) && 
        allOfArray.length > 0 && 
        allOfArray[0] != null && 
        allOfArray[0].properties != null
}

function hasProperties(schema) {
    return schema.properties != null;
}

// Function to generate Markdown content from JSON schema
function generateObjectMD(schema, title, schemaFolderName, filePath) {

    const objectName = schema.title;

    if (schema.title != null) {
        title = schema.title;
    }

    let markdownContent = `# ${title}\n\n`;

    if (schema.description != null) {
        markdownContent += `${escape(schema.description)}\n\n`; 
    }

    if (schema.enum) {
        markdownContent += renderEnum(schema.enum);
    }

    //if working on windows you may have the wrong slashes...
    console.log(filePath);
    const workingPath = filePath.replaceAll("\\","/");
    console.log("\t" + workingPath);
    const url = workingPath.replace("../schemas/", `https://github.com/finos/FDC3/tree/main/schemas/`);
    console.log("\t" + url);
    markdownContent += `## Schema\n\n<${url}>\n\n`;

    if (hasAllOf(schema.allOf) || hasProperties(schema)) {
        // Extract properties, required fields, and $ref from the first allOf object
        let root = schema;
        if (hasAllOf(schema.allOf)) {
            root = schema.allOf[0];
        }
        
        const properties = root.properties;
        const typeString = properties?.type?.const;
        const ref = root.$ref;
                
        markdownContent += `## Type\n\n`;
        markdownContent += `\`${typeString}\`\n\n`;
        markdownContent += `## Properties\n\n`; 

        for (const [propertyName, propertyDetails] of Object.entries(properties)) {
            if (propertyName != "type"){ 
                markdownContent += processProperty(propertyName, propertyDetails, schema.examples);
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

        const frontMatter = generateFrontMatter(objectName, schema.description);

        const outputDocName = `${title.replace(/\s+/g, '')}`;
        const outputDocsPath = `${schemaFolderName}/ref/${outputDocName}`;
        const outputFilePath = `../docs/${schemaFolderName}/ref/${outputDocName}.md`;

        fse.outputFileSync(outputFilePath, `---\n${yaml.dump(frontMatter)}\n---\n\n${markdownContent}`);

        // objectName must not contain any spaces
        if (objectName != null) {
            return outputDocsPath;
        }
    }
}

function escape(text) {
    return text.replace(/>/g, '\\>').replace(/@experimental/g, '[@experiemental](/docs/fdc3-compliance#experimental-features)');
}

function generateFrontMatter(title, description) {
    return {
        title: title,
        description: description,
        sidebar_label: title,
    };
}

function processSchemaFile(schemaFile, schemaFolderName) {
    const schemaData = fse.readJSONSync(schemaFile);

    // if there is allOf, then it is an object
    const allOfArray = schemaData.allOf;
    let sidebarItems = [];
    if (Array.isArray(allOfArray) && allOfArray.length > 0) {
        sidebarItems.push(generateObjectMD(schemaData, null, schemaFolderName, schemaFile));
    }
    if (schemaData.definitions) {
        for (const [objectName, objectDetails] of Object.entries(schemaData.definitions)) {
            sidebarItems.push(generateObjectMD(objectDetails, objectName, schemaFolderName, schemaFile));
        }
    }

    return sidebarItems;
}

function parseSchemaFolder(schemaFolderName) {
    // Read all files in the schema folder
    const schemaFiles = fse.readdirSync("../schemas/"+schemaFolderName)
    .filter(file => file.endsWith('.json'))
    // nosemgrep
    .map(file => path.join("../schemas/"+schemaFolderName, file));

    // Process each schema file
    let sidebarItems = [];
    for (const schemaFile of schemaFiles) {
        sidebarItems.push(processSchemaFile(schemaFile, schemaFolderName));
    }

    // filter out null values
    return sidebarItems.flat().filter(item => item);
}

function main() {

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
