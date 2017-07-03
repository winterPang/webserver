(function($){
    var MODULE_NAME = "ssid.ssid";
    var g_oTableData = {};
    var SKIP=0;
    var LIMIT=100;

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("ssid_rc", sRcName);
    }

    //echarts for start
    function echartOptionForStart()
    {
        var option =
        {
            //背景
            backgroundColor:'#171717',
            //下标
            //title : {
            //    text: 'Wi-Fi信道',
            //    y : 'bottom',
            //    x : 'center',
            //    textStyle:
            //    {
            //        fontSize: 8,
            //        color: 'rgb(255,255,255)',
            //    },
            //},
            grid:
            {
                x:40,
                y: 30,
                x2:120,
                y2:55,
                borderColor:'rgba(0,0,0,0)',
            },

            calculable : false,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    name:getRcText ("CHANNEL"),
                    axisLabel:
                    {
                        interval: 1,
                    },

                    //轴线
                    axisLine:
                    {
                        //坐标轴在0上还是0下
                        onZero: false,
                        lineStyle:
                        {
                            color: 'rgb(255,255,255)',
                            type: 'solid',
                            width: 0.3,
                        }
                    },

                    //网格线
                    splitLine:
                    {
                        show: true,
                        lineStyle:
                        {
                            color: ['rgb(255,255,255)'],
                            width: 0.3,
                            type: 'solid',
                        },
                    },

                    //字体设置
                    axisLabel :
                    {
                        show:true,
                        textStyle:
                        {
                            color: 'rgb(255,255,255)',
                        }
                    },

                    axisTick:
                    {
                        show: false,
                    },

                    data :
                        ['','','','','','','','','','','']

                }
            ],
            yAxis : [
                {
                    type : 'value',
                    name:getRcText ("CHANNELSTRENGTH"),

                    nameTextStyle:
                    {
                        color: 'rgb(255,255,255)',
                    },

                    //轴线
                    axisLine :
                    {
                        show: true,
                        lineStyle:
                        {
                            color: 'rgb(255,255,255)',
                            width: 0.3,
                        }
                    },

                    //网格线
                    splitLine:
                    {
                        show: true,
                        lineStyle:
                        {
                            color: ['rgb(255,255,255)'],
                            width: 0.3,
                            type: 'solid',
                        },
                    },

                    //文字设置
                    axisLabel :
                    {
                        show:true,
                        textStyle:
                        {
                            color: 'rgb(255,255,255)',
                        }
                    },
                    splitNumber: 20
                }
            ],
            series: [],
        };

        option.yAxis[0].min=-100;
        option.yAxis[0].max= 0;

        return option;
    }

    //echarts for 2.4G
    function echartOptionForDot(Data)
    {
        var option =
        {
            //背景
            backgroundColor:'#171717',
            //下标
            //title : {
            //    text: 'Wi-Fi信道',
            //    y : 'bottom',
            //    x : 'center',
            //    textStyle:
            //    {
            //        fontSize: 8,
            //        color: 'rgb(255,255,255)',
            //    },
            //},
            grid:
            {
                x:40,
                y: 30,
                x2:120,
                y2:55,
                borderColor:'rgba(0,0,0,0)',
            },

            legend:
            {
                orient:  'vertical',//'horizontal'
                x: '510px', // 'center' | 'left' | {number},
                y: 'center',
                padding: 5,    // [5, 10, 15, 20]
                itemGap: 20,
                borderColor: '#EECFA1',
                borderWidth: 0.5,
                backgroundColor:'#1E1E1E',
                textStyle: {color: 'rgb(255,255,255)'},
                data:Data
            },

            calculable : false,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    name:getRcText("DOTCHANNEL"),
                    axisLabel:
                    {
                        interval: 1,
                    },

                    //轴线
                    axisLine:
                    {
                        //坐标轴在0上还是0下
                        onZero: false,
                        lineStyle:
                        {
                            color: 'rgb(255,255,255)',
                            type: 'solid',
                            width: 0.3,
                        }
                    },

                    //网格线
                    splitLine:
                    {
                        show: true,
                        lineStyle:
                        {
                            color: ['rgb(255,255,255)'],
                            width: 0.3,
                            type: 'solid',
                        },
                    },

                    //字体设置
                    axisLabel :
                    {
                        show:true,
                        textStyle:
                        {
                            color: 'rgb(255,255,255)',
                        }
                    },

                    axisTick:
                    {
                        show: false,
                    },

                    data :
                        ['','','1',
                            {
                                value:'2',
                                textStyle:
                                {             //详见textStyle
                                    color : 'rgb(0,0,0)'
                                }
                            },
                            '3',
                            {
                                value:'4',
                                textStyle:
                                {             //详见textStyle
                                    color : 'rgb(0,0,0)'
                                }
                            },
                            '5',
                            {
                                value:'6',
                                textStyle:
                                {             //详见textStyle
                                    color : 'rgb(0,0,0)'
                                }
                            },
                            '7',
                            {
                                value:'8',
                                textStyle:
                                {             //详见textStyle
                                    color : 'rgb(0,0,0)'
                                }
                            },
                            '9',
                            {
                                value:'10',
                                textStyle:
                                {             //详见textStyle
                                    color : 'rgb(0,0,0)'
                                }
                            },
                            '11',
                            {
                                value:'12',
                                textStyle:
                                {             //详见textStyle
                                    color : 'rgb(0,0,0)'
                                }
                            },
                            '13','','']

                }
            ],
            yAxis : [
                {
                    type : 'value',
                    name:getRcText ("CHANNELSTRENGTH"),

                    nameTextStyle:
                    {
                        color: 'rgb(255,255,255)',
                    },

                    //轴线
                    axisLine :
                    {
                        show: true,
                        lineStyle:
                        {
                            color: 'rgb(255,255,255)',
                            width: 0.3,
                        }
                    },

                    //网格线
                    splitLine:
                    {
                        show: true,
                        lineStyle:
                        {
                            color: ['rgb(255,255,255)'],
                            width: 0.3,
                            type: 'solid',
                        },
                    },

                    //文字设置
                    axisLabel :
                    {
                        show:true,
                        textStyle:
                        {
                            color: 'rgb(255,255,255)',
                        }
                    },
                    splitNumber: 20
                }
            ],
            series: [],
        };

        option.yAxis[0].min=-100;
        option.yAxis[0].max= 0;

        return option;
    }

    //echarts for 5G
    function echartOptionForFive(Data)
    {
        var option =
        {
            //背景
            backgroundColor:'#171717',
            //下标
            //title : {
            //    text: 'Wi-Fi信道',
            //    y : 'bottom',
            //    x : 'center',
            //    textStyle:
            //    {
            //        fontSize: 8,
            //        color: 'rgb(255,255,255)',
            //    },
            //},
            grid:
            {
                x:40,
                y: 30,
                x2:120,
                y2:55,
                borderColor:'rgba(0,0,0,0)',
            },

            legend:
            {
                orient:  'vertical',//'horizontal'
                x: '510px', // 'center' | 'left' | {number},
                y: 'center',
                padding: 5,    // [5, 10, 15, 20]
                itemGap: 20,
                borderColor: '#EECFA1',
                borderWidth: 0.5,
                backgroundColor:'#1E1E1E',
                textStyle: {color: 'rgb(255,255,255)'},
                data:Data
            },
            calculable : false,
            xAxis : [
                {
                    type : 'category',
                    name:getRcText("FIVECHNNEL"),
                    boundaryGap : false,
                    axisLabel:
                    {
                        interval: 1,
                    },

                    //轴线
                    axisLine:
                    {
                        //坐标轴在0上还是0下
                        onZero: false,
                        lineStyle:
                        {
                            color: 'rgb(255,255,255)',
                            type: 'solid',
                            width: 0.3,
                        }
                    },
                    //网格线
                    splitLine:
                    {
                        show: true,
                        lineStyle:
                        {
                            color: ['rgb(255,255,255)'],
                            width: 0.3,
                            type: 'solid',
                        },
                    },

                    //字体设置
                    axisLabel :
                    {
                        show:true,
                        textStyle:
                        {
                            color: 'rgb(255,255,255)',
                        }
                    },
                    axisTick:
                    {
                        show: false,
                    },
                    boundaryGap : false,
                    data : ['','149','','153','','157','','161','','165','']
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    name:getRcText ("CHANNELSTRENGTH"),

                    nameTextStyle:
                    {
                        color: 'rgb(255,255,255)',
                    },

                    //轴线
                    axisLine :
                    {
                        show: true,
                        lineStyle:
                        {
                            color: 'rgb(255,255,255)',
                            width: 0.3,
                        }
                    },

                    //网格线
                    splitLine:
                    {
                        show: true,
                        lineStyle:
                        {
                            color: ['rgb(255,255,255)'],
                            width: 0.3,
                            type: 'solid',
                        },
                    },

                    //文字设置
                    axisLabel :
                    {
                        show:true,
                        textStyle:
                        {
                            color: 'rgb(255,255,255)',
                        }
                    },
                    splitNumber: 20
                }
            ],
            series: [],
        };

        option.yAxis[0].min=-100;
        option.yAxis[0].max= 0;

        return option;
    }

    //init echarts' series
    function initSeries(serName, serData, Length)
    {
        var series = [];

        for (var i = 0; i < Length; i++)
        {
            series.push({
                name: serName[i],
                type: 'line',
                symbol: 'none',
                smooth: true,
                data: serData[i]
            });
        }

        return series;
    }

    //init echarts
    function initChart()
    {
        var myChart = echarts.init(document.getElementById('echartsforssid'));
        var serData1 = [ -100];
        var serData = [];
        var serName = [];
        var series = [];
        //初始显示的echarts
        var option = echartOptionForStart();

        serData.push(serData1);
        series = initSeries(serName, serData, 1);
        option.series = series;
        myChart.setOption(option);
        //
        //// 图表清空
        //myChart.clear();
        //
        //// 图表释放
        //myChart.dispose();
    }

    function initData()
    {
        var choose = getRcText('CHOOSE');
        var apList = [choose];
        var radioList = [choose];
        var apTmp = [];
        var apListInfo = [];

        var apFlowOpt = {
            url:"/v3/apmonitor/web/aplist_page",
            type: "GET",
            dataType: "json",
            data:{
                devSN:FrameInfo.ACSN,
                skipnum:SKIP,//0
                limitnum:LIMIT//100
            },
            onSuccess:getApDataSuc,
            onFailed:getApDataFail
        }
        Utils.Request.sendRequest(apFlowOpt);

        function getApDataFail()
        {
            console.log("fail terminal fail");
        }

        //get ap list
        function getApDataSuc(apdata)
        {
            $.each(apdata.apList, function (index, iDate)
                {
                    var oTmp = {};
                    oTmp.ApName = iDate.apName;
                    oTmp.MacAddr = iDate.macAddr;
                    oTmp.RadioList = iDate.radioList;
                    oTmp.Status = iDate.status;
                    apListInfo.push(oTmp);
                });

            for(var i =0; i<apListInfo.length; i++)
            {
                //push apname into apTmp
                if (1 == apListInfo[i].Status)
                {
                    apTmp.push(apListInfo[i].ApName);
                    g_oTableData[apListInfo[i].ApName]=apListInfo[i];
                }
            }

            //写判断count剩余数量，剩余数量增加
            if(apdata.count > 0)
            {
                SKIP = SKIP + 100;
                LIMIT=100;
                var apFlowOpt =
                {
                    url:"/v3/apmonitor/aplist_page",
                    type: "GET",
                    dataType: "json",
                    data:{
                        devSN:FrameInfo.ACSN,
                        skipnum:SKIP,//0
                        limitnum:LIMIT//100
                    },
                    onSuccess:getApDataSuc,
                    onFailed:getApDataFail
                };

                Utils.Request.sendRequest(apFlowOpt);
            }

            //init ap datas
            apList = apList.concat(apTmp);
            $("#apSelect").singleSelect("InitData", apList);
        }

        //init radio list
        $("#radioSelect").singleSelect("InitData", radioList);

        //init echarts
        initChart();
    }

    //check ap-radio has nbr info
    function checkInfoExist(MacAddress, RadioID, RadioType)
    {
        var para = {
            Method:'CheckRadioStatus',
            Param:{
                ACSN: FrameInfo.ACSN,
               // ACSN: "210235A1AMB143000025",
                MACAddress: MacAddress,
                RadioID: RadioID
            }
        };

        var rrmserverOpt = {
            url:MyConfig.path +"/rrmserver",
            type:"post",
            data:para,
            dataType:"json",
            onSuccess:getRrmserverRadioStatusSuccess,
            onFailed:getRrmserverRadioStatusFail
        };

        /*获取数据成功的回调*/
        function getRrmserverRadioStatusSuccess(data)
        {
            //console.log("mmm"+JSON.stringify(data));

            if (data.message.RadioStatus == false)
            {
                Utils.Base.openDlg(null, {}, {scope:$("#noRadioStatus"),className:"modal-default"});
                initChart();
            }
            else
            {
                getInfoAndPaint(MacAddress,RadioType);
            }
        }

        /*获取数据失败的回调*/
        function getRrmserverRadioStatusFail()
        {
            console.log("get chl strength info failed!!");
        }

        Utils.Request.sendRequest(rrmserverOpt);

        return ;
    }

    function getInfoAndPaint(MacAddress,RadioType)
    {
        var para = {
            Method:'GetChlStrength',
            Param:{
                ACSN: FrameInfo.ACSN,
                //ACSN: "210235A1AMB143000025",
                MACAddress: MacAddress
            }
        };

        var rrmserverOpt = {
            url:MyConfig.path +"/rrmserver",
            type:"post",
            data:para,
            dataType:"json",
            onSuccess:getRrmserverChlStrengthSuc,
            onFailed:getRrmserverChlStrengthFail
        };

        /*获取数据成功的回调*/
        function getRrmserverChlStrengthSuc(data)
        {
   //         console.log("sucess----"+JSON.stringify(data));
            var result = {};
            var option;
            if (data["retCode"])
            {
                result = data["message"];
                if (result.ChlStrength)
                {
                    var ChlSrength = result.ChlStrength || [];
                    var Length = result.ChlStrength.length || 0;
                    var Count1  = 0;
                    var Count2  = 0;

                    if (Length != 0)
                    {
                        var serDataForDot = [];
                        var serDataForDot1 = [];
                        var serDataForFive = [];
                        var serDataForFive1 = [];
                        var serNameTmp1 = [];
                        var serName1 = [];
                        var serNameTmp2 = [];
                        var serName2 = [];
                        for (var i = 0; i < Length; i++)
                        {
                            ChlSrength[i].MeanRssi = ChlSrength[i].MeanRssi - 95;
                            if (("2.4G" == RadioType) && (ChlSrength[i].ChannelNumber <= 13))
                            {
                                Count1++;
                                var tmp = 5;
                                if ((ChlSrength[i].MeanRssi <= -50) && (ChlSrength[i].MeanRssi > -75))
                                {
                                    tmp = 20;
                                }
                                else if ((ChlSrength[i].MeanRssi <= -25) && (ChlSrength[i].MeanRssi > -50))
                                {
                                    tmp = 25;
                                }
                                else if ((ChlSrength[i].MeanRssi <= 0) && (ChlSrength[i].MeanRssi > -25))
                                {
                                    tmp = 30;
                                }
                                if (ChlSrength[i].ChannelNumber == 1)
                                {
                                    serDataForDot1 = [-100, ChlSrength[i].MeanRssi-tmp, ChlSrength[i].MeanRssi, ChlSrength[i].MeanRssi-tmp, -100];
                                }
                                else if (ChlSrength[i].ChannelNumber == 2)
                                {
                                    serDataForDot1 = [ , -100, ChlSrength[i].MeanRssi-tmp, ChlSrength[i].MeanRssi, ChlSrength[i].MeanRssi-tmp, -100];
                                }
                                else if (ChlSrength[i].ChannelNumber == 3)
                                {
                                    serDataForDot1 = [ , , -100, ChlSrength[i].MeanRssi-tmp, ChlSrength[i].MeanRssi, ChlSrength[i].MeanRssi-tmp, -100];
                                }
                                else if (ChlSrength[i].ChannelNumber == 4)
                                {
                                    serDataForDot1 = [ , , , -100, ChlSrength[i].MeanRssi-tmp, ChlSrength[i].MeanRssi, ChlSrength[i].MeanRssi-tmp, -100];
                                }
                                else if (ChlSrength[i].ChannelNumber == 5)
                                {
                                    serDataForDot1 = [ , , , , -100, ChlSrength[i].MeanRssi-tmp, ChlSrength[i].MeanRssi, ChlSrength[i].MeanRssi-tmp, -100];
                                }
                                else if (ChlSrength[i].ChannelNumber == 6)
                                {
                                    serDataForDot1 = [ , , , , , -100, ChlSrength[i].MeanRssi-tmp, ChlSrength[i].MeanRssi, ChlSrength[i].MeanRssi-tmp, -100];
                                }
                                else if (ChlSrength[i].ChannelNumber == 7)
                                {
                                    serDataForDot1 = [ , , , , , , -100, ChlSrength[i].MeanRssi-tmp, ChlSrength[i].MeanRssi, ChlSrength[i].MeanRssi-tmp, -100];
                                }
                                else if (ChlSrength[i].ChannelNumber == 8)
                                {
                                    serDataForDot1 = [ , , , , , , , -100, ChlSrength[i].MeanRssi-tmp, ChlSrength[i].MeanRssi, ChlSrength[i].MeanRssi-tmp, -100];
                                }
                                else if (ChlSrength[i].ChannelNumber == 9)
                                {
                                    serDataForDot1 = [ , , , , , , , , -100, ChlSrength[i].MeanRssi-tmp, ChlSrength[i].MeanRssi, ChlSrength[i].MeanRssi-tmp, -100];
                                }
                                else if (ChlSrength[i].ChannelNumber == 10)
                                {
                                    serDataForDot1 = [ , , , , , , , , , -100, ChlSrength[i].MeanRssi-tmp, ChlSrength[i].MeanRssi, ChlSrength[i].MeanRssi-tmp, -100];
                                }
                                else if (ChlSrength[i].ChannelNumber == 11)
                                {
                                    serDataForDot1 = [ , , , , , , , , , , -100, ChlSrength[i].MeanRssi- tmp, ChlSrength[i].MeanRssi, ChlSrength[i].MeanRssi-tmp, -100];
                                }
                                else if (ChlSrength[i].ChannelNumber == 12)
                                {
                                    serDataForDot1 = [ , , , , , , , , , , , -100, ChlSrength[i].MeanRssi-tmp, ChlSrength[i].MeanRssi, ChlSrength[i].MeanRssi-tmp, -100];
                                }
                                else if (ChlSrength[i].ChannelNumber == 13)
                                {
                                    serDataForDot1 = [ , , , , , , , , , , , , -100, ChlSrength[i].MeanRssi-tmp, ChlSrength[i].MeanRssi, ChlSrength[i].MeanRssi-tmp, -100];
                                }
                                serNameTmp1 = [ChlSrength[i].SSID];
                                serDataForDot.push(serDataForDot1);
                                serName1.push(serNameTmp1);
                                console.log("ssid-2.4G is " + serNameTmp1 + " i =" + i);
                            }
                            else if (("5G" == RadioType) && (ChlSrength[i].ChannelNumber > 13))
                            {
                                Count2++;
                                if (ChlSrength[i].ChannelNumber == 149)
                                {
                                    serDataForFive1 = [-100, ChlSrength[i].MeanRssi, -100];
                                }
                                else if (ChlSrength[i].ChannelNumber == 153)
                                {
                                    serDataForFive1 = [ , ,-100, ChlSrength[i].MeanRssi, -100];
                                }
                                else if (ChlSrength[i].ChannelNumber == 157)
                                {
                                    serDataForFive1 = [ , , , ,-100, ChlSrength[i].MeanRssi, -100];
                                }
                                else if (ChlSrength[i].ChannelNumber == 161)
                                {
                                    serDataForFive1 = [ , , , , , ,-100, ChlSrength[i].MeanRssi, -100];
                                }
                                else if (ChlSrength[i].ChannelNumber == 165)
                                {
                                    serDataForFive1 = [ , , , , , , , ,-100, ChlSrength[i].MeanRssi, -100];
                                }
                                serNameTmp2 = [ChlSrength[i].SSID];
                                serDataForFive.push(serDataForFive1);
                                serName2.push(serNameTmp2);
                                console.log("ssid-5G is " + serNameTmp2 + " i =" + i);
                            }
                        }

                        var myChart = echarts.init(document.getElementById('echartsforssid'));
                        var series = [];
                        if ("2.4G" == RadioType)
                        {
                            option = echartOptionForDot(serName1);
                            series = initSeries(serName1, serDataForDot, Count1);
                        }
                        else if ("5G" == RadioType)
                        {
                            option = echartOptionForFive(serName2);
                            series = initSeries(serName2, serDataForFive, Count2);
                        }
                        option.series = series;
                        myChart.setOption(option);
                    }
                }
            }
        }

        /*获取数据失败的回调*/
        function getRrmserverChlStrengthFail()
        {
            console.log("get chl strength info failed!!");
        }

        Utils.Request.sendRequest(rrmserverOpt);
    }

    function enterGo()
    {
        var myChart = echarts.init(document.getElementById('echartsforssid'));
        var apid =  $("#apSelect").singleSelect("value");
        var radioid =  $("#radioSelect").singleSelect("value");
        var choose = getRcText('CHOOSE');
        var radioListInfo = [];
        var radioType;

        //invalide ap
        if (apid == choose)
        {
            Utils.Base.openDlg(null, {}, {scope:$("#chooseValidAp"),className:"modal-default"});
            initChart();
            return;
        }

        //invalid radio
        if (radioid == choose)
        {
            Utils.Base.openDlg(null, {}, {scope:$("#chooseValidRadio"),className:"modal-default"});
            initChart();
            return;
        }

        //Paint
        var macAddress = g_oTableData[apid].MacAddr;
        macAddress = macAddress[0]+macAddress[1]+":"+macAddress[2]+macAddress[3]+":"+macAddress[5]+macAddress[6]+
                     ":"+macAddress[7]+macAddress[8]+":"+macAddress[10]+macAddress[11]+":"+macAddress[12]+macAddress[13];

        $.each(g_oTableData[apid].RadioList, function(index,oDate)
        {
            var oTmp = {};
            oTmp.RadioId = oDate.radioId;
            oTmp.RadioMode = oDate.radioMode;
            oTmp.RadioStatus = oDate.radioStatus;
            radioListInfo.push(oTmp);
        });
        console.log("sucess----"+JSON.stringify(radioListInfo));
        for(var i =0; i < radioListInfo.length; i++)
        {
            var radioTmp = parseInt(radioid);
            if (radioTmp == radioListInfo[i].RadioId)
            {
                radioType = radioListInfo[i].RadioMode;
                checkInfoExist(macAddress, radioid, radioType);
                break;
            }
        }
    }

    function chooseApToGetRadio()
    {
        var choose = getRcText('CHOOSE');
        var apName =  $("#apSelect").singleSelect("value");
        var radioListInfo = [];
        var radioList = [choose];
        var radioTmp = [];

        if (apName != choose)
        {
             //init radio by ap
             $.each(g_oTableData[apName].RadioList, function(index,oDate)
             {
             var oTmp = {};
             oTmp.RadioId = oDate.radioId;
             oTmp.RadioMode = oDate.radioMode;
             oTmp.RadioStatus = oDate.radioStatus;
             radioListInfo.push(oTmp);
             });

             for(var i = 0; i < radioListInfo.length; i++)
             {
                 //push raido into radioTmp
                 if (1 == radioListInfo[i].RadioStatus)
                 {
                     radioTmp.push((radioListInfo[i].RadioId).toString());
                 }
             }
         }

         radioList = radioList.concat(radioTmp);

         $("#radioSelect").singleSelect("InitData", radioList);
    }

    function doScan()
    {
        alert("start to Scan!");
    }

    function initForm()
    {
        //选择ap
        $("#chooseAp").form("init", "add", {"title":getRcText("INALIDAP"),"btn_apply": false,"btn_cancel":false});

        //选择radio
        $("#chooseRadio").form("init", "add", {"title":getRcText("INALIDRADIO"),"btn_apply": false,"btn_cancel":false});

        //radio status
        $("#radioStatus").form("init", "add", {"title":getRcText("INALIDRADIO"),"btn_apply": false,"btn_cancel":false});

        //选择ap-radio确认
        $("#check_exist").on("click", enterGo);/*确认按钮*/

        //选择ap
        $("#apSelect").on("click", chooseApToGetRadio);/*确认按钮*/

        //scan未启动界面
        $("#setScanForm").form("init", "add", {"title":getRcText("NOSCAN"),"btn_apply": false,"btn_cancel":false});

        //确认扫描
        $("#do_scan").on("click", doScan );

        //取消扫描
        $("#not_scan").on("click", function()
        {
            initChart();

            return
        });
    }

    function _init()
    {
        initData();
        initForm();
    }

    function _destroy()
    {
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }

    function _resize(jParent)
    {

    }

    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["SList","Echart","Form", "SingleSelect",],
        "utils": ["Base", "Device","Request"],
    });
})(jQuery);