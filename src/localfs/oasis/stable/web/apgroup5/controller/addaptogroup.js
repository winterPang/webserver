define(['utils'], function (Utils) {
    return ['$scope', '$http', '$state','$window','$alertService','$stateParams', function ($scope, $http, $state,$window,$alert,$stateParams) {
        function getRcString(attrName){
            return Utils.getRcString("ap_rc",attrName);
        }
        $scope.return = function(){
            $window.history.back();
        }
        var apGroupName = $stateParams.apgroupname;
        var apTableTitle = getRcString("ap-table-title").split(",");
        var getApInGroupUrl = Utils.getUrl('GET',' ','/apmonitor/aplistbygroup?devSN='+$scope.sceneInfo.sn+'&apGroupName='+apGroupName,'/init/apgroup5/apingroup.json');
        var getApOutGroupUrl = Utils.getUrl('GET',' ','/apmonitor/aplistbygroup?devSN='+$scope.sceneInfo.sn+'&apGroupName='+apGroupName,'/init/apgroup5/apoutgroup.json');
       
        $scope.return = function(){
            $window.history.back();
        }
        // apInGroup table
        $scope.apInGroup_table = {
            tId:'apingrouptid',
            url: getApInGroupUrl.url,
            clickToSelect: true,
            striped:true,
            sidePagination: 'server',
            searchable: true,
            pagination: true,
            pageSize: 5,
            pageList: [5,10],
            pageParamsType: 'path',
            method: "post",
            contenrType: "application/json",
            dataType: "json",
            startField:'skipnum',
            limitField:'limitnum', 
            // totalField:'totalCntInGrp',
            // dataField:'apList',
            queryParams: function (params){
                var oBody = {
                    findoption: {
                        findOptInGrp:{}
                    },
                    sortoption: {
                        sortOptInGrp:{}
                    }
                };
                if (params.findoption) {
                    oBody.findoption.findOptInGrp = params.findoption;
                }
                if (params.sort) {
                    oBody.sortoption.sortOptInGrp[params.sort] = JSON.stringify(params.order == "asc" ? 1 : -1);
                }
                console.log('123',params);
                params.start=undefined;
                params.size=undefined;
                params.order=undefined;
                return $.extend(true,{},params,oBody);
            },
            responseHandler: function(data){
                return {
                    total: data.totalCntInGrp,
                    rows: data.apList
                };
            },
            columns: [
                {checkbox: true},            
                {sortable: true, field: 'apName', title: apTableTitle[0], searcher: {}},
                {sortable: true, field: 'apModel', title: apTableTitle[1], searcher: {}},
                {sortable: true, field: 'apSN', title: apTableTitle[2], searcher: {}},
                {sortable: true, field: 'macAddr', title: apTableTitle[3], searcher: {}}
            ]
        };
        // apOutGroup table
        $scope.apOutGroup_table = {
            tId:'apoutgrouptid',
            url: getApOutGroupUrl.url,
            clickToSelect: true,
            sidePagination: 'server',
            striped: true,
            searchable: true,
            pagination: true,
            pageSize: 5,
            pageList: [5,10],
            pageParamsType: 'path',
            method: "post",
            contenrType: "application/json",
            dataType: "json",
            startField:'skipnum',
            limitField:'limitnum', 
            // totalField:'totalCntInGrp',
            // dataField:'apList',
            queryParams: function (params){
                var oBody = {
                    findoption: {
                        findOptOutGrp:{}
                    },
                    sortoption: {
                        sortOptOutGrp:{}
                    }
                };
                if (params.findoption) {
                    oBody.findoption.findOptOutGrp = params.findoption;
                }
                if (params.sort) {
                    oBody.sortoption.sortOptOutGrp[params.sort] = JSON.stringify(params.order == "asc" ? 1 : -1);
                }
                params.start=undefined;
                params.size=undefined;
                params.order=undefined;
                return $.extend(true,{},params,oBody);
            },
            responseHandler: function(data){
                return {
                    total: data.totalCntOutGrp,
                    rows: data.leftApList
                };
            },
            columns: [
                {checkbox: true},            
                {sortable: true, field: 'apName', title: apTableTitle[0], searcher: {}},
                {sortable: true, field: 'apModel', title: apTableTitle[1], searcher: {}},
                {sortable: true, field: 'apSN', title: apTableTitle[2], searcher: {}},
                {sortable: true, field: 'macAddr', title: apTableTitle[3], searcher: {}}
            ]
        };

        //delete ap from group 
        $scope.deleteApFromGroup = function () {
            console.log("delete ap from group");
            $scope.$broadcast('getAllSelections#apingrouptid',{},function(data){
                // console.log(data);
                // console.log(apGroupName);
                
                var selectedData = data;
                var aReqestData=[];
                for (i=0, len=selectedData.length; i<len; i++){
                    var obj={};
                    obj={
                        apGroupName: apGroupName,
                        optType: "0", 
                        info: selectedData[i].apName,
                    };
                    aReqestData.push(obj);
                }
                // console.log(aReqestData);
                $http({
                    url:'/v3/ant/confmgr',
                    method:'POST',
                    data:{
                        devSN:$scope.sceneInfo.sn,
                        deviceModule:"apmgr",
                        cloudModule:"apmgr",                
                        configType:0,
                        method: "DelApToGroup",  
                        param:aReqestData,
                    }
                }).success(function(data, header, config, status){
                    // console.log('deleteap!!!!!!!!!!!!!!!!!!!!11',data);
                    // $scope.$broadcast('refresh#apingrouptid');
                    if ((data.communicateResult=="success") && (data.errCode == 0)){
                        //success message
                        $alert.msgDialogSuccess(getRcString("DEL-SUCCESS"));
                    }else{
                        //failed message
                        $alert.msgDialogError(getRcString("DEL-FAILED"));
                    }
                }).error(function(data, header, config, status){
                    $alert.msgDialogError(getRcString("DEL-FAILED"));
                    return;
                });
            });
        }

        //Add ap to group 
        $scope.addApToGroup = function () {
            console.log("Add ap to group");
            $scope.$broadcast('getAllSelections#apoutgrouptid',{},function(data){
                // console.log(data);
                // console.log(apGroupName);
                
                var selectedData = data;
                var aReqestData=[];
                for (i=0, len=selectedData.length; i<len; i++){
                    var obj={};
                    obj={
                        apGroupName: apGroupName,
                        optType: "0", 
                        info: selectedData[i].apName,
                    };
                    aReqestData.push(obj);
                }
                
                $http({
                    url:'/v3/ant/confmgr',
                    method:'POST',
                    data:{
                        devSN:$scope.sceneInfo.sn,
                        deviceModule:"apmgr",
                        cloudModule:"apmgr",                
                        configType:0,
                        method: "AddApToGroup",  
                        param:aReqestData,
                    }
                }).success(function(data, header, config, status){
                    // $scope.$broadcast('refresh#apoutgrouptid');
                    if ((data.communicateResult=="success") && (data.errCode == 0)){
                        $alert.msgDialogSuccess(getRcString("ADD-SUCCESS"));
                    }else{
                        //failed message
                        $alert.msgDialogError(getRcString("ADD-FAILED"));
                    }
                }).error(function(data, header, config, status){
                    $alert.msgDialogError(getRcString("ADD-FAILED"));
                    return;
                });
            });
        }

        //button disable
        $scope.modLeftBtnDisable = true;
        $scope.modAddBtnDisable = true;

        var checkEvt = [
            "check.bs.table#apingrouptid",
            "uncheck.bs.table#apingrouptid",
            "check-all.bs.table#apingrouptid",
            "uncheck-all.bs.table#apingrouptid",
            "check.bs.table#apoutgrouptid",
            "uncheck.bs.table#apoutgrouptid",
            "check-all.bs.table#apoutgrouptid",
            "uncheck-all.bs.table#apoutgrouptid"
        ];

        angular.forEach(checkEvt, function (value, key, values) {
            $scope.$on(value, function () {
                $scope.$broadcast("getSelections#apingrouptid", function (data) {
                    // console.log(data);
                    $scope.$apply(function () {
                        // $scope.aCurCheckData = data;
                        // $scope.modBtnDisable = !$scope.aCurCheckData.length;
                        $scope.modLeftBtnDisable = !data.length;
                    });
                });

                $scope.$broadcast("getSelections#apoutgrouptid", function (data) {
                    console.log(data);
                    $scope.$apply(function () {
                        // $scope.aCurCheckData = data;
                        // $scope.modBtnDisable = !$scope.aCurCheckData.length;
                        $scope.modAddBtnDisable = !data.length;
                    });
                });
            });
        });
    }]
})