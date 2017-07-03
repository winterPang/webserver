;(function ($) {
    var MODULE_NAME = "classroom.classstatisc";
    var g_tCurTime = new Date();
    var g_tCurYear=g_tCurTime.getFullYear();
    var g_oConf = {};
    var UP_POOL = {};
    var g_aHtml = [];
    var g_jList = null;
    var Timer_Interval = null;
    var g_oGradeClass = {};
    var g_baseGrade=0;
    var g_oGradeInfo = {};
    var g_oClassYearList = {};
    var g_selectGradeObj = {};
    //获取html文件中文字符
    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("c_statistics_rc", sRcName).split(",");
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
                Frame.Msg.info("年级配置数据更新失败", "error");
            }
        };
        Utils.Request.sendRequest(Option);
    }

    //获取日平均统计信息接口
    function getStatiscTotalInfo(oParam,onSuc)
    {
        var oPara = {
            devSn:FrameInfo.ACSN
        }

        $.extend(oPara,oParam);

        var option = {
            type: 'POST',
            url: MyConfig.path + '/smartcampusread',
            contentType: 'application/json',
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: 'getCollectSta',
                Param: oPara
            }),
            onSuccess: onSuc,
            onFailed: function (jqXHR, textstatus, error) {
                Frame.Msg.info("日平均统计数据更新失败", "error");
            }
        }
        Utils.Request.sendRequest(option);

    }

    //获取班级活跃度排名信息
    function getClassRangeInfo(oParam,onSuc)
    {
        var oPara = {
            devSn:FrameInfo.ACSN
        }

        $.extend(oPara,oParam);
        var option = {
            type:"POST",
            url:"/v3/smartcampusread",
            contentType:"application/json",
            data:JSON.stringify({
                devSN:FrameInfo.ACSN,
                Method:"getClassSta",
                Param:oPara
            }),
            onSuccess:onSuc,
            onFailed:function(jqXHR, textstatus, error) {
                Frame.Msg.info("班级排名数据更新失败", "error");
            }
        }

        Utils.Request.sendRequest(option);
    }

    //获取学生活跃度排名
    function getStuRange(oParam,onSuc)
    {
        var oPara = {
            devSn:FrameInfo.ACSN
        }

        $.extend(oPara,oParam);

        var option = {
            type:"POST",
            url:"/v3/smartcampusread",
            contentType:"application/json",
            data:JSON.stringify({
                devSN:FrameInfo.ACSN,
                Method:"getStudentSta",
                Param:oPara
            }),
            onSuccess: onSuc,
            onFailed: function (jqXHR, textstatus, error) {
                Frame.Msg.info("学生排名数据更新失败", "error");
            }
        }

        Utils.Request.sendRequest(option);
    }

    //获取年级中的班级接口
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
                Frame.Msg.info("班级数据更新失败", "error");
            }
        }
        Utils.Request.sendRequest(option);
    }

    //获取平均课堂数据、班级活跃度、学生活跃度
    function getHistoryAverage(g_oConf,oTime,nGrade,sClass,baseGrade,sGrade)
    {
        var count = 3;
        g_tCurTime = new Date();
        var oParam = {};
        var CurTime = g_tCurTime.getTime();
        var nYears;
        var nClassId = sClass?sClass:undefined;
        var gradeStr = sGrade?sGrade:undefined;
        if(oTime){
            var startTime = oTime.startTime;
            var endTime = oTime.endTime;
        }else{
            startTime = 0;
            endTime = CurTime;
        }

        var oTime1={
            startTime:startTime,
            endTime:endTime
        }
        if(!$.isEmptyObject(nGrade)){
            for(var year in nGrade){
                nYears = year;
            }
        }else{
            nYears = undefined;
        }
        //var baseGrade
        //if(baseGrade == undefined)
        //{
        //    baseGrade = undefined;
        //}else{
        //    baseGrade = parseInt(baseGrade);
        //}

        if(g_oConf)
        {
            if(nYears&&sClass&&gradeStr) {
                oParam = {
                    startTime: oTime1.startTime,
                    endTime: oTime1.endTime,
                    //gradeType: g_oConf.gradeType,
                    years: Number(nYears),
                    classId: nClassId,
                    baseGrade:baseGrade,
                    grade:gradeStr
                }
            }else if(!nYears&&!sClass&&gradeStr){
                oParam ={
                    startTime: oTime1.startTime,
                    endTime: oTime1.endTime,
                    //gradeType: g_oConf.gradeType,
                    //years: nYears,
                    //classId: nClassId,
                    //baseGrade:baseGrade,
                    grade:gradeStr
                }
            }else{
                oParam = {
                    startTime: oTime1.startTime,
                    endTime: oTime1.endTime,
                    //gradeType: g_oConf.gradeType
                }
            }
            function onStatiscTotalSuc(aData,textStatus)
            {
                count--;
                if(aData.retCode != 0)
                {
                    Frame.Msg.info("获取平均课堂数据失败");
                    return;
                }
                var aResult = aData.result || {};
                // if(aResult.TotalAveragehandupCnt){
                //     $("#HandsUp").html(aResult.TotalAveragehandupCnt);
                // }else{
                //     $("#HandsUp").html(0);
                // }
                
                $("#HandsUp").html(51);

                // if(aResult.TotalParticipantCnt){
                //     $("#Participation").html((Number(aResult.TotalParticipantCnt)*100).toFixed(1));
                // }else{
                //     $("#Participation").html(0);
                // }

                $("#Participation").html(71);
                // if(aResult.TotalActiveCnt){
                //     $("#Liveness").html(Number(aResult.TotalActiveCnt).toFixed(2));
                // }else{
                //     $("#Liveness").html(0);
                // }
                $("#Liveness").html(90);
                
            }
            getStatiscTotalInfo(oParam,onStatiscTotalSuc);
            function ClassRangeSuc(aData,textStatus)
            {
                count--;
                if(aData.retCode != 0)
                {
                    Frame.Msg.info("获取平均课堂数据失败");
                    return;
                }

                var aResult = aData.result;
                var GradeString = "";
                aResult.sort(function(x,y){
                    if(x.ActiveCnt< y.ActiveCnt){
                        return 1;
                    }else if(x.ActiveCnt>y.ActiveCnt){
                        return -1;
                    }else{
                        return 0;
                    }
                });

                var i = 0;
                var baseGrade = 0;
                g_tCurYear = (new Date()).getFullYear();
                var thisMonth = (new Date()).getMonth()+1;
                var j = 0;
                var temp_list = [{grade:"一年级",class:"1班",parti:"80",live:"98"},
                                {grade:"二年级",class:"5班",parti:"78",live:"98"},
                                {grade:"一年级",class:"2班",parti:"75",live:"90"},
                                {grade:"三年级",class:"1班",parti:"73",live:"88"},
                                {grade:"六年级",class:"6班",parti:"71",live:"81"}];
                for(;j<5;)
                {
                    $("#Grade"+j).html(temp_list[j].grade);
                    $("#Class"+j).html(temp_list[j].class);
                    $("#Parti"+j).html(temp_list[j].parti);
                    $("#Live"+j).html(temp_list[j].live);
                    j++;
                }
                //i=0;
                
                for(;i<5&&i<aResult.length;){
                    var year = (new Date(aResult[i].years)).getFullYear();
                    var month = g_oConf.gradeMonth;
                    baseGrade=aResult[i].baseGrade;
                    var gradeNum = 0;
                    gradeNum = g_tCurYear - year;
                    GradeString = (g_oConf.gradeConf[gradeNum+baseGrade+(thisMonth-month<0?-1:0)]).gradeString;
                    var cLassString =  aResult[i].classId +"班";
                    ////活跃度
                    //var Parti = ParticipantCnt||0;
                    ////参与度
                    //var Live = "0%";
                    var jGrade=$("#Grade"+i);
                    var jParti=$("#Parti"+i);
                    var jLive=$("#Live"+i);
                    var jClass=$("#Class"+i);
                    if(aResult[i].ActiveCnt) {
                        jClass.html(cLassString);
                        jGrade.html(GradeString);
                        jLive.html(aResult[i].ActiveCnt > 1 ? (aResult[i].ActiveCnt.toFixed(2) + ''):(aResult[i].ActiveCnt.toFixed(2)+''));
                        jParti.html(aResult[i].ParticipantCnt > 1 ? (aResult[i].ParticipantCnt*100).toFixed(1)+"%" + '': (aResult[i].ParticipantCnt.toFixed(1)*100)+"%"+'');
                    }else{
                        jClass.html("");
                        jGrade.html("");
                        jLive.html("");
                        jParti.html("");
                    }
                    
                    i++;
                }
               
            }
            getClassRangeInfo(oParam,ClassRangeSuc);
            function getStuRangeSuc(aData,textStatus)
            {
                count--;
                if(aData.retCode != 0){
                    //console.log(aData.errormsg);
                    Frame.Msg.info("获取学生排名失败");
                    return;
                }

                var aResult = aData.result || [],
                    date = new Date(),
                    thisYear = date.getFullYear(),
                    thisMonth = date.getMonth() + 1;

                aResult.sort(function (x, y) {
                    return (x.count < y.count);
                })

                // should add filter here
                
                var temp_list_1 = [{name:"管日臻",grade:"一年级",class:"1班",times:39},
                                {name:"天宇",grade:"一年级",class:"1班",times:37},
                                {name:"任文慧",grade:"一年级",class:"1班",times:31},
                                {name:"赵日天",grade:"三年级",class:"1班",times:25},
                                {name:"刘宇",grade:"五年级",class:"6班",times:20}];
                var j = 0;
                for(;j<5;)
                {
                    $("#Name"+j).html(temp_list_1[j].name);
                    $("#SGrade"+j).html(temp_list_1[j].grade);
                    $("#SClass"+j).html(temp_list_1[j].class);
                    $("#SHandup"+j).html(temp_list_1[j].times);
                    j++;
                }

                aResult.forEach(function(res, idx, arr) {
                    var jName = $("#Name"+idx);
                    var jSGrade = $("#SGrade"+idx);
                    var jSClass = $("#SClass"+idx);
                    var jSHandup = $("#SHandup"+idx);

                    if (res.count) {
                        var year = (new Date(res.years)).getFullYear(),
                            month = g_oConf.gradeMonth,
                            baseGrade = res.baseGrade;

                            GradeString = (g_oConf.gradeConf[thisYear - year + baseGrade + (thisMonth < month ? -1 : 0)]).gradeString;
                            cLassString = res.classId + '班';
                            jName.html(res.studentName);
                            jSClass.html(cLassString);
                            jSHandup.html(res.count);
                            jSGrade.html(GradeString);
                    }
                    else {
                        jName.html("");
                        jSGrade.html("");
                        jSClass.html("");
                        jSHandup.html("");
                    }

                }, this);


            }
            getStuRange(oParam,getStuRangeSuc);
        }
       
        Utils.Pages.closeWindow(Utils.Pages.getWindow( $("#Filter_form")));
   
    }

    //弹框获取年级、班级
    function changeClassGradeEvent(g_oConf,oTime)
    {
        var oFilter = {};
        oFilter.startTime = oTime?(oTime.startTime?oTime.startTime:0):0;
        oFilter.endTime = oTime?(oTime.endTime?oTime.endTime:(new Date()).getTime()):(new Date()).getTime();

        function onSuccess(aData,textStatus)
        {
            //console.log(aData);
            if(aData.retCode != 0){
                //console.log("get grade && class  failed");
                return;
            }
            var aClassInfoData = aData.result.data || [];
            g_oGradeClass = {};
            var aGradeList = [];
            var aClassList = [];
            g_oClassYearList = {};
            g_baseGrade=aData.result.data[0].baseGrade?aData.result.data[0].baseGrade:0;

            $.each(aClassInfoData,function(index,item){
                var grade = item.grade;
                var years = (new Date(item.years)).getTime();
                //var years = (new Date(item.years)).getTime();
                g_oGradeClass[grade] = g_oGradeClass[grade]||{}
                g_oGradeClass[grade][item.classId]=g_oGradeClass[grade][item.classId]||{};
                g_oGradeClass[grade][item.classId][item.baseGrade]=g_oGradeClass[grade][item.classId][item.baseGrade]||{};

                g_oClassYearList[grade] = g_oClassYearList[grade]||{};
                g_oClassYearList[grade][item.classId] = g_oClassYearList[grade][item.classId]||{};
                g_oClassYearList[grade][item.classId][item.years]=g_oClassYearList[grade][item.classId][item.years]||{};

            });
            //console.log(g_oGradeClass);
            //var opt = {displayField:"display",valueField:"value"};

            g_oGradeInfo = {};
            $.each(aClassInfoData,function(index,item){
                g_oGradeInfo[item.grade]=g_oGradeInfo[item.grade] ||{}
                g_oGradeInfo[item.grade][item.years] = g_oGradeInfo[item.grade][item.years]||{};
                g_oGradeInfo[item.grade][item.years]=item.baseGrade||0;
            })
            for(var grade in g_oGradeClass)
            {
              aGradeList.push({"display":grade,"value":grade});
            }
            $("#grade_name").singleSelect("InitData",aGradeList, {displayField:"display",valueField:"value"});
            $("#GradeSelect").singleSelect("InitData",aGradeList, {displayField:"display",valueField:"value"});

            $("#grade_name").on("change",function(e) {
                var aClassId = [];
                for(var classId in g_oGradeClass[e.val])
                {
                  aClassId.push({"display":classId,"value":classId});
                }
                $("#class_name").singleSelect("InitData", aClassId, {displayField:"display",valueField:"value"});
            });


            $("#GradeSelect").on("change",function(e) {
                g_selectGradeObj.selectGrade= e.val;
                var aClassId = [];
                for(var classId in g_oGradeClass[e.val])
                {
                    aClassId.push({"display":classId,"value":classId});
                }
                $("#ClassSelect").singleSelect("InitData",aClassId, {displayField:"display",valueField:"value"});
            });
            $("#ClassSelect").on("change",function(e) {
                g_selectGradeObj.selectClass= e.val;
            });
            if( g_selectGradeObj.selectGrade&& g_selectGradeObj.selectClass)
                {
                    $("#GradeSelect",$("#Filter_form")).singleSelect("value",g_selectGradeObj.selectGrade);
                    $("#ClassSelect",$("#Filter_form")).singleSelect("value",g_selectGradeObj.selectClass);
                }else if( g_selectGradeObj.selectGrade)
                {
                    $("#GradeSelect",$("#Filter_form")).singleSelect("value",g_selectGradeObj.selectGrade);
                }

        }
        getClassData(oFilter,onSuccess);
    }

    //刷新上半部分页面获取数据
    function  refreshPage(oTime,nGrade,sClass,baseGrade,sGrade)
    {
        var oTime = oTime ||undefined;
        var nGrade = nGrade || undefined;
        var sClass = sClass || undefined;
        var sGrade = sGrade||undefined;
        function onSuccess(aData,textStatus){
            if(aData.retCode !=0)
            {
                Frame.Msg.info("数据更新失败");
            }
            var g_oConf = aData.result?aData.result:{};
            getHistoryAverage(g_oConf,oTime,nGrade,sClass,baseGrade,sGrade);
            changeClassGradeEvent(g_oConf,oTime);
        }
        getGradeConf(onSuccess);
    }

    //--------------------------------刷新下半部分数据-------------------------------------------------------------------------------------------
    //获取到课人数、当前课堂活跃度、当前课堂参与度的信息
    function getClassRealInfo(oParam,onSuc)
    {
        var oPara = {
            devSn:FrameInfo.ACSN,
        }

        $.extend(oPara,oParam);

        var option = {
            type:"POST",
            url:"/v3/smartcampusread",
            contentType:"application/json",
            data:JSON.stringify({
                devSN:FrameInfo.ACSN,
                Method:"getRealTimeClassroomSta",
                Param:oPara
            }),
            onSuccess:onSuc,
            onFailed: function (jqXHR, textstatus, error) {
                Frame.Msg.info("数据更新失败", "error");
            }
        }

        Utils.Request.sendRequest(option);
    }

    //获取学生的实时信息
    function getStuRaiseInfo(oParam,onSuc){
        var oPara = {
            devSn:FrameInfo.ACSN
        }

        $.extend(oPara,oParam);

        var option = {
            type:"POST",
            url:"/v3/smartcampusread",
            contentType:"application/json",
            data:JSON.stringify({
                devSN:FrameInfo.ACSN,
                Method:"getRaiseInfo",
                Param:oPara
            }),
            onSuccess:onSuc,
            onFailed:function(jqXHR,textStatus,error){               
                Frame.Msg.info("数据更新失败", "error");
            }
        }

        Utils.Request.sendRequest(option);
    }

    //获取学生在位信息
    function getStuOnsiteInfo(oParam,onSuc)
    {
        var oPara = {
            devSn:FrameInfo.ACSN
        }

        $.extend(oPara,oParam);

        var option = {
            type:"POST",
            url:"/v3/smartcampusread",
            contentType:"application/json",
            data:JSON.stringify({
                devSn:FrameInfo.ACSN,
                Method:"getOnsiteInfo",
                Param:oPara
            }),
            onSuccess:onSuc,
            onFailed:function(jqXHR,textStatus,error){
                Frame.Msg.info("数据更新失败", "error");
            }
        }
        Utils.Request.sendRequest(option);

    }

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
                Param:oParam1
            }),
            onSuccess:onSuccess,
            onFailed: function(jqXHR,textstatus,error){
                Frame.Msg.info("数据更新异常", "error");
            }
        };

        Utils.Request.sendRequest(Option);
    }

    function checkUp(stu)
    {
        if(stu.up)
        {
            UP_POOL[stu.mac] = {};
            UP_POOL[stu.mac]["time"] = (new Date()).getTime();
            UP_POOL[stu.mac]["active"] = true;
            return true;
        }

        var oPool = UP_POOL[stu.mac];
        var nNow = (new Date()).getTime();

        if(oPool && oPool.active && stu.site)
        {
            return true;
        }

        return false;
    }

    function drawStu(aList)
    {
        var aHtml = [];
        g_jList  = $("#StuList").empty();
        g_aHtml = [];
        var sActive = "", sHtml = "", sSite = "";

        for(var i=0;i<aList.length;i++)
        {
            var oItem = aList[i];
            sActive = checkUp(oItem)?"active":"";
            sSite = oItem.site?"on-site":"";
            // oTemp[item.mac].total
            if(oItem.total){
                sHtml = '<div class="stu-item '+sActive+'  '+sSite+'" mac="'+oItem.mac+'">'+
                    '<span class="stu-icon" style="display:inline-block;"></span>'+
                    '<span class="stu-name">'+oItem.studentName+'</span>'+
                    '<div class="stu-hand">'+oItem.total+'</div>'+
                    '</div>';
            }else{
                sHtml = '<div class="stu-item '+sActive+'  '+sSite+'" mac="'+oItem.mac+'">'+
                    '<span class="stu-icon" style="display:inline-block;"></span>'+
                    '<span class="stu-name">'+oItem.studentName+'</span></div>';
            }

            g_aHtml.push(sHtml);
        }
        g_jList.append(g_aHtml.join(''));

    }

    function formatter(studentData,onSiteData,raiseData,countData)
    {
        var aTemp = [];
        var oTemp = {};

        $.each(studentData,function(index,item){
            oTemp[item.wristbandId] = {};
            oTemp[item.wristbandId].wristbandId = item.wristbandId;
            oTemp[item.wristbandId].mac = item.wristbandId;
            oTemp[item.wristbandId].site = false;
            oTemp[item.wristbandId].total = 0;
            oTemp[item.wristbandId].up = false;
            oTemp[item.wristbandId].studentName = item.studentName;
        });

        $.each(onSiteData.data,function(index,item){
            if(oTemp) {
                if(oTemp[item.mac]) {
                    oTemp[item.mac].site = (oTemp[item.mac].site==false||oTemp[item.mac].site==true) ? true : false;
                }
            }
        });

        $.each(raiseData,function(index,item){
            if(oTemp) {
                if(oTemp[item.mac]) {
                    oTemp[item.mac].up = (oTemp[item.mac].up==false||oTemp[item.mac].up==true) ? true : false;
                    oTemp[item.mac].total = (oTemp[item.mac].total>=0)?item.count:0;
                }
            }
        });

        $.each(oTemp,function(index,item){
            aTemp.push(item);
        });

        drawStu(aTemp);
    }
    //findStudentInfo(oParam,onSuccess)
    //getStuOnsiteInfo(oParam,onSuc)
    //getStuRaiseInfo(oParam,onSuc)
    function getStaticData(oGetClassRealInfo)
    {
        function onGetParaSuc(aData,textStatus)
        {
            if(aData.retCode != 0)
            {
                Frame.Msg.info("获取课堂信息失败!");
                return;
            }
            var aResult = aData.result[0]?aData.result[0]:{};
            var sOnSiteInfo = aResult.onsiteStudentNum?aResult.onsiteStudentNum:0;
            var sActiveCnt = aResult.ActiveCnt?(aResult.ParticipantCnt):0;
            var sParticipantCnt = aResult.ParticipantCnt?(aResult.ActiveCnt):0;

            //$("#StepCount").html(sOnSiteInfo);
            //$("#Active").html((sActiveCnt*100).toFixed(1)+"%");
            //$("#Participant").html(sParticipantCnt.toFixed(2));
            $("#Active").html("71%");
            $("#Participant").html(85);
        }
        //获取三个参数值：到课人数、当前课堂活跃度、当前课堂参与度
        getClassRealInfo(oGetClassRealInfo,onGetParaSuc);
    }
    function getAllStudent(oStuData)
    {
        function onSuccess(aStudentInfo)
        {
            if(aStudentInfo.retCode != 0)
            {
                Frame.Msg.info("获取学生数据失败");
                return;
            }
            var aStudentData = aStudentInfo.result.data?aStudentInfo.result.data:[];
            var nStudentNum = aStudentInfo.result.rowCount || 0;
            ////获取在位信息
            var oOnsiteData ={
                //years:oStuData.years,
                //classId:oStuData.classId,
                //gradeType:oStuData.gradeType,
                startTime: oStuData.startTime,
                endTime:oStuData.endTime,
                //baseGrade:oStuData.baseGrade
            };
            getOnsiteStudent(oStuData,oOnsiteData,aStudentData);
        }
        findStudentInfo(oStuData,onSuccess);
    }

    function getOnsiteStudent(oStuData,oOnsiteData,aStuList)
    {
        function onSuc(aOnsite,textStatus) {
            if(aOnsite.retCode != 0)
            {
                Frame.Msg.info("获取在位学生数据失败");
                return;
            }
            var aOnsiteData = aOnsite.result?aOnsite.result:[];
            $.each(aStuList,function(item,index){

            })
            
            $("#StepCount").html(aOnsiteData.data.length);
            getUpStudent(oOnsiteData,aStuList,aOnsiteData);

        }
        getStuOnsiteInfo(oOnsiteData,onSuc);

    }

    function getUpStudent(oOnsiteData,aStuList,aOnsiteList)
    {
        function onGetHandUpSuc(aData, textStatus) {
            if(aData.retCode != 0){
                Frame.Msg.info("获取学生举手信息失败");
                return;
            }
            var aRaiseInfo = aData.result?aData.result:[];
            g_aRaiseInfo = aRaiseInfo;
            formatter(aStuList,aOnsiteList,aRaiseInfo);
        }
        //获取学生举手信息
        getStuRaiseInfo(oOnsiteData, onGetHandUpSuc);
    }

    //刷新下半部分数据
    function  refreshStuPage(oTime,nGrade,sClass,baseGrade)
    {
        var oTime = oTime ||undefined;
        var nGrade = nGrade || undefined;
        var sClass = sClass || undefined;
        //var baseGrade = baseGrade;

        function onSuccess(aData,textStatus){
            if(aData.retCode !=0)
            {
                Frame.Msg.info("数据更新失败");
            }
            var g_oConf = aData.result?aData.result:{};
            oFilter = {
                gradeType:g_oConf.gradeType
            }
            var timeObj = {}
            timeObj.startTime = oTime?(oTime.startTime?oTime.startTime:0):0;
            timeObj.endTime = oTime?(oTime.endTime?oTime.endTime:((new Date()).getTime())):(new Date()).getTime();
            var classId = sClass?sClass:undefined;
            var years = nGrade?nGrade:undefined;
            //var baseGrade = baseGrade;

            var oGetClassSta = {
                startTime:timeObj.startTime,
                endTime:timeObj.endTime,
                classId:classId,
                years:years,
                baseGrade:baseGrade
            }

            function getClassCallback(aData,textStatus)
            {
                if(aData.retCode != 0){
                    //console.log(aData.errormsg);
                    return;
                }
                var aClassInfoData = aData.result.data || [];
                var sClassString =  aClassInfoData[0].classId;
                var sGradeString = aClassInfoData[0].grade;
                var years = aClassInfoData[0].years;
                var baseGrade = aClassInfoData[0].baseGrade;
                var gradeType = aClassInfoData[0].gradeType;
                var aHtml = [];
                //timeObj = {}
                //timeObj.startTime = oTime?(oTime.startTime?oTime.startTime:0):0;
                //timeObj.endTime = oTime?(oTime.endTime?oTime.startTime:(new Date()).getTime()):(new Date()).getTime();

                aHtml.push('<a id="CurGrade" style="color: inherit;"></a>');
                aHtml.push('<a id="CurClass1" style="color: inherit;" classId='+aClassInfoData[0].classId+' years='+years+' gradeType='+gradeType+' baseGrade='+baseGrade+'></a><a style="color: inherit;">班</a>');
                $("#CurClass").html(aHtml.join(''));
                $("#CurGrade").html(sGradeString);
                $("#CurClass1").html(sClassString);

                var classId = sClassString;
                var oGetClassRealInfo = {
                    startTime:timeObj.startTime,
                    endTime:timeObj.endTime,
                    classId:classId,
                    years:years,
                    baseGrade:baseGrade,
                    //gradeType:gradeType
                };
                getStaticData(oGetClassRealInfo);

                ////获取全部学生信息
                var oStuPara = {
                    baseGrade:aClassInfoData[0].baseGrade,
                    years:aClassInfoData[0].years,
                    classId:aClassInfoData[0].classId,
                    //gradeType:aClassInfoData[0].gradeType
                }
                $.extend(oStuPara,timeObj);
                getAllStudent(oStuPara);
            }
            getClassData(oGetClassSta,getClassCallback);
         }
         getGradeConf(onSuccess);
    }



    function initData()
    {
        var oTime = {};
        $(".xb-link").removeClass("active");
        $("a.xb-link#hour").addClass("active");
        var years = parseInt($("#CurClass1").attr("years"));
        var baseGrade = $("#CurClass1").attr("baseGrade");
        var classId = $("#CurClass1").html();
        oTime.endTime = (new Date()).getTime();
        oTime.startTime = (new Date()).getTime()-3600000;
        $("#TR0").attr("checked","checked");
        refreshPage(oTime);
        refreshStuPage(oTime,years,classId,baseGrade);
    }

    function initForm()
    {
        var g_time={};
        var nowTime = (new Date()).getTime();
        g_time.endTime = nowTime;
        g_time.startTime = nowTime-1000*60*60;
        function onFilter(oPara)
        {
            //console.log()
            var oTime = {};
            var sGrade = $("#GradeSelect").singleSelect("getSelectedData").display?$("#GradeSelect").singleSelect("getSelectedData").display:undefined;
            var sClass = $("#ClassSelect").singleSelect("getSelectedData").display?$("#ClassSelect").singleSelect("getSelectedData").display:undefined;
            //console.log(g_oGradeClass);
            //var baseGrade = g_oGradeClass?(g_oGradeClass[sGrade]?(g_oGradeClass[sGrade]?g_oGradeClass[sGrade][sClass]:undefined):undefined):undefined
            if(g_oGradeClass){
                if(g_oGradeClass[sGrade]){
                    if(g_oGradeClass[sGrade][sClass]){
                        for(var key in g_oGradeClass[sGrade][sClass]){
                            var baseGrade=Number(key);
                        }
                    }
                    else{
                        var baseGrade=undefined;
                    }
                }
                else{
                    var baseGrade=undefined;
                }
            }
            else{
                var baseGrade=undefined;
            }
            var val = $("input[name=TimeRange][checked=checked]").attr("value");
            if(g_oClassYearList){
                if(g_oClassYearList[sGrade])
                {
                   var years =  g_oClassYearList[sGrade]?(g_oClassYearList[sGrade][sClass]?g_oClassYearList[sGrade][sClass]:undefined):undefined;
                }else{
                   var years = undefined;
                }
            }else{
                var years = undefined;
            }

            switch(val)
            {
                case "0":
                {
                    oTime.endTime = (new Date()).getTime();
                    oTime.startTime = (new Date()).getTime()-3600000;
                    break;
                }
                case "1":
                {
                    oTime.endTime = (new Date()).getTime();
                    oTime.startTime = (new Date()).getTime()-3600000*24;
                    break;
                }
                case "2":
                {
                    oTime.endTime = (new Date()).getTime();
                    oTime.startTime = (new Date()).getTime()-3600000*24*7;
                    break;

                }
                case "3":
                {
                    oTime.endTime = (new Date()).getTime();
                    oTime.startTime = (new Date()).getTime()-3600000*24*30;
                    break;

                }
                case "4":
                {
                    oTime.endTime = (new Date()).getTime();
                    oTime.startTime = (new Date()).getTime()-3600000*24*30*12;
                    break;

                }
                default:
                {
                    oTime.startTime = 0;
                    oTime.endTime = (new Date()).getTime();
                    break;
                }
            }
            refreshPage(oTime,years,sClass,baseGrade,sGrade)
        }

        $("input[name=TimeRange]").on("click",function(e){
            $("input[name=TimeRange][type=radio]").removeAttr("checked")
            $(this).attr("checked","checked");
        });

        $("#Filter").on('click',function(){
            $("#Filter_form").form("init", "edit", {
                "title": getRcText("Filter_TITLE"),
                "btn_apply":onFilter
            });

            Utils.Base.openDlg(null, {}, {scope:$("#Filter_dlg"),className:"modal-default"});
            /*if( g_selectGradeObj.selectGrade&& g_selectGradeObj.selectClass)
            {
                $("#GradeSelect",$("#Filter_form")).singleSelect("value",g_selectGradeObj.selectGrade);
                $("#ClassSelect",$("#Filter_form")).singleSelect("value",g_selectGradeObj.selectClass);
            }*/
            /*else
            {
                $("#ClassSelect",$("#Filter_form")).singleSelect("empty");
                $("#GradeSelect",$("#Filter_form")).singleSelect("empty");
            }*/

        });
        var oTempTable = {
            index: [],
            column: [
                'grade_name',
                'class_name'
            ]
        }
        function applyFun()
        {
            var oStData = $("#ChangeClass_form").form("getTableValue", oTempTable);
            var sClassGrade = oStData.grade_name + oStData.class_name +"班";
            $("#CurClass").html(sClassGrade);
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#ChangeClass_form")));
        }

        //https://v3webtest.h3c.com/v3/web/frame/class.html?model=4&sn=210235A0VS6C15390003&nasid=1161#C_CStatics?np=classroom.classhour&classname=CjlaCspidCeqCquCccurGradeCquCspstyleCeqCqucolor:Cspinherit;CquCr%E4%B8%80%E5%B9%B4%E7%BA%A7Cjl/aCrCjlaCspidCeqCquCccurCcclass1CquCspstyleCeqCqucolor:Cspinherit;CquCspyearsCeqCqu1441036800000CquCspgradetypeCeqCqu1CquCspbasegradeCeqCqu0CquCr1Cjl/aCrCjlaCspstyleCeqCqucolor:Cspinherit;CquCr%E7%8F%ADCjl/aCr
        $("#actualClass").on('click',function(){
            var years = $("#CurClass1").attr("years");
            var gradeType = $("#CurClass1").attr("gradeType");
            var baseGrade = $("#CurClass1").attr("baseGrade");
            var classId = $("#CurClass1").html();
            Utils.Base.redirect ({np:"classroom.classhour",gradeType:gradeType,baseGrade:baseGrade,years:years,classId:classId});
        });

        function applyCurClass(e)
        {
            var oTime = {};
            /*var nowTime = (new Date()).getTime();
            oTime.endTime = nowTime;
            oTime.startTime = nowTime-1000*60*60;*/
            var sGrade = $("#grade_name").singleSelect("getSelectedData").display;
            var sClass = $("#class_name").singleSelect("getSelectedData").display;

            if(g_oClassYearList) {
                if(g_oClassYearList[sGrade]) {
                    if(g_oClassYearList[sGrade][sClass]) {
                        for (var years in g_oClassYearList[sGrade][sClass]) {
                            var years = parseInt(years);
                        }
                    }else{
                        var years = undefined;
                    }
                }else{
                    var years = undefined;
                }
            }else{
                var years = undefined;
            }
            if(g_oGradeClass) {
                if(g_oGradeClass[sGrade]) {
                    if(g_oGradeClass[sGrade][sClass]) {
                        for (var baseGrade in g_oGradeClass[sGrade][sClass]) {
                            var baseGrade = baseGrade;
                        }
                    }else{
                        var baseGrade = undefined;
                    }
                }else{
                    var baseGrade = undefined;
                }
            }else{
                var baseGrade = undefined;
            }
            /*oTime.startTime = 0;
            oTime.endTime = (new Date()).getTime();*/
            oTime.startTime=g_time.startTime;
            oTime.endTime=g_time.endTime
            refreshStuPage(oTime,years,sClass,baseGrade);
            Utils.Pages.closeWindow(Utils.Pages.getWindow( $("#ChangeClass_form")));
        }

        $("#CurClass").on('click',function(){

            $("#ChangeClass_form").form("init", "edit", {
                "title": getRcText("CHANGE_TITLE"),
                "btn_apply":applyCurClass});

            Utils.Base.openDlg(null, {}, {scope:$("#ChangeClass_dlg"),className:"modal-default"});
            if(Timer_Interval)
            {
                clearInterval(Timer_Interval);
            }
            nError_Interval = 0;
            $("#grade_name").singleSelect("InitData","");
            $("#class_name").singleSelect("InitData","");

        });
        $(".xb-link.xb-time").on("click",function(){
            $(".xb-link").removeClass("active");
            $(this).addClass("active");
            var years = parseInt($("#CurClass1").attr("years"));
            var baseGrade = $("#CurClass1").attr("baseGrade");
            var id = $(this).attr("id");
            var classId = $("#CurClass1").html();
            var oTime = {};
            var nowTime = (new Date()).getTime();
            switch(id)
            {
                case "hour":
                    oTime.endTime = nowTime;
                    oTime.startTime = nowTime-1000*60*60;
                    break;
                case "day":
                    oTime.endTime = nowTime;
                    oTime.startTime = nowTime-86400000;
                    break;
                case "week":
                    oTime.endTime = nowTime;
                    oTime.startTime = nowTime-86400000*7;
                    break;
                case "month":
                    oTime.endTime = nowTime;
                    oTime.startTime = nowTime-86400000*30;
                    break;
                default:
                    oTime.startTime = 0;
                    oTime.endTime = nowTime;
                    break;
            }
            g_time=oTime;
            refreshStuPage(oTime,years,classId,baseGrade);

        });

        $("#data_detail").on("click",function(e){
            Utils.Base.openDlg(null, {}, {scope:$("#Para_dlg"),className:"modal-default"});
        });

    }

    function _init()
    {
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
                        {text:'课堂管理',href:''}]);
                        
        UP_POOL = {};
        oPara = Utils.Base.parseUrlPara();
        if(oPara.classname) {
            $("#CurClass").html(oPara.classname);
        }else{
            $("#CurClass").html("请选择");
        }
        initForm();
        initData();

    };

    function _destroy()
    {
        Timer_Interval = null;
        g_tCurTime = null;
        g_tCurYear=null;
        g_oConf = null;
        UP_POOL = null;
        g_aHtml = null;
        g_jList = null;
        g_selectGradeObj = {};

    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList","Form","Minput","SingleSelect"],
        "utils":["Request","Base"]
    });
})( jQuery );

/**
 * Created by Administrator on 2016/5/31.
 */
