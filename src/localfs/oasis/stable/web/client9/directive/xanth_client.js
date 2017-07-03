define(['angularAMD', 'utils', 'sprintf'],
    function (app, utils) {

        var sLang = utils.getLang() || 'cn';
        var URL_TEMPLATE_FILE = sprintf('../client9/views/%s/xanth_client.html', sLang);
        var customerUrl = '/stamonitor/histclientstatistic_bycondition';

        app.directive('xanthclient', ['$timeout', '$rootScope', '$http', '$q',
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
                    	$scope.$on('paraChange',function(ev,data){ 
                    		$('#total a.time-link').removeClass('active');
                    		$('#total a[value = '+1+']').addClass('active');                  		
                    		changeApgroup = data;
                    		$scope.chouseUrl = function(mode){
					            if(mode == 1){
					                para = "clientstat_cloud_yesterday";
					            }
					            else if(mode == 2){
					                para = "clientstat_cloud_lastweek";
					            }
					            else if(mode == 3){
					                para = "clientstat_cloud_lastmonth";
					            }

					            $http({
					            	url:'/v3/stamonitor/monitor',
	                                method:'post',
	                                data:{
	                                    method:para,
	                                    param:{
	                                        groupId:changeApgroup,
	                                        dataType:""                                              
	                                    }   
	                                }   
					            }).success(function(data){
					                $scope.g_AllUser = [];
					                $scope.g_newUser = [];
					                $scope.g_onlineTime = [];
					                $scope.g_Time = [];
					                $scope.newlength = data.response.length; 
					                for (var i = 0; i < $scope.newlength; i++) {
					                    $scope.g_newUser.push( data.response[i].newCount);
					                    $scope.g_AllUser.push( data.response[i].totalCount);
					                    $scope.g_onlineTime.push( data.response[i].time);    
					                }
					                for (var j = 0 ; j < $scope.newlength ; j++){
					                    if (mode == 1){
					                        $scope.g_Time.push( new Date ($scope.g_onlineTime[j]).getHours() + ":" + "00");
					                    }
					                    else{
					                        $scope.g_Time.push( new Date($scope.g_onlineTime[j]).getMonth() + 1 + "-" + new Date($scope.g_onlineTime[j]).getDate()  );
					                    }
					                }
					                $scope.myechart($scope.g_AllUser,$scope.g_newUser,$scope.g_Time);
					            }).error(function(){

					            })
					        }
					        
					        $scope.chouseUrl(1);
					        $scope.myechart = function(allcouver,newcouver,time){
					            var customerChart=echarts.init(document.getElementById('loginusermit'));
					            var customerOption = {
					                tooltip: {
					                    trigger: 'axis'
					                },
					                legend: {
					                    itemWidth:8,
					                    data:[$scope.newCustomer,$scope.allCustomer]
					                },
					                grid :
					                {
					                    x:40, y:40, x2:30, y2:25,
					                    borderColor : '#fff'
					                },
					                xAxis: [
					                    {
					                        boundaryGap: true,
					                        splitLine:false,
					                        axisLine  : {
					                            show:true ,
					                            lineStyle :{color: '#9da9b8', width: 1}
					                        },
					                        axisTick:{show:false},
					                        
					                        type: 'category',
					                        data: time
					                    }
					                ],
					                yAxis: [
					                    {
					                        type: 'value',
					                        name: $scope.customerCount,
					                        interval: 50,
					                        axisTick:{show:false},
					                        splitLine:{
					                            show:true,
					                            textStyle:{color: '#c9c4c5', fontSize:"1px", width:4},
					                            lineStyle: {
					                                color: ['#e7e7e9']
					                            }
					                        },
					                        axisLine  : {
					                            show:true ,
					                            lineStyle :{color: '#9da9b8', width: 1}
					                        },
					                        axisLabel: {
					                            show:true,
					                            textStyle:{color: '#9da9b8', fontSize:"12px", width:2},
					                            formatter: '{value}'
					                        }
					                    }
					                ],
					                series: [
					                    {
					                        name:$scope.newCustomer,
					                        type:'bar',
					                        barCategoryGap: '40%',
					                        itemStyle : {
					                            normal: {
					                                label : {
					                                    show: false,
					                                    position: 'insideTop',
					                                    formatter: function(oData){
					                                        return oData.value;
					                                    }
					                                },
					                                color:'#69C4C5'
					                            }
					                        },
					                        data:newcouver
					                    },
					                    {
					                        name:$scope.allCustomer,
					                        type:'line',
					                        barCategoryGap: '40%',
					                        itemStyle : {
					                            normal: {
					                                color:'#F9AB6B'
					                            }
					                        },
					                        data:allcouver
					                    }
					                ]
					            };
					            customerChart.setOption(customerOption);
					        }
					        $scope.clickTest = function(e){
					            $('#total a.time-link').removeClass('active');
					            var value = e.target.getAttribute('value');
					            $('#total a[value = '+value+']').addClass('active');
					            $scope.chouseUrl(value);
					        }					        
                    	})                     
                      
                    }
                };
            }
        ]);
    }
);
