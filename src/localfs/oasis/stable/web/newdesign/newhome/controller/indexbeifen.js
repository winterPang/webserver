/**
 * Created by liuyanping lkf6877 on 2017/5/10.
 */
define(['jqueryZtree', 'echarts3', "css!newdesign/newhome/css/index", "css!newdesign/newhome/css/home", 'css!frame/libs/ztree/css/zTreeStyle'], function (jqueryZtree,echarts) {
    return ['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {
        $scope.region={};
        $scope.first = {
            shop:5,
            group:2
        };
        $scope.second = {
            first:10,
            second:30,
            third:90,
            fourth:100
        };
        $scope.third = {
            first:3,
            second:1,
            third:15,
            fourth:103
        };
        function refreshRight(treeNode) {
            if(treeNode.type == "local"){
                $scope.first = {
                    shop:4,
                    group:2
                };
                $scope.second = {
                    first:10,
                    second:30,
                    third:90,
                    fourth:100
                };
                $scope.third = {
                    first:3,
                    second:1,
                    third:15,
                    fourth:103
                };

            }else if(treeNode.type == "shop"){
                $scope.first = {
                    shop:0,
                    group:2
                };
                $scope.second = {
                    first:5,
                    second:15,
                    third:45,
                    fourth:50
                };
                $scope.third = {
                    first:0,
                    second:1,
                    third:7,
                    fourth:23
                };

            }else if(treeNode.type == "group"){
                $scope.first = {
                    shop:0,
                    group:0
                };
                $scope.second = {
                    first:0,
                    second:0,
                    third:0,
                    fourth:28
                };
                $scope.third = {
                    first:0,
                    second:0,
                    third:7,
                    fourth:19
                };
            }
          // return true;

            refreshPie("pie5","../newdesign/newhome/json/pie5/" + treeNode.type + ".json");
            refreshPie("pie6","../newdesign/newhome/json/pie6/" + treeNode.type + ".json");
            refreshPie("pie7","../newdesign/newhome/json/pie7/" + treeNode.type + ".json");
            refreshPie("pie8","../newdesign/newhome/json/pie8/" + treeNode.type + ".json");
            refreshPie("pie9","../newdesign/newhome/json/pie9/" + treeNode.type + ".json");
            refreshLine("line1","../newdesign/newhome/json/line1/" + treeNode.type + ".json")
        }

        /*$scope.test = function(){
            var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
                nodes = zTree,
                treeNode = nodes[0];
            if (nodes.length == 0) {
                alert("请先选择一个节点");
                return;
            }
            zTree.editName(treeNode);
          $scope.ztreeObj.editName($scope.ztreeData);
            debugger;
        };*/


        $timeout(function () {
            $(".newdesign-right").attr("style", "height:" + ($(window).innerHeight() - 58) + "px");
            $(".leftBranch").attr("style", "height:" + ($(window).innerHeight() - 58) + "px");
            $(window).resize(function () {
                $(".newdesign-right").attr("style", "height:" + ($(window).innerHeight() - 58) + "px");
                $(".leftBranch").attr("style", "height:" + ($(window).innerHeight() - 58) + "px");
            });

        });
        /* ztree */
        $scope.ztreeData = [];
        function loadZtree(setting, nodes) {
            if (nodes) {
                $scope.ztreeObj = $.fn.zTree.init($("#treeDemo"), setting, nodes);
            } else {
                // 加载ztree数据
                $http.get("../newdesign/newhome/json/regions/region.json").success(function (data) {
                    $scope.ztreeData = $.map(data, function (v) {
                        if (v.parentId != undefined) {
                            v.pId = v.parentId;
                        } else {
                            v.open = true;
                        }
                        return v;
                    });
                    $scope.region = $scope.ztreeData[0];
                    $scope.ztreeObj = $.fn.zTree.init($("#treeDemo"), setting, $scope.ztreeData);
                });
            }
        }
        function addHoverDom(treeId, treeNode) {
            var $btn = $("#addBtn_" + treeNode.tId);
            var $treeNodeNameSpan = $("#" + treeNode.tId + "_span");
            if (!$btn.length) {
                $btn = $(sprintf("<span class='button add' id='addBtn_%s' title= '增加' onfocus='this.blur();'></span>", treeNode.tId));
                $treeNodeNameSpan.after($btn);
            }
            $btn.off('click').on('click', function () {
                $scope.treeNode = treeNode;
                $scope.$broadcast('show#addArea');
                return false;
            });
        }
        function removeHoverDom(treeId, treeNode) {
                $("#addBtn_" + treeNode.tId).unbind().remove();
        }
        function removeNode(treeId, treeNode) {
            if(!$rootScope.userInfo.isCompleted) {
                $alert.confirm(getRcString('first-completed'), function () {
                    $state.go('global.content.user.information');
                });
            }else{
                $scope.ztreeObj.selectNode(treeNode);
                var delTip = getRcString("confirm-delete").split(',');
                $alert.confirm(delTip[0] + treeNode.name + delTip[1] + '?', function (modal) {
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
            }

            return false;
        }
        function beforeEditName(treeId, treeNode) {
            /*if(!$rootScope.userInfo.isCompleted) {
                $alert.confirm(getRcString('first-completed'), function () {
                    $state.go('global.content.user.information');
                });
            }else {
                $scope.treeNode = treeNode;
                $scope.treeNode.areaName = treeNode.name;
                $scope.treeNode.oldName = treeNode.name;
                $scope.$broadcast('show#modifyAreaModal');
            }
            return false;*/
           // $scope.$broadcast('show#addArea');

        }
        $("#right").data("state", true).click(function () {
            var v_state = $(this).data("state");
            if (v_state) {
                $(".storeGroup").animate({"left": -258});
                $("#right").animate({"left": 0});
                $(this).data("state", false);
            } else {
                $(".storeGroup").animate({"left": 0});
                $("#right").animate({"left": 258});
                $(this).data("state", true);
            }
        });
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
                removeTitle: "删除",
                renameTitle: "修改",
                editNameSelectAll: true,
                showRemoveBtn: function (tId, treeNode) {
                    // 根节点没有修改权限
                    return true;
                },
                showRenameBtn: function () {
                    // 没有写权限的时候不显示重命名权限
                    return true;
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
                    /*$scope.$apply(function () {
                        $scope.region = treeNode.id;
                        $scope.clickedNode = treeNode;
                    });*/
                    refreshRight(treeNode);
                    $scope.region = treeNode;
                }
            }
        };
        loadZtree(setting);
        function resizeZtree() {
            $('.ztree-container').height($(window).height() - 160);
        }
        resizeZtree();
        $(window).on('resize', resizeZtree);
        /* ztree */


        /*
        $http.post("/v3/ace/oasis/oasis-rest-application/restapp/appOperators/ad/selectedPage",{"appId":154,"shopId":352331,"acSn":"219801A0WFH133000005","ssid":"2560h","selectedPage":'{"ad_home":"disable","ad_portal":"enable","ad_index":"enable","ad_login":"disable"}'}).success(function (data) {
                debugger
        })*/

        /* tab */
        $scope.activeTab = 1;
        $scope.changeTab = function (number) {
            $scope.activeTab = number;
        };
        $scope.equipmentTable = {
            tId: 'equipmentTable',
            url: '../newdesign/newhome/json/table/equipmentTable.json',
            pageSize: 5,
            pageList: [5, 10, 15, 20],
            columns: [
                {sortable: true, field: 'name', title: "设备名称"},
                {sortable: true, field: 'state', title: "状态"},
                {sortable: true, field: 'type', title: "类型"},
                {sortable: true, field: 'model', title: "型号"},
                {sortable: true, field: 'group', title: "分组"},
                {field: 'op', title: "操作",formatter:function () {
                    return "<a class='tbtn'>运维</a>"
                },width:150}
            ]
        };
        $scope.groupTable = {
            tId: 'groupTable',
            url: '../newdesign/newhome/json/table/groupTable.json',
            pageSize: 5,
            pageList: [5, 10, 15, 20],
            columns: [
                {sortable: true, field: 'name', title: "分组名称"},
                {sortable: true, field: 'shop', title: "场所"},
                {sortable: true, field: 'type', title: "类型"},
                {sortable: true, field: 'equipment', title: "设备（台）"},
                {sortable: true, field: 'date', title: "创建日期"},
                {field: 'op', title: "操作",formatter:function () {
                    return "<a class='tbtn'>运维</a><a class='tbtn'>管理设备</a>"
                },width:200}
            ]
        };
        $scope.shopTable = {
            tId: 'shopTable',
            url: '../newdesign/newhome/json/table/shopTable.json',
            pageSize: 5,
            pageList: [5, 10, 15, 20],
            columns: [
                {sortable: true, field: 'name', title: "场所名称"},
                {sortable: true, field: 'local', title: "区域"},
                {sortable: true, field: 'group', title: "分组（数）"},
                {sortable: true, field: 'equipment', title: "设备（数）"},
                {field: 'op', title: "操作",formatter:function () {
                    return "<a class='tbtn'>管理设备</a><a class='tbtn'>管理分组</a>"
                },width:200}
            ]
        };

        /* tab */

        /*pie*/
        function initChart(id, options) { // 初始化 - chart
            var pie = document.getElementById(id);
            if (!pie) {return;}
            var chart = echarts.init(pie);
            chart.setOption(options);
            window.addEventListener("resize",function(){
                chart.resize();
            });
            /*if (id == 'levelPie') {
                levelChart = chart;
            } else {
                moduleChart = chart;
            }*/
        }

        function drawEmptyPie(id) {
            var options = {
                tooltip: {
                    show: false
                },
                series: [
                    {
                        type: 'pie',
                        center: ['38%', '50%'],
                        radius: '60%',
                        label: {
                            normal: {
                                position: 'inner'
                            }
                        },
                        labelLine: {
                            normal: {show: false}
                        },
                        data: [
                            {
                                name: 'N/A',
                                value: 1,
                                itemStyle: {normal: {color: '#e2e2e2'}, emphasis: {color: '#e2e2e2'}}
                            }
                        ]
                    }
                ]
            };
            initChart(id, options);
        }

        function drawEmptyLine(id){
            var options = {
                color: ['#3398DB'],
                tooltip : {
                    /*trigger: 'axis',
                     axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                     type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                     }*/
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : [],
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'直接访问',
                        type:'bar',
                        barWidth: '60%',
                        data:[]
                    }
                ]
            };
            initChart(id, options);
        }

        /*function drawCenterEmptyPie(id) {
            var options = {
                tooltip: {
                    show: false
                },
                series: [
                    {
                        type: 'pie',
                        center: 'center',
                        radius: '60%',
                        label: {
                            normal: {
                                position: 'inner'
                            }
                        },
                        labelLine: {
                            normal: {show: false}
                        },
                        data: [
                            {
                                name: 'N/A',
                                value: 1,
                                itemStyle: {normal: {color: '#e2e2e2'}, emphasis: {color: '#e2e2e2'}}
                            }
                        ]
                    }
                ]
            };
            initChart(id, options);
        }*/

        function drawPie(id, legendData, data) {
            var options = {
                color: ['#febc06',"#d96148", '#72cce6','#2eb9e2','#00a1d7', '#e1554c'],
                legend: {
                    // x: 'right',
                    /*y: 50,*/
                    itemWidth: 10,
                    itemHeight: 10,
                    // orient: 'vertical',
                    data: legendData,
                    bottom:8
                },
                tooltip: {
                    // "{a}<br/>{b}：{c} （{d}%）"
                    formatter: "{b}：{c} （{d}%）"
                    /*function (o) {
                        var percent = o.percent;
                        /!*var percent = o.percent;
                        if (percent == 100) {
                            percent = '99.99%';
                        } else if (!percent) {
                            percent = '0.01%'
                        } else {
                            percent = percent + '%';
                        }*!/
                        return /!*'{b}' + '：' + o.value + '（' + percent + '%）';*!/
                        "{a}<br/>{b}：{c} （{d}%）"
                    }*/
                },
                series: [
                    {
                        /*name: (id == 'levelPie'?getRcText('warn-list-header')[2]:getRcText('warn-list-header')[2]),*/
                        type: 'pie',
                        // center: ['38%', '50%'],
                        center: ['50%', '40%'],
                        radius: '60%',
                        minAngle: 3,
                        stillShowZeroSum: false,
                        itemStyle: {
                            normal: {
                                borderColor: '#fff',
                                borderWidth: 1,
                                borderType: 'solid'
                            }
                        },
                        label: {
                            normal: {
                                show: true,
                                minAngle: 3,
                                position: 'outside',
                                textStyle: {
                                    color: '#343e4e'
                                },
                                formatter: '{b}\n{c}({d}%)'
                            }
                        },
                        labelLine: {
                            normal: {
                                show: true,
                                length: 10,
                                length2: 15,
                                smooth: 0.5
                            }
                        },
                        data: data
                    }
                ]
            };
            initChart(id, options);
        }
        function drawLine(id, legendData, data) {
            var options = {
                color: ['#3398DB'],
                legend: {
                    /*x: 'right',*/
                    /*y: 50,*/
                    itemWidth: 22,
                    itemHeight: 14,
                    orient: 'vertical',
                    data: legendData
                },
                tooltip : {
                    /*trigger: 'axis',
                     axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                     type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                     }*/
                    formatter: "{b}：{c}%"
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : legendData,
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        axisLabel : {
                            formatter:"{value}%"
                        }
                    }
                ],
                series : [
                    {
                        type:'bar',
                        barWidth: '60%',
                        data:data
                    }
                ]
            };
            initChart(id, options);
        }

        drawEmptyPie("pie1");
        drawEmptyPie("pie2");
        drawEmptyPie("pie3");
        /*
        drawEmptyPie("pie4");*/
        drawEmptyPie("pie5");
        drawEmptyPie("pie6");
        drawEmptyPie("pie7");
        drawEmptyPie("pie8");
        drawEmptyPie("pie9");
        drawEmptyLine("line1");

        function refreshPie(id,url){
            $http.get(url).success(function(data){
                drawPie(id,data.legend,data.data);
            });
        }
        function refreshLine(id,url){
            $http.get(url).success(function(data){
                drawLine(id,data.legend,data.data);
            });
        }
        refreshPie("pie1","../newdesign/newhome/json/pie1/all.json");
        refreshPie("pie2","../newdesign/newhome/json/pie2/all.json");
        refreshPie("pie3","../newdesign/newhome/json/pie3/all.json");
        refreshPie("pie5","../newdesign/newhome/json/pie5/local.json");
        refreshPie("pie6","../newdesign/newhome/json/pie6/local.json");
        refreshPie("pie7","../newdesign/newhome/json/pie7/local.json");
        refreshPie("pie8","../newdesign/newhome/json/pie8/local.json");
        refreshPie("pie9","../newdesign/newhome/json/pie9/local.json");
        refreshLine("line1","../newdesign/newhome/json/line1/local.json");
        /*pie*/

        $scope.addArea_modal = {
            mId: "addArea",
            title: "增加",
            // modalSize: "lg",
            autoClose: true,
            okHandler: function (modal) {


            }
        };
    }];
});
