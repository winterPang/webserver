define(['utils','jquery','jqueryZtree','css!frame/libs/ztree/css/zTreeStyle','css!apsitemng/css/detail','apsitemng/libs/jsAddress'], function (Utils,$) {
    return ['$scope', '$rootScope','$http', '$state','$window','$alertService','$stateParams', '$timeout','$q',function ($scope,$rootScope, $http, $state,$window,$alert,$stateParams,$timeout,$q) {
        // var URL_GET_REGION_LIST = '/v3/ace/oasis/oasis-rest-shop/restshop/regioninfo/regions';
        var URL_GET_ALL_INDUSTRY_NAME = '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/getAllIndustryName';
        var URL_GET_ALL_SCENARIO_LIST = '/v3/ace/oasis/oasis-rest-device/restdevice/scenario/getAllScenario';
        var URL_GET_MODEL_LIST = '/v3/ace/oasis/oasis-rest-device/restdevice/devicemodel/getdevModels/?seceneId=%s&ascending=%s&queryCondition=%s';
        var URL_GET_ISEXIST_SITE_NAME = '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/isExistSameShopWithUser/%s';
        // var URL_GET_SITE_INFO = '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/get/%d';
        var URL_POST_ADD_SITE = '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/addShop';
        var URL_POST_MODIFY_SITE = '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/modifyShop';
        var URL_GET_TREE = '/v3/ace/oasis/oasis-rest-shop/restshop/regioninfo/regions';
        var URL_AP_GROUP = '/v3/cloudapgroup';
        var SiteCommon = {
            URL_GET_SITES_LIST: '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/shops?queryCondition=%s',
            URL_DELETE_SITE: '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/shops/%d',
        //     MANAGE_URL_TEMPLATE: "https://" + location.hostname + "/oasis/stable/web/frame/index.html#/scene15/nasid%d/devsn%s/content%stopName%s/monitor/dashboard15",
        //     MAINTENANCE_URL_TEMPLATE: "https://" + location.hostname + "/oasis/stable/web/frame/index.html#/scene88/nasid%s/devsn%s/content/monitor/dashboard88",
        //     NO_DEVICES_URL: "https://" + location.hostname + "/oasis/stable/web/frame/index.html",
        //     URL_GET_DEV_LIST: '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/shopdevices2/%d',
        //     URL_DELETE_DEV: '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/shopdevices/%s',
        //     URL_POST_MODIFY_DEV_ALIAS: '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/devicealias',
        //     URL_ISEXIST_SAME_DEVSN: '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/deviceSnExisted/%s',
        //     URL_GET_IRFDEVS: '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/getirfdevs?dev_sn=%s',
        //     URL_AP_GROUP: '/v3/cloudapgroup',
        //     URL_GET_DEVICES_STATUS: '/base/getDevs',
        //     URL_POST_ADD_DEV: '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/shopdevices2'
        };
        //场景id,
        var scenarioId,shopId,addOrEdit;
        var treeData=[];
        $scope.form={};
        $scope.addBtnShow=true;
        $scope.cancelBtnShow=false;
        var prov = $('#cmbProvince'),
            city = $('#cmbCitys'),
            area = $('#cmbArea');
        var setting = {
            treeId:"applicationTree",
            data: {
                key : {
                    children:"sub",
                    name:"name",
                    checked: "isChecked"
                }
            },
            view: {
                showIcon: false
            },
            callback:{
                onClick:zTreeOnClick
            },
            async:{
                enable : true
            }
        };
        //支持设备型号模态框option
        $scope.devmodel = {
            mId:'devModel',
            title: getRcString("support-device"),
            cancelText: getRcString("off"),
            showOk: false
        };
        //支持设备型号型号表格
        $scope.deviceOptions={
            tId:'deviceList',
            totalField: 'data.rowCount', //总数field，多级用点，最深是两级  例如  data.total
            sortField: 'orderby', // 查询参数sort
            dataField: 'data.data',
            sortName: 'id',
            sortOrder: 'asc',
            showPageList: false,
            columns: [
                {sortable: true, field: 'dModel', title: getRcString("support")}
            ],
            sidePagination: 'server',
            onLoadSuccess: function () {
                $(window).trigger('resize');
            }
        };
        $scope.treeOption={
            mId:'treeOptionId',
            title:"选择区域",
            autoClose: true ,                        // 点击确定按钮是否关闭弹窗，默认关闭
            showCancel: true  ,                      // 是否显示取消按钮，默认显示
            modalSize:'normal',                      // 可选值 normal,sm,lg  分别对应正常，小型，大型
            showHeader:true ,                    // 显示头部
            showFooter:true ,                        // 显示尾部和按钮
            showClose:true ,
            okText: '确定',                         // 确定按钮文本
            cancelText: '取消',                     // 取消按钮文本
            okHandler: function(modal,$ele){

            },
            cancelHandler: function(modal,$ele){
                //点击取消按钮事件，默认什么都不做，并且关闭模态框
            },
            beforeRender: function($ele){
                //渲染弹窗之前执行的操作,$ele为传入的html片段

                return $ele;
            }
        }
        var shopTableData = getRcString('table-data').split(',');//表格title
        function getRcString(attrName) {
            return Utils.getRcString("add_modify_rc", attrName);
        }
        function zTreeOnClick(event, treeId, treeNode){
            $scope.$apply(function(){
                $scope.form.region=treeNode.id;
                $scope.form.apBranchSelect=treeNode.name;
            });
        }
        function refreshShopTable() {
            $scope.$broadcast('refresh#shopList', {
                url: sprintf(SiteCommon.URL_GET_SITES_LIST, '')
            });
        };
        //场所列表 option
        $scope.options = {
            url: sprintf(SiteCommon.URL_GET_SITES_LIST, ''),
            tId: 'shopList',
            sortField: 'orderby', // 查询参数sort
            sortName: 'shopName',
            sortOrder: 'asc',
            sidePagination: 'server',
            operateWidth: 240,  //   操作列的宽度
            operateTitle: '操作',//   操作列显示的头部
            operate: {
                edit: function (ev, row, btn) {
                    scenarioId=row.scenarioId;
                    shopId=row.id;

                    $scope.$apply(function () {
                        $scope.type = 'update';
                        addOrEdit = 'edit';

                        $scope.form={
                            name:row.shopName,
                            scenario_category_name:row.scenarioId,//场景分类
                            apBranchSelect:row.regionName,//分支名称
                            region:row.regionId,//分支id
                            industry:row.industryId,//所属行业
                            address:row.addrDetail,
                            phone:row.phone,
                            brief:row.shopDesc
                        };
                        $scope.old_site_name=row.shopName;//存储原名称
                        initAddress(function () {
                            prov.val(row.province).trigger('change');
                            city.val(row.city).trigger('change');
                            area.val(row.district);
                        }, Utils.getLang());


                        $scope.siteBox = true;
                        $scope.addBtnShow = false;
                        $scope.cancelBtnShow = true;
                    });
                },
                remove: function(ev,row,btn){
                    $alert.confirm('确认删除该分组么吗？',function(){
                        $http.delete(sprintf(SiteCommon.URL_DELETE_SITE, row.id))
                            .success(function(data){
                                if (data.code) {
                                    $alert.noticeDanger(data.message);
                                } else {
                                    refreshShopTable();
                                    $alert.noticeSuccess('删除' + row.shopName + '成功');
                                }
                            })
                            .error(function(res){
                                $alert.noticeDanger('删除场所失败');
                            });
                    },function(){});
                }
                // ,
                // detail:function(ev,row,btn){
                //
                // }
            },
            tips: {
                edit: '编辑',
                remove: '删除'
                // ,
                // detail:'更多'
            },
            icons: {
                edit:'glyphicon glyphicon-pencil',
                remove: 'glyphicon glyphicon-remove'
                // ,
                // detail:'glyphicon glyphicon-option-horizontal'
            },
            formatNoMatches: function () {
                return "<div>暂无数据，<a id='addSite' style='cursor: pointer'>请添加</a ></div>";
            },
            columns: [
                {sortable: true, field: 'shopName', title: shopTableData[0],},
                {field: 'createdName', showTooltip: true, title: shopTableData[1]},
                {field: 'addrShow', showTooltip: true, title: shopTableData[2]},
                {field: 'shopDesc', showTooltip: true, title: shopTableData[3]},
                {field: 'regionName', showTooltip: true, title: shopTableData[4]},
                {field: 'scenarioName', showTooltip: true, title: shopTableData[5]}
            ],
            queryParams: function (params) {
                params.ascending = params.order === 'asc';
                return params;
            },
            responseHandler:function(data){
                if (data.data) {
                    // serionData=data.data.data[0];
                    // $scope.$apply(function(){
                    //     // $scope.form.scenario_category_name=serionData.scenarioId;
                    //     // $scope.form.industry=serionData.industryId;
                    // });
                    return {
                        total: data.data.rowCount,
                        rows:data.data.data
                    };
                } else {
                    return {
                        total: 0,
                        rows: []
                    };
                }
            }
        };
        //为请添加添加添加事件
        $timeout(function(){
            $('#addSite').click(function(){

                $scope.$apply(function(){
                    $scope.siteAddForm.$setPristine();
                    $scope.siteAddForm.$setUntouched();
                    $scope.form={};
                    $scope.type='add';
                    addOrEdit='add';
                    $scope.siteBox=true;
                    $scope.addBtnShow=false;
                    $scope.cancelBtnShow=true;
                });
            });
        })
        //增加
        $scope.addApBranch=function(){
            $scope.siteAddForm.$setPristine();
            $scope.siteAddForm.$setUntouched();
            $scope.form={};

            $scope.type='add';
            addOrEdit='add';
            $scope.siteBox=true;
            $scope.addBtnShow=false;
            $scope.cancelBtnShow=true;

        };
        //取消
        $scope.cancel=function(){
            $scope.addBtnShow=true;
            $scope.cancelBtnShow=false;

            // $scope.form.name='';
            // $scope.form.apBranchSelect='';
            $scope.siteBox=false;
        }
        // 批量增加设备
        $scope.batchAddSite = function () {
            $('#file').trigger('click');
        };
        $('#file').on('change', function (e) {
            var filepath = $('#file').val();
            var extStart = filepath.lastIndexOf(".");
            var ext = filepath.substring(extStart, filepath.length).toUpperCase();
            if (ext != ".TXT" && ext != ".XLS" && ext != ".XLSX") {
                $alert.noticeDanger(getRcString('file-format'));
            }
            else {
                $http({
                    url: "/v3/ace/oasis/oasis-rest-shop/restshop/fileupload/shopfileupload",
                    method: 'POST',
                    headers: {
                        'Content-Type': undefined
                    },
                    transformRequest: function () {
                        var formData = new FormData();
                        formData.append('file', $('#file')[0].files[0]);
                        return formData;
                    }
                }).success(function (data) {
                    if (data.code == 0) {
                        $alert.noticeSuccess(data.message);
                        $state.go("global.setup.site_new_log");
                    } else {
                        $alert.noticeDanger(data.message);
                    }
                });
            }

        });
        //完成
        $scope.onSubmit=function(){
            // var $btn = $('button[type=submit]');
            // $btn.attr('disabled', 'disabled');
            // var timer = setTimeout(function () {
            //     $btn.attr('disabled', false);
            // }, 2000);
            var sucOrFail;

            if(addOrEdit == "add"){
                var add_data = {
                    "shopName": $scope.form.name,
                    "shopDesc": $scope.form.brief,
                    "phone": $scope.form.phone,
                    "scenarioId": $scope.form.scenario_category_name,
                    "regionId": $scope.form.region,
                    "industryId": $scope.form.industry,
                    "province": prov.val() || '-',
                    "city": city.val() || '-',
                    "district": area.val() || '-',
                    "addrDetail": $scope.form.address
                };
                $http.post(sprintf(URL_POST_ADD_SITE), JSON.stringify(add_data), {headers: {"Content-Type": "application/json;charset=UTF-8"}}).success(function (data) {
                    if (data.code == 0) {
                        $scope.addBtnShow=true;
                        $scope.cancelBtnShow=false;
                        $scope.siteBox=false;
                        $alert.noticeSuccess(getRcString("add-success"));
                        refreshShopTable();
                    } else {
                        $alert.noticeDanger(data.message);
                    }
                }).error(function (msg) {
                    $alert.noticeDanger(msg || getRcString("error"));
                });

            }else{
                $scope.modifyrow = {
                    "id": shopId,
                    "shopName": $scope.form.name,
                    "shopDesc": $scope.form.brief,
                    "phone": $scope.form.phone,
                    "regionId": $scope.form.region,
                    "industryId": $scope.form.industry,
                    "scenarioId": $scope.form.scenario_category_name,
                    "addrDetail": $scope.form.address,
                    "city": city.val() || '-',
                    "district": area.val() || '-',
                    "province": prov.val() || '-'
                };
                $http.post(URL_POST_MODIFY_SITE, JSON.stringify($scope.modifyrow)).success(function (data) {
                    if (data.code == 0) {
                        $alert.noticeSuccess(getRcString("modify-success"));
                        $scope.addBtnShow=true;
                        $scope.cancelBtnShow=false;
                        $scope.siteBox=false;
                        refreshShopTable();
                    } else {
                        $alert.noticeDanger(data.message);
                    }
                }).error(function (msg) {
                    $alert.noticeDanger(msg || getRcString("error"));
                });
            }
            // $scope.form.name='';
            // $scope.form.apBranchSelect='';
        };
        //检验场所名
        $scope.validName = {
            url: sprintf(URL_GET_ISEXIST_SITE_NAME, '{value}'),
            method: 'get',// 请求方式
            live: false,
            validFn: function (resp) {
                if (resp.code == 0) {
                    return true;
                } else if ($scope.type == 'update' && $scope.old_site_name == $scope.form.name) {
                    return true;
                } else {
                    return resp.code;
                }
            }
        };
        //init industry
        $http.get(URL_GET_ALL_INDUSTRY_NAME).success(function (data) {
            // {"code":0,"message":"查询成功","data":[{"id":4,"industryName":"default"},{"id":7,"industryName":"餐饮"}]}
            $scope.industries = data.data;
        }).error(function (msg) {
            $alert.noticeDanger(msg || getRcString("error"));
        });
        //支持设备型号点击事件
        $scope.showdevmodel = function () {
            $scope.$broadcast('refresh#deviceList', {
                url: sprintf(URL_GET_MODEL_LIST, $scope.form.scenario_category_name, true, '')
            });
            $scope.$broadcast('show#devModel');
        };
        //选择分支
        $scope.apBranchSelect=function(){
            $scope.$broadcast('show#treeOptionId');
        };
        $('#treeOptionId').on('shown.bs.modal', function () {
            var zTreeObj = $.fn.zTree.init($("#apSiteTree"), setting, treeData);
            var nodes = zTreeObj.getNodes();
            for (var i = 0; i < nodes.length; i++) {
                zTreeObj.expandNode(nodes[i], true, true, true);
            }

        });
        //get scenarios list and init
        $http.get(URL_GET_ALL_SCENARIO_LIST).success(function (data) {
            $scope.scens = data.data.data;
            $.map($scope.scens, function (v) {
                v.namedesc = v.name + '(' + v.desc + ')';
            });
        }).error(function (msg) {
            $alert.noticeDanger(msg || getRcString("error"));
        });
        //
        initAddress(function (p) {
            prov.val(p).trigger('change');
            city.trigger('change');
        }, Utils.getLang());
        //获取分支
        $http.get(URL_GET_TREE).success(function (data) {
            if(data.code==0){
                treeData=data.data;
            }else{
                treeData = [];
            }

        }).error(function(res){
            console.log(res);
        });
    }];
});