define(function() {

    var localeAll = {
        cn: {
            REQUEST_ERR: '请求出错了'
        }
    };

    var locale = localeAll['cn'];

    function Resource($q, $http) {
        this.q = $q;
        this.http = $http;
    }

    Resource.fn = Resource.prototype = {
        constructor: Resource,
        URL_GET_STATUS: '/base/getDevs', // 获取在线状态
        URL_EXIST_DEVSN: '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/isExistDevice/#devSN#', // GET
        URL_ADD_DEVICE: '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/shopdevices2', //POST
        URL_DEL_DEVICE: '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/shopdevices/#devId#',
        URL_EDIT_DEVICE: '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/devicealias', //PUT
        URL_QUERY_DEVICE_REGION: '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/regiondevices/#id#',
        URL_QUERY_DEVICE: '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/shopdevices2/#id#' // GET
    };

    /**
     * 根据区域去查找设备
     * @param id  区域id
     */
    Resource.fn.getDevicesByRegion = function(id) {
        var defer = this.q.defer(),
            http = this.http;
        http.get(this.URL_QUERY_DEVICE_REGION.replace('#id#', id)).then(function(resp) {
            if (resp && resp.data) {
                var data = resp.data;
                if (data.code === 0) {
                    defer.resolve($.map(data.data, function(dev) {
                        dev.id = dev.deviceId;
                        return dev;
                    }));
                } else {
                    defer.reject(data.message);
                }
            } else {
                defer.reject(locale.REQUEST_ERR);
            }
        }).catch(function(err) {
            defer.reject(locale.REQUEST_ERR);
        });
        return defer.promise;
    };
    /**
     * 根据场所获取设备列表
     * @param id 场所id或者区域id
     * @param type 类型   shop | region
     * @return {Promise}
     */
    Resource.fn.getDevicesByShop = function(id) {
        var defer = this.q.defer(),
            http = this.http;
        http.get(this.URL_QUERY_DEVICE.replace('#id#', id)).then(function(resp) {
            if (resp && resp.data) {
                var data = resp.data;
                if (data.code === 0) {
                    var list = [];
                    $.each(data.data, function(i, group) {
                        list = list.concat($.map(group.devices, function(dev) {
                            dev.groupId = group.groupId;
                            dev.groupName = group.groupName;
                            dev.groupType = group.groupType;
                            return dev;
                        }));
                    });
                    defer.resolve(list);
                } else {
                    defer.reject(data.message);
                }
            } else {
                defer.reject(locale.REQUEST_ERR);
            }
        }).catch(function(err) {
            defer.reject(locale.REQUEST_ERR);
        });
        return defer.promise;
    };
    /**
     * 删除设备
     */
    Resource.fn.delDevice = function(devId) {
        var defer = this.q.defer(),
            http = this.http;
        http.delete(this.URL_DEL_DEVICE.replace('#devId#', devId)).then(function(resp) {
            if (resp && resp.data) {
                var data = resp.data;
                if (data.code === 0) {
                    defer.resolve();
                } else {
                    defer.reject(data.message);
                }
            } else {
                defer.reject(locale.REQUEST_ERR);
            }
        }).catch(function(err) {
            defer.reject(locale.REQUEST_ERR);
        });
        return defer.promise;
    };

    /**
     * 获取设备的在线信息
     */
    Resource.fn.getStatus = function(devsns) {
        var defer = this.q.defer(),
            http = this.http;
        http.post(this.URL_GET_STATUS, { devSN: devsns }).then(function(resp) {
            if (resp && resp.data) {
                var data = resp.data;
                if (data.detail) {
                    //  将设备在线状态拼接为  {devsn:status}的形式
                    var result = {};
                    $.each(data.detail, function(i, sta) {
                        result[sta.devSN] = sta.status;
                    });
                    defer.resolve(result);
                } else {
                    defer.resolve({});
                }
            } else {
                defer.reject(locale.REQUEST_ERR);
            }
        }).catch(function(err) {
            defer.reject(locale.REQUEST_ERR);
        });
        return defer.promise;
    };

    /**
     * 修改设备别名
     * @param id 设备id
     * @param shopId 场所id
     * @param alias 修改后的别名
     */
    Resource.fn.editAlias = function(id, shopId, alias) {
        var defer = this.q.defer(),
            http = this.http;
        http.put(this.URL_EDIT_DEVICE, {
            'devAlias': alias,
            'id': id,
            'shopId': shopId
        }).then(function(resp) {
            if (resp && resp.data) {
                var data = resp.data;
                if (data.code === 0) {
                    defer.resolve();
                } else {
                    defer.reject(data.message);
                }
            } else {
                defer.reject(locale.REQUEST_ERR);
            }
        }).catch(function(err) {
            defer.reject(locale.REQUEST_ERR);
        });
        return defer.promise;
    }
    return Resource;
});