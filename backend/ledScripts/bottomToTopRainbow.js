const OPC = new require('../opc')
const lodash = require('lodash');
const {map, reverse} = lodash;

const grid = require('../grids/djboothGrid');
const hsvToRgb = require ('../libs/hsvToRgb');
const client = new OPC('djbooth.local', 7890);
let millis

function bottomToTopRainbow(millis) {
    millis = new Date().getTime();

    map(grid, (row, rowIndex) => {
        map(row, (pixel) => {
            const h = ((pixel * 0.2 + millis * 0.03) + (rowIndex + 50000)) % 360;
            const [red, green, blue] = hsvToRgb(h, 100, 100)

            client.setPixel(pixel, red, green, blue);
        });
    });

    client.writePixels();
}

module.exports = bottomToTopRainbow;
