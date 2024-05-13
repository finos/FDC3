/** @type {import('jest').Config} */
module.exports = {
    moduleFileExtensions: ["js", "ts"],
    globals: {
        "ts-jest": {
            isolatedModules: true
        }
    },
    transform: {
        "^.+\\.ts?$": "ts-jest"
    },
    testRegex: ".+\\.test\\.ts?$",
    testEnvironment: "jsdom",
};