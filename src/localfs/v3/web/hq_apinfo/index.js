;(function ($) {
    var MODULE_NAME = "hq_apinfo.index";

    var branchReqValue = "";

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("apinfo_rc", sRcName).split(",");
    }
// ？？
    function drawEmptyPie(whichEchart)
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
        
        whichEchart.echart("init", option,oTheme);
    }


    function _init()
    {
        // NC = Utils.Pages[MODULE_NC].NC; 


        // 获取分支list
        getBranchNames_List();


        // 顶部筛选条，触发
        globalsChooseClick();
        

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



    function initEvent()
    {
        //[AP_Info]   全局/分支，筛选条件触发
        $('input[name="globals-info"]').on("change", function(){
            globalsChooseClick();
        });

        //[AP_Info]   分支名称发生改变
        $("#branchSelect").on("change", function(){
           globalsChooseClick();
        });       


        //[AP_Info] 进入AP数量的跳转页
        $("#submit_scan").on("click", function(){
            Utils.Base.redirect ({np:$(this).attr("data-hrefLink"),branchReqValueSend:branchReqValue});
            return false;
        });

        //[AP_Info] 小蓝字点击，出现弹框
        $("#According_BranchesName_List").on('click','a',function(){
            openDalg($(this).attr("indexValue"));
            return false;
        });
    }


    // 页面内容：获取数据
    function DataFresh(){
        getApNumber();

        getAjax_According_APModel_Bar();

        getApStatisticByBranchesName();  

        getAjax_According_ClientCount_Pie();

        getAjax_According_APType_Pie();

    }
        
          

    // [AP-Info] GET AP数量
    function getApNumber(){
        function getApNumberOK(data){
            if(!data.errcode)
            {                
                // START
                // var data={"ap_statistic":{"online":'0',"offline":'0',"other":'0'}};
                //END
                //获取到值
                var onlineValue=data.ap_statistic.online;
                var offlineValue=data.ap_statistic.offline;
                var unhealthyValue=data.ap_statistic.other;

                
                //把获取到的值，刷到页面上
                $("#online").html(onlineValue);
                $("#offline").html(offlineValue);
                $("#unhealthy").html(unhealthyValue);
                
            }
            else{      
            }
        }
        function getApNumberFail(err){
            console.log("ajax request fail:"+err);
        }            
        var getApNumber = {
            type:"GET",
            url:MyConfig.path+"/apmonitor/getApCountByStatus?devSN="+FrameInfo.ACSN+branchReqValue,
            contentType:"application/json",
            dataType:"json",
            onSuccess:getApNumberOK,
            onFailed:getApNumberFail
        };

        Utils.Request.sendRequest(getApNumber);    
    }


    // [AP-Info] GET “基于AP-Model”
    function getAjax_According_APModel_Bar(){

        function getAjax_According_APModel_BarOK(data){
            // if(data.errorcode == 0)
            if(!data.errcode)
            {
                // 处理数据
                
                if(data.apList.length!=0){

                    var aModels=[];
                    var aModelData=[];

                    $.each(data.apList,function(i,item){
                        //PS:value是0的，就不要了
                        if(item.ApCount==0){

                        }else{
                            aModels.push(item.ApModel);
                            aModelData.push({name:item.ApModel,value:item.ApCount});
                        }
                    });                    
                }

                //“没有数据”的情况处理
                if(data.apList.length==0){
                    var aModels=["暂无AP Model"];
                    var aModelData=[{name:"暂无AP Model",value:0}];                    
                }

                //假数据
                // var aModels=["WA2620i-A","WA2620i-B","WA2620i-C","WA2620i-D"];
                // var aModelData=[{name:"WA2620i-A",value:2},{name:"WA2620i-B"},{name:"WA2620i-C",value:6},{name:"WA2620i-D",value:8}];
                


                // 画Bar图
                draw_According_APModel_Bar(aModels,aModelData);
        
            }
            else{
                
            }                
        }

        function getAjax_According_APModel_BarFail(err){
            console.log("ajax request fail:"+err);
        }            

        var getAjax_According_APModel_Bar = {
            type:"GET",
            url:MyConfig.path+"/apmonitor/getApCountByModel?devSN="+FrameInfo.ACSN+branchReqValue,
            contentType:"application/json",
            dataType:"json",
            onSuccess:getAjax_According_APModel_BarOK,
            onFailed:getAjax_According_APModel_BarFail
        };

        Utils.Request.sendRequest(getAjax_According_APModel_Bar); 

    }


    // [AP-Info] GET“分支”list
    function getApStatisticByBranchesName(){
        function getApStatisticByBranchesNameOK(data){
            // if(data.errorcode == 0)
            if(!data.errcode)
            {
                
                // START
                // var data={"ap_statistic":[{"BranchesName":'branchesOne',"apCount":'0'},{"BranchesName":'branchesOne',"apCount":'0'}]};
                //END                
                var g_apCountByBranchesName=[];
                $.each(data.branchList,function(i,item){
                    g_apCountByBranchesName[i]={};
                    g_apCountByBranchesName[i].BranchesName=item.branchName;
                    g_apCountByBranchesName[i].apCount=item.apCount;
                }); 
                $("#According_BranchesName_List").SList ("refresh", g_apCountByBranchesName);            
            }
            else{
                
            }                
        }

        function getApStatisticByBranchesNameFail(err){
            console.log("ajax request fail:"+err);
        }            

        var getApStatisticByBranchesName = {
            type:"GET",
            url:MyConfig.path+"/apmonitor/getBranchList?devSN="+FrameInfo.ACSN+branchReqValue,
            contentType:"application/json",
            dataType:"json",
            onSuccess:getApStatisticByBranchesNameOK,
            onFailed:getApStatisticByBranchesNameFail
        };

        Utils.Request.sendRequest(getApStatisticByBranchesName); 

    }


    // [AP-Info] GET “基于终端数”
    function getAjax_According_ClientCount_Pie(){

        function getAjax_According_ClientCount_PieOK(data){
            // if(data.errorcode == 0)
            if(!data.errcode)
            {
                // 处理完的数据
                var tuli=["0","1~10","11~20","21~40","41~60","61~80","81~100","101以上"];

                // // 假数据
                // var data={statistics:[{count:1},{count:2},{count:3},{count:4},{count:5},{count:4},{count:4},{count:4}]};
                
                var shuju=[
                            {name:"0",value : (data.statistics[0].count==0)?undefined:data.statistics[0].count},
                            {name:"1~10",value : (data.statistics[1].count==0)?undefined:data.statistics[1].count},
                            {name:"11~20",value : (data.statistics[2].count==0)?undefined:data.statistics[2].count},
                            {name:"21~40",value : (data.statistics[3].count==0)?undefined:data.statistics[3].count},
                            {name:"41~60",value : (data.statistics[4].count==0)?undefined:data.statistics[4].count},
                            {name:"61~80",value : (data.statistics[5].count==0)?undefined:data.statistics[5].count},
                            {name:"81~100",value : (data.statistics[6].count==0)?undefined:data.statistics[6].count},
                            {name:"101以上",value : (data.statistics[7].count==0)?undefined:data.statistics[7].count}
                        ];
                        
                // 画空的饼图
                var iChangDu=shuju.length;
                if(iChangDu==0)
                {
                    drawEmptyPie($("#According_ClientCount_Pie"));
                    return;
                }

                // 画饼图
                draw_According_ClientCountOrAPType_Pie(tuli,shuju,$("#According_ClientCount_Pie"),"clientPie");
        
            }
            else{
                
            }                
        }

        function getAjax_According_ClientCount_PieFail(err){
            console.log("ajax request fail:"+err);
        }            

        var getAjax_According_ClientCount_Pie = {
            type:"GET",
            url:MyConfig.path+"/stamonitor/statisticaplist_byclientcount?devSN="+FrameInfo.ACSN+branchReqValue,
            contentType:"application/json",
            dataType:"json",
            onSuccess:getAjax_According_ClientCount_PieOK,
            onFailed:getAjax_According_ClientCount_PieFail
        };

        Utils.Request.sendRequest(getAjax_According_ClientCount_Pie); 

    }


    // [AP-Info] GET “基于AP类型”
    function getAjax_According_APType_Pie(){

        function getAjax_According_APType_PieOK(data){
            // if(data.errorcode == 0)
            if(!data.errcode)
            {
                // 处理完的数据
                var tuli=["在线的手工AP","自动AP","离线的手工AP","未认证的AP"];

                // // 假数据
                // var data={apList:[{CreateMethod:1,ApCount:4},{CreateMethod:2,ApCount:3},{CreateMethod:3,ApCount:2},{CreateMethod:4,ApCount:1}]};
                
                var shuju=[];
                $.each(data.apList,function(i,item){

                    //名字
                    var nameTemp="";

                    if(item.CreateMethod==1){
                        nameTemp="在线的手工AP";                                          
                    }else if(item.CreateMethod==2){
                        nameTemp="自动AP";                    
                    }else if(item.CreateMethod==3){
                        nameTemp="离线的手工AP";                   
                    }else if(item.CreateMethod==4){
                        nameTemp="未认证的AP";                   
                    }

                    //值
                    if(item.ApCount==0){
                        shuju.push({name:nameTemp,value:undefined});
                    }else{
                        shuju.push({name:nameTemp,value:item.ApCount});
                    }   
                });

                
                
                //假数据
                // var shuju=[
                //     {name:'在线的手工AP',value:10},                        
                //     {name:'自动AP',value:undefined},
                //     {name:'离线的手工AP',value:20},
                //     {name:'未认证的AP',value:10}
                // ];

                // 画空的饼图
                var iChangDu=shuju.length;
                if(iChangDu==0)
                {
                    drawEmptyPie($("#According_ApType_Pie"));
                    return;
                }

                // 画饼图
                draw_According_ClientCountOrAPType_Pie(tuli,shuju,$("#According_ApType_Pie"),"methodPie");
        
            }
            else{
                
            }                
        }

        function getAjax_According_APType_PieFail(err){
            console.log("ajax request fail:"+err);
        }            

        var getAjax_According_APType_Pie = {
            type:"GET",
            url:MyConfig.path+"/apmonitor/getApCountByMethod?devSN="+FrameInfo.ACSN+branchReqValue,
            contentType:"application/json",
            dataType:"json",
            onSuccess:getAjax_According_APType_PieOK,
            onFailed:getAjax_According_APType_PieFail
        };

        Utils.Request.sendRequest(getAjax_According_APType_Pie); 

    }


    // [AP-Info] draw “基于AP Model”
    function draw_According_APModel_Bar(a_y_APModelNames,a_Data){
        var nEnd = parseInt(700/a_y_APModelNames.length)-1;
        var nWidth = $("#APModel_bar").parent().width()*0.95;
        
        var opt = {
                color: ['#4ec1b2'],
                width: nWidth,
                height: 284,
                grid: {
                    x:40, y:0, x2:80, y2:25,
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
                        data : a_y_APModelNames,
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
                        data: a_Data,
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
        $("#According_APModel_Bar").echart("init", opt);
    }


    // [AP-Info] 画“分支”list
    function initGrid()
    {
        var optBranches = {
            colNames: getRcText ("According_BranchesName_List_Header"),
            showHeader: true,
            pageSize : 5,

            colModel: [
                {name: "BranchesName", datatype: "String"},
                {name: "apCount", datatype: "String",formatter:showNum}
            ]
        };

        $("#According_BranchesName_List").SList ("head", optBranches);        
    }


    // [AP-Info] "分支"表中的小蓝数字
    function showNum(row, cell, value, columnDef, oRowData,sType)
    {
        var sBranchesName = oRowData.BranchesName;

        // 列表中“数字”显示成“链接样式”
        if(sType == "text"||value=="0")
        {
            return value;
        }

        return '<a indexValue="'+sBranchesName+'" style="cursor:pointer;color: #4ec1b2;">'+ value +'</a>';
    }


    // [AP-Info] "分支"表中的数值被点击，弹出框
    function openDalg(indexValue)
    {
        // 弹框
        Utils.Base.openDlg("hq_apinfo.view_aplist", {"indexValue":indexValue,"branchReqValueSend":branchReqValue}, {scope:$("#maoxian"),className:"modal-super dashboard"});
        return false;
    }    


    // [AP-Info] draw “基于终端数/基于AP类型”
    function draw_According_ClientCountOrAPType_Pie(tuli,shuju,whichEchart,whichPie){

        var option = {
            height:230,
            tooltip : {
                trigger: 'item',
                formatter: "{a} {b} <br/>{c} ({d}%)"
            },
            legend: {
                orient : 'vertical',
                x : 'left',
                y : 'center',
                data:tuli
            },
            
            calculable : false,
            click: function(oInfo){
                
                // 弹框
                Utils.Base.openDlg("hq_apinfo.view_aplist_bypie", {"whichurl":whichPie,"canshuValueSend":oInfo.dataIndex,"branchReqValueSend":branchReqValue}, {scope:$("#maoxian"),className:"modal-super dashboard"});
                return false;           
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
                    data:shuju
                }
            ]
        };
        var oTheme = {
            color : ['#4fc4f6','#78cec3','#4ec1b2','#f2bc98','#fbceb1','#fe808b','#ff9c9e','#e7e7e9']
        };
        whichEchart.echart ("init", option,oTheme);
    }

    function _resize() {

    }

    function _destroy()
    {
        console.log("*******商业连锁总部//AP信息*******GO OUT>>>>");
        Utils.Request.clearMoudleAjax(MODULE_NAME);        
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init, 
        "destroy": _destroy, 
        "widgets": ["SList","Echart","Panel", "DateTime", "Form","SingleSelect", "Minput"],
        "utils":["Request","Base", "Msg"]
    });
})( jQuery );

