define(['jquery','utils','echarts','angular-ui-router','bsTable'],function($scope,Utils,echarts) {
    return ['$rootScope', '$scope', '$http','$state','$window',"$alertService",function($rootScope,$scope,$http,$state,$window,$alert){
        function getRcString(attrName){
        return Utils.getRcString("clients_rc",attrName);
        }
        $scope.return = function(){
            $state.go("scene.content.monitor.wirelessterminal2");
        }
        $scope.tenmin = 10 * 60 * 1000;
        $scope.oneHour = $scope.tenmin * 6;
        $scope.oneDay = $scope.oneHour * 24;
        $scope.oneWeek = $scope.oneDay * 7;
        $scope.oneMonth = $scope.oneDay * 30;
        $scope.ongYear = $scope.oneDay * 365;
        $scope.curdate = new Date(new Date().toLocaleDateString());           
        $scope.fundate = (new Date ($scope.curdate - $scope.oneDay));      
        $scope.curCheckedRadio = "basicInfo";
        $scope.checked = {};
               
        $scope.basicInfo = {
            tId:'basicInfo',
            pageSize:10,
            showPageList:false,
            clickToSelect: false,
            url:'/v3/portalmonitor/portalhistory/getportalhistorylistbydevsn',
            pageParamsType:'body',            
            method:'post',
            sidePagination:'server',
            contentType: "application/json",
            dataType: "json",
            searchable:true,            
            startField:'page',
            limitField:'count',
            queryParams:function(params){                            
                var chouseBody = {
                    startTime:$scope.fundate,
                    endTime:$scope.curdate,                  
                    sortField:{},
                    checkField:{},
                    page:'',
                    devSN:$scope.sceneInfo.sn                   
                };
                if(params.sort){
                    chouseBody.sortField[params.sort] = (params.order == "asc" ? 1 : -1);
                }
                if(params.findoption){
                    $scope.checked = params.findoption,
                    chouseBody.checkField = params.findoption;
                }
                if(params.start){
                    chouseBody.page = params.start;
                }
                params.findoption = undefined;
                params.sort = undefined;
                params.start = undefined;
                params.size = undefined;
                params.order = undefined;
                return $.extend(true,{},params,chouseBody);
            },
            responseHandler: function (data) {
                $scope.$apply(function () {
                    $scope.unexport = (data.totalcount == 0);
                });
                return {
                    total: data.totalcount,
                    rows: data.historyList
                };
            },
            columns:[
                {sortable:false,field:'UserName',title:getRcString('LIST_HEADER').split(",")[0],searcher:{}},
                {sortable:true,field:'UserIP',title:getRcString('LIST_HEADER').split(",")[1],searcher:{}},
                {sortable:false,field:'UserMac',title:getRcString('LIST_HEADER').split(",")[2],searcher:{}},
                {sortable:false,field:'AuthTypeStr',title:getRcString('LIST_HEADER').split(",")[3]},
                {sortable:false,field:'InMBytes',title:getRcString('LIST_HEADER').split(",")[4]},
                {sortable:false,field:'OutMBytes',title:getRcString('LIST_HEADER').split(",")[5]},
                {sortable:true,field:'onlineTimeStr',title:getRcString('LIST_HEADER').split(",")[6]},
                {sortable:false,field:'DurationTimeStr',title:getRcString('LIST_HEADER').split(",")[7]}
            ]
        };

        $scope.clickRadio = function (radioName) {
            $scope.curCheckedRadio = radioName;
            if($scope.curCheckedRadio == "basicInfo"){
                $scope.fundate = new Date ($scope.curdate - $scope.oneDay);
                $scope.$broadcast("selectPage#basicInfo", 1);
                $scope.$broadcast('refresh#basicInfo', {
                    pageNumber: 1,
                    query: {
                        page: 1,
                        startTime:$scope.fundate
                    }
                });
            }else
            if($scope.curCheckedRadio == "RadioInfo"){
                $scope.fundate = new Date ($scope.curdate - $scope.oneWeek);
                $scope.$broadcast("selectPage#basicInfo", 1);
                $scope.$broadcast('refresh#basicInfo', {
                    pageNumber: 1,
                    query:{
                        page: 1,
                        startTime:$scope.fundate
                    }
                });
            }else
            if($scope.curCheckedRadio == "StatisticsInfo"){
                $scope.fundate = new Date ($scope.curdate - $scope.oneMonth);
                $scope.$broadcast("selectPage#basicInfo", 1);
                $scope.$broadcast('refresh#basicInfo', {
                    pageNumber: 1,
                    query:{
                        page: 1,
                        startTime:$scope.fundate
                    }
                });
            }          
        };

        $scope.fresh = function(){
            if($scope.curCheckedRadio == "basicInfo"){
                $scope.$broadcast('refresh#basicInfo', {});
            }else
            if($scope.curCheckedRadio == "RadioInfo"){
                $scope.$broadcast('refresh#basicInfo', {
                    query:{
                        startTime:new Date ($scope.curdate - $scope.oneWeek),
                    }
                });
            }else
            if($scope.curCheckedRadio == "StatisticsInfo"){
                $scope.$broadcast('refresh#basicInfo', {
                    query:{
                        startTime:new Date ($scope.curdate - $scope.oneMonth),
                    }
                });
            }          
        };
        
        $scope.export = function(){
            if($scope.curCheckedRadio == "basicInfo"){
                startTime = $scope.fundate;
                endTime = $scope.curdate;
            }else
            if($scope.curCheckedRadio == "RadioInfo"){
                startTime = new Date ($scope.curdate - $scope.oneWeek);
                endTime = $scope.curdate;
            }else
            if($scope.curCheckedRadio == "StatisticsInfo"){
                startTime = new Date ($scope.curdate - $scope.oneMonth);
                endTime = $scope.curdate;
            }
            $scope.checked.devSN = $scope.sceneInfo.sn;

            $http({
                url: "/v3/arb/portalhistory/getfilepath",
                method: "POST",
                data: {
                    diffTime: (new Date(endTime) - new Date(startTime)) / 1000,
                    devSN: [$scope.sceneInfo.sn],
                    userName: $rootScope.userInfo.user,
                    nasid: $scope.sceneInfo.nasid
                }
            }).success(function (data) {
                if(data.retCode == 0){
                    $("#exportFile").attr("src", "/v3" + data.filePath.slice(2));
                }else{
                    $alert.msgDialogError(getRcString('SAC_WLEEOP'));
                }
            }).error(function () {
                $alert.msgDialogError(getRcString('SAC_WLEEOP'));
            });
        }
    }]
});