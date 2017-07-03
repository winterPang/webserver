(function ($)
{
    var MODULE_NAME = "city_dashboard.aps_detail";
    // var NC, MODULE_NC = "WDashboard.NC";
    var hTimer = false, g_aAllAps;
    var g_oClientData= {};
    var g_eChannelBusyBar,g_eInterfaceBar,g_oResizeTimer;
    function getRcText (sRcId)
    {
        return Utils.Base.getRcString ("aps_detail_rc", sRcId);
    }

    function drawNoiseFloorBar(oAPSummary)
    {
        var ahight = [0];
        ahight[1]=(oAPSummary.NoiseFloorLower105Num == 0 ? 1 : 5);
        ahight[2]=(oAPSummary.NoiseFloor100Num == 0 ? 1 : 5);
        ahight[3]=(oAPSummary.NoiseFloor95Num == 0 ? 1 : 5);
        ahight[4]=(oAPSummary.NoiseFloor90Num == 0 ? 1 : 5);
        ahight[5]=(oAPSummary.NoiseFloor85Num == 0 ? 1 : 5);
        ahight[6]=(oAPSummary.NoiseFloor80Num == 0 ? 1 : 5);
        ahight[7]=(oAPSummary.NoiseFloor75Num == 0 ? 1 : 5);
        ahight[8]=(oAPSummary.NoiseFloor70Num == 0 ? 1 : 5);
        ahight[9]=(oAPSummary.NoiseFloorUpper70Num == 0 ? 1 : 5);
        ahight[10]=0;
        var oNiseFloor = {
        	height:40,
            width:'100%',
            data:{'0':'-','-110':oAPSummary.NoiseFloorLower105Num,'-105':oAPSummary.NoiseFloor100Num,'-100':oAPSummary.NoiseFloor95Num,'-95':oAPSummary.NoiseFloor90Num,'-90':oAPSummary.NoiseFloor85Num,'-85':oAPSummary.NoiseFloor80Num,'-80':oAPSummary.NoiseFloor75Num,'-75':oAPSummary.NoiseFloor70Num,'-70':oAPSummary.NoiseFloorUpper70Num,'-65':'-'},
            calculable : false,
            grid: {
                x: -20, y:15,  x2:20, y2: 0,
                borderColor : '#FFF'
            },
            xAxis : [
                {
                    splitLine:false,
                    show:true,
                    type : 'category',
                    data : ['0','-110','-105','-100','-95','-90','-85','-80','-75','-70','-65']
                }
            ],
            yAxis : [
                {
                    show:false,
                    axisLine:false,
                    splitLine:false,
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'',
                    type:'bar',
                    data:ahight,
                    itemStyle : {
                        normal: {
                            color:function(a, b, c, d, e, data){
                                var aColor = ['#090','#090','#00AD00','#00C100','#00CB00',
                                    '#00DF00','#00FD00','#FFAA18','#FFA300','#F00','#F9B146','#F90'];
                               return aColor[a.dataIndex];
                            },
                            label : {
                                show: true,
                                position: 'inside',
                                formatter:function(a, b, c, d, e, data){
                                    var sLabel=this._option["data"][a.name];
                                    if(sLabel=="0" || sLabel=="-"){
                                        return "";
                                    }else{
                                        return sLabel;
                                    }
                                }
                            }
                        }
                    }
                }
            ]
        };
        $("#noise").echart ("init", oNiseFloor);
    }

    function getData(aReport)
    {
        var aData = [];
        aData[0] = aData[1] = aData[2] = aData[3] = aData[4] = aData[5] = aData[6] = aData[7] = aData[8] = aData[9] = 0;
        for(i = 0;i < aReport.length;i++)
        {
            switch(parseInt(aReport[i]/10))
            {
                case 0:
                    aData[0] = aData[0] + 1;
                    break;
                case 1:
                    aData[1] = aData[1] + 1;
                    break;
                case 2:
                    aData[2] = aData[2] + 1;
                    break;
                case 3:
                    aData[3] = aData[3] + 1;
                    break;
                case 4:
                    aData[4] = aData[4] + 1;
                    break;
                case 5:
                    aData[5] = aData[5] + 1;
                    break;
                case 6:
                    aData[6] = aData[6] + 1;
                    break;
                case 7:
                    aData[7] = aData[7] + 1;
                    break;
                case 8:
                    aData[8] = aData[8] + 1;
                    break;
                case 9:
                case 10:
                    aData[9] = aData[9] + 1;
                    break;
            }
        }
        return aData;
    }

    function drawChannelBusyBar(aChannelReport)
    {
        var aReport = [];
        for(i = 0;i < aChannelReport.length;i++)
        {
            aReport[i] = aChannelReport[i].Utilization;
        }
        var aData = getData(aReport);
        var ahight = [];
        ahight[0] = 0;
        for(i = 1;i <= 10;i++)
            ahight[i] = aData[i-1] == 0 ? 1 : 5;
        g_eChannelBusyBar = $("#channel").echart ();
        var oNiseFloor = {
            width:'100%',
            height:40,
            data:{'0':'-','0':aData[0],'10':aData[1],'20':aData[2],'30':aData[3],'40':aData[4],'50':aData[5],'60':aData[6],'70':aData[7],'80':aData[8],'90':aData[9]},
            calculable : false,
            grid: {
                x: -20, y:15,  x2:20, y2: 0,
                borderColor : '#fff'

            },
            xAxis : [
                {
                    boundaryGap: true,
                    splitLine:false,
                    axisLine:false,
                    axisLabel:{
                        show:true,
                        formatter:function (value){
                            return value;
                        },
                        interval:0 //quan bu xian shi
                    },

                    axisTick:false,//qu diao biao ji
                    type : 'category',
                    data : ['0','0','10','20','30','40','50','60','70','80','90','100']
                }
            ],
            yAxis : [
                {
                    show:false,
                    axisLine:false,
                    splitLine:false,
                    axisLabel:false,
                    axisTick:false, //qu diao biao ji
                    type : 'value'

                }
            ],
            series : [
                {
                    name:'',
                    type:'bar',
                    data:ahight,
                    itemStyle : {
                        normal: {
                            color:function(a, b, c, d, e, data){
                                var aColor = ['#009900','#009900','#00AD00','#00C100','#00CB00','#00DF00','#00DF00','#FFAA18','#FFA300','#FA2626','#FF0000','#FF0000','#FF0000'];
                               return aColor[a.dataIndex];
                            },
                            label : {
                                show: true,
                                position: 'inside',
                                formatter:function(a, b, c, d, e, data){
                                    var sLabel=this._option["data"][a.name];
                                    if(sLabel=="0" || sLabel=="-"){
                                        return "";
                                    }else{
                                        return sLabel;
                                    }
                                }
                            }
                        }
                    }
                }
            ]
        };
        var oNiseFloorTheme = {color: ["red", "blue","green"]};
        g_eChannelBusyBar.echart ("init", oNiseFloor, oNiseFloorTheme);
    }

    function drawInterfaceBar(aChannelReport)
    {
        var aReport = [];
        for(i = 0;i < aChannelReport.length;i++)
        {
            aReport[i] = aChannelReport[i].Interference;
        }
        var aData = getData(aReport);
        var ahight = [];
        ahight[0] = 0;
        for(i = 1;i <= 10;i++)
            ahight[i] = aData[i-1] == 0 ? 1 : 5;
        g_eInterfaceBar = $("#interface").echart ();
        var oNiseFloor = {
            width:'100%',
            height:40,
            data:{'0':'-','0':aData[0],'10':aData[1],'20':aData[2],'30':aData[3],'40':aData[4],'50':aData[5],'60':aData[6],'70':aData[7],'80':aData[8],'90':aData[9]},
            calculable : false,
            grid: {
                x: -20, y:15,  x2:20, y2: 0,
                borderColor : '#fff'
            },
            xAxis : [
                {
                    boundaryGap: true,
                    splitLine:false,
                    axisLine:false,
                    axisLabel:{
                        show:true,
                        formatter:function (value){
                            return value;
                        },
                        interval:0 //quan bu xian shi
                    },

                    axisTick:false,//qu diao biao ji
                    type : 'category',
                    data : ['0','0','10','20','30','40','50','60','70','80','90','100']
                }
            ],
            yAxis : [
                {
                    show:false,
                    axisLine:false,
                    splitLine:false,
                    axisLabel:false,
                    axisTick:false, //qu diao biao ji
                    type : 'value'

                }
            ],
            series : [
                {
                    name:'',
                    type:'bar',
                    data:ahight,
                    itemStyle : {
                        normal: {
                            color:function(a, b, c, d, e, data){
                                var aColor = ['#009900','#00C100','#00CB00','#00DF00','#00FD00','#FFAA18','#FFA300','#FC8686','#FC5959','#FA2626','#FF0000','#FF0000'];
                               return aColor[a.dataIndex];
                            },
                            label : {
                                show: true,
                                position: 'inside',
                                formatter:function(a, b, c, d, e, data){
                                    var sLabel=this._option["data"][a.name];
                                    if(sLabel=="0" || sLabel=="-"){
                                        return "";
                                    }else{
                                        return sLabel;
                                    }
                                }
                            }
                        }
                    }

                }
            ]
        };
        var oNiseFloorTheme = {color: ["red", "blue","green"]};
        g_eInterfaceBar.echart ("init", oNiseFloor, oNiseFloorTheme);
    }

    function getValidChannelReport(aChannelReport,aAPReport)
    {
        var aNew = [];
        for(j = 0;j < aAPReport.length;j++)
        {
            for(i = 0;i < aChannelReport.length;i++)
            {
                if((aChannelReport[i].ApName == aAPReport[j].ApName)&&
                    (aChannelReport[i].RadioID == aAPReport[j].RadioID)&&
                    (aChannelReport[i].Channel == aAPReport[j].Channel))
                {
                    aNew.push(aChannelReport[i]);
                    break;
                }
            }
        }
        return aNew;

    }


    function  drawLabel(jLabel,opt)
    {
        jLabel.empty();
        var _height= jLabel.height();
        var _width = jLabel.width();
        var aData =opt.data;
        var _labelHeight= 0,_lableWidth=0;
        function createLabel(sLable)
        {
           var _jLabel = $("<div></div>");
            if(sLable=="-"){
                _jLabel.width(_lableWidth/2);
                _jLabel.html("");
                var _style="float:left;"+"width:"+(_lableWidth/2)+"px;height:"+_labelHeight+"px;text-align:center";
                _jLabel.attr("style",_style);
            }else{
                _jLabel.width(_lableWidth);
                _jLabel.html(sLable);
                var _style="float:left;"+"width:"+_lableWidth+"px;height:"+_labelHeight+"px;text-align:center";
                _jLabel.attr("style",_style);
            }
            _jLabel.height(_labelHeight);
            return _jLabel;
        }
        if(opt&&aData)
        {
            if($.type(aData)=="array")
            {
                _labelHeight=_height;
                _lableWidth =_width/(aData.length+1);
                jLabel.append(createLabel("-"));
                $.each(aData,function(_nIndex,sLable){
                    jLabel.append(createLabel(sLable));
                });
                jLabel.append(createLabel("-"));
            }
        }
    }
    function initLable()
    {
        drawLabel($("#noiseLabel"),{
            data : ['-110','-105','-100','-95','-90','-85','-80','-75','-70','-65']
        });
        drawLabel($("#channelLabel"),{
            data : ['0','10','20','30','40','50','60','70','80','90','100']
        });
        drawLabel($("#interfaceLabel"),{
            data : ['0','10','20','30','40','50','60','70','80','90','100']
        });
    }

    function setSelectData (jSelect, aData,oDataField)
    {
        $.each(aData,function(_n,_v){
            var _sValue;
            var _sName;
            if($.type(_v)=="object")
            {
                if(oDataField)
                {
                    (oDataField["name"])?_sName = _v[oDataField["name"]] : null;
                    (oDataField["value"])?_sValue = _v[oDataField["value"]] : null;
                }else
                {
                    _sName = _v["name"];
                    _sValue = _v["value"];
                }
            }
            else if($.type(_v)=="string")
            {
                _sValue = _v;
                _sName = _v;
            }else{
                _sValue = _n;
                _sName = _v;
            }
            var sOption = "<option>";
            if(_sValue)
            {
                sOption ="<option value='"+_sValue+"'>";
            }

            if(_sName)
            {
                sOption += _sName;
            }
            sOption +="</option>";
            jSelect.append(sOption);
        });
    }

    // function disconnectAP()
    // {
    //     if($(this).hasClass("disabled"))
    //     {
    //         return false;
    //     }

    //     var oReset = Utils.Request.getTableInstance(NC.ResetAP);
    //     var aSelectData =  $("#AllApList").mlist('selectDatas');

    //     for(var i=0;i<aSelectData.length;i++)
    //     {
    //         oReset.addRows({"ApName":aSelectData[i].Name});
    //     }

    //     Utils.Request.action(oReset,function(){
    //         refreshRunAP();
    //         Utils.Base.reloadTree(); 
    //     });
    // }

    function onGroupChange(oChange)
    {
        if(!oChange.val)
        {
            return;
        }
        var jGroupList = $("#GroupList");
        $("#group_block").hide();
        if(oChange.val == "0")
        {
            jGroupList.SList ("refresh", g_aAllAps);
        }
        else
        {
            var aApsInGroup = [];
            $.each(g_aAllAps, function(index, oAllAP){
                if(oAllAP.GroupName == oChange.val)
                {
                    aApsInGroup.push(oAllAP);
                }
            });
            jGroupList.SList ("refresh", aApsInGroup);
        }           
    }

    function initForm()
    {
        $("#filter_group").on("click", function(){
            $("#group_block").toggle();
        });
        $("#return_to_dashboard").on("click",function(){
            history.back();
        });
        $(document).on("mousedown", function(e){
            var e = e || window.event;
            var elem = e.target || e.srcElement;
            while(elem)
            {
                if(elem.id && elem.id == "group_block")
                {
                    return false;
                }
                elem = elem.parentNode;
            }
            $("#group_block").hide();
        });
        $("#ApNameSelect").on("change", onGroupChange);
        $("#Download").on("click", function(){
            $(this).addClass("active");
            $("#Upload").removeClass("active");
            $(".num-top").addClass("hide");
            $(".rate-top").removeClass("hide");
        });
        $("#Upload").on("click", function(){
            $(this).addClass("active");
            $("#Download").removeClass("active");
            $(".rate-top").addClass("hide");
            $(".num-top").removeClass("hide");
            $("#G5List").SList("refresh",g_oClientData.G5);
            $("#G2List").SList("refresh",g_oClientData.G2);
        });
        // $("#disconAp").on("click", disconnectAP);
    }

    function onRowChanged(aRowData)
    {
        if(aRowData && aRowData.length > 0)
        {
            // $("#disconAp").removeClass("disabled");
            $(".mlist-icon").last().removeClass("disabled");
        }
        else
        {
            // $("#disconAp").addClass("disabled");
            $(".mlist-icon").last().addClass("disabled");
        }
    }


    function initGrid ()
    {
        var optTx = {
            showHeader: true,
            height:100,
            sortable : false,
            pageSize: 3,
            colNames: getRcText ("TX_HEADER"),
            colModel: [
                {name: "APName", datatype: "String",width:80},
                {name: "TxRate", datatype: "String",width:80}
            ]
        };
        $("#TxList").SList ("head", optTx);

        var optRx = {
            showHeader: true,
            height:100,
            sortable : false,
            pageSize:3,
            colNames: getRcText ("RX_HEADER"),
            colModel: [
                {name: "APName", datatype: "String",width:80},
                {name: "RxRate", datatype: "String",width:80}
            ]
        };
        $("#RxList").SList ("head", optRx);

        var optG5 = {
            showHeader: true,
            sortable : false,
            pageSize: 3,
            colNames: getRcText ("G5_HEADER"),
            colModel: [
                {name: "APName", datatype: "String",width:80},
                {name: "ClientNumber5G", datatype: "String",width:80}
            ]
        };
        $("#G5List").SList ("head", optG5);

        var optG2 = {
            showHeader: true,
            sortable : false,
            pageSize: 3,
            colNames: getRcText ("G2_HEADER"),
            colModel: [
                {name: "APName", datatype: "String",width:80},
                {name: "ClientNumber2G", datatype: "String",width:80}
            ]
        };
        $("#G2List").SList ("head", optG2);

        var optGroup = {
            showHeader: true,
            height:160,
            colNames: getRcText ("GROUP_HEADER"),
            pageSize: 3,
            colModel: [
                {name: "Name", datatype: "String", width: 50},
                {name: "Model", datatype: "String", width: 60},
                {name: "Status", datatype: "Order", width: 60},
                {name: "SerialID", datatype: "String", width: 60},
                {name: "IPAddress", datatype: "String", width: 60}
            ]
        };
        $("#GroupList").SList ("head", optGroup);

        // var optAll = {
        //     multiSelect: true,
        //     height: 300,
        //     search:true,
        //     showStatus:false,
        //     showPages: false,
        //     columnChange:false,
        //     listenRowChange: onRowChanged,
        //     colNames: getRcText ("ALLAP_HEADER"),
        //     colModel: [
        //         {name: "Name", datatype: "String",width:50},
        //         {name: "Model", datatype: "String",width:60},
        //         {name: "IPAddress", datatype: "String",width:60},
        //         {name: "SerialID", datatype: "String",width:60},
        //         {name: "Radios", datatype: "String",width:60},
        //         {name: "GroupName", datatype: "String",width:80},
        //         {name: "ClientsNumber", datatype: "String",width:80},
        //         {name: "Throughput", datatype: "String",width:80},
        //         {name: "OnlineTime", datatype: "String",width:80}
        //     ], buttons: [
        //         {name: "add", enable:false},
        //         {name: "edit",enable:false},
        //         {name: "disconnect", value: getRcText ("DISCONNECT"),enable:true,action: disconnectAP},
        //         {name: "delete", enable:false}
        //     ]
        // };
        // $("#AllApList").mlist ("head", optAll);
    }

    function getAllAps(aAllAps,aManualAPs,aRunAPs)
    {
        var oRunAp = {},oManualAP = {};
        var aStatus = getRcText("STATUS").split(","); 
        $.each(aManualAPs, function(index, oAP){
            oManualAP[oAP.Name] = oAP;
        });
        $.each(aRunAPs, function(index, oAP){
            oRunAp[oAP.Name] = oAP;
        });
        $.each(aAllAps, function(index, oAllAP){
            oAllAP.Status = aStatus[oAllAP.Status];
            if(oRunAp[oAllAP.Name])
            {
                oAllAP.SerialID = oRunAp[oAllAP.Name].SerialID;
                oAllAP.IPAddress = oRunAp[oAllAP.Name].Ipv4Address + ", " + oRunAp[oAllAP.Name].Ipv6Address;
            }
            else if(oManualAP[oAllAP.Name])
            {
                oAllAP.SerialID = oManualAP[oAllAP.Name].CfgSerialID;
                // oAllAP.IPAddress = "-";
            }
        });
        return aAllAps;
    }

    function datatime (argument) {
        // var temp = eval(argument);
        var day  = parseInt(argument/86400);
        var temp = argument%86400;
        var hour = parseInt(temp/3600);
        temp = argument%3600;
        var mini = parseInt(temp/60);
        var sec  = argument%60;
        if (hour < 10)
        {
            var sDatatime = day+":0"+hour;
        }
        else
        {
            var sDatatime = day+":"+hour;
        }
        if (mini < 10)
        {
             sDatatime = sDatatime+":0"+mini;
        } else 
        {
             sDatatime = sDatatime+":"+mini;
        }
        if (sec < 10)
        {
            sDatatime = sDatatime+":0"+sec;
        } else 
        {
            sDatatime = sDatatime+":"+sec;
        }
        return sDatatime;
    }

    function getRunAps(aRunAPs,aRadioOfRunAP,aAPAssociations)
    {
        var oRunAPs = {},
            oAssAP = {};
            oThroughput = {};
        var aMode = getRcText("MODE").split(",");
        $.each(aAPAssociations, function(index, oAssociateAP){
            oAssAP[oAssociateAP.Name] = oAssociateAP.Current;
            oThroughput[oAssociateAP.Name] = oAssociateAP.InBytes + "/" + oAssociateAP.OutBytes;
        })
        $.each(aRunAPs, function(index, oRunAP){
            oRunAP.ClientsNumber = oAssAP[oRunAP.Name];
            oRunAP.Throughput = oThroughput[oRunAP.Name];
            if (oRunAP.Ipv6Address == "::")
            {
                oRunAP.IPAddress = oRunAP.Ipv4Address;
            }
            else
            {
                oRunAP.IPAddress = oRunAP.Ipv4Address + ", " + oRunAP.Ipv6Address;
            }            
            oRunAP.OnlineTime = datatime(oRunAP.OnlineTime);
            oRunAPs[oRunAP.Name] = oRunAP;

        });
        $.each(aRadioOfRunAP, function(key, oRadioRunAP)
        {
            if(oRunAPs[oRadioRunAP.ApName] && oRunAPs[oRadioRunAP.ApName].Radios)
            {
                oRunAPs[oRadioRunAP.ApName].Radios += "," + aMode[oRadioRunAP.Mode] + "(" + oRadioRunAP.RadioID + ")";
            }
            else if(oRunAPs[oRadioRunAP.ApName] && !oRunAPs[oRadioRunAP.ApName].Radios)
            {
                oRunAPs[oRadioRunAP.ApName].Radios = aMode[oRadioRunAP.Mode] + "(" + oRadioRunAP.RadioID + ")";
            }
        });
        return aRunAPs;
    }

    function getRadioNum(aManualAPs,aRunAPs,aRadioOfRunAP,aRadioOfManualAP)
    {
        var oRadioCnt = {},
            nTotalRadio = 0,
            nTotalAP = 0,
            oAutoAPs = {},
            nDotb = 0,
            nDota = 0,
            nDotg = 0,
            nDotn2 = 0,
            nDotn5 = 0,
            nDotac2 = 0,
            nDotac5 = 0;
        $.each(aRunAPs,function(index, oRunAP){
            if(oRunAP.Type == "1")
            {
                nTotalRadio += Number(oRunAP.RadioNum);
                nTotalAP ++;
                oAutoAPs[oRunAP.Name] = oRunAP;
            }
        });
        $.each(aManualAPs, function(index, oManualAP){
            nTotalRadio += Number(oManualAP.RadioNum);
            nTotalAP ++;
        });
        $.each(aRadioOfRunAP, function(index, oRadioRunAP){
            if(oAutoAPs[oRadioRunAP.ApName])
            {
                switch(oRadioRunAP.Mode)
                {
                    case "1":
                        nDotb ++;
                        break;
                    case "2":
                        nDota ++;
                        break;
                    case "3":
                        nDotg ++;
                        break;
                    case "4":
                        nDotn2 ++;
                        break;
                    case "5":
                        nDotn5 ++;
                        break;
                    case "6":
                        nDotac2 ++;
                        break;
                    case "7":
                        nDotac5 ++;
                        break;
                    default:
                        break;
                }
            }
        });
        $.each(aRadioOfRunAP, function(index, oRadioOfManualAP){
            switch(oRadioOfManualAP.Mode)
            {
                case "1":
                    nDotb ++;
                    break;
                case "2":
                    nDota ++;
                    break;
                case "3":
                    nDotg ++;
                    break;
                case "4":
                    nDotn2 ++;
                    break;
                case "5":
                    nDotn5 ++;
                    break;
                case "6":
                    nDotac2 ++;
                    break;
                case "7":
                    nDotac5 ++;
                    break;
                default:
                    break;
            }
        });
        oRadioCnt = {
            ApNum: nTotalAP,
            RadioNum: nTotalRadio,
            rm1: nDotb,
            rm2: nDota,
            rm3: nDotg,
            rm4: nDotn2,
            rm5: nDotn5,
            // rm6: nDotac2,
            rm7: nDotac5
        };
        return oRadioCnt;

    }

    function initData ()
    {
        // function myCallback (oInfo)
        // {
        //     /************finished**************************/
        //     var oAPSummary = Utils.Request.getTableRows (NC.APSummary, oInfo)[0] || {};
        //     var oTOPRateOfAP = Utils.Request.getTableRows (NC.TOPRateOfAP, oInfo)[0] || {};
        //     var oTOPClientOfAP = Utils.Request.getTableRows (NC.TOPClientOfAP, oInfo)[0] || {};
        //     var aAPGroups = Utils.Request.getTableRows (NC.APGroup, oInfo) || [];
        //     var aAllAps = Utils.Request.getTableRows (NC.AllAP, oInfo) || [];
        //     var aManualAPs = Utils.Request.getTableRows (NC.ManualAP, oInfo) || [];
        //     var aRadioOfManualAP = Utils.Request.getTableRows (NC.RadioOfManualAP, oInfo) || [];
        //     var aRunAPs = Utils.Request.getTableRows (NC.RunAP, oInfo) || [];
        //     var aRadioOfRunAP = Utils.Request.getTableRows (NC.RadioOfRunAP, oInfo) || [];
        //     var aAPAssociations = Utils.Request.getTableRows (NC.APAssociations, oInfo) || [];
        //     var aChannelReport = Utils.Request.getTableRows (NC.ChannelReport, oInfo)||[];
        //     aChannelReport = getValidChannelReport(aChannelReport,aRadioOfRunAP);

        //     var aTxData = [
        //         {APName:oTOPRateOfAP.Top1TxRateAPName, TxRate:oTOPRateOfAP.Top1TxRate},
        //         {APName:oTOPRateOfAP.Top2TxRateAPName, TxRate:oTOPRateOfAP.Top2TxRate},
        //         {APName:oTOPRateOfAP.Top3TxRateAPName, TxRate:oTOPRateOfAP.Top3TxRate},
        //         {APName:oTOPRateOfAP.Top4TxRateAPName, TxRate:oTOPRateOfAP.Top4TxRate},
        //         {APName:oTOPRateOfAP.Top5TxRateAPName, TxRate:oTOPRateOfAP.Top5TxRate}
        //     ],
        //     aRxData = [
        //         {APName:oTOPRateOfAP.Top1RxRateAPName, RxRate:oTOPRateOfAP.Top1RxRate},
        //         {APName:oTOPRateOfAP.Top2RxRateAPName, RxRate:oTOPRateOfAP.Top2RxRate},
        //         {APName:oTOPRateOfAP.Top3RxRateAPName, RxRate:oTOPRateOfAP.Top3RxRate},
        //         {APName:oTOPRateOfAP.Top4RxRateAPName, RxRate:oTOPRateOfAP.Top4RxRate},
        //         {APName:oTOPRateOfAP.Top5RxRateAPName, RxRate:oTOPRateOfAP.Top5RxRate}
        //     ],
        //     aClient2G = [
        //         {APName:oTOPClientOfAP.Top1APName2G,ClientNumber2G:oTOPClientOfAP.Top1ClientNum2G},
        //         {APName:oTOPClientOfAP.Top2APName2G,ClientNumber2G:oTOPClientOfAP.Top2ClientNum2G},
        //         {APName:oTOPClientOfAP.Top3APName2G,ClientNumber2G:oTOPClientOfAP.Top3ClientNum2G},
        //         {APName:oTOPClientOfAP.Top4APName2G,ClientNumber2G:oTOPClientOfAP.Top4ClientNum2G},
        //         {APName:oTOPClientOfAP.Top5APName2G,ClientNumber2G:oTOPClientOfAP.Top5ClientNum2G}
        //     ],
        //     aClient5G = [
        //         {APName:oTOPClientOfAP.Top1APName5G,ClientNumber5G:oTOPClientOfAP.Top1ClientNum5G},
        //         {APName:oTOPClientOfAP.Top2APName5G,ClientNumber5G:oTOPClientOfAP.Top2ClientNum5G},
        //         {APName:oTOPClientOfAP.Top3APName5G,ClientNumber5G:oTOPClientOfAP.Top3ClientNum5G},
        //         {APName:oTOPClientOfAP.Top4APName5G,ClientNumber5G:oTOPClientOfAP.Top4ClientNum5G},
        //         {APName:oTOPClientOfAP.Top5APName5G,ClientNumber5G:oTOPClientOfAP.Top5ClientNum5G}
        //     ];
        //     g_oClientData.G2 = aClient2G;
        //     g_oClientData.G5 = aClient5G;
            var aTxData = [{"APName":"ap1","TxRate":"111"},{"APName":"ap2","TxRate":"222"},{"APName":"ap3","TxRate":"333"},{"APName":"ap4","TxRate":"444"},{"APName":"ap5","TxRate":"555"}];
            $("#TxList").SList ("refresh", aTxData);
            
            var aRxData = [{"APName":"ap1","RxRate":"111"},{"APName":"ap2","RxRate":"222"},{"APName":"ap3","RxRate":"333"},{"APName":"ap4","RxRate":"444"},{"APName":"ap5","RxRate":"555"}]
            $("#RxList").SList ("refresh", aRxData);
            
            var oAPSummary = {"ManualApNum":"153","RunApNum":"256","OfflineApNum":"123","UnhealthyApNum":"1","UnAuthApNum":"75","ApGroupNum":"32","LocationNum":"15","NorthIfOutPkt":"18964","NorthIfOutByte":"164685","NorthIfInPkt":"156489","NorthIfInByte":"251566","Is5gRadioNum":"10","Is2gRadioNum":"20","AccessModeNum":"30","SensorModeNum":"40","HybirdModeNum":"50","ChannelBusyLower10PctNum":"2","ChannelBusy10PctNum":"5","ChannelBusy20PctNum":"5","ChannelBusy30PctNum":"8","ChannelBusy40PctNum":"10","ChannelBusy50PctNum":"12","ChannelBusy60PctNum":"11","ChannelBusy70PctNum":"12","ChannelBusy80PctNum":"10","ChannelBusy90PctNum":"10","NoiseFloorLower105Num":"10","NoiseFloor100Num":"10","NoiseFloor95Num":"2","NoiseFloor90Num":"20","NoiseFloor85Num":"10","NoiseFloor80Num":"5","NoiseFloor75Num":"20","NoiseFloor70Num":"30","NoiseFloorUpper70Num":"10","Dot11InterfLower10PctNum":"10","Dot11Interf10PctNum":"10","Dot11Interf20PctNum":"10","Dot11Interf30PctNum":"20","Dot11Interf40PctNum":"10","Dot11Interf50PctNum":"20","Dot11Interf60PctNum":"10","Dot11Interf70PctNum":"10","Dot11Interf80PctNum":"20","Dot11Interf90PctNum":"20","NonDot11InterfLower10PctNum":"10","NonDot11Interf10PctNum":"10","NonDot11Interf20PctNum":"10","NonDot11Interf30PctNum":"10","NonDot11Interf40PctNum":"10","NonDot11Interf50PctNum":"10","NonDot11Interf60PctNum":"10","NonDot11Interf70PctNum":"10","NonDot11Interf80PctNum":"10","NonDot11Interf90PctNum":"10"};
            drawNoiseFloorBar(oAPSummary); 
            
            var aChannelReport = [{"ApName":"AP1","RadioID":"2","Channel":"1","NeighborCount":"2","Load":"4","Utilization":"20","Interference":"0","PacketErr":"0","Retry":"0","RadarStatus":"false"},{"ApName":"AP6","RadioID":"2","Channel":"11","NeighborCount":"2","Load":"4","Utilization":"0","Interference":"30","PacketErr":"0","Retry":"0","RadarStatus":"false"}];
            drawChannelBusyBar(aChannelReport);
            
            var aChannelReport = [
                {"ApName":"AP1","RadioID":"2","Channel":"1","NeighborCount":"2","Load":"4","Utilization":"20","Interference":"0","PacketErr":"0","Retry":"0","RadarStatus":"false"},
                {"ApName":"AP6","RadioID":"2","Channel":"11","NeighborCount":"2","Load":"4","Utilization":"0","Interference":"30","PacketErr":"0","Retry":"0","RadarStatus":"false"}
            ];
            drawInterfaceBar(aChannelReport);

        //     var aGroupNames = [{text:getRcText("ALL_Group"),value:'0'}];
        //     $.each(aAPGroups, function(index, oGroup){
        //         aGroupNames.push(oGroup.Name);
        //     });
        //     $("#ApNameSelect").singleSelect("InitData",aGroupNames,{allowClear:false});

        //     g_aAllAps = getAllAps(aAllAps,aManualAPs,aRunAPs);
        //     var aRunAPList = getRunAps(aRunAPs,aRadioOfRunAP,aAPAssociations);
        //     var oRadioCnt = getRadioNum(aManualAPs,aRunAPs,aRadioOfRunAP,aRadioOfManualAP);
            var oRadioCnt = {"ApNum":33,"RadioNum":61,"rm1":8,"rm2":6,"rm3":6,"rm4":4,"rm5":0,"rm7":0};
            Utils.Base.updateHtml($("#performance_page"), oRadioCnt);
            
            g_aAllAps = [{"Name":"AP1","Status":"在线","GroupName":"Group-1","LocationName":"default-location","Type":"2","Model":"WA2620i-AGN","SerialID":"229822A2CNC22A222233","IPAddress":"1.1.1.1, 1:1::1:1"},{"Name":"AP2","Status":"离线","GroupName":"Group-1","LocationName":"default-location","Type":"1","Model":"WA2620i-AGN","SerialID":"229822A2CNC22A222233","IPAddress":"1.1.1.1, 1:1::1:1"},{"Name":"AP3","Status":"离线","GroupName":"Group-1","LocationName":"default-location","Type":"1","Model":"WA2620-AGN","SerialID":"229822A2CNC22A222233","IPAddress":"1.1.1.1, 1:1::1:1"},{"Name":"AP4","Status":"离线","GroupName":"Group-1","LocationName":"default-location","Type":"1","Model":"WA2620-AGN","SerialID":"229822A2CNC22A222233","IPAddress":"1.1.1.1, 1:1::1:1"},{"Name":"AP5","Status":"在线","GroupName":"Group-1","LocationName":"default-location","Type":"1","Model":"WA2610E-GNP","SerialID":"229822A2CNC22A222233","IPAddress":"1.1.1.1, 1:1::1:1"},{"Name":"AP6","Status":"在线","GroupName":"Group-1","LocationName":"default-location","Type":"1","Model":"WA2620","SerialID":"229822A2CNC22A222233","IPAddress":"1.1.1.1, 1:1::1:1"},{"Name":"B1-ap-2","Status":"在线","GroupName":"Group-1","LocationName":"default-location","Type":"2","Model":"WA4320-ACN-SI","SerialID":"219801A0CNC11A0000010"},{"Name":"B2-ap-1","Status":"在线","GroupName":"Group-1","LocationName":"default-location","Type":"2","Model":"WA4320i-ACN-A","SerialID":"219801A0CNC11A0000012"},{"Name":"B2-ap-2","Status":"在线","GroupName":"Group-1","LocationName":"default-location","Type":"2","Model":"WA4320i-ACN-A","SerialID":"219801A0CNC11A0000014"},{"Name":"B2-ap-3","Status":"在线","GroupName":"Group-1","LocationName":"default-location","Type":"2","Model":"WA4320i-ACN-A","SerialID":"219801A0CNC11A0000013"},{"Name":"B3-ap-3","Status":"在线","GroupName":"Group-1","LocationName":"default-location","Type":"2","Model":"WA4320i-ACN-A","SerialID":"219801A0CNC11A0000015"},{"Name":"N1-ap-1","Status":"在线","GroupName":"Group-1","LocationName":"default-location","Type":"2","Model":"WA2610E-GNP","SerialID":"219801A0CNC11A0000018"},{"Name":"N1-ap-3","Status":"在线","GroupName":"Group-1","LocationName":"default-location","Type":"2","Model":"WA2610E-GNP","SerialID":"219801A0CNC11A0000020"},{"Name":"N2-ap-1","Status":"在线","GroupName":"Group-1","LocationName":"default-location","Type":"2","Model":"WA2610E-GNP","SerialID":"219801A0CNC11A0000021"},{"Name":"N3-ap-1","Status":"在线","GroupName":"Group-1","LocationName":"default-location","Type":"2","Model":"WA4320i-ACN-A","SerialID":"219801A0CNC11A0000026"},{"Name":"N3-ap-2","Status":"在线","GroupName":"Group-1","LocationName":"default-location","Type":"2","Model":"WA4320i-ACN-A","SerialID":"219801A0CNC11A0000023"},{"Name":"N3-ap-3","Status":"在线","GroupName":"Group-1","LocationName":"default-location","Type":"2","Model":"WA2610E-GNP","SerialID":"219801A0CNC11A0000022"},{"Name":"g1-ap-3","Status":"正在下载版本","GroupName":"Group-1","LocationName":"default-location","Type":"2","Model":"417-AM","SerialID":"219801A0CNC11A000002"},{"Name":"g2-ap-1","Status":"在线","GroupName":"Group-1","LocationName":"default-location","Type":"2","Model":"417-AM","SerialID":"219801A0CNC11A000003"},{"Name":"g2-ap-2","Status":"在线","GroupName":"Group-1","LocationName":"default-location","Type":"2","Model":"WA2620-AGN-S","SerialID":"219801A0CNC11A000005"},{"Name":"g2-ap-3","Status":"在线","GroupName":"Group-1","LocationName":"default-location","Type":"2","Model":"417-AM","SerialID":"219801A0CNC11A000004"},{"Name":"g3-ap-1","Status":"在线","GroupName":"Group-1","LocationName":"default-location","Type":"2","Model":"WA4320-ACN-SI","SerialID":"219801A0CNC11A000008"},{"Name":"g3-ap-2","Status":"在线","GroupName":"Group-1","LocationName":"default-location","Type":"2","Model":"WA4320-ACN-SI","SerialID":"219801A0CNC11A000007"},{"Name":"g3-ap-3","Status":"在线","GroupName":"Group-1","LocationName":"default-location","Type":"2","Model":"WA4320-ACN-SI","SerialID":"219801A0CNC11A000006"}];
            $("#GroupList").SList ("refresh", g_aAllAps);
            
            var aRunAPList = [{"Name":"AP1","Model":"WA2620-AGN","Type":"1","SerialID":"229822A2CNC22A222233","MacAddress":"33-33-33-33-33-33","RadioNum":2,"Status":"1","Ipv4Address":"1.1.1.1","Ipv6Address":"1:1::1:1","PortNumber":"65535","GroupName":"group1","OnlineTime":"14:06:46:55","HWVer":"1.0.0.1","SWVer":"B108D001SP01","BWVer":"23.0.1","TransCtrlPkt":"4294967295","RecvCtrlPkt":"4294967295","TransDataPkt":"4294967295","RecvDataPkt":"4294967295","EchoReqCnt":"4294967295","EchoRespLossCnt":"4294967295","DiscoveryType":"1","ConfigFailCnt":"4294967295","LastFailReason":"Unknown","LastRebootReason":"Unknown","TunnelDownReason":"Unknown","ConnectionType":"1","PeerACIPv4Address":"2.2.2.2","PeerACIPv6Address":"2:2::2:2","LocationName":"NewYork","AuthenticatedFlag":"true","ClientsNumber":"1","Throughput":"21/12","IPAddress":"1.1.1.1, 1:1::1:1","Radios":"802.11b(1),802.11g(2)","_attr":{"collapsed":false,"show":true},"_id":"AllApList_8003537419717759","index":"0"},{"Name":"AP2","Model":"WA2620","Type":"1","SerialID":"229822A2CNC22A222233","MacAddress":"33-33-33-33-33-33","RadioNum":2,"Status":"2","Ipv4Address":"1.1.1.1","Ipv6Address":"1:1::1:1","PortNumber":"65535","GroupName":"group1","OnlineTime":"0:06:30:56","HWVer":"1.0.0.1","SWVer":"B108D001SP01","BWVer":"23.0.1","TransCtrlPkt":"4294967295","RecvCtrlPkt":"4294967295","TransDataPkt":"4294967295","RecvDataPkt":"4294967295","EchoReqCnt":"4294967295","EchoRespLossCnt":"4294967295","DiscoveryType":"1","ConfigFailCnt":"4294967295","LastFailReason":"Unknown","LastRebootReason":"Unknown","TunnelDownReason":"Unknown","ConnectionType":"1","PeerACIPv4Address":"2.2.2.2","PeerACIPv6Address":"2:2::2:2","LocationName":"NewYork","AuthenticatedFlag":"true","ClientsNumber":"2","Throughput":"31/13","IPAddress":"1.1.1.1, 1:1::1:1","Radios":"802.11a(1),802.11b(2)","_attr":{"collapsed":false,"show":true},"_id":"AllApList_5842041769064963","index":"2"},{"Name":"AP3","Model":"WA2620i-AGN","Type":"1","SerialID":"229822A2CNC22A222233","MacAddress":"33-33-33-33-33-33","RadioNum":2,"Status":"0","Ipv4Address":"1.1.1.1","Ipv6Address":"1:1::1:1","PortNumber":"65535","GroupName":"group1","OnlineTime":"0:03:25:45","HWVer":"1.0.0.1","SWVer":"B108D001SP01","BWVer":"23.0.1","TransCtrlPkt":"4294967295","RecvCtrlPkt":"4294967295","TransDataPkt":"4294967295","RecvDataPkt":"4294967295","EchoReqCnt":"4294967295","EchoRespLossCnt":"4294967295","DiscoveryType":"1","ConfigFailCnt":"4294967295","LastFailReason":"Unknown","LastRebootReason":"Unknown","TunnelDownReason":"Unknown","ConnectionType":"1","PeerACIPv4Address":"2.2.2.2","PeerACIPv6Address":"2:2::2:2","LocationName":"NewYork","AuthenticatedFlag":"false","ClientsNumber":"3","Throughput":"41/14","IPAddress":"1.1.1.1, 1:1::1:1","Radios":"802.11g(1),802.11a(2)","_attr":{"collapsed":false,"show":true},"_id":"AllApList_2584355091676116","index":"1"},{"Name":"AP4","Model":"WA2620","Type":"1","SerialID":"229822A2CNC22A222233","MacAddress":"33-33-33-33-33-33","RadioNum":2,"Status":"2","Ipv4Address":"1.1.1.1","Ipv6Address":"1:1::1:1","PortNumber":"65535","GroupName":"group1","OnlineTime":"0:00:01:53","HWVer":"1.0.0.1","SWVer":"B108D001SP01","BWVer":"23.0.1","TransCtrlPkt":"4294967295","RecvCtrlPkt":"4294967295","TransDataPkt":"4294967295","RecvDataPkt":"4294967295","EchoReqCnt":"4294967295","EchoRespLossCnt":"4294967295","DiscoveryType":"1","ConfigFailCnt":"4294967295","LastFailReason":"Unknown","LastRebootReason":"Unknown","TunnelDownReason":"Unknown","ConnectionType":"1","PeerACIPv4Address":"2.2.2.2","PeerACIPv6Address":"2:2::2:2","LocationName":"NewYork","AuthenticatedFlag":"false","ClientsNumber":"4","Throughput":"51/15","IPAddress":"1.1.1.1, 1:1::1:1","Radios":"802.11n(2.4GHz)(1),802.11b(2)","_attr":{"collapsed":false,"show":true},"_id":"AllApList_16100481268949807","index":"3"},{"Name":"AP5","Model":"WA2620","Type":"1","SerialID":"229822A2CNC22A222233","MacAddress":"33-33-33-33-33-33","RadioNum":2,"Status":"2","Ipv4Address":"1.1.1.1","Ipv6Address":"1:1::1:1","PortNumber":"65535","GroupName":"group1","OnlineTime":"0:00:00:02","HWVer":"1.0.0.1","SWVer":"B108D001SP01","BWVer":"23.0.1","TransCtrlPkt":"4294967295","RecvCtrlPkt":"4294967295","TransDataPkt":"4294967295","RecvDataPkt":"4294967295","EchoReqCnt":"4294967295","EchoRespLossCnt":"4294967295","DiscoveryType":"1","ConfigFailCnt":"4294967295","LastFailReason":"Unknown","LastRebootReason":"Unknown","TunnelDownReason":"Unknown","ConnectionType":"1","PeerACIPv4Address":"2.2.2.2","PeerACIPv6Address":"2:2::2:2","LocationName":"NewYork","AuthenticatedFlag":"true","ClientsNumber":"5","Throughput":"71/17","IPAddress":"1.1.1.1, 1:1::1:1","Radios":"802.11n(2.4GHz)(1),802.11g(2)","_attr":{"collapsed":false,"show":true},"_id":"AllApList_9092901365365833","index":"4"},{"Name":"AP6","Model":"WA2620","Type":"1","SerialID":"229822A2CNC22A222233","MacAddress":"33-33-33-33-33-33","RadioNum":2,"Status":"2","Ipv4Address":"1.1.1.1","Ipv6Address":"1:1::1:1","PortNumber":"65535","GroupName":"group1","OnlineTime":"0:21:15:42","HWVer":"1.0.0.1","SWVer":"B108D001SP01","BWVer":"23.0.1","TransCtrlPkt":"4294967295","RecvCtrlPkt":"4294967295","TransDataPkt":"4294967295","RecvDataPkt":"4294967295","EchoReqCnt":"4294967295","EchoRespLossCnt":"4294967295","DiscoveryType":"1","ConfigFailCnt":"4294967295","LastFailReason":"Unknown","LastRebootReason":"Unknown","TunnelDownReason":"Unknown","ConnectionType":"1","PeerACIPv4Address":"2.2.2.2","PeerACIPv6Address":"2:2::2:2","LocationName":"NewYork","AuthenticatedFlag":"false","ClientsNumber":"4","Throughput":"61/16","IPAddress":"1.1.1.1, 1:1::1:1","Radios":"802.11a(1),802.11b(2)","_attr":{"collapsed":false,"show":true},"_id":"AllApList_47986317658796906","index":"5"}]
            $("#AllApList").mlist ("refresh", aRunAPList);
        // /********************end************************************/
        // }
        // var aRequest = [];
        // var oAPSummary = Utils.Request.getTableInstance(NC.APSummary);
        // var oTOPRateOfAP = Utils.Request.getTableInstance(NC.TOPRateOfAP);
        // var oTOPClientOfAP = Utils.Request.getTableInstance(NC.TOPClientOfAP);
        // var oAPGroup = Utils.Request.getTableInstance(NC.APGroup);
        // var oAllAP = Utils.Request.getTableInstance(NC.AllAP);
        // var oManualAP = Utils.Request.getTableInstance(NC.ManualAP);
        // var oRunAP = Utils.Request.getTableInstance(NC.RunAP);
        // var oRadioOfRunAP = Utils.Request.getTableInstance(NC.RadioOfRunAP);
        // var oRadioOfManualAP = Utils.Request.getTableInstance(NC.RadioOfManualAP);
        // var oAPAssociations = Utils.Request.getTableInstance(NC.APAssociations);
        // var oChannelReport = Utils.Request.getTableInstance (NC.ChannelReport);
        // aRequest.push(oAPSummary,oAllAP,oAPGroup,oManualAP,oRunAP,oTOPRateOfAP,oTOPClientOfAP,oRadioOfRunAP,oRadioOfManualAP,oAPAssociations,oChannelReport)
        // Utils.Request.getAll (aRequest, myCallback);
    }

    // function refreshRunAP ()
    // {
        // function myCallback (oInfo)
        // {
        //     var aRunAPs = Utils.Request.getTableRows (NC.RunAP, oInfo) || [];
        //     var aRadioOfRunAP = Utils.Request.getTableRows (NC.RadioOfRunAP, oInfo) || [];
        //     var aAPAssociations = Utils.Request.getTableRows (NC.APAssociations, oInfo) || [];

        //     var aRunAPList = getRunAps(aRunAPs,aRadioOfRunAP,aAPAssociations);

        //     $("#AllApList").mlist ("refresh", aRunAPList);
        // }
        // var aRequest = [];
        // var oRunAP = Utils.Request.getTableInstance(NC.RunAP);
        // var oRadioOfRunAP = Utils.Request.getTableInstance(NC.RadioOfRunAP);
        // var oAPAssociations = Utils.Request.getTableInstance(NC.APAssociations);
        // aRequest.push(oRunAP,oRadioOfRunAP,oAPAssociations)
        // Utils.Request.getAll (aRequest, myCallback);
    // }

    function _init (oPara)
    {
        // NC = Utils.Pages[MODULE_NC].NC;
        g_aAllAps = [];
        initGrid();
        initForm();
        //drawBar(); 
        initData();
        initLable();
    }


    function _destroy ()
    {
        g_oResizeTimer = null;
    }

    function _resize2()
    {
        if(hTimer)
        {
            clearTimeout(hTimer);
        }
        hTimer = setTimeout(initLable,200);
    }

function _resize(jParent)
{
    if(g_oResizeTimer)
    {
        clearTimeout(g_oResizeTimer);
    }
    g_oResizeTimer = setTimeout(function(){
        g_eChannelBusyBar && g_eChannelBusyBar.chart && g_eChannelBusyBar.resize();
        g_eInterfaceBar && g_eInterfaceBar.chart && g_eInterfaceBar.resize();
    }, 200);
}

Utils.Pages.regModule (MODULE_NAME, {
    "init": _init,
    "destroy": _destroy,
    "resize": _resize,
    "widgets": ["Echart","SList","Mlist"],
    "utils": [],
    "subModules": []
});

}) (jQuery);
