/*
 * Created by Administrator on 2016/2/24.
 */
// var http = require('http');
// var request = require('request');
// var digest = require('wlanpub').digest;
// var isJSON = require('wlanpub').isJSON;
// var config = require('wlanpub').config;
// var basic = require('wlanpub').basic;

// var CONST_LOG_HEAD = "[ANTDEVLIST][devlist] ";

// var nodeEnv = config.util.getEnv('NODE_ENV');

var scenario = require("wlanpub").getScenario();

// exports.getDevListByScene = function (jsonData, callback) {
//   if (!jsonData || !jsonData.userName || !jsonData.shopName) {
//     console.error(CONST_LOG_HEAD + "getDevListByScene() input data error: %s", JSON.stringify(jsonData));
//     if (typeof callback == "function") {
//       callback("fail");
//     }
//     return;
//   }

//   var body = { "user_name": jsonData.userName, "shop_name": jsonData.shopName };

//   if (nodeEnv.toLowerCase() == 'production' || nodeEnv.toLowerCase() == 'v3webtest') {
//     var bIsTest = false;
//     if (jsonData.bIsTestUser == true) {
//       bIsTest = true;
//     }
//     var V2HostPort = basic.getV2HostPort(bIsTest);
//     var httpOptions = {
//       host: V2HostPort.host,
//       port: V2HostPort.port,
//       path: '/o2oportal/getAcSNInShop',
//       method: 'POST',
//       headers: {
//         "Content-Type": 'application/json',
//         "accept": "application/json"
//       }
//     };

//     var req = http.request(httpOptions, function (res) {
//       var resData = '';
//       res.on('data', function (chunk) {
//         resData += chunk;
//       });
//       res.on('end', function () {
//         console.warn(CONST_LOG_HEAD + "receive msg from v2 getAcSNInShop: ");
//         console.warn(resData);
//         if (isJSON(resData)) {
//           if (typeof callback == "function") {
//             callback(JSON.parse(resData));
//           }
//           return;
//         }
//         callback("fail");
//       });
//       res.on('error', function (err) {
//         console.error(CONST_LOG_HEAD + "http-client error: %s", err);
//         if (typeof callback == "function") {
//           callback("fail");
//         }
//       });
//     });
//     req.on('error', function (err) {
//       console.error(CONST_LOG_HEAD + "http-client error: %s", err);
//       if (typeof callback == "function") {
//         callback("fail");
//       }
//     });
//     req.end(JSON.stringify(body));
//   }
//   else {
//     // var digestOption = { "host": "lvzhou.h3c.com", "port": 443, headers: { "accept": "application/json" } };
//     var digestOption = { "host": "oasis-rest-shop", "port": 443, headers: { "accept": "application/json" } };
//     digestOption.method = 'POST';
//     digestOption.path = 'rest/o2oportal/getAcSNInShop';

//     digest(digestOption, body, null, function (response) {
//       var resData = '';
//       response.on('data', function (chunk) {
//         resData += chunk;
//       });
//       response.on('end', function () {
//         console.warn(CONST_LOG_HEAD + "receive msg from v2 getAcSNInShop: ");
//         console.warn(resData);
//         if (isJSON(resData)) {
//           if (typeof callback == "function") {
//             callback(JSON.parse(resData));
//           }
//           return;
//         }
//         callback("fail");
//       });
//       response.on('error', function (err) {
//         console.error(CONST_LOG_HEAD + "http-digest-client error: %s", err);
//         if (typeof callback == "function") {
//           callback("fail");
//         }
//       });
//     });
//   }
// };

exports.getDevListByScene = function (jsonData, callback) {
  var param = {scenarioId : jsonData.scenarioId}
  scenario.getdevListByScenarioId(jsonData, function(doc, ret){
    if(ret){
      callback("fail");
      return;
    }
    var data = {data_list:[]};
    for(var i = 0; i < doc.length; i++){
      data.data_list.push(doc[i].devSN);
    }
    callback(data);
    console.info("[DEVLIST] get devlist by scenarioid:", doc);
  });  

};
