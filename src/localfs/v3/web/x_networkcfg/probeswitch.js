/**
 * Created by Administrator on 2016/11/2.
 */
(function($){
    var MODULE_BASE = "x_networkcfg";
    var MODULE_NAME = MODULE_BASE +".probeswitch";
    var btnList=new Array();
    var btnList2=new Array();
    var submitArr=[];
    var singleData={};
    var radioList=getRcText("RADIO_LIST").split(",");
    var hPending=null;
    var listContent=[];
    var flag=0;
    /*获取字符串*/
    function getRcText(sRcName) {
        return Utils.Base.getRcString("radio_rc", sRcName);
    }

    /*查找数组中某个元素第一次出现的位置*/
    function findIndexArr(value,arr){
        for(var i=0;i<arr.length;i++){
            if(arr[i]==value){
                return i;
            }
        }
    }

    /*开关切换*/
    function toggleButton($this){
        var self = $this;
        if (self.hasClass("open")) {
            self.removeClass("open");
        }
        else {
            self.addClass("open");
        }
    }

    /*提交修改数据*/
    function submitData(){
        if(submitArr.length==0){
            Frame.Msg.info(getRcText("RADIO_NULL"));
            return;
        }else{
            var hPending = Frame.Msg.pending(getRcText("PENDING_MSG").split(",")[0]);
        }
        console.log("提交数据111",submitArr);
        $.ajax({
            url: MyConfig.path + "/ant/confmgr",
            type: "POST",
            dataType: "json",
            ContentType: "application/json",
            data:{
                cfgTimeout:120,
                cloudModule:"xiaoxiaobeicfg",
                configType:0,
                policy:"cloudFirst",
                sceneFlag:"true",
                deviceModule:"xiaoxiaobei",
                method:"probeEnable",
                nasId:FrameInfo.Nasid,
                multicfg:true,
                shopName:Utils.Device.deviceInfo.shop_name,
                userName:FrameInfo.g_user.user,
                param:submitArr
            },
            success: function(data) {
                hPending.close();
                if(data.serviceResult=="success"){
                    var opt=[];
                    var devStatusArr=[];
                    for(var i=0;i<data.deviceResults.length;i++){
                        devStatusArr.push(data.deviceResults[i].devSN);
                        if(data.deviceResults[i].reason == "Failed to set cfg to device."){
                            var singleBacStatus={
                                "devSN":data.deviceResults[i].devSN,
                                "status":""
                            };
                            opt.push(singleBacStatus);
                        }
                    }
                    if(opt.length==0){
                        Frame.Msg.info(getRcText("QUE_SUCC"));
                        setTimeout(function(){
                            showRadioList();
                        },500);
                    }else{
                        addDevStatus(devStatusArr,opt,function(opt){
                            $("#failList").SList("refresh",opt);
                            Utils.Base.openDlg(null, {}, {scope:$("#failcfgDlg"),className:"modal-large"});
                            $("#sign").form("init", "edit", {
                                "title": getRcText("CONFIRM_TITLE"),
                                "btn_apply":{
                                    enable:true,
                                    action:function () {
                                        Utils.Pages.closeWindow(Utils.Pages.getWindow($("#failcfgDlg")));
                                        setTimeout(function(){
                                            submitData();
                                        },500);
                                    }
                                },
                                "btn_cancel": function(){
                                    submitArr=[];
                                    Utils.Pages.closeWindow(Utils.Pages.getWindow($("#failcfgDlg")));
                                    showRadioList();
                                }
                            });
                            $(".close").off("click");
                            $(".close").on("click",function(){
                                submitArr=[];
                                Utils.Pages.closeWindow(Utils.Pages.getWindow($("#sign")));
                                setTimeout(function(){
                                    showRadioList();
                                },500);
                            });
                        });
                    }
                }else{
                    Frame.Msg.info(getRcText("PENDING_MSG").split(",")[2]);
                }
            },
            error:function(err){
                hPending&&hPending.close();
            }
        });
    }

    /*添加失败列表在线状态*/
    function addDevStatus(arr,opt,callback){
        $.ajax({
            url: "/v3/base/getDevs",
            type: "POST",
            dataType: "json",
            timeout: 150000,
            ContentType: "application/json",
            data:{
                devSN:arr
            },
            success: function(data) {
                for(var i=0;i<data.detail.length;i++){
                    for(var j=0;j<opt.length;j++){
                        if(data.detail[i].devSN==opt[j].devSN){
                            //alert(555);
                            opt[j].status=getRcText("RADIO_STATUES").split(",")[data.detail[i].status];
                        }
                    }
                }
                callback(opt);
            },
            error:function(err){
                hPending&&hPending.close();
            }
        });
    }

    /*修改前slist*/
    function preForm(){
        var $radioSet= $("#radioSet");
        btnList=listContent;
        //console.log("btnList111",btnList);
        //for(var i=0;i<btnList.length;i++){
        //    var single2={
        //        devName:btnList[i].devName,
        //        devSN:btnList[i].devSN,
        //        probeStatus:btnList[i].probeStatus,
        //        status:btnList[i].status
        //    };
        //    btnList2.push(single2);
        //}
        console.log("btnList222",btnList2);
        $radioSet.html("");
        var opt = {
            colNames: getRcText ("LIST_TITLE"),
            showHeader: true,
            multiSelect: false,
            showOperation:false,
            pageSize:8,
            onPageChange:function(pageNum,pageSize,oFilter,oSorter){

            },
            colModel: [
                {name:'status', datatype:"String",width:50,formatter:bacStatusBefor},
                {name:'devName', datatype:"String",width:250},
                {name:'devSN', datatype:"String",width:250},
                {name:'probeStatus', datatype:"String",width:250}
            ],
            buttons:[
                {name:"dev_newadd", enable:true,value:getRcText("RADIO_CHANGE"),action:changeForm}
            ]
        };
        $radioSet.SList ("head", opt);
        $radioSet.SList ("refresh", btnList);
        flag++;
    }

    /*修改刷入数据*/
    function updateReflreshData(singleData,btnList2){
        for(var i=0;i<btnList2.length;i++){
            if(btnList2[i].SN==singleData.devSN){
                btnList2[i].radio1=singleData.radioList[0].enable;
                btnList2[i].radio2=singleData.radioList[1].enable;
                if(!singleData.radioList[0].channel){
                    btnList2[i].radioChannel1="auto";
                }else{
                    btnList2[i].radioChannel1=singleData.radioList[0].channel-0;
                }
                if(!singleData.radioList[1].channel){
                    btnList2[i].radioChannel2="auto";
                }else{
                    btnList2[i].radioChannel2=singleData.radioList[1].channel-0;
                }
            }
        }
        return btnList2;
    }

    /*检测提交数据是否有重复*/
    function checkDevice(single,submit){
        if(submit.length==0){
            submit.push(single);
            return submit;
        }else{
            for(var i=0;i<submit.length;i++){
                if(submit[i].devSN==single.devSN){
                    submit[i]=single;
                    return submit;
                }
            }
            submit.push(single);
            return submit;
        }
    }

    /*获取列表*/
    function showRadioList(){
        var hPending = Frame.Msg.pending(getRcText("PENDING_MSG").split(",")[2]);
        /*获取场所下设备详细信息*/
        getDevInfo(function(devList){
            getDevName(devList,function(devList){
                addLineStatues(devList,function(devList){
                    console.log("dadadada");
                    listContent=devList;
                    hPending.close();
                    preForm();
                    console.log(listContent,"初始数据");
                });
            });
            //for(var i=0;i<devList.length;i++){
            //    devList[i].devSN=devList[i].devSN;
            //}
            /*listContent=devList;
            hPending.close();
            preForm();
            console.log(listContent,111);*/
            /*添加是否离线*/
            //addLineStatues(devList,function(listContent){
            //    /*添加配置*/
            //    addSetInfo(listContent,function(listContent,data){
            //        for(var i=0;i<listContent.length;i++){
            //            for(var j=0;j<data.length;j++){
            //                if(listContent[i].SN==data[j].devSN){
            //                    if(data[j].radioList[0].radio==1){
            //                        listContent[i].radio1=data[j].radioList[0].enable;
            //                        listContent[i].radio2=data[j].radioList[1].enable;
            //                        data[j].radioList[0].channel?listContent[i].radioChannel1=data[j].radioList[0].channel:listContent[i].radioChannel1="auto";
            //                        data[j].radioList[1].channel?listContent[i].radioChannel2=data[j].radioList[1].channel:listContent[i].radioChannel2="auto";
            //                    }else{
            //                        listContent[i].radio1=data[j].radioList[1].enable;
            //                        listContent[i].radio2=data[j].radioList[0].enable;
            //                        data[j].radioList[1].channel?listContent[i].radioChannel1=data[j].radioList[1].channel:listContent[i].radioChannel1="auto";
            //                        data[j].radioList[0].channel?listContent[i].radioChannel2=data[j].radioList[0].channel:listContent[i].radioChannel2="auto";
            //                    }
            //                }
            //            }
            //        }
            //        //console.log(listContent,909090);
            //        hPending.close();
            //        preForm();
            //    });
            //});

        });
        /*匹配在线信息*/
        /*获取设备配置列表*/

    }

    /*添加别名*/
    function getDevName(devList,callback){
        var data = {
            "tenant_name": FrameInfo.g_user.attributes.name,
            "nasid": FrameInfo.Nasid
        };
        var ajax = {
            url: "/v3/ace/oasis/oasis-rest-shop/restshop/o2oportal/getDeviceInfoShop",
            type: "POST",
            dataType: "json",
            timeout: 150000,
            contentType: "application/json",
            data:JSON.stringify(data),
            onSuccess: function(data) {
                console.log("hjhjhjhj ");
                if(!('dev_list' in data)){
                    console.log('dev_list not exist');
                    return;
                }
                for(var i=0;i<devList.length;i++){
                    for(var j=0;j<data.dev_list.length;j++){
                        if(devList[i].devSN==data.dev_list[j].dev_sn){
                            devList[i].devName=data.dev_list[j].alias_name;
                        }
                    }
                }
                callback(devList);
            },
            onFailed:function(err){
                //Frame.Msg.error(MyConfig.httperror);
                hPending&&hPending.close();
                callback("");
            }
        };
        Utils.Request.sendRequest(ajax);
    }

    /*添加配置信息*/
    function addSetInfo(listContent,callback){
        $.ajax({
            url: MyConfig.path + "/ant/confmgr",
            type: "POST",
            dataType: "json",
            ContentType: "application/json",
            data:{
                cfgTimeout:180,
                cloudModule:"xiaoxiaobeicfg",
                configType:1,policy:"cloudFirst",sceneFlag:"true",
                deviceModule:"xiaoxiaobei",
                method:"GetRfChannelCfg",
                nasId:FrameInfo.Nasid,
                shopName:Utils.Device.deviceInfo.shop_name,
                userName:FrameInfo.g_user.user,
                param:[
                    {
                        nasId:FrameInfo.Nasid

                    }
                ]
            },
            success: function(data) {
                if(data.result==""){
                    Frame.Msg.Info();
                    return;
                }
                callback(listContent,data.result);
            },
            error:function(err){
                hPending&&hPending.close();
            }
        });
    }

    /*添加在线状态*/
    function addLineStatues(devList,callback){
        var statuesArr=[];
        for(var i=0;i<devList.length;i++){
            statuesArr.push(devList[i].devSN);
        }
        $.ajax({
            url: "/v3/base/getDevs",
            type: "POST",
            dataType: "json",
            timeout: 150000,
            ContentType: "application/json",
            data:{
                devSN:statuesArr
            },
            success: function(data) {
                for(var i=0;i<data.detail.length;i++){
                    for(var j=0;j<devList.length;j++){
                        //console.log("data.detail[i].devSN==devList[j].devSN",data.detail[i].devSN,devList[j].devSN);
                        if(data.detail[i].devSN==devList[j].devSN){
                            devList[j].status=data.detail[i].status;
                            console.log("devList[j].status",devList[j].status);
                        }
                    }
                }
                callback(devList);
            },
            error:function(err){
                hPending&&hPending.close();
                callback("");
            }
        });


    }

    /*除去title*/
    function removeTitle(){
        $("#radioSet .sl2,.sl3").attr({"title":""});
    }

    /*获取场所下设备配置详细信息*/
    function getDevInfo(callback){
        var ajax = {
            url: "/v3/ant/confmgr",
            type: "POST",
            dataType: "json",
            ContentType: "application/json",
            data:{
                cfgTimeout:60,
                cloudModule:"xiaoxiaobeicfg",
                configType:1,
                policy:"cloudFirst",
                sceneFlag:"true",
                deviceModule:"xiaoxiaobei",
                method:"GetProbeCfg",
                nasId:FrameInfo.Nasid,
                shopName:Utils.Device.deviceInfo.shop_name,
                userName:FrameInfo.g_user.user,
                param:[
                    {
                        nasId:FrameInfo.Nasid
                    }
                ]
            },

            onSuccess:function(data){
                if(!('result' in data)){
                    console.log('dev_list not exist');
                    return;
                }
                callback(data.result);
            },
            onFailed:function(err){
                //Frame.Msg.error(MyConfig.httperror);
                hPending&&hPending.close();
                callback("");
            }
        };

        Utils.Request.sendRequest(ajax);
    }

    /*获取修改行所有状态*/
    function getAllinfo($this,single){
        if(!$this.children(".target")){
            return single;
        }
        var $target=$this.children(".target");
        var targetId=$target.attr("id");
        console.log(single,$target,targetId,"targetId");
        switch(targetId){
            /*在线状态*/
            case "status":

                break;
            /*devSN*/
            case "devSN":
                //alert(123);
                console.log($target);
                single.devSN=$target.html();
                break;
            /*DEVsn*/
            case "SN":
                single.devSN=$target.html();
                break;
            /*probeStatus*/
            case "probeStatus":
                if($target.hasClass("open")){
                    single.probeStatus="on";
                }else{
                    single.probeStatus="off";
                }
                break;
            default:
                "";
        }
        return single;
    }

    /*添加事件*/
    function initChange(){
        $("#radioSet .btn").off("click");
        $("#radioSet .btn").on("click",function(){
            toggleButton($(this));
            /*添加当前修改行*/
            var singleData={
                nasId:FrameInfo.Nasid,
                devSN:"",
                probeStatus:""
            };
            console.log(4455);
            $(this).parent().parent().children(".slist-cell").each(function(){
                console.log(8899);
                singleData=getAllinfo($(this),singleData);
            });
            /*添加修改数据并更新修改*/
            submitArr=checkDevice(singleData,submitArr);
            console.log(submitArr,"submitArr");
            /*修改刷新数据*/
            //btnList2=updateReflreshData(singleData,btnList2);
        });
    }

    /*修改后slist*/
    function changeForm(){
        $("#radioSet").html("");
        var opt = {
            colNames: getRcText ("LIST_TITLE"),
            showHeader: true,
            multiSelect: false,
            showOperation:false,
            pageSize:8,
            onPageChange:function(pageNum,pageSize,oFilter,oSorter){

            },
            colModel: [
                {name:'status', datatype:"String",width:50,formatter:bacStatus},
                {name:'devName', datatype:"String",width:250},
                {name:'devSN', datatype:"String",width:250,formatter:bacStatus},
                {name:'probeStatus', datatype:"String",width:250,formatter:bacStatus}
            ],
            buttons:[
                {name:"dev_newadd", enable:true,value:"确认修改",action:submitData},
                {name:"dev_newadd", enable:true,value:"取消",action:preForm}
            ]
        };
        $("#radioSet").SList ("head", opt);
        $("#radioSet").SList ("refresh", btnList);
        removeTitle();
        $(".page-next,.page-prev").click(function(){
            $("#radioSet").SList ("refresh", btnList);
            removeTitle();
        });
        $(".openORclose").on("click",function(){
            toggleButton($(this));
        });
        removeTitle();
        /*事件添加*/
        initChange();
    }

    /*表格数据修改及提交信息保存*/
    function initDataChange($this){
        var singleData={
            nasId:FrameInfo.Nasid,
            devSN:"",
            probeStatus:""
        };
        $this.parent().parent().children(".slist-cell").each(function(){
            singleData=getAllinfo($this,singleData);
        });
        /*添加修改数据并更新修改*/
        submitArr=checkDevice(singleData,submitArr);
        /*修改刷新数据*/
        //btnList2=updateReflreshData(singleData,btnList2);
        /*console.log(singleData,"获取单行信息");
         console.log(btnList2,"获取更新后刷新数据");
         console.log(submitArr,"获取提交信息");*/
    }

    /*修改状态*/
    function bacStatus(row, cell, value, columnDef, dataContext, type){
        $(".openORclose").click(function(){
            toggleButton($(this));
        });
        console.log("columnDef.name",columnDef.name);
        console.log("row",row,"cell", cell,"value" ,value,"columnDef", columnDef,"dataContext", dataContext,"type", type);
        switch(columnDef.name){
            //
            /*在线状态*/
            case "status":
                if(dataContext.status){
                    var $status=$("<div id='status' class='pos-rel fullSpace target' defaultParam='' title='1'><div class='pos-abs stOffline'></div></div>");
                    $status.attr({"defaultParam":dataContext.status,"title":getRcText("RADIO_STATUES").split(",")[1]})
                    return $status;
                }else{
                    var $status=$("<div id='status'  class='pos-rel fullSpace target' defaultParam='' title='0'><div class='pos-abs stOnline'></div></div>");
                    $status.attr({"defaultParam":dataContext.status,"title":getRcText("RADIO_STATUES").split(",")[0]})
                    return $status;
                }
                break;
            /*devSN*/
            case "devSN":
                return '<div id="devSN" class="target">'+dataContext.devSN+'</div>';
                break;
            /*配置*/
            case "probeStatus":
                if(dataContext.probeStatus=="on"){
                    return '<div id="probeStatus" class="ctrl-btn openORclose open status mp btn float-left btn target forbid switch"></div>';
                }else{
                    return '<div id="probeStatus" class="ctrl-btn openORclose status mp btn float-left target btn forbid switch"></div>';
                }
                break;
            default:
                console.log("data err");
        }
    }

    /*未修改状态*/
    function bacStatusBefor(row, cell, value, columnDef, dataContext, type){
        var stArr=['stOffline','stOnline'];
        switch(columnDef.name){
            /*在线状态*/
            case "status":
                if(dataContext.status){
                    var $status=$("<div id='status' class='pos-rel fullSpace target' defaultParam='' title='1'><div class='pos-abs stOffline'></div></div>");
                    $status.attr({"defaultParam":dataContext.status,"title":getRcText("RADIO_STATUES").split(",")[1]})
                    return $status;
                }else{
                    var $status=$("<div id='status'  class='pos-rel fullSpace target' defaultParam='' title='0'><div class='pos-abs stOnline'></div></div>");
                    $status.attr({"defaultParam":dataContext.status,"title":getRcText("RADIO_STATUES").split(",")[0]})
                    return $status;
                }
                break;
            /*设备别名*/
            case "devSN":
                alert("devSN");
                break;
            default:
                console.log("data err");
        }
        //console.log("row",row,"cell", cell,"value" ,value,"columnDef", columnDef,"dataContext", dataContext,"type", type);

    }

    function _init(){
        var opt = {
            colNames: getRcText("RADIO_SLIST"),
            showOperation: false,
            multiSelect: false,
            search: false,
            sortable: false,
            pageSize: 5,
            colModel: [
                {name: 'devSN', datatype: "String"},
                {name: 'status', datatype: "String"}
            ]
        };
        $("#failList").SList("head", opt);
        /*跳转*/
        $("#probeSwitch").click(function(){
            Utils.Base.redirect({ np: $(this).attr("href")});
        });
        $("#radioLink").click(function(){
            Utils.Base.redirect({ np: $(this).attr("href")});
        });
        $("#wirlessLink").on("click",function(){
            Utils.Base.redirect({ np: $(this).attr("href")});
        });
        showRadioList();
        $(".openORclose").on("click",function(){
            toggleButton($(this));
        });
        $(document).on("click",function(){
            initChange();
            $(".openORclose").off("click");
            $(".openORclose").on("click",function(){
                toggleButton($(this));
                /*添加当前修改行*/
                var singleData={
                    nasId:FrameInfo.Nasid,
                    devSN:"",
                    probeStatus:""
                };
                console.log(678);
                $(this).parent().parent().children(".slist-cell").each(function(){
                    console.log(890);
                    singleData=getAllinfo($(this),singleData);
                });
                /*添加修改数据并更新修改*/
                submitArr=checkDevice(singleData,submitArr);
                console.log(submitArr,"submitArr");
                /*修改刷新数据*/
                //btnList2=updateReflreshData(singleData,btnList2);
            });
        });
    }


    function _destroy(){

    }

    function _resize(){

    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["SList","SingleSelect","Form", "DateTime"],
        "utils": ["Base", "Request","Device"]
    });
})(jQuery);