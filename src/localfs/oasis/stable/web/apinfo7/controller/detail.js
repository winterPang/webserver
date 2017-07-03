define(["utils", "echarts", "angular-ui-router"], function (Utils, echarts,$state) {
    return ["$scope", "$http", "$alertService", "$state", function ($scope, $http, $alert,$state) {
        $scope.info = {
            curChoose: "global",
            branchList: [],
            curBranch: "",
            clickRadio: function () {
                if (g_oInfo.curChoose === "global") {
                    g_oInfo.curBranch = "";
                }
                if (g_oInfo.curChoose === "branch") {
                    g_oInfo.curBranch = g_oInfo.branchList[0];
                }
                init();
            },
            selectBranch: init,
            apCnt: null
        };
        $scope.opts = {};

        var g_oInfo = $scope.info;
        var g_oOpts = $scope.opts;

        const oClientType = getRcText("client_type");
        const oAPbyClientHeader = getRcText("apbyclient_header");
        const oAPbyBranchHeader = getRcText("apbybranch_header");

        function getRcText (propName) {
            return Utils.getRcString("apinfo_rc", propName).split(',');
        }

        function isAddBranch (reqParams) {
            if (g_oInfo.curChoose === "branch") {
                reqParams.params.branch = g_oInfo.curBranch;
            }
            return reqParams;
        }
        // top radioGrp select branch
        $http({
            method: "GET",
            url: "/v3/apmonitor/getBranchList",
            params: {devSN: $scope.sceneInfo.sn}
        }).success(function (data) {
            g_oOpts.branchSelector = {
                allowClear: false
            };
            angular.forEach(data.branchList, function (value) {
                g_oInfo.branchList.push(value.branchName);
            });
            g_oInfo.curBranch = g_oInfo.branchList[0];
        });

        $scope.goMore = function () {
            if (g_oInfo.curChoose == "global") {
                var sName = "";
            } else {
                var sName = g_oInfo.curBranch;
            }
            g_oInfo.curBranch = "";
            $state.go("^.apinfo7_ap_detail", {
                name: sName
            });
        };


        // ap count
        function getApCnt () {
            var reqParams = {
                method: "GET",
                url: "/v3/apmonitor/getApCountByStatus",
                params: {devSN: $scope.sceneInfo.sn}
            };
            $http(isAddBranch(reqParams)).success(function (data) {
                var oStatistic = data.ap_statistic;
                g_oInfo.apCnt = {
                    online: oStatistic.online,
                    offline: oStatistic.offline,
                    other: oStatistic.other
                };
            });
        }

        // ap model
        function drawApModel (model, data) {
            var nEnd = parseInt( 700 / model.length ) - 1;
            var nWidth =523;
            var totalchart =echarts.init(document.getElementById('APModel_bar'));

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
                        data : model,
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
                        data: data,
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

        function getApModel () {
            var reqParams = {
                method: "GET",
                url: "/v3/apmonitor/getApCountByModel",
                params: {devSN: $scope.sceneInfo.sn}
            };
            $http(isAddBranch(reqParams)).success(function (data) {
                var aNames = [];
                var aValues = [];
                if (data.apList.length == 0) {
                    aNames = [getRcText("notap")[0]];
                    aValues = [{name: getRcText("notap")[0], value: 0}];
                } else {
                    angular.forEach(data.apList, function (value) {
                        aNames.push(value.ApModel);
                        aValues.push({
                            name: value.ApModel,
                            value: value.ApCount
                        });
                    });
                }
                drawApModel(aNames, aValues);
            });
        }

        // client
        function drawEmptyPie(jEle) {
            var oTheme={color : ["rgba(216, 216, 216, 0.75)"]};
            var piechart =echarts.init(document.getElementById(jEle),oTheme);
            var option = {
                height:245,
                calculable : false,
                series : [
                    {
                        type:'pie',
                        radius : '65%',
                        center: ['25%', '35%'],
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

        function drawClientPie (aData) {
            var oTheme={
                color: ['#E7E7E9','#4fcff6','#78cec3','#4EC1B2','#fbceb1','#f9ab77','#ff9c9e','#fe808b']
            };
            var piechart =echarts.init(document.getElementById("According_client"),oTheme);

            function clickEvent(param){
                $scope.$broadcast('show#apInfoByClient');
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

                var sUrl = "/v3/apmonitor/getapstaticbyclientnumforaplist?devSN="+$scope.sceneInfo.sn
                    +"&clientNumLeft="+clientNumLeft
                    +"&clientNumRight="+clientNumRight;

                if (g_oInfo.curChoose == "branch") {
                    sUrl = sUrl + "&branch=" + g_oInfo.curBranch;
                }

                $scope.$broadcast('refresh#apInfoByClient',{url:sUrl});
            }

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
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient : 'vertical',
                    x:'25%',
                    y:'18%',
                    data:oClientType
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

        function getClientCnt () {
            var reqParams = {
                method: "GET",
                url: "/v3/stamonitor/statisticaplist_byclientcount",
                params: {devSN: $scope.sceneInfo.sn}
            };
            $http(isAddBranch(reqParams)).success(function (data) {
                var aClientCnt = data.statistics;
                if(data.totalCount === 0){
                    return drawEmptyPie("According_client");
                } else {
                    var type = [
                        {name: oClientType[0], value: (aClientCnt[0].count==0)?undefined:aClientCnt[0].count},
                        {name: oClientType[1], value: (aClientCnt[1].count==0)?undefined:aClientCnt[1].count},
                        {name: oClientType[2], value: (aClientCnt[2].count==0)?undefined:aClientCnt[2].count},
                        {name: oClientType[3], value: (aClientCnt[3].count==0)?undefined:aClientCnt[3].count},
                        {name: oClientType[5], value: (aClientCnt[4].count==0)?undefined:aClientCnt[4].count},
                        {name: oClientType[6], value: (aClientCnt[5].count==0)?undefined:aClientCnt[5].count},
                        {name: oClientType[7], value: (aClientCnt[6].count==0)?undefined:aClientCnt[6].count},
                        {name: oClientType[8], value: (aClientCnt[7].count==0)?undefined:aClientCnt[7].count}
                    ];

                    drawClientPie(type);
                }
            });
        }

        g_oOpts.APByClientModal = {
            mId:'apInfoByClient',
            title:getRcText("apbyclient_title")[0] ,
            autoClose: true ,
            showCancel: true ,
            showOk:false,
            modalSize:'lg',
            showHeader:true,
            showFooter:true,
            showClose:true
        };

        g_oOpts.APByClientList = {
            tId:'apInfoByClient',
            method:"post",
            contentType:'application/json',
            dataType:'json',
            showPageList: false,
            apiVersion:'v3',
            searchable:true,
            sidePagination:'server',
            dataField:'apList',
            totalField:'totalCount',
            columns: [
                {searcher:{},sortable: true, field: 'macAddr', title: oAPbyClientHeader[0]},
                {searcher:{},sortable: true, field: 'ipv4Addr', title:oAPbyClientHeader[1]},
                {searcher:{},sortable: true, field: 'ipv6Addr', title:oAPbyClientHeader[2]},
                {searcher:{},sortable: true, field: 'apName', title: oAPbyClientHeader[3]},
                {
                    searcher:{
                        type: "select",
                        valueField: "value",
                        textField: "text",
                        data: [{value: 0, text: getRcText("aptype")[0]},{value: 1, text: getRcText("aptype")[1]}]
                    },
                    sortable: true, field: 'apType', title: oAPbyClientHeader[4],
                    formatter: function (value) {return getRcText("aptype")[value];}
                }
            ]
        };

        // branch list
        g_oOpts.branchList = {
            tId: "branch",
            showCheckBox: false,
            showRowNumber: false,
            pageSize: 4,
            showPageList: false,
            searchable: true,
            columns: [
                {
                    title: getRcText("branch_header")[0],
                    field: "branchName",
                    sortable: true,
                    searcher: {type: "text"}
                },
                {
                    title: getRcText("branch_header")[1],
                    field: "apCount",
                    sortable: true,
                    formatter: function (value) {
                        if (value == 0) {
                            return value;
                        } else {
                            return "<a class='list-link'>" + value + "</a>";
                        }
                    },
                    searcher: {type: "text"}
                }
            ],
            onClickCell: function (field, value, row, $ele) {
                if (field == "apCount" && value != 0) {
                    $scope.$broadcast("show#APByBranch");
                    $scope.$broadcast("refresh#APByBranch", {
                        url: "/v3/apmonitor/getaplist_page?devSN="
                        + $scope.sceneInfo.sn + "&branch=" + row.branchName
                    });
                }
            }
        };

        function getBranchList () {
            var reqParams = {
                method: "GET",
                url: "/v3/apmonitor/getBranchList",
                params: {devSN: $scope.sceneInfo.sn}
            };
            $http(isAddBranch(reqParams)).success(function (data) {
                $scope.$broadcast("load#branch", data.branchList);
            });
        }

        g_oOpts.APByBranchModal = {
            mId:'APByBranch',
            title:getRcText("apbyclient_title")[0] ,
            autoClose: true ,
            showCancel: true ,
            showOk:false,
            modalSize:'lg',
            showHeader:true,
            showFooter:true,
            showClose:true
        };
        g_oOpts.APByBranchList = {
            tId:'APByBranch',
            method:"post",
            contentType:'application/json',
            dataType:'json',
            showPageList: false,
            apiVersion:'v3',
            searchable:true,
            sidePagination:'server',
            dataField:'apList',
            totalField:'count_total',
            columns: [
                {searcher:{},sortable: true, field: 'apName', title: oAPbyBranchHeader[0]},
                {searcher:{},sortable: true, field: 'macAddr', title:oAPbyBranchHeader[1]},
                {searcher:{},sortable: true, field: 'ipv4Addr', title:oAPbyBranchHeader[2]},
                {searcher:{},sortable: true, field: 'ipv6Addr', title: oAPbyBranchHeader[3]}
            ]
        };

        // aptype
        function drawAPTypePie (data) {
            var oTheme={
                color: ['#4EC1B2','#78CEC3','#D2D2D2','#E7E7E9','#ABD6F5','#86C5F2','#63B4EF','#3DA0EB','#1683D3','#136FB3']
            };

            var piechart =echarts.init(document.getElementById("ApType_pie"),oTheme);

            function clickEvent(param){
                $scope.$broadcast('show#apInfoByType');

                var sUrl = "/v3/apmonitor/getApCountByMethodForApList?devSN="+$scope.sceneInfo.sn
                    +"&CreateMethod="+param.data.CreateMethod;

                if (g_oInfo.curChoose == "branch") {
                    sUrl = sUrl + "&branch=" + g_oInfo.curBranch;
                }

                $scope.$broadcast('refresh#apInfoByType',{
                    url:sUrl
                });
            }

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
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient : 'vertical',
                    x :'25%',
                    y:'18%',
                    // padding: 260,
                    data:getRcText('ap_type')/*['在线的手工AP','自动AP','离线的手工AP','未认证的AP']*/
                },
                calculable : false,
                series : [
                    {
                        type:'pie',
                        radius : ['37%','55%'],
                        center: ['80%', '35%'],
                        itemStyle : dataStyle,
                        data:data
                    }
                ]

            };
            var oTheme={
                color: ['#4EC1B2','#78CEC3','#D2D2D2','#E7E7E9','#ABD6F5','#86C5F2','#63B4EF','#3DA0EB','#1683D3','#136FB3']
            };

            piechart.setOption(option);
        }

        function getAPType () {
            var reqParams = {
                method: "GET",
                url: "/v3/apmonitor/getApCountByMethod",
                params: {devSN: $scope.sceneInfo.sn}
            };
            $http(isAddBranch(reqParams)).success(function (data) {
                var datas = data.apList;
                var nApCnt = datas[0].ApCount + datas[1].ApCount + datas[2].ApCount + datas[3].ApCount;
                if(!nApCnt){
                    return drawEmptyPie("ApType_pie");
                } else {
                    var datas = data.apList;
                    var aType = [
                        {   name:getRcText('ap_type')[0],
                            value:(datas[0].ApCount==0)?undefined:datas[0].ApCount,
                            CreateMethod:datas[0].CreateMethod
                        },
                        {
                            name:getRcText('ap_type')[1],
                            value:(datas[1].ApCount==0)?undefined:datas[1].ApCount,
                            CreateMethod:datas[1].CreateMethod
                        },
                        {
                            name:getRcText('ap_type')[2],
                            value:(datas[2].ApCount==0)?undefined:datas[2].ApCount,
                            CreateMethod:datas[2].CreateMethod
                        },
                        {
                            name:getRcText('ap_type')[3],
                            value:(datas[3].ApCount==0)?undefined:datas[3].ApCount,
                            CreateMethod:datas[3].CreateMethod
                        }
                    ];
                    drawAPTypePie(aType);
                }
            });
        }

        g_oOpts.APByTypeModal = {
            mId:'apInfoByType',
            title:getRcText("apbyclient_title")[0] ,
            autoClose: true ,
            showCancel: true ,
            showOk:false,
            modalSize:'lg',
            showHeader:true,
            showFooter:true,
            showClose:true
        };

        g_oOpts.APByTypeList = {
            tId:'apInfoByType',
            method:"post",
            contentType:'application/json',
            dataType:'json',
            showPageList: false,
            apiVersion:'v3',
            searchable:true,
            sidePagination:'server',
            dataField:'apList',
            totalField:'totalCount',
            columns: [
                {searcher:{},sortable: true, field: 'macAddr', title: oAPbyClientHeader[0]},
                {searcher:{},sortable: true, field: 'ipv4Addr', title:oAPbyClientHeader[1]},
                {searcher:{},sortable: true, field: 'ipv6Addr', title:oAPbyClientHeader[2]},
                {searcher:{},sortable: true, field: 'apName', title: oAPbyClientHeader[3]},
                {
                    searcher:{
                        type: "select",
                        valueField: "value",
                        textField: "text",
                        data: [{value: 0, text: getRcText("aptype")[0]},{value: 1, text: getRcText("aptype")[1]}]
                    },
                    sortable: true, field: 'apType', title: oAPbyClientHeader[4],
                    formatter: function (value) {return getRcText("aptype")[value];}
                }
            ]
        };

        function init () {
            getApCnt();
            getApModel();
            getClientCnt();
            getBranchList();
            getAPType();
        }

        init();









    }];
});