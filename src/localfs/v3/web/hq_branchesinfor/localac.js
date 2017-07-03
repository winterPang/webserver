;(function ($)
{

var MODULE_NAME = "hq_branchesinfor.localac";

function getRcText(sRcName)
{
	return Utils.Base.getRcString("localac_rc", sRcName).split(",");
}

function showClient(row, cell, value, columnDef, oRowData,sType)
{
	var nIndex = cell;

	if(sType == "text"||value=="0")
	{
		return value;
	}

	return '<a class="link" href="" localac='+oRowData.localACName+' type="ap" style="color: #008aea;">'+ value +'</a>';
}

// function exportLog()
// {
// 	function exportSuc(data){
// 		// if(data.errorcode == 0)
// 		if(data.retCode==0)
// 		{
// 			$("#exportFile").get(0).src = data.fileName;
// 		}else{
// 			console.log('here is try catch.');
// 		}
// 	}

// 	function exportFail(error){
// 		console.log('Export log file failed: ' + error);  
// 	}
	
// 	var exportOpt = {
// 		url: MyConfig.path+"/fs/exportLocalACsList",
// 		type: "POST",
// 		dataType: "json",
// 		data: {
// 			devSN: FrameInfo.ACSN
// 		},
// 		onSuccess: exportSuc,
// 		onFailed: exportFail
// 	};

// 	Utils.Request.sendRequest(exportOpt);
// }

    function exportLog(){

        function exportSuc(data){
            // if(data.errorcode == 0)
            if(data.retCode==0)
            {
                $("#exportFile").get(0).src = data.fileName;
            }else{
                console.log('here is try catch.');
            }
        }

        function exportFail(error){
          console.log('Export log file failed: ' + error);  
        }
        
        var exportOpt = {
            url: "/v3/fs/exportLocalACsList",
            type: "POST",
            contentType:"application/json",
            dataType: "json",
            data:JSON.stringify({
                devSN: FrameInfo.ACSN,
            }),
            onSuccess: exportSuc,
            onFailed: exportFail
        };

        Utils.Request.sendRequest(exportOpt);
    }

function refreshACList(oData)
{
	var aShowData = [];

	for (var i = 0; i < oData.localACList.length; i++)
	{
		var oACData = oData.localACList[i];
		aShowData.push({
            "localACName":oACData.localACName,
            "localACSN":oACData.localACSN,
            "localACModel":oACData.localACModel,
            "ipv4Addr":oACData.ipv4Addr,
            "location":oACData.location,
            "cntAPCount":oACData.cntAPCount,
            "onlineTime":oACData.onlineTime,
            "runTime":oACData.runTime,
            "bootVersion":oACData.bootVersion,
            "softVersion":oACData.softVersion
		});
	}

	$("#localACList").SList("refresh", {data:aShowData, total:oData.totalCount});
}

function drawLocalACList()
{
	var optLocalACList = {
		colNames : getRcText("LOCALACLIST_HEADER"),
		showHeader: true,
		pageSize : 10,
        showOperation :true,
		asyncPaging :true,
		onPageChange:function(pageNum,pageSize,oFilter,oSorter){
			var valueOfskipnum=(parseInt(pageNum-1))*(parseInt(pageSize));
			var valueOflimitnum=pageSize;

			var oFilterOpt={};
			//升序1、降序-1
			var oSorterhaha={};
			$.extend(oSorterhaha,oSorter);
			if(oSorterhaha.isDesc==true){
				oSorterhaha.isDesc=-1;
			}else if(oSorterhaha.isDesc==false){
				oSorterhaha.isDesc=1;
			}      

			//sortoption对象，如下
			var paiXuObject={};
			paiXuObject[oSorterhaha.name]=oSorterhaha.isDesc;          

			//requestBody,如下
			var guoLvTiaoJian={"findoption":oFilter,"sortoption":paiXuObject};

			var oDataOpt = {
				type:"POST",
				url:MyConfig.path+"/apmonitor/getLocalACList?devSN="+FrameInfo.ACSN+"&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum,
				contentType:"application/json",
				dataType:"json",
				data:JSON.stringify(guoLvTiaoJian),
				onSuccess:refreshACList,
				onFailed:function()
				{
					console.log("Get AC list failed.");
				}
			};

			Utils.Request.sendRequest(oDataOpt);
		},  
		onSearch:function(oFilter,oSorter){
			//dangqianyeshujuyoujitiao000000000000
			var valueOfskipnum=0;
			var valueOflimitnum=10;
			
			//升序1、降序-1
			var oSorterhaha={};
			$.extend(oSorterhaha,oSorter);
			if(oSorterhaha.isDesc==true){
				oSorterhaha.isDesc=-1;
			}else if(oSorterhaha.isDesc==false){
				oSorterhaha.isDesc=1;
			}      

			//sortoption对象，如下
			var paiXuObject={};
			paiXuObject[oSorterhaha.name]=oSorterhaha.isDesc;          

			//requestBody,如下
			var guoLvTiaoJian={"findoption":oFilter,"sortoption":paiXuObject};                

			//发送请求
			var oDataOpt = {
				type:"POST",
				url:MyConfig.path+"/apmonitor/getLocalACList?devSN="+FrameInfo.ACSN+"&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum,
				contentType:"application/json",
				dataType:"json",
				data:JSON.stringify(guoLvTiaoJian),
				onSuccess:refreshACList,
				onFailed:function()
				{
					console.log("Get AC list failed.");
				}
			};

			Utils.Request.sendRequest(oDataOpt);
		},
		onSort:function(sName,isDesc){
			//dangqianyeshujuyoujitiao000000000000
			var valueOfskipnum=0;
			var valueOflimitnum=10;                

			//升序1、降序-1
			var shunxu=isDesc;
			if(shunxu==true){
				shunxu=-1;
			}else if(shunxu==false){
				shunxu=1;
			}else{
				console.log('here is try catch.');
			}

			//sortoption对象，如下                
			var paiXuObject={};
			paiXuObject[sName]=shunxu;

			//requestBody,如下
			var guoLvTiaoJian={"findoption":{},"sortoption":paiXuObject};

			//发送请求
			var oDataOpt = {
				type:"POST",
				url:MyConfig.path+"/apmonitor/getLocalACList?devSN="+FrameInfo.ACSN+"&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum,
				contentType:"application/json",
				dataType:"json",
				data:JSON.stringify(guoLvTiaoJian),
				onSuccess:refreshACList,
				onFailed:function()
				{
					console.log("Get AC list failed.");
				}
			};

			Utils.Request.sendRequest(oDataOpt);
		},             
		colModel : [
			{name : "localACName",datatype : "String"},
			{name : "localACSN",datatype : "String"},
			{name : "localACModel",datatype : "String"},
			{name : "onlineTime",datatype : "String"},
			{name : "ipv4Addr",datatype : "String"},
			{name : "location",datatype : "String"},
			{name : "cntAPCount",datatype : "String",formatter:showClient}
		],
		buttons : [
			{name : "ac_export", enable:true, value:getRcText('EXPORT_BUTTON'), action:exportLog},
			{name : "detail", enable : true, action : showDetail}
		]
	};

	function showDetail(){
		var oRowData = arguments[0][0];

		$("#version").html(oRowData.softVersion||"");
		$("#boot_id").html(oRowData.bootVersion||"");
		$("#starttime").html(oRowData.runTime||0);
		$("#AssoIp").html(oRowData.assoIp);
		Utils.Base.openDlg(null, {}, {
			scope : $("#localACDetailDlg"),
			className : "modal-super"
		});
	}

	$("#localACList").SList("head", optLocalACList);

	// var aData = [
	// 	{
	// 		"localACName" : "AC01",
	// 		"localACSN" : "SN210",
	// 		"localACModel" : "wx3510H",
	// 		"ipv4Addr" : "192.168.1.1",
	// 		"onlineTime" : "999月999天999时999分999秒",
	// 		"location" : "北京 回龙观东大街",
	// 		"cntAPCount" : 9,
	// 		"version":"B64D012",
	// 		"bootVersion":"5.4",
	// 		"runTime":"999月999天999时999分999秒",
	// 		//"assoIp":"10.12.13.14"
	// 	}
	// ];

	// $("#localACList").SList("refresh", aData);
}
// {
//     "totalCount":"Number,本地AC总数",
//     "leftCount":"Number,剩余数量",
//     "localACList":[
//         {
//             "localACName":"String,本地AC名称",
//             "localACSN":"String,本地AC序列号",
//             "localACModel":"String,本地AC型号",
//             "status":"Number,本地AC状态,0-离线,1-在线,2-版本下载",
//             "ipv4Addr":"String,本地ACIPV4地址",
//             "ipv6Addr":"String,本地ACIPV6地址",
//             "controlIpv4Addr":"String,控制ACIPV4地址",
//             "controlIpv6Addr":"String,控制ACIPV6地址",
//             "location":"String,归属地，可能是未知的",
//             "cntAPCount":"Number,关联AP数量",
//             "onlineTime":"Number,在线时长",
//             "runTime":"Number,本地AC设备运行时长",
//             "bootVersion":"Number,boot版本号",
//             "softVersion":"Number,版本号"
//         }
//     ]
// }
function initGrid()
{
	drawLocalACList();
}

function initForm()
{
	$("#guanbi").on("click", function()
	{
        Utils.Pages.closeWindow(Utils.Pages.getWindow($("#localACDetailDlg")));
     });

	$("#localACList").on('click','[type = "ap"]',function(){
		if($(this).html() != 0)
		{
			Utils.Base.openDlg("hq_branchesinfor.view_aps",{"type":2, "name":$(this).attr("localac")},{scope:$("#maoxian"), className:"modal-super dashboard"});
		}
		return false;
	});
}

function initData()
{
	var valueOfskipnum=0;
	var valueOflimitnum=10;                

	//requestBody,如下
	var guoLvTiaoJian={"findoption":{},"sortoption":{}};

	//发送请求
	var oDataOpt = {
		type:"POST",
		url:MyConfig.path+"/apmonitor/getLocalACList?devSN="+FrameInfo.ACSN+"&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum,
		contentType:"application/json",
		dataType:"json",
		data:JSON.stringify(guoLvTiaoJian),
		onSuccess:refreshACList,
		onFailed:function()
		{
			console.log("Get AC list failed.");
		}
	};

	Utils.Request.sendRequest(oDataOpt);
}

function _init()
{
	initGrid();
	initForm();
	initData();
}

function _destroy()
{
	Utils.Request.clearMoudleAjax(MODULE_NAME);
}

Utils.Pages.regModule(MODULE_NAME, {
	"init" : _init,
	"destroy" : _destroy,
	"widgets" : ["SList", "Form"],
	"utils" : ["Base", "Request"]
});

})( jQuery );