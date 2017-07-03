(function($){

    var MODULE_BASE = "maintain";
    var MODULE_NAME = MODULE_BASE + ".analyse_scene";

    /*获取场景分布(最多、最少)排行数据*/
    function getSceneRank(){

        $.ajax({
            url:MyConfig.path + "/maintenance/scenarioRank",
            type:'get',
            dataType:'json',
            success:function(data){

                /*draw最多、最少排行柱状图*/
                drawScene_most(data);
                drawScene_least(data);
            },
            error:function(){

            }
        })
    }

    /*场景rank最多柱状图*/
    function drawScene_most(data){

        /*解析数据*/
        var topFive = data.Topfive || [];
        var xlist = new Array();
        var ylist = new Array();
        for(var i = 0 ; i < topFive.length; i++){
            xlist.push(topFive[i].scenarioName);
            ylist.push(topFive[i].apCount);
        }


        var option = {
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    name:'场景',
                    type : 'category',
                    data:xlist,
                    axisLabel:{
                        show:true,
                        textStyle:{color:"#f5f5f5"}
                    }
                }
            ],
            yAxis : [
                {
                    name:'ap数量',
                    type : 'value',
                    axisLabel:{
                        show:true,
                        textStyle:{color:"#f5f5f5"}
                    }
                }
            ],
            series : [
                {
                    name:'',
                    type:'bar',
                    data:ylist,
                    itemStyle:{
                        normal:{
                            color:function(params) {
                                var colorList = [
                                    '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0',
                                    'green','#26C0C0','#FCCE10','#E87C25','#27727B',
                                    '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD'
                                ];
                                return colorList[params.dataIndex]
                            }
                        }
                    }
                }
            ]
        };
        $("#most").echart("init",option);
    }

    /*rank最少柱状图*/
    function drawScene_least(data){

        /*解析数据*/
        var botFive = data.Botfive;
        var xlist = new Array();
        var ylist = new Array();
        for(var i = 0 ; i < botFive.length ; i++){
            xlist.push(botFive[i].scenarioName);
            ylist.push(botFive[i].apCount);
        }

        var option = {
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    name:'场景',
                    type : 'category',
                    data:xlist,
                    axisLabel:{
                        show:true,
                        textStyle:{color:"#f5f5f5"}
                    }
                }
            ],
            yAxis : [
                {
                    name:'ap数量',
                    type : 'value',
                    axisLabel:{
                        show:true,
                        textStyle:{color:"#f5f5f5"}
                    }
                }
            ],
            series : [
                {
                    name:'',
                    type:'bar',
                    data:ylist,
                    itemStyle:{
                        normal:{
                            color:function(params) {
                                var colorList = [
                                    'green','#26C0C0','#FCCE10','#E87C25','#27727B',
                                    '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                                    '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
                                ];
                                return colorList[params.dataIndex]
                            }
                        }
                    }
                }
            ]
        };
        $("#least").echart("init",option);
    }


    /*获取场景分布详细信息数据*/
    function getSceneInfo(){

        $.ajax({
            url:MyConfig.path + "/maintenance/scenario",
            type:'get',
            dataType:'json',
            success:function(data){

                /*draw详细信息列表*/
                drawSceneList(data);
            },
            error:function(){

            }
        })
    }

    /*场景详细信息*/
    function drawSceneList(data){

        data = data || [];
        var optData = [];
        for(var i = 0 ; i < data.length ; i++){
            optData[i] = {};
            optData[i].location = data[i].scenarioName;
            optData[i].date = data[i].date.split(',')[0];
            optData[i].acCount = data[i].acCount.toString();
            optData[i].apCount = data[i].apCount.toString();
            optData[i].aponlineCount = data[i].aponline.toString();
            optData[i].apofflineCount = data[i].apoffline.toString();
        }
            $("#sceneInfo").SList('refresh',optData);
    }

    function initData(){

        /*获取场景分布(最多、最少)排行数据*/
        getSceneRank();
        /*获取场景分布详细信息数据*/
        getSceneInfo();
    }

    function initGrid(){

        var opt_head = {
            colNames:getRcText('sceneInfoList'),
            multiSelect:false,
            showHeader:true,
            colModel:[
                {name:"location",dataType:"String"},
                {name:"date",dataType:"String"},
                {name:"acCount",dataType:"Integer"},
                {name:"apCount",dataType:"Integer"},
                {name:"aponlineCount",dataType:"Integer"},
                {name:"apofflineCount",dataType:"Integer"}
            ]
        };
            $("#sceneInfo").SList("head",opt_head);
    }

    function _init(){

        initData();
        initGrid();
    }

    function getRcText(sRcName){

        return Utils.Base.getRcString("rc_scene",sRcName);
    }

    function _destroy(){

    }

    Utils.Pages.regModule(MODULE_NAME,{
        "init": _init,
        "destroy": _destroy,
        "widgets": ["Mlist","SList","Echart"],
        "utils":["Base"]
    })
})(jQuery);