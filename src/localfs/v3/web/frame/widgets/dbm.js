/*******************************************************************************
 Copyright (c) 2011, Hangzhou H3C Technologies Co., Ltd. All rights reserved.
--------------------------------------------------------------------------------
@FileName:libs/frame/dbm.js
@ProjectCode: Comware v7
@ModuleName: Frame.DBM
@DateCreated: 2011-08-09
@Author: huangdongxiao 02807
@Description:
    �������ݴ洢����װ�������ݵĴ洢����������֧��HTML5��ʹ��HTML5�����ݴ洢���ܣ�
    �����֧����ʹ��cookie���棬��ʱ�����ô洢����������󳤶ȵ����ơ�
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
@Description: DBM������������
@fields:
    * retentionDuration, integer, �ϻ�ʱ�䣬����Ϊ��λ��0��ʾ��Զ���ϻ�����Ĭ��ֵΪ0
    * persistFlag, string, �־û���־��ȡֵΪ"none" or "cfg"��Ĭ��ֵΪ"none".
    * openFlag, string, �Ժ��ַ�ʽ�����ݿ⣬������"read", "write" or "create"����ϣ�
        ��Ϸ�ʽΪʹ�á�|��ƴ�������� "read|write|create"
    * version, void, ���ݿ�汾��Ϣ���������ݿ�ʱ���Ὣversion��¼Ϊ���ݿ����ԣ�
        ��ʱ�᷵���������ݿ�İ汾��Ϣ���汾��Ϣ���ݵĽ����ɵ����߸���
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
        // ɾ�����еı��ش洢����
        clear: function()
        {
            Frame.Cookie.clear();
        },

        // ����һ������
        setItem: function(sKey, sValue)
        {
            var para = {};
            para[sKey] = sValue;
            Frame.Cookie.set(para, -1);
        },

        // ��ȡ�����һ������
        getItem: function(sKey)
        {
            return Frame.Cookie.get(sKey);
        },

        // ɾ�����ش洢��һ������
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
@Description:  ���ݿ��ڲ��洢�ṹ
{
    db_1: // ���ݿ�����, ÿ����һ�����ݿ�ͻ��һ���ö���
    {
        attr:   // �����ݿ������
        {
            flag:"read|write",
            retentionDuration: 100
        },
        keys: // �����ݿ��keys
        {
            key_1:  // �����һ��key, ����setʱ������һ��key
            {
                attr: // ��key������, �����¼�֪ͨ����, ����regNotifyʱ����һ��, ����deRegNotifyʱ��ɾ��һ��
                {
                    nofifyCb:[pf1, fp2, fp3]
                },
                value:"abc" // key��Ӧ��ֵ, ����setʱ��ı��ֵ. ��ֵ�������ɸ�ʹ����ȷ��, DBM�����н��ͺ����
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
@Description: ��̨DBM��ǰ̨ʵ�֣�
����ҳ���е����ݣ�
����ʵ�����ݵ���ʱ����������Ա��档
	Ӧ����ҳ������ݵĹ���͸��Ի����ݵ������Ա��档
    ���ݹ���ʱֻ�ڱ��ε�¼�ڼ���Ч��
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
@Description:  ��PC��װ�������Ե����ݿ⡣��ϵͳ����ʱ, ��Ҫ�������Ա��������װ�ص�ϵͳ��,�����ûָ��Ķ���.
    �ö�����ϵͳ��ʼ��ʱ���ã���ģ�鲻��Ҫ���ġ�
    <P>DBM������һ��ϵͳ�����ݿ� -- sys.frame.dbm���÷ֺŰѸ������Ա�������ݿ�����ƴ��һ���ַ��������ڸ����ݿ��У�
    ��¼�����loadϵͳ���ݿ⣬Ȼ������ҵ�ҳ���б�������ݿⲢһһ���ء�
@Usage:
Frame.DBM.init();
@ParaIn:None
@Return: None
@Caution:��δʵ�֡����ݵĻָ������ɸ�ģ����ģ���ʼ��ʱ�����ָ���
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
    init: function()
    {
        var sSysDbm = window.localStorage.getItem("sys."+this.NAME);
        if(!sSysDbm)
        {
            // û�������Ա��������
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
@Description:  ��PC��װ��һ�������Ե����ݿ⡣�ɸ�ģ���ڳ�ʼ��ʱ���á�
    <p>��ĳһģ����Ҫ�����Ա�������ʱ����ʹ��persistFlag=cfg�ķ�ʽ��DBM, ������Ϻ�������close�ر�. 
    �ڹر�ʱ��������Ե����ݱ��浽PC��. ͬʱҲ����ϵͳ�ڴ��б���һ���Ա��ں���Ĳ����м���ʹ��. ���´ε�¼ʱ,
    ϵͳ�ڳ�ʼ���л���ñ��ӿڰ�PC�ϵ����ñ��������װ�ص�ϵͳ��, ��ģ��Ϳ��Լ���ʹ����.
    <p>�������ݿⱣ��ĸ�ʽΪ: ���ݳ���+key+"="+value����Ҫ����key=name, value=syslog��һ��ֵʱ���ȼ���syslog�ĳ���Ϊ6��
    ����ǰ��ĸ�ʽ, �����ַ���Ϊ: 6name=syslog������ж��ʱ���������ƴ�������ɣ� ��������ַ��������������ݣ��ֱ���
    name, pagesize��info����JS��һ�����ֵĳ�����1��
    <div class=code>��6name=syslog2pagesize=3030info=this is a local info, Ҳ����������������</div>
@Usage:
Frame.DBM.load("Frame.MList");
@ParaIn:
    * sDbName, string, ��������
@Return: ���ݿ�����ʧ��ʱ����null�����򷵻���Ч�ľ����
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
@Description:  ����һ�����ݿ⡣���ݿ����Ʊ���Ψһ�����ܺ�����ģ���ظ�������ʹ��ģ������
@Usage:
    ////////////////////////////////////////////////////////////
    // ��1: �������ݿ�"system",������һ��sysname. sysnameΪ"h3c"
    var db = Frame.DBM.open("system", {openFlag: "create|write"});
    Frame.DBM.set(db, "sysname", "h3c");
    Frame.DBM.close("system");

    ////////////////////////////////////////////////////////////
    // ��2: ֻ����ʽ�����ݿ�, ����ȡ�����sysname
    var db = Frame.DBM.open("system", {openFlag: "read"});
    var sName = Frame.DBM.get(db, "sysname");
    Frame.DBM.close("system");

    ////////////////////////////////////////////////////////////
    // ��3: ɾ��system���ݿ�
    Frame.DBM.open("system", opt);
@ParaIn:
    * sDbName, string, ��������. ֻ�����ַ����֡��»��ߺ͵����
    * opt, DbmOption, �������ݿ��ѡ��
@Return: ���ݿ�����ʧ��ʱ����null�����򷵻���Ч�ľ����
@Caution:<li>���ݿ����Ʊ���Ψһ�����ܺ�����ģ���ظ�������ʹ��ģ������
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
@Description:  �ر����ݿ⡣
<UL>
    <li>ҵ��ģ����ô˽ӿڹر�DB�����ͷ���ص���Դ��
    <li>DBM��������б����DB���ݻ�������ڣ�����<br>
        1��ĳ�����̵���DBM_Deleteɾ��DB<br>
        2�����������retentionDuration�����κν��̴򿪵�DB��retention duration���ں��Զ�ɾ����
</UL>
@Usage:
    Frame.DBM.close(sDbName, false);
@ParaIn:
    * db, string/object, ���ݿ�����,�������ݿ���
    * flush, boolean, �ر�ʱ�Ƿ񱣴������Ե����ݡ������Ե�������ִ��setʱֻ�Ǳ��浽�������У�
        ���ر�ʱ�Ż�������ˢһ�»�������Ĭ��ֵΪtrue
@Return: boolean, ���û�б���ɹ�ʱ����false�����򷵻�true
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
                    sCfgValue += sValue.length + key+"="+sValue;  // ֵ�ĳ���+key+"="+value
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
@Description:  ɾ�����ݿ⡣ɾ����ɺ󣬲����ٶԸ����ݿ����κβ�����
@Usage:
    Frame.DBM.del(sDbName);
@ParaIn:
    * sDbName, String/Object,  Openʱָ�����������ƻ����Ѿ��򿪵����ݿ���
    * sKey, String, ��Ҫɾ�����ֶ����ƣ������ָ����ɾ���������ݿ�.
@Return: boolean, �ɹ�ʱ����true�����򷵻�false
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
            // û��ָ��������ֶΣ�ɾ���������ݿ�
            //delete _DB_Data[sDbName];
            _DB_Data[sDbName] = null;
        }
        else
        {
            // ָ���˾�����ֶΣ�ֻɾ�����ֶ�
            //delete _DB_Data[sDbName].keys[sKey];
            _DB_Data[sDbName].keys[sKey] = null;
        }

        return true;
    },

/*****************************************************************************
@FuncName: public, Frame.DBM.set
@DateCreated: 2011-08-09
@Author: huangdongxiao 02807
@Description:  �����ݿ��б���һ����ֵ�����ָ����key�Ѵ��ڣ��������ǲ�����
    ���������������Ӳ��������ֵΪnull������ɾ��������
@Usage:
    // ����һ���ַ���
    Frame.DBM.set(hDb, "interface", "Ethernet 1/0/1");

    // ����һ������
    var MyObj =
    {
        NAME: "MyObj 1.1";
        toString: function()
        {
            return this.NAME;
        }
    }
    Frame.DBM.set(hDb, "obj", MyObj);

    // ����һ������
    var aData = [1,3,5,6,9];
    Frame.DBM.set(hDb, "arr", aData);
@ParaIn:
    * hDb, HANDLE, ���ݿ������������ݿ�ʱ�ķ���ֵ
    * sKey, string, ��Ҫ����ļ�ֵ����. ֻ�����ַ����ֺ��»������
    * value, void, ��Ҫ�����ֵ�������ǲ�ͬ�����ͣ������ַ��������֡����顢����ȣ������Ҫ�������Ա��棬
        �����Ͳ��Ǽ����ͣ�����Ҫ��toString��������Ϊ�����ձ���ʱֻ�����ַ������б��档
        <p>�����ñ�����������´ε�¼web���ܺ���Լ���ʹ�ã������������ǷǼ����͵���Ҫģ������ʽת����
@Return: boolean, �ɹ�ʱ����true, ���򷵻�false
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
            // ֵ�б仯, ֪ͨ���ĵ�ģ��
            var notifys = hDb.keys[sKey].notify || [];
            for(var i=0; i<notifys.length; i++)
            {
                notifys[i](value);
            }

            // ����DBM�еı����ֵ
            hDb.keys[sKey].value = value;
        }
        return true;
    },

/*****************************************************************************
@FuncName: public, Frame.DBM.get
@DateCreated: 2011-08-09
@Author: huangdongxiao 02807
@Description:  ��ȡ���ݿ��б���ļ�ֵ��
@Usage:
    var hDb = Frame.DBM.open("mydb");
    Frame.DBM.set(hDb, "interface", "Ethernet 1/0/1");
    Frame.DBM.get(hDb, "interface", "none"); // return "Ethernet 1/0/1"
    Frame.DBM.get(hDb, "int", "none"); // return "none"
    Frame.DBM.get(hDb, "int"); // return false
@ParaIn:
    * hDb, HANDLE, ���ݿ������������ݿ�ʱ�ķ���ֵ
    * sKey, string, ��ֵ����
    * def, void, getʧ��ʱ���ص�Ĭ��ֵ�����û��û�иò���������ʧ��ʱ����false
@Return: void, �ɹ�ʱ����sKey��Ӧ������, ���򷵻�def����false
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
@Description:  �����ݿ��б���һ����ֵ�����ָ����key�Ѵ��ڣ��������ǲ��������������������Ӳ�����
@Usage:
    // ģ��Aע��һ��sysname�ı�ʱ��֪ͨ����
    Frame.DBM.regNotify("system", "sysname", function(sName){return true;});

    // ģ��Bע��һ��sysname�ı�ʱ��֪ͨ�����ô����Ḳ��A�Ĵ���
    Frame.DBM.regNotify("system", "sysname", function(sName){return true;});
@ParaIn:
    * hDb, HANDLE, ���ݿ������������ݿ�ʱ�ķ���ֵ
    * sKey, string, ��Ҫ����ļ�ֵ����
    * notifyCB, Function, �¼�֪ͨ�ص���������ʽΪ function notifyCB(dataChanged)��
        ��ģ�����ʹ�ûص������еĲ������Լ��Ĳ������ݲ��ṩ�ı�ǰ�����ݡ�
        ���ݵ����ͺ͸�ʽ�ɸ�ģ���Լ����ͣ�DBMģ�鲻ȥ�������ݡ�
        ������Ҫ����true���ڳ������ش���ʱ����false����ʱ����ֹͣ�����֪ͨ
@Return: boolean, �ɹ�ʱ����true, ���򷵻�false
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
@Description:  ȡ��һ�����ݸı�֪ͨ��ע��
@Usage:
    // ģ��Aע��һ��sysname�ı�ʱ��֪ͨ����
    Frame.DBM.regNotify("system", "sysname", function(sName){return true;});

    // ȡ��ģ��Aע��ע���sysname�ı�ʱ��֪ͨ����
    Frame.DBM.deRegNotify("system", "sysname", function(sName){return true;});
@ParaIn:
    * hDb, HANDLE, ���ݿ������������ݿ�ʱ�ķ���ֵ
    * sKey, string, ��Ҫ����ļ�ֵ����
    * notifyCB, Function, �¼�֪ͨ�ص�������
@Return: boolean, �ɹ�ʱ����true, ���򷵻�false
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

