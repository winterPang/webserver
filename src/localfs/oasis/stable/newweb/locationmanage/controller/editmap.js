define(['css!../css/editmap',
        'css!../css/addElement',
        'css!../css/jquery.dataTables.min',
        '../libs/jquery.dataTables.min',
        '../libs/jtopo-0.4.8-min',
        '../directive/drag',
        '../directive/full',
        '../directive/scale',
        '../services/locSer',
        '../services/JtopoSer'
], function () {
    return ['$scope','$state','$stateParams','$alertService','$timeout','locSer','jtopoSer',function ($scope,$state,$stateParams,$alert,$timeout,locSer,jtopoSer) {
        var shopId = $stateParams.shopId,
            locationId = $stateParams.locationId,
            mode =  $scope.mode = parseInt($stateParams.mode);

        var scene,
            table,
            currentSense,
            currentNode;
        var areaNamesArray;
        var selectNodes = {};
        selectNodes.nodes = "";
        $scope.info = {
            addModalTitle:'AP列表',
            addAreaTitle:'增加区域',
            changeImgTitle:'更改图片',
            modifyScaleTitle:'修改比例尺',
            delMapTitle:'确认删除',
            searchApTitle:'查看AP',
            updataApTitle:'修改AP',
            add:'添加',
            submitChange:'提交更改',
            submit:'提交',
            ensure:'确认',
            close:'关闭',
            cancle:'取消',
            notice:'通知',
            saveSuc:'保存成功',
            delSuc:'删除成功',
            noAuthority:'账号无权限',
            areaNameExg:'区域名称已存在',
            modifyScaleSuc:'修改比例尺成功',
            modifyScaleErr:'修改比例尺失败',
            noAuthrity:'帐号无权限',
            queryLocationError:'获取地图信息失败，请重试',
            saveTimeout:'服务已收到数据，请稍后刷新'
        };
        $scope.isAjaxLoading = 0;
        $scope.dragOption = {
            style:{
                height:550,
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
        $scope.addAp_modalOptions = {
            mId:'addAp',
            title:$scope.info.addModalTitle,
            modalSize:'lg',
            okText: $scope.info.add,
            cancelText: $scope.info.close,
            okHandler: function () {
                if(!table){
                    throw new Error("table didn't init")
                }
                var iX = $('#contextmenu1').data('left') - $('#canvas').get(0).offsetLeft - $('.editmap').get(0).offsetLeft + $('#imageView_container').scrollLeft(),iY = $('#contextmenu1').data('top') - $('#canvas').get(0).offsetTop - $('.editmap').get(0).offsetTop + $('#imageView_container').scrollTop();
                $.each(table.rows('.selected').data(), function (index, row) {
                    jtopoSer.addAp(scene, iX, iY, row.apName, row.apSn,{
                        fontColor:'176,23,31',
                        image:'../locationmanage/img/smallAp.png'
                    },nodeListener);
                    table.row('.selected').remove().draw(false);
                });
                $("#contextmenu").hide();
                $("#contextmenu1").hide();

            },
            cancelHandler: function (modal,$ele){
                if(!table){
                    throw new Error("table didn't init")
                }
                    table.$('tr.selected').removeClass('selected');
            }
        };
        // add Area
        if(!mode){
            $scope.addArea_modalOptions = {
                mId:'addArea',
                title:$scope.info.addAreaTitle,
                modalSize:'normal',
                autoClose:false,
                okText: $scope.info.ensure,
                cancelText: $scope.info.cancle,
                okHandler: function () {
                    var areaTypeName,nodeColor;
                    var motal = $("#areaPoint").val();
                    var areaName = $("#areaName").val();
                    var areaType = $("#areaType").val();
                    if (areaType == 4) {
                        areaTypeName = "定位区域";
                        nodeColor = "255,255,0";
                    } else if (areaType == 5) {
                        areaTypeName = "障碍物";
                        nodeColor = "255,0,0";
                    } else {
                        areaTypeName = "数字围栏";
                        nodeColor = "60,179,113";
                    }
                    var nodeName = areaName + "_" + areaTypeName;
                    var nameAry = areaNamesArray.map(function (item) {
                        return item.split('_')[0]
                    })
                    var is = $.inArray(areaName,nameAry) !== -1;
                    if (is) {
                        $alert.msgDialogError($scope.info.areaNameExg);
                        return false;
                    }
                    $("#contextmenu1").hide();
                    areaNamesArray.push(nodeName);
                    jtopoSer.addArea(scene, nodeName, motal, nodeColor,areaNodeListener);
                    $scope.$broadcast('hide#addArea');
                    $("#areaPoint").val(''),$("#areaName").val(''),$("#areaType").val(6);
                    $scope.addArea.$setPristine();
                    $scope.addArea.$setUntouched();
                },
                cancelHandler: function (modal,$ele){
                    $("#areaPoint").val(''),$("#areaName").val(''),$("#areaType").val(6);
                    $scope.addArea.$setPristine();
                    $scope.addArea.$setUntouched();
                }
            };
        }
        $scope.modifyScale_modalOptions = {
         mId:'modifyScale',
         title:$scope.info.modifyScaleTitle,
         modalSize:'normal',
         okText: $scope.info.submitChange,
         cancelText: $scope.info.close,
         okHandler: function (modal,$ele) {
             var upd = $ele.find('#modifyScale');
             locSer[mode].modifyScale({locationId:locationId,scale:$scope.scale = upd.val()})
                 .then(function (data) {
                     data = data.data;
                     if(data.code === 0){
                         $alert.noticeSuccess($scope.info.modifyScaleSuc,$scope.info.notice);
                     }else if (data.code === 1){
                         $alert.msgDialogError($scope.info.modifyScaleErr,$scope.info.notice);
                     }
                 })
             upd.val('');
             $scope.scaleForm.$setPristine();
             $scope.scaleForm.$setUntouched();
         },
         cancelHandler: function (modal,$ele){
             $ele.find('#modifyScale').val('');
             $scope.scaleForm.$setPristine();
             $scope.scaleForm.$setUntouched();
         }
         };
        $scope.delMap_modalOptions = {
            mId:'delMap',
            title:$scope.info.delMapTitle,
            modalSize:'normal',
            okText: $scope.info.ensure,
            cancelText: $scope.info.cancle,
            okHandler: function () {
                locSer[mode].delMapByLocationId(locationId)
                    .then(function (data) {
                        data = data.data;
                        if (data.code === 0) {
                            $alert.msgDialogSuccess($scope.info.delSuc);
                            $timeout(function () {$state.go('^.maplist',{shopId:shopId,mode:mode})},200)
                        } else if(data.code === 1){
                            $alert.msgDialogError($scope.info.mapNotExist)
                        } else if(data.code ===2){
                            $alert.msgDialogError($scope.info.noAuthrity)
                        }
                    })
            },
            cancelHandler: function (modal,$ele){}
        };
        $scope.searchAp_modalOptions = {
            mId:'searchAp',
            title:$scope.info.searchApTitle,
            modalSize:'normal',
            showOk:false,
            cancelText: $scope.info.close,
            cancelHandler: function (modal,$ele){}
        };
        $scope.updateAp_modalOptions ={
            mId:'updateAp',
            title:$scope.info.updataApTitle,
            modalSize:'normal',
            okText: $scope.info.submitChange,
            cancelText: $scope.info.close,
            okHandler: function () {
                var xupdate = $("#xupdate").val();
                var yupdate = $("#yupdate").val();
                currentNode.setLocation(parseInt(xupdate), parseInt(yupdate));
            },
            cancelHandler: function (modal,$ele){
                $("#xupdate").val(currentNode.x);
                $("#yupdate").val(currentNode.y);
                $('#editAP input').trigger('input')
            }
        };

        //deal modal and rightHandMenu
        $scope.modalFadeIn = function (mId) {
            if(mId === 'addArea'){
                $('#contextmenu1').hide();
            }else if(mId === 'searchAp'){
                $("#apName").val(currentNode.text);
                $("#xqueryAp").val(currentNode.x);
                $("#yqueryAp").val(currentNode.y);
                $("#apSn").val(currentNode.font);
                $('#contextmenu').hide()
            }else if(mId === 'updateAp'){
                $("#xupdate").val(currentNode.x);
                $("#yupdate").val(currentNode.y);
                $('#contextmenu').hide()
            }else if(mId === 'modifyScale'){
                $("#contextmenu1").hide();
            }else{
                $('#contextmenu1').hide()
            }
            $scope.$broadcast('show#' + mId);
        };
        //del ap
        $scope.delApNode = function () {
            table.row.add({
                "apName": currentNode.text,
                "apSn": currentNode.font
            }).draw();
            scene.remove(currentNode);
            $("#contextmenu").hide();
        };
        //del area
        $scope.deleteAreaNode  = function () {
            $("#areaNodeMenu").hide();
            if (selectNodes.nodes != null) {
                var areaName = selectNodes.nodes[0].text;
                $.each(selectNodes.nodes, function (node, nodeValue) {
                    scene.remove(nodeValue);
                });
            }
            var index = $.inArray(areaName, areaNamesArray);
            areaNamesArray.splice(index, 1);
        };
        //save button
        $scope.saveLocationInfo = function () {
            var timer = null;
            return function () {
                $timeout.cancel(timer);
                timer = $timeout(function () {
                    $scope.isAjaxLoading = 1;
                    $('.modal-backdrop').show();
                    locSer[mode].savelocationElement(getNodesInfo(scene,locationId))
                        .then(function (data) {
                            $scope.isAjaxLoading = 0;
                            $('.modal-backdrop').hide();
                            if(data.status === -1)return $alert.msgDialogError($scope.info.saveTimeout,$scope.info.notice);
                            data = data.data;
                            switch (data.code) {
                                case 0:
                                    $alert.noticeSuccess($scope.info.saveSuc,$scope.info.notice);
                                    $timeout(function () {$state.reload()},1500);
                                    break;
                                case 1:
                                    //保存失败
                                    break;
                                case 2:
                                    //账户无权限
                                    $alert.msgDialogError($scope.info.noAuthority,$scope.info.notice);
                                    break;
                            }
                        })
                    },300)
                }
            }();
        //return maplist
        $scope.toLocationList = function () {
            $state.go('^.maplist',{shopId:shopId,mode:mode})
        };
        $timeout(function () {
            $scope.$watch('scaleForm.$valid',function (n, o) {
                if(n)return $scope.$broadcast('enable.ok#modifyScale');
                $scope.$broadcast('disabled.ok#modifyScale');
            });
            $scope.$watch('addArea.$valid',function (n, o) {
                if(n)return $scope.$broadcast('enable.ok#addArea');
                $scope.$broadcast('disabled.ok#addArea');
            })
        });
        locSer[mode].queryLocationById(locationId)
            .then(function (data) {
                if(!/2\d{2}/.test(data.status))return $alert.msgDialogError($scope.info.queryLocationError,$scope.info.notice);
                data = data.data;
                if(data.code === 0){
                    var mapInfo = data.locationMapList[0];
                    $scope.scale = mapInfo.scale;
                    showLocationInfo(mapInfo.path, mapInfo.apInfoList, mapInfo.areaInfoList);
                }
            });
        locSer[mode].queryApinfo(shopId)
            .then(function (data) {
                data = data.data;
                if(data.code === 0){
                    table = $('#example').DataTable({
                        data: data.apInfoList,
                        "sPaginationType": "simple_numbers",
                        "aLengthMenu": [[10, 25, 50, -1], [10, 25, 50, "全部"]],
                        "order": [
                            [0, "desc"]
                        ],
                        columns: [
                            {data: 'apName'},
                            {data: 'apSn'}
                        ],
                        "oLanguage": {
                            "sLengthMenu": "每页显示 _MENU_ 条记录",
                            "sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条记录",
                            "sInfoEmpty": "没有数据",
                            "sInfoFiltered": "(从 _MAX_ 条数据中检索)",
                            "sZeroRecords": "没有检索到数据",
                            "sSearch": "查询:  ",
                            "oPaginate": {
                                "sFirst": "&laquo;",
                                "sPrevious": "&lt;",
                                "sNext": "&gt;",
                                "sLast": "&raquo;"
                            }
                        }
                    });
                    $('#example_filter span').remove();
                    $('#example tbody').on('click', 'tr', function () {
                        $(this).toggleClass('selected');
                    });
                }
            });
        //shop ap info
        function showLocationInfo(mapInfo, apList, areaList) {
            // 更改画布尺寸
            var canvas = document.getElementById('canvas');
            var stage = new JTopo.Stage(canvas);
            scene = new JTopo.Scene();
            scene.mode = 'select';
            scene.areaSelect = false;
            // init the canvas and bind input event handle
            resizeCavas('canvas', mapInfo, function(w, h){
                $('#editAP').on('input', getInputFn(w, h))
            });
            stage.add(scene);
            currentSense = scene;
            scene.addEventListener('mousedown', function (event) {
                currentSense = currentSense ||this
            });
            scene.addEventListener('mouseup', function (event) {
                currentSense && handlerRightButton(event);
            });
            scene.click(function (ev) {
                if (ev.button == 0) {
                    $("#areaNodeMenu").hide();
                    $("#contextmenu").hide();
                    $("#contextmenu1").hide();
                }
            });
            var opt = {
                fontColor:'0,0,0',
                image:'../locationmanage/img/smallAp.png'
            };
            // 显示ap信息
            jtopoSer.showApNodesInfo(scene,apList,opt,nodeListener);
            if(mode === 0){
                // 显示区域
                jtopoSer.showAreaInfo(scene,areaList,areaNodeListener);
                areaNamesArray = areaList.map(function(item){
                    var typeName = item.areaType === 4 ? '定位区域' : item.areaType === 5 ? '障碍物' : '数字围栏';
                    return item.areaName + '_' + typeName
                })
            }
        }
        //right handle
        function handlerRightButton(ev) {
            // 隐藏Ap右键菜单
            $("#contextmenu").hide();
            // 隐藏区域右键菜单
            $("#areaNodeMenu").hide();
            // 显示画布右键菜单
            if (ev.button == 2) {
                $("#contextmenu1")
                    .data({
                        top: ev.pageY,
                        left: ev.pageX
                    })
                    .css({
                        top: ev.pageY,
                        left: ev.pageX
                        })
                    .show();
            }
        }
        function handlerApRightButton(ev) {
            // 隐藏区域右键菜单
            $("#areaNodeMenu").hide();
            if (ev.button == 2) {
                $("#contextmenu").css({
                    top: ev.pageY,
                    left: ev.pageX
                }).show();
            }
        }
        function handlerAreaRightButton(ev) {
            if (ev.button == 2) {
                $("#areaNodeMenu").css({
                    top: ev.pageY,
                    left: ev.pageX
                }).show();
            }
        }
        //node listener
        function nodeListener(scene) {
            this.addEventListener('mouseover',function (ev) {
                $scope.dragOption.isdrag = false;
            })
            this.addEventListener('mouseout',function (ev) {
                $scope.dragOption.isdrag = true;
            })
            this.addEventListener('mouseup', function (ev) {
                // 隐藏画布右键菜单
                $("#contextmenu1").hide();
                // 隐藏区域节点右键菜单
                $("#areaNodeMenu").hide();
                currentNode = this;
                // 显示节点右键菜单
                handlerApRightButton(ev);
                currentSense = null;
            });
        }
        function areaNodeListener(scene) {
            this.addEventListener('mouseover',function (ev) {
                $scope.dragOption.isdrag = false;
            })
            this.addEventListener('mouseout',function (ev) {
                $scope.dragOption.isdrag = true;
            })
            this.addEventListener('mouseup', function (ev) {
                var areaName = this.text;
                // 取得区域节点信息
                var dispayNodes = scene.getDisplayedNodes();
                // 选中相同区域所有节点
                var selectNodesArray = [];
                $.each(dispayNodes, function (node, nodeValue) {
                    if (nodeValue.text == areaName) {
                        nodeValue.selected = true;
                        selectNodesArray.push(nodeValue);
                    } else {
                        nodeValue.selected = false;
                    }
                });
                // 隐藏画布右键菜单
                $("#contextmenu").hide();
                $("#contextmenu1").hide();
                currentAreaNode = this;
                // 显示区域节点右键菜单
                handlerAreaRightButton(ev);
                currentSense = null;
                // 删除区域节点
                selectNodes.nodes = selectNodesArray;
            });
        }
        //get node info resize
        function getNodesInfo(scene,locationId) {
            // 节点信息
            var locationInfo = {
                apNodes : [],
                areaNodes : [],
                locationId : locationId
            };
            var dispayNodes = scene.getDisplayedNodes();
            // 取得区域节点信息
            if (areaNamesArray != null) {
                $.each(areaNamesArray, function (area, areaNameType) {
                    var circleNodeInfoArray = {};
                    var areaName = areaNameType.split("_")[0];
                    var areaTypeName = areaNameType.split("_")[1];
                    var areaType;
                    if (areaTypeName == "障碍物") {
                        areaType = 5;
                    } else if (areaTypeName == "定位区域") {
                        areaType = 4;
                    } else {
                        areaType = 6;
                    }

                    var circleArrayTmp = [];
                    circleNodeInfoArray.areaName = areaName;
                    circleNodeInfoArray.areaType = areaType;
                    $.each(dispayNodes, function (node, nodeValue) {
                        var circleNodesTmp = {};
                        if (nodeValue.text == areaNameType) {
                            circleNodesTmp.xPos = parseInt(nodeValue.x);
                            circleNodesTmp.yPos = parseInt(nodeValue.y);
                            circleArrayTmp.push(circleNodesTmp);
                        }
                    });
                    circleNodeInfoArray.nodes = circleArrayTmp;
                    locationInfo.areaNodes.push(circleNodeInfoArray);
                });
            }
            // 取得ap节点信息
            $.each(dispayNodes, function (node, nodeValue) {
                var nodeInfoArray = {};
                if ($.inArray(nodeValue.text, areaNamesArray) < 0) {
                    nodeInfoArray.apName = nodeValue.text;
                    nodeInfoArray.apSn = nodeValue.font;
                    nodeInfoArray.xPos = nodeValue.x;
                    nodeInfoArray.yPos = nodeValue.y;
                    locationInfo.apNodes.push(nodeInfoArray);
                }
            });

            return locationInfo
        }
        function resizeCavas(selector,imagePath,suc) {
            $("<img/>").attr("src", imagePath).load(function () {
                $(selector).attr('width', this.width).attr('height', this.height).css('background-image','url(' + imagePath + ')')
                suc && suc(this.width,this.height)
            });
        }


        // as for the third params when call the function resizeCavas
        function getInputFn(w, h){
            var shape = {
                w: w,
                h: h
            };
            var el = $('#editAP .error');
            el.get(0).innerHTML += shape.w;
            el.get(1).innerHTML += shape.h;
            return function(ev){
                var tar = ev.target,
                    val = tar.value,
                    // 0 xupdate -- 1 yupdate
                    inputType = +(tar.id === 'yupdate'),
                    flag;

                if(val < 0 || val === ''){
                    flag = true;
                }else if(inputType){
                    // yupdate
                    flag = val > shape.h;
                }else {
                    // xupdate
                    flag = val > shape.w;
                }
                dealPrompt(el.eq(inputType), flag)
            }
        }
        // deal with the error label and the button
        function dealPrompt(el, flag){
            var operation = flag ? 'show' : 'hide',
                evPrefix = flag ? 'disabled' : 'enable';
            $scope.$broadcast(evPrefix + '.ok#updateAp');
            el[operation]();
        }

    }]
})