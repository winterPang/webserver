;(function ($) {
    var MODULE_BASE = "classroom";
    var MODULE_NAME = MODULE_BASE + ".bracelet";
    var SN = "";
    
    function getRcText (sRcName) 
    {
        return Utils.Base.getRcString("c_infor_rc",sRcName);
    }

    function $get(sUrl,onSuccessed,onFailed,dataType)
    {
        dataType = dataType || "json"
        return $.ajax({
            type:'get',
            url:'/v3/wloc/wristband/'+sUrl,
            dataType:dataType,
            success:function(data){
                onSuccessed && onSuccessed(data);
            },
            error:function(){
                console.error('Get Data Error');
                onFailed && onFailed(arguments);
            }
        });
    }

    function formatData(stu,up,site)
    {
        for(var i=0;i<stu.length;i++)
        {
            stu[i].mac = stu[i].WristbandMac;

            for(var m=0;m<up.length;m++)
            {
                if(stu[i].mac == up[m].mac)
                {
                    stu[i].UpTime = up[m].count || 0;
                    break;
                }
            }

            for(var n=0;n<site.length;n++)
            {
                if(stu[i].mac == site[n].mac)
                {
                    stu[i].Riis = site[n].riis || 0;
                    stu[i].Time = site[n].time ? new Date(site[n].time).toLocaleString() : "--";
                    stu[i].Step = site[n].step || 0;
                    stu[i].Calorie = site[n].calorie ? (site[n].calorie/100).toFixed(1) : 0;
                    stu[i].Power = Number(site[n].major) == Number(site[n].major) ? Number(site[n].major)+"%" : 0;
                    stu[i].Distance = site[n].distance ? (site[n].distance/100).toFixed(1) : 0;
                    break;
                }
            }
        }
    }

    function initData(nTime)
    {
        var aStu,aUp, aSite;
        var aReq = [];
        var nError = 0;
        //get stu
        var ajaxStu = $get("bindinfo?WristbandMac=all&devSN="+SN,function(oData){
            aStu = oData.WristbandInfo;
        });
        //get up
        var ajaxuUp = $get("raiseinfo?timeoffset="+nTime+"&devSN="+SN,function(oData){
            aUp = oData.wristbandlist;
        });
        //get site
        var ajaxSite = $get("onsiteinfo?timeoffset="+nTime+"&devSN="+SN,function(oData){
            aSite = oData.wristbandlist;
        });

        aReq.push(ajaxStu,ajaxuUp,ajaxSite);

        var hTimer = setInterval(function(){
            if(nError > 1000)
            {
                nError = 0;
                clearInterval(hTimer);
                for(var i=0;i<aReq.length;i++)
                {
                    aReq[i].abort();
                }
                initData(nTime);
            }
            if(aStu && aSite && aUp)
            {
                clearInterval(hTimer);
                formatData(aStu,aUp,aSite);
                $("#InforList").SList ("refresh", aStu);
            }
            nError++;
        },10);
    }

    function initGrid()
    {
        var optInfor = {
            colNames: getRcText ("INFOR_HEAD"),
            multiSelect: false,
            colModel: [
                {name:'WristbandMac', datatype:"String"},
                {name:'UserName', datatype:"String"},
                {name:'Time', datatype:"Integer",width:200},
                {name:'UpTime', datatype:"Integer"},
                {name:'Power', datatype:"Integer"},
                {name:'Step', datatype:"Integer"},
                {name:'Calorie', datatype:"Integer"},
                {name:'Distance', datatype:"Integer"}
            ]
        };
        $("#InforList").SList ("head", optInfor);

        $("#clear").click(function(){
            $get("clean?devSN="+SN,function(){
               Frame.Msg.info("Success");
            },$.noop,'text');
        });

        $("a.change-range").click(function(){
            var aTime = [-7*24*60*60*1000,-24*60*60*1000,-60*60*1000];
            var range = $(this).attr("range");

            if($(this).hasClass("active"))
            {
                return false;
            }
            $("a.change-range").removeClass("active");
            $(this).addClass("active");
            $("#InforList").SList ("refresh", []);
            initData(aTime[range]);
        });
    }

    function _init ()
    {
        SN = window.location.href;
        SN = SN.split("?")[1];
        SN = SN.split("&")[1];
        SN = SN.split("=")[1];
        initGrid();
        initData(-7*24*60*60*1000);
    }

    function _destroy ()
    {

    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init, 
        "destroy": _destroy, 
        "widgets": ["SList"],
        "utils":["Request","Base"]
    });   
})( jQuery );