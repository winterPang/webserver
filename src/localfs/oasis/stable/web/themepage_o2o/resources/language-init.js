$(document).ready(function () {
    /**这里是根据该模板的参数来确定中英文的。
     var lang = getUrlParamValue('lang');
     if(lang == "" || lang == undefined || lang == null || lang != "zh_CN" && lang != "en_US"){
		lang = "zh_CN";
	}*/
    // 根据cookie获取中英文以后只用一套页面时用
    // var lang = document.cookie.split("=")[1];
    var lang = window.location.href;
    lang = lang.substring(lang.indexOf("draw"),lang.indexOf(".html"));
    if(lang == "draw"){
        lang = "zh";
    }else {
        lang = "en";
    }
    //上面是因为有两套模板所以做的兼容处理。
    console.log("the locale:" + lang);
    if (lang == "" || lang == undefined || lang == "cn") {
        lang = "zh";
    }
    console.log("the current locale:" + lang.toLowerCase());
    //初始化语言
    i18n_init(lang.toLowerCase());
})

/**
 * 初始化页面语言
 */
function i18n_init(lang) {
    jq(function () {
        jQuery.i18n.properties({
            name: 'themepage', //资源文件名称
            path: '../resources/language/', //资源文件路径
            mode: 'map', //用Map的方式使用资源文件中的值
            language: lang,
            callback: function () {//加载成功后设置显示内容
            }
        });
    });
}

/**
 * 从资源串获取字符串
 * @param name
 * @returns
 */
function i18n_get(name) {
    return jq.i18n.prop(name);
}

/**
 * 初始化简约首页文字
 */
function i18_init_index_simple() {
    jq("title").html(i18n_get("index"));
    // jq(".tasks-list").next().attr("style","");
    // jq(".tasks-list").next().addClass("btn-cus");
    jq("#quickLoginImg").text(i18n_get("quickLoginImg"));
    jq("#homePage").html(i18n_get('time_s_html'));
}

function i18_init_index_simplel(obj) {
    obj.find("title").html("");
    obj.find("#quickLoginImg").text("");
    obj.find("#homePage").html("");
}

var accountTabs = [1, 3];
var phoneTabs = [2, 4, 5, 6];
var loginTabs = [1, 2, 3, 4, 5, 6];
/**
 * 初始化简约登录页面文字
 */
function i18_init_login_simple() {
    jq("title").html(i18n_get("login"));
    jq("#texLogin span p").text(i18n_get("texLogin"));
    jq("#phoneDiv .line_02 span").text(i18n_get("fixed_account"));
    jq("#phoneDiv .line_02 #phoneDtp").text(i18n_get("mobile_number"));
    jq("#gudingDiv .line_02 span").text(i18n_get("mobile_number"));
    jq("#gudingDiv .line_02 #phoneDtp").text(i18n_get("fixed_account"));
    jq("#gudingDivMac .line_02 #phoneDtp").text(i18n_get("fixed_account"));
    jq("#gudingDivMac .line_02 span").text(i18n_get("mobile_number"));
    for (var i in accountTabs) {
        jq("#username" + accountTabs[i]).attr("placeholder", i18n_get("account_name"));
        jq("#password" + accountTabs[i]).attr("placeholder", i18n_get("account_password"));
        jq("#remebermetext" + accountTabs[i]).text(i18n_get("remeber_me"));
    }
    for (var i in phoneTabs) {
        jq("#username" + phoneTabs[i]).attr("placeholder", i18n_get("phone_number"));
        if (phoneTabs[i] == 2 || phoneTabs[i] == 4) {
            jq("#password" + phoneTabs[i]).attr("placeholder", i18n_get("phone_verification"));
            jq("#sendLoginMessageBtn" + phoneTabs[i]).val(i18n_get("btn_getcode"));
        }
    }
    for (var i in loginTabs) {
        jq("#loginBtn" + loginTabs[i]).val(i18n_get("btn_login"));
    }
    jq(".social-title").text(i18n_get("third_party_account"));
    jq("#changePhone iuput").val(i18n_get("changePhone"));
    jq("#changePhone6 iuput").val(i18n_get("changePhone"));
    jq("#qqDiv").find("div:eq(1) p").text(i18n_get("qq_auth"));
    jq("#weixinDiv").find("div:eq(1) p").text(i18n_get("weixin_auth"));
    jq("#wxwifiDiv").find("div:eq(1) p").text(i18n_get("weixin_wifi_auth"));
    jq("#loading span").text(i18n_get("launching"));
    jq(".go_modify").text(i18n_get("modify_password"));
}

