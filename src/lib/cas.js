var url           = require('url'),
    qs            = require('querystring'),
    http          = require('http'),
    https         = require('https'),
    path          = require('path'),
    parseXML      = require('xml2js').parseString,
    XMLprocessors = require('xml2js/lib/processors');
var config        = require('wlanpub').config;
var user          = require('wlanpub').user;
var pub           = require('./public');

var nodeEnv     = config.util.getEnv('NODE_ENV');
var getUserAttr = pub.getUserAttr;
var isDevBind2UserForWebserver = user.isDevBind2UserForWebserver;
var isUserHasPermission = pub.isUserHasPermission;
/**
 * The CAS authentication types.
 * @enum {number}
 */
var AUTH_TYPE = {
    BOUNCE          : 0,
    BOUNCE_REDIRECT : 1,
    BLOCK           : 2
};

/**
 * ...
 * @typedef {Object} CAS_options
 * @property {string}  cas_url
 * @property {string}  service_url
 * @property {('1.0'|'2.0'|'3.0')} [cas_version='3.0']
 * @property {boolean} [renew=false]
 * @property {boolean} [is_dev_mode=false]
 * @property {string}  [dev_mode_user='']
 * @property {string}  [session_name='cas_user']
 * @property {boolean} [destroy_session=false]
 */

/**
 * ...
 * @param {CAS_options} options
 * @constructor
 */
function CASAuthentication( options ) {

    if( !options || typeof options !== 'object' ) {
        throw new Error( 'CAS Authentication was not given a valid configuration object.' );
    }
    if( options.cas_url === undefined ) {
        throw new Error( 'CAS Authentication requires a cas_url parameter.' );
    }
    if( options.service_url === undefined ) {
        throw new Error( 'CAS Authentication requires a service_url parameter.' );
    }

    this.cas_version = options.cas_version !== undefined ? options.cas_version : '3.0';

    if( this.cas_version === '1.0' ) {
        this._validateUri = '/validate';
        this._validate = function ( body, callback ) {
            var lines = body.split('\n');
            if( lines[ 0 ] === 'yes' && lines.length >= 2 ) {
                console.log( 'Successful CAS authentication.', lines[ 1 ] );
                return callback( null, lines[ 1 ] );
            }
            else if( lines[ 0 ] === 'no' ) {
                return callback( new Error( 'CAS authentication failed.' ) );
            }
            else {
                return callback( new Error( 'Response from CAS server was bad.' ) );
            }
        }
    }
    else if( this.cas_version === '2.0' || this.cas_version === '3.0' ) {
        //this._validateUri = ( this.cas_version === '2.0' ? '/serviceValidate' : '/p3/serviceValidate' );
        this._validateUri = '/serviceValidate';
        this._validate = function ( body, callback ) {
            parseXML( body, {
                trim: true,
                normalize: true,
                explicitArray: false,
                tagNameProcessors: [ XMLprocessors.normalize, XMLprocessors.stripPrefix ]
            }, function ( err, result ) {
                if( err ) {
                    //return callback( new Error( 'Response from CAS server was bad.' ) );
                    return callback( 'Response from CAS server was bad.');
                }
                try {
                    if (result.serviceresponse == undefined) {
                        console.error('[cas_error] result.serviceresponse is undefined.');
                        return callback('CAS authentication failed.');
                    }
                    var failure = result.serviceresponse.authenticationfailure;
                    if( failure ) {
                        //return callback( new Error( 'CAS authentication failed (' + failure.$.code + ').' ) );
                        return callback('CAS authentication failed (' + failure.$.code + ').');
                    }
                    var success = result.serviceresponse.authenticationsuccess;
                    if( success ) {
                        //return callback( null, success.user );
                        return callback( null, success );
                    }
                    else {
                        //return callback( new Error( 'CAS authentication failed.' ) );
                        return callback('CAS authentication failed.');
                    }
                }
                catch ( err ) {
                    console.error( err );
                    //return callback( new Error( 'CAS authentication failed.' ) );
                    return callback('CAS authentication failed.');
                }
            });
        }
    }
    else {
        throw new Error( 'The supplied CAS version ("' + this.cas_version + '") is not supported.' );
    }

    this.cas_url         = options.cas_url;
    var parsed_cas_url   = url.parse( this.cas_url );
    this.request_client  = ( parsed_cas_url.protocol === 'http:' ? http : https );
    this.cas_protocol    = ( parsed_cas_url.protocol === 'http:' ? 0 : 1 );
    this.cas_host        = parsed_cas_url.hostname;
    this.cas_port        = parsed_cas_url.port;
    this.cas_path        = parsed_cas_url.pathname;

    this.service_url     = options.service_url;
    this.login_url       = options.login_url;
    this.renew           = options.renew !== undefined ? !!options.renew : false;
    this.is_dev_mode     = options.is_dev_mode !== undefined ? !!options.is_dev_mode : false;
    this.dev_mode_user   = options.dev_mode_user !== undefined ? options.dev_mode_user : '';
    this.session_name    = options.session_name !== undefined ? options.session_name : 'cas_user';
    this.destroy_session = options.destroy_session !== undefined ? !!options.destroy_session : false;
    this.cookie_age      = options.cookie_age;
    this.dev_cookie_age  = options.dev_cookie_age;
    this.allow_origin    = options.allow_origin;
    this.user_type       = options.user_type;

    // Bind the prototype routing methods to this instance of CASAuthentication.
    this.bounce = this.bounce.bind( this );
    this.bounce_redirect = this.bounce_redirect.bind( this );
    this.block = this.block.bind( this );
    this.logout = this.logout.bind( this );
}

