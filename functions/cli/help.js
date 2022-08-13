const Function = require('../../structures/Function');
const fs = require('fs');
const Chalk = require("chalk");
const Config = require('../../structures/Config').getInstance();

module.exports = new Function({
    async run() {
        // get all files in cli folder and require them
        const cliPath = './functions/cli/';
        const files = fs.readdirSync(cliPath);
        let toOutput = {};
        for(let i = 0; i < files.length; i++) {
            if(files[i].endsWith('.js')) {
                const cliFunction = require(`./${files[i]}`);
                toOutput[files[i].split('.')[0]] = {
                    "description": cliFunction.getDescription(),
                    "usage": cliFunction.getUsage()
                };
            }
        }
        for(var i in toOutput) {
            console.log(Chalk.blueBright(i) + ` ${Chalk.greenBright(toOutput[i].usage)}-  ${toOutput[i].description}`);
        }
        process.exit(1);
    }
}, "Displays this help message", "");