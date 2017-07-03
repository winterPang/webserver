;(function ($) {

    var MODULE_NAME = "a_dataanalysis.positionanalysis";
    var flowData = [];
    var g_value ="";
    //var g_map = null;
    //var g_container = null;
    var BMapExt = null;
    var g_city = null;
    var siteData = null;

    function addLiToCrumbs(param)
    {
        //子元素继承父元素的css样式，所以要用ul的id，不能用div的id
        var v_ul = document.getElementById("crumbs_ul");
        //console.log(v_ul);
        //console.log(v_ul.childNodes.length);
        var v_li = document.createElement("li"); //生成li
        v_li.innerHTML="<a href='#2'>" + param + "</a>"; //添加li中要显示的内容
        v_ul.appendChild(v_li);
        //alert(document.getElementById("crumbs_ul").getElementsByTagName("li").length);
    }
    function removeSecondLi()
    {
        var ul = document.querySelector("#crumbs_ul");
        var lis = ul.querySelectorAll("li");
        if(lis.length == 2) {
            lis[1].remove();
        }
    }

    siteData = [
        {name:"肯德基",geoCoord:[119.5313, 29.8773]},
        {name:"西湖银泰",geoCoord:[120.2313, 29.9773]},
        {name:"百草园",geoCoord:[120.5489,29.8796]},
        {name:"火腿超市",geoCoord:[120.2156,29.2112]}
    ];

    function setChinaMap()
    {
        var dom = document.getElementById("container");
        var myEcharts = echarts.init(dom);

        var mapType = [
            'china',
            // 23个省
            '广东', '青海', '四川', '海南', '陕西',
            '甘肃', '云南', '湖南', '湖北', '黑龙江',
            '贵州', '山东', '江西', '河南', '河北',
            '山西', '安徽', '福建', '浙江', '江苏',
            '吉林', '辽宁', '台湾',
            // 5个自治区
            '新疆', '广西', '宁夏', '内蒙古', '西藏',
            // 4个直辖市
            '北京', '天津', '上海', '重庆',
            // 2个特别行政区
            '香港', '澳门'
        ];

        var option = {
            title: {
                text : '场所分布',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                //enterable: true,
                formatter: mouseOnChinaMap
            },
            itemStyle : {
                normal:{
                    label:{show:true},
                    areaStyle:{color:'blue'}
                }
            },
            /*dataRange: {
                x: 'left',
                y: 'bottom',
                splitList: [
                    //{start: 11000},
                    {start: 6000, end: 11000},
                    {start: 3000, end: 6000},
                    {start: 1000, end: 3000},
                    {start:20,end:30,color:'red'},
                    {start: 10, end: 20, color:'yellow'},
                    {start: 0, end: 10, color: 'lightgreen'}
                    //{end: 0}
                ],
                color: ['#6495ed', '#00bfff', '#87cefa']
            },*/
            dataRange: {
                min: 0,
                max: 11000,
                text:['高','低'],
                realtime: false,
                calculable : true,
                color: ['#6495ed','#00bfff','#87cefa']
            },
            animation :false,
            series : [
                {
                    type: 'map',
                    mapType: 'china',
                    hoverable:false,
                    //roam:true,
                    //selectedMode : 'single',
                    itemStyle : {
                        normal:{
                            label:{show:true},
                            borderColor: 'rgba(255,255,255,1)',
                            borderWidth: 1,
                            areaStyle:{color: 'rgba(230,230,230,1)'}      //{color: 'rgba(245,245,245,1)'}
                        }
                    },
                    data:[
                        {name: '北京',value: 8400,site:5},
                        {name: '上海',value: 9600,site:3},
                        {name: '浙江',value: 10300,site:7},
                        {name: '湖南',value: 5300,site:4},
                        {name: '四川',value: 4700,site:3},
                        {name: '安徽',value: 2300,site:4},
                        {name: '河北',value: 1200,site:5},
                        {name: '杭州市',value:2000,site:5},
                        {name: '金华市', value:5000,site:1},
                        {name: '绍兴市', value:1000,site:1},
                        {name: '邵阳市', value:1000,site:1},
                        {name: '长沙市', value:1000,site:1},
                        {name: '保定市', value:1000,site:1},
                        {name: '唐山市', value:1000,site:1},
                        {name: '大兴区', value:1000,site:1},
                        {name: '朝阳区', value:1000,site:1},
                        {name: '成都市', value:1000,site:1},
                        {name: '合肥市', value:1000,site:1}
                    ],
                    markPoint : {
                        symbol:'pin',
                        symbolSize : 6,
                        silent:true,
                        itemStyle:{
                            normal:{
                                color:'lightgreen',
                                label:{show:false}
                            }
                        },
                        //color:'red',
                        data :[]
                    }
                }
            ]
        };

        myEcharts.on('click', function (param){   //'mapSelected'  ecConfig.EVENT.MAP_SELECTED
            var geoData = [
                {"name": "杭州市", "geoCoord": [119.5313, 29.8773], "value":10},
                {"name": "绍兴市", "geoCoord": [120.5512, 29.9115], "value": 6},
                {geoCoord: [119.8527, 29.0812]}
            ];
            var mt = param.name;
            if (-1 != mapType.indexOf(mt))
            {
                //点击省/市，进入市区
                option.tooltip.formatter = mouseOnProvinceMap;
                option.series[0].mapType = mt;
                option.series[0].markPoint.data = siteData;
                myEcharts.setOption(option, true);
                addLiToCrumbs(mt);
                $("#province_info").css("display", "none");
                $("#city_info").css("display", "inline");
                $("#city_info").css("z-index", "10");
            }
            else{
                //点击市/区进入到百度地图
                var jScope = {scope: $("#tableDlg3"), className: 'modal-super'};
                Utils.Base.openDlg(null, {}, jScope );
                g_city = mt;
            }

        });

        myEcharts.setOption(option);
    }

    function getBMap()
    {
        require(
            [
                'echarts',
                'echarts/chart/bmap'
            ], function (echarts, BMapExtension) {
                if (g_value=="")
                {
                    BMapExt = new BMapExtension($('#map')[0], BMap, echarts);
                }

                drawSelectMap();
            }
        );

    }
    function drawSelectMap()
    {
        var g_map = BMapExt.getMap();
        var g_container = BMapExt.getEchartsContainer();
        g_map.centerAndZoom(g_city, 12);
        g_map.enableScrollWheelZoom();

        // 地图自定义样式
        g_map.setMapStyle({
            styleJson:
                [
                    {
                        "featureType": "road",
                        "elementType": "all",
                        "stylers": {
                            "lightness": 20
                        }
                    },
                    {
                        "featureType": "highway",
                        "elementType": "geometry",
                        "stylers": {
                            "color": "#f49935"
                        }
                    },
                    {
                        "featureType": "railway",
                        "elementType": "all",
                        "stylers": {
                            "visibility": "off"
                        }
                    },
                    {
                        "featureType": "local",
                        "elementType": "labels",
                        "stylers": {
                            "visibility": "off"
                        }
                    },
                    {
                        "featureType": "water",
                        "elementType": "all",
                        "stylers": {
                            "color": "#d1e5ff"
                        }
                    },
                    {
                        "featureType": "poi",
                        "elementType": "labels",
                        "stylers": {
                            "visibility": "off"
                        }
                    }
                ]
        });
        var mapOption = {
            color: ['#561234'],   //#561234   lime
            title : {
                text: '场所流动',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: function (v) {
                    return v[1].replace(':', ' > ');
                }
            },
            series : [
                {
                    type:'map',
                    mapType: 'none',
                    data:[],
                    geoCoord: {
                        '百货大楼': [120.207327,30.190821],
                        '肯德基': [120.183324, 30.19825],
                        '浙大校区': [120.127485,30.267833],
                        '闸弄口':[120.197122, 30.283677]
                    },
                    /* markLine : {
                     smooth:true,
                     effect : {
                     show: true,
                     scaleSize: 1,
                     period: 10,
                     color: '#fff',
                     shadowBlur: 10
                     },
                     itemStyle : {
                     normal: {
                     borderWidth:1,
                     lineStyle: {
                     type: 'solid',
                     shadowBlur: 10
                     }
                     }
                     },
                     data : [
                     [{name:'北京'}, {name:'上海',value:95}],
                     [{name:'北京'}, {name:'广州',value:90}],
                     [{name:'北京'}, {name:'大连',value:80}],
                     [{name:'北京'}, {name:'南宁',value:70}],
                     [{name:'北京'}, {name:'南昌',value:60}],
                     [{name:'北京'}, {name:'拉萨',value:50}],
                     [{name:'北京'}, {name:'长春',value:40}],
                     [{name:'北京'}, {name:'包头',value:30}],
                     [{name:'北京'}, {name:'重庆',value:20}],
                     [{name:'北京'}, {name:'常州',value:10}]
                     ]
                     },*/
                    markPoint : {
                        symbol:'emptyCircle',
                        symbolSize : function (v){
                            return 3 + v/100
                        },
                        effect : {
                            show: true,
                            shadowBlur : 0
                        },
                        itemStyle:{
                            normal:{
                                label:{show:true}
                            }
                        },
                        data : [
                            {name:'百货大楼',value:950},
                            {name:'肯德基',value:900},
                            {name:'浙大校区',value:1000},
                            {name:'闸弄口',value:900}
                        ]
                    },
                    markLine: {
                        smooth:true,
                        effect : {
                            show: true,
                            scaleSize: 1,
                            period: 30,
                            color: '#fff',
                            shadowBlur: 10
                        },
                        itemStyle : {
                            normal: {
                                borderWidth:1,
                                lineStyle: {
                                    type: 'solid',
                                    shadowBlur: 10
                                }
                            }
                        },
                        data : [
                            [{name:'百货大楼'}, {name:'肯德基',value:95}],
                            [{name:'百货大楼'}, {name:'浙大校区',value:90}],
                            [{name:'百货大楼'}, {name:'闸弄口',value:80}]
                        ]
                    }

                }

            ]
        };

        myChart = BMapExt.initECharts(g_container);
        window.onresize = myChart.resize;
        BMapExt.setOption(mapOption);
    }

    //在全国地图的模式下，鼠标悬浮事件
    function mouseOnChinaMap(obj)
    {
        var res = null;

        res = obj[1];
        //console.log(JSON.stringify(obj));
        if (obj[2] != "-")
        {
            res =  '点击查看该省' + '<br>' + '省/市：'+obj[1] + '<br>' + '场所总数：' + obj.data.site + '<br>' + '总客流量：' + obj.data.value;
            return res;
        }

        return res;
    }
    //在各省地图的模式下，鼠标悬浮事件
    function mouseOnProvinceMap(obj)
    {
        var res = null;
        //console.log(JSON.stringify(obj));
        res = obj[1];
        if (obj[2] != "-")
        {
            res = '点击查看场所' + '<br>' + '市/区：'+ obj[1] +'<br>' + '场所数：' + obj.data.site +'<br>' + '客流量：' + obj.data.value;
            return res;
        }
        return res;
    }

    function drawRankBar()
    {
        var dom = document.getElementById("rank");
        var rankEcharts = echarts.init(dom);

        var rankOption = {
            tooltip : {
                trigger: 'axis'
            },
            color:['#4ec1b2'],
            grid:{
                x:"10%",
                y:"10%",
                width:310,
                y2:"15%"
            },
            xAxis : [
                {
                    type : 'value',
                    boundaryGap : [0, 0.01]
                }
            ],
            yAxis : [
                {
                    type : 'category',
                    data : ['浙江','上海','北京','湖南','四川']
                }
            ],
            series : [
                {
                    type:'bar',
                    data:[10300, 9600, 8400, 5300, 4700],
                    itemStyle: {

                        normal: {
                            barBorderRadius: 10
                        },
                        emphasis: {
                            barBorderRadius: 10
                        }
                    }
                }
            ]
        };

        rankEcharts.setOption(rankOption);
    }

    /*function drawStayTime()
    {
        var dom = document.getElementById("stay_time");
        var stayEcharts = echarts.init(dom);

        var stayOption ={
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            color:['#FF82AB', '#436EEE', '#AB82FF'],
            legend: {
                orient: 'horizontal',
                x: 'center',
                y:'bottom',
                data:['小于10分钟','20~30分钟','大于30分钟']
            },
            calculable: false,
            series: [
                {
                    name:'平均驻留时长',
                    type:'pie',
                    radius: ['50%', '70%'],
                    //center: ['50%', '30%'],
                    avoidLabelOverlap: false,
                    itemStyle:
                    {
                        normal:{
                            labelLine: {
                                show: false
                            },
                            label:{
                                show:false
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
                    data:[
                        {value:335,name:'小于10分钟'},
                        {value:310,name:'20~30分钟'},
                        {value:234,name:'大于30分钟'}
                    ]
                }
            ]
        };

        stayEcharts.setOption(stayOption);
    }*/

    function drawAreaCounts(){

        var dom = document.getElementById("areacount");
        var areaEcharts = echarts.init(dom);

        option = {
            tooltip : {
                trigger: 'axis'
            },
            grid:{
                x:"10%",
                y:"10%",
                width:310,
                y2:"15%"
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    name : '场所',
                    data : ['湖南','安徽','四川','北京','浙江']
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    name : '数量'
                }
            ],
            series : [
                {
                    name:'场所数量',
                    type:'bar',
                    data:[2, 2, 3, 4, 5],
                    itemStyle: {

                        normal: {
                            barBorderRadius: 10
                        },
                        emphasis: {
                            barBorderRadius: 10
                        }
                    }
                }
            ]
        };
        areaEcharts.setOption(option);

    }
    function initClickEvent()
    {
        $("#back_button").on('click', clickButton);

        $("#crumbs_ul").on("click", "li", function(){
            var index = $(this).index();
            var info = $(this).html();
            if (0 == index)
            {
                setChinaMap();
                removeSecondLi();
                $("#province_info").css("display", "inline");
                $("#city_info").css("display", "none");
                $("#city_info").css("z-index", "1");
            }
        });

        $("#tableDlg3").on('shown',function(){
            getBMap();
        });
        $("#tableDlg3").on('hide',function(){
            $("#map").empty();
        });
    }
    function clickButton()
    {
        console.log("into the func clickButton().");
        $("#back_button").css("display", "none");
        $('#container').empty();
        setChinaMap();
    }
    function _init ()
    {
        setChinaMap();
        initClickEvent();
        drawRankBar();
        drawAreaCounts();
        //drawStayTime();
    }
    function _destroy ()
    {

    }
    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        //"resize": _resize,
        "widgets": ["Minput",'Echart',"SList","Form","SingleSelect"],
        "utils":["Request","Base"]
    });
})( jQuery );

