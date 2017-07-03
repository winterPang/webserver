(function ($) {
    "use strict";
    //  fangfa
    function init(target) {

        var range = $(target);

        var option = $.data(target, 'rangepicker').options;
        range.$el = $('<div>' +
            '<div class="form-group">' +
            '<div class="col-xs-4"><input type="number" class="form-control rangeMin" value="0"></div>' +
            '<span class="col-xs-4 text-center">~</span>' +
            '<div class="col-xs-4"><input type="number" class="form-control rangeMax" value="0"></div>' +
            '</div>' +
            '<div class="form-group text-center">' +
            '<button type="button" class="okBtn ' + option.okClass + '">' + option.okText + '</button>' +
            '<button type="button" class="cancelBtn ' + option.cancelClass + '">' + option.cancelText + '</button>' +
            '<button type="button" class="clearBtn ' + option.clearClass + '">' + option.clearText + '</button>' +
            '</div>' +
            '</div>')
            .addClass(option.panelClass)
            .css({
                position: 'absolute',
                background: '#fff',
                border: '1px solid #ddd',
                padding: '15px 30px',
                width: '320px',
                display: 'none'
            });
        range.$el.appendTo('body');
        range.startRange = range.$el.find('input.rangeMin');
        range.endRange = range.$el.find('input.rangeMax');
        range.okBtn = range.$el.find('button.okBtn');
        range.cancelBtn = range.$el.find('button.cancelBtn');
        range.clearBtn = range.$el.find('button.clearBtn');

        range.on('click', function () {
            var offset = $(target).offset();
            range.$el.show();
            range.$el.css({'top': offset.top + range.height() + 10 + 'px', 'left': offset.left + 'px'});
        });

        range.okBtn.on('click', function () {
            // 如果有一个是空的
            var start = range.startRange.val();
            var end = range.endRange.val();
            var commit = {start: start === '' ? null : Number(start), end: end === '' ? null : Number(end)};
            var inputVal = '';
            if (commit.start != null && commit.end != null) {
                inputVal = commit.start + option.splitChar + commit.end;
            } else if (commit.start == null && commit.end == null) {
                inputVal = '';
            } else if (commit.start == null) {
                inputVal = '< ' + commit.end;
            } else if (commit.end == null) {
                inputVal = '> ' + commit.start;
            }
            range.val(inputVal);
            range.trigger('okclick.range', commit);
            range.data('range', commit);
            range.$el.hide();
        });

        range.cancelBtn.on('click', function () {
            range.trigger('cancelclick.range');
            range.$el.hide();
        });

        range.clearBtn.on('click', function () {
            range.trigger('clearclick.range');
            range.val('');
            range.startRange.val('');
            range.endRange.val('');
        });

        range.startRange.on('change', function () {
            var val = Number(range.startRange.val());
            var val2 = Number(range.endRange.val());
            if (val > val2) {
                range.endRange.val(val);
            }
        });

        range.endRange.on('change', function () {
            var val = Number(range.startRange.val());
            var val2 = Number(range.endRange.val());
            if (val > val2) {
                range.startRange.val(val2);
            }
        });

        $('*').scroll(function (e) {
            range.$el.hide();
            e.stopPropagation();
            return false;
        });
    }

    $.fn.rangepicker = function (options) {
        options = options || {};
        return this.each(function () {
            var state = $.data(this, 'rangepicker');
            if (state) {
                $.extend(state.options, options);
            } else {
                $.data(this, 'rangepicker', {
                    options: $.extend({}, $.fn.rangepicker.defaults, options)
                });
            }
            init(this)
        });
    };

    $.fn.rangepicker.defaults = {
        okText: '确定',
        cancelText: '取消',
        clearText: '清空',
        splitChar: ' ~ ',
        okClass: 'btn btn-cus',
        cancelClass: 'btn btn-cus',
        clearClass: 'btn btn-cus',
        panelClass: 'range-picker'
    };
})(jQuery);