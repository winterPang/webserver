define(['jquery','echarts','utils','angular-ui-router','bsTable','apinfo2/directive/traffictop5moredetails','apinfo2/directive/userstop5moredetails'], function($$,ecahrts, Utils) {
    return ['$scope', '$http', '$alertService', '$state', function($scope, $http,$){

        // get url 
        var url_ApStatus = Utils.getUrl('GET','','/apmonitor/getApCountByStatus','/init/apinfo2/get_apstatus_count.json');
        var url_ApgroupList = Utils.getUrl('GET','','/apmonitor/getApCountAndDescByGroup','/init/apinfo2/get_apGroup.json');
        var url_ApModel = Utils.getUrl('GET','','/apmonitor/getApCountByModel','/init/apinfo2/get_apmodel.json');
        var url_ApClient = Utils.getUrl('GET','','/stamonitor/getapstaticbyclientnum','init/apinfo2/get_apclientnum.json');
        var url_ApType = Utils.getUrl('GET','','/apmonitor/getApCountByMethod','/init/apinfo2/get_aptype.json');
        var url_ApInfoByGroup = Utils.getUrl('POST','','/apmonitor/aplistbygroup','/init/apinfo2/get_aptype.json');
        var url_ApInfoByType = Utils.getUrl('POST','','/apmonitor/getApCountByMethodForApList','/init/apinfo2/get_aptype.json');
        var url_ApInfoByClient = Utils.getUrl('POST','','/apmonitor/getApListByClientNum','/init/apinfo2/get_aptype.json');
        var url_ApTransmitTraffic = Utils.getUrl('GET','','/apmonitor/getTop5ApTransmitTraffic','null.json');
        var url_ApStationCount = Utils.getUrl('GET','','/apmonitor/getTop5ApStationCount','null.json');

        //tool Function
        function getRcString(attrName){
            return Utils.getRcString("apinfo_rc",attrName).split(',');
        }

        $scope.ApGroup_list = {
            tId:'grouplist',
            url:url_ApgroupList.url,
            contentType:'application/json',
            dataType:'json',
            //height: 270,
            paginationSize: "sm",
            pageSize:5,
            pageList:[5,10],
            dataField:'apList',
            queryParams:function(params){
                params.devSN=$scope.sceneInfo.sn;
                return {devSN: $scope.sceneInfo.sn};
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
            //paginationPreText: '&lsaquo;',   //    分页条上一页显示的文本
            //paginationNextText: '&rsaquo;',  //    分页条下一页显示的文本
            //paginationFirstText: '&laquo;',  //    第一页显示的文本  默认是两个小于号
            //paginationLastText: '&raquo;',   //    最后一页显示的文本  默认是两个大于号
            //paginationSize: 'sm',        //    分页条显示大小，normal正常样式，sm是只显示上一页下一页第一页最后一页
            showPageList: false
        };

        $scope.ApTransmitTraffic_list = {
            tId:'apTransmitTraffic',
            url:url_ApTransmitTraffic.url,
            contentType:'application/json',
            dataType:'json',
            // onlyInfoPagination: "true",
            showRowNumber: true,
            paginationSize: "sm",
            pagination: false,
            pageSize:5,
            pageList:[5,10],
            dataField:'ApTransmitTrafficList',
            queryParams:function(params){
                params.devSN=$scope.sceneInfo.sn;
                return params;
            },
            columns: [
                {field: 'apName', title: getRcString("ApTransmitTraffic_header")[0]},
                {
                    field: 'transmitTraffic',
                    title: getRcString("ApTransmitTraffic_header")[1],
                    formatter: function (value, rows) {
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
                }
            ],
            //paginationPreText: '&lsaquo;',   //    分页条上一页显示的文本
            //paginationNextText: '&rsaquo;',  //    分页条下一页显示的文本
            //paginationFirstText: '&laquo;',  //    第一页显示的文本  默认是两个小于号
            //paginationLastText: '&raquo;',   //    最后一页显示的文本  默认是两个大于号
            //paginationSize: 'sm',        //    分页条显示大小，normal正常样式，sm是只显示上一页下一页第一页最后一页
            showPageList: false
        };

        $scope.ApStationCount_list = {
            tId:'ApStationCountlist',
            url:url_ApStationCount.url,
            contentType:'application/json',
            dataType:'json',
            //onlyInfoPagination: "true",
            showRowNumber: true,
            paginationSize: "sm",
            pagination: false,
            //height: 270,
            pageSize:5,
            pageList:[5,10],
            dataField:'apStationList',
            queryParams:function(params){
                params.devSN=$scope.sceneInfo.sn;
                return {devSN: $scope.sceneInfo.sn};
            },
            columns: [
                {field: 'apName', title: getRcString("ApStationCount_header")[0]},
                {field: 'clientcount', title: getRcString("ApStationCount_header")[1]}
            ],
            //paginationPreText: '&lsaquo;',   //    分页条上一页显示的文本
            //paginationNextText: '&rsaquo;',  //    分页条下一页显示的文本
            //paginationFirstText: '&laquo;',  //    第一页显示的文本  默认是两个小于号
            //paginationLastText: '&raquo;',   //    最后一页显示的文本  默认是两个大于号
            //paginationSize: 'sm',        //    分页条显示大小，normal正常样式，sm是只显示上一页下一页第一页最后一页
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
                //{searcher:{},sortable: true, field: 'apModel', title:  getRcString("ap_info_group")[1]},
                {searcher:{},sortable: true, field: 'apSN', title: getRcString("ap_info_group")[2]},
                //{searcher:{},sortable: true, field: 'macAddr', title:  getRcString("ap_info_group")[3]},
            ]
        };

        $scope.apInfoByGroupOption ={
            mId:'apInfoByGroup',
            title:getRcString("aplist_title")[0] ,
            autoClose: true ,
            showCancel: true ,
            cancelText: getRcString("close")[0],
            showOk:false,
            modalSize:'lg' ,
            showHeader:true   ,
            showFooter:true  ,
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
                //{searcher:{},sortable: true, field: 'apModel', title:  getRcString("ap_info_type")[1]},
                {searcher:{},sortable: true, field: 'clientCount', title: getRcString("ap_info_type")[2]}
            ]
        };

        $scope.apInfoByClientOption ={
            mId:'apInfoByClient',
            title:getRcString("aplist_title") ,
            autoClose: true ,
            showCancel: true ,
            cancelText: getRcString("close")[0],
            showOk:false,
            modalSize:'lg' ,
            showHeader:true   ,
            showFooter:true  ,
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
            title:getRcString("aplist_title") ,
            autoClose: true ,
            showCancel: true ,
            showOk:false,
            modalSize:'lg' ,
            showHeader:true   ,
            showFooter:true  ,
            showClose:true
        }


        //2个top5排行  表变成echarts
        //jkf6049-----START
        
        //2个top5的ajax请求
        //traffic
        top5Ajax("getTop5ApTransmitTraffic?devSN="+$scope.sceneInfo.sn+"&order=asc","traffic");
        //users
        top5Ajax("getTop5ApStationCount?devSN="+$scope.sceneInfo.sn,"users");

        //ajax请求Fun
        function top5Ajax(url,flag){
            $http.get("/v3/apmonitor/"+url, {})
            .success(function (data, status, header, config) {
                // data数据处理
                dataDuteAndDrawEcharts(data,flag);

            })
            .error(function (data, status, header, config) {     
                $alert.msgDialogError(getRcText("getDataFailed"));
            });
        }                                     
          
        //数据处理  and  echarts传参 Fun
        function dataDuteAndDrawEcharts(data,flag){

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
                //trafficValue重新变换单位Fun2
                function valueTransfer2(value) {
                    var nKB = 1,
                        nMB = 1024 * nKB,
                        nGB = 1024 * nMB,
                        nTB = 1024 * nGB;
                    if (value >= nTB) {
                        return (value / nTB).toFixed(2);
                    } else if (value >= nGB) {
                        return (value / nGB).toFixed(2);
                    } else if (value >= nMB) {
                        return (value / nMB).toFixed(2);
                    } else {
                        return (value / nKB).toFixed(2);
                    }
                }
                //trafficValue重新变换单位Fun
                function valueTransfer3(value) {
                    var nKB = 1,
                        nMB = 1024 * nKB,
                        nGB = 1024 * nMB,
                        nTB = 1024 * nGB;
                    if (value >= nTB) {
                        return "/TB";
                    } else if (value >= nGB) {
                        return "/GB";
                    } else if (value >= nMB) {
                        return "/MB";
                    } else {
                        return "/KB";
                    }
                }
                //画EchartsFun
                function cometrueEcharts(forEcharts){
                    // drawEmpty
                    if(forEcharts.xValue.length==0){
                        forEcharts.xValue=[getRcText("meiYou")];
                        forEcharts.yValueShow=[0];
                        forEcharts.yValueShow2=[0];   
                    }
                    console.log(forEcharts);
                    var option2 = {
                        color: ['#4EC1B2'],
                        tooltip : {
                            trigger: 'axis',
                            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                                type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
                            },
                            formatter : function(params){
                                return params[0].name+'</br>'+forEcharts.yDescrip+getRcText("yDescripMaohao")+forEcharts.yValueShow[params[0].dataIndex];
                                                                
                            }
                        },
                        grid: {
                            x:100,y:40,x2:80,y2:60,
                            borderColor:'rgba(0,0,0,0)'
                        },
                        yAxis : [
                            {
                                name:forEcharts.xDescrip,
                                type : 'category',
                                data : forEcharts.xValue,
                                axisTick: {
                                    alignWithLabel: true
                                },
                                splitLine: {
                                    show: false
                                },
                                axisLine: {
                                    show: true,
                                    lineStyle: { color: '#9da9b8', width: 1 }
                                },
                            }
                        ],
                        xAxis : [
                            {
                                name:forEcharts.yDescrip+forEcharts.yValueShow3,
                                type : 'value',
                                width:1,
                                splitLine: {
                                    show: false
                                },
                                axisLine: {
                                    show: true,
                                    lineStyle: { color: '#9da9b8', width: 1 }
                                },
                            }
                        ],
                        series : [
                            {                                
                                type:'bar',
                                barWidth: 15,
                                data:forEcharts.yValueShow2
                            }
                        ]
                    };

                    echarts.init(document.getElementById(forEcharts.echartsId)).setOption(option2);
                }

                //数据处理  and  echarts传参
                //
                
                //
                var forEcharts={};
                forEcharts.echartsId="";
                forEcharts.xValue=[];
                forEcharts.yValue=[];
                forEcharts.yValueShow=[];
                forEcharts.yValueShow2=[];
                forEcharts.yValueShow3="";
                forEcharts.xDescrip="";
                forEcharts.yDescrip="";
                //
                if(flag=="traffic"){
                    // id
                    forEcharts.echartsId="traffic_top5";
                    // 倒序
                    data.ApTransmitTrafficList.reverse();
                    // 各个参数值
                    $$.each(data.ApTransmitTrafficList,function(i,item){
                        forEcharts.xValue.push(item.apName);
                        forEcharts.yValue.push(item.transmitTraffic);    
                        forEcharts.yValueShow.push(valueTransfer(item.transmitTraffic));    
                        forEcharts.yValueShow2.push(valueTransfer2(item.transmitTraffic));    
                        forEcharts.yValueShow3=valueTransfer3(item.transmitTraffic);
                    });
                    forEcharts.xDescrip=getRcText("xTrafficDescrip");
                    forEcharts.yDescrip=getRcText("yTrafficDescrip");

                }else{
                    // id
                    forEcharts.echartsId="users_top5";
                    // 倒序
                    data.apStationList.reverse();
                    // 各个参数值
                    $$.each(data.apStationList,function(i,item){
                        forEcharts.xValue.push(item.apName);
                        forEcharts.yValue.push(item.clientcount);    
                        forEcharts.yValueShow.push(item.clientcount);    
                        forEcharts.yValueShow2.push(item.clientcount);    
                        forEcharts.yValueShow3="";
                    });
                    forEcharts.xDescrip=getRcText("xUsersDescrip");
                    forEcharts.yDescrip=getRcText("yUsersDescrip");
                }
                //
                cometrueEcharts(forEcharts);    
        }  

        //jkf6049-----END
        //2个top5排行  表变成echarts
        



        // 2个top5表，加详情弹框
        // jkf6049 ----START

        //获取HTML变量
        function getRcText (attrName) {
            var sText = Utils.getRcString("apinfo_rc", attrName);
            if(sText.indexOf(',')!=-1){
                return sText.split(',');
            }else{
                return sText;
            }
        }

        // 页面间传参 && modal弹出
        // 
        $scope.canshu={};
        $scope.$on('show.bs.modal#mid_top5MoreModal1',function(){
            $scope.canshu.tempFlag='show';
        });     
        $scope.$on('hide.bs.modal#mid_top5MoreModal1',function(){
            $scope.canshu.tempFlag='hide';
        }); 
        // 
        $scope.canshu2={};  
        $scope.$on('show.bs.modal#mid_top5MoreModal2',function(){
            $scope.canshu2.tempFlag='show';
        });     
        $scope.$on('hide.bs.modal#mid_top5MoreModal2',function(){
            $scope.canshu2.tempFlag='hide';
        }); 


        // 
        $scope.trafficTop5MoreFun1=function(){
            // 
            $scope.canshu.sn=$scope.sceneInfo.sn;
            // $scope.canshu.tempFlag=new Date().getTime();
            $scope.canshu.whichFlag="traffic";            
            // 
            $scope.$broadcast('show#mid_top5MoreModal1'); 
        }
        $scope.trafficTop5MoreFun2=function(){
            // 
            $scope.canshu2.sn=$scope.sceneInfo.sn;
            // $scope.canshu2.tempFlag=new Date().getTime();
            $scope.canshu2.whichFlag="users";        
            // 
            $scope.$broadcast('show#mid_top5MoreModal2'); 
        }
        
        //modal初始化
        pre_bsModal1_initGrid_Fun();
        pre_bsModal2_initGrid_Fun();
        // 
        function pre_bsModal1_initGrid_Fun(){
            var modal_name="top5MoreModal1";
            var mid="mid_top5MoreModal1";
            var title=getRcText("TITLE_dialog")[0];
                
            bsModal_initGrid_Fun(modal_name,mid,title);
        } 
        function pre_bsModal2_initGrid_Fun(){
            var modal_name="top5MoreModal2";
            var mid="mid_top5MoreModal2";
            var title=getRcText("TITLE_dialog")[1];
                
            bsModal_initGrid_Fun(modal_name,mid,title);
        }       
        //
        function bsModal_initGrid_Fun(modal_name,mid,title){
            $scope[modal_name] = {
                mId: mid,
                title: title,
                autoClose: true,
                showCancel: false,
                okText: getRcText("Close1")[1],
                modalSize: "lg", // normal、sm、lg
                showHeader: true,
                showFooter: true,
                okHandler: function (modal, $ele) {
                    
                },
                cancelHandler: function (modal, $ele) {
                },
                beforeRender: function ($ele) {
                }
            };
        } 
                
        // jkf6049 ----END
        // 2个top5表，加详情弹框
        




        function drawEmptyPie(jEle)
        {
            var oTheme={color : ["rgba(216, 216, 216, 0.75)"]};
            var piechart =echarts.init(document.getElementById(jEle),oTheme);
            var option = {
                height:245,
                calculable : false,
                legend: {
                    orient : 'vertical',
                    x:60,
                    y:30,
                    data:getRcString("apClientType")
                },
                series : [
                    {
                        type:'pie',
                        radius : '65%',
                        center: ['65%', '45%'],
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
                        data: [
                            {name:'N/A',value:1},
                            { name:getRcString("apClientType")[0], itemStyle:{normal :{color:'#D2D2D2'}}},
                            { name:getRcString("apClientType")[1], itemStyle:{normal :{color:'#4FC4F6'}}},
                            { name:getRcString("apClientType")[2], itemStyle:{normal :{color:'#4ec1b2'}}},
                            { name:getRcString("apClientType")[3], itemStyle:{normal :{color:'#78CEC3'}}},
                            { name:getRcString("apClientType")[4], itemStyle:{normal :{color:'#F2BC98'}}},
                            { name:getRcString("apClientType")[5], itemStyle:{normal :{color:'#FBCEB1'}}},
                            { name:getRcString("apClientType")[6], itemStyle:{normal :{color:'#FE808B'}}},
                            { name:getRcString("apClientType")[7], itemStyle:{normal :{color:'#FF9C9E'}}}
                        ]
                    }
                ]
            };

            piechart.setOption(option);
        }

        function APModel_bar(aModels,aModelData)
        {
            var nEnd = parseInt(700/aModels.length)-1;
            var nWidth =523;
            //document.getElementById('APModel_bar').parent().width()*0.95;
            //console.debug(angular.element('#APModel_bar').parent().width()*0.95);
            var totalchart = document.getElementById('APModel_bar');
            if (!totalchart) {return;}
            totalchart =echarts.init(totalchart);

            var option = {
                color: ['#4ec1b2'],
                width:nWidth,
                height: 284,
                grid: {
                    x:'20%', y:0, x2:50, y2:25,
                    borderColor: 'rgba(0,0,0,0)'
                },
                tooltip : {
                    show: true,
                    trigger: 'axis',
                    axisPointer:{
                        type : 'line',
                        lineStyle : {
                            color: '#fff',
                            width: 0,
                            type: 'solid'
                        }
                    }
                },
                calculable : false,
                dataZoom : {
                    show : true,
                    realtime : true,
                    start : 0,
                    zoomLock: true,
                    orient: "vertical",
                    width: 10,
                    x: nWidth-10,
                    end: nEnd,
                    backgroundColor:'#F7F9F8',
                    fillerColor:'#BEC7CE',
                    handleColor:'#BEC7CE'
                },
                xAxis : [
                    {
                        type : 'value',
                        splitLine : {
                            show:false,
                            lineStyle: {
                                color: '#373737',
                                type: 'solid',
                                width: 1
                            }
                        },
                        splitArea : {
                            areaStyle : {
                                color: '#174686'
                            }
                        },
                        axisLine  : {
                            show:true,
                            lineStyle :{color: '#373737', width: 1}
                        }
                    }
                ],
                yAxis : [
                    {
                        show: true,
                        type : 'category',
                        boundaryGap : true,
                        data : aModels,
                        axisLabel:{
                            show:false,
                            textStyle: {color:"#80878c"}
                        },
                        splitLine : {
                            show:false
                        },
                        splitArea : {
                            areaStyle : {
                                color: '#174686'
                            }
                        },
                        axisLine  : {
                            show:true,
                            lineStyle :{color: '#373737', width: 1}
                        }
                    }
                ],
                series : [
                    {
                        type:'bar',
                        data: aModelData,
                        itemStyle : {
                            normal: {
                                label : {
                                    show: true,
                                    position: 'insideLeft',
                                    formatter: function(x, y, val){
                                        return x.name;
                                    },
                                    textStyle: {color:"#000"}
                                }
                            },
                            emphasis: {
                                label : {
                                    show: true,
                                    formatter: function(x, y, val){
                                        return x.name;
                                    },
                                    textStyle: {color:"#000"}
                                }
                            }
                        }
                    }
                ]
            };

            totalchart.setOption(option);
        }

        function terminal(aData)
        {
            var oTheme={
                color: ['#D2D2D2','#4FC4F6','#4ec1b2','#78CEC3','#F2BC98','#FBCEB1','#FE808B','#FF9C9E','#89DBFB']
            };
            var piechart = document.getElementById("According_client");
            if (!piechart) {return;}
            piechart =echarts.init(piechart,oTheme);

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
                        show: true,
                        //position: 'inner',
                        formatter: '{d}%'
                    },
                    /*labelLine:{
                        show:false
                    },
                    borderColor:'#FFF',
                    borderWidth:1*/
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
                    x:30,
                    y:30,
                    data:getRcString("apClientType")
                },
                calculable : false,
                series : [
                    {
                        type:'pie',
                        radius : '60%',
                        center: ['58%', '52%'],
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

            var piechart = document.getElementById("ApType_pie");
            if (!piechart) {return;}
            piechart =echarts.init(piechart,oTheme);

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
                    //$scope.unhealth_ap = tempdata.other;
                    $scope.all_ap = parseInt(tempdata.online) + parseInt(tempdata.offline);
                    $scope.online_ap = tempdata.online;
                    $scope.offline_ap = tempdata.offline;
                }
            });
        }

        function getApModel()
        {
            http_getApModel(function (data) {
                if (data != ""){
                    var tempdata = data.apList;
                    var names = [];
                    var values = [];
               
                    for(var i=0; i<tempdata.length; i++){
                        names.push(tempdata[i].ApModel);
                        values.push({name:tempdata[i].ApModel,value:tempdata[i].ApCount});
                    }
                    
                    APModel_bar(names, values);
                }
            });
        }
        
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
                            {name:getRcString('apClientType')[4],value : (datas[4].count==0)?undefined:datas[4].count},
                            {name:getRcString('apClientType')[5],value : (datas[5].count==0)?undefined:datas[5].count},
                            {name:getRcString('apClientType')[6],value : (datas[6].count==0)?undefined:datas[6].count},
                            {name:getRcString('apClientType')[7],value : (datas[7].count==0)?undefined:datas[7].count}
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

        function http_getApModel(cBack)
        {
            $http({
                method:url_ApModel.method,
                url:url_ApModel.url,
                params:{'devSN':$scope.sceneInfo.sn}
            }).success(function(data){
                cBack(data);
            }).error(function(data){
                cBack("");
            });
        }
        
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
            //getApModel();
            getClientNum();
            //getTypeNum();
        }

        init();
    }]
});

