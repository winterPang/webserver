//网络部署-无线配置-服务配置-绑定  by weixin
define(['jquery','utils'],function($scope,Utils) {
    return ['$scope', '$http','$state','$window','$stateParams','$alertService',function($scope,$http,$state,$window,$stateParams,$alert){
        
        //  =========================页面表格初始化开始============================== 
            var apGroupListUrl = Utils.getUrl('GET','','/ssidmonitor/getstbindapgrouplist?devSN='+$scope.sceneInfo.sn+'&stName='+$stateParams.stname,'/init/servicebind5/apgroupbindlist.json');
            var apListUrl = Utils.getUrl('GET','','/ssidmonitor/getstbindaplist?devSN='+$scope.sceneInfo.sn+'&stName='+$stateParams.stname,'/init/servicebind5/apgroupbindlist.json');       
            var synConfigUrl = Utils.getUrl('POST','','/ant/confmgr','/init/serviceconfig5/infobrief.json');

            function getRcString(attrName){
                return Utils.getRcString("apinfo_aplist_rc",attrName);
            }

            //apGroup table
            /*$scope.bindApGroupTable={
                    tId:'bindApGroup',
                    url:apGroupListUrl.url,
                    method:apGroupListUrl.method,
                    dataField:'bindApGroupList',
                    totalField:'bindApGroupLeftCnt', 
                    striped:true,
                    pagniation:true,
                    clickToSelect: true,
                    showPageList:false,
                    columns:[
                                {checkbox:true},
                                {sortable:true,align:'center',field:'apGroupName',title:getRcString('APGROUP_HEADER').split(",")[0]},
                                {sortable:true,align:'center',field:'description',title:getRcString('APGROUP_HEADER').split(",")[1]},                                      
                                {sortable:true,align:'center',field:'modelNum',title:getRcString('APGROUP_HEADER').split(",")[2]}                                      
                    ], 
                    responseHandler:function(res){
                        
                        for(var i=0,len=res.bindApGroupList.length;i<len;i++){
                            res.bindApGroupList[i].modelNum=res.bindApGroupList[i].modelList.length;
                        }
                        for(var j=0,len2=res.unbindApGroupList.length;j<len2;j++){
                            res.unbindApGroupList[j].modelNum=res.unbindApGroupList[j].modelList.length;
                        }
                        $scope.$broadcast('load#unbindApGroup',res.unbindApGroupList);

                        return res;             
                    },              
            };
            
            $scope.unbindApGroupTable={
                    tId:'unbindApGroup',
                    checkbox:true,
                    striped:true,
                    pagniation:true,
                    clickToSelect: true,
                    showPageList:false,
                    columns:[
                                {checkbox:true},
                                {sortable:true,align:'center',field:'apGroupName',title:getRcString('APGROUP_HEADER').split(",")[0]},
                                {sortable:true,align:'center',field:'description',title:getRcString('APGROUP_HEADER').split(",")[1]},
                                {sortable:true,align:'center',field:'modelNum',title:getRcString('APGROUP_HEADER').split(",")[2]}                                       
                    ]

            }; */
            //ap table
            $scope.bindApTable={
                tId:'bindAp',
                url:apListUrl.url,
                method:apListUrl.method,
                dataField:'bindApList',
                totalField:'bindApLeftCnt', 
                striped:true,
                pagniation:true,
                clickToSelect: true,
                showPageList:false,
                clickToSelect:true,
		maintainSelected:true,
                showCheckBox:true,
                responseHandler:function(res){
                        $scope.$broadcast('load#unbindAp',res.unbindApList);
                        return res;
                    },
                columns:[                
                    {sortable:true,align:'center',field:'apName',title:getRcString('AP_HEADER').split(",")[0]},                                    
                    {sortable:true,align:'center',field:'apSN',title:getRcString('AP_HEADER').split(",")[1]},                                     
                    {sortable:true,align:'center',field:'apModel',title:getRcString('AP_HEADER').split(",")[2]},                                     
                    {sortable:true,align:'center',field:'radioNum',title:getRcString('AP_HEADER').split(",")[3]},                                     
                    //{sortable:true,align:'center',field:'apGroupName',title:getRcString('AP_HEADER').split(",")[4]},                                     
                ],               
            };
            
            $scope.unbindApTable={
                tId:'unbindAp',
                checkbox:true,
                striped:true,
                pagniation:true,
                clickToSelect: true,
                showPageList:false,
                clickToSelect:true,
                maintainSelected:true,
                showCheckBox:true,
                columns:[
                    {sortable:true,align:'center',field:'apName',title:getRcString('AP_HEADER').split(",")[0]},                                    
                    {sortable:true,align:'center',field:'apSN',title:getRcString('AP_HEADER').split(",")[1]},                                     
                    {sortable:true,align:'center',field:'apModel',title:getRcString('AP_HEADER').split(",")[2]},                                     
                    {sortable:true,align:'center',field:'radioNum',title:getRcString('AP_HEADER').split(",")[3]},                                     
                    //{sortable:true,align:'center',field:'apGroupName',title:getRcString('AP_HEADER').split(",")[4]},                                     
                ],             
            };
            //
            $scope.apGroupArea=false;
            $scope.apArea=true;
        //  =========================页面表格初始化结束==============================
        
        
        //  =========================监控表格选取状态开始==============================
            $scope.bindApGroupData =[];
            $scope.unbindApGroupDisabled =true;
            var checkEvt = [
                "check.bs.table#bindApGroup","uncheck.bs.table#bindApGroup",
                "check-all.bs.table#bindApGroup","uncheck-all.bs.table#bindApGroup",    
            ];
            angular.forEach(checkEvt, function (value, key, values) {
                $scope.$on(value, function () {
                    $scope.$broadcast("getSelections#" + value.split("#")[1], function (data) {
                        $scope.$apply(function () {
                            $scope.bindApGroupData = data;
                            $scope.unbindApGroupDisabled = !$scope.bindApGroupData.length;                      
                        });
                    });
                });
            });

            $scope.unbindApGroupData =[];
            $scope.bindApGroupDisabled =true;
            var checkEvt = [
                "check.bs.table#unbindApGroup","uncheck.bs.table#unbindApGroup",
                "check-all.bs.table#unbindApGroup","uncheck-all.bs.table#unbindApGroup",    
            ];
            angular.forEach(checkEvt, function (value, key, values) {
                $scope.$on(value, function () {
                    $scope.$broadcast("getSelections#" + value.split("#")[1], function (data) {
                        $scope.$apply(function () {
                            $scope.unbindApGroupData = data;
                            $scope.bindApGroupDisabled = !$scope.unbindApGroupData.length;                      
                        });
                    });
                });
            });


            $scope.bindApData =[];
            $scope.unbindApDisabled =true;
            var checkEvt = [
                "check.bs.table#bindAp","uncheck.bs.table#bindAp",
                "check-all.bs.table#bindAp","uncheck-all.bs.table#bindAp",    
            ];
            angular.forEach(checkEvt, function (value, key, values) {
                $scope.$on(value, function () {
                    $scope.$broadcast("getSelections#" + value.split("#")[1], function (data) {
                        $scope.$apply(function () {
                            $scope.bindApData = data;
                            $scope.unbindApDisabled = !$scope.bindApData.length;                      
                        });
                    });
                });
            });



            $scope.unbindApData =[];
            $scope.bindApDisabled =true;
            var checkEvt = [
                "check.bs.table#unbindAp","uncheck.bs.table#unbindAp",
                "check-all.bs.table#unbindAp","uncheck-all.bs.table#unbindAp",    
            ];
            angular.forEach(checkEvt, function (value, key, values) {
                $scope.$on(value, function () {
                    $scope.$broadcast("getSelections#" + value.split("#")[1], function (data) {
                        $scope.$apply(function () {
                            $scope.unbindApData = data;
                            $scope.bindApDisabled = !$scope.unbindApData.length;                      
                        });
                    });
                });
            });
        //  =========================监控表格选取状态结束==============================
        
       
        //  =========================点击事件开始==============================
            $scope.return = function(){
                $window.history.back();
            }
            
            $scope.apGroup = function(){
                $scope.apGroupArea=true;
                $scope.apArea=false;
            }

            $scope.ap = function(){
                $scope.apGroupArea=false;
                $scope.apArea=true;
            }

            $scope.unbindApGroup = function(){
                $scope.$broadcast('getAllSelections#bindApGroup',{},function(data){ 
                    console.log(data);                                 
                    var aData2=[];
                    for(i=0,len=data.length;i<len;i++){
                        for(var j=0,len2=data[i].modelList.length;j<len2;j++){
                           for(var k=1,len3=parseInt(data[i].modelList[j].radioNum);k<=len3;k++){
                                var obj={};
                                obj={
                                    apGroupName:data[i].apGroupName ,
                                    apModelName:data[i].modelList[j].model,
                                    radioId:k,
                                    stName:$stateParams.stname
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
                            method:"SSIDUnbindByAPGroup",  
                            param:aData2,
                        }
                    }).success(function(data,header,config,status){
                        if(data.result=="success"){ 
                            $http({
                                url:synConfigUrl.url,
                                method:synConfigUrl.method, 
                                data:{    
                                    devSN:$scope.sceneInfo.sn,    
                                    configType:0,
                                    cloudModule:"stamgr",
                                    deviceModule:"stamgr",
                                    method:"SyncSSIDList",
                                    param:[{}]
                                }         
                            }).success(function(response){ 
                                $alert.msgDialogSuccess(getRcString("REBIND_SUC"));   
                                $scope.$broadcast('refresh#bindApGroup');                                               
                            }).error(function(response){
                                $alert.msgDialogSuccess(getRcString("REBIND_SUC_RE"));
                            });                                               
                        }else{
                            if(response.errCode==4){
                                $alert.msgDialogError(getRcString("MAIN"),'error'); 
                           }else{
                                $alert.msgDialogError(getRcString("REBIND_FAIL"),'error');
                           }
                        }
                    }).error(function(data,header,config,status){
                        $alert.msgDialogError(getRcString("REBIND_FAIL"),'error');
                    });        
                });          
            }

            $scope.bindApGroup = function(){  
                        
                $scope.$broadcast('getAllSelections#unbindApGroup',{},function(data){                       
                     
                    var aData2=[];
                    var str="";

                    for(i=0,len=data.length;i<len;i++){
                        if(data[i].modelList.length==0){
                            if(str==""){
                               str+=data[i].apGroupName; 
                           }else{
                                str+=","+data[i].apGroupName;
                           }
                            
                        }else{
                            for(var j=0,len2=data[i].modelList.length;j<len2;j++){
                               for(var k=1,len3=parseInt(data[i].modelList[j].radioNum);k<=len3;k++){
                                    var obj={};
                                    obj={
                                        apGroupName:data[i].apGroupName ,
                                        apModelName:data[i].modelList[j].model,
                                        radioId:k,
                                        stName:$stateParams.stname
                                        };
                                    aData2.push(obj);             
                                }
                            }
                        }                         
                    }  

                    if(str!=""){                              
                        $alert.msgDialogError(getRcString("APGROUP")+str+getRcString("NOTICE"),'error');                         
                    }else{
                        if(aData2.length>0){
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
                            }).success(function(data,header,config,status){
                                if(data.result=="success"){  
                                    $http({
                                        url:synConfigUrl.url,
                                        method:synConfigUrl.method, 
                                        data:{    
                                            devSN:$scope.sceneInfo.sn,    
                                            configType:0,
                                            cloudModule:"stamgr",
                                            deviceModule:"stamgr",
                                            method:"SyncSSIDList",
                                            param:[{}]
                                        }         
                                    }).success(function(response){ 
                                        $alert.msgDialogSuccess(getRcString("BIND_SUC"));   
                                        $scope.$broadcast('refresh#bindApGroup');                                               
                                    }).error(function(response){
                                        $alert.msgDialogSuccess(getRcString("BIND_SUC_RE"));
                                    });                                             
                                }else{
                                    if(data.errCode==4){
                                        $alert.msgDialogError(getRcString("MAIN"),'error'); 
                                   }else{
                                        $alert.msgDialogError(getRcString("BIND_FAIL"),'error');
                                   }
                                }
                            }).error(function(data,header,config,status){
                                $alert.msgDialogError(getRcString("BIND_FAIL"),'error');
                               
                            });  
                        } 
                    }                                             
                                            
                });
            }
            
            $scope.unBindAp = function(){
                $scope.$broadcast('getAllSelections#bindAp',{},function(data){ 
                    var aData2=[];
                    for(var i=0,len=data.length;i<len;i++){
                        for(j=1,len2=parseInt(data[i].radioNum);j<=len2;j++){
                            var obj={};
                            obj={                   
                                    apSN:data[i].apSN,
                                    radioId:j,
                                    apName:data[i].apName,
                                    stName:$stateParams.stname
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
                        if(data.result=="success"){   
                            $http({
                                url:synConfigUrl.url,
                                method:synConfigUrl.method, 
                                data:{    
                                    devSN:$scope.sceneInfo.sn,    
                                    configType:0,
                                    cloudModule:"stamgr",
                                    deviceModule:"stamgr",
                                    method:"SyncSSIDList",
                                    param:[{}]
                                }         
                            }).success(function(response){ 
                                $alert.msgDialogSuccess(getRcString("REBIND_SUC"));   
                                $scope.$broadcast('refresh#bindAp');                                               
                            }).error(function(response){
                                $alert.msgDialogSuccess(getRcString("REBIND_SUC_RE"));
                            });
                        }else{
                            if(response.errCode==4){
                                $alert.msgDialogError(getRcString("MAIN"),'error'); 
                           }else{
                                $alert.msgDialogError(getRcString("REBIND_FAIL"),'error');
                           }
                        }
                    }).error(function(data,header,config,status){
                        $alert.msgDialogError(getRcString("REBIND_FAIL"),'error');
                    });        
                })
            }

            $scope.bindAp = function(){
                $scope.$broadcast('getAllSelections#unbindAp',{},function(data){ 
                    var aData2=[];
                    for(var i=0,len=data.length;i<len;i++){
                        for(j=1,len2=parseInt(data[i].radioNum);j<=len2;j++){
                            var obj={};
                            obj={                   
                                    apSN:data[i].apSN,
                                    radioId:j,
                                    apName:data[i].apName,
                                    stName:$stateParams.stname
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
                            method: "SSIDBindByAP",  
                            param:aData2,
                        }
                    }).success(function(data,header,config,status){
                        if(data.result=="success"){  
                            $http({
                                url:synConfigUrl.url,
                                method:synConfigUrl.method, 
                                data:{    
                                    devSN:$scope.sceneInfo.sn,    
                                    configType:0,
                                    cloudModule:"stamgr",
                                    deviceModule:"stamgr",
                                    method:"SyncSSIDList",
                                    param:[{}]
                                }         
                            }).success(function(response){ 
                                $alert.msgDialogSuccess(getRcString("BIND_SUC"));   
                                $scope.$broadcast('refresh#bindAp');                                               
                            }).error(function(response){
                                $alert.msgDialogSuccess(getRcString("BIND_SUC_RE"));
                            });  
                        }else{
                            if(response.errCode==4){
                                $alert.msgDialogError(getRcString("MAIN"),'error'); 
                           }else{
                                $alert.msgDialogError(getRcString("BIND_FAIL"),'error');
                           }
                        }
                    }).error(function(data,header,config,status){
                        $alert.msgDialogError(getRcString("BIND_FAIL"),'error');
                    });        
                })  
            }
        //  =========================点击事件结束==============================         
    }]
});