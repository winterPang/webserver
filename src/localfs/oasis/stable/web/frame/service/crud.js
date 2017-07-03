define(['app'], function (mainApp) {
    mainApp.factory('$CRUDService', ['$http', '$state', '$alertService', function ($http, $state, $alertService) {
        var config = {
            headers: {'Content-Type': 'application/json'},
            responseType: 'json'
        };

        // 请求前缀
        var URL_PREFIX = '/v3/ace/o2oportal/';
        // 获取单个对象操作，url：后台处理请求url，id：主键
        var get = function (url, id) {
            if (!id) {
                return $http.get(url, {});
            } else {
                return $http.get(url + '/' + id, {});
            }
        };
        //POST
        var post = function (url, params) {
            return $http.post(url, JSON.stringify(params), config);
        };
        //PUT
        var put = function (url, params) {
            return $http.put(url, JSON.stringify(params), config);
        };

        // 带参数的分页查询
        var query = function (url, params) {
            return $http.post(url, params);
        };

        // 增加操作，url：后台处理请求url，model：提交的数据对象
        var add = function (url, model, backurl) {
            post(url, model).success(function (response) {
                if (response.code == 0) {
                    $alertService.noticeSuccess(response.message);
                    backurl && $state.go(backurl, {}, {reload: true});
                } else {
                    $alertService.notice(response.message);
                }
            });
        };

        // 修改操作，url：后台处理请求url，model：提交的数据对象
        var modify = function (url, model, backurl) {
            put(url, model).success(function (response) {
                if (response.code == 0) {
                    $alertService.noticeSuccess(response.message);
                    backurl && $state.go(backurl, {}, {reload: true});
                } else {
                    $alertService.notice(response.message);
                }
            });
        };

        // 带通用confirm删除操作,uri:后台请求url，id：主键
        var deleteConfirm = function (url, id, backurl) {
            $alertService.confirm('是否删除这条数据？', function () {
                $http.delete(url + '/' + id, config).success(function (response) {
                    if (response.code == 0) {
                        $alertService.noticeSuccess(response.message);
                        backurl && $state.go(backurl, {}, {reload: true});
                    } else {
                        $alertService.notice(response.message);
                    }
                });
            });
        };

        // 不带通用confirm删除操作,uri:后台请求url，id：主键
        var deleteNoConfirm = function (url, id, backurl) {
            $http.delete(url + '/' + id, {}).success(function (response) {
                if (response.code == 0) {
                    $alertService.noticeSuccess(response.message);
                    backurl && $state.go(backurl, {}, {reload: true});
                } else {
                    $alertService.notice(response.message);
                }
            });
        };
        return {
            query: function (url, params) {
                return query(URL_PREFIX + url, params);
            },
            get: function (url, id) {
                return get(URL_PREFIX + url, id);
            },
            post: function (url, params) {
                return post(URL_PREFIX + url, params);
            },
            put: function (url, params) {
                return put(URL_PREFIX + url, params);
            },
            add: function (url, model, backurl) {
                add(URL_PREFIX + url, model, backurl);
            },
            modify: function (url, model, backurl) {
                modify(URL_PREFIX + url, model, backurl);
            },
            deleteNoConfirm: function (url, id, backurl) {
                deleteNoConfirm(URL_PREFIX + url, id, backurl);
            },
            deleteConfirm: function (url, id, backurl) {
                deleteConfirm(URL_PREFIX + url, id, backurl);
            }
        };
    }]);
});
