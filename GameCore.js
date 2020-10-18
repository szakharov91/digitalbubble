module.exports = GameCore = {
    PlayerCount: 0,
    PlayerList: {},
    CircleList: [],
    createRealm: () => {

    },

    createObject: () => {

    },

    packedPlayers: function () {
        let pack = [];
        for (let i in this.PlayerList) {
            if (this.PlayerList.hasOwnProperty(i)) {

                pack.push({
                    color: this.PlayerList[i].color,
                    x: this.PlayerList[i].x,
                    y: this.PlayerList[i].y,
                    id: this.PlayerList[i].id,
                    counter: this.PlayerList[i].counter
                });
            }
        }

        return pack;
    },

    moveCircles: () => {
        for (let i in this.CircleList) {
            if (this.CircleList.hasOwnProperty(i)) {
                if (this.CircleList[i].x <= 0 || this.CircleList[i].x >= config.PWIDTH || this.CircleList[i].y <= 0 || this.CircleList[i].y >= config.PHEIGHT) {
                    this.CircleList.splice(i, 1);
                    continue;
                }

                this.CircleList[i].move();
            }
        }
    },

    collideCircle(a, b) {
        let sum = a.radius + b.radius;
        let dist, xDirection, yDirection;
        if (a.radius >= b.radius) {
            xDirection = a.x - b.x;
            yDirection = a.y - b.y;
        } else if (a.radius < b.radius) {
            xDirection = b.x - a.x;
            yDirection = b.y - a.y;
        }

        dist = Math.sqrt(Math.pow(xDirection, 2) + Math.pow(yDirection, 2));

        return (dist <= sum);
    },

    changeDirectionFlow(circle1, circle2) {
        let x1, x2, y1, y2;
        x1 = circle1.spdX;
        x2 = circle2.spdX;
        y1 = circle1.spdY;
        y2 = circle2.spdY;

        circle1.spdX = x2;
        circle1.spdY = y2;

        circle2.spdX = x1;
        circle2.spdY = y1;
    }
};
