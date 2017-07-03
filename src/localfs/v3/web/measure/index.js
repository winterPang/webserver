function isArr(arr){
    return Object.prototype.toString.call(arr) === '[object Array]';
}

function addMeasureReport(clientInfo){
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
        var temp = eval(name);

        if ((undefined != temp) && (temp.toString() != tblText[i][3].toString())) {
            if(0 == eval("document.getElementsByName('" + tblText[i][4] + "')").length){
                th = $("<th name='" + tblText[i][4] + "'>" + tblText[i][4] + "</th>");
                $("#measureResult").append(th);
            }
            tr = $('<tr></tr>');
            td1 = $('<td>' + tblText[i][0] + '</td>');
            td2 = $('<td class="Data11k">' + temp + tblText[i][2] + '</td>');

            $(tr).append(td1, td2);
            $("#measureResult").append(tr);

            support = true;
        }
    }

    if(true != support) {
        if((1 === clientInfo.moduleSwitch) && (1 === clientInfo.measureSwitch)) {
            if ((0 === clientInfo.specMgtStaCap) || (0 === clientInfo.rdMeaStaCap)) {
                $("#measureResult").text("该终端不支持测量或未重新上线");
            }else{
                $("#measureResult").text("未获取到测量信息");
            }
        }else{
            if(undefined !== clientInfo.moduleSwitch){
                $("#measureResult").text("设备测量开关尚未打开");
            }else{
                $("#measureResult").text("未获取到测量信息");
            }
        }

    }
}

function ProcMeasureClick(mac){
    var rcvData;
    var acSN = FrameInfo.ACSN;
    console.log('11k measure MAC: '+ mac);

    $("#Test11kTitleResult").text("请稍候……");

    var MeaOpt = {
        url:"/v3/ant/confmgr",
        timeout : 10000,
        dataType:"json",
        type:"post",
        data: {
            configType: 0,
            devSN: acSN,
            cloudModule: "stamonitor",
            deviceModule: "stamgr",
            method: 'wrrmGetMeaRpt',
            param: [{clientMAC: mac}]
        },
        onSuccess:function (Data)
        {
            $("#Test11kTitleResult").text("MAC Address: " + mac);
            if("success" === Data.communicateResult) {
                if (0 == Data.deviceResult.length) {
                    $("#measureResult").text("未找到该终端的信息");
                }
                else {
                    if (Data.deviceResult[0].result) {
                        rcvData = JSON.parse(Data.deviceResult[0].result);
                        if(rcvData){
                            addMeasureReport(rcvData);
                        }
                    }
                }
                console.log(Data);
            }
            else{
                $("#Test11kTitleResult").text("Error: " + Data.reason);
            }
        },
        onFailed: function(err)
        {
            console.log('Measure ' + err.statusText);
        }
    };

    getApName(mac,function(apName){
        if (apName === undefined){
            $("#maintainpingFailedInfo").text("AC Ping failed : Get client information failed.");
            $("#maintainpingFailedInfo").show();
            return;
        }
        var ipOpt = {
            url:MyConfig.path +"/apmonitor/web/aplist?devSN=" + FrameInfo.ACSN,
            type:'get',
            dataType:'json',
            onSuccess:getApListSuc,
            onFailed:getApListFail
        };

           Utils.Request.sendRequest(ipOpt);

        function getApListSuc(apResult){
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
                sendCfgMaintain(ipAddress);
            }
            catch(exception){

            }
        }

        function getApListFail(){
            $("#maintainpingFailedInfo").text("AC Ping failed : Get AP information failed.");
            $("#maintainpingFailedInfo").show();
        }
    });

    Utils.Request.sendRequest(MeaOpt);
    startRfping(mac);
}

function maintainpingAvgInfoProc(recvData){
    var resultTable = "";

    var pingapavgtime = recvData.pingapavgtime;
    var pingwebavgtime = recvData.pingwebavgtime;
    /*接口返回5000表示超时*/
    if(pingapavgtime == 5000)
    {
        pingapavgtime = 'timeout';
    }
    if(pingwebavgtime == 5000)
    {
        pingwebavgtime = 'timeout';
    }

    resultTable += "<tr>";
    resultTable += "<td>" + pingapavgtime + "</td>";
    resultTable += "<td>" + pingwebavgtime + "</td>";
    resultTable += "</tr>";

    return resultTable;
}

