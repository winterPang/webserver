define(["utils", "moment", "echarts", "bootstrap-daterangepicker", "css!bootstrap_daterangepicker_css"], function (Utils, moment, echarts) {
	return ["$scope", "$http", "$alertService", "$interval", "$state", function ($scope, $http, $alert, $interval, $state) {
		
	var g_result        = { Device:{}, Attack:{},Statistics:{}};
    var g_stationClassify = ["","授权AP","配置错误AP","非法AP","外部AP","ad hoc网络",
        "mesh网络","潜在授权AP","潜在非法AP","潜在外部AP","无法确认的AP","授权客户端",
        "未授权客户端","误关联客户端","未分类客户端"];
    var g_allAttack         = [[   "",                                          /*0*/
        "AP仿冒攻击",                                /*1*/
        "",                                          /*2*/
        "",                                          /*3*/
        "Client仿冒攻击",                            /*4*/
        "" ,                                         /*5*/
        "Weak IV攻击",                               /*6*/
        "Windows网桥攻击",                           /*7*/
        "客户端开启了禁用802.11n 40MHz模式攻击",     /*8*/
        "软AP攻击",                                  /*9*/
        "客户端节电攻击",                            /*10*/
        "Omerta攻击",                                /*11*/
        "解关联攻击",                                /*12*/
        "解认证攻击",                                /*13*/
        "非法信道攻击",                              /*14*/
        "AP扮演者攻击",                              /*15*/
        "未加密授权AP攻击",                          /*16*/
        "未加密的信任客户端",                        /*17*/
        "热点攻击",                                  /*18*/
        "绿野模式攻击",                              /*19*/
        "关联/重关联DoS攻击",                        /*20*/
        "蜜罐AP攻击",                                /*21*/
        "中间人攻击",                                /*22*/
        "无线网桥攻击",                              /*23*/
        "AP泛洪攻击",                                /*24*/
        "AP信道变化攻击",                            /*25*/
        ""                                           /*26*/
    ],
        [   "Association-request帧",         /*0*/
            "Authentication帧",              /*1*/
            "Beacon帧",                      /*2*/
            "Block ACK帧",                   /*3*/
            "CTS帧",                         /*4*/
            "Deauthentication帧" ,           /*5*/
            "Disassociation帧",              /*6*/
            "EAPOL-Start帧",                 /*7*/
            "Null-data帧",                   /*8*/
            "Probe-request帧",               /*9*/
            "Reassociation-request帧",       /*10*/
            "RTS帧",                         /*11*/
            "EAPOL-Logoff帧",                /*12*/
            "EAP Fail帧",                    /*13*/
            "EAP Success帧",                 /*14*/
        ],
        [   "IE重复的畸形报文",                                       /*0*/
            "Fata-Jack畸形报文",                                      /*1*/
            "IBSS和ESS置位异常的畸形报文",                            /*2*/
            "源地址为广播或者组播的认证和关联畸形报文",               /*3*/
            "畸形Association-request报文",                            /*4*/
            "畸形Authentication报文" ,                                /*5*/
            "含有无效原因值的解除认证畸形报文",                       /*6*/
            "含有无效原因值的解除关联畸形报文",                       /*7*/
            "畸形HT IE报文",                                          /*8*/
            "IE长度非法的畸形报文",                                   /*9*/
            "报文长度非法的畸形报文",                                 /*10*/
            "Duration字段超大的畸形报文",                             /*11*/
            "无效探查响应报文",                                       /*12*/
            "key长度超长的EAPOL报文",                                 /*13*/
            "SSID长度超长的畸形报文",                                 /*14*/
            "多余IE畸形报文"                                          /*15*/
        ]
    ];
	
	function successDevice(name, message)
    {
        var sum = 0;
        var msg = [];

        g_result.Statistics.RougeAP = 0;
        g_result.Statistics.UnauthorizedClient = 0;
        for(var i = 0; i < message.length; i++)
        {
            var temp = {};

            if(message[i].ClassifyType == 3)
            {
                g_result.Statistics.RougeAP = Number(message[i].Sum);
            }
            if(message[i].ClassifyType == 15)
            {
                g_result.Statistics.UnauthorizedClient = Number(message[i].Sum)
            }
            temp.name = g_stationClassify[message[i].ClassifyType] || "unknow";
            temp.value = message[i].Sum;
            msg.push(temp);
            sum += Number(message[i].Sum);
        }

        g_result[name].info = msg;
        g_result.Statistics[name] = sum;
        if(g_result.Device.info)
        {
            drawDevice();
        }
    }
	 function drawDevice()
    {
        if(g_result.Device.info)
        {
            var aAllTitleLan =[];
            var nWidth = $("#attackinfo_bar").parent().width()*0.95;
            if(g_result.Device.info.length)
            {
                var nEnd;
                for(var j = 0 ; j < g_result.Device.info.length; j++)
                {
                    aAllTitleLan.push(g_result.Device.info[j].name);
                }
                nEnd = 100*5/(aAllTitleLan.length || 1);

                for(var m = 0; m < 5 - aAllTitleLan.length; m++)
                {
                    aAllTitleLan.unshift("");
                    g_result.Device.info.unshift({name:"",value:""});
                }
                var option = {
                    color: ["#FBCEB1"],
                    tooltip : {
                        show:false,
                        trigger: 'axis'
                    },
                    height:280,
                    calculable : false,

                    yAxis : [
                        {
                            show : false,
                            axisTick:false,
                            type : 'category',
                            data: aAllTitleLan,
                            splitLine : false,
                            axisLine:false
                        }
                    ],
                    xAxis: [
                        {
                            type:"value",
                            axisLabel:false,
                            splitLine : false,
                            axisLine:false
                        }
                    ],

                    grid:{
                        borderWidth:0,
                        x:25,
                        y:10,
                        x2:80,
                        y2:15
                    },
                    series : [
                        {
                            name:'Number',
                            type:'bar',
                            data:g_result.Device.info,
                            itemStyle : {
                                normal: {
                                    label : {
                                        show: true,
                                        position: 'right',
                                        formatter: function(x){
                                            return x.value;
                                        },
                                        textStyle: {
                                            color:"#a7b7c1"
                                        }
                                    }
                                },
                                emphasis:{
                                }
                            }
                        },
                        {
                            name:'Number',
                            type:'bar',
                            data:g_result.Device.info,
                            color:'rgba(0,0,0,0)',
                            itemStyle : {
                                normal: {
                                    label : {
                                        show: true,
                                        position: 'insideLeft',
                                        formatter: function(x){return x.name;},
                                        textStyle: {color:"#47495d"}
                                    },
                                    color: 'rgba(0,0,0,0)'
                                },
                                emphasis: {
                                    label : {
                                        show: true,
                                        formatter: function(x){return x.name;},
                                        textStyle: {color:"#47495d"}
                                    }
                                    , color: 'rgba(0,0,0,0)'
                                }
                            }

                        }
                    ]
                };
                if(nEnd < 100){
                    option.dataZoom = {
                        show : true,
                        realtime : true,
                        start : 0,
                        end : nEnd,
                        zoomLock: true,
                        orient: "vertical",
                        width: 5,
                        x: nWidth+20,
                        backgroundColor:'#F7F9F8',
                        fillerColor:'#bec6cf',
                        handleColor:'#bec6cf',
                        border:'none'
                    };
                }
                $("#deviceinfo_bar").echart("init", option);
            }

        }
    }
    function successAttacks(name, Message)
    {
        var message = Message || [];
        var msg = {Flood:[], Malf:[], Other:[], FloodNum:0, MalfNum:0, OtherNum:0};

        for(var i = 0; i < message.length; i++)
        {
            var temp = {};
            if(!g_allAttack[Number(message[i].Type)] || !g_allAttack[Number(message[i].Type)][Number(message[i].SubType)])
            {
                continue;
            }
            temp.name = g_allAttack[Number(message[i].Type)][Number(message[i].SubType)];
            temp.value = message[i].Count - 0;
            switch(message[i].Type - 0)
            {
                case 1:
                {
                    if(temp.name)
                    {
                        msg.Flood.push(temp);
                    }
                    msg.FloodNum += temp.value;
                    break;
                }
                case 2:
                {
                    if(temp.name)
                    {
                        msg.Malf.push(temp);
                    }
                    msg.MalfNum += temp.value;
                    break;
                }
                case 0:
                {
                    if(temp.name)
                    {
                        msg.Other.push(temp);
                    }
                    msg.OtherNum += temp.value;
                    break;
                }
            }

        }

        g_result[name] = msg;

        drawAttacks();
    }
    function drawAttacks()
    {
        if(g_result.Attack)
        {
            var nMalf,nFlood,nOthers;
            var aSeriesData = [ g_result.Attack.Flood, g_result.Attack.Malf, g_result.Attack.Other];
            var oForm = {
                Flood_num: g_result.Attack.FloodNum || 0,
                Malformed_num: g_result.Attack.MalfNum,
                other_num: g_result.Attack.OtherNum || 0
            };
           // oForm = Utils.Base.addComma(oForm);
            //Utils.Base.updateHtml($("#city_wips"), oForm);

            // $("#Flood_num").text();
            // $("#Malformed_num").text();
            // $("#other_num").text();

            var aOption = [];
            var nWidth = $("#attackinfo_bar").parent().width()*0.95;
            var aColorList = ["#FBCEB1", "#C8C3E1", "#FE808B"];
            var aAllTitleLan = [];
            for(var j = 0 ; j < aSeriesData.length; j++)
            {
                var temp = [];
                for(var k = 0; k < aSeriesData[j].length; k++)
                {
                    temp.push(aSeriesData[j][k].name);
                }
                aAllTitleLan.push(temp);
            }
            var nEnd;
            nEnd = 100*5/(aAllTitleLan[2].length || 1);

            for(var m = 0; m < 5 - aAllTitleLan[2].length; m++)
            {
                aAllTitleLan[2].unshift("");
                aSeriesData[2].unshift({name:"",value:""});
            }
            var opt = {
                color: [aColorList[2]],
                tooltip : {
                    show:false,
                    trigger: 'axis'
                },
                height:280,
                calculable : false,

                yAxis : [
                    {
                        show : false,
                        axisTick:false,
                        type : 'category',
                        data: aAllTitleLan[2],
                        splitLine : false,
                        axisLine:false
                    }
                ],
                xAxis: [
                    {
                        type:"value",
                        axisLabel:false,
                        splitLine : false,
                        axisLine:false
                    }
                ],

                grid:{
                    borderWidth:0,
                    x:25,
                    y:10,
                    x2:80,
                    y2:15
                },
                series : [
                    {
                        name:'Number',
                        type:'bar',
                        data:aSeriesData[2],
                        itemStyle : {
                            normal: {
                                label : {
                                    show: true,
                                    position: 'right',
                                    formatter: function(x){
                                        return x.value;
                                    },
                                    textStyle: {
                                        color:"#a7b7c1"
                                    }
                                }
                            },
                            emphasis:{
                            }
                        }
                    },
                    {
                        name:'Number',
                        type:'bar',
                        data:aSeriesData[2],
                        color:'rgba(0,0,0,0)',
                        itemStyle : {
                            normal: {
                                label : {
                                    show: true,
                                    position: 'insideLeft',
                                    formatter: function(x){return x.name;},
                                    textStyle: {color:"#47495d"}
                                },
                                color: 'rgba(0,0,0,0)'
                            },
                            emphasis: {
                                label : {
                                    show: true,
                                    formatter: function(x){return x.name;},
                                    textStyle: {color:"#47495d"}
                                }
                                , color: 'rgba(0,0,0,0)'
                            }
                        }

                    }
                ]
            };
            if(nEnd < 100){
                opt.dataZoom = {
                    show : true,
                    realtime : true,
                    start : 0,
                    end : nEnd,
                    zoomLock: true,
                    orient: "vertical",
                    width: 5,
                    x: nWidth,
                    backgroundColor:'#F7F9F8',
                    fillerColor:'#bec6cf',
                    handleColor:'#bec6cf',
                    border:'none'
                };
            }
            aOption.push(opt);
			 var oEcharts = echarts.init(document.getElementById("attackinfo_bar"));
            oEcharts.setOption(aOption[0]);
            
        }
    }
		function attack_line(x,value) //折线图
		{	
			var myChart = echarts.init(document.getElementById('attack_line'));
			attackOption = {
				legend: {
					
					data:['','检测到的攻击次数']
				},
				calculable : false,
				tooltip : {
					trigger: 'axis'
				},
				xAxis : [
					{
						type : 'category',
						boundaryGap : false,
						data : x,
						splitLine: {
								show: true
							},
							axisLine: {
								show: true,
								lineStyle: {
									color: '#AEAEB7', //定义x轴线的颜色
									width: '1'
								}
							},
							axisLabel: {
								textStyle: {
									color: '#617085'  //定义下面值标签的颜色
								}
							},
					}
					
				],
				yAxis : [
					{
						type : 'value',
						axisLabel : {
							formatter: '{value} ',
							 textStyle: {
									color: '#617085'
							 }
						},
						splitLine: {
								lineStyle: {
									color: '#eee'
								}
							}
					}
				],
				series : [
					{
						name:'检测到的攻击次数',
						type:'line',
						smooth:'true',
						itemStyle: {
						normal: {
							color:"blue"
						}},
						data:value,
						markPoint : {
							data : [
								{type : 'max', name: '最大值'},
								{type : 'min', name: '最小值'}
							]
						},
						markLine : {
							data : [
								{type : 'average', name: '平均值'}
							]
						}
					},  
				]
			};
			myChart.setOption(attackOption); 
		}	
		function attack_pie(value)  //饼图
		{
			var myChart = echarts.init(document.getElementById('attack_pie'));
			pieoption = {
				title : {
					text: '',
					subtext: '',
					x:'center'
				},
				 tooltip : {
					trigger: 'item',
					formatter: "{a} <br/>{b} : {c} ({d}%)"
				},
				legend: {
					orient : 'vertical',
					x : 'left',
					data:['','','','','']
				},
				calculable : false,
				series : [
					{
						name:'',
						type:'pie',
						radius : '55%',
						center: ['50%', '60%'],
						data:value
					}
				]
			};
			myChart.setOption(pieoption); 
		}
		function drawAttacks()
		{
			if(g_result.Attack)
			{
				var nMalf,nFlood,nOthers;
				var aSeriesData = [ g_result.Attack.Flood, g_result.Attack.Malf, g_result.Attack.Other];
				var oForm = {
					Flood_num: g_result.Attack.FloodNum || 0,
					Malformed_num: g_result.Attack.MalfNum,
					other_num: g_result.Attack.OtherNum || 0
				};
				//oForm = Utils.Base.addComma(oForm);
				//Utils.Base.updateHtml($("#city_wips"), oForm);

				// $("#Flood_num").text();
				// $("#Malformed_num").text();
				// $("#other_num").text();

				var aOption = [];
				var nWidth = $("#attackinfo_bar").parent().width()*0.95;
				var aColorList = ["#FBCEB1", "#C8C3E1", "#FE808B"];
				var aAllTitleLan = [];
				for(var j = 0 ; j < aSeriesData.length; j++)
				{
					var temp = [];
					for(var k = 0; k < aSeriesData[j].length; k++)
					{
						temp.push(aSeriesData[j][k].name);
					}
					aAllTitleLan.push(temp);
				}
				var nEnd;
				nEnd = 100*5/(aAllTitleLan[2].length || 1);

				for(var m = 0; m < 5 - aAllTitleLan[2].length; m++)
				{
					aAllTitleLan[2].unshift("");
					aSeriesData[2].unshift({name:"",value:""});
				}
				var myChart = echarts.init(document.getElementById('attackinfo_bar'));
				var opt = {
					color: [aColorList[2]],
					tooltip : {
						show:false,
						trigger: 'axis'
					},
					height:280,
					calculable : false,

					yAxis : [
						{
							show : false,
							axisTick:false,
							type : 'category',
							data: aAllTitleLan[2],
							splitLine : false,
							axisLine:false
						}
					],
					xAxis: [
						{
							type:"value",
							axisLabel:false,
							splitLine : false,
							axisLine:false
						}
					],

					grid:{
						borderWidth:0,
						x:25,
						y:10,
						x2:80,
						y2:15
					},
					series : [
						{
							name:'Number',
							type:'bar',
							data:aSeriesData[2],
							itemStyle : {
								normal: {
									label : {
										show: true,
										position: 'right',
										formatter: function(x){
											return x.value;
										},
										textStyle: {
											color:"#a7b7c1"
										}
									}
								},
								emphasis:{
								}
							}
						},
						{
							name:'Number',
							type:'bar',
							data:aSeriesData[2],
							color:'rgba(0,0,0,0)',
							itemStyle : {
								normal: {
									label : {
										show: true,
										position: 'insideLeft',
										formatter: function(x){return x.name;},
										textStyle: {color:"#47495d"}
									},
									color: 'rgba(0,0,0,0)'
								},
								emphasis: {
									label : {
										show: true,
										formatter: function(x){return x.name;},
										textStyle: {color:"#47495d"}
									}
									, color: 'rgba(0,0,0,0)'
								}
							}

						}
					]
				};
				if(nEnd < 100){
					opt.dataZoom = {
						show : true,
						realtime : true,
						start : 0,
						end : nEnd,
						zoomLock: true,
						orient: "vertical",
						width: 5,
						x: nWidth,
						backgroundColor:'#F7F9F8',
						fillerColor:'#bec6cf',
						handleColor:'#bec6cf',
						border:'none'
					};
				}
				aOption.push(opt);

				myChart.setOption(aOption[0]);
				
			}
		}
		function clickTestValue(value)
		{
				
			var tmp_x=[];
			var tmp_value=[];
			var tmp_pie=[];
			if(1==value)
			{
				tmp_x=['9:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00'];
				tmp_value=[120, 500, 1700, 1500, 4500, 2500, 3000,2613,2500,1085,100,450,900,2500];
				tmp_pie=[{value:120,name:'9:00'},{value:500,name:'10:00'},{value:1700,name:'11:00'},{value:1500,name:'12:00'},{value:4500,name:'13:00'},
				{value:2500,name:'14:00'},{value:3000,name:'15:00'},{value:2613,name:'16:00'},{value:2500,name:'17:00'},{value:1085,name:'18:00'},{value:100,name:'19:00'},
				{value:450,name:'20:00'},{value:900,name:'21:00'},{value:2500,name:'22:00'}];
			}
			if(2==value)
			{
				tmp_x=['7-5','7-6','7-7','7-8','7-9','7-10','7-11'];
				tmp_value=[2500, 3000,2613,2500,1085,100,450];
				tmp_pie=[{value:2500,name:'7-5'},{value:3000,name:'7-6'},{value:2613,name:'7-7'},{value:2500,name:'7-8'},{value:1085,name:'7-9'},{value:100,name:'7-10'},{value:450,name:'7-11'}];
			}
			if(3==value)
			{
				tmp_x=['7-1','7-2','7-3','7-4','7-5','7-6','7-7','7-8','7-9','7-10','7-11','7-12','7-13','7-14','7-15','7-16','7-17','7-18','7-19','7-20','7-21','7-22','7-23','7-24','7-25','7-26','7-27','7-28'];
				tmp_value=[120, 500, 1700, 1500, 4500, 2500, 3000,2613,2500,1085,100,450,900,2500,120, 500, 1700, 1500, 4500, 2500, 3000,2613,2500,1085,100,450,900,2500,20];
				tmp_pie=[{value:120,name:'7-1'},{value:500,name:'7-2'},{value:1700,name:'7-3'},{value:1500,name:'7-4'},{value:4500,name:'7-5'},{value:2500,name:'7-6'},
					{value:3000,name:'7-7'},{value:2613,name:'7-8'},{value:2500,name:'7-9'},{value:1085,name:'7-10'},{value:100,name:'7-11'},{value:450,name:'7-12'},
					{value:900,name:'7-13'},{value:2500,name:'7-14'},{value:120,name:'7-15'},{value:500,name:'7-16'},{value:1700,name:'7-17'},{value:1500,name:'7-18'},
					{value:4500,name:'7-19'},{value:2500,name:'7-20'},{value:3000,name:'7-21'},{value:2613,name:'7-22'},{value:2500,name:'7-23'},{value:1085,name:'7-24'},
					{value:100,name:'7-25'},{value:450,name:'7-26'},{value:900,name:'7-27'},{value:2500,name:'7-28'},{value:20,name:'7-29'},{value:150,name:'7-30'}];
			}
			if(4==value)
			{
				tmp_x=['2016-1','2016-2','2016-3','2016-4','2016-5','2016-6','2016-7','2016-8','2016-9','2016-10','2016-11','2016-12'];
				tmp_value=[120, 500, 1700, 1500, 4500, 2500, 3000,2613,2500,1085,100,450];
				tmp_pie=[{value:120,name:'2016-1'},{value:500,name:'2016-2'},{value:1700,name:'2016-3'},{value:1500,name:'2016-4'},{value:4500,name:'2016-5'},
					{value:2500,name:'2016-6'},{value:3000,name:'2016-7'},{value:2613,name:'2016-8'},{value:2500,name:'2013-9'},{value:1085,name:'2016-10'},
					{value:100,name:'2016-11'},{value:450,name:'2016-12'}];
			}
			attack_line(tmp_x,tmp_value);
			attack_pie(tmp_pie);
			 drawAttacks();
		}
		
			
			
		$scope.clickTest = function(e){
			angular.element('#total a.time-link').removeClass('active');
			var value = e.target.getAttribute('value');  //此函数可以获取前面 标签里的value 值
			angular.element('#total a[value = '+value+']').addClass('active');
			clickTestValue(value);
		}
			
	              

               
              
           


	
	}];
});