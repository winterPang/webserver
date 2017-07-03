(function ($)
{
var MODULE_NAME = "b_device.summary_wlanser";
var g_Radios, g_PercentMax = 100,g_APDB,g_ApBind;
var EXTEND_AUTHEN = "extend-auth";
var LOCAL_SERVER = "local-server";
var LOCAL_DOMAIN = "system";
var LVZHOU_SERVER = "lvzhou-server";
var LVZHOU_DOMAIN = "cloud";
var AP_GROUP = "default-group";
var DEFAULT_SSID = "xiaobei";
var SSID_MAX = 16;

function getRcText(sRcName)
{
    return Utils.Base.getRcString("ws_ssid_rc", sRcName);
}

function checkAdd(sName)
{
    var nCount = $("#ssidList").SList ("getAll") || [];
    nCount = nCount.length;
    if(nCount < SSID_MAX || sName != "add")
    {
        return true;
    }

    Utils.Msg.alert(getRcText("ADD_MAX"));
    return false;;
}

function showSSID(oRowdata, sName){

    function onCancel()
    {
        jFormSSID.form("updateForm",oRowdata);
        $("input[type=text]",jFormSSID).each(function(){
            Utils.Widget.setError($(this),"");
        });
        return false;
    }

    function onSubmitSSID()
    {
        //Step 6:success
        function onSuccess()
        {
            if(sName == "add")
            {
                Utils.Pages.closeWindow(Utils.Pages.getWindow(jFormSSID));
            }
            Utils.Base.refreshCurPage();
        }

        //Step 5:set Percent
        function setPercent()
        {
            if(oStData.Percent)
            {
                // var oReqBWG = Utils.Request.getTableInstance(NC.BandwidthGuarantee);

                for (i=0;i<g_APDB.length;i++)
                {
                    var oAPModel = g_APDB[i];
                    for(var ii=1;ii<=oAPModel.RadioNum;ii++)
                    {
                        oReqBWG.addRows ({
                            GroupName : AP_GROUP,
                            ModelName : oAPModel.ModelName,
                            RadioID : ii+"",
                            ServiceTemplateName : sStName,
                            Percent : oStData.Percent
                        });
                    }
                }

                Utils.Request.set ("merge", oReqBWG, {onSuccess:onSuccess});
            }
            else
            {
                // var oReqBWG = Utils.Request.getTableInstance(NC.BandwidthGuarantee);

                for (i=0;i<g_APDB.length;i++)
                {
                    var oAPModel = g_APDB[i];
                    for(var ii=1;ii<=oAPModel.RadioNum;ii++)
                    {
                        oReqBWG.addRows ({
                            GroupName : AP_GROUP,
                            ModelName : oAPModel.ModelName,
                            RadioID : ii+"",
                            ServiceTemplateName : sStName
                        });
                    }
                }

                Utils.Request.set ("remove", oReqBWG, {onSuccess:onSuccess});
            }
        }

        //Step 4:enable the ST,Bind to AP
        function setStEnable()
        {
            // var oTemplate = Utils.Request.getTableInstance (NC.ServiceTemplates);
            var aReq = [];

            if(sName == "add")
            {
                // var oReqBind = Utils.Request.getTableInstance (NC.GroupBinding);
                
                for (i=0;i<g_APDB.length;i++)
                {
                    var oAPModel = g_APDB[i];
                    for(var ii=1;ii<=oAPModel.RadioNum;ii++)
                    {
                        oReqBind.addRows ({
                            GroupName : AP_GROUP,
                            ModelName : oAPModel.ModelName,
                            RadioID : ii+"",
                            ServiceTemplateName : sStName
                        });
                    }
                }
                aReq.push(oReqBind);
            }

            oTemplate.addRows ({"Name":sStName, "Enable":"true"});
            aReq.push(oTemplate);
            Utils.Request.set ("merge", aReq, {onSuccess:setPercent});
        }

        //step 3:set the Authentication
        function setAuthen()
        {
            var sAuthenType = $("input[name=AuthenType]").MRadio("value");
            // var tPortal = Utils.Request.getTableInstance (NC.IPv4PortalAut);
            var oProtalData = {}, sSerName, sDomain;
            if(sAuthenType == "0")
            {
                tPortal.addRows({Name : sStName});
                Utils.Request.set ("remove", tPortal, {onSuccess:setStEnable,showSucMsg:false});
                return ;
            }
            else if(sAuthenType == "1")
            {   
                // oProtalData.ExtendAuthDomain = EXTEND_AUTHEN;
                sSerName = LOCAL_SERVER;
                sDomain  = LOCAL_DOMAIN; 
            }
            else if(sAuthenType == "2")
            {
                sSerName = LVZHOU_SERVER;
                sDomain = LVZHOU_DOMAIN;
            }

            oProtalData = $.extend(oProtalData,{
                Name : sStName,
                Method : "0",
                "WebServer.WebServerName" : sSerName,
                "WebServer.EscapeEnable" : "false",
                Domain : sDomain
            });

            tPortal.addRows(oProtalData);
            Utils.Request.set ("merge", tPortal, {onSuccess:setStEnable,showSucMsg:false});
        }

        //step 2:set the security
        function setSecCfg()
        {
            // var tSecReq = Utils.Request.getTableInstance (NC.ServiceSecurity);
            // var tAuthent = Utils.Request.getTableInstance (NC.Layer2Authentication);
            var sAuthenType = $("input[name=AuthenType]").MRadio("value");
            var sAkmMode = "0";
            var oAuthenData = {
                AuthenticationMode: "0",
                ServiceTemplateName: sStName
            };
            var oSecData = {
                Name : sStName,
                WpaIeSelected : "true",
                RsnIeSelected : "true",
                TkipSelected : "true",
                CcmpSelected : "true"
            };

            /*********Secutity Rule**************
             *Service Type -- Security Type
                Employee      Psk or 802.1x
                Guest         Psk or None
                Business      Psk 
             *SecurityType -- Layer2Authen
                Psk           Pass
                802.1x        802.1x
                None          Pass
             ************************************/
            if(StType == "1")//Employee
            { 
                sAkmMode = $("input[name=AccPwdStaff]").MRadio("value");
            }
            else if(StType == "2")//Guest
            {
                sAkmMode = "2";
            }
            else if(StType == "3")//Business
            {
                sAkmMode = $("input[name=AccPwdCorpo]").MRadio("value");
            }

            if(sAkmMode == "0")//None
            {
                tSecReq.addRows ({"Name" : sStName});
                tAuthent.addRows (oAuthenData);
                Utils.Request.set ("remove", [tSecReq], {onSuccess:setAuthen,showSucMsg:false});
                Utils.Request.set ("merge", [tAuthent], {onSuccess:setAuthen,showSucMsg:false});
            }
            else if(sAkmMode == "1")//802.1x
            {   
                oAuthenData.AuthenticationMode = "3";
                oSecData.AkmMode = sAkmMode;
                tSecReq.addRows (oSecData);
                tAuthent.addRows (oAuthenData);
                Utils.Request.set ("merge", [tSecReq,tAuthent], {onSuccess:setAuthen,showSucMsg:false});
            }
            else if(sAkmMode == "2")//Psk
            {

                oSecData.PskInputMode = "1";
                oSecData.PskPassPhraseKey = oStData.PskPassPhraseKey;
                oSecData.AkmMode = sAkmMode;
                tSecReq.addRows (oSecData);
                tAuthent.addRows (oAuthenData);
                Utils.Request.set ("merge", [tSecReq,tAuthent], {onSuccess:setAuthen,showSucMsg:false});
            }
        }

        //Step 1:disable the ST,merge other Config
        function setBasicCfg()
        {
            var oBasicData = {
                "Name" : sStName,
                "Enable" : "false",
                "Description" : StType,
                "SSID" : $.trim(oStData.SSID),
                "UserIsolation" : oStData.UserIsolation
            };

            if(Frame.get("WorkMode") == "1")
            {
                oBasicData["DefaultVlan"] = $("#DefaultVlan").val();
            }
            else
            {
                oBasicData["DefaultVlan"] = $("[name=StType]").MRadio("value") == "1" ? "1" : "100";
            }

            oBasicReq.addRows (oBasicData);

            Utils.Request.set (sType, [oBasicReq], {onSuccess:setSecCfg,showSucMsg:false});
        }

        var oTempTable = {
            index:[],
            column:["SSID","UserIsolation","PskPassPhraseKey","Percent"]
        };
        var oStData = jFormSSID.form ("getTableValue", oTempTable);
        var StType = $("input[name=StType]").MRadio("value");

        setBasicCfg();
    }

    function checkDefaultSSID()
    {
        var aAllSt = $("#ssidList").SList("getAll");
        var hasXiaobei = false, nLen = aAllSt.length;

        for(var i=0;i<nLen;i++)
        {
            if(aAllSt[i].Name == DEFAULT_SSID)
            {
                hasXiaobei = true;
                break;
            }
        }

        if(hasXiaobei && nLen > 1)
        {
            Utils.Msg.confirm(getRcText("DEL_XIAOBEI").replace("%s",window.location.host),function(){
                // var oTemplate = Utils.Request.getTableInstance (NC.ServiceTemplates);
                    oTemplate.addRows({
                    Name : DEFAULT_SSID,
                    Enable : "false"
                });
                Utils.Request.set ("merge", oTemplate, {onSuccess: onSubmitSSID});
            });
        }
        else
        {
            onSubmitSSID();
        }
    }

    if(!checkAdd(sName)) return false;

    var jFormSSID = $("#toggle_form"), sType, sStName;
    var CurrentPercent = oRowdata || {};
    CurrentPercent = CurrentPercent.Percent || 0;
    CurrentPercent = g_PercentMax + CurrentPercent*1;
    if(sName == "add") //Add
    {
        if(CurrentPercent < 1)
        {
            Utils.Msg.alert(getRcText("BANDTIDTH_NONE"))
            return ;
        }

        sType = "create";
        sStName = Frame.Util.generateID("st");
        var jDlg = $("#AddSsidDlg");
        if(jDlg.children().length)
        {
            $("#ssidToggle").show().insertAfter($(".modal-header",jDlg));
        }
        else
        {
            $("#ssidToggle").show().appendTo(jDlg);
        }

        jFormSSID.form("init", "edit", {"title":getRcText("ADD_TITLE"),"btn_apply": checkDefaultSSID});
        jFormSSID.form("updateForm",{
            SSID : "",
            StType : "1",
            UserIsolation : "false"
        });
        $("input[type=text]",jFormSSID).each(function(){
            Utils.Widget.setError($(this),"");
        });
        Utils.Base.openDlg(null, {}, {scope:jDlg,className:"modal-super"});
    }
    else //Edit
    {
        sType = "merge";
        sStName = oRowdata.Name;

        //jFormSSID.form ("init", "edit", {"btn_apply": checkDefaultSSID, "btn_cancel":onCancel});
        jFormSSID.form("updateForm",oRowdata);
        $('input[type=radio][id="APS3"]').prop('checked',false);
        $("input[type=text]",jFormSSID).each(function(){
            Utils.Widget.setError($(this),"");
        });
    }
}

function onDelSSID(oData)
{
    oTemplate.addRows({
        Name : oData.Name,
        Enable : "false"
    });
    Utils.Request.set ("merge", oTemplate, {onSuccess: Utils.Base.refreshCurPage});
}

function realDelete(aSt)
{ 
    for (var i=0;i<g_APDB.length;i++)
    {
        var oAPModel = g_APDB[i];
        for(var ii=1;ii<=oAPModel.RadioNum;ii++)
        {
            for(var iii=0;iii<aSt.length;iii++)
            {
                oReqBind.addRows ({
                    GroupName : AP_GROUP,
                    ModelName : oAPModel.ModelName,
                    RadioID : ii+"",
                    ServiceTemplateName : aSt[iii].Name
                });
                oTemplate.addRows({Name : aSt[iii].Name});
            }
        }
    }
    for(var i=0;i<g_ApBind.length;i++)
    {
        for(var ii=0;ii<aSt.length;ii++)
        {
            if(aSt[ii].Name == g_ApBind[i].ServiceTemplateName)
            {
                oApBind.addRows({
                    ApName : g_ApBind[i].ApName,
                    RadioId : g_ApBind[i].RadioId,
                    ServiceTemplateName : aSt[ii].Name
                });
            }
        }
    }

    Utils.Request.set ("remove", [oReqBind,oApBind,oTemplate], {onSuccess: $.noop,showSucMsg:false});
}

function makeStData(aSt,aSec,aAuthen,aPortal,aBwg){
    var mapBwg = {}, mapSec = {}, mapAuthen = {}, mapPortal = {};
    var aAll = [], aDel = [];

    for(var i=0;i<aSec.length;i++)
    {
        if(!mapSec[aSec[i].Name])
        {
            mapSec[aSec[i].Name] = aSec[i].AkmMode || "0";
        }
    }

    for(var i=0;i<aAuthen.length;i++)
    {
        if(!mapAuthen[aAuthen[i].ServiceTemplateName])
        {
            mapAuthen[aAuthen[i].ServiceTemplateName] = aAuthen[i].Dot1xMandatoryDomain || aAuthen[i].MACAuthenticationDomain ||"defaultdomain";
        }
    }

    for(var i=0;i<aPortal.length;i++)
    {
        if(!mapPortal[aPortal[i].Name] && aPortal[i].Name != DEFAULT_SSID)
        {
            var sType = aPortal[i]["WebServer.WebServerName"];
            if(sType == LOCAL_SERVER) sType = "1";
            if(sType == LVZHOU_SERVER) sType = "2";
            mapPortal[aPortal[i].Name] = sType;
        }
    }

    for(var i=0;i<aBwg.length;i++)
    {
        if(!mapBwg[aBwg[i].ServiceTemplateName])
        {
            mapBwg[aBwg[i].ServiceTemplateName] = aBwg[i].Percent || "";
        }
    }

    for(i=0;i<aSt.length;i++)
    {
        var oTemp = aSt[i];
        if(oTemp.Enable == "false")
        {
            aDel.push(oTemp);
            continue;
        }
        oTemp.StType = oTemp.Description || "2";
        oTemp.Percent =  mapBwg[oTemp.Name];
        oTemp.Domain = mapAuthen[oTemp.Name];
        oTemp.AccPwdCorpo = mapSec[oTemp.Name];
        oTemp.AccPwdStaff = mapSec[oTemp.Name];
        oTemp.AuthenType = mapPortal[oTemp.Name] || "0";
        g_PercentMax -= oTemp.Percent || 0;
        aAll.push(oTemp);
    }

    aAll.sort(function(a,b){
        return a.SSID > b.SSID;
    })

    realDelete(aDel);
    return aAll;
}

function checkBWGS(aBwgs,aRadio){
    if((aBwgs[0] || {}).Enable == "true")
    {
        return ;
    }

    // var oReqBWGS = Utils.Request.getTableInstance (NC.GuaranteeStatus);

    for (i=0;i<g_APDB.length;i++)
    {
        var oAPModel = g_APDB[i];
        for(var ii=1;ii<=oAPModel.RadioNum;ii++)
        {
            oReqBWGS.addRows ({
                GroupName : AP_GROUP,
                ModelName : oAPModel.ModelName,
                RadioID : ii+"",
                Enable : "true"
            });
        }
    }

    Utils.Request.set ("merge", [oReqBWGS], {onSuccess:$.noop,showSucMsg:false});
}

function initData(){
    g_allData = [{"Name":"xiaobei","Enable":"true","SSID":"xiaobei","PWD":"1","HideSsid":"false","DeviceGrp":"0","UserIsolation":"false","StType":"2","Percent":"","Domain":"defaultdomain","AccPwdCorpo":"0","AccPwdStaff":"0","AuthenType":"0"},
                 {"Name":"briefy","Enable":"true","SSID":"briefy","PWD":"1","HideSsid":"false","DeviceGrp":"0","UserIsolation":"false","StType":"2","Percent":"","Domain":"defaultdomain","AccPwdCorpo":"0","AccPwdStaff":"0","AuthenType":"0"}];
    $("#ssidList").SList ("refresh", g_allData);

}    
function queryAuthCfg(){
        return $.ajax({
            type: "GET",
            url: MyConfig.v2path+"/authcfg/query?ownerName="+FrameInfo.g_user.attributes.name,
            dataType: "json",
            contentType: "application/json"
        })
}
function getSSIDInfo(){
    return $.ajax({
        type: "POST",
        url: MyConfig.v2path+"/getSSIDInfo",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({
            tenant_name: FrameInfo.g_user.attributes.name,
            dev_snlist: [FrameInfo.ACSN+""]
        })
    });
}

function queryPubMng(data, textStatus, jqXHR){
    // console.log(data);
    return $.ajax({
        type: "GET",
        url: MyConfig.v2path+"/pubmng/query?ownerName="+FrameInfo.g_user.attributes.name,
        dataType: "json",
        contentType: "application/json"
    });
}

function queryAuthCfg(){
    return $.ajax({
        type: "GET",
        url: MyConfig.v2path+"/authcfg/query?ownerName="+FrameInfo.g_user.attributes.name,
        dataType: "json",
        contentType: "application/json"
    })
}

function queryLoginPage(){
    return $.ajax({
        type: "GET",
        url: MyConfig.v2path+"/themetemplate/query?ownerName="+FrameInfo.g_user.attributes.name,
        dataType: "json",
        contentType: "application/json",
    })
}

function queryWeChat(){
    return $.ajax({
        type: "GET",
        url: MyConfig.v2path+"/weixinaccount/query?ownerName="+FrameInfo.g_user.attributes.name,
        dataType: "json",
        contentType: "application/json",
    });
}

function refreshSSIDList(obj){
    var arr = [];
    for (var a in obj){
        arr.push(obj[a]);
    }
    $("#ssidList").SList ("refresh", arr);
}

function initGrid()
{
    function showDetail()
    {
        Utils.Base.redirect({ np:"b_device.wlanser_detail"});
        return false;
    }
    function deleteDetail(){

    }
    var optSsid = {
        colNames: getRcText ("SSID_HEADER"),
        multiSelect: true,
        showOperation:true,
        colModel: [
            {name:'SSID', datatype:"String"},
            {name:'AuthenType', datatype:"Order",data:getRcText("AUTHEN_TYPE")},
            {name:'PWD', datatype:"Order",data:getRcText("YESNO_TYPE")},
            {name:'DeviceGrp', datatype:"Order",data:getRcText("DEVGRP_TYPE")},
            
        ],
        buttons:[
            {name: "add", action: showSSID},
            {name: "edit", action:showDetail},
            {name: "delete", action:deleteDetail},///fgsdgsdgsdgsadfgasdfas
            {name: getRcText("SLIST_BUT"),deleteDetail}
        ]
    };
    $("#ssidList").SList ("head", optSsid);

    $("input[name=AccPwdStaff]").bind("change",function(){
        var aContent = $(this).attr("content");
        var sCtrlBlock = $(this).attr("ctrlBlock") || "";
        $(sCtrlBlock).hide();

        if(!aContent) return true;

        aContent = aContent.split(",");
        for(var i=0;i<aContent.length;i++)
        {
            if(!aContent[i])continue;
            $(aContent[i]).show();
        }
    });
     $("input[name=devicegroup]").bind("change",function(){
        var aContent = $(this).attr("content");
        var sCtrlBlock = $(this).attr("ctrlBlock") || "";
        $(sCtrlBlock).hide();

        if(!aContent) return true;

        aContent = aContent.split(",");
        for(var i=0;i<aContent.length;i++)
        {
            if(!aContent[i])continue;
            $(aContent[i]).show();
        }
    });   
}
function onRowSubmit(oData,oPara)
{
    function check()
    {
        if(oRowData.FriendlyName=="" || oRowData.DescStr=="" || oRowData.IconType=="" || oRowData.IconName=="")
            return false;
        else
            return true;
    }

    if(oData.type=="delete")
    {
        oPara.onSuccess(oData.type);
        return true;
    }

    var oRowData = oData.curdata || {};

    if(!check())
    {
        oPara.onFailed(getRcText ("fail_info"),oData.type,"FriendlyName");
        oPara.onFailed(getRcText ("fail_info"),oData.type,"DescStr");
        if(oRowData.IconName=="")
        {
            oPara.onFailed(getRcText ("fail_info"),oData.type,"IconName");
        }
        else
        {
            oPara.onFailed(getRcText ("fail_info"),oData.type,"IconType");
        }
        return false;
    }
    oPara.onSuccess(oData.type);
    return true;  
}
function OSUFriendlyName_initGrid()
{
    var aLanguage = [];
    var g_oLangCode = {"0":{"str2":"az","str3":"aze","help":"Azerbaijani"},"1":{"str2":"be","str3":"bel","help":"Belarusian"},"2":{"str2":"bg","str3":"bul","help":"Bulgarian"},"3":{"str2":"bi","str3":"bis","help":"Bislama"},"4":{"str2":"bn","str3":"ben","help":"Bengali"},"5":{"str2":"bs","str3":"","help":"Bosnian"},"6":{"str2":"ca","str3":"cat","help":"Catalan"},"7":{"str2":"cs","str3":"cze","help":"Czech"},"8":{"str2":"cy","str3":"wel","help":"Welsh"},"9":{"str2":"da","str3":"dan","help":"Danish"},"10":{"str2":"de","str3":"ger","help":"German"},"11":{"str2":"dv","str3":"div","help":"Divehi"},"12":{"str2":"dz","str3":"","help":"Bhutani"},"13":{"str2":"el","str3":"gre","help":"Greek"},"14":{"str2":"en","str3":"eng","help":"English"},"15":{"str2":"es","str3":"spa","help":"Spanish"},"16":{"str2":"et","str3":"est","help":"Estonian"},"17":{"str2":"fa","str3":"per","help":"Persian"},"18":{"str2":"fi","str3":"fin","help":"Finnish"},"19":{"str2":"fj","str3":"fij","help":"Fijian"},"20":{"str2":"fo","str3":"fao","help":"Faroese"},"21":{"str2":"fr","str3":"fre","help":"French"},"22":{"str2":"fy","str3":"fry","help":"Frisian"},"23":{"str2":"ga","str3":"gle","help":"Irish"},"24":{"str2":"gn","str3":"grn","help":"Guarani"},"25":{"str2":"he","str3":"heb","help":"Hebrew"},"26":{"str2":"hi","str3":"hin","help":"Hindi"},"27":{"str2":"ho","str3":"hmo","help":"Hiri Muto"},"28":{"str2":"hr","str3":"scr","help":"Croatian"},"29":{"str2":"ht","str3":"","help":"Haitian"},"30":{"str2":"hu","str3":"hun","help":"Hungarian"},"31":{"str2":"hy","str3":"arm","help":"Armenian"},"32":{"str2":"id","str3":"ind","help":"Indonesian"},"33":{"str2":"is","str3":"ice","help":"Icelandic"},"34":{"str2":"it","str3":"ita","help":"Italian"},"35":{"str2":"iu","str3":"iku","help":"Inuktitut"},"36":{"str2":"ja","str3":"jpn","help":"Japanese"},"37":{"str2":"ka","str3":"geo","help":"Georgian"},"38":{"str2":"kk","str3":"kaz","help":"Kazakh"},"39":{"str2":"km","str3":"khm","help":"Khmer"},"40":{"str2":"ko","str3":"kor","help":"Korean"},"41":{"str2":"ky","str3":"kir","help":"Kirghiz"},"42":{"str2":"la","str3":"lat","help":"Latin"},"43":{"str2":"lb","str3":"","help":"Luxembourgish"},"44":{"str2":"lo","str3":"lao","help":"Lao"},"45":{"str2":"lt","str3":"lit","help":"Lithuanian"},"46":{"str2":"lv","str3":"lav","help":"Latvian"},"47":{"str2":"mg","str3":"mlg","help":"Malagasy"},"48":{"str2":"mh","str3":"mah","help":"Marshallese"},"49":{"str2":"mi","str3":"mao","help":"Maori"},"50":{"str2":"mk","str3":"mac","help":"Mongolian"},"51":{"str2":"mn","str3":"mon","help":"Mongolian"},"52":{"str2":"ms","str3":"may","help":"Malay"},"53":{"str2":"mt","str3":"mlt","help":"Maltese"},"54":{"str2":"my","str3":"bur","help":"Burmese"},"55":{"str2":"na","str3":"nau","help":"Nauru"},"56":{"str2":"nb","str3":"","help":"Norwegian Bokmal"},"57":{"str2":"ne","str3":"nep","help":"Nepali"},"58":{"str2":"nl","str3":"dut","help":"Dutch"},"59":{"str2":"nn","str3":"","help":"Norwegian Nynorsk"},"60":{"str2":"no","str3":"nor","help":"Norwegian"},"61":{"str2":"nr","str3":"nbl","help":"Ndebele South"},"62":{"str2":"ny","str3":"","help":"Chichewa;chewa;nyanja"},"63":{"str2":"","str3":"nya","help":"nyanja"},"64":{"str2":"pl","str3":"pol","help":"Polish"},"65":{"str2":"ps","str3":"pus","help":"Pushto"},"66":{"str2":"pt","str3":"por","help":"Portuguese"},"67":{"str2":"qu","str3":"que","help":"Quechua"},"68":{"str2":"rn","str3":"run","help":"Rundi"},"69":{"str2":"ro","str3":"rum","help":"Romanian"},"70":{"str2":"ru","str3":"rus","help":"Russian"},"71":{"str2":"rw","str3":"kin","help":"Kinyarwanda"},"72":{"str2":"se","str3":"","help":"Northern Sami"},"73":{"str2":"si","str3":"sin","help":"Sinhalese"},"74":{"str2":"sk","str3":"slo","help":"Slovak"},"75":{"str2":"sl","str3":"slv","help":"Slovenian"},"76":{"str2":"sm","str3":"smo","help":"Samoan"},"77":{"str2":"so","str3":"som","help":"Somali"},"78":{"str2":"sq","str3":"alb","help":"Albanian"},"79":{"str2":"sr","str3":"scc","help":"Serbian"},"80":{"str2":"ss","str3":"ssw","help":"Swati"},"81":{"str2":"st","str3":"sot","help":"Sotho Southern"},"82":{"str2":"sv","str3":"swe","help":"Swedish"},"83":{"str2":"sw","str3":"swa","help":"Swahili"},"84":{"str2":"ta","str3":"tam","help":"Tamil"},"85":{"str2":"tg","str3":"tgk","help":"Tajik"},"86":{"str2":"th","str3":"tha","help":"Thai"},"87":{"str2":"ti","str3":"tir","help":"Tigrinya"},"88":{"str2":"tk","str3":"tuk","help":"Turkmen"},"89":{"str2":"tl","str3":"tgl","help":"Tagalog"},"90":{"str2":"tn","str3":"tsn","help":"Tswana"},"91":{"str2":"to","str3":"ton","help":"Tonga (Tonga Islands)"},"92":{"str2":"tr","str3":"tur","help":"Turkish"},"93":{"str2":"ts","str3":"tso","help":"Tsonga"},"94":{"str2":"uk","str3":"ukr","help":"Ukrainian"},"95":{"str2":"ur","str3":"urd","help":"Urdu"},"96":{"str2":"uz","str3":"uzb","help":"Uzbek"},"97":{"str2":"ve","str3":"ven","help":"Venda"},"98":{"str2":"vi","str3":"vie","help":"Vietnamese"},"99":{"str2":"xh","str3":"xho","help":"Xhosa"},"100":{"str2":"zh","str3":"chi","help":"Chinese"},"101":{"str2":"zu","str3":"zul","help":"Zulu"},"102":{"str2":"af","str3":"afr","help":"Afrikaans"},"103":{"str2":"am","str3":"amh","help":"Amharic"},"104":{"str2":"ar","str3":"ara","help":"Arabic"},"105":{"str2":"ay","str3":"aym","help":"Aymara"}}
    for(var i in g_oLangCode){
        aLanguage.push(g_oLangCode[i].help);
    }

    var opt = {
        colNames: getRcText("OSUFriendlyName_HEADER"),
        errorId:null,
        procData: onRowSubmit,
        maxCount:32,
        colModel:[
            //{name:'FriendlyName', required:false,width:25,min:1,maxLen:252,datatype:"String"},
            {name:'LangCode', required:false,width:25,datatype:"Order",data:{start:0,items:aLanguage}}
        ]
    };
    $("#OSUFriendlyName_edittable").EditTable("setOption", opt);
}
function _init ()
{
    initGrid();
    initData();
    OSUFriendlyName_initGrid();
}

function _resize(jParent)
{
}

function _destroy()
{
    g_PercentMax = 100;
    g_APDB = null;
    g_Radios = null;
}
Utils.Pages.regModule (MODULE_NAME, {
    "init": _init,
    "destroy": _destroy,
    "resize": _resize,
    "widgets": ["SList","SingleSelect","Minput","Form", "EditTable","MSelect"],
    "utils": ["Request","Base"],
});

}) (jQuery);
