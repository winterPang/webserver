define(['echarts','utils', 'common9/devices'], function(ecahrts, Utils,Dev) {
    return ['$scope', '$http','$state','$stateParams', function($scope, $http,$state,$stateParams){

        function getRcString(attrName){
            return Utils.getRcString("dashboard_rc",attrName);
        }
       
        var getApGroupNameList_URL = Utils.getUrl('POST','','/cloudapgroup','/init/branchOther5/upload_apgroup.json');        
        var g_topId = "";
        var g_apArray = [];
        var devSNPromise = Dev.getAlias($stateParams.nasid);

        getApGroupNameList();
        
        //获取组名
        function getApGroupNameList()
        {
            $http({
                url:getApGroupNameList_URL.url,
                method:getApGroupNameList_URL.method,
                data:{
                    Method:"getCloudApgroupNameList",
                    query:{
                        userName:$scope.userInfo.user,
                        nasId:$scope.sceneInfo.nasid,
                    }
                }
            }).success(function(data){
                if(data.retCode == 0)
                {
                    var apInfo = data.message;
                    g_topId = apInfo.topId;
                    angular.forEach(apInfo.subGroupList,function(v,k,array){
                        var apObj = {};
                        apObj.groupId = v.groupId;
                        apObj.alias = v.alias;
                        g_apArray.push(apObj);
                    })
                    $scope.branchLists = g_apArray;
                    getApStatusCountByCloudGroup(g_topId);
                }
            }).error(function(err){
                console.log(err);
            })
        }

        //选择总部 or 分组
        $scope.selFilter = function(select)
        {
            if(select == "headquarters")
            {
                getApStatusCountByCloudGroup(g_topId);
            }
            else if(select == "branch")
            {
                $scope.branchSel = $scope.branchLists[0];
                var groupID = $scope.branchSel.groupId;
                var gropuInfo = {};
                gropuInfo.topID = g_topId;
                gropuInfo.groupID = groupID;
                $scope.group_info = gropuInfo;
                getApStatusCountByCloudGroup(groupID);
            }
        }

        //分组 chenge 事件
        $scope.selectGroup = function()
        {
            var groupID = $scope.branchSel.groupId;
            var gropuInfo = {};
            gropuInfo.topID = g_topId;
            gropuInfo.groupID = groupID;
            $scope.group_info = gropuInfo;
            getApStatusCountByCloudGroup(groupID);
        }

        $scope.template = {
            filterBranch:"headquarters",
        }

        function getApStatusCountByCloudGroup(changeApgroup){
            $('#total a.time-link').removeClass('active');
            $('#total a[value = '+1+']').addClass('active'); 
            $scope.chouseUrl = function(mode){
                if(mode == 1){
                    para = "clientstat_cloud_yesterday";
                }
                else if(mode == 2){
                    para = "clientstat_cloud_lastweek";
                }
                else if(mode == 3){
                    para = "clientstat_cloud_lastmonth";
                }

                $http({
                    url:'/v3/stamonitor/monitor',
                    method:'post',
                    data:{
                        method:para,
                        param:{
                            groupId:changeApgroup,
                            dataType:""                                              
                        }   
                    }   
                }).success(function(data){
                    $scope.g_AllUser = [];
                    //$scope.g_newUser = [];
                    $scope.g_onlineTime = [];
                    $scope.g_Time = [];
                    $scope.newlength = data.response.length; 
                    for (var i = 0; i < $scope.newlength; i++) {
                        //$scope.g_newUser.push( data.response[i].newCount);
                        $scope.g_AllUser.push( data.response[i].totalCount);
                        $scope.g_onlineTime.push( data.response[i].time);    
                    }
                    for (var j = 0 ; j < $scope.newlength ; j++){
                        if (mode == 1){
                            $scope.g_Time.push( new Date ($scope.g_onlineTime[j]).getHours() + ":" + "00");
                        }
                        else{
                            $scope.g_Time.push( new Date(new Date($scope.g_onlineTime[j])-1000).getMonth() + 1 + "-" + new Date(new Date($scope.g_onlineTime[j])-1000).getDate()  );
                        }
                    }
                    $scope.myechart($scope.g_AllUser,$scope.g_Time);
                }).error(function(){

                })
            }

            $scope.clickTest = function(e){
                $('#total a.time-link').removeClass('active');
                var value = e.target.getAttribute('value');
                $('#total a[value = '+value+']').addClass('active');
                $scope.chouseUrl(value);
            }

            $scope.chouseUrl(1);  

            $scope.myechart = function(allcouver,time){
                var customerChart=echarts.init(document.getElementById('loginechar'));
                var customerOption = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        itemWidth:8,
                        data:[getRcString("ap_info_type")],
                    },
                    grid :
                    {
                        x:40, y:40, x2:30, y2:25,
                        borderColor : '#fff'
                    },
                    xAxis: [
                        {
                            boundaryGap: true,
                            splitLine:false,
                            axisLine  : {
                                show:true ,
                                lineStyle :{color: '#9da9b8', width: 1}
                            },
                            axisTick:{show:false},
                            
                            type: 'category',
                            data: time
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: getRcString("ap_info_group"),
                            interval: 50,
                            axisTick:{show:false},
                            splitLine:{
                                show:true,
                                textStyle:{color: '#c9c4c5', fontSize:"1px", width:4},
                                lineStyle: {
                                    color: ['#e7e7e9']
                                }
                            },
                            axisLine  : {
                                show:true ,
                                lineStyle :{color: '#9da9b8', width: 1}
                            },
                            axisLabel: {
                                show:true,
                                textStyle:{color: '#9da9b8', fontSize:"12px", width:2},
                                formatter: '{value}'
                            }
                        }
                    ],
                    series: [
                        // {
                        //     name:'终端数',
                        //     type:'bar',
                        //     barCategoryGap: '40%',
                        //     itemStyle : {
                        //         normal: {
                        //             label : {
                        //                 show: false,
                        //                 position: 'insideTop',
                        //                 formatter: function(oData){
                        //                     return oData.value;
                        //                 }
                        //             },
                        //             color:'#69C4C5'
                        //         }
                        //     },
                        //     data:newcouver
                        // },
                        {
                            name:getRcString("ap_info_type"),
                            type:'line',
                            barCategoryGap: '40%',
                            itemStyle : {
                                normal: {
                                    color:'#F9AB6B'
                                }
                            },
                            data:allcouver
                        }
                    ]
                };
                customerChart.setOption(customerOption);
            } 

            $http({
                url:'/apmonitor/getTop5ApTransmitTrafficByCloudGroup',
                method:'get',
                params:{
                    topId:g_topId,
                    midId:changeApgroup||""
                }
            }).success(function(data){
                devSNPromise.done(function (alias) {
                    $scope.$broadcast('load#aptraffic',$.map(data.ApTransmitTrafficList, function (a) {
                        a.apName = alias[a.apSN]||a.apName;
                        return a;
                    }));
                });
            })

            $scope.apFlowTable = {
                tId:'aptraffic',
                pageSize:5,
                showPageList:false,
                columns:[
                    {sortable:true,field:'apName',title:getRcString("ap_info")},
                    {sortable:true,field:'transmitTraffic',title:getRcString("client_info")}
                ],
            }

            $http({
                url:'/v3/stamonitor/monitor',
                method:'post',
                data:{ 
                    method:"apstatic_cloud_clientnum",
                    param:{
                        topId:g_topId,
                        groupId:changeApgroup
                    }    
                }
            }).success(function(data){
                if (data != "") {
                    var tempdata = data.response;
                    if (data.response.totalCount == 0) {
                        piechart.setOption(grayOption);
                    }
                    else {
                        var datas = data.response.statistics;
                        var type = [
                            {
                                name: getRcString('apClient_Type').split(",")[0],
                                value: (datas[0].count == 0) ? undefined : datas[0].count
                            },
                            {
                                name: getRcString('apClient_Type').split(",")[1],
                                value: (datas[1].count == 0) ? undefined : datas[1].count
                            },
                            {
                                name: getRcString('apClient_Type').split(",")[2],
                                value: (datas[2].count == 0) ? undefined : datas[2].count
                            },
                            {
                                name: getRcString('apClient_Type').split(",")[3],
                                value: (datas[3].count == 0) ? undefined : datas[3].count
                            },
                            {
                                name: getRcString('apClient_Type').split(",")[5],
                                value: (datas[4].count == 0) ? undefined : datas[4].count
                            },
                            {
                                name: getRcString('apClient_Type').split(",")[6],
                                value: (datas[5].count == 0) ? undefined : datas[5].count
                            },
                            {
                                name: getRcString('apClient_Type').split(",")[7],
                                value: (datas[6].count == 0) ? undefined : datas[6].count
                            },
                            {
                                name: getRcString('apClient_Type').split(",")[8],
                                value: (datas[7].count == 0) ? undefined : datas[7].count
                            }
                        ];
                        $scope.clentEchat(type);
                    }
                }
            })

            var piechart = echarts.init(document.getElementById("According_client"));
            $scope.clentEchat = function(aData){               
                var option = {
                    height: 245,
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        x: '5%',
                        y: '18%',
                        data: ['0', '1~10', '11~20', '21~40', "", '41~60', '61~80', '81~100', '101以上']
                    },
                    calculable: false,
                    series: [
                        {
                            type: 'pie',
                            radius: ['33%', '50%'],
                            center: ['62%', '35%'],
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: false,
                                        position: 'inner',
                                        formatter: '{d}%'
                                    },
                                    labelLine: {
                                        show: false
                                    },
                                    borderColor: '#FFF',
                                    borderWidth: 1
                                }
                            },
                            data: aData
                        }
                    ],
                    color: ['#E7E7E9', '#4fcff6', '#78cec3', '#4EC1B2', '#fbceb1', '#f9ab77', '#ff9c9e', '#fe808b']
                };
                piechart.setOption(option);
            }

            var grayOption = {
                height: 245,
                calculable: false,
                series: [
                    {
                        type: 'pie',
                        radius: '65%',
                        center: ['50%', '35%'],
                        itemStyle: {
                            normal: {
                                // borderColor:"#FFF",
                                // borderWidth:1,
                                labelLine: {
                                    show: false
                                },
                                label: {
                                    position: "inner"
                                }
                            }
                        },
                        data: [{name: 'N/A', value: 1}]
                    }
                ],
                color: ["rgba(216, 216, 216, 0.75)"]
            };

            $http({
                url:'/ssidmonitor/getssidinfobriefbyfatap',
                method:'get',
                params:{
                    devSN:$scope.sceneInfo.sn,
                    topName:g_topId,
                    midName:changeApgroup||""
                }
            }).success(function(data){
                $scope.$broadcast('load#options',data.ssidList);
            })

            $scope.option = {
                tId:'options',
                pageSize:5,
                searchable:true,
                showPageList:false,
                columns:[
                    {sortable:true,field:'stName',title:getRcString("ap_info_client").split(',')[0],searcher:{}},
                    {sortable:true,field:'ssidName',title:getRcString("ap_info_client").split(',')[1],searcher:{}},
                    {sortable:true,field:'status',title:getRcString("ap_info_client").split(',')[2],
                        formatter: function(value, row, index) {
                            var sStatus = getRcString("group_no");
                            if (value == 1) {
                                sStatus= getRcString("group_ok");
                            }
                            return sStatus;
                        },
                        searcher: {
                            type: "select",
                            textField: "statusText",
                            valueField: "statusValue",
                            data: [
                                {statusText: getRcString("group_ok"),statusValue:1},
                                {statusText: getRcString("group_no"),statusValue:2}
                            ]
                        }
                    },
                    {sortable:true,field:'clientCount',title:getRcString("ap_info_client").split(',')[3],searcher:{}},
                    {sortable:true,field:'ApCnt',title:getRcString("ap_info_client").split(',')[4],searcher:{}}
                    //{sortable:true,field:'ApGroupCnt',title:getRcString("ap_info_client").split(',')[5],searcher:{}}
                ],
            }

        }

    }]
});

