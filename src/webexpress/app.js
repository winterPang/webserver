var config       = require('wlanpub').config;
var express      = require('express');
var session      = require('express-session');
var redisStore   = require('connect-redis')(session);
var path         = require('path');
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var cas_auth     = require('../lib/cas');
var dbhd         = require('wlanpub').dbhd;
var log4js       = require('wlanpub').log4js;
var conf         = require('../config');

var zipkin = require('wlanpub').zipkin;


var ace        = require('./wlan/ace/routes/index');
var web        = require('./wlan/web/routes/index');
var rd         = require('./wlan/rd/routes/index');
var ant        = require('./wlan/ant/routes/index');
var jag        = require('./wlan/jag/routes/index');
var inverted   = require('./wlan/inverted/routes/index');
var wloc       = require('./wlan/wloc/routes/index');
var arb        = require('./wlan/arb/routes/index');
var fs         = require('./wlan/fs/routes/index');
var portal     = require('./wlan/portal/routes/index');
var api        = require('./wlan/api/routes/index');
var iotweb     = require('./wlan/iotweb/routes/index');
var defaul     = require('./default/routes/default');

var app = express();

var request = require('request');
app.use(function (req, res, next) {
    var path = req.path;
    if (path.startsWith("/fs")) {
        var target_path = path.replace("/fs", "https://oasisrdauth.h3c.com");
        request(target_path).pipe(res);
        // request.get({url: target_path}, function (err, resp) {
        //         res.set(resp.headers);
        //         res.send(resp.body);
        //         res.end();
        // })
    }else{
        next();
    }
});

app.use(cookieParser());

// 配置日志打印express的消息
var logger = log4js.getLogger('https');
app.use(log4js.connectLogger(logger, config.get('log4jsConnect')));

var isSecure = true;
if (conf.ssl && 'false' == conf.ssl.sslEnabled) {
    isSecure = false;
}
var sess = {
    store             : new redisStore({ client : dbhd.redisClient}),
    secret            : 'h3c secret key',
    resave            : false,
    saveUninitialized : true,
    cookie            : { maxAge : config.get('cookieTmpAge'), secure : isSecure }
};
app.use(session(sess));

// app.use(zipkin.zipkinMiddleware({
//   tracer:zipkin.tracer ,
//   serviceName: 'webserverrd' // name of this application
// }));   

app.use(function(req, res, next) {
   if (req.session && req.session.user_type == config.get('user_type')) {
       res.header("Access-Control-Allow-Origin", conf.url.allow_origin);
       res.header("Access-Control-Allow-Credentials", true);
   } else {
       res.header("Access-Control-Allow-Origin", "*");
   }
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, username, AuthToken");
   res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
   res.header("X-Frame-Options", "SAMEORIGIN");
   next();
});

var cas = new cas_auth({
    cas_url         : conf.url.cas_url,
    service_url     : conf.url.service_url,
    login_url       : conf.url.login_url,
    cookie_age      : config.get('cookieSuccessAge'),
    dev_cookie_age  : config.get('devCookieAge'),
    allow_origin    : conf.url.allow_origin,
    user_type       : config.get('user_type'),
    destroy_session : true
});

// 研发用户入口
app.use('/rd', rd);

app.use(function(req, res, next) {
    if (req.method && req.method.toUpperCase() == 'OPTIONS') {
        res.header("Access-Control-Allow-Origin", conf.url.allow_origin);
        res.header("Access-Control-Allow-Credentials", true);
        res.status(204).end();
    }else {
        next();
    }
});

app.use('/v3/api', api);

// logout page, no need to cas.
app.get('/v3/logout', cas.logout);
app.get('/v3/app/logout', cas.logout);
app.get('/v3/arb/wechatnotify/logout', cas.logout);

// cas认证入口
app.use(cas.bounce);

app.use(express.static(path.join(__dirname, '../localfs')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/v3/fs', fs);
app.use('/v3/arb', arb);
app.use('/v3/wloc', wloc);
app.use('/v3/jag', jag);
app.use('/v3/ant', ant);
app.use('/v3/web', web);
app.use('/oasis/stable/web', web);
app.use('/v3/ace', ace);
app.use('/portal', portal);
app.use('/iot/web', iotweb);
app.use(defaul);"/"

module.exports = app;