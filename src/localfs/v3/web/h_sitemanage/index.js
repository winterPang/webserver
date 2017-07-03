(function ($) {
	// body...
	var MODULE_NAME = "h_sitemanage.index";
	function getRcText (argument) {
		return Utils.Base.getRcString("guest_rc", argument);
	}

	 function showLink(row, cell, value, columnDef, dataContext, type)
    {
        value = value || "";

        if("text" == type)
        {
            return value;
        }

        return '<a class="list-link" cell="'+cell+'">'+value+'</a>';
    }

     function onDisDetail(data)
    {
        var oData = $("#site_list").SList("getSelectRow")[0];
        var sType = $(this).attr("cell");
        if(sType == 0)
        {
            //showWirelessInfo(oData);
            showFlowInfo(oData);
        }
    }

    function showFlowInfo(oData)
    {
        /*var aType = [];
         for(i = 0; i < 4; i++)
         {
         var oo = {
         wifi:getRcText("HIDE").split(",")[i],
         hide:getRcText("HIDE" + i)
         }
         aType.push(oo);
         }*/
        /* end */
        // var tempData9 = [];
        // tempData9.push(
        //     {
        //         name:getRcText("NAME"),
        //         describe:"7:30-9:00",
        //         content:"scheduler job openradio"
        //     },
        //     {
        //         name:getRcText("NAME"),
        //         describe:"11:00-14:00",
        //         content:"command 1 system-view"
        //     },
        //     {
        //         name:getRcText("NAME"),
        //         describe:"17:00-19:00",
        //         content:"command 2 wlan ap-group default-group"
        //     },
        //     {
        //         name:getRcText("NAME"),
        //         describe:"7:30-9:00",
        //         content:"scheduler job openradio"
        //     },
        //     {
        //         name:getRcText("NAME"),
        //         describe:"11:00-14:00",
        //         content:"command 1 system-view"
        //     },
        //     {
        //         name:getRcText("NAME"),
        //         describe:"17:00-19:00",
        //         content:"command 2 wlan ap-group default-group"
        //     }
        // );
        // $("#flowdetail_list").SList ("refresh", tempData9);
        //$("#flowdetail_list").SList ("refresh", aType);
        /* 缁勭粐濂芥暟鎹悗 */
        Utils.Base.openDlg(null, {}, {scope:$("#flowdetailDlg"),className:"modal-super"});
    }

	function onRefresh (argument) {
		// body...
	}
	function initGrid (argument) {
		// body...
		var opt = {
			showOperation:true,
            showHeader: true,
            multiSelect: true,
            pageSize : 8,
            colNames: getRcText ("GUEST_HEAD"),
            colModel: [
                {name: "siteName", datatype: "String",formatter:showLink},//场所名称
                {name: "relDevice", datatype: "String"},//关联设备
                {name: "deviceType", datatype: "String"},//设备类型
                {name: "siteLocation", datatype: "String"},//场所地址
                {name: "call", datatype: "String"},//联系电话
                {name: "column", datatype: "String"}//操作列
            ],

            buttons:[
            	{name: "add", action: onRefresh},
                {name: "delet", value:getRcText ("DELETE"),enable: ">0",action:Utils.Msg.deleteConfirm( )},
            	{name: "refresh", value: getRcText ("REFRESH")}
            ]
        };
        $("#site_list").SList ("head", opt);

         $("#site_list").on('click', 'a.list-link', onDisDetail);

         var tempData1 = [];
        tempData1.push(
            {
                siteName:getRcText("NAME"),
                relDevice:"210235A1JMC158000002",
                deviceType:"H3C WAC360",
                siteLocation:getRcText("LOCATION"),
                call:"15810819002",
                column:"．．．"
            },
             {
                siteName:getRcText("NAME"),
                relDevice:"210235A1JMC158000002",
                deviceType:"H3C WAC360",
                siteLocation:getRcText("LOCATION"),
                call:"15810819002",
                column:"..."
            },
             {
                siteName:getRcText("NAME"),
                relDevice:"210235A1JMC158000002",
                deviceType:"H3C WAC360",
                siteLocation:getRcText("LOCATION"),
                call:"15810819002",
                column:"..."
            },
             {
                siteName:getRcText("NAME"),
                relDevice:"210235A1JMC158000002",
                deviceType:"H3C WAC360",
                siteLocation:getRcText("LOCATION"),
                call:"15810819002",
                column:"..."
            },
             {
                siteName:getRcText("NAME"),
                relDevice:"210235A1JMC158000002",
                deviceType:"H3C WAC360",
                siteLocation:getRcText("LOCATION"),
                call:"15810819002",
                column:"..."
            },
             {
                siteName:getRcText("NAME"),
                relDevice:"210235A1JMC158000002",
                deviceType:"H3C WAC360",
                siteLocation:getRcText("LOCATION"),
                call:"15810819002",
                column:"..."
            },
             {
                siteName:getRcText("NAME"),
                relDevice:"210235A1JMC158000002",
                deviceType:"H3C WAC360",
                siteLocation:getRcText("LOCATION"),
                call:"15810819002",
                column:"..."
            },
             {
                siteName:getRcText("NAME"),
                relDevice:"210235A1JMC158000002",
                deviceType:"H3C WAC360",
                siteLocation:getRcText("LOCATION"),
                call:"15810819002",
                column:"..."
            }
           
           
        );
        $("#site_list").SList ("refresh", tempData1);
	}
	function initData (argument) {
		// body...
	}
	function _init (argument) {
		// body...
		initGrid();
		initData();
	}
	function _destroy (argument) {
		// body...
	}
	function _resize (argument) {
		// body...
	}
	Utils.Pages.regModule (MODULE_NAME,{
		"init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["SList","Form","Echart","Minput"],
        "utils": ["Base", "Device"]
	});
})(jQuery);