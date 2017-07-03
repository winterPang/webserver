/**
 * Created by Administrator on 2017/5/15.
 */
define(['jquery', 'utils', 'css!appmanage/css/style', 'css!appmanage/css/advert_new'], function ($, utils) {
    return ['$scope', '$http', '$alertService', '$stateParams','$filter', function ($scope, $http, $alert, $stateParams,$filter) {
        var _rcCache = {};
        var URL_GET_ADVERT_INFO = '/v3/ace/oasis/oasis-rest-application/restapp/appStore/ad/selectedPage/';
        var getShopAcSsidListURL = '/v3/ace/oasis/oasis-rest-application/restapp/appOperators/getShopAcList';
        var startAdURL = '/v3/ace/oasis/oasis-rest-application/restapp/appOperators/startAd?appId=' + $stateParams.appId;
        var stopAdURL = '/v3/ace/oasis/oasis-rest-application/restapp/appOperators/stopAd?appId=' + $stateParams.appId;
        var pauseAdURL = '/v3/ace/oasis/oasis-rest-application/restapp/appOperators/pauseAd?appId=' + $stateParams.appId;
        var withdrawAdURL = '/v3/ace/oasis/oasis-rest-application/restapp/appOperators/withdrawAd?appId=' + $stateParams.appId;
        var adPlatformURL = '/v3/ace/oasis/oasis-rest-application/restapp/appOperators/adPlatform?appId=' + $stateParams.appId;
        var defaultPageURL = '/v3/ace/oasis/oasis-rest-application/restapp/appOperators/ad/defaultPage';
        var selectedPageURL = '/v3/ace/oasis/oasis-rest-application/restapp/appOperators/ad/selectedPage';
        var appUserURL = '/v3/ace/oasis/oasis-rest-application/restapp/appStore/appUser?appId=' + $stateParams.appId;

        function getRcString(key) {
            if (!_rcCache[key]) {
                _rcCache[key] = $('#advertRc').attr(key);
            }
            return _rcCache[key];
        }
        //控制btn是否可用
        $scope.disable_using = true; // 启用
        $scope.disable_pause = true; //暂停 停止
        $scope.only_one = true; // 配置页面
        $scope.advert_default = true; // 广告平台 注销

        // 控制nav Class active
        $scope.operation_this = "active_shop";
        getAppUser();
        function getAppUser()
        {
            $http.get(appUserURL).success(function (data) {
                if(data.code == 0)
                {
                    data.data.status == 1 ? $scope.advert_default = false
                                          : $scope.advert_default = true;
                }
                else
                {
                    $alert.msgDialogError(getRcString('requestError'));
                }
            }).error(function () {
                $alert.msgDialogError(getRcString('requestError'));
            });
        }

        getShopAcSsidList();
        function getShopAcSsidList()
        {
            $http.get(getShopAcSsidListURL).success(function (data) {
                if(data.code == 0)
                {
                    $scope.shopData = data.data;
                    $scope.shopSelected = $scope.shopData[0].shopId;
                    shopFilter();
                }
                else
                {
                    $alert.msgDialogError(getRcString('requestError'));
                }
            }).error(function () {
                $alert.msgDialogError(getRcString('requestError'));
            });
        }

        function shopFilter(e)
        {
            if(e)
            {
                angular.forEach($scope.shopData,function(item,k,array){
                    if(item.shopId == e)
                    {
                        $scope.devsnData = item.acList;
                    }
                })
            }
            else
            {
                $scope.devsnData = $scope.shopData[0].acList;
                $scope.devsnSelected = $scope.devsnData[0];
                getSsidList();
            }

        }

        function getSsidList()
        {
            $scope.disable_using = true;
            $scope.disable_pause = true;
            $scope.only_one = true;
            $scope.selected = [];
            $scope.selectedSsidList = [];
            var getSsidListURL =  '/v3/ace/oasis/oasis-rest-application/restapp/appOperators/getSsidList/'+$scope.devsnSelected+'?appId='+$stateParams.appId+'&shopId='+$scope.shopSelected;
            $http.get(getSsidListURL).success(function (data) {
                if(data.code == 0)
                {
                    $scope.ssidData = data.data;
                    angular.forEach($scope.ssidData,function(item,k,array){
                        item.ssidSelected = false;
                    })
                }
                else
                {
                    $alert.msgDialogError(getRcString('requestError'));
                }
            }).error(function () {
                $alert.msgDialogError(getRcString('requestError'));
            });
        }

        $scope.selShop = function(e)
        {
            $scope.operation_this = "active_shop";
            $scope.shopSelected = e;
            $scope.devsnSelected = "";
            $scope.ssidData = [];
            $scope.selected = [];
            $scope.selectedSsidList = [];
            shopFilter(e);
        }

        $scope.selDevsn = function(e)
        {
            $scope.operation_this = "active_devsn";
            $scope.devsnSelected = e;
            $scope.selected = [];
            $scope.selectedSsidList = [];
            getSsidList();
            updateSelected();
        }

        $scope.SelSsid = function($event,ssidName,status){
            $scope.operation_this = "active_ssid";
            var checkbox = $event.target;
            var action = (checkbox.checked?'add':'remove');
            if(action == 'add')
            {
                angular.forEach($scope.ssidData,function(item,k,array){
                    if(ssidName == item.ssidName)
                    {
                        item.ssidSelected = true;
                    }
                })
            }
            if(action == 'remove')
            {
                angular.forEach($scope.ssidData,function(item,k,array){
                    if(ssidName == item.ssidName)
                    {
                        item.ssidSelected = false;
                    }

                })
            }
            updateSelected(action,ssidName,status);
        }

        $scope.selected = [];
        $scope.selectedSsidList = [];

        var updateSelected = function(action,ssidName,status){
            if(action == 'add' && $scope.selectedSsidList.indexOf(ssidName) == -1 )
            {
                $scope.selected = $scope.selected.concat(status);
                $scope.selectedSsidList.push(ssidName);
            }
            if(action == 'remove' && $scope.selectedSsidList.indexOf(ssidName)!=-1)
            {
                var idx = $scope.selectedSsidList.indexOf(ssidName);
                $scope.selected.splice(idx,1);
                $scope.selectedSsidList.splice(idx,1);
            }

            $scope.sendData = {
                shopId:$scope.shopSelected,
                acSn:$scope.devsnSelected,
                ssidList:$scope.selectedSsidList,
            };

            $scope.disable_btn = true;
            angular.forEach($scope.selected,function(item,k,array){
                if(item == 0)
                {
                    $scope.disable_btn = false;
                }
            })

            if($scope.disable_btn == true)
            {
                $scope.disable_using = false;
                $scope.disable_pause = false;
            }
            else
            {
                $scope.disable_using = false;
                $scope.disable_pause = true;
            }
            if($scope.selected.length == 1 && $scope.disable_btn == true)
            {
                $scope.only_one = false;
                $scope.defaultPageData = {
                    appId:$stateParams.appId,
                    shopId:$scope.shopSelected,
                    acSn:$scope.devsnSelected,
                    ssid:ssidName,

                };
            }
            else
            {
                $scope.only_one = true;
            }

            if($scope.selected.length == 0)
            {
                $scope.disable_btn = true;
                $scope.disable_using = true;
                $scope.disable_pause = true;
                $scope.only_one = true;
            }
        }

        $scope.isSelected = function(ssidName){
            return $scope.selected.indexOf(ssidName)>=0;
        }

        $scope.startAd = function()
        {
            $scope.operation_this = "active_buttons";
            $http.post(startAdURL, JSON.stringify($scope.sendData)).success(function (data) {
                if (data && data.code == 0)
                {
                    $alert.msgDialogSuccess(getRcString('startSucc'));
                    $scope.operation_this = "active_devsn";
                    getSsidList();
                    getAppUser();
                }
                else
                {
                    $alert.msgDialogError(getRcString('startFail'));
                }
            }).error(function () {
                $alert.msgDialogError(getRcString('startFail'));
            });
        }

        $scope.stopAd = function()
        {
            $scope.operation_this = "active_buttons";
            $http.post(stopAdURL, JSON.stringify($scope.sendData)).success(function (data) {
                if (data && data.code == 0)
                {
                    $alert.msgDialogSuccess(getRcString('stopSucc'));
                    $scope.operation_this = "active_devsn";
                    getSsidList();
                    getAppUser();
                }
                else
                {
                    $alert.msgDialogError(data.message || getRcString('stopFail'));
                }

            }).error(function () {
                $alert.msgDialogError(getRcString('stopFail'));
            });
        }
        $scope.pauseAd = function()
        {
            $scope.operation_this = "active_buttons";
            $http.post(pauseAdURL, JSON.stringify($scope.sendData)).success(function (data) {
                if (data && data.code == 0)
                {
                    $alert.msgDialogSuccess(getRcString('pauseSucc'));
                    $scope.operation_this = "active_devsn";
                    getSsidList();
                    getAppUser();
                }
                else
                {
                    $alert.msgDialogError(data.message || getRcString('pauseFail'));
                }
            }).error(function () {
                $alert.msgDialogError(getRcString('pauseFail'));
            });
        }

        $scope.defaultPage = function()
        {
	        $scope.operation_this = "active_buttons";
            $http.post(defaultPageURL, JSON.stringify($scope.defaultPageData)).success(function (data) {
                if (data && data.code == 0)
                {
                    $.each($(".move"),function(i,item){
                        item.style.left = 0 +"px";
                    });
                    $scope.Imghide = false;
                    $scope.Righthide = false;
                    $scope.Lefthide = false;
                    if (data.code == 0) {
                        $scope.detailInfo = {
                            ad_home: data.data.selectedPage.ad_home == 'enable',
                            ad_portal: data.data.selectedPage.ad_portal == 'enable',
                            ad_index: data.data.selectedPage.ad_index == 'enable',
                            ad_login: data.data.selectedPage.ad_login == 'enable'
                        };
                        if(data.data.selectedPage.ad_index === undefined){
                            $scope.$broadcast('show#SmallModel');
                        }else
                        if(data.data.selectedPage.ad_index !== undefined){
                            $scope.$broadcast('show#BigModel');
                            //$scope.$broadcast('show#MoveModel');
                        }
                        $scope.detailShow = data.data.selectedPage;
                    } else {
                        $alert.msgDialogError(data.message);
                    }
                }
                else
                {
                    $alert.msgDialogError(getRcString('stopFail'));
                }
                getAppUser();
                getShopAcSsidList();
            }).error(function () {
                $alert.msgDialogError(getRcString('stopFail'));
                getAppUser();
                getShopAcSsidList();
            });
        }

        $scope.ImghideClack = function(){
            $.each($(".move"),function(i,item){
                item.style.left = -185.4 +"px";
            })
            $scope.Imghide = true;
            $scope.Righthide = true;
            $scope.Lefthide = true;
        }

        $scope.ImgRightClack = function(){
            $scope.Lefthide = true;
            $.each($(".move"),function(i,item){
                item.style.left = parseFloat(item.style.left) - 185.4 +"px";
                if(parseFloat(item.style.left) < -370){
                    $scope.Righthide = false;
                }
            })
        }

        $scope.ImgLeftClack = function(){
            $scope.Righthide = true;
            $.each($(".move"),function(i,item){
                item.style.left = parseFloat(item.style.left) + 185.4 +"px";
                if(parseFloat(item.style.left) >= 0){
                    $scope.Lefthide = false;
                }
            })
        }

        //移动的模态框
        $scope.MoveModel = {
            mId:'MoveModel',
            title:getRcString('configAdvert'),
            modalSize:'lg' ,
            okHandler: function(modal,$ele){
                var postData = {};
                $.each($scope.detailInfo, function (k, v) {
                    if ($scope.detailShow[k]) {
                        postData[k] = v ? 'enable' : 'disable';
                    }
                });
                $scope.defaultPageData.selectedPage = JSON.stringify(postData);
                $http.post(selectedPageURL, $scope.defaultPageData)
                    .success(function (data) {
                        console.log($scope.defaultPageData);
                        if (data && data.code == 0) {
                            $alert.msgDialogSuccess(getRcString('configSucc'));
                            $scope.$broadcast('refresh');
                        } else {
                            $alert.msgDialogError(data.message);
                        }
                    })
                    .error(function () {
                        $alert.msgDialogError(getRcString('requestError'));
                    });
            },
        };
        //小模态框
        $scope.SmallModel = {
            mId:'SmallModel',
            title:getRcString('configAdvert'),
            modalSize:'normal' ,
            okHandler: function(modal,$ele){
                var postData = {};
                $.each($scope.detailInfo, function (k, v) {
                    if ($scope.detailShow[k]) {
                        postData[k] = v ? 'enable' : 'disable';
                    }
                });
                $scope.defaultPageData.selectedPage = JSON.stringify(postData);
                $http.post(selectedPageURL, $scope.defaultPageData)
                    .success(function (data) {
                        if (data && data.code == 0) {
                            $alert.msgDialogSuccess(getRcString('configSucc'));
                            $scope.$broadcast('refresh');
                        } else {
                            $alert.msgDialogError(data.message);
                        }
                    })
                    .error(function () {
                        $alert.msgDialogError(getRcString('requestError'));
                    });
            },
        };
        //大模态框
        $scope.BigModel = {
            mId:'BigModel',
            modalSize:'lg' ,
            title: getRcString('configAdvert'),
            okHandler: function () {
                var postData = {};
                $.each($scope.detailInfo, function (k, v) {
                    if ($scope.detailShow[k]) {
                        postData[k] = v ? 'enable' : 'disable';
                    }
                });
                $scope.defaultPageData.selectedPage = JSON.stringify(postData);
                $http.post(selectedPageURL, $scope.defaultPageData)
                    .success(function (data) {
                        if (data && data.code == 0) {
                            $alert.msgDialogSuccess(getRcString('configSucc'));
                            $scope.$broadcast('refresh');
                        } else {
                            $alert.msgDialogError(data.message);
                        }
                    })
                    .error(function () {
                        $alert.msgDialogError(getRcString('requestError'));
                    });
            }
        };

        $scope.withdrawAd = function()
        {
            $scope.operation_this = "active_shop";
            $alert.confirm(getRcString('note_withdraw'),function(){
                $http.get(withdrawAdURL).success(function (data) {
                    if(data && data.code == 0)
                    {
                        $alert.msgDialogSuccess(getRcString('withdrawSucc'));
                        getAppUser();
                        getShopAcSsidList();
                    }
                    else
                    {
                        $alert.msgDialogError(getRcString('withdrawFail'));
                    }
                }).error(function () {
                    $alert.msgDialogError(getRcString('requestError'));
                });
            })
        }
        $scope.adPlatform = function()
        {
            $http.get(adPlatformURL).success(function (data) {
                if(data.code == 0)
                {
                    window.open(data.data)
                }
                else
                {
                    $alert.msgDialogError(getRcString('requestError'));
                }
            }).error(function () {
                $alert.msgDialogError(getRcString('requestError'));
            });
        }
        
        $scope.showExplain = function()
        {
            $scope.$broadcast('show#explain',$scope);
        }

        $scope.explainOpt={
            mId:'explain',
            title:"使用说明",
            autoClose: true,
            showCancel: true,
            showHeader: true,
            showFooter: false,
            buttonAlign: "center",
            modalSize:'normal',
            okHandler: function(modal,$ele){
            },
            cancelHandler: function(modal,$ele){

            },
            beforeRender: function($ele){
                return $ele;
            }
        }


    }];
});