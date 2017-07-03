define([
        "appmanage/service/service",
        "appmanage/directive/directive",
        "css!appmanage/css/detail"
    ],
    function () {
        return ["$scope", "$filter", "appSer", function ($scope, $filter, appSer) {

            function templateStr(content, replace) {
                return content.replace(/\$appId\$/ig, replace);
            }

            appSer.getMine().success(function (data) {
                if (data.code!==0) {return;}
                angular.forEach( data.data.data, function (v) {
                    if (v.id===229 || v.id===232 || v.id===244) {v.status = 1;}
                });
                $scope.myAppData = data.data.data;
            }).error(function (msg) {
                console.log(msg);
            });

            function initData(data) {
                var n = data.length;

                function repeatArr(arr, count) {
                    var i = 0;
                    var a = [];
                    for (;i<count;i++) {
                        a = a.concat(arr);
                    }
                    return a;
                }
                if (n === 1) {
                    return repeatArr(data, 8);
                } else if (n === 2) {
                    return repeatArr(data, 4);
                } else if (n === 3) {
                    return repeatArr(data, 4);
                } else {
                    return repeatArr(data, 2);
                }
            }

            appSer.getHot(8).success(function (data) {
                $scope.hotAppData = initData(data.data.data);
            });


        }];
    }
);