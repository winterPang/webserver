var config = require('wlanpub').config;
var fs = require('fs');
var later = require('later');
var app = require('./app');
var hoturlConfig;

function hoturlInvaildFunc(url,path){
    if(url && typeof(url)=='string'&& path && typeof(path)=='string'){
        try{
            if(require.resolve(path) && require.cache[require.resolve(path)]){
                console.log('delete require cache:' + path);
                delete require.cache[require.resolve(path)];
            }
            var route = require(path);
            app.use(url, route);
        }catch(err){
            console.error('hoturl vaild failed url='+url+' path='+path);
            console.error('hoturl vaild error:'+err);
        }
    }
}

function hoturlTimer(){
    var hoturlInvaild;
    var hoturlVaildFile = hoturlConfig.vaildfile;
    fs.exists(hoturlVaildFile,function(exists){
       if(exists == true){
           //进行hoturl的实际处理
           try {
               //将hoturl生效文件相对于webserver.js的路径转换成相对于hoturl.js的路径
               hoturlInvaild = require('../'+hoturlVaildFile);
               if (hoturlInvaild.vaild == true) {
                   if (hoturlInvaild.urls) {
                       for (var i = 0; i < hoturlInvaild.urls.length; i++) {
                           hoturlInvaildFunc(hoturlInvaild.urls[i].url, '../'+hoturlInvaild.urls[i].path);
                       }
                   }
               }
           } catch (err) {
               console.error('hoturl timer error:' + err);
           }
           //将hoturl配置文件删除
           fs.unlink(hoturlVaildFile,function(err){
               if(err) {
                   console.error("hoturl vaild file: failed to delete" + hoturlVaildFile + ". Please check it.");
                   console.error("hoturl vaild file: delete err=" + err);
               }else{
                   console.log("hoturl vaild file: sucess to delete "+hoturlVaildFile);
               }
           });
       } else{
           console.log("hoturl vaild file: "+hoturlVaildFile+" not exist");
       }
    });
}

if (config.has('hoturlConfig')) {
    hoturlConfig = config.get('hoturlConfig');
    var hoturlEnable = hoturlConfig.enable;

    if(hoturlEnable == true) {
        var hoturlTime = hoturlConfig.time;
        var schedule = {
            schedules:hoturlTime
        };

        later.date.localTime();

        var t = later.setInterval(hoturlTimer, schedule);
    }
}

module.exports = hoturlConfig;
