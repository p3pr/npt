const Function = require('../structures/Function');
const fs = require('fs');
const Chalk = require("chalk")

module.exports = new Function({
    async run() {
        const nptPath = './data/';
        if(!fs.existsSync(nptPath)) {
            console.log(Chalk.yellow('Creating npt directory...'));
            fs.mkdirSync(nptPath);
        }

    }
});