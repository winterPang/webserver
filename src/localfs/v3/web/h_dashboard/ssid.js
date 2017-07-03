(function ($)
{
var MODULE_NAME = "h_dashboard.ssid";
// var NC, MODULE_NC = "h_dashboard.NC";
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
    var nWidth = $("#client").parent().width()*0.95;
    var nEnd = parseInt(600/oInfor.Count)-1;
    var opt = {
        color: ['#C8C3E1','#78CEC3'],
        // width: nWidth,
        height:"200px",
        grid: {
            x:90, y:40, x2:90, y2:25,
            borderColor: 'rgba(0,0,0,0)'
        },
        legend: {
            data:['2.4GHz','5GHz'],
            textStyle:{color: '#80878C'},
            x:'60%'
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
            // formatter : function(aData){
            //     var a5G = aData[0];
            //     var a2G = aData[1];
            //     return  a5G[1] + getRcText("CLIENT_NUMBER") +"<br/>" + a5G[0] + " : " +a5G[2] + "<br/>" + a2G[0] + " : " + a2G[2];
            // }
        },
        calculable : false,
        dataZoom : {
            show : showZoom(oInfor.Name),
            realtime : true,
            start : 0,
            end : nEnd,
            // zoomLock: true,
            orient: "vertical",
            width: 10,
            x: nWidth,
            y:25,
            backgroundColor:'#F7F9F8',
            fillerColor:'#bec6cf',
            handleColor:'#bec6cf',
            // border:'none'
        },
        xAxis : [
            {
                // name : getRcText("CLIENT_NUMBER"),
                type : 'value',
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
                    lineStyle :{color: '#80878C', width: 1}
                },
                axisLabel : {
                    textStyle:{color: '#80878C'},
                    formatter:function(nNum){
                        return nNum < 0 ? -nNum : nNum;
                    }
                }
            }
        ],
        yAxis : [
            {
                show: true,
                // name: "SSID",
                type : 'category',
                boundaryGap : true,
                data : oInfor.Name,
                axisLabel:{
                    show:true,
                    textStyle:{color: '#80878C'},
                    formatter : function(val)
                    {
                        if(val.length>12)
                        {
                            val = val.substr(0,11)+"...";   
                        }
                        return val;
                    }
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
                    lineStyle :{color: '#80878C', width: 1}
                }
            }
        ],
        series : [
            {
                name:'5GHz',
                type:'bar',
                data: oInfor.Num5G,
                //stack:'Number',
                legendHoverLink:true,
                itemStyle : { 
                    normal: {
                        borderRadius : 5,
                        label : {
                            show: false, 
                            position: 'insideLeft',
                            formatter: function(x, y, val){return y;},
                            textStyle: {color:"#000"}
                        }
                    },
                    emphasis: {
                        borderRadius : 5,
                        label : {
                            show: false,
                            formatter: function(x, y, val){return y;},
                            textStyle: {color:"#000"}
                        }
                    }
                }
            },
            {
                name:'2.4GHz',
                type:'bar',
                data: oInfor.Num2G,
                //stack:'Number',
                itemStyle : { 
                    normal: {
                        borderRadius : 5,
                        label : {
                            show: false, 
                            position: 'insideLeft',
                            formatter: function(x, y, val){
                                return y;
                            },
                            textStyle: {color:"#000"}
                        }
                    },
                    emphasis: {
                        borderRadius : 5,
                        label : {
                            show: false,
                            formatter: function(x, y, val){return y;},
                            textStyle: {color:"#000"}
                        }
                    }
                }
            }
        ]
    };
    $("#client").echart("init", opt);
}

function initForm()
{
    var jForm = $("#clients_page");
    $(".link-detail",jForm).on("click",function()
    {
        Utils.Base.redirect ({np:"h_dashboard.ssid_detail",tab:$(this).attr("tab")});
        return false;
    });
    $("#refresh_client").on("click", initData);
}

function initData()
{
    // function myCallback (oInfo)
    // {
    //     var aClientStatus = Utils.Request.getTableRows (NC.ClientStatus, oInfo);

    //     aClientStatus.sort(function(a, b){
    //         return b.ClientNumber/1-a.ClientNumber/1;
    //     });

        g_oAllInfor = {
            "Name":["Home","Railway station","Airport","Public","Office","Free","Guest","Supermarkets","VIP","Private"],
            "Num5G":[428,401,221,235,440,191,21,68,53,6],
            "Num2G":[403,363,393,240,30,92,261,206,175,181],
            "Total":4408,"Count":10
        };
    //     for(var i=0;i<aClientStatus.length;i++)
    //     {
    //         g_oAllInfor.Name.push(aClientStatus[i].SSID || "--");
    //         g_oAllInfor.Num5G.push(aClientStatus[i].ClientNumber5G);
    //         g_oAllInfor.Num2G.push(aClientStatus[i].ClientNumber2G);
    //         g_oAllInfor.Total += parseInt(aClientStatus[i].ClientNumber);
    //         g_oAllInfor.Count++;
    //     }

        drawBarChart(g_oAllInfor);
    // }

    // var oClientStatus = Utils.Request.getTableInstance (NC.ClientStatus);

    // Utils.Request.getAll ([oClientStatus], myCallback);
}

function _resize(jParent)
{
    // var sSensor = $("#client").val();
    if(g_Time)
    {
        clearTimeout(g_Time);
    }
    
    g_Time = setTimeout(function(){drawBarChart(g_oAllInfor);},200);
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
    "utils": [],
    "subModules": []
});
}) (jQuery);
