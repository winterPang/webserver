;(function ($) {
    var MODULE_BASE = "classroom";
    var MODULE_NAME = MODULE_BASE + ".studentlist_teacher";
    var g_oTimer = false;
    var oPara = null;
    var addType = null;
    var oInfor = {};
    var onlinedata= null;
    var  gradeConfig = null;
    var gradeAdd = null;
    var g_RowType = getRcText("EDIT_TITLE").split(",");
    var g_oTime = {};
    var g_para = {devSn:FrameInfo.ACSN, nStartTime:0, nEndTime:0, alarmlevel:"normal",
        years:1472659200000, classId:"1", baseGrade:0};
    function getRcText (sRcName)
    {
        return Utils.Base.getRcString("student_rc",sRcName);
    }

    function returnPage(){
        //返回至首页面
        Utils.Base.redirect ({np:"classroom.campusdashboard_teacher"});
        return false;
    }

    function getDoubleStr(aData)
    {
        var num = aData<10?"0"+aData:aData;
        return num;
    }

    //大整数转换成时间
    function makeTime(nTime)
    {
        var time = new Date(nTime);
        var year = time.getFullYear();
        var month = time.getMonth()+1;
        var date  = time.getDate();
        var hour = getDoubleStr(time.getHours());
        var minutes = getDoubleStr(time.getMinutes());
        var sTime = year+"/"+month+"/"+date+"  "+hour+":"+minutes;
        return sTime;
    }

    //获取到校学生列表
    function getStudentPresent(oPara)
    {
        //容错
        function initArriveTestSchool(){
            var opt = [
                {"studentId":"00001","studentName":"管日臻","classId":"1","years":1472659200000,"baseGrade":0,"wristbandId":"f4-b8-5e-9f-d1-c3","birthday":"2010-03-06","sex":"ç”·","bIsLeave":false,"leaveStartTime":0,"leaveEndTime":0,"leaveReason":"","leaveDays":0,"householder":[{"name":"管父","relationship":"父亲","tel":"15011220011"}],"leaveSchoolTime":1476174840565,"inSchoolTime":1476174858406,"grade":"一年级"},
                {"studentId":"00002","studentName":"袁月坤","classId":"1","years":1472659200000,"baseGrade":0,"wristbandId":"f4-b8-5e-a0-af-12","birthday":"2010-08-15","sex":"ç”·","bIsLeave":false,"leaveStartTime":0,"leaveEndTime":0,"leaveReason":"","leaveDays":0,"householder":[{"name":"袁父","relationship":"父亲","tel":"15567891122"}],"leaveSchoolTime":1476174860645,"inSchoolTime":1476174861701,"grade":"一年级"},
                {"studentId":"00003","studentName":"刘新菊","classId":"1","years":1472659200000,"baseGrade":0,"wristbandId":"f4-b8-5e-a0-75-eb","birthday":"2010-10-02","sex":"å¥³","bIsLeave":false,"leaveStartTime":0,"leaveEndTime":0,"leaveReason":"","leaveDays":0,"householder":[{"name":"刘父","relationship":"父亲","tel":"15677990011"}],"leaveSchoolTime":1475197443968,"inSchoolTime":1475198020441,"grade":"一年级"},
                {"studentId":"00004","studentName":"王大鹏","classId":"1","years":1472659200000,"baseGrade":0,"wristbandId":"f4-b8-5e-a0-af-52","birthday":"2009-05-01","sex":"ç”·","bIsLeave":false,"leaveStartTime":0,"leaveEndTime":0,"leaveReason":"","leaveDays":0,"householder":[{"name":"王父","relationship":"父亲","tel":"15577990023"}],"leaveSchoolTime":1475197672089,"inSchoolTime":1475198020927,"grade":"一年级"},
            ];

            $.each(opt,function(index,item){
                item.leaveSchoolTime = makeTime(item.leaveSchoolTime);
                item.leaveTime = makeTime(item.leaveStartTime)+"至"+makeTime(item.leaveEndTime);
            });
            $("#studentList").SList("refresh",opt);
        }
        function onSuc(aData)
        {
            //studentList
            if(aData.retCode!=0)
            {
                initArriveTestSchool();
                console.log("====getStudentLeave  retCode != 0 ===")
                return;
            }
            var aResult = aData.result.data || [];
            $.each(aResult,function(index,item){
                item.inSchoolTime = makeTime(item.inSchoolTime)
            });
            $("#studentList").SList("refresh", { data:aResult, total: aData.result.rowCount });
            //$("#studentList").SList("refresh", aResult);
        }
        var oParam ={
            devSn:FrameInfo.ACSN,
            years:1472659200000,
            classId:"1",
            baseGrade:0,
        }
        $.extend(oParam,oPara);
        var option = {
            type:"POST",
            url:MyConfig.path+"/smartcampusread",
            contentType:"application/json",
            data:JSON.stringify({
                devSN:FrameInfo.ACSN,
                Method:"getStudentPresent",
                Param:oParam
            }),
            timeout:20000,
            onSuccess:onSuc,
            onFailed:function(){
                initArriveTestSchool();
                console.log("=====getStudentPresent fail!=====")
            }
        }
        Utils.Request.sendRequest(option);
    }

    function initArriveSchool(oTime,pageNum,pageSize,oFilter)
    {
        var todayDate = (new Date()).getDate();
        var todayMonth = (new Date()).getMonth()+1;
        var todayYear = (new Date()).getFullYear();
        var pageSize = pageSize || 10;
        var pageNum = pageNum || 1;
        var oFilter = oFilter || {};
        var oPara = {
            //startTime:(new Date(todayYear+"/"+todayMonth+"/"+todayDate+"  "+"00:00:00")).getTime(),
            startTime: (new Date(oTime.startTime)).getTime(),
            //endtime: (new Date()).getTime(),
            endTime:(new Date(oTime.endTime)).getTime(),
            startRowIndex: 10 * (pageNum - 1),
            maxItem: 10,

        }
        $.extend(oPara, oFilter);
        getStudentPresent(oPara)
    }

    //获取请假学生列表
    function getStudentLeave(oPara)
    {
        //容错
        function initStudentTestLeave(){
            var opt = [
                {"studentId":"00005","studentName":"005","classId":"1","years":1472659200000,"baseGrade":0,"wristbandId":"6c-ec-eb-28-94-ec","birthday":"2016-09-29","sex":"ç”·","bIsLeave":true,"leaveStartTime":1475942400000,"leaveEndTime":1476892800000,"leaveReason":"事假","leaveDays":11,"householder":[],"leaveSchoolTime":1475197432025,"inSchoolTime":1475198020217,"grade":"一年级"}
            ];
            $.each(opt,function(index,item){
                item.leaveSchoolTime = makeTime(item.leaveSchoolTime);
                item.leaveTime = makeTime(item.leaveStartTime)+"至"+makeTime(item.leaveEndTime);
            });
            $("#studentList").SList("refresh",opt);
        }
        function onSuc(aData)
        {
            //studentList
            if(aData.retCode!=0)
            {
                initStudentTestLeave();
                console.log("====getStudentLeave  retCode != 0 ===")
                return;
            }
            var aResult = aData.result.data || [];
            $.each(aResult,function(index,item){
                item.leaveSchoolTime = makeTime(item.leaveSchoolTime)
                item.leaveTime = makeTime(item.leaveStartTime)+"至"+makeTime(item.leaveEndTime);
            });

            $("#studentList").SList("refresh", { data:aResult, total: aData.result.rowCount });
            //$("#studentList").SList("refresh",aResult);
        }
        var oParam ={
            devSn:FrameInfo.ACSN,
            years:1472659200000,
            classId:"1",
            baseGrade:0,
        }
        $.extend(oParam,oPara);
        var option = {
            type:"POST",
            url:MyConfig.path+"/smartcampusread",
            contentType:"application/json",
            data:JSON.stringify({
                devSN:FrameInfo.ACSN,
                Method:"getStudentLeave",
                Param:oParam
            }),
            timeout:20000,
            onSuccess:onSuc,
            onFailed:function(){
                initStudentTestLeave();
                console.log("=====getStudentLeave fail!=====")
            }
        }
        Utils.Request.sendRequest(option);
    }

    function initStudentLeave(oTime,pageNum,pageSize,oFilter)
    {
        var todayDate = (new Date()).getDate();
        var todayMonth = (new Date()).getMonth()+1;
        var todayYear = (new Date()).getFullYear();
        var pageSize = pageSize || 10;
        var pageNum = pageNum || 1;
        var oFilter = oFilter || {};
        var oPara = {
            startTime:oTime.startTime,
            endTime:oTime.endTime,
            //startTime:(new Date(todayYear+"/"+todayMonth+"/"+todayDate+"  "+"00:00:00")).getTime(),
            //endtime: (new Date()).getTime(),
            startRowIndex: 10 * (pageNum - 1),
            maxItem: 10,
        }
        $.extend(oPara, oFilter);
        getStudentLeave(oPara)
    }

    //获取离校学生列表
    function getStudentLeaveSchool(oPara)
    {
        //容错
        function initStudentLeaveTestSchool(){
            var opt = [];

            $("#studentList").SList("refresh",opt);
        }
        function onSuc(aData)
        {
            //studentList
            if(aData.retCode!=0)
            {
                initStudentLeaveTestSchool();
                console.log("====getStudentLeaveSchool  retCode != 0 ===")
                return;
            }
            var aResult = aData.result.data || [];
            $.each(aResult,function(index,item){
                item.leaveSchoolTime = makeTime(item.leaveSchoolTime)
            });

            $("#studentList").SList("refresh", { data:aResult, total: aData.result.rowCount });
            //$("#studentList").SList("refresh",aResult);
        }
        var oParam ={
            devSn:FrameInfo.ACSN,
            years:1472659200000,
            classId:"1",
            baseGrade:0,
        }
        $.extend(oParam,oPara);
        var option = {
            type:"POST",
            url:MyConfig.path+"/smartcampusread",
            contentType:"application/json",
            data:JSON.stringify({
                devSN:FrameInfo.ACSN,
                Method:"getStudentLeaveSchool",
                Param:oParam
            }),
            timeout:20000,
            onSuccess:onSuc,
            onFailed:function(e){
                initStudentLeaveTestSchool();
                console.log("=====getStudentLeaveSchool fail!=====")
            }
        }
        Utils.Request.sendRequest(option);
    }

    function initStudentLeaveSchool(oTime,pageNum,pageSize,oFilter)
    {
        var todayDate = (new Date()).getDate();
        var todayMonth = (new Date()).getMonth()+1;
        var todayYear = (new Date()).getFullYear();
        var pageSize = pageSize || 10;
        var pageNum = pageNum || 1;
        var oFilter = oFilter || {};
        var oPara = {
            startTime:oTime.startTime,
            endTime:oTime.endTime,
            //startTime:(new Date(todayYear+"/"+todayMonth+"/"+todayDate+"  "+"00:00:00")).getTime(),
            //endtime: (new Date()).getTime(),
            startRowIndex:10*(pageNum-1),
            maxItem: 10
        }
        $.extend(oPara, oFilter);
        getStudentLeaveSchool(oPara);
    }

    //获取从未到校学生列表
    function getStudentNeverPresent(oPara)
    {
        //容错
        function initStudentLeaveTestSchool(){
            var opt = [];
            $("#studentList").SList("refresh",opt);
        }
        function onSuc(aData)
        {
            //studentList
            if(aData.retCode!=0)
            {
                initStudentLeaveTestSchool();
                console.log("====getHeartbeatSlowInfo  retCode != 0 ===")
                return;
            }
            var aResult = aData.result.data || [];
            $.each(aResult,function(index,item){
                item.leaveSchoolTime = makeTime(item.leaveSchoolTime)
            });

            $("#studentList").SList("refresh", { data:aResult, total: aData.result.rowCount });
            //$("#studentList").SList("refresh", aResult)
        }
        var oParam ={
            devSn:FrameInfo.ACSN,
            years:1472659200000,
            classId:"1",
            baseGrade:0,
        }
        $.extend(oParam,oPara);
        var option = {
            type:"POST",
            url:MyConfig.path+"/smartcampusread",
            contentType:"application/json",
            data:JSON.stringify({
                devSN:FrameInfo.ACSN,
                Method:"getStudentNeverPresent",
                Param:oParam
            }),
            timeout:20000,
            onSuccess:onSuc,
            onFailed:function(e){
                initStudentLeaveTestSchool();
                console.log("=====getStudentNeverPresent fail!=====")
            }
        }
        Utils.Request.sendRequest(option);
    }

    function initStudentNeverPresent(oTime,pageNum,pageSize,oFilter)
    {
        var todayDate = (new Date()).getDate();
        var todayMonth = (new Date()).getMonth()+1;
        var todayYear = (new Date()).getFullYear();
        var pageSize = pageSize || 10;
        var pageNum = pageNum || 1;
        var oFilter = oFilter || {};
        var oPara = {
            startTime:oTime.startTime,
            endTime:oTime.endTime,
            //startTime:(new Date(todayYear+"/"+todayMonth+"/"+todayDate+"  "+"00:00:00")).getTime(),
            //endtime: (new Date()).getTime(),
            startRowIndex: 10 * (pageNum - 1),
            maxItem: 10,
        }
        $.extend(oPara, oFilter);
        getStudentNeverPresent(oPara);
    }

    function getHeartbeatFastInfo(oPara)
    {
        function onSuc(aData)
        {
            //studentList
            if(aData.retCode!=0)
            {
                console.log("====getHeartbeatFastInfo  retCode != 0 ===")
                return;
            }
            var aResult = aData.result.data || [];

            $("#studentList").SList("refresh", { data:aResult, total: aData.result.rowCount });
            //$("#studentList").SList("refresh", aResult);
        }
        var oParam ={
            devSn:FrameInfo.ACSN,
            heartBeatThread:160
        }
        $.extend(oParam,oPara);
        var option = {
            type:"POST",
            url:MyConfig.path+"/smartcampusread",
            contentType:"application/json",
            data:JSON.stringify({
                devSN:FrameInfo.ACSN,
                Method:"getCurHeartbeatFast",
                Param:oParam
            }),
            timeout:20000,
            onSuccess:onSuc,
            onFailed:function(e){
                console.log("=====getStudentNeverPresent fail!=====")
            }
        }
        Utils.Request.sendRequest(option);
    }

    function initCurHeartbeatFast(oTime,pageNum,pageSize,oFilter)
    {
        var todayDate = (new Date()).getDate();
        var todayMonth = (new Date()).getMonth()+1;
        var todayYear = (new Date()).getFullYear();
        var pageSize = pageSize || 10;
        var pageNum = pageNum || 1;
        var oFilter = oFilter || {};
        var oPara = {
            startTime:oTime.startTime,
            endTime:oTime.endTime,
            //startTime:(new Date(todayYear+"/"+todayMonth+"/"+todayDate+"  "+"00:00:00")).getTime(),
            //endtime: (new Date()).getTime(),
            startRowIndex: 10 * (pageNum - 1),
            maxItem: 10,
        }
        $.extend(oPara, oFilter);
        getHeartbeatFastInfo(oPara);
    }

    function getHeartbeatSlowInfo(oPara)
    {
        function onSuc(aData)
        {
            //studentList
            if(aData.retCode!=0)
            {
                console.log("====getHeartbeatSlowInfo  retCode != 0 ===")
                return;
            }
            var aResult = aData.result || [];

            $("#studentList").SList("refresh", { data:aResult, total: aData.result.rowCount });
            //$("#studentList").SList("refresh",aResult);

        }
        var oParam ={
            devSn:FrameInfo.ACSN,
            heartBeatThread:40
        }
        $.extend(oParam,oPara);
        var option = {
            type:"POST",
            url:MyConfig.path+"/smartcampusread",
            contentType:"application/json",
            data:JSON.stringify({
                devSN:FrameInfo.ACSN,
                Method:"getCurHeartbeatSlow",
                Param:oParam
            }),
            timeout:20000,
            onSuccess:onSuc,
            onFailed:function(e){
                console.log("=====getCurHeartbeatSlow fail!=====")
            }
        }
        Utils.Request.sendRequest(option);
    }

    function initCurHeartbeatSlow(oTime,pageNum,pageSize,oFilter)
    {
        var todayDate = (new Date()).getDate();
        var todayMonth = (new Date()).getMonth()+1;
        var todayYear = (new Date()).getFullYear();
        var pageSize = pageSize || 10;
        var pageNum = pageNum || 1;
        var oFilter = oFilter || {};
        var oPara = {
            startTime:oTime.startTime,
            endTime:oTime.endTime,
            //startTime:(new Date(todayYear+"/"+todayMonth+"/"+todayDate+"  "+"00:00:00")).getTime(),
            //endtime: (new Date()).getTime(),
            startRowIndex: 10 * (pageNum - 1),
            maxItem: 10,
        }
        $.extend(oPara, oFilter);
        getHeartbeatSlowInfo(oPara);
    }

    function ChangeStuInfo(row, cell, value, columnDef, dataContext, type)
    {
        value = value ||"";
        if("text" == type)
        {
            return value;
        }
        switch(cell) {
            case 1:
            {
                //var gradeConfig;
                //var gradeAdd;
                //GRADE_TYPE1
                var grade = dataContext["grade"];
                var years = (new Date(dataContext["years"])).getFullYear();

                return "<p title='" + title + "'>"+grade+"("+years+"级)</p>";

            }
            case 2:
            {
                var title = value+"班";
                var value = dataContext["classId"];
                return "<p title='" + title + "'>"+value+"班</p>";
            }

            default:
                break;
        }
        return false;

    }

    function initGrid()
    {
        //初始化校园概览页面列表表头
        function showDetail(oData)
        {
            $("#Parent_form").form ("init", "edit", {"title":getRcText("CONTACT_NAME"),
            "btn_apply":false, "btn_cancel":false/*CancelShop*/});

            Utils.Base.openDlg(null, {}, {scope:$("#ContactParentDlg"),className:"modal-small"});
            var aPara = oData[0].householder || [];
            var studentName = oData[0].studentName || "";
            $("#studentName").html(studentName);
            if(aPara.length){
                $.each(aPara,function(index,item){
                    $("#parent"+(index+1)).html(item.name+" ( 关系:"+item.relationship+"，"+"联系方式:"+item.tel+")");
                })
            }
        }
        function delTest(){

        }
        //到校学生列表
        var allStudentOpt = {
            colNames: getRcText("CLASS_LIST1"),
            showHeader: true,
            multiSelect: true,
            showOperation: true,
            //asyncPaging:false,
            asyncPaging:true,
            pageSize:10,
            onPageChange:function(pageNum,pageSize,oFilter){
                if(oFilter) {
                    oFilter.studentNameWeak = oFilter.studentName ? oFilter.studentName : undefined;
                    oFilter.grade = oFilter.grade ? oFilter.grade : undefined;
                    oFilter.classIdWeak = oFilter.classId ? oFilter.classId : undefined;
                    oFilter.inSchoolTimeWeak = oFilter.inSchoolTime ? oFilter.inSchoolTime : undefined;
                    delete oFilter.classId;
                    delete oFilter.studentName;
                    delete oFilter.inSchoolTime;
                }
                initArriveSchool(g_oTime,pageNum,10,oFilter);
            },
            onSearch:function(oFilter,oSorter){
                if(oFilter) {
                    oFilter.studentNameWeak = oFilter.studentName ? oFilter.studentName : undefined;
                    oFilter.grade = oFilter.grade ? oFilter.grade : undefined;
                    oFilter.classIdWeak = oFilter.classId ? oFilter.classId : undefined;
                    oFilter.inSchoolTimeWeak = oFilter.inSchoolTime ? oFilter.inSchoolTime : undefined;
                    delete oFilter.classId;
                    delete oFilter.studentName;
                    delete oFilter.inSchoolTime;
                }
                initArriveSchool(g_oTime, 0, 10, oFilter);

            },
            colModel: [
                {name: 'studentName', datatype: "String", width: 200},//学生名
                {name: 'grade', datatype: "String",width: 200,formatter:ChangeStuInfo},//年级
                {name: 'classId', datatype: "String",width: 200,formatter:ChangeStuInfo}, //班号
                {name: 'inSchoolTime',datatype:"String",width:200}//到校时间
                //{name: 'chargeteacher', datatype: "String", width: 200},//班主任
            ],
            buttons:[
                {name:"class_download", enable:"<1",value:g_RowType[0],mode:Frame.Button.Mode.DOWNLOAD,action:delTest},
                {name:"detail",enable:true,value:g_RowType[1],action:showDetail}
            ]
        }

        //请假学生列表
        var leaveupStudentOpt = {
            colNames: getRcText("CLASS_LIST2"),
            showHeader: true,
            multiSelect: true,
            showOperation: true,
            asyncPaging:true,
            //asyncPaging:false,
            pageSize:10,
            onPageChange:function(pageNum,pageSize,oFilter){
                if(oFilter) {
                    oFilter.studentNameWeak = oFilter.studentName ? oFilter.studentName : undefined;
                    oFilter.grade = oFilter.grade ? oFilter.grade : undefined;
                    oFilter.classIdWeak = oFilter.classId ? oFilter.classId : undefined;
                    oFilter.leaveTimeWeak = oFilter.leaveTime ? oFilter.leaveTime : undefined;
                    oFilter.leaveReasonWeak = oFilter.leaveReason ? oFilter.leaveReason : undefined;
                    delete oFilter.classId;
                    delete oFilter.studentName;
                    delete oFilter.leaveReason;
                    delete oFilter.leaveTime;
                }
              initStudentLeave(g_oTime,pageNum,10,oFilter);
            },
            onSearch:function(oFilter,oSorter){
                if(oFilter) {
                    oFilter.studentNameWeak = oFilter.studentName ? oFilter.studentName : undefined;
                    oFilter.grade = oFilter.grade ? oFilter.grade : undefined;
                    oFilter.classIdWeak = oFilter.classId ? oFilter.classId : undefined;
                    oFilter.leaveTimeWeak = oFilter.leaveTime ? oFilter.leaveTime : undefined;
                    oFilter.leaveReasonWeak = oFilter.leaveReason ? oFilter.leaveReason : undefined;
                    delete oFilter.classId;
                    delete oFilter.studentName;
                    delete oFilter.leaveReason;
                    delete oFilter.leaveTime;
                }
               initStudentLeave(g_oTime,0,10,oFilter)
            },
            colModel: [
                {name: 'studentName', datatype: "String", width: 200},//学生名
                {name: 'grade', datatype: "String",width: 200,formatter:ChangeStuInfo},//年级
                {name: 'classId', datatype: "String",width: 200,formatter:ChangeStuInfo}, //班级
                {name:'leaveTime',datatype: "String",width: 200},//请假时间 leaveStartTime leaveEndTime
                {name:'leaveReason',datatype: "String",width: 200},//请假原因
                //{name: 'chargeteacher', datatype: "String", width: 200},//班主任
            ],
            buttons:[
                {name:"class_download", enable:"<1",value:g_RowType[0],mode:Frame.Button.Mode.DOWNLOAD,action:delTest},
                {name:"detail",enable:true,value:g_RowType[1],action:showDetail}
            ]
        }

        //离校学生列表
        var absentStudentOpt = {
            colNames: "学生,年级,班号,离校时间",
            showHeader: true,
            multiSelect: true,
            showOperation: true,
            //asyncPaging:false,
            asyncPaging:true,
            pageSize:10,
            onPageChange:function(pageNum,pageSize,oFilter){
                if(oFilter) {
                    oFilter.studentNameWeak = oFilter.studentName ? oFilter.studentName : undefined;
                    oFilter.grade = oFilter.grade ? oFilter.grade : undefined;
                    oFilter.classIdWeak = oFilter.classId ? oFilter.classId : undefined;
                    oFilter.leaveSchoolTimeWeak = oFilter.leaveSchoolTime ? oFilter.leaveSchoolTime : undefined;
                    delete oFilter.classId;
                    delete oFilter.studentName;
                    delete oFilter.leaveSchoolTime;
                }
                initStudentLeaveSchool(g_oTime,pageNum,10,oFilter);
            },
            onSearch:function(oFilter,oSorter){
                if(oFilter) {
                    oFilter.studentNameWeak = oFilter.studentName ? oFilter.studentName : undefined;
                    oFilter.grade = oFilter.grade ? oFilter.grade : undefined;
                    oFilter.classIdWeak = oFilter.classId ? oFilter.classId : undefined;
                    oFilter.leaveSchoolTimeWeak = oFilter.leaveSchoolTime ? oFilter.leaveSchoolTime : undefined;
                    delete oFilter.classId;
                    delete oFilter.studentName;
                    delete oFilter.leaveSchoolTime;
                }
                initStudentLeaveSchool(g_oTime,0,10,oFilter)
            },
            colModel: [
                {name: 'studentName', datatype: "String", width: 200},//学生名
                {name: 'grade', datatype: "String",width: 200,formatter:ChangeStuInfo},
                {name: 'classId', datatype: "String",width: 200,formatter:ChangeStuInfo}, //班级
                {name:'leaveSchoolTime',datatype: "String",width: 200},
                //{name: 'chargeteacher', datatype: "String", width: 200},//班主任
            ],
            buttons:[
                {name:"class_download", enable:"<1",value:g_RowType[0],mode:Frame.Button.Mode.DOWNLOAD,action:delTest},
                {name:"detail",enable:true,value:g_RowType[1],action:showDetail}
            ]
        }

        //从未到校学生列表
        var noArriveStudentOpt = {
            colNames: getRcText("CLASS_LIST3"),
            showHeader: true,
            multiSelect: true,
            showOperation: true,
            //asyncPaging:false,
            asyncPaging:true,
            pageSize:10,
            onPageChange:function(pageNum,pageSize,oFilter){
                if(oFilter) {
                    oFilter.studentNameWeak = oFilter.studentName ? oFilter.studentName : undefined;
                    oFilter.grade = oFilter.grade ? oFilter.grade : undefined;
                    oFilter.classIdWeak = oFilter.classId ? oFilter.classId : undefined;
                    oFilter.leaveSchoolTimeWeak = oFilter.leaveSchoolTime ? oFilter.leaveSchoolTime : undefined;
                    delete oFilter.classId;
                    delete oFilter.studentName;
                    delete oFilter.leaveSchoolTime;
                }
                initStudentNeverPresent(g_oTime,pageNum,10,oFilter);
            },
            onSearch:function(oFilter,oSorter){
                if(oFilter) {
                    oFilter.studentNameWeak = oFilter.studentName ? oFilter.studentName : undefined;
                    oFilter.grade = oFilter.grade ? oFilter.grade : undefined;
                    oFilter.classIdWeak = oFilter.classId ? oFilter.classId : undefined;
                    oFilter.leaveSchoolTimeWeak = oFilter.leaveSchoolTime ? oFilter.leaveSchoolTime : undefined;
                    delete oFilter.classId;
                    delete oFilter.studentName;
                    delete oFilter.leaveSchoolTime;
                }
                initStudentNeverPresent(g_oTime,0,10,oFilter)
            },
            colModel: [
                {name: 'studentName', datatype: "String", width: 200},//学生名
                {name: 'grade', datatype: "String",width: 200,formatter:ChangeStuInfo},
                {name: 'classId', datatype: "String",width: 200,formatter:ChangeStuInfo}, //班级
                {name:'leaveSchoolTime',datatype: "String",width: 200},
                //{name: 'chargeteacher', datatype: "String", width: 200},//班主任
            ],
            buttons:[
                {name:"class_download", enable:"<1",value:g_RowType[0],mode:Frame.Button.Mode.DOWNLOAD,action:delTest},
                {name:"detail",enable:true,value:g_RowType[1],action:showDetail}

            ]
        }

        //心率过速学生列表
        var heartQuickOpt = {
            colNames: getRcText("CLASS_LIST4"),
            showHeader: true,
            multiSelect: true,
            showOperation: true,
            //asyncPaging:false,
            asyncPaging:true,
            pageSize:10,
            onPageChange:function(pageNum,pageSize,oFilter){
                if(oFilter) {
                    oFilter.studentNameWeak = oFilter.studentName ? oFilter.studentName : undefined;
                    oFilter.grade = oFilter.grade ? oFilter.grade : undefined;
                    oFilter.classIdWeak = oFilter.classId ? oFilter.classId : undefined;
                    oFilter.heartrate = oFilter.heartbeat ? oFilter.heartrate : undefined;
                    delete oFilter.classId;
                    delete oFilter.studentName;
                }
                initCurHeartbeatFast(g_oTime,pageNum,10,oFilter);
            },
            onSearch:function(oFilter,oSorter){
                if(oFilter) {
                    oFilter.studentNameWeak = oFilter.studentName ? oFilter.studentName : undefined;
                    oFilter.grade = oFilter.grade ? oFilter.grade : undefined;
                    oFilter.classIdWeak = oFilter.classId ? oFilter.classId : undefined;
                    oFilter.heartrate = oFilter.heartbeat ? oFilter.heartrate : undefined;
                    delete oFilter.classId;
                    delete oFilter.studentName;
                }
                initCurHeartbeatFast(g_oTime,0,10,oFilter)
            },
            colModel: [
                {name: 'studentName', datatype: "String", width: 200},//学生名
                {name: 'grade', datatype: "String",width: 200,formatter:ChangeStuInfo},
                {name: 'classId', datatype: "String",width: 200,formatter:ChangeStuInfo}, //班级
                {name:'heartrate',datatype: "String",width: 200},
                //{name: 'chargeteacher', datatype: "String", width: 200},//班主任

            ],
            buttons:[
                {name:"class_download", enable:"<1",value:g_RowType[0],mode:Frame.Button.Mode.DOWNLOAD,action:delTest},
                {name:"detail",enable:true,value:g_RowType[1],action:showDetail}

            ]
        }

        //心率过缓学生列表
        var heartSlowOpt = {
            colNames: getRcText("CLASS_LIST5"),
            showHeader: true,
            multiSelect: true,
            showOperation: true,
            //asyncPaging:false,
            asyncPaging:true,
            pageSize:10,
            onPageChange:function(pageNum,pageSize,oFilter){
                if(oFilter) {
                    oFilter.studentNameWeak = oFilter.studentName ? oFilter.studentName : undefined;
                    oFilter.grade = oFilter.grade ? oFilter.grade : undefined;
                    oFilter.classIdWeak = oFilter.classId ? oFilter.classId : undefined;
                    oFilter.heartrate = oFilter.heartrate ? oFilter.heartrate : undefined;
                    delete oFilter.classId;
                    delete oFilter.studentName;
                }
                initCurHeartbeatSlow(g_oTime,pageNum,10,oFilter);
            },
            onSearch:function(oFilter,oSorter){
                if(oFilter) {
                    oFilter.studentNameWeak = oFilter.studentName ? oFilter.studentName : undefined;
                    oFilter.grade = oFilter.grade ? oFilter.grade : undefined;
                    oFilter.classIdWeak = oFilter.classId ? oFilter.classId : undefined;
                    oFilter.heartrate = oFilter.heartrate ? oFilter.heartrate : undefined;
                    delete oFilter.classId;
                    delete oFilter.studentName;
                }
                initCurHeartbeatSlow(g_oTime,0,10,oFilter)
            },
            colModel: [
                {name: 'studentName', datatype: "String", width: 200},//学生名
                {name: 'grade', datatype: "String",width: 200,formatter:ChangeStuInfo},
                {name: 'classId', datatype: "String",width: 200,formatter:ChangeStuInfo}, //班级
                {name:'heartrate',datatype: "String",width: 200},
                //{name: 'chargeteacher', datatype: "String", width: 200},//班主任
            ],
            buttons:[
                {name:"class_download", enable:"<1",value:g_RowType[0],mode:Frame.Button.Mode.DOWNLOAD,action:delTest},
                {name:"detail",enable:true,value:g_RowType[1],action:showDetail}
            ]
        }

        var criticalOpt = {
            colNames: getRcText("CLASS_LIST6"),
            showHeader: true,
            multiSelect: true,
            showOperation: false,
            asyncPaging:false,
            //asyncPaging:true,
            pageSize:10,
            colModel: [
                {name: 'studentId', datatype: "String"},//学号
                {name: 'studentName', datatype: "String"},//学生名
                {name: 'classId',datatype: "String", formatter: ChangeStuInfo},//班号
                {name: 'crowdAreaName', datatype: "String"},//发生拥挤区域
                {name: 'time', datatype: "String"},//发生拥挤区域时间
            ]
        }
        switch(addType){
            case "allStudent":
                $("#studentList").SList("head",allStudentOpt);
                aa = $(".slist-head").children().children()[12]
                aa.innerHTML = "联系家长";
                aa.title = "联系家长";
                break;
            case "leaveupStudent":
                $("#studentList").SList("head",leaveupStudentOpt);
                aa = $(".slist-head").children().children()[15]
                aa.innerHTML = "联系家长";
                aa.title = "联系家长";
                break;
            case "absentStudent":
                $("#studentList").SList("head",absentStudentOpt);
                aa = $(".slist-head").children().children()[12]
                aa.innerHTML = "联系家长";
                aa.title = "联系家长";
                break;
            case "noArriveStudent":
                $("#studentList").SList("head",noArriveStudentOpt);
                aa = $(".slist-head").children().children()[12]
                aa.innerHTML = "联系家长";
                aa.title = "联系家长";
                break;
            case "heartQuick":
                $("#studentList").SList("head",heartQuickOpt);
                aa = $(".slist-head").children().children()[12]
                aa.innerHTML = "联系家长";
                aa.title = "联系家长";
                break;
            case "heartSlow":
                $("#studentList").SList("head",heartSlowOpt);
                aa = $(".slist-head").children().children()[12]
                aa.innerHTML = "联系家长";
                aa.title = "联系家长";
                break;

            case "serious":
            case "general":
            case "normal":
                $("#studentList").SList("head",criticalOpt);
                break;
        }
    }
    function initData(Type,oTime)
    {
        switch(Type){
            case "allStudent":initArriveSchool(oTime);break;
            case "leaveupStudent":initStudentLeave(oTime);break;
            case "absentStudent":initStudentLeaveSchool(oTime);break;
            case "noArriveStudent":initStudentNeverPresent(oTime);break;
            case "heartQuick":initCurHeartbeatFast(oTime);break;
            case "heartSlow":initCurHeartbeatSlow(oTime);break;

            case "serious":
            case "general":
            case "normal":initAlarmSlow(Type, oTime);break;

        }

    }



    //告警显示
    function initAlarmSlow(Type, oTime)
    {
        //容错
        switch (Type)//normal general serious
        {
            case "serious":
                var alarmData = [
                    {studentId: "2016010102", studentName:"管日臻", classId:"1", crowdAreaName:"拥挤区域1", time:"2016/10/21 19:49"},
                    {studentId: "2016010101", studentName:"高超", classId:"1", crowdAreaName:"拥挤区域2", time:"2016/10/21 19:49"},
                ];
                break;
            case "general":
                var alarmData = [
                    {studentId: "2016010103", studentName:"刘新菊", classId:"1", crowdAreaName:"拥挤区域3", time:"2016/10/21 19:49"},
                ];
                break;
            case "normal":
                var alarmData = [
                    {studentId: "2016010104", studentName:"王大鹏", classId:"1", crowdAreaName:"非拥挤区域", time:"2016/10/21 19:49"},
                ];
                break;
        }

        function onSuccess(data){
            if (data.retCode == 0){ //0 代表成功
                var opt = data.result;
                $.each(opt,function(index,item){
                    item.time = makeTime(item.time);
                });
                $("#studentList").SList("refresh",opt);
            }else{
                $("#studentList").SList("refresh",alarmData);
            }
        }

        function onFailed(){
            $("#studentList").SList("refresh",alarmData);
        }

        var ajax = {
            type: 'POST',
            url: MyConfig.path + "/smartcampusread",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: "getCrowdClassDetailsbyLevel",
                Param:{
                    devSn:FrameInfo.ACSN,
                    nStartTime: oTime.startTime,
                    nEndTime: oTime.endTime,
                    alarmlevel:Type,
                    years:1472659200000,
                    classId:"1",
                    baseGrade:0
                }
            }),
            onSuccess:onSuccess,
            timeout:20000,
            onFailed:onFailed
        }

        Utils.Request.sendRequest(ajax);
    }



    function _init ()
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
                        {text:'班级概览',href:'#C_CDashboard'},
                        {text:'学生列表',href:''}]);
                        
        gradeConfig = 1;
        gradeAdd = 9;
        oPara = Utils.Base.parseUrlPara();
        addType = oPara.addType ? oPara.addType : "";
        g_oTime = {
            startTime:parseInt(oPara.startTime),
            endTime:parseInt(oPara.endTime)
        };

        $("#return").on('click', returnPage);
        switch(addType){
            case "allStudent":
                $("#studentType").html(getRcText("TITLE_TYPE").split(",")[0]);
                break;
            case "leaveupStudent":
                $("#studentType").html(getRcText("TITLE_TYPE").split(",")[1]);
                break;
            case "absentStudent":
                $("#studentType").html(getRcText("TITLE_TYPE").split(",")[2]);
                break;
            case "noArriveStudent":
                $("#studentType").html(getRcText("TITLE_TYPE").split(",")[5]);
                break;
            case "heartQuick":
                $("#studentType").html(getRcText("TITLE_TYPE").split(",")[4]);
                break;
            case "heartSlow":
                $("#studentType").html(getRcText("TITLE_TYPE").split(",")[3]);
                break;

            case "serious":
                $("#studentType").html(getRcText("TITLE_TYPE").split(",")[6]);
                break;
            case "general":
                $("#studentType").html(getRcText("TITLE_TYPE").split(",")[7]);
                break;
            case "normal":
                $("#studentType").html(getRcText("TITLE_TYPE").split(",")[8]);
                break;
        }

        initGrid();
        initData(addType,g_oTime);

    }

    function _destroy ()
    {
        addType = null;
        gradeConfig = null;
        gradeAdd = null;
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList","Minput","Form"],
        "utils":["Request","Base"]
    });
})( jQuery );
