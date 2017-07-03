(function($){

    var MODULE_BASE = "maintain";
    var MODULE_NAME = MODULE_BASE + ".location_ap";


    /*获取AP信息（省市排行，最多/最少）数据*/
    function getApCountRank(){

        $.ajax({
            url:MyConfig.path + '/diagnosis_read/web/getApCountRank',
            type:'get',
            dataType:'json',
            success:function(data){

                /*解析AP排行数据信息*/
                analyseApRankData(data);
            },
            error:function(){

            }
        })
    }

    /*解析ap信息数据*/
    function analyseApRankData(data){

        var topFive = data.Topfive || [];
        var botFive = data.Botfive || [];
        var xTopApCount = new Array();
        var yTopApCount = new Array();
        var xBotApCount = new Array();
        var yBotApCount = new Array();

        for(var i = 0 ;i < topFive.length ; i++){
            xTopApCount.push(topFive[i]._id.Province);
            yTopApCount.push(topFive[i].totalAp)
        }

        botFive.sort(compare("totalAp"));

        function compare(prob){
           return function(obj1,obj2){
               var val1 = obj1[prob];
               var val2 = obj2[prob];
               if(val1 < val2){
                   return -1;
               }
               else if( val1 > val2){
                   return 1;
               }else{
                   return 0;
               }
           }
        }

        for(var j = 0 ; j < botFive.length ;j++){
            xBotApCount.push(botFive[j]._id.Province);
            yBotApCount.push(botFive[j].totalAp);
        }

        /*省市排行（最多）*/
        drawLocationMost(xTopApCount,yTopApCount);
        /*省市排行（最少）*/
        drawLocationLeast(xBotApCount,yBotApCount);
    }


    /*省市排行（最多）*/
    function drawLocationMost(xdata,ydata){

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
                    name:'省份',
                    type : 'category',
                    data:xdata,
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
                    data:ydata,
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


    /*省市排行（最少）*/
    function drawLocationLeast(xdata,ydata){

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
                    name:'省市',
                    type : 'category',
                    data:xdata,
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
                    data:ydata,
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

    /*获取AP排行详细信息*/
    function getApRankDetail(){

        $.ajax({
            url:MyConfig.path + '/diagnosis_read/web/getApCountInfo',
            type:'get',
            dataType:'json',
            success:function(data){

                /*解析ap的排行数据信息*/
                analyseApRankDetail(data);
            },
            error:function(){

            }
        })
    }

    /*解析AP排行详细信息,写入列表中*/
    function analyseApRankDetail(data){

        data = data || [];
        var apRankDetailData = [];
        for(var i = 0; i < data.length ; i++){
            apRankDetailData[i] = {};
            apRankDetailData[i].location = data[i]._id.Province;
            apRankDetailData[i].onlineapcount = data[i].onlineAp.toString();
            apRankDetailData[i].onfflineapcount = data[i].offineAp.toString();
            apRankDetailData[i].account = data[i].totalAc.toString();
            apRankDetailData[i].clientcount = data[i].client.toString();
            apRankDetailData[i].citydetail = "点击查看";
        }
        $("#rankDetail_mlist").mlist("refresh",apRankDetailData);
    }


    /*获取省市数量变化趋势*/
    function getApCountTendency(option){
        if(option == undefined)
        {
            option = 'day';
        }

        $.ajax({
            url:MyConfig.path + '/diagnosis_read/web/getApCountHis',
            type:'post',
            dataType:'json',
            data:{
                category:option
            },
            success:function(data){

                /*解析AP数量趋势信息*/
                analyseApTendencyData(option,data);
            },
            error:function(){

            }
        })
    }

    /*获取每日日期：*/
    function getdaydate(Number){
        var time = new Array();
        for(var i = Number; i >0 ; i--){
            var timestamp = new Date().setDate(new Date().getDate() -Number +1);
            var testMonth = new Date(timestamp).getMonth() + 1;
            var testDay = new Date(timestamp).getDate();
            if( testMonth < 10){
                testMonth = "0" + testMonth;
            }
            if(testDay < 10){
                testDay = "0" + testDay;
            }
            time.push(testMonth + '.' +testDay);
            Number --;
        }

        return time;
    }

    /*获取每周周六和当天时间：*/
    function getweekdate(Number){
        var time = new Array();
        var newDate = new Date();
        var newDay = newDate.getDay();
        console.log(newDay);
        for(var i = Number; i >0 ; i--){
            if(Number == 1)
            {
                newDay = 6;
            }
            //newDate - 7*(N-1) + (6-Day) 先获取本周六日期。
            var timestamp = new Date().setDate(new Date().getDate() - 7*Number + 13-newDay);
            var testMonth = new Date(timestamp).getMonth() + 1;
            var testDay = new Date(timestamp).getDate();
            if( testMonth < 10){
                testMonth = "0" + testMonth;
            }
            if(testDay < 10){
                testDay = "0" + testDay;
            }
            time.push(testMonth + '.' +testDay);
            Number --;
        }

        return time;
    }

    /*获取每月日期：*/
    function getmonthdate(Number){
        var time = new Array();
        var timestamp = new Date();
        var testMonth = timestamp.getMonth() + 2;
        for(var i = Number; i >0 ; i--){
            var everyMonth = testMonth - Number;
            if(everyMonth <= 0)
            {
                everyMonth += 12;
            }
            time.push(everyMonth + '月');
            Number --;
        }

        return time;
    }

    function analyseData(data){
        var result = [];
        for(var i=0;i<data.length;i++)
        {
            result[i] = data[i].totalAp;
        }
        result.reverse();
        return result;
    }

    /*解析AP数量趋势信息数据*/
    function analyseApTendencyData(option,data){
        var result = {};
        result.hunan = analyseData(data.hunan);
        result.shanxi = analyseData(data.shanxi);
        result.guangdong = analyseData(data.guangdong);
        result.henan = analyseData(data.henan);
        result.shanghai = analyseData(data.shanghai);

        var timeNumber = result.shanghai.length;
        var date = [];
        switch(option)
        {
            case 'day':
                date = getdaydate(timeNumber);
                break;
            case 'week':
                date = getweekdate(timeNumber);
                break;
            case 'month':
                date = getmonthdate(timeNumber);
                break;
            default:
                break;
        }
        drawApTendency(date,result);
    }

    /*渲染AP数量趋势信息数据*/
    function drawApTendency(date,data){

        var option = {
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:
                [
                    {   name:"湖南",
                        textStyle:{color:"white"}
                    },
                    {
                        name:"陕西",
                        textStyle:{color:"white"}
                    },
                    {
                        name:"广东",
                        textStyle:{color:"white"}
                    },
                    {
                        name:"河南",
                        textStyle:{color:"white"}
                    },
                    {
                        name:"上海",
                        textStyle:{color:"white"}
                    }
                ]
            },
            calculable : true,
            grid:{
                y:100
            },
            xAxis : [
                {
                    name:'日期',
                    type : 'category',
                    boundaryGap : false,
                    axisLabel: {
                        show:true,
                        textStyle:{color: '#e6e6e6', fontSize:"12px"}
                    },
                    data :date
                }
            ],
            yAxis : [
                {
                    name:'ap数量',
                    type : 'value',
                    axisLabel: {
                        show:true,
                        textStyle:{color: '#e6e6e6', fontSize:"12px"}
                    }
                }
            ],
            series : [
                {
                    name:'湖南',
                    type:'line',
                    stack: '总量',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:data.hunan
                },
                {
                    name:'陕西',
                    type:'line',
                    stack: '总量',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:data.shanxi
                },
                {
                    name:'广东',
                    type:'line',
                    stack: '总量',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:data.guangdong
                },
                {
                    name:'河南',
                    type:'line',
                    stack: '总量',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:data.henan
                },
                {
                    name:'上海',
                    type:'line',
                    stack: '总量',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:data.shanghai
                }
            ]
        };
        //var oTheme = {
        //    color : ['gray','blue','#69C4C5','#FFBB33','#FF8800','#CC324B']
        //};
        $("#tendency").echart("init",option);
    }



    function initGrid(){

        var opt_head = {
            colNames: getRcText ("rankDetailTitle"),
            multiSelect: false,
            columnChange:false,
            colModel:[
                {name:'location', datatype:"String"},
                {name:'onlineapcount', datatype:"Integer"},
                {name:'onfflineapcount', datatype:"Integer"},
                {name:'account', datatype:"Integer"},
                {name:'clientcount', datatype:"Integer"},
                {name:"citydetail",datatype:"String",formatter:showSum}
            ],
            buttons:[
                {name:"add",enable:false},
                {name:"refresh",enable:false},
                {name:"delete",enable:false}
            ]
        };
            $("#rankDetail_mlist").mlist("head",opt_head);
    }


    function showSum(row,cell,value,columnDef,dataContext,type){

        if(!value){
            return "";
        }
        if( (value == "") || (type=="text")){
            return value;
        }
        switch(cell){
            case 5:
            {
                return "<a class='show-sum' type='0' location='"+ dataContext["location"] +"'>" + dataContext["citydetail"] + "</a>";
                break;
            }
            default:
                break;
        }
    }

    function onShowSums(){

        var jThis = $(this);
        var locationData = jThis.attr("location");
        var jDlg = $("#cityDetail");
        var jScope = {scope:jDlg,className:'modal-super'};
        Utils.Base.openDlg(null,{},jScope);

        /*市级列表头部*/
        drawCityDetailMlist();
        /*获取市级详细数据*/
        getCityDetail(locationData);
    }

    function drawCityDetailMlist(){

        var optCity_head = {
            colNames:getRcText("cityTitle"),
            multiSelect: false,
            columnChange:false,
            colModel:[
                {name:'location', datatype:"String"},
                {name:'onlineapcount', datatype:"Integer"},
                {name:'offlineapcount', datatype:"Integer"},
                {name:'account', datatype:"Integer"},
                {name:'clientcount',dataType:'Integer'}
            ],
            buttons:[
                {name:"add",enable:false},
                {name:"refresh",enable:false},
                {name:"delete",enable:false}
            ]
        };
            $("#city").mlist("head",optCity_head);
    }

    /*市级详细信息弹出框*/
    function getCityDetail(locationData){

        $.ajax({
            url:MyConfig.path + '/diagnosis_read/web/getApCountInfo',
            type:'post',
            dataType:'json',
            data:{
                region:locationData
            },
            success:function(data){

                /*解析市级数据*/
                analyseCityDetailData(data)
            },
            error:function(){

            }
        });
    }

    /*解析市级数据显示列表中*/
    function analyseCityDetailData(cityDetailData){

        var data  = cityDetailData || [];
        var optData = [];
        for( var i = 0 ; i < data.length ; i++){
            optData[i] = {};
            optData[i].location =  data[i]._id.City;
            optData[i].onlineapcount = data[i].onlineAp.toString();
            optData[i].offlineapcount = data[i].offineAp.toString();
            optData[i].account = data[i].totalAc.toString();
            optData[i].clientcount = data[i].client.toString();
        }
        $("#city").mlist("refresh",optData);
    }

    function initData(){

        /*获取AP信息(省市排行，最多/最少)数据*/
        getApCountRank();
        /*获取省市排行详细信息数据*/
        getApRankDetail();
        /*获取省市每日数量变化趋势*/
        getApCountTendency();
    }

    function initForm(){

        $("#rankDetail_mlist").on("click",'.show-sum',onShowSums);

        $("#flow_day").on("click",function(){
            $("#flow_day").addClass('select');
            $("#flow_week").removeClass('select');
            $("#flow_month").removeClass('select');
            getApCountTendency('day');
        });

        $("#flow_week").on("click",function(){
            $("#flow_week").addClass('select');
            $("#flow_day").removeClass('select');
            $("#flow_month").removeClass('select');
            getApCountTendency('week');
        });

        $("#flow_month").on("click",function(){
            $("#flow_month").addClass('select');
            $("#flow_week").removeClass('select');
            $("#flow_day").removeClass('select');
            getApCountTendency('month');
        })
    }

    function _init(){

        initGrid();
        initData();
        initForm();
    }

    function getRcText(sRcName){

        return Utils.Base.getRcString("location_rc",sRcName);
    }

    function _destroy(){

    }

    Utils.Pages.regModule(MODULE_NAME,{
        "init":_init,
        "destroy":_destroy,
        "widgets":["Echart","Mlist"],
        "utils": ["Base","Request"]
    })

})(jQuery);