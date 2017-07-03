define(['jquery','utils','echarts','angular-ui-router','bsTable'],function($scope,Utils,echarts) {
    return ['$scope', '$http','$state','$window',"$alertService",function($scope,$http,$state,$window,$alert){
        function getRcString(attrName){
        return Utils.getRcString("clients_rc",attrName);
        }
        $scope.return = function(){
            $window.history.back();
        }
        var surplus = [];

        function isLogoutAllBtnDisabled(data, flag) {
            $scope.$apply(function () {
                var bDisabled = data.length ? false : true;
                if (flag == "offline") {
                    $scope.offlineDisabled = bDisabled;
                } else {
                    $scope.logoutAllBtnDisabled = bDisabled;
                }
            });
        }

        $scope.listOpts = {};
        $scope.curCheckedRadio = "basicInfo";
        $scope.modBtnDisable = true;
        $scope.aCurCheckData = [];

        $scope.listOpts.basicInfo = {
            tId:'basicInfo',
            pageSize:10,
            //showPageList:false,
            clickToSelect: false,
            url:'/v3/stamonitor/getclientverbose_page?devSN='
            +$scope.sceneInfo.sn+'&method=addTodayClientBytes',
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
                isLogoutAllBtnDisabled(data.clientList.clientInfo);
                $.extend(surplus,data.clientList.clientInfo);
                return {
                    total: data.clientList.count_total,
                    rows: data.clientList.clientInfo
                };  
            },
            columns:[
                {checkbox:true},
                {sortable:true,field:'clientMAC',title:getRcString('LIST_HEADER').split(",")[0],formatter:showNum,searcher:{}},
                {sortable:true,field:'clientIP',title:getRcString('LIST_HEADER').split(",")[1],searcher:{}},
                {sortable:true,field:'clientVendor',title:getRcString('LIST_HEADER').split(",")[2], formatter: function (value){
                    return (!value ? getRcString("unknown") : value);
                }},
                {sortable:true,field:'ApName',title:getRcString('LIST_HEADER').split(",")[3],searcher:{}},
                {sortable:true,field:'clientSSID',title:getRcString('LIST_HEADER').split(",")[4]}
            ],
        };

        $scope.listOpts.RadioInfo = {
            tId:'RadioInfo',
            pageSize:10,
            clickToSelect: false,
            //showPageList:false,
            url:'/v3/stamonitor/getclientverbose_page?devSN='
            +$scope.sceneInfo.sn+'&method=addTodayClientBytes',
            pageParamsType:'path',
            method:'post',
            searchable:true,
            sidePagination:'server',
            contentType: "application/json",
            dataType: "json",
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
                isLogoutAllBtnDisabled(data.clientList.clientInfo);
                var whatdata = data.clientList.clientInfo;
                $.each(whatdata, function (i,item) {
                    if(item.clientRadioMode==1){
                        item.clientRadioMode= "802.11b";
                    }else if(item.clientRadioMode==2){
                        item.clientRadioMode= "802.11a";
                    }else if(item.clientRadioMode==4){
                        item.clientRadioMode= "802.11g";
                    }else if(item.clientRadioMode==8){
                        item.clientRadioMode= "802.11gn";
                    }else if(item.clientRadioMode==16){
                        item.clientRadioMode= "802.11an";
                    }else if(item.clientRadioMode==64){
                        item.clientRadioMode= "802.11ac";
                    }else{
                        item.clientRadioMode=getRcString('unknown');
                    }
                });
                $.extend(surplus,data.clientList.clientInfo);
                return {
                    total: data.clientList.count_total,
                    rows: data.clientList.clientInfo
                };
            },
            columns:[
                {checkbox:true},
                {sortable:true,field:'clientMAC',title:getRcString('LIST_HEADER_SP').split(",")[0],formatter:showNum,searcher:{}},
                {sortable:true,field:'clientIP',title:getRcString('LIST_HEADER_SP').split(",")[1],searcher:{}},
                {sortable:true,field:'ApName',title:getRcString('LIST_HEADER_SP').split(",")[2],searcher:{}},
                {sortable:true,field:'clientRadioMode',title:getRcString('LIST_HEADER_SP').split(",")[3],searcher:{
                    type: "select", valueField: "value", textField: "text",
                    data: [
                        {value: 1, text: "802.11b"},
                        {value: 2, text: "802.11a"},
                        {value: 4, text: "802.11g"},
                        {value: 8, text: "802.11gn"},
                        {value: 16, text: "802.11an"},
                        {value: 64, text: "802.11ac"}

                    ]
                }},
                {sortable:true,field:'clientMode',title:getRcString('LIST_HEADER_SP').split(",")[4],searcher:{}},
                {sortable:true,field:'clientChannel',title:getRcString('LIST_HEADER_SP').split(",")[5],searcher:{}},
                {sortable:true,field:'NegoMaxRate',title:getRcString('LIST_HEADER_SP').split(",")[6],searcher:{}}
            ],
        };

        $scope.listOpts.StatisticsInfo = {
            tId:'StatisticsInfo',
            pageSize:10,
            //showPageList:false,
            url:'/v3/stamonitor/getclientverbose_page?devSN='
            +$scope.sceneInfo.sn+'&method=addTodayClientBytes',
            pageParamsType:'path',
            clickToSelect: false,
            method:'post',
            searchable:true,
            sidePagination:'server',
            contentType: "application/json",
            dataType: "json",
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
                isLogoutAllBtnDisabled(data.clientList.clientInfo);
                $.extend(surplus,data.clientList.clientInfo);
                return {
                    total: data.clientList.count_total,
                    rows: data.clientList.clientInfo
                };  
            },
            columns:[
                {checkbox:true},
                {sortable:true,field:'clientMAC',title:getRcString('LIST_HEADER_TJ').split(",")[0],formatter:showNum,searcher:{}},
                {sortable:true,field:'clientIP',title:getRcString('LIST_HEADER_TJ').split(",")[1],searcher:{}},
                {sortable:true,field:'ApName',title:getRcString('LIST_HEADER_TJ').split(",")[2],searcher:{}},
                {sortable:true,field:'clientTxRate',title:getRcString('LIST_HEADER_TJ').split(",")[3],searcher:{}},
                {sortable:true,field:'clientRxRate',title:getRcString('LIST_HEADER_TJ').split(",")[4],searcher:{}}
            ],
        };

        $scope.listOpts.UserInfo = {
            tId:'UserInfo',
            pageSize:10,
            //showPageList:false,
            clickToSelect: false,
            url:'/v3/stamonitor/getclientverbose_page?devSN='
            +$scope.sceneInfo.sn+'&method=addTodayClientBytes',
            pageParamsType:'path',
            method:'post',
            searchable:true,
            sidePagination:'server',
            contentType: "application/json",
            dataType: "json",
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
                isLogoutAllBtnDisabled(data.clientList.clientInfo);
                $.extend(surplus,data.clientList.clientInfo);
                return {
                    total: data.clientList.count_total,
                    rows: data.clientList.clientInfo
                };  
            },
            columns:[
                {checkbox: true},
                {sortable:true,field:'clientMAC',title:getRcString('LIST_HEADER_YH').split(",")[0],formatter:showNum,searcher:{}},
                {sortable:true,field:'clientIP',title:getRcString('LIST_HEADER_YH').split(",")[1],searcher:{}},
                {sortable:true,field:'clientSSID',title:getRcString('LIST_HEADER_YH').split(",")[2],searcher:{}},
                {sortable:true,field:'portalUserName',title:getRcString('LIST_HEADER_YH').split(",")[3],searcher:{}},
                {sortable:true,field:'portalAuthType',title:getRcString('LIST_HEADER_YH').split(",")[4],searcher:{}},
                {sortable:true,field:'portalOnlineTime',title:getRcString('LIST_HEADER_YH').split(",")[5],searcher:{}}
            ],
        };

        $scope.listOpts.AllInfo = {
            tId:'AllInfo',
            pageSize:10,
            //showPageList:false,
            clickToSelect: false,
            url:'/v3/portalmonitor/portalonlineuserlist?devSN='+$scope.sceneInfo.sn,
            pageParamsType:'path',
            method:'post',
            searchable:true,
            sidePagination:'server',
            contentType: "application/json",
            dataType: "json",
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
                isLogoutAllBtnDisabled(data.userList, "offline");
                //$.extend(surplus,data.userList);
                return {
                    total: data.count_total,
                    rows: data.userList
                };  
            },
            columns:[
                {checkbox:true},
                {sortable:true,field:'UserMac',title:getRcString('LIST_HEADER_LX').split(",")[0],searcher:{}},
                {sortable:true,field:'UserIP',title:getRcString('LIST_HEADER_LX').split(",")[1],searcher:{}},
                {sortable:true,field:'UserName',title:getRcString('LIST_HEADER_LX').split(",")[2],searcher:{}},
                {sortable:true,field:'AuthTypeStr',title:getRcString('LIST_HEADER_LX').split(",")[3],searcher:{}},
                {sortable:true,field:'OnlineTime',title:getRcString('LIST_HEADER_LX').split(",")[4],searcher:{}}
            ],
        };

        function showNum(value, row, index){
            return '<a class="list-link">'+value+'</a>';
        }

        var clickCellEvt = ["click-cell.bs.table#basicInfo",
                            "click-cell.bs.table#RadioInfo",
                            "click-cell.bs.table#StatisticsInfo",
                            "click-cell.bs.table#UserInfo"
                           ];
        angular.forEach(clickCellEvt, function (value, key, values) {
            $scope.$on(value, function (evt, field, value, row, $ele) {
                if(field=='clientMAC' || field == 'UserMac'){
                    var g_oTableData ={};
                    for(var i =0;i<surplus.length;i++){                        
                        g_oTableData[surplus[i].clientMAC]=surplus[i]
                    }                   
                    var oData = g_oTableData[row.clientMAC];

                    function formatterBytes(value) {
                        if (isNaN(value)) {return value;}
                        if (!value) {return '0 KB';}
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

                    oData.todayClientTxBytes = formatterBytes(oData.todayClientTxBytes);
                    oData.todayClientRxBytes = formatterBytes(oData.todayClientRxBytes);

                    if(oData.clientVendor==""){
                        oData.clientVendor=getRcString("unknown");
                    }  
                    if(oData.clientRadioMode==1){
                        oData.clientRadioMode= "802.11b";
                    }else if(oData.clientRadioMode==2){
                        oData.clientRadioMode= "802.11a";
                    }else if(oData.clientRadioMode==4){
                        oData.clientRadioMode= "802.11g";
                    }else if(oData.clientRadioMode==8){
                        oData.clientRadioMode= "802.11gn";
                    }else if(oData.clientRadioMode==16){
                        oData.clientRadioMode= "802.11an";
                    }else if(oData.clientRadioMode==64){
                        oData.clientRadioMode= "802.11ac";
                    }
                    $scope.$broadcast('show#delogonline');
                    updateHtml($("#flowdetail_form"), oData);
                }
            });
        });

        function updateHtml(jScope, oData)
        {
            $.each(oData, function (sKey, sValue)
                {
                    sKey = sKey.replace(/\./g, "\\.");
                    sValue = (null == sValue) ? "" : sValue+"";
                    $("#"+sKey, jScope).removeClass("loading-small").html(sValue);
                });
            return;
        }

        $scope.aiyaoption = {
            mId:'delogonline',                             
            title:getRcString("aiyaoption_title"),
            autoClose: true ,                        
            showCancel: false ,                       
            modalSize:'lg' ,                     
            showHeader:true,                        
            showFooter:true ,                        
            okText: getRcString("aiyaoption_oktext"),
            // cancelText: '关闭',  //取消按钮文本
            okHandler: function(modal,$ele){
                
            },
            cancelHandler: function(modal,$ele){
               
            },
            beforeRender: function($ele){
                
                return $ele;
            }
        };

        $scope.clickRadio = function (radioName) {
            $scope.curCheckedRadio = radioName;
            $scope.modBtnDisable = true;
            if($scope.curCheckedRadio == "basicInfo"){
                // $scope.$broadcast('refresh#basicInfo', {});
                $scope.$broadcast('hideSearcher#basicInfo');
            }else
            if($scope.curCheckedRadio == "RadioInfo"){
                // $scope.$broadcast('refresh#RadioInfo', {});
                $scope.$broadcast('hideSearcher#RadioInfo');
            }else
            if($scope.curCheckedRadio == "StatisticsInfo"){
                // $scope.$broadcast('refresh#StatisticsInfo', {});
                $scope.$broadcast('hideSearcher#StatisticsInfo');
            }else
            if($scope.curCheckedRadio == "UserInfo"){
                // $scope.$broadcast('refresh#UserInfo', {});
                $scope.$broadcast('hideSearcher#UserInfo');
            }else
            if($scope.curCheckedRadio == "AllInfo"){
                // $scope.$broadcast('refresh#AllInfo', {});
                $scope.$broadcast('hideSearcher#AllInfo');
            }        
        };

        $scope.fresh = function(){
            if($scope.curCheckedRadio == "basicInfo"){
                $scope.$broadcast('refresh#basicInfo', {});
            }else
            if($scope.curCheckedRadio == "RadioInfo"){
                $scope.$broadcast('refresh#RadioInfo', {});
            }else
            if($scope.curCheckedRadio == "StatisticsInfo"){
                $scope.$broadcast('refresh#StatisticsInfo', {});
            }else
            if($scope.curCheckedRadio == "UserInfo"){
                $scope.$broadcast('refresh#UserInfo', {});
            }else
            if($scope.curCheckedRadio == "AllInfo"){
                $scope.$broadcast('refresh#AllInfo', {});
            }           
        };

        $scope.export = function(){
            $http({
                url:"/v3/fs/exportClientsListbyCondition",
                method:"post",
                data:{
                    devSN:$scope.sceneInfo.sn
                }
            }).success(function(data){
                if(data.retCode == 0){
                    var exportCode = "/../v3" + data.fileName.substring(5);
                    $("#exportFile").get(0).src = exportCode;
                }else{
                    $alert.msgDialogError(getRcString('SAC_WLEEOP'));
                }
            });
        }

        var checkEvt = [
            /* 添加翻页监听 */
            "page-change.bs.table#basicInfo", "page-change.bs.table#RadioInfo",
            "page-change.bs.table#StatisticsInfo", "page-change.bs.table#UserInfo",
            "page-change.bs.table#AllInfo",
            "check.bs.table#basicInfo","uncheck.bs.table#basicInfo",
            "check.bs.table#RadioInfo","uncheck.bs.table#RadioInfo",
            "check.bs.table#StatisticsInfo","uncheck.bs.table#StatisticsInfo",
            "check.bs.table#UserInfo","uncheck.bs.table#UserInfo",
            "check.bs.table#AllInfo","uncheck.bs.table#AllInfo",
            "check-all.bs.table#basicInfo","uncheck-all.bs.table#basicInfo",
            "check-all.bs.table#RadioInfo","uncheck-all.bs.table#RadioInfo",
            "check-all.bs.table#StatisticsInfo","uncheck-all.bs.table#StatisticsInfo",
            "check-all.bs.table#UserInfo","uncheck-all.bs.table#UserInfo",
            "check-all.bs.table#AllInfo","uncheck-all.bs.table#AllInfo"      
        ];

        angular.forEach(checkEvt, function (value, key, values) {
            $scope.$on(value, function (evt) {
                /* 翻页监听 翻页即清楚数据及恢复禁用 */
                if (evt.name.indexOf("page-change.bs.table") != -1) {
                    $scope.$apply(function () {
                        $scope.aCurCheckData = [];
                        $scope.modBtnDisable = true;
                    });
                    return;
                }
                $scope.$broadcast("getSelections#" + value.split("#")[1], function (data) {
                    $scope.$apply(function () {
                        $scope.aCurCheckData = data;
                        $scope.modBtnDisable = !$scope.aCurCheckData.length;
                    });
                });
            });
        });

        $scope.cancellation = function(){
            var dataArray = [];
            if($scope.curCheckedRadio == "basicInfo"){
                $scope.$broadcast('getSelections#basicInfo',function(data){
                    $.each(data,function(i,item){
                        dataArray.push(item.clientMAC);
                    })
                }); 
            }else
            if($scope.curCheckedRadio == "RadioInfo"){
                $scope.$broadcast('getSelections#RadioInfo',function(data){
                    $.each(data,function(i,item){
                        dataArray.push(item.clientMAC);
                    })
                }); 
            }else
            if($scope.curCheckedRadio == "StatisticsInfo"){
                $scope.$broadcast('getSelections#StatisticsInfo',function(data){
                    $.each(data,function(i,item){
                        dataArray.push(item.clientMAC);
                    })
                }); 
            }else
            if($scope.curCheckedRadio == "UserInfo"){
                $scope.$broadcast('getSelections#UserInfo',function(data){
                    $.each(data,function(i,item){
                        dataArray.push(item.clientMAC);
                    })
                }); 
            }else
            if($scope.curCheckedRadio == "AllInfo"){
                $scope.$broadcast('getSelections#AllInfo',function(data){
                    $.each(data,function(i,item){
                        dataArray.push(item.UserMac);
                    })
                }); 
            }                    
            $http({
                url:"/v3/ant/confmgr",
                method:"post",
                data:{
                    cfgTimeout:60,
                    cloudModule:'portal',
                    configType:0,
                    devSN:$scope.sceneInfo.sn,
                    deviceModule:"portal",
                    policy:'cloudFirst',
                    method:"DeleteUser",
                    param:[
                    {
                        "branchName":"",
                        "userMacAddr": dataArray
                    }
                    ]
                }
            }).success(function(data){
                if(data.result == "success" && data.deviceResult[0].result == "success" && data.errCode == 0){
                    $alert.msgDialogSuccess(getRcString('LIST_QOSMODE'));
                }else if(data.errCode == 3){
                    $alert.msgDialogError(getRcString('LIST_QSMODE_3'));
                }else if(data.errCode == 4){
                    $alert.msgDialogError(getRcString('LIST_QSMODE_4'));
                }else{
                    $alert.msgDialogError(getRcString('LIST_QSMODE'));
                }
            });
        };

        $scope.cancellationall = function(){
            $http({
                url:"/v3/ant/confmgr",
                method:"post",
                data:{
                    cfgTimeout:60,
                    cloudModule:'portal',
                    configType:0,
                    devSN:$scope.sceneInfo.sn,
                    deviceModule:"portal",
                    policy:'cloudFirst',
                    method:"DeleteUser",
                    param:[
                    {
                        "branchName":"",
                        "userMacAddr": []
                    }
                    ]
                }
            }).success(function(data){
                if(data.result == "success" && data.errCode == 0){
                    $alert.msgDialogSuccess(getRcString('SEC_TYPE'));
                }else if(data.errCode == 3){
                    $alert.msgDialogError(getRcString('SEC_TYPEFAIL_3'));
                }else if(data.errCode == 4){
                    $alert.msgDialogError(getRcString('SEC_TYPEFAIL_4'));
                }else{
                    $alert.msgDialogError(getRcString('SEC_TYPEFAIL'));
                }
            });
        }        
    }]
});