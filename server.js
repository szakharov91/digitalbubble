const config = require('./config');
const Helper = require(__dirname + '/helpers.js');
const path = require('path');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const netIO = require('socket.io')(http);
let GameCore = require('./GameCore');
let CircleDigit = require('./CircleDigit');

GameCore.createRealm();

GameCore.createObject = function (typeObj) {
    switch (typeObj) {
        case 'CircleDigit':
            let obj = new CircleDigit(Math.random() * 360);
            GameCore.CircleList[obj.id] = obj;
            break;
    }
};

GameCore.detectCollision = function () {

};

GameCore.updateCircles = function () {
    let pack = [];

    for (let c in GameCore.CircleList) {
        if (GameCore.CircleList.hasOwnProperty(c)) {

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

let SocketList = {};

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

// Handle basic socket events (connect/disconnect)
netIO.sockets.on('connection', (socket) => {
    socket.id = Helper.getRandomInt(0, 999999);

    SocketList[socket.id] = socket;
    socket.emit('sendGameConfigToClient',
        {
            'PWidth': config.PWIDTH,
            'PHeight': config.PHEIGHT
        }
    );
    //console.log('Player with Socket:' + socket.id + ' connected!');

    socket.on('disconnect', () => {
        //console.log('Player with Socket:' + socket.id + ' disconnected!');
        delete SocketList[socket.id];
    });
});

setInterval(() => {
    for (let i = 0; i < config.CreateBubbleCoefficient; i++) {
        GameCore.createObject('CircleDigit');
    }
}, config.CreateBubbleInterval);

// Main game loop
setInterval(() => {
    GameCore.moveCircles();

    let pack = {
        circles: GameCore.updateCircles()
    };


    for (let sock in SocketList) {
        if (SocketList.hasOwnProperty(sock)) {
            let socket = SocketList[sock];
            socket.emit('updatePositions', pack);
        }
    }
}, 1000 / 100);



