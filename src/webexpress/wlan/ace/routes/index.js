var url        = require('url');
var http         = require('http');
var express      = require('express');
var bodyParser   = require('body-parser');
var isJSON       = require('wlanpub').isJSON;
var digest       = require('wlanpub').digest;
var config       = require('wlanpub').config;
var basic        = require('wlanpub').basic;
var getUserNewAttr = require('../../../../lib/public').getUserNewAttr;
var transHttpRequest = require('../../../../lib/public').transHttpRequest;
var querystring = require('querystring');
var multipart = require('multiparty');
var fs = require('fs');
var confEnv = require("../../../../config");

var jsonParser    = bodyParser.json();
var router        = express.Router();
var nodeEnv       = config.util.getEnv('NODE_ENV');
var getV2HostPort = basic.getV2HostPort;

router.all('/*', function(req, res, next){
    console.warn("req.body :"+ JSON.stringify(req.body));
    console.warn("req.cookies :" + JSON.stringify(req.cookies));
    req.query.locale = req.cookies.lang;
    next();
});

router.all('/oasis/*', function(req, res, next){
    console.warn('[oasis] the content of the input request:' +
        ' \n   headers: ' + JSON.stringify(req.headers) +
        ';\n   url: ' + JSON.stringify(req.url) +
        ';\n   method: ' + JSON.stringify(req.method) +
        ';\n   cookies: ' + JSON.stringify(req.cookies) + 
        ';\n   session: ' + JSON.stringify(req.session) +
        ';\n   query: ' + JSON.stringify(req.query) +
        ';\n   body: ' + JSON.stringify(req.body));
    var pathname = url.parse(req.url).pathname.slice(6);
    console.warn("cccccc"+req.headers["content-type"]);
    //if (('/auth-data/o2oportal/themetemplate/upload' == pathname)||('/oasis-rest-map/restapp/uploadfile/imageUpload' == pathname)) 
    if ((req.headers["content-type"])&&(req.headers["content-type"].indexOf("multipart") >= 0))
    {
        var form = new multipart.Form();
        console.warn("uploadimage");
        form.parse(req, function(err, fields, files) {
            if (err) {
                console.error('Error: ' + err);
                return;
            }
            console.warn(fields);
            console.warn(files);
            var query = req.query;
            var options = {
                host: confEnv.oasis.host,
                port: confEnv.oasis.port,
                path: pathname + '?' + querystring.stringify(query),
                method: req.method
            };
            options.headers = req.headers;
            if (req.socket && req.socket.remoteAddress) {
                var iparray = req.socket.remoteAddress.split(':');
                options.headers['x-real-ip'] = iparray[3];
            }

            if ("{}" == JSON.stringify(query) || null == query || undefined == query) {
                options.path = pathname;
            }
            if (req.session && req.session.cas_user
                && req.session.cas_user.attributes && req.session.cas_user.attributes.name){
                if (query && query.user_name) {
                    query.user_name = req.session.cas_user.attributes.name;
                    options.path = pathname + '?' + querystring.stringify(query);
                } else if ("{}" == JSON.stringify(query) || null == query || undefined == query){
                    options.path = pathname + '?user_name=' + req.session.cas_user.attributes.name;
                } else {
                    options.path += '&user_name=' + req.session.cas_user.attributes.name;
                }
            }
            options.timeout = 180000;
            console.warn('[oasis] the options of the request to be sent: ' + JSON.stringify(options));
            var interval  = Date.now();
            var request = http.request(options, function(response) {
                var resData = '';
                response.on('data', function (chunk) {
                    resData += chunk;
                });
                response.on('end', function() {
                    if (!res.finished) {
                        /*if (undefined != response.headers['Content-type']) {
                         res.type(response.headers['Content-type']);
                         }*/
                        interval = Date.now() - interval;
                        console.warn('[oasis] Receice response from v2 service:'
                            + response.statusCode + ', spent time: ' + interval
                            + 'ms, the request url:' + req.url
                            + ',respone headers:' + JSON.stringify(response.headers)
                            + ' response data: ' + resData);
                        res.writeHead(response.statusCode, response.headers);
                        res.write(resData);
                        res.end();
                    }
                });
                response.on('error', function(err) {
                    console.error('[oasis] Failed to get the response with error: ' + err);
                });
            });
            var typeArray = req.headers['content-type'].split(';');
            var boundary = typeArray[1].slice(10);
            for (var key in files) {
                files[key].forEach(function(fileInfo) {
                    var payload = '\r\n--' + boundary + '\r\n'
                        + 'Content-Disposition: form-data; name="name"\r\n\r\n'
                        + '\r\n--' + boundary + '\r\n'
                        + 'Content-Disposition: form-data; name="'
                        + fileInfo.fieldName + '"; filename="'
                        + "aaa." + fileInfo.originalFilename.split(".")[fileInfo.originalFilename.split(".").length-1]+ '"\r\n'
                        + 'Content-Type: image/jpeg\r\n\r\n';
                        //originalFilename临时修改aaa 2017-1-14
                    var endData = '\r\n--' + boundary + '--\r\n';
                    var contentLen = payload.length + endData.length + fs.statSync(fileInfo.path).size;
                    request.setHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
                    request.setHeader('Content-Length', contentLen);
                    console.warn('[oasis] the content length: ' + contentLen + ', the upload payload: ' + payload);
                    request.write(payload);
                    var fileStream = fs.createReadStream(fileInfo.path, { bufferSize: 4 * 1024 });
                    fileStream.pipe(request, {end: false});
                    fileStream.on('end', function() {
                        fs.unlink(fileInfo.path);
                        request.end(endData);
                        console.warn('[oasis] upload file done!' + endData);

                    });
                });
            }
            request.on('error', function(err) {
                console.error('[oasis] Failed to translate the request with error: ' + err);
            });
        });
    } else {
        transHttpRequest(req, res, pathname, true);
    }
});

