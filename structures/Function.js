function RunFunction() {}

class Function {
    /**
     *
     * @typedef {{run: RunFunction}} Options
     * @param {Options} func
     * @param {String} desc
     * @param {String} usage
     */
    constructor(func, desc, usage) {
        this.run = func.run;
        this.description = desc;
        if(usage !== "") {
            this.usage = usage + " ";
        } else {
            this.usage = usage;
        }
    }

    /**
     *
     * @returns {String}
     */
    getDescription() {
        return this.description;
    }

    /**
     * @returns {String}
     */
    getUsage() {
        return this.usage;
    }
}

module.exports = Function;