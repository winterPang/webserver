(function ($) {
    "use strict";

    // 动画时长，毫秒
    var animateInterval = 300;

    //  创建类操作快捷方式
    var rmcls = 'removeClass', addcls = 'addClass';

    /**
     * @param options  配置
     * @constructor
     */
    function BootModal(options) {
        !(this instanceof BootModal) && $.error('请调用$.modal.create(options)创建对象!');

        var modal = this;
        // 合并配置
        var opts = $.extend(true, {}, BootModal.DEFAULTS, options);
        // 获取主体body
        var $content = opts.content();
        // 主模板
        var $html = $('<div class="modal-content">' +
            '<div class="modal-header hidden">' +
            '<button type="button" class="close hidden"><span aria-hidden="true">&times;</span></button>' +
            '<h4 class="modal-title"></h4>' +
            '</div>' +
            '<div class="modal-body"></div>' +
            '<div class="modal-footer hidden"></div>' +
            '</div>');
        modal.el = $html;
        modal.options = opts;
        $html.appendTo('body');
        $content.appendTo($html.find('.modal-body'));
        opts.title && $html.find('.modal-title').text(opts.title);
        opts.showHeader = opts.showHeader && !!opts.title;
        opts.showClose && $html.find('.close')[rmcls]('hidden').unbind('click').bind('click', function () {
            opts.closeAction == 'hide' ? modal.hide() : modal.destroy();
        });
        opts.showHeader && $html.find('.modal-header')[rmcls]('hidden');
        opts.showFooter && $html.find('.modal-footer')[rmcls]('hidden');
        opts.modalSize && $html[addcls]('modal-' + opts.modalSize);
        opts.buttonAlign && $html.find('.modal-footer').css('text-align', opts.buttonAlign);

        opts.buttons && opts.buttons.length && $.each(opts.buttons, function () {
            var me = this;
            var $btn = $('<button class="btn btn-sm"></button>');

            me.text && $btn.text(me.text);
            me.btnCls ? $btn[addcls]('btn-' + me.btnCls) : $btn[addcls]('btn-default');
            opts.buttonSize && $btn[addcls]('btn-' + opts.buttonSize);
            me.handler && $btn.unbind('click').bind('click', function () {
                me.handler.call(modal, modal, $content);
            });
            $btn.appendTo($html.find('.modal-footer'));
        });
        $html.on('show.bs.modal', function () {
            opts.beforeShow.call(modal, modal, $content);
        })
            .on('shown.bs.modal', function () {
                opts.onShow.call(modal, modal, $content);
            })
            .on('hide.bs.modal', function () {
                opts.beforeHide.call(modal, modal, $content);
            })
            .on('hidden.bs.modal', function () {
                opts.onHide.call(modal, modal, $content);
            });

        modal.resize = function () {
            var wHeight = $(window).height();
            var mHeight = $html.height();
            var offset = (wHeight - mHeight) / 2;
            !$html.is(':hidden') && $html.css({top: offset, opacity: 1});
        };
        // 监听窗口变化事件
        $(window).resize(modal.resize);
    }

    /**
     * 创建实例
     * @param options
     * @returns {BootModal}
     */
    BootModal.create = function (options) {
        return new BootModal(options);
    };
    /**
     * 弹出框，模拟alert
     * @param msg 显示的消息
     * @param title 显示的title
     * @param fn  确定后的回调函数
     */
    BootModal.alert = function (msg, title, fn) {
        var lang = BootModal.DEFAULTS.lang;
        var opts = $.extend(true, {}, BootModal.ALERT_DEFAULTS, {
            title: title || lang.alertTitle,
            content: function () {
                return $('<div>' + msg + '</div>');
            },
            buttons: [
                {
                    text: lang.btnCloseText,
                    btnCls: 'cus',
                    handler: function (modal, content) {
                        fn && fn(modal, content);
                        modal.destroy();
                    }
                }
            ]
        });
        BootModal.create(opts).show();
    };
    /**
     * 询问框  confirm    模拟window询问框
     * @param msg   显示的信息
     * @param title  显示的title
     * @param fn  OK的回调函数
     * @param fn2 cancel的回调函数
     */
    BootModal.confirm = function (msg, title, fn, fn2) {
        var lang = BootModal.DEFAULTS.lang;
        var opts = $.extend(true, {}, BootModal.ALERT_DEFAULTS, {
            title: title || lang.confirmTitle,
            content: function () {
                return $('<div>' + msg + '</div>');
            },
            buttons: [
                {
                    text: lang.btnOkText,
                    btnCls: 'cus',
                    handler: function (modal, content) {
                        fn && fn(modal, content);
                        modal.destroy();
                    }
                },
                {
                    text: lang.btnNoText,
                    btnCls: 'cus',
                    handler: function (modal, content) {
                        fn2 && fn2(modal, content);
                        modal.destroy();
                    }
                }
            ]
        });
        BootModal.create(opts).show();
    };
    /**
     * 模拟window弹出询问文本框
     * @param msg   显示的信息  例如：请输入密码
     * @param fn   ok的回调函数
     * @param type   类型   默认是text   可选值是text,password,textarea
     * @param defVal  默认值
     * @param fn2  取消回调函数
     */
    BootModal.prompt = function (msg, fn, type, defVal, fn2) {
        var lang = BootModal.DEFAULTS.lang;
        var opts = $.extend(true, {}, BootModal.ALERT_DEFAULTS, {
            title: msg || lang.promptTitle,
            content: function () {
                type = type || 'text';
                defVal = defVal || '';
                var input = type == 'textarea'
                    ? '<textarea style="height: 100px;resize: vertical" class="form-control">' + defVal + '</textarea>'
                    : '<input type="' + type + '" value="' + defVal + '" class="form-control">';
                return $('<div>' + input + '</div>');
            },
            buttons: [
                {
                    text: lang.promptBtnOkText,
                    btnCls: 'cus',
                    handler: function (modal, content) {
                        fn && fn(content.find('textarea,input').val(), modal, content);
                        modal.destroy();
                    }
                },
                {
                    text: lang.promptBtnNoText,
                    btnCls: 'cus',
                    handler: function (modal, content) {
                        fn2 && fn2(modal, content);
                        modal.destroy();
                    }
                }
            ]
        });
        BootModal.create(opts).show();
    };
    /**
     * 弹出显示确定和取消按钮的摸态框
     * @param title    显示的标题
     * @param content   显示的额内容区域  Function   return a jQuery Object     eg: return $('<div></div>');
     * @param fn1  确定回调函数
     * @param fn2  取消回调函数  如果是boolean则认为是下一项的配置
     * @param autoclose 是否自动关闭    点击确定无论如何都会关闭
     */
    BootModal.modal = function (title, content, fn1, fn2, autoclose) {

        var lang = BootModal.DEFAULTS.lang;

        //是否自动关闭
        var acl = autoclose;
        if (fn2 != undefined && fn2 != null && typeof fn2 == 'boolean') {
            acl = fn2;
        }

        acl = acl == undefined || acl == true;

        var opts = $.extend(true, {}, BootModal.ALERT_DEFAULTS, {
            title: title || lang.promptTitle,
            content: content,
            buttons: [
                {
                    text: lang.promptBtnOkText,
                    btnCls: 'cus',
                    handler: function (modal, content) {
                        fn1 && fn1(modal, content);
                        acl && modal.destroy();
                    }
                },
                {
                    text: lang.promptBtnNoText,
                    btnCls: 'cus',
                    handler: function (modal, content) {
                        fn2 && fn2 instanceof Function && fn2(modal, content);
                        modal.destroy();
                    }
                }
            ]
        });
        BootModal.create(opts).show();
    };
    BootModal.fn = BootModal.prototype;
    /**
     * 显示弹出框
     */
    BootModal.fn.show = function () {

        var me = this;
        // 显示modal遮罩层
        me.el.show().trigger('show.bs.modal');
        $(window).trigger('resize');
        setTimeout(function () {
            me.el.trigger('shown.bs.modal');
        }, animateInterval);
    };
    /**
     * 禁用确定按钮
     * @param disabled
     */
    BootModal.fn.disableOk = function (disabled) {
        var lang = BootModal.DEFAULTS.lang;
        disabled = disabled || true;
        var $ok = this.el.find('button').filter(function (b) {
            return $(b).html() == lang.promptBtnOkText;
        });
        if (disabled) {
            $ok.attr('disabled', 'disabled');
        } else {
            $ok.removeAttr('disabled');
        }
    };
    /**
     * 禁用取消按钮
     * @param disabled
     */
    BootModal.fn.disableCancel = function (disabled) {
        disabled = disabled || true;
        var lang = BootModal.DEFAULTS.lang;
        var $cancel = this.el.find('button').filter(function (b) {
            return $(b).html() == lang.promptBtnOkText;
        });
        if (disabled) {
            $cancel.attr('disabled', 'disabled');
        } else {
            $cancel.removeAttr('disabled');
        }
    };
    /**
     * 隐藏弹出框
     */
    BootModal.fn.hide = function (fn) {
        var me = this;
        var wHeight = $(window).height();
        var mHeight = this.el.find('.modal-content').height();
        var offset = (wHeight - mHeight) / 2;
        me.el.trigger('hide.bs.modal');
        me.el.css({
            opacity: .3,
            top: -offset
        });
        setTimeout(function () {
            me.el.hide().trigger('hidden.bs.modal');
            // 隐藏遮罩层
            fn && fn();
        }, animateInterval);
    };
    // 销毁弹出框
    BootModal.fn.destroy = function () {
        var me = this;
        me.hide(function () {
            me.el.remove();
        });
    };
    /**
     * 关闭弹出框
     * @type {any}
     */
    BootModal.fn.close = BootModal.fn.destroy;
    /**
     * 默认配置
     * @type {{animate: boolean, title: string, modalSize: string, showHeader: boolean, showClose: boolean, showFooter: boolean, buttonAlign: string, buttonSize: string, closeAction: string, buttons: Array, content: BootModal.DEFAULTS.content, beforeShow: BootModal.DEFAULTS.beforeShow, onShow: BootModal.DEFAULTS.onShow, beforeHide: BootModal.DEFAULTS.beforeHide, onHide: BootModal.DEFAULTS.onHide}}
     */
    BootModal.DEFAULTS = {
        // 显示动画
        animate: true,
        // modal标题
        title: 'Modal',
        // modal尺寸 lg,sm
        modalSize: 'normal',
        // 显示头部
        showHeader: true,
        // 显示头部按钮
        showClose: true,
        // 显示尾部
        showFooter: true,
        // =====尾部按钮=====
        // 按钮对齐方式  left,right,center
        buttonAlign: 'center',
        // 按钮尺寸
        buttonSize: '', //  lg,sm,xs
        // 关闭操作   destroy -> 直接在页面上删除  hide -> 隐藏
        closeAction: 'hide',
        // 按钮配置
        buttons: [
            /*{
             text: '关闭',
             //自定义样式 btn-success,btn-info,btn-warning,btn-primary,btn-danger
             btnCls: '',
             /!**
             * 点击按钮响应的函数
             * @param modal
             * @param element
             *!/
             handler: function (modal, element) {
             // this代表当前对象
             }
             }*/
        ],
        // 语言
        lang: {
            alertTitle: 'error',
            confirmTitle: 'confirm',
            promptTitle: 'prompt',
            promptBtnOkText: 'Ok',
            promptBtnNoText: 'Cancel',
            btnCloseText: 'Close',
            btnOkText: 'Yes',
            btnNoText: 'No'
        },
        content: function () {
            return $('<div></div>');
        },
        /**
         * 显示之前
         * @param modal
         * @param content
         */
        beforeShow: function (modal, content) {

        },
        /**
         * 显示之后
         * @param modal
         * @param content
         */
        onShow: function (modal, content) {

        },
        /**
         * 隐藏之前
         * @param modal
         * @param content
         */
        beforeHide: function (modal, content) {

        },
        /**
         * 隐藏之后
         * @param modal
         * @param content
         */
        onHide: function (modal, content) {

        }
    };
    /**
     * 弹出框默认值
     */
    BootModal.ALERT_DEFAULTS = $.extend(true, {}, BootModal.DEFAULTS, {
        buttonAlign: 'center',  //  居中显示
        closeAction: 'destroy'  //   关闭操作   销毁  在页面中删除modal元素
    });
    $.modal = BootModal;
})(jQuery);