/*
 * if no need to cas authentication, please add here.
 */
CASAuthentication.prototype._isNoCAS = function (pathname) {
    console.log("***************************");
    console.log("No CAS pathname : " + pathname);
    console.log("***************************");
    
    if (pathname == '/oasis/stable/web/login' || pathname == '/oasis/stable/web/login.html' || pathname == '/v3/arb/wechatnotify/login.html') {
        return true;
    }else if ((0 == pathname.indexOf('/oasis/stable/web/static')) || (0 == pathname.indexOf('/v3/rd')) ||
              (0 == pathname.indexOf('/v3/arb/static'))) {
        return true;
    }else if ((pathname == '/v3/ace/o2oportal/sso/registUser') || (0 == pathname.indexOf('/portal'))) {
        return true;
    }
    return false;
};

/**
 * Bounces a request with CAS authentication. If the user's session is not
 * already validated with CAS, their request will be redirected to the CAS
 * login page.
 */
CASAuthentication.prototype.bounce = function ( req, res, next ) {

    // Handle the request with the bounce authorization type.
    var pathname = url.parse( req.url ).pathname;
    var queryString = url.parse(req.url).query;
    var query = qs.parse(queryString);

    console.log("bounce pathname: "+ pathname);
    console.log("bounce queryString: "+ queryString);
    console.log("bounce query: "+ query);

    if (this._isNoCAS(pathname)) {
        next();
    } else {
        this._handle( req, res, next, AUTH_TYPE.BOUNCE );
    }
};

/**
 * Bounces a request with CAS authentication. If the user's session is not
 * already validated with CAS, their request will be redirected to the CAS
 * login page.
 */
CASAuthentication.prototype.bounce_redirect = function ( req, res, next ) {

    // Handle the request with the bounce authorization type.
    this._handle( req, res, next, AUTH_TYPE.BOUNCE_REDIRECT );
};

/**
 * Blocks a request with CAS authentication. If the user's session is not
 * already validated with CAS, they will receive a 401 response.
 */
CASAuthentication.prototype.block = function ( req, res, next ) {

    // Handle the request with the block authorization type.
    this._handle( req, res, next, AUTH_TYPE.BLOCK );
};

/**
 * Handle a request with CAS authentication.
 */
