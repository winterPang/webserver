define([
    'css!../css/editmap',
    'css!../css/addElement',
    'css!../css/laydate',
    'css!../css/molv',
    '../libs/jtopo-0.4.8-min',
    '../libs/heatmap',
    '../libs/laydate',
    '../directive/drag',
    '../directive/full',
    '../directive/scale',
    '../services/locationConst',
    '../services/locSer',
    '../services/JtopoSer'
],function () {
    return ['$scope', '$alertService', '$timeout', '$state',
                '$stateParams', 'locConst', 'locSer', 'jtopoSer',function (
                    $scope,$alert,$timeout,$state,
                        $stateParams,locConst,locSer,jtopoSer) {

        var shopId = $stateParams.shopId,
            locationId = $stateParams.locationId,
            macAddress = $stateParams.macAddress,
            mode = $scope.mode = parseInt($stateParams.mode);

        var stage,scene;
        var intervalId;
        $scope.modeName = locConst.getName(mode);
        $scope.isClientMap = 1;
        $scope.isRealSearch = 0;
        $scope.macAddress = macAddress;
        $scope.info  = {
            macEmpty:'mac地址不能为空',
            formatError:'mac地址格式不正确！mac地址格式为xx:xx:xx:xx:xx:xx或xxxx-xxxx-xxxx',
            startEmpty:'请选择开始时间',
            endEmpty:'请选择结束时间'
        };
        $scope.dragOption = {
            style:{
                height:520,
                overflow:'hidden'
            },
            cursor:{
                open:'openhand',
                close:'closedhand'
            },
            select:'#canvas',
            speed:3,
            isdrag:true
        };
        $scope.fullOption = {
            select:'#imageView_container',
            originCss:{
                height:500
            },
            fullStyle :{
                height:800
            }
        };
        $scope.toggleDateSelector = function (todo) {
            if(todo === 'realSearch'){
                $('.box').hide();
                if($scope.isRealSearch) return;
                $scope.isRealSearch = 1;
                $('.toggleButton span').toggleClass('selected');
            }else if(todo === 'history'){
                $('.box').show();
                if(!$scope.isRealSearch) return;
                $scope.isRealSearch = 0;
                clearInterval(intervalId);
                scene.clear();
                $('.toggleButton span').toggleClass('selected')
            }
        };
        $scope.refreshLocationList =  function () {
            var timePromise;
            return function () {
                $timeout.cancel(timePromise)
                timePromise = $timeout(function () {
                    $state.reload()
                },300)
            }
        }();
        $scope.toClientMap = function () {
            $state.go('^.clientmap',{shopId:shopId,locationId:locationId,mode:mode})
        };
        $scope.$on('$stateChangeStart',function () {
            clearInterval(intervalId)
        });
        //日期范围限制
        $timeout(function () {
            var start = {
                elem: '#start',
                format: 'YYYY-MM-DD hh:mm:ss',
                start:laydate.now(0, "YYYY/MM/DD hh:mm:ss"),
                min: laydate.now(-7, "YYYY/MM/DD hh:mm:ss"),
                max: laydate.now(0, "YYYY/MM/DD hh:mm:ss"),
                istime: true,
                istoday: false,
                choose: function (datas) {
                    end.start = datas; //将结束日的初始值设定为开始日
                }
            };
            var end = {
                elem: '#end',
                format: 'YYYY-MM-DD hh:mm:ss',
                start:laydate.now(0, "YYYY/MM/DD hh:mm:ss"),
                min: laydate.now(-7, "YYYY/MM/DD hh:mm:ss"),
                max: laydate.now(0, "YYYY/MM/DD hh:mm:ss"),
                istime: true,
                istoday: false,
                choose: function (datas) {
                    // start.max = datas; //结束日选好后，充值开始日的最大日期
                }
            };
            laydate(start);
            laydate(end);
        });


        //init
        locSer[mode].queryLocationById(locationId)
            .then(function (data) {
                data = data.data;
                if(data.code === 0){
                    var mapInfo = data.locationMapList[0];
                        $scope.scale = mapInfo.scale;
                        jtopoSer.resizeCavas('canvas',mapInfo.path,initCanvas);
                        queryClient();
                        queryRealityClients();
                }
            });

        function initCanvas(w,h){
            var canvas = document.getElementById('canvas');
            // var heatMap = document.getElementById('heatMap');
            //init Jtopo
            stage = new JTopo.Stage(canvas);
            stage.wheelZoom = 0.1;
            scene = new JTopo.Scene(stage);
            scene.mode = 'select';
            scene.areaSelect = false;
            //init heatMap
            // hm = new HeatMap(heatMap, w, h);
        }
        //历史查询
        function queryClient() {
            $("#queryClient").on("click", function () {
                queryClientStep();
            });
        }
        function queryClientStep() {
            var mac = $("#macAddress").val();
            var start = $("#start").val();
            var end = $("#end").val();
            var queryInfo;
            var reg_name = /^(([A-F\d]{2}:){5}[A-F\d]{2})|([\dA-Z]{4}-[\dA-Z]{4}-[\dA-Z]{4})$/i;
            if (mac == "") {
                $alert.alert($scope.info.macEmpty,'通知');
                return false;
            }
            if (!reg_name.test(mac)) {
                $alert.alert($scope.info.formatError,'通知');
                return false;
            }
            if (start == "") {
                $alert.alert($scope.info.startEmpty,'通知');
                return false;
            }
            if (end == "") {
                $alert.alert($scope.info.endEmpty,'通知');
                return false;
            }
            queryInfo = {"mac": mac, "start": start, "end": end, "locationId": locationId};
            $('.box').hide();
            locSer[mode].queryClientStep(queryInfo)
                .then(function (data) {
                    data = data.data;
                    if(data.code === 0
                                && data.clientList
                                && data.clientList.length !== 0){
                        showClientInfo(data.clientList || []);
                        // showHeatMap(data.clientList);
                    }
                })
        }
        //实时查询
        function queryRealityClients() {
            $("#queryRealityClients").on("click", function () {
                var mac = $("#macAddress").val();
                var reg_name = /^(([A-F\d]{2}:){5}[A-F\d]{2})|([\dA-Z]{4}-[\dA-Z]{4}-[\dA-Z]{4})$/i;
                if (mac == "") {
                    $alert.alert($scope.info.macEmpty,'通知');
                    return false;
                }
                if (!reg_name.test(mac)) {
                    $alert.alert($scope.info.formatError,'通知');
                    return false;
                }
                queryCycle(mac);
            });
        }
        function queryCycle(mac) {
            locSer[mode].queryCycle(shopId)
                .then(function (data) {
                    data = data.data;
                    clearInterval(intervalId);
                    // 清除画布
                    scene.clear();
                    intervalId = setInterval(function () {
                        queryRealityClient(mac);
                    }, data.cycle);
                })
        }
        function queryRealityClient(mac) {
            var queryInfo = {"mac": mac, "locationId": locationId};
            locSer[mode].queryRealTimeClient(queryInfo)
                .then(function (data) {
                    data = data.data;
                    if(data.code === 0
                                && data.clientList
                                && data.clientList.length !== 0){
                        showClientInfo(data.clientList);
                    }
                })
        }

        function showClientInfo(clientlist) {
            //贝塞尔曲线
            /*$http.get('/oasis/stable/init/locationmanage/step.json')
                .success(function(data){
                    var list = data.clientList;
                    var array = [];
                    for(var i = 0;i<list.length;i+=3){
                        array.push([list[i],list[i+1],list[i+2],list[i+3]])
                    }

                    var c=document.getElementById("canvas");
                    var ctx=c.getContext("2d");
                    ctx.beginPath();
                    array.forEach(function(item,idx){
                        ctx.moveTo(item[0].posX,item[0].posY);
                        ctx.bezierCurveTo(item[1].posX,item[1].posY,
                                          item[2].posX,item[2].posY,
                                          item[3].posX,item[3].posY);
                        ctx.stroke();
                    })
                })*/

            //直线拟合
            // $http.get('/oasis/stable/init/locationmanage/step.json')
            //     .success(function(clientlist){
            //         clientlist = clientlist.clientList;
                    var opt = {
                        fontColor : '102,102,102',
                        dragable : false,
             	        image : '../locationmanage/img/location.png'
                        // type : 'circle'
                    };
                    if(!$scope.isRealSearch){
                        scene.clear();
                        opt.type = 'circle';
                        opt.image = '';
              	        // var interval = parseInt(5000/clientlist.length);
                	// return jtopoSer.showApNodesInfo(scene,clientlist,opt,null,interval);
                        return jtopoSer.showApNodesInfo(scene,clientlist,opt,null).reduce(function (p, n) {
                            return linkNode(scene,p,n)
                        })
                    }
                    jtopoSer.showApNodesInfo(scene,clientlist,opt);
                // })


        }
        function linkNode(scene,nodeA, nodeZ, text, dashedPattern){
            var link = new JTopo.Link(nodeA, nodeZ, text);
            link.lineWidth = 1; // 线宽
            link.dashedPattern = dashedPattern; // 虚线
            link.bundleOffset = 60; // 折线拐角处的长度
            link.bundleGap = 20; // 线条之间的间隔
            link.textOffsetY = 3; // 文本偏移量（向下3个像素）
            link.strokeColor = '0,200,255';
            link.arrowsRadius = 8;
            scene.add(link);
            return nodeZ;
        }
    }]
})