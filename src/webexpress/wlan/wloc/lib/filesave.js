/**
 * Created by Administrator on 2016/5/11.
 */
var mongooper = require('wlanpub').mongooper;
var fs = require('fs');
var hdfshd = require('wlanpub').hdfsoper;
var async = require('wlanpub').async;
var getHdfsOption = hdfshd.getHdfsOption;
var hdfsConnOption = getHdfsOption('hdfsConnOption');
var HDFSPATH = 'http://' + hdfsConnOption.host + ':' + hdfsConnOption.port + hdfsConnOption.path;
var multiparty = require('multiparty');
var util = require('util');
var request = require('request');
var express = require('express');
var mapFilePath = './localfs/v3/wloc_map/';
var config = require('wlanpub').config;
var redisConnParas = config.get('redisConnParas');
var wlocmongoConnParas = config.get('wlocmongoConnParas');

var dbhandle = mongooper.connectDatabase("webserver",wlocmongoConnParas);
global.dbMap = dbhandle.mongo;
var Schema = dbhandle.Schema;

var schema_map = new Schema({
    mapName: String,
    devSN: String,
    dateBase64: String,
    dateBase64lenth: Number
});

var schema_mapInfoAndFile = new Schema({
    mapName: String,
    devSN: String,
    dateBase64: String,
    dateBase64lenth: Number,
    scale: Number, //比例尺
    mapName: String,//地图名字
    apList: [], /* ap列表，数组成员为一个对象,{ apName:apName,   //ap名字 
                                               macAddr:macAddr, //ap mac地址
                                               XCord:XCord,    //ap x坐标
                                               YCord:YCord     //ap y坐标}*/
    areaList: [],/* 区域列表，数组成员为一个对象,{ areaName:areaName,   //区域名字 
                                               areaType:areaType, //区域类型
                                               nodes:[{
                                                    xPos:xPos      //区域顶点的y坐标                                    xPos:xPos,    //ap x坐标
                                                    yPos:yPos,     //区域顶点的y坐标
                                               }]
                                               }*/
    tag: String,// 数据状态标记 New为还未下发设备的地图信息 Old为已经下发设备的地图信息 Del说明删除了的地图
});

var schema_hdfs = new Schema({
    mapName: String,
    devSN: String,
    hdfspath: String,
    type: String,
    index: String,
    localPath: String
});

/**********************************************************************************
 * Description: 通过表名来生成数据库句柄
 *      Author: ykf5327
 *        Date: 2016/10/28
 *   Parameter: sModelName：数据库表名
 *              oSchema：表的Schema结构
 *              oIndex：数据库查找的索引
 *      return: NaN
 *     Caution: NaN
 *************************************************************************************/
function getModelByName(sModelName, oSchema, oIndex) {
    var oModel;
    try {
        oModel = dbMap.model(sModelName);
        if (oModel === undefined) {
            getModelByName(sModelName, oSchema, oIndex);
        }
        return oModel;
    }
    catch (err) {
        oSchema.index(oIndex);
        oModel = dbMap.model(sModelName, oSchema);
        if (oModel === undefined) {
            getModelByName(sModelName, oSchema, oIndex);
        }
        return oModel;
    }
}


function deleteFileFromWebserver(srcpath) {
    fs.unlink(srcpath, function (error) {
        if (!error) {
            console.log("[fsserver]del file: " + srcpath + " success");
        }
    });
}

function filemode() {
}

/**********************************************************************************
 * Description: 添加地图文件到数据库新接口1
 *      Author: ykf5327
 *        Date: 2016/10/28
 *   Parameter: devSN   ：设备序列号
 *              mapName ：地图名字
 *              path2   ：图片在webserver的本地路径
 *              index   ：地图索引
 *              type    ：地图的类型backgroud或者shortcut
 *              res     ：给前端的应答回调函数
 *      return: NaN
 *     Caution: NaN
 *************************************************************************************/
