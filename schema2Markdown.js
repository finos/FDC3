const fse = require('fs-extra');
const yaml = require('js-yaml');
const path = require('path');

function processProperty(propertyName, propertyDetails, schemaExamples, required) {
    let markdownContent = '';

    if (propertyName === 'type') {
        //skip rendering the type property as it should be rendered at the top level
        return markdownContent;
    }   
    markdownContent += `### ${\`${propertyName}\`}\n\n`;
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

    if (schemaExamples) {
        schemaExamples.forEach((example) => {
            markdownContent += `**Example Value**: \n`;
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

    return `**Reference**: [${objectType}/${objectName}](${objectRef})\n\n`;
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
function generateObjectMD(schema, title, schemaFolderName, filePath, version) {

    const objectName = schema.title

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

    if (hasAllOf(schema.allOf) || hasProperties(schema)) {
        // Extract properties, required fields, and $ref from the first allOf object
        let root = schema;
        if (hasAllOf(schema.allOf)) {
            root = schema.allOf[0];
        }
        
        const properties = root.properties;
        const required = root.required;
        const ref = root.$ref;

        markdownContent += `## Properties\n\n`; 

        for (const [propertyName, propertyDetails] of Object.entries(properties)) {
            markdownContent += processProperty(propertyName, propertyDetails, schema.examples, required.includes(propertyName));
        }


        if (ref) {
            markdownContent += `ref: ${ref}\n\n`;
        }

        if (schema.examples) {
            markdownContent += `## Examples\n\n`;
            markdownContent += '```json\n';
            markdownContent += JSON.stringify(schema.examples, null, 2);
            markdownContent += '\n```\n\n';
        }
        const url = filePath.replace("schemas/", `https://github.com/finos/FDC3/tree/master/schemas/`);
        markdownContent += `Generated from ${url}`;
        
    }

    const frontMatter = generateFrontMatter(objectName, schema.description);

    const outputFileName = `./website/versioned_docs/version-${version}/${schemaFolderName}/schemas/${title.replace(/\s+/g, '')}.md`;

    fse.outputFileSync(outputFileName, `---\n${yaml.dump(frontMatter)}\n---\n\n${markdownContent}`);

    // objectName must not contain any spaces
    if (objectName != null) {
        return schemaFolderName + '/schemas/' + objectName.replace(/\s+/g, '');
    }
}

function escape(text) {
    return text.replace(/>/g, '\\>');
}

function generateFrontMatter(title, description) {
    return {
        title: title,
        description: description,
        sidebar_label: title,
    };
}

function processSchemaFile(schemaFile, schemaFolderName, version) {
    const schemaData = fse.readJSONSync(schemaFile);

    // if there is allOf, then it is an object
    const allOfArray = schemaData.allOf;
    let sidebarItems = [];
    if (Array.isArray(allOfArray) && allOfArray.length > 0) {
        sidebarItems.push(generateObjectMD(schemaData, null, schemaFolderName, schemaFile, version));
    }
    if (schemaData.definitions) {
        for (const [objectName, objectDetails] of Object.entries(schemaData.definitions)) {
            sidebarItems.push(generateObjectMD(objectDetails, objectName, schemaFolderName, schemaFile, version));
        }
    }

    return sidebarItems;
}

function parseSchemaFolder(schemaFolderName, version) {
    // Read all files in the schema folder
    const schemaFiles = fse.readdirSync("./schemas/"+schemaFolderName)
    .filter(file => file.endsWith('.json'))
    .map(file => path.join("./schemas/"+schemaFolderName, file));

    // Process each schema file
    let sidebarItems = [];
    for (const schemaFile of schemaFiles) {
        sidebarItems.push(processSchemaFile(schemaFile, schemaFolderName, version));
    }

    // filter out null values
    return sidebarItems.flat().filter(item => item);
}

function main() {

    const versions = fse.readdirSync('./website/versioned_docs').map(version => version.split('-')[1]);

    versions.forEach(version => {

        let sidebarObject = fse.readJsonSync(`./website/versioned_sidebars/version-${version}-sidebars.json`)    

        let sidebarContextObject = {
            "type": "category",
            "label": "Context Data Part",
            "items": []
        }

        let sidebarApiObject = {
            "type": "category",
            "label": "API Schemas Part",
            "items": []
        }

        sidebarContextObject.items = parseSchemaFolder('context', version);

        if (sidebarObject.docs["FDC3 Standard"] == null) {
            sidebarObject.docs["FDC3 Standard"] = [];
        }

        sidebarObject.docs["FDC3 Standard"].push(sidebarContextObject)

        fse.outputJSONSync(
            `./website/versioned_sidebars/version-${version}-sidebars.json`, 
            sidebarObject, { spaces: 2 });
    });
}

if (require.main === module) {
    main();
}