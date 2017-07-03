/**
 * app.js
 * created by panglidong@20160919
 * modified by zhaotinghai@20160919
 */
define(['angularAMD', 'jquery', 'async', 'utils', 'angular-ui-router', 'angular-messages', 'bootstrap', 'sprintf'],
    function(angularAMD, $, async, Utils) {

        window.jQuery = jQuery = $;
        var TPL_BASE = '../';
        var URL_ROUTE = "../../init/newroutes.json";
        var URL_HOME = "/homepage";
        var URL_V2_HOME = "https://lvzhou.h3c.com/o2o/o2omng/homePage/homePage.xhtml";
        var URL_USER = sprintf('/web/cas_session?random=%d', Math.random() * 1000);
        var URL_DEMO_USER = '/init/user.json';
        var URL_USER_ATTR = '/scenarioserver';
        var URL_DEMO_USER_ATTR = '/init/isNewUser.json';

        var userUrlObj = Utils.getUrl('GET', '', URL_USER, URL_DEMO_USER);
        var isNewUserUrlObj = Utils.getUrl('POST', '', URL_USER_ATTR, URL_DEMO_USER_ATTR);

        var mainApp = angular.module("mainApp", ['ui.router', 'ngMessages']);

        function configAndRunAngular(userInfo, oUserAttr) {
            mainApp.config(function($stateProvider, $urlRouterProvider, $controllerProvider, $httpProvider) {
                console.log("==========angularjs config 函数====================");
                $.ajax({
                    type: "GET",
                    url: URL_ROUTE,
                    dataType: 'json',
                    async: false
                }).success(function(routes) {
                    angular.forEach(routes.routes,
                        function(route, key) {
                            route.templateUrl = route.templateUrl.split("views");
                            route.templateUrl.splice(1, 0, 'views/', Utils.getLang())
                            route.templateUrl = route.templateUrl.join('');
                            var cfg = {
                                url: route.url,
                                templateUrl: TPL_BASE + route.templateUrl
                            };
                            route.controller_id = "controller" + key;
                            route.controller_id && (cfg.controller = route.controller_id);
                            (route.controller || route.dependencies.length > 0) && (cfg.resolve = {
                                init: function($q, $rootScope) {
                                    var deferred = $q.defer();
                                    require([route.controller].concat(route.dependencies),
                                        function(controller) {
                                            $controllerProvider.register(route.controller_id, controller);
                                            $rootScope.$apply(function() {
                                                deferred.resolve();
                                            })
                                        });
                                    return deferred.promise;
                                }
                            });
                            $stateProvider.state(route.state, cfg);
                        });
                }).fail(function(data) {
                    console.log(data);
                    console.log("error");
                });

                $urlRouterProvider.when("", URL_HOME);

            }).run(function($rootScope, $state, $http) {

                /* 2017.04.13 kf6859 end */
                userInfo.user = userInfo.attributes.name;
                $rootScope.userInfo = userInfo;
                $rootScope.userRoles = oUserAttr.message;
                $rootScope.modalInfo = { count: 0 };
                $rootScope.$state = $state;
                $rootScope.lang = Utils.getLang();
                // 切换侧边栏菜单的折叠和展开

                // 代理摸态框事件
                $('body').delegate('.modal-content', 'show.bs.modal', function() {
                    // console.log('show_modal..............');
                    if ($rootScope.$$phase) {
                        $rootScope.modalInfo.count++;
                    } else {
                        $rootScope.$apply(function() {
                            $rootScope.modalInfo.count++;
                        });
                    }
                }).delegate('.modal-content', 'hidden.bs.modal', function() {
                    // console.log('hidden_modal..............');
                    if ($rootScope.$$phase) {
                        $rootScope.modalInfo.count--;
                    } else {
                        $rootScope.$apply(function() {
                            $rootScope.modalInfo.count--;
                        });
                    }
                });

                $rootScope.$watch('modalInfo.count', function(v) {
                    var $modalDom = $('.modal-backdrop');
                    $modalDom.length == 0 && ($modalDom = $('<div class="modal-backdrop"></div>').appendTo('body'));
                    v > 0 ? $modalDom.show() : $modalDom.hide();
                }, true);

                // 路由状态修改后隐藏折叠的侧边栏菜单，防止出现菜单为空白的情况
                $rootScope.$on('$stateChangeSuccess',
                    function(e, v) {
                        var menu = $('.left-menu');
                        menu.css({
                            right: -130
                        });
                        $('.btn-show-submenu').html('&lt;').css({
                            right: 0
                        });
                    });
            });
        }
        // TODO  后面需要放开
        // var heartbeat = setInterval(function () {
        //     $.ajax({
        //         type: "GET",
        //         url: "/v3/api/inquireCookies",
        //         dataType: 'json',
        //         contentType: "application/json",
        //         accepts: 'application/json',
        //         timeout: 10000,
        //         success: function (data) {
        //             if (data.errorcode == 1) {
        //                 clearInterval(heartbeat);
        //                 window.location.href = '/v3/logout';
        //             }
        //         },
        //         error: function (err) {
        //         }
        //     });
        // }, 5000);

        async.waterfall([function(callback) {
                    $.ajax({
                        type: userUrlObj.method,
                        url: userUrlObj.url,
                        dataType: 'json',
                        contentType: "application/json"
                    }).success(function(data) {
                        callback(null, data);
                    }).error(function(err) {
                        callback(err);
                    });
                },
                function(userInfo, callback) {
                    var reqData = {
                        "Method": "getUserAttr",
                        "param": {
                            "userName": userInfo.attributes.name
                        }
                    };
                    $.ajax({
                        type: isNewUserUrlObj.method,
                        url: isNewUserUrlObj.url,
                        dataType: 'json',
                        contentType: "application/json",
                        data: JSON.stringify(reqData)
                    }).success(function(data) {
                        console.log(data);
                        callback(null, userInfo, data);
                    }).error(function(err) {
                        console.log(err);
                        callback(err);
                    })
                }
            ],
            function(err, oUserInfo, oUserAttr) {

                function isNewUser(o) { // if get user or user attr error, goto new page
                    return (err || (o && o.message && (o.retCode == 0) && (o.message.bUserNew == 'true')));
                }

                if (isNewUser(oUserAttr)) {
                    configAndRunAngular(oUserInfo, oUserAttr);
                    angularAMD.bootstrap(mainApp);
                } else {
                    $.get("/v3/logout");
                    window.location.href = URL_V2_HOME;
                }
            });
        return mainApp;
    });