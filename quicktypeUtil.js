/** Utility for preparing arguments to quicktype, which workaround a specific 
 * quicktype bug in command line argument handling (where a directory is used 
 * as input the source language argument is ignored which causes our schemas
 * to be interpreted as JSON input, rather than JSONSchema).
 * Bug issue: 
 *  */

const path = require('path');
const fs = require('fs');
const exec = require('child_process').exec;

const args = process.argv;
const inputFolder = args[2]
const outputFile = args[3];

console.log("Input folder argument: " + inputFolder);
console.log("Output file argument: " + outputFile);

let srcs = "";
fs.readdirSync(inputFolder).forEach(file => {
    srcs += `--src ${path.join(inputFolder, file)} `;
});

// Normalise path to local quicktype executable.
const quicktypeExec = ['.', 'node_modules', '.bin', 'quicktype'].join(path.sep);

const command = `${quicktypeExec} -s schema --acronym-style camel -o ${outputFile} ${srcs}`;
console.log("command to run: " + command);

exec(command, function(error, stdout, stderr) {
	if (stdout) {
		console.log(stdout);
	}
	if (stderr) {
		console.log(stderr);
	}
});
