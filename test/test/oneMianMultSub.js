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
//describe("******************************begin oneMainMultSubConnection test******************************", function () {
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
//        apmonitorMessage, apmonitorRedisSession, apmonitorMongoSession, apmonitorRedisAddress, apmonitorMongoAddress,
//        devmonitorMessage, devmonitorRedisSession, devmonitorMongoSession, devmonitorRedisAddress, devmonitorMongoAddress,
//        maintenanceMessage, maintenanceRedisSession, maintenanceMongoSession, maintenanceRedisAddress, maintenanceMongoAddress,
//        stamonitorMessage, stamonitorRedisSession, stamonitorMongoSession, stamonitorRedisAddress, stamonitorMongoAddress;
//
//    var option10, option11, option12, option13, option14;
//    var options = {}, connection, headers;
//
//    before(function (done) {
//        generateID('dev', casOption, function (id) {
//            headers = {
//                cookie: "JSESSIONID=" + id.sessionid + "; " + id.sid
//            };
//
//            options.optType = 1, options.tokenID = id.sessionid, options.cloudModName = 'base', options.devModName = 'cmtnlmgr'
//                , options.devSN = '309YcbhZey3H7r0002';
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
//        console.log("******************************end oneMainMultSubConnection test******************************");
//    });
//    describe("test case", function () {
//        describe("one mainconnection mult subconnection", function () {
//
//            it("get information of base by optType=1", function (done) {
//
//                options.cloudModName = 'base',
//                    options.devModName = 'cmtnlmgr';
//
//                option10 = options;
//                console.log("options.........");
//                console.log(option10);
//                createConnection(host + '/v3/base/userauth', headers, function (connect) {
//                    sendMsg(connect, option10, function () {
//                        recvMsg(connect, function (message) {
//                            findSessionIdAndServerAddress(connectionModel, option10, function (redisSession, rediAddress, mongooSession, mongooAddress) {
//                                if (JSON.parse(message).optType == 1) {
//
//
//                                    done();
//                                }
//                            });
//                        });
//                    });
//                });
//            });
//
//            it("get information of stamonitor by optType=1", function (done) {
//
//                options.cloudModName = 'stamonitor',
//                    options.devModName = 'apmgr';
//                option11 = options;
//                console.log("options.........");
//                console.log(option11);
//
//                createConnection(host + '/v3/stamonitor', headers, function (connect) {
//                    sendMsg(connect, option11, function () {
//                        recvMsg(connect, function (message) {
//                            findSessionIdAndServerAddress(connectionModel, option11, function (redisSession, rediAddress, mongooSession, mongooAddress) {
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
//                    assert.equal(JSON.parse(stamonitorMessage).devSN, option11.devSN);
//                    assert.equal(JSON.parse(stamonitorMessage).tokenID, option11.tokenID);
//                    assert.equal(JSON.parse(stamonitorMessage).devModName, option11.devModName);
//                    JSON.parse(stamonitorMessage).retCode.should.equal(0);
//                    JSON.parse(stamonitorMessage).optType.should.equal(1);
//
//                    assert.equal(stamonitorRedisSession, option11.tokenID);
//                    assert.equal(stamonitorMongoSession, option11.tokenID);
//                    expect(isip(stamonitorRedisAddress)).to.be.true;
//                    expect(isip(stamonitorMongoAddress)).to.be.true;
//                }
//            });
//            it("get information of apmonitor by optType=1", function (done) {
//
//                options.cloudModName = 'apmonitor';
//                option12 = options;
//                console.log("options.........");
//                console.log(option12);
//
//                createConnection(host + '/v3/apmonitor', headers, function (connect) {
//                    sendMsg(connect, option12, function () {
//                        recvMsg(connect, function (message) {
//                            findSessionIdAndServerAddress(connectionModel, option12, function (redisSession, rediAddress, mongooSession, mongooAddress) {
//                                if (JSON.parse(message).optType == 1) {
//
//                                    apmonitorMessage = message;
//                                    apmonitorRedisSession = redisSession;
//                                    apmonitorRedisAddress = rediAddress;
//                                    apmonitorMongoSession = mongooSession;
//                                    apmonitorMongoAddress = mongooAddress;
//                                    console.log('apmonitorMessage: ' + message);
//                                    console.log('apmonitorRedisSession: ' + redisSession);
//                                    console.log('apmonitorRedisAddress: ' + rediAddress);
//                                    console.log('apmonitorMongoSession: ' + mongooSession);
//                                    console.log('apmonitorMongoAddress: ' + mongooAddress);
//                                    done();
//                                }
//                            });
//                        });
//                    });
//                });
//            });
//            it("assert result of apmonitor by optType=1", function () {
//                if (apmonitorMessage != undefined) {
//                    assert.equal(JSON.parse(apmonitorMessage).devSN, option12.devSN);
//                    assert.equal(JSON.parse(apmonitorMessage).tokenID, option12.tokenID);
//                    assert.equal(JSON.parse(apmonitorMessage).devModName, option12.devModName);
//                    JSON.parse(apmonitorMessage).retCode.should.equal(0);
//                    JSON.parse(apmonitorMessage).optType.should.equal(1);
//
//                    assert.equal(apmonitorRedisSession, option12.tokenID);
//                    assert.equal(apmonitorMongoSession, option12.tokenID);
//                    expect(isip(apmonitorRedisAddress)).to.be.true;
//                    expect(isip(apmonitorMongoAddress)).to.be.true;
//
//                }
//            });
//            it("get information of devmonitor by optType=1", function (done) {
//
//                options.cloudModName = 'devmonitor';
//                option13 = options;
//                console.log("options.........");
//                console.log(option13);
//
//                createConnection(host + '/v3/devmonitor', headers, function (connect) {
//                    sendMsg(connect, option13, function () {
//                        recvMsg(connect, function (message) {
//                            findSessionIdAndServerAddress(connectionModel, option13, function (redisSession, rediAddress, mongooSession, mongooAddress) {
//                                if (JSON.parse(message).optType == 1) {
//
//                                    devmonitorMessage = message;
//                                    devmonitorRedisSession = redisSession;
//                                    devmonitorRedisAddress = rediAddress;
//                                    devmonitorMongoSession = mongooSession;
//                                    devmonitorMongoAddress = mongooAddress;
//                                    console.log('devmonitorMessage: ' + message);
//                                    console.log('devmonitorRedisSession: ' + redisSession);
//                                    console.log('devmonitorRedisAddress: ' + rediAddress);
//                                    console.log('devmonitorMongoSession: ' + mongooSession);
//                                    console.log('devmonitorMongoAddress: ' + mongooAddress);
//                                    done();
//                                }
//                            });
//                        });
//                    });
//                });
//            });
//            it("assert result of devmonitor by optType=1", function () {
//                if (devmonitorMessage != undefined) {
//                    assert.equal(JSON.parse(devmonitorMessage).devSN, option13.devSN);
//                    assert.equal(JSON.parse(devmonitorMessage).tokenID, option13.tokenID);
//                    assert.equal(JSON.parse(devmonitorMessage).devModName, option13.devModName);
//                    JSON.parse(devmonitorMessage).retCode.should.equal(0);
//                    JSON.parse(devmonitorMessage).optType.should.equal(1);
//
//                    assert.equal(devmonitorRedisSession, option13.tokenID);
//                    assert.equal(devmonitorMongoSession, option13.tokenID);
//                    expect(isip(devmonitorRedisAddress)).to.be.true;
//                    expect(isip(devmonitorMongoAddress)).to.be.true;
//                }
//            });
//            it("get information of maintenance by optType=1", function (done) {
//
//                options.cloudModName = 'maintenance';
//                option14 = options;
//                console.log("options.........");
//                console.log(option14);
//
//                createConnection(host + '/v3/maintenance', headers, function (connect) {
//                    sendMsg(connect, option14, function () {
//                        recvMsg(connect, function (message) {
//                            findSessionIdAndServerAddress(connectionModel, option14, function (redisSession, rediAddress, mongooSession, mongooAddress) {
//                                if (JSON.parse(message).optType == 1) {
//
//                                    maintenanceMessage = message;
//                                    maintenanceRedisSession = redisSession;
//                                    maintenanceRedisAddress = rediAddress;
//                                    maintenanceMongoSession = mongooSession;
//                                    maintenanceMongoAddress = mongooAddress;
//                                    console.log('maintenanceMessage: ' + message);
//                                    console.log('maintenanceRedisSession: ' + redisSession);
//                                    console.log('maintenanceRedisAddress: ' + rediAddress);
//                                    console.log('maintenanceMongoSession: ' + mongooSession);
//                                    console.log('maintenanceMongoAddress: ' + mongooAddress);
//                                    done();
//                                }
//                            });
//                        });
//                    });
//                });
//            });
//            it("assert result of maintenance by optType=1", function () {
//                if (maintenanceMessage != undefined) {
//                    assert.equal(JSON.parse(maintenanceMessage).devSN, option14.devSN);
//                    assert.equal(JSON.parse(maintenanceMessage).tokenID, option14.tokenID);
//                    assert.equal(JSON.parse(maintenanceMessage).devModName, option14.devModName);
//                    JSON.parse(maintenanceMessage).retCode.should.equal(0);
//                    JSON.parse(maintenanceMessage).optType.should.equal(1);
//
//                    assert.equal(maintenanceRedisSession, option14.tokenID);
//                    assert.equal(maintenanceMongoSession, option14.tokenID);
//                    expect(isip(maintenanceRedisAddress)).to.be.true;
//                    expect(isip(maintenanceMongoAddress)).to.be.true;
//                }
//            });
//            //***********************************≤‚ ‘base optType = undefined*******************
//            it("get information of base by optType=undefined", function (done) {
//
//                options.optType = undefined;
//
//                option15 = options;
//                createWsRecvAndFind(host, headers, option15, connectionModel, function () {
//
//                    done();
//                });
//            });
//            //***********************************≤‚ ‘withCloudModName**************************
//            it("test exception by withCloudModName", function (done) {
//                options.cloudModName = undefined;
//
//                option16 = options;
//                createWsRecvAndFind(host, headers, option16, connectionModel, function () {
//                    done();
//                });
//            });
//            //***********************************≤‚ ‘isNotJsonData*****************************
//            it("test exception by isNotJsonData", function (done) {
//                options = 'lvzhouhost';
//
//                createWsRecvAndFind(host, headers, options, connectionModel, function () {
//                    done();
//                });
//            });
//        });
//    });
//});