function maintainpingInfoProc(recvData){
    var resultTable = "";

    for(var i =0; i < recvData.pingtime.length;i++){
        var pingaptime = recvData.pingtime[i].pingaptime;
        var pingwebtime = recvData.pingtime[i].pingwebtime;
        /*接口返回5000表示超时*/
        if(pingaptime == 5000)
        {
            pingaptime = 'timeout';
        }
        if(pingwebtime == 5000)
        {
            pingwebtime = 'timeout';
        }
        resultTable += "<tr>";
        resultTable += "<td>" + pingaptime + "</td>";
        resultTable += "<td>" + pingwebtime + "</td>";
        resultTable += "</tr>";
    }

    return resultTable;
}

function sendCfgMaintain(ipAddress){
    if (ipAddress === undefined){
        $("#maintainpingFailedInfo").text("AC Ping failed : Get AP Information failed.");
        $("#maintainpingFailedInfo").show();
        return;
    }
    $("#maintainpingFailedInfo").text("AC Ping : The results are being obtained, please wait...");
    $("#maintainpingFailedInfo").show();

    var MaintainOpt = {
        url:MyConfig.path +"/ant/confmgr",
        dataType:"json",
        type:"post",
        data: {
            cfgTimeout: 25,
            configType: 0,
            devSN: FrameInfo.ACSN,
            cloudModule: "maintain",
            deviceModule: "maintain",
            method: 'cmppingtime',
            param: {apip:ipAddress}
        },
        onSuccess:function (data)
        {
            /* 增加渲染或数据库操作 */
            if("success" !== data.communicateResult) {
                $("#maintainpingFailedInfo").text("AC Ping failed : device not response, timeout．");
                //$("#maintainpingFailedInfo").show();

                return;
            }
            if(0 === data.deviceResult.length)
            {
                $("#maintainpingFailedInfo").text("AC Ping failed : Get ping results failed．");
                //$("#maintainpingFailedInfo").show();

                return ;
            }
            $("#maintainpingContent").show();
            $("#maintainpingFailedInfo").hide();
            var recvData = data.deviceResult[0];
            try{
                $("#maintainpingResult").html($("#maintainpingTitle"));
                $("#maintainpingResult").append(maintainpingInfoProc(recvData));
                $("#maintainpingResult").show();

                $("#maintainpingAvgResult").html($("#maintainpingAvgTitle"));
                $("#maintainpingAvgResult").append(maintainpingAvgInfoProc(recvData));
                $("#maintainpingAvgResult").show();
            }catch(exception){

            }


        },
        onFailed: function()
        {
            $("#maintainpingFailedInfo").text("AC Ping failed : Get ping results failed．.");
            $("#maintainpingFailedInfo").show();
        }
    };
        Utils.Request.sendRequest(MaintainOpt);
}

function rfpingErrorPrint(errorCode){
    switch (errorCode)
    {
        case 1:
            $("#rfpingFailedInfo").text("RFPing failed : Failed to get the link test result.");
            break;
        case 2:
            break;
        case 3:
            $("#rfpingFailedInfo").text("RFPing failed : Failed to reach the client.");
            break;
        case 4:
            $("#rfpingFailedInfo").text("RFPing failed : Link test timer expired.");
            break
        case 5:
            $("#rfpingFailedInfo").text("RFPing failed : The radio is testing another link, Please try again later.");
            break;
        case 6:
            $("#rfpingFailedInfo").text("RFPing failed : The client is in sleep mode. Please try again later.");
            break;
        case 7:
            break;
        case 8:
            $("#rfpingFailedInfo").text("RFPing failed : The radio does not support this feature");
            break;
        default :
            $("#rfpingFailedInfo").text("RFPing failed : Failed to get the link test result.");
            break;
    }
    $("#rfpingFailedInfo").show();
}
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
            nssLine = "<tr><hr /></tr>";
            break;
        case 8://11gn
        case 32://11ac
            lineIndex = "McsIdx";
            nssLine = "<tr><hr /></tr>";
            break;
        case 64://11ac
            lineIndex = "VhtMcsIdx";
            nssLine += "<tr>" +
                "<td colspan=\"7\">" + "<hr />" + "NSS=" + i + "<hr />" + "</td>" +
                "</tr>";
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

