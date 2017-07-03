/**
 * Created by liuyanping(kf6877) on 2017/1/11.
 */
define(['jquery', 'utils', 'angular','angularAMD','angular-ui-router', 'angular-messages'], function ($,Utils,angular,angularAMD) {
    var beforeLogin = angular.module('beforeLogin', ['ui.router','ngMessages']).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.when('', '/registerByPhone').otherwise('notFound');
        var resolveController = function (names) {
            return {
                loadController: ['$q', '$rootScope', function ($q, $rootScope) {
                    var defer = $q.defer();
                    require(names, function () {
                        defer.resolve();
                        $rootScope.$apply();
                    });
                    return defer.promise;
                }]
            };
        };
        $stateProvider.state('registerByPhone', {
            url: '/registerByPhone',
            templateUrl: '../views/'+Utils.getLang()+'/registerByPhone.html',
            controller:'registerByPhone',
            resolve:resolveController(['controller/registerByPhone'])
        }).state('registerByPhoneSuccess', {
            url: '/registerByPhoneSuccess',
            templateUrl: '../views/'+Utils.getLang()+'/registerByPhoneSuccess.html',
            controller:'registerByPhoneSuccess',
            resolve:resolveController(['controller/registerByPhoneSuccess'])
        }).state('registerByEmail',{
            url: '/registerByEmail',
            templateUrl: '../views/'+Utils.getLang()+'/registerByEmail.html',
            controller:'registerByEmail',
            resolve:resolveController(['controller/registerByEmail'])
        }).state('registerByEmailSuccess', {
            url: '/registerByEmailSuccess',
            templateUrl: '../views/'+Utils.getLang()+'/registerByEmailSuccess.html'
        }).state('findPasByPhoneSuccess', {
            url: '/findPasByPhoneSuccess',
            templateUrl: '../views/'+Utils.getLang()+'/findPasByPhoneSuccess.html',
            controller:'findPasByPhoneSuccess',
            resolve:resolveController(['controller/findPasByPhoneSuccess'])
        }).state('findPasByEmailSuccess', {
            url: '/findPasByEmailSuccess',
            templateUrl: '../views/'+Utils.getLang()+'/findPasByEmailSuccess.html'
        }).state('findPas', {
            url: '/findPas',
            templateUrl: '../views/'+Utils.getLang()+'/findPas.html',
            controller:'findPas',
            resolve:resolveController(['controller/findPas'])
        }).state('fail',{
            url: '/fail',
            templateUrl: '../views/'+Utils.getLang()+'/emailfail.html'
        }).state('provision',{
            url:'/provision',
            templateUrl: '../views/'+Utils.getLang()+'/provision.html'
        }).state('warning',{
            url:'/warning',
            templateUrl: '../views/'+Utils.getLang()+'/warning.html'
        });
    }]).run(function($rootScope){
		$rootScope.title = Utils.getLang() == "en" ? "H3C OASIS PLATFORM" : "H3C绿洲云平台"
	});
    return angularAMD.bootstrap(beforeLogin);
});