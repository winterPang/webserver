define(['jquery', 'utils','css!mapmanage/css/style.css'], function ($, Utils) {
    return ['$scope', '$compile', '$http', '$alertService', '$timeout','$rootScope', function ($scope, $compile, $http, $alert, $timeout,$rootScope) {
        var _rcCache = {};
        function getRcString(key) {
            if (!_rcCache[key]) {
                _rcCache[key] = $('#bitmapListRc').attr(key);
            }
            return _rcCache[key];
        }
        $http.get("../mapmanage/views/" + Utils.getLang() + "/detail.html").success(function (data) {
            $scope.html = data;
        });
        $scope.$on('expanded-row.bs.table#bitmapTable', function (e, data) {
            $scope.detail = data.row;
            var $ele = $compile($scope.html)($scope);
            data.el.append($ele);
        });
        /*address
        breif
        latitude
        longitude
        mapId
        mapName
        path
        scale
        shopId
        shopName*/
        var bitmapTableHeader=getRcString('bitmap-table-header').split(',');
        $scope.option = {
            tId: "bitmapTable",
            detailView:true,
            dataField: 'basicBitMapList',
            /*url: "/v3/ace/oasis/oasis-rest-map/restapp/bitMap/getBitMap?user_name="+$rootScope.userInfo.user,*/
            url:"/v3/ace/oasis/oasis-rest-map/restapp/bitMap/getBasicBitMap?user_name="+$rootScope.userInfo.user,
            pageSize: 5,
            pageList: [5, 10, 15, 20],
            // showPageList:false,
            columns: [
                {sortable: true, field: 'mapName', title: bitmapTableHeader[0]},
                {sortable: true, field: 'breif', title: bitmapTableHeader[1]},
                {sortable: true, field: 'scale', title: bitmapTableHeader[2]},
                {sortable: true, field: 'shopName', title: bitmapTableHeader[3]},
                {sortable: true, field: 'address', title: bitmapTableHeader[4]}/*,
                {sortable: true, field: 'remainDay', title: bitmapTableHeader[5]},
                {sortable: true, field: 'expireDate', title: bitmapTableHeader[6]}*/
            ],
            sidePagination: 'client'
        };
    }]
});