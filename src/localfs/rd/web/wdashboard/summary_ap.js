;(function ($) {
	var MODULE_BASE = "wdashboard";
	var MODULE_NAME = MODULE_BASE + ".summary_ap";
	var g_oTimer = false;
	var oInfor = {};
	function getRcText (sRcName) 
	{
		return Utils.Base.getRcString("summary_rc",sRcName);
	}

	function inStatus(oInfo)
	{
		var sCode = "";
		var aStause = getRcText ("STATUS").split(",");
		switch(oInfo)
		{
				case 1:
					sCode = aStause[0];
					break;
				case 2:
					sCode = aStause[1];
					break;
				case 3:
					sCode = aStause[2];
					break;
				default:
					sCode = "-";
					break;
		}
		return sCode;
	}


	/*获取基于型号饼状图数据*/
	function initModelData()
	{
		var oApInfor = new Array();
		$.ajax({
			url:MyConfig.path+"/apmonitor/statistics_byapmodel",
			type: "GET",
			dataType: "json",
			success: function(data){

				var modelData = data.statistics || [];

				//按count进行降序处理
				if( modelData.length > 1){
					modelData.sort(compare('count'));
				}

				for(var i = 0; i < modelData.length ; i++)
				{
					var temp={
						name:modelData[i].apModel,
						value:modelData[i].count
					};
					oApInfor.push(temp);
					if( i == 9 ){
						break;
					}
				}

				//画图形
				drawModel(oApInfor);
			},
			error: function(){

			}
		});
	}

	/*基于型号饼状图*/
	function drawModel(oApInfor)
	{
		function getApList (ArrayT) 
		{
			var atemp = [];
				$.each(ArrayT,function(index,iArray){
					atemp.push(
							{
								"acSN":iArray.acSN,
								"apSN":iArray.apSN,
								"apName":iArray.apName,
								"apModel":iArray.apModel,
								"status":inStatus(iArray.status)
							}
						);
				});

				return atemp;
		}

		function onClickModelPie (oPiece) 
		{
			
			$.ajax({
				url:MyConfig.path+"/apmonitor/statistics_byapmodel_detail",
				type: "GET",
				dataType: "json",
				data:{
					apModel:oPiece.name,
					skipnum:0,
					limitnum:100000
				},
				success: function(data){
					var all=getApList(data.apList);
					$("#ApModelPopList").SList("refresh",all);
					Utils.Base.openDlg(null, {}, {scope:$("#ApModelPop_diag"),className:"modal-super dashboard"});
					return false;
				},
				error: function(){
				   
				}
			});
		}

		/* 饼状图参数 */
		 var option = {
		 	height:280,
		 	tooltip : {
		 		trigger: 'item',
		 		formatter: "{b} {a}{c} ({d}%)"
		 	},
		 	calculable : false,
		 	series : [
		 		{
		 			name:"AP数：",
		 			type:'pie',
		 			radius : ['30%','48%'],
		 			center: ['50%', '60%'],
		 			itemStyle: {
		 				normal: {
		 					labelLine:{
		 						length:10
		 					},
		 					label:
		 					{
		 						position:"outer",
		 						textStyle:{
		 								color: "#e6e6e6"
		 							},
		 						formatter: " {b} "
		 					}
		 				}
		 			},
		 			data: oApInfor
		 		}
		 	]
		 };
		 var oTheme={
		 		color: ['#0C6C61','#15AD9E','#65C9BF','#AEF4ED','#038DB0','#00CCFF','#4dC7F6','#89DBFB','#E9541D','#ED7931','#E4934D','#F6BA88','#E74D65','#F36E82']
		 };

		/*渲染图表*/
		$("#According_Model").echart("init", option,oTheme);
	}


	/*获取基于版本饼状图数据*/
	function initApverData()
	{
		var oOnApInfor = new Array();
		$.ajax({
			url:MyConfig.path+"/apmonitor/statistics_byapVer",
			type: "GET",
			dataType: "json",
			success: function(data){

				var versionData = data.statistics || [];

				//对数据里面按count降序处理
				if( versionData.length > 1){
					versionData.sort(compare('count'));
				}

				for(var i = 0; i < versionData.length ; i++)
				{
					var temp={
						name:versionData[i].softVersion,
						value:versionData[i].count
					};
					oOnApInfor.push(temp);
					if( i == 9){
						break;
					}
				}

				//画图
				drawApver(oOnApInfor);
			},
			error: function(){

			}
		});
	}

	/*基于版本饼状图*/
	function drawApver (oOnApInfor)
	{
		function getVerApList (ArrayT)
		{
			var atemp = [];
			$.each(ArrayT,function(index,iArray){
				atemp.push(
					{
						"acSN":iArray.acSN,
						"apSN":iArray.apSN,
						"apName":iArray.apName,
						"softVersion":iArray.softVersion,
						"status":inStatus(iArray.status)
					}
				);
			});

			return atemp;
		}

		function onClickApverPie (oPiece)
		{

			$.ajax({
				url:MyConfig.path+"/apmonitor/statistics_byapVer_detail",
				type: "GET",
				dataType: "json",
				data:{
					version:oPiece.name,
					skipnum:0,
					limitnum:100000
				},
				success: function(data){
					var all=getVerApList(data.apList);
					$("#VerPopList").SList("refresh",all);
					Utils.Base.openDlg(null, {}, {scope:$("#VerPop_diag"),className:"modal-super dashboard"});
					return false;
				},
				error: function(){

				}
			});
		}

		/* 饼状图 */
		var option = {
			height:280,
			tooltip : {
				trigger: 'item',
				formatter: "{b} {a}{c} ({d}%)"
			},
			calculable : false,
			series : [
				{
					name:"AP数：",
					type:'pie',
					radius : ['30%','48%'],
					center: ['50%', '60%'],
					itemStyle: {
						normal: {
							labelLine:{
								length:10
							},
							label:
							{
								position:"outer",
								textStyle:{
									color: "#e6e6e6"
								},
								formatter: " {b} "
							}
						}
					},
					data: oOnApInfor
				}
			]
		};

		$("#According_Apver").echart("init", option);
	}


	function drawOntime(oOntimeinfor) 
	{
		function getOnApList (ArrayT) 
		{
			var atemp = [];
				$.each(ArrayT,function(index,iArray){
					atemp.push(
							{
								"acSN":iArray.acSN,
								"apSN":iArray.apSN,
								"apName":iArray.apName,
								"onlineTime":iArray.onlineTime+'',
								"status":inStatus(iArray.status)
							}
						);
				});

				return atemp;
		}

		function onClickTypePie (oPiece) 
		{
			var oTimeList = {
                ">=3年":[86400*365*3,-1],
                "1年~3年":[86400*365,86400*365*3],
                "半年~1年":[86400*180,86400*365],
                "1月~半年":[86400*30,86400*180],
                "1周~1月":[86400*7,86400*30],
                "1天~1周":[86400,86400*7],
                "0~1天":[0,86400]
            };
 
            $.ajax({
                url:MyConfig.path+"/apmonitor/statistics_byapontime_detail",
                type: "GET",
                dataType: "json",
                data:{
                    mintime:oTimeList[oPiece.name][0],
                    maxtime:oTimeList[oPiece.name][1],
                    skipnum:0,
                    limitnum:100000
                },
                success: function(data){
                    
                    var all = getOnApList(data.apList);

                    $("#OnPopList").SList("refresh",all);
                    Utils.Base.openDlg(null, {}, {scope:$("#OnPop_diag"),className:"modal-super dashboard"});
                    return false;
                },
                error: function(){
                   
                }
            });
		}

		var aType = [
			{name:'>=3年',value:oOntimeinfor.cha6},
			{name:'1年~3年',value:oOntimeinfor.cha5},
			{name:'半年~1年',value:oOntimeinfor.cha4},
			{name:'1月~半年',value:oOntimeinfor.cha3},
			{name:'1周~1月',value:oOntimeinfor.cha2},
			{name:'1天~1周',value:oOntimeinfor.cha1},
			{name:'0~1天',value:oOntimeinfor.cha0}
		];

		var option = {
			height:280,
			tooltip : {
				trigger: 'item',
				formatter: "{b} {a}{c} ({d}%)"
			},
			calculable : false,
			series : [
				{
					name:"AP数：",
					type:'pie',
					radius : ['30%','48%'],
					center: ['50%', '60%'],
					itemStyle: {
						normal: {
							labelLine:{
								length:10
							},
							label:
							{
								position:"outer",
								textStyle:{
										color: "#e6e6e6"
									},
								formatter: " {b} "
							}
						}
					},
					data: aType
				}
			]
		};
		var oTheme={
				color: ['#15AD9E','#65C9BF','#4dC7F6','#E9541D','#E4934D','#F6BA88','#F36E82']   
		};
		oTheme.color.reverse();
		$("#According_ontime").echart("init", option,oTheme);
	}


	function drawUpflow(oFlowApInfor) 
	{
		function getOnApList (ArrayT) 
		{
			var atemp = [];
				$.each(ArrayT,function(index,iArray){
					atemp.push(
							{
								"acSN":iArray.acSN,
								"apSN":iArray.apSN,
								"apName":iArray.apName,
								"transmitTraffic":iArray.transmitTraffic+'',
								"status":inStatus(iArray.status)
							}
						);
				});

				return atemp;
		}

		function onClickFlowPie (oPiece) 
		{
			var oTimeList = {
                ">=200M":[1024*200,-1],
                "100M~200M":[1024*100,1024*200],
                "50M~100M":[1024*50,1024*100],
                "20M~50M":[1024*20,1024*50],
                "10M~20M":[1024*10,1024*10*10],
                "5M~10M":[1024*5,1024*10],
                "0~5M":[0,1024*5]
            };
 
            $.ajax({
                url:MyConfig.path+"/apmonitor/statistics_byapupflow_detail",
                type: "GET",
                dataType: "json",
                data:{
                    minflow:oTimeList[oPiece.name][0],
                    maxflow:oTimeList[oPiece.name][1],
                    skipnum:0,
                    limitnum:100000
                },
                success: function(data){
                    
                    var all = getOnApList(data.apList);

                    $("#FlowPopList").SList("refresh",all);
                    Utils.Base.openDlg(null, {}, {scope:$("#FlowPop_diag"),className:"modal-super dashboard"});
                    return false;
                },
                error: function(){
                   
                }
            });
		}

		var aType = [
			{name:'>=200M',value:oFlowApInfor.cha6},
			{name:'100M~200M',value:oFlowApInfor.cha5},
			{name:'50M~100M',value:oFlowApInfor.cha4},
			{name:'20M~50M',value:oFlowApInfor.cha3},
			{name:'10M~20M',value:oFlowApInfor.cha2},
			{name:'5M~10M',value:oFlowApInfor.cha1},
			{name:'0~5M',value:oFlowApInfor.cha0}
		];


		var option = {
			height:280,
			tooltip : {
				trigger: 'item',
				formatter: "{b} {a}{c} ({d}%)"
			},
			calculable : false,
			series : [
				{
					name:"AP数：",
					type:'pie',
					radius : ['30%','48%'],
					center: ['50%', '60%'],
					itemStyle: {
						normal: {
							labelLine:{
								length:10
							},
							label:
							{
								position:"outer",
								textStyle:{
										color: "#e6e6e6"
									},
								formatter: " {b} "
							}
						}
					},
					data: aType
				}
			]
		};
		var oTheme={
				color: ['#0C6C61','#15AD9E','#00CCFF','#4dC7F6','#ED7931','#E74D65','#F36E82']   
		};
		oTheme.color.reverse();
		$("#According_upflow").echart("init", option,oTheme);
	}

	function drawDownflow(oFlowApInfor) 
	{
		function getOnApList (ArrayT) 
		{
			var atemp = [];
				$.each(ArrayT,function(index,iArray){
					atemp.push(
							{
								"acSN":iArray.acSN,
								"apSN":iArray.apSN,
								"apName":iArray.apName,
								"receiveTraffic":iArray.receiveTraffic+'',
								"status":inStatus(iArray.status)
							}
						);
				});

				return atemp;
		}

		function onClickFlowPie (oPiece) 
		{
			var oTimeList = {
                ">=200M":[1024*1024*1024*10,-1],
                "100M~200M":[1024*1024*1024,1024*1024*1024*10],
                "50M~100M":[1024*1024*100,1024*1024*1024],
                "20M~50M":[1024*1024*10,1024*1024*100],
                "10M~20M":[1024*1024,1024*1024*10],
                "5M~10M":[1024*100,1024*1024],
                "0~5M":[0,1024*100]
            };
 
            $.ajax({
                url:MyConfig.path+"/apmonitor/statistics_byapdownflow_detail",
                type: "GET",
                dataType: "json",
                data:{
                    minflow:oTimeList[oPiece.name][0],
                    maxflow:oTimeList[oPiece.name][1],
                    skipnum:0,
                    limitnum:100000
                },
                success: function(data){
                    
                    var all = getOnApList(data.apList);

                    $("#DownPopList").SList("refresh",all);
                    Utils.Base.openDlg(null, {}, {scope:$("#DownPop_diag"),className:"modal-super dashboard"});
                    return false;
                },
                error: function(){
                   
                }
            });
		}

		var aType = [
			{name:'>=200M',value:oFlowApInfor.cha6},
			{name:'100M~200M',value:oFlowApInfor.cha5},
			{name:'50M~100M',value:oFlowApInfor.cha4},
			{name:'20M~50M',value:oFlowApInfor.cha3},
			{name:'10M~20M',value:oFlowApInfor.cha2},
			{name:'5M~10M',value:oFlowApInfor.cha1},
			{name:'0~5M',value:oFlowApInfor.cha0}
		];
		var option = {
			height:280,
			tooltip : {
				trigger: 'item',
				formatter: "{b} {a}{c} ({d}%)"
			},
			calculable : false,
			series : [
				{
					name:"AP数：",
					type:'pie',
					radius : ['30%','48%'],
					center: ['50%', '60%'],
					itemStyle: {
						normal: {
							labelLine:{
								length:10
							},
							label:
							{
								position:"outer",
								textStyle:{
										color: "#e6e6e6"
									},
								formatter: " {b} "
							}
						}
					},
					data: aType
				},
			]
		};
		var oTheme={
				color: ['#0C6C61','#15AD9E','#00CCFF','#4dC7F6','#ED7931','#E74D65','#F36E82']   
		};
		oTheme.color.reverse();
		$("#According_downflow").echart("init", option,oTheme);
	}

	function drawappacklostratio(oApInfor) 
	{
		function getOnApList (ArrayT) 
		{
			var atemp = [];
				$.each(ArrayT,function(index,iArray){
					atemp.push(
							{
								"acSN":iArray.acSN,
								"apSN":iArray.apSN,
								"apName":iArray.apName,
								"packLostRatio":iArray.packLostRatio+'',
								"status":inStatus(iArray.status)
							}
						);
				});

				return atemp;
		}

		function onClickFlowPie (oPiece) 
		{
			var oTimeList = {
                "70%~100%":[70,100],
                "50%~70%":[50,70],
                "20%~50%":[20,50],
                "10%~20%":[10,20],
                "5%~10%":[5,10],
                "1%~5%":[1,5],
                "0.5%~1%":[0.5,1],
                "0.1%~0.5%":[0.1,0.5],
                "0%~0.1%":[0,0.1]
            };
 
            $.ajax({
                url:MyConfig.path+"/apmonitor/statistics_byappacklostratio_detail",
                type: "GET",
                dataType: "json",
                data:{
                    minratio:oTimeList[oPiece.name][0],
                    maxratio:oTimeList[oPiece.name][1],
                    skipnum:0,
                    limitnum:100000
                },
                success: function(data){
                    
                    var all = getOnApList(data.apList);

                    $("#packRatioPopList").SList("refresh",all);
                    Utils.Base.openDlg(null, {}, {scope:$("#packRatioPop_diag"),className:"modal-super dashboard"});
                    return false;
                },
                error: function(){
                   
                }
            });
		}

		var aType = [
			{name:'70%~100%',value:oApInfor.cha8},
			{name:'50%~70%',value:oApInfor.cha7},
			{name:'20%~50%',value:oApInfor.cha6},
			{name:'10%~20%',value:oApInfor.cha5},
			{name:'5%~10%',value:oApInfor.cha4},
			{name:'1%~5%',value:oApInfor.cha3},
			{name:'0.5%~1%',value:oApInfor.cha2},
			{name:'0.1%~0.5%',value:oApInfor.cha1},
			{name:'0%~0.1%',value:oApInfor.cha0}
		];
		var option = {
			height:280,
			tooltip : {
				trigger: 'item',
				formatter: "{b} {a}{c} ({d}%)"
			},
			calculable : false,
			series : [
				{
					name:"AP数：",
					type:'pie',
					radius : ['30%','48%'],
					center: ['50%', '60%'],
					itemStyle: {
						normal: {
							labelLine:{
								length:10
							},
							label:
							{
								position:"outer",
								textStyle:{
										color: "#e6e6e6"
									},
								formatter: " {b} "
							}
						}
					},
					data: aType
				},
			]
		};
		var oTheme={
				color: ['#0C6C61','#15AD9E','#65C9BF','#AEF4ED','#038DB0','#00CCFF','#4dC7F6','#89DBFB','#E9541D','#ED7931','#E4934D','#F6BA88','#E74D65','#F36E82']   
		};
		oTheme.color.reverse();
		$("#According_packlostratio").echart("init", option,oTheme);
	}
	function drawappclient(oApInfor) 
	{
		function getOnApList (ArrayT) 
		{
			var atemp = [];
				$.each(ArrayT,function(index,iArray){
					atemp.push(
							{
								"apSN":iArray.apSN,
								"count":iArray.count+'',
							}
						);
				});

				return atemp;
		}

		function onClickappclientPie (oPiece) 
		{
			var oClientList = {
                ">=101":[101,-1],
                "81~101":[81,101],
                "61~81":[61,81],
                "41~61":[41,61],
                "21~41":[21,41],
                "11~21":[11,21],
                "0~11":[0,11]
            };
 
            $.ajax({
                url:MyConfig.path+"/stamonitor/statistic_byclientnumforap_detail",
                type: "GET",
                dataType: "json",
                data:{
                    mincount:oClientList[oPiece.name][0],
                    maxcount:oClientList[oPiece.name][1],
                    skipnum:0,
                    limitnum:100000
                },
                success: function(data){
                    
                    var all = getOnApList(data.apList);

                    $("#clientPopList").SList("refresh",all);
                    Utils.Base.openDlg(null, {}, {scope:$("#clientPop_diag"),className:"modal-super dashboard"});
                    return false;
                },
                error: function(){
                   
                }
            });
		}

		var aType = [
			{name:'>=101',value:oApInfor.cha6},
			{name:'81~101',value:oApInfor.cha5},
			{name:'61~81',value:oApInfor.cha4},
			{name:'41~61',value:oApInfor.cha3},
			{name:'21~41',value:oApInfor.cha2},
			{name:'11~21',value:oApInfor.cha1},
			{name:'0~11',value:oApInfor.cha0}
		];
		var option = {
			height:280,
			tooltip : {
				trigger: 'item',
				formatter: "{b} {a}{c} ({d}%)"
			},
			calculable : false,
			series : [
				{
					name:"AP数：",
					type:'pie',
					radius : ['30%','48%'],
					center: ['50%', '60%'],
					itemStyle: {
						normal: {
							labelLine:{
								length:10
							},
							label:
							{
								position:"outer",
								textStyle:{
										color: "#e6e6e6"
									},
								formatter: " {b} "
							}
						}
					},
					data: aType
				},
			]
		};
		var oTheme={
				color: ['#0C6C61','#15AD9E','#65C9BF','#AEF4ED','#038DB0','#00CCFF','#4dC7F6','#89DBFB','#E9541D','#ED7931','#E4934D','#F6BA88','#E74D65','#F36E82']   
		};
		oTheme.color.reverse();
		$("#According_client").echart("init", option,oTheme);
	}
	function drawapcpuratioData(oApInfor) 
	{
		function getOnApList (ArrayT) 
		{
			var atemp = [];
				$.each(ArrayT,function(index,iArray){
					atemp.push(
							{
								"acSN":iArray.acSN,
								"apSN":iArray.apSN,
								"apName":iArray.apName,
								"cpuRatio":iArray.cpuRatio+'',
								"status":inStatus(iArray.status)
							}
						);
				});

				return atemp;
		}

		function onClickFlowPie (oPiece) 
		{
			var oTimeList = {
                "90%~100%":[90,100],
                "80%~90%":[80,90],
                "60%~80%":[60,80],
                "40%~60%":[40,60],
                "20%~40%":[20,40],
                "5%~20%":[5,20],
                "0%~5%":[0,5]
            };
 
            $.ajax({
                url:MyConfig.path+"/apmonitor/statistics_byapcpuratio_detail",
                type: "GET",
                dataType: "json",
                data:{
                    minratio:oTimeList[oPiece.name][0],
                    maxratio:oTimeList[oPiece.name][1],
                    skipnum:0,
                    limitnum:100000
                },
                success: function(data){
                    
                    var all = getOnApList(data.apList);

                    $("#cpuRatioPopList").SList("refresh",all);
                    Utils.Base.openDlg(null, {}, {scope:$("#cpuRatioPop_diag"),className:"modal-super dashboard"});
                    return false;
                },
                error: function(){
                   
                }
            });
		}

		var aType = [
			{name:'90%~100%',value:oApInfor.cha6},
			{name:'80%~90%',value:oApInfor.cha5},
			{name:'60%~80%',value:oApInfor.cha4},
			{name:'40%~60%',value:oApInfor.cha3},
			{name:'20%~40%',value:oApInfor.cha2},
			{name:'5%~20%',value:oApInfor.cha1},
			{name:'0%~5%',value:oApInfor.cha0}
		];
		var option = {
			height:280,
			tooltip : {
				trigger: 'item',
				formatter: "{b} {a}{c} ({d}%)"
			},
			calculable : false,
			series : [
				{
					name:"AP数：",
					type:'pie',
					radius : ['30%','48%'],
					center: ['50%', '60%'],
					itemStyle: {
						normal: {
							labelLine:{
								length:10
							},
							label:
							{
								position:"outer",
								textStyle:{
										color: "#e6e6e6"
									},
								formatter: " {b} "
							}
						}
					},
					data: aType
				}
			]
		};
		var oTheme={
				color: ['#15AD9E','#AEF4ED','#038DB0','#89DBFB','#ED7931','#E4934D','#F36E82']   
		};
		$("#According_cpuratio").echart("init", option,oTheme);
	}

	function drawapmemratioData(oApInfor) 
	{
		function getOnApList (ArrayT) 
		{
			var atemp = [];
				$.each(ArrayT,function(index,iArray){
					atemp.push(
							{
								"acSN":iArray.acSN,
								"apSN":iArray.apSN,
								"apName":iArray.apName,
								"memoryRatio":iArray.memoryRatio+'',
								"status":inStatus(iArray.status)
							}
						);
				});

				return atemp;
		}

		function onClickFlowPie (oPiece) 
		{
			var oTimeList = {
                "95%~100%":[95,100],
                "85%~95%":[85,95],
                "65%~85%":[65,85],
                "50%~65%":[50,65],
                "30%~50%":[30,50],
                "10%~30%":[10,30],
                "0%~10%":[0,10]
            };
 
            $.ajax({
                url:MyConfig.path+"/apmonitor/statistics_byapmemratio_detail",
                type: "GET",
                dataType: "json",
                data:{
                    minratio:oTimeList[oPiece.name][0],
                    maxratio:oTimeList[oPiece.name][1],
                    skipnum:0,
                    limitnum:100000
                },
                success: function(data){
                    
                    var all = getOnApList(data.apList);

                    $("#memRatioPopList").SList("refresh",all);
                    Utils.Base.openDlg(null, {}, {scope:$("#memRatioPop_diag"),className:"modal-super dashboard"});
                    return false;
                },
                error: function(){
                   
                }
            });
		}

		var aType = [
			{name:'95%~100%',value:oApInfor.cha6},
			{name:'85%~95%',value:oApInfor.cha5},
			{name:'65%~85%',value:oApInfor.cha4},
			{name:'50%~65%',value:oApInfor.cha3},
			{name:'30%~50%',value:oApInfor.cha2},
			{name:'10%~30%',value:oApInfor.cha1},
			{name:'0%~10%',value:oApInfor.cha0}
		];


		var option = {
			height:280,
			tooltip : {
				trigger: 'item',
				formatter: "{b} {a}{c} ({d}%)"
			},
			calculable : false,
			series : [
				{
					name:"AP数：",
					type:'pie',
					radius : ['30%','48%'],
					center: ['50%', '60%'],
					itemStyle: {
						normal: {
							labelLine:{
								length:10
							},
							label:
							{
								position:"outer",
								textStyle:{
										color: "#e6e6e6"
									},
								formatter: " {b} "
							}
						}
					},
					data: aType
				}
			]
		};
		var oTheme={
				color: ['#15AD9E','#AEF4ED','#038DB0','#89DBFB','#ED7931','#E4934D','#F36E82']   
		};
		$("#According_memratio").echart("init", option,oTheme);
	}
	function initForm ()
	{
		$("#refresh_Model").on("click",initModelData);
		$("#refresh_ontime").on("click",initOntimeData);
		$("#refresh_APver").on("click",initApverData);
		$("#refresh_upflow").on("click",initUpflowData);
		$("#refresh_downflow").on("click",initDownflowData);
		$("#refresh_packlostratio").on("click",initappacklostratioData);
		$("#refresh_client").on("click",initappclientData);
		$("#refresh_cpuratio").on("click",initapcpuratioData);
		$("#refresh_memratio").on("click",initapmemratioData);

	   
	}

	/* 对对象数组按某一属性降序排序 */
	function compare(prop)
	{
		return function (obj1, obj2) {
			var val1 = obj1[prop];
			var val2 = obj2[prop];
			if (val1 < val2) {
				return 1;
			}
			else if (val1 > val2) {
				return -1;
			}
			else {
				return 0;
			}
		}
	}

	function initOntimeData() 
	{
		
		$.ajax({
				url:MyConfig.path+"/apmonitor/statistics_byapontime",
				type: "GET",
				dataType: "json",
				success: function(data){
						oOntimeinfor = {
							cha0:data.statistics[0].count,
							cha1:data.statistics[1].count,
							cha2:data.statistics[2].count,
							cha3:data.statistics[3].count,
							cha4:data.statistics[4].count,
							cha5:data.statistics[5].count,
							cha6:data.statistics[6].count
						}; 
					drawOntime(oOntimeinfor);  
				},
				error: function(){
				   
				}
		}); 
	}


	function initUpflowData() 
	{
		var oFlowApInfor=[];
		$.ajax({
				url:MyConfig.path+"/apmonitor/statistics_byapupflow",
				type: "GET",
				dataType: "json",
				success: function(data){
					oFlowApInfor = {
							cha0:data.statistics[0].count,
							cha1:data.statistics[1].count,
							cha2:data.statistics[2].count,
							cha3:data.statistics[3].count,
							cha4:data.statistics[4].count,
							cha5:data.statistics[5].count,
							cha6:data.statistics[6].count
						};
					drawUpflow(oFlowApInfor);  
				},
				error: function(){
				   
				}
		}); 
	}

	function initDownflowData() 
	{
		var oFlowApInfor=[];
		$.ajax({
				url:MyConfig.path+"/apmonitor/statistics_byapdownflow",
				type: "GET",
				dataType: "json",
				success: function(data){
					oFlowApInfor = {
							cha0:data.statistics[0].count,
							cha1:data.statistics[1].count,
							cha2:data.statistics[2].count,
							cha3:data.statistics[3].count,
							cha4:data.statistics[4].count,
							cha5:data.statistics[5].count,
							cha6:data.statistics[6].count
						};
					drawDownflow(oFlowApInfor);  
				},
				error: function(){
				   
				}
		}); 
	}

	function initappacklostratioData() 
	{
		var oFlowApInfor=[];
		$.ajax({
				url:MyConfig.path+"/apmonitor/statistics_byappacklostratio",
				type: "GET",
				dataType: "json",
				success: function(data){
					oApInfor = {
							cha0:data.statistics[0].count,
							cha1:data.statistics[1].count,
							cha2:data.statistics[2].count,
							cha3:data.statistics[3].count,
							cha4:data.statistics[4].count,
							cha5:data.statistics[5].count,
							cha6:data.statistics[6].count,
							cha7:data.statistics[7].count,
							cha8:data.statistics[8].count
						};
					drawappacklostratio(oApInfor);  
				},
				error: function(){
				   
				}
		}); 
	}

	function initappclientData() 
	{
		var oFlowApInfor=[];
		$.ajax({
				url:MyConfig.path+"/stamonitor/statistic_byclientnumforap",
				type: "GET",
				dataType: "json",
				success: function(data){
					oApInfor = {
							cha0:data.statistics[0].count,
							cha1:data.statistics[1].count,
							cha2:data.statistics[2].count,
							cha3:data.statistics[3].count,
							cha4:data.statistics[4].count,
							cha5:data.statistics[5].count,
							cha6:data.statistics[6].count
						};
					drawappclient(oApInfor);  
				},
				error: function(){
				   
				}
		}); 
	}
	function initapcpuratioData() 
	{
		var oFlowApInfor=[];
		$.ajax({
				url:MyConfig.path+"/apmonitor/statistics_byapcpuratio",
				type: "GET",
				dataType: "json",
				success: function(data){
					oApInfor = {
							cha0:data.statistics[0].count,
							cha1:data.statistics[1].count,
							cha2:data.statistics[2].count,
							cha3:data.statistics[3].count,
							cha4:data.statistics[4].count,
							cha5:data.statistics[5].count,
							cha6:data.statistics[6].count
						};
					drawapcpuratioData(oApInfor);  
				},
				error: function(){
				   
				}
		}); 
	}

	function initapmemratioData() 
	{
		var oFlowApInfor=[];
		$.ajax({
				url:MyConfig.path+"/apmonitor/statistics_byapmemratio",
				type: "GET",
				dataType: "json",
				success: function(data){
					oApInfor = {
							cha0:data.statistics[0].count,
							cha1:data.statistics[1].count,
							cha2:data.statistics[2].count,
							cha3:data.statistics[3].count,
							cha4:data.statistics[4].count,
							cha5:data.statistics[5].count,
							cha6:data.statistics[6].count
						};
					drawapmemratioData(oApInfor);  
				},
				error: function(){
				   
				}
		}); 
	}

	function initGrid()
	{
		var optApModelPop ={
			colNames:getRcText ("AP_DETAIL"),
			showHeader:true,
			colModel: [
				{name:"acSN",datatype:"String"},
				{name:"apSN",datatype:"String"},
				{name:"apName",datatype:"String"},
				{name:"apModel",datatype:"String"},
				{name:"status",datatype:"String"}
			]
		};
		$("#ApModelPopList").SList ("head",optApModelPop);

		var optOntimePop ={
			colNames:getRcText ("AP_OnDETAIL"),
			showHeader:true,
			colModel: [
				{name:"acSN",datatype:"String"},
				{name:"apSN",datatype:"String"},
				{name:"apName",datatype:"String"},
				{name:"onlineTime",datatype:"String"},
				{name:"status",datatype:"String"}
			]
		};
		$("#OnPopList").SList ("head",optOntimePop);

		var optVerPop ={
			colNames:getRcText ("AP_VerDETAIL"),
			showHeader:true,
			colModel: [
				{name:"acSN",datatype:"String"},
				{name:"apSN",datatype:"String"},
				{name:"apName",datatype:"String"},
				{name:"softVersion",datatype:"String"},
				{name:"status",datatype:"String"}
			]
		};
		$("#VerPopList").SList ("head",optVerPop);

		var optUpPop ={
			colNames:getRcText ("AP_UpDETAIL"),
			showHeader:true,
			colModel: [
				{name:"acSN",datatype:"String"},
				{name:"apSN",datatype:"String"},
				{name:"apName",datatype:"String"},
				{name:"transmitTraffic",datatype:"String"},
				{name:"status",datatype:"String"}
			]
		};
		$("#FlowPopList").SList ("head",optUpPop);

		var optDownPop ={
			colNames:getRcText ("AP_DownDETAIL"),
			showHeader:true,
			colModel: [
				{name:"acSN",datatype:"String"},
				{name:"apSN",datatype:"String"},
				{name:"apName",datatype:"String"},
				{name:"receiveTraffic",datatype:"String"},
				{name:"status",datatype:"String"}
			]
		};
		$("#DownPopList").SList ("head",optDownPop);

		var optpackRatioPop ={
			colNames:getRcText ("AP_packRatioDETAIL"),
			showHeader:true,
			colModel: [
				{name:"acSN",datatype:"String"},
				{name:"apSN",datatype:"String"},
				{name:"apName",datatype:"String"},
				{name:"packLostRatio",datatype:"String"},
				{name:"status",datatype:"String"}
			]
		};
		$("#packRatioPopList").SList ("head",optpackRatioPop);

		var optpackRatioPop ={
			colNames:getRcText ("AP_cpuRatioDETAIL"),
			showHeader:true,
			colModel: [
				{name:"acSN",datatype:"String"},
				{name:"apSN",datatype:"String"},
				{name:"apName",datatype:"String"},
				{name:"cpuRatio",datatype:"String"},
				{name:"status",datatype:"String"}
			]
		};
		$("#cpuRatioPopList").SList ("head",optpackRatioPop);

		var optmemRatioPop ={
			colNames:getRcText ("AP_memRatioDETAIL"),
			showHeader:true,
			colModel: [
				{name:"acSN",datatype:"String"},
				{name:"apSN",datatype:"String"},
				{name:"apName",datatype:"String"},
				{name:"memoryRatio",datatype:"String"},
				{name:"status",datatype:"String"}
			]
		};
		$("#memRatioPopList").SList ("head",optmemRatioPop);

		var optclientPop ={
			colNames:getRcText ("AP_clientDETAIL"),
			showHeader:true,
			colModel: [
				{name:"apSN",datatype:"String"},
				{name:"count",datatype:"String"}
			]
		};
		$("#clientPopList").SList ("head",optclientPop);
	}

	function _init ()
	{
		initGrid();
		initForm();
		initModelData();
		initOntimeData();
		initApverData();
		initUpflowData();
		initDownflowData();

		initappacklostratioData();
		initappclientData();
		initapcpuratioData();
		initapmemratioData();
	}

	function _destroy ()
	{
	}

	Utils.Pages.regModule(MODULE_NAME, {
		"init": _init, 
		"destroy": _destroy, 
		"widgets": ["SList","Echart"],
		"utils":["Request","Base"]
		// "subModules":[MODULE_NC]
	});   
})( jQuery );