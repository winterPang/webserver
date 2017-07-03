/**
 * controller home
 */
define(['jquery', 'async', 'echarts3','jqueryZtree', 'bootstrapValidator', 'css!demohome/css/tree1', 'css!frame/libs/ztree/css/zTreeStyle', 'sprintf', 'home/libs/jsAddress', 'demohome/directive/home_site'], function ($, async, echarts, jqueryZtree) {

    return ['$scope', '$rootScope','$state','$http', '$q', '$alertService', function ($scope,$rootScope, $state,$http, $q, $alert) {

        var setting = {
            view: {
                addHoverDom: addHoverDom,
                removeHoverDom: removeHoverDom,
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
        function beforeEditName(treeId, treeNode) {
            className = (className === "dark" ? "":"dark");
            showLog("[ "+getTime()+" beforeEditName ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
            var zTree = $.fn.zTree.getZTreeObj("treeDemo1");
            zTree.selectNode(treeNode);
            setTimeout(function() {
                if (confirm("进入节点 -- " + treeNode.name + " 的编辑状态吗？")) {
                    setTimeout(function() {
                        zTree.editName(treeNode);
                    }, 0);
                }
            }, 0);
            return false;
        }
        function beforeRemove(treeId, treeNode) {
            className = (className === "dark" ? "":"dark");
            showLog("[ "+getTime()+" beforeRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
            var zTree = $.fn.zTree.getZTreeObj("treeDemo1");
            zTree.selectNode(treeNode);
            return confirm("确认删除 节点 -- " + treeNode.name + " 吗？");
        }
        function onRemove(e, treeId, treeNode) {
            showLog("[ "+getTime()+" onRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
        }
        function beforeRename(treeId, treeNode, newName, isCancel) {
            className = (className === "dark" ? "":"dark");
            showLog((isCancel ? "<span style='color:red'>":"") + "[ "+getTime()+" beforeRename ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name + (isCancel ? "</span>":""));
            if (newName.length == 0) {
                setTimeout(function() {
                    var zTree = $.fn.zTree.getZTreeObj("treeDemo1");
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

        var newCount = 1;
        function addHoverDom(treeId, treeNode) {
            if(treeNode.level<=2){
                var sObj = $("#" + treeNode.tId + "_span");
            if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
            var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
                + "' title='增加' onfocus='this.blur();'></span>";
            sObj.after(addStr);
            var btn = $("#addBtn_"+treeNode.tId);
            if (btn) btn.bind("click", function(){
                var zTree = $.fn.zTree.getZTreeObj("treeDemo1");
                zTree.addNodes(treeNode, {id:(100 + newCount), pId:treeNode.id, name:"new node" + (newCount++)});
                return false;
            });
            }
        };
        function removeHoverDom(treeId, treeNode) {
            $("#addBtn_"+treeNode.tId).unbind().remove();
        };
        function selectAll() {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo1");
            zTree.setting.edit.editNameSelectAll =  $("#selectAll").attr("checked");
        }
        
        $(document).ready(function(){
            $.fn.zTree.init($("#treeDemo1"), setting, zNodes);
            $("#selectAll").bind("click", selectAll);
        });
    }];
});