filemode.prototype.addMapImage = function (devSN, mapName, dateBase64, callback) {
    var oMessage = {
        retcode: 0,
        info: ""
    }

    try {
        console.warn("addMapImage");
        var modelName = "map__" + devSN.toLowerCase();
        var oIndex = { mapName: 1 };
        var oMapfileModel = getModelByName(modelName, schema_map, oIndex);
        var oSave = {
            devSN: devSN,
            mapName: mapName,
            dateBase64: dateBase64,
            dateBase64lenth: dateBase64.length
        }
        var omatch = {
            mapName: mapName
        };

        var oSet = {
            $set: oSave
        }
        var startTime = new Date().getTime();
        oMapfileModel.update(omatch, oSet, { upsert: true }, function (err) {
            var endTime = new Date().getTime();
            if (endTime - startTime > 2000) {
                console.warn("addMapImage update time > 2000 startTime = %d endTime = %d", startTime, endTime);
            }
            if (err) {
                oMessage.retcode = -1;
                oMessage.info = "addMapImage oMapfileModel.update " + err;
                console.error(JSON.stringify(oMessage));
                callback(oMessage);
                return;
            }
            callback(oMessage);
        });

    }
    catch (err) {
        oMessage.retcode = -1;
        oMessage.info = "addMapImage catch " + err;
        callback(oMessage);
        return;
    }
};

/**********************************************************************************
 * Description: 添加地图文件地图信息到同一张表
 *      Author: ykf5327
 *        Date: 2016/10/28
 *   Parameter: devSN   ：设备序列号
 *              mapName ：地图名字
 *              path2   ：图片在webserver的本地路径
 *              index   ：地图索引
 *              type    ：地图的类型backgroud或者shortcut
 *              res     ：给前端的应答回调函数
 *      return: NaN
 *     Caution: NaN
 *************************************************************************************/
filemode.prototype.addMapInfoAndMapFiletoMongoose = function (fields, callback) {
    var oMessage = {
        retcode: 0,
        info: ""
    }

    try {
        var devSN = fields.devSN[0];
        console.warn("addMapInfoAndMapFiletoMongoose");
        var modelName = "mapinfoandfile" + devSN.toLowerCase();
        var oIndex = { mapname: 1 };
        var oMapfileModel = getModelByName(modelName, schema_mapInfoAndFile, oIndex);

        var oSave = {
            devSN: devSN,
            mapName: fields.mapName[0],
            dateBase64: fields.imgData[0],
            dateBase64lenth: fields.imgData[0].length,
            scale: fields.scale[0],
            apList: fields.apList[0],
            areaList: fields.apList[0],
            tag: "New"
        }
        if (fields.type[0] != undefined && fields.type[0] == "add") {
            /* 添加操作需要进行重复判断 */
            oMapfileModel.find(omatch, function (err, oDoc) {
                if (err) {
                    console.error("addMapInfoAndMapFiletoMongoose oMapfileModel.find " + err);
                    oMessage.retcode = -1;
                    oMessage.info = "addMapInfoAndMapFiletoMongoose find " + err;
                    callback(oMessage);
                    return;
                }
                if (undefined != oDoc[0]) {
                    /* 说明地图已经存在*/
                    oMessage.retcode = -2;
                    oMessage.info = "addMapInfoAndMapFiletoMongoose map is exit mapName = " + fields.mapName[0];
                    callback(oMessage);
                    return;
                }

                var oSaveModel = new oMapfileModel(oSave);
                oSaveModel.save(function (err) {
                    if (err) {
                        console.error("addMapInfoAndMapFiletoMongoose oMapfileModel.save " + err);
                        oMessage.retcode = -1;
                        oMessage.info = "addMapInfoAndMapFiletoMongoose oMapfileModel.save " + err;
                        callback(oMessage);
                        return;
                    }
                    oMessage.info = "addMapInfoAndMapFiletoMongoose add Map success";
                    callback(oMessage);
                });

            })
        }
        else if (fields.type[0] != undefined && fields.type[0] == "modify") {
            var omatch = {
                mapName: fields.mapName[0]
            };

            var oSet = {
                $set: oSave
            }

            var startTime = new Date().getTime();
            oMapfileModel.update(omatch, oSet, { upsert: true }, function (err) {
                var endTime = new Date().getTime();
                if (endTime - startTime > 2000) {
                    console.warn("addMapInfoAndMapFiletoMongoose update time > 2000 startTime = %d endTime = %d", startTime, endTime);
                }
                if (err) {
                    oMessage.retcode = -1;
                    oMessage.info = "addMapInfoAndMapFiletoMongoose oMapfileModel.update " + err;
                    console.error(JSON.stringify(oMessage));
                    callback(oMessage);
                    return;
                }
                callback(oMessage);
            });
        }
    }
    catch (err) {
        oMessage.retcode = -1;
        oMessage.info = "addMapInfoAndMapFiletoMongoose catch " + err;
        callback(oMessage);
        return;
    }
};

