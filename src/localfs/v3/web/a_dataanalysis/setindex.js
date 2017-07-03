(function ($)
{
    var MODULE_NAME = "a_dataanalysis.setindex";
    var g_setIndex = [];
    var index = 0;
    var data = {};
    var g_placeMapdevSN = {};
    var g_devSNMapPlace = {};
    var g_devSNList = {devSNList:[]};
    var g_oldAreaName = "";


    function getRcText(sRcName) {

        return Utils.Base.getRcString("setindex_infor_rc", sRcName);
    }


    function addItem()
    {
        Utils.Base.openDlg(null, {}, {scope: $("#tableDlg"), className: "modal-super"});
        $("#name").val("");
        $("#aplist").val("");
        initSingleSelect();
    }

    function addnewItem()
    {
        var areaName = $("#name").val();
        var placeName = $("#changshuoselect").val();
        var postData = {areaInfo:{}};

        var row = $("#ap_list").SList("getSelectRow");
        var  apSNList = [];

        for(var i = 0; i < row.length; i++)
        {
            apSNList.push({apName:row[i].apName, apSN:row[i].apSN});
        }

        postData.areaInfo.areaName = areaName;
        var devSN = g_placeMapdevSN[placeName];
        postData.areaInfo.devSN = devSN;
        postData.areaInfo.apSNList = apSNList;

        function setAreaInfo(data)
        {
            if(data.errCode == 0)
            {
                showAreaListInfo();
                Utils.Pages.closeWindow(Utils.Pages.getWindow($("#tableForm")));
            }
            else
            {
                Frame.Msg.error(data.errInfo);
            }
        }

        $.ajax({
            url:MyConfig.path +'/data_analysis_read/setareainfo',
            type:'post',
            data:postData,
            dataType:'json',
            success:setAreaInfo,
            error:function(){
                Frame.Msg.error("数据获取失败，请联系客服");
            }
        });
    }

    function deleteitem(odata)
    {
        var devSN = odata[0].devSN;
        var areaName = odata[0].areaName;

        function deleteAreaInfo(data)
        {
            if(data.errCode == 0)
            {
                showAreaListInfo();
            }
            else
            {
                Frame.Msg.error(data.errInfo);
            }
        }

        $.ajax({
            url:MyConfig.path +'/data_analysis_read/deleteareainfo?devSN='+ devSN + "&areaName="+areaName,
            type:'get',
            dataType:'json',
            success:deleteAreaInfo,
            error:function(){
                Frame.Msg.error("数据获取失败，请联系客服");
            }
        });

    }

    function editoldItem()
    {
        var placename = $("#place_name").val();
        var aplist = $("#e_aplist").val();
        var areaName = $("#e_name").val();

        var devSN= g_placeMapdevSN[placename];
        var apNameArr = aplist.split(" ");

        var reqUrl = MyConfig.path +'/apmonitor/getbriefaplist?' + "devSN=" + devSN;

        function getApLIst(data)
        {
            var allApList = data.apList;
            var apList = [];
            var isEditName = 0;

            for(var i = 0; i < apNameArr.length; i ++)
            {
                for(var j = 0; j < allApList.length; j++)
                {
                    if(apNameArr[i] == allApList[j].apName)
                    {
                        apList.push({apName:allApList[j].apName, apSN:allApList[j].apSN});
                        break;
                    }
                }
            }

            if(g_oldAreaName != areaName)
            {
                isEditName = 1;
            }

            var requireData = {apList:[]};
            requireData.apList = apList;

            function setAreaInfo(data)
            {
                if(data.errCode == 0)
                {
                    showAreaListInfo();
                    Utils.Pages.closeWindow(Utils.Pages.getWindow($("#e_tableForm")));
                }
                else
                {
                    Frame.Msg.error(data.errInfo);
                }
            }

            $.ajax({
                url:MyConfig.path +'/data_analysis_read/editareainfo?devSN=' +
                   devSN + "&areaName=" + areaName + "&isEditName=" + isEditName,
                type:'post',
                data:requireData,
                dataType:'json',
                success:setAreaInfo,
                error:function(){
                    Frame.Msg.error("数据获取失败，请联系客服");
                }
            });
        }

        $.ajax({
            url:reqUrl,
            type:'get',
            dataType:'json',
            success:getApLIst,
            error:function(){
                Frame.Msg.error("数据获取失败，请联系客服");
            }
        });

    }

    function editItem(odata)
    {
        Utils.Base.openDlg(null, {}, {scope:$("#e_tableDlg"),className:"modal-super dashboard"});

        $("#e_name").val(odata[0].areaName);
        $("#e_aplist").val(odata[0].apList);
        $("#place_name").val(odata[0].placeName);

        g_oldAreaName = odata[0].areaName;
    }

    function refurbish()
    {
    	showAreaListInfo();
    }

    function showDetail(oRowdata, sName) {
        $("#placeName").text(oRowdata.areaName);
        $("#order").text(oRowdata.placeName);
        $("#bindap").text(oRowdata.apList);
        $("#devSN").text(oRowdata.devSN);

    }

    function initSlistHead()
    {
        var opt = {
            colNames: getRcText("SET_LABELS"),
            showHeader: true,
            showOperation:true,
            multiSelect: true,
            pageSize:10,
            colModel: [
                { name: 'areaName', datatype: "String"},
                { name: 'apList', datatype: "String"},
                { name: 'placeName', datatype: "String"},
                { name: 'devSN', datatype: "String"}
            ],
            onToggle : {
                action : showDetail,
                jScope : $("#ssidToggle"),
                BtnDel : {
                    show : false,
                    //action : onDelSSID
                }
            },
            buttons:[
                {name:"edit", enable:true, action:editItem},
                {name:"delete", enable:true, action:deleteitem},
                {name:"add", enable:true, action:addItem},
                {name:"default",value: "刷新", enable:true, action:refurbish}
            ]
        };

        $("#setindex_list").SList("head", opt);

    }

    function initSlistHead_ap()
    {
        var opt = {
            colNames: getRcText("AP_LIST"),
            showHeader: true,
            //showOperation:true,
            multiSelect: true,
            pageSize:10,
            colModel: [
                { name: 'apName', datatype: "String"},
                { name: 'apSN', datatype: "String"},
                { name: 'des', datatype: "String"}
            ]
        };

        $("#ap_list").SList("head", opt);
    }

    function initSingleSelect()
    {

        function showPlaceList(data)
        {
            var btn_changsuo = [];
            var devSNList = data.devSNList;
            g_devSNList.devSNList = [];

            for(var i = 0; i < devSNList.length; i++)
            {
                btn_changsuo.push(devSNList[i].placeName);
                g_placeMapdevSN[devSNList[i].placeName] = devSNList[i].devSN;
                g_devSNMapPlace[devSNList[i].devSN] = devSNList[i].placeName;
                g_devSNList.devSNList.push({devSN:devSNList[i].devSN});
            }

            $("#changshuoselect").singleSelect("InitData", btn_changsuo);
        }

        $.ajax({
            url:MyConfig.path +'/data_analysis_read/getdevsn',
            type:'get',
            dataType:'json',
            success:showPlaceList,
            error:function(){
                Frame.Msg.error("数据获取失败，请联系客服");
            }
        });
    }


    function showAreaListInfo()
    {
        function displayAreaList(data)
        {
            if(data.errInfo == null)
            {
                var dataList = data.dataList;
                var refreshList = [];
                for(var i = 0; i < dataList.length; i++)
                {
                    var areaList = dataList[i].areaList;
                    var placeName = dataList[i].placeName;
                    var devSN = dataList[i].devSN;

                    for(var j = 0; j < areaList.length; j ++)
                    {
                        var apList = "";
                        for(var k =0; k < areaList[j].apSNList.length; k++)
                        {
                            apList += " "+ areaList[j].apSNList[k].apName;
                        }
                        refreshList.push({placeName:placeName, devSN:devSN, areaName:areaList[j].areaName,
                            apList:apList});
                    }
                }

                $("#setindex_list").SList("refresh", refreshList);
            }
            else
            {
                Frame.Msg.error(data.errInfo);
            }
        }

        $.ajax({
            url:MyConfig.path +'/data_analysis_read/getareainfo',
            type:'get',
            dataType:'json',
            success:displayAreaList,
            error:function(){
                Frame.Msg.error("数据获取失败，请联系客服");
            }
        });

    }

    function showApList(placeName)
    {
        var devSN = g_placeMapdevSN[placeName];
        var reqUrl = MyConfig.path +'/apmonitor/getbriefaplist?' + "devSN=" + devSN;

        function displayApList(data)
        {
            $("#ap_list").SList("refresh", data.apList);
        }

        $.ajax({
            url:reqUrl,
            type:'get',
            dataType:'json',
            success:displayApList,
            error:function(){
                Frame.Msg.error("数据获取失败，请联系客服");
            }
        });
    }

    function showOnlyNotSetApList(placeName)
    {
        var devSN = g_placeMapdevSN[placeName];
        var reqUrl = MyConfig.path +'/apmonitor/getbriefaplist?' + "devSN=" + devSN;

        function getAllApList(data)
        {
            var allApList = data.apList;

            function getApecialAreaInfo(data)
            {
                var areaList =  data.areaList;
                for(var i= 0; i < areaList.length; i++)
                {
                    for(var j= 0; j < areaList[i].apSNList.length; j ++)
                    {
                        for(var k= 0; k < allApList.length; k++)
                        {
                            if(allApList[k].apSN == areaList[i].apSNList[j].apSN)
                            {
                                allApList.splice(k, 1);
                                break;
                            }
                        }
                    }
                }

                $("#ap_list").SList("refresh", allApList);
            }

            $.ajax({
                url:MyConfig.path + '/data_analysis_read/getspecialareainfo?devSN=' + devSN,
                type:'get',
                dataType:'json',
                success:getApecialAreaInfo,
                error:function(){
                    Frame.Msg.error("数据获取失败，请联系客服");
                }
            });


        }

        $.ajax({
            url:reqUrl,
            type:'get',
            dataType:'json',
            success:getAllApList,
            error:function(){
                Frame.Msg.error("数据获取失败，请联系客服");
            }
        });
    }

    function initGrid()
    {
        initSlistHead();
        initSlistHead_ap();
    }


    function getSelectap()
    {
        var row = $("#ap_list").SList("getSelectRow");

        var name = " ";
        for (var i = 0; i < row.length; i++)
        {
            name += row[i].apName;
        }
        $("#aplist").val(name);
        $("#e_aplist").val(name);
    }

    function selectap()
    {
        var placeName = $("#changshuoselect").val();
        showOnlyNotSetApList(placeName);

        Utils.Base.openDlg(null, {}, {scope: $("#tableDlg_ap"), className: "modal-super"});
    }

    function selectap_edit()
    {
        var placeName = $("#place_name").val();
        showApList(placeName);

        Utils.Base.openDlg(null, {}, {scope: $("#tableDlg_ap"), className: "modal-super"});
    }

    function initForm()
    {
        $("#selectap").on("click", selectap);
        $("#e_selectap").on("click", selectap_edit);
        $("#success_aplist, #e_success_aplist").on("click", getSelectap);

        $("#success_add").on("click", addnewItem);
        $("#success_edit").on("click", editoldItem);
    }

    function _init()
    {

        initGrid();
        initForm();
        initSingleSelect();
        showAreaListInfo();
    }

    function _destroy()
    {

    }

    function _resize()
    {

    }
    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["Echart","Form","SList","Minput", "SingleSelect"],
        "utils": ["Base", "Device","Request"]
    });
}) (jQuery);