(function ($)
{
    var MODULE_NAME = "a_dataanalysis.traceanalysis";

    function getRcText(sRcName) {
        return Utils.Base.getRcString("visitors_infor_rc", sRcName);
    }

    function getOption(name, nodesList, linksList){
        var option = 
        {
            title : {
                text: '访客: '+name,
                x:'right',
                y:'bottom'
            },
            tooltip : {
                trigger: 'item',
                formatter: '{a} : {b}'
            },
            toolbox: {
                show : true,
                feature : {
                    restore : {show: true},
                    magicType: {show: true, type: ['force', 'chord']},
                    saveAsImage : {show: true}
                }
            },
            legend: {
                x: 'left',
                data:['楼盘','样板间']
            },
            series : 
            [
                {
                    type:'force',
                    name : "访问轨迹",
                    ribbonType: false,
                    categories : 
                    [
                        {
                            name: '人物'
                        },
                        {
                            name: '楼盘',
                            //symbol: 'diamond'
                        },
                        {
                            name:'样板间'
                        }
                    ],
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                textStyle: {
                                    color: '#333'
                                }
                            },
                            nodeStyle : {
                                brushType : 'both',
                                borderColor : 'rgba(255,215,0,0.4)',
                                borderWidth : 1
                            }
                        },
                        emphasis: {
                            label: {
                                show: false
                                // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
                            },
                            nodeStyle : {
                                //r: 30
                            },
                            linkStyle : {}
                        }
                    },
                    minRadius : 15,
                    maxRadius : 25,
                    gravity: 1.1,
                    scaling: 1.2,
                    draggable: false,
                    linkSymbol: 'arrow',
                    steps: 10,
                    coolDown: 0.9,
                    //preventOverlap: true,
                    nodes : nodesList,
                    links : linksList
                }
            ]
        };

        return option;
    }

    function showLink(row, cell, value, columnDef, dataContext, type)
    {
        value = value || "";

        if("text" == type)
        {
            return value;
        }
        return '<a class="list-link" cell="'+cell+'"'+' name="'+dataContext.name+'">'+value+'</a>';        
    }

    function showfootPrint(name)
    {
        var nodesList = [];
        var linkList = [];

        switch(name)
        {
            case "张永昌":
            {
                nodesList = [ {category:0, name: '张永昌', value : 12,},
                        {category:1, name: '楼盘1',value : 10},
                        {category:1, name: '楼盘2',value : 10},
                        {category:1, name: '楼盘3',value : 10},
                        {category:1, name: '楼盘4',value : 10},
                        {category:2, name: '样板间1-1',value : 8},
                        {category:2, name: '样板间1-2',value : 8},
                        {category:2, name: '样板间2-1',value : 8},
                        {category:2, name: '样板间3-1',value : 8},
                        {category:2, name: '样板间4-1',value : 8}];

                linkList = [
                        {source : '张永昌', target : '楼盘1', weight : 1, itemStyle: {
                            normal: {
                                width: 1.5,
                                color: 'red'
                            }
                        }},
                        {source : '张永昌', target : '楼盘2', weight : 1, itemStyle: {
                            
                            normal: { width: 1.5, color: 'red' }
                        }},
                        {source : '张永昌', target : '楼盘3', weight : 1, itemStyle: {
                            
                            normal: { width: 1.5, color: 'red' }
                        }},
                        {source : '张永昌', target : '楼盘4', weight : 1, itemStyle: {
                            
                            normal: { width: 1.5,color: 'red' }
                        }},
                        {source : '楼盘1', target : '样板间1-1', weight : 1},
                        {source : '楼盘1', target : '样板间1-2', weight : 1},
                        {source : '楼盘2', target : '样板间2-1', weight : 1},
                        {source : '楼盘3', target : '样板间3-1', weight : 1},
                        {source : '楼盘4', target : '样板间4-1', weight : 1},
                    ];
                break;
            }
            case "周晓东":
            {
                nodesList = [ {category:0, name: '周晓东', value : 12,},
                        {category:1, name: '楼盘1',value : 10},
                        {category:1, name: '楼盘2',value : 10},
                        {category:2, name: '样板间1-1',value : 8},
                        {category:2, name: '样板间1-2',value : 8},
                        {category:2, name: '样板间2-1',value : 8},
                        {category:2, name: '样板间2-2',value : 8}];

                linkList = [
                        {source : '周晓东', target : '楼盘1', weight : 1, itemStyle: {
                            normal: {
                                width: 1.5,
                                color: 'red'
                            }
                        }},
                        {source : '周晓东', target : '楼盘2', weight : 1, itemStyle: {
                            
                            normal: { width: 1.5, color: 'red' }
                        }},
                        {source : '楼盘1', target : '样板间1-1', weight : 1},
                        {source : '楼盘1', target : '样板间1-2', weight : 1},
                        {source : '楼盘2', target : '样板间2-1', weight : 1},
                        {source : '楼盘2', target : '样板间2-2', weight : 1},
                        ];
                break;
            }
            case "郭雁宏":
            {
                nodesList = [ {category:0, name: '郭雁宏', value : 12,},
                        {category:1, name: '楼盘1',value : 10},
                        {category:2, name: '样板间1-1',value : 8},
                        {category:2, name: '样板间1-2',value : 8}];

                linkList = [
                        {source : '郭雁宏', target : '楼盘1', weight : 1, itemStyle: {
                            normal: {
                                width: 1.5,
                                color: 'red'
                            }
                        }},
                        {source : '楼盘1', target : '样板间1-1', weight : 1},
                        {source : '楼盘1', target : '样板间1-2', weight : 1}
                        ];
                break;
            }
            case "王小丫":
            {
                nodesList = [ {category:0, name: '王小丫', value : 12,},
                        {category:1, name: '楼盘1',value : 10},
                        {category:1, name: '楼盘2',value : 10},
                        {category:1, name: '楼盘3',value : 10},
                        {category:1, name: '楼盘4',value : 10},
                        {category:1, name: '楼盘5',value : 10},
                        {category:1, name: '楼盘6',value : 10},
                        {category:2, name: '样板间1-1',value : 8},
                        {category:2, name: '样板间2-1',value : 8},
                        {category:2, name: '样板间3-1',value : 8},
                        {category:2, name: '样板间4-1',value : 8},
                        {category:2, name: '样板间5-1',value : 8},
                        {category:2, name: '样板间6-1',value : 8}];

                linkList = [
                        {source : '王小丫', target : '楼盘1', weight : 1, itemStyle: {
                            normal: {
                                width: 1.5,
                                color: 'red'
                            }
                        }},
                        {source : '王小丫', target : '楼盘2', weight : 1, itemStyle: {
                            normal: {
                                width: 1.5,
                                color: 'red'
                            }
                        }},
                        {source : '王小丫', target : '楼盘3', weight : 1, itemStyle: {
                            normal: {
                                width: 1.5,
                                color: 'red'
                            }
                        }},
                        {source : '王小丫', target : '楼盘4', weight : 1, itemStyle: {
                            normal: {
                                width: 1.5,
                                color: 'red'
                            }
                        }},
                        {source : '王小丫', target : '楼盘5', weight : 1, itemStyle: {
                            normal: {
                                width: 1.5,
                                color: 'red'
                            }
                        }},
                        {source : '王小丫', target : '楼盘6', weight : 1, itemStyle: {
                            normal: {
                                width: 1.5,
                                color: 'red'
                            }
                        }},
                        {source : '楼盘1', target : '样板间1-1', weight : 1},
                        {source : '楼盘2', target : '样板间2-1', weight : 1},
                        {source : '楼盘3', target : '样板间3-1', weight : 1},
                        {source : '楼盘4', target : '样板间4-1', weight : 1},
                        {source : '楼盘5', target : '样板间5-1', weight : 1},
                        {source : '楼盘6', target : '样板间6-1', weight : 1}
                        ];
                break;
            }
            default:
            {
                nodesList = [ {category:0, name: name, value : 12,},
                        {category:1, name: '楼盘1',value : 10},
                        {category:1, name: '楼盘2',value : 10},
                        {category:1, name: '楼盘3',value : 10},
                        {category:1, name: '楼盘4',value : 10},
                        {category:2, name: '样板间1-1',value : 8},
                        {category:2, name: '样板间2-1',value : 8},
                        {category:2, name: '样板间3-1',value : 8},
                        {category:2, name: '样板间4-1',value : 8}];

                linkList = [
                        {source : name, target : '楼盘1', weight : 1, itemStyle: {
                            normal: {
                                width: 1.5,
                                color: 'red'
                            }
                        }},
                        {source : name, target : '楼盘2', weight : 1, itemStyle: {
                            normal: {
                                width: 1.5,
                                color: 'red'
                            }
                        }},
                        {source : name, target : '楼盘3', weight : 1, itemStyle: {
                            normal: {
                                width: 1.5,
                                color: 'red'
                            }
                        }},
                        {source : name, target : '楼盘4', weight : 1, itemStyle: {
                            normal: {
                                width: 1.5,
                                color: 'red'
                            }
                        }},
                        {source : '楼盘1', target : '样板间1-1', weight : 1},
                        {source : '楼盘2', target : '样板间2-1', weight : 1},
                        {source : '楼盘3', target : '样板间3-1', weight : 1},
                        {source : '楼盘4', target : '样板间4-1', weight : 1}
                        ];
                break;
            }   
        }

        var option = getOption(name, nodesList, linkList);

        $("#visitor_footprint").echart("init", option); 
    }

    function showfootprint()
    {
        var name = $(this).attr("name");

        showfootPrint(name);

        Utils.Base.openDlg(null, {}, {scope:$("#tableDlg"),className:"modal-super dashboard"});    
    }

    function changgeLoupan()
    {
        var g_slect = $("#loupanselect").val(); 
        var visitorList = [];

        switch(g_slect)
        {
            case "楼盘1":
            {
                visitorList = [
                    {name:"张永昌", mac:"1111-2222-3330",onlineTimes:9580,lasttime:"2016/5/11 14:42:00"},
                    {name:"周晓东", mac:"1111-2222-3322",onlineTimes:3800,lasttime:"2016/5/12 12:36:00"},
                    {name:"郭雁宏", mac:"1111-2222-3339",onlineTimes:9400,lasttime:"2016/5/15 15:51:00"},
                    {name:"王小丫", mac:"1111-2222-3344",onlineTimes:4790,lasttime:"2016/5/16 16:28:00"},
                    {name:"王小二", mac:"1111-2222-3333",onlineTimes:5800,lasttime:"2016/5/12 13:12:00"},
                    {name:"王小三", mac:"1111-2222-3334",onlineTimes:2800,lasttime:"2016/5/13 14:13:00"},
                    {name:"王小四", mac:"1111-2222-3335",onlineTimes:300,lasttime:"2016/5/15 13:15:00"},
                    {name:"王小五", mac:"1111-2222-3336",onlineTimes:5800,lasttime:"2016/5/12 13:17:00"},
                    {name:"王小六", mac:"1111-2222-3337",onlineTimes:6800,lasttime:"2016/5/13 14:28:00"},
                    {name:"王小七", mac:"1111-2222-3338",onlineTimes:7800,lasttime:"2016/5/14 15:34:00"} ];     
                break;
            }
            case "楼盘2":
            {
                visitorList = [
                    {name:"张永昌", mac:"1111-2222-3330",onlineTimes:9580,lasttime:"2016/5/11 14:42:00"},
                    {name:"周晓东", mac:"1111-2222-3322",onlineTimes:3800,lasttime:"2016/5/12 12:36:00"},
                    {name:"王小丫", mac:"1111-2222-3344",onlineTimes:4790,lasttime:"2016/5/16 16:28:00"},
                    {name:"王小二", mac:"1111-2222-3333",onlineTimes:5800,lasttime:"2016/5/12 13:12:00"},
                    {name:"王小三", mac:"1111-2222-3334",onlineTimes:2800,lasttime:"2016/5/13 14:13:00"},
                    {name:"王小四", mac:"1111-2222-3335",onlineTimes:300,lasttime:"2016/5/15 13:15:00"},
                    {name:"王小五", mac:"1111-2222-3336",onlineTimes:5800,lasttime:"2016/5/12 13:17:00"},
                    {name:"王小六", mac:"1111-2222-3337",onlineTimes:6800,lasttime:"2016/5/13 14:28:00"},
                    {name:"王小七", mac:"1111-2222-3338",onlineTimes:7800,lasttime:"2016/5/14 15:34:00"} ];  
                break;
            }
            case "楼盘3":
            {
                visitorList = [
                    {name:"张永昌", mac:"1111-2222-3330",onlineTimes:9580,lasttime:"2016/5/11 14:42:00"},
                    {name:"王小丫", mac:"1111-2222-3344",onlineTimes:4790,lasttime:"2016/5/16 16:28:00"},
                    {name:"王小二", mac:"1111-2222-3333",onlineTimes:5800,lasttime:"2016/5/12 13:12:00"},
                    {name:"王小三", mac:"1111-2222-3334",onlineTimes:2800,lasttime:"2016/5/13 14:13:00"},
                    {name:"王小四", mac:"1111-2222-3335",onlineTimes:300,lasttime:"2016/5/15 13:15:00"},
                    {name:"王小五", mac:"1111-2222-3336",onlineTimes:5800,lasttime:"2016/5/12 13:17:00"},
                    {name:"王小六", mac:"1111-2222-3337",onlineTimes:6800,lasttime:"2016/5/13 14:28:00"},
                    {name:"王小七", mac:"1111-2222-3338",onlineTimes:7800,lasttime:"2016/5/14 15:34:00"} ]; 
                break;
            }
            case "楼盘4":
            {
                visitorList = [
                    {name:"张永昌", mac:"1111-2222-3330",onlineTimes:9580,lasttime:"2016/5/11 14:42:00"},
                    {name:"王小丫", mac:"1111-2222-3344",onlineTimes:4790,lasttime:"2016/5/16 16:28:00"},
                    {name:"王小二", mac:"1111-2222-3333",onlineTimes:5800,lasttime:"2016/5/12 13:12:00"},
                    {name:"王小三", mac:"1111-2222-3334",onlineTimes:2800,lasttime:"2016/5/13 14:13:00"},
                    {name:"王小四", mac:"1111-2222-3335",onlineTimes:300,lasttime:"2016/5/15 13:15:00"},
                    {name:"王小五", mac:"1111-2222-3336",onlineTimes:5800,lasttime:"2016/5/12 13:17:00"},
                    {name:"王小六", mac:"1111-2222-3337",onlineTimes:6800,lasttime:"2016/5/13 14:28:00"},
                    {name:"王小七", mac:"1111-2222-3338",onlineTimes:7800,lasttime:"2016/5/14 15:34:00"} ]; 
                break;
            }
            case "楼盘5":
            {
                visitorList = [
                    {name:"王小丫", mac:"1111-2222-3344",onlineTimes:4790,lasttime:"2016/5/16 16:28:00"} ]; 
                break;
            }
            case "楼盘6":
            {
                visitorList = [
                    {name:"王小丫", mac:"1111-2222-3344",onlineTimes:4790,lasttime:"2016/5/16 16:28:00"}]; 
                break;
            }
            default:
            {
                visitorList = [
                    {name:"张永昌", mac:"1111-2222-3330",onlineTimes:9580,lasttime:"2016/5/11 14:42:00"},
                    {name:"周晓东", mac:"1111-2222-3322",onlineTimes:3800,lasttime:"2016/5/12 12:36:00"},
                    {name:"郭雁宏", mac:"1111-2222-3339",onlineTimes:9400,lasttime:"2016/5/15 15:51:00"},
                    {name:"王小丫", mac:"1111-2222-3344",onlineTimes:4790,lasttime:"2016/5/16 16:28:00"},
                    {name:"王小二", mac:"1111-2222-3333",onlineTimes:5800,lasttime:"2016/5/12 13:12:00"},
                    {name:"王小三", mac:"1111-2222-3334",onlineTimes:2800,lasttime:"2016/5/13 14:13:00"},
                    {name:"王小四", mac:"1111-2222-3335",onlineTimes:300,lasttime:"2016/5/15 13:15:00"},
                    {name:"王小五", mac:"1111-2222-3336",onlineTimes:5800,lasttime:"2016/5/12 13:17:00"},
                    {name:"王小六", mac:"1111-2222-3337",onlineTimes:6800,lasttime:"2016/5/13 14:28:00"},
                    {name:"王小七", mac:"1111-2222-3338",onlineTimes:7800,lasttime:"2016/5/14 15:34:00"} ];
                break;
            }
        }
        showVisitorsList(visitorList);  
    }

    function initGrid() {
        (function drawVisitorsList() {
            var opt = {
                colNames: getRcText("VISITOR_LABELS"),
                showHeader: true,
                multiSelect: false,
                pageSize:10,
                colModel: [
                    { name: 'name', datatype: "String", formatter:showLink},
                    { name: 'mac', datatype: "String" },
                    { name: 'onlineTimes', datatype: "String" },
                    { name: 'lasttime', datatype: "String" }
                ]
            };
            $("#visitor_list").SList("head", opt);
            $("#visitor_list").on('click','a.list-link',showfootprint);
            $("#return").on('click',function(){ history.back();});
            $("#tableForm").form("init", "edit", {"title":getRcText("VISITOR_FOOT"),"btn_apply": false,"btn_cancel":false});

            $("#loupanselect").on("change",changgeLoupan);

        })();
    }

    function showVisitorsList(datalist)
    {
        var visitorList = [];
        var Timelable = getRcText("TIME").split(",");

        for(var i= 0; i< datalist.length;i++)
        {
            var time = datalist[i].onlineTimes;
            var day = parseInt(time / 86400);
            var temp = time % 86400;
            var hour = parseInt(temp / 3600);
            temp = time % 3600;
            var mini = parseInt(temp / 60);
            var sec = time % 60;
            var sDatatime = day + Timelable[0] + hour + Timelable[1] + mini + Timelable[2];

            var info = {
                name: datalist[i].name,
                mac: datalist[i].mac,
                onlineTimes: sDatatime,
                lasttime:datalist[i].lasttime
            };  

            visitorList.push(info);      
        }

        $("#visitor_list").SList("refresh", visitorList);
    }

    function initData()
    {
        var visitorList = [
            {name:"张永昌", mac:"1111-2222-3330",onlineTimes:9580,lasttime:"2016/5/11 14:42:00"},
            {name:"周晓东", mac:"1111-2222-3322",onlineTimes:3800,lasttime:"2016/5/12 12:36:00"},
            {name:"郭雁宏", mac:"1111-2222-3339",onlineTimes:9400,lasttime:"2016/5/15 15:51:00"},
            {name:"王小丫", mac:"1111-2222-3344",onlineTimes:4790,lasttime:"2016/5/16 16:28:00"},
            {name:"王小二", mac:"1111-2222-3333",onlineTimes:5800,lasttime:"2016/5/12 13:12:00"},
            {name:"王小三", mac:"1111-2222-3334",onlineTimes:2800,lasttime:"2016/5/13 14:13:00"},
            {name:"王小四", mac:"1111-2222-3335",onlineTimes:300,lasttime:"2016/5/15 13:15:00"},
            {name:"王小五", mac:"1111-2222-3336",onlineTimes:5800,lasttime:"2016/5/12 13:17:00"},
            {name:"王小六", mac:"1111-2222-3337",onlineTimes:6800,lasttime:"2016/5/13 14:28:00"},
            {name:"王小七", mac:"1111-2222-3338",onlineTimes:7800,lasttime:"2016/5/14 15:34:00"} 
        ];

        showVisitorsList(visitorList);

        var aIntList = ["楼盘1","楼盘2","楼盘3","楼盘4","楼盘5","楼盘6"];
        $("#loupanselect").singleSelect("InitData",aIntList);
    }

    function _init(oPara)
    {
        initGrid();  
        initData();
    }

    function _destroy()
    {

    }

    function _resize()
    {

    }
    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["Echart","Form","SList","SingleSelect"],
        "utils": ["Base"]
    });
}) (jQuery);