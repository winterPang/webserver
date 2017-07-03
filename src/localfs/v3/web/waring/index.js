(function ($) {
    var MODULE_NAME = "waring.index";
    var logFilepath;
    var devType = FrameInfo.ACSN;
    var bIsSyncing = false;
    var PAGE_SIZE = 10;
    var NEEDGETPAGENUM = true;
    var g_CurPageData = [];
    var g_Count = '-';
    var g_IsNeedExport = false;
    var g_IsExporting = false;
    var levelStr = getRcText("LOGLEVEL").split(',');
    var checkId = ['jinji', 'yanzhong', 'jinggao', 'tishi'];
    var matchFliter = [true, true, true, true, true, true, true, true];
    var selectDate;

    function requestFailed(){
        bIsSyncing = false;
        $("#syncing").text(getRcText("TRYAGAIN"));
    }

    function getRcText(sRcName) {
        return Utils.Base.getRcString("waring_rc", sRcName);
    }

    function checkFilterSelect() {
        var selectNum = 0;
        var matchLevel = [];

        matchFliter.forEach(function (item, index) {
            if(item) {
                matchLevel.push(index);
                selectNum++;
            }
        });

        if(8 == selectNum) {
            matchLevel = [];    //ajax携带空数组有问题(丢掉)
        }else if(0 == selectNum) {
            matchLevel = [999];
        }

        return matchLevel;
    }

    function triggerRefresh() {
        $("input[sid='logStr']").trigger("keyup");
    }

    function slistRefreshData() {
        $("#waring_list").SList("refresh", {data: g_CurPageData, total: g_Count});
        if(!g_CurPageData.length){
            $("div.slist-center.scroll-able").html(
                "<div class='slist-row textAlign'>" +
                        getRcText("NOWARNING") +
                "</div>");
        }
    }

    function getPageNum(transData) {
        var getLogOpt = {
            url: "/v3/devlogserver/getpagenum",
            type: "POST",
            timeout : 500000,
            dataType: "json",
            data: transData,
            onSuccess: function (data) {
                if(data && (undefined != data.count)) {
                    g_Count = data.count;
                    slistRefreshData();
                }
            },
            onFailed: function (err) {
                console.error('Get page num failed, err: ' + JSON.stringify(err));
            }
        };

        Utils.Request.sendRequest(getLogOpt);
    }

    function refreshPage(skip, limit, oFilter, oSorter, bIsGetPage) {
        var filter = {};

        $.extend(filter, selectDate);
        $.extend(filter, oFilter);
        filter.logLevel = checkFilterSelect();

        //checkbox全未选
        if(999 == filter.logLevel[0]) {
            g_CurPageData = [];
            g_Count = 0;
            slistRefreshData();
            return;
        }

        if(oSorter) {
            if(true == oSorter.isDesc) {
                oSorter.isDesc = -1;
            }else {
                oSorter.isDesc = 1;
            }
        }

        var transData = {
            devSN: FrameInfo.ACSN,
            oFilter: filter,
            oSorter: oSorter,
            skip: skip,
            limit: limit,
            search: $("#input_search").val()
        };

        var getLogOpt = {
            url: "/v3/devlogserver/getdevlog_async",
            type: "POST",
            timeout : 500000,
            dataType: "json",
            data: transData,
            onSuccess: function (data) {
                if (!data.errcode && data.devLog) {
                    setParamBeforeShow(data.devLog);
                    bIsSyncing = false;
                    if (data.syncTime) {
                        $("#syncing").text(getRcText("LASTSYNC") +
                            (new Date(data.syncTime + 28800000)).toISOString().replace('T', ' ').substr(0, 19));
                    } else {
                        $("#syncing").text(getRcText("UNSYNC"));
                    }
                    bIsGetPage && getPageNum(transData);
                } else {
                    bIsSyncing = false;
                    $("#syncing").text(getRcText("TRYAGAIN"));
                }
            },
            onFailed: function (err) {
                console.error('Get devlog failed, err: ' + JSON.stringify(err));
                requestFailed();
            }
        };

        Utils.Request.sendRequest(getLogOpt);
    }

    function setParamBeforeShow(rcvData) {
        var data = [];
        rcvData.forEach(function (item, index) {
            item.devSN = devType;
            item.logLevel = levelStr[item.logLevel];
            item.logTime = (new Date(item.logTime + 28800000)).toISOString().replace('T', ' ').substr(0, 23);
            data.push(item);
        });

        g_CurPageData = data;
        slistRefreshData();
        if('-' == g_Count) {
            $('.page-total').text(' -');
        }
    }

    /* 从数组中找出logfile的路径 */
    function getLogfilepath(dataArry){
        for(i = 0; i < dataArry.length; i++) {
            logFile = dataArry[i].fileName.match(/logfile[0-9]*.log$/);
            if (logFile) {
                logFilepath = dataArry[i].filePath + "/" + dataArry[i].fileName;
                break;
            }
        }
    }

    /* 获取设备的文件信息 */
    function getLogfile(callback) {
        var getFileinfoOpt = {
            url: "/v3/fs/",
            type: "POST",
            dataType: "json",
            data:{Method: "getDevFileStatus" ,
                devSN: FrameInfo.ACSN,
                pathName:""
            },
            onSuccess: function (data) {
                if(data.retCode === 0) {
                    var dataArray = data.message;
                    getLogfilepath(dataArray);
                    if (logFilepath){
                        callback && callback();
                    }
                    else{
                        Frame.Msg.error(getRcText("NOLOGFILE"));
                    }
                }
                else if(data.retCode === 2){
                    Frame.Msg.error(getRcText("NOAUTHORITY"));
                }
                else{
                    Frame.Msg.error(getRcText("CONNFAILED")+FrameInfo.ACSN+"!");
                }
            },
            onFailed: function (err) {
                requestFailed();
            }
        };

        Utils.Request.sendRequest(getFileinfoOpt);
    }

    function syncNow(){
        if(false == bIsSyncing) {
            getLogfile(function () {
                bIsSyncing = true;
                $("#syncing").text(getRcText("PLEASEWAIT"));
                var syncOpt = {
                    url: "/v3/fs/syncLogfile",
                    type: "POST",
                    dataType: "json",
                    data: {
                        Method: "downloadFile",
                        devSN: FrameInfo.ACSN,
                        fileName: logFilepath
                    },
                    onSuccess: function (data) {
                        if(data.retCode){
                            bIsSyncing = false;
                            $("#syncing").text(getRcText("DEVBUSY"));
                        }else{
                            bIsSyncing = false;
                            Utils.Base.refreshCurPage();
                        }
                    },
                    onFailed: function (err) {
                        bIsSyncing = false;
                        requestFailed();
                    }
                };

                Utils.Request.sendRequest(syncOpt);
            });
        }
    }

    function getDevType(acsn, callback) {
        var getTypeOpt = {
            type: "GET",
            timeout : 10000,
            url: "/v3/devmonitor/web/system?devSN=" + acsn,
            dataType: "json",
            onSuccess: function(data){
                if(data && !data.errcode && data.devMode) {
                    devType = data.devMode;
                }else {
                    devType = FrameInfo.ACSN;
                }
                callback();
            },
            onFailed: function (err) {
                callback();
            }
        };

        Utils.Request.sendRequest(getTypeOpt);
    }

    function exportNow(oFilter, oSorter){
        if(0 == $("input.page-num").val()) {
            Frame.Msg.error(getRcText("NOLOGEXPORT"));
            return;
        }
        g_IsExporting = true;

        var filter = {};

        $.extend(filter, selectDate);
        $.extend(filter, oFilter);
        filter.logLevel = checkFilterSelect();

        if(oSorter) {
            if(true == oSorter.isDesc) {
                oSorter.isDesc = -1;
            }else {
                oSorter.isDesc = 1;
            }
        }

        var exportOpt = {
            url: "/v3/fs/exportLogfile",
            type: "POST",
            dataType: "json",
            data: {
                devSN: FrameInfo.ACSN,
                oFilter: filter,
                oSorter: oSorter
            },
            onSuccess: function (data) {
                $("#exportFile").get(0).src = data.fileName;
                g_IsExporting = false;
            },
            onFailed: function (err) {
                console.error('Export log file failed: ' + err);
                g_IsExporting = false;
            }
        };

        Utils.Request.sendRequest(exportOpt);
    }

    function initData(){
        //开始获取数据
        bIsSyncing = true;
        $("#syncing").text(getRcText("GETTINGDATA"));

        //获取设备序列号对应的设备名
        getDevType(FrameInfo.ACSN, function() {
            triggerRefresh();
        });
    }

    function check_all(){
        var bAllChecked = true;
        checkId.forEach(function (id) {
           if(false == document.getElementById(id).checked){
               bAllChecked = false;
           }
        });
        if(bAllChecked){
            document.getElementById('all').checked = true;
            $("#all").next().addClass('checked');
        }else{
            document.getElementById('all').checked = false;
            $("#all").next().removeClass('checked');
        }
    }

    function initFilter(){
        var allId = ['all', 'jinji', 'yanzhong', 'jinggao', 'tishi'];
        allId.forEach(function (id) {
            document.getElementById(id).checked = true;
                $('#' + id).next().addClass('checked');
        });

        for(var x in matchFliter){
            matchFliter[x] = true;
        }
    }

    function initDateRangePicker() {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var today = year + '/' + (month < 10 ? '0' + month : month) + '/' + (day < 10 ? '0' + day : day);

        $(".daterange").daterange();
        $(".daterange").daterange('setRangeData', today + ' - ' + today);
        $(".daterange").daterange();
        selectDate = $(".daterange").daterange("getRangeData");
}

    function initForm(){
        //SList 初始化
        var opt = {
            height:"80",
            showHeader: true,
            multiSelect: false,
            pageSize: PAGE_SIZE,
            asyncPaging: true,
            colNames: getRcText ("WARING_ITEM"),
            onPageChange:function(pageNum,pageSize,oFilter,oSorter){
                refreshPage((pageNum - 1) * PAGE_SIZE, PAGE_SIZE, oFilter, oSorter);
            },
            onSearch:function(oFilter,oSorter){
                if(!g_IsNeedExport) {
                    g_Count = '-';
                    refreshPage(0, PAGE_SIZE, oFilter, oSorter, NEEDGETPAGENUM);
                }else {
                    g_IsNeedExport = false;

                    if(!g_IsExporting) {
                        exportNow(oFilter, oSorter);
                    }
                }
            },
            onSort:function(sName,isDesc){
                refreshPage(0, PAGE_SIZE, undefined, {sName: sName, isDesc: isDesc});
            },
            colModel: [
                {name: "devSN",     datatype: "String", width:60},
                {name: "logModule", datatype: "String", width:70},
                {name: "logLevel",  datatype: "String", width:40},
                {name: "logStr",    datatype: "String", width:270},
                {name: "logTime",   datatype: "String", width:80}
            ],
            buttons:[
                {value:getRcText ("SYNC_NOW"), action: syncNow},
                {value:getRcText ("EXPORT_LOG"), action: exportNow}
            ]
        };
        $("#waring_list").SList ("head", opt);

        //删掉查询选项
        $(".slist-head .search-column").remove();
		
		//分级分权隐藏
		var cap = Frame.Permission.getCurPermission();
		if(-1 == cap.indexOf("MAINTENANCE_EXEC")){
			$(".slist-toolbar-top .slist-button")[1].style = "display: none";
		}

        //click 事件
        $("#all").on("click", function () {
            var all_check = this.checked;
            checkId.forEach(function (id) {
                document.getElementById(id).checked = all_check;
                if(all_check){
                    $('#' + id).next().addClass('checked');
                }else{
                    $('#' + id).next().removeClass('checked');
                }

            });
            for(var x in matchFliter){
                matchFliter[x] = all_check;
            }
            triggerRefresh();
        });
        $("#jinji").on("click", function () {
            matchFliter[0] = this.checked;
            matchFliter[1] = this.checked;
            check_all();
            triggerRefresh();
        });
        $("#yanzhong").on("click", function () {
            matchFliter[2] = this.checked;
            matchFliter[3] = this.checked;
            check_all();
            triggerRefresh();
        });
        $("#jinggao").on("click", function () {
            matchFliter[4] = this.checked;
            matchFliter[5] = this.checked;
            check_all();
            triggerRefresh();
        });
        $("#tishi").on("click", function () {
            matchFliter[6] = this.checked;
            matchFliter[7] = this.checked;
            check_all();
            triggerRefresh();
        });

        //刷新按钮
        $("#refresh_log").on('click', function () {
            triggerRefresh();
        });

        //初始化checkbox
        initFilter();

        //添加状态显示
        $(".slist-toolbar-top").append("<span id='syncing' style='line-height: 32px'></span>");

        //时间筛选应用
        initDateRangePicker();
        $("button.applyBtn").on('click', function () {
            selectDate = $(".daterange").daterange("getRangeData");
            triggerRefresh();
        });

        //拦截点击事件
        $(".dropdown-menu").on("click",function(e){
            e.stopPropagation();
        });

        //关键字筛选
        var oTimer = false;
        $("#input_search").on('keyup', function () {
            if(oTimer)
            {
                clearTimeout(oTimer);
            }
            oTimer = setTimeout(triggerRefresh(),500);
        });
    }

    function _init (){
        initForm();
        initData();
    }

    function _resize (jParent){
    }

    function _destroy(){
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }

    Utils.Pages.regModule (MODULE_NAME, {
        "init":     _init,
        "destroy":  _destroy,
        "resize":   _resize,
        "widgets":  ["SList", "DateRange", "Minput"],
        "utils":    ["Base", "Request"]
    });

}) (jQuery);
