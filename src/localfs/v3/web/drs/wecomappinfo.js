;(function ($) {
    var MODULE_NAME = "drs.wecomappinfo";
    var LIST_NAME = "#appList";
    var g_sn = FrameInfo.ACSN;
    //var NC, MODULE_NC = "drs.NC";
    var g_Device,g_bflag=true;
    var g_aApps = [];

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("userapp_infor_rc", sRcName);
    }
    function initGrid ()
    {
        var opt = {
            showHeader: true,
            search:true,
            pageSize:12,
            colNames: getRcText ("USER_HEADER"),
             /* select:{id:"UserInfo",name:"UserInfo:", title: getRcText("URL_NAME"),"options": makeUserSelect, action:onSelectChange},*/
            colModel: [
                {name: "APPName", datatype: "String"},
                {name: "APPGroupName", datatype: "String"},
                {name:"UserMAC",datatype:"String"},
                {name: "PktBytes", datatype: "Integer"},
                {name: "DownPktBytes", datatype: "String"},
               // {name: "Pkt", datatype: "Integer"},
                {name: "TotalTime", datatype: "Integer"},
                {name:"accessnumber",datatype:"Integer"}
                //{name:"nPktDir",datatype:"Integer"}
            ]
        };
        $("#appList").SList ("head", opt);
    }

    function getTheDate(str1,str2)
    {
        var tNow = new Date();
        var nYear = tNow.getFullYear();
        var nMonth = tNow.getMonth();
        var nDay = tNow.getDate();
        var nHour = tNow.getHours();
        var nMinute = tNow.getMinutes();
        var nSeconds = tNow.getSeconds();
        if(str1=="one")
        {
            if(str2=="end")
            {
                //var sNowEndTime = nYear + "-" + addzero(nMonth) + "-" + addzero(nDay) + "T" +addzero(nHour) +":"+addzero(nMinute)+":"+addzero(nSeconds);
                var oNowEndTime = {Year:nYear,Month:nMonth,Day:nDay,Hour:nHour,Minute:nMinute,Seconds:nSeconds};
                return oNowEndTime;
            }
            if(str2 =="Start")
            {
                // var sNowStart = nYear + "-" + addzero(nMonth) + "-" + addzero(nDay) + "T" +"00:00:00";
                var oNowStart = {Year:nYear,Month:nMonth,Day:nDay};
                return oNowStart;
            }
        }
        if(str1=="aweek")
        {
            if(str2=="end")
            {
                //var sEndTime = nYear + "-" + addzero(nMonth) + "-" + addzero(nDay-nCount) + "T" + "23:59:59"
                var oEndTime = {Year:nYear,Month:nMonth,Day:nDay,Hour:nHour,Minute:nMinute,Seconds:nSeconds};
                return oEndTime;
            }
            if(str2=="Start")
            {
                if(nDay>=7)
                {
                    //var sStartTime = nYear + "-" + addzero(nMonth) + "-" + addzero(nDay-nCount) + "T" + "00:00:00"
                    var oStartTime = {Year:nYear,Month:nMonth,Day:(nDay-6)};
                }
                if(nDay<7)
                {
                    switch(nMonth)
                    {

                        case 1:
                            //sStartTime = nYear-1 + "-" + 12 + "-" + addzero(nDay+31-nCount) + "T" +"00:00:00";
                            var oStartTime  = {Year:(nYear-1),Month:12,Day:(nDay+25)};
                            break;
                        case 2:
                        case 4:
                        case 6:
                        case 9:
                        case 11:
                            //sStartTime = nYear + "-" + addzero(nMonth-1) + "-" + addzero(nDay+31-nCount) + "T" +"00:00:00";
                            var oStartTime = {Year:nYear,Month:(nMonth-1),Day:(nDay+25)};
                            break;
                        case 3:
                            if(nYear%4!=0)
                            //sStartTime = nYear + "-" +  addzero(nMonth-1) + "-" + addzero(nDay+29-nCount) + "T" +"00:00:00";
                                var oStartTime = {Year:nYear,Month:(nMonth-1),Day:(nDay+22)};
                            else
                            //sStartTime = nYear + "-" +  addzero(nMonth-1) + "-" + addzero(nDay+28-nCount) + "T" +"00:00:00";
                                var oStartTime = {Year:nYear,Month:(nMonth-1),Day:(nDay+23)};
                            break;
                        case 5:
                        case 7:
                        case 8:
                        case 10:
                        case 12:
                            //sStartTime = nYear + "-" + addzero(nMonth-1) + "-" + addzero(nDay+30-nCount) + "T" +"00:00:00";
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
    function accessNumber(aDate)
    {
        //计算每个应用的访问人次
        for(var i=0;i<aDate.length;i++)
        { 
            aDate[i].accessnumber=1;
            for(var j=0;j<aDate.length;j++)
            {

                if((aDate[i].APPName==aDate[j].APPName)&&(aDate[i].UserMAC!=aDate[j].UserMAC))
                {
                    if(i>j)
                    {
                        aDate[i].accessnumber=aDate[j].accessnumber;
                        break;
                    }
                    else
                    {
                        aDate[i].accessnumber +=1;
                    }
                }
            }
        }

        return aDate;
    }
    function initData(sStartTime, sEnd, nIpType)
    {
        var tNow = new Date();
        var nHourNow = tNow.getHours();
        var nMinuteNow = tNow.getMinutes();
        var nSecondsNow = tNow.getSeconds();
        var sStartTime =  getTheDate("aweek","Start");
        var sEnd =  getTheDate("aweek","end");
        var nStartTime = (new Date(sStartTime.Year,sStartTime.Month,sStartTime.Day).getTime())/1000;
        var nEndTime = (new Date(sEnd.Year,sEnd.Month,sEnd.Day,sEnd.Hour,sEnd.Minute,sEnd.Seconds).getTime())/1000;

        var aApps = [];
        var aAppsDown = [];
        $.ajax({
            url:MyConfig.path+"/ant/dpi_app",
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
                            "APPGroupName", 
                            "Pkt",
                            "PktBytes",
                            "TotalTime",
                        ]
                
             },
            success: function (Data)
            {
                 
                var aApps = Data.message;
                $.ajax({
                    url:MyConfig.path+"/ant/dpi_app",
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
                     "APPGroupName",
                     "Pkt",
                     "PktBytes",
                     "TotalTime",
                     ]

                     },
                    success: function (downData)
                    {
                        var aAppTemp = [],nCount = 0;
                        var aAppsDown = downData.message;
                        for(var i=0;i<aApps.length;i++)
                        {
                            aApps[i].DownPktBytes = 0;
                            for(var j=0;j<aAppsDown.length;j++)
                            {
                                if((aApps[i].APPName == aAppsDown[j].APPName)&&(aApps[i].UserMAC == aAppsDown[j].UserMAC))
                                {
                                    aApps[i].DownPktBytes += aAppsDown[j].PktBytes;
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
                            aApps[i].DownPktBytes = aApps[i].PktBytes
                            aApps[i].PktBytes = "0";
                            i++;
                        }
                        aApps = accessNumber(aApps);
                        //添加时 分 秒 汉字
                        for(var i=0;i<aApps.length;i++)
                        {
                            var nHour, nMinute,nSeconds;
                            var nThisWeekHour
                            if(aApps[i].TotalTime>=3600)
                            {
                                nHour =(aApps[i].TotalTime/3600).toFixed(0);
                                if(nHour>168)
                                {
                                    nThisWeekHour = 144+nHourNow;
                                    aApps[i].TotalTime = nThisWeekHour+":"+nMinuteNow+":"+nSecondsNow;
                                    continue;
                                }
                                var nTime = aApps[i].TotalTime%3600;
                                if(nTime>=60)
                                {
                                    nMinute = (nTime/60).toFixed(0);
                                    nSeconds =(nTime)%60;
                                    aApps[i].TotalTime = nHour+":"+nMinute+":"+nSeconds;
                                }
                                else
                                {
                                    nSeconds =(nTime)%60;
                                    aApps[i].TotalTime = nHour+":"+"0"+":"+nSeconds;
                                }
                            }
                            else if(aApps[i].TotalTime>=60)
                            {
                                nMinute = (aApps[i].TotalTime/60).toFixed(0);
                                nSeconds = aApps[i].TotalTime%60;
                                aApps[i].TotalTime = "0"+":"+nMinute+":"+nSeconds;
                            }
                            else
                            {
                                aApps[i].TotalTime = "0"+":"+"0"+":"+aApps[i].TotalTime;
                            }
                           /* aApps[i].PktBytes = Number((aApps[i].PktBytes/1024).toFixed(2));
                            aApps[i].DownPktBytes = Number((aApps[i].DownPktBytes/1024).toFixed(2));
                            if(aApps[i].PktBytes==0)
                            {
                                aApps[i].PktBytes = "0";
                            }
                            if(aApps[i].DownPktBytes==0)
                            {
                                aApps[i].DownPktBytes = "0";
                            }*/

                        }
                        var nKb = 1024,nMb = 1024*nKb,nGb = 1024*nMb,nTb = 1024*nGb;
                        for(var i=0;i<aApps.length;i++)
                        {
                            if(((aApps[i].PktBytes!=0) || (aApps[i].DownPktBytes!=0)) && aApps[i].TotalTime!="0:0:0")
                            {
                                aAppTemp[nCount] = aApps[i];
                                if (aAppTemp[nCount].PktBytes < nKb) {
                                    aAppTemp[nCount].PktBytes = Number(aAppTemp[nCount].PktBytes) + "(Byte)"
                                }
                                if (nKb<=aAppTemp[nCount].PktBytes&&aAppTemp[nCount].PktBytes < nMb) {
                                    aAppTemp[nCount].PktBytes = Number((aAppTemp[nCount].PktBytes / nKb).toFixed(2)) + "(KB)"

                                }
                                if(nMb<=aAppTemp[nCount].PktBytes && aAppTemp[nCount].PktBytes<nGb)
                                {
                                    aAppTemp[nCount].PktBytes = Number((aAppTemp[nCount].PktBytes/nMb).toFixed(2))+"(MB)"

                                }
                                if(nGb<=aAppTemp[nCount].PktBytes && aAppTemp[nCount].PktBytes<nTb)
                                {
                                    aAppTemp[nCount].PktBytes = Number((aAppTemp[nCount].PktBytes/nGb).toFixed(2))+"(GB)"

                                }
                                if(nTb<=aAppTemp[nCount].PktBytes )
                                {
                                    aAppTemp[nCount].PktBytes = Number((aAppTemp[nCount].PktBytes/nTb).toFixed(2))+"(TB)"

                                }

                                if (aAppTemp[nCount].DownPktBytes < nKb) {
                                    aAppTemp[nCount].DownPktBytes = Number(aAppTemp[nCount].DownPktBytes) + "(Byte)"
                                }
                                if (nKb<=aAppTemp[nCount].DownPktBytes&&aAppTemp[nCount].DownPktBytes < nMb) {
                                    aAppTemp[nCount].DownPktBytes = Number((aAppTemp[nCount].DownPktBytes / nKb).toFixed(2)) + "(KB)"

                                }
                                if(nMb<=aAppTemp[nCount].DownPktBytes && aAppTemp[nCount].DownPktBytes<nGb)
                                {
                                    aAppTemp[nCount].DownPktBytes = Number((aAppTemp[nCount].DownPktBytes/nMb).toFixed(2))+"(MB)"

                                }
                                if(nGb<=aAppTemp[nCount].DownPktBytes && aAppTemp[nCount].DownPktBytes<nTb)
                                {
                                    aAppTemp[nCount].DownPktBytes = Number((aAppTemp[nCount].DownPktBytes/nGb).toFixed(2))+"(GB)"

                                }
                                if(nTb<=aAppTemp[nCount].DownPktBytes)
                                {
                                    aAppTemp[nCount].DownPktBytes = Number((aAppTemp[nCount].DownPktBytes/nTb).toFixed(2))+"(TB)"

                                }
                                nCount++;
                            }
                        }
                        $("#appList").SList("refresh", aAppTemp);
                    },
                    error: onAjaxErr
                });
            },
            error: onAjaxErr
        });
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
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init, 
        "destroy": _destroy, 
        "widgets": ["SList"],
        "utils":["Request","Msg"],
    });
})( jQuery );
