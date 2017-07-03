/**
 * Created by Administrator on 2016/2/1.
 */
var url = require('url');
var qs = require('querystring');
var mqhd  = require('wlanpub').mqhd;

//΢���˳��ٵ�¼session��ֵ
function isBindCloud(req, res, next) {
    if (req.session.arb_info == undefined) {
        res.redirect("/v3/web");
    } else {
        if (req.session[req.session.arb_info.arb_session_name] && (req.session.arb_info.firstTime == true)) {
            sendAddMsg(req, res);
        } else {
            sendInquireMsg(req, res);
        }
    }
}

function sendInquireMsg(req, res) {
    console.warn('web:' + req.url);

    var urlparam = qs.parse(url.parse(req.url).query);
    var orinparam = qs.parse(url.parse(req.session.cas_return_to).query);

    var code = urlparam.code != undefined ? urlparam.code : orinparam.code;

    console.warn("code:   "+code);

    var sendMsg = {};
    sendMsg.url     = '/getaccountbyopenid';
    sendMsg.body    = {
        "code": code
    };

    if (code !== undefined) {
        mqhd.sendMsg("wechatnotify", JSON.stringify(sendMsg), function (jsonData) {
            req.session.arb_info.openID=jsonData.body.openID;
            if (req.session.arb_info.openID == undefined) {
               res.redirect('/v3/arb/wechatnotify/logout');
            } else {
                if (jsonData.body.retCode === 0) {
                    req.session[req.session.arb_info.arb_session_name] = {
                        "user": jsonData.body.account
                    };
                    res.redirect('/v3/arb/wechatnotify/home.html');
                } else {
                    if(req.session.arb_info.firstTime == false){
                        res.redirect('/v3/arb/wechatnotify/logout');
                    }else{
                        res.redirect(req.session.arb_info.redirectUrl);
                    }
                }
                console.warn('  response data: ' + JSON.stringify(jsonData));
            }
        });
    }
}

function sendAddMsg(req, res){
    console.warn('web:' + req.url);
    var session= req.session;

    var sendMsg = {};
    sendMsg.url     = '/addaccount';
    sendMsg.body    = {
        "account": session[req.session.arb_info.arb_session_name].user,
        "openID": session.arb_info.openID
    };

    //res.redirect('/v3/arb/wechatnotify/home.html');
    if (sendMsg.body.account !== undefined) {
        mqhd.sendMsg("wechatnotify", JSON.stringify(sendMsg), function (jsonData) {
            console.warn('  response data: ' + JSON.stringify(jsonData));
            if (jsonData.body.retCode == 0){
                session.arb_info.firstTime = false;
                res.redirect('/v3/arb/wechatnotify/home.html');
            }else{
                res.redirect(session.arb_info.redirectUrl);
            }
        });
    }
}

exports.isBindCloud = isBindCloud;