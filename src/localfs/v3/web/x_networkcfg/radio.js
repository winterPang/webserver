/**
 * Created by Administrator on 2016/11/2.
 */
(function($){
    var MODULE_BASE = "x_networkcfg";
    var MODULE_NAME = MODULE_BASE +　".radio";
    var g_sShopName = null;
    var g_ssid = null;
    var hPending = null;
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
        //console.log("要提交的数据",submitArr);
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
                deviceModule:"xiaoxiaobei",
                method:"Radiocfg",
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
                        //if(!(data.deviceResults[i].deviceResult.result&&data.deviceResults[i].deviceResult.result=="success")){
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
    };

    /*修改前slist*/
    function preForm(){
        btnList=listContent;
        for(var i=0;i<btnList.length;i++){
            btnList2[i]={
                ApName:"",
                SN:"",
                radio1:"",
                radio2:"",
                radioChannel1:"",
                radioChannel2:"",
                status:""

            };
            btnList2[i].ApName=btnList[i].ApName;
            btnList2[i].SN=btnList[i].SN;
            btnList2[i].radio1=btnList[i].radio1;
            btnList2[i].radio2=btnList[i].radio2;
            btnList2[i].radioChannel1=btnList[i].radioChannel1;
            btnList2[i].radioChannel2=btnList[i].radioChannel2;
            btnList2[i].status=btnList[i].status;
        }
        /*if(!flag){
         btnList=downList;
         for(var i=0;i<btnList.length;i++){
         btnList2[i]={
         ApName:"",
         SN:"",
         radio1:"",
         radio2:"",
         radioChannel1:"",
         radioChannel2:"",
         status:""

         };
         btnList2[i].ApName=btnList[i].ApName;
         btnList2[i].SN=btnList[i].SN;
         btnList2[i].radio1=btnList[i].radio1;
         btnList2[i].radio2=btnList[i].radio2;
         btnList2[i].radioChannel1=btnList[i].radioChannel1;
         btnList2[i].radioChannel2=btnList[i].radioChannel2;
         btnList2[i].status=btnList[i].status;
         }
         }else{

         }*/
        $("#radioSet").html("");
        var opt = {
            colNames: getRcText ("LIST_TITLE"),
            showHeader: true,
            multiSelect: false,
            showOperation:false,
            pageSize:10,
            onPageChange:function(pageNum,pageSize,oFilter,oSorter){

            },
            colModel: [
                {name:'status', datatype:"String",width:20,formatter:bacStatusBefor},
                {name:'ApName', datatype:"String",width:250},
                {name:'SN', datatype:"String",width:250},
                {name:'radio1', datatype:"String",width:250,formatter:bacStatusBefor},
                {name:'radio2', datatype:"String",width:250,formatter:bacStatusBefor},
                {name:'radioChannel1', datatype:"String",width:250,formatter:bacStatusBefor},
                {name:'radioChannel2', datatype:"String",width:250,formatter:bacStatusBefor}
            ],
            buttons:[
                {name:"dev_newadd", enable:true,value:getRcText("RADIO_CHANGE"),action:changeForm},
            ]
        };
        $("#radioSet").SList ("head", opt);
        //.log(btnList,listContent,"初始数据");
        $("#radioSet").SList ("refresh", btnList);
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
            /*添加离线状态*/
            addLineStatues(devList,function(listContent){
                /*添加配置*/
                addSetInfo(listContent,function(listContent,data){
                    for(var i=0;i<listContent.length;i++){
                        for(var j=0;j<data.length;j++){
                            if(listContent[i].SN==data[j].devSN){
                                if(data[j].radioList[0].radio==1){
                                    listContent[i].radio1=data[j].radioList[0].enable;
                                    listContent[i].radio2=data[j].radioList[1].enable;
                                    data[j].radioList[0].channel?listContent[i].radioChannel1=data[j].radioList[0].channel:listContent[i].radioChannel1="auto";
                                    data[j].radioList[1].channel?listContent[i].radioChannel2=data[j].radioList[1].channel:listContent[i].radioChannel2="auto";
                                }else{
                                    listContent[i].radio1=data[j].radioList[1].enable;
                                    listContent[i].radio2=data[j].radioList[0].enable;
                                    data[j].radioList[1].channel?listContent[i].radioChannel1=data[j].radioList[1].channel:listContent[i].radioChannel1="auto";
                                    data[j].radioList[0].channel?listContent[i].radioChannel2=data[j].radioList[0].channel:listContent[i].radioChannel2="auto";
                                }
                            }
                        }
                    }
                    //console.log(listContent,909090);
                    hPending.close();
                    preForm();
                });
            });

        });
        /*匹配在线信息*/
        /*获取设备配置列表*/

    }

    /*添加配置信息*/
    function addSetInfo(listContent,callback){
        $.ajax({
            url: MyConfig.path + "/ant/confmgr",
            type: "POST",
            dataType: "json",
            ContentType: "application/json",
            data:{
                cfgTimeout:60,
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
    };

    /*添加在线状态*/
    function addLineStatues(devList,callback){
        var statuesArr=[];
        for(var i=0;i<devList.length;i++){
            statuesArr.push(devList[i].dev_sn);
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
                listContent=[];
                for(var i=0;i<data.detail.length;i++){
                    for(var j=0;j<devList.length;j++){
                        if(data.detail[i].devSN==devList[j].dev_sn){
                            //alert(555);
                            var singleRecord={
                                'status':data.detail[i].status,
                                'ApName':devList[j].alias_name,
                                'SN':devList[j].dev_sn,
                                'radio1':0,//关
                                'radio2':0,//开
                                'radioChannel1':"auto",//信道6
                                'radioChannel2':"auto",//信道44
                            };
                            listContent.push(singleRecord);
                        }
                    }
                }
                callback(listContent);
            },
            error:function(err){
                hPending&&hPending.close();
                callback("");
            }
        });


    }

    /*获取场所下设备列表详细信息*/
    function getDevInfo(callback){
        var data = {
            "tenant_name": FrameInfo.g_user.attributes.name,
            "nasid": FrameInfo.Nasid
        }

        var ajax = {
            url: "/v3/ace/oasis/oasis-rest-shop/restshop/o2oportal/getDeviceInfoShop",
            type: "POST",
            dataType: "json",
            timeout: 150000,
            contentType: "application/json",
            data:JSON.stringify(data),
            onSuccess: function(data) {
                if(!('dev_list' in data)){
                    console.log('dev_list not exist');
                    return;
                }
                callback(data.dev_list);
            },
            onFailed:function(err){
                //Frame.Msg.error(MyConfig.httperror);
                hPending&&hPending.close();
                callback("");
            }
        }

        Utils.Request.sendRequest(ajax);
    }

    /*获取修改行所有状态*/
    function getAllinfo($this,single){
        if(!$this.children(".target")){
            return single;
        }
        var $target=$this.children(".target");
        var targetId=$target.attr("id");
        switch(targetId){
            /*在线状态*/
            case "status":

                break;
            /*APname*/
            case "ApName":

                break;
            /*DEVsn*/
            case "SN":
                single.devSN=$target.html();
                break;
            /*2.4G开关*/
            case "radio1":
                if($target.hasClass("open")){
                    single.radioList[0].enable=1;
                }else{
                    single.radioList[0].enable=0;
                }
                break;
            /*5G开关*/
            case "radio2":
                if($target.hasClass("open")){
                    single.radioList[1].enable=1;
                }else{
                    single.radioList[1].enable=0;
                }
                break;
            /*2.4G信道*/
            case "radioChannel1":
                if($target.attr("value")=="auto"){
                    single.radioList[0].channel=0;
                }else{
                    single.radioList[0].channel=$target.attr("value")-0;
                }
                break;
            /*5G信道*/
            case "radioChannel2":
                if($target.attr("value")=="auto"){
                    single.radioList[1].channel=0;
                }else{
                    single.radioList[1].channel=$target.attr("value")-0;
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
                devSN:"",
                nasId:FrameInfo.Nasid,
                radioList:[
                    {
                        radio:1,
                        channel:"",
                        enable:""
                    },
                    {
                        radio:2,
                        channel:"",
                        enable:""
                    }
                ]
            };
            $(this).parent().parent().children(".slist-cell").each(function(){
                singleData=getAllinfo($(this),singleData);
            });
            /*添加修改数据并更新修改*/
            submitArr=checkDevice(singleData,submitArr);
            /*修改刷新数据*/
            btnList2=updateReflreshData(singleData,btnList2);
        });
        /*改变信道*/
        $("#radioSet select").off("change");
        $("#radioSet select").on("change",function(){
            /*添加当前修改行*/
            var singleData={
                devSN:"",
                nasId:FrameInfo.Nasid,
                radioList:[
                    {
                        radio:1,
                        channel:"",
                        enable:""
                    },
                    {
                        radio:2,
                        channel:"",
                        enable:""
                    }
                ]
            };
            $(this).parent().parent().children(".slist-cell").each(function(){
                singleData=getAllinfo($(this),singleData);
            });
            /*添加修改数据并更新修改*/
            submitArr=checkDevice(singleData,submitArr);
            /*修改刷新数据*/
            btnList2=updateReflreshData(singleData,btnList2);
            //console.log(singleData,"获取",btnList2);
        })
    }

    /*修改后slist*/
    function changeForm(){
        $("#radioSet").html("");
        var opt = {
            colNames: getRcText ("LIST_TITLE"),
            showHeader: true,
            multiSelect: false,
            showOperation:false,
            pageSize:10,
            onPageChange:function(pageNum,pageSize,oFilter,oSorter){

            },
            colModel: [
                {name:'status', datatype:"String",width:20,formatter:bacStatus},
                {name:'ApName', datatype:"String",width:250,formatter:bacStatus},
                {name:'SN', datatype:"String",width:250,formatter:bacStatus},
                {name:'radio1', datatype:"String",width:250,formatter:bacStatus},
                {name:'radio2', datatype:"String",width:250,formatter:bacStatus},
                {name:'radioChannel1', datatype:"String",width:250,formatter:bacStatus},
                {name:'radioChannel2', datatype:"String",width:250,formatter:bacStatus}
            ],
            buttons:[
                {name:"dev_newadd", enable:true,value:"确认修改",action:submitData},
                {name:"dev_newadd", enable:true,value:"取消",action:preForm}
            ]
        };
        $("#radioSet").SList ("head", opt);
        $("#radioSet").SList ("refresh", btnList2);
        $(".page-next,.page-prev").click(function(){
            $("#radioSet").SList ("refresh", btnList2);
        });
        $(".openORclose").on("click",function(){
            toggleButton($(this));
        });
        /*事件添加*/
        initChange();
    }

    /*表格数据修改及提交信息保存*/
    function initDataChange($this){
        var singleData={
            devSN:"",
            nasId:FrameInfo.Nasid,
            radioList:[
                {
                    radio:1,
                    channel:"",
                    enable:""
                },
                {
                    radio:2,
                    channel:"",
                    enable:""
                }
            ]
        };
        $this.parent().parent().children(".slist-cell").each(function(){
            singleData=getAllinfo($this,singleData);
        });
        /*添加修改数据并更新修改*/
        submitArr=checkDevice(singleData,submitArr);
        /*修改刷新数据*/
        btnList2=updateReflreshData(singleData,btnList2);
        /*console.log(singleData,"获取单行信息");
         console.log(btnList2,"获取更新后刷新数据");
         console.log(submitArr,"获取提交信息");*/
    }

    /*修改状态*/
    function bacStatus(row, cell, value, columnDef, dataContext, type){
        $(".openORclose").click(function(){
            toggleButton($(this));
        });
        var stArr=['stOffline','stOnline'];
        //console.log("row",row,"cell", cell,"value" ,value,"columnDef", columnDef,"dataContext", dataContext,"type", type);
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
            /*APname*/
            case "ApName":
                return '<div id="ApName" class="target">'+dataContext.ApName+'</div>';
                break;
            /*DEVsn*/
            case "SN":
                return '<div id="SN" class="target">'+dataContext.SN+'</div>';
                break;
            /*2.4G开关*/
            case "radio1":
                if(dataContext.radio1==1){
                    return '<div id="radio1" class="ctrl-btn openORclose open status target mp btn float-left btn forbid switch"></div>';
                }else{
                    return '<div id="radio1" class="ctrl-btn openORclose status target mp btn float-left btn forbid switch"></div>';
                }
                break;
            /*5G开关*/
            case "radio2":
                if(dataContext.radio2==1){
                    return '<div id="radio2" class="ctrl-btn openORclose open status mp btn float-left btn target forbid switch"></div>';
                }else{
                    return '<div id="radio2" class="ctrl-btn openORclose status mp btn float-left target btn forbid switch"></div>';
                }
                break;
            /*2.4G信道*/
            case "radioChannel1":
                var rcArr=["auto","1","6","11"];
                var $channel=$("<select id='radioChannel1' class='target'></select>");
                for(var i=0;i<rcArr.length;i++){
                    $channel.append("<option>"+rcArr[i]+"</option>")
                }
                $channel.children("option:eq("+[findIndexArr(dataContext.radioChannel1,rcArr)]+")").attr({"selected":"selected"});
                return $channel;
                break;
            /*5G信道*/
            case "radioChannel2":
                var rcArr2=["auto","36","40","44","48","52","56","60","64","149","153","157","161"];
                var $channel2=$("<select  id='radioChannel2' class='target'></select>");
                for(var i=0;i<rcArr2.length;i++){
                    $channel2.append("<option>"+rcArr2[i]+"</option>")
                }
                $channel2.children("option:eq("+[findIndexArr(dataContext.radioChannel2,rcArr2)]+")").attr({"selected":"selected"});
                return $channel2;
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
            case "ApName":
                alert("ApName");
                break;
            /*2.4G开关*/
            case "radio1":
                if(dataContext.radio1==1){
                    return radioList[1];
                }else{
                    return radioList[0];
                }
                break;
            /*5G开关*/
            case "radio2":
                if(dataContext.radio2==1){
                    return radioList[1];
                }else{
                    return radioList[0];
                }
                break;
            /*2.4G信道*/
            case "radioChannel1":
                var rcArr=["auto","1","6","11"];
                return rcArr[findIndexArr(dataContext.radioChannel1,rcArr)];
                break;
            /*5G信道*/
            case "radioChannel2":
                var rcArr2=["auto","36","40","44","48","52","56","60","64","149","153","157","161"];
                return rcArr2[findIndexArr(dataContext.radioChannel2,rcArr2)];
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
                var singleData={
                    devSN:"",
                    nasId:FrameInfo.Nasid,
                    radioList:[
                        {
                            radio:1,
                            channel:"",
                            enable:""
                        },
                        {
                            radio:2,
                            channel:"",
                            enable:""
                        }
                    ]
                };
                $(this).parent().parent().children(".slist-cell").each(function(){
                    singleData=getAllinfo($(this),singleData);
                });
                /*添加修改数据并更新修改*/
                submitArr=checkDevice(singleData,submitArr);
                /*保存修改界面数据*/
                btnList2=updateReflreshData(singleData,btnList2);
                //console.log(submitArr,btnList2,"提交修改");
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