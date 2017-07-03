(function ($)
{
var MODULE_NAME = "WDashboard.onlineap";
//var NC, MODULE_NC = "WDashboard.NC";
var g_oAllInfor = {};
var g_Time;

function getRcText(sRcId)
{
    return Utils.Base.getRcString("app_client_rc", sRcId);
}

function showZoom(data)
{
    if(data.length>6)
    {
        return true;
    }
    else
    {
        return false;
    }
}

function drawBarChart(oInfor)
{
    $("#Current").text(oInfor.Total);
    if(!oInfor.Name)
    {
        return ;
    }
    // var aName = [];
    // for (var i=0;i<oInfor.Name.length;i++)
    // {
    //     aName[i] = oInfor.Name[i];
    //     if(aName[i].length>12)
    //     {
    //         aName[i] = aName[i].substr(0,9)+"...";
    //     }
    // }
    var nWidth = $("#onlineap").parent().width()*0.95;
    var nEnd = parseInt(600/oInfor.Count)-1;
    var opt = {
        color: ['#F9AB6B','#7FCAEA'],
         width: nWidth,
        height:"200px",
        grid: {
            x:90, y:40, x2:90, y2:25,
            borderColor: 'rgba(0,0,0,0)'
        },
        legend: {
            data:['在线','离线'],
            x:'right',
            textStyle: {color:"#e6e6e6"},
        },
        tooltip : {
            show: true,
            trigger: 'axis',
            axisPointer:{
                type : 'line',
                lineStyle : {
                  color: '#fff',
                  width: 0,
                  type: 'solid'
                }
            },
            // formatter : function(aDota){
            //     var a5G = aDota[0];
            //     var a2G = aDota[1];
            //     return  a5G[1] + getRcText("CLIENT_NUMBER") +"<br/>" + a5G[0] + " : " +a5G[2] + "<br/>" + a2G[0] + " : " + a2G[2];
            // }
        },
       /* calculable : false,*/
       /* dataZoom : {
            show : showZoom(oInfor.Name),
            realtime : true,
            start : 0,
            end : nEnd,
            zoomLock: true,
            orient: "vertical",
            width: 10,
            x: nWidth,
            y:25,
            backgroundColor:'#F7F9F8',
            fillerColor:'#bec6cf',
            handleColor:'#bec6cf',
            border:'none'
        },*/
        xAxis : [
            {
                type : 'category',
                data : ["9:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00"],
                splitLine : {
                    show:false,
                    lineStyle: {
                        color: '#373737',
                        type: 'solid',
                        width: 1
                    }
                },
                splitArea : {
                    areaStyle : {
                        color: '#174686'
                    }
                },
                axisLine  : {
                    show:true,
                    lineStyle :{color: '#e6e6e6', width: 1}
                },
                axisLabel:{
                    show:true,
                    textStyle: {color:"#e6e6e6"},
                    formatter : function(val)
                    {
                        if(val.length>12)
                        {
                            val = val.substr(0,11)+"...";
                        }
                        return val;
                    }
                }
            }
        ],
        yAxis : [
            {
                //show: true,
                type : 'value',
                //boundaryGap : true,
                axisLabel : {
                    formatter:function(nNum){
                        return nNum < 0 ? -nNum : nNum;
                    },
                    textStyle: {color:"#e6e6e6"},
                },
                splitLine : {
                    show:false
                },
                splitArea : {
                    areaStyle : {
                        color: '#174686'
                    }
                },
                axisLine  : {
                    show:true,
                    lineStyle :{color: '#e6e6e6', width: 1}
                }
            }
        ],
        series : [
            {
                name:'离线',
                type:'line',
                data: oInfor.Num2G,
                //stack:'Number',
                legendHoverLink:true,
                itemStyle : { 
                    normal: {
                        borderRadius : 5,
                        label : {
                            show: false, 
                          //  position: 'insideLeft',
                            formatter: function(x, y, val){return x;},
                            textStyle: {color:"#000"}
                        }
                    },
                    emphasis: {
                        borderRadius : 5,
                        label : {
                            show: false,
                            formatter: function(x, y, val){return x;},
                            textStyle: {color:"#000"}
                        }
                    }
                }
            },
            {
                name:'在线',
                type:'line',
                data: oInfor.Num5G,
                //stack:'Number',
                legendHoverLink:true,
                itemStyle : {
                    normal: {
                        borderRadius : 5,
                        label : {
                            show: false,
                            //  position: 'insideLeft',
                            formatter: function(x, y, val){return x;},
                            textStyle: {color:"#000"}
                        }
                    },
                    emphasis: {
                        borderRadius : 5,
                        label : {
                            show: false,
                            formatter: function(x, y, val){return x;},
                            textStyle: {color:"#000"}
                        }
                    }
                }
            }
        ]
    };
    $("#onlineap").echart("init", opt);
}

function initForm()
{
    var jForm = $("#onlineap_page");
    $(".link-detail",jForm).on("click",function()
    {
        Utils.Base.redirect ({np:"WDashboard.index",ID:$(this).attr("id")});
        return false;
    });
    $("#refresh_onlineap").on("click", initData);
}

function initData()
{
   /* function myCallback (oInfo)
    {
        var aClientStatus = Utils.Request.getTableRows (NC.ClientStatus, oInfo);*/
        var  aClientStatus=[
            {"ServiceTemplateName":"StName0","SSID":"Supermarkets","ClientNumber":274,"ClientNumber2G":206,"RadioNumber2G":69,"RadioNumber5G":9,"ClientNumber5G":68},
            {"ServiceTemplateName":"StName1","SSID":"Guest","ClientNumber":282,"ClientNumber2G":261,"RadioNumber2G":78,"RadioNumber5G":35,"ClientNumber5G":21},
            {"ServiceTemplateName":"StName2","SSID":"VIP","ClientNumber":228,"ClientNumber2G":175,"RadioNumber2G":64,"RadioNumber5G":60,"ClientNumber5G":53},
            {"ServiceTemplateName":"StName3","SSID":"Private","ClientNumber":187,"ClientNumber2G":181,"RadioNumber2G":54,"RadioNumber5G":26,"ClientNumber5G":6},
            {"ServiceTemplateName":"StName4","SSID":"Public","ClientNumber":475,"ClientNumber2G":240,"RadioNumber2G":64,"RadioNumber5G":63,"ClientNumber5G":235},
            {"ServiceTemplateName":"StName5","SSID":"Free","ClientNumber":283,"ClientNumber2G":92,"RadioNumber2G":26,"RadioNumber5G":29,"ClientNumber5G":191},
            {"ServiceTemplateName":"StName6","SSID":"Home","ClientNumber":831,"ClientNumber2G":403,"RadioNumber2G":61,"RadioNumber5G":13,"ClientNumber5G":428},
            {"ServiceTemplateName":"StName7","SSID":"Airport","ClientNumber":614,"ClientNumber2G":393,"RadioNumber2G":6,"RadioNumber5G":91,"ClientNumber5G":221},
            {"ServiceTemplateName":"StName8","SSID":"Railway station","ClientNumber":764,"ClientNumber2G":363,"RadioNumber2G":46,"RadioNumber5G":27,"ClientNumber5G":401},
            {"ServiceTemplateName":"StName9","SSID":"Office","ClientNumber":470,"ClientNumber2G":30,"RadioNumber2G":22,"RadioNumber5G":55,"ClientNumber5G":440}
        ];
        aClientStatus.sort(function(a, b){
            return b.ClientNumber/1-a.ClientNumber/1;
        });

          var g_oAllInfor = {
            Name : [],
            Num5G : [],
            Num2G : [],
            Total : 0,
            Count : 0
        };
        for(var i=0;i<aClientStatus.length;i++)
        {
            g_oAllInfor.Name.push(aClientStatus[i].SSID || "--");
            g_oAllInfor.Num5G.push(aClientStatus[i].ClientNumber5G);
            g_oAllInfor.Num2G.push(aClientStatus[i].ClientNumber2G);
            g_oAllInfor.Total += parseInt(aClientStatus[i].ClientNumber);
            g_oAllInfor.Count++;
        }
        drawBarChart(g_oAllInfor);
   // }

    /*var oClientStatus = Utils.Request.getTableInstance (NC.ClientStatus);

    Utils.Request.getAll ([oClientStatus], myCallback);*/
}

function _resize(jParent)
{
    // var sSensor = $("#client").val();
    if(g_Time)
    {
        clearTimeout(g_Time);
    }
    
    g_Time = setTimeout(function(){drawBarChart(g_oAllInfor);},200) ;
}
function _init ()
{   
   // NC = Utils.Pages[MODULE_NC].NC;
    initForm();
    initData();
}
function _destroy ()
{

}
Utils.Pages.regModule (MODULE_NAME, {
    "init": _init,
    "destroy": _destroy,
    "resize": _resize,
    "widgets": ["Echart"],
    "utils": []
   // "subModules": [MODULE_NC]
});
}) (jQuery);
