//describe("******************************begin websocket test******************************", function () {
//
//    var assert = require('assert')
//        , chai = require('chai')
//        , should = chai.should();
//
//    var createConn = require('testpub/createConnection.js')
//        , createConnection = createConn.createConnection
//        , sendMsg = createConn.sendMsg
//        , recvMsg = createConn.recvMsg;
//
//    var cas = require('testpub/cas.js')
//        , generateID = cas.generateID//接收生成2个id
//        , config = require('testpub/test_config')
//        , headers;
//    var test = process.env.test, host, casOption,casCategory;
//
//    host = 'wss://' + config.localtest + ':443',casCategory = 'dev';
//    casOption = {"hostname": "localtest", "cas": "dev"};
//
//    if(test == 0)
//    {
//        host = 'wss://' + config.lvzhouv3 + ':443',casCategory = 'dev';
//        casOption = {"hostname": "lvzhouv3", "cas": "dev"};
//    }
//
//    var options = {}, baseMessage;
//
//    before(function (done) {
//        generateID(casCategory, casOption, function (id) {
//
//            headers = {
//                cookie: "JSESSIONID=" + id.sessionid + "; " + id.sid
//            };
//
//            options.optType = 1, options.tokenID = id.sessionid
//            , options.cloudModName = 'base', options.devModName = 'cmtnlmgr'
//            , options.devSN = '2015235A1AMB1450008';
//
//            done();
//        });
//    });
//    after(function () {
//        console.log("******************************end websocket test******************************");
//    });
//    it("create mainconnection", function (done) {
//        createConnection(host + '/v3/base/userauth', headers, function (connect) {
//
//            connection = connect;
//
//            done();
//        });
//    });
//
//    describe("get information", function () {
////***********************************测试base optType = 1*****************************
//        it("get information of base by optType=1", function (done) {
//
//            sendMsg( connection,options, function () {
//                recvMsg(connection, function (message) {
//                    if (JSON.parse(message).optType == 1) {
//                        baseMessage = message;
//
//                        console.log(baseMessage);
//
//                        done();
//                    }
//                });
//            });
//        });
//        it("assert result of base by optType=1", function () {
//            if (baseMessage != undefined) {
//                assert.equal(JSON.parse(baseMessage).devSN, options.devSN);
//                assert.equal(JSON.parse(baseMessage).tokenID, options.tokenID);
//                assert.equal(JSON.parse(baseMessage).devModName, options.devModName);
//                JSON.parse(baseMessage).retCode.should.equal(0);
//                JSON.parse(baseMessage).optType.should.equal(1);
//            }
//        });
////***********************************测试base optType = 2*****************************
//        it("get information of base by optType=2", function (done) {
//            options.optType = 2
//            sendMsg(connection, options, function () {
//                recvMsg(connection, function (message) {
//                    if (JSON.parse(message).optType == 2) {
//                        baseMessage = message;
//
//                        console.log(baseMessage);
//
//                        done();
//                    }
//                });
//            });
//        });
//        it("assert result of optType=2", function () {
//            if (baseMessage != undefined) {
//                JSON.parse(baseMessage).retCode.should.equal(0);
//                JSON.parse(baseMessage).optType.should.equal(2);
//            }
//        });
////***********************************测试base optType = undefined*****************************
//        it("get information of base by optType=undefined", function (done) {
//            options.optType = undefined;
//            sendMsg(connection, options, function () {
//                done();
//            });
//        });
////***********************************测试withNoCloudModName*********************************
//        it("test exception by withNoCloudModName", function (done) {
//            options.cloudModName = undefined;
//            sendMsg(connection, options, function () {
//                done();
//            });
//        });
//        //***********************************测试isNotJsonData***************************************
//        it("test exception by isNotJsonData", function (done) {
//            options = "lvzhouhost";
//            sendMsg(connection, options, function () {
//                done();
//            });
//        });
//    });
//});