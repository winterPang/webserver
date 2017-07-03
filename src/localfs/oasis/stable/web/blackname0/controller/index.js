define(['utils', 'jquery', 'angular-ui-router', 'bsTable'], function (Utils, $) {
    return ['$scope', '$http', '$rootScope', '$alertService', '$state', function ($scope, $http, $rootScope, $alert, $state) {
        var reg_name=/^[A-F\d]{2}-[A-F\d]{2}-[A-F\d]{2}-[A-F\d]{2}-[A-F\d]{2}-[A-F\d]{2}$/;
        function getRcString(attrName) {
            return Utils.getRcString("user_rc", attrName).split(',');
        }
        function GetLoginTime(logintime)
        {
            function doublenum(num)
            {
                if(num < 10)
                {
                    return '0'+num;
                }
                return num;
            }
            var myDate = new Date(logintime);
            var year = myDate.getFullYear();
            var month = doublenum(myDate.getMonth() + 1);
            var day = doublenum(myDate.getDate());
            var hours = doublenum(myDate.getHours());
            var minutes = doublenum(myDate.getMinutes());
            var seconds = doublenum(myDate.getSeconds());
            return year+'-'+month+'-'+day+' '+hours+':'+minutes+':'+seconds;
        }

        /**
         * 重置表单
         */
        $scope.$on('hidden.bs.modal#add_mac',function (){
            // $scope.add.macList = '';
            // $scope.myForm.bindMAC.$setPristine();
            // $scope.myForm.bindMAC.$setUntouched();
        });

        $scope.blackListOption = {
            tId: 'blacklist',
            url: '/v3/ace/oasis/auth-data/restapp/o2oportal/registuser/queryBlackList?storeId=' + $scope.sceneInfo.nasid,
            pageSize: 10,
            showPageList: true,
            clickToSelect:true,
            maintainSelected:true,
            showCheckBox:true,
            pageParamsType: 'path',
            method: 'get',
            sidePagination: 'server',
            contentType: "application/json",
            dataType: "json",
            searchable: true,
            sortField: 'sortColumn',
            orderField: 'ascending',
            startField: 'startRowIndex',
            limitField: 'maxItems',
            queryParams: function (params) {
                params.sortColumn ? params.sortColumn : params.sortColumn = 'insertTime';
                params.ascending = params.ascending === 'desc';
                $.extend(params, params.findoption);
                if (params.sortColumn == "nickName") {
                    params.sortColumn = 'userName';
                }
                delete params.findoption;
                delete params.start;
                delete params.size;
                return params;
                return params;
            },
            responseHandler: function (data) {
                var aBlack = [];
                var total = data.rowCount;
                if (data.errorcode ==0 && data.data.length>0) {
                    var nickOpenids = [];
                   
                    $.each(data.data,function(key,value){
                        var oBlack={};
                        oBlack.userMac = value.userMac;
                        oBlack.insertTime = GetLoginTime(value.insertTime); //在线列表不显示昵称让其显示MAC
                        aBlack.push(oBlack);
                    });
                } 
                return {
                    total: data.rowCount,
                    rows: aBlack
                }
                
            },
            columns: [
                // {checkbox: true},         
                {
                    searcher: {type: 'text'},
                    sortable: true,
                    field: 'userMac',
                    title: getRcString("USER_HEADER")[0]
                },
                {
                    searcher: {type: 'text'},
                    sortable: true,
                    field: 'insertTime',
                    title: getRcString("USER_HEADER")[1]
                }
            ]
        };

        $scope.addMAC = function (){
            $scope.$broadcast('show#add_mac');
        };

        $scope.bindCheckData =[];
        $scope.delBtnDisable =true;
        var checkEvt = [
            "check.bs.table#blacklist","uncheck.bs.table#blacklist",
            "check-all.bs.table#blacklist","uncheck-all.bs.table#blacklist",    
        ];
        angular.forEach(checkEvt, function (value, key, values) {
            $scope.$on(value, function () {
                $scope.$broadcast("getSelections#" + value.split("#")[1], function (data) {
                    $scope.$apply(function () {
                        $scope.bindCheckData = data;
                        $scope.delBtnDisable = !$scope.bindCheckData.length;
                        // $scope.modBtnDisable1 = !$scope.aCurCheckData.length;
                    });
                });
            });
        });

        $scope.deleteMAC = function (){
            $scope.$broadcast('getAllSelections#blacklist',{},function(data){
                var checkedData = data;
                var oData ={
                    userMacList:[],
                    storeId:$scope.sceneInfo.nasid
                };
                $.each(checkedData,function(key,value){
                    oData.userMacList.push(value.userMac);
                })
                $http({
                    url:'/v3/ace/oasis/auth-data/restapp/o2oportal/registuser/removefromblackList',
                    method:'POST',
                    data:oData
                }).success(function(data){
                    if(data.errorcode ==0){
                        $alert.msgDialogSuccess(getRcString('ADD_SUCCESS')[1]);
                        $scope.$broadcast('refresh#blacklist');
                    }
                }).error(function(data){

                })
            });
        }
        $scope.bindMAC = {
            options:{
                mId:'add_mac',
                title:getRcString('title')[0],
                modalSize:'normal',
                autoClose:true,
                showCancel:true,
                buttonAlign:'center',
                okHandler:function(modal,$ele){
                    var oData ={
                        storeId:$scope.sceneInfo.nasid
                    };
                    var tempArr =[];
                    var flag =0;
                    var arrAddMac = $('#getmac').val();
                    if(arrAddMac){
                        tempArr = arrAddMac.replace(/\s/g,'').split(',');
                    }else{
                        return;
                    }
                    $.each(tempArr,function(key,value){
                        var macValue = value.toUpperCase();
                        if(!reg_name.test(macValue)){ 
                            $alert.msgDialogError(getRcString("MAC_ERROR")[0]);
                            flag =1;
                        }
                        if(macValue == '00-00-00-00-00-00' || macValue == 'FF-FF-FF-FF-FF-FF'){
                            $alert.msgDialogError(getRcString("MAC_ERROR")[1]);
                            flag =1;
                        }
                    })
                    if(flag == 1){
                        return;
                    }
                    if(arrAddMac){
                        oData.userMacList = tempArr;
                    }
                    $http({
                        method:'POST',
                        url:'/v3/ace/oasis/auth-data/o2oportal/registuser/addtoblackList',
                        data:oData
                    }).success(function(data){
                        if(data.errorcode ==0){
                            $alert.msgDialogSuccess(getRcString("ADD_SUCCESS")[0]);
                            $scope.$broadcast('refresh#blacklist');
                        }else if(data.errorcode ==1406){
                            $alert.msgDialogError(data.errormsg.slice(10,27) + ' ' +getRcString('ADD_ERROR')[0]);
                        }else if(data.errorcode ==1005){
                            $alert.msgDialogError(getRcString('ADD_ERROR')[1]);
                        }else if(data.errorcode ==2110){
                            $alert.msgDialogError(getRcString('ADD_ERROR')[1]);
                        }
                    })
                },
                cancelHandler:function(modal,$ele){

                }
            }
        }

    }]
});