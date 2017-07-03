define(['utils'],function(Utils) {
    return ['$scope','$alertService','$rootScope', '$http','$window',function($scope,$alert,$rootScope,$http,$window){
        function getRcString(attrName){
        return Utils.getRcString("user_rc",attrName);
        }
       
        $scope.auth = true; 
        $scope.mouse = true;
        $scope.pwd=true;
        $scope.modeInfo={
            server:"",
            MODE:"",
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
        //处理命令行的内容
        $scope.clickTest = function(){
            $scope.mouse = !$scope.mouse;       
        };

        var origin = "";
        $scope.keyDownSearch = function(e){
            // if (e.keyCode==13){
                var val = e.target.value;
                var arr = val.split('\n');
                origin = arr.join().replace(/,/g,'\\r\\n');
                if (!arr[arr.length-1]){
                    e.preventDefault();
                }
                return origin;
            // }
        }

        var getmodules = [];
        $http({
            url:'/v3/ant/configtemplate/getmodules',
            method:'get',
            params:{
                userName:$rootScope.userInfo.user               
            }
        }).success(function(data){                                      
            $.each(data.message,function(i,item){                   
                var objmodule = item.name;                
                getmodules.push(objmodule);
            })
        })           
        //下发模板       
        $scope.modeUpdate = function(){
            if(getmodules.indexOf($scope.modeInfo.server) != -1){
                $alert.msgDialogError(getRcString('LIST_HEADFAIL'));
                return;
            }
            $scope.adisabled = true;
            var cursDate = [];
            var wierless = $('[bs-table="SSID"]').bootstrapTable('getData');
            $.each(wierless,function(i,item){
                var authDate = {};
                if(item.encrypt == getRcString('nopassword') && item.state == getRcString('yespassword')){
                    authDate ={
                        name:'service-template',
                        value:[
                            {
                                name:'template',
                                value:item.service
                            },
                            {
                                name:'SSID',
                                value:item.SSID
                            },
                            {
                                name:'enable',
                                value:item.state
                            }, 
                        ]
                    }
                }else if(item.state == getRcString('nopassword') && item.encrypt == getRcString('yespassword')){
                    authDate ={
                        name:'service-template',
                        value:[
                            {
                                name:'template',
                                value:item.service
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
                }else if(item.state == getRcString('nopassword') && item.encrypt == getRcString('nopassword')){
                    authDate ={
                        name:'service-template',
                        value:[
                            {
                                name:'template',
                                value:item.service
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
                                value:item.service
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
                                value:item.state
                            },
                        ]
                    }
                }               
                cursDate.push(authDate);
            })
            var original = {name:'userdefined',value:origin};
            cursDate.push(original);
            $http({
                url:'/v3/ant/configtemplate',
                method:'post',
                data:{
                    method:'addmodule',
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
                {sortable:true,field:'service',title:getRcString('LIST_HEADER').split(",")[0]},
                {sortable:true,field:'SSID',title:getRcString('LIST_HEADER').split(",")[1]},
                {sortable:true,field:'encrypt',title:getRcString('LIST_HEADER').split(",")[2]},
                {sortable:true,field:'state',title:getRcString('LIST_HEADER').split(",")[3]}               
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
                var objDevsn = item.service;               
                g_stnames.push(objDevsn);
            });
            if(g_stnames.indexOf($scope.authInfo.server)==-1){
                if($scope.authInfo.pwdState=="pwdOn"){
                    aData=[{
                            service:$scope.authInfo.server,
                            SSID:$scope.authInfo.SSID,
                            akmMode:1,
                            cipherSuite:20,
                            securityIE:3,
                            pwd:$scope.authInfo.pwd,
                            encrypt:$scope.authInfo.pwdState=="pwdOn"?getRcString('yespassword'):getRcString('nopassword'),
                            state:$scope.authInfo.wirelessServer=="wireless_open"?getRcString('yespassword'):getRcString('nopassword')                        
                        }] 
                }else if($scope.authInfo.pwdState=="pwdOff"){
                    aData=[{
                            service:$scope.authInfo.server,
                            SSID:$scope.authInfo.SSID,  
                            encrypt:$scope.authInfo.pwdState=="pwdOff"?getRcString('nopassword'):getRcString('yespassword'),         
                            state:$scope.authInfo.wirelessServer=="wireless_open"?getRcString('yespassword'):getRcString('nopassword')
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

        $scope.deleteUpdate = function(){
            $scope.modeInfo={
                server:"",
                MODE:"",
            };
            $scope.authForm.$setPristine();
            $scope.authForm.$setUntouched();
        }

        $scope.delete = function(){ 
            var tableAgraay = [];
            $scope.$broadcast('getSelections#ssid',function(data){
                $.each(data,function(i,item){
                    tableAgraay.push(item.service);
                })
                $scope.$broadcast('remove#ssid',{field:'service',values:tableAgraay});
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
