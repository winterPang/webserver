var PageText = {
	curLang: "cn",
	cn:{
		login_check:[
			"密码不能为空",
			"验证码输入错误",
			"用户名参数错误，不能有空格",
			"用户名参数错误，6-32位，英文字符和数字组合",
			"密码参数错误，不能有空格",
			"密码参数错误，8-32位，英文字符和数字组合",
			"用户名或密码错误",
			"用户未激活"
		],
		title:"华三绿洲|登录",
		logoClass:"logo_cn",
		img:{
			'ad1':'static/image/ad-1.png',
			'ad2':'static/image/ad-2.png',
			'ad3':'static/image/ad-3.png'
		},
		login_page:{
			"name":"用户名 / 手机号 / 邮箱",
			"password":"密码",
			"passwordText":"密码",
			"loginBtn":"登录",
			"forgetPadBtn":"忘记密码",
			"registerBtn":"立即注册",
			'remberPwd':"记住密码",
			"visitorLoginBtn":"访客登录"
		}
	},
	en:
	{
		login_check:[
			"UserName cannot empty",
			"Verify code error",
			"Invalid username.Spaces are not allowed.",
			"Invalid username.The username must be a combination of 6 to 32 English characters and digits.",
			"Invalid password.Spaces are not allowed.",
			"Invalid password.The password must be a combination of 6 to 32 English characters and digits.",
			"Incorrect username or password.",
			"User not active"
		],
		title:"H3C OASIS|LOGIN",
		logoClass:"logo_en",
		img:{
			'ad1':'static/image/ad1-en.png',
			'ad2':'static/image/ad2-en.png',
			'ad3':'static/image/ad3-en.png'
		},
		login_page:{
			"name":"Username / Phone / Email",
			"password":"Password",
			"passwordText":"Password",
			"loginBtn":"Login",
			"forgetPadBtn":"Forgot Password",
			'remberPwd':"Rember Password",
			"registerBtn":"Register",
			"visitorLoginBtn":"Visitor Login"
		}
	},
	changeLanguage: function(sLang)
	{
		if(!sLang)
		{            
			sLang = ("cn"==this.curLang) ? "cn" : "en";
		}
	
	    document.title = PageText[sLang]["title"];
		//dom 操作
		$('#name').attr('placeholder',PageText[sLang].login_page.name);
		$('#password').attr('placeholder',PageText[sLang].login_page.password);
		$('#text').attr('placeholder',PageText[sLang].login_page.passwordText);
		$('#loginBtn').val(PageText[sLang].login_page.loginBtn);
		$('#forgetPadBtn').html(PageText[sLang].login_page.forgetPadBtn);
		$('#registerBtn').html(PageText[sLang].login_page.registerBtn);
		$('.remberpassword').html(PageText[sLang].login_page.remberPwd);
		$('#visitorLoginBtn').html(PageText[sLang].login_page.visitorLoginBtn);

		//图片
		/*if(sLang == 'cn'){
			$('#logo').removeClass(PageText['en'].logoClass).addClass(PageText['cn'].logoClass);
		}
		else
		{
			$('#logo').removeClass(PageText['cn'].logoClass).addClass(PageText['en'].logoClass);
		}*/
		$('#logo').removeClass(PageText[this.curLang].logoClass).addClass(PageText[sLang].logoClass);
		$('#ad1').attr('src',PageText[sLang].img.ad1);
		$('#ad2').attr('src',PageText[sLang].img.ad2);
		$('#ad3').attr('src',PageText[sLang].img.ad3);

		this.curLang = sLang;
	}
};

	
	$.get("/oasis/stable/web/static/oasis-rest-notification/restapp/webnotify/getWebnotify?notify_location=1").success(function (data) {
		for(var i=0,len=data.data.length;i<len;i++){
			var obj=data.data[i].webnotifyContent;
			$("#scrolling").append("<p><img src='static/image/icon-tz.png' alt='通知'' style='margin-top:-2px'>&nbsp"+obj+"</p>");
		}

		if(data.data.length>1){
			var int=$("#scrolling").offset().top;
		    interval =  setInterval(function(){
		                        if($("#scrolling").offset().top<=int-$("#scrolling").height()){
		                             $("#scrolling").offset({top:int+10}) ;
		                        }else{
		                            $("#scrolling").offset(function(n,c){
		                                newPos=new Object();
		                                newPos.top=c.top++;         
		                                return newPos;
		                            });  
		                        }   
		                    }, 200);

		    $("#wrapper").mouseover(function(){
		         clearInterval(interval);
		    });

		    $("#wrapper").mouseout(function(){
		        interval=setInterval(function(){
		            if($("#scrolling").offset().top<=int-$("#scrolling").height()){
		                 $("#scrolling").offset({top:int+10}) ;
		            }else{
		                $("#scrolling").offset(function(n,c){
		                    newPos=new Object();
		                    newPos.top=c.top++;         
		                    return newPos;
		                });  
		            }   
		        }, 200);
		    });
		}
	});

     

