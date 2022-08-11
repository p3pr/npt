const AppData = require("./functions/AppData");
const Chalk = require("chalk");

async function run() {
    await AppData.run();
    const Config = require("./structures/Config").getInstance();
    if(Config.getArgs()[0].includes("node")) {
        Config.setArgs(Config.getArgs().slice(1));
    }
    if(Config.getArgs()[1] === "auth") {
        console.log(Chalk.green("Beginning authentication..."));
        const Auth = require("./functions/Auth");
        await Auth.run();
    } else {
        if(!Config.getAuthenticated()) {
            console.log(Chalk.red('Please authenticate yourself!'));
            console.log(Chalk.blueBright('Use the command "npt auth"'));
            return false;
        }
    }
}

run();