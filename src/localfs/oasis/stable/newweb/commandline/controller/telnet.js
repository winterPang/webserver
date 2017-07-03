define(['utils','jquery','angular-ui-router'], function (Utils,$scope) {
    return ['$scope', '$http', '$state', function ($scope, $http) {
	    var g_command;
	    var g_strACSN = $scope.sceneInfo.sn;

	    function initdata() {
	    	var strHtml = "<iframe src='../frame/ant/shellinabox.html";
	    	strHtml += "?" + $scope.sceneInfo.sn + "' width='100%' height='100%' frameborder></iframe>";
			$("#command_line").html(strHtml);
	    }
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
        $scope.drsValueChange = function () {
            $scope.drsValueIsEnable = !$scope.drsValueIsEnable;
        };

        $scope.commonCommands = function(strCmd) {
            var scope = document.getElementsByTagName("iframe")[0].contentWindow.document.getElementById("commandline_input");
	    	if(scope) {
	    		scope.setAttribute("value", strCmd);
	    	}
        }
        initdata();
    }];
});