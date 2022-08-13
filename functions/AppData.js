const Function = require('../structures/Function');
const fs = require('fs');
const Chalk = require("chalk");
const Config = require('../structures/Config').getInstance();

module.exports = new Function({
    async run() {
        const nptPath = './data/';
        if(!fs.existsSync(nptPath)) {
            console.log(Chalk.yellow('Creating npt directory...'));
            fs.mkdirSync(nptPath);
        }
        const configPath = nptPath + 'config.json';
        if(!fs.existsSync(configPath)) {
            console.log(Chalk.yellow('Creating config.json file...'));
            fs.writeFileSync(configPath, JSON.stringify(Config.toJSON()));
        }
        Config.convert(JSON.parse(fs.readFileSync(configPath).toString()));
        Config.setArgs(process.argv);
        return true;
    }
}, "Load config");