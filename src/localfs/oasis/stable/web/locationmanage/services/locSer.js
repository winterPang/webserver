define(['angularAMD'],function (app) {
    app.factory('locSer',function ($http) {
        var prefix = '/v3/ace/oasis/oasis-rest-location/restapp';
        var probe = '/v3/ace/oasis/oasis-rest-probe/restapp';
        var emBedde = '/v3/ace/oasis/oasis-embedded-location/restapp';

        var path = {
            getLocationByShop: prefix + '/map/getlocationbyshop/',      // + shopId
            queryRealTimeClient:prefix + '/client/queryrealtimeclient',
            queryClientStep:prefix + '/client/queryclientstep',
            queryApLocation:prefix + '/location/queryaplocation/',      // + shopId
            savelocationElement:prefix + '/location/savelocationelement',
            queryApinfo:prefix + '/location/queryapinfo/',              // + shopId
            queryCycle:prefix + '/shop/querycycle/',                    // + shopId,
            queryLocationById:prefix + '/map/querylocationbyid/',       // + locationId
            queryLocationClient:prefix + '/client/querylocationclient/', // + locationId
            delMapByLocationId:prefix + '/map/deletelocationbyid/',
            modifyScale:prefix + '/map/modifyscale'
        };
        var probePath = {
            getLocationByShop: probe + '/map/getlocationbyshop/',      // + shopId
            queryRealTimeClient:probe + '/client/queryrealtimeclient',
            queryClientStep:probe + '/client/queryclientstep',
            queryApLocation:probe + '/location/queryaplocation/',      // + shopId
            savelocationElement:probe + '/editeprobe/savelocationelement',
            queryApinfo:probe + '/editeprobe/getprobeap/',              // + shopId
            queryCycle:probe + '/shop/querycycle/',                    // + shopId,
            queryLocationById:probe + '/map/querylocationbyid/',       // + locationId
            queryLocationClient:probe + '/editeprobe/getprobeclient/', // + locationId
            delMapByLocationId:probe + '/map/deletelocationbyid/',
            modifyScale:probe + '/map/modifyscale'
        };
        var emBeddePath = {
            getLocationByShop: emBedde + '/map/getlocationbyshop/',      // + shopId
            queryRealTimeClient:emBedde + '/client/queryrealtimeclient',
            queryClientStep:emBedde + '/client/queryclientstep',
            queryApLocation:emBedde + '/location/queryaplocation/',      // + shopId
            savelocationElement:emBedde + '/location/savelocationelement',
            queryApinfo:emBedde + '/location/queryapinfo/',              // + shopId
            queryCycle:emBedde + '/shop/querycycle/',                    // + shopId,
            queryLocationById:emBedde + '/map/querylocationbyid/',       // + locationId
            queryLocationClient:emBedde + '/client/querylocationclient/', // + locationId
            delMapByLocationId:emBedde + '/map/deletelocationbyid/',
            modifyScale:emBedde + '/map/modifyscale'
        }
        return [
                {
                    getLocationByShop:function (shopId) {
                        return $http({
                            method:'GET',
                            url:path.getLocationByShop + shopId
                        })
                    },
                    queryRealTimeClient:function (data) {
                        return $http({
                            method:'POST',
                            url:path.queryRealTimeClient,
                            data:data
                        })
                    },
                    queryClientStep:function (data) {
                        return $http({
                            method:'POST',
                            url:path.queryClientStep,
                            data:data
                        })
                    },
                    queryApLocation:function (shopId) {
                        return $http({
                            method:'GET',
                            url:path.queryApLocation + shopId
                        })
                    },
                    savelocationElement:function (data) {
                        return $http({
                            method:'POST',
                            url:path.savelocationElement,
                            data:data,
                            timeout:10000
                        })
                    },
                    queryApinfo:function (shopId) {
                        return $http({
                            method:'GET',
                            url:path.queryApinfo + shopId
                        })
                    },
                    queryCycle:function (shopId) {
                        return $http({
                            method:'GET',
                            url:path.queryCycle + shopId
                        })
                    },
                    queryLocationById:function (locationId) {
                        return $http({
                            method:'GET',
                            url:path.queryLocationById + locationId
                        })
                    },
                    queryLocationClient:function (locationId) {
                        return $http({
                            method:'GET',
                            url:path.queryLocationClient + locationId
                        })
                    },
                    delMapByLocationId:function (locationId) {
                        return $http({
                            method:'DELETE',
                            url:path.delMapByLocationId + locationId
                        })
                    },
                    modifyScale:function (data) {
                        return $http({
                            method:'POST',
                            url:path.modifyScale,
                            data:data
                        })
                    }
                },
                {
                    getLocationByShop:function (shopId) {
                        return $http({
                            method:'GET',
                            url:probePath.getLocationByShop + shopId
                        })
                    },
                    queryRealTimeClient:function (data) {
                        return $http({
                            method:'POST',
                            url:probePath.queryRealTimeClient,
                            data:data
                        })
                    },
                    queryClientStep:function (data) {
                        return $http({
                            method:'POST',
                            url:probePath.queryClientStep,
                            data:data
                        })
                    },
                    queryApLocation:function (shopId) {
                        return $http({
                            method:'GET',
                            url:probePath.queryApLocation + shopId
                        })
                    },
                    savelocationElement:function (data) {
                        return $http({
                            method:'POST',
                            url:probePath.savelocationElement,
                            data:data,
                            timeout:10000
                        })
                    },
                    queryApinfo:function (shopId) {
                        return $http({
                            method:'GET',
                            url:probePath.queryApinfo + shopId
                        })
                    },
                    queryCycle:function (shopId) {
                        return $http({
                            method:'GET',
                            url:probePath.queryCycle + shopId
                        })
                    },
                    queryLocationById:function (locationId) {
                        return $http({
                            method:'GET',
                            url:probePath.queryLocationById + locationId
                        })
                    },
                    queryLocationClient:function (locationId) {
                        return $http({
                            method:'GET',
                            url:probePath.queryLocationClient + locationId
                        })
                    },
                    delMapByLocationId:function (locationId) {
                        return $http({
                            method:'DELETE',
                            url:probePath.delMapByLocationId + locationId
                        })
                    },
                    modifyScale:function (data) {
                        return $http({
                            method:'POST',
                            url:probePath.modifyScale,
                            data:data
                        })
                    }
                },
                {
                getLocationByShop:function (shopId) {
                    return $http({
                        method:'GET',
                        url:emBeddePath.getLocationByShop + shopId
                    })
                },
                queryRealTimeClient:function (data) {
                    return $http({
                        method:'POST',
                        url:emBeddePath.queryRealTimeClient,
                        data:data
                    })
                },
                queryClientStep:function (data) {
                    return $http({
                        method:'POST',
                        url:emBeddePath.queryClientStep,
                        data:data
                    })
                },
                queryApLocation:function (shopId) {
                    return $http({
                        method:'GET',
                        url:emBeddePath.queryApLocation + shopId
                    })
                },
                savelocationElement:function (data) {
                    return $http({
                        method:'POST',
                        url:emBeddePath.savelocationElement,
                        data:data,
                        timeout:10000
                    })
                },
                queryApinfo:function (shopId) {
                    return $http({
                        method:'GET',
                        url:emBeddePath.queryApinfo + shopId
                    })
                },
                queryCycle:function (shopId) {
                    return $http({
                        method:'GET',
                        url:emBeddePath.queryCycle + shopId
                    })
                },
                queryLocationById:function (locationId) {
                    return $http({
                        method:'GET',
                        url:emBeddePath.queryLocationById + locationId
                    })
                },
                queryLocationClient:function (locationId) {
                    return $http({
                        method:'GET',
                        url:emBeddePath.queryLocationClient + locationId
                    })
                },
                delMapByLocationId:function (locationId) {
                    return $http({
                        method:'DELETE',
                        url:emBeddePath.delMapByLocationId + locationId
                    })
                },
                modifyScale:function (data) {
                    return $http({
                        method:'POST',
                        url:emBeddePath.modifyScale,
                        data:data
                    })
                }
            },
        ]
    })
});