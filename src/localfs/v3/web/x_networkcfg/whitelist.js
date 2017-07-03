/**
 * Created by Administrator on 2016/11/2.
 */
(function($){
    var MODULE_BASE = "x_networkcfg";
    var MODULE_NAME = MODULE_BASE +　".whitelist";
    var urlArr;
    var flag=true;
    var wFlag=true;
    var delData=[];
    var hPending = null;

    /*获取字符串*/
    function getRcText(sRcName) {
        return Utils.Base.getRcString("auth_rc", sRcName);
    }

    /*showUrlList*/
    function showUrlList(){
            getWhiteUrl(function(data){
            urlArr=[];
            for(var i=0;i<data.length;i++){
                var singleUrl={
                    "freeUrl":data[i].freeUrl
                };
                urlArr.push(singleUrl);
            }
            $("#identification").SList ("refresh", urlArr);
            hPending&&hPending.close();
        });
    }

    /*获取云端URL*/
    function getWhiteUrl(callback){
        $.ajax({
            url:MyConfig.path + "/ant/confmgr",
            type: "POST",
            dataType: "json",
            timeout: 150000,
            ContentType:"application/json",
            data:{
                "cfgTimeout":120,
                "cloudModule":"xiaoxiaobeicfg",
                "configType":1,
                "deviceModule":"xiaoxiaobei",
                "sceneFlag":true,
                "method":"getAuthGlobalCfg",
                "nasId":FrameInfo.Nasid,
                "userName":FrameInfo.g_user.user,
                "shopName":Utils.Device.deviceInfo.shop_name,
                "policy":"cloudFirst",
                "param":[{
                    "switchType":"3",

                    "nasId":FrameInfo.Nasid
                }]
            },
            success:function(data){
                callback(data.result.authWhiteList);
            },
            error:function(err){
                hPending&&hPending.close();
                Frame.Msg.info(getRcText("MSG_INFO2").split(",")[2], "error");//失败
            }
        });
    }

    /*添加校验*/
    function checkUrl(){
        var name = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/;
        $(".addBox input").each(function(){
            $(this).keyup(function(){
                if($(this).val()){
                    if(name.test($(this).val())){
                        $(this).removeClass("errVal");
                    }else{
                        $(this).addClass("errVal");
                    }
                }else{
                    $(this).removeClass("errVal");
                }
            });
        });
    }

    /*删除添加名单*/
    function operatieInput(){
        var $addBtn=$(".addBox .addLine .addBtn");
        var $delBtn=$(".addBox .addLine .delBtn");
        $delBtn.off("click");
        $addBtn.off("click");
        $delBtn.on("click",function(){
            /*if($(".addBox .addLine").length==1){
                Frame.Msg.info();
            }*/
            $(this).parent().parent().remove();
            hideAdd();
        });
        $addBtn.on("click",function(){
            console.log(555);
            var oA=$('<div class="col-xs-12 pos-rel addLine"> <input class="form-control  addData" value="" type="text"> <div class="operateBtn pos-abs"> <div class="delBtn  operateBox">'+getRcText("ID_OPERATION").split(",")[0]+'</div> <div class="addBtn  operateBox">'+getRcText("ID_OPERATION").split(",")[1]+'</div> </div> </div>');
            $(".addBox").append(oA);
            checkUrl();
            hideAdd();
        });
    }

    /*隐藏添加*/
    function hideAdd(){
        var $addLine=$(".addBox .addLine");
        $addLine.each(function(){
            //console.log($(".addBox .addLine").length,$(this).index(),$(this).children().children("div.delBtn").html());
            if($addLine.length==1){
                $(this).children().children("div.delBtn").addClass("hide");
                $(this).children().children("div.addBtn").removeClass("hide");
            }else{
                if($(this).index()==$addLine.length-1){
                    $(this).children().children("div.addBtn").removeClass("hide");
                }else{
                    !$(this).children().children("div.addBtn").hasClass("hide")?$(this).children().children("div.delBtn").removeClass("hide"):"";
                    $(this).children().children("div.addBtn").addClass("hide");
                }
            }
            operatieInput();
        });
    }

    /*数组去重*/
    function bacNuique(arr){
        var arr1=[];
        for(var i=0;i<arr.length;i++){
            var bacFlag=false;
            if(arr1==[]){
                arr1.push(arr[i]);
            }
            for(var j=0;j<arr1.length;j++){
                if(arr1[j].freeUrl==arr[i].freeUrl){
                    bacFlag=true;
                    break;
                }
            }
            if(!bacFlag){
                arr1.push(arr[i]);
            }
        }
        return arr1;
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

    /*添加URL*/
    function addUrl(){
        var newUrlArr=urlArr.slice(0);
        //for(var i=0;i<urlArr.length;i++){
        //
        //}
        flag=true;
        wFlag=true;
        var addData=[];
        $(".addBox .addData").each(function(){
            console.log($(this).val());
            if($(this).hasClass("errVal")){
                flag=false;
            }
            if($(this).val()){
                if(!$(this).hasClass("errVal")){
                    var singleAdd={
                        "freeUrl":$(this).val()
                    };
                    addData.push(singleAdd);
                }
            }else{
                wFlag=false;
            }

        });
        console.log("urlArr,addData",urlArr,addData);
        var addData=$.merge(newUrlArr,addData);
        addData=bacNuique(addData);
        console.log("addData",addData,6766767);
        if(!flag||!wFlag){
            //console.log(flag,wFlag,888)
            Frame.Msg.info(getRcText("ID_MSG").split(",")[0]);
        }else if(addData.length>=11){
            //console.log(flag,wFlag)
            Frame.Msg.info(getRcText("ID_MSG").split(",")[1]);
        }else{
            hPending = Frame.Msg.pending(getRcText("PENDING_MSG").split(",")[0]);
              $.ajax({
                url:MyConfig.path + "/ant/confmgr",
                type: "POST",
                dataType: "json",
                timeout: 150000,
                ContentType:"application/json",
                data:{
                    "cfgTimeout":120,
                    "cloudModule":"xiaoxiaobeicfg",
                    "configType":0,
                    "deviceModule":"xiaoxiaobei",
                    "sceneFlag":true,
                    "method":"AuthGlobal",
                    "nasId":FrameInfo.Nasid,
                    "userName":FrameInfo.g_user.user,
                    "shopName":Utils.Device.deviceInfo.shop_name,
                    "policy":"cloudFirst",
                    //"devSN":g_onLine,
                    "param":[{
                        "switchType":"3",
                        "authWhiteList":addData,
                        "nasId":FrameInfo.Nasid
                    }]
                },
                success:function(data){
                    if(data.serviceResult=="success"){
                        hPending&&hPending.close();
                      //Frame.Msg.info(getRcText("PENDING_MSG").split(",")[5]);
                      /*设备端失败列表*/
                        var g_AllAp=[];
                        for(var i=0;i<data.deviceResults.length;i++){
                            if(data.deviceResults[i].reason == "Failed to set cfg to device."){
                                var singleDev={
                                    "devSN":data.deviceResults[i].devSN,
                                    "devState":""
                                };
                                g_AllAp.push(singleDev);
                            }
                        }
                         if (g_AllAp.length == 0) {
                            hPending=Frame.Msg.info(getRcText("PENDING_MSG").split(",")[5]);
                            //showUrlList();
                             $(".addBox").html('<div class="col-xs-12 pos-rel addLine"> <input class="form-control  addData"  type="text"> <div class="operateBtn pos-abs"><div class="delBtn  hide operateBox">'+getRcText("ID_OPERATION").split(",")[0]+'</div><div class="addBtn  operateBox">'+getRcText("ID_OPERATION").split(",")[1]+'</div></div></div>');
                             operatieInput();
                             checkUrl();
                             setTimeout(function(){
                                 showUrlList();
                             },500);

                            }else{

                            addStatus(g_AllAp,function(g_AllAp){
                            $("#failList").SList("refresh", g_AllAp);
                            Utils.Base.openDlg(null, {}, {scope:$("#failcfgDlg"),className:"modal-large"});
                            $("#failConform").off('click').click(function(){
                            	console.log('bind in success callback')
                                Utils.Pages.closeWindow(Utils.Pages.getWindow($("#failcfgDlg")));
                                setTimeout(function(){
                                    addUrl();
                                },500);
                            });
                            $("#failClose").off('click').click(function(){
                                Utils.Pages.closeWindow(Utils.Pages.getWindow($("#failcfgDlg")));
                                $(".addBox").html('<div class="col-xs-12 pos-rel addLine"> <input class="form-control  addData"  type="text"> <div class="operateBtn pos-abs"><div class="delBtn  hide operateBox">'+getRcText("ID_OPERATION").split(",")[0]+'</div><div class="addBtn  operateBox">'+getRcText("ID_OPERATION").split(",")[1]+'</div></div></div>');
                                operatieInput();
                                checkUrl();
                                setTimeout(function(){
                                    showUrlList();
                                },500);
                            });
                        });
                            }
                        
                        /*setTimeout(function(){
                            showUrlList();
                        },500);*/
                    }else{
                        hPending&&hPending.close();
                        Frame.Msg.info(getRcText("PENDING_MSG").split(",")[6],"error");
                    }

                },
                error:function(err){
                    hPending&&hPending.close();
                    Frame.Msg.info(getRcText("PENDING_MSG").split(",")[6], "error");//失败
                }
            });         
        }
    }

    /*表格删除*/
    function operationDel(delData){
        $.ajax({
            url:MyConfig.path + "/ant/confmgr",
            type: "POST",
            dataType: "json",
            timeout: 150000,
            ContentType:"application/json",
            data:{
                "cfgTimeout":120,
                "cloudModule":"xiaoxiaobeicfg",
                "configType":0,
                "deviceModule":"xiaoxiaobei",
                "sceneFlag":true,
                "method":"DelAuthWhiteList",
                "nasId":FrameInfo.Nasid,
                "userName":FrameInfo.g_user.user,
                "shopName":Utils.Device.deviceInfo.shop_name,
                "policy":"cloudFirst",
                "param":[{
                    "authWhiteList":delData,
                    "nasId":FrameInfo.Nasid
                }]
            },
            success:function(data){
                if(data.serviceResult=="success"){
                    hPending&&hPending.close();
                    /*Frame.Msg.info(getRcText("PENDING_MSG").split(",")[3]);
                    setTimeout(function(){
                        showUrlList();
                    },500);*/
                    var g_AllAp=[];
                    for(var i=0;i<data.deviceResults.length;i++){
                        if(data.deviceResults[i].reason == "Failed to set cfg to device."){
                            var singleDev={
                                "devSN":data.deviceResults[i].devSN,
                                "devState":""
                            };
                            g_AllAp.push(singleDev);
                        }
                    }
                    if (g_AllAp.length == 0) {
                          hPending = Frame.Msg.info(getRcText("PENDING_MSG").split(",")[3]);
                            showUrlList();
                            }
                    else{
                        addStatus(g_AllAp,function(g_AllAp){
                        $("#failList").SList("refresh", g_AllAp);
                        Utils.Base.openDlg(null, {}, {scope:$("#failcfgDlg"),className:"modal-large"});
                        $("#failConform").off('click').click(function(){
                            console.log('bind when del a url')
                            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#failcfgDlg")));
                            setTimeout(function(){
                                operationDel(delData);
                            },500);
                        });
                        $("#failClose").off('click').click(function(){
                            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#failcfgDlg")));
                            //$(".addBox").html('<div class="col-xs-12 pos-rel addLine"> <input class="form-control  addData"  type="text"> <div class="operateBtn pos-abs"><div class="delBtn  hide operateBox">'+getRcText("ID_OPERATION").split(",")[0]+'</div><div class="addBtn  operateBox">'+getRcText("ID_OPERATION").split(",")[1]+'</div></div></div>');
                            delData=[];
                            operatieInput();
                            setTimeout(function(){
                                showUrlList();
                            },500);
                        });
                    });
                    }
                }else{
                    hPending&&hPending.close();
                    Frame.Msg.info(getRcText("PENDING_MSG").split(",")[4],"error");
                }
            },
            error:function(err){
                hPending&&hPending.close();
                Frame.Msg.info(getRcText("PENDING_MSG").split(",")[4],"error");
            }
        });
    }

    /*表格删除筛选*/
    function delUrl(oRowData, type){
        hPending = Frame.Msg.pending(getRcText("PENDING_MSG").split(",")[0]);
        console.log(oRowData,type);
        delData=[];
        for(var i=0;i<oRowData.length;i++){
            var sigleDel={
                "freeUrl":oRowData[i].freeUrl
            };
            delData.push(sigleDel)
        }
        operationDel(delData);
    }

    /*添加多设备在线状态*/
    function addStatus(g_AllAp,callback){
        var g_statues=[];
        for(var i=0;i<g_AllAp.length;i++){
            g_statues.push(g_AllAp[i].devSN);
        }
        var getDevStatusOpt = {
            type:"POST",
            url:"/base/getDevs",
            dataType:"json",
            timeout: 150000,
            data:{
                devSN:g_statues
            },
            onSuccess:function(data){
                for(var i=0;i<data.detail.length;i++){
                    for(var j=0;j<g_AllAp.length;j++){
                        if(data.detail[i].devSN==g_AllAp[j].devSN){
                            g_AllAp[j].devState=getRcText("STATE").split(",")[data.detail[i].status];
                        }
                    }
                }
                callback(g_AllAp);
            },
            onFailed:function(){

            }
        };
        Utils.Request.sendRequest(getDevStatusOpt);
    }

    /*失败列表*/
    function initFailDevGrid() {
        var opt = {
            colNames: getRcText("DEV_LIST"),
            showOperation: false,
            multiSelect: false,
            search: false,
            sortable: false,
            pageSize: 5,
            colModel: [
                {name: 'devSN', datatype: "String"}, //business_name branch_name
                {name: 'devState', datatype: "String"}, //business_name branch_name
            ]
        };
        $("#failList").SList("head", opt);
    }

    function _init(){
        $("#urlChange").click(function(){
            addUrl();
        });
        var opt = {
            /*pageSize,
             oFilter,
             oSorter,*/
            colNames: getRcText ("LIST_TITLE"),
            showHeader: true,
            multiSelect: true,
            showOperation:true,
            //pageSize:10,
            onPageChange:function(pageNum,pageSize,oFilter,oSorter){

            },
            colModel: [
                {name:'freeUrl', datatype:"String"}
            ],
            buttons:[
                {name:"dev_delete", enable:">0",value:getRcText("ID_MSG").split(",")[2],mode:Frame.Button.Mode.DELETE,action:delUrl},
                {name:"delete",enable:true,action:delUrl}
            ]
        };
        $("#identification").SList ("head", opt);
        hPending = Frame.Msg.pending(getRcText("PENDING_MSG").split(",")[2]);
        initFailDevGrid();
        showUrlList();
        hideAdd();
        operatieInput();
        checkUrl();
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