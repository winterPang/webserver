(function ($) {
    var MODULE_BASE = "p_ad";
    var MODULE_NAME = MODULE_BASE + ".index";
    var g_type = "pv";
    var g_pv = [];
    var g_pu = [];
    var g_ctr = [];
    var g_clickCount = [];
    var g_time = [];
    var g_o = {pv:g_pv,pu:g_pu,ctr:g_ctr,clickCount:g_clickCount};

    var g_para;
    var g_tenmin = 10 * 60 * 1000;
    var g_oneHour = g_tenmin * 6;
    var g_oneDay = g_oneHour * 24;
    var g_oneMonth = g_oneDay * 30;
    var g_oneYear = g_oneDay * 365;
    var g_curdate = new Date();
    var g_predate;
    var g_timeline = [];


    var g_sStoreId = FrameInfo.Nasid ;//;405


    function getRcText(sRcName) {
        return Utils.Base.getRcString("x_adAnalysisi_rc", sRcName);
    }


    function drawAdShowCount(type,g_o) {
        data = g_o[type];
        option = {
            width: "100%",
            height: "300",
            title: false,
            tooltip: {
                trigger: 'axis',
                formatter: function (data) {
                    return getRcText(type) + ':'+data[0].value;
                }
            },
            grid: {
                show: "false"
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    splitLine: {
                        show: true,
                        textStyle: { color: '#c9c4c5', fontSize: "1px", width: 4 },
                        lineStyle: {
                            // 使用深浅的间隔色
                            color: ['#e7e7e9']
                        }
                    },
                    axisLabel:{
                        interval:0
                    },
                    axisTick:{
                        interval:0
                    },
                    data:g_timeline
                    //data: timeline ? timeline:timedefault
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    splitLine: {
                        show: true,
                        textStyle: { color: '#c9c4c5', fontSize: "1px", width: 4 },
                        lineStyle: {
                            // 使用深浅的间隔色
                            color: ['#e7e7e9']
                        }
                    },
                    axisLabel: {
                        show: true,
                        textStyle: { color: '#9da9b8', fontSize: "12px", width: 2 }
                    },
                    axisLine: {
                        show: true,
                        lineStyle: { color: '#9da9b8', width: 1 }
                    }
                }
            ],
            series: [{
                name: type,
                type: 'line',
                barCategoryGap: '40%',
                data: data,
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: 'insideTop',
                            formatter: function (data) {
                                return data.value;

                            }
                        },
                        color: '#69C4C5'
                    }
                }

            }]
        };
        var oTheme = {
            color: ['#48BEF4', '#FCE1DC']
        };
        $("#adShowCount").echart("init", option, oTheme);

    }

    // 详细信息
    function drawBasicList() {
        var opt = {
            height: "240",
            showHeader: true,
            pageSize:6,
            multiSelect: false,
            colNames: getRcText("BASIC_ITEM"),
            colModel: [
                // { name: "title", datatype: "String", width: 50 },
                { name: "pv", datatype: "String", width: 100 },
                { name: "pu", datatype: "String", width: 100 },
                { name: "clickCount", datatype: "String", width: 100 },
                { name: "ctr", datatype: "String", width: 100 },
                { name: "visitorTimeAver", datatype: "String", width: 100 },
            ]
        };
        $("#basic_slist").SList("head", opt);

    }

    // 页面受访
    function drawDetailList() {

        var opt = {
            showHeader: true,
            multiSelect: false,
            pageSize:6,
            colNames: getRcText("DETAIL_ITEM"),
            colModel: [
                { name: "url", datatype: "String", width: 300 },
                { name: "pv", datatype: "String", width: 80 },
                { name: "pu", datatype: "String", width: 80 },
                { name: "clickCount", datatype: "String", width: 80 },
                { name: "ctr", datatype: "String", width: 70 },
                { name: "stayTimeAver", datatype: "String", width: 100 }
            ]
        };
        $("#detail_slist").SList("head", opt);

    }
    function proUserMonthCountSlist() {
        var para;
        var aStartValue = $("input[name='daterangepicker_start']").val();
        var aEndValue = $("input[name='daterangepicker_end']").val();
        var aStartValuedate = new Date(aStartValue).getTime();
        var aEndValuedate = new Date(aEndValue).getTime();

        para = "&startTime="+aStartValuedate+"&endTime="+aEndValuedate;

        advertMessage(para)
    }

    function fundaMentalMonthSlist() {
        var para;
        var aStartValue = $("input[name='daterangepicker_start']").val();
        var aEndValue = $("input[name='daterangepicker_end']").val();
        var aStartValuedate = new Date(aStartValue).getTime();
        var aEndValuedate = new Date(aEndValue).getTime();

        para = "&startTime="+aStartValuedate+"&endTime="+aEndValuedate;

        fundaMental(para)
    }


    function proUserCountSlist(mode) {
        var para;
        var tenmin = 10 * 60 * 1000;
        var oneHour = tenmin * 6;
        var oneDay = oneHour * 24;
        var oneWeek = oneDay * 7;
        var oneMonth = oneDay * 30;
        var oneYear = oneDay * 365;
        var curdate = new Date();
        var predate;
        if(mode == 1){
            predate = new Date(curdate - oneDay);
            para = "&startTime="+predate.getTime()+"&endTime="+curdate.getTime();

        }
        else if(mode == 2){
            predate = new Date(curdate - oneWeek);
            para = "&startTime="+predate.getTime()+"&endTime="+curdate.getTime();
        }
        else if(mode == 3){
            predate = new Date(curdate - oneMonth);
            para = "&startTime="+predate.getTime()+"&endTime="+curdate.getTime();
        }
        else if(mode == 4){
            predate = new Date(curdate - oneYear);
            para = "&startTime="+predate.getTime()+"&endTime="+curdate.getTime();
        }

        advertMessage(para)

    }

    function fundaMentalSlist(mode) {
        var para;
        var tenmin = 10 * 60 * 1000;
        var oneHour = tenmin * 6;
        var oneDay = oneHour * 24;
        var oneWeek = oneDay * 7;
        var oneMonth = oneDay * 30;
        var oneYear = oneDay * 365;
        var curdate = new Date();
        var predate;
        if(mode == 1){
            predate = new Date(curdate - oneDay);
            para = "&startTime="+predate.getTime()+"&endTime="+curdate.getTime();

        }
        else if(mode == 2){
            predate = new Date(curdate - oneWeek);
            para = "&startTime="+predate.getTime()+"&endTime="+curdate.getTime();
        }
        else if(mode == 3){
            predate = new Date(curdate - oneMonth);
            para = "&startTime="+predate.getTime()+"&endTime="+curdate.getTime();
        }
        else if(mode == 4){
            predate = new Date(curdate - oneYear);
            para = "&startTime="+predate.getTime()+"&endTime="+curdate.getTime();
        }

        fundaMental(para)

    }

    function advertMessage(para){
        function getAdvertMessageOK(data){
            if(!data.errcode)
            {
                var detailListTempData = [];
                $.each(data.data,function(i,item){
                    var dataList = {
                        "url":data.data[i].url,
                        "pv":data.data[i].pv,
                        "pu":data.data[i].pu,
                        "clickCount":data.data[i].clickCount,
                        "ctr":data.data[i].ctr,
                        "stayTimeAver":"--"
                    }

                    detailListTempData.push(dataList);
                });

                $("#detail_slist").SList("refresh", detailListTempData);
            }
            else{
            }
        }

        function getAdvertMessageFail(err){
            console.log(err);
        }
        var getAdvertMessage = {
            type:"GET",
            url:MyConfig.v2path + "/advertisement/query"+"?ownerName=" + FrameInfo.g_user.user + "&storeId=" + g_sStoreId  + "&startRowIndex=0&maxItems=50" + para,
            contentType:"application/json",
            dataType:"json",
            onSuccess:getAdvertMessageOK,
            onFailed:getAdvertMessageFail
        };

        Utils.Request.sendRequest(getAdvertMessage);
    }

    function fundaMental(para){
        function getfundaMentalOK(data){
            if(!data.errcode)
            {
                var basicListTempData = [];
                var basicData = {
                            "pv":data.data.pv,
                            "pu":data.data.pu,
                            "clickCount":data.data.clickCount,
                            "ctr":data.data.ctr,
                            "visitorTimeAver":"--"
                        };
                basicListTempData.push(basicData);
                $("#basic_slist").SList("refresh", basicListTempData);
            }
            else{
            }
        }

        function getfundaMentalFail(err){
            console.log(err);
        }
        var getfundaMental = {
            type:"GET",
            url:MyConfig.v2path + "/advertisement/querySpanTotal"+"?ownerName=" + FrameInfo.g_user.user + "&storeId=" + g_sStoreId + para,
            contentType:"application/json",
            dataType:"json",
            onSuccess:getfundaMentalOK,
            onFailed:getfundaMentalFail
        };
        Utils.Request.sendRequest(getfundaMental);
    }

    function drowLoginChart(mode, newUserList){
        var type = g_type;
        var newlength = newUserList.length;
        var count = newlength;
        var atime = [];
        for (var i = (count - 1); i>=0; i--) {
            if (i >= newlength){
                g_pv.push(0);
                g_pu.push(0);
                g_ctr.push(0);
                g_clickCount.push(0);
                g_time.push(0);
            }else{
                g_pv.push(newUserList[count-1-i].pv);
                g_pu.push(newUserList[count-1-i].pu);
                g_ctr.push(newUserList[count-1-i].ctr);
                g_clickCount.push(newUserList[count-1-i].clickCount);
                g_time.push(newUserList[count-1-i].endTime)
            }
        }
        for (var j = 0 ; j < newlength ; j++){
            if (mode == 1){
                atime.push( new Date (g_time[j]).getHours() + ":" + "00");
            }
            else if(mode == 4 || mode == ""){
                atime.push( new Date (g_time[j]).getFullYear() + "-" + (new Date (g_time[j]).getMonth() + 1 )  );
            }
            else{
                atime.push( new Date (g_time[j]).getMonth() + 1 + "-" + new Date (g_time[j]).getDate()  );
            }
        }
        g_timeline = atime;
        drawAdShowCount(type,g_o);
    }

    function aj_getnewuser(para,callback) {
        var ajax = {
            url:MyConfig.v2path+"/advertisement/queryBySpan"+"?ownerName=" + FrameInfo.g_user.user+ "&storeId=" + g_sStoreId  +"&devSN=" + FrameInfo.ACSN + para,
            type: "GET",
            dataType: "json",
            contentType: "application/json",
            //onSuccess: drawAdShowCount,
            onSuccess: function (data) {
                try {
                    if(!('errorcode' in data && 'data' in data)){
                        throw (new Error("data.errorcode"));
                    }

                    if (data.errorcode == 0) {
                        callback(data.data);
                    }
                }
                catch(error){
                    console.log(error);
                }
            },
            onFailed:function(err){
                console.log(err);
            }
        }

        Utils.Request.sendRequest(ajax);
    }
    function aj_getnewuserMonth(para,callback) {
        var ajax = {
            url:MyConfig.v2path+"/advertisement/queryByMonthSpan"+"?ownerName=" + FrameInfo.g_user.user+ "&storeId=" + g_sStoreId   + para,
            type: "GET",
            dataType: "json",
            contentType: "application/json",
            //onSuccess:drowLoginChart,
            onSuccess: function (data) {
                try {
                    if(!('errorcode' in data && 'data' in data)){
                        throw (new Error("data.errorcode"));
                    }

                    if (data.errorcode == 0) {
                        callback(data.data);
                    }
                }
                catch(error){
                    console.log(error);
                }
            },
            onFailed:function(err){
                console.log(err);
            }
        }

        Utils.Request.sendRequest(ajax);
    }

    function proUserMonthCount() {
        var para;
        var mode = "";
        var aStartValue = $("input[name='daterangepicker_start']").val();
        var aEndValue = $("input[name='daterangepicker_end']").val();
        var aStartValuedate = new Date(aStartValue).getTime();
        var aEndValuedate = new Date(aEndValue).getTime();
        g_pv = [];
        g_pu = [];
        g_ctr = [];
        g_clickCount = [];
        g_time = [];
        g_o = {pv:g_pv,pu:g_pu,ctr:g_ctr,clickCount:g_clickCount};
            para = "&startTime="+aStartValuedate+"&endTime="+aEndValuedate;
        aj_getnewuserMonth(para,function(newuser){
            drowLoginChart(mode, newuser);
        });
    }

    function proUserCount(mode) {
        var para;
        var tenmin = 10 * 60 * 1000;
        var oneHour = tenmin * 6;
        var oneDay = oneHour * 24;
        var oneWeek = oneDay * 7;
        var oneMonth = oneDay * 30;
        var oneYear = oneDay * 365;
        var curdate = new Date(new Date().toLocaleDateString());
        var predate;
        g_pv = [];
        g_pu = [];
        g_ctr = [];
        g_clickCount = [];
        g_time = [];
        g_o = {pv:g_pv,pu:g_pu,ctr:g_ctr,clickCount:g_clickCount};
        if(mode == 1){
            predate = new Date(curdate - oneDay);
            para = "&span=3600000"+"&startTime="+predate.getTime()+"&endTime="+curdate.getTime();

            aj_getnewuser(para,function(newuser){
                drowLoginChart(mode, newuser);
            });
        }
        else if(mode == 2){
            predate = new Date(curdate - oneWeek);
            para =  "&span=86400000"+"&startTime="+(predate.getTime() -1000)+"&endTime="+(curdate.getTime() - 1000);
            aj_getnewuser(para,function(newuser){
                drowLoginChart(mode, newuser);
            });
        }
        else if(mode == 3){
            predate = new Date(curdate - oneMonth);
            para = "&span=86400000"+"&startTime="+(predate.getTime() -1000)+"&endTime="+(curdate.getTime() -1000);
            aj_getnewuser(para,function(newuser){
                drowLoginChart(mode, newuser);
            });
        }
        else if(mode == 4){
            var date = new Date();
            var nextMonthDay=new Date(date.getFullYear(),date.getMonth(),1);
            predate = new Date(nextMonthDay - oneYear);
            var MonthDay=new Date(predate.getFullYear(),predate.getMonth(),1);
            para = "&startTime="+(MonthDay.getTime() -1000)+"&endTime="+(nextMonthDay.getTime() -1000);
            aj_getnewuserMonth(para,function(newuser){
                drowLoginChart(mode, newuser);
            });
        }
    }

    function initLoginUser(){
        proUserCount(1);
        fundaMentalSlist(1);
        proUserCountSlist(1);

    }

    function initForm() {
        var type = g_type;
        var thisId = type;
        //var thisType = "today";
        $("input[name='advert-info']").on("click", function () {
            var self = $(this);
            g_type = self.attr("id");
            thisId = self.attr("id");
            console.log(thisId);
            drawAdShowCount(thisId,g_o);
        });

        $("#total a.time-link").click(function () {
            $("#total a.time-link").removeClass("active");
            var val = $(this).addClass("active").attr("value");
            proUserCount(val);
            fundaMentalSlist(val);
            proUserCountSlist(val);
        });

        $(".applyBtn").click(function(){
            $("#total a.time-link").removeClass("active");
            proUserMonthCount();
            fundaMentalMonthSlist();
            proUserMonthCountSlist();
        });
    }

    function initGrid() {
        drawBasicList();
        drawDetailList();
    }

    function _init() {
        initGrid();
        initForm();
        initLoginUser();
    }
    function _resize(jParent) {
    }

    function _destroy() {
        g_timeline = [];

    }
    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["Echart", "Minput", "SList","DateTime","DateRange"],
        "utils": ["Base", "Device","Request"]

    });

})(jQuery);