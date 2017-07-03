define(['angularAMD', 'utils', 'sprintf'],
    function (app, utils) {

        var sLang = utils.getLang() || 'cn';
        var URL_TEMPLATE_FILE = sprintf('../client9/views/%s/xanth_byod_rz.html', sLang);

        app.directive('xanthbyodrz', ['$timeout', '$rootScope', '$http', '$q',
            function ($timeout, $rootScope, $http, $q) {
                return {
                    templateUrl: URL_TEMPLATE_FILE,
                    restrict: 'E',
                    scope: {
                        sn: '@'
                    },
                    replace: true,
                    controller: function ($scope, $element, $attrs, $transclude) {
                    },
                    link: function ($scope, $element, $attrs, $ngModel) {                       
                        var changeApgroup = "";
                        $scope.$on('paraChange',function(ev,data,value){
                            var g_topId = value;
                            changeApgroup = data;
                            console.log(changeApgroup);
                            $http({
                                url:'/v3/stamonitor/monitor',
                                method:'post',
                                data:{
                                    method:'clientallcount_cloud_condition',
                                    param:{
                                        topId:g_topId,   
                                        groupId:changeApgroup                                              
                                    }  
                                }
                                                         
                            }).success(function (data){
                                $("#portalTotal").html(data.response.conditionCount);                          
                            }).error(function (){

                            });

                            $http({
                                url:'/v3/stamonitor/monitor',
                                method:'post',
                                data:{
                                    method:'clientcount_cloud_bandtype',
                                    param:{
                                        topId:g_topId,
                                        groupId:changeApgroup,
                                        dataType:'auth'                                              
                                    }   
                                }                          
                            }).success(function(data){
                                    $("#portalNum2G").html(data.response.bandType2p4G_count);
                                    $("#portalNum5G").html(data.response.bandType5G_count);
                                }).error(function(){ 

                            }); 
                        })                                         
                    }
                };
            }
        ]);
    }
);
