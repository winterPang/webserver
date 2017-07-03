(function ($)
{
    var MODULE_NAME = "health.healthcheck";
    var HealthForm ="#healthform";
    var ReExperience ="#reExperience";
    var OneKeyRepair = "#oneKeyRepair";

	/*
    深度体检模块
    */

    /*获取AP列表*/
    function getDevApList(){
        var surl = MyConfig.path +"/apmonitor/web/aplist?devSN=" + FrameInfo.ACSN;

        var aplistFlowOpt = {
            url:surl,
            dataType:"json",
            type:"GET",
            timeout:5000,
            onSuccess:getApLisSuc,
            onFailed:getApListFail
        };

            Utils.Request.sendRequest(aplistFlowOpt);

        /*获取aplist成功的回调*/
        function getApLisSuc(apResult){

            judgeApExist(apResult);
        }

        /*获取aplist失败的回调*/
        function getApListFail(status){

            if( status.statusText == 'timeout'){
                $("#dep_check").on('click',function(){

                    Frame.Msg.error("无法获取AP状态，请联系客服");

                })
            }
        }
    }

    /*判断AP是否在线,不在线则不能进行深度体检,否则可以进行深度体检*/
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

        $("#dep_check").on("click",function(){

            $("#dlg_cnt_global").modal('hide');
            if( num == 0){

                   Frame.Msg.alert("当前无在线AP,不能进行深度体检");

            }
            else
            {
               if( radioNum == 0){

                   Frame.Msg.alert("当前Radio没有使能，请检查配置");

               }
               else
               {
                   var statusFlowOpt = {
                       url: MyConfig.path +'/diagnosis_read/web/status?devSN=' + FrameInfo.ACSN,
                       type: 'get',
                       dataType: 'json',
                       timeout: 5000,
                       onSuccess:getStatusFlowSuc,
                       onFailed:getStatusFlowFail
                   };

                       Utils.Request.sendRequest(statusFlowOpt);
               }
            }
        })
    }

    /*获取是否正在深度体中success的回调*/
    function getStatusFlowSuc(data){
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
                deep_check();
            });
            document.getElementById('fileUpload').checked = false;
        }
        else if (data == 1) {

            Frame.Msg.alert("正在深度体检中,请等待深度体检结束后再次进行深度体检");
        }
    }

    /*获取是否正在深度体中fail的回调*/
    function getStatusFlowFail(status){

        if (status.statusText == 'timeout') {
            Frame.Msg.error("获取数据异常，请联系客服");
        }
    }

    /*
     下发使能配置进行深度体检
     */
    function deep_check(){

        var deepCheckFlowOpt = {
            url:MyConfig.path +"/ant/confmgr",
            dataType:"json",
            type:"post",
            data:
            {configType:0,
                devSN:FrameInfo.ACSN,
                cloudModule:"maintain",
                deviceModule:"wsa",
                method:"specturmAnalysis"
            },
            onSuccess:deepCheckSuc,
            onFailed:deepCheckFail
        };

           Utils.Request.sendRequest(deepCheckFlowOpt);

        /*下配置成功的回调*/
        function deepCheckSuc(data){
            try{
                if( data.communicateResult == "fail"){

                    Frame.Msg.alert("设备连接异常，请检查设备与云端的连接状态");

                }
                else
                {
                    if( data.serviceResult.results.results[0].devResult == "notsupport"){

                        Frame.Msg.alert("当前在线AP都不支持频谱分析，无法进行深度体检");

                    }
                    else if( data.communicateResult == "success")
                    {
                        $(".modal-backdrop").hide();
                        $(".modal-scrollable").hide();
                        Utils.Base.openDlg("health.dephealth", {}, {className: "modal-super"});
                    }
                }
            }catch(exception){

            }
        }

        /*下配置失败的回调*/
        function deepCheckFail(){

            Frame.Msg.error("数据获取异常，请联系客服");

        }
    }


    /*上传诊断信息文件*/
    function file_upload() {
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

        var opt = {
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
            onSuccess:uploadSuc,
            onFailed:uploadFail
        };

            Utils.Request.sendRequest(opt);

        /*上传诊断信息文件成功的回调*/
        function uploadSuc(){

        }

        /*上传诊断信息文件失败的回调*/
        function uploadFail(){

        }
    }

    function getRadarData(callBack) {
        if (1) {

            var healthOpt = {
                url:MyConfig.path +'/health/home/health',
                type:'GET',
                dataType:'json',
                timeout: 5000,
                data: {acSN:FrameInfo.ACSN},
                onSuccess:getHealthSuc,
                onFailed:getHealthFail
            };

                Utils.Request.sendRequest(healthOpt);

            /*获取数据成功的回调*/
            function getHealthSuc(data){

                callBack && callBack(JSON.parse(data));
            }

            /*获取数据失败的回调*/
            function getHealthFail(status){
                if (status.statusText == "timeout")
                {
                    var dataErr = {
                        'acSN':'NoAC',
                        'finalscore':0,
                        'wanspeed':0,
                        'APpercent':0,
                        'clientspeed': 0,
                        'security': 0,
                        'wireless': 0,
                        'system':0,
                        'Bpercent':0
                    };
                    callBack && callBack(dataErr);
                }
            }
        }
        else {
            var data = {
                finalscore: 0,
                wanspeed: 0,
                APpercent: 0,
                clientspeed: 0,
                security: 0,
                wireless: 0,
                system: 0,
                Bpercent: 0
            }
            callBack && callBack(data);
        }
    }

    function radarRender(resultdata) {
        if (!resultdata) {
            resultdata = {
                finalscore: 0,
                wanspeed: 0,
                APpercent: 0,
                clientspeed: 0,
                security: 0,
                wireless: 0,
                system: 0,
                Bpercent: 0
            };
        }
        var option = {
            height: "370px",
            width:"450px",
            calculable: false,
            polar: [
                {
                    indicator: [
                        {text: '上行剩余宽带', max: 5,},
                        {text: 'AP在线率', max: 5},
                        {text: '终端速率', max: 5},
                        {text: '安全评价', max: 5},
                        {text: '无线环境', max: 5},
                        {text: '系统健康度', max: 5}
                    ],
                    radius: 120,
                    name: {
                        textStyle: {color: '#616e7f', fontFamily: 'arial', fontSize:14}
                    },
                }

            ],
            series: [
                {
                    name: '评分',
                    type: 'radar',
                    itemStyle: {
                        normal: {
                            areaStyle: {
                                color: "rgba(105,196,197, 0.5)"
                            },
                            lineStyle: {
                                width: 1,
                                fontFamily: '华文细黑',
                                type: 'solid',//'solid' | 'dotted' | 'dashed'
                            },
                            color: "rgba(200,200,200,0.1)"
                        },
                        emphasis: {
                            areaStyle: {color: "rgba(105,196,197,0.8)"},
                        }
                    },
                    data: [
                        {
                            value: [
                                resultdata.wanspeed,
                                resultdata.APpercent,
                                resultdata.clientspeed,
                                resultdata.security,
                                resultdata.wireless,
                                resultdata.system
                            ],
                            name: '',
                            symbol: 'circle',
                            symbolSize: 0,

                        },
                    ]
                }
            ]
        };

        //myChart.setOption(option_radar);
        var oTheme = {
            color: ['#69C4C5','#F5F5F5']
        };
        $("#apphealth").echart ("init", option);
    }

    /* wan口信息获取 */
    function getWansSpeed(callback) {

        var wanOpt = {
            url: MyConfig.path +'/devmonitor/app/wanspeed?devSN=' + FrameInfo.ACSN,
            type: 'get',
            dataType:'json',
            onSuccess:getWanSuc,
            onFailed:getWanFail
        };

            Utils.Request.sendRequest(wanOpt);

        /*获取数据成功的回调*/
        function getWanSuc(data){
            if(0) {
                data = {
                    "wan_speed": [
                        {
                            "name": "GigabitEthernet1/0/5",
                            "description": "GigabitEthernet1/0/5",
                            "speed_down": 30,
                            "speed_up": 5
                        }
                    ]
                }
            }

            callback && callback(data, "success");
        }

        /*获取数据失败的回调*/
        function getWanFail(){
            var data = {
                "wan_speed": [
                    {
                        "name": "",
                        "description": "",
                        "speed_down": "0",
                        "speed_up": "0"
                    }
                ]
            }
            callback(data, "error");
        }
    }


    /* wan口信息渲染 */
    function renderWansSpeed(data) {
        var portNameId = "#Portname";
        var DescripinfoId = "#Descripinfo";
        var UplinkrateId = "#Uplinkrate";
        var DescendingrateId = "#Descendingrate";

        var wanSpeed = data.wan_speed[0];
        if(!wanSpeed) {
            wanSpeed = {
                name : "",
                description : "",
                speed_up : "0",
                speed_down : "0"
            }
        }

        var portNameText = wanSpeed.name;
        var DescripinfoText = wanSpeed.description;
        var UplinkrateText = wanSpeed.speed_up+"Kbps";
        var DescendingrateText = wanSpeed.speed_down+"Kbps";


        $(portNameId).text(portNameText);
        $(DescripinfoId).text(DescripinfoText);
        $(UplinkrateId).text(UplinkrateText);
        $(DescendingrateId).text(DescendingrateText);
    }

    /* 系统信息获取 */
    function getSystem(callback) {

        var systemOpt = {
            url: MyConfig.path +'/devmonitor/app/system?devSN=' + FrameInfo.ACSN,
            type: 'get',
            dataType:'json',
            onSuccess:getSystemSuc,
            onFailed:getSystemFail
        };

           Utils.Request.sendRequest(systemOpt);

        /*获取数据成功的回调*/
        function getSystemSuc(data){
                if(0) {
                    data = {
                        "devOnlineTime":"0",
                        "memoryRatio":"0",
                        "diskRemain":"0",
                        "cpuRatio":"0",
                        "temperature":"0",
                        "devName":"",
                        "devSoftVersion":"",
                        "devHardVersion":""
                    }
                }
                callback && callback(data, "success");
        }

        /*获取数据失败的回调*/
        function getSystemFail(){
            var data = {
                "devOnlineTime":"0",
                "memoryRatio":"0",
                "diskRemain":"0",
                "cpuRatio":"0",
                "temperature":"0",
                "devName":"",
                "devSoftVersion":"",
                "devHardVersion":""
            };
            callback(data, "error");
        }
    }


    /* 系统信息渲染 */
    function renderSystem(data) {
        var cpuutilizationId = "#cpuutilization";
        //var cputemperatureId = "#cputemperature";
        var memoryutilizationId = "#Memoryutilization";
        var flashId = "#flash";

        var cpuutilizationText = data.cpuRatio + "%";
        //var cputemperatureText = data.temperature;
        var memoryutilizationText = data.memoryRatio + "%";
        var flashText = "";


        if ((typeof (data.diskRemain)) === "number") {
            flashText = ((data.diskRemain)>>>20) + "M";
        }
        else {
            flashText = "0M";
        }

        $(cpuutilizationId).text(cpuutilizationText);
        //$(cputemperatureId).text(cputemperatureText);
        $(memoryutilizationId).text(memoryutilizationText);
        $(flashId).text(flashText);
    }

    /* ap统计信息获取 */
    function getApStatistic(callback) {

         var  apStatisticOpt = {
             url: MyConfig.path +'/apmonitor/app/apstatistic?devSN=' + FrameInfo.ACSN,
             type: 'get',
             dataType:'json',
             onSuccess:getApStatisticSuc,
             onFailed:getApStatisticFail
         };

             Utils.Request.sendRequest(apStatisticOpt);

         /*获取数据成功的回调*/
         function getApStatisticSuc(data){
             if(0) {
                 data = {
                     "ap_statistic" : {
                         "online":1,
                         "offline":3
                     }
                 }
             }
             var ap_statistic = data.ap_statistic;
             var sum = ap_statistic.online + ap_statistic.offline;
             if(sum) {
                 ap_statistic.onlineRate = parseInt((ap_statistic.online / sum) * 100, 10);
             }
             else {
                 ap_statistic.onlineRate = 0;
             }

             callback && callback(data, "success");
         }

         /*获取数据失败的回调*/
         function getApStatisticFail(){
             var data = {
                 "ap_statistic" : {
                     "online":"0",
                     "offline":"0",
                     "onlineRate":"0"
                 }
             }
             callback(data, "error");
         }
    }


    /* ap统计信息渲染 */
    function renderApStatistic(data) {
        var aPpercentId = "#APpercent";
        var apOnlinenumId = "#APOnlinenum";
        var apOfflinenumId = "#APOfflinenum";
        var apStatistic = data.ap_statistic;
        var aPpercentText = apStatistic.onlineRate+"%";
        var apOnlinenumText = apStatistic.online+"个";
        var apOfflinenumText = apStatistic.offline+"个";

        $(aPpercentId).text(aPpercentText);
        $(apOnlinenumId).text(apOnlinenumText);
        $(apOfflinenumId).text(apOfflinenumText);
    }


    /* client 速率信息获取与计算start */
    function getClientList(starNum, callback){

        var clientListOpt = {
            url: MyConfig.path +'/stamonitor/app/stalist?devSN=' + FrameInfo.ACSN + '&startNum=' + starNum,
            type: 'get',
            dataType:'json',
            onSuccess:getClientListSuc,
            onFailed:getClientListFail
        };

            Utils.Request.sendRequest(clientListOpt);

        /*获取数据成功的回调*/
        function getClientListSuc(data){

            callback(data.clientList, "success");
        }

        /*获取数据失败的回调*/
        function getClientListFail(){

        }
    }

    function clientForeach(callback) {
        var startNum = 0;
        var sum = 0;
        getClientList(startNum, resultProc);
        function resultProc(data, status) {
            var dataLength = data.length;
            var index = 0;

            if (("success" === status) && dataLength) {
                startNum += dataLength;
                for (index=0; index<dataLength; index++) {
                    callback && callback(data[index].clientMAC);
                }
                getClientList(startNum, resultProc);
            }
            else {
                callback && callback(null);
            }
        }
    }

    function getClientInfo(clientMAC, callback){

           var clientInfoOpt = {
               url: MyConfig.path +'/stamonitor/app/stainfo?devSN=' + FrameInfo.ACSN + '&clientMAC=' + clientMAC,
               type: 'get',
               dataType:'json',
               onSuccess:getClientInfoSuc,
               onFailed:getClientInfoFail
           };

               Utils.Request.sendRequest(clientInfoOpt);

         /*获取数据成功的回调*/
          function getClientInfoSuc(data){

              callback(data.clientInfo, "success");
         }

        /*获取数据失败的回调*/
        function getClientInfoFail(){

        }
    }

    function getClientSpeed(callback) {
        var minSpeed = 0;
        var maxSpeed = 0;
        var number = 0;
        var numRcv = 0;
        var sumSpeed = 0;
        var calculatAverageSpeed = null;

        clientForeach(function(clientMac) {
            if (clientMac) {
                number++;
                getClientInfo(clientMac, function(data, status) {
                    if ("success" === status) {
                        var speed = data.clientRxRate;
                    }
                    else {
                        var speed = 0;
                    }

                    numRcv++;
                    sumSpeed += speed;
                    if (!minSpeed) {
                        minSpeed = speed;
                    }
                    else if (minSpeed > speed) {
                        minSpeed = speed;
                    }
                    if (maxSpeed < speed) {
                        maxSpeed = speed;
                    }
                    if(numRcv === number) {
                        calculatAverageSpeed && calculatAverageSpeed();
                    }
                });
            }
            else {
                number && (calculatAverageSpeed = averageSpeed);
                calculatAverageSpeed && calculatAverageSpeed();
            }
        });

        function averageSpeed() {
            var data = {
                minSpeed : minSpeed,
                maxSpeed : maxSpeed,
                averageSpeed : sumSpeed / number
            }
            callback && callback(data);
        }
    }

    function getClientNegotiationSpeed(callback) {
        var minSpeed = 0;
        var maxSpeed = 0;
        var sumSpeed = 0;
        var averageSpeed = 0;
        var clientNum = 0;
        var clientList = null;

        var clientNegotiationSpeedOpt = {
            url: MyConfig.path+"/stamonitor/web/stationlist?devSN=" + FrameInfo.ACSN,
            type: "GET",
            dataType: "json",
            onSuccess:getClientNegotiationSpeedSuc,
            onFailed:getClientNegotiationSpeedFail
        };

           Utils.Request.sendRequest(clientNegotiationSpeedOpt);

        /*获取数据success的回调*/
        function getClientNegotiationSpeedSuc(data){
            var speed = 0;
            clientList = data.clientList || [];
            clientNum = clientList.length;
            for (var i = 0; i < clientNum;i++) {
                speed = clientList[i].NegoMaxRate;
                if (!minSpeed) {
                    minSpeed = speed;
                }
                else if (minSpeed > speed) {
                    minSpeed = speed;
                }

                if (maxSpeed < speed) {
                    maxSpeed = speed;
                }

                sumSpeed += speed;
            }
            if (clientNum) {
                averageSpeed = sumSpeed / clientNum;


                if((averageSpeed + '').indexOf('.') != -1) {
                    averageSpeed = averageSpeed.toFixed(2);
                }
            }

            var resultData = {
                clientCount : clientNum,
                minSpeed : minSpeed,
                maxSpeed : maxSpeed,
                averageSpeed : averageSpeed
            };

            callback && callback(resultData);
        }

        /*获取数据失败的回调*/
        function getClientNegotiationSpeedFail(){
            var resultData = {
                clientCount : clientNum,
                minSpeed : minSpeed,
                maxSpeed : maxSpeed,
                averageSpeed : averageSpeed
            };

            callback && callback(resultData);
        }
    }

    /* client 速率信息获取与计算end */
    /* client 速率信息渲染 */
    function renderClientSpeed(data) {
        var termstatisticsId = "#Termstatistics"
        var highestrateId = "#highestrate";
        var averagerate1Id = "#averagerate2";
        var lowestrateId = "#lowestrate";

        var termstatisticsText = data.clientCount + "个";
        var highestrateText = data.maxSpeed + "Mbps";
        var averagerate1Text = data.averageSpeed + "Mbps";
        var lowestrateText = data.minSpeed + "Mbps";

        $(termstatisticsId).text(termstatisticsText);
        $(highestrateId).text(highestrateText);
        $(averagerate1Id).text(averagerate1Text);
        $(lowestrateId).text(lowestrateText);
    }

    /* 安全信息获取start */
    function getPrivateNatCount(callback) {
        var para = {
            Method:'GetClient',
            Param:{
                ACSN: FrameInfo.ACSN
            },
            Return:[
                "APName",
                "ClientMAC",
                "FirstTime",
                "LastTime",
                "DetectTimes",
                "OSVersion"
            ]
        };

           var privateNatCountOpt = {
               url:MyConfig.path +"/ant/nat_detect",
               type:"post",
               data: para,
               dataType:"json",
               onSuccess:getPrivateNatCountSuc,
               onFailed:getPrivateNatCountFail
           };

               Utils.Request.sendRequest(privateNatCountOpt);

        /*获取数据成功的回调*/
        function getPrivateNatCountSuc(data){
            var result = {privateNatCount : data.message && data.message.length || 0};

            callback && callback(result, "success");
        }

        /*获取数据失败的回调*/
        function getPrivateNatCountFail(){

            var result = {privateNatCount : "0"};
            callback && callback(result, "error");
        }
    }

    function getRogueApCount (callback) {
        var para = {
            Method:'GetRogueAp',
            Param:{
                ACSN: FrameInfo.ACSN
            },
            Return:[
                "APName",
                "MacAddress",
                "SeverityLevel"
            ]
        };

           var rogueApCountOpt = {
               url: MyConfig.path +'/ant/read_wips_ap',
               type: "POST",
               dataType:'json',
               data: para,
               onSuccess:getRogueApCountSuc,
               onFailed:getRogueApCountFail
           };

               Utils.Request.sendRequest(rogueApCountOpt);

        /*获取数据成功的回调*/
        function getRogueApCountSuc(data){

            var result = {rogueApCount : data.message && data.message.length || 0};
            callback(result, "success");
        }

        /*获取数据失败的回调*/
        function getRogueApCountFail(){

            var result = {rogueApCount : "0"};
            callback(result, "error");
        }
    }

    function getSecurity(callback) {
        var securityData = {
            privateNatCount : "0",
            rogueApCount : "0"
        }
        var step = 2;
        getPrivateNatCount(function(data){
            step--;
            securityData.privateNatCount = data.privateNatCount;
            if (!step) {
                callback && callback(securityData);
            }
        });
        getRogueApCount(function(data) {
            step--;
            securityData.rogueApCount = data.rogueApCount;
            if (!step) {
                callback && callback(securityData);
            }
        });
    }
    /* 安全信息获取end */
    /* 安全信息渲染 */
    function renderSecurity(data) {
        var illegalapId = "#illegalap";
        var privateagentId = "#Privateagent";
        var illegalapText = data.rogueApCount + "个";
        var privateagentText = data.privateNatCount + "个";

        $(illegalapId).text(illegalapText);
        $(privateagentId).text(privateagentText);
    }

    /* 无线环境信息获取 */
    function getWirelessEnv(callback) {
        var para = {
            Method:'GetACStatistic',
            Param:{
                ACSN: FrameInfo.ACSN
            }
        };
        var result = {
            Rd2d4G:{
                BestNum:"0",
                BetterNum:"0",
                GoodNum:"0",
                BadNum:"0",
                WorstNum:"0"
            },
            Rd5G:{
                BestNum:"0",
                BetterNum:"0",
                GoodNum:"0",
                BadNum:"0",
                WorstNum:"0"
            }
        };

        var rrmserverOpt = {
            url:MyConfig.path +"/rrmserver",
            type:"post",
            data:para,
            dataType:"json",
            onSuccess:getRrmserverFlowSuc,
            onFailed:getRrmserverFlowFail
        };

        Utils.Request.sendRequest(rrmserverOpt);

        /*获取数据成功的回调*/
        function getRrmserverFlowSuc(data){

            if (data["retCode"]) {
                result = data["message"];
            }
            callback(result, "success");
        }

        /*获取数据失败的回调*/
        function getRrmserverFlowFail(){

            callback(result, "error");
        }
    }
    /* 无线环境信息渲染 */
    function renderWirelessEnv(data) {
        var beststate2GId = "#beststate1";
        var beststate5GId = "#beststate2";
        var betterstate2GId = "#betterstate1";
        var betterstate5GId = "#betterstate2";
        var generalstate2GId = "#generalstate1";
        var generalstate5GId = "#generalstate2";
        var poorerstate2GId = "#poorerstate1";
        var poorerstate5GId = "#poorerstate2";
        var worsestate2GId = "#worsestate1";
        var worsestate5GId = "#worsestate2";

        var units = "";
        var _2G = data.Rd2d4G;
        var _5G = data.Rd5G;
        var beststate2GText = _2G.BestNum + units;
        var beststate5GText = _5G.BestNum + units;
        var betterstate2GText = _2G.BetterNum + units;
        var betterstate5GText = _5G.BetterNum + units;
        var generalstate2GText = _2G.GoodNum + units;
        var generalstate5GText = _5G.GoodNum + units;
        var poorerstate2GText = _2G.BadNum + units;
        var poorerstate5GText = _5G.BadNum + units;
        var worsestate2GText = _2G.WorstNum + units;
        var worsestate5GText = _5G.WorstNum + units;

        $(beststate2GId).text(beststate2GText);
        $(beststate5GId).text(beststate5GText);
        $(betterstate2GId).text(betterstate2GText);
        $(betterstate5GId).text(betterstate5GText);
        $(generalstate2GId).text(generalstate2GText);
        $(generalstate5GId).text(generalstate5GText);
        $(poorerstate2GId).text(poorerstate2GText);
        $(poorerstate5GId).text(poorerstate5GText);
        $(worsestate2GId).text(worsestate2GText);
        $(worsestate5GId).text(worsestate5GText);
    }

    function initData()
    {
        radarRender();
        getRadarData(radarRender);
        getWansSpeed(renderWansSpeed);
        getSystem(renderSystem);
        getApStatistic(renderApStatistic);
        getClientNegotiationSpeed(renderClientSpeed);
        getSecurity(renderSecurity);
        getWirelessEnv(renderWirelessEnv);

    }

    function getRcText(sRcId)
    {
        return Utils.Base.getRcString("change_password_rc", sRcId);
    }

    function getRcString(sRcId, sRcName){
        return $("#"+sRcId).attr(sRcName) || "";
    }

    function initForm()
    {
        var oEdit =  {"title": getRcText("title"), "btn_apply": false, "btn_cancel": false};

        $(HealthForm).form("init", "edit", oEdit);
        $(ReExperience).on("click", function(){
            getRadarData(radarRender);
            getWansSpeed(renderWansSpeed);
            getSystem(renderSystem);
            getApStatistic(renderApStatistic);
            getClientNegotiationSpeed(renderClientSpeed);
            getSecurity(renderSecurity);
            getWirelessEnv(renderWirelessEnv);

            stamgrCfg();
            apmgrCfg();
        });

        $(OneKeyRepair).on("click", function(){

            $(".modal-backdrop").hide();
            $(".modal-scrollable").hide();
            Utils.Base.openDlg("health.onekeyrepair", {}, {className: "modal-super"});
            return false;

        });
    }

    /*重新体检,向stamgr下配置*/
    function stamgrCfg(){

        var stamgrOpt = {
            url:MyConfig.path +"/ant/confmgr",
            dataType:"json",
            type:"post",
            data:{
                configType:0,
                devSN:FrameInfo.ACSN,
                cloudModule:"maintain",
                deviceModule:"stamgr",
                method:"ReportDiagnosisInfo",
                param:[1,2,3,4,5,6]
            },
            onSuccess:sendStamgrCfgSuc,
            onFailed:sendStamgrCfgFail
        };

           Utils.Request.sendRequest(stamgrOpt);

        /*下配置成功的回调*/
        function sendStamgrCfgSuc(data){

            if( data.communicateResult == "success"){

                setTimeout(function(){

                    Diagnosis();

                },10000)
            }

        }

        /*下配置失败的回调*/
        function sendStamgrCfgFail(){

        }
    }

    /*重新体检，向apmgr下配置*/
    function apmgrCfg(){

        var apmgrOpt = {
            url:MyConfig.path +"/ant/confmgr",
            dataType:"json",
            type:"post",
            data:{
                configType:0,
                devSN:FrameInfo.ACSN,
                cloudModule:"maintain",
                deviceModule:"apmgr",
                method:"ReportDiagnosisInfo",
                param:[1,2,3,4,5,6]
            },
            onSuccess:sendApmgrCfgSuc,
            onFailed:sendApmgrCfgFail
        };

            Utils.Request.sendRequest(apmgrOpt);

        /*下配置成功的回调*/
        function sendApmgrCfgSuc(){

        }

        /*下配置失败的回调*/
        function sendApmgrCfgFail(){

        }
    }

    /*在线诊断，体检分析模块数据的获取*/
    function Diagnosis(){       

        var resultFlowOpt = {
            url: MyConfig.path +"/diagnosis_read/web/result?devSN="+FrameInfo.ACSN,
            type: "GET",
            dataType: "json",
            onSuccess:getResultFlowSuc,
            onFailed:getResultFlowFail
        };

            Utils.Request.sendRequest(resultFlowOpt);
    }


    /*获取诊断信息成功的回调*/
    function getResultFlowSuc(data){

        initData_Diagnosis(data);

    }

    /*获取诊断信息失败的回调*/
    function getResultFlowFail(){

            Frame.Msg.error("体检分析数据获取异常,请联系客服");
    }

    function initData_Diagnosis(data) {
        if (data.length != 0) {
            if (data[0].devSN == undefined) {
                $("#loadValue").html("正常");
                $("#rssiValue").html("正常");
                $("#clientConsultValue").html("正常");
                $("#apValue").html("正常");
                $("#clientFlowValue").html("正常");
                $("#loadAnalyse").html("正常");
                $("#loadResouce2").html("0%");
                $("#loadResouce3").html("0%");
                $("#loadResouce4").html("0%");
                $("#loadResouce5").html("0%");
                $("#rssiAnalyse").html("正常");
                $("#clientRssi1").html("0%");
                $("#clientRssi2").html("0%");
                $("#clientRssi3").html("0%");
                $("#clientRssi4").html("0%");
                $("#clientRssi5").html("0%");
                $("#clientRssi6").html("0%");
                $("#clientRssi7").html("0%");
                $("#clientConsultAnalyse").html("正常");
                $("#consult1").html("0%");
                $("#consult2").html("0%");
                $("#consult3").html("0%");
                $("#consult4").html("0%");
                $("#consult5").html("0%");
                $("#consult6").html("0%");
                $("#apAnalyse").html("正常");
                $("#clienttooR1").html("0%");
                $("#clienttooR2").html("0%");
                $("#clienttooR3").html("0%");
                $("#clienttooR4").html("0%");
                $("#clientfiveR1").html("0%");
                $("#clientfiveR2").html("0%");
                $("#clientfiveR3").html("0%");
                $("#clientfiveR4").html("0%");
                $("#clientFlowAnalyse").html("正常");
                $("#clientRX1").html("0%");
                $("#clientRX2").html("0%");
                $("#clientRX3").html("0%");
                $("#clientRX4").html("0%");
                $("#clientRX5").html("0%");
                $("#clientRX6").html("0%");
                $("#clientTX1").html("0%");
                $("#clientTX2").html("0%");
                $("#clientTX3").html("0%");
                $("#clientTX4").html("0%");
                $("#clientTX5").html("0%");
                $("#clientTX6").html("0%");

            } else {
                if (data[0].loadValue == undefined) {
                    $("#loadValue").html("正常");
                    $("#loadAnalyse").html("正常");
                    $("#apValue").html("正常");
                    $("#rssiValue").html("正常");
                    $("#loadResouce2").html("0%");
                    $("#loadResouce3").html("0%");
                    $("#loadResouce4").html("0%");
                    $("#loadResouce5").html("0%");
                } else {
                    $("#loadValue").html(data[0].loadValue);
                    $("#loadAnalyse").html(data[0].loadAnalyse);
                    $("#apValue").html(data[0].apValue);
                    $("#rssiValue").html(data[0].rssiValue);
                    $("#loadResouce2").html(data[0].loadResouce2);
                    $("#loadResouce3").html(data[0].loadResouce3);
                    $("#loadResouce4").html(data[0].loadResouce4);
                    $("#loadResouce5").html(data[0].loadResouce5);
                }

                $("#clientConsultValue").html(data[0].clientConsultValue);
                $("#clientFlowValue").html(data[0].clientFlowValue);
                $("#rssiAnalyse").html(data[0].rssiAnalyse);
                $("#clientRssi1").html(data[0].clientRssi1);
                $("#clientRssi2").html(data[0].clientRssi2);
                $("#clientRssi3").html(data[0].clientRssi3);
                $("#clientRssi4").html(data[0].clientRssi4);
                $("#clientRssi5").html(data[0].clientRssi5);
                $("#clientRssi6").html(data[0].clientRssi6);
                $("#clientRssi7").html(data[0].clientRssi7);
                $("#clientConsultAnalyse").html(data[0].clientConsultAnalyse);
                $("#consult1").html(data[0].consult1);
                $("#consult2").html(data[0].consult2);
                $("#consult3").html(data[0].consult3);
                $("#consult4").html(data[0].consult4);
                $("#consult5").html(data[0].consult5);
                $("#consult6").html(data[0].consult6);
                $("#apAnalyse").html(data[0].apAnalyse);
                $("#clienttooR1").html(data[0].clienttooR1);
                $("#clienttooR2").html(data[0].clienttooR2);
                $("#clienttooR3").html(data[0].clienttooR3);
                $("#clienttooR4").html(data[0].clienttooR4);
                $("#clientfiveR1").html(data[0].clientfiveR1);
                $("#clientfiveR2").html(data[0].clientfiveR2);
                $("#clientfiveR3").html(data[0].clientfiveR3);
                $("#clientfiveR4").html(data[0].clientfiveR4);
                $("#clientFlowAnalyse").html(data[0].clientFlowAnalyse);
                $("#clientRX1").html(data[0].clientRX1);
                $("#clientRX2").html(data[0].clientRX2);
                $("#clientRX3").html(data[0].clientRX3);
                $("#clientRX4").html(data[0].clientRX4);
                $("#clientRX5").html(data[0].clientRX5);
                $("#clientRX6").html(data[0].clientRX6);
                $("#clientTX1").html(data[0].clientTX1);
                $("#clientTX2").html(data[0].clientTX2);
                $("#clientTX3").html(data[0].clientTX3);
                $("#clientTX4").html(data[0].clientTX4);
                $("#clientTX5").html(data[0].clientTX5);
                $("#clientTX6").html(data[0].clientTX6);
            }
        }
    }

    function reloadPage()
    {
        Utils.Base.refreshCurPage();
    }

    function _init ()
    {
        initData();
        initForm();
        Diagnosis();
        getDevApList();
    }

    function _resize (jParent)
    {

    }

    function _destroy()
    {
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }
    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["Echart","Panel","Minput","Form"],
        "utils": [ "Device","Request"]

    });

}) (jQuery);

