(function ($) {
    var MODULE_NAME = "city_passengerpath.index";
	var BMapExt;
	var option;
	var myCharts;
	var aData = [];

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("passengerpath_rc", sRcName).split(",");
    }

	function getData(areaName, date, bIsQuit)
	{
		var aData;

		if (bIsQuit)
		{
			switch (areaName)
			{
				case "海淀区":
					aData = [
						{name:'昌平区',value:95},
						{name:'石景山区',value:90},
						{name:'门头沟区',value:80},
						{name:'朝阳区',value:70},
						{name:'东城区',value:60},
						{name:'房山区',value:50},
						{name:'丰台区',value:40},
						{name:'通州区',value:30},
						{name:'顺义区',value:20},
						{name:'大兴区',value:10}
					];
					break;
				case "昌平区":
					aData = [
						{name:'海淀区',value:95},
						{name:'石景山区',value:90},
						{name:'门头沟区',value:80},
						{name:'朝阳区',value:70},
						{name:'东城区',value:60},
						{name:'房山区',value:50},
						{name:'丰台区',value:40},
						{name:'通州区',value:30},
						{name:'顺义区',value:20},
						{name:'大兴区',value:10}
					];
					break;
				case "东城区":
					aData = [
						{name:'昌平区',value:95},
						{name:'石景山区',value:90},
						{name:'门头沟区',value:80},
						{name:'朝阳区',value:70},
						{name:'海淀区',value:60},
						{name:'房山区',value:50},
						{name:'丰台区',value:40},
						{name:'通州区',value:30},
						{name:'顺义区',value:20},
						{name:'大兴区',value:10}
					];
					break;
				default :
					break;
			}
		}
		else
		{
			switch (areaName)
			{
				case "海淀区":
					aData = [
						{name:'昌平区',value:10},
						{name:'石景山区',value:20},
						{name:'门头沟区',value:30},
						{name:'朝阳区',value:40},
						{name:'东城区',value:50},
						{name:'房山区',value:60},
						{name:'丰台区',value:70},
						{name:'通州区',value:80},
						{name:'顺义区',value:90},
						{name:'大兴区',value:95}
					];
					break;
				case "昌平区":
					aData = [
						{name:'海淀区',value:10},
						{name:'石景山区',value:20},
						{name:'门头沟区',value:30},
						{name:'朝阳区',value:40},
						{name:'东城区',value:50},
						{name:'房山区',value:60},
						{name:'丰台区',value:70},
						{name:'通州区',value:80},
						{name:'顺义区',value:90},
						{name:'大兴区',value:95}
					];
					break;
				case "东城区":
					aData = [
						{name:'昌平区',value:10},
						{name:'石景山区',value:20},
						{name:'门头沟区',value:30},
						{name:'朝阳区',value:40},
						{name:'海淀区',value:50},
						{name:'房山区',value:60},
						{name:'丰台区',value:70},
						{name:'通州区',value:80},
						{name:'顺义区',value:90},
						{name:'大兴区',value:95}
					];
					break;
				default :
					break;
			}
		}

		return aData;
	}

	function freshMap()
	{
		var areaName;
		var bIsQuit;
		var date;
		var nLength;
		var aData;
		var aLineData = new Array();
		var aPointData = new Array();
		var sListData = "";
		var nSum = 0;

		$("#dataList").empty();

		areaName = $("#areaSelect").singleSelect("value");
		bIsQuit = $(".directSelect").children().text() == "迁出"?true:false;

		aData = getData(areaName, date, bIsQuit);
		aPointData = aData;
		aPointData = aPointData || [];
		nLength = aPointData.length;
		for (var i = 0; i < nLength; i++)
		{
			nSum += parseInt(aPointData[i].value);
		}
		for (var i = 0; i < nLength; i++)
		{
			aLineData[i] = new Array();

			if (bIsQuit)
			{
				aLineData[i][0] = {name:areaName};
				aLineData[i][1] = aPointData[i];

				sListData += "<li>";
				sListData += "<span>" + areaName + "</span>";
				sListData += "<span> -> </span>";
				sListData += "<span>" + aPointData[i].name + "</span>";
				sListData += "<span>" + (parseInt(aPointData[i].value * 100) / parseInt(nSum)).toFixed(2) + "%" + "</span>";
				sListData += "</li>";
				$("#dataList").append(sListData);
				sListData = "";
			}
			else
			{
				aLineData[i][0] = aPointData[i];
				aLineData[i][1] = {name:areaName};

				sListData += "<li>";
				sListData += "<span>" + aPointData[i].name + "</span>";
				sListData += "<span>-></span>";
				sListData += "<span>" + areaName + "</span>";
				sListData += "<span>" + (parseInt(aPointData[i].value * 100) / parseInt(nSum)).toFixed(2) + "%" + "</span>";
				sListData += "</li>";
				$("#dataList").append(sListData);
				sListData = "";
			}
		}
		aLineData = aLineData || [];
		option.series[0].markLine.data = aLineData;
		option.series[0].markPoint.data = aPointData;
		BMapExt.setOption(option, true);


		//var testData = [
		//	{
		//		"srcName" : "海淀区",
		//		"direction" : "->",
		//		"destName" : "昌平区",
		//		"percentage": "5%"
		//	}
		//];
        //
		//$("#listTest").SList("refresh", testData);
	}


    function initData()
    {
		$("#areaSelect").change(freshMap);
		$("#moveOut").on("click", function(){
			$(this).addClass("directSelect");
			$("#moveIn").removeClass("directSelect");
			freshMap();
		});
		$("#moveIn").on("click", function(){
			$(this).addClass("directSelect");
			$("#moveOut").removeClass("directSelect");
			freshMap();
		});

		freshMap();

		//var optGroup = {
		//	showHeader: false,
		//	multiSelect: false,
		//	colNames: getRcText("LISTHEADER"),
		//	colModel: [
		//		{name: "srcName", datatype: "String"},
		//		{name: "direction", datatype: "String"},
		//		{name: "destName", datatype: "String"},
		//		{name: "percentage", datatype: "String"}
		//	]
		//
		//};
		//$("#listTest").SList ("head", optGroup);
    }

    function initForm()
    {
		requires.config({
			paths: {
				echarts: '../city_passengerpath/chartjs'
			},
			packages: [
				{
					name: 'BMap',
					location: '../city_passengerpath/bmap',
					main: 'main'
				}
			]
		});

		requires(
			[
				'echarts',
				'BMap',
				'echarts/chart/map',
			],
			function(echarts, BMapExtension)
			{
				// 初始化地图
				BMapExt = new BMapExtension($("#passenger_path")[0], BMap, echarts);
				var map = BMapExt.getMap();
				var mapStyle = {style:"midnight"};
				var container = BMapExt.getEchartsContainer();
				var startPoint = {
					x: 116.307108,
					y: 39.993252
				};
				var point = new BMap.Point(startPoint.x, startPoint.y);
				map.centerAndZoom(point, 11);
				map.enableScrollWheelZoom(true);
				map.setMapStyle(mapStyle);

				option = {

					color: ['#4ec1b2'],
					//title : {
					//	text: '人员流动图',
					//	subtext:'数据纯属虚构',
					//	x:'right'
					//},
					tooltip : {
						trigger: 'item',
						formatter: function (v) {
							return v[1].replace(':', ' > ');
						}
					},
					/*timeline:{
						data:[
							'2002-01-01','2003-01-01','2004-01-01','2005-01-01','2006-01-01',
							'2007-01-01','2008-01-01','2009-01-01','2010-01-01','2011-01-01'
						],
						label : {
							formatter : function(s) {
								return s.slice(0, 4);
							}
						},
						autoPlay : true,
						playInterval : 1000
					},*/
					legend: {
						show:false,
						orient: 'vertical',
						x:'left',
						data:['海淀区'],
						selectedMode: 'single',
						textStyle:{color:'#4ec1b2'},
						selected:{
							'海淀区' : true,
						}
					},
					toolbox: {
						show : true,
						orient : 'vertical',
						x: 'right',
						y: 'center',
						feature : {
							mark : {show: true},
							dataView : {show: true, readOnly: false},
							restore : {show: true},
							saveAsImage : {show: true}
						}
					},
					dataRange: {
						min : 0,
						max : 100,
						y: '60%',
						calculable : true,
						color: ['#ff3333', 'orange', 'yellow','lime','aqua'],
						textStyle:{color:'white'},
					},
					series : [
						{
							name:'海淀区',
							type:'map',
							mapType: 'none',
							data:[],
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
								'海淀区': [116.307108,39.993252],
								'昌平区': [116.276063,40.064854],
								'门头沟区': [116.058745,39.936625],
								'石景山区': [116.235819,39.926888],
								'朝阳区': [116.419791,39.936625],
								'东城区': [116.428415,39.942379],
								'房山区': [116.144982,39.778882],
								'丰台区': [116.324356,39.881722],
								'通州区': [116.660106,39.948131],
								'顺义区': [116.646308,40.123139],
								'大兴区': [116.382422,39.758473]
							},

							markLine : {
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
								data : []
							},
							markPoint : {
								symbol:'emptyCircle',
								symbolSize : function (v){
									return 10 + v/10
								},
								effect : {
									show: true,
									shadowBlur : 0
								},
								itemStyle:{
									normal:{
										label:{show:false}
									}
								},
								data : []
							}
						}
					]
				};

				if (myCharts && myCharts.dispose) {
					myCharts.dispose();
				}
				myCharts = BMapExt.initECharts(container);
				//window.onresize = myCharts.resize;
				BMapExt.setOption(option, true);
				//var ecConfig = requires("echarts/config");
				initData();
			});
    }

    function initGrid()
    {
		$("#areaSelect").singleSelect("InitData", getRcText("AREALIST"));
		$(".datewidget input:first-child").attr("placeholder", getRcText("PLACEHOLDER"));
    }

    function _init()
    {
		initGrid();
        initForm();

		//$("#directionSelect").singleSelect("InitData", ["迁出", "迁入"]);
		//$("#directionSelect").singleSelect("value", "迁出");
		//console.log($("#areaSelect").singleSelect("value"));
    }

    function _destroy()
    {
        console.log("*******destory*******");
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["Minput","SList","Form","SingleSelect","DateTime","DateRange"],
        "utils":["Request","Base"]
    });
})( jQuery );

