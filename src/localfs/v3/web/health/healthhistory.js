;(function ($) {
    var MODULE_BASE = "health";
    var MODULE_NAME = MODULE_BASE + ".healthhistory";
    var NewData = {};
    //var cloudUrl = "http://h3crd-lvzhou6.chinacloudapp.cn/v3";
    //var weeklist  = ["周一","周二","周三","周四","周五","周六","周日"];//["周日","周六","周五","周四","周三","周二","周一"];
    var monthlist = ["近四周","近三周","近二周","近一周"];
    var yearlist  = ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];

    var g_hTime = false, g_nDateSelect = 0;

    function getTimeList(mode){
        var now = new Date();
        var resultlist = new Array();
        if (mode == 1){
            //var startindex = myDate.getDay();
            //for (var i = startindex; i<(startindex + 7); i++){
            //    var curindex = i % 7;
            //    resultlist.push(weeklist[curindex]);
            //}
            for (var i = 6; i >= 0; i--) {
                var myDate = new Date(now.getTime() - i * 24 * 3600 * 1000);
                var date = myDate.getDate();
                var month = myDate.getMonth()+1;
                resultlist.push(month + "月" + date + "日");
            }
        }else {
            var startindex = now.getMonth() + 12;
            for (var i = (startindex - 6); i< startindex; i++){
                var curindex = i % 12;
                resultlist.push(yearlist[curindex]);
            }
        }

        return resultlist;
    }

    function drawHistoryChange(index){
        if (index == 0){

            getHistoryChange(1, function(result){

                var weekdata = {h_title: "近一周小贝健康状况",
                    h_time: 0, h_score:[0,0,0,0,0,0,0]};

                if ((result != "") && (result.length != 0)){
                    var timelist = getTimeList(1);
                    var scorelist = new Array();
                    for (var i = (result.length - 1); i >= 0; i--){
                        scorelist.push(result[i].finalscore);
                    }
                    weekdata.h_time = timelist;
                    weekdata.h_score = scorelist;
                }

                g_nDateSelect = 0;
                drawHistoryChart(weekdata);
            });
        }

        if (index == 1){
            getHistoryChange(2, function(result){

                var monthdata = {h_title: "近一个月小贝健康状况",
                    h_time: monthlist, h_score:[0,0,0,0]};

                if ((result != "") && (result.length != 0)){
                    var timelist = monthlist;
                    var scorelist = new Array();
                    for (var i = (result.length - 1); i >= 0; i--){
                        scorelist.push(result[i].finalscore);
                    }
                    monthdata.h_time = timelist;
                    monthdata.h_score = scorelist;
                }

                g_nDateSelect = 1;
                drawHistoryChart(monthdata);
            });
        }
        if (index == 2){
            getHistoryChange(3, function(result){

                var yeardata = {h_title: "近半年小贝健康状况",
                    h_time:yearlist, h_score:[0,0,0,0,0,0]};

                if ((result != "") && (result.length != 0)){
                    var timelist = getTimeList(3);
                    var scorelist = new Array();
                    for (var i = (result.length - 1); i >= 0; i--){
                        scorelist.push(result[i].finalscore);
                    }
                    yeardata.h_time = timelist;
                    yeardata.h_score = scorelist;
                }

                g_nDateSelect = 2;
                drawHistoryChart(yeardata);
            });
        }
    }
    function getHistoryData(para, callback){

        var changeOpt = {
            url:MyConfig.path+'/health/home/history/change',
            type:'GET',
            dataType:'json',
            timeout: 5000,
            data: para,
            onSuccess:getChangeSuc,
            onFailed:getChangeFail
        };

            Utils.Request.sendRequest(changeOpt);

        /*获取数据成功的回调*/
        function getChangeSuc(data){

            var result = $.parseJSON(data);
            err = 0;
            callback(result,err);
        }

        /*获取数据失败的回调*/
        function getChangeFail(status){

            if (status.statusText == "timeout")
            {
                err = 1;
                callback("",err);
            }
        }
    }

    function getHistoryChange(mode, callback){

        var para = {'acSN':FrameInfo.ACSN, 'mode':mode};
        getHistoryData(para, function(result, err){

            if(err == 0){
                callback(result);
            }else{
                callback("");
            }
        });
    }

    function drawHistoryChart(newdata){

        setChartHeight();

        var scoreChart = echarts.init(document.getElementById("datacontent"));
        scoreChart.clear();
        var option = {
            title : {
                show:false,
                text: newdata.h_title,
                textStyle: {
                    fontSize: 13,
                    fontWeight: 'normal',
                    fontFamily: 'arial'
                }
            },
            grid: {
                y :'15',
                y2 :'25',
                x :'28',
                x2 :'35'
            },
            tooltip: {
                trigger: 'axis'
            },
            type: 'macarons',
            legend: {
                data:['综合健康度'],
                x :'right',
                show :false
            },
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : newdata.h_time,//['周一','周二','周三','周四','周五','周六','周日']
                    axisTick : false,
                    axisLabel : {
                        textStyle : {
                            color : '#617085', fontSize:"12px", width:2
                        }
                    },
                    axisLine : {
                        show : false
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    min : 0,
                    max : 100,
                    splitNumber: 5,
                    axisLabel : {
                        formatter: '{value}',
                        textStyle:{
                            color: '#617085', fontSize:"12px", width:2
                        }
                    },
                    axisLine : {
                        show : false
                    }
                }
            ],
            series : [
                {
                    name : '综合健康度',
                    type : 'line',
                    smooth : true,
                    data : newdata.h_score,
                    //data : [20, 54, 21, 45, 48, 30, 17],
                    itemStyle : {
                        normal : {
                            //lineStyle : {
                            //    //color : '#4ec1b2',
                            //    //width : 3
                            //},
                            areaStyle : {
                                type: 'default'
                            }
                            //borderColor : '#4ec1b2',
                            //borderWidth : 2
                        }
                    },
                    markLine : {
                        precision : '1',
                        data : [
                            {type : 'average', name : '平均分'}
                        ],
                        itemStyle : {
                            normal : {
                                lineStyle : {
                                    color : '#ff7f50'
                                },
                                label:{
                                    textStyle:{
                                        color:'#ff7f50'
                                    }
                                },
                                borderColor : '#ff7f50'
                            }

                        }
                    }

                }
            ]
        };
        var oTheme = {
            color: ['#4ec1b2']
        };
        // 为echarts对象加载数据
        scoreChart.setOption(option);
        scoreChart.setTheme(oTheme);
    }
    $("#history_week").click(function(){
        drawHistoryChange(0);
    });
    $("#history_month").click(function(){
        drawHistoryChange(1);
    });
    $("#history_halfyear").click(function(){
        drawHistoryChange(2);
    });


    /*历史诊断记录,网络体检部分*/
    /*历史诊断中日历的生成*/
	function initCalendar(){

        $('#calendar').fullcalendar("init",{
            monthNames: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
            monthNamesShort:["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
            dayNames: ["日", "一", "二", "三", "四", "五", "六"],
            dayNamesShort: ["日", "一", "二", "三", "四", "五", "六"],
            monthYearFormat: 'YYYY年MMMM',
            buttonText:{
                showMonthAfterYear:true
            },
            eventLimit:false,
            events:function(start, end, timezone, callback) {
                var sDate  = start.format();
                var eDate = end.format();

                var  timeFlowOpt = {
                    url:MyConfig.path +'/diagnosis_read/web/time?devSN='+FrameInfo.ACSN,
                    type:'get',
                    dataType:'json',
                    timeout:5000,
                    onSuccess:getTimeFlowSuc,
                    onFailed:getTimeFlowFail
                };

                Utils.Request.sendRequest(timeFlowOpt);


                var calendarFlowOpt = {
                    url:MyConfig.path +'/diagnosis_read/web/calendar?devSN='+FrameInfo.ACSN,
                    type:'post',
                    dataType:'json',
                    data:{
                        startDate:sDate,
                        endDate:eDate
                    },
                    onSuccess:getCalendarFlowSuc,
                    onFailed:getCalendarFlowFail
                };

                   Utils.Request.sendRequest(calendarFlowOpt);

                 /*获取日历中数据成功的回调*/
                 function getCalendarFlowSuc(data){
                     var aevent = [];
                     var checkData = [];
                     var depCheckData = [];
                     var i;
                     var check = data.cdcode;
                     var avgscore = data.avgscore;
                     var score = data.healthcode;
                     var depcheck = data.apcode;

                     if(check.length > 0) {
                         for (var j = 0; j < check.length; j++) {
                             checkData[j] = {};
                             checkData[j].date = check[j].date;
                             if ( avgscore.length > 0) {
                                 for (var k = 0; k < avgscore.length; k++) {
                                     if (check[j].date == avgscore[k].date) {
                                         if( avgscore[k].avgscore.length != 0 ) {
                                             checkData[j].Score = avgscore[k].avgscore[0].finalscore;
                                             break;
                                         }
                                         else
                                         {
                                             for( var m = 0; m < score.length; m++){
                                                 if( check[j].date == score[m].date){
                                                     checkData[j].Score = score[m].finalscore;
                                                     break;
                                                 }
                                             }
                                         }
                                         break;
                                     }
                                 }
                             }
                             else{
                                 for(var n = 0; n < score.length; n++){
                                     if( check[j].date == score[n].date){
                                         checkData[j].Score = score[n].finalscore;
                                         break;
                                     }
                                 }
                             }
                         }
                     }

                     if( (depcheck.length > 0) ){
                         for (var g = 0; g < depcheck.length; g++) {
                             depCheckData[g] = {};
                             if (depcheck[g].date != "") {
                                 depCheckData[g].date = depcheck[g].date || "";
                             }
                         }
                     }

                     if( checkData.length >0) {
                         for (i = 0; i < checkData.length; i++) {
                             aevent[i] = {};
                             aevent[i].title = '云巡检(' + checkData[i].Score + ')';
                             aevent[i].start = checkData[i].date;
                             aevent[i].color = (checkData[i].Score > 80) ? '#4ec1b2' : ((checkData[i].Score > 60) ? '#fbceb1' : '#fe808b');
                         }
                     }

                     if(depCheckData.length > 0 ) {
                         for (var t = 0; t < depCheckData.length; t++, i++) {
                             aevent[i] = {};
                             aevent[i].title = '深度体检';
                             aevent[i].start = depCheckData[t].date;
                             aevent[i].color =  '#fe808b';
                         }
                     }

                     callback(aevent);
                 }

                /*获取日历中数据失败的回调*/
                function getCalendarFlowFail(){

                }
            },
			
            eventClick: function(seg, view) {
                var dep_jContent = $("#dep_jContent");
                var jContent = $("#jContent");
                var currentTitle;
                var sclone = jContent.clone();
                var sclone_dep = dep_jContent.clone();

                onEventChange.call(seg.event);
                currentTitle = NewData.eventtitle;

                if(currentTitle == "深度体检")
                {
                    $(".fc-day-grid").append(sclone_dep.show());

                }
                else
                {
                    $(".fc-day-grid").append(sclone.show());
                }

                var nWidth = $($(".fc-day.fc-widget-content")[0]).width();
                var nHeight = seg.row * $($(".fc-day.fc-widget-content")[0]).height()+ 9 +
                    $(".fc-head").height() + (seg.row+1)*2 + this.offsetHeight*(seg.level+1);
                sclone_dep.css({
                    "top":nHeight,
                    "left":(seg.leftCol + 1)*(nWidth+2)+2
                });
                sclone.css({
                    "top":nHeight,
                    "left":(seg.leftCol + 1)*(nWidth+2)+2
                });
                $(document).on('mouseup', function(e) {
                    if(!$(e.target).closest(".fc-more-popover").length) {
                        sclone_dep.remove();
                    }
                });
                $(document).on('mouseup',function(e){
                    if(!$(e.target).closest(".fc-more-popover").length) {
                        sclone.remove();
                    }
                });


                judgedownloadFile(function (fileName){
                    $("#dep_download").on("click",function(){
                        document.getElementById("dep_download").href = "/v3/jag/maintenance/upload?filename=" + fileName +".tar.gz";
                    });
                });

                $("#report").on("click",function(){
                    var currentDate = NewData.time;
                    Utils.Base.openDlg("health.checkreport",currentDate,{className:'modal-super'});
                });

                $("#dep_report").on("click",function(){
                    var currentDate = NewData.time;
                    Utils.Base.openDlg("health.depcheckreport",currentDate,{className:'modal-super'});
                });

                $("#delete").on("click",function(){
                    var currentDate = NewData.time;
                    var date = (new Date()).toLocaleDateString();
                    var year = date.split('/')[0];
                    var month = date.split('/')[1];
                    var day = date.split('/')[2];
                    if( month < 10){
                        month = "0" + month;
                    }

                    if( day < 10){
                        day = "0" + day;
                    }
                    var currentDate2 = year + "-" + month + "-" + day;

                    if( currentDate == currentDate2){
                        Frame.Msg.confirm("当天云巡检时间定时上报，删除后将会上报新数据，确定删除？",function()
                        {
                              deleteCheckData();
                        });
                    }else {
                        Frame.Msg.confirm("确定删除？删除后将无法恢复",function()
                        {
                            deleteCheckData();
                        });
                    }
                });

                $("#dep_delete").on("click",function(){
                    Frame.Msg.confirm("确定删除？删除后将无法恢复",function()
                    {
                        deleteDepCheckData();
                    });
                });
            }
        });
        $(".fc-right .fc-today-button",$('#calendar')).hide();

        /*获取最近云巡检时间成功的回调*/
        function getTimeFlowSuc(data){
            if( data != undefined) {
                if( (data.cloudTime != undefined) && (data.deepTime != undefined) && (data.score != undefined)) {
                    var time = data.cloudTime;
                    var deeptime = data.deepTime;
                    $("#DeviceType").text(time);
                    $("#FirmwareRev").text(deeptime);
                    var color = (data.score > 80) ? '#4ec1b2' : ((data.score > 60) ? '#fbceb1' : '#fe808b');
                    $("#SerialNumber").text(data.score).css('color', color);
                }
            }
        }

        /*获取最近云巡检时间失败的回调*/
        function getTimeFlowFail(status){

            if( status.statusText == 'timeout'){
                Frame.Msg.error("数据获取异常，请联系客服");
            }
        }
    }
	
	/*获取日历中当前所点击的某天的标题和日期*/
	function onEventChange()
    {
        NewData.eventtitle = this.title;
        NewData.time = (this.start._i);
        NewData.id = this._id;
    }
	
	/*判断confmgr模块是否有下载的文件*/
	function judgedownloadFile(callback){

        var fileOpt = {
            url:MyConfig.path +"/ant/confmgr",
            type:'post',
            dataType:'json',
            data:{
                configType : 1,
                cloudModule : "maintain",
                method : "getFileName",
                devSN :FrameInfo.ACSN,
                param:{
                    date:NewData.time,
                    devSN:FrameInfo.ACSN
                }
            },
            onSuccess:getFileNameSuc,
            onFailed:getFileNameFail
        };

            Utils.Request.sendRequest(fileOpt);

        /*获取诊断信息文件成功的回调*/
        function getFileNameSuc(data){
            try {
                if (data.result.length != 0) {
                    var fileName = data.result[0].fileName;
                    $("#dep_download").removeClass('gray');
                    callback(fileName);
                }
            }catch(exception){

            }
        }

        /*获取诊断信息文件失败的回调*/
        function getFileNameFail(){

        }
    }

    /*历史诊断日历中的按钮相关操作*/
    function initForm()
    {
        getDevApList();
        $(window).bind("resize",windowsResize);
        $("#history_week").click(function(){
            drawHistoryChange(0);
        });
        $("#history_month").click(function(){
            drawHistoryChange(1);
        });
        $("#history_halfyear").click(function(){
            drawHistoryChange(2);
        });
        $("#DeviceType").on("click",function(){
            var date = $("#DeviceType").html();
            date = date.split(' ')[0];
            Utils.Base.openDlg("health.checkreport",date,{className:"modal-super"});
        });
        $("#FirmwareRev").on("click",function(){
            var date = $("#FirmwareRev").html();
            date = date.split(' ')[0];
            Utils.Base.openDlg("health.depcheckreport",date,{className:"modal-super"});
        })
    }

    /*获取设备上的AP列表*/
    function getDevApList(){
        var surl = MyConfig.path +"/apmonitor/web/aplist?devSN=" + FrameInfo.ACSN ;

        var aplistFlowOpt = {
            url:surl,
            dataType:"json",
            timeout:5000,
            type:"GET",
            onSuccess:getAplistSuc,
            onFailed:getAplistFail
        };

           Utils.Request.sendRequest(aplistFlowOpt);

        /*获取Aplist成功的回调*/
        function getAplistSuc(apResult){

            judgeApExist(apResult);

        }

        /*获取Aplist失败的回调*/
        function getAplistFail(status){
	
            if( status.statusText == 'timeout'){
                $("#HardwareRev2").on('click',function() {

                    Frame.Msg.error("无法获取AP状态，请联系客服");

                })
            }
        }
    }

    /*判断AP是否在线,不在线则不能进行深度体检*/
    function judgeApExist(apResult) {
        var num = 0;
        var radioNum = 0;
        if (apResult.apList.length != 0) {
            for (var i = 0; i < apResult.apList.length; ++i) {
                if (apResult.apList[i].status == 1) {
                    //ap在线
                    num += 1;   //num == 0时说明无ap在线，不需要深度体检；num > 0时说明至少有一个ap在线，可以进行深度体检　
                }
                var radioList = apResult.apList[i].radioList;
                if( radioList.length != 0){
                    for(var j = 0; j < radioList.length;j++){
                        if( radioList[j].radioStatus == 1){
                            radioNum++;
                        }
                    }
                }
            }
        }
        /*
         开始深度体检
        */
        $("#HardwareRev2").on("click",function(){

           if( num == 0) {

                Frame.Msg.alert("当前无在线AP,不能进行深度体检");

            }
           else
           {
              if( radioNum == 0){

                  Frame.Msg.alert("当前Radio没有使能，请检查配置");

              }
              else {

                  var statusFlowOpt = {
                      url: MyConfig.path +'/diagnosis_read/web/status?devSN=' + FrameInfo.ACSN,
                      type: 'get',
                      dataType: 'json',
                      timeout: 5000,
                      onSuccess:getStatusSuc,
                      onFailed:getStatusFail
                  };

                      Utils.Request.sendRequest(statusFlowOpt);

                  /*成功的回调*/
                  function  getStatusSuc(data){
                      if (data == 0) {
                          Frame.Msg.confirm("开始深度体检？可能耗时较长，大约2-3分钟，请耐心等待" +
                              "<div style='margin-top:30px'>" +
                              "<input type='checkbox' id='fileUpload' style='width:20px;height:20px;'>" + "</input>" +
                              "<span style='padding-left:10px;font-size:12px;'>" + "收集诊断信息,耗时大约20-30分钟，且占用设备CPU较多" + "</span>" +
                              "</div>", function () {
                              if (document.getElementById('fileUpload').checked == true) {

                                  document.getElementById('fileUpload').checked = false;
                                  file_upload();

                              }
                              $("#HardwareRev2").addClass('hide');
                              $("#HardwareRev3").removeClass('hide');
                              deepcheck();
                          });
                          document.getElementById('fileUpload').checked = false;
                      }
                      else if (data == 1) {

                          Frame.Msg.alert("正在深度体检中,请等待深度体检结束后再次进行深度体检");

                      }
                  }

                  /*失败的回调*/
                  function getStatusFail(status){
		  
                      if (status.statusText == 'timeout') {
                          Frame.Msg.error("数据获取异常，请联系客服");
                      }
                  }
              }
            }
        });
    }

    /*上传诊断信息文件*/
    function file_upload(){
        var surl = MyConfig.path +"/ant/confmgr";
        var mydate = new Date();
        var year = mydate.getFullYear();
        var mon = mydate.getMonth() + 1;
        var date = mydate.getDate();
        var hour = mydate.getHours();
        var min = mydate.getMinutes();
        var sec = mydate.getSeconds();

        if( mon < 10){
            mon = "0" +mon;
        }

        if( date < 10){
            date = "0" + date;
        }

        if( hour < 10){
            hour = "0" +hour;
        }

        if( min < 10){
            min = "0" + min;
        }

        if( sec < 10){
            sec = "0" +sec;
        }

        var fileuploadOpt = {
            url:surl,
            dataType:"json",
            type:"post",
            data:{
                configType:0,
                devSN:FrameInfo.ACSN,
                cloudModule:"maintain",
                deviceModule:"maintain",
                filename: 'diagnosicInfoFile'+year+mon+date + '-' + hour + min+sec,
                url:'https://lvzhouv3.h3c.com/v3/jag/maintenance',
                method:"diagnosicInfoFile"
            },
            onSuccess:sendfileSuc,
            onFailed:sendfileFail
        };

           Utils.Request.sendRequest(fileuploadOpt);

        /*上传诊断信息文件成功的回调*/
        function sendfileSuc(){

        }

       /*上传诊断信息文件失败的回调*/
        function sendfileFail(){

        }
    }

    /*点击深度体检进行深度体检,下配置，生成报告，上传并保存*/
    function deepcheck(){

        var cfgOpt = {
            url: MyConfig.path +"/ant/confmgr",
            dataType: "json",
            type: "post",
            timeout:5000,
            data: {
                configType: 0,
                devSN: FrameInfo.ACSN,
                cloudModule: "maintain",
                deviceModule: "wsa",
                method: "specturmAnalysis"
            },
            onSuccess:cfgFlowSuc,
            onFailed:cfgFlowFail
        };

           Utils.Request.sendRequest(cfgOpt);

        /*下发配置成功的回调*/
        function cfgFlowSuc(data){
            try{
                if( data.communicateResult == "fail"){

                    Frame.Msg.alert("设备连接异常，请检查设备与云端的连接状态");
                    $("#HardwareRev2").removeClass('hide');
                    $("#HardwareRev3").addClass('hide');

                }
                else
                {
                    if( data.serviceResult.results.results[0].devResult == "notsupport"){

                        Frame.Msg.alert("当前在线AP都不支持频谱分析，无法进行深度体检");
                        $("#HardwareRev2").removeClass('hide');
                        $("#HardwareRev3").addClass('hide');

                    }
                    else if( data.communicateResult == "success"){

                        existReport();

                    }
                }
            }catch(exception){

            }
        }

        /*下发配置失败的回调*/
        function cfgFlowFail(status){
            if( status.statusText == 'timeout') {
                Frame.Msg.error("设备连接异常");
                $("#HardwareRev2").removeClass('hide');
                $("#HardwareRev3").addClass('hide');
            }
        }
    }

    /*查询深度体检报告是否生成*/
    function existReport(){
        var date = (new Date()).toLocaleDateString();
        var year = date.split('/')[0];
        var month = date.split('/')[1];
        var day = date.split('/')[2];

        if(month < 10){
        month = "0"+ month;
        }
        if(day < 10){
        day = "0" + day;
        }
        var currentDate = year + "-" + month + "-" + day;

       var existreportFlowOpt = {
           url:MyConfig.path +'/diagnosis_read/web/existreport?devSN='+FrameInfo.ACSN,
           type:'post',
           dataType:'json',
           data:{
               date:currentDate,
               num:0
           },
           onSuccess:getExistreportFlowSuc,
           onFalied:getExistreportFlowFail
       };

           Utils.Request.sendRequest(existreportFlowOpt);


        /*成功回调*/
        function getExistreportFlowSuc(data){

            judgeDeepCheck(currentDate,data.unclick);

        }

        /*失败回调*/
        function  getExistreportFlowFail(){

            $("#HardwareRev2").removeClass('hide');
            $("#HardwareRev3").addClass('hide');
            Frame.Msg.error("深度体检失败，请检查设备与云端的连接状态");
        }
    }


    /*深度体检每隔20秒就去获取报告，查看是否深度体检成功*/
    function judgeDeepCheck(currentDate,unclick){
        var timeout = 0;
        var num = 1;
        var interval = setInterval(function () {

            var existreportFlowOpt = {
                url:MyConfig.path +'/diagnosis_read/web/existreport?devSN='+FrameInfo.ACSN,
                type:'post',
                dataType:'json',
                data:{
                    date:currentDate,
                    num:num
                },
                onSuccess:getExistReportSuc,
                onFailed:getExistreportFail
            };

                Utils.Request.sendRequest(existreportFlowOpt);

            /*成功获取数据回调*/
            function getExistReportSuc(data){
                if(data.click > 0){
                    clearInterval(interval);
                    $("#HardwareRev2").removeClass('hide');
                    $("#HardwareRev3").addClass('hide');
                    refreshDeepTime();
                    Frame.Msg.info("深度体检成功");
                    if(unclick  == 0){
                        addCurrentDate();
                    }
                    rrmreportData();
                    addLog_success();
                }else{
                    timeout++;
                    num ++;
                }
                if(timeout > 9){
                    clearInterval(interval);
                    $("#HardwareRev2").removeClass('hide');
                    $("#HardwareRev3").addClass('hide');
                    Frame.Msg.error("深度体检失败,请检查设备与云端的连接状态");
                    addLog_fail();
                }
            }

            /*获取数据失败的回调*/
            function getExistreportFail(){
                clearInterval(interval);
                $("#HardwareRev2").removeClass('hide');
                $("#HardwareRev3").addClass('hide');
                Frame.Msg.error("深度体检失败,请检查设备与云端的连接状态");
                addLog_fail();
            }
        },20000);
    }

    /*体检结束后，让后台获取rrmserver数据*/
    function rrmreportData(){

        var flowOpt = {
            url:MyConfig.path +"/diagnosis_read/web/report?devSN="+FrameInfo.ACSN,
            type:'get',
            dataType:'json',
            onSuccess:sendFlowSuc,
            onFailed:sendFlowFailed
        };

           Utils.Request.sendRequest(flowOpt);
    }

    /*体检结束后，让后台获取rrmserver数据,前端提示相对应的内容,成功的回调*/
    function sendFlowSuc(data){

        var waitTime = data.rrmreport.WaitTime;

        if( waitTime != undefined){

            Frame.Msg.alert("频谱分析已经结束，正在计算上报调整信道、功率及调整建议，耗时较长,可去历史记录中查看");
        }
    }

    /*体检结束后，让后台获取rrmserver数据,失败的回调*/
    function sendFlowFailed(){

    }

    /*点击深度体检，将当前日期渲染到日历中*/
    function addCurrentDate(){
        var date = (new Date()).toLocaleDateString();
        var time = date.split('/');
        var year = time[0];
        var month = time[1];
        var day = time[2];
        if(month <10){
          month = "0" + month;
        }
        if(day <10){
          day = "0" + day;
        }
        var date2 = year + "-" + month + "-" + day;
        var obj = [{
            title:"深度体检",
            start:date2,
            color:"#fe808b"
        }];
        var ooo = {};
        ooo["events"] = obj;
        $('#calendar').fullCalendar('addEventSource',ooo);
    }

    /*将日历体检报告中深度体检的时间重新刷下*/
    function refreshDeepTime(){

        var timeFlowOpt = {
            url:MyConfig.path +'/diagnosis_read/web/time?devSN='+FrameInfo.ACSN,
            type:'get',
            dataType:'json',
            onSuccess:refreshDeepTimeFlowSuc,
            onFailed:refreshDeepTimeFlowFail
        };

            Utils.Request.sendRequest(timeFlowOpt);
    }

    /*刷新最近深度体检时间成功的回调*/
    function refreshDeepTimeFlowSuc(data){

        if(data != undefined){
            if( data.deepTime != undefined ){
                var deepTime = data.deepTime;
                $("#FirmwareRev").text(deepTime);
            }
        }
    }

    /*刷新最近深度体检时间失败的回调*/
    function refreshDeepTimeFlowFail(){

    }

    /*删除云巡检当前的日期数据*/
    function deleteCheckData(){
        var currentDate = NewData.time;
        var id = NewData.id;

        var deleteCheckFlowOpt = {
            url:MyConfig.path +'/diagnosis_read/web/delete?devSN='+FrameInfo.ACSN,
            type:'post',
            dataType:'json',
            data:{
                date:currentDate
            },
            onSuccess:deleteCheckFlowSuc,
            onFailed:deleteCheckFlowFail
        };

            Utils.Request.sendRequest(deleteCheckFlowOpt);

        /*成功删除云巡检日期的回调*/
        function deleteCheckFlowSuc(){

            $("#calendar").fullCalendar("removeEvents",id);
            Frame.Msg.info("删除成功!");
            $("#jContent").hide();
            refreshTime();
        }

        /*删除云巡检日期失败的回调*/
        function deleteCheckFlowFail(){

        }
    }


    /*删除日历中云巡检的日期,刷新最近云巡检的时间和分数*/
    function  refreshTime(){

        var checkFlowOpt = {
            url:MyConfig.path +'/diagnosis_read/web/time?devSN='+FrameInfo.ACSN,
            type:'get',
            dataType:'json',
            onSuccess:refreshCheckFlowSuc,
            onFailed:refreshCheckFlowFail
        };

            Utils.Request.sendRequest(checkFlowOpt);

        /*刷新云巡检日期和分数成功的回调*/
        function refreshCheckFlowSuc(data){
            if( data != undefined ){
                if( (data.cloudTime != undefined) && (data.score != undefined)){
                    var time = data.cloudTime;
                    $("#DeviceType").text(time);
                    var color = (data.score > 80) ? '#4ec1b2' : ((data.score > 60) ? '#fbceb1' : '#fe808b');
                    $("#SerialNumber").text(data.score).css('color', color);
                }
            }
        }

        /*刷新云巡检日期和分数失败的回调*/
        function refreshCheckFlowFail(){

        }
    }


    /*删除深度体检当前的日期数据*/
    function deleteDepCheckData(){
        var currentDate = NewData.time;
        var id = NewData.id;

        var depdeleteFlowOpt = {
            url:MyConfig.path +'/diagnosis_read/web/depdelete?devSN='+FrameInfo.ACSN,
            type:'post',
            dataType:'json',
            data:{
                date:currentDate
            },
            onSuccess:depdeleteFlowSuc,
            onFailed:depdeleteFlowFail
        };

            Utils.Request.sendRequest(depdeleteFlowOpt);

        /*删除深度体检当前日期成功的回调*/
        function depdeleteFlowSuc(){
            $("#calendar").fullCalendar('removeEvents',id);
            Frame.Msg.info("删除成功!");
            $("#dep_jContent").hide();
            refreshDeepTime();
        }

        /*删除深度体检当前日期成功的回调*/
        function depdeleteFlowFail(){

        }
    }

    /*深度体检成功后，添加日志*/
    function addLog_success(){

        var deepLogFlowOpt = {
            url:MyConfig.path +'/ant/logmgr',
            type:'post',
            dataType:'json',
            data:{
                method:"addLog",
                devSN:FrameInfo.ACSN, //string,设备SN号
                module:"深度体检",//string,模块
                level:"普通",//string 级别
                message: "成功"//string,日志内容
            },
            onSuccess:addLogFlowSuc,
            onFailed:addLogFlowFail
        };

            Utils.Request.sendRequest(deepLogFlowOpt);

        /*深度体检成功后添加日志，成功后的回调*/
        function addLogFlowSuc(){

        }

        /*深度体检成功后添加日志，失败的回调*/
        function  addLogFlowFail(){

        }
    }

    /*深度体检失败后，添加日志*/
    function addLog_fail(){

        var logFailFlowOpt = {
            url:MyConfig.path +'/ant/logmgr',
            type:'post',
            dataType:'json',
            data:{
                method:"addLog",
                devSN:FrameInfo.ACSN, //string,设备SN号
                module:"深度体检",//string,模块
                level:"普通",//string 级别
                message: "失败"//string,日志内容
            },
            onSuccess:addLogFailFlowSuc,
            onFailed:addLogFailFlowFail
        };

            Utils.Request.sendRequest(logFailFlowOpt);

        /*深度体检失败后，添加日志成功的回调*/
        function addLogFailFlowSuc(){

        }

        /*深度体检失败后，添加日志失败的回调*/
        function addLogFailFlowFail(){

        }
    }

    function _init()
    {
        initCalendar();
        initForm();
        drawHistoryChange(0);
    }

    function _destroy()
    {
        $(window).unbind("resize", windowsResize);
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }

    function setChartHeight()
    {
        var jCalendar = $("#calendar");
        var jChart = $("#datacontent");
        var nDiff = 0;
        nCalTop = jCalendar.offset().top;
        nCalLeft = jCalendar.offset().left;
        nChaTop = jChart.offset().top;
        nChaLeft = jChart.offset().left;
        nCalHeight =  jCalendar.height();
        if(nCalLeft == nChaLeft)
        {
            jChart.height(300);
        }
        else
        {
            jChart.height(nCalTop+nCalHeight-nChaTop+nDiff);
        }
    }
    function windowsResize(){
        if(g_hTime)
        {
            clearTimeout(g_hTime);
        }
        g_hTime = setTimeout(function(){
            drawHistoryChange(g_nDateSelect);
        },250);
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList","FullCalendar","Echart"],
        "utils":["Base","Request"]
    });
})( jQuery );

