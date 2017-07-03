define(['jquery', 'bootstrapValidator'], function ($) {
    return ['$scope', '$http', '$alertService', '$state', '$rootScope', function ($scope, $http, $alert, $state, $rootScope) {

        
        $scope.options={
            columns:[
                {field:'account_name',title:'账号名'},
                {field:'auth_mode',title:'认证方式'},
                {field:'regis_time',title:'注册时间'},
                {field:'modify',title:'修改',
                    formatter: function (value, row) {
                        return '<a style="cursor: pointer;"><span class="glyphicon glyphicon-pencil"></span></a>'
                    }
                },
                {field:'delete',title:'删除',
                    formatter: function (value, row) {
                        return '<a style="cursor: pointer;"><span class="glyphicon glyphicon-trash"></span></a>'
                    }
                }
            ]
        }
        //添加
        $scope.addSite = function () {

        };
        //搜索
        $scope.search = function () {

        };
    }];
});