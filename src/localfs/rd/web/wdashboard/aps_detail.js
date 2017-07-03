(function ($)
{
    var MODULE_NAME = "WDashboard.APs_Detail";
    var hTimer = false, g_aAllAps;
    function getRcText (sRcId)
    {
        return Utils.Base.getRcString ("aps_detail_rc", sRcId);
    }

    function initForm()
    {
       /* $("#filter_group").on("click", function(){
            $("#group_block").toggle();
        });
        $(document).on("mousedown", function(e){
            var e = e || window.event;
            var elem = e.target || e.srcElement;
            while(elem)
            {
                if(elem.id && elem.id == "group_block")
                {
                    return false;
                }
                elem = elem.parentNode;
            }
            $("#group_block").hide();
        });
        $("#ApNameSelect").on("change", onGroupChange);
        $("#Download").on("click", function(){
            $(this).addClass("active");
            $("#Upload").removeClass("active");
        });
        $("#Upload").on("click", function(){
            $(this).addClass("active");
            $("#Download").removeClass("active");
        });
        $("#disconAp").on("click", disconnectAP);*/
    }

    function onRowChanged(aRowData)
    {
        if(aRowData && aRowData.length > 0)
        {
            $("#disconAp").removeClass("disabled");
        }
        else
        {
            $("#disconAp").addClass("disabled");
        }
    }

    function initGrid ()
    {
        var optAll = {
            multiSelect: true,
            height: 300,
            search:true,
            showStatus:false,
            showPages: false,
            columnChange:false,
            listenRowChange: onRowChanged,
            colNames: getRcText ("ALLAP_HEADER"),
            colModel: [
                {name: "APName", datatype: "String",width:50},
                {name: "Mac", datatype: "String",width:50},
                {name: "Model", datatype: "String",width:60},
                {name: "IPAddress", datatype: "String",width:60},
                {name: "SerialID", datatype: "String",width:60},
                {name: "Radios", datatype: "String",width:60},
                {name: "ClientsNumber", datatype: "String",width:80},
                {name: "OnlineTime", datatype: "String",width:80},
                {name: "status", datatype: "String",width:80}
            ], buttons: [
                {name: "add", enable:false},
                {name: "edit",enable:false},
                {name: "delete", enable:false}
            ]
        };
        $("#AllApList").mlist ("head", optAll);
    }



    function initData ()
    {
        var aRunAPList = [
                {
                    "APName":"ap1",
                    "Mac":"ACRE-67UI-8888-3232",
                    "Model":"WAP350",
                    "IPAddress":"124.0.21.1",
                    "SerialID":"21124454545168565",
                    "Radios":"802g(0)",
                    "ClientsNumber":"8",
                    "OnlineTime":"323223",
                    "status":"0"
                }
                ,{
                    "APName":"ap1",
                    "Mac":"ACRE-67UI-8888-3232",
                    "Model":"WAP350",
                    "IPAddress":"124.0.21.1",
                    "SerialID":"21124454545168565",
                    "Radios":"802g(0)",
                    "ClientsNumber":"8",
                    "OnlineTime":"323223",
                    "status":"1"
                }
            ,{
                "APName":"ap1",
                "Mac":"ACRE-67UI-8888-3232",
                "Model":"WAP350",
                "IPAddress":"124.0.21.1",
                "SerialID":"21124454545168565",
                "Radios":"802g(0)",
                "ClientsNumber":"8",
                "OnlineTime":"323223",
                "status":"1"
            }
            ,{
                "APName":"ap1",
                "Mac":"ACRE-67UI-8888-3232",
                "Model":"WAP350",
                "IPAddress":"124.0.21.1",
                "SerialID":"21124454545168565",
                "Radios":"802g(0)",
                "ClientsNumber":"8",
                "OnlineTime":"323223",
                "status":"0"
            }
            ,{
                "APName":"ap1",
                "Mac":"ACRE-67UI-8888-3232",
                "Model":"WAP350",
                "IPAddress":"124.0.21.1",
                "SerialID":"21124454545168565",
                "Radios":"802g(0)",
                "ClientsNumber":"8",
                "OnlineTime":"323223",
                "status":"0"
            }
            ,{
                "APName":"ap1",
                "Mac":"ACRE-67UI-8888-3232",
                "Model":"WAP350",
                "IPAddress":"124.0.21.1",
                "SerialID":"21124454545168565",
                "Radios":"802g(0)",
                "ClientsNumber":"8",
                "OnlineTime":"323223",
                "status":"2"
            }
            ,{
                "APName":"ap1",
                "Mac":"ACRE-67UI-8888-3232",
                "Model":"WAP350",
                "IPAddress":"124.0.21.1",
                "SerialID":"21124454545168565",
                "Radios":"802g(0)",
                "ClientsNumber":"8",
                "OnlineTime":"323223",
                "status":"1"
            }
        ];
        var status = getRcText ("SATUS").split(",");
        $.each(aRunAPList,function(key,value){
            value.status = status[value.status]
        })


        $("#AllApList").mlist ("refresh", aRunAPList);

    }

    function _init ()
    {
        g_aAllAps = [];
        initGrid();
        initForm();
        initData();
    }


    function _destroy ()
    {

    }

    function _resize()
    {

    }

    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["Mlist","Echart","SList","SingleSelect"],
        "utils": []
    });

}) (jQuery);
