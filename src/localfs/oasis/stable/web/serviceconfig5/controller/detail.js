define(['jquery','utils','bsTable'],function($scope,Utils) {
    return ['$scope', '$http','$state','$alertService','$rootScope',function($scope,$http,$state,$alert,$rootScope){
        function getRcString(attrName){
            return Utils.getRcString("serverConfig_rc",attrName);
        }
        
        var g_stName,g_stnames,g_authType,g_ssid,g_authTemName,g_pageTemName,g_bind,g_typeAuth,g_typePub,g_themeType;

        var getssidlistUrl = Utils.getUrl('GET','','/ssidmonitor/getssidlist?devSN='+$scope.sceneInfo.sn/*+'ownerName='+$scope.userInfo.user+'nasId='+$scope.sceneInfo.nasid*/);
        var getssidinfobriefUrl = Utils.getUrl('GET','','/ssidmonitor/getssidinfobrief?devSN='+$scope.sceneInfo.sn+'&ownerName='+$scope.userInfo.user+'&nasId='+$scope.sceneInfo.nasid,'/init/serviceconfig5/infobrief.json');
        var getstbindaplistUrl = Utils.getUrl('GET','','/ssidmonitor/getstbindaplist?devSN='+$scope.sceneInfo.sn,'/init/serviceconfig5/infobrief.json');
        var getstbindapgrouplistUrl = Utils.getUrl('GET','','/ssidmonitor/getstbindapgrouplist?devSN='+$scope.sceneInfo.sn,'/init/serviceconfig5/infobrief.json');
        var queryTemplateUrl = Utils.getUrl('GET','','/v2/authcfg/query?','/init/serviceconfig5/infobrief.json');
        var queryPageTemUrl = Utils.getUrl('GET','','/v2/themetemplate/query?','/init/serviceconfig5/infobrief.json');
        var queryWeixinAccountUrl = Utils.getUrl('GET','auth-data/restapp/o2oportal/weixinaccount/query?','/init/serviceconfig5/infobrief.json');
        var queryPubmngUrl = Utils.getUrl('GET','','/v2/pubmng/query?','/init/serviceconfig5/infobrief.json');
        var apListUrl = Utils.getUrl('GET','','/ssidmonitor/getstbindaplist','/init/servicebind5/apgroupbindlist.json');
        var apGroupListUrl = Utils.getUrl('GET','','/ssidmonitor/getstbindapgrouplist','/init/servicebind5/apgroupbindlist.json');

        var synConfigUrl = Utils.getUrl('POST','','/ant/confmgr','/init/serviceconfig5/infobrief.json');
        var ssidUpdateUrl= Utils.getUrl('POST','','/ant/confmgr','/init/serviceconfig5/infobrief.json');
        var apUnbindUrl= Utils.getUrl('POST','','/ant/confmgr','/init/serviceconfig5/infobrief.json');
        var ApGroupUnbindUrl= Utils.getUrl('POST','','/ant/confmgr','/init/serviceconfig5/infobrief.json');
        var ssidDeleteUrl= Utils.getUrl('POST','','/ant/confmgr','/init/serviceconfig5/infobrief.json');
        var addTemplateUrl= Utils.getUrl('POST','','/v2/authcfg/add','/init/serviceconfig5/infobrief.json');
        
        $scope.authInfo = {
            wifi:"innerWifi",
            stName:"",
            ssidName:"",
            akmMode:"",
            cipherSuite:"",
            securityIE:"",
            psk:"",
            pwdState:"pwdOn",
            wirelessServer:"wireless_open", 
            bind:"bindOn",           
            authType:"auth_off",
            ssidState:"ssid_show"     
        };    
        
        $scope.$on('hidden.bs.modal#template', function () {
            $scope.authInfo = {
                wifi:"innerWifi",
                server:"",
                ssidName:"",              
                pwdState:"pwdOn",
                pwd:"",
                wirelessServer:"wireless_open",   
                bind:"bindOn",           
                authType:"auth_off",
                ssidState:"ssid_show",
                authSelect:$scope.authCfgTemplates[0],     
                pageSelect:$scope.themeNames[0]     
            }; 
           
            $scope.auth = false; 
            $scope.pwd = true; 
            $scope.authForm.$setPristine();
            $scope.authForm.$setUntouched(); 

        });

        //查询认证模板
        $http({
            url:'/v3/ace/oasis/auth-data/restapp/o2oportal/authcfg/query',
            method:"GET", 
            params:{            
                storeId:$scope.sceneInfo.nasid,
            }         
        }).success(function(response){ 
            g_typeAuth=response.data;  
            g_authTemNames=[];
            for(var i=0,len=response.data.length;i<len;i++){
                g_authTemNames.push(response.data[i].authCfgTemplateName);                                       
            } 
            $scope.authCfgTemplates=g_authTemNames;
            $scope.authInfo.authSelect=$scope.authCfgTemplates[0];
        }).error(function(response){
        });            
        
        //查询页面模板       
        $http({
            url:'/v3/ace/oasis/auth-data/restapp/o2oportal/pagetemplate/queryAllData',
            method:"GET", 
            params:{            
                storeId:$scope.sceneInfo.nasid,
            }         
        }).success(function(response){
            g_themeNames=[];
            g_themeType=response.data;
            for(var i=0,len=response.data.length;i<len;i++){
                g_themeNames.push(response.data[i].themeName+getRcString("themeName").split(",")[response.data[i].themeType]);                            
            }       
            $scope.themeNames=g_themeNames;
            $scope.authInfo.pageSelect=$scope.themeNames[0];
        }).error(function(response){
        });  


        //查询发布管理
        $http({
            url:'/v3/ace/oasis/auth-data/restapp/o2oportal/pubmng/query',
            method:"GET",
            params:{
                nasId:$scope.sceneInfo.nasid,
            }
        }).success(function(response){ 
            g_typePub=response.data;
            initTable();
        }).error(function(response){
        });        
 
        //初始化无线服务表格
        function initTable(){
            $scope.serverTable={
                tId:'serverConfigTable', 
                url:getssidinfobriefUrl.url,
                method:getssidinfobriefUrl.method, 
                dataField:'ssidList',
                totalField:'ssidTotalCnt',                
                striped:false,
                pagniation:true,
                clickToSelect: true,
                searchable: true,  
                responseHandler:function(res){
                    var adata=res.ssidList;  
                    g_stnames=[]; 
                             
                    for(var i=0,len=adata.length;i<len;i++){
                        adata[i].lvzhouAuthMode="";
                        for(var j=0,len2=g_typePub.length;j<len2;j++){                        
                            if(adata[i].ssid==g_typePub[j].ssidIdV3){   

                                for(var k=0,len3=g_typeAuth.length;k<len3;k++){
                                    if(g_typePub[j].authCfgName==g_typeAuth[k].authCfgTemplateName){
                                       if(g_typeAuth[k].authType==1){
                                            adata[i].lvzhouAuthMode=getRcString("AUTH_TYPE").split(",")[1]
                                       }else if(g_typeAuth[k].authType==2){
                                            adata[i].lvzhouAuthMode=getRcString("AUTH_TYPE").split(",")[2]
                                       }
                                    }                                                 
                                }
                            }
                        }
                        if(adata[i].lvzhouAuthMode==""){
                            adata[i].lvzhouAuthMode=getRcString("AUTH_TYPE").split(",")[0]
                        }
                        adata[i].status==1?(adata[i].status=getRcString("STATUS").split(",")[0]):(adata[i].status=getRcString("STATUS").split(",")[1]); 
                        g_stnames.push(adata[i].stName);  
                    }
                    return res;
                },
                columns:[
                            {sortable:true,searcher:{type:"text"},field:'stName',title:getRcString('CONFIG_HEADER').split(",")[0]},
                            {sortable:true,searcher:{type:"text"},field:'ssidName',title:getRcString('CONFIG_HEADER').split(",")[1]},
                            {sortable:true,searcher:{type:"select",
                                                     valueField:"value",
                                                     textField:"text",
                                                     data:[
                                                        {value:getRcString("AUTH_TYPE").split(",")[0],text:getRcString("AUTH_TYPE").split(",")[0]},
                                                        {value:getRcString("AUTH_TYPE").split(",")[1],text:getRcString("AUTH_TYPE").split(",")[1]},
                                                        {value:getRcString("AUTH_TYPE").split(",")[2],text:getRcString("AUTH_TYPE").split(",")[2]},
                                          
                                                    ]},
                            field:'lvzhouAuthMode',title:getRcString('CONFIG_HEADER').split(",")[2]},
                            {sortable:true,searcher:{type:"select",
                                                     valueField:"value",
                                                     textField:"text",
                                                     data:[
                                                     {value:getRcString("STATUS").split(",")[0],text:getRcString("STATUS").split(",")[0]},
                                                     {value:getRcString("STATUS").split(",")[1],text:getRcString("STATUS").split(",")[1]}
                                                     ]
                                                    },
                                                    field:'status',title:getRcString('CONFIG_HEADER').split(",")[3]},
                            /*{sortable:true,searcher:{type:"text"},field:'ApGroupCnt',title:getRcString('CONFIG_HEADER').split(",")[4],
                                formatter: function(value,row,index){
                                    return '<a class="list-link">'+value+'</a>';
                                } 
                            },*/
                            {sortable:true,searcher:{type:"text"},field:'ApCnt',title:getRcString('CONFIG_HEADER').split(",")[5],
                                formatter: function(value,row,index){
                                    return '<a class="list-link">'+value+'</a>';
                                } 
                            }                       
                ], 
                operateWidth: 240,
                operateTitle: getRcString('OPERAT'), 
                operate:{  
                    bind: function(e,row,$btn){
                        $state.go('^.bind',{stname:row.stName});
                    }, 
                    edit:  function(e,row,$btn){
                        $state.go('^.edit',{stname:row.stName});
                    },                                                                                 
                    remove:function(e,row,$btn){
                        $alert.confirm(getRcString("DEL_CON"), 
                            function () { 
                                if(row.bindApGroupList.length>0||row.bindApList.length>0){                              
                                    if(row.bindApGroupList.length>0&&row.bindApList.length==0){                            
                                        apGroupUnbind(row.bindApGroupList,row.stName);                                                    
                                    }else if(row.bindApGroupList.length==0&&row.bindApList.length>0){                            
                                        apUnbind(row.bindApList,row.stName);                                                          
                                    }else if(row.bindApGroupList.length>0&&row.bindApList.length>0){
                                        apGroupUnbind(row.bindApGroupList,row.stName);
                                        apUnbind(row.bindApList,row.stName);                                  
                                    } 
                                    $http({
                                        url:synConfigUrl.url,
                                        method:synConfigUrl.method, 
                                        data:{    
                                            devSN:$scope.sceneInfo.sn,    
                                            configType:0,
                                            cloudModule:"stamgr",
                                            deviceModule:"stamgr",
                                            method:"SyncSSIDList",
                                            cfgTimeout:10000,
                                            param:[{}]
                                        }         
                                    }).success(function(response){ 
                                        ssidDelete(row.stName);                                                                        
                                    }).error(function(response){
                                    });  
                                }else{
                                    ssidDelete(row.stName);
                                }                                                             
                            }, 
                            function () {                          
                            }
                        ); 

                            
                   },  
                                                                                                           
                }, 
                tips:{ 
                    bind:getRcString("BIND"),                       
                    edit:getRcString("EDIT"), 
                    remove:getRcString("REMOVE"),
                                                               
                }, 
                icons: {   
                    bind:'fa fa-link',                                                                                                   
                    edit:'fa fa-edit',  
                    remove:'fa fa-trash',                                          
                },                                          
            }; 
        }      
            
      

        //无线服务表格定向跳转
        $scope.$on('click-cell.bs.table#serverConfigTable',function (e, field, value, row, $element){
            var stname=row.stName;
            if(field=='ApGroupCnt'){                          
                $http({
                    url:apGroupListUrl.url,
                    method:apGroupListUrl.method,  
                    params:{
                        devSN:$scope.sceneInfo.sn,
                        stName:stname
                    }         
                }).success(function(response){  
                    for(var i=0,len=response.bindApGroupList.length;i<len;i++){
                        response.bindApGroupList[i].modelNum=response.bindApGroupList[i].modelList.length;
                    }                                     
                    $scope.$broadcast('show#apGroupModal',$scope);                    
                    $scope.$broadcast('load#bindApGroupTable',response.bindApGroupList); 
                }).error(function(response){
                    //处理响应失败
                });              
            }else if(field=='ApCnt'){
                $http({
                    url:apListUrl.url,
                    method:apListUrl.method,
                    params:{
                        devSN:$scope.sceneInfo.sn,
                        stName:stname,
                    }          
                }).success(function(response){                
                    $scope.$broadcast('load#bindapTable',response.bindApList);
                    $scope.$broadcast('show#apModal',$scope);        
                }).error(function(response){
                    //处理响应失败
                });                              
            }
        })
          
        //ApGroupCnt单击事件
        $scope.apGroupButtons={
            options:{
                 mId:'apGroupModal',
                 title:getRcString('BIND_APGROUP_TITLE'),                          
                 autoClose: true,                         
                 showCancel: false, 
                 modalSize:"lg",                       
                 buttonAlign: 'center',                    
                 okHandler: function(modal,$ele){
                 //点击确定按钮事件，默认什么都不做
                 },
                 cancelHandler: function(modal,$ele){
                 //点击取消按钮事件，默认什么都不做
                 },
                 beforeRender: function($ele){
                 //渲染弹窗之前执行的操作,$ele为传入的html片段
                    return $ele;
                 }
            }
        }
      
        //初始化已绑定AP组表格
        $scope.apGroupTable={
            tId:'bindApGroupTable',
            striped:true,        
            pagniation:false,
            clickToSelect: true,
            showPageList:false,
            pageSize:10, 
            columns:[
                {sortable:true,align:'center',field:'apGroupName',title:getRcString('BIND_APGROUP_HEADER').split(",")[0]},
                {sortable:true,align:'center',field:'description',title:getRcString('BIND_APGROUP_HEADER').split(",")[1]},                                      
                {sortable:true,align:'center',field:'modelNum',title:getRcString('BIND_APGROUP_HEADER').split(",")[2]}                                      
            ],      
        };

        //ApCnt单击事件
        $scope.apButtons={
            options:{
                 mId:'apModal',
                 title:getRcString('BIND_AP_TITLE'),                          
                 autoClose: true,                         
                 showCancel: false, 
                 modalSize:"lg",                        
                 buttonAlign: 'center',                    
                 okHandler: function(modal,$ele){
                 //点击确定按钮事件，默认什么都不做
                 },
                 cancelHandler: function(modal,$ele){
                 //点击取消按钮事件，默认什么都不做
                 },
                 beforeRender: function($ele){
                 //渲染弹窗之前执行的操作,$ele为传入的html片段
                    return $ele;
                 }
            }

        }

        //初始化已绑定AP表格
        $scope.apTable={
            tId:'bindapTable',
            striped:true,
            pagniation:false,
            clickToSelect: false,
            showPageList:false,
            pageSize:10,                 
            columns:[
                    {sortable:true,align:'center',field:'apName',title:getRcString('BIND_AP_HEADER').split(",")[0]},                                    
                    {sortable:true,align:'center',field:'apSN',title:getRcString('BIND_AP_HEADER').split(",")[1]},                                     
                    {sortable:true,align:'center',field:'apModel',title:getRcString('BIND_AP_HEADER').split(",")[2]},                                     
                    {sortable:true,align:'center',field:'radioNum',title:getRcString('BIND_AP_HEADER').split(",")[3]},                                     
                    //{sortable:true,align:'center',field:'apGroupName',title:getRcString('BIND_AP_HEADER').split(",")[4]},                                     
            ], 
        }

        /*按钮*/
        //添加按钮
        $scope.addTemplate = function () {
            $scope.$broadcast('show#template',$scope);        
        }
        //同步按钮
        $scope.synConfig = function () {
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
                if(response.result=="success"){
                    $alert.msgDialogSuccess(getRcString("SYN_SUC"));
                    $scope.$broadcast('refresh#serverConfigTable');
                }else{
                    if(response.errCode==4){
                        $alert.msgDialogError(getRcString("MAIN"),'error'); 
                   }else{
                        $alert.msgDialogError(getRcString("SYN_FAIL"),'error');                  
                   }
                }                                         
            }).error(function(response){
            });     
        }
       
        //无线服务模态框 
        $scope.template={
            options:{
                 mId:'template',
                 title:getRcString("MODAL_TITLE").split(",")[0],                          
                 autoClose: true,  
                 showCancel: false,  
                 showFooter:false,   
                 buttonAlign: "center", 
                 modalSize:'lg',                 
                 okHandler: function(modal,$ele){                                                                                                                  
                 },
                 cancelHandler: function(modal,$ele){
                 },
                 beforeRender: function($ele){
                     return $ele;
                 }
            }
        }
    
        /*事件函数*/
        //完成无线服务添加
        $scope.ssidUpdate=function(){
            var aData;
            g_stName=$scope.authInfo.server;
            g_authType=$scope.authInfo.authType;     
            g_ssid=$scope.authInfo.SSID;
            g_authTemName=$scope.authInfo.authSelect;                
            g_pageTemName=$scope.authInfo.pageSelect;
            g_bind=$scope.authInfo.bind;        

            if(g_stnames.indexOf($scope.authInfo.server)==-1){
                if($scope.authInfo.pwdState=="pwdOn"){
                    aData=[{
                            stName:$scope.authInfo.server,
                            ssidName:$scope.authInfo.SSID,
                            akmMode:1,
                            cipherSuite:20,
                            securityIE:3,
                            description:3,
                            psk:$scope.authInfo.pwd,
                            status:$scope.authInfo.wirelessServer=="wireless_open"?1:2,
                            hideSSID:$scope.authInfo.ssidState=="ssid_show"?1:0                      
                        }] 
                }else if($scope.authInfo.pwdState=="pwdOff"){
                    aData=[{
                            akmMode:0,
                            cipherSuite:0,
                            securityIE:0,
                            psk:"",
                            description:3,
                            stName:$scope.authInfo.server,
                            ssidName:$scope.authInfo.SSID,            
                            status:$scope.authInfo.wirelessServer=="wireless_open"?1:2,
                            hideSSID:$scope.authInfo.ssidState=="ssid_show"?1:0 
                    }]
                }            

                $http({
                    url:ssidUpdateUrl.url,
                    method:ssidUpdateUrl.method, 
                    data:{            
                        devSN:$scope.sceneInfo.sn,
                        configType:0,
                        cloudModule:"stamgr",
                        deviceModule:"stamgr",
                        method:"SSIDUpdate",                      
                        param:aData 
                    }         
                }).success(function(response){                             
                    if(response.result=="success"){
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
                            $scope.$broadcast('refresh#serverConfigTable');
                            
                            if(g_authType=="auth_on"){                                                           
                                addPubmng();
                            }else{                               
                                if(g_bind=="bindOn"){
                                    $state.go('^.bind',{stname:g_stName});  
                                }else{
                                    $alert.msgDialogSuccess(getRcString("ADD_SUC"));                      
                                }
                            }                                                                       
                        }).error(function(response){
                        });                       
                    }else{  
                        if(response.errCode==4){
                            $alert.msgDialogError(getRcString("MAIN"),'error'); 
                       }else{                 
                            $alert.msgDialogError(getRcString("ADD_FAIL"),'error');
                       }                                            
                    }               
                }).error(function(response){
                });           
            }else{             
                $alert.msgDialogError(getRcString("SER_REPIT"),'error');
            }
            $scope.$broadcast('hide#template',$scope);            
        }
        
        //删除无线服务按钮功能       
        
        //解绑所有已绑定到无线服务的ap
        function apUnbind(aData,stname){         
            var aData2=[];
            for(var i=0,len=aData.length;i<len;i++){         
                /*for(j=1,len2=parseInt(aData[i].radioNum);j<=len2;j++){
                    var obj={};
                    obj={                   
                            apSN:aData[i].apSN,
                            apName:aData[i].apName,
                            radioId:j,
                            stName:stname,                         
                         };
                    aData2.push(obj);
                }*/
                                    
                var obj={};
                obj={                   
                        apSN:aData[i].apSN,
                        apName:aData[i].apName,
                        radioId:aData[i].radioId,
                        stName:stname,                         
                     };
                aData2.push(obj);
            }
             
            $http({
                url:apUnbindUrl.url,
                method:apUnbindUrl.method, 
                data:{            
                    devSN:$scope.sceneInfo.sn,
                    deviceModule:"stamgr",
                    cloudModule:"stamgr",
                    method:"SSIDUnbindByAP",  
                    configType:0,
                    param:aData2
                }         
            }).success(function(response){                           
            }).error(function(response){
            });           
        }      
        //解绑所有已绑定到无线服务的ap组
        function apGroupUnbind(aData,stname){
            var aData2=[];
            for(i=0,len=aData.length;i<len;i++){
                /*if(aData[i].modelList){
                    for(var j=0,len2=aData[i].modelList.length;j<len2;j++){
                       for(var k=1,len3=parseInt(aData[i].modelList[j].radioNum);k<=len3;k++){
                                var obj={};
                                obj={
                                    apGroupName:aData[i].apGroupName ,
                                    apModelName:aData[i].modelList[j].model,
                                    radioId:k,
                                    stName:stname
                                    };
                                aData2.push(obj);             
                        }
                    }
                }*/
                var obj={};
                obj={
                    apGroupName:aData[i].ApGroupName , 
                    apModelName:aData[i].ApModel,                        
                    radioId:aData[i].radioId,
                    stName:stname
                    };
                aData2.push(obj);                
            }
                                  
            $http({
                url:ApGroupUnbindUrl.url,
                method:ApGroupUnbindUrl.method, 
                data:{   
                    devSN:$scope.sceneInfo.sn,      
                    deviceModule:"stamgr",
                    cloudModule:"stamgr",                
                    configType:0,
                    method: "SSIDUnbindByAPGroup",  
                    param:aData2, 
                }         
            }).success(function(response){              
            }).error(function(response){
            });           
        }
        //删除
        function ssidDelete(stname){
            $http({
                url:ssidDeleteUrl.url,
                method:ssidDeleteUrl.method, 
                data:{            
                    devSN:$scope.sceneInfo.sn, 
                    configType:0,
                    cloudModule:"stamgr",
                    deviceModule:"stamgr",
                    method:"SSIDDelete",
                    param:[
                        {stName:stname}
                    ]      
                }         
            }).success(function(response){
                if(response.result=="success"){
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
                        $alert.msgDialogSuccess(getRcString("DEL_SUC")); 
                        $scope.$broadcast('refresh#serverConfigTable');                                                  
                    }).error(function(response){
                    }); 
                                       
                    deletePubmng($scope.sceneInfo.sn+stname);                  
                }else{
                    if(response.errCode==4){
                        $alert.msgDialogError(getRcString("MAIN"),'error'); 
                   }else{                  
                        $alert.msgDialogError(getRcString("DEL_FAIL"),'error'); 
                   }
                }                           
            }).error(function(response){
            });         
        }
                   
        //增加发布管理器
        function addPubmng(){
            var themeType;
            for(var i=0;i<g_themeType.length;i++){
                if(g_themeType[i].themeName==g_pageTemName.split("(")[0]){
                    themeType=g_themeType[i].themeType;
                    break;
                }
            }

            $http({
                    url:'/v3/ace/oasis/auth-data/restapp/o2oportal/pubmng/addbyv3flag',
                    method:'POST', 
                    data:{                                 
                        nasId:$scope.sceneInfo.nasid,                
                        ssidIdV3:$scope.sceneInfo.sn+g_stName,
                        ssidName:g_ssid,
                        name:g_stName,
                        authCfgName:g_authTemName,
                        themeTemplateName:g_pageTemName.split("(")[0],
                        themeType:themeType
                    }         
            }).success(function(response){  
                if(response.errorcode==0){              
                    if(g_bind=="bindOn"){
                        $state.go('^.bind',{stname:g_stName});  
                    }else{
                        $alert.msgDialogSuccess(getRcString("ADD_SUC"));                      
                    }                               
                }else{
                    $alert.msgDialogError(getRcString("PUBLISH_FAIL"),'error');
               }               
            }).error(function(response){
                $alert.msgDialogError(getRcString("PUBLISH_FAIL"),'error'); 
            }); 
        }
           
    

        //删除发布管理
        function deletePubmng(pubmng){
            $http({
                url:'/v3/ace/oasis/auth-data/restapp/o2oportal/pubmng/deleteBySsidV3?ssidV3='+pubmng+"&nasId="+$scope.sceneInfo.nasid,
                method:"GET",
                contentType: "application/json",
            }).success(function(response){                                    
            }).error(function(response){
            }); 
        }
        
        $scope.pwd=true;
        $scope.pwdOn = function() {
            $scope.pwd = true;         
        }
        $scope.pwdOff= function() {
            $scope.pwd = false;                  
        }

        $scope.auth=false;
        $scope.auth_on = function() {
            $scope.auth = true;         
        }
        $scope.auth_off= function() {
            $scope.auth = false;                  
        }

       

        //认证模板下拉框
        $scope.authSelect=false;
        $scope.authShow = function() {
            $scope.authSelect = true;
        }
        $scope.authHide = function() {
            $scope.authSelect = false;           
        }

        //页面模板下拉框
        $scope.pageSelect=false;
        $scope.pageShow = function() {
            $scope.pageSelect = true;
            
        }
        $scope.pageHide = function() {
            $scope.pageSelect = false;
        }

        $scope.feelauthOn = function() {
            $scope.unauthtime = {show:true};
        }
        $scope.feelauthOff = function() {
            $scope.unauthtime = {show:false};
        }

        //密码框切换监听
        $scope.$watch("authForm.password.$viewValue", function (v) {        
            $scope.authInfo.pwd = v;
            
        });
        $scope.$watch("authForm.text.$viewValue", function (v) {
            $scope.authInfo.pwd = v;
        });
    }]
});