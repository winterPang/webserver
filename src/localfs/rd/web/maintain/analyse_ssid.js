(function($){

    var MODULE_BASE = "maintain";
    var MODULE_NAME = MODULE_BASE + ".analyse_ssid";


    /*获取所有的设备序列号*/
    function getACSN(){

        $.ajax({
            url:MyConfig.path + "/devmonitor/web/aclist",
            type:'get',
            dataType:'json',
            success:function(data){

                var ACSNList = new Array();
                if( (data != "") && (data != null) && (data.acList != undefined)){
                    var acList = data.acList;
                    for( var i = 0 ; i < acList.length ; i++){
                        ACSNList.push(acList[i].devSN);
                    }
                }
                /*获取ssid相关信息*/
                getssid(ACSNList);
            },
            error:function(){
                Frame.Msg.error("获取数据异常，请联系客服");
            }
        })
    }

    /*获取ssid相关信息*/
    function getssid(ACSNList){

        $.ajax({
            url:MyConfig.path +'/ssidmonitor/getssidinfobysnlist',
            type:'post',
            dataType:'json',
            data:{
                acSNList:ACSNList
            },
            success:function(data){

                /*解析ssid相关数据*/
                analyseSsidData(data);
            },
            error:function(){

            }
        })
    }


    /*解析ssid数据*/
    function analyseSsidData(data){

        data = data.ssidList || [];
        var totalData = [];
        var totalBindApList = [];
        var radioType = [
            {name:"2.4G",value:0},
            {name:"5G",value:0}
        ];   //Radio 类型
        var insProtect = [
            {name:"Enabled",value:0},
            {name:"Disabled",value:0}
        ];   //入侵检测
        var akmMode = [
            {name:"未认证",value:0},
            {name:"802.1X",value:0},
            {name:"PSK",value:0}
        ];   //身份认证
        var seamlessRoam = [
            {name:"Enabled",value:0},
            {name:"Disabled",value:0}
        ];   //零漫游
        var isolationFlag = [
            {name:"Enabled",value:0},
            {name:"Disabled",value:0}
        ];  //用户隔离

        for(var i = 0; i < data.length ; i++){
            totalData = totalData.concat(data[i]);
        }

        for(var j = 0; j < totalData.length ; j++){

            //入侵检测
            if( totalData[j].insProtect == 1){
                ++insProtect[0].value;
            }
            else if(totalData[j].insProtect == 2)
            {
                ++insProtect[1].value;
            }

            //身份认证
            if( totalData[j].akmMode == 0){
                ++akmMode[0].value;
            }
            else if( (totalData[j].akmMode == 1) || (totalData[j].akmMode == 4) || (totalData[j].akmMode == 16) || (totalData[j].akmMode == 128))
            {
                ++akmMode[1].value;
            }
            else if( (totalData[j].akmMode ==2) || (totalData[j].akmMode == 8) || (totalData[j].akmMode == 32) || (totalData[j].akmMode == 64))
            {
                ++akmMode[2].value;
            }

            //零漫游
            if( totalData[j].seamlessRoam == 1){
                ++seamlessRoam[0].value;
            }
            else if( totalData[j].seamlessRoam == 2){
                ++seamlessRoam[1].value;
            }

            //用户隔离
            if(totalData[j].isolationFlag == 1){
                ++isolationFlag[0].value;
            }
            else if( totalData[j]. isolationFlag == 2){
                ++isolationFlag[1].value;
            }

            //Radio 类型
            totalBindApList = totalBindApList.concat(totalData[j].bindApList || [])
        }

        for(var k = 0; k < totalBindApList.length ; k++){
            if( totalBindApList[k].radioType == "2.4G"){
                ++radioType[0].value;
            }
            else if( totalBindApList[k].radioType == "5G"){
                ++radioType[1].value;
            }
        }

        /*绑定的radio数量*/
        drawRadioCount(radioType);
        /*入侵检测功能*/
        drawIntrusion(insProtect);
        /*身份认证*/
        drawIdentify(akmMode);
        /*零漫游模块*/
        drawRoam(seamlessRoam);
        /*用户隔离模块*/
        drawQuarantine(isolationFlag);
    }


    /*绑定的radio数量*/
    function drawRadioCount(radioType){

        var option = {
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x:"left",
                y:20,
                data:
                    [
                        {
                            name:"2.4G",
                            textStyle:{color:"white"}
                        },
                        {
                            name:"5G",
                            textStyle:{color:"white"}
                        }
                    ]
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {
                        show: true,
                        type: ['pie', 'funnel']
                    },
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            series : [
                {
                    name: '',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:radioType,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        var oTheme = {
            color:['#26C0C0','#FCCE10']
        };
        $("#radioCount").echart("init",option,oTheme);
    }


    /*入侵检测功能饼状图*/
    function drawIntrusion(insProtect){

    var option = {
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x:"left",
                y:20,
                data:
                    [
                        {
                            name:"Enabled",
                            textStyle:{color:"white"}
                        },
                        {
                            name:"Disabled",
                            textStyle:{color:"white"}
                        }
                    ]
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {
                        show: true,
                        type: ['pie', 'funnel']
                    },
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            series : [
                {
                    name: '',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:insProtect,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        var oTheme = {
            color:['#E87C25','#27727B']
        };
        $("#intrusionCheck").echart("init",option,oTheme);
    }


    /*身份认证饼状图*/
    function drawIdentify(akmMode){

        var option = {
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x:"left",
                y:20,
                data:
                    [
                        {
                            name:"802.1X",
                            textStyle:{color:"white"}
                        },
                        {
                            name:"PSK",
                            textStyle:{color:"white"}
                        },
                        {
                            name:"未认证",
                            textStyle:{color:"white"}
                        }
                    ]
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {
                        show: true,
                        type: ['pie', 'funnel']
                    },
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            series : [
                {
                    name: '',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:akmMode,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        var oTheme = {
            color:['#F4E001','#F0805A']
        };
        $("#identify").echart("init",option,oTheme);
    }

    /*零漫游功能饼状图*/
    function drawRoam(seamlessRoam){

        var option = {
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x:"left",
                y:20,
                data:
                    [
                        {
                            name:"Enabled",
                            textStyle:{color:"white"}
                        },
                        {
                            name:"Disabled",
                            textStyle:{color:"white"}
                        }
                    ]
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {
                        show: true,
                        type: ['pie', 'funnel']
                    },
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            series : [
                {
                    name: '',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:seamlessRoam,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        var oTheme = {
            color:['#D7504B','#C6E579']
        };
        $("#roam").echart("init",option,oTheme);
    }

    /*用户隔离功能饼状图*/
    function drawQuarantine(isolationFlag){

        var option = {
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x:"left",
                y:20,
                data:
                [
                    {
                        name:"Enabled",
                        textStyle:{color:"white"}
                    },
                    {
                        name:"Disabled",
                        textStyle:{color:"white"}
                    }
                ]
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {
                        show: true,
                        type: ['pie', 'funnel']
                    },
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            series : [
                {
                    name: '',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:isolationFlag,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        var oTheme = {
            color:[ '#FE8463','#9BCA63']
        };
        $("#quarantine").echart("init",option,oTheme);
    }

    function initData(){

        /*获取所有ACSN*/
        getACSN();
    }

    function _init(){

       initData();
    }

    function _destroy(){

    }

    Utils.Pages.regModule(MODULE_NAME,{
        "init": _init,
        "destroy": _destroy,
        "widgets": ["Echart"],
        "utils":["Base"]
    })
})(jQuery);