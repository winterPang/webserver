;(function ($) {
    var MODULE_BASE = "log";
    var MODULE_NAME = MODULE_BASE + ".loginfo";
    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("log_monitor_rc", sRcName);
    }
    function initLogHead()
    {
        var optLog= {
            colNames: getRcText ("LOG_HEAD"),
            showHeader: true,
            search:true,
            pageSize:12,
            colModel: [
                {name: "user", datatype: "String"},
                {name: "ip", datatype: "Integer"},
                {name: "module", datatype: "String"},
                {name: "level", datatype: "String"},
                {name: "message", datatype: "String"}
            ]
        };
        $("#log_list").SList ("head", optLog);
    }
    function initLogList()
    {
        $.ajax({
            url:  MyConfig.path+"/ant/logmgr",
            dataType: "json",
            type:"post",
            data:{
               devSN:FrameInfo.ACSN,
                method:"getLog",
            },
            success: function (data)
            {

                var LogMsg = data.message;
                for(var i=0;i<LogMsg.length;i++)
                {
                    delete LogMsg[i].id;
                    delete LogMsg[i].stamp;
                }
                $("#log_list").SList("refresh",LogMsg);
            }

        });
    }
    function initData()
    {
        initLogList();
    }
    function initGrid()
    {
        initLogHead();
    }
    function _init()
    {
        initGrid();
        initData();
    };

    function _destroy()
    {
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList","Echart"],
        "utils":["Base"]
    });
})( jQuery );