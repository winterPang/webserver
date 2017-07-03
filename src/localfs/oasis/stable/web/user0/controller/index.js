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

        function fnChengeTime(value) 
        {
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
        function switchUserType(userType){
            switch (userType) {
                case 1:
                    userType = getRcString('USER_TYPE')[0];
                    break;
                case 2:
                    userType = getRcString('USER_TYPE')[1];
                    break;
                case 3:
                    userType = getRcString('USER_TYPE')[2];
                    break;
                case 4:
                    userType = getRcString('USER_TYPE')[3];
                    break;
                case 5:
                    userType = getRcString('USER_TYPE')[4];
                    break;
                case 6:
                    userType = getRcString('USER_TYPE')[5];
                    break;
                case 7:
                    userType = getRcString('USER_TYPE')[6];
                    break;
                case 8:
                    userType = getRcString('USER_TYPE')[7];
                    break;
                case 9:
                    userType = getRcString('USER_TYPE')[8];
                    break;
                case 10:
                    userType = getRcString('USER_TYPE')[9];
                    break;
                case 100:
                    userType = getRcString('USER_TYPE')[10];
                break;
                default:
                    break;
            }
            return userType;
        }

        $scope.userOption = {
            tId: 'userlist',
            url: '/v3/ace/oasis/auth-data/restapp/o2oportal/registuser/query?storeId=' + $scope.sceneInfo.nasid,
            pageSize: 10,
            showPageList: true,
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
            operateWidth:140,
            operatTitle:getRcString('USER_LIST_HEADER')[6],
            operate:{
                detail:function(e,row,$btn){
                    $scope.$broadcast('show#detail');
                    $http({
                        url:'/v3/ace/oasis/auth-data/o2oportal/registuser/queryUserInfo',
                        method:'GET',
                        params:{
                            userMac:row.userMac
                        }
                    }).success(function(data){
                        var oData;
                        if(data.errorcode == 0){
                            var oData = data.data;
                            if(oData.sex == 1){
                                oData.sex = getRcString('SEX')[1];
                            }else if(oData.sex ==2){
                                oData.sex = getRcString('SEX')[2];
                            }
                            for(var key in oData){
                                if(oData[key]=="" && key !="headimgurl"&& key !="country"&& key !="province"&& key !="city"){
                                    oData[key]='-';
                                }
                            }
                            oData.areaName = (data.data.country=="" && data.data.province=="" && data.data.city=="")?"-":data.data.country+' '+data.data.province+' '+data.data.city;
                            updateHtml($("#view_detail_form"), oData);
                            if(data.data.headimgurl==""){
                                $('#headimgurl').hide();
                                $('#headimgurl1').show();
                            }else{
                                $('#headimgurl').attr('src',data.data.headimgurl);
                                $('#headimgurl').width(100);
                            }
                            
                        }
                    }).error(function(data){

                    })
                    
                },
                black:function(e,row,$btn){
                    $alert.confirm(getRcString('CONFIRM'),function(){
                        var oData ={
                        userMacList:[row.userMac],
                        storeId:$scope.sceneInfo.nasid
                    };
                    if(oData.userMacList == ""){
                        $alert.msgDialogError(getRcString('MAC_ERROR'));
                    }
                    $http({
                        method:'POST',
                        url:'/v3/ace/oasis/auth-data/o2oportal/registuser/addtoblackList',
                        data:oData
                    }).success(function(data){
                        if(data.errorcode ==0){
                            $alert.msgDialogSuccess(getRcString("ADD_SUCCESS")[0]);
                            $scope.$broadcast('refresh#userlist');
                        }else if(data.errorcode ==1406){
                            $alert.msgDialogError(data.errormsg.slice(10,27) + ' ' +getRcString('ADD_ERROR')[0]);
                        }
                    });
                    })
                    
                }
            },
            tips:{
                detail:getRcString('Title')[1],
                black:getRcString('Title')[2]
            },
            icons:{
                detail:'fa fa-mydetail',
                black:'fa fa-myblacklist'
            },
            queryParams: function (params) {
                params.sortColumn ? params.sortColumn : params.sortColumn = 'lastAccessTime';
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
                var aVistor = [];
                var total = data.rowCount;
                if (data.errorcode ==0 && data.data.length>0) {
                    var nickOpenids = [];
                   
                    $.each(data.data,function(key,value){
                        var oVisitor={};
                        if(value.nickName){
                            oVisitor.userName = value.nickName;
                        }else{
                            oVisitor.userName = value.userName;
                        }
                        // oVisitor.nickName = value.userMac; //在线列表不显示昵称让其显示MAC
                        oVisitor.storeName = value.storeName;
                        oVisitor.linkTime = value.linkTime;
                        oVisitor.lastAccessTime = value.lastAccessTime ==0?'':GetLoginTime(value.lastAccessTime);
                        oVisitor.accessDurationSum = fnChengeTime(value.accessDurationSum);
                        oVisitor.userType = switchUserType(value.userType);
                        oVisitor.userMac = value.userMac;
                        oVisitor.isBlackUser = value.isBlackUser;
                        if(value.userType === 6||value.userType === 7){
                            nickOpenids.push(value.userMac);
                        }
                        aVistor.push(oVisitor);
                    });
                } 
                return {
                    total: data.rowCount,
                    rows: aVistor
                }
                
            },
            columns: [    
                {
                    searcher: {type: 'text'},
                    sortable: true,
                    field: 'userMac',
                    title: getRcString("USER_LIST_HEADER")[0],
                    formatter: function (value, row, index) {
                        if (row.isBlackUser) {
                            return "<div class='black'>" + value + "</div>";
                        } else {
                            return value;
                        }

                    }
                },
                {
                    searcher: {type: 'text'},
                    field: 'userName',
                    title: getRcString("USER_LIST_HEADER")[1]
                },
                {
                    field: 'userType',
                    title: getRcString("USER_LIST_HEADER")[2],
                    // searcher:{
                    // type: "select", valueField: "value", textField: "text",
                    // data: [
                    //     {value: 1, text:getRcString('USER_TYPE')[0]},
                    //     {value: 2, text:getRcString('USER_TYPE')[1]},
                    //     {value: 3, text:getRcString('USER_TYPE')[2]},
                    //     {value: 4, text:getRcString('USER_TYPE')[3]},
                    //     {value: 5, text:getRcString('USER_TYPE')[4]},
                    //     {value: 6, text:getRcString('USER_TYPE')[5]},
                    //     {value: 7, text:getRcString('USER_TYPE')[6]},
                    //     {value: 8, text:getRcString('USER_TYPE')[7]},
                    //     {value: 9, text:getRcString('USER_TYPE')[8]},
                    //     {value: 100, text:getRcString('USER_TYPE')[9]}

                    // ]

                // }
                    // formatter: function(value,row,index){
                    //     return '<a class="list-link">'+value+'</a>';
                    // } 
                    searcher:{type:'text'} 
                },
                {
                    sortable: true,
                    field: 'linkTime',
                    title: getRcString("USER_LIST_HEADER")[3]
                },
                {
                    sortable: true,
                    field: 'accessDurationSum',
                    title: getRcString("USER_LIST_HEADER")[4]
                },
                {
                    sortable: true,
                    field: 'lastAccessTime',
                    title: getRcString("USER_LIST_HEADER")[5]
                }
            ]
        };

        $scope.userDetail={
            options:{
                mId:'detail',
                title:getRcString('title')[1],                          
                autoClose: true,                         
                showCancel: true,
                // modalSize: 'lg',                      
                buttonAlign: 'center',                    
                // okHandler: function(modal,$ele){
                // //点击确定按钮事件，默认什么都不做
                // },
                // cancelHandler: function(modal,$ele){
                // //点击取消按钮事件，默认什么都不做
                // },
                beforeRender: function($ele){
                    //渲染弹窗之前执行的操作,$ele为传入的html片段
                    return $ele;
                }
            }
        };

        function updateHtml(jScope, oData)
        {
            $.each(oData, function (sKey, sValue)
                {
                    sKey = sKey.replace(/\./g, "\\.");
                    sValue = (null == sValue) ? "" : sValue+"";
                    $("#"+sKey, jScope).removeClass("loading-small").html(sValue);
                });
            return;
        }
    }]
});