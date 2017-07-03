;var OemConfig = {
	NAME: "001",

	//获取页面支持的语言模式. 中文：cn；英文：en。如果都支持则使用逗号连起来
	//H3C 支持中英文双语言模式
	getSupportedLang: function(){return "cn";},
	
	//登录页面是否支持网管登录提示信息"Web网管用户登录"
	isSupportedLoginDesc: function(){return true;},
	
	//登录是否支持logo
	isSupportedLogo: function(){return true;}
};