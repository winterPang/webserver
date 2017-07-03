define(["utils", "netchart0/directive/directives"], function (Utils ) {
    return ["$scope", "$http", function ($scope, $http) {

        var g_oLegend = [
            {id: "01", text: "信道 01", color: "rgba(63, 234, 117, 0.5)", lColor: "#9eff9e"},
            {id: "02", text: "信道 02", color: "rgba(63, 106, 234, 0.5)", lColor: "#9b9bff"},
            {id: "03", text: "信道 03", color: "rgba(255, 255, 0, 0.51)", lColor: "#ffff9b"},
            {id: "04", text: "信道 04", color: "rgba(0, 255, 255, 0.5)", lColor: "#a1ffff"},
            {id: "05", text: "信道 05", color: "rgba(255, 0, 0, 0.51)", lColor: "#ff9b9b"},
            {id: "06", text: "信道 06", color: "rgba(0, 100, 0, 0.5)", lColor: "#9cc29b"},
            {id: "07", text: "信道 07", color: "rgba(128, 0, 128, 0.5)", lColor: "#cc9acd"},
            {id: "08", text: "信道 08", color: "rgba(255, 165, 0, 0.5)", lColor: "#ffdc9b"},
            {id: "09", text: "信道 09", color: "rgba(160, 82, 45, 0.51)", lColor: "#dfc5b8"},
            {id: "10", text: "信道 10", color: "rgba(20, 46, 237, 0.5)", lColor: "#0B1D7E"}
        ];

        $scope.legendList = g_oLegend;

        // 获取地图列表
        $http({
            method: "POST",
            url: "/v3/wloc",
            data: {
                Method: "getAllMapListToRRMByindex",
                devSN: $scope.sceneInfo.sn
            }
        }).success(function (data) {
            var aMapList = data.data.maplist;
            if (aMapList.length == 0) {return}
            $scope.mapSlt = {
                item: aMapList[0],
                items: aMapList,
                onChange: function () {
                    // 下拉框事件
                    getMapIndex($scope.mapSlt.item.mapName);
                    getApInfo($scope.mapSlt.item.mapName);
                }
            };
            // 获取ap信息和图片url
            getMapIndex(aMapList[0].mapName);
            getApInfo(aMapList[0].mapName);
        });

        // 获取 ap info
        function getApInfo(mapName) {
            $http({
                method: "POST",
                url: "/v3/wloc",
                data: {
                    Method: "getMapUrlToRRMByindex",
                    devSN: $scope.sceneInfo.sn,
                    Param: {
                        devSN: $scope.sceneInfo.sn,
                        mapName: mapName
                    }
                }
            }).success(function (data) {
                var aApList = data.data.maplist.apList;
                aApList = [
                    {apName: "ap1", macAddr: "741f-4ae3-6040", XCord: 400, YCord: 200, status: 1},
                    {apName: "ap1", macAddr: "741f-4ae3-6040", XCord: 600, YCord: 400, status: 2}
                ];
                if (aApList.length == 0) {return;}
                $scope.apList = aApList;
            });
        }


        // 获取 image index 刷背景图
        function getMapIndex(mapName) {
            $http({
                method: "POST",
                url: "/v3/wloc",
                data: {
                    Method: "getindex",
                    devSN: $scope.sceneInfo.sn,
                    Param: {
                        devSN: $scope.sceneInfo.sn,
                        mapName: mapName
                    },
                    Return: ["mapName","index"]
                }
            }).success(function (data) {
                var sPath = "/v3/wloc_map/image/" + $scope.sceneInfo.sn + "/" + data.index + "/background";
                $scope.bgOpts = {
                    path: "https://v3webtest.h3c.com/v3/wloc/image/210235A1CWC14B900027/1478844505375/background"
                };
            });
        }

        // 获取rrm
        function getApNbr(radio, ap) {
            $http({
                method: "POST",
                url: "/v3/rrmserver",
                data: {
                    Method: "GetApNbrlist",
                    Param: {
                        ACSN: $scope.sceneInfo.sn,
                        RadioType: radio,
                        APList: ap
                    }
                }
            });
        }

        // 射频选择
        $scope.radioSlt = {
            item: "2.4G",
            items: ["2.4G", "5G"],
            onChange: function () {
                console.log($scope.radioSlt.item);
            }
        };

        // 刷新按钮
        $scope.refresh = function () {

        };

        // 信道筛选

        $scope.filter = {
            isOpen: false,
            onCheck: function () {
                $scope.filter.isOpen = false;
            },
            onClose: function () {
                $scope.filter.isOpen = false;
            }
        };











    }];
});