CASAuthentication.prototype._handle = function ( req, res, next, authType ) {
    console.log("handle cas: %j", req.query);
    if (req.session == undefined) {
        console.error('[cas_error] req.session is undefined. _handle');
        res.sendStatus( 401 );
    }
    // If the session has been validated with CAS, no action is required.
    else if( req.session[ this.session_name ] ) {
        var pathname = url.parse( req.url ).pathname;
        // If this is a bounce redirect, redirect the authenticated user.
        if( authType === AUTH_TYPE.BOUNCE_REDIRECT ) {
            res.redirect( req.session.cas_return_to );
        }
        else if( req.query && req.query.ticket && pathname != '/v3/base/userauth') {
            this._handleTicket( req, res, next );
        }
        // Otherwise, allow them through to their request.
        else {
            //如果在v2那边退出登录后又使用另外账户进行登录，则让其重走一次_login使session更新为新用户
            var ext = path.extname(pathname).slice(1);
            if ((0 == pathname.indexOf('/v3/web/frame')) && ext == 'html' && req.query && req.query.sn) {
                console.warn('****** _handle ****** begin isUserHasPermission: ' + url.parse( req.url ).path);
                isUserHasPermission(req.cookies, req.session, req.query.sn, function (bHasPermission) {
                    console.warn('****** _handle ****** end isUserHasPermission: %s, bHasPermission: %s', url.parse( req.url ).path, bHasPermission);
                    if (bHasPermission) {
                        next();
                    } else {
                        this._login( req, res, next );
                    }
                }.bind(this));
            }else {
                console.warn("_handle next :%s", pathname);
                next();
            }
        }
    }
    // If dev mode is active, set the CAS user to the specified dev user.
    else if( this.is_dev_mode ) {
        req.session[ this.session_name ] = this.dev_mode_user;
        next();
    }
    // If the authentication type is BLOCK, simply send a 401 response.
    else if( authType === AUTH_TYPE.BLOCK ) {
        res.sendStatus( 401 );
    }
    // If there is a CAS ticket in the query string, validate it with the CAS server.
    else if( req.query && req.query.ticket ) {
        this._handleTicket( req, res, next );
    }
    // Otherwise, redirect the user to the CAS login.
    else {
        this._login( req, res, next );
    }
};

/**
 * Redirects the client to the CAS login.
 */
CASAuthentication.prototype._login = function ( req, res, next ) {

    // Save the return URL in the session. If an explicit return URL is set as a
    // query parameter, use that. Otherwise, just use the URL from the request.
    console.warn("cas_return_to: *********************");
    console.warn(" req.query.returnTo:" + req.query.returnTo);
    console.warn("url.parse( req.url ).path" + url.parse( req.url ).path);
    console.warn("req.url:" + req.url);
    console.warn("**********************************");

    req.session.cas_return_to = req.query.returnTo || url.parse( req.url ).path;
    var queryString = url.parse(req.session.cas_return_to).query;
    var queryarb    = qs.parse(queryString);

    // Set up the query parameters.
    var pathname = url.parse( req.url ).pathname;
    var query = {
        service : this.service_url + pathname
    };
    if( this.renew ) { query.renew = this.renew; }
    // Redirect to the CAS login.
    var redirectUrl;
    if (pathname == '/v3/base/userauth' || pathname == '/v3/app/login') {
        redirectUrl = this.cas_url + url.format({
                pathname : '/v1/tickets'
        });
        var resMsg = {"cas_url" : redirectUrl, "cas_protocol" : this.cas_protocol, "ignore_cas" : 1};
        if ((pathname == '/v3/base/userauth')&&(req.headers["user-agent"] != "oasismid")) {
            res.removeHeader('Transfer-Encoding');
            //res.setHeader('Content-Length', JSON.stringify(resMsg).length);
        }
        res.end(JSON.stringify(resMsg));
        console.log("cccc:send login resp for dev.");
    } else if ((pathname === '/v3/arb/wechatnotify/') && (queryarb.code!==undefined) && (queryarb.state!==undefined)){
        query = {service : this.service_url + '/v3/arb/wechatnotify/', loginUrl : this.service_url + '/v3/arb/wechatnotify/login.html'};
        redirectUrl = this.cas_url + url.format({
            pathname : '/login',
            query    : query
        })
        req.session.arb_info = {};
        req.session.arb_info.arb_session_name = this.session_name;
        req.session.arb_info.redirectUrl = redirectUrl;
        req.session.arb_info.firstTime = true;

        next();
    } else {
        // ���������µĵ�¼ҳ����ת��v2�ĵ�¼ҳ��,�����������ĵ�¼ҳ����Ȼ��ת�������Լ���ҳ��
        if (nodeEnv && nodeEnv.toLowerCase() != 'production') {
            query = {service : this.service_url + '/v3/web', loginUrl : this.service_url + '/oasis/stable/web/login.html'};
        } else {
            query = {service : this.service_url + '/v3/web', loginUrl : this.login_url};
        }
        redirectUrl = this.cas_url + url.format({
                pathname : '/login',
                query    : query
        });
        req.session.user_type = this.user_type;
        res.header("Access-Control-Allow-Origin", this.allow_origin);
        res.header("Access-Control-Allow-Credentials", true);
        if (pathname.indexOf("iotedu_primary_write") != -1 ||
            pathname.indexOf("iotedu_primary_read") != -1 ||
            pathname.indexOf("wristbandread") != -1 ||
            pathname.indexOf("wristbandwritr") != -1)
        {
            res.end(JSON.stringify({isValidSession:false}));
            return
        }
        res.redirect(redirectUrl);
    }
};

