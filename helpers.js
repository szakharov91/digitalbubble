class helpers {}

helpers.getRandomInt = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

helpers.getRandomColor = function() {
    const colorHex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F',];
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += colorHex[Helper.getRandomInt(0, 15)];
    }

    return color;
};

module.exports = Helper = helpers;