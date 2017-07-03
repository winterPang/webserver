;(function($){
    var MODULE_NAME = "classroom.campusparents";
    var oTheme = {
        color: ['#4ec1b2', '#ff9c9e', '#fbceb1', '#b3b7dd', '#F7C762']
    };
    var aday = ['01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00,',
            '13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00','24:00'],
        aweek = getHistoryDate(7),
        amonth = getHistoryDate(31),
        ayear = getHistoryMonthDate(12);
    var g_studentId = {};

    function getRcText(sRcName) {
        return Utils.Base.getRcString("c_campus_parents", sRcName);
    }

    //对获得的出入校时间做操作，格式为00:00:00
    function getConvertTime (time){
        function timer(reverse){
            if(reverse<10){
                return ("0"+reverse);
            }
            return reverse;
        }
        var allTime=new Date(time);
        var hour=allTime.getHours();
        var minutes=allTime.getMinutes();
        var seconds=allTime.getSeconds();
        var result=timer(hour)+":"+timer(minutes)+":"+timer(seconds);
        return result;
    }

    function getHistoryDate(n) {
        var myDate = new Date(); //获取今天日期
        myDate.setDate(myDate.getDate() - n);
        var dateArray = [];
        var dateTemp;
        var flag = 1;
        for (var i = 0; i < n; i++) {
            dateTemp = (myDate.getMonth() + 1) + "-" + myDate.getDate();
            dateArray.push(dateTemp);
            myDate.setDate(myDate.getDate() + flag);
        }
        return dateArray;
    }

    function getHistoryMonthDate(numMonth) {
        var complDate = [];
        var curDate = new Date();
        var y = curDate.getFullYear();
        var m = curDate.getMonth();
        //第一次装入当前月(格式yyyy-mm)
        complDate[0] = y + "-" + (m.toString().length == 1 ? "0" + m : m);
        m--;
        //第一次已经装入,numMonth少计算一次
        for (var i = 1; i < numMonth; i++, m--) {
            if (m == 0) {
                //到1月后,后推一年
                y--;
                m = 12; //再从12月往后推
            }
            complDate[i] = y + "-" + (m.toString().length == 1 ? "0" + m : m);
        }
        return complDate.reverse();
    }

   /* function initColumnar(date, data1, data2)
    {
        var option = {
            height:250,
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter: function (params) {
                    var tar = params[0];
                    return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
                }
            },
            xAxis : [
                {
                    name:"日期",
                    type : 'category',
                    axisLine:{
                        show:false
                    },
                    splitLine:{
                        show:false
                    },
                    data : date
                }
            ],
            yAxis : [
                {
                    name:'出入校时间',
                    type : 'value',
                    axisLine:{
                        show:false
                    },
                    splitLine:{
                        lineStyle:{color:'#e5e5e5'}
                    }
                }
            ],
            series : [
                {
                    type:'bar',
                    stack: '总量',
                    barCategoryGap:'70%',
                    itemStyle:{
                        normal:{
                            barBorderColor:'rgba(0,0,0,0)',
                            color:'rgba(0,0,0,0)'
                        },
                        emphasis:{
                            barBorderColor:'#4ec1b2',
                            color:'#4ec1b2'
                        }
                    },
                    data:data1
                },
                {
                    type:'bar',
                    stack: '总量',
                    itemStyle : {
                        normal: {
                            label : {
                                show: true,
                                position: 'inside'
                            },
                            barBorderRadius:30,
                            barGap:10
                        }
                    },
                    data:data2
                }
            ]
        };
        return option;
    }*/

    function initScatterOption(date, inSchool, outSchool, date_y)
    {
        var option = {
            height:250,
            legend: {
                data:['入校','出校']
            },
            xAxis : [
                {
                    type : 'category',
                    data:date,
                    boundaryGap:false
                }
            ],
            yAxis : [
                {
                    type : 'category',
                    boundaryGap:false,
                    axisLine: {onZero: true},
                    data:date_y

                }
            ],
            series : [
                {
                    name:'入校',
                    type:'scatter',
                    data: inSchool
                },
                {
                    name:'出校',
                    type:'scatter',
                    data: outSchool
                }
            ]
        };
        return option;
    }

    function initPie(data)
    {
        var option = {
            height:300,
            series : [
                {
                    name:'',
                    type:'pie',
                    radius : ['60%', '85%'],
                    center: ['50%', '30%'],
                    itemStyle : {
                        normal : {
                            label : {
                                show : true,
                                position: 'center',
                                distance: 8,
                                textStyle: {
                                    color : '#343e4e',
                                    fontFamily : '微软雅黑',
                                    fontSize : 24
                                },
                                formatter: function(){
                                    return (data[0].value-1)
                                }
                            },
                            labelLine : {
                                show : false
                            }
                        },
                        emphasis : {
                            label : {
                                show : false,
                                position : 'center',
                                textStyle : {
                                    fontSize : '30',
                                    fontWeight : 'bold'
                                }
                            }
                        }
                    },
                    data: data
                }
            ]
        };
        return option;
    }

    function initTrendOpt(date, data1, data2)
    {
        var option = {
            height:250,
            tooltip : {
                trigger: 'axis',
                formatter: function(params) {
                    return params[0].name + '<br/>'
                        + params[0].seriesName + ' : ' + params[0].value + ' (步)<br/>'
                        + params[1].seriesName + ' : ' + params[1].value + ' (公里)';
                }
            },
            legend: {
                data:['已走步数','已走距离'],
                x: 'center'
            },
            dataZoom : {
                show : true,
                realtime : true,
                start : 0,
                end : 100
            },
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    axisLine: {onZero: false},
                    data: date
                }
            ],
            yAxis : [
                {
                    name : '已走步数(步)',
                    type : 'value'
                },
                {
                    name : '已走距离（公里）',
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'已走步数',
                    type:'line',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:data1
                },
                {
                    name:'已走距离',
                    type:'line',
                    yAxisIndex:1,
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:data2
                }
            ]
        };
        return option;
    }

    function indexPerson()
    {
        Utils.Base.openDlg(null, {}, {scope: $("#EditDlg"), className: "modal-super"});
    }

    //有关进出校的函数
    function showInOutSchoolTimeHistory(id)
    {
        var date = [], date_y1 = [], outSchool = [], inSchool = [], data = [];
        var option = {};
        switch (id)
        {
            case "week_school":
                date = aweek;
                //var out_school = [14, 15, 11, 12, 13, 12.5, 13.5];
                //var in_scohool = [7, 6.5, 5.5, 6, 6.5, 7, 7.5];
                data = [{in_school:['01:00:00'], out_school:['12:00:00']},
                    {in_school:['13:00:00'], out_school:['14:00:00']},
                    {in_school:['11:00:00'], out_school:['14:00:00']},
                    {in_school:['10:00:00'], out_school:['18:00:00']},
                    {in_school:['13:00:00'], out_school:['15:00:00']},
                    {in_school:['12:00:00'], out_school:['14:00:00']},
                    {in_school:['11:00:00'], out_school:['17:00:00']}];

                for(var i=0;i<data.length;i++)
                {
                    for(var j=0; j<data[i].in_school.length; j++)
                    {
                        inSchool.push([date[i], data[i].in_school[j]]);
                        date_y1.push(data[i].in_school[j]);
                    }
                }
                for(var i=0;i<data.length;i++)
                {
                    for(var j=0; j<data[i].out_school.length; j++)
                    {
                        outSchool.push([date[i], data[i].out_school[j]]);
                        date_y1.push(data[i].out_school[j]);
                    }
                }
                option =  initScatterOption(date, inSchool, outSchool, date_y1);
                break;
            case "month_school":
                date = amonth;
                //var out_school = [14, 15, 11, 12, 13, 12.5, 13.5];
                //var in_scohool = [7, 6.5, 5.5, 6, 6.5, 7, 7.5];
                data = [{in_school:['01:00:00'], out_school:['12:00:00']},
                    {in_school:['13:00:00'], out_school:['14:00:00']},
                    {in_school:['11:00:00'], out_school:['14:00:00']},
                    {in_school:['10:00:00'], out_school:['18:00:00']},
                    {in_school:['13:00:00'], out_school:['15:00:00']},
                    {in_school:['12:00:00'], out_school:['14:00:00']},
                    {in_school:['11:00:00'], out_school:['17:00:00']},
                    {in_school:['08:00:00'], out_school:['18:00:00']},
                    {in_school:['06:00:00'], out_school:['16:00:00']},
                    {in_school:['05:00:00'], out_school:['17:00:00']},

                    {in_school:['01:00:00'], out_school:['12:00:00']},
                    {in_school:['13:00:00'], out_school:['14:00:00']},
                    {in_school:['11:00:00'], out_school:['14:00:00']},
                    {in_school:['10:00:00'], out_school:['18:00:00']},
                    {in_school:['13:00:00'], out_school:['15:00:00']},
                    {in_school:['12:00:00'], out_school:['14:00:00']},
                    {in_school:['11:00:00'], out_school:['17:00:00']},
                    {in_school:['08:00:00'], out_school:['18:00:00']},
                    {in_school:['06:00:00'], out_school:['16:00:00']},
                    {in_school:['05:00:00'], out_school:['17:00:00']},

                    {in_school:['01:00:00'], out_school:['12:00:00']},
                    {in_school:['13:00:00'], out_school:['14:00:00']},
                    {in_school:['11:00:00'], out_school:['14:00:00']},
                    {in_school:['10:00:00'], out_school:['18:00:00']},
                    {in_school:['13:00:00'], out_school:['15:00:00']},
                    {in_school:['12:00:00'], out_school:['14:00:00']},
                    {in_school:['11:00:00'], out_school:['17:00:00']},
                    {in_school:['08:00:00'], out_school:['18:00:00']},
                    {in_school:['06:00:00'], out_school:['16:00:00']},
                    {in_school:['05:00:00'], out_school:['17:00:00']}
                ];
                for(var i=0;i<data.length;i++)
                {
                    for(var j=0; j<data[i].in_school.length; j++)
                    {
                        inSchool.push([date[i], data[i].in_school[j]]);
                        date_y1.push(data[i].in_school[j]);
                    }
                }
                for(var i=0;i<data.length;i++)
                {
                    for(var j=0; j<data[i].out_school.length; j++)
                    {
                        outSchool.push([date[i], data[i].out_school[j]]);
                        date_y1.push(data[i].out_school[j]);
                    }
                }
                option =  initScatterOption(date, inSchool, outSchool, date_y1);
                break;
        }

        $("#in_out_school_time").echart("init", option, oTheme)
    }

    function showClassMateActive(id)
    {
        switch(id)
        {
            case "day_class":
                $("#person_hand_count").html(3);
                $("#class_rank_number").html(1);
                break;
            case "week_class":
                $("#person_hand_count").html(8);
                $("#class_rank_number").html(5);
                break;
            case  "month_class":
                $("#person_hand_count").html(12);
                $("#class_rank_number").html(4);
                break;
            case "year_class":
                $("#person_hand_count").html(56);
                $("#class_rank_number").html(1);
                break;
        }
    }

    function drawPie(have_walk_number, have_walk_distance, class_rank)
    {
        var data_walk = [
            {
                value: 1 + have_walk_number
            }
        ];
        var option_walk = initPie(data_walk);
        var appendTohtml_walk = [
            '<div style="position: relative;top: -160px;margin: 0 auto;width: 100px;"><div>' +
            '<span style="font-size: 12px; color:#343e4e; display: block;float: left; margin-left: 38px; margin-top: -35px;">',
            '步数',
            '</span>',
            '</div>'
        ].join(" ");
        $("#walk_number").echart("init", option_walk, oTheme);
        $(appendTohtml_walk).appendTo($("#walk_number"));

        var data_distance = [
            {
                value: 1 + have_walk_distance
            }
        ];
        var option_distance = initPie(data_distance);
        var appendTohtml_distance = [
            '<div style="position: relative;top: -160px;margin: 0 auto;width: 100px;"><div>' +
            '<span style="font-size: 12px; color:#343e4e; display: block;float: left; margin-left: 38px; margin-top: -35px;">',
            '公里',
            '</span>',
            '</div>'
        ].join(" ");
        $("#walk_distance").echart("init", option_distance, oTheme);
        $(appendTohtml_distance).appendTo($("#walk_distance"));

        var data_rank = [
            {
                value: 1 + class_rank
            }
        ];
        var option_rank = initPie(data_rank);
        var appendTohtml_rank = [
            '<div style="position: relative;top: -160px;margin: 0 auto;width: 100px;"><div>' +
            '<span style="font-size: 12px; color:#343e4e; display: block;float: left; margin-left: 38px; margin-top: -35px;">',
            '名次',
            '</span>',
            '</div>'
        ].join(" ");
        $("#class_number").echart("init", option_rank, oTheme);
        $(appendTohtml_rank).appendTo($("#class_number"));
    }

    function day_showPersonHealthRank(studentId)
    {
        function onSuc(aData){
            if(aData.retCode == 0){
                var result = aData.result;
                var have_walk_number = result.step,
                    have_walk_distance = result.distance,
                    class_rank = result.rank;
                drawPie(have_walk_number, have_walk_distance, class_rank);
            }
            else{
                drawPie(4688, 2.5, 2);
            }
        }
        var Option = {
            type:"POST",
            url:MyConfig.path + "/smartcampusread",
            contentType:"application/json",
            timeout:20000,
            data:JSON.stringify({
                devSn: FrameInfo.ACSN,
                Method:"getPersonalHealthRank",
                Param:{
                    devSn: FrameInfo.ACSN,
                    studentId: studentId
                }
            }),
            onSuccess:onSuc,
            onFailed:function(){
                drawPie(4688, 2.5, 2);
            }
        };
        Utils.Request.sendRequest(Option);
    }

    function showPersonHealthRank(id)
    {
        var data_walk = [], data_distance = [], data_rank = [];
        var option_walk = {}, option_distance = {}, option_rank = {};
        var appendTohtml_walk = [], appendTohtml_distance = [], appendTohtml_rank = [];
        switch(id)
        {
            case "day_health":
                day_showPersonHealthRank(g_studentId);
                break;
            case "week_health":
                /*步数数据*/
                data_walk = [
                    {
                        value: 2.868
                    }
                ];
                option_walk = initPie(data_walk);
                appendTohtml_walk = [
                    '<div style="position: relative;top: -160px;margin: 0 auto;width: 100px;"><div>' +
                    '<span style="font-size: 28px; color:#343e4e; display: block;float: left; margin-left: 18px; margin-top: -15px;">',
                    '2.868',
                    '</span>',
                    '<span style="font-size: 12px; color:#343e4e; display: block;float: left; margin-left: 38px; margin-top: -5px;">',
                    '万步',
                    '</span>',
                    '</div>'
                ].join(" ");
                $("#walk_number").echart("init", option_walk, oTheme);
                $(appendTohtml_walk).appendTo($("#walk_number"));

                data_distance = [
                    {
                        value: 14.1
                    }
                ];
                option_distance = initPie(data_distance);
                appendTohtml_distance = [
                    '<div style="position: relative;top: -160px;margin: 0 auto;width: 100px;"><div>' +
                    '<span style="font-size: 28px; color:#343e4e; display: block;float: left; margin-left: 30px; margin-top: -15px;">',
                    '14',
                    '</span>',
                    '<span style="font-size: 12px; color:#343e4e; display: block;float: left; margin-left: 38px; margin-top: -5px;">',
                    '公里',
                    '</span>',
                    '</div>'
                ].join(" ");
                $("#walk_distance").echart("init", option_distance, oTheme);
                $(appendTohtml_distance).appendTo($("#walk_distance"));

                data_rank = [
                    {
                        value: 3
                    }
                ];
                option_rank = initPie(data_rank);
                appendTohtml_rank = [
                    '<div style="position: relative;top: -160px;margin: 0 auto;width: 100px;"><div>' +
                    '<span style="font-size: 28px; color:#343e4e; display: block;float: left; margin-left: 38px; margin-top: -15px;">',
                    '2',
                    '</span>',
                    '<span style="font-size: 12px; color:#343e4e; display: block;float: left; margin-left: 38px; margin-top: -5px;">',
                    '名次',
                    '</span>',
                    '</div>'
                ].join(" ");
                $("#class_number").echart("init", option_rank, oTheme);
                $(appendTohtml_rank).appendTo($("#class_number"));
                break;
            case  "month_health":
                /*步数数据*/
                data_walk = [
                    {
                        value: 12.86
                    }
                ];
                option_walk = initPie(data_walk);
                appendTohtml_walk = [
                    '<div style="position: relative;top: -160px;margin: 0 auto;width: 100px;"><div>' +
                    '<span style="font-size: 28px; color:#343e4e; display: block;float: left; margin-left: 18px; margin-top: -15px;">',
                    '12.86',
                    '</span>',
                    '<span style="font-size: 12px; color:#343e4e; display: block;float: left; margin-left: 38px; margin-top: -5px;">',
                    '万步',
                    '</span>',
                    '</div>'
                ].join(" ");
                $("#walk_number").echart("init", option_walk, oTheme);
                $(appendTohtml_walk).appendTo($("#walk_number"));

                data_distance = [
                    {
                        value: 54.2
                    }
                ];
                option_distance = initPie(data_distance);
                appendTohtml_distance = [
                    '<div style="position: relative;top: -160px;margin: 0 auto;width: 100px;"><div>' +
                    '<span style="font-size: 28px; color:#343e4e; display: block;float: left; margin-left: 30px; margin-top: -15px;">',
                    '54',
                    '</span>',
                    '<span style="font-size: 12px; color:#343e4e; display: block;float: left; margin-left: 38px; margin-top: -5px;">',
                    '公里',
                    '</span>',
                    '</div>'
                ].join(" ");
                $("#walk_distance").echart("init", option_distance, oTheme);
                $(appendTohtml_distance).appendTo($("#walk_distance"));

                data_rank = [
                    {
                        value: 1
                    }
                ];
                option_rank = initPie(data_rank);
                appendTohtml_rank = [
                    '<div style="position: relative;top: -160px;margin: 0 auto;width: 100px;"><div>' +
                    '<span style="font-size: 28px; color:#343e4e; display: block;float: left; margin-left: 38px; margin-top: -15px;">',
                    '1',
                    '</span>',
                    '<span style="font-size: 12px; color:#343e4e; display: block;float: left; margin-left: 38px; margin-top: -5px;">',
                    '名次',
                    '</span>',
                    '</div>'
                ].join(" ");
                $("#class_number").echart("init", option_rank, oTheme);
                $(appendTohtml_rank).appendTo($("#class_number"));
                break;
            case "year_health":
                /*步数数据*/
                data_walk = [
                    {
                        value: 1286880
                    }
                ];
                option_walk = initPie(data_walk);
                appendTohtml_walk = [
                    '<div style="position: relative;top: -160px;margin: 0 auto;width: 100px;"><div>' +
                    '<span style="font-size: 28px; color:#343e4e; display: block;float: left; margin-left: 18px; margin-top: -15px;">',
                    '128.6',
                    '</span>',
                    '<span style="font-size: 12px; color:#343e4e; display: block;float: left; margin-left: 38px; margin-top: -5px;">',
                    '万步',
                    '</span>',
                    '</div>'
                ].join(" ");
                $("#walk_number").echart("init", option_walk, oTheme);
                $(appendTohtml_walk).appendTo($("#walk_number"));

                data_distance = [
                    {
                        value: 600
                    }
                ];
                option_distance = initPie(data_distance);
                appendTohtml_distance = [
                    '<div style="position: relative;top: -160px;margin: 0 auto;width: 100px;"><div>' +
                    '<span style="font-size: 28px; color:#343e4e; display: block;float: left; margin-left: 30px; margin-top: -15px;">',
                    '600',
                    '</span>',
                    '<span style="font-size: 12px; color:#343e4e; display: block;float: left; margin-left: 38px; margin-top: -5px;">',
                    '公里',
                    '</span>',
                    '</div>'
                ].join(" ");
                $("#walk_distance").echart("init", option_distance, oTheme);
                $(appendTohtml_distance).appendTo($("#walk_distance"));

                data_rank = [
                    {
                        value: 1
                    }
                ];
                option_rank = initPie(data_rank);
                appendTohtml_rank = [
                    '<div style="position: relative;top: -160px;margin: 0 auto;width: 100px;"><div>' +
                    '<span style="font-size: 28px; color:#343e4e; display: block;float: left; margin-left: 38px; margin-top: -15px;">',
                    '1',
                    '</span>',
                    '<span style="font-size: 12px; color:#343e4e; display: block;float: left; margin-left: 38px; margin-top: -5px;">',
                    '名次',
                    '</span>',
                    '</div>'
                ].join(" ");
                $("#class_number").echart("init", option_rank, oTheme);
                $(appendTohtml_rank).appendTo($("#class_number"));
                break;
        }
    }

    function showHealthDataTrend(id)
    {
        var have_walk_number = [], have_walk_distance = [];
        var option = {};
        switch(id)
        {
            case 'week_trend':
                have_walk_number = [5000,6000,3120,4320,4000,2000,2300];
                have_walk_distance = [3.5, 4, 2.5, 3, 3.5, 1.5, 1.6];
                option = initTrendOpt(aweek, have_walk_number, have_walk_distance);
                break;
            case 'month_trend':
                have_walk_number = [5000, 6000, 3120, 4320, 4000, 2000, 2300, 5008, 6500, 4512, 3550, 4550, 6200, 6230, 4500,
                                    5600, 6100, 3000, 4500, 4300, 2360, 2360, 2380, 3455, 4444, 2224, 5530, 4526, 6365, 4654,2300];
                have_walk_distance = [3.5, 4, 2.5, 3, 3.5, 1.5, 1.6, 3.5, 3.8, 2.8, 2.7, 3, 4.2, 4, 3,
                                      3.5, 4, 2.3, 2.7, 2.8, 1.4, 1.6, 1.6, 2.4, 3.1, 1.5, 3.5, 3, 4,5, 3.5, 1.9];
                option = initTrendOpt(amonth, have_walk_number, have_walk_distance);
                break;
            case 'year_trend':
                have_walk_number = [16000, 15040, 16002, 12000, 13000, 10040, 12000, 23000, 14500, 15600, 16780, 1000];
                have_walk_distance = [15.5, 14.5, 16, 11.5, 12.5, 9.5, 12.6, 22, 14, 15, 16.2, 9];
                option = initTrendOpt(ayear, have_walk_number, have_walk_distance);
                break;
        }
        $("#health_data_trend").echart("init", option, oTheme);
    }

    function getStudentBaseInfo(studentId)
    {
        function onSuc(aData){
            if(aData.retCode == 0)
            {
                if (aData.result.data.length == 0) {
                    $("#student_name").text("高超");
                    $("#grade_number").text("一年级");
                    $("#class_time").text("1班");
                }
                else {
                    var result = aData.result.data[0];
                    var studentName = result.studentName,
                        grade = result.grade,
                        classId = result.classId;
                    if (studentName != undefined && (grade != undefined) && (classId != undefined))
                    {
                        $("#student_name").html(studentName);
                        $("#grade_number").html(grade);
                        $("#class_time").html(classId + '班');
                    }
                    else {
                        $("#student_name").text("高超");
                        $("#grade_number").text("一年级");
                        $("#class_time").text("1班");
                    }
                }
            }
            else{
                $("#student_name").text("高超");
                $("#grade_number").text("一年级");
                $("#class_time").text( "1班");
            }
        }
        var getStuOpt = {
            type: "POST",
            url: MyConfig.path+"/smartcampusread",
            contentType: "application/json",
            timeout:20000,
            data: JSON.stringify({
                devSn: FrameInfo.ACSN,
                Method:"getStudent",
                Param:{
                    devSn: FrameInfo.ACSN,
                    studentId: studentId
                }
            }),
            onSuccess:onSuc,
            onFailed: function(){
                $("#student_name").text("高超");
                $("#grade_number").text("一年级");
                $("#class_time").text( "1班");
            }
        };
        Utils.Request.sendRequest(getStuOpt);
    }

    //获得某个学生的进校时间
    function getStudentInSchool(studentId)
    {
        function onSuc(aData){
            if(aData.retCode == 0) {
                if(aData.result.data.length == 0)
                {
                    $('#in_school_time').html("00:00:00");
                }
                else{
                    var inSchoolTime = aData.result.data[0];
                    var inSchoolTime2 = inSchoolTime.inOutSchoolTimesStamp;
                    if(inSchoolTime2 != undefined)
                    {
                        $('#in_school_time').html(getConvertTime(inSchoolTime2));
                    }
                    else{
                        $('#in_school_time').html("00:00:00");
                    }
                }
            }
            else{
                $('#in_school_time').html("00:00:00");
            }
        }
        var Option = {
            type:"POST",
            url:MyConfig.path+"/smartcampusread",
            contentType:"application/json",
            timeout:20000,
            data:JSON.stringify({
                devSn: FrameInfo.ACSN,
                Method:"getStudentInSchoolSta",
                Param:{
                    devSn: FrameInfo.ACSN,
                    studentId: studentId
                }
            }),
            onSuccess:onSuc,
            onFailed:function(){
                $('#in_school_time').html("00:00:00");
            }
        };
        Utils.Request.sendRequest(Option);
    }

    //获得某个学生的出校时间
    function getStudentOutSchool(studentId){
        function onSuc(aData) {
            if (aData.retCode == 0) {
                if (aData.result.data.length == 0) {
                    $('#out_school_time').html("00:00:00");
                }
                else {
                    var outSchoolTime = aData.result.data[0];
                    var outSchoolTime2 = outSchoolTime.inOutSchoolTimesStamp;
                    if (outSchoolTime2 != undefined) {
                        $('#out_school_time').html(getConvertTime(outSchoolTime2));
                    }
                    else {
                        $('#out_school_time').html("00:00:00");
                    }
                }
            }
            else {
                $('#out_school_time').html("00:10:00");
            }
        }
        var Option = {
            type:"POST",
            url:MyConfig.path+"/smartcampusread",
            contentType:"application/json",
            timeout:20000,
            data:JSON.stringify({
                devSn: FrameInfo.ACSN,
                Method:"getStudentOutSchoolSta",
                Param:{
                    devSn: FrameInfo.ACSN,
                    studentId: studentId
                }
            }),
            onSuccess:onSuc,
            onFailed:function(){
                $('#out_school_time').html("00:00:00");
            }
        };
        Utils.Request.sendRequest(Option);

    }

    function getStudentLocation(studentId)
    {
        function onSuc(aData){
            if(aData.retCode == 0)
            {
                var result = aData.result;
                var scannerId = result.scannerId;
                if(scannerId == 16)
                {
                    $("#area_name").removeClass("color_info");
                    $("#area_name").addClass("color-emergency");
                    $("#area_img").removeClass("info-icon");
                    $("#area_img").addClass("emergency-icon");
                    $("#area_name").text("拥挤告警");
                }
                else
                {
                    $("#area_name").removeClass("color-emergency");
                    $("#area_name").addClass("color_info");
                    $("#area_img").removeClass("emergency-icon");
                    $("#area_img").addClass("info-icon");
                    $("#area_name").text("校门");
                }
            }
            else{
                $("#area_name").removeClass("color-emergency");
                $("#area_name").addClass("color_info");
                $("#area_img").removeClass("emergency-icon");
                $("#area_img").addClass("info-icon");
                $("#area_name").text("校门");
            }


        }
        var Option = {
            type:"POST",
            url:MyConfig.path+"/smartcampusread",
            contentType:"application/json",
            timeout:20000,
            data:JSON.stringify({
                devSn: FrameInfo.ACSN,
                Method:"getStudentLocation",
                Param:{
                    devSn: FrameInfo.ACSN,
                    studentId: studentId
                }
            }),
            onSuccess:onSuc,
            onFailed:function(){
                $("#area_name").removeClass("color-emergency");
                $("#area_name").addClass("color_info");
                $("#area_img").removeClass("emergency-icon");
                $("#area_img").addClass("info-icon");
                $("#area_name").text("校门");
            }
        };
        Utils.Request.sendRequest(Option);
    }

    function getCurrentHeartRate(studentId)
    {
        function onSuc(aData){
            if(aData.retCode == 0){
                var result = aData.result;
                var heartRate = result.heartrate,
                    testTime = result.time;
                if(heartRate > 160)
                {
                    $("#heart_img").removeClass("green");
                    $("#heart_img").addClass("red");
                    $("#QuickCount").removeClass("heart_rate");
                    $("#QuickCount").addClass("heart_rate_red");
                    $("#test_time").removeClass("heart_rate");
                    $("#test_time").addClass("heart_rate_red");
                    $("#heart_text").text("心率过速（>160）");
                }
                else if(heartRate < 40) {
                    $("#heart_img").removeClass("green");
                    $("#heart_img").addClass("red");
                    $("#heart_text").text("心率过缓（<40）");
                    $("#QuickCount").removeClass("heart_rate");
                    $("#QuickCount").addClass("heart_rate_red");
                    $("#test_time").removeClass("heart_rate");
                    $("#test_time").addClass("heart_rate_red");
                }
                else{
                    $("#heart_img").removeClass("red");
                    $("#heart_img").addClass("green");
                    $("#QuickCount").removeClass("heart_rate_red");
                    $("#QuickCount").addClass("heart_rate");
                    $("#test_time").removeClass("heart_rate_red");
                    $("#test_time").addClass("heart_rate");
                    $("#heart_text").text("当前心率");
                }
                $("#QuickCount").html(heartRate);
                $("#test_time").html(getConvertTime(testTime));
            }
            else{
                $("#heart_text").text("当前心率");
                $('#QuickCount').html(120);
                $("#test_time").html("08:15:01");
            }
        }
        var Option = {
            type:"POST",
            url:MyConfig.path+"/smartcampusread",
            contentType:"application/json",
            timeout:20000,
            data:JSON.stringify({
                devSn: FrameInfo.ACSN,
                Method:"getRealTimeHeartRate",
                Param:{
                    devSn: FrameInfo.ACSN,
                    studentId: studentId
                }
            }),
            onSuccess:onSuc,
            onFailed:function(){
                $("#heart_text").text("当前心率");
                $('#QuickCount').html(120);
                $("#test_time").html("08:15:01");
            }
        };
        Utils.Request.sendRequest(Option);
    }

    function initStateData()
    {
        /*获取学号2016010101个人基本信息*/
        getStudentBaseInfo('2016010101');

        /*出入校时间的获取*/
        getStudentInSchool('2016010101');
        getStudentOutSchool('2016010101');

        /*获取学生当前位置信息*/
        getStudentLocation('2016010101');

        /*当前心率初始化数据*/
        getCurrentHeartRate('2016010101');

        /*课堂活跃度初始化数据*/
        $("#person_hand_count").html(3);
        $("#class_rank_number").html(1);

        /*出入校时间历史数据初始化*/
        var date = aweek;
        //var out_school = [14, 15, 11, 12, 13, 12.5, 13.5];
        //var in_school = [7, 6.5, 5.5, 6, 6.5, 7, 7.5];
        var data = [{in_school:['01:10:00','12:11:01'], out_school:['12:10:00']},
                     {in_school:['13:30:00'], out_school:['14:15:00']},
                     {in_school:['11:20:00'], out_school:['14:23:00']},
                     {in_school:['10:12:00'], out_school:['18:10:00']},
                     {in_school:['13:00:00'], out_school:['15:40:00']},
                     {in_school:['12:12:00'], out_school:['14:26:00']},
                     {in_school:['11:15:00'], out_school:['17:50:00']}];

        var inSchool = [], date_y = [];
        for(var i=0;i<data.length;i++)
        {
            for(var j=0; j<data[i].in_school.length; j++)
            {
                inSchool.push([date[i], data[i].in_school[j]]);
                date_y.push(data[i].in_school[j]);
            }
        }
        var outSchool = [];
        for(var i=0;i<data.length;i++)
        {
            for(var j=0; j<data[i].out_school.length; j++)
            {
                outSchool.push([date[i], data[i].out_school[j]]);
                date_y.push(data[i].out_school[j]);
            }
        }

        var option =  initScatterOption(date, inSchool, outSchool, date_y);
        $("#in_out_school_time").echart("init", option, oTheme);

        /*健康数据累计值*/
        day_showPersonHealthRank('2016010101');

        /*健康数据趋势*/
        var have_walk_number = [5000,6000,3120,4320,4000,2000,2300];
        var have_walk_distance = [3.5, 4, 2.5, 3, 3.5, 1.5, 1.6];
        var option_trend = initTrendOpt(aweek, have_walk_number, have_walk_distance);
        $("#health_data_trend").echart("init", option_trend, oTheme);

    }

    function initData(studentID)
    {
        getStudentBaseInfo(studentID);
        getStudentInSchool(studentID);
        getStudentOutSchool(studentID);
        getStudentLocation(studentID);
        getCurrentHeartRate(studentID);
        day_showPersonHealthRank(studentID);

        /*课堂活跃度初始化数据*/
        $("#person_hand_count").html(3);
        $("#class_rank_number").html(1);
        /*出入校时间历史数据初始化*/
        var date = aweek;
        //var out_school = [14, 15, 11, 12, 13, 12.5, 13.5];
        //var in_scohool = [7, 6.5, 5.5, 6, 6.5, 7, 7.5];
        var data = [{in_school:['01:00:00'], out_school:['12:00:00']},
            {in_school:['13:00:00'], out_school:['14:00:00']},
            {in_school:['11:00:00'], out_school:['14:00:00']},
            {in_school:['10:00:00'], out_school:['18:00:00']},
            {in_school:['13:00:00'], out_school:['15:00:00']},
            {in_school:['12:00:00'], out_school:['14:00:00']},
            {in_school:['11:00:00'], out_school:['17:00:00']}];

        var inSchool = [], date_y = [];
        for(var i=0;i<data.length;i++)
        {
            for(var j=0; j<data[i].in_school.length; j++)
            {
                inSchool.push([date[i], data[i].in_school[j]]);
                date_y.push(data[i].in_school[j]);
            }
        }
        var outSchool = [];
        for(var i=0;i<data.length;i++)
        {
            for(var j=0; j< data[i].out_school.length; j++)
            {
                outSchool.push([date[i], data[i].out_school[j]]);
                date_y.push(data[i].in_school[j]);
            }
        }
        var option =  initScatterOption(date, inSchool, outSchool);
        $("#in_out_school_time").echart("init", option, oTheme);
        /*健康数据趋势*/
        var have_walk_number = [5000,6000,3120,4320,4000,2000,2300];
        var have_walk_distance = [3.5, 4, 2.5, 3, 3.5, 1.5, 1.6];
        var option_trend = initTrendOpt(aweek, have_walk_number, have_walk_distance);

        $("#health_data_trend").echart("init", option_trend, oTheme);

    }

    //根据输入的devSN+学号学生查找该学生是否存在
    /*
    Result:[
        grade,     //年级字符串：如：一年级
        devSn,     //序列号
        studentID, //学号
        studentName, //学生名字
        classId，     //班号
        years,        //入学年份
        baseGrade,    //基础年级
        wristbandId，  //手环ID
        brithday,       //生日
        age,            //年龄
        sex,            //性别
        .............
    ]
     */

    function searchStudent()
    {
        function onSuc(aData){
            if(aData.result.data.length == 0)
            {
                Frame.Msg.alert('查无此人');
                initStateData();
            }
            else{
                var result = aData.result.data[0];
                var studentId = result.studentId;
                if(studentId != undefined)
                {
                    initData(studentId);
                }
                else
                {
                    initStateData();
                }
            }
        }
        var searchStuOpt = {
            type: "POST",
            url: MyConfig.path + "/smartcampusread",
            contentType: "application/json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method:"getStudent",
                Param:{
                    devSn: FrameInfo.ACSN,
                    studentId: g_studentId
                }
            }),
            onSuccess:onSuc,
            onFailed: function(){
                initStateData();
            }
        };
        Utils.Request.sendRequest(searchStuOpt);
    }

    function initForm()
    {
        /*指定某人*/
        $("#submit_scan").on("click", indexPerson);

        /*输入devSN和学号ID，查找学生是否存在*/
        $("#check").on("click",function(){
            g_studentId = $("#studentId").val();
            if(g_studentId)
            {
                $("#success_aplist").removeClass('gray');
                $("#success_aplist").on("click",function(){
                    searchStudent();
                });
            }
            else
            {
                $('input[name=studentId]').css("border","1px solid red");
            }
        });

        /*课堂活跃度选择周期事件*/
        $(".xx-class").on('click', function(){
            $(".xx-class").removeClass("active");
            $(this).addClass("active");
            var id = $(this).attr("id");
            showClassMateActive(id);
        });
        /*进出校选择周期事件*/
        $(".xx-school").on('click', function(){
            $(".xx-school").removeClass("active");
            $(this).addClass("active");
            var id = $(this).attr("id");
            showInOutSchoolTimeHistory(id);
        });
        /*健康数据排名周期事件*/
        $(".xx-health").on('click', function(){
            $(".xx-health").removeClass("active");
            $(this).addClass("active");
            var id = $(this).attr("id");
            if(id ==  'day_health')
            {
                day_showPersonHealthRank(g_studentId);
            }
            else{
                showPersonHealthRank(id);
            }
        });
        /*健康数据趋势周期事件*/
        $(".xx-trend").on('click', function(){
            $(".xx-trend").removeClass("active");
            $(this).addClass("active");
            var id = $(this).attr("id");
            showHealthDataTrend(id);
        });
    }

    function _init() {
        function setBreadContent(paraArr){
            
            $("#bread_index").css("display",'inline');
            $("#bread_index a").attr("href","#C_CDashboard");
            $("#bread_index a").text("物联校园(家长)");
            
            if(paraArr[0].text != ""){
                $("#bread_1").css("display",'inline');
                $("#bread_1 a").attr("href",paraArr[0].href);
                $("#bread_1 a").text(paraArr[0].text);
            }else{
                $("#bread_1").css("display",'none');
            }
            
            if(paraArr[1].text != ""){
                $("#bread_2").css("display",'inline');
                $("#bread_2 a").attr("href",paraArr[1].href);
                $("#bread_2 a").text(paraArr[1].text);
            }else{
                $("#bread_2").css("display",'none');
            }
            
            if(paraArr[2].text != ""){
                $("#bread_active").css("display",'inline');
                $("#bread_active").text(paraArr[2].text);
            }else{
                $("#bread_active").css("display",'none');
            }
        }
        setBreadContent([{text:'',href:''},
                        {text:'',href:''},
                        {text:'个人概览',href:''}]);
        initForm();
        initStateData();
    }

    function _destroy()
    {
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList", "Echart", 'SingleSelect','Minput'],
        "utils": ["Request", "Base", 'Device']
    });
})(jQuery);