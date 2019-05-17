const express = require('express')
var OPC = new require('./opc')
const WebSocket = require('ws');

var client = new OPC('djbooth.local', 7890);
var model = OPC.loadModel(process.argv[2] || './grid32x16z.json');

const app = express()
const port = 3333
let interval;
app.get('/', (req, res) => {
    clearInterval(interval)
    interval = setInterval(strip_redblue, 30);
    res.send('Strip Red Blue!')
})

app.get('/particle', (req, res) => {
    clearInterval(interval)
    interval = setInterval(particle_trail, 30);
    res.send('particle_trail!')
})

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
    var time = 0.009 * new Date().getTime();
    var numParticles = 200;
    var particles = [];

    for (var i = 0; i < numParticles; i++) {
        var s = i / numParticles;

        var radius = 0.2 + 1.5 * s;
        var theta = time + 0.04 * i;
        var x = radius * Math.cos(theta);
        var y = radius * Math.sin(theta + 10.0 * Math.sin(theta * 0.15));
        var hue = time * 0.01 + s * 0.2;

        particles[i] = {
            point: [x, 0, y],
            intensity: 0.2 * s,
            falloff: 60,
            color: OPC.hsv(hue, 0.5, 0.8)
        };
    }

    client.mapParticles(particles, model);
}
