define(["utils"], function (Utils) {
return ["$scope", "$http", "$alertService", function ($scope, $http, $alert) {

// Code Start

function getRcString(attrName){
            return Utils.getRcString("RC",attrName);
        }

		
$scope.options={     //模态框
		mId:'apgroup',
        title:'客户端',                          
        autoClose: true,  
        showCancel: false,     
        buttonAlign: "center",
        modalSize:'lg',                  
        okHandler: function(modal,$ele){       
        },
        cancelHandler: function(modal,$ele){
        },
        beforeRender: function($ele){
			return $ele;
		}
    };
var aTemplate=[];
function ClientChoose() {   //获取表格SLIST信息  ajax 请求 目前没有数据
    var GetCliOpt = $http({
        url: "/v3/measureserver/getclientlist",  
        method: "GET",
        params:{
			'devSN':$scope.sceneInfo.sn,
		},
	});
    GetCliOpt.success(function(data){
        aTemplate.length=0;
        var aSignalStrength=[];
        var aClientList = data.clientList||[];
        aClientList.forEach(function(client){
            aTemplate.push({
                MacAddress: client["clientMAC"],
                Ipv4Address: client["clientIP"]|| "0.0.0.0",
                Ssid: client["clientSSID"],
                ApName: client["ApName"],
                clientVendor: client["clientVendor"],
                WirelessMode: client["clientName"],
                IsMeasure: client["measurecap"] || []
            });

        });
			apgroup_table();
			$scope.$broadcast('show#apgroup'); //弹出模态框
    });
    GetCliOpt.error(function (err) {
        console.log('Get client list ' + err.statusText);    
	});
}
function apgroup_table()    //建立表格表头 及其数据
{	
	$scope.apgroup_table = {      //表格 表头 及其数据
			tId:'apgroup_table',
			pageSize:5,
			pageList:[5,10],
			columns: [       
				{sortable:true, field: 'MacAddress', title:'MAC地址' },
				{sortable: true, field: 'Ipv4Address', title:'IP地址'},
				{sortable: true, field: 'Ssid', title: '无线服务'},
				{sortable: true, field: 'ApName', title:'AP'},
				{sortable: true, field: 'clientVendor', title:'终端厂商'},
				{sortable: true, field: 'WirelessMode', title:'终端类型'}, 
			],
			data:aTemplate,
			
			//data:[{MacAddress:"28e3-1f56-55f6",Ipv4Address:"192.168.161.145",Ssid:"portal_ad",ApName:"ap1",clientVendor:"小米",WirelessMode:"OnePlus One"}]
	   };
		$scope.$on('click-row.bs.table#apgroup_table', function (e,data) {  //行点击
			$scope.$apply(function(){$scope.macnr=data.MacAddress;});
			$scope.$broadcast('hide#apgroup'); 
	  });
}
$scope.choose=function ()  //筛选  点击 显示模态框和表格
{
	ClientChoose();	
}

/**********************RFPing************************/

function addMeasureReport(clientInfo){       //    WRRM   功能已经写完  但是还没有测试
    var support = false;
    var th, tr, td1, td2;
    var tblText = [
        ["Linkmargin", "linkMargin"," dbm", -128, "Link measurement:"],
        ["RCPI", "RCPI", " dbm", -128, "Link measurement:"],
        ["RSNI", "RSNI", " dbm", -128, "Link measurement:"],
        ["AntennaID", "antenId", "", 0, "Noise histogram:"],
        ["ANPI", "ANPI", " dbm", -128, "Noise histogram:"],
        ["IPI0210", "IPI", "", [0,0,0,0,0,0,0,0,0,0,0], "Noise histogram:"],
        ["Transmitpower", "txmtPower", " dbm", -128, "Spectrum measurement:"],
        ["BSS", "BSS", "", 0, "Spectrum measurement:"],
        ["OFDM", "OFDMPreamble", "", 0, "Spectrum measurement:"],
        ["Radar", "radar", "", 0, "Spectrum measurement:"],
        ["Unsignal", "unidetifiedSignal", "", 0, "Spectrum measurement:"],
        ["CCA", "CCA", "%", 65535, "Spectrum measurement:"],
        ["RPI027", "RPI", "", [0,0,0,0,0,0,0,0], "Spectrum measurement:"],
        ["BSSID", "BSSID", "", "0000-0000-0000", "Frame report entry:"],
        ["PHY", "phyType", "", 0, "Frame report entry:"],
        ["AverageRCPI", "averRCPI", " dbm", 0, "Frame report entry:"],
        ["LastRSNI", "lastRSNI", " dbm", 0, "Frame report entry:"],
        ["LastRCPI", "lastRCPI", " dbm", 0, "Frame report entry:"],
        ["Frames", "frameCount", "", 0, "Frame report entry:"],
        ["AveAc", "APAverAccDelay", " ms", "", "BSSAverageAccessDelay:"],
        ["Be", "averAccDelayBE", " ms", "", "BSSAverageAccessDelay:"],
        ["Bk", "averAccDelayBK", " ms", "", "BSSAverageAccessDelay:"],
        ["Vi", "averAccDelayVI", " ms", "", "BSSAverageAccessDelay:"],
        ["Vo", "averAccDelayVO", " ms", "", "BSSAverageAccessDelay:"],
        ["QosClients", "staCnt", "", "", "BSSAverageAccessDelay:"],
        ["Channelutilizationrate", "chlUtilize", "", "", "BSSAverageAccessDelay:"],
        ["TrafficID", "tid", "", 15, "Transmit stream:"],
        ["SentMSDUs", "transMSDUCnt", "", 4294967295, "Transmit stream:"],
        ["DiscardedMSDUs", "MSDUDiscardCnt", "", 4294967295, "Transmit stream:"],
        ["FailedMSDUs", "MSDUFailCnt", "", 4294967295, "Transmit stream:"],
        ["MSDUsTimes", "MSDUMulRetryCnt", "", 4294967295, "Transmit stream:"],
        ["LostQoSCFPolls", "qosLostCnt", "", 4294967295, "Transmit stream:"],
        ["Averagequeuedelay", "averQueDelay", " ms", 4294967295, "Transmit stream:"],
        ["Averagetransmitdelay", "averTransDelay", " ms", 4294967295, "Transmit stream:"],
        ["Bin0rangePolls", "bin0Range", "", 255, "Transmit stream:"],
        ["Bin025", "Bin0Bin5", "", [4294967295,4294967295,4294967295,4294967295,4294967295,4294967295], "Transmit stream:"]
    ];
	
	for (i = 0; i < tblText.length; i++) {  
        var name = "clientInfo." + tblText[i][1];
        var temp =$scope.$eval(name);  //取出key值  也就是具体的值  显示在位置ax2  bx2  cx2 上
        if ((undefined != temp) && (temp.toString() != tblText[i][3].toString())) { //判断是否是默认值 是就什么都不做 不是才显示
		if(($scope.measureResult="")||($scope.measureResult!=tblText[i][4]))
			{
				$scope.measureResult_table_show=true;
				$scope.measureResult=tblText[i][4];
			}
			$scope.measureResult_table_show=true;
			$scope[tblText[i][0]+"_show"]=true;
			$scope[tblText[i][0]]=temp+tblText[i][2];
			support = true;    //标志位
        }
		if(true != support) {
			if((1 === clientInfo.moduleSwitch) && (1 === clientInfo.measureSwitch)) {
				if ((0 === clientInfo.specMgtStaCap) || (0 === clientInfo.rdMeaStaCap)) {
					$scope.measureResult="该终端不支持测量或未重新上线";
				}else{
					$scope.measureResult="未获取到测量信息";
				}
			}else{
				if(undefined !== clientInfo.moduleSwitch){
					$scope.measureResult="设备测量开关尚未打开";
				}else{
					$scope.measureResult="未获取到测量信息";
				}
			}

		}
	}
	
}

function rfpingErrorPrint(errorCode){   //rf错误代码处理  已经angular JS 处理完成
    switch (errorCode)
    {
        case 1:
            $scope.rfpingFailedInfo="RFPing failed : Failed to get the link test result.";
            break;
        case 2:
            break;
        case 3:
            $scope.rfpingFailedInfo="RFPing failed : Failed to reach the client.";
            break;
        case 4:
            $scope.rfpingFailedInfo="RFPing failed : Link test timer expired.";
            break
        case 5:
            $scope.rfpingFailedInfo="RFPing failed : The radio is testing another link, Please try again later.";
            break;
        case 6:
            $scope.rfpingFailedInfo="RFPing failed : The client is in sleep mode. Please try again later.";
            break;
        case 7:
            break;
        case 8:
            $scope.rfpingFailedInfo="RFPing failed : The radio does not support this feature";
            break;
        default :
            $scope.rfpingFailedInfo="RFPing failed : Failed to get the link test result.";
            break;
    }
    $scope.rfpingFailedInfo_show=true;
}
/*
function rfpingInfoProc(rfpingInfo) {
    var lineIndex = "";
    var nssLine = "";
    var privNss = null;
    var curNss = null;
    var resultTable = "";
    var rfpingData;

    switch (rfpingInfo.StaMode) {
        case 1://11a
        case 2://11b
        case 4://11g
            nssLine = "<tr><hr /></tr>";//这条线在哪里
            break;
        case 8://11gn
        case 32://11ac
            lineIndex = "McsIdx";
            nssLine = "<tr><hr /></tr>";  //这条线在哪里
            break;
        case 64://11ac
            lineIndex = "VhtMcsIdx";
            nssLine += "<tr>" +"<td colspan=\"7\">" + "<hr />" + "NSS=" + i + "<hr />" + "</td>" +"</tr>";//这些事要放在哪里的
            break;
        default :
            break;
    }

    rfpingData = rfpingInfo.Rfping;
    rfpingData.forEach(function (item, j) {
        if (lineIndex) {
            if (0 == item[lineIndex]) {
                resultTable += nssLine;
            }
            resultTable += "<tr><td>" + item[lineIndex] + "</td>";
        } else {
            if (0 == j) {
                resultTable += nssLine;
            }
            resultTable += "<tr><td>" + j + "</td>";
        }
        resultTable += "<td>" + item.TxRate + "</td>";
        resultTable += "<td>" + item.TxPktCnt + "/" + item.RxPktCnt + "</td>";
        resultTable += "<td>" + item.Rssi + "</td>";
        resultTable += "<td>" + item.Rtt + "</td>";
        resultTable += "</tr>";

    });

    return resultTable;
}
*/
var onceRfpingTime = null;
var rfpingStartTime = null;
function getRfpingData(mac) {   //重复发请求
    var rcvData;
    var acSN = $scope.sceneInfo.sn;
    onceRfpingTime = new Date().getTime();
    if (!rfpingStartTime) {
        rfpingStartTime = onceRfpingTime;
    }
	
    var RFPingOpt = $http({
        url: '/v3/ant/confmgr',
		timeout: 5000,
        method: "POST",
        data:{
			configType: 0,
			devSN: acSN,
			cloudModule: "stamonitor",
			deviceModule: "stamgr",
			method: 'StaRFPingQuery',
			param: [{clientMAC: mac}]
		}	
	});
		RFPingOpt.success(function(data){
		if("success" !== data.communicateResult) {
                $scope.rfpingFailedInfo="RFPing failed : " + data.reason;
                $scope.rfpingFailedInfo_show=true;
                return;
            }
            if(0 === data.deviceResult.length)
            {
                $scope.rfpingFailedInfo="RFPing failed : " + data.reason;
                $scope.rfpingFailedInfo_show=true;
                return ;
            }
            rcvData = data.deviceResult[0];
            if (rcvData.ErrCode === 4) {
                var nowTime = new Date().getTime();
                var onceUseTime = nowTime - onceRfpingTime;
                var allUseTime = nowTime - rfpingStartTime;

                if (allUseTime > 10000) {
                    rfpingStartTime = null;
                    $scope.rfpingFailedInfo="RFPing failed : timeout";
                    $scope.rfpingFailedInfo_show=true;
                }
                else if (onceUseTime < 1000) {
                    setTimeout(getRfpingData, 1000-onceUseTime, mac);
                }
                else {
                   getRfpingData(mac);
                }
            }
            else {
                rfpingStartTime = null;

                if (rcvData.ErrCode == 0) {
                   $scope.rfpingResult=$scope.rfpingTitle;
				   $scope.items=rcvData.Rfping;
				$scope.remove = function (index) {
					$scope.items.splice(index, 1);
				};
					
					
                   // $("#rfpingResult").append(rfpingInfoProc(rcvData));//数据处理与显示
                    $scope.rfpingResult_show=true;
                }
                else {
                    $scope.rfpingFailedInfo="RFPing  MAC : " + mac ;
                    $scope.rfpingFailedInfo_show=true;
                    rfpingErrorPrint(rcvData.ErrCode);
                }
            }	
		})
		RFPingOpt.error(function(err)
		{
			console.log('RFPing ' + err.statusText);
            rfpingStartTime = null;
            $scope.rfpingFailedInfo="RFPing Error MAC:" + mac;
            $scope.rfpingFailedInfo_show=true;	
		})  
}

function startRfping(mac){    //RF
    var acSN =$scope.sceneInfo.sn;
    $scope.rfpingResult_show=false;
    $scope.rfpingFailedInfo_show=false;

	var startRfpingOpt = $http({
		url:"/v3/ant/confmgr",
        timeout : 10000,
        method:"POST",
        data: {
        configType: 0,
        devSN: acSN,
        cloudModule: "stamonitor",
        deviceModule: "stamgr",
        method: 'StaRFPingStart',
        param: [{clientMAC: mac}]
    }
	});
		startRfpingOpt.success(function(data){
			console.log("RFPing Start Data : " + JSON.stringify(data));
				if("success" === data.communicateResult) {
					
					if( 2 === data.deviceResult[0].ErrCode)
					{	
						getRfpingData(mac);
					}
					else
					{
						rfpingErrorPrint(data.deviceResult[0].ErrCode);
					}
				}
				else {
					$scope.rfpingFailedInfo="RFPing failed : " + data.reason;
					$scope.rfpingFailedInfo_show=true;
				}	
		}) ,
		startRfpingOpt.error(function(err){
			console.log('startRfping ' + err.statusText);
            $scope.rfpingFailedInfo="RFPing Error MAC:" + mac;
            $scope.rfpingFailedInfo_show=true;	
		})
}



function sendCfgMaintain(ipAddress){
    if (ipAddress === undefined){
        $scope.maintainpingFailedInfo="AC Ping failed : Get AP Information failed.";
        $scope.maintainpingFailedInfo_show=true;
        return;
    }
    $scope.maintainpingFailedInfo="AC Ping : The results are being obtained, please wait.";
    $scope.maintainpingFailedInfo_show=true;
	var MaintainOpt = $http({
		url:"/v3/ant/confmgr",
        dataType:"json",
        method:"POST",
        data: {
            cfgTimeout: 25,
            configType: 0,
            devSN: $scope.sceneInfo.sn,
            cloudModule: "maintain",
            deviceModule: "maintain",
            method: 'cmppingtime',
            param: {apip:ipAddress}
		}
	})
	MaintainOpt.success(function(data){
		if("success" !== data.communicateResult) {
                $scope.maintainpingFailedInfo="AC Ping failed : device not response, timeout．";
                $scope.maintainpingFailedInfo_show=true;

                return;
            }
            if(0 === data.deviceResult.length)
            {
                $scope.maintainpingFailedInfo="AC Ping failed : Get ping results failed．";
                $scope.maintainpingFailedInfo_show=true;

                return ;
            }
            $scope.maintainpingContent_show=true;
            $scope.maintainpingFailedInfo_show=false;
            var recvData = data.deviceResult[0];
            try{
                $scope.maintainpingResult=$scope.maintainpingTitle;
               $("#maintainpingResult").append(maintainpingInfoProc(recvData));
                $scope.maintainpingResult_show=true;

                $scope.maintainpingAvgResult=$scope.maintainpingAvgTitle;    
                $("#maintainpingAvgResult").append(maintainpingAvgInfoProc(recvData));  
                $scope.maintainpingAvgResult_show=true;
				
            }catch(exception){

            }	
	}),
    MaintainOpt.err(function(err){
		$scope.maintainpingFailedInfo="AC Ping failed : Get ping results failed．.";
        $scope.maintainpingFailedInfo_show=true;	
	})      
}
function maintainpingAvgInfoProc(recvData){   //数据处理  AC-PING-AP(ms) AC-PING-WEB(ms)
    var resultTable = "";

    var pingapavgtime = recvData.pingapavgtime;
    var pingwebavgtime = recvData.pingwebavgtime;
    if(pingapavgtime == 5000)
    {
        pingapavgtime = 'timeout';
    }
    if(pingwebavgtime == 5000)
    {
        pingwebavgtime = 'timeout';
    }
	debugger;
    resultTable += "<tr>";
    resultTable += "<td>" + pingapavgtime + "</td>";
    resultTable += "<td>" + pingwebavgtime + "</td>";
    resultTable += "</tr>";

    return resultTable;
}

function maintainpingInfoProc(recvData){  //数据处理 average(ms) average(ms)
    var resultTable = "";

    for(var i =0; i < recvData.pingtime.length;i++){
        var pingaptime = recvData.pingtime[i].pingaptime;
        var pingwebtime = recvData.pingtime[i].pingwebtime;
        if(pingaptime == 5000)
        {
            pingaptime = 'timeout';
        }
        if(pingwebtime == 5000)
        {
            pingwebtime = 'timeout';
        }
		debugger;
        resultTable += "<tr>";
        resultTable += "<td>" + pingaptime + "</td>";
        resultTable += "<td>" + pingwebtime + "</td>";
        resultTable += "</tr>";
    }

    return resultTable;
}
function getApName(mac,callback){
    $scope.maintainpingResult_show=false;
    $scope.maintainpingAvgResult_show=false;
    $scope.maintainpingFailedInfo_show=false;
    var staOpt = $http({
		url:"/v3/stamonitor/web/stationlist",
        method:"GET",	
		params:{"devSN":$scope.sceneInfo.sn}
	});
    staOpt.success(function(staResult){
		var apName;
			try{
				if (undefined != staResult) {
					var client = staResult.clientList;
					for(var i =0; i <client.length;i++){
						if( mac == client[i].clientMAC){
							apName = client[i].ApName;
							break;
						}
					}
				}
			}catch(exception){

			}
			 callback(apName)	
	}),
	staOpt.error(function(err){
		$scope.maintainpingFailedInfo="AC Ping failed : Get client information failed.";
        $scope.maintainpingFailedInfo_show=true;	
	})
}

function ProcMeasureClick(mac){
	var rcvData;
	var acSN = $scope.sceneInfo.sn;
    console.log('11k measure MAC: '+ mac);
	$scope.Test11kTitleResult="请稍候……";
	
	
	var MeaOpt=$http({  //好使一半啦   //RM   RF RF写完后要放开
        url:"/v3/ant/confmgr",
        timeout: 10000,
        //dataType:"json",
        method:"POST",
        data: {
            configType: 0,
            devSN: acSN,
            cloudModule: "stamonitor",
            deviceModule: "stamgr",
            method: 'wrrmGetMeaRpt',
            param: [{clientMAC: mac}],
        }
	});
		MeaOpt.success(function(data)
        {
            $scope.Test11kTitleResult="MAC Address: " + mac;
            if("success" === data.communicateResult) {
                if (0 == data.deviceResult.length) {
                   $scope.measureResult="未找到该终端的信息";   
                }
                else {
                    if (data.deviceResult[0].result) {
                        rcvData = JSON.parse(data.deviceResult[0].result);
                        if(rcvData){
							addMeasureReport(rcvData);    
                        }
                    }
                }
                console.log(data);
            }
            else{
					$scope.Test11kTitleResult="Error: " + data.reason;
            }
        }),
        MeaOpt.error(function(data)
        {
            console.log('Measure ' + data.statusText);
        })
  
    startRfping(mac);//RFPing
	
	 getApName(mac,function(apName){   //ACping
	 
        if (apName === undefined){
            $scope.maintainpingFailedInfo="AC Ping failed : Get client information failed.";
            $scope.maintainpingFailedInfo_show=true;
            return;
        }
		 var ipOpt=$http({
			url:"/v3/apmonitor/web/aplist",
            method:"GET",
			params:{'devSN':$scope.sceneInfo.sn}
		 });
		 
		 
		ipOpt.success(function(apResult){
			var ipAddress;
            try {
                if (apResult.apList.length != 0) {
                    for (var i = 0; i < apResult.apList.length; ++i) {
                        if (apResult.apList[i].apName == apName) {
                            ipAddress = apResult.apList[i].ipv4Addr;
                            break;
                        }
                    }
                }
                sendCfgMaintain(ipAddress);  //未知
            }
            catch(exception){
            }	
		}),
        ipOpt.error(function(err){
			$scope.maintainpingFailedInfo="AC Ping failed : Get AP information failed.";
            $scope.maintainpingFailedInfo_show=true;	
		})
	})
	
    
}


function ProcBtnClick()    //判断输入的数据是否正确   好使
{
	var inputMac=$scope.macnr;
	var reg = /[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}/;
    $scope.measureResult="";
	$scope.Test11kTitleResult="";
	$scope.rfpingResult_show=false;
    $scope.rfpingFailedInfo_show=false;
    $scope.maintainpingResult_show=false;
    $scope.maintainpingAvgResult_show=false;
    $scope.maintainpingFailedInfo_show=false;
	if(inputMac.match(reg)){      //如果输入了正确的MAC地址
        ProcMeasureClick(inputMac);   
    }
    else{
        $scope.Test11kTitleResult="请输入正确的MAC地址:xxxx-xxxx-xxxx";
    }
}

$scope.measure=function ()  //测量按钮
{

	ProcBtnClick();
}

}];
});