/**
 * Created by Administrator on 2016/10/16.
 */
/**
 * Created by Administrator on 2016/10/12.
 */
(function ($) {
    var MODULE_NAME = "classroom.crowddetail";
    var g_oPara = null;
    var g_buildName = null;
    var g_crowdAreaMac = null;
    var g_time=null;
    var g_detail=null;
    var g_mac=[];
    var g_jList=[];
    var g_aHtml=[];

    function getRcText(sRcName) {
        return Utils.Base.getRcString("crowd_rc", sRcName);
    }
    function getRoomConfig(oParam) {
        var oParam1={
            devSn: FrameInfo.ACSN,
            roomName:g_buildName
        };
        $.extend(oParam1,oParam);
        var option = {
            type: 'POST',
            url: MyConfig.path + '/smartcampusread',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: 'getRoomBaseConfig',
                Param: oParam1
            }),
            onSuccess: function(data){
                $("#threshold").html(data.result.data[0].crowdThreshold);
                $("#thresholdMax").html(data.result.data[0].crowdThresholdMax);
            },
            onFailed: function (err) {
                Frame.Msg.info("读取区块失败", "error");
            }
        }
        Utils.Request.sendRequest(option);
    }
    //获取学生信息
    function getStudentInfo(onSuccess){
        var oParam1 = {
            devSn:FrameInfo.ACSN
        }
        //$.extend(oParam1,oParam);
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
    function returnPage() {
        //返回至首页面
        Utils.Base.redirect({np: 'classroom.safenotice'});
        return false;
    }

    function initData(){
        getStudentInfo(onSuccess);
        function onSuccess(data){
            var oStu=data.result.data;
            var g_student=[];
            for(var j=0;j<g_crowdAreaMac.length;j++){
                for(var k=0;k<oStu.length;k++){
                    if(g_crowdAreaMac[j]==oStu[k].wristbandId){
                        var oTemp = {
                            studentName :oStu[k].studentName,
                            grade:oStu[k].grade+""+oStu[k].classId+"班",
                            wristbandId:oStu[k].wristbandId
                        };
                        g_student.push(oTemp);
                    }
                }
            }
            drawStu(g_student);
        }
        getRoomConfig();
    }
    function drawStu(oStu){
        g_jList  = $("#StuList").empty();
        g_aHtml = [];
        var sActive = "", sHtml = "", sSite = "on-site";

        for(var i=0;i<oStu.length;i++)
        {
            var oItem = oStu[i];
            //sActive = checkUp(oItem)?"active":"";
            //sSite = oItem.site?"on-site":"";
            // oTemp[item.mac].total

            sHtml = '<div class="stu-item ' + sSite + '" mac="' + oItem.wristbandId + '">' +
                '<span class="stu-icon" style="display:inline-block;"></span>' +
                '<span class="stu-name">' + oItem.studentName + '</span>' +
                '<div class="stu-grade">' + oItem.grade + '</div>' +
                '</div>';
            g_aHtml.push(sHtml);
        }
        g_jList.append(g_aHtml.join(''));
    }
    function _init() {
        g_oPara = Utils.Base.parseUrlPara();
        g_buildName = decodeURI(g_oPara.position);
        g_crowdAreaMac = decodeURI(g_oPara.crowdAreaMac).split("*");
        g_time = decodeURI(g_oPara.time);
        g_detail = decodeURI(g_oPara.detail);
        $("#build_name").html(g_buildName + getRcText("Detail"));
        $("#warning_time").html(g_time);
        $("#stuNum").html(g_crowdAreaMac.length);
        $("#crowdPer").html(g_detail.substr(4));
        $("#return").on('click', returnPage);
        initData();
    }
 
    function _destroy() {
        g_oPara = null;
        g_buildName = null;
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList", "Echart", "Form", "SingleSelect"],
        "utils": ["Request", "Base"]
    });
})(jQuery);


