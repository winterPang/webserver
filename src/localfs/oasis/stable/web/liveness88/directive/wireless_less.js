define(['angularAMD', 'utils', 'echarts','sprintf'],
    function (app, utils,echarts) {

        var sLang = utils.getLang() || 'cn';
        var URL_TEMPLATE_FILE = sprintf('../liveness88/views/%s/wireless_less.html', sLang);
        var modeUrl = '/stamonitor/getclientlistbycondition';
        var bybyodUrl = '/stamonitor/getclientlistbycondition';

        app.directive('xanthcount', ['$timeout', '$rootScope', '$http', '$q',
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
                        $http.get(modeUrl+'?devSN='+$scope.sn+'&reqType=mode'				            				        
				            ).success(function(data){  
				                var newObject=data.clientList;
				                var Num5G = 0;
				                var Num2G = 0;
				                var count_one = 0,
									count_two = 0,
									count_three = 0,
									count_four = 0,
									count_five = 0,
									count_six = 0;
								// var count_one = 3,
								// 	count_two = 4,
								// 	count_three = 5,
								// 	count_four = 6,
								// 	count_five = 7,
								// 	count_six = 8;	
								function getVal(val) {
									return val == 0 ? undefined : val;
								}
				                for (var i = 0; i < newObject.length; i++){
				                    if(newObject[i]._id == '802.11ac'){
				                        count_one = newObject[i].clientCount
				                    }else
				                    if(newObject[i]._id == '802.11an'){
				                        count_two = newObject[i].clientCount
				                    }else
				                    if(newObject[i]._id == '802.11a'){
				                        count_three = newObject[i].clientCount
				                    }else
				                    if(newObject[i]._id == '802.11gn'){
				                        count_four = newObject[i].clientCount
				                    }else
				                    if(newObject[i]._id == '802.11g'){
				                        count_five = newObject[i].clientCount
				                    }else
				                    if(newObject[i]._id == '802.11b'){
				                        count_six = newObject[i].clientCount
				                    }
				                }
				                Num5G = count_one + count_two + count_three;
				                Num2G = count_four + count_five + count_six;
								var terminalType = document.getElementById('Terminal_type');
								if (!terminalType) {return;}
				                terminalType = echarts.init(terminalType);
				                if(Num5G == 0 && Num2G == 0){
				                    terminalType.setOption(grayLastOption);
				                    return;
				                }   
				                terminalType.on(echarts.config.EVENT.CLICK, function(data){
				                    other = data.data.name;
				                    apart = other.split("(")[0];
				                    $scope.$broadcast('refresh#clientMode', {
				                        url: '/v3/stamonitor/getclientlist_bymodeorvendor?devSN='+$scope.sn,  
				                    });
				                    $scope.$broadcast("show#clientModeOf");
				                }); 

				                var terminalOption={
				                    tooltip: {
				                    trigger: 'item',
				                    formatter: "{a} {b}: <br/>{c} ({d}%)"
				                    },
				                    legend: {
				                        orient: 'vertical',
				                        x:'65%',
				                        y : '20%',
				                        data:['802.11ac(5GHz)','802.11an(5GHz)','802.11a(5GHz)','802.11gn(2.4GHz)','802.11g(2.4GHz)','802.11b(2.4GHz)']
				                    },
									calculable: false,
				                    series: [
				                        {
				                            type:'pie',
				                            radius: '37%',
				                            center: ['35%', '50%'],
				                            itemStyle: {
				                                normal: {
													borderColor: "#FFF",
													borderWidth: 1,
				                                    labelLine:{
				                                        show:false
				                                    },
				                                    color:
				                                        function(a,b,c,d) {
				                                        var colorList = ['#4ec1b2','#b3b7dd'];
				                                        return colorList[a.dataIndex];
				                                    },
				                                    label:
				                                    {
				                                        position:"inner",
														formatter: '{b}'
				                                    }
				                                }
				                            },
				                            data:  
				                            [
				                                {name:'5GHz',value:getVal(Num5G)},
				                                {name:'2.4GHz',value:getVal(Num2G)}
				                            ]
				                            // [
				                            //     {name:'5GHz',value:10},
				                            //     {name:'2.4GHz',value:30}
				                            // ]
				                        },
				                        {
				                            type:'pie',
				                            radius : ['45%','65%'],
				                            center: ['35%', '50%'],
				                            itemStyle: {
				                                normal: {
													borderColor: "#FFF",
													borderWidth: 1,
				                                    labelLine:{
				                                        show:false
				                                    },
				                                    label:
				                                    {
				                                        //position:"inner",
				                                        show:false,
														formatter:function(a,b,c,d) {
															return a.percent +"%";
														}
				                                    }
				                                }
				                            },
				                            data:
				                            [
				                                {name:'802.11ac(5GHz)',value:getVal(count_one)},
				                                {name:'802.11an(5GHz)',value:getVal(count_two)},
				                                {name:'802.11a(5GHz)',value:getVal(count_three)},
				                                {name:'802.11gn(2.4GHz)',value:getVal(count_four)},
				                                {name:'802.11g(2.4GHz)',value:getVal(count_five)},
				                                {name:'802.11b(2.4GHz)',value:getVal(count_six)}
				                            ]
				                            // [
				                            //     {name:'802.11ac(5GHz)',value:5},
				                            //     {name:'802.11an(5GHz)',value:6},
				                            //     {name:'802.11a(5GHz)',value:9},
				                            //     {name:'802.11gn(2.4GHz)',value:12},
				                            //     {name:'802.11g(2.4GHz)',value:20},
				                            //     {name:'802.11b(2.4GHz)',value:7}
				                            // ]
				                        }
				                    ],
				                    color: ['#4ec1b2','#78cec3','#95dad1','#b3b7dd','#c8c3e1','#e7e7e9']
				                };
				                terminalType.setOption(terminalOption);
				            }).error(function(){               
				        });

				        $http.get(bybyodUrl+'?devSN='+$scope.sn+'&reqType=vendor'				            
				            ).success(function(data){
				                var oData=data.clientList;
				                /* 20170602 - 新需求修改 */
				                var nOtherVendor = 0;
				                var aLegend=[];
				                var aData=[];
				                $.each(oData,function(i,item){
				                	if (item._id==='' || item._id==='other' || aData.length===5) {
                                        nOtherVendor += item.clientCount;
									} else {
                                        aLegend[aLegend.length]=item._id || $scope.viewTittle;
                                        aData[aData.length]={};
                                        aData[aData.length-1].name=item._id || $scope.viewTittle;
                                        aData[aData.length-1].value=item.clientCount || undefined;
									}
				                });
				                if (nOtherVendor!==0) {
                                    aData.push({name: 'other', value: nOtherVendor});
                                    aLegend.push('other');
                                }
				                Array.prototype.removeByValue = function(val) {
									for(var i=0; i<this.length; i++) {
									    if(this[i] == val) {
									        this.splice(i, 1);
									        break;
									    }
									}
								}
				                var apendfor = [];
				                var otherclent = [];
				                $.extend(apendfor,aLegend);
				                apendfor.removeByValue("other");
                            	otherclent = apendfor.length===0 ? [] : apendfor.join().split(",");
								var terminalFirm = document.getElementById("Terminal_firm");
								if (!terminalFirm) {return;}
				                terminalFirm = echarts.init(terminalFirm);
				                if(aData.length == 0){
				                    terminalFirm.setOption(grayLastOption);
				                    return;
				                }
				                terminalFirm.on(echarts.config.EVENT.CLICK, function(data){
				                    apart = data.data.name;
				                    if(apart == "other"){
				                    	apart = {$nin:otherclent};	  
				                    }else
				                    if(apart == $scope.viewTittle){
				                        apart = "";
				                    }
				                    $scope.$broadcast('refresh#clientType', {
				                        url: '/v3/stamonitor/getclientlist_bymodeorvendor?devSN='+$scope.sn,
				                    });
				                    $scope.$broadcast("show#clientTypeOf");  
				                }); 
				                var terFirmOption = {
				                    tooltip: {
				                    trigger: 'item',
				                    formatter: "{a} {b}: <br/>{c} ({d}%)"
				                    },
				                    legend: {
				                        orient: 'vertical',
				                        x : '65%',
				                        y:'20%',
				                        data:
				                        aLegend,                             
				                        // ['苹果','小米','三星','华为'], 
				                        y: '10%'
				                    },
				                    series: [
				                        {
				                            type:'pie',
				                            radius: ['45%','65%'],
				                            center: ['35%', '50%'],
				                            avoidLabelOverlap: false,
				                            itemStyle: {
				                                normal: {
													borderColor: "#FFF",
													borderWidth: 1,
				                                    labelLine:{
				                                        show:false
				                                    },
				                                    label:
				                                    {
				                                        //position:"inner",
				                                        show:false,
														formatter: function(a,b,c,d){
															return a.percent+"%";
														}
				                                    }
				                                }
				                            },
				                            data:
				                            aData
				                            // [
				                            //     { name: '苹果', value: 13},
				                            //     { name: '小米', value: 17},
				                            //     { name: '三星', value: 25},
				                            //     { name: '华为', value: 39}
				                            // ]              
				                        }
				                    ],
				                    color:['#4fc4f6','#78cec3','#4ec1b2','#f2bc98','#fbceb1','#fe808b','#ff9c9e','#e7e7e9']
				                };
				                terminalFirm.setOption(terFirmOption);
				            }).error(function(){               
				        });

				        var grayLastOption = {
				            height:200,
				            calculable : false,
				            series : [
				                {
				                    type:'pie',
				                    radius : '65%',
				                    center: ['35%', '50%'],
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
				        };

				        $scope.clientMode={
				            tId:'clientMode',
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
				                    mode : apart,				                       
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
				            	var wheredata = data.clientList.clientInfo;
				                $.each(wheredata, function (i,item) {
				                    if(item.clientVendor==""){
				                        item.clientVendor=$scope.viewTittle;
				                    }    
				                });
				                return {
				                    total: data.clientList.count_total,
				                    rows: data.clientList.clientInfo
				                };  
				            },
				            columns:[
				                {sortable:true,searcher:{},field:'clientMAC',title:$scope.header_1},
				                {sortable:true,searcher:{},field:'clientIP',title:$scope.header_2},
				                {sortable:true,searcher:{},field:'clientVendor',title:$scope.header_3},
				                {sortable:true,searcher:{},field:'ApName',title:$scope.header_4},
				                {sortable:true,searcher:{},field:'clientSSID',title:$scope.header_5}
				            ],
				        };

				        $scope.clientType={
				            tId:'clientType',
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
				                	vendor : apart,			                       
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
				            	var wheredata = data.clientList.clientInfo;
				                $.each(wheredata, function (i,item) {
				                    if(item.clientVendor==""){
				                        item.clientVendor=$scope.viewTittle;
				                    }    
				                });
				                return {
				                    total: data.clientList.count_total,
				                    rows: data.clientList.clientInfo
				                };  
				            },
				            columns:[
				                {sortable:true,searcher:{},field:'clientMAC',title:$scope.header_1},
				                {sortable:true,searcher:{},field:'clientIP',title:$scope.header_2},
				                {sortable:true,searcher:{},field:'clientVendor',title:$scope.header_3},
				                {sortable:true,searcher:{},field:'ApName',title:$scope.header_4},
				                {sortable:true,searcher:{},field:'clientSSID',title:$scope.header_5}
				            ],
				        };

				        $scope.clientModeOf = {
				            mId:'clientModeOf',                             
				            title:$scope.maoxian1_title,                           
				            autoClose: true ,                        
				            showCancel: false ,                       
				            modalSize:'lg' ,                     
				            showHeader:true,                        
				            showFooter:true ,                        
				            okText: $scope.maoxian1_okText,  
				            // cancelText: '关闭',  //取消按钮文本
				            okHandler: function(modal,$ele){
				                
				            },
				            cancelHandler: function(modal,$ele){
				               
				            },
				            beforeRender: function($ele){
				                
				                return $ele;
				            }
				        }; 

				        $scope.clientTypeOf = {
				            mId:'clientTypeOf',                             
				            title:$scope.maoxian1_title,                           
				            autoClose: true ,                        
				            showCancel: false ,                       
				            modalSize:'lg' ,                     
				            showHeader:true,                        
				            showFooter:true ,                        
				            okText: $scope.maoxian1_okText,  
				            // cancelText: '关闭',  //取消按钮文本
				            okHandler: function(modal,$ele){
				                
				            },
				            cancelHandler: function(modal,$ele){
				               
				            },
				            beforeRender: function($ele){
				                
				                return $ele;
				            }
				        };

				        $scope.$on('hidden.bs.modal#clientModeOf',function(){ 
				            $scope.$broadcast('hideSearcher#clientMode');  //  实现了搜索表头的折叠 
				        }); 

				        $scope.$on('hidden.bs.modal#clientTypeOf',function(){ 
				            $scope.$broadcast('hideSearcher#clientType');  //  实现了搜索表头的折叠 
				        });                
                    }
                };
            }
        ]);
    }
);
