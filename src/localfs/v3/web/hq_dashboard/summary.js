;(function ($)
{

// 全局定义
var MODULE_NAME = "hq_dashboard.summary";
var OLCUSTOMER_LEGEND = getRcText("OLCUSTOMER_LEGEND");
var OLCUSTOMER_PERSON = getRcText("OLCUSTOMER_PERSON");
var PIE_NAME = getRcText("PIE_NAME").split(",");
var AUTHPIE_TEXT = getRcText("AUTHPIE_TEXT").split(",");
var DATETIME_UNIT = getRcText("DATETIME_UNIT").split(",");
var BRANCH_TYPE = getRcText("BRANCH_TYPE").split(",");
var g_sCurrentTimeRange = "curDay";
var g_sTermType = "";
var g_sTermVendor = "";
var g_sClickBranchName = "";
var g_SSID = "";
var g_stName = "";


function getRcText(sRcName)
{
    return Utils.Base.getRcString("network_summary_rc", sRcName);
}

function getBoolToNum(bBool) {
    return ( bBool == false ? 1 : -1 );
}

// 初始化 日志信息 block
function get_LogInfoBlock_Data()
{
    function getSucc(data)
    {
        var aData = data.logstats;
        var aLogTypeId = ["#emergency", "#critical", "#alert", "#error"];
        $.each(aLogTypeId, function (index, ele){
            var nPreIndex = 2 * index;
            var nNextIndex = 2 * index + 1;
            $(ele + " .number").html( aData[nPreIndex] + aData[nNextIndex] );
        });
    }

    function getFail()
    {
        throw new Error("get_LogInfoBlockData_Fail");
    }

    var oSendOpts = {
        type : "GET",
        url : MyConfig.path + "/devlogserver/getlogstats?devSN=" + FrameInfo.ACSN,
        dataType : "json",
        onSuccess : getSucc,
        onFailed : getFail
    };
    Utils.Request.sendRequest(oSendOpts);
}

function init_LogDetail_Btn()
{
    function onLogDetailClick()
    {
       window.location.hash = "#HQ_LOG";
       return false; 
    }

    $("#logDetailBtn").bind("click", onLogDetailClick);
}

// 初始化 当前回头客、当前新宾客 block
function get_CurrentCustomer_Data()
{
    function getSucc(data)
    {
        var oResult = data.result;
        var nNewCustomer = oResult.new_count;
        var nReturningCustomer = oResult.total_count - nNewCustomer;
        var oHTMLData = {
                "newCustomer": nNewCustomer,
                "returningCustomer" : nReturningCustomer
        };
        Utils.Base.updateHtml($(".dashboard"),oHTMLData);  
    }

    function getFail()
    {
       throw new Error("get_CurrentCustomData_Fail"); 
    }

    var oSendOpts = {
        type : "GET",
        url : MyConfig.path + "/visitor/onlinestatistics?devSN=" + FrameInfo.ACSN,
        dataType : "json",
        onSuccess : getSucc,
        onFailed : getFail
    };
    Utils.Request.sendRequest(oSendOpts);
}

// 初始化 广告浏览量、点击数 block
function get_AdInfoBlock_Data()
{
    function getSucc(data)
    {
        var nAdView = data.data[0].pv;
        var nAdClick = data.data[0].clickCount;
        var oHTMLData = {
                "adViewCount" : nAdView,
                "adClickCount": nAdClick
        };
        Utils.Base.updateHtml($(".dashboard"),oHTMLData);
    }

    function getFail()
    {
        throw new Error("get_AdInfoBlockData_Fail"); 
    }

    var dStartTime = new Date();
    dStartTime.setHours(0);
    dStartTime.setMinutes(0);
    dStartTime.setSeconds(0);
    dStartTime = dStartTime.getTime();

    var dEndTime = new Date();
    dEndTime = dEndTime.getTime();

    var oSendOpts = {
        type : "GET",
        url : MyConfig.v2path +"/advertisement/queryBySpan?devSN=" + FrameInfo.ACSN
            + "&ownerName=" + FrameInfo.g_user.user
            + "&storeId=" + FrameInfo.Nasid
            + "&span=86400000"
            + "&startTime=" + dStartTime
            + "&endTime=" + dEndTime,
        dataType : "json",
        onSuccess : getSucc,
        onFailed : getFail
    };
    Utils.Request.sendRequest(oSendOpts);
}

// 初始化 设备信息 block
function get_DevInfoBlock_Data()
{
    function getSucc(data)
    {
        var oHTMLData = {
            "DeviceType" : data.devMode,
            "SerialNumber": FrameInfo.ACSN,
            "HardwareRev" : data.devBaslineVersion,
            "SoftwareRev" : data.devSoftVersion,
            "IPAddress": data.devAddress
        }
        Utils.Base.updateHtml($("#DevInfo_block"),oHTMLData);

        // $("<a data-toggle='tooltip' data-palcement='top' href='javascript:void(0);' style='color:#4ec1b2'>"
        //     + getRcText("IP_LOCATION") +
        // "</a>")
        // .appendTo($("#IPAddress"));

        var devLocation = data.devLocation;
        var sDevLocation = devLocation.country + "-"
                        + devLocation.province + "-"
                        + devLocation.city;
        $("#IPAddress").next().attr("title", sDevLocation);

        function setTipBackColor() {
            var backColor = "#4ec1b2";
            $("div[class='tooltip-arrow']").css("border-top-color",backColor);
            $("div[class='tooltip-inner']").css({
                "height" : "35px",
                "background-color" : backColor,
                "line-height" : "25px"
            });
        }

        $('[data-toggle="tooltip"]').tooltip().bind("mouseover", setTipBackColor);


        // 获取时间后，转化成 年月天时分秒 并 启动定时器 开始转动
            // 是否显示
        function timeDisplay(nNum, sUnit) {
            return nNum >= 10 ? nNum + sUnit : "0" + nNum + sUnit;
        }
        function isDisplay(nNum, sUnit) {
            return nNum > 0 ? nNum + sUnit : ""; 
        }
            // 格式化日期时间
        function formatterDateTime(sId, sSecond) {
            var oDateTime = new Date( sSecond * 1000 );
            var aDateTime = [];
            aDateTime[0] = isDisplay(oDateTime.getUTCFullYear() - 1970, DATETIME_UNIT[0]);
            aDateTime[1] = timeDisplay(oDateTime.getUTCMonth(), DATETIME_UNIT[1]);
            aDateTime[2] = timeDisplay(oDateTime.getUTCDate() - 1, DATETIME_UNIT[2]);
            aDateTime[3] = timeDisplay(oDateTime.getUTCHours(), DATETIME_UNIT[3]);
            aDateTime[4] = timeDisplay(oDateTime.getUTCMinutes(), DATETIME_UNIT[4]);
            aDateTime[5] = timeDisplay(oDateTime.getUTCSeconds(), DATETIME_UNIT[5]);
            $(sId).text( aDateTime.join("") );
        }

        formatterDateTime("#onlineTime", data.devOnlineTime);
        formatterDateTime("#startupTime", data.devUplineTime);

    }

    function getFail()
    {
        throw new Error("get_DevInfoBlockData_Fail");
    }

    var oSendOpts = {
        type: "GET",
        url: MyConfig.path + "/devmonitor/devinfo?devSN=" + FrameInfo.ACSN,
        dataType: "json",
        onSuccess: getSucc,
        onFailed: getFail
    };
    Utils.Request.sendRequest(oSendOpts);
}

// 初始化 在线宾客变化 折线图

// getData内部需要
function drawOLCustomerChangeLine(aData)
{
    var oOpts = {
        width : "100%",
        height : "230px",
        tooltip : {
            show : true,
            trigger : "item",
            formatter : function (params){
                var sDate = params.value[0].toLocaleDateString().replace(/\//g, "-");
                var sTime = params.value[0].toTimeString().split(" ")[0];
                var time = sDate + "," + sTime;
                if(params.value[1] < 0)
                {
                    params.value[1] = -params.value[1];
                }
                var string = params.seriesName + "<br/>"
                            + time + "<br/>"
                            + params.value[1] + OLCUSTOMER_PERSON;
                return string;
            },
            axisPointer: {
                type : "line",
                lineStyle : {
                    color : "#94DAD0",
                    width : 0,
                    type : "solid"
                }
            }
        },
        legend : {
            orient : "horizontal",
            y : 0,
            x : "center",
            itemWidth : 8,
            textStyle: {color : "#617085", fontSize : "12px"},
            data: [OLCUSTOMER_LEGEND]
        },
        grid : {
            x : 30, y : 20, x2 : 22, y2 : 30,
            borderColor : "#FFF"
        },
        calculable : false,
        xAxis : [
            {
                type : "time",
                splitNumber : 6,
                splitLine : true,
                axisLabel : {
                    show : true,
                    textStyle : {
                        color : '#617085',
                        fontSize : "12px"
                    },
                    formatter: function (value,index){
                        function getDoubleStr(num)
                        {
                            return num >= 10 ? num : "0" + num;
                        }

                        if(g_sCurrentTimeRange === "curDay")
                        {
                            return getDoubleStr(value.getHours())
                                + ":"
                                + getDoubleStr(value.getMinutes());
                        }
                        else if(g_sCurrentTimeRange === "oneWeek")
                        {

                            return value.getMonth() + 1
                                + "-"
                                + value.getDate();     
                        }
                        else
                        {
                            return value.getMonth() + 1 + "-" + value.getDate();
                        }
                    }
                },
                axisLine : {
                    show : true,
                    lineStyle : {color : '#AEAEB7', width : 1}
                },
                axisTick : {show : false}
            }
        ],
        yAxis : [
            {
                name : OLCUSTOMER_PERSON,
                type : 'value',
                splitLine : {
                    show : true,
                    lineStyle : {color: ['#eee']}
                },
                axisLabel: {
                    show : true,
                    textStyle : {
                        color : '#617085',
                        fontSize : "12px",
                        width : 2
                    }
                },
                axisLine: {
                    show : false,
                    lineStyle : {color : '#AEAEB7', width : 1}
                }
            }
        ],
        animation : false,
        series : [
            {
                type : 'line',
                smooth : true,
                symbol : "none",
                showAllSymbol : true,
                symbolSize : 2,
                itemStyle : {normal : {areaStyle : {type : 'default'}, lineStyle : {width : 0}}},
                name : OLCUSTOMER_LEGEND,
                data : aData 
            }
        ]

    };

    var oTheme = {
        color : ['#4ec1b2'],
        categoryAxis : {
            splitLine : {lineStyle : {color : ['#FFF']}}
        }
    };

    $("#onlineCustomerChangeLine").echart("init", oOpts, oTheme); 
}

// init_OL内部需要
function getOLCustomerChangeData()
{
    function getSucc(data)
    {
        var aData = data.client_statistic;
        var aNewData = [];

        function createLocaleDate(datetime)
        {
            var sLocaleSeconds = new Date(datetime);
            return new Date(sLocaleSeconds);
        }

        if(aData.length == 0 || typeof aData[0].clientcount === "number")
        {
            var aNewData = new Array();
            var dataTimeModel = new Date();
            dataTimeModel.setHours( dataTimeModel.getHours() + 1 );
            dataTimeModel.setMinutes(0);
            dataTimeModel.setSeconds(0);

            for(var iHour = 0; iHour < 24; iHour ++) {

                var nClientCount = 0;

                for(var iClient = 0; iClient < aData.length; iClient ++) {
                    if( createLocaleDate(aData[iClient].updateTime).getHours() == dataTimeModel.getHours() - 1 ) {
                        nClientCount = aData[iClient].clientcount;
                    }
                }

                aNewData.unshift([
                    new Date(
                        dataTimeModel.setHours( dataTimeModel.getHours() - 1 )
                    ),
                    nClientCount
                ]);
            }

        }
        else
        {
            $.each(aData, function (index,ele){
                aNewData.push([createLocaleDate(ele.time), ele.count]);
            });
        }

        drawOLCustomerChangeLine(aNewData);        
    }

    function getFail()
    {
        throw new Error("get_OLCustomerChangeData_Fail");
    }

    var oSendOpts = {
        type: "GET",
        url: MyConfig.path + "/stamonitor/histclientstatistic"
            + "?devSN=" + FrameInfo.ACSN 
            + "&statistic_type=" + g_sCurrentTimeRange,
        dataType: "json",
        onSuccess: getSucc,
        onFailed: getFail
    };
    Utils.Request.sendRequest(oSendOpts);
}

// init_OL
function init_OLCustomerChange_Block()
{
    // 指针变回"天"
    g_sCurrentTimeRange = "curDay";
    // "天"回原位
    function initTimeSwitch()
    {
        $("#OLCustomerTimeSwitch a").removeClass("active");
        $("#" + g_sCurrentTimeRange).addClass("active");
    }

    initTimeSwitch();
    // 首次获取数据
    getOLCustomerChangeData();
    // binb天、周、月"click事件
    function onTimeSwitchBtnClick()
    {
        g_sCurrentTimeRange = $(this).attr("id");
        initTimeSwitch();
        // 获取数据画图
        getOLCustomerChangeData();
    }

    $("#OLCustomerTimeSwitch a").bind("click", onTimeSwitchBtnClick)
}

// 初始化 分支列表
function init_Branch_List()
{
    var oOpts = {
        colNames : getRcText("BRANCHLIST_HEADER"),
        showHeader : true,
        multiSelect : false,
        pageSize : 4,
        rowHeight : 45.25,
        colModel: [
            {name : "branchName", datatype : "String"},
            {name : "branchType", datatype : "String"},
            {name : "APNum", datatype : "String",formatter: showBranchAPNum}
      ]
    }; 

    $("#branchList").SList ("head", oOpts);
}

function showBranchAPNum(row, cell, value, columnDef, oRowData, sType) {
    if(sType == "text"||value=="0") {
        return value;
    }

    return "<a class='list-link' branchName='" + oRowData.branchName + "' href='javascript:void(0);'>" + value +"</a>";
}

function get_BranchList_Data()
{
    function getSucc(data)
    {
        var aData = [];
        $.each(data.branchList, function (index, ele) {
            aData.push({
                branchName: ele.branchName,
                branchType: BRANCH_TYPE[parseInt(ele.branchType)],
                APNum: ele.apCount
            });
        });
        $("#branchList").SList("refresh", aData);

        $("#branchList").on("click", "a.list-link", onBranchAPNumClick);
    }

    function getFail()
    {
        throw new Error("get_BranchListData_Fail"); 
    }

    var oSendOpts = {
        type : "GET",
        url : MyConfig.path +"/apmonitor/getBranchList?devSN=" + FrameInfo.ACSN,
        dataType : "json",
        onSuccess : getSucc,
        onFailed : getFail
    };

    Utils.Request.sendRequest(oSendOpts);
}

function branchAPListSendAjax(nPageNum, oData) {

    function getSucc(data) {
        var aData = [];
        $.each(data.apList, function (index, ele) {
            aData.push({
                apName: ele.apName,
                apSN: ele.apSN,
                macAddr: ele.macAddr,
                clientCount: ele.clientCount
            });
        });
        $("#ByBrachAPPopList").SList("refresh", {
            total : parseInt(data.totalCount),
            pageNum : nPageNum,
            data : aData
        });
    }

    function getFail() {
        throw new Error("get_Fail");
    }

    var oSendOpts = {
        type : "POST",
        url :MyConfig.path +"/apmonitor/getApListPageByBranch?devSN=" + FrameInfo.ACSN
            + "&branchName=" + g_sClickBranchName + "&limitnum=" + oData.limit
            + "&skipnum=" + oData.skip,
        dataType : "json",
        contentType: "application/json",
        data: JSON.stringify(oData.body),
        onSuccess : getSucc,
        onFailed : getFail
    };

    Utils.Request.sendRequest(oSendOpts);
}

function init_BranchAP_List() {
    var optPortalPop ={
        colNames:getRcText ("BRANCH_APLIST_HEADER"),
        showHeader:true,
        asyncPaging: true,
        pageSize : 10,
        colModel: [
            {name:"apName",datatype:"String"},
            {name:"apSN",datatype:"String"},
            {name:"macAddr",datatype:"String"},
            {name:"clientCount",datatype:"String"}
        ],
        onPageChange: function (pageNum, pageSize, oFilter, oSorter) {

            var oParam = {
                devSN: FrameInfo.ACSN,
                branchName: g_sClickBranchName,
                limit: pageSize,
                skip: (pageNum - 1) * pageSize,
                body : {
                    findoption: {},
                    sortoption: {}
                }
            };

            if( oFilter ) { // 无任何筛选条件时，oFilter是null
                
                if( oFilter.hasOwnProperty("apName") ) {
                    oParam.body.findoption.apName = oFilter.apName;
                }
                if ( oFilter.hasOwnProperty("apSN") ) {
                    oParam.body.findoption.apSN = oFilter.apSN;
                }
                if ( oFilter.hasOwnProperty("macAddr") ) {
                    oParam.body.findoption.macAddr = oFilter.macAddr;
                }
                if ( oFilter.hasOwnProperty("clientCount") ) {
                    oParam.body.findoption.clientCount = oFilter.clientCount;
                }
    
            }
                
            if( oSorter ) {
                var sName = oSorter.name;
                oParam.body.sortoption[sName] = getBoolToNum( oSorter.isDesc );
            }

            branchAPListSendAjax(pageNum, oParam);
        },
        onSearch: function (oFilter, oSorter) {

            var oParam = {
                devSN: FrameInfo.ACSN,
                branchName: g_sClickBranchName,
                limit: 10,
                skip: 0,
                body : {
                    findoption: {},
                    sortoption: {}
                }
            };

            if( oFilter ) { // 无任何筛选条件时，oFilter是null
                
                if( oFilter.hasOwnProperty("apName") ) {
                    oParam.body.findoption.apName = oFilter.apName;
                }
                if ( oFilter.hasOwnProperty("apSN") ) {
                    oParam.body.findoption.apSN = oFilter.apSN;
                }
                if ( oFilter.hasOwnProperty("macAddr") ) {
                    oParam.body.findoption.macAddr = oFilter.macAddr;
                }
                if ( oFilter.hasOwnProperty("clientCount") ) {
                    oParam.body.findoption.clientCount = oFilter.clientCount;
                }
            }
                
            if( oSorter ) {
                var sName = oSorter.name;
                oParam.body.sortoption[sName] = getBoolToNum( oSorter.isDesc );
            }

            branchAPListSendAjax(1, oParam);
        },
        onSort:function(sName, isDesc) {
            
            var oParam = {
                devSN: FrameInfo.ACSN,
                branchName: g_sClickBranchName,
                limit: 10,
                skip: 0,
                body: { sortoption: { } }
            };
            oParam.body.sortoption[sName] = getBoolToNum( isDesc );
            branchAPListSendAjax(1, oParam);
        }
    };
    $("#ByBrachAPPopList").SList ("head",optPortalPop);
}

function onBranchAPNumClick() {
    Utils.Base.openDlg(null, {}, {scope:$("#ByBrachAP_diag"),className:"modal-super dashboard"});
    $("#ByBrachAPPopList").SList("resize");

    function getSucc(data){
        var aData = [];
        $.each(data.apList, function (index, ele) {
            aData.push({
                apName: ele.apName,
                apSN: ele.apSN,
                macAddr: ele.macAddr,
                clientCount: ele.clientCount
            });
        });
        $("#ByBrachAPPopList").SList("refresh", {
            total: parseInt(data.totalCount),
            pageNum: 1,
            data: aData
        });
    }

    function getFail() {
        throw new Error("get_Data_Fail"); 
    }

    g_sClickBranchName = $(this).attr("branchName");
    var oSendOpts = {
        type : "POST",
        url : MyConfig.path +"/apmonitor/getApListPageByBranch?devSN=" + FrameInfo.ACSN
            + "&branchName=" + g_sClickBranchName + "&limitnum=10" + "&skipnum=0",
        dataType : "json",
        contentType: "application/json",
        data: JSON.stringify({
            findoption: {},
            sortoption: {}
        }),
        onSuccess : getSucc,
        onFailed : getFail
    };

    Utils.Request.sendRequest(oSendOpts);
    return false;
}



// 认证终端_饼图
    // 空
function drawAuthNullPie()
{
    var oOpts = {
        height : 200,
        calculable : false,
        series : [
            {
                type : "pie",
                radius : "80%",
                center : ["50%", "40%"],
                itemStyle : {
                    normal : {
                        label : {position : "inner"},
                        labelLine : {show : false}
                    }
                },
                data : [{name : "N/A", value : 1}]
            }
        ]
    };

    var oTheme={color : ["rgba(216, 216, 216, 0.75)"]};

    $("#authTerminalPie").echart("init", oOpts, oTheme);    
}
    // 认证终端弹出终端列表 大数据批量查询请求
function authTermSendAjax(nPageNum, oData) {

    function getSucc(data) {
        var all=getModeList(data.clientList.clientInfo);
        $("#ByPortalPopList").SList("refresh", {
            total : parseInt(data.clientList.count_total),
            pageNum : nPageNum,
            data : all
        });
    }

    function getFail() {
        throw new Error("get_Fail");
    }

    var oSendOpts = {
        type : "POST",
        url : MyConfig.path 
            + "/stamonitor/getclientverbose_page?devSN=" + FrameInfo.ACSN + "&auth=true"
            + "&limitnum=" + oData.limit + "&skipnum=" + oData.skip,
        dataType : "json",
        contentType: "application/json",
        data: JSON.stringify(oData.body),
        onSuccess : getSucc,
        onFailed : getFail
    };

    Utils.Request.sendRequest(oSendOpts);
}

function init_Auth_List()
{
    var optPortalPop ={
        colNames:getRcText ("PORTAL_TERMINAL"),
        showHeader:true,
        asyncPaging: true,
        pageSize : 10,
        colModel: [
            {name:"clientMAC",datatype:"String"},
            {name:"clientIP",datatype:"String"},
            {name:"clientVendor",datatype:"String"},
            {name:"ApName",datatype:"String"},
            {name:"clientSSID",datatype:"String"}
        ],
        onPageChange: function (pageNum, pageSize, oFilter, oSorter) {

            var oParam = {
                devSN: FrameInfo.ACSN,
                auth: true,
                limit: pageSize,
                skip: (pageNum - 1) * pageSize,
                body : {
                    findoption: {},
                    sortoption: {}
                }
            };

            if( oFilter ) { // 无任何筛选条件时，oFilter是null
                
                if( oFilter.hasOwnProperty("clientMAC") ) {
                    oParam.body.findoption.clientMAC = oFilter.clientMAC;
                }
                if ( oFilter.hasOwnProperty("clientIP") ) {
                    oParam.body.findoption.clientIP = oFilter.clientIP;
                }
                if ( oFilter.hasOwnProperty("clientVendor") ) {
                    oParam.body.findoption.clientVendor = oFilter.clientVendor;
                }
                if ( oFilter.hasOwnProperty("ApName") ) {
                    oParam.body.findoption.ApName = oFilter.ApName;
                }
                if ( oFilter.hasOwnProperty("clientSSID") ) {
                    oParam.body.findoption.clientSSID =  oFilter.clientSSID;
                }
            }
                
            if( oSorter ) {
                var sName = oSorter.name;
                oParam.body.sortoption[sName] = getBoolToNum( oSorter.isDesc );
            }

            authTermSendAjax(pageNum, oParam);
        },
        onSearch: function (oFilter, oSorter) {

            var oParam = {
                devSN: FrameInfo.ACSN,
                auth: true,
                limit: 10,
                skip: 0,
                body : {
                    findoption: {},
                    sortoption: {}
                }
            };

            if( oFilter ) { // 无任何筛选条件时，oFilter是null
                
                if( oFilter.hasOwnProperty("clientMAC") ) {
                    oParam.body.findoption.clientMAC = oFilter.clientMAC;
                }
                if ( oFilter.hasOwnProperty("clientIP") ) {
                    oParam.body.findoption.clientIP = oFilter.clientIP;
                }
                if ( oFilter.hasOwnProperty("clientVendor") ) {
                    oParam.body.findoption.clientVendor =  oFilter.clientVendor ;
                }
                if ( oFilter.hasOwnProperty("ApName") ) {
                    oParam.body.findoption.ApName =  oFilter.ApName ;
                }
                if ( oFilter.hasOwnProperty("clientSSID") ) {
                    oParam.body.findoption.clientSSID =  oFilter.clientSSID ;
                }
            }
                
            if( oSorter ) {
                var sName = oSorter.name;
                oParam.body.sortoption[sName] = getBoolToNum( oSorter.isDesc );
            }

            authTermSendAjax(1, oParam);
        },
        onSort:function(sName, isDesc) {
            
            var oParam = {
                devSN: FrameInfo.ACSN,
                auth: true,
                limit: 10,
                skip: 0,
                body: { sortoption: { } }
            };
            oParam.body.sortoption[sName] = getBoolToNum( isDesc );
            authTermSendAjax(1, oParam);
        }
    };
    $("#ByPortalPopList").SList ("head",optPortalPop);
}

function getModeList(ArrayT)
{
    var atemp = [];
    $.each(ArrayT,function(index,iArray){
        atemp.push({
            "clientMAC":iArray.clientMAC,
            "clientIP":iArray.clientIP,
            "clientVendor":iArray.clientVendor,
            "ApName":iArray.ApName,
            "clientSSID":iArray.clientSSID
        });
    });
    return atemp;
}

function onAuthPieClick(oPiece)
{
    if(oPiece.dataIndex == "1") {
        return;
    }
    function getSucc(data)
    {
        Utils.Base.openDlg(null, {}, {scope:$("#ByPortal_diag"),className:"modal-super dashboard"});
        var all=getModeList(data.clientList.clientInfo);
        $("#ByPortalPopList").SList("refresh", {
            total : parseInt(data.clientList.count_total),
            pageNum : 1,
            data : all
        });
        $("#ByPortalPopList").SList("resize");
        return false; 
    }

    function getFail()
    {
        throw new Error("get_Fail");
    }

    var oSendOpts = {
        type : "POST",
        url : MyConfig.path 
            + "/stamonitor/getclientverbose_page?devSN=" + FrameInfo.ACSN + "&auth=true"
            + "&skipnum=0&limitnum=10",
        dataType : "json",
        contentType: "application/json",
        data: JSON.stringify({
            findoption: {},
            sortoption: {} 
        }),
        onSuccess : getSucc,
        onFailed : getFail
    };

    Utils.Request.sendRequest(oSendOpts);
}

    // 有数据
function drawAuthPie(data)
{
    var oOpts = {
        animation : true,
        calculable : false,
        height : 200,
        tooltip : {
            show:true,
            formatter: "{b}:<br/> {c} ({d}%)"
        },
        series : [
            {
                type : "pie",
                minAngle : "3",
                radius : ['0','80%'],
                center : ["50%", "40%"],
                itemStyle : {
                    normal : {
                        borderColor : "#FFF",
                        borderWidth : 1,
                        label : {
                          position : "inner",
                            textStyle : {color : "#fff"},
                            formatter : function(value){
                                var percent = parseInt(value.percent);
                                return value.name + "\n" + percent + "%";
                            }  
                        },
                        labelLine : false
                    },
                    emphasis : {
                        label : {
                            show : false
                            // ,
                            // textStyle : {color : "#000"}
                        },
                        labelLine : false
                    }
                },
                data:data             
            }
        ],
        click : onAuthPieClick
    };

    var oTheme = {color : ["#4ec1b2", "#E7E7E9"]};

   $("#authTerminalPie").echart("init", oOpts, oTheme); 
}

    // 获取数据
function get_AuthPie_Data()
{
    function getSucc(data)
    {
        if(data  && data.clientList[0].totalCount != 0 && data.errcode !== "illegal access"){
            var aSatus = getRcText("PORTALSTA").split(',');
            var aData =[
                { name:aSatus[0],value:data.clientList[0].conditionCount},    
                { name:aSatus[1],value:data.clientList[0].totalCount - data.clientList[0].conditionCount}
            ];
            drawAuthPie(aData);   
        }
        else{
            drawAuthNullPie();
        }
    }

    function getFail()
    {
        throw new Error("get_AuthTerminalData_Fail");
        drawAuthNullPie();
    }

    var oSendOpts = {
        type : "GET",
        url : MyConfig.path + "/stamonitor/getclientlistbycondition?devSN=" + FrameInfo.ACSN + "&reqType=all",
        dataType : "json",
        onSuccess : getSucc,
        onFailed : getFail
    };

    Utils.Request.sendRequest(oSendOpts);
}

// 终端类型_饼图
    // 空
function drawTypeNullPie()
{
    var oOpts = {
        animation : true,
        height : 255,
        calculable : false,
        legend : {
            orient : "vertical",
            y : "bottom",
            data : [
                "802.11ac(5GHz)",
                "802.11an(5GHz)",
                "802.11a(5GHz)",
                "",
                "802.11gn(2.4GHz)",
                "802.11g(2.4GHz)",
                "802.11b(2.4GHz)"
                // {name : "802.11ac(5GHz)", icon : "pie"},
                // {name : "802.11an(5GHz)", icon : "pie"},
                // {name : "802.11a(5GHz)", icon:"pie"},
                // {name : ""},
                // {name : "802.11gn(2.4GHz)", icon : "pie"},
                // {name : "802.11g(2.4GHz)", icon : "pie"},
                // {name : "802.11b(2.4GHz)", icon : "pie"}
            ]
        },
        series : [
            {
                type : "pie",
                radius : "50%",
                center : ["50%", "30%"],
                itemStyle : {
                    normal : {
                        label : {position : "inner"},
                        labelLine : {show : false}
                    }
                },
                data : [
                    {name : "N/A", value : 1}
                    ,
                    { name:'802.11ac(5GHz)', itemStyle:{normal :{color:'#4ec1b2'}}},
                    { name:'802.11an(5GHz)', itemStyle:{normal :{color:'#95dad1'}}},
                    { name:'802.11a(5GHz)', itemStyle:{normal :{color:'#caece8'}}},
                    { name:'802.11gn(2.4GHz)', itemStyle:{normal :{color:'#b3b7dd'}}},
                    { name:'802.11g(2.4GHz)', itemStyle:{normal :{color:'#d1d4eb'}}},
                    { name:'802.11b(2.4GHz)', itemStyle:{normal :{color:'#e8e9f5'}}}
                ]
            }
        ]
    };

    var oTheme={color : ["rgba(216, 216, 216, 0.75)"]};

    $("#terminalTypePie").echart("init", oOpts, oTheme);    
}
    // 终端类型 弹出终端列表 大数据批量查询请求
function termTypeSendAjax(nPageNum, oData) {

    function getSucc(data) {
        var all=getModeList(data.clientList.clientInfo);
        $("#ByTypePopList").SList("refresh", {
            total : parseInt(data.clientList.count_total),
            pageNum : nPageNum,
            data : all
        });
    }

    function getFail() {
        throw new Error("get_Fail");
    }

    var oSendOpts = {
        type : "POST",
        url : MyConfig.path 
            + "/stamonitor/getclientlist_bymodeorvendor?devSN=" + FrameInfo.ACSN
            + "&mode=" + g_sTermType + "&limitnum=" + oData.limit + "&skipnum=" + oData.skip,
        dataType : "json",
        contentType: "application/json",
        data: JSON.stringify(oData.body),
        onSuccess : getSucc,
        onFailed : getFail
    };

    Utils.Request.sendRequest(oSendOpts);
}

function init_Type_List()
{
    var optPortalPop ={
        colNames:getRcText ("PORTAL_TERMINAL"),
        asyncPaging: true,
        showHeader:true,
        pageSize : 10,
        colModel: [
            {name:"clientMAC",datatype:"String"},
            {name:"clientIP",datatype:"String"},
            {name:"clientVendor",datatype:"String"},
            {name:"ApName",datatype:"String"},
            {name:"clientSSID",datatype:"String"}
        ],
        onPageChange: function (pageNum, pageSize, oFilter, oSorter) {

            var oParam = {
                devSN: FrameInfo.ACSN,
                mode: g_sTermType,
                limit: pageSize,
                skip: (pageNum - 1) * pageSize,
                body : {
                    findoption: {},
                    sortoption: {}
                }
            };

            if( oFilter ) { // 无任何筛选条件时，oFilter是null
                
                if( oFilter.hasOwnProperty("clientMAC") ) {
                    oParam.body.findoption.clientMAC = oFilter.clientMAC;
                }
                if ( oFilter.hasOwnProperty("clientIP") ) {
                    oParam.body.findoption.clientIP = oFilter.clientIP;
                }
                if ( oFilter.hasOwnProperty("clientVendor") ) {
                    oParam.body.findoption.clientVendor =  oFilter.clientVendor ;
                }
                if ( oFilter.hasOwnProperty("ApName") ) {
                    oParam.body.findoption.ApName =  oFilter.ApName ;
                }
                if ( oFilter.hasOwnProperty("clientSSID") ) {
                    oParam.body.findoption.clientSSID = oFilter.clientSSID ;
                }
            }
                
            if( oSorter ) {
                var sName = oSorter.name;
                oParam.body.sortoption[sName] = getBoolToNum( oSorter.isDesc );
            }

            termTypeSendAjax(pageNum, oParam);
        },
        onSearch: function (oFilter, oSorter) {

            var oParam = {
                devSN: FrameInfo.ACSN,
                mode: g_sTermType,
                limit: 10,
                skip: 0,
                body : {
                    findoption: {},
                    sortoption: {}
                }
            };

            if( oFilter ) { // 无任何筛选条件时，oFilter是null
                
                if( oFilter.hasOwnProperty("clientMAC") ) {
                    oParam.body.findoption.clientMAC = oFilter.clientMAC;
                }
                if ( oFilter.hasOwnProperty("clientIP") ) {
                    oParam.body.findoption.clientIP = oFilter.clientIP;
                }
                if ( oFilter.hasOwnProperty("clientVendor") ) {
                    oParam.body.findoption.clientVendor =  oFilter.clientVendor ;
                }
                if ( oFilter.hasOwnProperty("ApName") ) {
                    oParam.body.findoption.ApName =  oFilter.ApName ;
                }
                if ( oFilter.hasOwnProperty("clientSSID") ) {
                    oParam.body.findoption.clientSSID = oFilter.clientSSID ;
                }
            }
                
            if( oSorter ) {
                var sName = oSorter.name;
                oParam.body.sortoption[sName] = getBoolToNum( oSorter.isDesc );
            }

            termTypeSendAjax(1, oParam);
        },
        onSort:function(sName, isDesc) {
            var oParam = {
                devSN: FrameInfo.ACSN,
                mode: g_sTermType,
                limit: 10,
                skip: 0,
                body: { sortoption: { } }
            };
            oParam.body.sortoption[sName] = getBoolToNum( isDesc );
            termTypeSendAjax(1, oParam);
        }
    };
    $("#ByTypePopList").SList ("head",optPortalPop);
}
    // 点击
function onTypePieClick(oPiece)
{
    if(oPiece.seriesIndex == "0") {
        return;
    }

    function getSucc(data)
    {
        Utils.Base.openDlg(null, {}, {scope:$("#ByType_diag"),className:"modal-super dashboard"});
        var all = getModeList(data.clientList.clientInfo);
        $("#ByTypePopList").SList("refresh", {
            total : parseInt(data.clientList.count_total),
            pageNum : 1,
            data : all
        });
        $("#ByTypePopList").SList("resize");
        return false; 
    }

    function getFail()
    {
        throw new Error("get_Fail");
    }

    g_sTermType = oPiece.name.split("(")[0];

    var oSendOpts = {
        type : "POST",
        url : MyConfig.path + "/stamonitor/getclientlist_bymodeorvendor?devSN=" + FrameInfo.ACSN + "&mode=" + g_sTermType + "&skipnum=0&limitnum=10",
        contentType: "application/json",
        dataType : "json",
        data: JSON.stringify({
            "findoption": {},
            "sortoption": {}
        }),
        onSuccess : getSucc,
        onFailed : getFail
    };
    
    Utils.Request.sendRequest(oSendOpts);

}

    // 有数据
function drawTypePie(data)
{
    
    var oData = data.client_statistic;
    var aData = [];
    var aTotal = [];
    $.each(oData, function(index,ele){
        var sGHz = index.indexOf("a") == -1?"(2.4GHz)":"(5GHz)";
        if(ele == "0"){
            aData.push({name : "802." + index + sGHz});
            return;
        };
        aData.push({
            name : "802." + index + sGHz,
            value : ele
        });
    });
    var nB = oData["11b"];
    var nG = oData["11g"];
    var nGn = oData["11gn"];
    var nA = oData["11a"];
    var nAn = oData["11an"];
    var nAc = oData["11ac"];
    var nT = nB + nG + nGn;
    var nF = nA + nAn + nAc;
    if(nT != 0){aTotal.push({name : "2.4GHz", value : nT, itemStyle:{normal:{color:"#b3b7dd"}}})}
    if(nF != 0){aTotal.push({name : "5GHz", value : nF, itemStyle:{normal:{color:"#4ec1b2"}}})}
    var oOpts = {
        animation : true,
        calculable : false,
        height : 255,
        legend : {
            orient : "vertical",
            y : "bottom",
            data : [
                "802.11ac(5GHz)",
                "802.11an(5GHz)",
                "802.11a(5GHz)",
                "",
                "802.11gn(2.4GHz)",
                "802.11g(2.4GHz)",
                "802.11b(2.4GHz)"
                // {name : "802.11ac(5GHz)", icon : "pie"},
                // {name : "802.11an(5GHz)", icon : "pie"},
                // {name : "802.11a(5GHz)", icon:"pie"},
                // {name : ""},
                // {name : "802.11gn(2.4GHz)", icon : "pie"},
                // {name : "802.11g(2.4GHz)", icon : "pie"},
                // {name : "802.11b(2.4GHz)", icon : "pie"}
            ]
        },
        tooltip : {
            show:true,
            formatter: "{b}:<br/> {c} ({d}%)"
        },
        series : [
            {
               type : "pie",
               clockWise: true,//false,
                radius : [0, "30%"],
                center : ["50%", "30%"],
                itemStyle : {
                    normal : {
                        borderColor : "#fff",
                        borderWidth : 1,
                        label : {
                            position : "inner",
                            textStyle : {
                                color : "#fff"
                            }
                        },
                        labelLine : false
                    }
                },
                data : aTotal 
            },
            {
                name : PIE_NAME[1],
                type : "pie",
                clockWise: true,//false,
                radius : ['38%','60%'],
                center : ["50%", "30%"],
                itemStyle : {
                    normal : {
                        borderColor : "#FFF",
                        borderWidth : 1,
                        label : {
                            position : "inner",
                            textStyle : {color : "#fff"},
                            formatter : function(value){
                                var percent = parseInt(value.percent);
                                if (percent == 0) {
                                    return "";
                                }
                                return percent + "%";
                            }
                        },
                        labelLine : false
                    }
                },
                data: aData
            }
        ],
        click : onTypePieClick
    };

    var oTheme = {color : ["#4ec1b2","#95dad1","#caece8","#b3b7dd","#d1d4eb","#e8e9f5"]};

   $("#terminalTypePie").echart("init", oOpts, oTheme);
}

    // 获取数据
function get_TypePie_Data()
{
    function getSucc(data)
    {
       // var data =  {
       //      "client_statistic": {
       //          "11b": 1,
       //          "11g": 1,
       //          "11gn": 1,
       //          "11a": 1,
       //          "11an": 1,
       //          "11ac": 1
       //      }
       //  }
        var oClient = data.client_statistic;

        var nTotal = oClient["11b"] + oClient["11g"]
            + oClient["11gn"] + oClient["11a"] 
            + oClient["11an"] + oClient["11ac"];
        if(data && data.errcode !== "illegal access" && nTotal)
        {
            drawTypePie(data); 
        }
        else
        {
            drawTypeNullPie();
        }
    }

    function getFail()
    {
        throw new Error("get_TypeData_Fail");
        drawTypeNullPie();
    }

    var oSendOpts = {
        type : "GET",
        url : MyConfig.path + "/stamonitor/getclientstatisticbymode?devSN=" + FrameInfo.ACSN,
        dataType : "json",
        onSuccess : getSucc,
        onFailed : getFail
    };

    Utils.Request.sendRequest(oSendOpts);
}

// 终端厂商_饼图
    // 空
function drawFirmNullPie()
{
    var oOpts = {
        height : 255,
        calculable : false,
        // legend : {
        //     orient : "vertical",
        //     y : "bottom",
        //     data : [
        //         "Max",
        //         "Apple",
        //         "windows",
        //         "",
        //         "Other",
        //         "MZ",
        //         "其它"
        //     ]
        // },
        series : [
            {
                type : "pie",
                radius : "50%",
                center : ["50%", "30%"],
                itemStyle : {
                    normal : {
                        label : {position : "inner"},
                        labelLine : {show : false}
                    }
                },
                data : [
                    {name : "N/A", value : 1}
                    // ,
                    // {value:0, name:'Max', itemStyle:{normal :{color:'#fbceb1'}}},
                    // {value:0, name:'Apple', itemStyle:{normal :{color:'#4ec1b2'}}},
                    // {value:0, name:'windows', itemStyle:{normal :{color:'#b3b7dd'}}},
                    // {value:0, name:'Other', itemStyle:{normal :{color:'#4fcff6'}}},
                    // {value:0, name:'MZ', itemStyle:{normal :{color:'#fe808b'}}},
                    // {value:0, name:'其它', itemStyle:{normal :{color:'#e7e7e9'}}}
                ]
            }
        ]
    };

    var oTheme={color : ["rgba(216, 216, 216, 0.75)"]};

    $("#terminalFirmPie").echart("init", oOpts, oTheme);    
}
    // 终端厂商 弹出终端列表 大数据批量查询请求
function termFirmSendAjax(nPageNum, oData) {

    function getSucc(data) {
        var all=getModeList(data.clientList.clientInfo);
        $("#ByFirmPopList").SList("refresh", {
            total : parseInt(data.clientList.count_total),
            pageNum : nPageNum,
            data : all
        });
    }

    function getFail() {
        throw new Error("get_Fail");
    }

    var oSendOpts = {
        type : "POST",
        url : MyConfig.path + "/stamonitor/getclientlist_bymodeorvendor?devSN=" + FrameInfo.ACSN
            + "&vendor=" + g_sTermVendor + "&limitnum=" + oData.limit + "&skipnum=" + oData.skip,
        dataType : "json",
        contentType: "application/json",
        data: JSON.stringify(oData.body),
        onSuccess : getSucc,
        onFailed : getFail
    };

    Utils.Request.sendRequest(oSendOpts);
}

function init_Firm_List()
{
    var optPortalPop ={
        colNames:getRcText ("PORTAL_TERMINAL"),
        asyncPaging: true,
        showHeader:true,
        pageSize : 10,
        colModel: [
            {name:"clientMAC",datatype:"String"},
            {name:"clientIP",datatype:"String"},
            {name:"clientVendor",datatype:"String"},
            {name:"ApName",datatype:"String"},
            {name:"clientSSID",datatype:"String"}
        ],
        onPageChange: function (pageNum, pageSize, oFilter, oSorter) {

            var oParam = {
                devSN: FrameInfo.ACSN,
                vendor: g_sTermVendor,
                limit: pageSize,
                skip: (pageNum - 1) * pageSize,
                body : {
                    findoption: {},
                    sortoption: {}
                }
            };

            if( oFilter ) { // 无任何筛选条件时，oFilter是null
                
                if( oFilter.hasOwnProperty("clientMAC") ) {
                    oParam.body.findoption.clientMAC = oFilter.clientMAC;
                }
                if ( oFilter.hasOwnProperty("clientIP") ) {
                    oParam.body.findoption.clientIP = oFilter.clientIP;
                }
                if ( oFilter.hasOwnProperty("clientVendor") ) {
                    oParam.body.findoption.clientVendor =  oFilter.clientVendor ;
                }
                if ( oFilter.hasOwnProperty("ApName") ) {
                    oParam.body.findoption.ApName =  oFilter.ApName ;
                }
                if ( oFilter.hasOwnProperty("clientSSID") ) {
                    oParam.body.findoption.clientSSID =  oFilter.clientSSID ;
                }
            }
                
            if( oSorter ) {
                var sName = oSorter.name;
                oParam.body.sortoption[sName] = getBoolToNum( oSorter.isDesc );
            }

            termFirmSendAjax(pageNum, oParam);
        },
        onSearch: function (oFilter, oSorter) {

            var oParam = {
                devSN: FrameInfo.ACSN,
                vendor: g_sTermVendor,
                limit: 10,
                skip: 0,
                body : {
                    findoption: {},
                    sortoption: {}
                }
            };

            if( oFilter ) { // 无任何筛选条件时，oFilter是null
                
                if( oFilter.hasOwnProperty("clientMAC") ) {
                    oParam.body.findoption.clientMAC = oFilter.clientMAC;
                }
                if ( oFilter.hasOwnProperty("clientIP") ) {
                    oParam.body.findoption.clientIP = oFilter.clientIP;
                }
                if ( oFilter.hasOwnProperty("clientVendor") ) {
                    oParam.body.findoption.clientVendor =  oFilter.clientVendor ;
                }
                if ( oFilter.hasOwnProperty("ApName") ) {
                    oParam.body.findoption.ApName =  oFilter.ApName ;
                }
                if ( oFilter.hasOwnProperty("clientSSID") ) {
                    oParam.body.findoption.clientSSID =  oFilter.clientSSID ;
                }
            }
                
            if( oSorter ) {
                var sName = oSorter.name;
                oParam.body.sortoption[sName] = getBoolToNum( oSorter.isDesc );
            }

            termFirmSendAjax(1, oParam);
        },
        onSort:function(sName, isDesc) {
            var oParam = {
                devSN: FrameInfo.ACSN,
                vendor: g_sTermVendor,
                limit: 10,
                skip: 0,
                body: { sortoption: { } }
            };
            oParam.body.sortoption[sName] = getBoolToNum( isDesc );
            termFirmSendAjax(1, oParam);
        }
    };
    $("#ByFirmPopList").SList ("head",optPortalPop);

}
 // 点击
function onFirmPieClick(oPiece)
{
    function getSucc(data)
    {
        Utils.Base.openDlg(null, {}, {scope:$("#ByFirm_diag"),className:"modal-super dashboard"});
        var all=getModeList(data.clientList.clientInfo);
        $("#ByFirmPopList").SList("refresh", {
            total : parseInt(data.clientList.count_total),
            pageNum : 1,
            data : all
        });
        $("#ByFirmPopList").SList("resize");
        return false; 
    }

    function getFail()
    {
        throw new Error("get_Fail");
    }

    g_sTermVendor = oPiece.name;

    var oSendOpts = {
        type : "POST",
        url : MyConfig.path 
            + "/stamonitor/getclientlist_bymodeorvendor?devSN=" + FrameInfo.ACSN
            + "&vendor=" + g_sTermVendor + "&skipnum=0&limitnum=10",
        dataType : "json",
        contentType: "application/json",
        data: JSON.stringify({
            findoption: {},
            sortoption: {}
        }),
        onSuccess : getSucc,
        onFailed : getFail
    };

    Utils.Request.sendRequest(oSendOpts);
}

    // 有数据
function drawFirmPie(data)
{
    var aData = data.client_statistic;
    var aFirm = [];
    var alegendData =[];
    $.each(aData, function (index, ele){
        aFirm.push({name:ele.clientVendor || "未知",value:ele.count})
    });
    $.each(aData, function (index, ele){
        alegendData.push(ele.clientVendor || "未知")
        if( (index + 1) % 3 == 0) {
            alegendData.push("");
        }
    });
    var oOpts = {
        animation : true,
        calculable : false,
        height : 255,
        legend : {
            orient : "vertical",
            x : "center",
            y : "bottom",
            data : alegendData
        },
        tooltip : {
            show:true,
            formatter: "{b}:<br/> {c} ({d}%)"
        },
        series : [
            {
                name : PIE_NAME[1],
                type : "pie",
                minAngle : "3",
                radius : ['38%','60%'],
                center : ["50%", "30%"],
                itemStyle : {
                    normal : {
                        borderColor : "#FFF",
                        borderWidth : 1,
                        label : {
                            position : "inner",
                            textStyle : {color : "#fff"},
                            formatter : function(value){
                                var percent = parseInt(value.percent);
                                if(percent == 0) {
                                    return "";
                                }
                                return percent + "%"
                            }
                        },
                        labelLine : false
                    }
                },
                data:aFirm

                    // {name : data., value : 1},
                    // {value:0, name:'Max', itemStyle:{normal :{color:'#fbceb1'}}},
                    // {value:0, name:'Apple', itemStyle:{normal :{color:'#4ec1b2'}}},
                    // {value:0, name:'windows', itemStyle:{normal :{color:'#b3b7dd'}}},
                    // {value:0, name:'Other', itemStyle:{normal :{color:'#4fcff6'}}},
                    // {value:0, name:'MZ', itemStyle:{normal :{color:'#fe808b'}}},
                    // {value:0, name:'其它', itemStyle:{normal :{color:'#e7e7e9'}}}
                
            }
        ],
        click : onFirmPieClick
    };

    var oTheme = {color : ["#fbceb1","#4ec1b2","#b3b7dd","#4fcff6","#fe808b","#e7e7e9"]};

   $("#terminalFirmPie").echart("init", oOpts, oTheme);
}
    // 获取数据
function get_FirmPie_Data()
{
    function getSucc(data)
    {
        if(data.client_statistic.length==0)
        {
           drawFirmNullPie();
           return;
        }
        if(data && data.errcode !== "illegal access")
        {
            drawFirmPie(data); 
        }
        else
        {
            drawFirmNullPie();
        }
    }

    function getFail()
    {
        throw new Error("get_FirmData_Fail");
        drawFirmNullPie();
    }

    var oSendOpts = {
        type : "GET",
        url : MyConfig.path + "/stamonitor/getclientstatisticbybyod?devSN=" + FrameInfo.ACSN,
        dataType : "json",
        onSuccess : getSucc,
        onFailed : getFail
    };

    Utils.Request.sendRequest(oSendOpts);
}

// 无线服务列表
function init_WLSrevice_List()
{
    var oOpts = {
        colNames: getRcText ("SLIST_ONE_LABELS"),
        showHeader: true,
        multiSelect: false,
        pageSize:4,
        rowHeight:45.25,
        colModel: [
            {name:'stName',datatype:'String'},
            {name:'ssid',datatype:'String'},
            {name:'ssidStatus', datatype: "Order", data: getRcText("ON_OFF")},
            {name:'ssidType', datatype:"Order", data: getRcText("WL_SSID_TYPE")},
            {name:'authType', datatype:"Order", data: getRcText("WL_AUTH_TYPE")},
            {name:'clientNum', datatype:"String",formatter:showWLNum},
            {name:'apNum', datatype:"String",formatter:showWLNum},
            {name:'apGroupNum', datatype:"String",formatter:showWLNum}
      ]
    };
    $("#WlServiceList").SList ("head", oOpts);
}

function WLClientSendAjax(nPageNum, oData) {

    function getSucc(data) {
        var all=getModeList(data.clientList.clientInfo);
        $("#ByWLClientPopList").SList("refresh", {
            total : parseInt(data.clientList.count_total),
            pageNum : nPageNum,
            data : all
        });
    }

    function getFail() {
        throw new Error("get_Fail");
    }

    var oSendOpts = {
        type : "POST",
        url : MyConfig.path + "/stamonitor/getclientlist_bymodeorvendor?devSN=" + FrameInfo.ACSN
            + "&ssid=" + g_SSID + "&limitnum=" + oData.limit + "&skipnum=" + oData.skip,
        dataType : "json",
        contentType: "application/json",
        data: JSON.stringify(oData.body),
        onSuccess : getSucc,
        onFailed : getFail
    };

    Utils.Request.sendRequest(oSendOpts);
}

function WLAPSendAjax(nPageNum, oData) {

    function getSucc(data) {
        $("#ByWLAPPopList").SList("refresh", {
            total : parseInt(data.stBindList.apTotalCnt),
            pageNum : nPageNum,
            data : data.stBindList.bindApList
        });
    }

    function getFail() {
        throw new Error("get_Fail");
    }

    var oSendOpts = {
        type : "POST",
        url : MyConfig.path 
            + "/ssidmonitor/getstbindlist?devSN=" + FrameInfo.ACSN
            + "&stName=" + g_stName + "&skipnum=" + oData.skip + "&limitnum=" + oData.limit,
        dataType : "json",
        contentType: "application/json",
        data: JSON.stringify(oData.body),
        onSuccess : getSucc,
        onFailed : getFail
    };

    Utils.Request.sendRequest(oSendOpts);
}

function WLAPGroupSendAjax(nPageNum, oData) {

    function getSucc(data) {
        $("#ByWLAPGroupPopList").SList("refresh", {
            total : parseInt(data.stBindList.apGrpTotalCnt),
            pageNum : nPageNum,
            data : data.stBindList.bindApGroupList
        });
    }

    function getFail() {
        throw new Error("get_Fail");
    }

    var oSendOpts = {
        type : "POST",
        url : MyConfig.path 
            + "/ssidmonitor/getstbindlist?devSN=" + FrameInfo.ACSN
            + "&stName=" + g_stName + "&skipnum=" + oData.skip + "&limitnum=" + oData.limit,
        dataType : "json",
        contentType: "application/json",
        data: JSON.stringify(oData.body),
        onSuccess : getSucc,
        onFailed : getFail
    };

    Utils.Request.sendRequest(oSendOpts);
}

function init_WLClient_List() {
    var optPortalPop ={
        colNames:getRcText ("PORTAL_TERMINAL"),
        showHeader:true,
        asyncPaging: true,
        pageSize : 10,
        colModel: [
            {name:"clientMAC",datatype:"String"},
            {name:"clientIP",datatype:"String"},
            {name:"clientVendor",datatype:"String"},
            {name:"ApName",datatype:"String"},
            {name:"clientSSID",datatype:"String"}
        ],
        onPageChange: function (pageNum, pageSize, oFilter, oSorter) {

            var oParam = {
                devSN: FrameInfo.ACSN,
                vendor: g_sTermVendor,
                limit: pageSize,
                skip: (pageNum - 1) * pageSize,
                body : {
                    findoption: {},
                    sortoption: {}
                }
            };

            if( oFilter ) { // 无任何筛选条件时，oFilter是null
                
                if( oFilter.hasOwnProperty("clientMAC") ) {
                    oParam.body.findoption.clientMAC = oFilter.clientMAC;
                }
                if ( oFilter.hasOwnProperty("clientIP") ) {
                    oParam.body.findoption.clientIP = oFilter.clientIP;
                }
                if ( oFilter.hasOwnProperty("clientVendor") ) {
                    oParam.body.findoption.clientVendor = oFilter.clientVendor ;
                }
                if ( oFilter.hasOwnProperty("ApName") ) {
                    oParam.body.findoption.ApName = oFilter.ApName ;
                }
                if ( oFilter.hasOwnProperty("clientSSID") ) {
                    oParam.body.findoption.clientSSID = oFilter.clientSSID ;
                }
            }
                
            if( oSorter ) {
                var sName = oSorter.name;
                oParam.body.sortoption[sName] = getBoolToNum( oSorter.isDesc );
            }

            WLClientSendAjax(pageNum, oParam);
        },
        onSearch: function (oFilter, oSorter) {

            var oParam = {
                devSN: FrameInfo.ACSN,
                vendor: g_sTermVendor,
                limit: 10,
                skip: 0,
                body : {
                    findoption: {},
                    sortoption: {}
                }
            };

            if( oFilter ) { // 无任何筛选条件时，oFilter是null
                
                if( oFilter.hasOwnProperty("clientMAC") ) {
                    oParam.body.findoption.clientMAC = oFilter.clientMAC;
                }
                if ( oFilter.hasOwnProperty("clientIP") ) {
                    oParam.body.findoption.clientIP = oFilter.clientIP;
                }
                if ( oFilter.hasOwnProperty("clientVendor") ) {
                    oParam.body.findoption.clientVendor = oFilter.clientVendor ;
                }
                if ( oFilter.hasOwnProperty("ApName") ) {
                    oParam.body.findoption.ApName = oFilter.ApName ;
                }
                if ( oFilter.hasOwnProperty("clientSSID") ) {
                    oParam.body.findoption.clientSSID = oFilter.clientSSID ;
                }
            }
                
            if( oSorter ) {
                var sName = oSorter.name;
                oParam.body.sortoption[sName] = getBoolToNum( oSorter.isDesc );
            }

            WLClientSendAjax(1, oParam);
        },
        onSort:function(sName, isDesc) {
            var oParam = {
                devSN: FrameInfo.ACSN,
                vendor: g_sTermVendor,
                limit: 10,
                skip: 0,
                body: { sortoption: { } }
            };
            oParam.body.sortoption[sName] = getBoolToNum( isDesc );
            WLClientSendAjax(1, oParam);
        }
    };
    $("#ByWLClientPopList").SList ("head",optPortalPop);
}

function init_WLAP_List() {
    var optPortalPop ={
        colNames:getRcText ("WL_APLIST_HEADER"),
        showHeader:true,
        asyncPaging: true,
        pageSize : 10,
        colModel: [
            {name:"apName",datatype:"String"},
            {name:"apGroupName",datatype:"String"},
            {name:"branch",datatype:"String"}
        ],
        onPageChange: function (pageNum, pageSize, oFilter, oSorter) {

            var oParam = {
                devSN: FrameInfo.ACSN,
                limit: pageSize,
                skip: (pageNum - 1) * pageSize,
                body : {
                    findoption: {},
                    sortoption: {}
                }
            };

            if( oFilter ) { // 无任何筛选条件时，oFilter是null
                if( oFilter.hasOwnProperty("apName") ) {
                    oParam.body.findoption.apName = oFilter.apName;
                }
                if ( oFilter.hasOwnProperty("apGroupName") ) {
                    oParam.body.findoption.apGroupName = oFilter.apGroupName;
                }
                if ( oFilter.hasOwnProperty("branch") ) {
                    oParam.body.findoption.branch = oFilter.branch ;
                }
            }
                
            if( oSorter ) {
                var sName = oSorter.name;
                oParam.body.sortoption[sName] = getBoolToNum( oSorter.isDesc );
            }

            WLAPSendAjax(pageNum, oParam);
        },
        onSearch: function (oFilter, oSorter) {

            var oParam = {
                devSN: FrameInfo.ACSN,
                limit: 10,
                skip: 0,
                body : {
                    findoption: {},
                    sortoption: {}
                }
            };

            if( oFilter ) { // 无任何筛选条件时，oFilter是null
                if( oFilter.hasOwnProperty("apName") ) {
                    oParam.body.findoption.apName = oFilter.apName;
                }
                if ( oFilter.hasOwnProperty("apGroupName") ) {
                    oParam.body.findoption.apGroupName = oFilter.apGroupName;
                }
                if ( oFilter.hasOwnProperty("branch") ) {
                    oParam.body.findoption.branch = oFilter.branch ;
                }
            }
                
            if( oSorter ) {
                var sName = oSorter.name;
                oParam.body.sortoption[sName] = getBoolToNum( oSorter.isDesc );
            }

            WLAPSendAjax(1, oParam);
        },
        onSort:function(sName, isDesc) {
            var oParam = {
                devSN: FrameInfo.ACSN,
                limit: 10,
                skip: 0,
                body: { sortoption: { } }
            };
            oParam.body.sortoption[sName] = getBoolToNum( isDesc );
            WLAPSendAjax(1, oParam);
        }
    };
    $("#ByWLAPPopList").SList ("head",optPortalPop);
}

function init_WLAPGroup_List() {
    var optPortalPop ={
        colNames:getRcText ("WL_APGROUPLIST_HEADER"),
        showHeader:true,
        asyncPaging: true,
        pageSize : 10,
        colModel: [
            {name:"apGroupName",datatype:"String"},
            {name:"description",datatype:"String"},
            {name:"branch",datatype:"String"}
        ],
        onPageChange: function (pageNum, pageSize, oFilter, oSorter) {

            var oParam = {
                devSN: FrameInfo.ACSN,
                limit: pageSize,
                skip: (pageNum - 1) * pageSize,
                body : {
                    findoption: {},
                    sortoption: {}
                }
            };

            if( oFilter ) { // 无任何筛选条件时，oFilter是null
                
                if( oFilter.hasOwnProperty("apGroupName") ) {
                    oParam.body.findoption.apGroupName = oFilter.apGroupName;
                }
                if ( oFilter.hasOwnProperty("description") ) {
                    oParam.body.findoption.description = oFilter.description;
                }
                if ( oFilter.hasOwnProperty("branch") ) {
                    oParam.body.findoption.branch = oFilter.branch ;
                }
            }
                
            if( oSorter ) {
                var sName = oSorter.name;
                oParam.body.sortoption[sName] = getBoolToNum( oSorter.isDesc );
            }

            WLAPGroupSendAjax(pageNum, oParam);
        },
        onSearch: function (oFilter, oSorter) {

            var oParam = {
                devSN: FrameInfo.ACSN,
                limit: 10,
                skip: 0,
                body : {
                    findoption: {},
                    sortoption: {}
                }
            };

            if( oFilter ) { // 无任何筛选条件时，oFilter是null
                
                if( oFilter.hasOwnProperty("apGroupName") ) {
                    oParam.body.findoption.apGroupName = oFilter.apGroupName;
                }
                if ( oFilter.hasOwnProperty("description") ) {
                    oParam.body.findoption.description = oFilter.description;
                }
                if ( oFilter.hasOwnProperty("branch") ) {
                    oParam.body.findoption.branch = oFilter.branch ;
                }
            }
                
            if( oSorter ) {
                var sName = oSorter.name;
                oParam.body.sortoption[sName] = getBoolToNum( oSorter.isDesc );
            }

            WLAPGroupSendAjax(1, oParam);
        },
        onSort:function(sName, isDesc) {
            var oParam = {
                devSN: FrameInfo.ACSN,
                limit: 10,
                skip: 0,
                body: { sortoption: { } }
            };
            oParam.body.sortoption[sName] = getBoolToNum( isDesc );
            WLAPGroupSendAjax(1, oParam);
        }
    };
    $("#ByWLAPGroupPopList").SList ("head",optPortalPop);
}

    // TODO: 获取三个列表数据
function get_WLClientList_Date() {

    function getSucc(data) {
        var all=getModeList(data.clientList.clientInfo);
        $("#ByWLClientPopList").SList("refresh", {
            total : parseInt(data.clientList.count_total),
            pageNum : 1,
            data : all
        });
    }

    function getFail() {
        throw new Error("get_Fail");
    }

    var oSendOpts = {
        type : "POST",
        url : MyConfig.path 
            + "/stamonitor/getclientinfo_byssid?devSN=" + FrameInfo.ACSN
            + "&ssid=" + g_SSID + "&skipnum=0&limitnum=10",
        dataType : "json",
        contentType: "application/json",
        data: JSON.stringify({
            findoption: {},
            sortoption: {}
        }),
        onSuccess : getSucc,
        onFailed : getFail
    };

    Utils.Request.sendRequest(oSendOpts);
}

function get_WLAPList_Date() {

    function getSucc(data) {

        $("#ByWLAPPopList").SList("refresh", {
            total : parseInt(data.stBindList.apTotalCnt),
            pageNum : 1,
            data : data.stBindList.bindApList
        });
    }

    function getFail() {
        throw new Error("get_Fail");
    }

    var oSendOpts = {
        type : "POST",
        url : MyConfig.path 
            + "/ssidmonitor/getstbindlist?devSN=" + FrameInfo.ACSN
            + "&stName=" + g_stName + "&skipnum=0" + "&limitnum=10",
        dataType : "json",
        contentType: "application/json",
        data: JSON.stringify({
            findoption: {},
            sortoption: {}
        }),
        onSuccess : getSucc,
        onFailed : getFail
    };

    Utils.Request.sendRequest(oSendOpts);
}

function get_WLAPGroupList_Date() {

    function getSucc(data) {
        $("#ByWLAPGroupPopList").SList("refresh", {
            total : parseInt(data.stBindList.apGrpTotalCnt),
            pageNum : 1,
            data : data.stBindList.bindApGroupList
        });
    }

    function getFail() {
        throw new Error("get_Fail");
    }

    var oSendOpts = {
        type : "POST",
        url : MyConfig.path 
            + "/ssidmonitor/getstbindlist?devSN=" + FrameInfo.ACSN
            + "&stName=" + g_stName + "&skipnum=0" + "&limitnum=10",
        dataType : "json",
        contentType: "application/json",
        data: JSON.stringify({
            findoption: {},
            sortoption: {}
        }),
        onSuccess : getSucc,
        onFailed : getFail
    };

    Utils.Request.sendRequest(oSendOpts);
}
    // 数字初始化
function showWLNum(row, cell, value, columnDef, oRowData, sType) {
    if(sType == "text"||value=="0") {
        return value;
    }

    return "<a class='list-link' ssid='" + oRowData.ssid+ "' stName='" + oRowData.stName + "' href='javascript:void(0);'>" + value +"</a>";
}
    // 绑定click show list 事件
function onWLNumClick(rows) {
    g_SSID = $(this).attr("ssid");
    g_stName = $(this).attr("stName");
    if( $(this).parent().hasClass("sl5") ) {
        Utils.Base.openDlg(null, {}, {scope:$("#ByWLClient_diag"),className:"modal-super dashboard"});
        get_WLClientList_Date();
        $("#ByWLClientPopList").SList("resize");
    }else if( $(this).parent().hasClass("sl6") ) {
        Utils.Base.openDlg(null, {}, {scope:$("#ByWLAP_diag"),className:"modal-super dashboard"});
        get_WLAPList_Date();
        $("#ByWLAPPopList").SList("resize");
    }else if( $(this).parent().hasClass("sl7") ){
        Utils.Base.openDlg(null, {}, {scope:$("#ByWLAPGroup_diag"),className:"modal-super dashboard"});
        get_WLAPGroupList_Date();
        $("#ByWLAPGroupPopList").SList("resize");
    }else{}

}

    // 获取无线服务列表数据
function get_WLSreviceList_Data()
{
    function getSucc(data)
    {
        if('{"errcode":"illegal access"}' == data){
                console.log("没有权限")
        }
        else{
            var aData = [];
            var aStatus = getRcText("STATUS").split(',');
            $.each(data.ssidList,function(index,iDate){
                aData.push({
                    stName:  iDate.stName,
                    ssidStatus: iDate.status - 1,//aStatus[iDate.status],
                    ssid: iDate.ssidName,
                    ssidType: iDate.description,
                    authType: iDate.lvzhouAuthMode,
                    apNum: iDate.ApCnt,
                    apGroupNum: iDate.ApGroupCnt,
                    clientNum: iDate.clientCount,
                    stName: iDate.stName
                });
                
                
            });
            $("#WlServiceList").SList ("refresh", aData);

            $("#WlServiceList").on("click", "a.list-link", onWLNumClick);
        }
    }

    function getFail()
    {

    }

    var ssidFlowOpt = {
        url: MyConfig.path + "/ssidmonitor/getssidinfobrief?devSN=" + FrameInfo.ACSN
            + "&shopName=" + Utils.Device.deviceInfo.shop_name
            + "&ownerName=" + FrameInfo.g_user.user,
        type: "GET",
        dataType: "json",
        contentType: "application/json",
        onSuccess:getSucc,
        onFailed:getFail
    };

    Utils.Request.sendRequest(ssidFlowOpt);
}

/***********************************/

function timeStatus (time) {
// body...
    if (time < 10)
    {
        return "0" + time;
    }
    return time;
}
function drawChart(oData)
{
    var aSpeedUp = [];
    var aSpeedDown = [];
    var aTimes = [];
    oData = oData.reverse();
    $.each(oData,function(i,oData){
        aSpeedUp.push(oData.speed_up);
        aSpeedDown.push(-oData.speed_down);
        var temp = new Date(oData.updateTime);
        aTimes.push(timeStatus(temp.getHours())+":"+timeStatus(temp.getMinutes())+":"+timeStatus(temp.getSeconds()));
    }); 
    var aStream = getRcText("STREAM").split(",");
    var option = {
        width:"100%",
        height:210,
        tooltip: {
            show: true,
            trigger: 'axis',
            axisPointer:{
                type : 'line',
                lineStyle : {
                  color: '#80878C',
                  width: 2,
                  type: 'solid'
                }
            },
            formatter:function(y,x){
                var sTips = y[0][1];
                for(var i = 0; i < y.length; i++)
                {
                    sTips = sTips + "<br/>" + y[i][0] + ":" + Utils.Base.addComma(Math.abs(y[i][2]),"rate",1);
                }
                return sTips;
            }
        },
        legend: {
            orient: "horizontal",
            y: 0,
            x: "center",
            data: aStream
        },
        grid: {
            x: 65, y: 40,
            borderColor: '#FFF'
        },
        calculable: false,
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                splitLine:true,
                axisLine  : {
                    show:true,
                    lineStyle :{color: '#80878C', width: 2}
                },
                axisLabel: {
                    show: true,
                    textStyle:{color: '#80878C', width: 2}
                },
                axisTick :{
                    show:false
                },
                data: aTimes
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLabel: {
                    show: true,
                    textStyle:{color: '#80878C', width: 2},
                    formatter:function(nNum){
                        return Utils.Base.addComma(Math.abs(nNum),'rate',1);
                    }
                },
                axisLine  : {
                    show:true,
                    lineStyle :{color: '#80878C', width: 2}
                }
            }
        ],
        series: [
            {
                symbol: "none", 
                type: 'line', 
                smooth: true,
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                name: aStream[0],
                data: aSpeedUp
            },
            {
                symbol: "none", 
                type: 'line', 
                smooth: true,
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                name: aStream[1],
                data: aSpeedDown
            }
        ]

    };
    var oTheme = {
        color: ["rgba(242,188,152,1)","rgba(120,206,192,0.6)"],
    };
    g_oLineChart = $("#usage").echart ("init", option,oTheme);
    // Interval();
}

function drawChartWan (aData) {
    var aSpeedUp = [];
    var aSpeedDown = [];
    var aSpeedUp2 = [];
    var aSpeedDown2 = [];
    var aTimes = [];
    var aServices = [];
    var aLegend = [];
    var aTooltip = [];
    var reg = /./;
    var reg2 = /G\d{1,2}/;
    var aStream = getRcText("STREAM").split(",");
    var aColor = ["rgba(120,206,195,1)","rgba(254,240,231,1)","rgba(144,129,148,1)","rgba(254,184,185,1)"];
    $.each(aData,function (i,oData) {
        var aUp = [];
        var aDown = [];
        aData[i] = aData[i].reverse();
        $.each(aData[i],function(j,oData){
            aUp.push(oData.speed_up);
            aDown.push(-oData.speed_down);
        });
        
        var aName = (aData[i][0].interfaceName).match(reg) + (aData[i][0].interfaceName).split('/').pop();
        var oUp = {
                symbol: "none", 
                type: 'line', 
                smooth: true,
                stack:'总量',
                itemStyle: {normal: {areaStyle: {type: 'default',color:aColor[i]}}},
                name: aName + '流量',
                data: aUp
            };
        var oDown = {
                symbol: "none", 
                type: 'line', 
                smooth: true,
                stack:'总量',
                itemStyle: {normal: {areaStyle: {type: 'default',color:aColor[i]}}},
                name: aName + '流量',
                data: aDown
            }; 
        aServices.push(oUp);
        aServices.push(oDown); 
        aLegend.push(aName + '流量');     
        aTooltip.push(aName + aStream[0]);
        aTooltip.push(aName + aStream[1]);
    });
    aTooltip = aTooltip.reverse();
    $.each(aData[0],function(i,oData){
        var temp = new Date(oData.updateTime);
        aTimes.push(timeStatus(temp.getHours())+":"+timeStatus(temp.getMinutes())+":"+timeStatus(temp.getSeconds()));
    });
    
    var option = {
        width:"100%",
        height:210,
        tooltip: {
            show: true,
            trigger: 'axis',
            axisPointer:{
                type : 'line',
                lineStyle : {
                  color: '#80878C',
                  width: 2,
                  type: 'solid'
                }
            },
            formatter:function(y,x){
                var sTips = y[0][1];
                var temp = y[0][0].match(reg2)[0];
                for (var j = 0; j < aTooltip.length; j++) {
                    if(temp == aTooltip[j].match(reg2)[0])
                    {
                        break;
                    }
                } 
                for(var i = 0; i < y.length; i++)
                {
                    sTips = sTips + "<br/>" + aTooltip[j+i] + ":" + Utils.Base.addComma(Math.abs(y[i][2]),"rate",1);
                }
                return sTips;
            }
        },
        legend: {
            orient: "horizontal",
            y: 0,
            x: "center",
            data: aLegend
        },
        grid: {
            x: 60, y: 40,
            borderColor: '#FFF'
        },
        calculable: false,
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                splitLine:true,
                axisLine  : {
                    show:true,
                    lineStyle :{color: '#80878C', width: 2}
                },
                axisLabel: {
                    show: true,
                    textStyle:{color: '#80878C', width: 2}
                },
                axisTick :{
                    show:false
                },
                data: aTimes
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLabel: {
                    show: true,
                    textStyle:{color: '#80878C', width: 2},
                    formatter:function(nNum){
                        return Utils.Base.addComma(Math.abs(nNum),'rate',1);
                    }
                },
                axisLine  : {
                    show:true,
                    lineStyle :{color: '#80878C', width: 2}
                }
            }
        ],
        series: aServices,
    };
    var oTheme = {
        color: ["rgba(120,206,195,1)","rgba(254,240,231,1)","rgba(144,129,148,1)","rgba(254,184,185,1)"],
    };
    g_oLineChart = $("#usage").echart ("init", option,oTheme);
}

