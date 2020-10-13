const fs = require('fs')
const versions = require('../versions.json')
const swapped = [versions[1], versions[0], ...versions.splice(2)]
fs.writeFileSync('./versions.json', JSON.stringify(swapped, null, 2))

