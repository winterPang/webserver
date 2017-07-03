define(['echarts','utils','angular-ui-router','bsTable','css!../css/apinfo5'], function(echarts, Utils) {
    return ['$scope', '$http', '$alertService', '$state', function($scope, $http,$){

        // get url 
        var url_ApStatus = Utils.getUrl('GET','','/apmonitor/getApCountByStatus','/init/apinfo5/get_apstatus_count.json');
        var url_ApgroupList = Utils.getUrl('GET','','/apmonitor/getApCountAndDescByGroup','/init/apinfo5/get_apGroup.json');
        var url_ApModel = Utils.getUrl('GET','','/apmonitor/getApCountByModel','/init/apinfo5/get_apmodel.json');
        var url_ApClient = Utils.getUrl('GET','','/stamonitor/getapstaticbyclientnum','init/apinfo5/get_apclientnum.json');
        var url_ApType = Utils.getUrl('GET','','/apmonitor/getApCountByMethod','/init/apinfo5/get_aptype.json');
        var url_ApInfoByGroup = Utils.getUrl('POST','','/apmonitor/aplistbygroup','/init/apinfo5/get_aptype.json');
        var url_ApInfoByType = Utils.getUrl('POST','','/apmonitor/getApCountByMethodForApList','/init/apinfo5/get_aptype.json');
        //var url_ApInfoByClient = Utils.getUrl('POST','','/apmonitor/getapstaticbyclientnumforaplist','/init/apinfo5/get_aptype.json');
        var url_ApInfoByClient = Utils.getUrl('POST','','/apmonitor/getApListByClientNum','/init/apinfo5/get_aptype.json');
        //tool Function
        function getRcString(attrName){
            return Utils.getRcString("apinfo_rc",attrName).split(',');
        }

        $scope.ApGroup_list = {
            tId:'grouplist',
            url:url_ApgroupList.url,
            contentType:'application/json',
            dataType:'json',
            height:263,
            pageSize:5,
            pageList:[5,10],
            dataField:'apList',
            queryParams:function(params){
                params.devSN=$scope.sceneInfo.sn;
                return params;
            },
            columns: [
                {sortable: true, field: 'ApGroupName', title: getRcString("group_header")[0]},
                {
                    sortable: true,
                    field: 'ApCount',
                    title:  getRcString("group_header")[1],
                    cellStyle:function(value, row, index, field){
                        return {
                            //classes: 'list-link'
                            css: {"color": "#69C4C5", 'cursor': "pointer"}
                        }
                    }
                }
            ],
            paginationPreText: '&lsaquo;',   //    分页条上一页显示的文本
            paginationNextText: '&rsaquo;',  //    分页条下一页显示的文本
            paginationFirstText: '&laquo;',  //    第一页显示的文本  默认是两个小于号
            paginationLastText: '&raquo;',   //    最后一页显示的文本  默认是两个大于号
            paginationSize: 'sm',        //    分页条显示大小，normal正常样式，sm是只显示上一页下一页第一页最后一页
            showPageList: false
        };

        $scope.$on('click-cell.bs.table#grouplist',function(field,value, row, $element)
        {
            $scope.$broadcast('show#apInfoByGroup');
            $scope.$broadcast('hideSearcher#apInfoByGroupList',false);  //  实现了搜索表头的折叠
            $scope.$broadcast('refresh#apInfoByGroupList',{
                url:url_ApInfoByGroup.url+"?devSN="+$scope.sceneInfo.sn+"&apGroupName="+$element.ApGroupName
            });
        });

        $scope.apInfoByGroupList = {
            tId:'apInfoByGroupList',
            method:"post",
            contentType:'application/json',
            dataType:'json',
            pageSize:5,
            pageList:[5,10,15],
            apiVersion:'v3',
            searchable:true,
            sidePagination:'server',
            dataField:'apList',
            totalField:'totalCntInGrp',
            queryParams:function(params){
                params.findoption = {
                    "findOptInGrp": params.findoption
                };
                params.sortoption = {
                    "sortOptInGrp" :  params.sortoption
                };
                return params;
            },
            columns: [
                {searcher:{},sortable: true, field: 'apName', title: getRcString("ap_info_group")[0]},
                {searcher:{},sortable: true, field: 'apModel', title:  getRcString("ap_info_group")[1]},
                {searcher:{},sortable: true, field: 'apSN', title: getRcString("ap_info_group")[2]},
                {searcher:{},sortable: true, field: 'macAddr', title:  getRcString("ap_info_group")[3]},
            ]
        };

        $scope.apInfoByGroupOption ={
            mId:'apInfoByGroup',
            title:getRcString('AP_LIST'),
            autoClose: true ,
            showCancel: false ,
            showOk:false,
            modalSize:'lg' ,
            showHeader:true   ,
            showFooter:false  ,
            showClose:true
        }

        $scope.apInfoByClientList ={
            tId:'apInfoByClientList',
            method:"post",
            contentType:'application/json',
            dataType:'json',
            pageSize:5,
            pageList:[5,10,15],
            apiVersion:'v3',
            searchable:true,
            sidePagination:'server',
            dataField:'apList',
            totalField:'totalCount',
            columns: [
                {searcher:{},sortable: true, field: 'apName', title: getRcString("ap_info_type")[0]},
                {searcher:{},sortable: true, field: 'apModel', title:  getRcString("ap_info_type")[1]},
                {searcher:{},sortable: true, field: 'clientCount', title: getRcString("ap_info_type")[2]}
            ]
        };

        $scope.apInfoByClientOption ={
            mId:'apInfoByClient',
            title:getRcString('AP_LIST'),
            autoClose: true ,
            showCancel: false ,
            showOk:false,
            modalSize:'lg' ,
            showHeader:true   ,
            showFooter:false  ,
            showClose:true
        };

        $scope.apInfoByTypeList ={
            tId:'apInfoByTypeList',
            method:"post",
            contentType:'application/json',
            dataType:'json',
            pageSize:5,
            pageList:[5,10,15],
            apiVersion:'v3',
            searchable:true,
            sidePagination:'server',
            dataField:'apList',
            totalField:'totalCount',
            columns: [
                {searcher:{},sortable: true, field: 'apName', title: getRcString("ap_info_client")[0]},
                {searcher:{},sortable: true, field: 'apModel', title:  getRcString("ap_info_client")[1]}
            ]
        };

        $scope.apInfoByTypeOption ={
            mId:'apInfoByType',
            title:getRcString('AP_LIST'),
            autoClose: true ,
            showCancel: false ,
            showOk:false,
            modalSize:'lg' ,
            showHeader:true   ,
            showFooter:false  ,
            showClose:true
        }

        function drawEmptyPie(jEle)
        {
            var oTheme={color : ["rgba(216, 216, 216, 0.75)"]};
            var piechart =echarts.init(document.getElementById(jEle),oTheme);
            var option = {
                height:245,
                calculable : false,
                series : [
                    {
                        type:'pie',
                        radius : '65%',
                        center: ['50%', '35%'],
                        itemStyle: {
                            normal: {
                                // borderColor:"#FFF",
                                // borderWidth:1,
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
                ]
            };

            piechart.setOption(option);
        }

        // function APModel_bar(aModels,aModelData)
        // {
        //     var OnlineApCount = [];
        //     var OfflineApCount = [];
        //     for(var i=0; i<aModelData.length; i++){
        //         OnlineApCount.push(aModelData[i].OnlineApCount);
        //         OfflineApCount.push(aModelData[i].OfflineApCount);
        //     }
        //     var nEnd = parseInt(700/aModels.length)-1;
        //     var nWidth =900;
        //     //document.getElementById('APModel_bar').parent().width()*0.95;
        //     //console.debug(angular.element('#APModel_bar').parent().width()*0.95);
        //     var totalchart =echarts.init(document.getElementById('APModel_bar'));

        //     var option = {
        //         // color: ['#4ec1b2'],//颜色
        //         width:nWidth,
        //         height: 284,
        //         grid: {
        //             x:'20%', y:0, x2:50, y2:25,
        //             borderColor: 'rgba(0,0,0,0)'
        //         },
        //         tooltip : {
        //             show: true,
        //             formatter:function  (args) {
        //                 var s1 = args[0],s2=args[1];
        //                 return s1.name +'<br/>' + 
        //                 s2['seriesName'] +':'+s2['value'] +'<br/>'+
        //                 s1['seriesName'] +':'+s1['value'];
        //             },//格式化输出格式
        //             trigger: 'axis',
        //             axisPointer:{
        //                 type : 'line',
        //                 lineStyle : {
        //                     color: '#fff',
        //                     width: 0,
        //                     type: 'solid'
        //                 }
        //             }
        //         },
        //         calculable : false,
        //         dataZoom : {
        //             show : true,
        //             realtime : true,
        //             start : 0,
        //             zoomLock: true,
        //             orient: "vertical",
        //             width: 10,
        //             x: nWidth-10,
        //             end: nEnd,
        //             backgroundColor:'#F7F9F8',
        //             fillerColor:'#BEC7CE',
        //             handleColor:'#BEC7CE'
        //         },
        //         xAxis : [
        //             // {
        //             //     type : 'value',
        //             //     splitLine : {
        //             //         show:false,
        //             //         lineStyle: {
        //             //             color: '#373737',
        //             //             type: 'solid',
        //             //             width: 1
        //             //         }
        //             //     },
        //             //     splitArea : {
        //             //         areaStyle : {
        //             //             color: '#174686'
        //             //         }
        //             //     },
        //             //     axisLine  : {
        //             //         show:true,
        //             //         lineStyle :{color: '#373737', width: 1}
        //             //     }
        //             // }
        //             {
        //                 type : 'value',
        //               //  minInterval: 1,
        //                 boundaryGap: [0, 0.01]
        //             }
        //         ],
        //         yAxis : [
        //             // {
        //             //     show: true,
        //             //     type : 'category',
        //             //     boundaryGap : true,
        //             //     data : aModels,
        //             //     axisLabel:{
        //             //         show:false,
        //             //         textStyle: {color:"#80878c"}
        //             //     },
        //             //     splitLine : {
        //             //         show:false
        //             //     },
        //             //     splitArea : {
        //             //         areaStyle : {
        //             //             color: '#174686'
        //             //         }
        //             //     },
        //             //     axisLine  : {
        //             //         show:true,
        //             //         lineStyle :{color: '#373737', width: 1}
        //             //     }
        //             // }
        //             {
        //                 type : 'category',
        //                 data : aModels
        //             }
        //         ],
        //         // legend: {
        //         //     data: ['在线AP数量', '离线AP数量']
        //         // },//标题
        //         series : [
        //             // {
        //             //     type:'bar',
        //             //     data: aModelData,
        //             //     itemStyle : {
        //             //         normal: {
        //             //             label : {
        //             //                 show: true,
        //             //                 position: 'insideLeft',
        //             //                 formatter: function(x, y, val){
        //             //                     return x.name;
        //             //                 },
        //             //                 textStyle: {color:"#000"}
        //             //             }
        //             //         },
        //             //         emphasis: {
        //             //             label : {
        //             //                 show: true,
        //             //                 formatter: function(x, y, val){
        //             //                     return x.name;
        //             //                 },
        //             //                 textStyle: {color:"#000"}
        //             //             }
        //             //         }
        //             //     }
        //             // }
        //             {
        //                 name:getRcString('AP_Count')[0],
        //                 type:'bar',
        //                 itemStyle:{
        //                    normal:{color:'#CDCDCD'}
        //                 },
        //                 data: OfflineApCount
        //             },
        //             {
        //                 name:getRcString('AP_Count')[1],
        //                 type:'bar',
        //                 itemStyle:{
        //                    normal:{color:'#42BAA9'}
        //                 },
        //                 data: OnlineApCount
        //             }
        //         ]
        //     };

        //     totalchart.setOption(option);
        // }

        function terminal(aData)
        {
            var oTheme={
                color: ['#E7E7E9','#4fcff6','#78cec3','#4EC1B2','#fbceb1','#f9ab77','#ff9c9e','#fe808b']
            };
            var piechart =echarts.init(document.getElementById("According_client"),oTheme);

            function clickEvent(param){
                $scope.clientNum = param.data&&param.data.name;
                $scope.apNum = param.data&&param.data.value;
                $scope.$broadcast('show#apInfoByClient');
                //url_ApInfoByClient
                var clientNumLeft,clientNumRight;
                if(param.name == "0"){
                    clientNumLeft = 0;
                    clientNumRight = 0;
                }else if(param.name.split('~').length > 0){
                    clientNumLeft = param.name.split('~')[0];
                    clientNumRight = param.name.split('~')[1];
                }else{
                    clientNumLeft = 101;
                    clientNumRight = -1;
                }
                $scope.$broadcast('hideSearcher#apInfoByClientList',false);  //  实现了搜索表头的折叠
                $scope.$broadcast('refresh#apInfoByClientList',{
                    url:url_ApInfoByClient.url+"?devSN="+$scope.sceneInfo.sn+"&clientNumLeft="+
                    clientNumLeft+"&clientNumRight="+clientNumRight
                });
            }

            //define click EVENT
            piechart.on(echarts.config.EVENT.CLICK, clickEvent);

            var dataStyle = {
                normal: {
                    label : {
                        show: false,
                        position: 'inner',
                        formatter: '{d}%'
                    },
                    labelLine:{
                        show:false
                    },
                    borderColor:'#FFF',
                    borderWidth:1
                }
            };

            var option = {
                height:245,
                tooltip : {
                    trigger: 'item',
                    formatter: "{b} : {c} ({d}%)"
                },
                legend: {
                    orient : 'vertical',
                    x:'25%',
                    y:'18%',
                    data:['0','1~10','11~20','21~40',"",'41~60','61~80','81~100',getRcString('apClientType')[8]]
                },
                calculable : false,
                series : [
                    {
                        type:'pie',
                        radius : ['37%','55%'],
                        center: ['80%', '35%'],
                        itemStyle : dataStyle,
                        data:aData
                    }
                ]
            };

            piechart.setOption(option);
        }

        function ApType_pie(aInData)
        {
            var oTheme={
                color: ['#4EC1B2','#78CEC3','#D2D2D2','#E7E7E9','#ABD6F5','#86C5F2','#63B4EF','#3DA0EB','#1683D3','#136FB3']
            };

            var piechart =echarts.init(document.getElementById("ApType_pie"),oTheme);

            function clickEvent(param){
                $scope.apType = param.data&&param.data.name;
                $scope.aptTypeNum = param.data&&param.data.value;
                $scope.$broadcast('show#apInfoByType');
                //url_ApInfoByType
                $scope.$broadcast('hideSearcher#apInfoByTypeList',false);  //  实现了搜索表头的折叠
                $scope.$broadcast('refresh#apInfoByTypeList',{
                    url:url_ApInfoByType.url+"?devSN="+$scope.sceneInfo.sn+
                    "&CreateMethod="+param.data.CreateMethod
                });
            }

            //define click EVENT
            piechart.on(echarts.config.EVENT.CLICK, clickEvent);

            var dataStyle = {
                normal: {
                    label : {
                        show: false,
                        position: 'inner',
                        formatter: '{d}%'
                    },
                    labelLine:{
                        show:false
                    },
                    borderColor:'#FFF',
                    borderWidth:1
                }
            };

            var option = {
                height:245,
                width:'100%',
                tooltip : {
                    trigger: 'item',
                    formatter: "{b} :<br/> {c} ({d}%)"
                },
                legend: {
                    orient : 'vertical',
                    x :'25%',
                    y:'18%',
                    // padding: 260,
                    data:getRcString('apType')/*['在线的手工AP','自动AP','离线的手工AP','未认证的AP']*/
                },
                calculable : false,
                series : [
                    {
                        type:'pie',
                        radius : ['37%','55%'],
                        center: ['80%', '35%'],
                        itemStyle : dataStyle,
                        data:aInData
                    }
                ]

            };
            var oTheme={
                color: ['#4EC1B2','#78CEC3','#D2D2D2','#E7E7E9','#ABD6F5','#86C5F2','#63B4EF','#3DA0EB','#1683D3','#136FB3']
            };

            piechart.setOption(option);
        }

        function getApCount()
        {
            http_getApCountByStatus(function (data) {
                if (data != ""){
                    var tempdata = data.ap_statistic;
                    $scope.unhealth_ap = tempdata.other;
                    $scope.online_ap = tempdata.online;
                    $scope.offline_ap = tempdata.offline;
                }
            });
        }

      /*  function getApModel()
        {
            http_getApModel(function (data) {
                if (data != ""){
                    var tempdata = data.apList;
                    var names = [];
                    var values = [];
               
                    for(var i=0; i<tempdata.length; i++){
                        names.push(tempdata[i].ApModel);
                        values.push({name:tempdata[i].ApModel,value:tempdata[i].ApCount,OnlineApCount:tempdata[i].OnlineApCount,OfflineApCount:tempdata[i].OfflineApCount});
                    }
                    APModel_bar(names,values);
                }
            });
        }*/
        
        function getClientNum()
        {
            http_getClientNum(function (data) {
                if (data != ""){
                    var tempdata = data.statistics;
                    if(data.totalCount==0){
                        drawEmptyPie("According_client");
                        return;
                    }
                    else{
                        var datas = data.statistics;
                        var type = [
                            {name:getRcString('apClientType')[0],value : (datas[0].count==0)?undefined:datas[0].count},
                            {name:getRcString('apClientType')[1],value : (datas[1].count==0)?undefined:datas[1].count},
                            {name:getRcString('apClientType')[2],value : (datas[2].count==0)?undefined:datas[2].count},
                            {name:getRcString('apClientType')[3],value : (datas[3].count==0)?undefined:datas[3].count},
                            {name:getRcString('apClientType')[5],value : (datas[4].count==0)?undefined:datas[4].count},
                            {name:getRcString('apClientType')[6],value : (datas[5].count==0)?undefined:datas[5].count},
                            {name:getRcString('apClientType')[7],value : (datas[6].count==0)?undefined:datas[6].count},
                            {name:getRcString('apClientType')[8],value : (datas[7].count==0)?undefined:datas[7].count}
                        ];
                        terminal(type);
                    }
                }
            });
        }
        
        function getTypeNum()
        {
            http_getApType(function (data) {
                if (data != ""){
                    if(data.apList.length==0){
                        drawEmptyPie("ApType_pie");
                        return;
                    }
                    else{
                        var datas = data.apList;
                        var aType2 = [
                            {   name:getRcString('apType')[0],
                                value:(datas[0].ApCount==0)?undefined:datas[0].ApCount,
                                CreateMethod:datas[0].CreateMethod
                            },
                            {
                                name:getRcString('apType')[1],
                                value:(datas[1].ApCount==0)?undefined:datas[1].ApCount,
                                CreateMethod:datas[1].CreateMethod
                            },
                            {
                                name:getRcString('apType')[2],
                                value:(datas[2].ApCount==0)?undefined:datas[2].ApCount,
                                CreateMethod:datas[2].CreateMethod
                            },
                            {
                                name:getRcString('apType')[3],
                                value:(datas[3].ApCount==0)?undefined:datas[3].ApCount,
                                CreateMethod:datas[3].CreateMethod
                            }
                        ];
                        ApType_pie(aType2);
                    }
                }
            });
        }
        
        function http_getApCountByStatus(cBack)
        {
            $http({
                method:url_ApStatus.method,
                url:url_ApStatus.url,
                params:{'devSN':$scope.sceneInfo.sn}
            }).success(function(data){
                cBack(data);
            }).error(function(data){
                cBack("");
            });
        }

        // function http_getApModel(cBack)
        // {
        //     $http({
        //         method:url_ApModel.method,
        //         url:url_ApModel.url,
        //         params:{'devSN':$scope.sceneInfo.sn}
        //     }).success(function(data){
        //         cBack(data);
        //     }).error(function(data){
        //         cBack("");
        //     });
        // }
        
        function http_getClientNum(cBack)
        {
            $http({
                method:url_ApClient.method,
                url:url_ApClient.url,
                params:{'devSN':$scope.sceneInfo.sn}
            }).success(function(data){
                cBack(data);
            }).error(function(data){
                cBack("");
            });
        }
        
        function http_getApType(cBack)
        {
            $http({
                method:url_ApType.method,
                url: url_ApType.url,
                params:{'devSN':$scope.sceneInfo.sn}
            }).success(function(data){
                cBack(data);
            }).error(function(data){
                cBack("");
            });
        }
        //init
        function init(){
            getApCount();
          //  getApModel();
            getClientNum();
            getTypeNum();
        };

        init();
    }]
});

