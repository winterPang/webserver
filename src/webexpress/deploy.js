var express    = require('express');
var bodyParser = require('body-parser');
var fs         = require('fs-extra');
var path       = require('path');
var util       = require('util');
var formidable = require('formidable');
var url         = require('url');
var config     = require('wlanpub').config;
var conf       = require('../config');
var http         = require('http');
var querystring = require('querystring');
var cas_auth     = require('../lib/cas');
var service_url  = conf.url.service_url;
var cookieParser = require('cookie-parser');
var trustIpArray = config.get('trustIpArray');
var uploadDir    = __dirname + config.get('uploadDir');
var defaul     = require('./default/routes/default');
var session      = require('express-session');
var redisStore   = require('connect-redis')(session);
var dbhd         = require('wlanpub').dbhd;
var app = express();

app.use(cookieParser());

var sess = {
    store             : new redisStore({ client : dbhd.redisClient}),
    secret            : 'h3c secret key',
    resave            : false,
    saveUninitialized : true,
    cookie            : { maxAge : config.get('cookieTmpAge'), secure : false }
};

app.use(session(sess));

var cas = new cas_auth({
    cas_url         : "http://oasis-rd.h3c.com/cas",
    service_url     : conf.url.service_url,
    login_url       : conf.url.login_url,
    cookie_age      : config.get('cookieSuccessAge'),
    dev_cookie_age  : config.get('devCookieAge'),
    allow_origin    : conf.url.allow_origin,
    user_type       : config.get('user_type'),
    destroy_session : true
});

app.use(function(req,res,next){
    if (req.path.indexOf('/v3/base/userauth') == 0)
    {    
        console.error("[HTTP]/v3/base/userauth/cas");
        cas.bounce(req,res,next)
    }
    else
    {
        next();
    }
});

// app.use('/v3/base/userauth', function(req, res, next){
//     console.error("[HTTP]/v3/base/userauth/end");
//     next();
// })

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(function(req,res,next){
    if (req.path.indexOf('/v3/base/userauth') == 0)
    {    
        console.error("[HTTP]/v3/base/userauth/defaul");
        defaul(req,res,next)
    }
    else
    {
        next();
    }
});

app.all('/o2o/*', function(req, res, next) {
    var data = "";

    req.on('data', function(chunk) {
        data += chunk;
    });
    req.on('end', function() {
        console.log('[o2o] the content of the input request:' +
            ' \n   headers: ' + JSON.stringify(req.headers) +
            ';\n   url: ' + JSON.stringify(req.url) +
            ';\n   method: ' + JSON.stringify(req.method) +
            ';\n   cookies: ' + JSON.stringify(req.cookies) +
            ';\n   session: ' + JSON.stringify(req.session) +
            ';\n   query: ' + JSON.stringify(req.query) +
            ';\n   body: ' + data);

        var pathname = url.parse(req.url).pathname;
        if (pathname.indexOf('/o2o/icloud/regdev') == 0 || '/o2o/o2oCloud' == pathname) {
            pathname = '/oasis-ws-v2' + pathname;
            var query = req.query;
            var options = {
                host: process.env.LVZHOUV3_CONFIG_OASIS_IP || config.get('oasisIp'),
                port: process.env.LVZHOUV3_CONFIG_OASIS_PORT || config.get('oasisPort'),
                path: pathname + '?' + querystring.stringify(query),
                method: req.method
            };
            options.headers = req.headers;

            if ("{}" == JSON.stringify(query) || null == query || undefined == query) {
                options.path = pathname;
            }

            console.log('[oasis] the options of the request to be sent: ' + JSON.stringify(options));
            var request = http.request(options, function(response) {
                var resData = '';
                response.on('data', function (chunk) {
                    resData += chunk;
                });
                response.on('end', function() {
                    if (!res.finished) {
                        console.log('[oasis] Receice response from v2 service:'
                            + response.statusCode+ ',respone headers:' + JSON.stringify(response.headers)
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
            request.write(data);
            request.end();
            request.on('error', function(err) {
                console.error('[oasis] Failed to translate the request with error: ' + err);
            });
        } else {
            res.status(404).end();
        }
    });
});

app.use(function(req, res, next) {
    if (isTrustClient(req)) {
        console.log('trust client');
        next();
    }else {
        console.log('not trust client');
        res.writeHead(302, {'Location': service_url});
        res.end();
    }
});

app.use('/favicon.ico', function (req, res, next) {
    console.log(new Date() + '/favicon.ico');
    res.end('/favicon.ico');
});

app.use('/v3/ace/upload', function (req, res, next) {
    console.log('receive http message. /v3/ace/upload');
    console.log('req.originalUrl = ' + req.originalUrl);
    var form = new formidable.IncomingForm();
    form.encoding  = 'utf-8';
    form.uploadDir = uploadDir;
    form.keepExtensions = true;
    form.on('fileBegin', function(name, file) {
        file.path = uploadDir + name;
        var dirName = path.dirname(file.path);
        if (!fs.existsSync(dirName)) {
            //console.log('mkdir: ' + dirName);
            fs.mkdirsSync(dirName);
        }
    });
    form.parse(req, function(err, fields, files) {
        if (err) {
            console.error('form parse error: ' + err);
            res.status(400).end('form parse failed');
            return;
        }
        res.writeHead(200, {'content-type': 'text/plain'});
        res.end('received upload success');
        //res.end(util.inspect({fields: fields, files: files}));
    });
});

app.post('/v3/ace/eventarray', function (req, res, next) {
    console.log('receive http message. /v3/ace/eventarray');
    console.log('req.originalUrl = ' + req.originalUrl);
    var eventArray = req.body;
    if (eventArray && eventArray.length) {
        //res.end(JSON.stringify(eventArray));
        res.end('received eventarray success');
        console.log('eventArray = ' + JSON.stringify(eventArray));
        procEventArray(eventArray);
    }else {
        res.status(400).end('unexpected eventarray');
        console.warn('received unexpected eventarray message: ' + JSON.stringify(eventArray));
    }
});

app.use(function(req, res, next) {
    console.log('access default');
    res.status(404).end();
});

function isTrustClient(req) {
    if (req && req.socket && req.socket.remoteAddress) {
        console.log('req.socket.remoteAddress: ' + req.socket.remoteAddress);
        for(var i = 0; i < trustIpArray.length; i++) {
            if (req.socket.remoteAddress == trustIpArray[i]) {
                return true;
            }
        }
    }
    return false;
}

function procEventArray(eventArray) {
    if (eventArray && eventArray.length) {
        for (var i = 0; i < eventArray.length; i++) {
            var msg = eventArray[i];
            if (msg.event && msg.path) {
                var myPath = uploadDir + msg.path;
                console.warn('%s: %s', msg.event, myPath);
                if (msg.event == 'unlinkDir' || msg.event == 'unlink') {
                    console.log('remove: ' + myPath);
                    fs.removeSync(myPath);
                } else {
                    console.log('ignore and do nothing');
                }
            }else {
                console.error('event or path in eventarray message is undefined. msg: ' + msg);
            }
        }
    }else {
        console.error('received unexpected eventarray message: ' + JSON.stringify(eventArray));
    }
}

module.exports = app;