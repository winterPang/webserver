(function ($)
{
    var MODULE_NAME = "dashboard.Net_info";

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("net_info_rc", sRcName);
    }

    function drawDhcpService()
    {
        var opt = {
            colNames: getRcText ("DHCP_LABELS"),
            showHeader: true,
            multiSelect: true,
            colModel: [
                {name:'HAddress', datatype:"String"},
                {name:'Ipv4Address', datatype:"String"},
                {name:'DeviceType', datatype:"String"},
                {name:'EndLease', datatype:"String"}
            ]
        };
        $("#dhcp_service_list").SList ("head", opt);
    }

    function drawUnanthorizedAp()
    {
        var opt = {
            colNames: getRcText ("UNAUTH_AP"),
            showHeader: true,
            multiSelect: false,
            pageSize:8,
            colModel: [
                {name:'MacAddress', datatype:"String"},
                {name:'IPv4Address', datatype:"String"},
                {name:'APName', datatype:"String"},
                {name:'keyixingwei', datatype:"String"},
                {name:'faxiancishu', datatype:"Number"},
                {name:'LastReportTime', datatype:"Number"}
            ]
        };
        $("#unanthorized_ap_list").SList ("head", opt);
    }

    function drawUnanthorizedAgent()
    {
        var opt = {
            colNames: getRcText ("UNAUTH_AGENT"),
            showHeader: true,
            multiSelect: false,
            colModel: [
                {name:'ClientMAC', datatype:"String"},
                {name:'ClientIP', datatype:"String"},
                {name:'LastTime', datatype:"String"},
            ]
        };
        $("#unanthorized_agent_list").SList ("head", opt);
    }

    function drawWanInfo()
    {
        var opt = {
            colNames: getRcText ("WAN_LABELS"),
            showHeader: true,
            multiSelect: false,
            colModel: [
                {name:'interfaceName', datatype:"String"},
                {name:'description', datatype:"String"},
                {name:'status', datatype: "String"},
                {name:'upflow', datatype:"String"},
                {name:'downflow', datatype:"String"}
            ],
            onToggle : {
                action : showHideInfo,
                jScope : $("#wan_toggle")
            }
        };
        $("#wan_info_list").SList ("head", opt);
    }

    function showHideInfo(oRowdata , jScope)
    {
        oRowdata.AllocEnable =oRowdata.type;
        oRowdata.InetAddressIPV4 =oRowdata.ip;
        if(oRowdata.gateway=="0.0.0.0"){
            oRowdata.InetAddressIPV4Mask ="--";
        }else{
            oRowdata.InetAddressIPV4Mask =oRowdata.gateway;
        }
        oRowdata.DNS =oRowdata.dns;
        Utils.Base.updateHtml($("#wan_toggle"),oRowdata);
    }

    function getWanInfo(wanList)
    {
        var oAll = [];
        var allType = getRcText("WAN_TYPE").split(",");
        allType.unshift("");
        wanList.forEach(function(wan){
            if(wan["interfaceName"] == "GigabitEthernet1/0/5" )
            {
                wan["interfaceName"]= "WAN1";
            }
            oAll.push({
                interfaceName: wan["interfaceName"],
                description: wan["description"],
                type: allType[wan["type"]],
                ip: wan["ip"],
                gateway: wan["gateway"],
                dns: wan["dns"],
                status: getRcText("WAN_STSTUS").split(",")[wan["status"]],
                upflow: wan["upflow"],//上行流量
                downflow: wan["downflow"],//下行流量
            });
        });
        return oAll;
    }

    function initData()
    {
        wanInfo();
        UnAuthAP();
        UnAuthAgent();
    }

    function wanInfo()
    {
        function get_wanInfoSuc( data )
        {
            var wanList = data["wan_list"];
            var aTemplate = getWanInfo(wanList);
            $("#wan_info_list").SList ("refresh", aTemplate);
        };

        function get_wanInfoFail()
        {

        };

        var get_wanInfo = {
            url: MyConfig.path+"/devmonitor/web/waninfo?devSN=" + FrameInfo.ACSN,
            type: "GET",
            dataType: "json",
            onSuccess: get_wanInfoSuc,
            onFailed: get_wanInfoFail            
        };
        Utils.Request.sendRequest( get_wanInfo );
    }

    function get_BriefApList_WipsAp( oTemp_data )
    {
        function get_BriefApListSuc ( dataObj )
        {
            var apList = dataObj.apList || [];
            for(var j=0 ;j < apList.length; j++)
            {
                if(oTemp_data.MacAddress == apList[j].macAddr)
                {
                    oTemp_data.APName == apList[j].apName;
                    oTemp_data.IPv4Address == apList[j].ipv4Addr;
                }
            }
        };

        function get_BriefApListFail()
        {

        };
        var get_BriefApList = {
            url:MyConfig.path+"/apmonitor/getbriefaplist?devSN="+FrameInfo.ACSN,
            type:"GET",
            datatype:"json",
            onSuccess: get_BriefApListSuc,
            onFailed: get_BriefApListFail
        };
        Utils.Request.sendRequest( get_BriefApList );
    };

    function UnAuthAP()
    {
        function get_WipsApSuc( data )
        {
            var aData=data || [];
            var keyixingwei_status = getRcText("KEYIXINGWEI").split(",");
            var aTemplate=[]
            for(var i = 0; i < aData.length; i++)
            {
                var date =dataUtil(aData[i].LastReportTime);
                var oTemp_data = {};
                oTemp_data = {
                    MacAddress:aData[i].MacAddress,
                    IPv4Address:"",
                    APName:aData[i].APName,
                    keyixingwei:"",
                    faxiancishu:"1",
                    LastReportTime:date
                };

                get_BriefApList_WipsAp( oTemp_data );

                if(aData[i].HotspotAP)
                {
                    oTemp_data.keyixingwei=keyixingwei_status[0];
                }
                if(aData[i].SoftAP)
                {
                    oTemp_data.keyixingwei=keyixingwei_status[1];
                }
                if(aData[i].HoneypotAP)
                {
                    oTemp_data.keyixingwei=keyixingwei_status[2];
                }
                aTemplate.push( oTemp_data );
            }
            /* end */
            $("#unanthorized_ap_list").SList ("refresh", aTemplate);

        };

        function get_WipsApFail()
        {

        };
        var get_WipsAp = {
            url: MyConfig.path+"/ant/wips_ap",
            type: "GET",
            dataType: "json",
            data:{
                Method:"GetUnAuthAp",
                ACSN:FrameInfo.ACSN
            },
            onSuccess:get_WipsApSuc,
            onFailed: get_WipsApFail            
        };
        Utils.Request.sendRequest( get_WipsAp );
    }

    function dataUtil(params)
    {
        if(params){
            var date= new Date(params*1000);
            date= date.toLocaleString()
            return date;
        }
        return "";

    }

    function get_web_stationlist( oTemp_Data )
    {
        function get_stationlistSuc( data )
        {
            var clientList = data["clientList"];
            for(var k=0; k < clientList.length; k++)
            {
                if (oTemp_Data.ClientMAC == clientList[k].clientMAC)
                {
                    oTemp_Data.ClientIP = clientList[k].clientIP;
                }
            }

        };

        function get_stationlistFail()
        {

        };

        var get_stationlist = {
            type: "GET",
            url: MyConfig.path+"/stamonitor/web/stationlist?devSN=" + FrameInfo.ACSN,
            dataType: "json",
            onSuccess: get_stationlistSuc,
            onFailed: get_stationlistFail
        };
        Utils.Request.sendRequest( get_stationlist );
    };

    function UnAuthAgent()
    {
        function get_nat_detectSuc( data )
        {
            var aData=data || [];
            var aTemplate=[];

            var oTemp_Data = {};

            for(var i = 0; i < aData.length; i++)
            {
                var date =dataUtil(aData[i].LastTime);
                oTemp_Data = {
                    ClientMAC:aData[i].ClientMAC,
                    ClientIP:aData[i].ClientIP,
                    LastTime:date
                }

                get_web_stationlist( oTemp_Data );

                aTemplate.push(oTemp_Data);
            }

            $("#unanthorized_agent_list").SList ("refresh", aTemplate);

        };

        function get_nat_detectFail()
        {

        };

        var get_nat_detect = {
            url: MyConfig.path+"/ant/nat_detect",
            type: "GET",
            dataType: "json",
            data:{
                Method:"GetClient",
                ACSN:FrameInfo.ACSN
            },
            onSuccess: get_nat_detectSuc,
            onFailed: get_nat_detectFail            
        };
        Utils.Request.sendRequest( get_nat_detect );        
    }

    function initGrid()
    {
        drawWanInfo();
        drawDhcpService();
        drawUnanthorizedAp();
        drawUnanthorizedAgent();
    }

    function _init ()
    {
        initGrid();
        initData();
    }

    function _resize(jParent)
    {
    }

    function _destroy()
    {
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }
    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["SList"],
        "utils": ["Request", "Base"]
    });

}) (jQuery);
