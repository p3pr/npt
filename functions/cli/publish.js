const Function = require('../../structures/Function');
const fs = require('fs');
const Chalk = require("chalk");
const Config = require('../../structures/Config').getInstance();
const axios = require('axios');
const AdmZip = require('adm-zip');
const FormData = require('form-data');

module.exports = new Function({
    async run() {
        const Auth = require('../../structures/Auth').getInstance();
        if(Config.getArgs().length < 4) {
            console.log(Chalk.red('Error: You must specify a template name and directory'));
            process.exit(1);
        };
        console.log(Chalk.blueBright('Attempting to publish package ' + Chalk.yellow(Config.getArgs()[2])));
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
            console.log(Chalk.red('Error: Directory ' + Config.getArgs()[3] + ' does not exist'));
            process.exit(1);
        }
        const zip = new AdmZip();
        let ignore = [];
        if(fs.existsSync(Config.getArgs()[3] + '/.gitignore')) {
            ignore = fs.readFileSync(Config.getArgs()[3] + '/.gitignore').toString().split('\n');
        }
        ignore = ignore.map(function(item) {
            return item.replace(/\/$/, '');
        });
        ignore.push('.git');
        ignore.push('.DS_Store');
        fs.readdirSync(Config.getArgs()[3]).forEach(function (file) {
            if(ignore.includes(file)) {
                return;
            }
            let okay = true;
            for(var ign in ignore) {
                if(file.startsWith(ignore[ign])) {
                    okay = false;
                    break;
                }
            }
            if(!okay) {
                return;
            }
            const fullPath = Config.getArgs()[3] + '/' + file;
            if(fs.statSync(fullPath).isFile()) {
                zip.addLocalFile(fullPath);
            } else {
                zip.addLocalFolder(fullPath, file);
            }
        });
        zip.writeZip(Config.getArgs()[2] + '.zip');
        const upload = new FormData();
        upload.append('zip', fs.createReadStream(Config.getArgs()[2] + '.zip'));
        upload.append('template', Config.getArgs()[2]);
        upload.append('userId', Auth.getId());
        upload.append('key', Auth.getKey());
        const uploadResponse = await axios.post(Config.getServer() + '/api/v1/publish', upload).catch(function(error) {
            console.log(Chalk.red('Error: ' + error.response.data.error));
            process.exit(1);
        });
        fs.rmSync(Config.getArgs()[2] + '.zip');
        const uploadResponseData = uploadResponse.data;
        if(uploadResponseData.error !== undefined) {
            console.log(Chalk.red('Error: ' + uploadResponseData.error));
            process.exit(1);
        }
        console.log(Chalk.green('Successfully published package ' + Chalk.yellow(Config.getArgs()[2])));
        process.exit(1);
    }
}, "Publish a package to the server", "%name% %directory%");