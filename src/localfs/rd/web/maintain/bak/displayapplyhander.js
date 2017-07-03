;(function($){
var MODULE_BASE = "maintain";
var MODULE_NAME = MODULE_BASE+".displayApplyHander";
var g_oUrlPara;
var g_sHandler;
var g_sLevel;
var g_sErrortype;
var g_sHandlemode;

/*
编辑框中数据的获取以及显示
*/
function getData(){
	$.get("/v3/maintenance/all",function(data,status){
		var data2 = JSON.parse(data);
        initData(data2);
	})
}

function initData(data){
    var core = g_oUrlPara.core;
    for(var i=0;i<data.length;i++){
        if(data[i].core == core){
		    data[i].status = data[i].handlemode;
			if(data[i].status == "1")
			{
			 $("#status").val("未分配");	 
			}else if(data[i].status == "2")
			{
			 $("#status").val("未定位");	
			}else if(data[i].status == "3")
			{
			 $("#status").val("已修改");
			}else if(data[i].status == "4")
			{
			 $("#status").val("已修复");
			}
			
			$("#setpoint").val(data[i].setpoint);
			$("#handler").val(data[i].handler);
			$("#module").val(data[i].module);
			$("#time").val(data[i].time);      	
			$("#level").val(data[i].level);
			$("#errortype").val(data[i].errortype);
			$("#product").val(data[i].product);
			$("#version").val(data[i].version);
			$("#gbdinfo").val(data[i].gdbinfo);
			$("#core").html(data[i].core);
			$("#handlemode").val(data[i].handlemode);
			
			g_sHandler = $("#handler").val();
	        g_sLevel = $("#level").val();
	        g_sErrortype = $("#errortype").val();
			g_sHandlemode = $("#handlemode").val();
        }
    }	 
}

/*
确定按钮点击后提交数据到后台
*/
function success(){
   
	$("#success").on("click",function(){
      var sHandler = $("#handler").val();
	  var sLevel = $("#level").val();
      var sErrortype = $("#errortype").val();
      var sCore = g_oUrlPara.core;
	  var sHandlemode = $("#handlemode").val();
	  
	  var sHandlemode = $("#handlemode").val();
		$.ajax({
			url:"/v3/maintenance/setall",
			type:"POST",
			data:{
				handler:sHandler,
				level:sLevel,
				errortype:sErrortype,
				core:sCore,
				handlemode:sHandlemode
			},
			success:function(){               
				if((g_sHandler != sHandler) ||(g_sLevel != sLevel) || (g_sErrortype != sErrortype) || g_sHandlemode != sHandlemode)
				{
				   //initAll();
				   location.reload(); 
		        }
			},
		    error:function(){
				alert("设置失败！");
			}
		})
	})
}

/*
后台重新获取数据，加载mlist
*/
/*
function initAll(){
	$.get("/v3/maintenance/all",function(data,status){
		var data2 = JSON.parse(data);
		var abnormal_data =[];
		for(var i=0;i<data2.length;i++){
		  abnormal_data[i] = {}; 
          abnormal_data[i].setpoint = data2[i].setpoint;
		  abnormal_data[i].handler = data2[i].handler;
          abnormal_data[i].module = data2[i].module;
		  abnormal_data[i].time = data2[i].time;
		  abnormal_data[i].status = data2[i].status;
		  abnormal_data[i].level = data2[i].level;
		  abnormal_data[i].errortype = data2[i].errortype;
		  abnormal_data[i].product = data2[i].product;
		  abnormal_data[i].version = data2[i].version;
		  abnormal_data[i].resume = data2[i].resume;

		  if(abnormal_data[i].status == "1")
		  {
			 abnormal_data[i].status = "已修改";
		  }else if(abnormal_data[i].status == "2")
		  {
			 abnormal_data[i].status = "未修复";
		  }

		  if(abnormal_data[i].level == "1")
		  {
			  abnormal_data[i].level = "致命";
		  }else if(abnormal_data[i].level == "2")
		  {
			  abnormal_data[i].level = "严重" ;
		  }else if(abnormal_data[i].level == "3")
		  {
			  abnormal_data[i].level = "一般";
		  }

		  if(abnormal_data[i].errortype == "1")
		  {
              abnormal_data[i].errortype = "数组访问越界";
		  }else if(abnormal_data[i].errortype == "2")
		  {
			  abnormal_data[i].errortype = "指针访问越界";
		  }else if(abnormal_data[i].errortype == "3")
		  {
			  abnormal_data[i].errortype = "访问空指针";
		  }else if(abnormal_data[i].errortype == "4")
		  {
			  abnormal_data[i].errortype = "访问无效指针";
		  }else if(abnormal_data[i].errortype == "5")
		  {
			  abnormal_data[i].errortype = "除零错误";
		  }else if(abnormal_data[i].errortype == "6")
		  {
			  abnormal_data[i].errortype = "内存未初始化";
		  }else if(abnormal_data[i].errortype == "7")
		  {
		      abnormal_data[i].errortype = "数据计算溢出"; 
		  }
		}
		$("wirelessterminal_mlist").mlist("refresh",abnormal_data);
	})
}
*/

function download(){
    $("#core").on("click",function(){
	   var value = $("#core").html();
	   document.getElementById('core').href = "/v3/jag/maintenance/upload?filename=abcd.tgz%"+value;
	})
}



function _init(oPara) {
  g_oUrlPara = Utils.Base.parseUrlPara();
  $.extend(g_oUrlPara,oPara);
  getData();
  success();
  download();  
}

function _destroy(){

}

Utils.Pages.regModule(MODULE_NAME,{
   "init":_init,
   "destroy":_destroy,
   "widgets":["Mlist","SList"],
   "utils":["Request","Base"]
});

})(jQuery);