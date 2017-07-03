/**
 * controller home
 */
define(['angularAMD','jquery', 'async', 'echarts3','jqueryZtree', 'bootstrapValidator', 'css!demohome/css/home.css', 'css!frame/libs/ztree/css/zTreeStyle', 'sprintf', 'home/libs/jsAddress', 'demohome/directive/home_site','demohome/directive/radialIndicator','demohome/directive/angular.radialIndicator', 'css!demohome/css/tree1', 'css!frame/libs/ztree/css/zTreeStyle'],function (app,$, async, echarts, jqueryZtree) {
    return ['$scope', '$rootScope','$state','$http', '$q', '$alertService',function ($scope,$rootScope, $state,$http, $q, $alert) {
    //  =========================新增区域开始============================== 
        var g_data=[];

        $scope.addModal = function () {
            $scope.$broadcast('show#modal1');
        };

        $scope.paogramming=function(){
            $state.go('^.programming');
        }

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

            $scope.bindDeviceTable={
                tId:'bindDevice',
                striped:false,
                pagniation:true,
                clickToSelect: true,
                searchable: false, 
                columns:[                
                    {sortable:true,align:'center',field:'numInfo',title:"序列号/MAC地址"},
                    {sortable:true,align:'center',field:'oName',title:"设备别名"},                                     
                    {sortable:true,align:'center',field:'addTo',title:"场所"},                                     
                ],  
                data:g_data,           
            };

            $scope.modal1 = {
                option: {
                    mId: 'modal1',
                    autoClose: false,
                    showHeader: false,
                    showFooter: false,
                    beforeRender: function ($ele) {
                        initAddress(function (p) {
                            $scope.$apply(function () {
                                $scope.row.province = p;
                            });
                            $('#cmbProvince').val(p).trigger('change');
                            $('#cmbCitys').trigger('change');
                        });

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

            $scope.$on('hidden.bs.modal#addAreaModal', function () {
                $scope.treeNode.areaName="";
                formAddArea.name_area.$dirty=false;                
            });

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
    //  =========================新增区域开始==============================  


    //  =========================列表区域开始==============================  
        $scope.sitesBegin=[
            {des:'默认网络',
            id: 'v.shopId',
            name: '我的网络1',
            url: 'v.menuUrl',
            online: '2-',
            offline: '-2',
            score: 30,
            up: '3.2',
            down: '0.5',
            clientnum: '20',
            
            }, 
            {des:'备用网络',
            id: 'v.shopId',
            name: '我的网络2',
            url: 'v.menuUrl',
            online: '2-',
            offline: '-2',
            score: '85',
            up: '3.2',
            down: '0.5',
            clientnum: '307'
            }, {des:'宿舍网络',
            id: 'v.shopId',
            name: '我的网络3',
            url: 'v.menuUrl',
            online: '2-',
            offline: '-2',
            score: 25,
            up: '3.2',
            down: '0.5',
            clientnum: '21'
            }, {
            id: 'v.shopId',
            name: '断线',
            url: 'v.menuUrl',
            online: '-',
            offline: '-',
            score: 'N/A',
            up: '-',
            down: '-',
            clientnum: '-'
            },
            {des:'默认网络',
            id: 'v.shopId',
            name: '我的网络1',
            url: 'v.menuUrl',
            online: '2-',
            offline: '-2',
            score: 30,
            up: '3.2',
            down: '0.5',
            clientnum: '23'
            }, 
            {des:'默认网络',
            id: 'v.shopId',
            name: '我的网络1',
            url: 'v.menuUrl',
            online: '2-',
            offline: '-2',
            score: 30,
            up: '3.2',
            down: '0.5',
            clientnum: '78'
            },
            {des:'默认网络',
            id: 'v.shopId',
            name: '我的网络1',
            url: 'v.menuUrl',
            online: '2-',
            offline: '-2',
            score: 30,
            up: '3.2',
            down: '0.5',
            clientnum: '20'
            }, 
            {des:'默认网络',
            id: 'v.shopId',
            name: '我的网络2',
            url: 'v.menuUrl',
            online: '2-',
            offline: '-2',
            score: '85',
            up: '3.2',
            down: '0.5',
            clientnum: '20'
            }, {des:'默认网络',
            id: 'v.shopId',
            name: '我的网络3',
            url: 'v.menuUrl',
            online: '2-',
            offline: '-2',
            score: 25,
            up: '3.2',
            down: '0.5',
            clientnum: '20'
            }, 
        ];
        
        $scope.options={
            tId: 'options',  
            data: [ 
                {name:'我的网络1',online: '50',up:'20 Mbps',down:'0.4 Mbps',score:'30'}, 
                {name:'我的网络2',online: '330',up:'2.8 Mbps',down:'0.9 Mbps',score:'56'}, 
                {name:'我的网络3',online: '224',up:'8.9 Mbps',down:'2.1 Mbps',score:'24'}, 
                {name:'我的网络4',online: '14',up:'9.3 Mbps',down:'4.4 Mbps',score:'89'}, 
            ], 
            columns: [ 
                {title:'网络名称',field:'name'},
                {title: '在线终端', field: 'online'} ,
                {title: '上行速率', field: 'up'} ,
                {title: '下载速率', field: 'down'} ,
                {title: '得分', field: 'score'} ,
            ] ,
            operate:{  
                detail:function(e,row,$btn){

                },
                bind: function(e,row,$btn){
                    
                }, 
                edit:  function(e,row,$btn){
                    
                },                                                                                 
                remove:function(e,row,$btn){
                              
               },  
                                                                                                       
            }, 
            tips:{ 
                detail: '运维',
                bind:'授权',                       
                edit: '规划', 
                remove: '删除'
                                                           
            }, 
            icons: {   
                detail:'fa fa-info-circle', 
                bind:'fa fa-link',                                                                                                   
                edit:'fa fa-pencil-square-o',  
                remove:'fa fa-trash'                                        
            },       

        };
        $scope.delBtn=function(){
            $alert.confirm("确定删除吗？", function () {
            });
        }
         
        $scope.addToggleo=function () {
            $scope.hoverClasso="hover";
        }
        $scope.deleteToggleo=function(){
            $scope.hoverClasso="";
        }
        $scope.addTogglet=function () {
            $scope.hoverClasst="hover";
        }
        $scope.deleteTogglet=function(){
            $scope.hoverClasst="";
        }
        $scope.addToggleth=function () {
            $scope.hoverClassth="hover";
        }
        $scope.deleteToggleth=function(){
            $scope.hoverClassth="";
        }
        $scope.indicatorOption = {
                radius : 40,
                percentage :true,
                barColor : "#61DABB",
                barWidth: 3,
                initValue : 70,
                barBgColor:"#1D2A3A",
                roundCorner:true
        };
        $scope.page = 1,
        $scope.pageSize = 4,
        $scope.pagination = {
            first: '首页',
            prev: '上一页',
            next: '下一页',
            last: '末页',
            totalPages: Math.ceil(($scope.sitesBegin.length)/($scope.pageSize)),
            paginationClass: 'pagination',
            onPageClick: function (e, page) {
                
                console.log('new_page:' + page);
                },
            onChange: function (page) {
                
                console.log('new_page:' + page);
            }
            };
           
        $scope.$watch('pageSize',function(e,val){
            
            $scope.pagination.totalPages  = Math.ceil(($scope.sitesBegin.length)/(e));
            //console.log($scope.pageSize);
            //$scope.sites=$scope.sitesBegin
            $scope.updata($scope.page,$scope.pageSize);
            
        });
        $scope.$watch('page',function(){
            $scope.updata($scope.page,$scope.pageSize);
        });
        $scope.updata=function(npage,npageSize){
            var start=(npage-1)*npageSize;
            var end=(($scope.sitesBegin.length-start)<npageSize)?($scope.sitesBegin.length-1):(start+npageSize-1);
            $scope.sites =  $scope.sitesBegin.slice(start,end+1);
        }
        $scope.updata($scope.page,$scope.pageSize);

        /*$scope.updata=function(npage,npageSize){
             
                  $scope.sites=[];
                 // for (var i =$scope.pageSize>$scope.sitesBegin.length?($scope.sitesBegin.length-1):($scope.pageSize-1); i >= 0; i--) {
                 //     $scope.sites[i]=$scope.sitesBegin[i];
                 // }
            // if($scope.sitesBegin.length-npageSize*(npage-1)>0){
            //     if((($scope.sitesBegin.length-(npage-1)*npageSize)>0)&&(($scope.sitesBegin.length-(npage-1)*npageSize)<npageSize)){
            //         for (var i =npageSize*npage-1; i >= npageSize*(npage-1); i--) {
            //          $scope.sites[i]=$scope.sitesBegin[i];
            //         }
            //     }else{
            //         for (var i =$scope.sitesBegin.length; i >= npageSize*(npage-1); i--) {
            //          $scope.sites[i]=$scope.sitesBegin[i];
            //         }
            //     }
            // } 
            
        };*/
    //  =========================列表区域结束==============================  
    

    //  =========================Ztree区域开始==============================  
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
        //     var zTree = $.fn.zTree.getZTreeObj("treeDemo1");
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
                var zTree = $.fn.zTree.getZTreeObj("treeDemo1");
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
        function selectAll() {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo1");
            zTree.setting.edit.editNameSelectAll =  $("#selectAll").attr("checked");
        }

        $scope.$on("show#modal2",function(){
            $scope.ztreeObj = $.fn.zTree.init($("#treeDemo1"), setting, zNodes);
            $("#selectAll").bind("click", selectAll); 
        })      
    //  =========================Ztree区域结束==============================  
           
    }];
});