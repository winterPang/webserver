/*******************************************************************************
 Copyright (c) 2007, Hangzhou H3C Technologies Co., Ltd. All rights reserved.
--------------------------------------------------------------------------------
@FileName:libs/frame/debugger.js
@ProjectCode: Comware v7
@ModuleName: Frame.Debuger
@DateCreated: 2011-06-24
@Author: huangdongxiao 02807
@Description: 
    ����ҳ��ĵ�����Ϣ�ӿ�, ��װ��������Ĳ�ͬ. ʹҳ���з���Ĵ�ӡ������Ϣ
@Modification:
*******************************************************************************/

;(function($F)
{


if(!window.console)
{
    var _oConsole = null;
    function _createConsole()
    {
        if(_oConsole) return true;
        
        var sConId = "_frame_console";
        //_oConsole = window.open();        //$("#_console_msg");
        return false;
    }
    window.console = {
        log: function(sMsg)
        {
            if(!_createConsole()) return;

            _oConsole.document.write("<div>"+sMsg+"</div>");
        },
        warn:function(sMsg)
        {
            if(!_createConsole()) return;
            
            _oConsole.document.write("<div style='color:blue'>"+sMsg+"</div>");
        },
        error:function(sMsg)
        {
            if(!_createConsole()) return;
            
            _oConsole.document.write("<div style='color:red'>"+sMsg+"</div>");
        } 
    }
}

function checkLevel(sType)
{
    var level = Debuger.level;
    if("none" == level) return false;

    if("all" == level)
    {
        level = "log|warn|error";
    }
    var aLevel = level.split("|");
    for(var i=0; i<aLevel.length; i++)
    {
        if(sType == aLevel[i])
        {
            return true;
        }
    }

    return false;
}

function _showLog(sType, sMsg)
{
    if(false === checkLevel(sType))
    {
        return false;
    }

    var filter = Debuger.filter;
    if(true === filter) return false;

    if(false === filter)
    {
        window.console[sType](sType + ": " + sMsg);
        return;
    }

    var aFilter = filter.split('|');
    for(var i=0; i<aFilter.length; i++)
    {
        if(sMsg.indexOf(aFilter[i]) != -1)
        {
            window.console[sType](sType + ": " + sMsg);
            break;
        }
    }
}

var Debuger = {
    filter: false,   // false-show all msg; true-show none msg, or a group filter string seperate by "|"
    level: "warn|error",  // "none"-no debug msg; "all"-all the debug msg; or one or more of the "log|warn|error"

/*****************************************************************************
@FuncName: public,Frame.Debuger.info
@DateCreated: 2011-06-24
@Author: huangdongxiao 02807
@Description: ��ʾ������Ϣ
@Usage: Frame.Debuger.info("start make xml string");
@ParaIn: 
    * sMsg - string, ������Ϣ�ַ�����
@Return: ��
@Caution: 
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
	info: function(sMsg)
	{
        _showLog("log", sMsg);
	},

/*****************************************************************************
@FuncName: public,Frame.Debuger.warning
@DateCreated: 2011-06-24
@Author: huangdongxiao 02807
@Description: ��ʾ�澯��Ϣ
@Usage: Frame.Debuger.warning("The flash usage is more then 60%");
@ParaIn: 
    * sMsg - string, ������Ϣ�ַ�����
@Return: ��
@Caution: 
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
	warning: function(sMsg)
	{
        _showLog("warn", sMsg);
	},

/*****************************************************************************
@FuncName: public,Frame.Debuger.error
@DateCreated: 2011-06-24
@Author: huangdongxiao 02807
@Description: ���������Ϣ, �����̽������ش����֧ʱӦ�����һ��������Ϣ
@Usage: Frame.Debuger.error("The flash usage is more then 95%");
@ParaIn: 
    * sMsg - string, ������Ϣ�ַ�����
@Return: ��
@Caution: 
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
	error: function(sMsg)
	{
        _showLog("error", sMsg);
	},

/*****************************************************************************
@FuncName: public,Frame.Debuger.assert
@DateCreated: 2011-06-24
@Author: huangdongxiao 02807
@Description: ������Ϣ���. assert���ܵ��Կ��ص�Ӱ��. �����Ϣ�н�������Ψһ�Եı�ʾ��, ���㶨λ����
@Usage: 
var a = 1;
var b = 2;
var c = a + b;
Frame.Debuger.assert(c!=3, "start make xml string");
@ParaIn: 
    * bExp - boolean, ������Ϣ����Ŀ���, ������������ʱ��������sMsg��
    * sMsg - string, ������Ϣ�ַ�����
@Return: ��
@Caution: 
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
	assert: function(bExp, sMsg)
	{
		if(bExp){return;}

		if(undefined === sMsg)
		{
			sMsg = "Check your code, please";
		}

		window.console.error("ASSERT: "+sMsg);
	},

    dumpArray: function(aObjArr)
    {
        var jDiv = $("#_dump_obj");
        if (!aObjArr || aObjArr.length == 0)
        {
            jDiv.remove ();
            return ;
        }

        var aTh = [], aHtml=[];
        var obj = aObjArr[0];

        aHtml = ["<table width=100% border=1>"];
        aHtml.push ("<tr>")
        for (var key in obj)
        {
            aTh.push (key);
            aHtml.push ("<th>"+key+"</th>");
        }
        aHtml.push ("</tr>")

        for (var i=0; i<aObjArr.length; i++)
        {
            obj = aObjArr[i];
            aHtml.push ("<tr>")
            for(var k=0; k<aTh.length; k++)
            {
                aHtml.push ("<td>" + obj[aTh[k]] + "</td>");
            }
            aHtml.push ("</tr>")
        }

        aHtml.push ("</table>");

        if (jDiv.length == 0)
        {
            jDiv = $("<div id=_dump_obj style='position:fixed;left:20px;right:20px;top:20px;background-color:#008;z-index:999;'></div>").appendTo("body");
        }
        jDiv.html (aHtml.join(''));
    }
} //// end of Debuger
$F.Debuger = Debuger;


})(Frame);
