;(function ($) {
    var MODULE_NAME = "b_device.summary_station";
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


   function drawMobileDevice(tuli,shuju){
        // if(shuju==undefined)
        var newObject=[
            {name:"Max","value":2},
            {name:"MZ","value":2},
            {name:"Apple","value":2},
            {name:"Windows","value":2},
            {name:"Other","value":2},
            {name:"undefined","value":0},
            {name:"","value":10}
        ];
        // if(shuju.length==0)
        // {
        //     drawEmptyPie($("#deviceType"));
        //     return;
        // }
        var aleg = ["Max","MZ","Apple","Windows","Other","undefined",""];
        
        var option = {
            height:200,
            tooltip : {
                trigger: 'item',
                formatter: "{a} {b} <br/>{c} ({d}%)"
            },
            legend: {
                orient : 'vertical',
                x : 'left',
                data:aleg
            },
            calculable : false,
            click: function(oInfo){
                if(1)
                {
                    openDalg(oInfo.name,"","MobileCompany");
                    
                }
            },            
            series : [
                {
                    type:'pie',
                    radius : '85%',
                    center: ['50%', '50%'],
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
                    data:newObject
                }
            ]
        };
        var oTheme = {
            color : ['#4fc4f6','#78cec3','#4ec1b2','#f2bc98','#fbceb1','#fe808b','#ff9c9e','#e7e7e9']
        };
        $("#deviceType").echart ("init", option,oTheme);
    }

   function drawLine(tuli,shuju){
         var option = {
            height:350,
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:['最近30天新增用户']
            },
            toolbox: {
                show : false,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : ['D30','D27','D23','D18','D11','D6','D1']
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'最近30天新增用户',
                    type:'line',
                    stack: '总量',
                    data:[220, 182, 191, 234, 290, 330, 310]
                }
            ]
        };
                 var option2 = {
            height:350,
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:['在线用户变化']
            },
            toolbox: {
                show : false,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : ['D30','D27','D23','D18','D11','D6','D1']
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'在线用户变化',
                    type:'line',
                    stack: '总量',
                    data:[120, 132, 101, 134, 90, 230, 210]
                }
            ]
        };            
                    
        var oTheme = {
            color : ['#4fc4f6','#78cec3','#4ec1b2','#f2bc98','#fbceb1','#fe808b','#ff9c9e','#e7e7e9']
        };
        //$("#linein30d").echart("init",option,oTheme);
        //$("#uservary").echart("init",option2,oTheme);
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
            legend: {
                orient : 'vertical',
                x : 'left',
                y : 20,
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
                    radius : '50%',
                    center: ['50%', '50%'],

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
                    center: ['50%', '50%'],
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
                color: ['#4ec1b2','#78cec3','#95dad1','#b3b7dd','#c8c3e1','#e7e7e9']
        };
        
        $("#wireless_pie").echart("init", option,oTheme);
    }


    function openDalg(aType, sName, type)
    {
        // var aData = g_allInfor[aType[nIndex]][sName];
        // if($.isPlainObject(aData))
        // {
        //     aData = g_allInfor[aType[nIndex]][sName].aData;
        // }
        // $("#popList").SList("refresh",aData);
        //根据"ap名/SSID/手机厂商/无线模式"获取终端详细列表
        //第1次获取数据        
        var valueOflimitnum=10000;

        var dijici=0;
        var valueOfskipnum=(parseInt(valueOflimitnum))*(parseInt(dijici));

        getData();


        //方法定义
        function getData(){            

            if(type=="ap"){
                var url=MyConfig.path+"/stamonitor/getclientstatisticbyap_detail?devSN="+FrameInfo.ACSN;
                var valueOfapName=""+sName+"";
                var valueOfbandType=""+aType+"";

                // var requestData = {
                //     "apName":valueOfapName,"bandType":valueOfbandType,"skipnum":valueOfskipnum,"limitnum":valueOflimitnum
                // };

                var requestData = "&apName="+valueOfapName+"&bandType="+valueOfbandType+"&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum;  
                url=url+requestData; 
                             
            }else if(type=="ssid"){
                var url=MyConfig.path+"/stamonitor/getclientstatisticbyssid_detail?devSN="+FrameInfo.ACSN;
                var valueOfclientSSID=""+sName+"";
                var valueOfbandType=""+aType+"";
                            
                // var requestData = {
                //     "clientSSID":valueOfclientSSID,"bandType":valueOfbandType,"skipnum":valueOfskipnum,"limitnum":valueOflimitnum
                // };
                
                var requestData ="&clientSSID="+valueOfclientSSID+"&bandType="+valueOfbandType+"&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum;                
                url=url+requestData; 

            }else if(type=="80211wirelessMode"){
                var url=MyConfig.path+"/stamonitor/getclientstatisticbymode_detail?devSN="+FrameInfo.ACSN;
                var valueOfclientMode=""+aType+"";
                            
                // var requestData = {
                //     "clientMode":valueOfclientMode,"skipnum":valueOfskipnum,"limitnum":valueOflimitnum
                // };

                var requestData = "&clientMode="+valueOfclientMode+"&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum;  
                url=url+requestData;

            }else if(type=="MobileCompany"){
                var url=MyConfig.path+"/stamonitor/getclientstatisticbybyod_detail?devSN="+FrameInfo.ACSN;
                var valueOfclientVendor=""+aType+"";

                //“其它”的情况
                if(valueOfclientVendor=="其它") {
                    valueOfclientVendor="";
                }          
                // var requestData = {
                //     "clientVendor":valueOfclientVendor,"skipnum":valueOfskipnum,"limitnum":valueOflimitnum
                // };

                var requestData = "&clientVendor="+valueOfclientVendor+"&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum;
                url=url+requestData;

            }else{
                // alert('bu ke neng');
                return;
            }

            $.ajax({
                type:"GET",
                url:url,
                contentType:"application/json",
                dataType:"json",
                // data:JSON.stringify(requestData),
                success:function(data){
                    // if(data.errorcode == 0)
                    if(!data.errcode)
                    {
                        //ssidDetail list : fu zhi

                        //一次次地刷数据
                        $("#popList").SList("refresh",data.clientList);

                        if(data.clientList.length<valueOflimitnum){
                            //获取完数据，显示出弹出框
                            Utils.Base.openDlg(null, {}, {scope:$("#client_diag"),className:"modal-super dashboard"});
                            return false;                    
                        }else{
                            //第2/3/4...次获取数据
                            dijici=1+(parseInt(dijici));
                            valueOfskipnum=(parseInt(valueOflimitnum))*(parseInt(dijici));

                            getData();
                        }
                    }
                    else{
                        // Frame.Msg.error("根据SSID以及无线模式获取终端详细列表信息：失败");
                        var data=[
                        // {"aa":44}
                             {"clientMAC":1,"clientIP":"2","clientName":"3","clientVendor":"4","ApName":"5","clientSSID":"6","signalStrength":1,"clientTxRate":3,"clientRxRate":4,"onlineTime":5,"clientRadioMode":6,"clientMode":"cc","clientChannel":7,"NegoMaxRate":77}
                        
                        

                        ];
                        $("#popList").SList("refresh",data);
                        Utils.Base.openDlg(null, {}, {scope:$("#client_diag"),className:"modal-super dashboard"});
                        return false;                        
                    }
                },
                error:function(err){
                    // Frame.Msg.error(JSON.stringify(err));
                }
            });    
        }
    }


    function showMode(row, cell, value, columnDef, oRowData,sType)
    {
        switch(value)
        {
            case "1": value = 0; break;
            case "2": value = 1; break;
            case "4": value = 2; break;
            case "8": value = 3; break;
            case "16": value = 4; break;
            case "64": value = 5; break;
        }
        return getRcText("WIRELESS_MODE")[value];
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

        if(sType == "text")
        {
            return value;
        }

        return '<a href="'+sName+'" index="'+nIndex+'" style="color: #008aea;">'+ value +'</a>';;
    }

    // function makeInforData(aData,aSec,aLine)
    // {
    //     //for test//////////////////////////////////////////////////////
    //     // aSec = [];
    //     // aData = [];
    //     // var ss = ["1","2","4","8","16","64"];
    //     // var mmmmm = ["Active","Sleep"];
    //     // var device = [
    //     //     {value:20, name:'Windows'},
    //     //     {value:60, name:'iPad'},
    //     //     {value:110, name:'iPhone'},
    //     //     {value:30, name:'HTC'},
    //     //     {value:10, name:'Win 8'},
    //     //     {value:80, name:'Samsung'},
    //     //     {value:77, name:'Mtk'},
    //     //     {value:80, name:'Unknown'}
    //     // ];
    //     // for(var i=0;i<10;i++)
    //     // {
    //     //     var oo = {
    //     //         WirelessMode: ss[parseInt(Math.random()*6)],
    //     //         ApName : "AP-4444444444444444444444444444444444444444444444444444444444" + parseInt(Math.random()*10),
    //     //         Ssid : "SSID-" + parseInt(Math.random()*10),
    //     //         RadioId: parseInt(Math.random()*2 + 1),
    //     //         MacAddress:"00-00-00-"+parseInt(Math.random()*10) + "" + parseInt(Math.random()*10) + "-"+parseInt(Math.random()*10) + "" + parseInt(Math.random()*10) + "-"+parseInt(Math.random()*10) + "" + parseInt(Math.random()*10),
    //     //         DeviceType : device[parseInt(Math.random()*8)].name,
    //     //         VLAN : parseInt(Math.random()*2048),
    //     //         AkmMethod : parseInt(Math.random()*3),
    //     //         UpTime :  Utils.Base.addComma(parseInt(Math.random()*1000000)),
    //     //         PowerSaveMode : parseInt(Math.random()*1000),
    //     //         UserName : String.fromCharCode(parseInt(Math.random()*58 + 65))
    //     //     };
    //     //     aData.push(oo);
    //     // }
    //     /////////////////////////////////////////////////////////////////////////

    //     function classify(sKey1, sKey2, oChild)
    //     {
    //         if(!oInfor[sKey1][sKey2])
    //         {
    //             oInfor[sKey1][sKey2] = [oChild];
    //         }
    //         else
    //         {
    //             oInfor[sKey1][sKey2].push(oChild);
    //         }
    //     }

    //     var aSTypeString = getRcText("AKM_METHOD");
    //     var aSTypeString2 = getRcText("AKM_METHOD2");
    //     var oInfor = {
    //         Total : aData.length, 
    //         Num5G : 0,
    //         Num2G : 0,
    //         Wsm : {wsm1 : [], wsm2 : [], wsm4 : [], wsm8 : [], wsm16 : [], wsm64 : []},
    //         Ap5G : {},
    //         Ap2G : {},
    //         Ssid5G : {},
    //         Ssid2G : {},
    //         byAp : [],
    //         bySsid : [],
    //         Akm : {}
    //     };
        
    //     for(var i=0;i<oInfor.Total;i++)
    //     {
    //         var oTemp = aData[i];
    //         var sMode = "2G";
    //         var sAkmMethod = "";
    //         oInfor.Num2G ++;

    //         if(oTemp.WirelessMode == "2" || oTemp.WirelessMode == "16" || oTemp.WirelessMode == "64")
    //         {
    //             oInfor.Num5G ++ ;
    //             oInfor.Num2G --;
    //             sMode = "5G";
    //         }

    //         for(k=0;k<aLine.length;k++)
    //         {
    //             if(oTemp.Ipv4Address == aLine[k].IPAddress)
    //             {
    //                 oTemp.Portal = "1";
    //                 break;
    //             }
    //             else
    //             {
    //                 oTemp.Portal = "0";
    //             }
    //         }

    //         for(var j=0;j<aSec.length;j++)
    //         {
    //             if(oTemp.MacAddress == aSec[j].MacAddress)
    //             {
    //                 var sSecType = aSec[j].AkmMethod || "0";
    //                 sAkmMethod = aSTypeString[sSecType];
    //                 if (sAkmMethod == aSTypeString[2])
    //                 {
    //                     sAkmMethod = aSTypeString2[0];
    //                 }
    //                 oTemp.AkmMethod = aSTypeString[sSecType];
    //                 if(aSec[j].EncryptionCipher == "1" ||
    //                    aSec[j].EncryptionCipher == "5" || 
    //                    aSec[j].EncryptionCipher == "7")
    //                 {
    //                     oTemp.AkmMethod = aSTypeString[3];
    //                 }
                    
    //                 if(aSec[j].L2AuthType == "1" || oTemp.Portal == "1")
    //                 {
    //                     oTemp.AkmMethod += " & ";
    //                     if(sSecType == "0")
    //                     {
    //                         oTemp.AkmMethod = "";
    //                     }
    //                     // sAkmMethod == aSTypeString2[0] ? "":sAkmMethod+" & "
    //                     if(sAkmMethod == aSTypeString2[0])
    //                     {
    //                         sAkmMethod = "";
    //                     }
    //                     else
    //                     {
    //                         sAkmMethod += " & ";
    //                     }
    //                     if(aSec[j].L2AuthType == "1")
    //                     {
    //                         oTemp.AkmMethod += aSTypeString[4];
    //                         sAkmMethod += aSTypeString2[2];

    //                     }
    //                     if(oTemp.Portal == "1")
    //                     {
    //                         if(aSec[j].L2AuthType == "1")
    //                         {
    //                             oTemp.AkmMethod += " & ";
    //                             sAkmMethod += " & ";
    //                         }
    //                         oTemp.AkmMethod += aSTypeString[5];
    //                         sAkmMethod += aSTypeString2[3];
    //                     }
    //                 }

    //                 if(aSec[j].WepMode == "1")
    //                 {
    //                     oTemp.AkmMethod = aSTypeString[6];
    //                 }
    //                 if(sSecType = "0" && aSec[j].L2AuthType == "2")
    //                 {
    //                     oTemp.AkmMethod = aSTypeString[7];
    //                     sAkmMethod = aSTypeString2[1];
    //                 }
    //             }
    //         }

    //         // for(var j=0;j<aSec.length;j++)
    //         // {
    //         //     if(aSec[j].MacAddress == oTemp.MacAddress)
    //         //     {
    //         //         oTemp.AkmMethod = aSec[j].AkmMethod || "0";
    //         //         if(aSec[j].EncryptionCipher == "1" ||
    //         //            aSec[j].EncryptionCipher == "5" || 
    //         //            aSec[j].EncryptionCipher == "7")
    //         //         {
    //         //             oTemp.AkmMethod = "3";
    //         //         }
    //         //         if(aSec[j].WepMode == "1")
    //         //         {
    //         //             oTemp.AkmMethod = "6";
    //         //         }
    //         //         if(oTemp.AkmMethod == "0" && aSec[j].L2AuthType == "2")
    //         //         {
    //         //             oTemp.AkmMethod = "7";
    //         //         }
    //         //     }
    //         // }

    //         classify("Ap" + sMode, oTemp.ApName, oTemp);
    //         classify("Ssid" + sMode, oTemp.Ssid, oTemp);
    //         classify("Wsm", "wsm" + oTemp.WirelessMode, oTemp);
    //         classify("Akm", "akm" + sAkmMethod, oTemp);
    //     }

    //     for(key in oInfor.Ap5G)
    //     {
    //         oInfor.byAp.push({
    //             ApName : key,
    //             ClientNumber5G : oInfor.Ap5G[key].length,
    //             ClientNumber2G : oInfor.Ap2G[key] ? oInfor.Ap2G[key].length : 0
    //         });
    //     }

    //     for(key in oInfor.Ap2G)
    //     {
    //         if(oInfor.Ap5G[key])
    //         {
    //             continue;
    //         }
    //         oInfor.byAp.push({
    //             ApName : key,
    //             ClientNumber5G : 0,
    //             ClientNumber2G : oInfor.Ap2G[key].length
    //         });
    //     }

    //     for(key in oInfor.Ssid5G)
    //     {
    //         oInfor.bySsid.push({
    //             SSID : key,
    //             ClientNumber5G : oInfor.Ssid5G[key].length,
    //             ClientNumber2G : oInfor.Ssid2G[key] ? oInfor.Ssid2G[key].length : 0
    //         });
    //     }

    //     for(key in oInfor.Ssid2G)
    //     {
    //         if(oInfor.Ssid5G[key])
    //         {
    //             continue;
    //         }
    //         oInfor.bySsid.push({
    //             SSID : key,
    //             ClientNumber5G : 0,
    //             ClientNumber2G : oInfor.Ssid2G[key].length
    //         });
    //     }

    //     Utils.Base.addComma(oInfor);

    //     return oInfor;
    // }

    function initData()
    {

            // var aStation = Utils.Request.getTableRows (NC.Stations, oInfo);
            // var aSecurityInfo = Utils.Request.getTableRows  (NC.SecurityInfo, oInfo);
            // var aLine = Utils.Request.getTableRows (NC.OnlineUsers, oInfo);



            // var aLine=[
            //   {"IfIndex":"1","IPAddress":"1.1.1.12","UserName":"1231"},
            //   {"IfIndex":"1","IPAddress":"1.1.1.13","UserName":"1231"},
            //   {"IfIndex":"1","IPAddress":"1.1.1.14","UserName":"1231"},
            //   {"IfIndex":"1","IPAddress":"1","UserName":"1231"}
            // ];
            // var aSecurityInfo=
            // [
            //     {"MacAddress":"11-11-11-11-11-12","ClientType":"2","AkmMethod":"0","EncryptionCipher":"5"},
            //     {"MacAddress":"11-11-11-11-11-13","ClientType":"2","AkmMethod":"2","EncryptionCipher":""},
            //     {"MacAddress":"11-11-11-11-11-14","ClientType":"2","AkmMethod":"2","L2AuthType":"1"},
            //     {"MacAddress":"11-11-11-11-11-15","ClientType":"2","AkmMethod":"1","L2AuthType":"1","WepMode":"1"},
            //     {"MacAddress":"1-1-1","AccessCategory":"2","TID":"2"},
            //     {"MacAddress":"3-3-3","AccessCategory":"3","TID":"3"}
            // ];



            //     var aStation=
            //     [
            //     {"MacAddress":"11-11-11-11-11-12","UserName":"username1","WirelessMode":"1", "Aid":"aid1", "ApName":"AP1", "RadioId":"1", "Ssid":"ssid1", "Bssid":"bssid1", "VLAN":"1","PowerSaveMode":"0","ListenInterval":"listen1","RxRate":"1589","TxRate":"4816","UpTime":"897","QoSMode":"0","DeviceType":"Nokia","Ipv4Address":"1.1.1.12","Ipv6Address":"1:1::1:1","SNR":"33"}
            //     ,{"MacAddress":"11-11-11-11-11-13","UserName":"username2","WirelessMode":"64", "Aid":"aid2", "ApName":"AP2", "RadioId":"2", "Ssid":"ssid2", "Bssid":"bssid2", "VLAN":"2","PowerSaveMode":"1","ListenInterval":"listen2","UpTime":"58621476","QoSMode":"1","Ipv4Address":"1.1.1.13","Ipv6Address":"1:1::1:1","RxRate":"156489","TxRate":"564816","SNR":"33"}
            //     ,{"MacAddress":"11-11-11-11-11-14","UserName":"username2","WirelessMode":"2", "Aid":"aid2", "ApName":"AP2", "RadioId":"2", "Ssid":"ssid2", "Bssid":"bssid2", "VLAN":"2","PowerSaveMode":"0","ListenInterval":"listen2","UpTime":"58621476","QoSMode":"3","Ipv4Address":"1.1.1.14","Ipv6Address":"1:1::1:1","RxRate":"15649","TxRate":"5816","SNR":"44"},
            //     {"MacAddress":"aa-11-11-11-11-12","UserName":"username1","WirelessMode":"1", "Aid":"aid1", "ApName":"AP1", "RadioId":"1", "Ssid":"ssid1", "Bssid":"bssid1", "VLAN":"1","PowerSaveMode":"0","ListenInterval":"listen1","RxRate":"156489","TxRate":"564816","UpTime":"12376","QoSMode":"0","DeviceType":"Nokia","Ipv4Address":"1.1.1.1","Ipv6Address":"1:1::1:1","SNR":"55"}
            //     ,{"MacAddress":"bb-11-11-11-11-13","UserName":"username2","WirelessMode":"64", "Aid":"aid2", "ApName":"AP2", "RadioId":"2", "Ssid":"ssid2", "Bssid":"bssid2", "VLAN":"2","PowerSaveMode":"1","ListenInterval":"listen2","UpTime":"58621476","QoSMode":"1","Ipv4Address":"1.1.1.1","Ipv6Address":"1:1::1:1","RxRate":"1489","TxRate":"5816","SNR":"66"}
            //     ,{"MacAddress":"cc-11-11-11-11-14","UserName":"username2","WirelessMode":"2", "Aid":"aid2", "ApName":"AP2", "RadioId":"2", "Ssid":"ssid2", "Bssid":"bssid2", "VLAN":"2","PowerSaveMode":"0","ListenInterval":"listen2","UpTime":"58621476","QoSMode":"3","Ipv4Address":"1.1.1.1","Ipv6Address":"1:1::1:1","RxRate":"6489","TxRate":"816","SNR":"77"}
            //     ];


            // g_allInfor = makeInforData(aStation,aSecurityInfo,aLine);



            // Utils.Base.updateHtml($(".head-bar"),g_allInfor);
            //按5G和2.4G获取终端统计个数
            // $.ajax({
            //     type:"GET",
            //     url:MyConfig.path+"/stamonitor/getclientstatisticbybandtype?devSN="+FrameInfo.ACSN,
            //     contentType:"application/json",
            //     dataType:"json",
            //     success:function(data){
            //         // if(data.errorcode == 0)
            //         if(!data.errcode)
            //         {
            //             //head-bar : fu zhi

            //             var Num5GValue=data.client_statistic.band_5g;
            //             var Num2GValue=data.client_statistic.band_2_4g;
            //             var TotalValue=parseInt(Num5GValue)+parseInt(Num2GValue);

            //             $("#Total").html(TotalValue);
            //             $("#Num5G").html(Num5GValue);
            //             $("#Num2G").html(Num2GValue);

            //         }
            //         else{
            //             // Frame.Msg.error("按5G和2.4G获取终端统计个数：失败");
            //             $("#Total").html(16);
            //             $("#Num5G").html(8);
            //             $("#Num2G").html(8);
            //         }
            //     },
            //     error:function(err){
                    // Frame.Msg.error(JSON.stringify(err));
            //     }
            // });

            // $("#byApList").SList ("refresh", g_allInfor.byAp);
            //按ap以及无线模式5G和2.4G获取终端统计个数
            $.ajax({
                type:"GET",
                url:MyConfig.path+"/stamonitor/getclientstatisticbyap?devSN="+FrameInfo.ACSN,
                contentType:"application/json",
                dataType:"json",
                success:function(data){
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
                        $("#byApList").SList ("refresh", g_allInforbyAp);
                    }
                    else{
                        //Frame.Msg.error("按ap以及无线模式5G和2.4G获取终端统计个数：失败");
                        $("#byApList").SList ("refresh", [{ApName:"AP000",ClientNumber2G:8,ClientNumber5G:8}]);
                    }
                },
                error:function(err){
                    // Frame.Msg.error(JSON.stringify(err));
                }
            });

            // $("#bySsidList").SList ("refresh", g_allInfor.bySsid);
            //按SSID获取终端统计个数
            // $.ajax({
            //     type:"GET",
            //     url:MyConfig.path+"/stamonitor/getclientstatisticbyssid?devSN="+FrameInfo.ACSN,
            //     contentType:"application/json",
            //     dataType:"json",
            //     success:function(data){
            //         // if(data.errorcode == 0)
            //         if(!data.errcode)
            //         {
            //             //ssid slit : fu zhi
                        
            //             var g_allInforbySsid=[];
            //             $.each(data.client_statistic,function(i,item){
            //                 g_allInforbySsid[i]={};
            //                 g_allInforbySsid[i].SSID=item.clientSSID;
            //                 g_allInforbySsid[i].ClientNumber2G=item.band_2_4g;
            //                 g_allInforbySsid[i].ClientNumber5G=item.band_5g;
            //             }); 
            //             $("#bySsidList").SList ("refresh", g_allInforbySsid);            
            //         }
            //         else{
                        //Frame.Msg.error("按ap以及无线模式5G和2.4G获取终端统计个数：失败");
                        $("#bySsidList").SList ("refresh", [{ClientNumber2G:15,ClientNumber5G:15,SSID:"ssid000"}]);
                        
                //     }
                // },
                // error:function(err){
                    // Frame.Msg.error(JSON.stringify(err));
            //     }
            // });

            // drawWireless();
            //根据无线模式获取终端统计个数
            // $.ajax({
            //     type:"GET",
            //     url:MyConfig.path+"/stamonitor/getclientstatisticbymode?devSN="+FrameInfo.ACSN,
            //     contentType:"application/json",
            //     dataType:"json",
            //     success:function(data){


            //         if(!data.errcode)
            //         {                        
                        // var newObject={"11a":4,"11an":4,"11ac":4,"11g":8,"11gn":8,"11b":0};
                        // drawWireless(newObject);
                    //     drawWireless(data.client_statistic); 
                    // }
                    // else{
                        //Frame.Msg.error("根据无线模式获取终端统计个数：失败");

                        var newObject={"11a":4,"11an":4,"11ac":4,"11g":8,"11gn":8,"11b":0};
                        drawWireless(newObject);
                        
            //         }
            //     },
            //     error:function(err){
            //         // Frame.Msg.error(JSON.stringify(err));
            //     }
            // });

            // drawAuthen();
            //按手机厂商获取终端个数
            //可能日后需要处理：undefined的情况
            // $.ajax({
            //     type:"GET",
            //     url:MyConfig.path+"/stamonitor/getclientstatisticbybyod?devSN="+FrameInfo.ACSN,
            //     contentType:"application/json",
            //     dataType:"json",
            //     success:function(data){
            //         // if(data.errorcode == 0)
            //         if(!data.errcode)
            //         {                        
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

                        // //if 内容
                        // var newObject=data.client_statistic; 

                        // var legendOfOK=[];
                        // $.each(newObject,function(i,item){
                        //     legendOfOK[i]=item.clientVendor || "其它";
                        // });

                        // var dataOfOK=[];
                        // $.each(newObject,function(i,item){
                        //     dataOfOK[i]={};
                        //     dataOfOK[i].name=item.clientVendor || "其它";
                        //     dataOfOK[i].value=item.count || undefined;
                        // });

                       drawMobileDevice();
                    // }
                    // else{
                    //     Frame.Msg.error("按手机厂商获取终端个数：失败"); 
            //         }
            //     },
            //     error:function(err){
            //         // Frame.Msg.error(JSON.stringify(err));
            //     }
            // });      
    }
    function getEnddate() {
        var tNow = new Date();
        var nYear = tNow.getFullYear();
        var nMonth = tNow.getMonth() + 1;
        var nDay = tNow.getDate();
        var oNowEndTime = nYear + "-" + nMonth + "-" + nDay;
        return oNowEndTime;
    }
    function getStartdate(time) {
        var tNow = new Date(time);
        var nYear = tNow.getFullYear();
        var nMonth = tNow.getMonth() + 1;
        var nDay = tNow.getDate();
        var oNowEndTime = nYear + "-" + nMonth + "-" + nDay;
        return oNowEndTime;
    }
    function getOnlineSta(startTime, endTime) {
        return $.ajax({
            type: "GET",
            url: MyConfig.path + "/stamonitor/web/histolclient" + "?devSN=" + FrameInfo.ACSN + "&startTime="
            + startTime + "&endTime=" + endTime,
            //data: {
            //    devSN:FrameInfo.ACSN,
            //    startTime:startTime,
            //    endTime:endTime
            //},
            dataType: "json"
        });
    }
    function getDoubleStr(num) {
        return num >= 10 ? num : "0" + num;
    }
    function initUserChange1(type) {
        function getUserChange(startTime, endTime) {
            return $.ajax({
                type: "GET",
                url: MyConfig.path + "/stamonitor/web/histolclient",
                data: JSON.stringify({
                    devSN: FrameInfo.ACSN,
                    startTime: startTime,
                    endTime: endTime
                }),
                contentType: "application/json",
                dataType: "json"
            });
        }


        var nowTime = new Date();
        var preTime = (new Date()).setDate(nowTime.getDate() - 1);

        getUserChange(preTime, nowTime).done(function(data, textStatus, jqXHR) {
            data = data.OnLineClientList;
            if (data.length == 0) {
                return;
            }

        });
    }
    function drawWeekClientCount() {
        var Nowtime = (new Date()).getTime();
        var OneweeksAgotime = Nowtime - 604800000;
        var EndTime = getEnddate();
        var StartTime = getStartdate(OneweeksAgotime);
        var ClientList = initClientWeek();
        // getOnlineSta(StartTime, EndTime).done(function(data, textStatus, jqXHR) {
        //     for (var i = 0; i < data.OnLineClientList.length; i++) {
        //         if (i != (data.OnLineClientList.length - 1)) {
        //             var currentNode = new Date(data.OnLineClientList[i].updateTime);
        //             var NextNode = new Date(data.OnLineClientList[i + 1].updateTime);
        //             if ((currentNode.getDate() != NextNode.getDate()) || (currentNode.getMonth != NextNode.getMonth())) {
        //                 for (var j = 0; j < ClientList.length; j++) {
        //                     if (ClientList[j][0].getDate() == currentNode.getDate()) {
        //                         ClientList[j][0] = currentNode;
        //                         ClientList[j][1] = data.OnLineClientList[i].clientcount;
        //                         break;
        //                     }
        //                 }
        //             }
        //         }
        //         else {
        //             for (var h = 0; h < ClientList.length; h++) {
        //                 if (ClientList[h][0].getDate() == (new Date(data.OnLineClientList[data.OnLineClientList.length - 1].updateTime))) {
        //                     ClientList[h][0] = new Date(data.OnLineClientList[data.OnLineClientList.length - 1].updateTime);
        //                     ClientList[h][1] = data.OnLineClientList[data.OnLineClientList.length - 1].clientcount;
        //                     break;
        //                 }
        //             }
        //         }
        //     }
            drawWeekCliNum(ClientList);
        // });
    }
    function drawMonthClientCount() {
        var Nowtime = (new Date()).getTime();
        var OnemounthAgotime = Nowtime - 2678400000;
        var EndTime = getEnddate();
        var StartTime = getStartdate(OnemounthAgotime);
        var ClientList = initMonthDay();
        // getOnlineSta(StartTime, EndTime).done(function(data, textStatus, jqXHR) {
        //     for (var i = 0; i < data.OnLineClientList.length; i++) {
        //         if (i != (data.OnLineClientList.length - 1)) {
        //             var currentNode = new Date(data.OnLineClientList[i].updateTime);
        //             var NextNode = new Date(data.OnLineClientList[i + 1].updateTime);
        //             if ((currentNode.getDate() != NextNode.getDate()) || (currentNode.getMonth != NextNode.getMonth())) {
        //                 for (var j = 0; j < ClientList.length; j++) {
        //                     if (ClientList[j][0].getDate() == currentNode.getDate()) {
        //                         ClientList[j][0] = currentNode;
        //                         ClientList[j][1] = data.OnLineClientList[i].clientcount;
        //                         break;
        //                     }
        //                 }
        //             }
        //         }
        //         else {
        //             for (var h = 0; h < ClientList.length; h++) {
        //                 if (ClientList[h][0].getDate() == (new Date(data.OnLineClientList[data.OnLineClientList.length - 1].updateTime))) {
        //                     ClientList[h][0] = new Date(data.OnLineClientList[data.OnLineClientList.length - 1].updateTime);
        //                     break;
        //                 }
        //             }
        //         }
        //     }
            drawWeekCliNum(ClientList);
        // });
    }
    function drawOutletflow(aData1, aData2) {
        aData1.forEach(function(data) {
            data[1] = (data[1] > 0 ? 1 : -1) * data[1];
        }, this);

        aData2.forEach(function(data) {
            data[1] = (data[1] > 0 ? -1 : 1) * data[1];
        }, this);

        var Data1 = new Array();
        var Data2 = new Array();
        for (var i = 0; i < aData1.length; i++) {
            Data1[i] = aData1[i][1] * 1000;
            aData1[i][1] = aData1[i][1] * 1000;
        }
        for (i = 0; i < aData2.length; i++) {
            Data2[i] = aData2[i][1] * -1000;
            aData2[i][1] = aData2[i][1] * 1000;
        }
        Data1 = Data1.sort(function(data1, data2) { return data2 - data1; })
        Data2 = Data2.sort(function(data1, data2) { return data2 - data1; })

        var Unit = 0;
        while ((Data1[0] > 1000) || (Data2[0] > 1000)) {
            Data1[0] = Data1[0] / 1000;
            for (i = 0; i < aData1.length; i++) {
                aData1[i][1] = aData1[i][1] / 1000;
            }
            Data2[0] = Data2[0] / 1000;
            for (i = 0; i < aData2.length; i++) {
                aData2[i][1] = aData2[i][1] / 1000;
            }
            Unit++;
        }

        var Bandwidth = new Array("Kbps", "Mbps", "Gbps", "Tbps");
        var aseries = [];
        var oTemp1 = {
            symbol: "none",
            type: 'line',
            smooth: true,
            showAllSymbol: true,
            symbolSize: 2,
            itemStyle: {
                normal:
                {
                    areaStyle: { type: 'default' },
                    lineStyle: { width: 0 }
                }
            },
            name: "上行带宽",
            data: aData1
        };
        aseries.push(oTemp1);


        var oTemp2 = {
            symbol: "none",
            type: 'line',
            smooth: true,
            showAllSymbol: true,
            symbolSize: 2,
            itemStyle: { normal: { areaStyle: { type: 'default' }, lineStyle: { width: 0 } } },
            name: "下行带宽",
            data: aData2
        };
        aseries.push(oTemp2);

        var option = {
            width: "100%",
            height: "100%",
            tooltip: {
                show: true,
                trigger: 'item',
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: '#373737',
                        width: 0,
                        type: 'solid'
                    }
                }
            },
            legend: {
                orient: "horizontal",
                y: 0,
                // x: "right",
                x: "center",
                itemWidth: 8,//default 20
                // itemWidth: 12,//default 20
                textStyle: {
                    color: '#617085',
                    fontSize: '14px'
                },
                data: ["上行带宽", "下行带宽"]
            },
            grid: {
                x: 30, y: 20, x2: 22, y2: 30,
                borderColor: '#FFF'
            },
            calculable: false,
            xAxis: [
                {
                    type: 'time',
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: ['#eee']
                        }
                    },
                    axisLabel: {
                        show: true,
                        textStyle: { color: '#617085', fontSize: "12px" },
                        formatter: function(data) {
                            return getDoubleStr(data.getHours()) + ":" + getDoubleStr(data.getMinutes());
                        }
                    },
                    axisLine: {
                        show: true,
                        lineStyle: { color: '#AEAEB7', width: 1 }
                    },
                    axisTick: {
                        show: false
                    }
                }
            ],
            yAxis: [
                {
                    name: Bandwidth[Unit],
                    type: 'value',
                    splitLine: {
                        show: false,
                        lineStyle: {
                            color: ['#eee']
                        }
                    },
                    axisLabel: {
                        show: true,
                        textStyle: { color: '#617085', fontSize: "12px", width: 2 },
                        formatter: function(data) {
                            return data < 0 ? -data : data;
                        }
                    },
                    axisLine: {
                        show: true,
                        lineStyle: { color: '#AEAEB7', width: 1 }
                    }
                }
            ],
            animation: false,
            series: aseries
        };
        var oTheme = {
            color: ['#4ec1b2', '#f2bc98'],
            categoryAxis: {
                splitLine: { lineStyle: { color: ['#FFF'] } }
            }
        };
        $("#tape_change").echart("init", option, oTheme);
    }
    function getOnlineSta(startTime, endTime) {
        return $.ajax({
            type: "GET",
            url: MyConfig.path + "/stamonitor/web/histolclient" + "?devSN=" + FrameInfo.ACSN + "&startTime="
            + startTime + "&endTime=" + endTime,
            //data: {
            //    devSN:FrameInfo.ACSN,
            //    startTime:startTime,
            //    endTime:endTime
            //},
            dataType: "json"
        });
    }
    function getFlowInfo(startTime, endTime) {
        return $.ajax({
            type: "GET",
            url: MyConfig.path + "/devmonitor/web/hiswantraffic" + "?devSN=" + FrameInfo.ACSN + "&startTime="
            + startTime + "&endTime=" + endTime,
            //data: {
            //    devSN: FrameInfo.ACSN,
            //    startTime: startTime,
            //    endTime: endTime
            //},
            dataType: "json"
        });
    }
    function initClientDay() {
        /*将一天分成6段*/
        var ClientList = new Array(6);
        var Nowtime = (new Date()).getTime();
        for (var i = 0; i < ClientList.length; i++) {
            ClientList[i] = [(new Date(Nowtime - ((ClientList.length - i - 1) * 14400000))), 100];
        }
        return ClientList;
    }
    function drawDayflow() {
        var Nowtime = (new Date()).getTime();
        var OneDayAgotime = Nowtime - 86400000;
        var EndTime = getEnddate();
        var StartTime = getStartdate(OneDayAgotime);
        var fourHours = 4 * 60 * 60 * 1000;
        var upFlow = initClientDay();
        var downFlow = initClientDay();
        getFlowInfo(StartTime, EndTime).done(function(data, textStatus, jqXHR) {

            for (var i = 0; i < data.trafficList.length; i++) {
                var currentNode = new Date(data.trafficList[i].updateTime);
                var sub = currentNode - OneDayAgotime;
                if (sub > 0) {
                    var count = parseInt(sub / fourHours);
                    if (upFlow[count][1] < (data.trafficList[i].speed_up / 1000)) {
                        upFlow[count][1] = data.trafficList[i].speed_up / 1000;
                        upFlow[count][0] = currentNode;
                    }
                    if ((downFlow[count][1] * -1) < (data.trafficList[i].speed_down / 1000)) {
                        downFlow[count][1] = data.trafficList[i].speed_down / 1000 * -1;
                        downFlow[count][0] = currentNode;
                    }
                }
            }
            drawOutletflow(upFlow, downFlow);

        });
    }
    function drawdayClientCount() {
        var Nowtime = (new Date()).getTime();
        var OnedayAgotime = Nowtime - 86400000;
        var EndTime = getEnddate();
        var StartTime = getStartdate(OnedayAgotime);
        var ClientList = initClientDay();
        var fourHours = 4 * 60 * 60 * 1000;
        // getOnlineSta(StartTime, EndTime).done(function(data, textStatus, jqXHR) {
        //     for (var i = 0; i < data.OnLineClientList.length; i++) {
        //         var currentNode = new Date(data.OnLineClientList[i].updateTime);
        //         var sub = currentNode - OnedayAgotime;
        //         if (sub > 0) {
        //             var count = parseInt(sub / fourHours);
        //             if (ClientList[count][1] < data.OnLineClientList[i].clientcount) {
        //                 ClientList[count][1] = data.OnLineClientList[i].clientcount;
        //                 ClientList[count][0] = currentNode;
        //             }
        //         }
        //     }
            initUserChange(ClientList);
        // });
    }
    function initUserChange(aInData) {
        var aseries = [];
        aInData[0][1] = 100;
        aInData[1][1] = 200;
        aInData[2][1] = 300;
        aInData[3][1] = 400;
        aInData[4][1] = 500;
        aInData[5][1] = 300;
        var oTemp = {
            type: 'line',
            smooth: true,
            symbol: "none",
            showAllSymbol: true,
            symbolSize: 2,
            itemStyle: { normal: { areaStyle: { type: 'default' }, lineStyle: { width: 0 } } },
            name: "终端数",
            data: aInData
        };
        aseries.push(oTemp);
        var option = {
            width: "100%",
            height: "230px",
            tooltip: {
                show: true,
                trigger: 'item',
                formatter: function(params) {
                    var time = params.value[0].toISOString().split(".")[0].split("T").toString();
                    if (params.value[1] < 0)
                        params.value[1] = -params.value[1];
                    var string = params.seriesName + "<br/>" + time + "<br/>" + params.value[1] + "Mbps"
                    return string;
                },
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: "#94DAD0",//'#373737',
                        width: 0,
                        type: 'solid'
                    }
                }
            },
            legend: {
                orient: "horizontal",
                y: 0,
                // x: "right",
                x: "center",
                itemWidth: 8,//default 20
                // itemWidth: 12,//default 20
                textStyle: { color: '#617085', fontSize: "12px" },
                // textStyle: { color: '#9AD4DC', fontSize: "12px" },
                data: ['终端数']
            },
            grid: {
                x: 30, y: 20, x2: 22, y2: 30,
                borderColor: '#FFF'
            },
            calculable: false,
            xAxis: [
                {
                    type: 'time',
                    splitLine: true,
                    axisLabel: {
                        show: true,
                        textStyle: { color: '#617085', fontSize: "12px" },
                        formatter: function(data) {
                            return getDoubleStr(data.getHours()) + ":" + getDoubleStr(data.getMinutes());
                        }
                    },
                    axisLine: {
                        show: true,
                        lineStyle: { color: '#AEAEB7', width: 1 }
                    },
                    axisTick: {
                        show: false
                    }
                }
            ],
            yAxis: [
                {
                    name: "",
                    type: 'value',
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: ['#eee']
                        }
                    },
                    axisLabel: {
                        show: true,
                        textStyle: { color: '#617085', fontSize: "12px", width: 2 }
                    },
                    axisLine: {
                        show: false,
                        lineStyle: { color: '#AEAEB7', width: 1 }
                    }
                }
            ],
            animation: false,
            series: aseries
        };
        var oTheme = {
            color: ['#4ec1b2'],
            categoryAxis: {
                splitLine: { lineStyle: { color: ['#FFF'] } }
            }
        };
        $("#userchange").echart("init", option, oTheme);
    }
    function initMonthDay() {
        var Nowtime = (new Date());
        var ClientList = new Array(Nowtime.getDate());
        for (var i = 0; i < Nowtime.getDate(); i++) {
            ClientList[i] = [(new Date(Nowtime.getFullYear(), Nowtime.getMonth(), i + 1, 0, 0, 0)), 0];
        }
        return ClientList;
    }

    function drawWeekCliNum(aInData) {
        var aseries = [];
        var splitNumber;
        if (aInData.length > 8) {
            splitNumber = 9
        }
        else {
            splitNumber = aInData.length - 1;
        }
        var oTemp = {
            type: 'line',
            smooth: true,
            symbol: "none",
            showAllSymbol: true,
            symbolSize: 2,
            itemStyle: { normal: { areaStyle: { type: 'default' }, lineStyle: { width: 0 } } },
            name: "终端数",
            data: aInData
        };
        aseries.push(oTemp);
        var option = {
            width: "100%",
            height: "230px",
            tooltip: {
                show: true,
                trigger: 'item',
                formatter: function(params) {
                    var time = params.value[0].toISOString().split(".")[0].split("T").toString();
                    if (params.value[1] < 0)
                        params.value[1] = -params.value[1];
                    var string = params.seriesName + "<br/>" + time + "<br/>" + params.value[1] + "Mbps"
                    return string;
                },
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: "#94DAD0",//'#373737',
                        width: 0,
                        type: 'solid'
                    }
                }
            },
            legend: {
                orient: "horizontal",
                y: 0,
                x: "center",
                // x: "right",
                // itemWidth: 12,//default 20
                itemWidth: 8,//default 20
                // textStyle: { color: '#617085', fontSize: "12px" },
                textStyle: { color: '#9AD4DC', fontSize: "12px" },
                data: ['终端数']
            },
            grid: {
                x: 30, y: 20, x2: 22, y2: 30,
                borderColor: '#FFF'
            },
            calculable: false,
            xAxis: [
                {
                    splitNumber: splitNumber,
                    type: 'time',
                    splitLine: true,
                    axisLabel: {
                        show: true,
                        textStyle: { color: '#617085', fontSize: "12px" },
                        formatter: function(data) {
                            return (data.getMonth() + 1) + "-" + data.getDate();
                        }
                    },
                    axisLine: {
                        show: true,
                        lineStyle: { color: '#AEAEB7', width: 1 }
                    },
                    axisTick: {
                        show: false
                    }
                }
            ],
            yAxis: [
                {
                    name: "",
                    type: 'value',
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: ['#eee']
                        }
                    },
                    axisLabel: {
                        show: true,
                        textStyle: { color: '#617085', fontSize: "12px", width: 2 }
                    },
                    axisLine: {
                        show: false,
                        lineStyle: { color: '#AEAEB7', width: 1 }
                    }
                }
            ],
            animation: false,
            series: aseries
        };
        var oTheme = {
            color: ['#4ec1b2'],
            categoryAxis: {
                splitLine: { lineStyle: { color: ['#FFF'] } }
            }
        };
        $("#userchange").echart("init", option, oTheme);
    }
    function initClientWeek() {
        var ClientList = new Array(7);
        var Nowtime = (new Date()).getTime();
        for (var i = 0; i < 7; i++) {
            ClientList[i] = [(new Date(Nowtime - ((6 - i) * 86400000))), 0];
        }
        return ClientList;
    }

    function initClientDay() {
        /*将一天分成6段*/
        var ClientList = new Array(6);
        var Nowtime = (new Date()).getTime();
        for (var i = 0; i < ClientList.length; i++) {
            ClientList[i] = [(new Date(Nowtime - ((ClientList.length - i - 1) * 14400000))), 0];
        }
        return ClientList;
    }
    function initForm()
    {
        
        //宾客变化
        var aInData = [[new Date(2016, 2, 14, 12, 23, 34), 10],
            [new Date(2016, 2, 14, 12, 25, 34), 30],
            [new Date(2016, 2, 14, 12, 26, 34), 50],
            [new Date(2016, 2, 14, 12, 28, 34), 20],
            [new Date(2016, 2, 14, 12, 32, 34), 100],
            [new Date(2016, 2, 14, 12, 35, 34), 12],
            [new Date(2016, 2, 14, 12, 37, 12), 47]];
        var adayData = [[new Date(2016, 2, 14, 03, 23, 34), 10],
            [new Date(2016, 2, 14, 05, 32, 34), 100],
            [new Date(2016, 2, 14, 09, 25, 34), 30],
            [new Date(2016, 2, 14, 12, 26, 34), 50],
            [new Date(2016, 2, 14, 14, 28, 34), 20],
            [new Date(2016, 2, 14, 20, 35, 34), 12],
            [new Date(2016, 2, 14, 23, 37, 12), 47]];
        var aweekData = [[new Date(2016, 2, 14, 12, 23, 34), 10],
            [new Date(2016, 2, 14, 12, 25, 34), 30],
            [new Date(2016, 2, 14, 12, 26, 34), 50],
            [new Date(2016, 2, 14, 12, 28, 34), 20],
            [new Date(2016, 2, 14, 12, 35, 34), 12],
            [new Date(2016, 2, 14, 12, 37, 12), 47],
            [new Date(2016, 2, 14, 12, 40, 34), 100]];
        var afuData = [[new Date(2016, 2, 14, 03, 23, 34), -47],
            [new Date(2016, 2, 14, 05, 32, 34), -12],
            [new Date(2016, 2, 14, 09, 25, 34), -20],
            [new Date(2016, 2, 14, 12, 26, 34), -50],
            [new Date(2016, 2, 14, 14, 28, 34), -30],
            [new Date(2016, 2, 14, 20, 35, 34), -100],
            [new Date(2016, 2, 14, 23, 37, 12), -10]];
        /*刷新显示一天的数据*/
        drawDayflow();
        drawdayClientCount();

        $("#days").click(function() {
            /*获取当前时间往前推一天的在线用户数*/
            $("div.station-change a.xx-link").removeClass("active");
            $(this).addClass("active");
            drawdayClientCount();
        });
        $("#weeks").click(function() {
            $("div.station-change a.xx-link").removeClass("active");
            $(this).addClass("active");
            drawWeekClientCount();
        });
        $("#mounth").click(function() {
            $("div.station-change a.xx-link").removeClass("active");
            $(this).addClass("active");
            drawMonthClientCount();
        });



        $("#bySsidList").on('click','a',function(){
            if($(this).html() != 0)
            {
                var aType = ["band_5g","band_2_4g","band_5g","band_2_4g","Wsm","Akm"];
                openDalg(aType[$(this).attr("index")],$(this).attr("href"),"ssid");
            }
            return false;
        });

        $("#byApList").on('click','a',function(){
            if($(this).html() != 0)
            {
                var aType = ["band_5g","band_2_4g","band_5g","band_2_4g","Wsm","Akm"];
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

    function jiaGongclientVendor(row, cell, value, columnDef, oRowData,sType){
         if(value==""){
            return "其它";
         }else{
            return ""+value+"";
        }
    }

    function jiaGong0(row, cell, value, columnDef, oRowData,sType){    
        return ""+value+"";
    }
    function jiaGongclientRadioMode(row, cell, value, columnDef, oRowData,sType){ 
        //1-,2-,4-,8-,16 -,64-
        if(value==1){
            return "802.11b";
        }else if(value==2){
            return "802.11a";
        }else if(value==4){
            return "802.11g";
        }else if(value==8){
            return "802.11gn";
        }else if(value==16){
            return "802.11an";
        }else if(value==64){
            return "802.11ac";
        }else{
            return "BuKeNeng";
        }
        
    }

    function jiaGongonlineTime(row, cell, value, columnDef, oRowData,sType){ 
        
        var argument0=value;

        var hh=parseInt(argument0/3600);
        var mm0=argument0%3600;
        
        var mm=parseInt(mm0/60);
        var ss=mm0%60;

        if(hh<10){
            var printHH="0"+hh;
        }else{
            var printHH=hh;
        }


        if(mm<10){
            var printMM="0"+mm;
        }else{
            var printMM=mm;
        }

        if(ss<10){
            var printSS="0"+ss;
        }else{
            var printSS=ss;
        }

        var sDatatime=printHH+':'+printMM+':'+printSS;
        return sDatatime;
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
                {name: "DeviceName", datatype: "String"},
                {name:'ApName', datatype:"String",width:150,showTip:true},
                {name:'ClientNumber5G', datatype:"String",formatter:showNum},
                {name:'ClientNumber2G', datatype:"String",formatter:showNum}
            ]
        };
        $("#byDevList").SList ("head", optAp);
         $("#byDevList").SList("refresh",[{"DeviceName":"h3c","ApName":"ap1","ClientNumber5G":"15","ClientNumber2G":"15"}]);

        var optPop = {
            colNames: getRcText ("POP_HEADER"),
            pageSize : 10,
            showHeader: true,
            colModel: [
                {name: "clientMAC", datatype: "String"},
                {name: "clientIP", datatype: "String"},
                {name: "clientName", datatype: "String"},
                {name: "clientVendor", datatype: "String",formatter:jiaGongclientVendor},
                {name: "ApName", datatype: "String"},
                {name: "clientSSID", datatype: "String"},
                {name: "signalStrength", datatype: "Integer",formatter:jiaGong0},
                
                {name: "clientTxRate", datatype:"Integer",formatter:jiaGong0},
                {name: "clientRxRate", datatype: "Integer",formatter:jiaGong0},
                {name: "onlineTime", datatype: "String",formatter:jiaGongonlineTime},
                {name: "clientRadioMode", datatype: "String",formatter:jiaGongclientRadioMode},
                {name: "clientMode", datatype: "String"},
                {name: "clientChannel", datatype: "Integer",formatter:jiaGong0},
                {name: "NegoMaxRate", datatype: "Double"}                
            ]
        };
        $("#popList").SList ("head", optPop);
    }

    function _init()
    {
        initUserChange1();
        initGrid();
        initForm();
        initData();
        drawLine();
    };

    function _destroy()
    {
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init, 
        "destroy": _destroy, 
        "widgets": ["SList","Echart"],
        "utils":["Request","Base"]
    });
})( jQuery );

