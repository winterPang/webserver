define(["utils", "moment", "echarts", "bootstrap-daterangepicker", "css!bootstrap_daterangepicker_css"], function (Utils, moment, echarts) {
	return ["$scope", "$http", "$alertService", "$interval", "$state", function ($scope, $http, $alert, $interval, $state) {
	
	var map = new BMap.Map('allmap');
	map.centerAndZoom(new BMap.Point(116.404269,39.916042), 12);
	  
	map.addControl(new BMap.NavigationControl());        // 添加平移缩放控件
	map.addControl(new BMap.ScaleControl());             // 添加比例尺控件
	map.addControl(new BMap.OverviewMapControl());       //添加缩略地图控件
	map.enableScrollWheelZoom();                         //启用滚轮放大缩小
	map.disable3DBuilding();

	//个性化在线编辑器地址：http://developer.baidu.com/map/custom/
	  var styleJson = [
          {
                    "featureType": "all",
                    "elementType": "all",
                    "stylers": {
                              "lightness": 10,
                              "saturation": -100
                    }
          }
]
	map.setMapStyle({styleJson:styleJson});
	
	
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

            var myIcon = new BMap.Icon("../smartcity/wiresafe/images/ap.gif", new BMap.Size(30,24));
            var marker = new BMap.Marker(new BMap.Point(data_info[i][0],data_info[i][1]),{icon:myIcon,title:"ap"+i});  // 创建标注
            map.addOverlay(marker);
           // marker.enableDragging();
           // marker.setAnimation(BMAP_ANIMATION_BOUNCE);
            marker.addEventListener("click",getAttr);
	
        }
		
        function getAttr($scope){
			$state.go("^.wiresafe_detail");
		  
	}  
	
	}];
});