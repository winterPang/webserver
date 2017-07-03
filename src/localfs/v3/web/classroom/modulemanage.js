;(function ($) {
    var MODULE_BASE = "classroom";
    var MODULE_NAME = MODULE_BASE + ".modulemanage";
    var g_RowType = getRcText("EDIT_TITLE").split(",");
   // var startNum = null;
    var devSN=FrameInfo.ACSN;
    var Timer_Interval = null;
    function getRcText (sRcName)
    {
        return Utils.Base.getRcString("c_net_infor_rc",sRcName);
    }
    //获取ap列表
    function getApList(devSN, startNum,oFilter,getWeChatDetailSuc) {
       /* var oParam = {
                findoption:oFilter,
                sortoption:{apName:1}
            /!*body:{ap:1}*!/
        };*/
       /* $.extend(oParam,oPara);*/
        var getApListOpt = {
            type: "POST",
            url: MyConfig.path + "/apmonitor/app/aplist_page?devSN="+devSN+"&skipnum="+startNum+"&limitnum=3",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                findoption:oFilter,
                sortoption:{apName:1}
            }),
            onSuccess: getWeChatDetailSuc,
            onFailed: function(jqXHR,textstatus,error) {
                Frame.Msg.info("获取ap列表异常", "error");
            }
        };

        Utils.Request.sendRequest(getApListOpt);
    }
    function notifyScannerId(oParam){
        var oParam1 = {
            devSn:FrameInfo.ACSN
        }
        $.extend(oParam1,oParam);
        var option = {
            type:"POST",
            url:"/v3/smartcampuswrite",
            contentType:"application/json",
            data:JSON.stringify({
                devSn:FrameInfo.ACSN,
                Method:"notifyScannerId",
                Param:oParam1
            }),
            onSuccess:function(data){
                //console.log(data)
            },
            onFailed: function(jqXHR,textstatus,error){
                Frame.Msg.info("数据更新异常", "error");
            }
        };
        Utils.Request.sendRequest(option);
    }
    function cancelNotifyScannerId(oParam){
        var oParam1 = {
            devSn:FrameInfo.ACSN
        }
        $.extend(oParam1,oParam);
        var option = {
            type:"POST",
            url:"/v3/smartcampuswrite",
            contentType:"application/json",
            data:JSON.stringify({
                devSn:FrameInfo.ACSN,
                Method:"cancelNotifyScannerId",
                Param:oParam1
            }),
            onSuccess:function(data){
                //console.log(data)
            },
            onFailed: function(jqXHR,textstatus,error){
                Frame.Msg.info("数据更新异常", "error");
            }
        };
        Utils.Request.sendRequest(option);
    }
    //获取ap消息
   /* function getApInfo(devSN, apSN, getApInfoSuc) {
        var getApInfoOpt = {
            type: "GET",
            url: MyConfig.path + "/apmonitor/app/apinfo?devSN="+devSN+"&apSN="+apSN,
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                devSN:devSN,
                apSN:apSN
            }),
            onSuccess: getApInfoSuc,
            onFailed: function(jqXHR,textstatus,error) {
                Frame.Msg.info("获取ap信息异常", "error");
            }
        };

        Utils.Request.sendRequest(getApInfoOpt);
    }*/
    var pageNums = 0;
    function initData(pageNum,pageSize,oFilter)
    {
        var pageNum = pageNum || 1;
        var startNum = 3 * (pageNum - 1);

            function getWeChatSuc(data, textStatus, jqXHR) {

                var aApList = [];
                var oTemp = [];
                var m = 0, k = 0;
                for (var i = 0; i < data.apList.length * 3; i++) {
                    k++;
                    if (k == 4) {
                        k = 1;
                        m++;
                    }

                    oTemp = {
                        Id: k,
                        apName: data.apList[m].apName,
                        apSN: data.apList[m].apSN,
                        ModuleSerialId: "--"
                    };

                    aApList.push(oTemp);
                }
                //$("#ApInforList").SList("refresh", aApList);
                $("#ApInforList").SList("refresh", {data: aApList, total: data.count_total*3});
            }
            getApList(devSN, startNum,oFilter, getWeChatSuc);

    }

    function cancelNotify(param){
        var arrScanner=[];
        for(var i=0;i<param.length;i++){
            var opt=param[i].apSN+"-"+param[i].Id;
            arrScanner.push(opt);
        }
        function  cancelApplyFun() {
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#cancel_form")));
            var userInfo = {
                userName:$("#cancel_username").val(),
                password:$("#cancel_password").val(),
                url:$("#cancel_url").val(),
                scannerId:arrScanner
            };
            cancelNotifyScannerId(userInfo);
        }
        $("#cancel_form").form("init", "edit", {
            "title": getRcText("EDIT_TITLE").split(",")[3],
            "btn_apply": function(){
                cancelApplyFun();
            },
            "btn_cancel": function(){
                Utils.Pages.closeWindow(Utils.Pages.getWindow($("#cancel_form")));
            }
        });
        Utils.Base.openDlg(null, {}, {scope: $("#cancel"), className: "modal-large"});
        $("label.error").attr("style","display:none");
        $("input.required.text-error").removeClass("text-error");

        $("#cancel_url").val("");
        $("#cancel_username").val("");
        $("#cancel_password").val("");
    }
    function initGrid()
    {
        function exportNow(param){
            var arrScanner=[];
            for(var i=0;i<param.length;i++){
                var opt=param[i].apSN+"-"+param[i].Id;
                arrScanner.push(opt);
            }
            //console.log(arrScanner);
            function applyFun() {
                Utils.Pages.closeWindow(Utils.Pages.getWindow($("#URL_form")));
               // $("#password").val();$("#user_name").val();$("#url").val();
                var userInfo = {
                    userName:$("#user_name").val(),
                    password:$("#password").val(),
                    url:$("#url").val(),
                    scannerId:arrScanner
                };
                notifyScannerId(userInfo);
                //Frame.Msg.info("地址："+$("#url").val()+"用户名："+$("#user_name").val()+"密码："+$("#password").val());
            }
            $("#URL_form").form("init", "edit", {
                "title": getRcText("EDIT_TITLE").split(",")[2],
                "btn_apply": function(){
                    applyFun();
                },
                "btn_cancel": function(){
                    Utils.Pages.closeWindow(Utils.Pages.getWindow($("#URL_form")));
                }/*CancelShop*/
            });
            Utils.Base.openDlg(null, {}, {scope: $("#Upload"), className: "modal-large"});
            $("label.error").attr("style","display:none");
            $("input.required.text-error").removeClass("text-error");
	    
            $("#url").val("");
            $("#user_name").val("");
            $("#password").val("");
        }
        var optInfor = {
            colNames: getRcText("INFOR_HEAD"),
            showHeader: true,
            multiSelect: true, // showOperation: true,
            pageSize: 9,
            asyncPaging:true,
            onPageChange:function(pageNum,pageSize,oFilter){
                pageNums=pageNum;
                initData(pageNum, 10, oFilter);
            },
            onSearch:function(oFilter,oSorter){
                initData(0,10,oFilter);
            },
           /* onToggle : {
                action : showHide,
                jScope : $("#toggle_wireless")
            },*/
            colModel: [
                {name:'apName', datatype:"String"},
                {name:'apSN', datatype:"String"},
                {name:'Id', datatype:"String"},
                {name:'ModuleSerialId', datatype:"String"}
            ],
            buttons: [
                {
                     name: "扫描器发布",
                     enable: ">0",
                     value: g_RowType[2],
                     mode: Frame.Button.Mode.DOWNLOAD,
                     action: exportNow
                },
                {
                    name: "取消发布",
                    enable: ">0",
                    value: g_RowType[3],
                    mode: Frame.Button.Mode.DOWNLOAD,
                    action: cancelNotify
                }
            ]
        };
        $("#ApInforList").SList ("head", optInfor);
    }
    function refreshpage(){
      //  Utils.Base.refreshCurPage();

        initData(pageNums);
    }
    function _init ()
    {
        initGrid();
       /* initData();*/
        refreshpage();
        if(Timer_Interval)
        {
            clearInterval(Timer_Interval);
        }
        Timer_Interval=setInterval(refreshpage,10*60*1000);
    }

    function _destroy ()
    {

    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList","Form","SingleSelect","Typehead"],
        "utils":["Request","Base"]
    });
})( jQuery );