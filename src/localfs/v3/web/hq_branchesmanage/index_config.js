(function ($)
{
    var MODULE_NAME = "hq_branchesmanage.index_config";
    var strPath = MyConfig.path + '/ant';
    var g_RowType;
    var getDevStatus = null;
    var hPending = null;
    
    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("ws_ssid_rc", sRcName);
    }

    function onOpenAddDlg()
    {
        Utils.Base.redirect ({np:"hq_branchesmanage.view_brcreate", flag:1, type:0});
    }

    function onOpenEditDlg(aData)
    {
        Utils.Base.redirect ({np:"hq_branchesmanage.view_brcreate", flag:1, type:1, name:aData[0].Br_Name});
    }

    function refreshBrList4Del()
    {
        Utils.Base.refreshCurPage();
    }

    function onDelSelect(aData)
    {
        //@c need interface
        //发送请求
        var aDelData = [];
        for (var i = 0; i < aData.length; i++)
        {
            aDelData.push({
                "acSN":FrameInfo.ACSN,
                "branchName":aData[i].Br_Name
            });
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
                "method":"DelBranch",
                "param":aDelData,
                "policy":"cloudFirst"
            }),
            onSuccess:refreshBrList4Del,
            onFailed:function()
            {
                console.log("Get ApGrpList by branch failed.");
            }
        };

        Utils.Request.sendRequest(oDataOpt);
    }

    function onSyncData()
    {
        //@c need interface
        var i = parseInt((Math.random()+1)*10);
        var aData = [];
        for (var idx = 0; idx < i; idx++)
        {
            aData.push({'Br_Name':'cacaca'+idx,'Br_Type':'本地AC','LocalManage':''});
        }
        $("#brconfig").SList ("refresh",aData);
    }

    function initGrid()
    {
        drawBrConfigList();
    }

    function checkEnable(odata){
        if(odata.length==0){
            return false;
        }else{
            return true;           
        }
    } 
    function drawBrConfigList()
    {
        var opt = {
            colNames: getRcText ("LIST_TITLE"),
            showHeader: true,
            multiSelect: true,
            showOperation:true,
            pageSize:10,
            colModel: [
                {name:'Br_Name', datatype:"String"},
                {name:'Br_Type', datatype:"String"},
                {name:'LocalManage', datatype:"String"}
            ],
            buttons:[
                {name:"br_newadd", enable:true,value:g_RowType[0],mode:Frame.Button.Mode.CREATE,action:onOpenAddDlg},
                {name:"br_delete", enable:checkEnable,value:g_RowType[1],mode:Frame.Button.Mode.DELETE,action:onDelSelect},
                {name:"br_syn", enable:true,value:g_RowType[2],mode:Frame.Button.Mode.UPDATE,action:onSyncData},
                {name:"delete",enable:true,action:onDelSelect},
                {name:"edit",enable:true,action:onOpenEditDlg}
            ]
        };
        $("#brconfig").SList ("head", opt);
        //$("#brconfig").SList ("refresh", [{'Br_Name':'cacaca','Br_Type':'本地有AC','LocalManage':''},{'Br_Name':'wawawa','Br_Type':'本地无AC','LocalManage':''}]);
    }

    function initForm()
    {

    }

    function getBrInfoSuccess(oData)
    {
        var oShowBrInfo = [];
        var atype = ['本地无AC','本地有AC','本地有AC且有独立无线服务']
        var amanage = ['无','无','有'];

        for (var i = 0; i < oData.branchList.length; i++)
        {
            oShowBrInfo.push({
                'Br_Name':oData.branchList[i].branchName,
                'Br_Type':atype[oData.branchList[i].branchType],
                'LocalManage':amanage[oData.branchList[i].branchType]
            })
        }

        $("#brconfig").SList ("refresh", oShowBrInfo);
    }

    function initData()
    {
        //@cc need interface
        var oDataOpt = {
            type:"Get",
            url:MyConfig.path+"/apmonitor/getBranchList?devSN="+FrameInfo.ACSN,
            contentType:"application/json",
            dataType:"json",
            //data:JSON.stringify(oData),
            onSuccess:getBrInfoSuccess,
            onFailed:function()
            {
                console.log("Get branchInfo failed.");
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
