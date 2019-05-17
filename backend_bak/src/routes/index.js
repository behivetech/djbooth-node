import express from 'express';
import OPC from '../libs/opc';

import sideRainbow from '../ledScripts/sideRainbow';

const router = express.Router();
const client = new OPC('djbooth.local', 7890);
let interval;

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(client)
    console.log(req)
    clearInterval(interval)
    res.send('Side Rainbow!');
    // res.render('index', { title: 'LED Sripts' });
    interval = setInterval(sideRainbow, 30);
});

export default router;
