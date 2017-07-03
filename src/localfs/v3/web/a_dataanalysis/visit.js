
(function ($)
{
    var MODULE_NAME = "a_dataanalysis.visit";

    var g_date = "0";
    var g_changshuo = "";
    var up = "../soon/image/up.png",
        down = "../soon/image/down.png";


    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("visit_rc", sRcName);
    }

    function initZhanbiOpt()
    {
        var option = {
            height: 250,
            title : {
                text: '',
                subtext: '',
                x:'center'
            },
            legend: {
                x : 'center',
                y : 'bottom',
                padding:0,
                data:[]
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            series : [
                {
                    name: '',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '50%'],
                    data:[],
                    itemStyle: {
                        normal: {
                            borderColor:"#FFF",
                            borderWidth:1,
                            labelLine:{
                                show:false
                            },
                            label:
                            {
                                show:false
                            }
                        }
                    }
                }
            ]
        };
        return option;
    }


    //到访次数比率
    function disRatio(data)
    {
        var opt = initZhanbiOpt(data);
        var legend = ['2次以下','2次到5次','5次以上'];
        opt.title.text = '到访次数比率';
        opt.legend.data = legend;
        opt.series[0].data = data;
        var oTheme = {
            color: ['#4ec1b2', '#ff9c9e', '#fbceb1', '#b3b7dd', '#F7C762', '#ABD6F5', '#63B4EF', '#3DA0EB', '#1683D3', '#136FB3']
        };
        $("#frequencyratio").echart("init", opt, oTheme);
    }

    //历史到访次数比率
    function disRatio_history(data)
    {
        var opt = initZhanbiOpt(data);
        var legend = ['5次以下','5次到10次','10次以上'];
        opt.title.text = '历史到访次数比率';
        opt.legend.data = legend;
        opt.series[0].data = data;
        var oTheme = {
            color: ['#4ec1b2', '#ff9c9e', '#fbceb1', '#b3b7dd', '#F7C762', '#ABD6F5', '#63B4EF', '#3DA0EB', '#1683D3', '#136FB3']
        };
        $("#frequencyratio_history").echart("init", opt, oTheme);
    }

    function disZhanbi()
    {
        var data_daofang = [
                {value: 147, name: '2次以下'},
                {value: 369, name: '2次到5次'},
                {value: 258, name: '5次以上'}
            ],
            data_hisdaofang = [
                {value: 369, name: '5次以下'},
                {value: 258, name: '5次到10次'},
                {value: 147, name: '10次以上'}
            ];

        disRatio(data_daofang);
        disRatio_history(data_hisdaofang);
    }

    function disSlistHead()
    {
        var opt_head =
        {
            colNames: ['场所名称', '首次到访顾客', '多次到访顾客', '平均到访次数', '历史平均到访次数'],
            showHeader: true,
            multiSelect: false,
            pageSize: 5,
            colModel: [
                {name: "cs", datatype: "String"},
                {name: "first", datatype: "String"},
                {name: "more", datatype: "String"},
                {name: "visit", datatype: "String"},
                {name: "historyvisit", datatype: "String"}
            ]
        };
        $("#xiangxi_list").SList("head", opt_head);
    }


    function disXiangxi()
    {
        var slist_data = [];

        for(var i = 0; i < 5; i++){
            var j = i+1;
            slist_data[i] = {};
            slist_data[i].cs = '场所' + j;
            slist_data[i].first = 110 + j * 10;
            slist_data[i].more = 30 + j * 10;
            slist_data[i].visit = 30 + j * 3;
            slist_data[i].historyvisit = 20 + j * 4;
        }

        $("#xiangxi_list").SList("refresh", slist_data);
    }
    function initData()
    {
        // 默认标签页显示
        disZhanbi();

        disSlistHead();
        disXiangxi();

    }

    function changeChangShuo()
    {

        g_changshuo = $("#changshuoselect").val();

        if ('场所1' == g_changshuo)
        {
            switch (g_date)
            {
                case "0":
                    //标签页 占比分析 数据
                    var data_daofang = [
                            {value:335, name:'2次以下'},
                            {value:310, name:'2次到5次'},
                            {value:234, name:'5次以上'}
                        ],
                        data_hisdaofang = [
                            {value:152, name:'5次以下'},
                            {value:80, name:'5次到10次'},
                            {value:250, name:'10次以上'}
                        ];

                    var slist_data = [];
                    for(var i = 0; i < 10;i++){
                        var j = i+1;
                        slist_data[i] = {};
                        slist_data[i].cs = '场地' + j;
                        slist_data[i].first = 110 + j * 10;
                        slist_data[i].more = 30 + j * 10;
                        slist_data[i].visit = 30 + j * 3;
                        slist_data[i].historyvisit = 20 + j * 4;
                    }
                    break;
                case "1":
                    //标签页 占比分析 数据
                    var data_daofang = [
                            {value:666, name:'2次以下'},
                            {value:555, name:'2次到5次'},
                            {value:444, name:'5次以上'}
                        ],
                        data_hisdaofang = [
                            {value:333, name:'5次以下'},
                            {value:444, name:'5次到10次'},
                            {value:660, name:'10次以上'}
                        ];

                    var slist_data = [];
                    for(var i = 0; i < 10;i++){
                        slist_data[i] = {};
                        slist_data[i].cs = '场地' + (i + 1);
                        slist_data[i].first = 111 + i * 10;
                        slist_data[i].more = 21 + i * 10;
                        slist_data[i].visit = 31 + i * 3;
                        slist_data[i].historyvisit = 21 + i * 4;
                    }
                    break;
                case "2":
                case "3":
                case "4":
                    //标签页 占比分析 数据
                    var data_daofang = [
                            {value:111, name:'2次以下'},
                            {value:1111, name:'2次到5次'},
                            {value:111, name:'5次以上'}
                        ],
                        data_hisdaofang = [
                            {value:111, name:'5次以下'},
                            {value:1111, name:'5次到10次'},
                            {value:111, name:'10次以上'}
                        ];

                    var slist_data = [];
                    for(var i = 0; i < 10;i++){
                        slist_data[i] = {};
                        slist_data[i].cs = '场地' + (i + 1);
                        slist_data[i].first = 111 + i * 10;
                        slist_data[i].more = 31 + i * 10;
                        slist_data[i].visit = 31 + i * 3;
                        slist_data[i].historyvisit = 21 + i * 4;
                    }
                    break;
            }

            //标签页 详细信息 数据

            $("#visit").html(110);
            $("#history_visit").html(160);
            $("#visit_change").html(5);
            $("#history_change").html(8);

        }
        if ('场所2' == g_changshuo)
        {
            switch (g_date) {
                case "0":
                    //标签页 占比分析 数据
                    var data_daofang = [
                            {value: 335, name: '2次以下'},
                            {value: 310, name: '2次到5次'},
                            {value: 234, name: '5次以上'}
                        ],
                        data_hisdaofang = [
                            {value: 110, name: '5次以下'},
                            {value: 510, name: '5次到10次'},
                            {value: 210, name: '10次以上'}
                        ];

                    var slist_data = [];
                    for (var i = 0; i < 7; i++) {
                        slist_data[i] = {};
                        slist_data[i].cs = '场地' + (i+1);
                        slist_data[i].first = 110 + i * 10;
                        slist_data[i].more = 30 + i * 10;
                        slist_data[i].visit = 30 + i * 3;
                        slist_data[i].historyvisit = 20 + i * 4;
                    }
                    break;
                case "1":
                    //标签页 占比分析 数据
                    var data_daofang = [
                            {value: 222, name: '2次以下'},
                            {value: 555, name: '2次到5次'},
                            {value: 222, name: '5次以上'}
                        ],
                        data_hisdaofang = [
                            {value: 222, name: '5次以下'},
                            {value: 222, name: '5次到10次'},
                            {value: 555, name: '10次以上'}
                        ];

                    var slist_data = [];
                    for (var i = 0; i < 7; i++) {
                        slist_data[i] = {};
                        slist_data[i].cs = '场地' + (i+1);
                        slist_data[i].first = 112 + i * 10;
                        slist_data[i].more = 32 + i * 10;
                        slist_data[i].visit = 32 + i * 3;
                        slist_data[i].historyvisit = 22 + i * 4;
                    }
                    break;
                case "2":
                case "3":
                case "4":
                    //标签页 占比分析 数据
                    var data_daofang = [
                            {value: 333, name: '2次以下'},
                            {value: 666, name: '2次到5次'},
                            {value: 333, name: '5次以上'}
                        ],
                        data_hisdaofang = [
                            {value: 666, name: '5次以下'},
                            {value: 333, name: '5次到10次'},
                            {value: 666, name: '10次以上'}
                        ];

                    var slist_data = [];
                    for (var i = 0; i < 7; i++) {
                        slist_data[i] = {};
                        slist_data[i].cs = '场地' + (i+1);
                        slist_data[i].first = 113 + i * 10;
                        slist_data[i].more = 33 + i * 10;
                        slist_data[i].visit = 36 + i * 3;
                        slist_data[i].historyvisit = 33 + i * 4;
                    }
                    break;
            }

            $("#visit").html(120);
            $("#history_visit").html(180);
            $("#visit_change").html(7);
            $("#history_change").html(4);

        }
        if ('场所3' == g_changshuo)
        {
            switch (g_date) {
                case "0":
                    //标签页 占比分析 数据
                    var data_daofang = [
                            {value: 335, name: '2次以下'},
                            {value: 310, name: '2次到5次'},
                            {value: 234, name: '5次以上'}
                        ],
                        data_hisdaofang = [
                            {value: 110, name: '5次以下'},
                            {value: 510, name: '5次到10次'},
                            {value: 210, name: '10次以上'}
                        ];

                    var slist_data = [];
                    for (var i = 0; i < 6; i++) {
                        slist_data[i] = {};
                        slist_data[i].cs = '场地' + (i+1);
                        slist_data[i].first = 110 + i * 10;
                        slist_data[i].more = 30 + i * 10;
                        slist_data[i].visit = 30 + i * 3;
                        slist_data[i].historyvisit = 20 + i * 4;
                    }
                    break;
                case "1":
                    //标签页 占比分析 数据
                    var data_daofang = [
                            {value: 222, name: '2次以下'},
                            {value: 555, name: '2次到5次'},
                            {value: 222, name: '5次以上'}
                        ],
                        data_hisdaofang = [
                            {value: 222, name: '5次以下'},
                            {value: 222, name: '5次到10次'},
                            {value: 555, name: '10次以上'}
                        ];

                    var slist_data = [];
                    for (var i = 0; i < 6; i++) {
                        slist_data[i] = {};
                        slist_data[i].cs = '场地' + (i+1);
                        slist_data[i].first = 112 + i * 10;
                        slist_data[i].more = 32 + i * 10;
                        slist_data[i].visit = 32 + i * 3;
                        slist_data[i].historyvisit = 22 + i * 4;
                    }
                    break;
                case "2":
                case "3":
                case "4":
                    //标签页 占比分析 数据
                    var data_daofang = [
                            {value: 333, name: '2次以下'},
                            {value: 666, name: '2次到5次'},
                            {value: 333, name: '5次以上'}
                        ],
                        data_hisdaofang = [
                            {value: 666, name: '5次以下'},
                            {value: 333, name: '5次到10次'},
                            {value: 666, name: '10次以上'}
                        ];

                    var slist_data = [];
                    for (var i = 0; i < 6; i++) {
                        slist_data[i] = {};
                        slist_data[i].cs = '场地' + (i+1);
                        slist_data[i].first = 113 + i * 10;
                        slist_data[i].more = 33 + i * 10;
                        slist_data[i].visit = 36 + i * 3;
                        slist_data[i].historyvisit = 33 + i * 4;
                    }
                    break;
            }

            $("#visit").html(220);
            $("#history_visit").html(380);
            $("#visit_change").html(17);
            $("#history_change").html(3);

        }
        if ('场所4' == g_changshuo)
        {
            switch (g_date) {
                case "0":
                    //标签页 占比分析 数据
                    var data_daofang = [
                            {value: 335, name: '2次以下'},
                            {value: 310, name: '2次到5次'},
                            {value: 234, name: '5次以上'}
                        ],
                        data_hisdaofang = [
                            {value: 110, name: '5次以下'},
                            {value: 510, name: '5次到10次'},
                            {value: 210, name: '10次以上'}
                        ];

                    var slist_data = [];
                    for (var i = 0; i < 5; i++) {
                        slist_data[i] = {};
                        slist_data[i].cs = '场地' + (i+1);
                        slist_data[i].first = 110 + i * 10;
                        slist_data[i].more = 30 + i * 10;
                        slist_data[i].visit = 30 + i * 3;
                        slist_data[i].historyvisit = 20 + i * 4;
                    }
                    break;
                case "1":
                    //标签页 占比分析 数据
                    var data_daofang = [
                            {value: 222, name: '2次以下'},
                            {value: 555, name: '2次到5次'},
                            {value: 222, name: '5次以上'}
                        ],
                        data_hisdaofang = [
                            {value: 222, name: '5次以下'},
                            {value: 222, name: '5次到10次'},
                            {value: 555, name: '10次以上'}
                        ];

                    var slist_data = [];
                    for (var i = 0; i < 5; i++) {
                        slist_data[i] = {};
                        slist_data[i].cs = '场地' + (i+1);
                        slist_data[i].first = 112 + i * 10;
                        slist_data[i].more = 32 + i * 10;
                        slist_data[i].visit = 32 + i * 3;
                        slist_data[i].historyvisit = 22 + i * 4;
                    }
                    break;
                case "2":
                case "3":
                case "4":
                    //标签页 占比分析 数据
                    var data_daofang = [
                            {value: 333, name: '2次以下'},
                            {value: 666, name: '2次到5次'},
                            {value: 333, name: '5次以上'}
                        ],
                        data_hisdaofang = [
                            {value: 666, name: '5次以下'},
                            {value: 333, name: '5次到10次'},
                            {value: 666, name: '10次以上'}
                        ];

                    var slist_data = [];
                    for (var i = 0; i < 5; i++) {
                        slist_data[i] = {};
                        slist_data[i].cs = '场地' + (i+1);
                        slist_data[i].first = 113 + i * 10;
                        slist_data[i].more = 33 + i * 10;
                        slist_data[i].visit = 36 + i * 3;
                        slist_data[i].historyvisit = 33 + i * 4;
                    }
                    break;
            }

            $("#visit").html(190);
            $("#history_visit").html(380);
            $("#visit_change").html(27);
            $("#history_change").html(14);

        }
        if ('场所5' == g_changshuo)
        {
            switch (g_date) {
                case "0":
                    //标签页 占比分析 数据
                    var data_daofang = [
                            {value: 335, name: '2次以下'},
                            {value: 310, name: '2次到5次'},
                            {value: 234, name: '5次以上'}
                        ],
                        data_hisdaofang = [
                            {value: 110, name: '5次以下'},
                            {value: 510, name: '5次到10次'},
                            {value: 210, name: '10次以上'}
                        ];

                    var slist_data = [];
                    for (var i = 0; i < 4; i++) {
                        slist_data[i] = {};
                        slist_data[i].cs = '场地' + (i+1);
                        slist_data[i].first = 110 + i * 10;
                        slist_data[i].more = 30 + i * 10;
                        slist_data[i].visit = 30 + i * 3;
                        slist_data[i].historyvisit = 20 + i * 4;
                    }
                    break;
                case "1":
                    //标签页 占比分析 数据
                    var data_daofang = [
                            {value: 222, name: '2次以下'},
                            {value: 555, name: '2次到5次'},
                            {value: 222, name: '5次以上'}
                        ],
                        data_hisdaofang = [
                            {value: 222, name: '5次以下'},
                            {value: 222, name: '5次到10次'},
                            {value: 555, name: '10次以上'}
                        ];

                    var slist_data = [];
                    for (var i = 0; i < 4; i++) {
                        slist_data[i] = {};
                        slist_data[i].cs = '场地' + (i+1);
                        slist_data[i].first = 112 + i * 10;
                        slist_data[i].more = 32 + i * 10;
                        slist_data[i].visit = 32 + i * 3;
                        slist_data[i].historyvisit = 22 + i * 4;
                    }
                    break;
                case "2":
                case "3":
                case "4":
                    //标签页 占比分析 数据
                    var data_daofang = [
                            {value: 333, name: '2次以下'},
                            {value: 666, name: '2次到5次'},
                            {value: 333, name: '5次以上'}
                        ],
                        data_hisdaofang = [
                            {value: 666, name: '5次以下'},
                            {value: 333, name: '5次到10次'},
                            {value: 666, name: '10次以上'}
                        ];

                    var slist_data = [];
                    for (var i = 0; i < 4; i++) {
                        slist_data[i] = {};
                        slist_data[i].cs = '场地' + (i+1);
                        slist_data[i].first = 113 + i * 10;
                        slist_data[i].more = 33 + i * 10;
                        slist_data[i].visit = 36 + i * 3;
                        slist_data[i].historyvisit = 33 + i * 4;
                    }
                    break;
            }

            $("#visit").html(220);
            $("#history_visit").html(230);
            $("#visit_change").html(17);
            $("#history_change").html(19);

        }
        if ('所有场所' == g_changshuo)
        {
            switch (g_date) {
                case "0":
                    //标签页 占比分析 数据
                    var data_daofang = [
                            {value: 147, name: '2次以下'},
                            {value: 369, name: '2次到5次'},
                            {value: 258, name: '5次以上'}
                        ],
                        data_hisdaofang = [
                            {value: 369, name: '5次以下'},
                            {value: 258, name: '5次到10次'},
                            {value: 147, name: '10次以上'}
                        ];

                    var slist_data = [];
                    for (var i = 0; i < 5; i++) {
                        var j = i+1;
                        slist_data[i] = {};
                        slist_data[i].cs = '场所' + j;
                        slist_data[i].first = 110 + j * 10;
                        slist_data[i].more = 30 + j * 10;
                        slist_data[i].visit = 30 + j * 3;
                        slist_data[i].historyvisit = 20 + j * 4;
                    }
                    break;
                case "1":
                    //标签页 占比分析 数据
                    var data_daofang = [
                            {value: 456, name: '2次以下'},
                            {value: 123, name: '2次到5次'},
                            {value: 123, name: '5次以上'}
                        ],
                        data_hisdaofang = [
                            {value: 456, name: '5次以下'},
                            {value: 123, name: '5次到10次'},
                            {value: 456, name: '10次以上'}
                        ];

                    var slist_data = [];
                    for (var i = 0; i < 5; i++) {
                        slist_data[i] = {};
                        slist_data[i].cs = '场所' + (i+1);
                        slist_data[i].first = 116 + i * 10;
                        slist_data[i].more = 36 + i * 10;
                        slist_data[i].visit = 26 + i * 3;
                        slist_data[i].historyvisit = 26 + i * 4;
                    }
                    break;
                case "2":
                case "3":
                case "4":
                    //标签页 占比分析 数据
                    var data_daofang = [
                            {value: 159, name: '2次以下'},
                            {value: 267, name: '2次到5次'},
                            {value: 159, name: '5次以上'}
                        ],
                        data_hisdaofang = [
                            {value: 267, name: '5次以下'},
                            {value: 159, name: '5次到10次'},
                            {value: 267, name: '10次以上'}
                        ];//data_daofang data_hisdaofang 2次以下 2次到5次 5次以上 5次以下 5次到10次 10次以上 first more visit historyvisit

                    var slist_data = [];
                    for (var i = 0; i < 5; i++) {
                        slist_data[i] = {};
                        slist_data[i].cs = '场所' + (i + 1);
                        slist_data[i].first = 112 + i * 10;
                        slist_data[i].more = 32 + i * 10;
                        slist_data[i].visit = 32 + i * 3;
                        slist_data[i].historyvisit = 22 + i * 4;
                    }
                    break;
            }

            $("#visit").html(120);
            $("#history_visit").html(250);
            $("#visit_change").html(3);
            $("#history_change").html(6);
        }

        $("#visit_times").attr('src', down);
        $("#history_times").attr('src', up);

        disRatio(data_daofang);
        disRatio_history(data_hisdaofang);
        $("#xiangxi_list").SList("refresh", slist_data);
    }

    function dateChange_today()
    {
        switch (g_changshuo)
        {
            case "所有场所":
                //标签页 占比分析 数据
                var data_daofang = [
                        {value: 147, name: '2次以下'},
                        {value: 369, name: '2次到5次'},
                        {value: 258, name: '5次以上'}
                    ],
                    data_hisdaofang = [
                        {value: 369, name: '5次以下'},
                        {value: 258, name: '5次到10次'},
                        {value: 147, name: '10次以上'}
                    ];

                var slist_data = [];
                for (var i = 0; i < 5; i++) {
                    var j = i+1;
                    slist_data[i] = {};
                    slist_data[i].cs = '场所' + j;
                    slist_data[i].first = 110 + j * 10;
                    slist_data[i].more = 30 + j * 10;
                    slist_data[i].visit = 30 + j * 3;
                    slist_data[i].historyvisit = 20 + j * 4;
                }
                break;
            case "场所1":
                //标签页 占比分析 数据
                var data_daofang = [
                        {value:335, name:'2次以下'},
                        {value:310, name:'2次到5次'},
                        {value:234, name:'5次以上'}
                    ],
                    data_hisdaofang = [
                        {value:152, name:'5次以下'},
                        {value:80, name:'5次到10次'},
                        {value:250, name:'10次以上'}
                    ];

                var slist_data = [];
                for(var i = 0; i < 10;i++){
                    var j = i+1;
                    slist_data[i] = {};
                    slist_data[i].cs = '场地' + j;
                    slist_data[i].first = 110 + j * 10;
                    slist_data[i].more = 30 + j * 10;
                    slist_data[i].visit = 30 + j * 3;
                    slist_data[i].historyvisit = 20 + j * 4;
                }
                break;
            case "场所2":
                //标签页 占比分析 数据
                var data_daofang = [
                        {value: 335, name: '2次以下'},
                        {value: 310, name: '2次到5次'},
                        {value: 234, name: '5次以上'}
                    ],
                    data_hisdaofang = [
                        {value: 110, name: '5次以下'},
                        {value: 510, name: '5次到10次'},
                        {value: 210, name: '10次以上'}
                    ];

                var slist_data = [];
                for (var i = 0; i < 7; i++) {
                    slist_data[i] = {};
                    slist_data[i].cs = '场地' + (i+1);
                    slist_data[i].first = 110 + i * 10;
                    slist_data[i].more = 30 + i * 10;
                    slist_data[i].visit = 30 + i * 3;
                    slist_data[i].historyvisit = 20 + i * 4;
                }
                break;
            case "场所3":
                //标签页 占比分析 数据
                var data_daofang = [
                        {value: 335, name: '2次以下'},
                        {value: 310, name: '2次到5次'},
                        {value: 234, name: '5次以上'}
                    ],
                    data_hisdaofang = [
                        {value: 110, name: '5次以下'},
                        {value: 510, name: '5次到10次'},
                        {value: 210, name: '10次以上'}
                    ];

                var slist_data = [];
                for (var i = 0; i < 6; i++) {
                    slist_data[i] = {};
                    slist_data[i].cs = '场地' + (i+1);
                    slist_data[i].first = 110 + i * 10;
                    slist_data[i].more = 30 + i * 10;
                    slist_data[i].visit = 30 + i * 3;
                    slist_data[i].historyvisit = 20 + i * 4;
                }
                break;
            case "场所4":
                //标签页 占比分析 数据
                var data_daofang = [
                        {value: 335, name: '2次以下'},
                        {value: 310, name: '2次到5次'},
                        {value: 234, name: '5次以上'}
                    ],
                    data_hisdaofang = [
                        {value: 110, name: '5次以下'},
                        {value: 510, name: '5次到10次'},
                        {value: 210, name: '10次以上'}
                    ];

                var slist_data = [];
                for (var i = 0; i < 5; i++) {
                    slist_data[i] = {};
                    slist_data[i].cs = '场地' + (i+1);
                    slist_data[i].first = 110 + i * 10;
                    slist_data[i].more = 30 + i * 10;
                    slist_data[i].visit = 30 + i * 3;
                    slist_data[i].historyvisit = 20 + i * 4;
                }
                break;
            case "场所5":
                //标签页 占比分析 数据
                var data_daofang = [
                        {value: 335, name: '2次以下'},
                        {value: 310, name: '2次到5次'},
                        {value: 234, name: '5次以上'}
                    ],
                    data_hisdaofang = [
                        {value: 110, name: '5次以下'},
                        {value: 510, name: '5次到10次'},
                        {value: 210, name: '10次以上'}
                    ];

                var slist_data = [];
                for (var i = 0; i < 4; i++) {
                    slist_data[i] = {};
                    slist_data[i].cs = '场地' + (i+1);
                    slist_data[i].first = 110 + i * 10;
                    slist_data[i].more = 30 + i * 10;
                    slist_data[i].visit = 30 + i * 3;
                    slist_data[i].historyvisit = 20 + i * 4;
                }
                break;
        }

        $("#visit").html(120);
        $("#history_visit").html(250);
        $("#visit_change").html(3);
        $("#history_change").html(6);

        $("#visit_times").attr('src', down);
        $("#history_times").attr('src', up);

        disRatio(data_daofang);
        disRatio_history(data_hisdaofang);
        $("#xiangxi_list").SList("refresh", slist_data);

    }
    function dateChange_aweek()
    {
        $("#help_img_visit").attr("title","本周平均到访的人数");
        $("#help_img_history").attr("title","本周历史平均到访的人数");

        switch (g_changshuo)
        {
            case "所有场所":
                //标签页 占比分析 数据
                var data_daofang = [
                        {value: 456, name: '2次以下'},
                        {value: 123, name: '2次到5次'},
                        {value: 123, name: '5次以上'}
                    ],
                    data_hisdaofang = [
                        {value: 456, name: '5次以下'},
                        {value: 123, name: '5次到10次'},
                        {value: 456, name: '10次以上'}
                    ];

                var slist_data = [];
                for (var i = 0; i < 5; i++) {
                    slist_data[i] = {};
                    slist_data[i].cs = '场所' + (i + 1);
                    slist_data[i].first = 116 + i * 10;
                    slist_data[i].more = 36 + i * 10;
                    slist_data[i].visit = 26 + i * 3;
                    slist_data[i].historyvisit = 26 + i * 4;
                }
                break;
            case "场所1":
                //标签页 占比分析 数据
                var data_daofang = [
                        {value:666, name:'2次以下'},
                        {value:555, name:'2次到5次'},
                        {value:444, name:'5次以上'}
                    ],
                    data_hisdaofang = [
                        {value:333, name:'5次以下'},
                        {value:444, name:'5次到10次'},
                        {value:660, name:'10次以上'}
                    ];

                var slist_data = [];
                for(var i = 0; i < 10;i++){
                    slist_data[i] = {};
                    slist_data[i].cs = '场地' + (i + 1);
                    slist_data[i].first = 111 + i * 10;
                    slist_data[i].more = 21 + i * 10;
                    slist_data[i].visit = 31 + i * 3;
                    slist_data[i].historyvisit = 21 + i * 4;
                }
                break;
            case "场所2":
                //标签页 占比分析 数据
                var data_daofang = [
                        {value: 222, name: '2次以下'},
                        {value: 555, name: '2次到5次'},
                        {value: 222, name: '5次以上'}
                    ],
                    data_hisdaofang = [
                        {value: 222, name: '5次以下'},
                        {value: 222, name: '5次到10次'},
                        {value: 555, name: '10次以上'}
                    ];

                var slist_data = [];
                for (var i = 0; i < 7; i++) {
                    slist_data[i] = {};
                    slist_data[i].cs = '场地' + (i+1);
                    slist_data[i].first = 112 + i * 10;
                    slist_data[i].more = 32 + i * 10;
                    slist_data[i].visit = 32 + i * 3;
                    slist_data[i].historyvisit = 22 + i * 4;
                }
                break;
            case "场所3":
                //标签页 占比分析 数据
                var data_daofang = [
                        {value:666, name:'2次以下'},
                        {value:555, name:'2次到5次'},
                        {value:444, name:'5次以上'}
                    ],
                    data_hisdaofang = [
                        {value:333, name:'5次以下'},
                        {value:444, name:'5次到10次'},
                        {value:660, name:'10次以上'}
                    ];

                var slist_data = [];
                for(var i = 0; i < 6;i++){
                    slist_data[i] = {};
                    slist_data[i].cs = '场地' + (i + 1);
                    slist_data[i].first = 111 + i * 10;
                    slist_data[i].more = 21 + i * 10;
                    slist_data[i].visit = 31 + i * 3;
                    slist_data[i].historyvisit = 21 + i * 4;
                }
                break;
            case "场所4":
                //标签页 占比分析 数据
                var data_daofang = [
                        {value: 222, name: '2次以下'},
                        {value: 555, name: '2次到5次'},
                        {value: 222, name: '5次以上'}
                    ],
                    data_hisdaofang = [
                        {value: 222, name: '5次以下'},
                        {value: 222, name: '5次到10次'},
                        {value: 555, name: '10次以上'}
                    ];

                var slist_data = [];
                for (var i = 0; i < 5; i++) {
                    slist_data[i] = {};
                    slist_data[i].cs = '场地' + (i+1);
                    slist_data[i].first = 112 + i * 10;
                    slist_data[i].more = 32 + i * 10;
                    slist_data[i].visit = 32 + i * 3;
                    slist_data[i].historyvisit = 22 + i * 4;
                }
                break;
            case "场所5":
                //标签页 占比分析 数据
                var data_daofang = [
                        {value: 222, name: '2次以下'},
                        {value: 555, name: '2次到5次'},
                        {value: 222, name: '5次以上'}
                    ],
                    data_hisdaofang = [
                        {value: 222, name: '5次以下'},
                        {value: 222, name: '5次到10次'},
                        {value: 555, name: '10次以上'}
                    ];

                var slist_data = [];
                for (var i = 0; i < 4; i++) {
                    slist_data[i] = {};
                    slist_data[i].cs = '场地' + (i+1);
                    slist_data[i].first = 112 + i * 10;
                    slist_data[i].more = 32 + i * 10;
                    slist_data[i].visit = 32 + i * 3;
                    slist_data[i].historyvisit = 22 + i * 4;
                }
                break;
        }
        $("#visit").html(120);
        $("#history_visit").html(250);
        $("#visit_change").html(3);
        $("#history_change").html(6);

        $("#visit_times").attr('src', down);
        $("#history_times").attr('src', up);

        disRatio(data_daofang);
        disRatio_history(data_hisdaofang);
        $("#xiangxi_list").SList("refresh", slist_data);
    }
    function dateChange_amonth()
    {
        $("#help_img_visit").attr("title","本月平均到访的人数");
        $("#help_img_history").attr("title","本月历史平均到访的人数");
        switch (g_changshuo)
        {
            case "所有场所":
                //标签页 占比分析 数据
                var data_daofang = [
                        {value: 159, name: '2次以下'},
                        {value: 267, name: '2次到5次'},
                        {value: 159, name: '5次以上'}
                    ],
                    data_hisdaofang = [
                        {value: 267, name: '5次以下'},
                        {value: 159, name: '5次到10次'},
                        {value: 267, name: '10次以上'}
                    ];

                var slist_data = [];
                for (var i = 0; i < 5; i++) {
                    slist_data[i] = {};
                    slist_data[i].cs = '场所' + (i + 1);
                    slist_data[i].first = 112 + i * 10;
                    slist_data[i].more = 32 + i * 10;
                    slist_data[i].visit = 32 + i * 3;
                    slist_data[i].historyvisit = 22 + i * 4;
                }
                break;
            case "场所1":
                //标签页 占比分析 数据
                var data_daofang = [
                        {value:111, name:'2次以下'},
                        {value:1111, name:'2次到5次'},
                        {value:111, name:'5次以上'}
                    ],
                    data_hisdaofang = [
                        {value:111, name:'5次以下'},
                        {value:1111, name:'5次到10次'},
                        {value:111, name:'10次以上'}
                    ];

                var slist_data = [];
                for(var i = 0; i < 10;i++){
                    slist_data[i] = {};
                    slist_data[i].cs = '场地' + (i + 1);
                    slist_data[i].first = 111 + i * 10;
                    slist_data[i].more = 31 + i * 10;
                    slist_data[i].visit = 31 + i * 3;
                    slist_data[i].historyvisit = 21 + i * 4;
                }
                break;
            case "场所2":
                //标签页 占比分析 数据
                var data_daofang = [
                        {value: 333, name: '2次以下'},
                        {value: 666, name: '2次到5次'},
                        {value: 333, name: '5次以上'}
                    ],
                    data_hisdaofang = [
                        {value: 666, name: '5次以下'},
                        {value: 333, name: '5次到10次'},
                        {value: 666, name: '10次以上'}
                    ];

                var slist_data = [];
                for (var i = 0; i < 7; i++) {
                    slist_data[i] = {};
                    slist_data[i].cs = '场地' + (i+1);
                    slist_data[i].first = 113 + i * 10;
                    slist_data[i].more = 33 + i * 10;
                    slist_data[i].visit = 36 + i * 3;
                    slist_data[i].historyvisit = 33 + i * 4;
                }
                break;
            case "场所3":
                //标签页 占比分析 数据
                var data_daofang = [
                        {value:111, name:'2次以下'},
                        {value:1111, name:'2次到5次'},
                        {value:111, name:'5次以上'}
                    ],
                    data_hisdaofang = [
                        {value:111, name:'5次以下'},
                        {value:1111, name:'5次到10次'},
                        {value:111, name:'10次以上'}
                    ];

                var slist_data = [];
                for(var i = 0; i < 6;i++){
                    slist_data[i] = {};
                    slist_data[i].cs = '场地' + (i + 1);
                    slist_data[i].first = 111 + i * 10;
                    slist_data[i].more = 31 + i * 10;
                    slist_data[i].visit = 31 + i * 3;
                    slist_data[i].historyvisit = 21 + i * 4;
                }
                break;
            case "场所4":
                //标签页 占比分析 数据
                var data_daofang = [
                        {value: 333, name: '2次以下'},
                        {value: 666, name: '2次到5次'},
                        {value: 333, name: '5次以上'}
                    ],
                    data_hisdaofang = [
                        {value: 666, name: '5次以下'},
                        {value: 333, name: '5次到10次'},
                        {value: 666, name: '10次以上'}
                    ];

                var slist_data = [];
                for (var i = 0; i < 5; i++) {
                    slist_data[i] = {};
                    slist_data[i].cs = '场地' + (i+1);
                    slist_data[i].first = 113 + i * 10;
                    slist_data[i].more = 33 + i * 10;
                    slist_data[i].visit = 36 + i * 3;
                    slist_data[i].historyvisit = 33 + i * 4;
                }
                break;
            case "场所5":
                //标签页 占比分析 数据
                var data_daofang = [
                        {value: 333, name: '2次以下'},
                        {value: 666, name: '2次到5次'},
                        {value: 333, name: '5次以上'}
                    ],
                    data_hisdaofang = [
                        {value: 666, name: '5次以下'},
                        {value: 333, name: '5次到10次'},
                        {value: 666, name: '10次以上'}
                    ];

                var slist_data = [];
                for (var i = 0; i < 4; i++) {
                    slist_data[i] = {};
                    slist_data[i].cs = '场地' + (i+1);
                    slist_data[i].first = 113 + i * 10;
                    slist_data[i].more = 33 + i * 10;
                    slist_data[i].visit = 36 + i * 3;
                    slist_data[i].historyvisit = 33 + i * 4;
                }
                break;
        }
        $("#visit").html(120);
        $("#history_visit").html(250);
        $("#visit_change").html(3);
        $("#history_change").html(6);

        $("#visit_times").attr('src', down);
        $("#history_times").attr('src', up);

        disRatio(data_daofang);
        disRatio_history(data_hisdaofang);
        $("#xiangxi_list").SList("refresh", slist_data);
    }
    function dateChange_ayear() {

        $("#dangqian").html('本年平均到访次数');
        $("#dangqian_history").html('本年历史平均到访次数');
        $("#help_img_visit").attr("title","本年平均到访的人数");
        $("#help_img_history").attr("title","本年历史平均到访的人数");


        switch (g_changshuo)
        {
            case "所有场所":
                //标签页 占比分析 数据
                var data_daofang = [
                        {value: 159, name: '2次以下'},
                        {value: 267, name: '2次到5次'},
                        {value: 159, name: '5次以上'}
                    ],
                    data_hisdaofang = [
                        {value: 267, name: '5次以下'},
                        {value: 159, name: '5次到10次'},
                        {value: 267, name: '10次以上'}
                    ];

                var slist_data = [];
                for (var i = 0; i < 5; i++) {
                    slist_data[i] = {};
                    slist_data[i].cs = '场所' + (i + 1);
                    slist_data[i].first = 112 + i * 10;
                    slist_data[i].more = 32 + i * 10;
                    slist_data[i].visit = 32 + i * 3;
                    slist_data[i].historyvisit = 22 + i * 4;
                }
                break;
            case "场所1":
                //标签页 占比分析 数据
                var data_daofang = [
                        {value:111, name:'2次以下'},
                        {value:1111, name:'2次到5次'},
                        {value:111, name:'5次以上'}
                    ],
                    data_hisdaofang = [
                        {value:111, name:'5次以下'},
                        {value:1111, name:'5次到10次'},
                        {value:111, name:'10次以上'}
                    ];

                var slist_data = [];
                for(var i = 0; i < 10;i++){
                    slist_data[i] = {};
                    slist_data[i].cs = '场地' + (i + 1);
                    slist_data[i].first = 111 + i * 10;
                    slist_data[i].more = 31 + i * 10;
                    slist_data[i].visit = 31 + i * 3;
                    slist_data[i].historyvisit = 21 + i * 4;
                }
                break;
            case "场所2":
                //标签页 占比分析 数据
                var data_daofang = [
                        {value: 333, name: '2次以下'},
                        {value: 666, name: '2次到5次'},
                        {value: 333, name: '5次以上'}
                    ],
                    data_hisdaofang = [
                        {value: 666, name: '5次以下'},
                        {value: 333, name: '5次到10次'},
                        {value: 666, name: '10次以上'}
                    ];

                var slist_data = [];
                for (var i = 0; i < 7; i++) {
                    slist_data[i] = {};
                    slist_data[i].cs = '场地' + (i+1);
                    slist_data[i].first = 113 + i * 10;
                    slist_data[i].more = 33 + i * 10;
                    slist_data[i].visit = 36 + i * 3;
                    slist_data[i].historyvisit = 33 + i * 4;
                }
                break;
            case "场所3":
                //标签页 占比分析 数据
                var data_daofang = [
                        {value:111, name:'2次以下'},
                        {value:1111, name:'2次到5次'},
                        {value:111, name:'5次以上'}
                    ],
                    data_hisdaofang = [
                        {value:111, name:'5次以下'},
                        {value:1111, name:'5次到10次'},
                        {value:111, name:'10次以上'}
                    ];

                var slist_data = [];
                for(var i = 0; i < 6;i++){
                    slist_data[i] = {};
                    slist_data[i].cs = '场地' + (i + 1);
                    slist_data[i].first = 111 + i * 10;
                    slist_data[i].more = 31 + i * 10;
                    slist_data[i].visit = 31 + i * 3;
                    slist_data[i].historyvisit = 21 + i * 4;
                }
                break;
            case "场所4":
                //标签页 占比分析 数据
                var data_daofang = [
                        {value: 333, name: '2次以下'},
                        {value: 666, name: '2次到5次'},
                        {value: 333, name: '5次以上'}
                    ],
                    data_hisdaofang = [
                        {value: 666, name: '5次以下'},
                        {value: 333, name: '5次到10次'},
                        {value: 666, name: '10次以上'}
                    ];

                var slist_data = [];
                for (var i = 0; i < 5; i++) {
                    slist_data[i] = {};
                    slist_data[i].cs = '场地' + (i+1);
                    slist_data[i].first = 113 + i * 10;
                    slist_data[i].more = 33 + i * 10;
                    slist_data[i].visit = 36 + i * 3;
                    slist_data[i].historyvisit = 33 + i * 4;
                }
                break;
            case "场所5":
                //标签页 占比分析 数据
                var data_daofang = [
                        {value: 333, name: '2次以下'},
                        {value: 666, name: '2次到5次'},
                        {value: 333, name: '5次以上'}
                    ],
                    data_hisdaofang = [
                        {value: 666, name: '5次以下'},
                        {value: 333, name: '5次到10次'},
                        {value: 666, name: '10次以上'}
                    ];

                var slist_data = [];
                for (var i = 0; i < 4; i++) {
                    slist_data[i] = {};
                    slist_data[i].cs = '场地' + (i+1);
                    slist_data[i].first = 113 + i * 10;
                    slist_data[i].more = 33 + i * 10;
                    slist_data[i].visit = 36 + i * 3;
                    slist_data[i].historyvisit = 33 + i * 4;
                }
                break;
        }
        $("#visit").html(120);
        $("#history_visit").html(250);
        $("#visit_change").html(3);
        $("#history_change").html(6);

        $("#visit_times").attr('src', down);
        $("#history_times").attr('src', up);

        disRatio(data_daofang);
        disRatio_history(data_hisdaofang);
        $("#xiangxi_list").SList("refresh", slist_data);
    }

    /*初始化点击事件*/
    function initEvent()
    {

        $("#changshuoselect").change(changeChangShuo);

    }


    //初始化选择按钮
    function initSelectBtn()
    {
        var btn_loupan = ["所有场所","场所1","场所2","场所3","场所4","场所5"];
        $("#changshuoselect").singleSelect("InitData", btn_loupan);
    }

    function setCalendarDate() {
        /*设置日历背景图的日期*/
        var todayDate = new Date().getDate();

        if (1 == todayDate) {
            $(".set-background").css("padding-left", "23px");
        }
        else if(9 >= todayDate && 1 != todayDate) {
            $(".set-background").css("padding-left", "22px");
        }
        else if (11 == todayDate) {
            $(".set-background").css("padding-left", "19px");
        }
        else if(10 < todayDate && 20 > todayDate && 11 != todayDate) {
            $(".set-background").css("padding-left", "18px");
        }
        else {
            $(".set-background").css("padding-left", "18px");
        }

        $("#calendar").html(todayDate);
    }

    function initForm()
    {

        $(".cancel-actions", "#tabContent").on("click",function(){
            $(this).parent().toggleClass("hide");
        });

        $("#daterange").on("inputchange.datarange", function(e){
            var orange = $(this).daterange("getRangeData");

            $("#cycle_date").text("（" + orange.startData + "-" + orange.endData + "）");

        });

        $(".box-footer #senior_filter").on("click", function(){
            $(".top-box").toggleClass("hide");
        });

        $("#WT1, #WT2, #WT3, #WT4, #WT5").click(function(){
            g_date = $(this).val();
            if(g_date != "4")
            {
                $("#cycle_date").text(getRcText("DATE_CYCLE").split(",")[g_date]);
                $("#daterange").addClass('hide');
            }
            else
            {

                $("#daterange").removeClass('hide');
            }
            switch (g_date)
            {
                case '0':
                    dateChange_today();
                    break;
                case '1':
                    dateChange_aweek();
                    break;
                case '2':
                    dateChange_amonth();
                    break;
                case '3':
                    dateChange_ayear();
                    break;
                case '4':
                    //dateChange_custom();
                    break;
            }

        });
    }

    function setCalendarDate() {
        /*设置日历背景图的日期*/
        var todayDate = new Date().getDate();

        if (1 == todayDate) {
            $(".set-background").css("padding-left", "23px");
        }
        else if(9 >= todayDate && 1 != todayDate) {
            $(".set-background").css("padding-left", "22px");
        }
        else if (11 == todayDate) {
            $(".set-background").css("padding-left", "19px");
        }
        else if(10 < todayDate && 20 > todayDate && 11 != todayDate) {
            $(".set-background").css("padding-left", "18px");
        }
        else {
            $(".set-background").css("padding-left", "18px");
        }

        $("#calendar").html(todayDate);


    }
    function _init()
    {
        setCalendarDate();
        initData();
        initEvent();
        initSelectBtn();
        initForm();

        g_changshuo = $("#changshuoselect").val();

        $("#dangqian").html('平均到访次数');
        $("#dangqian_history").html('历史平均到访次数');
        $("#help_img_visit").attr("title","指定场所指定日期内顾客平均到访次数");
        $("#help_img_history").attr("title","指定场所顾客历史平均到访次数");
        $("#visit").html(120);
        $("#history_visit").html(250);
        $("#visit_change").html(12);
        $("#history_change").html(25);

        $("#visit_times").attr('src', up);
        $("#history_times").attr('src', down);
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
        "widgets": ["Echart","SList", "SingleSelect", "DateRange", "DateTime"],
        "utils": ["Base"]
    });
}) (jQuery);