(function ($)
{
    var MODULE_NAME = "city_dashboard.ssid_test";//指的是frametest文件夹下的slistest.js文件,一会传到Utils.Pages.regModule 中
    var RC_INFO = "frametest_slistest_info_rc";

    function getRcText(sRcName)//封装好一个方法等待调用,并且确定返回值
    {
        return Utils.Base.getRcString(RC_INFO, sRcName);
    }
    function initGrid()
    {
        /**
        对slist表头初始化
        **/

        var opt = {
            colNames: getRcText ("SLIST_ONE_LABELS"),
            showHeader: true,
            multiSelect: false,
            pageSize:4,
            rowHeight:45.25,
            colModel: [
                {name:'ssidName', datatype:"String"/*,formatter:ChangeAPInfo*/},
                {name:'stName', datatype:"String"},
                {name:'status1', datatype:"String"},
                // {name:'history', datatype:"String"/*,formatter:ChangeAPInfo*/}
          ]
        };
    $("#slist_one_list").SList ("head", opt);
    }

    function initData()
    {
        /**
        加载页面数据初始化
        **/
        function getSsidFlowSuc (data) {
            if('{"errcode":"illegal access"}' == data){
                    console.log("没有权限")
            }
            else{
                $.each(data.ssidList,function(index,iDate){
                    var aStatus = getRcText("STATUS").split(',');
                    iDate.status1 = aStatus[iDate.status];                 
                });
                $("#slist_one_list").SList ("refresh", data.ssidList);
            }
        }
        function getSsidFlowFail (data) {
            // body...
        }
        var ssidFlowOpt = {
            url: MyConfig.path+"/ssidmonitor/getssidlist",
            type: "GET",
            dataType: "json",
            contentType: "application/json",
            data:{
                devSN:FrameInfo.ACSN,
                skipnum:0,
                limitnum:100000
            },
            onSuccess:getSsidFlowSuc,
            onFailed:getSsidFlowFail
        };
        Utils.Request.sendRequest(ssidFlowOpt);
    }

    function _init ()
    {
        initGrid();
        initData();
        // initForm();
    }

    function _resize(jParent)
    {
    }

    function _destroy()
    {
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }
    Utils.Pages.regModule (MODULE_NAME, {//MODULE_NAME指的是frametest文件夹下的slistest.js文件,侧面反映出这个Utils.Pages.regModule
        //只在这个JS文件内有效
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["SList"],//什么意思？
        "utils": ["Request", "Base",]//什么意思？
    });

}) (jQuery);
//(function($){...})(jQuery)用来定义一些需要预先定义好的函数