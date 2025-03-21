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
const outputPath = args.pop();
const inputs = args;

console.log('Inputs: ' + inputs.join(' | '));
console.log('Output path argument: ' + outputPath);

let source = '';

let dirIndex = 0;

const excludedTypes = [
  'DesktopAgent.ts',
  'Listener.ts',
  'Methods.ts',
  'PrivateChannel.ts',
  'Types.ts',
  'RecommendedChannels.ts',
];

let sources = '';

while (dirIndex < inputs.length) {
  if (inputs[dirIndex].endsWith('.ts')) {
    sources += `--src ${path.join(inputs[dirIndex])} `;
  } else {
    fs.readdirSync(inputs[dirIndex], { withFileTypes: true }).forEach(file => {
      if (file.isDirectory()) {
        inputs.push(path.join(inputs[dirIndex], file.name));
      } else {
        if (!excludedTypes.includes(file.name)) {
          sources += `--src ${path.join(inputs[dirIndex], file.name)} `;
        }
      }
    });
  }
  dirIndex++;
}

// Normalise path to local quicktype executable.
const quicktypeExec = ['.', 'node_modules', '.bin', 'quicktype'].join(path.sep);

const command = `${quicktypeExec} -l schema -o ${outputPath} ${sources}`;
console.log('command to run: ' + command);

exec(command, function (error, stdout, stderr) {
  if (stdout) {
    console.log(stdout);
  }
  if (stderr) {
    console.log(stderr);
  }
});
