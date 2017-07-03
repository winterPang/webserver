(function($){

    var MODULE_BASE = "maintain";
    var MODULE_NAME = MODULE_BASE + ".analyse_character";


    /* 获取特性排行 */
    function getCharacterInfo(option, successdeal){
        if(option == undefined)
        {
            option = 1;
        }
        $.ajax({
            url:MyConfig.path + '/maintenance/serviceinfo',
            type:'post',
            dataType:'json',
            data:{
                dayCount:option
            },
            success:function(data){

                /*解析特性信息*/
                successdeal(data);
            },
            error:function(){

            }
        })
    }

    function analyseServiceData(data){
        var Identity = [];
        var Count = [];
        var MostIdentity = [];
        var MostCount = [];
        var LeastIdentity = [];
        var LeastCount = [];

        if(data.length != 18)
        {
            console.warn('get service results error!');
        }
        else
        {
            for(var i=0; i<18; i++)
            {
                Identity.push(data[i].identity);
                Count.push(data[i].count);
            }

            for(var i=0; i<5; i++)
            {
                MostIdentity.push(Identity[i]);
                MostCount.push(Count[i]);
                LeastIdentity.push(Identity[17-i]);
                LeastCount.push(Count[17-i]);
            }
        }

        drawCharacterMost(MostIdentity, MostCount);
        drawCharacterLeast(LeastIdentity, LeastCount);
        drawCharacterStat(Identity, Count);
    }


    /*特性使用（最多）柱状图*/
    function drawCharacterMost(identity, count){

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
                    data: identity,
                    axisLabel:{
                        show:true,
                        textStyle:{color:'#e6e6e6',fontSize:'8px'}
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisLabel:{
                        show:true,
                        textStyle:{color:'#e6e6e6',fontSize:'8px'}
                    }
                }
            ],
            series : [
                {
                    name:'',
                    type:'bar',
                    data: count
                }
            ]
        };
        $("#characterMost").echart("init",option);
    }

    /*特性使用(最少)饼状图*/
    function drawCharacterLeast(identity, count){

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
                    data: identity,
                    axisLabel:{
                        show:true,
                        textStyle:{color:'#e6e6e6',fontSize:'8px'}
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisLabel:{
                        show:true,
                        textStyle:{color:'#e6e6e6',fontSize:'8px'}
                    }
                }
            ],
            series : [
                {
                    name:'',
                    type:'bar',
                    data: count
                }
            ]
        };
        var oTheme = {
            color:['#26C0C0','#FCCE10','#E87C25','#27727B','#FE8463','#9BCA63','#FAD860','#F3A43B',]
        }
        $("#characterLeast").echart("init",option,oTheme);
    }

    /*特性使用统计柱状图*/
    function drawCharacterStat(identity, count){

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
                    data: identity,
					axisLabel:{
						show:true,
						textStyle:{color:'#e6e6e6',fontSize:'8px'}
					}
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisLabel:{
                        show:true,
                        textStyle:{color:'#e6e6e6',fontSize:'8px'}
                    }
                }
            ],
            series : [
                {
                    name:'',
                    type:'bar',
                    data: count
                }
            ]
        };
        $("#characterStat").echart("init",option);
    }

    function initData(){
        getCharacterInfo(1, analyseServiceData);
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