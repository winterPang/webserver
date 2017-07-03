define(["utils",'wirelessconfig2/directive/bindAPGroupDetails','wirelessconfig2/directive/bindAPDetails','wirelessconfig2/directive/ssidDetails'], 
    function (Utils) {
        return ["$scope", "$http", "$state","$alertService", "$rootScope",
            function ($scope, $http, $state, $alert,$rootScope){

                
                //获取HTML变量
                function getRcText (attrName) {
                    var sText = Utils.getRcString("RC", attrName);
                    return sText;
                }


                //全局变量
                $scope.a={};
                $scope.b={};

                //“处理中” 动画关闭
				//START
				$scope.loading=false;						
				//END


                //数据加载
                bsTable_initGrid_initData();
                bsModal2s_initGrid();


                


                //首页 bs_Table初始化 1个
                function bsTable_initGrid_initData(){
                    //[基本]    
                    var bsTable="table_stList";
                    var tid="tid_stList";
                    var url="/v3/ssidmonitor/getssidinfobrief?devSN="+$scope.sceneInfo.sn;
                    
                    var columns=[];
                    var stList_Text=getRcText("stList_Text").split(',');
                    var stList_Value=["stName","ssidName","AuthType","status","ApCnt","ApGroupCnt"];
                    $.each(stList_Text,function(i,item){                        
                        //每个字段
                        var eachCol={
                            title: item,
                            field: stList_Value[i],
                            sortable: true,
                            searcher: {type: "text"},
                            formatter: function(value,row,index){
                                return formatterFun(value,row,index,eachCol.field);
                            } 
                        }; 

                        //status字段特殊处理
                        if(stList_Value[i]=="status"){
                            eachCol.width=100;
                            eachCol.searcher={
                                type: "select",
                                valueField: "statusValue",
                                textField: "statusText",
                                data: [
                                    {statusValue: 1, statusText: getRcText("STATUS_onoff").split(',')[0]},
                                    {statusValue: 2, statusText: getRcText("STATUS_onoff").split(',')[1]}
                                ]
                            };
                        }

                        //AuthType字段特殊处理
                        if(stList_Value[i]=="AuthType"){
                            delete eachCol.searcher;
                            // eachCol.width=200;
                            // eachCol.searcher={
                            //     type: "select",
                            //     valueField: "authTypeValue",
                            //     textField: "authTypeText",
                            //     data: [
                            //         {authTypeValue: 0, authTypeText: getRcText("AuthType_Text").split(',')[0]},
                            //         {authTypeValue: 1, authTypeText: getRcText("AuthType_Text").split(',')[1]},
                            //         {authTypeValue: 2, authTypeText: getRcText("AuthType_Text").split(',')[2]}
                            //     ]
                            // };
                        }

                        columns.push(eachCol);
                    });    

                    
                    init_Grid_Data_Fun(bsTable,tid,url,columns); 


                    //表列显示
                    function formatterFun(value,row,index,fieldValue){
                        
                        //apCount/apGroupCount字段特殊处理
                        if((fieldValue=="ApCnt")||(fieldValue=="ApGroupCnt")||(fieldValue=="stName")){
                            if(value!=0){
                                return '<a>'+value+'</a>';
                            }
                            return value;
                        //status字段特殊处理
                        }else if(fieldValue=="status"){
                            if(value==1){
                                return getRcText("STATUS_onoff").split(',')[0];
                            }else{
                                return getRcText("STATUS_onoff").split(',')[1];
                            }
                        //认证方式字段特殊处理
                        }else if(fieldValue=="AuthType"){    

                            var tempIcons="";
                            var tempTitles="";

                            //不认证
                            if(value[0]==0){
                                tempIcons += ''+getRcText("AuthType_Text").split(',')[0]+'&nbsp;&nbsp;'+'<img style="width:20px;height:20px;" src="images/img_authtype/icon-brz.png" />';
                                tempTitles += ''+getRcText("AuthType_Text").split(',')[0]+'';                                

                            //一键认证
                            }else if(value[0]==1){
                                tempIcons += ''+getRcText("AuthType_Text").split(',')[1]+'&nbsp;&nbsp;'+'<img style="width:20px;height:20px;" src="images/img_authtype/icon-yjrz.png" />';
                                tempTitles += ''+getRcText("AuthType_Text").split(',')[1]+'';                                

                            //账号认证
                            }else if(value[0]==2){
                                tempIcons += ''+getRcText("AuthType_Text").split(',')[2]+'';
                                tempTitles += ''+getRcText("AuthType_Text").split(',')[7]+'';                                 

                                $.each(value[1],function(i,item){
                                    if(item==0){

                                    }else{
                                        if(i==0){
                                            tempIcons += '<img style="width:20px;height:20px;" src="images/img_authtype/gd.jpg" />';
                                            tempTitles += ''+getRcText("AuthType_Text").split(',')[3]+'';
                                        }else if(i==1){
                                            tempIcons += '<img style="width:20px;height:20px;" src="images/img_authtype/dx.jpg" />';  
                                            tempTitles += ''+getRcText("AuthType_Text").split(',')[4]+'';      
                                        }else if(i==2){
                                            tempIcons += '<img style="width:20px;height:20px;" src="images/img_authtype/gzh.jpg" />';
                                            tempTitles += ''+getRcText("AuthType_Text").split(',')[5]+'';        
                                        }else{
                                            tempIcons += '<img style="width:20px;height:20px;" src="images/img_authtype/WIFI.jpg" />';
                                            tempTitles += ''+getRcText("AuthType_Text").split(',')[6]+'';
                                        }
                                    }
                                });

                            } 
                            return '<div title="'+tempTitles+'">'+tempIcons+'</div>';       
                        //其他                    
                        }else{
                            return value;
                        }
                    }                
                }


                //bs_Table_initGrid_[GET、Client]
                function init_Grid_Data_Fun(bsTable,tid,url,columns){

                    //方法调用
                    init_Grid(bsTable,tid,columns);
                    responseHandler_manage(tid, url);

                    
                    //画表
                    function init_Grid(bsTable,tid,columns){     
                        //画表                
                        $scope[""+bsTable+""] = {
                            //tid
                            tId: tid,
                            sortable:true,           
                            searchable: true,
                            showPageList: true,
                            showCheckBox: false,
                            showRowNumber: false,
                            clickToSelect: false,                
                            //表列_点击事件
                            onClickCell: function (field, value, row) {
                                openDialog(field, value, row);            
                            },                             
                            

                            // sidePagination: "client",
                            // method: "GET",
                            // url: url,
                            // contentType: "application/json",
                            // dataType: "json",
                            // queryParams: function (params) {                    
                            //     return {};
                            // },

                            // //返回值_解析
                            // responseHandler: function (data) {                    
                            //     return responseHandler_manage(data,tid);    
                            // },


                            //表列_内容
                            columns: columns
                        }; 
                        

                        //分级分权
                        $scope.$watch('permission', function (v) {
                            //2  根据权限，做“相应按钮的显示、隐藏”处理：
                            //2-1  有写权限
                            if($scope.permission.write==true){
                                $scope[""+bsTable+""].operateWidth= 240;
                                $scope[""+bsTable+""].operateTitle=getRcText("TEXT_operate");
                                $scope[""+bsTable+""].operate={
                                    bind:  function(e,row,$btn){
                                        // $state.go('^.edit',{stname:row.stName});
                                        bindOrUnbindEvent(e,row,$btn);
                                    }, 
                                    edit:  function(e,row,$btn){
                                        // $state.go('^.edit',{stname:row.stName});
                                        editEvent(e,row,$btn);
                                    },                                                                                 
                                    remove:function(e,row,$btn){
                                        $alert.confirm(getRcText("sureDelete"), 
                                        function () {
                                            removeEventPre(e,row,$btn);
                                        });
                                    },                                                                             
                                };
                                $scope[""+bsTable+""].tips={                       
                                    bind: getRcText("OPTION_operate").split(",")[0], 
                                    edit: getRcText("OPTION_operate").split(",")[1], 
                                    remove: getRcText("OPTION_operate").split(",")[2]                                                           
                                };
                                $scope[""+bsTable+""].icons={ 
                                    bind:'fa fa-link',                                                                                                   
                                    edit:'fa fa-edit',  
                                    remove:'fa fa-trash',                                          
                                };
                            //2-2  无写权限
                            }else if($scope.permission.write==false){
                                delete $scope[""+bsTable+""].operateWidth;
                                delete $scope[""+bsTable+""].operateTitle;
                                delete $scope[""+bsTable+""].operate;
                                delete $scope[""+bsTable+""].tips;
                                delete $scope[""+bsTable+""].icons;
                            //2-3  权限未获取到
                            }else{
                                console.error("Permission GetFailed");
                            }
                        }, true);


                        //表列弹框
                        function openDialog(field, value, row){
                            if(field=="ApCnt"){
                                if(value!=0){
                                    //全局变量一直在变化
                                    $scope.$apply(function(){
                                        $scope.a.stnamevaluegive=row.stName;
                                    });
                                    //弹出modal模态框
                                    $scope.$broadcast('show#mid_apDialog');
                                }
                            }else if(field=="ApGroupCnt"){
                                if(value!=0){
                                    //全局变量一直在变化
                                    $scope.$apply(function(){
                                        $scope.a.stnamevaluegive=row.stName;
                                    });
                                    //弹出modal模态框
                                    $scope.$broadcast('show#mid_apgroupDialog');
                                }
                            }else if(field=="stName"){
                                
                                //全局变量一直在变化
                                $scope.$apply(function(){
                                    $scope.b.stname_tr=value;            
                                    $scope.b.sn_tr=$scope.sceneInfo.sn;
                                });
                                //弹出modal模态框
                                $scope.$broadcast('show#mid_ssiddetailDialog');
                                
                            }
                        }                        
                    }

                }

                //给表格填充数据
                function responseHandler_manage(tid, url){
                    setTimeout(function(){$scope.$broadcast('showLoading#'+tid);});
                    // 首页，要有：“认证方式”字段  [2016-12-04]
                    addAuthType_getStInfo();

                    //ssidInfo
                    //ajax
                    function addAuthType_getStInfo(){
                        $http.get(url, {})
                        .success(function (data, status, header, config) {
                            //SSID信息
                            var ssidArry=data.ssidList;
                            //To Get Pub
                            addAuthType_getPubInfo(ssidArry);
                        })
                        .error(function (data, status, header, config) {
                            //提示
                            $alert.msgDialogError(getRcText("getST_fail"));
                            //SSID信息
                            var ssidArry=[];
                            // To Get Pub
                            addAuthType_getPubInfo(ssidArry);
                        });
                    }
                    

                    //pubInfo
                    //ajax
                    function addAuthType_getPubInfo(ssidArry){
                        //ajax                                
                        $http.get("/v3/ace/oasis/auth-data/o2oportal/pubmng/query?nasId="+$scope.sceneInfo.nasid, {})
                        .success(function (data, status, header, config) {
                            //pub信息
                            var pubArry=data.data;
                            //To Get Auth
                            addAuthType_getAuthInfo(ssidArry,pubArry);
                        })
                        .error(function (data, status, header, config) {
                            //提示
                            $alert.msgDialogError(getRcText("allPubInfoFail"));
                            //pub信息
                            var pubArry=[];
                            //To Get Auth
                            addAuthType_getAuthInfo(ssidArry,pubArry);
                        }); 
                    }  

                    //authInfo
                    //ajax
                    function addAuthType_getAuthInfo(ssidArry,pubArry){
                        $http.get("/v3/ace/oasis/auth-data/o2oportal/authcfg/query?storeId="+$scope.sceneInfo.nasid+"&v3flag=1", {

                        })
                        .success(function (data, status, header, config) { 
                            //auth信息
                            var authArry=data.data;  
                                             
                            //拼接
                            var pubArryNew=mAndn_pubAuth_PinJieData(pubArry,authArry);
                            var arrayEnd = mAndn_stPub_PinJieData(ssidArry,pubArryNew);
                            $scope.$broadcast('hideLoading#'+tid);
                            $scope.$broadcast('load#'+tid,arrayEnd);
                        })
                        .error(function (data, status, header, config) {
                            //提示
                            $alert.msgDialogError(getRcText("allAuthInfoFail"));  
                            //auth信息
                            var authArry=[]; 

                            //拼接
                            var pubArryNew=mAndn_pubAuth_PinJieData(pubArry,authArry);
                            var arrayEnd = mAndn_stPub_PinJieData(ssidArry,pubArryNew);
                            $scope.$broadcast('hideLoading#'+tid);
                            $scope.$broadcast('load#'+tid,arrayEnd); 
                        });
                    }
                    
                    //处理Data1  FUNC
                    function mAndn_pubAuth_PinJieData(pubArry,authArry){
                        //创建中间件obj1对象
                        var obj1 = {};

                        // 遍历一遍n，得到：
                        for(var i = 0; i < authArry.length;i++){
                            //先把属性格式，转变
                            authArry[i].AuthType=[authArry[i].authType,[authArry[i].isEnableAccount,authArry[i].isEnableSms,authArry[i].isEnableWeixin,authArry[i].isWeixinConnectWifi]];
                            //利用唯一标识，填充obj1对象
                            obj1[authArry[i].authCfgTemplateName] = authArry[i];
                        }
                        console.log(obj1);

                        // 遍历一遍m，得到：
                        for(var i = 0; i < pubArry.length;i++){
                            if(obj1[pubArry[i].authCfgName]){
                                pubArry[i].AuthType=obj1[pubArry[i].authCfgName].AuthType;
                            }else{
                                pubArry[i].AuthType=[0,[0,0,0,0]];
                            }
                        }
                        console.log(pubArry);
                        return pubArry;
                       
                    }

                    //处理Data2  FUNC
                    function mAndn_stPub_PinJieData(ssidArry,pubArry){
                        //创建中间件obj1对象
                        var obj1 = {};

                        // 遍历一遍m，得到：
                        for(var i = 0; i < ssidArry.length;i++){
                            //先把属性造全
                            ssidArry[i].AuthType=[0,[0,0,0,0]];
                            //利用唯一标识，填充obj1对象
                            obj1[ssidArry[i].ssid] = ssidArry[i];
                        }
                        console.log(obj1);

                        // 遍历一遍n，得到：
                        for(var i = 0; i < pubArry.length;i++){
                            if(obj1[pubArry[i].ssidIdV3]){
                                obj1[pubArry[i].ssidIdV3].AuthType=pubArry[i].AuthType;
                            }
                        }
                        console.log(obj1);

                        //以数组形式打印
                        var arr=[];
                        var i = 0 ;
                        for(i in obj1){
                            arr.push(obj1[i]);
                        }
                        console.log(arr);                        
                        return arr;
                    }                              
                }                
                    

                //AP 1个，AP Group 1个：bsModal弹框
                function bsModal2s_initGrid(){
                    //AP Group弹框
                    var modal_name="apgroupDialog";
                    var mid="mid_apgroupDialog";
                    var title=getRcText("TITLE_dialog").split(',')[0];
                    bsModal_initGrid_Fun(modal_name,mid,title);

                    //AP弹框
                    var modal_name="apDialog";
                    var mid="mid_apDialog";
                    var title=getRcText("TITLE_dialog").split(',')[1];
                    bsModal_initGrid_Fun(modal_name,mid,title);

                    //ssid详情弹框
                    var modal_name="ssiddetailDialog";
                    var mid="mid_ssiddetailDialog";
                    var title=getRcText("TITLE_dialog").split(',')[2];
                    bsModal_initGrid_Fun(modal_name,mid,title);
                }


                //bsModal弹框初始化
                function bsModal_initGrid_Fun(modal_name,mid,title){
                    $scope[modal_name] = {
                        mId: mid,
                        title: title,
                        autoClose: true,
                        showCancel: false,
                        okText: getRcText("Close").split(',')[1],
                        modalSize: "lg", // normal、sm、lg
                        showHeader: true,
                        showFooter: true,
                        okHandler: function (modal, $ele) {
                            
                        },
                        cancelHandler: function (modal, $ele) {
                        },
                        beforeRender: function ($ele) {
                        }
                    };
                }






                //多项操作
                $scope.addEvent = function () {
                    $state.go('^.addOperate'); 
                }

                
                function removeEventPre(e,row,$btn){
                    //pre

                    //“处理中” 动画开启
					//START
					$scope.loading=true;
                    $scope.message=getRcText("deleteProcessing");
					//END

                    $http.get("/v3/ssidmonitor/getssidinfobrief?devSN="+$scope.sceneInfo.sn+"&stName="+row.stName, {})
                    .success(function (data, status, header, config) {
                        if(data.ssidList.length==1){
                            var aBindAp = data.ssidList[0].bindApList;                        
                            var aBindApGroup = data.ssidList[0].bindApGroupList;
                            removeEvent(e,row,$btn,aBindAp,aBindApGroup);
                        }else{
                        	//“处理中” 动画关闭
							//START
							$scope.loading=false;						
							//END

                            $alert.msgDialogError(getRcText("getDataFailed"));
                        }                            
                    })
                    .error(function (data, status, header, config) {
                    	//“处理中” 动画关闭
						//START
						$scope.loading=false;						
						//END
										
                        $alert.msgDialogError(getRcText("getDataFailed"));
                    });

                    //remove
                    function removeEvent(e,row,$btn,aBindAp,aBindApGroup){
                        //准备参数
                        var stName = row.stName;
                        var ssidIdV3 = row.ssid;						
						

                        unbindAP(aBindAp,aBindApGroup,stName,ssidIdV3);        

                        //解绑AP
                        function unbindAP(aBindAp,aBindApGroup,stName,ssidIdV3){
                            if(aBindAp.length==0){
                                unbindAPGroup(aBindApGroup,stName,ssidIdV3);
                                return ;
                            }else{
                                //传参
                                var param = [];
                                aBindAp.forEach(function(bind){
                                    if (bind.isInherit == 0) {
                                        var paramValue = {
                                            apSN: bind.apSN,
                                            apName: bind.apName,
                                            radioId: bind.radioId,
                                            stName: stName
                                        };
                                        param.push(paramValue);
                                    };
                                });
                                //ajax
                                $http.post("/v3/ant/confmgr", {
                                    devSN: $scope.sceneInfo.sn,
                                    configType: 0,                     
                                    cloudModule: "stamgr",
                                    deviceModule: "stamgr",
                                    method: "SSIDUnbindByAP",
                                    param: param
                                })
                                .success(function (data, status, header, config) {
                                    if(data.errCode==0){
                                        unbindAPGroup(aBindApGroup,stName,ssidIdV3);
                                    }else{
                                    	//“处理中” 动画关闭
										//START
										$scope.loading=false;						
										//END

                                        if((data.errCode==7)&&(data.reason=="stamgr data process method is unknown")){
                                            $alert.msgDialogError(getRcText("unbindAP_FAILED_NEEDApsn"));
                                        }else{
                                            if(data.errCode==3){
                                                $alert.msgDialogError(getRcText("unbindAP_FAILED_3"));
                                            }else if(data.errCode==4){
                                                $alert.msgDialogError(getRcText("unbindAP_FAILED_4"));
                                            }else{
                                                $alert.msgDialogError(getRcText("unbindAP_FAILED_Other"));
                                            }                                           
                                        }
                                        return ;
                                    }
                            
                                })
                                .error(function (data, status, header, config) {
                                	//“处理中” 动画关闭
									//START
									$scope.loading=false;						
									//END

                                    $alert.msgDialogError(getRcText("unbindAP_FAILED_Other"));
                                });
                            }
                            
                        }

                        //解绑AP Group
                        function unbindAPGroup(aBindApGroup,stName,ssidIdV3){
                            //没有需要解绑的
                            if(aBindApGroup.length==0){
                                deleteSSID(stName,ssidIdV3);
                                return ;
                            //有需要解绑的
                            }else{
                                //如果model是空数组
                                var tempZhi="";

                                var param = [];
                                aBindApGroup.forEach(function(bind){
                                    //如果model是空数组
                                    if(bind.ApModel==""){
                                        tempZhi="youKongDe";
                                        return;
                                    }

                                    var paramValue = {
                                        apGroupName: bind.ApGroupName,
                                        apModelName: bind.ApModel,
                                        radioId: bind.radioId,
                                        stName: stName
                                    };
                                    param.push(paramValue);
                                });

                                //如果model是空数组
                                if(tempZhi=="youKongDe"){
                                	//“处理中” 动画关闭
									//START
									$scope.loading=false;						
									//END

                                    $alert.msgDialogError(getRcText("unbindAPGroup_FAILED_NeedModel"));
                                    return ;
                                }

                                //ajax
                                $http.post("/v3/ant/confmgr", {
                                    devSN: $scope.sceneInfo.sn,
                                    configType: 0,
                                    cloudModule: "stamgr",
                                    deviceModule: "stamgr",
                                    method: "SSIDUnbindByAPGroup",
                                    param: param
                                })
                                .success(function (data, status, header, config) {
                                    if(data.errCode==0){
                                        deleteSSID(stName,ssidIdV3);
                                    }else{
                                    	//“处理中” 动画关闭
										//START
										$scope.loading=false;						
										//END

                                        if(data.errCode==3){
                                            $alert.msgDialogError(getRcText("unbindAPGroup_FAILED_3"));
                                        }else if(data.errCode==4){
                                            $alert.msgDialogError(getRcText("unbindAPGroup_FAILED_4"));
                                        }else{
                                            $alert.msgDialogError(getRcText("unbindAPGroup_FAILED_Other"));
                                        }                                         
                                        return ;
                                    }

                                })
                                .error(function (data, status, header, config) {
                                	//“处理中” 动画关闭
									//START
									$scope.loading=false;						
									//END

                                    $alert.msgDialogError(getRcText("unbindAPGroup_FAILED_Other"));
                                });
                            }

                        }

                        //删除服务模板
                        function deleteSSID(stName,ssidIdV3){
                            //ajax
                            $http.post("/v3/ant/confmgr", {
                                devSN: $scope.sceneInfo.sn,
                                configType: 0,
                                cloudModule: "stamgr",
                                deviceModule: "stamgr",
                                method: "SSIDDelete",
                                param: [{
                                    stName: stName
                                }]
                            })
                            .success(function (data, status, header, config) {
                                if(data.errCode==0)
                                {
                                    deletePub(ssidIdV3);                
                                }
                                else 
                                {
                                    //“处理中” 动画关闭
									//START
									$scope.loading=false;						
									//END

									if((data.errCode==7)&&(data.reason=="The service template does not exist.")){
                                        $alert.msgDialogError(getRcText("ssidDeleteFailed_noExist"));
                                    }else if((data.errCode==7)&&(data.reason=="Can't remove the service template.It has been mapped to a radio.")){
                                        $alert.msgDialogError(getRcText("ssidDeleteFailed_isBind"));                        
                                    }else{
                                        if(data.errCode==3){
                                            $alert.msgDialogError(getRcText("ssidDeleteFailed_3"));
                                        }else if(data.errCode==4){
                                            $alert.msgDialogError(getRcText("ssidDeleteFailed_4"));
                                        }else{
                                            $alert.msgDialogError(getRcText("ssidDeleteFailed_Other"));
                                        }                                                                                
                                    }
                                    return ;
                                }                

                            })
                            .error(function (data, status, header, config) {
                            	//“处理中” 动画关闭
								//START
								$scope.loading=false;						
								//END

                                $alert.msgDialogError(getRcText("ssidDeleteFailed_Other"));
                            });            
                        }

                        //删除发布模板
                        function deletePub(ssidIdV3){
                            //ajax
                            $http.get("/v3/ace/oasis/auth-data/o2oportal/pubmng/deleteBySsidV3?ssidV3="+ssidIdV3+"&nasId="+$scope.sceneInfo.nasid, {
                                
                            })
                            .success(function (data, status, header, config) {
                            	//“处理中” 动画关闭
								//START
								$scope.loading=false;						
								//END

                                if(data.errorcode==0||data.errorcode==1307){
                                    // 提示删除成功
                                    $alert.msgDialogSuccess(getRcText("ssidDeleteOK"));
                                    // 刷新当前页面
                                    responseHandler_manage("tid_stList","/v3/ssidmonitor/getssidinfobrief?devSN="+$scope.sceneInfo.sn);
                                }else{
                                    // 提示失败
                                    $alert.msgDialogError(getRcText("ssidDeleteOK_pubDeleteFailed"));
                                    // 刷新当前页面
                                    responseHandler_manage("tid_stList","/v3/ssidmonitor/getssidinfobrief?devSN="+$scope.sceneInfo.sn);

                                }

                            })
                            .error(function (data, status, header, config) {
                            	//“处理中” 动画关闭
								//START
								$scope.loading=false;						
								//END

                                // 提示失败
                                $alert.msgDialogError(getRcText("ssidDeleteOK_pubDeleteFailed"));
                                // 刷新当前页面
                                responseHandler_manage("tid_stList","/v3/ssidmonitor/getssidinfobrief?devSN="+$scope.sceneInfo.sn);

                            });            
                        }        
                    }
                }           

                


                function editEvent(e,row,$btn){
                    $state.go('^.editOperate',{stName:row.stName, ssid:row.ssid});        
                }


                $scope.syncEvent = function () {
                    syncEvent();


                    //同步
                    function syncEvent(){
                        $http.post("/v3/ant/confmgr", {
                            devSN: $scope.sceneInfo.sn,
                            module : "stamgr",
                                method : "SyncSSIDList",
                                configType:0,
                                cloudModule:"stamgr",
                                deviceModule:"stamgr",
                                param:[{
                                        
                                }]
                        })
                        .success(function (data, status, header, config) {
                            if(data.errCode!=0){
                                if((data.errCode==7)&&(data.result=="stamgr data process method is unknown")){
                                    $alert.msgDialogError(getRcText("syncFailed_low"));
                                    return;
                                }else{
                                    if(data.errCode==3){
                                        $alert.msgDialogError(getRcText("syncFailed_3"));
                                    }else if(data.errCode==4){
                                        $alert.msgDialogError(getRcText("syncFailed_4"));
                                    }else{
                                        $alert.msgDialogError(getRcText("syncFailed_other"));
                                    }
                                    return;
                                }
                            }else{
                                    $alert.msgDialogSuccess(getRcText("syncOK"));

                                    // 刷新当前页面
                                    setTimeout(responseHandler_manage("tid_stList","/v3/ssidmonitor/getssidinfobrief?devSN="+$scope.sceneInfo.sn)
                                    ,3000);
                                    
                                    //按钮禁用30秒
                                    synSsidDisable();
                            }

                        })
                        .error(function (data, status, header, config) {
                            $alert.msgDialogError(getRcText("syncFailed_other"));
                        });            
                    }  

                    //后期效果变动
                    function synSsidDisable()
                    {        
                       $("#syncBtn").addClass("disabled");
                       var i = 30;
                       var seconds=getRcText("SECONDS");
                       var syn=getRcText("SYN");
                       var setIntervalTime = setInterval(function(){
                    
                            $("#syncBtn").addClass("disabled");
                            $("#syncBtn").html(i+seconds);
                           
                            if(i == 0)
                            {
                                clearInterval(setIntervalTime);
                                $("#syncBtn").removeClass("disabled");
                                $("#syncBtn").html(syn);
                                
                            }

                            i--;

                       },1000)               
                    }      
                }


                function bindOrUnbindEvent(e,row,$btn){
                    $state.go('^.bindOrUnbindOperate',{stName:row.stName});        
                }

   
}];
});    