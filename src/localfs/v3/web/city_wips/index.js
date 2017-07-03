;(function ($) {
    var MODULE_BASE = "city_wips";
    var MODULE_NAME = MODULE_BASE + ".index";
    var gCount,g_DateType = null,gWEEK;
    var mapType = null;
    var onlinedata,outlinedata = null;

    function getRcText (sRcName)
    {
        return Utils.Base.getRcString("location_rc",sRcName);
    }
    function showStar(marker)
    {
        var show = false;
        var timer = setInterval(function(){
            if(show == true)
            {
                marker.show();
                show =false;
            }
            else
            {
                marker.hide();
                show =true;
            }
        },2000);
    }
    function deletePoint(map){
        var allOverlay = map.getOverlays();

        for (var i = 0; i < allOverlay.length -1; i++){
            if(allOverlay[i].getTitle() == "ap0"){
                showStar(allOverlay[i]);
            }
        }
    }
    function initMap()
    {
        var map = new BMap.Map("container");
        map.setMapStyle({style:'grayscale'});
        var point = new BMap.Point(116.400244,39.92556);
        map.enableScrollWheelZoom();
        map.centerAndZoom(point, 13);
        var data_info = [
            [116.417854,39.921988],
            [116.426605,39.871585],
            [116.432222,39.882345]
        ];
        var opts = {
            width : 100,     // 信息窗口宽度
            height: 150,     // 信息窗口高度
            title : "" , // 信息窗口标题新、
        };
        for(var i=0;i<data_info.length;i++){
            var content ;

            var myIcon = new BMap.Icon("../city_wips/images/ap.gif", new BMap.Size(30,24));
            var marker = new BMap.Marker(new BMap.Point(data_info[i][0],data_info[i][1]),{icon:myIcon,title:"ap"+i});  // 创建标注
            map.addOverlay(marker);
           // marker.enableDragging();
           // marker.setAnimation(BMAP_ANIMATION_BOUNCE);
            addClickHandler(content,marker);
        }
        function addClickHandler(content,marker){
            marker.addEventListener("dragend",function(e){
                    console.log(e.point);
                    console.log(this.getTitle());}
            );

            marker.addEventListener("click",function(e){
                    var p = this.getPosition();       //获取marker的位置
                    content = "marker的位置是" + p.lng + "," + p.lat;
                    openInfo(content,e);
                    Utils.Base.redirect({np:"city_wips.detail"});}
            );
        }
        function openInfo(content,e){
            var p = e.target;

            var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
            var infoWindow = new BMap.InfoWindow(content,opts);
            console.log(point);// 创建信息窗口对象
            map.openInfoWindow(infoWindow,point); //开启信息窗口
        }
        setTimeout(deletePoint(map),2000);// 将标注添加到地图中
    }




    function _init ()
    {
      /*  $("#wips_import").onclick(function()
        {
            var data_info = [
            [116.417854,39.921988],
            [116.426605,39.871585],
            [116.432222,39.882345]
        ];
            $("#exportFile").get(0).src = data_info;
        });*/
        initMap();
    }
    function _destroy ()
    {
        //clearTimeout(g_oResizeTimer);
        //clearInterval(gCount);
        //g_MyChart = null;

    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init, 
        "destroy": _destroy, 
        //"resize": _resize,
        "widgets": ["SList","Form"],
        "utils":["Request","Base"]
    });   
})( jQuery );

