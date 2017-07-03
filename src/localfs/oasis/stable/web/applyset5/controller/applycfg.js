define(["utils"], function (Utils) {
return ["$scope", "$http", "$alertService", function ($scope, $http, FRAME){




    //获取HTML变量
    function getRcText (attrName) {
        var sText = Utils.getRcString("RC", attrName);
        return sText;
    }




    //初始
    //提示框标题
    $scope.noticeType = getRcText("ERROR");
    //开关StatusA
    $scope.drsValueIsEnable = true;
    //按钮是否显示StatusB
    $scope.drsOperateBtnDisp = false;
    //GET接口--调用
    drsGET();




    //开关，点击时触发此方法
    $scope.drsValueChange = function () {
        //分级分权
        $scope.$watch('permission', function (v) {
            //有权限
            if($scope.permission.write==true){
                //开关StatusA
                if($scope.drsValueIsEnable == true){
                    $scope.drsValueIsEnable = false;
                }else if($scope.drsValueIsEnable == false){
                    $scope.drsValueIsEnable = true;
                }else{
                    console.log("Try--Catch");
                }
                //显示:StatusB
                $scope.drsOperateBtnDisp = true;
            //无权限
            }else if($scope.permission.write==false){
            //未获取到                
            }else{
                console.error("Permission GetFailed");
            }
        }, true);
        
    };    


    //对勾，点击时触发此方法
    $scope.drsValueSET = function () {
        //SET接口--调用
        drsSET();
        
    }; 


    //叉子，点击时触发此方法
    $scope.drsValueBACK = function () {
        //提示用户
        FRAME.msgDialogSuccess(getRcText("DRS_Cancel"));
        
        //隐藏:StatusB
        $scope.drsOperateBtnDisp = false;        
        //GET:StatusA
        drsGET();        
    };   




    //GET接口
    function drsGET(){
        $http.post(
            "/v3/ant/confmgr",
            JSON.stringify({
                cloudModule: "DRS",
                deviceModule: "DRS",
                configType:1,
                subMsgType: 0,
                devSN: $scope.sceneInfo.sn,                
                method: "drsGet",
                param:{
                    devSN: $scope.sceneInfo.sn
                },
                result:["status"]
            })
        )
        .success(function (data) {
            if((data.result[0].status!="")&&(data.reason=="")){
                //对返回结果进行处理
                if(data.result[0].status=="on"){
                    data.result[0].status=true;
                }else if(data.result[0].status=="off"){
                    data.result[0].status=false;
                }else{
                    console.log("Try--Catch");
                }

                //给界面赋值
                $scope.drsValueIsEnable = data.result[0].status;
            }else{
                //提示用户
                FRAME.msgDialogError(getRcText("DRS_GET"), 'error');
                
            }

        })
        .error(function (data) {
            //提示用户
            FRAME.msgDialogError(getRcText("DRS_GET"), 'error');
            
        });    
    }
  

            
            
    //SET接口
    function drsSET(){
        // 准备status字段
        var statusTemp;

        if($scope.drsValueIsEnable==true){
            statusTemp="on";
        }else if($scope.drsValueIsEnable==false){
            statusTemp="off";                
        }else{
            console.log("Try--Catch");
        }  


        // ajax交互
        $http.post(
            "/v3/ant/confmgr",
            {
                cloudModule: "DRS",
                deviceModule: "DRS",
                subMsgType:0,
                configType: 0,
                devSN: $scope.sceneInfo.sn,                
                method: "drsEnable",
                param:{
                    devSN: $scope.sceneInfo.sn,
                    status:statusTemp,
                    family:"0"
                }
            }
        )
        .success(function (data) {
            if((data.result=="success")&&(data.serviceResult=="success")&&(data.communicateResult=="success")&&(data.deviceResult.result=="success")&&(data.errCode==0)&&(data.reason=="")){
                drsSET_response(0);
            }else{
                drsSET_response(1,data.errCode);
            }

        })
        .error(function (data) {            
            drsSET_response(1);
        });    
    }


    //SET接口，返回值处理
    function drsSET_response(cs,errCode){
        //1-提示用户
        if(cs==1){
            //失败是由于errCode3或errCode4
            if(errCode==3){
                var becauseText=getRcText("because3");
            }else if(errCode==4){
                var becauseText=getRcText("because4");
            }else{
                var becauseText="";
            }
            //失败提示
            if($scope.drsValueIsEnable==true){
                FRAME.msgDialogError(becauseText+getRcText("DRS_OPEN").split(",")[1], 'error');
            }else if($scope.drsValueIsEnable==false){
                FRAME.msgDialogError(becauseText+getRcText("DRS_CLOSE").split(",")[1], 'error');                
            }else{
                FRAME.msgDialogError("Try--Catch", 'error');
            }    
        }else if(cs==0){
            //成功提示
            if($scope.drsValueIsEnable==true){
                FRAME.msgDialogSuccess(getRcText("DRS_OPEN").split(",")[0]);
            }else if($scope.drsValueIsEnable==false){
                FRAME.msgDialogSuccess(getRcText("DRS_CLOSE").split(",")[0]);              
            }else{
                FRAME.msgDialogError("Try--Catch", 'error');
            }    
        }else{
                FRAME.msgDialogError("Try--Catch", 'error');
        }

        //2-隐藏:StatusB
        $scope.drsOperateBtnDisp = false;

        //3-GET:StatusA
        setTimeout(drsGET,1000);
        setTimeout(drsGET,2000);
        setTimeout(drsGET,3000);  
          
    }


}];
});    