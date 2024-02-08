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
        markdownContent += `${propertyDetails.description}\n\n`;

        if (propertyDetails.type) {
        markdownContent += `**Type**: ${propertyDetails.type}\n\n`;
        } else {
            const contextRef = propertyDetails.properties?.context?.$ref || propertyDetails.$ref;
            if (contextRef) {
                const reference = contextRef.toLowerCase().replace(/\s+/g, '-');
                markdownContent += `**Reference**: [${contextRef}](${reference}.md)\n\n`;
            }
        }

        if (propertyDetails.enum) {
            markdownContent += `Possible values: ${propertyDetails.enum.join(', ')}\n\n`;
        }

        if (propertyDetails.allOf) {
            markdownContent += `**Reference**: ${propertyDetails.allOf.map((item) => item.$ref).join(', ')}\n\n`;
        }

        if (schemaExamples) {
            const example = schemaExamples[0];
            if (example[propertyName]) {
                markdownContent += `**Example Value**: \`'${example[propertyName]}'\`\n\n`;
            }
        }
    }
    return markdownContent;
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
function generateObjectMD(schema, title, schemaFile, schemaFolderName) {

    // if (schemaFolderName === 'api') {
    //     console.log('schema:', schema);
    // }

    const fileName = path.basename(schemaFile);

    if (schema.title != null) {
        title = schema.title;
    }
    let markdownContent = `# ${title}\n\n`;

    if (schema.description != null) {
        markdownContent += `${schema.description}\n\n`; 
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
            markdownContent += `ref: ${schema.allOf[1].$ref}\n\n`;
        }

        if (schema.examples) {
            markdownContent += `## examples\n\n`;
            markdownContent += '```json\n';
            markdownContent += JSON.stringify(schema.examples, null, 2);
            markdownContent += '\n```';
        }
    }

    const frontMatter = generateFrontMatter(fileName.replace('.schema.json', '.md'), schema.description);

    const outputFileName = `./website/versioned_docs/version-2.1/${schemaFolderName}/schemas/${title.replace(/\s+/g, '')}.md`;
    fs.outputFileSync(outputFileName, `---\n${yaml.dump(frontMatter)}\n---\n\n${markdownContent}`);
    console.log(`Saved ${outputFileName}`);
}

function generateFrontMatter(title, description) {
    return {
        title: title + ' Schema',
        description: description,
        sidebar_label: title + ' Schema',
    };
}

function processSchemaFile(schemaFile, schemaFolderName) {
    const schemaData = fs.readJSONSync(schemaFile);

    // if there is allOf, then it is an object
    const allOfArray = schemaData.allOf;
    if (Array.isArray(allOfArray) && allOfArray.length > 0) {
        generateObjectMD(schemaData, null, schemaFile, schemaFolderName);
        console.log(`Generated ${schemaFile} schema`);
    }
    if (schemaData.definitions) {
        for (const [objectName, objectDetails] of Object.entries(schemaData.definitions)) {
            generateObjectMD(objectDetails, objectName, schemaFile, schemaFolderName) + "\n\n";
            console.log(`Generated ${schemaFolderName}/${objectName} schema`);
        }
    }
}

function parseSchemaFolder(schemaFolderName) {
    // Read all files in the schema folder
    const schemaFiles = fs.readdirSync("./schemas/"+schemaFolderName)
    .filter(file => file.endsWith('.json'))
    .map(file => path.join("./schemas/"+schemaFolderName, file));

    // Process each schema file
    for (const schemaFile of schemaFiles) {
        processSchemaFile(schemaFile, schemaFolderName);
    }
}

function main() {
    // Folder containing JSON schema files
    parseSchemaFolder('api');
    parseSchemaFolder('context');
}

if (require.main === module) {
    main();
}