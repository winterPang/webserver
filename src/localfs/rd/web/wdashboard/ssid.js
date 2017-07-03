(function ($)
{
    var MODULE_NAME = "WDashboard.ssid";
   // var NC, MODULE_NC = "WDashboard.NC";

    function getRcText (sRcId)
    {
        return Utils.Base.getRcString ("app_ssid_rc", sRcId);
    }

    function drawEmptyPie()
    {
        var option = {
            height:200,
            calculable : false,
            series : [
                {
                    type:'pie',
                    radius : '85%',
                    center: ['60%', '50%'],
                    itemStyle: {
                        normal: {
                            labelLine:{
                                show:false
                            },
                            label:
                            {
                                position:"inner"
                            }
                        }
                    },
                    data: [{name:'N/A',value:1}]
                }
            ]
        };
        var oTheme={color : ["rgba(216, 216, 216, 0.75)"]};
        
        $("#board_ws_pie").echart("init", option,oTheme);
    }

    function drawWireless(oInfor)
    {
        $("#Current").text( Utils.Base.addComma(oInfor.Total));
        if(oInfor.Total == 0)
        {
            drawEmptyPie();
            return ;
        }
        var option = {
            height:200,
            tooltip : {
                trigger: 'item',
                formatter: function(aData){
                    return aData[1]+'<br/>' + aData[2] +' (' + Math.round(aData[2]/this._option.nTotal*100) +'%)';
                }
            },
            legend: {
                orient : 'vertical',
                x : '20',
                y : 30,
                data: ['802.11a(5GHz)','802.11an(5GHz)','802.11ac(5GHz)','802.11b(2.4GHz)','802.11g(2.4GHz)','802.11gn(2.4GHz)']
            },
            calculable : false,
            nTotal : oInfor.Total,
            series : [
                {
                    type:'pie',
                    radius : '50%',
                    center: ['60%', '50%'],
                    itemStyle: {
                        normal: {
                            labelLine:{
                                show:false
                            },
                            color: function(a,b,c,d) {
                                var colorList = ['#7FCAEA','#F9AB6B'];
                                return colorList[b];
                            },
                            label:
                            {
                                position:"inner",
                                formatter: '{b}'
                            }
                        }
                    },
                    data: [
                        {name:'5GHz',value:oInfor.Num5G},
                        {name:'2.4GHz',value:oInfor.Num2G}
                    ]
                },
                {
                    type:'pie',
                    radius : ['60%','85%'],
                    center: ['60%', '50%'],
                    itemStyle: {
                        normal: {
                            labelLine:{
                                show:false
                            },
                            label:
                            {
                                position:"inner",
                                formatter: function(a,b,c,d){
                                    return Math.round(c/this._option.nTotal*100)+"%";
                                }
                            }
                        }
                    },
                    data: [
                        {name:'802.11a(5GHz)',value:oInfor.wsm2.length},
                        {name:'802.11an(5GHz)',value:oInfor.wsm16.length},
                        {name:'802.11ac(5GHz)',value:oInfor.wsm64.length},
                        {name:'802.11b(2.4GHz)',value:oInfor.wsm1.length},
                        {name:'802.11g(2.4GHz)',value:oInfor.wsm4.length},
                        {name:'802.11gn(2.4GHz)',value:oInfor.wsm8.length}
                    ]
                }
            ]
        };
        var oTheme={
                color: ['#239FD7','#7FCAEA','#A9DBF1','#FFDC6D','#F9AB6B','#BFBFBF']
        };
        
        $("#board_ws_pie").echart("init", option,oTheme);
    }

    function initData ()
    {
       /* function myCallback (oInfo)
        {
            var aData = Utils.Request.getTableRows (NC.Stations, oInfo);*/
            //for test//////////////////////////////////////////////////////
            aData = [];
            var ss = ["1","2","4","8","16","64"];
            for(var i=0;i<1024;i++)
            {
                var oo = {
                    WirelessMode: ss[parseInt(Math.random()*6)],
                };
                aData.push(oo);
            }
            /////////////////////////////////////////////////////////////////////////
            var oInfor = {
                Total : aData.length, 
                Num5G : 0,
                Num2G : 0,
                wsm1 : [],
                wsm2 : [],
                wsm4 : [],
                wsm8 : [],
                wsm16 : [],
                wsm64 : []
            };
            
            for(var i=0;i<oInfor.Total;i++)
            {
                var oTemp = aData[i];
                var sMode = "2G";
                oInfor.Num2G ++;

                if(oTemp.WirelessMode == "2" || oTemp.WirelessMode == "16" || oTemp.WirelessMode == "64")
                {
                    oInfor.Num5G ++ ;
                    oInfor.Num2G --;
                    sMode = "5G";
                }

                if(!oInfor["wsm" + oTemp.WirelessMode])
                {
                    oInfor["wsm" + oTemp.WirelessMode] = [oTemp];
                }
                else
                {
                    oInfor["wsm" + oTemp.WirelessMode].push(oTemp);
                }
            }

            drawWireless(oInfor);
       // }

      /*  var oStation = Utils.Request.getTableInstance (NC.Stations);
        Utils.Request.getAll ([oStation], myCallback);*/
    }
    function initForm()
    {
        var jForm = $("#vlans_page");
        $(".link-detail",jForm).on("click",function()
        {
            Utils.Base.redirect ({np:"WDashboard.index",ID:$(this).attr("id")});
            return false;
        });
        $("#refresh_ssid").on("click", initData);
    }
    function _init ()
    {
      //  NC = Utils.Pages[MODULE_NC].NC;
        initForm();
        initData();
    }


    function _destroy ()
    {
    }

    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["Echart"],
        "utils": []
       // "subModules": [MODULE_NC]
    });

}) (jQuery);