function sprintf(sFormat, valuelist)
{
    var arrTmp = new Array();
    for (var j=1; j<arguments.length; j++)
    {
        arrTmp[j-1] = arguments[j];
    }

    var sRet = "";
    var sTemp = sFormat;
    var n = sTemp.indexOf("%");
    for ( var i=0; ((i<arrTmp.length) && (-1!=n)); i++ )
    {
        var sNewChar;
        var ch = sTemp.charAt(n+1);

        switch ( ch )
        {
        case '%':
            sNewChar = "%";
            i--;
            break;
        case 'd':
            sNewChar = parseInt(arrTmp[i]);
            break;
        case 's':
            sNewChar = arrTmp[i];
            break;
        default:
            sNewChar = "%"+ch;
            break;
        }

        sRet += sTemp.substring(0,n) + sNewChar;
        sTemp = sTemp.substring(n+2);
        n = sTemp.indexOf("%");
    }
    sRet += sTemp;
    return sRet;
}
var Cookie = 
{
	get: function (sName)
	{
		// cookies are separated by semicolons
		var aCookie = document.cookie.split("; ");
		for (var i=0; i < aCookie.length; i++)
		{
			// a name/value pair (a crumb) is separated by an equal sign
			var aCrumb = aCookie[i].split("=");
			if (sName == aCrumb[0]) 
			  return unescape(aCrumb[1]||"");
		}
		
		// a cookie with the requested name does not exist
		return null;
	},

    set: function (oPara, retentionDuration ,domain)
        {
            var sExpres = "";
            var n = parseInt(retentionDuration);
            if(-1 == n)
            {
                // ²»ÀÏ»¯
                var date = new Date(2099,12,31);
                sExpres = "expires=" + date.toGMTString();
            }
            else if(n>0)
            {
                var date = new Date();
                date.setTime(date.getTime() + n*3600000);
                sExpres = "expires=" + date.toGMTString();
            }
            if(domain){
                domain = "; domain=" + domain + "; path=/;";
            }
            else
            {
                 domain = "; path=/;";
            }

            for (var sName in oPara)
            {
                //document.cookie = "name=" + "value;" + "expires=" + "datatime;" + "domain=" + "" + "path=/;";
                var sCookie = sName+"="+escape(oPara[sName])+domain + sExpres;
                document.cookie = sCookie;
            }
    },
    del: function(sName)
    {
        var date = new Date();
        date.setTime(date.getTime() - 10000);

        var aTemp = sName.split(",");
        for(var i=0; i<aTemp.length; i++)
        {
            var sCookie = aTemp[i] + "=d; path=/; expires=" + date.toGMTString();
            document.cookie = sCookie;
        }
    }
}

var DBStorage = {
	set :function(key,val){
  		localStorage.setItem(key, val);
	},
	get:function(key){
		return localStorage.getItem(key)
	},
	del:function(key){
		localStorage.removeItem(key)
	},
	clear:function(){
		localStorage.clear();
	},
	getAllKey: function() {
		var keyArr = []
	    for (var i = 0, length = localStorage.length; i < length; i++) {
	        var key = localStorage.key(i);
	        keyArr.push(key)
	    }
	    return keyArr;
	}

}

var slang = 'cn';

