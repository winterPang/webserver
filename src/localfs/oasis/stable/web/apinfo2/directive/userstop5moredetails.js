define(['angularAMD', 'utils', 'sprintf'],
    function (app, utils) {

        var sLang = utils.getLang();
        var URL_TEMPLATE_FILE = sprintf('../apinfo2/views/%s/userstop5moredetails.html', sLang);
    
        app.directive('top5moredirect2', ["$http", "$alertService", '$state', '$stateParams', '$window','$timeout', '$rootScope', '$q', 
            function ($http, $alert, $state ,$stateParams ,$window,$timeout, $rootScope, $q){
                return {
                    templateUrl: URL_TEMPLATE_FILE,
                    restrict: 'E',
                    scope: {
                        rowsvalue2: '='
                    },
                    replace: true,
                    controller: function () {
                    },
                    link: function ($scope, $element, $attrs, $ngModel) {
                        

                        //变量值____双向绑定____value监听
                        $scope.$watch('rowsvalue2',function(rowsvalue2){
                            //                             
                            if(rowsvalue2.tempFlag=='show'){
                                if(rowsvalue2.sn){
                                    initShuJu(rowsvalue2);
                                }   
                            }                                                     
                        },true);


                        function initShuJu(rowsvalue2){
                           // 
                           if((rowsvalue2.whichFlag=="users")){
                                pre_initGrid_users(rowsvalue2);
                           }
                           
                        } 


                       
                        //users
                        // 
                        function pre_initGrid_users(rowsvalue2){
                            //[已绑定APGroup List]    
                            var bsTable="table_traffic_stList";
                            var tid="tid_table_traffic_stList";
                            
                            var columns=[];
                            var bsTableColumn_Text=$scope.bsTable_Text2.split(',');
                            var bsTableColumn_Value=["apName","clientcount"];
                            $.each(bsTableColumn_Text,function(i,item){
                                var eachCol={
                                    title: item,
                                    field: bsTableColumn_Value[i],
                                    sortable: true,
                                    searcher: {type: "text"},
                                    formatter: function(value,row,index){
                                        // return formatterFun(value,row,index,eachCol.field);
                                        return value;
                                    } 
                                }; 
                                // client字段没有搜索功能
                                if(i==1){
                                    delete eachCol.searcher;
                                }  
                                //            
                                columns.push(eachCol);
                            });    
                            
                            init_Grid_users(bsTable,tid,columns,rowsvalue2);        
                        }
                        //
                        function init_Grid_users(bsTable,tid,columns,rowsvalue2){
                         
                            $scope[bsTable] = {
                                //tid
                                tId: tid,
                                sortable:true,           
                                searchable: true,
                                showPageList: true,
                                showCheckBox: true,
                                showRowNumber: false,
                                clickToSelect: true,  
                                // pageSize:15,
                                // pageList:[5,10,15],
                                //表列_点击事件
                                onClickCell: function (field, value, row) {
                                               
                                },
                                //表列_内容
                                columns: columns,


                                // 分页获取                                
                                contentType:'application/json',
                                dataType:'json',
                                apiVersion:'v3',                                
                                sidePagination:'server',
                                
                                method:"post",
                                url:"/v3/apmonitor/getApStationCount?devSN="+rowsvalue2.sn+"",
                                // +$scope.sceneInfo.sn
                                totalField: "count_total",
                                dataField: "apStationList",   

                                
                            };           
                        }
                      
                     
                    }
                };
            }
        ]);
    }
);
