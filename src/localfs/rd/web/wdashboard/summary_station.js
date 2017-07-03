;(function ($) {
    var MODULE_NAME = "wdashboard.summary_station";
   

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


    /*获取基于手机厂商柱状图数据*/
    function initdrawByod() {

        var xlist = new Array();
        var ylist = new Array();
        var y = 0;
        $.ajax({
            url:MyConfig.path+"/stamonitor/statistic_bybyod",
            type: "GET",
            dataType: "json",
            success: function(data){

                var statistics = data.statistics || [];
                //数据按照count降序排序
                if( statistics.length > 1) {
                    statistics.sort(compare("count"));
                }

                for(var i = 0; i < statistics.length ; i++)
                {
                    if( statistics[i].clientVendor == ""){
                        continue;
                    }
                    xlist.push(statistics[i].clientVendor);
                    ylist.push(statistics[i].count);
                    ++y;
                    if( y == 16 ){
                        break;
                    }
                }

                //画图
                drawByod(xlist,ylist);
            },
            error: function(){

            }
        });
    }

    function compare(prob){
        return function(obj1,obj2){
            var val1 = obj1[prob];
            var val2 = obj2[prob];
            if( val1 < val2){
                return 1;
            }
            else if( val1 > val2){
                return -1;
            }
            else{
                return 0;
            }
        }
    }

    /*基于手机厂商柱状图*/
    function drawByod(xlist,ylist)
    {
    	function getOnByodList (ArrayT) 
        {
            var atemp = [];
                $.each(ArrayT,function(index,iArray){
                    atemp.push(
                            {
                                "acSN":iArray.acSN,
                                "ApName":iArray.ApName,
                                "clientMAC":iArray.clientMAC,
                                "clientIP":iArray.clientIP+'',
                                "clientVendor":iArray.clientVendor == "" ? "其它" : iArray.clientVendor
                            }
                        );
                });

                return atemp;
        }

        function onClickOnlinePie (oPiece) 
        {
            $.ajax({
                url:MyConfig.path+"/stamonitor/statistic_bybyod_detail",
                type: "GET",
                dataType: "json",
                data:{
                    clientVendor:oPiece.name == "其它" ? "" :oPiece.name,
                    skipnum:0,
                    limitnum:100000
                },
                success: function(data){
                    var all = getOnByodList(data.clientList);

                    $("#popList").SList("refresh",all);
                    Utils.Base.openDlg(null, {}, {scope:$("#client_diag"),className:"modal-super dashboard"});
                    $("#popList").SList("resize");
                    return false;
                },
                error: function(){
                   
                }
            });
        }

        //柱状图参数
        var option = {
            height:280,
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    name:'手机厂商',
                    type : 'category',
                    data:xlist,
                    axisLabel:{
                        show:true,
                        textStyle:{color:"#f5f5f5"}
                    }
                }
            ],
            yAxis : [
                {
                    name:'个数',
                    type : 'value',
                    axisLabel:{
                        show:true,
                        textStyle:{color:"#f5f5f5"}
                    }
                }
            ],
            series : [
                {
                    name:'',
                    type:'bar',
                    data:ylist,
                    itemStyle:{
                        normal:{
                            color:function(params) {
                                var colorList = [
                                    '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0',
                                    'green','#26C0C0','#FCCE10','#E87C25','#27727B',
                                    '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                                    '#15AD9E','#AEF4ED','#038DB0','#89DBFB','#ED7931'
                                ];
                                return colorList[params.dataIndex]
                            }
                        }
                    }
                }
            ]
        };

		$("#authen_pie").echart("init", option);
    }


    function drawwireless (clientModeInfor,clientModeInfoAll)
    {
        function getOnModeList (ArrayT) 
        {
            var atemp = [];
                $.each(ArrayT,function(index,iArray){
                    atemp.push(
                            {
                                "acSN":iArray.acSN,
                                "ApName":iArray.ApName,
                                "clientMAC":iArray.clientMAC,
                                "clientIP":iArray.clientIP+'',
                                "clientMode":iArray.clientMode
                            }
                        );
                });

                return atemp;
        }

        function onClickWirelessPie (oPiece) 
        {
            if(oPiece.name=="5GHz" || oPiece.name=="2.4GHz")
            {
                oPiece.name = (oPiece.name=="5GHz")?"band_5g":"band_2_4g";
                $.ajax({
                    url:MyConfig.path+"/stamonitor/statistic_byClientModeHz_detail",
                    type: "GET",
                    dataType: "json",
                    data:{
                        bandType:oPiece.name,
                        skipnum:0,
                        limitnum:100000
                    },
                    success: function(data){
                        var all = getOnModeList(data.clientList);

                        $("#wirelessList").SList("refresh",all);
                        Utils.Base.openDlg(null, {}, {scope:$("#wireless_diag"),className:"modal-super dashboard"});
                        $("#wirelessList").SList("resize");
                        return false;
                    },
                    error: function(){
                       
                    }
                });
            }
            else
            {
                $.ajax({
                    url:MyConfig.path+"/stamonitor/statistic_byclientMode_detail",
                    type: "GET",
                    dataType: "json",
                    data:{
                        clientMode:oPiece.name,
                        skipnum:0,
                        limitnum:100000
                    },
                    success: function(data){
                        var all = getOnModeList(data.clientList);

                        $("#wirelessList").SList("refresh",all);
                        Utils.Base.openDlg(null, {}, {scope:$("#wireless_diag"),className:"modal-super dashboard"});
                        $("#wirelessList").SList("resize");
                        return false;
                    },
                    error: function(){

                    }
                });
            }
        }

        /*统计2.4G和5G终端个数*/
        var Num5G=0,Num2G=0;
        for(var i=0;i<clientModeInfoAll.length;i++){
            if(clientModeInfoAll[i].name=="802.11an" || clientModeInfoAll[i].name=="802.11a" || clientModeInfoAll[i].name=="802.11ac")
            {
                Num5G += clientModeInfoAll[i].value;
            }
            else
            {
                Num2G+=clientModeInfoAll[i].value;
            }
        }

        var option = {
            height:240,
            tooltip : {
                trigger: 'item',
                formatter: "{a} {b} <br/>{c} ({d}%)"
            },
            legend: {
                orient : 'vertical',
                x : 'left',
                y : 20,
                data: ['802.11a(5GHz)','802.11an(5GHz)','802.11ac(5GHz)','802.11b(2.4GHz)','802.11g(2.4GHz)','802.11gn(2.4GHz)']
            },
            calculable : false,
            series : [
                {
                    name: '',
                    type: 'pie',
                    radius : ['50%','70%'],
                    center: ['50%', '60%'],
                    data:clientModeInfor,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                },
                {
                    type:'pie',
                    radius : '40%',
                    center: ['50%', '60%'],
                    itemStyle: {
                        normal: {
                            labelLine:{
                                show:false
                            },
                            color: function(a,b,c,d) {
                                var colorList = ['#15AD9E','#ED7931'];
                                return colorList[b];
                            },
                            label:
                            {
                                position:"inner",
                                formatter: '{b}'
                            }
                        }
                    },
                    data: [
                        {name:'5GHz',value:Num5G},
                        {name:'2.4GHz',value:Num2G}
                    ]
                }
                
            ]
        };
        var oTheme={
                color: ['#15AD9E','#AEF4ED','#038DB0','#89DBFB','#ED7931','#E4934D','#F36E82']
        };
        
        $("#wireless_pie").echart("init", option,oTheme);
    }


    /*基于无线模式分类饼状图数据获取*/
    function initdrawwireless ()
    {
        var clientModeInfor = new Array();
        var clientModeInfoAll = new Array();
        $.ajax({
                url:MyConfig.path+"/stamonitor/statistic_byclientMode",
                type: "GET",
                dataType: "json",
                success: function(data){
                    var statistics = data.statistics || [];
                    for(var i = 0; i < statistics.length; i++){
                        if( (statistics[i].clientMode == "") || (statistics[i].clientMode == null)){
                            clientModeInfoAll.push({name:statistics[i].clientMode,value:statistics[i].count});
                            continue;
                        }

                        clientModeInfoAll.push({name:statistics[i].clientMode,value:statistics[i].count});
                        var temp = {
                            name:statistics[i].clientMode,
                            value:statistics[i].count
                        };
                        clientModeInfor.push(temp);
                    }

                    /*draw基于无线模式分类饼状图*/
                    drawwireless(clientModeInfor,clientModeInfoAll);
                },
                error: function(){
                   
                }
        }); 

    }
    function initData()
    {
        var oapnameApInfor=[];
        var ossidApInfor=[];
        $.ajax({
                url:MyConfig.path+"/stamonitor/statistic_byapnameandmode",
                type: "GET",
                dataType: "json",
                success: function(data){
                    for(var i=0;i<data.statistics.length;i++){
                        var temp={
                            "acSN":data.statistics[i].acSN,
                            "ApName":data.statistics[i].ApName,
                            "band_5G":data.statistics[i].band_5G+'',
                            "band_2_4G":data.statistics[i].band_2_4G+''
                        }
                        oapnameApInfor.push(temp);
                    }
                    $("#byApList").SList ("refresh", oapnameApInfor);
                },
                error: function(){
                   
                }
        }); 

        $.ajax({
                url:MyConfig.path+"/stamonitor/statistic_byssidandmode",
                type: "GET",
                dataType: "json",
                success: function(data){
                    for(var i=0;i<data.statistics.length;i++){
                        var temp={
                            "acSN":data.statistics[i].acSN,
                            "clientSSID":data.statistics[i].clientSSID,
                            "band_5G":data.statistics[i].band_5G+'',
                            "band_2_4G":data.statistics[i].band_2_4G+''
                        }
                        ossidApInfor.push(temp);
                    }
                     $("#bySsidList").SList ("refresh", ossidApInfor);
                },
                error: function(){
                   
                }
        }); 
        initdrawByod();
        initdrawwireless();
    }
    function initForm()
    {
        $("#refresh_client").on("click",initdrawByod);
        $("#refresh_wireless").on("click",initdrawwireless);
        

    }

    function initGrid()
    {
    	var optSsid = {
            colNames: getRcText ("SSID_HEADER"),
            showHeader: true,
            pageSize : 8,
            colModel: [
                {name: "acSN", datatype: "String"},
                {name: "clientSSID", datatype: "String"},
                {name:'band_5G', datatype:"String"},
                {name:'band_2_4G', datatype:"String"}
            ]
        };
        $("#bySsidList").SList ("head", optSsid);

        var optAp = {
            colNames: getRcText ("AP_HEADER"),
            pageSize : 8,
            showHeader: true,
            colModel: [
                {name:'acSN', datatype:"String"},
                {name:'ApName', datatype:"String"},
                {name:'band_5G', datatype:"String"},
                {name:'band_2_4G', datatype:"String"}
            ]
        };
        $("#byApList").SList ("head", optAp);

        var optPop = {
            colNames: getRcText ("POP_HEADER"),
            showHeader: true,
            colModel: [
                {name: "acSN", datatype: "String"},
                {name: "ApName", datatype: "String"},
                {name: "clientMAC", datatype: "String"},
                {name: "clientIP", datatype: "String"},
                {name: "clientVendor", datatype: "String"}
            ]
        };
        $("#popList").SList ("head", optPop);

         var optPop = {
            colNames: getRcText ("WIRE_HEADER"),
            showHeader: true,
            colModel: [
                {name: "acSN", datatype: "String"},
                {name: "ApName", datatype: "String"},
                {name: "clientMAC", datatype: "String"},
                {name: "clientIP", datatype: "String"},
                {name: "clientMode", datatype: "String"}
            ]
        };
        $("#wirelessList").SList ("head", optPop);
    }

    function _init()
    {
        // NC = Utils.Pages[MODULE_NC].NC; 
        initGrid();
        initForm();
        initData();

    };

    function _destroy()
    {
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init, 
        "destroy": _destroy, 
        "widgets": ["SList","Echart"],
        "utils":["Request","Base"],
        // "subModules":[MODULE_NC]
    });
})( jQuery );