/**********************************************************************************
 * Description: 从数据库下载地图文件到webserver本地新接口1
 *      Author: ykf5327
 *        Date: 2016/10/28
 *   Parameter: devSN   ：设备序列号
 *              mapName ：地图名字
 *              index   ：地图索引
 *              type    ：地图的类型backgroud或者shortcut
 *              res     ：给前端的应答回调函数
 *      return: NaN
 *     Caution: NaN
 *************************************************************************************/
filemode.prototype.downloadMapImage = function (devSN, mapName, res) {
    var backmsg = {
        info: "",
        retcode: 0
    };
    var omatch = {
        mapName: mapName
    };
    try {
        console.warn("downloadMapImage ");
        console.warn(devSN);
        console.warn(JSON.stringify(omatch));
        var modelName = "map__" + devSN.toLowerCase();
        console.warn(modelName);
        var oIndex = { mapName: 1 };
        var oMapfileModel = getModelByName(modelName, schema_map, oIndex);
        /* 根据devSN 地图名字 type找到地图的文件流 */
        console.warn("downloadMapImage oMapfileModel.find start");
        var time1 = new Date();
        console.warn(time1);
        console.warn(time1.getTime());
        oMapfileModel.find(omatch, function (err, oDoc) {
            console.warn("downloadMapImage oMapfileModel.find end");
            var time2 = new Date();
            console.warn(time2);
            console.warn(time2.getTime());
            if (time2.getTime() - time2.getTime() > 2000) {
                console.warn("downloadMapImage time2 - time1 > 2000");
            }
            if (err) {
                console.error("downloadMapImage mapfile.find faile error : " + err);
                backmsg.info = "downloadMapImage mapfile.find faile error : " + err;
                backmsg.retcode = -1;
                res.write(JSON.stringify(backmsg));
                res.end();
                return;
            }
            else {
                if (oDoc.length === 0) {
                    console.warn("downloadMapImage mapfile.find success but oDoc.length is 0");
                    backmsg.info = "downloadMapImage mapfile.find success but oDoc.length is 0";
                    backmsg.retcode = -1;
                    res.write(JSON.stringify(backmsg));
                    res.end();
                    return;
                }
                else {
                    try {
                        /* 将Buffer转换为地图文件并保存到webserver /localfs/v3/wloc_map/ 这个文件夹下 */
                        var dataBuffer = new Buffer(oDoc[0].dateBase64, 'base64');
                        var time3 = new Date();
                        console.warn(time3.getTime());
                        fs.writeFile(oDoc[0].path, dataBuffer, function (err) {
                            if (err) {
                                console.error("downloadMapImage fs.writeFile faile error : " + err);
                                backmsg.info = "downloadMapImage fs.writeFile faile error : " + err;
                                backmsg.retcode = -1;
                                res.write(JSON.stringify(backmsg));
                                res.end();
                                return;
                            }
                            else {
                                var filename = oDoc[0].devSN + "-" + oDoc[0].index + ".jpg";
                                console.warn(filename);
                                /* 地图下载完以后，将页面的get请求重定向到webserver的静态路径 */
                                var time4 = new Date();
                                console.warn(time4.getTime());
                                if (time4.getTime() - time3.getTime() > 2000) {
                                    console.warn("downloadMapImage fs.writeFile time4 - time3 > 2000");
                                }
                                if (time4.getTime() - time1.getTime() > 3000) {
                                    console.warn("downloadMapImage writeHead time4 - time1 = %d", time4.getTime() - time1.getTime());
                                }
                                res.writeHead(303, { 'Location': "/v3/wloc_map/" + filename });
                                res.end();
                                return;
                            }

                        })
                    }
                    catch (err) {
                        console.error("downloadMapImage fs.writeFile faile error : " + err);
                        backmsg.info = "downloadMapImage fs.writeFile faile error : " + err;
                        backmsg.retcode = -1;
                        res.write(JSON.stringify(backmsg));
                        res.end();
                        return;
                    }

                }

            }
        });
    }
    catch (err) {
        console.error("downloadMapImage mapfile.find faile error : " + err);
        backmsg.info = "downloadMapImage mapfile.find faile error : " + err;
        backmsg.retcode = -1;
        res.write(JSON.stringify(backmsg));
        res.end();
        return;
    }

};

