/*******************************************************************************
 Copyright (c) 2011, Hangzhou H3C Technologies Co., Ltd. All rights reserved.
--------------------------------------------------------------------------------
@FileName:libs/frame/dbm.js
@ProjectCode: Comware v7
@ModuleName: Frame.DBM
@DateCreated: 2011-08-09
@Author: huangdongxiao 02807
@Description:
    本地数据存储，封装本地数据的存储，如果浏览器支持HTML5，使用HTML5的数据存储功能，
    如果不支持则使用cookie代替，此时对永久存储的数据有最大长度的限制。
@Modification:
*******************************************************************************/

;(function($F)
{


function isInclude(sOpt, sKey)
{
    var aOpt=sOpt.split("|");
    for(var i=0; i<aOpt.length; i++)
    {
        if(aOpt[i]==sKey)
        {
            return true;
        }
    }
   return false;
}

/*****************************************************************************
@typedef: DbmOption
@DateCreated: 2011-08-09
@Author: huangdongxiao 02807
@Description: DBM创建参数类型
@fields:
    * retentionDuration, integer, 老化时间，以秒为单位（0表示永远不老化），默认值为0
    * persistFlag, string, 持久化标志，取值为"none" or "cfg"。默认值为"none".
    * openFlag, string, 以何种方式打开数据库，可以是"read", "write" or "create"的组合，
        组合方式为使用“|”拼起来，如 "read|write|create"
    * version, void, 数据库版本信息。创建数据库时，会将version记录为数据库属性；
        打开时会返回所打开数据库的版本信息。版本信息内容的解释由调用者负责。
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*******************************************************************************/
var DbmOption = {
    retentionDuration: 0,
    persistFlag: "none",
    openFlag: "read|write|create",
    version: null
}

if(!window.localStorage)
{
    window.localStorage =
    {
        // 删除所有的本地存储数据
        clear: function()
        {
            Frame.Cookie.clear();
        },

        // 保存一条数据
        setItem: function(sKey, sValue)
        {
            var para = {};
            para[sKey] = sValue;
            Frame.Cookie.set(para, -1);
        },

        // 获取保存的一条数据
        getItem: function(sKey)
        {
            return Frame.Cookie.get(sKey);
        },

        // 删除本地存储的一条数据
        removeItem: function(sKey)
        {
            Frame.Cookie.del(sKey);
        }
    }
}

/*****************************************************************************
@FuncName: private, _Db_Data
@DateCreated: 2011-08-08
@Author: huangdongxiao 02807
@Description:  数据库内部存储结构
{
    db_1: // 数据库名称, 每创建一个数据库就会多一个该对象
    {
        attr:   // 本数据库的属性
        {
            flag:"read|write",
            retentionDuration: 100
        },
        keys: // 本数据库的keys
        {
            key_1:  // 具体的一个key, 调用set时会增加一个key
            {
                attr: // 本key的属性, 包括事件通知数组, 调用regNotify时增加一个, 调用deRegNotify时会删除一个
                {
                    nofifyCb:[pf1, fp2, fp3]
                },
                value:"abc" // key对应的值, 调用set时会改变该值. 该值的类型由各使用者确定, DBM不进行解释和理解
            },
            "cpu": // key 2 ...
            {
                // ...
            }
        }
    },
    db_2:
    {
        // ...
    }
};
@Caution:
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
var _DB_Data = {};

/*****************************************************************************
@FuncName: class, Frame.DBM
@DateCreated: 2011-08-15
@Author: huangdongxiao 02807
@Description: 后台DBM的前台实现，
处理页面中的数据，
可以实现数据的临时保存和永久性保存。
	应用于页面间数据的共享和个性化数据的永久性保存。
    数据共享时只在本次登录期间有效。
@Usage: 
@Caution: 
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
var DBM =
{
    NAME: "frame.dbm",

/*****************************************************************************
@FuncName: private, Frame.DBM.init
@DateCreated: 2011-08-08
@Author: huangdongxiao 02807
@Description:  从PC上装载永久性的数据库。当系统启动时, 需要把永久性保存的数据装载到系统中,做配置恢复的动作.
    该动作由系统初始化时调用，各模块不需要关心。
    <P>DBM会生成一个系统的数据库 -- sys.frame.dbm，用分号把各永久性保存的数据库名称拼成一个字符串保存在该数据库中，
    登录后会先load系统数据库，然后遍历找到页面中保存的数据库并一一加载。
@Usage:
Frame.DBM.init();
@ParaIn:None
@Return: None
@Caution:暂未实现。数据的恢复现在由各模块在模块初始化时单独恢复。
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
    init: function()
    {
        var sSysDbm = window.localStorage.getItem("sys."+this.NAME);
        if(!sSysDbm)
        {
            // 没有永久性保存的数据
            return;
        }

        var aCfg = sSysDbm.split(';');
        for(var i=0; i<aCfg.length; i++)
        {
            this.load(aCfg[i]);
        }
    },
    
/*****************************************************************************
@FuncName: public, Frame.DBM.load
@DateCreated: 2011-08-08
@Author: huangdongxiao 02807
@Description:  从PC上装载一个永久性的数据库。由各模块在初始化时调用。
    <p>当某一模块需要永久性保存数据时可以使用persistFlag=cfg的方式打开DBM, 操作完毕后必须调用close关闭. 
    在关闭时会把永久性的数据保存到PC上. 同时也会在系统内存中保留一份以便在后面的操作中继续使用. 在下次登录时,
    系统在初始化中会调用本接口把PC上的永久保存的数据装载到系统中, 各模块就可以继续使用了.
    <p>单个数据库保存的格式为: 数据长度+key+"="+value。如要保存key=name, value=syslog的一个值时，先计算syslog的长度为6，
    按照前面的格式, 最终字符串为: 6name=syslog。如果有多个时连续向后面拼起来即可， 如下面的字符串包含三个数据，分别是
    name, pagesize和info。在JS中一个汉字的长度是1：
    <div class=code>“6name=syslog2pagesize=3030info=this is a local info, 也可以有中文描述”</div>
@Usage:
Frame.DBM.load("Frame.MList");
@ParaIn:
    * sDbName, string, 数据名称
@Return: 数据库句柄。失败时返回null，否则返回有效的句柄。
@Caution:
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
    load: function(sDbName)
    {
        var sCfg = window.localStorage.getItem("dbm."+sDbName);
        if(sCfg)
        {
            // sCfg = "6name=syslog2pagesize=30"
            var hDb = this.open(sDbName, {openFlag: "create|write"});
            while(sCfg.length>0)
            {
                var nLen = parseInt(sCfg); // 6, length of "syslog"
                var n1 = (nLen+"").length; // 1, length of nLen
                var nEqStart = sCfg.indexOf('=');   // 5, start from '='
                var nValStart = nEqStart + 1;       // 6, start from "syslog"
                var key = sCfg.substring(n1, nEqStart); // "name"
                var val = sCfg.substring(nValStart, nValStart+nLen); // "syslog"

                this.set(hDb, key, val);
                
                sCfg = sCfg.substring(nValStart+nLen);
            }
            this.close(hDb);
        }
    },

/*****************************************************************************
@FuncName: public, Frame.DBM.open
@DateCreated: 2011-08-08
@Author: huangdongxiao 02807
@Description:  创建一个数据库。数据库名称必须唯一，不能和其它模块重复，建议使用模块名。
@Usage:
    ////////////////////////////////////////////////////////////
    // 例1: 创建数据库"system",并保存一个sysname. sysname为"h3c"
    var db = Frame.DBM.open("system", {openFlag: "create|write"});
    Frame.DBM.set(db, "sysname", "h3c");
    Frame.DBM.close("system");

    ////////////////////////////////////////////////////////////
    // 例2: 只读方式打开数据库, 并获取保存的sysname
    var db = Frame.DBM.open("system", {openFlag: "read"});
    var sName = Frame.DBM.get(db, "sysname");
    Frame.DBM.close("system");

    ////////////////////////////////////////////////////////////
    // 例3: 删除system数据库
    Frame.DBM.open("system", opt);
@ParaIn:
    * sDbName, string, 数据名称. 只能由字符数字、下划线和点组成
    * opt, DbmOption, 创建数据库的选项
@Return: 数据库句柄。失败时返回null，否则返回有效的句柄。
@Caution:<li>数据库名称必须唯一，不能和其它模块重复，建议使用模块名。
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
    open: function(sDbName, opt)
    {
        var hDb = _DB_Data[sDbName];

        // create
        if((undefined == hDb) && isInclude(opt.openFlag, "create") )
        {
            _DB_Data[sDbName] = null;
            _DB_Data[sDbName] =  {name:sDbName, attr:{}, keys:{}};
            hDb = _DB_Data[sDbName];
    
            var nDuration = opt.retentionDuration;
            if(nDuration>0)
            {
                Frame.Timer.create("DBM."+sDbName,function(){_DB_Data[sDbName]=null;}, nDuration*1000);
            }
        }
        
        // open
        if(hDb)
        {
            $.extend(hDb.attr, {
                    bIsRead: isInclude(opt.openFlag, "read"),
                    bIsWrite: isInclude(opt.openFlag, "write")
                }, opt);
        }

        return hDb;
    },

/*****************************************************************************
@FuncName: public, Frame.DBM.close
@DateCreated: 2011-08-08
@Author: huangdongxiao 02807
@Description:  关闭数据库。
<UL>
    <li>业务模块调用此接口关闭DB，并释放相关的资源；
    <li>DBM服务进程中保存的DB数据会继续存在，除非<br>
        1）某个进程调用DBM_Delete删除DB<br>
        2）如果设置了retentionDuration，无任何进程打开的DB在retention duration到期后自动删除。
</UL>
@Usage:
    Frame.DBM.close(sDbName, false);
@ParaIn:
    * db, string/object, 数据库名称,或者数据库句柄
    * flush, boolean, 关闭时是否保存永久性的数据。永久性的数据在执行set时只是保存到缓冲区中，
        当关闭时才会根据情况刷一下缓冲区。默认值为true
@Return: boolean, 如果没有保存成功时返回false，否则返回true
@Caution:
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
    close: function(db, bFlush/*=true*/)
    {
        var hDb = ("string"==typeof(db)) ? _DB_Data[db] : db;
        
        if((hDb.attr.persistFlag == "cfg") && (true===bFlush))
        {
            var sCfgValue = "";
            // save to local
            for(var key in hDb.keys)
            {
                var sValue = hDb.keys[key].value;
                if(null !== sValue)
                {
                    sValue = sValue+"";
                    sCfgValue += sValue.length + key+"="+sValue;  // 值的长度+key+"="+value
                }
            }

            var sDbName = "dbm."+hDb.name;
            if("" == sCfgValue)
            {
                window.localStorage.removeItem (sDbName);
            }
            else
            {
                window.localStorage.setItem(sDbName, sCfgValue);
            }
        }
    },

/*****************************************************************************
@FuncName: public, Frame.DBM.del
@DateCreated: 2011-08-08
@Author: huangdongxiao 02807
@Description:  删除数据库。删除完成后，不能再对该数据库做任何操作。
@Usage:
    Frame.DBM.del(sDbName);
@ParaIn:
    * sDbName, String/Object,  Open时指定的数据名称或者已经打开的数据库句柄
    * sKey, String, 需要删除的字段名称，如果不指定则删除整个数据库.
@Return: boolean, 成功时返回true，否则返回false
@Caution:
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
    del: function(db, sKey)
    {
        var hDb = ("string"==typeof(db)) ? _DB_Data[db] : db;
        var sDbName = hDb.name;

        var bDelDb = (undefined == sKey);
        if(bDelDb)
        {
            // 没有指定具体的字段，删除整个数据库
            //delete _DB_Data[sDbName];
            _DB_Data[sDbName] = null;
        }
        else
        {
            // 指定了具体的字段，只删除该字段
            //delete _DB_Data[sDbName].keys[sKey];
            _DB_Data[sDbName].keys[sKey] = null;
        }

        return true;
    },

/*****************************************************************************
@FuncName: public, Frame.DBM.set
@DateCreated: 2011-08-09
@Author: huangdongxiao 02807
@Description:  向数据库中保存一个键值。如果指定的key已存在，则做覆盖操作；
    如果不存在则做添加操作。如果值为null，则做删除操作。
@Usage:
    // 保存一个字符串
    Frame.DBM.set(hDb, "interface", "Ethernet 1/0/1");

    // 保存一个对象
    var MyObj =
    {
        NAME: "MyObj 1.1";
        toString: function()
        {
            return this.NAME;
        }
    }
    Frame.DBM.set(hDb, "obj", MyObj);

    // 保存一个数组
    var aData = [1,3,5,6,9];
    Frame.DBM.set(hDb, "arr", aData);
@ParaIn:
    * hDb, HANDLE, 数据库句柄，即打开数据库时的返回值
    * sKey, string, 需要保存的键值名称. 只能由字符数字和下划线组成
    * value, void, 需要保存的值，可以是不同的类型，包括字符串、数字、数组、对象等，如果需要做永久性保存，
        且类型不是简单类型，则需要有toString方法。因为在最终保存时只能以字符串进行保存。
        <p>对永久保存的数据在下次登录web网管后可以继续使用，但数据类型是非简单类型的需要模块做格式转换。
@Return: boolean, 成功时返回true, 否则返回false
@Caution:
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
    set: function (hDb, sKey, value)
    {
        if(!hDb.attr.bIsWrite)
        {
            return false;
        }

        hDb.keys[sKey] = hDb.keys[sKey] || {};

        if(hDb.keys[sKey].value != value)
        {
            // 值有变化, 通知关心的模块
            var notifys = hDb.keys[sKey].notify || [];
            for(var i=0; i<notifys.length; i++)
            {
                notifys[i](value);
            }

            // 更新DBM中的保存的值
            hDb.keys[sKey].value = value;
        }
        return true;
    },

/*****************************************************************************
@FuncName: public, Frame.DBM.get
@DateCreated: 2011-08-09
@Author: huangdongxiao 02807
@Description:  获取数据库中保存的键值。
@Usage:
    var hDb = Frame.DBM.open("mydb");
    Frame.DBM.set(hDb, "interface", "Ethernet 1/0/1");
    Frame.DBM.get(hDb, "interface", "none"); // return "Ethernet 1/0/1"
    Frame.DBM.get(hDb, "int", "none"); // return "none"
    Frame.DBM.get(hDb, "int"); // return false
@ParaIn:
    * hDb, HANDLE, 数据库句柄，即打开数据库时的返回值
    * sKey, string, 键值名称
    * def, void, get失败时返回的默认值。如果没有没有该参数，则在失败时返回false
@Return: void, 成功时返回sKey对应的数据, 否则返回def或者false
@Caution:
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
    get: function (hDb, sKey, def)
    {
        var value;

        if(!hDb.attr.bIsRead)
        {
            return false;
        }
        
        (hDb.keys[sKey]) && (value =  hDb.keys[sKey].value);
        if(undefined === value)
        {
            value = def;
        }
        return  value;
    },

/*****************************************************************************
@FuncName: public, Frame.DBM.regNotify
@DateCreated: 2011-08-09
@Author: huangdongxiao 02807
@Description:  向数据库中保存一个键值。如果指定的key已存在，则做覆盖操作，如果不存在则做添加操作。
@Usage:
    // 模块A注册一个sysname改变时的通知处理
    Frame.DBM.regNotify("system", "sysname", function(sName){return true;});

    // 模块B注册一个sysname改变时的通知处理，该处理不会覆盖A的处理
    Frame.DBM.regNotify("system", "sysname", function(sName){return true;});
@ParaIn:
    * hDb, HANDLE, 数据库句柄，即打开数据库时的返回值
    * sKey, string, 需要保存的键值名称
    * notifyCB, Function, 事件通知回调函数。格式为 function notifyCB(dataChanged)。
        各模块可以使用回调函数中的参数做自己的操作，暂不提供改变前的数据。
        数据的类型和格式由各模块自己解释，DBM模块不去理解该数据。
        函数需要返回true，在出现严重错误时返回false，此时将会停止后面的通知
@Return: boolean, 成功时返回true, 否则返回false
@Caution:
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
    regNotify: function (hDb, sKey, notifyCB)
    {
        hDb.keys[sKey] = $.extern({notify:[]},hDb.keys[sKey]);
        
        hDb.keys[sKey].notify.push(notifyCB);
    },

/*****************************************************************************
@FuncName: public, Frame.DBM.deRegNotify
@DateCreated: 2011-08-09
@Author: huangdongxiao 02807
@Description:  取消一个数据改变通知的注册
@Usage:
    // 模块A注册一个sysname改变时的通知处理
    Frame.DBM.regNotify("system", "sysname", function(sName){return true;});

    // 取消模块A注册注册的sysname改变时的通知处理
    Frame.DBM.deRegNotify("system", "sysname", function(sName){return true;});
@ParaIn:
    * hDb, HANDLE, 数据库句柄，即打开数据库时的返回值
    * sKey, string, 需要保存的键值名称
    * notifyCB, Function, 事件通知回调函数。
@Return: boolean, 成功时返回true, 否则返回false
@Caution:
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
    deRegNotify: function (hDb, sKey, notifyCB)
    {
        if(hDb.keys[sKey] && hDb.keys[sKey].notify)
        {
            hDb.keys[sKey].notify = $grep(hDb.keys[sKey].notify, function(item){return item!=notifyCB});
        }
    }

} //// end of Plot
$F.DBM = DBM;

})(Frame);

