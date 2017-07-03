(function ($) {
    var MODULE_NAME = "classroom.healthmanage";
    var g_oGradeInfo  = null;
    var gyears= null;
    var gclass= null;
    var gbasegrade = null;
    var Time_Interval = null;
    var g_oClassYearList;
    var g_oGradeClass = null;
    var g_selectGradeObj = {};
    var g_sexData={};
    var g_heightData={};
    var g_weightData={};
    var g_ageData={};
    
    var g_param = {};


    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("c_health_rc", sRcName).split(",");
    }
    
    function http_getStudentHealthReport(oPara, cBack)
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
            onSuccess:function(data){
                if(data.retCode != 0)
                {
                    console.log("get StudentInfo Failed!");
                    cBack("faild");
                }else{
                    
                    cBack(data);
                }
            },
            onFailed:function(textStatus,jqXHR,error)
            {
                cBack("faild");
            }
        }
        Utils.Request.sendRequest(option);
    }
  
    function getAgeInfo(para){
        var ageOverView = [];
        var aGrade = [{ageSegmentString:"0～6岁",ageNum:30},
                        {ageSegmentString:"7～9岁",ageNum:45},
                        {ageSegmentString:"10～12岁",ageNum:50},
                        {ageSegmentString:"12岁以上",ageNum:40}];
                        
        aGrade = para || aGrade;
        
        var totalCount = aGrade[0].ageNum + aGrade[1].ageNum + aGrade[2].ageNum +aGrade[3].ageNum;
        
        var aColor = ['#42a5f5','#26a69a','#ef5350','#ffca28'];
        $.each(aGrade,function(index,item){
            ageOverView.push({
                value:item.ageNum,
                name:item.ageSegmentString,
                itemStyle:{
                    normal:{
                        color:aColor[index],
                    },
                    emphasis:{
                        color:'rgba(0,0,0,0)'
                    }
                }
            });
        });
        initEchart($('#age-overview_1'),ageOverView, "年龄", false, 150);
        
        $("#age_1 small")[0].innerText = aGrade[0].ageSegmentString || "0～6岁";
        $("#age_2 small")[0].innerText = aGrade[1].ageSegmentString || "7～9岁";
        $("#age_3 small")[0].innerText = aGrade[2].ageSegmentString || "10～12岁";
        $("#age_4 small")[0].innerText = aGrade[3].ageSegmentString || "12岁以上";
        
        $("#age_1 small")[1].innerText = aGrade[0].ageNum +"人";
        $("#age_2 small")[1].innerText = aGrade[1].ageNum +"人";
        $("#age_3 small")[1].innerText = aGrade[2].ageNum +"人";
        $("#age_4 small")[1].innerText = aGrade[3].ageNum +"人";
        $("#age_pro_1").css("width",parseInt(aGrade[0].ageNum*100/totalCount)+"%");
        $("#age_pro_2").css("width",parseInt(aGrade[1].ageNum*100/totalCount)+"%");
        $("#age_pro_3").css("width",parseInt(aGrade[2].ageNum*100/totalCount)+"%");
        $("#age_pro_4").css("width",parseInt(aGrade[3].ageNum*100/totalCount)+"%");
    }
    
    function getSexInfo(para){
        var data = para || {maleNum: 70, femaleNum:80};
        // drawSexBar($("#sex-overview_1"), 70, "#42a5f5");
        // drawSexBar($("#sex-overview_2"), 80, "#ef5350");
        
        $("#male_count").text(para.maleNum + "人");
        $("#female_count").text(para.femaleNum + "人");
        
        var ageOverView = [];
        var aGrade = [{ageSegmentString:"男学生", ageCount:data.maleNum},
                        {ageSegmentString:"女学生", ageCount:data.femaleNum}];
        
        var aColor = ['#42a5f5','#ef5350','#26a69a','#ffca28'];
        $.each(aGrade,function(index,item){
            ageOverView.push({
                value:item.ageCount,
                name:item.ageSegmentString,
                itemStyle:{
                    normal:{
                        color:aColor[index],
                    },
                    emphasis:{
                        color:'rgba(0,0,0,0)'
                    }
                }
            });
        });
        initEchart($('#sex-overview_chart'),ageOverView, "性别", true, 300);
        
    }
    
    function getHeighAndWeight(wPara, hPara, vWpara, vHpara){
        var weightData = wPara || {'thinNum':26, 'normalNum':64, 'fatNum':60};
        var heightDate = hPara || {'shortNum':12, 'normalNum':105, 'tallNum':33};
        var vWeight = parseFloat(vWpara).toFixed(1) || 48;
        var vHeight = parseFloat(vHpara).toFixed(1) || 147;
        
        drawGaugeChart($("#verweight_chart"), vWeight);
        
        drawSexBar($("#verheight_chart"), vHeight, "#26a69a");
        
        drawBarTwo($("#height_chart"), {a:heightDate.shortNum, b:heightDate.normalNum, c:heightDate.tallNum},{a:'偏矮', b:'适中', c:'偏高'});
        drawBarTwo($("#weight_chart"), {a: weightData.thinNum, b: weightData.normalNum, c: weightData.fatNum},{a:'偏瘦', b:'适中', c:'偏胖'});
                    
    }
    
    function getStepCountInfo(oPara){
        var param = oPara || {"time":['周一','周二','周三','周四','周五','周六','周日'],
                                "data":[41, 121, 550, 254, 260, 830, 710]};
        var aData = [];
        var aTime = [];
        
        for(var o in param){
            aTime.push(o.substring(5));
            aData.push(param[o]);
        }
                                
        drawHistStepChart($("#oneWeek_bar"),aData,aTime);
        
    }
    
    function getHealthDetail(pageNum, pageSize, oFilter){
        
        var pageSize = pageSize || 10;
        var Num = pageNum || 1;
        var oFilter = oFilter || {};
        var oParam = {
            devSn: FrameInfo.ACSN,
            startRowIndex: 10 * (Num - 1),
            maxItem: 10,
            classId: null,
            years: null,
            baseGrade:null
        };
        
        //$.extend(oParam,oResult);
        $.extend(oParam, oFilter);
        http_getStudentHealthReport(oParam, function(res){
            if(res == "faild"){
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
                
            }else{
                
                var aResult = res.result.data?res.result.data:[];
                $.each(aResult,function(index,item){
                    item.heartbeat = item.heartbeat?item.heartbeat:0;
                    item.step = item.step?item.step:0;
                })
                $("#health-detail").SList('refresh', { data:aResult, total: res.result.rowCount });
            }
        });
    }
    
    function reverString(method,data){
        var tDate = new Date(data);
        switch (method) {
            case "hour":
            {
                return tDate.toTimeString().slice(0,5);

            }
            case "day":case "month": case "year":
            {
                return (tDate.toLocaleDateString()+'\n' +tDate.toTimeString().slice(0,5));

            }

            default:
                return;
        }
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
            wristbandId:oParam[0].wristbandId
            //没有距离 卡路里
            });//将当前选中行的数据以键值对的形式传递到下一个页面
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

    function drawGaugeChart(jDom, count){
        var option = {
            tooltip : {
                formatter: "{a} <br/>{b} : {c}%"
            },
            series : [
                {
                    name:'平均体重',
                    type:'gauge',
                    min:0,
                    max:100,
                    splitNumber:4,
                    axisLine: {            // 坐标轴线
                        lineStyle: {       // 属性lineStyle控制线条样式
                            width: 2
                        }
                    },
                    axisTick: {            // 坐标轴小标记
                        length :0,        // 属性length控制线长
                        lineStyle: {       // 属性lineStyle控制线条样式
                            color: 'auto'
                        }
                    },
                    splitLine: {           // 分隔线
                        length :5,         // 属性length控制线长
                        lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                            color: 'auto'
                        }
                    },
                    title : {
                        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            fontWeight: 'bolder',
                            fontSize: 20,
                            fontStyle: 'italic'
                        }
                    },
                    pointer: {
                        width:2
                    },
                    detail : {
                        formatter:'{value}公斤',
                        textStyle: {
                                color: 'auto',
                                fontSize : 18
                            },
                        offsetCenter: [0, '40%'],
                    },
                    data:[{value: count, name: ''}]
                }
            ]
        };

        jDom.echart("init", option);
    }
    
    function drawBarTwo(jDom, para, content){
        var option = {
            width:300,
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data:[content.a, content.b, content.c]
            },
            grid: {
                borderWidth: 0,
                x:5,
                y:40,
                x2:5,
                y2:55
            },
            calculable : false,
            xAxis : [
                {
                    type : 'value',
                    show : false
                }
            ],
            yAxis : [
                {
                    show:false,
                    type : 'category',
                    // min:100,
                    // max:200,
                    data : ['比例']
                }
            ],
            series : [
                {
                    name: content.a,
                    type:'bar',
                    stack: '身高',
                    barWidth:30,
                    itemStyle : { normal: {label : {show: true, position: 'insideRight'}, barBorderRadius:8}},
                    data:[para.a],
                    
                },
                {
                    name: content.b,
                    type:'bar',
                    stack: '身高',
                    barWidth:30,
                    itemStyle : { normal: {label : {show: true, position: 'insideRight'}, barBorderRadius:8}},
                    data:[para.b]
                },
                {
                    name: content.c,
                    type:'bar',
                    stack: '身高',
                    barWidth:30,
                    itemStyle : { normal: {label : {show: true, position: 'insideRight'}, barBorderRadius:8}},
                    data:[para.c]
                }
            ]
        };
          
        jDom.echart("init", option);          
    }

    function drawEmptyPie(jDom,oData, title)
    {
        var oOption = {
            legend: {
                orient: 'horizontal',
                x : 'center',
                y : 'bottom',
                data: oData.oLegend
            },
            calculable: false,
            title: {
                text: title,
                x: 'center',
                y: 'center',
                textStyle : {
                    fontSize : 25,
                    fontWeight : 300
                }
            },
            series: [
                {
                    name: '',
                    type: 'pie',
                    radius: ['50%', '70%'],
                    itemStyle: {
                        normal: {
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            }
                        }
                    },
                    //center: ['60%', '50%'],
                    data:oData.data
                }
            ]
        };
        jDom.echart("init", oOption);
    }
    
    function drawHistStepChart(jDom, aData, aTime){
        var oOption = {
            // title : {
            //     text: '某楼盘销售情况',
            //     subtext: '纯属虚构'
            // },
            tooltip : {
                trigger: 'axis'
            },
            // legend: {
            //     data:['意向','预购','成交']
            // },
            grid: {
                borderWidth: 0,
                x:50,
                x2:10,
                y: 10,
                y2: 30
            },
            calculable : false,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : true,
                    splitLine:false,
                    axisLine:{
                        lineStyle:{
                            color: 'rgba(119,119,119,0.5)',
                            width: 1,
                            type: 'solid'
                        }
                    },
                    data : aTime//['周一','周二','周三','周四','周五','周六','周日']
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisLine:{
                        lineStyle:{
                            color: 'rgba(119,119,119,0.5)',
                            width: 1,
                            type: 'solid'
                        }
                    },
                    splitLine:false
                }
            ],
            series : [
                {
                    name:'成交',
                    type:'line',
                    smooth:true,
                    itemStyle: {normal: {color:"rgba(38,166,154,1)",areaStyle: {type: 'default',color:"rgba(38,166,154,0.2)"}}},
                    
                    data: aData//[10, 12, 21, 54, 260, 830, 710]
                }
            ]
        };
                
        jDom.echart("init", oOption);    
    }
    
    function initEchart(jDom, aData, title, isShowTip, nWidth) {
        var legendArr = [];
        aData.forEach(function (item) {
            legendArr.push(item.name);
        }, this);

        var option = {
            width:nWidth,
            tooltip : {
                trigger: 'item',
                formatter: "比例： <br/>{b} : {d}%"
            },
            legend: {
                show:false,
                orient: 'horizontal',
                x : 'center',
                y : 'bottom',
                data: legendArr
            },
            calculable: false,
            series:[
                {
                    name: '',
                    type: 'pie',
                    radius: ['50%', '80%'],
                    itemStyle: {
                        normal: {
                            label: {
                                show: isShowTip
                            },
                            labelLine: {
                                show: isShowTip,
                                length:10
                            }
                        }
                    },
                    center: ['50%', '50%'],
                    data: aData
                }
            ]
        };
        jDom.echart("init", option);
    }
    
    function initSlist() {
        $("#health-detail").empty();
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
                getHealthDetail(pageNum,pageSize,oFilt);
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
               getHealthDetail(0, 10, oFilt);
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
                // {name: "default",value: '导入体检数据', action: function(){}},
                // {name: "default",value: '导出报告', action: function(){}},
                // {name: 'edit',value:'编辑',action:editData},
                {name: "detail", enable: true, value: "详情", action: detailMasage}
            ]
        }

        //$("#health-detail").on('click','p.smart-pic',clickPic);
        $("#health-detail").SList('head', option);

    }
    
    function drawSexBar(jDom, s_count, s_color){
        var option = {
            
            tooltip: {
                trigger: 'item'
            },
            calculable: true,
            grid: {
                borderWidth: 0,
                x:5,
                y:5,
                x2:5,
                y2:55
            },
            xAxis: [
                {
                    type: 'category',
                    show: false,
                    data: ['Bar']
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    show: false,
                    min:0,
                    max:200
                }
            ],
            series: [
                {
                    name: '男',
                    type: 'bar',
          	        barWidth: 60,
                    itemStyle: {
                        normal: {
                            color: s_color,
                            label: {
                                show: true,
                                position: 'top',
                                formatter: '\n{c}厘米',
                                textStyle:{
                                    // color: '#FFF',
                                    fontSize:18,
                                    // fontStyle:'italic'
                                }
                            },
                            labelLine:{
                              show:true,
                              length:-10  
                            },
                            barBorderRadius:8
                        }
                    },
                    data: [s_count],
                    // markPoint: {
                    //     tooltip: {
                    //         trigger: 'item',
                    //         backgroundColor: 'rgba(0,0,0,0)',
                    //         formatter: function(params){
                    //             return '<img src="' 
                    //                     + params.data.symbol.replace('image://', '')
                    //                     + '"/>';
                    //         }
                    //     },
                    //     data: [
                    //         {xAxis:10, y: 350, name:'Funnel', symbolSize:20, symbol: 'image://../asset/ico/漏斗图.png'},
                    //     ]
                    // }
                }
            ]
        };
        
        jDom.echart("init", option);
                    
    }
    
    function bulidData(){
        g_ageData.oLegend=['其它'];
        g_ageData.data=[ {
            name:'其它',
            value:100,
            itemStyle:{
                normal:{
                    color:'#f5f5f5'
                }
            }
        }];
        g_sexData.oLegend=['男','女','其它'];
        g_sexData.data=[
            {
                name:'男',
                value:0,
                itemStyle:{
                    normal:{
                        color:'#4ec1b2'
                    }
                }
            },
            {
                name:'女',
                value:0,
                itemStyle:{
                    normal:{
                        color:'#fe808b'
                    }
                }
            },
            {
                name:'其它',
                value:100,
                itemStyle:{
                    normal:{
                        color:'#f5f5f5'
                    }
                }
            }
        ];
        g_weightData.oLegend=['偏瘦','正常','偏胖','其它'];
        g_weightData.data=[
            {
                name:'偏瘦',
                value:0,
                itemStyle:{
                    normal:{
                        color:'#f2bc98'
                    }
                }},
            {
                name:'正常',
                value:0,
                itemStyle:{
                    normal:{
                        color:'#4ec1b2'
                    }
                }},
            {
                name:'偏胖',
                value:0,
                itemStyle:{
                    normal:{
                        color:'#fe808b'
                    }
                }},
            {
                name:'其它',
                value:100,
                itemStyle:{
                    normal:{
                        color:'#f5f5f5'
                    }
                }}
        ];
        //身高数据
        g_heightData.oLegend=['偏矮','正常','偏高','其它'];
        g_heightData.data=[
            {
                name:'偏矮',
                value:0,
                itemStyle:{
                    normal:{
                        color:'#f2bc98'
                    }
                }},
            {
                name:'正常',
                value:0,
                itemStyle:{
                    normal:{
                        color:'#4ec1b2'
                    }
                }},
            {
                name:'偏高',
                value:0,
                itemStyle:{
                    normal:{
                        color:'#fe808b'
                    }
                }},
            {
                name:'其它',
                value:100,
                itemStyle:{
                    normal:{
                        color:'#f5f5f5'
                    }
                }}
        ]
    }

    // function initMessageOverview(aYear,aSex,aWeight,aHeight){
        
    //     var aGrade = [];
    //     if (aYear.length == 0)
    //     {
    //         drawEmptyPie($('#age-overview'),g_ageData, "年龄");
    //     }else{
    //         aGrade = aYear;
    //         var ageOverView = [];
    //         var aColor = ['#4ec1b2','#f2bc98','#fe808b','#f5f5f5'];
    //         $.each(aGrade,function(index,item){
    //             ageOverView.push({
    //                 value:item.ageRatio,
    //                 name:item.ageSegmentString,
    //                 itemStyle:{
    //                     normal:{
    //                         color:aColor[index],
    //                     },
    //                     emphasis:{
    //                         color:'rgba(0,0,0,0)'
    //                     }
    //                 }
    //             });
    //         });
    //         initEchart($('#age-overview'),ageOverView, "年龄",false);
    //     }

    //     var oSex;
    //     if(!Boolean(aSex.maleRatio||aSex.femaleRatio))
    //     {
    //         var oSexData={};
    //         oSexData.oLegend=['男','女','其它'];
    //         oSexData.data=[
    //             {
    //                 name:'男',
    //                 value:0,
    //                 itemStyle:{
    //                     normal:{
    //                         color:'#4ec1b2'
    //                     }
    //                 }
    //             },
    //             {
    //                 name:'女',
    //                 value:0,
    //                 itemStyle:{
    //                     normal:{
    //                         color:'#fe808b'
    //                     }
    //                 }
    //             },
    //             {
    //                 name:'其它',
    //                 value:100,
    //                 itemStyle:{
    //                     normal:{
    //                         color:'#f5f5f5'
    //                     }
    //                 }
    //             }
    //         ];
    //         drawEmptyPie($('#sex-overview'),g_sexData, "性别");
    //     }else{
    //         oSex = {
    //             maleRatio:aSex.maleRatio,
    //             femaleRatio:aSex.femaleRatio
    //         }

    //         var sexOverview = [
    //             {
    //                 value: oSex.maleRatio,
    //                 name: '男',
    //                 itemStyle:{
    //                     normal:{
    //                         color:'#4ec1b2',
    //                         label:{
    //                             show:false
    //                         },
    //                         labelLine:{
    //                             show:false
    //                         }
    //                     },
    //                     emphasis:{
    //                         color:'rgba(0,0,0,0)'
    //                     }
    //                 }
    //             },
    //             {
    //                 value: oSex.femaleRatio,
    //                 name: '女',
    //                 itemStyle:{
    //                     normal:{
    //                         color:'#fe808b',
    //                         label:{
    //                             show:false
    //                         },
    //                         labelLine:{
    //                             show:false
    //                         }
    //                     },
    //                     emphasis:{
    //                         color:'rgba(0,0,0,0)'
    //                     }
    //                 }
    //             }
    //         ];

    //         initEchart($('#sex-overview'), sexOverview, "性别", false);
    //     }

    //     var oWeight = {};
    //     if(!Boolean(aWeight.thinRatio||aWeight.normal||aWeight.fatRatio))
    //     {
    //         drawEmptyPie($('#weight-overview'),g_weightData, "体重");

    //     }else{
    //         oWeight = {
    //             thinRatio:aWeight.thinRatio,
    //             normal:aWeight.normal,
    //             fatRatio:aWeight.fatRatio
    //         }

    //         var weightOverview = [
    //             {
    //                 value: oWeight.thinRatio,
    //                 name: '偏瘦',
    //                 itemStyle:{
    //                     normal:{
    //                         color:'#f2bc98',
    //                         label:{
    //                             show:false
    //                         },
    //                         labelLine:{
    //                             show:false
    //                         }
    //                     },
    //                     emphasis:{
    //                         color:'rgba(0,0,0,0)'
    //                     }
    //                 }
    //             },
    //             {
    //                 value: oWeight.normal,
    //                 name: '正常',
    //                 itemStyle:{
    //                     normal:{
    //                         color:'#4ec1b2',
    //                         label:{
    //                             show:false
    //                         },
    //                         labelLine:{
    //                             show:false
    //                         }
    //                     },
    //                     emphasis:{
    //                         color:'rgba(0,0,0,0)'
    //                     }
    //                 }
    //             },
    //             {
    //                 value: oWeight.fatRatio,
    //                 name: '偏胖',
    //                 itemStyle:{
    //                     normal:{
    //                         color:'#fe808b',
    //                         label:{
    //                             show:false
    //                         },
    //                         labelLine:{
    //                             show:false
    //                         }
    //                     },
    //                     emphasis:{
    //                         color:'rgba(0,0,0,0)'
    //                     }
    //                 }
    //             }
    //         ];
    //         initEchart($('#weight-overview'), weightOverview, "体重", false);
    //     }

    //     var oHeight = {};
    //     if(!Boolean(aHeight.shortRatio||aHeight.normal||aHeight.tallRatio))
    //     {
    //         drawEmptyPie($('#height-overview'),g_heightData, "身高");

    //     }else{
    //         oHeight = {
    //             shortRatio:aHeight.shortRatio,
    //             normal:aHeight.normal,
    //             tallRatio:aHeight.tallRatio,
    //             unknown:aHeight.unknown
    //         }

    //         var heightOverview = [
    //             {
    //                 value:oHeight.shortRatio,
    //                 name: '偏矮',
    //                 itemStyle:{
    //                     normal:{
    //                         color:'#f2bc98',
    //                         label:{
    //                             show:false
    //                         },
    //                         labelLine:{
    //                             show:false
    //                         }
    //                     },
    //                     emphasis:{
    //                         color:'rgba(0,0,0,0)'
    //                     }
    //                 }
    //             },
    //             {
    //                 value:oHeight.normal,
    //                 name: '正常',
    //                 itemStyle:{
    //                     normal:{
    //                         color:'#4ec1b2',
    //                         label:{
    //                             show:false
    //                         },
    //                         labelLine:{
    //                             show:false
    //                         }
    //                     },
    //                     emphasis:{
    //                         color:'rgba(0,0,0,0)'
    //                     }
    //                 }
    //             },
    //             {
    //                 value:oHeight.tallRatio,
    //                 name: '偏高',
    //                 itemStyle:{
    //                     normal:{
    //                         color:'#fe808b',
    //                         label:{
    //                             show:false
    //                         },
    //                         labelLine:{
    //                             show:false
    //                         }
    //                     },
    //                     emphasis:{
    //                         color:'rgba(0,0,0,0)'
    //                     }
    //                 }
    //             },
    //             {
    //                 value:oHeight.unknown,
    //                 name: '其他',
    //                 itemStyle:{
    //                     normal:{
    //                         color:'#f5f5f5',
    //                         label:{
    //                             show:false
    //                         },
    //                         labelLine:{
    //                             show:false
    //                         }
    //                     },
    //                     emphasis:{
    //                         color:'rgba(0,0,0,0)'
    //                     }
    //                 }
    //             }
    //         ];
    //         initEchart($('#height-overview'), heightOverview, "身高", false);
    //     }


    // }

    function getHealthSta(oPara)
    {
        /*
             oPara = {
                years:years,//缺省为全校
                classId:classId,//缺省为全校
                baseGrade:baseGrade,
                startTime:startTime,   //缺省一天
                endTime:endTime
             }
        */
        var oParam = {
            devSn:FrameInfo.ACSN
        };
        $.extend(oParam,oPara);

        function onSuc(aData)
        {
            if(aData.retCode != 0)
            {
                // drawEmptyPie($('#sex-overview'),g_sexData, "性别");
                // drawEmptyPie($('#age-overview'),g_ageData, "年龄");
                // drawEmptyPie($('#weight-overview'),g_weightData, "体重");
                // drawEmptyPie($('#height-overview'),g_heightData, "身高");
                // console.log("getHealthSta"+aData.retCode);
                
                getAgeInfo(null);
                getSexInfo(null);
                getHeighAndWeight(null, null, null, null);
                return;
            }
            // var oResult = aData.result?aData.result:{};
            // var aYear = oResult.ageRatio || [];
            // var aSex  = oResult.sexRatio || {};
            // var aWeight = oResult.weightRatio || {};
            // var aHeight = oResult.statureRatio || {};
            // initMessageOverview(aYear,aSex,aWeight,aHeight);
            
            var oResult = aData.result?aData.result:{};
            getAgeInfo(oResult.ageNum);
            getSexInfo(oResult.sexNum);
            getHeighAndWeight(oResult.weightNum, oResult.statureNum, oResult.weightAverage, oResult.statureAverage);
        }

        var option = {
            type:"POST",
            url:"/v3/smartcampusread",
            contentType:"application/json",
            data:JSON.stringify({
                devSN:FrameInfo.ACSN,
                Method:"getHealthSta",
                Param:oParam
            }),
            onSuccess:onSuc,
            onFailed:function(textStatus,jqXHR,error)
            {
            }
        }
        Utils.Request.sendRequest(option);
    }

    function getHeartbeatFastorSlow(oPara)
    {
        function onSuc(aData)
        {
            if(aData.retCode != 0)
            {
                $("#tooSlowHeart").html(0);
                $("#tooFastHeart").html(0);
               
                return;
            }

            var aResult = aData.result||[];
            $("#tooSlowHeart").html(aResult.lowCount);
            $("#tooFastHeart").html(aResult.fastCount);
        }

        /*
         oPara = {
         method:method //hour day month year
         years:years,//缺省为全校
         classId:classId,//缺省为全校
         baseGrade:baseGrade,
         startTime:startTime,   //缺省一天
         endTime:endTime,
         normalHeartBeatMinCnt:normaHeartBeatMinCnt,
         normalHeartBeatMaxCnt:normalHeartBeatMaxCnt
         }
         */
        //{"result":{"lowCount":0,"fastCount":0},"retCode":0}
        var oParam = {
            devSn:FrameInfo.ACSN

        };
        $.extend(oParam,oPara);

        var option = {
            type:"POST",
            url:"/v3/smartcampusread",
            contentType:"application/json",
            data:JSON.stringify({
                devSN:FrameInfo.ACSN,
                Method:"getHeartBeatFastOrSlowSta",//"curHeartbeat",//
                Param:oParam
            }),
            onSuccess:onSuc,
            onFailed:function(textStatus,jqXHR,error)
            {
                $("#tooSlowHeart").html(0);
                $("#tooFastHeart").html(0);
            }
        }
        Utils.Request.sendRequest(option);
    }

    function getHeartbeatSta(oPara)
    {
        var oParam = {
            devSn:FrameInfo.ACSN

        };
        $.extend(oParam,oPara);

        function onSuccess(aData)
        {
            //result:["HeartbeatCnt","time"]
            if(aData.retCode != 0)
            {
                console.log("getHeartbeatStat"+aData.retCode);
                return;
            }

            var aResult = aData.result ||[];
            var aHeartbeatCnt = [];
            var aHeartString = [];
            var aTime = [];
            $.each(aResult,function(index,item){
                aHeartbeatCnt.push(item.heartRatio);
                aTime.push(item.time);
            });
            if(oPara.method) {
                initHeartRate(aHeartbeatCnt, aTime, oPara.method);
            }else{
                initHeartRate(aHeartbeatCnt, aTime, "day");
            }

        }

        var option = {
            type:"POST",
            url:"/v3/smartcampusread",
            contentType:"application/json",
            data:JSON.stringify({
                devSN:FrameInfo.ACSN,
                Method:"getHeartbeatStat",
                Param:oParam
            }),
            onSuccess:onSuccess,
            onFailed:function(textStatus,jqXHR,error)
            {
            }
        }
        Utils.Request.sendRequest(option);
    }

    function getAverageStep(oPara)
    {
        //获取平均步数
        /*
         oPara = {
         years:years,//缺省为全校
         classId:classId,//缺省为全校
         baseGrade:baseGrade,
         startTime:startTime,   //缺省一天
         endTime:endTime
         }
         */
        var oParam = {
            devSn:FrameInfo.ACSN,
            method:"today"
        };
        $.extend(oParam,oPara);

        function onSuccess(aData)
        {
            //result:["AverageStep"]
            //result:["AverageStep"]
            if(aData.retCode != 0)
            {
                console.log("getAverageStep"+aData.retCode);
                return;
            }
            var aResult = aData.result?((aData.result.AverageStep||aData.result.AverageStep!=0)?aData.result.AverageStep:0):0;
            $("#today-step").html(Math.round(aResult));

        }

        var option = {
            type:"POST",
            url:"/v3/smartcampusread",
            contentType:"application/json",
            data:JSON.stringify({
                devSN:FrameInfo.ACSN,
                Method:"getAverageStep",
                Param:oParam
            }),
            onSuccess:onSuccess,
            onFailed:function(textStatus,jqXHR,error)
            {
                $("#today-step").html(0);
            }
        }
        Utils.Request.sendRequest(option);
    }

    //获取昨天日期
    function GetDateStr(AddDayCount) {
        var dd = new Date();
        dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
        var y = dd.getFullYear();
        var m = dd.getMonth()+1;//获取当前月份的日期
        var d = dd.getDate();
        return y+"-"+m+"-"+d;
    }

    function getTodayAndYesterdayAveStep(oPara)
    {
        var oParam = {
            devSn:FrameInfo.ACSN
        }
        $.extend(oParam,oPara);

        function onSuccess(aData)
        {
            //result:["AverageStep"]
            if(aData.retCode != 0)
            {
                $("#yesterday-step").html(1001);
                $("#today-step").html(981);
                return;
            }
            // var aResult = aData.result?((aData.result.todayAveStep||aData.result.AverageStep!=0)?aData.result.AverageStep:0):0;
            $("#yesterday-step").html(Math.round(aData.result.yesterdayAveStep));
            $("#today-step").html(Math.round(aData.result.todayAveStep));
        }

        var option = {
            type:"POST",
            url:"/v3/smartcampusread",
            contentType:"application/json",
            data:JSON.stringify({
                devSN:FrameInfo.ACSN,
                Method:"getTodayOrYesterdayAveStep",
                Param:oParam
            }),
            onSuccess:onSuccess,
            onFailed:function(textStatus,jqXHR,error)
            {
                $("#yesterday-step").html(1001);
                $("#today-step").html(981);
            }
        }
        Utils.Request.sendRequest(option);
    }

    function getStepStatistic(oPara)
    {
        /*
         oPara = {
         method:method //hour day month year
         years:years,//缺省为全校
         classId:classId,//缺省为全校
         baseGrade:baseGrade,
         startTime:startTime,   //缺省一天
         endTime:endTime
         }
         */
        var oParam = {
            devSn:FrameInfo.ACSN
        };
        $.extend(oParam,oPara);

        function onSuccess(aData)
        {
            //result:["AverageStep"那一时刻平均值,"TotalStep"那一时刻总步数,"time"]
            if(aData.retCode != 0)
            {
                getStepCountInfo();
                console.log("getStepStatistic"+aData.retCode);
                return;
            }

            var aResult = aData.result||[];
            // var aStepCnt = [];
            // var aStepString = [];
            // var aTime = [];
            // $.each(aResult,function(index,item){
            //     aTime.push(item.time);
            //     aStepCnt.push(item.stepCnt);

            // });
            // if(oPara.method) {
            //     initStepCount(aStepCnt, aTime, oPara.method);
            // }else{
            //     initStepCount(aStepCnt, aTime, "day");
            // }
            getStepCountInfo(aResult);
        }
        var option = {
            type:"POST",
            url:"/v3/smartcampusread",
            contentType:"application/json",
            timeout:60000,
            data:JSON.stringify({
                devSN:FrameInfo.ACSN,
                Method:"getHistoryStepStatistic",
                Param:oParam
            }),
            onSuccess:onSuccess,
            onFailed:function(textStatus,jqXHR,error)
            {
                getStepCountInfo();
            }
        }
        Utils.Request.sendRequest(option);
    }

    function initBarEchart(jDom,aData,aTime,method) {
        var legendArr = [];
        aData.forEach(function(item) {
            legendArr.push(item.name);
        }, this);

        //假数据时间轴
        var xLabel = [];
        //for (var i = 0; i < 25; i++) {
        //    xLabel.push(i);
        //}
        $.each(aTime,function(index,item){
            xLabel.push(reverString(method,item));
        })
        var iThem = 0;
        var option = {
            //width:825,
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
                        //nterval':0,
                        interval: 0,
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
                    name :'人数',
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
                        show:false,
                    },
                    axisTick:{
                        show:false
                    },
                    splitNumber:8
                }
            ],
            series : aData
        };

        jDom.echart ("init", option);
    }

    function initHeartRate(heartRatio,Time,method) {
        //var levelArr1 = ['>160', '100~160', '60~100', '40~60', '<40'];
        var aData1 = [];
        var aTime = Time || [];
        var oLevelArr = {};
        var oLevelArr1 = {};
        var levelArr1 = [];
        $.each(heartRatio,function(index,item){
           $.each(item,function(index,iData){
                oLevelArr[iData.heartSegmentString] = oLevelArr[iData.heartSegmentString] || {};
                oLevelArr[iData.heartSegmentString].heartSegmentCnt =oLevelArr[iData.heartSegmentString].heartSegmentCnt||[];
                oLevelArr[iData.heartSegmentString].heartSegmentCnt.push(iData.heartSegmentCnt);
            });
        });

        for(heartSegmentString in oLevelArr)
        {
            levelArr1.push(heartSegmentString);
        }

        levelArr1.forEach(function(level,index) {
            var data = [];
            var average = 200;
            var sColor = "";
            
            switch(index){
                case 0:
                    sColor="#50c4f5";
                    break;
                case 1:
                    sColor="#c8c3c1";
                    break;
                case 2:
                    sColor="#4ec1b2";
                    break;
                case 3:
                    sColor="#ff9D9E";
                    break;
                case 4:
                    sColor="#fbc1b1";
                    break;
                default:
                    break;
            }

            aData1.push({
                name: level,
                type: 'bar',
                stack: '总量',
                itemStyle : { normal: {label : {show: false},color:sColor}},
                barCategoryGap:5,
                barWidth:15,
                data: oLevelArr[level].heartSegmentCnt
            })
        }, this);
        initBarEchart($("#heart-rate"), aData1,aTime,method);
    }

    function initStepCount(aStep,Time,method)
    {
        var levelArr2 = [];
        var aData2 = [];
        var aTime= Time||[];

        var oLevelArr = {};
        var oLevelArr1 = {};
        $.each(aStep,function(index,item){
            $.each(item,function(index,iData){
                oLevelArr[iData.stepSegmentString] = oLevelArr[iData.stepSegmentString] || {};
                oLevelArr[iData.stepSegmentString].stepSegmentCnt = oLevelArr[iData.stepSegmentString].stepSegmentCnt||[];
                oLevelArr[iData.stepSegmentString].stepSegmentCnt.push(iData.stepSegmentCnt);

            })
        });

        for(stepSegmentString in oLevelArr)
        {
            levelArr2.push(stepSegmentString);
        }


        levelArr2.forEach(function(level,index) {
            var data = [];
            var time = 25,
                average = 200;
            var sColor = "";
            for (var i = 0; i< time; i++) {
                var val = average * (1 + (Math.random()>0.5?1:-1) * Math.random());
                var sName = "";
                data.push(val);
            }

            switch(index){
                case 0:
                    sColor="#50c4f5";
                    break;
                case 1:
                    sColor="#c8c3c1";
                    break;
                case 2:
                    sColor="#4ec1b2";
                    break;
                case 3:
                    sColor="#ff9D9E";
                    break;
                case 4:
                    sColor="#fbc1b1";
                    break;
                default:
                    break;

            }
            aData2.push({
                name: level,
                type: 'bar',
                stack: '总量',
                itemStyle : { normal: {label : {show: false},color:sColor}},
                barCategoryGap:5,
                barWidth:15,
                data: oLevelArr[level].stepSegmentCnt
            })
        }, this);

        initBarEchart($("#walk-mate"), aData2,aTime,method);

    }

    function onFilter() {
        var method = "day";
        var sGrade = $("#Grade").singleSelect("getSelectedData").display ? $("#Grade").singleSelect("getSelectedData").display : undefined;
        var sClass = $("#Class").singleSelect("getSelectedData").display ? $("#Class").singleSelect("getSelectedData").display : undefined;
        var baseGrade = g_oGradeClass ? (g_oGradeClass[sGrade] ? (g_oGradeClass[sGrade] ? g_oGradeClass[sGrade][sClass] : undefined) : undefined) : undefined;
        var val = $("input[name=TimeRange][checked=checked]").attr("value");
        
        if(sGrade == "全校"){
            g_param = {};
            initData();
            return;
        }
       
        for (var base in baseGrade)
        {
            baseGrade = parseInt(base);
        }
        
        if(g_oClassYearList){
            if(g_oClassYearList[sGrade])
            {
                var years =  g_oClassYearList[sGrade]?(g_oClassYearList[sGrade][sClass]?g_oClassYearList[sGrade][sClass]:undefined):undefined;
                for(var year in years)
                {
                    years = parseInt(year);
                }
            }else{
                var years = undefined;
            }
        }else{
            var years = undefined;
        }
        //gyears= parseInt(nGrade);
        gclass= parseInt(sClass);
        gbasegrade = baseGrade;

        //时间参数
        var oTime = {};
        //共用参数  获取昨日平均步数
        var oPara = {
            years:years,
            classId:sClass,
            baseGrade:baseGrade,
            grade:sGrade
        }
        //柱状图参数
        // var oBar = {};
        // //nomethod
        // var oNoMethod = {};
        
        // oBar ={
        //     method:method
        // };
        // $.extend(oNoMethod,oTime);
        // $.extend(oNoMethod,oPara);
        // $.extend(oBar,oTime);
        $.extend(g_param, oPara);
        initData(oPara);
        // Utils.Pages.closeWindow(Utils.Pages.getWindow($("#Filter_form")));
    }

    function setFlipEvent() {
        var $regularlyItems=$(".regularly-item-list .flip-body");
        $regularlyItems.each(function(){
            var _$this=$(this);
            _$this.children(".flip-box").eq(0).addClass("out").removeClass("in");
            setTimeout(function() {
                _$this.find(".flip-box").show().eq(1).addClass("in").removeClass("out");
                _$this.children(".flip-box").eq(0).hide();
            }, 225);
        });
        $regularlyItems.hover(function(){
            var _$this=$(this);
            _$this.children(".flip-box").eq(1).addClass("out").removeClass("in");
            setTimeout(function() {
                _$this.find(".flip-box").show().eq(0).addClass("in").removeClass("out");
                _$this.children(".flip-box").eq(1).hide();
            }, 225);
        },function(){
            var _$this=$(this);
            _$this.children(".flip-box").eq(0).addClass("out").removeClass("in");
            setTimeout(function() {
                _$this.find(".flip-box").show().eq(1).addClass("in").removeClass("out");
                _$this.children(".flip-box").eq(0).hide();
            }, 225);
        });
    }

    function initData(oPara) {
        
        bulidData();
        drawEmptyPie($('#sex-overview'),g_sexData, "性别");
        drawEmptyPie($('#age-overview'),g_ageData, "年龄");
        drawEmptyPie($('#weight-overview'),g_weightData, "体重");
        drawEmptyPie($('#height-overview'),g_heightData, "身高");
        // var end = (new Date()).getTime();
        // var begin = end - 3600000;
        // var oTime = {
        //     startTime:begin,
        //     endTime:end,
        //     method:"hour"
        // }
        var oPara = oPara?oPara:{};
        
        // var oNoMethod = oNoMethod?oNoMethod:{
        //     startTime:begin,
        //     endTime:end
        // };
        // var yes = new Date((new Date()).getTime()- 3600000*24);
        // var tYearMonthDay = yes.getFullYear()+"-"+(yes.getMonth()+1)+"-"+yes.getDate()+" ";
        // var yesStart = (new Date(tYearMonthDay+"00:00:00")).getTime();
        // var yesEnd = (new Date(tYearMonthDay+"23:59:59")).getTime();
        // var oYaverage = {
        //     startTime:yesStart,
        //     endTime:yesEnd
        // }
        // $.extend(oYaverage,oPara);
        getHealthSta(oPara/*去掉时间 oNoMethod*/);
        getHeartbeatFastorSlow(oPara);
        
        //getHeartbeatSta(oBar1);
        getTodayAndYesterdayAveStep(oPara);
        $.extend(oPara, {method:'aWeek'});
        getStepStatistic(oPara);
        //getAverageStep(oPara);
        //真数据
        
        initSlist();
        //step 2
        // getAgeInfo();
        // getSexInfo();
        // getHeighAndWeight();
        //getStepCountInfo();
        getHealthDetail(0, 10, oPara);
    }

    function initEvent() {
        var aClassInfoData;
        g_oGradeClass = {};
        var aGradeList = [];
        var aClassList = [];
        //获取年级中的班级接口
        function getClassData(oFilter) {
            oFilter = oFilter || {};
            var Param = {
                devSn: FrameInfo.ACSN
            }

            $.extend(Param, oFilter);

            function onSuccess(aData,textStatus)
            {
                if(aData.retCode != 0){
                    console.log("get grade && class  failed");
                    return;
                }
                aClassInfoData = [];
                g_oGradeClass = {};
                aGradeList = [{"display":"全校","value":"全校"}];
                aClassList = [];
                aClassInfoData = aData.result.data || [];

                $.each(aClassInfoData,function(index,item){
                    var grade = item.grade;
                    var years = (new Date(item.years)).getTime();
                    //var years = (new Date(item.years)).getTime();
                    g_oGradeClass[grade] = g_oGradeClass[grade]||{}
                    //oGradeClass[grade][years] = oGradeClass[grade][years]||{};
                    g_oGradeClass[grade][item.classId]=g_oGradeClass[grade][item.classId]||{};
                    g_oGradeClass[grade][item.classId][item.baseGrade]=g_oGradeClass[grade][item.classId][item.baseGrade]||{};

                    g_oClassYearList = g_oClassYearList || {};
                    g_oClassYearList[grade] = g_oClassYearList[grade]||{};
                    g_oClassYearList[grade][item.classId] = g_oClassYearList[grade][item.classId]||{};
                    g_oClassYearList[grade][item.classId][item.years]=g_oClassYearList[grade][item.classId][item.years]||{};
                });
                var opt = {displayField:"display",valueField:"value"};

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
                $("#Grade").singleSelect("InitData",aGradeList,opt);

                $("#Grade").on("change",function(e) {
                    if(e.val == "全校"){
                        g_selectGradeObj.selectGrade= e.val;
                        g_selectGradeObj.selectClass= "";
                        $("#Class").parent().hide();
                    }else{
                        g_selectGradeObj.selectGrade= e.val;
                        var aClassId = [];
                        for(var classId in g_oGradeClass[e.added.text])
                        {
                            aClassId.push({"display":classId,"value":classId});
                        }
                        $("#Class").singleSelect("InitData",aClassId,opt);
                        $("#Class").parent().show();
                    }
                });
                
                $("#Class").on("change",function(e) {
                    g_selectGradeObj.selectClass= e.val;
                });

                if( g_selectGradeObj.selectGrade&& g_selectGradeObj.selectClass)
                {
                    $("#Grade",$("#Filter_form")).singleSelect("value",g_selectGradeObj.selectGrade);
                    $("#Class",$("#Filter_form")).singleSelect("value",g_selectGradeObj.selectClass);
                }else if( g_selectGradeObj.selectGrade)
                {
                    $("#Grade",$("#Filter_form")).singleSelect("value",g_selectGradeObj.selectGrade);
                }

            }

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

        function cancel(){
            Utils.Pages.closeWindow(Utils.Pages.getWindow( $("#Standard_form")));
        }

        $("#standard").click(function(){

            Utils.Base.openDlg(null, {}, {scope:$("#Standard_dlg"),className:"modal-default"});
        });

        $("#detail").click(function () {
            if(gyears) {
                if(gclass) {
                    Utils.Base.redirect({
                        np: "classroom.healthdetail",
                        years: gyears,
                        classId: gclass,
                        baseGrade: gbasegrade
                    });
                }else{
                    Utils.Base.redirect({
                        np: "classroom.healthdetail",
                        years: gyears,
                        baseGrade: gbasegrade
                    });
                }
            }else{
                Utils.Base.redirect({
                    np: "classroom.healthdetail"
                });
            }
        });

        $("#filter span").click(function(){
            // $("#Filter_form").form("init", "edit", {
            //     "title": getRcText("Filter_TITLE"),
            //     "btn_apply":onFilter
            // });

            // Utils.Base.openDlg(null, {}, {scope:$("#Filter_dlg"),className:"modal-default"});
            
            getClassData();
            $("#select_id").removeClass('hide');
            $("#filter").addClass("hide");
        });
        
        $("#select_comfire").click(function(){
            
            $("#filter span").text(g_selectGradeObj.selectGrade + g_selectGradeObj.selectClass);
            $("#select_id").addClass("hide");
            $("#filter").removeClass('hide');
            
            onFilter();
        });

        $("#select_cancel").click(function(){
            
            // $("#select_id").addClass("hide");
            // $("#filter").removeClass('hide');
           
        });
        
        $("input[name=TimeRange]").click(function(){
            $("input[name=TimeRange]").removeAttr("checked");
            $(this).attr("checked","checked");
        });
        
        //jquery accordion
        $( "#accordion").accordion({
            collapsible: true ,
            heightStyle: "content",
            animate: 250,
            header: ".accordion-header"
        });
        
        // $("#accordion .accordion-header").click(function(){
           
        //     if($("#accordion .accordion-header span").hasClass("ui-icon-triangle-1-e")){
        //         $('#layout_center').scrollTop(0);
        //     }else{
        //         $('#layout_center').scrollTop(1000);
        //     }
        // });
        // .sortable({
        //     axis: "y",
        //     handle: ".accordion-header",
        //     stop: function( event, ui ) {
        //         // IE doesn't register the blur when sorting
        //         // so trigger focusout handlers to remove .ui-state-focus
        //         ui.item.children( ".accordion-header" ).triggerHandler( "focusout" );
        //     }
        // });
        // 
        $(".xx-link").on('click',function(e){
            $(".xx-link").removeClass("active");
            $(this).addClass("active");
            
            var oPara = g_param;
            $.extend(oPara, {method:$(this).attr("value")});
            getStepStatistic(oPara);
        });
        
        setFlipEvent();
    }
    
    function initGrid(){
        
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
                        {text:'健康管理',href:''}]);
    }
    
    function _init() {
        $("#filter span").text("全校");
        initGrid();
        initData();
        initEvent();
    }
    
    function _destroy() {
        g_selectGradeObj = {};
    }
    
    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList","Echart","Form","SingleSelect"],
        "utils":["Request","Base"]
    });
    
})(jQuery)