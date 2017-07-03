define(['jquery','utils','echarts','angular-ui-router','bsTable',
    'client9/directive/xanth_byod_rz',
    'client9/directive/xanth_client_rz',
    'client9/directive/xanth_count_rz',
    'client9/directive/xanth_portal_rz'
    ],function($scope,Utils,echarts) {
    return ['$scope', '$http','$state',function($scope,$http,$state){
        $scope.redirectCustomer = function(){
           
            $state.go("scene.content.monitor.client9.customer");
        }    
        $scope.template = {
            filterBranch:"headquarters",
        }  

        var getApGroupNameList_URL = Utils.getUrl('POST','','/cloudapgroup','/init/branchOther5/upload_apgroup.json');         
        var g_topId = "";
        var g_apArray = [];
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
                    $scope.$broadcast('paraChange',g_topId,g_topId)
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
                $scope.$broadcast('paraChange',g_topId,g_topId);
            }
            else if(select == "branch")
            {
                $scope.branchSel = $scope.branchLists[0];
                var groupID = $scope.branchSel.groupId;
                var gropuInfo = {};
                gropuInfo.topID = g_topId;
                gropuInfo.groupID = groupID;
                $scope.group_info = gropuInfo;
                $scope.$broadcast('paraChange',groupID,g_topId);
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
            $scope.$broadcast('paraChange',groupID,g_topId);
        } 

    }]
});