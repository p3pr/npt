const Function = require('../structures/Function');
const fs = require('fs');
const Chalk = require("chalk");
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

module.exports = new Function({
    async run() {
        const Config = require('../structures/Config').getInstance();
        const Auth = require('../structures/Auth').getInstance();
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
                // TODO: post request to server to authenticate
                console.log(Chalk.green('Authenticating...'));
                fs.writeFileSync(authPath, JSON.stringify(Auth.toJSON()));
                rl.close();
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