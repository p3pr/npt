const Function = require('../../structures/Function');
const fs = require('fs');
const Chalk = require("chalk");
const Config = require('../../structures/Config').getInstance();
const axios = require('axios');
const AdmZip = require('adm-zip');
const path = require('path');
const FormData = require('form-data');

module.exports = new Function({
    async run() {
        const Auth = require('../../structures/Auth').getInstance();
        if(Config.getArgs().length < 4) {
            console.log(Chalk.red('Error: You must specify a template name and directory'));
            process.exit(1);
        };
        console.log(Chalk.blueBright('Attempting to clone template ' + Chalk.yellow(Config.getArgs()[2])));
        const accesscheck = await axios.post(Config.getServer() + '/api/v1/access', {
            template: Config.getArgs()[2],
            userId: Auth.getId(),
            key: Auth.getKey()
        });
        const response = accesscheck.data;
        if(response.error !== undefined) {
            console.log(Chalk.red('Error: ' + response.error));
            process.exit(1);
        }
        let newArgs = Config.getArgs();
        if(newArgs[3] === '.') {
            newArgs[3] = process.cwd();
        } else {
            newArgs[3] = process.cwd() + '/' + newArgs[3];
        }
        Config.setArgs(newArgs);
        if(!fs.existsSync(Config.getArgs()[3])) {
            fs.mkdirSync(path.join(Config.getArgs()[3]));
        }
        const zipReq = await axios.post(Config.getServer() + '/api/v1/clone', {
            template: Config.getArgs()[2],
            userId: Auth.getId(),
            key: Auth.getKey()
        }, {
            responseType: 'stream'
        });
        if(zipReq.error !== undefined) {
            console.log(Chalk.red('Error: ' + zipReq.error));
            process.exit(1);
        }
        const writer = fs.createWriteStream(Config.getArgs()[2] + '/template.zip');
        zipReq.data.pipe(writer);
        const zip = new AdmZip(Config.getArgs()[2] + '.zip');
        console.log(zip.getEntries());
        process.exit(1);
    }
}, "Clone a template", "%name% %directory%");