function i18_init_login_simplel(obj) {
    obj.find("title").html("");
    obj.find("#texLogin span p").text("");
    obj.find("#phoneDiv .line_02 span").text("");
    obj.find("#phoneDiv .line_02 #phoneDtp").text('');
    obj.find("#gudingDiv .line_02 span").text('');
    obj.find("#gudingDiv .line_02 #phoneDtp").text('');
    obj.find("#gudingDivMac .line_02 #phoneDtp").text('');
    obj.find("#gudingDivMac .line_02 span").text('');
    for (var i in accountTabs) {
        obj.find("#username" + accountTabs[i]).attr("placeholder", "");
        obj.find("#password" + accountTabs[i]).attr("placeholder", "");
        obj.find("#remebermetext" + accountTabs[i]).text('');
    }
    for (var i in phoneTabs) {
        obj.find("#username" + phoneTabs[i]).attr("placeholder", '');
        if (phoneTabs[i] == 2 || phoneTabs[i] == 4) {
            obj.find("#password" + phoneTabs[i]).attr("placeholder", '');
            obj.find("#sendLoginMessageBtn" + phoneTabs[i]).val('');
        }
    }
    for (var i in loginTabs) {
        obj.find("#loginBtn" + loginTabs[i]).val('');
    }
    obj.find(".social-title").text('');
    obj.find("#changePhone iuput").val('');
    obj.find("#changePhone6 iuput").val('');
    obj.find("#qqDiv").find("div:eq(1) p").text('');
    obj.find("#weixinDiv").find("div:eq(1) p").text('');
    obj.find("#wxwifiDiv").find("div:eq(1) p").text('');
    obj.find("#loading span").text('');
    obj.find(".go_modify").text('');
}
/**
 * 初始化简约登录成功页文字
 */
function i18_init_loginSuc_simple() {
    jq("title").html(i18n_get("loginSucc"));
    jq('#mainPortalDiv div').first().html(i18n_get('time_s_suc_html'));
}
function i18_init_loginSuc_simplel(obj) {
    obj.find("title").html('');
    obj.find('#mainPortalDiv div').first().html('');
}
/**
 * 初始化简约主页文字
 */
function i18_init_home_simple() {
    jq("title").html(i18n_get("home"));
    jq("#text100 span").text(i18n_get("home_text100"));
}
function i18_init_home_simplel(obj) {
    obj.find("title").html('');
    obj.find("#text100 span").text('');
}
/**
 * 初始化天空首页文字
 */
function i18_init_index_sky() {
    jq("title").html(i18n_get("index"));
    jq("#homePage").html(i18n_get("time_s_html"));
    jq("#quickLoginImg").text(i18n_get("quickLoginImg"));
}
function i18_init_index_skyl(obj) {
    obj.find("title").html('');
    obj.find("#homePage").html('');
    obj.find("#quickLoginImg").text('');
}
/**
 * 初始化天空登录页面文字
 */
function i18_init_login_sky() {
    jq("title").html(i18n_get("login"));
    jq(".form-tab .wechat-link").text(i18n_get("wechat_link"));
    jq(".form-tab .wxwifi-link").text(i18n_get("wxwifi_link"));
    jq(".form-tab .wxcount-link").text(i18n_get("wxcount_link"));
    jq(".form-tab .phone-link").text(i18n_get("phone_link"));
    jq(".form-tab .user-link").text(i18n_get("user_link"));
    jq(".btn-wifi span").text(i18n_get("btn_wifi"));
    jq(".btn-wechat span").text(i18n_get("btn_wechat"));
    jq(".btn-getcode button").text(i18n_get("btn_getcode"));
    jq("#changePhone").text(i18n_get("changePhone"));
    jq(".btn-login").text(i18n_get("btn_login"));
    jq(".form-title").text("");
    jq(".copyright").text("");
    jq(".input-phone input").attr("placeholder", i18n_get("input_phone"));
    jq(".input-code input").attr("placeholder", i18n_get("input_code"));
    jq(".input-name input").attr("placeholder", i18n_get("input_name"));
    jq(".input-pwd input").attr("placeholder", i18n_get("input_pwd"));
    jq("#loading span").text(i18n_get("launching"));
    jq(".go_modify").text(i18n_get("modify_password"));
    jq("#remebermetext").text(i18n_get("remeber_me"));
}
function i18_init_login_skyl(obj) {
    obj.find("title").html('');
    obj.find(".form-tab .wechat-link").text('');
    obj.find(".form-tab .wxwifi-link").text('');
    obj.find(".form-tab .wxcount-link").text('');
    obj.find(".form-tab .phone-link").text('');
    obj.find(".form-tab .user-link").text('');
    obj.find(".btn-wifi span").text('');
    obj.find(".btn-wechat span").text('');
    obj.find(".btn-getcode button").text('');
    obj.find("#changePhone").text('');
    obj.find(".btn-login").text('');
    obj.find(".form-title").text("");
    obj.find(".copyright").text("");
    obj.find(".input-phone input").attr("placeholder", '');
    obj.find(".input-code input").attr("placeholder", '');
    obj.find(".input-name input").attr("placeholder", '');
    obj.find(".input-pwd input").attr("placeholder", '');
    obj.find("#loading span").text('');
    obj.find(".go_modify").text('');
    obj.find("#remebermetext").text('');
}
/**
 * 初始化天空登录成功页文字
 */
function i18_init_loginSuc_sky() {
    jq("title").html(i18n_get("loginSucc"));
    jq("#homePage").html(i18n_get("time_s_html"));
    jq("#text100 span").text(i18n_get("loginSuc_text100"));
}
function i18_init_loginSuc_skyl(obj) {
    obj.find("title").html('');
    obj.find("#homePage").html('');
    obj.find("#text100 span").text('');
}
/**
 * 初始化天空主页文字
 */
function i18_init_home_sky() {
    jq("title").html(i18n_get("home"));
    jq("#text100 span").text(i18n_get("home_text100"));
}
function i18_init_home_skyl(obj) {
    obj.find("title").html('');
    obj.find("#text100 span").text('');
}








