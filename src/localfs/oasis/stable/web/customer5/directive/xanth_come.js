define(['angularAMD', 'utils', 'sprintf'],
    function (app, utils) {

        var sLang = utils.getLang() || 'cn';
        var URL_TEMPLATE_FILE = sprintf('../customer5/views/%s/xanth_come.html', sLang);
        var conditionOnlineTimeUrl = '/stamonitor/getclientlistbycondition';
        var countUrl = '/stamonitor/gethistclientstatisticbyAccesstimes';

        app.directive('xanthcome', ['$timeout', '$rootScope', '$http', '$q','$state',
            function ($timeout, $rootScope, $http, $q, $state) {
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
                        $http.get(conditionOnlineTimeUrl+'?devSN='+$scope.sn+'&reqType=onlinetime'				            				            
				            ).success(function(data){
				                var stayChart = echarts.init(document.getElementById('stayTime'));                
				                if(data.clientList.halfhour==0 && data.clientList.onehour==0 && data.clientList.twohour==0&& data.clientList.greatertwohour==0){
				                    stayChart.setOption(grayOption);
				                    return;
				                }
				                var aType = [
				                    { name: $scope.stayType_1, value: data.clientList.halfhour},
				                    { name: $scope.stayType_2, value: data.clientList.onehour},
				                    { name: $scope.stayType_3, value: data.clientList.twohour},
				                    { name: $scope.stayType_4, value: data.clientList.greatertwohour}
				                ];    
				                // var aType = [
				                //     { name: type[0], value: 10},
				                //     { name: type[1], value: 23},
				                //     { name: type[2], value: 16},
				                //     { name: type[3], value: 17}
				                // ];              
				                var stayOption ={
				                    tooltip : {
				                        trigger: 'item',
				                        formatter: "{a} {b} : <br/>{c} ({d}%)"
				                    },
				                    legend: {
				                        orient : 'vertical',
				                        y : 'bottom',
				                        data:[$scope.stayType_1,$scope.stayType_2,'',$scope.stayType_3,$scope.stayType_4]
				                    },
				                    series : [
				                        {
				                            type:'pie',
				                            radius : ['40%', '55%'],
				                            center: ['47%', '47%'],
				                            itemStyle : {
				                                normal : {
				                                    label : {
				                                        show : false
				                                    },
				                                    labelLine : {
				                                        show : false
				                                    }
				                                }
				                            },
				                            data:aType
				                        }
				                    ],
				                    color: ['#4ec1b2', '#ff9c9e', '#fbceb1', '#b3b7dd']
				                }                   
				                stayChart.setOption(stayOption);            
				                var normalnumber = $scope.custCount;
				                var appendTohtml = [
				                    '<div style="position: relative;top: -160px;margin: 0 auto;width: 100px;"><div><span style="font-size: 16px; color:#343e4e; display: block;float: left; margin-left: 10px; margin-top: 32px;">',
				                    normalnumber,
				                    '</span>',
				                    '</div>'
				                    ].join(" ");
				                    $(appendTohtml).appendTo($("#stayTime"));
				            }).error(function(data,header,config,status){            
				        }); 

				        var grayOption = {
				            height:200,
				            calculable : false,
				            series : [
				                {
				                    type:'pie',
				                    radius : ['40%', '55%'],
				                    center: ['50%', '50%'],
				                    itemStyle: {
				                        normal: {
				                            labelLine:{
				                                show:false
				                            },
				                            label:
				                            {
				                                position:"inner"
				                            }
				                        }
				                    },
				                    data: [{name:'N/A',value:1}]
				                }
				            ],
				            color : ["rgba(216, 216, 216, 0.75)"]
				        }

				        $http.get(countUrl+'?devSN='+$scope.sn+'&time=1'
				            ).success(function(data){
				                var visitChart = echarts.init(document.getElementById('visitCount'));
				                if(data.statistics[0].count + data.statistics[1].count + data.statistics[2].count + data.statistics[3].count == 0){
				                    visitChart.setOption(grayOption);
				                    return;
				                }
				                var aType =[
				                    { name: $scope.visitCount_1, value: data.statistics[0].count},
				                    { name: $scope.visitCount_2, value: data.statistics[1].count},
				                    { name: $scope.visitCount_3, value: data.statistics[2].count},
				                    { name: $scope.visitCount_4, value: data.statistics[3].count}
				                ];
				                // var aType =[
				                //     { name: lengendName[0], value: 13},
				                //     { name: lengendName[1], value: 17},
				                //     { name: lengendName[2], value: 25},
				                //     { name: lengendName[3], value: 39}
				                // ];               
				                var visitOption ={
				                    tooltip : {
				                        trigger: 'item',
				                        formatter: "{a} {b} : <br/>{c} ({d}%)"
				                    },
				                    legend: {
				                        orient : 'vertical',
				                        y : 'bottom',
				                        data:[$scope.visitCount_1,$scope.visitCount_2,'',$scope.visitCount_3,$scope.visitCount_4]
				                    },
				                    series : [
				                        {
				                        
				                            type:'pie',
				                            radius : ['40%', '55%'],
				                            center: ['47%', '47%'],
				                            itemStyle : {
				                                normal : {
				                                    label : {
				                                        show : false
				                                    },
				                                    labelLine : {
				                                        show : false
				                                    }
				                                }
				                            },
				                            data:aType
				                        }
				                    ],
				                    color: ['#4ec1b2', '#ff9c9e', '#fbceb1', '#b3b7dd']
				                }
				                visitChart.setOption(visitOption);               
				                var normalnumber = $scope.visit;
				                var appendTohtml = [
				                    '<div style="position: relative;top: -160px;margin: 0 auto;width: 100px;"><div><span style="font-size: 16px; color:#343e4e; display: block;float: left; margin-left: 10px; margin-top: 32px;">',
				                    normalnumber,
				                    '</span>',
				                    '</div>'
				                ].join(" ");
				                $(appendTohtml).appendTo($("#visitCount"));
				            }).error(function(){           
				        });

				        $scope.onlineCustomer = function(){
				            $state.go("^.onlinecustomer");
				        }        
				        //redirect historydetail
				        $scope.historyDetail = function(){
				            $state.go("^.historydetail");
				        }
                    }
                };
            }
        ]);
    }
);