/**********************************************************************************
 * Description: 从数据库下载地图文件到webserver本地新接口1
 *      Author: ykf5327
 *        Date: 2016/10/28
 *   Parameter: devSN   ：设备序列号
 *              mapName ：地图名字
 *              index   ：地图索引
 *              type    ：地图的类型backgroud或者shortcut
 *              res     ：给前端的应答回调函数
 *      return: NaN
 *     Caution: NaN
 *************************************************************************************/
filemode.prototype.getMapBase64 = function (devSN, mapName, res) {
    var backmsg = {
        info: "",
        retcode: 0,
        image: ""
    };
    var omatch = {
        mapName: mapName
    };
    try {
        console.warn(JSON.stringify(omatch));
        var modelName = "map__" + devSN.toLowerCase();
        var oIndex = { mapName: 1 };
        var oMapfileModel = getModelByName(modelName, schema_map, oIndex);
        console.warn("getMapBase64 oMapfileModel.find start");
        var time1 = new Date();
        console.warn(time1);
        console.warn(time1.getTime());
        oMapfileModel.find(omatch, function (err, oDoc) {
            console.warn("getMapBase64 oMapfileModel.find end");
            var time2 = new Date();
            console.warn(time2);
            console.warn(time2.getTime());
            if (time2.getTime() - time2.getTime() > 2000) {
                console.warn("getMapBase64 time2 - time1 > 2000");
            }
            if (err) {
                console.error("getMapBase64 mapfile.find faile error : " + err);
                backmsg.info = "getMapBase64 mapfile.find faile error : " + err;
                backmsg.retcode = -1;
                res.write(JSON.stringify(backmsg));
                res.end();
                return;
            }
            else {
                if (oDoc.length === 0) {
                    console.warn("getMapBase64 mapfile.find success but oDoc.length is 0");
                    backmsg.info = "getMapBase64 mapfile.find success but oDoc.length is 0";
                    backmsg.retcode = -1;
                    res.write(JSON.stringify(backmsg));
                    res.end();
                    return;
                }
                else {
                    try {
                        /* 将Buffer转换为地图文件并保存到webserver /localfs/v3/wloc_map/ 这个文件夹下 */
                        backmsg.image = oDoc[0].dateBase64;
                        res.write(JSON.stringify(backmsg));
                        res.end();
                        return;
                    }
                    catch (err) {
                        console.error("getMapBase64 fs.writeFile faile error : " + err);
                        backmsg.info = "getMapBase64 fs.writeFile faile error : " + err;
                        backmsg.retcode = -1;
                        res.write(JSON.stringify(backmsg));
                        res.end();
                        return;
                    }

                }

            }
        });
    }
    catch (err) {
        console.error("getMapBase64 mapfile.find faile error : " + err);
        backmsg.info = "getMapBase64 mapfile.find faile error : " + err;
        backmsg.retcode = -1;
        res.write(JSON.stringify(backmsg));
        res.end();
        return;
    }

};

