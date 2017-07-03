var express                 = require('express');
var mqhd                    = require('wlanpub').mqhd;
var basic                   = require('wlanpub').basic;
var router                  = express.Router();
var async                   = require("wlanpub").async;
var connectionModel         = require('wlanpub').connectionModel;


function procGetDevice(request, res)
{
    function checkDevStatus(devSN)
    {

        return function (callback){
            async.waterfall([getSessionid(devSN), getWebAddress(devSN), getConnectionStatus(devSN)], function(err, status)
            {
                var devsnSta = {};
                devsnSta[devSN] = status;
                callback(null, devsnSta);
            });
        }
    }

    function getSessionid(devSN)
    {
        return function(callback)
        {
            console.log("[getMainconnection]: get sessionid!");
            connectionModel.getSessionidByDevSN(devSN, function(error, sessionid)
            {
                if(error || !sessionid){
                    callback(1, 1);
                }
                else
                {
                    callback(null, sessionid);
                }
            });
        }
    }

    function getWebAddress(devSN)
    {
        return function(sessionid, callback)
        {
            console.log("[getMainconnection]: get getWebAddress!");
            connectionModel.getAddressByDevSNandSessionid(devSN, sessionid, 'cmtnlmgr', 'base', function(err, serverAddress){
                if(err || !sessionid){
                    callback(2, 1);
                }
                else
                {
                    callback(null, serverAddress, sessionid);
                }        
            });
        }
    }

    function getConnectionStatus(devSN)
    {
        return function(serverAddress, sessionid, callback)
        {
            console.log("[getMainconnection]: get getConnectionStatus!", devSN, sessionid, serverAddress);
            var param = JSON.stringify({method:"getMainConnectionStatus", msgType:3, param:{devSN:devSN, sessionid:sessionid}});

            mqhd.sendMsg(serverAddress, param, function(doc)
            {
                var odoc = doc;
                if(odoc.data.retCode == 0)
                {
                    callback(null, odoc.data.message);
                    return;
                }
                callback(3, 1);
            });
        }
    }

    if(!request.body.devSN)
    {
        res.json({retCode:-1, message:"devsn is null"});
        res.end();
        return;
    }

    var jsonData = request.body;
    var funcNeed2Exec = [];
    var devSNlist = Array.isArray(jsonData.devSN)?jsonData.devSN:[jsonData.devSN];
    
    console.log("[getMainconnection]: get getConnectionStatus!", jsonData);
    for(var i = 0; i < devSNlist.length; i++)
    {
        var devSN = devSNlist[i];
        funcNeed2Exec.push(checkDevStatus(devSN));
    }

    async.parallel(funcNeed2Exec, function(err, doc){
        delete doc.url;
        res.json({retCode:0, message:doc});
        res.end();
        return;
    });

}

router.post("/", function(req, res, next)
{
    if (!req.session || !req.session.cas_user || !req.session.cas_user.attributes || !req.session.cas_user.attributes.name) {
        var resData = {retCode: -1, message:"session wrong!"};
        res.json(resData);
        res.end();
        return;
    }

    procGetDevice(req, res);
});

module.exports = router;