;(function ($) {
    var MODULE_BASE = "classroom";
    var MODULE_NAME = MODULE_BASE + ".studentmanage";
    var g_oTimer = false;
    var oInfor = {};
    var onlinedata= null;
    var g_RowType = getRcText("EDIT_TITLE").split(",");
    var g_oPara = null;

    var g_classId;
    var g_grade;
    var g_baseGrade;
    var g_years;
    var g_gradeType;

    function getRcText (sRcName)
    {
        return Utils.Base.getRcString("device_rc",sRcName);
    }

    function returnPage(){
        //返回至首页面
        Utils.Base.redirect ({np:"classroom.classmanage"});
        return false;
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

    //查询学生接口studentId,studentName,year,classId,birthday,wristbandId,age,sex,stautre,weight,heartbeatRadio,step,leaveStartTime,leaveEndTime,leaveReason,leaveDays,householder,timesStamp,gradeConf,addTime,delTime
    function findStudentInfo(oParam,onSuccess){
        var oParam1 = {
            devSn:FrameInfo.ACSN,
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

    function initForm ()
    {

    }

    function initAddListen(){
        $("#return").on('click', returnPage);
    }

    function initGrid()
    {         
        function format(row,cell,value,columnDef,dataContext,type)
        {
            var value = value ||"";
            if("text" == type)
            {
                return value;
            }
            switch(cell)
            {
                case 6:
                {
                    /*
                     "{"studentId":"3","studentName":"郑凯","classId":"4","birthday":"2016-07-09","sex":"男",
                     "wristbandId":"11-11-11-11-11-13","bIsLeave":"否",
                     "householder1":"","householdertel1":"","householderrel1":"",
                     "householder2":"","householdertel2":"","householderrel2":"",
                     "householder3":"","householdertel3":"","householderrel3":"","years":1356969600000,
                     "baseGrade":0,"grade":"五年级","gradeType":1,"leaveDays":0,"leaveStartTime":0,"leaveEndTime":0,"leaveReason":""}"
                     */
                    var houseHolder = [];
                    var title = "查看信息";
                    var j = 3;
                    for(i=0;j--;){
                        i++;
                        var sHolder = dataContext["householder"+i]?dataContext["householder"+i]:"";
                        var sHolderTel = dataContext["householdertel"+i]?dataContext["householdertel"+i]:"";
                        var sHolderRel = dataContext["householderrel"+i]?dataContext["householderrel"+i]:"";
                        houseHolder.push({"name":sHolder,"tel":sHolderTel,"rel":sHolderRel});
                    }

                    var houseHolder1= JSON.stringify(houseHolder);
                    return "<p title='" + title + "'><a class='slist-link view-info' style='cursor:pointer;' studentName="+dataContext["studentName"]+" houseHolder="+houseHolder1+" >" + title + "</a></p>"

                }
                default:
                    break;

            }

        }

        function viewHH(e)
        {
            var sHouseHolder = $(this).attr("houseHolder");
            console.log(sHouseHolder);
            var aHouseHolder = JSON.parse(sHouseHolder);
            console.log(aHouseHolder);
            $("#Parent_form").form ("init", "edit", {"title":getRcText("CONTACT_NAME"),
                "btn_apply":false, "btn_cancel":false/*CancelShop*/});

            Utils.Base.openDlg(null, {}, {scope:$("#ContactParentDlg"),className:"modal-small"});
            $("#parent1").html("");
            $("#parent2").html("");
            $("#parent3").html("");

            var studentName = $(this).attr("studentName");
            $("#student").html(studentName);
            var j = 3;
            var aParent = [];
            for(;j--;){
                var name = aHouseHolder[j].name || "";
                var rel = aHouseHolder[j].rel || "";
                var tel = aHouseHolder[j].tel ||"";
                if(name!=""||rel!=""||tel!="") {
                    aParent[j] = aHouseHolder[j].name + "&nbsp;&nbsp(关系:&nbsp;&nbsp" + aHouseHolder[j].rel + "&nbsp;&nbsp联系方式:&nbsp;&nbsp" + aHouseHolder[j].tel + ")";
                }
            }
            $("#parent1").html(aParent[0]);
            $("#parent2").html(aParent[1]);
            $("#parent3").html(aParent[2]);


        }

        var opt = {
            colNames: getRcText("STUDENT_LIST"),
            showHeader: true,
            multiSelect: false,
            showOperation: false,
            pageSize: 10,
            asyncPaging:true,
            onPageChange:function(pageNum,pageSize,oFilter){
                //console.log(new Date()+":monthType:"+monthType+"schoolType:"+schoolType+"aGradeConf:"+aGradeConf);
                if(oFilter) {
                    oFilter.studentIdWeak = oFilter.studentId ? oFilter.studentId : undefined;
                    oFilter.studentNameWeak = oFilter.studentName ? oFilter.studentName : undefined;
                    oFilter.birthdayWeak = oFilter.birthday ? oFilter.birthday : undefined;
                    oFilter.sex = oFilter.sex ? oFilter.sex : undefined;
                    oFilter.wristbandIdWeak = oFilter.wristbandId ? oFilter.wristbandId : undefined;
                    if(oFilter.bIsLeave == "是"){
                        oFilter.bIsLeave == true;
                    }else if(oFilter.bIsLeave == "否"){
                        oFilter.bIsLeave == false;
                    }
                    delete oFilter.studentId;
                    delete oFilter.studentName;
                    delete oFilter.birthday;
                    delete oFilter.wristbandId;
                }
                initData(pageNum, 10, oFilter);
            },
            onSearch:function(oFilter,oSorter){
                /*console.log(new Date()+":monthType:"+monthType+"schoolType:"+schoolType+"aGradeConf:"+aGradeConf);*/
                if(oFilter) {
                    oFilter.studentIdWeak = oFilter.studentId ? oFilter.studentId : undefined;
                    oFilter.studentNameWeak = oFilter.studentName ? oFilter.studentName : undefined;
                    oFilter.birthdayWeak = oFilter.birthday ? oFilter.birthday : undefined;
                    oFilter.sex = oFilter.sex ? oFilter.sex : undefined;
                    oFilter.wristbandIdWeak = oFilter.wristbandId ? oFilter.wristbandId : undefined;
                    if(oFilter.bIsLeave == "是"){
                        oFilter.bIsLeave == true;
                    }else if(oFilter.bIsLeave == "否"){
                        oFilter.bIsLeave == false;
                    }
                    delete oFilter.studentId;
                    delete oFilter.studentName;
                    delete oFilter.birthday;
                    delete oFilter.wristbandId;
                }
                initData(0,10,oFilter)
            },
            colModel:[
                {name: 'studentId', datatype: "String"}, //学号
                {name: 'studentName', datatype: "String"},//学生名
                //{name:'grade',datatype:"String",width:100},//年级
                //{name: 'classId', datatype: "String", width:100},//班级
                {name: 'birthday', datatype: "String"},//生日
                {name: 'sex', datatype: "String"},//性别
                {name: 'wristbandId', datatype: "String"},//性别
                {name: 'bIsLeave', datatype: "String" },//性别
                {name: 'householder', datatype: "String",formatter:format},//性别
            ]
        }
        $("#studentList").on('click','a.slist-link.view-info',viewHH);
        $("#studentList").SList("head",opt);
    }

    function initData(pageNum,pageSize,oFilter)
    {
        //onlinedata =[
        //    {"studentnum":"23","gradenum":"2007","studentname":"王晓亮","studentbirth":"1996-10-12","studentsex":"女","handcircle":"12-13-11-11","statu":"是","studentparent":"王晓燕","parentphone":"15500012211"},
        //    {"studentnum":"32","gradenum":"2013","studentname":"孙丽芳","studentbirth":"2002-02-12","studentsex":"男","handcircle":"1A-1C-B1-11","statu":"否","studentparent":"孙晓敏","parentphone":"15500012211"},
        //    {"studentnum":"2","gradenum":"2014","studentname":"于志凡","studentbirth":"2003-01-12","studentsex":"女","handcircle":"11-22-44-22","statu":"是","studentparent":"贾小洁","parentphone":"15500012211"},
        //    {"studentnum":"1","gradenum":"2015","studentname":"张东奇","studentbirth":"1995-03-04","studentsex":"男","handcircle":"11-33-55-66","statu":"否","studentparent":"孙羽幽","parentphone":"15500012211"}
        //
        //];
        var pageSize = pageSize || 10;
        var pageNum = pageNum || 1;
        var oFilter = oFilter || {};
        var oParam = {
            startTime: 0,
            endtime: (new Date()-0),
            baseGrade:parseInt(g_baseGrade),
            years:parseInt(g_years),
            gradeType:parseInt(g_gradeType),
            classId:g_classId,
            startRowIndex: 10 * (pageNum - 1),
            maxItem: 10
        }
        $.extend(oParam, oFilter);
        var aLinedata = [];
        function onSuccess(aData,textstatus,jqXHR)
        {
            if(aData.retCode != 0){
                debugger;
                console.log("findStudentInfo error:"+aData.result.errormsg);
                Frame.Msg.info("获取学生数据失败");
            }
            var aResult = aData.result.data|| [];
            aLinedata = [];
            $.each(aResult, function (index, item) {
                var oLineData = {};
                oLineData.studentId = item.studentId || "";
                oLineData.studentName = item.studentName || "";
                oLineData.classId = item.classId || "";
                oLineData.birthday = item.birthday || "";
                oLineData.sex = item.sex || "男";
                oLineData.wristbandId = item.wristbandId || "";
                oLineData.bIsLeave = item.bIsLeave || 0;
                if(oLineData.bIsLeave){
                    oLineData.bIsLeave = "是";
                }else{
                    oLineData.bIsLeave = "否";
                }
                if (item.householder) {
                    oLineData.householder1 = item.householder[0] ? (item.householder[0].name ? item.householder[0].name : "") : "";
                    oLineData.householdertel1 = item.householder[0] ? (item.householder[0].tel ? item.householder[0].tel : "") : "";
                    oLineData.householderrel1 = item.householder[0] ? (item.householder[0].relationship ? item.householder[0].relationship : "") : "";
                    oLineData.householder2 = item.householder[1] ? (item.householder[1].name ? item.householder[1].name : "") : "";
                    oLineData.householdertel2 = item.householder[1] ? (item.householder[1].tel ? item.householder[1].tel : "") : "";
                    oLineData.householderrel2 = item.householder[1] ? (item.householder[1].relationship ? item.householder[1].relationship : "") : "";
                    oLineData.householder3 = item.householder[2] ? (item.householder[2].name ? item.householder[2].name : "") : "";
                    oLineData.householdertel3 = item.householder[2] ? (item.householder[2].tel ? item.householder[2].tel : "") : "";
                    oLineData.householderrel3 = item.householder[2] ? (item.householder[2].relationship ? item.householder[2].relationship : "") : "";
                } else {
                    oLineData.householder1 = "";
                    oLineData.householdertel1 = "";
                    oLineData.householderrel1 = "";
                    oLineData.householder2 = "";
                    oLineData.householdertel2 = "";
                    oLineData.householderrel2 = "";
                    oLineData.householder3 = "";
                    oLineData.householdertel3 = "";
                    oLineData.householderrel3 = "";
                }
                oLineData.years = item.years || "";
                oLineData.baseGrade = item.baseGrade || 0;
                var time = new Date();
                oLineData.grade = item.grade || 0;
                oLineData.gradeConf = item.gradeConf;
                oLineData.gradeType = item.gradeType;
                oLineData.leaveDays = item.leaveDays || 0;
                oLineData.leaveStartTime = item.leaveStartTime||0;
                oLineData.leaveEndTime = item.leaveEndTime||0;
                oLineData.leaveReason = item.leaveReason||"";
                aLinedata.push(oLineData);

            });
            var total = aData.result.rowCount;
            $("#studentList").SList("refresh", {data: aLinedata, total: total});

        }
        findStudentInfo(oParam,onSuccess);
    }

    function _init ()
    {
        //classId=1&years=1377964800000&gradeType=1&baseGrade=0&grade=四年级
        g_oPara = Utils.Base.parseUrlPara();
        g_classId = decodeURI(g_oPara.classId) || "";
        g_grade = decodeURI(g_oPara.grade) ||"";
        g_baseGrade = decodeURI(g_oPara.baseGrade) ||"";
        g_years = decodeURI(g_oPara.years) ||null;
        g_gradeType = decodeURI(g_oPara.gradeType) ||null;
        $("#CurClass1").html(g_classId);
        $("#CurGrade").html(g_grade);

        initGrid();
        initAddListen();
        initForm();
        initData();

    }

    function _destroy ()
    {
        g_oPara = null;
        g_classId = null;
        g_grade = null;
        g_baseGrade = null;
        g_years = null;
        g_gradeType = null;
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList","Minput","Form","SingleSelect"],
        "utils":["Request","Base"]
    });
})( jQuery );


