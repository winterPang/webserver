/**
 * @author  zhangfuqiang
 * @description 微信门店公共功能抽取
 */
define(['jquery', 'utils'], function ($, utils) {
    var lang = utils.getLang();
    var locale = {
        en: {
            1: 'System Error',
            2: 'Examining',
            3: 'Tencent-verified',
            4: 'Examine Reject'
        },
        cn: {
            1: '系统错误',
            2: '审核中',
            3: '审核通过',
            4: '审核驳回'
        }
    };
    return {
        /**
         * 格式化 当前状态信息
         * @param status  状态码
         * @returns {*} 状态文本
         */
        formatStatus: function (status) {
            status = Number(status) || 0;
            return locale[lang][String(status)];
        },
        /**
         * 拼接 record
         * @param wifi
         * @param shop
         * @returns {*}
         */
        concatRecord: function (wifi, shop) {
            var me = this;
            if ($.isArray(wifi) && $.isArray(shop)) {
                $.each(wifi, function (i, w) {
                    $.each(shop, function (i, s) {
                        var shopName = s.business_name;
                        if (s.branch_name) {
                            shopName = shopName + '(' + s.branch_name + ')';
                        }
                        if (shopName == w.shop_name && s.accountName == w.accountName) {
                            w = $.extend(true, w, s);
                            w.statusText = me.formatStatus(w.available_state);
                        }
                    })
                });
                return wifi;
            }
            return [];
        },
        executeError: function (e) {
            console.info(e);
        }
    };
});