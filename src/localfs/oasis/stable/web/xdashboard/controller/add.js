define(['jquery', 'bootstrapValidator'], function ($) {
    return ['$scope','$rootScope', '$timeout', '$http', '$alertService', '$state', '$stateParams',
            function ($scope,$rootScope, $timeout, $http, $alert, $state, $stateParams) {
                $scope.row={};
                $scope.type = $stateParams.id == '' ? 'add' : 'update';
                $scope._id = $stateParams.id;

                $scope.onSubmit = function () {
                    var bool=$('[name=shopAddForm]').data('bootstrapValidator').isValid();

                    // TODO  封装提交多对象
                    var commitParam = {
                        _id: $scope._id
                    };

                    if(bool){
                        if ($scope.type == 'update') {
                            //  TODO 修改操作
                            $alert.noticeSuccess("修改场所成功");
                            $state.go("h3c_systemManage.shopManage.list");

                        } else {
                            //  TODO 新增操作
                            $alert.noticeSuccess("增加场所成功");
                            $state.go("h3c_systemManage.shopManage.list");
                        }
                    }
                    //$http.post("").success(function (data) {
                    //    $alert.noticeSuccess("添加成功");
                    //    $state.go("h3c_systemManage.shopManage.list");
                    //});
                };

                if ($scope.type == 'update') {
                    $scope.row={"name":"场所名称","scenario_category_name":"场景分类","dev_type":"支持的设备型号","province":"甘肃","city":"陇南市","area":"康　县","address":"详细地址","phone":"18725424572","intro":"场所简介"};
                    initAddress(function(){
                        $('#cmbProvince').val($scope.row.province).trigger('change');
                        $('#cmbCitys').val($scope.row.city).trigger('change');
                        $('#cmbArea').val($scope.row.area);
                    });
                    //$http.get().success(function (data) {
                    //    //  TODO 执行数据绑定
                    //});
                }else {
                    initAddress();
                }

                $('#table').bootstrapTable({
                    url: '../../init/h3c_systemManage/shopManage/list.json',
                    width: 250,
                    columns: [
                        {sortable: true, field: 'dev_type', title: '支持的设备型号'}
                    ],
                    sidePagination: 'server',
                    formatShowingRows: function () {
                        return '';
                    },
                    pagination: true
                });

                $timeout(function () {
                    // 表单验证
                    $('[name=shopAddForm]').bootstrapValidator({
                        live: 'enabled',
                        feedbackIcons: {
                            valid: 'glyphicon glyphicon-ok',
                            invalid: 'glyphicon glyphicon-remove',
                            validating: 'glyphicon glyphicon-refresh'
                        },
                        fields: {
                            name: {
                                validators: {
                                    notEmpty: {
                                        message: '场所名称不能为空'
                                    },
                                    regexp: {
                                        regexp: /^[^0-9].{0,49}$/,
                                        message: '首字母不能为数字，最多五十个字符'
                                    }
                                }
                            },
                            phone: {
                                validators: {
                                    phone: {
                                        country: 'CN',
                                        message: '电话号码格式错误'
                                    }
                                }
                            },
                            shopDesc: {
                                validators: {
                                    stringLength: {
                                        max: 500,
                                        message: '最多五百个字符'
                                    }
                                }
                            }
                        }
                    });
                });
            }];
});