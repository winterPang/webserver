/**
 * directive home sites with pagination by z04434@20160925
 */
define(['angularAMD', 'jquery', 'async', 'echarts3', 'utils', 'css!demohome/css/home.css', 'sprintf'],
    function (app, $, async, echarts, utils,$alert) {

        var sLang = utils.lang || 'cn';

        var URL_TEMPLATE = sprintf('../demohome/views/%s/home_site.html', sLang);

        var URL_GET_AC_CLIENT_COUNT = '/v3/stamonitor/web/clientcount?acSN=%s';
        var URL_GET_WAN_SPEED       = '/v3/devmonitor/web/wanspeed?devSN=%s';
        var URL_GET_AP_STATISTIC    = '/v3/apmonitor/web/apstatistic?devSN=%s';
        var URL_GET_AC_HEALTH       = '/v3/health/home/health?acSN=%s';
        var URL_GET_SITE_HEALTH     = '/v3/ace/oasis/oasis-rest-shop-dev/restshop/shopModel/shophealth/%s'
        var URL_GET_REGIONS         = '/v3/ace/oasis/oasis-rest-region/restapp/regioninfo/regions';
        var URL_GET_PLACE_INFO_LIST = '/v3/ace/oasis/oasis-rest-region/restapp/regioninfo/regionshoppage/%d/%d/%d/id/true/undefined';
         var URL_DELETE_DEV = '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/shopdevices/%s';
         var URL_DELETE_SITE = '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/shops/%d';
        app.directive('homeSite', ['$timeout', '$rootScope', '$http', '$q','$alertService',
            function ($timeout, $rootScope, $http, $q,$alert) {
                return {
                    restrict: 'EA',
                    scope: {
                        region: '=homeSite'
                    },
                    replace: true,
                    controller: function ($scope, $element, $attrs, $transclude) {
                        var aRc = $attrs.rc.split(',');
                        $scope.pagination = {
                            first: aRc[0],
                            prev: aRc[1],
                            next: aRc[2],
                            last: aRc[3],
                            totalPages: 0,
                            paginationClass: 'pagination',
                            onPageClick: function (e, page) {
                                console.log('new_page:' + page);
                            }
                        };
                    },
                    //require: 'ngModel',
                    templateUrl: URL_TEMPLATE,
                    link: function ($scope, $element, $attrs, $ngModel) {

                        var aRc = $attrs.rc.split(',');
                        var RC_FAILED = aRc[4];
                        var RC_UNKNOW = aRc[5];
                        var RC_NODEVICE = aRc[6];

                        $scope.total = 0;
                        $scope.page = 1;
                        $scope.pageSize = 4;

                        // $scope.$watch($attrs.ngModel, function(v){
                        //     console.log('region', $scope.region, $scope.page, $scope.pageSize);

                        //     updateSites($scope.region, $scope.page, $scope.pageSize);
                        // });

                        $scope.$watch('region', function (v) {
                            console.log('region', $scope.region, $scope.page, $scope.pageSize);
                            ///////////////console.log($('.networkScore') ;

                            updateSites($scope.region, $scope.page, $scope.pageSize);
                        });
                        //do not touch wangweifang codes
                        $scope.$on('regionRefresh', function () {
                            // hide select while region change
                            $scope.total = 0;
                            // goto first page if region change
                            $scope.pagination.totalPages = 0;

                            updateSites($scope.region, $scope.page, $scope.pageSize);

                        });

                        $scope.$watch('page', function (v) {
                            updateSites($scope.region, $scope.page, $scope.pageSize);
                        });
                        $scope.$watch('pageSize', function (v) {
                            updateSites($scope.region, $scope.page, $scope.pageSize);
                        });

                        // $http.get(URL_GET_REGIONS).then(function success(data){
                        //     if(0 == data.data.code){
                        //         var sRegionId = data.data.data[0].id;
                        //         $scope.region = sRegionId;
                        //         callback(null, sRegionId)
                        //     }
                        //     else{
                        //         callback(data);
                        //     }
                        // });

                        //new begin
                        $scope.delBtn=function(){
                              $alert.confirm("确定删除吗？", function () {
                                $http.delete(sprintf(URL_DELETE_SITE, row.id)).success(function (data) {
                                    if(data.code){
                                        $alert.noticeDanger(data.message);
                                    }else{
                                        refreshTable();
                                        $alert.noticeSuccess('删除场所' + row.shopName + '成功');
                                    }
                                }).error(function (msg) {
                                    $alert.noticeDanger(msg || '请求出错啦~');
                                });
                            });
                        }
                        $('#mouseThing').hover(
                            function(){$('#mouseThing>div').attr('className','bgChange');console.log(11);},
                            function(){$('#mouseThing>div').attr('className','')}
                            );
                        //new end
                        function getHealth (sn, v, i) {
                            async.waterfall([
                                function (callback) { // from v3 first
                                    if (null != sn) {
                                        var sUrl = sprintf(URL_GET_AC_HEALTH, sn);
                                        $http.get(sUrl).then(success, fail);
                                    }
                                    else {
                                        callback(3, RC_NODEVICE);
                                    }

                                    function success(data) {
                                        var bSuccess = false;
                                        if (data.data) {
                                            try {
                                                var score = parseInt(data.data.split('finalscore\\":')[1].split(',')[0]);
                                                v.score = score;
                                                bSuccess = true;
                                            } catch (e) {}
                                        }

                                        console.log(i, sn, bSuccess, v);

                                        if(bSuccess) {
                                            callback(3, v.score); // error as success to skip next
                                        }
                                        else{
                                            callback(null, null);
                                        }

                                        // callback(null, null);
                                    }

                                    function fail() { // goto v2 health
                                        callback(null, null);
                                    }
                                },
                                function (flag, callback) { // use v2 if v3 error
                                    var sUrl = sprintf(URL_GET_SITE_HEALTH, v.id);
                                   
                                    $http.get(sUrl).then(success, fail);
                                    
                                    function success(data) {
                                        console.log(data);
                                        //{"code":0,"message":"查询成功","data":{"data":"离线","type":"1"}}
                                        if(data.data&&data.data.data&&data.data.data.data){
                                            callback(data.data.code, data.data.data.data);
                                        }
                                        else{
                                            callback(2, RC_FAILED);
                                        }
                                    }

                                    function fail(data) {
                                        callback(null, RC_FAILED);
                                    }
                                }
                            ], function(err, message) {
                                
                                // drawPie(i, message, v.url, !err);
                                setTimeout(function(){
                                    //delete by myself  new begin
                                   // drawPie(i, message, v.url, !Number.isNaN(Number(message)) );
                                   //end
                                }, 0);
                            });
                        }

                        function getWanSpeed(sn, v) {
                            if (null != sn) {
                                var sUrl = sprintf(URL_GET_WAN_SPEED, sn);
                                $http.get(sUrl).success(function (data) {
                                    if (data.wan_speed && data.wan_speed[0]) {
                                        v.up = parseInt(data.wan_speed[0].speed_up * 100 / 1024) / 100;
                                        v.down = parseInt(data.wan_speed[0].speed_down * 100 / 1024) / 100;
                                    } 
                                });
                            }
                        }

                        function getApStatistic(sn, v) {
                            if (null != sn) {
                                var sUrl = sprintf(URL_GET_AP_STATISTIC, sn);
                                $http.get(sUrl).success(function (data) {
                                    if (data.ap_statistic) {
                                        v.online = data.ap_statistic.online || 0;
                                        v.offline = data.ap_statistic.offline || 0;
                                    }
                                });
                            }
                        }

                        function getClientCount(sn, v) {
                            if (null != sn) {
                                var sUrl = sprintf(URL_GET_AC_CLIENT_COUNT, sn);
                                $http.get(sUrl).success(function (data) {
                                    v.clientnum = data.clientnum;
                                });
                            }
                        }

                        function updateSites(nRegionId, nPage, nPageSize) {
                            if (!(nRegionId && nPage && nPageSize)) {
                                return;
                            }
                            function success(data) {
                                if (data && 0 == data.code) {
                                   
                                    console.log(data.data.data);
                                    $scope.sites = data.data.data;
                                   
                                    console.log( data);
                                    $scope.total = data.data.rowCount;
                                    updateTotal();
                                    console.log($scope.sites);
                                    $scope.sites[0].display={des:'默认网络',
                                        id: 'v.shopId',
                                        name: '我的网络1',
                                        url: 'v.menuUrl',
                                        online: '2-',
                                        offline: '-2',
                                        score: 90,
                                        up: '3.2',
                                        down: '0.5',
                                        clientnum: '20'
                                    }
                                    $scope.sites[1].display={des:'备用网络',
                                        id: '11',
                                        name: '我的网络2',
                                        url: 'v.menuUrl',
                                        online: '30',
                                        offline: '90',
                                        score: 80,
                                        up: '5.6',
                                        down: '0.3',
                                        clientnum: '250'
                                    }
                                    $scope.sites[2].display={
                                        id: '11',des:'校园网络',
                                        name: '我的网络3',
                                        url: 'v.menuUrl',
                                        online: '49',
                                        offline: '90',
                                        score: 70,
                                        up: '8.5',
                                        down: '1.4',
                                        clientnum: '55'
                                    }
                                    $scope.sites[3].display={des:'宿舍网络',
                                        id: '11',
                                        name: '我的网络4',
                                        url: 'v.menuUrl',
                                        online: '4899',
                                        offline: '90',
                                        score: 60,
                                        up: '5.6',
                                        down: '0.9',
                                        clientnum: '55'
                                    }
                                    // $.each($scope.sites, function (i, v) {
                                    //     var url = (v.menuUrl&&v.menuUrl.indexOf("?")!= -1)?v.menuUrl.split('?')[1]:"";
                                    //     function GetQueryString(url,name) {
                                    //         var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
                                        
                                    //         var r = url.match(reg);
                                    //         if (r!=null) return unescape(r[2]);return null;
                                    //     }
                                    //     if(url!=""&&GetQueryString(url,'model')&&GetQueryString(url,'model')==0){
                                    //         v.menuUrl = "#/scene"+GetQueryString(url,'model')+"/nasid"+GetQueryString(url,'nasid')+
                                    //             "/devsn" +GetQueryString(url,'sn')+"/content/monitor/dashboard5";
                                    //     }
                                    //     if(url!=""&&GetQueryString(url,'model')&&GetQueryString(url,'model')==2){ // use 2 for tmp
                                    //         v.menuUrl = "#/scene5/nasid"+GetQueryString(url,'nasid')+
                                    //             "/devsn" +GetQueryString(url,'sn')+"/content/monitor/dashboard5";
                                    //     }
                                    //      if(url!=""&&GetQueryString(url,'model')&&GetQueryString(url,'model')==5){
                                    //         v.menuUrl = "#/scene"+GetQueryString(url,'model')+"/nasid"+GetQueryString(url,'nasid')+
                                    //             "/devsn" +GetQueryString(url,'sn')+"/content/monitor/dashboard5";
                                    //     }
                                    //     var o = {
                                    //         id: v.shopId,
                                    //         name: v.shopName,
                                    //         url: v.menuUrl,
                                    //         online: '2-',
                                    //         offline: '-2',
                                    //         score: 0,
                                    //         up: '-',
                                    //         down: '-',
                                    //         clientnum: '-'
                                    //     };

                                    //     var sn = v.shop?v.shop.sn:null;
                                    //     console.log(nRegionId, nPage, nPageSize);
                                    //     getHealth(sn, o, i);
                                    //     getWanSpeed(sn, o);
                                    //     getApStatistic(sn, o);
                                    //     getClientCount(sn, o);
                                    //     v.display = o;
                                    // });
                                }
                                else {
                                    // console.log('updateSites:' + data.message);
                                }
                            }

                            function fail(data) {
                            }

                            var sUrl = sprintf(URL_GET_PLACE_INFO_LIST, nRegionId, nPage, nPageSize);
                            $http.get(sUrl).success(success, fail);
                        }

                        function updateTotal(nTotalCount) {
                            var nTotalPage = Math.floor($scope.total / $scope.pageSize) + ((0 != $scope.total % $scope.pageSize) ? 1 : 0);
                            $scope.pagination.totalPages = nTotalPage;
                            if ($scope.page > nTotalPage) {
                                $scope.page = nTotalPage;
                            }
                            if ($scope.page < 1) {
                                $scope.page = 1;
                            }
                        }

                        function drawPie(index, score, url, flag) {
                            var myChart = echarts.init($('.home-charts')[index]);
                            var sum = score;
                            var color = "";
                            if (sum >= 80) {
                                color = "#4ec1b2";
                            } else if (sum >= 60) {
                                color = "#f2bc98";
                            } else {
                                color = "#fe808b";
                            }
                            var option = {
                                series: [
                                {
                                    type: 'pie',
                                    radius: [0, '78%'],
                                    label: {
                                        normal: {
                                            formatter: function () {
                                                return sum;
                                            },
                                            position: "center",
                                            textStyle: {
                                                color: "#ffffff",
                                                fontSize: 26
                                            }
                                        }
                                    },
                                    data: [
                                    {itemStyle: {normal: {color: "#353e4f"}}}
                                    ],
                                    hoverAnimation: false
                                },
                                {
                                    type: 'pie',
                                    radius: ['78%', '100%'],
                                    label: {
                                        normal: {
                                            show: false
                                        }
                                    },
                                    data: [
                                    {value: sum, itemStyle: {normal: {color: color}}},
                                    {value: (100 - sum), itemStyle: {normal: {color: "#ffffff"}}}
                                    ],
                                    hoverAnimation: false
                                }
                                ]
                            };
                            myChart.setOption(option);
                            myChart.on('click', function () {
                                location = url;
                            });

                            if(flag){
                               $('<div class="score-icon">分</div>').appendTo('.home-charts:eq('+index+')');

                            }

                        }
                    }
                };
            }]);
    });
