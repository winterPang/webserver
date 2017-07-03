define(['utils'],function(Utils) {
    return ['$scope','$stateParams','$alertService','$rootScope', '$http','$window','$sce',function($scope,$stateParams,$alert,$rootScope,$http,$window,$sce){
        function getRcString(attrName){
        return Utils.getRcString("user_rc",attrName);
        }
       
        var testorder = "";
        $scope.auth = true; 
        $scope.mouse = true;
        $scope.pwd=true;
        $scope.modeInfo={
            server:"",
            MODE:"",
            order:""
        };
             
        $scope.return = function(){
            $window.history.back();
        };

        $scope.pwdOn = function() {
            $scope.pwd = true;         
        }
        $scope.pwdOff= function() {
            $scope.pwd = false;                  
        }

        $http({
            url:'/v3/ant/configtemplate/getmodules',
            method:'get',
            params:{
                userName:$rootScope.userInfo.user               
            }
        }).success(function(data){
            if(data.result == "success"){
                var userDefinedOrder = "";
                var orderDate = [];
                var originTable = [];
                $.each(data.message,function(i,item){
                    if(item.name == $stateParams.starmName){
                        $scope.modeInfo.server = item.name,
                        $scope.modeInfo.MODE = item.descript || "",
                        originTable = item.original
                    }
                })
                $.each(originTable,function(i,item){
                    if(item.name == "service-template"){
                        var apartDate = {
                            template:"",
                            SSID:"",
                            password:"",
                            enable:""
                        };
                        for(var i = 0; i < item.value.length; i++){
                            apartDate[item.value[i].name] = item.value[i].value || getRcString('yespassword')
                        };
                        orderDate.push(apartDate);
                    }else
                    if(item.name == "userdefined"){  
                        //testorder = item.value; 
                        origin =  item.value;               
                        $scope.modeInfo.order = item.value.replace(/\\r\\n/g,'\r\n');                      
                    }
                })           
                $.each(orderDate,function(i,item){
                    item.password = item.password ? getRcString('yespassword') : getRcString('nopassword');
                    item.enable = item.enable ? getRcString('yespassword') : getRcString('nopassword')
                });
                
                $scope.$broadcast('load#ssid',orderDate);
            }else{

            }
           
        })
        //处理命令行的内容
        $scope.clickTest = function(){
            $scope.mouse = !$scope.mouse;       
        };

        var origin ="";
        $scope.keyDownSearch = function(e){
            // if (e.keyCode==13){
                var val = e.target.value;
                var arr = val.split('\n');
                // var a = $scope.modeInfo.order;
                origin = arr.join().replace(/,/g,'\\r\\n');
                if (!arr[arr.length-1]){
                    e.preventDefault();
                }
                return origin;
            // }
        }
        //下发模板       
        $scope.modeUpdate = function(){
            $scope.adisabled = true;
            var cursDate = [];
            var wierless = $('[bs-table="SSID"]').bootstrapTable('getData');
            $.each(wierless,function(i,item){
                var authDate = {};
                if(item.password == getRcString('nopassword') && item.enable == getRcString('yespassword')){
                    authDate ={
                        name:'service-template',
                        value:[
                            {
                                name:'template',
                                value:item.template
                            },
                            {
                                name:'SSID',
                                value:item.SSID
                            },
                            {
                                name:'enable',
                                value:item.enable
                            }, 
                        ]
                    }
                }else if(item.enable == getRcString('nopassword') && item.password == getRcString('yespassword')){
                    authDate ={
                        name:'service-template',
                        value:[
                            {
                                name:'template',
                                value:item.template
                            },
                            {
                                name:'SSID',
                                value:item.SSID
                            },
                            {
                                name:'password',
                                value:item.pwd
                            }, 
                        ]
                    }
                }else if(item.enable == getRcString('nopassword') && item.password == getRcString('nopassword')){
                    authDate ={
                        name:'service-template',
                        value:[
                            {
                                name:'template',
                                value:item.template
                            },
                            {
                                name:'SSID',
                                value:item.SSID
                            },  
                        ]
                    }
                }else{
                    authDate ={
                        name:'service-template',
                        value:[
                            {
                                name:'template',
                                value:item.template
                            },
                            {
                                name:'SSID',
                                value:item.SSID
                            },
                            {
                                name:'password',
                                value:item.pwd
                            },
                            {
                                name:'enable',
                                value:item.enable
                            },
                        ]
                    }
                }               
                cursDate.push(authDate);
            });
                        
            var original = {name:'userdefined',value:origin};
                         
            cursDate.push(original);
            $http({
                url:'/v3/ant/configtemplate',
                method:'post',
                data:{
                    method:'updatemodule',
                    param:{
                        userName:$rootScope.userInfo.user,
                        name:$scope.modeInfo.server,
                        descript:$scope.modeInfo.MODE,
                        original:cursDate
                    },
                }
            }).success(function(data){
                if(data.result == "success"){
                    $alert.msgDialogSuccess(getRcString('SUCCESS_SUC'));
                }else 
                if(data.result == "failed"){
                    $alert.msgDialogError(getRcString('FAILED_FAI'));
                }
                $scope.return();
            });
        }
        
        // 增加无线服务配置
        var auther =['check.bs.table#ssid','uncheck.bs.table#ssid',
                     'check-all.bs.table#ssid','uncheck-all.bs.table#ssid'
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
        $scope.SSID={
            tId:'ssid',
            pageSize:10,
            showPageList:false,
            showCheckBox:true, 
            clickToSelect: false,                           
            columns:[
                {sortable:true,field:'template',title:getRcString('LIST_HEADER').split(",")[0]},
                {sortable:true,field:'SSID',title:getRcString('LIST_HEADER').split(",")[1]},
                {sortable:true,field:'password',title:getRcString('LIST_HEADER').split(",")[2]},
                {sortable:true,field:'enable',title:getRcString('LIST_HEADER').split(",")[3]}               
            ],
        };
        $scope.authInfo={
            server:"",
            SSID:"",
            pwd:"",
            wirelessServer:"",
            pwdState:'pwdOn',
            wirelessServer:'wireless_open'
        };
        var g_stnames = [];
             
        $scope.ssidUpdate = function(){
            var aData;
            var obj = $('[bs-table="SSID"]').bootstrapTable('getData');
            $.each(obj,function(i,item){
                var objDevsn = item.template;               
                g_stnames.push(objDevsn);
            });
            if(g_stnames.indexOf($scope.authInfo.server)==-1){
                if($scope.authInfo.pwdState=="pwdOn"){
                    aData=[{
                            template:$scope.authInfo.server,
                            SSID:$scope.authInfo.SSID,
                            akmMode:1,
                            cipherSuite:20,
                            securityIE:3,
                            pwd:$scope.authInfo.pwd,
                            password:$scope.authInfo.pwdState=="pwdOn"?getRcString('yespassword'):getRcString('nopassword'),
                            enable:$scope.authInfo.wirelessServer=="wireless_open"?getRcString('yespassword'):getRcString('nopassword')                        
                        }] 
                }else if($scope.authInfo.pwdState=="pwdOff"){
                    aData=[{
                            template:$scope.authInfo.server,
                            SSID:$scope.authInfo.SSID,  
                            password:$scope.authInfo.pwdState=="pwdOff"?getRcString('nopassword'):getRcString('yespassword'),         
                            enable:$scope.authInfo.wirelessServer=="wireless_open"?getRcString('yespassword'):getRcString('nopassword')
                    }]
                } 
                $('[bs-table="SSID"]').bootstrapTable('append',aData);
                $scope.$broadcast('hide#delog',$scope);
            }else{
                $alert.msgDialogError(getRcString('LIST_HEAD'));
            }            
        }

        $scope.$on('hidden.bs.modal#delog', function () {
            $scope.authInfo = {
                server:"",
                SSID:"",
                pwd:"",
                wirelessServer:"",
                pwdState:'pwdOn',
                wirelessServer:'wireless_open'     
            };            
            $scope.pwd = true; 
            $scope.authFormModal.$setPristine();
            $scope.authFormModal.$setUntouched(); 

        });

        $scope.delete = function(){ 
            var tableAgraay = [];
            $scope.$broadcast('getSelections#ssid',function(data){
                $.each(data,function(i,item){
                    tableAgraay.push(item.template);
                })
                $scope.$broadcast('remove#ssid',{field:'template',values:tableAgraay});
            });
            $scope.auth = true;               
        }

        $scope.create = function(){
            $scope.$broadcast('show#delog');            
        }

        $scope.apply = {
            mId:'delog',                             
            title:getRcString('addservers'),                           
            autoClose: true ,                        
            showCancel: true ,                       
            modalSize:'lg' ,                     
            showHeader:true,                        
            showFooter:false ,                        
            // okText: '确定',  
            // cancelText: '关闭',  //取消按钮文本
            okHandler: function(modal,$ele){
                
            },
            cancelHandler: function(modal,$ele){
               
            },
            beforeRender: function($ele){
            }
        }; 


    }]
});
