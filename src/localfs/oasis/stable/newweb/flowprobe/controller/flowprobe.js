define(['utils','jquery','echarts','bootstrap-daterangepicker','angular-ui-router','css!bootstrap_daterangepicker_css'], function (Utils,$scope,echarts) {
    return ['$scope', '$http', '$alertService', '$state', function ($scope, $http,FRAME) {
        var g_daterange = "";
        var g_nEndTime = 0;
        var g_nStartTime = 0;
        var g_strStartDate = "";
        var g_strEndDate = "";
        var g_timeout = 0;
        var g_preStatus = 0;
        var g_strMethod = "";
        var con_devSN = $scope.sceneInfo.sn;
        var con_Time = ["aDay", "aWeek", "aMonth", "aYear", "otherTime"];
        //日历汉化
        var oDaterangeCN = {
            locale : {  
            applyLabel : getRcString("APPLY"),
            cancelLabel: getRcString("CANCEL"),
            daysOfWeek : getRcString("WEEK").split(','),  
            monthNames : getRcString("MONTH").split(","),
        }};

        $scope.strToday = new Date().getDate();
        $scope.show_cycle = false;
        $scope.show_other = false;
        // $scope.selectTime = "（今天）";
        $scope.totalNum = 0;
        $scope.activeNum = 0;
        $scope.in_activeNum = 0;
        $scope.associatedNum = 0;
        $scope.in_associatedNum = 0;
        

        $scope.showSelectTime = function() {
            $scope.show_cycle = !$scope.show_cycle;
        }

        $scope.showOtherTime = function(strTime) {
            // g_strTime = strTime;
            $scope.show_other = true;
        }

        $scope.hideOtherTime = function() {
            $scope.show_other = false;
        }

        $scope.helpDoc={
            options:{
                 mId:'helpDoc',
                 title:getRcString("HELP"),                        
                 autoClose: true,  
                 showCancel: false,  
                 showFooter:false,   
                 buttonAlign: "center", 
                 modalSize:'lg',                 
                 okHandler: function(modal,$ele){                                                                                                                  
                 },
                 cancelHandler: function(modal,$ele){
                 },
                 beforeRender: function($ele){
                     return $ele;
                 }
            }
        }

        $scope.openHelpDoc = function() {
            $scope.$broadcast('show#helpDoc',$scope);
        }
        $scope.closeHelpDoc = function() {
            $scope.$broadcast('hide#helpDoc',$scope);
        }

        function getRcString(attrName){
            return Utils.getRcString("probe_rc",attrName);
        }

        //只有g_daterange改变时才刷新页面  apply事件是为了第一次点击时的刷新页面
        $('#daterange').daterangepicker(oDaterangeCN, function(start, end, label) {
            g_strStartDate = start.format('YYYY/MM/DD');
            g_strEndDate = end.format('YYYY/MM/DD');
            g_daterange = g_strStartDate + ' - ' + g_strEndDate;

            $scope.selectTime = '（' + g_daterange + '）';
            $scope.initViewsByTime("otherTime");
        }).on('apply.daterangepicker', function(e, date) {
            g_strStartDate = date.startDate.format('YYYY/MM/DD')
            g_strEndDate = date.endDate.format('YYYY/MM/DD');
            var strDaterange = g_strStartDate + ' - ' + g_strEndDate;
            //选择相同日期 不刷新页面
            if(strDaterange == g_daterange) {
                return;
            }
            g_daterange = strDaterange;
            $scope.selectTime = '（' + g_daterange + '）';
            $scope.initViewsByTime("otherTime");
        });
        
        function getOtherRangeTime() {
            var nStartYear  = Number(g_strStartDate.slice(0, 4));
            var nStartMonth = Number(g_strStartDate.slice(5, 7)) - 1;
            var nStartDay   = Number(g_strStartDate.slice(8));
            var nEndYear  = Number(g_strEndDate.slice(0, 4));
            var nEndMonth = Number(g_strEndDate.slice(5, 7)) - 1;
            var nEndDay   = Number(g_strEndDate.slice(8));
            var nDayTime  = 24 * 60 * 60;

            g_nStartTime = parseInt((new Date(nStartYear, nStartMonth, nStartDay)).getTime());
            g_nEndTime   = parseInt((new Date(nEndYear, nEndMonth, nEndDay)).getTime() + nDayTime * 1000);
        }
        // 获得开始时间和结束时间
        function getRangeTime(strTime) {
            var nHourTime = 60 * 60 * 1000;
            var nDayTime = 24 * nHourTime;
            var nWeekTime = 7 * nDayTime;
            var nMonthTime = 30 * nDayTime;
            var nYearTime = 365 * nDayTime;
            var strCurrentDate = new Date().toLocaleDateString();
            var nTodayZeroTime = new Date(strCurrentDate).getTime() - 0;

            g_nEndTime = nTodayZeroTime;

            switch(strTime) {
                case con_Time[0]: {
                    g_nStartTime = nTodayZeroTime;
                    g_nEndTime = new Date() - 0;
                    break;
                }
                case con_Time[1]: {
                    g_nStartTime = nTodayZeroTime - nWeekTime;
                    break;
                }
                case con_Time[2]: {
                    g_nStartTime = nTodayZeroTime - nMonthTime;
                    break;
                }
                case con_Time[3]: {
                    g_nStartTime = nTodayZeroTime - nYearTime;
                    break;
                }
                case con_Time[4]: {
                    getOtherRangeTime();
                    break;
                }
                default: {
                    console.log("Select time range error");
                    break;
                }
            }
        }

        function drawPercentChart(strId, nval, sName, sColor) {
            var oInfoPie = echarts.init(document.getElementById(strId));
            var labelTop = {
                normal:{
                    label:{
                        show:true,
                        position:'center',
                        formatter:'{b}',
                        textStyle:{
                            baseline:'top'
                        },
                    },
                    labelLine:{
                        show:false
                    }
                }
            };
            var labelFromatter = {
                normal: {
                    label: {
                        formatter:nval + '%',
                        textStyle: {
                            baseline: 'bottom'
                        }
                    }
                }
            };
            var labelBottom = {
                normal: {
                    color:'#ccc',

                    label: {
                        show:true,
                        position:'center',

                    },
                    labelLine:{
                        show:false
                    },

                },
                emphasis:{
                    color:'rgba(0,0,0,0)'
                }
            };
            var choice = [labelTop,labelBottom]
            var aname= [
                {name:sName, value:nval, itemStyle:labelTop},
                {name:"other", value:100-nval, itemStyle:labelBottom}

            ];

            var radius = ['55%','70%'];
            var option = {
                calculable : false,
                // height:238,
                series : [
                    {
                        type: 'pie',
                        radius : radius,
                        center: ['50%', '50%'],
                        itemStyle:labelFromatter,
                        data: aname
                    }
                ],
                color:["#19A0DA"]
            };

            oInfoPie.setOption(option);
        }

        function drawClientTime(aData) {
            var aData = aData ;
            var aType = getRcString("CLIENTTIME").split(",");
            var aTimeData = [
                    {name:aType[0], value:aData.time1},
                    {name:aType[1], value:aData.time2},
                    {name:aType[2], value:aData.time3},
                    {name:aType[3], value:aData.time4},
                    {name:aType[4], value:aData.time5}
                ];
            aTimeData = $.grep(aTimeData,function(oTemp, i){
                return Boolean(oTemp.value);
            });

            if(!aTimeData.length) {
                var option = {
                    calculable : false,
                    height:280,
                    tooltip : {
                        show:false
                    },
                    series : [
                        {
                            type: 'pie',
                            radius : 75,
                            center: ['55%', '55%'],
                            itemStyle: {
                                normal: {
                                    labelLine:{
                                        show:false
                                    },
                                    label:
                                    {
                                        show:false
                                    }
                                },
                                emphasis: {
                                    color:"#EDF9F7"
                                }
                            },
                            data: [{name:"",value:1}]
                        }
                    ],
                    color: ['#EDF9F7']
                };
            }
            else {
                var labelFromatter = {
                   normal : {
                        label : { 
                            textStyle: {
                              color:"black"
                            }
                        }
                    }
                };
                $.each(aTimeData, function(i, oTemp){
                    $.extend(oTemp,{itemStyle:labelFromatter});
                });
                var option = {
                    calculable : false,
                    tooltip : {
                        show:true,
                       // trigger: 'item',
                       formatter: "{b}:<br/> {c} ({d}%)"
                    },
                    series : [
                        {
                            type: 'pie',
                            radius : 75,
                            center: ['55%', '55%'],
                            data: aTimeData
                        }
                    ],
                    color: ['#0096d6','#31A9DC','#62BCE2','#93D0EA','#C4E3F0']
                };
            }

            var oInfoPie = echarts.init(document.getElementById("Rssi_Pie"));
            oInfoPie.setOption(option);
        }
        //中间点距离上边高度， 行高， 数量， 最小上边距
        function topChange(top, lineHeight,sum, mixTop) {
            if(mixTop != undefined) {
                if(top - sum * lineHeight / 2 < mixTop) {
                    return mixTop;
                }
            }
            return parseInt(top - sum * lineHeight / 2);
        }

        function setPieLegend(aData, aColor, strId) {
            var strHtml = "";
            var sum = 0;
            var startDiv = "<div class='leg-row'>"
            var endDiv = "</div>"
            var oTmp = $("#" + strId);
            
            if(!aData.length) {
                oTmp.html(strHtml);
                return;
            }

            for(var i = 0; i < aData.length; i++) {
                aData[i].value = Number(aData[i].value);
                sum += aData[i].value;
            }

            for(var i = 0; i < aData.length; i++) {
                strHtml += startDiv +  "<span class='leg-icon' style=" + "'"+ "background:" + aColor[i] + "'" + ">" + "</span>";
                strHtml += "<span class='leg-title' title=" + "'" + aData[i].name + "'" + ">" + aData[i].name + "</span>";
                strHtml += "<span class='leg-percent'>" + (aData[i].value / sum * 100).toFixed(0) + "%" + "</span>" + endDiv; 
            }

            oTmp.css("top", topChange(170, 31, aData.length, 50));
            oTmp.html(strHtml);
        }

        function drawSsid(aType) {
            function compare(oArrayDataa, oArrayDatab) {
                return oArrayDatab.value - oArrayDataa.value;
            }
            var aData=[];
            var nSum = 0;
            var aColor = 0;
            var b_toopTip = false;

            aType.forEach(function(i) {
                var oTmp = {};
                oTmp.name =i.Ssid;
                oTmp.value = i.Sum;
                if(!oTmp.name) {
                    oTmp.name = "Unknown";
                }
                else {
                    aData.push(oTmp);
                    nSum +=  i.Sum;
                }
            });
            aData.sort(compare);
            aData = aData.slice(0,6);
            var oOthers = {name:"Others", value:nSum};
            for(var i = 0; i < aData.length; i++) {
                oOthers.value-=aData[i].value;
            }
            if(oOthers.value) {
                aData.push(oOthers);
            }

            if(!aData.length) {
                aData.push({name:'', value:1});
                aColor = ['#ccc'];
                setPieLegend([], aColor, "probe_Ssid");
            }
            else {
                aColor = ['#53B9E7','#31ADB4','#69C4C5','#FFBB33','#FF8800','#CC324B','#E64C65','#D7DDE4'];
                b_toopTip = true;
                setPieLegend(aData, aColor, "probe_Ssid");
            }

            var option = {
                height:280,
                tooltip : {
                    show: b_toopTip,
                    trigger: 'item',
                    formatter: "{b}<br/> {c} ({d}%)"
                },
                calculable : false,
                series : [
                    {
                        name:'anaylsis',
                        type:'pie',
                        radius : ['30%', '55%'],
                        center: ['20%', '50%'],
                        itemStyle : {
                            normal : {
                                label : {
                                    position : 'inner',
                                    formatter : function (a,b,c,d) {
                                        return ""
                                    }
                                },
                                labelLine : {
                                    show : false
                                }
                            },
                            emphasis : {
                                label : {
                                    formatter : "{b}\n{d}%"
                                }
                            }
                        },
                        data:aData
                    }
                ],
                color: aColor
            };

            var oInfoPie = echarts.init(document.getElementById("probe_Ssid_pie"));
            oInfoPie.setOption(option);
        }

        function drawVender(aData){
            function compare(oArrayDataa, oArrayDatab){
                return oArrayDatab.value - oArrayDataa.value;
            }
            var aVender = [];
            var bTemp = false;
            // var oPhoneVenderList = $.MyLocale.PhoneVender;
            var labelFromatter = {
                normal : {
                    label : { 
                        textStyle: {
                          color:"black"
                        }
                    }
                }
            };
            var nSum0ther = 0;
            var specailUnkonwn = 0;
            aData.forEach(function(i) {
                if( i.Vendor.toLowerCase() == "unknown") {
                    specailUnkonwn = {name:getRcString("RC-UNKNOWN"),value: i.Sum, itemStyle:labelFromatter};
                }
                else {
                    aVender.push({name:i.Vendor,value: i.Sum, itemStyle:labelFromatter});
                }
                nSum0ther+=i.Sum;
            });

            var oOthters = {name:getRcString("RC-OTHERS"),value:nSum0ther, itemStyle:labelFromatter};

            aVender.sort(compare);
            var oColor = ['#0195D7','#53B9E7', '#31ADB4', '#69C4C5','#92C888', '#FFBB33','#FF8800','#CC324B','#91B2D2','#D7DDE4'];

            if(aVender.length > 9) {
                aVender = aVender.slice(0, 9);

                for(var nCounter = 0; nCounter < 9; nCounter++) {
                    if(aVender[nCounter].name == "unknown") {
                        specailUnkonwn = 0;
                    }
                    oOthters.value -= aVender[nCounter].value;
                }
                if(specailUnkonwn) {
                    oOthters.value -= specailUnkonwn.value;
                    var tmmp = aVender.pop();
                    oOthters.value += tmmp.value;
                    aVender.push(specailUnkonwn);
                    if(oOthters.value > 0){
                        aVender.push(oOthters);
                    }
                }
            }
            else {
                var lastcolor = oColor.pop();
                if(specailUnkonwn) {
                    oColor = oColor.slice(0,aVender.length);
                    aVender.push(specailUnkonwn);
                    oColor.push(lastcolor);
                }
            }

            if(!aData.length) {
                var option = {
                    calculable : false,
                    tooltip : {
                        show:false
                    },
                    series : [
                        {
                            type: 'pie',
                            radius : 75,
                            center: ['55%', '55%'],
                            itemStyle: {
                                normal: {
                                    labelLine:{
                                        show:false
                                    },
                                    label:
                                    {
                                        show:false
                                    }
                                }
                            },
                            emphasis: {
                                color: "#EDF9F7"
                            },
                            data: [{name:"",value:1}]
                        }
                    ],
                    color: ['#EDF9F7']
                };
            }
            else {
              var option = {
                    calculable : false ,
                    tooltip : {
                        show:true,
                        formatter: "{b}:<br/> {c} ({d}%)"
                    },
                    series : [
                        {
                            minAngle:5,
                            type: 'pie',
                            radius : 75,
                            center: ['55%', '55%'],
                            itemStyle: {
                                normal: {
                                    labelLine: {
                                        show: true,
                                        length: 15,
                                    }
                                }
                            },
                            data: aVender
                        }
                    ],
                    color: oColor
                };
            }

            var oInfoPie = echarts.init(document.getElementById("Vender_pie"));
            oInfoPie.setOption(option);
        }

        function drawAssoc(aStatics) {
            var sName = getRcString("NAME").split(",")[0];
            var nDisassocNum = 0;
            var nAssocNum = 0;
            var nSum = 0;
            var nPercent = 0;

            if(!aStatics.length) {
                drawPercentChart("Assco_client", Math.round(0), sName, "#19A0DA");
                $scope.totalNum = 0;
                $scope.associatedNum = 0;
                $scope.in_associatedNum = 0;

                return false;
            }

            aStatics.forEach(function(i) {
                if(i.DissociativeStatus == true) {
                    nDisassocNum = i.Sum;
                }
                if(i.DissociativeStatus == false) {
                    nAssocNum = i.Sum;
                }
            });

            nSum = nAssocNum + nDisassocNum;
            nPercent = nAssocNum / nSum || 0;

            $scope.totalNum = nSum;
            $scope.associatedNum = nAssocNum;
            $scope.in_associatedNum = nDisassocNum; 
            // $scope.$apply(function() {});
            
            drawPercentChart("Assco_client", Math.round(nPercent*100.00), sName, "#19A0DA")
        }

        function dealData(data) {
            var oVendor = {};
            var aVendor = [];
            var oAssoc = {};
            var aAssoc = [];
            var oDuration = {};
            var aDuration = [];
            var aClientCount = [];
            var oSsid = {};
            var aSsid = [];
            var nCount = 0;

            for(var i = 0; i < data.length; i++) {
                var vendorTmp = data[i].Vendor || [];
                //vendor
                for(var j = 0; j < vendorTmp.length; j++) {
                    oVendor[vendorTmp[j].Vendor] ? (oVendor[vendorTmp[j].Vendor] += vendorTmp[j].Count) : (oVendor[vendorTmp[j].Vendor] = vendorTmp[j].Count);
                }
                //assoc

                if(data[i].hasOwnProperty("DisAssoc") && data[i].hasOwnProperty("Count")) {
                    oAssoc['disassociation'] ? (oAssoc['disassociation'] += data[i].DisAssoc) : (oAssoc['disassociation'] = data[i].DisAssoc);
                    oAssoc['association'] ? (oAssoc['association'] += (data[i].Count - data[i].DisAssoc) ) : (oAssoc['association'] = (data[i].Count - data[i].DisAssoc));
                }

                //Duration
                var aDuration = data[i].Duration || [];
                for(var n = 0; n < aDuration.length; n++) {
                    var temp = n + 1;
                    var tempName = "time" + temp;
                    oDuration[tempName] ? (oDuration[tempName] += data[i].Duration[n]) : (oDuration[tempName] = data[i].Duration[n]);
                }
                //Rssi
                var tmpCount = {};

                tmpCount.value = data[i].Count;
                tmpCount.name = data[i].Date;
                aClientCount.push(tmpCount);

                //Ssid
                var tempSsid = data[i].Ssid || [];
                for(var s = 0; s < tempSsid.length; s++) {
                    if(!tempSsid[s].Ssid)
                    {
                        continue;
                    }

                    oSsid[tempSsid[s].Ssid] ? (oSsid[tempSsid[s].Ssid] += tempSsid[s].Count) : (oSsid[tempSsid[s].Ssid] = tempSsid[s].Count);
                }
            }

            for(var q in oVendor) {
                var temp = {Vendor:q, Sum:oVendor[q]};
                aVendor.push(temp);
            }

            for(var q in oAssoc) {
                if(q == 'disassociation') {
                    aAssoc.push({DissociativeStatus:true, Sum:oAssoc[q]});
                }
                else {
                    aAssoc.push({DissociativeStatus:false, Sum:oAssoc[q]});
                }
            }

            for(var q in oSsid) {
                var temp = {Ssid:q, Sum:oSsid[q]};
                aSsid.push(temp);
            }
            
            drawAssoc(aAssoc);
            drawClientTime(oDuration);
            drawVender(aVendor);
            drawSsid(aSsid);
            if(g_nEndTime - g_nStartTime > 24 * 60 * 60 * 1000) { 
                if(aAssoc[0] && aAssoc[1] && aAssoc[0].Sum && aAssoc[1].Sum) {
                    nCount = aAssoc[0].Sum + aAssoc[1].Sum;
                }
                drawActive([{Status:true, Count:0},{Status:true, Count:nCount}]);
                drawLine(aClientCount);
            }
        }

        var assoc_clientUrl = Utils.getUrl('POST', '', '/ant/read_probeclient', '/init/log/assoc_client.json');

        function httpAssociatedClient() {
            g_strMethod = "GetAllData";
            if(g_nEndTime - g_nStartTime > 24 * 60 * 60 * 1000) {
                g_strMethod = "DaysInfo";
            }

            $http({
                url: assoc_clientUrl.url, 
                method: assoc_clientUrl.method,
                data:{
                    Method: g_strMethod,
                    Param:{
                        ACSN: con_devSN,
                        StartTime: g_nStartTime,
                        EndTime: g_nEndTime,
                    },
                    Return:[]
                }
            }).success(function(data,header,config,status) {
                var adata = data.Message || [];

                if(!adata.length) {
                    adata = [adata];
                }

                dealData(adata);
            }).error(function(data,header,config,status) {
                console.log("Show attack information list error!");
            });
        }

        function drawActive(aStatics) {
            var sName = getRcString("NAME").split(",")[1];
            var aStatics = aStatics || [];
            var nactive = 0;
            var ninactive = 0;
            var ntotal = 0;
            var nPercent = 0

            if(!aStatics.length) {
                drawPercentChart("Active_pie", Math.round(0), sName, "#19A0DA");
                $scope.activeNum = 0;
                $scope.in_activeNum = 0;
                return false;
            }
            aStatics.forEach(function(i) {
                if(i.Status != true) {
                    nactive = i.Count;
                }
                else {
                    ninactive = i.Count;
                }
            })

            ntotal = nactive + ninactive;
            nPercent = nactive / ntotal || 0;

            $scope.activeNum = nactive;
            $scope.in_activeNum = ninactive;

            drawPercentChart("Active_pie", Math.round(nPercent * 100.00), sName, "#19A0DA");
        }

        function httpActiveInfo() {
            g_strMethod = "StatusClassify";
    
            $http({
                url: assoc_clientUrl.url, 
                method: assoc_clientUrl.method,
                data:{
                    Method: g_strMethod,
                    Param:{
                        ACSN: con_devSN,
                        StartTime: g_nStartTime,
                        EndTime: g_nEndTime,
                    },
                    Return:[]
                }
            }).success(function(data,header,config,status) {
                var adata = data.Message || [];
                drawActive(adata);
            }).error(function(data,header,config,status) {
                console.log("Show attack information list error!");
            });
        }

        function drawLine(aData) {
            aData.sort(function(a,b){
                return a.name - b.name;
            });
            var xData = [];
            var yData = [];
            var data = [];
            var aType = getRcString("TYPE");

            if(aData[0].name) {
                if(g_nEndTime - g_nStartTime <= 60 * 24 * 60 * 1000) {
                    for(var i = 0; i < aData.length; i++) {
                        var tmpName = new Date(aData[i].name)
                        xData.push(tmpName.toTimeString().slice(0,5));
                        yData.push(aData[i].value);
                        data.push([tmpName, aData[i].value]);
                    }
                }
                else {
                    for(var i = 0; i < aData.length; i++) {
                        var tmpName = new Date(aData[i].name)
                        xData.push(tmpName.toLocaleDateString());
                        yData.push(aData[i].value);
                        data.push([tmpName, aData[i].value]);
                    }
                }
            }

            var option = {
                grid: {
                    x: 50, y: 30, x2: 35, y2: 30,
                    borderColor: '#FFF'
                },
                xAxis : [
                    {
                        type: 'category',
                        splitNumber:10,
                        name: getRcString("AXIS").split(',')[1],
                        nameTextStyle: {color:"gray"},
                        splitLine:false,
                        boundaryGap : false,
                        axisLabel: {
                            interval:"auto",
                            rotate:0
                        },
                        axisLine  : {
                            show:true,
                            lineStyle :{color: '#F6F7F8', width: 1}
                        },
                        data:xData
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        name:getRcString("AXIS").split(',')[0],
                        nameTextStyle:{color:"gray"},
                        splitLine:{
                            show:true,
                            lineStyle :{color: '#F6F7F8', width: 1}
                        },
                        axisLabel: {
                            show: true,
                            textStyle:{color: '#373737'}
                        },
                        axisLine  : {
                            show:true,
                            lineStyle :{color: '#E5E8E8', width: 1}
                        }
                    }
                ],
                series : [
                    {
                        type:"line",
                        itemStyle: {
                            normal: {
                                areaStyle: {
                                    color:"rgba(0,150,214,0.2)",
                                    type: 'default'
                                },
                                lineStyle:{
                                    width:1
                                }
                            }
                        },
                        smooth:true,
                        symbol:'circle',
                        symbolSize:0,
                        name:aType,
                        data: yData
                    }
                ],
                color: ["#46b3e1"]
            };

            if(!data.length) {
                option = {
                    height:300,
                    grid: {
                        x: 40, y: 50, x2:35, y2:30,
                        borderColor: '#FFF'
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data : [''],
                            splitLine:false,
                            boundaryGap : false,
                            axisLabel: {
                                interval:"auto",
                                rotate:0
                            },
                            axisLine  : {
                                show:true,
                                lineStyle :{color: '#F6F7F8', width: 1}
                            }
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            splitLine:{
                                show:true,
                                lineStyle :{color: '#F6F7F8', width: 1}
                            },
                            axisLabel: {
                                show: true,
                                textStyle:{color: '#373737'}
                            },
                            axisLine  : {
                                show:true,
                                lineStyle :{color: '#E5E8E8', width: 1}
                            }
                        }
                    ],
                    series : [
                        {
                            name:'',
                            type:'line',
                            smooth:true,
                            symbol:'circle',
                            symbolSize:0,
                            data:[0]
                        }
                    ],
                    color: ["rgba(0,150,214,1)","rgba(0,150,214,0.8)","rgba(0,150,214,0.6)","rgba(0,150,214,0.3)"],
                };
            }
            if(data.length && g_nEndTime - g_nStartTime >= 20 * 60 * 24 * 60 * 1000) {
                option.grid.y2 = 60;
                option.dataZoom = { show: true,start :0};
            }

            var oInfoPie = echarts.init(document.getElementById("probe_line"));
            oInfoPie.setOption(option);
        }

        function httpProbeLineInfo() {
            g_strMethod = "TimeClassify";
    
            $http({
                url: assoc_clientUrl.url, 
                method: assoc_clientUrl.method,
                data:{
                    Method: g_strMethod,
                    Param:{
                        ACSN: con_devSN,
                        StartTime: g_nStartTime,
                        EndTime: g_nEndTime,
                    },
                    Return:[]
                }
            }).success(function(data,header,config,status) {
                var adata = data.Message || [];
                drawLine(adata);
            }).error(function(data,header,config,status) {
                console.log("Show probe chart line information list error!");
            });
        }

        $scope.initViewsByTime = function(strTime) {
            var aTime = getRcString("CYCLE-TIME").split(",");

            if("otherTime" != strTime) {
                $scope.hideOtherTime();
                g_daterange = "";
            }

            switch(strTime) {
                case "aDay": {
                    $scope.selectTime = aTime[0];
                    break;
                }
                case "aWeek": {
                    $scope.selectTime = aTime[1];
                    break;
                }
                case "aMonth": {
                    $scope.selectTime = aTime[2];
                    break;
                }
                case "aYear": {
                    $scope.selectTime = aTime[3];
                    break;
                }
                case "otherTime": {
                    break;
                }
                default: {
                    break;
                }
            }

            getRangeTime(strTime);
            httpAssociatedClient();

            //折线图也是如此标准
            if(g_nEndTime - g_nStartTime <= 24 * 60 * 60 * 1000) {
                httpActiveInfo();
                httpProbeLineInfo();
            }
        };

        $scope.initViewsByTime("aDay");
    }];
});