/**
 * Logout the currently logged in CAS user.
 */
CASAuthentication.prototype.logout = function ( req, res, next ) {
    var pathname = url.parse( req.url ).pathname;

    // Destroy the entire session if the option is set.
    if( this.destroy_session ) {
        if (req.session) {
            req.session.destroy( function ( err ) {
                if( err ) { console.error( err ); }
            });
        }else {
            console.error('[cas_error] req.session is undefined. logout1');
        }
    }
    // Otherwise, just destroy the CAS session variable.
    else {
        if (req.session) {
            delete req.session[ this.session_name ];
        }else {
            console.error('[cas_error] req.session is undefined. logout2');
        }
    }

    // Redirect the client to the CAS logout.
    if (pathname == '/v3/app/logout') {
        var resMsg = {"cas_url_logout" : this.cas_url+'/logout'};
        res.end(JSON.stringify(resMsg));
    } else {
        var query = {};
        if (pathname === '/v3/arb/wechatnotify/logout') {
            query = {service : "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx8f4a00ae32dbc871&" +
                                "redirect_uri=https%3a%2f%2flvzhouv3.h3c.com%2fv3%2farb%2fwechatnotify%2f&response_type=code&" +
                                "scope=snsapi_base&state=STATE#wechat_redirect"};
        } else {
            query = {service : this.login_url};
        }
        var redirectUrl = this.cas_url + url.format({
                pathname: "/logout",
                query    : query
            });
        res.redirect( redirectUrl );
    }
};

/**
 * Handles the ticket generated by the CAS login requester and validates it with the CAS login acceptor.
 */
