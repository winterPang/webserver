;(function ($) {
     var MODULE_BASE = "dpi_user";
     var MODULE_NAME = MODULE_BASE + ".userdpidetail";
     var g_sn = FrameInfo.ACSN;
     var g_UserId;//保存主页面传递过来的userId
      function getRcText(sRcName) {
        return Utils.Base.getRcString("dpi_monitor_rc", sRcName);
    }
    function initGrid()
    {
    	 var opt = {
            colNames: getRcText ("AppType_HEAD"),
            showHeader: true,
            search:true,
            pageSize:5,
            /*select:{id:"UserInfo",name:"UserInfo:", title: getRcText("URL_NAME"),"options": makeUserSelect, action:onSelectChange},*/
            colModel: [ 
                {name: "APPName", datatype: "String"},
                {name:"FirstTime",datatype:"String"},
                {name:"LastTime", datatype:"String"}
            ]
        };
        var opt1 = {
            colNames: getRcText ("UrlType_HEAD"),
            showHeader: true,
            search:true,
            pageSize:5,
            /*select:{id:"UserInfo",name:"UserInfo:", title: getRcText("URL_NAME"),"options": makeUserSelect, action:onSelectChange},*/
            colModel: [ 
                {name: "WebSiteName", datatype: "String"},
                {name:"FirstTime",datatype:"String"},
                {name:"LastTime", datatype:"String"}
            ]
        };
        $("#DpiList").SList ("head", opt);
        $("#DpiList1").SList ("head", opt);
        $("#DpiList2").SList ("head", opt); 
        $("#DpiList3").SList ("head", opt); 
        $("#DpiList4").SList ("head", opt); 
        $("#DpiList5").SList ("head", opt); 
    }
    function initAppList()
    {
    	 var aMessage = [
    	 [{APPName:"淘宝",FirstTime:"2016/07/12 15:30",LastTime:"2016/07/12 16:30"}],
    	 [{APPName:"天猫",FirstTime:"2016/07/12 15:30",LastTime:"2016/07/12 16:30"}],
    	 [{APPName:"聚美",FirstTime:"2016/07/12 15:30",LastTime:"2016/07/12 16:30"}],
    	 [{APPName:"携程",FirstTime:"2016/07/12 15:30",LastTime:"2016/07/12 16:30"}],
    	 [{APPName:"58同城",FirstTime:"2016/07/12 15:30",LastTime:"2016/07/12 16:30"}],
    	 [{APPName:"爱奇艺",FirstTime:"2016/07/12 15:30",LastTime:"2016/07/12 16:30"}]
    	 ] 
    	 $("#DpiList").SList ("refresh", aMessage[0]);
    	 $("#DpiList1").SList ("refresh", aMessage[2]);
    	 $("#DpiList2").SList ("refresh", aMessage[2]);
    	 $("#DpiList3").SList ("refresh", aMessage[3]);
    	 $("#DpiList4").SList ("refresh", aMessage[4]);
    	 $("#DpiList5").SList ("refresh", aMessage[5]);
    }
    function initForm()
    {

    }
    function initData()
    {
        var url = (window.location.hash).split("=");
        g_UserId = url[url.length-1];
    	initAppList();
    }
    function _init()
    { 
        initForm();
        initGrid();
        initData(); 

    };

    function _destroy()
    {

    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList","Form","Minput","Echart","DateRange","SingleSelect","DateTime","Antmenu"],
        "utils":["Base","Request"]
    });
})( jQuery );