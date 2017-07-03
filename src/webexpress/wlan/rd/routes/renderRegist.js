/**
 * Created by Administrator on 2016/1/4.
 */
var crypto = require("crypto");

var SiteID = "lvzhou";
var SiteKey = "ABCD1235";
//var ReturnUrl = "http://bpm.h3c.com/bpm/sso.nsf?opendatabase&gourl=http://bpm.h3c.com/bpm/bpm.nsf/frm?readform"//http://bpm.h3c.com/bpm/bpm.nsf/frm?readform
//var ReturnUrl = "http://localhost/v3/rd/home"//http://bpm.h3c.com/bpm/bpm.nsf/frm?readform
//var ReturnUrl = "http://www.baidu.com"

var Seprator = "%24";//$
var TimeFormate = "yyyy-MM-dd HH:mm:ss";
var timeOut = 10;


function Serialize(params){
    Date.prototype.Formate = function(){
        function formate(time){
            return (time < 10 ?("0"+time):time);
        }
        return ""+this.getFullYear()+"-"+formate(this.getMonth()+1)+"-" +formate(this.getDate())+" "+formate(this.getHours())+":"+formate(this.getMinutes())+":"+formate(this.getSeconds());
    };
    var ReturnUrl = "https://"+params+"/rd/home";
    function addSpace(str){
        var res = "";
        for(var i = 0;i<str.length;++i){
            res +=(str[i]+String.fromCharCode(0x00));
        }
        return res;
    }
    function SerializeSite(){

        var str = addSpace(SiteID);
        return (new Buffer(str)).toString("base64");
    }
    function SerializeReturnUrl(){
        var str = addSpace(ReturnUrl);
        return (new Buffer(str)).toString("base64");
    }
    function SerializeExpireTimeAndSignature() {
        for (var i = 0; i < 10; i++) {
            var expireTime = new Date();
            expireTime.setSeconds(expireTime.getSeconds()+i);
            expireTime.setMinutes(expireTime.getMinutes()+timeOut);
            var time = expireTime.Formate();
            var strSignature = crypto.createHash('md5').update(addSpace(time)+SiteKey).digest("base64");
            //console.warn('i = %s, strSignature = %s.', i, strSignature);
            if (strSignature.indexOf('+') == -1 || i == 9) {
                var str = addSpace(time);
                var strExpireTime = (new Buffer(str)).toString("base64");
                return strExpireTime+Seprator+strSignature;
            }
        }

    }
    var strSiteID = SerializeSite();
    var strReturnUrl = SerializeReturnUrl();
    var strExpireTimeAndSignature = SerializeExpireTimeAndSignature();
    var res = strSiteID+Seprator+strReturnUrl+Seprator+strExpireTimeAndSignature;
    res = "https://sso.h3c.com/adloginpage.aspx?RequestTicket="+res;
   /* var fs =require("fs");
    fs.writeFileSync("b.txt",res);*/
    return res;
}

function Deserialize(param){
    var responseObj={};
    var strs = param.split("$");
    for(var i =0;i<strs.length;i++){
        console.log("===i==="+i+"===value==="+strs[i])
    }

   function DeserializeUserIdentity(str, key)
   {    //decrypt
       var deKey = new Buffer(key,"ascii");
       var iv = new Buffer([1,2,3,4,5,6,7,8]);
       var userIdentity = "";
       try{
           var decipher = crypto.createDecipheriv("des",deKey,iv);
           //cipher.setAutoPadding(true);
           var txt = decipher.update(str, 'base64','utf8');
           txt += decipher.final('utf8');
           console.log(txt+"=======================");
           userIdentity=txt;
       }catch(err){
           console.error(err);
       }
       return userIdentity;
    }

    function DeserializeExpireTime(str)
    {
        // base64 decode
       var bytes = new Buffer(str,"base64");
        // bytes to string
        var strTimeout = bytes.toString("utf-8");
        console.log("===strTimeout==="+strTimeout)
        return strTimeout;
    }

    var  strSecurityIdentity = strs[0];
    var strExpireTime = strs[1];
    var strSignature = strs[2];

    var userInfo = DeserializeUserIdentity(strSecurityIdentity,SiteKey);
    var strTimeout=DeserializeExpireTime(strExpireTime);
    //userInfo.replace(//s/g, "");
    console.log(new Buffer(userInfo).toJSON());
    var sss = new Buffer(userInfo).toJSON().data;
    //console.log(sss);
    var ss = "";
    for(var i = 0; i < sss.length; i++){
        if(sss[i] == 0){
            continue;
        }
        ss += String.fromCharCode(sss[i]);
    }
    //console.log(ss);
    responseObj.userInfo =ss;
    responseObj.strTimeout = strTimeout;

   // console.log(responseObj.userInfo);
    return responseObj;
}

exports.Serialize = Serialize;
exports.Deserialize = Deserialize;
