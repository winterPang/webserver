/* global $ */
$(function(){
    var sTemplateAc = [
        '<div class="col-xs-6 app-colum [sn]" sn="[sn]">',
            '<div class="app-box no-bk-color">',
                '<div class="home-box-footer">',
                    '<span class="title [name1]">[sn] ([status])</span>',
                    '<div class="text-right link-container">',
                        '<a type="button" class="link-send active" title="View Details"href="index.html?sn=[sn]">',
                            '<span class="nav_manage">管理</span>',
                        '</a>',
                    '</div>',
                '</div>',
                '<div class="box-body">',
                    '<div id="[sn]pie" class="home-left-pie"></div>',
                    '<div class="panel">',
                        '<div id=[sn]bar class="home-left-bar"></div>',
                        '<div class="home-right-nobar">',
                            '<span class="online_terminal">在线终端</span>',
                            '<span class="clientnum">loading</span>',
                        '</div>',
                    '</div>',
                    '<div class="panel_bottom">',
                        '<div class="speed">',
                            '<span class="up_speed">上行速率</span>',
                            '<span class="speedup">loading</span>',
                            '<span class="speedunit">Mbps</span>',
                        '</div>',
                        '<div class="speed">',
                            '<span class="up_speed">下载速率</span>',
                            '<span class="speeddown">loading</span>',
                            '<span class="speedunit">Mbps</span>',
                        '</div>',
                        '<div class="oline">',
                            '<span class="up_speed">在线AP</span>',
                            '<span class="online">loading</span>',
                        '</div>',
                        '<div class="oline" style="border:none">',
                            '<span class="up_speed">离线AP</span>',
                            '<span class="offline">loading</span>',
                        '</div>',
                    '</div>',
                '</div>',
            '</div>',
        '</div>'
    ].join('');

    $.ajaxSetup({type: "GET", dataType: "json", timeout:3000})

    var cos = {
        username : '',
        getUserName : function(){
            $.get("/v3/web/cas_session", function(data){
                cos.username = data.user;
                $("#username").text(cos.username);
                function onLogout()
            {
                window.location ="/v3/logout";
                return false;
            }

           /* function onPassWord()
            {
                Utils.Base.openDlg("wsmbfile.changepassword", {}, {className:"modal-large"});
                return false;
            }

            function onService()
            {
                Utils.Base.openDlg("chat.chatpage", {}, {className:"modal-super-large"});
                //Utils.Base.openDlg(null, {}, {scope:$("#chatform"),className:"modal-super dashboard"});
                return false;
            }*/

            function onItemClick(e)
            {
                var sIndex = $(this).attr("index");
                var pfMap = [onLogout/*,onPassWord,onService*/];
                pfMap[sIndex]();
            }

            function toggleUserMenu(e)
            {
                function show()
                {
                    jMenu.slideDown(200);
                    $('body').on('click.usermenu',hide);
                }
                function hide()
                {
                    jMenu.slideUp(200);
                    jMenu.prev().removeClass("active");
                    $('body').off('click.usermenu');
                }

                var jMenu = $(this).next('ul');
                $(this).toggleClass('active');
                jMenu.is(':visible') ? hide() : show();

                e.stopPropagation();
            }

            function initUser()
            {
                $("#user_menu").unbind('click').bind('click',toggleUserMenu);
                $("#drop_list").off('click').on('click','li',onItemClick);
            }
            initUser();
            cos.getAcList();
            });
        },
        getAcList : function(){
            $.ajax({
                url: MyConfig.v2path+"/getDevStatus",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({"tenant_name": cos.username, "dev_snlist":[]}),
                success: function(data){
                    var a = data.dev_statuslist, n = a.length - 1;
                    $('#aclist').html($.map(a, function(v, i){
                        var name = v.dev_name,
                            sn = v.dev_sn,
                            status = v.dev_status == 1?"在线":"离线",
                            s = sTemplateAc
                                    .replace(/\[name\]/g, name)
                                    .replace(/\[sn\]/g, sn)
                                    .replace(/\[status\]/g, status),
                            sHtml = [
                                        !(i%2)?'<div class="home-page-row">':'', s,  
                                        ((i%2)||(i == n))?'</div>':''
                                    ].join('');

                        $("#station").append('<option value="[sn]">场所[i]</option>'.replace(/\[sn\]/g, sn).replace(/\[i\]/g, i+1));
                        $.ajax({
                            url: "/v3/health/home/health?acSN=" + sn,
                            type: "get",
                            contentType: "application/json",
                            dataType: "json",
                            success: function(data){
                                addEchars1(sn+"pie",JSON.parse(data).finalscore);
                            }
                        })
                        addEchars2((sn+"bar"));
                        cos.getAcInfo(sn);
                        return sHtml;
                    }).join(''));

                    setTimeout(function(){
                        $("#station").bind("change",function(){
                            var sn= $("#station option:selected").attr("value");
                            window.location="/v3/web/frame/index.html?sn=" + sn;
                        });
                    }, 0);
                }
            });
        },
        getAcInfo : function(sn){
            $.ajax({
                url: "/v3/devmonitor/web/wanspeed?devSN=" + sn,
                success: function(data){
                    var speed_down = 0;
                    var speed_up = 0;
                    data["wan_speed"].forEach(function(wan){
                        speed_down += wan["speed_down"];
                        speed_up += wan["speed_up"];
                    });

                    $("." + sn + " .speeddown").html(speed_down);
                    $("." + sn + " .speedup").html(speed_up);
                },
                error: function(xhr,status,statusText){
                    $("." + sn + " .speeddown").html(statusText);
                    $("." + sn + " .speedup").html(statusText);
                }
            });

            $.ajax({
                url: "/v3/apmonitor/web/apstatistic?devSN=" + sn,
                success: function(data){
                    var ap_statistic = data.ap_statistic;
                    $("." + sn + " .online").html(ap_statistic.online);
                    $("." + sn + " .offline").html(ap_statistic.offline);
                },
                error: function(xhr,status,statusText){
                    $("." + sn + " .online").html(statusText);
                    $("." + sn + " .offline").html(statusText);
                }
            });
            $.ajax({
                url: "/v3/stamonitor/web/clientcount?devSN=" + sn,
                success: function(data){
                    $("." + sn + " .clientnum").html(data.clientnum);
                },
                error: function(xhr,status,statusText){
                    $("." + sn + " .clientnum").html(statusText);
                }
            });
        },
        getClientCount:function(sn){
            
        }
    };
    cos.getUserName();
    return;

    var oAcList = [];


    
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
                                show:true,
                                trigger: 'item',
                                axisPoniter:{
                                    type:'shadow'
                                },
                                formatter:function(params){
                                    return params.value;
                                }

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
                                    name: '在线终端',
                                    type: 'bar',
                                    barGap:'10%',
                                    barCategoryGap:'20%',
                                    stack:'sum',
                                    itemStyle: {
                                        normal: {
                                            color: function(params) {
                                                // build a color map as your need.
                                                var colorList = [
                                                    '#4ec1b2','#4ec1b2','#4ec1b2','#4ec1b2','#4ec1b2',
                                                    '#4ec1b2','#4ec1b2','#4ec1b2','#4ec1b2','#4ec1b2',
                                                    '#4ec1b2','#4ec1b2','#4ec1b2','#4ec1b2','#4ec1b2'
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
                                },
                                {
                                    name: '',
                                    type: 'bar',
                                    stack:'sum',
                                    itemStyle: {
                                        normal: {
                                            color: function(params) {
                                                // build a color map as your need.
                                                var colorList = [
                                                    '#e7e7e9','#e7e7e9','#e7e7e9','#e7e7e9','#e7e7e9',
                                                    '#e7e7e9','#e7e7e9','#e7e7e9','#e7e7e9','#e7e7e9',
                                                    '#e7e7e9','#e7e7e9','#e7e7e9','#e7e7e9','#e7e7e9'
                                                ];
                                                return colorList[params.dataIndex]
                                            },
                                            label: {
                                                show: false,
                                                position: 'insidetop',
                                                formatter: ''
                                            }
                                        }
                                    },
                                    data: [23,23,23,23,23,23,23,23,23,23,23],
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
    
function addEchars1(id, score){
<<<<<<< HEAD
            require.config({
                paths: {
                    echarts: 'build/dist'
                }
            });
            // 使用
            require([
                        'echarts',
                        'echarts/chart/pie' // 使用柱状图就加载bar模块，按需加载
                    ],
                    function (ec) {
                        // 基于准备好的dom，初始化echarts图表
                        var myChart = ec.init(document.getElementById(id));

                        var labelTopOut = {
                            normal : {
                                color:"#fe808b",
                                label : {
                                    show : false,
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
                                        return params.value;
                                    },
                                    textStyle: {
                                        align:'center',
                                        // baseline : 'top',
                                        fontSize:'30',
                                        color:'#ffffff'
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
                                color: '#343e4e',
                                label : {
                                    show : true,
                                    position : 'center'
                                },
                                labelLine : {
                                    show : false
                                }
                            },
                            emphasis: {
                                label:{
                                    show:true,
                                    formatter:function(params){
                                        return params.value;
                                    },
                                    textStyle: {
                                        align:'center',
                                        // baseline : 'top',
                                        fontSize:'30',
                                        color:'#ffffff'
                                    }
                                }
                            }
                        };

                        var option = {
                            // tooltip : {
                            //     trigger: 'item',
                            //     show:'false'
                                
                            // },
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
                                        { value: score||1000, itemStyle : labelBottomInt}
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
=======
    score = score||0;
    var myChart = echarts.init(document.getElementById(id));
		var centerPieStyle = {
			normal : {
				color: '#353e4f',
				label : {show : true,position : 'center'},
				labelLine : {show : false}
			},
		};
		var otherStyle = {
			normal: {
				color: "white",
				labelLine: {show: false,}
			}
		}
		var scoreStyle = {
			normal: {
				color: (score>=85?"#4ec1b2":(score>=66?"#fbceb1":"#fe808b")),//"#fe808b",
				labelLine: {show: false,}
			}
		}
		var option = {
			series : [
				{
					type: "pie",
					radius: [0, 50],
					max: 100,
					itemStyle: {
						normal: {
							label: {
								formatter: function(params){
									console.log(params);
									return params.data.score+"分";
								},
								textStyle: {
									baseline: "middle",
									fontSize: "30",
									color: "#fff",
								}
							}
						}
					},
					data: [
						{value: 100, score:score, itemStyle:centerPieStyle}
					]
				},
				{
					type: "pie",
					radius: [50, 65],
					max: 100,
					clockWise: false,
					data: [
						{value: 100-score, itemStyle: otherStyle},
						{value: score, itemStyle: scoreStyle}
					]
				}
			]
		}
		myChart.setOption(option);
    }
>>>>>>> 5e2ae5061c39f8fe66e16f79c5a29318803a7f0f


    
    function updateHtml(aclist){
        var a = [];
        $.map(aclist, function(v, i){
            var acSN = v["dev_sn"];
			var speedup = v["speed_up"]||0;
			var speeddown = v["speed_down"]||0;
			var online = v["online"]||0;
			var offline = v["offline"]||0;
			var clientnum = v["clientnum"]||0;
            
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
            //addEchars1(id.dev_sn+"pie");
            //addEchars2((id.dev_sn+"bar"));
        });
    }
    
    function getAcInfo(acInfo){
        var acSN = acInfo.dev_sn;
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
        /*                   
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
        */
        
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
    getUserName(getAcListV2);
})
    

    
    
//});