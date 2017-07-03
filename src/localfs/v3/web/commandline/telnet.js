;(function ($) {
    var MODULE_BASE = "commandline"
    var MODULE_NAME = MODULE_BASE+".telnet";
    var strPath = MyConfig.path + '/ant';
    var g_command;
	
	function getRcText(sRcName)
    {
        return Utils.Base.getRcString("wips_rc", sRcName);
    }

    function initdata()
    {
		$("#command_line").html(
			'<iframe src="./ant/shellinabox.html'+
			document.location.search+
			'" width="100%" height="100%"></iframe>'
		);
    }
    function initform()
    {
        $(".warning-panel").on("click",function(e){
            $(".warning-panel").remove();
        });

        $("#button_help,#tip_icon").on("click", function(e){
            $("#tip_icon").toggleClass("on").toggleClass("off");
            $("#help_message").toggleClass("on");
        });
        $(".page-row .li-normalstyle").on("click", function(e) {
            var command = $(this).attr("command");
        });
        $(".telnet-switch input").on("click",function(){
            Utils.Base.redirect ({np:"commandline.commandline"});

        });    
    }
    
    function funca(escope)
    {
    	var scope = document.getElementsByTagName("iframe")[0].contentWindow.document.getElementById("commandline_input");
    	var value = $(escope).attr("param");
    	if(scope)
    	{
    		scope.setAttribute("value", value)
    	}
    }
    function _init()
    {
        var aBasicInfo = getRcText("BASIC-INFO").split(",");
        var aNetworkInfo = getRcText("NETWORK-INFO").split(",");
        var aMonitorInfo = getRcText("MONITOR-INFO").split(",");

        g_command = {data:[{name:aBasicInfo[0],value:0,func:funca,
            data:[{name:aBasicInfo[1],value:1,param:"display version",func:funca},
                {name:aBasicInfo[2],value:2,param:"display device",func:funca},
                {name:aBasicInfo[3],value:3,param:"display clock",func:funca},
                {name:aBasicInfo[4],value:4,param:"display current-configuration",func:funca},
                {name:aBasicInfo[5],value:5,param:"display interface brief",func:funca},
                {name:aBasicInfo[6],value:6,param:"display wlan rrm-status ap all",func:funca},
                {name:aBasicInfo[7],value:17,param:"save",func:funca}
            ]},
            {name:aNetworkInfo[0],func:funca,
                data:[{name:aNetworkInfo[1],value:7,param:"display cloud state",func:funca},
                    {name:aNetworkInfo[2],value:8,param:"display ip routing-table",func:funca},
                    {name:aNetworkInfo[3],value:9,param:"display wlan ap all",func:funca},
                    {name:aNetworkInfo[4],value:10,param:"display wlan statistics ap all connect-history",func:funca},
                    {name:aNetworkInfo[5],value:11,param:"display wlan client",func:funca},
                    {name:aNetworkInfo[6],value:12,param:"display wlan statistics client",func:funca},
                    {name:aNetworkInfo[7],value:13,param:"display wlan service-template",func:funca},
                    {name:aNetworkInfo[8],value:14,param:"display dhcp server ip-in-use",func:funca}
                ]},
            {name:aMonitorInfo[0],func:funca,
                data:[{name:aMonitorInfo[1],value:15,param:"display cpu-usage",func:funca},
                    {name:aMonitorInfo[2],value:16,param:"display memory",func:funca}
                ]}],
            //footer:{show:true, content:"故障恢复"},
            //search:{show:true, content:"常用命令"}
        };
        $(".antmenu").antmenu("init",g_command);

		initdata();
		initform();

    }
    function _destroy()
    {
        $("#command_line").empty();
        var session = $("#session_father_saved").attr("value");
        if(session)
        $.ajax({
            url:strPath+'/confmgr',
            Type:"post",
            data:{
                configType : 0,
                devSN:FrameInfo.ACSN,
                deviceModule : "TELNET",
                session: session,
                echo : 1,
                cmdProxy:"",
                timeOut:"",
            }        
        });
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["Form","SList","Minput","Antmenu"],
        "utils":["Request","Base"],
    });
})( jQuery );
