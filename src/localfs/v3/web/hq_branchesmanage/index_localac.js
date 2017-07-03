(function ($)
{
    var MODULE_NAME = "hq_branchesmanage.index_localac";
    var g_RowType;
    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("ws_ssid_rc", sRcName);
    }

    function onOpenAddDlg()
    {
        Utils.Base.openDlg("hq_branchesmanage.view_localac", {}, {scope:$("#maoxian"),className:"modal modal-super"});        //scope:$("#cc"),className:"modal-super"
    }

    function jumpACEdit(oAcInfo)
    {
        $('#Lac_Name').val(oAcInfo[0].localACName).attr("oldACName", oAcInfo[0].localACName);
        $('#Lac_SN').val(oAcInfo[0].localACSN).attr("oldACSN", oAcInfo[0].localACSN);
        $('#modeSelect_v').singleSelect("value",oAcInfo[0].localACModel);
        //$('#br_Ip').val(oAcInfo[0].Lac_IP);
        Utils.Base.openDlg(null, {}, {scope:$("#AddLacDlg"),className:"modal-super"});
    }

    function lacStatus(row, cell, value, columnDef, dataContext, type)
    {
        if(!value)
        {
            return "";
        }
        if("text" == type)
        {
            return value;
        }
        switch(cell)
        {
            case  0:
            {
                var titletest = getRcText("DEV_STATUS").split(',')[2];
                if(dataContext["Status"] == 1)
                {
                    titletest = getRcText("DEV_STATUS").split(',')[0];
                    return "<p class='list-link float-left' type='0'>"+dataContext["localACName"]+"</p><p title='"+titletest+"' class='index_icon_url version_icon icon_online'></p>";
                    //return dataContext["Name"];
                }else if(dataContext["Status"] == 2){
                    titletest = getRcText("DEV_STATUS").split(',')[1];
                    return "<p class='list-link float-left' type='0'>"+dataContext["localACName"]+"</p><p title='"+titletest+"' class='index_icon_url version_icon icon_offline'></p>";
                }
                
                return "<p class='list-link float-left' type='0'>"+dataContext["localACName"]+"</p><p title='"+titletest+"' class='index_icon_url version_icon icon_download'></p>";
                break;
            }
            default:
                break;
        }
        return false;
    }

    function refreshACList(oData)
    {
        var aShowData = [];

        for (var i = 0; i < oData.localACList.length; i++)
        {
            var oACData = oData.localACList[i];
            aShowData.push({
                "localACName":oACData.localACName,
                "localACSN":oACData.localACSN,
                "localACModel":oACData.localACModel,
                "ipv4Addr":oACData.ipv4Addr,
                "Status":oACData.status
            });
        }

        $("#localac_list").SList("refresh", {data:aShowData, total:oData.totalCount});
    }
// {
//     "totalCount":"Number,本地AC总数",
//     "leftCount":"Number,剩余数量",
//     "localACList":[
//         {
//             "localACName":"String,本地AC名称",
//             "localACSN":"String,本地AC序列号",
//             "localACModel":"String,本地AC型号",
//             "status":"Number,本地AC状态,0-离线,1-在线,2-版本下载",
//             "ipv4Addr":"String,本地ACIPV4地址",
//             "ipv6Addr":"String,本地ACIPV6地址",
//             "controlIpv4Addr":"String,控制ACIPV4地址",
//             "controlIpv6Addr":"String,控制ACIPV6地址",
//             "location":"String,归属地，可能是未知的",
//             "cntAPCount":"Number,关联AP数量",
//             "onlineTime":"Number,在线时长",
//             "runTime":"Number,本地AC设备运行时长",
//             "bootVersion":"Number,boot版本号",
//             "softVersion":"Number,版本号"
//         }
//     ]
// }
// [
//     {
//         acSN:"String",
//         localACSN:"String"
//     }
// ]

    function refreshACList4Del(oData)
    {
        var bCheckFlag = true;
        if (oData.communicateResult != "success")
        {
            bCheckFlag = false;
        }
        // if (oData.deviceResult[0].result != "success")
        // {
        //     bCheckFlag = false;
        // }
        if (oData.result != "success")
        {
            bCheckFlag = false;
        }
        if (oData.serviceResult != "success")
        {
            bCheckFlag = false;
        }
        if (bCheckFlag = true)
        {
            Frame.Msg.info("删除AC成功");
        }
        else
        {
            Frame.Msg.info("删除AC失败","error");
        }
        onSyncAC();
        //Utils.Base.refreshCurPage();
    }

    function sendDelACmsg(oData)
    {
            //     "list":[
    //         {
    //             "localACSN":"String，本地AC序列号",
    //             "isBelongBranch":"BOOL，true表示本地AC有所属分支，false表示本地AC无分支"
    //         }
    //     ]
    // }
        var aData = oData.list;
        var errFlag = false;
        //发送请求
        var aDelData = [];
        for (var i = 0; i < aData.length; i++)
        {
            if (aData[i].isBelongBranch == true)
            {
                errFlag = true;
                continue;
            }
            aDelData.push({
                "acSN":FrameInfo.ACSN,
                "localACSN":aData[i].localACSN
            });
        }

        if (errFlag == true)
        {
            Frame.Msg.info("AC有所属分支","error");
        }

        if (aDelData.length == 0)
        {
            return;
        }

        var oDataOpt = {
            type:"POST",
            url:MyConfig.path+"/ant/confmgr",
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify({
                "devSN":FrameInfo.ACSN,
                "configType":0,
                "cloudModule":"apmgr",
                "deviceModule":"apmgr",
                "method":"DelLocalAC",
                "param":aDelData
            }),
            onSuccess:refreshACList4Del,
            onFailed:function()
            {
                console.log("Get ApGrpList by branch failed.");
            }
        };

        Utils.Request.sendRequest(oDataOpt);
    }

    function onDelSelect(aData)
    {
    //     /apmonitor/getLocalACDeleteFlag
    //     {
    //         localACSNList:[
    //             {
    //                 localAC:String，本地AC序列号
    //             }
    //         ]       
    //     }

    //     {
    //     "list":[
    //         {
    //             "localACSN":"String，本地AC序列号",
    //             "isBelongBranch":"BOOL，true表示本地AC有所属分支，false表示本地AC无分支"
    //         }
    //     ]
    // }
        var aDelData = [];
        for (var i = 0; i < aData.length; i++)
        {
            aDelData.push({
                "localACSN":aData[i].localACSN
            });
        }

        var oDataOpt = {
            type:"POST",
            url:MyConfig.path+"/apmonitor/getLocalACDeleteFlag?devSN="+FrameInfo.ACSN,
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify({
                "localACSNList":aDelData
            }),
            onSuccess:sendDelACmsg,
            onFailed:function()
            {
                console.log("check Local ac failed.");
            }
        };

        Utils.Request.sendRequest(oDataOpt);

    }

    function checkEnable(odata){
        if(odata.length==0){
            return false;
        }else{
            return true;           
        }
    } 

    function onSyncAC()
    {
        var oDataOpt = {
            type:"POST",
            url:MyConfig.path+"/ant/confmgr",
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify({
                "devSN":FrameInfo.ACSN,
                "configType":0,
                "cloudModule":"apmgr",
                "deviceModule":"apmgr",
                "method":"SyncLocalAC",
                "param":[{}]
            }),
            onSuccess:function()
            {
                Utils.Base.refreshCurPage();
                console.log("hahahahaha")
            },
            onFailed:function()
            {
                console.log("check Local ac failed.");
            }
        };

        Utils.Request.sendRequest(oDataOpt);
    }

    function drawLacConfigList()
    {
        var opt = {
            colNames: getRcText ("LOACLAC_TITLE"),
            showHeader: true,
            multiSelect: true,
            showOperation:true,
            asyncPaging:true,
            pageSize:10,
            onPageChange:function(pageNum,pageSize,oFilter,oSorter){
                var valueOfskipnum=(parseInt(pageNum-1))*(parseInt(pageSize));
                var valueOflimitnum=pageSize;

                var oFilterOpt={};
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

                var oDataOpt = {
                    type:"POST",
                    url:MyConfig.path+"/apmonitor/getLocalACList?devSN="+FrameInfo.ACSN+"&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum,
                    contentType:"application/json",
                    dataType:"json",
                    data:JSON.stringify(guoLvTiaoJian),
                    onSuccess:refreshACList,
                    onFailed:function()
                    {
                        console.log("Get AC list failed.");
                    }
                };

                Utils.Request.sendRequest(oDataOpt);
            },  
            onSearch:function(oFilter,oSorter){
                //dangqianyeshujuyoujitiao000000000000
                var valueOfskipnum=0;
                var valueOflimitnum=10;
                
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
                var oDataOpt = {
                    type:"POST",
                    url:MyConfig.path+"/apmonitor/getLocalACList?devSN="+FrameInfo.ACSN+"&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum,
                    contentType:"application/json",
                    dataType:"json",
                    data:JSON.stringify(guoLvTiaoJian),
                    onSuccess:refreshACList,
                    onFailed:function()
                    {
                        console.log("Get AC list failed.");
                    }
                };

                Utils.Request.sendRequest(oDataOpt);
            },
            onSort:function(sName,isDesc){
                //dangqianyeshujuyoujitiao000000000000
                var valueOfskipnum=0;
                var valueOflimitnum=10;                

                //升序1、降序-1
                var shunxu=isDesc;
                if(shunxu==true){
                    shunxu=-1;
                }else if(shunxu==false){
                    shunxu=1;
                }else{
                    console.log('here is try catch.');
                }

                //sortoption对象，如下                
                var paiXuObject={};
                paiXuObject[sName]=shunxu;

                //requestBody,如下
                var guoLvTiaoJian={"findoption":{},"sortoption":paiXuObject};

                //发送请求
                var oDataOpt = {
                    type:"POST",
                    url:MyConfig.path+"/apmonitor/getLocalACList?devSN="+FrameInfo.ACSN+"&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum,
                    contentType:"application/json",
                    dataType:"json",
                    data:JSON.stringify(guoLvTiaoJian),
                    onSuccess:refreshACList,
                    onFailed:function()
                    {
                        console.log("Get AC list failed.");
                    }
                };

                Utils.Request.sendRequest(oDataOpt);
            },     
            colModel: [
                {name:'localACName', datatype:"String", formatter:lacStatus},
                {name:'localACSN', datatype:"String"},
                {name:'localACModel', datatype:"String"},
                {name:'ipv4Addr', datatype:"String"}
            ],
            // onToggle : {
            //     action : jumpACEdit,
            //     jScope : $("#AddLacForm"),
            //     //BtnDel : {
            //         //show : true,
            //         //action : onDelChat
            //     //}
            // },
            buttons:[
                {name:"Lac_newadd", enable:true,value:g_RowType[0],mode:Frame.Button.Mode.CREATE,action:onOpenAddDlg}, //
                {name:"Lac_delete", enable:checkEnable,value:g_RowType[1],mode:Frame.Button.Mode.DELETE,action:onDelSelect},
                {name:"Lac_syn", enable:true,value:g_RowType[2],mode:Frame.Button.Mode.UPDATE,action:onSyncAC},
                {name:"delete",enable:true,action:onDelSelect},
                {name:"edit",enable:true,action:jumpACEdit}
            ]
        };
        $("#localac_list").SList ("head", opt);
    }

    function initGrid()
    {
        drawLacConfigList();
    }

    function modifyResp(oData)
    {
        // setTimeout(function(){
        //     console.log("hahahahahahahahahahahahahahahahahahahahahaha");
        //     onSyncAC();
        // },10);
        onSyncAC();
    }

    function submitEdit()
    {
        // $('#Lac_Name').val(oAcInfo[0].localACName).attr("oldACName", oAcInfo[0].localACName);
        // $('#Lac_SN').val(oAcInfo[0].localACSN).attr("oldACSN", oAcInfo[0].localACSN);
        var oSendBody = {
            'devSN':FrameInfo.ACSN,
            'configType':0,
            'cloudModule':'apmgr',
            'deviceModule':'apmgr',
            'method':'ModifyLocalAC',
            'param':[
                {
                    'oldName':$('#Lac_Name').attr('oldACName'),
                    'oldSN':$('#Lac_SN').attr('oldACSN'),
                    'newName':$('#Lac_Name').val(),
                    'newSN':$('#Lac_SN').val()
                }
            ]

        }
        var oDataOpt = {
            type:"POST",
            url:MyConfig.path+"/ant/confmgr",
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify(oSendBody),
            onSuccess:modifyResp,
            onFailed:function()
            {
                console.log("Get AC list failed.");
            }
        };

        Utils.Request.sendRequest(oDataOpt);
        Utils.Pages.closeWindow(Utils.Pages.getWindow($("#AddLacForm")));
    }

    function initForm()
    {
        $("#AddLacForm").form("init", "edit", {title : getRcText("EDITLAC_TITLE"),"btn_apply": submitEdit});
        $("#modeSelect_v").singleSelect("InitData",["ICG3000","ICG5000","MSR26-30","MSR2600","MSR36-10","MSR36-20","MSR36-40","MSR36-60","MSR3600","MSR3620","MSR8100","MSR810P10","S5560","WX2510H","WX2510H-F","WX2540H","WX2540H-F","WX2560H","WX3010E","WX3010H-L","WX3010H-X","WX3024E","WX3024H-L","WX3510H","WX3520H","WX3520H-F","WX3540H","WX5510E"]);
    }

    function initData()
    {               
        var oDataOpt = {
            type:"POST",
            url:MyConfig.path+"/apmonitor/getLocalACList?devSN="+FrameInfo.ACSN+"&skipnum=0&limitnum=10",
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify({"findoption":{},"sortoption":{}}),
            onSuccess:refreshACList,
            onFailed:function()
            {
                console.log("Get AC list failed.");
            }
        };

        Utils.Request.sendRequest(oDataOpt);
    }

    function _init ()
    {
        g_RowType = getRcText("EDIT_TITLE").split(",");
        initForm();
        initGrid();
        initData();
    }

    function _resize(jParent)
    {
    }

    function _destroy()
    {
        g_RowType = null;
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }
    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["SList","Form","SingleSelect"],
        "utils": ["Request","Base"],

    });

}) (jQuery);