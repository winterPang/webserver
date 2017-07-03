/**
 * Created by c09347 on 2016/7/29.
 * Used for the configuration of webserver
 */
var config = require('wlanpub').config;
var hdfshd = require('wlanpub').hdfsoper;

var getHdfsOption = hdfshd.getHdfsOption;

var httpPort                = config.get('httpPort');
var httpsPort               = config.get('httpsPort');
var casUrl                  = config.get('cas_url');
var serviceUrl              = config.get('service_url');
var loginUrl                = config.get('login_url');
var allowOrigin             = config.get('allow_origin');
var bDelDevConnPeriodically = config.get('bDelDevConnPeriodically') || false;
var devConnDelPeriod        = config.get('devConnDelPeriod') || 1339200000;
var devConnTimeoutPeriod    = config.get('devConnTimeoutPeriod') || 1339200000;

module.exports = {
    //To set the port of http or https server
    ports: {
        httpPort  : process.env.WEBSERVER_CONFIG_HTTPPORT || httpPort,
        httpsPort : process.env.WEBSERVER_CONFIG_HTTPSPORT || httpsPort
    },

    //To set the ssl options for https
    ssl: {
        sslEnabled : process.env.WEBSERVER_CONFIG_SSL_ENABLED || true,
        sslCert    : process.env.WEBSERVER_CONFIG_SSL_CERT || './ca/wildcard.crt',
        sslKey     : process.env.WEBSERVER_CONFIG_SSL_KEY || './ca/wildcard.rsa'
    },

    //Define the different urls that use in your service
    url: {
        cas_url      : process.env.WEBSERVER_CONFIG_CAS_URL || casUrl,
        service_url  : process.env.WEBSERVER_CONFIG_SERVICE_URL || serviceUrl,
        login_url    : process.env.WEBSERVER_CONFIG_LOGIN_URL || loginUrl,
        allow_origin : process.env.WEBSERVER_CONFIG_ALLOW_ORIGIN || allowOrigin
    },

    //设备连接相关
    devConn : {
        bDelPeriodically : process.env.WEBSERVER_CONFIG_BDELDEVCONN || bDelDevConnPeriodically,
        delPeriod        : process.env.WEBSERVER_CONFIG_DEVCONNDELPERIOD || devConnDelPeriod,
        timeoutPeriod    : process.env.WEBSERVER_CONFIG_DEVCONNTIMEOUTPERIOD || devConnTimeoutPeriod
    },

    //set hdfs connection options
    hdfsConnOption : getHdfsOption("hdfsConnOption"),

    //二期oasis相关环境变量
    oasis: {
        host: process.env.WEBSERVER_CONFIG_OASIS_IP || config.get('oasisIp'),
        port: process.env.WEBSERVER_CONFIG_OASIS_PORT || config.get('oasisPort')
    },

    o2oportal: {
        host: process.env.WEBSERVER_CONFIG_O2OPORTAL_IP || config.get('o2oPortalIp'),
        port: process.env.WEBSERVER_CONFIG_O2OPORTAL_PORT || config.get('o2oPortalPort')
    }
};
