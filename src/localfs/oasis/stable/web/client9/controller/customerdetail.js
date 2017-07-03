define(['jquery','utils','echarts','angular-ui-router','bsTable'],function($scope,Utils,echarts) {
    return ['$scope','$stateParams' ,'$http','$state','$window',"$alertService",function($scope,$stateParams,$http,$state,$window,$alert){
        function getRcString(attrName){
        return Utils.getRcString("clients_rc",attrName);
        }
        $scope.return = function(){
            $window.history.back();
        }
       
        var surplus = [];
        var changedevSn = '';
        var changeApgroup = $stateParams.data;
        var g_topId = $stateParams.value;
        var arraDate = $stateParams.alias;
        // var changeApgroup = window.name;
        $scope.listOpts = {};       
        $scope.curCheckedRadio = "basicInfo";
        $scope.modBtnDisable = true;
        $scope.aCurCheckData = [];
        $scope.server = arraDate;
               
        $scope.listOpts.basicInfo = {
            tId:'basicInfo',
            pageSize:10,
            showPageList:false,
            clickToSelect: false,
            url:'/v3/stamonitor/monitor',
            pageParamsType:'body',
            method:'post',
            sidePagination:'server',
            contentType: "application/json",
            dataType: "json",
            //searchable:true,
            //startField:'skipnum',
            //limitField:'limitnum',
            queryParams:function(params){
                console.log(params);
                var chouseBody = {
                    method:'clientcount_cloud_verbosepage',
                    param:{
                        topId:g_topId,
                        groupId:changeApgroup,
                        dataType:"",
                        limitNum:params.limit,
                        skipNum:params.offset,
                        devSN:changedevSn,
                        clientSSID:'',
                        clientMAC:''
                    }                    
                };
                if(params.sort){
                    chouseBody.param.sortoption[params.sort] = (params.order == "asc" ? 1 : -1);
                }
                if(params.findoption){
                    chouseBody.param.clientSSID = params.findoption.clientSSID;
                }
                if(params.findoption){
                    chouseBody.param.clientMAC = params.findoption.clientMAC;
                }
                // if(params.offset){
                //     chouseBody.param.skipNum = params.offset;
                // }
                params.offset = undefined;
                params.limit =undefined;
                params.findoption = undefined;
                params.start = undefined;
                params.size = undefined;
                params.order = undefined;
                return $.extend(true,{},params,chouseBody);
            },
            responseHandler: function (data) {
                changedevSn = data.response.devSN;
                var wheredata = data.response.clientInfo;
                $.each(wheredata, function (i,item) {
                    if(item.clientVendor==""){
                        item.clientVendor=getRcString('LIST_QOSML');
                    }    
                });
                $.extend(surplus,data.response.clientInfo); 
                return {
                    total: data.response.count_total,
                    rows: data.response.clientInfo
                };  
            },
            columns:[
                {sortable:false,field:'clientMAC',title:getRcString('LIST_HEADER').split(",")[0],formatter:showNum,searcher:{}},
                {sortable:false,field:'clientIP',title:getRcString('LIST_HEADER').split(",")[1]},
                {sortable:false,field:'clientVendor',title:getRcString('LIST_HEADER').split(",")[2]},
                {sortable:false,field:'ApName',title:getRcString('LIST_HEADER').split(",")[3]},
                {sortable:false,field:'clientSSID',title:getRcString('LIST_HEADER').split(",")[4],searcher:{}}
            ],
        };

        $scope.listOpts.RadioInfo = {
            tId:'RadioInfo',
            pageSize:10,
            showPageList:false,
            clickToSelect: false,
            url:'/v3/stamonitor/monitor',
            pageParamsType:'body',
            method:'post',
            //searchable:true,
            sidePagination:'server',
            contentType: "application/json",
            dataType: "json",
            //startField:'skipnum',
            //limitField:'limitnum',
            queryParams:function(params){
                var chouseBody = {
                    method:'clientcount_cloud_verbosepage',
                    param:{
                        topId:g_topId,
                        groupId:changeApgroup,
                        dataType:"",
                        limitNum:params.limit,
                        skipNum:params.offset,
                        devSN:changedevSn,
                        clientSSID:'',
                        clientMAC:''
                    }                    
                };
                if(params.sort){
                    chouseBody.param.sortoption[params.sort] = (params.order == "asc" ? 1 : -1);
                }
                if(params.findoption){
                    chouseBody.param.clientSSID = params.findoption.clientSSID;
                }
                if(params.findoption){
                    chouseBody.param.clientMAC = params.findoption.clientMAC;
                }
                // if(params.offset){
                //     chouseBody.param.skipNum = params.offset;
                // }
                params.offset = undefined;
                params.limit =undefined;
                params.findoption = undefined;
                params.start = undefined;
                params.size = undefined;
                params.order = undefined;
                return $.extend(true,{},params,chouseBody);
            },
            responseHandler: function (data) {
                changedevSn = data.response.devSN;
                var whatdata = data.response.clientInfo;
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
                        item.clientRadioMode=getRcString('LIST_QOS');
                    }   
                });
                $.extend(surplus,data.response.clientInfo);
                return {
                    total: data.response.count_total,
                    rows: data.response.clientInfo
                };  
            },
            columns:[
                {sortable:false,field:'clientMAC',title:getRcString('LIST_HEADER_SP').split(",")[0],formatter:showNum,searcher:{}},
                {sortable:false,field:'clientIP',title:getRcString('LIST_HEADER_SP').split(",")[1]},
                {sortable:false,field:'ApName',title:getRcString('LIST_HEADER_SP').split(",")[2]},
                {sortable:false,field:'clientRadioMode',title:getRcString('LIST_HEADER_SP').split(",")[3]},
                {sortable:false,field:'clientMode',title:getRcString('LIST_HEADER_SP').split(",")[4]},
                {sortable:false,field:'clientChannel',title:getRcString('LIST_HEADER_SP').split(",")[5]},
                {sortable:false,field:'NegoMaxRate',title:getRcString('LIST_HEADER_SP').split(",")[6]}
            ],
        };

        $scope.listOpts.StatisticsInfo = {
            tId:'StatisticsInfo',
            pageSize:10,
            showPageList:false,
            clickToSelect: false,
            url:'/v3/stamonitor/monitor',
            pageParamsType:'body',
            method:'post',
            //searchable:true,
            sidePagination:'server',
            contentType: "application/json",
            dataType: "json",
            //startField:'skipnum',
            //limitField:'limitnum',
            queryParams:function(params){
                var chouseBody = {
                    method:'clientcount_cloud_verbosepage',
                    param:{
                        topId:g_topId,
                        groupId:changeApgroup,
                        dataType:"",
                        limitNum:params.limit,
                        skipNum:params.offset,
                        devSN:changedevSn,
                        clientSSID:'',
                        clientMAC:''
                    }                    
                };
                if(params.sort){
                    chouseBody.param.sortoption[params.sort] = (params.order == "asc" ? 1 : -1);
                }
                if(params.findoption){
                    chouseBody.param.clientSSID = params.findoption.clientSSID;
                }
                if(params.findoption){
                    chouseBody.param.clientMAC = params.findoption.clientMAC;
                }
                // if(params.offset){
                //     chouseBody.param.skipNum = params.offset;
                // }
                params.offset = undefined;
                params.limit =undefined;
                params.findoption = undefined;
                params.start = undefined;
                params.size = undefined;
                params.order = undefined;
                return $.extend(true,{},params,chouseBody);
            },
            responseHandler: function (data) {
                changedevSn = data.response.devSN;
                $.extend(surplus,data.response.clientInfo);
                return {
                    total: data.response.count_total,
                    rows: data.response.clientInfo
                };  
            },
            columns:[
                {sortable:false,field:'clientMAC',title:getRcString('LIST_HEADER_TJ').split(",")[0],formatter:showNum,searcher:{}},
                {sortable:false,field:'clientIP',title:getRcString('LIST_HEADER_TJ').split(",")[1]},
                {sortable:false,field:'ApName',title:getRcString('LIST_HEADER_TJ').split(",")[2]},
                {sortable:false,field:'clientTxRate',title:getRcString('LIST_HEADER_TJ').split(",")[3]},
                {sortable:false,field:'clientRxRate',title:getRcString('LIST_HEADER_TJ').split(",")[4]}
            ],
        };

        $scope.listOpts.UserInfo = {
            tId:'UserInfo',
            pageSize:10,
            showPageList:false,
            clickToSelect: false,
            url:'/v3/stamonitor/monitor',
            pageParamsType:'body',
            method:'post',
            //searchable:true,
            sidePagination:'server',
            contentType: "application/json",
            dataType: "json",
            //startField:'skipnum',
            //limitField:'limitnum',
            queryParams:function(params){
               var chouseBody = {
                    method:'clientcount_cloud_verbosepage',
                    param:{
                        topId:g_topId,
                        groupId:changeApgroup,
                        dataType:"",
                        limitNum:params.limit,
                        skipNum:params.offset,
                        devSN:changedevSn,
                        clientSSID:'',
                        clientMAC:''
                    }                    
                };
                if(params.sort){
                    chouseBody.param.sortoption[params.sort] = (params.order == "asc" ? 1 : -1);
                }
                if(params.findoption){
                    chouseBody.param.clientSSID = params.findoption.clientSSID;
                }
                if(params.findoption){
                    chouseBody.param.clientMAC = params.findoption.clientMAC;
                }
                // if(params.offset){
                //     chouseBody.param.skipNum = params.offset;
                // }
                params.offset = undefined;
                params.limit =undefined;
                params.findoption = undefined;
                params.start = undefined;
                params.size = undefined;
                params.order = undefined;
                return $.extend(true,{},params,chouseBody);
            },
            responseHandler: function (data) {
                changedevSn = data.response.devSN;
                $.extend(surplus,data.response.clientInfo);
                return {
                    total: data.response.count_total,
                    rows: data.response.clientInfo
                };  
            },
            columns:[
                {sortable:false,field:'clientMAC',title:getRcString('LIST_HEADER_YH').split(",")[0],formatter:showNum,searcher:{}},
                {sortable:false,field:'clientSSID',title:getRcString('LIST_HEADER_YH').split(",")[1],searcher:{}},
                {sortable:false,field:'portalUserName',title:getRcString('LIST_HEADER_YH').split(",")[2]},
                {sortable:false,field:'portalAuthType',title:getRcString('LIST_HEADER_YH').split(",")[3]},
                {sortable:false,field:'portalOnlineTime',title:getRcString('LIST_HEADER_YH').split(",")[4]}
            ],
        };

        $scope.listOpts.AllInfo = {
            tId:'AllInfo',
            pageSize:10,
            showPageList:false,
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
                $.extend(surplus,data.userList);
                return {
                    total: data.count_total,
                    rows: data.userList
                };  
            },
            columns:[
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
                if(field=='clientMAC'){
                    var g_oTableData ={};
                    for(var i =0;i<surplus.length;i++){                        
                        g_oTableData[surplus[i].clientMAC]=surplus[i]
                    }                   
                    var oData = g_oTableData[row.clientMAC];
                    if(oData.clientVendor==""){
                        oData.clientVendor=getRcString('LIST_QOSML');
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
                    }else{
                        oData.clientRadioMode=oData.clientRadioMode;
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
            title:getRcString('SEC_FAIL'),                           
            autoClose: true ,                        
            showCancel: false ,                       
            modalSize:'lg' ,                     
            showHeader:true,                        
            showFooter:true ,                        
            okText: getRcString('SEC_TYPEFL'),  
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
                $scope.$broadcast('hideSearcher#basicInfo');
                $scope.$broadcast('refresh#basicInfo', {});
            }else
            if($scope.curCheckedRadio == "RadioInfo"){
                $scope.$broadcast('hideSearcher#RadioInfo');
                $scope.$broadcast('refresh#RadioInfo');
            }else
            if($scope.curCheckedRadio == "StatisticsInfo"){
                $scope.$broadcast('hideSearcher#StatisticsInfo');
                $scope.$broadcast('refresh#StatisticsInfo');
            }else
            if($scope.curCheckedRadio == "UserInfo"){
                $scope.$broadcast('hideSearcher#UserInfo');
                $scope.$broadcast('refresh#UserInfo');
            }else
            if($scope.curCheckedRadio == "AllInfo"){
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
                    devSN:$scope.sceneInfo.sn,
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
    }]
});