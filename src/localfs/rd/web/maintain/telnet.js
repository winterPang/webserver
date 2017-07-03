;(function ($) {
    var MODULE_BASE = "maintain";
    var MODULE_NAME = MODULE_BASE+".telnet";
    var strPath = MyConfig.path + '/ant';
    var g_command;

    function initdata()
    {
		$("#command_line").html(
			'<iframe src="./ant/shellinabox.html'+
			'?' + FrameInfo.devSN +
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

        //使用Command模式
        $(".page-row .replace-command").on("click", function() {
            FrameInfo.isReset = 'NO';
            Utils.Base.redirect ({np:"maintain.commandline"});
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
        g_command = {data:[{name:"基础信息",value:0,func:funca,
            data:[{name:"版本信息",value:1,param:"display version",func:funca},
                {name:"设备信息",value:2,param:"display device",func:funca},
                {name:"系统时间",value:3,param:"display clock",func:funca},
                {name:"配置信息",value:4,param:"display current-configuration",func:funca},
                {name:"接口信息",value:5,param:"display interface brief",func:funca},
                {name:"网络环境分析",value:6,param:"display wlan rrm-status ap all",func:funca},
                {name:"保存当前配置",value:17,param:"save",func:funca}
            ]},
            {name:"网络信息",func:funca,
                data:[{name:"绿洲云状态",value:7,param:"display cloud state",func:funca},
                    {name:"路由信息",value:8,param:"display ip routing-table",func:funca},
                    {name:"无线AP",value:9,param:"display wlan ap all",func:funca},
                    {name:"无线AP统计",value:10,param:"display wlan statistics ap all connect-history",func:funca},
                    {name:"无线Client",value:11,param:"display wlan client",func:funca},
                    {name:"无线Client统计",value:12,param:"display wlan statistics client",func:funca},
                    {name:"无线服务模板",value:13,param:"display wlan service-template",func:funca},
                    {name:"DHCP状态",value:14,param:"display dhcp server ip-in-use",func:funca}
                ]},
            {name:"监控信息",func:funca,
                data:[{name:"CPU使用率",value:15,param:"display cpu-usage",func:funca},
                    {name:"内存信息",value:16,param:"display memory",func:funca}
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
                devSN:FrameInfo.devSN,
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
        "widgets": ["Form","SList","Antmenu"],
        "utils":["Base"],
    });
})( jQuery );