function configUpPort()
{
    function setUpLinkInterfaceSuc (data) {
        //造假使用
        data.errcode ='0';
        if('{"errcode":"illegal access"}' == data){
            console.log("没有权限")
        }
        else{
            if(data.errcode == '0') {
                $("#config").addClass("hide");
                $("#charts").removeClass("hide");
                $("#usage_block").addClass("hide");
                var aData = JSON.parse(data.histdataList[0]);
                drawChart(aData.dataList);
            }
            else{
                console.log("设置失败")
            };
        }
    }
    function setUpLinkInterfaceFial (data) {
        // body...
    }
    g_sPort = $("#ConfigUpport").val();
    if(!g_sPort)return;
    var setUpLinkInterfaceFlowOpt = {
        url: MyConfig.path +'/devmonitor/setUpLinkInterface',
        type: "GET",
        dataType: "json",
        data:{
                devSN:FrameInfo.ACSN,
                interfaceName:g_sPort
            },
        onSuccess:setUpLinkInterfaceSuc,
        onFailed:setUpLinkInterfaceFial
    };
    Utils.Request.sendRequest(setUpLinkInterfaceFlowOpt);  
}

function setConfigUpport () {
    function setUpLinkInterfaceSuc (data) {
       if('{"errcode":"illegal access"}' == data){
            console.log("没有权限")
        }
        else{
            if(data.errcode == '0') {
                var aData = JSON.parse(data.histdataList[0]);
                drawChart(aData.dataList);
            }
            else{
                console.log("设置失败")
            };
        }
    }
    function setUpLinkInterfaceFial (data) {
        // body...
    }
    $("#usage_block").toggle();
    g_sPort = $("#SetfigUpport").val();
    if(!g_sPort)return;
    var setUpLinkInterfaceFlowOpt = {
        url: MyConfig.path +'/devmonitor/setUpLinkInterface',
        type: "GET",
        dataType: "json",
        data:{
                devSN:FrameInfo.ACSN,
                interfaceName:g_sPort
            },
        onSuccess:setUpLinkInterfaceSuc,
        onFailed:setUpLinkInterfaceFial
    };
    Utils.Request.sendRequest(setUpLinkInterfaceFlowOpt);
}
function getAllInterfacesSuc (data) {
        function getWanInterfaceSuc (data2) {
            var aData=[];
            for (var i = 0; i < data2.histdataList.length; i++) 
            {
                var temp = JSON.parse(data2.histdataList[i]);
                aData[i] = temp.dataList;
            }
            $("#config").addClass("hide");
            $("#charts").removeClass("hide");
            $("#filter_usage").addClass("hide");
            $("#usage_block").addClass("hide");
            drawChartWan(aData);
        }
        function getWanInterfaceFail (data2) {
            // body...
        }
        function getUpLinkInterfaceSuc (data2) {
            var aData = JSON.parse(data2.histdataList[0]);
            $("#config").addClass("hide");
            $("#charts").removeClass("hide");
            $("#usage_block").addClass("hide");
            drawChart(aData.dataList);
            var aIntList = [];
            $.each(data.InterfaceList,function(i,o){
                aIntList.push(o.interfaceName);
            });
            $("#SetfigUpport").singleSelect("InitData",aIntList);
        }
        function getUpLinkInterfaceFail (data) {
            // body...
        }

        for(var i = 0; i < data.InterfaceList.length; i++)
        {
            if(data.InterfaceList[i].interfaceType == 1)
            {
                var wanInterfaceFlowOpt = {
                    url:  MyConfig.path +"/devmonitor/getUpLinkInterfaceData",
                    type: "GET",
                    dataType:"json",
                    data:{
                        devSN:FrameInfo.ACSN,
                        interfaceType:1
                    },
                    onSuccess:getWanInterfaceSuc,
                    onFailed:getWanInterfaceFail 
                };
                Utils.Request.sendRequest(wanInterfaceFlowOpt);
                return;
            }
        }
        for(var i = 0; i < data.InterfaceList.length; i++)
        {
            if(data.InterfaceList[i].interfaceType == 3)
            {
                var UpLinkInterfaceFlowOpt = {
                    url:  MyConfig.path +"/devmonitor/getUpLinkInterfaceData",
                    type: "GET",
                    dataType:"json",
                    data:{
                        devSN:FrameInfo.ACSN,
                        interfaceType:2
                    },
                    onSuccess:getUpLinkInterfaceSuc,
                    onFailed:getUpLinkInterfaceFail 
                };
                Utils.Request.sendRequest(UpLinkInterfaceFlowOpt);
                return;
            }
        }
        var aIntList = [];
        $.each(data.InterfaceList,function(i,o){
            aIntList.push(o.interfaceName);
        });
        $("#ConfigUpport").singleSelect("InitData",aIntList);
        $("#SetfigUpport").singleSelect("InitData",aIntList);
    }
    function getAllInterfacesFail (data) {
        // body...
        var data = {"InterfaceList":[{"interfaceName":"GigabitEthernet1/0/1","interfaceType":3},{"interfaceName":"GigabitEthernet1/0/2","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/3","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/4","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/5","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/6","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/7","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/8","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/9","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/10","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/11","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/12","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/13","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/14","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/15","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/16","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/17","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/18","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/19","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/20","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/21","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/22","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/23","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/24","interfaceType":2},{"interfaceName":"Ten-GigabitEthernet1/0/25","interfaceType":2},{"interfaceName":"Ten-GigabitEthernet1/0/26","interfaceType":2},{"interfaceName":"Ten-GigabitEthernet1/0/27","interfaceType":2},{"interfaceName":"Ten-GigabitEthernet1/0/28","interfaceType":2}]};
        function getUpLinkInterfaceSuc (data2) {
            var aData = JSON.parse(data2.histdataList[0]);
            $("#config").addClass("hide");
            $("#charts").removeClass("hide");
            $("#usage_block").addClass("hide");
            drawChart(aData.dataList);
            var aIntList = [];
            $.each(data.InterfaceList,function(i,o){
                aIntList.push(o.interfaceName);
            });
            $("#SetfigUpport").singleSelect("InitData",aIntList);
        }
        function getUpLinkInterfaceFail (data2) {
            // body...
            var data2 = {"histdataList":["{\"interfaceName\":\"GigabitEthernet1/0/1\",\"dataList\":[{\"_id\":\"5742bff25a35950100bbc6b0\",\"speed_up\":0,\"speed_down\":0,\"downflow\":20922,\"upflow\":852,\"status\":1,\"describe\":\"GigabitEthernet1/0/1 Interface\",\"interfaceName\":\"GigabitEthernet1/0/1\",\"devSN\":\"210235A1JT1785638361\",\"updateTime\":\"2016-05-23T08:31:46.949Z\",\"__v\":0},{\"_id\":\"5742bb425a35950100bbc406\",\"speed_up\":0,\"speed_down\":0,\"downflow\":20922,\"upflow\":852,\"status\":1,\"describe\":\"GigabitEthernet1/0/1 Interface\",\"interfaceName\":\"GigabitEthernet1/0/1\",\"devSN\":\"210235A1JT1785638361\",\"updateTime\":\"2016-05-23T08:11:46.697Z\",\"__v\":0},{\"_id\":\"5742b6925a35950100bbc15c\",\"speed_up\":0,\"speed_down\":0,\"downflow\":20922,\"upflow\":852,\"status\":1,\"describe\":\"GigabitEthernet1/0/1 Interface\",\"interfaceName\":\"GigabitEthernet1/0/1\",\"devSN\":\"210235A1JT1785638361\",\"updateTime\":\"2016-05-23T07:51:46.767Z\",\"__v\":0},{\"_id\":\"5742b1e25a35950100bbbeb2\",\"speed_up\":0,\"speed_down\":0,\"downflow\":20922,\"upflow\":852,\"status\":1,\"describe\":\"GigabitEthernet1/0/1 Interface\",\"interfaceName\":\"GigabitEthernet1/0/1\",\"devSN\":\"210235A1JT1785638361\",\"updateTime\":\"2016-05-23T07:31:46.684Z\",\"__v\":0},{\"_id\":\"5742ad325a35950100bbbc08\",\"speed_up\":0,\"speed_down\":0,\"downflow\":20922,\"upflow\":852,\"status\":1,\"describe\":\"GigabitEthernet1/0/1 Interface\",\"interfaceName\":\"GigabitEthernet1/0/1\",\"devSN\":\"210235A1JT1785638361\",\"updateTime\":\"2016-05-23T07:11:46.709Z\",\"__v\":0},{\"_id\":\"5742a8825a35950100bbb95e\",\"speed_up\":0,\"speed_down\":0,\"downflow\":20922,\"upflow\":852,\"status\":1,\"describe\":\"GigabitEthernet1/0/1 Interface\",\"interfaceName\":\"GigabitEthernet1/0/1\",\"devSN\":\"210235A1JT1785638361\",\"updateTime\":\"2016-05-23T06:51:46.728Z\",\"__v\":0},{\"_id\":\"5742a3d25a35950100bbb6b4\",\"speed_up\":0,\"speed_down\":0,\"downflow\":20922,\"upflow\":852,\"status\":1,\"describe\":\"GigabitEthernet1/0/1 Interface\",\"interfaceName\":\"GigabitEthernet1/0/1\",\"devSN\":\"210235A1JT1785638361\",\"updateTime\":\"2016-05-23T06:31:46.633Z\",\"__v\":0},{\"_id\":\"57429f225a35950100bbb40a\",\"speed_up\":0,\"speed_down\":0,\"downflow\":20922,\"upflow\":852,\"status\":1,\"describe\":\"GigabitEthernet1/0/1 Interface\",\"interfaceName\":\"GigabitEthernet1/0/1\",\"devSN\":\"210235A1JT1785638361\",\"updateTime\":\"2016-05-23T06:11:46.570Z\",\"__v\":0},{\"_id\":\"57429a725a35950100bbb16a\",\"speed_up\":0,\"speed_down\":0,\"downflow\":20922,\"upflow\":852,\"status\":1,\"describe\":\"GigabitEthernet1/0/1 Interface\",\"interfaceName\":\"GigabitEthernet1/0/1\",\"devSN\":\"210235A1JT1785638361\",\"updateTime\":\"2016-05-23T05:51:46.570Z\",\"__v\":0},{\"_id\":\"574295c25a35950100bbaec0\",\"speed_up\":0,\"speed_down\":0,\"downflow\":20922,\"upflow\":852,\"status\":1,\"describe\":\"GigabitEthernet1/0/1 Interface\",\"interfaceName\":\"GigabitEthernet1/0/1\",\"devSN\":\"210235A1JT1785638361\",\"updateTime\":\"2016-05-23T05:31:46.450Z\",\"__v\":0}]}"]};
            var aData = JSON.parse(data2.histdataList[0]);
            $("#config").addClass("hide");
            $("#charts").removeClass("hide");
            $("#usage_block").addClass("hide");
            drawChart(aData.dataList);
            var aIntList = [];
            $.each(data.InterfaceList,function(i,o){
                aIntList.push(o.interfaceName);
            });
            $("#SetfigUpport").singleSelect("InitData",aIntList);                
        }
        for(var i = 0; i < data.InterfaceList.length; i++)
        {
            if(data.InterfaceList[i].interfaceType == 3)
            {
                var UpLinkInterfaceFlowOpt = {
                    url:  MyConfig.path +"/devmonitor/getUpLinkInterfaceData",
                    type: "GET",
                    dataType:"json",
                    data:{
                        devSN:FrameInfo.ACSN,
                        interfaceType:2
                    },
                    onSuccess:getUpLinkInterfaceSuc,
                    onFailed:getUpLinkInterfaceFail 
                };
                Utils.Request.sendRequest(UpLinkInterfaceFlowOpt);
                return;
            }
        }
        var aIntList = [];
        $.each(data.InterfaceList,function(i,o){
            aIntList.push(o.interfaceName);
        });
        $("#ConfigUpport").singleSelect("InitData",aIntList);
        $("#SetfigUpport").singleSelect("InitData",aIntList);
    }
    var allInterfaceFlowOpt = {
        url:  MyConfig.path +"/devmonitor/getAllInterfaces",
        type: "GET",
        dataType:"json",
        data:{
            devSN:FrameInfo.ACSN
        },
        onSuccess:getAllInterfacesSuc,
        onFailed:getAllInterfacesFail
    };
    //Utils.Request.sendRequest(allInterfaceFlowOpt);

