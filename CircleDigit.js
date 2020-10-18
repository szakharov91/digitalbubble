module.exports = class CircleDigit {
    constructor(angle, xCoord, yCoord) {
        this.id = Math.random();
        this.x = xCoord;
        this.y = yCoord;
        this.spdX = Math.cos(angle / 180 * Math.PI) * config.speed_index;
        this.spdY = Math.sin(angle / 180 * Math.PI) * config.speed_index;
        this.radius = Helper.getRandomInt(9, 20) * Math.PI;
        this.color = Helper.getRandomColor();
        this.value = Helper.getCounterValue();
    }

    move() {

        this.x += this.spdX;
        this.y += this.spdY;

        return (this.x <= 0 || this.x >= config.PWIDTH || this.y <= 0 || this.y >= config.PHEIGHT);
    }
};
