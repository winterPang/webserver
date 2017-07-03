(function ($)
{
    var MODULE_NAME = "h_wireless1.index";
    var g_allData;
    var g_oTableData = {};
    var i=0;
    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("wireless_rc", sRcName);

    }

    function showLink(row, cell, value, columnDef, dataContext, type)
    {
        value = value || "";

        if("text" == type)
        {
            return value;
        }
        return '<a class="list-link" cell="'+cell+'"'+' stName="'+dataContext.stName+'">'+value+'</a>';
         
    }

    function showLink1(row, cell, value, columnDef, dataContext, type)
    {
        value = value || "";

        if("text" == type)
        {
            return value;
        }

        return '<a class="list-link" cell="'+cell+'"'+' ssidName="'+dataContext.ssidName+'">'+value+'</a>'   
    }
    function onDisDetail1()
    {
        //用Slist弹出表单用如下方法即可
        // i++;
        // if(i==1){
        //     var opt = {
        //     multiSelect: false,
        //     colNames: getRcText ("WIRELESS_ITEM1"),
        //     colModel: [
        //         //{name: "FwdLocation", datatype: "String"},
        //         // {name: "acSN", datatype: "String"},
        //         // {name: "akmMode", datatype: "String"},
        //         // {name: "authLocation", datatype: "String"},
        //         // {name: "cipherSuite",datatype: "String"},
        //         // {name: "clinetCount", datatype: "Integer"},
        //         {name: "hideSSID", datatype: "Integer"},
        //         {name: "maxClients", datatype: "Integer"},
        //         {name: "maxReceiveRatio", datatype: "Integer"},
        //         {name: "maxSendRatio", datatype: "Integer"},
        //         {name: "securityIE", datatype: "Integer"},
        //         {name: "ssidName", datatype: "String"},
        //         {name: "stName", datatype: "String"},
        //         // {name: "status", datatype: "Integer"},
        //         // {name: "vlanId", datatype: "Integer"}
        //     ]
          
        // };
        // $("#flowdetail_list").SList ("head", opt);
        // }
        // var oData = $("#wireless_list").SList("getSelectRow")[0];
        //  var arr=[];
        //  for(var s in oData){
        //     arr.push(oData[s]);
        //  }
        // var data=[{
        //     hideSSID:arr[7],
        //     maxClients:arr[8],
        //     maxReceiveRatio:arr[9],
        //     maxSendRatio:arr[10],
        //     securityIE:arr[11],
        //     ssidName:arr[12],
        //     stName:arr[13],
        //     status:arr[14],
        //     vlanId:arr[15]
        //     }];
        
        //  $("#flowdetail_list").SList ("refresh", data);
        //  $("#wireless_list").on('click','a.list-link',onDisDetail1);
        // Utils.Base.openDlg(null, {}, {scope:$("#flowdetailDlg"),className:"modal-super"});
    }
    function onDisDetail()
    {
        var stName = $(this).attr("stName");
        var oData = g_oTableData[stName];
        Utils.Base.updateHtml($("#view_client_form"), oData);//这句话是在弹出框中加入数据
        Utils.Base.openDlg(null, {}, {scope:$("#TerminalInfoDlg"),className:"modal-super"});
        //Utils.Base.openDlg(null, {}, {scope:$("#flowdetailDlg"),className:"modal-super"});
    }


  
    function Fresh(){
        Utils.Base.refreshCurPage();
    }

    //---------------------------------------------------------------------------------------------------------------
    
    //--------------------------------------------------------------------------------------------------------------- 
    function initGrid(){

         function showRadio(obj)
        {
            var sRadio = (obj.length == '0')? '' : obj.length+'';
            $.each(obj,function(index,oDate){
                sRadio = sRadio +','+ oDate.radioMode+'Hz('+oDate.radioId+')';
            });
            return sRadio;
        }

        var opt1 = {
            multiSelect: false,
            colNames: getRcText ("WIRELESS_ITEM"),
            colModel: [
                {name: "stName", datatype: "String"},
                {name: "ssidName", datatype: "String",formatter:showLink},
                {name: "status", datatype: "String"},
                {name: "securityIE", datatype: "String"},
                {name: "cipherSuite", datatype: "String"},
                {name: "authLocation",datatype: "String"},
                {name: "clinetCount", datatype: "Integer"},
              //{name: "FwdLocation",datatype: "Integer"}
            ],
            buttons: [
                {name: "default", value:getRcText ("FRESH"), action: Fresh}
            ]
        };
        $("#wireless_list").SList ("head", opt1);
        $("#wireless_list").on('click','a.list-link',onDisDetail);
        //$("#wireless_list").on('click','a.list-link',onDisDetail1);
        $("#return").on('click',function(){ history.back();});
        $("#flowdetail_form").form("init", "edit", {"title":getRcText("TITLE_TERINFO"),"btn_apply": false,"btn_cancel":false});
        $("#view_client_form").form("init", "edit", {"title":getRcText("TERINFO"),"btn_apply": false,"btn_cancel":false});
        function showHideSsid(row, cell, value, columnDef, oRowData)
        {
            return value == "true" ? getRcText("ON") : getRcText("OFF");
        }
    }



    function initData(){
        function getmaxClients(obj){
            var Client=(obj.maxClients==0)?"Not configured":obj.maxClients;
            return Client;
        }
        function getmaxSendRatio(obj){
            var maxSendRatio=(obj.maxSendRatio==0)?"Not configured":obj.maxSendRatio;
            return maxSendRatio;
        }
        function getmaxReceiveRatio(obj){
            var maxReceiveRatio=(obj.maxReceiveRatio==0)?"Not configured":obj.maxReceiveRatio;
            return maxReceiveRatio;
        }
         function getWireLessDataSuc(data){
            var resfrsh = [];
            var aAUTHLOCATION = getRcText("AUTHLOCATION").split(',');//MAC,NAC,AP,Other
            var aCIPHERSUITE = getRcText("CIPHERSUITE").split(',');//Not configured,WEP40,TKIP,CCMP,TKIP/CCMP,WEP104,WEP128
            var aSECURITYIE = getRcText("SECURITYIE").split(',');//Not configured,WPA,RSN,OSEN"
            var aSTATUS= getRcText("STATUS").split(',');//,使能,去使能
            var aFWDLOCATION=getRcText("FWDLOCATION").split(',');//1-MAC,2-NAC,4-AP,8-Other
            var aHIDESSID=getRcText("HIDE_SSID").split(',');//不隐藏,隐藏
            var aMAXRECEIVERADIO=getRcText("MAXRECEIVERADIO").split(',');//0-Not configured
            var aAKMMODE=getRcText("AKMMODE").split(',');
                if('{"errcode":"Invalid request"}' == data){
                    alert(getRcText("PERMISSIONDENIED"));
                }
                else{
                    $.each(data.ssidList,function(index,iDate){
                        iDate.authLocation=aAUTHLOCATION[iDate.authLocation];
                         if(iDate.cipherSuite==128){
                            iDate.cipherSuite=aCIPHERSUITE[6];
                        }else if(iDate.cipherSuite==32){
                            iDate.cipherSuite=aCIPHERSUITE[5];
                        }else if(iDate.cipherSuite==20){
                            iDate.cipherSuite=aCIPHERSUITE[4];
                        }else if(iDate.cipherSuite==16){
                            iDate.cipherSuite=aCIPHERSUITE[3];
                        }
                        else if(iDate.cipherSuite==4){
                            iDate.cipherSuite=aCIPHERSUITE[2];
                        }
                        else if(iDate.cipherSuite==2){
                            iDate.cipherSuite=aCIPHERSUITE[1];
                        }
                        else if(iDate.cipherSuite==0){
                            iDate.cipherSuite=aCIPHERSUITE[0];
                        }
                        if(iDate.cipherSuiteStr!=null){
                            iDate.cipherSuite=iDate.cipherSuiteStr;
                        }
                        //0-Not configured, 2-WEP40, 4-TKIP, 16-CCMP, 20-TKIP/CCMP,32-WEP104,128-WEP128
                        //iDate.cipherSuite=aCIPHERSUITE[iDate.cipherSuite];
                        iDate.securityIE =aSECURITYIE[iDate.securityIE]; 
                        if(iDate.securityIEStr!=null){
                            iDate.securityIE=iDate.securityIEStr;
                        } 
                        iDate.status=aSTATUS[iDate.status];
                        // iDate.FwdLocation=aFWDLOCATION[iDate.FwdLocation];
                        if(iDate.FwdLocation==4){
                            iDate.FwdLocation=aFWDLOCATION[1];
                        }else{
                            iDate.FwdLocation=aFWDLOCATION[0];
                        }
                        iDate.hideSSID=aHIDESSID[iDate.hideSSID];                
                        iDate.maxClients=getmaxClients(iDate);
                        iDate.maxSendRatio=getmaxSendRatio(iDate);
                        iDate.maxReceiveRatio=getmaxReceiveRatio(iDate);
                         if(iDate.akmMode==128){
                            iDate.akmMode=aAKMMODE[8];
                        }else if(iDate.akmMode==64){
                            iDate.akmMode=aAKMMODE[7];
                        }else if(iDate.akmMode==32){
                            iDate.akmMode=aAKMMODE[6];
                        }else if(iDate.akmMode==16){
                            iDate.akmMode=aAKMMODE[5];
                        }else if(iDate.akmMode==8){
                            iDate.akmMode=aAKMMODE[4];
                        }else if(iDate.akmMode==4){
                            iDate.akmMode=aAKMMODE[3];
                        }else if(iDate.akmMode==2){
                            iDate.akmMode=aAKMMODE[2];
                        }else if(iDate.akmMode==1){
                            iDate.akmMode=aAKMMODE[1];
                        }else if(iDate.akmMode==0){
                            iDate.akmMode=aAKMMODE[0];
                        }
                        if(iDate.akmModeStr!=null){
                            iDate.akmMode=iDate.akmModeStr;
                        }   
                        resfrsh.push(iDate);     
                    });
                   $("#wireless_list").SList ("refresh", data.ssidList); 

                   for(var i =0;i<resfrsh.length;i++){
                    g_oTableData[resfrsh[i].stName]=resfrsh[i];
                }
                }
            }
            function getWireLessDataFail(err){
                console.log("err")
            }

            var wireLess = {
                url: MyConfig.path+"/ssidmonitor/getssidlist?devSN="+ FrameInfo.ACSN,
                type: "GET",
                dataType: "json",
                contentType: "application/json",
                onSuccess:getWireLessDataSuc,
                onFailed:getWireLessDataFail
            }
            Utils.Request.sendRequest(wireLess);
    }

    function initForm(){
        
    }

    function _init ()
    {
        initGrid();
        initForm();
        initData();
       
    }
    function _resize (jParent)
    {
    }

    function _destroy()
    {
        g_allData = null;
    }
    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["Echart","Minput","SList","Form"],
        "utils": ["Base", "Device","Request"]
    });
}) (jQuery);;