;(function ($) {
    var MODULE_NAME = "h_stamgrclients.j_history";
    var g_sTartTime,
        g_sEndTime,
        g_nPageSize = 10;

    function getRcText (attr){
        return Utils.Base.getRcString("history_rc", attr);
    }

    function getTimeInterval (time) {
        var nMs, now = new Date();
        if (time == "oneDay") {
            nMs = 60 * 60 * 24 * 1000;
        }
        if (time == "oneWeek") {
            nMs = 60 * 60 * 24 * 7 * 1000;
        }
        if (time == "oneMonth") {
            nMs = 60 * 60 * 24 * 30 * 1000;
        }
        g_sTartTime = new Date(now.getTime() - nMs).toISOString();
        g_sEndTime = new Date().toISOString();
        return {startTime: g_sTartTime, endTime: g_sEndTime};
    }

    function createList (flag) {

        var $list = $("#historyList");

        function refreshFun () {
            var sFlag = $("#radioGrp").find("span[class*=checked]").prev("input").attr("id");
            createList(sFlag);
            sendReq(sFlag);
        }

        function exportFun () {
            // TODO: params
            /*function getSucc(data) {
                //$("#exportFile").attr("src", data.fileName);
            }

            function getFail() {
                console.log("export fail");
            }

            var oOpts = {
                type: "POST",
                url: MyConfig.path + "/fs/exportClientsListbyCondition",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({
                    devSN: FrameInfo.ACSN,
                    startTime: g_sTartTime,
                    endTime: g_sEndTime

                }),
                onSuccess: getSucc,
                onFailed: getFail
            };

            Utils.Request.sendRequest(oOpts);*/
            console.log(g_sTartTime);
            console.log(g_sEndTime);

        }

        $list.empty();
        var oOpts = {
            colNames: getRcText("list_header"),
            pageNum: 1,
            pageSize: g_nPageSize,
            search: false,
            sortable: false,
            asyncPaging: true,
            onPageChange: function (pageNum, pageSize, oFilter, oSorter) {
                var oParams = {
                    page: pageNum,
                    count: pageSize
                };
                if (oFilter) {
                    oParams.checkField = $.extend({}, oFilter);
                }
                if (oSorter) {
                    oParams.sortField = {};
                    oParams.sortField[oSorter.name] = (oSorter.isDesc ? -1 : 1);
                }
                sendReq(flag, oParams);
            },
            onSearch: function (oFilter, oSorter) {
                var oParams = {
                    page: 1,
                    count: g_nPageSize
                };
                if (oFilter) {
                    oParams.checkField = $.extend({}, oFilter);
                }
                if (oSorter) {
                    oParams.sortField = {};
                    oParams.sortField[oSorter.name] = (oSorter.isDesc ? -1 : 1);
                }
                sendReq(flag, oParams);
            },
            onSort: function (sSortName, isDesc) {
                var oParams = {
                    page: 1,
                    count: g_nPageSize
                };
                oParams.sortField = {};
                oParams.sortField[sSortName] = (isDesc ? -1 : 1);
                sendReq(flag, oParams);
            },
            colModel: [
                {name: "UserName", datatype: "String"},
                {name: "UserIP", datatype: "String"},
                {name: "UserMac", datatype: "String"},
                {name: "AuthTypeStr", datatype: "String"},
                {name: "InBytes", datatype: "String"},
                {name: "OutBytes", datatype: "String"},
                {name: "onlineTimeStr", datatype: "String"},
                {name: "DurationTimeStr", datatype: "String"}
            ],
            buttons: [
                {name: "default", value: getRcText("refresh_btn"), action: refreshFun},
                {name: "default", value: getRcText("export_btn"), enable: false, action: exportFun}
            ]
        };
        $list.SList("head", oOpts);
    }

    function sendReq (flag, param) {

        function getSucc (data) {
            var oData = {
                data: data.historyList,
                total: data.totalcount
            };
            $("#historyList").SList("refresh", oData);
        }

        function getFail () {
            console.log("get fail");
        }

        var oTimeInterval = null;
        if (param) {
            oTimeInterval = {startTime: g_sTartTime, endTime: g_sEndTime};
        } else {
            oTimeInterval = getTimeInterval(flag);
        }
        param = param || {page: 1, count: g_nPageSize};

        var oBody = $.extend({}, param, {
            devSN: FrameInfo.ACSN,
            startTime: oTimeInterval.startTime,
            endTime: oTimeInterval.endTime
        });

        var oOpts = {
            type: "POST",
            url: MyConfig.path + "/portalmonitor/portalhistory/getportalhistorylistbydevsn",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(oBody),
            onSuccess: getSucc,
            onFailed: getFail
        };

        Utils.Request.sendRequest(oOpts);
    }

    function initData () {
        sendReq("oneDay");
    }

    function initGrid () {
        createList("oneDay");
    }

    function initForm () {
        $("#radioGrp").on("click", "input:radio", function (event) {
            var sFlag = event.target.id;
            createList(sFlag);
            sendReq(sFlag);
        });

        $("#returnBtn").on('click', function () {
            Utils.Base.redirect ({np:"h_stamgrclients.m_clients"});
            return false;
        });
    }

    function _init () {
        initData();
        initGrid();
        initForm();
    }

    function _destroy () {
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList", "Minput"],
        "utils": ["Base", "Request"]
    });
})(jQuery);
