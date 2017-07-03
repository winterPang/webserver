define(['app', 'bootmodal', 'frame/directive/lang/bs_modal', 'utils', 'notice'], function (mainApp, $, modalLang, utils) {
    mainApp.factory('$alertService', ['$rootScope', function ($rootScope) {
        // 设置语言
        $.modal.DEFAULTS = $.extend(true, {}, $.modal.DEFAULTS, {lang: modalLang[utils.getLang()]});

        var $alert = {};
        /**
         * alert弹出框，使用方式 $alert.alert(msg)
         * @type {f.alert}
         */
        $alert.alert = $.modal.alert;
        /**
         * 询问框
         * @param msg 询问消息
         * @param okHandler 确定响应事件
         * @param cancelHandler 取消按钮响应事件
         */
        $alert.confirm = function (msg, okHandler, cancelHandler) {
            okHandler = okHandler || $.noop;
            cancelHandler = cancelHandler || $.noop;
            $.modal.confirm(msg, null, okHandler, cancelHandler);
        };
        /**
         * 弹出自定义模块匡
         * @param title 标题
         * @param content 文本函数   要求返回一个jquery对象
         * @param ok ok回调函数
         * @param [cancel] cancel回调函数
         * @param [autoclose] 是否点击确定自动关闭
         */
        $alert.modal = function (title, content, ok, cancel, autoclose) {
            $.modal.modal(title, content, ok, cancel, autoclose);
        };
        /**
         * 弹出询问输入框
         * @param msg 询问框标题
         * @param handler 处理函数，参数为输入的数据
         * @param defValue 默认值
         * @param type 输入框类型 'text'：文本, 'password'：密码, 'textarea'：文本域
         */
        $alert.prompt = function (msg, handler, defValue, type) {
            type = type || 'text';
            $.modal.prompt(msg, handler, type, defValue)
        };
        /**
         * 弹出密码询问框，是$alert.prompt的快捷方法
         * @param msg
         * @param handler
         * @param defValue
         */
        $alert.promptPwd = function (msg, handler, defValue) {
            $alert.prompt(msg, handler, defValue, 'password');
        };
        /**
         * 弹出文本域询问框，是$alert.prompt的快捷方法
         * @param msg
         * @param handler
         * @param defValue
         */
        $alert.promptArea = function (msg, handler, defValue) {
            $alert.prompt(msg, handler, defValue, 'textarea');
        };

        var $notice = $.jqueryNotice;

        /**
         * 通知栏信息
         * @param msg 消息
         * @param title 标题
         * @param theme 主题  success，info，danger，warning
         */
        $alert.notice = function (msg, title, theme) {
            $notice.show({
                theme: theme || 'info',
                msg: msg || '',
                title: title || ''
            });
        };

        // 快捷方法
        $alert.noticeSuccess = function (msg, title) {
            // $alert.notice(msg, title, 'success');
            $notice.msgDialog(msg);
        };
        $alert.noticeDanger = function (msg, title) {
            // $alert.notice(msg, title, 'danger');
            $notice.msgDialog(msg, 'error');
        };
        $alert.noticeWarning = function (msg, title) {
            $alert.notice(msg, title, 'warning');
        };

        // 通知笑脸
        $alert.msgDialogSuccess = $notice.msgDialog;
        // 通知哭脸
        $alert.msgDialogError = function (msg) {
            $notice.msgDialog(msg, 'error');
        };
        return $alert;
    }]);
});
