(function ($){

    var MODULE_BASE = "p_apgroup";
    var MODULE_NAME = MODULE_BASE + ".index";
    var MODULE_RC = "apinfo_aplist_rc";
    var g_oTableData = {};
    var g_jForm;
    var SKIP=0;
    var LIMIT=5;
    var aModel,apGroupName,sDescription;
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

    function showLink9(row, cell, value, columnDef, dataContext, type)
    {
        value = value || "";

        if("text" == type)
        {
            return value;
        }

        var apGroupName = dataContext.ApGroupName;
        return '<a class="list-link" cell="'+cell+'"'+' ApGroupName="'+apGroupName+'">'+value+'</a>';        
    }

    function addblackShow(aRows) {
        
    }

    function bindAP(data) {
        
    }

     function unbindAPGroup(data) {
       
    }

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
                ((num.status == 2)? aStatus[num.status] : getRcText("ALOAD"));
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

    function onDisDetail9(data) {

        var ApGroupName = $(this).attr("ApGroupName");

        var oUrlPara = {
            np: MODULE_BASE + ".aplist",              
            ApGroupName:ApGroupName
        };
        Utils.Base.redirect(oUrlPara);
    }

    function initData(){
//-----------------------------------------------------------------------刷新ap組
        function getApCountSuc(data){
            // console.log(data);
            $("#onlineuser_list").SList ("refresh", data.apList);
        }

        function getApCountFail(data){

        }

        var apFlowOpt = {
            url:"/v3/apmonitor/getApCountAndDescByGroup",
            type: "GET",
            dataType: "json",
            data:{
                devSN:FrameInfo.ACSN,
            },
            onSuccess:getApCountSuc,
            onFailed:getApCountFail
        }

        Utils.Request.sendRequest(apFlowOpt);
    }

//------------------------------------------------------------------------------通过ap型号匹配的ap 所调用的函数
    function initDLData(pageNum, valueOfskipnum, valueOflimitnum, postOfData){        
        function getApModelSuc(data){
                // console.log(data);
            // $.each(data.apList,function(index,iDate){
               $("#onlineuser_list7").SList ("refresh",{total:data.totalCount,pageNum:pageNum,data:data.apList});
            // });
        }
        function getApModelFail(err){
            
        }            
        var url=MyConfig.path+"/apmonitor/getApListPageByModel?devSN="+FrameInfo.ACSN;
        var requestData ="&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum;
        url=url+requestData;
        var ApModelList = {
            type:"POST",
            url:url,
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify(postOfData),
            onSuccess:getApModelSuc,
            onFailed:getApModelFail
        };

        Utils.Request.sendRequest(ApModelList);
    }
//----------------------------------------------------------------添加AP組
    //--------------------------------------------AP型号接口-mselect
    function onAddSSID(oRowdata, sName){
        $("#pagetoggle_form .response-block").show();
        function getApModelSuc(data){
            // console.log(data);
            var resfrsh = [];
            // var apmodel = "";
            $.each(data.apModelList,function(index,iDate){
                apmodel= iDate.apmodel;
                resfrsh.push(apmodel);
            });
            $("#ModelName",g_jForm).mselect("InitData",resfrsh);
        }

        function getApModelFail(){

        }
        var apModelOpt = {
            url:"/v3/apmonitor/getapmodellist",
            type: "GET",
            dataType: "json",
            data:{
                devSN:FrameInfo.ACSN,
            },
            onSuccess:getApModelSuc,
            onFailed:getApModelFail
        }

        Utils.Request.sendRequest(apModelOpt);   


        function onCancel()
        {
            jFormSSID.form("updateForm",oRowdata);
            $("input[type=text]",jFormSSID).each(function(){
                Utils.Widget.setError($(this),"");
            });
            return false;
        }
        // $(".custom").show();
        function onSubmitSSID()
        {
            apGroupName = $("#themeName",g_jForm).val();
            sDescription = $("#description",g_jForm).val();
            aModel = $("#ModelName",g_jForm).mselect("value");
            var aGpN = /^[0-9a-zA-Z_\[\]\/-]+$/.test(apGroupName);
            if(aGpN){
                function creatGroupSuc(aData){
                    // console.log(aData);
                    if ((aData.communicateResult=="success") && (aData.errCode == 0))
                    {
                        function AddGroupDescriptionSuc(descData){
                            // console.log(descData);
                            if ((descData.communicateResult=="success") && (descData.errCode == 0))
                            {
                                
                                var param = [];
                                for (var i = 0; i < aModel.length; i++) {
                                    var apModel = {
                                        apGroupName : aData.deviceResult[0].apGroupName,
                                        apModel:aModel[i]
                                    }
                                    param.push(apModel);
                                }
                                // console.log(param);
                                function addGroupModelSuc(data){
                                    // console.log(data);
                                    if ((data.communicateResult=="success") && (data.errCode == 0))
                                    {
                                        $(".custom").hide();                                    
                                        $("#pagetoggle_form .response-block").hide();
                                        $("#pagetoggle_form .page-row").show();
                                        $("#AddPageTempDlg").css({margin:"-240.5px 0 0 -480.5px"});
                                        $("a.btn-apply").hide();
                                        $(".select2-chosen")[0].innerHTML = getRcText("SELECT");
                                        var pageNum = 1;
                                        var postOfData = {
                                            findoption: {},
                                            sortoption: {}
                                        }
                                        var apModelList = [];
                                        for (var i = 0; i < aModel.length; i++) {
                                            var param = {
                                                apModel:aModel[i]
                                            }
                                            apModelList.push(param);
                                        }
                                        postOfData.apModelList = apModelList;
                                        initDLData(pageNum, SKIP, LIMIT, postOfData);

                                    }else{
                                        Frame.Msg.info(getRcText("ADDGROUPMODEL_FAIL"), "error");
                                        return ;
                                    }
                                    
                                }
                                function addGroupModelFail(){
                                    // Frame.Msg.info(getRcText("DEL_FAIL"), "error");
                                    // return ;
                                }
                                var addGroupModelOpt = {
                                    type: "POST",
                                    url: MyConfig.path + "/ant/confmgr",
                                    dataType: "json",
                                    contentType: "application/json",
                                    data: JSON.stringify({
                                        devSN: FrameInfo.ACSN,
                                        configType: 0,
                                        cloudModule: "apmgr",
                                        deviceModule: "apmgr",
                                        method: "AddApGroupModel",
                                        param : param
                                    }),
                                    onSuccess:addGroupModelSuc,
                                    onFailed:addGroupModelFail
                                }
                                Utils.Request.sendRequest(addGroupModelOpt);
                            }else{
                                Frame.Msg.info(getRcText("ADDGROUPDESCRIPTION_FAIL"), "error");
                                return ;
                            }
                        }
                        function AddGroupDescriptionFail(){

                        }
                        var AddGroupDescriptionOpt = {
                            type: "POST",
                            url: MyConfig.path + "/ant/confmgr",
                            dataType: "json",
                            contentType: "application/json",
                            data: JSON.stringify({
                                devSN: FrameInfo.ACSN,
                                configType: 0,
                                cloudModule: "apmgr",
                                deviceModule: "apmgr",
                                method: "AddGroupDescription",
                                param: [{
                                    acSN: FrameInfo.ACSN,
                                    apGroupName : apGroupName,
                                    groupDescription : sDescription
                                }]
                                // param : param
                            }),
                            onSuccess:AddGroupDescriptionSuc,
                            onFailed:AddGroupDescriptionFail
                        }
                        Utils.Request.sendRequest(AddGroupDescriptionOpt);
                    }else{
                        Frame.Msg.info(getRcText("CREATEGROUP_FAIL"), "error");
                        return ;
                    }             
                }

                function creatGroupFail(){

                }

                var creatGroupOpt = {
                    type: "POST",
                    url: MyConfig.path + "/ant/confmgr",
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify({
                        devSN: FrameInfo.ACSN,
                        configType: 0,
                        cloudModule: "apmgr",
                        deviceModule: "apmgr",
                        method: "CreateApGroup",
                        param: [{
                            // acSN: FrameInfo.ACSN,
                            apGroupName : apGroupName,
                            // groupDescription : sDescription
                        }]
                    }),
                    onSuccess:creatGroupSuc,
                    onFailed:creatGroupFail
                }
                Utils.Request.sendRequest(creatGroupOpt);
            }else{
                $(".custom").show();
            }
        }

        function onSubmitEditPageModel()
        {
            var themetemplateModifyOpt = {
                type: "POST",
                url: v2path+"/themetemplate/modify",
                //username: username,
                //password: password,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify({
                    "ownerName":FrameInfo.g_user.attributes.name,
                    "themeName": $("#themeName").val(),
                    "description": $("#description").val(),
                }),
                onSuccess: themetemplateModifySuc,
                onFailed: themetemplateModifyFail
            }

            function themetemplateModifySuc(data){
                Utils.Base.refreshCurPage();
                Frame.Msg.info(getRcText("SUCCESS"));
            }

            function themetemplateModifyFail(){
                // console.log("fail3");
            }

            Utils.Request.sendRequest(themetemplateModifyOpt);
        }
        var jFormSSID = $("#pagetoggle_form");
        var pageName = sName;

        if(pageName == "add") //Add
        {
            var jDlg = $("#AddPageTempDlg");
            $("#themeName",jFormSSID).attr("readonly",false);
            // $($(".col-sm-6 .form-group .col-sm-9",jFormSSID)[2]).addClass("hide");
            if(jDlg.children().length)
            {

                $("#pageToggle").show().insertAfter($(".modal-header",jDlg));
            }
            else
            {
                $("#pageToggle").show().appendTo(jDlg);
            }

            jFormSSID.form("init", "edit", {"title":getRcText("ADDPAGE_TITLE"),"btn_apply": onSubmitSSID,"btn_cancel":false});
            //清空默认配置
            jFormSSID.form("updateForm",{
                themeName:"",
                description:"",
                pagemodel:"1"
            });
            $("input[type=text]",jFormSSID).each(function(){
                Utils.Widget.setError($(this),"");
            });
            Utils.Base.openDlg(null, {}, {scope:jDlg,className:"modal-super"});
//-------------修改确定按钮，把确定改为下一步 
            if($("a.btn-apply")[0].text == getRcText ("SURE_BTN")){
                $("a.btn-apply")[0].innerHTML = getRcText ("NEXT_BTN")
            }
//-------------点击右上角的 X 时所执行的操作
            $("#AddPageTempDlg").on("click", "[class='close']", function() {
                $("#pagetoggle_form .response-block").hide();
                $("#pagetoggle_form .page-row").hide();
                $("#Model_selected").empty();
                $(".select2-chosen")[0].innerHTML = getRcText("SELECT");
                $(".custom").hide();
            })
        }
        else //Edit
        {
            $($(".col-sm-6 .form-group .col-sm-9",jFormSSID)[2]).removeClass("hide");
            jFormSSID.form ("init", "edit", {"btn_apply": onSubmitEditPageModel, "btn_cancel":onCancel});
            $("#themeName",jFormSSID).attr("readonly",true);
            jFormSSID.form("updateForm",oRowdata);
            $("input[type=text]",jFormSSID).each(function(){
                Utils.Widget.setError($(this),"");
            });
        }
    }


    function deleteSSID(oData){
        // console.log(oData);
        var state = true;
        var param = [];
        $.each(oData,function(index,oDatas){
            if(oDatas.ApCount>0){
                state = false;
                Frame.Msg.info(getRcText("DELAP_FAIL"), "error");
                return false ;
            }else{
                oDataOfName = {};
                oDataOfName.apGroupName = oDatas.ApGroupName;
                param.push(oDataOfName);
            }            
        });
        if (!state) {
            return ;
        }
        function deleteSSIDSuc(data)
        {
            // console.log(data);
            if ((data.communicateResult=="success") && (data.errCode == 0))
            {
                Frame.Msg.info(getRcText ("DELETEOFSUC"));
                Utils.Base.refreshCurPage();
            }else{
                Frame.Msg.info(getRcText("DEL_FAIL"), "error");
                return ;
            }
        }

        function deleteSSIDFail(err)
        {
            console.log(err);
        }
        var deleteSSIDOpt = {
            type: "POST",
            url: MyConfig.path + "/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                configType: 0,
                cloudModule: "apmgr",
                deviceModule: "apmgr",
                method: "DelApGroup",
                param:param
                //  [{
                //     apGroupName : oData[0].ApGroupName,

                // }]
            }),
            onSuccess:deleteSSIDSuc,
            onFailed:deleteSSIDFail
        }

        Utils.Request.sendRequest(deleteSSIDOpt);
    }

    //------------------------------------------------------隱藏的入組接口

    function addGroup(ApNameData){
        var param = [];
        $.each(ApNameData,function(index,everyOfData){
            var obj = {
                apGroupName : apGroupName,
                optType: "0"
            }
            obj.info = everyOfData.apName
            param.push(obj);
        });
        function addGroupSuc(data)
        {
            // console.log(data);
            if ((data.communicateResult=="success") && (data.errCode == 0))
            {
                Frame.Msg.info(getRcText ("ADDGROUPOFSUC"));
                Utils.Pages.closeWindow(Utils.Pages.getWindow( $("#pagetoggle_form")));
                $("#pagetoggle_form .response-block").hide();
                $("#pagetoggle_form .page-row").hide();
                $("#Model_selected").empty();
                // initData();
                // Utils.Base.refreshCurPage();
            }else{
                Frame.Msg.info(getRcText("ADDGROUP_FAIL"), "error");
                return ;
            }
        }

        function addGroupFail(err)
        {
            console.log(err);
        }
        var addGroupOpt = {
            type: "POST",
            url: MyConfig.path + "/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                configType: 0,
                cloudModule: "apmgr",
                deviceModule: "apmgr",
                method: "AddApToGroup",
                param: param
                // [{
                //     // stName: oData[0].sp_name
                //     apGroupName : apGroupName,
                //     optType: "0", 
                //     info: ApNameData[0].apName
                // }]
            }),
            onSuccess:addGroupSuc,
            onFailed:addGroupFail
        }

        Utils.Request.sendRequest(addGroupOpt);
    }

    function mulOfTrue(odata){
        if(odata.length==0){
            return false;
        }else{
            return true;           
        }
    }
    function addGroupOfTrue(addGroupOfData){
        if(addGroupOfData.length==0){
            return false;
        }else{
            return true;           
        }
    }
    function synSSID() {
        // alert("异步请求成功");
        // $.ajax({
        //     type: "get",
        //     url: MyConfig.v2path + "/syncAc?acsn=" + FrameInfo.ACSN,
        //     dataType: "json",
        //     contentType: "application/json",
        //     success: function(data) {
        //         if (data && data.error_code == "0") {

        //             Utils.Base.refreshCurPage();
        //         } else {
        //             Frame.Msg.info("同步失败", "error");
        //         }
        //     },
        //     error: function(err) {

        //     }

        // })
        function SyncAPGroupSuc(sucOfData){
            console.log(sucOfData);
            if((sucOfData.communicateResult=="success") && (sucOfData.errCode == 0))
            {
                Frame.Msg.info(getRcText ("SYNOFSUC"));
                Utils.Base.refreshCurPage();
            }else{
                Frame.Msg.info(getRcText("SYN_FAIL"), "error");
                return ;
            }
        }

        function SyncAPGroupFail(errOfData){

        }

        var SyncAPGroupOpt = {
            type: "POST",
            url: MyConfig.path + "/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                configType: 0,
                cloudModule: "apmgr",
                deviceModule: "apmgr",
                method: "SyncAPGroup",
                param:[{
                    // apGroupName : oData[0].ApGroupName,
                }]
            }),
            onSuccess:SyncAPGroupSuc,
            onFailed:SyncAPGroupFail
        }

        Utils.Request.sendRequest(SyncAPGroupOpt);
    }

    function onDelSSID(){

    }

    function showAddUser(data) { //修改按钮
        
    }

    function initForm(){

        var oSListOptions = {
            height:"70",
            showHeader: true,
            multiSelect: true,
            // showOperation: true,
            pageSize : 5,
            colNames: getRcText ("ALLAP_HEADER2"),
            colModel: [
                {name: "ApGroupName",  datatype: "String", width:80}
                ,{name: "Description", datatype: "String", width:80}
                ,{name: "ApCount", datatype: "String", width:80,formatter:showLink9}
            ],
            buttons: [
                {
                    name: "add",
                    value: getRcText ("ADDBTN"),
                    action: onAddSSID,
                    enable: 1
                },
                {
                    name: "default", 
                    value:getRcText ("DELBTN"), 
                    enable:mulOfTrue,
                    action:deleteSSID
                }, 
                {
                    name: "default",
                    value: getRcText("SYN"),
                    action: synSSID
                },
                {
                    name: "edit",
                    action: showAddUser
                }, 
                {
                    name: "delete",
                    action: Utils.Msg.deleteConfirm(onDelSSID),
                    enable: 1
                }
            ]
        };

        var oSListOptions7 = {
            height:"70",
            showHeader: true,
            multiSelect: true,
            asyncPaging: true,
            // showOperation: true,
            pageSize : 5,
            colNames: getRcText ("ALLAP_HEADER7"),
            onPageChange:function(pageNum,pageSize,oFilter,oSorter){
                var valueOfskipnum=(parseInt(pageNum-1))*(parseInt(pageSize));
                var valueOflimitnum=pageSize;
                var postOfData = {
                    findoption: {},
                    sortoption: {}
                }
                if( oFilter ) {
                    postOfData.findoption = oFilter;
                }    
                if( oSorter ) {
                    postOfData.sortoption[oSorter.name] = oSorter.isDesc ? -1 : 1;
                }
                var apModelList = [];
                for (var i = 0; i < aModel.length; i++) {
                    var param = {
                        apModel:aModel[i]
                    }
                    apModelList.push(param);
                }
                postOfData.apModelList = apModelList;
                initDLData(pageNum, valueOfskipnum, valueOflimitnum, postOfData);
            },  
            onSearch:function(oFilter,oSorter){
                var pageNum = 1;
                var postOfData = {
                    findoption: {},
                    sortoption: {}
                }
                if( oFilter ) {
                    postOfData.findoption = oFilter;
                }    
                if( oSorter ) {
                    postOfData.sortoption[oSorter.name] = oSorter.isDesc ? -1 : 1;
                }             
                var apModelList = [];
                for (var i = 0; i < aModel.length; i++) {
                    var param = {
                        apModel:aModel[i]
                    }
                    apModelList.push(param);
                }
                postOfData.apModelList = apModelList;
                initDLData(pageNum, SKIP, LIMIT, postOfData);
            },
            onSort:function(sName,isDesc){
                var pageNum = 1;
                var postOfData = {
                    sortoption: {}
                }  
                postOfData.sortoption[sName] = isDesc ? -1 : 1;                            
                var apModelList = [];
                for (var i = 0; i < aModel.length; i++) {
                    var param = {
                        apModel:aModel[i]
                    }
                    apModelList.push(param);
                }
                postOfData.apModelList = apModelList;
                initDLData(pageNum, SKIP, LIMIT, postOfData);
            }, 
            colModel: [
                {name: "apName",datatype: "String"}
                ,{name: "apModel",datatype: "String"}
                ,{name: "apSN",datatype: "String"}
                ,{name: "macAddr",datatype: "String"}
            ],
            buttons: [
                {
                    name: "addgroup", 
                    value:getRcText ("ADDGROUP_BTN"), 
                    enable:addGroupOfTrue,
                    action:addGroup
                }, 
            ]
        };
        $("#onlineuser_list").SList ("head", oSListOptions);
        $("#onlineuser_list7").SList ("head", oSListOptions7);
        $("#onlineuser_list").on('click','a.list-link',onDisDetail9);
        $("#tableForm").form("init", "edit", {"title":getRcText("TITLE_TERINFO"),"btn_apply": false,"btn_cancel":false});
        $("#view_client_form").form("init", "edit", {"title":getRcText("TERINFO"),"btn_apply": false,"btn_cancel":false});
    }

    function _init ()
    {
        g_jForm = $("#pagetoggle_form");
        initForm();
        initData();
        $('.info-tip').css({
            color:"#4ec1b2",
            fontSize:"15px",
            margin:"-13px 0 60px 2px"
        });
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
        "widgets": ["Echart","Minput","SList","Form","MSelect"],
        "utils": ["Base", "Request"]
    });

}) (jQuery);;