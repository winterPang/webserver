(function ($) {
    var MODULE_NAME = "b_manage.wifiService";

    var g_oSsidInfo = {
        sp_manage_00: null,
        sp_visitor_01: null,
        sp_visitor_02: null,
        sp_visitor_03: null
    }

    var g_sShopName = null;
    var g_oAuthSetting = null;
    var g_oWeChartAccount = {};

    var $g_WeChartAccountList = $('div.form-body:nth-child(1) >div.form-content > div:nth-child(3) > select');
    var $g_ShopNameList = $('div.form-body:nth-child(1) >div.form-content > div:nth-child(4) > select');

    function getRcText(sRcName) {
        return Utils.Base.getRcString("index_rc", sRcName);
    }

    function onCancel() {
        jFormChat.form("updateForm", oRowdata);
        $("input[type=text]", jFormChat).each(function () {
            Utils.Widget.setError($(this), "");
        });
        return false;
    }

    function UpdateSsid(spName) {
        return $.ajax({
            type: "POST",
            url: MyConfig.path + "/ant/confmgr",
            contentType: "application/json",
            dataType: "json",
            timeout: 60000,//1 min timeout
            data: JSON.stringify({
                "configType": 0,
                "sceneFlag": "true",
                "sceneType": 2,
                "userName": FrameInfo.g_user.user,
                "shopName": g_sShopName,
                "cfgTimeout": 60,
                "cloudModule": "xiaoxiaobeicfg",
                "deviceModule": "xiaoxiaobei",
                "method": "SSIDUpdate",
                "policy": "cloudFirst",
                "param": [
                    g_oSsidInfo[spName]
                ]
            })
        }).fail(function () {
            console.log("update ssid failed");
        })
    }

    function initGrid() {
        $(".openORclose").click(function () {
            var self = $(this);
            var spName = self.parents("div.slide").attr("spname");
            if (self.hasClass("open")) {
                self.removeClass("open")
                    .parents(("div[id][class='slide']")).find(".bg-img").removeClass("wifi-open").addClass("wifi-close");
                //下发配置
                g_oSsidInfo[spName].status = 0;//disable
            }
            else {
                self.addClass("open")
                    .parents(("div[id][class='slide']")).find(".bg-img").removeClass("wifi-close").addClass("wifi-open");
                g_oSsidInfo[spName].status = 1;//enable
            }
            var hPending = Frame.Msg.pending(getRcText("PENDING"));
            UpdateSsid(spName).done(function () {
                hPending.close();
                Frame.Msg.info(getRcText("SUCCESS"));
            }).fail(function () {
                hPending.close();
                Frame.Msg.info('配置下发失败');
            });
        });

        $(".modify").click(function () {
            var ssid = $(this).parents("div.slide").find("span.ssidName").html();
            var spName = $(this).parents("div.slide").attr("spName");
            Utils.Base.redirect({ np: $(this).attr("href"), "wifi-type": $(this).attr("wifi-type"), ssid: ssid, spName: spName });
        });

        $("#accreditation").click(function () {
            Utils.Base.openDlg(null, {}, { scope: $("#accredDlg"), className: "modal-super dashboard", width: "710" });
        });

        $("input[name=AuthenType]").bind("change", function () {
            var aContent = $(this).attr("content");
            var sCtrlBlock = $(this).attr("ctrlBlock") || "";
            $(sCtrlBlock).hide();
            $("#WeTip").hide();
            if (!aContent) return true;
            aContent = aContent.split(",");
            for (var i = 0; i < aContent.length; i++) {
                if (!aContent[i]) continue;
                $(aContent[i]).show();
                $("#WeTip").show();
            }
        });
        //认证dom
        $g_WeChartAccountList.change(function () {
            initShopList(this.value);
            if (this.value == "关闭") {

            }
        });

        $('#set').click(function () {
            var template = g_oAuthSetting;
            if (!($('div.button[authType="onekey"]').hasClass('closed'))) {
                template.authCfgGson.authType = 1;//一键认证
            }
            else {
                template.authCfgGson.authType = 2;//账号认证
            }
            if ($g_WeChartAccountList.val() == "关闭") {
                template.authCfgGson.isWeixinConnectWifi = 0;
            }
            else {
                template.authCfgGson.isWeixinConnectWifi = 1;
                template.pubMng.weixinAccountName = $g_WeChartAccountList.val();
            }
            if ($('div.button[authType="message"]').hasClass('closed')) {
                template.authCfgGson.isEnableSms = 0;
            }
            else {
                template.authCfgGson.isEnableSms = 1;
            }
            template.authCfgGson.authCfgTemplateName = g_sShopName + (new Date()).getTime();
            template.pubMng.ownerName = FrameInfo.g_user.user;

            function modifyAuthSetting(temp) {
                return $.ajax({
                    type: 'POST',
                    url: MyConfig.v2path + '/authsetting/modify',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify(temp)
                });
            }
            var hPending = Frame.Msg.pending("正在下发配置...")
            modifyAuthSetting(template).done(function (data, textStatus, jqXHR) {
                hPending.close();
                if (data.errorcode != 0) {
                    Frame.Msg.info("配置下发失败", 'error');
                    return;
                }
                Utils.Pages.closeWindow(Utils.Pages.getWindow($('#accredDlg')));
                Frame.Msg.info("配置下发成功");
            }).fail(function () {
                hPending.close();
                Frame.Msg.info("配置下发失败", 'error');
            });
        });

        $('div.button').click(function () {
            $(this).toggleClass('closed');
        });
    }


    function initData() {
        function getDeviceInfo() {
            return $.ajax({
                type: "POST",
                url: MyConfig.v2path + "/getDeviceInfo",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({
                    "tenant_name": FrameInfo.g_user.user,
                    "dev_snlist": [
                        FrameInfo.ACSN
                    ]
                })
            });
        }

        function GetSsisCfg() {
            return $.ajax({
                type: "POST",
                url: MyConfig.path + "/ant/confmgr",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({
                    "configType": 1,
                    "sceneFlag": "true",
                    "sceneType": 2,
                    "userName": FrameInfo.g_user.user,
                    "shopName": g_sShopName,
                    // "cfgTimeout": 10,
                    "cfgTimeout": 60,
                    "cloudModule": "xiaoxiaobeicfg",
                    "deviceModule": "xiaoxiaobei",
                    "method": "GetSsisCfg",
                    "param": [{
                        "userName": FrameInfo.g_user.user,
                        "sceneName": g_sShopName,
                    }]
                })
            }).done(function (data, textStatus, jqXHR) {
                // console.log("地址"+MyConfig.path);
            }).fail(function () {
                console.log("failed to get ssid cfg");
            });
        }

        function initSsidCfg() {
            GetSsisCfg().done(function (data, textStatus, jqXHR) {
                var serviceResult = ("serviceResult" in data) ? data.serviceResult : data.result;
                var manageWiFi = null,
                    businessWiFi = {};
                serviceResult.forEach(function (service) {
                    var spName = service.spName;
                    if (spName == "sp_manage_00") {
                        manageWiFi = service;
                        g_oSsidInfo.sp_manage_00 = service;
                    }
                    else {
                        g_oSsidInfo[spName] = service;
                        businessWiFi[spName] = service;
                    }
                });
                var $spName = $("#manage-wifi div[spName='sp_manage_00']");
                $spName.find(".ssidName").html(manageWiFi.ssidName);
                $spName.find(".securityMode").html(getRcText("SECURITY_MODE").split(",")[manageWiFi.securityMode]);
                if (manageWiFi.status == 0) {
                    $spName.find(".status.openORclose").removeClass("open")
                        .parents(("div[id][class='slide']"))
                        .find(".bg-img").removeClass("wifi-open").addClass("wifi-close");
                }
                else {
                    $spName.find(".status.openORclose").addClass("open")
                        .parents(("div[id][class='slide']"))
                        .find(".bg-img").removeClass("wifi-close").addClass("wifi-open");
                }

                for (var i = 1; i <= 3; i++) {
                    var spName = "sp_visitor_0" + i
                    var ssid = businessWiFi[spName];
                    var $spName = $("#business-wifi div[spName='" + spName + "']");
                    $spName.find(".ssidName").html(ssid.ssidName);
                    $spName.find(".securityMode").html(getRcText("SECURITY_MODE").split(",")[ssid.securityMode]);
                    if (ssid.status == 0) {
                        $spName.find(".status.openORclose").removeClass("open")
                            .parents(("div[id][class='slide']"))
                            .find(".bg-img").removeClass("wifi-open").addClass("wifi-close");
                        //下发配置
                    }
                    else {
                        $spName.find(".status.openORclose").addClass("open")
                            .parents(("div[id][class='slide']"))
                            .find(".bg-img").removeClass("wifi-close").addClass("wifi-open");
                    }
                }
            });
        }

        function initAuth() {
            function initTemplate() {
                return $.ajax({
                    type: 'POST',
                    url: MyConfig.path + '/initserver',
                    contentType: 'application/json',
                    dataType: 'json',
                    timeout:10000,
                    data: JSON.stringify({
                        Method: 'initTemplate',
                        ownerName: FrameInfo.g_user.user,
                        shopName: g_sShopName,
                        devSN: FrameInfo.ACSN,
                        nasID: FrameInfo.Nasid,
                    })
                });
            }

            function getWeChartAccount() {
                return $.ajax({
                    type: "GET",
                    url: MyConfig.v2path + '/weixinaccount/query?ownerName=' + FrameInfo.g_user.user,
                    dataType: 'json',
                }).fail(function () {
                    console.log('faile to get wechartaccount');
                })
            }

            function setButtonStatus(item) {
                var btnList = $('div.button');
                btnList.addClass('closed');
                btnList[1].removeClass('closed');//只开启 一键配置
            }

            function setAuthParam(authCfg, pubMng) {
                if (authCfg.authType == 1) {//一键登录
                    $('div.button[authType="onekey"]').removeClass('closed');
                }
                else {
                    $('div.button[authType="onekey"]').addClass('closed');
                    if (authCfg.isEnableSms == 1) {
                        $('div.button[authType="message"]').removeClass('closed');
                    }
                    else {
                        $('div.button[authType="message"]').addClass('closed');
                    }
                }
                $g_WeChartAccountList.val(pubMng.weixinAccountName);
            }

            var hPending = Frame.Msg.pending("正在获取认证配置...");
            initTemplate().done(function (data, textStatus, jqXHR) {
                hPending.close();
                if (data.errorcode != 0) {
                    return;
                }
                g_oAuthSetting = data.data;
                g_oAuthSetting.isNewAuth = true;
                g_oAuthSetting.isNewTemplate = false;
                //这个会返回所配置模板的信息，到时候直接配置就行了
                getWeChartAccount().done(function (data, textStatus, jqXHR) {
                    if (data.errorcode != 0) {
                        $g_WeChartAccountList.empty();
                        return;
                    }
                    //这里要选出所配置的微信公众号
                    var dom = [];
                    dom.push('<option>关闭</option>');
                    var accounts = data.data;
                    accounts.forEach(function (account) {
                        g_oWeChartAccount[account.name] = account;
                        dom.push('<option>' + account.name + '</option>');
                    });
                    initShopList(accounts[0].name);

                    $g_WeChartAccountList.empty().append(dom.join(''));
                    setAuthParam(g_oAuthSetting.authCfgGson, g_oAuthSetting.pubMng);
                })
            }).fail(function () {
                hPending.close();
                Frame.Msg.info("获取认证配置失败", 'error');
            })
        }
        getDeviceInfo().done(function (data, textStatus, jqXHR) {
            var dev_list = data.dev_list;
            if (dev_list.length == 0) {
                return;
            }
            g_sShopName = dev_list[0].shop_name;
            initSsidCfg();
            initAuth();
        });

    }

    function initShopList(sWechartAccount) {
        function getShoplist(appId, appSecret) {
            return $.ajax({
                type: 'POST',
                url: MyConfig.v2path + '/wifiShop/getShoplist',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    appId: appId,
                    appSecret: appSecret,
                    begin: 0,
                    limit: 50
                })
            });
        }
        var account = g_oWeChartAccount[sWechartAccount];
        getShoplist(account.appId, account.appSecret).done(function (data, textStatus, jqXHR) {
            if (data.errcode != 0) {
                $g_ShopNameList.empty();
                return;
            }

            var dom = [];
            var shopList = data.business_list;
            console.log(shopList);
            shopList.forEach(function (shop) {
                dom.push('<option>' + shop.base_info.business_name + '</option><option>关闭</option>');
            });
            $g_ShopNameList.empty().append(dom.join(''));
        })
    }

    function _init() {
        initGrid();
        initData();
    }

    function _destroy() {

    }

    function _resize() {

    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["Minput", "SingleSelect"],

        "utils": ["Base"]
    });

})(jQuery);
