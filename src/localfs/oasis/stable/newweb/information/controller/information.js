define(['utils', 'information/directive/directives', 'information/directive/avatar/avatar', 'information/service/services', 'css!information/css/style.css'], function (Utils) {
    return ['$rootScope', '$scope', '$http', '$filter', '$alertService', 'PerfectInfoServices',
        function ($rootScope, $scope, $http, $filter, $alert, Ser) {

            var Origin_data = {};

            $scope.validPhone = {
                url: '/v3/ace/oasis/oasis-rest-user/restapp/users/isExistPhone/{value}',
                method: 'get',
                validFn: function (resp) {return !resp.data;}
            };
            $scope.validEmail = {
                url: '/oasis/stable/web/static/oasis-rest-user/restapp/users/isExistEmail/{value}',
                method: 'get',
                validFn: function (resp) {
                    return !resp.data;
                }
            };

            function getUserDetail() {
                Ser.getDetail().success(function (data) {
                    if (data.code != 0) {return;}
                    var oData = data.data;
                    var oCAddress = {
                        province: '',
                        city: '',
                        area: '',
                        address: ''
                    };
                    try {
                        oCAddress = JSON.parse(oData.companyAddress);
                    } catch(err) {/* Please select company address again. */}

                    $scope.IMFData = {
                        username: oData.name,
                        phone: /RandomPhone/.test(oData.phone) ? '' : oData.phone,
                        email: /@nullserver\.com/.test(oData.email) ? '' : oData.email,
                        industry: isNaN(oData.industryType) ? '' : Number(oData.industryType),
                        enterpriseName: oData.enterpriseName || '',
                        province: oCAddress.province,
                        city: oCAddress.city,
                        area: oCAddress.area,
                        address: oCAddress.address
                    };
                    $('.avatar-view img').attr('src',  oData.avatar || "img/user.jpg");
                    $.extend(Origin_data, $scope.IMFData);
                });
            }

            function getAllIndustry() {
                Ser.getAllIndustry().success(function (data) {
                    if (data.code != 0) {return;}
                    $scope.industryList = data.data;
                });
            }
            function getAddressList() {
                Ser.getAddressList().success(function (data) {
                    $scope.addressList = data;
                });
            }

            $scope.IMFEvent = {
                phoneManage: function () {
                    if ($scope.IMFData.phone) {
                        $scope.$broadcast('show#CPM');
                        $scope.getPin($scope.CPF1);
                        $('[bs-modal="changePhoneModal"]').css({'overflow': 'visible'});
                    } else {
                        $scope.$broadcast('show#BPM');
                        $scope.getPin($scope.BPF);
                    }
                },
                emailManage: function () {
                    if ($scope.IMFData.email) {
                        $scope.$broadcast('show#CEM');
                    } else {
                        $scope.$broadcast('show#BEM');
                    }
                },
                chooseProvince: function () {
                    $scope.IMFData.city = 0;
                    $scope.IMFData.area = 0;
                },
                chooseCity: function () {
                    $scope.IMFData.area = 0;
                },
                submit: function () {
                    var sCompanyAddress = JSON.stringify({
                        "province": $scope.IMFData.province,
                        "city": $scope.IMFData.city,
                        "area": $scope.IMFData.area,
                        "address": $scope.IMFData.address
                    });
                    var oBody = {
                        name: $scope.IMFData.username,
                        industryType: $scope.IMFData.industry,
                        enterpriseName: $scope.IMFData.enterpriseName,
                        companyAddress: sCompanyAddress
                    };
                    // upload
                    if($scope.IMFData.upload !== ''){
                        oBody.avatar = $scope.IMFData.upload
                    }
                    Ser.postUserInfo(oBody).success(function (data) {
                        if (data.code != 0) {return $alert.msgDialogError($scope['submit_fail']);}
                        $.extend(Origin_data, $scope.IMFData);
                        $scope.IMForm.$setPristine();
                        $scope.IMForm.$setUntouched();
                        $rootScope.userInfo.isCompleted = true;
                        $alert.msgDialogSuccess($scope['submit_success']);
                    }).error(function () {$alert.msgDialogError($scope['submit_fail']);});
                },
                reset: function () {
                    $.extend($scope.IMFData, Origin_data);
                }
            };

            $scope.getPin = function (o) {
                Ser.getPin().success(function (data) {
                    o.codeImage = data.buf;
                });
            };

            $scope.closeModal = function (mId) {
                $scope.$broadcast('hide#'+mId);
            };

            function init() {
                getUserDetail();
                getAllIndustry();
                getAddressList();
            }

            init();
    }];
});