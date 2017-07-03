/**
 * Created by liuyanping lkf6877 on 2017/5/10.
 */
define(['utils','jqueryZtree', 'echarts3', "css!newdesign/newhome/css/index", "css!newdesign/newhome/css/home", 'css!frame/libs/ztree/css/zTreeStyle'], function (Utils,jqueryZtree,echarts) {
    return ['$scope', '$http', '$timeout','$rootScope','$state', function ($scope, $http, $timeout,$rootScope,$state) {
        if($rootScope.domeType == 0){
            $rootScope.changeType = "切换至专业版";
            $rootScope.goAnother = function () {
                $state.go("newdesign.content.newhome");
                $rootScope.domeType = 1;
            };
        }else {
            $state.go("newdesign.content.newhome");
            $rootScope.changeType = "切换至极简版";
            $rootScope.goAnother = function () {
                $state.go("newdesign.content.newhome2");
                $rootScope.domeType = 0;
            };
        }
        $scope.activeTab = 2;
        $scope.changeTab = function (number) {
            $scope.activeTab = number;
        };

        $scope.hideImg = function () {
            $rootScope.firstLogin = true
        };
        $("#warningmsg").css("padding-left","30px");
        $("#branch").css("background-color","#dddddd");
        $("#simple").css("background-color","#4188ce");
        /*$rootScope.userType = "我是高手";*/
        /*$rootScope.changeType = "切换至专业版";
        $rootScope.goAnother = function () {
            $state.go("newdesign.content.newhome");
        };*/
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
            $(".newdesign-right").attr("style", "height:" + ($(window).innerHeight() - 88) + "px");
            $(".leftBranch").attr("style", "height:" + ($(window).innerHeight() - 58) + "px");
            $(window).resize(function () {
                $(".newdesign-right").attr("style", "height:" + ($(window).innerHeight() - 88) + "px");
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
        $scope.equipmentTable = {
            tId: 'equipmentTable',
            url: '../newdesign/newhome/json/table/equipmentTable.json',
            pageSize: 5,
            pageList: [5, 10, 15, 20],
            columns: [
                {sortable: true, field: 'name', title: "设备名称"},
                {sortable: true, field: 'state', title: "状态"},
                {sortable: true, field: 'cpu', title: "CPU使用率"},
                {sortable: true, field: 'memory', title: "内存使用率"},
                {sortable: true, field: 'type', title: "类型"},
                {sortable: true, field: 'model', title: "型号"},
                // {sortable: true, field: 'group', title: "分组"},
                {field: 'op', title: "操作",formatter:function () {
                    return "<a href='https://oasisrd.h3c.com/oasis/stable/web/frame/index.html#/newscene5/nasid352331/devsn219801A0WFH133000005/content/monitor/dashboard' target='_blank' class='tbtn'>运维</a>"
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
        // refreshPie("pie1","../newdesign/newhome/json/pie1/all.json");
        refreshPie("pie2","../newdesign/newhome/json/pie2/all.json");
        // refreshPie("pie3","../newdesign/newhome/json/pie3/all.json");
        refreshPie("cpu","../newdesign/newhome/json/cpu/all.json");
        refreshPie("memory","../newdesign/newhome/json/memory/all.json");

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






        /* echarts Line start */



        $rootScope.sceneInfo = {
            model: "5",
            nasid: "352331",
            sn: "219801A0WFH133000005"
        }
        var URL_GET_HEALTH = '/v3/health/home/health';
        var URL_GET_BAND=  '/v3/devmonitor/getbandwidth';
        var URL_SET_BAND='/v3/devmonitor/setbandwidth';
        var getWanTrafficDataUrl=Utils.getUrl('GET','','/devmonitor/web/wantraffic','../../init/dashboard88/log_msg.json');
        var getAPsUrl = Utils.getUrl('GET', '', '/apmonitor/getApCountByStatus', '../../init/dashboard88/ap_statistics.json');
        var getTerminalCountUrl=Utils.getUrl('GET','','/stamonitor/getclientlistbycondition','../../init/dashboard88/log_msg.json');
        var getSpeedBy10MinUrl=Utils.getUrl('GET', '', '/devmonitor/getwanspeeddayhistby10Min', '../../init/dashboard88/ap_statistics.json');
        var getCpuHistUrl=Utils.getUrl('GET', '', '/devmonitor/gethistcpuratioinfoby10Min', '../../init/dashboard88/ap_statistics.json');
        var getMemoryHistUrl=Utils.getUrl('GET', '', '/devmonitor/gethistmemoryratioinfoby10Min', '../../init/dashboard88/ap_statistics.json');
        var getClientUrl = Utils.getUrl('POST', '', '/stamonitor/monitor', '../../init/dashboard88/ap_statistics.json');
        $scope.urlObj = {
            getAllInterfaces:Utils.getUrl('GET', '', '/devmonitor/getAllInterfaces', '/init/dashboard2/get_ap_count_by_status.json'),
            setOneInterface:Utils.getUrl('GET', '', '/devmonitor/setOneInterfaceNew', '/init/dashboard2/get_ap_count_by_status.json'),
            getOneInterfaceData:Utils.getUrl('GET', '', '/devmonitor/getOneInterfaceDataNew', '/init/dashboard2/get_ap_count_by_status.json'),
            getAllinterfacesFlow:Utils.getUrl('GET', '', '/devmonitor/getAllInterfacesFlowNew', '/init/dashboard2/get_ap_count_by_status.json')
        };
        var getAllinterfaceFlow=Utils.getUrl('GET', '', '/devmonitor/getAllInterfacesFlow', '/init/dashboard2/get_ap_count_by_status.json');
        var g_startTime=new Date(new Date().toLocaleDateString()).getTime();
        var g_endTime=new Date().getTime();
        var g_startDate;
        var g_endDate;
        var g_nominalBandWidth;
        var equipmentCpuChart;
        var equipmentMemoryChart;
        var chartWan;
        //var ApPie = echarts.init(document.getElementById('ap_num'));
        //var termChart = echarts.init(document.getElementById('terminal_online'));
        function getRcString(attrName){
            return Utils.getRcString("dashboard88_rc",attrName);
        }
        window.onresize = function () {
            ApPie.resize()
            //scorePie.resize()
            chartWan.resize()
            termChart.resize()
            equipmentCpuChart.resize()
            equipmentMemoryChart.resize()
        };
        function timeFormat(time){
            var date;
            if(!time){
                if((new Date().toLocaleDateString()).indexOf("年")!=-1){
                    var str=new Date().toLocaleDateString();
                    console.log(str.split(''));
                    var year = str.split('')[1]+str.split('')[2]+str.split('')[3]+str.split('')[4];
                    var month = str.split('')[8];
                    var day = str.split('')[12]+str.split('')[13];
                    date=new Date(year+"/"+month+"/"+day).getTime();
                }
            }else{
                date=time;
            }
            return date
        }
        console.log(timeFormat(g_startTime));

        /*$http({
         url:getAll.url,
         method:getAll.method,
         params:{
         'devSN': $scope.sceneInfo.sn,
         dateTime:g_startTime
         }
         }).success(function(data){
         console.log(data);
         });*/
        $scope.drawApPie=function(aData){
            var apTotal=aData.online+aData.offline;
            var labelTop = {
                normal: {
                    color: '#e7e7e9',
                    label: {
                        show: false,
                        position: 'center',
                        formatter: '{b}',
                        textStyle: {
                            baseline: 'bottom'
                        }
                    },
                    labelLine: {
                        show: false
                    }
                },
                emphasis: {
                    color: '#e7e7e9'
                }
            };
            var labelFromatter = {
                normal: {
                    show:true,
                    formatter: function (params) {
                        //console.log(parseInt((params.value/apTotal)*100));
                        if(apTotal==0){
                            return 0+"%";
                        }else{
                            return  Math.round((params.value/apTotal)*100)+"%"
                        }
                    },
                    textStyle: {
                        //align: 'center',
                        //baseline: 'top',
                        position: 'center',
                        fontWeight: 'normal'
                    }
                }
            };
            var labelBottom = {
                normal: {
                    color: '#4EC1B2',
                    label: {
                        show: true,
                        position:'center',
                        textStyle: {
                            baseline: 'middle',
                            fontSize: 25,
                            color: "#353e4f"
                        }
                    },
                    labelLine: {
                        show: false
                    }
                },
                emphasis: {
                    color: '#4EC1B2'
                }
            };
            var radius = [50, 70];
            scoreOption = {
                tooltip:{
                    show: true,
                    formatter: function (params) {
                        if(apTotal==0){
                            return params.name+':'+'</br>'+params.value+'('+0+'%'+')'
                        }else{
                            return params.name+':'+'</br>'+params.value+'('+Math.round(params.percent)+'%' +')'
                        }
                    }
                },
                series: [
                    {
                        name:"AP数量",
                        type: 'pie',
                        center: ['50%', '50%'],
                        radius: radius,
                        avoidLabelOverlap: false,
                        //x: '80%', // for funnel
                        label: labelFromatter,
                        data: [
                            {name:getRcString("ONLONE_ap"),value:aData.online, itemStyle: labelBottom},
                            {name:getRcString("OFFLINE_ap"),value:aData.offline, itemStyle: labelTop}
                        ]
                    }
                ]
            };
            ApPie.setOption(scoreOption);
        };
        apCount=function(){
            $http({
                url:getAPsUrl.url,
                method:getAPsUrl.method,
                params:{
                    'devSN': $scope.sceneInfo.sn
                }
            }).success(function(data){
                var apTotal=data.ap_statistic.online+data.ap_statistic.offline;
                $("#total_ap").html(apTotal);
                $("#online_ap").html(data.ap_statistic.online);
                $scope.drawApPie(data.ap_statistic);
            }).error(function(){});
        }
        //terminal
        onlineClient=function(){
            $http({
                url:getTerminalCountUrl.url,
                method:getTerminalCountUrl.method,
                params:{
                    'devSN': $scope.sceneInfo.sn,
                    reqType:'all'
                }
            }).success(function(data){
                $("#terminal").html(data.clientList[0].totalCount);
            }).error(function(){});
        }
        //flow
        flow=function(){
            $http({
                url:getAllinterfaceFlow.url,
                method:getAllinterfaceFlow.method,
                params:{
                    'devSN': $scope.sceneInfo.sn
                }
            }).success(function(data){
                //console.log(data.DataList);
                var dataList=data.DataList[data.DataList.length-1]
                var speedUpData=unit(dataList.speed_up);
                var speedDownData=unit(dataList.speed_down);
                $("#Traffic_up").html(speedUpData);
                $("#Traffic_down").html(speedDownData);
            }).error(function(){});
        };
        unit=function(flowData){
            var flowUnit;
            if(flowData<1024){
                flowUnit=flowData+"Kbps";
            }else if(1024<=flowData&&flowData<1048576){
                flowUnit=parseInt(flowData/1024)+"Mbps"
            }else{
                flowUnit=parseInt(flowData/1048576)+"Gbps"
            }
            return flowUnit
        }
        //health
        $scope.healthDegree=function(){
            $http.get(URL_GET_HEALTH+'?acSN='+$scope.sceneInfo.sn).success(function(data){
                console.log(data);
                var healthData=data;
                var aData = $.parseJSON(data);
                var healthData = JSON.parse(aData);
                console.log(healthData.finalscore);
                if (healthData==-1) {
                    healthData = {
                        finalscore: 0,
                        wanspeed: 0,
                        APpercent: 0,
                        clientspeed: 0,
                        security: 0,
                        wireless: 0,
                        system: 0,
                        Bpercent: 0
                    };
                    $scope.drawScorePie(healthData, 0);
                }else{
                    $scope.drawScorePie(healthData, 1);
                }
                $scope.showMessage(healthData);
                $scope.initHealthScore(healthData);
                $scope.getBandWidth();
            }).error(function(){
                $scope.isFail = false;
                $scope.isSuccess = false;
            });
        };
        $scope.showMessage = function (oData) {
            $scope.isFail = false;
            $scope.isSuccess = false;
            if (oData.finalscore == 0) {
            } else if (oData.finalscore < 40) {
                $scope.isFail = true;
                $scope.getPercent = oData.Bpercent;
            } else if (oData.finalscore < 70) {
                $("#terminalMessage").css("color", "#fbceb1");
                $scope.isSuccess = true;
                $scope.getPercent = oData.Bpercent;
                $scope.terminalMessage =getRcString("TIP1");// getRcString("TIP2");
            } else if (oData.finalscore <= 100) {
                $("#terminalMessage").css("color", "#4ec1b2");
                $scope.isSuccess = true;
                $scope.getPercent = oData.Bpercent;
                if (oData.finalscore < 80) {
                    $scope.terminalMessage =getRcString("TIP2");
                } else if (oData.finalscore < 90) {
                    $scope.isSuccess = true;
                    $scope.getPercent = oData.Bpercent;
                    $scope.terminalMessage =getRcString("TIP3");// getRcString("TIP4");
                } else {
                    $scope.isSuccess = true;
                    $scope.getPercent = oData.Bpercent;
                    $scope.terminalMessage =getRcString("TIP4");// getRcString("TIP5");
                }
            }
        };
        //健康度饼图

        $scope.initHealthScore = function (aData) {
            if (!aData) {
            }
            $scope.healthGrade(aData.wanspeed, "#raty_score_1 li");
            $scope.healthGrade(aData.APpercent, "#raty_score_2 li");
            $scope.healthGrade(aData.clientspeed, "#raty_score_3 li");
            $scope.healthGrade(aData.security, "#raty_score_4 li");
            $scope.healthGrade(aData.wireless, "#raty_score_5 li");
            $scope.healthGrade(aData.system, "#raty_score_6 li");
        };
        $scope.healthGrade = function (sizeof, selector) {
            if(sizeof<=2){
                for (var i = 0; i < sizeof; i++) {
                    $(selector).eq(i).removeClass('emptyStar').addClass('dangerStar');
                }
            }else if(sizeof==3){
                for (var i = 0; i < sizeof; i++) {
                    $(selector).eq(i).removeClass('emptyStar').addClass('warningStar');
                }
            }else if(sizeof>3){
                for (var i = 0; i < sizeof; i++) {
                    $(selector).eq(i).removeClass('emptyStar').addClass('lightStar');
                }
            }

        };
        //system info
        $scope.systemInfo = {
            options: {
                mId: 'systemInfo',
                title: getRcString("FORM_TITLE"),
                autoClose: true,
                showCancel: false,
                buttonAlign: "center",
                modalSize: 'lg',
                showHeader: true,
                showFooter: true,
                searchable: true,
                okText:getRcString("CLOSE"),
                okHandler: function (modal, $ele) {
                    //add ap to ap group
                    //$scope.$broadcast('show#systemInfo');
                },
                cancelHandler: function (modal, $ele) {
                },
                beforeRender: function ($ele) {
                    return $ele;
                }
            }
        };
        $scope.systemInformation = function () {
            var systemScoreUrl = Utils.getUrl('GET', '', '/devmonitor/web/system', '/init/dashboard5/system_dev.json');
            var v3Status = Utils.getUrl('POST', '', '/base/getDev', '/init/dashboard5/get_dev.json');
            //$scope.systemData={};
            $scope.$broadcast('show#systemInfo');
            $http({
                url: systemScoreUrl.url,
                method: systemScoreUrl.method,
                params: {
                    'devSN': $scope.sceneInfo.sn
                }
            }).success(function (data) {
                $scope.nCpu = parseInt(data.cpuRatio);
                $scope.nMem = parseInt(data.memoryRatio);
                $scope.drawCircleScore('gauge_cpu', $scope.nCpu, getRcString("cpu"));
                $scope.drawCircleScore('gauge_mem', $scope.nMem, getRcString("memory"));
                $scope.devMode=data.devMode;
                $scope.devSoftVersion=data.devSoftVersion;
                $scope.devHardVersion=data.devHardVersion;
                $scope.devBootWare=data.devBootWare;
            }).error(function () {
            });
            $http({
                url: v3Status.url,
                method: v3Status.method,
                data: {
                    'devSN': $scope.sceneInfo.sn
                }
            }).success(function (data) {
                $scope.statust = data.status || [];
                var Connect_Sta = getRcString("Connect_Stav3").split(",");
                if ($scope.statust == 0) {
                    $scope.connectStatus=Connect_Sta[0];
                    //angular.element("#devv3CloudConnectionState").html(Connect_Sta[0]);
                } else {
                    $scope.connectStatus=Connect_Sta[1];
                    // angular.element("#devv3CloudConnectionState").html(Connect_Sta[1]);
                }
            }).error(function () {
            });
        };
        //band width set
        $scope.bandWidth={};
        $scope.$watch('AddInternetForm.$invalid', function (v) {
            if (v) {
                $scope.$broadcast('disabled.ok#bandWidthSet');
            } else {
                $scope.$broadcast('enable.ok#bandWidthSet');
            }
        });
        $scope.$watch('AddInternetForm.$dirty', function (v) {
            console.log(v);
            if (v) {
                $scope.$broadcast('enable.ok#bandWidthSet');
            } else {
                $scope.$broadcast('disabled.ok#bandWidthSet');
            }
        });
        $scope.bandWidthOption={
            options:{
                mId: 'bandWidthSet',
                title: getRcString("ADD_TITLE"),
                autoClose: true,
                showCancel: true,
                buttonAlign: "center",
                modalSize: 'normal',
                showHeader: true,
                showFooter: true,
                searchable: true,
                okHandler: function (modal, $ele) {
                    $scope.setBandWidth();
                    //$scope.$broadcast('show#bandWidth');
                },
                cancelHandler: function (modal, $ele) {
                },
                beforeRender: function ($ele) {
                    return $ele;
                }
            }
        };
        $scope.getBandWidth=function(){
            $http.get(URL_GET_BAND+'?devSN='+$scope.sceneInfo.sn).success(function (data) {
                if(data.errCode==0){
                    $scope.bandWidth.upband=data.upBandwidth;
                    $scope.bandWidth.downband=data.downBandwidth;
                }else if (data.errCode==1) {

                }
            }).error(function () {});
        };
        $scope.openModal=function(){
            $scope.$broadcast('show#bandWidthSet');
            $scope.$broadcast('disabled.ok#bandWidthSet');
            $scope.getBandWidth();
        };
        $scope.$on('hidden.bs.modal#bandWidthSet', function () {
            $scope.AddInternetForm.$setUntouched();
            $scope.AddInternetForm.$setPristine();
        });
        $scope.setBandWidth=function(){//set band width
            $http.get(URL_SET_BAND+'?devSN='+$scope.sceneInfo.sn+'&upBandwidth='+$scope.bandWidth.upband+'&downBandwidth='+$scope.bandWidth.downband)
                .success(function (data) {
                    console.log(data);
                    if(data.errCode==0){
                        $alert.msgDialogSuccess(getRcString("SETBAND_SUC"));
                        $scope.healthDegree();
                        /*getNominalBandWidt();
                         $timeout(function(){
                         flowChange();
                         },500);*/
                    }else{
                        $alert.msgDialogError(getRcString("SETBAND_FAIL"));
                    }
                }).error(function () {});
        };



        flowChange=function(){
            // storage chart data
            $scope.usageData = [];
            //record request status
            $scope.dataState = 0;
            // judge request status, render chart
            $scope.default = {
                devSN:$scope.sn,
                interfaceName:'',
                name:getRcString("no_choose_port")
            };
            $scope.renderEchart = function(){
                if($scope.dataState%3 === 0){
                    var isInterface = false;
                    angular.forEach($scope.list,function(item,idx){
                        if(item.interfaceName === $scope.interfaceName){
                            console.log('selectName')
                            $scope.selectValue = item;
                            console.log(item);
                            isInterface = true;
                        }
                    });
                    if(!isInterface){
                        $scope.selectValue = $scope.default;
                        $scope.drawBandChart($scope.usageData)
                    }
                    $scope.$watch('selectValue',$scope.changeSelectValue)
                }
            };
            $scope.changeSelectValue = function(n,o){
                console.log(n.interfaceName);
                if(n.interfaceName){
                    var count = 0;
                    $http({
                        method:$scope.urlObj.getAllinterfacesFlow.method,
                        url:$scope.urlObj.getAllinterfacesFlow.url,
                        params: {
                            'devSN': $scope.sceneInfo.sn,
                            dateTime:timeFormat(g_startTime)
                        }
                    }).success(function(data){
                        count++;
                        $scope.usageData[0] = data.DataList.reverse();
                        if(count === 2){
                            $scope.drawBandChart($scope.usageData)
                        }
                    })

                    $http({
                        method:$scope.urlObj.setOneInterface.method,
                        url:$scope.urlObj.setOneInterface.url,
                        params:{
                            'devSN': $scope.sceneInfo.sn,
                            dateTime:timeFormat(g_startTime),
                            interfaceName:$scope.selectValue.interfaceName,
                            interfaceType:$scope.selectValue.interfaceType
                        }
                    }).success(function(data){
                        count++;
                        if(data.errcode === 0){
                            $scope.usageData[1] = data.histdataList.dataList.reverse();
                            $scope.usageData[1].name = $scope.getAbbreviate(data.histdataList.interfaceName);

                            if(count ===2){
                                $scope.drawBandChart($scope.usageData)
                            }
                        }
                    })
                }else{
                    if($scope.usageData.length === 2){
                        $scope.usageData.pop()
                        $scope.drawBandChart($scope.usageData)
                        $http({
                            method:$scope.urlObj.setOneInterface.method,
                            url:$scope.urlObj.setOneInterface.url,
                            params:{
                                'devSN': $scope.sceneInfo.sn,
                                interfaceName:$scope.selectValue.interfaceName,
                                interfaceType:$scope.selectValue.interfaceType
                            }
                        }).success(function(data){
                            if(data.errcode === 0){
                                console.log('success')
                            }
                        })
                    }
                }
            };
            //get list
            $http({
                method:$scope.urlObj.getAllInterfaces.method,
                url:$scope.urlObj.getAllInterfaces.url,
                params: {
                    'devSN': $scope.sceneInfo.sn
                }
            }).success(function(data){
                data.InterfaceList.forEach(function(item,idx){
                    item.name = $scope.getAbbreviate(item.interfaceName)
                })
                data.InterfaceList.unshift($scope.default);
                $scope.list = data.InterfaceList;
                $scope.dataState++;
                $scope.renderEchart()
            });
            //get oneInterface
            $http({
                method:$scope.urlObj.getOneInterfaceData.method,
                url:$scope.urlObj.getOneInterfaceData.url,
                params: {
                    'devSN': $scope.sceneInfo.sn,
                    dateTime:timeFormat(g_startTime)
                }
            }).success(function(data){
                $scope.dataState++;
                if(data.flag === 0){
                    // console.log('flag === 0')
                    $scope.usageData[1] = data.histdataList.dataList.reverse();
                    $scope.usageData[1].name = $scope.getAbbreviate(data.histdataList.interfaceName);
                    $scope.interfaceName = data.histdataList.interfaceName
                }
                $scope.renderEchart()
            });
            //get all
            $http({
                method:$scope.urlObj.getAllinterfacesFlow.method,
                url:$scope.urlObj.getAllinterfacesFlow.url,
                params: {
                    'devSN': $scope.sceneInfo.sn,
                    dateTime:timeFormat(g_startTime)
                }
            }).success(function(data){
                $scope.usageData[0] = data.DataList.reverse();
                $scope.dataState++;
                $scope.renderEchart()
            });
        }
        $scope.timeStatus=function(time) {
            // body...
            if (time < 10) {
                return "0" + time;
            }
            return time;
        };
        $scope.getAbbreviate = function getAbbreviate(str){
            var firstLetter = str[0]
            switch(firstLetter){
                case 'G':
                    return Array.prototype.slice.call(/(G)igabit(E)thernet(\d\/\d\/*\d*)/.exec(str),1).join('').toUpperCase();
                case 'T':
                    return Array.prototype.slice.call(/(Ten)-GigabitEthernet(\d\/\d\/*\d*)/.exec(str),1).join('');
                case 'B':
                    return Array.prototype.slice.call(/(B)ridge-(Agg)regation(\d*)/.exec(str),1).join('').toUpperCase();
                case 'F':
                    return Array.prototype.slice.call(/(Forty)GigE(\d\/\d\/\d*)/.exec(str),1).join('');
            }
        };

        $scope.drawBandChart=function(aData){
            //if (!chartWan) {return;}
            chartWan = echarts.init(document.getElementById("band_width"));
            var aTimes = [];
            var aServices = [];
            var aLegend = [getRcString("ZONGLIANG")];
            var aTooltip = getRcString("total_flow_up_down").split(",");
            var aColor = ["rgba(29,143,222,.2)","rgba(186,85,211,.2)"];
            // var reg = /./;
            // var reg2 = /G\d{1,2}/;
            // var aColor = ["rgba(120,206,195,1)", "rgba(254,240,231,1)", "rgba(144,129,148,1)", "rgba(254,184,185,1)"];
            //x-time
            $.each(aData[0], function(i, oData) {
                var temp = new Date(oData.updateTime);
                aTimes.push(($scope.timeStatus(temp.getHours())||'00') + ":" + ($scope.timeStatus(temp.getMinutes())||'00'));
            });
            angular.forEach(aData, function(oData,i) {
                if(i === 1){
                    aLegend.push(oData.name +" "+getRcString("LIULIANG"));
                    aTooltip.push(oData.name+" " +getRcString("STREAM").split(",")[0],oData.name+" " +getRcString("STREAM").split(",")[1])
                }

                var aUp = [];
                var aDown = [];
                angular.forEach(aData[i], function(oData,i) {
                    aUp.push(Math.abs(oData.speed_up));
                    aDown.push(-oData.speed_down);
                });
                var oUp = {
                    symbol: "none",
                    type: 'line',
                    smooth: true,
                    itemStyle: {
                        normal: {
                            areaStyle: {
                                type: 'default',
                                color: aColor[i]
                            },
                            opacity:0
                        }
                    },
                    name: aLegend[i],
                    data: aUp
                };
                var oDown = {
                    symbol: "none",
                    type: 'line',
                    smooth: true,
                    itemStyle: {
                        normal: {
                            areaStyle: {
                                type: 'default',
                                color: aColor[i]
                            },
                            opacity:0
                        }
                    },
                    name: aLegend[i],
                    data: aDown
                };
                //
                aServices.push(oUp);
                aServices.push(oDown);
            });

            var chartWanOption = {
                tooltip: {
                    show: true,
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line',
                        lineStyle: {
                            color: '#80878C',
                            width: 2,
                            type: 'solid'
                        }
                    }
                    ,formatter: function(y) {
                        var sTips = y[0].name + '<br/>';
                        y.forEach(function(item,idx){
                            sTips += aTooltip[idx] + " " + ':' +" " + Utils.addComma(Math.abs(item.data), "rate", 1) +"<br/>"
                        });
                        return sTips;
                    }
                },
                legend: {
                    orient: "horizontal",
                    y: 0,
                    x: "center",
                    data: aLegend
                },
                dataZoom: [
                    {
                        show: true,
                        realtime: true,
                        start: 0,
                        end: 100
                    },
                    {
                        type: 'inside',
                        realtime: true,
                        start: 0,
                        end: 100
                    }
                ],
                grid: {
                    //x: 100,
                    //y: 20,
                    x: 80,
                    y: 20,
                    x2: 20,
                    y2: 60,
                    borderColor: '#FFF'
                },
                calculable: false,
                xAxis: [{
                    type: 'category',
                    boundaryGap: false,
                    splitLine: true,
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#80878C',
                            width: 2
                        }
                    },
                    axisLabel: {
                        interval:5,
                        show: true,
                        textStyle: {
                            color: '#80878C',
                            width: 2
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    data: aTimes
                }],
                yAxis: [{
                    type: 'value',
                    splitNumber: 5,
                    minInterval : 1,
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: '#80878C',
                            width: 2
                        },
                        formatter: function(nNum) {
                            return Utils.addComma(Math.abs(nNum), 'rate', 1);
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#80878C',
                            width: 2
                        }
                    }
                }],
                series: aServices,
                color: ["rgba(29,143,222,.4)","rgba(75,0,130,.4)"]
            };
            chartWan.setOption(chartWanOption);
        };

        //online_terminal
        clientChange=function(){
            $http({
                url:getClientUrl.url,
                method:getClientUrl.method,
                data:{
                    method:'getOnlineClientDayStatByScenarioid',
                    param:{
                        'scenarioid': $scope.sceneInfo.nasid,
                        dateTime:timeFormat(g_startTime)
                    }
                }
            }).success(function(data){
                if(data.errCode==0){
                    var dataTime=[];
                    var clientCount=[];
                    $.each(data.response,function(index,value){
                        var dateObj=new Date(value.time)
                        var hour=dateObj.getHours();
                        var minute=dateObj.getMinutes()==0?"0"+dateObj.getMinutes():dateObj.getMinutes();
                        dataTime.push(hour+":"+minute);
                        clientCount.push(value.totalCount);
                    });
                    $scope.clientlChart(dataTime,clientCount);
                }
            }).error(function(){});
        }

        $scope.clientlChart=function(time,count){
            option = {
                tooltip : {
                    trigger: 'axis',
                    borderRadius: 0,
                    /*position:
                     function (p) {
                     return [p[0] - 45, p[1] - 35];
                     },*/
                    formatter:'{b0}'+'<br/>'+'终端数  '+":" +" " +'{c0}'
                },
                dataZoom: [
                    {
                        show: true,
                        realtime: true,
                        start: 0,
                        end: 100
                    },
                    {
                        type: 'inside',
                        realtime: true,
                        start: 0,
                        end: 100
                    }
                ],
                grid: {
                    x: 60,
                    y: 20,
                    x2: 30,
                    y2: 60,
                    borderColor: '#FFF',
                    containLabel: true
                },
                calculable: true,
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        axisLabel:{
                            textStyle:{
                                color:"#80878c"
                            }
                        },
                        axisTick:{
                            show:false
                        },
                        axisLine:{
                            lineStyle:{
                                color:'#CCCCCC',
                                width:2
                            }
                        },
                        boundaryGap: false,
                        data :time// ['8:00','9:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00']
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        //scale:true,
                        splitNumber: 5,
                        minInterval : 1,
                        splitLine:{
                            show:false
                        },
                        axisTick:{
                            show:false
                        },
                        axisLabel:{
                            formatter:'{value}',
                            textStyle:{
                                color:'#80878c'
                            }
                        },
                        axisLine:{
                            lineStyle:{
                                color:'#CCCCCC'
                            }
                        }
                    }
                ],
                series : [
                    {
                        //name:'�ʼ�Ӫ��',
                        type:'line',
                        smooth:'none',
                        //showSymbol:false,
                        //symbol: "circle",
                        areaStyle: {
                            normal: {
                                color:'#4ec1b2'
                            }
                        },
                        lineStyle:{
                            normal:{
                                color:'#4ec1b2',
                                opacity:0
                            }
                        },
                        itemStyle:{
                            normal:{
                                color:'#4ec1b2',
                                opacity:0
                            }
                        },
                        data:count//[120, 132, 101, 134, 90, 230, 210,256,20,150,100,200]
                    }
                ]
            };
            termChart.setOption(option);
        };

        //equipment information

        cpuTendency=function(){
            $http({
                url:getCpuHistUrl.url,
                method:getCpuHistUrl.method,
                params:{
                    'devSN': $scope.sceneInfo.sn,
                    'startTime':timeFormat(g_startTime),
                    'endTime':g_endTime
                }
            }).success(function(data){
                if(data.errCode==0){
                    $scope.drawEquipmentChart(data.dataList.reverse(),'cpu','#b3b7dd','CPU使用 ');
                }
            }).error(function(){});
        }
        memoryTendency=function(){
            $http({
                url:getMemoryHistUrl.url,
                method:getMemoryHistUrl.method,
                params:{
                    'devSN': $scope.sceneInfo.sn,
                    'startTime':timeFormat(g_startTime),
                    'endTime':g_endTime
                }
            }).success(function(data){
                if(data.errCode==0){
                    $scope.drawEquipmentChart(data.dataList.reverse(),'memory','#f2bc98','内存使用 ');
                }
            }).error(function(){});
        }

        function init(){
            apCount();
            onlineClient();
            flow();
            $scope.healthDegree();
            cpuTendency();
            memoryTendency();
            flowChange();
            clientChange();
        }
        init();

        /* echarts Line end */
    }];
});
