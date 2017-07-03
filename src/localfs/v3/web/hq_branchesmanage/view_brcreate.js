(function ($)
{
    var MODULE_NAME = "hq_branchesmanage.view_brcreate";
    var g_bOpenType = 0  //0 for add && 1 for edit
    var g_BrType = 0;    //0-本地无AC，1-本地有AC，2-本地有AC且有独立无线服务
    var g_curBrName = "";

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("ws_ssid_rc", sRcName);
    }

    // 选择分支类型事件函数
    function changeType(e)
    {
        // var oAddApGrp = $("#form_apgrp");
        var oAddLocalAC = $("#form_loacl");
        var oAddMAp = $("#form_MAp");
        var oApgrpShow = $("#apgrp_show");

        switch (e.target.id)
        {
            case "type_apgroup":
                // oAddApGrp.removeClass("hide");
                //oApgrpShow.removeClass("hide");
                oAddLocalAC.addClass("hide");
                oAddMAp.addClass("hide");
                g_BrType = 0;
                break;

            case "type_localac":
                //oAddApGrp.removeClass("hide");
                //oApgrpShow.removeClass("hide");
                oAddMAp.addClass("hide");
                oAddLocalAC.removeClass("hide");
                g_BrType = 1;
                break;

            case "type_manageac":
                //oAddApGrp.removeClass("hide");
                //oApgrpShow.removeClass("hide");
                oAddLocalAC.removeClass("hide");
                oAddMAp.removeClass("hide");
                g_BrType = 2;
                break;

            default:
                break;
        }

        $("#apgrp_ChooseList").SList("resize");
    }
    
    function drawAPGroupList()
    {
        var opt = {
            colNames: getRcText("APGROUP_LIST"),
            showHeader: true,
            multiSelect: true,
            pageSize: 10,
            asyncPaging:true,
            onPageChange:function(pageNum,pageSize,oFilter,oSorter){
                var valueOfskipnum=(parseInt(pageNum-1))*(parseInt(pageSize));
                var valueOflimitnum=pageSize;
                
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
                    url:MyConfig.path+"/apmonitor/getApGrpDesBranch?devSN="+FrameInfo.ACSN+"&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum,
                    contentType:"application/json",
                    dataType:"json",
                    data:JSON.stringify(guoLvTiaoJian),
                    onSuccess:refreshApGrpList,
                    onFailed:function()
                    {
                        console.log("Get ApGrpList failed.");
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

                var oDataOpt = {
                    type:"POST",
                    url:MyConfig.path+"/apmonitor/getApGrpDesBranch?devSN="+FrameInfo.ACSN+"&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum,
                    contentType:"application/json",
                    dataType:"json",
                    data:JSON.stringify(guoLvTiaoJian),
                    onSuccess:refreshApGrpList,
                    onFailed:function()
                    {
                        console.log("Get ApGrpList failed.");
                    }
                };

                Utils.Request.sendRequest(oDataOpt);             
            },
            onSort:function(sName,isDesc){
                //dangqianyeshujuyoujitiao000000000000
                var valueOfskipnum=0;
                var valueOflimitnum=10;                
                var whatList=3;

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

                var oDataOpt = {
                    type:"POST",
                    url:MyConfig.path+"/apmonitor/getApGrpDesBranch?devSN="+FrameInfo.ACSN+"&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum,
                    contentType:"application/json",
                    dataType:"json",
                    data:JSON.stringify(guoLvTiaoJian),
                    onSuccess:refreshApGrpList,
                    onFailed:function()
                    {
                        console.log("Get ApGrpList failed.");
                    }
                };

                Utils.Request.sendRequest(oDataOpt);
            },  
            colModel: [
                {name:'apGroupName', datatype:"String"},
                {name:'description', datatype:"String"},
                {name:'branch', datatype:"String"}
            ]
        };

        $("#popApGrpChooseList").SList ("head", opt);
        // //test start
        // var apgroupList = [];
        // for(var i = 0; i<8; i++)
        // {
        //     apgroupList.push({
        //         'apgrp_Name':"apgroup"+i,
        //         'apgrp_Describe':"Describe"+i
        //     });
        // }

        // $("#popApGrpChooseList").SList ("refresh", apgroupList);
        // //test end
    }

// {
//     "totalCount":"Number,本地AC总数",
//     "leftCount":"Number,剩余数量",
//     "localACList":[
//         {
//             "localACName":"String,本地AC名称",
//             "localACSN":"String,本地AC序列号",
//             "description":"String,本地AC描述",
//             "branch":"String,所属分支"
//         }
//     ]
// }
    function refreshAcList(oData)
    {
        console.log(oData);
        var aShowData = [];

        for (var i = 0; i < oData.localACList.length; i++)
        {
            aShowData.push({
                "localACName":oData.localACList[i].localACName,
                "description":oData.localACList[i].description,
                "branch":oData.localACList[i].branch,
                "localACSN":oData.localACList[i].localACSN
            });

        }

        $("#popLocalAcChooseList").SList ("refresh", {data:aShowData, total:oData.totalCount});
    }

    function refreshApGrpList(oData)
    {
        console.log(oData);
        var aShowData = [];

        for (var i = 0; i < oData.apGroupList.length; i++)
        {
            aShowData.push({
                "apGroupName":oData.apGroupList[i].apGroupName,
                "description":oData.apGroupList[i].description,
                "branch":oData.apGroupList[i].branch
            });
        }

        $("#popApGrpChooseList").SList ("refresh", {data:aShowData, total:oData.totalCount});
    }

    function drawLocalAcList()
    {
        var opt = {
            colNames: getRcText("LOCALAC_LIST"),
            showHeader: true,
            //multiSelect: true,
            pageSize: 10,
            asyncPaging:true,
            onPageChange:function(pageNum,pageSize,oFilter,oSorter){
                var valueOfskipnum=(parseInt(pageNum-1))*(parseInt(pageSize));
                var valueOflimitnum=pageSize;

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

                var oDataOpt = {
                    type:"POST",
                    url:MyConfig.path+"/apmonitor/getLocalACDesBranch?devSN="+FrameInfo.ACSN+"&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum,
                    contentType:"application/json",
                    dataType:"json",
                    data:JSON.stringify({
                        "findoption":oFilter,
                        "sortoption":paiXuObject
                    }),
                    onSuccess:refreshAcList,
                    onFailed:function()
                    {
                        console.log("Get ACList failed.");
                    }
                };

                Utils.Request.sendRequest(oDataOpt);
            },  
            onSearch:function(oFilter,oSorter){
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

                var oDataOpt = {
                    type:"POST",
                    url:MyConfig.path+"/apmonitor/getLocalACDesBranch?devSN="+FrameInfo.ACSN+"&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum,
                    contentType:"application/json",
                    dataType:"json",
                    data:JSON.stringify({
                        "findoption":oFilter,
                        "sortoption":paiXuObject
                    }),
                    onSuccess:refreshAcList,
                    onFailed:function()
                    {
                        console.log("Get ACList failed.");
                    }
                };

                Utils.Request.sendRequest(oDataOpt);
            },
            onSort:function(sName,isDesc){
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

                var oDataOpt = {
                    type:"POST",
                    url:MyConfig.path+"/apmonitor/getLocalACDesBranch?devSN="+FrameInfo.ACSN+"&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum,
                    contentType:"application/json",
                    dataType:"json",
                    data:JSON.stringify({
                        "findoption":{},
                        "sortoption":paiXuObject
                    }),
                    onSuccess:refreshAcList,
                    onFailed:function()
                    {
                        console.log("Get ACList failed.");
                    }
                };

                Utils.Request.sendRequest(oDataOpt);
            },  
            colModel: [
                {name:'localACName', datatype:"String"},
                {name:'description', datatype:"String"},
                {name:'branch', datatype:"String"}
            ]
        };

        $("#popLocalAcChooseList").SList ("head", opt);

        //test start
        // var lacList = [];
        // for(var i = 0; i<8; i++)
        // {
        //     lacList.push({
        //         'LAC_Name':"Lac"+i,
        //         'LAC_Describe':"Describe"+i
        //     });
        // }

        // $("#popLocalAcChooseList").SList ("refresh", lacList);
        //test end
    }
    
    function drawWlanIdSelect()
    {
        $("#wlanidList").singleSelect("InitData",["1","2","3","4"]);
    }

    function getLocalACList()
    {
        //刷新AC列表；
        var valueOfskipnum=0;
        var valueOflimitnum=10;                

        var oDataOpt = {
            type:"POST",
            url:MyConfig.path+"/apmonitor/getLocalACDesBranch?devSN="+FrameInfo.ACSN+"&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum,
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify({
                "findoption":{},
                "sortoption":{}
            }),
            onSuccess:refreshAcList,
            onFailed:function()
            {
                console.log("Get ACList failed.");
            }
        };

        Utils.Request.sendRequest(oDataOpt);
    }

    function getApGroupsList()
    {
        var valueOfskipnum=0;
        var valueOflimitnum=10;                

        var oDataOpt = {
            type:"POST",
            url:MyConfig.path+"/apmonitor/getApGrpDesBranch?devSN="+FrameInfo.ACSN+"&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum,
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify({
                "findoption":{},
                "sortoption":{}
            }),
            onSuccess:refreshApGrpList,
            onFailed:function()
            {
                console.log("Get ApGrpList failed.");
            }
        };

        Utils.Request.sendRequest(oDataOpt);
    }

    function ApGroupChoose()
    {
        Utils.Base.openDlg(null, {}, {scope:$("#ApGrpDlg"),className:"modal-super"});
        getApGroupsList();
        $("#popApGrpChooseList").SList("resize");
    }

    function LocalAcChoose()
    {
        Utils.Base.openDlg(null, {}, {scope:$("#LocalAcDlg"),className:"modal-super"});
        getLocalACList();
        $("#popLocalAcChooseList").SList("resize");

    }
    
    function apgrpClickOK()
    {
        var aSelect = $("#popApGrpChooseList").SList("getSelectRow");
        var bCheckOk = true;

        if (g_bOpenType == 0)
        {
            for (var i = 0; i < aSelect.length; i++)
            {
                if (aSelect[i].branch != '')
                {
                    bCheckOk = false;
                    break;
                }
            }
        }
        else
        {
            for (var i = 0; i < aSelect.length; i++)
            {
                if ((aSelect[i].branch != '') && (aSelect[i].branch != g_curBrName))
                {
                    bCheckOk = false;
                    break;
                }
            }
        }

        if (bCheckOk == true)
        {
            $("#apgrp_ChooseList").SList ("refresh", aSelect);
        }
        else
        {
            Frame.Msg.info("选择的AP组已有所在分支","error");
        }

        return;
    }

    function checkCommit()
    {
        var oSendData = {};
        var aSelectApGrp = [];
        var aSelectApGrpName = [];

        if (!$('#br_Name').val())
        {
            return false;
        }

        aSelectApGrp = $("#apgrp_ChooseList").SList("getAll");

        for (var i = 0; i < aSelectApGrp.length; i++)
        {
            aSelectApGrpName.push({
                "apGroupName":aSelectApGrp[i].apGroupName
            });
        }

        //oSendData.branchType = g_BrType;
        //oSendData.branchName = $('#br_Name').val();
        //oSendData.acSN = FrameInfo.ACSN;
        oSendData.devSN = FrameInfo.ACSN;
        oSendData.configType = 0;
        oSendData.cloudModule = "apmgr";
        oSendData.deviceModule = "apmgr";
        if (g_bOpenType == 0)
        {
            oSendData.method = "AddBranch";
        }
        else
        {
            oSendData.method = "ModifyBranch";
            oSendData.policy = "cloudFirst";
        }
        oSendData.param = [{
            "acSN":FrameInfo.ACSN,
            "branchType":g_BrType,
            "branchName":$('#br_Name').val(),
            "apGroupList":aSelectApGrpName
        }]


        if (g_BrType == 1)
        {
            oSendData.param[0].localAcSN = $("#lac_Name").attr("acsn");
        }
        if (g_BrType == 2)
        {
            oSendData.param[0].localAcSN = $("#lac_Name").attr("acsn");
            //oSendData.param[0].wlanIdNum = 4;
            oSendData.param[0].wlanIdNum = parseInt($("#wlanidList").singleSelect("getSelectedData").value);
        }

        return oSendData; 
    }

// [
//     {
//         acSN:"String",
//         branchName:"String",
//         branchType:"Number,0-本地无AC，1-本地有AC，2-本地有AC且有独立无线服务",
//         localAcSN:"String",
//         wlanIdNum:"Number",
//         apGroupList:[
//             {
//                 apGroupName:"String"
//             }
//         ]
//     }
// ]

    function successRecvAddBRResp(oData)
    {
        var bCheckFlag = true;
        if (oData.communicateResult != 'success')
        {
            bCheckFlag = false;
        }
        if (oData.serviceResult != 'success')
        {
            bCheckFlag = false;
        }
        if (oData.deviceResult.length)
        {
            if (oData.deviceResult[0].result != 'success')
            {
                bCheckFlag = false;
            }
        }

        if (bCheckFlag != true)
        {
            if (g_bOpenType == 0)
            {
                Frame.Msg.info("分支创建失败","error");
            }
            else
            {
                Frame.Msg.info("分支修改失败","error");
            }
        }
        else
        {
            if (g_bOpenType == 0)
            {
                Frame.Msg.info("分支创建成功");
            }
            else
            {
                Frame.Msg.info("分支修改成功");
            }
            Utils.Base.redirect ({np:"hq_branchesmanage.index_config"});
        }
// communicateResult: "success"
// deviceResult: [{result: "success"}]
// 0: {result: "success"}
// result: "success"
// errCode: 0
// reason: ""
// result: "success"
// serviceResult: "success"   
    }

    function sendCreateReq(oSendData)
    {
        var oCreateBrOpt = {
            type:"POST",
            //url:MyConfig.path+"/ant/confmgr?devSN="+FrameInfo.ACSN+"&configType=0&cloudModule=apmgr&deviceModule=apmgr&method=AddBranch",  
            url:MyConfig.path+"/ant/confmgr",
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify(oSendData),
            onSuccess:successRecvAddBRResp,
            onFailed:function()
            {
                console.log("Send Add Br req Failed");
            }
        };

        Utils.Request.sendRequest(oCreateBrOpt);
    }

    function backToList()
    {
        Utils.Base.redirect ({np:"hq_branchesmanage.index_config"});
    }

    function conmitBackToList()
    {
        var oRet; 
        oRet = checkCommit()
        if (false == oRet)  //检验不成功 来点提示啥的
        {
            Frame.Msg.info("信息填写错误","error");
        }
        else              //校验成功
        {
            var oCheckOpt = {
                type:"Get",
                //url:MyConfig.path+"/ant/confmgr?devSN="+FrameInfo.ACSN+"&configType=0&cloudModule=apmgr&deviceModule=apmgr&method=AddBranch",  
                url:MyConfig.path+"/apmonitor/getBranchAddFlag?devSN="+FrameInfo.ACSN+"&branchName="+$('#br_Name').val(),
                contentType:"application/json",
                dataType:"json",
                //data:JSON.stringify(oSendData),
                onSuccess:function(oData)
                {
                    if (g_bOpenType == 0)
                    {
                        if (oData.addBranch == true)
                        {
                            sendCreateReq(oRet);
                        }
                        else
                        {
                            Frame.Msg.info("分支名重复","error");
                        }
                    }
                    else
                    {
                        if (oData.addBranch != true)
                        {
                            sendCreateReq(oRet);
                        }
                        else
                        {
                            Frame.Msg.info("修改出错","error");
                        }
                    }
                },
                onFailed:function()
                {
                    console.log("Send Add Br req Failed");
                }
            };

            Utils.Request.sendRequest(oCheckOpt); 
        }
    }

    function lacClickOk()
    {
        var select = $("#popLocalAcChooseList").SList("getSelectRow")[0];

        if (select.branch == '')
        {
            $("#lac_Name").val(select.localACName);
            //@CC temp
            $("#lac_Name").attr("acsn",select.localACSN);
        }
        else
        {
            Frame.Msg.info("选择的AC已有所在分支","error");
        }
    }

    function initForm()
    {
        // show apgroup list
        $("#apgroup_btn").on("click", ApGroupChoose);

        // show local ac list
        $("#localac_btn").on("click", LocalAcChoose);

        // 选择分支类型点击函数
        $("#Type_Choose").on("change", changeType);

        // 选择AP组确定函数
        $("#apgroup_choosed").on("click", apgrpClickOK);

        $("#bradd_close").on("click", backToList);

        $("#bradd_ok").on("click", conmitBackToList);

        $("#Lac_ok").on("click", lacClickOk);
    }

    function drawShowApgrpList()
    {
        var opt = {
            colNames: getRcText ("APGROUP_LIST"),
            colModel: [
                {name:'apGroupName', datatype:"String"},
                {name:'description', datatype:"String"},
                {name:'branch', datatype:"String"}
            ]
        };
        $("#apgrp_ChooseList").SList ("head", opt);
        // $("#apgrp_ChooseList").SList ("refresh", [{'apgrp_Name':'cacaca','apgrp_Describe':'本地AC','apgrp_Br':''}]);
    }

    function initGrid()
    {
        var oTitle = $("#F_title");
        if (g_bOpenType == 0)
        {
            oTitle.html(getRcText ("ADD_TITLE"));
        }
        else
        {
            $("#br_Name").attr("disabled","disabled");
            $("#localac_btn").addClass("hide");
            $("input[type='radio']").attr("disabled","disabled");
            $("#wlanidList").singleSelect("disable");
            oTitle.html(getRcText ("EDIT_TITLE"));
        }

        drawAPGroupList();
        drawLocalAcList();
        drawWlanIdSelect();
        drawShowApgrpList();
    }

    function refreshBrForm(oData)
    {
        var oAddLocalAC = $("#form_loacl");
        var oAddMAp = $("#form_MAp");
        var oApgrpShow = $("#apgrp_show");
        $("#type_apgroup").removeAttr("checked");
        $("#br_Name").val(oData.branchName);
        g_BrType = oData.branchType;
        switch (oData.branchType)
        {
            case 0:
                // oAddApGrp.removeClass("hide");
                //oApgrpShow.removeClass("hide");
                oAddLocalAC.addClass("hide");
                oAddMAp.addClass("hide");
                $("#type_apgroup").attr("checked", "checked");
                break;

            case 1:
                //oAddApGrp.removeClass("hide");
                //oApgrpShow.removeClass("hide");
                oAddMAp.addClass("hide");
                oAddLocalAC.removeClass("hide");
                $("#type_localac").attr("checked", "checked");
                $("#lac_Name").val(oData.localACName);
                $("#lac_Name").attr("acsn",oData.localAcSN);
                break;

            case 2:
                //oAddApGrp.removeClass("hide");
                //oApgrpShow.removeClass("hide");
                oAddLocalAC.removeClass("hide");
                oAddMAp.removeClass("hide");
                $("#type_manageac").attr("checked", "checked");
                $("#lac_Name").val(oData.localACName);
                $("#lac_Name").attr("acsn",oData.localAcSN);
                $("#wlanidList").singleSelect("value", oData.Number);
                break;

            default:
                break;
        }

        var aShowData = [];
        for (var i = 0; i < oData.apGroupList.length; i++)
        {
            aShowData.push({
                "apGroupName":oData.apGroupList[i].apGroupName,
                "description":oData.apGroupList[i].description,
                "branch":oData.branchName

            });
        }
        $("#apgrp_ChooseList").SList("refresh", aShowData);
        g_curBrName = oData.branchName;
    }

    function initData(oPara)
    {
        if (g_bOpenType == 0)
        {
            return;
        }
        //@c need interface
        var Opt = {
            type:"Get",
            //url:MyConfig.path+"/ant/confmgr?devSN="+FrameInfo.ACSN+"&configType=0&cloudModule=apmgr&deviceModule=apmgr&method=AddBranch",  
            url:MyConfig.path+"/apmonitor/getBranchInfoByBranch?devSN="+FrameInfo.ACSN+"&branchName="+oPara.name,
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify({}),
            onSuccess:refreshBrForm,
            onFailed:function()
            {
                console.log("Send Add Br req Failed");
            }
        };

        Utils.Request.sendRequest(Opt);
    }

    function _init ()
    {
        var oParse;
        oParse = Utils.Base.parseUrlPara();

        g_bOpenType = oParse.type;
        g_BrType = 0;
        initForm();
        initGrid();
        initData(oParse);
    }

    function _resize(jParent)
    {
    }

    function _destroy()
    {
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