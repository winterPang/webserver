;(function ($) {
	var MODULE_BASE = "networkanalysis";
    var MODULE_NAME = MODULE_BASE + ".index";
    var g_oTimer = false;
    var oInfor = {};
    var g_aTodaySpanData = [],
        g_aYesterDaySpanData = [];
    var g_bAdIsHistory = false;
    var g_sRdModeId = "2";

    function getRcText (sRcName) 
    {
    	return Utils.Base.getRcString("summary_rc",sRcName);
    }
    
    function drawEmptyPie(pid,cid)
    {
        var option = {
            height:200,
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

    function drawVersion(oVerinfor) 
    {
        var  option = {
                height:200,
                // title : {
                //     text: '南丁格尔玫瑰图',
                //     subtext: '纯属虚构',
                //     x:'center'
                // },
                tooltip : {
                    trigger: 'item',
                    formatter: "{b} : {c} ({d}%)"
                },
                // toolbox: {
                //     show : true,
                //     feature : {
                //         mark : {show: true},
                //         dataView : {show: true, readOnly: false},
                //         magicType : {
                //             show: true, 
                //             type: ['pie', 'funnel']
                //         },
                //         restore : {show: true},
                //         saveAsImage : {show: true}
                //     }
                // },
                calculable : true,
                series : [
                    {
                        name:'操作系统',
                        type:'pie',
                        radius : [15, 90],
                        center : ['50%', '50%'],
                        roseType : 'radius',
                        width: '40%',       // for funnel
                        max: 40,            // for funnel
                        itemStyle : {
                            normal : {
                                label : {
                                    show : false
                                },
                                labelLine : {
                                    show : false
                                }
                            },
                            emphasis : {
                                label : {
                                    show : true
                                },
                                labelLine : {
                                    show : true
                                }
                            }
                        },
                        data:[
                            {value:25, name:'UNIX'},
                            {value:25, name:'Linux'},
                            {value:35, name:'Windows'},
                            {value:10, name:'Mac OS X'},
                            {value:5, name:'Chrome OS'}
                        ]
                    }
                ]
            };
        var oTheme = {};
        $("#Version").echart("init", option,oTheme);
    }

    var g_oAllModeInfo = [
        //0
        {
        aModeId : ['M_Dashboard','M_ClientInfor','M_RateAnalyse','M_DeviceInfor','M_NetworkInfor','M_Health','M_HotImg','M_WipsConfig','M_LOG','M_WirelessService','M_User','M_MonConfigH','M_APPConfigh','M_GDingWei','M_AUTHTEMPLATE','M_PAGETEMPLATE','M_WeixinPublicmessage','M_CHATSTORE','M_Probe','M_DPI','M_Trial'],
        aModeName : ['设备概览','终端信息','流量分析','设备信息','网络信息','网络体检','网络热图','无线安全','告警日志','无线配置','用户管理','安全策略','应用配置','网络地图','认证模板','页面模板','公众号','微信门店','访客数据','应用分析','终端轨迹']
        },
        //1
        {
        aModeId : ['X_xSystem','X_xAdAnalysis','X_xProbe','X_xDetail','X_xCustomerStat','X_xDeviceInfo','X_xAlermEvent','X_xNetworkCfg','X_xAdvertManage','X_xRelateId','X_xRateLimit','X_xDeviceManage','X_xAPPConfig','X_xBackUp','X_xmaintainLog'],
        aModeName : ['网络概览','广告分析','流客统筹概览','访客分析','宾客统计','设备信息','告警记录','无线配置','广告编辑','微信公众号','宾客限速','设备管理','应用配置','云备份','维护日志']
        },
        //2
        {
        aModeId : ['W_SummaryInfo','W_Clients','W_APs','W_SerTem','M_WipsConfig','M_LOG','M_WirelessService','M_User','M_MonConfigH','M_AuthManage','M_Publicmessage','M_CHATSTORE_01','W_RELEASEMange','M_ConfigRe','M_Version','M_Measure','M_File','M_Order','M_LOG'],
        aModeName : ['设备概览','无线终端','AP信息','无线服务','无线安全','告警日志','无线配置','用户管理','安全策略','认证配置','公众号','微信门店','发布管理','配置还原','软件升级','终端测量','文件系统','命令助手','维护日志']
        },
        //3
        {
        aModeId : ['F_DashboardInfo','F_Device','F_Ap','F_Terminal','M_LOG','F_App','F_WlanSer','F_ApSet','F_Soft','F_Termin','F_Orderhelp'],
        aModeName : ['概览','设备信息','AP信息','终端信息','告警日志','应用配置','服务配置','服务绑定','软件升级','终端测量','命令助手']
        },
        //4
        {
        aModeId : ['C_CDashboard','C_SManage','C_CManage','C_SHealth','C_STrace','C_CStatics','C_SumSub','C_ClaSub','C_BraSub','C_InfSub','C_InforSub'],
        aModeName : ['校园概览','学生管理','班级管理','健康管理','学生追踪','课堂统计','课堂统计','电子课堂','手环监控','手环管理','手环管理']
        },
        //5
        {
        aModeId : ['P_DashboardInfo','P_Adtotal','P_Wechatpublic','P_Customer','P_Ap','M_HotImg','M_WipsConfig','M_LOG','P_Ap','p_Serviceset','p_Bindservice','P_Wepubnum','P_Westore','P_Pagetemplate','P_Portaltemplate','P_Security','P_Count','P_Netmap','P_AppmanageInfo','P_Cusdpiinfo','P_CuAnalysisinfo','P_Wirelesslocationinfo'],
        aModeName : ['网络概览','广告统计','公众号','宾客信息','AP信息','网络热图','无线安全','告警日志','AP组管理','服务配置','服务绑定','公众号','微信门店','页面模板','认证模板','安全策略','账号管理','网络地图','应用配置','流客探针','行为分析','无线定位']
        },
         //6
        {
        aModeId : ['City_Map','City_DashboardInfo','City_Ap','City_TerminalInfo','City_Security','City_Log','City_Location01','C_WirelessCfg','City_ApGrpCfg01','C_User','City_MonConfig01','City_APPConfigh01','M_RadioMeasure','M_Reboot','City_ReconnectCloudPipe','M_ConfigRe','M_Version','M_Order'],
        aModeName : ['城市地图','设备概览','AP信息','无线终端','无线安全','告警日志','城区划分','无线配置','AP组配置','账号管理','安全策略','应用配置','终端测量','设备重启','重置隧道','配置还原','软件升级','命令助手']
        },
         //7
        {
        aModeId : ['HQ_SummaryInfo','HQ_AdClient','HQ_WechatAd','HQ_CustomerStat','HQ_branchesInfor','HQ_APs','HQ_NetHotImg','HQ_WipsConfig','HQ_LOG','M_WirelessService','M_User','M_MonConfigH','M_AuthManage','M_Publicmessage','M_CHATSTORE_01','W_RELEASEMange','M_ConfigRe','M_Version','M_Measure','M_File','M_Order','M_LOG'],
        aModeName : ['网络概览','广告点击','微信营销','宾客信息','分支信息','AP信息','网络热图','无线安全','告警日志','无线配置','用户管理','安全策略','认证配置','公众号','微信门店','发布管理','配置还原','软件升级','终端测量','文件系统','命令助手','维护日志']
        }                              
    ]



    function drawModeinfor(oModeinfor)
    {
        var sModeName = null;
        var nModeIndex = -1;
        var aShowCount = [];
        var aShowTime = [];
        var nSumCount = 0;
        var nSumTime = 0;

        for (var i = 0; i < g_oAllModeInfo[g_sRdModeId].aModeId.length; i++)
        {
            aShowCount[i] = 0;
            aShowTime[i] = 0;
        }

        for(var i = 0; i < oModeinfor.length; i++)
        {
            sModeName = oModeinfor[i].url.split('#')[1];

            nModeIndex = g_oAllModeInfo[g_sRdModeId].aModeId.indexOf(sModeName);
            if (nModeIndex >= 0)
            {
                aShowCount[nModeIndex] += oModeinfor[i].PV;
                nSumCount += oModeinfor[i].PV;
                aShowTime[nModeIndex] += parseInt(oModeinfor[i].STP/1000);
                nSumTime += parseInt(oModeinfor[i].STP/1000);
            }
        }

        for(var i = 0; i < aShowCount.length; i++)
        {
            if (nSumCount != 0)
            {
                aShowCount[i] = aShowCount[i]/nSumCount;
            }
            if (nSumTime != 0)
            {
                aShowTime[i] = aShowTime[i]/nSumTime;
            }
        }

        var option = {
                height:800,
                // title: {
                //     text: '多维条形图',
                //     subtext: 'From ExcelHome',
                //     sublink: 'http://e.weibo.com/1341556070/AiEscco0H'
                // },
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    },
                    //formatter : '{b}<br/>{a0}:{c0}%<br/>{a1}:{c1}%<br/>'
                    formatter : function(data){
                        console.log(data);
                        return "访问次数:"+parseInt(data[0].value*nSumCount)+"次"+"<br/>"+"驻留时间:"+parseInt(data[1].value*nSumTime)+"秒";
                    }
                },
                legend: {
                    data:['访问次数', '驻留时间'],
                    textStyle:{
                        color:'#e6e6e6'
                    }
                },
                xAxis : [
                    {
                        type : 'value',
                        show : false,
                        splitLine: {show: false},
                        axisLabel: {show: false},
                        axisLine:{
                            lineStyle:{
                                color:'#e6e6e6'
                            }
                        },
                        axisLabel : {
                            show : true,
                            textStyle : {
                            color : '#e6e6e6',
                                }
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'category',
                        splitLine: {show: false},
                        data : g_oAllModeInfo[g_sRdModeId].aModeName,
                        yxisLine:{
                            lineStyle:{
                                color:'#e6e6e6'
                            }
                        },
                        axisLabel : {
                            show : "false",
                            textStyle : {
                                color : '#e6e6e6'
                                },
                            },
                        axisLine: {
                            show:true,
                            lineStyle :{color: '#fff', width: 1},
                            textStyle:{color: '#fff'} 
                            }
                        
                    }
                ],
                series : [

                    {
                        barCategoryGap:'50%',
                        name:'访问次数',
                        type:'bar',
                        stack: '总量',
                        itemStyle : { normal: {label : {show: true, position: 'insideRight', formatter: function(data)
                            {
                                if (data.value*100 < 1)
                                {
                                    return;
                                }
                                else
                                {
                                    return (data.value*100).toFixed(1)+'%';
                                }
                            }}}},
                        data:aShowCount
                        //data: [44,55,77,88,99,00,4,5,7,88,44,88,55,77,66,33,556,889,43,553,578,323]
                        //data:[1]
                        //data: 
                    },
                    {
                        barCategoryGap:'50%',
                        name:'驻留时间',
                        type:'bar',
                        stack: '总量',
                        itemStyle:{ normal: {label : {show: true, position: 'insideRight', formatter: function(data)
                            {
                                if (data.value*100 < 1)
                                {
                                    return;
                                }
                                else
                                {
                                    return (data.value*100).toFixed(1)+'%';
                                }
                            }}}},
                        data:aShowTime
                        //data: [44,55,77,88,99,00,4,5,7,88,44,88,55,77,66,33,556,889,43,553,578,323]
                        //data:[99]
                    }
                ]
            };
                    
        // var oTheme={
        //          color: ['#0C6C61','#15AD9E','#65C9BF','#AEF4ED','#038DB0','#00CCFF','#4dC7F6','#89DBFB','#E9541D','#ED7931','#E4934D','#F6BA88','#E74D65','#F36E82']   
        // };
        var oTheme={
            color: ['#15ad9e','#e74d65']
        };
        $("#Mode").echart("init", option,oTheme);
    }

    function drawFlowinfor(oFlowinfor)
    {
        // $("#Current").text(Utils.Base.addComma(oFlowinfor.Total));
        // if (oFlowinfor.Total == 0)
        // {
        //     drawEmptyPie("NonInter","NONINTER");
        //     return;
        // }

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
                formatter: "{b}{a}{c} ({d}%)"
            },
            calculable : false,
            series : [
                {
                    name:"设备数：",
                    type:'pie',
                    radius : ['40%','65%'],
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
            ,click:onClickFlowPie,    
        };
        var oTheme={
                color: ['#15AD9E','#65C9BF','#00CCFF','#4dC7F6','#E4934D','#F6BA88','#F36E82']    
        };
        $("#Flow").echart("init", option,oTheme);
    }
    function drawApinfor(oApinfor)
    {
        // $("#Current").text(Utils.Base.addComma(oNoninterinfor.Total));
        // if (oNoninterinfor.Total == 0)
        // {
        //     drawEmptyPie("NonInter","NONINTER");
        //     return;
        // }

       
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
                formatter: "{b}{a}{c} ({d}%)"
            },
            calculable : false,
            series : [
                {
                    name:"设备数：",
                    type:'pie',
                    radius : ['40%','65%'],
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
            ,click:onClickApPie,    
        };
        var oTheme={
                color: ['#15AD9E','#65C9BF','#00CCFF','#4dC7F6','#E9541D','#ED7931','#E4934D','#F6BA88','#F36E82']  
                }
        $("#According_Ap").echart("init", option,oTheme);
    }
    function drawStationinfor (oStationinfor) 
    {
        // $("#Current").text(Utils.Base.addComma(oNoninterinfor.Total));
        // if (oNoninterinfor.Total == 0)
        // {
        //     drawEmptyPie("NonInter","NONINTER");
        //     return;
        // }
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
            // Utils.Base.redirect({
            //     np:"wdashboard.allterminal",
            //     name:oPiece.name
            // });
  
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
                formatter: "{b}{a}{c} ({d}%)"
            },
            calculable : false,
            series : [
                {
                    name:"设备数：",
                    type:'pie',
                    radius : ['40%','65%'],
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
            ,click:onClickStationPie,    
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
        var thisId = "page-view";
        var thisType = "today";
        var thisScene = "2";
        // $("input[name='view-info']").on("click", function () {
        //     var self = $(this);
        //     thisId = self.attr("id");
        //     console.log(thisId);
        //     drawAdShowCount(thisId, thisType);
        // });
        $("#todayAd").on("click", function () {
            $(this).css("color", "#343e4e");
            $("#yesterdayAd").css("color", "#80878c");
            $("#historyAd").css("color", "#80878c");
            thisType = "today";
            g_bAdIsHistory = false;
            getAdvertMessage("today", drawAdShowCount);
        });
        $("#yesterdayAd").on("click", function () {
            $(this).css("color", "#343e4e");
            $("#todayAd").css("color", "#80878c");
            $("#historyAd").css("color", "#80878c");
            thisType = "yesterday";
            g_bAdIsHistory = false;
            getAdvertMessage("yesterday", drawAdShowCount);
        });
         $("#historyAd").on("click", function () {
            $(this).css("color", "#343e4e");
            $("#yesterdayAd").css("color", "#80878c");
            $("#todayAd").css("color", "#80878c");
            thisType = "yesterday";
            g_bAdIsHistory = true;
            getAdvertMessage("history", drawAdShowCount);
        });
         $("#refresh_Ad").on("click", function() {
            getAdvertMessage(thisType, drawAdShowCount);
         })
         $("#selectList").on("change", function(oChange){
            var nIndex = 0;
            nIndex = g_oAllSceneInfo.aSceneName.indexOf(oChange.val);
            if (nIndex >= 0)
            {   
                thisScene = g_oAllSceneInfo.aSceneId[nIndex];       
                g_sRdModeId =  thisScene;   
                getModeData(thisScene, drawModeinfor);
            }
         })
        // $("#refresh_Summary").on("click", initSummaryData);
        $("#refresh_mode").on("click",function() {
            getModeData(thisScene, drawModeinfor);
        });

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

    function getAdvertMessage(strDay,onSuccess) 
    {
        var oDestTime = new Date();
        var nCount = 24;

        switch (strDay)
        {
            case 'today':
                oDestTime.setHours(23, 59, 59, 999);
                break;

            case 'yesterday':
                oDestTime.setHours(23, 59, 59, 999);
                oDestTime.setDate(oDestTime.getDate()-1);
                break;

            case 'history':
                oDestTime.setHours(23, 59, 59, 999);
                nCount = 120;
                break;

            default:
                break;
        }

        //console.log(oDestTime);

        $.ajax({
            url: "/rd/pagestat/getLvzhouEntireSampleStat",
            type: "POST",
            dataType: "json",
            //contentType:"application/json",
            data:{
                    "endTime": oDestTime,
                    "interval": 1,
                    "count": nCount
                },
            success: onSuccess,

            error: function()
            {
                console.log('send failed');   
            }
        });

        return;
    }

    function drawAdShowCount(adverDate) {
        var aVisitCount = [];
        var aTimer = [];
        var oMsgDate = null;

        for (var i = 0; i < 24; i++)
        {
            aVisitCount[i] = 0;
            aTimer[i] = 0;
        }

        if (true == g_bAdIsHistory)
        {
            for (var i = 0; i < adverDate.length; i++)
            {
                oMsgDate = new Date(adverDate[i].recordTime);
                aVisitCount[oMsgDate.getHours()] += adverDate[i].PV;
                aTimer[oMsgDate.getHours()] += parseInt(adverDate[i].ATP/1000);
            }

            for (var i = 0; i < aVisitCount.length; i++)
            {
                aVisitCount[i] = parseInt(aVisitCount[i]/5);
                aTimer[i] = parseInt(aTimer[i]/5);
            }
        }
        else
        {
            for (var i = 0; i < adverDate.length; i++)
            {
                oMsgDate = new Date(adverDate[i].recordTime);
                aVisitCount[oMsgDate.getHours()] = adverDate[i].PV;
                aTimer[oMsgDate.getHours()] = parseInt(adverDate[i].ATP/1000);
            }
        }

        //aVisitCount[0]=5;

//if test
    
        // data = [];
        // data1 = [];
        // for(k=0; k<24; k++)
        // {
        //     data.push(parseInt(Math.random()*500+200));
        //     data1.push(parseInt(Math.random()*500+200));
        // }

//end if
        option = {
            width: "100%",
            height: 400,
            title: false,
            tooltip: {
                trigger: 'axis', 
                axisPointer:{
                    type : 'none'
                },
                formatter: function (data) {
                    return '浏览量:'+data[0].value+'<br/>'+'平均访问时长:'+data[1].value;
                }
            },
            legend: {
                data:['浏览量','平均访问时长'],
                textStyle:{
                    color:'#e6e6e6'
                }
            },
            grid: {
                show: "false"
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: true,
                    splitLine: {
                        show: true,
                        textStyle: { color: '#c9c4c5', fontSize: "1px", width: 4 },
                        lineStyle: {
                            // 使用深浅的间隔色
                            color: ['#333']
                        }
                    },
                    axisLabel: {
                        show: true,
                        formatter:'{value}h',
                        textStyle: { color: '#fff', fontSize: "12px", width: 2 }
                    },
                    axisLine: {
                        show:true,
                        lineStyle :{color: '#fff', width: 1},
                        textStyle:{color: '#fff'} 
                        },
                    data: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18'
                        , '19', '20', '21', '22', '23']
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '浏览量',
                    splitLine: {
                        show: true,
                        textStyle: { color: '#c9c4c5', fontSize: "1px", width: 4 },
                        lineStyle: {
                            // 使用深浅的间隔色
                            color: ['#333']
                        }
                    },
                    axisLabel: {
                        show: true,
                        formatter:'{value} 次',
                        textStyle: { color: '#fff', fontSize: "12px", width: 2 }
                    },
                    axisLine: {
                        show: true,
                        lineStyle: { color: '#fff', width: 1 }
                    }
                },
                {
                    type: 'value',
                    name: '平均访问时长',
                    splitLine: {
                        show: true,
                        textStyle: { color: '#c9c4c5', fontSize: "1px", width: 4 },
                        lineStyle: {
                            // 使用深浅的间隔色
                            color: ['#333']
                        }
                    },
                    axisLabel: {
                        show: true,
                        formatter:'{value} 秒',
                        textStyle: { color: '#fff', fontSize: "12px", width: 2 }
                    },
                    axisLine: {
                        show: true,
                        lineStyle: { color: '#fff', width: 1 }
                    }
                }
            ],
            series: [
                {
                    name: '浏览量',
                    type: 'bar',
                    barCategoryGap: '40%',
                    data: aVisitCount,
                    itemStyle: {
                        normal: {
                            label: {
                                show: false,
                                position: 'insideTop',
                                formatter: function (data) {
                                    return data.value;

                                }
                            },
                            color: '#15ad9e'
                        }
                    }

                },
                {
                    name: '平均访问时长',
                    type: 'line',
                    yAxisIndex: 1,
                    data: aTimer,
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                position: 'insideTop',
                                formatter: function (data) {
                                    return data.value;

                                }
                            },
                            color: '#e74d65'
                        }
                    }
                }
            ]
        };
        var oTheme = {
            color: ['#48BEF4', '#FCE1DC']
        };
        $("#adShowCount").echart("init", option, oTheme);

    }


    function getModeData(sModeId, onSuccess)
    {
        $.ajax({
            url:"/rd/pagestat/getLvzhouAllSumStatForModel",
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                    "modelId": sModeId,
                    "startTime": new Date("Jun 14 2016 0:0:0"),
                    "endTime": new Date()
                }),
            success: onSuccess,
            error: function(){
                console.log("send error");
            }
        });
    }

    function initModeData()
    {
        getModeData("2", drawModeinfor);
    }
 
     function getAdvertBySpan(onSuccess,onFailed) {
        var opt = {
            type: "GET",
            url: 'aa',
            headers: { Accept: "application/json" },
            dataType: "json",
            onSuccess:onSuccess,
            onFailed:onFailed
        }

        Utils.Request.sendRequest(opt);
    }
    function initAdvert() 
    {
        getAdvertMessage('today', drawAdShowCount);
    }

    function initGrid()
    {
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
    }

    var g_oAllSceneInfo = {
        aSceneName: [ "园区Wi-Fi","中小企业","商铺Wi-Fi","总部商业Wi-Fi","园区商业Wi-Fi","园区商业Wi-Fi(全国连锁)","智慧城市","未来教室"],
        aSceneId: ['2','0','1','7','5','3','6','4']
    }

    function initSelect()
    {
         $("#selectList").singleSelect("InitData",g_oAllSceneInfo.aSceneName); //{"allowClear":"false"}
         $("#selectList").singleSelect("value", '园区Wi-Fi');
    }

    function initData(){
        initAdvert();
        initSelect();
    }
    function _init ()
    {
    	initGrid();
    	initForm();
        initData();
        initModeData();
    }

    function _destroy() {
        g_aTodaySpanData = [],
        g_aYesterDaySpanData = [];
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init, 
        "destroy": _destroy, 
        "widgets": ["SList","Echart","SingleSelect"],
        "utils":["Request","Base"],
    });   
})( jQuery );