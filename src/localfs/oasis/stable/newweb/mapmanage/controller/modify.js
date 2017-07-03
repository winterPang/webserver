define(['jquery', 'utils', 'css!mapmanage/css/style.css'], function ($, Utils) {
    return ['$scope', '$compile', '$http', '$alertService', '$timeout', '$rootScope', '$state', '$stateParams', function ($scope, $compile, $http, $alert, $timeout, $rootScope, $state, $stateParams) {
        var _rcCache = {};
        function getRcString(key) {
            if (!_rcCache[key]) {
                _rcCache[key] = $('#modifyRc').attr(key);
            }
            return _rcCache[key];
        }
        var PRE_URL = "/v3/ace/oasis/oasis-rest-map/restapp/";
        var imageId = $stateParams.imageId;
        $http.get(PRE_URL + "originalMap/getOneOriginalMap/" + imageId).success(function (data) {
            if (data.code == 0) {
                $scope.map = data.getOriginalMap;
                $scope.fileName = $scope.map.imageName;
                $scope.doubleTude = getRcString('longitude') + $scope.map.longitude + getRcString('latitude') + $scope.map.latitude;
                $scope.doubleTude2 = getRcString('longitude') + $scope.map.longitude + getRcString('latitude') + $scope.map.latitude;
            }
        });
        $scope.uploadMap = function () {
            $('#file').trigger('click');
        };
        $('#file').on('change', function (e) {
            var filepath = $('#file').val();
            var extStart = filepath.lastIndexOf(".");
            var ext = filepath.substring(extStart, filepath.length).toUpperCase();
            if (ext != ".BMP" && ext != ".PNG" && ext != ".GIF" && ext != ".JPG" && ext != ".JPEG" && ext != ".DWG") {
                $alert.noticeDanger(getRcString('picture-format'));
            } else {
                var file_size = $('#file')[0].files[0].size;
                var size = file_size / 1024;
                if (size > 2048) {
                    $alert.noticeDanger(getRcString('picture-size'));
                } else {
                    $scope.$apply(function () {
                        $scope.fileName = e.target.value.substr(e.target.value.lastIndexOf('\\') + 1);
                        $http({
                            url: PRE_URL + "uploadfile/imageUpload",
                            method: 'POST',
                            headers: {
                                'Content-Type': undefined
                            },
                            transformRequest: function () {
                                var formData = new FormData();
                                formData.append('file', $('#file')[0].files[0]);
                                return formData;
                            }
                        }).success(function (data) {
                            if (data.code == 0) {
                                $scope.map.path = data.path;
                            }else{
                                $alert.noticeDanger(data.message);
                            }
                        });
                    });
                }
            }
        });
        $scope.submitModify = function () {
            if($scope.map.path){
                $http.post(PRE_URL + "originalMap/updateOriginalMap", $scope.map).success(function (data) {
                    if (data.code == 0) {
                        $alert.noticeSuccess(getRcString('modify-success'));
                        $state.go("global.application.mapmanage_original");
                    }else{
                        $alert.noticeDanger(data.message);
                    }
                });
            }else {
                $alert.noticeDanger(getRcString('please-choice-picture'));
            }
        };
        $scope.modal = {
            option: {
                mId: "address",
                title: getRcString('choice-address'),
                modalSize: "lg",
                autoClose: true
            },
            open: function () {
                $scope.$broadcast("show#address");
                var map = new BMap.Map("map", {enableMapClick: false});
                var myGeo = new BMap.Geocoder();
                map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);
                function myFun(result) {
                    var cityName = result.name;
                    map.setCenter(cityName);
                }

                var myCity = new BMap.LocalCity();
                myCity.get(myFun);
                map.addControl(new BMap.MapTypeControl());
                map.addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT}));
                map.addControl(new BMap.NavigationControl());
                var marker = new BMap.Marker(new BMap.Point($scope.map.longitude, $scope.map.latitude));
                map.addOverlay(marker);
                map.setCurrentCity(getRcString('set-current-city'));          // set city required
                map.enableScrollWheelZoom(true);     //open mouse sizable
                map.addEventListener("click", function (e) {
                    $scope.$apply(function () {
                        $scope.map.longitude = e.point.lng;
                        $scope.map.latitude = e.point.lat;
                        $scope.doubleTude = getRcString('longitude-and-latitude') + e.point.lng + " , " + e.point.lat;
                        $scope.doubleTude2 = getRcString('longitude-and-latitude') + e.point.lng + " , " + e.point.lat;
                        map.removeOverlay(marker);
                        marker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat));
                        map.addOverlay(marker);
                        myGeo.getLocation(new BMap.Point(e.point.lng, e.point.lat), function (result) {
                            if (result) {
                                $scope.map.mapAddress = result.address;
                            }
                        });
                    });
                });
                var local = new BMap.LocalSearch(map, {
                    renderOptions: {map: map}
                });
                $scope.modal.search = function () {
                    local.search($scope.map.address);
                };
                $scope.modal.search();
            },
            shopOption: {
                mId: "shop",
                title: getRcString('choice-shop'),
                modalSize: "lg",
                autoClose: false,
                okHandler: function (modal) {
                    if ($scope.map.shopName == "") {
                        $alert.noticeDanger(getRcString('please-choice-shop'));
                    } else {
                        $scope.$broadcast("hide#shop");
                    }
                }
            },
            shopModalOpen: function () {
                $scope.$broadcast("show#shop");
            }
        };
        var shopsTableHeader=getRcString('shops-table-header').split(',');
        $scope.shops = {
            table: {
                tId: "shops",
                url: '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/shops?ascending=false&queryCondition=',
                totalField: 'data.rowCount',
                sortField: 'orderby',
                dataField: 'data.data',
                showCheckBox: true,
                singleSelect: true,
                sortName: 'id',
                sortOrder: 'asc',
                pageList: [8, 10, 25, 50, 100],
                pageSize: 8,
                columns: [
                    {
                        field: 'shopName', title: shopsTableHeader[0], formatter: function (val, row, index) {
                        return row.shopName.replace(/\s/g, '&nbsp;');
                    }
                    },
                    {field: 'addrShow', title: shopsTableHeader[1]},
                    {
                        field: 'shopDesc', title: shopsTableHeader[2], formatter: function (val, row, index) {
                        if (row.shopDesc) {
                            return row.shopDesc.replace(/\s/g, '&nbsp;');
                        }
                    }
                    },
                    {field: 'regionName', title: shopsTableHeader[3]}
                ],
                sidePagination: 'server'
            }
        };
        $.each([
            'check.bs.table#shops', 'uncheck.bs.table#shops'
        ], function (a, b) {
            $scope.$on(this, function () {
                $scope.$broadcast('getSelections#shops', function (data) {
                    if (data.length != 0) {
                        $scope.$apply(function () {
                            $scope.map.shopName = data[0].shopName;
                            $scope.map.shopId = data[0].shopId;
                        });
                    } else {
                        $scope.$apply(function () {
                            $scope.map.shopName = "";
                            $scope.map.shopId = "";
                        });
                    }
                });
            });
        });
    }]
})
;