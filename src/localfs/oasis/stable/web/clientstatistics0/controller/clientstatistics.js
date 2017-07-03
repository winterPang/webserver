define(['jquery','echarts','utils','bsTable','bootstrap-daterangepicker', 'css!clientstatistics0/css/clientstatistics.css','css!bootstrap_daterangepicker_css'],
    function($,echarts,Utils){
        return ['$scope', '$http', '$state','$rootScope',function($scope,$http,$state,$rootScope) {
            function getRcString(attrName) {
                return Utils.getRcString("visitor_analysis_rc", attrName);
            }
            var title=getRcString("LIST_HEADER").split(",");
            var charts=getRcString("TYPE_SHOW").split(",");
            var date=getRcString("TIME_SHOW").split(",");
            //var g_mark=undefined;
            var g_timelinedata  = [];
            var g_choice    = 1;
            var StartTime=new Date(new Date().toLocaleDateString()).getTime();
            var EndTime=new Date().getTime();
            var g_condition={ACSN:$scope.sceneInfo.sn, StartTime:StartTime, EndTime:EndTime,Count:0};
            $scope.selectTime=false;
            $scope.chartType=false;
            $scope.chartAnalyze=true;
            //选择客户类型下拉框
            $scope.newName="1";//默认显示全部客户
            $scope.$watch('time',function(){
                console.log($scope.time);
            });
            $scope.options={
                sId:'clientType',
                allowClear: false
            };
            $scope.showTime=function(){
                if($scope.selectTime||$scope.chartType){
                    $scope.selectTime=false;
                    $scope.chartType=false;
                }else{
                    $scope.selectTime=true;
                }
            };
            $scope.showType=function(){
                if($scope.chartType||$scope.selectTime){
                    $scope.chartType=false;
                    $scope.selectTime=false;
                }else{
                    $scope.chartType=true;
                }
            };
            //引入日期
            $('#daterange').daterangepicker({
                language: 'zh-CN',
                locale: {
                    applyLabel:getRcString('QUEREN'),
                    cancelLabel: getRcString('QUXIAO'),
                    format: 'YYYY/MM/DD'
                }
            });
            $(".applyBtn").click(function(){
                //debugger;
                StartTime = $("input[name='daterangepicker_start']").val();
                EndTime = $("input[name='daterangepicker_end']").val();
                $scope.time=StartTime+'-'+EndTime;
                $scope.$apply(function (){
                    $scope.selectTime=false;
                });
                $scope.dateOption();
                console.log(new Date(StartTime).getTime());
            });
            //下拉框选择函数
            $scope.time=date[0];
            $scope.timeShow=function(time){
               if(time=="day"){
                   $scope.time=date[0];
                   $scope.selectTime=false;
               }else if(time=="week"){
                   $scope.time=date[1];
                   $scope.selectTime=false;
               }else if(time=="month"){
                   $scope.time=date[2];
                   $scope.selectTime=false;
               }else{
                   $scope.time=date[3];
                   $scope.selectTime=false;
               }
            };
            $scope.type=charts[0];
            $scope.chartShow=function(chart){
                if(chart=="line"){
                    $scope.type=charts[0];
                    $scope.chartType=false;
                }else if(chart=="pie"){
                    $scope.type=charts[1];
                    $scope.chartType=false;
                }
            };
            //表格数据
            $scope.option={
                tId:'visitorData',
                striped:true,
                pageSize: 15,
                pageList: [5,10],
                searchable: true,
                columns: [
                    {
                        sortable: true,
                        field: 'MacAddress',
                        title: title[0],
                        searcher: {type: "text"}
                    },
                    {
                        sortable: true,
                        field: 'FirstTime',
                        title: title[1],
                        searcher: {type: "text"},
                        formatter: function(value, row, index) {
                            var showFirstTime=new Date(value).toLocaleString();
                            return showTime;
                        }
                    },
                    {
                        sortable: true,
                        field: 'LastTime',
                        title: title[2],
                        searcher: {type: "text"},
                        formatter: function(value, row, index) {
                            var showLastTime=new Date(value).toLocaleString();
                            return showTime;
                        }
                    },
                    {
                        sortable: true,
                        field: 'Ssid',
                        title: title[3],
                        searcher: {type: "text"}
                    },
                    {
                        sortable: true,
                        field: 'Vendor',
                        title: title[4],
                        searcher: {type: "text"},
                        formatter: function(value, row, index) {
                            return value=="unknown"?getRcString("UNKNOW"):value;
                        }
                    }

                ]
            };
            //折线图代码
            $scope.drawTimeLine=function(aData,dateState){
                //debugger
                judgeData=function(aMessage){
                    var xData = [];
                    var y1Data = [],y2Data = [],y3Data = [];
                    aMessage.sort(function(a, b){
                        return Number(a.Date) - Number(b.Date);
                    });

                    for(var i = 0; i < aMessage.length; i++){
                        var temp = new Date(aMessage[i].Date);
                        xData.push(temp.toLocaleDateString().slice(5));
                        y3Data.push(aMessage[i].Count);
                        y1Data.push(aMessage[i].NewClient);
                        y2Data.push(aMessage[i].Count - aMessage[i].NewClient);
                    }
                    return [xData, y1Data, y2Data, y3Data];
                };
                var timeNow = new Date();
                var xData = [];
                var y1Data = [],y2Data = [],y3Data = [];
                if(aData)
                {
                    var aMessage = aData;
                    if(!dateState)
                    {
                        aMessage.newClient.sort(function(a, b){
                            return Number(a.name) - Number(b.name);
                        });
                        aMessage.oldClient.sort(function(a, b){
                            return Number(a.name) - Number(b.name);
                        });
                        for(var i = (aMessage.oldClient.length < aMessage.newClient.length?aMessage.oldClient.length:aMessage.newClient.length); i--;){
                            var temp = new Date(aMessage.newClient[i].name);
                            xData.unshift(temp.toTimeString().slice(0,5));
                            y1Data.unshift(aMessage.newClient[i].value);
                            y2Data.unshift(aMessage.oldClient[i].value);
                            y3Data.unshift(aMessage.newClient[i].value + aMessage.oldClient[i].value);
                        }
                    }
                    else
                    {
                        var a  = judgeData(aMessage);
                        xData  = a[0];
                        y1Data = a[1];
                        y2Data = a[2];
                        y3Data = a[3];
                    }
                    g_timelinedata = [xData, y1Data, y2Data, y3Data];
                }
                else{
                    xData  = g_timelinedata[0];
                    y1Data = g_timelinedata[1];
                    y2Data = g_timelinedata[2];
                    y3Data = g_timelinedata[3];
                }
                var aClient = getRcString("CLIENT-TYPE").split(",");
                var timeLine = echarts.init(document.getElementById('probe_line'));
                var lineOption={
                    tooltip : {
                        trigger: 'item'
                    },
                    grid:{
                        x:50,
                        y:80,
                        x2:30,
                        borderWidth:0
                    },
                    calculable : false,
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : xData,
                            splitLine:{
                                show:false
                            },
                            axisLabel: {
                                rotate:0,
                                textStyle:{color: '#ffffff'}

                            },
                            axisLine  : {
                                show:false,
                                lineStyle :{color: '#F6F7F8', width: 1}
                            }

                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            splitNumber:4,
                            splitLine:{
                                show:true,
                                lineStyle :{color: '#475C81', width: 1}
                            },
                            axisLabel: {
                                formatter: '{value}',
                                show: true,
                                textStyle:{color: '#ffffff'}
                            },
                            axisLine  : {
                                show:true,
                                lineStyle :{color: '#475C81', width: 1}
                            }

                        }
                    ],
                    legend: {
                        data: aClient,
                        x:"right",
                        y:"top",
                        textStyle:{"color":"#fff"},
                        padding:[30,100]

                    },
                    series : [
                        {
                            name: aClient[0],
                            type:'line',
                            smooth:true,
                            symbol:'circle',
                            symbolSize:0,
                            data:y3Data,
                            itemStyle: {
                                normal: {
                                    lineStyle:{
                                        width:1,
                                        color:"#FF9D9E"
                                    }
                                },
                                emphasis: {
                                    lineStyle:{
                                        width:1,
                                        color:"#FF9D9E"
                                    }
                                }
                            }
                        },
                        {
                            name:aClient[1],
                            type:'line',
                            smooth:true,
                            symbol:'circle',
                            symbolSize:0,
                            data:y1Data,
                            itemStyle: {
                                normal: {
                                    lineStyle:{
                                        width:1,
                                        color:"#4EC1B2"
                                    }
                                },
                                emphasis: {
                                    lineStyle:{
                                        width:1,
                                        color:"#4EC1B2"
                                    }
                                }
                            }
                        },
                        {
                            name: aClient[2],
                            type:'line',
                            smooth:true,
                            symbol:'circle',
                            symbolSize:0,
                            data:y2Data,
                            itemStyle: {
                                normal: {
                                    lineStyle:{
                                        width:1,
                                        color:"#FBCEB1"

                                    }
                                },
                                emphasis: {
                                    lineStyle:{
                                        width:1,
                                        color:"#FBCEB1"

                                    }
                                }
                            }
                        }
                    ],
                    color: ["#FF9D9E","#4EC1B2","#FBCEB1"]
                   // color[g_choice-1] =  "#9DE274"
                };
                lineOption.series[g_choice-1].itemStyle.normal.lineStyle.width = 3;
                lineOption.series[g_choice-1].itemStyle.normal.lineStyle.color = "#9DE274";
                lineOption.series[g_choice-1].itemStyle.emphasis.lineStyle.color = "#9DE274";
                timeLine.setOption(lineOption);
            };
            var readProbeClientUrl=Utils.getUrl('POST','','/ant/read_probeclient','/init/clientstatistics0/read_probe_client.json');
            var ajaxMsg={
                url:readProbeClientUrl.url,
                method:readProbeClientUrl.method,
                data:{}
            };
            //画折线图
            $scope.initTimeClient=function(){
               // debugger;
                var dateState = 0;
                var data={};
                data.Param=g_condition;
                if(EndTime - StartTime <= 24 * 60 * 60 * 1000){
                    data.Method="MultiClassify";
                    data.Param.Count=3;
                    ajaxMsg.data=data;
                }else{
                    dateState = 1;
                    data.Method = "DaysInfo";
                    data.Return = ["Date", "Count", "NewClient"];
                    ajaxMsg.data=data;
                }
                $http(ajaxMsg).success(function(data){
                    console.log(data);
                    $scope.drawTimeLine(data.Message,dateState);
                }).error(function(){});
            };
            //画表格
            $scope.initSimpleSlist=function(){
                var data={};
                data.Method = "GetAllClients";
                data.Param=g_condition;
                data.return=["MacAddress", "FirstTime", "LastTime", "Count"];
                ajaxMsg.data=data;
                $http(ajaxMsg).success(function(data){
                    console.log(data);
                    $scope.$broadcast('load#visitorData',data);
                }).error(function(){});
            };
            //  画饼图
            $scope.
            //页面显示判断
            $scope.dateOption=function(){//时间选择
                var daytemp = new Date().getTime();//显示当前时间毫秒数
                var daynow = new Date(new Date().toLocaleDateString()).getTime();//零点时间毫秒
                switch ($scope.time){
                    //debugger
                    case date[0]:{
                        StartTime=daynow;
                        EndTime=daytemp;
                        break;
                    }
                    case date[1]:{
                        StartTime   = daynow - 8 *24 * 60 * 60 * 1000;
                        EndTime     = daynow;
                        break;
                    }
                    case date[2]:{
                        StartTime   = daynow  - 31 *24 * 60 * 60 * 1000;
                        EndTime     = daynow;
                        break;
                    }
                    case date[3]:{
                        StartTime   = daynow - 366 *24 * 60 * 60 * 1000;
                        EndTime     = daynow;
                        break;
                    }
                    default:{
                        //debugger;
                        StartTime=new Date(StartTime).getTime();
                        EndTime=new Date(EndTime).getTime();
                    }
                }
                $scope.initTimeClient();
                $scope.initSimpleSlist();
            };
            $scope.chartOption=function(){
                $scope.chartAnalyze=true;
                switch($scope.type){
                    case charts[0]:{
                        $scope.initTimeClient();
                    }
                    case charts[1]:{
                        debugger
                        $scope.$apply(function (){
                            $scope.chartAnalyze=false;
                        });
                        //调用饼图函数
                    }
                }
            };
            //选择执行哪个时间
            $scope.dateOption();
        }]
});
