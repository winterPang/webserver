;(function($)
{
    var MODULE_BASE = "wdashboard";
    var MODULE_NAME = MODULE_BASE + ".allterminal";
    var g_jMList;

    function getRcText(sRcId)
    {
        return Utils.Base.getRcString("aps_all_rc", sRcId);
    }


    function initGrid()
    {
        var opt = {
            height:450,
            multiSelect: false,
            colNames: getRcText("LIST_MONITOR"),
            colModel: [
                {name: "devSN", datatype: "String"},
                {name: "count", datatype: "String"}
            ], 
            buttons: [
                {name: "add", enable:false},
                {name: "edit", enable:false},
                {name: "delete", enable:false}
            ]
        };
        g_jMList.mlist("head", opt);
    }
    
 
    function initData()
    {

        function getTerminalList(ArrayT)
        {
            var atemp = [];
            $.each(ArrayT,function(index,iArray){
                atemp.push(
                        {
                            "devSN":iArray.devSN,
                            "count":iArray.Count,
                        }
                    );
            });

            return atemp;
        }
        var oTimeList = {
            ">=4096":[4096,-1],
            "2048~4096":[2048,4096],
            "1024~2048":[1024,2048],
            "256~1024":[256,1024],
            "128~256":[128,256],
            "64~128":[64,128],
            "32~64":[32,64],
            "0~32":[0,32]
        };
        $.ajax({
            url:MyConfig.path+"/stamonitor/statistic_byclientnum_detail",
            type: "GET",
            dataType: "json",
            data:{
                leftnum:oTimeList[g_oUrlPara.name][0],
                rightnum:oTimeList[g_oUrlPara.name][1],
                skipnum:0,
                limitnum:100000
            },
            success: function(data) {
                var all=getTerminalList(data.acList);
                g_jMList.mlist("refresh", all);
            },
            error: function(){
               
            }
        }); 
    }
    function _init(oPara)
    {
        g_oUrlPara = Utils.Base.parseUrlPara();
        g_oNodePara = Utils.Base.getCurNode();
        $.extend(g_oUrlPara,g_oNodePara, oPara);
        g_jMList = $("#terminal_all_list");
        
        initGrid();
        initData();
    }

    function _destroy()
    {
        // g_jMList = null;
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["Mlist","Form"],
        "utils": ["Request", "Base"]
        // "subModules": [MODULE_NC]
    });
}) (jQuery);