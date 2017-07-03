(function($){

    var MODULE_BASE = "health";
    var MODULE_NAME = MODULE_BASE + ".chlreport";

    /*获取空口质量报告数据*/
    function getData(oPara){
        var date = oPara.date;
        var apName = oPara.ApName;
        var radiotype = oPara.RadioType;

        var chlOpt = {
            url:MyConfig.path +'/diagnosis_read/web/report?devSN='+FrameInfo.ACSN,
            type:'post',
            dataType:'json',
            data:{
                date:date
            },
            onSuccess:getChlReportSuc,
            onFailed:getChlReportFail
        };

            Utils.Request.sendRequest(chlOpt);

        /*success回调*/
        function getChlReportSuc(data){

            analyseChlReport(data,apName,radiotype);
        }

        /*fail回调*/
        function getChlReportFail(){

        }
    }

    /*解析数据中的干扰信道*/
    function analyseChlReport(data,apName,radiotype){
        var ChlNum_2_4G = [1,2,3,4,5,6,7,8,9,10,11,12,13];
        var AvgAQ_2_4G = [0,0,0,0,0,0,0,0,0,0,0,0,0];
        var ChlNum_5G = [36,40,44,48,52,56,60,64,149,153,157,161,165];
        var AvgAQ_5G = [0,0,0,0,0,0,0,0,0,0,0,0,0];
        var ChlNum = [];
        var AvgAQ = [];
        var chlReport = data.apreport;

       if( chlReport.length != 0){
           for( var i = 0; i < chlReport.length;i++){
               var ApName = chlReport[i].ApName;
               var RadioType = chlReport[i].RadioType;
               var ApreportData = chlReport[i].ApreportData;

               if( (ApName == apName) && ( RadioType == radiotype)){
                   if( ApreportData[0].AQRpt != undefined){
                       for(var j = 0; j < ApreportData.length; j++){
                           ChlNum[j] = ApreportData[j].AQRpt.ChlNum;
                           AvgAQ[j] = ApreportData[j].AQRpt.AvgAQ;
                       }
                   }
               }
           }
        }

        if( radiotype == "2.4G"){

            for( var i = 0; i < ChlNum.length ; i++){
                for( var j = 0; j < ChlNum_2_4G.length ;j++){
                    if( ChlNum[i] == ChlNum_2_4G[j]){
                        AvgAQ_2_4G[j] = AvgAQ[i];
                        break;
                    }
                }
            }
                    drawBar(AvgAQ_2_4G,ChlNum_2_4G);
        }
        else if( radiotype == "5G"){

            for(var i = 0; i < ChlNum.length;i++){
                for(var j = 0; j < ChlNum_5G.length;j++){
                    if( ChlNum[i] == ChlNum_5G[j]){
                        AvgAQ_5G[j] = AvgAQ[i];
                        break;
                    }
                }
            }
                    drawBar(AvgAQ_5G,ChlNum_5G);
        }
    }

    /*柱状图显示信道*/
    function drawBar(ylist,xlist){

        // 使用
        require(
            [
                'echarts',
                'echarts/chart/bar'// 按需加载使用的图形模块
            ],
            function (ec){
                // 基于准备好的dom,初始化echarts图表
                var myChart = ec.init(document.getElementById('chl'));
                var option = {
                    title : {
                        subtext: '',
                        x:'center',
                        y:"60"
                    },
                    tooltip : {
                        show:true,
                        trigger: 'axis',
                        axisPointer:{
                            lineStyle:{
                                width:0
                            }
                        }
                    },
                    calculable : false,
                    grid :
                    {
                        x:40, y:26, x2:50, y2:20,
                        borderColor : '#fff'
                    },
                    xAxis : [
                        {
                            name:"信道",
                            boundaryGap: true,
                            splitLine:false,
                            axisLine  : {
                                show:true,
                                lineStyle :{color: '#9da9b8', width: 1}
                            },
                            axisTick:{show:false},
                            axisLabel:{
                                show:true,
                                textStyle:{color: '#444444', fontSize:"12px", width:2},
                                formatter:function (value){
                                    return value;
                                },
                                interval:0
                            },

                            // axisTick:"item",
                            type : 'category',
                            data : xlist
                        }
                    ],
                    yAxis : [
                        {
                            name:"平均质量",
                            splitLine:false,
                            axisLabel: {
                                show:true,
                                textStyle:{color: '#444444', fontSize:"12px", width:2}
                            },
                            axisLine : {
                                show:true,
                                lineStyle :{color: '#9da9b8', width: 1}
                            },
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:"yistLine",
                            type:'bar',
                            barCategoryGap: '35%',
                            data:ylist,
                            itemStyle : {
                                normal: {
                                    color:
                                        function(params) {
                                            // build a color map as your need.
                                            var colorList = [
                                                'green','gray','#FCCE10','#E87C25','#27727B',
                                                '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                                                '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
                                            ];
                                            return colorList[params.dataIndex]
                                        },
                                    label: {
                                        show: true,
                                        position: 'top',
                                        formatter: '{c}'
                                    }
                                }
                            }
                        }
                    ]
                };

                //为echarts对象加载数据
                myChart.setOption(option);
            }
        )
    }

    function _init(oPara){
        getData(oPara);
    }

    function _destroy(){

        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }

    Utils.Pages.regModule(MODULE_NAME,{
        "init":_init,
        "destroy": _destroy,
        "widgets": ["Echart"],
        "utils":["Base","Request"]
    })

})(jQuery);