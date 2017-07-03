/**
 * controller home
 */
define(['jquery', 'async', 'echarts3','jqueryZtree', 'bootstrapValidator', 'css!demohome/css/tree3', 'css!frame/libs/ztree/css/zTreeStyle', 'sprintf', 'home/libs/jsAddress', 'demohome/directive/home_site'], function ($, async, echarts, jqueryZtree) {

    return ['$scope', '$rootScope','$state','$http', '$q', '$alertService', function ($scope,$rootScope, $state,$http, $q, $alert) {

        $(".tree3").height($(document.body).height() - 100 +"px");
        $(window).resize(function () {          //当浏览器大小变化时
            // alert($(window).height());          //浏览器时下窗口可视区域高度
            // alert($(document).height());        //浏览器时下窗口文档的高度
            // alert($(document.body).height());   //浏览器时下窗口文档body的高度
            // alert($(document.body).outerHeight(true)); //浏览器时下窗口文档body的总高度 包括border padding margin
            $(".tree3").height($(document.body).height() - 90 +"px");
        });

        $scope.data={
            numInfo:"",
            oName:"",
            addTo:"总部",
        }
 
        $scope.industries=["医疗","教育","金融","政府","慈善","能源","互联网",];
        $scope.industry=$scope.industries[0];

        $scope.adds=["无线","有线","路由器",];
        $scope.data.add=$scope.adds[0];

        $scope.addModes=[
            {name:"按AP添加",value:"序列号"},
            {name:"按MAC地址添加",value:"MAC地址"},
            {name:"按SN序列号添加",value:"序列号"},
            {name:"按MAC地址段添加",value:"MAC地址"},             
        ];
        $scope.data.addMode=$scope.addModes[0];

        $scope.addTos=[
            "总部",
            "教学楼",
            "实验室",
            "食堂",
        ];

        $scope.data.addTo=$scope.addTos[0];
        $scope.infoState=false;

        $scope.addedDevice={
                tId:'addedDevice',               
                striped:true,
                pagniation:true,
                
                columns:[                   
                    {sortable:true,align:'center',field:'apGroupName',title:'设备型号'},
                    {sortable:true,align:'center',field:'apGroupName2',title:'设备别名'},
                    {sortable:true,align:'center',field:'apGroupName3',title:'所属场所'},
                ], 
                operateTitle: '操作', 
                operate:{  
                                                                                                                         
                    remove:function(e,row,$btn){
                        $alert.confirm("确定删除该设备？", 
                            function () { 
                                                                         
                            }, 
                            function () {                          
                            }
                        ); 

                            
                   },  
                                                                                                           
                }, 
                tips:{                  
                    remove: '删除',
                                                               
                }, 
                icons: {                        
                    remove:'fa fa-trash',                                          
                },                                                  
                data:[
                    {'apGroupName':"3510",'apGroupName2':'01','apGroupName3':'总部'},
                    {'apGroupName':"5510",'apGroupName2':'02','apGroupName3':'食堂'},
                    {'apGroupName':"5510",'apGroupName2':'03','apGroupName3':'教学楼'},
                    {'apGroupName':"3510",'apGroupName2':'03-2','apGroupName3':'教学楼'},
                ]             
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
                            var obj={};            
                            obj.numInfo=$scope.data.numInfo;
                            obj.oName=$scope.data.oName;
                            obj.addTo=$scope.data.addTo;

                            g_data.push(obj);
                            $scope.$broadcast('load#bindDevice',g_data); 

                            $scope.data={
                                numInfo:"",
                                oName:"",
                                addTo:"总部",
                                addMode:$scope.addModes[0],
                                add:"无线",
                            }

                            $scope.infoState=true;
                            $scope.form3.$setPristine();                            
                            $scope.form3.$setUntouched();                                                
                        }); 
                    }
                }
            };

        $scope.addDevice=function(){
            $scope.$broadcast('show#modal3');
        }

        $scope.$on('hidden.bs.modal#addAreaModal', function () {
            $scope.treeNode.areaName="";
            formAddArea.name_area.$dirty=false;                
        });


         $scope.addAreaModal = {
            mId: 'addAreaModal',
            title: '增加区域',
            autoClose: false,
            okHandler: function (modal) {
                // 清空表单状态
                $scope.formAddArea.$setPristine();
                $scope.formAddArea.$setUntouched();
                var params = {
                    ownerId: $scope.treeNode.ownerId,
                    name: $scope.treeNode.areaName,
                    parentId: $scope.treeNode.id,
                    authFrom: $scope.treeNode.authFrom
                };              
                $scope.$broadcast('disabled.ok#addAreaModal');


                var node = {
                    name: $scope.treeNode.areaName,
                    id: $scope.treeNode.areaName,
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
                $alert.noticeSuccess("添加成功");
                $scope.$broadcast('enable.ok#addAreaModal');
            }
        };

        $scope.modifyAreaModal = {
            mId: 'modifyAreaModal',
            title: '修改区域',
            autoClose: false,
            okHandler: function (modal) {
                // 清空表单状态
                // $scope.formModifyArea.$setPristine();
                // $scope.formModifyArea.$setUntouched();
                if ($scope.treeNode.areaName == $scope.treeNode.oldName) {
                    $alert.noticeSuccess('未修改区域名称！');
                    modal.hide();
                    return;
                }
                $scope.$broadcast('disabled.ok#modifyAreaModal');
                $alert.noticeSuccess("修改成功");
                $scope.treeNode.name = $scope.treeNode.areaName;
                modal.hide();
                $scope.ztreeObj.updateNode($scope.treeNode);
                $scope.$broadcast('enable.ok#modifyAreaModal');
            }
        };

        function beforeRemove(treeId, treeNode) {
            $scope.ztreeObj.selectNode(treeNode);
            $alert.confirm('确认删除' + treeNode.name + '吗？', function (modal) {
                modal.disableOk();
                $scope.ztreeObj.removeNode(treeNode);
                $alert.noticeSuccess("删除成功");
                modal.close();
                modal.disableOk(false);
            }, false);
            return false;
        }

        var setting = {
            view: {
                addHoverDom: addHoverDom,
                removeHoverDom: removeHoverDom,
                addDiyDom: addDiyDom,
                selectedMulti: false
            },
            edit: {
                enable: true,
                editNameSelectAll: true,
                showRemoveBtn: true,
                showRenameBtn: true,
                removeTitle: "删除",
                renameTitle: "编辑"
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                beforeDrag: beforeDrag,
                beforeEditName: beforeEditName,
                beforeRemove: beforeRemove,
                beforeRename: beforeRename,
                onRemove: onRemove,
                onRename: onRename
            }
        };

        var zNodes =[
            { id:1, pId:0, name:"总部", open:true},
            { id:11, pId:1, name:"教学楼"},
            { id:12, pId:1, name:"餐厅"},
            { id:13, pId:1, name:"宿舍"}
            // // { id:2, pId:0, name:"父节点 2", open:true},
            // { id:21, pId:2, name:"叶子节点 2-1"},
            // { id:22, pId:2, name:"叶子节点 2-2"},
            // { id:23, pId:2, name:"叶子节点 2-3"},
            // { id:3, pId:0, name:"父节点 3", open:true},
            // { id:31, pId:3, name:"叶子节点 3-1"},
            // { id:32, pId:3, name:"叶子节点 3-2"},
            // { id:33, pId:3, name:"叶子节点 3-3"}
        ];
        var log, className = "dark";
        function beforeDrag(treeId, treeNodes) {
            return false;
        }
        /*function beforeEditName(treeId, treeNode) {
            className = (className === "dark" ? "":"dark");
            showLog("[ "+getTime()+" beforeEditName ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
            var zTree = $.fn.zTree.getZTreeObj("treeDemo3");
            zTree.selectNode(treeNode);
            setTimeout(function() {
                if (confirm("进入节点 -- " + treeNode.name + " 的编辑状态吗？")) {
                    setTimeout(function() {
                        zTree.editName(treeNode);
                    }, 0);
                }
            }, 0);
            return false;
        }*/

        function beforeEditName(treeId, treeNode) {
            $scope.treeNode = treeNode;
            $scope.treeNode.areaName = treeNode.name;
            $scope.treeNode.oldName = treeNode.name;
            $scope.$broadcast('show#modifyAreaModal');
            return false;
        }
        // function beforeRemove(treeId, treeNode) {
        //     className = (className === "dark" ? "":"dark");
        //     showLog("[ "+getTime()+" beforeRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
        //     var zTree = $.fn.zTree.getZTreeObj("treeDemo3");
        //     zTree.selectNode(treeNode);
        //     return confirm("确认删除 节点 -- " + treeNode.name + " 吗？");
        // }
        function onRemove(e, treeId, treeNode) {
            showLog("[ "+getTime()+" onRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
        }
        function beforeRename(treeId, treeNode, newName, isCancel) {
            className = (className === "dark" ? "":"dark");
            showLog((isCancel ? "<span style='color:red'>":"") + "[ "+getTime()+" beforeRename ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name + (isCancel ? "</span>":""));
            if (newName.length == 0) {
                setTimeout(function() {
                    var zTree = $.fn.zTree.getZTreeObj("treeDemo3");
                    zTree.cancelEditName();
                    alert("节点名称不能为空.");
                }, 0);
                return false;
            }
            return true;
        }
        function onRename(e, treeId, treeNode, isCancel) {
            showLog((isCancel ? "<span style='color:red'>":"") + "[ "+getTime()+" onRename ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name + (isCancel ? "</span>":""));
        }


        // function showRemoveBtn(treeId, treeNode) {
        //     return !treeNode.isFirstNode;
        // }
        // function showRenameBtn(treeId, treeNode) {
        //     return !treeNode.isLastNode;
        // }
        function showLog(str) {
            if (!log) log = $("#log");
            log.append("<li class='"+className+"'>"+str+"</li>");
            if(log.children("li").length > 8) {
                log.get(0).removeChild(log.children("li")[0]);
            }
        }
        function getTime() {
            var now= new Date(),
            h=now.getHours(),
            m=now.getMinutes(),
            s=now.getSeconds(),
            ms=now.getMilliseconds();
            return (h+":"+m+":"+s+ " " +ms);
        }

        /*var newCount = 1;
        function addHoverDom(treeId, treeNode) {
            if(treeNode.level<=2){
                var sObj = $("#" + treeNode.tId + "_span");
            if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
            var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
                + "' title='增加' onfocus='this.blur();'></span>";
            sObj.after(addStr);
            var btn = $("#addBtn_"+treeNode.tId);
            if (btn) btn.bind("click", function(){
                var zTree = $.fn.zTree.getZTreeObj("treeDemo3");
                zTree.addNodes(treeNode, {id:(100 + newCount), pId:treeNode.id, name:"new node" + (newCount++)});
                return false;
            });
            }
        };*/


        function addHoverDom(treeId, treeNode) {                  
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

        function removeHoverDom(treeId, treeNode) {
            $("#addBtn_"+treeNode.tId).unbind().remove();
        };

        // function addDiyDom(treeId, treeNode) {
        //             var aObj = $("#" + treeNode.tId + "_a");
        //             if ($("#diyBtn_"+treeNode.id).length>0) return;
        //             var editStr = "<span id='diyBtn_space_" +treeNode.id+ "' > </span>"
        //                 + "<button type='button' class='diyBtn1' id='diyBtn_" + treeNode.id
        //                 + "' title='"+treeNode.name+"' onfocus='this.blur();'></button>";
        //             aObj.append(editStr);
        //             var btn = $("#diyBtn_"+treeNode.id);
        //             if (btn) btn.bind("click", function(){alert("diy Button for " + treeNode.name);});
        //         };

        function addDiyDom(treeId, treeNode) {
                    var aObj = $("#" + treeNode.tId + "_a");
                    if ($("#diyBtn_"+treeNode.id).length>0) return;
                    var editStr = "<span id='diyBtn_space_" +treeNode.id+ "' style='float:right;border:1px solid #000;width:25px;height:25px;background-color:#000;border-radius:50%;color:#fff;padding:4px 7px;'>9</span>";
                    aObj.append(editStr);
                };

        function selectAll() {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo3");
            zTree.setting.edit.editNameSelectAll =  $("#selectAll").attr("checked");
        }

        $(document).ready(function(){
            $scope.ztreeObj = $.fn.zTree.init($("#treeDemo3"), setting, zNodes);
            $("#selectAll").bind("click", selectAll);
        });   
    }];
});