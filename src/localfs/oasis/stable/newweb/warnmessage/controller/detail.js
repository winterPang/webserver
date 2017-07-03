define(['utils','jquery', 'moment', 'echarts3','bootstrap-daterangepicker','css!../css/warntable'], function (Utils, $,moment, echarts) {
    return ['$rootScope', '$scope', '$http', '$alertService', function ($rootScope, $scope, $http, $alert) {
        function getRcString(attrName) {
            return Utils.getRcString("warn_rc", attrName);
        }
        var myChartLine = echarts.init(document.getElementById('main'));
        var myChartCircle = echarts.init(document.getElementById('mainCircle'));
        var startValue,endValue;
        var timeList=[];
        $http.get('../warnmessage/data.json').success(function(data){
            $.each(data.message,function(i,arr){
                timeList.push(new Date(parseInt(arr.time) * 1000).toLocaleString().replace(/:\d{1,2}$/,' '));
            })
            var optionLine = {
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data:['上下线','重启','cpu过高','内存泄漏']
                },
                calculable : true,
                grid: {
                },
                // dataZoom: [
                //     {
                //     type: 'inside',
                //     start: 0,
                //     end: 100
                //     }, {
                //     start: 0,
                //     end: 100,
                //     handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                //     handleSize: '80%',
                //     handleStyle: {
                //         color: '#fff',
                //         shadowBlur: 3,
                //         shadowColor: 'rgba(0, 0, 0, 0.6)',
                //         shadowOffsetX: 2,
                //         shadowOffsetY: 2
                //     }
                // }],
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : timeList,
                        splitLine:{
                            show:true
                        },
                        axisLine:{
                            lineStyle:{
                                color:'#aaa'
                            }
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        axisLine:{
                            lineStyle:{
                                color:'#aaa'
                            }
                        },
                        splitLine:{

                        }
                    }
                ],
                series : [
                    {
                        name:'上下线',
                        type:'line',
                        stack: '总量',
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        data:[120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        name:'重启',
                        type:'line',
                        stack: '总量',
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        data:[220, 182, 191, 234, 290, 330, 310]
                    },
                    {
                        name:'cpu过高',
                        type:'line',
                        stack: '总量',
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        data:[150, 232, 201, 154, 190, 330, 410]
                    },
                    {
                        name:'内存泄漏',
                        type:'line',
                        stack: '总量',
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        data:[320, 332, 301, 334, 390, 330, 320]
                    },
                    {
                        name:'搜索引擎',
                        type:'line',
                        stack: '总量',
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        data:[820, 932, 901, 934, 1290, 1330, 1320]
                    }
                ]
            };
            var optionCircle = {
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    x : 'left',
                    data:['上下线','重启','cpu过高','内存泄漏']
                },
                calculable : true,
                series : [
                    {
                        name:'访问来源',
                        type:'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data:[
                            {value:335, name:'上下线'},
                            {value:310, name:'重启'},
                            {value:234, name:'cpu过高'},
                            {value:135, name:'内存泄漏'}
                        ]
                    }
                ]
            };
            // 使用刚指定的配置项和数据显示图表。
            myChartLine.setOption(optionLine);
            myChartCircle.setOption(optionCircle);
        }).error(function(res){});

        window.addEventListener("resize", function () {
            myChartLine.resize();
            myChartCircle.resize();
        });

        //时间控件
        $('#demo').daterangepicker({
            startDate: moment().startOf("week"),
            endDate: moment(),
            maxDate: moment(),
            dateLimit:'year',
            opens: "center",
            locale: {
                format: "YYYY/MM/DD HH:mm:ss",
                applyLabel: '应用',
                cancelLabel:"取消",
                fromLabel:"起始时间",
                toLabel: "结束时间",
                customRangeLabel: "自定义",
                daysOfWeek: getRcString("DRP_DAYSOFWEEK").split(","),
                monthNames: getRcString("DRP_MONTHNAMES").split(",")
            }
        }, function(start, end, label) {
            console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
        });
        $('.applyBtn').click(function () {
            startValue = $("input[name='daterangepicker_start']").val().replace("/", "-").replace("/", "-");
            endValue = $("input[name='daterangepicker_end']").val().replace("/", "-").replace("/", "-");
            var startTimeNumber=new Date(startValue).getTime();
            var endValueNumber=new Date(endValue).getTime();
            getxAxisData(startTimeNumber,endValueNumber);
        });
        //获取横坐标单位
        function getxAxisData(start,end){
            var range=(end-start);

        }
        $scope.warnTable = {
            url: '../warnmessage/init/warntable.json',
            tId: 'warnTable',
            showCheckBox: true,
            extraCls: 'new_style_170413_table',
            columns: [
                {field: 'alias', showTooltip: true, title: '设备别名'},
                {field: 'sn', showTooltip: true, title: '设备序列号'},
                {field: 'warnCate', showTooltip: true, title: '告警类别'},
                {field: 'warnDetail', showTooltip: true, title: '详细信息'},
                {field: 'warnRank', showTooltip: true, title: '严重级别'},
                {field: 'warnTime', showTooltip: true, title: '告警时间'},
                {field: 'status', showTooltip: true, title: '状态'}
            ]
        };

    }];
});