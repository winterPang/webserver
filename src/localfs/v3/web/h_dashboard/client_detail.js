(function ($)
{
    /* I am testing jQuery & JS below */
var topics = {};
 
jQuery.Topic = function( id ) {
  var callbacks, method,
    topic = id && topics[ id ];
 
  if ( !topic ) {
    callbacks = jQuery.Callbacks();
    topic = {
      publish: callbacks.fire,
      subscribe: callbacks.add,
      unsubscribe: callbacks.remove
    };
    if ( id ) {
      topics[ id ] = topic;
    }
  }
  return topic;
};
    /* the uppper is me testing grammar */
    var MODULE_NAME = "h_dashboard.client_detail";
    var g_allData, g_oTop5Usage;
    var hTimer = false;
    function getRcText (sRcId)
    {
        return Utils.Base.getRcString ("client_detail_rc", sRcId);
    }

    function drawDevice(oResponse){
        oResponse = JSON.parse(oResponse);
        var aType = oResponse.client_statistic;
        var aData = [];  
        var nNUm = 5;
        var ndata = [];     
        /* get the name of the manufacturer */
        $.each(aType, function(index, item){
            var oData = {};
            if("" === item.clientVendor){
                item.clientVendor = "Unknown";
            }
            oData.name = item.clientVendor;
            oData.value = item.count;
            aData.push(oData);
            ndata.push(nNUm)
        });
        var option = {
            height:180,
            tooltip : {
                show:true,
                trigger: 'item',
                formatter: "{b}<br/> {c} ({d}%)"
            },
            legend: {
                orient : 'vertical',
                x : '60%',
                y : 'top',
                data: aData
            },
            calculable : false,
            series : [
                {
                    name:'Client Type',
                    type:'pie',
                    radius : '75%',
                    center: ['25%', '50%'],
                    itemStyle : {
                        normal : {
                            label : {
                                position : 'inner',
                                formatter : function (a,b,c,d) {
                                    return (a.percent - 0).toFixed(0) + '%'
                                }
                            },
                            labelLine : {
                                show : false
                            }
                        },
                        emphasis : {
                            label : {
                                formatter : "{b}\n{d}%"
                            }
                        }
                    },
                    data:aData
                }
            ]
        };
        var oTheme = {
            color : ['#7FCAEA','#2090C2','#A1E7F1','#FFE38B','#FABA86','#F38D8D','#F3ABCA','#D1D7DD']
        };
        $("#deviceType").echart ("init", option,oTheme);
    }

    function drawNoiseBar(aData)
    {
        var om = {
            'start':'-',
            'end':'-'
        };
        var oe = [0];

        for(var i=0;i<aData.length;i++)
        {
            var nValue = aData[i].subData.length;
            om[aData[i].name] = nValue;
            oe.push(nValue == 0 ? 1 : 5 );
        }
        oe.push(0);

        var oNiseFloor = {
            height:40,
            data:om,
            calculable : false,
            grid: {
                x: 0, y:15,  x2:0, y2: 0,
                borderColor : '#FFF'
            },
            xAxis : [
                {
                    show:false,
                    splitLine:false,
                    type : 'category',
                    data : ['start','S0','S1','S2','S3','S4','S5','S6','S7','S8','S9','end']
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
                    data:oe,
                    itemStyle : {
                        normal: {
                            color:function(a, b, c, d, e, data){
                                var aColor = ["#FF0000", "#FF0000", "#FF0000", "#FA2626", "#FFA300", "#FFAA18", "#00DF00", "#00DF00", "#00CB00", "#00C100", "#00AD00", "#009900", "#009900"];
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
        $("#snr").echart ("init", oNiseFloor, oNiseFloorTheme);
    }

    function drawSpeedBar(aData)
    {
        var om = {
            'start':'-',
            'end':'-'
        };
        var oe = [0];

        for(var i=0;i<aData.length;i++)
        {
            var nValue = aData[i].subData.length;
            om[aData[i].name] = nValue;
            oe.push(nValue == 0 ? 1 : 5 );
        }
        oe.push(0);

        var oNiseFloor = {
            height:40,
            mData:om,
            calculable : false,
            grid: {
                x: 0, y:15,  x2:0, y2: 0,
                backgroundColor : '#FFF',
                borderColor : '#FFF'
            },
            xAxis : [
                {
                    show:false,
                    splitLine:false,
                    type : 'category',
                    data : ['start','S6','S12','S24','S36','S54','S108','S450',"end"]
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
                    data:oe,
                    itemStyle : {
                        normal: {
                            color:function(a, b, c, d, e, data){
                                var aColor = ['#090','#6FF','#3CF','#3CF','#399',
                                    '#3C0','#3C0','#090','#FFA300'];
                                return aColor[a.dataIndex];
                            },
                            label : {
                                show: true,
                                position: 'inside',
                                formatter:function(a, b, c, d, e, data){
                                    var sLabel=this._option["mData"][a.name];
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
        $("#speed").echart ("init", oNiseFloor, oNiseFloorTheme);
    }
    
    function  drawLabel(jLabel,opt)
    {
        jLabel.empty();
        var _height= jLabel.height();
        var _width = jLabel.parent().width();
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
        drawLabel($("#snr_label"),{
            data : ['10','15','20','25','30','35','40','45','50','55','60']
        });
        drawLabel($("#speed_label"),{
            data : ['0','6','12','24','36','54','108','450']
        });
    }

    function updateInfor(aData)
    {
        var oInfor = {
            Total : aData.length, "11b" : 0, "11g" : 0, "11gn" : 0, "11a" : 0, "11ac" : 0, "11an" : 0
        };

        aData.sort(function(a,b){
            return b.clientRxRate-a.clientRxRate;
        });
        
        var oAll = {
            speed : [
                {name:"S6",subData:[]},
                {name:"S12",subData:[]},
                {name:"S24",subData:[]},
                {name:"S36",subData:[]},
                {name:"S54",subData:[]},
                {name:"S108",subData:[]},
                {name:"S450",subData:[]}
            ],
            snr : [
                {name:"S0",subData:[]},
                {name:"S1",subData:[]},
                {name:"S2",subData:[]},
                {name:"S3",subData:[]},
                {name:"S4",subData:[]},
                {name:"S5",subData:[]},
                {name:"S6",subData:[]},
                {name:"S7",subData:[]},
                {name:"S8",subData:[]},
                {name:"S9",subData:[]}
            ]
        };
        for(var i=0;i<oInfor.Total;i++)
        {
            var oTemp = aData[i];

            oInfor[oTemp.clientMode]++;

            var nSpeed = parseInt(oTemp.clientRxRate);
            if(nSpeed <= 6){
                oAll.speed[0].subData.push(oTemp);
            }else if(nSpeed > 6 && nSpeed <= 12){
                oAll.speed[1].subData.push(oTemp);
            }else if(nSpeed > 12 && nSpeed <= 24){
                oAll.speed[2].subData.push(oTemp);
            }else if(nSpeed > 24 && nSpeed <= 36){
                oAll.speed[3].subData.push(oTemp);
            }else if(nSpeed > 36 && nSpeed <= 54){
                oAll.speed[4].subData.push(oTemp);
            }else if(nSpeed > 54 && nSpeed <= 108){
                oAll.speed[5].subData.push(oTemp);
            }else if(nSpeed > 108){
                oAll.speed[6].subData.push(oTemp);
            }

            var nSnr = parseInt(oTemp.signalStrength/5 -2);
            nSnr = nSnr < 0 ? 0 : (nSnr > 9 ? 9 : nSnr);
            oAll.snr[nSnr].subData.push(oTemp);
        }

        return oAll;
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

    function refreshClient()
    {
        function myCallback (oInfo)
        {
            var aMode = getRcText("MODE").split(",");
            $.each(aStation, function(index, oStation){
                oStation.IpAddress = oStation.Ipv4Address + ", " + oStation.Ipv6Address;
                oStation.Throughput = oStation.RxRate + "/" + oStation.TxRate;
                switch(oStation.WirelessMode)
                {
                    case "1":
                    case "2":
                        oStation.WirelessMode = aMode[oStation.WirelessMode];
                        break;
                    case "4":
                        oStation.WirelessMode = aMode[3];
                        break;
                    case "8":
                        oStation.WirelessMode = aMode[4];
                        break;
                    case "16":
                        oStation.WirelessMode = aMode[5];
                        break;
                    case "64":
                        oStation.WirelessMode = aMode[6];
                        break;
                    default :
                        break;
                }
                oStation.UpTime = datatime(oStation.UpTime);
            });
            $("#clientList").mlist ("refresh", aStation);

        }
        var aRequest = [];
        //var oStation = Utils.Request.getTableInstance (NC.Stations);
        aRequest.push(oStation);
        Utils.Request.getAll (aRequest, myCallback);
    }

    function disconnectClient()
    {
        if($(this).hasClass("disabled"))
        {
            return false;
        }

        //var oReset = Utils.Request.getTableInstance(NC.ResetClient);
        var aSelectDatas =  $("#clientList").mlist('selectDatas');
        for(var i=0; i<aSelectDatas.length;i++)
        {
            oReset.addRows({"MacAddress":aSelectDatas[i].MacAddress});
        }
        Utils.Request.action([oReset], refreshClient);
    }

    function initForm()
    {
        $("#back_to_uppage_client").on("click",function(){
            history.back();
        });
        $("#DownStream").on("click", function(){
            $(this).addClass("active");
            $("#UpStream").removeClass("active");
            $("#TxTop5").addClass('hide');
            $("#RxTop5").removeClass('hide')
                        .SList ("refresh", g_oTop5Usage.RxRate);
        });
        $("#UpStream").on("click", function(){
            $(this).addClass("active");
            $("#DownStream").removeClass("active");
            $("#RxTop5").addClass('hide');
            $("#TxTop5").removeClass('hide')
                        .SList ("refresh", g_oTop5Usage.TxRate);
        });
    }

    function onRowChanged(aRowData)
    {
        if(aRowData && aRowData.length > 0)
        {
            $(".mlist-icon").last().removeClass("disabled");
        }
        else
        {
            $(".mlist-icon").last().addClass("disabled");
        }
    }

    function initGrid ()
    {
        var opt = {
            showHeader: true,
            sortable : false,
            multiSelect: false,
            pageSize: 5,
            colNames: getRcText ("TX_HEADER"),
            colModel: [
                {name: "MacAddress", datatype: "String",width:100},
                {name: "Ipv4Address", datatype: "String",width:80},
                {name: "UserName", datatype: "String",width:60},
                {name: "Ssid", datatype: "String",width:60},
                {name: "TxRate", datatype: "Interger",width:80}
            ]
        };
        $("#TxTop5").SList ("head", opt);
        var opt = {
            showHeader: true,
            sortable : false,
            multiSelect: false,
            pageSize: 5,
            colNames: getRcText ("RX_HEADER"),
            colModel: [
                {name: "MacAddress", datatype: "String",width:100},
                {name: "Ipv4Address", datatype: "String",width:80},
                {name: "UserName", datatype: "String",width:60},
                {name: "Ssid", datatype: "String",width:60},
                {name: "RxRate", datatype: "Interger",width:80}
            ]
        };
        $("#RxTop5").SList ("head", opt);
    }

    function getTop5Data(oResponse)
    {
        var aStation = oResponse["clientList"];
        var oTop5Usage = {};
        var nLen = aStation.length;
        /* array is sorted here below*/
        for(var i=0; i<nLen-1; i++)
        {
            for(var j=i+1; j<nLen; j++)
            {
                if(Number(aStation[i].clientRxRate) < Number(aStation[j].clientRxRate))
                {
                    var oTemp = aStation[j];
                    aStation[j] = aStation[i];
                    aStation[i] = oTemp;
                }
            }
        }
        if(aStation.length>5)
        {
            var aTop5 = [];
            for(var ii=0; ii<5; ii++)
            {
                aTop5.push(aStation[ii]);
            }
            oTop5Usage.RxRate = aTop5;
        }
        else
        {
            oTop5Usage.RxRate = aStation;
        }
        for(var i=0; i<nLen-1; i++)
        {
            for(var j=i+1; j<nLen; j++)
            {
                if(Number(aStation[i].clientTxRate) < Number(aStation[j].clientTxRate))
                {
                    var oTemp = aStation[j];
                    aStation[j] = aStation[i];
                    aStation[i] = oTemp;
                }
            }
        }
        if(aStation.length>5)
        {
            var aTop5 = [];
            for(var ii=0; ii<5; ii++)
            {
                aTop5.push(aStation[ii]);
            }
            oTop5Usage.TxRate = aTop5;
        }
        else
        {
            oTop5Usage.TxRate = aStation;
        }
        return oTop5Usage;
    }

    function getClientNum(aSation)
    {
        var oClientCnt = {};
        oClientCnt.Total = aSation.length;
        $.each(aSation, function(index, oStation){
            var num = oClientCnt["wsm" + oStation.WirelessModeNum];
            oClientCnt["wsm" + oStation.WirelessModeNum] = !num ? 1 : num + 1;
        });
        return oClientCnt;
    }

    function initData ()
    {
        /* draw pie chart with ajax get */
    var a  =   $.ajax({
            tpye: "GET",
            url : "http://lvzhouv3.h3c.com/v3/stamonitor/getclientstatisticbybyod",
            datatype: "json",
            data: {
                devSN:FrameInfo.ACSN
            },
            processData:true,
            success:drawDevice,
            error:function(err){
                /* error process here*/
            }
        });

        /* get wireless mode statistic with ajax get */
        $.ajax({
           type: "GET",
           url:"http://lvzhouv3.h3c.com/v3/stamonitor/getclientstatisticbymode",
           datatype:"json",
           data:{
                devSN:FrameInfo.ACSN
           },
           processData:true,
           success:function(oResponse){
                /* success process here */
                oResponse = JSON.parse(oResponse);
                var oClientCnt = {"Total":0,"11b":0,"11g":0,"11gn":0,
                                            "11a":0,"11an":0,"11ac":0};
                $.each(oResponse["client_statistic"], 
                    function(key,value){
                        oClientCnt[key] = value;
                        oClientCnt["Total"] += value;
                });
                Utils.Base.updateHtml($("#client_container"), oClientCnt);
           },
           eror:function(err){
                /* error process here*/
           }
        });

        /* get client detail with ajax post */
        $.ajax({
            method:"POST",
            url:"http://lvzhouv3.h3c.com/v3/stamonitor/getclientstatisticbymode_detail",
            datatype:"json",
            data:{
                devSN:FrameInfo.ACSN
            },
            processData:true,
            success:function(oResponse){
                oResponse = JSON.parse(oResponse);
                g_oTop5Usage = getTop5Data(oResponse) || {};
                $("#TxTop5").SList ("refresh", g_oTop5Usage.TxRate);
                g_allData = updateInfor(oResponse["clientList"]);
                drawSpeedBar(g_allData.speed);
                drawNoiseBar(g_allData.snr);
                g_allData.allData = oResponse["clientList"];
            },
            error:function(err){

            }
        });
    }

    function _init ()
   {
        initForm();
        initGrid();
        initData();
        initLable();
    }

    function _resize()
    {
        if(hTimer)
        {
            clearTimeout(hTimer);
        }
        hTimer = setTimeout(initLable,200);
    }


    function _destroy ()
    {
        clearTimeout(hTimer);
    }

    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        'resize':_resize,
        "widgets": ["Mlist","Echart","SList"],
        "utils": ["Request","Timer","Base"],
    });

}) (jQuery);
