/* global jQuery */
(function($){
	$.ajax("test.html").done(function(data, textStatus, jqXHR){
		console.log(data);
		console.log(textStatus);
		console.log(jqXHR);
	});
	var devSn = "210235A1CWC155900098";
	var temp = [
		"<tr id='[name]'>",
			"<td class='index'>[index]","</td>",
			"<td class='name'>[name]","</td>",
			"<td class='http'>[http]","</td>",
			"<td class='body'>[body]","</td>",
			"<td class='status'>","</td>",
			"<td class='data'>","</td>",
			"<td class='author'>[author]","</td>",
		"</tr>"
	].join("");
	
	function initHtml(obj, id){
		$(id).append(temp.replace(/\[name\]/g, obj.name).
			replace(/\[http\]/g, obj.type).
			replace(/\[body\]/g, obj.data||"-").
			replace(/\[index\]/g, obj.index).
			replace(/\[url\]/g, obj.url).
			replace(/\[author\]/g, obj.author)
		);
	}
	
	function updateHtml(obj, XMLHttpRequest, time){
		$("#"+obj.name + " .name").html(obj.name+"<hr>"+time+"(s)");
		$("#"+obj.name + " .status").text(XMLHttpRequest.status);
		if (XMLHttpRequest.status !== 200){
			$("#"+obj.name).css('background-color', 'red');
		}
		$("#"+obj.name + " .data").html(obj.url + "<hr>" + XMLHttpRequest.responseText);
	}
	
	function ajaxTest(obj, f, id){
		initHtml(obj, id);
		var startTime = new Date();
		$.ajax({
			type: obj.type,
			url: obj.url,
			dataType: "json",
			username: "security_super",
			password: "lvzhou1-super",
			contentType: "application/json",
			data: obj.data || "",
			complete: function(XMLHttpRequest, textStatus){
				var endTime = new Date();
				f&f(obj, XMLHttpRequest, endTime.getSeconds()-startTime.getSeconds());
			}
		})
	}
	
	function initTable(testList, id){
		$(id).append('<tr id="title"><th></th><th>测试项目</th><th>http</th><th>body</th><th>请求状态</th><th>数据</th><th>作者</th></tr>');
		testList.forEach(function(testItem){
			var author = testItem.author;
			var testList = testItem.testList;
			var index = 1;
			testList.forEach(function(func){
				func.author = author;
				func.index = index++;
				ajaxTest(func, updateHtml, id);
			})
		})
	}
	
	var V3TestList = [
		{
			author: "zhangyongchang",
			testList: [
				{
					name: "getAcList",
					type: "get",
					url: "/v3/devmonitor/web/aclist",
					dataType: "json"
				},
				{
					name: "getSystemInfo",
					type: "get",
					url: "/v3/devmonitor/web/system?devSN=" + devSn,
					dataType: "json"
				},
				{
					name: "getWanInfo",
					type: "get",
					url: "/v3/devmonitor/web/waninfo?devSN=" + devSn,
					dataType: "json"
				},
				{
					name: "getApList",
					type: "get",
					url: "/v3/apmonitor/web/aplist?devSN=" + devSn,
					dataType: "json"
				},
				{
					name: "getApTraffic",
					type: "get",
					url: "/v3/apmonitor/web/aptraffic?devSN=" + devSn,
					dataType: "json"
				},
				{
					name: "getStationList",
					type: "get",
					url: "/v3/stamonitor/web/stationlist?devSN=" + devSn,
					dataType: "json",
				},
				{
					name: "getClientCount",
					type: "get",
					url: "/v3/stamonitor/web/clientcount?devSN=" + devSn,
					dataType: "json",
				},
				{
					name: "getWanSpeed",
					type: "get",
					url: "/v3/devmonitor/web/wanspeed?devSN=" + devSn,
					dataType: "json",
				},
				{
					name: "getApStatistic",
					type: "get",
					url: "/v3/apmonitor/web/apstatistic?devSN=" + devSn,
					dataType: "json",
				},
				{
					name: "assClientCount",
					type: "get",
					url:"/v3/stamonitor/web/assclientcount?devSN="+devSn,
					dataType: "json",
				}
			]
		},
		{
			author: "zhangbing",
			testList: [
				{
					name: "health",
					type: "get",
					url: "/v3/health/home/health?acSN=210235A1CWC155900098",
					dataType: "json",
				}
			]
		}
	]
	
	var V2TestList = [
		{
			author: "yichao",
			testList: [
				{
					name: "getWANTraffic",
					type: "get",
					url: "/o2oportal/getWANTraffic",
					dataType: "json",
					contentType: "application/json"
				},
				{
					name: "getDevStatus",
					type: "post",
					url: "/o2oportal/getDevStatus",
					dataType: "json",
					contentType: "application/json",
					data: JSON.stringify({
						tenant_name: "liuchao",
						dev_snlist: []
					})
				},
				{
					name: "getRadioInfo",
					type: "post",
					url: "/o2oportal/getRadioInfo",
					dataType: "json",
					contentType: "application/json",
					data: JSON.stringify({
						tenant_name: "liuchao",
						dev_snlist:["210235A1CYC153900199"]
					})
				},
				{
					name: "getSSIDInfo",
					type: "post",
					url: "/o2oportal/getSSIDInfo",
					dataType: "json",
					contentType: "application/json",
					data: JSON.stringify({
						tenant_name: "liuchao",
						dev_snlist:["210235A1CYC153900199"]
					})
				},
				{
					name: "getApInfo",
					type: "post",
					url: "/o2oportal/getApInfo",
					dataType: "json",
					contentType: "application/json",
					data: JSON.stringify({
						tenant_name: "liuchao",
						ap_snlist: []
					})
				},
				{
					name: "getEvent",
					type: "post",
					url: "/o2oportal/getEvent",
					dataType: "json",
					contentType: "application/json",
					data: JSON.stringify({
						tenant_name: "liuchao",
						dev_snlist:["210235A1CYC153900199"]
					})
				},
				{
					name: "getDeviceInfo",
					type: "post",
					url: "/o2oportal/getDeviceInfo",
					dataType: "json",
					contentType: "application/json",
					data: JSON.stringify({
						tenant_name: "liuchao",
						dev_snlist:["210235A1CYC153900199"]
					})
				},
				{
					name: "getApInfosInAC",
					type: "post",
					url: "/o2oportal/getApInfosInAC",
					dataType: "json",
					contentType: "application/json",
					data: JSON.stringify({
						tenant_name: "liuchao",
						dev_snlist:["210235A1CYC153900199"]
					})
				},
				{
					name: "getClientInfosInAC",
					type: "post",
					url: "/o2oportal/getClientInfosInAC",
					dataType: "json",
					contentType: "application/json",
					data: JSON.stringify({
						tenant_name: "liuchao",
						dev_snlist:["210235A1CYC153900199"]
					})
				},
				{
					name: "upgradeDevice",
					type: "post",
					url: "/o2oportal/upgradeDevice",
					dataType: "json",
					contentType: "application/json",
					data: JSON.stringify({
						tenant_name: "liuchao",
						dev_sn: "",
						file_size: 0,
						devVersionUrl: ""
					})
				},
				{
					name: "registUser",
					type: "post",
					url: "/o2oportal/sso/registUser",
					dataType: "json",
					contentType: "application/json",
					data: JSON.stringify({
						user_name: "liuchao",
						user_password: "12345678",
						user_phone: "13581549620",
						user_email: "123456@h3c.com",
					})
				},
				{
					name: "modifyPwd",
					type: "post",
					url: "/o2oportal/sso/modifyPwd",
					dataType: "json",
					contentType: "application/json",
					data: JSON.stringify({
						user_name: "liuchao",
						old_password: "12345678",
						new_password: "12345678"
					})
				},
				{
					name: "modifyUser",
					type: "post",
					url: "/o2oportal/sso/modifyUser",
					dataType: "json",
					contentType: "application/json",
					data: JSON.stringify({
						user_name: "liuchao",
						user_password: "12345678",
						user_phone: "13581549620",
						user_email: "13456@h3c.com",
					})
				},
				{
					name: "isExistedUser",
					type: "post",
					url: "/o2oportal/sso/isExistedUser",
					dataType: "json",
					contentType: "application/json",
					data: JSON.stringify({
						user_name: "liuchao",
						user_phone: "13581549620",
						user_email: "123456@h3c.com"
					})
				},
				{
					name: "pushOrder",
					type: "post",
					url: "/o2oportal/mall/pushOrder",
					dataType: "json",
					contentType: "application/json",
					data: JSON.stringify({
						user_name: "liuchao",
						order_info: ""
					})
				},
				{
					name: "refundService",
					type: "post",
					url: "/o2oportal/mall/refundService",
					dataType: "json",
					contentType: "application/json",
					data: JSON.stringify({
						user_name: "liuchao",
						production_id: "",
						production_type: ""
					})
				},
				{
					name: "addDev",
					type: "post",
					url: "/o2oportal/addDev",
					dataType: "json",
					contentType: "application/json",
					data: JSON.stringify({
						user_name: "liuchao",
						dev_sn: "210235A1CYC153900199"
					})	
				},
				{
					name: "addPlace",
					type: "post",
					url: "/o2oportal/addPlace",
					dataType: "json",
					contentType: "application/json",
					data: JSON.stringify({
						user_name: "liuchao",
						dev_sn: "",
						province: "",
						city: "",
						area: "",
						address: "",
						name: "",
						phone: ""
					})
				},
				{
					name: "addSSID",
					type: "post",
					url: "/o2oportal/addSSID",
					dataType: "json",
					contentType: "application/json",
					data: JSON.stringify({
						user_name: "liuchao",
						dev_sn: "",
						ap_snlist: "",
						ssid_name: "",
						hiding: 0,
						policy_status: 1,
					})
				}
			]
		},
		{
			author: "donglicong",
			testList: [
				{
					name: "查询认证模板",
					type: "get",
					url: "/o2oportal/authcfg/query",
					dataType: "json",
					contentType: "application/json",
					data: JSON.stringify({
						authCfgTemplateName: "",
						startRowIndex: "0",
						maxItems: "50",
					})	
				},
				{
					name: "增加认证模板",
					type: "post",
					url: "/o2oportal/authcfg/add",
					data: JSON.stringify({
						authCfgTemplateName: "111",
						authType: 1,
						isEnableSms: 0,
						isEnableWinXin: 0,
						isEnableAli: 0,
						isEnableAccount: 0,
						isEnableQQ: 0,
						authParamList: []
					})	
				},
				{
					name: "修改认证模板",
					type: "post",
					url: "/o2oportal/authcfg/modify",
					data: JSON.stringify({
						authCfgTemplateName: "111",
						authType: 1,
						isEnableSms: 0,
						isEnableWinXin: 0,
						isEnableAli: 0,
						isEnableAccount: 0,
						isEnableQQ: 0,
						authParamList: []
					})
				},
				{
					name: "删除认证模板",
					type: "post",
					url: "/o2oportal/authcfg/delete",
					data: JSON.stringify({
						authCfgTemplateName: "111",
					})
				},
				{
					name: "查询认证模板详细信息",
					type: "get",
					url: "/o2oportal/authcfg/querybyname",
					data: JSON.stringify({
						authCfgTemplateName: "111",
					})
				},
				{
					name: "查询页面模板",
					type: "get",
					url: "/o2oportal/themetemplate/query",
					data: JSON.stringify({
						startRowIndex: 0,
						maxItems: 50,
					})
				},
				{
					name: "增加页面模板",
					type: "post",
					url: "/o2oportal/themetemplate/query",
					data: JSON.stringify({
						themeName: "111",
						description: 10
					})
				},
				{
					name: "修改页面模板",
					type: "post",
					url: "/o2oportal/themetemplate/modify",
					data: JSON.stringify({
						themeName: "111",
						description: 10
					})
				},
				{
					name: "删除页面模板",
					type: "post",
					url: "/o2oportal/themetemplate/delete",
					data: JSON.stringify({
						themeName: "111",
					})
				},
				{
					name: "查询页面模板详细信息",
					type: "get",
					url: "/o2oportal/querybyname",
					data: JSON.stringify({
						themeName: "111"
					})
				},
				{
					name: "查询发布管理",
					type: "get",
					url: "/o2oportal/pubmng/query",
					dataType: "json",
					contentType: "application/json",
					data: JSON.stringify({
						shopName: "liuchao",
						ssidName: "liuchao",
						weixinAccountName: "liuchao",
						authCfgName: "liuchao",
						themeTemplateName: "liuchao",
						description: "liuchao",
						isPublished: 1
					})
				},
				{
					name: "增加发布管理",
					type: "post",
					url: "/o2oportal/pubmng/add",
					data: JSON.stringify({
						name: "liuchao",
						shopName: "liuchao",
						ssidName: "liuchao",
						weixinAccountName: "liuchao",
						authCfgName: "liuchao",
						themeTemplateName: "liuchao",
					})
				},
				{
					name: "修改发布管理",
					type: "post",
					url: "/o2oportal/pubmng/modify",
					data: JSON.stringify({
						name: "liuchao",
						weixinAccountName: "liuchao",
						authCfgName: "liuchao",
						themeTemplate: "liuchao",
					})
				},
				{
					name: "删除发布管理",
					type: "post",
					url: "/o2oportal/pubmng/delete",
					data: JSON.stringify({
						name: "liuchao",
					})
				},
				{
					name: "发布/取消发布",
					type: "post",
					url: "/o2oportal/pubmng/publish",
					data: JSON.stringify({
						name: "liuchao",
						isPublish: false,
					})
				},
				{
					name: "查询发布管理详细信息",
					type: "get",
					url: "/o2oportal/pubmng/querybyname",
					data: JSON.stringify({
						name: "liuchao",
					})
				},
				{
					name: "查询访客",
					type: "get",
					url: "/o2oportal/registuser/query",
					data: JSON.stringify({
						userType: 1,
						userName: "luchao",
						storeName: "liuchao",
						startRowIndex: 0,
						maxItems: 50,
					})
				},
				{
					name: "增加固定账号",
					type: "post",
					url: "/o2oportal/registuser/add"
				}
			]
		}
	]
	initTable(V3TestList, "#V3Test");
	initTable(V2TestList, "#V2Test");
})(jQuery);