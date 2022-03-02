import mocha from "mocha";

// Mocha setup creates the describe and it functions,
// so must happens before test definition
mocha.setup("bdd");

// The Typescript mappings are missing the global timeout function
(mocha as any).timeout(10000);
