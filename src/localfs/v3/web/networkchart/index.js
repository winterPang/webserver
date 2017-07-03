(function($){
    var MODULE_NAME = "networkchart.index";
    var ApInfo;
    var MapSize;
    var ScaleInfo;
	function getRcText(sRcName)
    {
        return Utils.Base.getRcString("natworkchart_rc", sRcName);
    }
   function getMapNameList() {
        return $.ajax({
            type: "POST",
            url: "/v3/wloc",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: "getAllMapListToRRM"
            })
        });
    }

    function getMapInfo(mapname) {
        return $.ajax({
            type: "POST",
            url: "/v3/wloc",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: "getMapUrlToRRM",
                Param:
                {
                    devSN: FrameInfo.ACSN,
                    mapName:mapname,
                }
            })
        });
    }

    function getApNbrList(RadioType,apList) {
        return $.ajax({
            type: "POST",
            url: "/v3/rrmserver",
            dataType: "json",
            data: ({
                Method: "GetApNbrlist",
                Param: {
                    ACSN: FrameInfo.ACSN,
                    RadioType:RadioType,
                    APList: apList || [],
                },
            })
        });
    }
    /*显示 filter框*/
    function onClick()
    {
        var sId = $(this).attr("id").split("_")[1];
        switch(sId){
            case "Map":
                $("#filter_Mapradio").toggle();
                return false;
                break;
            default:
                break;
        }
    }

    function appendApImg(p, hint, status) {
        var img ='<img src="../networkchart/images/ap.png" style="width:30px;height:30px; left:rrm_left px;top:rrm_top px;position:absolute" title="title_msg">'
        img = img.replace("rrm_left ", p.x).replace("rrm_top ", p.y);
        if(status != 1)
        {
            img = img.replace("ap.png", "offline_ap.png");
        }

        //adding hint
        img = img.replace("title_msg", hint);

        //adding aps
        $("#canvas2").append(img);
    }
    function adDivClear() {
        $("#canvas1").children().remove();
    }
    function adImgClear() {
        $("#canvas2").children().remove();
    }
    function appendChnlClear(){
        $("#ChnlColor").children().remove();
    }
    function appendMapImgClear(){
        $("#backmap-img").children().remove();
    }
    function chnlSort(arr) {
        var arrObj = {};
        for(var i = 0;i < arr.length - 1;i++){
            for(var j = 0;j < arr.length -1 -i;j++){
                if(arr[j].chnl > arr[j+1].chnl)
                {
                    arrObj = arr[j];
                    arr[j] = arr[j+1];
                    arr[j+1] = arrObj;
                }
            }
        }
        return arr;
    }
    var color = [];
    var g_color = ['rgba(63, 234, 117, 0.5)','rgba(63, 106, 234, 0.5)','rgba(255, 255, 0, 0.51)','rgba(0, 255, 255, 0.5)'
        ,'rgba(255, 0, 0, 0.51)','rgba(0, 100, 0, 0.5)','rgba(128, 0, 128, 0.5)','rgba(255, 165, 0, 0.5)','rgba(160, 82, 45, 0.51)'
        ,'rgba(20, 46, 237, 0.5)'];
    var backGroundColor = ['#9eff9e','#9b9bff','#ffff9b','#a1ffff','#ff9b9b','#9cc29b','#cc9acd','#ffdc9b','#dfc5b8','#0B1D7E'];
    var c_index = 0;
    function chnlColorClear(){
        color = [];
        c_index = 0;
    }
    function appendChnlColor(color) {
        var arr = [];

        for (var i = 0;i< color.length;i++) {
            arr.push(color[i]);
        }

        arr = chnlSort(arr);

        for (var i = 0; i< arr.length;i++)
        {
            var Tr = '<tr><td>'+getRcText("CHANNEL")+'&nbsp;channel</td><td><div class="colordiv" style="background-color:colors;"></div></td></tr>'
            Tr = Tr.replace("channel",arr[i].chnl);
            Tr = Tr.replace("colors",backGroundColor[arr[i].index]);
            $("#ChnlColor").append(Tr);
        }
    }
    function getChannelColor(chnl) {
        for (var i in color) {
            if (color[i].chnl == chnl) {
                return g_color[color[i].index];
            }
        }

        var l_color = g_color[c_index];
        color.push({chnl:chnl,  index:c_index});
        c_index ++;
        if (c_index >= g_color.length) {
            c_index = 0;
        }
        return l_color;
    }

    function isInteger(obj) {
        return typeof obj === 'number' && obj%1 === 0
    }

    function getRadius(power) {
        var arr = [5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 11, 12, 12, 13, 14, 15, 16, 17, 19, 20, 21, 23, 25, 26, 28, 30];

        if (!isInteger(power)) {
            power = 0;
        }
        power = Math.floor(power);
        if (power < 1) {
            power = 0;
        }
        else if (power >= arr.length){
            power = arr.length - 1;
        }

        return arr[power];
    }

    /*function radiusRandomOffset(radius) {
        var ox = 0;
        var oy = 0;
        var r  = Math.random();
        var degree  = Math.random() * Math.PI * 3;

        radius = r * radius;

        ox = Math.sin(degree) * radius;
        oy = Math.cos(degree) * radius;

        return {ox:ox, oy:oy, heat: 1 - r};
    }*/

   /* function heatmapPointAdd(chnl, power, scale, p, heatData) {
        if (chnl && power) {
            var series = {
                type : 'heatmap',
                data : [],
                opacity : 0.4,
                blurSize : 60,
                hoverable : false,
                gradientColors:  [{ offset: 0.8, color: getChannelColor(chnl) }]
            };

            var data = series.data;

            var radius = getRadius(power) / scale;
            for(var i = 0; i< 1000; i++){
                var offset = radiusRandomOffset(radius);
                data.push([p.x + offset.ox, p.y + offset.oy, offset.heat]);
            }
            heatData.push(series);
        }
    }*/
    function appendChildDiv(chnl, power, scale, p, heatData) {
        var div1 = '<div style="top:div_top px;left:div_left px;height:div_height px;width:div_width px;border-radius:50%;' +
            'position:absolute;background-color:backcolor;"></div>';

        if (chnl && power) {
            var radius = getRadius(power) / scale;//xiangsu
            var diameter = 2 * radius;
            div1 = div1.replace("div_top ", p.y - radius + 17).replace("div_left ",p.x - radius + 13);
            div1 = div1.replace("div_height ",diameter).replace("div_width ",diameter);
            div1 = div1.replace("backcolor",getChannelColor(chnl));
            $("#canvas1").append(div1);
        }
    }

    function postionAmend(x, y ,MapSize) {
        //返回数据的坐标原点在左下角，实际作图应该在左上角，需要转化ypods
        x = x - 50 + 5;
        y = MapSize.wide - y + 60 - 4;

        return {x:x, y:y};
    }

    function rrmcatstring(s1, s2) {
        var str = s1 ? s1 : "";
        str += s2 ? s2 : "";
        return str;
    }
    function checkChannel(chnl,chlList)
    {
        //chllist is empty, pass all channel filter
        var Channel_exist = -1;
        var length = chlList && chlList.length || 0;
        if(length > 0){
            for (var i = 0;i < length; i++)
            {
                if(chnl == chlList[i])
                {
                    Channel_exist = 1;
                    break;
                }
            }
        }
        else if (!chnl){
            Channel_exist = -1;
        }
        return Channel_exist < 0 ? false : true;
    }

    function getApHint (rrmdata, apname, chllist) {
        var hint = "";

        for (var i in rrmdata) {
            if (rrmdata[i].ApName == apname) {
                hint += rrmcatstring(getRcText("AP_NAME")+": ", apname);
                if (checkChannel(rrmdata[i].Channel, chllist) && rrmdata[i].Power) {
                    hint += rrmcatstring("&#10;"+getRcText("CHANNEL")+": ", rrmdata[i].Channel);
                    hint += rrmcatstring("&#10;"+getRcText("POWER")+": ", rrmdata[i].Power);
                    hint += rrmcatstring("&#10;"+getRcText("NEIGHBOR")+":");

                    var list = rrmdata[i].ApNbrList;
                    for(var j =0;j < list.length; j++ )
                    {
                        hint += rrmcatstring("&#10;    ", list[j].ApName);
                    }
                }
                break;
            }

        }

        return hint;
    }

    function apsLocations(ApInfo, rrmdata, MapSize, chllist) {
        var length = ApInfo && ApInfo.length || 0;
        for (var i = 0;i < length; i++)
        {
            //坐标转换
            var p = postionAmend(ApInfo[i].XCord, ApInfo[i].YCord ,MapSize);

            var hint = getApHint(rrmdata, ApInfo[i].apName, chllist);

            //adding ap images
            appendApImg(p, hint, ApInfo[i].status);
        }
    }
    function appendMapImg(src){
        var img = '<img src="'+src+'">';
        $("#backmap-img").append(img);
    }
    /*function apsHeatmap(ApInfo, odata, MapSize, chllist) {
        var length = ApInfo && ApInfo.length || 0;
        var rrmlength = odata && odata.length || 0;
        var heatData = [];
        for(var i = 0; i < length; i++)
        {
            if (ApInfo[i].status != 1) {
                continue;
            }
            for(var j=0;j<rrmlength;j++)
            {
                if(ApInfo[i].apName == odata[j].ApName && checkChannel(odata[j].Channel, chllist))
                {
                    //坐标转换
                    var p = postionAmend(ApInfo[i].XCord, ApInfo[i].YCord, MapSize);

                    //adding heatmap points
                    heatmapPointAdd(odata[j].Channel, odata[j].Power, ScaleInfo.scale, p, heatData);
                }
            }

        }
        echartUpdate(heatData);
    }*/
    function appendDiv(ApInfo, odata, MapSize, chllist) {
        var length = ApInfo && ApInfo.length || 0;
        var rrmlength = odata && odata.length || 0;
        var heatData = [];
        for(var i = 0; i < length; i++)
        {
            if (ApInfo[i].status != 1) {
                continue;
            }
            for(var j=0;j<rrmlength;j++)
            {
                if(ApInfo[i].apName == odata[j].ApName && checkChannel(odata[j].Channel, chllist))
                {
                    //坐标转换
                    var p = postionAmend(ApInfo[i].XCord, ApInfo[i].YCord, MapSize);

                    //adding heatmap points
                    //heatmapPointAdd(odata[j].Channel, odata[j].Power, ScaleInfo.scale, p, heatData);
                    getChannelColor(odata[j].Channel);
                    appendChildDiv(odata[j].Channel, odata[j].Power, ScaleInfo.scale, p, heatData);
                }
            }

        }
        //echartUpdate(heatData);
    }

    function rrmDataChg(ApInfo,ScaleInfo,MapSize, filternone) {
        var RadioType =$("#RadioSelect").singleSelect("value");
        getApNbrList(RadioType, ApInfo).done(function(data,textStatus,jqXHR)
        {
            //取来数据之后开始画图
            var odata = data && data.message;
            var length = odata && odata.length || 0;
            var ApInfolength = ApInfo && ApInfo.length || 0;
            var Initchllist = [];
            var chllist = [];
            for(var i =0; i < ApInfolength; i++){
                for (var j = 0; j < length; j++) {
                    var InitchllistObj = {};
                    if(ApInfo[i].status == 1 && ApInfo[i].apName == odata[j].ApName)
                    {
                        InitchllistObj.chnl = odata[j].Channel;
                        Initchllist.push(InitchllistObj);
                        break;
                    }
                }
            }
            Initchllist = chnlSort(Initchllist);
            $("#Channel").mselect("InitData",Initchllist,{valueField:"chnl"});
            if (filternone != true) {
                //All will be selected by default
                $("#Channel").mselect("value",Initchllist);
            }
            var chllist = $("#Channel").mselect("value");
            apsLocations(ApInfo, odata, MapSize, chllist);

            //apsHeatmap(ApInfo, odata, MapSize, chllist);
            appendDiv(ApInfo, odata, MapSize, chllist);
            appendChnlClear();
            //getChannelColor(chllist);
            appendChnlColor(color);
        });
    }

    function rrmMapChg(filternone) {
        var mapname  = $("#MapSelect").singleSelect("value");
        //获取地图url以及地图上ap列表信息
        getMapInfo(mapname).done(function(data,textStatus,jqXHR)
        {
            //切换时先把上次图片清空
            appendMapImgClear();
            //echartUpdate();
            adDivClear();
            adImgClear();
            appendChnlClear();
            if (data.data.retCode == 0)
            {
                //动态改变背景图的src
                var mapUrl =  "/v3/wloc_map/" + FrameInfo.ACSN + '-'+ mapname +'-'+'background.jpeg';
                appendMapImg(unescape(mapUrl));
                //locate aps image
                ApInfo  = data.data.maplist.apList;
                MapSize = data.data.maplist.mapsize;
                ScaleInfo = data.data.maplist.bgInfo;

                //rrmDataChg
                rrmDataChg(ApInfo,ScaleInfo,MapSize, filternone);
            }
        });
    }

    /*function echartUpdate(heatData) {
        var option = {
            title : {
                text: ''
            },
            series : []
        };

        var series = {
            type : 'heatmap',
            data : [0, 0, 0],
            opacity : 0.3,
            blurSize : 60,
            hoverable : false,
            gradientColors:  [
                { offset: 0.2, color: '#4ec1b2' },
                { offset: 0.8, color: '#72d0f8' }
            ]
        };

        if (!heatData) {
            option.series.push(series);
        }
        else {
            option.series = heatData;
        }

        $("#canvas1").echart("init", option,{});
    }*/

    function initForm()
    {
        $("#filter_Map").on("click", onClick);
        $("#filter_Remove").click(function()
        {
            //document.getElementById("RadioSelect").value="";
            $("#filter_Mapradio").hide();
        });
        $("#filter_ok").click(function()
        {
            //document.getElementById("RadioSelect").value="";
            var filternone = true;
            $("#filter_Mapradio").hide();
            chnlColorClear();
            adDivClear();
            rrmDataChg(ApInfo,ScaleInfo,MapSize, filternone);
        });
        $("#refreshMap").on("click",function() {
            var filternone = false;
            adDivClear();
            chnlColorClear();
            rrmMapChg(filternone);
        });
        //点击空白处隐藏右上角filter框
        $(document).on("mousedown", function(e){
            var e = e || window.event;
            var elem = e.target || e.srcElement;
            while(elem)
            {
                if(elem.id == "filter_Mapradio")
                {
                    return;
                }
                elem = elem.parentNode;
            }
            $("#filter_Mapradio").hide();
        });
        $("#MapSelect").change(function(){
            var filternone = false;
            chnlColorClear();
            rrmMapChg(filternone);
        });
        $("#RadioSelect").change(function(){
            var filternone = false;
            chnlColorClear();
            adDivClear();
            rrmDataChg(ApInfo,ScaleInfo,MapSize, filternone);
        });
    }

    function initData()
    {
        //获取截图的名称列表
        getMapNameList().done(function(data,textStatus,jqXHR) {
            if (data.data.retCode !== 0)
            {
                return;
            }
            var mapInfoList = (data.data.maplist === "" ? [] : data.data.maplist);
            var mapNameList = [] ;
            mapInfoList.forEach(function(map) {
                if(map.mapName == "" )
                {
                    return true;//continue
                }
                mapNameList.push(map.mapName);
            });
            $("#MapSelect").singleSelect("InitData", mapNameList);
            var RadioTypeList=["2.4G","5G"];
            $("#RadioSelect").singleSelect("InitData", RadioTypeList);
            var filternone = false;
            chnlColorClear();
            rrmMapChg(filternone);
        });
        //$("#RadioSelect").val(RadioTypeList[0]);
        //var heatData = [];
        //for (var i = 0; i < 200; ++i) {
        //    heatData.push([
        //        Math.random() * 1000,
        //        Math.random() * 800,
        //        Math.random() * 0.5
        //    ]);
        //}
        //var option = {
        //    title : {
        //        text: '功率热图'
        //    },
        //    series : [
        //        {
        //            type : 'heatmap',
        //            data : heatData,
        //            hoverable : false,
        //        }
        //    ]
        //};
        //$("#canvas1").echart("init", option,{});

    }

    function _init() {
        initData();
        initForm();
    }

    function _destroy() {
        //ApInfo = null;
        //MapSize = null;
        //ScaleInfo = null;
        //color = null;
        //g_color = null;
        //c_index = null;
        //backGroundColor = null;
    }


    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["Form", "SingleSelect", "DateTime", "Cocos","Echart","MSelect"],
        "utils": ["Base"]
    });
    /**
     * Created by Administrator on 2016/1/17.
     */
})(jQuery);