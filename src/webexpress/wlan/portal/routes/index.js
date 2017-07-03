var url      = require('url');
var http     = require('http');
var express  = require('express');
var config   = require('wlanpub').config;
var isJSON   = require('wlanpub').isJSON;

var router   = express.Router();
//var nodeEnv  = config.util.getEnv('NODE_ENV');
//var nodeTest  = config.util.getEnv('NODE_TEST');

router.all('/*', function(req, res, next){
    console.warn('[portal] the content of the input request:' +
        ' \n   headers: ' + JSON.stringify(req.headers) +
        ';\n   url: ' + JSON.stringify(req.url) +
        ';\n   method: ' + JSON.stringify(req.method) +
        ';\n   cookies: ' + JSON.stringify(req.cookies) +
        ';\n   session: ' + JSON.stringify(req.session) +
        ';\n   query: ' + JSON.stringify(req.query) +
        ';\n   body: ' + JSON.stringify(req.body));
    var pathArray = url.parse(req.url).pathname.slice(1).split('/');
    console.warn('[portal] parsed the input request url and checked out the path array: ' + pathArray);

    if (pathArray[0] == '' || pathArray[0] == undefined) {
        res.status(404).end();
        return;
    }
    var options = {
        host: process.env.LVZHOUV3_CONFIG_PORTAL_IP || config.get('portalIp'),
        port: process.env.LVZHOUV3_CONFIG_PORTAL_PORT || config.get('portalPort'),
        path: '/portal' + req.url,
        method: req.method
    };

    if (req.session && req.session.bUserTest == 'true') {
        options.host = process.env.LVZHOUV3_CONFIG_PORTAL_IP_TEST || config.get('portalIpTest');
        options.port = process.env.LVZHOUV3_CONFIG_PORTAL_PORT_TEST || config.get('portalPortTest');
    }
    options.headers = req.headers;

    console.warn('[portal] the options of the request to be sent: ' + JSON.stringify(options));
    var interval  = Date.now();
    var request = http.request(options, function(response) {
        var resData = '';
        response.on('data', function (chunk) {
            resData += chunk;
        });
        response.on('end', function() {
            if (!res.finished) {
                interval = Date.now() - interval;
                res.writeHead(response.statusCode, response.headers);
                res.write(resData);
                res.end();
                console.warn('[portal] Receice response from v2 service:'
                    + response.statusCode+  ', spent time: ' + interval
                    + 'ms, the request url:' + req.url
                    + ', response data: ' + resData);
            }
        });
        response.on('error', function(err) {
            console.error('[portal] Failed to translate portal response with error: ' + err);
        });
    });

    request.write(JSON.stringify(req.body));
    request.end();
    request.on('error', function(err) {
        console.error('[portal] Failed to translate portal request with error: ' + err);
    });
});

module.exports = router;