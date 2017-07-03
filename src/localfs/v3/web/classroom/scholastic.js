;(function ($) {
    var MODULE_BASE = "classroom";
    var MODULE_NAME = MODULE_BASE + ".scholastic";

    var g_RowType = getRcText("EDIT_TITLE").split(",");
    var editTableOpt;
    var monthType = null;
    var schoolType = null;
    var aGradeConf = []; 
    var onlinedata= [];

    function getRcText (sRcName)
    {
        return Utils.Base.getRcString("device_rc",sRcName);
    }

    //日期时间转换格式为时间段 
    function changeTime(beginTime){
        var startTime = new Date(beginTime);
        var time = {
            year:0,
            month:0,
            day:0,
            hour:0,
            minutes:0,
            seconds:0
        };

        time.year = startTime.getFullYear();
        time.month = startTime.getMonth()+1;
        time.day = startTime.getDate();
        time.hour = startTime.getHours();
        time.minutes = startTime.getMinutes();
        time.seconds = startTime.getSeconds();

        var string1 = time.year+"/"+time.month+"/"+time.day;
        if(time.hour>=0&&time.hour<10) {
            if (time.minutes >= 0 && time.minutes < 10) {
                if (time.seconds >= 0 && time.seconds < 10) {
                    var string2 = "0"+time.hour + ":0" + time.minutes + ":0" + time.seconds;
                } else {
                    var string2 = "0"+time.hour + ":0" + time.minutes + ":" + time.seconds;
                }
            } else {
                if (time.seconds >= 0 && time.seconds < 10) {
                    var string2 ="0"+ time.hour + ":" + time.minutes + ":0" + time.seconds;
                } else {
                    var string2 ="0"+ time.hour + ":" + time.minutes + ":" + time.seconds;
                }
            }
        }else{
            if (time.minutes >= 0 && time.minutes < 10) {
                if (time.seconds >= 0 && time.seconds < 10) {
                    var string2 = time.hour + ":0" + time.minutes + ":0" + time.seconds;
                } else {
                    var string2 = time.hour + ":0" + time.minutes + ":" + time.seconds;
                }
            } else {
                if (time.seconds >= 0 && time.seconds < 10) {
                    var string2 =time.hour + ":" + time.minutes + ":0" + time.seconds;
                } else {
                    var string2 =time.hour + ":" + time.minutes + ":" + time.seconds;
                }
            }
        }
        var string = string1+" "+string2;

        return string;
    }

    //年级配置获取接口
    function getGradeConf(onSuccess){
        var Option = {
            type:"POST",
            url:MyConfig.path+"/smartcampusread",
            contentType:"application/json",
            data:JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: "getGradeConfig",
                Param: {
                    devSn: FrameInfo.ACSN
                }
            }),
            onSuccess: onSuccess,
            onFailed: function (jqXHR, textstatus, error) {
                debugger;
                Frame.Msg.info("数据更新失败", "error");
            }
        };
        Utils.Request.sendRequest(Option);
    }
    //通知后台学生进校
    function notifyEnterSchool(oParam,onSuc){
        var oParam1={
            devSn: FrameInfo.ACSN
        };
        $.extend(oParam1,oParam);
        var Option = {
            type:"POST",
            url:MyConfig.path+"/smartcampuswrite",
            contentType:"application/json",
            data:JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: "notifyEnterSchool",
                Param: oParam1
            }),
            onSuccess: onSuc,
            onFailed: function (jqXHR, textstatus, error) {
                Frame.Msg.info("通知失败", "error");
            }
        };
        Utils.Request.sendRequest(Option);
    }

    ////年级配置添加接口
    //function setGradeConfiguration(oParam,onSuccess){
    //    var oParam1 = {
    //        devSn:FrameInfo.ACSN,
    //    }
    //    $.extend(oParam1,oParam);
    //    var Option = {
    //        type:"POST",
    //        url:MyConfig.path+"/smartcampuswrite",
    //        contentType:"application/json",
    //        data:JSON.stringify({
    //            devSN:FrameInfo.ACSN,
    //            Method:"setGradeConfig",
    //            Param:oParam1
    //        }),
    //        onSuccess:onSuccess,
    //        onFailed:function(jqXHR,textstatus,error){
    //            initConfig();
    //            Frame.Msg.info("年级配置失败", "error");
    //        }
    //    }
    //    Utils.Request.sendRequest(Option);
    //}

    //查询学生接口studentId,studentName,year,classId,birthday,wristbandId,age,sex,stautre,weight,heartbeatRadio,step,leaveStartTime,leaveEndTime,leaveReason,leaveDays,householder,timesStamp,gradeConf,addTime,delTime
    function findStudentInfo(oParam,onSuccess){
        var oParam1 = {
            devSn:FrameInfo.ACSN
        }
        $.extend(oParam1,oParam);
        var Option = {
            type: "POST",
            url:  MyConfig.path+"/smartcampusread",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                devSn:FrameInfo.ACSN,
                Method:"getStudent",
                devSn:FrameInfo.ACSN,
                Param:oParam1
            }),
            onSuccess:onSuccess,
            onFailed: function(jqXHR,textstatus,error){
                Frame.Msg.info("数据更新异常", "error");
            }
        };

        Utils.Request.sendRequest(Option);
    }


    //新建学生数据接口
    //addTime,year,studentId,studentName,classId,wristbandId,birthday,age,sex,bIsLeave,householder,gradeConf
    function setStudentInfo(oParam,onSuccess)
    {
        var oParam1 = {
            devSn:FrameInfo.ACSN,
            stautre: 0,
            weight: 0,
            heartbeatRatio: 0,
            step: 0,
            delTime: 0,
            leaveStartTime:0,
            leaveEndTime:0,
            leaveReason:"",
            leaveDays:0
        };
        $.extend(oParam1,oParam);
        var setStudentInfoOpt = {
            type: "POST",
            url:  MyConfig.path+"/smartcampuswrite",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                devSn:FrameInfo.ACSN,
                Method:"addStudent",
                Param:oParam1
            }),
            onSuccess: onSuccess,
            onFailed: function(){
                Frame.Info.Msg("新建学生失败");
            }
        };

        Utils.Request.sendRequest(setStudentInfoOpt);

    }

    function setLeaveorcancel(oPara,setSuc)
    {
        var oParam ={
            devSn:FrameInfo.ACSN
        };

        $.extend(oParam,oPara);
        var setLeaveorcancelOpt = {
            type: "POST",
            url: MyConfig.path+"/smartcampuswrite",
            contentType: "application/json",
            data: JSON.stringify({
                devSn:FrameInfo.ACSN,
                Method:"leaveorcancel",
                Param:oParam

            }),
            onSuccess: setSuc,
            onFailed: function(jqXHR,textstatus,error){
                Frame.Msg.info("设置失败");
            }
        };

        Utils.Request.sendRequest(setLeaveorcancelOpt);

    }

    function delStudent(oParam,delStuSuc)
    {
        var oParam1 = {
            devSn:FrameInfo.ACSN
        }
        $.extend(oParam1,oParam);
        var delStuOpt = {
            type: "POST",
            url: MyConfig.path+"/smartcampuswrite",
            contentType: "application/json",
            data: JSON.stringify({
                devSn:FrameInfo.ACSN,
                Method:"delStudent",
                Param:oParam1
            }),
            onSuccess: delStuSuc,
            onFailed: function(jqXHR,textstatus,error){
                Frame.Msg.info("删除学生失败！");
            }
        };

        Utils.Request.sendRequest(delStuOpt);

    }


    function getClassData(oFilter,onSuccess) {
        oFilter = oFilter || {};
        var Param = {
            devSn: FrameInfo.ACSN
        }

        $.extend(Param, oFilter);

        var option = {
            type: 'POST',
            url: MyConfig.path + '/smartcampusread',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: 'getClass',
                Param: Param
            }),
            onSuccess: onSuccess,
            onFailed: function (err) {
            }
        }
        Utils.Request.sendRequest(option);
    }

    function showParentInfo(){
        function cancelFun(){
            Utils.Pages.closeWindow(Utils.Pages.getWindow( $("#parent_form")));
        }
        $("#parent_form").form ("init", "edit", {"title":getRcText("STATU_NAME"),
            "btn_apply":false, "btn_cancel":cancelFun/*CancelShop*/});

        Utils.Base.openDlg(null, {}, {scope:$("#parentDlg"),className:"modal-small"});

        var parentName = $(this).attr("parentname");
        var parentRelate = $(this).attr("parentrelate");
        var parentPhone = $(this).attr("parentphone");
        $("#parentName1").html(parentName);
        $("#parentRelate").html(parentRelate);
        $("#parentPhone").html(parentPhone);

    }

    function initAddListen(){
        $("input[name=SchoolType]").on("click",function(){
            $(".editGrade").css("display","none");
        });
        $("#Diy").on("click",function(){
            $("#diyGradeName").children().has(".minput-remove").remove();
            $(".editGrade").css("display","block");
        });
        //$("#gradetype_form a#filter_ok").on("click",function(){
        //    monthType = parseInt($("input[name=Month]:checked").attr("value"));
        //    schoolType = parseInt($("input[name=SchoolType]:checked").attr("value"));
        //    console.log(new Date()+":monthType:"+monthType+"schoolType:"+schoolType+"aGradeConf:"+aGradeConf);
        //    switch(schoolType){
        //        case 1:{
        //            var sType= $("#primarySpan").html().split(",");break;
        //        }
        //        case 2:{
        //            var sType= $("#juniorSpan").html().split(",");break;
        //        }
        //        case 3:{
        //            var sType = $("#seniorSpan").html().split(",");break;
        //        }
        //        case 4:{
        //            var sType = $("#midSpan").html().split(",");break;
        //        }
        //        case 5:{
        //            var sType = $("#diyGradeName").Minput("value");break;
        //        }
        //        default:
        //            break;
        //    }
        //    aGradeConf = [];
        //    $.each(sType,function(index,item){
        //        var oGradeConf = {};
        //        oGradeConf.gradeString = item;
        //        oGradeConf.gradeSequence = index;
        //        aGradeConf.push(oGradeConf);
        //    });
        //    var oParam = {
        //        gradeType:schoolType,
        //        gradeConf:aGradeConf,
        //        gradeMonth:monthType
        //    };
        //    function onSuccess(aData,textstatus,jqXHR){
        //        if(aData.retCode != 0){
        //            Frame.Msg.info("年级配置失败！");
        //        }
        //        $(".top-box").css("display","none");
        //        initConfig();
        //
        //    }
        //    $("#diyGradeName").Minput("value");
        //    setGradeConfiguration(oParam,onSuccess);
        //});
        //$("#gradetype_form a#filter_Remove").on("click",function(){
        //   $(".top-box").css("display","none");
        //});
        //$("#CurType").unbind('click').on("click",function(){
        //    if($(".top-box").css("display")=="block") {
        //        $(".top-box").css("display", "none");
        //    }else{
        //        $(".top-box").css("display", "block");
        //    }
        //});
        $("#leaveTime").daterange({
            format:'YYYY/MM/DD',
            timePicker:true,
            timePickerIncrement:1,
            timePicker12Hour:false,
            separator:'-'
        });
        $("#leaveTime").on("inputchange",function(){
            var startTime = new Date($("#leaveTime").daterange("value").split("-")[0]);
            var endTime = new Date($("#leaveTime").daterange("value").split("-")[1]);
            var days = ((endTime - startTime)/(3600000*24)).toFixed(1);
            $("#leavedays").val(days);
        })

    }


    function ChangeStuInfo(row, cell, value, columnDef, dataContext, type)
    {
        value = value ||"";
        if("text" == type)
        {
            return value;
        }
        switch(cell) {
            case 2:{
                var years = (new Date(dataContext["years"]-0)).getFullYear();
                return "<p>"+value+"("+years+"级)"+"</p>"
            }
            case 3:{
                return "<p>"+value+"班</p>"
            }
            case 7:
            {
                var title = getRcText("STU_STATU");
                var num = 1;
                var statu;
                var statuReason = dataContext["leaveReason"];
                var baseGrade = dataContext["baseGrade"];
                var gradeType = dataContext["gradeType"];
                var years = dataContext["years"];
                var studentId = dataContext["studentId"];
                var studentName = dataContext["studentName"];
                var classId = dataContext["classId"];
                var leaveStartTime = dataContext["leaveStartTime"];
                var leaveEndTime = dataContext["leaveEndTime"];
                var leaveReason = dataContext["leaveReason"];
                var leaveDays = dataContext["leaveDays"];
                if (true == dataContext["bIsLeave"]&&leaveStartTime&&leaveEndTime&&leaveDays) {
                    num = 0;
                    //请假
                    statu = "是";
                    return "<p title='" + title + "'><a class='slist-link onOrLeave' style='cursor:pointer;margin: 0 0 0 20px;' num='" + num + "'studentName = '" + studentName + "' baseGrade ="+ baseGrade +" gradeType = "+ gradeType +" years = "+years+" studentId='"+studentId+"' classId='"+classId+ "'leaveStartTime='"+leaveStartTime+"' leaveEndTime='"+leaveEndTime+"' leaveDays='"+leaveDays+"' leaveReason ='"+leaveReason+"'>" + statu + "</a></p>";

                } else if(false == dataContext["bIsLeave"]||leaveStartTime||leaveEndTime||leaveDays) {
                    num = 1;
                    //没请假
                    statu = "否";
                    return "<p title='" + title + "'><a class='slist-link onOrLeave' style='cursor:pointer;margin: 0 0 0 20px;' num='" + num + "'studentName = '" +studentName + "' baseGrade ='"+baseGrade+"' gradeType = '"+gradeType+"'years = "+years+" studentId='"+studentId+"' classId='"+classId+ "'leaveStartTime='"+0+"' leaveEndTime='"+0+"' leaveDays='"+0+"' leaveReason =''>" + statu + "</a></p>";
                }
                return "<p class='float-left' type='0'>" + dataContext["statu"] + "</p><p title='" + title + "'><a class='slist-link' style='cursor:pointer;' num='" + num + "' stuname = '" + dataContext["name"] + "'>" + title + "</a></p>";
            }
            case 8:
            {
                var title = "学生家长1";
                var num = cell%7;
                var parentName = dataContext["householder"+num];
                return "<p title='"+title+"'><a class='slist-link parent1' style='cursor:pointer;' num='"+num+"' parentphone='"+dataContext['householdertel'+num]+"' parentrelate='"+dataContext['householderrel'+num]+"' stuname = '"+dataContext["studentName"]+"' parentname="+parentName+">"+parentName+"</a></p>";
            }
           /* case 9:
            {
                var title = "学生家长2";
                var num = cell%7;
                var parentName = dataContext["householder"+num];
                return "<p title='"+title+"'><a class='slist-link parent2' style='cursor:pointer;' num='"+num+"' parentphone='"+dataContext['householdertel'+num]+"' parentrelate='"+dataContext['householderrel'+num]+"'  stuname = '"+dataContext["studentName"]+"' parentname="+parentName+">"+parentName+"</a></p>";
            }
            case 10:
            {
                var title = "学生家长3";
                var num = cell%7;
                var parentName = dataContext["householder"+num];
                return "<p title='"+title+"'><a class='slist-link parent3' style='cursor:pointer;' num='"+num+"' parentphone='"+dataContext['householdertel'+num]+"' parentrelate='"+dataContext['householderrel'+num]+"' stuname = '"+dataContext["studentName"]+"' parentname ="+parentName+">"+parentName+"</a></p>";
            }*/
            default:
                break;
        }
        return false;

    }

    function editstatu()
    {
        var baseGrade = $(this).attr("baseGrade");
        var gradeType= $(this).attr("gradeType");
        var years= $(this).attr("years");
        var studentId= $(this).attr("studentId");
        var studentName= $(this).attr("studentName");
        var classId= $(this).attr("classId");
        var leaveStartTime= $(this).attr("leaveStartTime");
        var leaveEndTime= $(this).attr("leaveEndTime");
        var leaveReason= $(this).attr("leaveReason");
        var leaveDays= $(this).attr("leaveDays");
        var num = $(this).attr("num");
        var startTime = changeTime(new Date(leaveStartTime-0));
        var endTime = changeTime(new Date(leaveEndTime-0));
        var timeRange = startTime+" - "+endTime;

        var stuTypeArr = ["是", "否"];
        var leaveReasons = ["事假","病假"];

        var oLeaveInfo = {
            baseGrade: baseGrade,
            gradeType: gradeType,
            years: years,
            studentId: studentId,
            studentName: studentName,
            classId: classId,
            //leaveStartTime:0,   //销假 0
            //leaveEndTime:0,       //销假0
            //leaveReason:0,
            //leaveDays:0
        }

        function applyFun(){
            if(leaveStartTime==0||leaveEndTime == 0||leaveReason == 0||leaveDays == 0){
                var statu = $("#stu-type2").singleSelect("value");
                if(statu == "是"){
                    var aRangeTime = $("#leaveTime").daterange("value").split("-");
                    var aTime = $("#leaveTime").daterange("getRangeData");
                    leaveStartTime = (new Date(aRangeTime[0])).getTime();
                    leaveEndTime = (new Date(aRangeTime[1])).getTime();
                    leaveReason = $("#leaveReason").singleSelect("value");
                    leaveDays= $("#leaveDays").val();
                    num = $(this).attr("num");
                    if(aRangeTime.length<=1)
                    {
                        Frame.Msg.info("日期框不能为空！");
                        return;
                    }
                    var check= /^\d+(\.{0,1}\d+){0,1}$/;;
                    if(!check.test(leaveDays)){
                        Frame.Msg.info("请输入请假天数为数字！");
                        return;
                    }

                    if(!(leaveStartTime||leaveEndTime||leaveReason== ""||parseInt(leaveDays)))
                    {
                        var  bIsLeave = false;//请假
                    }else{
                        var  bIsLeave = true;//不请假
                    }
                }else if(statu == "否"){
                    leaveStartTime = 0;
                    leaveEndTime = 0;
                    leaveReason = "";
                    leaveDays = 0;
                    var bIsLeave = false;
                }

                $.extend(oLeaveInfo,{
                     leaveStartTime: leaveStartTime,
                     leaveEndTime:leaveEndTime,
                     leaveReason: leaveReason,
                     leaveDays:leaveDays,
                    bIsLeave:bIsLeave
                });
            }else{
                var statu = $("#stu-type").singleSelect("value");
                if(statu == "是"){
                    var aRangeTime = $("#leaveTime").daterange("value").split("-");
                    var aTime = $("#leaveTime").daterange("getRangeData");
                    leaveStartTime = (new Date(aRangeTime[0])).getTime();
                    leaveEndTime = (new Date(aRangeTime[1])).getTime();
                    leaveReason = $("#leaveReason").singleSelect("value");
                    leaveDays= $("#leaveDays").val();
                    num = $(this).attr("num");
                    if(aRangeTime.length<=1)
                    {
                        Frame.Msg.info("日期框不能为空！");
                        return;
                    }
                    var check= /^\d+(\.{0,1}\d+){0,1}$/;;
                    if(!check.test(leaveDays)){
                        Frame.Msg.info("请输入请假天数为数字！");
                        return;
                    };
                    if(!(leaveStartTime||leaveEndTime||leaveReason== ""||parseInt(leaveDays)))
                    {
                       var  bIsLeave = true;  //请假
                    }else{
                        var  bIsLeave = false; //不请假
                    }
                }else if(statu == "否"){
                    leaveStartTime = 0;
                    leaveEndTime = 0;
                    leaveReason = "";
                    leaveDays = 0;
                    var bIsLeave = false;
                }

                $.extend(oLeaveInfo,{
                    leaveStartTime: leaveStartTime,
                    leaveEndTime:leaveEndTime,
                    leaveReason: leaveReason,
                    leaveDays:leaveDays,
                    bIsLeave:bIsLeave
                });
            }

            function setSuc(aData,textStatus,jqXHR){
                if(aData.retCode != 0){
                    console.log("setSuc Fail!");
                }
                Utils.Pages.closeWindow(Utils.Pages.getWindow( $("#Statu_form")));
                Frame.Msg.info("设置成功！");
                Utils.Base.refreshCurPage();
            }
            setLeaveorcancel(oLeaveInfo,setSuc)

        }

        function cancelFun(){
            Utils.Pages.closeWindow(Utils.Pages.getWindow( $("#Statu_form")));
        }

        $("#Statu_form").form ("init", "edit", {"title":getRcText("STATU_NAME"),
            "btn_apply":applyFun, "btn_cancel":cancelFun/*CancelShop*/});

        Utils.Base.openDlg(null, {}, {scope:$("#StatuDlg"),className:"modal-small"});

        $("#studentName").html(studentName);
        $("#leaveReason").singleSelect("InitData",leaveReasons);

        if(leaveStartTime==0||leaveEndTime == 0||leaveReason == ""||leaveDays == 0){
            $(".leaving").attr("style","display:none;");
            $(".leavingtime").attr("style","display:none;");
            $(".leaveReason").attr("style","display:none;");
            $(".ining").attr("style","display:block;");

            $("#stu-type2").singleSelect("InitData", stuTypeArr);
            $("#stu-type2").singleSelect("value", stuTypeArr[1]);
            $("#leaveReason").singleSelect("value",leaveReason[0]);
            $("#leaveDays").val(parseInt(leaveDays));
            leaveReason = "";

            $("#leaveTime").on("inputchange",function(){
                var aRangeTime = $("#leaveTime").daterange("value").split("-");
                // 如果有半天加此段代码
                var aTime = $("#leaveTime").daterange("getRangeData");
                var aRangeHour = [((new Date(aRangeTime[0])).getHours()),((new Date(aRangeTime[1])).getHours())];
                leaveDays = (new Date(aRangeTime[1]) - new Date(aRangeTime[0])) / 1000 / 60 / 60 / 24;
                var nMius = leaveDays - Math.floor(leaveDays);
                if (nMius>0 && nMius<=0.5)
                {
                    leaveDays = Math.floor(leaveDays)+0.5;
                }else if(nMius>0.5){
                    leaveDays = Math.ceil(leaveDays);
                }
                $("#leaveDays").val(leaveDays);
            });

            $("#stu-type2").change(function () {
                var val = $("#stu-type2").singleSelect("value");
                if("是" == val){
                    $(".leaveReason").attr("style","display:block;");
                    $(".leavingtime").attr("style","display:block;");

                }else if("否" == val){
                    $(".leavingtime").attr("style","display:none;");
                    $(".leaveReason").attr("style","display:none;");
                    $("#leaveTime").daterange("value",[]);
                    $("#leaveReason").singleSelect("value","");
                    $("#leaveDays").val(0);
                    leaveStartTime = 0;
                    leaveEndTime = 0;
                    leaveReason = "";
                    leaveDays = 0;
                }
            });
        }else{
            $(".leaving").attr("style","display:block;")
            $(".leavingtime").attr("style","display:block;")
            $(".leaveReason").attr("style","display:block;")
            $(".ining").attr("style","display:none;");

            $("#stu-type").singleSelect("InitData", stuTypeArr);
            $("#stu-type").singleSelect("value", stuTypeArr[1]);
            $("#leaveDays").val(leaveDays);
            $("#leaveReason").singleSelect("value",leaveReason);
            startTime = changeTime(new Date(leaveStartTime-0));
            endTime = changeTime(new Date(leaveEndTime-0));
            timeRange = startTime+" - "+endTime;
            //"2016/7/10:00:00 - 2016/7/910:00:00"
            //$("#leaveTime").daterange("value",timeRange);
            $("#leaveTime").val(timeRange);
            $("#leaveTime").on("inputchange",function(){
                 var aRangeTime = $("#leaveTime").daterange("value").split("-");
                // 如果有半天加此段代码
                 var aTime = $("#leaveTime").daterange("getRangeData");
                 var aRangeHour = [((new Date(aRangeTime[0])).getHours()),((new Date(aRangeTime[1])).getHours())];
                 var dateMinus = new Date(aRangeTime[1]).getDate()-new Date(aRangeTime[0]);
                if(aRangeHour[0]>=0&&aRangeHour[0]<12){
                    if(aRangeHour[1]<=12&&aRangeHour[1]>=0) {
                        leaveDays = (new Date(aTime.endData) - new Date(aTime.startData)) / 1000 / 60 / 60 / 24-0.5;
                    }else if(aRangeHour[1]>12&&aRangeHour[1]<=23){
                        leaveDays = (new Date(aTime.endData) - new Date(aTime.startData)) / 1000 / 60 / 60 / 24;
                    }
                }else if(aRangeHour[0]>=12&&aRangeHour[0]<0){
                    if(aRangeHour[1]<=12&&aRangeHour[1]>=0) {
                        leaveDays = (new Date(aTime.endData) - new Date(aTime.startData)) / 1000 / 60 / 60 / 24;
                    }else if(aRangeHour[1]>=12&&aRangeHour[1]<=23){
                        leaveDays = (new Date(aTime.endData) - new Date(aTime.startData)) / 1000 / 60 / 60 / 24+0.5;
                    }
                }
                //leaveDays = (new Date(aRangeTime[1]) - new Date(aRangeTime[0]))/1000/60/60/24;
                //leaveDays = Math.floor(leaveDays)+1;
                $("#leaveDays").val(leaveDays);
            });
            $("#stu-type").change(function () {
                var val = $("#stu-type").singleSelect("value");
                if("是" == val){
                    $(".leavingtime").attr("style","display:none;");
                    $(".leaveReason").attr("style","display:none;");
                    $("#leaveTime").daterange("value",[]);
                    $("#leaveReason").singleSelect("value","");
                    $("#leaveDays").val(0);
                    leaveStartTime = 0;
                    leaveEndTime = 0;
                    leaveReason = "";
                    leaveDays = 0;
                }else if("否" == val){
                    $(".leaveReason").attr("style","display:block;");
                    $(".leavingtime").attr("style","display:block;");
                }
            });
        }
    }
    function initGrid() {
        
         function setBreadContent(paraArr){
            
            if(paraArr[0].text != ""){
                $("#bread_1").css("display",'inline');
                $("#bread_1 a").attr("href",paraArr[0].href);
                $("#bread_1 a").text(paraArr[0].text);
            }else{
                $("#bread_1").css("display",'none');
            }
            
            if(paraArr[1].text != ""){
                $("#bread_2").css("display",'inline');
                $("#bread_2 a").attr("href",paraArr[1].href);
                $("#bread_2 a").text(paraArr[1].text);
            }else{
                $("#bread_2").css("display",'none');
            }
            
            if(paraArr[2].text != ""){
                $("#bread_active").css("display",'inline');
                $("#bread_active").text(paraArr[2].text);
            }else{
                $("#bread_active").css("display",'none');
            }
        }
        setBreadContent([{text:'',href:''},
                        {text:'',href:''},
                        {text:'学生管理',href:''}]);
               
        function onSuccess(aData,textstatus,jqXHR){
            if(aData.retCode != 0){
                Frame.Msg.info("更新学生数据失败！");
            }
            //获取 升级月份、年级类型、年级
            monthType = aData.result.gradeMonth;
            schoolType = aData.result.gradeType;//1 小学六年制  2 初中三年制  3高中三年制   4综合中学   5自定义
            aGradeConf = aData.result.gradeConf;

            var aGrade = [];                                           //年级
            var oClass = {};                                           //班级
            var aData = [];                                            //初始化家长联系栏
            var thistime = new Date();                                 //获取时间戳及初始化时间控件
            var thisyear = thistime.getFullYear();                     //获取今年
            var aSex = getRcText("SEX_STATU").split(",");              //初始化性别

            function applyFun1(type) {
                var gradeMonth = monthType;//升级月份
                var birthdaydate = $("#birthdaydate").datetime("getDate");
                var birthdaymonth = birthdaydate.split("-")[1];
                var birthdayyear = birthdaydate.split("-")[0];
                thistime = new Date();
                thisYear = thistime.getFullYear();
                var age = (thistime.getMonth() + 1 - birthdaymonth) ? (thisYear - birthdayyear) : (thisYear - birthdayyear - 1);
                var addTime = thistime - 0;
                var grade = $("#grade_name").singleSelect("value");
                var oStudentInfo = {
                    stautre: 0,
                    weight: 0,
                    heartbeatRatio: 0,
                    step: 0,
                    delTime: 0,
                    bIsLeave: 0,
                    leaveStartTime:0,
                    leaveEndTime:0,
                    leaveReason:"",
                    leaveDays:0,
                    addTime:0,
                    gradeType:schoolType,
                    gradeMonth:monthType,
                    studentId: $("#stu_num").val(),
                    studentName: $("#stu_name").val(),
                    classId: $("#class_name").singleSelect("value"),
                    wristbandId: $("#hand_mac").val(),
                    birthday:  birthdaydate,
                    birthdayyear: birthdayyear,
                    birthdaymonth: birthdaymonth,
                    age: age,
                    sex: $("#sex").singleSelect("value"),
                    householder: $("#AddParent").EditTable("value")
                };
                var oFilter = {

                }
                getClassData(oFilter,getClassSuccess2);
                function getClassSuccess2(aData,textStatus,jqXHR){
                    if(aData.retCode != 0){
                        console.log(aData.errormsg);
                        debugger;
                    }
                    var aData2 = aData.result.data?aData.result.data:[];
                    $.each(aData2,function(index,item){
                        if(item.grade && item.classId) {
                            if (grade == item.grade && oStudentInfo.classId == item.classId) {
                                oStudentInfo.years = item.years;
                                oStudentInfo.baseGrade = item.baseGrade;
                                return;
                            }
                        }
                    });

                    function setSuc(oData,textstatus,jqXHR){
                        if(oData.retCode != 0){
                            console.log(oData.errormsg);
                            Frame.Msg.info("编辑学生失败");
                            return;
                        }
                        console.log(new Date()+":monthType:"+monthType+"schoolType:"+schoolType+"aGradeConf:"+aGradeConf);
                        Frame.Msg.info("编辑学生成功");
                        Utils.Base.refreshCurPage();
                        console.log("setStudentInfo success");
                    }
                    setStudentInfo(oStudentInfo,setSuc)
                }


                Utils.Pages.closeWindow(Utils.Pages.getWindow($("#addStudent_form")));
            }
            function applyFun(type) {
                var gradeMonth = monthType;//升级月份
                var birthdaydate = $("#birthdaydate").datetime("getDate");
                var birthdaymonth = birthdaydate.split("-")[1];
                var birthdayyear = birthdaydate.split("-")[0];
                thistime = new Date();
                thisYear = thistime.getFullYear();
                var age = (thistime.getMonth() + 1 - birthdaymonth) ? (thisYear - birthdayyear) : (thisYear - birthdayyear - 1);
                var addTime = thistime - 0;
                var grade = $("#grade_name").singleSelect("value");
                var oStudentInfo = {
                    stautre: 0,
                    weight: 0,
                    heartbeatRatio: 0,
                    step: 0,
                    delTime: 0,
                    bIsLeave: 0,
                    leaveStartTime:0,
                    leaveEndTime:0,
                    leaveReason:"",
                    leaveDays:0,
                    addTime:addTime,
                    gradeType:schoolType,
                    gradeMonth:monthType,
                    studentId: $("#stu_num").val(),
                    studentName: $("#stu_name").val(),
                    classId: $("#class_name").singleSelect("value"),
                    wristbandId: $("#hand_mac").val(),
                    birthday:  birthdaydate,
                    birthdayyear: birthdayyear,
                    birthdaymonth: birthdaymonth,
                    age: age,
                    sex: $("#sex").singleSelect("value"),
                    householder: $("#AddParent").EditTable("value")
                };
                var oFilter = {

                }
                getClassData(oFilter,getClassSuccess2);
                function getClassSuccess2(aData,textStatus,jqXHR){
                    if(aData.retCode != 0){
                        console.log(aData.errormsg);
                        debugger;
                    }
                    var aData2 = aData.result.data?aData.result.data:[];
                    $.each(aData2,function(index,item){
                        if(item.grade && item.classId) {
                            if (grade == item.grade && oStudentInfo.classId==item.classId) {
                                oStudentInfo.years = item.years;
                                oStudentInfo.baseGrade = item.baseGrade;
                                return;
                            }
                        }
                    });

                    function setSuc(oData,textstatus,jqXHR){
                        if(oData.retCode != 0){
                            console.log(oData.errormsg);
                            Frame.Msg.info("编辑学生失败");
                            return;
                        }
                        console.log(new Date()+":monthType:"+monthType+"schoolType:"+schoolType+"aGradeConf:"+aGradeConf);
                        Frame.Msg.info("编辑学生成功");
                        Utils.Base.refreshCurPage();
                        console.log("setStudentInfo success");
                    }
                    setStudentInfo(oStudentInfo,setSuc)
                }


                Utils.Pages.closeWindow(Utils.Pages.getWindow($("#addStudent_form")));
            }
            function cancelFun() {
                Utils.Pages.closeWindow(Utils.Pages.getWindow($("#addStudent_form")));
            }
            function addAll(param) {
                //var monthType = null;
                //var schoolType = null;
                //var aGradeConf = [];
                console.log("addAll:"+new Date()+":monthType:"+monthType+"schoolType:"+schoolType+"aGradeConf:"+aGradeConf);
                var oFilter = {
                    gradeType:schoolType,
                };
                $.each(aGradeConf,function(index,item){
                    aGrade.push(item.gradeString);
                });
                $("#grade_name").singleSelect("InitData",aGrade);
                function getClassSuccess(aData,textStaus,jqXHR){

                    if(aData.retCode != 0){
                        console.log(aData.errormsg);
                    }
                    var aClassInfoData = aData.result.data || [];
                    $.each(aGrade,function(i,itemGrade){
                        oClass[itemGrade] = [];
                        $.each(aClassInfoData,function(j,itemTotal){
                            if( itemTotal.grade == itemGrade){
                                oClass[itemGrade].push(itemTotal.classId);
                            }
                        });
                    });
                    var grade = $("#grade_name").singleSelect("value");
                    $("#class_name").singleSelect("InitData",oClass[grade]);
                    $("#grade_name").on("change",function(e){
                        var grade = $("#grade_name").singleSelect("value");
                        $("#class_name").singleSelect("InitData",oClass[grade]);
                    });
                }
                getClassData(oFilter,getClassSuccess);

                if(param.length == 0) {
                    var aParentData = [];

                    $("#addStudent_form").form("init", "edit", {
                        "title": getRcText("EDIT_TITLE").split(",")[5],
                        "btn_apply": applyFun, "btn_cancel": cancelFun/*CancelShop*/
                    });
                    Utils.Base.openDlg(null, {}, {scope: $("#EditDlg"), className: "modal-super"});
                    $("label.error").attr("style","display:none");
                    $("input.required.text-error").removeClass("text-error");
                    //初始化新建学生数据对话框
                    $("#sex").singleSelect("enable");
                    $("#class_name").singleSelect("enable");
                    $("#grade_name").singleSelect("enable");
                    $("#stu_num").removeAttr("disabled");

                    $("#sex").singleSelect("InitData", aSex);
                    $("#grade_name").singleSelect("InitData", aGrade)
                    $("#grade_name").singleSelect("value", aGrade[0]);
                    $("#stu_num").val("");
                    $("#stu_name").val("");
                    $("#birthdaydate").datetime("setDate", thistime);
                    $("#hand_mac").val("");
                    $("#AddParent").EditTable("value", aParentData);
                }else if(param.length == 1){
                    var aParentData = [];

                    $("#addStudent_form").form("init", "edit", {
                        "title": getRcText("EDIT_TITLE").split(",")[4],
                        "btn_apply": applyFun1, "btn_cancel": cancelFun/*CancelShop*/
                    });

                    Utils.Base.openDlg(null, {}, {scope: $("#EditDlg"), className: "modal-super"});
                    $("label.error").attr("style","display:none");
                    $("input.required.text-error").removeClass("text-error");

                    $("#sex").singleSelect("InitData", aSex);
                    function getClassSuccessEdit(aData,textStaus,jqXHR){

                        if(aData.retCode != 0){
                            console.log(aData.errormsg);
                        }
                        var aClassInfoData = aData.result.data || [];
                        $.each(aGrade,function(i,itemGrade){
                            oClass[itemGrade] = [];
                            $.each(aClassInfoData,function(j,itemTotal){
                                if( itemTotal.grade == param[0].grade){
                                    oClass[itemGrade].push(itemTotal.classId);
                                }
                            });
                        });
                        $("#grade_name").singleSelect("value",param[0].grade);
                        var grade = $("#grade_name").singleSelect("value");
                        $("#class_name").singleSelect("InitData",oClass[grade]);


                        $("#sex").singleSelect("value",param[0].sex);
                        $("#class_name").singleSelect("value",param[0].classId);
                        $("#stu_num").val(param[0].studentId);
                        $("#stu_name").val(param[0].studentName);
                        $("#birthdaydate").datetime("setDate",param[0].birthday);
                        $("#hand_mac").val(param[0].wristbandId);
                        //$("#parent_name").val(householder);
                        //$("#parent_num").val(param[0].householdertel);
                        if(param[0]["householder1"]) {
                            var i = 1;
                            for (; i--;) {
                                var j = i + 1;
                                if(param[0]["householder"+j]) {
                                    aParentData[i] = {};
                                    aParentData[i]["name"] = param[0]["householder" + j];
                                    aParentData[i]["tel"] = param[0]["householdertel" + j];
                                    aParentData[i]["relationship"] = param[0]["householderrel" + j];
                                }
                            }
                            $("#AddParent").EditTable("value", aParentData);
                        }else{
                            $("#AddParent").EditTable("value", aParentData);
                        }

                        $("#stu_num").attr("disabled", "disabled");
                        $("#class_name").singleSelect("disable");
                        $("#sex").singleSelect("disable");
                        $("#grade_name").singleSelect("disable");
                    }

                    getClassData(oFilter,getClassSuccessEdit);
                }
            }

            function delAll(aPara){
                Frame.Msg.confirm("是否确定删除学生?", function(){
                    var len = aPara.length;
                    function Suc(aData, textStatus, jqXHR){
                        if(aData.retCode != 0){
                            Frame.Msg.info("删除学生失败");
                            Utils.Base.refreshCurPage();
                            return;
                        }
                        len--;
                        //Utils.Base.refreshCurPage();
                        if(len == 0) {
                            //window.location.reload(true);
                            Utils.Base.refreshCurPage();
                        }

                    }

                    var delTime = (new Date()).getTime();
                    $.each(aPara,function(index,item){
                        var oDelParam = {
                            studentId:aPara[index].studentId,
                            studentName:aPara[index].studentName,
                            years:aPara[index].years,
                            baseGrade:aPara[index].baseGrade,
                            delTime:delTime-0,
                            classId:aPara[index].classId
                        }
                        delStudent(oDelParam,Suc);
                    });
                });


                //var oDelParam = {
                //    studentId:oPara[0].studentId,
                //    studentName:oPara[0].studentName,
                //    years:oPara[0].years,
                //    baseGrade:oPara[0].baseGrade,
                //    delTime:delTime-0,
                //    classId:oPara[0].classId
                //};


            }

            //导出学生信息
            function exportNow()
            {
                //var Option = {
                //    type:"POST",
                //    url:MyConfig.path + '/wristbandread'
                //}


            }

            function reportNow(oParam){
                //wristhandId:oParam[0].wristhandId,
                Utils.Base.redirect ({np:"classroom.stureport",years:oParam[0].years,baseGrade:oParam[0].baseGrade,gradeType:oParam[0].gradeType,studentName:oParam[0].studentName,studentId:oParam[0].studentId,classId:oParam[0].classId,gradeId:oParam[0].grade,sex:oParam[0].sex,birthday:oParam[0].birthday});
            }

            var editTableOpt = {
                colNames: getRcText("LIST_HEADER"),
                errorId: "AddParent_error",
                maxCount: 1,
                colModel: [
                    { name: "name",required: true, width: 50, datatype: "String",remark: getRcText("STRING").split(",")[0],tip: getRcText("STRING").split(",")[0] },
                    { name: "relationship", required: true, width: 50, datatype: "String", remark: getRcText("STRING").split(",")[1],tip: getRcText("STRING").split(",")[1]},
                    { name: "tel",required: true, width: 50,datatype: "String",remark: getRcText("STRING").split(",")[2],tip: getRcText("STRING").split(",")[2]}
                ]
            }
            $("#AddParent").EditTable("setOption",editTableOpt);

            var opt = {
                colNames: getRcText("STUDENT_LIST"),
                showHeader: true,
                multiSelect: true,
                showOperation: true,
                pageSize: 10,
                asyncPaging:true,
                onPageChange:function(pageNum,pageSize,oFilter){
                    console.log(new Date()+":monthType:"+monthType+"schoolType:"+schoolType+"aGradeConf:"+aGradeConf);
                    if(oFilter) {
                        if (oFilter.bIsLeave) {
                            switch (oFilter.bIsLeave) {
                                case '是':
                                    oFilter.bIsLeave = true;
                                    break;
                                case '否':
                                    oFilter.bIsLeave = false;
                                    break;
                                default:
                                    break;
                            }
                        }
                        var oFilt = {
                            grade: oFilter.grade,
                            studentIdWeak: oFilter.studentId,
                            studentNameWeak: oFilter.studentName,
                            classIdWeak: oFilter.classId,
                            birthdayWeak: oFilter.birthday,
                            sex: oFilter.sex,
                            wristbandIdWeak: oFilter.wristbandId,
                            bIsLeave: oFilter.bIsLeave,
                            householder1Weak: oFilter.householder1,
                           /* householder2Weak: oFilter.householder2,
                            householder3Weak: oFilter.householder3*/
                        }
                    }
                    initData(pageNum,10,oFilt);
                },
                onSearch:function(oFilter,oSorter){
                    console.log(new Date()+":monthType:"+monthType+"schoolType:"+schoolType+"aGradeConf:"+aGradeConf);
                    　if(oFilter != null) {
                          if (oFilter.bIsLeave) {
                              switch (oFilter.bIsLeave) {
                                  case '是':
                                      oFilter.bIsLeave = true;break;
                                  case '否':
                                      oFilter.bIsLeave = false;break;
                                  default:
                                      break;
                              }
                          }
                          var oFilt = {
                              grade: oFilter.grade,
                              studentIdWeak: oFilter.studentId,
                              studentNameWeak: oFilter.studentName,
                              classIdWeak: oFilter.classId,
                              birthdayWeak: oFilter.birthday,
                              sex: oFilter.sex,
                              wristbandIdWeak: oFilter.wristbandId,
                              bIsLeave: oFilter.bIsLeave,
                              householder1Weak: oFilter.householder1
                             /* householder2Weak: oFilter.householder2,
                              householder3Weak: oFilter.householder3*/
                          }
                  　}
                    initData(0,10,oFilt)
                },
                colModel:[
                    {name: 'studentId', datatype: "String", width: 150}, //学号
                    {name: 'studentName', datatype: "String", width: 100},//学生名
                    {name:'grade',datatype:"String",width:150,formatter:ChangeStuInfo},//年级
                    {name: 'classId', datatype: "String", width:100,formatter:ChangeStuInfo},//班级
                    {name: 'birthday', datatype: "String", width: 150},//生日
                    {name: 'sex', datatype: "String", width: 100},//性别
                    {name: 'wristbandId', datatype: "String", width: 150},//性别
                    {name: 'bIsLeave', datatype: "String", width: 100, formatter: ChangeStuInfo},//性别
                    {name: 'householder1', datatype: "String", width: 100, formatter: ChangeStuInfo},//性别
                   /* {name: 'householder2', datatype: "String", width: 100, formatter: ChangeStuInfo},
                    {name: 'householder3', datatype: "String", width: 100, formatter: ChangeStuInfo},*/

                ],
                buttons: [
                    {
                        name: "class_newadd",
                        enable: "<1",
                        value: g_RowType[0],
                        mode: Frame.Button.Mode.CREATE,
                        action: addAll
                    },
                    {
                        name: "class_delete",
                        enable: ">0",
                        value: g_RowType[1],
                        mode: Frame.Button.Mode.DELETE,
                        action: delAll
                    },
                    {
                        name: "class_download",
                        enable: ">0",
                        value: g_RowType[2],
                        mode: Frame.Button.Mode.DOWNLOAD,
                        action: exportNow
                    },
                    {
                        enable: "==1",
                        value: g_RowType[6],
                        action: enterSchool
                    },
                    //{name:"defualt", enable:">0",value:g_RowType[3],action:addAll},
                    {name: "edit", enable: true, action: addAll},
                    {name: "delete", enable: true, action: delAll},
                    {name: "detail", enable: true, value: "报告", action: reportNow}
                ]
            }
            //$("#studentList").on('click', 'a.leave', editcancelstatu);
            $("#studentList").on('click', 'a.onOrLeave', editstatu);
            $("#studentList").on('click', 'a.parent1', showParentInfo);
            $("#studentList").on('click', 'a.parent2', showParentInfo);
            $("#studentList").on('click', 'a.parent3', showParentInfo);
            $("#studentList").SList("head", opt);
            $("#studentList span.sort-icon").remove();

        }
        getGradeConf(onSuccess);

    }

    function enterSchool(param){
        console.log(param[0])
        var oTemp = {
            studentId:param[0].studentId,
            studentName:param[0].studentName,
            wristbandId:param[0].wristbandId,
            time:new Date().getTime(),
            enterSchool:"门内"
        }
        notifyEnterSchool(oTemp,onSuc);
        function onSuc(data){
            if(data.retCode != 0){
                Frame.Msg.info("通知进校失败");
            }else if(data.retCode == 0){
                Frame.Msg.info("通知进校成功");
                Utils.Base.refreshCurPage();
            }
        }
    }
    function initSlistData(pageNum, pageSize, oFilter) {
        //monthType,schoolType,aGradeConf
        var pageSize = pageSize || 10;
        var pageNum = pageNum || 1;
        var oFilter = oFilter || {};
        var oParam = {
            startTime: 0,
            endtime: 0,
            startRowIndex: 10 * (pageNum - 1),
            maxItem: 10,
            //gradeType: schoolType
        }
        $.extend(oParam, oFilter);

        function getStuInfoSuc(aData, textStatus, jqXHR) {
            oData = aData.result.data || [];
            if (aData.retCode != 0) {
                console.log("function getStuInfoSuc" + textStatus);
            }
            onlinedata = [];
            $.each(oData, function (index, item) {
                var oLineData = {};
                oLineData.studentId = item.studentId || "";
                oLineData.studentName = item.studentName || "";
                oLineData.classId = item.classId || "";
                oLineData.birthday = item.birthday || "";
                oLineData.sex = item.sex || "男";
                oLineData.wristbandId = item.wristbandId || "";
                oLineData.bIsLeave = item.bIsLeave;
                if (item.householder) {
                    oLineData.householder1 = item.householder[0] ? (item.householder[0].name ? item.householder[0].name : "") : "";
                    oLineData.householdertel1 = item.householder[0] ? (item.householder[0].tel ? item.householder[0].tel : "") : "";
                    oLineData.householderrel1 = item.householder[0] ? (item.householder[0].relationship ? item.householder[0].relationship : "") : "";
                    /*oLineData.householder2 = item.householder[1] ? (item.householder[1].name ? item.householder[1].name : "") : "";
                    oLineData.householdertel2 = item.householder[1] ? (item.householder[1].tel ? item.householder[1].tel : "") : "";
                    oLineData.householderrel2 = item.householder[1] ? (item.householder[1].relationship ? item.householder[1].relationship : "") : "";
                    oLineData.householder3 = item.householder[2] ? (item.householder[2].name ? item.householder[2].name : "") : "";
                    oLineData.householdertel3 = item.householder[2] ? (item.householder[2].tel ? item.householder[2].tel : "") : "";
                    oLineData.householderrel3 = item.householder[2] ? (item.householder[2].relationship ? item.householder[2].relationship : "") : "";*/
                } else {
                    oLineData.householder1 = "";
                    oLineData.householdertel1 = "";
                    oLineData.householderrel1 = "";
                   /* oLineData.householder2 = "";
                    oLineData.householdertel2 = "";
                    oLineData.householderrel2 = "";
                    oLineData.householder3 = "";
                    oLineData.householdertel3 = "";
                    oLineData.householderrel3 = "";*/
                }
                oLineData.years = item.years || "";
                oLineData.baseGrade = item.baseGrade || 0;
                var time = new Date();
                oLineData.grade = item.grade || 0;
                //oLineData.gradeConf = item.gradeConf;
                oLineData.gradeType = item.gradeType;
                oLineData.leaveDays = item.leaveDays || 0;
                oLineData.leaveStartTime = item.leaveStartTime||0;
                oLineData.leaveEndTime = item.leaveEndTime||0;
                oLineData.leaveReason = item.leaveReason||"";
                onlinedata.push(oLineData);

            });
            var total = aData.result.rowCount;
            $("#studentList").SList("refresh", {data: onlinedata, total: total});
        }
       findStudentInfo(oParam,getStuInfoSuc);
    }

    function initData(pageNum,pageSize,oFilter)
    {
        initSlistData(pageNum,pageSize,oFilter);
    }

    function initConfig(){
        function onSuccess(aData,textstatus,jqXHR){
            if(aData.retCode != 0){
                if(aData.retCode = -2){
                    var oParam = {
                        gradeType:1,
                        gradeConf:[
                            {"gradeString":"一年级","gradeSequence":0},
                            {"gradeString":"二年级","gradeSequence":1},
                            {"gradeString":"三年级","gradeSequence":2},
                            {"gradeString":"四年级","gradeSequence":3},
                            {"gradeString":"五年级","gradeSequence":4},
                            {"gradeString":"六年级","gradeSequence":5}
                        ],
                        gradeMonth:9
                    };
                    function onSuc(aData,textStatus,jqXHR){
                        if(aData.retCode != 0){
                            Frame.Msg.info("获取配置信息失败！");
                        }
                        initConfig();
                    }
                    setGradeConfiguration(oParam,onSuc);
                }
                Frame.Msg.info("更新学生数据失败！");
            }
            //获取 升级月份、年级类型、年级
            monthType = aData.result.gradeMonth;
            schoolType = aData.result.gradeType;//1 小学六年制  2 初中三年制  3高中三年制   4综合中学   5自定义
            aGradeConf = aData.result.gradeConf;
            initAddListen();
            initData();
            console.log(new Date()+":monthType:"+monthType+"schoolType:"+schoolType+"aGradeConf:"+aGradeConf);
            switch(schoolType){
                case 1:
                    $("#CurType").html("六年制小学");
                    $("input[name=SchoolType]").removeAttr("checked");
                    $("#Primary").attr("checked");
                    break;
                case 2:
                    $("#CurType").html("三年制初中");
                    $("input[name=Month]").removeAttr("checked");
                    $("#Junior").attr("checked");
                    break;
                case 3:
                    $("#CurType").html("三年制高中");
                    $("input[name=Month]").removeAttr("checked");
                    $("#Senior").attr("checked");
                    break;
                case 4:
                    $("#CurType").html("综合中学");
                    $("input[name=Month]").removeAttr("checked");
                    $("#MidSchool").attr("checked");
                    break;
                case 5:
                    $("#CurType").html("自定义");
                    $("input[name=Month]").removeAttr("checked");
                    $("#Diy").attr("checked");
                    break;
                default:
                    break;
            }

            switch(monthType){
                case 1:
                    $("input[name=Month]").removeAttr("checked");
                    $("#Janu").attr("checked");
                    break;
                case 2:
                    $("input[name=Month]").removeAttr("checked");
                    $("#Feb").attr("checked");
                    break;
                case 3:
                    $("input[name=Month]").removeAttr("checked");
                    $("#March").attr("checked");
                    break;
                case 4:
                    $("input[name=Month]").removeAttr("checked");
                    $("#Apr").attr("checked");
                    break;
                case 5:
                    $("input[name=Month]").removeAttr("checked");
                    $("#May").attr("checked");
                    break;
                case 6:
                    $("input[name=Month]").removeAttr("checked");
                    $("#June").attr("checked");
                    break;
                case 7:
                    $("input[name=Month]").removeAttr("checked");
                    $("#July").attr("checked");
                    break;
                case 8:
                    $("input[name=Month]").removeAttr("checked");
                    $("#Aug").attr("checked");
                    break;
                case 9:
                    $("input[name=Month]").removeAttr("checked");
                    $("#Sept").attr("checked");
                    break;
                case 10:
                    $("input[name=Month]").removeAttr("checked");
                    $("#Sept").attr("checked");
                    break;
                case 11:
                    $("input[name=Month]").removeAttr("checked");
                    $("#Nove").attr("checked");
                    break;
                case 12:
                    $("input[name=Month]").removeAttr("checked");
                    $("#Dec").attr("checked");
                    break;
                default:
                    break;
            }
            console.log("getGradeConf:"+new Date()+":monthType:"+monthType+"schoolType:"+schoolType+"aGradeConf:"+aGradeConf);

        }
        getGradeConf(onSuccess);
    }

    function _init ()
    {
        initConfig();
        initGrid();

    }

    function _destroy ()
    {
        editTableOpt = null;
        onlinedata = null;
        monthType = null;
        schoolType = null;
        aGradeConf = [];
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList","Minput","Form","SingleSelect","DateRange","DateTime","EditTable","Typehead"],
        "utils":["Request","Base"]
    });
})( jQuery );
