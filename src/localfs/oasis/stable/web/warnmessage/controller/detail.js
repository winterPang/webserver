define(['utils','jquery', 'moment', 'echarts3','bootstrap-daterangepicker','css!../css/warntable'], function (Utils, $,moment, echarts) {
    return ['$rootScope', '$scope', '$http', '$alertService', function ($rootScope, $scope, $http, $alert) {
        function getRcString(attrName) {
            return Utils.getRcString("warn_rc", attrName);
        }
        var myChartLine = echarts.init(document.getElementById('main'));
        var myChartCircle = echarts.init(document.getElementById('mainCircle'));
        var startValue,endValue;
        var timeList=[];
        //
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
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : timeList
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'上下线',
                        type:'line',
                        stack: '总量',
                        data:[120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        name:'重启',
                        type:'line',
                        stack: '总量',
                        data:[220, 182, 191, 234, 290, 330, 310]
                    },
                    {
                        name:'cpu过高',
                        type:'line',
                        stack: '总量',
                        data:[150, 232, 201, 154, 190, 330, 410]
                    },
                    {
                        name:'内存泄漏',
                        type:'line',
                        stack: '总量',
                        data:[320, 332, 301, 334, 390, 330, 320]
                    },
                    {
                        name:'搜索引擎',
                        type:'line',
                        stack: '总量',
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