//process.chdir('../src');
//var config = require('wlanpub').config;
//var dbhd = require('wlanpub').dbhd;
//var connectionModel = require('wlanpub').connectionModel;
//
//var redisConnParas = config.get('redisConnParas');
//var mongoConnParas = config.get('mongoConnParas');
//
//dbhd.connectDatabase(redisConnParas, mongoConnParas);
//
//connectionModel.createConnectionModel(dbhd);
//
//describe("******************************begin oneMainConnection test******************************", function () {
//    this.timeout(5000);
//    var assert = require('assert')
//        , chai = require('chai')
//        , should = chai.should()
//        , expect = chai.expectct
//        , isip = require('isip');
//
//    var cas = require('testpub/cas.js')
//        , generateID = cas.generateID
//        , config = require('testpub/test_config');
//
//
//    var webSocketTestInterface = require('../test_lib/webSocketTestInterface')
//        , createWsRecvAndFind = webSocketTestInterface.createWsRecvAndFind
//        , findSessionIdAndServerAddress = webSocketTestInterface.findSessionIdAndServerAddress;
//
//
//    var createConn = require('testpub/createConnection.js')
//        , createConnection = createConn.createConnection
//        , sendMsg = createConn.sendMsg
//        , recvMsg = createConn.recvMsg;
//
//
//    var host = 'wss://' + config.localtest + ':443',
//        casOption = {"hostname": "localtest", "cas": "dev"};
//
//    var baseMessage, baseRedisSession, baseMongoSession, baseRedisAddress, baseMongoAddress;
//
//    var option1, option2;
//    var options = {}, connection, headers;
//
//    before(function (done) {
//        generateID('dev', casOption, function (id) {
//            headers = {
//                cookie: "JSESSIONID=" + id.sessionid + "; " + id.sid
//            };
//
//            options.optType = 1, options.tokenID = id.sessionid, options.cloudModName = 'base', options.devModName = 'cmtnlmgr'
//                ,options.devSN = '309YcbhZey3H7r0001';
//
//            createConnection(host + '/v3/base/userauth', headers, function (connect) {
//
//                connection = connect;
//
//                done();
//            });
//        });
//    });
//    after(function () {
//        console.log("******************************end oneMainConnection test******************************");
//    });
//    describe("test case", function () {
//        it("get information of base by optType=1", function (done) {
//
//            option1 = options;
//            console.log("options.........");
//            console.log(option1);
//
//            sendMsg(connection, option1, function () {
//                recvMsg(connection, function (message) {
//                    findSessionIdAndServerAddress(connectionModel, option1, function (redisSession, rediAddress, mongooSession, mongooAddress) {
//                        if (JSON.parse(message).optType == 1) {
//
//                            baseMessage = message;
//                            baseRedisSession = redisSession;
//                            baseRedisAddress = rediAddress;
//                            baseMongoSession = mongooSession;
//                            baseMongoAddress = mongooAddress;
//                            console.log('baseMessage: ' + message);
//                            console.log('baseRedisSession: ' + redisSession);
//                            console.log('baseRedisAddress: ' + rediAddress);
//                            console.log('baseMongoSession: ' + mongooSession);
//                            console.log('baseMongoAddress: ' + mongooAddress);
//                            done();
//                        }
//                    });
//                });
//            });
//        });
//
//        it("assert result of base by optType=1", function () {
//            if (baseMessage != undefined) {
//                assert.equal(JSON.parse(baseMessage).devSN, option1.devSN);
//                assert.equal(JSON.parse(baseMessage).tokenID, option1.tokenID);
//                assert.equal(JSON.parse(baseMessage).devModName, option1.devModName);
//                JSON.parse(baseMessage).retCode.should.equal(0);
//                JSON.parse(baseMessage).optType.should.equal(1);
//
//                assert.equal(baseRedisSession, option1.tokenID);
//                assert.equal(baseMongoSession, option1.tokenID);
//                expect(isip(baseRedisAddress)).to.be.true;
//                expect(isip(baseMongoAddress)).to.be.true;
//            }
//        });
//        it("get information of base by optType=2", function (done) {
//
//            options.optType = 2;
//            option2 = options;
//
//            console.log("options.........");
//            console.log(option2);
//            sendMsg(connection, option2, function () {
//                recvMsg(connection, function (message) {
//                    if (JSON.parse(message).optType == 2) {
//
//                        baseMessage = message;
//                        console.log(message);
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
//    });
//});