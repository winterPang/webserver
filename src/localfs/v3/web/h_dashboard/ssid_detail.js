;(function ($) {

    var MODULE_NAME = "h_dashboard.ssid_detail";
    //var NC, MODULE_NC = "WDashboard.NC";
    var g_hLine ,g_oTimer = false,g_bindInfo,g_oClientData;
    var g_aSelectAll = [];
    var g_aSelect = [];

    function getRcText (sRcId)
    {
        return Utils.Base.getRcString ("ssid_detail_rc", sRcId).split(",");
    }

     function _drawChart (aTop5,aSSID,aSeries)
    {
        var aString = getRcText("ECHART_STRING");
        var aTimes = [];
        var nTime = new Date();
        var aSeries = [];
        nTime = nTime.getTime();
        for(var i=0;i<6;i++)
        {
            var sTime = new Date(nTime);
            sTime = sTime.toTimeString().split(" ")[0];
            aTimes.push(sTime);
            nTime -= 5000;
        }
        aTimes.reverse();

         for(var i = 0; i < aTop5.length; i++)
        {
            aSSID[i] = aTop5[i].SSID;
            aSeries.push({
                    symbol: "none",
                    type: 'line',
                    name: aTop5[i].SSID, 
                    smooth:true,
                    data: [0, 0, 0, 0, 0, aTop5[i].ClientNumber]
                });
        }

        var opt = {
            width:"100%",
            height:"260px",
            tooltip: {
                show: true, trigger: 'axis'
            },
            legend: {
                orient: "vertical",
                y: 'center',
                x: "right",
                data: aSSID
            },
            grid: {
                x: '60px', y: '50px', x2: '100px', y2: '25px',
                borderColor: '#FFF'
            },
            calculable: false,
            xAxis: [
                {
                    name: aString[0],
                    type: 'category',
                    boundaryGap: true,
                    splitLine:false,
                    axisLine  : {
                        show:true,
                        lineStyle :{color: '#0096d6', width: 1}   //
                    },
                    axisTick :{
                        show:false
                    },
                    data: aTimes
                }
            ],
            yAxis: [
                {
                    name: aString[1],
                    type: 'value',
                    axisLabel: {
                        show: true,
                        textStyle:{color: '#373737'}
                    },
                    axisLine  : {
                        show:true,
                        lineStyle :{color: '#0096d6', width: 1}
                    }
                }
            ],
            series: aSeries
        };
        var oTheme = {color: ["#CDA9CC", "#05B2D2","#ED8263","red","black"]};
        $("#SSID_usage").echart ("init", opt, oTheme);
    }

    function initGrid ()
    {

    }

    function onSsidChange(oChange)
    {
        
        var aSelect = $("#SsidSelect").mselect("value") || [];
        g_aSelect = [];
        for (var i = 0;i<aSelect.length;i++)
        {
            for(var j = 0;j<g_aSelectAll.length;j++)
            {
                if(aSelect[i] == g_aSelectAll[j].ServiceTemplateName)
                {
                    g_aSelect.push(g_aSelectAll[j]);
                }
            }
        }
        _drawChart(g_aSelect);
    }

    function onSsidChange(oChange)
    {
        
        var aSelect = $("#SsidSelect").mselect("value") || [];
        g_aSelect = [];
        for (var i = 0;i<aSelect.length;i++)
        {
            for(var j = 0;j<g_aSelectAll.length;j++)
            {
                if(aSelect[i] == g_aSelectAll[j].ServiceTemplateName)
                {
                    g_aSelect.push(g_aSelectAll[j]);
                }
            }
        }
        _drawChart(g_aSelect);
    }

    function initForm()
    {
       var optBind5G = {
            showHeader: true,
            pageSize:4,
            colNames: getRcText ("BIND_HEADER"),
            colModel: [
                {name: "SSID", datatype: "String"},
                {name: "ApName", datatype: "String"},
                {name: "Vlan", datatype: "String"},
                {name: "Client", datatype: "Integer"}
            ]
        };
        var optBind2G = {
            showHeader: true,
            pageSize:4,
            colNames: getRcText ("BIND_HEADER"),
            colModel: [
                {name: "SSID", datatype: "String"},
                {name: "ApName", datatype: "String"},
                {name: "Vlan", datatype: "String"},
                {name: "Client", datatype: "Integer"}
            ]
        };
        $("#bind5GList").SList ("head", optBind5G);
        $("#bind2GList").SList ("head", optBind2G);
       
        
        var optRx = {
            showHeader: true,
            sortable : false,
            colNames: getRcText ("RX_HEADER"),
            colModel: [
                {name: "SSID", datatype: "String"},
                {name: "RxRate", datatype: "String"}
            ]
        };
        var optTx = {
            showHeader: true,
            sortable : false,
            colNames: getRcText ("TX_HEADER"),
            colModel: [
                {name: "SSID", datatype: "String"},
                {name: "TxRate", datatype: "String"}
            ]
        };
        $("#RxRateList").SList ("head", optRx);
        $("#TxRateList").SList ("head", optTx);
        

        var optG5 = {
            showHeader: true,
            sortable : false,
            colNames: getRcText ("G5_HEADER"),
            colModel: [
                {name: "SSID", datatype: "String"},
                {name: "ClientNumber5G", datatype: "String"}
            ]
        };
        var optG2 = {
            showHeader: true,
            sortable : false,
            colNames: getRcText ("G2_HEADER"),
            colModel: [
                {name: "SSID", datatype: "String"},
                {name: "ClientNumber2G", datatype: "String"}
            ]
        };
        $("#G5NumList").SList ("head", optG5);
        $("#G2NumList").SList ("head", optG2); 

        $("#filter_ssid").on("click",function(){
            $("#ssid_block").toggle();
        });
        var G5Data=[
            {
                SSID:"22",
                ClientNumber5G:"45"
            }
        ];
        var G2Data=[
            {
                SSID:"11",
                ClientNumber2G:"55"
            }
        ];

        $("#SsidSelect").on("change",onSsidChange);

        $("#Top5Client").on("click", function(){
            $(this).addClass("active");
            $("#Top5Out").removeClass("active");
            $(".rate-top").addClass('hide');
            $(".num-top").removeClass('hide');
            $("#G5NumList").SList ("refresh", G5Data);
            $("#G2NumList").SList ("refresh", G2Data);                       
        });
        $("#Top5Out").on("click", function(){
            $(this).addClass("active");
            $("#Top5Client").removeClass("active");
            $(".num-top").addClass('hide');
            $(".rate-top").removeClass('hide');
        });
        var  Data2=[
            {
                SSID:"SSasdD1",
                ApName:"11001",
                Vlan:"2",
                Client:"3"
            },
             {
                SSID:"SSxcvID1",
                ApName:"10301",
                Vlan:"2",
                Client:"3"
            },
             {
                SSID:"SSI213D1",
                ApName:"10501",
                Vlan:"2",
                Client:"3"
            }
        ];
        $("#bind2G").on("click",function(){
            $(this).addClass("active");
            $("#bind5G").removeClass("active");
            $(".G5").addClass("hide");
            $(".G2").removeClass("hide");
            $("#bind2GList").SList("refresh",Data2);
        });
        $("#bind5G").on("click",function(){
            $(this).addClass("active");
            $("#bind2G").removeClass("active");
            $(".G2").addClass("hide");
            $(".G5").removeClass("hide");
        });


    }

    function bindInfo(){
        return $.ajax({
            url: "/stamonitor/getclientstatisticbybandtype",
            type: "GET",
            dataType: "json",
            contentType: "application/json",
            data:{
                devSN: FrameInfo.ACSN
            }
        });
    }

    function initData ()
    {
        var aServiceStatus=[];
        g_aSelectAll = [];
            $.each(aServiceStatus,function(index,oData){
                g_aSelectAll.push({SSID:oData.SSID||"",ServiceTemplateName:oData.ServiceTemplateName,ClientNumber:oData.ClientNumber});
            });
        $("#SsidSelect").mselect("InitData", g_aSelectAll,{displayField:"SSID",valueField:"ServiceTemplateName"});

        // bindInfo().done(data){
        //     $("#bind5GList").SList ("refresh", Data);
        // }.fail(){};

        var  Data5=[
            {
                SSID:"SSID1",
                ApName:"1001",
                Vlan:"2",
                Client:"3"
            },
             {
                SSID:"SSID1",
                ApName:"1001",
                Vlan:"2",
                Client:"3"
            },
             {
                SSID:"SSID1",
                ApName:"1001",
                Vlan:"2",
                Client:"3"
            }
        ];

        $("#bind5GList").SList ("refresh", Data5);

        var RxData=[
            {
                SSID:"SSID1",
                RxRate:"1,234"
            },
            {
                SSID:"SSID1",
                RxRate:"1,234"
            },
            {
                SSID:"SSID1",
                RxRate:"1,234"
            },
            {
                SSID:"SSID1",
                RxRate:"1,234"
            },
            {
                SSID:"SSID1",
                RxRate:"1,234"
            }
        ];
        var TxData=[
            {
                SSID:"SSID2",
                TxRate:"2.235"
            },
            {
                SSID:"SSID2",
                TxRate:"2.235"
            },
            {
                SSID:"SSID2",
                TxRate:"2.235"
            },
            {
                SSID:"SSID2",
                TxRate:"2.235"
            },
            {
                SSID:"SSID2",
                TxRate:"2.235"
            }
        ];
         $("#RxRateList").SList ("refresh", RxData);
         $("#TxRateList").SList ("refresh", TxData);

        var G5Data=[
            {
                SSID:"22",
                ClientNumber5G:"45"
            }
        ];
        var G2Data=[
            {
                SSID:"11",
                ClientNumber5G:"55"
            }
        ];
        // $("#G5NumList").SList ("refresh", G5Data);
        // $("#G2NumList").SList ("refresh", G2Data); 

    }

    function _init(oPara)
    {
       
        initForm();
        initGrid();
        initData();

        var legendData=[
            {
                "ServiceTemplateName":"StName6",
                "SSID":"Home",
                "ClientNumber":831,
                "ClientNumber2G":403,
                "RadioNumber2G":61,
                "RadioNumber5G":13,
                "ClientNumber5G":428
            },
            {
                "ServiceTemplateName":"StName8",
                "SSID":"Railway station",
                "ClientNumber":764,
                "ClientNumber2G":363,
                "RadioNumber2G":46,
                "RadioNumber5G":27,
                "ClientNumber5G":401
            },
            {
                "ServiceTemplateName":"StName7",
                "SSID":"Airport",
                "ClientNumber":614,
                "ClientNumber2G":393,
                "RadioNumber2G":6,
                "RadioNumber5G":91,
                "ClientNumber5G":221
            },
            {
                "ServiceTemplateName":"StName4",
                "SSID":"Public",
                "ClientNumber":475,
                "ClientNumber2G":240,
                "RadioNumber2G":64,
                "RadioNumber5G":63,
                "ClientNumber5G":235
            },
            {
                "ServiceTemplateName":"StName9",
                "SSID":"Office",
                "ClientNumber":470,
                "ClientNumber2G":30,
                "RadioNumber2G":22,
                "RadioNumber5G":55,
                "ClientNumber5G":440
             }
        ];

        var xAxisData=[];

        var seriesData=[
            {"symbol":"none","type":"line","name":"Home","smooth":true,"data":[0,0,0,0,0,831]},
            {"symbol":"none","type":"line","name":"Railway station","smooth":true,"data":[0,0,0,0,0,764]},
            {"symbol":"none","type":"line","name":"Airport","smooth":true,"data":[0,0,0,0,0,614]},
            {"symbol":"none","type":"line","name":"Public","smooth":true,"data":[0,0,0,0,0,475]},
            {"symbol":"none","type":"line","name":"Office","smooth":true,"data":[0,0,0,0,0,470]}
        ];
        _drawChart(legendData,xAxisData,seriesData);
    };

    function _destroy()
    {
        // g_hLine = null;
        // if(g_oTimer)
        // {
        //     clearTimeout(g_oTimer);
        //     g_oTimer = false;
        // }
        g_bindInfo = null;
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["Mlist","SList","Echart","MSelect"],
        "utils":["Request", "Base"],
       // "subModules":[MODULE_NC]
    });

})( jQuery );

