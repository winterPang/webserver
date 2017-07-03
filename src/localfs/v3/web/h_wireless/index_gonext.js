    (function ($){
            var MODULE_BASE = "h_wireless";
            var MODULE_NAME = MODULE_BASE + ".index_gonext";
            var MODULE_RC = "h_wireless_indexGonext";
            //var MODULE_NP_H_WIRELESS = MODULE_BASE + ".index_detial";
            var g_oTableData = {};
            // var g_detial={};
            var deleteData={};
            var g_oPara;
            var SKIP=0;
            var LIMIT=100;
                function getRcText(sRcName){
                return Utils.Base.getRcString(MODULE_RC, sRcName);//MODULE_RC指的是apinfo_aplist_rc这个div，这句话看框架源码即可知道返回的是那个div里的具体sRcName的值
            }

            function datatime (argument) {
                
                var day  = parseInt(argument/86400);
                var temp = argument%86400;
                var hour = parseInt(temp/3600);
                temp = argument%3600;
                var mini = parseInt(temp/60);
                var sec  = argument%60;
                if (hour < 10)
                {
                    var sDatatime = day+":0"+hour;
                }
                else
                {
                    var sDatatime = day+":"+hour;
                }
                if (mini < 10)
                {
                     sDatatime = sDatatime+":0"+mini;
                } else 
                {
                     sDatatime = sDatatime+":"+mini;
                }
                if (sec < 10)
                {
                    sDatatime = sDatatime+":0"+sec;
                } else 
                {
                    sDatatime = sDatatime+":"+sec;
                }
                return sDatatime;
            }

            // function onDisDetail()
            // {
            //     var apNames = $(this).attr("ApName");
            //     var type=$(".list-link").attr("type");
            //     if($(this).attr("type")=="apName"){
            //          var oData = g_oTableData[apNames];
            //      $("#flowdetail_listAP").SList ("resize");
            //     // showWirelessInfo(oData);
            //     Utils.Base.updateHtml($("#view_client_form"), oData);
            //     Utils.Base.openDlg(null, {}, {scope:$("#TerminalInfoDlg"),className:"modal-super"});
            //     }else{
            //          $("#onlineuser_list").on('click','a.list-link',onDisDetail1);
            //     }
                
            // }
             function onDisDetail1()
            {
                var apNames = $(this).attr("ApName");
                var type=$(".list-link").attr("type");//永远返回apName
                if($(this).attr("type")=="apGroup"){
                    var oData = g_oTableData[apNames];
                 $("#flowdetail_listAPGroup").SList ("resize");
                Utils.Base.updateHtml($("#view_client_form1"), oData);
                Utils.Base.openDlg(null, {}, {scope:$("#TerminalInfoDlg1"),className:"modal-super"});
                }else{
                     $("#onlineuser_list").on('click','a.list-link',onDisDetail);
                }
                //用来弹窗口的
                
            }


            // function draw(){

            function showRadio(obj)//这是一个处理函数，将返回的值做成具体的东西
            {
                // var sRadio = (obj.length == '0')? '' : obj.length+'';
                var sRadio = '';
                $.each(obj,function(index,oDate){
                    sRadio =sRadio +oDate.radioMode+'Hz('+oDate.radioId+')' +",";
                });
                return sRadio.substring(0,sRadio.length-1);
            }

            function onLineTime(num){
                var time = (num.status == 1)? datatime(num.onlineTime) :
                        ((num.status == 2)? aStatus[num.status] : "正在下载版本");
                return time ;
            }

            function Traffic(up,down)
            {
                    
                return parseInt(up)+'/'+parseInt(down);
            }

            var aStatus = getRcText("STATUS").split(',');
                
            function Fresh(){
                Utils.Base.refreshCurPage();
            }

            function bindAP(){
                //alert(1);
                       // for(var i=0;i<data.length;i++){
                       //      data[i].apGroupName="是";
                       //  if(data[i].apGroupName="是"){
                       //  Frame.Msg.info("配置成功");
                       // }else{
                       //  Frame.Msg.error(data.errormsg);
                       // }
                       // };
                //     var oSListAP = {
                //     height:"70",
                //     showHeader: true,
                //     multiSelect: true,
                //     pageSize : 10,
                //     colNames: getRcText ("ALLAP_HEADER3"),
                //     colModel: [
                //         {name: "apName",              datatype: "String"}
                //         ,{name: "apModel",            datatype: "String"}
                //         ,{name: "apSN",               datatype: "String"}
                //         ,{name: "apGroupName",       datatype: "String"}
                //     ]
                //     // , buttons: [
                //     //     // {name: "bind", value:"绑定",enable:addblackShow,action:bind},
                //     //     {name: "unBind", value:"去绑定",enable:addblackShow},
                //     //     {name: "cancel", value:"取消", enable:true,action:cancelAll}
                //     // ]
                // };
                
                //     $("#flowdetail_listAP").SList ("head", oSListAP);
                    //$("#flowdetail_listAP").SList ("refresh");
                    //$("#TerminalInfoDlg").modal("hide");
                    Utils.Base.openDlg(null, {}, {scope:$("#TerminalInfoDlg"),className:"modal-super"});
            }
               function bindAPGroups(){
                    //    for(var i=0;i<data.length;i++){
                    //         data[i].apGroupName="是";
                    //     if(data[i].apGroupName="是"){
                    //     Frame.Msg.info("配置成功");
                    //    }else{
                    //     Frame.Msg.error(data.errormsg);
                    //    }
                    //    };

                    // $("#flowdetail_listAPGroup").SList ("refresh");
                    // $("#TerminalInfoDlg1").modal("hide");
                    $("#flowdetail_listAPGroup").SList ("resize");
                    Utils.Base.openDlg(null, {}, {scope:$("#TerminalInfoDlg1"),className:"modal-super"});
            }
            

            $("#bindAP").click(function(){
            bindAP();
            });
            $("#bindAPGroups").click(function(){
                bindAPGroups();
            })
        function delUser(oData)
            {
                        Frame.Msg.info("配置成功");
                        //var arow = $("#onlineuser_list").SList("getSelectRow")[0];
                        initData();
            }
            

            function initData(){

                function getApDataSuc(apdata){
                        var resfrsh = [];
                        $.each(apdata.apList,function(index,iDate){
                            iDate.radioList1 = showRadio(iDate.radioList);
                            iDate.status1 = aStatus[iDate.status];//返回对应的状态  “,在线,离线,正在下载版本”
                            iDate.transmit_receive_Traffic=Traffic(iDate.transmitTraffic,iDate.receiveTraffic);//返回具体数值加上一个/  例如1/1
                            iDate.onlineTime1 = onLineTime(iDate);
                            iDate.Counts = 0;
                            resfrsh.push(iDate);
                        });
                       // alert(apdata.count);
                       var shuju=[
                       {
                        "apName":"ap1",
                        "apModel":"20-12-15A",
                        "apSN":"WA2158",
                        "apGroupName":"否"
                       
                       },
                       {
                        "apName":"ap2",
                        "apModel":"20-12-15B",
                        "apSN":"WA0547",
                        "apGroupName":"否"
                       }
                       ];
                       var apGroupshuju=[
                       {
                        "apName":"apGroup1",
                        "apGroupName":"否"
                        },
                        {
                        "apName":"apGroup2",
                        "apGroupName":"否"
                        }
                       ];
                       var a = [
                       {"apName":"ap1","apSN":"固定账号认证","apModel":"fvsdvs","apGroupName":"使能","radioList":[{"radioId":1,"radioMode":"2.4G","radioStatus":0,"radioChannel":1,"radioPower":20}],"radioList1":"896","onlineTime1":"145"},
                       {"apName":"ap2","apSN":"固定账号认证","apModel":"wetgsas","apGroupName":"去使能","radioList":[{"radioId":1,"radioMode":"5G","radioStatus":0,"radioChannel":161,"radioPower":20},{"radioId":2,"radioMode":"2.4G","radioStatus":0,"radioChannel":13,"radioPower":20}],"radioList1":"694","onlineTime1":"75"}
                       ];

                        $("#onlineuser_list").SList ("extend", a);
                        $("#flowdetail_listAP").SList ("refresh", shuju);
                        $("#flowdetail_listAPGroup").SList ("refresh", apGroupshuju);
                        for(var i =0;i<resfrsh.length;i++){
                            g_oTableData[resfrsh[i].apName]=resfrsh[i];
                        }
                        // for(var i =0;i<a.length;i++){
                        //     g_detial[a[i].apName]=a[i];
                        // }
                        
                  
                }
                function getApDataFail(){
                    console.log("fail terminal fail");
                }
                var apFlowOpt = {
                    url:"/v3/apmonitor/web/aplist_page",
                    type: "GET",
                    dataType: "json",
                    data:{
                        devSN:FrameInfo.ACSN,
                    },
                    onSuccess:getApDataSuc,
                    onFailed:getApDataFail
                }
                Utils.Request.sendRequest(apFlowOpt);

                
            }




            function cancelAll(){
                $("#TerminalInfoDlg").modal("hide");//让弹窗消失的按钮
            }
             function cancelAll1(){
                $("#TerminalInfoDlg1").modal("hide");//让弹窗消失的按钮
            }
            function addblackShow(aRows)
            {
                var bAddtoBlackshow = false;
                if(aRows.length > 0)
                {
                    for(var i=0; i<aRows.length; i++)
                    {
                        if(aRows[i].isBlackUser == true)
                        {
                            return false;
                        }
                    }
                    return true;
                }
                return bAddtoBlackshow;
            }
            function rmBlackShow(aRows)
            {
                var brmBlackshow = false;
                if(aRows.length > 0)
                {
                    for(var i=0; i<aRows.length; i++)
                    {
                        if(aRows[i].isBlackUser == false)
                        {
                           return false;
                        }
                    }
                    return true;
                }
                return brmBlackshow;
            }

            function bindtoAP(data){
                       for(var i=0;i<data.length;i++){
                            data[i].apGroupName="是";
                        if(data[i].apGroupName="是"){
                        Frame.Msg.info("配置成功");
                       }else{
                        Frame.Msg.error(data.errormsg);
                       }
                       };

                    $("#flowdetail_listAP").SList ("refresh");
                    $("#TerminalInfoDlg").modal("hide");
            }
               function bindtoAPGroup(data){
                       for(var i=0;i<data.length;i++){
                            data[i].apGroupName="是";
                        if(data[i].apGroupName="是"){
                        Frame.Msg.info("配置成功");
                       }else{
                        Frame.Msg.error(data.errormsg);
                       }
                       };

                    $("#flowdetail_listAPGroup").SList ("refresh");
                    $("#TerminalInfoDlg1").modal("hide");
            }
                function unbindAP(data){
                       for(var i=0;i<data.length;i++){
                        if(data[i].apGroupName="是"){
                        data[i].apGroupName="否";
                        Frame.Msg.info("配置成功");
                       }
                       };

                    $("#flowdetail_listAP").SList ("refresh");
                    $("#TerminalInfoDlg").modal("hide");
            }
               function unbindAPGroup(data){
                       for(var i=0;i<data.length;i++){
                        if(data[i].apGroupName="是"){
                        data[i].apGroupName="否";
                        Frame.Msg.info("配置成功");
                       }
                       };

                    $("#flowdetail_listAPGroup").SList ("refresh");
                    $("#TerminalInfoDlg1").modal("hide");
            }

            function initForm(){

        
                // var oSListOptions = {//初始化表头信息，并且写出具体字段，字段值和ajax返回的值要对应上
                //     height:"70",
                //     showHeader: true,
                //     showOperation:true,
                //     multiSelect: false,
                //     pageSize : 10,
                //     colNames: getRcText ("ALLAP_HEADER2"),
                    // colModel: [
                    //     {name: "apName",              datatype: "String", width:80}
                    //     ,{name: "apModel",            datatype: "String", width:80}
                    //     ,{name: "apSN",               datatype: "String", width:80}
                    //     ,{name: "apGroupName",       datatype: "String", width:80}
                    //     ,{name: "onlineTime1",         datatype: "String", width:80}
                    //     ,{name: "radioList1",         datatype: "String", width:80}
                    // ], 
                    // buttons: [
                    //     // {name:"adds",value:"添加",action:adds},
                    //     {name:"bindAP",value:"绑定AP",action:bindAP},
                    //     {name:"bindAPGroup",value:"绑定AP组",action:bindAPGroup},
                    //     // {name:"detail",action:onViewDetial,enable:1},
                    //     // {name:"edit",action:showAddUser},
                    //     // {name:"delete",action:Utils.Msg.deleteConfirm(delUser)},
                    // ]
                // };
                //$("#onlineuser_list").SList ("head", oSListOptions);
                //$("#onlineuser_list").on('click','a.list-link',bindAP);
                $("#onlineuser_list").on('click',onDisDetail1);
                $("#view_client_form").form("init", "edit", {"title":getRcText("TERINFO"),"btn_apply": false,"btn_cancel":false});//这句话是在弹出框中加上AP列表那项
                $("#view_client_form1").form("init", "edit", {"title":getRcText("APGROUP"),"btn_apply": false,"btn_cancel":false});
                var oSListAP = {
                    height:"70",
                    showHeader: true,
                    multiSelect: true,
                    pageSize : 10,
                    colNames: getRcText ("ALLAP_HEADER3"),
                    colModel: [
                         {name: "apName",              datatype: "String"}
                        ,{name: "apModel",            datatype: "String"}
                        ,{name: "apSN",               datatype: "String"}
                        ,{name: "apGroupName",       datatype: "String"}
                    ]
                    , buttons: [
                        {name: "bind", value:"绑定",enable:addblackShow,action:bindtoAP},
                        {name: "unBind", value:"去绑定",enable:addblackShow,action:unbindAP},
                        {name: "cancel", value:"取消", enable:true,action:cancelAll}
                    ]
                };
                
                $("#flowdetail_listAP").SList ("head", oSListAP);

                var oSListAPGroup = {
                    height:"70",
                    showHeader: true,
                    multiSelect: true,
                    pageSize : 10,
                    colNames: getRcText ("ALLAP_HEADER4"),
                    colModel: [
                        {name: "apName",       datatype: "String"},
                        {name:"apGroupName" ,  datatype: "String"}
                    ]
                    , buttons: [
                        {name: "bind", value:"绑定",enable:addblackShow,action:bindtoAPGroup},
                        {name: "unBind", value:"去绑定",enable:addblackShow,action:unbindAPGroup},
                        {name: "cancel", value:"取消", enable:true,action:cancelAll1}
                    ]
                };
                
                $("#flowdetail_listAPGroup").SList ("head", oSListAPGroup);
            }

            function _init ()
            {
                g_oPara=Utils.Base.parseUrlPara();
                initForm();
                initData();
            }
            function _resize (jParent)
            {
            }

            function _destroy()
            {
                console.log("destory**************");
                Utils.Request.clearMoudleAjax(MODULE_NAME);
            }
            Utils.Pages.regModule (MODULE_NAME, {
                "init": _init,
                "destroy": _destroy,
                "resize": _resize,
                "widgets": ["Echart","Minput","SList","Form","SingleSelect"],
                "utils": ["Base", "Request"],
                
            });

        }) (jQuery);;