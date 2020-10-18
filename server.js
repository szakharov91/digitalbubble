const config = require('./config');
const Helper = require(__dirname + '/helpers.js');
const path = require('path');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const netIO = require('socket.io')(http);
let GameCore = require('./GameCore');
let Player = require('./Player');
let CircleDigit = require('./CircleDigit');

// Config public path of files css,js,html
let publicPath = path.resolve(__dirname, 'src');
app.use(express.static(publicPath));

// Main route of app
app.get('/', function (req, res) {
    res.sendFile('index.html', {root: publicPath});
});

app.get('*', function (req, res) {
    res.sendFile('404.html', {root: publicPath});
});

// Create and starting web server
http.listen(config.port, function () {
    console.log('Server running on *:' + config.port);
});

const PLAYER_RADIUS = 40;

GameCore.createRealm();

Helper.getCounterValue = function () {
    let min = (GameCore.PlayerCount !== 0) ? GameCore.getMinimalLevel() : 1;
    let max = (GameCore.PlayerCount !== 0) ? GameCore.getMaximumLevel() : 10;
    let result = Helper.getRandomInt(min - 1, (max + 10));

    return result;
};

GameCore.getMinimalLevel = function () {
    let arr = Object.values(GameCore.PlayerList);
    if (arr.length <= 1) {
        return arr[0].counter
    }
    return Math.min.apply(Math, arr.map(function (o) {
        return o.counter;
    }));
};

GameCore.getMaximumLevel = function () {
    let arr = Object.values(GameCore.PlayerList);

    if (arr.length <= 1) {
        return arr[0].counter;
    }

    return Math.max.apply(Math, arr.map(function (o) {
        return o.counter;
    }));
};

GameCore.createObject = function (typeObj, objectEntity) {
    redrawCircle = function (obj) {
        for (let i in GameCore.CircleList) {
            let distance = GameCore.distance(obj.x, GameCore.CircleList[i].x, obj.y, GameCore.CircleList[i].y) - obj.radius * 2;
            if (distance < 0 || distance <= obj.radius + GameCore.CircleList[i].radius) {
                obj.x = Math.random() * config.PWIDTH;
                obj.y = Math.random() * config.PHEIGHT;
                redrawCircle(obj);
            }
        }

        return obj;
    };
    switch (typeObj) {
        case 'CircleDigit':
            let xCoord = Helper.getRandomInt(0, config.PWIDTH);
            let yCoord = Helper.getRandomInt(0, config.PHEIGHT);
            let obj = new CircleDigit(Math.random() * 360, xCoord, yCoord);

            redrawCircle(obj);

            GameCore.CircleList[obj.id] = obj;
            break;
        case 'PlayerObject':
            let player = new Player(objectEntity.id, config.PWIDTH / 2, config.PHEIGHT / 2);
            GameCore.PlayerList[player.id] = player;
            GameCore.PlayerCount++;
            break;
    }
};

GameCore.packedPlayers = function () {
    let pack = [];
    for (let i in GameCore.PlayerList) {
        if (GameCore.PlayerList.hasOwnProperty(i)) {

            pack.push({
                color: GameCore.PlayerList[i].color,
                x: GameCore.PlayerList[i].x,
                y: GameCore.PlayerList[i].y,
                id: GameCore.PlayerList[i].id,
                counter: GameCore.PlayerList[i].counter
            });
        }
    }

    return pack;
};

GameCore.updateCircles = function () {

    let pack = [];

    for (let c in GameCore.CircleList) {
        if (GameCore.CircleList.hasOwnProperty(c)) {
            for (let k in GameCore.CircleList) {
                if (GameCore.CircleList.hasOwnProperty(k)) {
                    if (GameCore.CircleList[c].id !== GameCore.CircleList[k].id) {
                        if (GameCore.collideCircle(GameCore.CircleList[c], GameCore.CircleList[k])) {
                            GameCore.changeDirectionFlow(GameCore.CircleList[c], GameCore.CircleList[k]);
                        }
                    }
                }
            }

            let currCircle = GameCore.CircleList[c];
            if (currCircle.move()) {
                delete GameCore.CircleList[c];
                continue;
            }
            pack.push(currCircle);
        }
    }
    return pack;
};