/**********************************************************************************
 * Description: 从数据库删除地图文件新接口
 *      Author: ykf5327
 *        Date: 2016/10/28
 *   Parameter: devSN   ：设备序列号
 *              index   ：地图索引
 *              res     ：给前端的应答回调函数
 *      return: NaN
 *     Caution: NaN
 *************************************************************************************/
filemode.prototype.removeMapImage = function (devSN, mapName, res) {
    var backmsg = {
        errorMessage: "",
        retCode: 0
    };
    var omatch = {
        mapName: mapName
    };
    try {
        var modelName = "map__" + devSN.toLowerCase();
        var oIndex = { mapName: 1 };
        console.warn("removeMapImage");
        console.warn(JSON.stringify(omatch));
        var oMapfileModel = getModelByName(modelName, schema_map, oIndex);
        oMapfileModel.remove(omatch, function (err, oDoc) {
            if (err) {
                console.error("removeMapImage mapfile.remove faile " + err);
                backmsg.errorMessage = "removeMapImage mapfile.remove faile : " + err;
                backmsg.retCode = -1;
                res.write(JSON.stringify(backmsg));
                res.end();
                return;
            }
            else {
                console.warn("removremoveMapImageeMap mapfile.remove success : ");
                backmsg.errorMessage = "removeMapImage mapfile.remove success ";
                backmsg.retCode = 0;
                res.write(JSON.stringify(backmsg));
                res.end();
                return;

            }
        });
    }
    catch (err) {
        console.error("removeMapImage mapfile.remove faile  : " + err);
        backmsg.errorMessage = "removeMapImage mapfile.remove faile  : " + err;
        backmsg.retCode = -1;
        res.write(JSON.stringify(backmsg));
        res.end();
        return;
    }

};

/**********************************************************************************
 * Description: 添加地图文件到hdfs上（暂时没有用）
 *      Author: ykf5327
 *        Date: 2016/10/28
 *   Parameter: odata-------前端页面下发过来的消息，odata.body.Param里面必须携带
 *                          devSN：设备序列号
 *                          mapName：地图的名字
 *                          path：地图的server路径
 *                          index：地图的索引，唯一标示一张地图
 *                          type：地图类型是截图还是原图
 *                          res：给前端回应消息的方法
 *              callback----callback是给前端应答消息的回调函数
 *      return: NaN
 *     Caution:
 *************************************************************************************/
filemode.prototype.addMapFiletoHDFS = function (devSN, mapName, path, index, type, res) {
    var sHdfspathTemp = HDFSPATH + 'wloc_map/' + devSN + '/';
    var sHdfspathMapTemp = sHdfspathTemp + devSN + "_" + index + "_" + type + '.jpg';
    var hdfsDir = request.put(sHdfspathTemp + "?op=MKDIRS");
    var respHttp = {};
    hdfsDir.on('response', function (response) {
        if (200 == response.statusCode) {
            var hdfs = request.put(sHdfspathMapTemp + '?op=CREATE&overwrite=true');
            hdfs.on('response', function (response) {
                var rdfs = fs.createReadStream(path);
                if (307 == response.statusCode) {
                    var options = {
                        url: response.headers.location,
                        method: 'PUT',
                        headers: {
                            'User-Agent': 'request',
                            'content-type': 'application/octet-stream'
                        }
                    };
                    var writeHdfs = request(options);
                    writeHdfs.on('end', function () {
                        var sModelName = "hdfspath_" + devSN;
                        var oIndex = { index: 1 }
                        var oModel = getModelByName(sModelName, schema_hdfs, oIndex);
                        var oMatch = {
                            devSN: devSN,
                            index: index,
                        }

                        var oSet = {
                            $set: {
                                devSN: devSN,
                                index: index,
                                localPath: path,
                                mapName: mapName,
                                type: type,
                                hdfspath: sHdfspathTemp
                            }
                        }

                        oModel.update(oMatch, oSet, { upsert: true }, function (err) {
                            if (err) {

                            }
                            else {
                                res.write("add ");
                                res.end();
                                return;
                            }
                        })
                    });
                    writeHdfs.on('error', function (err) {
                        respHttp.message = " write " + mapName + " to hdfs is failed";
                        respHttp.retCode = -1;
                        res.write(JSON.stringify(respHttp));
                        res.end();
                        console.warn("[addMapFiletoHDFS]" + err);
                        console.warn("[addMapFiletoHDFS]" + respHttp.message);
                        deleteFileFromWebserver(path);
                    });
                    rdfs.pipe(writeHdfs);

                    rdfs.on('error', function (error) {
                        console.error("[addMapFiletoHDFS]" + error);
                        res.end();
                    });
                    console.log("[addMapFiletoHDFS]rdfs:\r\n" + JSON.stringify(rdfs));
                }
            });
        }
        else {
            console.warn(sHdfspathTemp + "  MKDIRS faile response.statusCode = %d", response.statusCode);
            res.write(sHdfspathTemp + "  MKDIRS faile response.statusCode = " + response.statusCode);
            res.end();
            return;
        }
    });
    hdfsDir.on('error', function (err) {
        res.write("HDFS makedir failed!" + err);
        res.end();
        return;
    });

}

