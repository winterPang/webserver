
// connectioninfo:{
//     devSN:{
//         cloudmod:{
//             connectCount:xxx 连接次数OptType1   
//             accessTime:xxx    上次计算速率时间 
//             accessTotal:xxx  访问总数
//             accessCount:xxx  访问次数累计整百次且时间大于1秒时计算速率
//             accessRateS:xxx  访问次数/s
//             accessRateA:xxx  访问次数/min
//             accessLast5:[{count:interval}*5]
//             FlowTime:xxx     上次计算流量时间 
//             FlowTotal:xxx    总字节
//             FlowCount：xxx   字节数
//             FlowRateS: xxx   速率B/S
//             FlowRateA: xxx   速率B/M
//             FlowLast5:[{count:interval}*5]
//         }
//         .......
//     }
//     .......
// }
var connectionMap = require('./public').connectionMap;


function connectionProfiler()
{
    this.memLevel = 0  //0 normal  1 severity  2 fatal
    this.openFlag = false  //true--open    false--close
    this.connectionInfo = {};
}

function createConnectionInfo(devSN, cloudMod)
{
    if (!profiler.connectionInfo[devSN])
    {
        profiler.connectionInfo[devSN] = {};
    }

    profiler.connectionInfo[devSN][cloudMod] = {
        connectCount:0,
        accessTime:new Date(),
        accessTotal:0,
        accessCount:0,
        accessRateS:0,
        accessRateA:0,
        ByteTime:new Date(),
        ByteTotal:0,
        ByteCount:0,
        ByteRateS:0,
        ByteRateA:0
    }
}

//设置内存level  0-2
connectionProfiler.prototype.setMemLevel = function(nLevel)
{
    profiler.memLevel = nLevel;
    return
}

//更新连接请求计数
connectionProfiler.prototype.updateConnectionCount = function(devSN, cloudMod)
{
    //如果没有记录
    if (!profiler.connectionInfo[devSN] || !profiler.connectionInfo[devSN][cloudMod])
    {
        createConnectionInfo(devSN, cloudMod);
    }
  
    profiler.connectionInfo[devSN][cloudMod].connectCount++;
}


//更新访问计数
connectionProfiler.prototype.updateAccessCount = function(devSN, cloudMod)
{
    var now = new Date();
    var interval = 0;
    var conInfo = null;

    //如果没有记录
    if (!profiler.connectionInfo[devSN] || !profiler.connectionInfo[devSN][cloudMod])
    {
        createConnectionInfo(devSN, cloudMod);
    }

    conInfo = profiler.connectionInfo[devSN][cloudMod];
    conInfo.accessTotal++;
    conInfo.accessCount++;
    interval = (now - conInfo.accessTime)/1000;

    //计数为100的整数倍，并且时间间隔大于1秒钟，计算速率，并清零
    if ((conInfo.accessCount%100 == 0) && (interval >= 1))
    {
        conInfo.accessRateS = conInfo.accessCount/interval;
        conInfo.accessCount = 0;
        conInfo.accessTime = now;
        conInfo.accessRateA = conInfo.accessRateA?(conInfo.accessRateA + conInfo.accessRateS)/2:conInfo.accessRateS;
    }
}

//更新流量统计
connectionProfiler.prototype.updateAccessFlow = function(devSN, cloudMod, length)
{
    var now = new Date();
    var interval = 0;
    var conInfo = null;

    if (isNaN(length))
    {
        return;
    }

    //如果没有记录
    if (!profiler.connectionInfo[devSN] || !profiler.connectionInfo[devSN][cloudMod])
    {
        createConnectionInfo(devSN, cloudMod);
    }

    conInfo = profiler.connectionInfo[devSN][cloudMod];
    conInfo.ByteTotal += length;
    conInfo.ByteCount += length;
    interval = (now - conInfo.accessTime)/1000;

    //流量计数大于10K，并且时间间隔大于1秒钟，计算流量，并清零
    if ((conInfo.ByteCount > 10240) && (interval >= 1))
    {
        conInfo.ByteRateS = conInfo.ByteCount/interval;
        conInfo.ByteCount = 0;
        conInfo.ByteTime = now;
        conInfo.ByteRateA = conInfo.ByteRateA?(conInfo.ByteRateA + conInfo.ByteRateS)/2:conInfo.ByteRateS;
    }

}

