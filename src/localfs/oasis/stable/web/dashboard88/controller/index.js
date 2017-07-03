define(['jquery', 'echarts3','moment','utils','bootstrap-daterangepicker', 'angular-ui-router', 'bsTable', '../lib/echarts-liquidfill','css!bootstrap_daterangepicker_css', 'css!dashboard88/css/index.css'], function ($, echarts, moment,Utils) {
    return ['$scope', '$http', '$state', '$rootScope','$stateParams','$alertService','$timeout', function ($scope, $http, $state, $rootScope,$stateParams,$alert,$timeout) {
        var URL_GET_HEALTH = '/v3/health/home/health';
        var URL_GET_BAND=  '/v3/devmonitor/getbandwidth';
        var URL_SET_BAND='/v3/devmonitor/setbandwidth';
        var getWanTrafficDataUrl=Utils.getUrl('GET','','/devmonitor/web/wantraffic','../../init/dashboard88/log_msg.json');
        var getAPsUrl = Utils.getUrl('GET', '', '/apmonitor/getApCountByStatus', '../../init/dashboard88/ap_statistics.json');
        var getTerminalCountUrl=Utils.getUrl('GET','','/stamonitor/getclientlistbycondition','../../init/dashboard88/log_msg.json');
        var getSpeedBy10MinUrl=Utils.getUrl('GET', '', '/devmonitor/getwanspeeddayhistby10Min', '../../init/dashboard88/ap_statistics.json');
        var getCpuHistUrl=Utils.getUrl('GET', '', '/devmonitor/gethistcpuratioinfoby10Min', '../../init/dashboard88/ap_statistics.json');
        var getMemoryHistUrl=Utils.getUrl('GET', '', '/devmonitor/gethistmemoryratioinfoby10Min', '../../init/dashboard88/ap_statistics.json');
        var getClientUrl = Utils.getUrl('POST', '', '/stamonitor/monitor', '../../init/dashboard88/ap_statistics.json');
        $scope.urlObj = {
            getAllInterfaces:Utils.getUrl('GET', '', '/devmonitor/getAllInterfaces', '/init/dashboard2/get_ap_count_by_status.json'),
            setOneInterface:Utils.getUrl('GET', '', '/devmonitor/setOneInterfaceNew', '/init/dashboard2/get_ap_count_by_status.json'),
            getOneInterfaceData:Utils.getUrl('GET', '', '/devmonitor/getOneInterfaceDataNew', '/init/dashboard2/get_ap_count_by_status.json'),
            getAllinterfacesFlow:Utils.getUrl('GET', '', '/devmonitor/getAllInterfacesFlowNew', '/init/dashboard2/get_ap_count_by_status.json')
        };
        var getAllinterfaceFlow=Utils.getUrl('GET', '', '/devmonitor/getAllInterfacesFlow', '/init/dashboard2/get_ap_count_by_status.json');
        var g_startTime=new Date(new Date().toLocaleDateString()).getTime();
        var g_endTime=new Date().getTime();
        var g_startDate;
        var g_endDate;
        var g_nominalBandWidth;
        var equipmentCpuChart;
        var equipmentMemoryChart;
        var chartWan;
        var ApPie = echarts.init(document.getElementById('ap_num'));
        var termChart = echarts.init(document.getElementById('terminal_online'));
        function getRcString(attrName){
            return Utils.getRcString("dashboard88_rc",attrName);
        }
        window.onresize = function () {
            ApPie.resize()
            //scorePie.resize()
            chartWan.resize()
            termChart.resize()
            equipmentCpuChart.resize()
            equipmentMemoryChart.resize()
        };
        // function timeFormat(time){
        //     var date;
        //     if(!time){
        //         if((new Date().toLocaleDateString()).indexOf("年")!=-1){
        //             var str=new Date().toLocaleDateString();
        //             console.log(str.split(''));
        //             var year = str.split('')[1]+str.split('')[2]+str.split('')[3]+str.split('')[4];
        //             var month = str.split('')[8];
        //             var day = str.split('')[12]+str.split('')[13];
        //             date=new Date(year+"/"+month+"/"+day).getTime();
        //         }
        //     }else{
        //         date=time;
        //     }
        //     return date
        // }
        // console.log(timeFormat(g_startTime));
        
        /*$http({
            url:getAll.url,
            method:getAll.method,
            params:{
                'devSN': $scope.sceneInfo.sn,
                 dateTime:g_startTime
            }
        }).success(function(data){
            console.log(data);
        });*/        
        $scope.drawApPie=function(aData){
            var apTotal=aData.online+aData.offline;       
            var labelTop = {
                normal: {
                    color: '#e7e7e9',
                    label: {
                        show: false,
                        position: 'center',
                        formatter: '{b}',
                        textStyle: {
                            baseline: 'bottom'
                        }
                    },
                    labelLine: {
                        show: false
                    }
                },
                emphasis: {
                    color: '#e7e7e9'
                }
            };
            var labelFromatter = {
                normal: {
                    show:true,
                    formatter: function (params) {
                        //console.log(parseInt((params.value/apTotal)*100));  
                        if(apTotal==0){
                            return 0+"%";
                        }else{
                            return  Math.round((params.value/apTotal)*100)+"%" 
                        }                          
                    },        
                    textStyle: {
                        //align: 'center',
                        //baseline: 'top',
                        position: 'center',
                        fontWeight: 'normal'
                    }               
                }                                          
            };
            var labelBottom = {
                normal: {
                    color: '#4EC1B2',
                    label: {
                        show: true,
                        position:'center',
                        textStyle: {
                            baseline: 'middle',
                            fontSize: 25,
                            color: "#353e4f"
                        }
                    },
                    labelLine: {
                        show: false
                    }
                },
                emphasis: {
                    color: '#4EC1B2'
                }
            };
            var radius = [50, 70];
            scoreOption = {
                tooltip:{
                    show: true,
                    formatter: function (params) {
                        if(apTotal==0){
                            return params.name+':'+'</br>'+params.value+'('+0+'%'+')'
                        }else{
                            return params.name+':'+'</br>'+params.value+'('+Math.round(params.percent)+'%' +')'
                        }                                
                    }
                },
                series: [
                    {
                        name:"AP数量",
                        type: 'pie',
                        center: ['50%', '50%'],
                        radius: radius,
                        avoidLabelOverlap: false,
                        //x: '80%', // for funnel
                        label: labelFromatter,
                        data: [
                            {name:getRcString("ONLONE_ap"),value:aData.online, itemStyle: labelBottom},
                            {name:getRcString("OFFLINE_ap"),value:aData.offline, itemStyle: labelTop}
                        ]
                    }
                ]
            };
            var nodataEchartsoption = {
                color: ['#e7e7e9', '#e7e7e9'],
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}({d}%) : {c} "
                },
                series: [
                {
                    type: 'pie',
                    center: ['50%', '50%'],
                    radius: ['42%', '70%'],
                    hoverAnimation: false,
                    avoidLabelOverlap: true,
                    label: {
                        normal: {
                            show: true,
                            position: 'inside',
                            formatter: '{b}'
                        }
                    },
                    itemStyle: {
                        normal: {
                            borderColor: '#fff',
                            borderWidth: 1,
                            borderType: 'solid',

                        },
                        emphasis: {
                            color: '#e7e7e9'
                        }
                    },
                    data: [{ name: 'N/A', value: 0}]
                }]
            };
            if(apTotal===0){
                ApPie.setOption(nodataEchartsoption);
            }else{
                ApPie.setOption(scoreOption);
            }           
        };
        apCount=function(){
            $http({
                url:getAPsUrl.url,
                method:getAPsUrl.method,
                params:{
                    'devSN': $scope.sceneInfo.sn
                }
            }).success(function(data){
                var apTotal=data.ap_statistic.online+data.ap_statistic.offline;
                $("#total_ap").html(apTotal);
                $("#online_ap").html(data.ap_statistic.online);
                $scope.drawApPie(data.ap_statistic);
            }).error(function(){});
        }
        //terminal
        onlineClient=function(){
            $http({
                url:getTerminalCountUrl.url,
                method:getTerminalCountUrl.method,
                params:{
                    'devSN': $scope.sceneInfo.sn,
                    reqType:'all'
                }
            }).success(function(data){
                $("#terminal").html(data.clientList[0].totalCount);              
            }).error(function(){});
        }        
        //flow        
        flow=function(){
            $http({
                url:getAllinterfaceFlow.url,
                method:getAllinterfaceFlow.method,
                params:{
                    'devSN': $scope.sceneInfo.sn
                }
            }).success(function(data){
                //console.log(data.DataList);
                var dataList=data.DataList[data.DataList.length-1]
                var speedUpData=unit(dataList.speed_up);
                var speedDownData=unit(dataList.speed_down);
                $("#Traffic_up").html(speedUpData);
                $("#Traffic_down").html(speedDownData);
            }).error(function(){});
        };
        unit=function(flowData){
            var flowUnit;
            if(flowData<1024){
                flowUnit=flowData+"Kbps";
            }else if(1024<=flowData&&flowData<1048576){
                flowUnit=parseInt(flowData/1024)+"Mbps"
            }else{
                flowUnit=parseInt(flowData/1048576)+"Gbps"
            }
            return flowUnit
        }
        //health
        $scope.healthDegree=function(){
            $http.get(URL_GET_HEALTH+'?acSN='+$scope.sceneInfo.sn).success(function(data){
                console.log(data);
                var healthData=data;
                var aData = $.parseJSON(data);
                var healthData = JSON.parse(aData);
                console.log(healthData.finalscore);
                if (healthData==-1) {
                    healthData = {
                        finalscore: 0,
                        wanspeed: 0,
                        APpercent: 0,
                        clientspeed: 0,
                        security: 0,
                        wireless: 0,
                        system: 0,
                        Bpercent: 0
                    };
                    $scope.drawScorePie(healthData, 0);
                }else{
                    $scope.drawScorePie(healthData, 1);
                }             
                $scope.showMessage(healthData);
                $scope.initHealthScore(healthData);
                $scope.getBandWidth();
            }).error(function(){
                $scope.isFail = false;
                $scope.isSuccess = false;
            });
        };
        $scope.showMessage = function (oData) {
            $scope.isFail = false;
            $scope.isSuccess = false;
            if (oData.finalscore == 0) {
            } else if (oData.finalscore < 40) {
                $scope.isFail = true;
                $scope.getPercent = oData.Bpercent;
            } else if (oData.finalscore < 70) {
                $("#terminalMessage").css("color", "#fbceb1");
                $scope.isSuccess = true;
                $scope.getPercent = oData.Bpercent;
                $scope.terminalMessage =getRcString("TIP1");// getRcString("TIP2");
            } else if (oData.finalscore <= 100) {
                $("#terminalMessage").css("color", "#4ec1b2");
                $scope.isSuccess = true;
                $scope.getPercent = oData.Bpercent;
                if (oData.finalscore < 80) {
                    $scope.terminalMessage =getRcString("TIP2");
                } else if (oData.finalscore < 90) {
                    $scope.isSuccess = true;
                    $scope.getPercent = oData.Bpercent;
                    $scope.terminalMessage =getRcString("TIP3");// getRcString("TIP4");
                } else {
                    $scope.isSuccess = true;
                    $scope.getPercent = oData.Bpercent;
                    $scope.terminalMessage =getRcString("TIP4");// getRcString("TIP5");
                }
            }
        };
        //健康度饼图
        $scope.drawScorePie = function (aData, status) {
            var scoreData=[];
            scoreData.push(aData.finalscore/100); 
            var scorePie = echarts.init(document.getElementById('score-pie'));          
            var option = {
                width:'100%',
                series: [{
                    type: 'liquidFill',
                    radius: '60%',
                    center:['50%','40%'],
                    data: scoreData,//[0.55],
                    color:[status == 1 ? ((aData.finalscore >= 80 ? "#66E6D5" : (aData.finalscore >= 70 ? "#fbceb1" : "#fe808b"))) : "#f5f5f5"],
                    itemStyle: {
                        normal: {
                            //color: 'red',
                            opacity: status == 1 ? 0.6 : 0
                        },
                        emphasis: {
                            opacity: 0.9
                        }
                    },
                    outline: {
                        show: false,
                        borderDistance: 1,
                        itemStyle: {
                            color: 'none',
                            borderColor: '#294D99',
                            borderWidth: 8,
                            shadowBlur: 20,
                            shadowColor: 'rgba(0, 0, 0, 0.25)'
                        }
                    },
                    backgroundStyle: {
                        color: 'rgb(255,255,255)',
                        borderWidth: 1,
                        borderColor:status==0 ? 'rgb(255,255,255)':'rgb(102,230,213)'
                    },
                    label: {
                        normal: {
                             formatter: function(params){
                                if(status==0){
                                    return parseInt(params.value * 100);
                                }else{
                                    return parseInt(params.value * 100) +'分';
                                }                               
                             },
                            textStyle: {
                                color:status==0 ? '#90959D':'red',
                                insideColor: '#fff',
                                fontSize: 20
                            }
                        }
                    }
                }]
            };

            scorePie.setOption(option);
        };
        $scope.initHealthScore = function (aData) {
            if (!aData) {
            }
            $scope.healthGrade(aData.wanspeed, "#raty_score_1 li");
            $scope.healthGrade(aData.APpercent, "#raty_score_2 li");
            $scope.healthGrade(aData.clientspeed, "#raty_score_3 li");
            $scope.healthGrade(aData.security, "#raty_score_4 li");
            $scope.healthGrade(aData.wireless, "#raty_score_5 li");
            $scope.healthGrade(aData.system, "#raty_score_6 li");
        };
        $scope.healthGrade = function (sizeof, selector) {
            if(sizeof<=2){
                for (var i = 0; i < sizeof; i++) {
                    $(selector).eq(i).removeClass('emptyStar').addClass('dangerStar');
                }
            }else if(sizeof==3){
                for (var i = 0; i < sizeof; i++) {
                    $(selector).eq(i).removeClass('emptyStar').addClass('warningStar');
                }
            }else if(sizeof>3){
                for (var i = 0; i < sizeof; i++) {
                    $(selector).eq(i).removeClass('emptyStar').addClass('lightStar');
                }
            }
            
        };
        //system info
        $scope.systemInfo = {
            options: {
                mId: 'systemInfo',
                title: getRcString("FORM_TITLE"),
                autoClose: true,
                showCancel: false,
                buttonAlign: "center",
                modalSize: 'lg',
                showHeader: true,
                showFooter: true,
                searchable: true,
                okText:getRcString("CLOSE"),
                okHandler: function (modal, $ele) {
                    //add ap to ap group
                    //$scope.$broadcast('show#systemInfo');
                },
                cancelHandler: function (modal, $ele) {
                },
                beforeRender: function ($ele) {
                    return $ele;
                }
            }
        };
        $scope.systemInformation = function () {
            var systemScoreUrl = Utils.getUrl('GET', '', '/devmonitor/web/system', '/init/dashboard5/system_dev.json');
            var v3Status = Utils.getUrl('POST', '', '/base/getDev', '/init/dashboard5/get_dev.json');
            //$scope.systemData={};
            $scope.$broadcast('show#systemInfo');
            $http({
                url: systemScoreUrl.url,
                method: systemScoreUrl.method,
                params: {
                    'devSN': $scope.sceneInfo.sn
                }
            }).success(function (data) {
                $scope.nCpu = parseInt(data.cpuRatio);
                $scope.nMem = parseInt(data.memoryRatio);
                $scope.drawCircleScore('gauge_cpu', $scope.nCpu, getRcString("cpu"));
                $scope.drawCircleScore('gauge_mem', $scope.nMem, getRcString("memory"));
                $scope.devMode=data.devMode;
                $scope.devSoftVersion=data.devSoftVersion;
                $scope.devHardVersion=data.devHardVersion;
                $scope.devBootWare=data.devBootWare;
            }).error(function () {
            });
            $http({
                url: v3Status.url,
                method: v3Status.method,
                data: {
                    'devSN': $scope.sceneInfo.sn
                }
            }).success(function (data) {
                $scope.statust = data.status || [];
                var Connect_Sta = getRcString("Connect_Stav3").split(",");
                if ($scope.statust == 0) {
                    $scope.connectStatus=Connect_Sta[0];
                    //angular.element("#devv3CloudConnectionState").html(Connect_Sta[0]);
                } else {
                    $scope.connectStatus=Connect_Sta[1];
                   // angular.element("#devv3CloudConnectionState").html(Connect_Sta[1]);
                }
            }).error(function () {
            });
        };
        $scope.drawCircleScore = function (jEle, val, sName) {
            var circlePie = document.getElementById(jEle);
            if (!circlePie) {return;}
            circlePie = echarts.init(circlePie);
            var labelTop = {
                normal: {
                    color: '#4EC1B2',
                    label: {
                        show: true,
                        position: 'center',
                        formatter: '{b}',
                        textStyle: {
                            baseline: 'bottom',
                            color: '#4EC1B2'
                        }
                    },
                    labelLine: {
                        show: false
                    }
                }
            };
            var labelFromatter = {
                normal: {
                    label: {
                        formatter: function (params) {
                            return 100 - params.value + '%'
                        },
                        textStyle: {
                            baseline: 'top',
                            color: '#0096D6'
                        }
                    }
                }
            };
            var labelBottom = {
                normal: {
                    color: '#ccc',
                    label: {
                        show: true,
                        position: 'center'
                    },
                    labelLine: {
                        show: false
                    }
                },
                emphasis: {
                    color: 'rgba(0,0,0,0)'
                }
            };
            var radius = [40, 55];
            var circleOption = {
                series: [
                    {
                        type: 'pie',
                        center: ['30%', '50%'],

                        radius: radius,
                        x: '0%', // for funnel
                        itemStyle: labelFromatter,
                        data: [
                            {name: 'other', value: 100 - val, itemStyle: labelBottom},
                            {name: sName, value: val, itemStyle: labelTop}
                        ]
                    }
                ]
            };
            circlePie.setOption(circleOption);
        };
        //band width set
        $scope.bandWidth={};
        $scope.$watch('AddInternetForm.$invalid', function (v) {
            if (v) {
                $scope.$broadcast('disabled.ok#bandWidthSet');
            } else {
                $scope.$broadcast('enable.ok#bandWidthSet');
            }
        });
        $scope.$watch('AddInternetForm.$dirty', function (v) {
            console.log(v);
            if (v) {
                $scope.$broadcast('enable.ok#bandWidthSet');
            } else {
                $scope.$broadcast('disabled.ok#bandWidthSet');
            }
        });
        $scope.bandWidthOption={
            options:{
                mId: 'bandWidthSet',
                title: getRcString("ADD_TITLE"),
                autoClose: true,
                showCancel: true,
                buttonAlign: "center",
                modalSize: 'normal',
                showHeader: true,
                showFooter: true,
                searchable: true,
                okHandler: function (modal, $ele) {
                    $scope.setBandWidth();
                    //$scope.$broadcast('show#bandWidth');
                },
                cancelHandler: function (modal, $ele) {
                },
                beforeRender: function ($ele) {
                    return $ele;
                }
            }
        };
        $scope.getBandWidth=function(){
            $http.get(URL_GET_BAND+'?devSN='+$scope.sceneInfo.sn).success(function (data) {
                if(data.errCode==0){
                    $scope.bandWidth.upband=data.upBandwidth;
                    $scope.bandWidth.downband=data.downBandwidth;
                }else if (data.errCode==1) {

                }
            }).error(function () {});
        };
        $scope.openModal=function(){
            $scope.$broadcast('show#bandWidthSet');
            $scope.$broadcast('disabled.ok#bandWidthSet');
            $scope.getBandWidth();
        };
        $scope.$on('hidden.bs.modal#bandWidthSet', function () {
            $scope.AddInternetForm.$setUntouched();
            $scope.AddInternetForm.$setPristine();
        });
        $scope.setBandWidth=function(){//set band width
            $http.get(URL_SET_BAND+'?devSN='+$scope.sceneInfo.sn+'&upBandwidth='+$scope.bandWidth.upband+'&downBandwidth='+$scope.bandWidth.downband)
                .success(function (data) {
                    console.log(data);
                    if(data.errCode==0){
                        $alert.msgDialogSuccess(getRcString("SETBAND_SUC"));
                        $scope.healthDegree();
                        /*getNominalBandWidt();
                        $timeout(function(){   
                            flowChange();
                        },500);*/                    
                    }else{
                        $alert.msgDialogError(getRcString("SETBAND_FAIL"));
                    }
                }).error(function () {});
        };

        var oDaterangeCN = {
            timePicker:true,
            timePickerIncrement: 10,
            timePicker24Hour:true,
            startDate: moment().startOf("day"),
            endDate: moment(),
            maxDate: moment(),
            locale : {
                format : 'YYYY/MM/DD H:mm',
                applyLabel : getRcString("APPLY"),
                cancelLabel: getRcString("CANCEL")
            },
            "opens": "right",
            dateLimit : {
                days : 7
            },
        };

        $('#daterange').daterangepicker(oDaterangeCN,function(start,end,label){
            g_startDate = (new Date(start.format('YYYY-MM-DD H:mm'))).getTime();
            g_endDate = (new Date(end.format('YYYY-MM-DD H:mm'))).getTime();
        }).on('apply.daterangepicker', function(e, date) {
            var time = $("#daterange").val().split('-');
            g_startTime = new Date(time[0]).getTime();
            g_endTime = new Date(time[1]).getTime();
            flowChange();
            clientChange();
            cpuTendency();
            memoryTendency();
        });

        /*getNominalBandWidt=function(){//获取额定带宽函数
            $http.get(URL_GET_BAND+'?devSN='+$scope.sceneInfo.sn).success(function (data) {                
                if(data.errCode==0){ 
                    g_nominalBandWidth=data.upBandwidth+data.downBandwidth;                                     
                }                  
            }).error(function(){});   
        }*/
         // storage chart data
        $scope.usageData = [];
        //record request status
        $scope.dataState = 0; 
        $scope.changeSelectValue = function(n,o){
                // console.log(n.interfaceName);
                if(n.interfaceName){
                    var count = 0;
                    $http({
                        method:$scope.urlObj.getAllinterfacesFlow.method,
                        url:$scope.urlObj.getAllinterfacesFlow.url,
                        params: {
                            'devSN': $scope.sceneInfo.sn,
                            startTime:g_startTime,
                            endTime:g_endTime
                        }
                    }).success(function(data){
                        count++;
                        $scope.usageData[0] = data.DataList.reverse();
                        if(count === 2){
                            $scope.drawBandChart($scope.usageData)
                        }
                    })

                    $http({
                        method:$scope.urlObj.setOneInterface.method,
                        url:$scope.urlObj.setOneInterface.url,
                        params:{
                            'devSN': $scope.sceneInfo.sn,
                            startTime:g_startTime,
                            endTime:g_endTime,
                            interfaceName:$scope.selectValue.interfaceName,
                            interfaceType:$scope.selectValue.interfaceType
                        }            
                    }).success(function(data){
                        count++;
                        if(data.retCode === 0){
                            $scope.usageData[1] = data.histdataList.dataList.reverse();
                            $scope.usageData[1].name = $scope.getAbbreviate(data.histdataList.interfaceName);
                            
                            if(count ===2){
                                $scope.drawBandChart($scope.usageData)
                            }
                        }
                    })
                }else{
                    if($scope.usageData.length === 2){
                        $scope.usageData.pop()
                        $scope.drawBandChart($scope.usageData)
                        $http({
                            method:$scope.urlObj.setOneInterface.method,
                            url:$scope.urlObj.setOneInterface.url,
                            params:{
                                'devSN': $scope.sceneInfo.sn,
                                interfaceName:$scope.selectValue.interfaceName,
                                interfaceType:$scope.selectValue.interfaceType
                            }
                        }).success(function(data){
                            if(data.retCode === 0){
                                console.log('success')
                            }
                        })
                    }
                }
            };
            $scope.$watch('selectValue',$scope.changeSelectValue)
        flowChange=function(){ 
            
            // judge request status, render chart
            $scope.default = {
                devSN:$scope.sn,
                interfaceName:'',
                name:getRcString("no_choose_port")
            };         
            $scope.renderEchart = function(){
                if($scope.dataState%3 === 0){
                    var isInterface = false;
                    angular.forEach($scope.list,function(item,idx){
                        if(item.interfaceName === $scope.interfaceName){
                            console.log('selectName')
                            $scope.selectValue = item;
                            console.log(item);
                            isInterface = true;
                        }
                    });
                    if(!isInterface){
                        $scope.selectValue = $scope.default;
                        $scope.drawBandChart($scope.usageData)
                    }
                    
                }
            }; 
            
            //get list
             $http({
                method:$scope.urlObj.getAllInterfaces.method,
                url:$scope.urlObj.getAllInterfaces.url,
                params: {
                    'devSN': $scope.sceneInfo.sn
                }
            }).success(function(data){
                data.InterfaceList.forEach(function(item,idx){
                    item.name = $scope.getAbbreviate(item.interfaceName)
                })
                data.InterfaceList.unshift($scope.default);
                $scope.list = data.InterfaceList;
                $scope.dataState++;
                $scope.renderEchart()
            });
            //get oneInterface
            $http({
                method:$scope.urlObj.getOneInterfaceData.method,
                url:$scope.urlObj.getOneInterfaceData.url,
                params: {
                    'devSN': $scope.sceneInfo.sn,
                    startTime:g_startTime,
                    endTime:g_endTime
                }
            }).success(function(data){
                $scope.dataState++;
                if(data.flag === 0){
                    // console.log('flag === 0')
                    $scope.usageData[1] = data.histdataList.dataList.reverse();
                    $scope.usageData[1].name = $scope.getAbbreviate(data.histdataList.interfaceName);
                    $scope.interfaceName = data.histdataList.interfaceName
                }
                $scope.renderEchart()
            });
            //get all
            $http({
                method:$scope.urlObj.getAllinterfacesFlow.method,
                url:$scope.urlObj.getAllinterfacesFlow.url,
                params: {
                    'devSN': $scope.sceneInfo.sn,
                    startTime:g_startTime,
                    endTime:g_endTime
                }
            }).success(function(data){
                $scope.usageData[0] = data.DataList.reverse();
                $scope.dataState++;
                $scope.renderEchart()
            });
        }   
        $scope.timeStatus=function(time) {
            // body...
            if (time < 10) {
                return "0" + time;
            }
            return time;
        };
        $scope.getAbbreviate = function getAbbreviate(str){
            var firstLetter = str[0]
            switch(firstLetter){
                case 'G':
                return Array.prototype.slice.call(/(G)igabit(E)thernet(\d\/\d\/*\d*)/.exec(str),1).join('').toUpperCase();
                case 'T':
                return Array.prototype.slice.call(/(Ten)-GigabitEthernet(\d\/\d\/*\d*)/.exec(str),1).join('');
                case 'B':
                return Array.prototype.slice.call(/(B)ridge-(Agg)regation(\d*)/.exec(str),1).join('').toUpperCase();
                case 'F':
                return Array.prototype.slice.call(/(Forty)GigE(\d\/\d\/\d*)/.exec(str),1).join('');
            }
        };

        $scope.drawBandChart=function(aData){          
            //if (!chartWan) {return;}
            chartWan = echarts.init(document.getElementById("band_width"));
            var aTimes = [];
            var aServices = [];
            var aLegend = [getRcString("ZONGLIANG")];
            var aTooltip = getRcString("total_flow_up_down").split(",");
            var aColor = ["rgba(29,143,222,.2)","rgba(186,85,211,.2)"];
            // var reg = /./;
            // var reg2 = /G\d{1,2}/;
            // var aColor = ["rgba(120,206,195,1)", "rgba(254,240,231,1)", "rgba(144,129,148,1)", "rgba(254,184,185,1)"];
            //x-time
            $.each(aData[0], function(i, oData) {
                var temp = new Date(oData.updateTime);
                var month = temp.getMonth()+1;
                var day = temp.getDate();
                aTimes.push(month+'/'+day+" "+($scope.timeStatus(temp.getHours())||'00') + ":" + ($scope.timeStatus(temp.getMinutes())||'00'));
            });
            angular.forEach(aData, function(oData,i) {
                if(i === 1){
                    aLegend.push(oData.name +" "+getRcString("LIULIANG"));
                    aTooltip.push(oData.name+" " +getRcString("STREAM").split(",")[0],oData.name+" " +getRcString("STREAM").split(",")[1])
                }

                var aUp = [];
                var aDown = [];
                angular.forEach(aData[i], function(oData,i) {
                    aUp.push(Math.abs(oData.speed_up));
                    aDown.push(-oData.speed_down);
                });
                var oUp = {
                    symbol: "none",
                    type: 'line',
                    smooth: true,
                    itemStyle: {
                        normal: {
                            areaStyle: {
                                type: 'default',
                                color: aColor[i]
                            },
                            opacity:0
                        }
                    },
                    name: aLegend[i],
                    data: aUp
                };
                var oDown = {
                    symbol: "none",
                    type: 'line',
                    smooth: true,
                    itemStyle: {
                        normal: {
                            areaStyle: {
                                type: 'default',
                                color: aColor[i]
                            },
                            opacity:0
                        }
                    },
                    name: aLegend[i],
                    data: aDown
                };
                //
                aServices.push(oUp);
                aServices.push(oDown);
            });

            var chartWanOption = {
                tooltip: {
                    show: true,
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line',
                        lineStyle: {
                            color: '#80878C',
                            width: 2,
                            type: 'solid'
                        }
                    }
                    ,formatter: function(y) {
                        var sTips = y[0].name + '<br/>';
                        y.forEach(function(item,idx){
                            sTips += aTooltip[idx] + " " + ':' +" " + Utils.addComma(Math.abs(item.data), "rate", 1) +"<br/>"
                        });
                        return sTips;
                    }
                },
                legend: {
                    orient: "horizontal",
                    y: 0,
                    x: "center",
                    data: aLegend
                },
                dataZoom: [
                    {
                        show: true,
                        realtime: true,
                        start: 70,
                        end: 100
                    },
                    {
                        type: 'inside',
                        realtime: true,
                        start: 70,
                        end: 100
                    }
                ],
                grid: {
                    //x: 100,
                    //y: 20,
                    x: 100,
                    y: 20,
                    x2: 40,
                    y2: 60,
                    borderColor: '#FFF'
                },
                calculable: false,
                xAxis: [{
                    type: 'category',
                    boundaryGap: false,
                    splitLine: true,
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#80878C',
                            width: 2
                        }
                    },
                    axisLabel: {
                        interval:'auto',
                        show: true,
                        textStyle: {
                            color: '#80878C',
                            width: 2
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    data: aTimes
                }],
                yAxis: [{
                    type: 'value',
                    splitNumber: 5,
                    minInterval : 1,
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: '#80878C',
                            width: 2
                        },
                        formatter: function(nNum) {
                            return Utils.addComma(Math.abs(nNum), 'rate', 1);
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#80878C',
                            width: 2
                        }
                    }
                }],
                series: aServices,
                color: ["rgba(29,143,222,.4)","rgba(75,0,130,.4)"]
            };
            chartWan.setOption(chartWanOption);
        };
        
        //online_terminal
        clientChange=function(){
            $http({
                url:getClientUrl.url,
                method:getClientUrl.method,
                data:{
                    method:'stationOnlineTrendByDay',
                    param:{                       
                        'scenarioid': $scope.sceneInfo.nasid,
                        'startTime':g_startTime,
                        'endTime':g_endTime
                    }                  
                }
            }).success(function(data){
                if(data.errCode==0){
                    var dataTime=[];
                    var clientCount=[]; 
                    $.each(data.response,function(index,value){
                        var dateObj=new Date(value.time)
                        var hour=dateObj.getHours();
                        var month = dateObj.getMonth()+1;
                        var day = dateObj.getDate();
                        var minute=dateObj.getMinutes()==0?"0"+dateObj.getMinutes():dateObj.getMinutes();
                        dataTime.push(month+'/'+day+' '+hour+":"+minute);
                        clientCount.push(value.totalCount);
                    }); 
                    $scope.clientlChart(dataTime,clientCount);               
                }              
            }).error(function(){});
        }
         
        $scope.clientlChart=function(time,count){
            option = {
                tooltip : {
                    trigger: 'axis',
                    borderRadius: 0,
                    /*position:
                        function (p) {
                            return [p[0] - 45, p[1] - 35];
                        },*/
                    formatter:function(params){
                        if(params[0].data===null){
                            return params[0].name+'<br/>'+'终端数  '+":" +" " +'-'
                        }else{
                            return params[0].name+'<br/>'+'终端数  '+":" +" " +params[0].data
                        }
                    }
                },
                dataZoom: [
                    {
                        show: true,
                        realtime: true,
                        start: 70,
                        end: 100
                    },
                    {
                        type: 'inside',
                        realtime: true,
                        start: 70,
                        end: 100
                    }
                ],
                grid: {
                    x: 60,
                    y: 20,
                    x2: 40,
                    y2: 60,
                    borderColor: '#FFF',
                    containLabel: true
                },
                calculable: true,
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        axisLabel:{
                            textStyle:{
                                color:"#80878c"
                            }
                        },
                        axisTick:{
                            show:false
                        },
                        axisLine:{
                            lineStyle:{
                                color:'#CCCCCC',
                                width:2
                            }
                        },
                        boundaryGap: false,
                        data :time// ['8:00','9:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00']
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        //scale:true,
                        splitNumber: 5,
                        minInterval : 1,
                        splitLine:{
                            show:false
                        },
                        axisTick:{
                            show:false
                        },
                        axisLabel:{
                            formatter:'{value}',
                            textStyle:{
                                color:'#80878c'
                            }
                        },
                        axisLine:{
                            lineStyle:{
                                color:'#CCCCCC'
                            }
                        }
                    }
                ],
                series : [
                    {
                        //name:'�ʼ�Ӫ��',
                        type:'line',
                        smooth:'none',
                        //showSymbol:false,
                        //symbol: "circle",
                        areaStyle: {
                            normal: {
                                color:'#4ec1b2'
                            }
                        },
                        lineStyle:{
                            normal:{
                                color:'#4ec1b2',
                                opacity:0
                            }
                        },
                        itemStyle:{
                            normal:{
                                color:'#4ec1b2',
                                opacity:0
                            }
                        },
                        data:count//[120, 132, 101, 134, 90, 230, 210,256,20,150,100,200]
                    }
                ]
            };
            termChart.setOption(option);
        };
        
        //equipment information
        $scope.drawEquipmentChart=function(cpuData,id,lineColor,des){
            var dataTime=[];
            var dataRatio=[];
            //var maxData;
            if(id=="cpu"){
                $.each(cpuData,function(index,value){
                    var time=value.recordDate.split("/");
                    time = time[1]+"/"+time[2]+" "+ time[time.length-2]+":"+time[time.length-1];
                    dataTime.push(time);
                    dataRatio.push(value.highestCpuRatio);
                    
                });
                equipmentCpuChart= echarts.init(document.getElementById(id));
            }else if(id=="memory"){
                $.each(cpuData,function(index,value){
                    var time=value.recordDate.split("/");
                    time = time[1]+"/"+time[2]+" "+ time[time.length-2]+":"+time[time.length-1];
                    dataTime.push(time);
                    dataRatio.push(value.highestMemoryRatio);                
                });
                /*var dataRatioNew=[];
                for(var i=0;i<dataRatio.length;i++){
                    dataRatioNew[i]=dataRatio[i];
                }
                maxData=dataRatioNew.sort(function(a,b){
                        return b-a;
                })[0];*/
                equipmentMemoryChart= echarts.init(document.getElementById(id));
            }      
            equipmentOption={
                tooltip : {
                    trigger: 'axis',
                    borderRadius: 0,
                    /*position:
                        function (p) {
                            return [p[0] - 45, p[1] - 35];
                        },*/
                    formatter:'{b0}'+'<br/>'+des + " : "+ '{c0}'+'%'

                },
                grid: {
                    x: 60,
                    y: 20,
                    x2: 40,
                    y2: 60,
                    borderColor: '#FFF'
                    // containLabel: true
                },
                dataZoom: [{
                    type: 'inside',
                    start: 70,
                    end: 100
                }, {
                    start: 70,
                    end: 100
                }],
                xAxis : [
                    {
                        //type : 'value',
                        scale:true,

                        boundaryGap : false,
                        axisLabel:{
                            interval:'auto',
                            textStyle:{
                                color:"#999999",
                                fontSize:12
                            }
                        },
                        axisTick:{
                            show:false
                        },
                        axisLine:{
                            lineStyle:{
                                color:'#999999'
                            }
                        },
                        data : dataTime//['8:00','9:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00']
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        //scale:true,
                        min:0,
                        //max:maxData+20,
                        //splitNumber: 4,
                        //minInterval : 1,
                        splitLine:{
                            show:false
                        },
                        axisTick:{
                            show:false
                        },
                        axisLabel:{
                            formatter:'{value} %',
                            textStyle:{
                                color:'#999999',
                                fontSize:12
                            }
                        },
                        axisLine:{
                            lineStyle:{
                                color:'#999999'
                            }
                        }
                    }
                ],
                series : [
                    {
                        type:'line',
                        symbol: "circle",
                        areaStyle: {
                            normal: {
                                //opacity:0
                                color:lineColor
                            }
                        },
                        lineStyle:{
                            normal:{
                                color:lineColor
                            }
                        },
                        itemStyle:{
                            normal:{
                                color:lineColor,
                                opacity:0
                            }
                        },
                        data:dataRatio//[10, 35, 15, 45, 30,60, 25,5,20]
                    }
                ]
            };
            if(id=="cpu"){
                equipmentCpuChart.setOption(equipmentOption);
            }else if(id=="memory"){
                equipmentMemoryChart.setOption(equipmentOption);
            }           
        };
        cpuTendency=function(){
            $http({
                url:getCpuHistUrl.url,
                method:getCpuHistUrl.method,
                params:{
                    'devSN': $scope.sceneInfo.sn,
                    'startTime':g_startTime,
                    'endTime':g_endTime
                }
            }).success(function(data){
                if(data.errCode==0){
                    $scope.drawEquipmentChart(data.dataList.reverse(),'cpu','#b3b7dd','CPU使用 ');
                }             
            }).error(function(){});           
        }        
        memoryTendency=function(){
            $http({
                url:getMemoryHistUrl.url,
                method:getMemoryHistUrl.method,
                params:{
                    'devSN': $scope.sceneInfo.sn,
                    'startTime':g_startTime,
                    'endTime':g_endTime
                }
            }).success(function(data){
                if(data.errCode==0){
                    $scope.drawEquipmentChart(data.dataList.reverse(),'memory','#f2bc98','内存使用 ');
                }            
            }).error(function(){});         
        }
          
        function init(){
            apCount();
            onlineClient();
            flow();
            $scope.healthDegree();
            cpuTendency();
            memoryTendency();
            flowChange(); 
            clientChange();    
        } 
        init();     
    }];
});