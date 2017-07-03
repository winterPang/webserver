define(["utils"], 
    function (Utils) {
        return ["$scope", "$http", "$state","$alertService","$window", 
            function ($scope, $http, $state, $alert, $window){

                
                //【获取HTML变量】
                function getRcText (attrName) {
                    var sText = Utils.getRcString("RC", attrName);
                    return sText;
                }               



                //START
                //1  全局变量
                var g_allStName="wufapanduan";

                //ssidAdd processingFlash--Start0
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

                    //2  目前所有的stName
                    //发请求
                    $http.get("/v3/ssidmonitor/getssidinfobrief?devSN="+$scope.sceneInfo.sn, {

                    })
                    .success(function (data, status, header, config) {
                        g_allStName=[];
                        
                        $.each(data.ssidList,function(i,item){
                            g_allStName.push(item.stName);
                        });                        
                    })
                    .error(function (data, status, header, config) {
                        g_allStName="wufapanduan";                  
                    });

                    //3  一些选项的隐藏或显示控制                
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
                        var stNameGet=$('#stName').val();
                        var ssidGet=$('#ssid').val();

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


                        //1-B-1 stName重复:无法判断                        
                        if(g_allStName=="wufapanduan"){
                            $('#stName_error').html(getRcText("getSSIDList_Failed"));
                            $('#stName_error').show();
                            tempValue=1;
                        }

                        //1-B-2 stName重复:不允许
                        if(g_allStName!="wufapanduan"){
                        	var stNameGet_temp=stNameGet.toLowerCase();
                            $.each(g_allStName,function(i,item){
                                if(stNameGet_temp==item){
                                    $('#stName_error').html(getRcText("stName_exists"));
                                    $('#stName_error').show();
                                    tempValue=1;
                                }
                            });
                        }
                        

                        

                        //1-C 对值进行校验，给出错误提示
                        //stName字段：（仅限“英文字母 数字 下划线”）
                            //必填
                            if(stNameGet==""){
                                $('#stName_error').html(getRcText("stName_required"));
                                $('#stName_error').show();
                                tempValue=1;
                            }                     
                            //仅限“英文字母 数字 下划线”   /\W/
                            if (/\W/.test(stNameGet)) {
                                $('#stName_error').html(getRcText("noKongGe"));
                                $('#stName_error').show();
                                tempValue=1;                                            
                            }
                                                         
                        //ssid字段：不能“为空”（允许:空格、中文）
                            //必填
                            if(ssidGet==""){
                                $('#ssid_error').html(getRcText("ssid_required"));
                                $('#ssid_error').show();
                                tempValue=1;
                            }
                        //选择加密的话：psk不能“为空”（允许:空格、中文）                            
                            if(stKeyGet==1){    
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

                                

                                dataSSIDAjax(result, stNameGet, ssidGet, stGet, stKeyGet, stKeyStringGet, sureAuthGet, authListGet, themeListGet);                     
                            } 
                        }
                    }

                    //SSID
                    function dataSSIDAjax(result, stNameGet, ssidGet, stGet, stKeyGet, stKeyStringGet, sureAuthGet, authListGet, themeListGet){
                        //1-C 表单下发
                        var stNameGet=stNameGet.toLowerCase();
                        
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
                        pDate.push(otemp);
                        //ajax
                        $http.post("/v3/ant/confmgr", {
                            devSN: $scope.sceneInfo.sn,                                         
                            configType:0,
                            module : "stamgr",
                            cloudModule:"stamgr",
                            deviceModule:"stamgr",
                            method: "SSIDUpdate",
                            param: pDate
                        })
                        .success(function (data, status, header, config) {

                            if(data.errCode!=0){
                                //ssidupdate返回失败 processingFlash--End1
                                $scope.loading=false;

                                if((data.errCode==7)&&(data.reason=="Number of service templates exceeded the limit.")){
                                    $alert.msgDialogError(getRcText("stAddFailed_limit"));            
                                }else if((data.errCode==7)&&(data.reason=="No enough resources.")){
                                    $alert.msgDialogError(getRcText("stAddFailed_full"));            
                                }else{
                                    if(data.errCode==3){
                                        $alert.msgDialogError(getRcText("stAddFailed_3"));
                                    }else if(data.errCode==4){
                                        $alert.msgDialogError(getRcText("stAddFailed_4"));
                                    }else{
                                        $alert.msgDialogError(getRcText("stAddFailed_other"));
                                    } 
                                    
                                }
                            }else{
                                dataAuthAjax(stNameGet, ssidGet, sureAuthGet, authListGet, themeListGet);
                            }            
                        })
                        .error(function (data, status, header, config) {
                            //ssidupdate发送失败 processingFlash--End2
                            $scope.loading=false;
                            
                            $alert.msgDialogError(getRcText("stAddFailed_other"));
                        });
                    }  

                    //Auth
                    function dataAuthAjax(stNameGet, ssidGet, sureAuthGet, authListGet, themeListGet){
                        if(sureAuthGet==0){
                            //AuthAjax无需 processingFlash--End3
                            $scope.loading=false;

                            $alert.msgDialogSuccess(getRcText("stAddOK_authNo"));                            // 
                            $window.history.back();
                        }else{
                            // 数据处理
                            var themeTempV=themeListGet.lastIndexOf('_'); 
                            var themeItemName=themeListGet.substring(0,themeTempV);
                            var themeItemTag=themeListGet.substr(themeTempV+1,1);
                            //ajax
                            $http.post("/v3/ace/oasis/auth-data/o2oportal/pubmng/addbyv3flag", {                                
                                nasId:$scope.sceneInfo.nasid,
                                ssidIdV3:$scope.sceneInfo.sn+""+stNameGet,
                                ssidName:ssidGet,
                                authCfgName: authListGet,
                                themeTemplateName: themeItemName,
                                themeType:themeItemTag                               
                            })
                            .success(function (data, status, header, config) {
                                //AuthAjax返回失败 processingFlash--End4
                                $scope.loading=false;

                                if(data.errorcode==0){
                                    $alert.msgDialogSuccess(getRcText("stAddOK_authOK"));
                                    $window.history.back();
                                }else if(data.errorcode==1301){
                                    $alert.msgDialogError(getRcText("stAddOK_authFail1301")); 
                                }else{
                                    $alert.msgDialogError(getRcText("stAddOK_authFail"));
                                }
                            })
                            .error(function (data, status, header, config) {
                                //AuthAjax发送失败 processingFlash--End5
                                $scope.loading=false;
                                
                                $alert.msgDialogError(getRcText("stAddOK_authFail"));                                
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