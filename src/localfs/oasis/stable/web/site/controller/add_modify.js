define(['jquery', 'utils', 'jqueryValidator', 'bootstrapValidator', 'site/libs/jsAddress', 'frame/directive/bs_modal', 'css!site/css/sitecss'],
    function ($, Utils) {
        return ['$scope', '$timeout', '$http', '$alertService', '$state', '$stateParams', '$rootScope',
            function ($scope, $timeout, $http, $alert, $state, $stateParams, $rootScope) {
                //store userName
                $scope.userName = $rootScope.userInfo.user || 'xuyian252';
                var isCompleted = true/*$scope.userInfo.isCompleted*/;

                function getRcString(attrName) {
                    return Utils.getRcString("add_modify_rc", attrName);
                }

                var URL_GET_REGION_LIST = '/v3/ace/oasis/oasis-rest-shop/restshop/regioninfo/regions';
                var URL_GET_ALL_INDUSTRY_NAME = '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/getAllIndustryName';
                var URL_GET_ALL_SCENARIO_LIST = '/v3/ace/oasis/oasis-rest-device/restdevice/scenario/getAllScenario';
                var URL_GET_MODEL_LIST = '/v3/ace/oasis/oasis-rest-device/restdevice/devicemodel/getdevModels/?seceneId=%s&ascending=%s&queryCondition=%s';
                var URL_GET_ISEXIST_SITE_NAME = '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/isExistSameShopWithUser/%s';
                var URL_GET_SITE_INFO = '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/get/%d';
                var URL_POST_ADD_SITE = '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/addShop';
                var URL_POST_MODIFY_SITE = '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/modifyShop';

                var URL_AP_GROUP = '/v3/cloudapgroup';

                $scope.completeInfo = {
                    mId: 'completeInfo',
                    title: getRcString('tip'),
                    okHandler: function () {
                        setTimeout(function () {
                            $state.go('global.content.user.information');
                        }, 500);
                    }
                };

                var request = null;
                var prov = $('#cmbProvince'),
                    city = $('#cmbCitys'),
                    area = $('#cmbArea');

                $scope.row = {};

                $scope.commitTime = new Date().getTime();

                var shopId = $stateParams.id;

                $scope.type = shopId == '' ? 'add' : 'update';

                if ($scope.type == 'update') {
                    request = $http.get(sprintf(URL_GET_SITE_INFO, shopId));
                }

                //get scenarios list and init
                $http.get(sprintf(URL_GET_ALL_SCENARIO_LIST)).success(function (data) {
                    $scope.scens = data.data.data;

                    $.map($scope.scens, function (v) {
                        v.namedesc = v.name + '(' + v.desc + ')';
                    });
                    if ($scope.type == 'add') {
                        $scope.row.scenario_category_name = $scope.scens[0].id;

                    } else {
                        request.success(function (data) {
                            $scope.row.scenario_category_name = data.data.scenarioId;
                        }).error(function (msg) {
                            $alert.noticeDanger(msg || getRcString("error"));
                        });
                    }
                }).error(function (msg) {
                    $alert.noticeDanger(msg || getRcString("error"));
                });

                //init region
                $http.get(sprintf(URL_GET_REGION_LIST)).success(function (data) {
                    $scope.areas = data.data;
                    if ($scope.type == 'add') {
                        $scope.row.region = $scope.areas[0].id;
                    } else {
                        request.success(function (data) {
                            var siteinfo = data.data;
                            //init site info
                            $scope.row.name = siteinfo.shopName;
                            $scope.row.region = siteinfo.regionId;
                            $scope.row.address = siteinfo.addrDetail;
                            $scope.row.phone = siteinfo.phone;
                            $scope.row.brief = siteinfo.shopDesc;
                        }).error(function (msg) {
                            $alert.noticeDanger(msg || getRcString("error"));
                        });
                    }
                });

                //init industry
                $http.get(sprintf(URL_GET_ALL_INDUSTRY_NAME)).success(function (data) {
                    // {"code":0,"message":"查询成功","data":[{"id":4,"industryName":"default"},{"id":7,"industryName":"餐饮"}]}
                    $scope.industries = data.data;
                    if ($scope.type == 'add') {
                        $scope.row.industry = $scope.industries[0].id;
                    } else {
                        request.success(function (data) {
                            var siteinfo = data.data;
                            $scope.row.industry = siteinfo.industryId;
                        }).error(function (msg) {
                            $alert.noticeDanger(msg || getRcString("error"));
                        });
                    }
                }).error(function (msg) {
                    $alert.noticeDanger(msg || getRcString("error"));
                });

                //init province、city、district
                if ($scope.type == 'add') {
                    initAddress(function (p) {
                        prov.val(p).trigger('change');
                        city.trigger('change');
                    }, Utils.getLang());
                } else {
                    request.success(function (data) {
                        var siteinfo = data.data;
                        $scope.old_site_name = siteinfo.shopDesc;
                        //初始化场所信息
                        $scope.row.province = siteinfo.province ? siteinfo.province.split(/[省市]/).join('') : '';
                        $scope.row.city = siteinfo.city ? siteinfo.city : '';
                        $scope.row.district = siteinfo.district ? siteinfo.district : '';

                        initAddress(function () {
                            prov.val($scope.row.province).trigger('change');
                            city.val($scope.row.city).trigger('change');
                            area.val($scope.row.district);
                        }, Utils.getLang());
                    }).error(function (msg) {
                        $alert.noticeDanger(msg || getRcString("error"));
                    });
                }

                $scope.onSubmit = function () {
                    var $btn = $('button[type=submit]');
                    var timer = setTimeout(function () {
                        $btn.attr('disabled', false);
                    }, 2000);

                    $btn.attr('disabled', 'disabled');

                    // var curr = new Date().getTime();
                    // if ((curr - $scope.commitTime) / 1000 < 5) {
                    //     return;
                    // }
                    //
                    // $scope.commitTime = curr;

                    if ($scope.type == 'add') {
                        if (isCompleted) {
                            var add_data = {
                                "shopName": $scope.row.name,
                                "shopDesc": $scope.row.brief,
                                "phone": $scope.row.phone,
                                "scenarioId": $scope.row.scenario_category_name,
                                "regionId": $scope.row.region,
                                "industryId": $scope.row.industry,
                                "province": prov.val() || '-',
                                "city": city.val() || '-',
                                "district": area.val() || '-',
                                "addrDetail": $scope.row.address
                            };
                            $http.post(sprintf(URL_POST_ADD_SITE), JSON.stringify(add_data), {headers: {"Content-Type": "application/json;charset=UTF-8"}}).success(function (data) {
                                if (data.code == 0) {
                                    if (add_data.scenarioId == 76) {
                                        $http.post(URL_AP_GROUP, {
                                            Method: 'setGroupName',
                                            query: {
                                                userName: $scope.userName,
                                                nasId: data.data,
                                                parentId: '',
                                                alias: '总部'
                                            }
                                        }).success(function (dt) {

                                        }).error(function (msg) {
                                            console.info(msg);
                                        });
                                    }
                                    $alert.noticeSuccess(getRcString("add-success"));
                                    $state.go("global.content.system.site");
                                    clearTimeout(timer);
                                    timer = null;
                                } else {
                                    $btn.attr('disabled', false);
                                    $alert.noticeDanger(data.message);
                                }
                            }).error(function (msg) {
                                $btn.attr('disabled', false);
                                $alert.noticeDanger(msg || getRcString("error"));
                            });
                        } else {
                            $scope.$broadcast('show#completeInfo');
                        }
                    } else {
                        $scope.modifyrow = {
                            "id": shopId,
                            "shopName": $scope.row.name,
                            "shopDesc": $scope.row.brief,
                            "phone": $scope.row.phone,
                            "regionId": $scope.row.region,
                            "industryId": $scope.row.industry,
                            "scenarioId": $scope.row.scenario_category_name,
                            "addrDetail": $scope.row.address,
                            "city": city.val() || '-',
                            "district": area.val() || '-',
                            "province": prov.val() || '-'
                        };
                        $http.post(URL_POST_MODIFY_SITE, JSON.stringify($scope.modifyrow)).success(function (data) {
                            if (data.code == 0) {
                                $alert.noticeSuccess(getRcString("modify-success"));
                                $state.go("global.content.system.site");
                                clearTimeout(timer);
                                timer = null;
                            } else {
                                $btn.attr('disabled', false);
                                $alert.noticeDanger(data.message);
                            }
                        }).error(function (msg) {
                            $btn.attr('disabled', false);
                            $alert.noticeDanger(msg || getRcString("error"));
                        });
                    }
                };

                $scope.showdevmodel = function () {
                    $scope.$broadcast('refresh', {
                        url: sprintf(URL_GET_MODEL_LIST, $scope.row.scenario_category_name, true, '')
                    });
                    $scope.$broadcast('show');
                };
                $scope.options = {
                    totalField: 'data.rowCount', //总数field，多级用点，最深是两级  例如  data.total
                    sortField: 'orderby', // 查询参数sort
                    dataField: 'data.data',
                    sortName: 'id',
                    sortOrder: 'asc',
                    showPageList: false,
                    columns: [
                        {sortable: true, field: 'dModel', title: getRcString("support")}
                    ],
                    sidePagination: 'server',
                    formatShowingRows: function (pageFrom, pageTo, totalRows) {
                        return getRcString("page").split(",")[0] + pageFrom + getRcString("page").split(",")[1] + pageTo + getRcString("page").split(",")[2] + getRcString("page").split(",")[3] + totalRows + getRcString("page").split(",")[2];
                    },
                    onLoadSuccess: function () {
                        $(window).trigger('resize');
                    }
                };
                $scope.devmodel = {
                    title: getRcString("support-device"),
                    cancelText: getRcString("off"),
                    showOk: false
                };

                $scope.validName = {
                    url: sprintf(URL_GET_ISEXIST_SITE_NAME, '{value}'),
                    method: 'get',// 请求方式
                    live: false,
                    validFn: function (resp) {
                        if (resp.code == 0) {
                            return true;
                        } else if ($scope.type == 'update' && $scope.old_site_name == $scope.row.name) {
                            return true;
                        } else {
                            return resp.code;
                        }
                    }
                };
            }];
    });