/* global Frame */
/* global FrameInfo */
/**
 * Created by Administrator on 2015/11/26.
 */
(function ($)
{
    var MODULE_NAME = "h_wireless.index_add2";
    var g_Radios, g_PercentMax = 100;
    g_aAPlist = [];
    oapname_SN = {};
    var g_oTableData = {};
    // 对Date的扩展，将 Date 转化为指定格式的String   
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
    // 例子：   
    // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
    // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
    Date.prototype.format = function(fmt)   { //author: meizz   
        var o = {   
            "M+" : this.getMonth()+1,                 //月份   
            "d+" : this.getDate(),                    //日   
            "h+" : this.getHours(),                   //小时   
            "m+" : this.getMinutes(),                 //分   
            "s+" : this.getSeconds(),                 //秒   
            "q+" : Math.floor((this.getMonth()+3)/3), //季度   
            "S"  : this.getMilliseconds()             //毫秒   
        };   
        if(/(y+)/.test(fmt))   
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
        for(var k in o)   
            if(new RegExp("("+ k +")").test(fmt))   
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
        return fmt;   
    }
   

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("ws_ssid_rc", sRcName).split(",");
    }

    function refreshSSIDList(obj){
        var arr = [];
        for (var a in obj){
            arr.push(obj[a]);
        }
        $("#ssidList").SList ("refresh", arr);
    }
    
    function initData(jScope){


    }
    
  

    function onCfgAddSsid_choice(){//选择具体的ap还是ap组

        // Utils.Pages.closeWindow(Utils.Pages.getWindow( $("#AddStForm")));
        // var addForm = $("#AddStForm_choice");
        // addForm.form("init", "edit", {"title":getRcText("ADD_TITLE"), "btn_apply":onCfgAddSsid_choice, "btn_cancel":onCancelAddSsid_choice});
        // Utils.Base.openDlg(null, null,{scope:$("#AddSt_choice"), className:"modal-large"});
       
    }
    function onCancelAddSsid_choice(){
        $("input[type=text]",$("#AddStForm_choice")).each(function() {
            Utils.Widget.setError($(this),"");
        });
        $("#AddStForm_choice").form("updateForm",{
            ssid_name: "",
            password: "",
            hiding: 0,
            policy_status: 0,
            encrypt_status: 0,
            portal_policy_status: 0,
            upload_rate: "",
            download_rate: ""
        })
        Utils.Pages.closeWindow(Utils.Pages.getWindow( $("#AddStForm_choice"))); 
    }


    function onCfgAddSsid_inner()
    {
        Utils.Pages.closeWindow(Utils.Pages.getWindow( $("#AuthenticationForm")));
    } 

    function onCancelAddSsid_inner()
    {
        $("input[type=text]",$("#AuthenticationForm")).each(function() {
                Utils.Widget.setError($(this),"");
        });
        $("#AuthenticationForm").form("updateForm",{
            ssid_name: "",
            password: "",
            hiding: 0,
            policy_status: 0,
            encrypt_status: 0,
            portal_policy_status: 0,
            upload_rate: "",
            download_rate: ""
        })
        Utils.Pages.closeWindow(Utils.Pages.getWindow( $("#AuthenticationForm")));
    }
    function onCancelAddSsid()
    {
        $("input[type=text]",$("#AddStForm")).each(function() {
                Utils.Widget.setError($(this),"");
        });
        $("#AddStForm").form("updateForm",{
            ssid_name: "",
            password: "",
            hiding: 0,
            policy_status: 0,
            encrypt_status: 0,
            portal_policy_status: 0,
            upload_rate: "",
            download_rate: ""
        })
        Utils.Pages.closeWindow(Utils.Pages.getWindow( $("#AddStForm")));
    }
    
    

    function initGrid()
    {

        
    }
    function addblackShow(aRows) {
        var bAddtoBlackshow = false;
        if (aRows.length > 0) {
            for (var i = 0; i < aRows.length; i++) {
                if (aRows[i].isBlackUser == true) {
                    return false;
                }
            }
            return true;
        }
        return bAddtoBlackshow;
    }

    function bindAP(data) {
        for (var i = 0; i < data.length; i++) {
            data[i].apGroupName = "是";
            if (data[i].apGroupName = "是") {
                Frame.Msg.info("配置成功");
            } else {
                Frame.Msg.error(data.errormsg);
            }
        };

        $("#detail_listAP").SList("refresh");
        $("#InfoDlgAP").modal("hide");
    }

    function unbindAP(data) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].apGroupName = "是") {
                data[i].apGroupName = "否";
                Frame.Msg.info("配置成功");
            }
        };
        $("#detail_listAP").SList("refresh");
        $("#InfoDlgAP").modal("hide");
    }

    function bindAPGroup(data) {
        for (var i = 0; i < data.length; i++) {
            data[i].apGroupName = "是";
            if (data[i].apGroupName = "是") {
                Frame.Msg.info("配置成功");
            } else {
                Frame.Msg.error(data.errormsg);
            }
        };

        $("#detail_listAPGroup").SList("refresh");
        $("#InfoDlgAPGroup").modal("hide");
    }

    function unbindAPGroup(data) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].apGroupName = "是") {
                data[i].apGroupName = "否";
                Frame.Msg.info("配置成功");
            }
        };

        $("#detail_listAPGroup").SList("refresh");
        $("#InfoDlgAPGroup").modal("hide");
    }
    function cancelAllAP() {
        $("#InfoDlgAP").modal("hide"); //让弹窗消失的按钮
    }

    function cancelAllAPGroup() {
        $("#InfoDlgAPGroup").modal("hide"); //让弹窗消失的按钮
    }

    function onShowAdvieace(sCheck)
    {
        if (sCheck != 'LP1' && sCheck != 'LP4') 
        {
            if (sCheck == 'AT1')
            {
                $("#denglu").hide();
                $("#weixin").hide();
                $("#mian").hide();
            }
            else if(sCheck == 'AT4')
            {
                $("#denglu").show();
                $("#weixin").show();
                $("#mian").hide();
            }
            else
            {
                $("#denglu").show();
                $("#weixin").show();
                $("#mian").show();
            }
        }
        if(sCheck == 'LP1'){
            $("#LoginPageSelect").hide();
        }
    }

    function initFrom(){
        var optSsid = {
            colNames: getRcText ("SSID_HEADER"),
            multiSelect: false,
            colModel: [
                {name:'SSID', datatype:"String"},
                {name:'AuthType', datatype:"String"}
            ],
            buttons:[
                {name: "add", action: onAddSSID},
            ]
        };
        $("#ssidList").SList ("head", optSsid);

        //初始化绑定AP的表头和按钮还有假数据还有初始化绑定AP的form表单
        var oSListAP = {
            height: "70",
            showHeader: true,
            multiSelect: true,
            pageSize: 10,
            colNames: getRcText("ALLAP_HEADER3"),
            colModel: [{
                name: "apName",
                datatype: "String"
            }, {
                name: "apModel",
                datatype: "String"
            }, {
                name: "apSN",
                datatype: "String"
            }, {
                name: "apGroupName",
                datatype: "String"
            }]
            ,
            buttons: [
            
             {
                name: "Bind",
                value: "绑定",
                enable: addblackShow,
                action: bindAP
            }
            , {
                name: "unBind",
                value: "去绑定",
                enable: addblackShow,
                action: unbindAP
            }
            ,{
                name: "BindAp",
                value: "下一步",
                enable: addblackShow,
                action: BindAp_gonext
            }
            // , {
            //     name: "cancel",
            //     value: "取消",
            //     enable: true,
            //     action: cancelAllAP
            // }
            ]
        };
        var shuju=[
                   {
                    "apName":"ap1",
                    "apModel":"20-12-15A",
                    "apSN":"WA2158",
                    "apGroupName":"否"
                   
                   },
                   {
                    "apName":"ap2",
                    "apModel":"20-12-15B",
                    "apSN":"WA0547",
                    "apGroupName":"否"
                   }
        ];
        $("#detail_listAP").SList("head", oSListAP);
        $("#detail_listAP").SList ("refresh", shuju);
        $("#InfoDlgFormAP").form("init", "edit", {
            "title": getRcText("ADD_TITLE"),
            "btn_apply": false,
            "btn_cancel": false
        });

        //初始化绑定AP组的表头和按钮还有假数据还有初始化绑定AP组的form表单
        var oSListAPGroup = {
            height: "70",
            showHeader: true,
            multiSelect: true,
            pageSize: 10,
            colNames: getRcText("ALLAP_HEADER4"),
            colModel: [{
                name: "apName",
                datatype: "String"
            }, {
                name: "apGroupName",
                datatype: "String"
            }]
            ,
            buttons: [
            {
                name: "bind",
                value: "绑定",
                enable: addblackShow,
                action: bindAPGroup
            }, 
            {
                name: "unBind",
                value: "去绑定",
                enable: addblackShow,
                action: unbindAPGroup
            }
            ,{
                name: "BindApGroup",
                value: "下一步",
                enable: addblackShow,
                action: BindApGroup_gonext
            }
            // , {
            //     name: "cancel",
            //     value: "取消",
            //     enable: true,
            //     action: cancelAllAPGroup
            // }
            ]
        };
        var apGroupshuju=[
                   {
                    "apName":"apGroup1",
                    "apGroupName":"否"
                    },
                    {
                    "apName":"apGroup2",
                    "apGroupName":"否"
                    }
        ];
        $("#detail_listAPGroup").SList("head", oSListAPGroup);
        $("#detail_listAPGroup").SList ("refresh", apGroupshuju);
         //这句话是在弹出框中加上AP列表那项
        $("#InfoDlgFormAPGroup").form("init", "edit", {
            "title": getRcText("ADD_TITLE"),
            "btn_apply": false,
            "btn_cancel": false
        });

        //第一步,初始化第一个form,弹出第一个form
        function onAddSSID()
        {
            var addForm = $("#AddStForm");//第一个form
            addForm.form("init", "edit", {"title":getRcText("ADD_TITLE"), "btn_apply":onCfgAddSsid, "btn_cancel":onCancelAddSsid});
            $(".modal-footer").show();
            Utils.Base.openDlg(null, null,{scope:$("#AddSt"), className:"modal-large"});
        }

        function onCfgAddSsid()//第一个form关闭，打开第二个form，页面上的按钮才是真正的连接第三个表单
        {
            Utils.Pages.closeWindow(Utils.Pages.getWindow( $("#AddStForm")));//第一个form关闭
            var addForm = $("#AddStForm_choice");//准备初始化第二个form
            addForm.form("init", "edit", {"title":getRcText("BIND"), "btn_apply":onCfgAddSsid_choice, "btn_cancel":onCancelAddSsid_choice});
            $(".modal-footer").hide();
            Utils.Base.openDlg(null, null,{scope:$("#AddSt_choice"), className:"modal-large"});//打开第二个form
        }

        //点击绑定AP触发的事件，先关闭id为AddSt_choice的页面，再openDlg绑定AP那个页面
        $("#ensureBindAp").click(function(){
            //Utils.Base.updateHtml($("#InfoDlgFormAP"), oData);
            Utils.Pages.closeWindow(Utils.Pages.getWindow( $("#AddSt_choice")));
            $("#detail_listAP").SList("resize");
            Utils.Base.openDlg(null, {}, {
                scope: $("#InfoDlgAP"),
                className: "modal-super"
            });
            // BindAp_gonext();
        })
        //点击绑定AP组触发的事件，先关闭id为AddSt_choice的页面，再openDlg绑定AP组那个页面
        $("#ensureBindApGroup").click(function(){//这里弹出ap的表单，根据$("#BindAp_gonext")去绑定最后一个认证表单
            //Utils.Base.updateHtml($("#InfoDlgFormAPGroup"), oData);
            Utils.Pages.closeWindow(Utils.Pages.getWindow( $("#AddSt_choice")));
            $("#detail_listAPGroup").SList("resize");
            Utils.Base.openDlg(null, {}, {
                scope: $("#InfoDlgAPGroup"),
                className: "modal-super"
            });

        })
        
        //先关闭id为InfoDlgAP的页面，再初始化认证的form表单，然后打开这个页面
        function BindAp_gonext(){
             Utils.Pages.closeWindow(Utils.Pages.getWindow( $("#InfoDlgAP")));
            var addForm = $("#AuthenticationForm");
            addForm.form("init", "edit", {"title":getRcText("AUTHEN"), "btn_apply":onCfgAddSsid_inner, "btn_cancel":onCancelAddSsid_inner});
            $(".modal-footer").show();
            Utils.Base.openDlg(null, null,{scope:$("#Authentication"), className:"modal-large"});
        }
        //先关闭id为InfoDlgAPGroup的页面，再初始化认证的form表单，然后打开这个页面
        function BindApGroup_gonext(){
             Utils.Pages.closeWindow(Utils.Pages.getWindow( $("#InfoDlgAPGroup")));
            var addForm = $("#AuthenticationForm");
            addForm.form("init", "edit", {"title":getRcText("AUTHEN"), "btn_apply":onApGroup_gonext, "btn_cancel":onCancelApGroup_gonext});
            $(".modal-footer").show();
            Utils.Base.openDlg(null, null,{scope:$("#Authentication"), className:"modal-large"});
        }
        
        function onCfgAddSsid_inner(){
            $("#Authentication").modal("hide");
        }
        function onCancelAddSsid_inner(){
            $("#Authentication").modal("hide");
        }

        $("#cancelBindAp").click(function(){
            $("#InfoDlgAP").modal("hide");

        })

        function onApGroup_gonext(){
            $("#Authentication").modal("hide");
        }

        function onCancelApGroup_gonext(){
            $("#Authentication").modal("hide");
        }

        $("#cancelBindApGroup").click(function(){
            $("#InfoDlgAPGroup").modal("hide");
            
        })

        $("#cancel").click(function(){
            $("input[type=text]",$("#AddStForm")).each(function() {
                Utils.Widget.setError($(this),"");
            });
            $("#AddStForm").form("updateForm",{
                ssid_name: "",
                password: "",
                hiding: 0,
                policy_status: 0,
                encrypt_status: 0,
                portal_policy_status: 0,
                upload_rate: "",
                download_rate: ""
            })
            Utils.Pages.closeWindow(Utils.Pages.getWindow( $("#AddStForm")));
        })

        $("input[name=StType],input[name=AccPwdStaff]").bind("change",function(){
            var aContent = $(this).attr("content");
            var sCtrlBlock = $(this).attr("ctrlBlock") || "";
            $(sCtrlBlock).hide();
    
            if(!aContent) return true;
    
            aContent = aContent.split(",");
            for(var i=0;i<aContent.length;i++)
            {
                if(!aContent[i])continue;
                $(aContent[i]).show();
            }
            $("input[name=AccPwdCorpo]").MRadio("setValue",'2',true);
            $("input[name=AccPwdStaff]").MRadio("setValue",'2');
        });
        
        $(".switch,#impose_auth").bind("minput.changed",function(e,data){
            var sClass = $(this).attr("ctrlBlock");
            this.checked ? $(sClass).show() : $(sClass).hide() ;
        });

        $("input[name=AuthenType], input[name=LoginPage]").bind("change",function(){
            var aContent = $(this).attr("content");
            var sCtrlBlock = $(this).attr("ctrlBlock") || "";
            $(sCtrlBlock).hide();
            if(!aContent) return true;
            aContent = aContent.split(",");
            for(var i=0;i<aContent.length;i++)
            {
                if(!aContent[i])continue;
                $(aContent[i]).show();
            }
        });
        
        $("#impose_auth_time").bind("change", function(){
           var value = $(this).val();
           if (value > 30){
               $(this).val(30);
           }
           else if (value < 1){
               $(this).val(1)
           }
        });   
        $("#cipherSuite_true").click(function(){
            $("#cipherKey_out").show();
        });
        $("#cipherSuite_false").click(function(){
            $("#cipherKey_out").hide();
        });
        $("input[type=radio][name=AuthenType],input[type=radio][name=LoginPage]").on("click",function(){
            var sCheck = $(this).val();
            onShowAdvieace(sCheck);
        });
    }


    function _init ()
    {
        initGrid();
        initFrom();
        initData();    
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
        "widgets": ["SList","SingleSelect","Minput","Form","MSelect"],
        "utils": ["Base","Device"]
    });

}) (jQuery);
