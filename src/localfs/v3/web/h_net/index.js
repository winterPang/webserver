(function ($)
{
    var MODULE_NAME = "h_net.index";

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("net_rc", sRcName);

    }

    function showLink(row, cell, value, columnDef, dataContext, type)
    {
        value = value || "";

        if("text" == type)
        {
            return value;
        }

        return '<a class="list-link" cell="'+cell+'">'+value+'</a>';
    }

    function onDisDetail()
    {
        var oData = $("#net_list").SList("getSelectRow")[0];
        var sType = $(this).attr("cell");
        if(sType == 0)
        {
            //showWirelessInfo(oData);
            showFlowInfo(oData);
        }
        else
        {
            showFlowInfo(oData);
        }
    }

    function showFlowInfo(oData)
    {
        /*var aType = [];
        for(i = 0; i < 4; i++)
        {
            var oo = {
                wifi:getRcText("HIDE").split(",")[i],
                hide:getRcText("HIDE" + i)
            }
            aType.push(oo);
        }*/
        /* end */
        var tempData9 = [];
        tempData9.push(
            {
                state1:getRcText("STATE"),
                tag1:"586a-b126-b240",
                num1:"210235A1GRC151000040",
                lable1:getRcText("LOCATION"),
                type1:"WA4320i-X"
            },
            {
                state1:getRcText("STATE"),
                tag1:"3c8c-4042-34e0",
                num1:"210235A1GUC151000003",
                lable1:getRcText("LOCATION"),
                type1:"WA4320-ACN"
            },
            {
                state1:getRcText("STATE"),
                tag1:"3c8c-4042-34c0",
                num1:"210235A1GUC151000010",
                lable1:getRcText("LOCATION"),
                type1:"WA4320-ACN"
            },
            {
                state1:getRcText("STATE"),
                tag1:"70ba-efba-5ba0",
                num1:"210235A1GPC14C000043",
                lable1:getRcText("LOCATION"),
                type1:"WA4320i-ACN"
            },
            {
                state1:getRcText("STATE"),
                tag1:"586a-b126-b240",
                num1:"210235A1GRC151000040",
                lable1:getRcText("LOCATION"),
                type1:"WA4320i-X"
            },
            {
                state1:getRcText("STATE"),
                tag1:"3c8c-4042-34e0",
                num1:"210235A1GUC151000003",
                lable1:getRcText("LOCATION"),
                type1:"WA4320-ACN"
            },
            {
                state1:getRcText("STATE"),
                tag1:"3c8c-4042-34c0",
                num1:"210235A1GUC151000010",
                lable1:getRcText("LOCATION"),
                type1:"WA4320-ACN"
            }
        );
        $("#flowdetail_list").SList ("refresh", tempData9);
        //$("#flowdetail_list").SList ("refresh", aType);
        /* 缁勭粐濂芥暟鎹悗 */
        Utils.Base.openDlg(null, {}, {scope:$("#flowdetailDlg"),className:"modal-super"});
    }

    function draw(){
        var opt1 = {
            height:"",
            showHeader: true,
            multiSelect: false,
            pageSize : 11,
            colNames: getRcText ("NET_ITEM"),
            colModel: [
                {name: "wifi", datatype: "String",width:100,formatter:showLink},//wifi名称
                {name: "hide", datatype: "String",width:100},//隐藏
                {name: "upload", datatype: "String",width:100},//上传速率
                {name: "download", datatype: "String",width:100},//下载速率
                {name: "encryption", datatype: "String",width:100},//加密
                {name: "state", datatype: "String",width:100},//状态
            ],
            buttons:[
                {name: "default", value:getRcText ("FRESH"), action: Fresh}
            ]
        };
        $("#net_list").SList ("head", opt1);
        $("#net_list").on('click', 'a.list-link', onDisDetail);

        var tempData1 = [];
        tempData1.push(
            {
                wifi:"h3c-lvzhou",
                hide:getRcText("HIDE"),
                upload:"2000 Kbps",
                download:"2000 Kbps",
                encryption:getRcText("ENCRYPTION"),
                state:getRcText("OFF"),
            },
            {
                wifi:"h3c-lvzhou",
                hide:getRcText("HIDE"),
                upload:"2000 Kbps",
                download:"2000 Kbps",
                encryption:getRcText("ENCRYPTION"),
                state:getRcText("ON"),
            },
            {
                wifi:"h3c-lvzhou",
                hide:getRcText("HIDE"),
                upload:"2000 Kbps",
                download:"2000 Kbps",
                encryption:getRcText("ENCRYPTION"),
                state:getRcText("ON"),
            },
            {
                wifi:"h3c-lvzhou",
                hide:getRcText("HIDE"),
                upload:"2000 Kbps",
                download:"2000 Kbps",
                encryption:getRcText("ENCRYPTION"),
                state:getRcText("ON"),
            },
            {
                wifi:"h3c-lvzhou",
                hide:getRcText("HIDE"),
                upload:"2000 Kbps",
                download:"2000 Kbps",
                encryption:getRcText("ENCRYPTION"),
                state:getRcText("ON"),
            },
            {
                wifi:"h3c-lvzhou",
                hide:getRcText("HIDE"),
                upload:"2000 Kbps",
                download:"2000 Kbps",
                encryption:getRcText("ENCRYPTION"),
                state:getRcText("ON"),
            },
            {
                wifi:"h3c-lvzhou",
                hide:getRcText("HIDE"),
                upload:"2000 Kbps",
                download:"2000 Kbps",
                encryption:getRcText("ENCRYPTION"),
                state:getRcText("ON"),
            },
            {
                wifi:"h3c-lvzhou",
                hide:getRcText("HIDE"),
                upload:"2000 Kbps",
                download:"2000 Kbps",
                encryption:getRcText("ENCRYPTION"),
                state:getRcText("OFF"),
            },
            {
                wifi:"h3c-lvzhou",
                hide:getRcText("HIDE"),
                upload:"2000 Kbps",
                download:"2000 Kbps",
                encryption:getRcText("ENCRYPTION"),
                state:getRcText("ON"),
            },
            {
                wifi:"h3c-lvzhou",
                hide:getRcText("HIDE"),
                upload:"2000 Kbps",
                download:"2000 Kbps",
                encryption:getRcText("ENCRYPTION"),
                state:getRcText("ON"),
            },
            {
                wifi:"h3c-lvzhou",
                hide:getRcText("HIDE"),
                upload:"2000 Kbps",
                download:"2000 Kbps",
                encryption:getRcText("ENCRYPTION"),
                state:getRcText("ON"),
            },
            {
                wifi:"h3c-lvzhou",
                hide:getRcText("HIDE"),
                upload:"2000 Kbps",
                download:"2000 Kbps",
                encryption:getRcText("ENCRYPTION"),
                state:getRcText("OFF"),
            }
        );
        $("#net_list").SList ("refresh", tempData1);

        var opt9 = {
            colNames: getRcText ("LIST"),
            showHeader: true,
            multiSelect : true ,
            colModel: [
                {name: "state1", datatype: "String"},//状态
                {name: "tag1", datatype: "String"},//列表
                {name: "num1", datatype: "String"},//序列号
                {name: "lable1", datatype: "String"},//关联场所
                {name: "type1", datatype: "String"}//型号
            ]
        };
        $("#flowdetail_list").SList ("head", opt9);
    }
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

    function initData(){
        draw();
    }

    function initForm(){
    }

    function _init ()
    {
        initData();
        initForm();
    }
    function _resize (jParent)
    {
    }

    function _destroy()
    {
    }
    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["Echart","Minput","SList"],
        "utils": ["Base", "Device"]

    });

}) (jQuery);;