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
    /*
    if (undefined == clientInfo) {
        clientInfo = {
            linkMargin:99, RCPI:-128, RSNI: 11,
            antenId:2,ANPI:88, IPI:[11,11,11,11,11,11,11,11,11,11],
             txmtPower:11,BSS:"0000-0000-0000",OFDMPreamble:1,radar:1,unidetifiedSignal:1,
             CCA:1,RPI:[1, 1, 1, 1, 1, 1, 1],BSSID:1,phyType:1,
             averRCPI:1,lastRSNI:1,lastRCPI:1, frameCount:1,APAverAccDelay:1,
             averAccDelayBE:1,averAccDelayBK:1,averAccDelayVI:1, averAccDelayVO:1,staCnt:1,
             chlUtilize:1,tid:1,transMSDUCnt:1,MSDUDiscardCnt:1, MSDUFailCnt:1,MSDUMulRetryCnt:1,
             qosLostCnt:1,averQueDelay:1,averTransDelay:1,bin0Range:1,Bin0Bin5:[1,1,1,1,1]
        };
    }
*/

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
        $("#measureResult").text("该终端不支持11k测量");
    }
}

function ProcMeasureClick(mac){
    var rcvData;
    var acSN = FrameInfo.ACSN;
    console.log('11k measure MAC: '+ mac);

    $("#Test11kTitleResult").text("请稍后……");

    $.ajax({
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
        success:function (Data)
        {
            $("#Test11kTitleResult").text("MAC Address: " + mac);
            if("success" === Data.communicateResult) {
                if (0 == Data.deviceResult.length) {
                    $("#measureResult").text("未获取到测量信息");
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
        error: function()
        {
            console.log('11k ajax response error.');
        }
    });
    startRfping(mac);
}

function rfpingInfoProc(rfpingInfo) {
    var lineIndex = "";
    var nssLine = "";
    var privNss = null;
    var curNss = null;
    var resultTable = "";

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
    for (var j in rfpingInfo.Rfping) {
        if(lineIndex) {
            if(0 == rfpingInfo.Rfping[j][lineIndex]) {
                resultTable += nssLine;
            }
            resultTable += "<tr><td>" + rfpingInfo.Rfping[j][lineIndex] + "</td>";
        } else {
            if(0 == j) {
                resultTable += nssLine;
            }
            resultTable += "<tr><td>" + j + "</td>";
        }
        resultTable += "<td>" + rfpingInfo.Rfping[j].TxRate + "</td>";
        resultTable += "<td>" + rfpingInfo.Rfping[j].TxPktCnt +
            "/" + rfpingInfo.Rfping[j].RxPktCnt + "</td>";
        resultTable += "<td>" + rfpingInfo.Rfping[j].Rssi + "</td>";
        resultTable += "<td>" + rfpingInfo.Rfping[j].Rtt + "</td>";

        resultTable += "</tr>";
    }
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

    $.ajax({
        url: '/v3/ant/confmgr',
        type: 'post',
        data: sendData,
        dataType:'json',
        timeout: 5000,
        success: function(data,status) {
            console.log('RFPing query response:' + JSON.stringify(data));
            if (data.deviceResult.length === 0) {
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
                rcvData = JSON.parse(data.deviceResult[0].result);
                if("success" === Data.communicateResult) {
                    if (rcvData.ErrCode == 0) {
                        $("#rfpingResult").html($("#rfpingTitle"));
                        $("#rfpingResult").append(rfpingInfoProc(rcvData));
                        $("#rfpingResult").show();
                    }
                    else {
                        $("#rfpingFailedInfo").text("RFPing failed MAC : " + mac + "; ErrCode : " + Data.ErrCode);
                        $("#rfpingFailedInfo").show();
                    }
                }
                else {
                    $("#rfpingFailedInfo").text("RFPing failed : " + Data.reason);
                    $("#rfpingFailedInfo").show();
                }
            }
        },
        error: function()
        {
            rfpingStartTime = null;
            $("#rfpingFailedInfo").text("RFPing Error MAC:" + mac);
            $("#rfpingFailedInfo").show();
        }
    });
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

    $.ajax({
        url:"/v3/ant/confmgr",
        timeout : 10000,
        dataType:"json",
        type:"post",
        data: sendData,
        success:function (Data) {
            console.log("RFPing Start Data : " + JSON.stringify(Data));
            if("success" === Data.communicateResult) {
                getRfpingData(mac);
            }
            else {
                $("#rfpingFailedInfo").text("RFPing failed : " + Data.reason);
                $("#rfpingFailedInfo").show();
            }
        },
        error: function()
        {
            $("#rfpingFailedInfo").text("RFPing Error MAC:" + mac);
            $("#rfpingFailedInfo").show();
        }
    });
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

(function ($)
{
    var MODULE_NAME = "b_measure.index";
    function initForm()
    {
        $("#measure_btn").click(ProcBtnClick);
    }
    function _init(oPara)
    {
        initForm();
    };

    function _destroy()
    {

    }

    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": []
    });
}) (jQuery);
