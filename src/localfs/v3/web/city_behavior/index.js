;(function ($) {
    var MODULE_BASE = "city_behavior";
    var MODULE_NAME = MODULE_BASE + ".index";
    var gCount,g_DateType = null,gWEEK;
    var mapType = null;
    var onlinedata,outlinedata = null;
    function getRcText (sRcName)
    {
        return Utils.Base.getRcString("location_rc",sRcName);
    }

    function initMap() {
        var map = new BMap.Map("container");
        var point = new BMap.Point(116.400244,39.92556);
        map.enableScrollWheelZoom();
        map.centerAndZoom(point, 13);
            var data_info = [
            [116.417854,39.921988],
        ];
        var opts = {
            width : 500,     // 信息窗口宽度
            height: 180,     // 信息窗口高度
            title : "" ,
            offset:0,
        };

        for(var i=0;i<data_info.length;i++){
            var marker = new BMap.Marker(new BMap.Point(data_info[i][0],data_info[i][1]));  // 创建标注
            //var trStyle = "<tr style = 'border-bottom:1px solid #D6DCE3;padding-bottom:0px;" +
            //    "line-height:18px;margin-bottom:5px;float:left'>";
            //var tr2 = '</tr>';
            //var tdStyle = "<td style = 'background:#53B9E7;display:block;height:12px;width:12px;float:left;" +
            //    "border-radius:6px;margin:4px 0px 0 4px;'></td>";
            //var content = '<table><tr><td style="width:60%">最受欢迎的网站</td><td>最受欢迎的应用</td></tr>';
            //var table2 = '</table>';
            //var trOne = trStyle + tdStyle + '<td style="float:left">新浪 56% 304次</td>'+ tr2 ;
            //var trTwo = trStyle + tdStyle + '<td>youku 56% 304次</td>' + tr2;
            //var scontent = content + trOne + trTwo + table2;
            var arrayColor = ['#53B9E7','#31ADB4','#7B69C5','#FFBB33','#D3DE0A'];
            //for(var i =0;i< arrayColor.length;i++)
            //{
            //    var spanObj = {1:One,2:Two,3:Three,4:Four,5:Five};
            //}
            var span1 =  "<span style='background:";
            var span2 =  ";display:block;height:12px;";
            var span3 =  "width:12px;border-radius:6px;margin:4px 4px 0px 0px; float:left'></span>";
            var span4 ="<span style='display:inline-block;width: 90px;'>";
            var span5 = "<span style='float:right'>";
            var span6 = "<span style='float:right'>";
            var span7 = "</span>";
            var spanOne = span1 + arrayColor[0] + span2 + span3;
            var spanTwo = span1 + arrayColor[1] + span2 + span3;
            var spanThree = span1 + arrayColor[2] + span2 + span3;
            var spanFour = span1 + arrayColor[3] + span2 + span3;
            var spanFive = span1 + arrayColor[4] + span2 + span3;
            var div1 = "<div style='float:left;width:46%;border-bottom:1px solid #D6DCE3;" +
                "padding-bottom:0px;line-height:18px;margin-top:5px;margin-bottom:5px;margin-right:16px'>";
            var div2 = "</div>";
            var divTitle1 = "<div style='float:left;width:50%;'>最受欢迎的应用</div>";
            var divTitle2 = "<div style='float:left;width:50%;'>最受欢迎的网站</div>";
            var divOne = div1 + spanOne + span4+ 'youku'+ span7 + span5 +'56%'+ span7 +div2;
            var divTwo = div1 + spanOne + span4+ '新浪'+ span7 + span5 +'60%'+ span7 +div2;
            var divThree = div1 + spanTwo + span4+ '腾讯'+ span7 + span5 +'54%'+ span7 +div2;
            var divFour = div1 + spanTwo + span4+ '360网站'+ span7 + span5 +'58%'+ span7 +div2;
            var divFive = div1 + spanThree + span4+ '淘宝'+ span7 + span5 +'52%'+ span7 +div2;
            var divSix = div1 + spanThree + span4+ '阿里巴巴'+ span7 + span5 +'48%'+ span7 +div2;
            var divSeven = div1 + spanFour + span4+ '京东'+ span7 + span5 +'49%'+ span7 +div2;
            var divEight = div1 + spanFour + span4+ '百度'+ span7 + span5 +'46%'+ span7 +div2;
            var divNine = div1 + spanFive + span4+ '天猫'+ span7 + span5 +'22%'+ span7 +div2;
            var divTen = div1 + spanFive + span4+ 'w3school'+ span7 + span5 +'26%'+ span7 +div2;

            var scontent = divTitle1 + divTitle2 + divOne + divTwo + divThree + divFour +divFive +divSix+divSeven +divEight +divNine+divTen;
            map.addOverlay(marker);               // 将标注添加到地图中
            addClickHandler(scontent,marker);
        }
        marker.enableDragging();
        function addClickHandler(content,marker){
            marker.addEventListener("mouseover",function(e){
                    openInfo(content,e)}
            );
            marker.addEventListener("click",function(e){
                Utils.Base.redirect({np:"city_behavior.dpi_url"});
                    }
            );
            marker.addEventListener("mouseout",function(e){
                   map.closeInfoWindow();
                    //alert(2);
                   }
            );
        }
        function openInfo(content,e){
            var p = e.target;
            var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
            var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象
            map.openInfoWindow(infoWindow,point); //开启信息窗口
            infoWindow.addEventListener("clickclose",function(e){
                    // map.closeInfoWindow()
                    //alert(2);
                    }
            );
        }            // 将标注添加到地图中
    }

    function initGrid()
    {
    }


    function _init ()
    {
        initMap();
        initGrid();

    }
    function _destroy ()
    {

    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init, 
        "destroy": _destroy,
        "widgets": ["SList","Form"],
        "utils":["Request","Base"]
    });   
})( jQuery );
