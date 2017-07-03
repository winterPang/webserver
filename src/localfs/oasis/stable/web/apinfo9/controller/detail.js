define(['echarts','utils', 'common9/devices'], function(ecahrts, Utils,Dev) {
    return ['$scope', '$http', '$alertService', '$state','$stateParams', function($scope, $http,$alertService,$state,$stateParams){

        var getApGroupNameList_URL = Utils.getUrl('POST','','/cloudapgroup','/init/branchOther5/upload_apgroup.json');
        var g_topId = "";
        var g_groupId = "";
        var g_nameId = "";
        var g_apObj = {};
        var g_apArray = [];
        var devSNPromise = Dev.getAlias($stateParams.nasid);

        function getRcString(attrName){
            return Utils.getRcString("apinfo_rc",attrName);
        }

        $scope.clickDetail = function(){
            $state.go('scene.content.monitor.apinfo9_ap_detail',{topID:g_topId,groupID:g_groupId,nameID:g_nameId});
        }

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
                    g_apObj[apInfo.groupId]=apInfo.alias;
                    angular.forEach(apInfo.subGroupList,function(v,k,array){
                        var apObj = {};
                        apObj.groupId = v.groupId;
                        apObj.alias = v.alias;
                        g_apObj[v.groupId]=v.alias;
                        g_apArray.push(apObj);
                    })
                    $scope.branchLists = g_apArray;
                    getApStatusCountByCloudGroup(g_topId,g_apObj[g_topId]);
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
                getApStatusCountByCloudGroup(g_topId,g_apObj[g_topId]);
            }
            else if(select == "branch")
            {
                $scope.branchSel = $scope.branchLists[0];
                var groupID = $scope.branchSel.groupId;
                var gropuInfo = {};
                gropuInfo.topID = g_topId;
                gropuInfo.groupID = groupID;
                $scope.group_info = gropuInfo;
                getApStatusCountByCloudGroup(groupID,g_apObj[groupID]);
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
            getApStatusCountByCloudGroup(groupID,g_apObj[groupID]);
        }

        $scope.template = {
            filterBranch:"headquarters",
        }

        getApGroupNameList();

        function getApStatusCountByCloudGroup(changeApgroup,value){
            g_groupId = changeApgroup;
            g_nameId = value;
            $http({
                url:'/apmonitor/getApStatusCountByCloudGroup',
                method:'get',
                params:{
                    topId:g_topId,
                    midId:changeApgroup||""
                }
            }).success(function(data){
                $("#online").html(data.ap_statistic.online);
                $("#offline").html(data.ap_statistic.offline + data.ap_statistic.unmatched);
                $("#unhealthy").html(data.ap_statistic.offline + data.ap_statistic.unmatched + data.ap_statistic.online);                             
            })

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

        }
    }]
});

