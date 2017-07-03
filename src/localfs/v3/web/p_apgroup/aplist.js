(function ($){

    var MODULE_BASE = "p_apgroup";
    var MODULE_NAME = MODULE_BASE + ".aplist";
    var MODULE_RC = "apinfo_aplist_rc";
    var g_oTableData = {};
    var g_oPara;
    var SKIP=0;
    var LIMIT=5;
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

    function addGroupOfTrue(addGroupOfData){
        if(addGroupOfData.length==0){
            return false;
        }else{
            return true;           
        }
    }

    function leaveGroupOfTrue(leaveGroupOfData){
        if(leaveGroupOfData.length==0){
            return false;
        }else{
            return true;           
        }
    }

    function initDLData(skipWhatData,meiYeShuJu,guoLvData,ApGroupName){        
        // g_oTableData = [];
        var valueOfskipnum=skipWhatData;
        var valueOflimitnum=meiYeShuJu;        
        var requestDataPost={};
        $.extend(requestDataPost,guoLvData);
        requestDataPost.apGroupName = g_oPara.ApGroupName;
        function getApListSuc(data){
                console.log(data);
            // $.each(data.list,function(index,iDate){
            //    $("#onlineuser_list7").SList ("refresh", iDate.apList);
            // });
            $("#onlineuser_list").SList ("refresh", data.apList);
            $("#onlineuser_list1").SList ("refresh", data.leftApList);
        }

        function getApListFail(err){
            
        }            
        var url=MyConfig.path+"/apmonitor/aplistbygroup?devSN="+FrameInfo.ACSN;
        var requestData ="&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum;
        url=url+requestData;

        var ApListOpt = {
            type:"POST",
            url:url,
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify(requestDataPost),
            onSuccess:getApListSuc,
            onFailed:getApListFail
        };

        Utils.Request.sendRequest(ApListOpt);
    }

    function onAddSSID(){
    
    }

    function deleteSSID(){

    }

    function leaveGroup(leaveGroupOfDatas){
        var param = [];
        $.each(leaveGroupOfDatas,function(index,everyOfData){
            var obj = {
                apGroupName : g_oPara.ApGroupName,
                optType: "0"
            }
            obj.info = everyOfData.apName
            param.push(obj);
        });
        function leaveGroupSuc(data)
        {
            console.log(data);
            if ((data.communicateResult=="success") && (data.errCode == 0))
            {
                Frame.Msg.info(getRcText("LEAVEGROUPOFSUC"));
                Utils.Base.refreshCurPage();
            }else{
                Frame.Msg.info(getRcText("DEL_FAIL"), "error");
                return ;
            }
        }

        function leaveGroupFail(err)
        {
            console.log(err);
        }
        var leaveGroupOpt = {
            type: "POST",
            url: MyConfig.path + "/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                configType: 0,
                cloudModule: "apmgr",
                deviceModule: "apmgr",
                method: "DelApToGroup",
                param: param
                //  [{
                //     apGroupName :g_oPara.ApGroupName,
                //     optType: "0", 
                //     info: oData[0].apName
                // }]
            }),
            onSuccess:leaveGroupSuc,
            onFailed:leaveGroupFail
        }

        Utils.Request.sendRequest(leaveGroupOpt);
    }

    function addGroup(addGroupOfDatas){
        var param = [];
        $.each(addGroupOfDatas,function(index,everyOfData){
            var obj = {
                apGroupName : g_oPara.ApGroupName,
                optType: "0"
            }
            obj.info = everyOfData.apName
            param.push(obj);
        });
        function addGroupSuc(data)
        {
            console.log(data);
            if ((data.communicateResult=="success") && (data.errCode == 0))
            {
                Frame.Msg.info(getRcText("ADDGROUPOFSUC"));
                Utils.Base.refreshCurPage();
            }else{
                Frame.Msg.info(getRcText("ADD_FAIL"), "error");
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
                //     apGroupName : g_oPara.ApGroupName,
                //     optType: "0", 
                //     info: oData[0].apName
                // }]
            }),
            onSuccess:addGroupSuc,
            onFailed:addGroupFail
        }

        Utils.Request.sendRequest(addGroupOpt);
    }

    function synSSID() {
        
    }

    function onDelSSID(){

    }

    function showAddUser(data) { //修改按钮
            
    }
    function initInGrpData(pageNum, valueOfskipnum, valueOflimitnum, postOfData){
        function getInGrpApListSuc(data){
            console.log(data);
            $("#onlineuser_list").SList ("refresh",  {total:data.totalCntInGrp,pageNum:pageNum,data:data.apList});
        }

        function getInGrpApListFail(err){
            
        }            
        var url=MyConfig.path+"/apmonitor/aplistbygroup?devSN="+FrameInfo.ACSN;
        var requestData ="&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum+"&apGroupName="+g_oPara.ApGroupName;
        url=url+requestData;
        var InGrpApListOpt = {
            type:"POST",
            url:url,
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify(postOfData),
            onSuccess:getInGrpApListSuc,
            onFailed:getInGrpApListFail
        };
        Utils.Request.sendRequest(InGrpApListOpt);
    }

    function initOutGrpData(pageNum, valueOfskipnum, valueOflimitnum, postOfData){
        function getOutGrpApListSuc(data){
            console.log(data);
            $("#onlineuser_list1").SList ("refresh",  {total:data.totalCntOutGrp,pageNum:pageNum,data:data.leftApList});
        }

        function getOutGrpApListFail(err){
            
        }            
        var url=MyConfig.path+"/apmonitor/aplistbygroup?devSN="+FrameInfo.ACSN;
        var requestData ="&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum+"&apGroupName="+g_oPara.ApGroupName;
        url=url+requestData;
        var OutGrpApListOpt = {
            type:"POST",
            url:url,
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify(postOfData),
            onSuccess:getOutGrpApListSuc,
            onFailed:getOutGrpApListFail
        };
        Utils.Request.sendRequest(OutGrpApListOpt);
    }

    function initData(){
        var postOfData = {
            findoption: {},
            sortoption: {}
        }
        initInGrpData(1, SKIP, LIMIT, postOfData);
        initOutGrpData(1, SKIP, LIMIT, postOfData);
    }

    function initForm(){

        // var oSListOptions = {
        //     height:"70",
        //     showHeader: true,
        //     multiSelect: true,
        //     showOperation: true,
        //     pageSize : 3,
        //     colNames: getRcText ("ALLAP_HEADER2"), 
        //     colModel: [
        //         {name: "apName",  datatype: "String", width:80}
        //         ,{name: "apModel",  datatype: "String", width:80}
        //         ,{name: "apSN",  datatype: "String", width:80}
                
        //     ],
        //     buttons: [
        //     {
        //         name: "add",
        //         value: "添加",
        //         action: onAddSSID,
        //         enable: 1
        //     },
        //     {
        //         name: "del",
        //         value: "删除",
        //         action: deleteSSID,
        //         enable: 1
        //     }, 
        //     {
        //         name: "default",
        //         value: getRcText("SYN"),
        //         action: synSSID
        //     },
        //     {
        //         name: "edit",
        //         action: showAddUser
        //     }, {
        //         name: "delete",
        //         action: Utils.Msg.deleteConfirm(onDelSSID),
        //         enable: 1
        //     }, 
        //     ]
        // };


        var oSListOptions3 = {
            height:"70",
            showHeader: true,
            multiSelect: true,
            asyncPaging:true, 
            // showOperation: true,
            pageSize : 5,
            colNames: getRcText ("ALLAP_HEADER3"),
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
                initInGrpData(pageNum, valueOfskipnum, valueOflimitnum, postOfData);
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
                initInGrpData(pageNum, SKIP, LIMIT, postOfData);
            },
            onSort:function(sName,isDesc){
                var pageNum = 1;
                var postOfData = {
                    sortoption: {}
                }  
                postOfData.sortoption[sName] = isDesc ? -1 : 1;
                initInGrpData(pageNum, SKIP, LIMIT, postOfData);
            }, 
            colModel: [
                {name: "apName",              datatype: "String", width:80}
                ,{name: "apModel",            datatype: "String", width:80}
                ,{name: "apSN",               datatype: "String", width:80}
                ,{name: "macAddr",               datatype: "String", width:80}
            ],
            buttons: [
                // {
                //     name: "leavegroup",
                //     value: "离开组",
                //     action: leaveGroup,
                //     enable: 1
                // },
                {
                    name: "leavegroup", 
                    value:getRcText ("LEAVEGROUP_BTN"), 
                    enable:leaveGroupOfTrue,
                    action:leaveGroup
                },
            ]
        };

        var oSListOptions4 = {
            height:"70",
            showHeader: true,
            multiSelect: true,
            asyncPaging:true, 
            // showOperation: true,
            pageSize : 5,
            colNames: getRcText ("ALLAP_HEADER3"),
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
                initOutGrpData(pageNum,valueOfskipnum,valueOflimitnum,postOfData);
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
                initOutGrpData(pageNum, SKIP, LIMIT, postOfData);
            },
            onSort:function(sName,isDesc){
                var pageNum = 1;
                var postOfData = {
                    sortoption: {}
                }  
                postOfData.sortoption[sName] = isDesc ? -1 : 1;
                initOutGrpData(pageNum, SKIP, LIMIT, postOfData);
            },
            colModel: [
                {name: "apName", datatype: "String", width:80}
                ,{name: "apModel", datatype: "String", width:80}
                ,{name: "apSN", datatype: "String", width:80}
                ,{name: "macAddr", datatype: "String", width:80}
            ],
            buttons: [
                // {
                //     name: "addgroup",
                //     value: "加入组",
                //     action: addGroup,
                //     enable: 1
                // },
                {
                    name: "addgroup", 
                    value:getRcText ("ADDGROUP_BTN"), 
                    enable:addGroupOfTrue,
                    action:addGroup
                },
            ]
        };
        $("#onlineuser_list").SList ("head", oSListOptions3);
        $("#onlineuser_list1").SList ("head", oSListOptions4);
    }
    function fanHui(){
        //返回至首页面         
         Utils.Base.redirect ({np:"p_apgroup.index"});
         return false;         
    }
    function _init ()
    {
        g_oPara = Utils.Base.parseUrlPara();
        initForm();
        initData();
        $("#return").on('click', fanHui);
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