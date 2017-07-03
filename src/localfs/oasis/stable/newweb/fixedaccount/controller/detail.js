define(['utils', 'jquery', 'angular-ui-router', 'bsTable'], function (Utils, $) {
    return ['$scope', '$http', '$rootScope', '$alertService', '$state', function ($scope, $http, $rootScope, $alert, $state) {

        var reg_name=/^[A-F\d]{2}-[A-F\d]{2}-[A-F\d]{2}-[A-F\d]{2}-[A-F\d]{2}-[A-F\d]{2}$/;
        var reg = /^\+?[1-9][0-9]*$/;
        function getRcString(attrName) {
            return Utils.getRcString("user_rc", attrName).split(',');
        }

        function GetLoginTime(logintime) {
            function doublenum(num) {
                if (num < 10) {
                    return '0' + num;
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
            return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
        }

        $scope.add = {
            no_choose:1
        };
        $scope.edit = {
            no_edit:1
        };
        function fnChengeTime(value) {
            var nMsecond = parseInt(value);// 毫秒
            var nSecond = 0;//秒
            var nMinute = 0;// 分
            var nHour = 0;// 小时
            var nDay = 0; //天
            var result = "";
            if(nMsecond >= 1000) {
                nSecond = parseInt(nMsecond/1000);
                nMsecond = parseInt(nMsecond%1000);
                if(nSecond >= 60) {
                    nMinute = parseInt(nSecond/60);
                    nSecond = parseInt(nSecond%60);
                }
                if(nMinute >= 60){
                    nHour = parseInt(nMinute/60);
                    nMinute = parseInt(nMinute%60);
                }
                if(nHour >= 24){
                    nDay = parseInt(nHour/24);
                    nHour = parseInt(nHour%24);
                }
            }
            /*result = ""+parseInt(nSecond)+"秒";*/
            if(nDay > 0 && nDay < 10)
            {
                result += "0"+parseInt(nDay)+"d:";
            }else if(nDay > 10){
                result += parseInt(nDay)+"d:";
            }else{
                result += "00"+"d:"
            }
            if(nHour > 0 && nHour <10) {
                result += "0"+parseInt(nHour)+"h:";
            }else if(nHour > 10){
                result +=parseInt(nHour)+'h:'
            }else{
                result += "00"+"h:";
            }
            if(nMinute > 0 && nMinute < 10) {
                result += "0"+parseInt(nMinute)+"m:";
            }else if(nMinute>10){
                result +=parseInt(nMinute)+"m:";
            }else{
                result += "00"+"m:"
            }
            if(nSecond > 0 && nSecond < 10) {
                result += "0"+parseInt(nSecond)+"s";
            }else if(nSecond > 10){
                result +=parseInt(nSecond)+'s';
            }else{
                result +='00'+"s"
            }
            return result;
        }
        /**
         * 重置表单
         */
        $scope.$on('hidden.bs.modal#account_Add', function () {
            // debugger
            $scope.add.userName = '';
            $scope.add.password = '';
            $scope.add.passwordConf = '';
            $scope.add.bindMAC = '';
            $scope.add.onlineAccount = '';
            // 重置表单
            $scope.myForm.userName.$setPristine();
            $scope.myForm.userName.$setUntouched();
            $scope.myForm.userPassword.$setPristine();
            $scope.myForm.userPassword.$setUntouched();
            $scope.myForm.passwordConform.$setPristine();
            $scope.myForm.passwordConform.$setUntouched();
            // $scope.myForm.bindMAC.$setUntouched();
            // $scope.myForm.bindMAC.$setPristine();
            // $scope.myForm.onlineAccount.$setUntouched();
            // $scope.myForm.onlineAccount.$setPristine();
        });
        $scope.$on('hidden.bs.modal#account_Modify', function () {
            // debugger
            $scope.edit.username = '';
            $scope.edit.password = '';
            $scope.edit.passwordConf = '';
            // 重置表单
            $scope.editForm.$setPristine();
        });
        // debugger
        $scope.Arrmac ={};
        $scope.opassword = {};
        $scope.userOption = {
            tId: 'userlist',
            url: '/v3/ace/oasis/auth-data/o2oportal/registuser/queryaccount?ownerName=' + $scope.userInfo.user + '&storeId=' + $scope.sceneInfo.nasid + '&isUsingNickName=true',
            pageSize: 10,
            showPageList: false,
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
            operateWidth: 240,
            operateTitle: getRcString("USER_LIST_HEADER")[6],
            operate: {
                edit: function (e, row, $btn) {
                    $scope.edit.username = row.nickName;
                    $scope.edit.bindMAC = (row.macBindList ==0)?'':$scope.Arrmac[row.nickName];
                    $scope.edit.onlineAccount = row.linkNum;
                    $scope.edit.password = $scope.opassword[row.nickName];
                    $scope.edit.passwordConf = $scope.opassword[row.nickName];
                    $scope.$broadcast('show#account_Modify');

                },
                remove: function (e, row, $btn) {
                    $alert.confirm(getRcString("CON_DEL"), function () {
                        $http({
                            method: 'POST',
                            url: '/v3/ace/oasis/auth-data/o2oportal/registuser/delete',
                            data: {
                                ownerName: $scope.userInfo.user,
                                userName: row.nickName,
                                storeId: $scope.sceneInfo.nasid,
                                userType: 100
                            }
                        }).success(function (data) {

                            if (data.errorcode == 0) {
                                $alert.msgDialogSuccess(getRcString("CONFIGURE_SUCCESS"));
                                $scope.$broadcast('refresh#userlist');
                            }
                            else if(data.errorcode == 1404){
                                $alert.msgDialogError(getRcString("DEL_FAIL")[0]);
                            }else if(data.errorcode == 2000){
                                $alert.msgDialogError(getRcString("DEL_FAIL")[1]);
                            }
                        }).error(function (data) {

                        })

                    });
                }
            },
            tips: {
                edit: getRcString('OPERATE')[0],
                remove: getRcString('OPERATE')[1]
            },
            icons: {
                add: 'fa fa-edit',
                delete: 'fa fa-del'
            },
            queryParams: function (params) {
                if (params.ascending == "asc") {
                    params.ascending = true;
                } else {
                    params.ascending = false;
                }
                $.extend(params, params.findoption);
                if (params.sortColumn == "nickName") {
                    params.sortColumn = 'userName';
                }
                delete params.findoption;
                delete params.start;
                delete params.size;
                return params;
            },
            responseHandler: function (data) {
                if (data != "") {
                    var aRegisterList = [];
                    if (data.errorcode == 0) {
                        var tempdata = data.data;
                        for (var key = 0; key < tempdata.length; key++) {
                            var oRegister = {};
                            oRegister.userName = tempdata[key].userName;
                            oRegister.nickName = tempdata[key].userName;
                            oRegister.loginTime = GetLoginTime(tempdata[key].loginTime);
                            oRegister.isBlackUser = tempdata[key].isBlackUser;
                            oRegister.accessDurationSum = fnChengeTime(tempdata[key].accessDurationSum);
                            oRegister.linkNum = (tempdata[key].linkNum == -1)?'':tempdata[key].linkNum;
                            oRegister.lastAccessTime = (tempdata[key].lastAccessTime == 0)?'':GetLoginTime(tempdata[key].lastAccessTime);
                            oRegister.macBindList = tempdata[key].macBindList.length;
                            aRegisterList.push(oRegister);
                            $scope.Arrmac[oRegister.userName] = tempdata[key].macBindList;
                            $scope.opassword[oRegister.userName] = tempdata[key].password;
                        }
                    }
                }
                return {
                    total: data.rowCount,
                    rows: aRegisterList
                }
            },
            columns: [
                // {checkbox: true},         
                {
                    searcher: {type: 'text'},
                    sortable: true,
                    field: 'userName',
                    title: getRcString("USER_LIST_HEADER")[0],
                    formatter: function (value, row) {
                        //状态为1显示为在线，其他显示为不在线
                        var restext = row.nickName;
                        if (row.isBlackUser) {
                            restext = "<img src='../frame/images/black.png'>" + row.nickName;
                        }
                        return restext;
                    }
                },
                {
                    searcher: {type:'text'},
                    sortable: true,
                    field: 'loginTime',
                    title: getRcString("USER_LIST_HEADER")[1]
                },
                {
                    sortable:true,
                    field:'accessDurationSum',
                    title: getRcString("USER_LIST_HEADER")[2]
                },
                {
                    sortable:true,
                    field:'linkNum',
                    title: getRcString("USER_LIST_HEADER")[3]
                },
                {
                    sortable:true,
                    field:'lastAccessTime',
                    title: getRcString("USER_LIST_HEADER")[4]
                },
                {
                    field:'macBindList',
                    title: getRcString("USER_LIST_HEADER")[5],
                    formatter: function(value,row,index){
                        return '<a class="list-link">'+value+'</a>';
                    } 
                }
            ]
        };

       
        //export
        $scope.exportAccounts = function () {
            $http({
                method: 'GET',
                url: '/v3/ace/oasis/auth-data/o2oportal/registuser/exportaccount',
                params: {
                    ownerName: $scope.userInfo.user,
                    storeId: $scope.sceneInfo.nasid,
                    sortColumn: 'userName',
                    ascending: true,
                    isUsingNickName: true,
                    usingEnglish:(Utils.getLang() =='cn')?false:true
                }
            }).success(function (data) {
                if (data.errorcode == 0){
                    var fileArr = data.data;
                    var aDom = [];
                    aDom.push(
                        '<iframe style="display: none" src="',
                        fileArr,
                        '"></iframe>'
                    );
                    $(aDom.join("")).appendTo("body");
                }
                else {
                    console.log("Derive Failed ->> Heqiao");
                }
            }).error(function (data) {

            })
        };
        //import
        $scope.importAccounts = function () {
            $scope.$broadcast('show#import');
        };

        $scope.download = function(){
            if(Utils.getLang() =='cn'){
                window.location.href ="https://oasisrdfs.h3c.com/group1/M00/00/09/rBUADli4vRiAOh8EAAAuog-t-2Y95.xlsx";
            }else{
                window.location.href ="https://oasisrdfs.h3c.com/group1/M00/00/09/rBUADli4vYCASzvCAAAtfb7Yo_o12.xlsx";
            }
        };
        //add account
        
        $scope.accountAdd = {
            options: {
                mId: 'account_Add',
                title: getRcString("ADD_USER")[0],
                modalSize: 'lg',
                autoClose: true,
                showCancel: true,
                buttonAlign: "center",
                okHandler: function (modal, $ele) {
                    var flag = 0;
                    var oData ={
                        ownerName: $scope.userInfo.user,
                        userName: $scope.add.userName.replace(/\s/g,""),
                        userPassword: $scope.add.password,
                        passwordConfirm: $scope.add.passwordConf,
                        storeId: $scope.sceneInfo.nasid
                    };
                    var tempArr=[];
                    var arrAddMac = $("#getmac").val();
                    var arrAddAccount = $("#Account").val();
                    var regexp = /\s/;
                    if(regexp.exec(oData.userPassword)==null){
                    } 
                    else{
                        $alert.msgDialogError(getRcString("PASSWORD_ERROR"));
                        flag =1;
                    }
                    if(oData.userPassword.length ==0){
                        $alert.msgDialogError(getRcString("PASSWORD_ERROR"));
                        flag =1;
                    }
                    if(arrAddAccount){
                        if(!reg.test(arrAddAccount)){
                            $alert.msgDialogError(getRcString("NUM_ERROR"));
                            flag =1;
                        }
                    }
                    if(arrAddMac){
                        tempArr = arrAddMac.replace(/\s/g,"").split(',');
                    }
                    if(tempArr.length>255){
                        $alert.msgDialogError(getRcString("BIND_ERROR"));
                        flag =1;
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
                    });
                    
                    if(flag == 1){
                        return;
                    }

                    if(arrAddMac !=undefined && arrAddAccount ==undefined){
                        oData.macBindList = tempArr;
                    }else if(arrAddMac ==undefined && arrAddAccount !=undefined){
                        oData.linkNum = arrAddAccount;
                    }
                    $http({
                        method: 'POST',
                        url: '/v3/ace/oasis/auth-data/o2oportal/registuser/add',
                        data:oData
                    }).success(function (data) {
                        if (data.errorcode == 0) {
                            $alert.msgDialogSuccess(getRcString("ADD_SUCCESS"));
                            $scope.$broadcast('refresh#userlist');
                        }
                        else if(data.errorcode == 1403){
                            $alert.msgDialogError(getRcString("ADD_FAIL")[0]);
                        }
                    }).error(function (data) {

                    })

                },
                cancelHandler: function (modal, $ele) {

                },
                beforeRender: function ($ele) {
                    return $ele;
                }
            }
        }
        //add-button
        $scope.addAccount = function () {
            //clearInputText();
            $scope.$broadcast('show#account_Add');
        };

        //add account
        $scope.accountModify = {
            options: {
                mId: 'account_Modify',
                title: getRcString("EDIT_USER")[0],
                modalSize: 'lg',
                autoClose: true,
                showCancel: true,
                buttonAlign: "center",
                okHandler: function (modal, $ele) {
                    var flag = 0;
                    var oData={
                        ownerName:$scope.userInfo.user,
                        userName:$scope.edit.username,
                        userPassword:$scope.edit.password.replace(/\s/g,""),
                        passwordConfirm:$scope.edit.passwordConf.replace(/\s/g,""),
                        storeId:$scope.sceneInfo.nasid
                    };
                    var arrEditMac = $("#editmac").val();
                    var arrEditAccount = $("#editAccount").val();
                    var tempArr =[];
                    if(oData.userPassword.length ==0){
                        $alert.msgDialogError(getRcString("PASSWORD_ERROR"));
                        flag =1;
                    }
                    if(arrEditMac){
                        tempArr = arrEditMac.replace(/\s/g,"").split(',');
                    }
                    if(arrEditAccount){
                        if(!reg.test(arrEditAccount)){
                            $alert.msgDialogError(getRcString("NUM_ERROR"));
                            flag =1;
                        }
                    }
                    if(tempArr.length>255){
                        $alert.msgDialogError(getRcString("BIND_ERROR"));
                        flag =1;
                    }
                    $.each(tempArr,function(key,value){
                        var macEdit = value.toUpperCase();
                        if(!reg_name.test(macEdit)){ 
                            $alert.msgDialogError(getRcString("MAC_ERROR")[0]);
                            flag =1;
                        }
                        if(macEdit == '00-00-00-00-00-00' || macEdit == 'FF-FF-FF-FF-FF-FF'){
                            $alert.msgDialogError(getRcString("MAC_ERROR")[1]);
                            flag =1;
                        }
                        // $.each(macList,function(key,value){
                        //     if(macEdit == value.toUpperCase()){
                        //         $alert.msgDialogError(macEdit + ' '+ getRcString('MAC_ERROR')[3]);
                        //         flag =1;
                        //     }
                        // })
                    });
                    if(flag ==1){
                        return;
                    }
                    
                    if(arrEditMac !=undefined && arrEditAccount ==undefined){
                        oData.macBindList = tempArr;
                    }else if(arrEditMac ==undefined && arrEditAccount !=undefined){
                        oData.linkNum = arrEditAccount;
                    }
                    $http({
                        method: 'POST',
                        url: '/v3/ace/oasis/auth-data/o2oportal/registuser/modify',
                        data: oData
                    }).success(function (data) {
                        if (data.errorcode == 0) {
                            $alert.msgDialogSuccess(getRcString("EDIT_SUCCESS")[0]);
                            $scope.$broadcast('refresh#userlist');
                        }
                        else {
                           
                        }
                    }).error(function (data) {

                    })
                },
                cancelHandler: function (modal, $ele) {

                },
                beforeRender: function ($ele) {
                    return $ele;
                }
            }
        }

        $scope.macAddress = {
            options: {
                mId: 'macAddress',
                title: getRcString("EDIT_USER")[1],
                autoClose: true,
                showCancel: true,
                buttonAlign: "center",
                okHandler: function (modal, $ele) {
                    
                },
                cancelHandler: function (modal, $ele) {

                },
                beforeRender: function ($ele) {
                    return $ele;
                }
            }
        }

        $scope.macOption={
            tId:'macTable',
            striped:true,
            pagniation:true,
            clickToSelect: true,
            columns:[
                        {sortable:true,field:'userName',title:getRcString('USER_LIST_HEADER')[0]},
                        {sortable:true,field:'macAddress',title:getRcString('USER_LIST_HEADER')[5]}
                    ]
        };

        $scope.import = {
            options: {
                mId: 'import',
                title: getRcString("EDIT_USER")[2],
                autoClose: true,
                showCancel: true,
                buttonAlign: "center",
                okHandler: function (modal, $ele) {
                    var fd = new FormData();
                    var file = document.querySelector('input[type=file]').files[0];
                    fd.append("logo",file);

                    $http({
                        method: 'POST',
                        url: '/v3/ace/oasis/auth-data/o2oportal/registuser/upload?storeId='+$scope.sceneInfo.nasid,
                        data: fd,
                        headers: {'Content-Type': undefined}
                    }).success(function (data) {
                        if (data.errorcode == 0) {
                            $alert.msgDialogSuccess(getRcString("EDIT_SUCCESS")[1]);
                            $scope.$broadcast('refresh#userlist');
                        }else if(data.errorcode == 1408){
                            $alert.msgDialogError(getRcString('PASSWORD_ERROR'));
                        }else if(data.errorcode == 1403){
                            var index = data.errormsg.indexOf('userName');
                            if(index > 0){
                                $alert.msgDialogError(data.errormsg.slice(39)+' '+getRcString('ADD_FAIL')[1]);
                            }
                        }else if(data.errorcode == 2105){
                            $alert.msgDialogError(getRcString('BIND_ERROR'));
                        }else if(data.errorcode == 2107){
                            $alert.msgDialogError(getRcString('EXPORT_ERROR'));
                        }else if(data.errorcode == 2104){
                            $alert.msgDialogError(getRcString('NUM_ERROR'));
                        }
                    }).error(function (data) {

                    })
                },
                cancelHandler: function (modal, $ele) {

                },
                beforeRender: function ($ele) {
                    return $ele;
                }
            }
        }
        $scope.$on('click-cell.bs.table#userlist',function (e, field, value, row, $element){
            var adata = $scope.Arrmac[row.userName];
            if(adata.length <=0){
                return;
            }
            var data=[];
            $.each(adata,function(i,item){
                data[i] = {};
                data[i].userName = row.userName || " ";
                data[i].macAddress= item || " ";
            });
            if(field=='macBindList'){
                $scope.$broadcast('show#macAddress');
                $scope.$broadcast('load#macTable',data);
            }
        })
        $scope.$watch("myForm.userPassword.$viewValue", function (v) {
            $scope.add.password = $scope.myForm.userPassword.$viewValue;
            if($scope.add.passwordConf == $scope.add.password){
                $scope.myForm.passwordConform2.$setValidity("pwCheck",true);
                $scope.myForm.passwordConform.$setValidity("pwCheck",true);
            }else{
                $scope.myForm.passwordConform2.$setValidity("pwCheck",false);
                $scope.myForm.passwordConform.$setValidity("pwCheck",false);
            }
        });
        $scope.$watch("myForm.userPassword2.$viewValue", function (v) {
            $scope.add.password = $scope.myForm.userPassword2.$viewValue;
            $scope.myForm.userPassword.$validate();
            if($scope.add.passwordConf == $scope.add.password){
                $scope.myForm.passwordConform2.$setValidity("pwCheck",true);
                $scope.myForm.passwordConform.$setValidity("pwCheck",true);
            }else{
                $scope.myForm.passwordConform2.$setValidity("pwCheck",false);
                $scope.myForm.passwordConform.$setValidity("pwCheck",false);
            }
        });

        $scope.$watch("myForm.passwordConform.$viewValue", function () {
            $scope.add.passwordConf = $scope.myForm.passwordConform.$viewValue;
            $scope.myForm.passwordConform2.$validate();
            if($scope.add.passwordConf == $scope.add.password){
                $scope.myForm.passwordConform2.$setValidity("pwCheck",true);
                $scope.myForm.passwordConform.$setValidity("pwCheck",true);
            }else{
                $scope.myForm.passwordConform2.$setValidity("pwCheck",false);
                $scope.myForm.passwordConform.$setValidity("pwCheck",false);
            }
        });
        $scope.$watch("myForm.passwordConform2.$viewValue", function () {
            $scope.add.passwordConf = $scope.myForm.passwordConform2.$viewValue;
            $scope.myForm.passwordConform.$validate();
            if($scope.add.passwordConf == $scope.add.password){
                $scope.myForm.passwordConform2.$setValidity("pwCheck",true);
                $scope.myForm.passwordConform.$setValidity("pwCheck",true);
            }else{
                $scope.myForm.passwordConform2.$setValidity("pwCheck",false);
                $scope.myForm.passwordConform.$setValidity("pwCheck",false);
            }
        });

        $scope.$watch("editForm.editUserPassword.$viewValue", function () {
            $scope.edit.password = $scope.editForm.editUserPassword.$viewValue;
            if($scope.edit.passwordConf == $scope.edit.password){
                $scope.editForm.editPasswordConform.$setValidity('pwCheck',true);
                $scope.editForm.editPasswordConform2.$setValidity('pwCheck',true);
            }else{
                $scope.editForm.editPasswordConform.$setValidity('pwCheck',false);
                $scope.editForm.editPasswordConform2.$setValidity('pwCheck',false);
            }
        });
        $scope.$watch("editForm.editUserPassword2.$viewValue", function () {
            $scope.edit.password = $scope.editForm.editUserPassword2.$viewValue;
            $scope.editForm.editUserPassword.$validate();
            if($scope.edit.passwordConf == $scope.edit.password){
                $scope.editForm.editPasswordConform.$setValidity('pwCheck',true);
                $scope.editForm.editPasswordConform2.$setValidity('pwCheck',true);
            }else{
                $scope.editForm.editPasswordConform.$setValidity('pwCheck',false);
                $scope.editForm.editPasswordConform2.$setValidity('pwCheck',false);
            }
        });

        $scope.$watch("editForm.editPasswordConform.$viewValue", function () {
            $scope.edit.passwordConf = $scope.editForm.editPasswordConform.$viewValue;
            $scope.editForm.editPasswordConform2.$validate();
            if($scope.edit.passwordConf == $scope.edit.password){
                $scope.editForm.editPasswordConform.$setValidity('pwCheck',true);
                $scope.editForm.editPasswordConform2.$setValidity('pwCheck',true);
            }else{
                $scope.editForm.editPasswordConform.$setValidity('pwCheck',false);
                $scope.editForm.editPasswordConform2.$setValidity('pwCheck',false);
            }
        });
        $scope.$watch("editForm.editPasswordConform2.$viewValue", function () {
            $scope.edit.passwordConf = $scope.editForm.editPasswordConform2.$viewValue;
            $scope.editForm.editPasswordConform.$validate();
            if($scope.edit.passwordConf == $scope.edit.password){
                $scope.editForm.editPasswordConform.$setValidity('pwCheck',true);
                $scope.editForm.editPasswordConform2.$setValidity('pwCheck',true);
            }else{
                $scope.editForm.editPasswordConform.$setValidity('pwCheck',false);
                $scope.editForm.editPasswordConform2.$setValidity('pwCheck',false);
            }
        });

        $scope.$watch('myForm.$invalid', function (v) {
            setTimeout(function () {
                if (v) {
                    $scope.$broadcast('disabled.ok#account_Add');
                } else {
                    $scope.$broadcast('enable.ok#account_Add');
                }
            });
        });

        $scope.$watch('editForm.$invalid', function (v) {
            setTimeout(function () {
                if (v) {
                    $scope.$broadcast('disabled.ok#account_Modify');
                } else {
                    $scope.$broadcast('enable.ok#account_Modify');
                }
            });
        });

    }]
});

