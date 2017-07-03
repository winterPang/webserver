define(['angularAMD'],function (app) {
    app.directive('bsFull',function () {

        function launchFullscreen(element) {
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        }

        /*function cancelFullscreen() {
            try {
                var container = window.top.document || document;
                if (container.cancelFullScreen) {
                    container.cancelFullScreen();
                } else if (container.mozCancelFullScreen) {
                    container.mozCancelFullScreen();
                } else if (container.webkitCancelFullScreen) {
                    container.webkitCancelFullScreen();
                } else if (container.msCancelFullScreen) {
                    container.msCancelFullScreen();
                }
            } catch (e) {
                if (document.cancelFullScreen) {
                    document.cancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.msCancelFullScreen) {
                    document.msCancelFullScreen();
                }
            }
        }*/

        function listenFullChange() {
            function fullscreenchange() {
                var full = document.fullScreen || document.webkitIsFullScreen || document.mozIsFullScreen || document.msIsFullScreen;
                $(document).trigger(full ? 'fullscreen' : 'unfullscreen');
                $(document).trigger('fullscreenchange.f');
            }

            if (!document.hasFullListener) {
                document.addEventListener("fullscreenchange", fullscreenchange);
                document.addEventListener("webkitfullscreenchange", fullscreenchange);
                document.addEventListener("mozfullscreenchange", fullscreenchange);
                document.addEventListener("MSFullscreenChange", fullscreenchange);
                document.hasFullListener = true;
            }
        }
        return {
            restrict: 'A',
            scope:{
                option:'=bsFull'
            },
            link:function (s, e, a) {
                if(!s.option)return;
                var option = s.option,
                    // originCss = {},
                    el = $(option.select);

                    listenFullChange();

                    e.bind('click',function (ev) {
                        launchFullscreen(el[0])
                    });

                    if(typeof option.fullStyle === 'object'){
                        if(typeof option.originCss !== 'object'){
                            for(var attr in option.fullStyle){
                                originCss[attr] = el.css(attr)
                            }
                        }
                        $(document)
                            .on('fullscreen',function (ev) {
                                console.log('fullScreen')
                                el.css(option.fullStyle)
                            })
                            .on('unfullscreen',function (ev) {
                                console.log('unfullScreen')
                                el.css(option.originCss)
                            })
                    }
            }
        }
    })
})

