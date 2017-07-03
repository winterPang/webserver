define(['angularAMD', 'utils', 'sprintf'],
    function (app, utils) {

        var sLang = utils.getLang();
        var URL_TEMPLATE_FILE = sprintf('../apinfo2/views/%s/traffictop5moredetails.html', sLang);
    
        app.directive('top5moredirect', ["$http", "$alertService", '$state', '$stateParams', '$window','$timeout', '$rootScope', '$q', 
            function ($http, $alert, $state ,$stateParams ,$window,$timeout, $rootScope, $q){
                return {
                    templateUrl: URL_TEMPLATE_FILE,
                    restrict: 'E',
                    scope: {
                        rowsvalue: '='
                    },
                    replace: true,
                    controller: function () {
                    },
                    link: function ($scope, $element, $attrs, $ngModel) {
                        

                        //变量值____双向绑定____value监听
                        $scope.$watch('rowsvalue',function(rowsvalue){
                            //                             
                            if(rowsvalue.tempFlag=='show'){
                                if(rowsvalue.sn){
                                    initShuJu(rowsvalue);
                                } 
                            }                       
                        },true);


                        function initShuJu(rowsvalue){
                           // traffic左侧
                           if(rowsvalue.whichFlag=="traffic"){
                                pre_initGrid_traffic(rowsvalue);
                           }
                        } 


                        //traffic
                        // 
                        function pre_initGrid_traffic(rowsvalue){
                            //[List]    
                            var bsTable="table_traffic_stList";
                            var tid="tid_table_traffic_stList";
                            
                            var columns=[];
                            var bsTableColumn_Text=$scope.bsTable_Text.split(',');
                            var bsTableColumn_Value=["apName","transmitTraffic"];
                            $.each(bsTableColumn_Text,function(i,item){
                                var eachCol={
                                    title: item,
                                    field: bsTableColumn_Value[i],
                                    sortable: true,
                                    searcher: {type: "text"},
                                    formatter: function(value,row,index,d){
                                        if(bsTableColumn_Value[i]!="apName"){
                                            return valueTransfer(value);
                                        }else{
                                            return value;
                                        }
                                    } 
                                };  
                                // traffic字段没有搜索功能
                                if(i==1){
                                    delete eachCol.searcher;
                                }  
                                // 
                                columns.push(eachCol);
                            });    
                            // fun
                            //trafficValue重新变换单位Fun
                            function valueTransfer(value) {
                                var nKB = 1,
                                    nMB = 1024 * nKB,
                                    nGB = 1024 * nMB,
                                    nTB = 1024 * nGB;
                                if (value >= nTB) {
                                    return (value / nTB).toFixed(2) + " TB";
                                } else if (value >= nGB) {
                                    return (value / nGB).toFixed(2) + " GB";
                                } else if (value >= nMB) {
                                    return (value / nMB).toFixed(2) + " MB";
                                } else {
                                    return (value / nKB).toFixed(2) + " KB";
                                }
                            }
                            // initGrid
                            init_Grid_traffic(bsTable,tid,columns,rowsvalue);        
                        }
                        //
                        function init_Grid_traffic(bsTable,tid,columns,rowsvalue){
                         
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
                                url:"/v3/apmonitor/getApTransmitTraffic?devSN="+rowsvalue.sn+"",
                                // +$scope.sceneInfo.sn
                                totalField: "count_total",
                                dataField: "apTransmitTrafficList",   

                                
                            };           
                        }


                      
                     
                    }
                };
            }
        ]);
    }
);
