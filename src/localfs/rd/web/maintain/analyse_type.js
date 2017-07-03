(function($){

    var MODULE_BASE = "maintain";
    var MODULE_NAME = MODULE_BASE + ".analyse_type";

    function getRcText(){

    }

    function initGrid(){

    }

    /*频段占比饼状图*/
    function drwaBand(){

        var option = {
            title : {
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x:"left",
                y:20,
                data: ['5G','2.4G']
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
                    data:[
                        {value:335, name:'5G'},
                        {value:310, name:'2.4G'}
                    ],
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
            color:["gray","yellow"]
        };
        $("#band").echart("init",option);
    }


    /*频段占比饼状图*/
    function drawClientType(){

        var option = {
            title : {
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x:"left",
                y:20,
                data: ['Phone','PC','Unknow']
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
                    data:[
                        {value:50, name:'Phone'},
                        {value:80, name:'PC'},
                        {value:100,name:'Unknow'}
                    ],
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
            color:["gray","yellow","orange"]
        };
        $("#clientType").echart("init",option,oTheme);
    }

    /*操作系统占比*/
    function drawSystem(){

        var option = {
            title : {
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                x : 'center',
                y : 'bottom',
                data:['Windows XP','Windows 8','Windows 7','Android','Unknow','IOS','MacOS']
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
            calculable : true,
            series : [
                {
                    name:'',
                    type:'pie',
                    radius : [20, 80],
                    center : ['50%', 140],
                    roseType : 'radius',
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    lableLine: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    data:[
                        {value:10, name:'Windows XP'},
                        {value:5, name:'Windows 8'},
                        {value:15, name:'Windows 7'},
                        {value:25, name:'Android'},
                        {value:20, name:'Unknow'},
                        {value:35, name:'IOS'},
                        {value:30, name:'MacOS'}
                    ]
                }
            ]
        };
        var oTheme = {};
        $("#system").echart("init",option);
    }

    /*终端关联能力*/
    function drwaClientRelated(){

        var option = {
            title : {
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x:"left",
                y:20,
                data: ['2.4G单频','5G双频']
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
                    data:[
                        {value:50, name:'2.4G单频'},
                        {value:80, name:'5G双频'}
                    ],
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
            color:["#D7DDE4","gray"]
        };
        $("#clientRelated").echart("init",option,oTheme);
    }

    /*终端关联时长*/
    function drawClientTime(){

        var option = {
            title : {
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x:"left",
                y:20,
                data: ['2.4G关联时长','5G关联时长']
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
                    data:[
                        {value:50, name:'2.4G关联时长'},
                        {value:80, name:'5G关联时长'}
                    ],
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
            color:["#D7DDE4","#E64C65"]
        };
        $("#clientTime").echart("init",option,oTheme);
    }

    /*终端单双流能力*/
    function drawClientFlow(){

        var option = {
            title : {
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x:"left",
                y:20,
                data: ['单流','双流']
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
                    data:[
                        {value:50, name:'单流'},
                        {value:80, name:'双流'}
                    ],
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
            color:["#69C4C5","#FFBB33"]
        };
        $("#clientFlow").echart("init",option,oTheme);
    }

    /*无线信号终端占比*/
    function drawWirelessClient(){

        var option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                y:20,
                data:['@AP-location-04','@AP-location-02','@UE-test','Unknow']
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
            series: [
                {
                    name:'',
                    type:'pie',
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:[
                        {value:335, name:'@AP-location-04'},
                        {value:310, name:'@AP-location-02'},
                        {value:234, name:'@UE-test'},
                        {value:135, name:'Unknow'}
                    ]
                }
            ]
        };
        var oTheme = {};
        $("#wirelessClient").echart("init",option);
    }

    /*终端信号分布*/
    function drawClientChannel(){

        var option = {
            legend: {
                x:"left",
                data: ['Apple','ASUSTek', 'AzureWare','Intel','Tenda']
            },
            polar: [
                {
                    indicator: [
                        {text: 'Ruijie_IT19_iphone', max:10},
                        {text: '@ap_location_02', max: 10},
                        {text: '@ap_location_04', max: 10},
                        {text: '@ap_location_07', max: 10},
                        {text: 'Ruijie_IT19_1X', max: 10},
                        {text: 'UE_test', max: 10}
                    ],
                    radius: 120
                }
            ],
            series: [{
                name: '',
                type: 'radar',
                data : [
                    {
                        value : [5, 5, 5, 5, 5, 5],
                        name : 'Apple'
                    },
                    {
                        value : [8, 5, 7, 9, 6, 10],
                        name : 'ASUSTek'
                    },
                    {
                        value:[1,2,3,4,5,6],
                        name:"AzureWare"
                    }
                ]
            }]
        };
        $("#clientChannel").echart("init",option);
    }

    function initData(){
        drwaBand();
        drawClientType();
        drawSystem();
        drwaClientRelated();
        drawClientTime();
        drawClientFlow();
        //drawWirelessClient();
        //drawClientChannel();
    }


    function _init(){
        initGrid();
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