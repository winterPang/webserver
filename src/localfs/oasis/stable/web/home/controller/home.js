/**
 * controller home
 */
define(['jquery', 'utils', 'async', 'echarts3', 'jqueryZtree', './homeCommon', 'bootstrapValidator', 'css!home/css/home', 'css!frame/libs/ztree/css/zTreeStyle', 'sprintf', 'home/libs/jsAddress', 'home/directive/home_site'],
    function ($, Utils, async, echarts, jqueryZtree, common) {
        return ['$scope', '$rootScope', '$http', '$q', '$alertService', '$timeout', function ($scope, $rootScope, $http, $q, $alert, $timeout) {
            function getRcString(attrName) {
                return Utils.getRcString("home_rc", attrName);
            }

            var URL_POST_ADD_SITE = common.url.URL_POST_ADD_SITE,
                URL_POST_ADD_DEV = common.url.URL_POST_ADD_DEV,
                URL_DELETE_DEV = common.url.URL_DELETE_DEV,
                URL_DELETE_AREA = common.url.URL_DELETE_AREA,
                URL_ADD_AREA = common.url.URL_ADD_AREA,
                URL_MODIFY_AREA = common.url.URL_MODIFY_AREA,
                URL_GET_TREE = common.url.URL_GET_TREE,
                URL_POST_MODIFY_SHOP = common.url.URL_POST_MODIFY_SHOP,
                URL_GET_ALL_INDUSTRY_NAME = common.url.URL_GET_ALL_INDUSTRY_NAME,
                URL_VALID_SHOP_NAME = common.url.URL_VALID_SHOP_NAME,
                URL_ADD_MULTI_DEVICE = common.url.URL_ADD_MULTI_DEVICE;
            var URL_GET_SITES_HEALTH = '/v3/health/home/siteHealth?scenarioId=%s';
            var URL_POST_SITES_HEALTH = '/v3/ant/oasishealth';
            var URL_GET_PLACE_INFO_LIST = '/v3/ace/oasis/oasis-rest-shop/restshop/regioninfo/regionshoppage/%d/%d/%d/id/true/undefined';
            var MENU_URL_TEMPLATE = "https://oasisrd.h3c.com/oasis/stable/web/frame/index.html#/scene%d/nasid%d/devsn%s/content%stopName%s/monitor/dashboard15";

            var URL_AP_GROUP = '/v3/cloudapgroup';

            common = common.initLocale({
                addDevTitle: getRcString('addDevTitle').split(','),
                errorMsg: getRcString('data'),
                supportText: getRcString('support')
            });
            var firstLoad = true;
            //request table data
            $scope.reqTableData = function (tableRegion) {
                if (firstLoad) {
                    return;
                }
                $scope.table_data = [];
                $scope.table_data_new = [];
                $scope.table_scenarioId = [];
                var getInfoUrl = sprintf(URL_GET_PLACE_INFO_LIST, tableRegion, 1, 300);
                $http.get(getInfoUrl).success(function (data) {
                    if ($scope.branchData) {
                        getSiteHealth(data, $scope.branchData);
                    } else if ($rootScope.userRoles.accessApList == 'true') {
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
                        }).success(function (branchdata) {
                            if (data.retCode == 0) {
                                $scope.branchData = branchdata;
                            }
                            getSiteHealth(data, branchdata);
                        }).error(function (msg) {
                            $alert.msgDialogError(msg);
                        })
                    } else {
                        getSiteHealth(data, $scope.branchData);
                    }
                    function getSiteHealth(sitedata, branchdata) {
                        var sceneDataArr = [];
                        if (sitedata && 0 == sitedata.code && branchdata && branchdata.retCode == 0) {
                            var scenesObj = {};
                            angular.forEach(sitedata.data.data, function (v, k) {
                                scenesObj[v.shopId] = v;

                            });
                            angular.forEach(branchdata.message, function (v, k) {
                                if (scenesObj[v.nasId]) {
                                    scenesObj[v.nasId].groupIdList = v.groupList.concat();
                                    scenesObj[v.nasId].topId = v.topId;
                                    /* angular.forEach(v.groupList, function (vGroup, k) {
                                     scenesObj[v.nasId].groupIdList.push(vGroup.groupId);
                                     });*/
                                }
                            });

                            angular.forEach(scenesObj, function (v, k) {
                                if (v.groupIdList) {
                                    v.is_branch_shop = true;
                                    v.menuUrl = sprintf(MENU_URL_TEMPLATE, 15, v.shop.shopId, v.shop.sn, v.groupIdList[0].groupId, v.topId).replace('oasisrd.h3c.com', location.hostname);
                                }
                                sceneDataArr.push(v);
                            });

                        } else {
                            sceneDataArr = sitedata.data.data;
                        }
                        $scope.reqSitesIds = $.map(sceneDataArr, function (v, i) {
                            $scope.table_data.push({
                                'shopName': v.shopName,
                                'menuUrl': v.menuUrl,
                                'shopId': v.shopId,
                                'scenarioType': v.scenarioType,
                                'irfFlag': v.shop && v.shop.irfFlag,
                                'sn': v.shop && v.shop.sn,
                                'shop': v.shop,
                                'isbranchshop': v.is_branch_shop
                            });
                            return v.shopId;
                        }).join(',');
                        $.each(sceneDataArr, function (i, v) {
                            $scope.table_scenarioId.push(v.shopId);
                        });
                        $http.post(URL_POST_SITES_HEALTH, JSON.stringify({
                            method: "scenarioHealth",
                            scenarioId: $scope.table_scenarioId
                        })).success(function (data) {
                            if (!data.Info) {
                                return;
                            }
                            $.map($scope.table_data, function (val, idx) {
                                $.map(data.Info, function (v, i) {
                                    if (val.shopId == v.scenarioId) {
                                        if (val.scenarioType == 'router') {
                                            v.info.routerOnline = v.info.apOnline;
                                            v.info.routerOffline = v.info.apOffline;
                                            v.info.apOnline = '-';
                                            v.info.apOffline = '-';
                                            v.info.client = '-';
                                        } else if (val.scenarioType == 'WLAN' || val.scenarioType == 'wlan') {
                                            v.info.routerOnline = '-';
                                            v.info.routerOffline = '-';
                                        }
                                        if (v.retcode != 0) {
                                            v.info.score = '-';
                                            v.info.upSpeed = '-';
                                            v.info.downSpeed = '-';
                                            v.info.client = '-';
                                            v.info.routerOnline = '-';
                                            v.info.routerOffline = '-';
                                            v.info.apOnline = '-';
                                            v.info.apOffline = '-';
                                        }
                                        $scope.table_data_new.push($.extend(true, {}, val, v.info));
                                    }
                                });
                            });
                            $scope.$broadcast('load', $.grep($scope.table_data_new, function (item) {
                                return item.shopName;
                            }));
                        });
                    }
                }).error(function (msg) {
                    $alert.msgDialogError(msg);
                    $scope.$broadcast('load', []);
                });
            };

            $scope.$watch('region', function (v, oldVal) {
                $scope.tableRegion = v;
                v && $('.table_view').css('display') == 'block' && $scope.reqTableData(v);
                v && (firstLoad = false);
            });

            var treeData = [];
            var setting = {};
            // Initialize public instance
            var commonInst = common({$q: $q, $http: $http});
            // 点击新增区域的treeNode
            $scope.treeNode = {};
            // 新增场所modal数据
            $scope.addDev = {devType: '1', isIRF: false, groupName: '', groupId: '-1'};
            // 点击的叶子节点
            $scope.clickedNode = {};

            //  =========================新增区域开始==============================


            $scope.addSite = function () {
                $scope.$broadcast('show#addShop');
            };

            // 添加第二页显示的表格
            $scope.options = common.table.devModelSupportList;
            // 添加场所的表单数据
            $scope.row = {};
            // 支持的设备类型
            $scope.$watch('row.scenario_category_name', function (val) {
                $scope.addDev.scence = val;
                if (val) {
                    $scope.$broadcast('refresh#devModelList', {
                        url: "/v3/ace/oasis/oasis-rest-device/restdevice/devicemodel/getdevModels/?seceneId=" + val + "&queryCondition="
                    });
                } else {
                    $scope.$broadcast("load#devModelList", []);
                }
            });
            // 添加完设备的表格

            $scope.addOptions = common.table.devModelList;
            // 删除添加好的设备

            $scope.$on('click-cell.bs.table#addDev', function (e, field, value, row, $element) {
                if (field == "del") {
                    $.each($scope.devices, function (i, item) {
                        item.devices = $.grep(item.devices, function (dev) {
                            return dev.devSn != row.devSn;
                        });
                    });
                    if ($scope.$$phase) {
                        $scope.dispDevsTable = $.grep($scope.dispDevsTable, function (r) {
                            return row.devSn != r.devSn;
                        });
                    } else {
                        $scope.$apply(function () {
                            $scope.dispDevsTable = $.grep($scope.dispDevsTable, function (r) {
                                return row.devSn != r.devSn;
                            });
                        });
                    }
                    $scope.$broadcast('load#addDev', $scope.dispDevsTable);
                }
            });

            // 添加完成显示的设备列表
            $scope.addOptions2 = common.table.devModelResultList;
            // 添加的设备列表
            $scope.devices = [];

            $scope.dispDevsTable = [];
            // 为了清空表单，需要将表单绑定到对象上
            $scope.forms = {};
            // 将填写的所有设备信息发送到后台
            function postDevInfo() {
                // 向后台发送的数据
                var defer = $q.defer();
                // 组装数据
                var data = {
                    shopId: $scope.reponse_shopId,
                    data: $scope.devices  //   显示所有新增的设备信息
                };
                $http.post(sprintf(URL_POST_ADD_DEV), JSON.stringify(data)).success(function (data) {
                    if (data && data.code == 0) {
                        $scope.devId = data.data;
                        defer.resolve();
                    } else {
                        defer.reject(data ? data.message : getRcString('add-error'));
                    }
                }).error(defer.reject);
                return defer.promise;
            }

            $scope.groupNameList = [];
            $scope.$watch('dispDevsTable', function (data) {
                $.each(data, function () {
                    if (this.groupName != getRcString('single-group') && $scope.groupNameList.indexOf(this.groupName) == -1) {
                        $scope.groupNameList.push(this.groupName);
                    }
                });
                // console.debug($scope.groupNameList);
            }, true);
            // 点击添加设备按钮
            $scope.addDevModel = function () {

                if (!$scope.addDev.devAlias || !$scope.addDev.devSn) {
                    return;
                }
                //判断设备在该场所下是否已经存在
                commonInst.checkSnIsExist($scope.dispDevsTable, $scope.addDev.devSn).then(function () {
                    var groupExist = false,
                        addDev = $scope.addDev,
                        dev = {devAlias: addDev.devAlias, devType: addDev.devType, devSn: addDev.devSn};
                    $.each($scope.devices, function () {
                        var groupName = this.groupName,
                            optType = this.optType;
                        if (addDev.isIRF) {
                            // 判断groupName是否相同，相同则归类为同一个组
                            if (groupName == addDev.groupName) {
                                this.devices.push(dev);
                                $scope.dispDevsTable.push($.extend(true, {groupName: groupName}, dev));
                                groupExist = true;
                            }
                        } else { //  此处一定是独立设备
                            if (optType == 0) {
                                this.devices.push(dev);
                                $scope.dispDevsTable.push($.extend(true, {groupName: getRcString('single-group')}, dev));
                                groupExist = true;
                            }
                        }
                    });
                    if (!groupExist) { //  一次都没添加过
                        (function () {
                            var irf = addDev.isIRF;
                            var groupName = addDev.groupName;
                            $scope.devices.push({
                                optType: irf ? 1 : 0,
                                groupType: irf ? 'IRF' : 'DAFAULT',
                                groupName: irf ? groupName : '',
                                devices: [dev]
                            });
                            $scope.dispDevsTable.push($.extend(true, {groupName: irf ? groupName : getRcString('single-group')}, dev));
                        })();
                    }
                    $scope.$broadcast('load#addDev', $scope.dispDevsTable);

                    $(window).trigger('resize');

                }, function (msg) {
                    $alert.noticeDanger(msg);
                });
            };
            $scope.validShopName = {
                url: URL_VALID_SHOP_NAME + '{value}',
                method: 'get',
                live: 0.8,
                validFn: function (resp) {
                    if (resp.code == 0 || resp.code == 1) {
                        return true;
                    } else {
                        return resp.code;
                    }
                }
            };

            $scope.$on('shown.bs.modal#addShop', function () {
                $http.get(URL_GET_ALL_INDUSTRY_NAME).success(function (data) {
                    if (data && data.code == 0) {
                        $scope.industry = data.data;
                        if (data.data && data.data[0]) {
                            $scope.row.owned_industry = data.data[0].id;
                        }
                    } else {
                        $alert.noticeDanger(data.message);
                    }
                });
            });

            function showForm(num, apply) {
                if (apply) {
                    $scope.$apply(function () {
                        $scope.form.showForm = num;
                    });
                } else {
                    $scope.form.showForm = num;
                }
                $(window).trigger('resize');
            }

            $scope.$watch('form.showForm', function () {
                $timeout(function () {
                    $(window).trigger('resize');
                });
            });

            $scope.form = {
                showForm: 1,
                option: {
                    mId: 'addShop',
                    autoClose: false,
                    showHeader: false,
                    showFooter: false,
                    beforeRender: function ($ele) {
                        $ele.find('button[name=cancel]').on('click', function () {
                            $scope.$broadcast('hide#addShop');
                            $scope.$broadcast('regionRefresh')
                        });

                        $scope.$province = $("#cmbProvince");
                        $scope.$city = $("#cmbCitys");
                        $scope.$district = $("#cmbArea");
                        //sanjiliandong
                        initAddress(function (p) {
                            $scope.$apply(function () {
                                $scope.row.province = p;
                            });
                            $('#cmbProvince').val(p).trigger('change');
                            $('#cmbCitys').trigger('change');
                        }, Utils.getLang());
                        $ele.find('button[name=cancel]').on('click', function () {
                            showForm(1, true);
                            $scope.row = {};
                            $scope.addDev = {devType: '1', isIRF: false, groupName: '', groupId: '-1'};
                            $scope.devices = [];
                        });
                        $ele.find('button[name=next1]').on('click', function () {
                            showForm(2, true);
                            $http.get('/v3/ace/oasis/oasis-rest-device/restdevice/scenario/getAllScenario').success(function (data) {
                                $scope.scens = data.data.data;
                                $.map($scope.scens, function (v) {
                                    v.namedesc = v.name + '(' + v.desc + ')';
                                });
                                //初始化场景分类
                                $scope.row.scenario_category_name = $scope.scens[0].id;
                            });

                        });

                        $ele.find('button[name=prev1]').on('click', function () {
                            showForm(1, true);
                        });
                        $ele.find('button[name=next2]').on('click', function () {
                            var $btn = $(this);
                            var add_data = {
                                shopName: $scope.row.shopName,
                                shopDesc: $scope.row.shopDesc,
                                phone: $scope.row.phone,
                                industryId: $scope.row.owned_industry,
                                scenarioId: $scope.row.scenario_category_name,
                                regionId: $scope.region,
                                province: $("#cmbProvince").val(),
                                city: $("#cmbCitys").val(),
                                district: $("#cmbArea").val(),
                                addrDetail: $scope.row.address
                            };
                            var modifyShop_data = {
                                id: $scope.reponse_shopId,
                                shopName: $scope.row.shopName,
                                regionId: $scope.region,
                                industryId: $scope.row.owned_industry,
                                scenarioId: $scope.row.scenario_category_name,
                                addrDetail: $scope.row.address,
                                city: $("#cmbCitys").val(),
                                district: $("#cmbArea").val(),
                                province: $("#cmbProvince").val()
                            };

                            $btn.attr('disabled', 'disabled');
                            if ($scope.reponse_shopId) {
                                // modifyShop
                                $http.post(sprintf(URL_POST_MODIFY_SHOP), JSON.stringify(modifyShop_data), {headers: {"Content-Type": "application/json;charset=UTF-8"}}).success(function (data) {
                                    if (data && data.code == 0) {
                                        showForm(3);
                                        $alert.noticeSuccess(data.message);
                                    } else {
                                        $alert.noticeDanger(data.message);
                                    }
                                    $btn.removeAttr('disabled');
                                }).error(function () {
                                    $btn.removeAttr('disabled');
                                });
                            } else {
                                // addShop
                                $http.post(sprintf(URL_POST_ADD_SITE), JSON.stringify(add_data), {headers: {"Content-Type": "application/json;charset=UTF-8"}}).success(function (data) {
                                    if (data && data.code == 0) {
                                        showForm(3);
                                        $scope.reponse_shopId = data.data;
                                        $alert.noticeSuccess(getRcString('add-shop-sucess'));
                                    } else {
                                        $alert.noticeDanger(getRcString('add-shop-error'));
                                    }
                                    $btn.removeAttr('disabled');
                                }).error(function (msg) {
                                    $alert.noticeDanger(msg || getRcString("error"));
                                    $btn.removeAttr('disabled');
                                });
                            }
                        });
                        $ele.find('button[name=prev2]').on('click', function () {
                            showForm(2, true);
                        });
                        // TODO  fatap
                        $ele.find('button[name=next3]').on('click', function () {
                            postDevInfo().then(function () {
                                $scope.row.addr = $scope.$province.val() +
                                    $scope.$city.val() +
                                    $scope.$district.val();
                                // fat  ap才会请求
                                if ($scope.row.scenario_category_name == 76) {
                                    $http.post(URL_AP_GROUP, {
                                        Method: 'setGroupName',
                                        query: {
                                            userName: $scope.userInfo.user,
                                            nasId: $scope.reponse_shopId,
                                            parentId: '',
                                            alias: '总部'
                                        }
                                    }).success(function (data) {
                                        if (!data) return;
                                        if (data.retCode == 0) {
                                            $http.post(URL_AP_GROUP, {
                                                Method: 'setApsnData',
                                                query: {
                                                    groupId: data.message.groupId
                                                },
                                                data: $.map($scope.dispDevsTable, function (item) {
                                                    return {apSN: item.devSn, acSN: item.devSn};
                                                })
                                            }).success(function (data) {
                                                if (!data) return;
                                                if (data.retCode == 0) {

                                                } else {
                                                    $alert.noticeDanger(data.message);
                                                }
                                                //  显示最后的结果
                                                showForm(4);
                                            }).error(function (data) {
                                                console.log(data);
                                                //  显示最后的结果
                                                showForm(4);
                                            });
                                        } else {
                                            $alert.noticeDanger(data.message);
                                            //  显示最后的结果
                                            showForm(4);
                                        }
                                    }).error(function (data) {
                                        console.log(data);
                                        //  显示最后的结果
                                        showForm(4);
                                    });
                                } else {
                                    showForm(4);
                                }
                                $alert.noticeSuccess(getRcString('add-sucess'));
                            }, function (msg) {
                                //$alert.noticeDanger(msg);
                                $alert.noticeDanger(getRcString('add-dev-msg'));
                            });
                        });
                        $ele.find('button[name^=prev],button[name^=next]').on('click', function () {
                            $(window).trigger('resize');
                        });
                        $scope.$on('load-success.bs.table#devModelList', function () {
                            $(window).trigger('resize');
                        });
                    }
                }
            };

            $scope.addDev.devAddBtnDisabled = true;

            // 监听添加按钮是否是 禁用状态
            function setAddModalOkDisabled() {
                var dev = $scope.addDev, invalid = $scope.forms.form3.$invalid, disabled;
                // 如果是IRF设备需要手动判断
                dev.isIRF && (disabled = dev.groupId == -1 ? !dev.groupName : !dev.groupId);
                $scope.addDev.devAddBtnDisabled = disabled || invalid;
            }

            // 新增设备
            $scope.$watch('devAddForm.$invalid', setAddModalOkDisabled);
            $scope.$watch('addDev', setAddModalOkDisabled, true);
            //关闭大加号模态框并初始化操作
            $scope.$on('hidden.bs.modal#addShop', function (e, $ele) {
                showForm(1);
                $scope.row.shopName = "";
                $scope.province = "";
                $scope.city = "";
                $scope.area = "";
                $scope.row.address = "";
                $scope.row.phone = "";
                $scope.row.shopDesc = "";
                $scope.reponse_shopId = '';
                $scope.owned_industry = "";

                $scope.groupNameList = []; //  Clear Group Names
                $scope.dispDevsTable = []; // Clear DevTable

                $scope.row.scenario_category_name = '';

                $scope.addDev.devAlias = '';
                $scope.addDev.devSn = '';
                // 替换为默认值
                $scope.addDev.isIRF = false;
                $scope.addDev.groupName = '';
                $scope.addDev.groupId = '-1';
                $scope.addDev.devAddBtnDisabled = true;
                $scope.$broadcast("load#addDev", []);
                $scope.devices = [];

                // 重置表单
                var forms = ['form1', 'form2', 'form3', 'form4'];
                $.each(forms, function () {
                    $scope.forms[this].$setPristine();
                    $scope.forms[this].$setUntouched();
                });


                $scope.$apply();
            });

            $scope.$watch('searchText', function (v) {
                if (v !== undefined) {
                    if (v === '') {
                        loadZtree(setting, treeData);
                    } else {
                        var data = [].concat(treeData);
                        data = $.grep(data, function (item) {
                            return item.name.indexOf(v) != -1;
                        });
                        loadZtree(setting, $.map(data, function (item) {
                            return {
                                id: item.id,
                                name: item.name,
                                ownerId: item.ownerId
                            };
                        }));
                    }

                }
            });

            //  =========================新增区域结束==============================

            //===========================ztree配置=========================
            $scope.$watch("permission", function (perm) {
                if (perm) {
                    var p = $.grep(perm, function (o) {
                        return o.id == 'home';
                    });
                    p = p[0].permission;

                    //["SHOP_READ", "SHOP_WRITE", "DEVICE_READ", "DEVICE_WRITE", "REGION_READ", "REGION_WRITE"]
                    // 初始化ztree的配置
                    function hasPermission(key) {
                        return p.indexOf(key) != -1;
                    }

                    // 区域可读可写
                    // var REGION_READ = false;
                    var REGION_READ = hasPermission('REGION_READ');
                    var REGION_WRITE = hasPermission('REGION_WRITE');
                    // var SHOP_WRITE = false;
                    var SHOP_WRITE = hasPermission('SHOP_WRITE');
                    // var REGION_WRITE = false;

                    // 全局权限
                    $scope.NO_PERMISSION = false;

                    // 可读则显示首页，不可读不显示首页
                    $scope.REGION_READ = REGION_READ;

                    $scope.SHOP_WRITE = SHOP_WRITE;

                    if (!REGION_READ) {
                        // 直接返回
                        return;
                    }
                    function addHoverDom(treeId, treeNode) {
                        if (REGION_WRITE) {
                            var $btn = $("#addBtn_" + treeNode.tId);
                            var $treeNodeNameSpan = $("#" + treeNode.tId + "_span");
                            if (!$btn.length) {
                                $btn = $(sprintf("<span class='button add' id='addBtn_%s' title=" + getRcString('add-region') + " onfocus='this.blur();'></span>", treeNode.tId));
                                $treeNodeNameSpan.after($btn);
                            }
                            // 注册事件
                            $btn.on('click', function () {
                                $scope.treeNode = treeNode;
                                if (/*!$rootScope.userInfo.isCompleted*/false) {
                                    $alert.confirm(getRcString('first-completed'), function () {
                                        $state.go('global.content.user.information');
                                    });
                                } else {
                                    $scope.$broadcast('show#addAreaModal');
                                }
                                return false;
                            });
                        }
                    }

                    function removeHoverDom(treeId, treeNode) {
                        if (REGION_WRITE) {
                            $("#addBtn_" + treeNode.tId).unbind().remove();
                        }
                    }

                    setting = {
                        view: {
                            line: false,
                            removeHoverDom: removeHoverDom,
                            addHoverDom: addHoverDom,
                            selectedMulti: false
                        },
                        edit: {
                            drag: {isMove: false, prev: false, next: false, inner: false, isCopy: false},
                            enable: true,
                            removeTitle: getRcString("delete-region"),
                            renameTitle: getRcString("modify-name"),
                            editNameSelectAll: true,
                            showRemoveBtn: function (tId, treeNode) {
                                // 根节点没有修改权限
                                return !!treeNode.parentId && REGION_WRITE;
                            },
                            showRenameBtn: function () {
                                // 没有写权限的时候不显示重命名权限
                                return REGION_WRITE;
                            }

                        },
                        data: {
                            simpleData: {
                                enable: true
                            }
                        },
                        callback: {
                            beforeRemove: removeNode,
                            beforeEditName: beforeEditName,
                            onClick: function (e, treeId, treeNode) {
                                $scope.$apply(function () {
                                    $scope.region = treeNode.id;
                                    $scope.clickedNode = treeNode;
                                });
                            }
                        }
                    };

                    // 加载ztree
                    loadZtree(setting);
                }

            });

            /**
             * 删除节点
             * @param treeId
             * @param treeNode
             * @returns {boolean}
             */
            function removeNode(treeId, treeNode) {
                if (/*!$rootScope.userInfo.isCompleted*/false) {
                    $alert.confirm(getRcString('first-completed'), function () {
                        $state.go('global.content.user.information');
                    });
                } else {
                    $scope.ztreeObj.selectNode(treeNode);
                    var delTip = getRcString("confirm-delete").split(',');
                    $alert.confirm(delTip[0] + treeNode.name + delTip[1] + '?', function (modal) {
                        modal.disableOk();
                        $http.delete(URL_DELETE_AREA + treeNode.id)
                            .success(function (data) {
                                if (data.code == 0) {
                                    $scope.ztreeObj.removeNode(treeNode);
                                    $alert.noticeSuccess(data.message);
                                    modal.close();
                                } else {
                                    $alert.noticeDanger(data.message);
                                }
                                modal.disableOk(false);
                            })
                            .error(function (data) {
                                $alert.noticeDanger(data.message);
                                modal.disableOk(false);
                            });
                    }, false);
                }

                return false;
            }

            /**
             * 修改treeNode名称
             * @param treeId
             * @param treeNode
             * @returns {boolean}
             */
            function beforeEditName(treeId, treeNode) {
                if (/*!$rootScope.userInfo.isCompleted*/false) {
                    $alert.confirm(getRcString('first-completed'), function () {
                        $state.go('global.content.user.information');
                    });
                } else {
                    $scope.treeNode = treeNode;
                    $scope.treeNode.areaName = treeNode.name;
                    $scope.treeNode.oldName = treeNode.name;
                    $scope.$broadcast('show#modifyAreaModal');
                }
                return false;
            }

            /**
             * 加载ztree
             */
            function loadZtree(setting, nodes) {
                if ($scope.ztreeObj) {
                    $.fn.zTree.destroy('treeDemo');
                }
                if (nodes) {
                    $scope.ztreeObj = $.fn.zTree.init($("#treeDemo"), setting, nodes);
                } else {
                    // 加载ztree数据
                    $http.get(URL_GET_TREE).success(function (data) {
                        if (data.code == 0) {
                            $.map(data.data, function (v) {
                                if (v.parentId != undefined) {
                                    v.pId = v.parentId;
                                } else {
                                    v.open = true;
                                }
                                return v;
                            });
                            if (data.data && !data.data.length) {
                                $scope.NO_PERMISSION = true;
                            }
                            if (data && data.data && data.data[0]) {
                                $.each(data.data, function () {
                                    if (!this.parentId) {
                                        $scope.region = this.id;
                                        return false;
                                    }
                                });
                            }
                            treeData = data.data;
                            $scope.ztreeObj = $.fn.zTree.init($("#treeDemo"), setting, treeData);
                        } else {
                            treeData = [];
                        }
                    }).error(function (error) {
                        treeData = [];
                    });
                }
            }

            //  关闭添加模态框初始化操作
            $scope.$on('hidden.bs.modal#addAreaModal', function () {
                // 清空输入框，并且重置表单
                $scope.$apply(function () {
                    $scope.treeNode.areaName = '';
                    // 重置表单
                    $scope.formAddArea.$setPristine();
                    $scope.formAddArea.$setUntouched();
                });
            });

            //  关闭修改模态框初始化操作
            $scope.$on('hidden.bs.modal#modifyAreaModal', function () {
                // 清空输入框，并且重置表单
                $scope.$apply(function () {
                    $scope.treeNode.areaName = '';
                    // 重置表单
                    $scope.formModifyArea.$setPristine();
                    $scope.formModifyArea.$setUntouched();
                });
            });
            // 表单响应
            $scope.$watch('formAddArea.$invalid', function (v) {
                if (v) {
                    $scope.$broadcast('disabled.ok#addAreaModal');
                } else {
                    $scope.$broadcast('enable.ok#addAreaModal');
                }
            });
            // 表单响应
            $scope.$watch('formModifyArea.$invalid', function (v) {
                if (v) {
                    $scope.$broadcast('disabled.ok#modifyAreaModal');
                } else {
                    $scope.$broadcast('enable.ok#modifyAreaModal');
                }
            });

            $scope.addAreaModal = {
                mId: 'addAreaModal',
                title: getRcString("add-region"),
                autoClose: false,
                okHandler: function (modal) {
                    var params = {
                        ownerId: $scope.treeNode.ownerId,
                        name: $scope.treeNode.areaName,
                        parentId: $scope.treeNode.id,
                        authFrom: $scope.treeNode.authFrom
                    };
                    $scope.$broadcast('disabled.ok#addAreaModal');
                    $http.post(URL_ADD_AREA, JSON.stringify(params))
                        .success(function (data) {
                            if (data.code == 0) {
                                var node = {
                                    name: $scope.treeNode.areaName,
                                    id: data.data,
                                    authFrom: $scope.treeNode.authFrom,
                                    ownerId: $scope.treeNode.ownerId,
                                    pId: $scope.treeNode.id,
                                    parentId: $scope.treeNode.id,
                                    tId: $scope.treeNode.tId + new Date().getTime(),
                                    children: [],
                                    open: false
                                };
                                $scope.ztreeObj.addNodes($scope.treeNode, [node]);
                                modal.hide();
                                $alert.noticeSuccess(data.message);
                            } else {
                                $alert.noticeDanger(data.message);
                            }
                            $scope.$broadcast('enable.ok#addAreaModal');
                        })
                        .error(function (data) {
                            $alert.noticeDanger(data.message);
                            $scope.$broadcast('enable.ok#addAreaModal');
                        });
                }
            };
            $scope.modifyAreaModal = {
                mId: 'modifyAreaModal',
                title: getRcString("modify-region"),
                autoClose: false,
                okHandler: function (modal) {
                    if ($scope.treeNode.areaName == $scope.treeNode.oldName) {
                        $alert.noticeSuccess(getRcString("not-modify"));
                        modal.hide();
                        return;
                    }
                    $scope.$broadcast('disabled.ok#modifyAreaModal');
                    $http.put(URL_MODIFY_AREA, JSON.stringify({
                        ownerId: $scope.treeNode.ownerId,
                        name: $scope.treeNode.areaName,
                        id: $scope.treeNode.id
                    }), {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }).success(function (data) {
                        if (data.code == 0) {
                            $alert.noticeSuccess(data.message);
                            $scope.treeNode.name = $scope.treeNode.areaName;
                            modal.hide();
                        } else {
                            $alert.noticeDanger(data.message);
                        }
                        $scope.ztreeObj.updateNode($scope.treeNode);
                        $scope.$broadcast('enable.ok#modifyAreaModal');
                    }).error(function (data) {
                        $scope.ztreeObj.updateNode($scope.treeNode);
                        $alert.noticeDanger(data.message);
                        $scope.$broadcast('enable.ok#modifyAreaModal');
                    });
                }
            };

            $scope.$on('show.bs.modal#optionModal', function () {
                $scope.devices = []
            });
            $scope.complete = function () {
                $scope.$broadcast('hide#addShop');
                // location.reload();
                $scope.$broadcast('regionRefresh');
            };

            $("#add_div").hover(function () {
                $("#add_img").attr("src", "../home/img/icon_homepage_add_active_111x111.png");
            }, function () {
                $("#add_img").attr("src", "../home/img/icon_homepage_add.png");
            });

            /**
             * 重新加载ztree容器的高度
             */
            function resizeZtree() {
                $('.ztree-container').height($(window).height() - 160);
            }

            resizeZtree();
            $(window).on('resize', resizeZtree);

            // button

            $("#right").data("state", true).click(function () {
                var v_state = $(this).data("state");
                if (v_state) {
                    $(".storeGroup").animate({"left": -258});
                    $("#right").animate({"left": 0});
                    $(this).data("state", false);
                } else {
                    $(".storeGroup").animate({"left": 0});
                    $("#right").animate({"left": 258});
                    $(this).data("state", true);
                }
            });
            // img view
            $scope.echratsView = function (e) {
                $(e.target).attr("src", "../home/images/icon-dtc.png");
                $(".tableImg").attr("src", "../home/images/icon-lbn.png");
                $(".echarts_view").show();
                $('.paging-contain').show();
                $(".table_view").hide();
                $scope.$broadcast('regionRefresh');
            };
            $scope.tableView = function (e) {
                $(e.target).attr("src", "../home/images/icon-lbc.png");
                $(".echratsImg").attr("src", "../home/images/icon-dtn.png");
                $(".echarts_view").hide();
                $('.paging-contain').hide();
                $(".table_view").show();
                $scope.reqTableData($scope.tableRegion);
            };

            $(".main").attr("style", "height:" + ($(window).innerHeight() - 141) + "px");
            $(window).resize(function () {
                $(".main").attr("style", "height:" + ($(window).innerHeight() - 141) + "px");
            });
        }
        ]
            ;
    }
);