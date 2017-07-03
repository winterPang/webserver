define(['jquery','app','utils','echarts','css!../css/detail'],function ($,mainApp,Utils,echarts){
    return ["$scope","$rootScope","$http","$alertService",'$stateParams',function ($scope,$rootScope,$http,$alert,$stateParams){
        //page state
        function getRcString (attr){
            return document.getElementById('controllerInfo').getAttribute(attr)
        }


        $scope.State = {
            url:false,
            appId:false,
            appSecret:false,
            isAdvanOpen:false
        };
        $scope.Ele = document.getElementById('controllerInfo');
        $scope.info = {
            tableTitle:$scope.Ele.getAttribute('tableTitle'),
            addTitle:$scope.Ele.getAttribute('addTitle'),
            editTitle:$scope.Ele.getAttribute('editTitle'),
            delTitle:$scope.Ele.getAttribute('delTitle'),
            okText:$scope.Ele.getAttribute('okText'),
            msgAddSuc:$scope.Ele.getAttribute('msgAddSuc'),
            cancelText:$scope.Ele.getAttribute('cancelText'),
            msgAddNameExist:$scope.Ele.getAttribute('msgAddNameExist'),
            msgAddAIExist:$scope.Ele.getAttribute('msgAddAIExist'),
            msgAddError:$scope.Ele.getAttribute('msgAddError'),
            msgEditSuc:$scope.Ele.getAttribute('msgEditSuc'),
            msgEditError:$scope.Ele.getAttribute('msgEditError'),
            msgDelSuc:$scope.Ele.getAttribute('msgDelSuc'),
            msgDelPub:$scope.Ele.getAttribute('msgDelPub'),
            msgDelError:$scope.Ele.getAttribute('msgDelError'),
            msgDelDontExist:$scope.Ele.getAttribute('msgDelDontExist'),
            weSerCantReutrn:$scope.Ele.getAttribute('weSerCantReutrn'),
            bizError:$scope.Ele.getAttribute('bizError'),
            appIdError:$scope.Ele.getAttribute('appIdError'),
            appSecretError:$scope.Ele.getAttribute('appSecretError'),
            msgDel1309:$scope.Ele.getAttribute('msgDel1309')
        };
        $scope.newUser = {
            type:1,
            cipherMode:1,
            ifWeixinAuth:0,
            token:'default'
        };
        //default param
        $scope.tableOptions = {
            tId: 'base',
            columns: [
                {title: $scope.info.tableTitle,field:'name'},
                {title: 'AppID',field:'appId'}, 
                {title: 'AppSECRET',field:'appSecret'}, 
                {title: 'TOKEN',field:'token'}
            ],
            showPageList:false,
            operateWidth:200,
            //btn callback
            operate:false
        };
        //add modal
        $scope.add_modalOptions = {
            mId:'addPubNum',
            title:$scope.info.tableTitle,
            // autoClose:false,
            modalSize:'lg',
            okText: $scope.info.okText,
            cancelText: $scope.info.cancelText,
            okHandler: function (modal,$ele){
                var newUserItem={
                    storeId:$scope.sceneInfo.nasid,
                    biz:$scope.newUser.biz,
                    name:$scope.newUser.name,
                    type:$scope.newUser.type,
                    appId:$scope.newUser.appId,
                    appSecret:$scope.newUser.appSecret,
                    encodingAesKey:$scope.newUser.encodingAesKey,
                    cipherMode:$scope.newUser.cipherMode,
                    token:$scope.newUser.token,
                    ifWeixinAuth:$scope.newUser.ifWeixinAuth,
                    url:$scope.newUser.url,
                    description:$scope.newUser.description
                };
                $http({
                    method:"post",
                    url:'/v3/ace/oasis/auth-data/restapp/o2oportal/weixinaccount/add',
                    data:newUserItem
                }).success(function (data){
                    switch(data.errorcode){
                        case 0:
                            $scope.queryData();
                            // $scope.$broadcast('hide#addPubNum');
                            $alert.msgDialogSuccess($scope.info.msgAddSuc);
                            break;
                        case 1504:
                            $alert.msgDialogError($scope.info.msgAddNameExist,'error');
                            break;
                        case 1507:
                            $alert.msgDialogError($scope.info.msgAddAIExist,'error');
                            break;
                        case 2002:
                            $alert.msgDialogError($scope.info.weSerCantReutrn,'error');
                            break;
                        case 2003:
                            $alert.msgDialogError($scope.info.bizError,'error');
                            break;
                        case 40013:
                            $alert.msgDialogError($scope.info.appIdError,'error');
                            break;
                        case 40125:
                            $alert.msgDialogError($scope.info.appSecretError,'error');
                            break;
                        case 80003:
                            $alert.msgDialogError(getRcString('err80003'));
                            break;
                        case 80018:
                            $alert.msgDialogError(getRcString('err80018'));
                            break;
                        case 90011:
                            $alert.msgDialogError(getRcString('err90011'));
                            break;
                        case 90013:
                            $alert.msgDialogError(getRcString('err90013'));
                            break



                    };
                }).error(function(){
                    $alert.msgDialogError($scope.info.msgAddError,'error');
                });
            },
            cancelHandler: function (modal,$ele){
                $scope.newUser = {};
                $scope.newUser = {
                    type:1,
                    cipherMode:2,
                    ifWeixinAuth:0
                };
                $("form[name='addPubNumForm'] input[name='add_url']").attr('title','').end().find("input[name='add_encodingAesKey']").attr('title','');
            }
        };
        //edit modal
        $scope.edit_modalOptions = {
            mId:'editPubNum',
            title:$scope.info.editTitle,
            autoClose: false,
            modalSize:'lg',
            okText: $scope.info.okText,
            cancelText: $scope.info.cancelText,
            okHandler: function (modal,$ele){
                var parameters = {};
                for(var attr in $scope.rowData){
                    parameters[attr] = $scope.rowData[attr];
                };
                parameters.storeId = $scope.sceneInfo.nasid;
                $http({
                    method:"post",
                    url:'/v3/ace/oasis/auth-data/restapp/o2oportal/weixinaccount/modify',
                    data:parameters
                }).success(function (data){
                    console.log(data.errorcode)
                    switch(data.errorcode){
                        case 0:
                            $scope.queryData();
                            $alert.msgDialogSuccess($scope.info.msgEditSuc);
                            $scope.$broadcast('hide#editPubNum');
                            break;
                        case 2002:
                            $alert.msgDialogError($scope.info.weSerCantReutrn,'error');
                            break;
                        case 2003:
                            $alert.msgDialogError($scope.info.bizError,'error');
                            break;
                        case 40013:
                            $alert.msgDialogError($scope.info.appIdError,'error');
                            break;
                        case 40125:
                            $alert.msgDialogError($scope.info.appSecretError,'error');
                            break;
                        case 90011:
                            $alert.msgDialogError(getRcString('err90011'));
                            break;
                        case 90013:
                            $alert.msgDialogError(getRcString('err90013'));
                            break;
                        case 80003:
                            $alert.msgDialogError(getRcString('err80003'));
                            break;
                        case 1505:
                            $alert.msgDialogError(getRcString('err1505'));
                            break;
                    }
                }).error(function(){
                    $alert.msgDialogError($scope.info.msgEditError,'error');
                });
            }
        };
        //del config
        $scope.del_modalOptions = {
            mId:'delPubNum',
            title:$scope.info.delTitle,
            modalSize:'normal',
            okText: $scope.info.okText,
            cancelText: $scope.info.cancelText,
            okHandler: function (modal,$ele){
                $http({
                    method:"post",
                    url:'/v3/ace/oasis/auth-data/restapp/o2oportal/weixinaccount/delete',
                    data:{
                        storeId:$scope.sceneInfo.nasid,
                        name:$scope.delName
                    }
                }).success(function (data){
                    switch(data.errorcode){
                        case 0:
                            $scope.queryData();
                            $alert.msgDialogSuccess($scope.info.msgDelSuc);
                            break;
                        case 1505:
                            $alert.msgDialogError($scope.info.msgDelDontExist,'error');
                            break;
                        case 1506:
                            $alert.msgDialogError($scope.info.msgDelPub,'error');
                            break;
                        case 1309:
                            $alert.msgDialogError($scope.info.msgDel1309,'error');
                            break;
                        case 80016:
                            $alert.msgDialogError(getRcString('err80016'));
                            break;
                        case 80017:
                            $alert.msgDialogError(getRcString('err80007'));
                            break;
                        default:
                            $alert.msgDialogSuccess($scope.info.msgDelError);
                    };
                }).error(function(){
                    $alert.msgDialogError($scope.info.msgDelError,'error');
                });
            }
        };

        //add btn event
        $scope.AddChatModal = function (){
            $scope.$broadcast('show#addPubNum');
        };

        //query/bind data 
        $scope.queryData = function (){
            $http({
                method:"get",
                url:'/v3/ace/oasis/auth-data/restapp/o2oportal/weixinaccount/query',
                params:{
                    storeId:$scope.sceneInfo.nasid
                }
            }).success(function (data){
                $scope.$broadcast('load#base',data.data||[]);
            });
        };
        $scope.queryData();

        //watch modal
        $scope.$on('hidden.bs.modal#addPubNum', function (){
            $scope.newUser = {
                name:"",
                biz:"",
                token:"default",
                type:1,
                ifWeixinAuth:0,
                url:"",
                description:"",
                appId:"",
                appSecret:"",
                cipherMode:1
            };
            $scope.State = {
                url:false,
                appId:false,
                appSecret:false,
                isAdvanOpen:false
            };
            $scope.addPubNumForm.$setUntouched();
            $scope.addPubNumForm.$setPristine();
        });

        $scope.$on("hidden.bs.modal#editPubNum",function (){
            $scope.State = {
                url:false,
                appId:false,
                appSecret:false,
                isAdvanOpen:false
            };
        });

        //watch input legal--submit btn 
        $scope.$watch("addPubNumForm.$valid",function (value){
            if(value){
                $scope.$broadcast('enable.ok#addPubNum');
            }else{
                $scope.$broadcast('disabled.ok#addPubNum');
            };
        });
        $scope.$watch("chattoggleForm.$valid",function (value){
            if(value){
                $scope.$broadcast('enable.ok#editPubNum');
            }else{
                $scope.$broadcast('disabled.ok#editPubNum');
            };
        });
        //separation of powers
        $scope.$watch('permission',function(v){
            // console.log(v)
            if($scope.permission.write === true){
                $scope.tableOptions.operate = ({
                edit:function (ev,row,btn){
                    console.log(row)
                        $scope.rowData = {
                            name:row.name,
                            biz:row.biz,
                            appId:row.appId,
                            appSecret:row.appSecret,
                            token:row.token,
                            type:row.type,
                            encodingAesKey:row.encodingAesKey,
                            cipherMode:row.cipherMode,
                            ifWeixinAuth:row.ifWeixinAuth,
                            url:row.url,
                            description:row.description
                        };
                    $("form[name='chattoggleForm'] input[name='url']").attr('title',row.url).end().find("input[name='encodingAesKey']").attr('title',row.encodingAesKey);
                    $scope.$broadcast('show#editPubNum');
                },
                remove:function (ev,row,btn){
                    $scope.delName = row.name;
                    $scope.$broadcast('show#delPubNum');
                }
            })
            }else if($scope.permission.write === false){

            }else{
                console.log('Permission GetFailed')
            }
        })
        //url add random number
        $scope.addUrl = function (ev){
            var Num=""; 
            for(var i=0;i<6;i++){
                Num+=Math.floor(Math.random()*10); 
            };
            $scope.newUser.url = "http://oasisauth.h3c.com/weixin/"+Num;
            $(ev.target).prev().attr('title',$scope.newUser.url);
        };
        //random secret
        $scope.generatingKey = function (index,ev){
            var $chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var maxPos = $chars.length;
            var pwd = '';
            for (var i = 0; i < 43; i++) {
                pwd += $chars.charAt(Math.floor(Math.random()*maxPos));
            };
            if(index === "add"){
                $scope.newUser.encodingAesKey = pwd;
            }else if(index === "item"){
                $scope.rowData.encodingAesKey = pwd;
            };
            $scope.chattoggleForm.encodingAesKey.$setDirty();
            $(ev.target).prev().attr('title',pwd);
        };


    }
]});


