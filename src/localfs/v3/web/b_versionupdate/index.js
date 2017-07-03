
(function ($)
{
    var MODULE_NAME = "b_versionupdate.index";
    var g_jForm,g_oPara,model;
    var g_aforgeData = [{
        url: "lvzhouv6.h3c.com",
        size: "23",
        type: "1",
        version: "2.4.5",
        description: "xxx"
    },{
        url: "lvzhouv6.h3c.com",
        size: "23",
        type: "1",
        version: "7.1.64.12.22",
        description: "xxx"
    }];
    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("device_infor_rc", sRcName);
    }

    function offdownshow(aRows)
    {
        var bshow = false;
        aRows.length == 1 ? bshow = true : bshow = false;
        return bshow;
    }

    function initGrid(){
        var versionopt = {
            colNames: getRcText ("Version_HEADER"),
            showHeader: true,
            multiSelect : true,
            showOperation:true,
            colModel: [
                {name:'url', datatype:"String"},
                {name:'size', datatype:"String"},
                {name:'type', datatype:"String"},
                {name:'version', datatype:"String"},
                {name:'description', datatype:"String"}
            ],
            buttons:[
                {name:"verdownload",value:getRcText ("DOWNLOAD"),enable:offdownshow,mode:{icons: {primary: "fa fa-cloud-download"}},action:downloadVersion},
                {name:"offdownload",value:getRcText ("OFFDOWNLOAD"),enable:offdownshow,mode:{icons: {primary: "fa fa-download"}},action:offdownload},
                {name:"default",value:getRcText ("REBOOTDOWN"),enable:offdownshow,mode:{icons: {primary: "fa fa-power-off"}}},
                {name:"default",value:getRcText ("SAVEREBOOTDOWN"),enable:offdownshow,mode:{icons: {primary: "fa fa-floppy-o"}}}
            ]

        };
        $("#device_version_list").SList ("head", versionopt);


        /*应用分析特征库 start*/
        var updateopt = {
            colNames: getRcText ("DPI_HEADER"),
            showHeader: true,
            multiSelect : true ,
            colModel: [ 
                {name:'fileName', datatype:"String"},
                {name:'fileSize', datatype:"String"},
                {name:'version', datatype:"String"},
                {name:'desc', datatype:"String"}
            ],
            buttons:[
                {name:"download",value:getRcText ("DOWNLOAD"),mode:Frame.Button.Mode.DOWNLOAD,action:dpidownloadVersion},
                {name:"offdownload",value:getRcText ("OFFDOWNLOAD"),mode:Frame.Button.Mode.DOWNLOAD,action:dpioffdownloadVersion}
            ]
        };
        $("#apply_info_list").SList ("head", updateopt);
        /*应用分析特征库 end*/


        var updateopt = {
            colNames: getRcText ("Version_HEADER"),
            showHeader: true,
            multiSelect : true ,
            colModel: [
                {name:'url', datatype:"String"},
                {name:'size', datatype:"String"},
                {name:'type', datatype:"String"},
                {name:'version', datatype:"String"},
                {name:'description', datatype:"String"}
            ],
            buttons:[
                {name:"verdownload",value:getRcText ("DOWNLOAD"),enable:offdownshow,mode:Frame.Button.Mode.DOWNLOAD,action:downloadVersion},
                {name:"offdownload",value:getRcText ("OFFDOWNLOAD"),enable:offdownshow,mode:Frame.Button.Mode.DOWNLOAD,action:downloadVersion}
            ]
        };
        $("#apply_info_list").SList ("head", updateopt);
        var updateopt = {
            colNames: getRcText ("Version_HEADER"),
            showHeader: true,
            multiSelect : true ,
            colModel: [
                {name:'url', datatype:"String"},
                {name:'size', datatype:"String"},
                {name:'type', datatype:"String"},
                {name:'version', datatype:"String"},
                {name:'description', datatype:"String"}
            ],
            buttons:[
                {name:"verdownload",value:getRcText ("DOWNLOAD"),enable:offdownshow,mode:Frame.Button.Mode.DOWNLOAD,action:downloadVersion},
                {name:"offdownload",value:getRcText ("OFFDOWNLOAD"),enable:offdownshow,mode:Frame.Button.Mode.DOWNLOAD,action:downloadVersion}
            ]
        };
        $("#station_type_list").SList ("head", updateopt);

        var apversionopt = {
            colNames: getRcText ("Version_HEADER"),
            showHeader: true,
            multiSelect : true ,
            colModel: [
                {name:'url', datatype:"String"},
                {name:'size', datatype:"String"},
                {name:'type', datatype:"String"},
                {name:'version', datatype:"String"},
                {name:'description', datatype:"String"}
            ],
            buttons:[
                {name:"verdownload",value:getRcText ("DOWNLOAD"),enable:offdownshow,mode:Frame.Button.Mode.DOWNLOAD,action:downloadVersion},
                {name:"offdownload",value:getRcText ("OFFDOWNLOAD"),enable:offdownshow,mode:Frame.Button.Mode.DOWNLOAD,action:downloadVersion}
            ]
        };
        $("#apversion_info_list").SList ("head", apversionopt);

    }

    function offdownload(rowData)
    {
        window.location.href=rowData[0].url;
    }
    function downloadVersion(rowData){
        var error_message=getRcText ("DOWNLOAD_ERROR").split(",");
        if(rowData.length == 1){
            var data = {
                "tenant_name":FrameInfo.g_user.attributes.name,
                "dev_sn":FrameInfo.ACSN,
                "file_size":rowData[0].bkSize,
                "devVersionUrl":rowData[0].url
            }
            $.ajax({
                url: MyConfig.v2path+"/upgradeDevice",
                type: "POST",
                dataType: "json",
                contentType: "application/json",
                data:JSON.stringify(data),
                success: function(data) {
                    if(data.retCode == 0){
                        Frame.Msg.info(error_message[0]);
                    }else{
                        Frame.Msg.info(error_message[1]);
                    }
                },
                error:function(err){
                    // Frame.Msg.error(MyConfig.httperror);
                }
            });
        }else{
            Frame.Msg.error(error_message[2]);
        }

    }
    function initForm()
    {
        
        $.ajax({
            type: "GET",
            url: MyConfig.path+"/devmonitor/web/system?devSN=" + FrameInfo.ACSN,
            dataType: "json",
            success: function(data){
                var model1 = data["devMode"];
                $.ajax({
                    url: MyConfig.v2path+"/getModelVersion?model="+model1,
                    type: "GET",
                    dataType: "json",
                    contentType: "application/json",
                    success: function(data) {
                        var versionlist=[];
                        if(data.error_code==0){
                            $.each(data.data,function(key,value){
                                var version ={};
                                version.url=value.url;
                                version.size=(value.size/(1024*1024)).toFixed(2);
                                version.type=getRcText("VERSION_TYPE").split(",")[value.type];
                                version.version=value.version;
                                version.description=value.description;
                                version.bkSize = value.size;
                                versionlist.push(version);
                            })
                        }
                        //else{
                        //    Frame.Msg.info(data.error_message);
                        //
                        //}

                        $("#device_version_list").SList ("refresh", versionlist);
                        $("#apversion_info_list").SList ("refresh", g_aforgeData);
                       // $("#apply_info_list").SList ("refresh", g_aforgeData);
                        $("#station_type_list").SList ("refresh", g_aforgeData);
                    },
                    error:function(err){   
                    }
                });
            }
        })          
    }






    /*应用分析特征库代码  start*/
    function dpioffdownloadVersion(rowData)
    {
        window.location.href=rowData[0].fileName;
    }
    function dpidownloadVersion(rowData)
    {
        var error_message=getRcText ("DOWNLOAD_ERROR").split(",");
        if(rowData.length == 1)
        {
            $.ajax({
                url: MyConfig.path+"/ant/confmgr",
                dataType: "json",
                type:"post",
                data:{
                    deviceModule: 'DRS',
                    method:'updateSignature',
                    param:
                    {
                        signatureType:'url',
                        signatureTimeout:'200',
                        downloadUrl:"lvzhouv3.h3c.com/v3/ant/dpi_signature/download/"+rowData[0].fileName,
                        fileName: rowData[0].fileName
                    }
                },
                success: function (data)
                {
                    if(data.communicateResult == "success")
                    {
                        if(data.deviceResult == "success")
                        {
                            Frame.Msg.error(error_message[0]);
                        }
                        else{
                            Frame.Msg.error(error_message[1]);
                        }

                    }
                    else
                    {
                        Frame.Msg.error(error_message[1]);
                    }

                },
            });
        }
        else{
            Frame.Msg.error(error_message[2]);
        }

    }
    function initDpi()
    {
        $.ajax({
            url: MyConfig.path+"/ant/dpi_signature",
            dataType: "json",
            type:"post",
            data:{
                method:'getSignature',
            },
            success: function (data)
            {
                var aData = data.result;
                for(var i=0;i<aData.length;i++)
                {
					delete aData[i].filePath;
                    delete aData[i].user;
                    delete aData[i].stamp;
                    delete aData[i].signatureType;
                }
                $("#apply_info_list").SList ("refresh", aData);
            },
        });
    }
    /*应用分析特征库代码  end*/
    function _init(oPara)
    {
        if (FrameInfo.Model != '2')
        {
            $("#verlist").show();
            $("#applyDB").show();
            $("#StationTypeDB").show();
        };
        initDpi();  // 应用分析特征库
        initForm();
        initGrid();
    }

    function _destroy()
    {

    }

    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList","Form"],
    });
}) (jQuery);
