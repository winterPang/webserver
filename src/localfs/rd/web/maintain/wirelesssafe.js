(function($){

    var MODULE_BASE = "maintain";
    var MODULE_NAME = MODULE_BASE + ".wirelesssafe";
    var g_allAttack = [
    [   "",                                          /*0*/
        "AP仿冒攻击",                                /*1*/
        "",                                          /*2*/
        "",                                          /*3*/
        "Client仿冒攻击",                            /*4*/
        "" ,                                         /*5*/
        "Weak IV攻击",                               /*6*/
        "Windows网桥攻击",                           /*7*/
        "客户端开启了禁用802.11n 40MHz模式攻击",     /*8*/
        "软AP攻击",                                  /*9*/
        "客户端节电攻击",                            /*10*/
        "Omerta攻击",                                /*11*/
        "解关联攻击",                                /*12*/
        "解认证攻击",                                /*13*/
        "非法信道攻击",                              /*14*/
        "AP扮演者攻击",                              /*15*/
        "未加密授权AP攻击",                          /*16*/
        "未加密的信任客户端",                        /*17*/
        "热点攻击",                                  /*18*/
        "绿野模式攻击",                              /*19*/
        "关联/重关联DoS攻击",                        /*20*/
        "蜜罐AP攻击",                                /*21*/
        "中间人攻击",                                /*22*/
        "无线网桥攻击",                              /*23*/
        "AP泛洪攻击",                                /*24*/
        "AP信道变化攻击",                            /*25*/
        ""                                           /*26*/
    ],
    [   "Association-request帧",         /*0*/
        "Authentication帧",              /*1*/
        "Beacon帧",                      /*2*/
        "Block ACK帧",                   /*3*/
        "CTS帧",                         /*4*/
        "Deauthentication帧" ,           /*5*/
        "Disassociation帧",              /*6*/
        "EAPOL-Start帧",                 /*7*/
        "Null-data帧",                   /*8*/
        "Probe-request帧",               /*9*/
        "Reassociation-request帧",       /*10*/
        "RTS帧",                         /*11*/
        "EAPOL-Logoff帧",                /*12*/
        "EAP Fail帧",                    /*13*/
        "EAP Success帧"                 /*14*/
    ],
    [   "IE重复的畸形报文",                                       /*0*/
        "Fata-Jack畸形报文",                                      /*1*/
        "IBSS和ESS置位异常的畸形报文",                            /*2*/
        "源地址为广播或者组播的认证和关联畸形报文",               /*3*/
        "畸形Association-request报文",                            /*4*/
        "畸形Authentication报文" ,                                /*5*/
        "含有无效原因值的解除认证畸形报文",                       /*6*/
        "含有无效原因值的解除关联畸形报文",                       /*7*/
        "畸形HT IE报文",                                          /*8*/
        "IE长度非法的畸形报文",                                   /*9*/
        "报文长度非法的畸形报文",                                 /*10*/
        "Duration字段超大的畸形报文",                             /*11*/
        "无效探查响应报文",                                       /*12*/
        "key长度超长的EAPOL报文",                                 /*13*/
        "SSID长度超长的畸形报文",                                 /*14*/
        "多余IE畸形报文"                                          /*15*/
    ]
    ];

    function getRcText(sRcName){

        return Utils.Base.getRcString("wireless_rc",sRcName);
    }

    /*获取所有的ACSN*/
    function getACSN(){

        $.ajax({
            url:MyConfig.path + "/devmonitor/web/aclist",
            type:'get',
            dataType:'json',
            success:function(data){
                var ACSNList = new Array();
                if( (data !="") && (data != null)){
                    var acList = data.acList;
                }
                for(var i = 0; i < acList.length; i++){
                    ACSNList.push(acList[i].devSN);
                }
                /*获取攻击信息数据*/
                getAttack(ACSNList);
                /*获取ap信息*/
                getApInformation(ACSNList,function(apInformationData){

                    /*获取客户端信息*/
                    getClientInformation(ACSNList,apInformationData);
                });
                /*获取攻击次数*/
                getAttackCount(ACSNList);
                /*获取反制次数*/
                getCtmCount(ACSNList);
            },
            error:function(){

                Frame.Msg.error("获取设备序列号失败，请联系客服");
            }
        })
    }

    /*获取攻击信息数据*/
    function getAttack(ACSNList){

        var currentYear = new Date().getFullYear();
        var currentMonth = new Date().getMonth() + 1;
        var currentDay = new Date().getDate();
        var startTime = new Date(currentYear + " " + currentMonth + " " + currentDay + " " + "00:00:00").getTime();
        startTime = Math.round(startTime/1000);
        var endTime = new Date().getTime();
        endTime = Math.round(endTime/1000);

        $.ajax({
            url:MyConfig.path + '/ant/read_wips_statistics',
            type:'post',
            dataType:'json',
            data:{
                "Method":"GetAttackClassify",
                Param:{
                    ACSNList:ACSNList,
                    StartTime:startTime,
                    EndTime:endTime
                }
            },
            success:function(data){

                /*调用解析函数解析数据*/
                analyseAttackData(data);
            },
            error:function(){

            }
        })
    }

    /*解析攻击信息的相关数据*/
    function analyseAttackData(data){

        data = data.message || [];

        var Flood = [], Malf = [], Other = [], FloodNum = 0, MalfNum = 0, OtherNum = 0;

        for(var i=0 ; i < data.length ;i++){
            var temp = {};
            if( (!g_allAttack[data[i].Type]) || (!g_allAttack[data[i].Type][data[i].SubType])){
                continue;
            }
            temp.name = g_allAttack[data[i].Type][data[i].SubType];
            temp.value = data[i].Count;
            switch(data[i].Type){
                case 0:
                {
                    if(temp.name){
                        Other.push(temp);
                    }
                    OtherNum += temp.value;
                    break;
                }
                case 1:
                {
                    if(temp.name){
                        Flood.push(temp);
                    }
                    FloodNum += temp.value;
                    break;
                }
                case 2:
                {
                    if(temp.name){
                        Malf.push(temp);
                    }
                    MalfNum += temp.value;
                    break;
                }
                default:
                    break;
            }
        }

        /*攻击信息饼状图,加上容错处理，没有数据的时候和绿洲一样，只显示样板*/
        drawAttackPie(FloodNum,MalfNum,OtherNum);

        /*将三种类型的个数写入页面柱状图上面*/
        $("#other_num").html(OtherNum);
        $("#Flood_num").html(FloodNum);
        $("#Malf_num").html(MalfNum);


        /*画三种类型的柱状图*/
        drawAttackBar(Flood,"#flood_attack","#98E4FA");
        drawAttackBar(Other,"#other_attack","#8ED9D0");
        drawAttackBar(Malf,"#malf_attack","#FFBD76");
    }

    /*攻击信息饼状图*/
    function drawAttackPie(FloodNum,OtherNum,MalfNum){

        /*容错处理*/
        if( (FloodNum != 0) || (OtherNum != 0) || (MalfNum != 0)) {
            var option = {
                calculable: false,
                tooltip: {
                    show: true,
                    formatter: "{b}:<br/> {c} ({d}%)"
                },
                series: [
                    {
                        type: 'pie',
                        radius: 75,
                        center: ['50%', '70%'],
                        itemStyle: {
                            normal: {
                                labelLine: {
                                    length: 20
                                },
                                label: {
                                    position: "outer",
                                    textStyle: {
                                        color: "#484A5E",
                                        fontFamily: "HPSimplified"
                                    }
                                }
                            }
                        },
                        data: [
                            {name: "泛洪攻击", value: FloodNum},
                            {name: "严重攻击", value: OtherNum},
                            {name: "畸形报文", value: MalfNum}
                        ]
                    }
                ]
            };
            $("#attackType_pie").echart("init", option);
        }
        else
        {
            var option_demo = {
                calculable: false,
                tooltip: {
                    show: true,
                    formatter: "{b}:<br/> {c} ({d}%)"
                },
                series: [
                    {
                        type: 'pie',
                        radius: 75,
                        center: ['50%', '70%'],
                        itemStyle: {
                            normal: {
                                labelLine: {
                                    length: 20
                                },
                                label: {
                                    position: "outer",
                                    textStyle: {
                                        color: "#484A5E",
                                        fontFamily: "HPSimplified"
                                    }
                                }
                            }
                        },
                        data: [
                            {name:"",value:1}
                        ]
                    }
                ]
            };
            $("#attackType_pie").echart("init", option_demo);
        }
    }


    /*三种攻击类型柱状图,加上容错处理*/
    function drawAttackBar(data,sId,color){

        if( data.length == 0){
            return;
        }

        var nameList = new Array();
        for( var i = 0 ; i < data.length ; i++){
            nameList.push(data[i].name);
        }

        var option = {
            color:[color],
            tooltip : {
                show:true,
                trigger: 'axis',
                axisPointer:{
                    type : 'line',
                    lineStyle : {
                        color: '#fff',
                        width: 0,
                        type: 'solid'
                    }
                }
            },
            height:210,
            calculable : false,
            yAxis : [
                {
                    show : false,
                    axisTick:false,
                    type : 'category',
                    data:nameList,
                    splitLine : false,
                    axisLine:false
                }
            ],
            xAxis: [
                {
                    type:"value",
                    axisLabel:false,
                    splitLine : false,
                    axisLine:false
                }
            ],

            grid:{
                borderWidth:0,
                x:3,
                y:10,
                x2:60,
                y2:15
            },
            series : [
                {
                    name:'Number',
                    type:'bar',
                    data:data,
                    itemStyle : {
                        normal: {
                            label : {
                                show: true,
                                position: 'right',
                                formatter: function(x){
                                    return x.value;
                                },
                                textStyle: {
                                    color:"#a7b7c1"
                                }
                            }
                        },
                        emphasis:{
                        }
                    }
                },
                {
                    name:'Number',
                    type:'bar',
                    data:data,
                    color:'rgba(0,0,0,0)',
                    itemStyle : {
                        normal: {
                            label : {
                                show: true,
                                position: 'insideLeft',
                                formatter: function(x){return x.name;},
                                textStyle: {color:"#47495d"}
                            },
                            color: 'rgba(0,0,0,0)'
                        },
                        emphasis: {
                            label : {
                                show: true,
                                formatter: function(x){return x.name;},
                                textStyle: {color:"#47495d"}
                            }
                            , color: 'rgba(0,0,0,0)'
                        }
                    }

                }
            ]
        };
        $(sId).echart("init",option);
    }

    /*获取ap信息*/
    function getApInformation(ACSNList,callback){

        var currentYear = new Date().getFullYear();
        var currentMonth = new Date().getMonth() +1;
        var currentDay = new Date().getDate();
        var startTime = new Date(currentYear + " " + currentMonth + " " + currentDay +" " + "00:00:00").getTime();
        startTime = Math.round(startTime/1000);
        var endTime = new Date().getTime();
        endTime = Math.round(endTime/1000);

        $.ajax({
            url:MyConfig.path + '/ant/read_wips_ap',
            type:'post',
            dataType:"json",
            data:{
                "Method":"GetApClassify",
                Param:{
                    ACSNList:ACSNList,
                    StartTime:startTime,
                    EndTime:endTime
                }
            },
            success:function(data){

                /*闭包获取数据*/
                callback(data);
            },
            error:function(){

            }
        })
    }

    /*获取客户端信息*/
    function getClientInformation(ACSNList,apInformationData){

        var currentYear = new Date().getFullYear();
        var currentMonth = new Date().getMonth() + 1;
        var currentDay = new Date().getDate();
        var startTime = new Date(currentYear + " " + currentMonth + " " + currentDay + " " + "00:00:00").getTime();
        startTime = Math.round(startTime/1000);
        var endTime = new Date().getTime();
        endTime = Math.round(endTime/1000);

        $.ajax({
            url:MyConfig.path + '/ant/read_wips_client',
            type:'post',
            dataType:'json',
            data:{
                "Method":"GetClientClassify",
                Param:{
                   ACSNList:ACSNList,
                   StartTime:startTime,
                   EndTime:endTime
                }
            },
            success:function(data){
                /*调用函数进行解析数据*/
                analyseInformation(apInformationData,data);
            },
            error:function(){

            }
        })
    }

    /*解析AP,客户端信息数据*/
    function analyseInformation(apInformationData,clientInformationData){

        var apData = apInformationData.message || [];
        var clientData = clientInformationData.message || [];
        /*ap,客户端数组中的对象也是数组，要进行合并数组处理，再进行合并统计*/
        apData = sortObject(apData);
        clientData = sortObject(clientData);

        var classifyArr = getRcText("device_type").split(',');
        var temp_ap = [];
        var temp_client = [];
        var sum_ap = 0;
        var sum_client = 0;

        /*ap数据解析*/
        var rougeAp = 0;
        for( var i = 0; i < apData.length ; i++){
            if( apData[i].ClassifyType == 3){
                rougeAp = apData[i].Sum;
            }
            temp_ap[i] = {};
            temp_ap[i].name = classifyArr[apData[i].ClassifyType] || "unknow";
            temp_ap[i].value = apData[i].Sum;
            sum_ap += apData[i].Sum;
        }

        /*客户端数据解析*/
        var unAuthClient = 0;
        for(var j = 0; j < clientData.length ;j++){
            if( clientData[j].ClassifyType == 15){
                unAuthClient = clientData[j].Sum;
            }
            temp_client[j] = {};
            temp_client[j].name =  classifyArr[clientData[j].ClassifyType] || "unknow";
            temp_client[j].value = clientData[j].Sum;
            sum_client += clientData[j].Sum;　
        }

        /*ap,客户端模块饼状图*/
        if( (sum_ap != 0) && (sum_client != 0)){
            drawAp(sum_ap,sum_client);
            drawClient(sum_ap,sum_client);
        }else if( (sum_ap == 0) && (sum_client != 0))
        {
            drawClient(sum_ap,sum_client);
        }else if( (sum_ap != 0 ) && (sum_client == 0 ))
        {
            drawAp(sum_ap,sum_client);
        }

        /*设备信息模块饼状图*/
        var deviceArr = temp_ap.concat(temp_client);
        drawDevice(deviceArr);

        /*将RougeAp,未认证客户端,ap,客户端数量的值写入页面对应模块*/
        $("#rougeAp").html(rougeAp);
        $("#unAuthClient").html(unAuthClient);
        $("#Total_ap").html(sum_ap);
        $("#Total_client").html(sum_client);
        $("#totalAp").html(sum_ap);
        $("#totalClient").html(sum_client);
    }

    /*设备信息（Ap模块）*/
    function drawAp(sum_ap,sum_client){

        var apPrecent =  (sum_ap/(sum_ap + sum_client)*100).toFixed(1);

        var labelTopAp = {
            normal:{
                color:'#31A9DC',
                label:{
                    show:true,
                    position:'center',
                    formatter:'{b}',
                    textStyle:{
                        baseline:'bottom'
                    }
                },
                labelLine:{
                    show:false
                }
            }
        };

        var labelBottom = {
            normal: {
                color:'#ccc',
                label: {
                    show:true,
                    position:'center'
                },
                labelLine:{
                    show:false
                }
            },
            emphasis:{
                color:'rgba(0,0,0,0)'
            }
        };

        var apname = [
            {name:"AP", value:sum_ap, itemStyle:labelTopAp},
            {name:"other", value:100-sum_ap, itemStyle:labelBottom}
        ];

        var option = {
            calculable : false,
            height:180,
            toolTip:{
                show:true,
                trigger: 'axis'
            },
            series : [
                {
                    type: 'pie',
                    radius :['55%','70%'],
                    center: ['50%', '50%'],
                    itemStyle: {normal: {
                        label: {
                            formatter:apPrecent + '%',
                            textStyle: {
                                baseline: 'top'
                            }
                        }
                    }} ,
                    data: apname
                }
            ]
        };

        $("#Device_AP").echart("init",option);
    }

    /*设备信息(客户端模块)*/
    function drawClient(sum_ap,sum_client){

        var clientPrecent = (sum_client/(sum_client + sum_ap)*100).toFixed(1);

        var labelTopClient = {
            normal:{
                color:'#FDAC6D',
                label:{
                    show:true,
                    position:'center',
                    formatter:'{b}',
                    textStyle:{
                        baseline:'bottom'
                    }
                },
                labelLine:{
                    show:false
                }
            }
        };

        var labelBottom = {
            normal: {
                color:'#ccc',
                label: {
                    show:true,
                    position:'center'
                },
                labelLine:{
                    show:false
                }
            },
            emphasis:{
                color:'rgba(0,0,0,0)'
            }
        };

        var clientname= [
            {name:"客户端", value:sum_client, itemStyle:labelTopClient},
            {name:"other", value:100-sum_client, itemStyle:labelBottom}
        ];

        var option = {
            calculable : false,
            height:180,
            series : [
                {
                    type: 'pie',
                    radius :['55%','70%'],
                    center: ['50%', '50%'],
                    itemStyle: {normal: {
                        label: {
                            formatter: clientPrecent + '%',
                            textStyle: {
                                baseline: 'top'
                            }
                        }
                    }} ,
                    data:clientname
                }
            ]
        };
        $("#Device_client").echart("init",option);
    }


    /*设备信息饼状图（客户端，ap）*/
    function drawDevice(deviceArr){

        /*加上容错处理，没有数据的情况下，和绿洲一样，只显示样板*/
        if(deviceArr.length != 0) {
            var option = {
                height: 300,
                tooltip: {
                    trigger: 'item',
                    formatter: "{b} <br/> {c} ({d}%)"
                },
                calculable: false,
                series: [
                    {
                        type: 'pie',
                        center: ['52%', '55%'],
                        radius: 75,
                        minAngle: 15,
                        itemStyle: {
                            normal: {
                                labelLine: {
                                    length: 20
                                },
                                label: {
                                    position: "outer",
                                    textStyle: {
                                        color: "#484A5E",
                                        fontFamily: "HPSimplified"
                                    }
                                }
                            }
                        },
                        data: deviceArr
                    }
                ]
            };
            var oTheme = {
                color: [
                    '#0096d6', '#189FD9', '#31A9DC', '#49B2DF', '#62BCE2',
                    '#7BC7E7', '#93D0EA', '#ACDAED', '#C4E3F0', '#DDEDF3',
                    '#ff9a4c', '#FEA25C', '#FDAC6D', '#FCB57E'
                ]
            };
            $("#device_pie").echart("init", option, oTheme);
        }
        else
        {
            var option_demo = {
                height: 300,
                tooltip: {
                    trigger: 'item',
                    formatter: "{b} <br/> {c} ({d}%)"
                },
                calculable: false,
                series: [
                    {
                        type: 'pie',
                        center: ['52%', '55%'],
                        radius: 75,
                        minAngle: 15,
                        itemStyle: {
                            normal: {
                                labelLine: {
                                    length: 20
                                },
                                label: {
                                    position: "outer",
                                    textStyle: {
                                        color: "#484A5E",
                                        fontFamily: "HPSimplified"
                                    }
                                }
                            }
                        },
                        data:[
                            {name:"",value:1}
                        ]
                    }
                ]
            };
            var oTheme = {
                color: ['#0096d6']
            };
            $("#device_pie").echart("init", option_demo, oTheme);
        }
    }


    /*获取攻击次数数据*/
    function  getAttackCount(ACSNList){

        var currentYear = new Date().getFullYear();
        var currentMonth = new Date().getMonth() +1;
        var currentDay = new Date().getDate();
        var startTime = new Date(currentYear + " " + currentMonth + " " + currentDay + " " + "00:00:00").getTime();
        startTime = Math.round(startTime/1000);
        var endTime = new Date().getTime();
        endTime = Math.round(endTime/1000);

        $.ajax({
            url:MyConfig.path + '/ant/read_wips_statistics',
            type:'post',
            dataType:'json',
            data:{
                "Method":"TotalAttackNumber",
                Param:{
                    ACSNList:ACSNList,
                    StartTime:startTime,
                    EndTime:endTime
                }
            },
            success:function(data){
                if( (data != "") && ( data != null) && (data.message != undefined) && (data.message != "")){
                    var attackCount = data.message;
                    $("#attackCount").html(attackCount);
                }
                else
                {
                    $("#attackCount").html(0);
                }
            },
            error:function(){

            }
        })
    }


    /*获取反制总数数据*/
    function getCtmCount(ACSNList){

        var currentYear = new Date().getFullYear();
        var currentMonth = new Date().getMonth() +1;
        var currentDay = new Date().getDate();
        var startTime = new Date(currentYear + " " + currentMonth + " " + currentDay + " " + "00:00:00").getTime();
        startTime = Math.round(startTime/1000);
        var endTime = new Date().getTime();
        endTime = Math.round(endTime/1000);

        $.ajax({
            url:MyConfig.path + '/ant/read_wips_statistics',
            type:'post',
            dataType:'json',
            data:{
                "Method":"TotalCtmNumber",
                Param:{
                    ACSNList:ACSNList,
                    StartTime:startTime,
                    EndTime:endTime
                }
            },
            success:function(data){
                if( (data != "") && ( data != null) && (data.message != undefined) && (data.message != "")){
                    var ctmCount = data.message;
                    $("#ctmCount").html(ctmCount);
                }
                else
                {
                    $("#ctmCount").html(0);
                }
            },
            error:function(){

            }
        })
    }

    /*对数组里面的对象进行过滤统计处理*/
    function sortObject(data){

        var lastData = [];
        for(var i = 0 ; i < data.length ; i++){
            lastData = lastData.concat(data[i]);
        }

        if( (lastData.length == 0) || (lastData.length == 1)){
            return lastData;
        }

        lastData.sort(compare("ClassifyType"));

        function compare(prob){
            return function(obj1,obj2){
                var val1 = obj1[prob];
                var val2 = obj2[prob];
                if( val1 < val2){
                    return -1
                }
                else if( val1 > val2){
                    return 1;
                }
                else{
                    return 0;
                }
            }
        }

        var probType = lastData[0].ClassifyType;
        var probSum = lastData[0].Sum;
        var ReplyData = [];
        var y = 0;

        for( var j = 1 ; j < lastData.length ; j++){
            if( probType == lastData[j].ClassifyType){
                probSum += lastData[j].Sum;
                if( j == lastData.length -1){
                    ReplyData[y] = {};
                    ReplyData[y].ClassifyType = lastData[j].ClassifyType;
                    ReplyData[y].Sum = lastData[j].Sum;
                }
            }
            else
            {
                ReplyData[y] = {};
                ReplyData[y].ClassifyType = probType;
                ReplyData[y].Sum = probSum;
                ++y;
                probType = lastData[j].ClassifyType;
                probSum = lastData[j].Sum;
                if( j == lastData.length -1){
                    ReplyData[y] = {};
                    ReplyData[y].ClassifyType = lastData[j].ClassifyType;
                    ReplyData[y].Sum = lastData[j].Sum;
                }
            }
        }
        return ReplyData;
    }

    function initData(){

        /*获取所有ACSN*/
        getACSN();
    }


    function initForm(){
        /*设备信息饼状图，点击帮助弹出详细页面，描述设备*/
        $("#help_detail").on("click",function(){
            var jDlg = $("#formDetail");
            var jScope = {scope:jDlg,className:'modal-super'};
            Utils.Base.openDlg(null,{},jScope);
        })
    }

    function _init(){
        initData();
        initForm();
    }

    function _destroy(){

    }

    Utils.Pages.regModule(MODULE_NAME,{
        "init": _init,
        "destroy": _destroy,
        "widgets": ["Form","Echart","SingleSelect","DateTime","DateRange","SList"],
        "utils":["Request","Base","Msg"]
    })
})(jQuery);