// Import required libraries
let args = require('minimist')(process.argv.slice(2));
let extend = require('extend');

let environment = args.env || 'test';

let common_config = {
    name: 'DigitalBubble Multiplayer Game',
    environment: environment
};

let conf = {
    prod: {
        port: args.port || 3000,
        speed_index: 10,
        PWIDTH: 1920,
        PHEIGHT: 1080,
        CreateBubbleInterval: 100,
        CreateBubbleCoefficient: 5,
    },
    test: {
        port: args.port || 3031,
        speed_index: 3,
        PWIDTH: 1920,
        PHEIGHT: 1080,
        CreateBubbleInterval: 500,
        CreateBubbleCoefficient: 3,
    }
};

extend(false, conf.prod, common_config);
extend(false, conf.test, common_config);

module.exports = config = conf[environment];



