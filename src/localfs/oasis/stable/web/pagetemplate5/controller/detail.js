define(['utils', 'jquery', 'angular-ui-router', 'bsTable', 'css!pagetemplate5/css/pagetemplate5'], function (Utils, $) {
    return ['$scope', '$http', '$rootScope', '$compile', '$alertService', '$state', '$location', '$window', function ($scope, $http, $rootScope, $compile, $alert, $state, $location, $window) {
        $scope.flags = {
            temp: 'vigour'
        };
        $scope.evts = {};
        var storeId = $scope.sceneInfo.nasid,
            ownerName = $scope.userInfo.user;
        var ascending;

        $http.get("../pagetemplate5/views/" + Utils.getLang() + "/editform.html").success(function (data) {
            $scope.html = data;
        });

        function getRcString(attrName) {
            return Utils.getRcString("page_rc", attrName).split(',');
        }

        $scope.$on('expanded-row.bs.table#themelist', function (e, data) {
            var row = data.row, el = data.el;
            el.append($compile($scope.html)($scope));
            $scope.edit = {
                themeName: row.themeName,
                themeDec: row.description,
                drawUrl: row.simpledraw,
                themeType: row.themeType || 1,
                themeId: row.id
            };
            if (Utils.getLang() == "en") {
                $scope.edit.drawUrl = $scope.edit.drawUrl.replace('draw.html', 'drawEn.html');
            }
            $scope.old = $.extend(true, {}, $scope.edit);
        });

        var tableCommon = {
            orderField: 'ascending',//是否升序
            startField: 'startRowIndex',//查询起始行
            limitField: 'maxItems',//单页最大显示数量
            detailView: true,//是否显示具体的信息
            sidePagination: 'server',
            responseHandler: function (data) {
                if (data != "") {
                    var aRegisterList = [];
                    if (data.errorcode == 0) {
                        // aRegisterList = data.data;
                        data.data.forEach(function (theme) {
                            if ((theme.v3flag == 1) || (!(theme.v3flag == false))) {
                                theme.pagemodel = theme.themeType || 1;
                                theme.simpledraw = "/oasis/stable/web/themepage_o2o/template0" + theme.pagemodel + "/draw.html?templateId=" + theme.id + "&type=1";
                                aRegisterList.push(theme);
                            }
                        });
                    }
                }
                return {
                    total: data.rowCount,
                    rows: aRegisterList
                }
            },
            columns: [
                {
                    searcher: {type: 'text'},
                    sortable: true,
                    field: 'themeName',
                    title: getRcString("Page_HEADER")[0]
                },
                {
                    showTooltip: true,
                    searcher: {type: 'text'},
                    sortable: true,
                    field: 'themeType',
                    title: getRcString("Page_HEADER")[1],
                    formatter: function (val, row) {
                        return val == '1' ? '简约' : val == '2' ? '天空' : '2017活力版';
                    }
                },
                {
                    showTooltip: true,
                    searcher: {type: 'text'},
                    sortable: true,
                    field: 'description',
                    title: getRcString("Page_HEADER")[2]
                }
            ]
        };
        $scope.pageOption = $.extend(true, {}, tableCommon, {
            tId: 'themelist',
            //获取数据的接口
            url: '/v3/ace/oasis/auth-data/o2oportal/pagetemplate/queryAll?storeId=' + storeId + '&v3flag=1',
            sortField: 'sortColumn',//排序列名
            queryParams: function (params) {
                console.log("paixu", params);
                ascending = params.order;
                params.start = undefined;
                params.size = undefined;
                params.order = undefined;
                return params;
            }
        });

        $scope.$watch('addForm.$invalid', function (v) {
            if (v) {
                $scope.$broadcast('disabled.ok#account_Add');
            } else {
                $scope.$broadcast('enable.ok#account_Add');
            }
        });

        $scope.refresh = function () {
            $scope.$broadcast('refresh#themelist');
        };

        $scope.add = {};
        $scope.edit = {};
        /**
         * 重置表单
         */
        $scope.$on('hidden.bs.modal#account_Add', function () {
            // debugger
            $scope.add.themeName = '';
            $scope.add.themeDec = '';
            // 重置表单
            $scope.addForm.themeName.$setPristine();
            $scope.addForm.themeName.$setUntouched();
            $scope.addForm.themeDec.$setPristine();
            $scope.addForm.themeDec.$setUntouched();
        });

        //add account
        $scope.accountAdd = {
            options: {
                mId: 'account_Add',
                title: getRcString("ADDPAGE_TITLE")[0],
                autoClose: true,
                showCancel: true,
                buttonAlign: "center",
                okHandler: function (modal, $ele) {
                    var urlReplace = $scope.add.tType == 3 ? 'pagetemplate' : 'themetemplate';
                    $http({
                        method: 'POST',
                        url: '/v3/ace/oasis/auth-data/o2oportal/' + urlReplace + '/add',
                        data: {
                            storeId: storeId,
                            ownerName: ownerName,
                            themeName: $scope.add.themeName,
                            description: $scope.add.themeDec,
                            v3flag: 1,
                            themeType: $scope.add.tType || 1,
                            international: Utils.getLang()
                        }
                    }).success(function (data) {
                        if (data.errorcode == 0) {
                            $scope.refresh();
                            $alert.msgDialogSuccess(getRcString("ADD_SUCCESS")[0]);
                        }
                        else if (data.errorcode == 1201) {
                            $alert.msgDialogSuccess(getRcString("PAGE_EXIST")[0]);
                        }
                        else {
                            $alert.msgDialogError(getRcString("ADD_FAILED")[0], 'error');
                        }
                    }).error(function (data) {
                    });
                },
                cancelHandler: function (modal, $ele) {

                },
                beforeRender: function ($ele) {
                    return $ele;
                }
            }
        };
        //add-button
        $scope.addAccount = function () {
            $scope.$broadcast('show#account_Add');
        };

        //delete
        $scope.del = function () {
            var urlReplace = $scope.edit.themeType == 3 ? 'pagetemplate' : 'themetemplate';
            $alert.confirm(getRcString("DELETE_OR_CANCEL")[0], function () {
                var reqData = {
                    method: 'POST',
                    url: '/v3/ace/oasis/auth-data/o2oportal/' + urlReplace + '/delete',
                    data: {
                        ownerName: ownerName,
                        storeId: storeId,
                        themeName: $scope.edit.themeName,
                        id: $scope.edit.themeId
                    }
                };
                $http(reqData).success(function (data) {
                    if (data.errorcode == 0) {
                        $scope.refresh();
                        $alert.msgDialogSuccess(getRcString("DELETE_SUCCESS")[0]);
                    } else if (data.errorcode == 60015) {
                        $alert.msgDialogError(getRcString("CANNOT_DELETE")[0], 'error');
                    } else if (data.errorcode == 1006) {
                        $alert.msgDialogError(getRcString("DELETE_FILE_FAILED")[0], 'error');
                    } else {
                        $alert.msgDialogError(getRcString("DELETE_FAILED")[0], 'error');
                    }
                }).error(function () {
                    $alert.msgDialogError(getRcString("FAILURE_RETRY")[0], 'error');
                });
            });
        };
        $scope.modify = function () {
            var urlReplace = $scope.edit.themeType == 3 ? 'pagetemplate' : 'themetemplate';
            if ($scope.toggle_form.$invalid) {
                return;
            }
            $http({
                method: 'POST',
                url: '/v3/ace/oasis/auth-data/o2oportal/' + urlReplace + '/modify',
                data: {
                    storeId: storeId,
                    ownerName: ownerName,
                    themeName: $scope.edit.themeName,
                    description: $scope.edit.themeDec,
                    id: $scope.edit.themeId
                }
            }).success(function (data) {
                if (data.errorcode == 0) {
                    $scope.refresh();
                    $alert.msgDialogSuccess(getRcString("MODIFY_SUCCESS")[0]);
                }
                else {
                    $alert.msgDialogError(getRcString("MODIFY_FAILED")[0], 'error');
                }
            }).error(function (err) {

            });
        };

        $scope.reset = function () {
            $scope.edit = $.extend(true, {}, $scope.old);
            $scope.toggle_form.$setPristine();
            $scope.toggle_form.$setUntouched();
        };

        $scope.draw = function (sUrl) {
            var urlReplace = $scope.edit.themeType == 3 ? 'pagetemplate' : 'themetemplate';
            $http.get("/v3/ace/oasis/auth-data/o2oportal/" + urlReplace + "/getTracker").success(function (data) {
                if (data.errorcode == 0 && data.data.length != 0) {
                    $scope.tracker = data.data;
                    var themetemplateUrl = "https://" + $location.host() + sUrl + "&tracker=" + $scope.tracker;
                    var pagetemplateUrl = "https://" + $location.host() + "/oasis/stable/web/vitalityTemplate/views/cn/index.html#?templateId=" + $scope.edit.themeId + "&pageType=1";
                    var pageURL = $scope.edit.themeType == 3 ? pagetemplateUrl : themetemplateUrl;
                    $window.open(pageURL);
                }
            });
        }
    }]
});

