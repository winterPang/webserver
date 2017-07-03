(function($){

    var MODULE_BASE = "maintain";
    var MODULE_NAME = MODULE_BASE + ".analyse_config";


    /*配置使用情况饼状图*/
    function drawUseConfig(){

        var option = {
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                x : 'left',
                y : 10,
                data:["默认配置","非默认配置"]
            },
            calculable : false,
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
                    data:[
                        {name:"默认配置",value:30},
                        {name:"非默认配置",value:50}
                    ]
                }
            ]
        };
        var oTheme = {};
        $("#useConfig").echart("init",option);
    }


    /*优化配置情况使用对比*/
    function drawOptimizationConfig(){

        var option = {
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                x : 'left',
                y : 10,
                data:["优化配置","非优化配置"]
            },
            calculable : false,
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
                    data:[
                        {name:"优化配置",value:30},
                        {name:"非优化配置",value:50}
                    ]
                }
            ]
        };
        var oTheme = {};
        $("#optimizationCongig").echart("init",option);
    }

    /*配置使用（最多）柱状图*/
    function drawConfigMost(){

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
                    type : 'category',
                    data:['场景A','场景B','场景C','场景D','场景E','场景F','场景G','场景H','场景I']
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    itemStyle:{
                        axisLabel:{

                        }
                    }
                }
            ],
            series : [
                {
                    name:'',
                    type:'bar',
                    data:[320, 332, 301, 334, 390, 330, 320,200,400]
                }
            ]
        };
        $("#configMost").echart("init",option);
    }

    /*配置使用(最少)饼状图*/
    function drawConfigLeast(){

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
                    type : 'category',
                    boundaryGap:50,
                    data:['场景A','场景B','场景C','场景D','场景E','场景F','场景G','场景H','场景I']
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    itemStyle:{
                        axisLabel:{

                        }
                    }
                }
            ],
            series : [
                {
                    name:'',
                    type:'bar',
                    data:[320, 332, 301, 334, 390, 330, 320,200,400]
                }
            ]
        };
        var oTheme = {
            color:['#26C0C0','#FCCE10','#E87C25','#27727B','#FE8463','#9BCA63','#FAD860','#F3A43B',]
        }
        $("#configLeast").echart("init",option,oTheme);
    }

    function initData(){
        drawUseConfig();
        drawOptimizationConfig();
        drawConfigMost();
        drawConfigLeast();
    }

    function _init(){

        initData();
    }

    function _destroy(){

    }

    Utils.Pages.regModule(MODULE_NAME,{
        "init":_init,
        "destroy":_destroy,
        "widgets": ["Echart"],
        "utils":["Request","Base","Msg"]
    })

})(jQuery);