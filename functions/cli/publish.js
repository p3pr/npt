const Function = require('../../structures/Function');
const fs = require('fs');
const Chalk = require("chalk");
const Config = require('../../structures/Config').getInstance();

module.exports = new Function({
    async run() {
        // TODO: Verify with the server that the user is allowed to publish to the specified package
        // TODO: Zip the package and send it to the server
        process.exit(1);
    }
}, "Publish a package to the server", "%name% %directory%");