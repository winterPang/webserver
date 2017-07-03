(function ($){
    var MODULE_NAME = "b_deviceinfo.devinfo";

    var g_hPie, g_hLine;
    var g_oTimer = false;
    var g_oResizeTimer;

    function getRcText (sRcId)
    {
        return Utils.Base.getRcString ("app_devinfo_rc", sRcId).split(",");
    }


    function drawEmptyPie(nameType,$Type)
    {
        var option = {
            height:160,
            calculable : false,
            series : [
                {
                    type:'pie',
                    minAngle: '3',
                    radius : '70%',
                    center: ['55%', '50%'],
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
                    data: [{name:nameType,value:1}]
                }
            ]
        };
        var oTheme={color : ["rgba(216, 216, 216, 0.75)"]};
        g_hPie = $Type.echart("init", option,oTheme);
    }
    function drawCpuPie(oData){
        function onClickPie(oPiece)
        {
            Utils.Base.redirect({
                np:"apmgr.allaps",
                nIndex:oPiece.dataIndex + 1,
                openMethod:"monitor"
            });
        }
        if (oData[0] == 0 && oData[1] == 0)
        {
            var $Type = $("#cpu_pie");
            var g_nameType = "CPU空闲";
            drawEmptyPie(g_nameType,$Type);
            return;
        }
        var aSatus = getRcText("CPUSTATUS");
        var aTitle = getRcText("TITLE")[0];


        var option = {
            animation: false,
            calculable : false,
            height:160,
            //title:{
            //    text: aTitle,
            //    x:'center',
            //    y:'center',
            //    textStyle : {
            //        color :"#80878c",
            //        fontSize : 14,
            //        fontWeight : 'bolder'
            //    },
            //
            //},
            tooltip : {
                show:true,
                formatter: function(aData){
                    var sLable = aData[1] + ":<br/> " + aData[2] + " (" + Math.round(aData[3])+"%)";
                    return sLable;
                }
            },
            series : [
                {
                    name:'APs',
                    type: 'pie',
                    minAngle: '3',
                    radius : ['50%','70%'],
                    selectedMode: "single",
                    selectedOffset: 10,
                    center: ['50%', '45%'],
                    itemStyle: {
                        normal: {
                            borderColor:"#FFF",
                            borderWidth:1,
                            label: {
                                position: 'center',
                                formatter: function(a,b,c,d){
                                    return aTitle +"\n"+Math.round(a.percent)+"%";
                                },
                                textStyle:{
                                    color:"#80878c",
                                    fontWeight:'bolder'
                                }
                            },
                            labelLine: false
                        },
                        emphasis: {
                            label: {
                                show: false,
                                textStyle: {
                                    color:"#000"
                                }
                            },
                            labelLine: false
                        }
                    },
                    data: [
                        {name:aSatus[0], value:oData[0] || undefined},
                        {name:aSatus[1], value:oData[1] || undefined},
                        // {name:aSatus[2], value:oData.other || undefined}
                    ],
                }
            ]
            // ,click: onClickPie
        };
        var oTheme = {
            //color: ["#78CEC3","#FF9C9E","#E7E7E9"]
            color: ["#78CEC3","#E7E7E9","#E7E7E9"]
        };
        g_hPie = $("#cpu_pie").echart("init", option,oTheme);
    }

    function drawStoragePie(oData)
    {
        function onClickPie(oPiece)
        {
            Utils.Base.redirect({
                np:"apmgr.allaps",
                nIndex:oPiece.dataIndex + 1,
                openMethod:"monitor"
            });
        }
        if (oData[0]== 0 && oData[1] == 0)
        {
            var $Type = $("#storage_pie");
            var g_nameType = "内存空闲";
            drawEmptyPie(g_nameType,$Type);
            return;
        }
        var aSatus = getRcText("STORESTATUS");
        var aTitle = getRcText("TITLE")[1];
        var option = {
            animation: false,
            calculable : false,
            height:160,
            //title:{
            //    text: aTitle,
            //    //subtext:,
            //    x:'center',
            //    y:'center',
            //    textStyle : {
            //        color :"#80878c",
            //        fontSize : 14,
            //        fontWeight : 'bolder'
            //    }
            //},
            tooltip : {
                show:true,
                formatter: function(aData){
                    var sLable = aData[1] + ":<br/> " + aData[2] + " (" + Math.round(aData[3])+"%)";
                    return sLable;
                }
            },
            series : [
                {
                    name:'APs',
                    type: 'pie',
                    minAngle: '3',
                    radius : ['50%','70%'],
                    selectedMode: "single",
                    selectedOffset: 10,
                    center: ['50%', '45%'],

                    itemStyle: {
                        normal: {
                            borderColor:"#FFF",
                            borderWidth:1,
                            label: {
                                position: 'center',
                                formatter: function(a,b,c,d){
                                    return aTitle +"\n"+Math.round(a.percent)+"%";
                                },
                                textStyle:{
                                    color:"#80878c",
                                    fontWeight:'bolder'
                                }
                            },
                            labelLine: false
                        },
                        emphasis: {
                            label: {
                                show: false,
                                textStyle: {
                                    color:"#000"
                                }
                            },
                            labelLine: false
                        }
                    },
                    data: [
                        {name:aSatus[0], value:oData[0] || undefined},
                        {name:aSatus[1], value:oData[1] || undefined},
                        // {name:aSatus[2], value:oData.other || undefined}
                    ],
                }
            ]
            // ,click: onClickPie
        };
        var oTheme = {
            color: ["#78CEC3","#E7E7E9","#E7E7E9"]
        };
        g_hPie = $("#storage_pie").echart("init", option,oTheme);
    }

    function initForm()
    {

    }

    function initData ()
    {
        var oData = [55,45];
        drawStoragePie(oData);
        drawCpuPie(oData);
    }

    function _init ()
    {
        initForm();
        initData();
    }

    function _resize(jParent)
    {
    }

    function _destroy()
    {
        if(g_oTimer)
        {
            clearTimeout(g_oTimer);
            g_oTimer = false;
        }
        g_hLine = null;
        g_hPie = null;
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }
    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["Echart"],
        "utils": ["Request"],
        "subModules": []
    });

}) (jQuery);
