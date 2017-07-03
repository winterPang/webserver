define(['jquery', 'utils','css!mapmanage/css/style.css'], function ($, Utils) {
    return ['$scope', '$compile', '$http', '$alertService', '$timeout','$rootScope','$state', function ($scope, $compile, $http, $alert, $timeout,$rootScope,$state) {
        var _rcCache = {};
        function getRcString(key) {
            if (!_rcCache[key]) {
                _rcCache[key] = $('#originalListRc').attr(key);
            }
            return _rcCache[key];
        }
        $http.get("../mapmanage/views/" + Utils.getLang() + "/detail.html").success(function (data) {
            $scope.html = data;
        });
        $scope.$on('expanded-row.bs.table#originalTable', function (e, data) {
            $scope.detail = data.row;
            var $ele = $compile($scope.html)($scope);
            data.el.append($ele);
        });
        var originalTableHeader=getRcString('original-table-header').split(',');
        $scope.option = {
            tId: "originalTable",
            detailView: true,
            url: "/v3/ace/oasis/oasis-rest-map/restapp/originalMap/getOriginalMap?user_name="+$rootScope.userInfo.user,
            pageSize: 5,
            dataField: 'data',
            pageList: [5, 10, 15, 20],
            // showPageList: false,
            columns: [
                {sortable: true, field: 'imageName', title: originalTableHeader[0]},
                {sortable: true, field: 'breif', title: originalTableHeader[1]},
                {sortable: true, field: 'scale', title: originalTableHeader[2]},
                {sortable: true, field: 'address', title: originalTableHeader[3]},
                {sortable: true, field: 'shopName', title: originalTableHeader[4]}
            ],
            sidePagination: 'client',
            operate: {
                edit: function (e, row) {
                    $state.go("global.content.application.mapmanage_modify",{imageId:row.imageId});
                },
                /*add: function (e, row) { // open
                    openAdvert([row.storeId]);
                },*/
                remove: function (e,row) {  // close
                    if(row.state !== 0){
                        $alert.noticeSuccess("地图使用中，请先解除绑定");
                        return;
                    }
                    $alert.confirm(getRcString('confirm-delete'), function () {
                        $http.delete("/v3/ace/oasis/oasis-rest-map/restapp/originalMap/deleteOriginalMap/"+row.imageId).success(function(data){
                            if (data.code == 0) {
                                $alert.noticeSuccess(getRcString('delete-success'));
                                $scope.$broadcast('refresh#originalTable');
                            } else {
                                $alert.noticeDanger(data.message);
                            }
                        });
                    });
                }
            }
        };
    }]
});