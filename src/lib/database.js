var config          = require('wlanpub').config;
var dbhd            = require('wlanpub').dbhd;
var connectionModel = require('wlanpub').connectionModel;
var devdisconnModel = require('wlanpub').devdisconnModel;
var monitor         = require('wlanpub').monitor;

console.log(config);
console.log('NODE_CONFIG_DIR: ' + config.util.getEnv('NODE_CONFIG_DIR'));
console.log('NODE_ENV: ' + config.util.getEnv('NODE_ENV'));

var redisConnParas = config.get('redisConnParas');
var mongoConnParas = config.get('mongoConnParas');
// 初始化数据库连接
dbhd.connectDatabase(redisConnParas, mongoConnParas);
// 创建连接表，包括mongoose表和redis表
connectionModel.createConnectionModel(dbhd);

// 业务及进程监控, Redis服务器与云端模块区分开
monitor.createProcessStats('webserver');
//monitor.createMongoClient();
//devdisconnModel.createModel(monitor.mongoClient);
