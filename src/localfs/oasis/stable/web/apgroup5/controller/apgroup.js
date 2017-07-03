define(['utils'], function (Utils) {
    return ['$scope', '$http', '$alertService', '$state', function ($scope, $http, $alert, $state) {

        var APP_ID = 'apgroup5';

        $scope.$watch('permission', function (v) {

            var permission = $scope.getPermissionById(APP_ID);

            $scope.read = permission.read;
            $scope.write = permission.write;
            $scope.execute = permission.execute;

        }, true);

        function getRcString(attrName) {
            return Utils.getRcString("apgroup_rc", attrName);
        }

        var apgroupTableTitle = getRcString("apgroup-table-title").split(",");
        var apTableTitle = getRcString("ap-table-title").split(",");
        var modalTitle = getRcString("modal-title").split(",");
        var getApgroupUrl = Utils.getUrl('GET', ' ', '/apmonitor/getApCountAndDescByGroup', '/init/apgroup5/apgroup.json');
        var getApUrl = Utils.getUrl('post', ' ', '/apmonitor/getApListPageByModel?devSN=' + $scope.sceneInfo.sn, '/init/apgroup5/ap.json');

        $scope.selected = {
            apModel: []
        };
	$scope.isNotSelectedAP = true;
        $scope.$watch('apGroupModel', function (v) {
            if (v && v.apmodel && v.apmodel.apmodel && $scope.selected.apModel.indexOf(v.apmodel.apmodel) == -1) {
                $scope.selected.apModel.push(v.apmodel.apmodel);
            }
	    if (0 != ($scope.selected.apModel.length)){
                $scope.isNotSelectedAP = false;
            }else{
                $scope.isNotSelectedAP = true;
            }
            $scope.apGroupModel.apmodel = {};
        }, true);

        $scope.removeData = function (v) {
            $scope.selected.apModel = $.grep($scope.selected.apModel, function (v2) {
                return v2 != v;
            });
            if (0 === ($scope.selected.apModel.length)){
                $scope.isNotSelectedAP = true;
            }
        };

        $scope.apgroup_table = {
            tId: 'apgrouptid',
            url: getApgroupUrl.url,
            clickToSelect: false,
            searchable: true,
            pagination: true,
            pageSize: 10,
            showCheckBox: true,
            sidePagination: 'client',
            queryParams: function (params) {
                return {devSN: $scope.sceneInfo.sn};
            },
            responseHandler: function (data) {
                if ((data) && (data.apList)) {
                    return data.apList;
                } else {
                    return [];
                }
            },
            columns: [
                {sortable: true, field: 'ApGroupName', title: apgroupTableTitle[0], searcher: {}},
                {sortable: true, field: 'Description', title: apgroupTableTitle[1], searcher: {}},
                {
                    sortable: true, field: 'ApCount', title: apgroupTableTitle[2], searcher: {},
                    formatter: function (value, row, index) {
                        return '<a class="list-link">' + value + '</a>';
                    }
                },
                {
                    title: apgroupTableTitle[3],
                    field: 'bindOption',
                    formatter: function (value, row, index) {
                        return '<a class="list-link"><i class="fa fa-link"></i></a>';
                    }
                }
            ]
        };

        // ap table
        $scope.ap_table = {
            tId: 'aptid',
            // url: getApUrl.url,
            searchable: true,
            clickToSelect: true,
            striped: true,
            sidePagination: 'server',
            pagination: true,
            pageSize: 5,
            showPageList: false,
            pageParamsType: 'path',
            method: "post",
            contenrType: "application/json",
            dataType: "json",
            startField: 'skipnum',
            limitField: 'limitnum',
            queryParams: function (params) {
                var oBody = {
                    findoption: {},
                    sortoption: {},
                    apModelList: []
                };
                if (params.search) {
                    oBody.findoption.search = params.search;
                }
                if (params.sort) {
                    oBody.sortoption[params.sort] = (params.order == "asc" ? 1 : -1);
                }
                // console.log(oBody);

                for (i = 0, len = $scope.selected.apModel.length; i < len; i++) {
                    var obj = {};
                    obj = {
                        apModel: $scope.selected.apModel[i]
                    };
                    oBody.apModelList.push(obj);
                }

                params.start = undefined;
                params.size = undefined;
                params.order = undefined;

                // params.devSN = $scope.sceneInfo.sn;
                return $.extend(true, {}, params, oBody);
            },
            responseHandler: function (data) {
                // console.log('apbymodel', data);
                return {
                    total: data.totalCount,
                    rows: data.apList
                };
            },
            columns: [
                {checkbox: true},
                {sortable: true, field: 'apName', title: apTableTitle[0], searcher: {}},
                {sortable: true, field: 'apModel', title: apTableTitle[1], searcher: {}},
                {sortable: true, field: 'apSN', title: apTableTitle[2], searcher: {}},
                {sortable: true, field: 'macAddr', title: apTableTitle[3], searcher: {}}
            ],

        };

        //create AP group
        $scope.apgroup = {
            options: {
                mId: 'apgroup',
                title: modalTitle[0],
                autoClose: true,
                showCancel: false,
                buttonAlign: "center",
                modalSize: 'lg',
                bodyMaxHeight: 500,
                showFooter: false

            }
        }

        // add ap to ap group
        $scope.ap = {
            options: {
                mId: 'ap',
                title: modalTitle[0],
                autoClose: true,
                showCancel: false,
                buttonAlign: "center",
                modalSize: 'lg',
                okHandler: function (modal, $ele) {
                    $alert.msgDialogSuccess(getRcString("ADD-SUCCESS"));
                    // setTimeout(function () {
                    //         $scope.$broadcast('refresh#apgrouptid');
                    //     }, 300);
                    $scope.$broadcast('hide#apgroup');
                    $scope.$broadcast('refresh#apgrouptid');
                },
                cancelHandler: function (modal, $ele) {
                },
                beforeRender: function ($ele) {
                    return $ele;
                }
            }
        }

        // add ap to ap group
        $scope.apInGroupModal = {
            mId: 'apInGroupMid',
            title: modalTitle[1],
            autoClose: true,
            showCancel: false,
            buttonAlign: "center",
            modalSize: 'lg',
            okHandler: function (modal, $ele) {
            },
            cancelHandler: function (modal, $ele) {
            },
            beforeRender: function ($ele) {
                return $ele;
            }
        }

        var getApInGroupUrl = Utils.getUrl('GET', ' ', '/v3', '/init/apgroup5/apingroup.json');
        // apInGroup table
        $scope.apInGroup_table = {
            tId: 'apingroup1tid',
            url: getApInGroupUrl.url,
            clickToSelect: true,
            sidePagination: 'server',
            striped: true,
            searchable: true,
            pagination: true,
            showPageList: false,
            pageSize: 5,
            pageList: [5, 10],
            pageParamsType: 'path',
            method: "post",
            contenrType: "application/json",
            dataType: "json",
            startField: 'skipnum',
            limitField: 'limitnum',
            // totalField:'totalCntInGrp',
            // dataField:'apList',
            queryParams: function (params) {
                var oBody = {
                    findoption: {
                        findOptInGrp: {}
                    },
                    sortoption: {
                        sortOptInGrp: {}
                    }
                };
                // console.log('########', params)
                if (params.findoption) {
                    oBody.findoption.findOptInGrp = params.findoption;
                }
                if (params.sort) {
                    oBody.sortoption.sortOptInGrp[params.sort] = (params.order == "asc" ? 1 : -1);
                }
                params.start = undefined;
                params.size = undefined;
                params.order = undefined;
                return $.extend(true, {}, params, oBody);
            },
            responseHandler: function (data) {
                // console.log('apshuju', data);
                return {
                    total: data.totalCntInGrp,
                    rows: data.apList
                };
            },
            columns: [
                {sortable: true, field: 'apName', title: apTableTitle[0], searcher: {}},
                {sortable: true, field: 'apModel', title: apTableTitle[1], searcher: {}},
                {sortable: true, field: 'apSN', title: apTableTitle[2], searcher: {}},
                {sortable: true, field: 'macAddr', title: apTableTitle[3], searcher: {}}
            ]
        };
        //add-button
        $scope.addApGroup = function () {
            console.log("add ap group");
            $scope.$broadcast('show#apgroup');
            // $state.go(a.b.v.f);
        };
        $scope.$watch('selected.apModel', function () {
            $(window).trigger('resize');
        }, true);

        //delete ap group button
        $scope.deleteApGroup = function () {
            console.log("delete ap group");
            $scope.$broadcast('getAllSelections#apgrouptid', {}, function (data) {
                // console.log(data);

                var selectedData = data;
                var aReqestData = [];
                // var isNeedShowMessage = 0;
                // var isDefaultGroup = false;
                // var isExistApInGroup = 0;
                var SelectDataLen = selectedData.length;
                for (i = 0; i < SelectDataLen; i++) {
                    var obj = {};
                    obj = {
                        apGroupName: selectedData[i].ApGroupName,
                    };
                    aReqestData.push(obj);
                }
                $http({
                    url: '/v3/ant/confmgr',
                    method: 'POST',
                    data: {
                        devSN: $scope.sceneInfo.sn,
                        deviceModule: "apmgr",
                        cloudModule: "apmgr",
                        configType: 0,
                        method: "DelApGroup",
                        param: aReqestData,
                    }
                }).success(function (data, header, config, status) {
                    if ((data.communicateResult == "success") && (data.errCode == 0)) {
                        $alert.msgDialogSuccess(getRcString("DEL-SUCCESS"));
                        setTimeout(function () {
                            $scope.$broadcast('refresh#apgrouptid');
                        }, 300);
                    } else {
                        $alert.msgDialogError(getRcString("DEL-FAILED"));
                    }
                }).error(function (data, header, config, status) {
                    $alert.msgDialogError(getRcString("DEL-FAILED"));
                    return;
                });
            })
        }

        // sync ap getApgroupUrl
        $scope.synConfig = function () {
            console.log('syn ap group.');
            $http({
                url: '/v3/ant/confmgr',
                method: 'POST',
                data: {
                    devSN: $scope.sceneInfo.sn,
                    deviceModule: "apmgr",
                    cloudModule: "apmgr",
                    configType: 0,
                    method: "SyncAPGroup",
                    param: [{}]
                }
            }).success(function (data, header, config, status) {
                if ((data.communicateResult == "success") && (data.errCode == 0)) {
                    $scope.$broadcast('refresh#apgrouptid');
                    $alert.msgDialogSuccess(getRcString("SYN-SUCCESS"));
                } else {
                    $alert.msgDialogError(getRcString("SYN-FAILED"));
                    return;
                }
            }).error(function (data, header, config, status) {
                $alert.msgDialogError(getRcString("SYN-FAILED"));
                return;
            })
        }
        // $scope.addGroupForm.groupName.$error.pattern = false;
        $scope.createApGroupDescripeModel = function () {
            var createApObj = {
                apGroupName: $scope.apGroupModel.groupName
            };
            var createApParam = [];
            createApParam.push(createApObj);

            // $scope.$broadcast('hide#apgroup');

            //add ap to ap group
            // console.log($scope.apGroupModel.groupName);
            $http({
                url: '/v3/ant/confmgr',
                method: 'POST',
                data: {
                    devSN: $scope.sceneInfo.sn,
                    configType: 0,
                    cloudModule: "apmgr",
                    deviceModule: "apmgr",
                    method: "CreateApGroup",
                    param: createApParam
                }
            }).success(function (data, header, config, status) {
                if ((data.communicateResult == "success") && (data.errCode == 0) && ("success" === data.deviceResult[0].result)) {
                    $http({
                        url: '/v3/ant/confmgr',
                        method: 'POST',
                        data: {
                            devSN: $scope.sceneInfo.sn,
                            configType: 0,
                            cloudModule: "apmgr",
                            deviceModule: "apmgr",
                            method: "AddGroupDescription",
                            param: [{
                                acSN: $scope.sceneInfo.sn,
                                apGroupName: $scope.apGroupModel.groupName,
                                groupDescription: $scope.apGroupModel.description
                            }]
                        }
                    }).success(function (data, header, config, status) {
                        console.log('data.deviceResult[0].result', data.deviceResult[0].result);
                        if ((data.communicateResult == "success") && (data.errCode == 0)) {
                            var aReqModel = [];
                            for (i = 0, len = $scope.selected.apModel.length; i < len; i++) {
                                var obj = {};
                                obj = {
                                    apGroupName: $scope.apGroupModel.groupName,
                                    apModel: $scope.selected.apModel[i]
                                };
                                aReqModel.push(obj);
                            }
                            $http({
                                url: '/v3/ant/confmgr',
                                method: 'POST',
                                data: {
                                    devSN: $scope.sceneInfo.sn,
                                    configType: 0,
                                    cloudModule: "apmgr",
                                    deviceModule: "apmgr",
                                    method: "AddApGroupModel",
                                    param: aReqModel
                                }
                            }).success(function (data, header, config, status) {
                                if ((data.communicateResult == "success") && (data.errCode == 0)) {
                                    $scope.$broadcast('refresh#aptid', {
                                        url: getApUrl.url
                                    })
                                    $scope.$broadcast('hide#apgroup');
                                    setTimeout(function () {
                                        $scope.$broadcast('show#ap');
                                    }, 300)
                                    // $scope.$broadcast('show#ap');
                                } else {
                                    //error message add model failed
                                    $alert.msgDialogError(getRcString("ADD-MODEL-FAILED"));
                                }
                            }).error(function (data, header, config, status) {
                                //error message add model failed
                                $alert.msgDialogError(getRcString("ADD-MODEL-FAILED"));
                                return;
                            });
                        } else {
                            //error message add model failed
                            $alert.msgDialogError(getRcString("ADD-DES-FAILED"));
                            return;
                        }
                    }).error(function (data, header, config, status) {
                        //error message add apdescripe failed
                        $alert.msgDialogError(getRcString("ADD-DES-FAILED"));
                        return;
                    });
                } else {
                    $scope.$broadcast('hide#apgroup');
                    setTimeout(function () {
                        $alert.msgDialogError(getRcString("ADD-FAILED"));
                    }, 300);
                }

            }).error(function (data, header, config, status) {
                alert.msgDialogError(getRcString("ADD-FAILED"));
            });
        }
        //add ap to ap group
        $scope.addAp = function () {
            console.log('Add ap to ap group.');
            $scope.$broadcast('getAllSelections#aptid', {}, function (data) {
                console.log(data);
                var selectedAp = data;
                var aReqestData = [];
                var groupName = $scope.apGroupModel.groupName;
                for (i = 0, len = selectedAp.length; i < len; i++) {
                    var obj = {};
                    obj = {
                        ApGroupName: groupName,
                        optType: "0",
                        info: selectedAp[i].apName,
                    };
                    aReqestData.push(obj);
                }
                console.log(aReqestData);
                $http({
                    url: '/v3/ant/confmgr',
                    method: 'POST',
                    data: {
                        devSN: $scope.sceneInfo.sn,
                        deviceModule: "apmgr",
                        cloudModule: "apmgr",
                        configType: 0,
                        method: "AddApToGroup",
                        param: aReqestData,
                    }
                }).success(function (data, header, config, status) {
                    if ((data.communicateResult == "success") && (data.errCode == 0)) {
                        $alert.msgDialogSuccess(getRcString("ADD-AP-SUCCESS"));
                    }
                    else {
                        //failed 提示
                        $alert.msgDialogError(getRcString("ADD-AP-FAILED"));
                    }
                }).error(function (data, header, config, status) {
                    //failed 提示
                    $alert.msgDialogError(getRcString("ADD-AP-FAILED"));
                    return;
                });
            })
        }

        // apgroup table event
        $scope.$on('click-cell.bs.table#apgrouptid', function (e, field, value, row, $element) {
            var apGroupName = row.ApGroupName;
            console.log(apGroupName);
            if (field === 'ApCount') {
                var ApInGroupUrl = Utils.getUrl('GET', ' ', '/apmonitor/aplistbygroup?devSN=' + $scope.sceneInfo.sn + '&apGroupName=' + apGroupName, '/init/apgroup5/apingroup.json');
                $scope.$broadcast('refresh#apingroup1tid', {
                    url: ApInGroupUrl.url
                });
                $scope.$broadcast('show#apInGroupMid');
            } else if (field === 'bindOption') {
                // console.log('bindOption',row);
                $state.go('^.addaptogroup', {apgroupname: apGroupName});
            }
        })
        $scope.apGroupModel = {};

        $http({
            url: "/v3/apmonitor/getapmodellist",
            method: 'GET',
            params: {
                devSN: $scope.sceneInfo.sn
            }
        }).success(function (data, header, config, status) {
            $scope.apModels = data.apModelList;

        }).error(function (data, header, config, status) {

        })
        // $scope.apModels = ['wa2620i',2,2,4];

        //button disable
        $scope.modDelGroupBtnDisable = true;
        $scope.modAddApBtnDisable = true;
        $scope.modDelShowDisable = 0;

        var checkEvt = [
            "check.bs.table#apgrouptid",
            "uncheck.bs.table#apgrouptid",
            "check-all.bs.table#apgrouptid",
            "uncheck-all.bs.table#apgrouptid",
            "check.bs.table#aptid",
            "uncheck.bs.table#aptid",
            "check-all.bs.table#aptid",
            "uncheck-all.bs.table#aptid"
        ];

        angular.forEach(checkEvt, function (value, key, values) {
            $scope.$on(value, function () {
                $scope.$broadcast("getSelections#apgrouptid", function (data) {
                    console.log(data);
                    $scope.$apply(function () {
                        // $scope.aCurCheckData = data;
                        // $scope.modBtnDisable = !$scope.aCurCheckData.length;
                        // $scope.modDelGroupBtnDisable = !data.length;
                        var buttonDisable = true;
                        var isDefault = false;
                        var existApIngroupNum = 0;
                        if (0 != data.length) {
                            for (i = 0, len = data.length; i < len; i++) {
                                if ("default-group" === data[i].ApGroupName) {
                                    isDefault = true;
                                } else if (0 != data[i].ApCount) {
                                    existApIngroupNum++;
                                }
                            }
                            if ((false === isDefault) && (0 === existApIngroupNum)) {
                                $scope.modDelGroupBtnDisable = 0;
                            } else {
                                $scope.modDelGroupBtnDisable = 1;
                            }
                            $scope.modDelShowDisable = 1;
                        } else {
                            $scope.modDelShowDisable = 0;
                        }
                    });
                });
                $scope.$broadcast("getSelections#aptid", function (data) {
                    // console.log(data);
                    $scope.$apply(function () {
                        // $scope.aCurCheckData = data;
                        // $scope.modBtnDisable = !$scope.aCurCheckData.length;
                        $scope.modAddApBtnDisable = !data.length;
                    });
                });
            });
        });
    }];
});