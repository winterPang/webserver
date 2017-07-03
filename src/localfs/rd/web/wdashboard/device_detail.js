;(function ($) {
	var MODULE_BASE = "wdashboard";
	var MODULE_NAME = MODULE_BASE + ".device_detail";
	var g_oTimer = false;
	var oInfor = {};
	var g_jMList;
	var g_select=null;
	var gMychart;
	var TimeFn;
	function getRcText (sRcName) 
	{
		return Utils.Base.getRcString("aps_all_rc",sRcName);
	}
    var total;
	function getDevDatatime (argument) {
        // var temp = eval(argument);
        var day  = parseInt(argument/86400);
        var temp = argument%86400;
        var hour = parseInt(temp/3600);
        temp = argument%3600;
        var mini = parseInt(temp/60);
        var sec  = argument%60;
        if (hour < 10)
        {
            var sDatatime = day+":0"+hour;
        }
        else
        {
            var sDatatime = day+":"+hour;
        }
        if (mini < 10)
        {
             sDatatime = sDatatime+":0"+mini;
        } else 
        {
             sDatatime = sDatatime+":"+mini;
        }
        if (sec < 10)
        {
            sDatatime = sDatatime+":0"+sec;
        } else 
        {
            sDatatime = sDatatime+":"+sec;
        }
        return sDatatime;
    }
	/*function onMapSelectBeiJing (option){
		var cityDate=[];
    	$.ajax({
            url:"/v3/devlocation/getAllCityData",
            type: "GET",
            dataType: "json",
            success: function(data){
                $.each(data,function(index,iData){
                    cityDate.push(
                        {
                            "name":iData.name,
                            "value":iData.acnumber
                        }
                    );
                });
		
				var selectedProvince = '北京';
				option.series[1] = {
					name: 'AC',
					type: 'map',
					mapType: selectedProvince,
					itemStyle:{
						normal:{label:{show:true}},
						emphasis:{label:{show:true}}
					},
					mapLocation: {
						x: '55%'
					},
					roam: true,
					data:cityDate
				};
				option.legend = {
					x:'right',
					data:['AC']
				};
				option.tooltip={
					trigger: 'item',
					// formatter:"{a}<br/>{b}：{c}"
				};
				option.dataRange = {
					orient: 'horizontal',
					x: 'right',
					min: 0,
					max: total,
					color:['pink','lightblue'],
					text:['高','低'],           // 文本，默认为数值文本
					splitNumber:0
				};
				var oTheme={};
				$("#Province").echart("init", option,oTheme);	
			},
            error: function(){
               
            }
        });
	}*/

	function getAllCityDate(){
		var cityDate=[];
    	$.ajax({
            url:MyConfig.path+"/devlocation/getAllCityData",
            type: "GET",
            dataType: "json",
            success: function(data){
                $.each(data,function(index,iData){
                    cityDate.push(
                        {
                            "name":iData.name,
                            "value":iData.acnumber
                        }
                    );
                });
                
                return cityDate;
            },
            error: function(){
            	return cityDate;
            }
        });
	}

	function drawProvinceinfor ()
	{
		
		var apDate = [];
		total=0;
		$.ajax({
            url:MyConfig.path+"/devlocation/getAllProvinceData",
            type: "GET",
            dataType: "json",
            success: function(data){
                
                $.each(data,function(index,iData){
					apDate.push(
                        {
                            "name":iData.name,
                            "value":iData.apnumber
                        }
                    );

                    if (iData.acnumber > 0 && iData.name){
	                    if(!(iData.name.trim() == '局域网')){
	                    	total = total>=iData.acnumber ? total : iData.acnumber;
	                    	
	                    }
	                }
                });
                function onMapSelect (param){
                	function onSelectShow(param){
	                	var P = {"北京":1,"天津":1,"上海":1,"重庆":1,"河北":1,"云南":1,"河南":1,"湖南":1,"辽宁":1,"黑龙江":1,"新疆":1,"江苏":1,"山东":1,"安徽":1,"广西":1,"湖北":1,"江西":1,"内蒙古":1,"浙江":1,"山西":1,"甘肃":1,"吉林":1,"福建":1,"西藏":1,"陕西":1,"青海":1,"广东":1,"贵州":1,"四川":1,"澳门":1,"宁夏":1,"香港":1,"海南":1,"台湾":1};
	                	if (P[""+param.target]) {
	                		if (g_select == param.target) {  /*抛出重复点击相同省级行政区*/
		                		option.series.splice(1);
								gMychart.setOption(option, true);
								g_select = null;
		                		return false;
		                	}
		                	g_select = param.target;
		                	var cityDate_ap=[];
		                	$.ajax({
					            url:MyConfig.path+"/devlocation/getAllCityData",
					            type: "GET",
					            dataType: "json",
					            success: function(data){
					                $.each(data,function(index,iData){
										cityDate_ap.push(
		                                    {
		                                        "name":iData.name,
		                                        "value":iData.apnumber
		                                    }
		                                );
					                });
					                var selected = param.selected;
									var selectedProvince;
									var name;
									for (var i = 0, l = option.series[0].data.length; i < l; i++) {
										name = option.series[0].data[i].name;
										option.series[0].data[i].selected = selected[name];
										if (selected[name]) {
											selectedProvince = name;
										}
									}
									if (typeof selectedProvince == 'undefined') {
										option.series.splice(1);
										option.legend = null;
										option.dataRange = null;
										gMychart.setOption(option, true);
										return;
									}
									option.series[1] = {
										name: 'AP',
										type: 'map',
										mapType: selectedProvince,
										selectedMode : 'single',
										itemStyle:{
							                normal:{label:{show:true}},
							                emphasis:{
							                	label:{show:true},
							                	areaStyle:{
							                		color:'#9fca24'
							                	}
							                }
							            },
										mapLocation: {
											x: '55%'
										},
										roam: true,
										data:cityDate_ap
									};
									option.legend = {
										x:'right',
										data:['AP']
									};
									option.dataRange = {
										orient: 'horizontal',
										x: 'right',
										min: 0,
										max: total,
										color:['#00c4ff','#f8aa00'],
										text:['高','低'],
										textStyle:{
											color:'#e6e6e6',
											fontSize:12
										},          // 文本，默认为数值文本
										splitNumber:0,		         
						        		calculable : true
									};
									option.tooltip={
										trigger: 'item',
										// formatter:"{a}<br/>{b}：{c}"
									};
									option.mapList={
										onMapList:[],
									};
									var oTheme={};
									gMychart.setOption(option,true);

					            },
					            error: function(){
					               
					            }
					        });
						}
						else
						{
							$.ajax({
					            url:MyConfig.path+"/devlocation/getDevByCity",
					            type: "post",
					            dataType: "json",
					            contentType: 'application/json',
					            data:JSON.stringify({
					            	city:param.target
					            }),
					            success: function(data){

					            	var aData = [];
					            	$.each(data,function(index,iData){
					            		var sDatetime=getDevDatatime(iData.devOnlineTime);
					            		var otemp ={
									        "devSN":iData.devSN,
											"devMode":iData.devMode,
											"devSoftVersion":iData.devSoftVersion,
											"devHardVersion":iData.devHardVersion,
											"devOnlineTime":sDatetime,
											"cpuRatio":iData.cpuRatio+"",
											"memoryRatio":iData.memoryRatio          
									    };
									    aData.push(otemp);
					            	});
					            	
					            	g_jMList.SList("refresh", aData).resize();
	       							
	       							Utils.Base.openDlg(null, {}, {scope:$("#Dev_list"),className:"modal-super dashboard"});
                    				return false;
					            },
					            error: function(){
					               
					            }
					        });
						}
					}
                	clearTimeout(TimeFn);
                	TimeFn = setTimeout(onSelectShow(param),300);
				}

                var option = {
					height:500,
				    tooltip : {
				        trigger: 'item'
				    },
	    			series : [
	        			{
				            name: 'AP',
				            type: 'map',
				            mapType: 'china',
				            mapLocation: {
			                x: 'left',
			                y: 'top',
			                width: '40%'
			            	},
				            roam: false,
				            selectedMode : 'single',
				            itemStyle:{
				                normal:{label:{show:true}},
				                emphasis:{
				                	label:{show:true},
				                	areaStyle:{
				                		color:'#9fca24'
				                	}
				                }
				            },
			            data:apDate
	        			}
	        		],
	        		mapSelect:onMapSelect,
			        animation: false
				};
				var oTheme={};
				gMychart = $("#Province").echart("init", option,oTheme);
				var ppp = {"selected":{"北京":true},"target":"北京","type":"mapSelected","event":{"isTrusted":true,"zrenderFixed":1},"__echartsId":"1453083880258"};
				// onMapSelectBeiJing(option);
				onMapSelect(ppp);
            },
            error: function(){
               
            }
    	});
							
	}

	function initForm ()
	{
		var jForm = $("#device_detial");
		$("#dev_return",jForm).on("click",function()
		{
			Utils.Base.redirect ({np:"WDashboard.device_location"});
			return false;
		});
	}
	 
	
	function initProvinceData () {

		drawProvinceinfor();	
	}
	
	
	function initGrid()
	{
		var opt = {
			showHeader:true,
            colNames: getRcText("LIST_MONITOR"),
            colModel: [
                
                {name: "devSN", datatype: "String"},
				{name: "devMode", datatype: "String"},
				{name: "devSoftVersion", datatype: "String"},
				{name: "devHardVersion", datatype: "String"},
				{name: "devOnlineTime", datatype: "String"},
				{name: "cpuRatio", datatype: "String"},
				{name: "memoryRatio", datatype: "String"}
                // {name: "GroupName", datatype: "String"},
                // {name: "RadioInfo", datatype: "String"},
                // {name: "Status",datatype: "String",formatter:stateShow,showTip:false}
            ]
        };
        g_jMList.SList("head", opt);
	}

	function _init ()
	{
		g_jMList = $("#aps_all_list");
		initGrid();
		initForm();
		// initAreaData();
		initProvinceData();
		// initScatterData();
	}

	function _destroy ()
	{
		g_select = null;
	}

	Utils.Pages.regModule(MODULE_NAME, {
		"init": _init, 
		"destroy": _destroy, 
		"widgets": ["SList","Echart","Mlist"],
		"utils":["Request","Base"]
	});   
})( jQuery );