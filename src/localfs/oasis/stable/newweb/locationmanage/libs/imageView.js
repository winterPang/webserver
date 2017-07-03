(function ($) {
    jQuery.fn.dragger = function (config) {

        // Find Elements
        var $container = this;
        if ($container.length == 0) return false;
        var $img = $container.find('canvas');

        // console.log($container.width());

        $img.removeData(['mousedown', 'settings']);

        // Settings
        config = jQuery.extend({
            width: $container.width(),
            height: 600
        }, config);

        // init-data
        $img.data('mousedown', false);
        $img.data('settings', config);
        $img.data('ps', {x: 0, y: 0});
        $img.data('imgPs', {left: 0, top: 0});

        // CSS
        $container
            .height($img.data('settings').height)
            .css({overflow: 'hidden', position: 'relative'});

        $img.css('position', 'absolute').css($img.data('imgPs'));

        $container.on('img_loaded', function () {
            if ($img.data('settings').width > $img.width()) {
                $img.data('imgPs').left = $img.data('settings').width / 2 - $img.width() / 2;
            } else {
                $img.data('imgPs').left = 0;
            }
            if ($img.data('settings').height > $img.height()) {
                $img.data('imgPs').top = $img.data('settings').height / 2 - $img.height() / 2;
            } else {
                $img.data('imgPs').top = 0;
            }
            $img.css($img.data('imgPs'));
        });
        loaded();
        function loaded() {
            $img.on('mousedown.imgview', function (event) {
                // console.debug('$img - mousedown.imgview');
                $img.data('mousedown', true)
                    .data('ps', {
                        x: event.clientX,
                        y: event.clientY
                    })
                    .data('imgPs', {
                        left: parseInt($img.css('left')),
                        top: parseInt($img.css('top'))
                    });
                return false;
            });

            $(document).on('mouseup.imgview', function (event) {
                // console.debug('document - mouseup.imgview');
                $img.data('mousedown', false)
                    .data('imgPs', {
                        left: parseInt($img.css('left')),
                        top: parseInt($img.css('top'))
                    });
                return false;
            });

            $container.on('mouseout.imgview', function (event) {
                // console.debug('$container - mouseout.imgview');

                $img.data('mousedown', false)
                    .data('imgPs', {
                        left: parseInt($img.css('left')),
                        top: parseInt($img.css('top'))
                    });
                return false;
            });

            $container.on('mousemove.imgview', function (event) {
                // console.debug('$container - mousemove.imgview', $img.data('mousedown'));

                // console.log('left', $img.css('left'));
                // console.log('top', $img.css('top'));
                if ($img.data('mousedown')) {

                    // console.debug('......', $container.width());
                    // console.debug('......', $container.height());

                    // console.debug('$img.height', $img.height());
                    // console.debug('$img.width', $img.width());

                    var dx = event.clientX - $img.data('ps').x;
                    var dy = event.clientY - $img.data('ps').y;

                    $img.data('imgPs').left = $img.data('imgPs').left + dx;
                    $img.data('imgPs').top = $img.data('imgPs').top + dy;

                    if ((dx == 0) && (dy == 0)) {
                        return false;
                    }

                    if ($img.data('imgPs').left > 0) $img.data('imgPs').left = 0;
                    if ($img.data('imgPs').top > 0) $img.data('imgPs').top = 0;

                    // 右边和容器右侧贴一起了
                    if ($img.data('imgPs').left < $img.data('settings').width - $img.width()) {
                        $img.data('imgPs').left = $img.data('settings').width - $img.width();
                        // console.debug('right >>>>>', imgPs.left, $img.data('settings').width - $img.width());
                    }

                    // 下边和容器下侧贴一起了
                    if ($img.data('imgPs').top < $img.data('settings').height - $img.height()) {
                        $img.data('imgPs').top = $img.data('settings').height - $img.height();
                        // console.debug('bottom >>>>>', imgPs.top, $img.data('settings').height - $img.height());
                    }

                    // 图片比容器小的处理
                    if ($img.data('settings').width >= $img.width()) {
                        $img.data('imgPs').left = $img.data('settings').width / 2 - $img.width() / 2;
                    }
                    if ($img.data('settings').height >= $img.height()) {
                        $img.data('imgPs').top = $img.data('settings').height / 2 - $img.height() / 2;
                    }
                    // $img.css($img.data('imgPs'));
                    $img.animate({
                        left: $img.data('imgPs').left,
                        top: $img.data('imgPs').top
                    }, 100);

                    // console.debug($img.data('ps'), $img.data('imgPs'));
                    $img.data('ps', {x: event.clientX, y: event.clientY});
                }
                return false;
            });
        }

        return this;
    };
})(jQuery); 