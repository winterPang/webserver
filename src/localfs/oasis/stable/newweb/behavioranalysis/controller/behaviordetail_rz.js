define(['utils','jquery','echarts','bootstrap-daterangepicker','angular-ui-router','css!bootstrap_daterangepicker_css'], function (Utils,$scope,echarts) {
    return ['$scope', '$http', '$alertService', '$state', '$window', function ($scope, $http, $window) {
    	var g_nStartTime = 0;
    	var g_nEndTime = 0;
    	var con_devSN = $scope.sceneInfo.sn;
    	var g_bApp = false;
    	var g_bAppDown = false;
    	var g_aApps = [];
    	var g_aAppsDown = [];
    	var g_bUsers = false;
    	var g_bUsersDown = false;
    	var g_aUsers = [];
    	var g_aUsersDown = [];
        var bLang = Utils.getLang();

    	function getRcString(attrName) {
            return Utils.getRcString("behavior_rz_rc",attrName);
        }

        function getRangeTime() {
            var nHourTime = 60 * 60;
            var nDayTime = 24 * nHourTime;
            var nWeekTime = 6 * nDayTime;
            var strCurrentDate = new Date().toLocaleDateString();   //获得今天年月日
            var nTodayZeroTime = Math.round((new Date(strCurrentDate).getTime() - 0)  / 1000);   //获得今天零时的时间
           	
           	//g_nEndTime = Math.round(new Date().getTime() / 1000);
           	g_nEndTime = ((new Date())-0);
            //g_nStartTime = (nTodayZeroTime - nWeekTime);
            g_nStartTime = (new Date())-60*60*1000*100;
        }

        /*应用统计*/
        function appStatisticHead() { 
	    	var aName = getRcString("APP-HEADER").split(",");

	    	$scope.appStatisticOption = {
	            tId:'appStatistic',
	            pageSize:12,
	            pageList:[12,24],
                searchable: true,
	            columns: [
	                {searcher:{}, sortable: true, field: 'APPName', title: aName[0]},
	                {searcher:{}, sortable: true, field: 'APPGroupName', title: aName[1]},
	                {searcher:{}, sortable: true, field: 'UserMAC', title: aName[2]},
	                {searcher:{}, sortable: false, field: 'PktBytes', title: aName[3]},
	                {searcher:{}, sortable: false, field: 'DownPktBytes', title: aName[4]},
	                {searcher:{}, sortable: true, field: 'TotalTime', title: aName[5]},
	                {searcher:{}, sortable: true, field: 'FirstTime', title: aName[6]}//修改为第一次访问时间
            	]
        	};
            setTimeout(function(){
                $("tbody").html('<td colspan="16" class="pos-rel" style="height:200px;"><div class="bac pos-abs" style=""></div></td>');
            },200);
	    }

        /*网页统计*/
	    function networkStatisticHead() { 
	    	var aName = getRcString("WEB-HEADER").split(",");

	    	$scope.networkStatisticOption = {
	            tId:'networkStatistic',
	            pageSize:12,
	            pageList:[12,24],
                searchable: true,
	            columns: [
	                {searcher:{}, sortable: true, field: 'WebSiteName', title: aName[0]},
	                {searcher:{}, sortable: true, field: 'CategoryName', title: aName[1]},
	                {searcher:{}, sortable: true, field: 'UserMAC', title: aName[2]},
	                {searcher:{}, sortable: true, field: 'TotalTime', title: aName[3]},
	                {searcher:{}, sortable: true, field: 'FirstTime', title: aName[4]}
            	]
        	}; 
	    }

        /*用户流量*/
	    function userFlowHead() { 
	    	var aName = getRcString("USER-HEADER").split(",");
 
	    	$scope.userFlowOption = {
	            tId:'userFlow',
	            pageSize:12,
	            pageList:[12,24],
                searchable: true,
	            columns: [
	                {searcher:{}, sortable: true, field: 'UserMAC', title: aName[0]},
	                {searcher:{}, sortable: false, field: 'UpBytes', title: aName[1]},
	                {searcher:{}, sortable: false, field: 'DownBytes', title: aName[2]},
	                {searcher:{}, sortable: false, field: 'DropPktBytes', title: aName[3]}
            	]
        	}; 
	    }

        /*接口流量*/
	    function interfaceFlowHead() { 
	    	var aName = getRcString("INTERFACE-HEADER").split(",");
 
	    	$scope.interfaceFlowOption = {
	            tId:'interfaceFlow',
	            pageSize:12,
	            pageList:[12,24],
                searchable: true,
	            columns: [
	                {searcher:{}, sortable: true, field: 'IfName', title: aName[0]},
	                {searcher:{}, sortable: true, field: 'UpBytes', title: aName[1]},
	                {searcher:{}, sortable: false, field: 'DownBytes', title: aName[2]},
	                {searcher:{}, sortable: true, field: 'DropPktBytes', title: aName[3]}
            	]
        	}; 
	    }

	    var appUrl = Utils.getUrl('POST', '', '/ant/read_dpi_app', '/init/behavioranalysis5/app.json');
	    var networkUrl = Utils.getUrl('POST', '', '/ant/read_dpi_url', '/init/behavioranalysis5/network.json');
	    var usersUrl = Utils.getUrl('POST', '', '/ant/read_dpi_app', '/init/behavioranalysis5/users.json');
	    var interfaceUrl = Utils.getUrl('POST', '', '/ant/read_dpi_app', '/init/behavioranalysis5/interface.json');

        /*中英文切换*/
    	function setNetworkCN(aTmp) {
    		for(var i=0;i<aTmp.length;i++) {
                if("cn" === bLang && aTmp[i].CategoryName != "")
                {
                    aTmp[i].CategoryName = aTmp[i].CategoryNameCN;
                }else{
                    aTmp[i].CategoryName=aTmp[i].CategoryName;
                }
            } 
    	}

        /*中英文切换*/
    	function setAppGroupCN(aTmp) {
            var nLength = aTmp.length;
    		for(i = 0; i < nLength; i++) {
                aTmp[i].APPName=aTmp[i].APPName;
                if("cn" === bLang && aTmp[i].APPNameCN != "")
                {
                    aTmp[i].APPName = aTmp[i].APPNameCN;
                    aTmp[i].APPGroupName=aTmp[i].APPGroupNameCN;
                }else{
                    aTmp[i].APPName=aTmp[i].APPName;
                    aTmp[i].APPGroupName=aTmp[i].APPGroupName;
                }
            }
    	}

        /*单位*/
    	function addFlowUnit(strPktBytes) {
       		var nKb = 1024, nMb = 1024 * nKb, nGb = 1024 * nMb, nTb = 1024 * nGb;
       		var nPktBytes = Number(strPktBytes) || 0;

       		if (nPktBytes < nKb) {
                strPktBytes = nPktBytes + "(Byte)"
            }
            else if (nPktBytes < nMb) {
                strPktBytes = (nPktBytes / nKb).toFixed(2) + "(KB)";
            }
            else if (nPktBytes < nGb) {
                strPktBytes = (nPktBytes / nMb).toFixed(2) + "(MB)";
            }
            else if (nPktBytes < nTb) {
                strPktBytes = (nPktBytes / nGb).toFixed(2) + "(GB)";
            }
            else {
                strPktBytes = (nPktBytes / nTb).toFixed(2) + "(TB)"; 
            }

            return strPktBytes;
       	}

        function dealTimeByHundred(nTime) {
            return nTime > 99 ? nTime : (nTime > 9 ? ('0' + nTime) : ('00' +  nTime));
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

    	function setStatisticTime(aTmp) {
            var tNow = new Date();
	        var nHourNow = tNow.getHours();
	        var nMinuteNow = tNow.getMinutes();
	        var nSecondsNow = tNow.getSeconds();

            for(i = 0; i < aTmp.length; i++) {
                aTmp[i].LastTime = dealTimeFun(aTmp[i].LastTime);
                aTmp[i].FirstTime = dealTimeFun(aTmp[i].FirstTime);

                nHour = (aTmp[i].TotalTime / 3600).toFixed(0);
                if(nHour > 168) {
                    aTmp[i].TotalTime = (144 + nHour) + ":" + dealTimeByTen(nMinuteNow) + ":" + dealTimeByTen(nSecondsNow);
                }
                else {
                	nHour = dealTimeByHundred(parseInt(aTmp[i].TotalTime / 3600));
                	nMinute = dealTimeByTen(parseInt(aTmp[i].TotalTime % 3600 / 60));
                	nSeconds = dealTimeByTen(parseInt(aTmp[i].TotalTime % 3600 % 60 % 60));
                	aTmp[i].TotalTime = nHour + ":" + nMinute + ":" + nSeconds;
                }
            } 
       	}

    	function drawNetworkInfoList(aNetworkMsg) {
            var aNetworkMsgTmp = [];
            var nCount = 0;

            for(var i = 0; i < aNetworkMsg.length; i++) {
                for(var j = i + 1; j < aNetworkMsg.length; j++) {
                    if((aNetworkMsg[i].WebSiteName == aNetworkMsg[j].WebSiteName) && (aNetworkMsg[i].UserMAC == aNetworkMsg[j].UserMAC)) {
                        aNetworkMsg.splice(j,1);
                    }
                }
            }

            setStatisticTime(aNetworkMsg);

            for(var i=0;i<aNetworkMsg.length;i++) {
                if(aNetworkMsg[i].TotalTime!="0:0:0") {
                    aNetworkMsgTmp[nCount] = aNetworkMsg[i];
                    nCount++;
                }
            }

            setNetworkCN(aNetworkMsgTmp);

	    	$scope.$broadcast('load#networkStatistic', aNetworkMsgTmp);
    	}

       	function httpNetworkInfoList() {
       		$http({
	            url: "/v3/ant/read_dpi_url",
	            method: "POST",
                dataTpe:"json",
	            data:{
	                method:'getBatchUrls',
                    param: {
                        ACSN: con_devSN,
                        startTime: g_nStartTime,
                        endTime: g_nEndTime,
                        family: 0,
                        limit: 5000
                    }
               	}
	        }).success(function(data,header,config,status) {
        		var aNetwork = data.message || [];
        		drawNetworkInfoList(aNetwork);
	        }).error(function(data,header,config,status) {
	            console.log("Error!");
	        }); 
       	}

     	function drawAppInfoList(aApps, aAppsDown) {
     		g_bApp = false;
     		g_bAppDown = false;
     		var aAppTemp = [];
     		var nCount = 0, i = 0, j = 0;

       		for(i = 0; i < aApps.length; i++) { 
       			if(aApps[i].PktBytes < 0 || aApps[i].DownPktBytes < 0) {
                    continue;
                }
                if(aApps[i].TotalTime != 0 && (aApps[i].PktBytes != 0 || aApps[i].DownPktBytes != 0)) {
                    aAppTemp[nCount] = aApps[i];
                    aAppTemp[nCount].PktBytes = addFlowUnit(aAppTemp[nCount].PktBytes);
                    aAppTemp[nCount].DownPktBytes = addFlowUnit(aAppTemp[nCount].DownPktBytes);
                    nCount++; 
                } 
            }

            setStatisticTime(aAppTemp);
            setAppGroupCN(aAppTemp);
            $scope.$broadcast('load#appStatistic', aAppTemp);
        }

	    function httpAppInfoList() {
	    	g_aApps = [];
	    	g_aAppsDown = [];
            $("tbody").html('<td colspan="16" class="pos-rel" style="height:200px;"><div class="bac pos-abs" style=""></div></td>');
        	$http({
	            url: appUrl.url,
                dataType:"json",
                method: 'POST',
	            data:{
	                "method": 'getBatchApps',
	                "param": {
	                    family: "0",
	                    ACSN: con_devSN,
                        limit:1000,
                        startTime: g_nStartTime,
                        endTime: g_nEndTime,
                        //userMAC: ""
	                }
	            }
	        }).success(function(data,header,config,status) {
                $("tbody").html('<td colspan="16" class="pos-rel" style="height:200px;"><div class="bac pos-abs" style=""></div></td>');
                console.log(data,"success");
        		g_bApp = true;
        		g_aApps = data.message || [];
                if(data.retCode==0){
                    setTimeout(function(){
                        drawAppInfoList(g_aApps, g_aAppsDown);
                    },500);
                }else{
                    setTimeout(function(){
                        drawAppInfoList(g_aApps, g_aAppsDown);
                    },500);
                    console.log("no app data");
                }
	        }).error(function(data,header,config,status) {
	            console.log("Error!");
	        });
        }

        function drawUserInfoList(aUserSelects,aUserSelectsDown) {
            for(i = 0; i < aUserSelectsDown.length; i++){
                aUserSelectsDown[i].DropPktBytes=addFlowUnit(aUserSelectsDown[i].DownDropBytes+aUserSelectsDown[i].UpDropBytes);
                console.log(aUserSelectsDown.DownDropBytes,aUserSelectsDown.UpDropBytes);
            }
			$scope.$broadcast('load#userFlow', aUserSelectsDown);
   		}

        /*用户流量*/
    	function httpUserInfoList() {

	        $http({
                url:"/v3/ant/read_dpi_app",
                method: "POST",
                data:{
                    method: 'getUserFlowStatis',
                    param: {
                        ACSN: con_devSN,
                        startTime: g_nStartTime,
                        endTime: g_nEndTime,
                        family: 0,
                        limit: 5000

                    }
                }
	        }).success(function(data,header,config,status) {
	        	g_bUsersDown = true;
        		g_aUsersDown = data.message || [];
                drawUserInfoList(g_aUsers, g_aUsersDown);
	        }).error(function(data,header,config,status) {
	            console.log("getUserFlowStatis Error!");
	        });
    	} 

        /*接口流量*/
    	function httpInterfaceInfoList() {
  			$http({
	            url: interfaceUrl.url, 
	            method: "POST",
	            data:{
	                method: 'getInterfacesFlowStatis',
	                param: {
                        family: "0",
                        ACSN: con_devSN,
                        startTime: g_nStartTime,
                        endTime: g_nEndTime
                    }
               	}
	        }).success(function(data,header,config,status) { 
	        	var aInterfaces = data.message || [];
                for(i = 0; i < aInterfaces.length; i++){
                    aInterfaces[i].DownBytes=addFlowUnit(aInterfaces[i].DownBytes);
                    aInterfaces[i].UpBytes=addFlowUnit(aInterfaces[i].UpBytes);
                    aInterfaces[i].DropPktBytes=addFlowUnit(aInterfaces[i].DownDropBytes+aInterfaces[i].UpDropBytes);
                }
	    		$scope.$broadcast('load#interfaceFlow', aInterfaces);
	        }).error(function(data,header,config,status) {
	            console.log("getInterfacesFlowStatis Error!");
	        });
  		}

	    $scope.initStatisticView = function (strFlag) {
            $("tbody").html('<td colspan="16" class="pos-rel" style="height:200px;"><div class="bac pos-abs" style=""></div></td>');
	    	getRangeTime();

	    	switch(strFlag) {
	    		case "App": { 
	    			$scope.show_app = true;
			    	$scope.show_network = false;
			    	$scope.show_userFlow = false;
			    	$scope.show_interfaceFlow = false; 

	    			httpAppInfoList();
	    			break;
	    		}
	    		case "Network": {
	    			$scope.show_app = false;
			    	$scope.show_network = true;
			    	$scope.show_userFlow = false;
			    	$scope.show_interfaceFlow = false;

			    	httpNetworkInfoList();
	    			break;
	    		}
	    		case "User": {
	    			$scope.show_app = false;
			    	$scope.show_network = false;
			    	$scope.show_userFlow = true;
			    	$scope.show_interfaceFlow = false;

			    	httpUserInfoList();
	    			break;
	    		}
	    		case "Interface": {
	    			$scope.show_app = false;
			    	$scope.show_network = false;
			    	$scope.show_userFlow = false;
			    	$scope.show_interfaceFlow = true;

			    	httpInterfaceInfoList();
	    			break;
	    		}
	    		default: {
	    			console.log("Error");
	    			break;
	    		}
	    	}
	    }

	    appStatisticHead();
	    networkStatisticHead();
	    userFlowHead();
	    interfaceFlowHead();

	    $scope.initStatisticView("App");

        $scope.return = function() {
            history.back(-1);
        }
    }];
});