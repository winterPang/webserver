define(['angularAMD', 'utils', 'sprintf'],
    function (app, utils) {

        var sLang = utils.getLang();
        var URL_TEMPLATE_FILE = sprintf('../wirelessconfig2/views/%s/bindAPGroupDetails.html', sLang);
        // var URL_TEMPLATE_FILE = '../wirelessconfig2/views/cn/bindAPGroupDetails.html';
    
        app.directive('xotherpageofapgroup', ["$http", "$alertService", '$state', '$stateParams', '$window','$timeout', '$rootScope', '$q', 
            function ($http, $alert, $state ,$stateParams ,$window,$timeout, $rootScope, $q){                
                return {
                    templateUrl: URL_TEMPLATE_FILE,
                    restrict: 'E',
                    scope: {
                        sn: '=',
                        stnamevalue: '='
                    },
                    replace: true,
                    controller: function () {
                    },
                    link: function ($scope, $element, $attrs, $ngModel) {
                        
                        //变量值____双向绑定____value监听
                        $scope.$watch('sn',function(sn){
                            initShuJu();
                        });
                        $scope.$watch('stnamevalue',function(stnamevalue){
                            initShuJu();
                        });
                        

                        function initShuJu(){
                            apgroup_initGrid();
                            if($scope.stnamevalue){
                                init_Data();
                            }                            
                        }  


                        //apgroup bsTable 1个初始化
                        function apgroup_initGrid(){
                            //[已绑定APGroup List]    
                            var bsTable="table_bindAPGroupStatus_stList";
                            var tid="tid_bindAPGroupStatus_stList";
                            
                            var columns=[];
                            var stBindAPGroup_Text=$scope.stBindAPGroup_Text.split(',');
                            var stBindAPGroup_Value=["apGroupName","description","modelListNum"];
                            $.each(stBindAPGroup_Text,function(i,item){
                                var eachCol={
                                        title: item,
                                        field: stBindAPGroup_Value[i],
                                        sortable: true,
                                        searcher: {type: "text"},
                                        formatter: function(value,row,index){
                                            // return formatterFun(value,row,index,eachCol.field);
                                            return value;
                                        }
                                    };            
                                columns.push(eachCol);
                            });    
                            
                            init_Grid(bsTable,tid,columns);

                        }


                        //
                        function init_Grid(bsTable,tid,columns){
                         
                            $scope[bsTable] = {
                                //tid
                                tId: tid,
                                sortable:true,           
                                searchable: true,
                                showPageList: true,
                                showCheckBox: true,
                                showRowNumber: false,
                                clickToSelect: true,                
                                //表列_点击事件
                                onClickCell: function (field, value, row) {
                                    // openDialog(field, value, row);            
                                },                 
                                //表列_内容
                                columns: columns
                            };           
                        }


                        //
                        function init_Data(){
                            //url
                            var url="";
                            url="getstbindapgrouplist";

                            //发请求
                            setTimeout(function(){
                                $scope.$broadcast('showLoading#tid_bindAPGroupStatus_stList'); 
                            });
                            $http.get("/v3/ssidmonitor/"+url+"?devSN="+$scope.sn+"&stName="+$scope.stnamevalue).success(function (data, status, header, config) {
                                //数据处理
                                $.each(data.bindApGroupList,function(i,item){
                                    item.modelListNum=item.modelList.length;
                                });
                                $scope.$broadcast('hideLoading#tid_bindAPGroupStatus_stList');
                                $scope.$broadcast('load#tid_bindAPGroupStatus_stList',data.bindApGroupList); 
                                $(window).trigger("resize");                
                                 
                            }).error(function (data, status, header, config) {
                                $alert.msgDialogError($scope.getDataFailed);
                            });          
                        }                        
                    }
                };
            }
        ]);
    }
);
