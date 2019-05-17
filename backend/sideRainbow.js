function draw() {
    var millis = new Date().getTime();

    for (var pixel = 0; pixel < 512; pixel++)
    {
        var t = pixel * 0.2 + millis * 0.002;
        var red = 128 + 96 * Math.sin(t -0.9);
        var green = 128 + 96 * Math.sin(t + 0.5);
        var blue = 128 + 96 * Math.sin(t + 0.9);

        client.setPixel(pixel, red, green, blue);
    }
    client.writePixels();
}
