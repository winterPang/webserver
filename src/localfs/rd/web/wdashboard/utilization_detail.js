(function ($)
{
    var MODULE_NAME = "WDashboard.utilization_detail";
    var hTimer = false, g_aAllAps;
    function getRcText (sRcId)
    {
        return Utils.Base.getRcString ("acs_detail_rc", sRcId);
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
                {name: "ShopName", datatype: "String",width:50},
                {name: "SerialID", datatype: "String",width:60},
                {name: "Model", datatype: "String",width:60},
                {name: "APNumber", datatype: "String",width:80},
                {name: "BuyTime", datatype: "String",width:80},
                {name: "CPU", datatype: "String",width:80},
                {name: "Memory", datatype: "String",width:80},
                {name: "OnlineTime", datatype: "String",width:80},
                {name: "status", datatype: "String",width:80},
                {name: "OwnerName", datatype: "String",width:60}
            ], buttons: [
                {name: "add", enable:false},
                {name: "edit",enable:false},
                {name: "delete", enable:false}
            ]
        };
        $("#AllAcList").mlist ("head", optAll);
    }



    function initData ()
    {
        var aRunAPList = [
            {
                "ShopName":"回龙观1楼小贝",
                "SerialID":"21124454545168565",
                "Model":"5510E",
                "APNumber":"8",
                "BuyTime":"2014-02-14",
                "CPU":"50%",
                "Memory":"30%",
                "OnlineTime":"323223",
                "status":"0",
                "OwnerName":"liuchao"
            }
            ,{
                "ShopName":"杭州小贝",
                "SerialID":"21124454545168565",
                "Model":"5510E",
                "APNumber":"3",
                "BuyTime":"2014-04-14",
                "CPU":"80%",
                "Memory":"40%",
                "OnlineTime":"323223",
                "status":"0",
                "OwnerName":"zhangsan"
            }
            ,{
                "ShopName":"beijin小贝",
                "SerialID":"21124454545168565",
                "Model":"5510E",
                "APNumber":"3",
                "BuyTime":"2014-04-14",
                "CPU":"80%",
                "Memory":"40%",
                "OnlineTime":"323223",
                "status":"2",
                "OwnerName":"liuchao"
            }
            ,{
                "ShopName":"大明湖咖啡厅",
                "SerialID":"21124454545168565",
                "Model":"5510E",
                "APNumber":"3",
                "BuyTime":"2014-04-14",
                "CPU":"80%",
                "Memory":"40%",
                "OnlineTime":"323223",
                "status":"2",
                "OwnerName":"zhangsan"
            }
            ,{
                "ShopName":"瑜伽馆",
                "SerialID":"21124454545168565",
                "Model":"5510E",
                "APNumber":"3",
                "BuyTime":"2014-04-14",
                "CPU":"80%",
                "Memory":"40%",
                "OnlineTime":"323223",
                "status":"0",
                "OwnerName":"liuchao"
            }
            ,{
                "ShopName":"清华大学实验楼",
                "SerialID":"21124454545168565",
                "Model":"5510E",
                "APNumber":"3",
                "BuyTime":"2014-04-14",
                "CPU":"80%",
                "Memory":"40%",
                "OnlineTime":"323223",
                "status":"0",
                "OwnerName":"wanghao"
            }
            ,{
                "ShopName":"dfdfdfd",
                "SerialID":"21124454545168565",
                "Model":"5510E",
                "APNumber":"3",
                "BuyTime":"2014-04-14",
                "CPU":"80%",
                "Memory":"40%",
                "OnlineTime":"323223",
                "status":"1",
                "OwnerName":"zhangsan"
            }

        ];
        var status = getRcText ("SATUS").split(",");
        $.each(aRunAPList,function(key,value){
            value.status = status[value.status]
        })


        $("#AllAcList").mlist ("refresh", aRunAPList);

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
