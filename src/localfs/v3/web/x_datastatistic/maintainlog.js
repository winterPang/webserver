; (function($) {
    var MODULE_NAME = "x_datastatistic.maintainlog";
    function getRcText(sRcName) {
        return Utils.Base.getRcString("log_monitor_rc", sRcName);
    }

    // 对Date的扩展，将 Date 转化为指定格式的String   
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
    // 例子：   
    // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
    // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
    Date.prototype.Format = function(fmt) { //author: meizz   
        var o = {
            "M+": this.getMonth() + 1,                 //月份   
            "d+": this.getDate(),                    //日   
            "h+": this.getHours(),                   //小时   
            "m+": this.getMinutes(),                 //分   
            "s+": this.getSeconds(),                 //秒   
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
            "S": this.getMilliseconds()             //毫秒   
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
    function initData() {
        function getLogMessage() {
            function getLogMessageSuc(data, textStatus, jqXHR){

                    if (!( "message" in data)) {
                      return;
                    }
                    var messageList = data.message;
                    console.log(data);

                    messageList.forEach(function(message) {
                        message.stamp = (new Date(message.stamp*1000)).Format("yyyy-MM-dd hh:mm:ss");
                    }, this);
                    $("#log_list").SList("refresh", messageList);
            }
            function getLogMessageFail(){
                console.log("get log message error");
            }
            var getLogMessageOpt = {
                type: "POST",
                url: MyConfig.path + "/ant/read_logmgr",
                contentType: "application/json",
                dataType: "json",
                timeout: 150000,
                data: JSON.stringify({
                    method: "getLog",
                    scenarioId:FrameInfo.Nasid
                }),
                onSuccess: getLogMessageSuc,
                onFailed: getLogMessageFail
            };
            Utils.Request.sendRequest(getLogMessageOpt);
            //return $.ajax({
            //    type: "POST",
            //    url: MyConfig.path + "/ant/read_logmgr",
            //    contentType: "application/json",
            //    dataType: "json",
            //    data: JSON.stringify({
            //        devSN: FrameInfo.ACSN,
            //        method: "getLog",
            //    })
            //}).done(function(data, textStatus, jqXHR) {
            //    if (data.reason!= "") {
            //        return;
            //        //retCode
            //    }
            //}).fail(function() {
            //    console.log("get log message error");
            //})
        }
        //getLogMessage().done(function(data, textStatus, jqXHR) {
        //    var messageList = data.message;
        //    console.log(data);
        //
        //    messageList.forEach(function(message) {
        //        message.stamp = (new Date(message.stamp*1000)).Format("yyyy-MM-dd hh:mm:ss");
        //    }, this);
        //    $("#log_list").SList("refresh", messageList);
        //});
        getLogMessage();

    }

    function deleteLog() {

    }
    function initGrid() {
        var option = {
            pageSize:10,
            colNames: getRcText("LOG_HEADER"),
            colModel: [
                { name: 'user', datatype: "String" },
                { name: 'devSN', datatype: "String" },
                { name: 'stamp', datatype: "String" },
                { name: 'message', datatype: "String" }
            ]
        };
        $("#log_list").SList("head", option);
    }
    function _init() {
        //initForm();
        initGrid();
        initData();
    }

    function _destroy() {
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList"],
        "utils": ["Base","Request"]
    });
})(jQuery);