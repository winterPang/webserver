/**
 * Created by Administrator on 2016/5/31.
 */
(function ($)
{
    var MODULE_NAME = "auth.pagetemplate";
    var v2path = MyConfig.v2path;
    var hPending;

    var g_fqfj_operateBtn=true;

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("ws_ssid_rc", sRcName);
    }

    function pageListData() {

        var sTracker = "http://172.27.12.61";
        var aPageModelData = [];
        var themetemplateQueryOpt = {
            type: "GET",
            url: v2path + "/themetemplate/query?storeId=" + FrameInfo.Nasid,
            contentType: "application/json",
            dataType: "json",
            onSuccess: themetemplateQuerySuc,
            onFailed: themetemplateQueryFail
        }

        function themetemplateQuerySuc(data) {
            if (data.errorcode == 0) {
                $.each(data.data, function (key, value) {
                    if ((value.v3flag == 1) || (!(value.v3flag == false)))  //兼容以前的数据
                    {
                    var PageTemplate = {}
                    PageTemplate.themeName = value.themeName;
                    PageTemplate.description = value.description;
                    PageTemplate.pagemodel = value.themeType || 1;
                    
                    // PageTemplate.simpledraw_1 = "oasis.h3c.com" + "/v3/web/themepage_o2o/template0" + PageTemplate.pagemodel + "/draw.html?templateId=" + value.id + "&type=1" + "&tracker=" + sTracker;
                    PageTemplate.simpledraw_1 = PageTemplate.pagemodel + "/draw.html?templateId=" + value.id + "&type=1";
                    PageTemplate.simpledraw_2 = PageTemplate.pagemodel + "/draw.html?templateId=" + value.id + "&type=1";
                    aPageModelData.push(PageTemplate);
                }
                })
                $("#pageList").SList("refresh", aPageModelData);
            } else {
                //TODO errorcode处理
                Frame.Msg.info("查询数据异常", "error");

            }
        }

        function themetemplateQueryFail() {

        }

        Utils.Request.sendRequest(themetemplateQueryOpt);
    }

    function onDelPage(oData)
    {
        var themetemplateDelOpt = {
            type: "POST",
            url: v2path+"/themetemplate/delete",
            //username: username,
            //password: password,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                "ownerName":FrameInfo.g_user.attributes.name,
                "storeId":FrameInfo.Nasid,
                "themeName": oData.themeName,
                "description":oData.description
            }),
            onSuccess: themetemplateDelSuc,
            onFailed: themetemplateDelFail
        }

        function themetemplateDelSuc(data){
            if(data.errorcode == "60015")
            {
                Frame.Msg.info("该页面模板已经被绑定，不能删除","error");
            }
            else if(data.errorcode == "0"){
                Frame.Msg.info("删除成功");
            }else{
                Frame.Msg.info(data.errormsg||"删除失败","error");
            }
            Utils.Base.refreshCurPage();
        }

        function themetemplateDelFail(){

        }

        Utils.Request.sendRequest(themetemplateDelOpt);
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
            var add_themeName = $("#themeName").val();

            var oTempTable = {
                index:[],
                column:["pagemodel"]
            };
            var oStData = jFormSSID.form ("getTableValue", oTempTable);
            hPending = Frame.Msg.pending("页面模板添加中...");
            
            function themetemplateAddSuc(data){
                if(data.errorcode==0){
                    Utils.Pages.closeWindow(Utils.Pages.getWindow(jFormSSID));
                    //由于添加页面模板是异步操作，后台说大概三秒钟就能返回所以就等待三秒。
                    

                    //延时三秒执行弹出编辑页面的函数
                    setTimeout(function(){
                        hPending.close();
                        pageListData();
                        
                            
                        function getQueryByNameSuc(data){
                            if(data.errorcode == 0){
                                /* 添加页面模板成功后，弹出编辑页面。 */
                                (function(){
                                    Frame.Util.openpage({
                                        pageURL: "https://" + data.data.domain + "/o2o/uam/theme/" + data.data.pathname + "/draw.xhtml?templateId=" + data.data.id + "&type=1",
                                            /* url存放在全局变量里  如果是测试环境需要加上test
                                        正式环境不需要加test*/
                                        height: "500px",
                                        hotkeys: "no"
                                    });
                                return false;
                                })();
                            }else if( data.errorcode == 1202 ){

                            }
                        }

                        function getQueryByNameFail(data){
                            console.log("getQueryByNameFail find dukaige");
                        }
                        
                        /* 在页面模板添加成功之后，需要弹出相对应的编辑页面，所以就应该调querybyname接口来获取pathname和id */
                        var getPathByName ={
                            type: "GET",
                            url: v2path+"/themetemplate/querybyname",
                            dataType:"json",
                            data:{
                                "ownerName":FrameInfo.g_user.attributes.name,
                                "storeId":FrameInfo.Nasid,
                                "themeName":add_themeName
                            },
                            onSuccess: getQueryByNameSuc,
                            onFailed: getQueryByNameFail

                        }

                        // Utils.Request.sendRequest(getPathByName);  //发送数据请求

                    },3000);
                   
                   
                }else if(data.errorcode==1201){
                    hPending.close();
                    Frame.Msg.info("增加页面模板名称已经存在","error");
                }else if(data.errorcode==1001){
                    hPending.close();
                    Frame.Msg.info("页面模板名称不能为空","error");
                }else if(data.errorcode == 1){
                    hPending.close();
                    Frame.Msg.info("添加页面模板失败","error");
                }else{
                    hPending.close();
                    Frame.Msg.info("添加页面模板失败","error");
                }
            }

            function themetemplateAddFail(){
                console.log("themetemplateAddFail find dukaige");
            }

            var themetemplateAddOpt = {
                type: "POST",
                url: v2path+"/themetemplate/add",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify({
                    "ownerName": FrameInfo.g_user.attributes.name,
                    "storeId":FrameInfo.Nasid,
                    "themeName": $("#themeName").val(),
                    "description": $("#description").val(),
                    "themeType":oStData.pagemodel || 1,
                    "v3flag":1     //方便过滤数据
                }),
                onSuccess: themetemplateAddSuc,
                onFailed: themetemplateAddFail
            }

            Utils.Request.sendRequest(themetemplateAddOpt);
        }

        function onSubmitEditPageModel()
        {
            var themetemplateModifyOpt = {
                type: "POST",
                url: v2path+"/themetemplate/modify",
                //username: username,
                //password: password,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify({
                    "ownerName":FrameInfo.g_user.attributes.name,
                    "storeId":FrameInfo.Nasid,
                    "themeName": $("#themeName").val(),
                    "description": $("#description").val(),
                }),
                onSuccess: themetemplateModifySuc,
                onFailed: themetemplateModifyFail
            }

            function themetemplateModifySuc(data){
                Utils.Base.refreshCurPage();
                Frame.Msg.info("配置成功");
            }

            function themetemplateModifyFail(){

            }

            Utils.Request.sendRequest(themetemplateModifyOpt);
        }

        var jFormSSID = $("#pagetoggle_form");
        var pageName = sName;

        if(pageName == "add") //Add
        {
            var jDlg = $("#AddPageTempDlg");
            $("#themeName",jFormSSID).attr("readonly",false);
            $("#edit_to_page").addClass("hide");   //隐藏编辑处的代码
            $("#add_to_page").removeClass("hide");  //显示添加处的代码


            if(jDlg.children().length)
            {
                $("#pageToggle").show().insertAfter($(".modal-header",jDlg));
            }
            else
            {
                $("#pageToggle").show().appendTo(jDlg);
            }

            $('input[type="radio"][name="pagemodel"]').bind('click',function(){
                var ID = $(this).attr('id');
                if(ID === 'simple_add'){
                    $("#img_src").attr("src","../frame/css/image/page_model1.png");   //修改model1的src
                }
                else{
                    $("#img_src").attr("src","../frame/css/image/page_model2.png");
                }
            });


            jFormSSID.form("init", "edit", {"title":getRcText("ADDPAGE_TITLE"),"btn_apply": onSubmitSSID});
            //清空默认配置
            jFormSSID.form("updateForm",{
                themeName:"",
                description:"",
                pagemodel:1
            });
            $("input[type=text]",jFormSSID).each(function(){
                Utils.Widget.setError($(this),"");
            });
            Utils.Base.openDlg(null, {}, {scope:jDlg,className:"modal-super"});
        }
        else //Edit
        {
            if(oRowdata.pagemodel === 1){
                $("#simple1_edit_manage").removeClass("hide");
                $("#nostalgic_edit_manage").addClass("hide");
            }else{
                $("#nostalgic_edit_manage").removeClass("hide");
                $("#simple1_edit_manage").addClass("hide");
            }
            jFormSSID.form ("init", "edit", {"btn_apply": onSubmitEditPageModel, "btn_cancel":onCancel});
            $("#add_to_page").addClass("hide");
            $("#edit_to_page").removeClass("hide");

            $("#themeName",jFormSSID).attr("readonly",true);
            jFormSSID.form("updateForm",oRowdata);
            $("input[type=text]",jFormSSID).each(function(){
                Utils.Widget.setError($(this),"");
            });
        }
    }

    function initGrid() {
        var optpage = {
            colNames: getRcText("Page_HEADER"),
            multiSelect: false,
            //  pageSize:2,
            colModel: [
                {name: 'themeName', datatype: "String"},
                {name: 'description', datatype: "String"}
            ],
            onToggle: {
                action: showPage,
                jScope: $("#pageToggle"),
                BtnDel: {
                    show: true,
                    action: onDelPage
                }
            },
            buttons: [
                {name: "add", action: showPage}
            ]
        };

        if(!g_fqfj_operateBtn){
            delete optpage.onToggle;
        }
        
        $("#pageList").SList("head", optpage);
    }

    function getTracker()
    {
        var getTrackerOpt = {
            type: "GET",
            url: MyConfig.v2path + "/themetemplate/getTracker",
            dataType: "json",
            contentType: "application/json",
            onSuccess: getTrackerSuc,
            onFailed: getTrackerFail
        }

        function getTrackerSuc(data){
            return data.data;
        }

        function getTrackerFail(){
            return false;
        }

        Utils.Request.sendRequest(getTrackerOpt);
    }

    //打开编辑页面
    function open_edit_page(){

        function getTrackerSuc(data){
            
            if (data.errorcode == 0 && data.data.length != 0) {
                var sTracker = data.data;
                Frame.Util.openpage({
                    pageURL:"https://" + window.location.host + "/v3/web/themepage_o2o/template0" + sValue  + "&tracker=" + sTracker,
                    /* 如果是测试环境需要加上test,正式环境不需要加test*/
                    height:"500px",
                    hotkeys:"no"
                });
                return false;
            }
            else{
                Frame.Msg.info("查询数据异常", "error");
                return false;
            }
        }

        function getTrackerFail(err){
            Frame.Msg.info("查询数据异常", "error");
            return false;
        }

        var sValue = this.value;

        var getTrackerOpt = {
            type: "GET",
            url: MyConfig.v2path + "/themetemplate/getTracker",
            dataType: "json",
            contentType: "application/json",
            onSuccess: getTrackerSuc,
            onFailed: getTrackerFail
        }

        Utils.Request.sendRequest(getTrackerOpt);

        
    }

    function initForm(){
        //打开编辑页面
        $("#simpledraw_1").on("click", open_edit_page);

        $("#simpledraw_2").on("click", open_edit_page);

        $("#feelauth1").on("click",function(){
            $(this).attr("checked","true");
            $("#anthTime").removeClass("hide");
        })
        $("#feelauth2").on("click",function(){
            $(this).attr("checked","true");
            $("#anthTime").addClass("hide");
        })
        $("#authType2").on("click",function(){
            $(this).attr("checked","true");
            $("#other_auth").removeClass("hide");
        })
        $("#authType1").on("click",function(){
            $(this).attr("checked","true");
            $("#other_auth").addClass("hide");
        })

        //链接详情页面
        $("#detail").on("click", function(){
            Utils.Base.redirect ({np:"auth.drawpage"});
            return false;
        });
    }


    function initData(jScope)
    {   
        // getTracker();
        pageListData();
    }

    function _init ()
    {
        initFenJiFenQuan();

        initGrid();
        initData();
        initForm();

        initFenJiFenQuan();
    }

    function initFenJiFenQuan()
    {
        //1 获取到数组
        var arrayShuZu=[];
        arrayShuZu=Frame.Permission.getCurPermission();
        
        //2 将数组作简洁处理
        var arrayShuZuNew=[];
        $.each(arrayShuZu,function(i,item){
            var itemNew=item.split('_')[1];
            arrayShuZuNew.push(itemNew);
        });
        // console.log(arrayShuZuNew);

        //3 作具体的“显示、隐藏”处理
        if($.inArray("WRITE",arrayShuZuNew)==-1){
            //隐藏“写”的功能
            //写
            ($(".slist-button[title='添加']")) .css('display','none');
            g_fqfj_operateBtn=false;
        }

    }

    function _destroy()
    {

    }
    function _resize(jParent)
    {
    }

    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["SList","SingleSelect","Minput","Form"],
        "utils": ["Base","Request"]
    });
})(jQuery);