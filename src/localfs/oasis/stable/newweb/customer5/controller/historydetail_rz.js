define(['jquery','utils','echarts','angular-ui-router','bsTable'],function($scope,Utils,echarts) {
    return ['$scope', '$http','$state','$window',function($scope,$http,$state,$window){
        function getRcString(attrName){
        return Utils.getRcString("user_rc",attrName);
        }
        $scope.return = function(){
            $window.history.back();
        }
        $scope.options={
            url:'/v3/stamonitor/getclientlistbycondition?devSN='+$scope.sceneInfo.sn+'&reqType=history'+'&auth=1',
            pageSize:10,
            showPageList:false,
            clickToSelect: false,
            pageParamsType:'path',
            method:'post',
            sidePagination:'server',
            contentType: "application/json",
            dataType: "json",
            searchable:true,
            startField:'skipnum',
            limitField:'limitnum',
            queryParams:function(params){
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
            responseHandler: function (data) {
                $.each(data.clientList.clientInfo,function(i,item){
                    item.upLineDate = (new Date(item.upLineDate)).toLocaleString();
                });
                return {
                    total: data.clientList.count_total || 0,
                    rows: data.clientList.clientInfo || []
                };  
            },
            columns:[
                {sortable:true,field:'clientMAC',title:getRcString('Visitor_LIST_HEADER').split(",")[0],searcher:{}},
                {sortable:true,field:'clientIP',title:getRcString('Visitor_LIST_HEADER').split(",")[1],searcher:{}},
                {sortable:true,field:'upLineDate',title:getRcString('Visitor_LIST_HEADER').split(",")[2],searcher:{}},
                {sortable:true,field:'onlineTime',title:getRcString('Visitor_LIST_HEADER').split(",")[3],searcher:{}}
            ],
        };
    }]
});