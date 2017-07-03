define(['angularAMD', 'utils', 'sprintf'],
    function (app, utils) {

        var sLang = utils.getLang()|| 'cn';
        var URL_TEMPLATE_FILE = sprintf('../client9/views/%s/xanth_byod.html', sLang);

        app.directive('xanthbyod', ['$timeout', '$rootScope', '$http', '$q', '$state',
            function ($timeout, $rootScope, $http, $q ,$state) {
                return {
                    templateUrl: URL_TEMPLATE_FILE,
                    restrict: 'E',
                    scope: {
                        sn: '@'
                    },
                    replace: true,
                    // controller: function ($scope, $element, $attrs, $transclude) {
                    // },
                    link: function ($scope, $element, $attrs, $ngModel) { 
                        var changeApgroup = "";
                        var g_topId = "";
                        var ali = "";
                        $scope.toDetail = function(){
                            $state.go('scene.content.monitor.client9.customerdetail',{data:changeApgroup,value:g_topId,alias:ali});
                        };
                        $scope.$on('paraChange',function(ev,data,value,alias){
                            ali = alias;
                            g_topId = value;
                            changeApgroup = data;
                            // window.name = data;
                            // console.log(alias);
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
                                $("#Total").html(data.response.totalCount);                          
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
                                        dataType:""                                              
                                    }   
                                }                          
                            }).success(function(data){
                                    $("#Num2G").html(data.response.bandType2p4G_count);
                                    $("#Num5G").html(data.response.bandType5G_count);
                                }).error(function(){ 

                            }); 
                        }) 

                    }
                };
            }
        ]);
    }
);
