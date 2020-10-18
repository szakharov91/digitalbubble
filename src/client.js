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

        ctx.beginPath();
        ctx.arc(data['circles'][i].x, data['circles'][i].y, data['circles'][i].radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = data['circles'][i].color;
        ctx.lineWidth = 3;
        ctx.strokeStyle = data['circles'][i].color;
        ctx.stroke();
        //ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = data['circles'][i].color;
        ctx.font = '20px Tahoma';

        ctx.fillText("" + data['circles'][i].value, data['circles'][i].x - 5, data['circles'][i].y + 10);
        ctx.fill();
        ctx.closePath();
    }

    for(let i = 0; i < data['players'].length; i++) {
        ctx.beginPath();
        ctx.arc(data['players'][i].x, data['players'][i].y, 40, 0, 2 * Math.PI, false);
        ctx.fillStyle = data['players'][i].color;
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#FFF';
        ctx.stroke();
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = '#000';
        ctx.font = '20px Tahoma';
        ctx.style = ''
        ctx.fillText("" + data['players'][i].counter, data['players'][i].x, data['players'][i].y);
        ctx.fill();
        ctx.closePath();
    }
});

canvas.onmousemove = function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    socket.emit('PlayerMove', {x: mouseX, y: mouseY});
};

canvas.onclick = function (e) {
    socket.emit('PlayerOnClick', {x: e.clientX, y: e.clientY});
};

canvas.onmouseenter = function () {
    document.body.style.cursor = 'none';
};

canvas.onmouseleave = function () {
    document.body.style.cursor = 'default';
};
