
define(['jquery','utils', 'bootstrapValidator'], function ($,Utils) {
    return ['$scope', '$http', '$alertService', '$state', '$rootScope', '$stateParams', function ($scope, $http, $alert, $state, $rootScope, $stateParams) {
        function getRcString(attrName){
            return Utils.getRcString("listView_rc",attrName);
        }
        var msgDialogData=getRcString('msgDialog-data').split(',');
        var URL_POST_resetDev="/v3/base/resetDev";
        var URL_POST_resetConnection="/v3/base/resetConnection";
        $scope.saveCfgRestart = function () {
            $http.post(sprintf(URL_POST_resetDev), {
                devSN: $stateParams.sn,
                saveConfig:1
            }, {headers: {"content-Type": "application/json;charset=UTF-8"}}).success(function (data) {
                if(data.retCode == 0){
                    $alert.msgDialogSuccess(msgDialogData[1]);
                }else if(data.retCode == 1){
                    $alert.msgDialogError(msgDialogData[4]);
                }else if(data.retCode == 2){
                    $alert.msgDialogError(msgDialogData[5]);
                }else if(data.retCode == 3){
                    $alert.msgDialogError(msgDialogData[0]);
                }else if(data.retCode == 4){
                    $alert.msgDialogError(msgDialogData[6]);
                }else if(data.retCode == 9){
                    $alert.msgDialogError(msgDialogData[7]);
                }

            }).error(function () {

            })
        };

        $scope.restart=function(){
            $http.post(sprintf(URL_POST_resetDev),{
                devSN: $stateParams.sn,
                saveConfig:0
            },{headers:{"content-Type":"application/json;charset=UTF-8"}}).success(function(data){
                if(data.retCode == 0){
                    $alert.msgDialogSuccess(msgDialogData[1]);
                }else if(data.retCode == 1){
                    $alert.msgDialogError(msgDialogData[4]);
                }else if(data.retCode == 2){
                    $alert.msgDialogError(msgDialogData[5]);
                }else if(data.retCode == 3){
                    $alert.msgDialogError(msgDialogData[0]);
                }else if(data.retCode == 4){
                    $alert.msgDialogError(msgDialogData[6]);
                }else if(data.retCode == 9){
                    $alert.msgDialogError(msgDialogData[7]);
                }
            }).error(function(){

            })
        };
        $scope.mainLinkReconnection=function(){
            $http.post(sprintf(URL_POST_resetConnection),{
                devSN:$stateParams.sn
            },{headers:{"content-Type":"application/json;charset=UTF-8"}}).success(function(data){
                if(data.retCode == 0){
                    $alert.msgDialogSuccess(msgDialogData[1]);
                }else{
                    $alert.msgDialogError(msgDialogData[2]);
                }
            })
        }










        //css
        $(".bodyContent").css("margin-top","20px");
        $("#bgImgSave,#bgImgReboot,#bgImgDisconnect").css({
            "width":"75px",
            "height":"75px",
            "background":"url(../tunneldevice5/image/xiaobeireboot.png) no-repeat"
        });
        $("#bgImgSave").css("background-position","-118px -7px");
        $("#bgImgReboot").css("background-position","-25px -7px");
        $("#bgImgDisconnect").css("background-position","-202px -7px");
        $("#b_btnSave,#b_btnReboot").css({"width":"120px","background-color":"rgb(254,128,139)"});
        $("#b_btnDisconnect").css({"width":"120px","background-color":"rgb(242,188,152)"});
         $(".rightContent").css({"height":"32px","margin-left":"-140px"});
        $(".middleLine>span").css({"border-right":"1px solid #ddd","display":"inline","font-size":"22px"});
        //$(".col-xs-5").css("margin-left","-140px");
        


    }];
});
