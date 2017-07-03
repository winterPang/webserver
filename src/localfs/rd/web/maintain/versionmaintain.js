(function($){

    var MODULE_BASE = "maintain";
    var MODULE_NAME = MODULE_BASE + ".versionmaintain";
    var g_AcVersionType = [,"正式版本","开发版本","安全补丁版本"];
    var g_errorMessage = ["请选择版本","升级成功","升级失败","只能选择一个版本"];
    var g_acSN;
    var g_interval;

    function getRcText(sRcName){

        return Utils.Base.getRcString("versionmaintain_rc",sRcName)
    }

    function downloadshow(oRows){

        var bShow = false;
        if( oRows.length == 1){
            bShow = true;
        }
        return bShow;
    }

    function initGrid(){

        //AP版本
        var opt_ApHead = {
            colNames:getRcText("ApTitle"),
            showHeader:true,
            multiSelect:true,
            showOperation:false,
            colModel:[
                {name:"version",datatype:"String"},
                {name:"type",datatype:"String"},
                {name:"size",datatype:"String"},
                {name:"description",datatype:"String"},
                {name:"address",datatype:"String"}
            ],
            buttons:[
                {name:"default",value:"升级版本",enable:downloadshow,mode:Frame.Button.Mode.DOWNLOAD,action:test},
                {name:"default",value:"离线下载",enable:downloadshow,mode:Frame.Button.Mode.DOWNLOAD,action:test}
            ]
        };
            $("#APVersion").SList("head",opt_ApHead);

        //应用分析特征库
        var opt_applicationAnalyseHead = {
            colNames:getRcText("applicationAnalyseTitle"),
            multiSelect:true,
            showHeader:true,
            showOperation:false,
            colModel:[
                {name:"version",datatype:"String"},
                {name:"type",datatype:"String"},
                {name:"size",datatype:"String"},
                {name:"description",datatype:"String"},
                {name:"address",datatype:"String"}
            ],
            buttons:[
                {name:"default",value:"升级版本",enable:downloadshow,mode:Frame.Button.Mode.DOWNLOAD,action:test},
                {name:"default",value:"离线下载",enable:downloadshow,mode:Frame.Button.Mode.DOWNLOAD,action:test}
            ]
        };
            $("#applicationAnalyse").SList("head",opt_applicationAnalyseHead);

        //终端类型特征库
        var opt_clientTypeHead = {
            colNames:getRcText("clientTypeTitle"),
            multiSelect:true,
            showHeader:true,
            showOperation:false,
            colModel:[
                {name:"version",datatype:"String"},
                {name:"type",datatype:"String"},
                {name:"size",datatype:"String"},
                {name:"description",datatype:"String"},
                {name:"address",datatype:"String"}
            ],
            buttons:[
                {name:"default",value:"升级版本",enable:downloadshow,mode:Frame.Button.Mode.DOWNLOAD,action:test},
                {name:"default",value:"离线下载",enable:downloadshow,mode:Frame.Button.Mode.DOWNLOAD,action:test}
            ]
        };
            $("#clientType").SList("head",opt_clientTypeHead);
    }

    function initGrid2(){

        //设备版本
        var opt_AcHead = {
            colNames:getRcText("AcTitle"),
            showHeader:true,
            multiSelect:true,
            showOperation:false,
            colModel:[
                {name:"version",datatype:"String"},
                {name:"type",datatype:"String"},
                {name:"size",datatype:"String"},
                {name:"description",datatype:"String"}
            ],
            buttons:[
                {name:"default",value:"升级版本",enable:downloadshow,mode:{icons:{primary:"fa fa-cloud-download"}},action:downloadVersion},
                {name:"default",value:"离线下载",enable:downloadshow,mode:{icons: {primary:"fa fa-download"}},action:offlineDownload}
            ]
        };
        $("#ACVersion").SList("head",opt_AcHead);
    }

    /*升级版本按钮对应的action操作*/
    function downloadVersion(oRowData){

        if( oRowData.length == 0){

            Frame.Msg.error(g_errorMessage[0]);

        }
        else if( oRowData.length == 1) //只有选中一个版本才能进行升级操作
        {
            Frame.Msg.confirm("确定升级版本？",function(){

                $.ajax({
                    url:MyConfig.path + '/base/updateDev',
                    type:'post',
                    dataType:'json',
                    contentType:"application/json",
                    data:JSON.stringify({
                        devSN:g_acSN,
                        fileSize:oRowData[0].bkSize,
                        devVersionUrl:oRowData[0].url,
                        saveConfig:1,
                        rebootDev:1
                    }),
                    success:function(data){

                        //retCode  0表示websocket消息下发设备成功，1表示无权限，2表示主连接不存在，3设备正在升级，4其他错误
                        if( data["retCode"] == 0){

                            /*获取设备下载版本进度显示在页面上*/
                            getDownLoadStatus();
                        }
                        else if( data["retCode"] == 1)
                        {
                            Frame.Msg.info(g_errorMessage[2]);
                        }
                        else if( data["retCode"] == 2)
                        {
                            Frame.Msg.error("设备连接异常");
                        }
                        else if( data["retCode"] == 3)
                        {
                            Frame.Msg.error("设备正在升级");
                        }
                        else if( data["retCode"] == 4)
                        {
                            Frame.Msg.error("其他错误");
                        }
                    },
                    error:function(){

                    }
                })
            });
        }
        else
        {
            Frame.Msg.error(g_errorMessage[3]);
        }
    }

    /*获取设备下载版本进度显示在页面上*/
    function getDownLoadStatus(){

        var jDlg = $("#modalDlg");

        var jScope = {scope:jDlg,className:'modal-super'};

        Utils.Base.openDlg(null,{},jScope);

        /*版本下载进度条数据显示*/
        downloadPercent();
    }


    /*版本下载进度条数据显示*/
    function downloadPercent(){

        var options = {porcentaje:0,estilo:"obi"};
        var ProgressBarWars = $("#obi");
        var theidProgressBarWars= "obi";
        var styleUnique = Date.now();

        defaults = {
            porcentaje:"100",
            tamanio:"30%",
            alto:"8px",
            color:"blue"
        };

        var opciones = $.extend({}, defaults, options);

        if(opciones.color!=''){

            StringStyle="<style>.color"+styleUnique+"{ border-radius: 2px;display: block; width: 0%; box-shadow:0px 0px 10px 1px "+opciones.color+", 0 0 1px "+opciones.color+", 0 0 1px "+opciones.color+", 0 0 1px "+opciones.color+", 0 0 1px "+opciones.color+", 0 0 1px "+opciones.color+", 0 0 1px "+opciones.color+";background-color: #fff;}</style>";opciones.estilo="color"+styleUnique;

        }

        $(ProgressBarWars).before(StringStyle);

        $(ProgressBarWars).append('<span class="barControl" style="width:'+opciones.tamanio+';"><div class="barContro_space"><span class="'+opciones.estilo+'" style="height: '+opciones.alto+';"  id="bar'+theidProgressBarWars+'"></span></div></span>');



        /*循环定时器每隔两秒钟去获取下设备版本下载进度*/
         g_interval = setInterval(function(){

            /*向base微服务发送请求获取下载数据*/
            getPercent(function(data){

                var percent = data.percent;
                var status = data.status;

                /*进度条的生成和进度显示*/
                $("#percent").html(percent+"%");
                $("#bar"+theidProgressBarWars).animate({width:percent+"%"});

                if(percent == 100){

                    $("#versionDescripe").html("版本解压中");

                    //1--设备重启完毕;2--下载失败;3—设备空间不足;4--保存配置失败; 5--其他错误
                    if(status == 1){

                        clearInterval(g_interval);
                        $("#versionDescripe").html("设备重启完毕");
                        $("#close").removeAttr("disabled");
                    }
                    else if(status == 2){

                        clearInterval(g_interval);
                        $("#versionDescripe").html("版本解压失败");
                        $("#close").removeAttr("disabled");
                    }
                    else if( status == 3){

                        clearInterval(g_interval);
                        $("#versionDescripe").html("设备空间不足");
                        $("#close").removeAttr("disabled");
                    }
                    else if( status == 4){

                        clearInterval(g_interval);
                        $("#versionDescripe").html("保存配置失败");
                        $("#close").removeAttr("disabled");
                    }
                    else if( status == 5){

                        clearInterval(g_interval);
                        $("#versionDescripe").html("未知错误,请联系客服");
                        $("#close").removeAttr("disabled");
                    }
                }
            });
        },3000)
    }

    /*查看设备下载版本进度*/
    function getPercent(callback){

        $.ajax({
            url:MyConfig.path + "/base/getUpdateStatus",
            type:'post',
            dataType:'json',
            data:{
                devSN:g_acSN
            },
            success:function(data){

                callback(data);
            },
            error:function(){

            }
        })
    }

    /*离线下载按钮对应的action操作*/
    function offlineDownload(oRowData){

        if( oRowData.length == 0)
        {
            Frame.Msg.error(g_errorMessage[0]);
        }
        else if( oRowData.length == 1) //只能选择一个版本进行离线下载
        {
            window.location.href = oRowData[0].url;
        }
        else
        {
            Frame.Msg.error(g_errorMessage[3]);
        }
    }

    /*AP版本，应用分析，终端类型三个列表暂时不显示数据，所以按钮对应的action操作只显示正在开发中*/
    function test(oRowData){

        Frame.Msg.error("正在开发中......");
    }

    function initForm(){

        $("#success").on("click",function(){
            var ACSN = $("#devSN").val();
            $("#devSN").val("");
            g_acSN = ACSN;

            if(ACSN == ""){
                $("#errorMessage").html("设备序列号不能为空");
                $("#errorMessage").css("width","200px");
                $("#errorMessage").show();
                $('input[name=devSN]').css("border","1px solid #a94442");
                $("#devSN").addClass('warning');
                return;
            }

            //查看当前设备为何场景设备
            $.ajax({
                url:MyConfig.path + "/v3/scenarioserver",
                type:'post',
                dataType:'json',
                headers:{Accept:"application/json"},
                contentType: "application/json",
                data:JSON.stringify({
                    Method:"getdevListBySNs",
                    param:{
                        devList:[ACSN]
                    }
                }),
                success:function(data){

                    //取出设备所属model
                    var model;
                    if( data.message[0] != undefined ){
                        model = data.message[0].model;
                    }
                    //判断devSN是否存在
                    judgeDevsnExist(model);
                },
                error:function(){

                }
            });

            //ACSN发送到服务端进行匹配是否存在
            function judgeDevsnExist(model) {

                $.ajax({
                    url: MyConfig.path + '/devmonitor/web/system?devSN=' + ACSN,
                    type: 'get',
                    dataType: 'json',
                    success: function (data) {

                        if (data.hasOwnProperty("errcode")) {
                            $("#errorMessage").html("设备与云端断开连接或者设备号不存在");
                            $("#errorMessage").css("width","300px");
                            $("#errorMessage").show();
                            $('input[name=devSN]').css("border","1px solid #a94442");
                            $("#devSN").addClass('warning');
                        }
                        else {
                            $("#filterDevSN").addClass('hide');
                            $("#ACList").removeClass('hide');
                            //默认只显示AC版本列表
                            initGrid2();
                            //当model不是2才显示所有list列表
                            if( model != "2"){
                                $("#APList").removeClass('hide');
                                $("#applicationAnalyseList").removeClass('hide');
                                $("#clientTypeList").removeClass('hide');
                                //显示三个列表头部
                                initGrid();
                            }

                            var deviceMode = data["devMode"];
                            if (deviceMode.indexOf("H3C") >= 0) {
                                deviceMode = deviceMode.split("H3C")[1].trim();
                            }

                            //获取设备版本数据
                            initData(deviceMode);
                            /*获取应用分析特征库*/
                            getApplicationAnalyseData();
                        }
                    },
                    error: function () {

                    }
                })
            }
        });

        $("#close").on("click",function(){

            $("#modalDlg").modal('hide');
            $("#close").attr("disabled","disabled");
            $("#obi").empty();
        });


        $('input[name=devSN]').on("mousedown",function(){
            var value = $('input[name=devSN]').hasClass('warning');
            if(value == true){
                $("#errorMessage").html("");
                $("#errorMessage").hide();
                $("#devSN").css("border","1px solid #71858e");
                $("#devSN").removeClass('warning');
            }
        })
    }

    function initData(deviceMode){

        //从二期获取设备版本数据
        $.ajax({
            url:MyConfig.path +'/ace/o2oportal/getModelVersion?model=' + deviceMode,
            type:'get',
            dataType:'json',
            contentType: "application/json",
            success:function(data){

                /*解析设备版本数据信息*/
                analyseAcVersionData(data);
            },
            error:function(){

            }
        })
    }

    /*解析设备版本数据,写入页面列表中*/
    function analyseAcVersionData(data){

        var ACVersionData = new Array();
        if(data["error_code"] == 0){
            var listData = data.data_list;
            for(var i = 0 ; i < listData.length ; i++){
                var temp = {};
                temp.url = listData[i].url;
                temp.bkSize = listData[i].size;
                temp.version = listData[i].version;
                temp.type = g_AcVersionType[listData[i].type];
                temp.size = (listData[i].size/(1024*1024)).toFixed(2);
                temp.description = listData[i].description;
                ACVersionData.push(temp);
            }
        }
            $("#ACVersion").SList("refresh",ACVersionData);
    }

    /*获取应用分析特征库数据*/
    function getApplicationAnalyseData(){

        $.ajax({
            url:MyConfig.path + '/ant/dpi_signature',
            type:'post',
            dataType:'json',
            data:{
                method:'getSignature'
            },
            success:function(data){

                /*解析应用分析数据*/
                analyseApplyAnalyseData(data);
            },
            error:function(){

            }
        })
    }

    /*解析应用分析数据,写入列表中*/
    function analyseApplyAnalyseData(data){

        var oData = data.result || [];
        for( var i = 0 ; i < oData.length ; i++){
            delete oData[i].filePath;
            delete oData[i].user;
            delete oData[i].stamp;
            delete oData[i].signatureType;
        }
        $("#applicationAnalyse").SList("refresh",oData);
    }

    function _init(){

        initForm();
    }

    function _destroy(){

        clearInterval(g_interval);
    }

    Utils.Pages.regModule(MODULE_NAME,{
        "init":_init,
        "destroy":_destroy,
        "widgets":["SList","Mlist"],
        "Utils":["Request","Msg"]
    })
})(jQuery);