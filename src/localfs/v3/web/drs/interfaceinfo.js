;(function ($) {
    var MODULE_NAME = "drs.interfaceinfo";
    var LIST_NAME = "#Interface_List";
    var g_sn = FrameInfo.ACSN;
    var g_Device,g_aInterfaces=[];
    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("inter_infor_rc", sRcName);
    }
    //»ñÈ¡Ê±¼äº¯Êý
    function getTheDate(str1,str2)
    {
        var tNow = new Date();
        var nYear = tNow.getFullYear();
        var nMonth = tNow.getMonth()+1;
        var nDay = tNow.getDate();
        var nHour = tNow.getHours();
        var nMinute = tNow.getMinutes();
        var nSeconds = tNow.getSeconds();
        if(str1=="one")
        {
            if(str2=="end")
            {
                var oNowEndTime = {Year:nYear,Month:nMonth,Day:nDay,Hour:nHour,Minute:nMinute,Seconds:nSeconds};
                return oNowEndTime;
            }
            if(str2 =="Start")
            {
                var oNowStart = {Year:nYear,Month:nMonth,Day:nDay};
                return oNowStart;
            }
        }
        if(str1=="aweek")
        {
            if(str2=="end")
            {
                var oEndTime = {Year:nYear,Month:nMonth,Day:nDay,Hour:nHour,Minute:nMinute,Seconds:nSeconds};
                return oEndTime;
            }
            if(str2=="Start")
            {
                if(nDay>=7)
                {
                    var oStartTime = {Year:nYear,Month:nMonth,Day:(nDay-6)};
                }
                if(nDay<7)
                {
                    switch(nMonth)
                    {

                        case 1:
                            var oStartTime  = {Year:(nYear-1),Month:12,Day:(nDay+25)};
                            break;
                        case 2:
                        case 4:
                        case 6:
                        case 9:
                        case 11:
                            var oStartTime = {Year:nYear,Month:(nMonth-1),Day:(nDay+25)};
                            break;
                        case 3:
                            if(nYear%4!=0)
                                var oStartTime = {Year:nYear,Month:(nMonth-1),Day:(nDay+22)};
                            else
                                var oStartTime = {Year:nYear,Month:(nMonth-1),Day:(nDay+23)};
                            break;
                        case 5:
                        case 7:
                        case 8:
                        case 10:
                        case 12:
                            var oStartTime = {Year:nYear,Month:(nMonth-1),Day:(nDay+24)};
                            break;
                    }
                }
                return oStartTime;
            }
        }
    }
    function initGrid()
    {
        var optSpi= {
            showHeader: true,
            search:true,
            pageSize:12,
            colNames: getRcText ("SPI_HEAD"),
            colModel: [

                {name: "InterfaceName", datatype: "String"},
                {name: "PktCnts", datatype: "Integer"},
                {name: "PktBytes", datatype: "Integer"},
                {name: "Proportion", datatype: "Integer"}
            ]
        };
        $("#Interface_List").SList ("head", optSpi);
    }
    function  initData()
    {
    //½Ó¿ÚÁ÷Á¿Êý¾Ý´¦Àí
        var sNowEndTime =  getTheDate("aweek","end");
        var sNowStart =  getTheDate("aweek","Start");
        var sStartTime = sStartTime || sNowStart;
        var sEnd = sEnd || sNowEndTime;
        var nStartTime = (new Date(sStartTime.Year,sStartTime.Month-1,sStartTime.Day).getTime())/1000;
        var nEndTime = (new Date(sEnd.Year,sEnd.Month-1,sEnd.Day,sEnd.Hour,sEnd.Minute,sEnd.Seconds).getTime())/1000;
        var SendMsg = 
        {
             url: MyConfig.path+"/ant/read_dpi_app",
            dataType: "json",
            type:"post",
            data:{
                Method:'InterfacesStatis',
                Param: {
                    family:"0",
                    direct:"0",
                    ACSN:g_sn,
                    StartTime:nStartTime,
                    EndTime:nEndTime,

                },
                Return: [
                    "IfName",
                    "Pkt",
                    "PktBytes",
                ]

            },
            onSuccess:getMsgSuccess,
            onFailed:getMsgFail
        }
         Utils.Request.sendRequest(SendMsg);
        function getMsgSuccess(Data)
        {
           var message = Data.message;
                var IntName = message.IntName;
                $("#Interface_List").SList("refresh",IntName);
        }
        function getMsgFail()
        {
            console.log("fail terminal fail!");
        }  
    }
    function onAjaxErr()
    {
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }
    function _init()
    {
        initGrid();
        initData();
    };

    function _destroy()
    {
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init, 
        "destroy": _destroy, 
        "widgets": ["SList"],
        "utils":["Request","Msg"],

    });
})( jQuery );
