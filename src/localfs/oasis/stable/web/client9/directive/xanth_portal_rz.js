define(['angularAMD', 'utils', 'sprintf'],
    function (app, utils) {

        var sLang = utils.getLang() || 'cn';
        var URL_TEMPLATE_FILE = sprintf('../client9/views/%s/xanth_portal_rz.html', sLang);
 
        app.directive('xanthportalrz', ['$timeout', '$rootScope', '$http', '$q',
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
                            $http({
                                url:'/v3/stamonitor/monitor',
                                    method:'post',
                                    data:{
                                        method:'clientcount_cloud_group',
                                        param:{
                                            topId:g_topId,   
                                            groupId:changeApgroup,
                                            dataType:"auth"                                              
                                        }  
                                    }                          
                                }).success(function(data){
                                    var aData = data.response;
                                    $.each(aData,function(i,item){
                                        aData[i]={};
                                        aData[i].ApGroupName = item.apGroupName;
                                        aData[i].clientCout5 = item.Count5G;
                                        aData[i].clientCout2 = item.Count24G;
                                    });
                                    $scope.$broadcast('load#apgroup',aData); 
                                }).error(function(){          
                            });

                            $scope.options={
                                tId:'apgroup',
                                pageSize:5,
                                showPageList:false,
                                searchable:true,
                                columns:[
                                    {sortable:true,field:'ApGroupName',title:$scope.apGroupName,searcher:{}},
                                    {sortable:true,field:'clientCout5',title:$scope.clientCount_5,formatter:showNum,searcher:{}},
                                    {sortable:true,field:'clientCout2',title:$scope.clientCount_2,formatter:showNum,searcher:{}}
                                ],
                            };

                            $http({
                                url:'/v3/stamonitor/monitor',
                                    method:'post',
                                    data:{
                                        method:'clientcount_cloud_ssid',
                                        param:{ 
                                            topId:g_topId,  
                                            groupId:changeApgroup,
                                            dataType:"auth"                                              
                                        }  
                                    }                          
                                }).success(function(data){
                                    var bData = [];
                                    var aData = data.response;
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
                                searchable:true,
                                showPageList:false,
                                columns:[
                                    {sortable:true,field:'ssid',title:$scope.ssidName,searcher:{}},
                                    {sortable:true,field:'clientCout_5',title:$scope.clientCount_5,formatter:showNum,searcher:{}},
                                    {sortable:true,field:'clientCout_2',title:$scope.clientCount_2,formatter:showNum,searcher:{}}
                                ],
                            };

                            function showNum(value, row, index){
                                return '<a class="list-link">'+value+'</a>';
                            }

                            var apart = "";
                            var other = "";
                            var clickCellEvt = ["click-cell.bs.table#ssid","click-cell.bs.table#apgroup"];
                            angular.forEach(clickCellEvt, function (value, key, values) {
                                $scope.$on(value, function (evt, field, value, row, $ele) {                              
                                    if(field == "clientCout_5"){
                                        apart = row.ssid;
                                        other = "mode5G";
                                        $scope.$broadcast('refresh#maoxian', {
                                            url: '/v3/stamonitor/getclientlist_byssidandmode?devSN='+$scope.sn+'&mode='+other+'&ssid='+apart+'&auth=1',
                                        });
                                        $scope.$broadcast("show#delog");                                  
                                    }else
                                    if(field == "clientCout_2"){
                                        apart = row.ssid;
                                        other = "mode24G";
                                        $scope.$broadcast('refresh#maoxian', {
                                            url: '/v3/stamonitor/getclientlist_byssidandmode?devSN='+$scope.sn+'&mode='+other+'&ssid='+apart+'&auth=1',
                                        });
                                        $scope.$broadcast("show#delog"); 
                                    }else
                                    if(field == "clientCout5"){
                                        apart = row.ApGroupName;
                                        other = "mode5G";
                                        $scope.$broadcast('refresh#maoxian', {
                                            url: '/v3/stamonitor/getclientlist_bygroupandmode?devSN='+$scope.sn+'&mode='+other+'&group='+apart+'&auth=1',
                                        });
                                        $scope.$broadcast("show#delog");
                                    }else
                                    if(field == "clientCout2"){
                                        apart = row.ApGroupName;
                                        other = "mode24G";
                                        $scope.$broadcast('refresh#maoxian', {
                                            url: '/v3/stamonitor/getclientlist_bygroupandmode?devSN='+$scope.sn+'&mode='+other+'&group='+apart+'&auth=1',
                                        });
                                        $scope.$broadcast("show#delog");
                                    }
                                });           
                            });

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
                                    var wheredata = data.clientList.clientInfo;
                                    $.each(wheredata, function (i,item) {
                                        if(item.clientVendor==""){
                                            item.clientVendor=$scope.header_6;
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

                            $scope.maoxian1 = {
                                mId:'delog',                             
                                title:$scope.ngModel,                           
                                autoClose: true ,                        
                                showCancel: false ,                       
                                modalSize:'lg' ,                     
                                showHeader:true,                        
                                showFooter:true ,                        
                                okText: $scope.autoClose,  
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
                        });

                    }
                };
            }
        ]);
    }
);
