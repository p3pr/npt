const Function = require('../../structures/Function');
const fs = require('fs');
const Chalk = require("chalk");
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const axios = require('axios');

module.exports = new Function({
    async run() {
        const Config = require('../../structures/Config').getInstance();
        const Auth = require('../../structures/Auth').getInstance();
        const authPath = './data/auth.json';
        if(!fs.existsSync(authPath)) {
            console.log(Chalk.yellow('Creating auth.json file...'));
            fs.writeFileSync(authPath, JSON.stringify({
                "user": "",
                "key": ""
            }));
        }
        await rl.question(Chalk.yellow('Please enter your username: '), (answer) => {
            Auth.setUser(answer);
            rl.stdoutMuted = true;
            rl.question(Chalk.yellow('Please enter your password: '), (answer) => {
                rl.close();
                console.log();
                console.log(Chalk.green('Authenticating...'));
                axios.post(Config.getServer() + '/api/v1/auth', {
                    username: Auth.getUser(),
                    password: answer
                }).then(async (response) => {
                    let json = response.data;
                    if(json.error !== undefined) {
                        console.log(Chalk.red('Error: ' + json.error));
                        return;
                    }
                    console.log(Chalk.green('Authenticated! Have fun using npt!'));
                    Auth.setKey(json.key);
                    Auth.save();
                    Config.setAuthenticated(true);
                    Config.save();
                    process.exit(1);
                })
            });
            rl._writeToOutput = function _writeToOutput(stringToWrite) {
                if (rl.stdoutMuted)
                    rl.output.write("*");
                else
                    rl.output.write(stringToWrite);
            };
        });
    }
});