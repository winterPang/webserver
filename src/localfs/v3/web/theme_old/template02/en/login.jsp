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
	background: #69c4c5 !important;
	border: 0px;
	font-size: 10px;
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
 <div id="myCarousel" class="carousel slide">
		   <!-- 轮播（Carousel）指标 -->
		   <ol class="carousel-indicators">
		      <li data-target="#myCarousel" data-slide-to="0" class="active"></li>
		      <li data-target="#myCarousel" data-slide-to="1"></li>
		      <li data-target="#myCarousel" data-slide-to="2"></li>
		   </ol>   
		   <!-- 轮播（Carousel）项目 -->
		   <div class="carousel-inner " style="width: 100%;">
		      <div class="item active">
		         <div id="image100"
					class="adClass imageAd"
					style="position: relative;">
		         	<img class="canvas_img_replace"  src="images/logo-inverted.jpg" style="width: 100%;" />
		         </div>
		      </div>
		      <div class="item">
		         <div id="image101"
					class="adClass imageAd"
					style="position: relative;">
		         	<img class="canvas_img_replace" src="images/logo-inverted2.jpg"style="width: 100%;" />
		         </div>
		      </div>
		      <div class="item">
		         <div id="image102"
					class="adClass imageAd"
					style="position: relative;">
		         	<img class="canvas_img_replace" src="images/logo-inverted3.jpg" style="width: 100%;"/>
		         </div>
		      </div>
		   </div>
		   <a class="carousel-control left" href="#myCarousel" 
		      data-slide="prev">&lsaquo;</a>
		   <a class="carousel-control right" href="#myCarousel" 
		      data-slide="next">&rsaquo;</a>
</div> 
  
