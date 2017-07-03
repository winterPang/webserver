var dbhd = require('wlanpub').dbhd;
var express = require('express');
var router = express.Router();
var conProfile = require('../../../../lib/conprofiler.js');
var pub = require('../../../../lib/public.js');
var getScenario = require('wlanpub').getScenario();
var connectionModel = require('wlanpub').connectionModel;

var bodyParser = require('body-parser');

// router.post('/SessionCheck', function(req, res, next){
//   dbhd.redisClient.get('sess:' + req.body.sessionId, function (err, reply)  {
//     if (!err) {
//         console.log('get session from redis: ' + reply);
//         res.jsonp({
//           errorcode:"success",
//           isValid : reply?true:false
//         });
//     }else {
//         console.error('get session failed with error: ' + err);
//         res.jsonp({
//           errorcode:"failed"
//         });
//     }
//   });
// });

router.get('/getConnectProfile', function (req, res, next) {
    res.json(conProfile.getConnectionProfiler());
});

router.get('/getMemoryUsed', function (req, res, next) {
    var memuse = process.memoryUsage();
    res.json(memuse);
})

router.get('/getMap', function (req, res, next) {
    var conMap = pub.connectionMap;
    var conInfo = {}
    conMap.forEach(function (v, k) {
        conInfo[k] = v.correlationId
    })
    res.json(conInfo);
});

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

router.use('/closeConnForAbtest', function (req, res, next) {
    if (req.query.userName || req.query.devSN) {
        var para = req.query;
    } else {
        var para = req.body;
    }

    var conMap = pub.connectionMap;
    var conn = null;
    var resJson = {}

    console.warn("closeConnForAbtest body: %j", para);
    if (para.userName) {
        getScenario.getDevsnListByUserName(para.userName, function (err, devList) {
            if (err) {
                resJson.reason = err;
                res.json(resJson);
            }
            else {
                var devRet = [];
                console.warn("devList:");
                console.warn(devList);
                for (var i = 0; i < devList.length; i++) {
                    (function (devSN4user) {
                        connectionModel.getSessionidByDevSN(devSN4user, function (err, sessionId) {
                            console.warn("devsn: %s", devSN4user);
                            if (err) {
                                devRet.push({
                                    'devSN': devSN4user,
                                    'ret': 'found session from db failed'
                                });
                            } else if (!sessionId) {
                                devRet.push({
                                    'devSN': devSN4user,
                                    'ret': 'session not found'
                                });
                            } else {
                                var correlationID = devSN4user + "/" + sessionId + "/cmtnlmgr/base";
                                console.warn("correlationID:%s", correlationID);
                                var conn4user = conMap.get(correlationID);
                                if (conn4user) {
                                    conn4user.close(1000, 'abtest close the connection.');
                                    devRet.push({
                                        'devSN': devSN4user,
                                        'ret': 'success'
                                    });
                                }
                                else {
                                    devRet.push({
                                        'devSN': devSN4user,
                                        'ret': 'conn not found'
                                    });
                                }
                            }
                            if (devList.length == devRet.length) {
                                resJson.reason = "success"
                                resJson.devSN = devRet
                                res.json(resJson);
                            }
                        })
                    })(devList[i]);
                }
            }
        });
    }
    else if (para.devSN) {
        conn = conMap.get(para.devSN);
        if (conn) {
            console.warn("find conn and close it.")
            conn.close(1000, 'abtest close the connection.');
            resJson.reason = "success";
            resJson.devSN = [{
                'devSN': para.devSN,
                'ret': 'success'
            }];
            res.json(resJson);
        }
        else {
            resJson.reason = "devSN not Found";
            res.json(resJson);
        }
    }
    else {
        resJson.reason = "invalid param";
        res.json(resJson);
    }
});

router.get('/SessionCheck', function (req, res, next) {
    dbhd.redisClient.get('sess:' + req.query.sessionId, function (err, reply) {
        var valid = false;
        var userName = null;
        var errorcode = "failed";
        if (!err) {
            errorcode = "success";
            if (reply) {
                var now = new Date();
                var sessionInfo = JSON.parse(reply);
                if ((now - new Date(sessionInfo.lastaccess)) < (1000 * 60 * req.query.num)) {
                    if (sessionInfo.cas_user) {
                        userName = sessionInfo.cas_user.attributes.name;
                        valid = true;
                    }
                }
            }
        }
        res.jsonp({
            errorcode: errorcode,
            isValid: valid,
            userName: userName
        });
    });
});

router.use('/getSessionID', function (req, res, next) {
    res.jsonp({
        sessionID: req.sessionID
    })
});

router.use("/inquireCookies", function (req, res, next) {
    //console.log("inquireCookies req.cookies " + req.cookies);
    if (JSON.stringify(req.cookies) === "{}") {
        res.end(JSON.stringify({
            errorcode: 1
        }));
    }
    else if (req.cookies) {
        // ��¼last access
        req.session["lastaccess"] = new Date();
        res.end(JSON.stringify({
            errorcode: 0
        }));
    }
    else {
        res.end(JSON.stringify({
            errorcode: 1
        }));
    }
});

module.exports = router;