function displayDetail(num)
{
    if(num == "one")
    {
        var obj = $(this).attr("togglebutton1");
        var tab = $(this).attr("Table1");
    }
    else if(num == "two")
    {
        var obj = $(this).attr("togglebutton2")
        var tab = $(this).attr("Table2");
    }
    else if(num == "three")
    {
        var obj = $(this).attr("togglebutton3")
        var tab = $(this).attr("Table3");
    }
    else if(num == "four")
    {
        var obj = $(this).attr("togglebutton4")
        var tab = $(this).attr("Table4");
    }
    else
    {
        var obj = $(this).attr("togglebutton5")
        var tab = $(this).attr("Table5");
    }
    if(tab.style.display == "none")
    {
        $("#togglebutton"+num).removeClass('row-open');
		tab.style.display = "table";        
    }
    else
    {
        $("#togglebutton"+num).addClass('row-open');
		tab.style.display = "none";       
    }
}

function displayDetail2(num)
{
    if(num == "one")
    {
        var obj = $(this).attr("toggle-btn1");
        var tab = $(this).attr("toggleTable11");
    }
    else if(num == "two")
    {
        var obj = $(this).attr("toggle-btn2")
        var tab = $(this).attr("toggleTable12");
    }
    else if(num == "three")
    {
        var obj = $(this).attr("toggle-btn3")
        var tab = $(this).attr("toggleTable13");
    }
    else if(num == "four")
    {
        var obj = $(this).attr("toggle-btn4")
        var tab = $(this).attr("toggleTable14");
    }
    else if(num == "five")
    {
        var obj = $(this).attr("toggle-btn5")
        var tab = $(this).attr("toggleTable15");
    }
    else
    {
        var obj = $(this).attr("loadButton6")
        var tab = $(this).attr("toggleTable16");
    }
    if(tab.style.display == "none")
    {
        $('#toggle-btn'+num).removeClass("row-open");
        tab.style.display = "table";
    }
    else
    {

        $('#toggle-btn'+num).addClass("row-open");
        tab.style.display = "none";
    }
}