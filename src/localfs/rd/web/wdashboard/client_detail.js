(function ($)
{
    var MODULE_NAME = "WDashboard.Client_Detail";
    var hTimer = false, g_aAllAps;
    function getRcText (sRcId)
    {
        return Utils.Base.getRcString ("client_detail_rc", sRcId);
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

  /*  function onRowChanged(aRowData)
    {
        if(aRowData && aRowData.length > 0)
        {
            $("#disconAp").removeClass("disabled");
        }
        else
        {
            $("#disconAp").addClass("disabled");
        }
    }*/

    function initGrid ()
    {
        var optAll = {
            multiSelect: true,
            height: 300,
            search:true,
            showStatus:false,
            showPages: false,
            columnChange:false,
         //   listenRowChange: onRowChanged,
            colNames: getRcText ("ALLAP_HEADER"),
            colModel: [
                {name: "MAc", datatype: "String",width:50},
                {name: "IpAddress", datatype: "String",width:60},
                {name: "username", datatype: "String",width:60},
                {name: "SSid", datatype: "String",width:80},
                {name: "APName", datatype: "String",width:80},
                {name: "radios", datatype: "String",width:80},
                {name: "Totoal", datatype: "String",width:80},
                {name: "OnlineTime", datatype: "String",width:80},
                {name: "status", datatype: "String",width:80}
            ], buttons: [
                {name: "add", enable:false},
                {name: "edit",enable:false},
                {name: "delete", enable:false}
            ]
        };
        $("#AllClientList").mlist ("head", optAll);
    }



    function initData ()
    {
        var aRunAPList = [
            {
                "MAc":"1212-22-2121-22",
                "IpAddress":"182.24.36.55",
                "username":"1548879859",
                "SSid":"lvzhou_yun",
                "APName":"ap1",
                "radios":"801a",
                "Totoal":"1254/14555555",
                "OnlineTime":"323223",
                "status":"0"
            }
           ,{
                "MAc":"1212-22-2121-24",
                "IpAddress":"182.24.36.55",
                "username":"liuchao",
                "SSid":"lvzhou_yun",
                "APName":"ap2",
                "radios":"801a",
                "Totoal":"1254/14555555",
                "OnlineTime":"323223",
                "status":"1"
            }
            ,{
                "MAc":"1212-22-2121-3332",
                "IpAddress":"182.24.36.55",
                "username":"zhaoshan",
                "SSid":"lvzhou_yun",
                "APName":"ap1",
                "radios":"801a",
                "Totoal":"1254/14555555",
                "OnlineTime":"323223",
                "status":"0"
            }

            ,{
                "MAc":"1212-22-2121-2322",
                "IpAddress":"182.24.36.55",
                "username":"18211475896",
                "SSid":"lvzhou_yun",
                "APName":"ap1",
                "radios":"801a",
                "Totoal":"1254/14555555",
                "OnlineTime":"323223",
                "status":"1"
            }
            ,{
                "MAc":"1212-22-2121-22",
                "IpAddress":"182.24.36.55",
                "username":"1548879859",
                "SSid":"lvzhou_yun",
                "APName":"ap3",
                "radios":"801a",
                "Totoal":"1254/14555555",
                "OnlineTime":"323223",
                "status":"0"
            }
            ,{
                "MAc":"1212-22-2121-22",
                "IpAddress":"182.24.36.55",
                "username":"87777777",
                "SSid":"lvzhou_yun",
                "APName":"ap4",
                "radios":"801a",
                "Totoal":"1254/14555555",
                "OnlineTime":"323223",
                "status":"1"
            }
            ,{
                "MAc":"1212-22-2121-97",
                "IpAddress":"182.24.36.55",
                "username":"詹三",
                "SSid":"lvzhou_yun",
                "APName":"ap5",
                "radios":"801a",
                "Totoal":"1254/14555555",
                "OnlineTime":"323223",
                "status":"0"
            }
        ];
        var status = getRcText ("SATUS").split(",");
        $.each(aRunAPList,function(key,value){
            value.status = status[value.status]
        })


        $("#AllClientList").mlist ("refresh", aRunAPList);

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
