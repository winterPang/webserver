(function ($)
{
    var MODULE_NAME = "ad.index";

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("ad_rc", sRcName);
    }

    function drawAdShow(){
        option = {
            height:"90%",
            title : {
                show:false
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                x:"center",
                y:"bottom",
                data: ['h','l','m','n','i']
            },
            series : [
                {
                    name: '广告展示',
                    type: 'pie',
                    radius : '65%',
                    center: ['50%', '40%'],
                    data:[
                        {value:335, name:'h'},
                        {value:310, name:'l'},
                        {value:234, name:'m'},
                        {value:135, name:'n'},
                        {value:1548, name:'i'}
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
            color: ['#53B9E7','#31ADB4','#69C4C5','#FFBB33','#FF8800']
        };
        $("#adShow").echart ("init", option,oTheme);
    }

    function drawAdShowCount(type){
        var data = [];
        if(type == 1){//today
            data.push({
                name:'h',
                type:'line',
                stack: '总量',
                data:[7, 12, 6, 3, 5, 5, 7,40,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            });
            data.push({
                name:'l',
                type:'line',
                stack: '总量',
                data:[14, 8, 6, 3, 0, 5, 7,22,90,130,108,40,78,140,135,84,98,55,32,50,42,42,30]
            });
        } else if(type == 2){//yesterday
            data.push({
                name:'h',
                type:'line',
                stack: '总量',
                data:[14, 8, 6, 3, 0, 5, 7,22,90,130,108,40,78,140,135,84,98,55,32,50,42,42,30]
            });
            data.push({
                name:'l',
                type:'line',
                stack: '总量',
                data:[7, 12, 6, 3, 5, 5, 7,40,7,60,120,0,10,50,80,130,130,60,60,80,80,50,30,20]
            });
        }
        option = {
            height:"300",
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                x:"right",
                y:"top",
                data:['h','l']
            },
            grid: {
                show:"false"
            },
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18'
                    ,'19','20','21','22','23']
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : data
        };
        var oTheme = {
            color: ['#48BEF4','#FCE1DC']
        };
        $("#adShowCount").echart ("init", option,oTheme);

    }

    function drawBasicList(){

        var opt = {
            height:"80",
            showHeader: true,
            multiSelect: false,
            colNames: getRcText ("BASIC_ITEM"),
            colModel: [
                {name: "title", datatype: "String",width:50},
                {name: "pv", datatype: "String",width:100},
                {name: "uv", datatype: "String",width:100},
                {name: "ipCount", datatype: "String",width:100},
                {name: "tiaochulv", datatype: "String",width:100},
                {name: "visitorTimeAver", datatype: "String",width:100},
                {name: "turnCount", datatype: "String",width:100}
            ]
        };
        $("#basic_slist").SList ("head", opt);
    }
    function drawDetailList(){

        var opt = {
            showHeader: true,
            multiSelect: false,
            colNames: getRcText ("DETAIL_ITEM"),
            colModel: [
                {name: "url", datatype: "String",width:300},
                {name: "pv", datatype: "String",width:80},
                {name: "uv", datatype: "String",width:80},
                {name: "ipCount", datatype: "String",width:50},
                {name: "inCount", datatype: "String",width:100},
                {name: "outCount", datatype: "String",width:100},
                {name: "stayTimeAver", datatype: "String",width:100}
            ]
        };
        $("#detail_slist").SList ("head", opt);
    }

    function draw(){
        drawBasicList();
        //drawAdShow();
        drawAdShowCount(1);
        drawDetailList(1);
    }

    function initData(){
        draw();

        var basicListTempData = [];
        basicListTempData.push(
            {
                title:getRcText("TODAY"),
                pv:"881",
                uv:"648",
                ipCount:"606",
                tiaochulv:"89.17%",
                visitorTimeAver:"00:03:31",
                turnCount:"--"
            },
            {
                title:getRcText("YESTERDAY"),
                pv:"573",
                uv:"428",
                ipCount:"401",
                tiaochulv:"91.88%",
                visitorTimeAver:"00:02:49",
                turnCount:"--"
            }
        );
        $("#basic_slist").SList ("refresh", basicListTempData);
        

        var detailListTempData = [];
        detailListTempData.push(
            {
                url:"http://editor.baidu.com",
                pv:"122",
                uv:"105",
                ipCount:"102",
                inCount:"116",
                outCount:"82",
                stayTimeAver:"00:02:07"
            },
            {
                url:"http://editor.baidu.com/function",
                pv:"5",
                uv:"5",
                ipCount:"5",
                inCount:"0",
                outCount:"1",
                stayTimeAver:"00:00:34"
            },
            {
                url:"http://editor.baidu.com/?qq-pf-to=pcqq.c2c",
                pv:"3",
                uv:"3",
                ipCount:"3",
                inCount:"3",
                outCount:"2",
                stayTimeAver:"00:00:06"
            },
            {
                url:"http://editor.baidu.com/union",
                pv:"2",
                uv:"2",
                ipCount:"2",
                inCount:"0",
                outCount:"0",
                stayTimeAver:"00:00:01"
            },
            {
                url:"http://editor.baidu.com/search",
                pv:"2",
                uv:"2",
                ipCount:"2",
                inCount:"0",
                outCount:"0",
                stayTimeAver:"00:00:04"
            },
            {
                url:"http://editor.baidu.com/account",
                pv:"2",
                uv:"2",
                ipCount:"2",
                inCount:"0",
                outCount:"0",
                stayTimeAver:"00:00:02"
            },
            {
                url:getRcText("OTHER"),
                pv:"0",
                uv:"0",
                ipCount:"0",
                inCount:"0",
                outCount:"0",
                stayTimeAver:"--"
            },
            {
                url:getRcText("TOTAL"),
                pv:"138",
                uv:"121",
                ipCount:"118",
                inCount:"120",
                outCount:"86",
                stayTimeAver:"00:01:54"
            }
        );
        $("#detail_slist").SList ("refresh", detailListTempData);
    }

    function initForm(){
        $("#todayAd").on("click",function(){
            $(this).css("color","#343e4e");
            $("#yesterdayAd").css("color","#80878c");
            drawAdShowCount(1);
        });
        $("#yesterdayAd").on("click",function(){
            $(this).css("color","#343e4e");
            $("#todayAd").css("color","#80878c");
            drawAdShowCount(2);
        });
        $("#todayPage").on("click",function(){
            $(this).css("color","#343e4e");
            $("#yesterdayPage").css("color","#80878c");
            //TODO change  the  data
        });
        $("#yesterdayPage").on("click",function(){
            $(this).css("color","#343e4e");
            $("#todayPage").css("color","#80878c");
            //TODO change  the  data
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
        "widgets": ["Echart","Minput","SList"],
        "utils": ["Base", "Device"]

    });

}) (jQuery);