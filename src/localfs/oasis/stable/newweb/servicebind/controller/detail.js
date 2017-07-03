define(['jquery','utils','bsTable'],function($scope,Utils) {
    return ['$scope', '$http','$state',function($scope,$http,$state){
        var g_aData=[];
        function getRcString(attrName){
            return Utils.getRcString("ap_bindservice_rc",attrName);
        }
        // var stBindApgroupUrlObj = Utils.getUrl('GET','','/ssidmonitor/getapgroupbindstcount?devSN='+$scope.sceneInfo.sn,'/init/servicebind5/stbindapgroup.json');
        var stBindApUrlObj = Utils.getUrl('GET','','/ssidmonitor/getapbindstcount?devSN='+$scope.sceneInfo.sn,'/init/servicebind5/stbindap.json');
        // var apGroupBindUrl = Utils.getUrl('GET','','/ssidmonitor/getapgroupbindstlist?devSN='+$scope.sceneInfo.sn,'/init/servicebind5/apgroupbindlist.json');
        var apBindUrl = Utils.getUrl('GET','','/ssidmonitor/getapbindstlist?devSN='+$scope.sceneInfo.sn,'/init/servicebind5/apbindlist.json');
        // get the count of station by group
        // $http({
        //     url:stBindApgroupUrlObj.url,
        //     method:stBindApgroupUrlObj.method
        //     }).success(function(data,header,config,status){
        //         console.log(data);
        //         var oData = data.apgroupList;
        //         $.each(oData,function(i,item){
        //             oData[i] ={};
        //             oData[i].ApGroupName = item.apGroupName;
        //             oData[i].apGrpDesc = item.apGrpDesc;
        //             oData[i].stBindCount = item.stBindCount;
        //         });
        //         $scope.apGroupOptions={
        //             tId:'apgroup',
        //             striped:true,
        //             pagniation:true,
        //             clickToSelect: true,
        //             columns:[
        //                         {sortable:true,field:'ApGroupName',title:getRcString('BASE_HEADER_S').split(",")[0]},
        //                         {sortable:true,field:'apGrpDesc',title:getRcString('BASE_HEADER_S').split(",")[1]},
        //                         {sortable:true,field:'stBindCount',title:getRcString('BASE_HEADER_S').split(",")[2],
        //                         formatter: function(value,row,index){
        //                                 return '<a class="list-link">'+value+'</a>';
        //                                 } 
        //                         },
        //                         {
        //                             title: getRcString('TiTTLE').split(',')[0],
        //                             field: 'id',
        //                             formatter: function(value,row,index){
        //                                     return '<a class="list-link"><i class="fa fa-link"></i></a>';
        //                                 } 
        //                         }
        //                     ],
        //             data:oData
        //         };
        //         $scope.$broadcast('load#apgroup');
        //     }).error(function(data,header,config,status){
        //     //处理响应失败
        // });

        //get the count of station by ap
        $http({
            url:stBindApUrlObj.url,
            method:stBindApUrlObj.method
            }).success(function(data,header,config,status){
                g_aData = data;
                var oData = data.apList;
                 $scope.apOptions={
                        tId:'ap',
                        striped:true,
                        pagniation:true,
                        clickToSelect: true,
                        columns:[
                                    {sortable:true,field:'apName',title:getRcString('BASE_HEADER_W').split(",")[0]},
                                    {sortable:true,field:'stBindCount',title:getRcString('BASE_HEADER_W').split(",")[1],
                                    formatter: function(value,row,index){
                                            return '<a class="list-link">'+value+'</a>';
                                            } 
                                    },
                                    {
                                        title: getRcString('TiTTLE').split(',')[0],
                                        field: 'id',
                                        formatter: function(value,row,index){
                                                return '<a class="list-link"><i class="fa fa-link"></i></a>';
                                            } 
                                    }
                                ],
                        data:oData
                };
                $scope.$broadcast('load#ap');
            }).error(function(data,header,config,status){
            //处理响应失败
        });

        // $scope.tableTest = false;

        // $scope.bindApGroup = function (e) {
        //     var value = e.target.getAttribute('value');
        //     $scope.tableTest = value ==1?false:true;
        // }
       
        // $scope.$on('click-cell.bs.table#apgroup',function (e, field, value, row, $element){
        //     var apGroupName  = row.ApGroupName;
        //     if(field=='stBindCount'){
        //         $scope.$broadcast('show#apgroupstnum');
        //         $http({
        //             url:apGroupBindUrl.url,
        //             method:apGroupBindUrl.method,
        //             params:{
        //                 apGroupName:apGroupName
        //             }
        //         }).success(function(data,header,config,status){
                    
        //             var oData = data.stList.stBindList;
        //             $.each(oData,function(i,item){
        //                 oData[i] = {};
        //                 oData[i].staName = item.stName || " ";
        //                 oData[i].ssid = item.ssidName || " ";
        //                 oData[i].staDescription = item.description  || " ";
        //             });
        //             $scope.$broadcast('load#staApgroup',oData);
        //         }).error(function(data,header,config,status){

        //         });
                
        //     }else if(field=='id'){
        //         $state.go('^.bindapgroup',{name:apGroupName});
        //     }
        // })
        // $scope.apGroupButtons={
        //     options:{
        //         mId:'apgroupstnum',
        //         title:getRcString('TiTTLE').split(',')[1],                          
        //         autoClose: true,                         
        //         showCancel: true,                        
        //         buttonAlign: 'center',                    
        //         okHandler: function(modal,$ele){
        //         //点击确定按钮事件，默认什么都不做
        //         },
        //         cancelHandler: function(modal,$ele){
        //         //点击取消按钮事件，默认什么都不做
        //         },
        //         beforeRender: function($ele){
        //             //渲染弹窗之前执行的操作,$ele为传入的html片段
        //             return $ele;
        //         }
        //     }
        // },
        // $scope.bindStaOptions={
        //     tId:'staApgroup',
        //     striped:true,
        //     pagniation:true,
        //     clickToSelect: true,
        //     columns:[
        //                 {sortable:true,field:'staName',title:getRcString('Bind_HEADER').split(",")[0]},
        //                 {sortable:true,field:'ssid',title:getRcString('Bind_HEADER').split(",")[1]},
        //                 {sortable:true,field:'staDescription',title:getRcString('Bind_HEADER').split(",")[2]}
        //             ],
        // // data:oData
        // };

        
       
        $scope.$on('click-cell.bs.table#ap',function (e, field, value, row, $element){
            var apName  = row.apName;
            if(field == 'stBindCount'){
                $scope.$broadcast('show#apstnum'); 
                $http({
                    url:apBindUrl.url,
                    method:apBindUrl.method,
                    params:{
                        apName:apName
                    }
                }).success(function(data,header,config,status){
                    var oData = data.stList.stBindList;
                    $.each(oData,function(i,item){
                        oData[i] = {};
                        oData[i].staName = item.stName || " ";
                        oData[i].ssid = item.ssidName || " ";
                        oData[i].staDescription = item.description  || " ";
                    });
                    $scope.$broadcast('load#staAp',oData);
                    $(window).trigger('resize');  
                }).error(function(data,header,config,status){

                });
                
            }else if(field =='id'){
                var apsn;
                var radioNum;
                $.each(g_aData.apList,function(n,value){
                    if(value.apName==apName){
                        apsn=value.apSN;
                        radioNum=value.radioNum;
                    }
                })
                $state.go('^.bindap',{name:apName,apSN:apsn,radioNum:radioNum});
            }
        })

        $scope.apButtons={
            options:{
                 mId:'apstnum',
                 title:getRcString('TiTTLE').split(',')[1],                          
                 autoClose: true,                         
                 showCancel: true,                        
                 buttonAlign: 'center',                    
                 okHandler: function(modal,$ele){
                 //点击确定按钮事件，默认什么都不做
                 },
                 cancelHandler: function(modal,$ele){
                 //点击取消按钮事件，默认什么都不做
                 },
                 beforeRender: function($ele){
                     //渲染弹窗之前执行的操作,$ele为传入的html片段
                     return $ele;
                 }
            }
        }
        $scope.bindApStaOptions={
            tId:'staAp',
            striped:true,
            pagniation:true,
            clickToSelect: true,
            columns:[
                        {sortable:true,field:'staName',title:getRcString('Bind_HEADER').split(",")[0]},
                        {sortable:true,field:'ssid',title:getRcString('Bind_HEADER').split(",")[1]},
                        {sortable:true,field:'staDescription',title:getRcString('Bind_HEADER').split(",")[2]}
                    ]
        }
    }]
});