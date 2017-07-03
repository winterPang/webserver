(function($){
    var MODULE_BASE = "maintain";
    var MODULE_NAME = MODULE_BASE + ".analyse_run";
    var g_SN = "";
    var g_xlist = [];

    /*获取cpu,内存数据*/
    function getData(sn,type){

        $.ajax({
            url:MyConfig.path + '/alarm/proGetAcRunInfo',
            type:'post',
            dataType:'json',
            data:{
                devSN:sn,
                category:type
            },
            success:function(data){

                /*解析alarm微服务返回的数据*/
                analyseData(data);
            },
            error:function(){

            }
        })
    }


    /*解析cpu，内存数据*/
    function analyseData(data){

        data = data || [];
        var cpu_max = new Array();
        var cpu_min = new Array();
        var memory_max = new Array();
        var memory_min = new Array();
        var xlist = new Array();

        for(var i = 0, l = data.length ; i < l ; i++){
            cpu_max.push(data[i].maxCpu);
            cpu_min.push(data[i].minCpu);
            memory_max.push(data[i].maxMemory);
            memory_min.push(data[i].minMemory);
            if(data[i]._id.hour < 10)
            {
                if(data[i]._id.minute < 10)
                {
                    xlist.push("0" + data[i]._id.hour + ":0" + data[i]._id.minute);
                }
                else
                {
                    xlist.push("0" + data[i]._id.hour + ":" + data[i]._id.minute);
                }
            }
            else
            {
                if(data[i]._id.minute < 10)
                {
                    xlist.push(data[i]._id.hour +  ":0" + data[i]._id.minute);
                }
                else
                {
                    xlist.push(data[i]._id.hour + ":" + data[i]._id.minute );
                }
            }
        }

        g_xlist = xlist;
        /*draw cpu折线图*/
        if(xlist.length != 0)
        {
            initCpu(xlist,cpu_max,cpu_min);
            /*draw 内存折线图*/
            initMemory(xlist,memory_max,memory_min);
        }
    }

    /*cpu折线图*/
    function initCpu(xlist,cpu_max,cpu_min){

        var option = {
        height:"300px",
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:
                [
                    {
                        name:"最高",
                        textStyle:{color:"white",fontFamily:"宋体"}
                    },
                    {
                        name:"最低",
                        textStyle:{color:"white",fontFamily:"宋体"}
                    }
                ]
        },
        calculable : true,
        xAxis : [
            {
                name:'日期',
                type : 'category',
                boundaryGap : true,
                data : xlist,
                axisLabel:{
                    show:true,
                    textStyle:{color:"white",fontFamily:"宋体"}
                }
            }
        ],
        yAxis : [
            {
                name:'使用占比(%)',
                type : 'value',
                axisLabel:{
                    show:true,
                    textStyle:{color:"white",fontFamily:"宋体"},
                    formatter: '{value} %'
                }
            }
        ],
        series : [
            {
                name:'最高',
                type:'line',
                data:cpu_max,
                markPoint : {
                    data : [
                        {type : 'max', name: '最大值'},
                        {type : 'min', name: '最小值'}
                    ]
                },
                markLine : {
                    data : [
                        {type : 'average', name: '平均值'}
                    ]
                }
            },
            {
                name:'最低',
                type:'line',
                data:cpu_min,
                markPoint : {
                    data : [
                        {type:'max',name:"最大值"},
                        {type:'min',name:"最小值"}
                    ]
                },
                markLine : {
                    data : [
                        {type : 'average', name : '平均值'}
                    ]
                }
            }
        ]
    };
    $("#cpu").echart("init",option);
}

    /*内存折线图*/
    function initMemory(xlist,memory_max,memory_min){

        var option = {
            height:"300px",
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:[
                    {
                        name:"最高",
                        textStyle:{color:"white",fontSize:"14px",fontFamily:"宋体"}
                    },
                    {
                        name:"最低",
                        textStyle:{color:"white",fontSize:"14px",fontFamily:"宋体"}
                    }
                ]
            },
            calculable : true,
            xAxis : [
                {
                    name:"日期",
                    type : 'category',
                    boundaryGap : true,
                    data :xlist,
                    axisLabel:{
                        show:true,
                        textStyle:{color:"white",fontFamily:"宋体"}
                    }
                }
            ],
            yAxis : [
                {
                    name:"使用占比(%)",
                    type : 'value',
                    axisLabel:{
                        show:true,
                        textStyle:{color:"white",fontFamily:"宋体"},
                        formatter:'{value} %'
                    }
                }
            ],
            series : [
                {
                    name:'最高',
                    type:'line',
                    data:memory_max,
                    markPoint : {
                        data : [
                            {type : 'max', name: '最大值'},
                            {type : 'min', name: '最小值'}
                        ]
                    },
                    markLine : {
                        data : [
                            {type : 'average', name: '平均值'}
                        ]
                    }
                },
                {
                    name:'最低',
                    type:'line',
                    data:memory_min,
                    markPoint : {
                        data : [
                            {type:'max',name:"最大值"},
                            {type:"min",name:"最小值"}
                        ]
                    },
                    markLine : {
                        data : [
                            {type : 'average', name : '平均值'}
                        ]
                    }
                }
            ]
        };
                var oTheme = {
                    color:["#D7DDE4","#E64C65"]
                };
                $("#memory").echart("init",option,oTheme);
    }


    function initForm(){

        //入口devSN过滤框提交按钮
        $("#success").on("click",function(){
            var value = $('input[name=ACSN]').val();
            $("#ACSN").val("");
            if(!value)
            {
                $("#warning").show();
                $("#warning").html("请输入设备序列号");
                $('input[name=ACSN]').css("border","1px solid #a94442");
                $('input[name=ACSN]').addClass('warning');
            }
            else
            {
                //TODO 设备序列号要发到服务端进行校验，等待服务端完成再写。
                g_SN = value;
                $("#filter").addClass('hide');
                $("#body").removeClass('hide');

                /*获取cpu，内存数据*/
                getData(g_SN,"day");
            }
        });


        //设备序列号输入框去掉变红操作
        $('input[name=ACSN]').on("mousedown",function(){
            var value = $("#ACSN").hasClass('warning');
            if(value)
            {
                $("#warning").html("");
                $("#warning").hide();
                $('input[name=ACSN]').css('border','1px solid #71858e');
                $('input[name=ACSN]').removeClass('warning');
            }
        });

        /*CPU模块 START*/
        //按天显示
        $("#day_cpu").on("click",function(){
            $("#day_cpu").addClass('select');
            $("#week_cpu").removeClass('select');
            $("#month_cpu").removeClass('select');
            $("#other_cpu").removeClass('select');

            //获取按天显示数据
            getSelectTimeData(g_SN,"day","cpu");
        });

        //按周显示
        $("#week_cpu").on("click",function(){
            $("#week_cpu").addClass('select');
            $("#day_cpu").removeClass('select');
            $("#month_cpu").removeClass('select');
            $("#other_cpu").removeClass('select');

            //获取按周显示数据
            getSelectTimeData(g_SN,"week","cpu");
        });

        //按月显示
        $("#month_cpu").on("click",function(){
            $("#month_cpu").addClass('select');
            $("#day_cpu").removeClass('select');
            $("#week_cpu").removeClass('select');
            $("#other_cpu").removeClass('select');

            //获取按月显示数据
            getSelectTimeData(g_SN,"month","cpu");
        });

        //自定义显示
        $("#other_cpu").on("click",function(){
            $("#other_cpu").addClass('select');
            $("#day_cpu").removeClass('select');
            $("#week_cpu").removeClass('select');
            $("#month_cpu").removeClass('select');

            //显示隐藏的日期输入框
            $("#custom_cpu").slideToggle(200);

            //清空内存的日历模块，同时进行cpu的日历模块操作
            $("#Calendar_memory").empty();
            $(".jcDate_cpu").jcDate({
                IcoClass : "jcDateIco",
                Event : "click",
                Speed : 100,
                Left : 0,
                Top : 28,
                format : "-",
                Timeout : 100,
                className:"jcDate_cpu"
            });
        });
        /*CPU模块 END*/

        /*内存模块 START*/
        //按天显示
        $("#day_memory").on("click",function(){
            $("#day_memory").addClass('select');
            $("#week_memory").removeClass('select');
            $("#month_memory").removeClass('select');
            $("#other_memory").removeClass('select');

            //获取按天显示数据
            getSelectTimeData(g_SN,"day","memory");
        });

        //按周显示
        $("#week_memory").on("click",function(){
            $("#week_memory").addClass('select');
            $("#day_memory").removeClass('select');
            $("#month_memory").removeClass('select');
            $("#other_memory").removeClass('select');

            //获取按周显示数据
            getSelectTimeData(g_SN,"week","memory");
        });

        //按月显示
        $("#month_memory").on("click",function(){
            $("#month_memory").addClass('select');
            $("#day_memory").removeClass('select');
            $("#week_memory").removeClass('select');
            $("#other_memory").removeClass('select');

            //获取按月显示数据
            getSelectTimeData(g_SN,"month","memory");
        });

        //自定义显示
        $("#other_memory").on("click",function(){
            $("#other_memory").addClass('select');
            $("#day_memory").removeClass('select');
            $("#week_memory").removeClass('select');
            $("#month_memory").removeClass('select');

            //显示隐藏的日期输入框
            $("#custom_memory").slideToggle(200);


            //清空cpu的日历模块，同时进行内存的日历模块操作
            $("#Calendar_cpu").empty();
            $(".jcDate_memory").jcDate({
                IcoClass : "jcDateIco",
                Event : "click",
                Speed : 100,
                Left : 0,
                Top : 28,
                format : "-",
                Timeout : 100,
                className:"jcDate_memory"
            });
        });
        /*内存模块 END*/

        /*其他自定义日期 CPU模块 START*/
        //提交按钮
        $("#submit_cpu").on("click",function(){
            var date = $('input[name=jcDate_cpu]').val();

            if(!date)
            {
                Frame.Msg.alert("请选择日期");
                return;
            }
            //隐藏cpu的自定义模块(CPU日期输入框),日期输入框置空
            $("#custom_cpu").hide();
            $('input[name=jcDate_cpu]').val("");
            //获取自定义日期的数据
            getOtherData(g_SN,date,"cpu");
        });
        /*cpu模块 END*/

        /*其他自定义日期 内存模块 START*/
        //提交按钮
        $("#submit_memory").on("click",function(){
            var date = $('input[name=jcDate_memory]').val();

            if(!date)
            {
                Frame.Msg.alert("请选择日期");
                return;
            }
            //隐藏内存自定义模块(内存日期输入框),日期输入框置空
            $("#custom_memory").hide();
            $('input[name=jcDate_memory]').val("");
            //获取自定义日期的数据
            getOtherData(g_SN,date,"memory");
        });
        /*内存模块 EDN*/


        /*更换其他设备*/
        $("#changeDev").on("click",function(){

            //CPU 内存模块置为初始化
            $("#day_cpu").addClass('select');
            $("#week_cpu").removeClass('select');
            $("#month_cpu").removeClass('select');
            $("#other_cpu").removeClass('select');
            $("#day_memory").addClass('select');
            $("#week_memory").removeClass('select');
            $("#month_memory").removeClass('select');
            $("#other_memory").removeClass('select');


            //清空图形，隐藏图形，显示过滤框
            $("#cpu").empty();
            $("#memory").empty();
            $("#body").addClass('hide');
            $("#filter").removeClass('hide');
        });
    }


    /*获取自定义日期数据*/
    function getOtherData(sn,date,oType){

        $.ajax({
            url:MyConfig.path + "/alarm/proGetAcRunInfo",
            type:'post',
            dataType:'json',
            data:{
                devSN:sn,
                date:date
            },
            success:function(data){

                //解析自定义日期获取的数据
                analyseOtherData(data,oType);
            },
            error:function(){

            }
        })
    }

    /*解析自定义数据*/
    function analyseOtherData(data,oType){

        data = data || [];
        var max_cpu  = new Array();
        var min_cpu  = new Array();
        var max_memory = new Array();
        var min_memory = new Array();
        var xlist = new Array();

        if( oType == "cpu")
        {
           for(var i = 0, l = data.length ; i < l ; i++){
               max_cpu.push(data[i].maxCpu);
               min_cpu.push(data[i].minCpu);
               if( data[i]._id.hour < 10)
               {
                   data[i]._id.minute >= 10 ? xlist.push( "0" + data[i]._id.hour + ":" + data[i]._id.minute) : xlist.push( "0" + data[i]._id.hour + ":0" + data[i]._id.minute);
               }
               else
               {
                   data[i]._id.minute >= 10 ? xlist.push( data[i]._id.hour + ":" + data[i]._id.minute) : xlist.push( data[i]._id.hour + ":0" + data[i]._id.minute);
               }

           }

            //draw CPU折线图
            initCpu(xlist,max_cpu,min_cpu);
        }
        else if( oType == "memory")
        {
            for(var i = 0, l = data.length ; i < l ; i++){
                max_memory.push(data[i].maxMemory);
                min_memory.push(data[i].minMemory);
                if( data[i]._id.hour < 10)
                {
                    data[i]._id.minute >= 10 ? xlist.push( "0" + data[i]._id.hour + ":" + data[i]._id.minute) : xlist.push( "0" + data[i]._id.hour + ":0" + data[i]._id.minute);
                }
                else
                {
                    data[i]._id.minute >= 10 ? xlist.push( data[i]._id.hour + ":" + data[i]._id.minute) : xlist.push( data[i]._id.hour + ":0" + data[i]._id.minute);
                }
            }

            //draw内存折线图
            initMemory(xlist,max_memory,min_memory);
        }
    }

    /*获取click事件对应的数据*/
    function getSelectTimeData(sn,type,oType){

        $.ajax({
            url:MyConfig.path + "/alarm/proGetAcRunInfo",
            type:'post',
            dataType:'json',
            data:{
                devSN:sn,
                category:type
            },
            success:function(data){

                /*解析click事件获取的数据*/
                analyseSelectTimeData(data,type,oType);
            },
            error:function(){

            }
        })
    }

    /*解析click事件获取的数据*/
    function analyseSelectTimeData(data,type,oType){

        data = data || [];
        var cpu_max = new Array();
        var cpu_min = new Array();
        var memory_max = new Array();
        var memory_min = new Array();
        var xlist = new Array();


        /*判断是cpu的click事件还是内存的click事件，对应draw折线图*/
        if( oType == "cpu")
        {
            for(var i = 0, l = data.length ; i < l ; i++){
                cpu_max.push(data[i].maxCpu);
                cpu_min.push(data[i].minCpu);
                if( type == "day")
                {
                    xlist = g_xlist;
                }
                else
                {
                    xlist.push(data[i]._id.yearMonthDay);
                }
            }

            //draw cpu折线图
            initCpu(xlist,cpu_max,cpu_min);
        }
        else if( oType == "memory")
        {
            for(var i = 0, l = data.length ; i < l ; i++){
                memory_max.push(data[i].maxMemory);
                memory_min.push(data[i].minMemory);

                if( type == "day")
                {
                    xlist = g_xlist;
                }
                else
                {
                    xlist.push(data[i]._id.yearMonthDay);
                }
            }

            //draw 内存折线图
            initMemory(xlist,memory_max,memory_min);
        }
    }

    function _init(){

        initForm();

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