//获取连接个数
connectionProfiler.prototype.getConnectionCount = function()
{
    return connectionMap.size;
}

//获取主连接个数
connectionProfiler.prototype.getMainCount = function()
{
    var count = 0;
    connectionMap.forEach(function(v,k){
        if (k.indexOf("base"))
        {
            count++;
        }
    })
    return count;
}

//根据序列号查询该设备连接总数
connectionProfiler.prototype.getConnectionCountBySN = function(sSN)
{
    var count = 0;
    connectionMap.forEach(function(v,k){
        if (k.indexOf(sSN))
        {
            count++;
        }
    })
    return count;
}

connectionProfiler.prototype.displayAccess = function()
{
    console.warn("[SHOW ACCESS]:")
    console.warn(JSON.stringify(profiler.connectionInfo));
}

//test获取监控信息
connectionProfiler.prototype.getConnectionProfiler = function(){
    return profiler.connectionInfo;
}

//重置统计
connectionProfiler.prototype.restartProfiler = function()
{
    profiler.connectionInfo = {};
}

// //
// connectionProfiler.prototype.getConnectionCount = function()
// {
//     var mainConnection = Object.getOwnPropertyNames(profiler.connectionInfo).length;
//     var connectionTotal = 0;
//     return {
//         "mainConnection":mainConnection,
//         "connectionTotal":connectionTotal
//     }
// }

//限制连接接口
connectionProfiler.prototype.IsAllowConnect = function(sSN)
{
    //如果没有开限速
    if (!profiler.openFlag)
    {
        return true;
    }
    
    if (!sSN)
    {
        console.error("[connProfiler] SN is undefinde");
        return false;
    }
    //总连接数大于3000
    if (profiler.getConnectionCount() > 3000)
    {
        console.error("[connProfiler] total connections greater than 3000, reject connect.");
        return false
    }

    //单台设备连接数大于30
    if (profiler.getConnectionCountBySN(sSN) > 30)
    {
        console.error("[connProfiler] SN:%S total connections greater than 30, reject connect.", sSN);
        return false;
    }

    return true;
}


connectionProfiler.prototype.IsAllowAccess = function(sSN, sCloudMod)
{
    if (!profiler.openFlag)
    {
        return true;
    }

    if (!sSN || !sCloudMod)
    {
        return false;
    }

    try{
        var conInfo = profiler.connectionInfo[devSN][cloudMod];

        //严重 && 访问频率1S大于5次
        if ((profiler.memLevel == 1) && (conInfo.accessRateS >= 5))
        {
            console.warn("[IsAllowAccess] access too often SN:%s, cloudMod:%s, memlevel:severity", sSN, sCloudMod);
            return false;
        }

        //致命 && 访问频率1S大于10次
        if ((profiler.memLevel == 2) && (conInfo.accessRateS >= 10))
        {
            console.error("[IsAllowAccess] access too often SN:%s, cloudMod:%s, memlevel:fatal", sSN, sCloudMod);
            return false;
        }
    }catch(err){
        console.log("IsAllowAccess with error: %s", err)
        return false;
    }

    return true;
}

connectionProfiler.prototype.IsAllowPkg = function(sSN, sCloudMod, sLen)
{
    if (!profiler.openFlag)
    {
        return true;
    }

    if (typeof sLen != "number")
    {
        return false;
    }

    try{
        //严重 && 报文长度大于1K 丢弃
        if ((profiler.memLevel == 1) && (sLen >= 1024))
        {
            console.warn("[IsAllowPkg] pkg too large SN:%s, cloudMod:%s, len:%s  memlevel:severity", sSN, sCloudMod, sLen);
            return false;
        }
        //致命 && 报文长度大于1K 丢弃
        if ((profiler.memLevel == 2) && (sLen >= 1024*5))
        {
            console.error("[IsAllowPkg] pkg too large SN:%s, cloudMod:%s, len:%s  memlevel:fatal", sSN, sCloudMod, sLen);
            return false;
        }
    }catch(err){
        console.log("IsAllowAccess with error: %s", err);
        return false;
    }

    return true;
}

var profiler = module.exports = new connectionProfiler;

