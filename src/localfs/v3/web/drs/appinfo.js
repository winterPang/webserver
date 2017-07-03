;(function ($) {
    var MODULE_NAME = "drs.appinfo";
    var LIST_NAME = "#appdetailList";
    var g_sn = FrameInfo.ACSN;
    var g_Device,g_bflag=true;
    var g_aApps = [];

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("dpi_infor_rc", sRcName);
    }
    function initGrid ()
    {
        var opt = {
            colNames: getRcText ("USER_HEADER"),
            showHeader: true,
            search:true,
            pageSize:12,
            /*select:{id:"UserInfo",name:"UserInfo:", title: getRcText("URL_NAME"),"options": makeUserSelect, action:onSelectChange},*/
            colModel: [
                {name: "APPNameCN", datatype: "String"},
                {name: "APPGroupName", datatype: "String"},
                {name:"UserMAC",datatype:"Mac"},
                {name: "PktBytes", datatype: "Integer"},
                {name: "DownPktBytes", datatype: "Integer"},
                {name: "TotalTime", datatype: "Integer"},
                {name: "LastTime", datatype: "String"},
            ]
        };
        $("#appdetailList").SList ("head", opt);

    }

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
    function addzero(num)
    {
        var str;
        str =  num<10 ? ("0" + num): num;
        return str;
    }


    function initData()
    {
        var tNow = new Date();
        var nHourNow = tNow.getHours();
        var nMinuteNow = tNow.getMinutes();
        var nSecondsNow = tNow.getSeconds();
        var sStartTime =  getTheDate("aweek","Start");
        var sEnd =  getTheDate("aweek","end");
        var nStartTime = (new Date(sStartTime.Year,sStartTime.Month-1,sStartTime.Day).getTime())/1000;
        var nEndTime = (new Date(sEnd.Year,sEnd.Month-1,sEnd.Day,sEnd.Hour,sEnd.Minute,sEnd.Seconds).getTime())/1000;


        var SendMsg = {
            url:MyConfig.path+"/ant/read_dpi_app",
            dataType: "json",
            type:"post",
            data:{
                Method:'GetApp',
                Param: {
                    family:"0",
                    direct:"0",
                    ACSN:g_sn,
                    StartTime:nStartTime,
                    EndTime:nEndTime,

                },
                Return: [
                    "UserMAC",
                    "APPName",
                    "APPNameCN",
                    "APPGroupName",
                    "Pkt",
                    "PktBytes",
                    "DropPktBytes",
                    "DropPkt",
                    "TotalTime",
                    "LastTime"
                ]

            },
            onSuccess:getMsgSuccess,
            onFailed:getMsgFail
        }
        Utils.Request.sendRequest(SendMsg);
        function getMsgSuccess(UpData)
        {
             var aApps = UpData.message;
            var SendMsgDown = {
                url:MyConfig.path+"/ant/read_dpi_app",
                dataType: "json",
                type:"post",
                data:{
                    Method:'GetApp',
                    Param: {
                        family:"0",
                        direct:"1",
                        ACSN:g_sn,
                        StartTime:nStartTime,
                        EndTime:nEndTime,

                    },
                    Return: [
                        "UserMAC",
                        "APPName",
                        "APPNameCN",
                        "APPGroupName",
                        "Pkt",
                        "PktBytes",
                        "DropPktBytes",
                        "DropPkt",
                        "TotalTime",
                        "LastTime",
                    ]

                },
                onSuccess:getMsgSuccessDown,
                onFailed:getMsgFailDown
            }
            Utils.Request.sendRequest(SendMsgDown);
            function getMsgSuccessDown(DownData)
            {
                var aAppTemp = [],nCount = 0;

                var aAppsDown = DownData.message;

                for(var i=0;i<aApps.length;i++)
                {
                    aApps[i].DownPktBytes = 0;
                    for(var j=0;j<aAppsDown.length;j++)
                    {
                        if((aApps[i].APPName == aAppsDown[j].APPName)&&(aApps[i].UserMAC == aAppsDown[j].UserMAC))
                        {
                            aApps[i].DownPktBytes += aAppsDown[j].PktBytes;
                            if(aApps[i].LastTime < aAppsDown[j].LastTime)
                            {
                                aApps[i].LastTime = aAppsDown[j].LastTime
                            }
                            aAppsDown[j].complete = true;
                            break;
                        }
                    }
                }

                for(var j=0;j<aAppsDown.length;j++)
                {
                    if(aAppsDown[j].complete == true)
                    {
                        continue;
                    }
                    aApps[i] = aAppsDown[j];
                    aApps[i].DownPktBytes = aApps[i].PktBytes;
                    aApps[i].PktBytes = "0";
                    i++;
                }
                var nKb = 1024,nMb = 1024*nKb,nGb = 1024*nMb,nTb = 1024*nGb;
                for(var i=0;i<aApps.length;i++)
                {
                    if((aApps[i].TotalTime!=0)&&((aApps[i].PktBytes!=0)||(aApps[i].DownPktBytes!=0)))
                    {
                        if((aApps[i].PktBytes<0)||(aApps[i].DownPktBytes<0))
                        {
                            continue;
                        }
                        aAppTemp[nCount] = aApps[i];
                        if(((aApps[i].PktBytes>0) || (aApps[i].DownPktBytes>0)) && aApps[i].TotalTime!="0:0:0") {
                            aAppTemp[nCount] = aApps[i];
                            if (aAppTemp[nCount].PktBytes < nKb) {
                                aAppTemp[nCount].PktBytes = Number(aAppTemp[nCount].PktBytes ) + "(Byte)"
                            }
                            if (nKb<=aAppTemp[nCount].PktBytes && aAppTemp[nCount].PktBytes < nMb) {
                                aAppTemp[nCount].PktBytes = Number((aAppTemp[nCount].PktBytes / nKb).toFixed(2)) + "(KB)"

                            }
                            if (nMb <= aAppTemp[nCount].PktBytes && aAppTemp[nCount].PktBytes < nGb) {
                                aAppTemp[nCount].PktBytes = Number((aAppTemp[nCount].PktBytes / nMb).toFixed(2)) + "(MB)"

                            }
                            if (nGb <= aAppTemp[nCount].PktBytes && aAppTemp[nCount].PktBytes < nTb) {
                                aAppTemp[nCount].PktBytes = Number((aAppTemp[nCount].PktBytes / nGb).toFixed(2)) + "(GB)"

                            }
                            if (nTb <= aAppTemp[nCount].PktBytes) {
                                aAppTemp[nCount].PktBytes = Number((aAppTemp[nCount].PktBytes / nTb).toFixed(2)) + "(TB)"

                            }

                            if ( aAppTemp[nCount].DownPktBytes < nKb) {
                                aAppTemp[nCount].DownPktBytes = Number(aAppTemp[nCount].DownPktBytes) + "(Byte)"
                            }
                            if (nKb<=aAppTemp[nCount].DownPktBytes && aAppTemp[nCount].DownPktBytes < nMb) {
                                aAppTemp[nCount].DownPktBytes = Number((aAppTemp[nCount].DownPktBytes / nKb).toFixed(2)) + "(KB)"

                            }
                            if (nMb <= aAppTemp[nCount].DownPktBytes && aAppTemp[nCount].DownPktBytes < nGb) {
                                aAppTemp[nCount].DownPktBytes = Number((aAppTemp[nCount].DownPktBytes / nMb).toFixed(2)) + "(MB)"

                            }
                            if (nGb <= aAppTemp[nCount].DownPktBytes && aAppTemp[nCount].DownPktBytes < nTb) {
                                aAppTemp[nCount].DownPktBytes = Number((aAppTemp[nCount].DownPktBytes / nGb).toFixed(2)) + "(GB)"

                            }
                            if (nTb <= aAppTemp[nCount].DownPktBytes) {
                                aAppTemp[nCount].DownPktBytes = Number((aAppTemp[nCount].DownPktBytes / nTb).toFixed(2)) + "(TB)"

                            }
                            nCount++;
                        }
                    }

                }


                //添加时 分 秒 汉字
                for(var i=0;i<aAppTemp.length;i++)
                {
                    var nHour, nMinute,nSeconds;
                    var nThisWeekHour = 0;
                    aAppTemp[i].LastTime = new Date(aAppTemp[i].LastTime*1000).getFullYear()+getRcText("NIAN")+(new Date(aAppTemp[i].LastTime*1000).getMonth()+1)+getRcText("YUE")+new Date(aAppTemp[i].LastTime*1000).getDate()+getRcText("RI")+
                        new Date(aAppTemp[i].LastTime*1000).getHours()+getRcText("SHI")+new Date(aAppTemp[i].LastTime*1000).getMinutes()+getRcText("FEN")+new Date(aAppTemp[i].LastTime*1000).getSeconds()+getRcText("MIAO");
                    if(aAppTemp[i].TotalTime>=3600)
                    {
                        nHour =(aAppTemp[i].TotalTime/3600).toFixed(0);
                        if(nHour>168)
                        {
                            nThisWeekHour = 144+nHourNow;
                            aAppTemp[i].TotalTime = nThisWeekHour+":"+nMinuteNow+":"+nSecondsNow;
                            continue;
                        }
                        var nTime = aAppTemp[i].TotalTime%3600;
                        if(nTime>=60)
                        {
                            nMinute = (nTime/60).toFixed(0);
                            nSeconds =(nTime)%60;
                            aAppTemp[i].TotalTime = nHour+":"+nMinute+":"+nSeconds;
                        }
                        else
                        {
                            nSeconds =(nTime)%60;
                            aAppTemp[i].TotalTime = nHour+":"+"0"+":"+nSeconds;
                        }
                    }
                    else if(aAppTemp[i].TotalTime>=60)
                    {
                        nMinute = (aAppTemp[i].TotalTime/60).toFixed(0);
                        nSeconds = aAppTemp[i].TotalTime%60;
                        aAppTemp[i].TotalTime = "0"+":"+nMinute+":"+nSeconds;
                    }
                    else
                    {
                        aAppTemp[i].TotalTime = "0"+":"+"0"+":"+aAppTemp[i].TotalTime;
                    } 
                }
               
                for(var i=0;i<aAppTemp.length;i++)
                {
                    if(aAppTemp[i].APPNameCN == "")
                    {
                        aAppTemp[i].APPNameCN = aAppTemp[i].APPName;
                       
                   }
                    // var sType = aAppTemp[i].APPGroupName;
                    // switch(sType)
                    // { 
                    //     case "Life":
                    //     {
                    //         aAppTemp[i].APPGroupName = getRcText("Life");
                    //         break;
                    //     }
                    //     case "Office":
                    //     {
                    //         aAppTemp[i].APPGroupName = getRcText("Office");
                    //         break;
                    //     }
                    //     case "Communication":
                    //     {
                    //         aAppTemp[i].APPGroupName = getRcText("Communication");
                    //         break;
                    //     }
                    //     case "Video":
                    //     {
                    //         aAppTemp[i].APPGroupName = getRcText("Video");
                    //         break;
                    //     }
                    //     case "Game":
                    //     {
                    //         aAppTemp[i].APPGroupName = getRcText("Game");
                    //         break;
                    //     }
                    //     case "Tool":
                    //     {
                    //         aAppTemp[i].APPGroupName = getRcText("Tool");
                    //         break;
                    //     }
                    //     case "News":
                    //     {
                    //         aAppTemp[i].APPGroupName = getRcText("News");
                    //         break;
                    //     }
                    //     case "Navigation":
                    //     {
                    //         aAppTemp[i].APPGroupName = getRcText("Navigation");
                    //         break;
                    //     }
                    //     case "Finance":
                    //     {
                    //         aAppTemp[i].APPGroupName = getRcText("Finance");
                    //         break;
                    //     } 
                    //     default:
                    //     {
                    //         aAppTemp[i].APPGroupName = getRcText("Unknown");
                    //         break;
                    //     }
                            
                    // }
                } 

                $("#appdetailList").SList("refresh", aAppTemp);
            }
            function getMsgFailDown()
            {
                console.log("fail terminal fail!");
            } 
        }
        function getMsgFail()
        {
            console.log("fail terminal fail!");
        }  

    }
    function onAjaxErr()
    {
    }
    function getDynUrl(sUrl)
    {
        return  "../../wnm/" + sUrl;
    }
    function _init()
    {
        initGrid();
        initData();
    };

    function _destroy()
    {
         Utils.Request.clearMoudleAjax(MODULE_NAME);
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList"],
        "utils":["Request","Msg"]
    });
})( jQuery );
