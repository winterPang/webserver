define(['angularAMD', 'utils', 'sprintf'],
    function (app, utils) {

        var sLang = utils.getLang();
        var URL_TEMPLATE_FILE = sprintf('../wirelessconfig2/views/%s/ssidDetails.html', sLang);
    
        app.directive('xotherpageofssid', ["$http", "$alertService", '$state', '$stateParams', '$window','$timeout', '$rootScope', '$q', 
            function ($http, $alert, $state ,$stateParams ,$window,$timeout, $rootScope, $q){
                return {
                    templateUrl: URL_TEMPLATE_FILE,
                    restrict: 'E',
                    scope: {
                        rowsvalue: '='
                    },
                    replace: true,
                    controller: function () {
                    },
                    link: function ($scope, $element, $attrs, $ngModel) {
                        
                                    
                        //变量值____双向绑定____value监听
                        $scope.$watch('rowsvalue',function(rowsvalue){
                            // modal框 数据重置
                            $scope.data={};

                            ////  [ajax请求]
                            initShuJu(rowsvalue);                            
                        },true);
                        

                        ////  [ajax请求]
                        function initShuJu(rowsvalue){ 


                            //链接被点击，才：弹框ajax请求
                            if(rowsvalue.sn_tr){
                                if(rowsvalue.stname_tr){


                                    // html变量获取
                                    function getRcString(attrName){
                                        if(($scope[attrName]).indexOf(',')!=-1){
                                            return ($scope[attrName]).split(',');
                                        }else{
                                            return ($scope[attrName]);
                                        }
                                    }


                                    // 处理：返回的数据
                                    function dataChange(data){
                                        // STATUS
                                        var aStatus = getRcString("STATUS_onoff");
                                        data.status=aStatus[data.status];        
                                        // securityIE
                                        var aSecurityIe = getRcString("SECURITYIE");
                                        data.securityIE=aSecurityIe[data.securityIE];

                                        // cipherSuite
                                        var aCipherSuite = getRcString("CIPHERSUITE");
                                        var arrayTemp1=[0,2,4,16,24,32,128];        
                                        var indexTemp1=arrayTemp1.indexOf(data.cipherSuite);
                                        data.cipherSuite=aCipherSuite[indexTemp1];
                                        // authLocation
                                        var aAuthLocation = getRcString("AUTHLOCATION");
                                        data.authLocation=aAuthLocation[data.authLocation];

                                        // akmMode
                                        var aAkmMode = getRcString("AKMMODE");
                                        var arrayTemp1=[0,1,2,4,8,16,32,64,128];        
                                        var indexTemp1=arrayTemp1.indexOf(data.akmMode);
                                        data.akmMode=aAkmMode[indexTemp1];

                                        // hideSSID
                                        var aHidessid=getRcString("HIDE_SSID");
                                        data.hideSSID=aHidessid[data.hideSSID];  

                                        //return
                                        return data;
                                    }


                                    //弹框ajax请求
                                    $http.get("/v3/ssidmonitor/getssidlist?devSN="+rowsvalue.sn_tr+"&stName="+rowsvalue.stname_tr, {})
                                    .success(function (data, status, header, config) {
                                        // data数据处理
                                        
                                        // modal框 刷数据
                                        $scope.data=$.extend({},dataChange(data.ssidList[0]));
                                        // modal框 位置重置
                                        setTimeout(function(){
                                            $(window).trigger("resize");
                                        },500);

                                    })
                                    .error(function (data, status, header, config) {     
                                        $alert.msgDialogError($scope.getDataFailed);
                                    });
                                    return;
                                }
                                return;
                            }                            
                        }                     
                    }
                };
            }
        ]);
    }
);