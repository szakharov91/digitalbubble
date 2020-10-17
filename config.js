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
        port: args.port || 3000
    },
    test: {
        port: args.port || 3031
    }
};

extend(false, conf.prod, common_config);
extend(false, conf.test, common_config);

module.exports = config = conf[environment];



