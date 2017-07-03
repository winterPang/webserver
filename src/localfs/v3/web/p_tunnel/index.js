/**
 * Created by Administrator on 2016/3/22.
 */
(function ($)
{
    var MODULE_NAME = "reboot.index";
    var RC_INFO = "reboot_info_rc";
    var dreboot = $("#content");

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString(RC_INFO, sRcName);
    }

    function initForm()
    {
        var errMessage = getRcText("VER_ERROR").split(",");
        $("#closeBtn,#close").on("click",function(){
           $(this).attr("data-dismiss","modal");
            //window.location.hash  = "#";
        });
        $("#reboot").on("click",function(){
            var deviceReboot = {
                url:MyConfig.path+"/base/resetDev",
                type:"POST",
                dataType:"JSON",
                contentType: "application/json",
                data:JSON.stringify({
                    saveConfig:0,
                    devSN: FrameInfo.ACSN
                }),
                onSuccess:getDeviceRebootSuc,
                onFailed:getDeviceRebootFail
            }
            function getDeviceRebootSuc(data){
                console.log("suc terminal sucess");
                if(data.retCode=="0"){
                    Frame.Msg.info(errMessage[0],"error");
                    console.log("�ɹ�");
                    window.location.hash  = "#";
                }else if(data.retCode=="2"){
                    Frame.Msg.info(errMessage[2],"error");
                    console.log("����ʧ��");
                    window.location.hash  = "#";
                }else if(data.retCode=="3"){
                    Frame.Msg.info(errMessage[3],"error");
                    console.log("��������");
                    window.location.hash  = "#";
                }
                Utils.Pages.closeWindow(Utils.Pages.getWindow(dreboot));
                Utils.Base.refreshCurPage();
            }
            function getDeviceRebootFail(data){
                    console.log("fail terminal fail");
            }
            Utils.Request.sendRequest(deviceReboot);
        })

        $("#saveReboot").on("click",function(){
            var saveReboot = {
                url:MyConfig.path+"/base/resetDev",
                type:"POST",
                dataType:"JSON",
                contentType: "application/json",
                data:JSON.stringify({
                    saveConfig:1,
                    devSN: FrameInfo.ACSN
                }),
                onSuccess:getSaveRebootSuc,
                onFailed:getSaveRebootFail
            }
            function getSaveRebootSuc(data){
                console.log("suc terminal sucess");
                if(data.retCode=="0"){
                    Frame.Msg.info(errMessage[0],"error");
                    console.log("�ɹ�");
                    window.location.hash  = "#";
                }else if(data.retCode=="1"){
                    Frame.Msg.info(errMessage[1],"error");
                    console.log("��������ʧ��");
                    window.location.hash  = "#";
                }else if(data.retCode=="2"){
                    Frame.Msg.info(errMessage[2],"error");
                    console.log("����ʧ��");
                    window.location.hash  = "#";
                }else if(data.retCode=="3"){
                    Frame.Msg.info(errMessage[3],"error");
                    console.log("��������");
                    window.location.hash  = "#";
                }
                Utils.Pages.closeWindow(Utils.Pages.getWindow(dreboot));
                Utils.Base.refreshCurPage();
            }
            function getSaveRebootFail(data){
                console.log("fail terminal fail");
            }
            Utils.Request.sendRequest(saveReboot);
        })

    }

    function initData(){

    }

    function _init ()
    {
        var newText = $("#rebootMsg").text().replace(/sn/g,FrameInfo.ACSN);
        $("#rebootMsg").text(newText);
        Utils.Base.openDlg(null, {}, {scope:$("#content"),className:"modal-large"});
        initForm();
        initData();

    }

    function _resize(jParent)
    {
    }

    function _destroy()
    {

        console.log("destory**************");
        Utils.Request.clearMoudleAjax(MODULE_NAME);

    }

    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["SList"],
        "utils": ["Base","Request"]
    });

}) (jQuery);