var onceRfpingTime = null;
var rfpingStartTime = null;
function getRfpingData(mac) {
    var rcvData;
    var acSN = FrameInfo.ACSN;
    var sendData = {
        configType: 0,
        devSN: acSN,
        cloudModule: "stamonitor",
        deviceModule: "stamgr",
        method: 'StaRFPingQuery',
        param: [{clientMAC: mac}]
    };
    onceRfpingTime = new Date().getTime();
    if (!rfpingStartTime) {
        rfpingStartTime = onceRfpingTime;
    }

    var RFPingOpt = {
        url: '/v3/ant/confmgr',
        type: 'post',
        data: sendData,
        dataType:'json',
        timeout: 5000,
        onSuccess: function(data,status) {
            //console.log('RFPing query response:' + JSON.stringify(data));

            if("success" !== data.communicateResult) {
                $("#rfpingFailedInfo").text("RFPing failed : " + data.reason);
                $("#rfpingFailedInfo").show();

                return;
            }
            if(0 === data.deviceResult.length)
            {
                $("#rfpingFailedInfo").text("RFPing failed : " + data.reason);
                $("#rfpingFailedInfo").show();

                return ;

            }
            rcvData = data.deviceResult[0];
            if (rcvData.ErrCode === 4) {
                var nowTime = new Date().getTime();
                var onceUseTime = nowTime - onceRfpingTime;
                var allUseTime = nowTime - rfpingStartTime;

                if (allUseTime > 10000) {
                    rfpingStartTime = null;
                    $("#rfpingFailedInfo").text("RFPing failed : timeout");
                    $("#rfpingFailedInfo").show();
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
                    $("#rfpingResult").html($("#rfpingTitle"));
                    $("#rfpingResult").append(rfpingInfoProc(rcvData));
                    $("#rfpingResult").show();
                }
                else {
                    $("#rfpingFailedInfo").text("RFPing  MAC : " + mac );
                    $("#rfpingFailedInfo").show();
                    rfpingErrorPrint(rcvData.ErrCode)
                }
            }
        },
        onFailed: function(err)
        {
            console.log('RFPing ' + err.statusText);
            rfpingStartTime = null;
            $("#rfpingFailedInfo").text("RFPing Error MAC:" + mac);
            $("#rfpingFailedInfo").show();
        }
    };
    Utils.Request.sendRequest(RFPingOpt);
}

function startRfping(mac){
    var acSN = FrameInfo.ACSN;
    var sendData = {
        configType: 0,
        devSN: acSN,
        cloudModule: "stamonitor",
        deviceModule: "stamgr",
        method: 'StaRFPingStart',
        param: [{clientMAC: mac}]
    };
    /*
    var rfpingInfo = {
        MacAddress:"0000-0000-0000",
        ErrCode:0,
        StaMode:2,
        Rfping: [
            {McsIdx:0, Nss:0, VhtMcsIdx:0, TxRate:6.5, TxPktCnt:5, RxPktCnt:5, Rssi:10, RetryPktCnt:0, Rtt:0},
            {McsIdx:1, Nss:0, VhtMcsIdx:1, TxRate:13,  TxPktCnt:5, RxPktCnt:5, Rssi:55, RetryPktCnt:0, Rtt:0},
            {McsIdx:2, Nss:0, VhtMcsIdx:2, TxRate:6.5, TxPktCnt:5, RxPktCnt:5, Rssi:46, RetryPktCnt:0, Rtt:0},
            {McsIdx:3, Nss:0, VhtMcsIdx:3, TxRate:6.5, TxPktCnt:5, RxPktCnt:5, Rssi:78, RetryPktCnt:0, Rtt:0},
            {McsIdx:4, Nss:0, VhtMcsIdx:4, TxRate:6.5, TxPktCnt:5, RxPktCnt:5, Rssi:26, RetryPktCnt:0, Rtt:0}
        ]
    };
    */

    $("#rfpingResult").hide();
    $("#rfpingFailedInfo").hide();

    var startRfpingOpt = {
        url:"/v3/ant/confmgr",
        timeout : 10000,
        dataType:"json",
        type:"post",
        data: sendData,
        onSuccess:function (Data) {
            console.log("RFPing Start Data : " + JSON.stringify(Data));
            if("success" === Data.communicateResult) {
                if( 2 === Data.deviceResult[0].ErrCode)
                {
                    getRfpingData(mac);
                }
                else
                {
                    rfpingErrorPrint(Data.deviceResult[0].ErrCode);
                }
            }
            else {
                $("#rfpingFailedInfo").text("RFPing failed : " + Data.reason);
                $("#rfpingFailedInfo").show();
            }
        },
        onFailed: function(err)
        {
            console.log('startRfping ' + err.statusText);
            $("#rfpingFailedInfo").text("RFPing Error MAC:" + mac);
            $("#rfpingFailedInfo").show();
        }
    };

    Utils.Request.sendRequest(startRfpingOpt);
}

