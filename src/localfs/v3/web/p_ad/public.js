;(function ($) {
    //var MODULE_NAME = "p_ad.public";
    var MODULE_BASE = "p_ad";

    var MODULE_NAME = MODULE_BASE + ".public";

    var g_cycle = "weeks";

    var g_names = $("#branchSelectDiv").find(".select2-chosen").text();

    var g_sStoreId = FrameInfo.Nasid ;//;405
    
    var g_aTodaySpanData = [],
        g_aYesterDaySpanData = [],
        g_dataArr = [];

    function getRcText(sRcName){
        return Utils.Base.getRcString("x_adAnalysisi_rc", sRcName);
    }


    function onClickBar (){

        var all =[
            {
                'mac':'AB-32-CD-EF-DD-EE',
                'ip':'192.168.10.2',
                'firm':'苹果',
                'ap':'ap1',
                'ssid':'12345678'
            }
        ];

        $("#ByPortalPopList").SList("refresh",all);
        Utils.Base.openDlg(null, {}, {scope:$("#ByPortal_diag"),className:"modal-super dashboard"});
    }

    function onClick(){

        var sId = $(this).attr("id").split("_")[1];
        switch(sId){
            case "Map":
                $("#filter_Mapradio").toggle();
                return false;
                break;
            default:
                break;
        }
    }

    // function userCheck(val){
    //     // if(val == 1){
    //     //     alert("111111");
    //     //     var oUrlPara = {
    //     //         np: MODULE_BASE + ".public",
    //     //     };
    //     //     Utils.Base.redirect(oUrlPara);
    //     if(val == 1){
    //         var oUrlPara = {
    //             np: MODULE_BASE + ".public_ap_group",
    //         };
    //         // Utils.Base.redirect(oUrlPara);
    //         $("#ConfigUpport").hide();
    //     }else if(val == 2){
    //         var oUrlPara = {
    //             np: MODULE_BASE + ".public_ap",
    //         };
    //         // 
    //         $("#ConfigUpport").show();
    //     }
    // }

    // function drawAdShowCount(type, adverDate){

    //     var show_data = {};
    //     if (adverDate == "today") {
    //         show_data = g_aTodaySpanData;
    //     }
    //     else if (adverDate == "yesterday") {
    //         show_data = g_aYesterDaySpanData;
    //     }
    //     var data = [];
    //     if (show_data.length == 0) {
    //         data.push(0);
    //     } else {
    //         for (var i = 0; i < show_data.length; i++) {
    //             show_data[i].ctr = show_data[i].pv == 0?0: show_data[i].clickCount/show_data[i].pv;
    //             data.push(show_data[i][type]);
    //         }
    //     }

    //     option = {
    //         width: "100%",
    //         height: "300",
    //         title: false,
    //         tooltip: {
    //             trigger: 'axis',
    //             formatter: function (data) {
    //                 return getRcText(type) + ':'+data[0].value;
    //             }
    //         },
    //         grid: {
    //             show: "false"
    //         },
    //         xAxis: [
    //             {
    //                 type: 'category',
    //                 boundaryGap: false,
    //                 splitLine: {
    //                     show: true,
    //                     textStyle: { color: '#c9c4c5', fontSize: "1px", width: 4 },
    //                     lineStyle: {
    //                         // 使用深浅的间隔色
    //                         color: ['#e7e7e9']
    //                     }
    //                 },
    //                 data: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18'
    //                     , '19', '20', '21', '22', '23']
    //             }
    //         ],
    //         yAxis: [
    //             {
    //                 type: 'value',
    //                 splitLine: {
    //                     show: true,
    //                     textStyle: { color: '#c9c4c5', fontSize: "1px", width: 4 },
    //                     lineStyle: {
    //                         // 使用深浅的间隔色
    //                         color: ['#e7e7e9']
    //                     }
    //                 },
    //                 axisLabel: {
    //                     show: true,
    //                     textStyle: { color: '#9da9b8', fontSize: "12px", width: 2 }
    //                 },
    //                 axisLine: {
    //                     show: true,
    //                     lineStyle: { color: '#9da9b8', width: 1 }
    //                 }
    //             }
    //         ],
    //         series: [{
    //             name: type,
    //             type: 'line',
    //             barCategoryGap: '40%',
    //             data: data,
    //             itemStyle: {
    //                 normal: {
    //                     label: {
    //                         show: true,
    //                         position: 'insideTop',
    //                         formatter: function (data) {
    //                             return data.value;

    //                         }
    //                     },
    //                     color: '#69C4C5'
    //                 }
    //             }

    //         }]
    //     };
    //     var oTheme = {
    //         color: ['#48BEF4', '#FCE1DC']
    //     };
    //     $("#adShowCount").echart("init", option, oTheme);

    // }

    function getPubNumData(){

        function getDataSuc(data){

            var nameArr = [];
            for (var i = 0; i < data.data.length; i++) {
                var nameObj = {};
                nameObj["val"] = i+1;
                nameObj["show"] = data.data[i].name;
                nameArr.push(nameObj);
            };
            initSelect(nameArr);
            $.each(data.data,function (index,item){
                var obj = {};
                obj.name = item.name;
                obj.appId = item.appId;
                g_dataArr.push(obj);
            })
            g_names = nameArr[0].show;

            getPubPageData(g_names,g_cycle);
        }
        function getDataFail(err){
            console.log(err)
        }
        var pubNumOpt = {
                type:"GET",
                url:MyConfig.v2path+"/weixinaccount/query",
                dataType: "json",
                data:{
                    ownerName:FrameInfo.g_user.user,
                    name:"",
                    appId:"",
                    startRowIndex:0,
                    maxItems:100
                },
                onSuccess: getDataSuc,
                onFailed: getDataFail
            };
        
        Utils.Request.sendRequest(pubNumOpt);
    }

    function getPubPageData(names,cycle){

        function GetDateStr(AddDayCount){

            var dd = new Date(); 
            dd.setDate(dd.getDate()+AddDayCount); 
            var y = dd.getFullYear(); 
            var m = (dd.getMonth()+1)<10?"0"+(dd.getMonth()+1):(dd.getMonth()+1);
            var d = dd.getDate()<10?"0"+dd.getDate():dd.getDate(); 
            return y+"-"+m+"-"+d; 
        }

        function getDataSuc(data){

            var dateArr = [],cumulateDataArr = [],newDataArr = [],cancelDataArr = [],dataObj = {},current = 0;
                for (var i = data.weixinStatisticList.length-1; i >= 0; i--) {

                    if(data.weixinStatisticList.length === 12){
                        dateArr.push(data.weixinStatisticList[i].year+"-"+data.weixinStatisticList[i].month);
                        current += data.weixinStatisticList[i].new_user;
                    }else{
                        var str = data.weixinStatisticList[i].ref_date.split("-");
                        str.shift();
                        for (var j = 0; j < str.length; j++) {
                            str[j] = str[j].charAt(0) === "0" ? str[j].substring(1) :str[j]
                        };
                        dateArr.push(str.join("-"));

                        current += data.weixinStatisticList[i].new_user;
                        
                    }
                    cumulateDataArr.push(data.weixinStatisticList[i].cumulate_user);

                    newDataArr.push(data.weixinStatisticList[i].new_user);

                    cancelDataArr.push(data.weixinStatisticList[i].cancel_user);
                };
                $("#Current").text(current);
                $("#totalAp").text(data.weixinStatisticList[0].cumulate_user);
                dataObj["dateArr"] = dateArr;
                dataObj["cancelDataArr"] = cancelDataArr;
                dataObj["cumulateDataArr"] = cumulateDataArr;
                dataObj["newDataArr"] = newDataArr;

                drawPublicNumber(dataObj);
                drawAddView(dataObj);
                drawCancelView(dataObj);
        }

        function getDataFail(err){
            console.log(err);
        }

        var pubFunsOpt = {};

        $.each(g_dataArr,function (index,item){

            if( item.name === names ){

                if( cycle === "weeks" ){

                    pubFunsOpt = {
                        type:"GET",
                        url:MyConfig.v2path+"/weixinStatistic/statisticData",
                        dataType: "json",
                        data:{
                            phase:"d",
                            appId:item.appId,
                            dateFrom:GetDateStr(-8),
                            dateTo:GetDateStr(-2)
                        },
                        onSuccess: getDataSuc,
                        onFailed: getDataFail
                    };
                }else if( cycle === "mounth" ){

                    pubFunsOpt = {
                        type:"GET",
                        url:MyConfig.v2path+"/weixinStatistic/statisticData",
                        dataType: "json",
                        data:{
                            phase:"d",
                            appId:item.appId,
                            dateFrom:GetDateStr(-32),
                            dateTo:GetDateStr(-2)
                        },
                        onSuccess: getDataSuc,
                        onFailed: getDataFail
                    };
                }else if( cycle === "year" ){

                    pubFunsOpt = {
                        type:"GET",
                        url:MyConfig.v2path+"/weixinStatistic/statisticData",
                        dataType: "json",
                        data:{
                            phase:"y",
                            appId:item.appId,
                            year:new Date().getFullYear(),
                            month:new Date().getMonth()+1
                        },
                        onSuccess: getDataSuc,
                        onFailed: getDataFail
                    };
                }
            }
        })

        Utils.Request.sendRequest(pubFunsOpt);
    }

    function drawPublicNumber(dataObj){

        var option = {
            height:200,
            grid:{
                x:80,y:20,x2:80,y2:30,
                borderColor:'rgba(0,0,0,0)'
            },
            tooltip : {
                trigger: 'axis'
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    data : dataObj.dateArr,
                    axisLine: {
                        show: true,
                        lineStyle: { color: '#9da9b8', width: 1 }
                    },
                    splitLine: {
                        show: false
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    name : '关注数',
                    axisLabel : {
                        formatter: '{value}'
                    },
                    axisLine: {
                        show: true,
                        lineStyle: { color: '#9da9b8', width: 1 }
                    },
                    splitLine: {
                        show: false
                    }
                },
                {
                    type : 'value',
                    name : '关注总数',
                    axisLabel : {
                        formatter: '{value}'
                    },
                    axisLine: {
                        show: true,
                        lineStyle: { color: '#9da9b8', width: 1 }
                    },
                    splitLine: {
                        show: false
                    }
                }
            ],
            series : [
                {
                    name:'关注总数',
                    type:'line',
                    yAxisIndex: 0,
                    data:dataObj.cumulateDataArr
                }
            ]
        };
        var oTheme = {
                color: ['#4ec1b2', '#80878c']
            };
        $("#public_number").echart ("init", option,oTheme);                
    }

    function drawAddView(dataObj){

        var option = {
            height:200,
            grid:{
                x:40,y:20,x2:40,y2:30,
                borderColor:'rgba(0,0,0,0)'
            },
            tooltip : {
                trigger: 'axis'
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    data : dataObj.dateArr,
                    axisLine: {
                        show: true,
                        lineStyle: { color: '#9da9b8', width: 1 }
                    },
                    splitLine: {
                        show: false
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    name : '新增关注人数',
                    axisLabel : {
                        formatter: '{value}'
                    },
                    axisLine: {
                        show: true,
                        lineStyle: { color: '#9da9b8', width: 1 }
                    },
                    splitLine: {
                        show: false
                    }
                },
                {
                    type : 'value',
                    name : '关注总数',
                    axisLabel : {
                        formatter: '{value}'
                    },
                    axisLine: {
                        show: true,
                        lineStyle: { color: '#9da9b8', width: 1 }
                    },
                    splitLine: {
                        show: false
                    }
                }
            ],
            series : [

                {
                    name:'关注数',
                    type:'bar',
                    barWidth:12,
                    barCategoryGap: '40%',
                    data:dataObj.newDataArr
                },
                //{
                //    name:'关注总数',
                //    type:'line',
                //    yAxisIndex: 0,
                //    data:[200, 500, 830, 1210, 1610, 2060, 2550, 3050, 3650, 4240,5040, 5920]
                //}
            ],
            click: onClickBar
        };
        var oTheme = {
            color: ['#4ec1b2', '#80878c']
        };
        $("#public_count").echart ("init", option,oTheme);
        $("#public_list").echart ("init", option,oTheme);
    }

    function drawCancelView(dataObj){

        var option = {
            height:200,
            grid:{
                x:40,y:20,x2:40,y2:30,
                borderColor:'rgba(0,0,0,0)'
            },
            tooltip : {
                trigger: 'axis'
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    data : dataObj.dateArr,
                    axisLine: {
                        show: true,
                        lineStyle: { color: '#9da9b8', width: 1 }
                    },
                    splitLine: {
                        show: false
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    name : '取消关注人数',
                    axisLabel : {
                        formatter: '{value}'
                    },
                    axisLine: {
                        show: true,
                        lineStyle: { color: '#9da9b8', width: 1 }
                    },
                    splitLine: {
                        show: false
                    }
                },
                {
                    type : 'value',
                    name : '关注总数',
                    axisLabel : {
                        formatter: '{value}'
                    },
                    axisLine: {
                        show: true,
                        lineStyle: { color: '#9da9b8', width: 1 }
                    },
                    splitLine: {
                        show: false
                    }
                }
            ],
            series : [

                {
                    name:'关注数',
                    type:'bar',
                    barWidth:12,
                    barCategoryGap: '40%',
                    data:dataObj.cancelDataArr
                },
                //{
                //    name:'关注总数',
                //    type:'line',
                //    yAxisIndex: 0,
                //    data:[200, 500, 830, 1210, 1610, 2060, 2550, 3050, 3650, 4240,5040, 5920]
                //}
            ],
            click: onClickBar
        };
        var oTheme = {
            color: ['#e7e7e9', '#80878c']
        };
        $("#public_list").echart ("init", option,oTheme);
    }

    function drawDetailList() {

        var opt = {
            showHeader: true,
            multiSelect: false,
            pageSize:6,
            colNames: getRcText("DETAIL_ITEM"),
            colModel: [
                { name: "chatname", datatype: "String", width: 120 },
                { name: "sex", datatype: "String", width: 120 },
                { name: "area", datatype: "String", width: 200 },
                { name: "attentiontime", datatype: "String", width: 200 }
            ]
        };
        $("#detail_slist").SList("head", opt);
    }

    function initData() {
             
        getPubNumData();//获取公众号
    }

    function initSelect(dataProcessed){

        $("#branchSelect").singleSelect("InitData", dataProcessed, {displayField:"show", "valueField":"val",allowClear:false});
    }

    function initForm() {
        
        $("#weeks,#mounth,#year").bind("click",function (){

            $("#weeks,#mounth,#year").removeClass('active');

            $(this).addClass('active');

            g_cycle = $(this).get(0).id;

            getPubPageData(g_names , g_cycle);

        });

        $("#branchSelect").on("change", function(){

            g_names = $("#branchSelectDiv").find(".select2-chosen").text();

            getPubPageData(g_names,g_cycle);

        });
        //点击空白处隐藏右上角filter框
        //
        // $(document).on("mousedown", function(e){
        //     var e = e || window.event;
        //     var elem = e.target || e.srcElement;
        //     while(elem)
        //     {
        //         if(elem.id == "filter_Mapradio")
        //         {
        //             return;
        //         }
        //         elem = elem.parentNode;
        //     }
        //     $("#filter_Mapradio").hide();
        // });
        // $("#MapSelect").change(function(){
        //     var filternone = false;
        //     chnlColorClear();
        //     rrmMapChg(filternone);
        // });
        // $("#RadioSelect").change(function(){
        //     var filternone = false;
        //     chnlColorClear();
        //     rrmDataChg(ApInfo,ScaleInfo,MapSize, filternone);
        // });
        var optPortalPop ={
            colNames:getRcText ("PORTAL_TERMINAL"),
            showHeader:true,
            colModel: [
                {name:"mac",datatype:"String"},
                {name:"ip",datatype:"String"},
                {name:"firm",datatype:"String"},
                {name:"ap",datatype:"String"},
                {name:"ssid",datatype:"String"}
            ]
        };
        $("#ByPortalPopList").SList ("head",optPortalPop);

         $("#daterange", "#tabContent").on("inputchange.datarange", function(e){
            // forbiddenClick();
            var orange = $(this).daterange("getRangeData");
            var startTime = new Date(orange.startData) - 0;
            var endTime = new Date(orange.endData) - 0;
            var today = new Date() - 0;

            g_preStatus = '4';
            ostatistics.data.Param.StartTime = startTime ;
            if(endTime > today)
            {
                ostatistics.data.Param.EndTime = today ;
            }
            else
            {
                ostatistics.data.Param.EndTime = (endTime + 24 * 60 * 60 * 1000);
            }
            // $("#cycle_date").text("（" + orange.startData + "-" + orange.endData + "）");
            // DealChoice(g_preStatus);
        });


    }



    function initGrid() {

        
       
        drawDetailList();
    }

    function _init() {

        initData();
        initGrid();
        initForm();
    }
    function _resize(jParent) {
    }

    function _destroy() {
        g_aTodaySpanData = [],
        g_aYesterDaySpanData = [];
    }
    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["Echart", "Minput","SList","DateTime","DateRange","SingleSelect"],
        "utils": ["Base", "Device","Request"]

    });

})(jQuery);