define(["angularAMD", "utils", "sprintf"], function (app, Utils) {
    // GetLang
    var LANG = Utils.getLang() || "cn";
    // TemplateUrl
    var URL_MyAppTpl = sprintf("../appmanage/views/%s/my_app.html", LANG);
    var URL_HotAppTpl = sprintf("../appmanage/views/%s/hot_app.html", LANG);
    // my-app
    app.directive("myApp", function ($filter,$alertService,$state,$window,appSer) {
        return {
            restrict: "A",
            replace: true,
            transclude: true,
            templateUrl: URL_MyAppTpl,
            scope: {
                data: "=myApp"
            },
            link: function (scope) {
                scope.curChoose = 2;
                scope.showData = null;
                scope.choose = function (type) {
                    scope.curChoose = type;
                    if (scope.curChoose == 0) {
                        scope.my_app_data = $filter("filter")(scope.data, {status: 0});
                    } else if (scope.curChoose == 1) {
                        scope.my_app_data = $filter("filter")(scope.data, {status: 1});
                    } else {
                        scope.my_app_data = scope.data;
                    }
                    refresh(1);
                };
                scope.turnPage = function (id, operateUrl) {

                    if (!operateUrl) {return;} // 无跳转

                    if (operateUrl.search(/\$yunwei\$/) !== -1) { // $name$ - 运维
                        appSer.getDevList().success(function (data) {
                            if (data.retCode !==0) {return;}
                            var arr = [];
                            angular.forEach(data.message, function (v) {
                                if (arr.length) {return}
                                if (v.model==='0'||v.model==='2'||v.model==='5') {
                                    arr.push({
                                        nasid: v.scenarioId,
                                        devsn: v.devSN
                                    });
                                }
                            });
                            var sref = '/oasis/stable/web/frame/index.html#/scene88/nasid%d/devsn%s/content/monitor/dashboard88';
                            if (operateUrl.search(/\^/) !== -1) {
                                $window.open( sprintf(sref, arr[0].nasid, arr[0].devsn) );
                            } else {
                                $window.location.href = sprintf(sref, arr[0].nasid, arr[0].devsn);
                            }
                        });
                        return;
                    }

                    operateUrl = operateUrl.replace(/\*/, id);

                    if (operateUrl.search(/\^/) !== -1) { // 需要重新开启tab页的跳转 - 大屏
                        $window.open(operateUrl.replace(/\^/, ''));
                    } else {
                        $window.location.href = operateUrl;
                    }
                    
                };
                scope.$watch("data", function (newVal) {
                    if (!newVal) {return;}
                    scope.my_app_data = scope.data;
                    refresh(1);
                });

                function refresh(page_num)
                {
                    var g_pageSize = 12;
                    scope.count = scope.my_app_data.length;
                    scope.pageCount=Math.ceil(scope.count/g_pageSize);
                    scope.currentPage = page_num;
                    scope.showData = scope.my_app_data.slice((scope.currentPage-1)*g_pageSize,g_pageSize*(scope.currentPage));
                    if(scope.count == 0)
                    {
                        scope.pageCount = 1;
                    }
                    scope.pageArr = [];
                    for(var i=0;i<scope.pageCount;i++)
                    {
                        scope.pageArr.push(i+1);
                    }
                    scope.pageNum = scope.currentPage;
                    if(scope.pageCount <= 5)
                    {
                        scope.pageNumData = scope.pageArr;
                    }
                    else
                    {
                        if(scope.currentPage > 3)
                        {
                            var value = scope.pageCount - page_num;
                            if(value >= 3)
                            {
                                scope.pageNumData = [1,"...",page_num-1,page_num,page_num+1,"...",scope.pageCount];
                            }
                            else if(value == 3)
                            {
                                scope.pageNumData = [1,"...",page_num,page_num+1,page_num+2,page_num+3];
                            }
                            else
                            {
                                scope.pageNumData = [1,"...",scope.pageCount-2,scope.pageCount-1,scope.pageCount];
                            }
                        }
                        else
                        {
                            scope.pageNumData = [1,2,3,"...",scope.pageCount];
                        }
                    }
                }

                scope.paging = function(e)
                {
                    if(e == "previous")
                    {
                        scope.currentPage == 1 ? $alertService.msgDialogError(scope.first_page)
                            : scope.currentPage--;
                    }
                    else if(e == "next")
                    {
                        scope.currentPage == scope.pageCount ? $alertService.msgDialogError(scope.last_page)
                            : scope.currentPage++;
                    }
                    else
                    {
                        scope.currentPage = e;
                    }
                    refresh(scope.currentPage);
                }

                //change �¼� ѡ��ҳ��
                scope.selectPage = function()
                {
                    scope.currentPage = scope.pageNum;
                    refresh(scope.currentPage);
                }

            }
        };
    });
    // hot-app
    app.directive("hotApp", function ($rootScope, $window, $interval) {
        var nLeft = 0;
        var  getShowItem = function (width) {
            var n;
            if (width >= 1440) {
                n = 4;
            } else if ((width>1168 && width<1439)||(width>883 && width<992)) {
                n = 3;
            } else if ((width>993 && width<1167) || (width>609 && width<882)) {
                n = 2;
            } else {
                n = 1;
            }
            return n;
        };
        return {
            restrict: "A",
            replace: true,
            templateUrl: URL_HotAppTpl,
            transclude: true,
            scope: {
                items: "=hotApp"
            },
            link: function (scope, ele) {

                var jUl = $("#hotApp ul");
                var jLeft = ele.find("span:first-child");
                var jRight = ele.find("span:last-child");

                scope.$watch("items", function (newVal) {
                    if (!newVal) {return;}
                    scope.n = {
                        showCount: getShowItem($window.innerWidth),
                        totalCount: scope.items.length/2
                    };

                    function setTimer (n) {
                        return $interval(function () {
                            nLeft -= n;
                            ele.find("ul").css("left", nLeft);
                            if (nLeft <= (scope.n.totalCount) * -290) {
                                nLeft = 0;
                            }
                            if (nLeft > 0) {
                                nLeft = (scope.n.totalCount) * -290;
                            }
                        }, 20);
                    }
                    var timer = setTimer(2);

                    $window.onresize = function () {
                        scope.n.showCount = getShowItem($window.innerWidth);
                    };

                    jUl.hover(function () {
                        $interval.cancel(timer);
                    }, function () {
                        timer = setTimer(2);
                    });

                    function timerInit() {
                        $interval.cancel(timer);
                        timer = setTimer(2);
                    }

                    jLeft.bind("mousedown", function () {
                        $interval.cancel(timer);
                        timer = setTimer(-10);
                    }).bind("mouseup mouseleave", function () {
                        timerInit();
                    });

                    jRight.bind("mousedown", function () {
                        $interval.cancel(timer);
                        timer = setTimer(10);
                    }).bind("mouseup mouseleave", function () {
                        timerInit();
                    });

                    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                        $interval.cancel(timer);
                    });


                });



            }
        };


    });


});