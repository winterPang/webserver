/**
 * controller home
 */
define(['jquery', 'async', 'echarts3','jqueryZtree', 'bootstrapValidator', 'css!demohome/css/home.css', 'css!frame/libs/ztree/css/zTreeStyle', 'sprintf', 'home/libs/jsAddress', 'demohome/directive/home_site'], function ($, async, echarts, jqueryZtree) {

    return ['$scope', '$rootScope','$state','$http', '$q', '$alertService', function ($scope,$rootScope, $state,$http, $q, $alert) {

        var URL_GET_WAN_SPEED = '/v3/devmonitor/web/wanspeed?devSN=%s';
        var URL_GET_AP_STATISTIC = '/v3/apmonitor/web/apstatistic?devSN=%s';
        var URL_GET_AC_HEALTH = '/v3/health/home/health?acSN=%s';
        var URL_GET_AC_CLIENT_COUNT = '/v3/stamonitor/web/clientcount?acSN=%s';
        var URL_GET_REGIONS = '/v3/ace/oasis/oasis-rest-shop/restshop/regioninfo/regions';
        var URL_GET_PLACE_INFO_LIST = '/v3/ace/oasis/oasis-rest-shop/restshop/regioninfo/regionshoppage/%d/%d/%d/id/true/undefined';
        var URL_POST_ADD_SITE = '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/addShop';
        var URL_POST_ADD_DEV = '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/shopdevices';
        var URL_DELETE_DEV = '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/shopdevices/%s';

        var URL_DELETE_AREA = '/v3/ace/oasis/oasis-rest-shop/restshop/regioninfo/regions/';
        var URL_ADD_AREA = '/v3/ace/oasis/oasis-rest-shop/restshop/regioninfo/regions';
        var URL_MODIFY_AREA = '/v3/ace/oasis/oasis-rest-shop/restshop/regioninfo/regions';
        var URL_GET_TREE = '/v3/ace/oasis/oasis-rest-shop/restshop/regioninfo/regions';

        // 点击新增区域的treeNode
        $scope.treeNode = {};
        $scope.addDev = {devType: '1'};
        $scope.clickedNode = {};

        //  =========================新增区域开始==============================
            $scope.addModal = function () {
                $scope.$broadcast('show#modal1');
            };

            $scope.paogramming=function(){
                $state.go('^.programming');
            }
 
            $scope.industries=["医疗","教育","金融","互联网",];
            $scope.industry=$scope.industries[0];

            $scope.adds=["无线","教育","金融","互联网",];
            $scope.add=$scope.adds[0];

            $scope.addModes=[
                "按AP添加",
                "按MAC地址添加",
                "按SN序列号添加",
                "按MAC地址段添加",
            ];
            $scope.addMode=$scope.addModes[0];

            $scope.addTos=[
                "总部",
                "教学楼",
                "实验室",
                "食堂",
            ];
            $scope.addTo=$scope.addTos[0];

            $scope.modal1 = {
                option: {
                    mId: 'modal1',
                    autoClose: false,
                    showHeader: false,
                    showFooter: false,
                    beforeRender: function ($ele) {
                        $ele.find('button[name=cancel]').on('click', function () {
                            $scope.$broadcast('hide#modal1');
                        });

                        $ele.find('button[name=config]').on('click', function () {
                            $scope.$broadcast('hide#modal1');                        
                            $scope.$broadcast('show#modal2');                        
                            }
                        );  

                        $ele.find('button[name=confirm]').on('click', function () {
                            $scope.$broadcast('hide#modal1');                        
                            $scope.form1.$setPristine();
                            $scope.form1.$setUntouched();
                        });              
                    }
                }
            };

            $scope.modal2 = {
                option: {
                    mId: 'modal2',
                    autoClose: false,
                    showHeader: false,
                    showFooter: false,
                    beforeRender: function ($ele) {
                        $ele.find('button[name=cancel2]').on('click', function () {
                            $scope.$broadcast('hide#modal2');
                        });

                        $ele.find('button[name=prev2]').on('click', function () {
                            $scope.$broadcast('hide#modal2');                        
                            $scope.$broadcast('show#modal1');                        
                            }
                        );

                        $ele.find('button[name=next2]').on('click', function () {
                            $scope.$broadcast('hide#modal2');                        
                            $scope.$broadcast('show#modal3');                        
                            }
                        );               
                    }
                }
            };

            $scope.modal3 = {
                option: {
                    mId: 'modal3',
                    autoClose: false,
                    showHeader: false,
                    showFooter: false,
                    beforeRender: function ($ele) {
                        $ele.find('button[name=cancel3]').on('click', function () {
                            $scope.$broadcast('hide#modal3');
                        });

                        $ele.find('button[name=prev3]').on('click', function () {
                            $scope.$broadcast('hide#modal3');                        
                            $scope.$broadcast('show#modal2');
                        });       

                        $ele.find('button[name=complete]').on('click', function () {
                            $scope.$broadcast('hide#modal3');                                                 
                        });  
                        
                        $ele.find('button[name=continue]').on('click', function () {
                            $scope.form3.$setPristine();  
                            $scope.form3.$setPristine();
                            $scope.form3.$setUntouched();                                                
                        }); 
                    }
                }
            };








        //  =========================新增区域结束==============================
         
          
         
        //  =========================新增区域开始==============================
        $scope.addSite = function () {
            $scope.$broadcast('show#addShop');
        };

        $scope.options = {
            tId: 'devModelList',
            totalField: 'data.rowCount',
            dataField: 'data.data',
            sortField: 'orderby',
            orderField: 'ascending',
            columns: [
                {sortable: true, field: 'dModel', title: '支持设备型号'}
            ],
            formatShowingRows: function () {
                return '';
            },
            sidePagination: 'server'
        };
        $scope.row = {};
        $scope.$watch('row.scenario_category_name', function (val) {
            $scope.addDev.scence = val;
            $scope.$broadcast('refresh#devModelList', {
                url: "/v3/ace/oasis/oasis-rest-device/restdevice/devicemodel/getdevModels/?seceneId=" + val + "&queryCondition="
            });
        });
        var params = {
            // ownerId: 304,
            name: $scope.treeNode.areaName,
            parentid: $scope.treeNode.id,
            authFrom: $scope.treeNode.authFrom
        };

        $scope.addOptions = {
            tId: 'addDev',
            columns: [
                {field: 'devSn', title: '设备序列号'},
                {field: 'devAlias', title: '设备别名'},
                {
                    field: 'del', title: '删除', formatter: function (value, row) {
                    return '<a style="cursor:pointer;">删除</a>';
                }
                }
            ],
            pagination: false,
            onClickCell: function (field, val, row) {
            }
        };
        $scope.$on('click-cell.bs.table#addDev', function (e, field, value, row, $element) {
            if (field == "del") {
                $alert.confirm("确定删除吗？", function () {
                    $http.delete(sprintf(URL_DELETE_DEV, $scope.devId)).success(function (data) {
                        if (data.code == 0) {
                            $scope.$broadcast('remove#addDev', {field: 'devSn', values: [row.devSn]});
                            $alert.noticeSuccess('删除设备' + devSn + '成功');
                        } else {
                            $alert.noticeDanger(data.message);
                        }
                    }).error(function (msg) {
                        $alert.noticeDanger(msg || '请求出错啦~');
                    });
                });
            }
        });

        $scope.addOptions2 = {
            tId: 'addDev',
            columns: [
                {field: 'devSn', title: '设备序列号'},
                {field: 'devAlias', title: '设备别名'}
            ],
            pagination: false
        };

        $scope.devices = [];
        $scope.addDevModel = function () {
            if ($scope.devices.length >= 5) {
                $alert.noticeDanger('一次最多添加5个设备');
                return;
            }
            //判断设备在该场所下是否已经存在
            if ($scope.devices != undefined) {
                for (var index in $scope.devices) {
                    var device = $scope.devices[index];
                    if (device.devSn === $scope.addDev.devSn) {
                        $alert.noticeDanger('设备序列号已存在');
                        return false;
                    }
                }
            }
            var addDevice = {
                devAlias: $scope.addDev.devAlias,
                devSn: $scope.addDev.devSn,
                devType: $scope.addDev.devType,
                shopId: $scope.reponse_shopId
            };
            $http.post(sprintf(URL_POST_ADD_DEV), JSON.stringify(addDevice)).success(function (data) {
                if (data.code == 0) {
                    $scope.devices.push(addDevice);
                    $scope.devId = data.data;
                    $alert.noticeSuccess('增加设备成功');
                    console.log($scope.devices);
                } else {
                    $alert.noticeDanger(data.message);
                }
                $scope.$broadcast('load#addDev', $scope.devices);
            }).error(function (msg) {
                $alert.noticeDanger(msg || '请求出错啦~');
            });
        };
        $scope.validShopName = {
            url: "/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/isExistSameShopWithUser/{value}",
            method: 'get',// 请求方式
            live: 1,
            validFn: function (resp) {
                if (resp.code == 0) {
                    return true;
                } else {
                    return resp.code;
                }
            }
        };
        $scope.form = {
            option: {
                mId: 'addShop',
                autoClose: false,
                showHeader: false,
                showFooter: false,
                beforeRender: function ($ele) {
                    $ele.find('button[name=cancel]').on('click', function () {
                        $scope.$broadcast('hide#addShop');
                    });

                    //sanjiliandong
                    initAddress(function (p) {
                        $scope.$apply(function () {
                            $scope.row.province = p;
                        });
                        $('#cmbProvince').val(p).trigger('change');
                        $('#cmbCitys').trigger('change');
                    });
                    $ele.find('button[name=cancel]').on('click', function () {
                        $ele.find('[name=form1]').show();
                        $ele.find('[name=form2]').hide();
                        $ele.find('[name=form3]').hide();
                        $ele.find('[name=form4]').hide();
                        $scope.row = {};
                        $scope.addDev = {devType: '1'};
                        $scope.devices = []
                    });
                    $ele.find('button[name=next1]').on('click', function () {
                            $ele.find('[name=form1]').hide();
                            $ele.find('[name=form2]').show();
                            $http.get('/v3/ace/oasis/oasis-rest-device/restdevice/scenario/getAllScenario').success(function (data) {
                                $scope.scens = data.data.data;
                                $.map($scope.scens, function (v) {
                                    v.namedesc = v.name + '(' + v.desc + ')';
                                });
                                //初始化场景分类
                                $scope.row.scenario_category_name = $scope.scens[0].id;
                            });
                        }
                    );

                    $ele.find('button[name=prev1]').on('click', function () {
                        $ele.find('[name=form1]').show();
                        $ele.find('[name=form2]').hide();
                    });
                    $ele.find('button[name=next2]').on('click', function () {
                        var add_data = {
                            shopName: $scope.row.shopName,
                            shopDesc: $scope.row.shopDesc,
                            phone: $scope.row.phone,
                            scenarioId: $scope.row.scenario_category_name,
                            regionId: $scope.region,
                            province: $("#cmbProvince").val(),
                            city: $("#cmbCitys").val(),
                            district: $("#cmbArea").val(),
                            addrDetail: $scope.row.address
                        };
                        $http.post(sprintf(URL_POST_ADD_SITE), JSON.stringify(add_data), {headers: {"Content-Type": "application/json;charset=UTF-8"}}).success(function (data) {
                            if (data.code == 0) {
                                $ele.find('[name=form2]').hide();
                                $ele.find('[name=form3]').show();
                                $scope.reponse_shopId = data.data;
                                $alert.noticeSuccess(data.message);
                            } else {
                                $alert.noticeDanger(data.message);
                            }
                        }).error(function (msg) {
                            $alert.noticeDanger(msg || '请求出错啦~');
                        });

                    });
                    $ele.find('button[name=next3]').on('click', function () {
                        $ele.find('[name=form3]').hide();
                        $ele.find('[name=form4]').show();
                        $scope.$apply(function () {
                            $scope.row.addr = $("#cmbProvince").val() + $("#cmbCitys").val() + $("#cmbArea").val();
                        });
                    });
                    $ele.find('button[name^=prev],button[name^=next]').on('click', function () {
                        $(window).trigger('resize');
                    });
                    $scope.$on('load-success.bs.table#devModelList', function () {
                        $(window).trigger('resize');
                    });
                }
            }
        };


        //  =========================新增区域结束==============================

        //===========================ztree配置=========================
        $scope.$watch("permission", function (perm) {
            if (perm) {
                var p = $.grep(perm, function (o) {
                    return o.id == 'home';
                });
                p = p[0].permission;

                //["SHOP_READ", "SHOP_WRITE", "DEVICE_READ", "DEVICE_WRITE", "REGION_READ", "REGION_WRITE"]
                // 初始化ztree的配置
                function hasPermission(key) {
                    return p.indexOf(key) != -1;
                }

                // 区域可读可写
                // var REGION_READ = false;
                var REGION_READ = hasPermission('REGION_READ');
                var REGION_WRITE = hasPermission('REGION_WRITE');
                // var SHOP_WRITE = false;
                var SHOP_WRITE = hasPermission('SHOP_WRITE');
                // var REGION_WRITE = false;

                // 全局权限
                $scope.NO_PERMISSION = false;

                // 可读则显示首页，不可读不显示首页
                $scope.REGION_READ = REGION_READ;

                $scope.SHOP_WRITE = SHOP_WRITE;

                if (!REGION_READ) {
                    // 直接返回
                    return;
                }
                function addHoverDom(treeId, treeNode) {
                    if (REGION_WRITE) {
                        var $btn = $("#addBtn_" + treeNode.tId);
                        var $treeNodeNameSpan = $("#" + treeNode.tId + "_span");
                        if (!$btn.length) {
                            $btn = $(sprintf("<span class='button add' id='addBtn_%s' title='添加区域' onfocus='this.blur();'></span>", treeNode.tId));
                            $treeNodeNameSpan.after($btn);
                        }
                        // 注册事件
                        $btn.on('click', function () {
                            $scope.treeNode = treeNode;
                            $scope.$broadcast('show#addAreaModal');
                            return false;
                        });
                    }
                }

                function removeHoverDom(treeId, treeNode) {
                    if (REGION_WRITE) {
                        $("#addBtn_" + treeNode.tId).unbind().remove();
                    }
                }

                var setting = {
                    view: {
                        line: false,
                        removeHoverDom: removeHoverDom,
                        addHoverDom: addHoverDom,
                        selectedMulti: false
                    },
                    edit: {
                        drag: {isMove: false, prev: false, next: false, inner: false, isCopy: false},
                        enable: true,
                        removeTitle: "删除区域",
                        renameTitle: "修改名称",
                        editNameSelectAll: true,
                        showRemoveBtn: function (tId, treeNode) {
                            // 根节点没有修改权限
                            return !!treeNode.parentId && REGION_WRITE;
                        },
                        showRenameBtn: function () {
                            // 没有写权限的时候不显示重命名权限
                            return REGION_WRITE;
                        }

                    },
                    data: {
                        simpleData: {
                            enable: true
                        }
                    },
                    callback: {
                        beforeRemove: removeNode,
                        beforeEditName: beforeEditName,
                        onClick: function (e, treeId, treeNode) {
                            $scope.$apply(function () {
                                $scope.region = treeNode.id;
                                $scope.clickedNode = treeNode;
                            });
                        }
                    }
                };

                // 加载ztree
                loadZtree(setting);
            }

        });

        /**
         * 删除节点
         * @param treeId
         * @param treeNode
         * @returns {boolean}
         */
        function removeNode(treeId, treeNode) {
            $scope.ztreeObj.selectNode(treeNode);
            $alert.confirm('确认删除' + treeNode.name + '吗？', function (modal) {
                modal.disableOk();
                $http.delete(URL_DELETE_AREA + treeNode.id)
                    .success(function (data) {
                        if (data.code == 0) {
                            $scope.ztreeObj.removeNode(treeNode);
                            $alert.noticeSuccess(data.message);
                            modal.close();
                        } else {
                            $alert.noticeDanger(data.message);
                        }
                        modal.disableOk(false);
                    })
                    .error(function (data) {
                        $alert.noticeDanger(data.message);
                        modal.disableOk(false);
                    });
            }, false);
            return false;
        }

        /**
         * 修改treeNode名称
         * @param treeId
         * @param treeNode
         * @returns {boolean}
         */
        function beforeEditName(treeId, treeNode) {
            $scope.treeNode = treeNode;
            $scope.treeNode.areaName = treeNode.name;
            $scope.treeNode.oldName = treeNode.name;
            $scope.$broadcast('show#modifyAreaModal');
            return false;
        }

        /**
         * 加载ztree
         */
        function loadZtree(setting) {
            if ($scope.ztreeObj) {
                $.fn.zTree.destroy('treeDemo');
            }
            // 加载ztree数据
            $http.get(URL_GET_TREE).success(function (data) {
                if (data.code == 0) {
                    $.map(data.data, function (v) {
                        if (v.parentId != undefined) {
                            v.pId = v.parentId;
                        } else {
                            v.open = true;
                        }
                        return v;
                    });
                    if (data.data && !data.data.length) {
                        $scope.NO_PERMISSION = true;
                    }
                    if (data && data.data && data.data[0]) {
                        $scope.region = data.data[0].id;
                    }

                    $scope.ztreeObj = $.fn.zTree.init($("#treeDemo"), setting, data.data);
                }
            }).error(function (error) {

            });
        }

        //  关闭添加模态框初始化操作
        $scope.$on('hidden.bs.modal#addAreaModal', function () {
            // 清空输入框，并且重置表单
            $scope.$apply(function () {
                $scope.treeNode.areaName = '';
                // 重置表单
                $scope.formAddArea.$setPristine();
                $scope.formAddArea.$setUntouched();
            });
            // console.debug();
        });

        //  关闭修改模态框初始化操作
        $scope.$on('hidden.bs.modal#modifyAreaModal', function () {
            // 清空输入框，并且重置表单
            $scope.$apply(function () {
                $scope.treeNode.areaName = '';
                // 重置表单
                $scope.formModifyArea.$setPristine();
                $scope.formModifyArea.$setUntouched();
            });
        });
        // 表单响应
        $scope.$watch('formAddArea.$invalid', function (v) {
            if (v) {
                $scope.$broadcast('disabled.ok#addAreaModal');
            } else {
                $scope.$broadcast('enable.ok#addAreaModal');
            }
        });
        // 表单响应
        $scope.$watch('formModifyArea.$invalid', function (v) {
            if (v) {
                $scope.$broadcast('disabled.ok#modifyAreaModal');
            } else {
                $scope.$broadcast('enable.ok#modifyAreaModal');
            }
        });

        $scope.addAreaModal = {
            mId: 'addAreaModal',
            title: '增加区域',
            autoClose: false,
            okHandler: function (modal) {
                var params = {
                    ownerId: $scope.treeNode.ownerId,
                    name: $scope.treeNode.areaName,
                    parentId: $scope.treeNode.id,
                    authFrom: $scope.treeNode.authFrom
                };
                $scope.$broadcast('disabled.ok#addAreaModal');
                $http.post(URL_ADD_AREA, JSON.stringify(params))
                    .success(function (data) {
                        if (data.code == 0) {
                            var node = {
                                name: $scope.treeNode.areaName,
                                id: data.data,
                                authFrom: $scope.treeNode.authFrom,
                                ownerId: $scope.treeNode.ownerId,
                                pId: $scope.treeNode.id,
                                parentId: $scope.treeNode.id,
                                tId: $scope.treeNode.tId + new Date().getTime(),
                                children: [],
                                open: false
                            };
                            $scope.ztreeObj.addNodes($scope.treeNode, [node]);
                            modal.hide();
                            $alert.noticeSuccess(data.message);
                        } else {
                            $alert.noticeDanger(data.message);
                        }
                        $scope.$broadcast('enable.ok#addAreaModal');
                    })
                    .error(function (data) {
                        $alert.noticeDanger(data.message);
                        $scope.$broadcast('enable.ok#addAreaModal');
                    });
            }
        };
        $scope.modifyAreaModal = {
            mId: 'modifyAreaModal',
            title: '修改区域',
            autoClose: false,
            okHandler: function (modal) {
                if ($scope.treeNode.areaName == $scope.treeNode.oldName) {
                    $alert.noticeSuccess('未修改区域名称！');
                    modal.hide();
                    return;
                }
                $scope.$broadcast('disabled.ok#modifyAreaModal');
                $http.put(URL_MODIFY_AREA, JSON.stringify({
                    ownerId: $scope.treeNode.ownerId,
                    name: $scope.treeNode.areaName,
                    id: $scope.treeNode.id
                }), {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).success(function (data) {
                    if (data.code == 0) {
                        $alert.noticeSuccess(data.message);
                        $scope.treeNode.name = $scope.treeNode.areaName;
                        modal.hide();
                    } else {
                        $alert.noticeDanger(data.message);
                    }
                    $scope.ztreeObj.updateNode($scope.treeNode);
                    $scope.$broadcast('enable.ok#modifyAreaModal');
                }).error(function (data) {
                    $scope.ztreeObj.updateNode($scope.treeNode);
                    $alert.noticeDanger(data.message);
                    $scope.$broadcast('enable.ok#modifyAreaModal');
                });
            }
        };

        $scope.$on('show.bs.modal#optionModal', function () {
            $scope.devices = []
        });
        $scope.complete = function () {
            $scope.$broadcast('hide#addShop');
            // location.reload();
            $scope.$broadcast('regionRefresh');
        };

        $("#add_div").hover(function () {
            $("#add_img").attr("src", "../home/img/icon_homepage_add_active_111x111.png");
        }, function () {
            $("#add_img").attr("src", "../home/img/icon_homepage_add.png");
        });

        /**
         * 重新加载ztree容器的高度
         */
        function resizeZtree() {
            $('.ztree-container').height($(window).height() - 160);
        }

        resizeZtree();
        $(window).on('resize', resizeZtree);
    }];
});