// 点击登录按钮的处理
var oTimer ;
function onLoginSubmit()
{
	//var sPassword = $.trim($("#password").val());
	var name = $.trim($("#name").val());
	var state = 0;
	$('#name_err').hasClass('text_error_show')?state++:state;
	$('#password_err').hasClass('text_error_show')?state++:state;

	// 下发登录请求(触发相关的校验)
	/*if($("#remember_me").hasClass("remember_active_btn")){
		rememberLogin();
	}*/
	if(state == 0){
		var sUrl_xxx = '/oasis/stable/web/static/oasis-rest-user/restapp/users/isActiving/'+name;
			$.get(sUrl_xxx).success(function (data) {
			if(data.data){
				$("#server_error").text(PageText[slang].login_check[7]).addClass('error_show');
			}else{
				$("#login-form").submit();
			}
		});
	}
	return false;
}

function onInitContent()
{
	function changeAdImg()
	{
		bFlag++;
		if (bFlag == obj2.length)
		{
			bFlag = 0;
		};
		var jAdList = $('#adPanel ul');
		var jItem = $('li',jAdList);
		var nLeft = jAdList.css('left').replace("px","")*1;
		nLeft -= jItem.width();
		jAdList.animate({left:nLeft},400,function(e){
			var jFirst = $('li',this).first();
			$('li',this).last().after(jFirst);
			$(this).css({left:0});
		});
		for(var j=0;j<obj2.length;j++)
		{
			obj2[j].style.backgroundColor="#eeeeee";
		}
		obj2[bFlag].style.backgroundColor="#4ec1b2";

	}

	oTimer = setInterval(changeAdImg,4000);
	var bFlag = 0;
	var obj2 = document.getElementsByTagName("i");
	    obj2[0].style.backgroundColor ="#4ec1b2";
	    obj2[1].style.backgroundColor ="#eeeeee";
	    obj2[2].style.backgroundColor ="#eeeeee";
    $("#adPanel").on('mouseenter','ul>li',function(){value = 0})
    			 .on('mouseleave','ul>li',function(){value = 1});
}

function initLanguage(){
	slang =Cookie.get('lang')? Cookie.get('lang'):'cn';
	PageText.changeLanguage(slang);
	if(oTimer){
		clearInterval(oTimer);
		oTimer = "";
	}
}

