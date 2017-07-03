/**
 * Created by Administrator on 2017/5/10.
 */
define(['utils', 'jquery', 'jqueryZtree', 'css!frame/libs/ztree/css/zTreeStyle', 'css!apBranchMng/css/detail'], function (Utils, $) {
    return ['$scope', '$rootScope', '$http', '$state', '$window', '$alertService', '$stateParams', '$timeout',function ($scope, $rootScope, $http, $state, $window, $alert, $stateParams,$timeout) {
       var deviceInSlctList=[],deviceOutSlctList=[];//选择的移出移入的设备列表
        var data = {
            message: [
                {
                    name: '龙冠实验局', sub: [
                    {
                        name: '龙冠和谐大厦', type: 'nas', sub: [
                        {name: '绿洲分组'},
                        {name: '路由器分组'},
                        {name: '无线分组'},
                        {name: '资料部分组'}
                    ]
                    },
                    {
                        name: '东电实验局', type: 'nas', sub: [
                        {name: '交换机分组'},
                        {name: '分组'},
                        {name: '无线分组'},
                        {name: '资料部分组'}
                    ]
                    }
                ]
                }
            ], retCode: 0
        };
        $scope.deviceInList= [
            {name: '设备1', type: 'AC+fitAp', deviceType:'WX5540E',devSN: '2011234546567761', status: '在线'},
            {name: '设备2', type: 'fat-ap', deviceType:'WX5540E',devSN: '2011234546567762', status: '在线'},
            {name: '设备3', type: '无线控制器',deviceType:'WX5540E', devSN: '2011234546567763', status: '离线'},
            {name: '设备5', type: 'AC+fitAp',deviceType:'WX5540E', devSN: '2011234546567764', status: '在线'}
        ];
        $scope.deviceOutList= [
            {name: '设备1', type: 'AC+fitAp', deviceType:'WX5540E',devSN: '2011234546567765', status: '在线'},
            {name: '设备2', type: 'fat-ap',deviceType:'WX5540E', devSN: '2011234546567766', status: '在线'},
            {name: '设备3', type: '交换机',deviceType:'WX5540E', devSN: '2011234546567767', status: '离线'},
            {name: '设备5', type: '路由器', deviceType:'WX5540E',devSN: '2011234546567768', status: '在线'}
        ];
        var setting = {
            treeId: "applicationTree",
            data: {
                key: {
                    children: "sub",
                    name: "name",
                    checked: "isChecked"
                }
            },
            view: {
                showIcon: false
            },
            callback: {
                onClick: zTreeOnClick
            },
            async: {
                enable: true
            }
        };
        $scope.form={};
        $scope.apBranch={};
        //移出移入按钮状态
        $scope.outBtnStatus=true;$scope.inBtnStatus=true;
        //显示场所ztree的模态框
        $scope.treeOption = {
            mId: 'treeOptionId',
            title: "选择场所",
            autoClose: true,                        // 点击确定按钮是否关闭弹窗，默认关闭
            showCancel: true,                      // 是否显示取消按钮，默认显示
            modalSize: 'normal',                      // 可选值 normal,sm,lg  分别对应正常，小型，大型
            showHeader: true,                    // 显示头部
            showFooter: true,                        // 显示尾部和按钮
            showClose: true,
            okText: '确定',                         // 确定按钮文本
            cancelText: '取消',                     // 取消按钮文本
            okHandler: function (modal, $ele) {

            },
            cancelHandler: function (modal, $ele) {
                //点击取消按钮事件，默认什么都不做，并且关闭模态框
            },
            beforeRender: function ($ele) {
                //渲染弹窗之前执行的操作,$ele为传入的html片段

                return $ele;
            }
        }
        var apbranchList=[
            {name: '分组1', site: '龙冠', type: 'AC+fitAp', device: '6台', date: '2017/1/2'},
            {name: '分组2', site: '龙冠', type: 'fat-ap', device: '10台', date: '2017/1/2'},
            {name: '分组3', site: '龙冠', type: 'fat-ap', device: '1台', date: '2017/1/2'},
            {name: '分组4', site: '龙冠', type: 'AC+fitAp', device: '4台', date: '2017/1/2'},
            {name: '分组5', site: '龙冠', type: 'AC+fitAp', device: '30台', date: '2017/1/2'}
        ];
        //刚进来展示的表格数据
        $scope.options = {
            // url:"",
            tId: 'base',
            showRowNumber: true,
            search: true,
            data: [],
            columns: [
                {title: '名称', field: 'name'},
                {title: '场所', field: 'site'},
                {title: '类型', field: 'type'},
                {title: '设备（台）', field: 'device'},
                {title: '创建日期', field: 'date'}
            ],
            operateWidth: 240,  //   操作列的宽度
            operateTitle: '操作',//   操作列显示的头部
            formatNoMatches: function () {
                return "<div>暂无数据，<a id='addBranch' style='cursor: pointer'>请添加</a ></div>";
            },
            operate: {
                edit: function (ev, row, btn) {
                    $scope.$apply(function () {
                        $scope.form.nasType=row.type;
                        $scope.form.apBranchSelect=row.site;
                        $scope.apBranch.name=row.name;
                        $scope.apboxShow = true;

                        $scope.form.form = 1;
                        $scope.isForm = true;


                        $scope.apReadType=true;
                        $scope.deleteBtnShow=true;
                        $scope.addBtnShow=false;
                    });
                },
                remove: function (ev, row, btn) {
                    $alert.confirm('确认删除该分组么吗？', function () {
                        $alert.msgDialogSuccess('删除分组成功');
                    }, function () {
                    })
                }
            },
            tips: {
                edit: '编辑',
                remove: '删除'
            },
            icons: {  //   操作列的图标按钮，现在是随意写的  后期谈论和 @yancaihong 定一个样式，框架统一加，不太建议开发者修改样式，除非必要
                edit: 'glyphicon glyphicon-pencil',
                remove: 'glyphicon glyphicon-remove'
            }
        };
        $scope.deviceOption = {
            mId: 'deviceOptionId',
            title: "该组设备",
            autoClose: true,                        // 点击确定按钮是否关闭弹窗，默认关闭
            showCancel: true,                      // 是否显示取消按钮，默认显示
            modalSize: 'normal',                      // 可选值 normal,sm,lg  分别对应正常，小型，大型
            showHeader: true,                    // 显示头部
            showFooter: false,                        // 显示尾部和按钮
            showClose: true,
            okText: '确定',                         // 确定按钮文本
            cancelText: '取消',                     // 取消按钮文本
            okHandler: function (modal, $ele) {

            },
            cancelHandler: function (modal, $ele) {
                //点击取消按钮事件，默认什么都不做，并且关闭模态框
            },
            beforeRender: function ($ele) {
                //渲染弹窗之前执行的操作,$ele为传入的html片段

                return $ele;
            }
        }
        $scope.deviceTbOp = {
            tId: 'device',
            showRowNumber: false,
            showCheckBox: false,
            search: false,
            data: [
                {name: '设备1', type: 'AC+FitAP', devSN: '201123454656776', status: '在线'},
                {name: '设备2', type: 'fat-ap', devSN: '201123454656776', status: '在线'},
                {name: '设备3', type: 'AC+FitAP', devSN: '201123454656776', status: '离线'},
                {name: '设备5', type: 'AC+FitAP', devSN: '201123454656776', status: '在线'}
            ],
            columns: [
                {title: 'AP名称', field: 'name'},
                {title: 'AP型号', field: 'type'},
                {title: 'AP序列号', field: 'devSN'},
                {title: '设备状态', field: 'status'}
            ]
        }
        $scope.$on('click-cell.bs.table#base', function (field, value, row, $element) {
            if (value == 'device') {
                $scope.$broadcast('show#deviceOptionId');
            }
        })

        //删除增加按钮
        $scope.addBtnShow=true;$scope.deleteBtnShow=false;
        //ztree的onclick事件
        function zTreeOnClick(event, treeId, treeNode) {
            $scope.$apply(function () {
                $scope.btnStatus = false;
                $scope.form.apBranchSelect = treeNode.name;
            });
        }
        //请添加的绑定添加事件
        $timeout(function(){
            $('#addBranch').click(function(){
                $scope.$apply(function(){
                    $scope.isForm = true;
                    $scope.apboxShow = true;
                    $scope.form.form = 1;

                    $scope.addBtnShow=false;
                    $scope.deleteBtnShow=true;
                });
            });
        })
        //增加按钮的事件
        $scope.addApBranch=function(){
            $scope.isForm = true;
            $scope.apboxShow = true;
            $scope.form.form = 1;

            $scope.addBtnShow=false;
            $scope.deleteBtnShow=true;
        }
        //取消按钮的事件
        $scope.cancle = function () {
            $scope.apboxShow = false;
            $scope.form.form = 1;

            $scope.deleteBtnShow=false;
            $scope.addBtnShow=true;
            $scope.apReadType=false;
        }
        //点击场所输入框的事件
        $scope.apBranchSelect = function () {
            $scope.$broadcast('show#treeOptionId');
        }
        $('#treeOptionId').on('shown.bs.modal', function () {
            var zTreeObj = $.fn.zTree.init($("#apbranchTree"), setting, data.message);
            var nodes = zTreeObj.getNodes();
            for (var i = 0; i < nodes.length; i++) {
                zTreeObj.expandNode(nodes[i], true, true, true);
            }
        })

        //下一步的事件
        $scope.nextFn = function () {
            $scope.$broadcast('load#base',apbranchList);
            $scope.isForm = false;
            $scope.form.form = 2;
        }
        //上一步
        $scope.lastFn = function () {
            $scope.isForm = true;
            $scope.form.form = 1;
        }
        //完成
        $scope.complete = function () {
            $scope.apboxShow = false;
            $scope.form.showForm = 1;
            
            $scope.deleteBtnShow=false;
            $scope.addBtnShow=true;
        }
        //对分组外的设备进行选择
        $scope.checkOutFn=function($event){
            deviceOutSlctList=$.grep($scope.deviceOutList,function (item) {
                return item.check===true;
            });
            $scope.checkedAllOut = deviceOutSlctList.length === $scope.deviceOutList.length;
            $scope.inBtnStatus=deviceOutSlctList.length>0?false:true;
        };
        $scope.checkedAllOutEvent=function($event){
            $.each($scope.deviceOutList,function (i,item) {
                item.check = $scope.checkedAllOut;
            })
            $scope.inBtnStatus=!$scope.checkedAllOut;
            if($scope.checkedAllOut){
                deviceOutSlctList=$scope.deviceOutList;
            }else{
                deviceOutSlctList=[];
            }
        }

        //对分组内的设备进行选择
        $scope.checkInFn=function($event){
            deviceInSlctList=$.grep($scope.deviceInList,function (item) {
                return item.check===true;
            });
            $scope.checkedAllIn = deviceInSlctList.length === $scope.deviceInList.length;
            $scope.outBtnStatus=deviceInSlctList.length>0?false:true;
        };
        $scope.checkedAllInEvent=function($event){
            $.each($scope.deviceInList,function (i,item) {
                item.check = $scope.checkedAllIn;
            })
            $scope.outBtnStatus=!$scope.checkedAllIn;
            if($scope.checkedAllIn){
                deviceInSlctList=$scope.deviceInList;
            }else{
                deviceInSlctList=[];
            }
            console.log(deviceInSlctList);
        }
        //移出事件
        $scope.deviceOutEvt=function(){
            var k=0;
            var dataList=[].concat($scope.deviceInList);
                angular.forEach($scope.deviceInList,function(data,i,arr){
                    if(data.check){
                        data.check=false;
                        $scope.deviceOutList.push(data);
                        if(i==0){
                            k=0;
                        }
                        dataList.splice(i-k,1);
                        console.info(dataList)
                        k++;
                    }
                })
            $scope.deviceInList=dataList;
            $scope.outBtnStatus=true;
        }

        //移入事件
        $scope.deviceInEvt=function(){var j=0;
            var dataList=[].concat($scope.deviceOutList);
                angular.forEach($scope.deviceOutList,function(data,i,arr){
                    if(data.check){
                        data.check=false;
                        $scope.deviceInList.push(data);
                        if(i==0){
                            j=0;
                        }
                        dataList.splice(i-j,1);
                        console.info(dataList)
                        j++;
                    }
                })
            $scope.deviceOutList=dataList;
            $scope.inBtnStatus=true;
        }
        $scope.$watch('deviceInList',function(){
            if(!$scope.deviceInList.length){
                $scope.checkedAllIn=false;
            }
        })
        $scope.$watch('deviceOutList',function(){
            if(!$scope.deviceOutList.length){
                $scope.checkedAllOut=false;
            }
        })
    }]
})