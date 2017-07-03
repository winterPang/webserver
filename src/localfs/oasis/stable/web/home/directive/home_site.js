/**
 * directive home sites with pagination by z04434@20160925
 */
define(['angularAMD', 'jquery', 'async', 'echarts3', 'utils', '../controller/homeCommon', 'css!home/css/home.css', 'css!home/css/home_site', 'sprintf', 'frame/service/alert'],
    function (app, $, async, echarts, utils, common) {

        var sLang = utils.getLang() || 'cn';
        var URL_TEMPLATE = sprintf('../home/views/%s/home_site.html', sLang);
        var URL_POST_SITES_HEALTH = '/v3/ant/oasishealth';
        // var URL_GET_SITES_HEALTH = '/v3/health/home/siteHealth?scenarioId=%s';
        var URL_GET_REGIONS = '/v3/ace/oasis/oasis-rest-shop/restshop/regioninfo/regions';
        var URL_GET_PLACE_INFO_LIST = '/v3/ace/oasis/oasis-rest-shop/restshop/regioninfo/regionshoppage/%d/%d/%d/id/true/undefined';

        var MENU_URL_TEMPLATE = "https://oasisrd.h3c.com/oasis/stable/web/frame/index.html#/scene%d/nasid%d/devsn%s/content%stopName%s/monitor/dashboard15";
        var PERATION_URL_TEMPLATE = "https://oasisrd.h3c.com/oasis/stable/web/frame/index.html#/scene88/nasid%d/devsn%s/content/monitor/dashboard88";
        var URL_NO_DEVICE_URL = common.url.URL_NO_DEVICE_URL,
            URL_GET_IRFDEVS = common.url.URL_GET_IRFDEVS,
            URL_GET_DEVICES_STATUS = common.url.URL_GET_DEVICES_STATUS;

        app.directive('homeSite', ['$timeout', '$rootScope', '$http', '$q', '$alertService', '$state',
            function ($timeout, $rootScope, $http, $q, $alert, $state) {
                return {
                    restrict: 'EA',
                    scope: {
                        region: '=homeSite'
                    },
                    replace: true,
                    controller: function ($scope, $element, $attrs, $transclude) {
                        function getRcString(attrName) {
                            return utils.getRcString("listView_rc", attrName);
                        }

                        $scope.flags = {
                            is_branch_user: $rootScope.userRoles.accessApList == 'true',
                            is_branch_shop: false
                        };

                        var tableData = getRcString('table-data').split(',');
                        var aRc = $attrs.rc.split(',');
                        $scope.pagination = {
                            first: aRc[0],
                            prev: aRc[1],
                            next: aRc[2],
                            last: aRc[3],
                            totalPages: 0,
                            paginationClass: 'pagination',
                            onPageClick: function (e, page) {
                                // console.log('new_page:' + page);
                            }
                        };
                        $scope.home_page_option = {
                            extraCls: 'home_page_table',
                            pageList: [8, 10, 25, 50, 100],
                            pageSize: 8,
                            columns: [
                                {
                                    field: 'shopName', title: tableData[0], formatter: function (v) {
                                    return '<span id="shop-name" title="' + v + '">' + v + '</span>'
                                }
                                },
                                {field: 'score', title: tableData[1]},
                                {field: 'client', title: tableData[2]},
                                {
                                    field: 'upSpeed', title: tableData[3], formatter: function (val, row) {
                                    // return typeof(row.upSpeed) == 'number' ? parseInt(row.upSpeed * 10 / 1024) / 10 : '-';
                                    if (typeof(row.upSpeed) != 'number') {
                                        return '-'
                                    } else if (row.upSpeed < 1024) {
                                        return parseInt(row.upSpeed * 10) / 10 + 'Kbps';
                                    } else if (row.upSpeed / 1024 >= 1024) {
                                        return parseInt(row.upSpeed * 10 / 1024 / 1024) / 10 + 'Gbps';
                                    } else {
                                        return parseInt(row.upSpeed * 10 / 1024) / 10 + 'Mbps';
                                    }
                                }
                                },
                                {
                                    field: 'downSpeed', title: tableData[4], formatter: function (val, row) {
                                    if (typeof(row.upSpeed) != 'number') {
                                        return '-'
                                    } else if (row.upSpeed < 1024) {
                                        return parseInt(row.upSpeed * 10) / 10 + 'Kbps';
                                    } else if (row.upSpeed / 1024 >= 1024) {
                                        return parseInt(row.upSpeed * 10 / 1024 / 1024) / 10 + 'Gbps';
                                    } else {
                                        return parseInt(row.upSpeed * 10 / 1024) / 10 + 'Mbps';
                                    }
                                }
                                },
                                {field: 'apOnline', title: tableData[5]},
                                {field: 'apOffline', title: tableData[6]},
                                {field: 'routerOnline', title: tableData[9]},
                                {field: 'routerOffline', title: tableData[10]},
                                {
                                    field: 'perationUrl',
                                    title: '',
                                    formatter: function (val, row, index) {
                                        if (row.menuUrl.indexOf('/scene5/') != -1 ||
                                            row.menuUrl.indexOf('/scene2/') != -1 ||
                                            row.menuUrl.indexOf('/scene0/') != -1) {
                                            if (row.menuUrl != 'https://oasisrd.h3c.com/oasis/stable/web/frame/index.html' && row.menuUrl.indexOf('oasishk.h3c.com') == -1) {
                                                row.devsn = row.menuUrl.match(/devsn[0-9a-zA-Z]+\//)[0].split('devsn')[1].slice(0, -1);
                                                return '<a class="btn btn-cus btn-small" style="cursor:pointer;box-sizing: content-box" href="' + sprintf(PERATION_URL_TEMPLATE, row.shopId, row.devsn).replace('oasisrd.h3c.com', location.hostname) + '">' + tableData[11] + '</a>';
                                            } else {
                                                return;
                                                // return '<a class="btn btn-cus" style="cursor:pointer;box-sizing: content-box">' + tableData[11] + '</a>';
                                            }
                                        }
                                    },
                                    visible: !$scope.flags.is_branch_user
                                },
                                {
                                    field: 'menuUrl',
                                    title: '',
                                    formatter: function (val, row, index) {
                                        // row.menuUrl = row.menuUrl ? row.menuUrl.replace('oasis.h3c.com', location.hostname) : '';
                                        // return '<a class="btn btn-cus btn-small" style="cursor:pointer;" href="' + row.menuUrl + '">' + tableData[7] + '</a>';
                                        if (!$scope.flags.is_branch_user || ($scope.flags.is_branch_user && row.isbranchshop)) {
                                            return '<a class="btn btn-cus btn-small" style="cursor:pointer;">' + tableData[7] + '</a>';
                                        }
                                    }
                                }
                            ]
                        };
                        $scope.$on('click-cell.bs.table', function (e, field, value, row, $element) {
                            if (field == "menuUrl") {
                                // common.showOnlineDeviceManage(row.menuUrl, row.irfFlag, row.sn, URL_NO_DEVICE_URL, URL_GET_IRFDEVS, URL_GET_DEVICES_STATUS, $alert);
                                if (!row.shop) {
                                    if (row.menuUrl == URL_NO_DEVICE_URL) {
                                        $alert.noticeDanger(getRcString('tipforno-devices'));
                                    } else {
                                        location.href = row.menuUrl;
                                    }
                                } else if (row.irfFlag) {
                                    $http.get(sprintf(URL_GET_IRFDEVS, row.sn)).success(function (data) {
                                        if (data.code == 0 && data.data) {
                                            $http.post(URL_GET_DEVICES_STATUS, {devSN: data.data}).success(function (sta_data) {
                                                //0 -> online   1 -> offline
                                                if (sta_data.detail) {
                                                    $.map(sta_data.detail, function (sta_v) {
                                                        if (sta_v.status == 0) {
                                                            row.menuUrl = row.menuUrl.replace(row.sn, sta_v.devSN);
                                                            location.href = row.menuUrl;
                                                        }
                                                    });
                                                    location.href = row.menuUrl;
                                                } else {
                                                    location.href = row.menuUrl;
                                                }
                                            }).error(function () {
                                                location.href = row.menuUrl;
                                            });
                                        } else {
                                            location.href = row.menuUrl;
                                        }
                                    }).error(function () {
                                        location.href = row.menuUrl;
                                    });
                                } else {
                                    location.href = row.menuUrl;
                                }
                            }
                        });
                        $scope.manage = function (siteInfo) {
                            // common.showOnlineDeviceManage(siteInfo.menuUrl, siteInfo.shop.irfFlag, siteInfo.shop.sn, URL_NO_DEVICE_URL, URL_GET_IRFDEVS, URL_GET_DEVICES_STATUS, $alert);
                            if (!siteInfo.shop) {
                                if (siteInfo.menuUrl == URL_NO_DEVICE_URL) {
                                    $alert.noticeDanger(getRcString('tipforno-devices'));
                                } else {
                                    location.href = siteInfo.menuUrl;
                                }
                            } else if (siteInfo.shop.irfFlag) {
                                $http.get(sprintf(URL_GET_IRFDEVS, siteInfo.shop.sn)).success(function (data) {
                                    if (data.code == 0 && data.data) {
                                        $http.post(URL_GET_DEVICES_STATUS, {devSN: data.data}).success(function (sta_data) {
                                            //0 -> online   1 -> offline
                                            if (sta_data.detail) {
                                                $.map(sta_data.detail, function (sta_v) {
                                                    if (sta_v.status == 0) {
                                                        siteInfo.menuUrl = siteInfo.menuUrl.replace(siteInfo.shop.sn, sta_v.devSN);
                                                        location.href = siteInfo.menuUrl;
                                                    }
                                                });
                                                location.href = siteInfo.menuUrl;
                                            } else {
                                                location.href = siteInfo.menuUrl;
                                            }
                                        }).error(function () {
                                            location.href = siteInfo.menuUrl;
                                        });
                                    } else {
                                        location.href = siteInfo.menuUrl;
                                    }
                                }).error(function () {
                                    location.href = siteInfo.menuUrl;
                                });
                            } else {
                                location.href = siteInfo.menuUrl;
                            }
                        };
                        $scope.toggle_show_detail = function (e) {
                            $(e.currentTarget).parents('.shop-block-item').find('.shop-block-detail-rate').slideUp(0.6);
                            $(e.currentTarget).parents('.shop-block-item').find('.shop-block-detail-hover').slideDown(0.6);
                        };
                        $scope.toggle_hide_detail = function (e) {
                            $(e.currentTarget).parents('.shop-block-item').find('.shop-block-detail-rate').slideDown(0.6);
                            $(e.currentTarget).parents('.shop-block-item').find('.shop-block-detail-hover').slideUp(0.6);
                        }
                    },
                    templateUrl: URL_TEMPLATE,
                    link: function ($scope, $element, $attrs, $ngModel) {
                        function getRcString(attrName) {
                            return utils.getRcString("listView_rc", attrName);
                        }

                        /* 2017.04.12 by kf6859 start  */
                        // function getRcString(attrName) {
                        //     return utils.getRcString("listView_rc", attrName);
                        // }
                        //
                        $scope.unCompleted = !$rootScope.userInfo.isCompleted;
                        // var HOME_FIRST = utils.getCookie('home_first');
                        // if (HOME_FIRST === null && $scope.unCompleted) {
                        //     $alert.confirm(getRcString('first-complete'), function () {
                        //         $state.go('global.content.user.information');
                        //     });
                        //     utils.setCookie({home_first: 'true'});
                        // } else if (HOME_FIRST === 'true') {
                        //     utils.setCookie({home_first: 'false'});
                        // }
                        /* 2017.04.12 by kf6859 end */
                        var aRc = $attrs.rc.split(',');
                        var RC_FAILED = aRc[4];
                        var RC_UNKNOW = aRc[5];
                        var RC_NODEVICE = aRc[6];

                        $scope.total = 0;
                        $scope.page = 1;
                        $scope.pageSize = 6;

                        $scope.$watch('region', function (v, v2) {
                            // 区域修改后，直接返回到第一页，如果是第一页，有page修改触发查询事件，否则自动执行查询事件
                            if (v) {
                                // hide select while region change
                                $scope.total = 0;
                                // goto first page if region change
                                $scope.pagination.totalPages = 0;
                                if ($scope.page == 1) {  //  第一页自动触发
                                    updateSites($scope.region, $scope.page, $scope.pageSize);
                                } else {  //  由pagechange执行
                                    $scope.page = 1;
                                }
                            }
                        });
                        $scope.$on('regionRefresh', function () {
                            // hide select while region change
                            $scope.total = 0;
                            // goto first page if region change
                            $scope.pagination.totalPages = 0;
                            // console.debug('regionRefresh', arguments);
                            updateSites($scope.region, $scope.page, $scope.pageSize);
                        });

                        $scope.$watch('page', function (v, v2) {
                            //  if change
                            if (v && v != v2) {
                                // console.debug('page', arguments);
                                updateSites($scope.region, $scope.page, $scope.pageSize);
                            }
                        });
                        $scope.$watch('pageSize', function (v, v2) {
                            //  if change
                            if (v && v != v2) {
                                if ($scope.page == 1) {  //  第一页自动触发
                                    updateSites($scope.region, $scope.page, $scope.pageSize);
                                } else {  //  由pagechange自动触发
                                    $scope.page = 1;
                                }
                            }
                        });

                        function getSpeed(num) {
                            num = Number(num);
                            if (num < 1024) {
                                return parseInt(num * 10) / 10 + 'K';
                            } else if (num / 1024 >= 1024) {
                                return parseInt(num * 10 / 1024 / 1024) / 10 + 'G';
                            } else {
                                return parseInt(num * 10 / 1024) / 10 + 'M';
                            }
                        }

                        function updateSites(nRegionId, nPage, nPageSize) {
                            if (!(nRegionId && nPage && nPageSize)) {
                                return;
                            }
                            if ($('.table_view').css('display') == 'block') {
                                return;
                            }
                            var sUrl = sprintf(URL_GET_PLACE_INFO_LIST, nRegionId, nPage, nPageSize);
                            //$http.get(sUrl).success(success, fail);

                            //branch url
                            async.waterfall([
                                function (callback) {
                                    // body...
                                    $http.get(sUrl).success(function (data) {
                                        callback(null, data);
                                    }).error(function (error) {
                                        callback(null, error);
                                    })
                                },
                                function (siteData, callback) {
                                    if ($scope.branchData) {
                                        callback(null, siteData, $scope.branchData);
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
                                        }).success(function (data) {

                                            if (data.retCode == 0) {
                                                $scope.branchData = data;
                                            }
                                            callback(null, siteData, data);
                                        }).error(function (error) {
                                            callback(null, error);
                                        })
                                    } else {
                                        callback(null, siteData, $scope.branchData);
                                    }

                                }], function (err, siteData, branchData) {
                                var sceneDataArr = [];
                                if (siteData && 0 == siteData.code && branchData && branchData.retCode == 0) {
                                    var scenesObj = {};
                                    angular.forEach(siteData.data.data, function (v, k) {
                                        scenesObj[v.shopId] = v;

                                    });
                                    angular.forEach(branchData.message, function (v, k) {
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
                                    sceneDataArr = siteData.data.data
                                }
                                success(siteData, sceneDataArr);
                            });
                            function success(siteData, sceneDataArr) {
                                angular.forEach(sceneDataArr, function (v, k) {
                                    if (v.menuUrl.indexOf('/scene5/') != -1 ||
                                        v.menuUrl.indexOf('/scene2/') != -1 ||
                                        v.menuUrl.indexOf('/scene0/') != -1) {
                                        v.showPeration = true;
                                    } else {
                                        v.showPeration = false;
                                    }
                                    if (v.menuUrl.indexOf('oasishk.h3c.com') != -1) {
                                        v.showPeration = false;
                                    }
                                    if (v.shop) {
                                        v.perationUrl = sprintf(PERATION_URL_TEMPLATE, v.shop.shopId, v.shop.sn).replace('oasisrd.h3c.com', location.hostname);
                                    } else {
                                        v.perationUrl = "#"
                                    }
                                });
                                $scope.sites = sceneDataArr;
                                $scope.total = siteData.data.rowCount;
                                updateTotal();
                                var sSites = $.map($scope.sites, function (v, i) {
                                    return v.shopId;
                                }).join(',');
                                if (sSites != '') {
                                    $http.post(URL_POST_SITES_HEALTH, JSON.stringify({
                                        method: "scenarioHealth",
                                        scenarioId: sSites.split(',')
                                    })).success(function (data) {
                                        var sites = {};
                                        if (!data && !data.Info) {
                                            return;
                                        }
                                        $.each(data.Info, function (i, v) {
                                            sites[v.scenarioId] = v;
                                        });
                                        $.each($scope.sites, function (i, v) {
                                            var oSite = sites[v.shopId];
                                            var oInfo = oSite.info;
                                            // var oInfo = oSite && oSite.info;
                                            v.menuUrl = v.menuUrl ? v.menuUrl.replace('oasis.h3c.com', location.hostname) : '';
                                            v.showApStatus = v.scenarioType == 'wlan' || v.scenarioType == 'WLAN';
                                            // v.showApStatus = v.scenarioType != 'router';
                                            var o = {
                                                id: v.shopId,
                                                name: v.shopName,
                                                url: v.menuUrl,
                                                online: '-',
                                                offline: '-',
                                                score: RC_FAILED,
                                                up: '-',
                                                down: '-',
                                                clientnum: '-'
                                            };
                                            if (0 == oSite.retcode) {
                                                o.online = oInfo.apOnline;
                                                o.offline = oInfo.apOffline;
                                                o.score = oInfo.score;
                                                o.up = parseFloat(getSpeed(oInfo.upSpeed));
                                                o.upUnit = getSpeed(oInfo.upSpeed).substr(-1);
                                                o.down = parseFloat(getSpeed(oInfo.downSpeed));
                                                o.downUnit = getSpeed(oInfo.downSpeed).substr(-1);
                                                o.clientnum = oInfo.client;
                                            }
                                            else {
                                                o.score = oSite.message;
                                            }

                                            v.display = o;

                                            setTimeout(function () {
                                                if (v.shop && v.shop.irfFlag) {
                                                    $http.get(sprintf(URL_GET_IRFDEVS, v.shop.sn)).success(function (data) {
                                                        if (data.code == 0 && data.data) {
                                                            $http.post(URL_GET_DEVICES_STATUS, {devSN: data.data}).success(function (sta_data) {
                                                                //0 -> online   1 -> offline
                                                                if (sta_data.detail) {
                                                                    $.map(sta_data.detail, function (sta_v) {
                                                                        if (sta_v.status == 0) {
                                                                            o.url = v.menuUrl.replace(v.shop.sn, sta_v.devSN);
                                                                            drawPie(i, o.score, o.url, !isNaN(Number(o.score)));
                                                                        }
                                                                    });
                                                                    drawPie(i, o.score, o.url, !isNaN(Number(o.score)));
                                                                } else {
                                                                    // o.url = v.menuUrl;
                                                                    drawPie(i, o.score, o.url, !isNaN(Number(o.score)));
                                                                }
                                                            }).error(function () {
                                                                // o.url = v.menuUrl;
                                                                drawPie(i, o.score, o.url, !isNaN(Number(o.score)));
                                                            });
                                                        } else {
                                                            // o.url = v.menuUrl;
                                                            drawPie(i, o.score, o.url, !isNaN(Number(o.score)));
                                                        }
                                                    }).error(function () {
                                                        // o.url = v.menuUrl;
                                                        drawPie(i, o.score, o.url, !isNaN(Number(o.score)));
                                                    });
                                                } else {
                                                    // o.url = v.menuUrl;
                                                    drawPie(i, o.score, o.url, !isNaN(Number(o.score)));
                                                }
                                            }, 0);
                                        });
                                    });
                                    /* }
                                     else {
                                     // console.log('updateSites:' + data.message);
                                     }*/
                                }
                            }

                            function updateTotal(nTotalCount) {
                                var nTotalPage = Math.floor($scope.total / $scope.pageSize) + ((0 != $scope.total % $scope.pageSize) ? 1 : 0);
                                $scope.pagination.totalPages = nTotalPage;
                            }

                            function drawPie(index, score, url, flag) {
                                var myChart = echarts.init($('.home-charts')[index]);
                                var sum = score;
                                var color = "";
                                if (sum >= 88) {
                                    color = "rgba(77,193,178,0.8)";
                                    lighter_color = "#40a497";
                                } else if (sum >= 60 && sum < 88) {
                                    color = "rgba(242,188,152,0.8)";
                                    lighter_color = "#FF7F27";
                                } else {
                                    color = "rgba(145,153,221,0.8)";
                                    lighter_color = "#6c74ba";
                                }

                                var option = {
                                    series: [
                                        {
                                            type: 'pie',
                                            center: ['50%', '50%'],
                                            radius: ['85%', '100%'],
                                            hoverAnimation: false,
                                            avoidLabelOverlap: false,
                                            label: {
                                                normal: {
                                                    formatter: function () {
                                                        //0:score  -2:noDevice  -5:offline
                                                        return sum = sum == 'noDevice' ? -2 : sum == 'offline' ? -5 : sum;
                                                    },
                                                    position: "center",
                                                    textStyle: {
                                                        color: color,
                                                        fontSize: 30
                                                    }
                                                },
                                                emphasis: {
                                                    textStyle: {
                                                        color: lighter_color
                                                    }
                                                }
                                            },
                                            data: [
                                                {
                                                    value: sum = sum == 'noDevice' ? -2 : sum == 'offline' ? -5 : sum,
                                                    label: {
                                                        normal: {
                                                            show: true,
                                                            position: 'center',
                                                            formatter: function () {
                                                                var val = arguments[0].data.value;
                                                                if (val == -2) {
                                                                    return $attrs.statenodevice;
                                                                } else if (val == -5) {
                                                                    return $attrs.stateoffline;
                                                                }
                                                                return Number(val) ? (val + $attrs.score) : val;
                                                            },
                                                            textStyle: {
                                                                fontSize: 30
                                                            }
                                                        }
                                                    },
                                                    itemStyle: {
                                                        normal: {
                                                            color: color
                                                        }
                                                    }
                                                },
                                                {
                                                    value: (sum == -2 || sum == -5) ? sum : (100 - sum),
                                                    label: {
                                                        normal: {
                                                            show: false
                                                        }
                                                    },
                                                    itemStyle: {
                                                        normal: {
                                                            color: '#ddd'
                                                        }
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                }
                                myChart.setOption(option);
                                myChart.on('click', function () {
                                    if (url == URL_NO_DEVICE_URL) {
                                        $alert.noticeDanger(getRcString('tipforno-devices'));
                                    } else {
                                        location = url;
                                    }
                                });
                            }
                        }
                    }
                };
            }]);
    });
