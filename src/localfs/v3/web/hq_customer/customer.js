;(function ($) {
    var MODULE_NAME = "hq_customer.customer";

    var branchReqValue = "";
    var authReqValue = "";

    // 恢复，在进行页面跳转之前的筛选状态
    var branchReqValueWGYZok = "";
    var authReqValueWGYZok = "";


    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("customer_rc", sRcName).split(",");
    }

    function drawEmptyPie(jEle)
    {
        var option = {
            height:200,
            calculable : false,
            legend: {
                orient: "vertical",
                x : 'left',
                y : 'center',
                data:['A','B','C']
            },   
            title : {
                text:'4444drawTitle',
                textStyle: {
                    fontSize:16,
                    color:'#343e4e'
                },
                x: 'center',
                y: 'center'
            },            
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
        
        $("#Channel_laiFangCiShu").echart("init", option,oTheme);
    }


    function _init(oPara)
    {
        // NC = Utils.Pages[MODULE_NC].NC; 

        var oPara = Utils.Base.parseUrlPara();        
        branchReqValueWGYZok=oPara.branchReqValueWGYZ;
        authReqValueWGYZok=oPara.authReqValueWGYZ;

        // 获取分支list
        getBranchNames_List();

        // 顶部筛选条，触发
        globalsChooseClick();
        portalChooseClick();


        // draw
        initGrid();

        initEvent();

        // 刷数据
        DataFresh();


    }

    // 获取分支list
    function getBranchNames_List(){
        function getBranchNames_ListOK(data){
            if(!data.errcode)
            {                
                //获取到值
                 var branchList_data=[];
                $.each(data.branchList,function(i,item){                   
                    branchList_data.push({"val" : item.branchName, "show" : item.branchName});                    
                });

                //假数据
                // var branchList_data = [{"val" : "branch01", "show" : "branch01"}, {"val" : "branch02", "show" : "branch02"}, {"val" : "branch03", "show" : "branch03"}]
                
                $("#branchSelect").singleSelect("InitData", branchList_data, {displayField:"show", "valueField":"val",allowClear:false});
         
            }
            else{  
                //假数据
                // var branchList_data = [{"val" : "branch01", "show" : "branch01"}, {"val" : "branch02", "show" : "branch02"}, {"val" : "branch03", "show" : "branch03"}]
                $("#branchSelect").singleSelect("InitData", [], {displayField:"show", "valueField":"val",allowClear:false});

            }
        }
        function getBranchNames_ListFail(err){
            console.log("ajax request fail:"+err);
        }            
        var getBranchNames_List = {
            type:"GET",
            url:MyConfig.path+"/apmonitor/getBranchList?devSN="+FrameInfo.ACSN,
            
            contentType:"application/json",
            dataType:"json",
            onSuccess:getBranchNames_ListOK,
            onFailed:getBranchNames_ListFail
        };

        Utils.Request.sendRequest(getBranchNames_List);    
    }

    // "全局/分支"筛选，事件触发
    function globalsChooseClick(){
        if($('#globals-yes').is(':checked')){
            $("#branchSelectDiv").css("display","none");

            branchReqValue="";

            // 给页面重新刷数据
            DataFresh();
        }
        else{
            $("#branchSelectDiv").css("display","inline-block");
            
            if($("#branchSelect").val()==null){
                branchReqValue="";
            }else{
                branchReqValue="&branch="+$("#branchSelect").val();
            }
            
            // 给页面重新刷数据
            DataFresh();
        }
    }

    // "关联/认证"筛选，事件触发
    function portalChooseClick(){
        if(!$('#portal-choose').is(':checked')){
            $("#oneone").show();
            $("#twotwo").hide();

            authReqValue = "";
            // 给页面重新刷数据
            DataFresh();            
        }else{
            $("#oneone").hide();
            $("#twotwo").show();   

            authReqValue = "&auth=true";
            // 给页面重新刷数据
            DataFresh();                
        }
    }


    function initEvent()
    {
        //全局/分支，筛选条件触发
        $('input[name="globals-info"]').on("change", function(){
            globalsChooseClick();
        });

        // 分支名称发生改变
        $("#branchSelect").on("change", function(){
           globalsChooseClick();
        });


        //关联/认证，筛选条件触发
        $('#portal-choose').on("click", function(){
            portalChooseClick();
        });



        //进入客户端数量的跳转页
        $("#submit_scan").on("click", function(){
            Utils.Base.redirect ({np:$(this).attr("data-hrefLink"),branchReqValueSend:branchReqValue,authReqValueSend:authReqValue});
            return false;
        });

        $("#submit_scan_portal").on("click", function(){
            Utils.Base.redirect ({np:$(this).attr("data-hrefLink"),branchReqValueSend:branchReqValue,authReqValueSend:authReqValue});
            return false;
        });

        //宾客统计，日期菜单      
        $("#dateChoose_Div .xx-link").click(function () {
            $("#dateChoose_Div .xx-link").removeClass("active");
            var dataType = $(this).addClass("active").attr("id");
            getLoginUser_Ajax(dataType);
        });

        //客流统计，2个跳转页的链接      
        $("#detailChoose_Div .xx-link").click(function () {            
            Utils.Base.redirect ({np:$(this).attr("data-hrefLink"),branchReqValueSend:branchReqValue,authReqValueSend:authReqValue});
            return false;
        });

        // 小蓝字点击，出现弹框
        $("#byBranchesList , #bySsidList").on('click','a',function(){
            openDalg($(this).attr("indexValue"),$(this).attr("bandType"),$(this).attr("listType"),branchReqValue,authReqValue);
            return false;
        }); 
    }


    // 页面内容：获取数据
    function DataFresh(){
        if(authReqValue==""){
            getClientStatisticByBandType1();
            getClientStatisticByBandType2();
        }else{
            getClientStatisticByBandType1();
        }
        
        

        // getLoginUser_Ajax();
        $("#dateChoose_Div .active").click(); 

        getChannel_A_Echart_Ajax();
        getChannel_B_Echart_Ajax();

        
        getClientStatisticByBranches();
        getClientStatisticBySSID();  
    }
        
          

    //GET客户端数量1
    function getClientStatisticByBandType1(){
        function getclientstatisticbybandtypeOK(data){
            if(!data.errcode)
            {                
                //获取到值
                var Num5GValue=data.clientList[0].Count5G;
                var Num2GValue=data.clientList[0].Count24G;
                var TotalValue=data.clientList[0].staCount;
                
                //把获取到的值，刷到页面上
                $("#Total").html(TotalValue);
                $("#Num5G").html(Num5GValue);
                $("#Num2G").html(Num2GValue);

                $("#Total_portal").html(TotalValue);
                $("#Num5G_portal").html(Num5GValue);
                $("#Num2G_portal").html(Num2GValue);            
                
            }
            else{      
            }
        }
        function getclientstatisticbybandtypeFail(err){
            console.log("ajax request fail:"+err);
        }            
        var getclientstatisticbybandtype = {
            type:"GET",
            url:MyConfig.path+"/stamonitor/getclientlistbycondition?devSN="+FrameInfo.ACSN+"&reqType=count"+branchReqValue+authReqValue,
            
            contentType:"application/json",
            dataType:"json",
            onSuccess:getclientstatisticbybandtypeOK,
            onFailed:getclientstatisticbybandtypeFail
        };

        Utils.Request.sendRequest(getclientstatisticbybandtype);    
    }

    // GET客户端数量2
    function getClientStatisticByBandType2(){
        function getportalUserCountSuc (data) {
            $("#NumRZ").html(Utils.Base.addComma(data.clientList[0].conditionCount));
        }
        function getportalUserCountFail (err) {
            console.log("ajax request fail:"+err);
        }
        var portalUserCountOpt = {
            url:MyConfig.path+"/stamonitor/getclientlistbycondition?devSN="+FrameInfo.ACSN+"&reqType=all"+branchReqValue+authReqValue,
            
            type: "GET",
            contentType:"application/json",
            dataType: "json",            
            onSuccess:getportalUserCountSuc,
            onFailed:getportalUserCountFail
        };
        Utils.Request.sendRequest(portalUserCountOpt);    
    }

    // GET宾客统计
    function getLoginUser_Ajax(dataType){

        function getLoginUser_AjaxOK(data){
            // if(data.errorcode == 0)
            if(!data.errcode)
            {
                // 把数据准备好

                // [新增宾客/宾客总数/横坐标日期/横坐标单位]数据
                var aData=[];
                var bData=[];
                var date=[];
                var amode=1;

                $.each(data.histclientList,function(i,item){
                    aData.push(item.newCount);

                    bData.push(item.totalCount);

                    var counttime0=item.time;
                    var counttime1=counttime0.split('T')[0];
                    var counttime2=counttime1.split('-')[2];
                    date.push(counttime2);   
                });

                //
                if(dataType=="oneday"){
                    amode=1;
                }else if(dataType=="oneweek"){
                    amode=2;
                }else if(dataType=="onemonth"){
                    amode=3;
                }else if(dataType=="----"){
                    amode=4;
                }

                // 假数据
                // var aData=[2, 2, 2, 4, 4, 4, 6, 6, 6, 0, 0];
                // var bData=[8, 2, 2, 4, 4, 4, 6, 6, 6, 0, 0];
                // var date=[16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]; 
                // var amode=1;  
                
                // 用折线图展示数据
                drawLoginUser(aData, bData, date, amode);              
                           
            }
            else{
                
            }                
        }

        function getLoginUser_AjaxFail(err){
            console.log("ajax request fail:"+err);
        }            

        //dataType转换
        if(dataType=="days"){
            dataType="oneday";
        }else if(dataType=="weeks"){
            dataType="oneweek";
        }else if(dataType=="mounth"){
            dataType="onemonth";
        }else if(dataType=="years"){
            dataType="----";
        }

        //AJAX下发请求
        var getLoginUser_Ajax = {
            type:"GET",
            url:MyConfig.path+"/stamonitor/histclientstatistic_bycondition?devSN="+FrameInfo.ACSN+"&dataType="+dataType+branchReqValue+authReqValue,
            contentType:"application/json",
            dataType:"json",
            onSuccess:getLoginUser_AjaxOK,
            onFailed:getLoginUser_AjaxFail
        };

        Utils.Request.sendRequest(getLoginUser_Ajax);                
    }


    // GET客流统计_A
    function getChannel_A_Echart_Ajax(){

        function getChannel_A_Echart_AjaxOK(data){
            // if(data.errorcode == 0)
            if(!data.errcode)
            {
                // 把数据准备好
                var drawTitle=getRcText("USER_KeLiuTongJi_Title")[0];

                //  
                // var data={result:{count1:1,count2:2,count3:3,count4:4}};
                var drawData=[
                    { name: '一次', value: data.result.count1},
                    { name: '两次', value: data.result.count2},
                    { name: '三次', value: data.result.count3},
                    { name: '四次以上', value: data.result.count4}
                ];


                // //假数据
                // var drawData=[
                //     { name: '一次', value: 9 },
                //     { name: '两次', value: 0 },
                //     { name: '三次', value: 0 },
                //     { name: '四次以上', value: 0 }
                // ];        
                var drawLegend=getRcText("USER_KeLiuTongJi_A_Legend");

                // 用环形图展示数据
                var option = drawChannel_Echart(drawTitle,drawData,drawLegend);
                var oTheme = {
                    color: ['#4ec1b2', '#ff9c9e', '#fbceb1', '#b3b7dd', '#F7C762', '#ABD6F5', '#63B4EF', '#3DA0EB', '#1683D3', '#136FB3']
                };
                $("#Channel_laiFangCiShu").echart("init", option,oTheme);            
                           
            }
            else{
                
            }                
        }

        function getChannel_A_Echart_AjaxFail(err){
            console.log("ajax request fail:"+err);
        }            

        var getChannel_A_Echart_Ajax = {
            type:"GET",
            url:MyConfig.path+"/visitor/getstatisticsbycount?devSN="+FrameInfo.ACSN+branchReqValue+authReqValue,
            contentType:"application/json",
            dataType:"json",
            onSuccess:getChannel_A_Echart_AjaxOK,
            onFailed:getChannel_A_Echart_AjaxFail
        };

        Utils.Request.sendRequest(getChannel_A_Echart_Ajax);       

    }


    // GET客流统计_B
    function getChannel_B_Echart_Ajax(){

        function getChannel_B_Echart_AjaxOK(data){
            // if(data.errorcode == 0)
            if(!data.errcode)
            {   
                // 把数据准备好
                var drawTitle=getRcText("USER_KeLiuTongJi_Title")[1];
                var drawData=[
                    { name: '半小时以内', value: data.clientList.halfhour },
                    { name: '一小时内', value: data.clientList.onehour },
                    { name: '两小时内', value: data.clientList.twohour },
                    { name: '两小时以上', value: data.clientList.greatertwohour }
                ];        
                var drawLegend=getRcText("USER_KeLiuTongJi_B_Legend");

                // 用环形图展示数据
                var option = drawChannel_Echart(drawTitle,drawData,drawLegend);        
                var oTheme = {
                    color: ['#4ec1b2', '#ff9c9e', '#fbceb1', '#b3b7dd', '#F7C762', '#ABD6F5', '#63B4EF', '#3DA0EB', '#1683D3', '#136FB3']
                };        
                $("#Channel_zhuLiuShiChang").echart("init", option, oTheme);                
                           
            }
            else{
                
            }                
        }

        function getChannel_B_Echart_AjaxFail(err){
            console.log("ajax request fail:"+err);
        }            

        var getChannel_B_Echart_Ajax = {
            type:"GET",
            url:MyConfig.path+"/stamonitor/getclientlistbycondition?devSN="+FrameInfo.ACSN+"&reqType=onlinetime"+branchReqValue+authReqValue,
            
            contentType:"application/json",
            dataType:"json",
            onSuccess:getChannel_B_Echart_AjaxOK,
            onFailed:getChannel_B_Echart_AjaxFail
        };

        Utils.Request.sendRequest(getChannel_B_Echart_Ajax); 


    }
    // GET2个List_分支
    function getClientStatisticByBranches(){
   
        //
        function getclientstatisticbyBranchesOK(data){
            // if(data.errorcode == 0)
            if(!data.errcode)
            {
                
                // // START
                // var data={"clientList":[{"branchName":'ssidone',"Count24G":'假',"Count5G":'假',},{"branchName":'ssidone',"Count24G":'假',"Count5G":'假',}]};
                // //END                
                var g_allInforbySsid=[];
                $.each(data.clientList,function(i,item){
                    g_allInforbySsid[i]={};
                    g_allInforbySsid[i].Branches=item.branchName;
                    g_allInforbySsid[i].ClientNumber2G=item.Count24G;
                    g_allInforbySsid[i].ClientNumber5G=item.Count5G;
                }); 
                $("#byBranchesList").SList ("refresh", g_allInforbySsid);            
            }
            else{
                
            }                
        }

        function getclientstatisticbyBranchesFail(err){
            console.log("ajax request fail:"+err);
        }            

        var getclientstatisticbyBranches = {
            type:"GET",
            url:MyConfig.path+"/stamonitor/getclientlistbycondition?devSN="+FrameInfo.ACSN+"&reqType=branch"+branchReqValue+authReqValue,
            contentType:"application/json",
            dataType:"json",
            onSuccess:getclientstatisticbyBranchesOK,
            onFailed:getclientstatisticbyBranchesFail
        };

        Utils.Request.sendRequest(getclientstatisticbyBranches); 

    }

    // GET2个List_SSID
    function getClientStatisticBySSID(){
   
        //按SSID获取终端统计个数
        function getclientstatisticbyssidOK(data){
            // if(data.errorcode == 0)
            if(!data.errcode)
            {
                //ssid slit : fu zhi
                // START
                // var data={"clientList":[{"clientSSID":'ssidone',"band_2_4g":'假',"band_5g":'假',}]};
                //END

                var g_allInforbySsid=[];
                $.each(data.clientList,function(i,item){
                    g_allInforbySsid[i]={};
                    g_allInforbySsid[i].SSID=item.clientSSID;
                    g_allInforbySsid[i].ClientNumber2G=item.Count24G;
                    g_allInforbySsid[i].ClientNumber5G=item.Count5G;
                }); 
                $("#bySsidList").SList ("refresh", g_allInforbySsid);            
            }
            else{
                
            }                
        }

        function getclientstatisticbyssidFail(err){
            console.log("ajax request fail:"+err);

        }            
        // console.log(branchReqValue+authReqValue);
        var getclientstatisticbyssid = {
            type:"GET",
            url:MyConfig.path+"/stamonitor/getclientlistbycondition?devSN="+FrameInfo.ACSN+"&reqType=ssid"+branchReqValue+authReqValue,
            contentType:"application/json",
            dataType:"json",
            onSuccess:getclientstatisticbyssidOK,
            onFailed:getclientstatisticbyssidFail
        };

        Utils.Request.sendRequest(getclientstatisticbyssid); 

    }

    // Draw宾客统计
    function drawLoginUser(aData, bData, date, amode) {

        // 赋值
        var aData=aData;
        var bData=bData;
        var date=date;
        var amode=amode;

        // 画折线图
        var xText = ['分','时','日','日','月'];


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
                    name: xText[1],
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
                    name:getRcText("USER_BinKeTongJi_Y")[0],
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

        $("#loginUserEchart").echart("init", option, oTheme);

    }

    // Draw客流统计
    function drawChannel_Echart(drawTitle,drawData,drawLegend){

        // 赋值
        var drawTitle=drawTitle;
        var drawData=drawData;
        var drawLegend=drawLegend;


        // 画环图
        var option = {
            height: 280,
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: "vertical",
                x : 'left',
                y : 'center',
                data:drawLegend
            },   
            title : {
                text:drawTitle,
                textStyle: {
                    fontSize:16,
                    color:'#343e4e'
                },
                x: 'center',
                y: 'center'
            },                     
            calculable: false,
            series: [
                {
                    type: 'pie',
                    radius: ['35%', '55%'],
                    center: ['50%', '50%'],
                    itemStyle: {
                        normal: {
                            labelLine: {
                                length: 10,
                                show:false
                            },
                            label:
                            {
                                position: "inner",
                                textStyle: {
                                    color: "#484A5E"
                                },
                                formatter: " {b} ",
                                show:false
                            }
                        }
                    },
                    splitLine: {           // 分隔线
                        show: true,        // 默认显示，属性show控制显示与否
                        lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                            color: '#FF0',
                            width: 20
                        }
                    },
                    data:drawData
                }
            ]
        };
        
        return option;
        
    }

    // 画“分支、SSID”2个list
    function initGrid()
    {
        var optBranches = {
            colNames: getRcText ("BRANCHES_HEADER"),
            showHeader: true,
            pageSize : 5,

            colModel: [
                {name: "Branches", datatype: "String",width:150},
                {name: "ClientNumber5G", datatype: "String",formatter:showNum},
                {name: "ClientNumber2G", datatype: "String",formatter:showNum}
            ]
        };
        $("#byBranchesList").SList ("head", optBranches);

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
    }

    // 处理，下方2个表的小蓝字
    function showNum(row, cell, value, columnDef, oRowData,sType)
    {

        // 判断是Branches表
        var listType=1;
        var sBranchesOrSsid = oRowData.Branches;
        
        // 判断是ssid表
        if(!sBranchesOrSsid)
        {
            listType=2;
            sBranchesOrSsid = oRowData.SSID;
        }

        // 列表中“数字”显示成“链接样式”
        if(sType == "text"||value=="0")
        {
            return value;
        }

        return '<a indexValue="'+sBranchesOrSsid+'" bandType="'+cell+'" listType="'+listType+'" style="cursor:pointer;color: #4ec1b2;">'+ value +'</a>';
    }

    // 下方2个表中数值被点击，弹出的框
    function openDalg(indexValue, bandType, listType, branchReqValue, authReqValue)
    {
        // 传值
        if(bandType==1){
            bandType="mode5G"
        }else if(bandType==2){
            bandType="mode24G"
        }else{
            console.log('try catch');
        }

        // 弹框
        Utils.Base.openDlg("hq_customer.view_client", {"indexValue":indexValue,"bandType":bandType,"listType":listType,"branchReqValueSend":branchReqValue,"authReqValueSend":authReqValue}, {scope:$("#maoxian"),className:"modal-super dashboard"});
        return false;
    }    

    function _resize() {

    }

    function _destroy()
    {
        console.log("*******商业连锁总部//宾客信息*******GO OUT>>>>");
        Utils.Request.clearMoudleAjax(MODULE_NAME);        
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init, 
        "destroy": _destroy, 
        "widgets": ["SList","Echart","Panel", "DateTime", "Form","SingleSelect", "Minput"],
        "utils":["Request","Base", "Msg"]
    });
})( jQuery );

