(function ($) {
    var MODULE_NAME = "classroom.healthdetail";
    var g_oPara = null;
    var g_year;
    var g_class;
    var g_baseGrade;
    var g_oTime = null; 

    function getRcText (sRcName)
    {
        return Utils.Base.getRcString("health_rc",sRcName);
    }

    function reverString(method,data){
        var tDate = new Date(data);
        switch (method) {
            case "hour":
            {
                return tDate.toTimeString().slice(0,5);

            }
            case "day": case "week":case "month": case "year":
        {
            return (tDate.toLocaleDateString()+'\n' +tDate.toTimeString().slice(0,5));

        }

            default:
                return;
        }
    }

    function drawBarChart(sYAxisName,xData,yData)
    {
        var splitNumber;
        if (aInData.length > 8) {
            splitNumber = 9
        }else {
            splitNumber = aInData.length - 1;
        }
        var aArr = [];
        aInData.forEach(function(arr){
            arr[0] = new Date(arr[0]);
            aArr.push(arr[0]);
        });
        var axAxis = [
            {
                splitNumber: splitNumber,
                type: 'category',
                splitLine: true,
                axisLabel: {
                    show: true,
                    textStyle: {color: '#617085', fontSize: "12px"},
                    formatter: function (data) {
                        return (data.getMonth() + 1) + "-" + data.getDate();
                    }
                },
                axisLine: {
                    show: true,
                    lineStyle: {color: '#AEAEB7', width: 1}
                },
                axisTick: {
                    show: false
                },
                data:aTime
            }
        ];
        var option = {
            width:825,
            height:325,
            legend: {
                orient : 'horizontal',
                x : 'center',
                y : 'top',
                itemGap:30,
                itemWidth:12,
                itemHeight:8,
                data: legendArr
            },
            grid: {
                x: 40,
                y: 50,
                x2:35,
                borderColor: '#FFF'
            },
            dataZoom : {
                show : true,
                realtime : true,
                start : 90,
                end : 100,
                height: 20,
                backgroundColor: '#f5f5f5',
                dataBackgroundColor: '#f5f5f5',
            },
            calculable : false,
            xAxis : [
                {
                    name:'时间',
                    type : 'category',
                    axisLabel : {
                        'interval':0,
                        //rotate:-90,
                        margin:8,
                        formatter: function(value){
                            return value;
                        },
                        textStyle: {color: '#617085', fontSize: "12px", width: 50}
                    },
                    axisLine:{
                        onZero:true,
                        lineStyle:{
                            color: '#7F868c',
                            width: 1,
                            type: 'solid'
                        }
                    },
                    splitLine : false,
                    axisTick:{
                        show:false
                    },
                    //data : [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]
                    data:xLabel
                }
            ],
            yAxis : [
                {
                    name :sYAxisName,
                    type : 'value',
                    axisLine:{
                        onZero:true,
                        lineStyle:{
                            color: '#7f868c',
                            width: 1,
                            type: 'solid'
                        }
                    },
                    splitLine : {
                        show:false
                    },
                    axisTick:{
                        show:false
                    },
                    splitNumber:8
                }
            ],
            series:aData
        };

        $("#echart").echart ("init", option);
    }

    function getStudentHealthReport(oPara)
    {
        var oParam = {
            devSn:FrameInfo.ACSN
        };
        $.extend(oParam,oPara);
        //$.extend(oParam,g_oTime);
        function onSuccess(aData)
        {
            //result:["HeartbeatCnt","time"]
            if(aData.retCode != 0)
            {
                console.log("get StudentInfo Failed!");
                return;
            }
            //debugger;
            var aResult = aData.result.data?aData.result.data:[];
            $.each(aResult,function(index,item){
                item.heartbeat = item.heartbeat?item.heartbeat:0;
                item.step = item.step?item.step:0;
            })
            $("#health-detail").SList('refresh', { data:aResult, total: aData.result.rowCount });


        }

        var option = {
            type:"POST",
            url:"/v3/smartcampusread",
            contentType:"application/json",
            data:JSON.stringify({
                devSN:FrameInfo.ACSN,
                Method:"getStudentHealthReport",
                Param:oParam
            }),
            onSuccess:onSuccess,
            onFailed:function(textStatus,jqXHR,error)
            {
                var data = [
                    {
                        studentId: 1234,
                        studentName: '小明',
                        years:2015,
                        grade: '一年级',
                        baseGrade:'0',
                        classId: '1',
                        age: '10',
                        sex: '男',
                        heartbeat: '10',
                        step: '10',
                        stautre: '10',
                        weight: '10',
                        temperature:'10',
                        wristbandId:'11-11-12-13-11-21'
                    },
                    {
                        studentId: 1234,
                        studentName: '小刚',
                        baseGrade:'0',
                        years:2015,
                        grade: '一年级',
                        classId: '1',
                        age: '10',
                        sex: '男',
                        heartbeat: '10',
                        step: '10',
                        stautre: '10',
                        weight: '10',
                        temperature:'10',
                        wristbandId:'11-11-12-13-12-21'
                    }
                ]
                $("#health-detail").SList('refresh', data);
                //debugger;
            }
        }
        Utils.Request.sendRequest(option);
    }
    
    function importData() {
        function cancelFun(){
            Utils.Pages.closeWindow(Utils.Pages.getWindow( $("#upload_form")));
        }
        $("#upload_form").form ("init", "edit", {"title":"导入体检数据",
            "btn_apply":false, "btn_cancel":cancelFun/*CancelShop*/});

        Utils.Base.openDlg(null, {}, {scope:$("#upload"),className:"modal-large"});

        $('input[id=lefile]').change(function() {
            $('#photoCover').val($(this).val());
        });

        //$("#btn").click(function(){
        //    //加载图标
        //    /* $("#loading").ajaxStart(function(){
        //     $(this).show();
        //     }).ajaxComplete(function(){
        //     $(this).hide();
        //     });*/
        //    //上传文件
        //    $.ajaxFileUpload({
        //        url:'upload.php',//处理图片脚本
        //        secureuri :false,
        //        fileElementId :'fileToUpload',//file控件id
        //        dataType : 'json',
        //        success : function (data, status){
        //            if(typeof(data.error) != 'undefined'){
        //                if(data.error != ''){
        //                    alert(data.error);
        //                }else{
        //                    alert(data.msg);
        //                }
        //            }
        //        },
        //        error: function(data, status, e){
        //            alert(e);
        //        }
        //    })
        //    return false;
        //})

    }
    
    function downloadData() {
        
    }

    function initSlistData(pageNum, pageSize, oFilter) {
        //function onSuc(aData) {
        //    if(aData.retCode != 0)
        //    {
        //        console.log("gradeConf failed");
        //        return;
        //    }

            //var oResult = aData.result[0]?aData.result[0]:{};

            var pageSize = pageSize || 10;
            var Num = pageNum || 1;
            var oFilter = oFilter || {};
            var oParam = {
                devSn: FrameInfo.ACSN,
                startRowIndex: 10 * (Num - 1),
                maxItem: 10,
                classId: g_class,
                years: g_year,
                baseGrade:g_baseGrade
            };
            //$.extend(oParam,oResult);
            $.extend(oParam, oFilter);
            getStudentHealthReport(oParam);
        //}

        //var option = {
        //    type:"POST",
        //    url:"/v3/smartcampusread",
        //    contentType:"application/json",
        //    data:JSON.stringify({
        //        devSN:FrameInfo.ACSN,
        //        Method:"getRealTimeClassroomSta",
        //        Param:{
        //            devSn:FrameInfo.ACSN
        //        }
        //    }),
        //    onSuccess:onSuc,
        //    onFailed: function (jqXHR, textstatus, error) {
        //        debugger;
        //        Frame.Msg.info("数据更新失败", "error");
        //    }
        //}
        //
        //Utils.Request.sendRequest(option);

    }

    function editData(param){
        function applyFun(){
            var stature =Number($("#Height").val());
            var weight = Number($("#Weight").val());
            var oparam = {
                devSn:FrameInfo.ACSN,
                objectId:param[0].studentId,
                objectName:param[0].studentName,
                //birthday:param[0].birthday,
                stature:stature,
                weight:weight
                //time:(new Date()).getTime()
            }

            function onSuc(aData)
            {
                if(aData.retCode != 0)
                {
                    Frame.Msg.info("学生配置失败！");
                    console.log("set weight and stature failed");
                    return;
                }
                Utils.Pages.closeWindow(Utils.Pages.getWindow( $("#Stu_form")));
                Utils.Base.refreshCurPage();
            }

            var option = {
                type:"POST",
                url:"/v3/smartcampuswrite",
                contentType:"application/json",
                data:JSON.stringify({
                    devSN:FrameInfo.ACSN,
                    Method:"addHealthInfo",
                    Param:oparam
                }),
                onSuccess:onSuc,
                onFailed: function (jqXHR, textstatus, error) {
                    debugger;
                    Frame.Msg.info("数据更新失败", "error");
                }
            }

            Utils.Request.sendRequest(option);
        }

        function cancelFun(){
            Utils.Pages.closeWindow(Utils.Pages.getWindow( $("#Stu_form")));
        }

        $("#Stu_form").form ("init", "edit", {"title":getRcText("EDIT_TITLE"),
            "btn_apply":applyFun, "btn_cancel":cancelFun});

        Utils.Base.openDlg(null, {}, {scope:$("#StuDlg"),className:"modal-large"});
        var stuname = param[0].studentName;
        var height = param[0].stature;
        var weight = param[0].weight;
        $("#studentName").html(stuname);
        $("#Height").val(height);
        $("#Weight").val(weight);
        var re=/[^(\d+(\.\d+)?)]/;
        $("#Height").on("input",function(){
            var str=this.value;
            if(re.test(str)){
                $("#Height_error").css({height:"22px",width:"115px",display:"inline-block"});
                $("#Height_error").html("必须为数字");
                this.value=str.replace(re,"");
            }else{
                $("#Height_error").css({display:"none"});
            }
        });
        $("#Weight").on("input",function(){
            var str=this.value;
            if(re.test(str)){
                $("#Weight_error").css({height:"22px",width:"115px",display:"inline-block"});
                $("#Weight_error").html("必须为数字");
                this.value=str.replace(re,"");
            }else{
                $("#Weight_error").css({display:"none"});
            }
        });
    }

    function clickPic(e)
    {

        Utils.Base.openDlg(null, {}, {scope:$("#echartDlg"),className:"modal-super"});
        var sName = $(this).attr("name");
        var years = parseInt($(this).attr("years"));
        var classId = parseInt($(this).attr("classId"));
        var studentName = $(this).attr("studentName");
        var wristbandId = $(this).attr("wristbandId");

        $("#pie-title").html("");
        switch(sName)
        {
            case "heart":
            {
                $("#pie-title").html("心率");
                break;
            }
            case "step":
            {
                $("#pie-title").html("步数");
                break;
            }
            case "weight":
            {
                $("#pie-title").html("体重");
                break;
            }
            case "height":
            {
                $("#pie-title").html("身高");
                break;
            }
            case "temperature":
            {
                $("#pie-title").html("体温");
                break;
            }
            default:
                break;
        }



    }
    
    function initSlist() {
        function format(row,cell,value,columnDef,dataContext,type){
            //dataContext:{grade,years,baseGrade,classId,studentName,studentId,age,sex,stautre,weight,heartbeat,step}
            var value = value ||"";
            if("text" == type)
            {
                return value;
            }
            switch(cell) {
                case 3:{
                    return "<p>"+dataContext["classId"]+"班</p>";
                }
                case 6:
                {
                    if (dataContext["heartbeat"]||dataContext["heartbeat"]==0) {
                        return "<p class='float-left list-link' type='0'>" + dataContext["heartbeat"] + "</p><p  class='smart-pic heart-rate' name='heart' baseGrade=" + dataContext["baseGrade"] + " years=" + dataContext['years'] + " classId=" + dataContext['classId'] + " studentName=" + dataContext['studentName'] + " wristbandId=" + dataContext['wristbandId'] + "></p>";

                    }
                }
                case 7 :
                {
                    if (dataContext["step"]||dataContext["step"]==0) {
                        return "<p class='float-left list-link' type='0'>" + dataContext["step"] + "</p><p  class='smart-pic step-count' name='step' baseGrade=" + dataContext["baseGrade"] + " years=" + dataContext['years'] + " classId=" + dataContext['classId'] + " studentName=" + dataContext['studentName'] + " wristbandId=" + dataContext['wristbandId'] + "></p>";
                    }
                }
                case 8 :
                {
                    if (dataContext["stature"]||dataContext["stature"]==0) {
                        return "<p class='float-left list-link' type='0'>" + dataContext["stature"] + "</p><p  class='smart-pic stu-height' name='height' baseGrade=" + dataContext["baseGrade"] + " years=" + dataContext['years'] + " classId=" + dataContext['classId'] + " studentName=" + dataContext['studentName'] + " wristbandId=" + dataContext['wristbandId'] + "></p>";

                    }
                }
                case 9 :
                {
                    if (dataContext["weight"]||dataContext["weight"]==0) {
                        return "<p class='float-left list-link' type='0'>" + dataContext["weight"] + "</p><p  class='smart-pic stu-weight' name='weight' baseGrade=" + dataContext["baseGrade"] + " years=" + dataContext['years'] + " classId=" + dataContext['classId'] + " studentName=" + dataContext['studentName'] + " wristbandId=" + dataContext['wristbandId'] + "></p>";
                    }
                }
                case 10 :
                {
                    if (dataContext["temperature"]||dataContext["temperature"]==0) {
                        return "<p class='float-left list-link' type='0'>" + dataContext["temperature"] + "</p><p  class='smart-pic stu-temperature' name='temperature' baseGrade=" + dataContext["baseGrade"] + " years=" + dataContext['years'] + " classId=" + dataContext['classId'] + " studentName=" + dataContext['studentName'] + " wristbandId=" + dataContext['wristbandId'] + "></p>";
                    }
                }
                default:
                    break;
            }
        }
        var option = {
            colNames: ['学号', '姓名','年级', '班号', '年龄', '性别', '心率(次/每分钟)', '步数', '身高(cm)', '体重(kg)','体温（度）'],
            showHeader: true,
            multiSelect: true,
            showOperation: true,
            pageSize: 10,
            asyncPaging:true,
            onPageChange:function(pageNum,pageSize,oFilter){
                console.log("hahh")
                if(oFilter){
                    var oFilt = {
                        studentIdWeak: oFilter.studentId,
                        studentNameWeak: oFilter.studentName,
                        grade:oFilter.grade,
                        classIdWeak: oFilter.classId,
                        age: oFilter.age,
                        sex: oFilter.sex,
                        heartbeat: oFilter.heartbeat,
                        step: oFilter.step,
                        stature: oFilter.stature,
                        weight: oFilter.weight,
                        temperature:oFilter.temperature
                    }
                }
                initSlistData(pageNum,pageSize,oFilt);
            },
            onSearch: function(oFilter,oSorter) {
                if(oFilter){
                    var oFilt = {
                        studentIdWeak: oFilter.studentId,
                        studentNameWeak: oFilter.studentName,
                        grade:oFilter.grade,
                        classIdWeak: oFilter.classId,
                        age: oFilter.age,
                        sex: oFilter.sex,
                        heartbeat: oFilter.heartbeat,
                        step: oFilter.step,
                        stature: oFilter.stature,
                        weight: oFilter.weight,
                        temperature:oFilter.temperature
                    }
                }
               initSlistData(0, 10, oFilt);
            },
            colModel: [
                {name: 'studentId', value: 'String',width:150},
                {name: 'studentName', value: 'String',width:100},
                {name: 'grade', value: 'String',width:100},
                {name: 'classId', value: 'String',formatter:format,width:100},
                {name: 'age', value: 'String',width:100},
                {name: 'sex', value: 'String',width:100},
                {name: 'heartbeat', value: 'String',formatter:format,width:150},
                {name: 'step', value: 'String',formatter:format,width:100},
                {name: 'stature', value: 'String',formatter:format,width:100},
                {name: 'weight', value: 'String',formatter:format,width:100},
                {name: 'temperature',value:'String',formatter:format,width:100}
            ],
            // onToggle: {
            //     action: function () {
                    
            //     },
            //     jScop: $('#healthToggle')
            // },
            //showOperation:true,
            buttons: [
                {name: "default",value: '导入体检数据', action: importData},
                {name: "default",value: '导出报告', action: downloadData},
                {name: 'edit',value:'编辑',action:editData},
                {name: "detail", enable: true, value: "详情", action: detailMasage}
            ]
        }

        $("#health-detail").on('click','p.smart-pic',clickPic);
        $("#health-detail").SList('head', option);

    }
    //*跳转至个人健康详情
    function detailMasage(oParam){
                //wristhandId:oParam[0].wristhandId,
                Utils.Base.redirect (
             {np:"classroom.personalhealth",
                years:oParam[0].years,
                baseGrade:oParam[0].baseGrade,
                gradeType:oParam[0].gradeType,
                studentName:oParam[0].studentName,
                studentId:oParam[0].studentId,
                classId:oParam[0].classId,
                gradeId:oParam[0].grade,
                sex:oParam[0].sex,
                birthday:oParam[0].birthday,
                stature:oParam[0].stature,//身高
                weight:oParam[0].weight,//体重
                heartbeat:oParam[0].heartbeat,//心率
                step:oParam[0].step,//步数
                //没有距离 卡路里
            });//将当前选中行的数据以键值对的形式传递到下一个页面
            }
    function initData() {
        initSlistData();

    }
    function returnPage(){
        //返回至首页面
        Utils.Base.redirect({np: 'classroom.healthmanage'});
        return false;
    }
    
    function _init () {
        g_oPara = Utils.Base.parseUrlPara();
        if(g_oPara.years) {
            g_year = parseInt(g_oPara.years);
            if(g_oPara.classId) {
                g_class = parseInt(g_oPara.classId);
            }else{
                g_class = undefined;
            }
            if(g_oPara.baseGrade)
            {
                g_baseGrade = parseInt(g_oPara.baseGrade);
            }else{
                g_baseGrade = undefined;
            }
        }else{
            g_year = undefined;
            g_class = undefined;
        }

        var end = (new Date()).getTime();
        var start = end-3600000*24;
        if(Boolean(g_oPara.startTime&&g_oPara.endTime))
        {
           g_oTime = {
               startTme:g_oPara.startTime,
               endTime:g_oPara.endTime
           }
        }else{
            g_oTime = {
                startTime:start,
                endTime:end
            }
        }
        $("#return").on('click', returnPage);
        initSlist();
        initData();
    }
    
    function _destroy() {
        
    }
    
    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList","Echart","Form"],
        "utils":["Request","Base"]
    });
})(jQuery);