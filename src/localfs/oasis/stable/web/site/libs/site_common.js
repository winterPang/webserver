/**
 * Created by Administrator on 2017/4/25.
 */
define(['jquery', 'utils'], function ($, Utils) {
    var SiteCommon = function (config) {
        if (this instanceof SiteCommon) {
            for (var key in config) {
                this[key] = config[key];
            }
        } else {
            return new SiteCommon(config);
        }
    };

    SiteCommon.urls = {
        URL_GET_SITES_LIST: '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/shops?queryCondition=%s',
        URL_DELETE_SITE: '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/shops/%d',
        MANAGE_URL_TEMPLATE: "https://" + location.hostname + "/oasis/stable/web/frame/index.html#/scene15/nasid%d/devsn%s/content%stopName%s/monitor/dashboard15",
        MAINTENANCE_URL_TEMPLATE: "https://" + location.hostname + "/oasis/stable/web/frame/index.html#/scene88/nasid%s/devsn%s/content/monitor/dashboard88",
        NO_DEVICES_URL: "https://" + location.hostname + "/oasis/stable/web/frame/index.html",
        URL_GET_DEV_LIST: '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/shopdevices2/%d',
        URL_DELETE_DEV: '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/shopdevices/%s',
        URL_POST_MODIFY_DEV_ALIAS: '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/devicealias',
        URL_ISEXIST_SAME_DEVSN: '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/deviceSnExisted/%s',
        URL_GET_IRFDEVS: '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/getirfdevs?dev_sn=%s',
        URL_AP_GROUP: '/v3/cloudapgroup',
        URL_GET_DEVICES_STATUS: '/base/getDevs',
        URL_POST_ADD_DEV: '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/shopdevices2'
    };
    SiteCommon.tableCommonOption = {
        pageList: [8, 10, 25, 50, 100],
        pageSize: 8,
        extraCls: 'new_style_170413_table',
        tips: {
            operates_tip: '点击显示操作列'
        },
        icons: {
            operates_tip: 'fa fa-show_operates'
        },
        operateWidth: 100
    };

    return SiteCommon;
});