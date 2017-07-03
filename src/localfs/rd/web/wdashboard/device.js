;(function ($) {
	var MODULE_BASE = "wdashboard";
    var MODULE_NAME = MODULE_BASE + ".device";
    var g_oTimer = false;
    var oInfor = {};
    function getRcText (sRcName) 
    {
    	return Utils.Base.getRcString("summary_rc",sRcName);
    }
    
    function drawEmptyPie(pid,cid)
    {
        var option = {
            height:280,
            calculable : false,
            series : [
                {
                    type:'pie',
                    radius : '85%',
                    center: ['50%', '50%'],
                    itemStyle: {
                        normal: {
                            labelLine:{
                                show:false
                            },
                            label:
                            {
                                position:"inner"
                            }
                        }
                    },
                    data: [{name:'N/A',value:1}]
                }
            ]
        };
        var oTheme={color : ["rgba(216, 216, 216, 0.75)"]};
        
        $("#"+pid).echart("init", option,oTheme);
    }

    function getDevDatatime (argument) {
        // var temp = eval(argument);
        var day  = parseInt(argument/86400);
        var temp = argument%86400;
        var hour = parseInt(temp/3600);
        temp = argument%3600;
        var mini = parseInt(temp/60);
        var sec  = argument%60;
        if (hour < 10)
        {
            var sDatatime = day+":0"+hour;
        }
        else
        {
            var sDatatime = day+":"+hour;
        }
        if (mini < 10)
        {
             sDatatime = sDatatime+":0"+mini;
        } else 
        {
             sDatatime = sDatatime+":"+mini;
        }
        if (sec < 10)
        {
            sDatatime = sDatatime+":0"+sec;
        } else 
        {
            sDatatime = sDatatime+":"+sec;
        }
        return sDatatime;
    }

    function drawOnlineTime (oInfor)
    {
        function getDevList(ArrayT)
        {
            var atemp = [];
            $.each(ArrayT,function(index,iArray){
                atemp.push(
                        {
                            "devSN":iArray.devSN,
                            "devOnlineTime":getDevDatatime(iArray.devOnlineTime)
                        }
                    );
            });

            return atemp;
        }

        function onClickOnlinePie (oPiece) 
        {
            var oTimeList = {
                ">=3年":[86400*365*3,-1],
                "1年~3年":[86400*365,86400*365*3],
                "半年~1年":[86400*180,86400*365],
                "1月~半年":[86400*30,86400*180],
                "1周~1月":[86400*7,86400*30],
                "1天~1周":[86400,86400*7],
                "0~1天":[0,86400]
            };
 
            $.ajax({
                url:MyConfig.path+"/devmonitor/statistic_bytimeon_detail",
                type: "GET",
                dataType: "json",
                data:{
                    mintime:oTimeList[oPiece.name][0],
                    maxtime:oTimeList[oPiece.name][1],
                    skipnum:0,
                    limitnum:100000
                },
                success: function(data){
                    
                    var all = getDevList(data.acList);

                    $("#ByOnlinePopList").SList("refresh",all);
                    Utils.Base.openDlg(null, {}, {scope:$("#ByOnlinePop_diag"),className:"modal-super dashboard"});
                    return false;
                },
                error: function(){
                   
                }
            });
            
        }

        var aType = [
            {name:'>=3年',value:oInfor.cha6},
            {name:'1年~3年',value:oInfor.cha5},
            {name:'半年~1年',value:oInfor.cha4},
            {name:'1月~半年',value:oInfor.cha3},
            {name:'1周~1月',value:oInfor.cha2},
            {name:'1天~1周',value:oInfor.cha1},
            {name:'0~1天',value:oInfor.cha0}
        ];
        var option = {
            height:280,
            tooltip : {
                trigger: 'item',
                formatter: "{b} {a}{c} ({d}%)"
            },
            calculable : false,
            series : [
                {
                    name:"设备数：",
                    type:'pie',
                    radius : ['30%','50%'],
                    center: ['50%', '50%'],
                    itemStyle: {
                        normal: {
                            labelLine:{
                                length:4
                            },
                            label:
                            {
                                position:"outer",
                                textStyle:{
                                        // color: "#484A5E"
                                        color:"#e6e6e6"
                                    },
                                formatter: " {b} "
                            }
                        }
                    },
                    data: aType
                }
            ]
        };
        var oTheme={
                color: ['#15AD9E','#65C9BF','#00CCFF','#4dC7F6','#E4934D','#F6BA88','#F36E82']     
        };
        $("#Online_Time").echart("init", option,oTheme);
    }


    /*获取基于版本饼状图数据*/
    function initVersionData()
    {
        var oVerinfor = new Array();
        var y = 0;
        $.ajax({
            url:MyConfig.path+"/devmonitor/statistic_byver",
            type: "GET",
            dataType: "json",
            success: function(data){
                var statistics = data.statistics || [];
                for(var i = 0; i < statistics.length; i++)
                {
                    if( (statistics[i].devSoftVersion == "") || (statistics[i].devSoftVersion == null)){
                        continue;
                    }
                    var temp = {};
                    temp.name = statistics[i].devSoftVersion;
                    temp.value = statistics[i].count;
                    oVerinfor.push(temp);
                    ++y;
                    if( y == 10){
                        break;
                    }
                }

                /*画基于版本饼状图*/
                drawVersion(oVerinfor);
            },
            error: function(){

            }
        });
    }

    /*基于版本饼状图*/
    function drawVersion(oVersionData)
    {
        function getVersionList (ArrayT)
        {
            var atemp = [];
            $.each(ArrayT,function(index,iArray){
                atemp.push(
                    {
                        "devSN":iArray.devSN,
                        "devSoftVersion":iArray.devSoftVersion
                    }
                );
            });

            return atemp;
        }

        function onClickVersionPie (oPiece)
        {
            $.ajax({
                url:MyConfig.path+"/devmonitor/statistic_byver_detail",
                type: "GET",
                dataType: "json",
                data:{
                    devSoftVersion:oPiece.name,
                    skipnum:0,
                    limitnum:100000
                },
                success: function(data){
                    var all=getVersionList(data.acList);
                    $("#ByVersionPopList").SList("refresh",all);
                    Utils.Base.openDlg(null, {}, {scope:$("#ByVersionPop_diag"),className:"modal-super dashboard"});
                    return false;
                },
                error: function(){

                }
            });
        }

        //饼状图参数
        var option = {
            height:280,
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            series : [
                {
                    name: '',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:oVersionData,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
            $("#Version").echart("init",option);
    }

    /*获取基于型号饼状图数据*/
    function initModeData ()
    {
        var oModeinfor = new Array();
        var y = 0;
        $.ajax({
            url:MyConfig.path+"/devmonitor/statistic_bymode",
            type: "GET",
            dataType: "json",
            success: function(data){
                var statistics = data.statistics || [];
                for(var i = 0; i < statistics.length; i++)
                {
                    if( (statistics[i].devMode == "") || (statistics[i].devMode == null)){
                        continue;
                    }
                    var temp = {};
                    temp.name = statistics[i].devMode;
                    temp.value = statistics[i].count;
                    temp.isHave = 'No';

                    //过滤掉含有H3C的型号，去掉H3C
                    if(temp.name.indexOf("H3C") >= 0){
                        temp.name = temp.name.split("H3C")[1].trim();
                        temp.isHave = 'Yes';
                    }
                    oModeinfor.push(temp);
                    ++y;
                    if( y == 9){
                        break;
                    }
                }
                /*画基于型号饼状图*/
                drawModeinfor(oModeinfor);
            },
            error: function(){

            }
        });
    }

    /*基于型号饼状图*/
    function drawModeinfor(oModeData)
    {
        function getAcList (ArrayT)
        {
            var atemp = [];
            $.each(ArrayT,function(index,iArray){
                atemp.push(
                    {
                        "devSN":iArray.devSN,
                        "devMode":iArray.devMode
                    }
                );
            });

            return atemp;
        }

        function onClickDevModeePie (oPiece)
        {
            /*给需要的设备加上'H3C'前缀*/
            var relMode = oPiece.name;
            if(oPiece.data.isHave == 'Yes')
            {
                relMode = 'H3C '+ relMode;
            }

            $.ajax({
                url:MyConfig.path+"/devmonitor/statistic_bymode_detail",
                type: "GET",
                dataType: "json",
                data:{
                    devMode:relMode,
                    skipnum:0,
                    limitnum:100000
                },
                success: function(data){
                    var all=getAcList(data.acList);
                    $("#ByModePopList").SList("refresh",all);
                    Utils.Base.openDlg(null, {}, {scope:$("#ByModePop_diag"),className:"modal-super dashboard"});
                    return false;
                },
                error: function(){

                }
            });
        }

        /* 饼状图 */
        var option = {
            height:280,
            tooltip : {
                trigger: 'item',
                formatter: "{b} {a}{c} ({d}%)"
            },
            calculable : false,
            series : [
                {
                    name:"设备数：",
                    type:'pie',
                    radius : ['30%','50%'],
                    center: ['50%', '50%'],
                    itemStyle: {
                        normal: {
                            labelLine:{
                                length:10
                            },
                            label:
                            {
                                position:"outer",
                                textStyle:{
                                    color: "#e6e6e6"
                                },
                                formatter: " {b} "
                            }
                        }
                    },
                    data: oModeData
                }
            ]
        };
        var oTheme={
            color: ['#15AD9E','#65C9BF','#00CCFF','#4dC7F6','#E9541D','#ED7931','#E4934D','#F6BA88','#F36E82']
        };
        $("#Mode").echart("init", option,oTheme);
    }


    function drawFlowinfor(oFlowinfor)
    {
        function onClickFlowPie (oPiece) 
        {
            
            function getFlowList(ArrayT)
            {
                var atemp = [];
                $.each(ArrayT,function(index,iArray){
                    atemp.push(
                            {
                                "devSN":iArray.devSN,
                                "totalFlow":iArray.totalFlow,
                            }
                        );
                });

                return atemp;
            }
            var oTimeList = {
                ">=10T":[1024*1024*1024*10,-1],
                "1T~10T":[1024*1024*1024,1024*1024*1024*10],
                "100G~1T":[1024*1024*100,1024*1024*1024],
                "10G~100G":[1024*1024*10,1024*1024*100],
                "1G~10G":[1024*1024,1024*1024*10],
                "100M~1G":[1024*100,1024*1024],
                "0~100M":[0,1024*100]
            };
            $.ajax({
                url:MyConfig.path+"/devmonitor/statistic_byflow_detail",
                type: "GET",
                dataType: "json",
                data:{
                    minflow:oTimeList[oPiece.name][0],
                    maxflow:oTimeList[oPiece.name][1],
                    skipnum:0,
                    limitnum:100000
                },
                success: function(data){
                    var all=getFlowList(data.acList);
                    $("#ByFlowPopList").SList("refresh",all);
                    Utils.Base.openDlg(null, {}, {scope:$("#ByFlowPop_diag"),className:"modal-super dashboard"});
                    return false;
                },
                error: function(){
                   
                }
            });
        }
            
        var aType = [
            {name:'>=10T',value:oFlowinfor.cha6},
            {name:'1T~10T',value:oFlowinfor.cha5},
            {name:'100G~1T',value:oFlowinfor.cha4},
            {name:'10G~100G',value:oFlowinfor.cha3},
            {name:'1G~10G',value:oFlowinfor.cha2},
            {name:'100M~1G',value:oFlowinfor.cha1},
            {name:"0~100M",value:oFlowinfor.cha0}
        ];
        var option = {
            height:280,
            tooltip : {
                trigger: 'item',
                formatter: "{b} {a}{c} ({d}%)"
            },
            calculable : false,
            series : [
                {
                    name:"设备数：",
                    type:'pie',
                    radius : ['30%','50%'],
                    center: ['50%', '50%'],
                    itemStyle: {
                        normal: {
                            labelLine:{
                                length:10
                            },
                            label:
                            {
                                position:"outer",
                                textStyle:{
                                        color: "#e6e6e6"
                                    },
                                formatter: " {b} "
                            }
                        }
                    },
                    data: aType
                },
            ]
        };
        var oTheme={
                color: ['#15AD9E','#65C9BF','#00CCFF','#4dC7F6','#E4934D','#F6BA88','#F36E82']    
        };
        $("#Flow").echart("init", option,oTheme);
    }
    function drawApinfor(oApinfor)
    {
        function onClickApPie (oPiece) 
        {
            
            function getApList(ArrayT)
            {
                var atemp = [];
                $.each(ArrayT,function(index,iArray){
                    atemp.push(
                            {
                                "devSN":iArray.devSN,
                                "count":iArray.count,
                            }
                        );
                });

                return atemp;
            }
            var oTimeList = {
                ">=1024":[1024,-1],
                "256~1024":[256,1024],
                "128~256":[128,256],
                "64~128":[64,128],
                "32~64":[32,64],
                "16~32":[16,32],
                "8~16":[8,16],
                "4~8":[4,8],
                "0~4":[0,4]
            };
            $.ajax({
                url:MyConfig.path+"/apmonitor/statistics_byapcount_detail",
                type: "GET",
                dataType: "json",
                data:{
                    mincount:oTimeList[oPiece.name][0],
                    maxcount:oTimeList[oPiece.name][1],
                    skipnum:0,
                    limitnum:100000
                },
                success: function(data) {
                    var all=getApList(data.acList);
                    $("#ByApList").SList("refresh",all);
                    Utils.Base.openDlg(null, {}, {scope:$("#ByAp_diag"),className:"modal-super dashboard"});
                    return false;
                },
                error: function(){
                   
                }
            }); 
        }
            
        var aType = [
            {name:'>=1024',value:oApinfor.cha8},
            {name:'256~1024',value:oApinfor.cha7},
            {name:'128~256',value:oApinfor.cha6},
            {name:'64~128',value:oApinfor.cha5},
            {name:'32~64',value:oApinfor.cha4},
            {name:'16~32',value:oApinfor.cha3},
            {name:'8~16',value:oApinfor.cha2},
            {name:'4~8',value:oApinfor.cha1},
            {name:"0~4",value:oApinfor.cha0}
        ];
        var option = {
            height:280,
            tooltip : {
                trigger: 'item',
                formatter: "{b} {a}{c} ({d}%)"
            },
            calculable : false,
            series : [
                {
                    name:"设备数：",
                    type:'pie',
                    radius : ['30%','50%'],
                    center: ['50%', '50%'],
                    itemStyle: {
                        normal: {
                            labelLine:{
                                length:10
                            },
                            label:
                            {
                                position:"outer",
                                textStyle:{
                                        color: "#e6e6e6"
                                    },
                                formatter: " {b} "
                            }
                        }
                    },
                    data: aType
                },
            ]
        };
        var oTheme={
                color: ['#15AD9E','#65C9BF','#00CCFF','#4dC7F6','#E9541D','#ED7931','#E4934D','#F6BA88','#F36E82']  
                }
        $("#According_Ap").echart("init", option,oTheme);
    }
    function drawStationinfor (oStationinfor) 
    {
        function onClickStationPie (oPiece) 
        {
            function getByClientList(ArrayT)
            {
                var atemp = [];
                $.each(ArrayT,function(index,iArray){
                    atemp.push(
                            {
                                "devSN":iArray.devSN,
                                "count":iArray.Count,
                            }
                        );
                });

                return atemp;
            }
            var oTimeList = {
                ">=4096":[4096,-1],
                "2048~4096":[2048,4096],
                "1024~2048":[1024,2048],
                "256~1024":[256,1024],
                "128~256":[128,256],
                "64~128":[64,128],
                "32~64":[32,64],
                "0~32":[0,32]
            };
            $.ajax({
                url:MyConfig.path+"/stamonitor/statistic_byclientnum_detail",
                type: "GET",
                dataType: "json",
                data:{
                    leftnum:oTimeList[oPiece.name][0],
                    rightnum:oTimeList[oPiece.name][1],
                    skipnum:0,
                    limitnum:100000
                },
                success: function(data) {
                    var all=getByClientList(data.acList);
                    $("#ByClient").SList("refresh",all);
                    Utils.Base.openDlg(null, {}, {scope:$("#ByClient_diag"),className:"modal-super dashboard"});
                    return false;
                },
                error: function(){
                   
                }
            });
        }

        var aType = [
            {name:'>=4096',value:oStationinfor.cha7},
            {name:'2048~4096',value:oStationinfor.cha6},
            {name:'1024~2048',value:oStationinfor.cha5},
            {name:'256~1024',value:oStationinfor.cha4},
            {name:'128~256',value:oStationinfor.cha3},
            {name:'64~128',value:oStationinfor.cha2},
            {name:'32~64',value:oStationinfor.cha1},
            {name:"0~32",value:oStationinfor.cha0}
        ];
        var option = {
            height:280,
            tooltip : {
                trigger: 'item',
                formatter: "{b} {a}{c} ({d}%)"
            },
            calculable : false,
            series : [
                {
                    name:"设备数：",
                    type:'pie',
                    radius : ['30%','50%'],
                    center: ['50%', '50%'],
                    itemStyle: {
                        normal: {
                            labelLine:{
                                length:10
                            },
                            label:
                            {
                                position:"outer",
                                textStyle:{
                                        color: "#e6e6e6"
                                    },
                                formatter: " {b} "
                            }
                        }
                    },
                    data: aType
                },
            ]
        };
        var oTheme={
                color: ['#FA5A66','#E483A0','#E28F34','#F7C762','#ABD6F5','#86C5F2','#63B4EF','#3DA0EB','#1683D3','#136FB3']     
        };
        $("#According_Station").echart("init", option,oTheme);
      
    }

    function initForm ()
    {
        $("#Radio_detail").on("click", function(){
            Utils.Base.redirect ({np:"radiomonitor.radiodetails",ID:$(this).attr("id")});
            return false;
        });

        $("#baseline_list").on("click",'a', function(){
            openRadioDalg($(this).attr("BaselineName"),$(this).attr("Description"));
            return false;
        });

        $("#calibrate_list").on('click','a',function(){
            openDalg($(this).attr("Date"),$(this).attr("Time"));
            return false;
        });
        // $("#refresh_Summary").on("click", initSummaryData);
        $("#refresh_Online").on("click",initOnlineTimeData);
        $("#refresh_version").on("click",initVersionData);
        $("#refresh_mode").on("click",initModeData);
        $("#refresh_flow").on("click",initFlowData);
        $("#refresh_Ap").on('click',initApData);
        $("#refresh_Station").on("click",initStationData);
    }

    function openRadioDalg (sBaselineName,sDescription) 
    {
        function myCallback (oInfo) 
       {
            var aBaselineInfoBody = Utils.Request.getTableRows (NC.BaselineInfoBody,oInfo) ||[];
            var aRadioRunningCfg =Utils.Request.getTableRows (NC.RadioRunningCfg,oInfo) || [];  
            var aNewRadio =[];
            for (var i = 0;i<aBaselineInfoBody.length;i++)
            {
                for(var j=0;j<aRadioRunningCfg.length;j++)
                {
                    if (aBaselineInfoBody[i].ApName == aRadioRunningCfg[j].ApName && aBaselineInfoBody[i].RadioID == aRadioRunningCfg[j].RadioID)
                        {
                            aBaselineInfoBody[i].RadioID =  Utils.AP.radioDisplay(aRadioRunningCfg[j].Mode,aRadioRunningCfg[j].RadioID);
                        }   
                }
                if(aBaselineInfoBody[i].BaselineName==sBaselineName)
                {
                    var temp={
                        "ApName":aBaselineInfoBody[i].ApName,
                        "RadioID":aBaselineInfoBody[i].RadioID,
                        "RadioType":aBaselineInfoBody[i].RadioType,
                        "PrimaryChannel":aBaselineInfoBody[i].PrimaryChannel,
                        "Power":aBaselineInfoBody[i].Power,
                        "BandWidth":aBaselineInfoBody[i].BandWidth,
                        "RegionCode":aBaselineInfoBody[i].RegionCode    
                    };
                    aNewRadio.push(temp);       
                }
            } 
            $("#RadioList").SList("refresh", aNewRadio);
            Utils.Base.openDlg(null, {}, {scope:$("#Radio_diag"),className:"modal-super dashboard"});
            return false; 
       }
    }

    function openDalg (sDate,sTime) 
    {
       function myCallback (oInfo) 
       {
            var aHistory = Utils.Request.getTableRows (NC.History,oInfo) ||[];
            var aRadioRunningCfg =Utils.Request.getTableRows (NC.RadioRunningCfg,oInfo) || [];  
            var aNewChlPwr =[];
            for (var i = aHistory.length-1;i>0;i--)
            {
                
                aHistory[i].Date = aHistory[i].ChangeTime.split("T")[0] || "--";
                aHistory[i].Time = aHistory[i].ChangeTime.split("T")[1] || "--";
                if(aHistory[i].Date==sDate&&aHistory[i].Time==sTime)
                { 
                    aHistory[i].Reason=getCalReason(aHistory[i].ReasonBitMap);
                    for(var j=0;j<aRadioRunningCfg.length;j++)
                    {
                        if (aHistory[i].ApName == aRadioRunningCfg[j].ApName && aHistory[i].RadioID == aRadioRunningCfg[j].RadioID)
                            {
                                aHistory[i].RadioID =  Utils.AP.radioDisplay(aRadioRunningCfg[j].Mode,aRadioRunningCfg[j].RadioID);
                            }   
                    }
                
                    var tempChlPwr={
                        "ApName":aHistory[i].ApName,
                        "RadioID":aHistory[i].RadioID,
                        "Reason":getReasonDetail(aHistory[i].Reason),
                        "ChlNumBef":aHistory[i].ChlNumBef,
                        "ChlNumAft":aHistory[i].ChlNumAft,
                        "PwrLvlBef":aHistory[i].PwrLvlBef,
                        "PwrLvlAft":aHistory[i].PwrLvlAft    
                    };
                    aNewChlPwr.push(tempChlPwr);       
                }
            } 
            $("#ChlPwrList").SList("refresh", aNewChlPwr);
            Utils.Base.openDlg(null, {}, {scope:$("#ChlPwr_diag"),className:"modal-super dashboard"});
            return false; 
       }
     
    }
    function initOnlineTimeData() 
    {
        $.ajax({
                url:MyConfig.path+"/devmonitor/statistic_bytimeon",
                type: "GET",
                dataType: "json",
                success: function(data){
                    oInfor = {
                        cha0:data.statistics[0].count,
                        cha1:data.statistics[1].count,
                        cha2:data.statistics[2].count,
                        cha3:data.statistics[3].count,
                        cha4:data.statistics[4].count,
                        cha5:data.statistics[5].count,
                        cha6:data.statistics[6].count,
                    };
                    drawOnlineTime(oInfor);
                },
                error: function(){
                   
                }
            });
    }

    function initFlowData ()
    {
        $.ajax({
            url:MyConfig.path+"/devmonitor/statistic_byflow",
            type: "GET",
            dataType: "json",
            success: function(data){
                oFlowinfor = {
                    cha0:data.statistics[0].count,
                    cha1:data.statistics[1].count,
                    cha2:data.statistics[2].count,
                    cha3:data.statistics[3].count,
                    cha4:data.statistics[4].count,
                    cha5:data.statistics[5].count,
                    cha6:data.statistics[6].count,
                };
               drawFlowinfor(oFlowinfor);
            },
            error: function(){
               
            }
        });
    }   
    function initApData () {
        $.ajax({
            url:MyConfig.path+"/apmonitor/statistics_byapcount",
            type: "GET",
            dataType: "json",
            success: function(data){
                oApinfor = {
                    cha0:data.statistics[0].count,
                    cha1:data.statistics[1].count,
                    cha2:data.statistics[2].count,
                    cha3:data.statistics[3].count,
                    cha4:data.statistics[4].count,
                    cha5:data.statistics[5].count,
                    cha6:data.statistics[6].count,
                    cha7:data.statistics[7].count,
                    cha8:data.statistics[8].count,
                };
               drawApinfor(oApinfor);
            },
            error: function(){
               
            }
        });
    }
    function initStationData () 
    {
         $.ajax({
            url:MyConfig.path+"/stamonitor/statistic_byclientnum",
            type: "GET",
            dataType: "json",
            success: function(data){
                oStationinfor = {
                    cha0:data.statistics[0].count,
                    cha1:data.statistics[1].count,
                    cha2:data.statistics[2].count,
                    cha3:data.statistics[3].count,
                    cha4:data.statistics[4].count,
                    cha5:data.statistics[5].count,
                    cha6:data.statistics[6].count,
                    cha7:data.statistics[7].count,

                };
                drawStationinfor(oStationinfor);
            },
            error: function(){
               
            }
        });
    }
    function initGrid()
    {
        var optChlPop ={
            colNames:getRcText ("List_ByOnline"),
            showHeader:true,
            colModel: [
                {name:"devSN",datatype:"String"},
                {name:"devOnlineTime",datatype:"String"}
            ]
        };
        $("#ByOnlinePopList").SList ("head",optChlPop);

        var optIntPop ={
            colNames:getRcText ("List_ByVersion"),
            showHeader:true,
            colModel: [
                {name:"devSN",datatype:"String"},
                {name:"devSoftVersion",datatype:"String"}
            ]
        };
        $("#ByVersionPopList").SList ("head",optIntPop);

        var optNoiPop ={
            colNames:getRcText ("List_ByMode"),
            showHeader:true,
            colModel: [
                {name:"devSN",datatype:"String"},
                {name:"devMode",datatype:"String"}
            ]
        };
        $("#ByModePopList").SList ("head",optNoiPop);

        

        var optNonPop ={
            colNames:getRcText ("List_ByFlow"),
            showHeader:true,
            colModel: [
                {name:"devSN",datatype:"String"},
                {name:"totalFlow",datatype:"String"}
            ]
        };
        $("#ByFlowPopList").SList ("head",optNonPop);

        var optByApPop ={
            colNames:getRcText ("List_ByAp"),
            showHeader:true,
            colModel: [
                {name:"devSN",datatype:"String"},
                {name:"count",datatype:"String"}
            ]
        };
        $("#ByApList").SList ("head",optByApPop);

        var optByClientPop ={
            colNames:getRcText ("List_ByClient"),
            showHeader:true,
            colModel: [
                {name:"devSN",datatype:"String"},
                {name:"count",datatype:"String"}
            ]
        };
        $("#ByClient").SList ("head",optByClientPop);

        var opt_acHead = {
            colNames:getRcText("List_Ac"),
            showHeader:true,
            multiSelect:false,
            pageSize:10,
            colModel:[
                {name:"user",dataType:"String",width:70},
                {name:"shopName",dataType:"String",width:100},
                {name:"devsn",dataType:"String",width:100},
                {name:"apCount",dataType:"Integer",width:50},
                {name:"onlineApCount",dataType:"Integer",width:50},
                {name:"onlineClientCount",dataType:"Integer",width:50},
                {name:"time",dataType:"Integer",width:50}
            ]
        };
        $("#acList").SList("head",opt_acHead);
    }

    /*AC列表模块数据获取*/
    function getAcListData(){

        $.ajax({
            url:MyConfig.path + '/diagnosis_read/web/getAcListinfo',
            type:'get',
            dataType:'json',
            success:function(data){

                /*解析列表数据*/
                analyseAcListData(data);
            }
        })
    }


    function analyseAcListData(data){

        data = data || [];
        var optData = [];
        for(var i = 0 ; i < data.length ; i++){
            optData[i] = {};
            optData[i].user = data[i].user;
            optData[i].shopName = data[i].shopName;
            optData[i].devsn = data[i].devSN;
            optData[i].apCount = data[i].totalAp;
            optData[i].onlineApCount = data[i].onlineAp.toString();
            optData[i].onlineClientCount = data[i].client.toString();
            if(data[i].time)
            {
                optData[i].time = data[i].time.toString();
            }
            else
            {
                optData[i].time = "0";
            }
        }

        optData.sort(compare("apCount"));

        function compare(prob){
            return function(obj1,obj2){
                var val1 = obj1[prob];
                var val2 = obj2[prob];
                if(val1 < val2){
                    return 1;
                }
                else if( val1 > val2){
                    return -1;
                }
                else{
                    return 0;
                }
            }
        }

        for(var i in optData){
            optData[i].apCount = optData[i].apCount.toString();
        }

        $("#acList").SList("refresh",optData);
    }

    function _init ()
    {
    	initGrid();
    	initForm();
        initOnlineTimeData();
        initVersionData();
        initModeData();
        initFlowData();
        initApData();
        initStationData();

        /*AC列表*/
        getAcListData();
    }

    function _destroy ()
    {
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init, 
        "destroy": _destroy, 
        "widgets": ["SList","Echart"],
        "utils":["Request","Base"]
    });   
})( jQuery );