const config = require(__dirname + '/config.js');
const Helper = require(__dirname + '/helpers.js');
const path = require('path');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const netIO = require('socket.io')(http);

// Config public path of files css,js,html
let publicPath = path.resolve(__dirname, 'src');
app.use(express.static(publicPath));

// Main route of app
app.get('/', function (req, res) {
    res.sendFile('index.html', {root: publicPath});
});

// Create and starting web server
http.listen(config.port, function () {
    console.log('Server running on *:' + config.port);
});

// Handle basic socket events (connect/disconnect)
netIO.sockets.on('connection', (socket) => {
    socket.id = Helper.getRandomInt(0, 999999);

    SocketList[socket.id] = socket;
    //console.log('Player with Socket:' + socket.id + ' connected!');

    socket.on('disconnect', () => {
        //console.log('Player with Socket:' + socket.id + ' disconnected!');
        delete SocketList[socket.id];
    });
});


let SocketList = {};
let PlayersList = {};

