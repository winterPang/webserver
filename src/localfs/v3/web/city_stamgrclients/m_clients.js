;(function ($) {
    var MODULE_NAME = "city_stamgrclients.m_clients";
    var g_allInfor;

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("summary_rc", sRcName).split(",");
    }

    function drawEmptyPie(jEle)
    {
        var option = {
            height:200,
            calculable : false,
            series : [
                {
                    type:'pie',
                    radius : '85%',
                    center: ['60%', '50%'],
                    itemStyle: {
                        normal: {
                            // borderColor:"#FFF",
                            // borderWidth:1,
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
    function drawClientLocation(aModels,aModelData){
        var nEnd = parseInt(700/aModels.length)-1;
        var nWidth = $("#location_pie").parent().width()*0.95;

        var opt = {
            color: ['#4ec1b2'],
            width: nWidth,
            height: 200,
            grid: {
                x:40, y:0, x2:40, y2:25,
                borderColor: 'rgba(0,0,0,0)'
            },
            tooltip : {
                show: true,
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
            calculable : false,
            dataZoom : {
                show : true,
                realtime : true,
                start : 0,
                zoomLock: true,
                orient: "vertical",
                width: 10,
                x: nWidth-10,
                end: nEnd,
                backgroundColor:'#F7F9F8',
                fillerColor:'#BEC7CE',
                handleColor:'#BEC7CE'
            },
            xAxis : [
                {
                    type : 'value',
                    splitLine : {
                        show:false,
                        lineStyle: {
                            color: '#373737',
                            type: 'solid',
                            width: 1
                        }
                    },
                    splitArea : {
                        areaStyle : {
                            color: '#174686'
                        }
                    },
                    axisLine  : {
                        show:true,
                        lineStyle :{color: '#373737', width: 1}
                    }
                }
            ],
            yAxis : [
                {
                    show: true,
                    type : 'category',
                    boundaryGap : true,
                    data : aModels,
                    axisLabel:{
                        show:false,
                        textStyle: {color:"#80878c"}
                    },
                    splitLine : {
                        show:false
                    },
                    splitArea : {
                        areaStyle : {
                            color: '#174686'
                        }
                    },
                    axisLine  : {
                        show:true,
                        lineStyle :{color: '#373737', width: 1}
                    }
                }
            ],
            series : [
                {
                    type:'bar',
                    data: aModelData,
                    itemStyle : {
                        normal: {
                            label : {
                                show: true,
                                position: 'insideLeft',
                                formatter: function(x, y, val){
                                    return x.name;
                                },
                                textStyle: {color:"#000"}
                            }
                        },
                        emphasis: {
                            label : {
                                show: true,
                                formatter: function(x, y, val){
                                    return x.name;
                                },
                                textStyle: {color:"#000"}
                            }
                        }
                    }
                }
            ]
        };
        $("#location_pie").echart("init", opt);
    }
    function getClientLocationDataSuc(data){
        var names = [];
        var data = {
            apList: [
                {ApModel: "昌平区", ApCount: parseInt(Math.random()*300)},
                {ApModel: "海淀区", ApCount: parseInt(Math.random()*300)},
                {ApModel: "朝阳区", ApCount:parseInt(Math.random()*300)},
                {ApModel: "东城区", ApCount: parseInt(Math.random()*300)},
                {ApModel: "西城区", ApCount: parseInt(Math.random()*300)},
                {ApModel: "石景山区", ApCount:parseInt(Math.random()*300)},
                {ApModel: "丰台区", ApCount: parseInt(Math.random()*300)},
                {ApModel: "大兴区", ApCount: parseInt(Math.random()*300)},
                {ApModel: "顺义区", ApCount: parseInt(Math.random()*300)},
                {ApModel: "平谷区", ApCount: parseInt(Math.random()*300)},
                {ApModel: "密云区", ApCount:parseInt(Math.random()*300)},
                {ApModel: "延庆区", ApCount: parseInt(Math.random()*300)}]
        };
        $.each(data.apList,function(index,oData){
            names.push(oData.ApModel);
        });
        var values = [];
        $.each(data.apList,function(index,oData){
            values.push({name:oData.ApModel,value:oData.ApCount});
        });
        drawClientLocation(names,values)
    }
    function drawServiceType(tuli,shuju){
        option = {
            height:200,
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            calculable : false,
            series : [
                {
                    name:'访问来源',
                    type:'pie',
                    selectedMode: 'single',
                    radius : '50%',
                    center: ['25%', '50%'],
                    // for funnel
                    itemStyle: {
                        normal: {
                            borderColor:"#FFF",
                            borderWidth:1,
                            labelLine:{
                                show:false
                            },
                            color: function(a,b,c,d) {
                                var colorList = ['#b3b7dd','#4ec1b2'];
                                // var colorList = ['#4ec1b2','#b3b7dd'];
                                return colorList[a.dataIndex];
                            },
                            label:
                            {
                                position:"inner",
                                formatter: '{b}'
                            }
                        }
                    },
                    data:[
                        {value:335, name:'2.4G'},
                        {value:679, name:'5G'}
                    ]
                },
                {
                    name:'访问来源',
                    type:'pie',
                    radius : ['60%','85%'],
                    center: ['25%', '50%'],
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

                    data:[
                        {value:335, name:'城市设备'},
                        {value:310, name:'城市热点'},
                        {value:234, name:'内部服务'},

                    ]
                }
            ]
        };
        var oTheme = {
            color : ['#4fc4f6','#4ec1b2','#f2bc98']
        };
        $("#servicetype_pie").echart ("init", option, oTheme);
    }
   function drawMobileDevice(tuli,shuju){
        // if(shuju==undefined)
        var deviceChangDu=shuju.length;
        if(deviceChangDu==0)
        {
            drawEmptyPie($("#deviceType"));
            return;
        }
        var option = {
            height:200,
            tooltip : {
                trigger: 'item',
                formatter: "{a} {b} <br/>{c} ({d}%)"
            },
            calculable : false,
            click: function(oInfo){
                openDalg(oInfo.name,"","MobileCompany");
            },            
            series : [
                {
                    type:'pie',
                    radius : '85%',
                    center: ['25%', '50%'],
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
                                formatter: function(a,b,c,d){
                                    return Math.round(a.percent)+"%";
                                }
                            }
                        }
                    },
                    data:shuju
                }
            ]
        };
        var oTheme = {
            color : ['#4fc4f6','#78cec3','#4ec1b2','#f2bc98','#fbceb1','#fe808b','#ff9c9e','#e7e7e9']
        };
        $("#deviceType").echart ("init", option,oTheme);
        ul = $('<ul class="lengendlist city-pielist"></ul>');
        ul1= $('<ul class="lengendlist city-pielist1 l5"></ul>');
        for(i in tuli)
        {
            li = $('<li style="background:'+oTheme.color[i]+'"class="lengend-icon"></li>');
            sp = $("<span class='lengend-num'>"+tuli[i]+"</span>");
            $(li).append(sp);
            if (tuli.length > 3)
            {
                if (i%2 === 0)
                {
                    $(ul).append(li);
                }
                else
                {
                    $(ul1).append(li);
                }
            }
            else
            {
                $(ul).append(li);
            }
        }
       if (tuli.length > 3) {
           $("#deviceType").append(ul, ul1);
       }
       else
       {
           $("#deviceType").append(ul);
       }
    }




    function drawWireless(duixiangduixiang)
    {
        //huo qu bian liang
        var newObject={};
        $.extend(newObject, duixiangduixiang);

        newObject.Num5G=newObject["11a"]+newObject["11ac"]+newObject["11an"];
        newObject.Num2G=newObject["11g"]+newObject["11gn"]+newObject["11b"];

        if(newObject.Num5G == 0 && newObject.Num2G == 0)
        {
            $("#wireless_ul").hide();
            $("#wireless_ul1").hide();
            drawEmptyPie($("#wireless_pie"));

            return;
        }

        //undefined 声明
        if(newObject.Num5G==0){
            delete newObject.Num5G;
        }
        if(newObject.Num2G==0){
            delete newObject.Num2G;
        }  

        //undefined 声明
        if(newObject["11ac"] == 0){delete newObject["11ac"];}
        if(newObject["11an"] == 0){delete newObject["11an"];}
        if(newObject["11a"] == 0){delete newObject["11a"];}
        if(newObject["11g"] == 0){delete newObject["11g"];}
        if(newObject["11gn"] == 0){delete newObject["11gn"];}
        if(newObject["11b"] == 0){delete newObject["11b"];}

        //hua tu
        var option = {
            height:200,
            tooltip : {
                trigger: 'item',
                formatter: "{a} {b} <br/>{c} ({d}%)"
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
                    radius : '50%',
                    center: ['20%', '50%'],

                    itemStyle: {
                        normal: {
                            borderColor:"#FFF",
                            borderWidth:1,
                            labelLine:{
                                show:false
                            },
                            color: function(a,b,c,d) {
                                 var colorList = ['#4ec1b2','#b3b7dd'];
                                // var colorList = ['#4ec1b2','#b3b7dd'];
                                return colorList[a.dataIndex];
                            },
                            label:
                            {
                                position:"inner",
                                formatter: '{b}'
                            }
                        }
                    },
                    data: [
                        {name:'5GHz',value:newObject.Num5G},
                        {name:'2.4GHz',value:newObject.Num2G}
                    ]
                },
                {
                    type:'pie',
                    radius : ['60%','85%'],
                    center: ['20%', '50%'],
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
                                formatter:function(a,b,c,d) {
                                    return Math.round(a.percent)+"%";
                                }
                            }
                        }
                    },
                    data: [
                        {name:'802.11ac(5GHz)',value:newObject["11ac"]},                        
                        {name:'802.11an(5GHz)',value:newObject["11an"]},
                        {name:'802.11a(5GHz)',value:newObject["11a"]},
                        {name:'802.11gn(2.4GHz)',value:newObject["11gn"]},
                        {name:'802.11g(2.4GHz)',value:newObject["11g"]},
                        {name:'802.11b(2.4GHz)',value:newObject["11b"]}
                    ]
                }
            ]
        };
        var oTheme={
                color: ['#4ec1b2','#95dad1','#caece8','#b3b7dd','#d1d4eb','#e8e9f5']
        };
        
        $("#wireless_pie").echart("init", option,oTheme);
    }


    function openDalg(aType, sName, type)
    {       
        
        Utils.Base.openDlg("city_stamgrclients.view_client", {"a":aType,"b":sName,"c":type}, {scope:$("#maoxian"),className:"modal-super dashboard"});
        return false;               

    }


    // function showMode(row, cell, value, columnDef, oRowData,sType)
    // {
    //     switch(value)
    //     {
    //         case "1": value = 0; break;
    //         case "2": value = 1; break;
    //         case "4": value = 2; break;
    //         case "8": value = 3; break;
    //         case "16": value = 4; break;
    //         case "64": value = 5; break;
    //     }
    //     return getRcText("WIRELESS_MODE")[value];
    // }

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

        return '<a href="'+sName+'" index="'+nIndex+'" style="color: #008aea;">'+ value +'</a>';
    }

  

    function initData(){

        // Utils.Base.updateHtml($(".head-bar"),g_allInfor);        
        //按5G和2.4G获取终端统计个数
        var mapNameList = ["北京","昌平区","海淀区"];
        $("#AreaSelect").singleSelect("InitData", mapNameList);
        function getclientstatisticbybandtypeOK(data){
            // if(data.errorcode == 0)
            if(!data.errcode)
            {
                //head-bar : fu zhi
                
                var Num5GValue=data.client_statistic.band_5g;
                var Num2GValue=data.client_statistic.band_2_4g;
                var TotalValue=parseInt(Num5GValue)+parseInt(Num2GValue);
                
                $("#Total").html(TotalValue);
                $("#Num5G").html(Num5GValue);
                $("#Num2G").html(Num2GValue);
                
            }
            else{      
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


        // $("#byApList").SList ("refresh", g_allInfor.byAp);
        //按ap以及无线模式5G和2.4G获取终端统计个数
        getclientstatisticbyapFunctionFirst();

        // $("#bySsidList").SList ("refresh", g_allInfor.bySsid);
        //按SSID获取终端统计个数
        function getclientstatisticbyssidOK(data){
            // if(data.errorcode == 0)
            if(!data.errcode)
            {
                //ssid slit : fu zhi
                
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
        

        // drawWireless();
        //根据无线模式获取终端统计个数
        function getclientstatisticbymodeOK(data){
            if(!data.errcode)
            {                        
                // var newObject={"11a":4,"11an":4,"11ac":4,"11g":8,"11gn":8,"11b":0};
                // drawWireless(newObject);
                drawWireless(data.client_statistic); 
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


        // drawAuthen();
        //按手机厂商获取终端个数
        //可能日后需要处理：undefined的情
        getClientLocationDataSuc();
        drawServiceType();
        function getclientstatisticbybyodOK(data){
            // if(data.errorcode == 0)
            if(!data.errcode)
            {                        
                //else内容
                var newObject=[
                    {"clientVendor":"Max","count":2},
                    {"clientVendor":"MZ","count":2},
                    {"clientVendor":"Apple","count":2},
                    {"clientVendor":"Windows","count":2},
                    {"clientVendor":"Other","count":2},
                    {"clientVendor":"undefined","count":0},
                    {"clientVendor":"","count":10}
                ];

                //if 内容
                var newObject=data.client_statistic; 

                var legendOfOK=[];
                $.each(newObject,function(i,item){
                    legendOfOK[i]=item.clientVendor || "未知";
                });

                var dataOfOK=[];
                $.each(newObject,function(i,item){
                    dataOfOK[i]={};
                    dataOfOK[i].name=item.clientVendor || "未知";
                    dataOfOK[i].value=item.count || undefined;
                });

                drawMobileDevice(legendOfOK,dataOfOK);
            }
            else{
                 
            }                
        }

        function getclientstatisticbybyodFail(err){
            console.log("ajax request fail:"+err);
        }            
        var getclientstatisticbybyod = {            
            type:"GET",
            url:MyConfig.path+"/stamonitor/getclientstatisticbybyod?devSN="+FrameInfo.ACSN,
            contentType:"application/json",
            dataType:"json",
            onSuccess:getclientstatisticbybyodOK,
            onFailed:getclientstatisticbybyodFail
        };

        Utils.Request.sendRequest(getclientstatisticbybyod);                

        //用户历史变化折线图
        //转换时间的方法
        function getDateByMode(){
            var g_count = [6,24,7,30,12];
            var mode=3;

            var date = [];
            var daysCount = g_count[mode];
            var tenmin = 10 * 60 * 1000;
            var oneHour = tenmin * 6;
            var oneDay = oneHour * 24;
            var oneMonth = oneDay * 30;
            var base = 0;

            if(mode == 3){
                base = (new Date())-((daysCount+1)*oneDay);
                for (var i = 0; i < daysCount; i++) {
                    var now = new Date(base += oneDay);
                    date.push(now.getDate());
                }
            }
            
            return date;
        }

        function getHistoryPeopleOK(data){
            // if(data.errorcode == 0)
            if(!data.errcode)
            {                        
                
                //把拿过来的“由多个对象组成的数组”，变成“数字组成的数组”
                var countcount=[]; 

                // var datedate=getDateByMode();                   
                var datedate=[];

                var historyLength=data.client_statistic.length;
                for(var i = 0; i < historyLength; i++)
                {
                    //排顺序
                    // var changdu=data.client_statistic.length-1;

                    //放个数
                    countcount.push(data.client_statistic[i].count);

                    //放时间
                    var counttime0=data.client_statistic[i].time;
                    var counttime1=counttime0.split('T')[0];
                    var counttime2=counttime1.split('-')[2];
                    datedate.push(counttime2);
                    
                }
                drawLoginUserCount(countcount,datedate);

            }
            else{
                
            }                
        }

        function getHistoryPeopleFail(err){
            console.log("ajax request fail:"+err);
        } 
        //请求参数是：1个月

        //请求参数需要算好时间        
        var para;
        var tenmin = 10 * 60 * 1000;
        var oneHour = tenmin * 6;
        var oneDay = oneHour * 24;
        var oneMonth = oneDay * 30;
        var oneYear = oneDay * 365;
        var curdate = new Date();
        var predate;

        var predate = new Date(curdate - oneMonth);

        // var para = "&statistic_type=oneMonth&startTime="+predate.getTime()+"&endTime="+curdate.getTime()+"&interval=1d";
        var para = "&statistic_type=oneMonth";

        var getHistoryPeople = {            
            type:"GET",
            url:MyConfig.path+"/stamonitor/histclientstatistic?devSN="+FrameInfo.ACSN+para,
            contentType:"application/json",
            dataType:"json",
            onSuccess:getHistoryPeopleOK,
            onFailed:getHistoryPeopleFail
        };

        Utils.Request.sendRequest(getHistoryPeople);             



        //30天内新增用户变化折线图
        function getNewPeopleOK(data){
            // if(data.errorcode == 0)
            if(!data.errcode)
            {                        
                //把拿过来的“由多个对象组成的数组”，变成“数字组成的数组”
                var countcount=[]; 

                // "2016-04-15T05:45:07.277Z"
                // var datedate=['wo', 'bu', 'hui', 'suan', 'shi', 'jian', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
                var datedate=[];

                var newLength=data.clientCounts.length;

                for(var i = 0; i < newLength; i++)
                {
                    //改变顺序
                    var changdu=newLength-1;

                    //放个数
                    countcount.push(data.clientCounts[changdu-i].count);

                    //放日期
                    var counttime0=data.clientCounts[changdu-i].countTime;
                    var counttime1=counttime0.split('T')[0];
                    var counttime2=counttime1.split('-')[2];
                    datedate.push(counttime2);
                }
                drawNewUserCount(countcount,datedate);
            }
            else{
            }                
        }

        function getNewPeopleFail(err){
            console.log("ajax request fail:"+err);
        } 
        //请求参数是：1个月
        
        var getNewPeople = {            
            type:"GET",
            url:MyConfig.path+"/stamonitor/getNewClientsStatistics?devSN="+FrameInfo.ACSN,
            contentType:"application/json",
            dataType:"json",
            onSuccess:getNewPeopleOK,
            onFailed:getNewPeopleFail
        };

        Utils.Request.sendRequest(getNewPeople);    



        //获取认证终端数
        function getportalUserCountSuc (data) {
            // console.log(data.portalusercount);
            // console.log(Utils.Base.addComma(data.portalusercount));
            // console.log(10000000);
            // console.log(Utils.Base.addComma(10000000));
            $("#NumRZ").html( Utils.Base.addComma(data.portalusercount));
        }
        function getportalUserCountFail (err) {
            console.log("ajax request fail:"+err);
        }
        var portalUserCountOpt = {
            url: MyConfig.path+"/portalmonitor/portalusercount",
            type: "GET",
            dataType: "json",
            data:{
                devSN:FrameInfo.ACSN
            },
            onSuccess:getportalUserCountSuc,
            onFailed:getportalUserCountFail
        };
        Utils.Request.sendRequest(portalUserCountOpt);
    }

    //第一次：按ap以及无线模式5G和2.4G获取终端统计个数
    function getclientstatisticbyapFunctionFirst(){
        var skipnum=0;
        var pagesize=10;
        var shaiXuan={"findoption":{},"sortoption":{}};
        
        var whatList=$("#byApList");
        getclientstatisticbyapFunction(skipnum,pagesize,shaiXuan,whatList);                
    }

    //按ap以及无线模式5G和2.4G获取终端统计个数
    function getclientstatisticbyapFunction(skipWhatData,meiYeShuJu,guoLvData,naGeList){
        function getclientstatisticbyapOK(data){
            // if(data.errorcode == 0)
            if(!data.errcode)
            {
                //ap slit : fu zhi
                
                var g_allInforbyAp=[];
                $.each(data.client_statistic,function(i,item){
                    g_allInforbyAp[i]={};
                    g_allInforbyAp[i].ApName=item.apName;
                    g_allInforbyAp[i].ClientNumber2G=item.band_2_4g;
                    g_allInforbyAp[i].ClientNumber5G=item.band_5g;
                }); 
                $("#byApList").SList ("refresh", {data:g_allInforbyAp,total:data.count_total});            
            }
            else{
                console.log('请求失败');
            }
        }

        function getclientstatisticbyapFail(err){
            console.log("ajax request fail:"+err);
        }

        //准备urlPara请求参数
        var url=MyConfig.path+"/stamonitor/getclientstatisticbyap?devSN="+FrameInfo.ACSN;
        
        var valueOfskipnum=skipWhatData;
        var valueOflimitnum=meiYeShuJu;
        var requestData ="&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum;

        url=url+requestData;

        //准备requestBody请求参数
        var requestDataPost={};
        $.extend(requestDataPost,guoLvData);

        //ajax请求头部
        var getclientstatisticbyap = {
            type:"GET",
            url:url,
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify(requestDataPost),
            onSuccess:getclientstatisticbyapOK,
            onFailed:getclientstatisticbyapFail
        };

        Utils.Request.sendRequest(getclientstatisticbyap); 
    }

    //画折线图

    // function drawLoginUserCount(snr, newdata, date, amode) {
    function drawLoginUserCount(bData,date) {
       
        var xText = ['分','时','日','日','月'];
        var amode=3;
        

        // var bData=[2, 0, 1, 0, 0, 0, 0, 0, 0, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3];
        // var date=[15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
        
        // console.log(bData);
        // console.log(date);
    
        option = {
            width: "100%",
            height:280,
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
                data:['终端总数']
            },
            calculable : false,
            grid :
            {
                x:40, y:30, x2:30, y2:40,
                borderColor : '#fff'
            },
            xAxis : [
                {
                    name: xText[amode],
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

                    // axisTick:"item",
                    type : 'category',
                    data : date
                }
            ],
            yAxis : [
                {
                    name:getRcText("USER_COUNT"),
                    splitLine:{
                        show:true,
                        textStyle:{color: '#c9c4c5', fontSize:"1px", width:4},
                        lineStyle: {
                            // 使用深浅的间隔色
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
                    name:"终端总数",
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

        $("#loginuser").echart("init", option, oTheme);

    }    

    function drawNewUserCount(bData,date) {
       
        var xText = ['分','时','日','日','月'];
        var amode=3;
        

        // var bData=[2, 0, 1, 0, 0, 0, 0, 0, 0, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3];
        // var date=[15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
        
        // console.log(bData);
        // console.log(date);
    
        option = {
            width: "100%",
            height:280,
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
                data:['用户新增个数']
            },
            calculable : false,
            grid :
            {
                x:40, y:30, x2:30, y2:40,
                borderColor : '#fff'
            },
            xAxis : [
                {
                    name: xText[amode],
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

                    // axisTick:"item",
                    type : 'category',
                    data : date
                }
            ],
            yAxis : [
                {
                    name:getRcText("USER_COUNT"),
                    splitLine:{
                        show:true,
                        textStyle:{color: '#c9c4c5', fontSize:"1px", width:4},
                        lineStyle: {
                            // 使用深浅的间隔色
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
                    name:"用户新增个数",
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

        $("#newuser").echart("init", option, oTheme);

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
                openDalg(aType[$(this).attr("index")],$(this).attr("href"),"ap");
            }
            return false;
        });

        //链接mlist页面
        $("#submit_scan").on("click", function(){
            Utils.Base.redirect ({np:$(this).attr("href")});
            return false;
        });
    }



    // function jiaGong0(row, cell, value, columnDef, oRowData,sType){    
    //     return ""+value+"";
    // }
    // function jiaGongclientRadioMode(row, cell, value, columnDef, oRowData,sType){ 
    //     //1-,2-,4-,8-,16 -,64-
    //     if(value==1){
    //         return "802.11b";
    //     }else if(value==2){
    //         return "802.11a";
    //     }else if(value==4){
    //         return "802.11g";
    //     }else if(value==8){
    //         return "802.11gn";
    //     }else if(value==16){
    //         return "802.11an";
    //     }else if(value==64){
    //         return "802.11ac";
    //     }else{
    //         return "BuKeNeng";
    //     }
        
    // }

    // function jiaGongonlineTime(row, cell, value, columnDef, oRowData,sType){ 
        
    //     var argument0=value;

    //     var hh=parseInt(argument0/3600);
    //     var mm0=argument0%3600;
        
    //     var mm=parseInt(mm0/60);
    //     var ss=mm0%60;

    //     if(hh<10){
    //         var printHH="0"+hh;
    //     }else{
    //         var printHH=hh;
    //     }


    //     if(mm<10){
    //         var printMM="0"+mm;
    //     }else{
    //         var printMM=mm;
    //     }

    //     if(ss<10){
    //         var printSS="0"+ss;
    //     }else{
    //         var printSS=ss;
    //     }

    //     var sDatatime=printHH+':'+printMM+':'+printSS;
    //     return sDatatime;
    // }

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

            asyncPaging:true,
            onPageChange:function(pageNum,pageSize,oFilter,oSorter){
                var valueOfskipnum=(parseInt(pageNum-1))*(parseInt(pageSize));
                var valueOflimitnum=pageSize;

                var guoLvTiaoJian={};
                //升序1、降序-1
                var oSorterhaha={};
                $.extend(oSorterhaha,oSorter);
                if(oSorterhaha.isDesc==true){
                    oSorterhaha.isDesc=-1;
                }else if(oSorterhaha.isDesc==false){
                    oSorterhaha.isDesc=1;
                }      

                //sortoption对象，如下
                var paiXuObject={};
                paiXuObject[oSorterhaha.name]=oSorterhaha.isDesc;          

                //requestBody,如下
                var guoLvTiaoJian={"findoption":oFilter,"sortoption":paiXuObject};

                var whatList=$("#byApList");
                getclientstatisticbyapFunction(valueOfskipnum,valueOflimitnum,guoLvTiaoJian,whatList);
            },  
            onSearch:function(oFilter,oSorter){
                //dangqianyeshujuyoujitiao000000000000
                var valueOfskipnum=0;
                var valueOflimitnum=5;
                var whatList=$("#byApList");
                
                //升序1、降序-1
                var oSorterhaha={};
                $.extend(oSorterhaha,oSorter);
                if(oSorterhaha.isDesc==true){
                    oSorterhaha.isDesc=-1;
                }else if(oSorterhaha.isDesc==false){
                    oSorterhaha.isDesc=1;
                }      

                //sortoption对象，如下
                var paiXuObject={};
                paiXuObject[oSorterhaha.name]=oSorterhaha.isDesc;          

                //requestBody,如下
                var guoLvTiaoJian={"findoption":oFilter,"sortoption":paiXuObject};                

                //发送请求
                getclientstatisticbyapFunction(valueOfskipnum,valueOflimitnum,guoLvTiaoJian,whatList);
            },
            onSort:function(sName,isDesc){
                //dangqianyeshujuyoujitiao000000000000
                var valueOfskipnum=0;
                var valueOflimitnum=5;                
                var whatList=$("#byApList");

                //升序1、降序-1
                var shunxu=isDesc;
                if(shunxu==true){
                    shunxu=-1;
                }else if(shunxu==false){
                    shunxu=1;
                }else{
                    console.log('here is try catch .');
                }

                //sortoption对象，如下                
                var paiXuObject={};
                paiXuObject[sName]=shunxu;

                //requestBody,如下
                var guoLvTiaoJian={"findoption":{},"sortoption":paiXuObject};

                //发送请求
                getclientstatisticbyapFunction(valueOfskipnum,valueOflimitnum,guoLvTiaoJian,whatList);
            },  

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
        // NC = Utils.Pages[MODULE_NC].NC; 
        initGrid();
        var optSsid = {
            colNames: getRcText ("SSID_HEADER"),
            showHeader: true,
            pageSize : 4,

            colModel: [
                {name: "SSID", datatype: "String",width:150},
                {name: "ClientNumber5G", datatype: "String",formatter:showNum},
                {name: "ClientNumber2G", datatype: "String",formatter:showNum}
            ]
        };
        $("#byClientList").SList ("head", optSsid);
        initForm();
        initData();

        var g_allInforbySsid =[{SSID:"123",ClientNumber5G:"",ClientNumber2G:""}]
        $("#byClientList").SList ("refresh", g_allInforbySsid);
        $("#AreaSelect").change(function(){
            var location = $("#AreaSelect").singleSelect("value");
            if ("北京" == location)
            {
                $("#clienthistogram").show();
                $("#clientlist").hide();
            }
            else
            {
                $("#clienthistogram").hide();
                $("#clientlist").show();
            }

        });
    };

    function _destroy()
    {
        console.log("destory*******无线终端首页*******");
        Utils.Request.clearMoudleAjax(MODULE_NAME);        
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init, 
        "destroy": _destroy, 
        "widgets": ["SList","Echart","SingleSelect"],
        "utils":["Request","Base"]
    });
})( jQuery );

