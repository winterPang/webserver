(function ($)
{
	var MODULE_NAME = "b_manage.ap_config";
	
	function getRcText(sRcId)
	{
		return Utils.Base.getRcString("ap_manage_rc", sRcId);
	}

	function ChangeWifiInfo(row, cell, value, columnDef, dataContext, type){
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
			case  0:
			{
				var status = "status"+"0";
				var titletest = getRcText("BASE_HEADER").split(',')[0];
				if(dataContext[status] =="0")
				{
					// titletest = getRcText("AP_STATUS").split(',')[2];
					return "<p class='float-left' type='0'>"+dataContext["devName"]+"</p><p title='"+titletest+"' class=''></p>";
					//return dataContext["Name"];
				}else if(dataContext[status] =="1"){
					//titletest = getRcText("AP_STATUS").split(',')[1];
					return "<p class='float-left' type='0'>"+dataContext["devName"]+"</p><p title='' class=''></p>";
				}

				return "<p class='float-left' type='0'></p><p title='' class='index_icon_count'></p>";
				break;
			}
			case  1:
			{
				var status = "status"+"1";
				var titletest = getRcText("BASE_HEADER").split(',')[1];
				if(dataContext[status] =="0")
				{
					// titletest = getRcText("AP_STATUS").split(',')[2];
					return "<p class='float-left' type='0'>"+dataContext["innerWifi"]+"</p><p title='"+titletest+"' class='index_icon_count index_icon_offline'></p>";
					//return dataContext["Name"];
				}else if(dataContext[status] =="1"){
					//titletest = getRcText("AP_STATUS").split(',')[1];
					return "<p class='float-left' type='0'>"+dataContext["innerWifi"]+"</p><p title='' class='index_icon_count index_icon_online'></p>";
				}

				return "<p class='float-left' type='0'></p><p title='' class='index_icon_count'></p>";
				break;
			}
			case  2:
			{
				var status = "status"+"2";
				var titletest = getRcText("BASE_HEADER").split(',')[2];
				if(dataContext[status] =="0")
				{
					// titletest = getRcText("AP_STATUS").split(',')[2];
					return "<p class='float-left' type='0'>"+dataContext["bussinessWifi1"]+"</p><p title='"+titletest+"' class='index_icon_count index_icon_offline'></p>";
					//return dataContext["Name"];
				}else if(dataContext[status] =="1"){
					//titletest = getRcText("AP_STATUS").split(',')[1];
					return "<p class='float-left' type='0'>"+dataContext["bussinessWifi1"]+"</p><p title='' class='index_icon_count index_icon_online'></p>";
				}

				return "<p class='float-left' type='0'></p><p title='' class='index_icon_count'></p>";
				break;
			}
			case  3:
			{
				var status = "status"+"3";
				var titletest = getRcText("BASE_HEADER").split(',')[3];
				if(dataContext[status] =="0")
				{
					// titletest = getRcText("AP_STATUS").split(',')[2];
					return "<p class='float-left' type='0'>"+dataContext["bussinessWifi2"]+"</p><p title='"+titletest+"' class='index_icon_count index_icon_offline'></p>";
					//return dataContext["Name"];
				}else if(dataContext[status] =="1"){
					//titletest = getRcText("AP_STATUS").split(',')[1];
					return "<p class='float-left' type='0'>"+dataContext["bussinessWifi2"]+"</p><p title='' class='index_icon_count index_icon_online'></p>";
				}

				return "<p class='float-left' type='0'></p><p title='' class='index_icon_count'></p>";
				break;
			}
			case  4:
			{
				var status = "status"+"4";
				var titletest = getRcText("BASE_HEADER").split(',')[4];
				if(dataContext[status] =="0")
				{
					// titletest = getRcText("AP_STATUS").split(',')[2];
					return "<p class='float-left' type='0'>"+dataContext["bussinessWifi3"]+"</p><p title='"+titletest+"' class='index_icon_count index_icon_offline'></p>";
					//return dataContext["Name"];
				}else if(dataContext[status] =="1"){
					//titletest = getRcText("AP_STATUS").split(',')[1];
					return "<p class='float-left' type='0'>"+dataContext["bussinessWifi3"]+"</p><p title='' class='index_icon_count index_icon_online'></p>";
				}

				return "<p class='float-left' type='0'></p><p title='' class='index_icon_count'></p>";
				break;
			}
			//case 5:
			//{
			//	return '<a class="oper-btn" ' +
			//		   'title="'
			//		   +getRcText("UNIT_DETAIL")+
			//           '"odata0="'
			//		   +dataContext["innerWifi1"]+
			//           '"odata1="'
			//           +dataContext["innerWifi2"]+
			//           '"odata2="'
			//		   +dataContext["bussinessWifi1"]+
			//		   '"odata3="'
			//		   +dataContext["bussinessWifi2"]+
			//			'"odata4="'
			//			+dataContext["bussinessWifi3"]+
			//			'">'
			//		    +'<i class="icon mlist-opt-icon slist-detail" type="detail"></i>'
			//		   +'</a>';
			//}
			default:
				break;
		}
		return false;

	}


    function showDetail()
    {
        Utils.Base.redirect({ np:"b_manage.apconfig_detail"});
        return false;
    }
	function initGrid()
	{		
		 var opt_g = {         
            showHeader: true,
            multiSelect: false,
            pageSize : 10,
            colNames: getRcText ("BASE_HEADER_G"),
			showOperation:true,
            colModel: [
                 {name: "devName",datatype: "String",formatter:ChangeWifiInfo} 
                ,{name: "innerWifi", datatype: "String",formatter:ChangeWifiInfo}          //内部wifi
                ,{name: "bussinessWifi1", datatype: "String",formatter:ChangeWifiInfo}  //商业wifi1
                ,{name: "bussinessWifi2",  datatype: "String",formatter:ChangeWifiInfo}     //商业wifi2
                ,{name: "bussinessWifi3", datatype: "String",formatter:ChangeWifiInfo}//商业wifi3
			],
			buttons:[
                {name: "detail", action:showDetail}
            ]
        };
        var opt_s = {         
            showHeader: true,
            multiSelect: false,
            pageSize : 10,
            colNames: getRcText ("BASE_HEADER_S"),
			showOperation:true,
            colModel: [
                 {name: "devName",datatype: "String",formatter:ChangeWifiInfo} 
                ,{name: "innerWifi", datatype: "String",formatter:ChangeWifiInfo}          //内部wifi
                ,{name: "bussinessWifi1", datatype: "String",formatter:ChangeWifiInfo}  //商业wifi1
                ,{name: "bussinessWifi2",  datatype: "String",formatter:ChangeWifiInfo}     //商业wifi2
                ,{name: "bussinessWifi3", datatype: "String",formatter:ChangeWifiInfo}//商业wifi3
			],
			buttons:[
                {name: "detail", action:showDetail}
            ]
        };
        $("#wifiList_g").SList("head", opt_g);
        $("#wifiList_s").SList("head", opt_s);
	}
	
	function initForm()
	{
		$('#devicegrp').on("click",function(){
			$('#wifiList_g').toggleClass("hide").SList("resize");
			$('#wifiList_s').toggleClass("hide").SList("resize");
		});
		$('#singledevice').on("click",function(){
			$('#wifiList_s').toggleClass("hide").SList("resize");
			$('#wifiList_g').toggleClass("hide").SList("resize");
		});
	}
	
	function initData()
	{
		var wifiData = [];
		wifiData.push(
			{
				"devName":"xiaobei",
				"innerWifi":"innerWifi",
				"bussinessWifi1":"bussinessWifi1",
				"bussinessWifi2":"bussinessWifi2",
				"bussinessWifi3":"bussinessWifi3",
				"status0":"1",
				"status1":"0",
				"status2":"1",
				"status3":"1",
				"status4":"0"
			},
			{
				"devName":"5540",
				"innerWifi":"innerWifi",
				"bussinessWifi1":"bussinessWifi",
				"bussinessWifi2":"bussinessWifi",
				"bussinessWifi3":"bussinessWifi",
				"status0":"0",
				"status1":"1",
				"status2":"1",
				"status3":"0",
				"status4":"1"

			}
		);
		$("#wifiList_g").SList("refresh", wifiData).resize();
		$("#wifiList_s").SList("refresh", wifiData).resize();
		// var aWireLess = [];
		// var aData = ["2001","2002","2003"];
		// $("#WireLess").typehead("setData",aData);

	}
	
	function _init ()
	{
		initGrid();
		initForm();
		initData();
	}

	function _resize (jParent)
	{		
		//Utils.Request.clearMoudleAjax(MODULE_NAME);
	}

	function _destroy ()
	{
		
		//Utils.Request.clearMoudleAjax(MODULE_NAME);
	}
	Utils.Pages.regModule (MODULE_NAME, {
		"init": _init,
		"destroy": _destroy,
		"resize": _resize,
		"widgets": ["SList","Form","Typehead","Minput"],
		"utils": [],
		"subModules": []
	});
}) (jQuery);