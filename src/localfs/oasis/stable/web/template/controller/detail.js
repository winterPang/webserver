define(['jquery','utils','echarts','angular-ui-router','bsTable','jqueryZtree','css!frame/libs/ztree/css/zTreeStyle'],function($scope,Utils,echarts) {
    return ['$scope','$rootScope', '$http', '$alertService','$compile', '$state','$window',function($scope,$rootScope,$http,$alert,$compile,$state,$window){
        function getRcString(attrName){
        return Utils.getRcString("user_rc",attrName);
        }
        $scope.auth = true;
        $scope.page = "";
        var overallDate = [];
        var loadAgraay = ""; 
        var loadRelieve = "";
      
        $scope.create = function(){
        	$state.go("global.content.system.relete");
        }
       
        $scope.freshoption = function(){
            $http({
                url:'/v3/ant/configtemplate/getmodules',
                method:'get',
                params:{
                    userName:$rootScope.userInfo.user               
                }
            }).success(function(data){ 
                overallDate = [];                           
                var getmodules = [];
                $.each(data.message,function(i,item){
                    item.device = item.device || [];
                    if(item.device.length != 0){
                        for (var j = 0; j < item.device.length; j++){
                            var overallObj = {
                                devName:item.device[j].deviceName,
                                devSN:item.device[j].ACSN,
                                devMode:item.name,
                                devTime:new Date(item.device[j].updateDate).toLocaleDateString()+"&nbsp&nbsp"+new Date(item.device[j].updateDate).toTimeString().split(" ")[0]
                            }
                            overallDate.push(overallObj)
                        }
                    }                                       
                })
                $.each(data.message,function(i,item){                   
                    var objmodule = {
                        name:item.name,
                        descript:item.descript,
                        deviceName:[]
                    }               
                    item.device = item.device || [];
                    for(var i = 0; i < item.device.length; i++){
                        objmodule['deviceName'].push(item.device[i].deviceName);
                    }
                    objmodule.deviceNum = objmodule['deviceName'].length;
                    getmodules.push(objmodule);
                })               
                $scope.$broadcast('load#option',getmodules);

            })
            //初始页面表格
            $scope.options={
                tId:'option',
                pageSize:5,
                pageList:[5,10,20,50],
                //showPageList:true,
                clickToSelect: false,       
                searchable:true, 
                showCheckBox:true,                      
                columns:[
                    {sortable:true,field:'name',title:getRcString('Visitor_LIST_HEADER').split(",")[0],  searcher:{}},
                    {sortable:true,field:'descript',title:getRcString('Visitor_LIST_HEADER').split(",")[1], searcher:{},cellStyle:$scope.singlestyle},
                    {sortable:true,field:'deviceNum',title:getRcString('Visitor_LIST_HEADER').split(",")[2], searcher:{}}
                ],
                operateWidth: 200,
                operateTitle: getRcString('oprater'), 
                operate:{
                    edit:  function(e,row,$btn){
                        $state.go("global.content.system.editplate",{starmName:row.name});
                    },  
                    bind: function(e,row,$btn){
                        loadAgraay = row.name;
                        $scope.$broadcast('refresh#apply',{
                            pageNumber:1
                        });
                        $scope.$broadcast('show#delog');
                        $scope.$broadcast('disabled' + '.ok#delog');
                    }, 
                    customr:function(e,row,$btn){
                        loadRelieve = row.name;
                        var data = $.grep(overallDate,function(item){
                            return item.devMode == loadRelieve;
                        });

                        $scope.$broadcast('refresh#tableRelieve',{
                            pageNumber:1
                        });
                        $scope.$broadcast('show#Relieve');
                        $scope.$broadcast('disabled' + '.ok#Relieve');
                        $scope.$broadcast('load#tableRelieve',data);
                    }
                },
                tips:{                                     
                    edit: getRcString('amend'), 
                    bind: getRcString('apply'),
                    customr:getRcString('custom'),                                                          
                }, 
                icons: {   
                    bind:'fa fa-link',                                                     
                    customr: "fa fa-unlink"                                        
                },  
            };
        }

        $scope.freshoption();
              
        $scope.singlestyle = function(value,rows,index){
            return {
                css:{
                    'word-break':'break-all'
                }
            }
        } 
        //删除模板
        $scope.delete = function(){   
            var tableAgraay = [];
            $scope.$broadcast('getSelections#option',function(data){
                $.each(data,function(i,item){
                    tableAgraay.push(item.name);
                })
            });
            $http({
                url:'/v3/ant/configtemplate',
                method:'post',
                data:{                  
                    method:'deletemodule',
                    param:{
                        userName:$rootScope.userInfo.user,  
                        name:tableAgraay
                    }                                       
                }
            }).success(function(data){
                if(data.result == 'success'){                   
                    $alert.msgDialogSuccess(getRcString('LIST_QOSMODE'));
                    $scope.freshoption();
                }else{
                    $alert.msgDialogError(getRcString('LIST_QOS'));
                }
            })
            $scope.auth = true;
        };
        //各种监听事件
        var auther =['check.bs.table#option','uncheck.bs.table#option',
        			 'check-all.bs.table#option','uncheck-all.bs.table#option'
                    ];

        angular.forEach(auther,function(value){
        	$scope.$on(value,function(){
        		$scope.$broadcast('getSelections#' + value.split('#')[1],function(data){
        			$scope.$apply(function () {
                        $scope.aCurCheckData = data;
                        $scope.auth = !$scope.aCurCheckData.length;
                    });
        		});
        	});
        });

        var disabledFlay =['check.bs.table#apply','uncheck.bs.table#apply',
                           'check-all.bs.table#apply','uncheck-all.bs.table#apply',
                           'check.bs.table#tableRelieve','uncheck.bs.table#tableRelieve',
                           'check-all.bs.table#tableRelieve','uncheck-all.bs.table#tableRelieve',
                    ];

        angular.forEach(disabledFlay,function(value){
            $scope.$on(value,function(){
                $scope.$broadcast('getSelections#' + value.split('#')[1],function(data){        
                    $scope.$broadcast((!data.length ? 'disabled' : 'enable') + '.ok#delog'); 
                    $scope.$broadcast((!data.length ? 'disabled' : 'enable') + '.ok#Relieve'); 
                });
            });
        });

        $scope.$watch('apply.$invalid', function (v) {         
            $scope.$broadcast((v ? 'disabled' : 'enable') + '.ok#delog');
        });

        $scope.$watch('tableRelieve.$invalid', function (v) {         
            $scope.$broadcast((v ? 'disabled' : 'enable') + '.ok#Relieve');
        });

        //绑定模板到设备           
        $scope.applycount = {
            mId:'delog',                             
            title:getRcString('equipment'),                           
            autoClose: true ,                        
            showCancel: true ,                       
            modalSize:'lg' ,                     
            showHeader:true,                        
            showFooter:true ,                        
            okText: getRcString('apply'),  
            cancelText: getRcString('close'),  
            okHandler: function(modal,$ele){ 
                var getSelect = [];
                $scope.$broadcast('getSelections#apply',function(data){
                    $.each(data,function(i,item){
                        var select ={
                            "deviceName":item.devName,
                            "ACSN":item.devSN,
                            "model":item.devType
                        }
                        getSelect.push(select);
                    });
                });             
                $http({
                    url:'/v3/ant/configtemplate',
                    method:'post',
                    data:{                      
                        method:"updatemoduledevices",
                        cfgtimeout:30,
                        param:{
                            userName:$rootScope.userInfo.user,
                            name:loadAgraay,
                            device:getSelect
                        }                      
                    }
                }).success(function(data){
                        if(data.result == "success" && data.deviceResult == "success"){
                            $alert.msgDialogSuccess(getRcString('SUCCESS_SUC'));
                        }else 
                        if(data.result == "failed"){
                            $alert.msgDialogError(getRcString('FAILED_FAI'));
                        }else
                        if(data.result == "success" && data.message[0] == 5){
                            $alert.msgDialogError(getRcString('FAL_MODEL'));
                        }else
                        if(data.result == "success" && data.deviceResult == "error"){
                            $alert.msgDialogError(getRcString('FAL_OVER'));
                        }
                    $scope.freshoption();
                })
            },
            cancelHandler: function(modal,$ele){
               
            },
            beforeRender: function($ele){
            }
        }; 

        //解除绑定模板
        $scope.modalRelieve = {
            mId:'Relieve',                             
            title:getRcString('modalRelieved'),                           
            autoClose: true ,                        
            showCancel: true ,                       
            modalSize:'lg' ,                     
            showHeader:true,                        
            showFooter:true ,                        
            okText: getRcString('customer'),  
            cancelText: getRcString('close'),  
            okHandler: function(modal,$ele){ 
                var deletSelect = [];
                $scope.$broadcast('getSelections#tableRelieve',function(data){
                    $.each(data,function(i,item){
                        deletSelect.push(item.devSN);
                    });
                });             
                $http({
                    url:'/v3/ant/configtemplate',
                    method:'post',
                    data:{                      
                        method:"deletedevice",
                        param:{
                            userName:$rootScope.userInfo.user,
                            ACSN:deletSelect
                        }                      
                    }
                }).success(function(data){
                        if(data.result == "success"){
                            $alert.msgDialogSuccess(getRcString('DELET_SUC'));
                        }else 
                        if(data.result == "failed"){
                            $alert.msgDialogError(getRcString('DELET_FAI'));
                        }
                    $scope.freshoption();
                })
            },
            cancelHandler: function(modal,$ele){
               
            },
            beforeRender: function($ele){
            }
        };

        $scope.$on('hidden.bs.modal#delog',function(){ 
            $scope.$broadcast('hideSearcher#apply');  
        });

        $scope.$on('hidden.bs.modal#Relieve',function(){ 
            $scope.$broadcast('uncheckAll#tableRelieve');
            $scope.$broadcast('hideSearcher#tableRelieve'); 
        });

          
        $scope.apply = {
            url:'/v3/scenarioserver',
            method:'post',
        	tId:'apply',
        	pageSize:10,
            showPageList:false,
            clickToSelect: false,       
            searchable:true, 
            showCheckBox:true,
            queryParams: function (){
                return {
                    Method: "getdevListByUser",
                    param: {
                        userName: $rootScope.userInfo.user
                    }
                };
            }, 
            responseHandler: function (data) {
                var aDate = [];
                $.each(data.message,function(i,item){
                    for(var i = 0; i < overallDate.length; i++){
                        if(overallDate[i].devSN == item.devSN){
                            item.devMode = overallDate[i].devMode,
                            item.devTime = overallDate[i].devTime
                        }
                    }
                });         
                return data.message;
            },                    
            columns:[
                {sortable:true,field:'devName',title:getRcString('Visitor_LIST').split(",")[0],searcher:{}},
                {sortable:true,field:'devSN',title:getRcString('Visitor_LIST').split(",")[1],searcher:{}},
                {sortable:true,field:'devMode',title:getRcString('Visitor_LIST').split(",")[2],searcher:{}},
                {sortable:true,field:'devTime',title:getRcString('Visitor_LIST').split(",")[3],searcher:{}}
            ],
        }
        
        $scope.tableRelieve = {
            tId:'tableRelieve',
            pageSize:10,
            showPageList:false,
            clickToSelect: false,       
            searchable:true, 
            showCheckBox:true,      
            columns:[
                {sortable:true,field:'devName',title:getRcString('Visitor_LIST').split(",")[0],searcher:{}},
                {sortable:true,field:'devSN',title:getRcString('Visitor_LIST').split(",")[1],searcher:{}},
                {sortable:true,field:'devMode',title:getRcString('Visitor_LIST').split(",")[2],searcher:{}},
                {sortable:true,field:'devTime',title:getRcString('Visitor_LIST').split(",")[3],searcher:{}}
            ]
            
        }
    }]
});
