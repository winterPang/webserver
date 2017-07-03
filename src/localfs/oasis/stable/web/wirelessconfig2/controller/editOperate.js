define(["utils"], 
    function (Utils) {
        return ["$scope", "$http", "$state","$alertService","$window",'$stateParams', 
            function ($scope, $http, $state, $alert, $window, $stateParams){


                //【获取HTML变量】
                function getRcText (attrName) {
                    var sText = Utils.getRcString("RC", attrName);
                    return sText;
                }               



                //START
                //1  全局变量
                var g_pubInfo = "";

                //ssid processingFlash--Start0
                $scope.loading=false;

                //2  方法调用
                initForm();
                // 3  2个按钮事件
                // --
                //END



                //【初始化FORM】
                function initForm(){
                    //0  清空错误提示
                     $('.error').hide();

                    //1  给2个下拉框赋值
                    two_select2();

                    function two_select2(){
                        var select2="authList";
                        var sId="authListId";
                        init_Data_select2(select2,sId);

                        var select2="themeList";
                        var sId="themeListId";
                        init_Data_select2(select2,sId);
                    }

                    function init_Data_select2(select2,sId){
                        //url
                        var url="";
                        if(select2=="authList"){
                            url="authcfg/query";
                        }else{
                            // url="themetemplate/query";
                            url="pagetemplate/queryAllData";
                        }
                        //发请求
                        $http.get("/v3/ace/oasis/auth-data/o2oportal/"+url+"?storeId="+$scope.sceneInfo.nasid+"&v3flag=1", {

                        })
                        .success(function (data, status, header, config) {                        
                            var dataNew=[];
                            if(url=='pagetemplate/queryAllData'){
                                $.each(data.data,function(i,item){
                                    // newItem定义
                                    var newItem={};
                                    //_itemValue
                                    var itemValue=item.newThemeName;
                                    //_itemText
                                    var item=item.newThemeName;
                                    var tempV=item.lastIndexOf('_'); 
                                    var itemName=item.substring(0,tempV);
                                    var itemTag=item.substr(tempV+1,1);
                                    if(itemTag==1){
                                       itemTag=getRcText("themeType1"); 
                                    }else if(itemTag==2){
                                       itemTag=getRcText("themeType2"); 
                                    }else{
                                       itemTag=getRcText("themeType3"); 
                                    }
                                    var itemText=itemName+itemTag;
                                    // newItem赋值
                                    newItem.id=itemValue;
                                    newItem.text=itemText;
                                    // --
                                    dataNew.push(newItem);    
                                });
                            }else{
                                $.each(data.data,function(i,item){
                                    dataNew.push(item.authCfgTemplateName);
                                }); 
                            }                       
                            init_Grid_select2(select2,sId,dataNew);
                            pubValueShow();
                        })
                        .error(function (data, status, header, config) {
                            if(select2=="authList"){
                                $alert.msgDialogError(getRcText("getAuthList_Failed"));
                            }else{
                                $alert.msgDialogError(getRcText("getThemeList_Failed"));
                            }                    
                        });
                    } 

                    function init_Grid_select2(select2,sId,dataNew){
                        $scope[select2]={
                            sId: sId,
                            allowClear: false, 
                            placeholder: getRcText("pleaseChoose"),
                            closeOnSelect: true,
                            data:dataNew                         
                        };                    
                    }   
                    

                    //2  一些选项的隐藏或显示控制                
                    //st状态
                    $scope.ststatus={};
                    $scope.ststatus.status=false;
                    $scope.ststatus.ssidDuteValue=0;
                    $scope.stStatusClick = function (param) {
                        if(param==1){
                            $scope.ststatus.status=true;
                        }else{
                            $scope.ststatus.status=false;
                        }
                    }
                    //st加密
                    $scope.stkeystatus={};
                    $scope.stkeystatus.status=false;
                    $scope.stKeyStatusClick = function (param) {
                        if(param==1){
                            $scope.stkeystatus.status=true;
                        }else{
                            $scope.stkeystatus.status=false;
                        }
                    }
                    //st是否认证
                    $scope.sureauthstatus={};
                    $scope.sureauthstatus.status=false;
                    $scope.sureAuthStatusClick = function (param) {
                        if(param==1){
                            $scope.sureauthstatus.status=true;
                        }else{
                            $scope.sureauthstatus.status=false;
                        }
                    }


                    //3  数据回显
                    //服务模板，值回显
                    $http.get("/v3/ssidmonitor/getssidlist?devSN="+$scope.sceneInfo.sn+"&stName="+$stateParams.stName, {
                    })
                    .success(function (data, status, header, config) {
                        //stName
                        $("#stName").html(''+data.ssidList[0].stName);
                        //ssid
                        $("#ssid").html(''+data.ssidList[0].ssidName);
                        //status
                        if(data.ssidList[0].status==1){
                            $scope.ststatus.status = true;
                        }else{
                            $scope.ststatus.status = false;
                        }
                        //HideSSID
                        $scope.ststatus.ssidDuteValue=data.ssidList[0].hideSSID;
                        
                        //akmmode
                        if(data.ssidList[0].akmMode==2){
                            $scope.stkeystatus.status = true;
                            $("#stKeyString").attr("placeholder","********");
                        }else{
                            $scope.stkeystatus.status = false;
                            $("#stKeyString").attr("placeholder","");
                        }         
                    })
                    .error(function (data, status, header, config) {
                        $alert.msgDialogError(getRcText("getST_failed"));
                    });

                    //发布模板，值回显
                    function pubValueShow(){

                        $http.get("/v3/ace/oasis/auth-data/o2oportal/pubmng/queryBySsidV3/"+$stateParams.ssid+"/"+$scope.sceneInfo.nasid, {
                        })
                        .success(function (data, status, header, config) {
                            if(data.errorcode==0){
                                $scope.sureauthstatus.status = true;                                
                                // 认证
                                $("#authList").val(data.data.authCfgName);
                                $("#select2-authList-container").attr('title',data.data.authCfgName);
                                $("#select2-authList-container").html(data.data.authCfgName);
                                // 页面                                
                                //_itemId
                                var itemId=data.data.newThemeName;
                                //_itemText
                                var item=data.data.newThemeName;
                                var tempV=item.lastIndexOf('_'); 
                                var itemName=item.substring(0,tempV);
                                var itemTag=item.substr(tempV+1,1);
                                if(itemTag==1){
                                   itemTag=getRcText("themeType1"); 
                                }else if(itemTag==2){
                                   itemTag=getRcText("themeType2"); 
                                }else{
                                   itemTag=getRcText("themeType3"); 
                                }
                                var itemText=itemName+itemTag;
                                //                                
                                $("#themeList").val(itemId); 
                                $("#select2-themeList-container").attr('title',itemText);
                                $("#select2-themeList-container").html(itemText);

                                g_pubInfo="have";                         
                            }else if(data.errorcode==1307){
                                $scope.sureauthstatus.status = false;

                                g_pubInfo="nohave";                          
                            }else{                            
                                $alert.msgDialogError(getRcText("getPUB_failed"));
                            }            
                        })
                        .error(function (data, status, header, config) {
                            $alert.msgDialogError(getRcText("getPUB_failed"));
                        });     
                    }
                                    
                }



                //【下发FORM】

                //1  点击“确定”按钮
                $scope.okEvent = function (){
                    getDataFromForm();
                }

                function getDataFromForm(){

                    data_Get_Process("submit");

                    //参数处理
                    function data_Get_Process(comeFrom){
                        //
                        var tempValue=0;
                        $('.error').hide();

                        //1-A 从Form中取值
                        //基本
                        var stNameGet=$('#stName').html();
                        var ssidGet=$('#ssid').html();

                        var stGet=1;
                        if($scope.ststatus.status==true){
                            stGet=1;
                        }else{
                            stGet=2;
                        }                    
                        //加密
                        var stKeyGet=1;
                        if($scope.stkeystatus.status==true){
                            stKeyGet=1;
                        }else{
                            stKeyGet=0;
                        }
                        var stKeyStringGet=$('#stKeyString').val();


                        //认证
                        var sureAuthGet=1;
                        if($scope.sureauthstatus.status==true){
                            sureAuthGet=1;
                        }else{
                            sureAuthGet=0;
                        }
                        var authListGet=$('#authList').val();
                        var themeListGet=$('#themeList').val();                        


                        //1-C 对值进行校验，给出错误提示
                        
                        //选择加密的话：psk不能“为空”（允许:空格、中文）                            
                        if(stKeyGet==1){  
                            var tempA=$('#stKeyString').attr("placeholder");
                            if(tempA=="********"){
                                //不能低于8个字符
                                if ((stKeyStringGet!="")&&(stKeyStringGet.length < 8)) {
                                    $('#stKeyString_error').html(getRcText("psk_dayu8"));
                                    $('#stKeyString_error').show();
                                    tempValue=1;                                            
                                }   
                            }else{
                                //必填                    
                                if(stKeyStringGet==""){
                                    $('#stKeyString_error').html(getRcText("psk_required"));
                                    $('#stKeyString_error').show();
                                    tempValue=1;
                                } 
                                //不能低于8个字符
                                if ((stKeyStringGet!="")&&(stKeyStringGet.length < 8)) {
                                    $('#stKeyString_error').html(getRcText("psk_dayu8"));
                                    $('#stKeyString_error').show();
                                    tempValue=1;                                            
                                }     
                            }                             
                                                 
                        }
                               


                        //选择认证的话：必选项就不能为空
                        //必选 
                        
                        if(sureAuthGet==1){
                            if(authListGet==null){
                                $('#authList_error').html(getRcText("needAuth"));
                                $('#authList_error').show();
                                tempValue=1;
                            }
                            if(themeListGet==null){
                                $('#themeList_error').html(getRcText("needTheme"));
                                $('#themeList_error').show();
                                tempValue=1;
                            }
                        }  


                        //准备下发
                        if(comeFrom=="submit"){
                            //
                            var result="no";
                            if(tempValue==1){                            
                                result="no";
                            }else{
                                result="yes";
                                dataSSIDAjax(result, stNameGet, ssidGet, stGet, stKeyGet, stKeyStringGet, sureAuthGet, authListGet, themeListGet, "SSIDUpdateOne");                     
                            } 
                        }
                    }

                    //SSID
                    function dataSSIDAjax(result, stNameGet, ssidGet, stGet, stKeyGet, stKeyStringGet, sureAuthGet, authListGet, themeListGet, methodValue){
                        //1-C 表单下发

                        //ssidAdd processingFlash--Start0
                        $scope.loading=true;
                        $scope.message=getRcText("Processing");

                        //传参
                        var pDate = [];
                        if (stKeyGet==1) {
                            var otemp = {
                                stName:stNameGet,
                                ssidName:ssidGet,
                                status:stGet,
                                hideSSID:parseInt($scope.ststatus.ssidDuteValue),
                                akmMode:1,
                                cipherSuite:20,
                                securityIE:3,
                                psk:stKeyStringGet,
                                description:"3"
                            };
                        }else{
                            var otemp = {
                                stName:stNameGet,
                                ssidName:ssidGet,
                                status:stGet,
                                hideSSID:parseInt($scope.ststatus.ssidDuteValue),
                                akmMode:0,
                                cipherSuite:0,
                                securityIE:0,
                                psk:"",
                                description:"3"
                            };
                        }

                        //[新]校验：如果shared_key是空的，那就不传此字段
                        if ((stKeyGet==1)&&(otemp.psk=="")){
                            delete otemp.psk;
                        }

                        pDate.push(otemp);

                        //ajax
                        $http.post("/v3/ant/confmgr", {
                            devSN: $scope.sceneInfo.sn,                                         
                            configType:0,
                            module : "stamgr",
                            cloudModule:"stamgr",
                            deviceModule:"stamgr",
                            method: methodValue,
                            param: pDate
                        })
                        .success(function (data, status, header, config) {
                            //旧接口
                            if(methodValue=="SSIDUpdate"){
                                //失败
                                if(data.errCode!=0){
                                    //返回失败 processingFlash--End
                                    $scope.loading=false;

                                    if(data.errCode==3){
                                        $alert.msgDialogError(getRcText("stModifyFail3"));
                                    }else if(data.errCode==4){
                                        $alert.msgDialogError(getRcText("stModifyFail4"));
                                    }else{
                                        $alert.msgDialogError(getRcText("stModifyFailOther"));
                                    }                                     
                                    return;
                                //成功
                                }else{
                                    dataAuthAjax(stNameGet, ssidGet, sureAuthGet, authListGet, themeListGet);
                                } 
                            //新接口
                            }else if(methodValue=="SSIDUpdateOne"){
                                //新接口-->旧接口
                                if((data.errCode==7)&&(data.reason=="stamgr data process method is unknown")){
                                    //返回失败 processingFlash--End
                                    $scope.loading=false;

                                    //[旧]校验：密钥不允许为空
                                    if((stKeyGet==1) && (!otemp.psk)){
                                        $alert.msgDialogError(getRcText("PSK_String_ziduan"));
                                        return;
                                    //[旧]提示：可能丢配置
                                    }else{
                                        $alert.confirm(getRcText("LoseConfig"),function()
                                        {                                            
                                            dataSSIDAjax(result, stNameGet, ssidGet, stGet, stKeyGet, stKeyStringGet, sureAuthGet, authListGet, themeListGet, "SSIDUpdate");
                                            return;
                                        });
                                    }
                                //新接口-->OK
                                }else{
                                    //失败
                                    if(data.errCode!=0){
                                        //返回失败 processingFlash--End
                                        $scope.loading=false;

                                        if(data.errCode==3){
                                            $alert.msgDialogError(getRcText("stModifyFail3"));
                                        }else if(data.errCode==4){
                                            $alert.msgDialogError(getRcText("stModifyFail4"));
                                        }else{
                                            $alert.msgDialogError(getRcText("stModifyFailOther"));
                                        }                                         
                                        return;
                                    //成功
                                    }else{
                                        dataAuthAjax(stNameGet, ssidGet, sureAuthGet, authListGet, themeListGet);
                                    } 
                                }
                            }           
                        })
                        .error(function (data, status, header, config) {
                            //返回失败 processingFlash--End
                            $scope.loading=false;

                            $alert.msgDialogError(getRcText("stModifyFailOther"));
                        });
                    }  

                    //Auth
                    function dataAuthAjax(stNameGet, ssidGet, sureAuthGet, authListGet, themeListGet){
                        if(sureAuthGet==0){
                            if(g_pubInfo=="have"){
                                //delete
                                $http.get("/v3/ace/oasis/auth-data/o2oportal/pubmng/deleteBySsidV3?ssidV3="+$stateParams.ssid+"&nasId="+$scope.sceneInfo.nasid, {
                            
                                })
                                .success(function (data, status, header, config) {
                                    //返回失败 processingFlash--End
                                    $scope.loading=false;

                                    if(data.errorcode==0||data.errorcode==1307){
                                        $alert.msgDialogSuccess(getRcText("stModifyOK_authOK")); 
                                        $window.history.back();                                       
                                    }else{
                                        $alert.msgDialogError(getRcText("stModifyOK_authFail"));
                                    }
                                })
                                .error(function (data, status, header, config) {
                                    //返回失败 processingFlash--End
                                    $scope.loading=false;

                                    $alert.msgDialogError(getRcText("stModifyOK_authFail"));
                                });  
                            }else if(g_pubInfo=="nohave"){
                                //返回失败 processingFlash--End
                                $scope.loading=false;

                                //无
                                $alert.msgDialogSuccess(getRcText("stModifyOK_authOK"));
                                $window.history.back();
                            }else{
                                //返回失败 processingFlash--End
                                $scope.loading=false;

                                //异常
                                $alert.msgDialogError(getRcText("authCanNot_getPubFail"));
                            }

                        }else{
                            // 数据处理
                            var themeTempV=themeListGet.lastIndexOf('_'); 
                            var themeItemName=themeListGet.substring(0,themeTempV);
                            var themeItemTag=themeListGet.substr(themeTempV+1,1);
                            //ajax
                            if(g_pubInfo=="have"){
                                //modify
                                var interfaceName="modifybyv3flag";
                                var interfaceParam={
                                    nasId:$scope.sceneInfo.nasid,
                                    ssidIdV3: $stateParams.ssid,
                                    ssidName:ssidGet,
                                    authCfgName: authListGet,
                                    themeTemplateName: themeItemName,
                                    themeType:themeItemTag                                
                                };
                                addOrModify(interfaceName,interfaceParam);                                
                            }else if(g_pubInfo=="nohave"){
                                //add
                                var interfaceName="addbyv3flag";
                                var interfaceParam={
                                    nasId:$scope.sceneInfo.nasid,
                                    ssidIdV3: $stateParams.ssid,
                                    ssidName:ssidGet,
                                    authCfgName: authListGet,
                                    themeTemplateName: themeItemName,
                                    themeType:themeItemTag                                
                                };
                                addOrModify(interfaceName,interfaceParam);
                            }else{
                                //返回失败 processingFlash--End
                                $scope.loading=false;

                                //异常
                                $alert.msgDialogError(getRcText("authCanNot_getPubFail"));
                            }
                            
                        }
                        
                        //FUNC
                        function addOrModify(interfaceName,interfaceParam){
                            $http.post("/v3/ace/oasis/auth-data/o2oportal/pubmng/"+interfaceName,interfaceParam)
                            .success(function (data, status, header, config) { 
                                //返回失败 processingFlash--End
                                $scope.loading=false;                              
                                if(data.errorcode==0){
                                    $alert.msgDialogSuccess(getRcText("stModifyOK_authOK"));
                                    $window.history.back();
                                }else if(data.errorcode==1301){
                                    $alert.msgDialogError(getRcText("stModifyOK_authFail1301"));
                                }else{
                                    $alert.msgDialogError(getRcText("stModifyOK_authFail"));
                                }
                            })
                            .error(function (data, status, header, config) {
                                //返回失败 processingFlash--End
                                $scope.loading=false;

                                $alert.msgDialogError(getRcText("stModifyOK_authFail"));                                
                            });
                        }
                    }
                } 
                

                //2  点击“取消”按钮               
                $scope.cancelEvent = function (){
                    $window.history.back();
                }
}];
});    