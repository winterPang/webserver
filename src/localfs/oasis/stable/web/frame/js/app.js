/**
 * app.js
 * created by panglidong@20160919
 * modified by zhaotinghai@20160919
 */
define(['angularAMD', 'jquery', 'async', 'utils', 'angular-ui-router', 'angular-messages', 'bootstrap', 'sprintf'],
    function (angularAMD, $, async, Utils) {

        window.jQuery = jQuery = $;
        var TPL_BASE = '../';

        var URL_ROUTE = "../../init/routes.json"
        var URL_HOME = "/global/content/home";
        var URL_V2_HOME = "https://lvzhou.h3c.com/o2o/o2omng/homePage/homePage.xhtml";
        var URL_USER = sprintf('/web/cas_session?random=%d', Math.random()*1000);
        var URL_DEMO_USER = '/init/user.json';
        var URL_USER_ATTR = '/scenarioserver';
        var URL_DEMO_USER_ATTR = '/init/isNewUser.json';
        var OASIS_TITLE = {
            'cn': "H3C绿洲云平台",
            'en': "H3C OASIS"
        };


        var userUrlObj = Utils.getUrl('GET', '', URL_USER, URL_DEMO_USER);
        var isNewUserUrlObj = Utils.getUrl('POST', '', URL_USER_ATTR, URL_DEMO_USER_ATTR);

        document.title = OASIS_TITLE[Utils.getLang()];

        var mainApp = angular.module("mainApp", ['ui.router', 'ngMessages']);
        
        var requestCache = {};
        function configAndRunAngular(userInfo, oUserAttr) {
            mainApp.config(function ($stateProvider, $urlRouterProvider, $controllerProvider, $httpProvider) {
                console.log("==========angularjs config 函数====================");
                $.ajax({
                    type: "GET",
                    url: URL_ROUTE,
                    dataType: 'json',
                    async: false
                }).success(function (routes) {
                    angular.forEach(routes.routes,
                        function (route, key) {
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
                                init: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    require([route.controller].concat(route.dependencies),
                                        function (controller) {
                                            $controllerProvider.register(route.controller_id, controller);
                                            $rootScope.$apply(function () {
                                                deferred.resolve();
                                            })
                                        });
                                    return deferred.promise;
                                }
                            });
                            $stateProvider.state(route.state,cfg);
                        });
                }).fail(function (data) {
                    console.log(data);
                    console.log("error");
                });
                $urlRouterProvider.when("", URL_HOME);
                $httpProvider.interceptors.push(['$q', '$rootScope', '$alertService', function ($q, $rootScope, $alert) {
                    $rootScope.loading = 0;
                    return {
                        response: function (resp) { 
                            //console.log("===========response====="+resp.config.url)
                            delete requestCache[resp.config._id];
                            if (!resp.config.validate) {
                                $rootScope.loading--;
                            }
                            return resp;
                        },
                        request: function (req) { 
                            var timeOut = $q.defer();
                            req._id = new Date().getTime();
                            req.timeout  = timeOut.promise;
                            if (!req.validate) {
                                $rootScope.loading++;
                            }
                            requestCache[req._id] = {};
                            requestCache[req._id].url = req.url;
                            requestCache[req._id].promise = timeOut;
                            return req;
                        },
                        responseError: function (reject) {
                           // console.log("===========responseErr====="+reject.config.url)
                            delete requestCache[reject.config._id];
                            if ($rootScope.loading > 0) {
                                $rootScope.loading--;
                            }
                            if (reject.status >= 500) {
                                // $alert.noticeWarning('服务器出现错误，请重试!');
                            }
                            return reject;
                        },
                        requestError: function (reject) {
                            //console.log("===========requserErr====="+reject.config.url)
                            delete requestCache[reject.config._id];
                            if ($rootScope.loading > 0) {
                                $rootScope.loading--;
                            }
                            return reject;
                        }
                    };
                }]);
                if (!$httpProvider.defaults.headers.get) {
                    $httpProvider.defaults.headers.get = {};
                }
                $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
                $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';

            }).run(function ($rootScope, $state, $http,$cacheFactory) {
                console.log("==========angularjs run 函数====================");
                /*  2017.04.13 kf6859 $rootScope.userInfo add userInfo isCompleted*/
                $.ajax({
                    type: 'get',
                    url: '/v3/ace/oasis/oasis-rest-user/restapp/users/isUserCompleted',
                    data: {user_name: userInfo.attributes.name},
                    dataType: 'json',
                    contentType: "application/json"
                }).success(function (data) {
                    $rootScope.userInfo.isCompleted = data.data;
                });
                /* 2017.04.13 kf6859 end */
                userInfo.user = userInfo.attributes.name;
                $rootScope.userInfo = userInfo;
                $rootScope.userRoles = oUserAttr.message;
                $rootScope.modalInfo = {count: 0};
                $rootScope.$state = $state;
                $rootScope.lang = Utils.getLang();
                if ($rootScope.userInfo.user == "oasisdemo") {
                    window.location.href = "https://oasisrd.h3c.com/oasis/stable/web/frame/index.html#/oasisdemo/demohome";
                }
                // 切换侧边栏菜单的折叠和展开
                $rootScope.toggleLeftMenu = function (evt) {
                    var me = $(evt.target);
                    var menu = $('.left-menu');
                    // 如果页面有侧边菜单，点击显示，否则点击无效。
                    if (menu.length) {
                        if (me.html() == '&lt;') {
                            menu.animate({
                                    right: 0
                                },
                                300);
                            me.html('&gt;').animate({
                                    right: 130
                                },
                                300);
                        } else {
                            menu.animate({
                                    right: -130
                                },
                                300);
                            me.html('&lt;').animate({
                                    right: 0
                                },
                                300);
                        }
                    }
                };

                // 代理摸态框事件
                $('body').delegate('.modal-content', 'show.bs.modal', function () {
                    // console.log('show_modal..............');
                    if ($rootScope.$$phase) {
                        $rootScope.modalInfo.count++;
                    } else {
                        $rootScope.$apply(function () {
                            $rootScope.modalInfo.count++;
                        });
                    }
                }).delegate('.modal-content', 'hidden.bs.modal', function () {
                    // console.log('hidden_modal..............');
                    if ($rootScope.$$phase) {
                        $rootScope.modalInfo.count--;
                    } else {
                        $rootScope.$apply(function () {
                            $rootScope.modalInfo.count--;
                        });
                    }
                });

                $rootScope.$watch('modalInfo.count', function (v) {
                    var $modalDom = $('.modal-backdrop');
                    $modalDom.length == 0 && ($modalDom = $('<div class="modal-backdrop"></div>').appendTo('body'));
                    v > 0 ? $modalDom.show() : $modalDom.hide();
                }, true);
                // 路由状态修改后隐藏折叠的侧边栏菜单，防止出现菜单为空白的情况
                $rootScope.$on('$stateChangeSuccess', function (e, v) {
                        console.log("=========chanege===========")
                        angular.forEach(requestCache,function(v,k){
                           console.log("=========chanegeurl==========="+v.url)
                           v.promise.resolve();
                        });
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

        //  处理jquery中文URL
        $.ajaxSetup({
            cache: false,
            beforeSend: function (xhr, setting) {
                setting.url = encodeURI(setting.url || '');
            }
        });

        var heartbeat = setInterval(function () {
            $.ajax({
                type: "GET",
                url: "/v3/api/inquireCookies",
                dataType: 'json',
                contentType: "application/json",
                accepts: 'application/json',
                timeout: 10000,
                success: function (data) {
                    if (data.errorcode == 1) {
                        clearInterval(heartbeat);
                        window.location.href = '/v3/logout';
                    }
                },
                error: function (err) {

                }
            });
        }, 60 * 1000);


        async.waterfall([function (callback) {
                $.ajax({
                    type: userUrlObj.method,
                    url: userUrlObj.url,
                    dataType: 'json',
                    contentType: "application/json"
                }).success(function (data) {
                    callback(null, data);
                }).error(function (err) {
                    callback(err);
                });
            },
                function (userInfo, callback) {
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
                    }).success(function (data) {
                        console.log(data);
                        callback(null, userInfo, data);
                    }).error(function (err) {
                        console.log(err);
                        callback(err);
                    })
                }],
            function (err, oUserInfo, oUserAttr) {

                function isNewUser(o) { // if get user or user attr error, goto new page
                    return (err || ( o && o.message && (o.retCode == 0) && (o.message.bUserNew == 'true') ) );
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