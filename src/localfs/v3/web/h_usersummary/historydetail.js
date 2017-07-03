/**
 * Created by Administrator on 2016/2/23.
 */
/**
 * Created by Administrator on 2015/12/1.
 */
/**
 * Created by Administrator on 2015/12/1.
 */
(function ($)
{
    var MODULE_NAME = "h_usersummary.historydetail";

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("historyinfo_rc", sRcName);
    }

    function onOpenDetailDlg()
    {
        Utils.Base.openDlg(null, {}, {scope:$("#detailinfo"),className:"modal-super"});
    }
    function initGrid()
    {
        var opt = {
            height:"70",
            showHeader: true,
            multiSelect: true,
            pageSize : 8,
            showOperation:true,
            colNames: getRcText ("HISTORY"),
            colModel: [
                {name: "name", datatype: "String",width:80},//状态
                {name: "phonenum", datatype: "String",width:50},//序列号
                {name: "auth", datatype: "String",width:60},//设备名称
                {name: "ip", datatype: "String",width:60},//型号
                {name: "accesstime", datatype: "String",width:100},//在线时长
                {name: "offlinetime", datatype: "String",width:60},//关联场所
                {name: "time", datatype: "String",width:50}//所属用户
            ],buttons:[
                {name: "detail", action: onOpenDetailDlg}
            ]
        };
        $("#historylist").SList ("head", opt);
        var tempData = [];
        tempData.push(
            {
                "name":"user1",
                "phone":"",
                "auth":getRcText("AUTNENTICATE"),
                "ip":"192.168.202.123",
                "accesstime":"2016-02-29 09:25:59",
                "offlinetime":"2016-02-29 10:25:59",
                "time":"1小时"
            },
            {
                "name":"user2",
                "phone":"",
                "auth":getRcText("AUTNENTICATE"),
                "ip":"192.168.202.23",
                "accesstime":"2016-02-29 09:25:59",
                "offlinetime":"2016-02-29 10:25:59",
                "time":"1小时"
            },
            {
                "name":"user3",
                "phone":"",
                "auth":getRcText("AUTNENTICATE"),
                "ip":"192.168.202.14",
                "accesstime":"2016-02-29 09:25:59",
                "offlinetime":"2016-02-29 10:25:59",
                "time":"1小时"
            },
            {
                "name":"user4",
                "phone":"",
                "auth":getRcText("AUTNENTICATE"),
                "ip":"192.168.202.56",
                "accesstime":"2016-02-29 09:25:59",
                "offlinetime":"2016-02-29 10:25:59",
                "time":"1小时"
            },
            {
                "name":"user5",
                "phone":"",
                "auth":getRcText("AUTNENTICATE"),
                "ip":"192.168.202.43",
                "accesstime":"2016-02-29 09:25:59",
                "offlinetime":"2016-02-29 10:25:59",
                "time":"1小时"
            },
            {
                "name":"user6",
                "phone":"",
                "auth":getRcText("AUTNENTICATE"),
                "ip":"192.168.202.37",
                "accesstime":"2016-02-29 09:25:59",
                "offlinetime":"2016-02-29 10:25:59",
                "time":"1小时"
            },
            {
                "name":"user7",
                "phone":"",
                "auth":getRcText("AUTNENTICATE"),
                "ip":"192.168.202.54",
                "accesstime":"2016-02-29 09:25:59",
                "offlinetime":"2016-02-29 10:25:59",
                "time":"1小时"
            },
            {
                "name":"user8",
                "phone":"",
                "auth":getRcText("AUTNENTICATE"),
                "ip":"192.168.202.24",
                "accesstime":"2016-02-29 09:25:59",
                "offlinetime":"2016-02-29 10:25:59",
                "time":"1小时"
            },
            {
                "name":"user9",
                "phone":"",
                "auth":getRcText("AUTNENTICATE"),
                "ip":"192.168.202.78",
                "accesstime":"2016-02-29 09:25:59",
                "offlinetime":"2016-02-29 10:25:59",
                "time":"1小时"
            })
        $("#historylist").SList ("refresh", tempData);
    }
    function initData()
    {

    }

    function initForm(){
        $("#change").click(function(){
            var skey = $("#DDNSPolicy").singleSelect("value");
            window.location = DDNS_SERVER[skey].Home;
        });
        $("#view_client_form").form("init", "edit", {"title":getRcText("HISTORY_TERINFO"),"btn_apply": false,"btn_cancel":false});
    }


    function _init(oPara)
    {
        initGrid();
        initData();
        initForm();
    };

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
        "widgets": ["Echart","Form","SList"],
        "utils": ["Base"]
    });
}) (jQuery);
