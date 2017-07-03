define(['angularAMD', 'utils', 'sprintf'],
    function (app, utils) {

        var sLang = utils.getLang() || 'cn';
        var URL_TEMPLATE_FILE = sprintf('../client9/views/%s/xanth_count_rz.html', sLang);

        app.directive('xanthcountrz', ['$timeout', '$rootScope', '$http', '$q',
            function ($timeout, $rootScope, $http, $q) {
                return {
                    templateUrl: URL_TEMPLATE_FILE,
                    restrict: 'E',
                    scope: {
                        sn: '@'
                    },
                    replace: true,
                    controller: function ($scope, $element, $attrs, $transclude) {
                    },
                    link: function ($scope, $element, $attrs, $ngModel) {
                        var changeApgroup = "";
                        $scope.$on('paraChange',function(ev,data){
                            changeApgroup = data;                       
                            $http({
                                url:'/v3/stamonitor/monitor',
                                    method:'post',
                                    data:{
                                        method:'clientcount_cloud_clientmode',
                                        param:{   
                                            groupId:changeApgroup,
                                            dataType:'auth'                                              
                                        }  
                                    }                         
                                }).success(function(data){  
                                    var newObject=data.response;
                                    var Num5G = 0;
                                    var Num2G = 0;
                                    var count_one = 0;
                                    var count_two = 0;
                                    var count_three = 0;
                                    var count_four = 0;
                                    var count_five = 0;
                                    var count_six = 0;
                                    for (var i = 0; i < newObject.length; i++){
                                        if(newObject[i].clientMode == '802.11ac'){
                                            count_one = newObject[i].count
                                        }else
                                        if(newObject[i].clientMode == '802.11an'){
                                            count_two = newObject[i].count
                                        }else
                                        if(newObject[i].clientMode == '802.11a'){
                                            count_three = newObject[i].count
                                        }else
                                        if(newObject[i].clientMode == '802.11gn'){
                                            count_four = newObject[i].count
                                        }else
                                        if(newObject[i].clientMode == '802.11g'){
                                            count_five = newObject[i].count
                                        }else
                                        if(newObject[i].clientMode == '802.11b'){
                                            count_six = newObject[i].count
                                        }
                                    }
                                    Num5G = count_one + count_two + count_three;
                                    Num2G = count_four + count_five + count_six; 
                                    var terminalType =echarts.init(document.getElementById('pTerminal'));
                                    if(Num5G == 0 && Num2G == 0){
                                        terminalType.setOption(grayNextOption);
                                        return;
                                    }  
                                    // terminalType.on(echarts.config.EVENT.CLICK, function(data){
                                    //     other = data.data.name;
                                    //     apart = other.split("(")[0];
                                    //     $scope.$broadcast('refresh#clientMode', {
                                    //         url: '/v3/stamonitor/getclientlist_bymodeorvendor?devSN='+$scope.sn,  
                                    //     });
                                    //     $scope.$broadcast("show#clientModeOf");
                                    // });               
                                    var terminalOption={
                                        tooltip: {
                                        trigger: 'item',
                                        formatter: "{a} {b}: <br/>{c} ({d}%)"
                                        },
                                        legend: {
                                            orient: 'vertical',
                                            x:'10%',
                                            y : '10%',
                                            data:['802.11ac(5GHz)','802.11an(5GHz)','802.11a(5GHz)','802.11gn(2.4GHz)','802.11g(2.4GHz)','802.11b(2.4GHz)']
                                        },
                                        series: [
                                            {
                                                type:'pie',
                                                radius: '30%',
                                                center: ['58%', '35%'],
                                                itemStyle: {
                                                    normal: {
                                                        labelLine:{
                                                            show:false
                                                        },
                                                        color:
                                                            function(a,b,c,d) {
                                                            var colorList = ['#4ec1b2','#b3b7dd'];
                                                            return colorList[a.dataIndex];
                                                        },
                                                        label:
                                                        {
                                                            position:"inner",
                                                            show:false
                                                        }
                                                    }
                                                },
                                                data:  
                                                // [
                                                //     {name:'5GHz',value:Num5G},
                                                //     {name:'2.4GHz',value:Num2G}
                                                // ]
                                                [
                                                    {name:'5GHz',value:10},
                                                    {name:'2.4GHz',value:30}
                                                ]
                                            },
                                            {
                                                type:'pie',
                                                radius : ['40%','60%'],
                                                center: ['58%', '35%'],
                                                itemStyle: {
                                                    normal: {
                                                        labelLine:{
                                                            show:false
                                                        },
                                                        label:
                                                        {
                                                            position:"inner",
                                                            show:false
                                                        }
                                                    }
                                                },
                                                data:
                                                // [
                                                //     {name:'802.11ac(5GHz)',value:count_one},
                                                //     {name:'802.11an(5GHz)',value:count_two},
                                                //     {name:'802.11a(5GHz)',value:count_three},
                                                //     {name:'802.11gn(2.4GHz)',value:count_four},
                                                //     {name:'802.11g(2.4GHz)',value:count_five},
                                                //     {name:'802.11b(2.4GHz)',value:count_six}
                                                // ]
                                                [
                                                    {name:'802.11ac(5GHz)',value:5},
                                                    {name:'802.11an(5GHz)',value:6},
                                                    {name:'802.11a(5GHz)',value:9},
                                                    {name:'802.11gn(2.4GHz)',value:12},
                                                    {name:'802.11g(2.4GHz)',value:20},
                                                    {name:'802.11b(2.4GHz)',value:7}
                                                ]
                                            }
                                        ],
                                        color: ['#4ec1b2','#78cec3','#95dad1','#b3b7dd','#c8c3e1','#e7e7e9']
                                    };               
                                    terminalType.setOption(terminalOption);
                                }).error(function(){               
                            }); 

                            var grayNextOption = {
                                height:200,
                                calculable : false,
                                series : [
                                    {
                                        type:'pie',
                                        radius : '30%',
                                        center: ['50%', '35%'],
                                        itemStyle: {
                                            normal: {
                                                labelLine:{
                                                    show:false
                                                },
                                                label:
                                                {
                                                    position:"inner",
                                                }
                                            }
                                        },
                                        data:  [{name:'N/A',value:1}]
                                    },
                                    {
                                        type:'pie',
                                        radius : ['40%', '60%'],
                                        center: ['50%', '35%'],
                                        itemStyle: {
                                            normal: {
                                                labelLine:{
                                                    show:false
                                                },
                                                label:
                                                {
                                                    position:"inner"
                                                }
                                            }
                                        },
                                        data: [{name:'N/A',value:1}]
                                    }
                                ],
                                color : ["rgba(216, 216, 216, 0.75)"]
                            };

                            $http({    
                                url:'/v3/stamonitor/monitor',
                                    method:'post',
                                    data:{
                                        method:'clientcount_cloud_vendor',
                                        param:{   
                                            groupId:changeApgroup,
                                            dataType:"auth"                                              
                                        }  
                                    }   
                                }).success(function(data){
                                    var oData=data.response;
                                    var aLegend=[];
                                    var aData=[];
                                    $.each(oData,function(i,item){
                                        aLegend[i]=item._id || $scope.viewTittle;
                                        aData[i]={};
                                        aData[i].name=item._id || $scope.viewTittle;
                                        aData[i].value=item.clientCount || undefined;
                                    });
                                    // Array.prototype.removeByValue = function(val) {
                                    //     for(var i=0; i<this.length; i++) {
                                    //         if(this[i] == val) {
                                    //             this.splice(i, 1);
                                    //             break;
                                    //         }
                                    //     }
                                    // }
                                    // var apendfor = [];
                                    // var otherclent = [];
                                    // $.extend(apendfor,aLegend);
                                    // apendfor.removeByValue("other");
                                    // otherclent = apendfor.join().replace("未知","").split(",");
                                    var terminalFirm = echarts.init(document.getElementById("pTermianlFirm"));
                                    if(aData.length == 0){
                                        terminalFirm.setOption(grayLastOption);
                                        return;
                                    }
                                    // terminalFirm.on(echarts.config.EVENT.CLICK, function(data){
                                    //     apart = data.data.name;
                                    //     if(apart == "other"){
                                    //         apart = {$nin:otherclent};    
                                    //     }else
                                    //     if(apart == $scope.viewTittle){
                                    //         apart = "";
                                    //     }
                                    //     $scope.$broadcast('refresh#clientType', {
                                    //         url: '/v3/stamonitor/getclientlist_bymodeorvendor?devSN='+$scope.sn,
                                    //     });
                                    //     $scope.$broadcast("show#clientTypeOf"); 
                                    // }); 
                                    var terFirmOption = {
                                        tooltip: {
                                        trigger: 'item',
                                        formatter: "{a} {b}: <br/>{c} ({d}%)"
                                        },
                                        legend: {
                                            orient: 'vertical',
                                            x : '15%',
                                            data:
                                            aLegend,                             
                                            //['苹果','小米','三星','华为'], 
                                            y: '10%'
                                        },
                                        series: [
                                            {
                                                type:'pie',
                                                radius :['40','55%'],
                                                center: ['60%', '35%'],
                                                avoidLabelOverlap: false,
                                                itemStyle: {
                                                    normal: {
                                                        labelLine:{
                                                            show:false
                                                        },
                                                        label:
                                                        {
                                                            position:"inner",
                                                            show:false
                                                        }
                                                    }
                                                },
                                                data:
                                                aData
                                                // [
                                                //     { name: '苹果', value: 13},
                                                //     { name: '小米', value: 17},
                                                //     { name: '三星', value: 25},
                                                //     { name: '华为', value: 39}
                                                // ]                         
                                            }
                                        ],
                                        color:['#4ec1b2', '#fbceb1', '#b3b7dd', '#4fc4f6', '#fe808b', '#e7e7e9']
                                    };
                                    terminalFirm.setOption(terFirmOption);
                                }).error(function(){               
                            }); 

                            var grayLastOption = {
                                height:200,
                                calculable : false,
                                series : [
                                    {
                                        type:'pie',
                                        radius : ['40%', '60%'],
                                        center: ['50%', '35%'],
                                        itemStyle: {
                                            normal: {
                                                labelLine:{
                                                    show:false
                                                },
                                                label:
                                                {
                                                    position:"inner"
                                                }
                                            }
                                        },
                                        data: [{name:'N/A',value:1}]
                                    }
                                ],
                                color : ["rgba(216, 216, 216, 0.75)"]
                            };

                            $scope.clientMode={
                                tId:'clientMode',
                                pageSize:10,
                                showPageList:false,
                                pageParamsType: 'path',
                                method: "post",
                                searchable:true,
                                sidePagination: "server",
                                contentType: "application/json",
                                dataType: "json",
                                startField: 'skipnum',     
                                limitField: 'limitnum',       
                                queryParams: function (params) {
                                    var oBody = {
                                        mode : apart,                                      
                                        sortoption: {}
                                    };
                                    if (params.sort) {
                                        oBody.sortoption[params.sort] = (params.order == "asc" ? 1 : -1);
                                    }
                                    params.start = undefined;
                                    params.size = undefined;
                                    params.order = undefined;
                                    return $.extend(true,{},params,oBody);
                                },
                                responseHandler: function (data) {
                                    var wheredata = data.clientList.clientInfo;
                                    $.each(wheredata, function (i,item) {
                                        if(item.clientVendor==""){
                                            item.clientVendor=$scope.header_6;
                                        }    
                                    });
                                    return {
                                        total: data.clientList.count_total,
                                        rows: data.clientList.clientInfo
                                    };  
                                },
                                columns:[
                                    {sortable:true,searcher:{},field:'clientMAC',title:$scope.header_1},
                                    {sortable:true,searcher:{},field:'clientIP',title:$scope.header_2},
                                    {sortable:true,searcher:{},field:'clientVendor',title:$scope.header_3},
                                    {sortable:true,searcher:{},field:'ApName',title:$scope.header_4},
                                    {sortable:true,searcher:{},field:'clientSSID',title:$scope.header_5}
                                ],
                            };

                            $scope.clientType={
                                tId:'clientType',
                                pageSize:10,
                                showPageList:false,
                                pageParamsType: 'path',
                                method: "post",
                                searchable:true,
                                sidePagination: "server",
                                contentType: "application/json",
                                dataType: "json",
                                startField: 'skipnum',     
                                limitField: 'limitnum',       
                                queryParams: function (params) {
                                    var oBody = {
                                        vendor : apart,                                
                                        sortoption: {}
                                    };
                                    if (params.sort) {
                                        oBody.sortoption[params.sort] = (params.order == "asc" ? 1 : -1);
                                    }
                                    params.start = undefined;
                                    params.size = undefined;
                                    params.order = undefined;
                                    return $.extend(true,{},params,oBody);
                                },
                                responseHandler: function (data) {
                                    var wheredata = data.clientList.clientInfo;
                                    $.each(wheredata, function (i,item) {
                                        if(item.clientVendor==""){
                                            item.clientVendor=$scope.header_6;
                                        }    
                                    });
                                    return {
                                        total: data.clientList.count_total,
                                        rows: data.clientList.clientInfo
                                    };  
                                },
                                columns:[
                                    {sortable:true,searcher:{},field:'clientMAC',title:$scope.header_1},
                                    {sortable:true,searcher:{},field:'clientIP',title:$scope.header_2},
                                    {sortable:true,searcher:{},field:'clientVendor',title:$scope.header_3},
                                    {sortable:true,searcher:{},field:'ApName',title:$scope.header_4},
                                    {sortable:true,searcher:{},field:'clientSSID',title:$scope.header_5}
                                ],
                            };

                            $scope.clientModeOf = {
                                mId:'clientModeOf',                             
                                title:$scope.ngModel,                           
                                autoClose: true ,                        
                                showCancel: false ,                       
                                modalSize:'lg' ,                     
                                showHeader:true,                        
                                showFooter:true ,                        
                                okText: $scope.autoClose,  
                                // cancelText: '关闭',  //取消按钮文本
                                okHandler: function(modal,$ele){
                                    
                                },
                                cancelHandler: function(modal,$ele){
                                   
                                },
                                beforeRender: function($ele){
                                    
                                    return $ele;
                                }
                            }; 

                            $scope.clientTypeOf = {
                                mId:'clientTypeOf',                             
                                title:$scope.ngModel,                           
                                autoClose: true ,                        
                                showCancel: false ,                       
                                modalSize:'lg' ,                     
                                showHeader:true,                        
                                showFooter:true ,                        
                                okText: $scope.autoClose,  
                                // cancelText: '关闭',  //取消按钮文本
                                okHandler: function(modal,$ele){
                                    
                                },
                                cancelHandler: function(modal,$ele){
                                   
                                },
                                beforeRender: function($ele){
                                    
                                    return $ele;
                                }
                            }; 

                            $scope.$on('hidden.bs.modal#clientModeOf',function(){ 
                                $scope.$broadcast('hideSearcher#clientMode');  //  实现了搜索表头的折叠 
                            }); 

                            $scope.$on('hidden.bs.modal#clientTypeOf',function(){ 
                                $scope.$broadcast('hideSearcher#clientType');  //  实现了搜索表头的折叠 
                            });
                        });                  

                    }
                };
            }
        ]);
    }
);
