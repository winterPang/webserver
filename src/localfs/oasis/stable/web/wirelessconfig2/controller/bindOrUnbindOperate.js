define(["utils"], function (Utils) {
return ["$scope", "$http", "$alertService", '$state', '$stateParams', '$window', function ($scope, $http, $alert, $state ,$stateParams ,$window){


    //processingFlash--Start0
    $scope.loading=false;


    initForm();
    $("input[name='btn_Radio'][id='APGroup_Radio']",$("#btn_Radio_div")).click();
    initShuJu();
    

    function initForm(){
        $("input[name='btn_Radio']",$("#btn_Radio_div")).click(
            function(){
                var tempValue=$("input[name='btn_Radio']:checked",$("#btn_Radio_div")).attr("id");
                if(tempValue=="APGroup_Radio"){
                    $("#APGroup_div").show();
                    $("#AP_div").hide();
                }else if(tempValue=="AP_Radio"){
                    $("#APGroup_div").hide();
                    $("#AP_div").show();
                }
            }
        );
    }
    

    function initShuJu(){
        apgroup2s_initGrid();
        ap2s_initGrid();
        init_Data("apgroup");
        init_Data("ap");
    }    


    //获取HTML变量
    function getRcText (attrName) {
        var sText = Utils.getRcString("RC", attrName);
        return sText;
    }


    //apgroup bsTable 2个初始化
    function apgroup2s_initGrid(){
        //[已绑定APGroup List]    
        var bsTable="table_bindAPGroupStatus_stList";
        var tid="tid_bindAPGroupStatus_stList";
        
        var columns=[];
        var stBindOrUnbindAPGroup_Text=getRcText("stBindOrUnbindAPGroup_Text").split(',');
        var stBindOrUnbindAPGroup_Value=["apGroupName","description","modelListNum"];
        $.each(stBindOrUnbindAPGroup_Text,function(i,item){
            var eachCol={
                    title: item,
                    field: stBindOrUnbindAPGroup_Value[i],
                    sortable: true,
                    searcher: {type: "text"},
                    formatter: function(value,row,index){
                        // return formatterFun(value,row,index,eachCol.field);
                        return value;
                    }
                };            
            columns.push(eachCol);
        });    
        
        init_Grid(bsTable,tid,columns);
        

        //[未绑定APGroup List]    
        var bsTable="table_unbindAPGroupStatus_stList";
        var tid="tid_unbindAPGroupStatus_stList";

        init_Grid(bsTable,tid,columns); 
    }


    //ap bsTable 2个初始化
    function ap2s_initGrid(){
        //[已绑定APGroup List]    
        var bsTable="table_bindAPStatus_stList";
        var tid="tid_bindAPStatus_stList";
        
        var columns=[];
        var stBindOrUnbindAP_Text=getRcText("stBindOrUnbindAP_Text").split(',');
        var stBindOrUnbindAP_Value=["apName","apSN","apModel","radioNum","apGroupName"];
        $.each(stBindOrUnbindAP_Text,function(i,item){
            var eachCol={
                    title: item,
                    field: stBindOrUnbindAP_Value[i],
                    sortable: true,
                    searcher: {type: "text"},
                    formatter: function(value,row,index){
                        // return formatterFun(value,row,index,eachCol.field);
                        return value;
                    } 
                };            
            columns.push(eachCol);
        });    
        
        init_Grid(bsTable,tid,columns);
        

        //[未绑定APGroup List]    
        var bsTable="table_unbindAPStatus_stList";
        var tid="tid_unbindAPStatus_stList";

        init_Grid(bsTable,tid,columns); 
    }


    //
    function init_Grid(bsTable,tid,columns){
     
        $scope[bsTable] = {
            //tid
            tId: tid,
            sortable:true,           
            searchable: true,
            showPageList: true,
            showCheckBox: true,
            showRowNumber: false,
            clickToSelect: true,                
            //表列_点击事件
            onClickCell: function (field, value, row) {
                // openDialog(field, value, row);            
            },                 
            //表列_内容
            columns: columns
        };           
    }


    //
    function init_Data(type){
        //url
        var url="";
        if(type=="apgroup"){
            url="getstbindapgrouplist";
            setTimeout(function(){$scope.$broadcast('showLoading#tid_bindAPGroupStatus_stList');});
            setTimeout(function(){$scope.$broadcast('showLoading#tid_unbindAPGroupStatus_stList');});
        }else if(type=="ap"){
            url="getstbindaplist";  
            setTimeout(function(){$scope.$broadcast('showLoading#tid_bindAPStatus_stList');});
            setTimeout(function(){$scope.$broadcast('showLoading#tid_unbindAPStatus_stList');});
        }

        //发请求  
        // 加载菊花标记，开始转00000000       
        $http.get("/v3/ssidmonitor/"+url+"?devSN="+$scope.sceneInfo.sn+"&stName="+$stateParams.stName)
        .success(function (data, status, header, config) {
            if(type=="apgroup"){
                //数据处理
                $.each(data.bindApGroupList,function(i,item){
                    item.modelListNum=item.modelList.length;
                });
                $.each(data.unbindApGroupList,function(i,item){
                    item.modelListNum=item.modelList.length;
                });
                $scope.$broadcast('hideLoading#tid_bindAPGroupStatus_stList');            
                $scope.$broadcast('load#tid_bindAPGroupStatus_stList',data.bindApGroupList);                 
                $scope.$broadcast('hideLoading#tid_unbindAPGroupStatus_stList');
                $scope.$broadcast('load#tid_unbindAPGroupStatus_stList',data.unbindApGroupList); 
            }else if(type=="ap"){
                $scope.$broadcast('hideLoading#tid_bindAPStatus_stList');            
                $scope.$broadcast('load#tid_bindAPStatus_stList',data.bindApList);
                   
                $scope.$broadcast('hideLoading#tid_unbindAPStatus_stList');               
                $scope.$broadcast('load#tid_unbindAPStatus_stList',data.unbindApList); 
            }
            
        })
        .error(function (data, status, header, config) {
            $alert.msgDialogError(getRcText("getDataFailed"));
        });          
    }


    //解绑AP Group
    $scope.unbind_APGroup_Event = function(){
        //stName通过上一页传递过来
        var stName = $stateParams.stName;
        //bindApGroupList通过secetion方法得到
        var aToUnbindApGroup = [];
        $scope.$broadcast('getAllSelections#tid_bindAPGroupStatus_stList',{},function(data){
            aToUnbindApGroup = data;
        });

        //未勾选
        if(aToUnbindApGroup.length==0){
            $alert.msgDialogError(getRcText("mustChooseAPGroup"));
            return;
        }

        //已勾选
        unbindAPGroup(aToUnbindApGroup,stName);        

        //解绑AP Group
        function unbindAPGroup(aToUnbindApGroup,stName){
            //如果model是空数组
            var tempZhi="";

            var param = [];            
            aToUnbindApGroup.forEach(function(oRow){
                //如果model是空数组
                if(oRow.modelList.length==0){
                    tempZhi="youKongDe";
                    return;
                }

                oRow.modelList.forEach(function(oModel){
                    var sNum = oModel.radioNum;
                    for (var i = 1; i <= sNum; i++) {
                        var paramValue_tmp= {
                            apGroupName: oRow.apGroupName,
                            apModelName: oModel.model,
                            radioId: i,
                            stName: stName
                        };
                        param.push(paramValue_tmp);
                    } 
                });
            });

            //如果model是空数组
            if(tempZhi=="youKongDe"){
                $alert.msgDialogError(getRcText("mustNeedModelAPGroup"));
                return ;
            }

            //processingFlash--Start
            $scope.loading=true;
            $scope.message=getRcText("Processing");

            //ajax
            $http.post("/v3/ant/confmgr", {
                devSN: $scope.sceneInfo.sn,
                cfgTimeout:120,
                configType: 0,
                cloudModule: "stamgr",
                deviceModule: "stamgr",
                method: "SSIDUnbindByAPGroup",
                param: param
            })
            .success(function (data, status, header, config) {
                //processingFlash--End
                $scope.loading=false;

                if(data.errCode==0){
                    $alert.msgDialogSuccess(getRcText("unbindAPGroupOK")); 
                    init_Data("apgroup");                   
                }else{
                    if(data.errCode==3){
                        $alert.msgDialogError(getRcText("unbindAPGroupFail3"));
                    }else if(data.errCode==4){
                        $alert.msgDialogError(getRcText("unbindAPGroupFail4"));
                    }else{
                        $alert.msgDialogError(getRcText("unbindAPGroupFailOther"));
                    } 
                                        
                }

            })
            .error(function (data, status, header, config) {
                //processingFlash--End
                $scope.loading=false;

                $alert.msgDialogError(getRcText("unbindAPGroupFailOther"));
            });
        }   
    }


    //绑定AP Group
    $scope.bind_APGroup_Event = function(){
        //stName通过上一页传递过来
        var stName = $stateParams.stName;
        //bindApGroupList通过secetion方法得到
        var aToBindApGroup = [];
        $scope.$broadcast('getAllSelections#tid_unbindAPGroupStatus_stList',{},function(data){
            aToBindApGroup = data;
        });

        //未勾选
        if(aToBindApGroup.length==0){
            $alert.msgDialogError(getRcText("mustChooseAPGroup"));
            return;
        }

        //已勾选
        bindAPGroup(aToBindApGroup,stName);        

        //绑定AP Group
        function bindAPGroup(aToBindApGroup,stName){
            //传参
            //如果model是空数组
            var tempZhi="";
            var param = [];
            aToBindApGroup.forEach(function(oRow){
                //如果model是空数组
                if(oRow.modelList.length==0){
                    tempZhi="youKongDe";
                    return;
                }

                oRow.modelList.forEach(function(oModel){
                    var sNum = oModel.radioNum;
                    for (var i = 1; i <= sNum; i++) {
                        var paramValue_tmp= {
                            apGroupName: oRow.apGroupName,
                            apModelName: oModel.model,
                            radioId: i,
                            stName: stName
                        };
                        param.push(paramValue_tmp);
                    } 
                });
            });

            //如果model是空数组
            if(tempZhi=="youKongDe"){
                $alert.msgDialogError(getRcText("mustNeedModelAPGroupBind"));
                return ;
            }

            //processingFlash--Start
            $scope.loading=true;
            $scope.message=getRcText("Processing");

            //ajax
            $http.post("/v3/ant/confmgr", {
                devSN: $scope.sceneInfo.sn,
                cfgTimeout:120,
                configType: 0,
                cloudModule: "stamgr",
                deviceModule: "stamgr",
                method: "SSIDBindByAPGroup",
                param: param
            })
            .success(function (data, status, header, config) {
                //processingFlash--End
                $scope.loading=false;

                if(data.errCode==0){
                    $alert.msgDialogSuccess(getRcText("bindAPGroupOK")); 
                    init_Data("apgroup");                   
                }else if((data.errCode==7)&&(data.reason=="Number of service templates bound to the radio has reached the upper limit.")){
                        $alert.msgDialogError(getRcText("bindAPGroupFailLimit"));
                }else{
                    if(data.errCode==3){
                        $alert.msgDialogError(getRcText("bindAPGroupFail3"));
                    }else if(data.errCode==4){
                        $alert.msgDialogError(getRcText("bindAPGroupFail4"));
                    }else{
                        $alert.msgDialogError(getRcText("bindAPGroupFailOther"));
                    } 
                                        
                }

            })
            .error(function (data, status, header, config) {
                //processingFlash--End
                $scope.loading=false;

                $alert.msgDialogError(getRcText("bindAPGroupFailOther"));
            });                
                        
        }
    }   
    

    //解绑AP
    $scope.unbind_AP_Event = function(){
        //stName通过上一页传递过来
        var stName = $stateParams.stName;
        //bindApGroupList通过secetion方法得到
        var aToUnbindAp = [];
        $scope.$broadcast('getAllSelections#tid_bindAPStatus_stList',{},function(data){
            aToUnbindAp = data;
        });

        //未勾选
        if(aToUnbindAp.length==0){
            $alert.msgDialogError(getRcText("mustChooseAP"));
            return;
        }

        //已勾选
        unbindAP(aToUnbindAp,stName);        

        //解绑AP
        function unbindAP(aToUnbindAp,stName){
            //传参
            var param = [];
            
            aToUnbindAp.forEach(function(oRow){                
                var sNum = oRow.radioNum;
                for (var i = 1; i <= sNum; i++) {
                    var paramValue_tmp= {
                        apSN: oRow.apSN,
                        apName: oRow.apName,                    
                        radioId: i,
                        stName: stName
                    };
                    param.push(paramValue_tmp);
                } 

            });

            //processingFlash--Start
            $scope.loading=true;
            $scope.message=getRcText("Processing");

            //ajax
            $http.post("/v3/ant/confmgr", {
                devSN: $scope.sceneInfo.sn,
                cfgTimeout:120,
                configType: 0,
                cloudModule: "stamgr",
                deviceModule: "stamgr",
                method: "SSIDUnbindByAP",
                param: param
            })
            .success(function (data, status, header, config) {
                //processingFlash--End
                $scope.loading=false;

                if(data.errCode==0){
                    $alert.msgDialogSuccess(getRcText("unbindAPFailOK"));
                    init_Data("ap");
                }else{
                    if((data.errCode==7)&&(data.reason=="stamgr data process method is unknown")){
                        $alert.msgDialogError(getRcText("unbindAPFailNeedApsn"));
                    }else{
                        if(data.errCode==3){
                            $alert.msgDialogError(getRcText("unbindAPFail3"));
                        }else if(data.errCode==4){
                            $alert.msgDialogError(getRcText("unbindAPFail4"));
                        }else{
                            $alert.msgDialogError(getRcText("unbindAPFailOther"));
                        } 
                       
                    }
                    return ;
                }
            })
            .error(function (data, status, header, config) {
                //processingFlash--End
                $scope.loading=false;

                $alert.msgDialogError(getRcText("unbindAPFailOther"));
            });
        }   
    }


    //绑定AP
    $scope.bind_AP_Event = function(){
        //stName通过上一页传递过来
        var stName = $stateParams.stName;
        //bindApGroupList通过secetion方法得到
        var aToBindAp = [];
        $scope.$broadcast('getAllSelections#tid_unbindAPStatus_stList',{},function(data){
            aToBindAp = data;
        });

        //未勾选
        if(aToBindAp.length==0){
            $alert.msgDialogError(getRcText("mustChooseAP"));
            return;
        }

        //已勾选
        unbindAP(aToBindAp,stName);        

        //解绑AP
        function unbindAP(aToBindAp,stName){
            //传参
            var param = [];
            
            aToBindAp.forEach(function(oRow){                
                var sNum = oRow.radioNum;
                for (var i = 1; i <= sNum; i++) {
                    var paramValue_tmp= {
                        apSN: oRow.apSN,
                        apName: oRow.apName,                    
                        radioId: i,
                        stName: stName
                    };
                    param.push(paramValue_tmp);
                } 

            });

            //processingFlash--Start
            $scope.loading=true;
            $scope.message=getRcText("Processing");

            //ajax
            $http.post("/v3/ant/confmgr", {
                devSN: $scope.sceneInfo.sn,
                cfgTimeout:120,
                configType: 0,
                cloudModule: "stamgr",
                deviceModule: "stamgr",
                method: "SSIDBindByAP",
                param: param
            })
            .success(function (data, status, header, config) { 
                //processingFlash--End
                $scope.loading=false;

                if(data.errCode==0){
                    $alert.msgDialogSuccess(getRcText("bindAPFailOK"));
                    init_Data("ap");
                }else{
                    if((data.errCode==7)&&(data.reason=="stamgr data process method is unknown")){
                        $alert.msgDialogError(getRcText("bindAPFailNeedApsn"));
                    }else if((data.errCode==7)&&(data.reason=="Number of service templates bound to the radio has reached the upper limit.")){
                        $alert.msgDialogError(getRcText("bindAPFailLimit"));
                    }else{
                       if(data.errCode==3){
                            $alert.msgDialogError(getRcText("bindAPFail3"));
                        }else if(data.errCode==4){
                            $alert.msgDialogError(getRcText("bindAPFail4"));
                        }else{
                            $alert.msgDialogError(getRcText("bindAPFailOther"));
                        }  
                       
                    }
                    return ;
                }
            })
            .error(function (data, status, header, config) {
                //processingFlash--End
                $scope.loading=false;

                $alert.msgDialogError(getRcText("bindAPFailOther"));
            });
        }   
    }


    //返回上一页
    $scope.return = function(){
        $window.history.back();
    }

   
}];
});    