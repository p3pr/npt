function RunFunction() {}

class Route {
    /**
     *
     * @typedef {{run: RunFunction}} Options
     * @param {Options} func
     */
    constructor(func) {
        this.run = func.run;
    }
}

module.exports = Route;