function ProcBtnClick(){
    var inputMac = $("#input_mac").val();
    var reg = /[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}/;

    $("#measureResult").empty();
    $("#Test11kTitleResult").empty();

    if(inputMac.match(reg)){
        ProcMeasureClick(inputMac);
    }
    else{
        $("#Test11kTitleResult").text("请输入正确的MAC地址:xxxx-xxxx-xxxx");
    }
}

function chooseMac(){
    input = document.getElementById("input_mac");
    input.value = this.getElementsByClassName('sl0')[0].innerHTML;
    console.log(input.value);
    //$("#clientShow").modal("hide")
    Utils.Pages.closeWindow(Utils.Pages.getWindow($("#clientShow")));
}


function getApName(mac,callback){
    $("#maintainpingResult").hide();
    $("#maintainpingAvgResult").hide();
    $("#maintainpingFailedInfo").hide();
    var staOpt = {
        url:MyConfig.path+"/stamonitor/web/stationlist?devSN=" + FrameInfo.ACSN,
        type:"GET",
        dataType:'json',
        onSuccess:getApNameSuc,
        onFailed:getApNameFail
    };

    Utils.Request.sendRequest(staOpt);

    function getApNameSuc(staResult){
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
    }

    function getApNameFail(){
        $("#maintainpingFailedInfo").text("AC Ping failed : Get client information failed.");
        $("#maintainpingFailedInfo").show();
    }

}

function drawClient() {
    var opt = {
        height: "80",
        showHeader: true,
        multiSelect: false,
        pageSize: 10,
        colNames: "MAC地址,IP地址,无线服务,AP,终端厂商,终端类型",
        colModel: [
            {name: "MacAddress",    datatype: "String", width: 70},
            {name: "Ipv4Address",   datatype: "String", width: 60},
            {name: "Ssid",          datatype: "String", width: 80},
            {name: "ApName",        datatype: "String", width: 50},
            {name: "clientVendor",  datatype: "String", width: 40},
            {name: "WirelessMode",  datatype: "String", width: 80}
        ]
    };
    $("#popChooseList").on('click', '[rindex]', chooseMac);
    $("#clientShow").SList();
    $("#popChooseList").SList("head", opt);
}

function ClientChoose() {
    var GetCliOpt = {
        url: MyConfig.path+"/stamonitor/web/stationlist?devSN=" + FrameInfo.ACSN,
        type: "GET",
        dataType: "json",
        onSuccess: function(data){
            var aTemplate = [];
            var aSignalStrength=[];
            var aClientList = data.clientList||[];
            aClientList.forEach(function(client){
                aTemplate.push({
                    MacAddress: client["clientMAC"],
                    Ipv4Address: client["clientIP"]|| "0.0.0.0",
                    Ssid: client["clientSSID"],
                    ApName: client["ApName"],
                    clientVendor: client["clientVendor"],
                    WirelessMode: client["clientName"]
                });

            });
            $("#popChooseList").SList("refresh", aTemplate);
            Utils.Base.openDlg(null, {}, {scope:$("#clientShow"),className:"modal-super dashboard"});
        },
        onFailed: function (err) {
            console.log('Get client list ' + err.statusText);
        }
    };

    Utils.Request.sendRequest(GetCliOpt);
}

(function ($) {
    var MODULE_NAME = "measure.index";

    function initForm() {
        drawClient();
        $("#measure_btn").click(ProcBtnClick);
        $("#choose").click(ClientChoose);
    }

    function _init(oPara) {
        initForm();
    }

    function _destroy() {
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList"],
        "utils": ["Request"]
    });
}) (jQuery);
