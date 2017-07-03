;(function ($) {
    var MODULE_NAME     = "city_wips.info";

    var g_today         = new Date();
    var g_startTime     = parseInt((new Date(g_today.toDateString()) - 0)/1000);
    var g_endTime       = parseInt((g_today - 0)/1000);
    var g_choice        = 0;
    var g_attackList    = [];
    var g_apList        = [];
    var g_clientList    = [];
    var g_Type 			= ["严重攻击","泛洪攻击","畸形报文"];
    var stationClassify = ["","授权AP","配置错误AP","非法AP","外部AP","ad hoc网络",
        "mesh网络","潜在授权AP","潜在非法AP","潜在外部AP","无法确认的AP","授权客户端",
        "未授权客户端","误关联客户端","未分类客户端"];
    var g_allAttack         = [ [   "",                                          /*0*/
                                    "AP仿冒攻击",                                /*1*/
                                    "",                                          /*2*/
                                    "",                                          /*3*/
                                    "Client仿冒攻击",                            /*4*/
                                    "" ,                                         /*5*/
                                    "Weak IV攻击",                               /*6*/
                                    "Windows网桥攻击",                           /*7*/
                                    "客户端开启了禁用802.11n 40MHz模式攻击",     /*8*/
                                    "软AP攻击",                                  /*9*/
                                    "客户端节电攻击",                            /*10*/
                                    "Omerta攻击",                                /*11*/
                                    "解关联攻击",                                /*12*/
                                    "解认证攻击",                                /*13*/
                                    "非法信道攻击",                              /*14*/
                                    "AP扮演者攻击",                              /*15*/
                                    "未加密授权AP攻击",                          /*16*/
                                    "未加密的信任客户端",                        /*17*/
                                    "热点攻击",                                  /*18*/
                                    "绿野模式攻击",                              /*19*/
                                    "关联/重关联DoS攻击",                        /*20*/
                                    "蜜罐AP攻击",                                /*21*/
                                    "中间人攻击",                                /*22*/
                                    "无线网桥攻击",                              /*23*/
                                    "AP泛洪攻击",                                /*24*/
                                    "AP信道变化攻击",                            /*25*/
                                    ""                                           /*26*/
                                ],
                                [   "Association-request帧",         /*0*/
                                    "Authentication帧",              /*1*/
                                    "Beacon帧",                      /*2*/
                                    "Block ACK帧",                   /*3*/
                                    "CTS帧",                         /*4*/
                                    "Deauthentication帧" ,           /*5*/
                                    "Disassociation帧",              /*6*/
                                    "EAPOL-Start帧",                 /*7*/
                                    "Null-data帧",                   /*8*/
                                    "Probe-request帧",               /*9*/
                                    "Reassociation-request帧",       /*10*/
                                    "RTS帧",                         /*11*/
                                    "EAPOL-Logoff帧",                /*12*/
                                    "EAP Fail帧",                    /*13*/
                                    "EAP Success帧",                 /*14*/
                                ],
                                [   "IE重复的畸形报文",                                       /*0*/
                                    "Fata-Jack畸形报文",                                      /*1*/
                                    "IBSS和ESS置位异常的畸形报文",                            /*2*/
                                    "源地址为广播或者组播的认证和关联畸形报文",               /*3*/
                                    "畸形Association-request报文",                            /*4*/
                                    "畸形Authentication报文" ,                                /*5*/
                                    "含有无效原因值的解除认证畸形报文",                       /*6*/
                                    "含有无效原因值的解除关联畸形报文",                       /*7*/
                                    "畸形HT IE报文",                                          /*8*/
                                    "IE长度非法的畸形报文",                                   /*9*/
                                    "报文长度非法的畸形报文",                                 /*10*/
                                    "Duration字段超大的畸形报文",                             /*11*/
                                    "无效探查响应报文",                                       /*12*/
                                    "key长度超长的EAPOL报文",                                 /*13*/
                                    "SSID长度超长的畸形报文",                                 /*14*/
                                    "多余IE畸形报文"                                          /*15*/
                                ]
                            ];

    var ajaxInfo            = {
        url:MyConfig.path + '/ant',
        // dataType    :"json",
        type        :"post",
        ACSN        :FrameInfo.ACSN,
        data        : {
            Method:"",
            Param: {
                ACSN:FrameInfo.ACSN,
                StartTime : g_startTime,
                EndTime :g_endTime,
            },
        },
    };

    var dealEvent   = {
        nowState : {},
        nowRadio : 0,
        scope    : "",
        currentid:"",
        init: function(){
            var jscope = $(".probe-choice");
            for(var i = 0; i < jscope.length; i++)
            {
                dealEvent.nowState[jscope[i].getAttribute("id")] = 1;
            }
        },
        liOnClick: function(e){
            var scope = $(this);
            if(scope.val() == dealEvent.nowState[dealEvent.currentid])
            {
                $(".choice-show", dealEvent.scope).removeClass("height-change");
                return false;
            }
            else
            {
                dealEvent.nowState[dealEvent.currentid] = scope.val();
                $(".current-state", dealEvent.scope).text(scope.text());
                $(".choice-show", dealEvent.scope).removeClass("height-change");
            }
            $("#body_over").addClass("hide");

            $(dealEvent.scope).trigger({type:"probechange.probe"}, {value:dealEvent.nowState[dealEvent.currentid]});
        },
        inputClick:function(e){
            dealEvent.nowState[dealEvent.currentid] = 0;
            dealEvent.currentid = $(this).closest(".probe-choice").attr("id");
            dealEvent.scope = "#" + dealEvent.currentid;
            $("#body_over").removeClass("hide");
            $(".choice-show", dealEvent.scope).addClass("height-change");

            return false;
        },
        blackClick:function(e){
            $("#body_over").addClass("hide");
            $(".choice-show", dealEvent.scope).hasClass("height-change") && $(".choice-show", dealEvent.scope).removeClass("height-change");
        },
        searchClick:function(e){
            if(!CheckMac($(".choice-show input", dealEvent.scope).val()))
            {
                $(".choice-show input", dealEvent.scope).addClass("wrong-mac");
                return;
            }
            $(".choice-show input", dealEvent.scope).removeClass("wrong-mac");

            dealEvent.nowState[dealEvent.currentid] = 0;
            $("#body_over").addClass("hide");
            $(".choice-show", dealEvent.scope).removeClass("height-change");
            $(".current-state", dealEvent.scope).text($(".probe-input").val());

            $(dealEvent.scope).trigger({type:"probechange.probe"}, {value:dealEvent.nowState[dealEvent.currentid],parm:$(".probe-input").val()});

        },
        timeClick: function (e) {
            $("#probe_timechoice").addClass("hide");
            //
            //$(dealEvent.scope).trigger({type:"probechange.probe", data:dealEvent.nowState});
            //
        },
        dateChange: function (e) {
            dealEvent.nowState[dealEvent.currentid] = 0;
            var orange = $(this,dealEvent.scope).daterange("getRangeData");
            $(".current-state", dealEvent.scope).text(orange.startData + '-' +orange.endData);
            $(".choice-show", dealEvent.scope).removeClass("height-change");
            StartTime = new Date(orange.startData)-0;
            EndTime = new Date(orange.endData)-0;
            $(dealEvent.scope).trigger({type:"probechange.probe"}, {value:dealEvent.nowState[dealEvent.currentid],startTime:StartTime,endTime:EndTime});
        }
    };

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("wips_detail_rc", sRcName);
    }

    function initSlist(choice)
    {
        initHead(choice);
        switch(choice)
        {
            case 0:
            {
                initAttackList(choice);
                break;
            }
            case 1:
            {
                initClient(choice);
                break;
            }
            case 2:
            {
                initAP(choice);
                break;
            }
        }
    }

    function drawList(choice)
    {
        switch(choice)
        {
            case 0:
            {
                $("#attack_Slist").SList("refresh", g_attackList);
                break;
            }
            case 1:
            {
                $("#device_Slist").SList("refresh", g_clientList);
                break;
            }
            case 2:
            {
                $("#device_Slist").SList("refresh", g_apList);
                break;
            }        
        }

    }

    function initAttackList(choice)
    {
        function successAckList(Message){
        	var message = Message.message || [];
            for(var i = 0; i < message.length; i++)
            {
            	var tempDate = new Date(message[i].ReportTime * 1000);

                g_attackList[i] = {};
                g_attackList[i].ReportTime = tempDate.toLocaleString();
                g_attackList[i].SensorName = message[i].SensorName;
                g_attackList[i].SrcMacAddress = message[i].SrcMacAddress || "-";
                // g_attackList[i].DestMacAddress = message[i].DestMacAddress || "-";
                g_attackList[i].Classify = g_Type[message[i].Type] || "未分类";
                g_attackList[i].Count = message[i].Count;
                g_attackList[i].Detail = g_allAttack[message[i].Type]?(g_allAttack[message[i].Type][message[i].SubType] || "未分类"):"未分类";

            }
            drawList(choice);

        }

        if(g_attackList.length != 0)
        {
            drawList(choice);
            return;
        }

        var option              = ajaxInfo;
        option.data.Method           = "GetAttack";
        option.data.Param.StartTime   = g_startTime;
        option.data.Param.EndTime     = g_endTime;
        option.url              = MyConfig.path + '/ant' + "/read_wips_statistics";
        option.onSuccess          = function(message){
            successAckList(message);
        };
        option.onFailed            = function(error){
            successInfo("Attack", error);
        };

        Utils.Request.sendRequest(option);
    }
    function initAP(choice)
    {
        function myCallback(Message)
        {
        	var message = Message.message ||[];
            for(var i = 0; i < message.length; i++)
            {
                var tempDate = new Date(message[i].LastReportTime * 1000);
                message[i].ClassifyType = stationClassify[message[i].ClassifyType] || "未分类";
                message[i].LastReportTime = tempDate.toLocaleString();
            }
            g_apList = message;
            drawList(choice);
        }
        if(g_apList.length != 0)
        {
            drawList(choice);
            return;
        }

        var options = {
            url:MyConfig.path + '/ant' + "/read_wips_ap",
            type:"post",
            dataType:"json",
            data:{
                Method:"GetStationInfo",
                Param:{
                    ACSN:FrameInfo.ACSN,
                    StartTime:g_startTime,
                    EndTime:g_endTime
                },
                Return:[
                    "MacAddress",
                    "ClassifyType",
                    "LastReportTime"
                ]
            },
            onSuccess:myCallback,
            onFailed:function(error){
                successInfo("ap message", error);
            },

        };

        Utils.Request.sendRequest(options);
        // $.ajax(options);
    }
    function initClient(choice)
    {
        function myCallback(Message)
        {
        	var message = Message.message || [];
            for(var i = 0; i < message.length; i++)
            {
                var tempDate = new Date(message[i].LastReportTime * 1000);
                message[i].ClassifyType = stationClassify[message[i].ClassifyType] || "未分类";
                message[i].LastReportTime = tempDate.toLocaleString();
            }
            g_clientList = message;
            drawList(choice);

        }
        if(g_clientList.length != 0)
        {
            drawList(choice);
            return;
        }

        var options = {
            url:MyConfig.path + '/ant' + "/read_wips_client",
            type:"post",
            dataType:"json",
            data:{
                Method:"GetStationInfo",
                Param:{
                    ACSN:FrameInfo.ACSN,
                    StartTime:g_startTime,
                    EndTime:g_endTime
                },
                Return:[
                    "MacAddress",
                    "ClassifyType",
                    "LastReportTime"
                ]
            },
            onSuccess:myCallback,
            onFailed:function(error){
                successInfo("client message", error);
            },
        };
        Utils.Request.sendRequest(options);
        // $.ajax(options);
    }

    function initHead(choice)
    {
        $("#attack_Slist").children().remove();
        $("#device_Slist").children().remove();
        if(!choice)
        {
            var opt = {
                colNames: getRcText ("LIST_HEADER"),
                showHeader: true,
                search:true,
                pageSize:12,

                colModel: [
                    {name: "SensorName", datatype:"String"},
                    {name: "SrcMacAddress", datatype:"String"},
                    {name: "Classify", datatype: "String"},
                    {name: "Detail", datatype:"String"},
                    {name: "Count", datatype: "String"},
                    {name: "ReportTime", datatype:"String"},
                ]

            };
            $("#attack_Slist").SList("head", opt);
        }
        else
        {
            var Station= {
                colNames: getRcText ("STATION_HEAD"),
                showHeader: true,
                search:true,
                pageSize:12,
                colModel: [
                    {name: "MacAddress", datatype: "String"},
                    {name: "ClassifyType", datatype: "String"},
                    {name: "LastReportTime", datatype: "String"},

                ]
            };
            $("#device_Slist").SList ("head", Station);
        }
    }

    function initData(choice)
    {
    	initSlist(choice);
    }

    function initForm()
    {
    	$(".page-row .button-change span").on("click", function(e){
    		if($(this).attr("value") == $(".page-row .button-change span.active").attr("value"))
    		{
    			return;
    		}
    		else
    		{
    			$(".page-row .button-change span.active").toggleClass("active");
    			$(this).toggleClass("active");
    			g_choice = Number($(this).attr("value"));
    			initData(g_choice);
    		}
    	});
    	$(".choice-head").click(dealEvent.inputClick);
        $(".choice-show li").click(dealEvent.liOnClick);
        $("#body_over").click(dealEvent.blackClick);
        $(".probesearch-icon").click(dealEvent.searchClick);
        $("#probe_timechoice").click(dealEvent.timeClick);
        $("#daterange").on("inputchange.datarange",dealEvent.dateChange);
        $("#datechoice").on("probechange.probe",function(e, param){
			var daytemp = new Date();
            var daynow = parseInt((new Date(daytemp.toDateString()) - 0)/1000);

            switch (Number(param.value))
            {
                case 0:
                {
                    {
                        g_startTime   = parseInt(param.startTime/1000 );
                        g_endTime     = parseInt(param.endTime);
                        break;
                    }
                }
                case 1:
                {
                    g_startTime   = daynow;
                    g_endTime     = daytemp - 0;
                    break;
                }
                case 2:
                {
                    g_startTime   = daynow - 8 *24 * 60 * 60;
                    g_endTime     = daynow;
                    break;
                }
                case 3:
                {
                    g_startTime   = daynow  - 31 *24 * 60 * 60;
                    g_endTime     = daynow;
                    break;
                }
                case 4:
                {
                    g_startTime   = daynow - 366 *24 * 60 * 60;
                    g_endTime     = daynow;
                    break;
                }
            }
            g_attackList    = [];
		    g_apList        = [];
		    g_clientList    = [];

            initData(g_choice);
        });

    }

    function _init()
    {
    	initForm();
        initData(0);
    };

    function _resize(jParent)
    {
    }

    function _destroy()
    {
        g_today         = new Date();
        g_startTime     = parseInt((new Date(g_today.toDateString()) - 0)/1000);
        g_endTime       = parseInt((g_today - 0)/1000);
        g_choice        = 0;
        g_attackList    = [];
        g_apList        = [];
        g_clientList    = [];
 
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["Echart","SingleSelect","DateTime","DateRange","SList"],
        "utils":["Request","Base","Msg"],
    });
})( jQuery );