CASAuthentication.prototype._handleTicket = function ( req, res, next ) {
    var queryUrl = this.service_url;
    if (url.parse( req.url ).pathname == '/v3/base/userauth') {
        console.log("cccc:recv ticket msg for dev.");
        //queryUrl = 'https://h3crd-wlan1.chinacloudapp.cn';
        req.session[ this.session_name ] = 'device';
        // �����豸�Ự����
        if (req.session && req.session.cookie) {
            req.session.cookie.maxAge = this.dev_cookie_age;
        }
        if (req.headers["user-agent"] != "oasismid")
        {
            res.removeHeader('Transfer-Encoding');
        }
        //res.setHeader('Content-Length', JSON.stringify({"sessionid" : req.sessionID}).length);
        res.end(JSON.stringify({"sessionid" : req.sessionID}));
        return;
    }

    var request = this.request_client.get({
        host: this.cas_host,
        port: this.cas_port,
        path: url.format({
            pathname: this.cas_path + this._validateUri,
            query: {
                service : queryUrl + url.parse( req.url ).pathname,
                ticket  : req.query.ticket
            }
        }),
        rejectUnauthorized : false, // ignore crt check for temp
        method: 'GET'
    }, function ( response ) {
        response.setEncoding( 'utf8' );
        var body = '';
        response.on( 'data', function ( chunk ) {
            return body += chunk;
        }.bind( this ));
        response.on( 'end', function () {
            this._validate( body, function ( err, user ) {
                if( err ) {
                    console.error( err );
                    res.sendStatus( 401 );
                }
                else {
                    req.session[ this.session_name ] = user;
                    // ��¼�ɹ��󣬸��»Ự����ʱ��Ϊ30��
                    if (req.session && req.session.cookie) {
                        req.session.cookie.maxAge = this.cookie_age;
                    }
                    if (req.session && user.attributes && user.attributes.name) {
                        getUserAttr(user.attributes.name, function(bUserTest) {
                            if (nodeEnv.toLowerCase() == 'production' || nodeEnv.toLowerCase() == 'v3webtest') {
                                if (bUserTest) {
                                    req.session.bUserTest = 'true';
                                }else {
                                    delete req.session.bUserTest;
                                }
                            }
                            var pathname = url.parse( req.url ).pathname;
                            if (pathname == '/v3/base/userauth' || pathname == '/v3/app/login') {
                                var resMsg = {"sessionid" : req.sessionID};
                                if ((pathname == '/v3/base/userauth')&&(req.headers["user-agent"] != "oasismid")) {
                                    res.removeHeader('Transfer-Encoding');
                                    //res.setHeader('Content-Length', JSON.stringify(resMsg).length);
                                }
                                res.end(JSON.stringify(resMsg));
                            }else {
                                req.session.user_type = this.user_type;
                                res.header("Access-Control-Allow-Origin", this.allow_origin);
                                res.header("Access-Control-Allow-Credentials", true);
                                if (req.session.cas_return_to) {
                                    var casRetUrl = url.parse(req.session.cas_return_to, true);
                                    var casRetPathname = casRetUrl.pathname;
                                    var casRetQuery = casRetUrl.query;
                                    var ext = path.extname(casRetPathname).slice(1);
                                    if ((0 == casRetPathname.indexOf('/v3/web/frame')) && ext == 'html' && casRetQuery && casRetQuery.sn) {
                                        console.warn('****** _handleTicket ****** begin isUserHasPermission: %s. user: %s.', url.parse( req.url ).path, user.attributes.name);
                                        isUserHasPermission(req.cookies, req.session, casRetQuery.sn, function (bHasPermission) {
                                            console.warn('****** _handleTicket ****** end isUserHasPermission: %s. user: %s, bHasPermission: %s.', url.parse( req.url ).path, user.attributes.name, bHasPermission);
                                            if (!bHasPermission) {
                                                console.warn('_handleTicket dev not bind to user');
                                                req.session.cas_return_to = '/v3';
                                            }
                                            res.redirect( req.session.cas_return_to );
                                        });
                                    }else {
                                        res.redirect( req.session.cas_return_to );
                                    }
                                }else {
                                    req.session.cas_return_to = '/v3';
                                    res.redirect( req.session.cas_return_to );
                                }
                            }
                        }.bind( this ));
                    }else {
                        res.sendStatus( 401 );
                        console.error('[CAS]req.session or user.attributes.name is undefined');
                        console.error('[CAS]user: ' + JSON.stringify(user));
                    }
                }
            }.bind( this ));
        }.bind( this ));
        response.on( 'error', function ( err ) {
            console.error( 'Response error from CAS: ', err );
            res.sendStatus( 401 );
        }.bind( this ));
    }.bind( this ));

    request.on( 'error', function ( err ) {
        console.error( 'Request error with CAS: ', err );
        res.sendStatus( 401 );
    }.bind( this ));

    request.end();
};

module.exports = CASAuthentication;