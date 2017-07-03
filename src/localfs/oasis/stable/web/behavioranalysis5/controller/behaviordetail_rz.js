define(['utils','jquery','bootstrap-table-CN','echarts','bootstrap-daterangepicker', 'bootstrapValidator','angular-ui-router','css!bootstrap_daterangepicker_css'], function (Utils,$scope,echarts) {
    return ['$scope', '$http','$filter', '$alertService', '$state', '$window','$timeout','$stateParams', function ($scope, $http,$filter) {
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
		var iCount;
        var pageNumber;
        var pageNumberNet;
		var iPage=1;
		var iPageNet=1;
        var pageSize=12;
        var searchBox=false;
        var netSearchBox=false;
        var dataInfo;
        var dataInfoNet;
        var paramData;
        var pageFlag=true;
        var timerSearch=null;
        var limitApp=12;
        var limitNet=12;
        var sortFlagApp=false;
        var sortNameApp;
        var sortRuleApp;
        var sortFlagNet=false;
        var sortNameNet;
        var sortRuleNet;
        var pageSizeUser=12;
        var pageSizeFlow=12;


        var timerSearchNet=null;


    	function getRcString(attrName) {
            return Utils.getRcString("behavior_rz_rc",attrName);
        }

        function getRangeTime() {
            var nHourTime = 60 * 60;
            var nDayTime = 24 * nHourTime;
            var nWeekTime = 6 * nDayTime;
            var strCurrentDate = new Date().toLocaleDateString();   //获得今天年月日
            var nTodayZeroTime = Math.round((new Date(strCurrentDate).getTime() - 0)  / 1000);   //获得今天零时的时间
            oDate = new Date();
            g_nEndTime=oDate-0;;
            oDate.setHours(0);
            oDate.setMinutes(0);
            oDate.setSeconds(0);
            g_nStartTime=oDate.getTime();;

        }

        /*应用统计*/
        function appStatisticHead() {
	    	var aName = getRcString("APP-HEADER").split(",");

	    	$scope.appStatisticOption = {
	            tId:'appStatistic',
	            pageSize:limitApp,
                asyncPaging:true,
	            pageList:[12,24,50],
                searchable: true,
                //showToolbar:true,
                showPageList:true,
                searchOnEnterKey:true,
                paginationSize:"sm",
                paginationLoop:true,
                pageNumber:12,
                onSort:function(sName,isDesc){
                    $("tbody").html('<td colspan="16" class="pos-rel" style="height:200px;"><div class="bac pos-abs" style=""></div></td>');
                    sortFlagApp=true;
                    sortNameApp=sName;
                    if(isDesc=="desc"){
                        sortRuleApp="descending";
                    }else{
                        sortRuleApp="ascending";
                    }
                    iPage=1;
                    appCount("firstPage");
                },
	            columns: [
	                {searcher:{}, sortable: true, field: 'APPName', title: aName[0]},
	                {searcher:{}, sortable: true, field: 'APPGroupName', title: aName[1]},
	                {searcher:{}, sortable: true, field: 'UserMAC', title: aName[2]},
	                {/*searcher:{},*/ sortable: true, field: 'UpBytes', title: aName[3],formatter:backFlow},
	                {/*searcher:{}, */sortable: true, field: 'DownBytes', title: aName[4],formatter:backFlow},
	                //{/*searcher:{},*/ sortable: true, field: 'TotalTime', title: aName[5]},
	                {/*searcher:{},*/ sortable: true, field: 'FirstTime', title: aName[5]}//修改为第一次访问时间
            	]
        	};
            /*搜索*/
            $scope.$on('searcher-change.bs.table#appStatistic', function (data) {
                setTimeout(function(){
                    $("tbody").html('<td colspan="16" class="pos-rel" style="height:200px;"><div class="bac pos-abs" style=""></div></td>');
                },10);
                iPage=1;
                clearTimeout(timerSearch);
                timerSearch=setTimeout(function(){
                    appCount("firstPage");
                },300);
            });
            $scope.$on('searcher-hide.bs.table#appStatistic', function () {
                searchBox=false;
                //appCount("firstPage");
            });
            $scope.$on('searcher-show.bs.table#appStatistic', function () {
                searchBox=true;
            });
            //setTimeout(function(){
            //    $("tbody").html('<td colspan="16" class="pos-rel" style="height:200px;"><div class="bac pos-abs" style=""></div></td>');
            //},6);
	    }

        /*网页统计*/
	    function networkStatisticHead() { 
	    	var aName = getRcString("WEB-HEADER").split(",");
	    	$scope.networkStatisticOption = {
	            tId:'networkStatistic',
	            pageSize:limitNet,
                pagination:true,
	            pageList:[12,20,50,100],
                searchable: true,
                paginationSize:"sm",
                paginationLoop:true,
                asyncPaging:true,
                onSort:function(sName,isDesc){
                    $("tbody").html('<td colspan="16" class="pos-rel" style="height:200px;"><div class="bac pos-abs" style=""></div></td>');
                    sortFlagNet=true;
                    sortNameNet=sName;
                    if(isDesc=="desc"){
                        sortRuleNet="descending";
                    }else{
                        sortRuleNet="ascending";
                    }
                    iPageNet=1;
                    netCount("firstPage");
                },
	            columns: [
	                {searcher:{}, sortable: true, field: 'WebSiteName', title: aName[0]},
	                {searcher:{}, sortable: true, field: 'CategoryName', title: aName[1]},
	                {searcher:{}, sortable: true, field: 'UserMAC', title: aName[2]},
	                //{/*searcher:{},*/ sortable: true, field: 'TotalTime', title: aName[3]},
	                {/*searcher:{}, */sortable: true, field: 'FirstTime', title: aName[3]}
            	]
        	};
            $scope.$on('searcher-change.bs.table#networkStatistic', function (data) {
                setTimeout(function(){
                    $("tbody").html('<td colspan="16" class="pos-rel" style="height:200px;"><div class="bac pos-abs" style=""></div></td>');
                },10);
                iPageNet=1;
                clearTimeout(timerSearchNet);
                timerSearchNet=setTimeout(function(){
                    netCount("firstPage");
                },300);
            });
            $scope.$on('searcher-hide.bs.table#networkStatistic', function () {
                netSearchBox=false;
                //appCount("firstPage");
            });
            $scope.$on('searcher-show.bs.table#networkStatistic', function () {
                netSearchBox=true;
            });
	    }

        /*用户流量*/
	    function userFlowHead() { 
	    	var aName = getRcString("USER-HEADER").split(",");
 
	    	$scope.userFlowOption = {
	            tId:'userFlow',
                paginationSize:"sm",
	            pageSize:pageSizeUser,
	            pageList:[12],
                pagination:true,
                searchable: true,
	            columns: [
	                {searcher:{}, sortable: true, field: 'UserMAC', title: aName[0]},
	                {searcher:{}, sortable: false, field: 'UpBytes', title: aName[1]},
	                {searcher:{}, sortable: false, field: 'DownBytes', title: aName[2]},
	                {searcher:{}, sortable: false, field: 'DropPktBytes', title: aName[3]}
            	]
        	};
            $scope.$on('searcher-hide.bs.table#userFlow', function () {
                httpUserInfoList();
            });
	    }

        /*接口流量*/
	    function interfaceFlowHead() { 
	    	var aName = getRcString("INTERFACE-HEADER").split(",");
 
	    	$scope.interfaceFlowOption = {
	            tId:'interfaceFlow',
	            pageSize:pageSizeFlow,
	            pageList:[12],
                searchable: true,
	            columns: [
	                {searcher:{}, sortable: true, field: 'IfName', title: aName[0]},
	                {searcher:{}, sortable: true, field: 'UpBytes', title: aName[1]},
	                {searcher:{}, sortable: false, field: 'DownBytes', title: aName[2]},
	                {searcher:{}, sortable: true, field: 'DropPktBytes', title: aName[3]}
            	]
        	};
            $scope.$on('searcher-hide.bs.table#interfaceFlow', function () {
                httpInterfaceInfoList();
            });
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

        function backFlow(val, row,index){
            return addFlowUnit(val);
        }

        function dealTimeFun(nTmpDate){
            var oDate = new Date(nTmpDate);
            var nYear = oDate.getFullYear();
            var nMonth = dealTimeByTen(oDate.getMonth() + 1);
            var nDate = dealTimeByTen(oDate.getDate());
            var nHours = dealTimeByTen(oDate.getHours());
            var nMinutes = dealTimeByTen(oDate.getMinutes());
            var nSeconds = dealTimeByTen(oDate.getSeconds());

            return nYear + '-' + nMonth + '-' + nDate + ' ' + nHours + ':' + nMinutes + ':' + nSeconds;
        }

    	function setStatisticTime(aTmp) {
            var tNow = new Date();
	        var nHourNow = tNow.getHours();
	        var nMinuteNow = tNow.getMinutes();
	        var nSecondsNow = tNow.getSeconds();

            for(i = 0; i < aTmp.length; i++) {
                //aTmp[i].LastTime = dealTimeFun(aTmp[i].LastTime);
                aTmp[i].FirstTime = dealTimeFun(aTmp[i].FirstTime);

                //nHour = (aTmp[i].TotalTime / 3600).toFixed(0);
                //if(nHour > 168) {
                //    aTmp[i].TotalTime = (144 + nHour) + ":" + dealTimeByTen(nMinuteNow) + ":" + dealTimeByTen(nSecondsNow);
                //}
                //else {
                //	nHour = dealTimeByHundred(parseInt(aTmp[i].TotalTime / 3600));
                //	nMinute = dealTimeByTen(parseInt(aTmp[i].TotalTime % 3600 / 60));
                //	nSeconds = dealTimeByTen(parseInt(aTmp[i].TotalTime % 3600 % 60 % 60));
                //	aTmp[i].TotalTime = nHour + ":" + nMinute + ":" + nSeconds;
                //}
            } 
       	}

    	function drawNetworkInfoList(aNetworkMsg) {
            console.log("aNetworkMsg",aNetworkMsg);
            var aNetworkMsgTmp = [];
            var nCount = 0;

            setStatisticTime(aNetworkMsg);

            for(var i=0;i<aNetworkMsg.length;i++) {
                if(aNetworkMsg[i].TotalTime!="0:0:0") {
                    aNetworkMsgTmp[nCount] = aNetworkMsg[i];
                    nCount++;
                }
            }

            setNetworkCN(aNetworkMsgTmp);

	    	$scope.$broadcast('load#networkStatistic', aNetworkMsgTmp);
            if(bLang=="cn"){
                var aName = getRcString("PageTips").split(",");
                $("div.netContent .pagination-info").html(aName[0]+" "+(Number((iPageNet-1)*limitNet)+1)+" "+aName[1]+" "+(Number((iPageNet-1)*limitNet)+Number(limitNet))+" "+aName[2]+" "+iCount+" "+aName[3]);
            }else{
                $("div.netContent .pagination-info").html("Showing "+(Number((iPageNet-1)*limitNet)+1)+" to "+(Number((iPageNet-1)*limitNet)+Number(limitNet))+" of "+iCount+" rows");
            }
            if(pageFlag||iPageNet==1){
                $("div.netContent .page-first").removeClass("enabled").addClass("disabled");
                $("div.netContent .page-pre").removeClass("enabled").addClass("disabled");
            }
            if(iPageNet==pageNumberNet){
                $("div.netContent .page-last").removeClass("enabled").addClass("disabled");
                $("div.netContent .page-next").removeClass("enabled").addClass("disabled");
                if(bLang=="cn"){
                    var aName = getRcString("PageTips").split(",");
                    $("div.netContent .pagination-info").html(aName[0]+" "+((iPageNet-1)*limitNet+1)+" "+aName[1]+" "+iCount+" "+aName[2]+" "+iCount+" "+aName[3]);
                }else{
                    $("div.netContent .pagination-info").html("Showing "+((iPageNet-1)*limitNet+1)+" to "+iCount+" of "+iCount+" rows");
                }
            }
            $("div.netContent .page-first").on("click",function(){
                iPageNet=1;
                $("tbody").html('<td colspan="16" class="pos-rel" style="height:200px;"><div class="bac pos-abs" style=""></div></td>');
                netCount("firstPage");
            });
            $("div.netContent .page-last").on("click",function(){
                iPageNet=pageNumberNet;
                //$("tbody").html('<td colspan="16" class="pos-rel" style="height:200px;"><div class="bac pos-abs" style=""></div></td>');
                netCount("lastPage");
            });
            $("div.netContent .page-pre").on("click",function(){
                iPageNet--;
                if(iPageNet==1){

                }else{
                    $("div.netContent .page-first").removeClass("disabled").addClass("enabled");
                    $("div.netContent .page-pre").removeClass("disabled").addClass("enabled");
                }
                //$("tbody").html('<td colspan="16" class="pos-rel" style="height:200px;"><div class="bac pos-abs" style=""></div></td>');
                netCount("previousPage");
            });
            $("div.netContent .page-next").on("click",function(){
                iPageNet++;
                if(iPageNet==pageNumberNet){
                    $("div.netContent .page-first").removeClass("enabled").addClass("disabled");
                    $("div.netContent .page-pre").removeClass("enabled").addClass("disabled");
                    netCount("firstPage");
                }else{
                    $("div.netContent .page-first").removeClass("disabled").addClass("enabled");
                    $("div.netContent .page-pre").removeClass("disabled").addClass("enabled");
                    netCount("nextPage");
                }
                //$("tbody").html('<td colspan="16" class="pos-rel" style="height:200px;"><div class="bac pos-abs" style=""></div></td>');
            });
            console.log("iPageNet,pageNumberNet",iPageNet,pageNumberNet);
            pageFlag=false;
            /*手动列表*/
            var $netSelect=$(".netContent select.form-control");
            $netSelect.html('<option selected="" value="12">12</option><option value="20">20</option><option value="50">50</option><option value="100">100</option>');
            var arr=[12,20,50,100];
            $netSelect.children("option:eq("+arr.indexOf(Number(limitNet))+")").attr({"selected":"selected"});
            $netSelect.change(function(){
                iPageNet=1;
                limitNet=$netSelect.val();
                networkStatisticHead();
                netCount("firstPage");
            });
    	}

        /*net获取*/
        function netCount(flag){
            /*获取页码及内容param*/
            $("tbody").html('<td colspan="16" class="pos-rel" style="height:200px;"><div class="bac pos-abs" style=""></div></td>');
            var paramData={
                family: "0",
                ACSN: con_devSN,
                limit:limitNet,
                startTime: g_nStartTime,
                endTime: g_nEndTime
            };
            var local={

            };
            /*已打开搜索框*/
            if(netSearchBox){
                /*判断中英文传入appnamecn/appname*/
                if(bLang=="cn"){
                    if($(".netContent .header-search input[search-field=CategoryName]").val()){
                        paramData.CategoryNameCN=$(".netContent .header-search input[search-field=CategoryName]").val();
                    }
                }else{
                    if($(".netContent .header-search input[search-field=CategoryName]").val()){
                        paramData.CategoryName=$(".netContent .header-search input[search-field=CategoryName]").val();
                    }
                }
                if($(".netContent .header-search input[search-field=UserMAC]").val()){
                    paramData.UserMAC=$(".netContent .header-search input[search-field=UserMAC]").val();
                }
                if($(".netContent .header-search input[search-field=WebSiteName]").val()){
                    paramData.WebSiteName=$(".netContent .header-search input[search-field=WebSiteName]").val();
                }
            }else{
                /*未打开搜索不添加条件查询*/

            }
            /*是否排序*/
            if(sortFlagApp){
                paramData.sortName=sortNameNet;
                paramData.sortRule=sortRuleNet;
            }
            switch(flag){
                case "refresh":

                    break;
                case "firstPage":
                    paramData.action="firstPage";
                    break;
                case "lastPage":
                    paramData.action="lastPage";
                    break;
                case "nextPage":
                    paramData.action="nextPage";
                    local=dataInfoNet[dataInfoNet.length-1];
                    break;
                case "previousPage":
                    paramData.action="previousPage";
                    local=dataInfoNet[0];
                    break;
                default:
                    "";
                    break;
            }
            $http({
                url: "/v3/ant/read_dpi_url",
                dataType:"json",
                method: 'POST',
                data:{
                    "method": 'getUrlPageData',
                    "param": paramData,
                    "local":local
                }
            }).success(function(data,header,config,status) {
                /*保存当页数据*/
                if(data.message.data.length!=0){
                    dataInfoNet=[];
                    for(var i=0;i<data.message.data.length;i++){
                        var singleData={
                            "ACSN":data.message.data[i].ACSN,
                            "CategoryName":data.message.data[i].CategoryName,
                            "CategoryNameCN":data.message.data[i].CategoryNameCN,
                            "DestIP":data.message.data[i].DestIP,
                            "FirstTime":data.message.data[i].FirstTime,
                            "LastTime":data.message.data[i].LastTime,
                            "TotalTime":data.message.data[i].TotalTime,
                            "UrlName":data.message.data[i].UrlName,
                            "UserMAC":data.message.data[i].UserMAC,
                            "WebSiteName":data.message.data[i].WebSiteName,
                            "_id":data.message.data[i]._id
                        };
                        dataInfoNet.push(singleData);
                    }
                }
                /*计算页数*/
                if(data.message.totalCount){
                    iCount=data.message.totalCount;
                    if(data.message.totalCount%limitNet){
                        pageNumberNet=parseInt((data.message.totalCount)/limitNet)+1;
                    }else{
                        pageNumberNet=parseInt((data.message.totalCount)/limitNet)||pageNumberNet;
                    }
                    /*搜索后页码变化*/
                    if((paramData.CategoryName||paramData.CategoryNameCN||paramData.WebSiteName||paramData.UserMAC)&&(paramData.CategoryName!=''||paramData.CategoryNameCN!=''||paramData.WebSiteName!=''||paramData.UserMAC!='')&&(paramData.action="firstPage")){
                        iPageNet=1;
                    }
                    /*切换显示数*/
                    if(paramData.action=="lastPage"){
                        iPageNet=pageNumberNet;
                    }
                }
                g_aApps = data.message.data || [];
                //dataInfoNet=g_aApps;
                var aNetwork = data.message.data || [];
                drawNetworkInfoList(aNetwork);
            }).error(function(data,header,config,status) {
                console.log("Error!");
            });

        }

       	function httpNetworkInfoList() {
            netCount("firstPage");
       	}

     	function drawAppInfoList(aApps) {
       		for(var i = 0; i< aApps.length; i++) {
                //aApps[i].FirstTime = $filter('date')(new Date(aApps[i].FirstTime), 'yyyy-MM-dd hh:mm:ss');
                aApps[i].FirstTime = dealTimeFun(aApps[i].FirstTime);
            }

            setStatisticTime(aApps);
            setAppGroupCN(aApps);
            $scope.$broadcast('load#appStatistic', aApps);
            if(bLang=="cn"){
                var aName = getRcString("PageTips").split(",");
                $("div.appContent .pagination-info").html(aName[0]+" "+((iPage-1)*limitApp+1)+" "+aName[1]+" "+(Number((iPage-1)*limitApp)+Number(limitApp))+" "+aName[2]+" "+iCount+" "+aName[3]);
            }else{
                $("div.appContent .pagination-info").html("Showing "+((iPage-1)*limitApp+1)+" to "+((iPage-1)*limitApp+limitApp)+" of "+iCount+" rows");
            }

            if(pageFlag||iPage==1){
                $("div.appContent .page-first").removeClass("enabled").addClass("disabled");
                $("div.appContent .page-pre").removeClass("enabled").addClass("disabled");
            }
            if(iPage==pageNumber){
                $("div.appContent .page-last").removeClass("enabled").addClass("disabled");
                $("div.appContent .page-next").removeClass("enabled").addClass("disabled");
                if(bLang=="cn"){
                    var aName = getRcString("PageTips").split(",");
                    console.log(iPage,iCount);
                    $("div.appContent .pagination-info").html(aName[0]+" "+(Number((iPage-1)*limitApp)+1)+" "+aName[1]+" "+iCount+" "+aName[2]+" "+iCount+" "+aName[3]);
                }else{
                    $("div.appContent .pagination-info").html("Showing "+((iPage-1)*limitApp+1)+" to "+iCount+" of "+iCount+" rows");
                }
            }
            $("div.appContent .page-first").on("click",function(){
                iPage=1;
                //$("tbody").html('<td colspan="16" class="pos-rel" style="height:200px;"><div class="bac pos-abs" style=""></div></td>');
                appCount("firstPage");
            });
            $("div.appContent .page-last").on("click",function(){
                iPage=pageNumber;
                appCount("lastPage");
            });
            $("div.appContent .page-pre").on("click",function(){
                iPage--;
                if(iPage==1){

                }else{
                    $("div.appContent .page-first").removeClass("disabled").addClass("enabled");
                    $("div.appContent .page-pre").removeClass("disabled").addClass("enabled");
                }
                appCount("previousPage");
            });
            $("div.appContent .page-next").on("click",function(){
                iPage++;
                if(iPage==pageNumber){
                    $("div.appContent .page-first").removeClass("enabled").addClass("disabled");
                    $("div.appContent .page-pre").removeClass("enabled").addClass("disabled");
                    appCount("lastPage");
                }else{
                    $("div.appContent .page-first").removeClass("disabled").addClass("enabled");
                    $("div.appContent .page-pre").removeClass("disabled").addClass("enabled");
                    appCount("nextPage");
                }
            });
            pageFlag=false;
            /*手动列表*/
            var $appSelect=$(".appContent select.form-control");
            $appSelect.html('<option selected="" value="12">12</option><option value="20">20</option><option value="50">50</option><option value="100">100</option>');
            var arr=[12,20,50,100];
            $appSelect.children("option:eq("+arr.indexOf(Number(limitApp))+")").attr({"selected":"selected"});
            $appSelect.change(function(){
                $("tbody").html('<td colspan="16" class="pos-rel" style="height:200px;"><div class="bac pos-abs" style=""></div></td>');
                iPage=1;
                limitApp=$appSelect.val();
                appStatisticHead();
                appCount("firstPage");
            });
        }

		/*app获取*/
		function appCount(flag){
            /*获取页码及内容param*/
            $("tbody").html('<td colspan="16" class="pos-rel" style="height:200px;"><div class="bac pos-abs" style=""></div></td>');
            var paramData={
                family: "0",
                ACSN: con_devSN,
                limit:limitApp,
                startTime: g_nStartTime,
                endTime: g_nEndTime
            };
            var local={

            };
            /*已打开搜索框*/
            if(searchBox){
                /*判断中英文传入appnamecn/appname*/
                if(bLang=="cn"){
                    if($(".appContent .header-search input[search-field=APPName]").val()){
                        paramData.APPNameCN=$(".appContent .header-search input[search-field=APPName]").val();
                    }
                    if($(".appContent .header-search input[search-field=APPGroupName]").val()){
                        paramData.APPGroupNameCN=$(".appContent .header-search input[search-field=APPGroupName]").val();
                    }
                }else{
                    if($(".appContent .header-search input[search-field=APPName]").val()){
                        paramData.APPName=$(".appContent .header-search input[search-field=APPName]").val();
                    }
                    if($(".appContent .header-search input[search-field=APPGroupName]").val()){
                        paramData.APPGroupName=$(".appContent .header-search input[search-field=APPGroupName]").val();
                    }
                }
                if($(".appContent .header-search input[search-field=UserMAC]").val()){
                    paramData.UserMAC=$(".appContent .header-search input[search-field=UserMAC]").val();
                }

            }else{
                /*未打开搜索不添加条件查询*/

            }
            /*是否排序*/
            if(sortFlagApp){
                paramData.sortName=sortNameApp;
                paramData.sortRule=sortRuleApp;
            }
            switch(flag){
                case "refresh":

                    break;
                case "firstPage":
                    paramData.action="firstPage";
                    break;
                case "lastPage":
                    paramData.action="lastPage";
                    break;
                case "nextPage":
                    paramData.action="nextPage";
                    local=dataInfo[dataInfo.length-1];
                    break;
                case "previousPage":
                    paramData.action="previousPage";
                    local=dataInfo[0];
                    break;
                default:
                    "";
                    break;
            }
            $http({
                url: "/v3/ant/read_dpi_app",
                dataType:"json",
                method: 'POST',
                data:{
                    "method": 'getAppPageData',
                    "param": paramData,
                    "local":local
                }
            }).success(function(data) {
                /*保存当页数据*/
                if(data.message.data.length!=0){
                    dataInfo=[];
                    for(var i=0;i<data.message.data.length;i++){
                        var singleData={
                            "ACSN":data.message.data[i].ACSN,
                            "APPGroupName":data.message.data[i].APPGroupName,
                            "APPGroupNameCN":data.message.data[i].APPGroupNameCN,
                            "APPName":data.message.data[i].APPName,
                            "APPNameCN":data.message.data[i].APPNameCN,
                            "DownBytes":data.message.data[i].DownBytes,
                            "DownDropBytes":data.message.data[i].DownDropBytes,
                            "DownDropPkts":data.message.data[i].DownDropPkts,
                            "DownPkts":data.message.data[i].DownPkts,
                            "FirstTime":data.message.data[i].FirstTime,
                            "IfName":data.message.data[i].IfName,
                            "LastTime":data.message.data[i].LastTime,
                            "TotalTime":data.message.data[i].TotalTime,
                            "UpBytes":data.message.data[i].UpBytes,
                            "UpDropBytes":data.message.data[i].UpDropBytes,
                            "UpDropPkts":data.message.data[i].UpDropPkts,
                            "UpPkts":data.message.data[i].UpPkts,
                            "UserMAC":data.message.data[i].UserMAC,
                            "_id":data.message.data[i]._id
                        };
                        dataInfo.push(singleData);
                    }
                }
                /*计算页数*/
                if(data.message.totalCount){
                    iCount=data.message.totalCount;
                    if(data.message.totalCount%limitApp){
                        pageNumber=parseInt((data.message.totalCount)/limitApp)+1;
                    }else{
                        pageNumber=parseInt((data.message.totalCount)/limitApp)||pageNumber;
                    }
                    /*切换显示数*/
                    if(paramData.action=="lastPage"){
                        iPage=pageNumber;
                    }
                    /*搜索后页码变化*/
                    if((paramData.APPNameCN||paramData.APPName||paramData.APPGroupName||paramData.APPGroupNameCN)&&(paramData.APPNameCN!=''||paramData.APPName!=''||paramData.APPGroupName!=''||paramData.APPGroupNameCN!='')&&(paramData.action="firstPage")){
                        //iPage=1;
                    }
                }
                g_aApps = data.message.data || [];
                if(data.retCode==0){
                    drawAppInfoList(g_aApps);
                }else{
                    drawAppInfoList(g_aApps);
                }
            }).error(function(data,header,config,status) {
                console.log("Error!");
            });

		}

	    function httpAppInfoList() {
			appCount("firstPage");
	    	g_aApps = [];
	    	g_aAppsDown = [];
        }

        function drawUserInfoList(aUserSelects,aUserSelectsDown) {
            for(i = 0; i < aUserSelectsDown.length; i++){
                aUserSelectsDown[i].DropPktBytes=addFlowUnit(aUserSelectsDown[i].DownDropBytes+aUserSelectsDown[i].UpDropBytes);
                aUserSelectsDown[i].UpBytes=addFlowUnit(aUserSelectsDown[i].UpBytes);
                aUserSelectsDown[i].DownBytes=addFlowUnit(aUserSelectsDown[i].DownBytes);
            }
			$scope.$broadcast('load#userFlow', aUserSelectsDown);
            $(".userContent select").off("change").change(function(){
                pageSizeUser=$(".userContent select").val();
                userFlowHead();
                httpUserInfoList();
            });
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
                $(".flowContent select").off("change").change(function(){
                    pageSizeFlow=$(".flowContent select").val();
                    interfaceFlowHead();
                    httpInterfaceInfoList();
                });
	        }).error(function(data,header,config,status) {
	            console.log("getInterfacesFlowStatis Error!");
	        });
  		}

		/*列表控制*/
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
	    };

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