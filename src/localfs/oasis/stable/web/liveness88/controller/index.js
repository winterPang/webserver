define(['jquery', 'utils', 'echarts3', 'echartNodataPie','css!../css/index','liveness88/directive/wireless_count','liveness88/directive/wireless_less','liveness88/directive/noise_rate'], function ($, Utils, echarts) {
	// body...
	return ['$scope', '$http', '$state','$rootScope', function ($scope, $http, $state,$rootScope) {
		
		var onlineTrendUrl =  Utils.getUrl('post', 'default', '/stamonitor/monitor', '/init/liveness88/index.json');
		var clientFlowUrl =  Utils.getUrl('post', 'default', '/stamonitor/clientstreamvalue', '/init/liveness88/index.json');
		var onlineTimeUrl =  Utils.getUrl('post', 'default', '/stamonitor/clientOnline', '/init/liveness88/index.json');
		var flowTrendUrl =  Utils.getUrl('get', '', '/devmonitor/getwantrafficdayhistby10Min', '/init/liveness88/index.json');

		var onlineTimeEchart = echarts.init(document.getElementById('online_time'));
		var teminalFlowEchart = echarts.init(document.getElementById('teminal_flow'));
		Date.prototype.Format = function (fmt) {
            var o = {
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //日
                "h+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }

		function getRcString(attrName){
	        return Utils.getRcString("liveness88_index",attrName);
	    }
		window.onresize = function () {
			onlineTimeEchart.resize()
			teminalFlowEchart.resize()
		};
		var onlineTimePieOption = {
			color: ['rgb(242,188,152)', 'rgb(78,193,178)', 'rgb(79,196,246)', 'rgb(254,128,139)'],
			tooltip: {
				trigger: 'item',
				formatter: "{a} ：{b}({d}%)<br/>终端数 : {c} ",
				position:['50%', '50%']
			},
			legend: {
			    show:true,
                orient: 'horizontal',
                top: '85%',
                // bottom:'10%',
                // left: 'middle',
                itemWidth: 20,
                itemHeight: 12,
                textStyle: {
                    color: '#617085',
                    fontSize: 12,
                },
               data: [{ name: "< 0.5h", icon: 'pin' }, 
               { name: "0.5h-1h", icon: 'pin' }, 
               { name: "1h-4h", icon: 'pin' },
               { name:"> 4h", icon: 'pin'}
               ]
            },
			series: [
				{
					name: '在线时长',
					type: 'pie',
					center: ['45%', '45%'],
                    radius: ['45%', '75%'],
					avoidLabelOverlap: true,
					hoverAnimation: false,
					minAngle:3,
					label: {
						normal: {
							show: false,
							position: 'outside',
							// formatter:'{b} \n {c} ({d}%)'
							formatter:'{b}'
						}
						// emphasis: {
						// 	show: true,
						// 	textStyle: {
						// 		color: '#80878d',
						// 		fontStyle: 'normal',
						// 		fontWeight: 'bold',
						// 		fontFamily: 'SimSun',
						// 		fontSize: '20',
						// 	}
						// }
					},
					// labelLine: {
					// 	normal: {
					// 		show: true,
					// 		length: 5,
					// 		length2: 5,
					// 		smooth: true
					// 	}
					// },
					itemStyle: {
						normal: {
							borderColor: '#fff',
							borderWidth: 1,
							borderType: 'solid',

						},
					},
					data: []
				}
			]
		};

		$scope.clientByTimeOption = {
			mId: 'clientByTimeOption',
			title: getRcString('ClientByTimeOption'),
			autoClose: true,
			showCancel: false,
			showOk: false,
			modalSize: 'lg',
			showHeader: true,
			showFooter: false,
			showClose: true
		}
		var	clientByTimeListCols = getRcString('clientByTimeListCols').split(',');
		$scope.clientByTimeList = {
			tId: 'clientByTimeList',
			method: "post",
			contentType: 'application/json',
			dataType: 'json',
			pageSize: 5,
			pageList: [5, 10, 15],
			//apiVersion:'v3',
			searchable: true,
			//sidePagination:'server',
			dataField: 'clientData',
			totalField: 'totalCount',
			responseHandler:function(res){
				//debugger
				if(res.retCode == 0){
					angular.forEach(res.msg,function(v,k){
						v.onlineTime = Utils.transformOnlineTimeStr("ms",v.onlineTime)
					})
				}
				return res.msg;
			},	
			columns: [
				{ searcher: {}, sortable: true, field: 'clientMAC', title: clientByTimeListCols[0] },
				{ searcher: {}, sortable: true, field: 'clientIP', title: clientByTimeListCols[1] },
				{ searcher: {}, sortable: true, field: 'onlineTime', title: clientByTimeListCols[2] },
				{ searcher: {}, sortable: true, field: 'clientVendor', title: clientByTimeListCols[3] },
				{ searcher: {}, sortable: true, field: 'ApName', title: clientByTimeListCols[4] }
			]
		};

		onlineTimeEchart.on('click', function (params) {
			var flag = 0 ;
			if(params.name == "< 0.5h"){
				flag = 1;
			}else if(params.name == "0.5h-1h"){
				flag = 2;
			}else if(params.name == "1h-4h"){
				flag = 3;
			}else{
				flag = 4;
			}
			$scope.$broadcast('show#clientByTimeOption');
			$scope.$broadcast('hideSearcher#clientByTimeList', false);  //  实现了搜索表头的折叠
			$scope.$broadcast('refresh#clientByTimeList', {
				url: onlineTimeUrl.url,
				query:{
					"method":"clientOnlinetimeDistributeDetails",
					"param":{
						"nasId": $scope.sceneInfo.nasid,
        				"distributeTime": flag
					}
				}
			});
		});

		onlineTimeEchart.setOption(onlineTimePieOption);

		function refreshOnlinetimeEchart(){
			var requestObj = {
				method:onlineTimeUrl.method,
				url:onlineTimeUrl.url,
			    headers:{
			    	"Content-Type": "application/json",
			    	"Accept":"application/json"
			    }
			}
			var requestBody = {
			    "method":"clientOnlinetimeDistributeStat",
				"param":{
					"nasId":$scope.sceneInfo.nasid
				}		
			}
			onlineTrendUrl.method == "get" || onlineTrendUrl.method == "GET" 
			? requestObj.params = requestBody : requestObj.data = requestBody;

			$scope.showOnlineTimeNodataFlag = false;
			$http(requestObj).success(function (data) {
				var onlineTimeArr = [];
				if(data&&data.retCode == 0 && data.response){
					var onlineTimeObjHalfHour = {};
					var onlineTimeObjOneHour = {};
					var onlineTimeObjFourHours = {};
					var onlineTimeObjOverFourHours = {};
					// data.response.halfHour  = 10;
					// data.response.halfHour = 0;
					// data.response.oneHour = 0;
					// data.response.fourHours =0;
					// data.response.overFourHours =0;
					if(data.response.halfHour == 0&&data.response.oneHour == 0&&
						data.response.fourHours ==0&& data.response.overFourHours ==0){
						$scope.showOnlineTimeNodataFlag = true;
					}
					onlineTimeObjHalfHour.value = data.response.halfHour;
					onlineTimeObjHalfHour.name = "< 0.5h";
					onlineTimeObjOneHour.value = data.response.oneHour;
					onlineTimeObjOneHour.name = "0.5h-1h";
					onlineTimeObjFourHours.value = data.response.fourHours;
					onlineTimeObjFourHours.name = "1h-4h";
					onlineTimeObjOverFourHours.value = data.response.overFourHours;
					onlineTimeObjOverFourHours.name = "> 4h";
					onlineTimeArr.push(onlineTimeObjHalfHour);
					onlineTimeArr.push(onlineTimeObjOneHour);
					onlineTimeArr.push(onlineTimeObjFourHours);
					onlineTimeArr.push(onlineTimeObjOverFourHours);
					onlineTimePieOption.series[0].data = onlineTimeArr;
					onlineTimeEchart.setOption(onlineTimePieOption);
				}else{
					$scope.showOnlineTimeNodataFlag = true;
				}

			}).error(function(data){

			})
		}

		function formateTimeStr(v){
			if(!v) return false;
		    var unit = getRcString('TimeUnit').split(',');
			v = Number(v);
			var timeStr = "";
			if(v < 60 * 1000){
				timeStr = 1 + unit[2];
			}else if(v > 60*1000 &&v < 60*60*1000){
				timeStr = parseInt(v/(60*1000))+unit[2];
			}else if(v > 60*60*1000 && v < 24*60*60*1000){
				var hourStr = parseInt(v/(60*60*1000)) + unit[1];
				var minStr =  parseInt(v % (60*60*1000) / (60*1000)) + unit[2];
				timeStr = hourStr + minStr
			}else{
				var dayStr = parseInt(v/(24*60*60*1000)) + unit[0];
				var hourStr =  parseInt(v % (24*60*60*1000) / (60*60*1000)) + unit[1];
				timeStr = dayStr + hourStr
			}

			return timeStr;
		}

		function refreshOnlineTimeTop(){
			var requestObj = {
				method:onlineTimeUrl.method,
				url:onlineTimeUrl.url,
			    headers:{
			    	"Content-Type": "application/json",
			    	"Accept":"application/json"
			    }
			}
			var requestBody = {
			    "method":"clientOnlineInfosTop20",
				"param":{
					"nasId":$scope.sceneInfo.nasid
				}		
			}
			onlineTrendUrl.method == "get" || onlineTrendUrl.method == "GET" 
			? requestObj.params = requestBody : requestObj.data = requestBody;

			$http(requestObj).success(function (data) {
				// data = {"retCode":0,"errormsg":"","msg":[
				// 	{'clientMAC':'xx-xx-xx-xx','clientIP':'99.33.3.3','onlineTime':33333333,'clientVendor':'huawei','ApName':'ap1'},
				// 	{'clientMAC':'xx-xx-xx-xx','clientIP':'99.33.3.3','onlineTime':33122222,'clientVendor':'huawei','ApName':'ap1'},
				// 	{'clientMAC':'xx-xx-xx-xx','clientIP':'99.33.3.3','onlineTime':330333,'clientVendor':'huawei','ApName':'ap1'},
				// 	{'clientMAC':'xx-xx-xx-xx','clientIP':'99.33.3.3','onlineTime':233222,'clientVendor':'huawei','ApName':'ap1'},
				// 	{'clientMAC':'xx-xx-xx-xx','clientIP':'99.33.3.3','onlineTime':231333,'clientVendor':'huawei','ApName':'ap1'},
				// 	{'clientMAC':'xx-xx-xx-xx','clientIP':'99.33.3.3','onlineTime':131222,'clientVendor':'huawei','ApName':'ap1'},
				// 	{'clientMAC':'xx-xx-xx-xx','clientIP':'99.33.3.3','onlineTime':12333,'clientVendor':'huawei','ApName':'ap1'},
				// 	]
				// };
				if(data&&data.retCode == 0 && data.msg){
					var dealValArr =[];
					angular.forEach(data.msg,function(v,k){
						var dealValObj = {};
						
						dealValObj.titleText = v.clientMAC;
						dealValObj.titleValue = formateTimeStr(v.onlineTime);
						// dealValObj.titleValue = parseFloat(v.onlineTime / (60*60*1000)).toFixed(3);
						dealValObj.value = v.onlineTime;
						dealValArr.push(dealValObj);
					})
					$scope.onlineTimeTop = topHandel(dealValArr);
				}
			}).error(function(data){

			})
		}

		$scope.maxOnlinetimeVal = 0;
		$scope.averageOnlinetimeVal = 0;
		$scope.minOnlinetimeVal = 0;

		function refreshOnlineTimeMath(){
			var requestObj = {
				method:onlineTimeUrl.method,
				url:onlineTimeUrl.url,
			    headers:{
			    	"Content-Type": "application/json",
			    	"Accept":"application/json"
			    }
			}
			var requestBody = {
			    "method":"clientOnlinetimeMathStat",
				"param":{
					"nasId":$scope.sceneInfo.nasid
				}		
			}
			onlineTrendUrl.method == "get" || onlineTrendUrl.method == "GET" 
			? requestObj.params = requestBody : requestObj.data = requestBody;

			$http(requestObj).success(function (data) {
				// data = {"retCode":0,"msg":{
				// 	maxOnlineTime:323232323,avgOnlineTime:32323233,minOnlineTime:44444
				// 	}
				// };
				if(data.retCode == 0 && data.msg){
					var max = parseFloat(data.msg.maxOnlineTime/(60*60*1000)).toFixed(2);
					var average = parseFloat(data.msg.avgOnlineTime/(60*60*1000)).toFixed(2);
					var min = parseFloat(data.msg.minOnlineTime/(60*60*1000)).toFixed(2);
					var unit = getRcString('TimeUnit').split(',');
					var maxUnit = unit[1];
					var averageUnit = unit[1];
					var minUnit = unit[1];
					if(max >24) {
						max = parseFloat(max / 24).toFixed(2);
						maxUnit = unit[0];
					}
					if(average >24){
						average = parseFloat(average / 24).toFixed(2);
						averageUnit = unit[0];
					} 
					if(min >24){
						min = parseFloat(min / 24).toFixed(2);	
						minUnit =  unit[0];
					} 

					$scope.maxOnlinetimeVal = max;
					$scope.averageOnlinetimeVal = average;
					$scope.minOnlinetimeVal = min;
					$scope.maxOnlinetimeUnit  = maxUnit ;
					$scope.averageOnlinetimeUnit  = averageUnit ;
					$scope.minOnlinetimeUnit  = minUnit ;
				}
			}).error(function(error){

			})
		}

		refreshOnlineTimeMath();
		refreshOnlineTimeTop();
		refreshOnlinetimeEchart();

		$scope.clientByFlowOption = {
			mId: 'clientByFlowOption',
			title: getRcString('clientByFlowOption'),
			autoClose: true,
			showCancel: false,
			showOk: false,
			modalSize: 'lg',
			showHeader: true,
			showFooter: false,
			showClose: true
		}

		var teminalFlowPieOption = {
			color: ['rgb(242,188,152)', 'rgb(78,193,178)', 'rgb(79,196,246)', 'rgb(254,128,139)'],
			tooltip: {
				trigger: 'item',
				formatter: "{a} ：{b}({d}%)<br/>"+
				getRcString('teminalFlowFormatPie')+"：{c} ",
				position:['50%', '50%']
			},
			legend: {
			    show:true,
                orient: 'horizontal',
                top:'85%',
                itemWidth: 20,
                itemHeight: 12,
                textStyle: {
                    color: '#617085',
                    fontSize: 12,
                },
               data: [{ name: "<1MB", icon: 'pin' }, 
	               { name: "1MB<10MB", icon: 'pin' }, 
	               { name: ">10MB", icon: 'pin' }
               ]
            },
			series: [
				{
					name: getRcString('teminalFlowPieName'),
					type: 'pie',
					center: ['45%', '45%'],
                    radius: ['45%', '75%'],
					hoverAnimation: false,
					avoidLabelOverlap: true,
					minAngle:3,
					label: {
						normal: {
							show: false,
							position: 'outside',
							formatter:'{b}'
						}
					},
					itemStyle: {
                        normal: {
                            borderColor: '#fff',
                            borderWidth: 1,
                            borderType: 'solid',
                        }
                    },
					data: []
				}
			]
		};

		function handleResponseData(data){
			var resData = {};
			if(data && data.errCode == 0 && data.response){
				/*var resDataArr = [];
				angular.forEach(data.response,function(v,k){
					var teminalFlow = v;
				})*/
				angular.forEach(data.response.clientInfo,function(v,k){
					v.clientRxBytes = Utils.addComma(v.clientRxBytes,'memory',0,2);
				})

				resData.totalCount = data.response.count_total;
				resData.clientFlowData = data.response.clientInfo;
			}else{
				resData.totalCount = 0;
				resData.clientFlowData = [];
			}
			return resData;
		}

		teminalFlowEchart.on('click', function (params) {
			var streamType =  '';
			if(params.name == "<1MB"){
				streamType = "ltOneMB";
			}else if(params.name == "1MB<10MB"){
				streamType = "ltTenMB";
			}else{
				streamType = "gtTenMB";
			}
			$scope.$broadcast('show#clientByFlowOption');
			var clientByFlowListCols = getRcString("clientByFlowListCols").split(",");
			$scope.clientByFlowList = {
				tId: 'clientByFlowList',
				url:clientFlowUrl.url,
				method: "post",
				contentType: 'application/json',
				dataType: 'json',
				pageSize: 5,
				pageList: [5, 10, 15],
				apiVersion:'v3',
				queryParams : function(param){
			    		//debugger
			    		var sortType = "";
			    		angular.forEach(param.sortoption,function(v,k){
			    			if(k == "clientRxBytes"){
			    				if(v == -1){
			    					sortType = "clientRxBytesDesc";
			    				}else{
			    					sortType = "clientRxBytesIncr";
			    				}
			    			}
			    		})
			    		param.method = 'clientDownStreamDetailStat';
			    		param.param  ={
			    			"scenarioId": $scope.sceneInfo.nasid,
						    "streamType": streamType,
						    "skipNum": param.skipnum,
						    "limitNum": param.limitnum,
						    "sortType":sortType,
						    "findOpt":param.findoption
			    		};
			   			delete param.findoption;
			   			delete param.sortoption;
			   			delete param.skipnum;
			   			delete param.limitnum;
			    		return param;
			   },
				searchable:true,
				sidePagination:'server',
				responseHandler :function(res){
			    	return handleResponseData(res);
			    },
				dataField: 'clientFlowData',
				totalField: 'totalCount',
				columns: [
					{searcher: {}, sortable: false, field: 'clientMAC', title: clientByFlowListCols[0] },
					{sortable: false, field: 'clientIP', title: clientByFlowListCols[1] },
					{sortable: true, field: 'clientRxBytes', title: clientByFlowListCols[2] },
					{sortable: false, field: 'clientVendor', title: clientByFlowListCols[3] },
					{sortable: false, field: 'ApName', title: clientByFlowListCols[4] }
				]
			};
			$scope.$apply();
		});

		teminalFlowEchart.setOption(teminalFlowPieOption);

		function refreshTeminalFlowEchart(){
			var requestObj = {
				method:clientFlowUrl.method,
				url:clientFlowUrl.url,
			    headers:{
			    	"Content-Type": "application/json",
			    	"Accept":"application/json"
			    }
			}
			var requestBody = {
			    "method":"clientDownStreamDistributeStat",
				"param":{
					"scenarioid":$scope.sceneInfo.nasid
				}		
			}
			onlineTrendUrl.method == "get" || onlineTrendUrl.method == "GET" 
			? requestObj.params = requestBody : requestObj.data = requestBody;

			$scope.showTeminalFlowNodataFlag = false;
			$http(requestObj).success(function (data) {
				//debugger
				var terminalFlowArr = [];
				if(data.errCode == 0 && data.response){
					var terminalFlowObjOne = {};
					var terminalFlowObjTwo = {};
					var terminalFlowObjThree = {};
					//data.response.ltOneMBCount = 10;
					if(data.response.ltOneMBCount == 0 && data.response.ltTenMBCount ==0 
						&&data.response.gtTenMBCount == 0){
						$scope.showTeminalFlowNodataFlag = true;
					}
					terminalFlowObjOne.value = data.response.ltOneMBCount;
					terminalFlowObjOne.name = "<1MB";
					terminalFlowObjTwo.value = data.response.ltTenMBCount;
					terminalFlowObjTwo.name = "1MB<10MB";
					terminalFlowObjThree.value = data.response.gtTenMBCount;
					terminalFlowObjThree.name = ">10MB";
					
					terminalFlowArr.push(terminalFlowObjOne);
					terminalFlowArr.push(terminalFlowObjTwo);
					terminalFlowArr.push(terminalFlowObjThree);
				}else{
					$scope.showTeminalFlowNodataFlag = true;
				}
				// terminalFlowArr = [
				// 		{
				// 			name : '<1MB',
				// 			value:1
				// 		},
				// 		{
				// 			name : '1MB<10MB',
				// 			value:1
				// 		},
				// 		{
				// 			name : '>10MB',
				// 			value:1111111
				// 		}
				// 	]
				teminalFlowPieOption.series[0].data = terminalFlowArr;
				teminalFlowEchart.setOption(teminalFlowPieOption);
			}).error(function(data){
				//debugger
			})
		}

		function topHandel(data){
			var colorArr = ["top-one","top-two","top-three","top-four","top-five","top-six","top-seven"];
			var topHandelArr = [];
			var valueCount =  Number(data[0]&&data[0].value);
			angular.forEach(data,function(v,k){
				var topValue = {};
				if(k > 6) return;
				//valueCount = Number(data[0].titleValue);
				topValue.titleText = v.titleText;
				topValue.titleValue = v.titleValue;
				topValue.value = v.value;
				topValue.color = colorArr[k];
				topHandelArr.push(topValue);
			})
			angular.forEach(topHandelArr,function(v,k){
				//v.percent = parseInt(Number(v.titleValue)/valueCount * 100) +"%"
				v.percent = parseInt(Number(v.value)/valueCount * 100) +"%"
			})
			return topHandelArr;
		}

		function refreshTermianlFlowTop(){
			var requestObj = {
				method:clientFlowUrl.method,
				url:clientFlowUrl.url,
			    headers:{
			    	"Content-Type": "application/json",
			    	"Accept":"application/json"
			    }
			}
			var requestBody = {
			    "method":"clientDownStream",
				"param":{
					"scenarioid":$scope.sceneInfo.nasid
				}		
			}
			onlineTrendUrl.method == "get" || onlineTrendUrl.method == "GET" 
			? requestObj.params = requestBody : requestObj.data = requestBody
			$http(requestObj).success(function (data) {
				// data = {"errCode":0,"msg":"","response":[
				// 	{'clientMac':'xx-xx-xx-xx','clientIP':'99.33.3.3','clientRxBytes':23122222223,'clientVendorEn':'华为','clientVendor':'huawei','APName':'ap1'},
				// 	{'clientMac':'xx-xx-xx-xx','clientIP':'99.33.3.3','clientRxBytes':3313443433,'clientVendorEn':'华为','clientVendor':'huawei','APName':'ap1'},
				// 	{'clientMac':'xx-xx-xx-xx','clientIP':'99.33.3.3','clientRxBytes':1231111111,'clientVendorEn':'华为','clientVendor':'huawei','APName':'ap1'},
				// 	{'clientMac':'xx-xx-xx-xx','clientIP':'99.33.3.3','clientRxBytes':23312222,'clientVendorEn':'华为','clientVendor':'huawei','APName':'ap1'},
				// 	{'clientMac':'xx-xx-xx-xx','clientIP':'99.33.3.3','clientRxBytes':2312222,'clientVendorEn':'华为','clientVendor':'huawei','APName':'ap1'},
				// 	{'clientMac':'xx-xx-xx-xx','clientIP':'99.33.3.3','clientRxBytes':1312323,'clientVendorEn':'华为','clientVendor':'huawei','APName':'ap1'},
				// 	{'clientMac':'xx-xx-xx-xx','clientIP':'99.33.3.3','clientRxBytes':1231111,'clientVendorEn':'华为','clientVendor':'huawei','APName':'ap1'},
				// 	]
				// };
				if(data.errCode == 0 && data.response){
					var dealValArr =[];
					angular.forEach(data.response,function(v,k){
						var dealValObj = {};
						dealValObj.titleText = v.clientMAC;
						dealValObj.titleValue = Utils.transformFlow('byte',true,v.clientRxBytes);//(v.clientRxBytes/(1024*1024)).toFixed(3);
						dealValObj.value = v.clientRxBytes;
						dealValArr.push(dealValObj);
					})
					$scope.terminalFlowTop = topHandel(dealValArr);
				}

			}).error(function(data){

			})
		}

		$scope.maxTeminalFlowVal = 0;
		$scope.averageTeminalFlowVal = 0;
		$scope.minTeminalFlowVal = 0;
		function refreshMaxTerminalFlow(){
			var requestObj = {
				method:clientFlowUrl.method,
				url:clientFlowUrl.url,
			    headers:{
			    	"Content-Type": "application/json",
			    	"Accept":"application/json"
			    }
			}
			var requestBody = {
			    "method":"clientDownStreamMathStat",
				"param":{
					"scenarioid":$scope.sceneInfo.nasid
				}		
			}
			onlineTrendUrl.method == "get" || onlineTrendUrl.method == "GET" 
			? requestObj.params = requestBody : requestObj.data = requestBody
			$http(requestObj).success(function (data) {
				// data = {"errCode":0,"msg":"","response":{
				// 	max:0,avg:0,min:0
				// }};
				if(data.errCode == 0 && data.response){
					var max = Utils.transformFlow('byte',true,data.response.max);
					var average = Utils.transformFlow('byte',true,data.response.avg);
					var min = Utils.transformFlow('byte',true,data.response.min);
					$scope.maxTeminalFlowVal = max.substring(0,max.search(/\(/));
					$scope.maxTeminalFlowUnit = max.substring(max.search(/\(/)+1,max.search(/\)/));
					$scope.averageTeminalFlowVal = average.substring(0,average.search(/\(/));
					$scope.averageTeminalFlowUnit = average.substring(average.search(/\(/)+1,average.search(/\)/));
					$scope.minTeminalFlowVal = min.substring(0,min.search(/\(/));
					$scope.minTeminalFlowUnit = min.substring(min.search(/\(/)+1,min.search(/\)/));
				}
			}).error(function(data){
	
			})
		}
		refreshMaxTerminalFlow();
		refreshTermianlFlowTop();
		refreshTeminalFlowEchart();
	}]
});  