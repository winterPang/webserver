;(function($){
var MODULE_BASE = "maintain";
var MODULE_NAME = MODULE_BASE+".displayapplyhander";
var g_oUrlPara;
var g_sHandler;
var g_sLevel;
var g_sErrortype;
var g_sHandlemode;

function getRcText(sRcId)
{
	return Utils.Base.getRcString("DisplayApplyRadio_rc",sRcId);
}

function getRcString(sRcId,sRcName)
{
	return $("#"+sRcId).attr(sRcName);
}

/*
编辑框中数据的获取以及显示
*/
function getData(){

	var core = g_oUrlPara.core;

	$.ajax({
		url:MyConfig.path+'/maintenance/one',
		type:'post',
		dataType:'json',
		data:{
			core:core
		},
		success:function(data){

			initData(data);
		},
		error:function(){

		}
	})
}

function initData(data){

	data.status = data.handlemode;
	if (data.status == "1") {
		$("#status").val("未分配");
	} else if (data.status == "2") {
		$("#status").val("未定位");
	} else if (data.status == "3") {
		$("#status").val("已修改");
	} else if (data.status == "4") {
		$("#status").val("已修复");
	}

	$("#setpoint").val(data.setpoint);
	$("#handler").val(data.handler);
	$("#module").val(data.module);
	$("#time").val(data.date + ' ' + data.time);
	$("#level").val(data.level);
	$("#errortype").val(data.errortype);
	$("#product").val(data.product);
	$("#version").val(data.version);
	$("#gbdinfo").val(data.gdbinfo);
	$("#core").html(data.core);
	$("#handlemode").val(data.handlemode);

	g_sHandler = $("#handler").val();
	g_sLevel = $("#level").val();
	g_sErrortype = $("#errortype").val();
	g_sHandlemode = $("#handlemode").val();
}

/*
确定按钮点击后提交数据到后台
*/
function success(){
   
	$("#success").on("click",function(){
      var sHandler = $("#handler").val();
	  var sLevel = $("#level").val();
      var sErrortype = $("#errortype").val();
      var sCore = g_oUrlPara.core;
	  var sHandlemode = $("#handlemode").val();
	  var sStatus = $("#status").val();

		$.ajax({
			url: MyConfig.path + "/maintenance/setall",
			type: "POST",
			data: {
				handler: sHandler,
				level: sLevel,
				errortype: sErrortype,
				core: sCore,
				handlemode: sHandlemode,
				status: sStatus
			},
			success: function () {
				if ((g_sHandler != sHandler) || (g_sLevel != sLevel) || (g_sErrortype != sErrortype) || g_sHandlemode != sHandlemode) {
					initAll();
					initErrortype();
					initEmergency();
					initTotal();
					initTendency();
					initVersion();
					setTimeout(function () {
						Frame.Msg.info("设置成功");
					}, 800);
				}
			},
			error: function () {
				setTimeout(function () {
					Frame.Msg.info("设置失败");
				}, 800);
			}
		})
	})
}

/*
后台重新获取数据，加载异常信息概览列表
*/

function initAll(){
	$.get(MyConfig.path+"/maintenance/all",function(maintenanceData){

		analyseAllData(maintenanceData);
	});

	function analyseAllData(maintenanceData) {

		//异常分析数据解析
		var abnormal_data = [];
		var data2 = JSON.parse(maintenanceData);
		for (var i = 0; i < data2.length; i++) {
			abnormal_data[i] = {};
			abnormal_data[i].setpoint = data2[i].setpoint;
			abnormal_data[i].handler = data2[i].handler;
			abnormal_data[i].module = data2[i].module;
			abnormal_data[i].time = data2[i].date + ' ' + data2[i].time;
			abnormal_data[i].status = data2[i].handlemode;
			abnormal_data[i].level = data2[i].level;
			abnormal_data[i].errortype = data2[i].errortype;
			abnormal_data[i].product = data2[i].product;
			abnormal_data[i].version = data2[i].version;
			abnormal_data[i].gdbinfo = data2[i].gdbinfo;
			abnormal_data[i].core = data2[i].core;
			abnormal_data[i].handlemode = data2[i].handlemode;

			if (abnormal_data[i].status == "1") {
				abnormal_data[i].status = "未分配";
			} else if (abnormal_data[i].status == "2") {
				abnormal_data[i].status = "未定位";
			} else if (abnormal_data[i].status == "3") {
				abnormal_data[i].status = "已修改";
			} else if (abnormal_data[i].status == "4") {
				abnormal_data[i].status = "已修复";
			}

			if (abnormal_data[i].level == "1") {
				abnormal_data[i].level = "致命";
			} else if (abnormal_data[i].level == "2") {
				abnormal_data[i].level = "严重";
			} else if (abnormal_data[i].level == "3") {
				abnormal_data[i].level = "一般";
			}

			if (abnormal_data[i].errortype == "1") {
				abnormal_data[i].errortype = "数组访问越界";
			} else if (abnormal_data[i].errortype == "2") {
				abnormal_data[i].errortype = "指针访问越界";
			} else if (abnormal_data[i].errortype == "3") {
				abnormal_data[i].errortype = "访问空指针";
			} else if (abnormal_data[i].errortype == "4") {
				abnormal_data[i].errortype = "访问无效指针";
			} else if (abnormal_data[i].errortype == "5") {
				abnormal_data[i].errortype = "除零错误";
			} else if (abnormal_data[i].errortype == "6") {
				abnormal_data[i].errortype = "内存未初始化";
			} else if (abnormal_data[i].errortype == "7") {
				abnormal_data[i].errortype = "数据计算溢出";
			} else if (abnormal_data[i].errortype == "8") {
				abnormal_data[i].errortype = "多线程访问资源";
			} else if (abnormal_data[i].errortype == "9") {
				abnormal_data[i].errortype = "重复释放内存"
			} else if (abnormal_data[i].errortype == "10") {
				abnormal_data[i].errortype = "堆栈写坏"
			}
		}

		$("#wirelessterminal_mlist").mlist("refresh", abnormal_data);
	}
}

/*
获取饼状图的数据进行再次加载
*/
function initErrortype(){
	$.get(MyConfig.path+'/maintenance/errortype',function(maintainData){

		analyseErrortypeData(maintainData);
	});

	function analyseErrortypeData(maintainData) {

		//异常分析
		var data = JSON.parse(maintainData);
		var atempData = [];
		var aType = getRcText('APPINFO').split(',');
		for (var i = 0; i < data.length; i++){
			atempData[i] = {};
			atempData[i].name = aType[data[i].errortype];
			atempData[i].value = data[i].count;
		}

		drawPie(atempData);
	}
}

function drawPie(atempData){
	//使用
	require(
		[
			'echarts',
			'echarts/chart/pie' // 按需加载使用的图形模块
		],
		function drawPie(ec) {

			// 基于准备好的dom，初始化echarts图表
			var myChart = ec.init(document.getElementById('terminaltype'));
			var option = {
				tooltip : {
					trigger: 'item',
					formatter: "{a} <br/>{b} : {c} ({d}%)"
				},
				toolbox: {
					show : false,
					feature : {
						mark : {show: true},
						dataView : {show: true, readOnly: false},
						magicType : {
							show: true,
							type: ['pie', 'funnel'],
							option: {
								funnel: {
									x: '25%',
									width: '80%',
									funnelAlign: 'center',
									max: 1548
								}
							}
						},
						restore : {show: true},
						saveAsImage : {show: true}
					}
				},
				calculable : true,
				series : [
					{
						name:'访问来源',
						type:'pie',
						radius : ['50%', '80%'],
						itemStyle: {
							normal: {
								areaStyle: {
									type: 'default'
								},
								label:{
									formatter: "{d}%"
								},
								labelLine: {
									length: 1
								}
							},
							emphasis : {
								label : {
									show : true,
									position : 'center',
									textStyle : {
										fontSize : '20',
										fontWeight : 'bold'
									}
								}
							}
						},
						data:
							atempData

					}
				]
			};
			var oTheme = {
				color : ['gray','blue','#69C4C5','#FFBB33','#FF8800','#CC324B','#E64C65','#D7DDE4']
			};

			// 为echarts对象加载数据
			myChart.setOption(option,oTheme.color);

			Legend($("#myLegend"),{
				type: 'legend',
				data: atempData,
				color: oTheme.color
			})
		}
	)
}

function Legend(jPanel,opt)
{
	var _jPanel = jPanel;
	var aList = opt.data || [],
		aColor = opt.color || [],
		nTotal = 0;

	_jPanel.addClass('leg-panel').empty();
	for(var i=0;i<aList.length;i++)
	{
		if( aList[i].name === '_padding' || aList[i].name === "") continue;
		nTotal += aList[i].value;
	}

	for(var i=0;i<aList.length;i++)
	{
		var oItem = aList[i], sHtml, nPercent;
		if( oItem.name == '_padding'  || oItem.name === "") continue;

		var nPercent = Math.round((oItem.value / nTotal) * 100) + "%";
		sHtml = '<div class="leg-row"><span class="leg-icon" style="background:'
			+ aColor[i] + '"></span><span class="leg-title" style="color:#f5f5f5">'
			+ oItem.name +  '</span><span class="leg-percent" style="float:right;color:#f5f5f5">'
			+ nPercent+'</span></div>';
		_jPanel.append(sHtml);
	}
}

/*
紧急异常列表获取后台数据进行再次加载
*/
function initEmergency(){
	$.get(MyConfig.path+'/maintenance/emergency',function(maintenanceData){

		analyseEmergencyData(maintenanceData);
	});

	function analyseEmergencyData(maintenanceData) {

		//异常分析数据
		var data2 = JSON.parse(maintenanceData);
		var opt_data = [];
		for (var i = 0; i < data2.length; i++) {
			opt_data[i] = {};
			opt_data[i].time = data2[i].date + ' ' + data2[i].time;
			opt_data[i].handler = data2[i].handler;
			opt_data[i].module = data2[i].module;
			opt_data[i].product = data2[i].product;
			opt_data[i].core = data2[i].core;
		}

		$("#ap_info_mlist").mlist("refresh", opt_data);
	}
}

/*
异常统计获取后台数据进行再次加载
*/
function initTotal(){
	$.get(MyConfig.path+'/maintenance/total',function(maintenanceData) {

		analyseTotalData(maintenanceData);
	});

	function analyseTotalData(maintenanceData) {

		maintenanceData = JSON.parse(maintenanceData);
		var Total = maintenanceData.total;
		var Deactive = maintenanceData.deactive;
		var Active = maintenanceData.active;
		var New = maintenanceData.new;

		$('#sumnumber1').text(Total);
		$('#sumnumber2').text(Deactive);
		$('#sumnumber3').text(Active);
		$('#sumnumber4').text(New);
	}
}

/*
折线图获取后台数据重新加载
*/
function initTendency(){
	$.get(MyConfig.path+'/maintenance/tendency',function(maintenanceData){

		analyseTendencyData(maintenanceData);
	});

	function analyseTendencyData(maintenanceData) {

		var data = JSON.parse(maintenanceData);
		var xlist = [];
		var xlist1 = [];
		var xlist2 = [];
		for (var i = 0; i < data.length; i++) {
			xlist.push(data[i].date);
			xlist1.push(data[i].old);
			xlist2.push(data[i].new);
		}

		drawLine(xlist, xlist1, xlist2);
	}
}

function drawLine(xlist,xlist1,xlist2){
	require(
		[
			'echarts',
			'echarts/chart/line' // 按需加载使用的图形模块
		],
		function (ec) {
			// 基于准备好的dom，初始化echarts图表
			var myChart = require('echarts').init(document.getElementById('legend'));
			var option = {
				tooltip : {
					trigger: 'axis'
				},
				legend: {
					data:
					[
						{
							name:"未修复",
							textStyle:{color:'white'}
						},
						{
							name:"每日新增",
							textStyle:{color:'white'}
						}
					]
				},
				toolbox: {
					show : false,
					feature : {
						mark : {show: true},
						dataView : {show: true, readOnly: false},
						magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
						restore : {show: true},
						saveAsImage : {show: true}
					}
				},
				calculable : true,
				xAxis : [
					{
						name:'日期',
						type : 'category',
						boundaryGap : false,
						data : xlist,
						axisLabel:{
							show:true,
							textStyle:{color:"#e6e6e6",fontSize:'8px'}
						}
					}
				],
				yAxis : [
					{
						name:'个数',
						type : 'value',
						axisLabel:{
							show:true,
							textStyle:{color:"#e6e6e6",fontSize:'8px'}
						}
					}
				],
				series : [
					{
						name:'未修复',
						type:'line',
						stack: '总量',
						itemStyle: {normal: {areaStyle: {type: 'default'}}},
						data:xlist1
					},
					{
						name:'每日新增',
						type:'line',
						stack: '总量',
						itemStyle: {normal: {areaStyle: {type: 'default'}}},
						data:xlist2
					}
				]
			};

			var oTheme = {
				color : ['yellow','#red']
			};
			// 为echarts对象加载数据
			myChart.setOption(option);
		}
	)
}

/*
散点图重新获取数据进行页面刷新
*/
function initVersion(){
	$.get(MyConfig.path+'/maintenance/versiontest', function(maintenanceData){

		analyseVersionData(maintenanceData);
	});

    function analyseVersionData(maintenanceData){

		var data2 = JSON.parse(maintenanceData);
		var xlist = [];
		var ylist = [];
		var vlist = [];
		var lastData = [];
		var y = 0;

		if( data2.length == 0){

			drawScatter(xlist,ylist,vlist);
			return;
		}

		if( data2.length == 1){

			xlist.push(data2[0].date);
			ylist.push(data2[0].version);
			vlist.push([data2[0].date,data2[0].version,data2[0].count]);
			drawScatter(xlist,ylist,vlist);
			return;
		}

		data2.sort(compare("date"));

		function compare(prob){
			return function(obj1,obj2){
				var val1 = obj1[prob];
				var val2 = obj2[prob];
				if( val1 < val2){
					return -1;
				}
				else if( val1 > val2){
					return 1;
				}
				else{
					return 0;
				}
			}
		}

		var prob = data2[0];
		for(var i = 1 ; i < data2.length; i++){
			if( (prob.date == data2[i].date) && (prob.version == data2[i].version)){
				++prob.count;
				if( i == data2.length -1){
					lastData[y] = prob;
				}
			}
			else
			{
				lastData[y] = prob;
				++y;
				prob = data2[i];
				if( i == data2.length -1){
					lastData[y] = prob;
				}
			}
		}

		for(var k = 0 ; k < lastData.length ; k++){
			xlist.push(lastData[k].date);
			ylist.push(lastData[k].version);
			vlist.push([lastData[k].date,lastData[k].version,lastData[k].count]);
		}

		drawScatter(xlist,ylist,vlist);
	}
}

function drawScatter(xlist,ylist,vlist){

	//去掉时间数组里面的重复的元素
	var Hash = {};
	var xlistFilter = new Array();
	for(var i = 0 ; i < xlist.length ; i++){
		if( !Hash[xlist[i]]){
			xlistFilter.push(xlist[i]);
			Hash[xlist[i]] = true;
		}
	}

	//版本数据数组不能有重复的数据
	var hash = {};
	var ylistFilter = new Array();
	for(var i = 0 ; i < ylist.length ; i++){
		if(!hash[ylist[i]]){
			ylistFilter.push(ylist[i]);
			hash[ylist[i]] = true;
		}
	}

	// 使用
	require(
		[
			'echarts',
			'echarts/chart/scatter' //按需加载使用的图形模块
		],
		function (ec) {
			// 基于准备好的dom，初始化echarts图表
			var myChart = ec.init(document.getElementById('scatter'));
			var option = {
				title : {
					subtext : ''
				},
				tooltip : {
					show:true,
					trigger: 'axis',
					axisPointer:{
						show: true,
						type : 'cross',
						lineStyle: {
							type : 'dashed',
							width : 1
						}
					}
				},
				toolbox: {
					show : false,
					feature : {
						mark : {show: true},
						dataView : {show: true, readOnly: false},
						restore : {show: true},
						saveAsImage : {show: true}
					}
				},
				dataZoom: {
					show: true,
					realtime: true,
					start : 0,
					end : 100
				},
				legend : {
					data :
						[
							{
								name:"未修复",
								textStyle:{color:'white'}
							}
						]
				},
				dataRange: {
					min: 0,
					max: 100,
					orient: 'horizontal',
					y: 30,
					x: 'center',
					//text:['高','低'],           // 文本，默认为数值文本
					color:['lightgreen','orange'],
					splitNumber: 5
				},
				xAxis : [
					{
						type : 'category',
						axisLabel: {
							formatter : function(v) {
								return v;
							},
							textStyle:{color:'#e6e6e6'}
						},
						data : xlistFilter
					}
				],
				yAxis : [
					{
						type : 'category',
						axisLabel: {
							formatter : function(v) {
								return v;
							},
							textStyle:{color:'#e6e6e6'}
						},
						data : ylistFilter
					}
				],
				grid:{
					x:120
				},
				animation: false,
				series : [
					{
						name:'未修复',
						type:'scatter',
						tooltip : {
							trigger: 'item',
							formatter : function (params) {
								return params[0] + ' （'  + params[2][0] + '）<br/>'
									+ params[2][1] + ', '
									+ params[2][2];
							},
							axisPointer:{
								show: true
							}
						},
						symbolSize: function (value){
							return Math.round(value[2]);
						},
						data: vlist
					}
				]
			};
			// 为echarts对象加载数据
			myChart.setOption(option);
		}
	)
}

/*
core 文件下载
*/
function download(){
    $("#core").on("click",function(){
	   var value = $("#core").html();
	   document.getElementById('core').href = "/rd/jag/maintenance/upload?filename="+value+".tgz";
	})
}



function _init(oPara) {
  g_oUrlPara = Utils.Base.parseUrlPara();
  $.extend(g_oUrlPara,oPara);
  getData();
  success();
  download();  
}

function _destroy(){

}

Utils.Pages.regModule(MODULE_NAME,{
   "init":_init,
   "destroy":_destroy,
   "widgets":["Mlist","SList"],
   "utils":["Request","Base"]
});

})(jQuery);