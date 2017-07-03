;(function ($) {
	var MODULE_BASE = "classroom";
	var MODULE_NAME = MODULE_BASE + ".classhour";
    var Timer_Timeout = null;
    var Timer_Interval = null;
    var nError_Interval = 0;
    var nError_Timeout = 0;
    var Timer_Error = null;
    var SN = "";
    var crurentObj = {};
    var UP_POOL = null;
    var Edit_MAC = "";
    var oPara = null;
    var startTime = null;
    var endTime = null;

    //造假数据辅助变量
    var oHandCount = [];
    var offsite = 6;


	function getRcText (sRcName)
    {
        return Utils.Base.getRcString("c_room_rc",sRcName);
    }

    function returnPage(){
        //返回至首页面 
        Utils.Base.redirect({np: 'classroom.classstatisc',gradeType:oPara.gradeType,baseGrade:oPara.baseGrade,years:oPara.years,classId:oPara.classId});
        return false;
    }
    //
    //function $get(sUrl,onSuccessed,onFailed)
    //{
    //    return $.ajax({
    //        type:'get',
    //        //url:'/v3/wloc/wristband/'+sUrl,
    //        url:'../../web/classroom/image/data.json',
    //        dataType:'json',
    //        success:function(data){
    //            onSuccessed && onSuccessed(data);
    //        },
    //        error:function(){
    //            console.error('Get Data Error');
    //            onFailed && onFailed(arguments);
    //        }
    //    });
    //}

    function refrshData(studentData,onlineData,raiseData,countData)
    {

        var refreshObj ={};
        var refreshArr =[];

        $.each(studentData.result.data,function(i,v)
        {
            refreshObj[v.wristbandId] = {};
            refreshObj[v.wristbandId].UserName = v.studentName;
            refreshObj[v.wristbandId].WristbandMac = v.wristbandId;
            refreshObj[v.wristbandId].mac = v.wristbandId;
            refreshObj[v.wristbandId].site = false;
            //refreshObj[v.studentId].src = "../../web/classroom/image/3.jpg"
            refreshObj[v.wristbandId].total = oHandCount[v.wristbandId] == null ?0:oHandCount[v.wristbandId];
            refreshObj[v.wristbandId].up = false;
            refreshObj[v.wristbandId].studentId = v.studentId;

        })

        $.each(onlineData.result.data,function(i,v){
            if(refreshObj[v.mac]) {
                refreshObj[v.mac].site = true;
            }
        });

        $.each(raiseData.result,function(i,v){
            if(refreshObj[v.mac]) {
                refreshObj[v.mac].up  = true;
            }
        });

        // $.each(countData.result,function(i,v){
        //     if(refreshObj[v.mac]) {
        //         refreshObj[v.mac].total  = v.count;
        //     }
        // });

        $.each(refreshObj,function(i,v){
            refreshArr.push(v);
        })

        //console.log(refreshArr);
        drawStu(refreshArr);
        drawTop(refreshArr);
    }



    function getRaiseCountInfo(studentData,onlineData,raiseData,endTime)
    {
        function getRaiseInfoSucess(data)
        {
            //console.log(data)

            $.each(raiseData.result,function(i,v){
                    var name = "count"+i;
                    data.result[i] = {}
                    data.result[i].mac = v.mac;
                    
                    if(oHandCount[v.mac] == null){
                        oHandCount[v.mac]  = 0;
                    }
                    
                    data.result[i].count = oHandCount[v.mac]++;
            });
            refrshData(studentData,onlineData,raiseData,{result:oHandCount});
        }

        function getRaiseInfoFail(err)
        {
            //console.log(err)
        }
        //var oDateEnd=new Date()
        var endtime = endTime//oDateEnd.getTime();
        var oDate=new Date();
        oDate.setHours(0,0,0);
        oDate.setMilliseconds(0);
        var startTime=oDate.getTime();
        var reqData = {
            devSN:FrameInfo.ACSN,
            Method:"getRaiseInfo",
            Param:{
                devSn:FrameInfo.ACSN,
                years:crurentObj.years,
                baseGrade:crurentObj.baseGrade,
                classId:crurentObj.classId,
                //gradeType:crurentObj.gradeType,
                startTime:startTime,
                endTime:endtime
            }
        }
        var getRaiseInfoOpt = {
            url: MyConfig.path+"/smartcampusread",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data :JSON.stringify(reqData),
            onSuccess: getRaiseInfoSucess,
            onFailed: getRaiseInfoFail
        };

        Utils.Request.sendRequest(getRaiseInfoOpt);
    }

    function getRaiseInfo(studentData,onlineData)
    {
        function getRaiseInfoSucess(data)
        {
            //console.log(data)
            //假数据辅助
            if(data.result.length<=0) {
                data.result = [];
                var j = 0;
                $.each(onlineData.result.data, function (i, v) {
                    
                    if (parseInt((Math.random()) * 10)%2 == 0) {
                        data.result[j] = {};
                        data.result[j].mac = v.cardNo;
                        //data.result[j].count = oHandCount++;
                        j++;
                    }
                })
            }
            getRaiseCountInfo(studentData,onlineData,data,endTime);

        }

        function getRaiseInfoFail(err)
        {
            //console.log(err);
        }
        endTime = (new Date()).getTime();
        startTime = endTime-5000;

        var reqData = {
            devSN:FrameInfo.ACSN,
            Method:"getRaiseInfo",
            Param:{
                devSn:FrameInfo.ACSN,
                years:crurentObj.years,
                baseGrade:crurentObj.baseGrade,
                classId:crurentObj.classId,
                //gradeType:crurentObj.gradeType,
                startTime:startTime,
                endTime:endTime
            }
        }   
        var getRaiseInfoOpt = {
            url: MyConfig.path+"/smartcampusread",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data :JSON.stringify(reqData),
            onSuccess: getRaiseInfoSucess,
            onFailed: getRaiseInfoFail
        };

        Utils.Request.sendRequest( getRaiseInfoOpt );
    }

    function getOnlineInfo(studenData)
    {
        function getOnlineInfoSucess(data)
        {
            //console.log(data)
            //假数据辅助
            if(data.result.data.length<=0) {
                $.each(studenData.result.data, function (i, v) {
                    data.result.data[i] = {};
                    data.result.data[i].mac = v.wristbandId;
                })
            }
            getRaiseInfo(studenData,data);

        }

        function getOnlineInfoFail(err)
        {
            //console.log(err)
        }
        endTime = (new Date()).getTime();
        startTime = endTime-3600000;

        var reqData = {
            devSN:FrameInfo.ACSN,
            Method:"getOnsiteInfo",
            Param:{
                devSn:FrameInfo.ACSN,
                years:crurentObj.years,
                baseGrade:crurentObj.baseGrade,
                classId:crurentObj.classId,
                //gradeType:crurentObj.gradeType,
                startTime:startTime
                //endTime:endTime
            }
        }
        var getOnlineInfoOpt = {
            url: MyConfig.path+"/smartcampusread",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data :JSON.stringify(reqData),
            onSuccess: getOnlineInfoSucess,
            onFailed: getOnlineInfoFail
        };

        Utils.Request.sendRequest( getOnlineInfoOpt );
    }

    function getStudents()
    {
        function studentsSucess(data)
        {
            //console.log(data) ;
            getOnlineInfo(data);
        }

        function studentsFail(data)
        {

        }

        var reqData = {
            devSN:FrameInfo.ACSN,
            Method:"getStudent",
            Param:{
                devSn:FrameInfo.ACSN,
                years:crurentObj.years,
                baseGrade:crurentObj.baseGrade,
                classId:crurentObj.classId
            }
        }
        var getStudentsOpt = {
            url: MyConfig.path+"/smartcampusread",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data :JSON.stringify(reqData),
            onSuccess: studentsSucess,
            onFailed: studentsFail
        };

        Utils.Request.sendRequest( getStudentsOpt );

    }

    //function $set(oPara,onSuccessed,onFailed)
    //{
    //    $.ajax({
    //        type:'post',
    //        url:'/v3/wloc/wristband/bind',
    //        dataType:'json',
    //        data : oPara,
    //        success:function(data){
    //            onSuccessed && onSuccessed(data);
    //        },
    //        error:function(){
    //            console.error('Set Data Error');
    //            onFailed && onFailed(arguments);
    //        }
    //    });
    //}

    function onTopLeave()
    {
        $("#StuList .stu-item .stu-icon").removeClass("h-over");
    }

    function onTopEnter(e)
    {
        var sName = $(this).attr('mac');
        $("#StuList .stu-item").each(function(){
            if($(this).attr('mac') == sName)
            {
                $(this).find('.stu-icon').addClass('h-over');
                return false;
            }
        });
    }
    //
    //function onStuClick(e)
    //{
    //    var jItem = $(this).parent().removeClass("active");
    //    var sMac = jItem.attr("mac");
    //    if(UP_POOL[sMac])
    //    {
    //        UP_POOL[sMac].active = false;
    //    }
    //}

    function checkUp(stu)
    {
        UP_POOL = {};
        if(stu.up)
        {
            UP_POOL[stu.mac] = {};
            UP_POOL[stu.mac]["time"] = (new Date()).getTime();
            UP_POOL[stu.mac]["active"] = true;
            return true;
        }

        var oPool = UP_POOL[stu.mac];
        var nNow = (new Date()).getTime();

        if(oPool && (nNow-oPool.time) <= 20*1000 && oPool.active && stu.site)
        {
            return true;
        }

        return false;
    }

    function drawStu(aList)
    {
        var jList  = $("#StuList").empty();
        var aHtml = [];
        var sActive = "", sHtml = "", sSite = "";

        for(var i=0;i<aList.length;i++)
        {
            var oItem = aList[i];
            sActive = checkUp(oItem) ? " active" : "";
            sSite = oItem.site ? "" : "off-set";
            sHtml = '<div class="stu-item '+sActive+sSite+'" mac="'+oItem.mac+'">'+
                        '<span class="stu-icon" style="display:inline-block;"></span>'+
                        '<span class="stu-name">'+oItem.UserName+'</span>'+
                        '<image class="stu-hand" src="../../web/classroom/image/handsup.png">'+
                    '</div>';
            aHtml.push(sHtml);
        }

        jList.append(aHtml.join(''))
            //.on('click','.stu-item .stu-icon,.stu-item .stu-hand',onStuClick);
        //jList.on('click','.stu-item .stu-edit,',onEditClick);
    }

    function drawTop(aList)
    {
        var aHtml = [];
        aList.sort(function(x,y){return y.total-x.total});
        for(var i=0;i<aList.length && i<8;i++)
        {
            var oItem = aList[i];
            var sHtml = '<div class="top-item" mac="'+oItem.mac+'">'+
                            '<span class="top-icon" style="display:inline-block;background:url(../frame/css/image/smartschool.png) -318px -358px;"></span>'+
                            '<span class="top-name">'+oItem.UserName+'</span>'+
                            '<div class="top-infor">'+
                                '<span class="top-ranking">Top'+(i+1)+'</span>'+
                                '<span class="top-count">'+oItem.total+getRcText('TIME')+'</span>'+
                            '</div>'+
                        '</div>';
            aHtml.push(sHtml);
        }
        $('#HandTop').empty().append(aHtml.join('')).children().mouseenter(onTopEnter).mouseleave(onTopLeave);
    }

    //function formatData(stu,up,top,site)
    //{
    //    var aTemp = [];
    //    for(var i=0;i<stu.length;i++)
    //    {
    //        stu[i].mac = stu[i].WristbandMac;
    //        //stu[i].src = '../../web/classroom/image/'+(i+1)%22+'.jpg';
    //        stu[i].src = '../../web/classroom/image/'+3+'.jpg';
    //        stu[i].total = 0;
    //        stu[i].up = false;
    //        stu[i].site = false;
    //
    //        for(var m=0;m<top.length;m++)
    //        {
    //            if(stu[i].mac == top[m].mac)
    //            {
    //                stu[i].total = top[m].count || 0;
    //                break;
    //            }
    //        }
    //
    //        for(var n=0;n<up.length;n++)
    //        {
    //            if(stu[i].mac == up[n].mac)
    //            {
    //                stu[i].up = up[n].count > 0;
    //                break;
    //            }
    //        }
    //
    //        for(var k=0;k<site.length;k++)
    //        {
    //            if(stu[i].mac == site[k].mac)
    //            {
    //                stu[i].site = site[k].count > 0;
    //                break;
    //            }
    //        }
    //
    //        aTemp.push($.extend({},stu[i]));
    //    }
    //
    //    return aTemp.sort(function(a,b){return b.total- a.total;});
    //}

    function onReqError()
    {
        if(Timer_Error)
        {
            clearTimeout(Timer_Error);
            Timer_Error = null;
        }
        if(nError_Timeout > 50)
        {
            nError_Timeout = 0;
            Utils.Msg.error(getRcText("REQ_ERROR"));
        }
        else
        {
            Timer_Error = setTimeout(listenHandup,1000);
            nError_Timeout++;
        }
    }

    function listenHandup()
    {

        if(Timer_Interval)
        {
            clearInterval(Timer_Interval);
        }

        nError_Interval = 0;

        getStudents();

        Timer_Interval = setInterval(getStudents,60000);
    }

    function initForm()
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
                        {text:'课堂管理',href:'#C_CStatics'},
                        {text:'课堂实况',href:''}]);
        
        $("#iBack").click(function(){
            Utils.Base.redirect({ np: "classroom.classstatisc"});
        });
    }


    function getGrade(oPara)
    {
        function getGradeSuccessed(data)
        {
            //console.log(data)
            var cruClass;
            var className = "";
            var dataObj =  {}
            $.each(data.result.data,function(i,v)
            {
                className = v.grade+v.classId+"班";
                dataObj[className] = {};
                dataObj[className].baseGrade = v.baseGrade ;
                dataObj[className].classId = v.classId ;
                dataObj[className].years = v.years ;
                //dataObj[className].gradeType = v.gradeType;

                if(oPara.years == v.years && oPara.classId == v.classId && oPara.baseGrade == v.baseGrade)
                {
                    $("#CurClass").text(className);
                    cruClass = $("#CurClass").text();
                }
            })

            crurentObj = dataObj[cruClass];

            listenHandup();
        }

        function getGradeFailed()
        {

        }

        var reqData = {
            devSn :FrameInfo.ACSN,
            Method:"getClass",
            Param:{
                devSn :FrameInfo.ACSN
            }
        }
        var getStudentsOpt = {
            url: MyConfig.path+"/smartcampusread",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data :JSON.stringify(reqData),
            onSuccess: getGradeSuccessed,
            onFailed: getGradeFailed
        };

        Utils.Request.sendRequest( getStudentsOpt );

    }

    function http_getTemperature(cBack){
        var demoList = {roomTemperature: 22};
        function onSuccess(data){
            if (data.retCode == 0){ //0 代表成功
                cBack({roomTemperature:data.result});
            }else{
                cBack(demoList);
            }
        }
        
        function onFailed(){
            cBack(demoList);
        }
        
        var ajax = {
            type: 'POST',
            url: MyConfig.path + "/smartcampusread",
            contentType: "application/json",
            dataType: "json",
            timeout:20000,
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: 'getRoomTemperature',
                Param:{
                    devSn:FrameInfo.ACSN,
                    boundBuilding:'拥挤区域1'
                }
            }),
           onSuccess:onSuccess,
           onFailed:onFailed
        }

        Utils.Request.sendRequest(ajax);
    }
    
    function getTemperatureData() {
        http_getTemperature(function (res) {
           var temp = res.roomTemperature;
           $('#tem_id').text(temp + "℃");
        });
    }
    
    function _init ()
    {
        //startTime = (new Date()).getTime-3600000;
        //一天
        endTime = (new Date()).getTime();
        startTime = endTime-10000;
        oPara = {gradeType:1,baseGrade:0,years:1472659200000, classId:1};//Utils.Base.parseUrlPara();
        UP_POOL = {};
        initForm();
        getGrade(oPara);
        getTemperatureData();

    }

    function _destroy ()
    {
        if(Timer_Timeout)
        {
            clearInterval(Timer_Timeout);
            Timer_Timeout = null;
        }

        if(Timer_Interval)
        {
            clearInterval(Timer_Interval);
            Timer_Interval = null;
        }

        if(Timer_Error)
        {
            clearTimeout(Timer_Error);
            Timer_Error = null;
        }

        UP_POOL = null;

        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }

    function _resize ()
    {
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize":_resize,
        "widgets": ["Form","SingleSelect"],
        "utils":["Request","Base"]
    });
})( jQuery );