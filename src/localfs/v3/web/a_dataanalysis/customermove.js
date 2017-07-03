;(function ($) {
    var MODULE_BASE = "a_dataanalysis";
    var MODULE_NAME = MODULE_BASE + ".customermove";
    var map = null;
    var index;

    var myEchart_1 = null;
    var myEchart_2 = null;
    var myEchart_3 = null;
    var myEchart_4 = null;

    function initData(){
    }

    var  provincesMap = {
        "北京":"1",
        "天津":"2",
        "上海":"3",
        "重庆":"4",
        "河北":"5",
        "山西":"6",
        "陕西":"7",
        "山东":"8",
        "河南":"9",
        "辽宁":"10",
        "吉林":"11",
        "黑龙江":"12",
        "江苏":"13",
        "浙江":"5554645",
        "安徽":"14",
        "江西":"15",
        "福建":"16",
        "湖北":"17",
        "湖南":"18",
        "四川":"19",
        "贵州":"20",
        "云南":"21",
        "广东":"22",
        "海南":"23",
        "甘肃":"24",
        "青海":"25",
        "台湾":"26",
        "内蒙古":"27",
        "新疆":"28",
        "西藏":"29",
        "广西":"30",
        "宁夏":"31",
        "香港":"32",
        "澳门":"33"
    };

    var cityMap = {
        "北京市": "110100",
        "天津市": "120100",
        "上海市": "310100",
        "重庆市": "500100",
        "崇明县": "310200",
        "湖北省直辖县市": "429000",
        "铜仁市": "522200",
        "毕节市": "522400",
        "石家庄市": "130100",
        "唐山市": "130200",
        "秦皇岛市": "130300",
        "邯郸市": "130400",
        "邢台市": "130500",
        "保定市": "130600",
        "张家口市": "130700",
        "承德市": "130800",
        "沧州市": "130900",
        "廊坊市": "131000",
        "衡水市": "131100",
        "太原市": "140100",
        "大同市": "140200",
        "阳泉市": "140300",
        "长治市": "140400",
        "晋城市": "140500",
        "朔州市": "140600",
        "晋中市": "140700",
        "运城市": "140800",
        "忻州市": "140900",
        "临汾市": "141000",
        "吕梁市": "141100",
        "呼和浩特市": "150100",
        "包头市": "150200",
        "乌海市": "150300",
        "赤峰市": "150400",
        "通辽市": "150500",
        "鄂尔多斯市": "150600",
        "呼伦贝尔市": "150700",
        "巴彦淖尔市": "150800",
        "乌兰察布市": "150900",
        "兴安盟": "152200",
        "锡林郭勒盟": "152500",
        "阿拉善盟": "152900",
        "沈阳市": "210100",
        "大连市": "210200",
        "鞍山市": "210300",
        "抚顺市": "210400",
        "本溪市": "210500",
        "丹东市": "210600",
        "锦州市": "210700",
        "营口市": "210800",
        "阜新市": "210900",
        "辽阳市": "211000",
        "盘锦市": "211100",
        "铁岭市": "211200",
        "朝阳市": "211300",
        "葫芦岛市": "211400",
        "长春市": "220100",
        "吉林市": "220200",
        "四平市": "220300",
        "辽源市": "220400",
        "通化市": "220500",
        "白山市": "220600",
        "松原市": "220700",
        "白城市": "220800",
        "延边朝鲜族自治州": "222400",
        "哈尔滨市": "230100",
        "齐齐哈尔市": "230200",
        "鸡西市": "230300",
        "鹤岗市": "230400",
        "双鸭山市": "230500",
        "大庆市": "230600",
        "伊春市": "230700",
        "佳木斯市": "230800",
        "七台河市": "230900",
        "牡丹江市": "231000",
        "黑河市": "231100",
        "绥化市": "231200",
        "大兴安岭地区": "232700",
        "南京市": "320100",
        "无锡市": "320200",
        "徐州市": "320300",
        "常州市": "320400",
        "苏州市": "320500",
        "南通市": "320600",
        "连云港市": "320700",
        "淮安市": "320800",
        "盐城市": "320900",
        "扬州市": "321000",
        "镇江市": "321100",
        "泰州市": "321200",
        "宿迁市": "321300",
        "杭州市": "330100",
        "宁波市": "330200",
        "温州市": "330300",
        "嘉兴市": "330400",
        "湖州市": "330500",
        "绍兴市": "330600",
        "金华市": "330700",
        "衢州市": "330800",
        "舟山市": "330900",
        "台州市": "331000",
        "丽水市": "331100",
        "合肥市": "340100",
        "芜湖市": "340200",
        "蚌埠市": "340300",
        "淮南市": "340400",
        "马鞍山市": "340500",
        "淮北市": "340600",
        "铜陵市": "340700",
        "安庆市": "340800",
        "黄山市": "341000",
        "滁州市": "341100",
        "阜阳市": "341200",
        "宿州市": "341300",
        "六安市": "341500",
        "亳州市": "341600",
        "池州市": "341700",
        "宣城市": "341800",
        "福州市": "350100",
        "厦门市": "350200",
        "莆田市": "350300",
        "三明市": "350400",
        "泉州市": "350500",
        "漳州市": "350600",
        "南平市": "350700",
        "龙岩市": "350800",
        "宁德市": "350900",
        "南昌市": "360100",
        "景德镇市": "360200",
        "萍乡市": "360300",
        "九江市": "360400",
        "新余市": "360500",
        "鹰潭市": "360600",
        "赣州市": "360700",
        "吉安市": "360800",
        "宜春市": "360900",
        "抚州市": "361000",
        "上饶市": "361100",
        "济南市": "370100",
        "青岛市": "370200",
        "淄博市": "370300",
        "枣庄市": "370400",
        "东营市": "370500",
        "烟台市": "370600",
        "潍坊市": "370700",
        "济宁市": "370800",
        "泰安市": "370900",
        "威海市": "371000",
        "日照市": "371100",
        "莱芜市": "371200",
        "临沂市": "371300",
        "德州市": "371400",
        "聊城市": "371500",
        "滨州市": "371600",
        "菏泽市": "371700",
        "郑州市": "410100",
        "开封市": "410200",
        "洛阳市": "410300",
        "平顶山市": "410400",
        "安阳市": "410500",
        "鹤壁市": "410600",
        "新乡市": "410700",
        "焦作市": "410800",
        "濮阳市": "410900",
        "许昌市": "411000",
        "漯河市": "411100",
        "三门峡市": "411200",
        "南阳市": "411300",
        "商丘市": "411400",
        "信阳市": "411500",
        "周口市": "411600",
        "驻马店市": "411700",
        "省直辖县级行政区划": "469000",
        "武汉市": "420100",
        "黄石市": "420200",
        "十堰市": "420300",
        "宜昌市": "420500",
        "襄阳市": "420600",
        "鄂州市": "420700",
        "荆门市": "420800",
        "孝感市": "420900",
        "荆州市": "421000",
        "黄冈市": "421100",
        "咸宁市": "421200",
        "随州市": "421300",
        "恩施土家族苗族自治州": "422800",
        "长沙市": "430100",
        "株洲市": "430200",
        "湘潭市": "430300",
        "衡阳市": "430400",
        "邵阳市": "430500",
        "岳阳市": "430600",
        "常德市": "430700",
        "张家界市": "430800",
        "益阳市": "430900",
        "郴州市": "431000",
        "永州市": "431100",
        "怀化市": "431200",
        "娄底市": "431300",
        "湘西土家族苗族自治州": "433100",
        "广州市": "440100",
        "韶关市": "440200",
        "深圳市": "440300",
        "珠海市": "440400",
        "汕头市": "440500",
        "佛山市": "440600",
        "江门市": "440700",
        "湛江市": "440800",
        "茂名市": "440900",
        "肇庆市": "441200",
        "惠州市": "441300",
        "梅州市": "441400",
        "汕尾市": "441500",
        "河源市": "441600",
        "阳江市": "441700",
        "清远市": "441800",
        "东莞市": "441900",
        "中山市": "442000",
        "潮州市": "445100",
        "揭阳市": "445200",
        "云浮市": "445300",
        "南宁市": "450100",
        "柳州市": "450200",
        "桂林市": "450300",
        "梧州市": "450400",
        "北海市": "450500",
        "防城港市": "450600",
        "钦州市": "450700",
        "贵港市": "450800",
        "玉林市": "450900",
        "百色市": "451000",
        "贺州市": "451100",
        "河池市": "451200",
        "来宾市": "451300",
        "崇左市": "451400",
        "海口市": "460100",
        "三亚市": "460200",
        "三沙市": "460300",
        "成都市": "510100",
        "自贡市": "510300",
        "攀枝花市": "510400",
        "泸州市": "510500",
        "德阳市": "510600",
        "绵阳市": "510700",
        "广元市": "510800",
        "遂宁市": "510900",
        "内江市": "511000",
        "乐山市": "511100",
        "南充市": "511300",
        "眉山市": "511400",
        "宜宾市": "511500",
        "广安市": "511600",
        "达州市": "511700",
        "雅安市": "511800",
        "巴中市": "511900",
        "资阳市": "512000",
        "阿坝藏族羌族自治州": "513200",
        "甘孜藏族自治州": "513300",
        "凉山彝族自治州": "513400",
        "贵阳市": "520100",
        "六盘水市": "520200",
        "遵义市": "520300",
        "安顺市": "520400",
        "黔西南布依族苗族自治州": "522300",
        "黔东南苗族侗族自治州": "522600",
        "黔南布依族苗族自治州": "522700",
        "昆明市": "530100",
        "曲靖市": "530300",
        "玉溪市": "530400",
        "保山市": "530500",
        "昭通市": "530600",
        "丽江市": "530700",
        "普洱市": "530800",
        "临沧市": "530900",
        "楚雄彝族自治州": "532300",
        "红河哈尼族彝族自治州": "532500",
        "文山壮族苗族自治州": "532600",
        "西双版纳傣族自治州": "532800",
        "大理白族自治州": "532900",
        "德宏傣族景颇族自治州": "533100",
        "怒江傈僳族自治州": "533300",
        "迪庆藏族自治州": "533400",
        "拉萨市": "540100",
        "昌都地区": "542100",
        "山南地区": "542200",
        "日喀则地区": "542300",
        "那曲地区": "542400",
        "阿里地区": "542500",
        "林芝地区": "542600",
        "西安市": "610100",
        "铜川市": "610200",
        "宝鸡市": "610300",
        "咸阳市": "610400",
        "渭南市": "610500",
        "延安市": "610600",
        "汉中市": "610700",
        "榆林市": "610800",
        "安康市": "610900",
        "商洛市": "611000",
        "兰州市": "620100",
        "嘉峪关市": "620200",
        "金昌市": "620300",
        "白银市": "620400",
        "天水市": "620500",
        "武威市": "620600",
        "张掖市": "620700",
        "平凉市": "620800",
        "酒泉市": "620900",
        "庆阳市": "621000",
        "定西市": "621100",
        "陇南市": "621200",
        "临夏回族自治州": "622900",
        "甘南藏族自治州": "623000",
        "西宁市": "630100",
        "海东地区": "632100",
        "海北藏族自治州": "632200",
        "黄南藏族自治州": "632300",
        "海南藏族自治州": "632500",
        "果洛藏族自治州": "632600",
        "玉树藏族自治州": "632700",
        "海西蒙古族藏族自治州": "632800",
        "银川市": "640100",
        "石嘴山市": "640200",
        "吴忠市": "640300",
        "固原市": "640400",
        "中卫市": "640500",
        "乌鲁木齐市": "650100",
        "克拉玛依市": "650200",
        "吐鲁番地区": "652100",
        "哈密地区": "652200",
        "昌吉回族自治州": "652300",
        "博尔塔拉蒙古自治州": "652700",
        "巴音郭楞蒙古自治州": "652800",
        "阿克苏地区": "652900",
        "克孜勒苏柯尔克孜自治州": "653000",
        "喀什地区": "653100",
        "和田地区": "653200",
        "伊犁哈萨克自治州": "654000",
        "塔城地区": "654200",
        "阿勒泰地区": "654300",
        "自治区直辖县级行政区划": "659000",
        "台湾省": "710000",
        "香港特别行政区": "810100",
        "澳门特别行政区": "820000"
    };

    var pointdata = [
        [{name:'北京'}, {name:'上海',value:95}],
        [{name:'北京'}, {name:'广州',value:90}],
        [{name:'北京'}, {name:'大连',value:80}],
        [{name:'北京'}, {name:'成都',value:70}],
        [{name:'北京'}, {name:'长沙',value:30}]
    ];
    var pointdatatwo = [
        [{name:'杭州'}, {name:'宁波',value:95}],
        [{name:'杭州'}, {name:'温州',value:70}],
        [{name:'杭州'}, {name:'绍兴',value:14}],
        [{name:'杭州'}, {name:'湖州',value:30}],
        [{name:'杭州'}, {name:'嘉兴',value:20}]
    ];
    var pointdatathree = [
        [{name:'滨江'}, {name:'富阳',value:95}]
    ];

    function initechart(){
        var dom_1 = document.getElementById("container");
        myEchart_1 = echarts.init(dom_1);
        var dom_2 = document.getElementById("regetmap");
        myEchart_2 = echarts.init(dom_2);
        var dom_3 = document.getElementById("regetcity");
        myEchart_3 = echarts.init(dom_3);
        var dom_4 = document.getElementById("regetarea");
        myEchart_4 = echarts.init(dom_4);
    }


    function disList()
    {
        var data_area_out = ['北京-广州','北京-上海','北京-成都','北京-长沙','北京-大连'];
        var data_area_in = ['---','---','---','---','---'];
        var data_area_count = [300,380,256,290,340];
        var opt_head =
        {
            colNames: ['迁出', '人数', '迁入', '人数'],
            showHeader: true,
            multiSelect: false,
            pageSize: 12,
            colModel: [
                {name: "cs", datatype: "String"},
                {name: "zzlkl", datatype: "String"},
                {name: "pjzlsrc", datatype: "String"},
                {name: "xxx", datatype: "String"}
            ]
        };
        $("#list").SList("head", opt_head);

        var slist_data = [];
        for(var i = 0; i < data_area_out.length;i++){
            slist_data[i] = {};
            slist_data[i].cs = data_area_out[i];
            slist_data[i].zzlkl = data_area_count[i];
            slist_data[i].pjzlsrc = data_area_in[i];
            slist_data[i].xxx = '---';
        }
        $("#list").SList("refresh", slist_data);
    }

    function getechartsclick(){
        var mt = null;
        var mapType = [];
        var provinces = [];
        var mapGeoData = require('echarts/util/mapData/params');
        for (var city in cityMap) {
            mapType.push(city);
            // 自定义扩展图表类型
            mapGeoData.params[city] = {
                getGeoJson: (function (c) {
                    var geoJsonName = cityMap[c];
                    return function (callback) {
                        $.getJSON('libs/geoJson/china-main-city/' + geoJsonName + '.json', callback);
                    }
                })(city)
            }
        }
        for (var temp in provincesMap)
        {
            provinces.push(temp);
        }

        myEchart_1.on('click', function (param){
            myEchart_1.clear(option);
            var provinceLength = provinces.indexOf(param.name);
            var length = mapType.indexOf(param.name);
            if(provinceLength != -1){
                mt = param.name;
                option.series[0].markPoint.data = 0;
                if(mt == "浙江") {
                    option.series[0].markLine.data = pointdatatwo;
                    var data_area_out = ['杭州-宁波','杭州-温州','杭州-绍兴','杭州-湖州','杭州-嘉兴'];
                    var data_area_count = [95,70,14,30,20];
                    var slist_data = [];
                    for(var i = 0; i < data_area_out.length;i++){
                        slist_data[i] = {};
                        slist_data[i].cs = data_area_out[i];
                        slist_data[i].zzlkl = data_area_count[i];
                        slist_data[i].pjzlsrc = '---';
                        slist_data[i].xxx = '---';
                    }
                    $("#list").SList("refresh", slist_data);
                }
                else{
                    option.series[0].markLine.data = 0;
                    var slist_data = [];
                    for (var i = 0; i < 1; i++) {
                        slist_data[i] = {};
                        slist_data[i].cs = '无数据';
                        slist_data[i].zzlkl = '无数据';
                        slist_data[i].pjzlsrc = '无数据';
                        slist_data[i].xxx = '无数据';
                    }
                    $("#list").SList("refresh", slist_data);
                }
                $("#province").html(mt);
                $("#province").css("display","inline");
                $("#container").css("display","none");
                $("#container").css("z-index","1");
                $("#regetmap").css("z-index","10");
                $("#regetmap").css("display","inline");
                $("#regetcity").css("z-index","3");
                $("#regetarea").css("z-index","4");
                option.series[0].mapType = mt;
                myEchart_2.clear(option);
                myEchart_2.setOption(option, true);
            }
        });

        myEchart_2.on('click', function (param){
            var provinceLength = provinces.indexOf(param.name);
            var length = mapType.indexOf(param.name);
            if(length != -1){
                mt = mapType[length];
                option.series[0].markPoint.data = 0;
                if(mt == "杭州市"){
                    option.series[0].markPoint.data = 0;
                    option.series[0].markLine.data = pointdatathree;
                    var data_area_out = ['滨江-富阳'];
                    var data_area_count = [50];
                    var slist_data = [];
                    for(var i = 0; i < data_area_out.length;i++){
                        slist_data[i] = {};
                        slist_data[i].cs = data_area_out[i];
                        slist_data[i].zzlkl = data_area_count[i];
                        slist_data[i].pjzlsrc = '---';
                        slist_data[i].xxx = '---';
                    }
                    $("#list").SList("refresh", slist_data);
                }
                else{
                    option.series[0].markPoint.data = 0;
                    option.series[0].markLine.data = 0;
                    var slist_data = [];
                    for (var i = 0; i < 1; i++) {
                        slist_data[i] = {};
                        slist_data[i].cs = '无数据';
                        slist_data[i].zzlkl = '无数据';
                        slist_data[i].pjzlsrc = '无数据';
                        slist_data[i].xxx = '无数据';
                    }
                    $("#list").SList("refresh", slist_data);
                }
                $("#city").html(mt);
                $("#city").css("display","inline");
                $("#container").css("z-index","1");
                $("#regetmap").css("z-index","2");
                $("#regetmap").css("display","none");
                $("#regetcity").css("z-index","10");
                $("#regetcity").css("display","inline");
                $("#regetarea").css("z-index","4");
                option.series[0].mapType = mt;
                myEchart_3.clear(option);
                myEchart_3.setOption(option, true);
            }
            else {
                map = new BMap.Map("regetarea");
                var point = param.name;
                mt = param.name;
                map.centerAndZoom(point, 13);             // 初始化地图，设置中心点坐标和地图级别
                map.enableScrollWheelZoom();
                $("#area").html(mt);
                $("#area").css("display", "inline");
                $("#container").css("z-index", "1");
                $("#regetmap").css("z-index", "2");
                $("#regetcity").css("z-index", "3");
                $("#regetcity").css("display", "none");
                $("#regetarea").css("z-index", "10");
                $("#regetarea").css("display", "inline");
            }
        });

        myEchart_3.on('click', function (param){
            var provinceLength = provinces.indexOf(param.name);
            var length = mapType.indexOf(param.name);

            map = new BMap.Map("regetarea");
            var point = param.name;
            mt = param.name;
            map.centerAndZoom(point, 13);             // 初始化地图，设置中心点坐标和地图级别
            map.enableScrollWheelZoom();
            $("#area").html(mt);
            $("#area").css("display","inline");
            $("#container").css("z-index","1");
            $("#regetmap").css("z-index","2");
            $("#regetcity").css("z-index","3");
            $("#regetcity").css("display","none");
            $("#regetarea").css("z-index","10");
            $("#regetarea").css("display","inline");

        });
    }

    function initgetmap(){
        getechartsclick();
        option = {
            color: ['gold','aqua','lime','yellow'],
            tooltip : {
                trigger: 'item',
                formatter: '{b}'
            },
            dataRange: {
                min : 0,
                max : 100,
                show : true,
                calculable : true,
                color: ['#ff3333', 'orange', 'yellow','lime','aqua'],
                textStyle:{
                    color:'black'
                }
            },
            series : [
                {
                    name: '全国344个主要城市（县）地图',
                    type: 'map',
                    mapType: 'china',
                    hoverable: false,
                    selectedMode : 'single',
                    itemStyle:{
                        normal:{
                            areaStyle:{
                                color: '#F5F5F5'
                            },
                            borderColor:'rgba(100,149,237,1)',
                            borderWidth:0.5,
                            label:{show:true}},
                        emphasis:{label:{show:true}}
                    },
                    data:[],
                    markLine : {
                        smooth:true,
                        effect : {
                            show: true,
                            scaleSize: 1,
                            period: 30,
                            color: 'white',
                            shadowBlur: 10
                        },
                        itemStyle : {
                            normal: {
                                borderWidth:2,
                                lineStyle: {
                                    type: 'solid',
                                    shadowBlur: 10
                                }
                            }
                        },
                        data : pointdata
                    },

                    markPoint : {
                        symbol:'emptyCircle',
                        effect : {
                            show: true,
                            shadowBlur : 0
                        },
                        itemStyle:{
                            normal:{
                                label:{show:false}
                            },
                            emphasis: {
                                label:{position:'top'}
                            }
                        },
                        data : [
                            {name:'上海',value:95},
                            {name:'广州',value:90},
                            {name:'大连',value:80},
                            {name:'成都',value:70},
                            {name:'长沙',value:30}
                        ]
                    },
                    geoCoord: {
                        '上海': [121.4648,31.2891],
                        '东莞': [113.8953,22.901],
                        '东营': [118.7073,37.5513],
                        '中山': [113.4229,22.478],
                        '临汾': [111.4783,36.1615],
                        '临沂': [118.3118,35.2936],
                        '丹东': [124.541,40.4242],
                        '丽水': [119.5642,28.1854],
                        '乌鲁木齐': [87.9236,43.5883],
                        '佛山': [112.8955,23.1097],
                        '保定': [115.0488,39.0948],
                        '兰州': [103.5901,36.3043],
                        '包头': [110.3467,41.4899],
                        '北京': [116.4551,40.2539],
                        '北海': [109.314,21.6211],
                        '南京': [118.8062,31.9208],
                        '南宁': [108.479,23.1152],
                        '南昌': [116.0046,28.6633],
                        '南通': [121.1023,32.1625],
                        '厦门': [118.1689,24.6478],
                        '台州': [121.1353,28.6688],
                        '合肥': [117.29,32.0581],
                        '呼和浩特': [111.4124,40.4901],
                        '咸阳': [108.4131,34.8706],
                        '哈尔滨': [127.9688,45.368],
                        '唐山': [118.4766,39.6826],
                        '嘉兴': [120.9155,30.6354],
                        '大同': [113.7854,39.8035],
                        '大连': [122.2229,39.4409],
                        '天津': [117.4219,39.4189],
                        '太原': [112.3352,37.9413],
                        '威海': [121.9482,37.1393],
                        '宁波': [121.5967,29.6466],
                        '宝鸡': [107.1826,34.3433],
                        '宿迁': [118.5535,33.7775],
                        '常州': [119.4543,31.5582],
                        '广州': [113.5107,23.2196],
                        '廊坊': [116.521,39.0509],
                        '延安': [109.1052,36.4252],
                        '张家口': [115.1477,40.8527],
                        '徐州': [117.5208,34.3268],
                        '德州': [116.6858,37.2107],
                        '惠州': [114.6204,23.1647],
                        '成都': [103.9526,30.7617],
                        '扬州': [119.4653,32.8162],
                        '承德': [117.5757,41.4075],
                        '拉萨': [91.1865,30.1465],
                        '无锡': [120.3442,31.5527],
                        '日照': [119.2786,35.5023],
                        '昆明': [102.9199,25.4663],
                        '杭州': [119.5313,29.8773],
                        '枣庄': [117.323,34.8926],
                        '柳州': [109.3799,24.9774],
                        '株洲': [113.5327,27.0319],
                        '武汉': [114.3896,30.6628],
                        '汕头': [117.1692,23.3405],
                        '江门': [112.6318,22.1484],
                        '沈阳': [123.1238,42.1216],
                        '沧州': [116.8286,38.2104],
                        '河源': [114.917,23.9722],
                        '泉州': [118.3228,25.1147],
                        '泰安': [117.0264,36.0516],
                        '泰州': [120.0586,32.5525],
                        '济南': [117.1582,36.8701],
                        '济宁': [116.8286,35.3375],
                        '海口': [110.3893,19.8516],
                        '淄博': [118.0371,36.6064],
                        '淮安': [118.927,33.4039],
                        '深圳': [114.5435,22.5439],
                        '清远': [112.9175,24.3292],
                        '温州': [120.498,27.8119],
                        '渭南': [109.7864,35.0299],
                        '湖州': [119.8608,30.7782],
                        '湘潭': [112.5439,27.7075],
                        '滨州': [117.8174,37.4963],
                        '潍坊': [119.0918,36.524],
                        '烟台': [120.7397,37.5128],
                        '玉溪': [101.9312,23.8898],
                        '珠海': [113.7305,22.1155],
                        '盐城': [120.2234,33.5577],
                        '盘锦': [121.9482,41.0449],
                        '石家庄': [114.4995,38.1006],
                        '福州': [119.4543,25.9222],
                        '秦皇岛': [119.2126,40.0232],
                        '绍兴': [120.564,29.7565],
                        '聊城': [115.9167,36.4032],
                        '肇庆': [112.1265,23.5822],
                        '舟山': [122.2559,30.2234],
                        '苏州': [120.6519,31.3989],
                        '莱芜': [117.6526,36.2714],
                        '菏泽': [115.6201,35.2057],
                        '营口': [122.4316,40.4297],
                        '葫芦岛': [120.1575,40.578],
                        '衡水': [115.8838,37.7161],
                        '衢州': [118.6853,28.8666],
                        '西宁': [101.4038,36.8207],
                        '西安': [109.1162,34.2004],
                        '贵阳': [106.6992,26.7682],
                        '连云港': [119.1248,34.552],
                        '邢台': [114.8071,37.2821],
                        '邯郸': [114.4775,36.535],
                        '郑州': [113.4668,34.6234],
                        '鄂尔多斯': [108.9734,39.2487],
                        '重庆': [107.7539,30.1904],
                        '金华': [120.0037,29.1028],
                        '铜川': [109.0393,35.1947],
                        '银川': [106.3586,38.1775],
                        '镇江': [119.4763,31.9702],
                        '长春': [125.8154,44.2584],
                        '长沙': [113.0823,28.2568],
                        '长治': [112.8625,36.4746],
                        '阳泉': [113.4778,38.0951],
                        '青岛': [120.4651,36.3373],
                        '韶关': [113.7964,24.7028],
                        '滨江': [120.2122,30.2009],
                        '富阳': [119.9524,30.0474]

                    }
                }
            ]
        };
        myEchart_1.setOption(option);
    }

 /*   function initreget(mt,index){
        /!*var dom = document.getElementById("regetmap");
        var myEchart = echarts.init(dom);*!/

        option.series[0].markPoint.data = 0;
        if(index == 1) {
            $("#container").css("display","none");
            $("#regetmap").css("z-index","10");
            $("#regetmap").css("display","inline");
            option.series[0].markLine.data = pointdatatwo;

            option.series[0].mapType = mt;

            myEchart_2.setOption(option, true);
        }
        else if(index == 2){
            $("#container").css("display","none");
            $("#regetmap").css("z-index","10");
            $("#regetmap").css("display","inline");
            option.series[0].markLine.data = pointdatathree;

            option.series[0].mapType = mt;

            myEchart_3.setOption(option, true);
        }
        else{
            option.series[0].markLine.data = pointdata;
        }

        /!*option.series[0].mapType = mt;

        myEchart_1.setOption(option, true);*!/
    }*/

    function backto_country(){
        var data_area_out = ['北京-广州','北京-上海','北京-成都','北京-长沙','北京-大连'];
        var data_area_in = ['---','---','---','---','---'];
        var data_area_count = [300,380,256,290,340];
        var slist_data = [];
        for(var i = 0; i < data_area_out.length;i++){
            slist_data[i] = {};
            slist_data[i].cs = data_area_out[i];
            slist_data[i].zzlkl = data_area_count[i];
            slist_data[i].pjzlsrc = data_area_in[i];
            slist_data[i].xxx = '---';
        }
        $("#list").SList("refresh", slist_data);

        $("#container").css("z-index","5");
        $("#regetmap").css("z-index","2");
        $("#regetcity").css("z-index","3");
        $("#regetarea").css("z-index","4");
        $("#container").css("display","inline");
        $("#regetmap").css("display","none");
        $("#regetcity").css("display","none");
        $("#regetarea").css("display","none");
        initgetmap();
    }
    function backto_province(){
        if ($("#province").text() == '浙江') {
            var data_area_out = ['杭州-宁波', '杭州-温州', '杭州-绍兴','杭州-湖州', '杭州-嘉兴'];
            var data_area_count = [95,70,14,30,20];
            var slist_data = [];
            for (var i = 0; i < data_area_out.length; i++) {
                slist_data[i] = {};
                slist_data[i].cs = data_area_out[i];
                slist_data[i].zzlkl = data_area_count[i];
                slist_data[i].pjzlsrc = '---';
                slist_data[i].xxx = '---';
            }
            $("#list").SList("refresh", slist_data);
        }
        else{
            var slist_data = [];
            for (var i = 0; i < 1; i++) {
                slist_data[i] = {};
                slist_data[i].cs = '无数据';
                slist_data[i].zzlkl = '无数据';
                slist_data[i].pjzlsrc = '无数据';
                slist_data[i].xxx = '无数据';
            }
            $("#list").SList("refresh", slist_data);
        }

        $("#container").css("z-index","1");
        $("#regetmap").css("z-index","5");
        $("#regetcity").css("z-index","3");
        $("#regetarea").css("z-index","4");
        $("#container").css("display","none");
        $("#regetmap").css("display","inline");
        $("#regetcity").css("display","none");
        $("#regetarea").css("display","none");
        initgetmap();
    }
    function backto_city(){
        if($("#province").text() == '杭州市') {
            var data_area_out = ['滨江-富阳'];
            var data_area_count = [50];
            var slist_data = [];
            for (var i = 0; i < data_area_out.length; i++) {
                slist_data[i] = {};
                slist_data[i].cs = data_area_out[i];
                slist_data[i].zzlkl = data_area_count[i];
                slist_data[i].pjzlsrc = '---';
                slist_data[i].xxx = '---';
            }
        }
        else{
            var slist_data = [];
            for (var i = 0; i < 1; i++) {
                slist_data[i] = {};
                slist_data[i].cs = '无数据';
                slist_data[i].zzlkl = '无数据';
                slist_data[i].pjzlsrc = '无数据';
                slist_data[i].xxx = '无数据';
            }
            $("#list").SList("refresh", slist_data);
        }
        $("#list").SList("refresh", slist_data);
        $("#container").css("z-index","1");
        $("#regetmap").css("z-index","2");
        $("#regetcity").css("z-index","5");
        $("#regetarea").css("z-index","4");
        $("#container").css("display","none");
        $("#regetmap").css("display","none");
        $("#regetcity").css("display","inline");
        $("#regetarea").css("display","none");
        initgetmap();
    }
    function backto_area(){
        $("#container").css("z-index","1");
        $("#regetmap").css("z-index","2");
        $("#regetcity").css("z-index","3");
        $("#regetarea").css("z-index","5");
        $("#container").css("display","none");
        $("#regetmap").css("display","none");
        $("#regetcity").css("display","none");
        $("#regetarea").css("display","inline");
    }

    function initEvent(){
        $("#country").on("click", backto_country);
        $("#province").on("click", backto_province);
        $("#city").on("click", backto_city);
        $("#area").on("click", backto_area);
    }



    function _init ()
    {
        initechart();
        initEvent();
        initData();
        initgetmap();
        disList();
    }

    function _destroy ()
    {

    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        //"resize": _resize,
        "widgets": ["Echart","SList", "SingleSelect", "DateRange", "DateTime"],
        "utils":["Request","Base"]
    });
})( jQuery );
