define(['angularAMD', 'utils', 'sprintf'],
    function (app, utils) {

        var sLang = utils.getLang() || 'cn';
        var URL_TEMPLATE_FILE = sprintf('../wirelessterminal2/views/%s/wireless_minal.html', sLang);
        var conditionApUrl = '/stamonitor/getApClientNumBydevSN';
        var conditionSsidUrl = '/stamonitor/getclientlistbycondition';
		var sURL_staMonitor = "/stamonitor/clientstreamvalue";

        app.directive('wirelessminal', ['$timeout', '$rootScope', '$http', '$q',
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
						function getRcText(str) {
							return str.split(",");
						}

                        $http.get(conditionApUrl+'?devSN='+$scope.sn				            
				            ).success(function(data){
				                var aData = [];
				                $.each(data.message,function(i,item){
				                    aData[i]={};
				                    aData[i].ApName = item.ApName;
				                    aData[i].Count5G = item.count5G || '0';
				                    aData[i].Count2G = item.count2G || '0';
				                });        
				                $scope.$broadcast('load#ap',aData);
				            }).error(function(){          
				        });

						$scope.show = {
							APList: true,
							today: true
						};
						$scope.leftSwitch = function (button) {
							$scope.show.APList = (button !== "SSID");

						};
						$scope.rightSwitch = function (button) {
							$scope.show.today = (button !== "week");

						};

						$scope.todayFlow = {
							tId: "today",
							method: "post",
							url: sURL_staMonitor,
							contentType:'application/json',
							dataType:'json',
							showRowNumber: true,
							paginationSize: "sm",
							pagination: false,
							pageSize:5,
							showPageList: false,
							//dataField:'',
							queryParams:function(params){
								params.order = undefined;
								params.method = "clientDownStreamTodayRank";
								params.param = {devSN: $scope.sn};
								return params;
							},
							responseHandler: function (data) {
								return {
									total: data.response.length,
									rows: data.response
								};
							},
							columns: [
								{field: 'clientMAC', title: getRcText($scope.todayFlowHeader)[0]},
								//{field: 'userName', title: getRcText($scope.todayFlowHeader)[1]},
								{
									field: 'clientRxBytes',
									title: getRcText($scope.todayFlowHeader)[2],
									formatter: function (value, rows) {
										var nKB = 1,
											nMB = 1024 * nKB,
											nGB = 1024 * nMB,
											nTB = 1024 * nGB;
										if (value >= nTB) {
											return (value / nTB).toFixed(2) + " TB";
										} else if (value >= nGB) {
											return (value / nGB).toFixed(2) + " GB";
										} else if (value >= nMB) {
											return (value / nMB).toFixed(2) + " MB";
										} else {
											return (value / nKB).toFixed(2) + " KB";
										}
									}
								}
							]

						};

						/*$scope.weekFlow = {
							tId: "week",
							method: "post",
							url: sURL_staMonitor,
							contentType:'application/json',
							dataType:'json',
							showRowNumber: true,
							paginationSize: "sm",
							pagination: false,
							pageSize:5,
							showPageList: false,
							//dataField:'',
							queryParams:function(params){
								params.order = undefined;
								params.method = "clientDownStreamOneweekRank";
								params.param = {devSN: $scope.sn};
								return params;
							},
							columns: [
								{field: 'clientMAC', title: getRcText($scope.todayFlowHeader)[0]},
								{field: 'userName', title: getRcText($scope.todayFlowHeader)[1]},
								{
									field: 'clientRxBytes',
									title: getRcText($scope.todayFlowHeader)[2],
									formatter: function (value, rows) {
										var nKB = 1,
											nMB = 1024 * nKB,
											nGB = 1024 * nMB,
											nTB = 1024 * nGB;
										if (value >= nTB) {
											return (value / nTB).toFixed(2) + " TB";
										} else if (value >= nGB) {
											return (value / nGB).toFixed(2) + " GB";
										} else if (value >= nMB) {
											return (value / nMB).toFixed(2) + " MB";
										} else {
											return (value / nKB).toFixed(2) + " KB";
										}
									}
								}
							]
						};*/

				        $scope.options={
				            tId:'ap',
				            pageSize:5,
							paginationSize: "sm",
							//height: 270,
				            showPageList:false,
				            searchable:true,
				            columns:[
				                {sortable:true,field:'ApName',title:$scope.apGroupName,searcher:{}},
				                {sortable:true,field:'Count5G',title:$scope.clientCount_5,formatter:showNum,searcher:{}},
				                {sortable:true,field:'Count2G',title:$scope.clientCount_2,formatter:showNum,searcher:{}}
				            ],
				        }; 

				        $http.get(conditionSsidUrl+'?devSN='+$scope.sn+'&reqType=ssid'				           				            
				            ).success(function(data){
				                var bData = [];
				                var aData = data.clientList;
				                $.each(aData,function(i,item){
				                   bData[i] = {};
				                   bData[i].ssid = item.clientSSID;
				                   bData[i].clientCout_5 = item.Count5G;
				                   bData[i].clientCout_2 = item.Count24G;
				                });
				                $scope.$broadcast('load#ssid',bData);    
				            }).error(function(data,header,config,status){
				        }); 

				        $scope.ssidoptions={
				            tId:'ssid',
				            pageSize:5,
							paginationSize: "sm",
							//height: 270,
				            searchable:true,
				            showPageList:false,
				            columns:[
				                {sortable:true,field:'ssid',title:$scope.ssidName,searcher:{}},
				                {sortable:true,field:'clientCout_5',title:$scope.clientCount_5,formatter:showNum,searcher:{}},
				                {sortable:true,field:'clientCout_2',title:$scope.clientCount_2,formatter:showNum,searcher:{}}
				            ],
				        }; 

				        function showNum(value, row, index){
							return ( value == "0" ? value : ('<a class="list-link">' + value + '</a>') );
				        }

						$scope.$on("load-success.bs.table#maoxian", function (evt, data) {
							$(window).trigger("resize");
						});

				        var apart = "";
				        var other = "";
				        var clickCellEvt = ["click-cell.bs.table#ssid","click-cell.bs.table#ap"];
				        angular.forEach(clickCellEvt, function (value, key, values) {
				            $scope.$on(value, function (evt, field, value, row, $ele) {                              
				                if(field == "clientCout_5" && value!= 0){
				                    apart = row.ssid;
				                    other = "mode5G";
				                    $scope.$broadcast('refresh#maoxian', {
				                        url: '/v3/stamonitor/getclientlist_byssidandmode?devSN='+$scope.sn+'&mode='+other+'&ssid='+apart,
				                    });
				                    $scope.$broadcast("show#delog");
				                }else
				                if(field == "clientCout_2" && value!= 0){
				                    apart = row.ssid;
				                    other = "mode24G";
				                    $scope.$broadcast('refresh#maoxian', {
				                        url: '/v3/stamonitor/getclientlist_byssidandmode?devSN='+$scope.sn+'&mode='+other+'&ssid='+apart,
				                    });
				                    $scope.$broadcast("show#delog"); 
				                }else
				                if(field == "Count5G" && value!= 0){
				                    apart = row.ApName;
				                    other = "5G";
				                    $scope.$broadcast('refresh#houzi', {
				                        url: '/stamonitor/getClientInfosByRadioType?devSN='+$scope.sn+'&radioType='+other+'&ApName='+apart,
				                    });
				                    $scope.$broadcast("show#feifei");
				                }else
				                if(field == "Count2G" && value!= 0){
				                    apart = row.ApName;
				                    other = "2.4G";
				                    $scope.$broadcast('refresh#houzi', {
				                        url: '/stamonitor/getClientInfosByRadioType?devSN='+$scope.sn+'&radioType='+other+'&ApName='+apart,
				                    });
				                    $scope.$broadcast("show#feifei");
				                }
				            });           
				        });

				        $scope.houzi={
				            tId:'houzi',
				            pageSize:10,
				            showPageList:false,
				            pageParamsType: 'path',
				            method: "post",
				            searchable:true,
				            sidePagination: "server",
				            contentType: "application/json",
				            dataType: "json",
							startField: 'skipnum',
							limitField: 'limitnum',
							queryParams: function (params) {
				                var oBody = {
				                    sortoption: {}
				                };
				                if (params.sort) {
				                    oBody.sortoption[params.sort] = (params.order == "asc" ? 1 : -1);
				                }
				                params.start = undefined;
				                params.size = undefined;
				                params.order = undefined;
				                return $.extend(true,{},params,oBody);
				            },
				            responseHandler: function (data) {
				            	var wheredata = data.message.clientInfos;
					                $.each(wheredata, function (i,item) {
					                    if(item.clientVendor==""){
					                        item.clientVendor= $scope.header_6;
					                    }    
					                });
				                return {
				                    total: data.message.totalNum,
				                    rows: data.message.clientInfos
				                };  
				            },
				            columns:[
				                {sortable:true,searcher:{},field:'clientMAC',title:$scope.header_1},
				                {sortable:true,searcher:{},field:'clientIP',title:$scope.header_2},
				                {sortable:true,field:'clientVendor',title:$scope.header_3, formatter: function (value) {
									return (!value ? $scope.header_6 : value);
								}},
				                {sortable:true,searcher:{},field:'ApName',title:$scope.header_4},
				                {sortable:true,field:'clientSSID',title:$scope.header_5}
				            ]
				        };

				        $scope.maoxian={
				            tId:'maoxian',
				            pageSize:10,
				            showPageList:false,
				            pageParamsType: 'path',
				            method: "post",
				            searchable:true,
				            sidePagination: "server",
				            contentType: "application/json",
				            dataType: "json",
				            startField: 'skipnum',     
				            limitField: 'limitnum',       
				            queryParams: function (params) {
				                var oBody = {
				                    sortoption: {}
				                };
				                if (params.sort) {
				                    oBody.sortoption[params.sort] = (params.order == "asc" ? 1 : -1);
				                }
				                params.start = undefined;
				                params.size = undefined;
				                params.order = undefined;
				                return $.extend(true,{},params,oBody);
				            },
				            responseHandler: function (data) {
				                return {
				                    total: data.clientList.count_total,
				                    rows: data.clientList.clientInfo
				                };  
				            },
				            columns:[
				                {sortable:true,searcher:{},field:'clientMAC',title:$scope.header_1},
				                {sortable:true,searcher:{},field:'clientIP',title:$scope.header_2},
				                {sortable:true,field:'clientVendor',title:$scope.header_3, formatter: function (value) {
									return (!value ? $scope.header_6 : value);
								}},
				                {sortable:true,searcher:{},field:'ApName',title:$scope.header_4},
				                {sortable:true,field:'clientSSID',title:$scope.header_5}
				            ]
				        };

				        $scope.maoxian1 = {
				            mId:'delog',                             
				            title:$scope.modal_title,
				            autoClose: true ,                        
				            showCancel: false ,                       
				            modalSize:'lg' ,                     
				            showHeader:true,                        
				            showFooter:true ,                        
				            okText: $scope.modal_okText,
				            // cancelText: '关闭',  //取消按钮文本
				            okHandler: function(modal,$ele){
				                
				            },
				            cancelHandler: function(modal,$ele){
				               
				            },
				            beforeRender: function($ele){
				                
				                return $ele;
				            }
				        };  

				        $scope.feifei = {
				            mId:'feifei',                             
				            title:$scope.modal_title,
				            autoClose: true ,                        
				            showCancel: false ,                       
				            modalSize:'lg' ,                     
				            showHeader:true,                        
				            showFooter:true ,                        
				            okText: $scope.modal_okText,
				            // cancelText: '关闭',  //取消按钮文本
				            okHandler: function(modal,$ele){
				                
				            },
				            cancelHandler: function(modal,$ele){
				               
				            },
				            beforeRender: function($ele){
				                
				                return $ele;
				            }
				        };

				        $scope.$on('hidden.bs.modal#delog',function(){ 
				            $scope.$broadcast('hideSearcher#maoxian');  //  实现了搜索表头的折叠
				        });

				        $scope.$on('hidden.bs.modal#feifei',function(){ 
				            $scope.$broadcast('hideSearcher#houzi');  //  实现了搜索表头的折叠
				        });
                    }
                };
            }
        ]);
    }
);