GameCore.distance = (x1, x2, y1, y2) => {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};

GameCore.checkPlayerClick = (playerId, xCoord, yCoord) => {
    for (let i in GameCore.CircleList) {
        if (GameCore.CircleList.hasOwnProperty(i)) {
            let d = 0;
            let compare = GameCore.PlayerList[playerId].counter + 1;

            let x1, x2, y1, y2, r1, r2;
            x1 = (GameCore.CircleList[i].radius <= PLAYER_RADIUS) ? GameCore.PlayerList[playerId].x : GameCore.CircleList[i].x;
            x2 = (GameCore.CircleList[i].radius <= PLAYER_RADIUS) ? GameCore.CircleList[i].x : GameCore.PlayerList[playerId].x;
            y1 = (GameCore.CircleList[i].radius <= PLAYER_RADIUS) ? GameCore.PlayerList[playerId].y : GameCore.CircleList[i].y;
            y2 = (GameCore.CircleList[i].radius <= PLAYER_RADIUS) ? GameCore.CircleList[i].y : GameCore.PlayerList[playerId].y;
            r1 = (GameCore.CircleList[i].radius <= PLAYER_RADIUS) ? PLAYER_RADIUS : GameCore.CircleList[i].radius;
            r2 = (GameCore.CircleList[i].radius <= PLAYER_RADIUS) ? GameCore.CircleList[i].radius : PLAYER_RADIUS;

            d = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

            if (d > r1 + r2) {

            } else if ((d = 0 && r1 === r2) || (d < r1 - r2)) {

                if (compare === GameCore.CircleList[i].value) {
                    GameCore.PlayerList[playerId].counter = compare;
                    delete GameCore.CircleList[i];
                } else {
                    GameCore.PlayerList[playerId].counter = 1;
                }
                return;
            }

        }
    }
};

GameCore.onConnect = (socket) => {
    socket.on('PlayerMove', (data) => {
        GameCore.PlayerList[socket.id].updateMove(data.x, data.y);
    });

    socket.on('PlayerOnClick', (data) => {
        GameCore.checkPlayerClick(socket.id, data.x, data.y);
    });
};

GameCore.onDisconnect = (socket) => {
    delete GameCore.PlayerList[socket.id];
    GameCore.PlayerCount--;
};

let SocketList = {};

// Handle basic socket events (connect/disconnect)
netIO.sockets.on('connection', (socket) => {
    socket.id = Helper.getRandomInt(0, 999999);

    SocketList[socket.id] = socket;
    GameCore.createObject('PlayerObject', socket);

    if (GameCore.PlayerCount !== 0) {
        GameCore.getMinimalLevel()
    }

    socket.emit('sendGameConfigToClient',
        {
            'PWidth': config.PWIDTH,
            'PHeight': config.PHEIGHT
        }
    );

    GameCore.onConnect(socket);

    socket.on('disconnect', () => {
        GameCore.onDisconnect(socket);
        delete SocketList[socket.id];

    });
});

setInterval(() => {
    for (let i = 0; i < config.CreateBubbleCoefficient; i++) {
        GameCore.createObject('CircleDigit');
    }

    Helper.getCounterValue();
}, config.CreateBubbleInterval);

// Main game loop
setInterval(() => {
    GameCore.moveCircles();

    let pack = {
        circles: GameCore.updateCircles(),
        players: GameCore.packedPlayers()
    };


    for (let sock in SocketList) {
        if (SocketList.hasOwnProperty(sock)) {
            let socket = SocketList[sock];
            socket.emit('updatePositions', pack);
        }
    }
}, 1000 / 100);



