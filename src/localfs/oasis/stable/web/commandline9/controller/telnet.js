define(['utils','jquery','echarts','bootstrap-daterangepicker','angular-ui-router','css!bootstrap_daterangepicker_css'], function (Utils,$scope,echarts) {
    return ['$scope', '$http', '$alertService', '$state','$window','$timeout', function ($scope, $http,FRAME,$state,$window,$timeout) {
	    var g_command;
	    var g_strACSN = $scope.sceneInfo.sn;
	    var deviseAlmData={};
        var deviseDevData={};
        var dev;
        var map={
            set:function (a,key,value){
                    if(a[key]){
                        a[key]=a[key]+','+value;
                    }else{
                        a[key]=value;
                    }
                },
            get:function(a,key){
                if(a[key].indexOf(',')==-1){
                    return a[key]
                }else{
                    return a[key].split(',');
                }
            }    
        }
        $scope.devSnList=[];
        $scope.alimsOptions={//别名
            sId: 'alimsO'
        }
        $scope.devOptions={
            sId: 'devSnSelct',
            allowClear: false
        }
	    var URL_GET_DEV_LIST = '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/shopdevices2/%d';

        $http.get(sprintf(URL_GET_DEV_LIST, $scope.sceneInfo.nasid))
            .success(function (data) { 
                $.each(data.data[0].devices,function(i,value){
                    $scope.devSnList.push(value.devAlias);
                    deviseDevData[value.devAlias]=value.devSn;
                });
            })
            .error(function(){
                FRAME.noticeDanger(getRcString('retry'));
        });
        $scope.$on('select2:select#devSnSelct',getDevSn);
        function getDevSn(){
            var sn=deviseDevData[$scope.dev];
            initdata(sn);
        }
        $scope.$watch('dev',function(){
            if($scope.dev){
                $scope.modelIndex=true;
            }else{
                $scope.modelIndex=false;
            }
        });
		function getRcString(attrName) {
            return Utils.getRcString("commandline_rc", attrName);
        }
	    function initdata(sn)
	    {
	    	var strHtml = "<iframe src='../frame/ant/shellinabox.html";
	    	strHtml += "?" + sn + "' width='100%' height='100%' frameborder></iframe>";
			$("#command_line").html(strHtml);


			// var strHtml = "<iframe src='../frame/ant/";
   //          var enFlag = Utils.getLang();

   //          strHtml += ("en" == enFlag) ? "shellinabox.html" : "shellinabox_cn.html";
   //      	strHtml += "?" + $scope.sceneInfo.sn + "' width='100%' height='100%' frameborder></iframe>";
			// $("#command_line").html(strHtml);
	    }
        //$scope.btnStatus=true;
        $scope.modelIndex=false;
        $scope.$watch('aliamsData',function(){
            if(!$scope.aliamsData){
                    $scope.apDataOp=dev;
            }
        });
	    //telnet是否开启
        $scope.drsValueIsEnable = true;
        //警告框的显示
        $scope.b_warning_show = true;
        //常用命令
        $scope.baseInfo = false;
        $scope.networkInfo = false;
        $scope.monitorInfo = false;
        $scope.base = '+';
        $scope.network = '+';
        $scope.monitor = '+';
        $scope.isBaseOpen = false;
        $scope.isNetOpen = false;
        $scope.isMonOpen = false;

        $scope.showCmd = function(strInfoFlag) {
            switch(strInfoFlag) {
                case "baseInfo": {
                    $scope.baseInfo = !$scope.baseInfo;
                    $scope.networkInfo = false;
                    $scope.monitorInfo = false;
                    break;
                }
                case "networkInfo": {
                    $scope.baseInfo = false;
                    $scope.networkInfo = !$scope.networkInfo;
                    $scope.monitorInfo = false;
                    break;
                }
                case "monitorInfo": {
                    $scope.baseInfo = false;
                    $scope.networkInfo = false;
                    $scope.monitorInfo = !$scope.monitorInfo;
                    break;
                }
                default: {
                    break;
                }
            }

            $scope.base = $scope.baseInfo ? 'x' : '+';
            $scope.network = $scope.networkInfo ? 'x' : '+';
            $scope.monitor = $scope.monitorInfo ? 'x' : '+';
            $scope.isBaseOpen = $scope.baseInfo;
            $scope.isNetOpen = $scope.networkInfo;
            $scope.isMonOpen = $scope.monitorInfo;
        }

        $scope.showWarning = function() {
            $scope.b_warning_show = !$scope.b_warning_show;
        }
        //开关，点击时触发此方法
        $scope.drsValueChange = function (a) {
            if(a){

            }else{
                $scope.drsValueIsEnable = !$scope.drsValueIsEnable; 
                $state.go("^.commandline9");
            }
            
        };

        $scope.commonCommands = function(strCmd) { 
            var scope = document.getElementsByTagName("iframe")[0].contentWindow.document.getElementById("commandline_input");
	    	if(scope) {
	    		scope.setAttribute("value", strCmd);
	    	}
        }

	    function initform()
	    {
	        // $(".warning-panel").on("click",function(e){
	        //     $(".warning-panel").remove();
	        // });

	        // $("#button_help,#tip_icon").on("click", function(e){
	        //     $("#tip_icon").toggleClass("on").toggleClass("off");
	        //     $("#help_message").toggleClass("on");
	        // });

	        // $(".page-row .li-normalstyle").on("click", function(e) {
	        //     var command = $(this).attr("command");
	        // });

	        // $(".telnet-switch input").on("click",function(){
	        //     Utils.Base.redirect ({np:"commandline.commandline"});

	        // });    
	    }
	    
	    function funca(escope)
	    {
	    	var scope = document.getElementsByTagName("iframe")[0].contentWindow.document.getElementById("commandline_input");
	    	var value = $(escope).attr("param");
	    	if(scope)
	    	{
	    		scope.setAttribute("value", value)
	    	}
	    }
	   
    }];
});