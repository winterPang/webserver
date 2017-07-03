define(['jquery','utils','../services/locationConst',],function($scope,Utils) {
    return ['$scope', '$http', '$state', '$compile', 'locConst',
                '$stateParams', '$alertService',function(
                    $scope,$http,$state,$compile, locConst, $stateParams,$alert){
        var shopId = $stateParams.shopId;
        var mode = $scope.mode = parseInt($stateParams.mode);

        // mode === 0 --- location   mode === 1 --- probe    mode === 2 --- em
        var prefixList = [
            '/v3/ace/oasis/oasis-rest-location/restapp',
            '/v3/ace/oasis/oasis-rest-probe/restapp',
            '/v3/ace/oasis/oasis-embedded-location/restapp'
        ];
        var prefix = prefixList[mode],
            prefixList = null;

        function getRcString(attrName){
                return Utils.getRcString("mapmanage_rc",attrName);
            }
        $scope.modeName = locConst.getName(mode);

        $scope.shopId = shopId;
        $scope.mapManageTable = {
            tId: "mapManageTable",
            dataField: 'originalList',
            url: prefix + "/map/getoriginalmap/"+shopId,
            pageSize: 5,
            showPageList:false,
            pageList: [5, 10, 15, 20],
            detailView: true,
            columns: [
                {sortable: true, field: 'imageName',width:150, title:getRcString('LOCATION_TITLE').split(",")[0]},
                {sortable: false, field: 'breif',width:150, title:getRcString('LOCATION_TITLE').split(",")[1]},
                {sortable: true, field: 'scale',width:100, title:getRcString('LOCATION_TITLE').split(",")[2]},
                {sortable: true, field: 'address',width:300, title:getRcString('LOCATION_TITLE').split(",")[3]},
                {sortable: true, field: 'shopName',width:150, title:getRcString('LOCATION_TITLE').split(",")[4]},
                {sortable: true, field: 'bind', title:getRcString('BIND_TITLE').split(",")[mode],
                    formatter: function (val, row, index) {
                        if(row.bind==0){
                            return '<a><span class="glyphicon glyphicon-plus"></span></a>';
                        }else if(row.bind==1){
                            return getRcString("BINDED");
                        }
                    }
                }
            ],
            // No Match info
            formatNoMatches: function () {
                return '<div>'+ getRcString("NO_MAP_EXIST").split('-')[0] +
                       '<a id="gotoadd" style="cursor: pointer;color:#69C4C5">' + getRcString("NO_MAP_EXIST").split('-')[1] +
                       '</a>' + getRcString("NO_MAP_EXIST").split('-')[2] +
                       '</div>'
            },
        };

        $('[bs-table="mapManageTable"]').delegate('#gotoadd', 'click', function () {
            $state.go('global.content.application.mapmanage_add',{shopId: shopId,mode:mode})
        });

        $scope.return = function(){
        $state.go("global.content.application.maplist",{
            shopId:$stateParams.shopId,
            mode:mode
        });
    };

        $http.get("../locationmanage/views/cn/imgdetails.html").success(function (data) {
            $scope.html = data;
            $scope.$on('expanded-row.bs.table#mapManageTable', function (e, data) {
                $scope.detail = data.row;
                var $ele = $compile($scope.html)($scope);
                data.el.append($ele);
            });
        });

        $scope.$on('click-cell.bs.table#mapManageTable',function (e, field, value, row, $element){
            if(field == 'bind' && row.bind == 0){
                $http({
                    url:prefix + "/map/addlocationmap",
                    method:"POST",
                    data:{
                        imageId:row.imageId,
                        imageName:row.imageName,
                        shopId:row.shopId,
                        scale:row.scale,
                        path:row.path
                    }
                }).success(function(response){
                    if(response.code==0){
                        $alert.msgDialogSuccess(getRcString("ADD_SUC"));
                        $scope.$broadcast('refresh#mapManageTable');
                    }else if(response.code==2){
                        $alert.msgDialogError(getRcString("NO_PROMISSION"),'error');
                    }else{
                        $alert.msgDialogError(getRcString("ADD_FAIL"),'error');
                    }
                }).error(function(response){

                });
            }
        });


    }]
});