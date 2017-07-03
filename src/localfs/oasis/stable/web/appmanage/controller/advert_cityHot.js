/**
 * Created by Administrator on 2017/6/22.
 */
/**
 * Created by Administrator on 2017/5/15.
 */
define(['jquery', 'utils', 'css!appmanage/css/style', 'css!appmanage/css/advert_new'], function ($, utils) {
    return ['$scope', '$http', '$alertService', '$stateParams','$filter', function ($scope, $http, $alert, $stateParams,$filter) {
        var _rcCache = {};
        var URL_GET_ADVERT_INFO = '/v3/ace/oasis/oasis-rest-application/restapp/appStore/ad/selectedPage/';
        var getShopAcSsidListURL = '/v3/ace/oasis/oasis-rest-application/restapp/appOperators/getShopAcs';
        var updateDrURL = '/v3/ace/oasis/oasis-rest-application/restapp/appOperators/updateDr?appId=' + $stateParams.appId;
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
                if(data && data.code == 0)
                {
                    data.data.status == 1 ? $scope.advert_default = false
                        : $scope.advert_default = true;
                }
                else
                {
                    $scope.advert_default = true;
                }
            }).error(function () {
                $scope.advert_default = true;
            });
        }

        getShopAcSsidList();
        function getShopAcSsidList()
        {
            $http.get(getShopAcSsidListURL).success(function (data) {
                if(data && data.code == 0)
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
            $scope.ssidNameIndex = [];
            var getSsidListURL =  '/v3/ace/oasis/oasis-rest-application/restapp/appOperators/getSsids/'+$scope.devsnSelected+'?appId='+$stateParams.appId+'&shopId='+$scope.shopSelected;
            $http.get(getSsidListURL).success(function (data) {
                if(data && data.code == 0)
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
            $scope.ssidNameIndex = [];
            shopFilter(e);
        }

        $scope.selDevsn = function(e)
        {
            $scope.operation_this = "active_devsn";
            $scope.devsnSelected = e;
            $scope.selected = [];
            $scope.selectedSsidList = [];
            $scope.ssidNameIndex = [];
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
        $scope.ssidNameIndex = [];

        var updateSelected = function(action,ssidName,status){
            if(action == 'add' && $scope.ssidNameIndex.indexOf(ssidName) == -1 )
            {
                var ssidObj = {};
                ssidObj.ssidName = ssidName;
                //ssidObj.status = status;
                $scope.selected = $scope.selected.concat(status);
                $scope.selectedSsidList.push(ssidObj);
                $scope.ssidNameIndex.push(ssidName);
            }
            if(action == 'remove' && $scope.ssidNameIndex.indexOf(ssidName)!=-1)
            {
                var idx = $scope.ssidNameIndex.indexOf(ssidName);
                $scope.selected.splice(idx,1);
                $scope.selectedSsidList.splice(idx,1);
                $scope.ssidNameIndex.splice(idx,1);
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
            angular.forEach($scope.sendData.ssidList,function(v,k,array){
                v.status = 1;
            })
            $http.post(updateDrURL, JSON.stringify($scope.sendData)).success(function (data) {
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
            angular.forEach($scope.sendData.ssidList,function(v,k,array){
                v.status = 0;
            })
            $http.post(updateDrURL, JSON.stringify($scope.sendData)).success(function (data) {
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
            angular.forEach($scope.sendData.ssidList,function(v,k,array){
                v.status = 2;
            })
            $http.post(updateDrURL, JSON.stringify($scope.sendData)).success(function (data) {
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
            title:getRcString('help'),
            autoClose: true,
            showCancel: true,
            showHeader: true,
            showFooter: false,
            buttonAlign: "center",
            modalSize:'lg',
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