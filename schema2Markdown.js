const fs = require('fs-extra');
const yaml = require('js-yaml');
const path = require('path');

// Function to generate Markdown content from JSON schema
function generateMarkdown(schema) {
    const allOfArray = schema.allOf;

    if (!Array.isArray(allOfArray) || allOfArray.length === 0) {
        console.error('Invalid or empty "allOf" array in the JSON schema.');
        return '';
    }

    const firstAllOf = allOfArray[0];
    if (!firstAllOf || typeof firstAllOf !== 'object') {
        console.error('Invalid or missing "allOf" object in the JSON schema.');
        return '';
    }

    // Extract properties, required fields, and $ref from the first allOf object
    const properties = firstAllOf.properties;
    const required = firstAllOf.required;
    const ref = firstAllOf.$ref;

    if (!properties || typeof properties !== 'object') {
        console.error('Invalid or missing "properties" object in the JSON schema.');
        return '';
    }

    let markdownContent = `# ${schema.title}\n\n`;
    markdownContent += `${schema.description}\n\n`; 


    function processProperty(propertyName, propertyDetails) {
        if (propertyName === 'type') {
            markdownContent += `## ${'Type'|| propertyName}\n\n`;
            markdownContent += `\`${propertyDetails.const}\`\n\n`;
            markdownContent += `## Properties\n\n`; 
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
        }
    }

    for (const [propertyName, propertyDetails] of Object.entries(properties)) {
        processProperty(propertyName, propertyDetails);
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

    markdownContent += `## examples\n\n`;
    markdownContent += '```json\n';
    markdownContent += JSON.stringify(schema.examples, null, 2);
    markdownContent += '\n```';

    return markdownContent;
}

function generateFrontMatter(title, description) {
    return {
        title: title + ' Schema',
        description: description,
        sidebar_label: title + ' Schema',
    };
}

function processSchemaFile(schemaFile) {
    const schemaData = fs.readJSONSync(schemaFile);

    const fileName = path.basename(schemaFile);

    const markdownContent = generateMarkdown(schemaData);
    const frontMatter = generateFrontMatter(fileName.replace('.schema.json', '.md'), schemaData.description);

    const outputFileName = `./docs/context/schemas/${schemaData.title.replace(/\s+/g, '')}.md`;
    fs.outputFileSync(outputFileName, `---\n${yaml.dump(frontMatter)}\n---\n\n${markdownContent}`);
}

function main() {
    // Folder containing JSON schema files
    const schemaFolder = './schemas/context';

    // Read all files in the schema folder
    const schemaFiles = fs.readdirSync(schemaFolder)
    .filter(file => file.endsWith('.json'))
    .map(file => path.join(schemaFolder, file));

    // Log number of schema files found
    console.log(`Found ${schemaFiles.length} schema files.`);

    // Process each schema file
    schemaFiles.forEach(processSchemaFile);

    // Log number of schema markdown files generated in the markdown folder
    const markdownFiles = fs.readdirSync('./docs/context/schemas') || [];
    console.log(`Generated ${markdownFiles.length} markdown files.`);
}

if (require.main === module) {
    main();
}