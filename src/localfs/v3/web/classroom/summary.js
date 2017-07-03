;(function ($) {
	var MODULE_BASE = "classroom";
    var MODULE_NAME = MODULE_BASE + ".summary";
    var SN = "";

    function getRcText (sRcName) 
    {
        return Utils.Base.getRcString("c_summary_rc",sRcName);
    }

    function $get(sUrl,onSuccessed,onFailed,dataType)
    {
        dataType = dataType || "json"
        return $.ajax({
            type:'get',
            url:'/v3/wloc/wristband/'+sUrl,
            //url:'../../web/classroom/image/data.json',
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

    function drawStatistic(nOn,nStu)
    {
        var aName = getRcText('BRACELET_TYPE').replace('%d',nStu).replace('%d',nOn).replace('%d',parseInt(nOn/nStu*100)).split(",");

        var option = {
            height:170,
            title: {
                text: getRcText('BRACELET_COUNT'),
                textStyle : {fontSize : 18}
            },
            legend: {
                orient : 'vertical',
                x : 0,
                y : 40,
                itemGap:2,
                data:aName
            },
            series : [
                {
                    name:'all',
                    type:'pie',
                    clockWise:false,
                    radius : ['0%','60%'],
                    itemStyle : {
                        normal: {
                            label: {
                                show:true,
                                position:'inner',
                                formatter:function(o){
                                    return o.value;
                                },
                                distance:'0',
                                textStyle:{
                                    fontSize : 30,
                                    fontWeight:'bolder'
                                }
                            },
                            labelLine: {show:false}
                        }
                    },
                    data:[
                        {
                            value:nStu,
                            name:aName[0]
                        }
                    ]
                },
                {
                    name:'online',
                    type:'pie',
                    clockWise:false,
                    radius : ['60%','80%'],
                    itemStyle : {
                            normal: {
                            label: {show:false},
                            labelLine: {show:false}
                        }
                    },
                    data:[
                        {
                            value:nOn, 
                            name:aName[1]
                        },
                        {
                            value:nStu-nOn,
                            name:'invisible',
                            itemStyle : {
                                normal : {
                                    color: 'rgba(0,0,0,0)',
                                    label: {show:false},
                                    labelLine: {show:false}
                                },
                                emphasis : {
                                    color: 'rgba(0,0,0,0)'
                                }
                            }
                        }
                    ]
                }
            ]
        };
        var oTheme = {
            color : ['#333F4C','#4EC1B1']
        };
        $("#Statistics").echart ("init", option,oTheme);
    }

    function isNum(n)
    {
        return Number(n) == Number(n);
    }

    function formatData(site,up)
    {
        var nStep = 0, nUp = 0, nCalorie = 0, nDistance = 0;
        for(var i=0;i<site.length;i++)
        {
            if(isNum(site[i].distance)) nDistance += Number(site[i].distance);
            if(isNum(site[i].step)) nStep += Number(site[i].step);
            if(isNum(site[i].calorie)) nCalorie += Number(site[i].calorie);
        }

        for(i = 0;i<up.length;i++)
        {
            if(isNum(up[i].count)) nUp += Number(up[i].count);
        }

        return {
            Distance: (nDistance/100).toFixed(1),
            HandsCount: nUp,
            StepCount: nStep,
            CalorieCount: (nCalorie/100).toFixed(1)
        };
    }

    function initData(nTime)
    {
        var aStu, aSite, aUp;
        var nError = 0;
        var aReq = [];

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
                Utils.Base.updateHtml($("#CountInfor"),formatData(aSite,aUp));
                drawStatistic(aSite.length,aStu.length);
            }
            nError++;
        },10);
    }

    function initForm()
    {
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
            initData(aTime[range]);
        });
    }
        

    function _init ()
    {
        SN = window.location.href;
        SN = SN.split("?")[1];
        SN = SN.split("&")[1];
        SN = SN.split("=")[1];

        initForm();
        initData(-7*24*60*60*1000);
    }

    function _destroy ()
    {

    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init, 
        "destroy": _destroy, 
        "widgets": ["Echart"],
        "utils":["Request","Base"]
    });
})( jQuery );