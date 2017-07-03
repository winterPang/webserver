
define(['jquery','utils','bsTable','bootstrapDatetimepicker','css!noticesetting0/css/bootstrap-datetimepicker'],function($scope,Utils) {
    return ['$scope', '$http','$state','$compile','$window','$stateParams','$alertService','$rootScope',function($scope,$http,$state,$compile,$window,$stateParams,$alert,$rootScope){
        function getRcString(attrName){
            return Utils.getRcString("locationmanage_rc",attrName);
        }
        //  =========================页面初始化开始==============================   
        	var gDate=[];
        	var shopListUrl = Utils.getUrl('GET','',/*'/location/queryShopList',*/'../../init/locationmanage/table.json');
        	$http.get("../locationmanage/views/" + Utils.getLang() + "/toggle.html").success(function (data) {
	            $scope.html = data;
	        });

	        $scope.locationTable={
                tId:'locationTable', 
                url:"../../init/locationmanage/table.json",
	            method:"get", 
                dataField:'shopList',
                totalField:'shopTotalCnt',                
                striped:true,
                pagniation:true,
                clickToSelect: true,
                showPageList:false,
                /*searchable: true, */ 
                detailView: false,
                singleSelect:true,
                columns:[        
                	{checkbox:true},                     
                    {sortable:false,/*align:'center',*/searcher:{type:"text"},field:'shop_name',title:getRcString('LOCATION_TITLE').split(",")[0],
                    	/*formatter:function(value,row,index){
                    		if(row.locationOpenState=="on"){
                   				return '<a class="list-link">'+value+'</a>';
                   			}else{
                   				return value;
                   			}
                    	}*/
                	},                                   
                    {sortable:false,/*align:'center',*/field:'locationCount',title:getRcString('LOCATION_TITLE').split(",")[1]},                                                                                            
                    {sortable:false,/*align:'center',*/field:'devCnt',title:getRcString('LOCATION_TITLE').split(",")[2]},                                                                                            
                ]                                          
            };

            $scope.locationTableData =[];
            $scope.detailsDisabled =true;
            $scope.mapEditDisabled =true;
            $scope.positionSettingDisabled =true;
            var checkEvt = [
                "check.bs.table#locationTable","uncheck.bs.table#locationTable",    
            ];
            angular.forEach(checkEvt, function (value, key, values) {
                $scope.$on(value, function () {
                	debugger
                    $scope.$broadcast("getSelections#" + value.split("#")[1], function (data) {
                    	debugger
                        $scope.$apply(function () {
                        	$scope.locationTableData = data;
                            $scope.detailsDisabled = !$scope.locationTableData.length;                      
                            $scope.mapEditDisabled = !$scope.locationTableData.length;                      
                            $scope.positionSettingDisabled = !$scope.locationTableData.length;                      
                        });
                    });
                });
            });

            $scope.mapEdit = function(){  
                        
                $scope.$broadcast('getAllSelections#locationTable',{},function(data){                       
                    debugger
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

            $scope.deviceTable={
                tId:'deviceTable', 
                url:"../../init/locationmanage/devtable.json",
	            method:"get", 
                dataField:'devList',
                totalField:'devTotalCnt',
                showCheckBox:true,                    
                striped:false,
                pagniation:false,
                /*clickToSelect: true,*/
                showPageList:false, 
                columns:[
                    {sortable:false,align:'center',field:'devsn',title:getRcString('DEVICE_TITLE').split(",")[0]},                                   
                    {sortable:false,align:'center',field:'dev_name',title:getRcString('DEVICE_TITLE').split(",")[1]},                                      
                    {sortable:false,align:'center',field:'state',title:getRcString('DEVICE_TITLE').split(",")[2],
                    	formatter: function(value,row,index){             			
                   			if(row.state=="on"){
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

            $scope.cycleModal={
	            options:{
	                 mId:'cycleModal',
	                 title:getRcString('MODAL_TITLE'),                          
	                 autoClose: true,                         
	                 showCancel: false, 
	                 showFooter:false,
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

	        $scope.devsnDatas=[
	        	{"devsn":"2312sda1232332","state":"checked"},
	        	{"devsn":"2312sda1232333","state":"checked"},
	        	{"devsn":"2312sda1232334","state":""},
	        	{"devsn":"2312sda1232335","state":"checked"},
	        	{"devsn":"2312sda1232336","state":""},
	        	{"devsn":"2312sda1232337","state":"checked"},
	        	{"devsn":"2312sda1232338","state":""},
	        	{"devsn":"2312sda1232339","state":""},
	        ]
        //  =========================页面初始化结束==============================
        
        	
        //  =========================修改开始==============================
                      
        //  =========================修改结束==============================
        

        //  =========================事件开始==============================
        	$scope.refresh=function(){
        		$scope.$broadcast('refresh#locationTable');
        	}

        	$scope.$on('click-cell.bs.table#locationTable',function (e, field, value, row, $element){     
	
	            if(field=='locationOpenState'){
	            	if(row.locationOpenState=="on"){
	            		row.locationOpenState="off"
	            		$element.find('.switch ').removeClass('checked')
	            	}else{
	            		row.locationOpenState="on"
	            		$element.find('.switch ').addClass('checked')
	            		/*$http({
		                    url:"../../init/locationmanage/devtable.json",
	            			method:"get", 	                            
		                }).success(function(response){ 
		                debugger                 
		                	$scope.$broadcast('refresh#bindAp',response.devList); 
		                	debugger                                                                        
		                }).error(function(response){
		                });*/
	            		$scope.$broadcast('show#cycleModal',$scope);
	            	}                
	            }
	        })      

	        $scope.$on('click-cell.bs.table#deviceTable',function (e, field, value, row, $element){     
	            if(field=='state'){
	            	if(row.state=="on"){
	            		row.state="off"
	            		$element.find('.switch ').removeClass('checked')
	            	}else{
	            		row.state="on"
	            		$element.find('.switch ').addClass('checked')
	            		/*$http({
		                    url:"../../init/locationmanage/devtable.json",
	            			method:"get", 	                            
		                }).success(function(response){ 
		                debugger                 
		                	$scope.$broadcast('refresh#bindAp',response.devList); 
		                	debugger                                                                        
		                }).error(function(response){
		                });
	            		$scope.$broadcast('show#cycleModal',$scope);*/
	            	}                
	            }
	        })   

	        $scope.$on('expanded-row.bs.table#locationTable', function (e, data) {
	            var row = data.row, el = data.el;

	            var $ele = $compile($scope.html)($scope);
	            el.append($ele);

	        });

        	/*$scope.$on('show.bs.modal#cycleModal', function () {      		
              	$("#devsnState").delegate("div","click",function(){
		        	if($(this).hasClass("checked")){
		        		$(this).removeClass("checked");
		        	}else{
		        		$(this).addClass("checked");
		        	}
		        })
            }); 

        	$scope.$on('hidden.bs.modal#cycleModal', function () {      		
              	$("#devsnState").undelegate("div","click");
            }); */


            /*for(var i=0,len=$("#devsnState>li").length;i<len;i++){
            	var obj="";
            	obj.devsn=$($("#devsnState>li>label")[i]).html();
            	obj.state=$($("#devsnState>li>div>div")[i]).hasClass("checked");
            	gDate.push(obj);
            }
	        */

        //  =========================事件结束==============================     
    }]
});