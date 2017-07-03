/* global $ */
//$(function(){
    var oAcList = [];
    function getUserName(callBack){
        $.ajax({
            url: "/v3/app/getUsername",
            type: "GET",
            dataType: "json",
            success: function(data){
                var userName = data["username"];
                callBack(userName);
            }
        });        
    }

    function getAcListV2(userName){
        $.ajax({
            url: MyConfig.v2path+"/getDevStatus",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({"tenant_name": userName, "dev_snlist":[]}),
            success: function(data){
                var acList = data.dev_statuslist;
                var acListArr = [];
                acList.forEach(function (ac){
                    acListArr.push(getAcInfo(ac));
                });
                
                updateHtml(acListArr);
                
            }
        });
    }
    

    
    
    function addEchars2(id){
            // 路径配置
            require.config({
                paths: {
                    echarts: 'build/dist'
                }
            });

            // 使用
            require(
                    [
                        'echarts',
                        'echarts/chart/bar' // 使用柱状图就加载bar模块，按需加载
                    ],
                    function (ec) {
                        // 基于准备好的dom，初始化echarts图表
                        var myChart = ec.init(document.getElementById(id));

                        var option = {
                            tooltip: {
                                show:false,
                                trigger: 'item'
                            },
                            toolbox: {
                                show: false,
                                feature: {
                                    dataView: {show: true, readOnly: false},
                                    restore: {show: true},
                                    saveAsImage: {show: true}
                                }
                            },
                            calculable: true,
                            grid: {
                                borderWidth: 0,
                                y: 10,
                                y2: 20
                            },
                            xAxis: [
                                {
                                    type: 'category',
                                    show: false,
                                    data: ['Line', 'Bar', 'Scatter', 'K', 'Pie', 'Radar', 'Chord', 'Force', 'Map', 'Gauge', 'Funnel']
                                }
                            ],
                            yAxis: [
                                {
                                    type: 'value',
                                    show: false
                                }
                            ],
                            series: [
                                {
                                    name: '',
                                    type: 'bar',
                                    itemStyle: {
                                        normal: {
                                            color: function(params) {
                                                // build a color map as your need.
                                                var colorList = [
                                                    '#77E8C4','#77E8C4','#77E8C4','#77E8C4','#77E8C4',
                                                    '#77E8C4','#77E8C4','#77E8C4','#77E8C4','#77E8C4',
                                                    '#77E8C4','#77E8C4','#77E8C4','#77E8C4','#77E8C4'
                                                ];
                                                return colorList[params.dataIndex]
                                            },
                                            label: {
                                                show: false,
                                                position: 'top',
                                                formatter: ''
                                            }
                                        }
                                    },
                                    data: [12,21,10,4,12,5,6,5,25,23,7],
                                    markPoint: {
                                        tooltip: {
                                            trigger: 'item',
                                            backgroundColor: 'rgba(0,0,0,0)',
                                            formatter: function(params){
                                                return '<img src="'
                                                        + params.data.symbol.replace('image://', '')
                                                        + '"/>';
                                            }
                                        },
                                        data: [
                                            {xAxis:0, y: 350, name:'Line', symbolSize:20,symbol: 'image://../asset/ico/折线图.png'},
                                            {xAxis:1, y: 350, name:'Bar', symbolSize:20, symbol: 'image://../asset/ico/柱状图.png'},
                                            {xAxis:2, y: 350, name:'Scatter', symbolSize:20, symbol: 'image://../asset/ico/散点图.png'},
                                            {xAxis:3, y: 350, name:'K', symbolSize:20, symbol: 'image://../asset/ico/K线图.png'},
                                            {xAxis:4, y: 350, name:'Pie', symbolSize:20, symbol: 'image://../asset/ico/饼状图.png'},
                                            {xAxis:5, y: 350, name:'Radar', symbolSize:20, symbol: 'image://../asset/ico/雷达图.png'},
                                            {xAxis:6, y: 350, name:'Chord', symbolSize:20, symbol: 'image://../asset/ico/和弦图.png'},
                                            {xAxis:7, y: 350, name:'Force', symbolSize:20, symbol: 'image://../asset/ico/力导向图.png'},
                                            {xAxis:8, y: 350, name:'Map', symbolSize:20, symbol: 'image://../asset/ico/地图.png'},
                                            {xAxis:9, y: 350, name:'Gauge', symbolSize:20, symbol: 'image://../asset/ico/仪表盘.png'},
                                            {xAxis:10, y: 350, name:'Funnel', symbolSize:20, symbol: 'image://../asset/ico/漏斗图.png'},
                                        ]
                                    }
                                }
                            ]
                        };


                // 为echarts对象加载数据
                myChart.setOption(option);
            }
    );
    }
        function addEchars1(id){
            require.config({
                paths: {
                    echarts: 'build/dist'
                }
            });

            // 使用
            require(
                    [
                        'echarts',
                        'echarts/chart/pie' // 使用柱状图就加载bar模块，按需加载
                    ],
                    function (ec) {
                        // 基于准备好的dom，初始化echarts图表
                        var myChart = ec.init(document.getElementById(id));

                        var labelTopOut = {
                            normal : {
                                color:"#77E8C4",
                                label : {
                                    show : true,
                                    position : 'center',
                                    textStyle: {
                                        baseline : 'bottom'
                                    }
                                },
                                labelLine : {
                                    show : false
                                }
                            }
                        };
                        var labelFromatter = {
                            normal : {
                                label : {
                                    formatter : function (params){
                                        return 100 - params.value + '分'
                                    },
                                    textStyle: {
                                        baseline : 'top'
                                    }
                                }
                            },
                        }
                        var labelBottomOut = {
                            normal : {
                                color: 'white',
                                label : {
                                    show : true,
                                    position : 'center'
                                },
                                labelLine : {
                                    show : false
                                }
                            },
                            emphasis: {
                                color: 'white'
                            }
                        };
                        var labelBottomInt = {
                            normal : {
                                color: 'black',
                                label : {
                                    show : true,
                                    position : 'center'
                                },
                                labelLine : {
                                    show : false
                                }
                            },
                            emphasis: {
                                color: 'black'
                            }
                        };

                        var option = {
                            tooltip : {
                                trigger: 'item',
                                formatter: " "
                            },
                            legend: {
                                orient : 'vertical',
                                x : 'left',
                                data:[]
                            },
                            toolbox: {
                                show : false,
                                feature : {
                                    mark : {show: true},
                                    dataView : {show: true, readOnly: false},
                                    magicType : {
                                        show: true,
                                        type: ['pie', 'funnel']
                                    },
                                    restore : {show: true},
                                    saveAsImage : {show: true}
                                }
                            },
                            calculable : false,
                            series : [
                                {
                                    type : 'pie',
                                    radius : [0,50],
                                    // for funnel
                                    x: '20%',
                                    width: '40%',
                                    funnelAlign: 'right',
                                    max: 1548,
                                    itemStyle : labelFromatter,
                                    data : [
                                        { value:46, itemStyle : labelBottomInt}
                                    ]
                                },
                                {
                                    type:'pie',
                                    radius : [50,65],
                                    // for funnel
                                    x: '60%',
                                    width: '35%',
                                    funnelAlign: 'left',
                                    max: 1048,
                                    itemStyle : {
                                        normal : {
                                            label : {
                                                position : 'out'
                                            },
                                            labelLine : {
                                                show : false
                                            }
                                        }
                                    },
                                    data:[
                                        {value:335,itemStyle : labelTopOut},
                                        {value:310,itemStyle : labelBottomOut}
                                    ]
                                }
                            ]
                        };

                        // 为echarts对象加载数据
                        myChart.setOption(option);
                    }
            );
        }
        
            var sTemplateItem = '<div class="col-xs-6 app-colum "><div class="app-box no-bk-color"><div class="home-box-footer"><span class="title">%s</span><div class="text-right link-container"><a type="button" class="link-send active" title="View Details"href="index.html?sn=%a"><span>管理</span></a></div></div><div class="box-body"><div id="[pie]" class="home-left-pie"></div><div class="panel"><div id=[bar] class="home-left-bar"></div><div class="home-right-nobar"><table class="home-left-table"><tbody><tr><th rowspan="2"></th><th  style="width: 75px"><label>在线终端</label></th></tr> <tr><th style="margin-right: 5px">[clientnum]</th></tr></tbody></table></div></div><div class="panel"><table class="home-left-table-bottom"><tbody><tr><th><label>上行速度</label></th><th><label>下载速度</label></th><th><label>在线AP</label></th><th><label>离线AP</label></th></tr><tr><th>[speedup]</th><th>[speeddown]</th><th>[online]</th><th><label>[offline]</label></th></tr></tbody></table></div></div></div></div>'
    
    function updateHtml(aclist){
        var a = [];
        $.map(aclist, function(v, i){
            var acSN = v["dev_sn"] ;
			var speedup = v["speed_up"];
			var speeddown = v["speed_down"];
			var online = v["online"];
			var offline = v["offline"];
			var clientnum = v["clientnum"];
            
            !(i%2)&&a.push('<div class="home-page-row">');
                a.push(sTemplateItem.replace(/%s/g, acSN + (v.dev_status == 1?"(在线)":"(不在线)")).
                    replace(/%a/g, acSN).
                    replace(/\[pie\]/g, acSN+"pie").
                    replace(/\[bar\]/g, acSN+"bar").
                    replace(/\[speedup\]/g, (speedup+ "kbps")).
                    replace(/\[speeddown\]/g, (speeddown + "kbps")).
                    replace(/\[online\]/g, online).
                    replace(/\[offline\]/g, offline).
                    replace(/\[clientnum\]/g, clientnum)
                    );
                (i%2)&&a.push('</div>');
        });
        $('#layout_center').html(a.length?a.join(''):'data error.');
        oAcList = aclist;
        aclist.forEach(function(id){
            addEchars1(id.dev_sn+"pie");
            addEchars2((id.dev_sn+"bar"));
        });
    }
    
    function getAcInfo(acInfo){
        var acSN = acInfo.devSN;
        $.ajax({
            url: "/v3/devmonitor/web/wanspeed?devSN=" + acSN,
            type: "GET",
            dataType: "json",
            async: false,
            success: function(data){
                var speed_down = 0;
                var speed_up = 0;
                data["wan_speed"].forEach(function(wan){
                    speed_down += wan["speed_down"];
                    speed_up += wan["speed_up"];
                })
                acInfo.speed_down = speed_down;
                acInfo.speed_up = speed_up;
            }
        });
                           
        $.ajax({
            url: "/v3/apmonitor/web/apstatistic?devSN=" + acSN,
            type: "GET",
            dataType: "json",
            async: false,
            success: function(data){
                var ap_statistic = data.ap_statistic;
                acInfo.online = ap_statistic.online;
                acInfo.offline = ap_statistic.offline;
            }
        });
        
        $.ajax({
            url: "/v3/stamonitor/web/clientcount?devSN=" + acSN,
            type: "GET",
            dataType: "json",
            async: false,
            success: function(data){
                acInfo.clientnum = data.clientnum;
            }
        });
        return acInfo;
    }
    

    //getUserName(getAcListV2);
    
//});