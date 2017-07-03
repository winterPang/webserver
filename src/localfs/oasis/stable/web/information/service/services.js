define(['angularAMD', 'utils'], function (app, Utils) {
    app.factory('PerfectInfoServices', function ($rootScope, $http) {

        var sLang = Utils.getLang() || 'cn';

        var URL_GET_detail = '/v3/ace/oasis/oasis-rest-user/restapp/users/detail';
        var URL_GET_allIndustry = '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/getAllIndustryName';
        var URL_GET_address = '../information/libs/address-%s.json';
        var URL_POST_userInfo = '/v3/ace/oasis/oasis-rest-user/restapp/users/completeUserInfo';
        var URL_GET_getPin = '/oasis/stable/web/static/pinserver/getPin';
        var URL_POST_getPhoneCode = '/oasis/stable/web/static/oasis-rest-sms/restapp/user/getPhoneCode';
        var URL_POST_validOldPhone = '/v3/ace/oasis/oasis-rest-user/restapp/users/validateOldPhone';
        var URL_POST_bindPhone = '/v3/ace/oasis/oasis-rest-user/restapp/users/bindPhone';
        var URL_POST_changeEmail = '/v3/ace/oasis/oasis-rest-user/restapp/users/changeEmail';
        var URL_POST_bindEmail = '/v3/ace/oasis/oasis-rest-user/restapp/users/bindEmail';


        var getDetail = function () {
            return $http({
                method: 'get',
                url: URL_GET_detail,
                params: {'user_name': $rootScope.userInfo.user}
            });
        };
        var getAllIndustry = function () {
            return $http({
                method: 'get',
                url: URL_GET_allIndustry
            });
        };
        var getAddressList = function () {
            return $http({
                method: 'get',
                url: sprintf(URL_GET_address, sLang)
            });
        };
        var postUserInfo = function (data) {
            return $http({
                method: 'POST',
                url: URL_POST_userInfo,
                data: data
            });
        };
        var getPin = function () {
            return $http({
                method: 'get',
                url: URL_GET_getPin,
                params: {
                    random: Math.random()
                }
            });
        };
        var getPhoneCode = function (code, phone) {
            return $http({
                method: 'post',
                url: URL_POST_getPhoneCode,
                params: {pinCode: code},
                data: {phone: phone}
            });
        };
        var validOldPhone = function (data) {
            return $http({
                method: 'post',
                url: URL_POST_validOldPhone,
                data: data
            });
        };
        var bindPhone = function (data) {
            return $http({
                method: 'post',
                url: URL_POST_bindPhone,
                data: data
            });
        };
        var changeEmail = function (data) {
            return $http({
                method: 'post',
                url: URL_POST_changeEmail,
                data: data
            });
        };
        var bindEmail = function (data) {
            return $http({
                method: 'post',
                url: URL_POST_bindEmail,
                data: data
            });
        };


        return {
            getDetail: getDetail,
            getAllIndustry: getAllIndustry,
            getAddressList: getAddressList,
            postUserInfo: postUserInfo,
            getPin: getPin,
            getPhoneCode: getPhoneCode,
            validOldPhone: validOldPhone,
            bindPhone: bindPhone,
            changeEmail: changeEmail,
            bindEmail: bindEmail
        };

    });
});