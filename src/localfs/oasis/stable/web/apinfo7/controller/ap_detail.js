define(['echarts','utils','angular-ui-router','bsTable'], function(ecahrts, Utils) {
    return ['$scope', '$http', '$window', '$alertService', '$stateParams', function($scope, $http, $window,$alert,$stateParams){
        // get url 
        var url_ApList = Utils.getUrl('POST','','/apmonitor/getaplist_page','/init/apinfo5/get_aplistDetail.json');
        var url_RadioList = Utils.getUrl('POST','','/apmonitor/getRadioListByPage','/init/apinfo5/get_aplistDetail.json');
        var url_exClient = Utils.getUrl('POST','','/fs/exportClientsList','/init/apinfo5/get_aplistDetail.json');
        
        function getRcString(attrName){
            return Utils.getRcString("clients_rc",attrName).split(',');
        }

        $scope.branchName = $stateParams.name;

        $scope.selectVal = 'base';

        function initData(bFlag)
        {
            var tId,
                sBranchUrl,
                columns = [],
                sUrl = url_ApList.url;
            if ($scope.branchName === "") {
                sBranchUrl = "";
            } else {
                sBranchUrl = "&branch=" + $scope.branchName;
            }
            if(bFlag == 'base'){
                tId = "baseApList";
                columns =  [
                    {checkbox: true},
                    {searcher:{},sortable: true, field: 'apName', title: getRcString("LIST_HEADER")[0]},
                    {searcher:{},sortable: true, field: 'apModel', title:  getRcString("LIST_HEADER")[1]},
                    {searcher:{},sortable: true, field: 'apSN', title: getRcString("LIST_HEADER")[2]},
                    {searcher:{},sortable: true, field: 'apGroupName', title: getRcString("LIST_HEADER")[3]},
                    {searcher:{},sortable: true, field: 'branchName', title: getRcString("LIST_HEADER")[4]},
                    {searcher:{},sortable: true, field: 'macAddr', title: getRcString("LIST_HEADER")[5]},
                    {searcher:{},sortable: true, field: 'ipv4Addr', title: getRcString("LIST_HEADER")[6]},
                    {searcher:{},sortable: true, field: 'ipv6Addr', title: getRcString("LIST_HEADER")[7]}
                ];
            }else if(bFlag == 'radio'){
                tId = "radioApList";
                sUrl = url_RadioList.url;
                columns =  [
                    {checkbox: true},
                    {searcher:{},sortable: true, field: 'apName', title: getRcString("LIST_HEADER_SP")[0]},
                    {searcher:{},sortable: true, field: 'apModel', title:  getRcString("LIST_HEADER_SP")[1]},
                    {searcher:{},sortable: true, field: 'radio', title:  getRcString("LIST_HEADER_SP")[2]},
                    {searcher:{},sortable: true, field: 'radioChannel', title: getRcString("LIST_HEADER_SP")[3]},
                    {searcher:{},sortable: true, field: 'radioPower', title:  getRcString("LIST_HEADER_SP")[4]}
                ];
            }else if(bFlag == 'link'){
                tId = "linkApList";
                columns = [{checkbox: true},
                    {searcher:{},sortable: true, field: 'apName', title: getRcString("LIST_HEADER_TJ")[0]},
                    {searcher:{},sortable: true, field: 'macAddr', title: getRcString("LIST_HEADER_TJ")[1]},
                    {searcher:{},sortable: true, field: 'ipv4Addr', title:  getRcString("LIST_HEADER_TJ")[2]},
                    {searcher:{},sortable: true, field: 'ipv6Addr', title: getRcString("LIST_HEADER_TJ")[3]},
                    {searcher:{},sortable: true, field: 'onlineTime', title:  getRcString("LIST_HEADER_TJ")[4]}
                ];
            }else if(bFlag == 'client'){
                tId = "clientApList";
                columns = [
                    {checkbox: true},
                    {searcher:{},sortable: true, field: 'apName', title: getRcString("LIST_HEADER_YH")[0]},
                    {searcher:{},sortable: true, field: 'client5GNum', title:  getRcString("LIST_HEADER_YH")[1]},
                    {searcher:{},sortable: true, field: 'client24GNum', title: getRcString("LIST_HEADER_YH")[2]}
                ];
            }

            $scope.clients_list_jb = {
                tId:tId,
                url:sUrl+"?devSN="+$scope.sceneInfo.sn + sBranchUrl,
                pageSize:10,
                pageList:[10,20,30],
                method:"post",
                contentType:'application/json',
                dataType:'json',
                apiVersion:'v3',
                searchable:true,
                sidePagination:'server',
                dataField:(bFlag=="radio"?"radioList":"apList"),
                totalField:(bFlag=="radio"?"totalCount":"count_total"),
                columns:columns
                //responseHandler:function(data){
                //    var apList = [];
                //    var iDate = {};
                //    var refreshData = {};
                //    if(bFlag == 'base')
                //    {
                //        angular.forEach(data.apList,function(value, key, values){
                //            iDate.apName = value.apName;
                //            iDate.apModel = value.apModel;
                //            iDate.apSN = value.apSN;
                //            iDate.apGroupName = value.apGroupName;
                //            iDate.branchName = value.branchName;
                //            iDate.macAddr = value.macAddr;
                //            iDate.ipv4Addr = value.ipv4Addr;
                //            iDate.ipv6Addr = value.ipv6Addr;
                //            apList.push(iDate);
                //        });
                //    }
                //    else if(bFlag == 'radio')
                //    {
                //        angular.forEach(data.apList,function(value, key, values){
                //            angular.forEach(value.radioList, function (value1, key1, values1) {
                //                iDate.apName = value.apName;
                //                iDate.apModel = value.apModel;
                //                iDate.radioId = value1.radioId;
                //                iDate.radioChannel = value1.radioChannel;
                //                iDate.radioPower = value1.radioPower;
                //                apList.push(iDate);
                //            });
                //        });
                //    }
                //    else if(bFlag == 'link')
                //    {
                //        angular.forEach(data.apList,function(value, key, values){
                //
                //            iDate.apName = value.apName;
                //            iDate.apModel = value.apModel;
                //            iDate.apSN = value.apSN;
                //            iDate.onlineTime = onLineTime(value);
                //            iDate.macAddr = value.macAddr;
                //            iDate.ipv4Addr = value.ipv4Addr;
                //            apList.push(iDate);
                //        });
                //    }
                //    else if(bFlag == 'client')
                //    {
                //        angular.forEach(data.apList,function(value, key, values){
                //
                //            iDate.apName = value.apName;
                //            iDate.apModel = value.apModel;
                //            iDate.apSN = value.apSN;
                //            iDate.clientCount5 = showRadio5(value.radioList);
                //            iDate.clientCount2 = showRadio2(value.radioList);
                //            apList.push(iDate);
                //        });
                //    }
                //    refreshData.count_total = data.count_total;
                //    refreshData.apList = apList;
                //    return refreshData;
                //}
            };
        }

        //function showRadio5(obj)
        //{
        //    var sRadio = 0;
        //    angular.forEach(obj, function(value, key, values){
        //        (value.radioMode == "5G")? sRadio++:sRadio;
        //    });
        //    return sRadio;
        //}
        //
        //function showRadio2(obj)
        //{
        //    var sRadio = 0;
        //    angular.forEach(obj, function(value, key, values){
        //        (value.radioMode == "2.4G")? sRadio++:sRadio;
        //    });
        //    return sRadio;
        //}
        //
        //function onLineTime(num)
        //{
        //    var time = (num.status == 1)? num.onlineTime :
        //        ((num.status == 2)? aStatus[num.status] : "正在下载版本");
        //    return time ;
        //}

        function http_getExportClient(succb,errcb)
        {
            $http({
                method:url_exClient.method,
                url:url_exClient.url,
                data:{devSN:$scope.sceneInfo.sn}
            }).success(function(data){
                succb(data);
            }).error(function(err){
                errcb(err);
            });
        }

        function initForm()
        {
            $scope.bindCheck = function (e) {
                var value = e.target.getAttribute('id');
                $scope.selectVal = value;
                initData(value);
            } 
            
            $scope.refresh = function() {
                initData($scope.selectVal);
            }

            $scope.export = function(){
                debugger
                function exportSuc(data){
                    if (data != ""){
                        if(data.retCode==0)
                        {
                            var url = data.fileName.split('../..');
                           window.location.href ='/v3' +url[1];
                        }
                    }
                }

                 function exportFail(error){
                     console.log('Export log file failed: ' + error);
                 }
                
                http_getExportClient(exportSuc,exportFail);

            }
            
            $scope.onReturn = function() {
                $window.history.back();
            }

        }

        //初始化init 
        function init()
        {
            initData("base");
            initForm();
        }

        init();
    }]
});