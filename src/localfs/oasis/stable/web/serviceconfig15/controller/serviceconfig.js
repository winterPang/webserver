/*该版本仅支持单AC，后续支持多AC需更换接口*/
define(['jquery','utils','bsTable'],function($scope,Utils) {
    return ['$scope', '$http','$state','$compile','$alertService','$rootScope',function($scope,$http,$state,$compile,$alert,$rootScope){
        function getRcString(attrName){
            return Utils.getRcString("serverConfig_rc",attrName);
        }

        var g_groupName = $scope.branchName;
        var g_topName=$scope.topName;
        var g_devSN=$scope.sceneInfo.sn;
        var g_stname,g_stnames,g_bind;

        


        /*初始化info*/
        $scope.info={
        	pwdState:"pwdOn",
        	wirelessServer:"wirelessOpen",
        	bind:"bindOn",
        	authType:"auth_off"
        }

        $scope.editInfo={
        	stName:"",
        	SSID:"",
        	pwdState:"pwdOn",
        	wirelessServer:"wirelessOpen",
        	authType:"auth_off"
        }

        $scope.$on('hidden.bs.modal#template', function () {
            $scope.info={
	        	pwdState:"pwdOn",
	        	wirelessServer:"wirelessOpen",
	        	bind:"bindOn",
	        	authType:"auth_off"
        	} 
           
            $scope.auth = false; 
            $scope.pwd = true; 
            $scope.serviceForm.$setPristine();
            $scope.serviceForm.$setUntouched(); 

        });

        //初始化服务模板表格    
        $scope.serverTable={
	        tId:'serverConfigTable', 
	        /*url:"/v3/ant/confmgr",              
	        method:'post',  */           
	        contentType:"application/x-www-form-urlencoded",          
	        striped:false,
	        pagniation:true,
	        clickToSelect: true,
	        searchable: true,  
	        detailView: true,
	        queryParams:function(params) {
	            params={
	                /*"start":1,
	                "size":10,
	                "order":'asc',
	                "limit":10,
	                "offset":0,*/
	                "configType":1,                
	                "cloudModule":"stamgr",
	                "method":"SSIDGetByGroupId",                 
	                "devSN":$scope.sceneInfo.sn,
	                "groupId":g_groupName,
	                "param":{}
	            }
	            return params;
	        }, 
            /*responseHandler:function(res){
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
            },*/
            columns:[
                        {sortable:true,searcher:{type:"text"},field:'stName',title:getRcString('CONFIG_HEADER').split(",")[0]},
                        {sortable:true,searcher:{type:"text"},field:'ssidName',title:getRcString('CONFIG_HEADER').split(",")[1]},        
                        {sortable:true,searcher:{type:"select",
                                                 valueField:"value",
                                                 textField:"text",
                                                 data:[
                                                 {value:getRcString("STATUS").split(",")[0],text:getRcString("STATUS").split(",")[0]},
                                                 {value:getRcString("STATUS").split(",")[1],text:getRcString("STATUS").split(",")[1]}
                                                 ]
                                                },
                                                field:'status',title:getRcString('CONFIG_HEADER').split(",")[3]},
                                                                    
            ], 
            operateWidth: 240,
            operateTitle: getRcString('OPERAT'), 
            operate:{  
                bind: function(e,row,$btn){
                    $state.go('^.bind15',{stname:row.stName});
                },                                                                                  
                remove:function(e,row,$btn){
                    $alert.confirm(getRcString("DEL_CON"), 
                        function () { 
                        	$http({
					            url:"/v3/ant/confmgr",
					        	method:"POST",
					            data:{                      
					                configType:1,                
					                cloudModule:"stamgr",
					                method:"SSIDGetByGroupId",
					                groupId:g_groupName,
					                devSN:g_devSN,
					                param:{
					                	"stName":row.stName
					                }
					            }         
					        }).success(function(response){   
					        	for(var i=0,len=response.result[0].bindApList.length;i<len;i++){
					        		$http({
							            url:"/v3/ant/confmgr",
							        	method:"POST",
							            data:{                      
							                configType:0,                
							                cloudModule:"stamgr",
							                deviceModule:"stamgr",
							                method:"SSIDBindByAP",
							                groupId:g_groupName,
							                devSN:g_devSN,
							                param:{
							                	"stName":row.stName,
							                	/*"apSN":response.result[0].bindApList[i].,
							                	radioId:response.result[0].bindApList[i].*/
							                }
							                	
							                
							            }         
							        }).success(function(response){   
							        	                                                                  
							        }).error(function(response){
							        });
					        	}                                                                  
					        }).error(function(response){
					        });
                        }, 
                        function () {                          
                        }
                    ); 

                        
               },  
                                                                                                       
            }, 
            tips:{ 
                bind:getRcString("BIND"), 
                remove:getRcString("REMOVE"),
                                                           
            }, 
            icons: {   
                bind:'fa fa-link',     
                remove:'fa fa-trash',                                          
            },                                          
        }; 

        refreshTable();

        /*表格内嵌ajax失效，单独请求*/
        function refreshTable(){
        	$http({
	            url:"/v3/ant/confmgr",
	        	method:"POST",
	            data:{                      
	                configType:1,                
	                cloudModule:"stamgr",
	                method:"SSIDGetByGroupId",
	                groupId:g_groupName,
	                devSN:g_devSN,
	                param:{}
	            }         
	        }).success(function(response){ 
	        	g_stnames=[];
	        	for(var i=0,len=response.result.length;i<len;i++){
	        		g_stnames.push(response.result[i].stName);
	        	}
	            $scope.$broadcast('load#serverConfigTable',response.result);
	            $scope.$broadcast('refresh#serverConfigTable');                                                                      
	        }).error(function(response){
	        });
        }
        
         
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

        /*toggle内容*/
        $http.get("../serviceconfig15/views/cn/toggle.html").success(function (data) {             
                    $scope.html = data;
                    $scope.$on('expanded-row.bs.table#serverConfigTable', function (e, data) {
                    	var $ele = $compile($scope.html)($scope);
                        data.el.append($ele);

                    	$scope.editInfo.stName=data.row.stName;
                    	$scope.editInfo.SSID=data.row.ssidName;
                    	/*$scope.editInfo.pwdState=data.row.ssidName;
                    	$scope.editInfo.wirelessServer=data.row.ssidName;*/

                    });                   
            });


        //创建新的服务模板
        $scope.submit=function(){
        	if(g_stnames.indexOf($scope.info.stName)==-1){
        		g_stName=$scope.info.stName;
        		g_bind=$scope.info.bind;

	        	if($scope.info.pwdState=="pwdOn"){
	                aData={
	            		stName:$scope.info.stName,
	                	ssidName:$scope.info.SSID,
	                	status:$scope.info.pwdState =='wirelessOpen'?1:2,                   
	                	akmMode:1,
	                    cipherSuite:20,
	                    securityIE:3,
	                    psk:$scope.info.pwd,
	                	acList:[{
	                		acSN:$scope.sceneInfo.sn                   	
	                	}]                                           
	                } 
	            }else if($scope.info.pwdState=="pwdOff"){
	                aData={
	                    stName:$scope.info.stName,
	                	ssidName:$scope.info.SSID,
	                	status:$scope.info.pwdState =='wirelessOpen'?1:2, 
	                	acList:[{
	                		acSN:$scope.sceneInfo.sn                   	
	                	}] 
	                }
	            } 

	        	$http({
	                url:"/v3/ant/confmgr",
	            	method:"POST",
	                data:{                      
	                    configType:1,
	                    cloudModule:"stamgr",
	                    method:"SSIDUpdateByGroupId",
	                    userName:$scope.userInfo.user,
	                    topId:g_topName,
	                    groupId:g_groupName,                
	                    devSN:$scope.sceneInfo.sn, 
	                    param:aData
	                }         
	            }).success(function(response){ 
	                if(response.result=="success"){
	                	$scope.$broadcast('hide#template',$scope);  
	                	refreshTable();
	                	if(g_bind=="bindOn"){ 
	                        $state.go('^.bind15',{stname:g_stName}); 
	                    }else{
	                        $alert.msgDialogSuccess(getRcString("ADD_SUC"));                      
	                    }
	                }                                                                        
	            }).error(function(response){
	            });
	        }else{
	        	$alert.msgDialogError(getRcString("tem_repet").split(",")[0]+$scope.info.stName+getRcString("tem_repet").split(",")[1],'error');
	        }
        }

        /*点击事件*/
        $scope.addTemplate = function () {
            $scope.$broadcast('show#template',$scope);        
        } 

           

        /*radio*/
        $scope.pwd=true;
        $scope.pwdOn=function(){
        	$scope.pwd = true;
        	$scope.info.pwdState="pwdOn";
        }   
        $scope.pwdOff=function(){
        	$scope.pwd = false; 
        	$scope.info.pwdState="pwdOff";
        }  

        $scope.editPwd=true;
        $scope.editPwdOn=function(){
        	$scope.editPwd = true;
        	$scope.editInfo.pwdState="pwdOn";
        }   
        $scope.editPwdOff=function(){
        	$scope.editPwd = false; 
        	$scope.editInfo.pwdState="pwdOff";
        } 

        $scope.wirelessOpen=function(){
        	$scope.info.wirelessServer="wirelessOpen";
        }   
        $scope.wirelessClosed=function(){
        	$scope.info.wirelessServer="wirelessClosed";
        } 

        $scope.editWirelessOpen=function(){
        	$scope.editInfo.wirelessServer="wirelessOpen";
        }   
        $scope.editWirelessClosed=function(){
        	$scope.editInfo.wirelessServer="wirelessClosed";
        } 

        $scope.auth=false;
        $scope.editAuth=false;
        $scope.auth_on=function(){
			$scope.info.authType ='auth_on';
			$scope.auth=true;
        }
        $scope.auth_off=function(){
			$scope.info.authType ='auth_off';
			$scope.auth=false;
        }
        $scope.editAuth_on=function(){
			$scope.editInfo.authType ='auth_on';
			$scope.editAuth=true;
        }
        $scope.editAuth_off=function(){
			$scope.editInfo.authType ='auth_off';
			$scope.editAuth=false;
        }

        $scope.bindOn=function(){
        	$scope.info.bind="bindOn";
        }   
        $scope.bindOff=function(){
        	$scope.info.bind="bindOff";
        } 

        //密码框切换监听
        $scope.$watch("serviceForm.password.$viewValue", function (v) {        
            $scope.info.pwd = v;
            
        });
        $scope.$watch("serviceForm.text.$viewValue", function (v) {
            $scope.info.pwd = v;
        });
    }]
});