(function($){
    var MODULE_NAME = "h_mchannel.wemsg";

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("wemsg_rc", sRcName);
    }

    function showAddUser(oRowData,type)
    {
        function updataForm()
        {
            $("input[type=text],input[type=password],select",jForm).each(function() {
                Utils.Widget.setError($(this),"");
            });
            jForm.form("updateForm",{
                userName:"",
                userPassword:"",
                passwordConform:"",
                storeName:""
            });
        }
        function onCancel()
        {
            updataForm();
            Utils.Pages.closeWindow(Utils.Pages.getWindow(jForm));
        }

        //jia fei kong jiao yan
        function onblur0()
        {
            if($.trim($("#userName", jForm).val())==""){
                Utils.Widget.setError($(this),getRcText("InputContentError"));
            }
        }
        function onblur1eye()
        {
            if($.trim($("#text", jForm).val())==""){
                Utils.Widget.setError($(this),getRcText("InputContentError"));
            }
        }

        function onblur2eye()
        {
            if($.trim($("#text2", jForm).val())==""){
                Utils.Widget.setError($(this),getRcText("InputContentError"));
            }
        }
        function onSubmitAddUser()
        {
            //fei kong jiao yan
            if($.trim($("#userName", jForm).val())==""){
                Utils.Widget.setError($("#userName"),getRcText("InputContentError"));
                return false;
            }


            if($.trim($("#text", jForm).val())==""){
                Utils.Widget.setError($("#text"),getRcText("InputContentError"));
                return false;
            }
            if($.trim($("#text2", jForm).val())==""){
                Utils.Widget.setError($("#text2"),getRcText("InputContentError"));
                return false;
            }

        }
        function onSubmitEditUser()
        {

            //fei kong jiao yan

            if($.trim($("#text", jForm).val())==""){
                Utils.Widget.setError($("#text"),getRcText("InputContentError"));
                return false;
            }


        }
        var jForm = $("#adduser_form");
        var jDlg = $("#add_user_Dlag");
        Utils.Base.resetForm(jForm);

        if(jDlg.children().length)
        {
            $("#pageToggle").show().insertAfter($(".modal-header",jDlg));
        }
        else
        {
            $("#pageToggle").show().appendTo(jDlg);
        }
        if(type=="add")
        {
            $("#store",jForm).removeClass("hide");
            $("#userName",jForm).attr("readonly",false);
            jForm.form("init", "edit", {"title":getRcText("ADD_USER"),"btn_apply": onSubmitAddUser,"btn_cancel":onCancel});
        }
        else{
            $("#userName",jForm).val(oRowData[0].userName);
            $("#userName",jForm).attr("readonly",true);
            $("#store",jForm).addClass("hide");
            jForm.form("init", "edit", {"title":getRcText("EDIT_USER"),"btn_apply": onSubmitEditUser, "btn_cancel":onCancel});

        }

        //jia fei kong jiao yan
        $("#userName", jForm).on("blur", onblur0);
        $("#text", jForm).on("blur", onblur1eye);
        Utils.Base.openDlg(null, {}, {scope:jDlg,className:"modal-super"});

    }

    function delUser(oData)
    {

    }

    function EditShow(aRows)
    {
        if (aRows.length > 0 && aRows[0].userType == "πÃ∂®’À∫≈»œ÷§")
        {
            return true;
        }
        return false;
    }

    function initGrid()
    {
        var optpage = {
            colNames: getRcText ("USER_LIST_HEADER"),
            showOperation:true,

            //  pageSize:2,
            colModel: [
                {name:'regularName',datatype:"String"},
                {name:'msgType',datatype:"String"}
            ],

            buttons:[
                {name: "add",  action: showAddUser},
                {name:"edit",  action:showAddUser},
                {name:"delete",action:Utils.Msg.deleteConfirm(delUser)}
            ]
        };
        $("#RegisterUserList").SList ("head", optpage);

    }
    function initForm()
    {
        $("#picMsg").on("click",function(){
            $(this).attr("checked","true");
            $("#picMessage").removeClass("hide");
            $("#wordMessage").addClass("hide");
        });
        $("#wordMsg").on("click",function(){
            $(this).attr("checked","true");
            $("#wordMessage").removeClass("hide");
            $("#picMessage").addClass("hide");
        });
    }

    function initData()
    {
        var aRegisterList = [{"regularName":"datatype","msgType":"abc"},
            {"regularName":"datatype","msgType":"abc"},{"regularName":"datatype","msgType":"abc"},{"regularName":"datatype","msgType":"abc"},{"regularName":"datatype","msgType":"abc"}];

        $("#RegisterUserList").SList ("refresh", aRegisterList);


        var jText = $("#text");
        $("#switch").click(function(){
            if($(this).hasClass('show_word'))
            {
                $(this).removeClass('show_word');
                jText.hide();
                jPassword.show();
                jPassword.val(jText.val());
                Utils.Widget.setError($("#text"),"");
            }
            else{
                $(this).addClass('show_word');
                jText.show();
                jPassword.hide();
                jText.val(jPassword.val());

            }

        });

        var jText2 = $("#text2");
        $("#switch2").click(function(){
            if($(this).hasClass('show_word'))
            {
                $(this).removeClass('show_word');
                jText2.hide();
                jPassword2.show();
                jPassword2.val(jText2.val());
                Utils.Widget.setError($("#text2"),"");
            }
            else{
                $(this).addClass('show_word');
                jText2.show();
                jPassword2.hide();
                jText2.val(jPassword2.val());
            }

        });

    }
    function _init ()
    {
        initGrid();
        initData();
        initForm();

    }
    function _destroy()
    {

    }

    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList","SingleSelect","Minput","Form"],
        "utils": ["Base"]
    });
})(jQuery);
