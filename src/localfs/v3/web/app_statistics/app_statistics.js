;(function ($) {
    const MODULE_NAME = "app_statistics.app_statistics";
    const con_sn = FrameInfo.ACSN;
    const con_serviceNum = 1;
    const con_appinfo = {
        "appUrlList" : {
            "dpi" : [
                "/ant/read_dpi_app"]
            //],
            //    "wips" : [
            //    "/ant/wips_ap",
            //    "/ant/wips_client",
            //    "/ant/wips_statistics"
            //],
            //    "probe" : [
            //    "/ant/probeclient"
            //]
        }
    };
    const con_timeRangeDay   = 0;
    const con_timeRangeWeek  = 1;
    const con_timeRangeMonth = 2;
    const con_timeRangeYear  = 3;
    const con_timeRangeOther = 4;
    const con_timeTypeStart  = 0;
    const con_timeTypeEnd    = 1;
    const con_oneHour = 3600;
    const con_oneDay  = 24 * con_oneHour;
    const con_oneWeek = 7 * con_oneDay;
    const con_oneMonth = 30 * con_oneDay;
    const con_oneYear = 365 * con_oneDay;
    const con_appTypeAll   = "all";

    const nameMap = {
        'dpi' : "应用分析",
        'probe' : "探针",
        'wips' : "无线入侵防御",
        'logmgr' : "日志管理",
        'nat_detect' : "私接代理"
    };

    var g_timeRangeType = con_timeRangeDay;
    var g_selectAppType = con_appTypeAll;
    var g_bEnableFlag   = true;
    var g_bDownLoadFlag = true;
    var g_command = {};

    function getRcText(sRcName) {
        return Utils.Base.getRcString("app_statistics_rc", sRcName);
    }

    /*排序函数*/
    function sortDataByValue(a, b) {
        return a["value"] - b["value"];
    }

    function sortDataByCount(a, b) {
        return a["RecordCount"] - b["RecordCount"];
    }

    function getRangeTime(timeRangeType, startOrEnd) {
        /* 获取当前日期 */
        var currentDate = new Date().toLocaleDateString();
        var todayZeroTime = new Date(currentDate).getTime() / 1000;
        var timeStart = 0;
        var timeEnd = todayZeroTime + con_oneDay;

        if (con_timeRangeDay === timeRangeType) {
            timeStart = todayZeroTime;
        }
        else if (con_timeRangeWeek === timeRangeType) {
           timeStart = todayZeroTime + con_oneDay - con_oneWeek;
        }
        else if (con_timeRangeMonth ===  timeRangeType) {
            timeStart = todayZeroTime + con_oneDay - con_oneMonth;
        }
        else if (con_timeRangeYear === timeRangeType) {
            timeStart = todayZeroTime + con_oneDay - con_oneYear;
        }
        /* 时间范围类型错误 */
        else {
            return -1;
        }

        if (con_timeTypeStart === startOrEnd) {
            return timeStart;
        }
        else {
            return timeEnd;
        }
    }

    /*中间点距离上边高度， 行高， 数量， 最小上边距*/
    function topChange(top, lineHeight, sum, mixTop) {
        if(mixTop != undefined)
        {
            if(top - sum * lineHeight / 2 < mixTop)
            {
                return mixTop;
            }
        }
        return parseInt(top - sum * lineHeight / 2);
    }

    function getRangeTimeArray (timeRange) {
        var startTime = 0, endTime = 0;
        var aRangeTime = [];

        if (timeRange < con_timeRangeOther) {
            startTime =  getRangeTime(timeRange, con_timeTypeStart);
            endTime   =  getRangeTime(timeRange, con_timeTypeEnd);
        }
        else {
            var strStartTime = $("input[name='daterangepicker_start']").val();
            var strEndTime = $("input[name='daterangepicker_end']").val();

            var startYear  = Number(strStartTime.slice(0, 4));
            var startMonth = Number(strStartTime.slice(5, 7)) - 1;
            var startDay   = Number(strStartTime.slice(8, 10));
            var endYear    = Number(strEndTime.slice(0, 4));
            var endMonth   = Number(strEndTime.slice(5, 7)) - 1;
            var endDay     = Number(strEndTime.slice(8, 10));

            startTime = (new Date(startYear, startMonth, startDay)).getTime() / 1000;
            endTime   = (new Date(endYear, endMonth, endDay)).getTime() / 1000 + con_oneDay;
        }

        aRangeTime.push(startTime, endTime);

        return aRangeTime;
    }

    /* 填充app饼图 */
    function fillAppPie (arrData, bValueZeroFlag) {
        if (0  == arrData.length || bValueZeroFlag) {
            var option = {
                calculable : false,
                height:300,
                tooltip : {
                    show:false
                },           
                series : [
                    {
                        type: 'pie',
                        radius: ['35%', '65%'],
                        center: ['20%', '45%'],
                        itemStyle: {
                            normal: {
                                labelLine:{
                                    show:false
                                },
                                label:
                                {
                                    show:false
                                }
                            }
                        },
                        data: [{name:"暂无数据", value:1}]
                    }
                ]
            };
            var oTheme = {color: ['#B7ADAD']};
        }
        else {
            var option = {
                height: 300,
                tooltip: {
                    trigger: 'item',
                    formatter: " {b}: {d}%"
                },
                myLegend: {
                    scope: "#app_message",
                    width: "30%",
                    height: 100,
                    right: "20%",
                    top: topChange(140, 31, arrData.length, 8)
                },
                calculable: false,
                series: [
                    {
                        type: 'pie',
                        radius: ['35%', '65%'],
                        center: ['20%', '45%'],
                        itemStyle: {
                            normal: {
                                labelLine: {
                                    show: false
                                },
                                label: {
                                    position:"inner",
                                    formatter: function(a){
                                        return"";
                                    }
                                }
                            }
                        },
                    //    data: arrData.sort(sortDataByValue),
                        data: arrData,
                    }
                ]
            };
            var oTheme = {
                color: ['#53B9E7','#31ADB4','#69C4C5','#FFBB33','#FF8800','#CC324B','#E64C65',
                '#D7DDE4', '#50E014', '#FFFF00', '#8A2BE2', '#33FF00', '#483D8B','#BB860B',
                '#006400', '#91B2D2']
            };
        }
        $("#app_pie").echart("init", option, oTheme);
    }

    function drawAppPie(timeRangeType, appType) {
        var aRangeTime = getRangeTimeArray(timeRangeType);
        var method = ""; 

        if (con_appTypeAll == appType) {
            method = "GetAllAppDataNum";
        }
        else {
            method = "GetAppTableDataNum";
        }

        var SendMsg = {
            url: MyConfig.path + "/ant/appstatistics",
            dataType: "json",
            type: "post",
            data: {
                Method : method,
                Param  : {
                    ACSN      : con_sn,
                    StartTime : aRangeTime[0],
                    EndTime   : aRangeTime[1],
                    AppName   : appType
                }
            },
            onSuccess:getMsgSuccess,
            onFailed:getMsgFail
        }
        Utils.Request.sendRequest(SendMsg);
        function getMsgSuccess(data){
            var bValueZeroFlag = true;
            var arrData = [];

            bValueZeroFlag = dealDataPie(data.message, method, arrData);

            fillAppPie(arrData, bValueZeroFlag);
        }
        function getMsgFail()
        {
            console.log("fail terminal fail!");
        }
    }

    function dealDataPie(arrRecv, method, arrData){
        var bValueZeroFlag = true;
        var nLength = arrRecv.length;

        if("GetAllAppDataNum" == method) {
            for (var i = 0; i < nLength; i ++) {
                for (var key in arrRecv[i]) {
                    var jsonPie = {'name' : '', 'value' : 0};

                    jsonPie['name'] = nameMap[key];
                    jsonPie['value'] = arrRecv[i][key];
                    arrData.push(jsonPie);

                    if (jsonPie.value > 0) {
                        bValueZeroFlag = false;
                    }
                }
            }
        }
        else if("GetAppTableDataNum" == method) {
            for (var i = 0; i < nLength; i ++) {
                for (var key in arrRecv[i]) {
                    var jsonPie = {'name' : '', 'value' : 0};

                    jsonPie['name'] = key;
                    jsonPie['value'] = arrRecv[i][key];
                    arrData.push(jsonPie);

                    if (jsonPie.value > 0) {
                        bValueZeroFlag = false;
                    }
                }
            }
        }

        return bValueZeroFlag;
    }
   
    function initPie() {
        drawAppPie(g_timeRangeType, con_appTypeAll);
    }

    function drawAppList(timeRangeType, appType) {
        var aRangeTime = getRangeTimeArray(timeRangeType);
        var method = "";

        if (con_appTypeAll === appType) {
            
            method = "GetAllAppDataStatistics";
        }
        else {
            method = "GetAppTableDataNum";
        }

        var SendMsg = {
            url: MyConfig.path + "/ant/appstatistics",
            dataType: "json",
            type: "post",
            data: {
                Method : method,
                Param  : {
                    ACSN      : con_sn,
                    StartTime : aRangeTime[0],
                    EndTime   : aRangeTime[1],
                    AppName   : appType
                }
            },
            onSuccess:getMsgSuccess,
            onFailed:getMsgFail
        };
        Utils.Request.sendRequest(SendMsg);
        function getMsgSuccess(data){
            var arrRecv = data.message;

            if (con_appTypeAll === appType) {
                var length = arrRecv.length;

                for(var i = 0; i < length; i++)
                {
                    var tmpName = arrRecv[i].AppName;
                    arrRecv[i].AppName = nameMap[tmpName];
                }
                // arrRecv.sort(sortDataByCount);
                $("#app_table").SList("refresh", arrRecv);
            }
            else {
                var arrData = [];
                for (var i = 0; i < arrRecv.length; i ++) {
                    for (var key in arrRecv[i]) {
                        var jsonTable = {'TableName' : '', 'RecordCount' : 0};
                        jsonTable['TableName'] = key;
                        jsonTable['RecordCount'] = arrRecv[i][key];
                        arrData.push(jsonTable);
                    }
                }
                // arrData.sort(sortDataByCount);
                $("#app_detail_table").SList("refresh", arrData);
            }
        }
        function getMsgFail()
        {
            console.log("fail terminal fail!");
        }
    }

    function initList() {
        drawAppList(g_timeRangeType, con_appTypeAll);
    }

    function showFile(odata) {
        if(false == g_bEnableFlag){
            return ;
        }

        if(0 == odata[0].RecordCount)
        {
            Frame.Msg.info("暂无数据！");
            return;
        }

        var aRangeTime = getRangeTimeArray(g_timeRangeType);
        var SendMsg = {
            url: MyConfig.path + "/ant/appstatistics",
            dataType: "json",
            type: "post",
            data: {
                Method : 'GetAppointTableData',
                Param  : {
                    ACSN      : con_sn,
                    StartTime : aRangeTime[0],
                    EndTime   : aRangeTime[1],
                    TbName    : odata[0].TableName,
                    Limit     : 100
                }
            },
            onSuccess:getMsgSuccess,
            onFailed:getMsgFail
        };
        g_bEnableFlag = false;    
        Utils.Request.sendRequest(SendMsg);

        function getMsgSuccess(data){
            var aTmpMsg  = data.message;
            var nLength  = aTmpMsg.length;
            var aMessage = "";

            g_bEnableFlag = true;
            for(var i = 0; i < nLength; i++)
            {
                for(var key in aTmpMsg[i]){
                    if("object" == typeof(aTmpMsg[i][key]) && aTmpMsg[i][key]){
                        aMessage = aMessage + "&nbsp;&nbsp;" +  key + ": " + JSON.stringify(aTmpMsg[i][key]) + ";&nbsp;";
                    }
                    else{
                        aMessage = aMessage + "&nbsp;&nbsp;" +  key + ": " + aTmpMsg[i][key] + ";&nbsp;";
                    }
                }
                aMessage = aMessage + "</br>";
            }

            Utils.Base.openDlg(null, {}, {scope:$("#filecontent"),className:"modal-super dashboard"});
            $("#filecontent_info").html(aMessage);
        }
        function getMsgFail()
        {
            g_bEnableFlag = true;
            console.log("fail terminal fail!");
        }
    }

    function onRemoveList(odata){
        if(false == g_bEnableFlag){
            return ;
        }

        var aRangeTime = getRangeTimeArray(g_timeRangeType);
        var SendMsg = {
            url: MyConfig.path + "/ant/appstatistics",
            dataType: "json",
            type: "post",
            data: {
                Method : 'DeleteAppointTableData',
                Param  : {
                    ACSN      : con_sn,
                    StartTime : aRangeTime[0],
                    EndTime   : aRangeTime[1],
                    TbName   : odata[0].TableName
                }
            },
            onSuccess:getMsgSuccess,
            onFailed:getMsgFail
        }

        g_bEnableFlag = false;
        Utils.Request.sendRequest(SendMsg);

        function getMsgSuccess(data){
            g_bEnableFlag = true;
            if(0 == data.retCode)
            {
                Frame.Msg.info("删除成功！");
                drawAppPie(g_timeRangeType, g_selectAppType);
                drawAppList(g_timeRangeType, g_selectAppType);
            }
            else{
                Frame.Msg.info("删除失败！");
            }
        }
        function getMsgFail()
        {
            g_bEnableFlag = true;
            console.log("fail terminal fail!");
        }
    }

    function onRemove(oData) {
        if(0 == oData[0].RecordCount){
            Frame.Msg.info("暂无数据！");
            return ;
        }

        var addForm = $("#remove_form");
        var jDlg = $("#on_remove");

        addForm.form("init", "edit", {"title":getRcText("REMOVE_TITLE"),
            "btn_apply":function(){onRemoveList(oData);Utils.Pages.closeWindow(Utils.Pages.getWindow(addForm));},
            "btn_cancel":onCancel});
        Utils.Base.openDlg(null, {}, {scope:$("#on_remove"),className:"modal-super dashboard"});
        $(".btn-apply").removeClass("disabled");
        
        function onCancel()
        {
            Utils.Pages.closeWindow(Utils.Pages.getWindow(addForm));
            addForm.form("updateForm",{
                cfgrestorereason: ""
            })
        }
    }

    /*有输入框的下拉框的事件处理*/
    var dealEvent = {
        nowState  : {},
        scope     : "",
        currentid : "",
        init : function(){
            var jscope = $(".probe-choice");
            for(var i = 0; i < jscope.length; i++)
            {
                dealEvent.nowState[jscope[i].getAttribute("id")] = 1;
            }
        },
        liOnClick: function(e){
            var scope = $(this);
            if(scope.val() == dealEvent.nowState[dealEvent.currentid])
            {
                $(".choice-show", dealEvent.scope).removeClass("height-change");
                return false;
            }
            else
            {
                dealEvent.nowState[dealEvent.currentid] = scope.val();
                $(".current-state", dealEvent.scope).text(scope.text());
                $(".choice-show", dealEvent.scope).removeClass("height-change");
            }
            $("#body_over").addClass("hide");

            $(dealEvent.scope).trigger({type:"probechange.probe"}, {value:dealEvent.nowState[dealEvent.currentid]});
        },
        inputClick:function(e){
            dealEvent.currentid = $(this).closest(".probe-choice").attr("id");
            dealEvent.scope = "#" + dealEvent.currentid;
            $("#body_over").removeClass("hide");
            $(".choice-show", dealEvent.scope).addClass("height-change");

            return false;
        },
        blackClick:function(e){
            $("#body_over").addClass("hide");
            $(".choice-show", dealEvent.scope).hasClass("height-change") && $(".choice-show", dealEvent.scope).removeClass("height-change");
        },

        dateChange: function (e) {
            dealEvent.nowState[dealEvent.currentid] = 4;

            var orange = $(this,dealEvent.scope).daterange("getRangeData");
            $(".current-state", dealEvent.scope).text(orange.startData + '-' +orange.endData);
            var sinputTime = orange.startData + '-' +orange.endData
            document.getElementById("daterange").value=sinputTime;
            $(".choice-show", dealEvent.scope).removeClass("height-change");

            StartTime = new Date(orange.startData)-0;
            EndTime = new Date(orange.endData)-0;
            $(dealEvent.scope).trigger({type:"probechange.probe"}, {value:dealEvent.nowState[dealEvent.currentid],startTime:StartTime,endTime:EndTime});
        }
    };

    function selectTimeAction (e, param) {
        g_bEnableFlag = true;
        g_bDownLoadFlag = true;
        g_timeRangeType = param.value;

        drawAppPie(g_timeRangeType, g_selectAppType);
        drawAppList(g_timeRangeType, g_selectAppType);
    }

    function drawAppAllGrid () {
        var opt = {
            colNames: getRcText("APP_ALL_HEADER"),
            showHeader: true,
            search:true,
            pageSize:5,
            colModel: [
                {name: "AppName", datatype: "String"},
                {name: "ListCount",datatype: "Integer"},
                {name: "RecordCount", datatype: "Integer"}
            ]
        };
        $("#app_table").SList("head", opt);
    }

    function drawAppOneGrid () {
        var optionForEvents = {
            colNames: getRcText ("APP_ONE_HEADER"),
            showOperation: true,
            showHeader: true,
            multiSelect : true ,
            pageSize:5,
            colModel: [
                {name:'TableName', datatype:"String"},
                {name:'RecordCount', datatype:"String"}

            ],
            buttons: [
                {name:"detail", value:getRcText("LIMIT_DETAIL_COUNT"), action:showFile},
            ]
        };

        var aPermission = Frame.Permission.getCurPermission() || [];
        if (-1 != aPermission.indexOf("MAINTENANCE_WRITE")) {
            var oRemove = {name:"delete",action:onRemove};

            optionForEvents.buttons.push(oRemove);
        }
        
        if (-1 != aPermission.indexOf("MAINTENANCE_EXEC")) {
            var oDownLoad = {name:"download",action:downLoadList};

            optionForEvents.buttons.push(oDownLoad);
        }

        $("#app_detail_table").SList ("head", optionForEvents);
    }

    function downLoadList(odata){
        if(false == g_bDownLoadFlag){
            return ;
        }

        if(0 == odata[0].RecordCount){
            Frame.Msg.info("暂无数据！");
            return ;
        }
    
        var aRangeTime = getRangeTimeArray(g_timeRangeType);
        var SendMsg = {
            url: MyConfig.path + "/ant/appstatistics/downloadFile",
            dataType: "json",
            type: "post",
            data: {
                Method : 'GetAppointTableData',
                Param  : {
                    ACSN      : con_sn,
                    StartTime : aRangeTime[0],
                    EndTime   : aRangeTime[1],
                    TbName    : odata[0].TableName
                }
            },
            onSuccess:getMsgSuccess,
            onFailed:getMsgFail
        }

        g_bDownLoadFlag = false;
        Utils.Request.sendRequest(SendMsg);

        function getMsgSuccess(data){
            g_bDownLoadFlag = true;
            var message = data.message;
            $("#exportFile").get(0).src = message.filePath;
        }
        function getMsgFail()
        {
            g_bDownLoadFlag = true;     
            console.log("fail terminal fail!");
        }
    }

    function initGrid() {
        drawAppOneGrid();
        drawAppAllGrid();
    }

    function initForm() {
        /*有输入框的下拉框事件*/
        $(".choice-head").click(dealEvent.inputClick);
        $(".choice-show li").click(dealEvent.liOnClick);
        $("#body_over").click(dealEvent.blackClick);

        /* 选择显示的周期 */
        $("#select_time").on("probechange.probe", selectTimeAction);
        $("#daterange").on("inputchange", dealEvent.dateChange);
    }

    function initListMenu() {
        var clickListMenu = function(oparam){
            g_bEnableFlag = true;
            g_bDownLoadFlag = true;
            /* 表格显示选择 */
            g_selectAppType = $(oparam).attr("param");
            /* 选择应用类型 */
            if(con_appTypeAll == g_selectAppType) {
                $("#detail_list").addClass("hide");
                $("#all_list").removeClass("hide");
            }
            else{
                $("#detail_list").removeClass("hide");
                $("#all_list").addClass("hide");
            }

            drawAppList(g_timeRangeType, g_selectAppType);
            drawAppPie(g_timeRangeType, g_selectAppType);
        };

        g_command = {
            data:[{name: "全部", value: 1, param: "all", func: clickListMenu,},
            {name: "应用管理", value: 2, param: "dpi", func: clickListMenu,},
            {name: "探针", value: 3, param: "probe", func: clickListMenu,},
            {name: "私接代理", value: 4, param: "nat_detect", func: clickListMenu,},
            {name: "日志管理", value: 5, param: "logmgr", func: clickListMenu,},
            {name: "无线入侵防御", value: 6, param: "wips", func: clickListMenu,},
            ],
        };
        $(".antmenu").antmenu("init",g_command);
    }

    function initData() {
        initPie();
        initList();
    }
    
    function _init() {
        initListMenu();
        initForm();
        initGrid();
        initData();
    }

    function _destroy() {
        g_timeRangeType = con_timeRangeDay;
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList","Echart","DateRange","SingleSelect","Form","DateTime","Antmenu"],
        "utils":["Base","Request"]
    });
})(jQuery);