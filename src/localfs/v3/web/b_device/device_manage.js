(function($){
    var MODULE_NAME = "b_device.device_manage";

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("device_rc",sRcName);
    }

    function WireLessLink(row, cell, value, columnDef, dataContext, type)
    {
        value =value|| "";
        if("text" == type)
        {
            return value;
        }
        return '<a class="list-link" cell="'+cell+'" deviceName="'+dataContext['devgroup']+'">'+'无线服务'+'</a>';

    }

    function drawDeviceGroup()
    {
        var opt = {
            colNames:getRcText("DEVICE_GROUP").split(","),
            showHeader:true,
            multiSelect:false,
            colModel:[
            {name:'wireless',datatype:"String",formatter:WireLessLink},
            {name:'devgroup',datatype:"String"}  
            ]
        };

        $("#device_group_list").SList("head",opt);
    }

    function drawWireLess()
    {
        //初始化在线/离线设备列表
        function showDetail()
        {
            Utils.Base.redirect({ np:"b_device.summary"});
            Utils.Pages.closeWindow(Utils.Pages.getWindow( $("#deviceList")));
            return false;
        }
        var opt = {
            colNames: getRcText ("DEVICE_LIST"),
            showHeader: true,
            multiSelect: true,
            showOperation:false,
            //pageSize:5,
            colModel: [
                {name:'devsn', datatype:"String"}, //序列号
                {name:'devname',datatype:"String"},//设备名
                {name:'devgroup',datatype:"Number"}//设备组
            ]
        };
        $("#deviceList").SList("head",opt);
    }

    function initGrid()
    {
        drawDeviceGroup();
        drawWireLess();
    }

    function initData()
    {
        var data = [{'devgroup':"apmonitor",'wireless':"无线服务"}];
        $("#device_group_list").SList("refresh",data);
    }

    function initForm()
    {
        $("#device_group_list").on('click','.list-link',function(){
            function onCancel()
            {
                Utils.Pages.closeWindow(Utils.Pages.getWindow( $("#showDeviceDlg")));
            }

            function onApply()
            {
                Utils.Pages.closeWindow(Utils.Pages.getWindow( $("#showDeviceDlg")));
            }

            var dlgTitle = getRcText("VIEW")+$(this).attr('devicename')+getRcText("INFO");
            $("#device_form").form ("init", "edit", {"title":dlgTitle,"btn_apply":{enable:true,action:onApply}, "btn_cancel":onCancel});

            Utils.Base.openDlg(null, {}, {scope:$("#showDeviceDlg"),className:"modal-super"});
            $("#deviceList").SList("resize");

            var outlinedata = [{"devsn":"briefy","devname":"briefy-luck","devgroup":"5"}];
            $("#deviceList").SList("refresh",outlinedata);


        });
    }

    function _init(){
        initGrid();
        initData();
        initForm();
    }

    function _resize(iParent)
    {

    }

    function _destroy(){

    }



    Utils.Pages.regModule(MODULE_NAME,{
        "init":_init,
        "destroy":_destroy,
        "resize":_resize,
        "widgets":["SList","Form"],
        "utils":["Request","Base"]
    })
})(jQuery);