/****************************************/
function initGrid()
{
    init_Branch_List();
    init_BranchAP_List();
    init_WLSrevice_List();
    init_Auth_List();
    init_Type_List();
    init_Firm_List();
    init_WLClient_List();
    init_WLAP_List();
    init_WLAPGroup_List();
}

function initForm()
{
    init_LogDetail_Btn();
    //-----------------------------------
    $("#refresh_usage").on("click", initData);
    $("#filter_usage").on("click", function(){
        $("#usage_block").toggle();
    });
    $("#SetfigUpport").on("change",setConfigUpport);
    $("#submit").on("click", configUpPort);/*确认按钮*/

    Utils.Request.sendRequest(allInterfaceFlowOpt);
    //-----------------------------------
}

function initData()
{
// TODO : 所有需要发起AJAX请求的function
    get_LogInfoBlock_Data();
    get_CurrentCustomer_Data();
    get_AdInfoBlock_Data();
    get_DevInfoBlock_Data();
    init_OLCustomerChange_Block();
    get_BranchList_Data();
    get_AuthPie_Data();
    get_TypePie_Data();
    get_FirmPie_Data();
    get_WLSreviceList_Data();
    
}


function _init()
{
    initGrid();
    initForm();
    initData();
}

function _resize (){}

function _destroy()
{
    Utils.Request.clearMoudleAjax(MODULE_NAME);
} 

Utils.Pages.regModule(MODULE_NAME, {
    "init" : _init, 
    "resize" : _resize, 
    "destroy" : _destroy,
    "widgets" : ["Mlist", "MSelect", "Echart", "SList", "Minput", "SingleSelect", "Panel", "DateTime", "Form"], 
    "utils" : ["Base", "Device", "Request"]
});

})(jQuery);