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
<div class="container" style="padding-top: 10px;">
	<div id="image100"
		class="canvas-edited-text canvas-event-selectable canvas-event-draggable canvas-event-click canvas-event-dbclick ui-draggable ui-selectee ui-selected"
		data-canvasrole="image-role-panel" data-role="page"
		style="position: relative;">
		<img class="canvas_img_replace" style="width: 100%;"
			src="images/logo-inverted.jpg">
	</div>
	<div
		class="canvas-edited-text canvas-event-selectable canvas-event-draggable canvas-event-click canvas-event-dbclick ui-draggable ui-selectee ui-selected canvas-selected-border"
		data-canvasrole="login-role-panel" data-role="page"
		style="position: relative;">
	  <div id="phoneTgudingForm">
		<div id="phoneDiv">
			<form
				class="form-horizontal templatemo-container templatemo-login-form-1"
				role="form" action="#" method="post">
				<div class="form-group">
					<div class="col-xs-12">
						<div class="control-wrapper">
							<label for="username" class="control-label fa-label"><i
								class="fa fa-user"></i></label> <input class="form-control"
								id="username1" placeholder="Username" type="text">
						</div>
					</div>
				</div>
				<div class="form-group">
					<div class="col-xs-12">
						<div class="control-wrapper">
							<label for="password" class="control-label fa-label"><i
								class="fa fa-lock"></i></label> <input class="form-control"
								id="password1" placeholder="Password" type="password">
						</div>
					</div>
				</div>
				<div class="form-group">
					<div class="col-xs-12">
						<input id="loginBtn1" value="Login"
							class="canvas-edited-text btn btn-info" style="width: 100%;"
							type="button">
					</div>
				</div>
				<div class="form-group">
					<div class="col-xs-12">
						<a id="phoneDtp" onclick="phoneDtp(1);" href="#">Phone Login</a>
					</div>
				</div>
			</form>
		</div>
		<div id="gudingDiv" style="display: none;">
			<form
				class="form-horizontal templatemo-container templatemo-login-form-1"
				role="form" action="#" method="post">
				<div class="form-group">
					<div class="col-xs-12">
						<div class="control-wrapper">
							<label for="username" class="control-label fa-label"><i
								class="fa fa-user"></i></label> <input class="form-control"
								id="username2" placeholder="Phone" type="text">
						</div>
					</div>
				</div>
				<div class="form-group">
					<div class="col-xs-8">
						<div class="control-wrapper">
							<label for="password" class="control-label fa-label"><i
								class="fa fa-lock"></i></label> <input class="form-control"
								id="password2" placeholder="Code" type="text">
						</div>
					</div>
					<div class="col-xs-4" style="padding-left: 0px;">
						<input id="sendLoginMessageBtn2" value="Get Code"
							style="width: 100%;" class="canvas-edited-text btn btn-info"
							type="button">
					</div>
				</div>
				<div class="form-group">
					<div class="col-xs-12">
						<input id="loginBtn2" value="Login"
							class="canvas-edited-text btn btn-info" style="width: 100%;"
							type="button">
					</div>
				</div>
				<div class="form-group">
					<div class="col-xs-12">
						<a id="phoneDtp" onclick="phoneDtp(2);" href="#">Username
							Login </a>
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
					<div class="control-wrapper">
						<label for="username" class="control-label fa-label"><i
							class="fa fa-user"></i></label> <input class="form-control"
							id="username3" placeholder="Username" type="text">
					</div>
				</div>
			</div>
			<div class="form-group">
				<div class="col-xs-12">
					<div class="control-wrapper">
						<label for="password" class="control-label fa-label"><i
							class="fa fa-lock"></i></label> <input class="form-control"
							id="password3" placeholder="Password" type="password">
					</div>
				</div>
			</div>
			<div class="form-group">
				<div class="col-xs-12">
					<input id="loginBtn3" value="Login"
						class="canvas-edited-text btn btn-info" style="width: 100%;"
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
					<div class="control-wrapper">
						<label for="username" class="control-label fa-label"><i
							class="fa fa-user"></i></label> <input class="form-control"
							id="username4" placeholder="Username" type="text">
					</div>
				</div>
			</div>
			<div class="form-group">
				<div class="col-xs-8">
					<div class="control-wrapper">
						<label for="password" class="control-label fa-label"><i
							class="fa fa-lock"></i></label> <input class="form-control"
							id="password4" placeholder="Code" type="text">
					</div>
				</div>
				<div class="col-xs-4" style="padding-left: 0px;">
					<input id="sendLoginMessageBtn4" value="Get Code"
						style="width: 100%;" class="canvas-edited-text btn btn-info"
						type="button">
				</div>
			</div>
			<div class="form-group">
				<div class="col-xs-12">
					<input id="loginBtn4" value="Login"
						class="canvas-edited-text btn btn-info" style="width: 100%;"
						type="button">
				</div>
			</div>
		</form>
	  </div>
	</div>
	<div class="login-container"
		style="margin-top: 0px; margin-bottom: 0px; max-width: 100%;">
		<div class="loginbox bg-white"
			style="height: 75px !important; width: 100% !important;">
			<div class="loginbox-social">
				<div class="social-title">Other Account</div>
				<div class="social-buttons" style="padding: 10px;">
					<a id="qq" href="#"
						class="canvas-edited-text button-zhifubao yellow"
						style="border-color: #F3862C; width: 40px; height: 40px;"> <img
						src="images/qq.png" style="margin-top: 3px; cursor: pointer"
						height="30px" width="30px">
					</a> <a id="weixin" href="#"
						class="canvas-edited-text button-weixin blue"
						style="border-color: #5DB2FF; width: 40px; height: 40px;"> <i
						class="fa fa-weixin" style="line-height: 37px;"></i>
					</a>
				</div>
			</div>
		</div>
	</div>
</div>