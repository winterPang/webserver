/**
 * Created by Administrator on 2016/11/2.
 */
define(["jqueryZtree","css!frame/libs/ztree/css/zTreeStyle","css!demo/css/app"], function () {
        return ['$scope', '$http', '$state', function ($scope, $http, $state) {
            $scope.vm = {
                activeTab:1
            };
            var setting = {
                view: {
                    addHoverDom: addHoverDom,
                    removeHoverDom: removeHoverDom
                },
                edit: {
                    enable: true,
                    editNameSelectAll: true,
                    showRemoveBtn: true,
                    showRenameBtn: true
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                // callback: {
                //     beforeDrag: beforeDrag,
                //     beforeEditName: beforeEditName,
                //     beforeRemove: beforeRemove,
                //     beforeRename: beforeRename,
                //     onRemove: onRemove,
                //     onRename: onRename
                // }
            };
            var zNodes =[
                { id:1, pId:0, name:"北京",open:true},
                { id:11, pId:1, name:"昌平区"},
                { id:12, pId:1, name:"朝阳区"},
                { id:13, pId:1, name:"东城区"},
                { id:14, pId:13, name:"东城区"},
                { id:2, pId:0, name:"上海"},
                { id:21, pId:2, name:"闵行"},
                { id:22, pId:2, name:"闵行"},
                { id:23, pId:2, name:"闵行"},
                { id:3, pId:0, name:"广州"},
                { id:31, pId:3, name:"闵行"},
                { id:32, pId:3, name:"闵行"},
                { id:33, pId:3, name:"闵行"}
            ];
            function addHoverDom(treeId, treeNode) {
                var sObj = $("#" + treeNode.tId + "_span");
                if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
                var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
                    + "' title='add node' onfocus='this.blur();'></span>";
                sObj.after(addStr);
            }
            function removeHoverDom(treeId, treeNode) {
                $("#addBtn_"+treeNode.tId).unbind().remove();
            }
            function selectAll() {
                var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                zTree.setting.edit.editNameSelectAll =  $("#selectAll").attr("checked");
            }

            $(document).ready(function(){
                $.fn.zTree.init($("#treeDemo"), setting, zNodes);
            });
        }];
    }
);