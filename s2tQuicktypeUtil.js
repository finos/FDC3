/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */  

/** Utility for preparing arguments to quicktype, which workaround a specific
 * quicktype bug in command line argument handling (where a directory is used
 * as input the source language argument is ignored which causes our schemas
 * to be interpreted as JSON input, rather than JSONSchema).
 * 
 * Individual file arguments will be interpreted as 'additional' schema files
 * that will be referenced from the other schemas and may not have top-level output 
 * schemas generated, while folders of files w
 * 
 *  */

const path = require('path');
const fs = require('fs');
const exec = require('child_process').exec;

const args = process.argv.slice(2);
const outputFile = args.pop();
const inputs = args;

console.log('Inputs schema files: ' + inputs.join(' | '));
console.log('Output file argument: ' + outputFile);

let sources = '';
let additionalSchemaFiles = ''
let dirIndex = 0;

//skip duplicate paths (we might want to specify some files to go first, and might duplicate them)
const paths = new Set();
const addAPath = (aPath,paths,sources,type) => {
  if (!paths.has(aPath)) {
    paths.add(aPath)
    return sources + ` ${type} ${aPath}`;
  } else {
    console.log(`skipping duplicate path ${aPath}`);
    return sources;
  }
}

while (dirIndex < inputs.length) {
  if (inputs[dirIndex].endsWith('.schema.json')) {
    //add individual files with -S as additional schema files used in references (rather than ones that need a top-level output)
    sources = addAPath(path.join(inputs[dirIndex]),paths,additionalSchemaFiles, "-S");
  } else {
    fs.readdirSync(inputs[dirIndex], { withFileTypes: true }).forEach(file => {
      if (file.isDirectory()) {
        inputs.push(path.join(inputs[dirIndex], file.name));
      } else if (file.name.endsWith('.schema.json')) {
        sources = addAPath(path.join(inputs[dirIndex], file.name),paths,sources, "--src");
      }
    });
  }
  dirIndex++;
}

// Normalise path to local quicktype executable.
//const quicktypeExec = "node " + ["..","quicktype","dist","index.js"].join(path.sep);
const quicktypeExec = ['..', 'node_modules', '.bin', 'quicktype'].join(path.sep);

const command = `${quicktypeExec} --prefer-const-values --prefer-unions -s schema -o ${outputFile} ${additionalSchemaFiles} ${sources}`;
console.log('command to run: ' + command);

exec(command, function(error, stdout, stderr) {
  if (stdout) {
    console.log(stdout);
  }
  if (stderr) {
    console.log(stderr);
  }
});
