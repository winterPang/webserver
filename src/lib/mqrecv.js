/**
 * 该文件用来处理从mq接收到的消息
 */
var log4js        = require('wlanpub').log4js;
var basic         = require('wlanpub').basic;
var mqhd          = require('wlanpub').mqhd;
var render        = require('./render');
var pub           = require('./public');
var confpub       = require('../webexpress/wlan/ant/controller/confpub');
var msMsgProc     = require("./index");

var logger        = log4js.getLogger('conn');
var serviceName   = basic.serviceName;
var connectionMap = pub.connectionMap;
var getOriginName = pub.getOriginName;

function recvMqMsg(message, header, deliveryInfo) {
    console.log((new Date()) + ' Received mq message from %s: %s', deliveryInfo.appId, message.data);
    if (message.data) {
        var recvData = JSON.parse(message.data);
        if (deliveryInfo.appId != 'appchat') {
            console.log((new Date()) + ' Received mq message from %s: %s', deliveryInfo.appId, message.data);
            console.log('  deliveryInfo: ' + JSON.stringify(deliveryInfo));
        }
        // websocket消息
        if (recvData.optType != undefined) {
            var cloudModName = getOriginName(deliveryInfo.appId);
            var correlation = recvData.devSN + '/' + recvData.tokenID + '/' + recvData.devModName + '/' + cloudModName;
            var conn = connectionMap.get(correlation);
            if (conn != undefined) {
                conn.sendUTF(JSON.stringify(recvData));
                console.log('  transmit mq message to device: ' + JSON.stringify(recvData));
            }else {
                console.error('Received mq message from %s(%s) but cannot find the connection of correlation: %s. message: %s', deliveryInfo.appId, deliveryInfo.replyTo, correlation, message.data);
            }
        }
        // 处理webserver模块内部消息
        else if (recvData.msgType != undefined) {
            // msgType=1 关闭子连接
            if (recvData.msgType == 1) {
                var recvCorr   = recvData.correlation;
                var connection = connectionMap.get(recvCorr);
                if (connection != undefined) {
                    connection.close(1000, 'receive notify and close connection');
                    logger.warn('receive notify from %s(%s) and delete connection of correlation: ', deliveryInfo.appId, deliveryInfo.replyTo, recvCorr);
                    //var strArray  = recvCorr.split('/');
                    //if (strArray[3] == serviceName.stamgr) {
                    //    mqhd.sendMsg(strArray[3], JSON.stringify({"optType":200}));
                    //}
                }else {
                    logger.error('receive notify from %s(%s) but cannot find connection of correlation: %s. message: %s', deliveryInfo.appId, deliveryInfo.replyTo, recvCorr, message.data);
                }
                // 删除Map表中相关数据
                connectionMap.delete(recvCorr);
            }
            // msgType=2 给设备端的配置管理重定向消息
            else if (recvData.msgType == 2) {
                try {
                    confpub.procAntRedirectMsg(recvData, deliveryInfo);
                }
                catch (err) {
                    console.error("confpub procAntRedirectMsg except: " + err);
                }
            }
            //msgType=3 需要与webserver交互的微服务消息接口
            else if(recvData.msgType == 3)
            {
                try {
                    msMsgProc(recvData, deliveryInfo);
                }
                catch (err) {
                    console.error("msMsgPub proc ms message except: " + err);
                }
            }
        }
        // http处理结果消息
        else if (recvData.url != undefined) {
            render.renderMsg(recvData, deliveryInfo);
        }
        else {
            console.warn('Received unknown mq message from %s(%s). please check it. message: %s', deliveryInfo.appId, deliveryInfo.replyTo, message.data);
        }
    }else {
        console.warn('The mq message format is not supported, please check it where the message is send...');
        console.warn('  message: ' + JSON.stringify(message));
        console.warn('  message.data: ' + message.data);
    }
}

exports.recvMqMsg = recvMqMsg;