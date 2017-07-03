var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var multiparty = require('multiparty');
var util = require('util');
var request = require('request');
var jsonParser = bodyParser.json();
var router = express.Router();
var filesave = require('../lib/filesave');

request.debug = false;

router.post('/getMap', function (req, res, next) {
    console.warn("image/getMap");
    console.warn(JSON.stringify(req.body));
    var oDate = req.body;
    filesave.getMapBase64(oDate.devSN, oDate.mapName, res);
})

router.all('/*', function (req, res, next) {
    res.status(404).end();
});

module.exports = router;