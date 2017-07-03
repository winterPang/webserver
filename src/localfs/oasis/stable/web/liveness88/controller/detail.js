define(['jquery','utils','echarts3','css!../css/index','bootstrap-daterangepicker', 'css!bootstrap_daterangepicker_css'],function ($,Utils,echarts) {
	// body...
	return ['$scope','$http','$state','$location','$rootScope',function($scope,$http,$state,$location,$rootScope){
			function getRcString(attrName){
	            return Utils.getRcString("liveness88_detail",attrName);
	        }
			var clientListUrl = Utils.getUrl('post', 'default', '/stamonitor/clienthistory', '/init/liveness88/clientDetail.json');
			var onlineClientUrl = Utils.getUrl('post', 'default', '/stamonitor/clientOnline', '/init/liveness88/clientDetail.json');
			function fnChengeTime(value) 
	        {
	            var nMsecond = parseInt(value);// 毫秒
	            var nSecond = 0;//秒
	            var nMinute = 0;// 分
	            var nHour = 0;// 小时
	            var nDay = 0; //天
	            var result = "";
	            if(nMsecond >= 1000) {
	                nSecond = parseInt(nMsecond/1000);
	                nMsecond = parseInt(nMsecond%1000);
	                if(nSecond >= 60) {
	                    nMinute = parseInt(nSecond/60);
	                    nSecond = parseInt(nSecond%60);
	                }
	                if(nMinute >= 60){
	                    nHour = parseInt(nMinute/60);
	                    nMinute = parseInt(nMinute%60);
	                }
	                if(nHour >= 24){
	                    nDay = parseInt(nHour/24);
	                    nHour = parseInt(nHour%24);
	                }
	            }
	            /*result = ""+parseInt(nSecond)+"秒";*/
	            if(nDay > 0 && nDay < 10)
	            {
	                result += "0"+parseInt(nDay)+"d:";
	            }else if(nDay > 10){
	                result += parseInt(nDay)+"d:";
	            }else{
	                result += "00"+"d:"
	            }
	            if(nHour > 0 && nHour <10) {
	                result += "0"+parseInt(nHour)+"h:";
	            }else if(nHour > 10){
	                result +=parseInt(nHour)+'h:'
	            }else{
	                result += "00"+"h:";
	            }
	            if(nMinute > 0 && nMinute < 10) {
	                result += "0"+parseInt(nMinute)+"m:";
	            }else if(nMinute>10){
	                result +=parseInt(nMinute)+"m:";
	            }else{
	                result += "00"+"m:"
	            }
	            if(nSecond > 0 && nSecond < 10) {
	                result += "0"+parseInt(nSecond)+"s";
	            }else if(nSecond > 10){
	                result +=parseInt(nSecond)+'s';
	            }else{
	                result +='00'+"s"
	            }
	            return result;
	        }

		    function handleResponseData(res){
		    	var clientResInfo = {};
		    	var clinetInfoArr = [];
		    	if(res.errCode == 0 && res.response){
		    		angular.forEach(res.response.clientInfo,function(v,k){
		    			var clientInfo = v;
		    			clientInfo.clientRxBytes = Utils.transformFlow('byte',true,v.clientRxBytes)
		    			clientInfo.clientTxBytes = Utils.transformFlow('byte',true,v.clientTxBytes)
		    			clientInfo.onlineTime = fnChengeTime(v.onlineTime);
		    			clientInfo.upLineDate = Utils.transformTimeStr('yyyy/mm/dd hh:MM:ss',v.upLineDate);
		    			clinetInfoArr.push(clientInfo);
		    		})
		    		clientResInfo.clientInfo = clinetInfoArr;
		    		clientResInfo.totalCount = res.response.count_total;
		    	}else{
		    		clientResInfo.clientInfo = [];
		    		clientResInfo.totalCount = 0;
		    	}
		    	return clientResInfo;
		    }
		    function handleResponseOnlineData(res){
		    	var onlineClientResInfo = {};
		    	var onlinecClinetInfoArr = [];
		    	if(res.retCode == 0 && res.msg){
		    		angular.forEach(res.msg,function(v,k){
		    			var clientInfo = v;
		    			clientInfo.clientRxBytes = Utils.transformFlow('byte',true,v.clientRxBytes)
		    			clientInfo.clientTxBytes = Utils.transformFlow('byte',true,v.clientTxBytes)
		    			clientInfo.onlineTime = fnChengeTime(v.onlineTime);
		    			clientInfo.upLineTime = Utils.transformTimeStr('yyyy/mm/dd hh:MM:ss',v.upLineTime);
		    			onlinecClinetInfoArr.push(clientInfo);
		    		})
		    		onlineClientResInfo.clientInfo = onlinecClinetInfoArr;
		    		onlineClientResInfo.totalCount = res.totalNum;
		    	}else{
		    		onlineClientResInfo.clientInfo = [];
		    		onlineClientResInfo.totalCount = 0;
		    	}
		    	return onlineClientResInfo;
		    }
		    var clientDetailListCols = getRcString("clientDetailListCols").split(",");
		    function refreshData(date){
		    	$scope.clientList = {
					tId:'clientDetailList',
					url:clientListUrl.url,
			        method:clientListUrl.method,
			        contentType:'application/json',
			        dataType:'json',
			        pageSize:10,
			        pageList:[10,20,50],
			        apiVersion:'v3',
			        searchable:false,
			        sidePagination:'server',
			        queryParams : function(param){
		    			//debugger
			    		var sortType = "";
			    		angular.forEach(param.sortoption,function(v,k){
			    			if(k == "onlineTime"){
			    				if(v == -1){
			    					sortType = "onlineTimeDesc";
			    				}else{
			    					sortType = "onlineTimeIncr";
			    				}
			    			}else if(k == "ApName"){
			    				if(v == -1){
			    					sortType = "ApNameDesc";
			    				}else{
			    					sortType = "ApNameIncr";
			    				}
			    			}else if(k == "clientRxBytes"){
			    				if(v == -1){
			    					sortType = "clientRxBytesDesc";
			    				}else{
			    					sortType = "clientRxBytesIncr";
			    				}
			    			}else if(k == "clientTxBytes"){
			    				if(v == -1){
			    					sortType = "clientTxBytesDesc";
			    				}else{
			    					sortType = "clientTxBytesIncr";
			    				}
			    			}
			    		})
			    		param.method = 'clientHistory';
			    		param.param  ={
			    			"scenarioId": $scope.sceneInfo.nasid,
						    "dateTime": new Date(date).toString(),
						    'skipNum':param.skipnum,
						    'limitNum':param.limitnum,
						    'sortType':sortType
			    		}
			   			delete param.findoption;
			   			delete param.sortoption;
			    		return param;
			    	},
			    	responseHandler :function(res){
			    		//debugger
			    		var tmp = handleResponseData(res);
			    		return tmp;
			    	},
			        dataField:'clientInfo',
			        totalField:'totalCount',
			        columns: [
			            {field: 'clientMAC', title: clientDetailListCols[0]},
			           	{field: 'clientIP', title:  clientDetailListCols[1]},
			            {sortable: true,field: 'clientRxBytes', title: clientDetailListCols[2]},
			            {sortable: true,field: 'clientTxBytes', title: clientDetailListCols[3]},
			            {field: 'clientVendor', title: clientDetailListCols[4]},
			            {sortable: true,field: 'ApName', title:clientDetailListCols[5]},
			            {sortable: true,field: 'onlineTime', title:clientDetailListCols[6]},
			            {field: 'NegoMaxRate', title:clientDetailListCols[7]},
			            {field: 'signalStrength', title:clientDetailListCols[8]},
			            {field: 'radioType', title:clientDetailListCols[9]},
			            {field: 'upLineDate', title:clientDetailListCols[10]}
			        ]
			    }
			    if(!$rootScope.$$phase) $scope.$apply();
		    };

		    refreshData(new Date());

		    function onlineData(){
		    	$scope.onlineClientList = {
					tId:'onlineClientList',
					url:onlineClientUrl.url,
			        method:onlineClientUrl.method,
			        contentType:'application/json',
			        dataType:'json',
			        pageSize:10,
			        pageList:[10,20,50],
			        apiVersion:'v3',
			        searchable:false,
			        sidePagination:'server',
			        queryParams : function(param){
		    			//debugger
			    		// var sortType = "";
			    		// angular.forEach(param.sortoption,function(v,k){
			    		// 	if(k == "onlineTime"){
			    		// 		if(v == -1){
			    		// 			sortType = "onlineTimeDesc";
			    		// 		}else{
			    		// 			sortType = "onlineTimeIncr";
			    		// 		}
			    		// 	}else if(k == "ApName"){
			    		// 		if(v == -1){
			    		// 			sortType = "ApNameDesc";
			    		// 		}else{
			    		// 			sortType = "ApNameIncr";
			    		// 		}
			    		// 	}else if(k == "clientRxBytes"){
			    		// 		if(v == -1){
			    		// 			sortType = "clientRxBytesDesc";
			    		// 		}else{
			    		// 			sortType = "clientRxBytesIncr";
			    		// 		}
			    		// 	}else if(k == "clientTxBytes"){
			    		// 		if(v == -1){
			    		// 			sortType = "clientTxBytesDesc";
			    		// 		}else{
			    		// 			sortType = "clientTxBytesIncr";
			    		// 		}
			    		// 	}
			    		// })
			    		param.method = 'getClientOnlineList';
			    		param.param  ={
			    			"scenarioId": $scope.sceneInfo.nasid,
						    // "dateTime": new Date(date).toString(),
						    'skipNum':param.skipnum,
						    'limitNum':param.limitnum,
						    // 'sortType':sortType
						    'sortoption':param.sortoption
			    		}
			   			delete param.findoption;
			   			delete param.sortoption;
			    		return param;
			    	},
			    	responseHandler :function(res){
			    		//debugger
			    		return handleResponseOnlineData(res);
			    	},
			        dataField:'clientInfo',
			        totalField:'totalCount',
			        columns: [
			            {field: 'clientMAC', title: clientDetailListCols[0]},
			           	{field: 'clientIP', title:  clientDetailListCols[1]},
			            {sortable: true,field: 'clientRxBytes', title: clientDetailListCols[2]},
			            {sortable: true,field: 'clientTxBytes', title: clientDetailListCols[3]},
			            {field: 'clientVendor', title: clientDetailListCols[4]},
			            {sortable: true,field: 'ApName', title:clientDetailListCols[5]},
			            {sortable: true,field: 'onlineTime', title:clientDetailListCols[6]},
			            {field: 'NegoMaxRate', title:clientDetailListCols[7]},
			            {field: 'signalStrength', title:clientDetailListCols[8]},
			            {field: 'radioType', title:clientDetailListCols[9]},
			            {field: 'upLineTime', title:clientDetailListCols[10]}
			        ]
			    }
			    if(!$rootScope.$$phase) $scope.$apply();
		    };
		    onlineData();
		    $scope.onReturn = function(){
				$state.go('^.liveness88');
		    }

		   var oDaterangeCN = {
		        locale : {
		        	format : 'YYYY/MM/DD',
		            applyLabel : getRcString("APPLY"),
		            cancelLabel: getRcString("CANCEL"),
		            daysOfWeek : getRcString("WEEK").split(','),
		            monthNames : getRcString("MONTH").split(",")
		        },
		        "singleDatePicker": true,
		        "opens": "left",
		        "maxDate":new Date(),
		        "minDate":new Date(new Date().getTime()-6*24*60*60*1000),
		        "dateLimit" : {
		            "days" : 1
		        },
		    };

		   $('#daterange').daterangepicker(oDaterangeCN,function(start, end, label){
		      // debugger
		      // start.format('YYYY/MM/DD');
		      refreshData(start.format('YYYY/MM/DD'))
		   });
		 /*********************************TabÒ³ÇÐ»»****************************************/
		  	$("#clientTab li").on('click',function(){
	            $("#clientTab li").removeClass('active');
	            $('.clientSection').hide();
	            $(this).addClass('active');
	            $("#"+$(this).attr('tag')).fadeIn();
	        });
		}
	];
})