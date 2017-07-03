;(function ($) {
    var MODULE_NAME = "p_customer.customer";
    var g_count = [6,24,7,30,12];
    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("customer_rc", sRcName).split(",");
    }
    function drawTerminaltype(sType)
    {
        var newObject={};
        $.extend(newObject, sType);
        newObject.Num5G=newObject["11a"]+newObject["11ac"]+newObject["11an"];
        newObject.Num2G=newObject["11g"]+newObject["11gn"]+newObject["11b"];
        if(newObject.Num5G == 0 && newObject.Num2G == 0)
        {
            drawEmptyPie_rz($("#Terminal_type"));
            return;
        }
        if(newObject.Num5G==0){
            delete newObject.Num5G;
        }
        if(newObject.Num2G==0){
            delete newObject.Num2G;
        }
        if(newObject["11ac"] == 0){delete newObject["11ac"];}
        if(newObject["11an"] == 0){delete newObject["11an"];}
        if(newObject["11a"] == 0){delete newObject["11a"];}
        if(newObject["11g"] == 0){delete newObject["11g"];}
        if(newObject["11gn"] == 0){delete newObject["11gn"];}
        if(newObject["11b"] == 0){delete newObject["11b"];}
        var option = {
            height:220,
            tooltip : {
                trigger: 'item',
                formatter: "{a} {b} <br/>{c} ({d}%)"
            },
            legend: {
                orient : 'vertical',
                x:'10%',
                y : '10%',
                data: ['802.11ac(5GHz)','802.11an(5GHz)','802.11a(5GHz)','802.11gn(2.4GHz)','802.11g(2.4GHz)','802.11b(2.4GHz)']
            },
            calculable : false,
            click: function(oInfo){
                if(oInfo.seriesIndex)
                {
                    var aType = ["11ac","11an","11a","11gn","11g","11b"];
                    openDalg(aType[oInfo.dataIndex],"","80211wirelessMode");
                }
            },
            series : [
                {
                    type:'pie',
                    radius : '30%',
                    center: ['65%', '35%'],
                    itemStyle: {
                        normal: {
                            borderColor:"#FFF",
                            borderWidth:1,
                            labelLine:{
                                show:false
                            },
                            color:
                                function(a,b,c,d) {
                                var colorList = ['#4ec1b2','#b3b7dd'];
                                return colorList[a.dataIndex];
                            },
                            label:
                            {
                                show:false
                            }
                        }
                    },
                    data: [{name:'5GHz',value:newObject.Num5G},
                           {name:'2.4GHz',value:newObject.Num2G}]
                },
                {
                    type:'pie',
                    radius : ['40%','60%'],
                    center: ['65%', '35%'],
                    itemStyle: {
                        normal: {
                            borderColor:"#FFF",
                            borderWidth:1,
                            labelLine:{
                                show:false
                            },
                            label:
                            {
                                position:"inner",
                                show:false
                            }
                        }
                    },
                    data:
                        [
                        {name:'802.11ac(5GHz)',value:newObject["11ac"]},
                        {name:'802.11an(5GHz)',value:newObject["11an"]},
                        {name:'802.11a(5GHz)',value:newObject["11a"]},
                        {name:'802.11gn(2.4GHz)',value:newObject["11gn"]},
                        {name:'802.11g(2.4GHz)',value:newObject["11g"]},
                        {name:'802.11b(2.4GHz)',value:newObject["11b"]}
                        ]
                }
            ],
        };
        var oTheme={
            color: ['#4ec1b2','#78cec3','#95dad1','#b3b7dd','#c8c3e1','#e7e7e9']
        };
        $("#Terminal_type").echart("init", option,oTheme);
    }
    function drawLoginUser(snr, newdata, date) {
        var aData = [];
        var bData = [];
        var cDate = [];
        var lineLength = date.length;
        //var xText = ['分','时','日','日','月'];
        if(lineLength > 7){
            bData.push(snr[0].allCount,snr[5].allCount,snr[10].allCount,snr[15].allCount,snr[20].allCount);
            aData.push(newdata[0].newCount,newdata[5].newCount,newdata[10].newCount,newdata[15].newCount,newdata[20].newCount);
            cDate.push(date[0],date[5],date[10],date[15],date[20]);
        }
        else if(lineLength == 7){
            for(var i = 0; i < date.length; i++)
            {
                bData.push(snr[i].allCount);
                aData.push(newdata[i].newCount);
                cDate.push(date[i]);
            }
        }
        option = {
            width: "100%",
            height:"100%",
            title : {
                subtext: '',
                x:'center',
                y:"60"
            },
            tooltip : {
                show:false,
                trigger: 'axis'
            },
            legend: {
                itemWidth:8,
                data:['新增宾客','宾客总数']
            },
            calculable : false,
            grid :
            {
                x:40, y:30, x2:30, y2:40,
                borderColor : '#fff'
            },
            xAxis : [
                {
                    //name: xText[amode],
                    boundaryGap: true,
                    splitLine:false,
                    axisLine  : {
                        show:true ,
                        lineStyle :{color: '#9da9b8', width: 1}
                    },
                    axisTick:{show:false},
                    axisLabel:{
                        show:true,
                        textStyle:{color: '#9da9b8', fontSize:"12px", width:2},
                        formatter:function (value){
                            return value;
                        },
                        interval:0
                    },
                    type : 'category',
                    data : cDate
                }
            ],
            yAxis : [
                {
                    name:getRcText("USER_COUNT"),
                    splitLine:{
                        show:true,
                        textStyle:{color: '#c9c4c5', fontSize:"1px", width:4},
                        lineStyle: {
                            color: ['#e7e7e9']
                        }
                    },
                    axisLabel: {
                        show:true,
                        textStyle:{color: '#9da9b8', fontSize:"12px", width:2}
                    },
                    axisLine : {
                        show:true,
                        lineStyle :{color: '#9da9b8', width: 1}
                    },
                    type : 'value'
                }
            ],
            series : [
                {
                    name:"新增宾客",
                    type:'bar',
                    barCategoryGap: '40%',
                    data:aData,
                    itemStyle : {
                        normal: {
                            label : {
                                show: true,
                                position: 'insideTop',
                                formatter: function(oData){
                                    return oData.value;
                                }
                            },
                            color:'#69C4C5'
                        }
                    }
                },
                {
                    name:"宾客总数",
                    type:'line',
                    smooth: true,
                    barCategoryGap: '40%',
                    data:bData,
                    itemStyle : {
                        normal: {
                            label : {
                                show: true,
                                position: 'top',
                                formatter: function(oData){
                                    return oData.value;
                                }
                            },
                            color:'#F9AB6B'
                        }
                    }
                }
            ],
            click: function () {}
        };
        var oTheme = {
            color : ['#229A61','#3DD38C','#79E1CD','#FFDC6D','#F9AB6B','#EF6363','#F09ABF','#BEC7D0']
        };
        $("#loginusermit").echart("init", option, oTheme);
    }
    function proUserCount(mode) {
        if(mode == 1){
            para = "&dataType=oneday";
        }else if(mode == 2){
            para = "&dataType=oneweek";
        }else if(mode == 3){
            para = "&dataType=onemonth";
        }
        aj_getnewuser(mode,para)
    }
    function showEchart_time(data) {
        var type = getRcText("USER_TYPE_TIME");
        if(data.clientList.halfhour==0 && data.clientList.onehour==0 && data.clientList.twohour==0&& data.clientList.greatertwohour==0){
            drawEmptyPie($("#Channel_utilization1"));
            return;
        }
        var aType = [
            { name: type[0], value: data.clientList.halfhour},
            { name: type[1], value: data.clientList.onehour},
            { name: type[2], value: data.clientList.twohour},
            { name: type[3], value: data.clientList.greatertwohour}
        ];
        var option = {
            height: 230,
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
             legend: {
                 orient:'vertical',
                 y : 'bottom',
                 data: [getRcText('USER_TYPE_TIME')[0],getRcText('USER_TYPE_TIME')[1],'',getRcText('USER_TYPE_TIME')[2],getRcText('USER_TYPE_TIME')[3]]
             },
            calculable: false,
            series: [
                {
                    type: 'pie',
                    radius: ['40%', '55%'],
                    center: ['47%', '47%'],
                    itemStyle: {
                        normal: {
                            labelLine: {
                                length: 0
                            },
                            label:
                            {
                                show:false
                            }
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#FF0',
                            width: 20
                        }
                    },
                    data: aType
                }
            ]
        };
        var oTheme = {
            color: ['#4ec1b2', '#ff9c9e', '#fbceb1', '#b3b7dd', '#F7C762', '#ABD6F5', '#63B4EF', '#3DA0EB', '#1683D3', '#136FB3']
        };
        $("#Channel_utilization1").echart("init", option, oTheme);
        var normalnumber = getRcText("USER_TYPE1111");
        var appendTohtml = [
            '<div style="position: relative;top: -160px;margin: 0 auto;width: 100px;"><div><span style="font-size: 16px; color:#343e4e; display: block;float: left; margin-left: 10px; margin-top: 32px;">',
            normalnumber[1],
            '</span>',
            '</div>'
        ].join(" ");
        $(appendTohtml).appendTo($("#Channel_utilization1"));
    }
    function showEchart_access(datalist) {
        var type =getRcText('USER_TYPE')
        if(datalist.count1==0 && datalist.count2==0 && datalist.count3==0&& datalist.count4==0){
            drawEmptyPie($("#Channel_utilization"));
            return;
        }
            var aType = [
                { name: type[0], value: datalist.count1},
                { name: type[1], value: datalist.count2},
                { name: type[2], value: datalist.count3},
                { name: type[3], value: datalist.count4}
            ];
       var option = {
            height: 230,
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
             legend: {
                 orient:'vertical',
                 y : 'bottom',
                 data: [getRcText('USER_TYPE')[0],getRcText('USER_TYPE')[1],'',getRcText('USER_TYPE')[2],getRcText('USER_TYPE')[3]]
             },
            calculable: false,
            series: [
                {
                    type: 'pie',
                    radius: ['40%', '55%'],
                    center: ['47%', '47%'],
                    itemStyle: {
                        normal: {
                            labelLine: {
                                length: 0
                            },
                            label:
                            {
                                show:false
                            }
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#FF0',
                            width: 20
                        }
                    },
                    data: aType
                }
            ]
        };
        var oTheme = {
            color: ['#4ec1b2', '#ff9c9e', '#fbceb1', '#b3b7dd', '#F7C762', '#ABD6F5', '#63B4EF', '#3DA0EB', '#1683D3', '#136FB3']
        };
        $("#Channel_utilization").echart("init", option, oTheme);
        var normalnumber = getRcText("USER_TYPE1111");
        var appendTohtml = [
            '<div style="position: relative;top: -160px;margin: 0 auto;width: 100px;"><div><span style="font-size: 16px; color:#343e4e; display: block;float: left; margin-left: 10px; margin-top: 32px;">',
            normalnumber[0],
            '</span>',
            '</div>'
        ].join(" ");
        $(appendTohtml).appendTo($("#Channel_utilization"));
    }
    function initPieChart() {
        aj_getAccessTime(function(userlist) {
            showEchart_access(userlist);
        });
        aj_getOnlineTime();
        aj_getEndPointtype(function(userList) {
            showEchart_phoneType(userList);
        });
    }
    function drawStaByod(alegend,data){
        var devicLength=data.length;
        if(devicLength==0)
        {
            drawEmptyPie_rn($("#Terminal_firm"));
            return;
        }
        var option = {
            height:210,
            tooltip : {
                trigger: 'item',
                formatter: "{a} {b} <br/>{c} ({d}%)"
            },
            legend: {
                orient : 'vertical',
                x : '15%',
                data:alegend,
                y: '10%'
            },
            calculable : false,
            click: function(oInfo){
                openDalg(oInfo.name,"","MobileCompany");
            },
            series : [
                {
                    type:'pie',
                    radius :['40','60%'],
                    center: ['60%', '35%'],
                    itemStyle: {
                        normal: {
                            borderColor:"#FFF",
                            borderWidth:1,
                            labelLine:{
                                show:false
                            },
                            label:
                            {
                                show:false
                            }
                        }
                    },
                    data:data
                }
            ]
        };
        var oTheme = {
            color : ['#4ec1b2', '#fbceb1', '#b3b7dd', '#4fc4f6', '#fe808b', '#e7e7e9']
        };
        $("#Terminal_firm").echart ("init", option,oTheme);
    }
    function getStaByApGroup(){
        function getStaByApGroupOK(data){
            if(!data.errcode){
                var g_allInforbyAp=[];
                $.each(data.clientList,function(i,item){
                    g_allInforbyAp[i]={};
                    g_allInforbyAp[i].ApName=item.apGroupName;
                    g_allInforbyAp[i].ClientNumber2G=item.Count24G;
                    g_allInforbyAp[i].ClientNumber5G=item.Count5G;
                });
                $("#byApList").SList ("refresh", g_allInforbyAp);
            }else{
            }
        }
        function getStaByApGroupFail(err){
            console.log("ajax request fail:"+err);
        }
        var url=MyConfig.path+"/stamonitor/getclientlistbycondition?devSN="+FrameInfo.ACSN;
        var getStaByApGroup = {
            type:"GET",
            url:url,
            contentType:"application/json",
            dataType:"json",
            data:{
                reqType:'group'
            },
            onSuccess:getStaByApGroupOK,
            onFailed:getStaByApGroupFail
        };
        Utils.Request.sendRequest(getStaByApGroup);
    }
    function drawEmptyPie(jEle)
    {
        var option = {
            height:200,
            calculable : false,
            series : [
                {
                    type:'pie',
                    radius : ['40%', '55%'],
                    center: ['50%', '50%'],
                    itemStyle: {
                        normal: {
                            labelLine:{
                                show:false
                            },
                            label:
                            {
                                position:"inner"
                            }
                        }
                    },
                    data: [{name:'N/A',value:1}]
                }
            ]
        };
        var oTheme={color : ["rgba(216, 216, 216, 0.75)"]};
        jEle.echart("init", option,oTheme);
    }
    function drawEmptyPie_rn(jEle)
    {
        var option = {
            height:200,
            calculable : false,
            series : [
                {
                    type:'pie',
                    radius : ['40%', '60%'],
                    center: ['50%', '35%'],
                    itemStyle: {
                        normal: {
                            labelLine:{
                                show:false
                            },
                            label:
                            {
                                position:"inner"
                            }
                        }
                    },
                    data: [{name:'N/A',value:1}]
                }
            ]
        };
        var oTheme={color : ["rgba(216, 216, 216, 0.75)"]};
        jEle.echart("init", option,oTheme);
    }
    function drawEmptyPie_rz(jEle)
    {
        var option = {
            height:200,
            calculable : false,
            series : [
                {
                    type:'pie',
                    radius : '30%',
                    center: ['50%', '35%'],
                    itemStyle: {
                        normal: {
                            labelLine:{
                                show:false
                            },
                            label:
                            {
                                position:"inner",
                            }
                        }
                    },
                    data:  [{name:'N/A',value:1}]
                },
                {
                    type:'pie',
                    radius : ['40%', '60%'],
                    center: ['50%', '35%'],
                    itemStyle: {
                        normal: {
                            labelLine:{
                                show:false
                            },
                            label:
                            {
                                position:"inner"
                            }
                        }
                    },
                    data: [{name:'N/A',value:1}]
                }
            ]
        };
        var oTheme={color : ["rgba(216, 216, 216, 0.75)"]};
        jEle.echart("init", option,oTheme);
    }
    function openDalg(aType, sName, type)
    {
        Utils.Base.openDlg("p_customer.opendalg", {"a":aType,"b":sName,"c":type}, {scope:$("#maoxian"),className:"modal-super dashboard"});
        return false;
    }
    function showNum(row, cell, value, columnDef, oRowData,sType)
    {
        var nIndex = -1;
        var sName = oRowData.ApName;
        if(!sName)
        {
            nIndex = 1;
            sName = oRowData.SSID;
        }
        nIndex += cell;
        if(sType == "text"||value=="0")
        {
            return value;
        }
        return '<a href="'+sName+'" index="'+nIndex+'" style="color: #4ec1b2;">'+ value +'</a>';
    }
    function aj_getnewuser(mode,para) {
        function getNewUserOk(data){
            if(!data.errcode){
                var g_AllUser = [];
                var g_newUser = [];
                var g_onlineTime = [];
                var g_Time = [];
                var newlength = data.histclientList.length;
                var count = g_count[mode];
                for (var i = (count - 1); i>=0; i--) {
                    if (i >= newlength){
                        g_newUser.push({newCount:0});
                        g_AllUser.push({allCount:0});
                        g_onlineTime.push({time:0});
                    }else{
                        g_newUser.push({newCount: data.histclientList[count-1-i].newCount});
                        g_AllUser.push({allCount: data.histclientList[count-1-i].totalCount});
                        g_onlineTime.push({time: data.histclientList[count-1-i].time});
                    }
                }
                for (var j = 0 ; j < newlength ; j++){
                    if (mode == 1){
                        g_Time.push( new Date (g_onlineTime[j].time).getHours() + ":" + "00");
                    }
                    else{
                        g_Time.push( new Date(new Date(g_onlineTime[j].time)-1000).getMonth() + 1 + "-" + new Date(new Date(g_onlineTime[j].time)-1000).getDate()  );
                    }
                }
                drawLoginUser(g_AllUser, g_newUser, g_Time);
            }else{
            }
        }
        function getNewUserFail(){
        }
        var opt= {
            url:MyConfig.path+"/stamonitor/histclientstatistic_bycondition"+"?devSN=" + FrameInfo.ACSN + para,
            type: "GET",
            dataType: "json",
            contentType: "application/json",
            onSuccess:getNewUserOk,
            onFailed:getNewUserFail
        }
        Utils.Request.sendRequest(opt);
    }
    function aj_getAccessTime(callback) {
        var ajax = {
            url:MyConfig.path+"/visitor/getstatisticsbycount?devSN=" + FrameInfo.ACSN,
            type: "GET",
            dataType: "json",
            contentType: "application/json",
            onSuccess: function (data) {
                try {
                    if (!( 'result' in data && 'error' in data)) {
                        throw (new Error("data error"));
                    }
                    if (data.error == 0){
                        callback(data.result);
                    }
                }catch(error){
                    console.log(error);
                }
            },
            onFailed:function(err){
                console.log("access faild:");
            }
        }
        Utils.Request.sendRequest(ajax);
    }
    function aj_getOnlineTime() {
        var ajax = {
            url:MyConfig.path+"/stamonitor/getclientlistbycondition?devSN=" + FrameInfo.ACSN + "&reqType=onlinetime",
            type: "GET",
            dataType: "json",
            contentType: "application/json",
            onSuccess: showEchart_time,
            onFailed:function(err){
                console.log("access faild:");
            }
        }
        Utils.Request.sendRequest(ajax);
    }
    function aj_getEndPointtype(callback) {
        var ajax = {
            url:MyConfig.path+"/stamonitor/gethistclientstatisticbybyod?devSN=" + FrameInfo.ACSN,
            type: "GET",
            dataType: "json",
            contentType: "application/json",
            success: function (data) {
                try {
                    if (!('statistics' in data &&data.statistics instanceof Array))
                    {
                        throw (new Error("data error"));
                    }
                    callback(data.statistics);

                }catch(error){
                    console.log(error);
                }
            },
            onFailed:function(err){
                console.log("access faild:");
            }
        }
        Utils.Request.sendRequest(ajax);
    }
    function initEvent(){
        $("#total a.time-link").click(function () {
            $("#total a.time-link").removeClass("active");
            var val = $(this).addClass("active").attr("value");
            proUserCount(val);
        });
        $("#oDetail").click(function(){
            Utils.Base.redirect({ np: "p_customer.clientinfo"});
        });
        $("#hDetail").click(function(){
            Utils.Base.redirect({ np: "p_customer.clienthist"});
        });
    }
    function initData(){
        initPieChart();
        function getclientstatisticbybandtypeOK(data){
            if(!data.errcode)
            {
                var Num5GValue=data.client_statistic.band_5g;
                var Num2GValue=data.client_statistic.band_2_4g;
                var TotalValue=parseInt(Num5GValue)+parseInt(Num2GValue);
                $("#Total").html(TotalValue);
                $("#Num5G").html(Num5GValue);
                $("#Num2G").html(Num2GValue);
            }
        }
        function getclientstatisticbybandtypeFail(err){
            console.log("ajax request fail:"+err);
        }
        var getclientstatisticbyband = {
            type:"GET",
            url:MyConfig.path+"/stamonitor/getclientstatisticbybandtype?devSN="+FrameInfo.ACSN,
            contentType:"application/json",
            dataType:"json",
            onSuccess:getclientstatisticbybandtypeOK,
            onFailed:getclientstatisticbybandtypeFail
        };
        Utils.Request.sendRequest(getclientstatisticbyband);
        getStaByApGroup();
        function getclientstatisticbyssidOK(data){
            if(!data.errcode)
            {
                var g_allInforbySsid=[];
                $.each(data.client_statistic,function(i,item){
                    g_allInforbySsid[i]={};
                    g_allInforbySsid[i].SSID=item.clientSSID;
                    g_allInforbySsid[i].ClientNumber2G=item.band_2_4g;
                    g_allInforbySsid[i].ClientNumber5G=item.band_5g;
                });
                $("#bySsidList").SList ("refresh", g_allInforbySsid);
            }
            else{
            }
        }
        function getclientstatisticbyssidFail(err){
            console.log("ajax request fail:"+err);
        }
        var getclientstatisticbyssid = {
            type:"GET",
            url:MyConfig.path+"/stamonitor/getclientstatisticbyssid?devSN="+FrameInfo.ACSN,
            contentType:"application/json",
            dataType:"json",
            onSuccess:getclientstatisticbyssidOK,
            onFailed:getclientstatisticbyssidFail
        };
        Utils.Request.sendRequest(getclientstatisticbyssid);
        function getclientstatisticbymodeOK(data){
            if(!data.errcode)
            {
                drawTerminaltype(data.client_statistic);
            }
            else{
            }
        }
        function getclientstatisticbymodeFail(err){
            console.log("ajax request fail:"+err);
        }
        var getclientstatisticbymode = {
            type:"GET",
            url:MyConfig.path+"/stamonitor/getclientstatisticbymode?devSN="+FrameInfo.ACSN,
            contentType:"application/json",
            dataType:"json",
            onSuccess:getclientstatisticbymodeOK,
            onFailed:getclientstatisticbymodeFail
        };
        Utils.Request.sendRequest(getclientstatisticbymode);
        function getStaByodOK(data){
            if(!data.errcode)
            {
                var oData=data.client_statistic;
                var aLegend=[];
                var aData=[];
                $.each(oData,function(i,item){
                    aLegend[i]=item.clientVendor || getRcText ("VIEW_TITLE");
                    aData[i]={};
                    aData[i].name=item.clientVendor || getRcText ("VIEW_TITLE");
                    aData[i].value=item.count || undefined;
                });
                drawStaByod(aLegend,aData);
            }
            else{
            }
        }
        function getStaByodFail(err){
            console.log("ajax request fail:"+err);
        }
        var getStaByod = {
            type:"GET",
            url:MyConfig.path+"/stamonitor/getclientstatisticbybyod?devSN="+FrameInfo.ACSN,
            contentType:"application/json",
            dataType:"json",
            onSuccess:getStaByodOK,
            onFailed:getStaByodFail
        };
        Utils.Request.sendRequest(getStaByod);
        function getportalUserCountSuc (data) {
            $("#NumRZ").html( Utils.Base.addComma(data.clientList[0].conditionCount));
        }
        function getportalUserCountFail (err) {
            console.log("ajax request fail:"+err);
        }
        var portalUserCountOpt = {
            url: MyConfig.path+"/stamonitor/getclientlistbycondition",
            type: "GET",
            dataType: "json",
            data:{
                devSN:FrameInfo.ACSN,
                reqType:"all"
            },
            onSuccess:getportalUserCountSuc,
            onFailed:getportalUserCountFail
        };
        Utils.Request.sendRequest(portalUserCountOpt);
    }
    function initForm()
    {
        var aType = ["band_5g","band_2_4g","band_5g","band_2_4g","Wsm","Akm"];

        $("#bySsidList").on('click','a',function(){
            if($(this).html() != 0)
            {
                openDalg(aType[$(this).attr("index")],$(this).attr("href"),"ssid");
            }
            return false;
        });
        $("#byApList").on('click','a',function(){
            if($(this).html() != 0)
            {
                openDalg(aType[$(this).attr("index")],$(this).attr("href"),"apgroup");
            }
            return false;
        });
        $("#submit_scan").on("click", function(){
            Utils.Base.redirect ({np:$(this).attr("href")});
            return false;
        });
        $("#terminal").click(function(){
            Utils.Base.redirect({ np: "p_customer.customer_rz"});
        });

    }
    function initGrid()
    {
        var optSsid = {
            colNames: getRcText ("SSID_HEADER"),
            showHeader: true,
            pageSize : 5,
            colModel: [
                {name: "SSID", datatype: "String",width:150},
                {name: "ClientNumber5G", datatype: "String",formatter:showNum},
                {name: "ClientNumber2G", datatype: "String",formatter:showNum}
            ]
        };
        $("#bySsidList").SList ("head", optSsid);
        var optAp = {
            colNames: getRcText ("AP_HEADER"),
            pageSize : 5,
            showHeader: true,
            colModel: [
                {name:'ApName', datatype:"String",width:150,showTip:true},
                {name:'ClientNumber5G', datatype:"String",formatter:showNum},
                {name:'ClientNumber2G', datatype:"String",formatter:showNum}
            ]
        };
        $("#byApList").SList ("head", optAp);
    }
    function _init()
    {
        initGrid();
        initForm();
        initData();
        initEvent();
        proUserCount(1);
    }
    function _resize() {
    }
    function _destroy()
    {
        Utils.Request.clearMoudleAjax(MODULE_NAME);        
    }
    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init, 
        "destroy": _destroy, 
        "widgets": ["SList","Echart","Panel", "DateTime", "Form","Minput"],
        "utils":["Request","Base", "Msg"]
    });
})( jQuery );

