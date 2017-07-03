;(function ($) {
	var MODULE_BASE = "b_device";
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

	function drawProvinceinfor (oAreainfor) 
	{
		
		var acDate = [];
		total=0;
		$.ajax({
            url:MyConfig.path+"/devlocation/getAllProvinceData",
            type: "GET",
            dataType: "json",
            success: function(data){
                
                // $.each(data,function(index,iData){                    
                //     acDate.push(
                //         {
                //             "name":iData.name,
                //             "value":iData.acnumber
                //         }
                //     );
                //     if(!(iData.name.trim() == '局域网')){
                //     	total = total>=iData.acnumber ? total : iData.acnumber;
                    	
                //     };

                // });
                var acDate =[{"name":"北京","value":8},{"name":"天津","value":0},{"name":"上海","value":0},{"name":"重庆","value":1},{"name":"河北","value":1},{"name":"云南","value":0},{"name":"河南","value":1},{"name":"湖南","value":0},{"name":"辽宁","value":0},{"name":"黑龙江","value":0},{"name":"新疆","value":1},{"name":"江苏","value":0},{"name":"山东","value":3},{"name":"安徽","value":1},{"name":"广西","value":0},{"name":"湖北","value":0},{"name":"江西","value":0},{"name":"内蒙古","value":0},{"name":"浙江","value":14},{"name":"山西","value":1},{"name":"甘肃","value":0},{"name":"吉林","value":0},{"name":"福建","value":0},{"name":"西藏","value":0},{"name":"陕西","value":1},{"name":"青海","value":1},{"name":"广东","value":0},{"name":"贵州","value":0},{"name":"四川","value":1},{"name":"澳门","value":0},{"name":"宁夏","value":0},{"name":"香港","value":0},{"name":"海南","value":1},{"name":"台湾","value":0},{"name":"局域网","value":0}];
                function onMapSelect (param){
                	function onSelectShow(param){
	                	var P = {"北京":1,"天津":1,"上海":1,"重庆":1,"河北":1,"云南":1,"河南":1,"湖南":1,"辽宁":1,"黑龙江":1,"新疆":1,"江苏":1,"山东":1,"安徽":1,"广西":1,"湖北":1,"江西":1,"内蒙古":1,"浙江":1,"山西":1,"甘肃":1,"吉林":1,"福建":1,"西藏":1,"陕西":1,"青海":1,"广东":1,"贵州":1,"四川":1,"澳门":1,"宁夏":1,"香港":1,"海南":1,"台湾":1};
	                	if (P[""+param.target]) {
	                		if (g_select == param.target) {  /*抛出重复点击相同省级行政区*/
		                		option.series.splice(1);
								gMychart.setOption(option, true);
								g_select = null;
		                		return false;
		                	};
		                	g_select = param.target;
	                		// $("#Dev_list").hide();
	                		// g_jMList.mlist("refresh", []);
		                	var cityDate=[];
		                	$.ajax({
					            url:MyConfig.path+"/devlocation/getAllCityData",
					            type: "GET",
					            dataType: "json",
					            success: function(data){
					                // $.each(data,function(index,iData){
		                   //              cityDate.push(
		                   //                  {
		                   //                      "name":iData.name,
		                   //                      "value":iData.acnumber
		                   //                  }
		                   //              );
					                // });
                                    cityDate =[{"name":"朝阳区","value":1},{"name":"杭州市","value":13},{"name":"西城区","value":1},{"name":"海淀区","value":1},{"name":"昌平区","value":1},{"name":"东城区","value":1},{"name":"成都市","value":1},{"name":"西宁市","value":1},{"name":"渝中区","value":1},{"name":"榆林市","value":1},{"name":"郑州市","value":1},{"name":"石家庄市","value":1},{"name":"太原市","value":1},{"name":"济南市","value":1}];
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
										name: 'AC',
										type: 'map',
										mapType: selectedProvince,
										selectedMode : 'single',
										itemStyle:{
										    normal:{
										    	label:{show:true},
				                                borderColor:'rgba(220,220,223,1)',
				                                borderWidth:1,
					                            areaStyle:{
					                                color: 'rgba(245,245,245,1)'
					                            }
			                        		},
	                        				emphasis:{
		                                        label:{show:true},
		                                        areaStyle:{
		                                            color:'rgba(242,188,152,0.4)'
		                                        }
	                                    	}
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
									option.color=["#4ec1b2"];
									option.dataRange = {
										orient: 'horizontal',
										x: 'right',
										min: 0,
										max: 14,
										color:['rgba(120,206,195,0.6)','rgba(245,245,245,1)'],
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
					            	// $("#Dev_list").show();

					            	var aData = [];
					      //       	$.each(data,function(index,iData){
					      //       		var sDatetime=getDevDatatime(iData.devOnlineTime);
					      //       		var otemp ={
									  //       "devSN":iData.devSN,
											// "devMode":iData.devMode,
											// "devSoftVersion":iData.devSoftVersion,
											// "devHardVersion":iData.devHardVersion,
											// "devOnlineTime":sDatetime,
											// "cpuRatio":iData.cpuRatio+"",
											// "memoryRatio":iData.memoryRatio          
									  //   };
									  //   aData.push(otemp);
					      //       	});
									aData=[{"devSN":"210235A1SQC15A000065","devMode":"H3C WAC350","devSoftVersion":"7.10","devHardVersion":"","devOnlineTime":"4:05:13:10","cpuRatio":"0","memoryRatio":0}]
					            	
					            	g_jMList.SList("refresh", aData).resize();
	       							
	       							Utils.Base.openDlg(null, {}, {scope:$("#Dev_list"),className:"modal-super dashboard"});
                    				return false;
					            },
					            error: function(){
					               
					            }
					        });
						};
					}
                	clearTimeout(TimeFn);
                	TimeFn = setTimeout(onSelectShow(param),300);
                
				}
                var option = {
					height:500,
				    
				    tooltip : {
				        trigger: 'item',
				    },
	    			series : [
	        			{
				            name: 'AC',
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
				               normal:{
				               		label:{show:true},
	                            	borderColor:'rgba(220,220,223,1)',
	                            	borderWidth:1,
	                            	areaStyle:{
	                                	color: 'rgba(245,245,245,1)'
	                            	}
	                			},
                				emphasis:{
                                    label:{show:true},
                                    areaStyle:{
                                        color:'rgba(242,188,152,0.4)'
                                    }
                            	}
				            },
			            data:acDate
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
			Utils.Base.redirect ({np:"b_device.device_location"});
			return false;
		});
	}
	 
	
	function initProvinceData () {
		// $.ajax({
	 //        url:"/v3/devlocation/getDevCount",
	 //        type: "GET",
	 //        dataType: "json",
	 //        success: function(data){
	 //            total=data.onlineCount; 
	 //            drawProvinceinfor();
	 //        },
	 //        error: function(){
	           
	 //        }
		// });
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