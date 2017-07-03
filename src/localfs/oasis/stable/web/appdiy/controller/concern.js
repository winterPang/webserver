define(["utils"],function (Utils) {
    return ['$scope', '$filter', '$alertService', '$stateParams', '$http', '$window', function ($scope, $filter, $alert, $stateParams, $http, $window) {

        function getRcString(attrName){
            return Utils.getRcString("concern_rc",attrName);
        }

        $scope.return = function () {
            $window.history.back();
        };

        $scope.fresh = function () {
            $scope.getUserList();
        };
        
        $scope.getUserList = function () {
            $scope.$broadcast('showLoading#option');
            $http({
                url: '/v3/ace/oasis/oasis-rest-application/restapp/tempApp/app/users',
                method: 'get',
                params: {
                    appId:$stateParams.appId
                }
            }).success(function (data) {
                if(data.code === 0){
                    angular.forEach(data.data, function (item) {
                        item.storedTime = $filter('date')(new Date(item.storedTime), 'yyyy/MM/dd HH:mm:ss')
                    });
                    $scope.$broadcast('load#option', data.data);
                    $scope.$broadcast('hideLoading#option');
                }else if(data.code === 1){
                    $alert.msgDialogError(data.message);
                }
            })
        };

        $scope.options={
            tId: 'option',
            pageSize: 5,
            pageList: [5,10,20,50],
            clickToSelect: false,
            searchable: true,
            columns: [
                {sortable:true,field:'appName',title:getRcString('concern').split(",")[0],searcher:{}},
                {sortable:true,field:'userName',title:getRcString('concern').split(",")[1],searcher:{}},
                {sortable:true,field:'storedTime',title:getRcString('concern').split(",")[2],searcher:{}}
            ]
        };

        $scope.getUserList();


    }];
});