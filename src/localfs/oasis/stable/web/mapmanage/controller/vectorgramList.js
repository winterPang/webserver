define(['jquery', 'utils','css!mapmanage/css/style.css'], function ($, Utils) {
    return ['$scope', '$compile', '$http', '$alertService', '$timeout','$rootScope', function ($scope, $compile, $http, $alert, $timeout,$rootScope) {
        var _rcCache = {};
        function getRcString(key) {
            if (!_rcCache[key]) {
                _rcCache[key] = $('#vectorgramListRc').attr(key);
            }
            return _rcCache[key];
        }
        $scope.map = {
            type: 'vectorgram'
        };
        var vectorgramTableHeader=getRcString('vectorgram-table-header').split(',');
        $scope.option = {
            tId: "vectorgramTable",
            dataField: 'data',
            url: "/v3/ace/oasis/oasis-rest-map/restapp/vectorMap/getVectorMap?user_name="+$rootScope.userInfo.user,
            pageList: [5, 10, 15, 20],
            // showPageList:false,
            columns: [
                {sortable: true, field: 'mapName', title: vectorgramTableHeader[0]},
                {sortable: true, field: 'breif', title: vectorgramTableHeader[1]},
                {sortable: true, field: 'shopName', title: vectorgramTableHeader[2]},
                {sortable: true, field: 'address', title: vectorgramTableHeader[3]},
                {sortable: true, field: 'remainDay', title: vectorgramTableHeader[4]},
                {sortable: true, field: 'expireDate', title: vectorgramTableHeader[5]}
            ],
            sidePagination: 'client'
        };
    }]
});