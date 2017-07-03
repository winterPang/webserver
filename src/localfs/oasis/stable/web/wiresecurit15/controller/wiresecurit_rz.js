define(['jquery','utils','echarts','angular-ui-router','bootstrap-daterangepicker','bsTable','css!bootstrap_daterangepicker_css','css!wiresecurit15/css/style'],function($scope,Utils,echarts) {
    return ['$scope', '$http','$state','$window',function($scope,$http,$state,$window){
    	var g_daterange = "";
        var g_nEndTime = 0;
        var g_nStartTime = 0;
        var g_strStartDate = "";
        var g_strEndDate = "";
    	var g_strTime = "aDay";
    	var g_strClassify = "Attack";
    	var g_attackList    = [];
	    var g_apList        = [];
	    var g_clientList    = [];
    	var con_Time = ["aDay", "aWeek", "aMonth", "aYear", "otherTime"];
    	var g_Type 			= getRcString("ATTACK-TYPE").split(",");
	    var stationClassify = getRcString("STATION-CLASSIFY").split(",");
	    var g_allAttack = [getRcString("ATTACK-NAME-ONE").split(","), getRcString("ATTACK-NAME-TWO").split(","), 
                getRcString("ATTACK-NAME-THREE").split(",")];
    	var devSN = $scope.sceneInfo.sn;
        var oDaterangeCN = {
            locale : {  
            applyLabel : getRcString("APPLY"),
            cancelLabel: getRcString("CANCEL"),
            daysOfWeek : getRcString("WEEK").split(','),  
            monthNames : getRcString("MONTH").split(","),
        }};
        var attackUrl = Utils.getUrl('POST', '', '/ant/read_wips_statistics', '/init/wiresecurit/attack_info_list.json');
        var apUrl = Utils.getUrl('POST', '', '/ant/read_wips_ap', '/init/wiresecurit/ap_info_list.json');
        var clientUrl = Utils.getUrl('POST', '', '/ant/read_wips_client', '/init/wiresecurit/client_info_list.json');

        $scope.isDay = true;
        $scope.isWeek = false;
        $scope.isMonth = false;
        $scope.isYear = false;
        $scope.isOther = false;

    	var attackUrl = Utils.getUrl('POST', '', '/ant/read_wips_statistics', '/init/wiresecurit/attack_info_list.json');
		var apUrl = Utils.getUrl('POST', '', '/ant/read_wips_ap', '/init/wiresecurit/ap_info_list.json');
		var clientUrl = Utils.getUrl('POST', '', '/ant/read_wips_client', '/init/wiresecurit/client_info_list.json');

		function getRcString(attrName) {
            return Utils.getRcString("wiresecurit_rz_rc",attrName);
        }

        $scope.return = function() {
            $window.history.back();
        }

        $('#daterange').daterangepicker(oDaterangeCN, function(start, end, label) {
            g_strStartDate = start.format('YYYY/MM/DD');
            g_strEndDate = end.format('YYYY/MM/DD');
            g_daterange = g_strStartDate + ' - ' + g_strEndDate;

            // $scope.$apply(function() {});
            g_strTime = "otherTime";
            $scope.initViewsByTime("otherTime");
        }).on('apply.daterangepicker', function(e, date) {
            g_strStartDate = date.startDate.format('YYYY/MM/DD')
            g_strEndDate = date.endDate.format('YYYY/MM/DD');
            var strDaterange = g_strStartDate + ' - ' + g_strEndDate;
            //选择相同日期 不刷新页面
            if(strDaterange == g_daterange) {
                return;
            }
            g_daterange = strDaterange;

            g_strTime = "otherTime";
            $scope.initViewsByTime("otherTime");
        });

        function getOtherRangeTime() {
            var nStartYear  = Number(g_strStartDate.slice(0, 4));
            var nStartMonth = Number(g_strStartDate.slice(5, 7)) - 1;
            var nStartDay   = Number(g_strStartDate.slice(8));
            var nEndYear  = Number(g_strEndDate.slice(0, 4));
            var nEndMonth = Number(g_strEndDate.slice(5, 7)) - 1;
            var nEndDay   = Number(g_strEndDate.slice(8));
            var nDayTime  = 24 * 60 * 60;

            g_nStartTime = parseInt((new Date(nStartYear, nStartMonth, nStartDay)).getTime() / 1000);
            g_nEndTime   = parseInt((new Date(nEndYear, nEndMonth, nEndDay)).getTime() / 1000 + nDayTime);
        }
        //获得开始时间和结束时间
        function getRangeTime(strTime) {
            var nHourTime = 60 * 60;
            var nDayTime = 24 * nHourTime;
            var nWeekTime = 7 * nDayTime;
            var nMonthTime = 30 * nDayTime;
            var nYearTime = 365 * nDayTime;
            var strCurrentDate = new Date().toLocaleDateString();   //获得今天年月日
            var nTodayZeroTime = Math.round((new Date(strCurrentDate).getTime() - 0)  / 1000);   //获得今天零时的时间

            g_nEndTime = nTodayZeroTime;

            switch(strTime) {
                case con_Time[0]: {
                    g_nStartTime = nTodayZeroTime;
                    g_nEndTime = nTodayZeroTime + nDayTime;
                    break;
                }
                case con_Time[1]: {
                    g_nStartTime = nTodayZeroTime + nDayTime - nWeekTime;
                    break;
                }
                case con_Time[2]: {
                    g_nStartTime = nTodayZeroTime + nDayTime - nMonthTime;
                    break;
                }
                case con_Time[3]: {
                    g_nStartTime = nTodayZeroTime + nDayTime - nYearTime;
                    break;
                }
                case con_Time[4]: {
                    getOtherRangeTime();
                    break;
                }
                default: {
                    console.log("Select time range error");
                    break;
                }
            }
        }

        function dealTimeByTen(nNum) {
            return Number(nNum) < 10 ? ('0' + nNum) : nNum;
        }

        function dealTimeFun(nTmpDate){
            var oDate = new Date(nTmpDate);
            var nYear = oDate.getFullYear();
            var nMonth = dealTimeByTen(oDate.getMonth() + 1);
            var nDate = dealTimeByTen(oDate.getDate());
            var nHours = dealTimeByTen(oDate.getHours());
            var nMinutes = dealTimeByTen(oDate.getMinutes());
            var nSeconds = dealTimeByTen(oDate.getSeconds());

            return nYear + '/' + nMonth + '/' + nDate + ' ' + nHours + ':' + nMinutes + ':' + nSeconds;
        }

        function httpAttackInfoList() {
        	function successAckList(data){
	        	var message = data.message || [];
	        	g_attackList = [];

	            for(var i = 0; i < message.length; i++) {
	                g_attackList[i] = {};
	                g_attackList[i].ReportTime = dealTimeFun(Number(message[i].ReportTime) * 1000);
	                g_attackList[i].SensorName = message[i].SensorName;
	                g_attackList[i].SrcMacAddress = message[i].SrcMacAddress || "-";
	                g_attackList[i].Classify = g_Type[message[i].Type] || "g_notClassified";
	                g_attackList[i].Count = message[i].Count;
	                g_attackList[i].Detail = g_allAttack[message[i].Type]?(g_allAttack[message[i].Type][message[i].SubType] || "g_notClassified"):"g_notClassified";

	            }
	            
	            $scope.$broadcast('load#attackslist',g_attackList);
	        }

        	$http({
	            url:attackUrl.url, 
	            method:attackUrl.method,
	            data:{
	                Method:"GetAttack",
	                Param: {
	                    ACSN: devSN,
	                    StartTime : g_nStartTime,
	                    EndTime :g_nEndTime,
	                }
	            }
	        }).success(function(data,header,config,status) {
	            successAckList(data);
	        }).error(function(data,header,config,status) {
	            console.log("Show attack information list error!");
	        });
        }

        function httpClientInfoList() {
        	function successClientList(data){
	        	var message = data.message || [];
	            for(var i = 0; i < message.length; i++) {
	                message[i].ClassifyType = stationClassify[message[i].ClassifyType] || "g_notClassified";
	                message[i].LastReportTime = dealTimeFun(Number(message[i].LastReportTime) * 1000);
	            }
	            g_clientList = message;
	            
	            $scope.$broadcast('load#clientslist', g_clientList);
	        }

        	$http({
	            url:clientUrl.url, 
	            method:clientUrl.method,
	            data:{
	                Method:"GetStationInfo",
	                Param: {
	                    ACSN: devSN,
	                    StartTime : g_nStartTime,
	                    EndTime :g_nEndTime,
	                },
	                Return:[
	                    "MacAddress",
	                    "ClassifyType",
	                    "LastReportTime"
	                ]
	            }
	        }).success(function(data,header,config,status) {
	            successClientList(data);
	        }).error(function(data,header,config,status) {
	            console.log("Show client information list error!");
	        });
        }

        function httpApInfoList() {
	        function successApList(data)
	        {
	        	var message = data.message ||[];
	            for(var i = 0; i < message.length; i++) {
	                message[i].ClassifyType = stationClassify[message[i].ClassifyType] || "g_notClassified";
	                message[i].LastReportTime = dealTimeFun(Number(message[i].LastReportTime) * 1000);
	            }
	            g_apList = message;

	            $scope.$broadcast('load#apslist',g_apList);
	        }

        	$http({
	            url:apUrl.url, 
	            method:apUrl.method,
	            data:{
	                Method:"GetStationInfo",
	                Param: {
	                    ACSN: devSN,
	                    StartTime : g_nStartTime,
	                    EndTime :g_nEndTime,
	                },
	                Return:[
	                    "MacAddress",
	                    "ClassifyType",
	                    "LastReportTime"
	                ]
	            }
	        }).success(function(data,header,config,status) {
	            successApList(data);
	        }).error(function(data,header,config,status) {
	            console.log("Show ap list information error!");
	        });
        }

	    function attackInfoHead() {
	    	var aName = getRcString("LIST-HEADER").split(",");

	    	$scope.attckOption = {
	            tId:'attackslist',
	            pageSize:12,
	            pageList:[12,24],
	            columns: [
	                {sortable: true, field: 'SensorName', title: aName[0]},
	                {sortable: true, field: 'SrcMacAddress', title: aName[1]},
	                {sortable: true, field: 'Classify', title: aName[2]},
	                {sortable: true, field: 'Detail', title: aName[3]},
	                {sortable: true, field: 'Count', title: aName[4]},
	                {sortable: true, field: 'ReportTime', title: aName[5]}
            	]
        	};
	    }

	    function clientInfoHead() {
	    	var aName = getRcString("STATION-HEADER").split(",");

	    	$scope.clientOption = {
	    		tId:'clientslist',
	            pageSize:12,
	            pageList:[12,24],
	            columns: [
	                {sortable: true, field: 'MacAddress', title: aName[0]},
	                {sortable: true, field: 'ClassifyType', title: aName[1]},
	                {sortable: true, field: 'LastReportTime', title: aName[2]}
            	]
        	};
	    }

	    function apInfoHead() {
	    	var aName = getRcString("STATION-HEADER").split(",");

	    	$scope.apOption = {
	            tId:'apslist',
	            pageSize:12,
	            pageList:[12,24],
	            columns: [
	                {sortable: true, field: 'MacAddress', title: aName[0]},
	                {sortable: true, field: 'ClassifyType', title: aName[1]},
	                {sortable: true, field: 'LastReportTime', title: aName[2]}
            	]
        	};
        }
        
        $scope.initViewsByTime = function(strTime) {
        	g_strTime = strTime;

        	switch(strTime) {
        		case "aDay": {
                    $scope.isDay = true;
                    $scope.isWeek = false;
                    $scope.isMonth = false;
                    $scope.isYear = false;
                    $scope.isOther = false;
                    g_daterange = "";
        			break;
        		}
        		case "aWeek": {
                    $scope.isDay = false;
                    $scope.isWeek = true;
                    $scope.isMonth = false;
                    $scope.isYear = false;
                    $scope.isOther = false;
                    g_daterange = ""; 
        			break;
        		}
        		case "aMonth": {
                    $scope.isDay = false;
                    $scope.isWeek = false;
                    $scope.isMonth = true;
                    $scope.isYear = false;
                    $scope.isOther = false;
                    g_daterange = ""; 
        			break;
        		}
        		case "aYear": {
                    $scope.isDay = false;
                    $scope.isWeek = false;
                    $scope.isMonth = false;
                    $scope.isYear = true;
                    $scope.isOther = false;
                    g_daterange = "";
        			break;
        		}
                case "otherTime": {
                    $scope.isDay = false;
                    $scope.isWeek = false;
                    $scope.isMonth = false;
                    $scope.isYear = false;
                    $scope.isOther = true;
                    break;
                }
        		default: {
        			break;
        		}
        	}

        	$scope.statisticsInfo("");
        }
        
        $scope.statisticsInfo = function(strTmp) {
        	if(strTmp && g_strClassify != strTmp) {
        		g_strClassify = strTmp;
        	}
        	
        	getRangeTime(g_strTime);
        	switch(g_strClassify) {
        		case "Attack": {
        			$scope.show_attack = true;
			    	$scope.show_client = false;
			    	$scope.show_ap = false;
			    	$scope.attackClass = true;
			    	$scope.clientClass = false;
			    	$scope.apClass = false;

        			httpAttackInfoList();
        			break;
        		}
        		case "Client": {
        			$scope.show_attack = false;
			    	$scope.show_client = true;
			    	$scope.show_ap = false;
			    	$scope.attackClass = false;
			    	$scope.clientClass = true;
			    	$scope.apClass = false;

        			httpClientInfoList();
        			break;
        		}
        		case "AP": {
        			$scope.show_attack = false;
			    	$scope.show_client = false;
			    	$scope.show_ap = true;
			    	$scope.attackClass = false;
			    	$scope.clientClass = false;
			    	$scope.apClass = true;

        			httpApInfoList();
        			break;
        		}
        		default : {
        			break;
        		}
        	}
        }

        attackInfoHead();
        clientInfoHead();
        apInfoHead();

        $scope.initViewsByTime("aDay");
    }]
});