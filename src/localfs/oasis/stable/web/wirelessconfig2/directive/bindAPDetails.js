define(['angularAMD', 'utils', 'sprintf'],
    function (app, utils) {

        var sLang = utils.getLang();
        var URL_TEMPLATE_FILE = sprintf('../wirelessconfig2/views/%s/bindAPDetails.html', sLang);
    
        app.directive('xotherpageofap', ["$http", "$alertService", '$state', '$stateParams', '$window','$timeout', '$rootScope', '$q', 
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
                            ap_initGrid();
                            if($scope.stnamevalue){
                                init_Data();
                            }                            
                        } 


                        //ap bsTable 1个初始化
                        function ap_initGrid(){
                            //[已绑定APGroup List]    
                            var bsTable="table_bindAPStatus_stList";
                            var tid="tid_bindAPStatus_stList";
                            
                            var columns=[];
                            var stBindAP_Text=$scope.stBindAP_Text.split(',');
                            var stBindAP_Value=["apName","apSN","apModel","radioNum","apGroupName"];
                            $.each(stBindAP_Text,function(i,item){
                                var eachCol={
                                        title: item,
                                        field: stBindAP_Value[i],
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
                            url="getstbindaplist";

                            //发请求   
                            setTimeout(function(){
                                $scope.$broadcast('showLoading#tid_bindAPStatus_stList');
                            });
                            $http.get("/v3/ssidmonitor/"+url+"?devSN="+$scope.sn+"&stName="+$scope.stnamevalue)
                            .success(function (data, status, header, config) {
                                $scope.$broadcast('hideLoading#tid_bindAPStatus_stList');
                                $scope.$broadcast('load#tid_bindAPStatus_stList',data.bindApList);    
                                $(window).trigger("resize");        
                            })
                            .error(function (data, status, header, config) {
                                $alert.msgDialogError($scope.getDataFailed);
                            });          
                        }
                     
                    }
                };
            }
        ]);
    }
);
