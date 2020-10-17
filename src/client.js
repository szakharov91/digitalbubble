let socket = io();
let canvas = document.getElementById("GameArea");
let ctx = canvas.getContext('2d');
let configuration = [];


socket.on('sendGameConfigToClient', function (config) {
    configuration = config;
});

canvas.width = WIDTH = document.documentElement.clientWidth;
canvas.height = HEIGHT = document.documentElement.clientHeight;

socket.on('updatePositions', function (data) {
    ctx.clearRect(0, 0, configuration.PWidth, configuration.PHeight);

    for (let i = 0; i < data['circles'].length; i++) {
        console.log(data['circles'][i]);

        ctx.beginPath();
        ctx.arc(data['circles'][i].x, data['circles'][i].y, data['circles'][i].radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = data['circles'][i].color;
        ctx.lineWidth = 3;
        ctx.strokeStyle = data['circles'][i].color;
        ctx.stroke();
        //ctx.fill();
        ctx.closePath();

        // ctx.beginPath();
        // ctx.fillStyle = data[i].color;
        // ctx.font = '20px Tahoma';
        //
        // ctx.fillText("" + data[i].value, data[i].x - 5, data[i].y + 10);
        // ctx.fill();
        // ctx.closePath();
    }
});