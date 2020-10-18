module.exports = class Player {
    constructor(id, xCoord, yCoord) {
        this.x = xCoord;
        this.y = yCoord;
        this.id = id;
        this.number = "" + Math.floor(10 * Math.random());
        this.color = Helper.getRandomColor();
        this.counter = 1;
    }

    updateMove(x, y) {
        this.x = x;
        this.y = y;
    }
};