define(['jquery','utils' ,'appstore/libs/carousel', 'css!appstore/css/carousel', 'css!appstore/css/style','appstore/filter/h_filter'], function ($,Utils) {
    return ['$scope', '$http', '$window','$filter','$alertService','$timeout','$sce',function ($scope, $http, $window,$filter,$alert,$timeout,$sce) {
        $(function(){
            function getRcString(attrName){
                return Utils.getRcString("appstore_rc",attrName);
            }
            var g_typeCountArr = [];
            var g_pageSize;

            //全部应用类型
            $http({
                url: '/v3/ace/oasis/oasis-rest-application/restapp/appTypeCenter/appTypes/all',
                method:"GET",
                contentType: "application/json",
            }).success(function(data){
                if(data.code == 0)
                {
                    $scope.typeData = data.data.data;
                    getAppList();
                }
                else
                {
                    $alert.msgDialogError(getRcString('apps-error'));
                }
            }).error(function(data){
                $alert.msgDialogError(getRcString('apps-error'));
            })

            //获取app
            function getAppList()
            {
                //热门应用
                $http({
                url:  '/v3/ace/oasis/oasis-rest-application/restapp/appStore/applications/hots',
                method:"GET",
                contentType: "application/json",
                params:{
                    user_name:$scope.userInfo.user,
                    topNum:12
                }
                }).success(function(data){
                    if(data.code == 0)
                    {
                        $scope.hot_data = data.data.data;
                        $scope.currentData = $scope.hot_data;
                        refresh($scope.hot_data,1);
                    }
                    else
                    {
                        $alert.msgDialogError(getRcString('hots-error'));
                    }
                }).error(function(data){
                    $alert.msgDialogError(getRcString('hots-error'));
                })

                //最新应用
                $http({
                    url:  '/v3/ace/oasis/oasis-rest-application/restapp/appStore/applications/news',
                    method:"GET",
                    contentType: "application/json",
                    params:{
                        user_name:$scope.userInfo.user,
                        topNum:12
                    }
                }).success(function(data){
                    if(data.code == 0)
                    {
                        $scope.new_data = data.data.data;
                    }
                    else
                    {
                        $alert.msgDialogError(getRcString('new-error'));
                    }
                }).error(function(data){
                    $alert.msgDialogError(getRcString('new-error'));
                })

                //全部应用
                $http({
                    url:  '/v3/ace/oasis/oasis-rest-application/restapp/appStore/applications/all',
                    method:"GET",
                    contentType: "application/json",
                    params:{
                        user_name:$scope.userInfo.user,
                    }
                }).success(function(data){
                    if(data.code == 0)
                    {
                        $scope.all_data = data.data.data;
                        angular.forEach($scope.typeData,function(v,k,array){
                            var apptype = [];
                            angular.forEach($scope.all_data,function(item,i,array){
                                if(v.id == item.typeId){
                                    apptype.push(item);
                                }
                            })
                            g_typeCountArr.push(apptype);
                        })
                    }
                    else
                    {
                        $alert.msgDialogError(getRcString('all-error'));
                    }
                }).error(function(data){
                    $alert.msgDialogError(getRcString('all-error'));
                })
            }

            //刷数据到页面
            function refresh(appData,page_num,data_search)
            {
                g_pageSize = 12;
                $scope.app_data = appData;
                $scope.current_data = $.extend(true, [], appData);
                if(data_search)
                {
                    $scope.current_data = $.extend(true, [], data_search);
                }
                if(!data_search)
                {
                    angular.forEach($scope.current_data,function(item,i,array){
                        item.name = $sce.trustAsHtml(item.name);
                        item.description = $sce.trustAsHtml(item.description);
                    })
                }
                $scope.count = $scope.current_data.length;
                $scope.pageCount=Math.ceil($scope.count/g_pageSize);
                $scope.currentPage = page_num;
                $scope.show_data = $scope.current_data.slice(($scope.currentPage-1)*g_pageSize,g_pageSize*($scope.currentPage));
                angular.forEach($scope.typeData,function(v,k,array){
                    angular.forEach($scope.show_data,function(item,i,array){
                        if(v.id == item.typeId){
                            $scope.show_data[i].appName = v.name;
                        }
                    })
                })

                if($scope.count == 0)
                {
                    $scope.pageCount = 1;
                }
                $scope.pageArr = [];
                for(var i=0;i<$scope.pageCount;i++)
                {
                    $scope.pageArr.push(i+1);
                }
                $scope.pageNum = $scope.currentPage;
                if($scope.pageCount <= 5)
                {
                    $scope.pageNumData = $scope.pageArr;
                }
                else
                {
                    if($scope.currentPage > 3)
                    {
                        var value = $scope.pageCount - page_num;
                        if(value >= 3)
                        {
                            $scope.pageNumData = [1,"...",page_num-1,page_num,page_num+1,"...",$scope.pageCount];
                        }
                        else if(value == 3)
                        {
                            $scope.pageNumData = [1,"...",page_num,page_num+1,page_num+2,page_num+3];
                        }
                        else
                        {
                            $scope.pageNumData = [1,"...",$scope.pageCount-2,$scope.pageCount-1,$scope.pageCount];
                        }
                    }
                    else
                    {
                        $scope.pageNumData = [1,2,3,"...",$scope.pageCount];
                    }
                }
            }

            $scope.img = function(url)
            {
                var test = new Image();
                test.src = url;
                var width = test.width;
                var height = test.height;
                if(width >= height)
                {
                    $scope.imageSize = true;
                }
                else
                {
                    $scope.imageSize = false;
                }
            }

            $scope.color = "hot";
            $scope.clickOne = function(e)
            {
                $("#search_app").val("");
                $scope.color = e;
                if(e == "hot")
                {
                    appData = $scope.hot_data;
                }
                else if(e == "new")
                {
                    appData = $scope.new_data;
                }
                else if(e == "all")
                {
                    appData = $scope.all_data;
                }
                else
                {
                    var typeid = e;
                    angular.forEach(g_typeCountArr,function(item,i,array){
                        if(typeid == item[0].typeId)
                        {
                            appData = item;
                        }
                    })

                }
                $scope.currentData = appData;
                refresh(appData,1);
            }

            $scope.paging = function(e)
            {
                if(e == "previous")
                {
                    $scope.currentPage == 1 ? $alert.msgDialogError(getRcString('first_page'))
                                            : $scope.currentPage--;
                }
                else if(e == "next")
                {
                    $scope.currentPage == $scope.pageCount ? $alert.msgDialogError(getRcString('last_page'))
                                                           : $scope.currentPage++;
                }
                else
                {
                    $scope.currentPage = e;
                }
                refresh($scope.app_data,$scope.currentPage,$scope.data_search);
            }

            //change 事件 选择页码
            $scope.selectPage = function()
            {
                $scope.currentPage = $scope.pageNum;
                refresh($scope.app_data,$scope.currentPage,$scope.data_search);
            }

            $scope.datashow = false;
            $scope.searchApp = function()
            {
                var searchData = $.extend(true, [], $scope.app_data);
                $scope.data_search = $filter('myFilter')(searchData,['name','description'],$scope.mySearch);
                angular.forEach($scope.data_search,function(item,i,array){
                    item.name = $filter('hightLight')(item.name,$scope.mySearch);
                    item.description = $filter('hightLight')(item.description,$scope.mySearch);
                })
                if($scope.data_search.length == 0)
                {
                    $scope.datashow = true;
                    refresh($scope.app_data,1,$scope.data_search)
                }
                else
                {
                    refresh($scope.app_data,1,$scope.data_search)
                    $scope.datashow = false;
                }
            }
    



            /*
            * liuyanping kf6877
            * 2017/3/10
            * 轮播start
            * */
            $timeout(function () {
                $(".poster-main").height($(".poster-main").width()*0.32*0.75);
            });
            $http.get('/v3/ace/oasis/oasis-rest-application/restapp/appStore/application/appCarousels').success(function(data){
                if(data.code == 0){
                    if(data.data.data.length){
                        $scope.carousels = data.data.data;
                        $timeout(function(){
                            Carousel.init($(".pictureSlider"));
                            $scope.slideTo = function(e){
                                var from = $(e.target).parent().children("li.active").attr("data-slide-to");
                                var to = $(e.target).attr("data-slide-to");
                                Carousel.prototype.toggleImg(from,to,$(".pictureSlider"));
                            };
                        });
                    }
                }
            });
            $scope.$on('$destroy',function () {
                if (Array.isArray(window.cars)){
                    $.each(window.cars,function (i, c) {
                        window.clearInterval(c.timer);
                    });
                    window.cars = [];
                }
            });
            $(window).resize(function(){
                $(".circleP").find(".active").removeClass("active");
                $(".circleP").find("li").eq(0).addClass("active");
            });
            /*
             * liuyanping kf6877
             * 2017/3/10
             * 轮播end
             * */


        });
    }];
});