(function ($){

    var MODULE_BASE = "city_apinfo";
    var MODULE_NAME = MODULE_BASE + ".aplist";
    var MODULE_RC = "apinfo_aplist_rc";
    var g_oTableData = {};
    var SKIP=0;
    var LIMIT=100;
    function getRcText(sRcName){
        return Utils.Base.getRcString(MODULE_RC, sRcName);
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

    function showLink(row, cell, value, columnDef, dataContext, type)
    {
        value = value || "";

        if("text" == type)
        {
            return value;
        }
        return '<a class="list-link" cell="'+cell+'"'+' ApName="'+dataContext.apName+'">'+value+'</a>';        
    }

    function onDisDetail()
    {
        // var oData = $("#onlineuser_list").SList("getSelectRow")[0];
        
        //  $("#flowdetail_list").SList ("refresh", aData);
        // /* 缁勭粐濂芥暟鎹悗 */
        // Utils.Base.openDlg(null, {}, {scope:$("#flowdetailDlg"),className:"modal-super"});
        var apNames = $(this).attr("ApName");
        var oData = g_oTableData[apNames];
        // showWirelessInfo(oData);
        Utils.Base.updateHtml($("#view_client_form"), oData);
        Utils.Base.openDlg(null, {}, {scope:$("#TerminalInfoDlg"),className:"modal-super"});
    }

    // function draw(){

    function showRadio(obj)
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
    /*function Fresh(){
        return $.ajax({
            type: "GEt",
            url:MyConfig.v2path+"/syncAc?acsn="+FrameInfo.ACSN,
            dataType: "json",
            contentType: "application/json",
            success:function(data){
                if(data&&data.error_code=="0"){
                    Utils.Base.refreshCurPage();
                }else{
                    Frame.Msg.info(data.error_message);
                }
            },
            error:function(err){

            }

        })
    }*/

    function initData(){

        function getApDataSuc(apdata){
                var resfrsh = [];
                $.each(apdata.apList,function(index,iDate){
                    iDate.radioList1 = showRadio(iDate.radioList);
                    iDate.status1 = aStatus[iDate.status];
                    iDate.transmit_receive_Traffic=Traffic(iDate.transmitTraffic,iDate.receiveTraffic);
                    iDate.onlineTime1 = onLineTime(iDate);
                    resfrsh.push(iDate);
                });
               // alert(apdata.count);
                $("#onlineuser_list").SList ("extend", resfrsh);
                for(var i =0;i<resfrsh.length;i++){
                    g_oTableData[resfrsh[i].apName]=resfrsh[i];
                }
                //写判断count剩余数量，剩余数量增加
                if(apdata.count>0){
                    SKIP=SKIP+100;
                    LIMIT=100; 
                var apFlowOpt= {
                url:"/v3/apmonitor/aplist_page",
                type: "GET",
                dataType: "json",
                data:{
                    devSN:FrameInfo.ACSN,
                    skipnum:SKIP,//0
                    limitnum:LIMIT//100
                },
                onSuccess:getApDataSuc,
                onFailed:getApDataFail
                }
                
                    Utils.Request.sendRequest(apFlowOpt);
                }

        }

        function getApDataFail(){
            console.log("fail terminal fail");
        }

        var apFlowOpt = {
            url:"/v3/apmonitor/aplist_page",
            type: "GET",
            dataType: "json",
            data:{
                devSN:FrameInfo.ACSN,
                skipnum:SKIP,//0
                limitnum:LIMIT//100
            },
            onSuccess:getApDataSuc,
            onFailed:getApDataFail
        }


        Utils.Request.sendRequest(apFlowOpt);

        // function getApDataSuc(apdata){
        //     function getStaDataSuc(stadata){
        //         var resfrsh = [];
        //         $.each(apdata.apList,function(index,iDate){
        //             iDate.radioList1 = showRadio(iDate.radioList);
        //             iDate.status1 = aStatus[iDate.status];
        //             iDate.transmit_receive_Traffic=Traffic(iDate.transmitTraffic,iDate.receiveTraffic);
        //             iDate.onlineTime1 = onLineTime(iDate);//datatime(iDate.onlineTime);
        //             iDate.Counts = 0;
        //             $.each(stadata.assClientNum,function(index,sDate){
        //                 if(iDate.apName == sDate.ApName){
        //                     iDate.Counts = sDate.Count;
        //                 }
        //             });
        //             resfrsh.push(iDate);
        //         });
        //         $("#onlineuser_list").SList ("refresh", resfrsh);

        //         for(var i = 0; i < resfrsh.length; i++)
        //         {
        //             g_oTableData[resfrsh[i].apName] = resfrsh[i];
        //         }
        //     }

        //     function getStaDataFail(err){
        //         console.log("err")
        //     }

        //     var staFlowOpt = {
        //         url:"/v3/stamonitor/web/assclientcount?devSN=" + FrameInfo.ACSN,
        //         type: "GET",
        //         dataType: "json",
        //         contentType: "application/json",
        //         onSuccess:getStaDataSuc,
        //         onFailed:getStaDataFail
        //     }

        //     Utils.Request.sendRequest(staFlowOpt);
        // }
            
        // function getApDataFail(err){
        //     console.log("err")
        // }

        // var apFlowOpt = {
        //     url:"/v3/apmonitor/web/aplist?devSN=" + FrameInfo.ACSN,
        //     type: "GET",
        //     dataType: "json",
        //     contentType: "application/json",
        //     onSuccess:getApDataSuc,
        //     onFailed:getApDataFail
        // }

        // Utils.Request.sendRequest(apFlowOpt);

        // draw();
    }

    function initForm(){

        var oSListOptions = {
            height:"70",
            showHeader: true,
            multiSelect: false,
            pageSize : 10,
            colNames: getRcText ("ALLAP_HEADER2"),
            colModel: [
                {name: "apName",              datatype: "String", width:80,formatter:showLink}
                ,{name: "apModel",            datatype: "String", width:80}
                ,{name: "apSN",               datatype: "String", width:80}
                // ,{name: "macAddr",            datatype: "String", width:80}
                // ,{name: "ipv4Addr",           datatype: "String", width:80}/*zanshijiashang--hexuebin*/
                ,{name: "apGroupName",       datatype: "String", width:80}
                ,{name: "radioList1",         datatype: "String", width:80}
                // ,{name: "status1",             datatype: "String", width:50}
                // ,{name: "transmit_receive_Traffic", datatype: "String", width:60}
                // ,{name: "need_dataflow",      datatype: "String", width:50}
                ,{name: "onlineTime1",         datatype: "String", width:80}
                ,{name: "clientCount",         datatype: "String", width:80}
            ]
        };
        $("#onlineuser_list").SList ("head", oSListOptions);
        $("#onlineuser_list").on('click','a.list-link',onDisDetail);
        $("#return").on('click',function(){ history.back();});
        $("#tableForm").form("init", "edit", {"title":getRcText("TITLE_TERINFO"),"btn_apply": false,"btn_cancel":false});
        $("#view_client_form").form("init", "edit", {"title":getRcText("TERINFO"),"btn_apply": false,"btn_cancel":false});
    }

    function _init ()
    {
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
        "widgets": ["Echart","Minput","SList","Form"],
        "utils": ["Base", "Request"]
    });

}) (jQuery);;