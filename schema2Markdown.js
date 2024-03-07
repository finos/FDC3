const fs = require('fs-extra');
const yaml = require('js-yaml');
const path = require('path');

function processProperty(propertyName, propertyDetails, schemaExamples) {
    let markdownContent = '';

    if (propertyName === 'type') {
        markdownContent += `### ${'Type'|| propertyName}\n\n`;
        markdownContent += `\`${propertyDetails.const}\`\n\n`;
    } else {
        markdownContent += `### ${propertyDetails.title || propertyName}\n\n`;
        markdownContent += `\`${propertyName}\`\n\n`;

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
            const example = schemaExamples[0];

            if (typeof example[propertyName] === 'object') {
                markdownContent += `**Example Value**: \n\`\`\`json\n${JSON.stringify(example[propertyName], null, 2)}\n\`\`\`\n\n`;
            } else if (example[propertyName]) {
                markdownContent += `**Example Value**: \`'${example[propertyName]}'\`\n\n`;
            }
        }
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
    const filePath = contextRef.split('#')[0]; // ../api/api.schema.json
    const objectType = filePath.split('/').pop().split('.')[0]; // api

    // FROM ../api/api.schema.json#/definitions/AppIdentifier
    // TO   ../api/schemas/Appidentifier

    // FROM timerange.schema.json#
    // TO   timerange/schemas/timerange

    const objectPath = contextRef.split('#')[1]; // /definitions/AppIdentifier
    let objectName = objectType;
    if (objectPath) {
        objectName = objectPath.split('/').pop(); // AppIdentifier
    }

    let objectRef = objectName;
    if (filePath.startsWith('../')) {
        objectRef = "../../" + objectType + "/schemas/" + objectName;
    }

    console.log('from contextRef:', contextRef, 'to objectRef:', objectRef);

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
function generateObjectMD(schema, title, schemaFolderName, version) {

    const objectName = schema.title

    if (schema.title != null) {
        title = schema.title;
    }

    let markdownContent = `# ${title}\n\n`;

    if (schema.description != null) {
        markdownContent += `${escape(schema.description)}\n\n`; 
    }

    if (schema.type) {
        markdownContent += renderType(schema.type);
    }
    if (schema.enum) {
        markdownContent += renderEnum(schema.enum);
    }

    console.log('hasAllOf/hasProperties', hasAllOf(schema.allOf), hasProperties(schema));
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
            markdownContent += processProperty(propertyName, propertyDetails, schema.examples);
        }

        // show required properties
        if (required && required.length > 0) {
            markdownContent += `### Required Properties:\n\n`;
            // for each required property show the name
            required.forEach((propertyName) => {
                markdownContent += `* \`${propertyName}\`\n`;
            });
            markdownContent += '\n';
        } 

        if (ref) {
            markdownContent += `ref: ${ref}\n\n`;
        }

        if (schema.examples) {
            markdownContent += `## Examples\n\n`;
            markdownContent += '```json\n';
            markdownContent += JSON.stringify(schema.examples, null, 2);
            markdownContent += '\n```';
        }
    }

    const frontMatter = generateFrontMatter(objectName, schema.description);
    console.log('frontMatter:', frontMatter);

    const outputFileName = `./website/versioned_docs/version-${version}/${schemaFolderName}/schemas/${title.replace(/\s+/g, '')}.md`;

    fs.outputFileSync(outputFileName, `---\n${yaml.dump(frontMatter)}\n---\n\n${markdownContent}`);

    // objectName must not contain any spaces
    if (objectName != null) {
        return schemaFolderName + '/schemas/' + objectName.replace(/\s+/g, '');
    }
}

function escape(text) {
    let output = text;
    output = output.replace(/>/g, '\\>');

    return output;
}

function generateFrontMatter(title, description) {
    return {
        title: `${title} Schema`,
        description: description,
        sidebar_label: title + ' Schema',
    };
}

function processSchemaFile(schemaFile, schemaFolderName, version) {
    const schemaData = fs.readJSONSync(schemaFile);

    // if there is allOf, then it is an object
    const allOfArray = schemaData.allOf;
    let sidebarItems = [];
    if (Array.isArray(allOfArray) && allOfArray.length > 0) {
        sidebarItems.push(generateObjectMD(schemaData, null, schemaFolderName, version));
    }
    if (schemaData.definitions) {
        for (const [objectName, objectDetails] of Object.entries(schemaData.definitions)) {
            sidebarItems.push(generateObjectMD(objectDetails, objectName, schemaFolderName, version));
        }
    }

    // return sidebarItems.flat().filter(item => !item.endsWith('undefined'));
    return sidebarItems;
}

function parseSchemaFolder(schemaFolderName, version) {
    // Read all files in the schema folder
    const schemaFiles = fs.readdirSync("./schemas/"+schemaFolderName)
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

    const versions = ["1.0", "1.1", "1.2", "2.0", "2.1"];

    versions.forEach(version => {

        let sidebarObject = require(`./website/versioned_sidebars/version-${version}-sidebars.json`)

        let sidebarContextObject = {
            "type": "category",
            "label": "Context Schemas Part",
            "items": []
        }

        let sidebarApiObject = {
            "type": "category",
            "label": "API Schemas Part",
            "items": []
        }

        sidebarApiObject.items = parseSchemaFolder('api', version);
        sidebarContextObject.items = parseSchemaFolder('context', version);

        if (sidebarObject.docs["FDC3 Standard"] == null) {
            sidebarObject.docs["FDC3 Standard"] = [];
        }

        sidebarObject.docs["FDC3 Standard"].push(sidebarContextObject)
        sidebarObject.docs["FDC3 Standard"].push(sidebarApiObject)

        fs.outputJSONSync(
            `./website/versioned_sidebars/version-${version}-sidebars.json`, 
            sidebarObject, { spaces: 2 });
    });
}

if (require.main === module) {
    main();
}