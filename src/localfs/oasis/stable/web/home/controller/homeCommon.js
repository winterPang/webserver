define(['jquery', 'utils'], function ($, Utils) {
    // function getRcString(attrName) {
    //             // return Utils.getRcString("home_rc", attrName);
    //             return $('#home_rc').attr(attrName);
    // }
    // debugger
    var HomeCommon = function (config) {
        if (this instanceof HomeCommon) {
            for (var key in config) {
                this[key] = config[key];
            }
        } else {
            return new HomeCommon(config);
        }
    };
    HomeCommon.locale = {
        addDevTitle: [],
        errorMsg: ''
    };
    // URL整理
    var url = {
        URL_POST_ADD_SITE: '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/addShop',  //  添加场所
        URL_POST_ADD_DEV: '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/shopdevices2',  //  添加设备
        URL_DELETE_DEV: '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/shopdevices/%s',  // 删除设备
        URL_DELETE_AREA: '/v3/ace/oasis/oasis-rest-shop/restshop/regioninfo/regions/', //  删除区域
        URL_ADD_AREA: '/v3/ace/oasis/oasis-rest-shop/restshop/regioninfo/regions',  //  新增区域
        URL_MODIFY_AREA: '/v3/ace/oasis/oasis-rest-shop/restshop/regioninfo/regions',  //  修改区域
        URL_GET_TREE: '/v3/ace/oasis/oasis-rest-shop/restshop/regioninfo/regions',  //  显示区域树
        URL_POST_MODIFY_SHOP: '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/modifyShop',  //  修改场所
        URL_GET_ALL_INDUSTRY_NAME: '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/getAllIndustryName',  //  获取所属行业
        URL_VALID_SHOP_NAME: '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/isExistSameShopWithUser/',  //  验证场所名称是否存在
        // TODO  添加设备接口
        URL_ADD_MULTI_DEVICE: 'test.json',  //  添加多个设备
        URL_CHECK_DEVSN_EXIST: '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/isExistDevice/',  // 检查设备是否存在
        URL_NO_DEVICE_URL: 'https://' + location.hostname + '/oasis/stable/web/frame/index.html',
        URL_GET_IRFDEVS: '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/getirfdevs?dev_sn=%s',
        URL_GET_DEVICES_STATUS: '/base/getDevs'
    };
    var table = {
        //   支持的设备型号列表
        devModelSupportList: {
            tId: 'devModelList',
            totalField: 'data.rowCount',
            dataField: 'data.data',
            sortField: 'orderby',
            orderField: 'ascending',
            showPageList: false,
            pageSize: 8,
            columns: [
                {sortable: true, field: 'dModel', title: 'aaa'}
            ],
            formatShowingRows: function () {
                return '';
            },
            sidePagination: 'server'
        },
        //   已经添加设备列表
        devModelList: {
            tId: 'addDev',
            pageSize: 4,
            showPageList: false,
            columns: [ // 分组名称 设备序列号 设备别名 删除
                {field: 'groupName', title: HomeCommon.locale.addDevTitle[0]},
                {field: 'devSn', title: HomeCommon.locale.addDevTitle[1]},
                {field: 'devAlias', title: HomeCommon.locale.addDevTitle[2]},
                {
                    field: 'del',
                    title: HomeCommon.locale.addDevTitle[3],
                    render: '<a style="cursor:pointer;">' + HomeCommon.locale.addDevTitle[3] + '</a>'
                }
            ]
        },
        //    完成后显示的设备列表
        devModelResultList: {
            tId: 'addDev',
            pageSize: 4,
            showPageList: false,
            columns: [
                {field: 'groupName', title: HomeCommon.locale.addDevTitle[0]},
                {field: 'devSn', title: HomeCommon.locale.addDevTitle[1]},
                {field: 'devAlias', title: HomeCommon.locale.addDevTitle[2]}
            ]
        }
    };

    function initLocale(locale) {
        table.devModelSupportList.columns = [
            {sortable: true, field: 'dModel', title: locale.supportText}
        ];
        table.devModelList.columns = [ // 分组名称 设备序列号 设备别名 删除
            {field: 'groupName', title: locale.addDevTitle[0]},
            {field: 'devSn', title: locale.addDevTitle[1]},
            {field: 'devAlias', title: locale.addDevTitle[2]},
            {
                field: 'del',
                title: locale.addDevTitle[3],
                render: '<a style="cursor:pointer;">' + locale.addDevTitle[3] + '</a>'
            }
        ];
        table.devModelResultList.columns = [
            {field: 'groupName', title: locale.addDevTitle[0]},
            {field: 'devSn', title: locale.addDevTitle[1]},
            {field: 'devAlias', title: locale.addDevTitle[2]}
        ];
        HomeCommon.table = table;
        return HomeCommon;
    }

    /**
     * 在数组中是否存在对应的数据
     * @param arr  数组
     * @param item  单个子元素
     * @param key  如果是对象，重复key值对应的字段
     * @returns {boolean}
     */
    function isInArray(arr, item, key) {
        if (!arr || !item) {
            return false;
        }
        var result = false;
        $.each(arr, function () {
            var obj = this;
            if (typeof obj == 'object' && key) {
                if (obj[key] == item[key]) {
                    result = true;
                    return false;
                }
            } else if (item == obj) {
                result = true;
                return false;
            }
        });
        return result;
    }

    /**
     * 检查sn是否存在，先检查数组在检查后台
     * @param arr  数组
     * @param val  sn号
     *
     * @return {promise}  存在resolve，不存在reject
     */
    function checkSnIsExist(arr, val) {
        var defer = this.$q.defer();
        if (isInArray(arr, {devSn: val}, 'devSn')) {
            defer.reject();
        } else {
            this.$http.get(url.URL_CHECK_DEVSN_EXIST + val).success(function (data) {
                if (data && data.code == 0 && data.data == 0) {
                    defer.resolve();
                } else {
                    defer.reject(data.message);
                }
            }).error(function () {
                defer.reject(HomeCommon.locale.errorMsg);
            });
        }
        return defer.promise;
    }

    HomeCommon.url = url;
    HomeCommon.table = table;
    HomeCommon.isInArray = isInArray;
    HomeCommon.initLocale = initLocale;
    // 实例方法
    HomeCommon.prototype.checkSnIsExist = checkSnIsExist;
    return HomeCommon;
});