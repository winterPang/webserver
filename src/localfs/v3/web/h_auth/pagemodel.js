(function ($)
{
    var MODULE_NAME = "h_auth.pagemodel";
    var v2path = MyConfig.v2path;
    var username =MyConfig.username;
    var password = MyConfig.password;
    var g_Radios, g_PercentMax = 100;

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("ws_ssid_rc", sRcName);
    }
    function showPage(oRowdata, sName){
        function onCancel()
        {
            jFormSSID.form("updateForm",oRowdata);
            $("input[type=text]",jFormSSID).each(function(){
                Utils.Widget.setError($(this),"");
            });
            return false;
        }

        function onSubmitSSID()
        {
            $.ajax({
                type: "POST",
                url: v2path+"/themetemplate/add",
                //username: username,
                //password: password,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify({
                    "ownerName": FrameInfo.g_user.attributes.name,
                    "themeName": $("#themeName").val(),
                    "description": $("#description").val(),
                }),
                success: function (data) {
                    if(data.errorcode==0){
                        Utils.Pages.closeWindow(Utils.Pages.getWindow(jFormSSID));
                        pageListData();
                        // Utils.Base.refreshCurPage();
                        Frame.Msg.info("配置成功");
                    }else if(data.errorcode==1201){
                        Frame.Msg.error("增加页面模板名称已经存在");
                    }
                },
                error: function (err) {
                    // alert(JSON.stringify(err));
                }
            });
            //  });
        }

        function onSubmitEditPageModel()
        {

            $.ajax({
                type: "POST",
                url: v2path+"/themetemplate/modify",
                //username: username,
                //password: password,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify({
                    "ownerName":FrameInfo.g_user.attributes.name,
                    "themeName": $("#themeName").val(),
                    "description": $("#description").val(),
                }),
                success: function (data) {
                    Utils.Base.refreshCurPage();
                    Frame.Msg.info("配置成功");
                },
                error: function (err) {
                    //  alert(JSON.stringify(err));
                }
            });
        }
        var jFormSSID = $("#pagetoggle_form");
        var pageName = sName;

        if(pageName == "add") //Add
        {
            var jDlg = $("#AddPageTempDlg");
            $("#themeName",jFormSSID).attr("readonly",false);
            $($(".col-sm-6 .form-group .col-sm-9",jFormSSID)[2]).addClass("hide");
            if(jDlg.children().length)
            {
                $("#pageToggle").show().insertAfter($(".modal-header",jDlg));
            }
            else
            {
                $("#pageToggle").show().appendTo(jDlg);
            }

            jFormSSID.form("init", "edit", {"title":getRcText("ADDPage_TITLE"),"btn_apply": onSubmitSSID});
            //清空默认配置
            jFormSSID.form("updateForm",{
                themeName:"",
                description:"",
                pagemodel:"1"
            });
            $("input[type=text]",jFormSSID).each(function(){
                Utils.Widget.setError($(this),"");
            });
            Utils.Base.openDlg(null, {}, {scope:jDlg,className:"modal-super"});
        }
        else //Edit
        {
            $($(".col-sm-6 .form-group .col-sm-9",jFormSSID)[2]).removeClass("hide");
            jFormSSID.form ("init", "edit", {"btn_apply": onSubmitEditPageModel, "btn_cancel":onCancel});
            $("#themeName",jFormSSID).attr("readonly",true);
            jFormSSID.form("updateForm",oRowdata);
            $("input[type=text]",jFormSSID).each(function(){
                Utils.Widget.setError($(this),"");
            });
        }
    }
    function onDelPage(oData)
    {
        $.ajax({
            type:"post",
            url:v2path+"/themetemplate/delete",
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify({"ownerName":FrameInfo.g_user.attributes.name,"themeName":oData.themeName}),
            //username:username,
            //password:password,
            success:function(data){
                //pageListData();
                if(data.errorcode == "60015")
                {
                    Frame.Msg.error("该页面模板已经被绑定，不能删除");
                }
                else if(data.errorcode == "0"){
                    Frame.Msg.info("删除成功");
                }else{
                    Frame.Msg.info(data.errormsg||"删除失败");
                }
                Utils.Base.refreshCurPage();
            },
            error:function(err){
                // alert("suc"+data);
            }
        })
    }
    function initData(jScope)
    {
        var aPageModelData  = [];
        $.ajax({
            type: "GET",
            url: v2path+"/themetemplate/query?ownerName="+FrameInfo.g_user.attributes.name,
            contentType:"application/json",
            dataType:"json",
            //username:username,
            //password:password,

            success:function(data){
                if(data.errorcode == 0){
                    $.each(data.data,function(key,value){
                        var PageTemplate={}
                        PageTemplate.themeName=value.themeName;
                        PageTemplate.description = value.description;
                        PageTemplate.simpledraw = "/o2o/uam/theme/"+ value.pathname +"/draw.xhtml?templateId="+ value.id +"&type=1";
                        aPageModelData.push(PageTemplate);
                    })
                    $("#pageList").SList ("refresh", aPageModelData);
                }else {
                    //TODO errorcode处理
                    Frame.Msg.error("查询数据异常");

                }
            },
            error:function(err){
                // Frame.Msg.error(JSON.stringify(err));
            }
        });
    }
    function initGrid()
    {
        var optpage = {
            colNames: getRcText ("Page_HEADER"),
            multiSelect: false,
            //  pageSize:2,
            colModel: [
                {name:'themeName', datatype:"String"},
                {name:'description', datatype:"String"}
            ],
            onToggle : {
                action : showPage,
                jScope : $("#pageToggle"),
                BtnDel : {
                    show : true,
                    action : onDelPage
                }
            },
            buttons:[
                {name: "add", action: showPage}
            ]
        };
        $("#pageList").SList ("head", optpage);
    }

    function initForm(){
        $("#simpledraw").on("click",function(){
            Frame.Util.openpage(
                {
                    pageURL:this.value,
                    height:"500px",
                    hotkeys:"no"
                })
            return false;
        });
    }
    function _init ()
    {
        initGrid();
        initData();
        initForm();
    }

    function _resize(jParent)
    {
    }

    function _destroy()
    {
        g_PercentMax = 100;
    }
    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["SList","SingleSelect","Minput","Form"],
        "utils": ["Base"]
    });
}) (jQuery);
