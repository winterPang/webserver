define([
    'css!../css/editmap',
    'css!../css/addElement',
    '../libs/jtopo-0.4.8-min',
    '../libs/heatmap',
    '../libs/imageView',
    '../directive/drag',
    '../directive/full',
    '../directive/scale',
    '../services/locSer',
    '../services/JtopoSer'
],function () {
    return ['$scope',
            '$q',
            '$alertService',
            '$timeout',
            '$state',
            '$stateParams',
            'locSer',
            'jtopoSer',function ($scope,$q,$alert,$timeout,$state,$stateParams,locSer,jtopoSer) {

        var infos = {
            cn: {
                noMatch: '没有找到匹配的记录'
            },
            en: {
                noMatch: 'No matching records found'
            }
        };


        // locationInfo
        var shopId = $stateParams.shopId,
            locationId = $stateParams.locationId,
            mode = $scope.mode = parseInt($stateParams.mode);

        var upImg = "../locationmanage/img/icon-clickUp.png",
            downImg = "../locationmanage/img/icon-clickDown.png",
            $panel = $(".clientShow").data('expand', false);

        var hm;
        var scene,currentNode;
        var table = $('#clientList').bootstrapTable({
            // height: 410,
            columns: [{
                "field": "macAddress",
                "title": "mac",
                "align": "left",
                "formatter": function (val, row) {
                    var str = "<img src='../locationmanage/img/icon-d.png' style='margin-top:2px;margin-left:8px;margin-right: 10px'>"
                        + "<span style='cursor: pointer'>" + val + "</span>";
                    return str;
                }
            }],
            onClickRow:function(row,$element){
                if(mode)return;
                $state.go('^.clientstep',{shopId:shopId, locationId:locationId, mode:mode, macAddress:row.macAddress})
            },
            // 不显示表头
            showHeader: false,
            // 显示分页条
            pagination: true,
            paginationHAlign: 'right',
            paginationDetailHAlign: 'left',
            showPageList:false,
            formatNoMatches: function(){
                return infos.cn.noMatch
            },
            formatShowingRows: function (pageFrom, pageTo, totalRows) {
                return "从" + pageFrom + "到" + pageTo + "/共" + totalRows + "条记录";
            }
        });

        var macDatas;
        var intervalId;

        $scope.isClientMap = 1;
        $scope.dragOption = {
            style:{
                height:550,
                overflow:'hidden'
            },
            cursor:{
                open:'openhand',
                close:'closedhand'
            },
            select:'canvas',
            speed:3,
            isdrag:true
        };
        $scope.fullOption = {
            //元素选择符
            select:'#imageView_container',
            //原始样式 -- 也不传、自动获取
            originCss:{
                height:500
            },
            //全屏样式
            fullStyle :{
                height:800
            }
        };
        $scope.toggleTable = function () {
            var expand = $panel.data('expand');
            if (expand) {
                $panel.slideUp(500);
                $('.imgBtn').attr("src", upImg);
            } else {
                $panel.slideDown(500);
                $('.imgBtn').attr("src", downImg);
            }
            $panel.data('expand', !expand);
        };
        $scope.refreshLocationList =  function () {
            var timePromise;
            return function () {
                $timeout.cancel(timePromise);
                timePromise = $timeout(function () {
                    $state.reload()
                },300)
            }
        }();
        $scope.toLocationList = function () {
            $state.go('^.maplist',{shopId:shopId,mode:mode})
        };
        $scope.locationByMacAddress = function () {
            if(currentNode){
                $state.go('^.clientstep',{shopId:shopId,locationId:locationId,mode:mode,macAddress:currentNode.text})
            }else{
                $state.go('^.clientstep',{shopId:shopId,locationId:locationId,mode:mode})
            }
        };
        $scope.searchSubmit = function () {
            var val = $('#InputSearch').val();
            var data = $.grep(macDatas, function (mac) {
                return mac.macAddress.indexOf(val) != -1;
            });
            $('#clientList').bootstrapTable('load', data);
        };
        $scope.changeCanvas =function () {
            $scope.isClientMap = !$scope.isClientMap;
        };
        $scope.$on('$stateChangeStart',function () {
            clearInterval(intervalId)
        });

        locSer[mode].queryLocationById(locationId)
            .then(function (data) {
                data = data.data;
                var mapInfo = data.locationMapList[0];
                $("#scaleLbl").text(mapInfo.scale);
                resizeCavas('canvas',mapInfo.path,initCanvas);
                if(mode === 0) {
                    return locSer[mode].queryCycle(shopId)
                }
                else {
                    return {data:{cycle:10000,code:0}}
                }

            })
            .then(function (data) {
                data = data.data;
                if(data.code !== undefined && data.code === 0 ){
                    queryLocationClients();
                    intervalId = setInterval(function () {
                        queryLocationClients();
                    }, data.cycle);
                    stopUpdateData();
                    startUpdateData(data.cycle);
                }
            });

        function initCanvas(w,h){
                var canvas = document.getElementById('canvas');
                var heatMap = document.getElementById('heatMap');
                //init Jtopo
                stage = new JTopo.Stage(canvas);
                scene = new JTopo.Scene(stage);
                scene.mode = 'select';
                scene.areaSelect = false;
                stage.addEventListener('mouseup', function (ev) {
                    if (ev.button == 2) {
                        $("#contextmenu1").css({
                            top: ev.pageY,
                            left: ev.pageX
                        }).show();
                    }
                });
                stage.click(function (ev) {
                    if (ev.button == 0) {
                        currentNode = null;
                        $("#contextmenu1").hide();
                    }
                });
                //init heatMap
                hm = new HeatMap(heatMap, w, h);
            }
        function queryLocationClients() {
            locSer[mode].queryLocationClient(locationId)
                .then(function (data) {
                    // console.log(new Date().toLocaleTimeString())
                    if(!(data instanceof Error)){
                        data = data.data;
                        var clientList = data.clientList || [];
                        if (clientList.length !== 0) {
                            macDatas = clientList;
                            table.bootstrapTable('load', clientList);
                            showClientInfo(clientList);
                            showHeatMap(clientList);
                        }
                    }
                })
        }
        function showClientInfo(clientlist) {
            try{
                scene.clear();
            }
            catch (e)
            {
                console.log(e)
            }
            $.each(clientlist, function (client, clientInfo) {
                jtopoSer.addAp(scene,clientInfo.posX,clientInfo.posY,clientInfo.macAddress,'',{
                    fontColor : '0,0,0',
                    dragable : false,
                    image : '../locationmanage/img/phone.png'
                })
                    .addEventListener('mouseup',function (ev) {
                    currentNode = this
                })
                //显示微信头像或默认图标
                /*if (clientInfo.nickname != null && clientInfo.nickname != "") {
                    if (clientInfo.sex == 2) {
                        node.fontColor = '176,23,31';
                    } else {
                        node.fontColor = '0,0,128';
                    }
                    node.setImage(clientInfo.headimgurl);
                } else {
                    node.setImage('../locationmanage/img/phone.png', true);
                    node.fontColor = '';
                }*/
            });
        }
        function showHeatMap(clientlist) {
            try{hm.clear();}catch (e){console.log(e)}
            var poions = clientlist.map(function (item, idx) {
                return [item.posX + 14,item.posY +14]
            });
            hm.addData(poions);
            hm.render();
        }
        function stopUpdateData() {
            $("#stopUpdate").on("click", function () {
                $(this).hide();
                $("#contextmenu1").hide();
                $("#startUpdate").show();
                clearInterval(intervalId);
            });
        }
        function startUpdateData(cycle) {
            $("#startUpdate").on("click", function () {
                $(this).hide();
                $("#contextmenu1").hide();
                $("#stopUpdate").show();
                intervalId = setInterval(function () {
                    queryLocationClients();
                }, cycle);
            });
        }
        function resizeCavas(selector,imagePath,suc) {
            $("<img/>").attr("src", imagePath).load(function () {
                $(selector).attr('width', this.width).attr('height', this.height).css('background-image','url(' + imagePath + ')')
                suc && suc(this.width,this.height)
            });
        }





    }]
})