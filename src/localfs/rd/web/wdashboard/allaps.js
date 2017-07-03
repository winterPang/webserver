;(function($)
{
    var MODULE_BASE = "wdashboard";
    var MODULE_NAME = MODULE_BASE + ".allaps";
    // var NC, MODULE_NC = MODULE_BASE + ".NC";
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

        function getApList(ArrayT)
        {
            var atemp = [];
            $.each(ArrayT,function(index,iArray){
                atemp.push(
                        {
                            "devSN":iArray.devSN,
                            "count":iArray.count,
                        }
                    );
            });

            return atemp;
        }
        var oTimeList = {
            ">=1024":[1024,-1],
            "256~1024":[256,1024],
            "128~256":[128,256],
            "64~128":[64,128],
            "32~64":[32,64],
            "16~32":[16,32],
            "8~16":[8,16],
            "4~8":[4,8],
            "0~4":[0,4]
        };
        $.ajax({
            url:MyConfig.path+"/apmonitor/statistics_byapcount_detail",
            type: "GET",
            dataType: "json",
            data:{
                mincount:oTimeList[g_oUrlPara.name][0],
                maxcount:oTimeList[g_oUrlPara.name][1],
                skipnum:0,
                limitnum:100000
            },
            success: function(data) {
                var all=getApList(data.acList);
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
        g_jMList = $("#aps_all_list");
        
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