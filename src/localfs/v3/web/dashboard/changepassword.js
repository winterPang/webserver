;(function ($) {
var MODULE_NAME = "dashboard.changepassword";
var FORM_NAME = "#changepassword_form";

function getRcText(sRcId)
{
    return Utils.Base.getRcString("change_password_rc", sRcId);
}

function _doChange()
{
    var jForm = $(FORM_NAME);
    var oldPassword = $("#oldpassword").val();
    var sPassword = $("#password").val();
    var sRepeat = $("#repeat").val();
    function onSuccess()
    {
        Utils.Pages.closeWindow(Utils.Pages.getWindow(jForm));    
    }

    if(sPassword != sRepeat)
    {
        Utils.Base.showError(getRcText("message"), jForm);
        return false;
    }
    $.ajax({
        type: "POST",
        url: "/v3/ace/oasis/oasis-rest-user/restapp/users/password/?user_name="+FrameInfo.g_user.attributes.name,
       // username: "security_super",
        //password: "lvzhou1-super",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({
            "name":FrameInfo.g_user.attributes.name,
            "oldPassword":oldPassword,
            "password":sPassword,
        }),
        success: function(data){
            onSuccess();
            // data.error_code == 1 ?alert(data.error_message):alert("修改成功");
            data.error_code == 1? Frame.Msg.error(data.error_message):Frame.Msg.info("修改成功");
        },
        error:  function(err){

        }
    });

}

function initForm()
{
    var oEdit =  {"title": getRcText("title"), "btn_apply": _doChange};
    $(FORM_NAME).form("init", "edit", oEdit);
}

function _init(oData)
{   
    initForm(); 
}

function _destroy()
{

}

Utils.Pages.regModule(MODULE_NAME,
    {"init": _init,
     "destroy": _destroy,
     "widgets": ["Form"],
      "utils":[/*"Request",*/"Base"]
    });
})(jQuery);