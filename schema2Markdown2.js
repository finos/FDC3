const fs = require('fs');
const path = require('path');

// Specify the folder path here
const folderPath = './schemas/context'; // Update this with your folder path

// Function to convert JSON schema to Markdown
function convertSchemaToMarkdown(schema) {
    // Log schema object
    console.log('Schema:', schema);

    // Find properties within allOf field
    let properties;
    let requiredProperties = [];
    for (const subSchema of schema.allOf || []) {
        if (subSchema.properties) {
            properties = subSchema.properties;
            if (subSchema.required) {
                requiredProperties = subSchema.required;
            }
            break;
        }
    }

    if (!properties) {
        console.error('Error: properties field not found in schema.');
        return '';
    }

    // Convert JSON schema to Markdown
    const markdown = `
# ${schema.title}

${schema.description}

## Properties

| Name          | Description                                          | Type   | Required |
|---------------|------------------------------------------------------|--------|----------|
${Object.entries(properties).map(([propName, prop]) => `| ${propName} | ${prop.description} | ${prop.type} | ${requiredProperties.includes(propName) ? 'Yes' : 'No'} |`).join('\n')}

## Examples

\`\`\`json
${JSON.stringify(schema.examples, null, 2)}
\`\`\`
`;

    return markdown;
}

// Function to process each file
function processFile(filePath) {
    // Load the JSON schema
    const data = fs.readFileSync(filePath, 'utf8');
    const schema = JSON.parse(data);
    const markdown = convertSchemaToMarkdown(schema);

    // Create output directory if not exists
    const outputDir = path.join('docs', 'output');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write Markdown to a file
    const markdownFilePath = path.join(outputDir, path.basename(filePath, path.extname(filePath))) + '.md';
    fs.writeFileSync(markdownFilePath, markdown);

    console.log(`Markdown conversion completed for ${filePath}. Markdown file saved as ${markdownFilePath}`);
}

// Main function
function main() {
    // Create output directory if not exists
    const outputDir = path.join(folderPath, 'output');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    // Read files from folder
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error(`Error reading folder: ${err}`);
            process.exit(1);
        }

        // Filter JSON schema files
        const jsonSchemaFiles = files.filter(file => path.extname(file) === '.json');

        // Process each JSON schema file
        jsonSchemaFiles.forEach(file => {
            const filePath = path.join(folderPath, file);
            processFile(filePath);
        });
    });
}

// Call main function
main();