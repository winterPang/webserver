/* 汉化 Datepicker 和 Timepicker。Written by 田志良 */
(function ($) {
    // 汉化 Datepicker
    $.datepicker.regional['zh-EN'] =
    {
        clearText: '清除', clearStatus: '清除已选日期',
        closeText: '关闭', closeStatus: '不改变当前选择',
        prevText: '&lt;上月', prevStatus: '显示上月',
        nextText: '下月&gt;', nextStatus: '显示下月',
        currentText: '今天', currentStatus: '显示本月',
        monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                     'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
        monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
        monthStatus: '选择月份', yearStatus: '选择年份',
        weekHeader: '周', weekStatus: '年内周次',
        dayNames: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        dayNamesShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        dayStatus: '设置 DD 为一周起始', dateStatus: '选择 m月 d日, DD',
        dateFormat: 'yy-mm-dd', firstDay: 1,
        initStatus: '请选择日期', isRTL: false
    };
    $.datepicker.setDefaults($.datepicker.regional['zh-EN']);

    //汉化 Timepicker
	$.timepicker.regional['zh-EN'] = {
		timeOnlyTitle: '选择时间',
		timeText: '时间',
		hourText: '小时',
		minuteText: '分钟',
		secondText: '秒钟',
		millisecText: '微秒',
		timezoneText: '时区',
		currentText: 'now',
		closeText: 'close',
		timeFormat: 'hh:mm',
		amNames: ['AM', 'A'],
		pmNames: ['PM', 'P'],
		ampm: false
	};
	$.timepicker.setDefaults($.timepicker.regional['zh-EN']);
})(jQuery);
