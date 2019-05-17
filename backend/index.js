const express = require('express')
const OPC = new require('./opc')
const WebSocket = require('ws');
const bottomToTopRainbow = require('./ledScripts/bottomToTopRainbow');

const client = new OPC('djbooth.local', 7890);
const model = OPC.loadModel(process.argv[2] || './grid32x16z.json');

const app = express()
const port = 3333
let interval;

app.get('/', (req, res) => {
    clearInterval(interval)
    interval = setInterval(bottomToTopRainbow, 30);
    res.send('Bottom To Top Rainbow!')
})

app.get('/particle', (req, res) => {
    clearInterval(interval)
    interval = setInterval(particleRainbow, 30);
    res.send('particleRainbow!')
});

app.get('/ws', (req, res) => {
    res.send('websocket open')
    ws = new WebSocket("ws://djbooth.local:7890");

    ws.on('connection', function connection(ws) {
        ws.on('message', function incoming(message) {
            console.log('received: %s', message);
        });

        ws.send(JSON.stringify({type: 'list_connected_devices'}));
    });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

function particleRainbow() {
    // strip_redblue();
    bottomToTopRainbow();
}

function strip_redblue() {
    var millis = new Date().getTime();

    for (var pixel = 0; pixel < 512; pixel++)
    {
        var t = pixel * 0.2 + millis * 0.002;
        var red = 128 + 96 * Math.sin(t);
        var green = 128 + 96 * Math.sin(t + 0.1);
        var blue = 128 + 96 * Math.sin(t + 0.3);

        client.setPixel(pixel, red, green, blue);
    }
    client.writePixels();
}

function particle_trail() {
    var time = 0.0009 * new Date().getTime();
    var numParticles = 200;
    var particles = [];

    for (var i = 0; i < numParticles; i++) {
        var s = i / numParticles;

        var radius = 0.2 + 1.5 * s;
        var theta = time + 0.04 * i;
        var x = radius * Math.cos(theta);
        var y = radius * Math.sin(theta + 10.0 * Math.sin(theta * 0.15));
        var hue = time * 0.1 + s * 0.2;

        particles[i] = {
            point: [x, 0, y],
            intensity: 0.2 * s,
            falloff: 60,
            color: OPC.hsv(hue, 1, 0.8)
        };
    }

    client.mapParticles(particles, model);
}
