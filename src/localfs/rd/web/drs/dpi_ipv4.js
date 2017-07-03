;(function ($) {
    var MODULE_BASE = "drs";
    var MODULE_NAME = MODULE_BASE + ".dpi_ipv4";
     /*   MODULE_NC = MODULE_BASE + ".NC",
        NC;*/
    var g_aUserUp,g_aUserDown,g_jForm,g_nCount=0;
    var g_aWeekUserDown = [];
    var g_aWeekUserUP  = [];
    var g_aAweekUrl = [],g_aAweekWelcomApp = [];
    var g_aDownInterfaces = [],g_aUpInterfaces=[],g_AweekaDownInterfaces = [],g_AweekaUpInterfaces = [];
    var g_AweekUserApp = [];
    var g_aweekUrl = [];
    var g_aAweekUserApp = []; 
    var g_aAweekpieUrl =[];

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("dpi_monitor_rc", sRcName);
    }
    //获取时间函数
    function getTheDate(str1,str2,nCount)
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
              var sNowEndTime = nYear + "-" + addzero(nMonth) + "-" + addzero(nDay) + "T" +addzero(nHour) +":"+addzero(nMinute)+":"+addzero(nSeconds);
              return sNowEndTime;
            }
            if(str2 =="Start")
            {
              var sNowStart = nYear + "-" + addzero(nMonth) + "-" + addzero(nDay) + "T" +"00:00:00";
              return sNowStart;
            }
        } 
        if(str1=="aweek")
        {
            if(str2=="end")
            { 
                if(nDay>=nCount) 
                { 
                    var sEndTime = nYear + "-" + addzero(nMonth) + "-" + addzero(nDay-nCount) + "T" + "23:59:59"
                }
                if(nDay<nCount)
                {
                    switch(nMonth)
                    {

                        case 1:
                            sStartTime = nYear-1 + "-" + 12 + "-" + addzero(nDay+31-nCount) + "T" +"23:59:59";
                            break;
                        case 2: 
                        case 4: 
                        case 6: 
                        case 9: 
                        case 11: 
                            sStartTime = nYear + "-" + addzero(nMonth-1) + "-" + addzero(nDay+31-nCount) + "T" +"23:59:59";
                            break;
                        case 3:
                           if(nYear%4!=0)
                            sStartTime = nYear + "-" +  addzero(nMonth-1) + "-" + addzero(nDay+29-nCount) + "T" +"23:59:59";
                           else
                            sStartTime = nYear + "-" +  addzero(nMonth-1) + "-" + addzero(nDay+28-nCount) + "T" +"23:59:59";
                           break;
                        case 5:
                        case 7:
                        case 8:
                        case 10:
                        case 12:
                            sStartTime = nYear + "-" + addzero(nMonth-1) + "-" + addzero(nDay+30-nCount) + "T" +"23:59:59";
                            break;
                    }
                }
              return sEndTime;
            }
            if(str2=="Start")
            { 
                if(nDay>=nCount) 
                { 
                    var sStartTime = nYear + "-" + addzero(nMonth) + "-" + addzero(nDay-nCount) + "T" + "00:00:00"
                }
                if(nDay<nCount)
                {
                    switch(nMonth)
                    {

                        case 1:
                            sStartTime = nYear-1 + "-" + 12 + "-" + addzero(nDay+31-nCount) + "T" +"00:00:00";
                            break;
                        case 2: 
                        case 4: 
                        case 6: 
                        case 9: 
                        case 11: 
                            sStartTime = nYear + "-" + addzero(nMonth-1) + "-" + addzero(nDay+31-nCount) + "T" +"00:00:00";
                            break;
                        case 3:
                           if(nYear%4!=0)
                            sStartTime = nYear + "-" +  addzero(nMonth-1) + "-" + addzero(nDay+29-nCount) + "T" +"00:00:00";
                           else
                            sStartTime = nYear + "-" +  addzero(nMonth-1) + "-" + addzero(nDay+28-nCount) + "T" +"00:00:00";
                           break;
                        case 5:
                        case 7:
                        case 8:
                        case 10:
                        case 12:
                            sStartTime = nYear + "-" + addzero(nMonth-1) + "-" + addzero(nDay+30-nCount) + "T" +"00:00:00";
                            break;
                    }
                }
              return sStartTime;
            }
        } 
    }
    function addzero(num)
    {
        var str;
        str =  num<10 ? ("0" + num): num;
        return str;
    }
    
    function searchnum(aData)
    {
        var aData = aData || [];
        var oPkts = {};
        var oBytes = {};
        var aMac = [];
        var nSum = 0;
        var aProportion = [];
        var PktBytes = [];
        var aUserId = []; 
        var aRetUserId = [];
            $.each(aData, function(i, oData){
                    oData.PktCnts = Number(oData.PktCnts);
                    oData.PktBytes = Number(oData.PktBytes);
                    var num = oPkts[oData.UserId];
                    var num1 = oBytes[oData.UserId];
                    oPkts[oData.UserId] = num ? num+oData.PktCnts : oData.PktCnts;
                    oBytes[oData.UserId] = num1 ? num1+oData.PktBytes : oData.PktBytes;
              
            });
            for(var key in oPkts)
            {
                aUserId.push({UserId: key, PktCnts: oPkts[key], PktBytes:oBytes[key]}); 
            }

            for(i=0;i<aUserId.length-1;i++)
            {
                for(j=i+1;j<aUserId.length;j++)
                {
                    if(aUserId[j].PktBytes>aUserId[i].PktBytes)
                    {
                        var temp = aUserId[j];
                        aUserId[j] = aUserId[i];
                        aUserId[i] = temp;
                    }
                }
            }
            for(var j=0;j<aUserId.length;j++)
            { 
                nSum += aUserId[j].PktBytes;
            }
            aUserId = (aUserId.length>5) ? aUserId.splice(0,5):aUserId; //将前十个个数字放入aUserId中；
            
            for(i=0;i<aUserId.length;i++)
            {
                if(nSum==0)
                {
                    aUserId[i].Proportion = 0+"%";
                    aUserId[i].PktBytes = "0";
                    aUserId[i].PktCnts = "0";
                }
                else
                {
                 var nPercent = ((aUserId[i].PktBytes/nSum)*100).toFixed(2);
                 aUserId[i].Proportion = nPercent+"%";
                }

            }
            for(var i=0;i<aUserId.length;i++)
            {
                aUserId[i].PktBytes = Number((aUserId[i].PktBytes/1024).toFixed(2));
            }
           
        return aUserId;
    }
    
    function spisearch(aDownData,aUpData)
    {
        var aUpData = aUpData || [];
        var aDownData = aDownData || [];
        var oPktsUp = {};
        var oBytesUp = {};
        var oPktsDown = {};
        var oBytesDown = {};
        var aMac = [];
        var nSum = 0;
        var aProportion = [];
        var PktBytes = [];
        var aUserId = [];
        var  aUserDownId = [];
        var aUserUpId = [];
        var aRetUserId = [];
            $.each(aDownData, function(i, oData1){ 
                    oData1.PktCnts = Number(oData1.PktCnts);
                    oData1.PktBytes = Number(oData1.PktBytes);
                    var num = oPktsDown[oData1.InterfaceName];
                    var num1 = oBytesDown[oData1.InterfaceName];
                    oPktsDown[oData1.InterfaceName] = num? num+oData1.PktCnts : oData1.PktCnts;
                    oBytesDown[oData1.InterfaceName] = num1 ? num1+oData1.PktBytes : oData1.PktBytes;
              
            });
             $.each(aUpData, function(i, oData){
                    oData.PktCnts = Number(oData.PktCnts);
                    oData.PktBytes = Number(oData.PktBytes);
                    var num = oPktsUp[oData.InterfaceName];
                    var num1 = oBytesUp[oData.InterfaceName];
                    oPktsUp[oData.InterfaceName] = num ? num+oData.PktCnts : oData.PktCnts;
                    oBytesUp[oData.InterfaceName] = num1 ? num1+oData.PktBytes : oData.PktBytes;
              
            });
            for(var key in oPktsDown)
            {
                aUserDownId.push({InterfaceName: key, PktCnts: oPktsDown[key], PktBytes:oBytesDown[key]}); 
            }
            for(var key in oPktsUp)
            {
                aUserUpId.push({InterfaceName: key, PktCnts: oPktsUp[key], PktBytes:oBytesUp[key]}); 
            }
          
            if(aUserDownId.length>=aUserUpId.length)
            {
                for(var i=0;i<aUserDownId.length;i++)
                {
                    for(var j=0;j<aUserUpId.length;j++)
                    {
                        if(aUserDownId[i].InterfaceName==aUserUpId[j].InterfaceName)
                        {
                            aUserDownId[i].PktCnts+=aUserUpId[j].PktCnts;
                            aUserDownId[i].PktBytes+=aUserUpId[j].PktBytes;
                        }
                    }
                    aUserId.push({InterfaceName:aUserDownId[i].InterfaceName,PktCnts:aUserDownId[i].PktCnts,PktBytes:aUserDownId[i].PktBytes});
                }
            }
            if(aUserDownId.length<aUserUpId.length)
            {
                for(var i=0;i<aUserUpId.length;i++)
                {
                    for(var j=0;j<aUserDownId.length;j++)
                    {
                        if(aUserUpId[i].InterfaceName==aUserDownId[j].InterfaceName)
                        {
                            aUserUpId[i].PktCnts+=aUserDownId[j].PktCnts;
                            aUserUpId[i].PktBytes+=aUserDownId[j].PktBytes;
                        }
                    }
                   aUserId.push({InterfaceName:aUserUpId[i].InterfaceName,PktCnts:aUserUpId[i].PktCnts,PktBytes:aUserUpId[i].PktBytes});
                }
                 
            }
            for(i=0;i<aUserId.length-1;i++)
            {
                for(j=i+1;j<aUserId.length;j++)
                {
                    if(aUserId[j].PktBytes>aUserId[i].PktBytes)
                    {
                        var temp = aUserId[j];
                        aUserId[j] = aUserId[i];
                        aUserId[i] = temp;
                    }
                } 
            }
            for(var j=0;j<aUserId.length;j++)
            {
                nSum+=aUserId[j].PktBytes;
            }

            aUserId = (aUserId.length>10) ? aUserId.splice(0,5):aUserId; //将前十个个数字放入aUserId中；
            
            for(i=0;i<aUserId.length;i++)
            {
                if(nSum==0)
                {
                    aUserId[i].Proportion = 0+"%";
                    aUserId[i].PktBytes = "0";
                    aUserId[i].PktCnts = "0";
                }
                else
                {
                 var nPercent = ((aUserId[i].PktBytes/nSum)*100).toFixed(2);
                 aUserId[i].Proportion = nPercent+"%";
                }

            }
            for(var i=0;i<aUserId.length;i++)
            {
                aUserId[i].PktBytes = Number((aUserId[i].PktBytes/1024).toFixed(2));
            }
        return aUserId;
    }
    //用户流量一周数据处理
    /*function initAweekUserFlow(nPktDir,sStartTime,sEnd)
    {
        function myCallback (oInfos)
        { 
            var aUserInterfaces = Utils.Request.getTableRows (NC.UserInterfaces, oInfos) || [];
            var aUser = Utils.Request.getTableRows (NC.Users, oInfos) || [];
            var nLenght = g_AweekUserApp.length;
            for(var i=0;i<aUserInterfaces.length;i++)
            {
                g_AweekUserApp[nLenght+i] = aUserInterfaces[i];
            }
            g_nCount++
            if(g_nCount==7)
            {
                g_nCount=0;
                var aUserFlow = searchnum(g_AweekUserApp);
                g_AweekUserApp.splice(0);
                for(var i=0;i<aUserFlow.length;i++)
                {
                    for(var j=0;j<aUser.length;j++)
                    {
                        if(aUserFlow[i].UserId==aUser[j].UserId)
                        {
                            aUserFlow[i].UserMac=aUser[j].UserMac;
                            break;
                        }
                    }
                }
                $("#FlowUpDatail_list").SList("refresh",aUserFlow);

            }
        }
        var aRequest = []; 
        var nPktDir = nPktDir;
        var nIpType = "0"; 
        var oUserSelects = Utils.Request.getTableInstance (NC.UserInterfaces);
        var oUser = Utils.Request.getTableInstance (NC.Users);
        oUserSelects.addFilter({StartTime:sStartTime,EndTime:sEnd, PktDir: nPktDir, AddressType:nIpType});
        oUser.addFilter({AddressType:nIpType});
        aRequest.push(oUserSelects,oUser);
        Utils.Request.getBulk (aRequest, myCallback);
    }*/
    //用户流量数据处理
    function initUserFlow(nPktDir,sStartTime,sEnd)
    {
        $.ajax({
            url:getDynUrl("initUserFlow.json"),
            dataType: "json",
            type:"get",
            success: function (data)
            {
                $("#FlowUpDatail_list").SList("refresh",data.aUserFlow);
            },
            error: onAjaxErr
        });

    /*   function myCallback (oInfos)
        { 
            var aUserInterface = Utils.Request.getTableRows (NC.UserInterfaces, oInfos) || [];
            var aUser = Utils.Request.getTableRows (NC.Users, oInfos) || [];
            var aUserFlow = searchnum(aUserInterface);
            for(var i=0;i<aUserFlow.length;i++)
            {
                for(var j=0;j<aUser.length;j++)
                {
                    if(aUserFlow[i].UserId==aUser[j].UserId)
                    {
                        aUserFlow[i].UserMac=aUser[j].UserMac;
                        break;
                    }
                }
            }
            $("#FlowUpDatail_list").SList("refresh",aUserFlow);
        }
        var aRequest = [];   
        var sNowEndTime =  getTheDate("one","end");
        var sNowStart =  getTheDate("one","Start");
        var sStartTime = sStartTime || sNowStart;
        var sEnd = sEnd || sNowEndTime;
        var nPktDir = nPktDir||"0";
        var nIpType = "0";
        var bFlg = false;
        var oUserSelects = Utils.Request.getTableInstance (NC.UserInterfaces);
        var oUser = Utils.Request.getTableInstance (NC.Users);
        oUserSelects.addFilter({StartTime:sStartTime,EndTime:sEnd, PktDir: nPktDir, AddressType:nIpType});
        oUser.addFilter({AddressType:nIpType});
        aRequest.push(oUserSelects,oUser);
        Utils.Request.getBulk (aRequest, myCallback);*/
    }

   //流量饼图option、
    function TotalFlowPie(aUserUp,aUserDown)
    {    
        var nFlowNum=0,nFlowUpNum=0,nFlowDownNum=0,nUpCnts=0,nDownCnts=0;
        var nDropFlowNum=0,nDropUpFlowNum=0,nDropDownFlowNum=0,nDropUpCnts=0,nDropDownCnts=0;
        for(var i=0;i<aUserUp.length;i++)
            { 
                nFlowUpNum+=Number(aUserUp[i].PktBytes);
                nDropUpFlowNum+=Number(aUserUp[i].PktDropBytes); 
            }
            for(var j=0;j<aUserDown.length;j++)
            { 
                nFlowDownNum+=Number(aUserDown[j].PktBytes);
                nDropDownFlowNum+=Number(aUserDown[j].PktDropBytes);
            }
            nFlowUpNum = (nFlowUpNum/1024).toFixed(2);
            nFlowDownNum = (nFlowDownNum/1024).toFixed(2);
            nFlowNum=Number(nFlowUpNum)+Number(nFlowDownNum);
            nDropFlowNum=nDropUpFlowNum+nDropDownFlowNum;
            nDropFlowNum = (nDropFlowNum/1024).toFixed(2);
            
        var Upoption = {
            height:200, 
            tooltip : {
                trigger: 'item',
                formatter: "{a} {b}: {d}%"
            }, 
            legend: {
                orient : 'vertical',
                x :20,
                data: [getRcText("UPNAME"),getRcText("DROPFLOW"),getRcText("DOWNNAME")],
            }, 
            calculable : false,
            series : [
                {
                    type:'pie',
                    radius : 80,
                    center: ['55%', '50%'],
                   // roseType : 'radius',
                    itemStyle: {
                         normal: {
                            labelLine:{
                                show:false
                            },
                            label:
                            {
                                position:"inner",
                                formatter: function(a,b,c,d){
                                    return Math.round(d)+"%";
                                }
                            }
                        } 
                    },
                    data: [
                            {value:nFlowUpNum, name:getRcText("UPNAME")},
                            {value:nDropFlowNum, name:getRcText("DROPFLOW")},
                            {value:nFlowDownNum,name:getRcText("DOWNNAME")}
                            
                        ]
                }
            ]
        }; 
        var oTheme={
                color: ['#0096d6','#31A9DC','#7BC7E7']
        }; 
        $("#totalflowup").echart("init", Upoption,oTheme);
        $("#upflow").html(nFlowUpNum+" KB");
        $("#downflow").html(nFlowDownNum+" KB");
        $("#dropFlow").html(nDropFlowNum+" KB");
        $("#TotalFlow").html(nFlowNum+" KB"); 
    }
    //接口流量一周数据处理
   /* function Aweekinterfaces(sStartTime,sEnd)
    {
         function myCallback (oInfos)
        {
            function SecondCb(oSecondInfos)
            {
                 
                g_aDownInterfaces = Utils.Request.getTableRows (NC.UserInterfaces, oSecondInfos) || [];   
                var nUplength = g_AweekaUpInterfaces.length;
                var nDownlength = g_AweekaDownInterfaces.length;
                for(var i=0;i<g_aUpInterfaces.length;i++)
                {
                    g_AweekaUpInterfaces[nUplength+i] = g_aUpInterfaces[i];
                }
                for(var j=0;j<g_aDownInterfaces.length;j++)
                {
                    g_AweekaDownInterfaces[nDownlength+j] = g_aDownInterfaces[j];
                }
                g_nCount++;
                if(g_nCount==7)
                {   g_nCount=0;
                    var SpiName = spisearch(g_AweekaDownInterfaces, g_AweekaUpInterfaces);
                    g_AweekaDownInterfaces.splice(0);
                    g_AweekaUpInterfaces.splice(0);
                    $("#SpiFlow_list").SList("refresh",SpiName);
                }
            }  
            var aRequest1 = [];
            var g_aUpInterfaces = Utils.Request.getTableRows (NC.UserInterfaces, oInfos) || [];
            var oInterfaces  = Utils.Request.getTableInstance (NC.UserInterfaces);
            oInterfaces.addFilter({StartTime:sStartTime,EndTime:sEnd, PktDir: "1", AddressType:nIpType});
            aRequest1.push(oInterfaces);
            Utils.Request.getBulk (aRequest1, SecondCb);
          
            
        }
        var aRequest = [];  
        var nIpType = "0";  
        var nPktDir = "0";   
        var oInterfaces = Utils.Request.getTableInstance (NC.UserInterfaces);
        oInterfaces.addFilter({StartTime:sStartTime,EndTime:sEnd, AddressType:nIpType, PktDir: nPktDir});
        aRequest.push(oInterfaces);
        Utils.Request.getBulk (aRequest, myCallback);
    }*/
    //接口流量数据处理
    function interfaces(sStartTime,sEnd,nPktDir)
    {
        $.ajax({
            url:getDynUrl("interfaces.json"),
            dataType: "json",
            type:"get",
            success: function (data)
            {

                $("#SpiFlow_list").SList("refresh",data.SpiName);
            },
            error: onAjaxErr
        });
       /* function myCallback (oInfos)
        {
            function SecondCb(oSecondInfos)
            {
                if(nPktDir == "0")
                {  
                    aDownInterfaces = Utils.Request.getTableRows (NC.UserInterfaces, oSecondInfos) || [];   
                }
                else
                {
                   aUpInterfaces = Utils.Request.getTableRows (NC.UserInterfaces, oSecondInfos) || [];    
                }
                var SpiName = spisearch(aDownInterfaces, aUpInterfaces);
                $("#SpiFlow_list").SList("refresh",SpiName);
            }
             
            var aRequest1 = [];
            if(nPktDir == "0")
            {       var aUpInterfaces = Utils.Request.getTableRows (NC.UserInterfaces, oInfos) || [];
                    var oInterfaces  = Utils.Request.getTableInstance (NC.UserInterfaces);
                    oInterfaces.addFilter({StartTime:sStartTime,EndTime:sEnd, PktDir: "1", AddressType:nIpType});
                    aRequest1.push(oInterfaces);
                    Utils.Request.getBulk (aRequest1, SecondCb);
                
            }
            else
            {
                if(!bFlg)
                {
                    var aDownInterfaces = Utils.Request.getTableRows (NC.UserInterfaces, oInfos) || [];
                    var oInterfaces  = Utils.Request.getTableInstance (NC.UserInterfaces);
                    oInterfaces.addFilter({StartTime:sStartTime,EndTime:sEnd, PktDir: "0", AddressType:nIpType});  
                    aRequest1.push(oInterfaces);
                    Utils.Request.getBulk (Request1, SecondCb);
                }  
            }
        }
        var aRequest = [];   
        var sNowEndTime =  getTheDate("one","end");
        var sNowStart =  getTheDate("one","Start");
        var sStartTime = sStartTime || sNowStart;
        var sEnd = sEnd || sNowEndTime;
        var nIpType = nIpType || "0";
        var bFlg = false;
        if(nPktDir)
        {
            var nPktDir = nPktDir;
           
        }
        else
        {
            var nPktDir = "0";     
        }
        var oInterfaces = Utils.Request.getTableInstance (NC.UserInterfaces);
        oInterfaces.addFilter({StartTime:sStartTime,EndTime:sEnd, AddressType:nIpType, PktDir: nPktDir});
        aRequest.push(oInterfaces);
        Utils.Request.getBulk (aRequest, myCallback);*/
    }    
   //上网人次折线图的数据处理
    /*function initUserNumber_Chaet()
    {
         function myCallback (oInfos)
        {
            var aUserNumber = Utils.Request.getTableRows (NC.UserInterfaces, oInfos) || [];
            var aUserNumData = []; 
            for(var i=0;i<=nHour;i++)
            {
                aTime[i]=addzero(i)+":"+"00";
                aUserNumData[i]=0;
            }
            for(var i=0;i<aUserNumber.length;i++)
            {
                var nNumStart = Number(aUserNumber[i].StartTime.slice(11,13))
                var nNumEnd = Number(aUserNumber[i].EndTime.slice(11,13))
               for(var j=0;j<aTime.length;j++)
               {
                    var nTime = Number(aTime[j].slice(0,2));
                    if((nTime>=nNumStart)&&(nTime<=nNumEnd))
                    {
                        if(i==0)
                        {
                           aUserNumData[j]++; 
                        }
                        for(var k=0;k<i;k++)
                        {
                            var nNumStart = Number(aUserNumber[i].StartTime.slice(11,13))
                            var nNumEnd = Number(aUserNumber[i].EndTime.slice(11,13))
                            if((nTime>=nNumStart)&&(nTime<=nNumEnd))
                            {
                                if(aUserNumber[i].UserId==aUserNumber[k].UserId)
                                {
                                    break; 
                                }
                                if((k==(i-1))&&(aUserNumber[i].UserId!=aUserNumber[k].UserId))
                                {
                                    aUserNumData[j]++;
                                }
                            }
                        }
                        
                    }
                    
                }
            } 
            initUserChange(aTime,aUserNumData);
        }
        var aRequest = []; 
        var aTime = [];
        var tNow = new Date();
        var nHour = tNow.getHours();  
        var sNowEndTime =  getTheDate("one","end");
        var sNowStart =  getTheDate("one","Start");
        var sStartTime = sStartTime || sNowStart;
        var sEnd = sEnd || sNowEndTime;
        var nIpType = nIpType || "0";
        var nPktDir = "0";
        var oInterfaces = Utils.Request.getTableInstance (NC.UserInterfaces);
        oInterfaces.addFilter({StartTime:sStartTime,EndTime:sEnd, AddressType:nIpType, PktDir: nPktDir});
        aRequest.push(oInterfaces);
        Utils.Request.getBulk (aRequest, myCallback);
    }*/

   /* function InitUserSpi(nPktDir,sStartTime, sEnd)
    {
         function myCallback (oInfos)
        {
            function SecondCb(oSecondInfos)
            { 
                aDownInterfaces = Utils.Request.getTableRows (NC.UserInterfaces, oSecondInfos) || [];
                $("#UserDownSpi_list").SList("refresh",aDownInterfaces);
                
               
            } 
            //var aStream = getRcText("STREAM").split(",");
            var aRequest1 = [];
            if(nPktDir == "0")
            {
                var aUpInterfaces = Utils.Request.getTableRows (NC.UserInterfaces, oInfos) || [];
                $("#UserSpi_list").SList("refresh",aUpInterfaces); 
                if(!bFlg)
                {
                    var oInterfaces  = Utils.Request.getTableInstance (NC.UserInterfaces);
                    oInterfaces.addFilter({StartTime:sStartTime,EndTime:sEnd,PktDir: "1", AddressType:nIpType});  
                    aRequest1.push(oInterfaces);
                    Utils.Request.getBulk (aRequest1, SecondCb);
                }
            }
            if(nPktDir=="1")
            {
                var aDownInterfaces = Utils.Request.getTableRows (NC.UserInterfaces, oInfos) || [];
                $("#UserDownSpi_list").SList("refresh",aDownInterfaces);    
            }
        }
        var aRequest = [];   
        var sNowEndTime =  getTheDate("one","end");
        var sNowStart =  getTheDate("one","Start");
        var sStartTime = sStartTime || sNowStart;
        var sEnd = sEnd || sNowEndTime;
        var nIpType = nIpType || "0";
        var bFlg = false;
        if(nPktDir)
        {
            var nPktDir = nPktDir;
            bFlg = !bFlg;
        }
        else
        {
            var nPktDir = "0";
        }
        var oInterfaces = Utils.Request.getTableInstance (NC.UserInterfaces);
        oInterfaces.addFilter({StartTime:sStartTime,EndTime:sEnd, AddressType:nIpType, PktDir: nPktDir});
        aRequest.push(oInterfaces);
        Utils.Request.getBulk (aRequest, myCallback);
    }*/
     //流量饼图一周的数据处理
    /*function initAweekUser(sStartTime,sEnd)
    {

        function myCallback (oInfos)
        {
            function SecondCb(oSecondInfos)
            {
                if(nPktDir == "0")
                { 
                   g_aUserDown = Utils.Request.getTableRows (NC.UserInterfaces, oSecondInfos) || []; 
                }
                else
                {
                    g_aUserUp = Utils.Request.getTableRows (NC.UserInterfaces, oSecondInfos) || [];  
                }
                var nUplength = g_aWeekUserUP.length;
                var nDownlength = g_aWeekUserDown.length;
                for(var i=0;i<g_aUserDown.length;i++)
                { 
                    g_aWeekUserDown[nDownlength+i] = g_aUserDown[i]; 
                }
                for(var j=0;j<g_aUserUp.length;j++)
                {
                    g_aWeekUserUP[nUplength+j] = g_aUserUp[j]; 
                }
                g_nCount++;
                if(g_nCount==7)
                {   g_nCount = 0; 
                    TotalFlowPie(g_aWeekUserUP,g_aWeekUserDown);
                    g_aWeekUserUP.splice(0);
                    g_aWeekUserDown.splice(0);
                }
            }
            var aRequest1 = [];
            if(nPktDir == "0")
            {
                g_aUserUp = Utils.Request.getTableRows (NC.UserInterfaces, oInfos) || [];
                var oUserSelects = Utils.Request.getTableInstance (NC.UserInterfaces);
                oUserSelects.addFilter({StartTime:sStartTime,EndTime:sEnd, PktDir: "1", AddressType:"0"});
                aRequest1.push(oUserSelects);
                Utils.Request.getBulk (aRequest1, SecondCb); 
            }
            if(nPktDir=="1")
            {
                g_aUserDown = Utils.Request.getTableRows (NC.UserInterfaces, oInfos) || [];
                var oUserSelects = Utils.Request.getTableInstance (NC.UserInterfaces);
                oUserSelects.addFilter({StartTime:sStartTime,EndTime:sEnd, PktDir: "0", AddressType:"0"});
                aRequest1.push(oUserSelects);
                Utils.Request.getBulk (Request1, SecondCb);
            }
        }
        var aRequest = [];  
        var nPktDir = nPktDir||"0";
        var oUserSelects = Utils.Request.getTableInstance (NC.UserInterfaces);
        oUserSelects.addFilter({StartTime:sStartTime,EndTime:sEnd, PktDir: nPktDir, AddressType:"0"});
        aRequest.push(oUserSelects);
        Utils.Request.getBulk (aRequest, myCallback);
    }*/
    //流量饼图的数据处理
    function initUser(sStartTime,sEnd)
    {
        $.ajax({
            url:getDynUrl("initUser.json"),
            dataType: "json",
            type:"get",
            success: function (data)
            {
                g_aUserUp=data.g_aUserUp;
                g_aUserDown=data.g_aUserDown;
                TotalFlowPie(g_aUserUp,g_aUserDown);
            },
            error: onAjaxErr
        });
        /*function myCallback (oInfos)
        {
            function SecondCb(oSecondInfos)
            {
                if(nPktDir == "0") 
                { 
                   g_aUserDown = Utils.Request.getTableRows (NC.UserInterfaces, oSecondInfos) || []; 
                }
                else
                {
                    g_aUserUp = Utils.Request.getTableRows (NC.UserInterfaces, oSecondInfos) || [];  
                }
                TotalFlowPie(g_aUserUp,g_aUserDown);
            }
            var aRequest1 = [];
            if(nPktDir == "0")
            {
                g_aUserUp = Utils.Request.getTableRows (NC.UserInterfaces, oInfos) || [];
                var oUserSelects = Utils.Request.getTableInstance (NC.UserInterfaces);
                oUserSelects.addFilter({StartTime:sStartTime,EndTime:sEnd, PktDir: "1", AddressType:"0"});
                aRequest1.push(oUserSelects);
                Utils.Request.getBulk (aRequest1, SecondCb); 
            }
            if(nPktDir=="1")
            {
                g_aUserDown = Utils.Request.getTableRows (NC.UserInterfaces, oInfos) || [];
                var oUserSelects = Utils.Request.getTableInstance (NC.UserInterfaces);
                oUserSelects.addFilter({StartTime:sStartTime,EndTime:sEnd, PktDir: "0", AddressType:"0"});
                aRequest1.push(oUserSelects);
                Utils.Request.getBulk (Request1, SecondCb);
            }
        }
        var aRequest = [];   
        var sNowEndTime =  getTheDate("one","end");
        var sNowStart =  getTheDate("one","Start");
        var sStartTime = sStartTime || sNowStart;
        var sEnd = sEnd || sNowEndTime;
        var bFlg = false;
        var nPktDir = nPktDir||"0";
        var oUserSelects = Utils.Request.getTableInstance (NC.UserInterfaces);
        oUserSelects.addFilter({StartTime:sStartTime,EndTime:sEnd, PktDir: nPktDir, AddressType:"0"});
        aRequest.push(oUserSelects);
        Utils.Request.getBulk (aRequest, myCallback);*/
    }
    //上网人数折线图的option
    function initUserChange(aTime,aData)
    {
    var option = {
        //width:"100%",
        height:280,
        tooltip: {
            show: true,
            trigger: 'axis',
            axisPointer:{
                type : 'line',
                lineStyle : {
                  color: '#373737',
                  width: 1,
                  type: 'solid'
                }
            }
        },
        tooltip : {
            show: true,
            trigger: 'axis',
            axisPointer:{
                type : 'line',
                lineStyle : {
                  color: '#fff',
                  width: 0,
                  type: 'solid'
                }
            },
           
        },
        
        grid: {
            x:90,
            y:40,
           // x2:10,
            //y2:40,
            borderColor: '#FFF'
        },
        calculable: false,
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                splitLine:true,
                name:getRcText("SHOWTIME"),
                axisLine  : {
                    show:true,
                    lineStyle :{color: '#47495d', width: 1}
                },
                axisTick :{
                    show:false
                },
                data:aTime
            }
        ],

        yAxis: [
            {
                type: 'value',
                name:getRcText("REN"),
                axisLabel: {
                    show: true,
                    textStyle:{color: '#47495d', width: 2} 
                },
                axisLine  : {
                    show:true,
                    lineStyle :{color: '#47495d', width: 1}
                }
            }
        ],
        series: [
            {
                symbol: "none", 
                type: 'line', 
                smooth: true,
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                name: getRcText("USAGENUM"),
                data: aData
            },
             
        ]

    };
    var oTheme = {
        color: ["rgba(0,150,214,0.5)","rgba(0,150,214,0.2)"],
        valueAxis:{
            splitLine:{lineStyle:{color:[ '#FFF']}},
            axisLabel:{textStyle: {color: [ '#abbbde']}}
        },
        categoryAxis:{
            splitLine:{lineStyle:{color:['#FFF']}}
        }
    };
    $("#userchange").echart("init", option, oTheme);
    }
    //最受欢迎的网站类别饼图的option
    function WecomUrls_pie(aData)
    {
         var option = {
          height:250,
            tooltip : {
                trigger: 'item',
                formatter: " {b}: {d}%"
            },
           legend: {
                orient : 'horizontal',
                x : 20,
                y : 190,
                
                data: aData
            },
            calculable : false,
            series : [
                {
                    type:'pie',
                    radius : 80,
                    center: ['45%', '35%'],
                    itemStyle: {
                        normal: {
                            labelLine:{
                                show:false
                            },
                            label:
                            {
                                position:"inner",
                                formatter: function(a,b,c,d){
                                    return Math.round(d)+"%";
                                }
                            }
                        }
                    },
                    data: aData
                }
            ]
        }; 
        var oTheme={
                color: ['#0096d6','#31A9DC','#62BCE2','#7BC7E7','#ACDAED','#C4E3F0','#DDEDF3']
        };
        $("#Url_pie").echart("init", option,oTheme);
    } 
    function SearchWeb(aData)
    {
        var aData = aData || [];
        var oCategoryName = {};
        var aCategoryName = []; 
        for(var i = 0; i < aData.length; i++)
        {
            var k = false;
            if(i == 0)
            {
                    aCategoryName.push({name:aData[i].CategoryName, value:1});                
            }
            else
            {
                for(var j = 0; j < aCategoryName.length; j++)
                {
                    if(aCategoryName[j].name == aData[i].CategoryName)
                    {
                        aCategoryName[j].value++;
                        k = true;
                        break;
                    }

                }
                if(k)
                {
                    k = false;
                }
                else
                {
                    aCategoryName.push({name:aData[i].CategoryName, value:1});
                }
            }
        }
        for(i=0;i<aCategoryName.length-1;i++)
        {
            for(j=i+1;j<aCategoryName.length;j++)
            {
                if(aCategoryName[j].value>aCategoryName[i].value)
                {
                    var temp = aCategoryName[j];
                    aCategoryName[j] = aCategoryName[i];
                    aCategoryName[i] = temp;
                }
            }
        }
        aCategoryName = (aCategoryName.length>5)?aCategoryName.splice(0,5):aCategoryName;
        return aCategoryName;
    }
    function SearchWelcomApp(aData)
    {
        var aData = aData || [];
        var aAppName = []; 
        for(var i = 0; i < aData.length; i++)
        {
            var k = false;
            if(i == 0)
            {
                    aAppName.push({AppName: aData[i].AppName,value:1});                
            }
            else
            {
                for(var j = 0; j < aAppName.length; j++)
                {
                    if(aAppName[j].AppName == aData[i].AppName)
                    {
                        aAppName[j].value++;
                        k = true;
                        break;
                    }

                }
                if(k)
                {
                    k = false;
                }
                else
                {
                    aAppName.push({AppName: aData[i].AppName,value:1});
                }
            }
        }
        for(i=0;i<aAppName.length-1;i++)
        {
            for(j=i+1;j<aAppName.length;j++)
            {
                if(aAppName[j].value>aAppName[i].value)
                {
                    var temp = aAppName[j];
                    aAppName[j] = aAppName[i];
                    aAppName[i] = temp;
                }
            }
        }
        aAppName = (aAppName.length>5)?aAppName.splice(0,5):aAppName;
        return aAppName;
    }
    function SearchApp(aData)
    {
        var aData = aData || [];
        var aAppCategory = []; 
        for(var i = 0; i < aData.length; i++)
        {
            var k = false;
            if(i == 0)
            {
                    aAppCategory.push({AppName: aData[i].AppName, name:aData[i].AppCategory, value:1});                
            }
            else
            {
                for(var j = 0; j < aAppCategory.length; j++)
                {
                    if(aAppCategory[j].name == aData[i].AppCategory)
                    {
                        aAppCategory[j].value++;
                        k = true;
                        break;
                    }

                }
                if(k)
                {
                    k = false;
                }
                else
                {
                    aAppCategory.push({AppName: aData[i].AppName,name:aData[i].AppCategory, value:1});
                }
            }
        }
        for(i=0;i<aAppCategory.length-1;i++)
        {
            for(j=i+1;j<aAppCategory.length;j++)
            {
                if(aAppCategory[j].value>aAppCategory[i].value)
                {
                    var temp = aAppCategory[j];
                    aAppCategory[j] = aAppCategory[i];
                    aAppCategory[i] = temp;
                }
            }
        }
        aAppCategory = (aAppCategory.length>5)?aAppCategory.splice(0,5):aAppCategory;
        return aAppCategory;
    }
    //最受欢迎的网站类别一周数据处理
    /*function initAweekpie_Url(sStartTime,sEnd)
    {
        function myCallback (oInfos)
        {   
            var aUrl = Utils.Request.getTableRows (NC.UserUrls, oInfos) || [];
            var nLenght = g_aAweekpieUrl.length;
            for(var i=0;i<aUrl.length;i++)
            {
               g_aAweekpieUrl[nLenght+i] = aUrl[i]; 
            }
            g_nCount++
            if(g_nCount==7)
            { 
                g_nCount=0;
                var aSearchWeb = SearchWeb(g_aAweekpieUrl);
                WecomUrls_pie(aSearchWeb); 
                g_aAweekpieUrl.splice(0);
            }  
        }
        var aRequest = [];      
        var nPktDir = "0";
        var nIpType = "0";
        var oUrls = Utils.Request.getTableInstance (NC.UserUrls);
        oUrls.addFilter({StartTime:sStartTime,EndTime:sEnd, AddressType:nIpType, PktDir: nPktDir});
        aRequest.push(oUrls);
        Utils.Request.getBulk (aRequest, myCallback);
    }*/
    //最受欢迎的网站类别数据处理  
    function initpie_Url(sStartTime,sEnd)
    {
        $.ajax({
            url:getDynUrl("initpie_Url.json"),
            dataType: "json",
            type:"get",
            success: function (data)
            {
                WecomUrls_pie(data.aSearchWeb);
            },
            error: onAjaxErr
        });

      /*  function myCallback (oInfos)
        {   
            var aUrl = Utils.Request.getTableRows (NC.UserUrls, oInfos) || [];
            var aSearchWeb = SearchWeb(aUrl);
            WecomUrls_pie(aSearchWeb);   
        }
        var aRequest = [];      
        var sNowEndTime =  getTheDate("one","end");
        var sNowStart = getTheDate("one","Start");
        var sEnd = sEnd || sNowEndTime;
        var sStartTime = sStartTime || sNowStart;
        var nPktDir = "0";
        var nIpType = "0";
        var oUrls = Utils.Request.getTableInstance (NC.UserUrls);
        oUrls.addFilter({StartTime:sStartTime,EndTime:sEnd, AddressType:nIpType, PktDir: nPktDir});
        aRequest.push(oUrls);
        Utils.Request.getBulk (aRequest, myCallback);*/
    }
    //网站统计一周数据处理
    /*function initAweekStatistics_URL(sStartTime,sEnd,nPktDir)
    {
        function myCallback (oInfos)
        {   
            var aUrl = Utils.Request.getTableRows (NC.UserUrls, oInfos) || [];
            var aUser = Utils.Request.getTableRows (NC.Users, oInfos) || [];
            var nLenght = g_aweekUrl.length;
            for(var i=0;i<aUrl.length;i++)
            {
                g_aweekUrl[nLenght+i] = aUrl[i];
            }
            g_nCount++
            if(g_nCount==7)
            {
                g_nCount=0;
                var aUrlFilter = g_aweekUrl.splice(0,8);
                g_aweekUrl.splice(0);
                for(var i=0;i<aUrlFilter.length;i++)
                {
                    for(var j=0;j<aUser.length;j++)
                    {
                        if(aUrlFilter[i].UserId==aUser[j].UserId)
                        {
                            aUrlFilter[i].UserMac = aUser[j].UserMac;
                            break;
                        }
                    }
                }
                for(var i=0;i<aUrlFilter.length;i++)
                {
                    var nHour, nMinute,nSeconds;
                    if(aUrlFilter[i].Time>=3600)
                    {
                        nHour =(aUrlFilter[i].Time/3600).toFixed(0);
                        var nTime = aUrlFilter[i].Time%3600;
                        if(nTime>=60)
                        {
                            nMinute = (nTime/60).toFixed(0);
                            nSeconds =(nTime)%60;
                            aUrlFilter[i].Time = nHour+":"+nMinute+":"+nSeconds; 
                        }
                        else
                        {
                            nSeconds =(nTime)%60;
                            aUrlFilter[i].Time = nHour+":"+"0"+":"+nSeconds;
                        }
                    }
                    else if(aUrlFilter[i].Time>=60)
                    {
                        nMinute = (aUrlFilter[i].Time/60).toFixed(0);
                        nSeconds = aUrlFilter[i].Time%60; 
                        aUrlFilter[i].Time = "0"+":"+nMinute+":"+nSeconds; 
                    }
                   else
                   {
                     aUrlFilter[i].Time = "0"+":"+"0"+":"+aUrlFilter[i].Time; 
                   }

                }
                $("#userUrl_list").SList("refresh",aUrlFilter);  
            }
        }
        var aRequest = [];      
        var nPktDir = nPktDir||"0";
        var nIpType = "0";
        var oUrls = Utils.Request.getTableInstance (NC.UserUrls);
        var oUsers = Utils.Request.getTableInstance (NC.Users);
        oUrls.addFilter({StartTime:sStartTime,EndTime:sEnd, AddressType:nIpType, PktDir: nPktDir});
        oUsers.addFilter({AddressType:nIpType});
        aRequest.push(oUrls,oUsers);
        Utils.Request.getBulk (aRequest, myCallback);
    }*/
    //网站统计数据处理
    function initStatistics_URL(sStartTime,sEnd,nPktDir)
    {

        $.ajax({
            url:getDynUrl("initStatistics_URL.json"),
            dataType: "json",
            type:"get",
            success: function (data)
            {
                $("#userUrl_list").SList("refresh",data.aUrlFilter);
            },
            error: onAjaxErr
        });
      /*  function myCallback (oInfos)
        {   
            var aUrl = Utils.Request.getTableRows (NC.UserUrls, oInfos) || [];
            var aUser = Utils.Request.getTableRows (NC.Users, oInfos) || [];
            var aUrlFilter = aUrl.splice(0,8);
            for(var i=0;i<aUrlFilter.length;i++)
            {
                for(var j=0;j<aUser.length;j++)
                {
                    if(aUrlFilter[i].UserId==aUser[j].UserId)
                    {
                        aUrlFilter[i].UserMac = aUser[j].UserMac;
                        break;
                    }
                }
            }
            for(var i=0;i<aUrlFilter.length;i++)
            {
                var nHour, nMinute,nSeconds;
                if(aUrlFilter[i].Time>=3600)
                {
                    nHour =(aUrlFilter[i].Time/3600).toFixed(0);
                    var nTime = aUrlFilter[i].Time%3600;
                    if(nTime>=60)
                    {
                        nMinute = (nTime/60).toFixed(0);
                        nSeconds =(nTime)%60;
                        aUrlFilter[i].Time = nHour+":"+nMinute+":"+nSeconds; 
                    }
                    else
                    {
                        nSeconds =(nTime)%60;
                        aUrlFilter[i].Time = nHour+":"+"0"+":"+nSeconds;
                    }
                }
                else if(aUrlFilter[i].Time>=60)
                {
                    nMinute = (aUrlFilter[i].Time/60).toFixed(0);
                    nSeconds = aUrlFilter[i].Time%60; 
                    aUrlFilter[i].Time = "0"+":"+nMinute+":"+nSeconds; 
                }
               else
               {
                 aUrlFilter[i].Time = "0"+":"+"0"+":"+aUrlFilter[i].Time; 
               }

            }
            $("#userUrl_list").SList("refresh",aUrlFilter);  
        }
        var aRequest = [];      
        var sNowEndTime =  getTheDate("one","end");
        var sNowStart = getTheDate("one","Start");
        var sEnd = sEnd || sNowEndTime;
        var sStartTime = sStartTime || sNowStart;
        var nPktDir = nPktDir||"0";
        var nIpType = "0";
        var oUrls = Utils.Request.getTableInstance (NC.UserUrls);
        var oUsers = Utils.Request.getTableInstance (NC.Users);
        oUrls.addFilter({StartTime:sStartTime,EndTime:sEnd, AddressType:nIpType, PktDir: nPktDir});
        oUsers.addFilter({AddressType:nIpType});
        aRequest.push(oUrls,oUsers);
        Utils.Request.getBulk (aRequest, myCallback);*/
    }
    //上网人次的折线图的option
    function initWebChange(aTime,aData)
    {
        var option = {
        //width:"100%",
        height:280,
        tooltip: {
            show: true,
            trigger: 'axis',
            axisPointer:{
                type : 'line',
                lineStyle : {
                  color: '#373737',
                  width: 1,
                  type: 'solid'
                }
            }
        },
        tooltip : {
            show: true,
            trigger: 'axis',
            axisPointer:{
                type : 'line',
                lineStyle : {
                  color: '#fff',
                  width: 0,
                  type: 'solid'
                }
            },
           
        },
        
        grid: {
            x: 90, y: 40,
            borderColor: '#FFF'
        },
        calculable: false,
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                splitLine:true,
                name: getRcText("SHOWTIME"),
                axisLine  : {
                    show:true,
                    lineStyle :{color: '#47495d', width: 1}
                },
                axisTick :{
                    show:false
                },
                data: aTime
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: getRcText("REN"),
                axisLabel: {
                    show: true,
                    textStyle:{color: '#47495d', width: 2} 
                },
                axisLine  : {
                    show:true,
                    lineStyle :{color: '#47495d', width: 1}
                }
            }
        ],
        series: [
            {
                symbol: "none", 
                type: 'line', 
                smooth: true,
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                name: getRcText("USAGENUM"),
                 
                data:aData
            },
             
        ]

    };
    var oTheme = {
        color: ["rgba(0,150,214,0.5)","rgba(0,150,214,0.2)"],
        valueAxis:{
            splitLine:{lineStyle:{color:[ '#FFF']}},
            axisLabel:{textStyle: {color: [ '#abbbde']}}
        },
        categoryAxis:{
            splitLine:{lineStyle:{color:['#FFF']}}
        }
        };
        $("#userchange_url").echart("init", option, oTheme);
    }
    //上网人次折线图的数据处理
    function initNum_UrlChart()
    {

        $.ajax({
            url:getDynUrl("initNum_UrlChart.json"),
            dataType: "json",
            type:"get",
            success: function (data)
            {
                var aTime=[];
                var aUserNum_url=[];

                for(var i =0;i<data.aTime.length;i++){
                    aTime.push(data.aTime[i].aTime);
                }
                for(var i =0;i<data.aUserNum_url.length;i++){
                    aUserNum_url.push(data.aUserNum_url[i].aUserNum_url);
                }

                initWebChange(aTime,aUserNum_url);
            },
            error: onAjaxErr
        });
        /*function myCallback (oInfos)
        {   var aUserNum_url=[];
            var aUrl = Utils.Request.getTableRows (NC.UserUrls, oInfos) || [];

          for(var i=0;i<=nHour;i++)
            {
                aTime[i]=addzero(i)+":"+"00";
            } 
            for(var i=0;i<aTime.length;i++)
            {
                aUserNum_url[i]=0;
            }
            for(var i=0;i<aUrl.length;i++)
            {
              var nNumStart = Number(aUrl[i].StartTime.slice(11,13))
              var nNumEnd = Number(aUrl[i].EndTime.slice(11,13))

              var nflag;
               for(var j=0;j<aTime.length;j++)
               {
                      var nTime = Number(aTime[j].slice(0,2));
                    if((nTime>=nNumStart)&&(nTime<=nNumEnd))
                    {
                        aUserNum_url[j]++;    
                    }
                    
                }
            }
            initWebChange(aTime,aUserNum_url);  
        }
         
        var aTime = [];
        var tNow = new Date();
        var nDay = tNow.getDate();
        var nHour = tNow.getHours();
        var nMinute = tNow.getMinutes();
        var aRequest = [];
        var sNowEndTime =  getTheDate("one","end");
        var sNowStart =  getTheDate("one","Start");      
        var sEnd = sEnd || sNowEndTime;
        var sStartTime = sStartTime || sNowStart;
        var nPktDir = "0";
        var nIpType = "0";   
        var oUrls = Utils.Request.getTableInstance (NC.UserUrls);
        oUrls.addFilter({StartTime:sStartTime,EndTime:sEnd, AddressType:nIpType, PktDir: nPktDir});
        aRequest.push(oUrls);
        Utils.Request.getBulk (aRequest, myCallback); */
    }


   //访问应用人次折线图的option
    function initAppChange(aTime,aData,aName,nLenght)
    {
        var oTheme_app = {
            color: ['#0096d6','#31A9DC','#62BCE2','#7BC7E7','#ACDAED','#C4E3F0','#DDEDF3'], 
            valueAxis:{
                splitLine:{lineStyle:{color:[ '#FFF']}},
                axisLabel:{textStyle: {color: [ '#abbbde']}}
            },
            categoryAxis:{
                splitLine:{lineStyle:{color:['#FFF']}}
            }
            };
        switch(nLenght)
        {
            case "0":
            var option_app = {
                // width:"90%",
                height:280,
                tooltip: {
                    show: true,
                    trigger: 'axis',
                    axisPointer:{
                        type : 'line',
                        lineStyle : {
                          color: '#373737',
                          width: 0,
                          type: 'solid'
                        }
                    }
                },
                tooltip : {
                    show: true,
                    trigger: 'axis',
                    axisPointer:{
                        type : 'line',
                        lineStyle : {
                          color: '#fff',
                          width: 0,
                          type: 'solid'
                        }
                    },
                   
                },
                grid: {
                    x: 90, y: 40,
                    borderColor: '#FFF'
                },
                calculable: false,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        splitLine:true,
                        name: getRcText("SHOWTIME"),
                        axisLine  : {
                            show:true,
                            lineStyle :{color: '#47495d', width: 1}
                        },
                        axisTick :{
                            show:false
                        }, 
                        data:aTime
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: getRcText("REN"),
                        axisLabel: {
                            show: true,
                            textStyle:{color: '#47495d', width: 1} 
                        },
                        axisLine  : {
                            show:true,
                            lineStyle :{color: '#47495d', width: 1}
                        }
                    }
                ],
                series: [
                    {
                        symbol: "none", 
                        type: 'line', 
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        name: "no App", 
                        data:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
                     
                    },    
                ]
            };
            
                $("#change_App").echart("init", option_app, oTheme_app);
            break;
            case "1":
            var option_app = {
                // width:"90%",
                height:280,
                legend: {
                    data:[aName[0].AppName] 
                },
                tooltip: {
                    show: true,
                    trigger: 'axis',
                    axisPointer:{
                        type : 'line',
                        lineStyle : {
                          color: '#373737',
                          width: 0,
                          type: 'solid'
                        }
                    }
                },
                tooltip : {
                    show: true,
                    trigger: 'axis',
                    axisPointer:{
                        type : 'line',
                        lineStyle : {
                          color: '#fff',
                          width: 0,
                          type: 'solid'
                        }
                    },
                   
                },
                
                grid: {
                    x: 90, y: 40,
                    borderColor: '#FFF'
                },
                calculable: false,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        splitLine:true,
                        name: getRcText("SHOWTIME"),
                        axisLine  : {
                            show:true,
                            lineStyle :{color: '#47495d', width: 1}
                        },
                        axisTick :{
                            show:false
                        }, 
                        data:aTime
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: getRcText("REN"),
                        axisLabel: {
                            show: true,
                            textStyle:{color: '#47495d', width: 1} 
                        },
                        axisLine  : {
                            show:true,
                            lineStyle :{color: '#47495d', width: 1}
                        }
                    }
                ],
                series: [
                    {
                        symbol: "none", 
                        type: 'line', 
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        name: aName[0].AppName, 
                        data:aData[0]
                     
                    },
                ]

            };
           
                $("#change_App").echart("init", option_app, oTheme_app);
            break;
            case "2":
            var option_app = {
                // width:"90%",
                height:280,
                legend: {
                    data:[aName[0].AppName,aName[1].AppName]
              
                },
                tooltip: {
                    show: true,
                    trigger: 'axis',
                    axisPointer:{
                        type : 'line',
                        lineStyle : {
                          color: '#373737',
                          width: 0,
                          type: 'solid'
                        }
                    }
                },
                tooltip : {
                    show: true,
                    trigger: 'axis',
                    axisPointer:{
                        type : 'line',
                        lineStyle : {
                          color: '#fff',
                          width: 0,
                          type: 'solid'
                        }
                    },
                   
                },
                
                grid: {
                    x: 90, y: 40,
                    borderColor: '#FFF'
                },
                calculable: false,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        splitLine:true,
                        name: getRcText("SHOWTIME"),
                        axisLine  : {
                            show:true,
                            lineStyle :{color: '#47495d', width: 1}
                        },
                        axisTick :{
                            show:false
                        }, 
                        data:aTime
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: getRcText("REN"),
                        axisLabel: {
                            show: true,
                            textStyle:{color: '#47495d', width: 1} 
                        },
                        axisLine  : {
                            show:true,
                            lineStyle :{color: '#47495d', width: 1}
                        }
                    }
                ],
                series: [
                    {
                        symbol: "none", 
                        type: 'line', 
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        name: aName[0].AppName, 
                        data:aData[0]
                     
                    },
                    {
                        symbol: "none", 
                        type: 'line', 
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        name: aName[1].AppName, 
                        data:aData[1]
                    },
                ]

            };
           
            $("#change_App").echart("init", option_app, oTheme_app);
            break;
            case "3":
            var option_app = {
                // width:"90%",
                height:280,
                legend: {
                    data:[aName[0].AppName,aName[1].AppName,aName[2].AppName]
              
                },
                tooltip: {
                    show: true,
                    trigger: 'axis',
                    axisPointer:{
                        type : 'line',
                        lineStyle : {
                          color: '#373737',
                          width: 0,
                          type: 'solid'
                        }
                    }
                },
                tooltip : {
                    show: true,
                    trigger: 'axis',
                    axisPointer:{
                        type : 'line',
                        lineStyle : {
                          color: '#fff',
                          width: 0,
                          type: 'solid'
                        }
                    },
                   
                },
                
                grid: {
                    x: 90, y: 40,
                    borderColor: '#FFF'
                },
                calculable: false,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        splitLine:true,
                        name: getRcText("SHOWTIME"),
                        axisLine  : {
                            show:true,
                            lineStyle :{color: '#47495d', width: 1}
                        },
                        axisTick :{
                            show:false
                        }, 
                        data:aTime
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: getRcText("REN"),
                        axisLabel: {
                            show: true,
                            textStyle:{color: '#47495d', width: 1} 
                        },
                        axisLine  : {
                            show:true,
                            lineStyle :{color: '#47495d', width: 1}
                        }
                    }
                ],
                series: [
                    {
                        symbol: "none", 
                        type: 'line', 
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        name: aName[0].AppName, 
                        data:aData[0]
                     
                    },
                    {
                        symbol: "none", 
                        type: 'line', 
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        name: aName[1].AppName, 
                        data:aData[1]
                    },
                    {
                        symbol: "none", 
                        type: 'line', 
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        name: aName[2].AppName,
                        data:aData[2]
                    },    
                ]

            };
           
            $("#change_App").echart("init", option_app, oTheme_app);
            break;
            case "4":
            var option_app = {
                // width:"90%",
                height:280,
                legend: {
                    data:[aName[0].AppName,aName[1].AppName,aName[2].AppName,aName[3].AppName]
              
                },
                tooltip: {
                    show: true,
                    trigger: 'axis',
                    axisPointer:{
                        type : 'line',
                        lineStyle : {
                          color: '#373737',
                          width: 0,
                          type: 'solid'
                        }
                    }
                },
                tooltip : {
                    show: true,
                    trigger: 'axis',
                    axisPointer:{
                        type : 'line',
                        lineStyle : {
                          color: '#fff',
                          width: 0,
                          type: 'solid'
                        }
                    },
                   
                },
                
                grid: {
                    x: 90, y: 40,
                    borderColor: '#FFF'
                },
                calculable: false,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        splitLine:true,
                        name: getRcText("SHOWTIME"),
                        axisLine  : {
                            show:true,
                            lineStyle :{color: '#47495d', width: 1}
                        },
                        axisTick :{
                            show:false
                        }, 
                        data:aTime
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: getRcText("REN"),
                        axisLabel: {
                            show: true,
                            textStyle:{color: '#47495d', width: 1} 
                        },
                        axisLine  : {
                            show:true,
                            lineStyle :{color: '#47495d', width: 1}
                        }
                    }
                ],
                series: [
                    {
                        symbol: "none", 
                        type: 'line', 
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        name: aName[0].AppName, 
                        data:aData[0]
                     
                    },
                    {
                        symbol: "none", 
                        type: 'line', 
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        name: aName[1].AppName, 
                        data:aData[1]
                    },
                    {
                        symbol: "none", 
                        type: 'line', 
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        name: aName[2].AppName,
                        data:aData[2]
                    },
                    {
                        symbol: "none", 
                        type: 'line', 
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        name: aName[3].AppName, 
                        data:aData[3]
                    }, 
                ]

            };
            
            $("#change_App").echart("init", option_app, oTheme_app);
            break;
            case "5":
            var option_app = {
                // width:"90%",
                height:280,
                legend: {
                    data:[aName[0].AppName,aName[1].AppName,aName[2].AppName,aName[3].AppName,aName[4].AppName]
              
                },
                tooltip: {
                    show: true,
                    trigger: 'axis',
                    axisPointer:{
                        type : 'line',
                        lineStyle : {
                          color: '#373737',
                          width: 0,
                          type: 'solid'
                        }
                    }
                },
                tooltip : {
                    show: true,
                    trigger: 'axis',
                    axisPointer:{
                        type : 'line',
                        lineStyle : {
                          color: '#fff',
                          width: 0,
                          type: 'solid'
                        }
                    },
                   
                },
                
                grid: {
                    x: 90, y: 40,
                    borderColor: '#FFF'
                },
                calculable: false,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        splitLine:true,
                        name: getRcText("SHOWTIME"),
                        axisLine  : {
                            show:true,
                            lineStyle :{color: '#47495d', width: 1}
                        },
                        axisTick :{
                            show:false
                        }, 
                        data:aTime
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: getRcText("REN"),
                        axisLabel: {
                            show: true,
                            textStyle:{color: '#47495d', width: 1} 
                        },
                        axisLine  : {
                            show:true,
                            lineStyle :{color: '#47495d', width: 1}
                        }
                    }
                ],
                series: [
                    {
                        symbol: "none", 
                        type: 'line', 
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        name: aName[0].AppName, 
                        data:aData[0]
                     
                    },
                    {
                        symbol: "none", 
                        type: 'line', 
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        name: aName[1].AppName, 
                        data:aData[1]
                    },
                    {
                        symbol: "none", 
                        type: 'line', 
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        name: aName[2].AppName,
                        data:aData[2]
                    },
                    {
                        symbol: "none", 
                        type: 'line', 
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        name: aName[3].AppName, 
                        data:aData[3]
                    }, 
                    {
                        symbol: "none", 
                        type: 'line', 
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        name: aName[4].AppName, 
                        data:aData[4]
                    }, 
                ]

            };
            
            $("#change_App").echart("init", option_app, oTheme_app);
            break;
        } 
    }
    //最受欢迎的应用类别饼图option
    function initWecomPie_App(aData)
    {
         var option = {
          height:250,
            tooltip : {
                trigger: 'item',
                formatter: " {b}: {d}%"
            }, 
            legend: {
                orient : 'horizontal',
                x : 30,
                y : 190,
                
                data: aData
            }, 
            calculable : false,
            series : [
                {
                    type:'pie',
                    radius : 80,
                    center: ['49%', '35%'],
                    itemStyle: {
                         normal: {
                            labelLine:{
                                show:false
                            },
                            label:
                            {
                                position:"inner",
                                formatter: function(a,b,c,d){
                                    return Math.round(d)+"%";
                                }
                            }
                        } 
                    },
                    data:aData
                }
            ]
        }; 
        var oTheme={
                color: [   'rgba(245,105,1,0.8)','rgba(254,132,41, 0.8)','rgba(254,156,84, 0.8)',
                        'rgba(254,185,133, 0.8)','rgba(254,202,163, 0.8)','rgba(255,221,196, 0.8)' 
                       ]
        };
       
        $("#App_pie").echart("init", option,oTheme); 
    } 
    //最受欢迎的应用类别饼图一周的数据处理
  /*  function initAweekPie_App(sStartTime,sEnd)
    {
        function myCallback (oInfos)
        {   
            var aWecomApp = Utils.Request.getTableRows (NC.UserApps, oInfos) || [];
            var nLenght = g_aAweekWelcomApp.length; 
            for(var i=0;i<aWecomApp.length;i++)
            {
                g_aAweekWelcomApp[nLenght+i] =  aWecomApp[i];
            }
            g_nCount++;
            if(g_nCount==7)
            {
                g_nCount=0;
                var aSearchApp = SearchApp(g_aAweekWelcomApp);
                initWecomPie_App(aSearchApp); 
                g_aAweekWelcomApp.splice(0);

            }
        }
        var aRequest = [];      
        var nPktDir = "0";
        var nIpType = "0";
        var oApps = Utils.Request.getTableInstance (NC.UserApps);
        oApps.addFilter({StartTime:sStartTime,EndTime:sEnd, AddressType:nIpType, PktDir: nPktDir});
        aRequest.push(oApps);
        Utils.Request.getBulk (aRequest, myCallback);
    }*/
    //最受欢迎的应用类别饼图的数据处理
    function initPie_App(sStartTime,sEnd)
    {

        $.ajax({
            url:getDynUrl("initPie_App.json"),
            dataType: "json",
            type:"get",
            success: function (data)
            {
                initWecomPie_App(data.aSearchApp);
            },
            error: onAjaxErr
        });

       /* function myCallback (oInfos)
        {   
            var aWecomApp = Utils.Request.getTableRows (NC.UserApps, oInfos) || [];
            var aSearchApp = SearchApp(aWecomApp);
            initWecomPie_App(aSearchApp); 
        }
        var aRequest = [];      
        var sNowEndTime =  getTheDate("one","end");
        var sNowStart = getTheDate("one","Start");
        var sEnd = sEnd || sNowEndTime;
        var sStartTime = sStartTime || sNowStart;
        var nPktDir = "0";
        var nIpType = "0";
        var oApps = Utils.Request.getTableInstance (NC.UserApps);
        oApps.addFilter({StartTime:sStartTime,EndTime:sEnd, AddressType:nIpType, PktDir: nPktDir});
        aRequest.push(oApps);
        Utils.Request.getBulk (aRequest, myCallback);*/
    }
    //应用统计一周数据处理
    /*function initAweekApp_list(sStartTime,sEnd,nPktDir)
    {
        function myCallback (oInfos)
        { 
            var aUserApp = Utils.Request.getTableRows (NC.UserApps, oInfos) || [];
            var aUser = Utils.Request.getTableRows (NC.Users, oInfos) || [];
            var nLenght=g_aAweekUserApp.length;
            for(var i=0;i<aUserApp.length;i++)
            {
                g_aAweekUserApp[nLenght+i]=aUserApp[i];
            }
            g_nCount++
            if(g_nCount==7)
            { 
                g_nCount=0;
                var aAppFilter= g_aAweekUserApp.splice(0,8);
                g_aAweekUserApp.splice(0);
                for(var i=0;i<aAppFilter.length;i++)
                {
                    for(var j=0;j<aUser.length;j++)
                    {
                        if(aAppFilter[i].UserId==aUser[j].UserId)
                        {
                            aAppFilter[i].UserMac = aUser[j].UserMac;
                            break;
                        }
                    }
                    if(aAppFilter[i].PktBytes!=0)
                    {
                        aAppFilter[i].PktBytes = Number((aAppFilter[i].PktBytes/1024).toFixed(2));
                    }
                }
                $("#userapp_list").SList("refresh",aAppFilter);
            }
        }
        var aRequest = [];   
        var nPktDir = nPktDir||"0";
        var nIpType = nIpType || "0"; 
        var oUserSelects = Utils.Request.getTableInstance (NC.UserApps);
        var oUser =  Utils.Request.getTableInstance (NC.Users);
        oUserSelects.addFilter({StartTime:sStartTime,EndTime:sEnd, PktDir: nPktDir, AddressType:nIpType});
        oUser.addFilter({AddressType:nIpType});
        aRequest.push(oUserSelects,oUser);
        Utils.Request.getBulk (aRequest, myCallback);
        
    }*/
    //应用统计数据处理
    function initApp_list(sStartTime,sEnd,nPktDir)
    {

        $.ajax({
            url:getDynUrl("initApp_list.json"),
            dataType: "json",
            type:"get",
            success: function (data)
            {
                $("#userapp_list").SList("refresh",data.aAppFilter);
            },
            error: onAjaxErr
        });

    /*    function myCallback (oInfos)
        { 
            var aUserApp = Utils.Request.getTableRows (NC.UserApps, oInfos) || [];
            var aUser = Utils.Request.getTableRows (NC.Users, oInfos) || [];
            var aAppFilter= aUserApp.splice(0,8);
            for(var i=0;i<aAppFilter.length;i++)
            {
                for(var j=0;j<aUser.length;j++)
                {
                    if(aAppFilter[i].UserId==aUser[j].UserId)
                    {
                        aAppFilter[i].UserMac = aUser[j].UserMac;
                        break;
                    }
                }
                if(aAppFilter[i].PktBytes!=0)
                {
                    aAppFilter[i].PktBytes = Number((aAppFilter[i].PktBytes/1024).toFixed(2));
                }

            }
            $("#userapp_list").SList("refresh",aAppFilter);
        }
        var aRequest = [];   
        var sNowEndTime =  getTheDate("one","end");
        var sNowStart =  getTheDate("one","Start");
        var sStartTime = sStartTime || sNowStart;
        var sEnd = sEnd || sNowEndTime;
        var nPktDir = nPktDir||"0";
        var nIpType = nIpType || "0"; 
        var oUserSelects = Utils.Request.getTableInstance (NC.UserApps);
        var oUser =  Utils.Request.getTableInstance (NC.Users);
        oUserSelects.addFilter({StartTime:sStartTime,EndTime:sEnd, PktDir: nPktDir, AddressType:nIpType});
        oUser.addFilter({AddressType:nIpType});
        aRequest.push(oUserSelects,oUser);
        Utils.Request.getBulk (aRequest, myCallback);*/
    }
    //应用类别流量折线图的option
    function AppTypeChange(aTime,aData,aName,nLenght)
    {
        var oTheme_app = {
               color: ['#0096d6','#31A9DC','#62BCE2','#7BC7E7','#ACDAED','#C4E3F0','#DDEDF3'],
               //color: ["#7FCAEA","#99FF33","#F8A4AE","#239FD7","#7FCAEA"],
                valueAxis:{
                    splitLine:{lineStyle:{color:[ '#FFF']}},
                    axisLabel:{textStyle: {color: [ '#abbbde']}}
                },
                categoryAxis:{
                    splitLine:{lineStyle:{color:['#FFF']}}
                }
            };
        switch(nLenght)
        {
            case "0":
            var option_app = {
                // width:"90%",
                height:280,
                 
                tooltip: {
                    show: true,
                    trigger: 'axis',
                    axisPointer:{
                        type : 'line',
                        lineStyle : {
                          color: '#373737',
                          width: 0,
                          type: 'solid'
                        }
                    }
                },
                tooltip : {
                    show: true,
                    trigger: 'axis',
                    axisPointer:{
                        type : 'line',
                        lineStyle : {
                          color: '#fff',
                          width: 0,
                          type: 'solid'
                        }
                    },
                   
                },
                
                grid: {
                    x: 90, y: 40,
                    borderColor: '#FFF'
                },
                calculable: false,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        splitLine:true,
                        name:getRcText("SHOWTIME"),
                        axisLine  : {
                            show:true,
                            lineStyle :{color: '#47495d', width: 1}
                        },
                        axisTick :{
                            show:false
                        },
                        data:aTime
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name:getRcText("Traffic "),
                        axisLabel: {
                            show: true,
                            textStyle:{color: '#47495d', width: 1} 
                        },
                        axisLine  : {
                            show:true,
                            lineStyle :{color: '#47495d', width: 1}
                        }
                    }
                ],
                series: [
                    {
                        symbol: "none", 
                        type: 'line', 
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        name: "no Apptype",
                        data:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
                    }, 
                ]

            };
            $("#AppType_change").echart("init", option_app, oTheme_app);
            break;
            case "1":
            var option_app = {
                // width:"90%",
                height:280,
                legend: {
                    data:[aName[0].name]
                },
                tooltip: {
                    show: true,
                    trigger: 'axis',
                    axisPointer:{
                        type : 'line',
                        lineStyle : {
                          color: '#373737',
                          width: 0,
                          type: 'solid'
                        }
                    }
                },
                tooltip : {
                    show: true,
                    trigger: 'axis',
                    axisPointer:{
                        type : 'line',
                        lineStyle : {
                          color: '#fff',
                          width: 0,
                          type: 'solid'
                        }
                    },
                   
                },
                
                grid: {
                    x: 90, y: 40,
                    borderColor: '#FFF'
                },
                calculable: false,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        splitLine:true,
                        name:getRcText("SHOWTIME"),
                        axisLine  : {
                            show:true,
                            lineStyle :{color: '#47495d', width: 1}
                        },
                        axisTick :{
                            show:false
                        },
                        data:aTime
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name:getRcText("Traffic"),
                        axisLabel: {
                            show: true,
                            textStyle:{color: '#47495d', width: 1} 
                        },
                        axisLine  : {
                            show:true,
                            lineStyle :{color: '#47495d', width: 1}
                        }
                    }
                ],
                series: [
                    {
                        symbol: "none", 
                        type: 'line', 
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        name: aName[0].name,
                        data:aData[0]
                    },  
                ]
            }; 
            $("#AppType_change").echart("init", option_app, oTheme_app);
            break;
            case "2":
            var option_app = {
                // width:"90%",
                height:280,
                legend: {
                    data:[aName[0].name,aName[1].name]
                },
                tooltip: {
                    show: true,
                    trigger: 'axis',
                    axisPointer:{
                        type : 'line',
                        lineStyle : {
                          color: '#373737',
                          width: 0,
                          type: 'solid'
                        }
                    }
                },
                tooltip : {
                    show: true,
                    trigger: 'axis',
                    axisPointer:{
                        type : 'line',
                        lineStyle : {
                          color: '#fff',
                          width: 0,
                          type: 'solid'
                        }
                    },
                   
                },
                
                grid: {
                    x: 90, y: 40,
                    borderColor: '#FFF'
                },
                calculable: false,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        splitLine:true,
                        name:getRcText("SHOWTIME"),
                        axisLine  : {
                            show:true,
                            lineStyle :{color: '#47495d', width: 1}
                        },
                        axisTick :{
                            show:false
                        },
                        data:aTime
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name:getRcText("Traffic"),
                        axisLabel: {
                            show: true,
                            textStyle:{color: '#47495d', width: 1} 
                        },
                        axisLine  : {
                            show:true,
                            lineStyle :{color: '#47495d', width: 1}
                        }
                    }
                ],
                series: [
                    {
                        symbol: "none", 
                        type: 'line', 
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        name: aName[0].name,
                        data:aData[0]
                    },
                    {
                        symbol: "none", 
                        type: 'line', 
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        name: aName[1].name, 
                        data :aData[1]
                    }, 
                ]

            }; 
            $("#AppType_change").echart("init", option_app, oTheme_app);
            break;
            case "3":
            var option_app = {
                // width:"90%",
                height:280,
                legend: {
                    data:[aName[0].name,aName[1].name,aName[2].name]
                },
                tooltip: {
                    show: true,
                    trigger: 'axis',
                    axisPointer:{
                        type : 'line',
                        lineStyle : {
                          color: '#373737',
                          width: 0,
                          type: 'solid'
                        }
                    }
                },
                tooltip : {
                    show: true,
                    trigger: 'axis',
                    axisPointer:{
                        type : 'line',
                        lineStyle : {
                          color: '#fff',
                          width: 0,
                          type: 'solid'
                        }
                    },
                   
                },
                
                grid: {
                    x: 90, y: 40,
                    borderColor: '#FFF'
                },
                calculable: false,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        splitLine:true,
                        name:getRcText("SHOWTIME"),
                        axisLine  : {
                            show:true,
                            lineStyle :{color: '#47495d', width: 1}
                        },
                        axisTick :{
                            show:false
                        },
                        data:aTime
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name:getRcText("Traffic"),
                        axisLabel: {
                            show: true,
                            textStyle:{color: '#47495d', width: 1} 
                        },
                        axisLine  : {
                            show:true,
                            lineStyle :{color: '#47495d', width: 1}
                        }
                    }
                ],
                series: [
                    {
                        symbol: "none", 
                        type: 'line', 
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        name: aName[0].name,
                        data:aData[0]
                    },
                    {
                        symbol: "none", 
                        type: 'line', 
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        name: aName[1].name, 
                        data :aData[1]
                    },
                    {
                        symbol: "none", 
                        type: 'line', 
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        name: aName[2].name, 
                        data:aData[2]
                    },
                ]
            }; 
            $("#AppType_change").echart("init", option_app, oTheme_app);
            break;
            case "4":
            var option_app = {
                // width:"90%",
                height:280,
                legend: {
                    data:[aName[0].name,aName[1].name,aName[2].name,aName[3].name]
                },
                tooltip: {
                    show: true,
                    trigger: 'axis',
                    axisPointer:{
                        type : 'line',
                        lineStyle : {
                          color: '#373737',
                          width: 0,
                          type: 'solid'
                        }
                    }
                },
                tooltip : {
                    show: true,
                    trigger: 'axis',
                    axisPointer:{
                        type : 'line',
                        lineStyle : {
                          color: '#fff',
                          width: 0,
                          type: 'solid'
                        }
                    },
                   
                },
                
                grid: {
                    x: 90, y: 40,
                    borderColor: '#FFF'
                },
                calculable: false,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        splitLine:true,
                        name:getRcText("SHOWTIME"),
                        axisLine  : {
                            show:true,
                            lineStyle :{color: '#47495d', width: 1}
                        },
                        axisTick :{
                            show:false
                        },
                        data:aTime
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name:getRcText("Traffic"),
                        axisLabel: {
                            show: true,
                            textStyle:{color: '#47495d', width: 1} 
                        },
                        axisLine  : {
                            show:true,
                            lineStyle :{color: '#47495d', width: 1}
                        }
                    }
                ],
                series: [
                    {
                        symbol: "none", 
                        type: 'line', 
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        name: aName[0].name,
                        data:aData[0]
                    },
                    {
                        symbol: "none", 
                        type: 'line', 
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        name: aName[1].name, 
                        data :aData[1]
                    },
                    {
                        symbol: "none", 
                        type: 'line', 
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        name: aName[2].name, 
                        data:aData[2]
                    },
                    {
                        symbol: "none", 
                        type: 'line', 
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        name: aName[3].name, 
                        data:aData[3]
                    }, 
                ]

            };
            $("#AppType_change").echart("init", option_app, oTheme_app);
            break;
            case "5":
            var option_app = {
                // width:"90%",
                height:280,
                legend: {
                    data:[aName[0].name,aName[1].name,aName[2].name,aName[3].name,aName[4].name]
                },
                tooltip: {
                    show: true,
                    trigger: 'axis',
                    axisPointer:{
                        type : 'line',
                        lineStyle : {
                          color: '#373737',
                          width: 0,
                          type: 'solid'
                        }
                    }
                },
                tooltip : {
                    show: true,
                    trigger: 'axis',
                    axisPointer:{
                        type : 'line',
                        lineStyle : {
                          color: '#fff',
                          width: 0,
                          type: 'solid'
                        }
                    },
                   
                },
                
                grid: {
                    x: 90, y: 40,
                    borderColor: '#FFF'
                },
                calculable: false,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        splitLine:true,
                        name:getRcText("SHOWTIME"),
                        axisLine  : {
                            show:true,
                            lineStyle :{color: '#47495d', width: 1}
                        },
                        axisTick :{
                            show:false
                        },
                        data:aTime
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name:getRcText("Traffic"),
                        axisLabel: {
                            show: true,
                            textStyle:{color: '#47495d', width: 1} 
                        },
                        axisLine  : {
                            show:true,
                            lineStyle :{color: '#47495d', width: 1}
                        }
                    }
                ],
                series: [
                    {
                        symbol: "none", 
                        type: 'line', 
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        name: aName[0].name,
                        data:aData[0]
                    },
                    {
                        symbol: "none", 
                        type: 'line', 
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        name: aName[1].name, 
                        data :aData[1]
                    },
                    {
                        symbol: "none", 
                        type: 'line', 
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        name: aName[2].name, 
                        data:aData[2]
                    },
                    {
                        symbol: "none", 
                        type: 'line', 
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        name: aName[3].name, 
                        data:aData[3]
                    },
                    {
                        symbol: "none", 
                        type: 'line', 
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        name:aName[4].name, 
                        data:aData[4]
                    },   
                ]

            };
            $("#AppType_change").echart("init", option_app, oTheme_app);
            break;  
        }           
    }
    //应用列别流量折线图的数据处理
   /* function AppTypeFlow_Chart()
    {
        function myCallback (oInfos)
        {  
            function mySecCallback(oSecInfos)
            {
             for(var i=0;i<aWecomAppType.length;i++)
                {
                  var nNumDownStart = Number(aWecomAppType[i].StartTime.slice(11,13))
                  var nNumDownEnd = Number(aWecomAppType[i].EndTime.slice(11,13))
                  var nflag;
                   for(var j=0;j<aTime.length;j++)
                   {
                        var nTime = Number(aTime[j].slice(0,2));
                        if((nTime>=nNumDownStart)&&(nTime<=nNumDownEnd))
                        {
                            for(var k=0;k<aSearchApp.length;k++)
                            {
                                if(aWecomAppType[i].AppCategory==aSearchApp[k].name)
                                {
                                    switch(k)
                                    {
                                        case 0:aAppTypeFlow0[j]+= Number(aWecomAppType[i].PktBytes);
                                        break;
                                        case 1:aAppTypeFlow1[j]+= Number(aWecomAppType[i].PktBytes);
                                        break;
                                        case 2:aAppTypeFlow2[j]+= Number(aWecomAppType[i].PktBytes);
                                        break;
                                        case 3:aAppTypeFlow3[j]+= Number(aWecomAppType[i].PktBytes);
                                        break;
                                        case 4:aAppTypeFlow4[j]+= Number(aWecomAppType[i].PktBytes);
                                        break;
                                    }
                                }

                            }
                               
                        }
                         
                    }
                }
                aTypeData.push(aAppTypeFlow0,aAppTypeFlow1,aAppTypeFlow2,aAppTypeFlow3,aAppTypeFlow4);
                var aTureTypeData = [];
                var nLenght = aSearchApp.length;
                 switch(nLenght)
                    {
                        case 0: 
                        AppTypeChange(aTime,aTypeData,aSearchApp,"0");
                        break;
                        case 1:
                        aTureTypeData.push(aTypeData[0]);
                        AppTypeChange(aTime,aTureTypeData,aSearchApp,"1");    
                        break;
                        case 2:
                        aTureTypeData.push(aTypeData[0],aTypeData[1]);
                        AppTypeChange(aTime,aTureTypeData,aSearchApp,"2");    
                        break;
                        case 3:
                        aTureTypeData.push(aTypeData[0],aTypeData[1],aTypeData[2]);
                        AppTypeChange(aTime,aTureTypeData,aSearchApp,"3");    
                        break;
                        case 4:
                        aTureTypeData.push(aTypeData[0],aTypeData[1],aTypeData[2],aTypeData[3]);
                        AppTypeChange(aTime,aTureTypeData,aSearchApp,"4");    
                        break;
                        case 5:
                        aTureTypeData.push(aTypeData[0],aTypeData[1],aTypeData[2],aTypeData[3],aTypeData[4]);
                        AppTypeChange(aTime,aTureTypeData,aSearchApp,"5");    
                        break;
                        default:
                        break;
                    } 
            }
            var aWecomAppType = Utils.Request.getTableRows (NC.UserApps, oInfos) || [];
            var aSearchApp = SearchApp(aWecomAppType);
            var aAppTypeFlow0 = [],aAppTypeFlow1 = [],aAppTypeFlow2 = [],aAppTypeFlow3 = [],aAppTypeFlow4 = [];
            var aTypeData = []; 
            for(var i=0;i<=nHour;i++)
            {
                aTime[i]=addzero(i)+":"+"00";
                aAppTypeFlow0[i]=0;
                aAppTypeFlow1[i]=0;
                aAppTypeFlow2[i]=0;
                aAppTypeFlow3[i]=0;
                aAppTypeFlow4[i]=0;
            } 
            for(var i=0;i<aWecomAppType.length;i++)
            {
              var nNumStart = Number(aWecomAppType[i].StartTime.slice(11,13))
              var nNumEnd = Number(aWecomAppType[i].EndTime.slice(11,13))
              var nflag;
               for(var j=0;j<aTime.length;j++)
               {
                    var nTime = Number(aTime[j].slice(0,2));
                    if((nTime>=nNumStart)&&(nTime<=nNumEnd))
                    {
                        for(var k=0;k<aSearchApp.length;k++)
                        {
                            if(aWecomAppType[i].AppCategory==aSearchApp[k].name)
                            {
                                switch(k)
                                {
                                    case 0:aAppTypeFlow0[j]+= Number(aWecomAppType[i].PktBytes);
                                    break;
                                    case 1:aAppTypeFlow1[j]+= Number(aWecomAppType[i].PktBytes);
                                    break;
                                    case 2:aAppTypeFlow2[j]+= Number(aWecomAppType[i].PktBytes);
                                    break;
                                    case 3:aAppTypeFlow3[j]+= Number(aWecomAppType[i].PktBytes);
                                    break;
                                    case 4:aAppTypeFlow4[j]+= Number(aWecomAppType[i].PktBytes);
                                    break;
                                }
                            }

                        }
                           
                    }
                     
                }
            }
            var oAppDowns = Utils.Request.getTableInstance (NC.UserApps);
            oAppDowns.addFilter({StartTime:sStartTime,EndTime:sEnd, AddressType:nIpType, PktDir: nPktDir});
            aRequest.push(oAppDowns);
            Utils.Request.getBulk (aRequest, mySecCallback);   
        }
        var aRequest = [];      
        var sNowEndTime =  getTheDate("one","end");
        var sNowStart = getTheDate("one","Start");
        var sEnd = sEnd || sNowEndTime;
        var sStartTime = sStartTime || sNowStart;
        var nPktDir = "0";
        var nIpType = "0";
        var aTime = [];
        var tNow = new Date();
        var nHour = tNow.getHours();
        var nMinute = tNow.getMinutes();
        var oAppUps = Utils.Request.getTableInstance (NC.UserApps);
        oAppUps.addFilter({StartTime:sStartTime,EndTime:sEnd, AddressType:nIpType, PktDir: nPktDir});
        aRequest.push(oAppUps);
        Utils.Request.getBulk (aRequest, myCallback);
    }*/
    //访问应用人次折线图的数据处理
   /* function initWecomApp_Chart()
    {
        function myCallback (oInfos)
        {   
            var aWecomApp = Utils.Request.getTableRows (NC.UserApps, oInfos) || [];
            var aSearchApp = SearchWelcomApp(aWecomApp);
            var aAppTypeFlow0 = [],aAppTypeFlow1 = [],aAppTypeFlow2 = [],aAppTypeFlow3 = [],aAppTypeFlow4 = [];
            var aWecomAppNum = [];
            for(var i=0;i<=nHour;i++)
            {
                aTime[i]=addzero(i)+":"+"00";
                aAppTypeFlow0[i]=0;
                aAppTypeFlow1[i]=0;
                aAppTypeFlow2[i]=0;
                aAppTypeFlow3[i]=0;
                aAppTypeFlow4[i]=0;
            } 

            for(var i=0;i<aWecomApp.length;i++)
            {
              var nNumStart = Number(aWecomApp[i].StartTime.slice(11,13))
              var nNumEnd = Number(aWecomApp[i].EndTime.slice(11,13)) 
               for(var j=0;j<aTime.length;j++)
               {
                    var nTime = Number(aTime[j].slice(0,2));
                    if((nTime>=nNumStart)&&(nTime<=nNumEnd))
                    {
                        for(var k=0;k<aSearchApp.length;k++)
                        {
                            if(aWecomApp[i].AppName==aSearchApp[k].AppName)
                            {
                                switch(k)
                                {
                                    case 0:aAppTypeFlow0[j]+= 1;
                                    break;
                                    case 1:aAppTypeFlow1[j]+= 1;
                                    break;
                                    case 2:aAppTypeFlow2[j]+= 1;
                                    break;
                                    case 3:aAppTypeFlow3[j]+= 1;
                                    break;
                                    case 4:aAppTypeFlow4[j]+= 1;
                                    break;
                                }
                            }

                        }
                           
                    }
                    
                }

            }
            
            aWecomAppNum.push(aAppTypeFlow0,aAppTypeFlow1,aAppTypeFlow2,aAppTypeFlow3,aAppTypeFlow4);
            var aTrueWelcomAPP = [];
            var nLenght=aSearchApp.length;
            switch(nLenght)
            {
                case 0: 
                initAppChange(aTime,aWecomAppNum,aSearchApp,"0");
                break;
                case 1:
                aTrueWelcomAPP.push(aWecomAppNum[0]);
                initAppChange(aTime,aTrueWelcomAPP,aSearchApp,"1");    
                break;
                case 2:
                aTrueWelcomAPP.push(aWecomAppNum[0],aWecomAppNum[1]);
                initAppChange(aTime,aTrueWelcomAPP,aSearchApp,"2");    
                break;
                case 3:
                aTrueWelcomAPP.push(aWecomAppNum[0],aWecomAppNum[1],aWecomAppNum[2]);
                initAppChange(aTime,aTrueWelcomAPP,aSearchApp,"3");    
                break;
                case 4:
                aTrueWelcomAPP.push(aWecomAppNum[0],aWecomAppNum[1],aWecomAppNum[2],aWecomAppNum[3]);
                initAppChange(aTime,aTrueWelcomAPP,aSearchApp,"4");    
                break;
                case 5:
                aTrueWelcomAPP.push(aWecomAppNum[0],aWecomAppNum[1],aWecomAppNum[2],aWecomAppNum[3],aWecomAppNum[4]);
                initAppChange(aTime,aTrueWelcomAPP,aSearchApp,"5");    
                break;
                default:
                break;
            } 
        }
        var aRequest = [];  
        var aTime = [];
        var tNow = new Date(); 
        var nHour = tNow.getHours();  
        var sNowEndTime =  getTheDate("one","end");
        var sNowStart = getTheDate("one","Start");
        var sEnd = sEnd || sNowEndTime;
        var sStartTime = sStartTime || sNowStart;
        var nPktDir = "0";
        var nIpType = "0";
        var oApps = Utils.Request.getTableInstance (NC.UserApps);
        oApps.addFilter({StartTime:sStartTime,EndTime:sEnd, AddressType:nIpType, PktDir: nPktDir});
        aRequest.push(oApps);
        Utils.Request.getBulk (aRequest, myCallback);
    }*/

    function onAjaxErr()
    {
        var sProtocal = window.location.protocol.replace(":", "").toUpperCase();
       // var sMsg = PageText[PageText.curLang]["net_err"].replace("%s", sProtocal);
        alert("cuowu");
    }
    function getDynUrl(sUrl)
    {
        return  "../../wnm/" + sUrl;
    }

    function initFlow()
    {
       initUser();
       interfaces();
       initUserFlow();
    }
    function initUrl()
    {
      initpie_Url();
      initNum_UrlChart();
      initStatistics_URL();
    }
    function initApp()
    {
        initPie_App();
        initApp_list();
    }

    function UserFlowSelect()
    { 
        var aUserFlowDate= $("input[name='UserFlowDate']");
        var aUserFlowPkt = $("input[name='UserFlowPkt']");
        var nDate,nFlow;
        for(var i=0; i<aUserFlowDate.length;i++)
        {
            if($(aUserFlowDate[i])[0].checked)
            {
                nDate = $(aUserFlowDate[i]).val();
                break;
            }
        }
        for(var i=0; i<aUserFlowPkt.length;i++)
        {
            if($(aUserFlowPkt[i])[0].checked)
            {
                nFlow = $(aUserFlowPkt[i]).val();
                break;
            }
        }
        if(nDate=="0")
        {
            if(nFlow=="0")
            {
                var sEndTime =  getTheDate("one","end");
                var sStartTime =  getTheDate("one","Start");
                initUserFlow("0",sStartTime,sEndTime);
            }
            if(nFlow=="1")
            {
                var sEndTime =  getTheDate("one","end");
                var sStartTime =  getTheDate("one","Start");
                initUserFlow("1",sStartTime,sEndTime);
            }
        }
        if(nDate=="1")
        {
            if(nFlow=="0")
            {
                for(var i=0;i<7;i++)
                {
                    var sEndTime =  getTheDate("aweek","end",i);
                    var sStartTime =  getTheDate("aweek","Start",i);
                    initAweekUserFlow("0",sStartTime,sEndTime);
                }
            }
            if(nFlow=="1")
            {
                for(var j=0;j<7;j++)
                {
                    var sEndTime =  getTheDate("aweek","end",j);
                    var sStartTime =  getTheDate("aweek","Start",j);
                    initAweekUserFlow("1",sStartTime,sEndTime);
                }
            }
             
        }
       // $("#filter_UserFlowDate").hide();
    }
    function FlowComSelect()
    {
        var aFlowDate = $("input[name='FlowCom']");
        var nDate;
        for(var i=0; i<aFlowDate.length;i++)
        {
            if($(aFlowDate[i])[0].checked)
            {
                nDate = $(aFlowDate[i]).val();
                break;
            }
        }
        if(nDate=="0")
        {
            var sEndTime =  getTheDate("one","end");
            var sStartTime =  getTheDate("one","Start");
            initUser(sStartTime,sEndTime);
        }
        if(nDate=="1")
        {    
            for(var i=0;i<7;i++)
            {
                var sEndTime =  getTheDate("aweek","end",i);
                var sStartTime =  getTheDate("aweek","Start",i);
                initAweekUser(sStartTime,sEndTime);
            }
        }
       // $("#filter_FlowCom1").hide();
    }
    function IntFlowSelect()
    {
        var aFlowDate = $("input[name='IntFlow']");
        var nDate;
        for(var i=0; i<aFlowDate.length;i++)
        {
            if($(aFlowDate[i])[0].checked)
            {
                nDate = $(aFlowDate[i]).val();
                break;
            }
        }
        if(nDate=="0")
        {
            var sEndTime =  getTheDate("one","end");
            var sStartTime =  getTheDate("one","Start");
            interfaces(sStartTime,sEndTime);
        }
        if(nDate=="1")
        {
            for(var i=0;i<7;i++)
            {
                var sEndTime =  getTheDate("aweek","end",i);
                var sStartTime =  getTheDate("aweek","Start",i);
                Aweekinterfaces(sStartTime,sEndTime);
            }
        }
        //$("#filterHide_IntFlow").hide();
    }
    function UrlStatisSelect()
    {
        var aFlowDate = $("input[name='UrlDetaliDate']");
        var aFlowPkt = $("input[name='UrlPkt']");  
        var nDate,nFlow;
        for(var i=0; i<aFlowDate.length;i++)
        {
            if($(aFlowDate[i])[0].checked)
            {
                nDate = $(aFlowDate[i]).val();
                break;
            }
        } 
        for(var j=0; j<aFlowPkt.length;j++)
        {
            if($(aFlowPkt[j])[0].checked)
            {
                nFlow = $(aFlowPkt[j]).val();
                break;
            }
        }
        if(nDate=="0")
        {
            if(nFlow=="0")
            {
                var sEndTime =  getTheDate("one","end");
                var sStartTime =  getTheDate("one","Start");
                initStatistics_URL(sStartTime,sEndTime,"0");
            }
            if(nFlow=="1")
            {
                var sEndTime =  getTheDate("one","end");
                var sStartTime =  getTheDate("one","Start");
                initStatistics_URL(sStartTime,sEndTime,"1");
            }
             
        }
        if(nDate=="1")
        {
            if(nFlow=="0")
            {
                for(var i=0;i<7;i++)
                {
                    var sEndTime =  getTheDate("aweek","end",i);
                    var sStartTime =  getTheDate("aweek","Start",i);
                    initAweekStatistics_URL(sStartTime,sEndTime,"0");
                }
            } 
            if(nFlow=="1")
            {
                for(var i=0;i<7;i++)
                {
                    var sEndTime =  getTheDate("aweek","end",i);
                    var sStartTime =  getTheDate("aweek","Start",i);
                    initAweekStatistics_URL(sStartTime,sEndTime,"1");
                }
            }
        }
       // $("#filterhide_Url").hide();
    }
    function userAppStatisSelect()
    {
        var aFlowDate = $("input[name='AppDate']");
        var aFlowPkt = $("input[name='AppPkt']");
        var nDate;
        var nFlow;
        for(var i=0; i<aFlowDate.length;i++)
        {
            if($(aFlowDate[i])[0].checked)
            {
                nDate = $(aFlowDate[i]).val();
                break;
            }
        }
        for(var j=0; j<aFlowPkt.length;j++)
        {
            if($(aFlowPkt[j])[0].checked)
            {
                nFlow = $(aFlowPkt[j]).val();
                break;
            }
        }
        if(nDate=="0")
        {
            if(nFlow=="0")
            {
                var sEndTime =  getTheDate("one","end");
                var sStartTime =  getTheDate("one","Start");
                initApp_list(sStartTime,sEndTime,"0");
            }
            if(nFlow=="1")
            {
                var sEndTime =  getTheDate("one","end");
                var sStartTime =  getTheDate("one","Start");
                initApp_list(sStartTime,sEndTime,"1");
            }
        }
        if(nDate=="1")
        {
            if(nFlow=="0")
             {
                for(var i=0;i<7;i++)
                {
                    var sEndTime =  getTheDate("aweek","end",i);
                    var sStartTime =  getTheDate("aweek","Start",i);
                    initAweekApp_list(sStartTime,sEndTime,"0");
                }
            }
            if(nFlow=="1")
             {
                for(var i=0;i<7;i++)
                {
                    var sEndTime =  getTheDate("aweek","end",i);
                    var sStartTime =  getTheDate("aweek","Start",i);
                    initAweekApp_list(sStartTime,sEndTime,"1");
                }
            }
        }
        //$("#filterhide_userApp").hide();
    }
    function WecomUrlSelect()
    {
        var aFlowDate = $("input[name='WecomUrlDate']");
        var nDate;
        for(var i=0; i<aFlowDate.length;i++)
        {
            if($(aFlowDate[i])[0].checked)
            {
                nDate = $(aFlowDate[i]).val();
                break;
            }
        }
        if(nDate=="0")
        {
            var sEndTime =  getTheDate("one","end");
            var sStartTime =  getTheDate("one","Start");
            initpie_Url(sStartTime,sEndTime);
        }
        if(nDate=="1")
        {
            for(var i=0;i<7;i++)
            {
                var sEndTime =  getTheDate("aweek","end",i);
                var sStartTime =  getTheDate("aweek","Start",i);
                initAweekpie_Url(sStartTime,sEndTime);
           }
        }
        //$("#filter_UrlDate").hide();
    }
    function WecomAppSelect()
    {
        
        var aFlowDate = $("input[name='WecomAppDate']");
        var nDate;
        for(var i=0; i<aFlowDate.length;i++)
        {
            if($(aFlowDate[i])[0].checked)
            {
                nDate = $(aFlowDate[i]).val();
                break;
            }
        }
        if(nDate=="0")
        {
            var sEndTime =  getTheDate("one","end");
            var sStartTime =  getTheDate("one","Start");
            initPie_App(sStartTime,sEndTime);
        }
        if(nDate=="1")
        {
            for(var i=0;i<7;i++)
            {
            var sEndTime =  getTheDate("aweek","end",i);
            var sStartTime =  getTheDate("aweek","Start",i);
            initAweekPie_App(sStartTime,sEndTime);
           }
        }
        //$("#filter_WecomDate").hide();
    }
    function onClick()
    {
         var sId = $(this).attr("id").split("_")[1];
        switch(sId){
            case "FlowCom":
               $("#filter_FlowCom1").toggle();
                return false;
                break;
            case "UserFlow":
                $("#filter_UserFlowDate").toggle();
                return false;
                break;
            case "IntFlow":
                $("#filterHide_IntFlow").toggle();
                return false;
                break;

            case "url":
                $("#filter_UrlDate").toggle();
                return false;
                break;
            case "UrlDetali":
                $("#filterhide_Url").toggle();
                return false;
                break;
            case "userApp":
                $("#filterhide_userApp").toggle();
                return false;
                break;    
            case "WecomApp":
                $("#filter_WecomDate").toggle();
                return false;
                break;
            default:
                break;
        }
    }
     
    function initGrid(ListId,aData)
    {
        var optUserApp= {
             multiSelect: false,
            colNames: getRcText ("APP_HEAD"),
            showHeader: true,
            pageSize:8,
            colModel: [
                {name: "UserMac", datatype: "Mac"},
                {name: "AppName",datatype:"String"},
                {name: "PktCnts", datatype: "Integer"},
                {name: "PktBytes", datatype: "Integer"}
                  
            ]
        };
        var optSpi= {
            multiSelect: false,
            colNames: getRcText ("SPI_HEAD"),
            showHeader: true,
            pageSize:8,
            colModel: [
               
                {name: "InterfaceName", datatype: "Mac"},  
                {name: "PktCnts", datatype: "Integer"},
                {name: "PktBytes", datatype: "Integer"},
                {name: "Proportion", datatype: "Integer"}  
            ]
        };
        var optUrl= {
            colNames: getRcText ("URLSTATISTICS"),
            showHeader: true,
            pageSize:8,
            colModel: [ 
                {name:"UserMac",datatype:"Mac"},
                {name: "WebSiteName", datatype: "String"},
                {name: "CategoryName", datatype: "String"}, 
                {name: "Time", datatype: "Integer"}
            ]
        };
        var optUser= {
            colNames: getRcText ("FLOW_HEAD"),
            showHeader: true,
            pageSize:8,
            colModel: [
                {name: "UserMac", datatype: "Mac"},  
                {name: "PktCnts", datatype: "Integer"},
                {name: "PktBytes", datatype: "Integer"},
                {name: "Proportion", datatype: "Integer"}   
            ]
        };
        $("#userapp_list").SList ("head", optUserApp);
        $("#userUrl_list").SList ("head", optUrl);
        $("#FlowUpDatail_list").SList ("head", optUser);
        $("#SpiFlow_list").SList ("head", optSpi);
    }

    function ChartFresh()
    {
        switch($("#EchartSkip .myEchart:visible").attr("id"))
        {
            case "change_App":
                initWecomApp_Chart();
                break;
            case "userchange_url":
                initNum_UrlChart();
                break;
            case "userchange":
                initUserNumber_Chaet();
                break;
            case "AppType_change":
                AppTypeFlow_Chart();
                break;

        }
    }
    function FreshClick()
    {
        var num = $(this).attr("value");
        switch(num)
        {
           case "1":  initUser();
           break;
           case "2":  initpie_Url();
           break;
           case "3":  initPie_App();
           break;
           case "4":  interfaces();
           break;
           case "5":  initUserFlow();
           break;
           case "6":  initStatistics_URL();
           break;
           case "7":  initApp_list();
           break;
           default:break;
        }
       
    }
    function initForm()
    {
        //链接详情页面
        $("#url_detail,#WecomApp_detail").on("click",function()
        {
            Utils.Base.redirect ({np:$(this).attr("href")});
            return false;
        });

        $("#EchartSkipname a").on("click",function(){
            var svisible = $("#EchartSkip .myEchart:visible");
            if(svisible.attr("id") == $(this).attr("id"))
            {
                return false;
            }
            var sval = $(this).attr("val");
            $(this).siblings().filter(".active").removeClass("active");
            $(this).addClass("active");
            $("#EchartSkip .myEchart:visible").addClass("hide");
            $("#"+$(this).attr("val")).removeClass("hide");
            ChartFresh();
        });

        $("#interface_detail,#appinfo_detail,#urlinfo_detail,#userFlow_detail").on("click", function(){
            Utils.Base.redirect ({np:"drs.index",ID:$(this).attr("id")});
            return false;
        });
        //选择点击控件
        $("#filter_FlowCom,#filter_UserFlow,#filter_IntFlow,#filter_url,#filter_UrlDetali,#filter_userApp,#filter_WecomApp").on("click", onClick);
        //点击确定控件
        //$("#UserSpiSure").on("click", InterfacesSelect);
        $("#filter_FlowCom1").on("click",FlowComSelect);
        $("#filter_UrlDate").on("click",WecomUrlSelect);
        $("#filter_WecomDate").on("click",WecomAppSelect);
        $("#filterHide_IntFlow").on("click",IntFlowSelect);
        $("#filter_UserFlowDate").on("click", UserFlowSelect);
        $("#filterhide_Url").on("click",UrlStatisSelect);
        $("#filterhide_userApp").on("click",userAppStatisSelect);
       
       

        //刷新控件
        $("#refreshflow_user,#refresh_IntFlow,#refresh_user,#refresh_UrlDetali,#refresh_App,#refresh_Url,#refresh_WecomApp").on("click",FreshClick);
        $("#refreshChange_App").on("click",ChartFresh);
        //空白处点击影藏确定所在的框
        $(document).on("mousedown", function(e){
            var e = e || window.event;
            var elem = e.target || e.srcElement;
            while(elem)
            {
                if(elem.id && elem.id == "filter_FlowCom1" || elem.id == "filter_userSpiDate" || elem.id == "filter_UserFlowDate"|| elem.id == "filterhide_drop" || elem.id == "filterHide_IntFlow"||elem.id=="filter_UrlDate"||elem.id=="filterhide_Url"||elem.id=="filterhide_App"|| elem.id=="filterhide_userApp"||elem.id=="filter_WecomDate")
                {
                    return false;
                }
                elem = elem.parentNode;
            }
            $("#filter_FlowCom1, #filter_userSpiDate, #filter_UserFlowDate,#filterhide_drop,#filterHide_IntFlow,#filter_UrlDate,#filterhide_Url,#filterhide_App,#filterhide_userApp,#filter_WecomDate").hide();
        });
        
    }

   


    function initData()
    { 
       initFlow();
       initUrl();
       initApp();

    }

    function _init()
    {
      //  NC = Utils.Pages[MODULE_NC].NC;
        g_jForm = $("#UserSelects");
       // onInitContent()
        initForm();
        initGrid();
        initData();

        
    };

    function _destroy()
    {
        g_aUserUp = null;
        g_aUserDown = null;
        g_jForm = null;
        g_aInterfaces = null;
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init, 
        "destroy": _destroy, 
        "widgets": ["SList","Echart"],
        "utils":["Base"]
      //  "subModules":[MODULE_NC]
    });
})( jQuery );

