define(['angularAMD', 'utils', 'echarts','sprintf'],
    function (app, utils) {

        var sLang = utils.getLang() || 'cn';
        var URL_TEMPLATE_FILE = sprintf('../liveness88/views/%s/noise_rate.html', sLang);
        // var modeUrl = '/stamonitor/getclientlistbycondition';
        // var bybyodUrl = '/stamonitor/getclientlistbycondition';

        app.directive('noiserate', ['$timeout','$state','$rootScope', '$http', '$q',
            function ($timeout,$state,$rootScope, $http, $q) {
                return {
                    templateUrl: URL_TEMPLATE_FILE,
                    restrict: 'E',
                    scope: {
                        sn: '@'
                    },
                    replace: true,
                    controller: function ($scope,$element, $attrs, $transclude) {
                    },
                    link: function ($scope,$element, $attrs, $ngModel) {
                       var aData =[
			                [
				                {'macAddress':'741f-4qe3-6280','rssi':'24'},
				                {'macAddress':'741f-4qe3-6281','rssi':'10'}
				            ],
				            [
				            	{'macAddress':'741f-4qe3-6280','negoRate':'24'},
				                {'macAddress':'741f-4qe3-6281','negoRate':'10'}
				            ]
			            ];
				     	var oModalPub = {
				     		autoClose: true,
							showCancel: false,
							showOk: false,
							modalSize: 'lg',
							showHeader: true,
							showFooter: false,
							showClose: true
				     	}

				     	var oTablePub = {
				     		striped: true,
				            pagniation: true,
				            clickToSelect: true,
				     	}

				     	var pieOption = {
				     		tooltip: {
						        trigger: 'item',
						        formatter: "{a} <br/>{b}: {c} ({d}%)"
						    },
						    series: [
						        {
						            type:'pie',
						            center:['35%','50%'],
						            radius: ['45%', '65%'],
						            avoidLabelOverlap: false,
						            itemStyle : {
						                normal : {
						                    label : {
						                        show : false
						                    },
						                    labelLine : {
						                        show : false
						                    }
						                },
						                emphasis : {
						                    label : {
						                        show : false,
						                        position : 'center',
						                        textStyle : {
						                            fontSize : '30',
						                            fontWeight : 'bold'
						                        }
						                    }
						                }
					            	},
						            data:[
						            ]
						        }
						    ],
						    color:['#4ec1b2',"#78cec3","#7fdbcf","#b3b7dd","#c8c3e1","#d6d1f0","#4fc4f6"]
				     	}
				     	var pieOptionObj = {
				     		noisePie:{
				     			legend: {
							        orient: 'vertical',
							        x: '65%',
							        y:'20%',
							        data:['<15','15-20','20-25','25-30','30-35','35-40','>40']
							    },
							    series:[
							    	{
							    		data:[
								    		{value:300, name:'<15'},
							                {value:200, name:'15-20'},
							                {value:0, name:'20-25'},
							                {value:100, name:'25-30'},
							                {value:0, name:'30-35'},
							                {value:0, name:'35-40'},
							                {value:0, name:'>40'}
							    		]
							    	}
							    ]
				     		},
				     		negoRatePie:{
				     			legend: {
							        orient: 'vertical',
							        x: '65%',
							        y:'20%',
							        data:['<11','11-36','36-56','56-100','100-300','>300']
							    },
							    series:[
							    	{
							    		data:[
								    		{value:300, name:'<11'},
							                {value:200, name:'11-36'},
							                {value:0, name:'36-56'},
							                {value:100, name:'56-100'},
							                {value:0, name:'100-300'},
							                {value:0, name:'>300'}
							    		]
							    	}
							    ]
				     		}
				     	}
						$scope.drawNoiseType = function () {
							var noiseChart = echarts.init(document.getElementById('noise_type'));
							var noiseOption = $.extend(true, {},pieOptionObj.noisePie,pieOption);
							
							noiseChart.setOption(noiseOption);
							noiseChart.on('click', function (param) {
				                $scope.$broadcast('show#clientByNoiseOption');
				                $scope.$broadcast('load#clientByNoiseTable');
				                
				            });
						}

						$scope.drawRateType = function () {
							var rateChart = echarts.init(document.getElementById('negoRate_type'));
							var rateOption = $.extend(true, {},pieOptionObj.negoRatePie,pieOption);
							
							rateChart.setOption(rateOption);
							rateChart.on('click', function (param) {
				                $scope.$broadcast('show#clientByRateOption');
				                $scope.$broadcast('load#clientByRateTable');
				                
				            });
						}

						$scope.drawNoiseType();
						$scope.drawRateType();
						$scope.clientByNoiseOption = $.extend(true, {},{
							mId: 'clientByNoiseOption',
							title: $scope.ClientByTimeOption
						}, oModalPub);
						

						$scope.clientByNoiseTable = $.extend(true, {},{
				            tId: 'clientByNoiseTable',
				            columns: [
				                { sortable: true, field: 'macAddress', title: $scope.NoiseInfo.split(',')[0],
				                	formatter: function(value,row,index){
				                        return '<a class="list-link">'+value+'</a>';
				                    } 
				                  },
				                { sortable: true, field: 'rssi', title: $scope.NoiseInfo.split(',')[1] }
				     
				            ],
				            data:aData[0]
				        },oTablePub);
						
						$scope.clientByRateOption = $.extend(true, {},{
							mId: 'clientByRateOption',
							title: $scope.ClientByTimeOption
						}, oModalPub);

						$scope.clientByRateTable = $.extend(true, {},{
							tId: 'clientByNoiseTable',
				            columns: [
				                { sortable: true, field: 'macAddress', title: $scope.rateInfo.split(',')[0],
				                	formatter: function(value,row,index){
				                        return '<a class="list-link">'+value+'</a>';
				                    } 
				                  },
				                { sortable: true, field: 'negoRate', title: $scope.rateInfo.split(',')[1]}
				     
				            ],
				            data:aData[1]
						}, oTablePub);
						
				        $scope.$on('click-cell.bs.table#clientByNoiseTable',function (e, field, value, row, $element){
				            var date = new Date().Format('yyyy-MM-dd');
				            if(field == 'macAddress'){
				                $state.go('^.exception88',{macAddress:row.macAddress,ipAddress:'N/A',date:date}); 
				                $rootScope.modalInfo.count = 0; 
				            }
				        });

				        $scope.$on('click-cell.bs.table#clientByRateTable',function (e, field, value, row, $element){
				            var date = new Date().Format('yyyy-MM-dd');
				            if(field == 'macAddress'){
				                $state.go('^.exception88',{macAddress:row.macAddress,ipAddress:'N/A',date:date}); 
				                $rootScope.modalInfo.count = 0; 
				            }
				        });    
                    }
                };
            }
        ]);
    }
);

