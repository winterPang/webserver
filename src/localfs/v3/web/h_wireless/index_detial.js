(function ($){
    var MODULE_BASE = "h_wireless";
    var MODULE_NAME = MODULE_BASE + ".index_detial";
    var MODULE_RC="h_wireless_indexDetial";

    function getRcText(sRcName){
        return Utils.Base.getRcString(MODULE_RC, sRcName);
    }

    function initForm(){
        $("#view_client_form").form("init", "edit", {"title":getRcText("TERINFO"),"btn_apply": 
            false,"btn_cancel":false});
        $("#return").on('click',function(){ history.back();});
    }

    function initData(){
       
             var aa={   
                        "apName":"ap2",
                        "apSN":"固定账号认证",
                        "apModel":"wetgsas",
                        "apGroupName":"去使能",
                        "radioList1":"694",
                        "onlineTime1":"75"
                }
              
        Utils.Base.updateHtml($("#view_client_form"), aa);
    }

    function _init ()
    {
        initForm();
        initData();
    }
    function _resize (jParent)
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
        "widgets": ["Echart","Minput","SList","Form","SingleSelect"],
        "utils": ["Base", "Request"],
    });

}) (jQuery);;