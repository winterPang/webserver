define(['jquery','utils'],function($scope,Utils) {
    return ['$scope', '$http','$state','$window','$stateParams','$alertService',function($scope,$http,$state,$window,$stateParams,$alert){
        var g_aData;
        function getRcString(attrName){
            return Utils.getRcString("apinfo_aplist_rc",attrName).split(',');
        }
        $scope.return = function(){
            $window.history.back();
        }
        $scope.bindCheckData =[];
        $scope.bindBtnDisable =true;
        var checkEvt = [
            "check.bs.table#bind","uncheck.bs.table#bind",
            "check-all.bs.table#bind","uncheck-all.bs.table#bind",    
        ];
        angular.forEach(checkEvt, function (value, key, values) {
            $scope.$on(value, function () {
                $scope.$broadcast("getSelections#" + value.split("#")[1], function (data) {
                    $scope.$apply(function () {
                        $scope.bindCheckData = data;
                        $scope.bindBtnDisable = !$scope.bindCheckData.length;
                        // $scope.modBtnDisable1 = !$scope.aCurCheckData.length;
                    });
                });
            });
        });
        
        $scope.unbindCheckData =[];
        $scope.unbindBtnDisable =true;
        var checkEvt = [
            "check.bs.table#unbind","uncheck.bs.table#unbind",
            "check-all.bs.table#unbind","uncheck-all.bs.table#unbind",    
        ];
        angular.forEach(checkEvt, function (value, key, values) {
            $scope.$on(value, function () {
                $scope.$broadcast("getSelections#" + value.split("#")[1], function (data) {
                    $scope.$apply(function () {
                        $scope.unbindCheckData = data;
                        $scope.unbindBtnDisable = !$scope.unbindCheckData.length;
                        // $scope.modBtnDisable1 = !$scope.aCurCheckData.length;
                    });
                });
            });
        });

        $scope.bind = function(){
            $scope.$broadcast('getAllSelections#unbind',{},function(data){
                console.log('huoquxuanhzongdeshuju'); 
                console.log(data);
                var checkedData = data;

                var aData2=[];
                for(var i=0,len=g_aData.modelList.length;i<len;i++){
                    for(var j=1,len2=parseInt(g_aData.modelList[i].radioNum);j<=len2;j++){
                        for(k=0,len3=checkedData.length;k<len3;k++){
                            var obj={};
                            obj={
                                apGroupName:$stateParams.name,
                                apModelName:g_aData.modelList[i].model,
                                radioId:j,
                                stName:checkedData[k].stName
                                };
                            aData2.push(obj);
                        }
                    }
                }
                $http({
                    url:'/v3/ant/confmgr',
                    method:'POST',
                    data:{
                        devSN:$scope.sceneInfo.sn,
                        deviceModule:"stamgr",
                        cloudModule:"stamgr",                
                        configType:0,
                        method:"SSIDBindByAPGroup",  
                        param:aData2,
                    }
                }).success(function(data){
                    if(data.errCode == 7){
                        $alert.msgDialogSuccess(getRcString("BIND_SUCCESS")[1]);
                        return;
                    }
                    $alert.msgDialogSuccess(getRcString("BIND_SUCCESS")[0]);
                    $scope.$broadcast('refresh#bind',{url:'/ssidmonitor/getapgroupbindstlist?devSN='+$scope.sceneInfo.sn+'&apGroupName='+$stateParams.name});
                    $scope.$broadcast('refresh#unbind',{url:'/ssidmonitor/getapgroupbindstlist?devSN='+$scope.sceneInfo.sn+'&apGroupName='+$stateParams.name});
                }).error(function(data){

                });
            });
        }

        $scope.unbind = function(){
            $scope.$broadcast('getAllSelections#bind',{},function(data){
                console.log('huoquxuanhzongdeshuju1'); 
                console.log(data);
                var checkedData = data;

                var aData2=[];
                for(var i=0,len=g_aData.modelList.length;i<len;i++){
                    for(var j=1,len2=parseInt(g_aData.modelList[i].radioNum);j<=len2;j++){
                        for(k=0,len3=checkedData.length;k<len3;k++){
                            var obj={};
                            obj={
                                apGroupName:$stateParams.name,
                                apModelName:g_aData.modelList[i].model,
                                radioId:j,
                                stName:checkedData[k].stName
                                };
                            aData2.push(obj);
                        }
                    }
                }
                $http({
                    url:'/v3/ant/confmgr',
                    method:'POST',
                    data:{
                        devSN:$scope.sceneInfo.sn,
                        deviceModule:"stamgr",
                        cloudModule:"stamgr",                
                        configType:0,
                        method: "SSIDUnbindByAPGroup",  
                        param:aData2,
                    }
                }).success(function(data){
                    $alert.msgDialogSuccess(getRcString("UNBIND_SUCCESS"));
                    $scope.$broadcast('refresh#bind');
                    $scope.$broadcast('refresh#unbind');
                }).error(function(data){

                });
            });
        } 
        $scope.bindOptions={
                tId:'bind',
                url:'/ssidmonitor/getapgroupbindstlist?devSN='+$scope.sceneInfo.sn+'&apGroupName='+$stateParams.name,
                method:'GET',
                striped:true,
                pagniation:false,
                clickToSelect: true,
                responseHandler:function(data){
                     g_aData = data;
                     var obindData = data.stList.stBindList;
                     return {
                         rows:obindData
                     }
                },
                columns:[
                            {checkbox:true},
                            {sortable:true,field:'stName',title:getRcString('Bind_HEADER')[0]},
                            {sortable:true,field:'ssidName',title:getRcString('Bind_HEADER')[1]},
                            {sortable:true,field:'description',title:getRcString('Bind_HEADER')[2]}                                       
                        ]
        };
        
        $scope.unbindOptions={
                tId:'unbind',
                url:'/ssidmonitor/getapgroupbindstlist?devSN='+$scope.sceneInfo.sn+'&apGroupName='+$stateParams.name,
                method:'GET',
                checkbox:true,
                striped:true,
                pagniation:false,
                clickToSelect: true,
                responseHandler:function(data){
                     var oUnbindData = data.stList.stUnBindList;
                     return {
                         rows:oUnbindData
                     }
                },
                columns:[
                            {checkbox:true},
                            {sortable:true,field:'stName',title:getRcString('Bind_HEADER')[0]},
                            {sortable:true,field:'ssidName',title:getRcString('Bind_HEADER')[1]},
                            {sortable:true,field:'description',title:getRcString('Bind_HEADER')[2]}
                        ]
            }; 
    }]
});