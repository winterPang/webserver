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
//describe("******************************begin oneMianOneSubConnection test******************************", function () {
//
//    var assert = require('assert')
//        , chai = require('chai')
//        , should = chai.should()
//        , expect = chai.expect
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
//    var createConn = require('testpub/subConnection.js')
//        , createConnection = createConn.createConnection
//        , sendMsg = createConn.sendMsg
//        , recvMsg = createConn.recvMsg;
//
//
//    var host = 'wss://' + config.localtest + ':443',
//        casOption = {"hostname": "localtest", "cas": "dev"};
//
//    var baseMessage, baseRedisSession, baseMongoSession, baseRedisAddress, baseMongoAddress,
//        stamonitorMessage, stamonitorRedisSession, stamonitorMongoSession, stamonitorRedisAddress, stamonitorMongoAddress;
//
//    var option4, option5;
//    var options = {}, connection, headers;
//
//    before(function (done) {
//        generateID('dev', casOption, function (id) {
//            headers = {
//                cookie: "JSESSIONID=" + id.sessionid + "; " + id.sid
//            };
//
//            options.optType = 1, options.tokenID = id.sessionid, options.cloudModName = 'base', options.devModName = 'cmtnlmgr'
//                , options.devSN = '309YcbhZey3H7r0003';
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
//        console.log("******************************end oneMianOneSubConnection test******************************");
//    });
//    describe("test case", function () {
//        describe("one mianconnection one subconnection", function () {
//            it("get information of base by optType=1", function (done) {
//                options.cloudModName = 'base',
//                    options.devModName = 'cmtnlmgr';
//                option4 = options;
//                console.log("options.........");
//                console.log(option4);
//                createConnection(host + '/v3/base/userauth', headers, function (connect) {
//                    sendMsg(connect, option4, function () {
//                        recvMsg(connect, function (message) {
//                            findSessionIdAndServerAddress(connectionModel, option4, function (redisSession, rediAddress, mongooSession, mongooAddress) {
//                                if (JSON.parse(message).optType == 1) {
//
//                                    baseMessage = message;
//                                    baseRedisSession = redisSession;
//                                    baseRedisAddress = rediAddress;
//                                    baseMongoSession = mongooSession;
//                                    baseMongoAddress = mongooAddress;
//                                    console.log('baseMessage: ' + message);
//                                    console.log('baseRedisSession: ' + redisSession);
//                                    console.log('baseRedisAddress: ' + rediAddress);
//                                    console.log('baseMongoSession: ' + mongooSession);
//                                    console.log('baseMongoAddress: ' + mongooAddress);
//                                    done();
//                                }
//                            });
//                        });
//                    });
//                });
//            });
//
//            it("assert result of base by optType=1", function () {
//                if (baseMessage != undefined) {
//                    assert.equal(JSON.parse(baseMessage).devSN, option4.devSN);
//                    assert.equal(JSON.parse(baseMessage).tokenID, option4.tokenID);
//                    assert.equal(JSON.parse(baseMessage).devModName, option4.devModName);
//                    JSON.parse(baseMessage).retCode.should.equal(0);
//                    JSON.parse(baseMessage).optType.should.equal(1);
//
//                    assert.equal(baseRedisSession, option4.tokenID);
//                    assert.equal(baseMongoSession, option4.tokenID);
//                    expect(isip(baseRedisAddress)).to.be.true;
//                    expect(isip(baseMongoAddress)).to.be.true;
//                }
//            });
//            it("get information of stamonitor by optType=1", function (done) {
//
//                options.cloudModName = 'stamonitor',
//                    options.devModName = 'apmgr';
//                option5 = options;
//                console.log("options.........");
//                console.log(option5);
//
//                createConnection(host + '/v3/stamonitor', headers, function (connect) {
//                    sendMsg(connect, option5, function () {
//                        recvMsg(connect, function (message) {
//                            findSessionIdAndServerAddress(connectionModel, option5, function (redisSession, rediAddress, mongooSession, mongooAddress) {
//                                if (JSON.parse(message).optType == 1) {
//
//                                    stamonitorMessage = message;
//                                    stamonitorRedisSession = redisSession;
//                                    stamonitorRedisAddress = rediAddress;
//                                    stamonitorMongoSession = mongooSession;
//                                    stamonitorMongoAddress = mongooAddress;
//                                    console.log('stamonitorMessage: ' + message);
//                                    console.log('stamonitorRedisSession: ' + redisSession);
//                                    console.log('stamonitorRedisAddress: ' + rediAddress);
//                                    console.log('stamonitorMongoSession: ' + mongooSession);
//                                    console.log('stamonitorMongoAddress: ' + mongooAddress);
//                                    done();
//                                }
//                            });
//                        });
//                    });
//                });
//            });
//            it("assert result of stamonitor by optType=1", function () {
//                if (stamonitorMessage != undefined) {
//                    assert.equal(JSON.parse(stamonitorMessage).devSN, option5.devSN);
//                    assert.equal(JSON.parse(stamonitorMessage).tokenID, option5.tokenID);
//                    assert.equal(JSON.parse(stamonitorMessage).devModName, option5.devModName);
//                    JSON.parse(stamonitorMessage).retCode.should.equal(0);
//                    JSON.parse(stamonitorMessage).optType.should.equal(1);
//
//                    assert.equal(stamonitorRedisSession, option5.tokenID);
//                    assert.equal(stamonitorMongoSession, option5.tokenID);
//                    expect(isip(stamonitorRedisAddress)).to.be.true;
//                    expect(isip(stamonitorMongoAddress)).to.be.true;
//                }
//            });
//        });
//    });
//});