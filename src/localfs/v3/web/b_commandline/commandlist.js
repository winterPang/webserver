;(function ($) {
    var MODULE_BASE = "b_commandline";
    var MODULE_NAME = MODULE_BASE + ".commandlist";
    var onlinedata= null;

    function getRcText (sRcName)
    {
        return Utils.Base.getRcString("device_rc",sRcName);
    }

    function initForm ()
    {

    }
    function getValue(row, cell, value, columnDef, dataContext, type){
        if(!value)
        {
            return "";
        }
        if("text" == type)
        {
            return value;
        }
        switch(cell)
        {
            case  2:
            {
                return "<p class='list-link' type='0' devname='"+dataContext["devname"]+"' devgroup='"+dataContext["devgroup"]+"'></p>";
                break;
            }
            default:
                break;
        }
        return false;

    }

    function showDetail(odata)
    {

        Utils.Base.redirect({ np:"b_commandline.commandline",devname:odata.devname,devgroup:odata.devgroup});
    }

    function initGrid()
    {

        //初始化在线/离线设备列表

        var opt = {
            colNames: getRcText ("DEVICE_LIST"),
            showHeader: true,
            multiSelect: false,
            showOperation:true,
            //pageSize:5,
            colModel: [
                {name:'devgroup',datatype:"String"},//设备组
                {name:'devname', datatype:"String"}//设备名
                //{name:'devsn', datatype:"String"},//SN
            ],
            buttons:[
                {name: "detail", action:showDetail}
            ]
        };
        $("#deviceList").SList("head",opt);
    }

    function initData()
    {
        onlinedata =[ {"devgroup":"2","devname":"abcs"}];
        $("#deviceList").SList("refresh",onlinedata);
    }

    function _init ()
    {
        initGrid();
        initForm();
        initData();

    }

    function _destroy ()
    {
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList"],
        "utils":["Request","Base"]
    });
})( jQuery );
