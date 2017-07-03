;(function ($) {
var MODULE_NAME = "wdashboard.changepassword";
var FORM_NAME = "#changepassword_form";
var NC = Utils.Pages["Frame.NC"].NC_Frame;

function getRcText(sRcId)
{
    return Utils.Base.getRcString("change_password_rc", sRcId);
}

function _doChange()
{
    var jForm = $(FORM_NAME);
    var sPassword = $("#Password").val();
    var sRepeat = $("#repeat").val();
    var onSuccess = function()
    {
        Utils.Pages.closeWindow(Utils.Pages.getWindow(jForm));    
    }

    if(sPassword != sRepeat)
    {
        Utils.Base.showError(getRcText("message"), jForm);
        return false;
    }
    Utils.Base.showError("", jForm);

    var oManagement = Utils.Request.getTableInstance(NC.UserManager);
    oManagement.addRows({"Name":$("#username").text(),"Password":sPassword});
    Utils.Request.set("merge",[oManagement], {onSuccess:onSuccess, scope:jForm});
}

function initForm()
{
    var oEdit =  {"title": getRcText("title"), "btn_apply": _doChange};
    $(FORM_NAME).form().form("init", "edit", oEdit);
}

function _init(oData)
{   
    initForm(); 
}

function _destroy()
{

}

Utils.Pages.regModule(MODULE_NAME, {"init": _init, "destroy": _destroy, "widgets": ["Form"], "utils":["Request","Base"]});
})(jQuery);