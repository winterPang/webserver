; (function ($) {
	var MODULE_NAME = "h_dashboard.health";
    var g_jForm= null;

    function getRcText (sRcId)
    {
        return Utils.Base.getRcString ("health_rc", sRcId);
    }
    function initScorePie(score, status) {
        if (status == 1) {
            score = score || 0;
        } else {
            score = 100;
        }
        var centerPieStyle = {
            normal: {
                color: 'white',
                label: { show: true, position: 'center' },
                labelLine: { show: false }
            },
            emphasis: {
                label: {
                    show: true,
                    formatter: function (params) {
                        if (status == 1) {
                            return params.data.score;
                        } else {
                            return "离线";
                        }
                    },
                    textStyle: (status == 1 ? {
                        baseline: "middle",
                        fontSize: "30",
                        color: "#646D77",
                    } : {
                            baseline: "middle",
                            fontSize: "20",
                            color: "#646D77",
                        })
                }
            }
        };
        var otherStyle = {
            normal: {
                color: "white",
                labelLine: { show: false, }
            }
        }
        var scoreStyle = {
            normal: {
                color: (status == 1 ? ((score >= 80 ? "#4ec1b2" : (score >= 60 ? "#fbceb1" : "#fe808b"))) : "#f5f5f5"),//"#fe808b",
                labelLine: { show: false, }
            }
        }
        var option = {
            height: "180px",
            width: "215px",
            series: [
                {
                    type: "pie",
                    // center:["70%","50%"],
                    radius: [0, 50],
                    max: 100,
                    itemStyle: {
                        normal: {
                            label: {
                                formatter: function (params) {
                                    if (status == 1) {
                                        return params.data.score;
                                    } else {
                                        return "0";
                                    }
                                },
                                textStyle: (status == 1 ? {
                                    baseline: "middle",
                                    fontSize: "30",
                                    color: "#646D77",
                                } : {
                                        baseline: "middle",
                                        fontSize: "40",
                                        color: "#646d77",
                                    })
                            }
                        }
                    },
                    data: [
                        { value: 100, score: score, itemStyle: centerPieStyle }
                    ]
                },
                {
                    type: "pie",
                    // center:["70%","50%"],
                    radius: [50, 58],
                    max: 100,
                    clockWise: false,
                    data: [
                        { value: 100 - score, itemStyle: otherStyle },
                        { value: score, itemStyle: scoreStyle }
                    ]
                }
            ]
        }
        $("#score-pie").echart("init", option);
    }
    function initHealthScore() {
        function updataHealthScore(healthData) {
            if (!healthData) {
                healthData = {
                    finalscore: 0,
                    wanspeed: 0,
                    APpercent: 0,
                    clientspeed: 0,
                    security: 0,
                    wireless: 0,
                    system: 0,
                    Bpercent: 0
                };
            }
            if (healthData.finalscore == 0) {
            } else if (healthData.finalscore < 40) {
                $("#terminalMessage").css("color", "#fe8086").css("fontFamily", "arial,华文细黑").css("textShadow", "none");
                $("#terminalMessage").html(getRcText("TIP_PROFIX1") + healthData.Bpercent + getRcText("TIP1"));
            } else if (healthData.finalscore < 70) {
                $("#terminalMessage").css("color", "#fbceb1").css("fontFamily", "arial,华文细黑").css("textShadow", "none");
                $("#terminalMessage").html(getRcText("TIP_PROFIX2") + healthData.Bpercent + getRcText("TIP2"));
            } else if (healthData.finalscore <= 100) {
                $("#terminalMessage").css("color", "#4ec1b2").css("fontFamily", "arial,华文细黑").css("textShadow", "none");
                if (healthData.finalscore < 80) {
                    $("#terminalMessage").html(getRcText("TIP_PROFIX2") + healthData.Bpercent + getRcText("TIP3"));
                } else if (healthData.finalscore < 90) {
                    $("#terminalMessage").html(getRcText("TIP_PROFIX2") + healthData.Bpercent + getRcText("TIP4"));
                } else {
                    $("#terminalMessage").html(getRcText("TIP_PROFIX2") + healthData.Bpercent + getRcText("TIP5"));
                }
            }

            var option = {
                height: "180px",
                width: "250px",
                calculable: false,
                polar: [
                    {
                        indicator: [
                            {text: '上行剩余宽带', max: 5,},
                            {text: 'AP在线率', max: 5},
                            {text: '终端速率', max: 5},
                            {text: '安全评价', max: 5},
                            {text: '无线环境', max: 5},
                            {text: '系统健康度', max: 5}
                        ],
                        radius: 60,
                        name: {
                            textStyle: { color: '#616e7f', fontFamily: 'arial', fontSize: 13 }
                        }
                    }

                ],
                series: [
                    {
                        name: '评分',
                        type: 'radar',
                        center: ['60%', '50%'],
                        itemStyle: {
                            normal: {
                                areaStyle: {
                                    color: "rgba(105,196,197, 0.5)"
                                },
                                lineStyle: {
                                    width: 1,
                                    fontFamily: '华文细黑',
                                    type: 'solid'//'solid' | 'dotted' | 'dashed'
                                },
                                color: "rgba(200,200,200,0.1)"
                            },
                            emphasis: {
                                areaStyle: { color: "rgba(105,196,197,0.8)" }
                            }
                        },
                        data: [
                            {
                                value: [
                                    healthData.wanspeed,
                                    healthData.APpercent,
                                    healthData.clientspeed,
                                    healthData.security,
                                    healthData.wireless,
                                    healthData.system
                                ],
                                name: '',
                                symbol: 'circle',
                                symbolSize: 0

                            }
                        ]
                    }
                ]
            };
            $("#apphealth").echart("init", option);
            initScorePie(healthData.finalscore, 1);
        }
        function getHealthFlowSuc (data) {
            var healthData = JSON.parse(data) || "";
            updataHealthScore(healthData);
        }
        function getHealthFlowFail (argument) {
            Frame.Msg.info("连接错误");     
        }
        var healthFlowOpt = {
            url : MyConfig.path+"/health/home/health?acSN=" + FrameInfo.ACSN,
            type: "GET",
            dataType:"json",
            onSuccess:getHealthFlowSuc,
            onFailed:getHealthFlowFail
        }
        Utils.Request.sendRequest(healthFlowOpt);
    }

    function showSystem (argument) {
        Utils.Base.openDlg("h_dashboard.utilization", {}, {className:"modal-large"});
    }
    function initForm (argument) {
    	$("#system").click(function () {
            showSystem();
        });
    }
    function _init() {
        g_jForm = $("#system_form");
        initForm();        
        initHealthScore();
    }

    function _destroy() {
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }
    function _resize() {

    }
    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["Echart", "Panel", "DateTime", "Form"],
        "utils": ["Request", "Base", "Msg"]
    });
})(jQuery);