(function($){
    var MODULE_NAME = "a_dataanalysis.indoorlocation";
    var nowScale = 0;
    var sourceWidth = null;
    var sourceHeight = null;
    var nowMultiple = 1;
    var time = null;
    var g_currentfloor = 1;
    var g_mode = null;
    var image = [];
    var heatmapInstance = null;
    var hasHeatmap = false;
    var provinceList = null;

    function initEvent()
    {
        sourceWidth = parseInt(document.getElementById("private_map_div").style.width, 10);
        sourceHeight = parseInt(document.getElementById("private_map_div").style.height, 10);

        $("#private_map_div").draggable();
        $("#private_map_div").mousewheel(function(event, delta){
            //delta  往上滚是1放大，往下是-1  就是看滚轮的方向的
            console.log(nowScale);
            if (delta > 0) {  //为了放大
                if (nowScale < 2) {
                    nowScale += 1;
                    resizeMap(delta);
                }
            } else if (delta < 0) {
                if (nowScale > -2) {
                    nowScale -= 1;
                    resizeMap(delta);
                }
            }

            event.stopPropagation();
            event.preventDefault();
        });
    }

    function drawMapPoint() {
        var coord = [];
        for (var i = 0; i< 60; i++)
        {
            var obj = {};   //定义一个局部变量的变量？？？   不然每次改变之后      coord[obj,obj,obj]?????   obj每次都改变后，最后数组里面全是最后的那个obj？？？？？？？     是不是要用push??????????
            obj.x =  (100 + Math.floor(Math.random() * 450));
            obj.y = (120 + Math.floor(Math.random() * 310));
            coord.push(obj);
        }
        for (i = 60; i < 90; i++)
        {
            var temp = {};
            temp.x =  (550 + Math.floor(Math.random() * 200));
            temp.y = (180 + Math.floor(Math.random() * 220));
            coord.push(temp);
        }
        //var cvs = $("#private_map_canvas")[0];
        var cvs = document.getElementById("private_map_canvas");

        if (cvs.getContext)
        {
            var ctx = cvs.getContext("2d");
            ctx.clearRect(0,0,cvs.width,cvs.height);

            for (var j = 0; j < coord.length; j++)
            {
                var x = coord[j].x;
                var y = coord[j].y;
                ctx.fillStyle = '#E77531';
                ctx.beginPath();
                ctx.arc(x,y,3,0,Math.PI*2,true);
                ctx.closePath();
                ctx.fill();
            }
        }

    }

    function resizeMap(delta) {
        if (delta > 0) {
            nowMultiple += (delta) * 0.1;
        } else {
            nowMultiple += (delta) * 0.1;
        }

        var nowWidth = sourceWidth * nowMultiple;
        var nowHeight = sourceHeight * nowMultiple;
        $("#private_map_div").width(nowWidth);
        $("#private_map_div").height(nowHeight);
        mapSize = nowWidth + "px " + nowHeight + "px";
        $("#private_map_div").css({'background-size':mapSize, 'background-repeat':'no-repeat'});

        /*$("#private_map_canvas").attr('width', nowWidth);
         $("#private_map_canvas").attr('height', nowHeight);*/
        $("#private_map_canvas").width(nowWidth);
        $("#private_map_canvas").height(nowHeight);

        $("#private_container_div canvas").width(nowWidth);
        $("#private_container_div canvas").height(nowHeight);

        $("#private_map_div").find('svg').attr('width', nowWidth);
        $("#private_map_div").find('svg').attr('height', nowHeight);
    }

    function drawMapLine(floor)
    {
        var canvas = document.getElementById("private_map_canvas");
        if (canvas.getContext){
            //获取对应的CanvasRenderingContext2D对象(画笔)
            var ctx = canvas.getContext("2d");
            if (1 == floor)
            {
                ctx.beginPath();
                ctx.moveTo(420, 130);
                ctx.lineTo(420, 200);
                ctx.quadraticCurveTo(420,232,380,232);
                ctx.lineTo(260, 232);
                ctx.quadraticCurveTo(230,240,220,280);
                ctx.lineTo(220,430);
                ctx.strokeStyle = "rgba(0,229,238,0.8)";   //支持css颜色值的各种表现形式，例如："blue"、"#0000ff"、"#00f"、"rgb(0,0,255)"、"rgba(0,0,255,1)"
                ctx.lineJoin="round";
                ctx.lineWidth = 7;
                //ctx.strokeStyle = 'rgba(255,0,0,0.5)';
                ctx.stroke();
                ctx.closePath();

                ctx.beginPath();
                ctx.moveTo(419,120);
                ctx.lineTo(421,202);
                ctx.lineTo(451,235);
                ctx.lineTo(700,240);
                ctx.strokeStyle = "rgba(238,44,44,0.8)";
                ctx.lineJoin="round";
                ctx.lineWidth = 7;
                ctx.stroke();
                ctx.closePath();
            }
            else if (2 == floor)
            {
                ctx.beginPath();
                ctx.moveTo(425, 130);
                ctx.lineTo(420, 200);
                ctx.quadraticCurveTo(420,232,380,250);
                ctx.lineTo(260, 250);
                ctx.quadraticCurveTo(230,250,210,300);
                ctx.lineTo(200,330);
                ctx.lineTo(100, 330);
                ctx.lineTo(75,310);
                ctx.strokeStyle = "rgba(255,105,185,0.8)";
                ctx.lineJoin="round";
                ctx.lineWidth = 7;
                ctx.stroke();
                ctx.closePath();

                ctx.beginPath();
                ctx.moveTo(426,130);
                ctx.lineTo(438,282);
                ctx.quadraticCurveTo(600,330,700,260);
                ctx.strokeStyle = "rgba(255,165,0,0.8)";
                ctx.lineJoin="round";
                ctx.lineWidth = 7;
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
    function clearCanvas()
    {
        if (hasHeatmap)
        {
            //heatmapInstance._renderer.canvas.remove();
            heatmapInstance.setData({data:[]});
        }
        clearInterval(time);
        ctx = document.getElementById("private_map_canvas").getContext("2d");
        var cvs = document.getElementById("private_map_canvas");    //document.getElementById("private_map_canvas")   var cvs = $("#private_map_canvas")[0];
        ctx.clearRect(0,0,cvs.width,cvs.height);
    }

    function drawHeatmap()
    {
        //构建一些随机数据点,网页切图价格这里替换成你的业务数据
        var points = [];
        var max = 0;
        var width = 400;
        var height = 240;
        var len = 200;
        while (len--) {
            var val = Math.floor(Math.random()*100);
            max = Math.max(max, val);
            var point = {
                x: 100+Math.floor(Math.random()*width),
                y: 120+Math.floor(Math.random()*height),
                value: val
            };
            points.push(point);
        }
        var data = {
            max: max,
            data: points
        };
        //因为data是一组数据,web切图报价所以直接setData
        heatmapInstance.setData(data); //数据绑定还可以使用
    }

    function drawUserTrace()
    {
        var canvas = document.getElementById("private_map_canvas");
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(420, 130);
        ctx.lineTo(420, 200);
        ctx.quadraticCurveTo(420,232,440,232);
        ctx.lineTo(600, 240);
        ctx.strokeStyle = "red";   //支持css颜色值的各种表现形式，例如："blue"、"#0000ff"、"#00f"、"rgb(0,0,255)"、"rgba(0,0,255,1)"
        ctx.lineJoin="round";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
    }

    function resetCanvasSize()
    {
        //切换的时候初始化地图的大小和背景
        document.getElementById("private_map_div").style.width = "1000px";
        document.getElementById("private_map_div").style.height = "600px";
        $("#private_map_canvas").width("1000px");
        $("#private_map_canvas").height("600px");
        $("#private_container_div canvas").width("1000px");
        $("#private_container_div canvas").height("600px");

        document.getElementById("private_map_div").style.background = image[g_currentfloor-1];
        sourceWidth = parseInt(document.getElementById("private_map_div").style.width, 10);
        sourceHeight = parseInt(document.getElementById("private_map_div").style.height, 10);
        nowScale = 0;
        nowMultiple = 1;
    }

    function initClickEvent()
    {
        //点击切换不同模式
        $(".title-nav li").on('click', function(){
            if ($(this).children().hasClass("hover"))
            {
                return;
            }
            else
            {
                $("#location").removeClass("hover");
                $("#customer_trace").removeClass("hover");
                $("#heatmap").removeClass("hover");
                $("#user_trace").removeClass("hover");
                $(this).children().addClass("hover");

                console.log($(this).children().attr("id"));
                var id_name = $(this).children().attr("id");
                g_mode = id_name;

                resetCanvasSize();

                switch (id_name)
                {
                    case "location":
                    {
                        clearCanvas();
                        hasHeatmap = false;
                        drawMapPoint();
                        time = setInterval(drawMapPoint, 5000);
                        $(".map_trace_tip").css("display", "none");
                        $(".phone_query").css("display","none");
                        break;
                    }
                    case "customer_trace":
                    {
                        clearCanvas();
                        hasHeatmap = false;
                        drawMapLine(g_currentfloor);
                        $(".map_trace_tip").css("display", "inline");
                        $(".phone_query").css("display","none");
                        break;
                    }
                    case "heatmap":
                    {
                        clearCanvas();
                        hasHeatmap = true;
                        $(".map_trace_tip").css("display", "none");
                        $(".phone_query").css("display","none");
                        drawHeatmap();
                        break;
                    }
                    case "user_trace":
                    {
                        clearCanvas();
                        hasHeatmap = false;
                        $(".map_trace_tip").css("display", "none");
                        $(".phone_query").css("display","inline");
                        break;
                    }
                    default:
                        break;
                }
            }
        });

        //点击事件切换楼层
        $(".sideGuide li").on('click', function(){
            var index = $(this).index();

            if ('on' != $(this).attr('class'))
            {
                g_currentfloor = index+1;
                $(this).addClass('on').siblings().removeClass('on');
                $(".curBg").css("top", index*60+'px');

                resetCanvasSize();

                if (1 == g_currentfloor)
                {
                    if ("location" == g_mode)
                    {
                        //window.clearInterval(time);
                        clearCanvas();
                        drawMapPoint();
                        time = setInterval(drawMapPoint, 5000);
                        $(".map_trace_tip").css("display", "none");
                    }
                    else if ("customer_trace" == g_mode)
                    {
                        //window.clearInterval(time);
                        clearCanvas();
                        drawMapLine(g_currentfloor);
                        $(".map_trace_tip").css("display", "inline");
                    }
                }
                else if (2 == g_currentfloor)
                {
                    if ("location" == g_mode)
                    {
                        //window.clearInterval(time);
                        clearCanvas();
                        drawMapPoint();
                        time = setInterval(drawMapPoint, 5000);
                        $(".map_trace_tip").css("display", "none");
                    }
                    else if ("customer_trace" == g_mode)
                    {
                        //window.clearInterval(time);
                        clearCanvas();
                        drawMapLine(g_currentfloor);
                        $(".map_trace_tip").css("display", "inline");
                    }
                }
            }
        });

        $("#map_submit").on('click', function(){
            console.log("map_submit");
            image[0] = "url(css/image/market_f4.svg) 0% 0% / 1000px 600px no-repeat";
            image[1] = "url(css/image/market_f5.svg) 0% 0% / 1000px 600px no-repeat";
            resetCanvasSize();
        });

        $("#query_submit").on('click', function(){
            var myVal= document.getElementById("phone_input").value;
            if (myVal == '1')
            {
                drawUserTrace();
            }
        });
    }

    var addressInit = function(_cmbProvince, _cmbCity, _cmbArea, defaultProvince, defaultCity, defaultArea)
    {
        var cmbProvince = document.getElementById(_cmbProvince);
        var cmbCity = document.getElementById(_cmbCity);
        var cmbArea = document.getElementById(_cmbArea);

        function cmbSelect(cmb, str)
        {
            for(var i=0; i<cmb.options.length; i++)
            {
                if(cmb.options[i].value == str)
                {
                    cmb.selectedIndex = i;
                    return;
                }
            }
        }
        function cmbAddOption(cmb, str, obj)
        {
            var option = document.createElement("option");
            cmb.options.add(option);
            option.innerHTML = str;
            option.value = str;
            option.obj = obj;
        }

        function changeCity()
        {
            cmbArea.options.length = 0;
            if (cmbCity.selectedIndex == -1)
                return;
            var item = cmbCity.options[cmbCity.selectedIndex].obj;

            for (var i=0; i<item.areaList.length; i++)
            {
                cmbAddOption(cmbArea, item.areaList[i], null);
            }
            cmbSelect(cmbArea, defaultArea);
        }
        function changeProvince()
        {
            cmbCity.options.length = 0;
            cmbCity.onchange = null;
            //-1是什么鬼，从0开始的不是？-1是province的option一个都没有？
            if (cmbProvince.selectedIndex == -1)
                return;
            //这个cmbProvince成为一个全局变量了
            var item = cmbProvince.options[cmbProvince.selectedIndex].obj;  //dom节点对象
            //往城市中添加option
            for (var i=0; i<item.cityList.length; i++)
            {
                cmbAddOption(cmbCity, item.cityList[i].name, item.cityList[i]);
            }
            //填充好option后又根据默认值进行选择
            cmbSelect(cmbCity, defaultCity);
            changeCity();
            cmbCity.onchange = changeCity;
        }
        //这个函数从这里开始，全局的数组长度,现在的长度是2
        for (var i=0; i<provinceList.length; i++)
        {
            cmbAddOption(cmbProvince, provinceList[i].name, provinceList[i]);
        }
        //根据默认值设置初始的province
        cmbSelect(cmbProvince, defaultProvince);
        changeProvince();
        cmbProvince.onchange = changeProvince;
    };

    function initData()
    {
        g_mode = "location";
        g_currentfloor = 1;
        image[0] = "url(css/image/market_f1.svg) 0% 0% / 1000px 600px no-repeat";
        image[1] = "url(css/image/market_f2.svg) 0% 0% / 1000px 600px no-repeat";

        heatmapInstance = h337.create({
            container: $("#private_map_div")[0],
            "radius":10,
            "visible":true,
            gradient:{ "0.05": "#000",  "0.25": "rgb(0,255,255)", "0.50": "rgb(0,255,0)", "0.75": "yellow", "1": "rgb(255,0,0)"}
        });

        provinceList = [
            {
                name:'浙江省',
                cityList:[
                    {name:'杭州市', areaList:['杭州百货大楼', '西湖茶馆', '市民中心']},
                    {name:'绍兴市', areaList:['百草园']},
                    {name:'嘉兴市', areaList:['粽子']}
                ]
            },
            {
                name:'北京市',
                cityList:[
                    {name:'北京市', areaList:['故宫', '清华大学实验楼', '王府井']}
                ]
            }
        ];
    }

    function _init ()
    {
        initData();
        initEvent();
        drawMapPoint();
        time = setInterval(drawMapPoint, 5000);
        initClickEvent();
        addressInit('cmbProvince', 'cmbCity', 'cmbArea','浙江省','杭州市','西湖茶馆');  //可以自己设定最初的显示页面，跟在哪个对象数组无关
    }
    //框架的切换页面后，应该做的事情
    function _destroy ()
    {
        clearInterval(time);
    }
    function _resize()
    {
    }
    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["SList", "Echart", "Form"],
        "utils":["Request", "Base"]
    });
})(jQuery);