filemode.prototype.addFileTohdfs = function (res) {
    var sHdfspathTemp = HDFSPATH + 'wloc/';
    var sHdfspathFileTemp = sHdfspathTemp + "niuniu.jpg";
    console.warn("addFileTohdfs   " + sHdfspathFileTemp);
    var hdfsDir = request.put(sHdfspathTemp + "?op=MKDIRS");
    hdfsDir.on('response', function (response) {
        if (response.statusCode === 200) {
            var hdfs = request.put(sHdfspathFileTemp + '?op=CREATE&overwrite=true');

            hdfs.on('response', function (response) {
                console.log("addFileTohdfs hdfs.on response.statusCode = %d ", response.statusCode);
                if (307 == response.statusCode) {
                    var options = {
                        url: response.headers.location,
                        method: 'PUT',
                        headers: {
                            'User-Agent': 'request',
                            'content-type': 'application/octet-stream'
                        }
                    };
                    var sPath = mapFilePath + "niuniu.jpg"
                    var rdfs = fs.createReadStream(sPath);
                    var writeHdfs = request(options);
                    writeHdfs.on('end', function () {
                        console.warn("addFileTohdfs on end");
                        var sModelName = "hdfspath";
                        var oIndex = { index: 1 }
                        var oModel = getModelByName(sModelName, schema_hdfs, oIndex);
                        var oMatch = {
                            devSN: "devSN",
                            index: 100,
                        }

                        var oSet = {
                            $set: {
                                devSN: "devSN",
                                index: 100,
                                localPath: sPath,
                                mapName: "mapName",
                                type: "type",
                                hdfspath: sHdfspathFileTemp
                            }
                        }

                        oModel.update(oMatch, oSet, { upsert: true }, function (err) {
                            console.warn("addFileTohdfs oModel update " + err);
                            res.write("addFileTohdfs oModel update " + err);
                            res.statusCode = 200;
                            res.end();
                        })
                    });
                    writeHdfs.on('error', function (err) {
                        console.error("addFileTohdfs writeHdfs on error " + err);
                        res.write("addFileTohdfs writeHdfs on error " + err);
                        res.statusCode = 200;
                        res.end();
                    });
                    rdfs.pipe(writeHdfs);

                    rdfs.on('error', function (err) {
                        console.error("addFileTohdfs rdfs on error" + err);
                        res.write("addFileTohdfs rdfs on error" + err);
                        res.statusCode = 200;
                        res.end();
                    });
                }
            })
        }
        else {
            console.warn("addFileTohdfs hdfsDir.on response.status = %d", response.statusCode);
            res.write("addFileTohdfs hdfsDir.on response.status " + response.statusCode);
            res.statusCode = 200;
            res.end();
        }
    })
}

var filesave = module.exports = new filemode;
