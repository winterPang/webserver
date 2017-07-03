;(function($)
{
    var UTILNAME = "Base";
    var oBaseTimer = false;

    function indexOf(sKey,arry)
    {
        var n = -1;
        for(var i=0;i<arry.length;i++)
        {
            if(sKey === arry[i])
            {
                n = i;
                break;
            }
        }

        return n;
    }

    /*function addCommaNum(num)
    {
        var doAdd = function(str){

            if(!(typeof(str) === "string" || typeof(str) === "number") || Number(str) != Number(str))
            {
                return str;
            }
            
            str = String(str);
            var len = str.length;
            if(len <= 3)
            {
                return str;
            }

            var r = len%3;
            if(r > 0)
            {
                str = str.slice(0,r) + "," + str.slice(r,len).match(/\d{3}/g).join(",");
            } 
            else
            {
                str = str.slice(r,len).match(/\d{3}/g).join(",");
            }

            return str;
        };

        if($.isPlainObject(num))
        {
            for(key in num)
            {
                num[key] = doAdd(num[key]);
            }

        }
        else
        {
            num = doAdd(num);
        }

        return num;
    }*/

    function addComma(sNum,Stype/*Stype=rate,.memory*/,nStart,nEnd) {
        function doFormat(num,type,start,end){
            if(!(typeof(num) === "string"||typeof(num)==="number")||Number(num)!=Number(num)){
                return num;
            }
            var max,len,remain,unit,fixed;
            var flag = "";
            start=start||0;
            end = typeof end=="undefined"?3:end;
            switch(type){
                case "memory":
                    max = 1000;
                    unit=["B","KB","MB","GB"];
                    break;
                 case "rate":
                    max = 1024;
                    unit=["bps","Kbps","Mbps","Gbps"];
                    break;
                default:
                    max = Infinity;
                    unit=[""];
                    fixed = 0;
                    break;      
            }
            if(num<0)
            {
                num = -num;
                flag = "-"
            }
            while(num >=max &&start < end){
                num = num/max;
                start++;
                fixed =1;
            }
            num = Number(num).toFixed(fixed).split(".");
            if(fixed){
                unit = "."+num[1]+unit[start];
            }else{
                unit = unit[start];
            }
            num = num[0];
            len = num.length;
            if(len<3){
                return flag + num +unit;
            }
            remain = len % 3;
            if(remain > 0){
                num = num.slice(0,remain)+","+num.slice(remain,len).match(/\d{3}/g).join(",");

            }else{
                num = num.slice(remain,len).match(/\d{3}/g).join(",");
            }
             return flag + num +unit;

        };

        if($.isPlainObject(sNum)){
            for(key in sNum){
                 sNum[key] = doFormat(sNum[key],Stype,nStart,nEnd);
            }
        }else{
            sNum = doFormat(sNum,Stype,nStart,nEnd);
        }
        return sNum;
    }

    function loadMenu(sMenu)
    {
        return Frame.NewMenu.loadPage(sMenu);
    }

    function refreshCurPage()
    {
    	// return Frame.NewMenu.refreshPage();
        if($(".modal-scrollable").length)// whether has dlg
        {
            oBaseTimer && clearTimeout(oBaseTimer);
            oBaseTimer = setTimeout(refreshCurPage,500);
        }
        else
        {
            return Frame.NewMenu.refreshPage();
        }
    }

    function getCurMenuId()
    {
        return Frame.NewMenu.getCurMenuId();
    }

    function openRSidePanel(
        sUrl /*"Acl.Add_basicrule"*/, 
        oPara /*the paras of new page*/, 
        pfInit /*ignore if no sUrl*/)
    {
        var oPanel = Frame.getHelpPanel({data: oPara});
        if (sUrl)
        {
            oPanel.open().load(sUrl, pfInit);
        }
        else
        {
            oPanel.open();
        }
        return;
    }

    function closeRSidePanel()
    {
        Frame.getHelpPanel().close();
    }

    function isEmptyObj(oObj)
    {
        var bEmpty = true;
        for (var i in oObj)
        {
            bEmpty = false;
            break;
        }
        return bEmpty;
    }

    function createAttrs(oAttr)
    {
        var aAttr = [];
        oAttr = oAttr||{};
        for(var key in oAttr)
        {
            aAttr.push(key+'="'+oAttr[key]+'"');
        }
        return aAttr.join(" ");
    }
    
    function createHtml(sTagName, sText, oAttr)
    {
        var sAttr = createAttrs(oAttr);
        return Frame.Util.sprintf("<%s %s>%s</%s>", sTagName, sAttr, sText, sTagName);
    }

    function updateHtml(jScope, oData)
    {
        $.each(oData, function (sKey, sValue)
            {
                sKey = sKey.replace(/\./g, "\\.");
                sValue = (null == sValue) ? "" : sValue+"";
                $("#"+sKey, jScope).removeClass("loading-small").html(sValue);
            });
        return;
    }

    function disableLink (bEnable, jLink)
    {
        if (bEnable)
        {
            jLink.removeAttr("state")
                .removeClass ("ui-state-disabled")
                .attr("href", jLink.attr("_href"))
                .removeAttr ("_href");
        }
        else
        {
            jLink.attr("state", "disabled")
                .attr("_href", jLink.attr("href"))
                .removeAttr("href").
                addClass("ui-state-disabled");
        }
    }

/* 
Paras: sPort1/sPort2, Port name, such as Ethet1/0/1, Vlan-interface1, Loopback1, Ethnet1/0/1.2
*/
function  comparePort(sPort1, sPort2)
{
    var getIfType = function (sPort)
    {
        return sPort.replace(/[0-9\/]*/g, "");
    }

    var getIfNumber = function (sPort)
    {
        return sPort.replace(/[a-zA-Z]*/g, "").split('/');
    }

    // 容错处理
    sPort1 = sPort1 || "";
    sPort2 = sPort2 || "";
    if (sPort2 == sPort1)
    {
        return 0;
    }

    var sIftype1 = getIfType(sPort1);
    var sIftype2 = getIfType(sPort2);
    if(sIftype1<sIftype2)
    {
            return -1;
    }
    else if(sIftype1>sIftype2)
    {
            return 1;
    }

    var aIfnumber1 = getIfNumber(sPort1);
    var aIfnumber2 = getIfNumber(sPort2);
    for(var i=0; i<aIfnumber1.length; i++)
    {
        if(aIfnumber1[i]-aIfnumber2[i] != 0)
        {
             return aIfnumber1[i]-aIfnumber2[i];
        }
    }   
    return 0;
}

function save()
{
    openDlg("Config.Save",{},{className:"modal-default"});
}

function encode (a)
{
    var s = a;
    if (a && "string" == typeof(a))
    {
        s = a.replace(/&/g,"&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&#34;").replace(/'/g, "&#39;");
    }
    return s;
}

function dumpObj (obj, sFormat)
{
    var aHtml = [];
    var Maker = {
        "table": 
        {
            start: function ()
            {
                return "<table>";
            },
            append: function (key, value)
            {
                return "<tr><td>" + key + "</td><td>" + value + "</td></tr>";
            },
            end: function ()
            {
                return "</table>";
            }
        },
        "list":
        {
            start: function ()
            {
                return "<ul>";
            },
            append: function (key, value)
            {
                return "<li>" + key + ": " + value + "</li>";
            },
            end: function ()
            {
                return "</ul>";
            }
        }
    };

    var pfMaker = Maker[sFormat] || Maker["table"];

    obj = obj || {};
    aHtml.push (pfMaker.start ());
    for (var key in obj)
    {
        aHtml.push (pfMaker.append (key, obj[key]));
    }
    aHtml.push (pfMaker.end ());

    return aHtml.join ('');
}
/**
sUrl: String, the new page for loading. if it is null, only showing
**/
    function openDlg(sUrl, oPagePara, oDlgPara)
    {
        var jDlg;
        var sDlgId = "dlg_cnt_global";

        oDlgPara = oDlgPara||{};

        if(oDlgPara.scope)
        {
            if ("string" == typeof(oDlgPara.scope))
            {
                sDlgId = oDlgPara.scope;
            }
            else
            {
                jDlg = oDlgPara.scope;
            }
        }

        if (!jDlg)
        {
            var hTimer;
            jDlg = $("#"+sDlgId);
            if(jDlg.length > 0)
            {
               if(jDlg.hasClass('modal-overflow'))
               {
                   jDlg.modal('hide');
               }else
               {
                   hTimer = jDlg.data("timer");
                   clearTimeout(hTimer);
                   jDlg.remove();
               }

            }
            jDlg = $("<div></div>").attr("id", sDlgId).appendTo($("body"));
            jDlg.bind("hide", function (){
                hTimer = setTimeout(function(){jDlg.remove();}, 1500);
                jDlg.data("timer", hTimer);
            });
        }

        var sClass = "modal fade " + (oDlgPara.className || "");
        jDlg.removeClass().addClass(sClass);

        if(sUrl)
        {
            Utils.Pages.loadModule(sUrl, oPagePara , jDlg, function()
            {
                jDlg.modal();
            });
        }
        else
        {
            if (oDlgPara.html)
            {
                jDlg.html (oDlgPara.html);
            }
            jDlg.modal();
        }

        return {close: function(){jDlg.modal("hide");}}
    }

    function getHash(aData, sKey)
    {
        var oHash = {};

        $.each(aData,function(index,oItem)
        {
            var sHashKey = oItem[sKey];
            if (!oHash[sHashKey])
            {
                oHash[sHashKey] = [];
            }

            oHash[sHashKey].push(oItem);
        });

        return oHash;
    }

    function cloneObj(oSrc)
    {
        var oDes = {};
        $.each(oSrc, function (index, oItem) {oDes[index] = oSrc[index];return;});
        return oDes;
    }

/*****************************************************************************
@FuncName: public,Utils.Base.getRcString
@DateCreated: 2011-10-08
@Author: huangdongxiao 02807
@Description: Get resource string, which defined in HTML file. We can't use the STRING in JS file, 
    because the JS file must be compatiable all the language. So, the const STRING must be defined
    in HTML file, and then used in JS file. The rule for defination of STRING is as below:
    <li>The common STRING is defined in public. such as Add, Delete and so on
    <li>The personal STRING, such as "The user name must be started with character"
    <p>The STRING is as a property defined in a DIV element, and the DIV must have a class "rc-define", 
    and the DIV must have a "id" property, it named MODULE+"_"+FUNCTION+"_rc"
@Usage:
// HTML
<div id="syslog_summary_rc" class="rc-define"
    my_note1="This is note 1 string"
    my_note2="This is note 2 string"
    confirm="Confirm to shutdown all the interface?"
    ></div>

// JS
var sMyNote1 = Frame.Util.getRcString("syslog_summary_rc", "my_note1");
var sConfirm = Frame.Util.getRcString("syslog_summary_rc", "confirm");

// You can write a function for reduce the code in a JS file
function getRcText(sRcName)
{
    return Frame.Util.getRcString("syslog_summary_rc", sRcName);
}

// Submit
function _onSubmit()
{
    if("" == $("#user_name").val())
    {
        Frame.Msg.alert(getRcText("my_note1"));
        return false;
    }
}
@ParaIn:
    * sRcId, string, The "id" property of DIV
    * sRcName, string, The resource id.
@Return: String
    <li>The string, if the resource id is exist
    <li>else, return empty string("")
@Caution:
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
function getRcString(sRcId, sRcName)
{
    return $("#"+sRcId).attr(sRcName) || "";
}

function toText(sHtml)
{
    return sHtml.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/[\t\r\n]/g," ").replace(/  /g,"&nbsp; ");
}

function showError(msg, jScope)
{
    var sErrMsg = ($.isArray(msg)) ? msg.join("") : msg;
    var jPage = jScope ? jScope.closest(".page") : jScope;
    jPage = jPage || [];
    var jError = $(".form-actions:visible", jPage);
    if (("" != sErrMsg) && (Utils.Msg) && (Utils.Msg.error) )
    {
    	Utils.Msg.error(sErrMsg);       
    }
    else if ((jError.length > 0))
    {
        $(".error-info", jError).remove();
        if ("" != sErrMsg)
        {
            $("<div class='error-info error'></div>")
                .html (sErrMsg)
                .prependTo (jError)
                .show ();
        }
    }
}

function getCheckGrpVal(sGroupName, jScope)
{
    return $(":radio[name='"+sGroupName+"'][checked]", jScope).val();
}

function redirect(oParas, sUrl/*=null*/)
{
    // if no sUrl, goto current page
    if(oParas)
    {
        Utils.Base.activeTab = oParas.sTab;
        delete  oParas.sTab;
    }
    window.location = Utils.Base.createUrl(oParas, sUrl);
}

function isObjEqual(obj1, obj2, aIndex)
{
    var nIndexCount = aIndex.length;

    if(obj1 == obj2) return "eq";
    if(typeof(obj1) != typeof(obj2)) return "neq";
    if(!$.isPlainObject(obj1)) return "neq";

    // check index
    for(var i=0; i<nIndexCount; i++)
    {
        if(obj1[aIndex[i]] != obj2[aIndex[i]])
        {
            return "neq";
        }
    }

    // check all fields
    for(var key in obj2)
    {
        // ignore the private attributes
        if('_' == key[0])
        {
            continue;
        }

        if(obj1[key] !== obj2[key])
        {
            return (nIndexCount>0) ? "mdf" : "neq";
        }
    }

    return "eq";
}
function getChanged(aData1, aData2, aIndex)
{
    var aAdded=[], aRemoved=[], aModified=[];
    var aFlag2 = [];
    var found;
    var i, j, ii, jj;

    aData1 = aData1 || [];
    aData2 = aData2 || [];
    aIndex = aIndex||[];

    ii=aData1.length, jj=aData2.length;

    for(i=0; i<ii; i++)
    {
        found = "neq";
        for(j=0; j<jj; j++)
        {
            if(!aFlag2[j])
            {
                found = isObjEqual(aData1[i], aData2[j], aIndex);
                if("neq" != found)
                {
                    aFlag2[j] = found;
                    break;
                }
            }
        }
        if("neq" === found)
        {
            aRemoved.push(aData1[i]);
        }
    }

    for(var j=0,jj=aData2.length; j<jj; j++)
    {
        if("mdf" == aFlag2[j])
        {
            aModified.push(aData2[j]);
        }
        else if(!aFlag2[j])
        {
            aAdded.push(aData2[j]);
        }
    }

    return {added: aAdded, removed: aRemoved, modified: aModified};
}

function resetForm(oForm)
{
    $("input[type=text],input[type=password],select",oForm).each(function() {
        $(this).val("");
        Utils.Widget.setError($(this),"");
    });
}
var MyUrl = 
{
    _spchar: ['&',   '@',  '[',   ']',   '<',   '>',  '"',   ' ',   '=',   'C'  ],
    _newstr: ["Cam", "Ca", "Cfl", "Cfr", "Cjl", "Cr", "Cqu", "Csp", "Ceq", "Ccc"],
    escape: function (str)
    {
        if (typeof (str) == "number")
        {
            return str;
        }

        var aPattern =MyUrl._spchar;
        var aSwitch = MyUrl._newstr;
        for(var i=aPattern.length-1; i>=0; i--)
        {
            var sPattern = aPattern[i].replace('[', "\\[").replace(']', "\\]");
            var reg = new RegExp(sPattern, "g");
            str = str.replace(reg, aSwitch[i]);
        }
        return str;
    }
    ,unescape: function(val)
    {
        var aPattern =MyUrl._newstr;
        var aSwitch = MyUrl._spchar;
        for(var i=0; i<aPattern.length; i++)
        {
            var reg = new RegExp(aPattern[i], "g");
            val = val.replace(reg, aSwitch[i]);
        }
        return val;
    }
    ,create: function (oParas, sPageId)
    {
        var sSearch, aParas = [];

        oParas = oParas||{};
        for(var key in oParas)
        {
            if (undefined !== oParas[key])
            {
                aParas.push(key + "=" + MyUrl.escape(oParas[key]));
            }
        }

        sPageId = sPageId || Frame.NewMenu.getCurMenuId();
        sSearch = (aParas.length > 0) ? ("?"+aParas.join('&')) : "";
        return "#" + sPageId + sSearch;
    }
    ,parse: function (sParas)
    {
        var oParas = {};

        if (!sParas)
        {
            sParas = window.location.hash;
        }

        if (sParas.charAt(0) == '#')
        {
            sParas = sParas.substring(1);
        }

        var aTemp = sParas.split("?");
        if(1 == aTemp.length)
        {
            sParas = aTemp [0];
            if (-1 == sParas.indexOf('='))
            {
                return oParas;
            }
        }
        else
        {
            // remove the first char "?"
            sParas = aTemp[1];
        }

        var aPara = sParas.split('&');
        for(var i=0; i<aPara.length; i++)
        {
            var aTemp = aPara[i].split('=');
            var sKey = aTemp[0];
            var sVal = aTemp[1];
            oParas[sKey] = MyUrl.unescape(sVal);
        }

        return oParas;
    }
}

var oBase = {
    activeTab : false,
	loadMenu : loadMenu,
	refreshCurPage : refreshCurPage,
    getCurMenuId : getCurMenuId,
    openRSidePanel : openRSidePanel,
    closeRSidePanel: closeRSidePanel,
    getCheckGrpVal: getCheckGrpVal,
    isEmptyObj : isEmptyObj,
    isSupport: function(sMenuId){return Frame.NewMenu.isSupport(sMenuId)},
    isSupportPanel: function(){return Frame.arrSlotInfo ? true : false},

    createHtml: createHtml,
    updateHtml : updateHtml,
    updateSysname: function(sName){Frame.set("sysname", sName)},
    disableLink: disableLink,
    save: save,

    // string
    sprintf: Frame.Util.sprintf,
    encode: encode,
    dumpObj: dumpObj,
    comparePort: comparePort,

    openDlg: openDlg,
    getHash: getHash,
    cloneObj : cloneObj,
    getRcString : getRcString,
    toText : toText,
    showError: showError,
    lockScreen: Frame.MyScreen.lock,
    unlockScreen: Frame.MyScreen.unlock,

    redirect: redirect,
    getChanged: getChanged,
    createUrl : MyUrl.create,
    parseUrlPara: MyUrl.parse,
   // addCommaNum: addCommaNum,
    addComma:addComma,
    indexOf : indexOf,
    resetForm : resetForm
};

Utils.Base = oBase;
})(jQuery);
