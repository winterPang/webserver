define(['jquery', 'utils', 'css!appmanage/css/style'], function ($, utils) {
    return ['$scope', '$element', '$http', '$compile', '$state', '$stateParams', '$rootScope', '$alertService',
        function ($scope, $element, $http, $compile, $state, $stateParams, $rootScope, $alert) {
            /*ALL start*/
            var _rcCache = {};
            function getRcString(key) {
                if (!_rcCache[key]) {
                    _rcCache[key] = $('#palmapRc').attr(key);
                }
                return _rcCache[key];
            }

            var MAP_URL = '/v3/ace/oasis/oasis-rest-map/restapp/';
            var LICENSE_URL = '/v3/ace/oasis/oasis-rest-license/restapp/';
            var APP_URL = '/v3/ace/oasis/oasis-rest-application/restapp/';
            var appId = $stateParams.appId;
            $scope.drawAppId = appId;
            $stateParams.activeTab ? $scope.activeTab = $stateParams.activeTab : $scope.activeTab = 0;
            $scope.changeTab = function (number) {
                $state.go("global.content.application.appmanage_palmap", {
                    appId: appId,
                    activeTab: number
                });
            };
            $http.get(APP_URL + 'appStore/application/' + appId).success(function (data) {
                if (data.code == 0) {
                    $scope.btnUrl = data.data.btn.url;
                } else {
                    $alert.noticeDanger(data.message);
                }
            }).error(function (data) {
                $alert.noticeDanger(getRcString('get-buy-link-failed'));
            });
            /*ALL end*/
            /*draw manage start*/
            var bitmapTableHeaders = getRcString('draw-manage-table-header').split(',');
            var mapStatus = getRcString('draw-status').split(',');
            $scope.bitmapTable = {
                tId: 'bitmapTable',
                dataField: 'data',
                url: MAP_URL + "bitMap/getBitMap/" + appId + "?user_name=" + $rootScope.userInfo.user,
                columns: [
                    {sortable: true, field: 'mapName', title: bitmapTableHeaders[0]},
                    {
                        sortable: true,
                        field: 'mapStatus', title: bitmapTableHeaders[1],
                        formatter: function (value) {
                            switch (value) {
                                case 0:
                                    return mapStatus[0];
                                case 1:
                                    return mapStatus[1];
                                case 2:
                                    return mapStatus[2];
                                case 3:
                                    return mapStatus[3];
                            }
                        }
                    },
                    {sortable: true, field: 'shopName', title: bitmapTableHeaders[2]},
                    {sortable: true, field: 'expireDate', title: bitmapTableHeaders[3]},
                    {sortable: true, field: 'remainDay', title: bitmapTableHeaders[4]}
                ],
                detailView: true,
                operateWidth: 100,
                icons: {
                    charge: 'fa fa-dollar'
                },
                tips: {
                    charge: getRcString('table-opt-charge'),
                    edit: getRcString('table-opt-edit')
                },
                operate: {
                    edit: {
                        enable: function (val, row) {
                            return row.mapStatus == 2;
                            // return true;
                        },
                        click: function (e, row) {
                            $scope.modifyBitmap.modalOpen();
                            $scope.modifyBitmap.data = {
                                appId: parseInt(appId),
                                imageId: row.imageId
                            };
                        }
                    },
                    charge: {
                        enable: function (val, row) {
                            // return row.mapStatus == 0;
                            return true;
                        },
                        click: function (e, row) {
                            $scope.license.modalOpen();
                            $scope.bind = {
                                licenseList: [],
                                appId: parseInt(appId),
                                imageId: row.imageId
                            };
                        }
                    }
                }
            };
            $http.get('../appmanage/views/' + utils.getLang() + '/bitmapDetail.html')
                .success(function (data) {
                    $scope.bitmapDetail = data;
                    $scope.$on('expanded-row.bs.table#bitmapTable', function (e, data) {
                        var el = data.el, row = data.row;
                        $($compile($scope.bitmapDetail)($scope)).appendTo(el);
                        $scope.$apply(function () {
                            $scope.detail = $.extend(true, {}, row);
                        });
                    });
                });
            $scope.modifyBitmap = {
                modal: {
                    mId: "modifyBitmap",
                    title: getRcString('modify-bitmap-title'),
                    autoClose: false,
                    okHandler: function (modal) {
                        if ($scope.modifyBitmap.data.path) {
                            $http.post(MAP_URL + 'bitMap/updateImage', $scope.modifyBitmap.data).success(function (data) {
                                if (data.code == 0) {
                                    $alert.noticeSuccess(getRcString('modify-success'));
                                    $scope.$broadcast("hide#modifyBitmap");
                                    $scope.$broadcast('refresh#bitmapTable');
                                } else {
                                    $alert.noticeDanger(data.message);
                                }
                            });
                        } else {
                            $alert.noticeDanger(getRcString('choice-picture'));
                        }
                    }
                },
                modalOpen: function () {
                    $scope.$broadcast("show#modifyBitmap");
                    $('#btnUpload').on('click', function () {
                        $('#file').trigger('click');
                    });
                    $('#file').on('change', function (e) {
                        var filepath = $('#file').val();
                        var extStart = filepath.lastIndexOf(".");
                        var ext = filepath.substring(extStart, filepath.length).toUpperCase();
                        if (ext != ".BMP" && ext != ".PNG" && ext != ".GIF" && ext != ".JPG" && ext != ".JPEG" && ext != ".DWG") {
                            $alert.noticeDanger(getRcString('picture-format'));
                        } else {
                            var file_size = $('#file')[0].files[0].size;
                            var size = file_size / 1024;
                            if (size > 2048) {
                                $alert.noticeDanger(getRcString('picture-size'));
                            } else {
                                $scope.$apply(function () {
                                    $scope.modifyBitmap.fileName = e.target.value.substr(e.target.value.lastIndexOf('\\') + 1);
                                    $http({
                                        url: MAP_URL + "uploadfile/imageUpload",
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': undefined
                                        },
                                        transformRequest: function () {
                                            var formData = new FormData();
                                            formData.append('file', $('#file')[0].files[0]);
                                            return formData;
                                        }
                                    }).success(function (data) {
                                        if (data) {
                                            if (data.code == 0) {
                                                $scope.modifyBitmap.data.path = data.path;
                                            }
                                        }
                                    });
                                });
                            }
                        }
                    });
                }
            };
            /*draw manage end*/

            /*License manage start*/
            var licenseTableHeader=getRcString('license-table-header').split(',');
            var licenseUsed=getRcString('license-table-used').split(',');
            $scope.licenseTable = {
                tId: "licenseTable",
                url: '/v3/ace/oasis/oasis-rest-license/restapp/app/getAppLicenseInfo/app?app_id=' + appId,
                dataField: 'data',
                columns: [
                    {sortable: true, field: 'licenseNum', title: 'Licence'},
                    {sortable: true, field: 'desc', title: licenseTableHeader[0]},
                    {sortable: true, field: 'payTimeStr', title: licenseTableHeader[1]},
                    {
                        sortable: true,
                        field: 'licenseStatus', title: licenseTableHeader[2],
                        formatter: function (value) {
                            switch (value) {
                                case 0:
                                    return licenseUsed[0];
                                case 1:
                                    return licenseUsed[1];
                                case 2:
                                    return licenseUsed[2];
                                case 100:
                                    return licenseUsed[3];
                            }
                        }
                    },
                    {sortable: true, field: 'unusedNum', title: licenseTableHeader[3]},
                    {sortable: true, field: 'licenseToTimeStr', title: licenseTableHeader[4]}
                ]
            };
            /*license manage end*/

            /*draw vectorgraph start*/
            var vectorgraphTableHeader=getRcString('vectorgraph-table-header').split(',');
            $scope.original = {
                table: {
                    tId: "originalTable",
                    detailView: true,
                    dataField: 'data',
                    url: MAP_URL + "originalMap/getOriginalMap?user_name=" + $rootScope.userInfo.user,
                    pageSize: 5,
                    pageList: [5, 10, 15, 20],
                    columns: [
                        {sortable: true, field: 'imageName', title: vectorgraphTableHeader[0]},
                        {sortable: true, field: 'breif', title: vectorgraphTableHeader[1]},
                        {sortable: true, field: 'scale', title: vectorgraphTableHeader[2]},
                        {sortable: true, field: 'address', title: vectorgraphTableHeader[3]},
                        {sortable: true, field: 'shopName', title: vectorgraphTableHeader[4]},
                        {
                            sortable: true,
                            field: 'bindLicense',
                            title: vectorgraphTableHeader[5],
                            formatter: function (val, row, index) {
                                return '<a><span class="glyphicon glyphicon-plus"></span></a>';
                            }
                        }
                    ]
                }
            };
            $http.get("../appmanage/views/" + utils.getLang() + "/originalDetail.html").success(function (data) {
                $scope.originalDetail = data;
                $scope.$on('expanded-row.bs.table#originalTable', function (e, data) {
                    $scope.detail = data.row;
                    var $ele = $compile($scope.originalDetail)($scope);
                    data.el.append($ele);
                });
            });
            $scope.$on('click-cell.bs.table#originalTable', function (e, field, value, row, $element) {
                if (field == "bindLicense") {
                    $scope.license.modalOpen();
                    $scope.bind = {
                        licenseList: [],
                        appId: parseInt(appId),
                        imageId: row.imageId
                    };
                }
            });
            var choiceLicenseTableHeader=getRcString('choice-license-table-header').split(',');
            $scope.license = {
                modal: {
                    mId: "licenseModal",
                    title: getRcString('choice-license'),
                    modalSize: "lg",
                    autoClose: false,
                    okHandler: function (modal) {
                        if ($scope.bind.licenseList.length > 0) {
                            $http.post(MAP_URL + "bitMap/bindOriginalMap", $scope.bind).success(function (data) {
                                if (data.code == 0) {
                                    $alert.noticeSuccess(getRcString('bind-success'));
                                    $scope.$broadcast("hide#licenseModal");
                                    $scope.$broadcast('refresh#bitmapTable');
                                } else {
                                    $alert.noticeDanger(getRcString('bind-fail'));
                                }
                            });
                        } else {
                            $alert.noticeDanger(getRcString('choice-license-tip'));
                        }
                    }
                },
                modalOpen: function () {
                    $http.get(LICENSE_URL + 'app/getUnuseLicense/app?app_id=' + appId).success(function (data) {
                        $scope.$broadcast("load#chooseLicense", data.data);
                        setTimeout(function () {
                            $(window).trigger('resize');
                        });
                    }).error(function (data) {
                        $alert.noticeDanger(data.message);
                    });
                    $scope.$broadcast("show#licenseModal");
                },
                table: {
                    tId: "chooseLicense",
                    showCheckBox: true,
                    dataField: 'data',
                    columns: [
                        {field: 'licenseNum', title: "license"},
                        {field: 'desc', title: choiceLicenseTableHeader[0]},
                        {field: 'payTimeStr', title: choiceLicenseTableHeader[1]}
                        // {field: 'isUsed', title: choiceLicenseTableHeader[2},
                        /*{field: 'unusedNum', title: choiceLicenseTableHeader[3}*//*,
                         {field: 'licenseToTimeStr', title: choiceLicenseTableHeader[4}*/
                    ]
                }
            };
            $scope.licenseList = [];
            $.each([
                'check.bs.table#chooseLicense', 'uncheck.bs.table#chooseLicense',
                'check-all.bs.table#chooseLicense', 'uncheck-all.bs.table#chooseLicense'
            ], function (a, b) {
                $scope.$on(this, function () {
                    $scope.$broadcast('getSelections#chooseLicense', function (data) {
                        $.each(data, function () {
                            $scope.bind.licenseList.push(this.id);
                        });
                    });
                });
            });
            /*draw vectorgraph end*/
        }];
});