define(['utils'],function(Utils) {
    return ['$scope', '$http','$window',function($scope,$http,$window){
        function getRcString(attrName){
        return Utils.getRcString("user_rc",attrName);
        }
        $scope.return = function(){
            $window.history.back();
        }
        function apart(value){
            var timeout = parseInt(value);
            var timeFist = 0;
            var timeSecond = 0;
            var timeSird = 0;
            var timeYear = 0;
            if(timeout >= 60){
                timeFist = parseInt(timeout/60);
                timeout = parseInt(timeout%60);
                if(timeFist >= 60){
                    timeSecond = parseInt(timeFist/60);
                    timeFist = parseInt(timeFist%60);
                    if(timeSecond >= 24){
                        timeSird = parseInt(timeSecond/24);
                        timeSecond = parseInt(timeSecond%24);
                    }
                }
            }
            var result =  0 + "d" + ":" + 0 + "h" + ":" + 0 + "m" + "&:" + parseInt(timeout) + "s";
            if(timeFist > 0){
                result =  0 + "d" + ":" + 0 + "h" + ":" + parseInt(timeFist) + "m" + ":" + parseInt(timeout) + "s";
            }
            if(timeSecond > 0){
                result =  0 + "d" + ":" + parseInt(timeSecond) + "h" + ":" + parseInt(timeFist) + "m" + ":" + parseInt(timeout) + "s";
            }
            if(timeSird > 0){
                result =  parseInt(timeSird) + "d" + ":" + parseInt(timeSecond) + "h" + ":" + parseInt(timeFist) + "m" + ":" + parseInt(timeout) + "s";
            }
            return result;
        }
        $scope.options={
            pageSize:10,
            clickToSelect: false,
            url:'/v3/stamonitor/getclientlistbycondition?devSN='+$scope.sceneInfo.sn+'&reqType=history',
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
                    item.upLineDate = (new Date(item.upLineDate)).toLocaleDateString()+"&nbsp &nbsp"+(new Date(item.upLineDate)).toTimeString().split(" ")[0];
                    item.onlineTime = apart(item.onlineTime);
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