// 页面初始化
function onPageInit()
{
	var jText = $("#text");
	var jPassword = $("#password");
	var jHidePwd = $('input[name="password"]');
	function getUrlParam(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
		var r = window.location.search.substr(1).match(reg);  //匹配目标参数
		if (r != null) return unescape(r[2]); return null; //返回参数值
	}
	var error = getUrlParam('error');
	var lticket = getUrlParam('lticket');
	var execution = getUrlParam('execution');
	var ticketTime ;
	var tickTimeOut ;
	var remerberUsers = [];
	var env = window.location.host.split('.')[0];

	remerberUsers = DBStorage.getAllKey();

	if(env === 'oasishk'){
		$('#registerBtn').attr('href','static/beforeLogin/frame/index.html#/registerByEmail')
	}
	if(lticket&&execution){
		$("#lt").val(lticket);
		$("#execution").val(execution);
	}else{
		window.location ="/oasis/stable/web/frame/index.html";
		return false;
	}
	if (error == 1){
		$("#server_error").text(PageText[slang].login_check[6]).addClass('error_show');
	}else{
		$("#server_error").removeClass('error_show');
	}
	function ticketTimes(){
		ticketTime = setInterval(function(){
			window.location ="/oasis/stable/web/frame/index.html";
			if(tickTimeOut){
				clearTimeout(tickTimeOut)
				tickTimeOut = undefined;
			}
		},3*60*1000);
	}
	ticketTimes();

	$('#name,#password,#text').on('keydown',function(){
		// console.log($(this).val());
		// if($(this).attr("id") == "name"){
			
		// }
		if(ticketTime&&!tickTimeOut){
			tickTimeOut = setTimeout(ticketTimes,60*1000);
		}
		if(ticketTime){
			clearInterval(ticketTime);
			ticketTime = undefined;
		}
	});

	function paintTips(users){
 		var tplArr = [];
	    for(var i =0 ,length = users.length;i<length;i++){
			tplArr.push("<li>"+users[i]+"</li>");
	    }
	    $(".tips").empty().append(tplArr.join(''));
	}

	$('#name').on('keyup', function() {
		$(".username >.tips").show();
		if($('#name_err').is(":visible")) $('#name_err').removeClass('text_error_show');
	    var val = $(this).val();
	    var names = $.map(remerberUsers, function(v) {
	        var reg = eval("/" + val + "/i");
	        return v.search(reg) >= 0 ? v : null
	    })
	    if(val == "") {
	    	jText.val("");
	    	jPassword.val("");
	    	jHidePwd.val("");
	    }
	    if(names.length <= 0&&$('#password').val() == ""){
	    	jText.val("");
	    	jPassword.val("");
	    	jHidePwd.val("");
	    }
	   paintTips(names);
	})

	$(".username >.tips").on('click',function(event){
		if($('#password_err').is(":visible")) $('#password_err').removeClass('text_error_show');
		var name = $(event.target).text();
		var pwd = DBStorage.get(name)
		$('#name').val(name);
		$('#password').val(encodePwd(pwd));
		jHidePwd.val(pwd);
		//$(this).hide();
		//alert($(event.target).text());
	})
	$('body').on('click',function(event){
		var target = $(event.target);
		if(target.is('#name')) return false;
		$(".username >.tips").hide();
	})

	$('#name').on('focusin',function(){
		var val = $(this).val();
		$(".username >.tips").show();
		if($("#server_error").is(":visible")) $("#server_error").hide();
		if(val){
			var names = $.map(remerberUsers, function(v) {
	        var reg = eval("/" + val + "/i");
		        return v.search(reg) >= 0 ? v : null
		    })
		   	paintTips(names);
		}else{
			paintTips(remerberUsers);
		}

		
		if($('#switch').hasClass('show_word'))
		{
			$('#switch').removeClass('show_word');
			jText.hide();
			jPassword.show();
			jPassword.val(encodePwd(jText.val()));
			jHidePwd.val(jText.val());
		}
	})

	$('#name').on('focusout',function(){
		if($(".username >.tips>li").is(':visible')) return false;
		$("#server_error").hasClass('error_show')&&$("#server_error").removeClass('error_show');
		var min = $(this).attr('minlength');
		var max = $(this).attr('maxlength');
		if(!/^[^\s]*$/.test($(this).val())){
			$('#name_err').text(PageText[slang].login_check[2]).addClass('text_error_show');
			return false
		}
		if($(this).val().length < min || $(this).val().length > max){
			$('#name_err').text(PageText[slang].login_check[3]).addClass('text_error_show');
		}else{
			$('#name_err').removeClass('text_error_show');
		}
	});

	$('#password,#text').on('focusout',function(){
		$("#server_error").hasClass('error_show')&&$("#server_error").removeClass('error_show');
		var min = $(this).attr('minlength');
		var max = $(this).attr('maxlength');
		if(!/^[^\s]*$/.test(jHidePwd.val())){
			$('#password_err').text(PageText[slang].login_check[4])
				.addClass('text_error_show');
			return false
		}
		if(jHidePwd.val().length < min ||jHidePwd.val().length > max){
			$('#password_err').text(PageText[slang].login_check[5])
				.addClass('text_error_show');
		}else{
			$('#password_err').removeClass('text_error_show');
		}
	});

	function encodePwd(inputVal) {
		var encodePassword = "";
	    if (inputVal != '') {
	        for (var i = 0; i < inputVal.length; i++) {
	            if (inputVal.charAt(i) == "\u25CF") { // has been encode
	                encodePassword += inputVal.charAt(i);
	            } else {
	                encodePassword += "\u25CF";
	            }
	        }
	    }
	    return encodePassword;
	}


	$('#password').on('keyup',function(){
		var inputVal = $(this).val();
		var plainPassword = $('input[name="password"]').val();
		var encodePassword = "";
		if (inputVal != '') {
			plainPassword = plainPassword.substr(0,inputVal.length);
	        for (var i = 0; i < inputVal.length; i++) {
	            if (inputVal.charAt(i) == "\u25CF") { // has been encode
	                encodePassword += inputVal.charAt(i);
		        } else {
		            plainPassword  += $(this).val().charAt(i)
		            encodePassword += "\u25CF";
		        }
		    }
	    } else {
	        plainPassword = inputVal;
	    }
	    $(this).val(encodePassword);
	    $('input[name="password"]').val(plainPassword);
	})
	
	//选择了记住密码，需要的处理
	/*if(Cookie.get("remember_password")){
		 $("#remember_me").removeClass("remember_btn").empty().addClass("remember_active_btn");
		 $("#name").val(Cookie.get("user_name")||"");
		 $("#password").val(Cookie.get("password")||"");
 	}*/
	onInitContent();
	//changeRememberClass();

	$("#password").keydown(function(event){
		if (event.keyCode == 13){
			var min = $(this).attr('minlength');
			var max = $(this).attr('maxlength');
			if(jHidePwd.val().length < min ||jHidePwd.val().length > max){
				$('#password_err').text(PageText[slang].login_check[5])
					.addClass('text_error_show');
			}else{
				$('#password_err').removeClass('text_error_show');
			}
			onLoginSubmit();
		}
		return true;
	})
     $("#loginBtn").on("click", function(){
		if($('#remember_me').hasClass("remember_active_btn")){
			DBStorage.set($("#name").val(),jHidePwd.val());
		}
		onLoginSubmit();
     	return false;
     });
     $('#remember_me').on('click',function(){
     	$(this).toggleClass('remember_active_btn');
     })

	 $("#visitorLoginBtn").on("click", function(){
		 $("#name").val("h3cdemovistor");
		 $("#password").val("h3cdemovistor");
		 onLoginSubmit();
	 });

	 $("#switch").click(function(){
	 	if($(this).hasClass('show_word'))
	 	{
	 		$(this).removeClass('show_word');
	 		jText.hide();
	 		jPassword.show();
			jPassword.val(encodePwd(jText.val()));
			jHidePwd.val(jText.val());
	 	}
	 	else{
	 		$(this).addClass('show_word');
	 		jText.show();
	 		jPassword.hide();
	 		jText.val(jHidePwd.val());
	 		jPassword.val(encodePwd(jText.val()));
	 	}
	 });

	$("#text").keyup(function(){
		//$("#password").val($("#text").val());
		jHidePwd.val(jText.val());						
	});
	//changeLanguage
	function isShowWord(language){
		if(($("#switch").hasClass('show_word')))
		{
			Cookie.set({"lang":language},undefined,'.h3c.com');		
			$("#switch").addClass('show_word');
			jText.show();
			jPassword.hide();
			jText.val(jHidePwd.val());
			onMyLoad();	
		}else{
			Cookie.set({"lang":language},undefined,'.h3c.com');
			onMyLoad();	
		}
	}
	$(".changeLanguage li a").unbind("click").click(function(){
		$('.text_error_show').each(function(i){
			$(this).removeClass('text_error_show');
		});
		if($(this).attr('data-val') == 'cn'){
			isShowWord('cn');
		}else{
			isShowWord('en');		
		}
		if(!($(this).hasClass('languageColor'))){
			$(this).addClass('languageColor');
			$(this).parent().parent().siblings().find('a').removeClass('languageColor');
		}
	});

	if(Cookie.get("lang")){
		$(".changeLanguage li a[data-val="+Cookie.get("lang")+"]").addClass('languageColor');
		$(".changeLanguage li a[data-val="+Cookie.get("lang")+"]").parent().parent().siblings().find('a').removeClass('languageColor');
	}

}

function onMyLoad()
{

	initLanguage();
	onPageInit();
}

var Login = function () {

    return {
        //main function to initiate the module
        init: function () 
        {
           $.get("/oasis/stable/web/static/getCasUrl").success(function(data){
        		$('#login-form').attr('action',data.casUrl)
 				onMyLoad();
        	}).error(function(err){
        		console.log(err);
        	})
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
