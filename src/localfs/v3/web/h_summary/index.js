;(function($){
	var MODULE_NAME = "h_summary.index";
	
	function getDoubleStr(num)
    {
        return num >=10 ? num:"0"+num;
    }
	function initUserChange (aData) {
		// var aseries = [];
  //       var oTemp = {
  //           type: 'line',
  //           smooth: true,
  //           symbol : "none",
  //           showAllSymbol: true,
  //           symbolSize : 2,
  //           itemStyle: {normal: {areaStyle: {type: 'default'},lineStyle:{width:0}}},
  //           name: "终端数",
  //           data: aData
  //           };
  //       aseries.push(oTemp);
		var option = {
			width:"100%",
            height:"280px",
		    tooltip: {
                show: true,
                trigger: 'item',
                formatter:function(params){
                    var time = params.value[0].toLocaleString();
                    if(params.value[1] < 0)
                        params.value[1] = -params.value[1];
                    var string =params.seriesName + "<br/>" + time + "<br/>" + params.value[1] + "Mbps"
                    return string;
                },
                // axisPointer:{
                //     type : 'line',
                //     axis:'y',
                //     lineStyle : {
                //         color: '#373737',
                //         width: 2,
                //         type: 'solid'
                //     }
                // }
            },
		    legend: {
                orient: "horizontal",
                x: "right",
                textStyle:{color: '#9AD4DC', fontSize:"12px"},
                data:['用户数']
            },
		    calculable : true,
		    xAxis : [
		        {
		            type : 'time',
		            splitLine:true,
		            // boundaryGap : false,
		            // data : ['周一','周二','周三','周四','周五','周六','周日'],
		            axisLabel: {
                        show: true,
                        textStyle:{color: '#617085', fontSize:"12px"},
                        formatter:function(data){
                            return getDoubleStr(data.getHours()) + ":"+ getDoubleStr(data.getMinutes());                        
                        }
                    },
		        	
		        },

		    ],
		    yAxis : [
		        {
		            type : 'value',
		            // axisLabel: {
              //           show: true,
              //           textStyle:{color: '#617085', fontSize:"12px", width:2}
              //           //formatter:function(data){
              //           //    data = data < 0 ? -data : data;
              //           //    return Utils.Base.addComma(data,'rate');
              //           //},
              //       },
                }
		    ],
		    series :[
		        {
		            name:'用户数',
		            type:'line',
		            smooth: true,
             		symbolSize : 4,
		            // stack: '总量',
		            data:aData
		        },
		    ]
		};
                    
		var oTheme = {
            color: ['#98D6DA','#B4E2E2'],
            categoryAxis:{
                splitLine:{lineStyle:{color:['#FFF']}}
            }
        };
        $("#user_change").echart ("init", option,oTheme);

	}

	function initBandwidthChange (aData) {
		var option = {
		    width:"100%",
            height:"280px",
		    tooltip : {
		        trigger: 'axis'
		    },
		    legend: {
		    	x: "right",
		        data:['发送','接收']
		    },

		    calculable : true,
		    xAxis : [
		        {
		            type : 'category',
		            boundaryGap : false,
		            data : ['周一','周二','周三','周四','周五','周六','周日'],
		            splitLine:{
		        		show:false,
		        	}
		        }
		    ],
		    yAxis : [
		        {
		            type : 'value'
		        }
		    ],
		    series : [
		        {
		            name:'发送',
		            type:'line',
		            smooth:true,
		            itemStyle: {normal: {areaStyle: {type: 'default'}}},
		            data:[10, 12, 21, 54, 260, 830, 710]
		        },
		        {
		            name:'接收',
		            type:'line',
		            smooth:true,
		            itemStyle: {normal: {areaStyle: {type: 'default'}}},
		            data:[30, 182, 434, 791, 390, 30, 10]
		        }
		    ]
		};
                    

		var oTheme = {
            color: ['#F57303','#B4E2E2'],
            categoryAxis:{
                splitLine:{lineStyle:{color:['#FFF']}}
            }
        };
        $("#bandwidth_change").echart ("init", option,oTheme);
	}

	function initDate () {
		// body...
		var aweekData = [[new Date(2016,2,14,12,23,34),10],
            [new Date(2016,2,14,12,25,34), 30],
            [new Date(2016,2,15,01,26,34), 50],
            [new Date(2016,2,15,22,28,34), 20],
            [new Date(2016,2,16,02,35,34), 12],
            [new Date(2016,2,16,19,37,12), 50],
            [new Date(2016,2,17,18,40,34), 10]];
		initUserChange(aweekData);
		initBandwidthChange();
	}
	function initForm () {
		function zidingyi_apply()
        {
        	// body...
        	// var startDate = Date.parse(($("#f_datetime").datetime("getDate")).replace(/-/g,"/"))/1000;
	        // var startTime = parseInt(($("#f_clocktime").dateTime("getTime")).substr(0,2))*60*60
	        //     +parseInt(($("#f_clocktime").dateTime("getTime")).substr(3,2))*60+
	        //     parseInt(($("#f_clocktime").dateTime("getTime").substr(6,2)));
	        // var endDate = Date.parse(($("#t_datetime").datetime("getDate")).replace(/-/g,"/"))/1000;
	        // var endTime = parseInt(($("#t_clocktime").dateTime("getTime")).substr(0,2))*60*60
	        //     +parseInt(($("#t_clocktime").dateTime("getTime")).substr(3,2))*60+
	        //     parseInt(($("#t_clocktime").dateTime("getTime").substr(6,2)));
	        // var start = startDate+startTime;
	        // var end = endDate+endTime;
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#ZiDingYiDlg")));
            initUserChange(aweekData);
        }
        function onCancel()
        {
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#ZiDingYiDlg")));
            return;
        }
		var aHoursData = [[new Date(2016,2,14,12,02,34),10],
            [new Date(2016,2,14,12,10,34), 30],
            [new Date(2016,2,14,12,20,34), 50],
            [new Date(2016,2,14,12,30,34), 20],
            [new Date(2016,2,14,12,40,34), 100],
            [new Date(2016,2,14,12,50,34), 12],
            [new Date(2016,2,14,12,55,12), 47]];
        var adayData = [[new Date(2016,2,14,03,23,34),10],
            [new Date(2016,2,14,05,32,34), 100],
            [new Date(2016,2,14,09,25,34), 30],
            [new Date(2016,2,14,12,26,34), 50],
            [new Date(2016,2,14,14,28,34), 20],
            [new Date(2016,2,14,20,35,34), 12],
            [new Date(2016,2,14,23,37,12), 47]];
        var aweekData = [[new Date(2016,2,10,12,23,34),10],
            [new Date(2016,2,11,12,25,34), 30],
            [new Date(2016,2,12,12,26,34), 50],
            [new Date(2016,2,13,12,28,34), 20],
            [new Date(2016,2,14,12,35,34), 12],
            [new Date(2016,2,15,12,37,12), 47],
            [new Date(2016,2,16,12,40,34), 100]];

		$("#hours").click(function(){
			// body...
			initUserChange(aHoursData);
		});
		$("#days").click(function(){
			// body...
			initUserChange(adayData);
		});
		$("#weeks").click(function(){
			// body...
			initUserChange(aweekData);
		});
		$("#zidingyi, #bandwidth_zidingyi").click(function(){
            var addForm = $("#ZiDingYiForm");
            var jDlg = $("#ZiDingYiDlg");
            addForm.form("init", "edit", {"title":"自定义", "btn_apply":zidingyi_apply, "btn_cancel":onCancel});
            Utils.Base.openDlg(null, null,{scope:jDlg, className:"modal-large"});
        });
	}
	function _init () {
		initDate();
		initForm();
		
	}

	function _destroy () {
		// body...
	}

	function _resize () {
		// body...
	}

    Utils.Pages.regModule(MODULE_NAME,{
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["Echart","Panel","DateTime","Form"],
        "utils":["Request","Base","Msg"]
    });
})(jQuery);