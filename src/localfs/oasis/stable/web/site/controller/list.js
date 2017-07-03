define(['jquery', 'utils', 'site/libs/site_common', 'home/controller/homeCommon', 'css!site/css/sitecss', 'css!site/css/site_css'], function ($, Utils, site_common, common) {
    return ['$scope', '$http', '$alertService', '$state', '$rootScope', '$filter', '$timeout', '$q',
        function ($scope, $http, $alert, $state, $rootScope, $filter, $timeout, $q) {

            /*liuyanping lkf6877 start*/
            /*zhengchunyu kf6899 修改 限制上传格式*/
            $scope.batchAddSite = function () {
                $('#file').trigger('click');
            };
            $('#file').on('change', function (e) {
                var filepath = $('#file').val();
                var extStart = filepath.lastIndexOf(".");
                var ext = filepath.substring(extStart, filepath.length).toUpperCase();
                if (ext != ".TXT" && ext != ".XLS" && ext != ".XLSX") {
                    $alert.noticeDanger(getRcString('file-format'));
                }
                else {
                    $http({
                        url: "/v3/ace/oasis/oasis-rest-shop/restshop/fileupload/shopfileupload",
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
                        if (data.code == 0) {
                            $alert.noticeSuccess(data.message);
                            $state.go("global.content.system.site_new_log");
                        } else {
                            $alert.noticeDanger(data.message)
                        }

                    });
                }

            });
            /*liuyanping lkf6877 end*/

            function getRcString(attrName) {
                return Utils.getRcString("listView_rc", attrName);
            }

            $scope.$watch("permission", function () {
                //authorizes
                $scope.showHide = {
                    write: false,
                    devShow: false,
                    regionRead: false,
                    show: false,
                    devWrite: false
                };
                $.each($scope.permission, function () {
                    if (this.id == "site") {
                        $scope.showHide.show = true;
                        $.each(this.permission, function () {
                            if (this == "SHOP_WRITE") {
                                $scope.showHide.write = true;
                            }
                            if (this == 'DEVICE_READ') {
                                $scope.showHide.devShow = true;
                            }
                            if (this == 'REGION_READ') {
                                $scope.showHide.regionRead = true;
                            }
                            if (this == "DEVICE_WRITE") {
                                $scope.showHide.devWrite = true;
                            }
                        });
                    }
                });

                if (!$scope.showHide.show) {
                    $state.go("global.content.system.message");
                }

                $scope.contentName = null;
                $scope.topName = null;
                $scope.changeList = function (addActiveClass) {
                    if (addActiveClass == 'shop-list') {
                        $scope.flags.shop_list = true;
                        $scope.flags.sta_dev_list = false;
                        $scope.flags.irf_dev_list = false;
                        $scope.flags.dev_list = false;
                    } else if (addActiveClass == 'sta-dev-list') {
                        loadData($scope.flags.shop_of_dev_list.id);
                        $scope.flags.sta_dev_list = true;
                        $scope.flags.shop_list = false;
                        $scope.flags.irf_dev_list = false;
                        $scope.flags.dev_list = false;
                    } else if (addActiveClass == 'irf-dev-list') {
                        loadData($scope.flags.shop_of_dev_list.id);
                        $scope.flags.irf_dev_list = true;
                        $scope.flags.shop_list = false;
                        $scope.flags.sta_dev_list = false;
                        $scope.flags.dev_list = false;
                    } else {
                        loadData($scope.flags.shop_of_dev_list.id);
                        $scope.flags.dev_list = true;
                        $scope.flags.shop_list = false;
                        $scope.flags.sta_dev_list = false;
                        $scope.flags.irf_dev_list = false;
                    }
                    $('.' + addActiveClass).parents('.tab-pages').find('.active').removeClass('active');
                    $('.' + addActiveClass).addClass('active');
                };
                $scope.flags = {
                    shop_list: true,
                    sta_dev_list: false,
                    irf_dev_list: false,
                    dev_list: false,
                    show_shop_maintenance: false,
                    show_dev_maintenance: false,
                    is_fat_ap: false,
                    shop_of_dev_list: null,
                    is_branch_user: $rootScope.userRoles.accessApList == 'true',
                    branch_shop: false
                };
                var $opelist = $('.toggle_operates.shop_list');
                var $devopelist = $('.toggle_operates.dev_list');
                var groupTypeList = [];   // 缓存加载后的数据，过滤设备类型列表
                function loadDataToTable(id, data) {
                    $scope.$broadcast('load' + (id ? '#' + id : ''), data || []);
                    $scope.$broadcast('hideLoading' + (id ? '#' + id : ''));
                }

                function getDevStatus(devSnList) {
                    var defer = $q.defer();
                    // 加载设备在线信息
                    $http.post('/base/getDevs', {devSN: devSnList}, {timeout: 5000}).success(function (data) {
                        if (data && data.status == 0) {
                            defer.resolve(data.detail);
                        } else {
                            defer.reject(data);
                        }
                    }).error(function (data) {
                        defer.reject(data);
                    });
                    return defer.promise;
                }

                function devstatus(devsn, statu) {
                    //status== 0 ? online : not online
                    var status = (!devsn ? '' : statu == 0 ? getRcString("online") : getRcString("offline"));
                    var clazz = (status == getRcString("online") ? 'dev_status_base' : status == getRcString("offline") ? 'dev_status_base dev_status_unmanaged' : '');
                    return '<span ' + (clazz && 'class="' + clazz + '" ') + '></span><span>' + status + '</span>';
                }

                function refreshShopTable() {
                    $scope.$broadcast('refresh#shopList', {
                        url: sprintf(site_common.urls.URL_GET_SITES_LIST, '')
                    });
                }

                $scope.$on('load-error.bs.table', function (data) {
                    data[1] != 200 || data[1] != 304 && $alert.noticeDanger(getRcString('error'));
                });
                var shopTableData = getRcString('table-data').split(',');

                $scope.siteOptions = $.extend(true, {}, site_common.tableCommonOption, {
                    url: sprintf(site_common.urls.URL_GET_SITES_LIST, ''),
                    tId: 'shopList',
                    sortField: 'orderby', // 查询参数sort
                    sortName: 'shopName',
                    sortOrder: 'asc',
                    sidePagination: 'server',
                    operate: {
                        operates_tip: {
                            click: function (e, row, $btn) {
                                var $show_operates = $($btn.find('.fa-show_operates')[0]);
                                $show_operates.parents('tbody').find('.fa-show_operates.hover').removeClass('hover');
                                $show_operates.addClass('hover');
                                $scope.$apply(function () {
                                    var scenUrl = row.scenarioUrl;
                                    $scope.flags.show_shop_maintenance = (location.hostname != 'oasishk.h3c.com' && $scope.showHide.devShow && (scenUrl.indexOf('scene0') != -1 || scenUrl.indexOf('scene2') != -1 || scenUrl.indexOf('scene5') != -1));
                                    $scope.flags.branch_shop = row.is_branch_shop;
                                    $scope.row = row;
                                });

                                var $element = $btn.parents('td');
                                //if operates is clicked, hide .toggle_operates
                                $('#listView').unbind('click').click(function (e) {
                                    if (e.target != $element[0] && ($(e.target).parents('td')[0] != $element[0])) {
                                        $opelist.hide();
                                        $show_operates.parents('tbody').find('.fa-show_operates.hover').removeClass('hover');
                                    }
                                });
                                //operates show and hide
                                var disp = $opelist.css('display');
                                if ($opelist.$clicked == row.id && disp != 'none') {
                                    $opelist.hide();
                                    $show_operates.parents('tbody').find('.fa-show_operates.hover').removeClass('hover');
                                    $opelist.$clicked = undefined;
                                } else {
                                    $opelist.show();
                                    $opelist.$clicked = row.id;
                                }
                                //positions
                                var offset = $element.offset();
                                var height = $opelist.outerHeight();
                                var top = $opelist.css('top');
                                if (($('body').height() - offset.top) > height + 15) {
                                    top = Math.floor(offset.top) + 15 + 'px';
                                } else {
                                    top = Math.floor(offset.top) - height + 15 + 'px';
                                }
                                $opelist.css({'top': top, 'left': Math.floor(offset.left) - 125 + 'px'});

                                //the events of the operates's options
                                $opelist.undelegate('li', 'click').delegate('li', 'click', function () {
                                    var text = $(this).text();
                                    if (text == '管理') {
                                        // (row.shopUrl != site_common.urls.NO_DEVICES_URL) ? (location.href = row.shopUrl) : $alert.noticeDanger(getRcString('tipforno-devices'));
                                        if (row.shopUrl == site_common.urls.NO_DEVICES_URL) {
                                            $alert.noticeDanger(getRcString('tipforno-devices'));
                                        } else if (row.irfFlag) {
                                            $http.get(sprintf(site_common.urls.URL_GET_IRFDEVS, row.sn)).success(function (data) {
                                                if (data.code == 0 && data.data) {
                                                    $http.post(site_common.urls.URL_GET_DEVICES_STATUS, {devSN: data.data}).success(function (sta_data) {
                                                        //0 -> online   1 -> offline
                                                        if (sta_data.detail) {
                                                            $.map(sta_data.detail, function (sta_v) {
                                                                if (sta_v.status == 0) {
                                                                    row.shopUrl = row.shopUrl.replace(row.sn, sta_v.devSN);
                                                                    location.href = row.shopUrl;
                                                                }
                                                            });
                                                            location.href = row.shopUrl;
                                                        } else {
                                                            location.href = row.shopUrl;
                                                        }
                                                    }).error(function () {
                                                        location.href = row.shopUrl;
                                                    });
                                                } else {
                                                    location.href = row.shopUrl;
                                                }
                                            }).error(function () {
                                                location.href = row.shopUrl;
                                            });
                                        } else {
                                            location.href = row.shopUrl;
                                        }
                                    } else if (text == '运维') {
                                        (row.shopUrl != site_common.urls.NO_DEVICES_URL) ? (location.href = sprintf(site_common.urls.MAINTENANCE_URL_TEMPLATE, row.id, row.sn)) : $alert.noticeDanger(getRcString('tipforno-devices'));
                                    } else if (text == '显示设备') {
                                        $scope.$apply(function () {
                                            $scope.flags.shop_of_dev_list = row;
                                            $scope.flags.sta_dev_list = true;
                                            $scope.flags.shop_list = false;
                                            $scope.flags.irf_dev_list = false;
                                            $scope.flags.dev_list = false;
                                            $scope.flags.is_fat_ap = (row.scenarioId == 76);
                                        });
                                        $('.sta-dev-list').parents('.tab-pages').find('.active').removeClass('active');
                                        $('.sta-dev-list').addClass('active');
                                        loadData($scope.flags.shop_of_dev_list.id);
                                        // var isFatAp = row.scenarioId == 76 ? 1 : 0;
                                        // $state.go('global.content.system.dev_show', {
                                        //     id: row.id,
                                        //     siteUrl: row.scenarioUrl,
                                        //     content: $scope.contentName,
                                        //     topName: $scope.topName,
                                        //     isFatAp: isFatAp
                                        // });
                                    } else if (text == '编辑') {
                                        location.href = "#/global/content/system/site/add_modify/" + row.id;
                                    } else if (text == '删除') {
                                        $alert.confirm(getRcString('sure-delete'), function () {
                                            $http.delete(sprintf(site_common.urls.URL_DELETE_SITE, row.id)).success(function (data) {
                                                if (data.code) {
                                                    $alert.noticeDanger(data.message);
                                                } else {
                                                    refreshShopTable();
                                                    $alert.noticeSuccess(getRcString('delete-site') + row.shopName + getRcString('success'));
                                                }
                                            }).error(function (msg) {
                                                $alert.noticeDanger(msg || getRcString('error'));
                                            });
                                        });
                                    }
                                });
                            }
                        }
                    },
                    columns: [
                        {
                            sortable: true,
                            field: 'shopName',
                            title: shopTableData[0],
                            showTooltip: true,
                            formatter: function (val, row, index) {
                                return '<a href="#/global/content/system/site/detail/' + row.id + '">' + row.shopName.replace(/\s/g, '&nbsp;') + '</a>';
                            }
                        },
                        {field: 'createdName', showTooltip: true, title: shopTableData[1]},
                        {field: 'addrShow', showTooltip: true, title: shopTableData[2]},
                        {field: 'shopDesc', showTooltip: true, title: shopTableData[3]},
                        {field: 'regionName', showTooltip: true, title: shopTableData[4]},
                        {field: 'scenarioName', showTooltip: true, title: shopTableData[5]}
                    ],
                    queryParams: function (params) {
                        params.ascending = params.order === 'asc';
                        return params;
                    },
                    beforeAjax: function () {
                        var defer = $q.defer();
                        if (!$scope.branchData && $rootScope.userRoles.accessApList == 'true') {
                            $http({
                                method: 'POST',
                                url: '/v3/cloudapgroup',
                                data: {
                                    Method: 'getGroupNameListByRoleName',
                                    query: {
                                        userName: $rootScope.userRoles.userRoot,
                                        roleName: $rootScope.userRoles.userName
                                    }
                                }
                            }).success(function (branch_data) {
                                $scope.branchData = branch_data;
                                defer.resolve(branch_data);
                            }).error(function (error) {
                                defer.reject(error);
                            });
                        } else {
                            defer.resolve($scope.branchData);
                        }
                        return defer.promise;
                    },
                    responseHandler: function (site_data, branch_data) {
                        if (site_data && 0 == site_data.code && site_data.data && branch_data && branch_data.retCode == 0) {
                            var scenesObj = {};
                            angular.forEach(site_data.data.data, function (v, k) {
                                scenesObj[v.id] = v;

                            });
                            angular.forEach(branch_data.message, function (v, k) {
                                if (scenesObj[v.nasId]) {
                                    scenesObj[v.nasId].groupIdList = v.groupList;
                                    scenesObj[v.nasId].topId = v.topId;
                                }
                            });

                            angular.forEach(scenesObj, function (v, k) {
                                if (v.groupIdList) {
                                    v.is_branch_shop = true;
                                    $scope.$apply(function () {
                                        $scope.contentName = v.groupIdList[0].groupId;
                                        $scope.topName = v.topId;
                                    });
                                    v.shopUrl = sprintf(site_common.urls.MANAGE_URL_TEMPLATE, v.id, v.sn, v.groupIdList[0].groupId, v.topId);
                                    return v;
                                }
                            });
                        }
                        if (site_data.data) {
                            $scope.$apply(function () {
                                $scope.flags.shop_of_dev_list = site_data.data.data[0];
                            });
                            return {
                                total: site_data.data.rowCount,
                                rows: site_data.data.data
                            };
                        } else {
                            return {
                                total: 0,
                                rows: []
                            };
                        }
                    }
                });

                $scope.refreshShop = function () {
                    if ($scope.flags.shop_list) {
                        $scope.sitename = '';
                        refreshShopTable();
                    } else {
                        loadData($scope.flags.shop_of_dev_list.id);
                    }
                };

                $scope.addSite = function () {
                    if ($scope.flags.shop_list) {
                        $state.go('global.content.system.site_add_modify', {id: ''});
                    } else {
                        $scope.$broadcast('show#add_dev_model');
                    }
                };

                //search
                $('#sitename_search').keyup(function (e) {
                    if (e.which == 13) {
                        $scope.$broadcast('refresh#shopList', {
                            url: sprintf(site_common.urls.URL_GET_SITES_LIST, $scope.sitename)
                        });
                    }
                });
                $scope.search = function () {
                    $scope.$broadcast('refresh#shopList', {
                        url: sprintf(site_common.urls.URL_GET_SITES_LIST, $scope.sitename)
                    });
                };

                //destroy scope -> tootip
                $scope.$on('$destroy', function () {
                    $('[role=tooltip]').remove();
                });

                /**
                 * dev_show tab start
                 */
                var pageTitle = getRcString("table-title").split(",");
                var tableCommon = {
                    searchable: true,
                    sidePagination: 'client',
                    operate: {
                        operates_tip: {
                            click: function (e, row, $btn) {
                                var $show_operates = $($btn.find('.fa-show_operates')[0]);
                                $show_operates.parents('tbody').find('.fa-show_operates.hover').removeClass('hover');
                                $show_operates.addClass('hover');
                                var shopId = $scope.flags.shop_of_dev_list.id;
                                var siteUrl = $scope.flags.shop_of_dev_list.scenarioUrl;
                                $scope.$apply(function () {
                                    $scope.flags.show_dev_maintenance = (location.hostname != 'oasishk.h3c.com' && (siteUrl.indexOf('scene0') != -1 || siteUrl.indexOf('scene2') != -1 || siteUrl.indexOf('scene5') != -1));
                                    $scope.row = row;
                                });
                                var $element = $btn.parents('td');
                                //if operates is clicked, hide .toggle_operates
                                $('#listView').unbind('click').click(function (e) {
                                    if (e.target != $element[0] && ($(e.target).parents('td')[0] != $element[0])) {
                                        $devopelist.hide();
                                        $show_operates.parents('tbody').find('.fa-show_operates.hover').removeClass('hover');
                                    }
                                });
                                //operates show and hide
                                var disp = $devopelist.css('display');
                                if ($devopelist.$clicked == row.id && disp != 'none') {
                                    $devopelist.hide();
                                    $show_operates.parents('tbody').find('.fa-show_operates.hover').removeClass('hover');
                                    $devopelist.$clicked = undefined;
                                } else {
                                    $devopelist.show();
                                    $devopelist.$clicked = row.id;
                                }
                                //positions
                                var offset = $element.offset();
                                var height = $devopelist.outerHeight();
                                var top = $devopelist.css('top');
                                if (($('body').height() - offset.top) > height + 15) {
                                    top = Math.floor(offset.top) + 15 + 'px';
                                } else {
                                    top = Math.floor(offset.top) - height + 15 + 'px';
                                }
                                $devopelist.css({'top': top, 'left': Math.floor(offset.left) - 125 + 'px'});
                                //the events of the operates's options
                                $devopelist.undelegate('li', 'click').delegate('li', 'click', function () {
                                    var text = $(this).text();
                                    if (text == '管理') {
                                        if ($scope.contentName && $scope.topName) {
                                            location.href = sprintf(site_common.urls.MANAGE_URL_TEMPLATE, row.shopId, row.devSn, $scope.contentName, $scope.topName);
                                        } else {
                                            location.href = siteUrl && siteUrl.indexOf('$sn$') != -1 ? siteUrl.replace(/\$sn\$/, row.devSn).replace(/\$shopId\$/, shopId) : siteUrl;
                                        }
                                    } else if (text == '运维') {
                                        location.href = sprintf(site_common.urls.MAINTENANCE_URL_TEMPLATE, row.shopId, row.devSn);
                                    } else if (text == '编辑') {
                                        $scope.$apply(function () {
                                            $scope.dev.devAlias = row.devAlias;
                                            $scope.old_devAlias = row.devAlias;
                                            $scope.dev.id = row.id;
                                        });
                                        $scope.$broadcast('show#modify_dev_alias_model');
                                    } else if (text == '删除') {
                                        $alert.confirm(getRcString('sure-delete'), function () {
                                            $http.delete(sprintf(site_common.urls.URL_DELETE_DEV, row.id)).success(function (data) {
                                                if (data.code == 0) {
                                                    $alert.noticeSuccess(getRcString('delete-device') + row.devSn + getRcString('success'));
                                                } else {
                                                    $alert.noticeDanger(data.message);
                                                }
                                                loadData($scope.flags.shop_of_dev_list.id); //  reload data
                                            }).error(function (msg) {
                                                $alert.noticeDanger(msg || getRcString('error'));
                                            });
                                        });
                                    }
                                });
                            }
                        }
                    }
                };
                var commonInst = common({$q: $q, $http: $http});
                //add_dev_model
                $scope.addDev = {devType: '1', optType: '0', irfName: '', isIRF: false};
                $scope.$on('show.bs.modal#add_dev_model', function () {
                    $scope.addDev.groupTypeList = groupTypeList;
                });
                var topGroupId;
                $scope.devtype = [
                    {"name": getRcString("w-device"), "value": "1"},
                    {"name": getRcString("x-device"), "value": "4"}
                ];
                //yanch get ap groups
                if ($scope.flags.is_fat_ap) {
                    $http.post(site_common.urls.URL_AP_GROUP, {
                        Method: "getCloudApgroupNameList",
                        query: {
                            userName: userName,
                            nasId: $scope.flags.shop_of_dev_list.id
                        }
                    }).success(function (data) {
                        topGroupId = data.message.groupId;
                    }).error(function (msg) {
                        $alert.noticeDanger(msg || getRcString('error'));
                    });

                    function ajaxReqApIntoGroup(groupId, apSN, acSN) {
                        $http.post(site_common.urls.URL_AP_GROUP, {
                            Method: 'setApsnData',
                            query: {
                                groupId: groupId
                            },
                            data: [{
                                apSN: apSN,
                                acSN: acSN
                            }]
                        }).success(function (data) {
                            if (!data) return;
                            if (data.retCode == 0) {

                            } else {
                                $alert.noticeDanger(data.message);
                            }
                        }).error(function (msg) {
                            console.info(msg);
                        });
                    }
                }
                $scope.add_dev_model = {
                    mId: 'add_dev_model',
                    title: getRcString('add-device'),
                    autoClose: false,
                    okHandler: function (modal) {
                        // if (isCompleted) {
                        $scope.$broadcast('disabled.ok#add_dev_model');
                        var addDev = $scope.addDev,
                            // 只能添加一个设备
                            devs = {
                                shopId: $scope.flags.shop_of_dev_list.id,
                                data: [{
                                    optType: addDev.optType,
                                    devices: [{
                                        devAlias: addDev.devAlias,
                                        devSn: addDev.devSn,
                                        devType: addDev.devType
                                    }]
                                }]
                            },
                            // 添加的设备信息
                            dev = devs.data[0];

                        // 判断设备sn是否已经存在
                        commonInst.checkSnIsExist([], addDev.devSn).then(function () {
                            if (addDev.isIRF) {
                                dev.groupType = 'IRF';
                                if (addDev.groupId == '-1') {  //  新增
                                    dev.groupName = addDev.groupName;
                                    dev.optType = 1;
                                } else {  //  添加到已存在
                                    dev.groupId = addDev.groupId;
                                    dev.optType = 2;
                                }
                            }

                            //TODO
                            $http.post(site_common.urls.URL_POST_ADD_DEV, JSON.stringify(devs)).success(function (data) {
                                if ($scope.isFatAp == 1) {
                                    if (topGroupId) {
                                        ajaxReqApIntoGroup(topGroupId, addDev.devSn, addDev.devSn);
                                    } else {
                                        $http.post(site_common.urls.URL_AP_GROUP, {
                                            Method: "getCloudApgroupNameList",
                                            query: {
                                                userName: userName,
                                                nasId: $scope.flags.shop_of_dev_list.id
                                            }
                                        }).success(function (data) {
                                            topGroupId = data.message.groupId;
                                            ajaxReqApIntoGroup(topGroupId, addDev.devSn, addDev.devSn);
                                        }).error(function (msg) {
                                            $alert.noticeDanger(msg || getRcString('error'));
                                        });
                                    }
                                }

                                if (data.code == 0) {
                                    modal.hide();
                                    $alert.noticeSuccess(getRcString('add-success'));
                                    loadData($scope.flags.shop_of_dev_list.id);
                                } else {
                                    $alert.noticeDanger(data.message);
                                }
                                $scope.$broadcast('enable.ok#add_dev_model');
                            }).error(function (msg) {
                                $alert.noticeDanger(msg || getRcString('error'));
                                $scope.$broadcast('enable.ok#add_dev_model');
                            });
                        }, function (msg) {
                            $alert.noticeDanger(msg);
                            $scope.$broadcast('enable.ok#add_dev_model');
                        });
                        // } else {
                        //     $scope.$broadcast('hide#add_dev_model');
                        //     $scope.$broadcast('show#completeInfo');
                        // }
                    }
                };
                $scope.adddev = function () {
                    $scope.addDev.devType = $scope.devtype[0].value;
                    $scope.$broadcast('show#add_dev_model');
                };
                //  close modal and reset form
                $scope.$on('hidden.bs.modal#add_dev_model', function () {
                    $scope.$apply(function () {
                        $scope.addDev.devAlias = '';
                        $scope.addDev.devSn = '';
                        $scope.addDev.isIRF = false;
                        $scope.addDev.groupName = '';
                        $scope.addDev.groupId = '-1';
                        $scope.addDev.devType = $scope.devtype[0].value;
                        // reset form
                        $scope.devAddForm.$setPristine();
                        $scope.devAddForm.$setUntouched();
                    });
                });
                /**
                 * 新增设备表单禁用或启动按钮
                 */
                function setAddModalOkDisabled() {
                    var dev = $scope.addDev, invalid = $scope.devAddForm.$invalid, disabled;
                    // 如果是IRF设备需要手动判断
                    dev.isIRF && (disabled = dev.groupId == -1 ? !dev.groupName : !dev.groupId);
                    $scope.$broadcast((disabled || invalid ? 'disabled' : 'enable') + '.ok#add_dev_model');
                }

                // 新增设备
                $scope.$watch('devAddForm.$invalid', setAddModalOkDisabled);
                $scope.$watch('addDev', setAddModalOkDisabled, true);
                $scope.irfOptions = $.extend(true, {}, site_common.tableCommonOption, tableCommon, {
                    tId: 'irfTable',
                    columns: [
                        {field: 'groupName', title: pageTitle[0]},
                        {searcher: {type: 'text'}, field: 'devAlias', title: pageTitle[1], link: true},
                        {field: 'devSn', title: pageTitle[2]},
                        {field: 'devModel', title: pageTitle[4]},
                        {
                            field: 'status', title: pageTitle[5],
                            formatter: function (value, row) {
                                return devstatus(row.devSn, value);
                            }
                        }
                    ]
                });
                $scope.options = $.extend(true, {}, site_common.tableCommonOption, tableCommon, {
                    columns: [
                        {searcher: {type: 'text'}, field: 'devAlias', title: pageTitle[1], link: true},
                        {field: 'devSn', title: pageTitle[2]},
                        {field: 'devModel', title: pageTitle[4]},
                        {
                            field: 'status', title: pageTitle[5],
                            formatter: function (value, row) {
                                return devstatus(row.devSn, value);
                            }
                        }
                    ]
                });
                function loadData(shopId) {
                    var devSnList = []; //  初始化设备SN列表
                    $timeout(function () {
                        $scope.$broadcast('showLoading');
                        $scope.$broadcast('showLoading#irfTable');
                    });
                    $http.get(sprintf(site_common.urls.URL_GET_DEV_LIST, shopId)).success(function (data) {
                        // data {code,data,devices}
                        var tableData = [], newTableData = [];
                        var irfTableData = [], newIrfTableData = [];
                        if (data && data.code == 0) {
                            $.each(data.data, function () {
                                var item = this;
                                if (item.devices) {
                                    $.each(item.devices, function () {
                                        var devItem = $.extend(true, {
                                            groupId: item.groupId,
                                            groupName: item.groupName,
                                            groupType: item.groupType,
                                            statusStr: item.statusStr
                                        }, this);
                                        devItem.status = this.status == 1 ? 0 : 1;
                                        devItem.devTypeStr = this.devType == 4 ? getRcString('x-device') : getRcString('w-device');
                                        this.addTime && (devItem.addTime = $filter('date')(new Date(this.addTime), 'yyyy-MM-dd HH:mm:ss'));
                                        devSnList.push(devItem.devSn);
                                        if (devItem.groupType == 'IRF') {
                                            irfTableData.push(devItem);
                                        } else {
                                            tableData.push(devItem);
                                        }
                                    });
                                }
                            });
                            groupTypeList = $.map(data.data, function (d) {
                                if (d.groupType == 'IRF') {
                                    return {id: d.groupId, name: d.groupName};
                                }
                            });
                        } else {
                            groupTypeList = [];
                        }

                        //  TODO  加载设备在线状态
                        getDevStatus(devSnList).then(function (statusList) {
                            $.each(statusList, function (i, sta) {
                                $.each(tableData, function (j, t) {
                                    if (t.devSn == sta.devSN) {
                                        t.status = sta.status;
                                        newTableData.push(t);
                                    }
                                });
                                $.each(irfTableData, function (j, t) {
                                    if (t.devSn == sta.devSN) {
                                        t.status = sta.status;
                                        newIrfTableData.push(t);
                                    }
                                });
                            });
                            loadDataToTable(null, newTableData);
                            loadDataToTable('irfTable', newIrfTableData);
                        }, function () {
                            loadDataToTable(null, tableData);
                            loadDataToTable('irfTable', irfTableData);
                        });

                    }).error(function (msg) {
                        groupTypeList = [];
                        loadDataToTable();
                        loadDataToTable('irfTable');
                        $alert.noticeDanger(msg || getRcString('error'));
                    });
                }

                function showDetails(e, field, value, row, $td) {
                    if (field == "devAlias") {
                        $scope.detail = row;
                        $scope.$broadcast('show#detailModal');
                    }
                }

                $scope.detailModal = {
                    mId: 'detailModal',
                    showCancel: false,
                    okText: getRcString('close-text'),
                    title: getRcString('dev-detail')
                };
                $scope.$on('click-cell.bs.table', showDetails);
                $scope.$on('click-cell.bs.table#irfTable', showDetails);
                //modify_dev_alias
                $scope.dev = {};
                $scope.modify_dev_alias_model = {
                    mId: 'modify_dev_alias_model',
                    title: getRcString('reset-alias'),
                    autoClose: false,
                    okDisabledFlag: 'modAlias.$invalid',
                    okHandler: function (modal) {
                        var modifyDevAlias = {
                            devAlias: $scope.dev.devAlias || $scope.old_devAlias,
                            id: +$scope.dev.id,
                            shopId: $scope.flags.shop_of_dev_list.id
                        };
                        $http.put(sprintf(site_common.urls.URL_POST_MODIFY_DEV_ALIAS), JSON.stringify(modifyDevAlias)).success(function (data) {
                            if (data.code == 0) {
                                modal.hide();
                                $alert.noticeSuccess(getRcString('alias-success'));
                                loadData($scope.flags.shop_of_dev_list.id);
                            } else {
                                $alert.noticeDanger(data.message);
                            }
                        }).error(function (msg) {
                            $alert.noticeDanger(msg || getRcString('error'));
                        });
                    }
                };
                //  close modal and reset form
                $scope.$on('hidden.bs.modal#modify_dev_alias_model', function () {
                    $scope.$apply(function () {
                        // reset form
                        $scope.modAlias.$setPristine();
                        $scope.modAlias.$setUntouched();
                    });
                });
                $scope.$watch('modAlias.$invalid', function (v) {
                    $scope.$broadcast((v ? 'disabled' : 'enable') + '.ok#modify_dev_alias_model');
                });

                // 批量增加设备

                $scope.batchAddSite = function () {
                    $('#file').trigger('click');
                };
                $('#file').on('change', function (e) {
                    $http({
                        url: "/v3/ace/oasis/oasis-rest-shop/restshop/fileupload/devicefile?shop_id=" + shopId,
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
                        if (data.code == 0) {
                            $alert.noticeSuccess(data.message);
                            $state.go('^.dev_new_log', {shopid: shopId})
                        } else {
                            $alert.noticeDanger(data.message)
                        }
                    });
                });
            });
        }];
});