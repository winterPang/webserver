define(["angularAMD"], function (app) {
    /**
     * 侧边栏收起及展开
     *    1、实现收起展开
     *    2、采用angular事件传递
     */

    function animate(ele, to, callback){
        ele.stop().animate(to, callback)
    }

    function show_hide(ele, to) {
        ele[to]()
    }

    function visibility(ele, to) {
        ele.css('visibility', to)
    }
    app.directive('bsSidebar', function () {
        return {
            restrict :'A',
            link :function (s,ele){
                console.log('link side_bar');
                if(ele instanceof $){
                    ele = $(ele)
                }
                var menu  = ele,
                    main = $('.oasis-main-content'),
                    unbind = [];
                // events that need to be unbind;
                unbind[0] = s.$on('bs.side.expend', function () {
                    var spans = ele.find('span'),
                        title = ele.find('.oasis-menu-title');
                    show_hide(spans, 'show');
                    visibility(title, 'visible');
                    animate(main, {'marginLeft': 220});
                    animate(menu, {width: 220})
                });
                unbind[1] = s.$on('bs.side.collapse', function () {
                    var spans = ele.find('span'),
                        title = ele.find('.oasis-menu-title');
                    animate(main, {'marginLeft': 52});
                    animate(menu, {width: 52}, function () {
                        show_hide(spans, 'hide');
                        visibility(title, 'hidden');
                    })
                });

                // watch $destroy iterate the unbind array
                s.$on('$destroy', function () {
                    console.log('destroy unbind');
                    unbind.forEach(function (item) {
                        if(typeof item === 'function'){
                            item()
                        }
                    })
                })
            }
        }
    })


});