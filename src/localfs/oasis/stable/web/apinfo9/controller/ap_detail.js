define(['echarts','utils', 'common9/devices'], function(ecahrts, Utils,Dev) {
    return ['$scope', '$http', '$window', '$alertService', "$stateParams",function($scope, $http, $window,$alertServic,$stateParams){
       
        function getRcString(attrName){
            return Utils.getRcString("clients_rc",attrName);
        }

        $scope.onReturn = function () {
            $window.history.back();
        }

        var newTopId = $stateParams.topID;
        var newGroupId = $stateParams.groupID;
        var newNameId = $stateParams.nameID;
        var devSNPromise = Dev.getAlias($stateParams.nasid);
        $scope.nameFaild = newNameId;
  
        $scope.clients_list_jb = {
            tId:"baseApList",
            url:'/apmonitor/getApInfoListByCloudGroup?' + '&topId=' + newTopId + '&midId=' + newGroupId,
            pageSize:10,
            method:"post",
            pageParamsType:'path',
            contentType:'application/json',
            dataType:'json',
            // searchable:true,
            sidePagination:'server',
            startField:'skipnum',
            limitField:'limitnum',
            beforeAjax: function () {
              return devSNPromise;
            },
            queryParams: function (params) {
               var chouseBody = {
                    sortoption:{}
                };
                if(params.sort){
                    chouseBody.sortoption[params.sort] = (params.order == "asc" ? 1 : -1);
                }
                params.start = undefined;
                params.size = undefined;
                params.order = undefined;
                return $.extend(true,{},params,chouseBody);
            },
            responseHandler:function(data,alias){
                $.each(data.apInfo.apList,function(i,item){
                    console.log(typeof item.status)
                    item.apName=alias[item.apSN]||item.apName;
                    item.status = item.status === 1 ? getRcString("BUTTON_CANCEL") : getRcString("EXPORT_LOG")
                })
                return {
                    total: data.apInfo.count_total,
                    rows: data.apInfo.apList || []  
                };
            },
            columns:[
                {searcher:{},sortable: false, field: 'apName', title: getRcString("LIST_HEADER").split(',')[0]},
                {searcher:{},sortable: false, field: 'apModel', title:  getRcString("LIST_HEADER").split(',')[1]},
                {sortable: false, field: 'apSN', title: getRcString("LIST_HEADER").split(',')[2]},
                {searcher:{},sortable: false, field: 'macAddr', title: getRcString("LIST_HEADER").split(',')[3]},
                {sortable: false, field: 'apGroupName', title: getRcString("LIST_HEADER").split(',')[4]},
                //{sortable: false, field: 'onlineTime', title: getRcString("LIST_HEADER").split(',')[5]},
                {sortable: false, field: 'status', title: getRcString("LIST_HEADER").split(',')[6]},
            ],
        };
       
        $scope.refresh = function() {
            $scope.$broadcast('refresh#baseApList',{});
        }

       
    }]
});