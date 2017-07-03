define(['utils','css!authtemplate5/css/style'], function (Utils) {
    return ['$scope', '$http', '$state', '$compile', '$rootScope', '$alertService', function ($scope, $http, $state, $compile, $rootScope, $alert) {
        function getRcString(attrName) {
            return Utils.getRcString("authtemplate_detail_rc", attrName);
        }

        var tableTitle = getRcString("table-title").split(",");
        var firstGet = getRcString("first-get").split(",");
        var deleteMessage = getRcString("delete-message").split(",");
        var promptMessage = getRcString("prompt-message").split(",");
        var failMessage = getRcString("fail-message").split(",");
        $http.get("../authtemplate5/views/" + Utils.getLang() + "/details.html").success(function (data) {
            $scope.html = data;
        });
        $http.get("/v3/ace/oasis/auth-data/restapp/o2oportal/weixinaccount/query?storeId=" + $scope.sceneInfo.nasid).success(function (data) {
            $scope.pubmessage = data.data;
        }).error(function () {
            $alert.msgDialogError(firstGet[0], 'error');
        });
        $http.post("/v3/ace/oasis/auth-data/o2oportal/wifiShopDb/queryWifiShopList", {nasid: $scope.sceneInfo.nasid}).success(function (data) {
            $scope.storeList = data.datas;
        }).error(function () {
            $alert.msgDialogError(firstGet[0], 'error');
        });
        $scope.$on('expanded-row.bs.table#authTable', function (e, data) {
            var row = data.row, el = data.el;
            $scope.auth = {
                store: row.shopId + "",
                authCfgTemplateName: row.authCfgTemplateName,
                authType: row.authType,
                isEnableSms: row.isEnableSms,
                BIND_ENABLE_TIME: row.bindEnableTime && (row.bindEnableTime/24/3600/1000),
                isEnableMacBind: row.isEnableMacBind == 1,
                isEnableWeixin: row.isEnableWeixin,
                isEnableAli: row.isEnableAli,
                isEnableAccount: row.isEnableAccount,
                isEnableQQ: row.isEnableQQ,
                isWeixinConnectWifi: row.isWeixinConnectWifi,
                isForcedAttention: !!row.subscribeRequired,
                smsAuthContent: row.smsAuthContent,
                v3flag: row.v3flag
            };
            $.each($scope.pubmessage, function () {
                if (this.id == row.accountId) {
                    $scope.auth.pubmessage = this.name;
                    return false;
                }
            });
            $.each(row.uamAuthParamList, function () {
                $scope.auth[this.authParamName] = this.authParamValue;
            });
            $scope.auth.MAC_TRIGER_PUSH_AD = $scope.auth.MAC_TRIGER_PUSH_AD == 1;
            $scope.old = $.extend(true, {}, $scope.auth);
            if($scope.auth.NO_SENSATION_TIME != 0){
                $scope.auth.no_sensation = 1;
            }else{
                $scope.auth.no_sensation = 0;
                $scope.auth.NO_SENSATION_TIME = 7;
            }
            $scope.auth.online_time = $scope.auth.ONLINE_MAX_TIME / 60;
            var $ele = $compile($scope.html)($scope);
            el.append($ele);
        });
        $scope.auth_table = {
            tId: 'authTable',
            url: '/v3/ace/oasis/auth-data/o2oportal/authcfg/query?storeId=' + $scope.sceneInfo.nasid + '&v3flag=1',
            totalField: 'rowCount',
            dataField: 'data',
            // sortName: 'authCfgTemplateName',
            startField: 'startRowIndex',
            limitField: 'maxItems',
            sortField: 'sortColumn',
            orderField: 'ascending',
            queryParams: function (params) {
                params.ascending = params.ascending === 'asc';
                return params;
            },
            columns: [{sortable: true, field: 'authCfgTemplateName', title: tableTitle[0]},
                {
                    field: 'authType', title: tableTitle[1], formatter: function (val, row, index) {
                    return val == 1 ? tableTitle[6] : tableTitle[7];
                }
                },
                {
                    field: 'isEnableSms', title: tableTitle[2], formatter: function (val, row, index) {
                    return val ? tableTitle[6] : tableTitle[7];
                }
                },
                {
                    field: 'isEnableWeixin', title: tableTitle[3], formatter: function (val, row, index) {
                    return val ? tableTitle[6] : tableTitle[7];
                }
                },
                {
                    field: 'isWeixinConnectWifi', title: tableTitle[4], formatter: function (val, row, index) {
                    return val ? tableTitle[6] : tableTitle[7];
                }
                },
                {
                    field: 'isEnableAccount', title: tableTitle[5], formatter: function (val, row, index) {
                    return val ? tableTitle[6] : tableTitle[7];
                }
                }],
            sidePagination: 'server',
            pagination: true,
            detailView: true
        };
        $scope.refresh = function () {
            $scope.$broadcast('refresh#authTable');
        };
        $scope.reset = function () {
            $scope.auth = $.extend(true, {}, $scope.old);
            $scope.auth.online_time = $scope.auth.ONLINE_MAX_TIME / 60;
            if($scope.auth.NO_SENSATION_TIME != 0){
                $scope.auth.no_sensation = 1;
            }else{
                $scope.auth.no_sensation = 0;
                $scope.auth.NO_SENSATION_TIME = 7;
            }
            $scope.toggle_form.$setPristine();
            $scope.toggle_form.$setUntouched();
        };
        $scope.modify = function () {
            if ($scope.toggle_form.$invalid) {
                return;
            }
            if ($scope.auth.isEnableWeixin == 1 && !$scope.auth.pubmessage) {
                $alert.msgDialogError(promptMessage[0], 'error');
                return;
            }
            if ($scope.auth.isWeixinConnectWifi == 1 && !$scope.auth.store) {
                $alert.msgDialogError(promptMessage[1], 'error');
                return;
            }
            if ($scope.auth.authType == 2 && $scope.auth.isEnableSms == 0 && $scope.auth.isEnableWeixin == 0 && $scope.auth.isWeixinConnectWifi == 0 && $scope.auth.isEnableAccount == 0) {
                $alert.msgDialogError(promptMessage[2], 'error');
                return;
            }
            $scope.paramsModify = {
                storeId: $scope.sceneInfo.nasid,
                authCfgTemplateName: $scope.auth.authCfgTemplateName,
                authType: $scope.auth.authType,
                subscribeRequired: Number($scope.auth.isWeixinConnectWifi) && ($scope.auth.isForcedAttention ? 1 : 0),
                accountName: $scope.auth.isEnableWeixin == 1 ? $scope.auth.pubmessage : undefined,
                shopId: $scope.auth.isWeixinConnectWifi == 1 ? $scope.auth.store : undefined,
                isEnableSms: $scope.auth.authType == 1 ? 0 : $scope.auth.isEnableSms,
                isEnableWeixin: $scope.auth.authType == 1 ? 0 : $scope.auth.isEnableWeixin,
                isWeixinConnectWifi: $scope.auth.authType == 1 ? 0 : $scope.auth.isWeixinConnectWifi,
                isEnableAli: 0,
                isEnableAccount: $scope.auth.authType == 1 ? 0 : $scope.auth.isEnableAccount,
                isEnableQQ: 0,
                v3flag: $scope.auth.v3flag,
                uamAuthParamList: []
            };
            if ($scope.paramsModify.isEnableSms == 1) {
                $scope.paramsModify.isEnableMacBind = $scope.auth.isEnableMacBind ? 1 : 0;
                if ($scope.paramsModify.isEnableMacBind) {
                    var nDay = Number($scope.auth.BIND_ENABLE_TIME) || 14;
                    nDay *= 24*60*60*1000;
                    $scope.paramsModify.bindEnableTime = nDay;
                } else {
                    $scope.paramsModify.bindEnableTime = undefined;
                }
            } else {
                $scope.paramsModify.isEnableMacBind = 0;
            }
            if ($scope.auth.online_time) {
                $scope.paramsModify.uamAuthParamList.push({
                    authParamName: "ONLINE_MAX_TIME",
                    authParamValue: $scope.auth.online_time * 60
                });
            } else {
                $scope.paramsModify.uamAuthParamList.push({
                    authParamName: "ONLINE_MAX_TIME",
                    authParamValue: 21600
                });
            }
            if ($scope.auth.URL_AFTER_AUTH) {
                $scope.paramsModify.uamAuthParamList.push({
                    authParamName: "URL_AFTER_AUTH",
                    authParamValue: $scope.auth.URL_AFTER_AUTH
                });
            } else {
                $scope.paramsModify.uamAuthParamList.push({
                    authParamName: "URL_AFTER_AUTH",
                    authParamValue: ""
                });
            }
            if ($scope.auth.IDLE_CUT_TIME) {
                $scope.paramsModify.uamAuthParamList.push({
                    authParamName: "IDLE_CUT_TIME",
                    authParamValue: $scope.auth.IDLE_CUT_TIME
                });
            } else {
                $scope.paramsModify.uamAuthParamList.push({
                    authParamName: "IDLE_CUT_TIME",
                    authParamValue: 30
                });
            }
            if ($scope.auth.IDLE_CUT_FLOW) {
                $scope.paramsModify.uamAuthParamList.push({
                    authParamName: "IDLE_CUT_FLOW",
                    authParamValue: $scope.auth.IDLE_CUT_FLOW
                });
            } else {
                $scope.paramsModify.uamAuthParamList.push({
                    authParamName: "IDLE_CUT_FLOW",
                    authParamValue: 10240
                });
            }
            if ($scope.auth.no_sensation == 0) {
                $scope.paramsModify.uamAuthParamList.push({
                    authParamName: "NO_SENSATION_TIME",
                    authParamValue: 0
                });
                $scope.paramsModify.uamAuthParamList.push({
                    authParamName: "MAC_TRIGER_PUSH_AD",
                    authParamValue: 0
                });
            } else {
                if ($scope.auth.NO_SENSATION_TIME) {
                    $scope.paramsModify.uamAuthParamList.push({
                        authParamName: "NO_SENSATION_TIME",
                        authParamValue: $scope.auth.NO_SENSATION_TIME
                    });
                } else {
                    $scope.paramsModify.uamAuthParamList.push({
                        authParamName: "NO_SENSATION_TIME",
                        authParamValue: 7
                    });
                }
                $scope.paramsModify.uamAuthParamList.push({
                    authParamName: "MAC_TRIGER_PUSH_AD",
                    authParamValue: $scope.auth.MAC_TRIGER_PUSH_AD ? 1 : 0
                });
            }
            $http.post("/v3/ace/oasis/auth-data/o2oportal/authcfg/modifybyv3flag", $scope.paramsModify).success(function (data) {
                switch (data.errorcode) {
                    case 0:
                        $alert.msgDialogSuccess(promptMessage[3]);
                        $scope.refresh();
                        break;
                    case 1008:
                        $alert.msgDialogError(failMessage[0], 'error');
                        break;
                    case 1101:
                        $alert.msgDialogError(failMessage[1], 'error');
                        break;
                    case 1102:
                        $alert.msgDialogError(failMessage[2], 'error');
                        break;
                    case 1103:
                        $alert.msgDialogError(failMessage[3], 'error');
                        break;
                    case 1104:
                        $alert.msgDialogError(failMessage[4], 'error');
                        break;
                    case 1508:
                        $alert.msgDialogError(failMessage[10], 'error');
                        break;
                    default:
                        $alert.msgDialogError(failMessage[6], 'error');
                }
            }).error(function () {
                $alert.msgDialogError(firstGet[0], 'error');
            });
        };
        /*delete*/
        $scope.del = function (name) {
            $alert.confirm(deleteMessage[0], function () {
                $http.post("/v3/ace/oasis/auth-data/o2oportal/authcfg/delete", {
                    storeId: $scope.sceneInfo.nasid,
                    authCfgTemplateName: name
                }).success(function (data) {
                    if (data.errorcode == 0) {
                        $scope.refresh();
                        $alert.msgDialogSuccess(promptMessage[4]);
                    } else if (data.errorcode == 1109) {
                        $alert.msgDialogError(failMessage[8], 'error');
                    } else {
                        $alert.msgDialogError(failMessage[9], 'error');
                    }
                }).error(function () {
                    $alert.msgDialogError(firstGet[0], 'error');
                });
            });
        };
        $scope.add = {
            authType: 1,
            isEnableSms: 0,
            isEnableWeixin: 0,
            isWeixinConnectWifi: 0,
            isEnableAccount: 0,
            no_sensation: 0
        };
        $scope.$watch('add_form.$invalid', function (v) {
            if (v) {
                $scope.$broadcast('disabled.ok#add');
            } else {
                $scope.$broadcast('enable.ok#add');
            }
        });
        $scope.auth_modal = {
            mId: "add",
            title: promptMessage[6],
            modalSize: "lg",
            autoClose: false,
            okHandler: function (modal) {

                if ($scope.add.isEnableWeixin == 1 && !$scope.add.pubmessage) {
                    $alert.msgDialogError(promptMessage[0], 'error');
                    return;
                }
                if ($scope.add.isWeixinConnectWifi == 1 && !$scope.add.store) {
                    $alert.msgDialogError(promptMessage[1], 'error');
                    return;
                }
                if ($scope.add.authType == 2 && $scope.add.isEnableSms == 0 && $scope.add.isEnableWeixin == 0 && $scope.add.isWeixinConnectWifi == 0 && $scope.add.isEnableAccount == 0) {
                    $alert.msgDialogError(promptMessage[2], 'error');
                    return;
                }
                $scope.params = {
                    storeId: $scope.sceneInfo.nasid,
                    authCfgTemplateName: $scope.add.authCfgTemplateName,
                    authType: $scope.add.authType,
                    isEnableSms: $scope.add.authType == 1 ? 0 : $scope.add.isEnableSms,
                    isEnableWeixin: $scope.add.authType == 1 ? 0 : $scope.add.isEnableWeixin,
                    isWeixinConnectWifi: $scope.add.authType == 1 ? 0 : $scope.add.isWeixinConnectWifi,
                    isEnableAli: 0,
                    isEnableAccount: $scope.add.authType == 1 ? 0 : $scope.add.isEnableAccount,
                    isEnableQQ: 0,
                    v3flag: 1,
                    subscribeRequired: Number($scope.add.isWeixinConnectWifi) && ($scope.add.isForcedAttention ? 1 : 0),
                    accountName: $scope.add.isEnableWeixin == 1 ? $scope.add.pubmessage : undefined,
                    shopId: $scope.add.isWeixinConnectWifi == 1 ? $scope.add.store : undefined,
                    uamAuthParamList: []
                };
                if ($scope.params.isEnableSms == 1) {
                    $scope.params.isEnableMacBind = $scope.add.isEnableMacBind ? 1 : 0
                    if ($scope.params.isEnableMacBind) {
                        var nDay = Number($scope.add.BIND_ENABLE_TIME) || 14;
                        nDay *= 24*60*60*1000;
                        $scope.params.bindEnableTime = nDay;
                    } else {
                        $scope.params.bindEnableTime = undefined;
                    }
                } else {
                    $scope.params.isEnableMacBind = 0;
                }
                if ($scope.add.ONLINE_MAX_TIME) {
                    $scope.params.uamAuthParamList.push({
                        authParamName: "ONLINE_MAX_TIME",
                        authParamValue: $scope.add.ONLINE_MAX_TIME * 60
                    });
                } else {
                    $scope.params.uamAuthParamList.push({
                        authParamName: "ONLINE_MAX_TIME",
                        authParamValue: 21600
                    });
                }
                if ($scope.add.URL_AFTER_AUTH) {
                    $scope.params.uamAuthParamList.push({
                        authParamName: "URL_AFTER_AUTH",
                        authParamValue: $scope.add.URL_AFTER_AUTH
                    });
                }
                if ($scope.add.IDLE_CUT_TIME) {
                    $scope.params.uamAuthParamList.push({
                        authParamName: "IDLE_CUT_TIME",
                        authParamValue: $scope.add.IDLE_CUT_TIME
                    });
                } else {
                    $scope.params.uamAuthParamList.push({
                        authParamName: "IDLE_CUT_TIME",
                        authParamValue: 30
                    });
                }
                if ($scope.add.IDLE_CUT_FLOW) {
                    $scope.params.uamAuthParamList.push({
                        authParamName: "IDLE_CUT_FLOW",
                        authParamValue: $scope.add.IDLE_CUT_FLOW
                    });
                } else {
                    $scope.params.uamAuthParamList.push({
                        authParamName: "IDLE_CUT_FLOW",
                        authParamValue: 10240
                    });
                }
                if ($scope.add.no_sensation == 0) {
                    $scope.params.uamAuthParamList.push({
                        authParamName: "NO_SENSATION_TIME",
                        authParamValue: 0
                    });
                    $scope.params.uamAuthParamList.push({
                        authParamName: "MAC_TRIGER_PUSH_AD",
                        authParamValue: 0
                    });
                } else {
                    if ($scope.add.NO_SENSATION_TIME) {
                        $scope.params.uamAuthParamList.push({
                            authParamName: "NO_SENSATION_TIME",
                            authParamValue: $scope.add.NO_SENSATION_TIME
                        });
                    } else {
                        $scope.params.uamAuthParamList.push({
                            authParamName: "NO_SENSATION_TIME",
                            authParamValue: 7
                        });
                    }
                    $scope.params.uamAuthParamList.push({
                        authParamName: "MAC_TRIGER_PUSH_AD",
                        authParamValue: $scope.add.MAC_TRIGER_PUSH_AD ? 1 : 0
                    });
                }
                $http.post("/v3/ace/oasis/auth-data/o2oportal/authcfg/addAuthCfg", $scope.params).success(function (data) {
                    switch (data.errorcode) {
                        case 0 :
                            $alert.msgDialogSuccess(promptMessage[5]);
                            $scope.refresh();
                            $scope.$broadcast('hide#add');
                            break;
                        case 1101:
                            $alert.msgDialogError(failMessage[1], 'error');
                            break;
                        case 1102:
                            $alert.msgDialogError(failMessage[2], 'error');
                            break;
                        case 1103:
                            $alert.msgDialogError(failMessage[3], 'error');
                            break;
                        case 1104:
                            $alert.msgDialogError(failMessage[4], 'error');
                            break;
                        case 1105:
                            $alert.msgDialogError(failMessage[5], 'error');
                            break;
                        case 1508:
                            $alert.msgDialogError(failMessage[10], 'error');
                            break;
                        default:
                            $alert.msgDialogError(failMessage[7], 'error');
                    }
                }).error(function () {
                    $alert.msgDialogError(firstGet[0], 'error');
                });
            }
        };
        $scope.$on('hidden.bs.modal#add', function () {
            $scope.add = {
                authType: 1,
                isEnableSms: 0,
                isEnableWeixin: 0,
                isWeixinConnectWifi: 0,
                isEnableAccount: 0,
                no_sensation: 0
            };
            $scope.add_form.$setUntouched();
            $scope.add_form.$setPristine();
        });
        $scope.$watch('add', function () {
            setTimeout(function () {
                $(window).trigger('resize');
            });
        }, true);
        $scope.addModal = function () {
            $scope.$broadcast("show#add");
        };
    }];
});