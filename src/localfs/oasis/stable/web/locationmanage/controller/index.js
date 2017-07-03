
define(['jquery',
		'utils',
		'../services/locationConst',
		'../directive/navTab'],function($scope,Utils) {
    return ['$scope', '$http','$state','$compile','$window','$stateParams',
				'$alertService','locConst',function($scope,$http,$state,$compile,$window,$stateParams,
													  $alert,locConst){
			function getRcString(attrName){
				return Utils.getRcString("locationmanage_rc",attrName);
			}

			// init Tab order / '' from menu ,others from inner
 			$scope.navInit = $stateParams.mode === ''
													? 0
													: locConst.getOrder($stateParams.mode);
			// bind the current tab to $scope --- order
			$scope.current = '';

			// probe tab start
			var ON_OFF = getRcString("STATE").split(',');

			/*var getAllDevice = function(){
				$scope.$broadcast('showLoading#probeTable');
				$http.get('/v3/ace' +
						  '/oasis/oasis-rest-probe/restapp' +
						  '/editeprobe/getshop')
					 .then(function(res){
					 	var data = res.data;
					    	if(data.code === 0 && data.data.length !==0){
							    $scope.$broadcast('load#probeTable',data.data)
					    	}
					 })
			}();*/

			var toShowAplist;

			$scope.deviceTableHtml = '<table class="table table-bordered">' +
									 '<tr>' +
									 '<td class="text-left" width="75%">' + getRcString("DEVICE_TITLE").split(',')[0] + '</td>' +
									 // '<td></td>' +
									 '<td class="text-left" width="25%" style="padding-left: 12px">' + getRcString("PROBECONFIG") + '</td>' +
								  	 '</tr>' +
									 '<tr ng-repeat="ac in acList track by $index">' +
									 '<td ng-bind="ac" class="col-sm-9 text-left"></td>' +
									 // '<td></td>' +
									 '<td ng-click="showApListModal(ac)" class="text-left" style="padding-left: 26px;"><a><span class="glyphicon glyphicon-cog" style="font-size: 19px;text-indent: "></span></a></td>' +
									 '</tr>' +
									 '</table>';

			$scope.probeOpt={
				tId:'probeTable',
				striped:false,
				detailView: true,
				url:'/v3/ace/oasis/oasis-rest-probe/restapp/editeprobe/getshop',
				method : "get",
				dataType: "json",
				pagniation:true,
				clickToSelect: true,
				showPageList:false,
				showCheckBox:false,
				responseHandler:function (data){
					if(data.code === 0){
						return {
							total: data.data.length,
							rows: data.data
						}
					}
				},
				columns:[
					{sortable:false,align:'left',field:'shopName',width:'50%',title:getRcString('LOCATION_TITLE').split(",")[0],
						formatter:function(value){
							return '<a class="list-link">'+value+'</a>';
						}
					},
					{sortable:false,align:'left',field:'count',width:'25%',title:getRcString('LOCATION_TITLE').split(",")[3],
						formatter:function(value){
							return '<span style="padding-left: 22px">' + value + '</span>'
						}
					},
					{sortable:false,align:'left',field:'edit',title:getRcString('LOCATION_TITLE').split(",")[2],
						formatter:function(){
							return '<a><span class="glyphicon glyphicon-edit" style="font-size:16px;text-indent: 18px;"></span></a>'
						}
					}
				]
			};

			$scope.$on('click-cell.bs.table#probeTable',function (e, field, value, row, $element){
				if(field=='shopName'){
					$state.go('^.maplist',{shopId:row.shopId,mode:1});
				}else if(field=='edit'){
					$state.go('^.maplist',{shopId:row.shopId,mode:1});
				}
			});

			$scope.$on('expanded-row.bs.table#probeTable', function (e, data) {
				var $ele = $compile($scope.deviceTableHtml)($scope);
				$scope.acList = data.row.acList;
				data.el.append($ele);
				$scope.$apply()
			});

			$scope.probeModal = {
				mId:'probeModal',
				title:getRcString('PROBECONFIG'),
				autoClose: true,
				showCancel: false,
				showFooter:false,
				modalSize:"lg",
				buttonAlign: 'center'
			};

			$scope.APListOpt = {
				tId: "APList",
				showCheckBox: true,
				showRowNumber: false,
				showPageList: false,
				searchable: true,
				clickToSelect: false,
				sidePagination: "server",
				url : "/v3/ant/confmgr",
				method : "post",
				contentType: "application/json",
				dataType: "json",
				beforeAjax: function (params) {
					params.method = 'apTotalNumGet';
					return $http({
						method: "POST",
						url: "/v3/ant/confmgr",
						data: params
					});
				},
				queryParams: function (params) {
					var oParam = $.extend({}, {
						skip: params.offset,
						limit: params.limit,
						sortName: params.sort,
						sort: ( params.order == "asc" ? 1 : -1 )
					},  params.findoption);

					return {
						cloudModule: "WIPS",
						configType: 1,
						devSN: toShowAplist,
						method: "apStatusGet",
						param: oParam
					};
				},
				responseHandler: function (rowsData, totalData) {
					if(typeof rowsData.result === 'string'){
						rowsData.result = []
					}
					if(totalData.data.errCode === 1){
						totalData.data.result = 0
					}
					return {
						total: totalData.data.result,
						rows: rowsData.result
					};
				},
				columns: [
					{
						title: getRcString("APLISTTITLE").split(',')[0],
						field: "apName",
						// width: "20%",
						sortable: true,
						searcher: {type: "text"}
					},
					{
						title: getRcString("APLISTTITLE").split(',')[1],
						field: "radioMode",
						// width: "20%",
						sortable: true,
						searcher: {
							type: "select",
							valueField: "value",
							textField: "text",
							data: [
								{value: "2.4G", text: "2.4G"},
								{value: "5G", text: "5G"}
							]
						}
					},
					{
						title: getRcString("APLISTTITLE").split(',')[2],
						field: "probeStatus",
						// width: "20%",
						sortable: true,
						formatter: function (value) {
							return value === 'off' ? ON_OFF[1] : ON_OFF[0];
						},
						searcher: {
							type: "select",
							valueField: "value",
							textField: "text",
							data: [
								{value: "off", text: ON_OFF[1]},
								{value: "on", text: ON_OFF[0]}
							]
						}
					}
				]
			};

			$scope.showApListModal = function(acSn){
				toShowAplist = acSn;
				$scope.$broadcast('show#probeModal');
				$scope.$broadcast('refresh#APList')
			};

			$scope.switchProbeFun = function (toStatus){
				$scope.$broadcast('getSelections#APList',function(data){
					if(data.length){
						var swichArray = data.map(function(i){
							return {
								apName: i.apName,
								probeStatus: toStatus,
								radioID: i.radioID + ""
							}
						});
						$http
							.post("/v3/ant/confmgr", {
								cloudModule: "PROBE",
								configType: 0,
								devSN: toShowAplist,
								deviceModule: "PROBE",
								method: "probeEnable",
								param: swichArray
							})
							.success(function (res) {
								if(res && res.errCode === 0){
									$scope.$broadcast('refresh#APList');
									return $alert.msgDialogSuccess(getRcString("NOTICE"));
								}
									$alert.msgDialogError(getRcString("NOTICE_FAIL"));
							})
							.error(function () {
								$alert.msgDialogError(getRcString("NOTICE_FAIL"));
							});
					}
				})
			};

			// probe tab end
			// location tab start
	        $scope.locationTable = {
                tId:'locationTable', 
                url:"/v3/ace/oasis/oasis-rest-location/restapp/shop/queryshoplocation?"+$scope.userInfo.user,
	            method:"get", 
                dataField:'shopList',
                totalField:'shopTotalCnt',                
                striped:true,
                showPageList:false,
                searchable: true,  
                /*detailView: true,*/
				responseHandler:function(rowsData){
					// refresh the table by the button in the device modal
					if(g_shopId !== ''){
						var row = rowsData.shopList.find(function(i){
							return i.shopId === g_shopId
						})
						$scope.$broadcast('load#deviceTable',row.acList);
						$scope.$broadcast('hideLoading#deviceTable')
					}
					return rowsData.shopList
				},
                columns:[                             
                    {sortable:true,/*align:'center',*/searcher:{type:"text"},field:'shopName',title:getRcString('LOCATION_TITLE').split(",")[0],
                    	formatter:function(value,row,index){
              				return '<a class="list-link">'+value+'</a>';              			
                    	}
                	},                                   
                    {sortable:false,/*align:'center',*/field:'count',title:getRcString('LOCATION_TITLE').split(",")[3]},                                      

                	{sortable: true, field: 'setting', title:getRcString('LOCATION_TITLE').split(",")[1],
                    	formatter: function (val, row, index) {
                            return '<a><span class="glyphicon glyphicon-cog" style="font-size:16px"></span></a>';
                        }
                	},
                	{sortable: true, field: 'edit', title:getRcString('LOCATION_TITLE').split(",")[2],
                    	formatter: function (val, row, index) {
                            return '<a><span class="glyphicon glyphicon-edit" style="font-size:16px"></span></a>';
                        }
                	}
                ],
            };
            $scope.$on('click-cell.bs.table#locationTable',function (e, field, value, row, $element){
            	if(field == 'shopName'){
	            	$state.go('^.maplist',{shopId:row.shopId,mode:0});
	            }else if(field == 'setting'){
	            	g_shopName = row.shopName;
                    	g_shopId = row.shopId;
			            $scope.$apply(function() {
							$scope.cycleInfo.cycle=parseInt(row.cycle);											
						});
						$scope.$broadcast('load#deviceTable',row.acList);
                    	$scope.$broadcast('show#locationSetting_modal',$scope);	
	            }else if(field == 'edit'){
	            	$state.go('^.maplist',{shopId:row.shopId,mode:0});
	            }
	        });
			// location tab end
			// emBedde tab start
			$scope.emBeddeTable = {
				tId:'emBeddeTable',
				url:"/v3/ace/oasis/oasis-embedded-location/restapp/shop/queryshoplocation?"+$scope.userInfo.user,
				method:"get",
				dataField:'shopList',
				totalField:'shopTotalCnt',
				striped:true,
				showPageList:false,
				searchable: true,
				/*detailView: true,*/
				responseHandler:function(rowsData){
					// refresh the table by the button in the device modal
					if(g_shopId !== ''){
						var row = rowsData.shopList.find(function(i){
							return i.shopId === g_shopId
						});
						$scope.$broadcast('load#deviceTable',row.acList);
						$scope.$broadcast('hideLoading#deviceTable')
					}
					return rowsData.shopList
				},
				columns:[
					{sortable:true,/*align:'center',*/searcher:{type:"text"},field:'shopName',title:getRcString('LOCATION_TITLE').split(",")[0],
						formatter:function(value,row,index){
							return '<a class="list-link">'+value+'</a>';
						}
					},
					{sortable:false,/*align:'center',*/field:'count',title:getRcString('LOCATION_TITLE').split(",")[3]},

					{sortable: true, field: 'setting', title:getRcString('LOCATION_TITLE').split(",")[1],
						formatter: function (val, row, index) {
							return '<a><span class="glyphicon glyphicon-cog" style="font-size:16px"></span></a>';
						}
					},
					{sortable: true, field: 'edit', title:getRcString('LOCATION_TITLE').split(",")[2],
						formatter: function (val, row, index) {
							return '<a><span class="glyphicon glyphicon-edit" style="font-size:16px"></span></a>';
						}
					}
				],
			};
			$scope.$on('click-cell.bs.table#emBeddeTable',function (e, field, value, row, $element){
				if(field === 'shopName'){
					$state.go('^.maplist',{shopId:row.shopId,mode:2});
				}else if(field == 'setting'){
					g_shopName = row.shopName;
					g_shopId = row.shopId;
					$scope.$apply(function() {
						$scope.cycleInfo.cycle = parseInt(row.cycle);
					});
					$scope.$broadcast('load#deviceTable',row.acList);
					$scope.$broadcast('show#locationSetting_modal',$scope);
				}else if(field == 'edit'){
					$state.go('^.maplist',{shopId:row.shopId,mode:2});
				}
			});


			// modal common -- location / emBedde
			var aData = [],
				g_shopId = "",
				g_shopName = "";
			var prefix = {
				0:'/v3/ace/oasis/oasis-rest-location/restapp',
				2:'/v3/ace/oasis/oasis-embedded-location/restapp'
			};
			$scope.btndisabled = true;
			$scope.cycleInfo = {
				cycle:5
			};
			$scope.refresh=function(){
				$scope.$broadcast('refresh#locationTable');
				$scope.$broadcast('refresh#emBeddeTable');
				//refresh locationTable and show deviceTable's loader
				//load date and hide the loader in the responseHander of locationTable
				//location and embedded use the same table
				$scope.$broadcast('showLoading#deviceTable');
			};
			$scope.open=function(){
				$scope.$broadcast('getAllSelections#deviceTable',{},function(data){
					var obj={};
					for(var i=0;i<data.length;i++){
						obj={
							acName:data[i].acName,
							acSn:data[i].acSn,
							state:0
						};
						aData.push(obj);
					}

					$http({
						url:prefix[locConst.getMode($scope.current)] + "/shop/turnon",
						method:"POST",

						data:{
							shopId:g_shopId,
							shopName:g_shopName,
							cycle:parseInt($scope.cycleInfo.cycle),
							acList:aData
						}
					}).success(function(response){
						if(response.code == 2){
							$alert.msgDialogError(getRcString("NO_PROMISSION"),'error');
						}else{
							$alert.msgDialogSuccess(getRcString("NOTICE"));
						}
					}).error(function(response){
						$alert.msgDialogError(getRcString("NOTICE_FAIL"),'error');
					});
				});
			};
			$scope.close=function(){
				$scope.$broadcast('getAllSelections#deviceTable',{},function(data){

					var obj={},aData=[];

					for(var i=0;i<data.length;i++){
						obj={
							acName:data[i].acName,
							acSn:data[i].acSn,
							state:1
						}
						aData.push(obj);
					}

					$http({
						url:prefix[locConst.getMode($scope.current)] + "/shop/turnoff",
						method:"POST",

						data:{
							shopId:g_shopId,
							shopName:g_shopName,
							cycle:parseInt($scope.cycleInfo.cycle),
							acList:aData
						}
					}).success(function(response){
						if(response.code == 2){
							$alert.msgDialogError(getRcString("NO_PROMISSION"),'error');
						}else if(response.code == 1){
							$alert.msgDialogError(getRcString("NOTICE_FAIL"),'error');
						}else{
							$alert.msgDialogSuccess(getRcString("NOTICE"));
						}

					}).error(function(response){
						$alert.msgDialogError(getRcString("NOTICE_FAIL"),'error');
					});
				});
			};
			$scope.submit = function(){
				$http({
					url:prefix[locConst.getMode($scope.current)] + "/shop/savecycle",
					method:"POST",
					data:{
						shopId:g_shopId,
						shopName:g_shopName,
						cycle:parseInt($scope.cycleInfo.cycle),
					}
				}).success(function(response){
					if(response.code == 2){
						$alert.msgDialogError(getRcString("NO_PROMISSION"),'error');
					}else if(response.code == 1){
						$alert.msgDialogError(getRcString("NOTICE_FAIL"),'error');
					}else{
						$alert.msgDialogSuccess(getRcString("MODIFY"));
					}

				}).error(function(response){
					$alert.msgDialogError(getRcString("NOTICE_FAIL"),'error');
				});
			};
			var checkEvt = [
				"check.bs.table#deviceTable","uncheck.bs.table#deviceTable",
				"check-all.bs.table#deviceTable","uncheck-all.bs.table#deviceTable",
			];
			angular.forEach(checkEvt, function (value, key, values) {
			$scope.$on(value, function () {
				$scope.$broadcast("getSelections#" + value.split("#")[1], function (data) {
					$scope.$apply(function () {
						$scope.btndisabled = !data.length;
					});
				});
			});
		});

			$scope.deviceTable = {
			tId:'deviceTable',
			striped:false,
			pagniation:true,
			clickToSelect: true,
			showPageList:false,
			showCheckBox:true,
			columns:[
				{sortable:false,align:'center',field:'acSn',title:getRcString('DEVICE_TITLE').split(",")[0]},
				{sortable:false,align:'center',field:'acName',title:getRcString('DEVICE_TITLE').split(",")[1]},
				{sortable:false,align:'center',field:'state',title:getRcString('DEVICE_TITLE').split(",")[2],
					formatter: function(value, row, index){
						if(row.state==0){
							value=getRcString('STATE').split(",")[0];
							return value;
						}else{
							value=getRcString('STATE').split(",")[1];
							return value;
						}
					}
				},
			]
		};
			$scope.locationSetting_modal = {
				options:{
					mId:'locationSetting_modal',
					title:getRcString('SETTING'),
					autoClose: true,
					showCancel: false,
					showFooter:false,
					modalSize:"lg",
					buttonAlign: 'center'
				}
		};
	}]
});