(function($){
    var MODULE_NAME = "h_mchannel.weshop";

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("weshop_rc", sRcName);
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

        function onblur1()
        {
            if($.trim($("#userPassword", jForm).val())==""){
                Utils.Widget.setError($(this),getRcText("InputContentError"));
            }
        }

        function onblur2()
        {
            if($.trim($("#passwordConform", jForm).val())==""){
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


            if($.trim($("#text", jForm).val())==""){
                Utils.Widget.setError($("#text"),getRcText("InputContentError"));
                return false;
            }
            if($.trim($("#text2", jForm).val())==""){
                Utils.Widget.setError($("#text2"),getRcText("InputContentError"));
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
            //nGetStoreName();

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
        $("#text2", jForm).on("blur", onblur2eye);

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
                {name:'shopName', datatype:"String"},
                {name:'shopPublic', datatype:"String"},
                {name:'shopSSID',datatype:"String"},
                {name:'shopState',datatype:"String"}
            ],
            buttons:[
                {name: "add", action: showAddUser},
                {name:"edit", action:showAddUser},
                {name:"delete",action:Utils.Msg.deleteConfirm(delUser)}
            ]
        };
        $("#RegisterUserList").SList ("head", optpage);
    }


    function GetLoginTime(logintime)
    {
        function doublenum(num)
        {
            if(num < 10)
            {
                return '0'+num;
            }
            return num;
        }
        var myDate = new Date(logintime);
        var year = myDate.getFullYear();
        var month = doublenum(myDate.getMonth() + 1);
        var day = doublenum(myDate.getDate());
        var hours = doublenum(myDate.getHours());
        var minutes = doublenum(myDate.getMinutes());
        var seconds = doublenum(myDate.getSeconds());
        return year+'-'+month+'-'+day+' '+hours+':'+minutes+':'+seconds;
    }

    function initData()
    {
        var aRegisterList = [{"shopName":"tianmao","shopPublic":"tianmao","shopSSID":"123456","shopState":"open"}];
        aRegisterList.push({"shopName":"tianmao","shopPublic":"tianmao","shopSSID":"123456","shopState":"open"});
        $("#RegisterUserList").SList ("refresh", aRegisterList);

        var jText = $("#text");
        var jPassword = $("#userPassword");
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
                Utils.Widget.setError($("#userPassword"),"");
            }

        });

        $("#text").keyup(function(){

            $("#userPassword").val($("#text").val());

        });

        var jText2 = $("#text2");
        var jPassword2 = $("#passwordConform");
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
                Utils.Widget.setError($("#passwordConform"),"");
            }

        });

        $("#text2").keyup(function(){

            $("#passwordConform").val($("#text2").val());

        });

    }

    function initForm()
    {
        $("#adduser_form").form("init","edit");
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
        "widgets": ["SList","SingleSelect","Minput","Form","DateTime"],
        "utils": ["Base"]
    });
})(jQuery);/**
 * Created by Administrator on 2016/2/25.
 */
