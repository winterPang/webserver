(function ($)
{
    var MODULE_NAME = "h_manage.index";

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("manage_rc", sRcName);

    }

    function showLink(row, cell, value, columnDef, dataContext, type)
    {
        value = value || "";

        if("text" == type)
        {
            return value;
        }

        return '<a class="list-link" cell="'+cell+'">'+value+'</a>';
    }

    function onDisDetail()
    {
        var oData = $("#manage_list1").SList("getSelectRow")[0];
        var sType = $(this).attr("cell");
        if(sType == 0)
        {
            //showWirelessInfo(oData);
            showFlowInfo(oData);
        }
        else
        {
            showFlowInfo(oData);
        }
    }

    function onDisDetail2()
    {
        var oData = $("#manage_list2").SList("getSelectRow")[0];
        var sType = $(this).attr("cell");
        if(sType == 0)
        {
            //showWirelessInfo(oData);
            showFlowInfo(oData);
        }
        else
        {
            showFlowInfo(oData);
        }
    }

    function showFlowInfo(oData)
    {
        /*var aType = [];
         for(i = 0; i < 4; i++)
         {
         var oo = {
         wifi:getRcText("HIDE").split(",")[i],
         hide:getRcText("HIDE" + i)
         }
         aType.push(oo);
         }*/
        /* end */
        var tempData9 = [];
        tempData9.push(
            {
                state1:getRcText("ONLINE"),
                serialNum1:"210235A1AMB159000008",
                devicename1:"H3C WX5510E",
                type1:"H3C WX5510E",
                IP1:"192.168.201.40",
                time1:getRcText("TIME1"),
                oui:"00:0f:e2:07:f3:00",
                hardware:"Customer 5114",
                software:"7.1.064"
            },
            {
                state1:getRcText("ONLINE"),
                serialNum1:"210235A1AMB159000008",
                devicename1:"H3C WX5510E",
                type1:"H3C WX5510E",
                IP1:"192.168.201.40",
                time1:getRcText("TIME1"),
                oui:"00:0f:e2:07:f3:00",
                hardware:"Customer 5114",
                software:"7.1.064"
            },
            {
                state1:getRcText("ONLINE"),
                serialNum1:"210235A1AMB159000008",
                devicename1:"H3C WX5510E",
                type1:"H3C WX5510E",
                IP1:"192.168.201.40",
                time1:getRcText("TIME1"),
                oui:"00:0f:e2:07:f3:00",
                hardware:"Customer 5114",
                software:"7.1.064"
            },
            {
                state1:getRcText("ONLINE"),
                serialNum1:"210235A1AMB159000008",
                devicename1:"H3C WX5510E",
                type1:"H3C WX5510E",
                IP1:"192.168.201.40",
                time1:getRcText("TIME1"),
                oui:"00:0f:e2:07:f3:00",
                hardware:"Customer 5114",
                software:"7.1.064"
            },
            {
                state1:getRcText("ONLINE"),
                serialNum1:"210235A1AMB159000008",
                devicename1:"H3C WX5510E",
                type1:"H3C WX5510E",
                IP1:"192.168.201.40",
                time1:getRcText("TIME1"),
                oui:"00:0f:e2:07:f3:00",
                hardware:"Customer 5114",
                software:"7.1.064"
            }
        );
        $("#flowdetail_list").SList ("refresh", tempData9);
        //$("#flowdetail_list").SList ("refresh", aType);
        /* 缁勭粐濂芥暟鎹悗 */
        Utils.Base.openDlg(null, {}, {scope:$("#flowdetailDlg"),className:"modal-super"});
    }


    function draw(){
        var opt1 = {
            height:"",
            showHeader: true,
            multiSelect: true,
            pageSize : 0,
            colNames: getRcText ("MANAGE_ITEM1"),
            colModel: [
                {name: "state", datatype: "String",width:50},//状态
                {name: "serialNum", datatype: "String",width:100,formatter:showLink},//序列号
                {name: "devicename", datatype: "String",width:60},//设备名称
                {name: "type", datatype: "String",width:60},//型号
                {name: "IP", datatype: "String",width:60},//IP
                {name: "time", datatype: "String",width:100},//在线时长
                {name: "related", datatype: "String",width:60},//关联场所
                {name: "username", datatype: "String",width:50}//所属用户
            ],
            buttons:[
                {name: "default", value:getRcText ("FRESH"), action: Fresh}
            ]
        };
        $("#manage_list1").SList ("head", opt1);
        $("#manage_list1").on('click', 'a.list-link', onDisDetail);
        $("#manage_list2").on('click', 'a.list-link', onDisDetail2);

        var tempData1 = [];
        tempData1.push(
            {
                state:getRcText("ONLINE"),
                serialNum:"210235A1AMB159000008",
                devicename:"H3C WX5510E",
                type:"H3C WX5510E",
                IP:"192.168.201.40",
                time:getRcText("TIME"),
                related:getRcText("LOCATION"),
                username:"dongdian1106"
            },
            {
                state:getRcText("ONLINE"),
                serialNum:"210235A1AMB159000008",
                devicename:"H3C WX5510E",
                type:"H3C WX5510E",
                IP:"192.168.201.40",
                time:getRcText("TIME"),
                related:getRcText("LOCATION"),
                username:"dongdian1106"
            },
            {
                state:getRcText("ONLINE"),
                serialNum:"210235A1AMB159000008",
                devicename:"H3C WX5510E",
                type:"H3C WX5510E",
                IP:"192.168.201.40",
                time:getRcText("TIME"),
                related:getRcText("LOCATION"),
                username:"dongdian1106"
            },
            {
                state:getRcText("ONLINE"),
                serialNum:"210235A1AMB159000008",
                devicename:"H3C WX5510E",
                type:"H3C WX5510E",
                IP:"192.168.201.40",
                time:getRcText("TIME"),
                related:getRcText("LOCATION"),
                username:"dongdian1106"
            }
        );
        $("#manage_list1").SList ("refresh", tempData1);

        var opt9 = {
            colNames: getRcText ("INFORMATION"),
            showHeader: true,
            multiSelect : false ,
            colModel: [
                {name: "state1", datatype: "String"},
                {name: "serialNum1", datatype: "String"},
                {name: "devicename1", datatype:"String"},
                {name: "type1", datatype:"String"},
                {name: "IP1", datatype:"String"},
                {name: "time1", datatype:"String"},
                {name: "oui", datatype:"String"},
                {name: "hardware", datatype:"String"},
                {name: "software", datatype:"String"}
            ]
        };
        $("#flowdetail_list").SList ("head", opt9);

        var opt2 = {
            height:"70",
            showHeader: true,
            multiSelect: true,
            pageSize : 8,
            colNames: getRcText ("MANAGE_ITEM2"),
            colModel: [
                {name: "state", datatype: "String",width:50},//状态
                {name: "serialNum", datatype: "String",width:100,formatter:showLink},//序列号
                {name: "devicename", datatype: "String",width:60},//设备名称
                {name: "type", datatype: "String",width:60},//型号
                {name: "time", datatype: "String",width:100},//在线时长
                {name: "related", datatype: "String",width:60},//关联场所
                {name: "username", datatype: "String",width:50}//所属用户
            ]

        };
        $("#manage_list2").SList ("head", opt2);

        var tempData2 = [];
        tempData2.push(
            {
                state:getRcText("ONLINE"),
                serialNum:"210235A1AMB159000040",
                devicename:"H3C WX5510E",
                type:"H3C WX5510E",
                time:getRcText("TIME"),
                related:getRcText("LOCATION"),
                username:"dongdian1106"
            },
            {
                state:getRcText("ONLINE"),
                serialNum:"210235A1AMB159000003",
                devicename:"H3C WX5510E",
                type:"H3C WX5510E",
                time:getRcText("TIME"),
                related:getRcText("LOCATION"),
                username:"dongdian1106"
            },
            {
                state:getRcText("ONLINE"),
                serialNum:"210235A1AMB159000010",
                devicename:"H3C WX5510E",
                type:"H3C WX5510E",
                time:getRcText("TIME"),
                related:getRcText("LOCATION"),
                username:"dongdian1106"
            },
            {
                state:getRcText("ONLINE"),
                serialNum:"210235A1AMB159000043",
                devicename:"H3C WX5510E",
                type:"H3C WX5510E",
                time:getRcText("TIME"),
                related:getRcText("LOCATION"),
                username:"dongdian1106"
            },
            {
                state:getRcText("ONLINE"),
                serialNum:"210235A1AMB159000008",
                devicename:"H3C WX5510E",
                type:"H3C WX5510E",
                time:getRcText("TIME"),
                related:getRcText("LOCATION"),
                username:"dongdian1106"
            },
            {
                state:getRcText("ONLINE"),
                serialNum:"210235A1AMB159000010",
                devicename:"H3C WX5510E",
                type:"H3C WX5510E",
                time:getRcText("TIME"),
                related:getRcText("LOCATION"),
                username:"dongdian1106"
            },
            {
                state:getRcText("ONLINE"),
                serialNum:"210235A1AMB159000043",
                devicename:"H3C WX5510E",
                type:"H3C WX5510E",
                time:getRcText("TIME"),
                related:getRcText("LOCATION"),
                username:"dongdian1106"
            },
            {
                state:getRcText("ONLINE"),
                serialNum:"210235A1AMB159000008",
                devicename:"H3C WX5510E",
                type:"H3C WX5510E",
                time:getRcText("TIME"),
                related:getRcText("LOCATION"),
                username:"dongdian1106"
            }
        );
        $("#manage_list2").SList ("refresh", tempData2);

    }
    function Fresh(){
        Utils.Base.refreshCurPage();
    }
    /*function Fresh(){
        return $.ajax({
            type: "GEt",
            url:MyConfig.v2path+"/syncAc?acsn="+FrameInfo.ACSN,
            dataType: "json",
            contentType: "application/json",
            success:function(data){
                if(data&&data.error_code=="0"){
                    Utils.Base.refreshCurPage();
                }else{
                    Frame.Msg.info(data.error_message);
                }
            },
            error:function(err){

            }

        })
    }*/

     function initUserChange(aData) {
        var option = {
            width:"800",
            height:"270",
            tooltip: {
                show: true,
                trigger: 'axis',
                formatter:function(params){
                    var time = params.value[0].toISOString().split(".")[0].split("T").toString();
                    if(params.value[1] < 0)
                        params.value[1] = -params.value[1];
                    var string =params.seriesName + "<br/>" + time + "<br/>" + params.value[1] + "Mbps"
                    return string;
                },
                axisPointer:{
                    type : 'line',
                    lineStyle : {
                        color: '#373737',
                        width: 2,
                        type: 'solid'
                    }
                }
            },
            legend: {
                orient: "horizontal",
                textStyle:{color: '#9AD4DC', fontSize:"12px"},
                data:[getRcText ('NAME'),getRcText ('NAME2')],
                x : 'right'
            },
            calculable : false,
            xAxis : [
                {
                    type : 'time',
                    splitLine:true,
                    // boundaryGap : false,
                     //data : ['09:00','09:05','09:15','09:20','09:25','09:30','09:35'],
                    axisLabel: {
                        show: true,
                        textStyle:{color: '#617085', fontSize:"12px"},
                      /*  formatter:function(data){
                            return getDoubleStr(data.getHours()) + ":"+ getDoubleStr(data.getMinutes());
                        }*/
                    },
                    
                },

            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series :[
                {
                    name: getRcText ('NAME'),
                    type:'line',
                    smooth: true,
                    symbolSize : 4,
                    // stack: '总量',
                    data:['09:00','09:05','09:15','09:20','09:25','09:30','09:35']
                },
                  {
                    name: getRcText ('NAME2'),
                    type:'line',
                    smooth: true,
                    symbolSize : 4,
                    // stack: '总量',
                    data:aData
                }
            ]
        };
                    
        var oTheme = {
            color: ['#98D6DA','#B4E2E2'],
            categoryAxis:{
                splitLine:{lineStyle:{color:['#FFF']}}
            }
        };
        $("#flowdetail_list2").echart ("init", option,oTheme);

    }

    function getDoubleStr(){

    }

    function initData(){
        draw();
    }

    function initForm(){
        var aweekData = [[new Date(2016,2,14,12,23,34),10],
            [new Date(2016,2,14,12,25,34), 30],
            [new Date(2016,2,14,12,26,34), 50],
            [new Date(2016,2,14,12,28,34), 20],
            [new Date(2016,2,14,12,35,34), 12],
            [new Date(2016,2,14,12,37,12), 47],
            [new Date(2016,2,14,12,40,34), 100]];
        initUserChange(aweekData);

          var aHoursData = [[new Date(2016,2,14,12,23,34),10],
            [new Date(2016,2,14,12,25,34), 30],
            [new Date(2016,2,14,12,26,34), 50],
            [new Date(2016,2,14,12,28,34), 20],
            [new Date(2016,2,14,12,32,34), 100],
            [new Date(2016,2,14,12,35,34), 12],
            [new Date(2016,2,14,12,37,12), 47]];
        var adayData = [[new Date(2016,2,14,03,23,34),10],
            [new Date(2016,2,14,05,32,34), 100],
            [new Date(2016,2,14,09,25,34), 30],
            [new Date(2016,2,14,12,26,34), 50],
            [new Date(2016,2,14,14,28,34), 20],
            [new Date(2016,2,14,20,35,34), 12],
            [new Date(2016,2,14,23,37,12), 47]];
        var aweekData = [[new Date(2016,2,14,12,23,34),10],
            [new Date(2016,2,14,12,25,34), 30],
            [new Date(2016,2,14,12,26,34), 50],
            [new Date(2016,2,14,12,28,34), 20],
            [new Date(2016,2,14,12,35,34), 12],
            [new Date(2016,2,14,12,37,12), 47],
            [new Date(2016,2,14,12,40,34), 100]];

        $("#hours1").click(function(){
            // body...
            initUserChange(aHoursData);
        });
        $("#days1").click(function(){
            // body...
            initUserChange(adayData);
        });
        $("#weeks1").click(function(){
            // body...
            initUserChange(aweekData);
        });
    }

    function _init ()
    {
        initData();
        initForm();
    }
    function _resize (jParent)
    {
    }

    function _destroy()
    {
    }
    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["Echart","Panel","DateTime","Form","Minput","SList"], //["Echart","Minput","SList"],
        "utils":  ["Request","Base","Msg","Device"] //["Base", "Device"]
    });

}) (jQuery);;