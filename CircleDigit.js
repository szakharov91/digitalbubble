module.exports = class CircleDigit {
    constructor(angle) {
        this.id = Math.random();
        this.x = Helper.getRandomInt(0, config.PWIDTH);
        this.y = Helper.getRandomInt(0, config.PHEIGHT);
        this.spdX = Math.cos(angle / 180 * Math.PI) * config.speed_index;
        this.spdY = Math.sin(angle / 180 * Math.PI) * config.speed_index;
        this.radius = Helper.getRandomInt(9, 20) * Math.PI;
        this.color = '#' + this.getRandomColor();
        //this.value = Helper.getRandomInt(0, Helper.getCounterValue());
    }

    getRandomColor() {
        const colorHex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F',];
        let color = '';
        for (let i = 0; i < 6; i++) {
            color += colorHex[Helper.getRandomInt(0, 15)];
        }

        return color;
    }

    move() {

        this.x += this.spdX;
        this.y += this.spdY;

        return (this.x <= 0 || this.x >= config.PWIDTH || this.y <= 0 || this.y >= config.PHEIGHT);
    }
};