<div class="container" style="padding-top: 10px;">
    <div style="position: relative;overflow:hidden;" id="login">
        <div class="row" >
	        <div class="col-md-3 col-xs-3"><a href="javascript:void(0);" id="image103" >
	            <img class="canvas_img_replace  img-circle" style="width: 50px;height:50px; margin-left: 20px;margin-top: 10px;"  src="images/logoLogin.jpg"></a>
	        </div>
	        <div class="col-md-9 col-xs-9">
	            <div class="row">
	                <div id="text100" class="col-md-12 col-xs-12 app-textleft text-left">
	                  <span   style="font-size:16px font-family:STHeiti; display:block; overflow:hidden; text-overflow:ellipsis;margin-top: 20px; " >欢迎登录H3C绿洲平台</span>
					</div>
	            </div>
	      </div>
	  </div>
    </div>
	<div id="login"
		data-canvasrole="login-role-panel" data-role="page"
		style="position: relative;margin-top:5px">
	  <div id="phoneTgudingForm">
		<div id="phoneDiv" style="margin-top:10px">
			<form
				class="form-horizontal templatemo-container templatemo-login-form-1"
				role="form" action="#" method="post" style="margin-top:15px">
				<div class="form-group">
                     <div class="col-xs-12" >
	                     <div class="line_02">
                              <a id="phoneDtp" style="font-size: 12px;background: #f9f9f9;padding: 0 5px;" onclick="phoneDtp(1);" href="#">手机登录</a>
                       </div>
                     </div>
	             </div>
				<div class="form-group">
					<div class="col-xs-12">
						<div class="">
						 <input class="form-control" 
						        style="width: 100%;height:30px; font-size:9px;" 
								id="username1" placeholder="账号名" type="text">
						</div>
					</div>
				</div>
				<div class="form-group">
					<div class="col-xs-8">
						<div class="">
							 <input class="form-control"
							    style="width: 100%;height:30px; font-size:9px;" 
								id="password1" placeholder="密码" type="password">
						</div>
					</div>
					<div class="col-xs-4">
						<div class="">
							 <input id="loginBtn1" value="登录"
								class="canvas-edited-text btnLogin" style="width: 100%;height:30px;font-size:9px;color: white;"
								type="button">
						</div>
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
                               <a id="phoneDtp" style="font-size: 12px;background: #f9f9f9;padding: 0 5px;" onclick="phoneDtp(2);" href="#">账号登录</a>
                       </div>
                     </div>
                 </div>
				
				<div class="form-group">
					<div class="col-xs-8">
						<div class="">
							 <input class="form-control"
							 style="width: 100%;height:30px; font-size:9px;" 
								id="username2" placeholder="手机号" type="text">
						</div>
					</div>
					<div class="col-xs-4">
						<input id="sendLoginMessageBtn2" value="获取验证码"
							style="width: 100%;height:30px;font-size:9px;color: white;" class="canvas-edited-text btnLogin"
							type="button">
					</div>
				</div>
				<div class="form-group">
					<div class="col-xs-8">
						<div class="">
						 <input class="form-control"
						  style="width: 100%;height:30px; font-size:9px;" 
								id="password2" placeholder="验证码" type="text">
						</div>
					</div>
					<div class="col-xs-4" >
						<input id="loginBtn2" value="登录"
							class="canvas-edited-text btnLogin" style="width: 100%;height:30px;font-size:9px;color: white;"
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
						    style="width: 100%;height:30px; font-size:9px;" 
							id="username3" placeholder="账号名" type="text">
					</div>
				</div>
			</div>
			<div class="form-group">
				<div class="col-xs-8">
					<div class="">
						  <input class="form-control"
						    style="width: 100%;height:30px; font-size:9px;" 	
							id="password3" placeholder="密码" type="password">
					</div>
				</div>
				<div class="col-xs-4">
					<div class="">
						 <input id="loginBtn3" value="登录"
							class="canvas-edited-text btnLogin" style="width: 100%;height:30px; font-size:9px;color: white;"
							type="button">
					</div>
				</div>
			</div>
		</form>
	  </div>
	  <div id="phoneForm" style="display: none;">
	    <form
			class="form-horizontal templatemo-container templatemo-login-form-1"
			role="form" action="#" method="post">
			<div class="form-group">
				<div class="col-xs-8">
					<div class="">
							 <input class="form-control"
							 style="width: 100%;height:30px; font-size:9px;" 
							id="username4" placeholder="手机号" type="text">
					</div>
				</div>
				<div class="col-xs-4" style="padding-left: 0px;">
					<input id="sendLoginMessageBtn4" value="获取验证码"
						style="width: 100%;height:30px; font-size:9px;" class="canvas-edited-text btnLogin"
						type="button">
				</div>
			</div>
			<div class="form-group">
				<div class="col-xs-8">
					<div class="">
						 <input class="form-control"
						 style="width: 100%;height:30px; font-size:9px;" 
							id="password4" placeholder="验证码" type="text">
					</div>
				</div>
				<div class="col-xs-4" style="padding-left: 0px;">
					<input id="loginBtn4" value="登录"
						class="canvas-edited-text btnLogin" style="width: 100%;height:30px;font-size:9px;color: white;"
						type="button">
				</div>
			</div>
		</form>
	  </div>
	</div>
	<div style="margin-top: 30px; margin-bottom: 0px; max-width: 100%;">
		<div class="bg-white"
			style="height: 100% !important; width: 100% !important; text-align: center;">
			<div class="line_02">
				<span class="social-title" style="font-size: 12px;background: #f9f9f9;padding: 0 5px;">第三方账号登录</span>
			</div>
			<div class="social-buttons" style="margin: 15px 5px 5px 5px;">
				<div id="qqDiv" style="display: inline-block; margin-right: 15px;">
					<div id="qq">
						<img src="images/qq.png" 
							style="margin-top: 3px; cursor: pointer" height="30px">
					</div>
					<div>
						<p style="font-size: 10px; margin-top: 5px;">qq认证</p>
					</div>
				</div>
				<div id="weixinDiv" style="display: inline-block; margin-right: 15px;">
					<div id="weixin">
						<img src="images/wxwifi.png"
							style="margin-top: 3px; cursor: pointer" height="30px">
					</div>
					<div>
						<p style="font-size: 10px; margin-top: 5px;">微信公众号</p>
					</div>
				</div>
				<div id="wxwifiDiv" style="display: inline-block; margin-right: 15px;">
					<div id="wxwifi">
						<img src="images/wifilogo.png"
							style="margin-top: 3px; cursor: pointer" height="30px">
					</div>
					<div>
						<p style="font-size: 10px;margin-top: 5px;">微信连Wi-Fi</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
