define(["angularAMD"], function (app) {
    app.directive("bsOperate",function(){
        return{
            scope:{

            },
            restrict :'A',
            link :function(scope,element,attr){
                // class .icon -- .link
                var $icon = element.find('.icon'),
                    $link = element.find('.link');
                var isClick = false;

                // bind mouse event to drag the wrap
                element.on("mousedown",function(e){
                    var that = $(this);
                    var _start = Date.now();
                    var x = e.clientX - $(this).offset().left;
                    var y = e.clientY - $(this).offset().top;
                    $(document).on("mousemove",function(e){
                        e.preventDefault();
                        that.css({
                            left:e.clientX-x,
                            top:e.clientY-y
                        });
                    });
                    $(document).on("mouseup",function(e){
                        var _end = Date.now();
                        isClick = _end - _start < 200;
                        $(document).off('mousemove');
                    })
                });

                // bind the $icon to show/hide the $link

                $icon.click(function (){
                    if(isClick){
                        $link.toggle();

                    }
                })

            }
        }
    });
});

