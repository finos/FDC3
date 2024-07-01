/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */  

/** Utility for preparing arguments to quicktype, which workaround a specific
 * quicktype bug in command line argument handling (where a directory is used
 * as input the source language argument is ignored which causes our schemas
 * to be interpreted as JSON input, rather than JSONSchema).
 * Bug issue:
 *  */

const path = require('path');
const fs = require('fs');
const exec = require('child_process').exec;

const args = process.argv.slice(2);
const outputFile = args.pop();
const inputs = args;

console.log('Inputs: ' + inputs.join(' | '));
console.log('Output file argument: ' + outputFile);

let sources = '';

let dirIndex = 0;

while (dirIndex < inputs.length) {
  if (inputs[dirIndex].endsWith('.schema.json')) {
    sources += `--src ${path.join(inputs[dirIndex])} `;
  } else {
    fs.readdirSync(inputs[dirIndex], { withFileTypes: true }).forEach(file => {
      if (file.isDirectory()) {
        inputs.push(path.join(inputs[dirIndex], file.name));
      } else if (file.name.endsWith('.schema.json')) {
        sources += `--src ${path.join(inputs[dirIndex], file.name)} `;
      }
    });
  }
  dirIndex++;
}

// Normalise path to local quicktype executable.
//const quicktypeExec = "node " + ["..","quicktype","dist","index.js"].join(path.sep);
const quicktypeExec = ['.', 'node_modules', '.bin', 'quicktype'].join(path.sep);

const command = `${quicktypeExec} --prefer-const-values --prefer-unions --no-combine-classes -s schema -o ${outputFile} ${sources}`;
console.log('command to run: ' + command);

exec(command, function(error, stdout, stderr) {
  if (stdout) {
    console.log(stdout);
  }
  if (stderr) {
    console.log(stderr);
  }
});
