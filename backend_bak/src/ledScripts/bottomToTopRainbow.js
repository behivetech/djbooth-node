import {map} from 'lodash';
var millis = new Date().getTime();

function bottomToTopRainbow(millis) {
    _map(grid, (row, rowIndex) => {
        _map(row, (pixel) => {
            const h = ((pixel * 0.2 + millis * 0.03) + (rowIndex + 50000)) % 360;
            const [red, green, blue] = hsvToRgb(h, 100, 100)

            client.setPixel(pixel, red, green, blue);
        });
    });

    //test

    client.writePixels();
}
