define(['jquery','utils'],function($scope,Utils) {
    return ['$scope', '$http','$state','$window','$stateParams','$alertService',function($scope,$http,$state,$window,$stateParams, $alert){
        function getRcString(attrName){
            return Utils.getRcString("apinfo_aplist_rc",attrName);
        }
        var g_delay;
        var apBindUrl = Utils.getUrl('GET','','/ssidmonitor/getapbindstlist?devSN='+$scope.sceneInfo.sn,'/init/servicebind5/apbindlist.json');
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
                for(var i=1;i<=parseInt($stateParams.radioNum);i++){
                    for(j=0,len=checkedData.length;j<len;j++){
                        var obj={};
                        obj={                   
                                apSN:$stateParams.apSN,
                                radioId:i,
                                stName: checkedData[j].stName,
                                apName:$stateParams.name
                            };
                        aData2.push(obj);
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
                        method:"SSIDBindByAP",  
                        param:aData2,
                    }
                }).success(function(data,header,config,status){
                    if(data.reason == "Number of service templates bound to the radio has reached the upper limit."){
                        $alert.msgDialogError(getRcString("SUM_TEMPLATE"));
                    }else{
                        $alert.msgDialogSuccess(getRcString("BIND_SUCCESS"));
                        clearTimeout(g_delay);
                        g_delay = setTimeout(function(){
                            $http({
                                url:'/v3/ant/confmgr',
                                method:'POST', 
                                data:{    
                                    devSN:$scope.sceneInfo.sn,    
                                    configType:0,
                                    cloudModule:"stamgr",
                                    deviceModule:"stamgr",
                                    method:"SyncSSIDList",
                                    param:[{}]
                                }         
                            }).success(function(response){ 
                                 $scope.$broadcast('refresh#bind');
                                 $scope.$broadcast('refresh#unbind');                                      
                            }).error(function(response){
                               
                            }); 
                        },3000);    
                    }
                }).error(function(data,header,config,status){

                });
            });
        }

        $scope.unbind = function(){
            $scope.$broadcast('getAllSelections#bind',{},function(data){
                console.log('huoquxuanhzongdeshuju1'); 
                console.log(data);
                var selectedData = data;

                var aData2=[];
                for(var i=1;i<=parseInt($stateParams.radioNum);i++){
                    for(j=0,len=selectedData.length;j<len;j++){
                        var obj={};
                        obj={                   
                                apSN:$stateParams.apSN,
                                radioId:i,
                                stName: selectedData[j].stName,
                                apName:$stateParams.name
                            };
                        aData2.push(obj);
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
                        method: "SSIDUnbindByAP",  
                        param:aData2,
                    }
                }).success(function(data,header,config,status){
                    $alert.msgDialogSuccess(getRcString("UNBIND_SUCCESS"));
                    clearTimeout(g_delay);
                    g_delay = setTimeout(function(){
                        $http({
                            url:'/v3/ant/confmgr',
                            method:'POST', 
                            data:{    
                                devSN:$scope.sceneInfo.sn,    
                                configType:0,
                                cloudModule:"stamgr",
                                deviceModule:"stamgr",
                                method:"SyncSSIDList",
                                param:[{}]
                            }         
                        }).success(function(response){ 
                                $scope.$broadcast('refresh#bind');
                                $scope.$broadcast('refresh#unbind');                                      
                        }).error(function(response){
                            
                        }); 
                    },3000); 
                }).error(function(data,header,config,status){

                });
            });
        }
        $scope.bindOptions={
                tId:'bind',
                url:'/v3/ssidmonitor/getapbindstlist?devSN='+$scope.sceneInfo.sn +'&apName='+$stateParams.name,
                method:'get',
                striped:true,
                pagniation:false,
                clickToSelect: true,
                responseHandler:function(data){
                    var obindData = data.stList.stBindList;
                    return {
                        rows:obindData
                    }
                },
                columns:[
                            {checkbox:true},
                            {sortable:true,field:'stName',title:getRcString('Bind_HEADER').split(",")[0]},
                            {sortable:true,field:'ssidName',title:getRcString('Bind_HEADER').split(",")[1]},
                            {sortable:true,field:'description',title:getRcString('Bind_HEADER').split(",")[2]}                                       
                        ]
        };
        
        $scope.unbindOptions={
                tId:'unbind',
                url:'/v3/ssidmonitor/getapbindstlist?devSN='+$scope.sceneInfo.sn +'&apName='+$stateParams.name,
                method:'get',
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
                            {sortable:true,field:'stName',title:getRcString('Bind_HEADER').split(",")[0]},
                            {sortable:true,field:'ssidName',title:getRcString('Bind_HEADER').split(",")[1]},
                            {sortable:true,field:'description',title:getRcString('Bind_HEADER').split(",")[2]}
                        ]
            }; 
    }]
});