#!/usr/bin/env node
const AppData = require("./functions/AppData");
const Chalk = require("chalk");
const fs = require("fs");

async function run() {
    await AppData.run();
    const Config = require("./structures/Config").getInstance();
    if(Config.getArgs()[0].includes("node")) {
        Config.setArgs(Config.getArgs().slice(1));
    }
    if(!Config.getAuthenticated()) {
        console.log(Chalk.red('Please authenticate yourself!'));
        console.log(Chalk.blueBright('Use the command "npt auth"'));
        return false;
    }
    let valid = false;
    const auth = JSON.parse(fs.readFileSync("./data/auth.json").toString());
    const Auth = require("./structures/Auth").getInstance();
    Auth.setUser(auth.user);
    Auth.setKey(auth.key);
    Auth.setId(auth.id);
    fs.readdirSync(`./functions/cli/`).filter(file => file.endsWith('.js')).forEach(file => {
        if(file.split('.')[0] === Config.getArgs()[1]) {
            const cliFunction = require(`./functions/cli/${file}`);
            cliFunction.run();
            valid = true;
        }
    });
    if(!valid) {
        if(Config.getArgs()[1] !== undefined) {
            console.log(Chalk.red('Invalid command!'));
        }
        console.log(Chalk.blueBright('Use the command "npt help"'));
    }
}

run();