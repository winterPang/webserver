;(function ($) {
    var MODULE_NAME = "drs.userinfo";
    var LIST_NAME = "#userList";
    var g_sn = FrameInfo.ACSN;
    //var NC, MODULE_NC = "drs.NC";
    var g_Device,g_aUserSelects = [];
    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("user_infor_rc", sRcName);
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
    function initGrid ()
    {
        var opt = {
            showHeader: true,
            search:true,
            pageSize:12,
            colNames: getRcText ("USER_HEADE"),
            /*select:{id:"UserInfo",name:"UserInfo:", title: getRcText("USER_NAME"),"options": makeUserSelect, action:onSelectChange},*/
            colModel: [
                {name: "UserMAC", datatype: "Mac"},
                {name: "PktBytes", datatype: "Integer"},
                {name: "DownPktBytes", datatype: "Integer"},
                //{name: "Pkt", datatype: "Integer"},
                {name: "DropPktBytes", datatype: "Integer"},
                //{name: "DropPkt", datatype: "Integer"}

                // {name: "nPktDir",datatype:"Integer"}
            ]
        };
        $("#userList").SList ("head", opt);
    }

    function addzero(num)
    {
        var str;
        str =  num<10 ? ("0" + num): num;
        return str;
    }

    function initData()
    {
        var aUserTemp = [],nCount = 0;
        var sNowEndTime =  getTheDate("aweek","end");
        var sNowStart =  getTheDate("aweek","Start");
        var sStartTime = sNowStart;
        var sEnd =  sNowEndTime;
        var nStartTime = (new Date(sStartTime.Year,sStartTime.Month-1,sStartTime.Day).getTime())/1000;
        var nEndTime = (new Date(sEnd.Year,sEnd.Month-1,sEnd.Day,sEnd.Hour,sEnd.Minute,sEnd.Seconds).getTime())/1000;


        var aUserSelectsDown = [];
        var aUserSelects = [];

        var SendMsg = {
            url:MyConfig.path+"/ant/read_dpi_app",
            dataType: "json",
            type:"post",
            data:{
                Method:'GetInterfaces',
                Param: {
                    family:"0",
                    direct:"0",
                    ACSN:g_sn,
                    StartTime:nStartTime,
                    EndTime:nEndTime,

                },
                Return: [
                    "UserMAC",
                    "Pkt",
                    "PktBytes",
                    "DropPkt",
                    "DropPktBytes",
                ]

            },
            onSuccess:getMsgSuccess,
            onFailed:getMsgFail
        }
         Utils.Request.sendRequest(SendMsg);
        function getMsgSuccess(Data)
        {
             var aUserSelects = Data.message;
             var SendMsgDown = {
                url:MyConfig.path+"/ant/read_dpi_app",
                dataType: "json",
                type:"post",
                data:{
                    Method:'GetInterfaces',
                    Param: {
                        family:"0",
                        direct:"1",
                        ACSN:g_sn,
                        StartTime:nStartTime,
                        EndTime:nEndTime,

                    },
                    Return: [
                        "UserMAC",
                        "Pkt",
                        "PktBytes",
                        "DropPkt",
                        "DropPktBytes",
                    ] 
                },
                onSuccess:getMsgSuccessDown,
                onFailed:getMsgFailDown
             }
              Utils.Request.sendRequest(SendMsgDown);
                function getMsgSuccessDown(downData)
                {
                    var  aUserTemp = [],Ncount = 0;
                        var aUserNumber = [];
                        var aUserSelectsDown = downData.message;
                        for(var i = 0;i<aUserSelects.length;i++)
                        {
                            for(var j=i+1;j<aUserSelects.length;j++)
                            {
                                if((aUserSelects[i].UserMAC) == (aUserSelects[j].UserMAC))
                                {
                                    aUserSelects[i].PktBytes = Number(aUserSelects[i].PktBytes)+Number(aUserSelects[j].PktBytes);
                                    aUserSelects[i].DropPktBytes = Number(aUserSelects[i].DropPktBytes)+Number(aUserSelects[j].DropPktBytes);
                                    aUserSelects[i].DropPkt =Number(aUserSelects[i].DropPkt)+Number(aUserSelects[j].DropPkt);
                                    // aUserSelects.splice(j,1)
                                    aUserSelects[j].remove = 1;
                                }
                            }
                        }
                        for(var i =0;i<aUserSelects.length;i++)
                        {
                            if(aUserSelects[i].remove != 1)
                            {
                                aUserNumber.push(aUserSelects[i])
                            }
                        }
                        for(var i=0;i<aUserNumber.length;i++)
                        {
                            aUserNumber[i].DownPktBytes = 0;
                            for(var j=0;j<aUserSelectsDown.length;j++)
                            {
                                if(aUserNumber[i].UserMAC == aUserSelectsDown[j].UserMAC)
                                {
                                    aUserNumber[i].DownPktBytes += aUserSelectsDown[j].PktBytes;
                                    aUserNumber[i].DropPktBytes += aUserSelectsDown[j].DropPktBytes;
                                    aUserNumber[i].DropPkt += aUserSelectsDown[j].DropPkt;
                                    aUserSelectsDown[j].complete = true;
                                    // break;
                                }

                            }
                        }

                        for(var j=0;j<aUserSelectsDown.length;j++)
                        {
                            if(aUserSelectsDown[j].complete == true)
                            {
                                continue;
                            }
                            aUserNumber[i] = aUserSelectsDown[j];
                            aUserNumber[i].DownPktBytes = aUserSelectsDown[j].PktBytes;
                            aUserNumber[i].PktBytes = "0";
                            i++;

                        }
                        for(var i=0;i<aUserNumber.length;i++)
                        {
                            if(aUserNumber[i].DropPkt==0)
                            {
                                aUserNumber[i].DropPkt =  "0";
                            }
                        }
                        var nKb = 1024,nMb = 1024*nKb,nGb = 1024*nMb,nTb = 1024*nGb;
                        for(var i=0;i<aUserNumber.length;i++)
                        {
                            if((aUserNumber[i].PktBytes!=0)|| (aUserNumber[i].DownPktBytes!=0))
                            {
                                if((aUserNumber[i].PktBytes<0)||(aUserNumber[i].DownPktBytes<0))
                                {
                                    continue;
                                }
                                aUserTemp[nCount] = aUserNumber[i];
                                if((aUserTemp[nCount].PktBytes>0) || (aUserTemp[nCount].DownPktBytes>0)) {
                                    if (aUserTemp[nCount].PktBytes < nKb) {
                                        aUserTemp[nCount].PktBytes = Number(aUserTemp[nCount].PktBytes) + "(Byte)"
                                    }
                                    if (nKb<=aUserTemp[nCount].PktBytes&&aUserTemp[nCount].PktBytes < nMb) {
                                        aUserTemp[nCount].PktBytes = Number((aUserTemp[nCount].PktBytes / nKb).toFixed(2)) + "(KB)"

                                    }
                                    if (nMb <= aUserTemp[nCount].PktBytes && aUserTemp[nCount].PktBytes < nGb) {
                                        aUserTemp[nCount].PktBytes = Number((aUserTemp[nCount].PktBytes / nMb).toFixed(2)) + "(MB)"

                                    }
                                    if (nGb <= aUserTemp[nCount].PktBytes && aUserTemp[nCount].PktBytes < nTb) {
                                        aUserTemp[nCount].PktBytes = Number((aUserTemp[nCount].PktBytes / nGb).toFixed(2)) + "(GB)"

                                    }
                                    if (nTb <= aUserTemp[nCount].PktBytes) {
                                        aUserTemp[nCount].PktBytes = Number((aUserTemp[nCount].PktBytes / nTb).toFixed(2)) + "(TB)"

                                    }

                                    if (aUserTemp[nCount].DropPktBytes < nKb) {
                                        aUserTemp[nCount].DropPktBytes = Number(aUserTemp[nCount].DropPktBytes) + "(Byte)"
                                    }
                                    if (nKb<=aUserTemp[nCount].DropPktBytes&&aUserTemp[nCount].DropPktBytes < nMb) {
                                        aUserTemp[nCount].DropPktBytes = Number((aUserTemp[nCount].DropPktBytes / nKb).toFixed(2)) + "(KB)"

                                    }
                                    if (nMb<=aUserTemp[nCount].DropPktBytes&&aUserTemp[nCount].DropPktBytes < nGb) {
                                        aUserTemp[nCount].DropPktBytes = Number((aUserTemp[nCount].DropPktBytes / nMb).toFixed(2)) + "(MB)"

                                    }
                                    if (nGb <= aUserTemp[nCount].DropPktBytes && aUserTemp[nCount].DropPktBytes < nTb) {
                                        aUserTemp[nCount].DropPktBytes = Number((aUserTemp[nCount].DropPktBytes / nGb).toFixed(2)) + "(GB)"

                                    }
                                    if (nTb <= aUserTemp[nCount].DropPktBytes) {
                                        aUserTemp[nCount].DropPktBytes = Number((aUserTemp[nCount].DropPktBytes / nTb).toFixed(2)) + "(TB)"

                                    }

                                    if (aUserTemp[nCount].DownPktBytes < nKb) {
                                        aUserTemp[nCount].DownPktBytes = Number(aUserTemp[nCount].DownPktBytes) + "(Byte)"
                                    }
                                    if (nKb<=aUserTemp[nCount].DownPktBytes&&aUserTemp[nCount].DownPktBytes < nMb) {
                                        aUserTemp[nCount].DownPktBytes = Number((aUserTemp[nCount].DownPktBytes / nKb).toFixed(2)) + "(KB)"

                                    }
                                    if (nMb <= aUserTemp[nCount].DownPktBytes && aUserTemp[nCount].DownPktBytes < nGb) {
                                        aUserTemp[nCount].DownPktBytes = Number((aUserTemp[nCount].DownPktBytes / nMb).toFixed(2)) + "(MB)"

                                    }
                                    if (nGb <= aUserTemp[nCount].DownPktBytes && aUserTemp[nCount].DownPktBytes < nTb) {
                                        aUserTemp[nCount].DownPktBytes = Number((aUserTemp[nCount].DownPktBytes / nGb).toFixed(2)) + "(GB)"

                                    }
                                    if (nTb <= aUserTemp[nCount].DownPktBytes) {
                                        aUserTemp[nCount].DownPktBytes = Number((aUserTemp[nCount].DownPktBytes / nTb).toFixed(2)) + "(TB)"

                                    }
                                    nCount++;
                                }
                            }
                        }

                        $("#userList").SList("refresh", aUserTemp);
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
        "utils":["Request","Msg"],
    });
})( jQuery );
