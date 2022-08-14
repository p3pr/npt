const Function = require('../../structures/Function');
const fs = require('fs');
const Chalk = require("chalk");
const Config = require('../../structures/Config').getInstance();
const axios = require('axios');
const AdmZip = require('adm-zip');
const path = require('path');
const FormData = require('form-data');
const https = require('http');

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
        let port = Config.getServer();
        if(port.split(':').length === 3) {
            port = parseInt(port.split(':')[2]);
        } else {
            if(port.startsWith('http://')) {
                port = 80;
            } else {
                port = 443;
            }
        }
        let server = Config.getServer();
        if(server.split(':').length === 3) {
            server = server.split(':')[1];
        }
        if(server.startsWith('//')) {
            server = Config.getServer().split('//')[0] + server;
        }
        let postData = JSON.stringify({
            'template': Config.getArgs()[2],
            'userId': Auth.getId(),
            'key': Auth.getKey()
        });
        let options = {
            hostname: "localhost",
            port: 3000,
            path: '/api/v1/clone',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': postData.length
            }
        };
        const req = await https.request(options, (res) => {
            res.on('data', (d) => {
                process.stdout.write("Hi");
                console.log(d);
                if(d.hasOwnProperty("error")) {
                    console.log(Chalk.red('Error: ' + d.error));
                    return process.exit(1);
                }
                const path = `${Config.getArgs()[2]}.zip`;
                const filePath = fs.createWriteStream(path);
                res.pipe(filePath);
                filePath.on('finish',() => {
                    filePath.close();
                    console.log('Download Completed');
                    req.end();
                    process.exit();
                })
            });
            res.on('end', () => {
                console.log('No more data in response.');
            });
        });
        req.on('error', (e) => {
            console.error(e);
        });
        req.write(postData);
    }
}, "Clone a template", "%name% %directory%");