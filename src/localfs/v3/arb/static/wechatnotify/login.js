// 点击登录按钮的处理
function onLoginSubmit()
{
	var sPassword = $.trim($("#password").val());
	var name = $.trim($("#name").val());
	console.log("name:   "+name);
	console.log("sPassword:   "+sPassword);

	// 下发登录请求(触发相关的校验)
	$("#login-form").submit();
	return false;
}

// 页面初始化
function onPageInit()
{
	var jText = $("#text");
	var jPassword = $("#password");
	function getUrlParam(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
		var r = window.location.search.substr(1).match(reg);  //匹配目标参数
		if (r != null) return unescape(r[2]); return null; //返回参数值
	}
	var xx = getUrlParam('error');
	if (xx == 1){
		$("#password_error").show();
	}

	var query = getQueryString();

	if(query.length>0){
		$("#lt").val(query[0].split("=")[1]);
		$("#execution").val(query[1].split("=")[1]);
	}else{
		window.location ="/v3/arb/wechatnotify";
		return false;
	}
	
	$("#password").keydown(function(event){
		if (event.keyCode == 13){
			onLoginSubmit();
		}
		return true;
	});
	$("#loginBtn").on("click", function(){
	    onLoginSubmit();
        return false;
    });
}

function getQueryString(){
	var result = location.search.match(new RegExp("[\?\&][^\?\&]+=[^\?\&]+","g"));
	if(result == null){
		return "";
	}

	for(var i = 0; i < result.length; i++){
		result[i] = result[i].substring(1);
	}
	return result;
}

function onMyLoad()
{
	onPageInit();
}

var Login = function () {

    return {
        //main function to initiate the module
        init: function () 
        {
            onMyLoad();
        },
        resize: function (nHeight)
        {
        	var sClass = "height_1";
        	if (nHeight < 480)
        	{
        		sClass = "height_2";
        	}
        	else if (nHeight < 790)
        	{
        		sClass = "height_3";
        	}
        	else if (nHeight < 1024)
        	{
        		sClass = "height_4";
        	}
        	$("body").removeClass("height_1 height_2 height_3 height_4").addClass (sClass);
        }
    };

}();

$(window).resize(function ()
{
	Login.resize($(window).height());
})
