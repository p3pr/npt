const fs = require('fs');

class Config {
    constructor() {
        this.server = "http://localhost:3000";
        this.authenticated = false;
        this.args = [];
    }

    setServer(server) {
        this.server = server;
    }

    setAuthenticated(authenticated) {
        this.authenticated = authenticated;
    }

    getServer() {
        return this.server;
    }

    getAuthenticated() {
        return this.authenticated;
    }

    toJSON() {
        return {
            server: this.server,
            authenticated: this.authenticated
        };
    }

    convert(json) {
        this.server = json.server;
        this.authenticated = json.authenticated;
    }

    setArgs(args) {
        this.args = args;
    }

    getArgs() {
        return this.args;
    }

    save() {
        fs.writeFileSync('./data/config.json', JSON.stringify(this.toJSON()));
    }
}

class ConfigSingleton {
    constructor() {
        throw new Error('Use Singleton.getInstance()');
    }

    static getInstance() {
        if (!ConfigSingleton.instance) {
            ConfigSingleton.instance = new Config();
        }
        return ConfigSingleton.instance;
    }
}
module.exports = ConfigSingleton;