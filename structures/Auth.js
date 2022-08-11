const fs = require('fs');

class Config {
    constructor() {
        this.user = "";
        this.key = "";
    }

    setUser(user) {
        this.user = user;
    }

    setKey(key) {
        this.key = key;
    }

    getUser() {
        return this.user;
    }

    getKey() {
        return this.key;
    }

    toJSON() {
        return {
            user: this.user,
            key: this.key
        };
    }

    save() {
        fs.writeFileSync('./data/auth.json', JSON.stringify(this.toJSON()));
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