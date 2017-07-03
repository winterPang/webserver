/**
 * Created by Administrator on 2015/7/23.
 */
var http      = require('http');
var https     = require('https');
var fs        = require('fs');
var websocket = require('websocket');
var config    = require('wlanpub').config;
var mqhd      = require('wlanpub').mqhd;
var database  = require('./lib/database');
var deploy    = require('./webexpress/deploy');
var ws        = require('./lib/ws');
var timer     = require('./lib/timer');
var recvMqMsg = require('./lib/mqrecv').recvMqMsg;
var conf      = require('./config');
var memgc     = require('./lib/memgc');

var WebSocketServer    = websocket.server;
var onWebsocketRequest = ws.onWebsocketRequest;

var MQHostnames     = config.get('MQHostnames');
var httpPort        = conf.ports.httpPort;
var httpsPort       = conf.ports.httpsPort;
var timeoutInterval = config.get('timeoutInterval');

var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

var sslEnabled = true;
if (conf.ssl && 'false' == conf.ssl.sslEnabled){
    sslEnabled = false;
}
var https_options  = {
    SSLEnabled: sslEnabled,
    key: fs.readFileSync(conf.ssl.sslKey),
    cert: fs.readFileSync(conf.ssl.sslCert)
};

// ---2 初始化MQ服务器连接
mqhd.setHostnames(MQHostnames);
mqhd.connectReadyForServer(recvMqMsg);

// if (cluster.isMaster) {
//     console.log("master start...");

//     // Fork workers.
//     for (var i = 0; i < numCPUs; i++) {
//         cluster.fork();
//     }

//     cluster.on('listening',function(worker,address){
//         console.log('listening: worker ' + worker.process.pid +', Address: '+address.address+":"+address.port);
//     });

//     cluster.on('exit', function(worker, code, signal) {
//         console.log('worker ' + worker.process.pid + ' died');
//     });
// } else {
//     setTimeout(timeoutProc, timeoutInterval);
// }

setTimeout(timeoutProc, timeoutInterval);

function timeoutProc() {
    var app = require('./webexpress/app');
    // ---3 启动http server
    var server;
    if (sslEnabled) {
        server = http.createServer(deploy);
    } else {
        server = http.createServer(app);
    }

    server.listen(httpPort, function() {
        console.log((new Date()) + ' Webserver start http server and listen on: ' + JSON.stringify(server.address()));
    });

    // ---4 启动https server
    var sServer = https.createServer(https_options, app);
    sServer.listen(httpsPort, function() {
        console.log((new Date()) + ' Webserver start https server and listen on: ' + JSON.stringify(sServer.address()));
    });

    // ---5 启动websocket server(基于http)

    var wsServer = new WebSocketServer({
        httpServer: server,
        maxReceivedFrameSize: 0x500000,
        maxReceivedMessageSize: 0x500000,
        autoAcceptConnections: false,
        keepalive: false
    });
    wsServer.on('request', onWebsocketRequest);


    // ---6 启动websocket server(基于https)
    var wssServer = new WebSocketServer({
        httpServer: sServer,
        maxReceivedFrameSize: 0x500000,
        maxReceivedMessageSize: 0x500000,
        autoAcceptConnections: false,
        keepalive: false
    });
    wssServer.on('request', onWebsocketRequest);
}