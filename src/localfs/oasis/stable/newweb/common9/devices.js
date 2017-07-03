/**
 * @description 场景9的公共方法，FAT-AP专属
 * @author zhangfuqiang
 * @createdate 2017/3/29
 *
 *
 */
define(['jquery'], function ($) {
    var URL_GET_DEVICES = '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/shopdevices2/';

    /**
     * @description 获取指定场所下的所有设备列表
     * @param shopId  场所ID
     * @return  [Promise]
     * @example 数据格式是Array   [devInfo,devInfo,....]
     */
    function getInfos(shopId) {
        var defer = $.Deferred();
        $.getJSON(URL_GET_DEVICES + shopId)
            .done(function (data) {
                var devs = [];
                if (data && data.code === 0) {
                    $.each(data.data, function (i, g) {
                        // g 是分组的信息
                        $.each(g.devices, function (i, d) {
                            //  d是设备的信息，需要合并配置
                            devs.push($.extend(true, {}, d, {groupId: g.groupId}));
                        });
                    });
                    defer.resolve(devs);
                } else {
                    defer.resolve([]);
                }
            })
            .fail(function () {
                defer.resolve([]);
            });
        return defer.promise();
    }

    /**
     * @description 获取指定场所下的所有的设备SN和Alias键值对
     * @param shopId
     * @return  [Promise]
     * @example  数据样例
     *
     * {
     *      sn:alias,
     *      ......
     * }
     */
    function getAlias(shopId) {
        var defer = $.Deferred();
        getInfos(shopId)
            .done(function (data) {
                var devObj = {};
                $.each(data, function (i, d) {
                    devObj[d.devSn] = d.devAlias;
                });
                defer.resolve(devObj);
            });
        return defer.promise();
    }

    return {
        getInfos: getInfos,
        getAlias: getAlias
    }
});