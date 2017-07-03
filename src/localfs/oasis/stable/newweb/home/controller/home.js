define(['jqueryZtree', 'echarts3','css!home/css/home','css!frame/libs/ztree/css/zTreeStyle'], function (jqueryZtree, echarts) {
    return ['$scope', '$http', '$timeout', '$rootScope', '$q', '$alertService', function ($scope, $http, $timeout, $rootScope, $q, $alert) {
        function initChart(id, options) { // 初始化 - chart
            var pie = document.getElementById(id);
            if (!pie) {
                return;
            }
            var chart = echarts.init(pie);
            chart.setOption(options);
            window.addEventListener("resize", function () {
                chart.resize();
            });
            /*if (id == 'levelPie') {
             levelChart = chart;
             } else {
             moduleChart = chart;
             }*/
        }

        function drawEmatyRing(id) {
            var options = {
                tooltip: {
                    show: false
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['35%', '55%'],
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

        function drawEmptyPie(id) {
            var options = {
                tooltip: {
                    show: false
                },
                series: [
                    {
                        type: 'pie',
                        /*center: ['38%', '50%'],*/
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

        function drawEmptyLine(id) {
            var options = {
                color: ['#3398DB'],
                tooltip: {
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
                xAxis: [
                    {
                        type: 'category',
                        data: [],
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '直接访问',
                        type: 'bar',
                        barWidth: '60%',
                        data: []
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

        function drawRing(id, option) {
            var default_option = {
                color: ['#1bbc9b', '#f27935', '#f4b350', '#31495a', '#428ace'],
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}<br/>{c} ({d}%)"
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['35%', '55%'],
                        startAngle: 120,
                        minAngle: 4,
                        label: {
                            normal: {
                                textStyle: {
                                    color: '#34495e',
                                    fontSize: 14
                                }/*,
                                formatter: function (params) {
                                    var sLabel = params.name + '\n'
                                        + params.seriesName + params.value + 'Kpbs';
                                    return sLabel;
                                }*/
                            }
                        },
                        labelLine: {
                            normal: {
                                show: true,
                                lineStyle: {
                                    color: '#34495e'
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                borderColor: '#f6f6f6',
                                borderWidth: 2,
                                borderType: 'solid'
                            }
                        },
                        data: [
                            {value: '5.0', name: 'AP001a'},
                            {value: '4.7', name: 'AP409a'},
                            {value: '3.0', name: 'AP211a'},
                            {value: '3.0', name: 'AP211b'},
                            {value: '3.0', name: 'AP211c'}
                        ]
                    }
                ]
            };
            var options = $.extend(true,{},default_option,option);
            initChart(id, options);
        }

        function drawPie(id, option) {
            var default_option = {
                color: ['#d03b25', '#f27935', '#1bbc9b'],
                legend: {
                    left: 'center',
                    // top: 'bottom',
                    bottom:'10px',
                    icon: 'circle'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}<br/>{c} ({d}%)"
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['0', '55%'],
                        startAngle: 120,
                        minAngle: 4,
                        label: {
                            normal: {
                                show: false
                            }
                        },
                        // labelLine: {
                        // 	normal: {
                        // 		show: false
                        // 	}
                        // },
                        itemStyle: {
                            normal: {
                                borderColor: '#f6f6f6',
                                borderWidth: 2,
                                borderType: 'solid'
                            }
                        }
                    }
                ]
            };
            var options = $.extend(true,{},default_option,option);
            initChart(id, options);
        }

        function drawLine(id, legendData, data) {
            var options = {
                color: ['#1bbc9b'],
                legend: {
                    /*x: 'right',*/
                    /*y: 50,*/
                    itemWidth: 22,
                    itemHeight: 14,
                    orient: 'vertical',
                    data: legendData
                },
                tooltip: {
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
                xAxis: [
                    {
                        type: 'category',
                        data: legendData,
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            formatter: "{value}%"
                        }
                    }
                ],
                series: [
                    {
                        type: 'bar',
                        barWidth: '60%',
                        data: data
                    }
                ]
            };
            initChart(id, options);
        }

        /*function initSimple() {
            $(".oasis-header-info").css("margin-left", "0");

            $scope.activeTabSimple = 1;
            $scope.changeTabSimple = function (number) {
                $scope.activeTabSimple = number;
            };

            $timeout(function () {
                $(".oasis-home-content-simple").attr("style", "height:" + ($(window).innerHeight() - 92) + "px");
                $(window).resize(function () {
                    $(".oasis-home-content-simple").attr("style", "height:" + ($(window).innerHeight() - 92) + "px");
                });
            });

            // simple-eqtype

            $timeout(function () {

                /!* 极简版 告警类型 start *!/
                var simpleWarnOp = {
                    series: [
                        {
                            name: '设备类型',
                            label: {
                                normal: {
                                    formatter: function (params) {
                                        var sLabel = params.name + '\n'
                                            + params.value + '台 ('+params.percent+'%)';
                                        return sLabel;
                                    }
                                }
                            },
                            data: [
                                {value: '5', name: 'AP001a'},
                                {value: '4', name: 'AP409a'},
                                {value: '3', name: 'AP211a'},
                                {value: '3', name: 'AP211b'},
                                {value: '3', name: 'AP211c'}
                            ]
                        }
                    ]
                };
                drawRing("simple_warn", simpleWarnOp);
                /!* 极简版 告警类型 end *!/
                /!* 极简版 设备类型 start *!/
                var simpleEqtypeOp = {
                    series: [
                        {
                            name: '设备类型',
                            label: {
                                normal: {
                                    formatter: function (params) {
                                        var sLabel = params.name + '\n'
                                            + params.value + '台 ('+params.percent+'%)';
                                        return sLabel;
                                    }
                                }
                            },
                            data: [
                                {value: '5', name: 'AP001a'},
                                {value: '4', name: 'AP409a'},
                                {value: '3', name: 'AP211a'},
                                {value: '3', name: 'AP211b'},
                                {value: '3', name: 'AP211c'}
                            ]
                        }
                    ]
                };
                drawRing("simple-eqtype", simpleEqtypeOp);
                /!* 极简版 设备类型 end *!/
                /!* 极简版 CPU start *!/
                var simpleCpuOp = {
                    legend:{
                        data: ['高（70%<）', '偏高（50%-70%）', '正常（<50%）']
                    },
                    series: [
                        {
                            data: [
                                {value: 4000, name: '高（70%<）'},
                                {value: 3500, name: '偏高（50%-70%）'},
                                {value: 12000, name: '正常（<50%）'}
                            ]
                        }
                    ]
                };
                drawPie("simple-cpu", simpleCpuOp);
                /!* 极简版 CPU end *!/
                /!* 极简版 内存 start *!/
                var simpleMemoryOp = {
                    legend:{
                        data: ['高（70%<）', '偏高（50%-70%）', '正常（<50%）']
                    },
                    series: [
                        {
                            data: [
                                {value: 100, name: '高（70%<）'},
                                {value: 350, name: '偏高（50%-70%）'},
                                {value: 1200, name: '正常（<50%）'}
                            ]
                        }
                    ]
                };
                drawPie("simple-memory", simpleMemoryOp);
                /!* 极简版 内存 end *!/

            });
            $scope.simple_equipmentTable = {
                tId: 'simple_equipmentTable',
                url: '../home/json/table/equipmentTable.json',
                pageSize: 5,
                pageList: [5, 10, 15, 20],
                columns: [
                    {sortable: true, field: 'name', title: "设备名称"},
                    {sortable: true, field: 'state', title: "状态",
                        formatter:function(val,row,index){
                            if(val == '在线'){
                                return "<div style='color: #1bbc9b;'><span class='fa fa-circle' style='font-size: 13px;margin-right: 5px'></span>在线</div>"
                            }else if(val == '离线'){
                                return "<div style='color: #a2a8ab;'><span class='fa fa-circle' style='font-size: 13px;margin-right: 5px'></span>离线</div>"
                            }
                        }},
                    {sortable: true, field: 'cpu', title: "CPU使用率"},
                    {sortable: true, field: 'memory', title: "内存使用率"},
                    {sortable: true, field: 'upflow', title: "上行流量"},
                    {sortable: true, field: 'downflow', title: "下行流量"},
                    {sortable: true, field: 'type', title: "类型"},
                    {sortable: true, field: 'model', title: "型号"},
                    // {sortable: true, field: 'group', title: "分组"},
                    {field: 'op', title: "操作",formatter:function () {
                        return "<a href='https://oasisrd.h3c.com/oasis/stable/newweb/frame/index.html#/scene5/nasid352331/devsn219801A0WFH133000005/monitor/dashboard' target='_blank' class='tbtn'>运维</a>"
                    },width:150}
                ]
            };

        }*/

        function initProf() {
            $(".oasis-header-info").css("margin-left", "220px");
            $timeout(function () {
                $(".oasis-home-content").attr("style", "height:" + ($(window).innerHeight() - 92) + "px");
                $(window).resize(function () {
                    $(".oasis-home-content").attr("style", "height:" + ($(window).innerHeight() - 92) + "px");
                    $(".oasis-home-ztree").height(($(window).innerHeight() - 64 - 130 - 60 - 4));
                });
            });


            $scope.prof_equipmentTable = {
                tId: 'prof_equipmentTable',
                url: '../home/json/table/equipmentTable.json',
                pageSize: 5,
                pageList: [5, 10, 15, 20],
                columns: [
                    {sortable: true, field: 'name', title: "设备名称"},
                    {sortable: true, field: 'state', title: "状态",
                        formatter:function(val,row,index){
                            if(val == '在线'){
                                return "<div style='color: #1bbc9b;'><span class='fa fa-circle' style='color:#00FF00;font-size: 13px;margin-right: 5px'></span>在线</div>"
                            }else if(val == '离线'){
                                return "<div style='color: #a2a8ab;'><span class='fa fa-circle' style='font-size: 13px;margin-right: 5px'></span>离线</div>"
                            }
                    }},
                    {sortable: true, field: 'cpu', title: "CPU使用率"},
                    {sortable: true, field: 'memory', title: "内存使用率"},
                    {sortable: true, field: 'upflow', title: "上行流量"},
                    {sortable: true, field: 'downflow', title: "下行流量"},
                    {sortable: true, field: 'type', title: "类型"},
                    {sortable: true, field: 'model', title: "型号"},
                    // {sortable: true, field: 'group', title: "分组"},
                    {field: 'op', title: "操作",formatter:function () {
                        return "<a href='https://oasisrd.h3c.com/oasis/stable/newweb/frame/index.html#/scene5/nasid352331/devsn219801A0WFH133000005/monitor/dashboard' target='_blank' class='tbtn'>运维</a>"
                    },width:150}
                ]
            };


            $scope.rightData={
                region: 0,
                shop: 0
            };
            function refreshRight(e,tId,treeNode) {
                /*获取分支场所数*/
                if(treeNode.iconSkin == 'level3'){
                    $scope.$apply(function () {
                        $scope.rightData.region = 0;
                        $scope.rightData.shop = 0;
                    });
                }else{
                    $http.get("/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/getregioncountandshopcountofregion?region_id="+treeNode.id).success(function (data) {
                        if(data.code == 0){
                            $scope.rightData.region = data.data.regionCount;
                            $scope.rightData.shop = data.data.shopCount;
                        }else{
                            $alert.noticeDanger(data.message);
                        }
                    }).error(function (data) {
                        $alert.noticeDanger("请求发送失败");
                    })
                }
            }

            /*leftTree*/
            var treeOption = {
                data: {
                    keep: {
                        leaf: true,
                        parent: true
                    },
                    simpleData: {
                        enable: true,
                        idKey: 'id',
                        pIdKey: 'parentId',
                        rootPId: null
                    }
                },
                callback: {
                    onClick: refreshRight
                }
            };
            // 开始加载ztree

            function Resource(http, q) {
                this.http = http;
                this.q = q;
            }

            //  获取区域的信息
            Resource.prototype.URL_GET_TREE = '/v3/ace/oasis/oasis-rest-shop/restshop/regioninfo/regions';
            //  获取场所信息
            Resource.prototype.URL_GET_SHOP = '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/getallshopsofuser';
            Resource.prototype.getRegions = function() {
                var defer = this.q.defer(),
                    http = this.http;
                http.get(this.URL_GET_TREE).then(function(resp) {
                    if (resp && resp.data) {
                        if (resp.data.code === 0) {
                            defer.resolve(resp.data.data);
                        } else {
                            defer.reject(resp.data.message);
                        }
                    } else {
                        defer.reject('请求出错');
                    }
                }).catch(function() {
                    defer.reject('请求出错');
                });
                return defer.promise;
            };

            Resource.prototype.getShops = function() {
                var defer = this.q.defer(),
                    http = this.http;
                http.get(this.URL_GET_SHOP).then(function(resp) {
                    if (resp && resp.data) {
                        if (resp.data.code === 0) {
                            defer.resolve(resp.data.data);
                        } else {
                            defer.reject(resp.data.message);
                        }
                    } else {
                        defer.reject('请求出错');
                    }
                }).catch(function(err) {
                    defer.reject('请求出错');
                });
                return defer.promise;
            };
            var res = new Resource($http, $q);
            $q.all([res.getRegions(), res.getShops()]).then(function(r) {
                var regions = r[0],
                    shops = r[1];
                //  拼接场所的信息和区域的信息用来展示tree
                var treeData = $.map(regions, function(reg) {
                    if(reg.parentId){
                        reg.isParent = true;
                        reg.iconSkin = 'level2';
                    }else {
                        reg.iconSkin = 'level1';
                        reg.open = true;
                        $scope.rootRegion = reg;
                    }
                    return reg;
                }).concat($.map(shops, function(shop) {
                    shop.parentId = shop.regionId;
                    shop.name = shop.shopName;
                    shop.id = shop.shopId + "_shop";
                    shop.iconSkin = 'level3';
                    return shop;
                }));
                var ztree = $.fn.zTree.init($('#treeDemo'), treeOption, treeData);
                $(".oasis-home-ztree").height(($(window).innerHeight() - 64 - 130 - 60 - 4));
                ztree.selectNode(ztree.getNodes()[0]);
                refreshRight(undefined, 'treeDemo',$scope.rootRegion);
                //  显示初始化的场所或者区域
            }).catch(function(err) {
                console.error(err);
            });

            // ztree加载完成
            /* ztree end */

            $timeout(function () {
                /* 极简版 设备类型 start */
                var profEqtypeOp = {
                    series: [
                        {
                            name: '设备类型',
                            label: {
                                normal: {
                                    formatter: function (params) {
                                        var sLabel = params.name + '\n'
                                            + params.value + '台 ('+params.percent+'%)';
                                        return sLabel;
                                    }
                                }
                            },
                            data: [
                                {value: '5', name: 'AP001a'},
                                {value: '4', name: 'AP409a'},
                                {value: '3', name: 'AP211a'},
                                {value: '3', name: 'AP211b'},
                                {value: '3', name: 'AP211c'}
                            ]
                        }
                    ]
                };
                drawRing("prof_warn", profEqtypeOp);
                /* 极简版 设备类型 end */
                /* 极简版 设备类型 start */
                var profWarnOp = {
                    series: [
                        {
                            name: '设备类型',
                            label: {
                                normal: {
                                    formatter: function (params) {
                                        var sLabel = params.name + '\n'
                                            + params.value + '台 ('+params.percent+'%)';
                                        return sLabel;
                                    }
                                }
                            },
                            data: [
                                {value: '5', name: 'AP001a'},
                                {value: '4', name: 'AP409a'},
                                {value: '3', name: 'AP211a'},
                                {value: '3', name: 'AP211b'},
                                {value: '3', name: 'AP211c'}
                            ]
                        }
                    ]
                };
                drawRing("prof_eqtype", profWarnOp);
                /* 极简版 设备类型 end */
                /* 极简版 CPU start */
                var profCpuOp = {
                    legend:{
                        data: ['高（70%<）', '偏高（50%-70%）', '正常（<50%）']
                    },
                    series: [
                        {
                            data: [
                                {value: 4000, name: '高（70%<）'},
                                {value: 3500, name: '偏高（50%-70%）'},
                                {value: 12000, name: '正常（<50%）'}
                            ]
                        }
                    ]
                };
                drawPie("prof_cpu", profCpuOp);
                /* 极简版 CPU end */
                /* 极简版 内存 start */
                var profMemoryOp = {
                    legend:{
                        data: ['高（70%<）', '偏高（50%-70%）', '正常（<50%）']
                    },
                    series: [
                        {
                            data: [
                                {value: 100, name: '高（70%<）'},
                                {value: 350, name: '偏高（50%-70%）'},
                                {value: 1200, name: '正常（<50%）'}
                            ]
                        }
                    ]
                };
                drawPie("prof_memory", profMemoryOp);
                /* 极简版 内存 end */


                $http.get("../home/json/line1/local.json").success(function(data){
                    drawLine("prof_line",data.legend,data.data);
                });
               /* var profEqtypeOp = {
                    series: [
                        {
                            name: '设备类型',
                            label: {
                                normal: {
                                    formatter: function (params) {
                                        var sLabel = params.name + '\n'
                                            + params.value + '台 ('+params.percent+'%)';
                                        return sLabel;
                                    }
                                }
                            },
                            data: [
                                {value: '5', name: 'AP001a'},
                                {value: '4', name: 'AP409a'},
                                {value: '3', name: 'AP211a'},
                                {value: '3', name: 'AP211b'},
                                {value: '3', name: 'AP211c'}
                            ]
                        }
                    ]
                };
                drawRing("prof_warn", profEqtypeOp);
                drawRing("prof_eqtype", profEqtypeOp);
                drawPie("prof_cpu");
                drawPie("prof-memory");*/
            });

            /*
             drawEmptyPie("pie4");*/
            /*drawEmptyPie("pie5");
             drawEmptyPie("pie6");
             drawEmptyPie("pie7");
             drawEmptyPie("pie8");
             drawEmptyPie("pie9");
             drawEmptyLine("line1");*/

            function refreshPie(id, url) {
                $http.get(url).success(function (data) {
                    drawPie(id, data.legend, data.data);
                });
            }

            function refreshLine(id, url) {
                $http.get(url).success(function (data) {
                    drawLine(id, data.legend, data.data);
                });
            }

            /*refreshPie("pie1","../newdesign/newhome/json/pie1/all.json");
             refreshPie("pie2","../newdesign/newhome/json/pie2/all.json");
             refreshPie("pie3","../newdesign/newhome/json/pie3/all.json");*/

            /*refreshPie("cpu","../newdesign/newhome/json/cpu/all.json");
             refreshPie("memory","../newdesign/newhome/json/memory/all.json");*/
            /*refreshPie("cpu2","../newdesign/newhome/json/cpu/all.json");
             refreshPie("memory2","../newdesign/newhome/json/memory/all.json");

             refreshPie("pie5","../newdesign/newhome/json/pie5/local.json");
             refreshPie("pie6","../newdesign/newhome/json/pie6/local.json");
             refreshPie("pie7","../newdesign/newhome/json/pie7/local.json");
             refreshPie("pie8","../newdesign/newhome/json/pie8/local.json");
             refreshPie("pie9","../newdesign/newhome/json/pie9/local.json");
             refreshLine("line1","../newdesign/newhome/json/line1/local.json");*/
            /* pie end */

            drawPie("prof_cup",{});

            $scope.activeTab = 1;
            $scope.changeTab = function (number) {
                $scope.activeTab = number;
                /*if(number == 2){
                 drawEmptyPie("pie5");
                 drawEmptyPie("pie6");
                 drawEmptyPie("pie7");
                 drawEmptyPie("pie8");
                 drawEmptyPie("pie9");
                 drawEmptyLine("line1");
                 refreshPie("pie5","../newdesign/newhome/json/pie5/local.json");
                 refreshPie("pie6","../newdesign/newhome/json/pie6/local.json");
                 refreshPie("pie7","../newdesign/newhome/json/pie7/local.json");
                 refreshPie("pie8","../newdesign/newhome/json/pie8/local.json");
                 refreshPie("pie9","../newdesign/newhome/json/pie9/local.json");
                 refreshLine("line1","../newdesign/newhome/json/line1/local.json");
                 refreshPie("cpu2","../newdesign/newhome/json/cpu/all.json");
                 refreshPie("memory2","../newdesign/newhome/json/memory/all.json");
                 }*/
            };
            /*var options = {
             color: ['#1bbc9b', '#f27935', '#f4b350', '#31495a', '#428ace'],
             tooltip: {
             trigger: 'item',
             formatter: "{b}<br/>{c} ({d}%)"
             },
             series: [
             {
             name:'上行流量',
             type:'pie',
             radius: ['35%', '55%'],
             startAngle: 120,
             minAngle: 4,
             label: {
             normal: {
             textStyle: {
             color: '#34495e',
             fontSize: 14
             },
             formatter: function (params) {
             var sLabel = params.name + '\n'
             + params.seriesName + params.value + 'Kpbs';
             return sLabel;
             }
             }
             },
             labelLine: {
             normal: {
             show: true,
             lineStyle: {
             color: '#34495e'
             }
             }
             },
             itemStyle: {
             normal: {
             borderColor: '#f6f6f6',
             borderWidth: 2,
             borderType: 'solid'
             }
             },
             data:[
             {value:'5.0', name:'AP001a'},
             {value:'4.7', name:'AP409a'},
             {value:'3.0', name:'AP211a'},
             {value:'3.0', name:'AP211b'},
             {value:'3.0', name:'AP211c'}
             ]
             }
             ]
             };

             var options1 = {
             color: ['#d03b25', '#f27935', '#1bbc9b'],
             legend: {
             left: 'center',
             top: 'bottom',
             icon: 'circle',
             data: ['高（70%<）', '偏高（50%-70%）', '正常（<50%）']
             },
             tooltip: {
             trigger: 'item',
             formatter: "{b}<br/>{c} ({d}%)"
             },
             series: [
             {
             type:'pie',
             radius: ['0', '55%'],
             startAngle: 120,
             minAngle: 4,
             label: {
             normal: {
             show: false
             }
             },
             // labelLine: {
             // 	normal: {
             // 		show: false
             // 	}
             // },
             itemStyle: {
             normal: {
             borderColor: '#f6f6f6',
             borderWidth: 2,
             borderType: 'solid'
             }
             },
             data:[
             {value:4000, name:'高（70%<）'},
             {value:3500, name:'偏高（50%-70%）'},
             {value:12000, name:'正常（<50%）'}
             ]
             }
             ]
             };*/

        }


        $scope.$watch("oasisType", function (v) {
            if (v == 0) {
                initSimple();
            } else {
                initProf();
            }

        }, true);





        $scope.equipment = {
            modal:{
                mId: "equipment",
                title: "设备信息",
                modalSize: "lg"
            },
            modalOpen:function () {
                $scope.$broadcast("show#equipment");
                $scope.myEchart();
            },
            detail:{

            }
        };

        $scope.myEchart = function () {
            var timeLine = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
            var dataLine = [4,2,5,6,3,1,8,7,5,2,1,4,6,3,5,3,5,6,9,5,9,15,14,13];
            var cpuChart=echarts.init(document.getElementById('equipment-cpu'));
            var memoryChart=echarts.init(document.getElementById('equipment-memory'));
            var warnChart=echarts.init(document.getElementById('equipment-warn'));
            var cpuChartOption = {
                tooltip: {
                    trigger: 'axis',
                    formatter : '{a} : {c}'
                },
                legend: {
                    itemWidth:8
                },
                grid: {
                    x:40, y:40, x2:30, y2:25,
                    borderColor : '#fff'
                },
                xAxis: [
                    {
                        boundaryGap: false,
                        splitLine:false,
                        axisLine  : {
                            show:true ,
                            lineStyle :{color: '#9da9b8', width: 1}
                        },
                        axisTick:{show:false},
                        type: 'category',
                        data: timeLine
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: "CPU",
                        axisTick:{show:false},
                        splitLine:{
                            show:true,
                            textStyle:{color: '#c9c4c5', fontSize:"1px", width:4},
                            lineStyle: {
                                color: ['#e7e7e9']
                            }
                        },
                        axisLine  : {
                            show:true ,
                            lineStyle :{color: '#9da9b8', width: 1}
                        },
                        axisLabel: {
                            show:true,
                            textStyle:{color: '#9da9b8', fontSize:"12px", width:2},
                            formatter: '{value}'
                        }
                    }
                ],
                series: [
                    {
                        name: "CPU",
                        type:'line',
                        barCategoryGap: '40%',
                        itemStyle : {
                            normal: {
                                areaStyle: {
                                    type: 'default'
                                },
                                color:'#00FF00'
                            }
                        },
                        smooth: true,
                        data: dataLine
                    }
                ]
            };
            var memoryChartOption = {
                tooltip: {
                    trigger: 'axis',
                    formatter: '{a} : {c}'
                },
                legend: {
                    itemWidth:8
                },
                grid :
                    {
                        x:40, y:40, x2:30, y2:25,
                        borderColor : '#fff'
                    },
                xAxis: [
                    {
                        boundaryGap: false,
                        splitLine:false,
                        axisLine  : {
                            show:true ,
                            lineStyle :{color: '#9da9b8', width: 1}
                        },
                        axisTick:{show:false},

                        type: 'category',
                        data: timeLine
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: "内存",
                        axisTick:{show:false},
                        splitLine:{
                            show:true,
                            textStyle:{color: '#c9c4c5', fontSize:"1px", width:4},
                            lineStyle: {
                                color: ['#e7e7e9']
                            }
                        },
                        axisLine  : {
                            show:true ,
                            lineStyle :{color: '#9da9b8', width: 1}
                        },
                        axisLabel: {
                            show:true,
                            textStyle:{color: '#9da9b8', fontSize:"12px", width:2},
                            formatter: '{value}'
                        }
                    }
                ],
                series: [
                    {
                        name: "内存",
                        type:'line',
                        barCategoryGap: '40%',
                        itemStyle : {
                            normal: {
                                areaStyle: {
                                    type: 'default'
                                },
                                color:'#0000'
                            }
                        },
                        smooth: true,
                        data: dataLine
                    }
                ]
            };
            var warnChartOption = {
                tooltip: {
                    trigger: 'axis',
                    formatter:function (row) {
                        console.log(row);
                        return row[0].seriesName + ":" + row[0].value + "<br/>" + row[1].seriesName + ":" + row[1].value;

                    }
                },
                legend: {
                    itemWidth: 8,
                    data:['上行流量','下行流量']
                },
                grid :
                    {
                        x:40, y:40, x2:30, y2:25,
                        borderColor : '#fff'
                    },
                xAxis: [
                    {
                        boundaryGap: false,
                        splitLine:false,
                        axisLine  : {
                            show:true ,
                            lineStyle :{color: '#9da9b8', width: 1}
                        },
                        axisTick:{show:false},
                        type: 'category',
                        data: timeLine
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: "流量",
                        axisTick:{show:false},
                        splitLine:{
                            show:true,
                            textStyle:{color: '#c9c4c5', fontSize:"1px", width:4},
                            lineStyle: {
                                color: ['#e7e7e9']
                            }
                        },
                        axisLine  : {
                            show:true ,
                            lineStyle :{color: '#9da9b8', width: 1}
                        },
                        axisLabel: {
                            show:true,
                            textStyle:{color: '#9da9b8', fontSize:"12px", width:2}
                        }
                    }
                ],
                series: [
                    {
                        name: "上行流量",
                        type:'line',
                        barCategoryGap: '40%',
                        itemStyle : {
                            normal: {
                                areaStyle: {
                                    type: 'default'
                                },
                                color:'#F9AB6B'
                            }
                        },
                        smooth: true,
                        data: dataLine
                    },
                    {
                        name: "下行流量",
                        type:'line',
                        barCategoryGap: '40%',
                        itemStyle : {
                            normal: {
                                areaStyle: {
                                    type: 'default'
                                },
                                color:'#69C4C5'
                            }
                        },
                        smooth: true,
                        data: [4,27,5,6,3,14,8,7,5,21,15,14,6,13,35,23,5,6,9,15,9,15,14,13]
                    }
                ]
            };
            cpuChart.setOption(cpuChartOption);
            memoryChart.setOption(memoryChartOption);
            warnChart.setOption(warnChartOption);
        };

        $scope.$on('click-cell.bs.table#prof_equipmentTable', function (e, field, value, row, $element) {
            if (field == "name") {
                $scope.equipment.modalOpen();
                $scope.$apply(function () {
                    $scope.equipment.detail = row;
                });
            }
        });
        $scope.$on('click-cell.bs.table#simple_equipmentTable', function (e, field, value, row, $element) {
            if (field == "name") {
                $scope.equipment.modalOpen();
                $scope.$apply(function () {
                    $scope.equipment.detail = row;
                });
            }
        });

        $scope.$on('$destroy',function () {
            $(".oasis-header-info").css("margin-left", "220px");
        });

        $scope.dountConfig={
            id:'dount',
            title:'dountChart',
            subtitle:'dountChartSubtitle',
            series:[{datapoints:[{y:335,x:'直接访问'},{y:310,x:'邮件营销'},{y:234,x:'联盟广告'},{y:135,x:'视频广告'},{y:1548,x:'搜索引擎'}]}]}
    }];
});