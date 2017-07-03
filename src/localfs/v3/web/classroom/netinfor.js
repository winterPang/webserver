;(function ($) {
    var MODULE_BASE = "classroom";
    var MODULE_NAME = MODULE_BASE + ".netinfor";

    var g_RowType = getRcText("EDIT_TITLE").split(","); 
    function getRcText (sRcName)
    {
        return Utils.Base.getRcString("c_net_infor_rc",sRcName);
    }
    //获取手环
    function getWristband(pageNum,pageSize,oFilter)
    {
        var pageSize1 = pageSize || 10;
        var pageNum1 = pageNum || 1;
        var oFilter1 = oFilter || {};
        var oParam = {
            devSn: FrameInfo.ACSN,
            startRowIndex: pageSize1 * (pageNum1 - 1),
            maxItem: pageSize1
        };

        $.extend(oParam,oFilter1);
        var option = {
            type:"POST",
            url:"/v3/wristbandread",
            contentType:"application/json",
            data:JSON.stringify({
                devSn:FrameInfo.ACSN,
                Method:"getWristbandConfig",
                Param:oParam
            }),
            onSuccess: function(oData){
                var aStu = [];
                if(oData.result.retCode != 0)
                {
                    Frame.Msg.info("获取手环数据失败");
                }

                for(var i=0;i<oData.result.data.length;i++)
                {
                    if(oData.result.data[i].notifyStaus==1){
                        var oTemp = {
                            Serial:i+1,
                            wristbandId : oData.result.data[i].wristbandId,
                            notifyStaus:getRcText("STATUS").split(",")[0]
                        };
                    }else{
                        var oTemp = {
                            Serial:i+1,
                            wristbandId : oData.result.data[i].wristbandId,
                            notifyStaus:getRcText("STATUS").split(",")[1]
                        };
                    }

                    aStu.push(oTemp);
                }
                $("#NetInforList").SList ("refresh",{data: aStu, total: oData.result.rowCount});
            },
            onFailed: function(jqXHR,textstatus,error){
                Frame.Msg.info("数据更新异常", "error");
            }
        };
        Utils.Request.sendRequest(option);
    }
    // 添加手环
    function addWristband(oMac,addWristbandSuc)
    {
        var option = {
            type:"POST",
            url:"/v3/wristbandwrite",
            contentType:"application/json",
            data:JSON.stringify({
                devSn:FrameInfo.ACSN,
                Method:"addWristbandConfig",
                Param:{
                    devSn: FrameInfo.ACSN,
                    wristbandId:oMac
                }
            }),
            onSuccess: addWristbandSuc,
            onFailed: function(jqXHR,textstatus,error){
                Frame.Msg.info("数据更新异常", "error");
            }
        };
        Utils.Request.sendRequest(option);
    }
    //删除手环
    function delWristband(oParam,getBangleInfolSuc)
    {
        var oParam1 = {
            devSn:FrameInfo.ACSN
        }
        $.extend(oParam1,oParam);
        var option = {
            type:"POST",
            url:"/v3/wristbandwrite",
            contentType:"application/json",
            data:JSON.stringify({
                devSn:FrameInfo.ACSN,
                Method:"delWristbandConfig",
                Param:oParam1
                /*{
                 devSn: FrameInfo.ACSN,
                 wristbandId:oMac,
                 isCancelNotify:isCancelNotify
                 }*/
            }),
            onSuccess: getBangleInfolSuc,
            onFailed: function(jqXHR,textstatus,error){
                Frame.Msg.info("数据更新异常", "error");
            }
        };
        Utils.Request.sendRequest(option);
    }
    //手环发布
    function notifyWristbandId(oParam){
        var oParam1 = {
            devSn:FrameInfo.ACSN
        }
        $.extend(oParam1,oParam);
        var option = {
            type:"POST",
            url:"/v3/wristbandwrite",
            contentType:"application/json",
            data:JSON.stringify({
                devSn:FrameInfo.ACSN,
                Method:"notifyWristbandId",
                Param:oParam1
            }),
            onSuccess:function(data){
                //console.log(data)
                //initData();
                Utils.Base.refreshCurPage();
            },
            onFailed: function(jqXHR,textstatus,error){
                Frame.Msg.info("数据更新异常", "error");
            }
        };
        Utils.Request.sendRequest(option);
    }

    function initData()
    {
        getWristband(1,10,{});
    }

    function initGrid()
    {
        function addAll(param){

            function applyFun(type) {
                Utils.Pages.closeWindow(Utils.Pages.getWindow($("#addMac_form")));
                var oMac=$("#add_mac").val();
                function addWristbandSuc(aData,textStaus,jqXHR){
                    if(aData.retCode != 0){
                        Frame.Msg.info("添加手环失败！");
                    }
                    //initData();
                    Utils.Base.refreshCurPage();
                }
                addWristband(oMac,addWristbandSuc);
            }
            function cancelFun() {
                Utils.Pages.closeWindow(Utils.Pages.getWindow($("#addMac_form")));
            }
            $("#addMac_form").form("init", "edit", {
                "title": getRcText("EDIT_TITLE").split(",")[0],
                "btn_apply": applyFun, "btn_cancel": cancelFun/*CancelShop*/
            });
            Utils.Base.openDlg(null, {}, {scope: $("#EditDlg"), className: "modal-small"});
            $("label.error").attr("style","display:none");
            $("#add_mac").val("");
            $("input.required.text-error").removeClass("text-error");

        }
        function delAll(oPara){
            var oMac=[];
            for(var n=0; n<oPara.length;n++) {
                var oTemp = oPara[n].wristbandId;
                oMac.push(oTemp);
            }
            function delWristbandSuc(data){
                //console.log(data);
                if(data.retCode!=0)
                {
                    // Frame.Msg.info("删除手环失败！");
                }
                //initData();
                Utils.Base.refreshCurPage();
            }
            $("#del_form").form("init", "edit", {
                "title": getRcText("EDIT_TITLE").split(",")[1],
                "btn_apply": function(){
                    if($("#cancelNotify").is(':checked')){
                        var oTemp={
                            wristbandId:oMac,
                            isCancelNotify:1
                        }
                    }else{
                        var oTemp={
                            wristbandId:oMac,
                            isCancelNotify:0
                        }
                    }
                    //console.log(oTemp);
                    delWristband(oTemp,delWristbandSuc);
                    Utils.Pages.closeWindow(Utils.Pages.getWindow($("#del_form")));
                },
                "btn_cancel":function(){
                    Utils.Pages.closeWindow(Utils.Pages.getWindow($("#del_form")));
                }
            });
            Utils.Base.openDlg(null, {}, {scope: $("#DeleteDlg"), className: "modal-large"});
            $("#cancelNotify")[0].checked=false;
            $("#notCancelNotify")[0].checked=false;
            $($('#cancel').children()[0]).children('span').removeClass('checked')
            $($('#notCancel').children()[0]).children('span').removeClass('checked')

        }
        function exportNow(param){
            function applyFun1() {
                Utils.Pages.closeWindow(Utils.Pages.getWindow($("#URL_form")));
                for(var i=0;i<param.length;i++){
                    var aWristbandId=[];
                    aWristbandId[0]=param[i].wristbandId;
                    var userInfo = {
                        userName:$("#user_name").val(),
                        password:$("#password").val(),
                        url:$("#url").val(),
                        wristbandId:aWristbandId
                    };
                    notifyWristbandId(userInfo);
                }
            }
            $("#URL_form").form("init", "edit", {
                "title": getRcText("EDIT_TITLE").split(",")[2],
                "btn_apply": function(){
                    applyFun1();
                },
                "btn_cancel":function(){
                    Utils.Pages.closeWindow(Utils.Pages.getWindow($("#URL_form")));
                }
            });
            Utils.Base.openDlg(null, {}, {scope: $("#Upload"), className: "modal-large"});
            $("label.error").attr("style","display:none");
            $("input.required.text-error").removeClass("text-error");

            $("#url").val("");
            $("#user_name").val("");
            $("#password").val("");
        }
        var optInfor = {
            colNames: getRcText ("INFOR_HEAD"),
            showHeader: true,
            multiSelect: true,
            pageSize: 10,
            asyncPaging:true,
            onPageChange:function(pageNum,pageSize,oFilter){
                if(oFilter){
                    var re=new RegExp(oFilter.notifyStaus,"gi");
                    var str1="未发布";
                    var str2="已发布"
                    var oFilt = {};
                    oFilt.wristbandIdWeak = oFilter.wristbandId;
                    if(oFilter.notifyStaus){
                        oFilt.notifyStaus=-1;
                    }
                    if(oFilter.notifyStaus && str1.match(re)){
                        oFilt.notifyStaus=0;
                    }
                    if(oFilter.notifyStaus && str2.match(re)){
                        oFilt.notifyStaus=1;
                    }
                }
                getWristband(pageNum,pageSize, oFilt);
            },
            onSearch:function(oFilter,oSorter){
                if(oFilter){
                    var re=new RegExp(oFilter.notifyStaus,"gi");
                    var str1="未发布";
                    var str2="已发布"
                    var oFilt = {};
                    oFilt.wristbandIdWeak = oFilter.wristbandId;
                    if(oFilter.notifyStaus){
                        oFilt.notifyStaus=-1;
                    }
                    if(oFilter.notifyStaus && str1.match(re)){
                        oFilt.notifyStaus=0;
                    }
                    if(oFilter.notifyStaus && str2.match(re)){
                        oFilt.notifyStaus=1;
                    }
                }
                getWristband(1,10, oFilt);
            },
            colModel: [
                {name:'Serial', datatype:"String"},
                {name:'wristbandId', datatype:"String"},
                {name:'notifyStaus', datatype:"String"}
            ] ,
            buttons: [
                {
                    //name: "class_newadd",
                    enable: "<1",
                    value: g_RowType[0],
                    mode: Frame.Button.Mode.CREATE,
                    action: addAll
                },
                {
                    //name: "class_delete",
                    enable: ">0",
                    value: g_RowType[1],
                    mode: Frame.Button.Mode.DELETE,
                    action: delAll
                },
                {
                    //name: "class_download",
                    /*enable: "==1",*/
                    value: g_RowType[2],
                    mode: Frame.Button.Mode.DOWNLOAD,
                    action: exportNow
                }
            ]
        };
        $("#NetInforList").SList ("head", optInfor);
    }
    function initEvent(){
        function setBreadContent(paraArr){
            
            $("#bread_index").css("display",'inline');
            $("#bread_index a").attr("href","#C_CDashboard");
            $("#bread_index a").text("网络管理");
            
            if(paraArr[0].text != ""){
                $("#bread_1").css("display",'inline');
                $("#bread_1 a").attr("href",paraArr[0].href);
                $("#bread_1 a").text(paraArr[0].text);
            }else{
                $("#bread_1").css("display",'none');
            }
            
            if(paraArr[1].text != ""){
                $("#bread_2").css("display",'inline');
                $("#bread_2 a").attr("href",paraArr[1].href);
                $("#bread_2 a").text(paraArr[1].text);
            }else{
                $("#bread_2").css("display",'none');
            }
            
            if(paraArr[2].text != ""){
                $("#bread_active").css("display",'inline');
                $("#bread_active").text(paraArr[2].text);
            }else{
                $("#bread_active").css("display",'none');
            }
        }
        setBreadContent([{text:'',href:''},
                        {text:'',href:''},
                        {text:'手环管理',href:''}]);
                        
        $('#NetInforList').on("click",".search-icon",function(){
            $("input[sid=Serial]").attr("disabled","disabled");
        })
    }
    function _init ()
    {
        initEvent();
        initGrid();
        initData();
    }

    function _destroy ()
    {

    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList","Form","SingleSelect","Typehead","Minput", "Switch"],
        "utils":["Request","Base"]
    });
})( jQuery );