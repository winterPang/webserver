define(['jquery'], function ($) {
    return ['$scope', '$http', '$alertService', '$state', function ($scope, $http, $alert, $state) {
        var $opelist = $('.toggle_operates');
        $http.get("/v3/ace/o2oportal/getPlaceInfoList?user_name="+$rootScope.userInfo.user).success(function(data){
            $('#table').bootstrapTable('load',data.data_list);
        });

        $('#table').bootstrapTable({
            columns: [
                {checkbox: true},
                {
                    sortable: true, field: 'dev_status', title: '设备状态',
                    formatter: function (value, row) {
                        var clazz = !value ? '' : value == 1 ? 'dev_status_base' : 'dev_status_base dev_status_unmanaged';
                        //状态为1显示为在线，2显示为不在线
                        var status = (value == 1 ? '在线' : value == 2 ? '不在线' : '');
                        return '<span ' + (clazz && 'class="' + clazz + '" ') + '></span><span>' + status + '</span>';
                    }
                },
                {
                    sortable: true, field: 'dev_sn', title: '关联设备', formatter: function (value, row) {
                    return '<a href="#" style="text-decoration:none;">' + value + '</a>'
                }
                },
                {sortable: true, field: 'dev_type', title: '设备类型'},
                {sortable: true, field: 'alias_name', title: '设备别名'},
                {
                    sortable: true, field: 'name', title: '场所名称', formatter: function (value, row) {
                    return '<a href="#/h3c_systemManage/shopManage/shopdetail/' + row.id + '" style="text-decoration:none;">' + value + '</a>'
                }
                },
                {sortable: true, field: 'scenario_category_name', title: '场景分类'},
                {sortable: true, field: 'shop_address', title: '场所（总部）地址',formatter:function(value,row){
                    return (row.province || '') + (row.city || "") + (row.area || "") + (row.address || "")
                }},
                {
                    field: 'operates', title: '操作列', formatter: function (value, row) {
                    return '<span style="cursor: pointer;" class="glyphicon glyphicon-option-horizontal"></span>'

                }
                }
            ],

            onClickCell: function (field, value, row, $element) {
                if (field == "operates") {
                    //用户点击非操作列时，隐藏.toggle_operates
                    $('#listView').unbind('click').click(function (e) {
                        if (e.target != $element[0] && ($(e.target).parents('td')[0] != $element[0])) {
                            $opelist.hide();
                        }
                    });
                    $scope.$apply(function () {
                        $scope.row = row;
                    });
                    //操作列的显示与隐藏
                    var disp = $opelist.css('display');
                    if ($opelist.$clicked == row.id && disp != 'none') {
                        $opelist.hide();
                        $opelist.$clicked = undefined;
                    } else {
                        $opelist.show();
                        $opelist.$clicked = row.id;
                    }
                    //定位
                    var offset = $element.offset();
                    var height = $opelist.outerHeight();
                    var top = $opelist.css('top');
                    if (($('body').height() - offset.top) > height) {
                        top = Math.floor(offset.top) + 15 + 'px';
                    } else {
                        top = Math.floor(offset.top) - height + 15 + 'px';
                    }
                    $opelist.css({'top': top, 'left': Math.floor(offset.left) - 125 + 'px'});
                    //操作列的选项绑定事件
                    $opelist.find('li').each(
                        function () {
                            var text = $(this).text();
                            if (text == '修改') {
                                $(this).unbind('click').bind('click', function () {
                                    $state.go('global.content.system.shopManage_add_modify', {id: row.id});
                                });
                            }
                            if (text == '删除设备') {
                                $(this).unbind('click').bind('click', function () {
                                    $alert.confirm("确定删除吗？", function () {
                                        console.log("删除的数据ID为：" + row.id);
                                        $alert.noticeSuccess("删除成功");
                                    });
                                });
                            } else if (text == '增加设备') {
                                $(this).unbind('click').bind('click', function () {
                                        $alert.modal('增加设备',
                                            function () {
                                                return $(
                                                    '<form class="clearfix">' +
                                                    '<div class="form-group">' +
                                                    '<label class="col-xs-3 control-label col-xs-offset-2">设备序列号 <span style="color:#f00;">*</span></label>' +
                                                    '<div class="col-xs-5">' +
                                                    '<input class="form-control" name="dev_sn" type="text">' +
                                                    '</div>' +
                                                    '</div>' +
                                                    '<br>' +
                                                    '<div class="form-group">' +
                                                    '<label class="col-xs-3 control-label col-xs-offset-2">设备别名 </label>' +
                                                    '<div class="col-xs-5">' +
                                                    '<input class="form-control" name="alias_name" type="text">' +
                                                    '</div>' +
                                                    '</div>' +
                                                    '</form>'
                                                );
                                            }, function (mod, $body) {
                                                $body.find('input[name=dev_sn]').val()
                                                    ?(mod.close(),$alert.noticeSuccess('增加设备成功'))
                                                    :$alert.alert('设备序列号必填！');
                                            },false)
                                    }
                                );
                            } else if (text == '修改设备别名') {
                                $(this).unbind('click').bind('click', function () {
                                        $alert.modal('修改设备别名',
                                            function () {
                                                return $('<div>设备别名 <input name="alias_name" type="text" value="' + row.alias_name + '"></div>');
                                            }, function (mod, $body) {
                                                !$body.find('input[name=alias_name]').val()?
                                                    $alert.alert('设备别名不能为空！'):
                                                    (mod.close(),$alert.noticeSuccess('修改设备别名成功'))

                                            },false);
                                    }
                                );
                            } else if (text == '删除场所') {
                                $(this).unbind('click').bind('click', function () {
                                    if(row.dev_sn){
                                        $alert.alert('请先删除关联设备！');
                                    }else {
                                        $alert.confirm("确定删除吗？", function () {
                                            console.log("删除的数据ID为：" + row.id);
                                            $alert.noticeSuccess("删除成功");
                                        });
                                    }
                                });
                            }
                        }
                    );
                }
            },
            pagination: true
        });
        $scope.refresh = function () {
            $("#table").bootstrapTable('refresh');
        };
        //删除
        $scope.deleteshop = function () {
            var objs=$('#table').bootstrapTable('getSelections');
            if(objs.length==0){
                $alert.alert("请至少选择一个场所！");
            }else {
                $alert.confirm("确定删除吗？", function () {
                    for(var i in objs){
                        console.log('删除的场所ID为：'+objs[i].id);
                    }
                    $alert.noticeSuccess("删除成功");
                });
            }
        };

        $scope.addShop = function () {
            $state.go('global.content.system.shopManage_add_modify', {id: ''});
        };
        //搜索
        $scope.search = function () {
            $("#table").bootstrapTable('refresh', {
                query:{shopname: $scope.shopname}
            });
        };
    }];
});