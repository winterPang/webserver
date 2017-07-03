<script>
	function phoneDtp(val) {
		var phoneDiv = document.getElementById("phoneDiv");
		var gudingDiv = document.getElementById("gudingDiv");
		if (val == 1) {
			phoneDiv.style.display = "none";
			gudingDiv.style.display = "";
		} else {
			phoneDiv.style.display = "";
			gudingDiv.style.display = "none";
		}
	}
</script>
<style>
.auth-login-btn {
	text-align: left;
	font-size: 20px;
	width: 210px;
	margin: 3px;
}

.btnLogin {
	height: 35px;
	background: #4ec1b2 !important;
	border: 0px;
	font-size: 13px;
}

	.line_02 {
		height: 1px;
		border-top: 1px solid #ddd;
		text-align: center;
	}
	
	.line_02 a {
		position: relative;
		top: -12px;
		background: #fff;
		padding: 0 20px;
	}
	
	.line_02 span {
		position: relative;
		top: -12px;
		background: #fff;
		padding: 0 20px;
	}
</style>
<div class="container tpAdDiv" style="padding-top: 10px;">
	<div id="image100"
		class="adClass imageAd canvas-edited-text canvas-event-selectable canvas-event-draggable canvas-event-click canvas-event-dbclick ui-draggable ui-selectee ui-selected"
		data-canvasrole="image-role-panel" data-role="page"
		style="position: relative;">
		<img class="canvas_img_replace" style="width: 100%;"
			src="images/logo-inverted.jpg">
	</div>
	
	<div id="texLogin"
        class="adClass textAd canvas-edited-text canvas-event-selectable canvas-event-draggable canvas-event-click canvas-event-dbclick ui-draggable ui-selectee widget-body ui-selected"
        data-canvasrole="text-role-panel"
        style="box-shadow: none; position: relative; word-break: break-word">
        <span style="word-break:break-word;"><p>H3C华三</p></span>
     </div>
	<div id="login"
		class="canvas-edited-text canvas-event-selectable canvas-event-draggable canvas-event-click canvas-event-dbclick ui-draggable ui-selectee ui-selected canvas-selected-border"
		data-canvasrole="login-role-panel" data-role="page"
		style="position: relative;margin-top:5px">
	  <div id="phoneTgudingForm" style="display:none;">
		<div id="phoneDiv" style="margin-top:10px">
			<form
				class="form-horizontal templatemo-container templatemo-login-form-1"
				role="form" action="#" method="post" style="margin-top:15px">
				<div class="form-group">
                     <div class="col-xs-12" >
                       <div class="line_02"  >
	                   		<span style = "position: relative ;top: -12px;font-size: 12px;background: #f9f9f9;padding: 0 5px;">  固定账号登录</span>
                            <a id="phoneDtp" style="font-size: 12px;background: #f9f9f9;padding: 0 5px;" onclick="phoneDtp(1);" href="#">手机快速登录</a>
                        </div>
                     </div>
	             </div>
				<div class="form-group">
					<div class="col-xs-12">
						<div class="">
						 <input class="form-control"
								id="username1" placeholder="账号名" type="text" maxlength="128">
						</div>
					</div>
				</div>
				<div class="form-group">
					<div class="col-xs-12">
						<div class="">
							 <input class="form-control"
								id="password1" placeholder="密码" type="password" maxlength="32">
						</div>
					</div>
				</div>
				<div class="form-group">
					<div class="col-xs-12">
						<input id="loginBtn1" value="登录"
							class="canvas-edited-text btnLogin" style="width: 100%;font-size:14px;"
							type="button">
					</div>
				</div>
			</form>
		</div>
		<div id="gudingDiv" style="display: none;margin-top:10px">
			<form
				class="form-horizontal templatemo-container templatemo-login-form-1"
				role="form" action="#" method="post" style="margin-top:15px">
				  <div class="form-group">
                       <div class="col-xs-12">
                        <div class="line_02">
                            <span style = "position: relative ;top: -12px;font-size: 12px;background: #f9f9f9;padding: 0 5px;"> 手机快速登录</span>
                            <a id="phoneDtp" style="font-size: 12px;background: #f9f9f9;padding: 0 5px;" onclick="phoneDtp(2);" href="#">固定账号登录</a>
                       </div>
                     </div>
                 </div>
				
				<div class="form-group">
					<div class="col-xs-12">
						<div class="">
							 <input class="form-control"
								id="username2" placeholder="手机号" type="text" maxlength="128">
						</div>
					</div>
				</div>
				<div class="form-group">
					<div class="col-xs-8">
						<div class="">
						 <input class="form-control"
								id="password2" placeholder="验证码" type="text" maxlength="32">
						</div>
					</div>
					<div class="col-xs-4" style="padding-left: 0px;">
						<input id="sendLoginMessageBtn2" value="获取验证码"
							style="width: 100%;" class="canvas-edited-text btnLogin"
							type="button">
					</div>
				</div>
				<div class="form-group">
					<div class="col-xs-12">
						<input id="loginBtn2" value="登录"
							class="canvas-edited-text btnLogin" style="width: 100%;font-size:14px;"
							type="button">
					</div>
				</div>
			</form>
		</div>
	  </div>
	  <div id="gudingForm" style="display: none;">
	    <form
			class="form-horizontal templatemo-container templatemo-login-form-1"
			role="form" action="#" method="post">
			<div class="form-group">
				<div class="col-xs-12">
					<div class="">
						<input class="form-control"
							id="username3" placeholder="账号名" type="text" maxlength="128">
					</div>
				</div>
			</div>
			<div class="form-group">
				<div class="col-xs-12">
					<div class="">
						  <input class="form-control"
							id="password3" placeholder="密码" type="password" maxlength="32">
					</div>
				</div>
			</div>
			<div class="form-group">
				<div class="col-xs-12">
					<input id="loginBtn3" value="登录"
						class="canvas-edited-text btnLogin" style="width: 100%;font-size:14px;"
						type="button">
				</div>
			</div>
		</form>
	  </div>
	  <div id="phoneForm" style="display: none;">
	    <form
			class="form-horizontal templatemo-container templatemo-login-form-1"
			role="form" action="#" method="post">
			<div class="form-group">
				<div class="col-xs-12">
					<div class="">
							 <input class="form-control"
							id="username4" placeholder="手机号" type="text" maxlength="128">
					</div>
				</div>
			</div>
			<div class="form-group">
				<div class="col-xs-8">
					<div class="">
						 <input class="form-control"
							id="password4" placeholder="验证码" type="text" maxlength="32">
					</div>
				</div>
				<div class="col-xs-4" style="padding-left: 0px;">
					<input id="sendLoginMessageBtn4" value="获取验证码"
						style="width: 100%;" class="canvas-edited-text btnLogin"
						type="button">
				</div>
			</div>
			<div class="form-group">
				<div class="col-xs-12">
					<input id="loginBtn4" value="登录"
						class="canvas-edited-text btnLogin" style="width: 100%;font-size:14px;"
						type="button">
				</div>
			</div>
		</form>
	  </div>
	</div>
	<div class="login-container canvas-edited-text canvas-event-selectable canvas-event-draggable canvas-event-click canvas-event-dbclick ui-draggable ui-selectee ui-selected canvas-selected-border" 
		style="margin-top: 25px; margin-bottom: 0px; max-width: 100%;">
		<div class="bg-white"
			style="height: 100% !important; width: 100% !important; text-align: center;">
			<div class="line_02">
				<span class="social-title" style="font-size: 10px">第三方账号登录</span>
			</div>
			<div class="social-buttons" style="margin: 15px 5px 5px 5px;">
				<div id="qqDiv" style="display: none; margin-right: 15px;">
					<div id="qq">
						<img src="images/qq.png" style="margin-top: 3px; cursor: pointer"
							height="60px">
					</div>
					<div>
						<p style="font-size: 12px">qq认证</p>
					</div>
				</div>
				<div id="weixinDiv" style="display: none; margin-right: 15px;">
					<div id="weixin">
						<img src="images/wxwifi.png"
							style="margin-top: 3px; cursor: pointer" height="60px">
					</div>
					<div>
						<p style="font-size: 12px">微信公众号</p>
					</div>
				</div>
				<div id="wxwifiDiv" style="display: none; margin-right: 15px;">
					<div id="wxwifi">
						<img src="images/wifilogo.png"
							style="margin-top: 3px; cursor: pointer" height="60px">
					</div>
					<div>
						<p style="font-size: 12px">微信连Wi-Fi</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>