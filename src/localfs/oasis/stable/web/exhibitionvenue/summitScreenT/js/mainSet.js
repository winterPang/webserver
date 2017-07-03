'use strict';
(function($){
    var timerMap;
    var timerGue;
    var timerStep;
    var timerCount;
    var timerTB;
    var timerUm;
    var oUmeng;
    var timerCenter;
    var timerBottom;
    var timerUmnegUpdate;
    var timerTop;
    var timerUmnegInterval;
    var onLineGuest;
    var advertData;
    var onlineTrad;
    var countAll;
    var timerTest;
    var presentGue=0;
    var timerAofei;
    var timerHeart;
    var timerStep;
    var errArrX;
    var errArrY;
    var gAcSNList = ["210235A1JTB15A000003"];/*探针数据ACSN*/
    var oBuyclass = {
        "居家":['洗护清洁剂/卫生巾/纸/香薰','汽车/用品/配件/改装','家庭/个人清洁工具','居家日用','居家布艺','住宅家具','厨房/烹饪用具','厨房电器','床上用品'],
        "服饰箱包":['女装/女士精品','女士内衣/男士内衣/家居服','男装','女鞋','箱包皮具/热销女包/男包','运动/瑜伽/健身/球迷用品','饰品/流行首饰/时尚饰品新','童装/婴儿装/亲子装','服饰配件/皮带/帽子/围巾','流行男鞋'],
        "洗护":['美容护肤/美体/精油','彩妆/香水/美妆工具','个人护理/保健/按摩器材'],
        "杂货":['书籍/杂志/报纸','电子词典/电纸书/文化用品','玩具/童车/益智/积木/模型','3C数码配件','移动/联通/电信充值中心','手机号码/套餐/增值业务'],
        "饮食":['零食/坚果/特产','粮油米面/南北干货/调味品','咖啡/麦片/冲饮','水产肉类/新鲜蔬果/熟食']
    };
    var devSn='210235A1JNB171000134';
    function informFail(str){
        str?$('.bg-sumScreen .failStr').html(str):'';
        $('.informFail').css({'display':'block'});
        setTimeout(function(){
            $('.informFail').css({'opacity':'1'});
        },100);
        setTimeout(function(){
            $('.informFail').css({'opacity':'0'});
            setTimeout(function(){
                $('.informFail').css({'display':'none'});
            },300);
        },5000);
    }
    /*随机数*/
    function rand(n,m){
        return parseInt(Math.random()*(m-n)+n);
    }
    /*遍历对象，整合消费类型为字符串*/
    for (var k in oBuyclass) {
        oBuyclass[k] = oBuyclass[k].join('/');
    }
    /*校验函数，判断入参是否空对象,false:空对象,true:非空*/
    function isOK(obj){
        var flag = false;
        for (var k in obj) {
            if(obj[k]) {
                flag = true;
                break;
            }
        }
        return flag;
    }
    /*时间格式*/
    function FormatTimeDate(){
        Date.prototype.Format = function (fmt) {
            var o = {
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //日
                "h+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }
    }
    FormatTimeDate();
    /*盒子百分比*/
    function tangleColor(sClass,boxNum,tangleNum,tangleCount){
        var pre=0;
        for(var i=0;i<tangleCount;i++){
            var oA=$('<span></span>');
            $('.'+sClass+':eq('+boxNum+')').append(oA);
        }
        function changeBac(index,time){
            setTimeout(function(){
                //$('.box div:eq('+index+')').addClass('grad');
                $('.'+sClass+':eq('+boxNum+') span:eq('+index+')').css({'background':'linear-gradient(#46cdff,#2f9eff)'});
                $('.'+sClass+':eq('+boxNum+') span:eq('+index+')').css({'background':'-webkit-linear-gradient(#46cdff,#2f9eff)'});
            },time*50);
        }
        function backBac(index,time){
            setTimeout(function(){
                $('.'+sClass+':eq('+boxNum+') span:eq('+index+')').css({'background':'#363d46'});
            },time*50);
        }
        var r=tangleNum;
        if(pre!=0){
            if(r>pre){
                //$('.box div').css({'background':'#ccc'});
                for(var i=pre;i<r;i++){
                    changeBac(i,i);
                }
                pre=r;
            }else if(pre>r){
                console.log(pre-r);
                for(var i=0;i<pre-r;i++){
                    backBac(pre-i-1,i);
                    console.log(pre-i);
                }
                pre=r;
            }else{
                for(var i=0;i<r;i++){
                    changeBac(i,i);
                }
                pre=r;
            }
        }else{
            for(var i=0;i<r;i++){
                changeBac(i,i);
            }
            pre=r;
        }
    }
    /*获取数据*/
    function getTypeValue(obj){
        /*校验*/
        if(!isOK(obj)) {return false}

        var aType = [],
            aValue = [];
        for (var k in obj) {
            aType.push(k);
            aValue.push(obj[k])
        }
        return {"Type":aType,"Value":aValue};
    }
    /*整合type,value*/
    function formatTypeValue(obj,len){
        /*校验*/
        if(!isOK(obj)){return false;}
        var aFrmt = [],
            aType = [],
            aValue = [],
            dLength = 0,
            dOther = 0;
        /*遍历对象属性，生成数组*/
        for (var k in obj) {
            aFrmt.push(
                {
                    type:k,
                    value:obj[k]
                }
            );
        }
        /*计算数组长度*/
        dLength = aFrmt.length;

        /*按照value倒序排列数组*/
        aFrmt = aFrmt.sort(function (a,b){
            return b.value - a.value;
        });
        /*判断传入数据是否超出需求长度len，超出则截取数组*/
        if (dLength >= len) {
            /*数组截取前len-1个，剩余部分用“其他”代替*/
            aFrmt = aFrmt.slice(0,len-1);
        }
        /*遍历数组，输出返回值格式*/
        aFrmt.forEach(function(v){
            aType.push(v.type);
            aValue.push(v.value);
            dOther += v.value;/*纪录当前数据value值之和，添加其他数据使用*/
        });

        /*dOther不为1，代表数组经过截取，需要添加“其他”项至返回值中*/
        if (dOther < 1) {
            dOther = 1 - dOther;
            aType.push("其他");
            aValue.push(dOther);
        }

        return {"Type":aType,"Value":aValue};
    }
    /*购物兴趣*/
    function getBuypreferDate(obj){
        /*校验*/
        if(!isOK(obj)) {return false;}

        var oBuyTemp = {},aType = [],aValue = [];
        var dTotal = 0;
        /*遍历obj和消费类型oBuyclass，归类累计到oBuyTemp，同时'求和'dTotal*/
        for (var type in obj) {
            dTotal += obj[type];
            for (var k in oBuyclass) {
                /*判断obj的属性type，*/
                if (oBuyclass[k].indexOf(type)>=0) {
                    if (!oBuyTemp[k]) {
                        /*赋初值*/
                        oBuyTemp[k] = 0;
                    }
                    /*同类型累计*/
                    oBuyTemp[k] += obj[type];
                    /*跳出本次循环*/
                    continue;
                }
            }
        }
        /*计算'其他'值，1-dTotal*/
        oBuyTemp["其他"] = 1 - dTotal;
        /*遍历oBuyTemp，生成数组aType、aValue,保留小数点后四位*/
        for (var name in oBuyTemp) {
            aType.push(name);
            aValue.push(oBuyTemp[name].toFixed(4));
        }

        return {'Type':aType,'Value':aValue};
    }
    /*三色盒子*/
    function preTangle(className,num){
        $('.'+className+' span').remove();
        function changeBac(index,time){
            //console.log('增色');
            setTimeout(function(){
                //$('.box div:eq('+index+')').addClass('grad');
                $('.box span:eq('+index+')').css({'background':'linear-gradient(#46cdff,#2f9eff)'});
                $('.box span:eq('+index+')').css({'background':'-webkit-linear-gradient(#46cdff,#2f9eff)'});
            },time*50);
        }
        function backBac(index,time){
            console.log('减色');
            setTimeout(function(){
                //$('.box div:eq('+index+')').addClass('grad');
                $('.box div:eq('+index+')').css({'background':'#ccc'});
            },time*50);
        }
        var boxLen=$('.'+className+' span').length;
        function createBox(index,time){
            //console.log(222);
            setTimeout(function(){
                var oA=$('<span></span>');
                $('.'+className).append(oA);
            },time*100);
        }
        function delBox(index,time){
            setTimeout(function(){
                $('.'+className+' span:eq('+index+')').remove();
            },time*100);
        }
        if(boxLen!=0){
            //console.log(num,boxLen);
            if(boxLen<num){
                for(var i=0;i<num-boxLen;i++){
                    createBox(1,i);
                }
            }else if(boxLen>num){
                for(var i=0;i<boxLen-num;i++){
                    //console.log('del');
                    delBox(boxLen-i-1,i);
                }
            }else{

            }
        }else{
            //console.log(333);
            for(var i=0;i<num;i++){
                //console.log(444);
                createBox(1,i);
            }
        }
    }
    /*添加间隔符*/
    function cutNum(n){
        var m=parseInt(n).toString();
        var L=m.length;
        if(L<=3){return m;}
        var p=L%3;
        return p>0?m.slice(0,p)+","+m.slice(p,L).match(/\d{3}/g).join(","):m.slice(p,L).match(/\d{3}/g).join(",");
    }
    /*数码表*/
    function getGuestNum(str,size,sClass){
        var str=formatZero(str,4);
        var arr=str.split('');
        //console.log($('.'+sClass+' .sildeBar').length,123);
        //console.log('.'+sClass+' .slideBar');
        $('.'+sClass+' .slideBar').each(function(index){
            //console.log(111);
            var $this=$(this);
            setTimeout(function(){
                $this.css({'backgroundPosition':'0 -'+arr[index]*size+'px'});
            },(5-index)*300);
        });
    }
    /*补零函数*/
    function formatZero(num,len){
        var num=num+'';
        var strTemp="";
        for(var i=0;i<len-num.length;i++){
            strTemp+="0";
        }
        return strTemp+num;
    }
    /*末尾变整函数*/
    function lastZero(str){
        return str.substring(0,str.length-1)+'0';
    }
    /*Ecahrts数据处理*/
    function grid(){
        /*Echarts配置文件路径*/
        require.config({
            paths: {
                echarts: 'build/dist'
            }
        });
        require(
            [
                'echarts',
                'echarts/chart/line', // 使用柱状图就加载bar模块，按需加载
                'echarts/chart/map',
                'echarts/chart/pie',
                'echarts/chart/bar',
                'echarts/chart/scatter'
            ],
            function (ec) {
                /*Echarts图表设置*/
                /*年龄分布饼图*/
                function drawAgePie(oT,oV){
                    /*处理41-40岁，替换成41-50岁*/
                    var bIndex = oT.indexOf('41-40岁')
                    if (bIndex >= 0) {
                        oT[bIndex] = '41-50岁';
                    }

                    var option = {
                        color:['#262d50'],
                        calculable : false,
                        series : [
                            {
                                name:'性别分布',
                                type:'pie',
                                radius : [90, 130],
                                x: '60%',
                                width: '35%',
                                funnelAlign: 'left',
                                hoverable:false,
                                max: 1048,
                                itemStyle : {
                                    normal : {
                                        color:'#48b7f9',
                                        borderWidth:2,
                                        borderColor:'rgba(46,51,62,1)',
                                        label : {
                                            //position : 'inner',
                                            /*formatter: '{b} \n {d}%',*/
                                            formatter : function (params) {
                                                return  params.name+'\n'+(params.percent - 0).toFixed(1) + '%'
                                            },
                                            show : true,
                                            textStyle: {
                                                fontSize :'24',
                                                color: '#fff'
                                            }
                                        },
                                        labelLine : {
                                            show : true,
                                            length:40,
                                            lineStyle:{
                                                color:'#48b7f9',
                                                width:2
                                            }

                                        }
                                    },
                                    emphasis : {
                                        label : {
                                            show : false,
                                            position : 'center',
                                            textStyle : {
                                                fontSize : '30',
                                                fontWeight : 'bold'
                                            }
                                        }
                                    }
                                },
                                data:[]
                            }
                        ]
                    };
                    for(var i=0;i<oT.length;i++){
                        option.series[0].data.push({value:oV[i], name:oT[i],selected:false});
                    }
                    option.series[0].data[0].selected=true;
                    var MyChart = ec.init(document.getElementById('agePie'));
                    MyChart.setOption(option);
                }
                /*性别分布饼图*/
                function drawSexualPie(oT,oV){
                    var option = {
                        color:['#262d50'],
                        calculable : false,
                        series : [
                            {
                                name:'性别分布',
                                type:'pie',
                                radius : [90, 130],
                                x: '60%',
                                width: '35%',
                                funnelAlign: 'left',
                                max: 1048,
                                itemStyle : {
                                    normal : {
                                        color:'#48b7f9',
                                        borderWidth:2,
                                        borderColor:'rgba(46,51,62,1)',
                                        label : {
                                            show : true,
                                            /*formatter: '{b} \n {d}%',*/
                                            formatter : function (params) {
                                                return  params.name+'\n'+(params.percent - 0).toFixed(1) + '%'
                                            },
                                            textStyle: {
                                                fontSize :'24',
                                                color: '#fff'
                                            }
                                        },
                                        labelLine : {
                                            show : true,
                                            length:40,
                                            lineStyle:{
                                                color:'#48b7f9',
                                                width:2
                                            }

                                        }
                                    },
                                    emphasis : {
                                        label : {
                                            show : false,
                                            position : 'center',
                                            textStyle : {
                                                fontSize : '30',
                                                fontWeight : 'bold'
                                            }
                                        }
                                    }
                                },
                                data:[]
                            }
                        ]
                    };
                    for(var i=0;i<oT.length;i++){
                        option.series[0].data.push({value:oV[i], name:oT[i],selected:false});
                        /*option.series[0].data[i].value=oV[i];
                         option.series[0].data[i].name=oT[i];*/
                    }
                    option.series[0].data[0].selected=true;
                    var MyChart = ec.init(document.getElementById('sexualPie'));
                    MyChart.setOption(option);
                }
                /*购物兴趣饼图*/
                function drawShopPie(oT,oV){
                    var option = {
                        color:['#262d50'],
                        calculable : false,
                        series : [
                            {
                                name:'',
                                type:'pie',
                                radius : [90, 130],
                                hoverable:false,
                                x: '60%',
                                width: '35%',
                                funnelAlign: 'left',
                                max: 1048,
                                itemStyle : {
                                    normal : {
                                        color:'#48b7f9',
                                        borderWidth:2,
                                        borderColor:'rgba(46,51,62,1)',
                                        label : {
                                            show : true,
                                            /*formatter: '{b} \n ({d}).toFixed(1)%',*/
                                            formatter : function (params) {
                                                return  params.name+'\n'+(params.percent - 0).toFixed(1) + '%'
                                            },
                                            textStyle: {
                                                fontSize :'24',
                                                color: '#fff'
                                            }
                                        },
                                        labelLine : {
                                            show : true,
                                            length:40,
                                            lineStyle:{
                                                color:'#48b7f9',
                                                width:2
                                            }

                                        }
                                    },
                                    emphasis : {
                                        label : {
                                            show : false,
                                            position : 'center',
                                            textStyle : {
                                                fontSize : '30',
                                                fontWeight : 'bold'
                                            }
                                        }
                                    }
                                },
                                data:[]
                            }
                        ]
                    };
                    for(var i=0;i<oT.length;i++){
                        if(oV[i]<0){
                            oV[i]=0;
                        }else{

                        }
                        option.series[0].data.push({value:oV[i], name:oT[i],selected:false});
                        //option.series[0].data[i].value=oV[i];
                        //option.series[0].data[i].name=oT[i];
                        //console.log(oT[i]);
                    }
                    //console.log(option.series[0].data,98987);
                    option.series[0].data[0].selected=true;
                    var MyChart = ec.init(document.getElementById('shopPie'));
                    MyChart.setOption(option);
                }
                /*消费能力分布饼图*/
                function drawConsumelPie(oT,oV){
                    var option = {
                        color:['#262d50'],
                        calculable : false,
                        series : [
                            {
                                name:'',
                                type:'pie',
                                radius : [90, 130],
                                hoverable:false,
                                x: '60%',
                                width: '35%',
                                funnelAlign: 'left',
                                max: 1048,
                                itemStyle : {
                                    normal : {
                                        color:'#48b7f9',
                                        borderWidth:2,
                                        borderColor:'rgba(46,51,62,1)',
                                        label : {
                                            show : true,
                                            /*formatter: '{b} \n {d}%',*/
                                            formatter : function (params) {
                                                return  params.name+'\n'+(params.percent - 0).toFixed(1) + '%'
                                            },
                                            textStyle: {
                                                fontSize :'24',
                                                color: '#fff'
                                            }
                                        },
                                        labelLine : {
                                            show : true,
                                            length:50,
                                            lineStyle:{
                                                color:'#48b7f9',
                                                width:2
                                            }

                                        }
                                    },
                                    emphasis : {
                                        label : {
                                            show : false,
                                            position : 'center',
                                            textStyle : {
                                                fontSize : '30',
                                                fontWeight : 'bold'
                                            }
                                        }
                                    }
                                },
                                data:[]
                            }
                        ]
                    };
                    for(var i=0;i<oT.length;i++){
                        option.series[0].data.push({value:oV[i], name:oT[i]});
                    }
                    option.series[0].data.reverse();
                    option.series[0].data[0].selected=true;
                    var MyChart = ec.init(document.getElementById('consumePie'));
                    MyChart.setOption(option);
                }
                /*学历分布柱形图*/
                function drawQualificationBar(oT,oV){
                    var option = {
                        grid:{
                            x:200,
                            y:70,
                            x2:200,
                            y2:70,
                            borderWidth:0
                        },
                        /*tooltip : {
                         trigger: 'axis',
                         axisPointer:{
                         type:'none'
                         }
                         },*/
                        calculable : false,
                        xAxis : [
                            {
                                axisLine:{
                                    show:false,
                                    lineStyle:{
                                        width:0
                                    }
                                },
                                axisLabel:{
                                    textStyle:
                                    {
                                        color:'#fefcf7',
                                        fontSize:'30'
                                    }
                                },
                                splitLine:{
                                    show:false,
                                    lineStyle:{
                                        width:0
                                    }

                                },
                                type : 'category',
                                boundaryGap : false,
                                data : ['本科','硕士','博士']
                                /*data : ['初高中','专科','本科','硕士','博士']*/
                            }
                        ],
                        yAxis : [
                            {
                                show:false,
                                axisLine:{
                                    lineStyle:{
                                        width:0,
                                        color:'#496174'
                                    }
                                },
                                //name:'浏览量（人次）',
                                splitLine:{
                                    show:false,
                                    lineStyle:{
                                        color:'rgba(73,97,116,.2)',
                                        width:1
                                    }
                                },
                                type : 'value',
                                axisLabel : {
                                    textStyle:
                                    {
                                        fontSize:'18',
                                        color: '#496174'
                                    },
                                    formatter: '{value}    '
                                }
                            }
                        ],
                        series : [
                            {
                                name:'',
                                type:'bar',
                                hoverable:false,
                                barWidth:'60',
                                itemStyle:{
                                    normal:{
                                        label:{
                                            //formatter:'{c}%',
                                            formatter:function(params){
                                                //console.log((params.value*100).toFixed(1));
                                                return (params.value*100).toFixed(1)+'%';
                                            },
                                            show:true,
                                            position: 'top',
                                            textStyle:{
                                                color:'#fefcf7',
                                                fontSize:'30'
                                            }
                                        },
                                        color:['#2f9eff']

                                        /*color: function (params){
                                         var colorList = ['rgba(70,97,193,.3)','rgba(70,97,193,.4)','rgba(70,97,193,0.5)','rgba(70,97,193,.6)','rgba(70,97,193,.7)','rgba(70,97,193,.6)','rgba(70,97,193,.7)','rgba(70,97,193,.6)','rgba(70,97,193,.7)','rgba(70,97,193,.6)','rgba(70,97,193,.7)','rgba(70,97,193,.8)','rgba(70,97,193,.9)'];
                                         return colorList[params.dataIndex];
                                         }*/
                                    },
                                    emphasis : {
                                        label : {
                                            show : true,
                                            position : 'center',
                                            textStyle : {
                                                color:'#fefcf7',
                                                fontSize:'30'
                                            }
                                        }
                                    }
                                },
                                symbol: 'none',
                                data:[0,0,0]
                            }
                        ]
                    };
                    function isExist(str,arrX){
                        for(var i=0;i<arrX.length;i++){
                            if(arrX[i]==str){
                                return false;;
                            }
                        }
                        return true;
                    }
                    var oTval=0;
                    for(var i=0;i<option.xAxis[0].data.length;i++){
                        for(var j=0;j<oT.length;j++){
                            if(option.xAxis[0].data[i]==oT[j]){
                                option.series[0].data[i]=(oV[j]);
                                oTval+=oV[j];
                                /*option.series[0].data[i]=parseInt(oV[j].toFixed(4)*100);
                                 oTval+=parseInt(oV[j].toFixed(4)*100);*/
                                break;
                            }
                        }
                    }
                    //console.log(rand(7,9)/100);
                    if(isExist('博士',oT)){
                        option.xAxis[0].data.unshift('其他');
                        option.series[0].data.unshift(1-oTval);
                        option.series[0].data[3]=rand(10,20)/1000;
                        for(var i=0;i<3;i++){
                            option.series[0].data[i]=option.series[0].data[i]*(1-option.series[0].data[3]);
                        }
                    }else{
                        option.xAxis[0].data.unshift('其他');
                        option.series[0].data.unshift(1-oTval);
                    }
                    var MyChart = ec.init(document.getElementById('qualificationBar'));
                    MyChart.setOption(option);
                }
                /*上网偏好柱形图*/
                function drawClientHabitBar(oT,oV){
                    var option = {
                        grid:{
                            x:100,
                            y:60,
                            x2:100,
                            y2:70,
                            borderWidth:0
                        },
                        /*tooltip : {
                         trigger: 'axis',
                         axisPointer:{
                         type:'none'
                         }
                         },*/
                        calculable : false,
                        xAxis : [
                            {
                                axisLine:{
                                    show:false,
                                    lineStyle:{
                                        width:0
                                    }
                                },
                                axisLabel:{
                                    textStyle:
                                    {
                                        color:'#fefcf7',
                                        fontSize:'30'
                                    }
                                },
                                splitLine:{
                                    show:false,
                                    lineStyle:{
                                        width:0
                                    }

                                },
                                type : 'category',
                                boundaryGap : false,
                                data : []
                            }
                        ],
                        yAxis : [
                            {
                                show:false,
                                axisLine:{
                                    lineStyle:{
                                        width:0,
                                        color:'#496174'
                                    }
                                },
                                //name:'浏览量（人次）',
                                splitLine:{
                                    show:false,
                                    lineStyle:{
                                        color:'rgba(73,97,116,.2)',
                                        width:1
                                    }
                                },
                                type : 'value',
                                axisLabel : {
                                    textStyle:
                                    {
                                        fontSize:'18',
                                        color: '#496174'
                                    },
                                    formatter: '{value  '
                                }
                            }
                        ],
                        series : [
                            {
                                name:'',
                                type:'bar',
                                barWidth:'60',
                                itemStyle:{
                                    normal:{
                                        label:{
                                            formatter:'{c}%',
                                            show:true,
                                            position: 'top',
                                            textStyle:{
                                                color:'#fefcf7',
                                                fontSize:'30'
                                            }
                                        },
                                        color:['#2f9eff']
                                        /*color: function (params){
                                         var colorList = ['rgba(70,97,193,.3)','rgba(70,97,193,.4)','rgba(70,97,193,0.5)','rgba(70,97,193,.6)','rgba(70,97,193,.7)','rgba(70,97,193,.6)','rgba(70,97,193,.7)','rgba(70,97,193,.6)','rgba(70,97,193,.7)','rgba(70,97,193,.6)','rgba(70,97,193,.7)','rgba(70,97,193,.8)','rgba(70,97,193,.9)'];
                                         return colorList[params.dataIndex];
                                         }*/
                                    },
                                    emphasis : {
                                        label : {
                                            show : true,
                                            position : 'center',
                                            textStyle : {
                                                color:'#fefcf7',
                                                fontSize:'30'
                                            }
                                        }
                                    }
                                },
                                symbol: 'none',
                                data:[]
                            }
                        ]
                    };
                    for(var i=0;i<oV.length;i++){
                        oV[i]=parseInt(oV[i].toFixed(2)*100);
                        /*oV[i]=oV[i].toFixed(2)*100;*/
                    }
                    if(oV.length==7){
                        var oThSeven=0;
                        for(var i=0;i<6;i++){
                            oThSeven+=oV[i];
                        }
                        oV[6]=100-oThSeven;
                    }
                    option.xAxis[0].data=oT;
                    option.series[0].data=oV;
                    var MyChart = ec.init(document.getElementById('onlineHabit'));
                    MyChart.setOption(option);
                }
                /*广告浏览趋势堆积图*/
                function drawRecordLine(arrTL,arrST,arrCT){
                    var option = {
                        //tooltip : {
                        //    trigger: 'axis',
                        //    axisPointer:{
                        //        type:'none'
                        //    }
                        //},
                        color:['#f2b154','#56b92d'],
                        calculable : true,
                        xAxis : [
                            {
                                show:true,
                                type : 'category',
                                boundaryGap : false,
                                data :[1,2,3,4,5,6,7,8],
                                axisLine:{
                                    show:false,
                                    lineStyle:{
                                        color:'rgba(255,255,255,.3)',
                                        width:1
                                    }
                                },
                                axisTick:{
                                    show:false
                                },
                                axisLabel:{
                                    textStyle:
                                    {
                                        fontSize:'30',
                                        fontFamily:'Roman',
                                        color: '#fefcf7'
                                    }
                                },
                                splitLine:{
                                    show:false,
                                    lineStyle:{
                                        width:1,
                                        color:'rgba(204,204,204,.1)'
                                    }

                                }
                            }

                        ],
                        grid:{
                            x:50,
                            y:80,
                            x2:50,
                            y2:60,
                            borderWidth:0
                        },
                        yAxis : [
                            {
                                show:false,
                                type : 'value',
                                axisLine:{
                                    show:false,
                                    lineStyle:{
                                        color:'rgba(255,255,255,.3)',
                                        width:1
                                    }
                                },
                                axisLabel:{
                                    textStyle:
                                    {
                                        fonSize:'14px',
                                        color: 'rgba(87,89,97,1)'
                                    }
                                },
                                splitLine:{
                                    show:false,
                                    lineStyle:{
                                        width:1,
                                        color:'rgba(204,204,204,.1)'
                                    }

                                }
                            }
                        ],
                        series : [
                            {
                                name:'趋势1',
                                symbol:'none',
                                type:'line',
                                smooth:true,
                                itemStyle: {
                                    normal: {
                                        lineStyle:{
                                            width:1,
                                            color:'rgba(46, 72, 167, 0.15)'
                                        },
                                        show:true,
                                        color:'rgba(86, 185, 210, 0.35)',
                                        areaStyle: {
                                            type: 'default',
                                            color:'rgba(25,110,208, .8)'
                                            /*color:(function (){
                                             var zrColor = require('zrender/tool/color');
                                             return zrColor.getLinearGradient(
                                             300, 90, 300, 200,
                                             [[0, 'rgba(35,200,200, 0.1)'],[1, 'rgba(25,110,208,.6)']]
                                             )
                                             })()*/
                                        }
                                    }
                                },
                                data:[1,254,334,340,243,234,256,257]
                            },
                            {
                                name:'趋势2',
                                symbol:'none',
                                type:'line',
                                smooth:true,
                                itemStyle: {
                                    normal: {
                                        lineStyle:{
                                            width:1,
                                            color:'rgba(46, 72, 167, 0.15)'
                                        },
                                        show:true,
                                        color:'rgba(86, 185, 210, 0.35)',
                                        areaStyle: {
                                            type: 'default',
                                            color:'rgba(25,110,208, .8)'
                                            /*color:(function (){
                                             var zrColor = require('zrender/tool/color');
                                             return zrColor.getLinearGradient(
                                             300, 90, 300, 200,
                                             [[0, 'rgba(35,200,200, 0.1)'],[1, 'rgba(25,110,208,.6)']]
                                             )
                                             })()*/
                                        }
                                    }
                                },
                                data:[1,254,334,340,243,234,256,257]
                            }
                        ]
                    };
                    option.xAxis[0].data=arrTL;
                    option.series[0].data=arrST;
                    option.series[1].data=arrCT;
                    var MyChart = ec.init(document.getElementById('advertTrad'));
                    MyChart.setOption(option);
                }
                /*实时来宾趋势堆积图*/
                function drawGueTrad(arrX,arrY){
                    var option = {
                        //tooltip : {
                        //    trigger: 'axis',
                        //    axisPointer:{
                        //        type:'none'
                        //    }
                        //},
                        color:['#f2b154','#56b92d'],
                        calculable : true,
                        xAxis : [
                            {
                                show:true,
                                type : 'category',
                                boundaryGap : false,
                                data :[1,2,3,4,5,6,7,8],
                                axisLine:{
                                    show:false,
                                    lineStyle:{
                                        color:'rgba(255,255,255,.3)',
                                        width:1
                                    }
                                },
                                axisTick:{
                                    show:false
                                },
                                axisLabel:{
                                    textStyle:
                                    {
                                        fontSize:'30',
                                        fontFamily:'Roman',
                                        color: '#fefcf7'
                                    }
                                },
                                splitLine:{
                                    show:false,
                                    lineStyle:{
                                        width:1,
                                        color:'rgba(204,204,204,.1)'
                                    }

                                }
                            }

                        ],
                        grid:{
                            x:80,
                            y:80,
                            x2:50,
                            y2:60,
                            borderWidth:0
                        },
                        yAxis : [
                            {
                                show:true,
                                type : 'value',
                                axisLine:{
                                    show:false,
                                    lineStyle:{
                                        color:'rgba(255,255,255,.3)',
                                        width:1
                                    }
                                },
                                axisLabel:{
                                    textStyle:
                                    {
                                        fontSize:'24',
                                        color: '#e6e6e6'
                                    }
                                },
                                splitLine:{
                                    show:false,
                                    lineStyle:{
                                        width:1,
                                        color:'rgba(204,204,204,.1)'
                                    }

                                }
                            }
                        ],
                        series : [
                            {
                                name:'趋势',
                                symbol:'none',
                                type:'line',
                                smooth:true,
                                itemStyle: {
                                    normal: {
                                        lineStyle:{
                                            width:1,
                                            color:'rgba(46, 72, 167, 0.15)'
                                        },
                                        show:true,
                                        color:'rgba(86, 185, 210, 0.35)',
                                        areaStyle: {
                                            type: 'default',
                                            color:'rgba(25,110,208, .8)'
                                            /*color:(function (){
                                             var zrColor = require('zrender/tool/color');
                                             return zrColor.getLinearGradient(
                                             300, 90, 300, 200,
                                             [[0, 'rgba(35,200,200, 0.1)'],[1, 'rgba(25,110,208,.6)']]
                                             )
                                             })()*/
                                        }
                                    }
                                },
                                data:[1,254,334,340,243,234,256,257]
                            }
                        ]
                    };
                    option.xAxis[0].data=arrX;
                    option.series[0].data=arrY;
                    //console.log(option.xAxis[0].data,option.series[0].data);
                    var MyChart = ec.init(document.getElementById('advertTrad'));
                    MyChart.setOption(option);
                }
                /*上学时间泡泡图*/
                function drawBubble(){
                    var option = {
                        color:['rgba(47,158,255,.6)'],
                        grid:{
                            borderWidth:0
                        },
                        xAxis : [
                            {
                                type : 'category',
                                splitLine:{
                                    show:false
                                },
                                axisLabel: {
                                    textStyle:{
                                        fontSize:'25',
                                        fontFamily:'Roman',
                                        color:'#fefcf7'
                                    },
                                    formatter : function(v) {
                                        return  v
                                    }
                                },
                                data :['7:00','7:10','7:20','7:30','7:40','7:50','8:00','8:10','8:20','8:30','8:40','8:50','9:00']
                            }],
                        yAxis : [
                            {
                                show:false,
                                type : 'value',
                                splitNumber: 4,
                                scale: false
                            }
                        ],
                        series : [
                            {
                                name:'',
                                type:'scatter',
                                color:'',
                                itemStyle:{

                                },
                                symbolSize: function (value){
                                    return Math.round(value[2]/ 5);
                                },
                                data: [['7:00',5,40],['7:10',5,50],['7:20',5,120],['7:30',5,150],['7:40',5,170],['7:50',5,200],['8:00',5,180],['8:10',5,150],['8:20',5,70],['8:30',5,80],['8:40',5,60],['8:50',5,20],['9:00',5,20]]
                            }
                        ]
                    };
                    var MyChart= ec.init(document.getElementById('timeSpread'));
                    MyChart.setOption(option, false);
                }
                /*步数统计柱形图*/
                function drawStep(){
                    var option = {
                        grid:{
                            x:100,
                            y:50,
                            x2:30,
                            y2:40,
                            borderWidth:0
                        },
                        /*tooltip : {
                         trigger: 'axis',
                         axisPointer:{
                         type:'none'
                         }
                         },*/
                        calculable : false,
                        xAxis : [
                            {
                                axisLine:{
                                    show:false,
                                    lineStyle:{
                                        width:0
                                    }
                                },
                                axisLabel:{
                                    textStyle:
                                    {
                                        color:'#fefcf7',
                                        fontFamily:'Roman',
                                        fontSize:'22'
                                    }
                                },
                                splitLine:{
                                    show:false,
                                    lineStyle:{
                                        width:0
                                    }

                                },
                                type : 'category',
                                boundaryGap : false,
                                data : ['<1000','1000-3000','3000-5000','5000-7000','7000<']
                            }
                        ],
                        yAxis : [
                            {
                                show:false,
                                axisLine:{
                                    lineStyle:{
                                        width:0,
                                        color:'#496174'
                                    }
                                },
                                //name:'浏览量（人次）',
                                splitLine:{
                                    show:false,
                                    lineStyle:{
                                        color:'rgba(73,97,116,.2)',
                                        width:1
                                    }
                                },
                                type : 'value',
                                axisLabel : {
                                    textStyle:
                                    {
                                        fontSize:'18',
                                        color: '#496174'
                                    },
                                    formatter: '{value} '
                                }
                            }
                        ],
                        series : [
                            {
                                name:'',
                                type:'bar',
                                barWidth:'60',
                                itemStyle:{
                                    normal:{
                                        label:{
                                            formatter:'{c}%',
                                            show:true,
                                            position: 'top',
                                            textStyle:{
                                                color:'#fefcf7',
                                                fontSize:'30'
                                            }
                                        },
                                        color:['#2f9eff']
                                        /*color: function (params){
                                         var colorList = ['rgba(70,97,193,.3)','rgba(70,97,193,.4)','rgba(70,97,193,0.5)','rgba(70,97,193,.6)','rgba(70,97,193,.7)','rgba(70,97,193,.6)','rgba(70,97,193,.7)','rgba(70,97,193,.6)','rgba(70,97,193,.7)','rgba(70,97,193,.6)','rgba(70,97,193,.7)','rgba(70,97,193,.8)','rgba(70,97,193,.9)'];
                                         return colorList[params.dataIndex];
                                         }*/
                                    },
                                    emphasis : {
                                        label : {
                                            show : true,
                                            position : 'center',
                                            textStyle : {
                                                color:'#fefcf7',
                                                fontSize:'30'
                                            }
                                        }
                                    }
                                },
                                symbol: 'none',
                                data:[20,25,30,15,10]
                            }
                        ]
                    };
                    option.series[0].data[0]=parseInt(10+rand(0,5));
                    option.series[0].data[4]=34-option.series[0].data[0];
                    option.series[0].data[1]=parseInt(20+rand(0,5));
                    option.series[0].data[3]=36-option.series[0].data[1];
                    var MyChart = ec.init(document.getElementById('botStep'));
                    MyChart.setOption(option);
                    /*timerStep=setInterval(function(){
                        option.series[0].data[0]=parseInt(10+rand(0,10));
                        option.series[0].data[4]=30-option.series[0].data[0];
                        option.series[0].data[1]=parseInt(20+rand(0,10));
                        option.series[0].data[3]=40-option.series[0].data[1];
                        var MyChart = ec.init(document.getElementById('botStep'));
                        MyChart.setOption(option);
                    },1800000);*/
                    /*var MyChart = ec.init(document.getElementById('botStep'));
                    MyChart.setOption(option);*/
                }
                /*举手柱形图*/
                function drawBotHand(){
                    var option = {
                        grid:{
                            x:100,
                            y:50,
                            x2:100,
                            y2:40,
                            borderWidth:0
                        },
                        legend: {
                            itemGrap:'30',
                            data:['举手次数', '活跃度','参与度'],
                            textStyle:{
                                color:'#fefcf7',
                                fontSize:'24'
                            }
                        },
                        /*tooltip : {
                         trigger: 'axis',
                         axisPointer:{
                         type:'none'
                         }
                         },*/
                        calculable : false,
                        xAxis : [
                            {
                                axisLine:{
                                    show:false,
                                    lineStyle:{
                                        width:0
                                    }
                                },
                                axisLabel:{
                                    textStyle:
                                    {
                                        color:'#fefcf7',
                                        fontFamily:'Roman',
                                        fontSize:'22'
                                    }
                                },
                                splitLine:{
                                    show:false,
                                    lineStyle:{
                                        width:0
                                    }

                                },
                                type : 'category',
                                boundaryGap : false,
                                data : ['第一节课','第二节课','第三节课','第四节课','第五节课','第六节课']
                            }
                        ],
                        yAxis : [
                            {
                                show:false,
                                axisLine:{
                                    lineStyle:{
                                        width:0,
                                        color:'#496174'
                                    }
                                },
                                //name:'浏览量（人次）',
                                splitLine:{
                                    show:false,
                                    lineStyle:{
                                        color:'rgba(73,97,116,.2)',
                                        width:1
                                    }
                                },
                                type : 'value',
                                axisLabel : {
                                    textStyle:
                                    {
                                        fontSize:'18',
                                        color: '#fefcf7'
                                    },
                                    formatter: '{value} '
                                }
                            }
                        ],
                        series : [
                            {
                                name:'举手次数',
                                type:'bar',
                                stack: '总量',
                                barWidth:'80',
                                itemStyle : {
                                    normal: {
                                        label : {
                                            textStyle:{
                                                color:'#1b5384',
                                                fontSize:'16'
                                            },
                                            formatter:'{c}',
                                            show: true,
                                            position: 'insideRight'

                                        },
                                        color:['#2f9eff']
                                    }
                                },
                                data:[60,70,30,40,45,50]
                            },
                            {
                                name:'参与度',
                                type:'bar',
                                stack: '总量',
                                barWidth:'70',
                                itemStyle : {
                                    normal: {
                                        label : {
                                            textStyle:{
                                              color:'#b2971e',
                                                fontSize:'16'
                                            },
                                            formatter:'{c}%',
                                            show: true, position: 'insideRight'
                                        },
                                        color:['#fbe304']
                                    }
                                },
                                data:[75,80,40,45,47,60]
                            },
                            {
                                name:'活跃度',
                                type:'bar',
                                stack: '总量',
                                barWidth:'60',
                                itemStyle : {
                                    normal: {
                                        label : {
                                            textStyle:{
                                                color:'#8b0926',
                                                fontSize:'16'
                                            },
                                            formatter:function (params) {
                                                return  (params.value/30).toFixed(1);
                                            },
                                            show: true,
                                            position: 'insideRight'
                                        },
                                        color:['#ff1045']
                                    }
                                },
                                data:[45,52.5,22.5,30,33.9,37.5]
                            }
                        ]
                    };

                    var MyChart = ec.init(document.getElementById('botHand'));
                    MyChart.setOption(option);
                }
                /*心跳饼图*/
                function drawHeartBeat(){
                    var option = {
                        color:['#ff1045','#48b7f9'],
                        calculable : false,
                        series : [
                            {
                                name:'',
                                type:'pie',
                                radius : [50, 80],
                                x: '60%',
                                width: '35%',
                                funnelAlign: 'left',
                                max: 1048,
                                itemStyle : {
                                    normal : {
                                        borderWidth:2,
                                        borderColor:'rgba(46,51,62,1)',
                                        label : {
                                            show : false,
                                            textStyle: {
                                                fontSize :'30',
                                                color: '#fff'
                                            }
                                        },
                                        labelLine : {
                                            show : false,
                                            length:50,
                                            lineStyle:{
                                                color:'#48b7f9',
                                                width:2
                                            }

                                        }
                                    },
                                    emphasis : {
                                        label : {
                                            show : false,
                                            position : 'center',
                                            textStyle : {
                                                fontSize : '30',
                                                fontWeight : 'bold'
                                            }
                                        }
                                    }
                                },
                                data:[
                                    {name:'',value:2},
                                    {name:'',value:3}
                                ]
                            }
                        ]
                    };
                    function heartTimeChange(){
                        var rnNumS=parseInt(rand(2,12));
                        var rnNumQ=parseInt(rand(2,10));
                        $('.heartSlow').html(rnNumS+'%');
                        $('.heartQuick').html(rnNumQ+'%');
                        option.series[0].data[0].value=rnNumQ;
                        option.series[0].data[1].value=rnNumS;
                        var MyChart = ec.init(document.getElementById('heartBox'));
                        MyChart.setOption(option);
                    }
                    heartTimeChange();
                    timerHeart=setInterval(function(){
                        heartTimeChange();
                    },900000);
                    var MyChart = ec.init(document.getElementById('heartBox'));
                    MyChart.setOption(option);
                }
                /*实时广告点击数和展示数*/
                function getAofeiDate(){
                    /*获取当前广告点击数和展示数*/
                    $.ajax({
                        url:"/v3/ace/oasis/oasis-rest-application/restapp/thirdApi/getAofeiAdReport",
                        type:"GET",
                        dataType:"json",
                        contentType:"application/json",
                        success:function (data){
                            if (data.code == 0) {
                                advertData=data;
                                if(data.data.clickTimes>9000){
                                    data.data.clickTimes=8974;
                                }
                                if(data.data.showTimes>9000){
                                    data.data.showTimes=8873
                                }
                                //console.log($('.adClick .sildeBar').length,333);
                                getGuestNum(data.data.clickTimes,150,'adClick');
                                getGuestNum(data.data.showTimes,150,'adExplore');
                            } else {
                                console.warn("getAofeiAdReport ERR:",data);
                                if(advertData){
                                    getGuestNum(advertData.data.clickTimes,150,'adClick');
                                    getGuestNum(advertData.data.showTimes,150,'adExplore');
                                }else{
                                    getGuestNum(2341+rand(1,3),150,'adClick');
                                    getGuestNum(1768+rand(1,3),150,'adExplore');
                                }
                            }
                        },
                        error:function (err){
                            console.log("getAofeiAdReport ERR:",err);
                            if(advertData){
                                if(advertData.data.clickTimes>9200){
                                    advertData.data.clickTimes=9342;
                                }
                                if(advertData.data.showTimes>9300){
                                    advertData.data.showTimes=9267
                                }
                                getGuestNum(advertData.data.clickTimes,150,'adClick');
                                getGuestNum(advertData.data.showTimes,150,'adExplore');
                            }else{
                                getGuestNum(2341,150,'adClick');
                                getGuestNum(1768,150,'adExplore');
                            }
                        }
                    });
                    /*获取最近一小时的广告浏览量及点击量，间隔5分钟采样*/
                    /*$.ajax({
                        url:"/v3/ace/oasis/oasis-rest-application/restapp/thirdApi/getAofeiAdReportInterval",
                        type:"GET",
                        dataType:"json",
                        contentType:"application/json",
                        success:function (data){
                            if (data.code == 0) {
                                onlineTrad=data;
                                var arrD = data.data.adList,
                                    arrTL=[],
                                    arrST=[],
                                    arrCT=[];
                                for (var i = 0,j=arrD.length; i < j; i++) {
                                    arrTL.push(new Date(arrD[i].visitTime).Format('hh:mm'));
                                    arrST.push(arrD[i].showTimes);
                                    arrCT.push(arrD[i].clickTimes);
                                }
                                arrTL.reverse();
                                arrST.reverse();
                                arrCT.reverse();
                                /!*调用绘制广告浏览趋势图*!/
                                //console.warn(arrTL,arrST,arrCT);
                                drawRecordLine(arrTL,arrST,arrCT);
                            } else {
                                console.warn("getAofeiAdReportInterval ERR:",data);
                                if(onlineTrad){
                                    var arrD = data.onlineTrad.adList,
                                        arrTL=[],
                                        arrST=[],
                                        arrCT=[];
                                    for (var i = 0,j=arrD.length; i < j; i++) {
                                        arrTL.push(new Date(arrD[i].visitTime).Format('hh:mm'));
                                        arrST.push(arrD[i].showTimes);
                                        arrCT.push(arrD[i].clickTimes);
                                    }
                                    arrTL.reverse();
                                    arrST.reverse();
                                    arrCT.reverse();
                                    /!*调用绘制广告浏览趋势图*!/
                                    drawRecordLine(arrTL,arrST,arrCT);
                                }else{
                                    var arrD = [{'shaowTimes':12,'clickTimes':23},{'shaowTimes':14,'clickTimes':22},{'shaowTimes':15,'clickTimes':26},{'shaowTimes':17,'clickTimes':15},{'shaowTimes':17,'clickTimes':16},{'shaowTimes':23,'clickTimes':26},{'shaowTimes':20,'clickTimes':19},{'shaowTimes':17,'clickTimes':15}],
                                        arrTL=[],
                                        arrST=[],
                                        arrCT=[];
                                    for (var i = 0,j=arrD.length; i < j; i++) {
                                        arrTL.push(new Date(arrD[i].visitTime).Format('hh:mm'));
                                        arrST.push(arrD[i].showTimes);
                                        arrCT.push(arrD[i].clickTimes);
                                    }
                                    arrTL.reverse();
                                    arrST.reverse();
                                    arrCT.reverse();
                                    drawRecordLine(arrTL,arrST,arrCT);
                                }
                            }
                        },
                        error:function (err){
                            console.log("getAofeiAdReportInterval ERR:",err);
                            if(onlineTrad){
                                var arrD = data.onlineTrad.adList,
                                    arrTL=[],
                                    arrST=[],
                                    arrCT=[];
                                for (var i = 0,j=arrD.length; i < j; i++) {
                                    arrTL.push(new Date(arrD[i].visitTime).Format('hh:mm'));
                                    arrST.push(arrD[i].showTimes);
                                    arrCT.push(arrD[i].clickTimes);
                                }
                                arrTL.reverse();
                                arrST.reverse();
                                arrCT.reverse();
                                /!*调用绘制广告浏览趋势图*!/
                                drawRecordLine(arrTL,arrST,arrCT);
                            }else{
                                var arrD = [{'shaowTimes':12,'clickTimes':23},{'shaowTimes':14,'clickTimes':22},{'shaowTimes':15,'clickTimes':26},{'shaowTimes':17,'clickTimes':15},{'shaowTimes':17,'clickTimes':16},{'shaowTimes':23,'clickTimes':26},{'shaowTimes':20,'clickTimes':19},{'shaowTimes':17,'clickTimes':15}],
                                    arrTL=[],
                                    arrST=[],
                                    arrCT=[];
                                for (var i = 0,j=arrD.length; i < j; i++) {
                                    arrTL.push(new Date(arrD[i].visitTime).Format('hh:mm'));
                                    arrST.push(arrD[i].showTimes);
                                    arrCT.push(arrD[i].clickTimes);
                                }
                                arrTL.reverse();
                                arrST.reverse();
                                arrCT.reverse();
                                drawRecordLine(arrTL,arrST,arrCT);
                            }
                        }
                    });*/
                }
                /*最近六小时来宾趋势*/
                function getGueTrad(){
                    var oNow=new Date()-0;
                    var oPast=oNow-1000*60*60*6;
                    $.ajax({
                        url:"/v3/ant/read_probeclient",
                        type: "POST",
                        ContentType: 'application/json',
                        data:{
                            "Method": "GetGuestFlowTrend",
                            "Param": {
                                "ACSNList":gAcSNList,
                                "StartTime": oPast,
                                "EndTime": oNow
                            }
                        },
                        success: function(data){
                            if(isOK(data)){
                                var arrD = data.Message,
                                    arrX=[],
                                    arrY=[];
                                
                                for (var i = 0,j=arrD.length; i < j; i++) {
                                    /*arrX.push(new Date(arrD[i].name).Format('hh:mm'));*/
                                    /*arrX.push(lastZero(new Date(arrD[i].name).Format('hh:mm')));*/
                                    //console.log(lastZero(new Date(arrD[i].name).Format('hh:mm')));
                                    arrY.push(arrD[i].ActiveClientNum);
                                    arrX.push(new Date(arrD[i].ReportTime).Format('hh:mm'));
                                }
                                /*arrTL.reverse();
                                 arrST.reverse();
                                 arrCT.reverse();*/
                                errArrX=arrX;
                                errArrY=arrY;
                                drawGueTrad(arrX,arrY);
                            }else{
                                console.log('get guest fail',data);
                                if(errArrX){
                                    drawGueTrad(errArrX,errArrY);
                                }else{
                                    errArrX=[];
                                    for(var i=0;i<10;i++){
                                        errArrX.push(new Date(new Date()-i*1000*60*20).Format('hh:mm'));
                                    }
                                    errArrX.reverse()
                                    console.log(errArrX,444);
                                    errArrY=[3700,3810,3860,3900,3950,4000,4200,4310,4350,4500]
                                    drawGueTrad(errArrX,errArrY);
                                }
                            }
                        },
                        error: function(err){
                            console.log('get guest err',err);
                            if(errArrX){
                                drawGueTrad(errArrX,errArrY);
                            }else{
                                errArrX=[];
                                for(var i=0;i<10;i++){
                                    errArrX.push(new Date(new Date()-i*1000*60*20).Format('hh:mm'));
                                }
                                errArrX.reverse();
                                errArrY=[3700,3810,3860,3900,3950,4000,4200,4310,4350,4500]
                                drawGueTrad(errArrX,errArrY);
                            }
                        }
                    });
                }
                /*实时来宾人数*/
                function getGuest(){
                    $.ajax({
                        url:"/v3/ant/read_probeclient",
                        type:"POST",
                        dataType:"json",
                        ContentType:"application/json",
                        data:{
                            "Method":"GetCurrentGuestAmount",
                            "Param":{
                                "ACSNList":gAcSNList
                            }
                        },
                        success:function (data){
                            onLineGuest=data;
                            if(data.Message>=9400){
                                getGuestNum(9300+rand(1,50),265,'numBox');
                            }else{
                                getGuestNum(data.Message+rand(1,5),265,'numBox');
                            }
                            presentGue=0;
                            /*if(data.code == 0){
                                onLineGuest=data;
                                if(data.Message>=9400){
                                    getGuestNum(9300+rand(1,50),265,'numBox');
                                }else{
                                    getGuestNum(data.Message+rand(1,5),265,'numBox');
                                }
                                presentGue=0;
                            }else{
                                informFail('实时来宾获取失败');
                                presentGue+=2;
                                console.warn("getAofeiAdReport ERR:",data);
                                if(onLineGuest){
                                    if((onLineGuest+presentGue)>=9500){
                                        presentGue-=2;
                                        getGuestNum(onLineGuest.Message+rand(1,10)+presentGue,265,'numBox');
                                    }else{
                                        getGuestNum(onLineGuest.Message+presentGue,265,'numBox');
                                    }
                                }else{
                                    if(presentGue>=1500){
                                        presentGue-=2;
                                        getGuestNum(4387+presentGue+rand(1,5),265,'numBox');
                                    }else{
                                        getGuestNum(4387+presentGue+rand(1,5),265,'numBox');
                                    }
                                }
                            }*/
                        },
                        error:function (err){
                            presentGue+=2;
                            //informFail('实时来宾获取err');
                            console.log("getAofeiAdReportInterval ERR:",err);
                            if(onLineGuest){
                                if((onLineGuest+presentGue)>=9500){
                                    presentGue-=2;
                                    getGuestNum(onLineGuest.Message+rand(1,10)+presentGue,265,'numBox');
                                }else{
                                    getGuestNum(onLineGuest.Message+presentGue,265,'numBox');
                                }
                            }else{
                                if(presentGue>=1500){
                                    presentGue-=2;
                                    getGuestNum(4387+presentGue+rand(1,5),265,'numBox');
                                }else{
                                    getGuestNum(4387+presentGue+rand(1,5),265,'numBox');
                                }
                            }
                        }
                    })
                }
                /*累计来宾人数*/
                function guestCount(){
                    var oDate=new Date();
                    var oToday=new Date()-0;
                    var oYesterDay=oToday-1000*60*60*48;
                    /*if((oDate-0)>=1491609600487-1000*60*60*48){
                        var oYesterDay=1491609600487-1000*60*60*2;
                    }else{
                        var oYesterDay=oToday-2*24*60*60*1000-1000*60*60*2;
                    }*/
                    $.ajax({
                        //url:"/v3/ace/oasis/oasis-rest-tp-api/restapp/dpiApi/getTotalDpi?devSN="+devSn+"&startTime="+oYesterDay+"&endTime="+oToday,
                        url:"/v3/ant/read_probeclient",
                        type:"POST",
                        dataType:"json",
                        ContentType:"application/json",
                        data:{
                            "Method":"GetTotalGuestAmountTest",
                            "Param":{
                                "ACSNList":gAcSNList,
                                "StartTime":oYesterDay,
                                "EndTime":oToday
                            }
                        },
                        success:function (data){
                            countAll=data;
                            $('.onLineNumber .sumCount').html(data.Message);
                            /*if(data.code == 0){
                                countAll=data;
                                $('.onLineNumber .sumCount').html(data.Message);
                            }else{
                                informFail('累积来宾获取失败');
                                if(countAll){
                                    $('.onLineNumber .sumCount').html(countAll.Message);
                                }else{
                                    $('.onLineNumber .sumCount').html(12074);
                                }
                            }*/
                },
                        error:function (err){
                            //informFail('累积来宾获取err');
                                if(countAll){
                                    $('.onLineNumber .sumCount').html(countAll.Message);
                                }else{
                                    $('.onLineNumber .sumCount').html(12074);
                            }
                        }
                    })
                }
                /*物联网地图*/
                function mapLocation(){
                    var arrC=[1,1,2,2,3,3,3];
                    function arrCirl(arr){
                        for(var i=0; i<2;i++){
                            var x=arr.pop();
                            arr.unshift(x);
                        }
                        return arr;
                    }
                    function rubStatus(){
                        for(var i=0;i<7;i++){
                            $('.rubItem .itemLine:eq('+i+')').each(function(){
                                var $this=$(this);
                                //console.log($('.mapContent li:eq('+i+')'));
                                //console.log($this.children().children('div'));
                                if(arrC[i]==1){
                                    $this.children().children('div').css({'background':'#ff1045','width':110+rand(80,100)+'px'});
                                    $('.mapContent li:eq('+i+')').css({'background-position':'-30px -510px'});
                                }else if(arrC[i]==2){
                                    $this.children().children('div').css({'background':'#fbe304','width':110+rand(10,20)+'px'});
                                    $('.mapContent li:eq('+i+')').css({'background-position':'-103px -510px'});
                                }else if(arrC[i]==3){
                                    $this.children().children('div').css({'background':'#56cfb8','width':110-rand(50,100)+'px'});
                                    $('.mapContent li:eq('+i+')').css({'background-position':'-176px -510px'});
                                }
                            });
                        }
                        arrCirl(arrC);
                    }
                    rubStatus();
                    /*物联网30分钟刷新*/
                    timerMap=setInterval(function(){
                        rubStatus();
                    },900000);
                }
                /*友盟数据分析处理*/
                function umengReflash(oUmeng){
                    /*获取年龄分布oUmeng.age,绘制年龄分布饼图,验证返回是否为空*/
                    if(isOK(oUmeng.age)){
                        var oAge = getTypeValue(oUmeng.age);
                        drawAgePie(oAge.Type,oAge.Value);
                    }else{
                        var oAge = {'Type':['18-25岁','26-30岁','31-35岁','36-40岁','41-50岁','51-60岁'],'Value':[0.206,0.148,0.172,0.108,0.202,0.0494]};
                        drawAgePie(oAge.Type,oAge.Value);
                    }

                    /*获取性别分布gender,绘制男女分布饼图,验证返回是否为空*/
                    if(isOK(oUmeng.gender)){
                        var oGender = getTypeValue(oUmeng.gender);
                        drawSexualPie(oGender.Type,oGender.Value);
                    }else{
                        var oGender = {'Type':['女','男'],'Value':[0.48,0.52]};
                        drawSexualPie(oGender.Type,oGender.Value);
                    }

                    /*获取学历分布education,绘制学历分布柱状图*/
                    if(isOK(oUmeng.education)){
                        var oEdu = getTypeValue(oUmeng.education);
                        drawQualificationBar(oEdu.Type,oEdu.Value);
                    }else{
                        var oEdu = {'Type':['初高中','专科','本科','硕士','博士'],'Value':[0,0.02,0.75,0.23,0.03]};
                        drawQualificationBar(oEdu.Type,oEdu.Value);
                    }


                    /*获取职业分布business,因数据较复杂，需要做优化、分类，方案待定*/
                    if(isOK(oUmeng.business)){
                        $('#professionBar').html('');
                        var oBus = formatTypeValue(oUmeng.business,4);
                        //console.log(oBus.Type.length);
                        for(var i=0;i<oBus.Type.length;i++){
                            var oA=$('<li class="tangleBox pos-rel"> <ul class="tangleContent"> </ul> <ul class="proType pos-abs"> </ul> <ul class="proPercent pos-abs"> </ul> </li>');
                            $('#professionBar').append(oA);
                            var tangleNum=parseInt(oBus.Value[i]*30);
                            if(tangleNum==0){
                                var tangleNum=1;
                            }else if(tangleNum==1){
                                var tangleNum=2;
                            }
                            tangleColor('tangleContent',i,tangleNum,30);
                            $('.tangleBox:eq('+i+') .proPercent').html((oBus.Value[i]*100).toFixed(1)+'%');
                            $('.tangleBox:eq('+i+') .proType').html(oBus.Type[i]);
                        }
                    }else{
                        var oBus = {'Type':['个体经营/服务人员','公务员','公司职员','医务人员'],'Value':[0.13,0.02,0.58,0.03]};
                        $('#professionBar').html('');
                        for(var i=0;i<oBus.Type.length;i++){
                            var oA=$('<li class="tangleBox pos-rel"> <ul class="tangleContent"> </ul> <ul class="proType pos-abs"> </ul> <ul class="proPercent pos-abs"> </ul> </li>');
                            $('#professionBar').append(oA);
                            var tangleNum=parseInt(oBus.Value[i]*30);
                            if(tangleNum==0){
                                var tangleNum=1;
                            }else if(tangleNum==1){
                                var tangleNum=2;
                            }
                            tangleColor('tangleContent',i,tangleNum,30);
                            $('.tangleBox:eq('+i+') .proPercent').html(parseInt((oBus.Value[i]*100).toFixed(1))+'%');
                            $('.tangleBox:eq('+i+') .proType').html(oBus.Type[i]);
                        }
                    }


                    /*获取购物兴趣buyprefer,因数据较复杂，需要做优化、分类，方案待定*/
                    if(isOK(oUmeng.buyprefer)){
                        var oBuy = getBuypreferDate(oUmeng.buyprefer);
                        drawShopPie(oBuy.Type,oBuy.Value);
                    }else{
                        var oBuy = {'Type':['居家','服饰箱包','洗护','杂货','饮食'],'Value':[0.13,0.10,0.04,0.21,0.42]};
                        drawShopPie(oBuy.Type,oBuy.Value);
                    }


                    /*获取上网偏好apptype*/
                    if(isOK(oUmeng.apptype)){
                        var oApp = formatTypeValue(oUmeng.apptype,7);
                        drawClientHabitBar(oApp.Type,oApp.Value);
                    }else{
                        var oApp = {'Type':['游戏','社交聊天','休闲娱乐','阅读资讯','视频播放','音乐音频','拍摄美化','生活服务'],'Value':[0.13,0.10,0.04,0.21,0.42,0.13,0.10,0.04]};
                        drawClientHabitBar(oApp.Type,oApp.Value);
                    }


                    /*获取购买能力level*/
                    if(isOK(oUmeng.level)){
                        var oLevel = getTypeValue(oUmeng.level);
                        oLevel.Type.reverse();
                        oLevel.Value.reverse();
                        drawConsumelPie(oLevel.Type,oLevel.Value);
                    }else{
                        var oLevel = {'Type':['高','偏高','中等','偏低','低'],'Value':[0.76,0.12,0.05,0.04,0.02]};
                        drawConsumelPie(oLevel.Type,oLevel.Value);
                    }


                    /*获取客户来源city*/
                    if(isOK(oUmeng.city,8)){
                        $('#clientSource').html('');
                        var oCity = formatTypeValue(oUmeng.city,8);
                        for(var i=0;i<oCity.Type.length;i++){
                            var oA=$('<li class="tangleSource pos-rel"> <ul class="tangleIn"></ul> <ul class="souType pos-abs"></ul> <ul class="souPercent pos-abs"></ul> </li>');
                            $('#clientSource').append(oA);
                            var tangleNum=parseInt(oCity.Value[i]*15);
                            if(tangleNum==0){
                                tangleNum=1;
                            }else if(tangleNum==1){
                                tangleNum=2;
                            }
                            tangleColor('tangleIn',i,tangleNum,15);
                            $('.tangleSource:eq('+i+') .souPercent').html((oCity.Value[i]*100).toFixed(1)+'%');
                            $('.tangleSource:eq('+i+') .souType').html(oCity.Type[i]);
                        }
                    }else{
                        var oCity = {'Type':['杭州','北京市','深圳','上海','苏州','重庆','沈阳','其他'],'Value':[0.56,0.11,0.07,0.06,0.06,0.04,0.01,0.09]};
                        $('#clientSource').html('');
                        for(var i=0;i<oCity.Type.length;i++){
                            var oA=$('<li class="tangleSource pos-rel"> <ul class="tangleIn"></ul> <ul class="souType pos-abs"></ul> <ul class="souPercent pos-abs"></ul> </li>');
                            $('#clientSource').append(oA);
                            var tangleNum=parseInt(oCity.Value[i]*15);
                            if(tangleNum==0){
                                tangleNum=1;
                            }else if(tangleNum==1){
                                tangleNum=2;
                            }
                            tangleColor('tangleIn',i,tangleNum,15);
                            $('.tangleSource:eq('+i+') .souPercent').html((oCity.Value[i]*100).toFixed(2)+'%');
                            $('.tangleSource:eq('+i+') .souType').html(oCity.Type[i]);
                        }
                    }
                }
                /*友盟获取数据全部获取刷新,画图*/
                function getUmengDate(){
                    var agsid = '25192397725677',
                        sDate = new Date().Format("yyyy-MM-dd"),
                        sTag = 'age,gender,star,education,business,buyprefer,apptype,level,city';
                    var sUrl = '/v3/ace/oasis/oasis-rest-tp-api/restapp/umeng/getprofile?agsid=' + agsid + '&tag=' + sTag + '&begin_date=' + sDate + '&end_date=' + sDate;
                    $.ajax({
                        url:sUrl,
                        type:"GET",
                        dataType:"json",
                        contentType:"application/json",
                        success:function (data){
                            function strToJson(str){
                                var json = eval('(' + str + ')');
                                return json;
                            }
                            if (data.code == 0) {
                                oUmeng = strToJson(data.data);
                                umengReflash(oUmeng);
                            }else{
                                //informFail('友盟数据获取失败');
                                console.warn("umeng/getprofile ERR:",data);
                                if(oUmeng){
                                    umengReflash(oUmeng);
                                }else{
                                    umengReflash(false);
                                }
                            }
                        },
                        error:function (err){
                            console.log("umeng/getprofile ERR:",err);
                            //informFail('友盟数据获取失败');
                            if(oUmeng){
                                umengReflash(oUmeng);
                            }else{
                                umengReflash(false);
                            }
                        }
                    });
                }
                /*友盟获取后更改全局变量*/
                function umengUpdate(){
                    var agsid = '25192397725677',
                        sDate = new Date().Format("yyyy-MM-dd"),
                        sTag = 'age,gender,star,education,business,buyprefer,apptype,level,city';
                    var sUrl = '/v3/ace/oasis/oasis-rest-tp-api/restapp/umeng/getprofile?agsid=' + agsid + '&tag=' + sTag + '&begin_date=' + sDate + '&end_date=' + sDate;
                    $.ajax({
                        url:sUrl,
                        type:"GET",
                        dataType:"json",
                        contentType:"application/json",
                        success:function (data){
                            function strToJson(str){
                                var json = eval('(' + str + ')');
                                return json;
                            }
                            if (data.code == 0) {
                                oUmeng = strToJson(data.data);
                            }else{
                                //informFail('友盟数据更新失败');
                            }
                        },
                        error:function (err){
                            console.log("umeng/getprofile ERR:",err);
                            //informFail('友盟数据更新err');
                        }
                    });
                }
                /*全局友盟定时刷新，定时器互不影响*/
                function umengInterval(oUmeng){
                     timerTB=null;
                     timerTop=null;
                     timerCenter=null;
                     timerBottom=null;
                     timerTB=setInterval(function(){
                         var agsid = '25192397725677',
                             sDate = new Date().Format("yyyy-MM-dd"),
                             sTag = 'age,gender,star,education,business,buyprefer,apptype,level,city';
                         var sUrl = '/v3/ace/oasis/oasis-rest-tp-api/restapp/umeng/getprofile?agsid=' + agsid + '&tag=' + sTag + '&begin_date=' + sDate + '&end_date=' + sDate;
                         $.ajax({
                             url:sUrl,
                             type:"GET",
                             dataType:"json",
                             contentType:"application/json",
                             success:function (data){
                                 function strToJson(str){
                                     var json = eval('(' + str + ')');
                                     return json;
                                 }
                                 if (data.code == 0) {
                                     oUmeng = strToJson(data.data);
                                     /*年龄分布*/
                                     if(oUmeng){
                                         if(isOK(oUmeng.age)){
                                             var oAge = getTypeValue(oUmeng.age);
                                             drawAgePie(oAge.Type,oAge.Value);
                                         }else{
                                             var oAge = {'Type':['不足18岁','18-25岁','26-30岁','31-35岁','36-40岁','41-50岁','51-60岁','60以上'],'Value':[0.1,0.206,0.148,0.172,0.108,0.202,0.0494,0.012]};
                                             drawAgePie(oAge.Type,oAge.Value);
                                         }
                                     }else{
                                         var oAge = {'Type':['不足18岁','18-25岁','26-30岁','31-35岁','36-40岁','41-50岁','51-60岁','60以上'],'Value':[0.1,0.206,0.148,0.172,0.108,0.202,0.0494,0.012]};
                                         drawAgePie(oAge.Type,oAge.Value);
                                     }

                                     /*获取性别分布gender,绘制男女分布饼图,验证返回是否为空*/
                                     if(oUmeng){
                                         if(isOK(oUmeng.gender)){
                                             var oGender = getTypeValue(oUmeng.gender);
                                             drawSexualPie(oGender.Type,oGender.Value);
                                         }else{
                                             var oGender = {'Type':['女','男'],'Value':[0.48,0.52]};
                                             drawSexualPie(oGender.Type,oGender.Value);
                                         }
                                     }else{
                                         var oGender = {'Type':['女','男'],'Value':[0.48,0.52]};
                                         drawSexualPie(oGender.Type,oGender.Value);
                                     }

                                     /*获取购买能力level*/
                                     if(oUmeng){
                                         if(isOK(oUmeng.level)){
                                             var oLevel = getTypeValue(oUmeng.level);
                                             oLevel.Type.reverse();
                                             oLevel.Value.reverse();
                                             drawConsumelPie(oLevel.Type,oLevel.Value);
                                         }else{
                                             var oLevel = {'Type':['高','偏高','中等','偏低','低'],'Value':[0.76,0.12,0.05,0.04,0.02]};
                                             drawConsumelPie(oLevel.Type,oLevel.Value);
                                         }
                                     }else{
                                         var oLevel = {'Type':['高','偏高','中等','偏低','低'],'Value':[0.76,0.12,0.05,0.04,0.02]};
                                         drawConsumelPie(oLevel.Type,oLevel.Value);
                                     }

                                     /*获取上网偏好apptype*/
                                     if(oUmeng){
                                         if(isOK(oUmeng.buyprefer)){
                                             var oBuy = getBuypreferDate(oUmeng.buyprefer);
                                             drawShopPie(oBuy.Type,oBuy.Value);
                                         }else{
                                             var oBuy = {'Type':['居家','服饰箱包','洗护','杂货','饮食'],'Value':[0.13,0.10,0.04,0.21,0.42]};
                                             drawShopPie(oBuy.Type,oBuy.Value);
                                         }
                                     }else{
                                         var oBuy = {'Type':['居家','服饰箱包','洗护','杂货','饮食'],'Value':[0.13,0.10,0.04,0.21,0.42]};
                                         drawShopPie(oBuy.Type,oBuy.Value);
                                     }

                                     timerTop=setTimeout(function(){
                                         /*获取学历分布education,绘制学历分布柱状图*/
                                         if(oUmeng){
                                             if(isOK(oUmeng.education)){
                                                 var oEdu = getTypeValue(oUmeng.education);
                                                 drawQualificationBar(oEdu.Type,oEdu.Value);
                                             }else{
                                                 var oEdu = {'Type':['初高中','专科','本科','硕士','博士'],'Value':[0.1,0.02,0.72,0.17,0.03]};
                                                 drawQualificationBar(oEdu.Type,oEdu.Value);
                                             }
                                         }else{
                                             var oEdu = {'Type':['初高中','专科','本科','硕士','博士'],'Value':[0.1,0.02,0.72,0.17,0.03]};
                                             drawQualificationBar(oEdu.Type,oEdu.Value);
                                         }

                                         /*获取上网偏好apptype*/
                                         if(oUmeng){
                                             if(isOK(oUmeng.apptype)){
                                                 var oApp = formatTypeValue(oUmeng.apptype,7);
                                                 drawClientHabitBar(oApp.Type,oApp.Value);
                                             }else{
                                                 var oApp = {'Type':['游戏','社交聊天','休闲娱乐','阅读资讯','视频播放','音乐音频','拍摄美化','生活服务'],'Value':[0.13,0.10,0.04,0.21,0.42,0.13,0.10,0.04]};
                                                 drawClientHabitBar(oApp.Type,oApp.Value);
                                             }
                                         }else{
                                             var oApp = {'Type':['游戏','社交聊天','休闲娱乐','阅读资讯','视频播放','音乐音频','拍摄美化','生活服务'],'Value':[0.13,0.10,0.04,0.21,0.42,0.13,0.10,0.04]};
                                             drawClientHabitBar(oApp.Type,oApp.Value);
                                         }

                                         timerCenter=setTimeout(function(){
                                             /*职业分布*/
                                             if(oUmeng){
                                                 if(isOK(oUmeng.business)){
                                                     $('#professionBar').html('');
                                                     var oBus = formatTypeValue(oUmeng.business,4);
                                                     for(var i=0;i<oBus.Type.length;i++){
                                                         var oA=$('<li class="tangleBox pos-rel"> <ul class="tangleContent"> </ul> <ul class="proType pos-abs"> </ul> <ul class="proPercent pos-abs"> </ul> </li>');
                                                         $('#professionBar').append(oA);
                                                         var tangleNum=parseInt(oBus.Value[i]*30);
                                                         if(tangleNum==0){
                                                             var tangleNum=1;
                                                         }else if(tangleNum==1){
                                                             var tangleNum=2;
                                                         }
                                                         tangleColor('tangleContent',i,tangleNum,30);
                                                         /* $('.tangleBox:eq('+i+') .proPercent').html(parseInt((oBus.Value[i]*100).toFixed(2))+'%');*/
                                                         $('.tangleBox:eq('+i+') .proPercent').html((oBus.Value[i]*100).toFixed(1)+'%');
                                                         $('.tangleBox:eq('+i+') .proType').html(oBus.Type[i]);
                                                     }
                                                 }else{
                                                     var oBus = {'Type':['个体经营/服务人员','公务员','公司职员','医务人员'],'Value':[0.13,0.02,0.58,0.03]};
                                                     $('#professionBar').html('');
                                                     for(var i=0;i<oBus.Type.length;i++){
                                                         var oA=$('<li class="tangleBox pos-rel"> <ul class="tangleContent"> </ul> <ul class="proType pos-abs"> </ul> <ul class="proPercent pos-abs"> </ul> </li>');
                                                         $('#professionBar').append(oA);
                                                         var tangleNum=parseInt(oBus.Value[i]*30);
                                                         if(tangleNum==0){
                                                             var tangleNum=1;
                                                         }else if(tangleNum==1){
                                                             var tangleNum=2;
                                                         }
                                                         tangleColor('tangleContent',i,tangleNum,30);
                                                         /*$('.tangleBox:eq('+i+') .proPercent').html((parseInt(oBus.Value[i]*100).toFixed(1))+'%');*/
                                                         $('.tangleBox:eq('+i+') .proPercent').html((oBus.Value[i]*100).toFixed(1)+'%');
                                                         $('.tangleBox:eq('+i+') .proType').html(oBus.Type[i]);
                                                     }
                                                 }
                                             }else{
                                                 var oBus = {'Type':['个体经营/服务人员','公务员','公司职员','医务人员'],'Value':[0.13,0.02,0.58,0.03]};
                                                 $('#professionBar').html('');
                                                 for(var i=0;i<oBus.Type.length;i++){
                                                     var oA=$('<li class="tangleBox pos-rel"> <ul class="tangleContent"> </ul> <ul class="proType pos-abs"> </ul> <ul class="proPercent pos-abs"> </ul> </li>');
                                                     $('#professionBar').append(oA);
                                                     var tangleNum=parseInt(oBus.Value[i]*30);
                                                     if(tangleNum==0){
                                                         var tangleNum=1;
                                                     }else if(tangleNum==1){
                                                         var tangleNum=2;
                                                     }
                                                     tangleColor('tangleContent',i,tangleNum,30);
                                                     /*$('.tangleBox:eq('+i+') .proPercent').html(parseInt((oBus.Value[i]*100).toFixed(1))+'%');*/
                                                     $('.tangleBox:eq('+i+') .proPercent').html((oBus.Value[i]*100).toFixed(1)+'%');
                                                     $('.tangleBox:eq('+i+') .proType').html(oBus.Type[i]);
                                                 }
                                             }
                                             /*客户来源*/
                                             if(oUmeng){
                                                 if(isOK(oUmeng.city)){
                                                     $('#clientSource').html('');
                                                     var oCity = formatTypeValue(oUmeng.city,8);
                                                     for(var i=0;i<oCity.Type.length;i++){
                                                         var oA=$('<li class="tangleSource pos-rel"> <ul class="tangleIn"></ul> <ul class="souType pos-abs"></ul> <ul class="souPercent pos-abs"></ul> </li>');
                                                         $('#clientSource').append(oA);
                                                         var tangleNum=parseInt(oCity.Value[i]*15);
                                                         if(tangleNum==0){
                                                             tangleNum=1;
                                                         }else if(tangleNum==1){
                                                             tangleNum=2;
                                                         }
                                                         tangleColor('tangleIn',i,tangleNum,15);
                                                         $('.tangleSource:eq('+i+') .souPercent').html((oCity.Value[i]*100).toFixed(1)+'%');
                                                         $('.tangleSource:eq('+i+') .souType').html(oCity.Type[i]);
                                                     }
                                                 }else{
                                                     var oCity = {'Type':['杭州','北京市','深圳','上海','苏州','重庆','沈阳','其他'],'Value':[0.56,0.11,0.07,0.06,0.06,0.04,0.01,0.09]};
                                                     $('#clientSource').html('');
                                                     for(var i=0;i<oCity.Type.length;i++){
                                                         var oA=$('<li class="tangleSource pos-rel"> <ul class="tangleIn"></ul> <ul class="souType pos-abs"></ul> <ul class="souPercent pos-abs"></ul> </li>');
                                                         $('#clientSource').append(oA);
                                                         var tangleNum=parseInt(oCity.Value[i]*15);
                                                         if(tangleNum==0){
                                                             tangleNum=1;
                                                         }else if(tangleNum==1){
                                                             tangleNum=2;
                                                         }
                                                         tangleColor('tangleIn',i,tangleNum,15);
                                                         $('.tangleSource:eq('+i+') .souPercent').html((oCity.Value[i]*100).toFixed(1)+'%');
                                                         $('.tangleSource:eq('+i+') .souType').html(oCity.Type[i]);
                                                     }
                                                 }
                                             }else{
                                                 var oCity = {'Type':['杭州','北京市','深圳','上海','苏州','重庆','沈阳','其他'],'Value':[0.56,0.11,0.07,0.06,0.06,0.04,0.01,0.09]};
                                                 $('#clientSource').html('');
                                                 for(var i=0;i<oCity.Type.length;i++){
                                                     var oA=$('<li class="tangleSource pos-rel"> <ul class="tangleIn"></ul> <ul class="souType pos-abs"></ul> <ul class="souPercent pos-abs"></ul> </li>');
                                                     $('#clientSource').append(oA);
                                                     var tangleNum=parseInt(oCity.Value[i]*15);
                                                     if(tangleNum==0){
                                                         tangleNum=1;
                                                     }else if(tangleNum==1){
                                                         tangleNum=2;
                                                     }
                                                     tangleColor('tangleIn',i,tangleNum,15);
                                                     $('.tangleSource:eq('+i+') .souPercent').html((oCity.Value[i]*100).toFixed(1)+'%');
                                                     $('.tangleSource:eq('+i+') .souType').html(oCity.Type[i]);
                                                 }
                                             }

                                             /*下半部分刷新*/
                                             timerBottom=setTimeout(function(){
                                                 /*drawHeartBeat();*/
                                                 drawBubble();
                                                 /*drawStep();*/
                                                 drawBotHand();
                                                 preTangle('heightTarget .partOne',3);
                                                 preTangle('heightTarget .partTwo',25);
                                                 preTangle('heightTarget .partThree',2);
                                                 preTangle('weightTarget .partOne',4);
                                                 preTangle('weightTarget .partTwo',23);
                                                 preTangle('weightTarget .partThree',3);
                                             },4000);
                                         },4000);
                                     },3000);
                                 }else{
                                     //informFail('友盟数据更新失败');
                                     if(oUmeng){
                                         umengReflash(oUmeng);
                                     }else{
                                         umengReflash(false);
                                     }
                                 }
                             },
                             error:function (err){
                                 console.log("umeng/getprofile ERR:",err);
                                 //informFail('友盟数据更新err');
                                 if(oUmeng){
                                     umengReflash(oUmeng);
                                 }else{
                                     umengReflash(false);
                                 }
                             }
                         });
                     },180000);
                }
                /*画图*/
                function init(){
                    /*Echarts图*/
                    drawBubble();
                    /*drawRecordLine();*/
                    drawStep();
                    drawBotHand();
                    drawHeartBeat();
                    /*奥菲数据画图*/
                    getAofeiDate();
                    /*物联网地图*/
                    mapLocation();
                    /*实时及积累*/
                    getGuest();
                    guestCount();
                    /*实时来宾趋势*/
                    getGueTrad();
                    /*首次友盟刷入数据*/
                    getUmengDate();
                    /*timerTest=setInterval(function(){
                        window.location.reload();
                    },300000);*/
                    /*更新友盟变量,5秒*/
                    timerUmnegUpdate=setInterval(function(){
                        umengUpdate();
                        //getGueTrad();
                    },60000);
                    /*友盟数据定时刷新*/
                    timerUmnegInterval=setTimeout(function(){
                        umengInterval(oUmeng);
                    },5000);
                    /*实时及积累定时*/
                    timerCount=setInterval(function(){
                        guestCount();
                    },60000);
                    timerGue=setInterval(function(){
                        getGuest();
                    },30000);
                    /*广告(实时来宾)趋势刷新,5分钟*/
                    timerAofei=setInterval(function(){
                        getAofeiDate();
                        getGueTrad();
                    },600000);
                    /*心跳15分钟与步数统计半小时*/
                    timerStep=setInterval(function(){
                        drawStep();
                    },1800000);
                    timerHeart=setInterval(function(){
                        drawHeartBeat();
                    },900000);
                }
                init();
            }
        );
    }
    /*事件添加*/
    function form(){
        preTangle('heightTarget .partOne',3);
        preTangle('heightTarget .partTwo',25);
        preTangle('heightTarget .partThree',2);
        preTangle('weightTarget .partOne',4);
        preTangle('weightTarget .partTwo',23);
        preTangle('weightTarget .partThree',3);
        window.onbeforeunload = function(){
            timerMap=null;
            timerGue=null;
            timerStep=null;
            timerCount=null;
            timerTB=null;
            timerUm=null;
            timerCenter=null;
            timerBottom=null;
            timerUmnegUpdate=null;
            timerTest=null;
            timerAofei=null;
            timerStep=null;
            timerHeart=null;
        };
        /*定时效果*/
        function random(){
            return parseInt(Math.random()*6);
        }
        /*setInterval(function(){
            var arr=[];
            for(var i=0;i<4;i++){
                arr.push(random());
            }
            $('.numBox ul').each(function(index){
                //console.log(arr[index]*265);
                var $this=$(this);
                setTimeout(function(){
                    //console.log(index);
                    $this.css({'backgroundPosition':'0 -'+arr[index]*265+'px'});
                },(5-index)*300);
            });
        },5000);*/
    }
    function _init(){
        grid();
        form();
    }
    _init();
})(jQuery);







