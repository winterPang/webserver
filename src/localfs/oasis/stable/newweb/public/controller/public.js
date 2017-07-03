
define(['jquery','app','echarts','utils','bootstrap-daterangepicker','css!bootstrap_daterangepicker_css'],function ($,mainApp,echarts,Utils){

    return ["$scope","$rootScope","$http","$alertService",function ($scope,$rootScope,$http,$alert){
        //calendar -- add apply callback
        $('#daterange').daterangepicker({

         })
            .on('apply.daterangepicker',function(event,obj){
                console.log($scope.customDate)
                })
        //page info
        $scope.info = {
            number:document.getElementById('numberInfo').getAttribute('number'),
            addNumber:document.getElementById('numberInfo').getAttribute('addNumber'),
            reduceNumber:document.getElementById('numberInfo').getAttribute('reduceNumber'),
            totalNumber:document.getElementById('numberInfo').getAttribute('totalNumber'),
            noPublicAccount:document.getElementById('numberInfo').getAttribute('noPublicAccount')
        };
        //echart
        $scope.forEcharts = {
            dateArr:[],
            cumulateDataArr:[],
            newDataArr:[],
            cancelDataArr:[]
        };

        //add number 
        $scope.current = 0;
        //current cycle 
        $scope.cycle = "weeks";
        //dropdown value
        $scope.selectValue = "";
        //current nasid
        $scope.nasid = /nasid(\d+)/.exec(window.location.href)[1];
        //api url
        $scope.localData = {
            //fan number api
            url:Utils.getUrl('GET','o2o','/oasis/auth-data/restapp/o2oportal/weixinStatistic/statisticData','/init/public5/h3cwifi_d.json').url,
            //dropdown api 
            pubNumData:Utils.getUrl('GET','o2o','/oasis/auth-data/o2oportal/weixinaccount/query','/init/public5/pubNumData.json').url,
            getDayUrl:'/v3/ace/oasis/auth-data/o2oportal/weixinStatistic' // ?appId=wx439727a34d882382&days=7
        };

        //get data string   return   2016-10-30
        $scope.GetDateStr = function (AddDayCount){
            var dd = new Date();
            dd.setDate(dd.getDate()+AddDayCount);
            var y = dd.getFullYear();
            var m = (dd.getMonth()+1)<10?"0"+(dd.getMonth()+1):(dd.getMonth()+1);
            var d = dd.getDate()<10?"0"+dd.getDate():dd.getDate();
            return y+"-"+m+"-"+d;
        };

        //get page data
        $scope.getPubPageData = function (cycle){
            switch(cycle){
                case "weeks":
                    $http({
                        method:'get',
                        url:$scope.localData.getDayUrl,
                        params:{
                            appId:$scope.selectValue,
                            days:7
                        }
                    }).success(function (data){
                        $scope.getDataSuc(data)
                    })
                break;
                case "mounth":
                    $http({
                        method:'get',
                        url:$scope.localData.getDayUrl,
                        params:{
                            appId:$scope.selectValue,
                            days:30
                        }
                    }).success(function (data){
                            $scope.getDataSuc(data)
                    });
                    break;
                case "year":
                    $http({
                        method:'get',
                        url:$scope.localData.url,
                        params:{
                            phase:"y",
                            appId:$scope.selectValue,
                            year:new Date().getFullYear(),
                            month:new Date().getMonth()+1
                        }
                    }).success(function (data){
                            $scope.getDataSuc(data)
                    });
                break;
                case "customDate":
                    $http({
                        method:'get',
                        url:$scope.localData.url,
                        params:{
                            phase:"d",
                            appId:$scope.selectValue,
                            //test data
                            dateFrom:'2016-10-18',
                            dateTo:'2016-10-29'
                        }
                    }).success(function (data){
                            $scope.getDataSuc(data)
                    });
                break;
                default:
                break;
            }
        };

        //query success callback
        $scope.getDataSuc = function (data){
            $scope.current = 0;
            $scope.totalAp = 0;
            if(!data.weixinStatisticList||data.weixinStatisticList.length === 0){
                data = {
                weixinStatisticList:[
                    {
                     "appId": "",
                     "new_user": 0,
                     "cancel_user": 0,
                     "cumulate_user": 0,
                     "ref_date": ""
                    }
                 ]
                }
            }
            for (var i = data.weixinStatisticList.length-1; i >= 0; i--) {
                if(data.weixinStatisticList.length === 12){
                    $scope.forEcharts.dateArr.push(data.weixinStatisticList[i].year+"-"+data.weixinStatisticList[i].month);
                    $scope.current += data.weixinStatisticList[i].new_user;
                }else{
                    var str = data.weixinStatisticList[i].ref_date.split("-");
                    str.shift();
                    for (var j = 0; j < str.length; j++) {
                        str[j] = str[j].charAt(0) === "0" ? str[j].substring(1) :str[j]
                    };
                    $scope.forEcharts.dateArr.push(str.join("-"));
                    $scope.current += data.weixinStatisticList[i].new_user;
                }
                $scope.forEcharts.cumulateDataArr.push(data.weixinStatisticList[i].cumulate_user);
                $scope.forEcharts.newDataArr.push(data.weixinStatisticList[i].new_user);
                $scope.forEcharts.cancelDataArr.push(data.weixinStatisticList[i].cancel_user);
            };            
            $scope.totalAp = data.weixinStatisticList[0].cumulate_user;
            $scope.myChart1($scope.forEcharts)
            $scope.myChart2($scope.forEcharts)
            $scope.myChart3($scope.forEcharts)
        }


        //render echart
        $scope.myChart1 = function (forEcharts){
            var myChart1 = echarts.init(document.getElementById('public_number'));
            var option1 = {
                grid:{
                    x:80,y:40,x2:80,y2:30,
                    borderColor:'rgba(0,0,0,0)'
                },
                tooltip: {
                    show:true,
                    trigger: 'axis'
                },
                xAxis : [
                    {
                        type : 'category',
                        data : forEcharts.dateArr,
                        axisLine: {
                            show: true,
                            lineStyle: { color: '#9da9b8', width: 1 }
                        },
                        splitLine: {
                            show: false
                        },
                        axisTick:{
                            show:false
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        name : $scope.info.number,
                        axisLabel : {
                            formatter: '{value}'
                        },
                        axisLine: {
                            show: true,
                            lineStyle: { color: '#9da9b8', width: 1 }
                        },
                        splitLine: {
                            show: false
                        }
                    }
                ],
                series : [
                    {
                        name:$scope.info.totalNumber,
                        type:'line',
                        yAxisIndex: 0,
                        itemStyle : {
                            normal : {
                                color:'#4ec1b2'
                            }
                        },
                        data:forEcharts.cumulateDataArr
                    }
                ]
            };
            myChart1.setOption(option1);
        };
        $scope.myChart2 = function (forEcharts){
            var myChart2 = echarts.init(document.getElementById('public_count'));
            var option2 = {
                grid:{
                    x:40,y:20,x2:40,y2:40,
                    borderColor:'rgba(0,0,0,0)'
                },
                tooltip: {
                    trigger: 'axis'
                },
                xAxis : [
                    {
                        type : 'category',
                        data : forEcharts.dateArr,
                        axisLine: {
                            show: true,
                            lineStyle: { color: '#9da9b8', width: 1 }
                        },
                        splitLine: {
                            show: false
                        },
                        axisTick:{
                            show:false
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        name : $scope.info.addNumber,
                        axisLabel : {
                            formatter: '{value}'
                        },
                        axisLine: {
                            show: true,
                            lineStyle: { color: '#9da9b8', width: 1 }
                        },
                        splitLine: {
                            show: false
                        }
                    }
                ],
                series : [
                    {
                        name:$scope.info.totalNumber,
                        type:'bar',
                        yAxisIndex: 0,
                        barWidth : 10,
                        itemStyle : {
                            normal : {
                                color:'#4ec1b2'
                            }
                        },
                        data:forEcharts.newDataArr
                    }
                ]
            };
            myChart2.setOption(option2);
        };
        $scope.myChart3 = function (forEcharts){
            var myChart3 = echarts.init(document.getElementById('public_list'));
            var option3 = {
                grid:{
                    x:40,y:20,x2:40,y2:40,
                    borderColor:'rgba(0,0,0,0)'
                },
                tooltip: {
                    trigger: 'axis'
                },
                xAxis : [
                    {
                        type : 'category',
                        data : forEcharts.dateArr,
                        axisLine: {
                            show: true,
                            lineStyle: { color: '#9da9b8', width: 1 }
                        },
                        splitLine: {
                            show: false
                        },
                        axisTick:{
                            show:false
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        name : $scope.info.reduceNumber,
                        axisLabel : {
                            formatter: '{value}'
                        },
                        axisLine: {
                            show: true,
                            lineStyle: { color: '#9da9b8', width: 1 }
                        },
                        splitLine: {
                            show: false
                        }
                    }
                ],
                series : [
                    {
                        name:$scope.info.totalNumber,
                        type:'bar',
                        yAxisIndex: 0,
                        barWidth : 10,
                        itemStyle : {
                            normal : {
                                color:'#4ec1b2'
                            }
                        },
                        data:forEcharts.cancelDataArr
                    }
                ]
            };
            myChart3.setOption(option3);
            $scope.forEcharts = {
                dateArr:[],
                cumulateDataArr:[],
                newDataArr:[],
                cancelDataArr:[]
            }
        };

        //nav btn change
        $scope.btnInit = function (e){
            $scope.cycle = e.target.id;
            $scope.getPubPageData($scope.cycle);
        };

        //load dropdown 
        $http({
            url:$scope.localData.pubNumData,
            method:'get',
            params: {
                storeId:$scope.nasid,
                name:"",
                appId:"",
                startRowIndex:0,
                maxItems:100
            }
        }).success(function (data){
            if(data.data.length !== 0){
                $scope.list = data.data;
                $scope.selectValue = data.data[0].appId;
            }else
            {
                $alert.msgDialogError($scope.info.noPublicAccount)
            }
            //query public number list then watch the selectValue
                $scope.$watch("selectValue",function (){
                    $scope.cycle = 'weeks';
                    $scope.getPubPageData($scope.cycle);
                })
        });


    }]
})