; (function ($) {
    var MODULE_NAME = "x_summary.userflow";

    var g_count = [6,24,7,30,12];
    var hPending = null;
    function aj_gettotaluser(para, callback) {
        var ajax ={
            url:MyConfig.path+"/stamonitor/histclientstatistic?devSN=" + FrameInfo.ACSN + para,
            type: "GET",
            dataType: "json",
            timeout: 150000,
            contentType: "application/json",
            onSuccess: function (data) {
                try {
                    if (!('client_statistic' in data)) {

                    }
                    callback(data.client_statistic);
                }catch(error){
                    console.log(error);
                }
            },
            onFailed:function(err){
                hPending&&hPending.close();
                console.log(err);
            }
        }
        Utils.Request.sendRequest(ajax);
    }
    
    // function aj_getnewuser(modetest, callback) {
    //     var ajax = {
    //         url:MyConfig.path+"/visitor/statistics"+modetest+"?devSN=" + FrameInfo.ACSN,
    //         type: "GET",
    //         dataType: "json",
    //         timeout: 150000,
    //         contentType: "application/json",
    //         onSuccess: function (data) {
    //             try {
    //                 if(!('error' in data && 'result' in data)){
    //                     throw (new Error("data error"));
    //                 }
                    
    //                 if (data.error == 0) {
    //                     callback(data.result);
    //                 }
    //             }catch(error){
    //                 console.log(error);
    //             }
    //         },
    //         onFailed:function(err){
    //             hPending&&hPending.close();
    //             console.log(err);
    //         }
    //     }

    //     Utils.Request.sendRequest(ajax);
    // }
//获取新增宾客    
    function aj_getnewuser(dateTime,Time, callback) {
        var ajax = {
            url:MyConfig.path+"/stamonitor/monitor",
            type: "POST",
            dataType: "json",
            timeout: 150000,
            data:{
                "method":"clientstat_newvisitorcountbyday",
                "param":{
                   "indexType":"devSN",
                   "index": FrameInfo.ACSN,
                   "dateType":dateTime,
                   "time":Time,
                   "dataType":"",
                }
            },
            onSuccess: function (data) {
                try {    
                    callback(data.response);
                    
                }catch(error){
                    console.log(error);
                }
            },
            onFailed:function(err){
                hPending&&hPending.close();
                console.log(err);
            }
        }

        Utils.Request.sendRequest(ajax);
    }
   //宾客总数一天
    function todayClientCount(callback){
        var Curtime = new Date();
        var Today = new Date(Curtime.getFullYear(), Curtime.getMonth(), Curtime.getDate());
        var ajax = {
            url:MyConfig.path+"/stamonitor/monitor",
            type: "POST",
            dataType: "json",
            timeout: 150000,
            contentType: "application/json",
            data:JSON.stringify({
                "method":"getOnlineClientDayStatByDevSN",
            
                "param":{
                   "devSN": FrameInfo.ACSN,
                    "dateTime":Today,
                    "datatype":""
                }
            }),
            onSuccess: function (data) {
                try {    
                    callback(data.response);
                    
                }catch(error){
                    console.log(error);
                }
            },
            onFailed:function(err){
                g_hPending&&g_hPending.close();
                console.log(err);
            }
        };
        Utils.Request.sendRequest(ajax);
    }
   //宾客总数一周
    function weekClientCount(callback){
        var ajax = {
            url:MyConfig.path+"/stamonitor/monitor",
            type: "POST",
            dataType: "json",
            timeout: 150000,
            contentType: "application/json",
            data:JSON.stringify({
                "method":"getclientcountbydevSN_oneweek",
                "param":{
                    "devSN": FrameInfo.ACSN,
                    "datatype":" "
                }
            }),
            onSuccess: function (data) {
               try {    
                    callback(data.response);
                    
                }catch(error){
                    console.log(error);
                } 
            },
            onFailed:function(err){
                g_hPending&&g_hPending.close();
                console.log(err);
            }
        };
        Utils.Request.sendRequest(ajax);
    }
   //宾客总数一月
    function monthClientCount(callback){
        var ajax = {
            url:MyConfig.path+"/stamonitor/monitor",
            type: "POST",
            dataType: "json",
            timeout: 150000,
            contentType: "application/json",
            data:JSON.stringify({
                "method":"getclientcountbydevSN_onemonth",
                "cfgTimeout": 120,
                "param":{
                    "devSN": FrameInfo.ACSN,
                    "dataType":" "
                }
            }),
            onSuccess: function (data) {
                try {    
                    callback(data.response);
                    
                }catch(error){
                    console.log(error);
                } 
            },
            onFailed:function(err){
                g_hPending&&g_hPending.close();
                console.log(err);
            }
        }
        Utils.Request.sendRequest(ajax);
    }
  //宾客来访次数统计  
    function aj_getAccessTime(callback) {
        var ajax = {
            url:MyConfig.path+"/stamonitor/gethistclientstatisticbyAccesstimes?devSN=" + FrameInfo.ACSN,
            type: "GET",
            dataType: "json",
            timeout: 150000,
            contentType: "application/json",
            onSuccess: function (data) {
                try {
                    if (!( 'statistics' in data &&data.statistics instanceof Array)) {
                        throw (new Error("data error"));
                    }
                    callback(data.statistics);
                }catch(error){
                    console.log(error);
                }
            },
            onFailed:function(err){
                hPending&&hPending.close();
                console.log("access faild:");
            }
        }
        Utils.Request.sendRequest(ajax);
    }
 //获取在线时间请求   
    function aj_getOnlineTime(callback) {
        var ajax = {
            url:MyConfig.path+"/stamonitor/gethistclientstatisticbyonlinetime?devSN=" + FrameInfo.ACSN,
            type: "GET",
            dataType: "json",
            timeout: 150000,
            contentType: "application/json",
            onSuccess: function (data) {
                try {
                    if (!('statistics' in data &&data.statistics instanceof Array)) {
                        throw (new Error("data error"));
                    }
                    callback(data.statistics);
                }catch(error){
                    console.log(error);
                }
            },
            onFailed:function(err){
                hPending&&hPending.close();
                console.log("access faild:");
            }
        }
        Utils.Request.sendRequest(ajax);
    }

    
    function getRcText(sRcName){
        return Utils.Base.getRcString("x_userflow_rc", sRcName);
    }
    
    function transfertolist(data, mode) {
        
    }
    
    function drawLoginUserCount(snr, newdata, date, amode) {
        var aData = [];
        var bData = [];
        var xText = [getRcText("XTEXT").split(",")[0],
                     getRcText("XTEXT").split(",")[1],
                     getRcText("XTEXT").split(",")[2],
                     getRcText("XTEXT").split(",")[3],
                     getRcText("XTEXT").split(",")[4]];
// '分''时''日''日''月'
        for(var i = 0; i < date.length; i++)
        {
            bData.push(snr[i].allCount);
            aData.push(newdata[i].newCount);
        }
        option = {
            width: "100%",
            height:"100%",
            title : {
                subtext: '',
                x:'center',
                y:"60"
            },
            tooltip : {
                show:false,
                trigger: 'axis'
            },
            legend: {
                itemWidth:8,
                data:[getRcText("CLIENT_DATA").split(",")[0],getRcText("CLIENT_DATA").split(",")[1]]
                // '新增宾客''宾客总数'
            },
            calculable : false,
            grid :
            {
                x:40, y:30, x2:30, y2:40,
                borderColor : '#fff'
            },
            xAxis : [
                {
                    name: xText[amode],
                    boundaryGap: true,
                    splitLine:false,
                    axisLine  : {
                        show:true ,
                        lineStyle :{color: '#9da9b8', width: 1}
                    },
                    axisTick:{show:false},
                    axisLabel:{
                        show:true,
                        textStyle:{color: '#9da9b8', fontSize:"12px", width:2},
                        formatter:function (value){
                            return value;
                        },
                        interval:0
                    },

                    // axisTick:"item",
                    type : 'category',
                    data : date
                }
            ],
            yAxis : [
                {
                    name:getRcText("USER_COUNT"),
                    splitLine:{
                        show:true,
                        textStyle:{color: '#c9c4c5', fontSize:"1px", width:4},
                        lineStyle: {
                            // 使用深浅的间隔色
                            color: ['#e7e7e9']
                        }
                    },
                    axisLabel: {
                        show:true,
                        textStyle:{color: '#9da9b8', fontSize:"12px", width:2}
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
                    name:getRcText("CLIENT_DATA").split(",")[0],
                    // "新增宾客"
                    type:'bar',
                    barCategoryGap: '40%',
                    data:aData,
                    itemStyle : {
                        normal: {
                            label : {
                                show: true,
                                position: 'top',
                                formatter: function(oData){
                                    return oData.value;

                                }
                            },
                            color:'#69C4C5'
                        }
                    }
                },
                {
                    name:getRcText("CLIENT_DATA").split(",")[1],
                    // "宾客总数"
                    type:'line',
                    smooth: true,
                    barCategoryGap: '40%',
                    data:bData,
                    itemStyle : {
                        normal: {
                            label : {
                                show: true,
                                position: 'top',
                                formatter: function(oData){
                                    return oData.value;

                                }
                            },
                            color:'#F9AB6B'
                        }
                    }
                }
            ],
            click: function () {}
        };
        var oTheme = {
            color : ['#229A61','#3DD38C','#79E1CD','#FFDC6D','#F9AB6B','#EF6363','#F09ABF','#BEC7D0']
        };

        $("#loginuser").echart("init", option, oTheme);

    }
//根据mode获取选中时间
    function getDateByMode(mode){

        var date = [];
        var daysCount = g_count[mode];
        var tenmin = 10 * 60 * 1000;
        var oneHour = tenmin * 6;
        var oneDay = oneHour * 24;
        var oneMonth = oneDay * 30;
        var base = 0;

        if (mode == 0){
            base = (new Date())-((daysCount+1)*tenmin);
            for (var i = 0; i < daysCount; i++) {
                var now = new Date(base += tenmin);
                date.push(now.getMinutes() + 1);
            }

        }else if(mode == 1){
            var Curtime = new Date();
            base = new Date(Curtime.getFullYear(), Curtime.getMonth(), Curtime.getDate() - 1, 0, 0, 0);
            for (var i = 0; i < daysCount; i++) {
                //base = new Date(base.getTime() + oneHour);
                base = new Date(base.getTime()+ oneHour);
                if(i==23){
                  date.push(23);  
                }
                else{
                    date.push(base.getHours()-1);
                }
            }
            
            // base = (new Date())-((daysCount+1)*oneHour);
            // for (var i = 0; i < daysCount; i++) {
            //     var now = new Date(base += oneHour);
            //     date.push(now.getHours() + 1);
            // }

        }else if(mode == 2){
            base = (new Date())-((daysCount + 1)*oneDay);
            for (var i = 0; i < daysCount; i++) {
                var now = new Date(base += oneDay);
                date.push(now.getDate());
            }
        }else if(mode == 3){
            base = (new Date())-((daysCount + 1)*oneDay);
            for (var i = 0; i < daysCount; i++) {
                var now = new Date(base += oneDay);
                date.push(now.getDate());
            }
        }else{
            base = (new Date())-((daysCount+1)*oneMonth);
            for (var i = 0; i < daysCount; i++) {
                var now = new Date(base += oneMonth);
                date.push(now.getMonth() + 1);
            }
        }

        return date;
    }
//处理数据
    function drowLoginChart(mode, newUserList,countuser){

        var g_AllUser = new Array();
        var g_newUser = new Array();
        var date = getDateByMode(mode);//根据传入mode，获取时间；1-一天；2-一周；3-一个月
        //var nailength = totalUserList.length;
        var newlength = newUserList.length;//返回数据的长度
        var count = g_count[mode];
        
        //for (var i = (count - 1); i>=0; i--) {
        for (var i = (count - 1); i>=0; i--) {

            var value = (Math.random() * 10 + 1);
            
            if (i >= newlength){
                g_newUser.push({newCount:0});
                g_AllUser.push({allCount:0});
            }else{
                if(countuser[count-1-i].totalCount == "-"){
                   g_newUser.push({newCount:"-"});
                   g_AllUser.push({allCount:"-"}); 
                }
                else{
                    g_newUser.push({newCount: newUserList[count-1-i].totalCount});
                    g_AllUser.push({allCount: countuser[count-1-i].totalCount});
                }
                
            }
        }
        
        drawLoginUserCount(g_AllUser, g_newUser, date, mode);
    }
    
    function makeoption(aType) {
        var option = {
            height: 280,
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
             orient: 'horizontal',
             y: '240px',
             data:aType
            },
            calculable: false,
            series: [
                {
                    type: 'pie',
                    radius: ['35%', '55%'],
                    center: ['50%', '50%'],
                    itemStyle: {
                        normal: {
                            areaStyle:{
                                color:'red',
                            },
                            labelLine: {
                                show:false,
                                length: 10
                            },
                            label:
                            {
                                show:false,
                                position: "outer",
                                textStyle: {
                                    color: "#484A5E"
                                },
                                formatter: " {b} "
                            }
                        }
                    },
                    splitLine: {           // 分隔线
                        show: true,        // 默认显示，属性show控制显示与否
                        lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                            color: '#FF0',
                            width: 20
                        }
                    },
                    data: aType
                }
            ]
        };
        return option;
    }

    function showEchart() {
        var type = getRcText("USER_TYPE").split(",");
        var type_2 = getRcText("USER_TYPE_PHONE").split(",");
        var type_3 = getRcText("USER_TYPE_TIME").split(",");
        var aType = [
            { name: type[0], value: 6 },
            { name: type[1], value: 4 },
            { name: type[2], value: 7 },
            { name: type[3], value: 5 }
        ];
        var aType1 = [
            { name: type_3[0], value: 6 },
            { name: type_3[1], value: 4 },
            { name: type_3[2], value: 12 },
            { name: type_3[3], value: 9 }
        ];
        var aType2 = [
            { name: type_2[0], value: 7 },
            { name: type_2[1], value: 3 },
            { name: type_2[2], value: 8 },
            { name: type_2[3], value: 5 }
        ];
        var option = makeoption(aType);
        var option1 = makeoption(aType1);
        var option2 = makeoption(aType2);
        var oTheme = {
            color: ['#4ec1b2', '#ff9c9e', '#fbceb1', '#b3b7dd', '#F7C762', '#ABD6F5', '#63B4EF', '#3DA0EB', '#1683D3', '#136FB3']
        };
        $("#Channel_utilization").echart("init", option, oTheme);
        $("#Channel_utilization1").echart("init", option1, oTheme);
        $("#Channel_utilization2").echart("init", option2, oTheme);

        var normalnumber = getRcText("USER_TYPE1111").split(",");
        var appendTohtml = [
            '<div style="position: relative;top: -160px;margin: 0 auto;width: 100px;"><div><span style="font-size: 16px; color:#343e4e; display: block;float: left; margin-left: 18px; margin-top: 8px;">',
            normalnumber[0],
            '</span>',
            '</div>'
        ].join(" ");
        var appendTohtml1 = [
            '<div style="position: relative;top: -160px;margin: 0 auto;width: 100px;"><div><span style="font-size: 16px; color:#343e4e; display: block;float: left; margin-left: 18px; margin-top: 8px;">',
            normalnumber[1],
            '</span>',
            '</div>'
        ].join(" ");
        var appendTohtml2 = [
            '<div style="position: relative;top: -160px;margin: 0 auto;width: 100px;"><div><span style="font-size: 16px; color:#343e4e; display: block;float: left; margin-left: 18px; margin-top: 8px;">',
            normalnumber[2],
            '</span>',
            '</div>'
        ].join(" ");
        $(appendTohtml).appendTo($("#Channel_utilization"));
        $(appendTohtml1).appendTo($("#Channel_utilization1"));
        $(appendTohtml2).appendTo($("#Channel_utilization2"));
    }
    function showEchart_time(datalist) {
        var labelBottom = {
            normal: {
                color:'#ccc',
                label: {
                    show:true,
                    position:'center',

                },
                labelLine:{
                    show:false
                },

            },
            emphasis:{
                color:'rgba(0,0,0,0)'
            }
        };
        var type = getRcText("USER_TYPE_TIME").split(",");
        if ((datalist[0].count == 0)&&
        (datalist[1].count == 0)&&
        (datalist[2].count == 0)&&
        (datalist[3].count == 0)){
            datalist[0].count = 0;
            datalist[1].count = 0;
            datalist[2].count = 0;
            datalist[3].count = 0;
        }
        
        var aType = [
            { name: type[0], value: datalist[0].count>0?datalist[0].count:0 },
            { name: type[1], value: datalist[1].count>0?datalist[1].count:0 },
            { name: type[2], value: datalist[2].count>0?datalist[2].count:0 },
            { name: type[3], value: datalist[3].count>0?datalist[3].count:0 }
        ];
        var oTheme = {
            color: ['#4ec1b2', '#ff9c9e', '#fbceb1', '#b3b7dd', '#F7C762', '#ABD6F5', '#63B4EF', '#3DA0EB', '#1683D3', '#136FB3']
        };
        if(!checkZero(aType)){
            aType=[{ name: "", value:10,itemStyle:labelBottom}];
        }
        var option = makeoption(aType);
        $("#Channel_utilization1").echart("init", option, oTheme);

        var normalnumber = getRcText("USER_TYPE1111").split(",");
        var appendTohtml = [
            '<div style="position: relative;top: -160px;margin: 0 auto;width: 100px;"><div><span style="font-size: 16px; color:#343e4e; display: block;float: left; margin-left: 18px; margin-top: 8px;">',
            normalnumber[1],
            '</span>',
            '</div>'
        ].join(" ");
        
        $(appendTohtml).appendTo($("#Channel_utilization1"));
    }
    /*检测数据是否全为0*/
    function checkZero(aType){
        var fl=false;
        for(var i=0;i<aType.length;i++){
            if(aType[i].value!=0){
                fl=true;
            }
        }
        return fl;
    }
    function showEchart_access(datalist) {
        var labelBottom = {
            normal: {
                color:'#ccc',
                label: {
                    show:true,
                    position:'center',

                },
                labelLine:{
                    show:false
                },

            },
            emphasis:{
                color:'rgba(0,0,0,0)'
            }
        };
        var type = getRcText("USER_TYPE").split(",");
        
        var aType = [
            { name: type[0], value: datalist[0].count },
            { name: type[1], value: datalist[1].count },
            { name: type[2], value: datalist[2].count },
            { name: type[3], value: datalist[3].count }
        ];
        var oTheme = {
            color: ['#4ec1b2', '#ff9c9e', '#fbceb1', '#b3b7dd', '#F7C762', '#ABD6F5', '#63B4EF', '#3DA0EB', '#1683D3', '#136FB3']
        };
        if(!checkZero(aType)){
            aType=[{ name: "", value:10,itemStyle:labelBottom}];
        }
        var option = makeoption(aType);
        $("#Channel_utilization").echart("init", option, oTheme);

        var normalnumber = getRcText("USER_TYPE1111").split(",");
        var appendTohtml = [
            '<div style="position: relative;top: -160px;margin: 0 auto;width: 100px;"><div><span style="font-size: 16px; color:#343e4e; display: block;float: left; margin-left: 18px; margin-top: 8px;">',
            normalnumber[0],
            '</span>',
            '</div>'
        ].join(" ");
        
        $(appendTohtml).appendTo($("#Channel_utilization"));
    }
    
    // function showEchart_phoneType(datalist) {
    //     var type = getRcText("USER_TYPE_PHONE").split(",");
        
    //     var aType = [
    //         { name: type[0], value: datalist[0].count },
    //         { name: type[1], value: datalist[1].count },
    //         { name: type[2], value: datalist[2].count },
    //         { name: type[3], value: datalist[3].count }
    //     ];
        
    //     var option = makeoption(aType);
    //     var oTheme = {
    //         color: ['#4ec1b2', '#ff9c9e', '#fbceb1', '#b3b7dd', '#F7C762', '#ABD6F5', '#63B4EF', '#3DA0EB', '#1683D3', '#136FB3']
    //     };
        
    //     $("#Channel_utilization2").echart("init", option, oTheme);

    //     var normalnumber = getRcText("USER_TYPE1111").split(",");
    //     var appendTohtml = [
    //         '<div style="position: relative;top: -160px;margin: 0 auto;width: 100px;"><div><span style="font-size: 16px; color:#343e4e; display: block;float: left; margin-left: 18px; margin-top: 8px;">',
    //         normalnumber[2],
    //         '</span>',
    //         '</div>'
    //     ].join(" ");
        
    //     $(appendTohtml).appendTo($("#Channel_utilization2"));
    // }
    
    function initLoginUser(){
        proUserCount_oneday(1);
    }
       
    function proUserCount_oneday(mode) {    
        var dateTime = getRcText('USER_TYPE_MODE').split(',')[mode];
        var Curtime = new Date();
        var time = new Date(Curtime.getFullYear(), Curtime.getMonth(), Curtime.getDate());
        aj_getnewuser(dateTime,time,function(newuser) {
           todayClientCount(function(countuser){
             drowLoginChart(mode, newuser,countuser);
           }); 
        });
    }
    function proUserCount_week(mode) {    
        var dateTime = getRcText('USER_TYPE_MODE').split(',')[mode];
        aj_getnewuser(dateTime,"",function(newuser) {
           weekClientCount(function(countuser){
             drowLoginChart(mode, newuser,countuser);
           }); 
        });
    }
    function proUserCount_month(mode) {    
        var dateTime = getRcText('USER_TYPE_MODE').split(',')[mode];
        aj_getnewuser(dateTime,"",function(newuser) {
           monthClientCount(function(countuser){
             drowLoginChart(mode, newuser,countuser);
           }); 
        });
    }
/*切换时间*/ 
    function initEvent(){
        $("#total a.xx-link").click(function () {
            $("#total .xx-link").removeClass("active");
            var val = $(this).addClass("active").attr("value");
            if(val ==1){
               proUserCount_oneday(val); 
            }
            else if(val ==2){
                proUserCount_week(val);
            }
            else{
               proUserCount_month(val); 
            }
            
        });
        $("#oDetail").click(function(){
            Utils.Base.redirect({ np: "x_summary.clientinfo"});
        });
        
        $("#hDetail").click(function(){
            Utils.Base.redirect({ np: "x_summary.clienthist"});
        });
        
    }
//饼图初始化
    function initPieChart() {
        aj_getAccessTime(function(userlist) {
            showEchart_access(userlist);
        });
        
        aj_getOnlineTime(function(userList) {
            showEchart_time(userList);
        });
        
        // aj_getEndPointtype(function(userList) {
        //     //showEchart_phoneType(userList);
        // });
    }
    //切换设备
    function optionPush(){
        function parseQuery(location) {
            var query = location.search.replace('?', '');
            var params = query.split('&');
            var result = {};
            $.each(params, function () {
                var temp = this.split('=');
                result[temp[0]] = temp.length === 2 ? temp[1] : undefined;
            });
            return result;
        }
        /*var $panel = $('#scenes_panel'), //  下拉面板
         $trigger = $('#change_scenes_trigger'),  //  点击展开的按钮
         $btnChange = $('#switchScenesBtn'),  //  确认按钮
         $selectedScene = $('#selectedScene'),  //  场景选择下拉框
         $devSn = $('#devSn'),  //  设备管理下拉
         $devContain = $('#device-contain'),
         $contain = $('#scene-contain');  //  容器*/
        var $panel = $('#reDevSelect #scenes_panel'), //  下拉面板
            $trigger = $('#reDevSelect #change_scenes_trigger'),  //  点击展开的按钮
            $btnChange = $('#reDevSelect #switchScenesBtn'),  //  确认按钮
            $selectedScene = $('#reDevSelect #selectedScene'),  //  场景选择下拉框
            $devSn = $('#reDevSelect #devSn'),  //  设备管理下拉
            $devContain = $('#reDevSelect #device-contain'),
            $contain = $('#reDevSelect #scene-contain');  //  容器
        //  if first load,set devsn value param's devsn
        var firstLoad = true, //   是否首次加载
            locales = {
                cn: {
                    trigger: '切换设备',
                    device: '选择设备',
                    shop: '选择场所',
                    online: '在线',
                    offline: '不在线'
                },
                en: {
                    trigger: 'Switch Device',
                    device: 'Device',
                    shop: 'Shop',
                    online: 'Online',
                    offline: 'Offline'
                }
            },
            _lang = $.cookie('lang') || 'cn';

        var senceInfo = parseQuery(window.location),
            model = senceInfo.model,  // 存储model信息
            sn = senceInfo.sn,
            nasid = senceInfo.nasid,
            sceneDevList = {}, //   场景和设备的关联关系
            sceneModelObj = {}, //  场景和model的对应关系  {shopId:model}
            devInfoList = {};  //  设备信息列表  {devSN:{devInfo}}

        $('#reDevSelect #switch-text').html(locales[_lang].trigger);  //  点击展开的文本
        $('#reDevSelect #switch-shop').html(locales[_lang].shop);   //  选择场所label
        $('#reDevSelect #switch-device').html(locales[_lang].device);   //   选择设备label

        /**
         * 生成dev下拉框并设置值
         */
        function fillDevField() {
            var val = $selectedScene.val(), devs = sceneDevList[val], devHtml = [];
            $devSn.html('');
            var selectedModel = sceneModelObj[val];
            //  model是1的时候，隐藏设备选择   model是1的时候是小小贝
            //$devContain[selectedModel === 1 ? 'hide' : 'show']();
            var devSnList = [];
            $.each(devs, function (i, d) {
                devSnList.push(d.devSN);
            });

            /**
             * 获取设备在线状态   1:不在线   0:在线
             * 微服务: renwenjie
             */
            $.post('/base/getDevs', {devSN: devSnList}, function (data) {
                var statusList = JSON.parse(data).detail, devList = [];
                $.each(devs, function (i, dev) {
                    $.each(statusList, function (j, sta) {
                        if (dev.devSN === sta.devSN) {
                            dev.status = sta.status;
                            devList.push(dev);
                        }
                    });
                });
                callback(devList);
            }, 'html');

            /**
             * 拼接select下拉框的数据
             * @param devs   所有的设备信息
             */
            function callback(devs) {
                $.each(devs, function (i, dev) {
                    devHtml.push('<option value="', dev.devSN, '">',
                        dev.devName + '(' + (dev.status == 0 ? locales[_lang].online : locales[_lang].offline) + ')',
                        '</option>');
                });
                //  如果是第一次加载就现在进来的sn，如果不是第一次进页面就选择默认的
                $devSn.html(devHtml.join('')).val((devs.length && !firstLoad) ? devs[0].devSN : sn);
                firstLoad = false;
            }
        }

        /**
         * 获取场景信息
         * @param sceneDevList
         * @param devInfoList
         */
        function getSceneList(sceneDevList, devInfoList) {
            $.get("/v3/web/cas_session?refresh=" + Math.random(), function (data) {
                $.post('/v3/scenarioserver', {
                    Method: 'getdevListByUser',
                    param: {
                        userName: data.user
                    }
                }, function (data) {
                    data = JSON.parse(data);
                    if (data && data.retCode == '0') {
                        var sceneHtmlList = [];
                        var sceneObj = {};
                        $.each(data.message, function (i, s) {
                            var devInfo = {
                                devName: s.devName,
                                devSN: s.devSN,
                                url: s.redirectUrl
                            };
                            if (!sceneDevList[s.scenarioId]) {
                                sceneDevList[s.scenarioId] = [];
                            }
                            // 设备信息
                            devInfoList[s.devSN] = devInfo;
                            //  {场景ID:devList}  场景和设备的对应关系
                            sceneDevList[s.scenarioId].push(devInfo);
                            //  {场所ID:场所名称}
                            sceneObj[s.scenarioId] = s.shopName;
                            //  {场所ID:场所model}
                            sceneModelObj[s.scenarioId] = Number(s.model);
                        });
                        // 拼接select框的option
                        $.each(sceneObj, function (k, v) {
                            sceneHtmlList.push('<option value="', k, '">', v, '</option>');
                        });
                        $selectedScene.html(sceneHtmlList.join('')).val(nasid);
                        // 填充设备列表
                        fillDevField();
                    }
                }, 'html');
            });
        }

        getSceneList(sceneDevList, devInfoList);
        $trigger.off('click').on('click', function () {
            $panel.toggle();
        });

        //$btnChange.off('click').on('click', function () {
        //    $devSn.val() && location.replace(devInfoList[$devSn.val()].url.replace('oasis.h3c.com', location.hostname)+location.hash);
        //    $panel.hide();
        //});

        $devSn.off("change").on("change",function(){
            $devSn.val() && location.replace(devInfoList[$devSn.val()].url.replace('oasis.h3c.com', location.hostname)+location.hash);
            //$panel.hide();
        });

        $selectedScene.off('change').on('change', fillDevField);

        $(document).on('click', function (e) {
            var $target = $(e.target);
            if ($target != $contain && !$.contains($contain.get(0), e.target)) {
                //$panel.hide();
            }
        });
        // ==============  选择场所，end  ==============
        $panel.show();
        function getuserSession() {
            $.ajax({
                url: MyConfig.path + "/scenarioserver",
                type: "POST",
                headers: {Accept: "application/json"},
                contentType: "application/json",
                data: JSON.stringify({
                    "Method": "getdevListByUser",
                    "param": {
                        "userName": FrameInfo.g_user.attributes.name

                    }
                }),
                dataType: "json",
                timeout: 150000,
                success: function (data) {
                    var AcInfo = [];
                    if (data.retCode == 0 && data.message) {
                        var snList = [];
                        var aclist = data.message;
                        for (var i = 0; i < aclist.length; i++) {
                            if (aclist[i].shopName) {
                                AcInfo.push({
                                    shop_name: aclist[i].shopName,
                                    sn: aclist[i].devSN,
                                    placeTypeName: aclist[i].scenarioName,
                                    redirectUrl: aclist[i].redirectUrl,
                                    nasid: aclist[i].scenarioId
                                });
                                snList.push(aclist[i].devSN);
                            } else if (aclist[i].devSN) {
                                snList.push(aclist[i].devSN);
                            }
                        }

                    } else {
                        Frame.Debuger.error("[ajax] error,url=====" + MyConfig.path + "/scenarioserver");
                    }
                    getAcInfo(AcInfo);
                },
                error:function(error){
                    hPending&&hPending.close();
                    console.log(error);
                }
            });
        }

        getuserSession();

        function getAcInfo(aclist) {
            $(".toppannel #switch-text").html(getRcText("switchBtn"));
            var opShtmlTemple = "<li data_sn=vals  sel data-url=urls>palce</li>";
            var ulhtml = '<div class="select">' +
                '<p>' +
                '</p>' +
                '<ul>' +
                '</ul>' +
                '</div>';
            $("#station").append(ulhtml);
            for (var i = 0; i < aclist.length; i++) {
                if (window.location.host == "v3webtest.h3c.com") {
                    aclist[i].redirectUrl = aclist[i].redirectUrl.replace("lvzhouv3.h3c.com", "v3webtest.h3c.com");
                }
                var newHtmTemple = opShtmlTemple.replace(/vals/g, aclist[i].sn)
                    .replace(/urls/g, aclist[i].redirectUrl).replace(/palce/g, aclist[i].shop_name);
                var newHtmlTemple_1 = "";
                if (FrameInfo.ACSN == aclist[i].sn) {
                    $(".select > p").text($(newHtmTemple).text());
                } else {
                    newHtmlTemple_1 = newHtmTemple.replace(/sel/g, "");
                }
                $(".content .select ul").append(newHtmlTemple_1);

            }
            $(".select").click(function (e) {
                $(".select").toggleClass('open');
                return false;
            });

            $(".content .select ul li").on("click", function () {
                var _this = $(this);
                $(".select > p").text(_this.html());
                $.cookie("current_menu", "");
                var redirectUrl = $(this).attr("data-url");
                window.location.href = redirectUrl;
                _this.addClass("selected").siblings().removeClass("selected");
                $(".select").removeClass("open");
            });
            $(document).on('click', function () {
                $(".select").removeClass("open");
            })
        }
    }
    function _init() {
        initEvent();
        //initRegisterUser();
        initLoginUser();
        initPieChart();
        optionPush();
    }

    function _destroy() {
        Utils.Request.clearMoudleAjax(MODULE_NAME);
        hPending&&hPending.close();
    }
    function _resize() {

    }
    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["Echart", "Panel", "DateTime", "Form"],
        "utils": ["Request", "Base", "Msg"]
    });
})(jQuery);