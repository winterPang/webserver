/**
 * directive dashboard-wiser by z04434@20161013
 */
define(['angularAMD', 'jquery', 'utils', 'sprintf'],

    function (app, $, utils) {

        var sLang = utils.getLang();
        var URL_TEMPLATE_FILE = sprintf('../dashboard5/views/%s/dashboard_wiser.html', sLang);
        var URL_GET_WISER = '/v3/ssidmonitor/getssidinfobrief?devSN=%s';

        app.directive('dashboardWiser', ['$timeout', '$rootScope', '$http', '$q',
            function ($timeout, $rootScope, $http, $q) {
                return {
                    templateUrl: URL_TEMPLATE_FILE,
                    restrict: 'E',
                    scope: {
                        sn: '@',
                        user:'@',
                        nas:'@'
                    },
                    replace: true,
                    controller: function ($scope, $element, $attrs, $transclude) {
                    },
                    link: function ($scope, $element, $attrs, $ngModel) {
                        var g_authInfo="";
                        var g_AuthCfg = "";
                        var g_themeCfg = "";
                        var g_pubmngInfo="";
                        var sUrl = sprintf(URL_GET_WISER, $scope.sn);
                        getAuthMes=function(){//认证模板
                            $http({
                                url:'/v3/ace/oasis/auth-data/restapp/o2oportal/authcfg/query',
                                method:"GET",
                                params:{
                                    storeId:$scope.nas
                                }
                            }).success(function(data){
                                console.log(data);
                                g_authInfo=data.data;
                                console.log(g_authInfo);
                            }).error(function(){})
                        };
                        getAuthMes();
                        getPubMes=function(){//发布模板
                            $http({
                                url:'/v3/ace/oasis/auth-data/restapp/o2oportal/pubmng/query',
                                method:"GET",
                                params:{
                                    nasId:$scope.nas
                                }
                            }).success(function(data){
                                g_pubmngInfo = data.data;
                                console.log(g_pubmngInfo);
                            }).error(function(err){
                            });
                        };
                        getPubMes();
                        $scope.option = {
                            tId        : 'wiser',
                            url        : sUrl+"&ownerName="+$scope.user,//+"&shopName="+$scope.nas
                            pageSize   : 5,
                            pageList   : [5,10],
                            searchable: true,
                            totalField : 'ssidTotalCnt',
                            dataField  : 'ssidList',
                            queryParams: function(o){
                                return o;
                                // {
                                //     'devSN':$scope.sn,
                                //     shopName:"园区3510H",
                                //     ownerName:$rootScope.userInfo.user
                                // }
                            },
                            responseHandler:function(res){
                                var aData=res.ssidList;
                                var authTypeNum = "";
                                for(var i=0;i<aData.length;i++){
                                    aData[i].lvzhouAuthMode="";
                                    for(var j=0;j<g_pubmngInfo.length;j++){
                                        if(aData[i].ssid==g_pubmngInfo[j].ssidIdV3){
                                            for(var k=0;k<g_authInfo.length;k++){
                                                if(g_pubmngInfo[j].authCfgName==g_authInfo[k].authCfgTemplateName){
                                                    authTypeNum=g_authInfo[k].authType;
                                                    if(authTypeNum==1){
                                                        aData[i].lvzhouAuthMode=$scope.RC_TITLE_AUTH_TYPE_ONEKEY;
                                                    }else if(authTypeNum==2){
                                                        aData[i].lvzhouAuthMode=$scope.RC_TITLE_AUTH_TYPE_ACCOUNT;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    if(aData[i].lvzhouAuthMode==""){
                                        aData[i].lvzhouAuthMode=$scope.RC_TITLE_AUTH_TYPE_NOAUTH;
                                    }
                                }
                                return res;
                            },
                            columns: [
                                {
                                    sortable: true,
                                    field: 'ssidName',
                                    title: $scope.RC_TABLE_COLUMN_SSID,
                                    searcher: {type: "text"}
                                },
                                {
                                    sortable: true,
                                    field: 'status',
                                    title: $scope.RC_TABLE_COLUMN_SSID_STATUS,
                                    formatter: function(value, row, index) {
                                        var sStatus = $scope.RC_TITLE_WISER_STATUS_OFF;
                                        if (value == 1) {
                                            sStatus= $scope.RC_TITLE_WISER_STATUS_ON;
                                        }
                                        return sStatus;
                                    },
                                    searcher: {
                                        type: "select",
                                        textField: "statusText",
                                        valueField: "statusValue",
                                        data: [
                                            {statusText: $scope.RC_TITLE_WISER_STATUS_ON,statusValue:1},
                                            {statusText: $scope.RC_TITLE_WISER_STATUS_OFF,statusValue:2}
                                        ]
                                    }
                                },
                                /*{
                                    sortable: true,
                                    field: 'description',
                                    title: $scope.RC_TABLE_COLUMN_SSID_TYPE,
                                    formatter:function(value, row, index){
                                        var sType ="";
                                        if (value =="") {
                                        }else if(value =="1"){
                                            sType =$scope.RC_TITLE_SSID_TYPE_IN
                                        }else if(value =="2"){
                                            sType =$scope.RC_TITLE_SSID_TYPE_BUSINESS
                                        }else{

                                        }
                                        return sType;
                                    },
                                    searcher: {
                                        type: "select",
                                        textField: "ssidTypeText",
                                        valueField: "ssidTypeValue",
                                        data: [
                                            {ssidTypeText: $scope.RC_TITLE_SSID_TYPE_IN,ssidTypeValue:1},
                                            {ssidTypeText: $scope.RC_TITLE_SSID_TYPE_BUSINESS,ssidTypeValue:2}
                                        ]
                                    }
                                },*/
                                {
                                    sortable: true,
                                    field: 'lvzhouAuthMode',
                                    title: $scope.RC_TABLE_COLUMN_AUTH_TYPE,
                                    /*formatter: function(value, row, index) {
                                        var sAuthType = '';

                                        if (value == -1) {
                                            sAuthType = $scope.RC_TITLE_AUTH_TYPE_UNKNOW;
                                        } else if(value == 0){
                                            sAuthType= $scope.RC_TITLE_AUTH_TYPE_NOAUTH;
                                        }else if(value == 1){
                                            sAuthType = $scope.RC_TITLE_AUTH_TYPE_ONEKEY;
                                        }else {
                                            sAuthType = $scope.RC_TITLE_AUTH_TYPE_ACCOUNT;
                                        }
                                        return sAuthType;
                                    },*/
                                    searcher: {
                                        type: "select",
                                        textField: "authTypeText",
                                        valueField: "authTypeValue",
                                        data: [
                                            {authTypeText: $scope.RC_TITLE_AUTH_TYPE_NOAUTH,authTypeValue:$scope.RC_TITLE_AUTH_TYPE_NOAUTH},
                                            {authTypeText: $scope.RC_TITLE_AUTH_TYPE_ONEKEY,authTypeValue:$scope.RC_TITLE_AUTH_TYPE_ONEKEY},
                                            {authTypeText: $scope.RC_TITLE_AUTH_TYPE_ACCOUNT,authTypeValue:$scope.RC_TITLE_AUTH_TYPE_ACCOUNT}
                                        ]
                                    }
                                },
                                {
                                    sortable: true,
                                    field: 'clientCount',
                                    title: $scope.RC_TABLE_COLUMN_CLIENT_COUNT,
                                    searcher: {type: "text"}
                                },
                                {
                                    sortable: true,
                                    field: 'ApCnt',
                                    title: $scope.RC_TABLE_COLUMN_AP_COUNT,
                                    searcher: {type: "text"}
                                }
                            ]
                        };
                    }
                };
            }]);
    });
