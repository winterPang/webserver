define(['angularAMD','echarts3','jquery'],function(angularAMD,echarts,$){
	angularAMD.directive('echartNodataPie',[function(){
				return {
					restrict: 'EA',
					template: '<div></div>',
					replace: true,
					scope: {
						option : "="
					},
					controller:function($scope){
					},
					link:function(scope, element, attrs, controller){
						//scope.echartPieId = attrs.id;
						var nodataEchartsInit = echarts.init($('#'+attrs.id)[0]);
						var option = {
								color: ['#e7e7e9','#e7e7e9'],
								tooltip: {
									trigger: 'item',
									formatter: "{b}: {c} ({d}%)"
								},
								series: [
									{
										type: 'pie',
										center: ['45%', '50%'],
										radius: ['50%', '80%'],
										avoidLabelOverlap: true,
										label: {
											normal: {
												show: true,
												position: 'inside',
												textStyle: {
													color: '#fff'
												}
											},
											emphasis: {
												show: true,				
												textStyle: {
													color: 'rgb(177,177,177)',
													fontStyle: 'normal',
													fontWeight: 'bold',
													fontFamily: 'SimSun',
													fontSize: '20'
												}
											}
										},
										itemStyle: {
											normal: {
												borderColor: '#fff',
												borderWidth: 1,
												borderType: 'solid',

											}
											// emphasis:{
											// 	color:'rgb(177,177,177)'
											// }
										},
										data: [{name:'N/A',value:0}]
									}
								]
						};
						nodataEchartsInit.setOption(option);
					}
				}
	}])
})