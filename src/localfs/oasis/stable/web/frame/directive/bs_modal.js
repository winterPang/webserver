define(['jquery', 'app', 'frame/directive/lang/bs_modal'], function ($, app, modalLang) {
    app.directive('bsModal', ['$rootScope', function ($rootScope) {

        var lang = modalLang[$rootScope.lang];
        // 动画时长，毫秒
        var animateInterval = 300;
        var DEFAULTS = {
            mId: '', //  唯一的id
            title: lang.promptTitle,  // 标题
            showHeader: true,
            showFooter: true,
            bodyHeight: undefined,  //   主体高度
            bodyMaxHeight: 600,  //   模态框主体高度
            modalSize: 'normal',  //  模态框的尺寸
            autoClose: true,  // 是否自动关闭
            showOk: true,  //  显示确定按钮
            showCancel: true,  //  显示取消按钮
            showClose: true,  //  显示关闭按钮
            okText: lang.promptBtnOkText,
            cancelText: lang.promptBtnNoText,
            okHandler: $.noop,  // 确定按钮事件
            cancelHandler: $.noop,  //  取消按钮事件
            beforeRender: null  // 渲染之前的事件
        };

        /**
         * 字符串模板替换
         * @param tpl
         * @returns {*|string}
         *
         * @example
         *
         * strfmt('my name is {1},i'm {2} years old','zhangsan',23);   my name is zhangsan,i'm 23 years old
         */
        function strfmt(tpl) {
            tpl = tpl || '';
            var vars = tpl.match(/\{\d+\}/g) || [], agrs = arguments;
            $.each(vars, function () {
                var s = String(this);
                var m = new RegExp(s.replace(/{/g, '\\{').replace(/}/g, '\\}'), 'g');
                var n = s.replace(/{|}/g, '');
                tpl = tpl.replace(m, agrs[Number(n)] || '');
            });
            return tpl;
        }

        function resize($element) {
            var $modal = $element.parents('.modal-content');
            var wHeight = $(window).height();
            var mHeight = $modal.height();
            var offset = (wHeight - mHeight) / 2;
            !$modal.is(':hidden') && $modal.css({top: offset, opacity: 1});
        }

        function renderModal(options, $element) {
            options = $.extend(true, {}, DEFAULTS, options);
            //==========开始创建模态框==========
            var header = ['<div class="modal-header">'],
                footer = ['<div class="modal-footer" style="text-align: center !important;">'],
                modals = [strfmt('<div style="display: none" class="modal-content modal-{1}"></div>', options.modalSize)];
            header.push(
                strfmt('<a class="close" style="display: {1}" role="button-cancel">', options.showClose ? 'inline' : 'none'),
                '<span>&times;</span>',
                '</a>',
                strfmt('<h4 class="modal-title">{1}</h4>', options.title),
                '</div>'
            );
            var util = {
                show: function () {
                    $element.trigger('showmodal');
                },
                hide: function () {
                    $element.trigger('hidemodal');
                },
                close: this.hide
            };
            options.showOk && footer.push('<button class="btn btn-sm btn-cus" role="button-ok">' + options.okText + '</button>');
            options.showCancel && footer.push('<a class="btn btn-sm btn-cus" role="button-cancel">' + options.cancelText + '</a>');

            options.bodyMaxHeight && $element.css({
                maxHeight: options.bodyMaxHeight,
                overflow: 'auto'
            });

            options.bodyHeight && $element.css({
                height: options.bodyHeight,
                overflow: 'auto'
            });
            //包裹容器
            $element.wrap(modals.join(''));
            //显示头部
            options.showHeader && $element.before(header.join(''));
            //显示尾部
            options.showFooter && $element.after(footer.join(''));
            options.beforeRender && options.beforeRender($element);

            var $modal = $element.parents('.modal-content');
            //打开关闭modal操作
            $element.on('showmodal', function () {
                if (!$modal.is(':hidden')) {
                    return;
                }
                $modal.show();
                // 累计
                $element.trigger('show.bs.modal');
                $(window).trigger('resize');
                setTimeout(function () {
                    $element.trigger('shown.bs.modal');
                }, animateInterval);
            }).on('hidemodal', function () {
                if ($modal.is(':hidden')) {
                    return;
                }
                var wHeight = $(window).height();
                var mHeight = $modal.height();
                var offset = (wHeight - mHeight) / 2;
                $element.trigger('hide.bs.modal');
                $modal.css({
                    opacity: .3,
                    top: -offset
                });
                setTimeout(function () {
                    $modal.hide();
                    $element.trigger('hidden.bs.modal');
                }, animateInterval);
            });

            //表头的x号
            $modal.find('[role="button-cancel"].close').on('click', function () {
                $element.trigger('hidemodal');
            });
            //取消按钮事件
            $modal.find('[role="button-cancel"].btn').on('click', function () {
                options.cancelHandler(util, $element);
                $element.trigger('hidemodal');
            });
            //确定按钮的事件
            $modal.find('[role="button-ok"]').on('click', function () {
                options.okHandler(util, $element);
                options.autoClose && $element.trigger('hidemodal');
            });

            // 监听窗口变化事件
            $(window).resize(function () {
                resize($element);
            });
        }

        return {
            scope: {
                options: "=bsModal"
            },
            restrict: 'EA',
            template: '<div class="modal-body" ng-transclude></div>',
            replace: false,
            transclude: true,
            link: function ($scope, $element) {
                if (!($element instanceof $)) {
                    $element = $($element);
                }
                $scope.$watch('options', function (options) {
                    var evtSuffix = options&&options.mId ? '#' + options.mId : '';
                    var evts = ['show.bs.modal', 'shown.bs.modal', 'hide.bs.modal', 'hidden.bs.modal'];
                    //========== 事件捕获处理 ==========
                    $scope.$on('show' + evtSuffix, function () {
                        $element.trigger('showmodal');
                    });
                    $scope.$on('hide' + evtSuffix, function () {
                        $element.trigger('hidemodal');
                    });
                    $scope.$on('disabled.ok' + evtSuffix, function () {
                        $element.parents('.modal-content').find('[role="button-ok"]').attr('disabled', 'disabled');
                    });
                    $scope.$on('disabled.cancel' + evtSuffix, function () {
                        $element.parents('.modal-content').find('[role="button-cancel"].btn').attr('disabled', 'disabled');
                    });
                    $scope.$on('enable.ok' + evtSuffix, function () {
                        $element.parents('.modal-content').find('[role="button-ok"]').removeAttr('disabled');
                    });
                    $scope.$on('enable.cancel' + evtSuffix, function () {
                        $element.parents('.modal-content').find('[role="button-cancel"].btn').removeAttr('disabled');
                    });
                    $scope.$on('change.title' + evtSuffix, function (e, name) {
                        $element.parents('.modal-content').find('.modal-title').text(name);
                    });
                    //========== 事件动作处理 ==========
                    $.each(evts, function (i, e) {
                        $element.off(e).on(e, function () {
                            $scope.$emit(e + evtSuffix, $element);
                        });
                    });
                    renderModal(options, $element);
                });
            }
        };
    }]);
});