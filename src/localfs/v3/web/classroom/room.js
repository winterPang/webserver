;(function ($) {
	var MODULE_BASE = "classroom";
	var MODULE_NAME = MODULE_BASE + ".room";
    var Timer_Timeout = null;
    var Timer_Interval = null;
    var nError_Interval = 0;
    var nError_Timeout = 0;
    var Timer_Error = null;
    var SN = "";
    var UP_POOL = null;
    var Edit_MAC = "";
	
	function getRcText (sRcName) 
    {
        return Utils.Base.getRcString("c_room_rc",sRcName);
    }

    function $get(sUrl,onSuccessed,onFailed)
    {
        return $.ajax({
            type:'get',
            //url:'/v3/wloc/wristband/'+sUrl,
            url:'../../web/classroom/image/data.json',
            dataType:'json',
            success:function(data){
                onSuccessed && onSuccessed(data);
            },
            error:function(){
                console.error('Get Data Error');
                onFailed && onFailed(arguments);
            }
        });
    }

    function $set(oPara,onSuccessed,onFailed)
    {
        $.ajax({
            type:'post',
            url:'/v3/wloc/wristband/bind',
            dataType:'json',
            data : oPara,
            success:function(data){
                onSuccessed && onSuccessed(data);
            },
            error:function(){
                console.error('Set Data Error');
                onFailed && onFailed(arguments);
            }
        });
    }

    function initPageBar(nStart,nCur)
    {
        var nPageSize = 24;
        
        nCur = nCur || 1;
        nStart = nStart || 1;

        var jUl = $('#PageBar ul').empty();
        var aHtml = [];

        for(var i=nStart;i<= nStart+9 && i<= nPageSize ;i++)
        {
            if(i == nCur)
            {
                aHtml.push('<li class="checked">'+i+'</li>');
            }
            else
            {
                aHtml.push('<li>'+i+'</li>');
            }
        }

        if(i <= nPageSize)
        {
            aHtml.push('<span>...</span>');
        }

        $('#PageBar a').removeClass('disabled');
        if(nCur == 1)
        {
            $('#PageBar a.last').addClass('disabled');
        }
        if(nCur == nPageSize)
        {
            $('#PageBar a.next').addClass('disabled');
        }

        jUl.html(aHtml.join('')).attr('total',nPageSize);
        jUl.on('click','li',onBtnClick);
    }

    function onBtnClick(e)
    {
        var jTarget = $(this);
        var jUl = $('#PageBar ul');
        var nCur = jUl.attr('cur');
        var nTotal = jUl.attr('total');

        if(jTarget.is('a'))
        {//page btn
            jTarget.is('.next') ? nCur++ : nCur--;
        }
        else
        {//page item 
            jUl.children().removeClass('checked');
            nCur = jTarget.html();
        }

        nCur = nCur < 1 ? 1 : nCur > nTotal ? nTotal : nCur;
        nStart = nCur-4 >=1 ? nCur-4 : 1;
        jUl.attr('cur',nCur);
        initPageBar(nStart,nCur);
    }

    function onTopLeave()
    {
        $("#StuList .stu-item .stu-icon").removeClass("h-over");
    }

    function onTopEnter(e)
    {
        var sName = $(this).attr('mac');
        $("#StuList .stu-item").each(function(){
            if($(this).attr('mac') == sName)
            {
                $(this).find('.stu-icon').addClass('h-over');
                return false;
            }
        });
    }

    function onEditClick(e)
    {
        var sName = $(this).prevAll('.stu-name').html();
        var sSrc = $(this).prevAll('.stu-icon').attr("src");
        $("#UserName").val(sName);
        $("#CurHead").attr("src",sSrc);
        Edit_MAC = $(this).closest('.stu-item ').attr("mac");

        Utils.Base.openDlg(null, {}, {scope:$("#SetStu_dlg")});
    }

    function onStuClick(e)
    {
        var jItem = $(this).parent().removeClass("active");
        var sMac = jItem.attr("mac");
        if(UP_POOL[sMac])
        {
            UP_POOL[sMac].active = false;
        }
    }

    function checkUp(stu)
    {
        if(stu.up)
        {
            UP_POOL[stu.mac] = {};
            UP_POOL[stu.mac]["time"] = (new Date()).getTime();
            UP_POOL[stu.mac]["active"] = true;
            return true;
        }

        var oPool = UP_POOL[stu.mac];
        var nNow = (new Date()).getTime();

        if(oPool && (nNow-oPool.time) <= 20*1000 && oPool.active && stu.site) 
        {
            return true;
        }

        return false;
    }

    function drawStu(aList)
    {
        var jList  = $("#StuList").empty();
        var aHtml = [];
        var sActive = "", sHtml = "", sSite = "";

        for(var i=0;i<aList.length;i++)
        {
            var oItem = aList[i];
            sActive = checkUp(oItem) ? " active" : ""; 
            sSite = oItem.site ? "" : "off-set";
            sHtml = '<div class="stu-item '+sActive+sSite+'" mac="'+oItem.mac+'">'+
                        '<image class="stu-icon" src="'+oItem.src+'">'+
                        '<span class="stu-name">'+oItem.UserName+'</span>'+
                        '<i class="fa fa-pencil-square-o stu-edit"></i>'+
                        '<image class="stu-hand" src="../../web/classroom/image/handsup.png">'+
                    '</div>';
            aHtml.push(sHtml);
        }

        jList.append(aHtml.join('')).on('click','.stu-item .stu-icon,.stu-item .stu-hand',onStuClick);
        jList.on('click','.stu-item .stu-edit,',onEditClick);
    }

    function drawTop(aList)
    {
        var aHtml = [];
        for(var i=0;i<aList.length && i<8;i++)
        {
            var oItem = aList[i];
            var sHtml = '<div class="top-item" mac="'+oItem.mac+'">'+
                            '<image class="top-icon" src="'+oItem.src+'">'+
                            '<span class="top-name">'+oItem.UserName+'</span>'+
                            '<div class="top-infor">'+
                                '<span class="top-ranking">Top'+(i+1)+'</span>'+
                                '<span class="top-count">'+oItem.total+getRcText('TIME')+'</span>'+
                            '</div>'+
                        '</div>';
            aHtml.push(sHtml);
        }
        $('#HandTop').empty().append(aHtml.join('')).children().mouseenter(onTopEnter).mouseleave(onTopLeave);
    }

    function formatData(stu,up,top,site)
    {
        var aTemp = [];
        for(var i=0;i<stu.length;i++)
        {
            stu[i].mac = stu[i].WristbandMac;
            stu[i].src = '../../web/classroom/image/'+(i+1)%22+'.jpg';
            stu[i].total = 0;
            stu[i].up = false;
            stu[i].site = false;

            for(var m=0;m<top.length;m++)
            {
                if(stu[i].mac == top[m].mac)
                {
                    stu[i].total = top[m].count || 0;
                    break;
                }
            }

            for(var n=0;n<up.length;n++)
            {
                if(stu[i].mac == up[n].mac)
                {
                    stu[i].up = up[n].count > 0;
                    break;
                }
            }

            for(var k=0;k<site.length;k++)
            {
                if(stu[i].mac == site[k].mac)
                {
                    stu[i].site = site[k].count > 0;
                    break;
                }
            }

            aTemp.push($.extend({},stu[i]));
        }

        return aTemp.sort(function(a,b){return b.total- a.total;});
    }

    function onReqError()
    {
        if(Timer_Error)
        {
            clearTimeout(Timer_Error);
            Timer_Error = null;
        }
        if(nError_Timeout > 50)
        {
            nError_Timeout = 0;
            Utils.Msg.error(getRcText("REQ_ERROR"));
        }
        else
        {
            Timer_Error = setTimeout(listenHandup,1000);
            nError_Timeout++;
        }
    }

    function listenHandup()
    {
        var aStu, aUp, aTop, aSite;
        var aReq = [];
        //get stu
        var ajaxStu = $get("bindinfo?WristbandMac=all&devSN="+SN,function(oData){
            aStu = oData.WristbandInfo;
        },onReqError);

        //get up
        var ajaxuUp = $get("raiseinfo?timeoffset=-3000&devSN="+SN,function(oData){
            aUp = oData.wristbandlist;
        },onReqError);

        //get top
        var nTime = -24*60*60*1000;
        var ajaxTop = $get("raiseinfo?timeoffset="+nTime+"&devSN="+SN,function(oData){
            aTop = oData.wristbandlist;
        },onReqError);

        //get onsite
        var nTime = -10*1000;
        var ajaxSite = $get("onsiteinfo?timeoffset="+nTime+"&devSN="+SN,function(oData){
            aSite = oData.wristbandlist;
        },listenHandup);

        aReq.push(ajaxStu,ajaxuUp,ajaxTop,ajaxSite);

        if(Timer_Interval)
        {
            clearInterval(Timer_Interval);
        }

        nError_Interval = 0;
        Timer_Interval = setInterval(function(){
            if(nError_Interval > 1000)
            {
                nError_Interval = 0;
                clearInterval(Timer_Interval);
                for(var i=0;i<aReq.length;i++)
                {
                    aReq[i].abort();
                }
                listenHandup();
            }
            if(aStu && aUp && aTop && aSite)
            {
                clearInterval(Timer_Interval);
                drawTop(formatData(aStu, aUp, aTop, aSite));
                drawStu(aStu);

                if(Timer_Timeout)
                {
                    clearTimeout(Timer_Timeout);
                }
                Timer_Timeout = setTimeout(listenHandup,1000);
            }

            nError_Interval++;
        },10);
    }

    function initForm()
    {
        $("#ClassPanel .tool-btn").click(function(){$('#HandTop').empty();});
        $("#SetStu_form").form("init", "edit", {
            "title": getRcText("STU_TITLE"),
            "btn_apply":function()
            {
                var oPara = {
                    devSN : SN,
                    WristbandInfo:[{
                        WristbandMac:Edit_MAC,
                        UserName:$.trim($('#UserName').val())
                    }]
                };

                $set(oPara,function(){
                    Frame.Msg.info("Success");
                    Utils.Pages.closeWindow(Utils.Pages.getWindow($("#SetStu_form")));
                });
            }
        });

        $('#PageBar .page-btn').click(onBtnClick);
    }
        

    function _init ()
    {
        SN = window.location.href;
        SN = SN.split("?")[1];
        SN = SN.split("&")[1];
        SN = SN.split("=")[1];

        UP_POOL = {};

        initForm();
        listenHandup();
        initPageBar();
    }

    function _destroy ()
    {
        if(Timer_Timeout)
        {
            clearInterval(Timer_Timeout);
            Timer_Timeout = null;
        }

        if(Timer_Interval)
        {
            clearInterval(Timer_Interval);
            Timer_Interval = null;
        }

        if(Timer_Error)
        {
            clearTimeout(Timer_Error);
            Timer_Error = null;
        }

        UP_POOL = null;
    }

    function _resize ()
    {
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init, 
        "destroy": _destroy, 
        "resize":_resize,
        "widgets": ["Form"],
        "utils":["Request","Base"]
    });
})( jQuery );