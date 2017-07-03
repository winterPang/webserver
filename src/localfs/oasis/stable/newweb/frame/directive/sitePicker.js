/**
 * 这是一个场所选择的插件，支持初始值的绑定和点击事件的绑定
 * 
 * @example 
 * <site-picker allow-click-region os-label="场所" os-click="changeSite($info)" os-value="352331" os-model="shopInfo"></site-picker>
 * 
 * @param allow-click-region  允许点击区域节点，作用是可以选择区域，默认只可以选择场所
 * @param os-label  显示在左边的label标签，不配置不显示
 * @param os-click  节点点击事件的处理，里面有一个参数，名称必须是$info（存储是点击的节点的信息，也就是os-model的信息），和ngclick的$event类似
 * @param os-value  初始化的时候的值，是一个场所id或者是区域id
 * @param os-model  需要双向展示的点击的节点的信息
 * @param os-loaded 默认选中的时候调用
 * 
 * os-model的格式如：{"id":3557,"name":"智能云专用-邱慧","type":"region",regionName:'',regionId:''}   type：shop|region
 */
define(['angularAMD',
    'text!./template/sitePicker.html',
    'jqueryZtree',
    'css!ztree_css',
    'css!frame/directive/template/sitePicker'
], function(app, tpl) {

    // 要实现的功能
    // 1、如果只有一个场所或者一个设备要求选中这个场所或设备
    // 2、切换到其他的页面需要记录本次切换的url

    // 实现原理
    // 在route的规则存储上shopId和devSN,在下次打开页面的时候将值绑定上去
    // 组件需要支持setValue类似的功能

    /**
     * 实例化资源
     * @param http http 请求，使用$http实例
     * @param q Promise 实现，使用$q库
     * @constructor
     */
    function Resource(http, q) {
        this.http = http;
        this.q = q;
    }

    //  获取区域的信息
    Resource.prototype.URL_GET_TREE = '/v3/ace/oasis/oasis-rest-shop/restshop/regioninfo/regions';
    //  获取场所信息
    Resource.prototype.URL_GET_SHOP = '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/getallshopsofuser';
    // Resource.prototype.URL_GET_SHOP = '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/shops?queryCondition=&start=1&size=10000';
    /**
     * @description 获取所有的区域信息
     * @return {Promise}
     */
    Resource.prototype.getRegions = function() {
        var defer = this.q.defer(),
            http = this.http;
        http.get(this.URL_GET_TREE).then(function(resp) {
            if (resp && resp.data) {
                if (resp.data.code === 0) {
                    defer.resolve(resp.data.data);
                } else {
                    defer.reject(resp.data.message);
                }
            } else {
                defer.reject('请求出错');
            }
        }).catch(function() {
            defer.reject('请求出错');
        });
        return defer.promise;
    };

    /**
     * 获取场所的信息
     * @return {Promise}
     */
    Resource.prototype.getShops = function() {
        var defer = this.q.defer(),
            http = this.http;
        http.get(this.URL_GET_SHOP).then(function(resp) {
            if (resp && resp.data) {
                if (resp.data.code === 0) {
                    defer.resolve(resp.data.data);
                } else {
                    defer.reject(resp.data.message);
                }
            } else {
                defer.reject('请求出错');
            }
        }).catch(function(err) {
            defer.reject('请求出错');
        });
        return defer.promise;
    };

    /**
     * 显示面板
     * @param {*} offset 在window的偏移量 
     */
    function expandPanel(offset) {
        this.css({
            top: parseFloat(offset.top) + 31 + 'px',
            left: offset.left
        }).show();
    }

    var factory = ['$q', '$http', function($q, $http) {
        var res = new Resource($http, $q);
        return {
            scope: {
                osLabel: '@',
                osValue: '@', // 只能绑定一次
                osClick: '&',
                osLoaded: '&',
                osModel: '='
            },
            restrict: 'E',
            replace: true,
            template: tpl,
            link: function(scope, ele, attr) {
                var siteComboId = 'site_' + Math.random().toString(16).substr(2);
                var allowClickRegion = attr.allowClickRegion !== undefined;
                var autoSelect = attr.autoSelect !== undefined; // 自动选择第一个
                var clickEvent = scope.osClick || $.noop;
                var loadEvent = scope.osLoaded || $.noop;
                var value = scope.osValue || null;

                var $panel = $('.tree-dropdown', ele);
                var $tree = $('.ztree', $panel);
                var $siteCombo = $('input:first', ele);

                var ztree = null;

                //  事件绑定
                $siteCombo.on('focus click').on('focus click', function() {
                    var offset = $siteCombo.position();
                    expandPanel.bind($panel)(offset);
                });

                /**
                 * 点击外面时候触发
                 * @param {*} e 事件本身
                 */
                function outerClick(e) {
                    if (!($(ele).find(e.target).length || $(ele).is(e.target))) {
                        $panel.hide();
                        e.stopPropagation();
                    }
                };

                $(document).off('click', outerClick).on('click', outerClick);

                //  事件绑定完成

                scope.siteComboId = siteComboId;

                //  存储导出的信息
                scope.osModel = {
                    id: null,
                    name: null,
                    type: 'shop',
                    regionId: '', //  分支id，如果type === 'region'  regionId === id ,regionName === name
                    regionName: '' //  分支name
                };

                // 局部存储region的信息 {regionID:regionName}
                var regionIdNameObj = {};

                // tree配置
                var treeOption = {
                    data: {
                        keep: {
                            leaf: true,
                            parent: true
                        },
                        simpleData: {
                            enable: true,
                            idKey: 'id',
                            pIdKey: 'parentId',
                            rootPId: null
                        }
                    },
                    callback: {
                        onClick: function(e, tId, tNode) {
                            //  允许点击区域，并且点击的是区域
                            if (allowClickRegion && tNode.isParent) {
                                scope.osModel.id = tNode.nodeId;
                                scope.osModel.name = tNode.name;
                                scope.osModel.regionId = tNode.nodeId;
                                scope.osModel.regionName = tNode.name;
                                $panel.hide();
                                scope.osModel.type = 'region';
                                if (!scope.$$phase) {
                                    scope.$apply();
                                }
                                clickEvent({ $info: scope.osModel });
                                return;
                            }
                            if (!tNode.isParent) {
                                scope.osModel.id = tNode.nodeId;
                                scope.osModel.name = tNode.name;
                                scope.osModel.regionId = tNode.regionId;
                                scope.osModel.regionName = regionIdNameObj[tNode.regionId];
                                $panel.hide();
                                scope.osModel.type = 'shop';
                                if (!scope.$$phase) {
                                    scope.$apply();
                                }
                                clickEvent({ $info: scope.osModel });
                            }
                        }
                    }
                };

                // 开始加载ztree
                $q.all([res.getRegions(), res.getShops()]).then(function(r) {
                    var regions = r[0],
                        shops = r[1];
                    regionIdNameObj = {};
                    //  拼接场所的信息和区域的信息用来展示tree
                    var treeData = $.map(regions, function(reg) {
                        reg.nodeId = reg.id;
                        reg.isParent = true;
                        //  存储regionId和name
                        regionIdNameObj[reg.id] = reg.name;
                        return reg;
                    }).concat($.map(shops, function(shop) {
                        shop.id = 'shop_' + shop.shopId;
                        shop.nodeId = shop.shopId;
                        shop.parentId = shop.regionId;
                        shop.name = shop.shopName;
                        return shop;
                    }));
                    // alert($tree.length)
                    ztree = $.fn.zTree.init($tree, treeOption, treeData);
                    //  显示初始化的场所或者区域
                    if (value) {
                        //  给文本框赋值
                        var node = ztree.getNodeByParam('nodeId', value);
                        if (node) {
                            scope.osModel.id = node.nodeId;
                            scope.osModel.name = node.name;
                            scope.osModel.type = node.isParent ? 'region' : 'shop';
                        }
                    } else if (shops.length && (shops.length === 1 || autoSelect)) {
                        //  如果只有一个场所就显示该场所
                        scope.osModel.id = shops[0].shopId;
                        scope.osModel.name = shops[0].shopName;
                        scope.osModel.type = 'shop';

                        loadEvent({ $info: scope.osModel });
                    }
                }).catch(function(err) {
                    console.error(err);
                });
                // ztree加载完成
            }
        };
    }];

    app.directive('sitePicker', factory);
});