router.all('/o2oportal/*', function(req, res, next){
    console.warn('[o2oportal] the content of the input request:' +
        ' \n   headers: ' + JSON.stringify(req.headers) +
        ';\n   url: ' + JSON.stringify(req.url) +
        ';\n   method: ' + JSON.stringify(req.method) +
        ';\n   cookies: ' + JSON.stringify(req.cookies) +
        ';\n   session: ' + JSON.stringify(req.session) +
        ';\n   query: ' + JSON.stringify(req.query) +
        ';\n   body: ' + JSON.stringify(req.body));
    var pathArray = url.parse(req.url).pathname.slice(1).split('/');
    console.warn('[o2oportal] parsed the input request url and checked out the path array: ' + pathArray);

    if (pathArray[1] == '' || pathArray[1] == undefined) {
        res.status(404).end();
        return;
    }
    if (req.session && req.session.cas_user && req.session.cas_user.attributes && req.session.cas_user.attributes.name) {
        getUserNewAttr(req.session.cas_user.attributes.name, function(bUserNew) {
            var options;
            if (bUserNew) {
                options = {
                    host: confEnv.o2oportal.host,
                    port: confEnv.o2oportal.port
                };
            } else {
                if (req.session && req.session.bUserTest == 'true') {
                    options = {
                        host: process.env.WEBSERVER_CONFIG_O2OPORTAL_IP_4O || config.get('o2oPortalIp4OTest'),
                        port: process.env.WEBSERVER_CONFIG_O2OPORTAL_PORT_4O || config.get('o2oPortalPort4OTest')
                    };
                } else {
                    options = {
                        host: process.env.WEBSERVER_CONFIG_O2OPORTAL_IP_4OTEST || config.get('o2oPortalIp4O'),
                        port: process.env.WEBSERVER_CONFIG_O2OPORTAL_PORT_4OTEST || config.get('o2oPortalPort4O')
                    };
                }
            }
            options.method  = req.method;
            options.path    = req.url;
            options.headers = req.headers;

            console.warn('[o2oportal] the options of the request to be sent: ' + JSON.stringify(options));
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
                        console.warn('[o2oportal] Receice response from v2 service:'
                            + response.statusCode +  ', spent time: ' + interval
                            + 'ms, the request url:' + req.url
                            + ', response data: ' + resData);
                    }
                });
                response.on('error', function(err) {
                    console.error('[o2oportal] Failed to translate o2oportal response with error: ' + err);
                });
            });
            request.write(JSON.stringify(req.body));
            request.end();
            request.on('error', function(err) {
                console.error('[o2oportal] Failed to translate o2oportal request with error: ' + err);
            });
        });
    }
});

router.all(jsonParser, function(req, res, next) {
    var myRequest = digest;
    if (nodeEnv.toLowerCase() == 'production' || nodeEnv.toLowerCase() == 'v3webtest') {
        myRequest = v2Request;
    }
    var bUserTest = 'false';
    if (req.session && req.session.bUserTest == 'true') {
        bUserTest = 'true';
    }
    var myOption  = getV2HostPort(bUserTest);
    myOption.headers = {};
    myOption.headers['accept'] = 'application/json';
    myOption.method = req.method;
    myOption.path   = req.url;

    myRequest(myOption, req.body, res, function(response) {
        var resData = '';
        response.on('data', function (chunk) {
            resData += chunk;
        });
        response.on('end', function () {
            if (!res.finished) {
              if (isJSON(resData)) {
                  res.type('application/json');
              }
              res.write(resData);
              res.end();
            }
        });
        response.on('error', function (err) {
            console.error('http-digest-client error: ', err);
        });
    });
});

function v2Request(options, body, res1, callback) {
    var req = http.request(options, function (res) {
        callback(res);
    });
    req.end(JSON.stringify(body));
    req.on('error', function(err) {
        console.error(new Date() + '[v2Request] req on error. req.path = ' + req.path);
        console.error('[v2Request] req.url: ' + req.url);
        console.error('[v2Request] req.headers: ' + req.headers);
        console.error('[v2Request] req.method: ' + req.method);
        console.error('[v2Request] err.stack: ' + err.stack);
        console.error('[v2Request] err.code: ' + err.code);
    });
}

module.exports = router;