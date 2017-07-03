/**
 * Created by Administrator on 2015/12/1.
 */
(function ($)
{
    var MODULE_NAME = "cooperate.index";
    var g_jForm,g_oPara;

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("cooperate_rc", sRcName);
    }

    function initData()
    {
        var opt=[];

        var tem = {
            "cooperateName":getRcText("baidu").split(",")[0],
            "logo":"message_icon",
            "dec":'<a herf="'+getRcText("baidu").split(",")[1]+'">'+getRcText("baidu").split(",")[1]+'</a>'
        };

        $("#cooperate_edit").SList("refresh", [tem]);
    }

    function ChangelogoInfo(row, cell, value, columnDef, dataContext, type)
    {
        var ncount = 0;
        var bwipsStatus = 'function_off';
        var bprobeStatus = 'function_off';
        var bnatStatus = 'function_off';
        var nID = '';

        if(type=="text")
        {
            return "当前的状态";
        }
        var tem = [
        '<span class="col-xs-4 ',
        bnatStatus,
        '"></span>'
        ]
        return tem.join("");
    }

    function Changelink(row, cell, value, columnDef, dataContext, type)
    {
        return "<a href='http://magic.xxyxc.scpretail.net/j/traffic_analyse/floor_wifi_analyseShow' style='color:#4ec1b2'>"+"link"+"</a>"
    }

    function initGrid()
    {
        var opt = {
            colNames:getRcText("Name").split(","),
            showHeader: true,
            search:true,
            colModel:[
                {name:'cooperateName',datatype:"String"},
                {name:'logo',formatter:ChangelogoInfo},
                {name:'dec',datatype:"String",formatter:Changelink}
            ]
            // onToggle:{
            //     action:showHideInfo,
            //     jScope:$(wipscfg_toggle)
            // }
        };
        $("#cooperate_edit").SList("head", opt);
    }
    function _init(oPara)
    {
        initGrid();
        // initform();
        initData();
    };

    function _destroy()
    {

    }

    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList"],
        "utils":["Request","Base"],
    });
}) (jQuery);
