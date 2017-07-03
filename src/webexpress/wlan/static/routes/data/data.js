/**
 * Created by Administrator on 2016/1/24.
 */
var express = require('express');
//var config  = require('wlanpub').config;
var db      =   require('wlanpub').dbhd;
var schema  = require('../Schema/FindPwdScame');

// to sunanzhi:webserver???‘那㊣辰?芍??車mongo那y?Y?a㏒?∩?∩|2?D豕?迄芍??車mongo那y?Y?a
//var mongoConnParas    = config.get('mongoConnParas');
//console.log("mongoConnParas===="+mongoConnParas);
//db.connectMongoose(mongoConnParas);

var user_info = db.mongo.model("schema_findpwd", schema.schema_findpwd);

function saveUserInfo(param,callback){
    var userInfo ={
        Tel:param.Tel,
        AuthNum:param.AuthNum,
        SendTime:new Date(),
        Status:0
    }
    /*var userInfo ={
     Tel:'123456789',
     AuthNum:'2345',
     SendTime:new Date(),
     Status:"0"
     }*/
    var user_info1 = new user_info(userInfo);
    user_info1.save(function(err, userInfo, status){
        if(status == 0){
            console.log(status+"===========")
            callback(userInfo,status);
        }else if(status == 1){
            console.log(status+"===========")
            console.log(userInfo);
            callback(userInfo,status);
        }else{
            callback(null,status);
            console.log(err+"===========");
        }
    });

};

function findUserInfo(param,callback){
    //param = "18311337138"
    user_info.findOne({"Tel":param,"Status":0}).sort({'SendTime':'desc'}).exec(callback);

};

function updateUserInfo(param,callback){
    //param = "18311337138"
    user_info.findOneAndUpdate({Tel:param},{$set:{Status:1}}).sort({'SendTime':'desc'}).exec(callback);

};

//saveUserInfo();
//findUserInfo();
//findUserInfoAll();
//updateUserInfoAll();
exports.saveUserInfo = saveUserInfo;
exports.findUserInfo = findUserInfo;
exports.updateUserInfo = updateUserInfo;