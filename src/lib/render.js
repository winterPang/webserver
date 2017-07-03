/**
 * 该文件用来处理从mq接收到的http消息
 */
var basic = require('wlanpub').basic;

exports.renderMsg = function(jsonData, deliveryInfo) {
    console.log('  renderMsg...');
    if (deliveryInfo.messageId == undefined) {
        console.error('  Error: deliveryInfo.messageId is undefined, please check it...');
        return;
    }
    var callback = basic.getCbObj(deliveryInfo.messageId);
    if (callback != undefined) {
        callback(jsonData);
    }else {
        console.error('  Error: callback is undefined, please check it. deliveryInfo.messageId = ' + deliveryInfo.messageId);
    }
};