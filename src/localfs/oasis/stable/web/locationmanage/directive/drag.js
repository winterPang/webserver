define(['angularAMD'],function (app) {
    app.directive('bsDrag',function () {
        return {
            restrict: 'A',
            scope:{
                option:'=bsDrag'
            },
            link:function (s, e, a) {
                if(s.option.style){
                    e.css(s.option.style)
                }
                if(s.option.select){
                    var d = e.find(s.option.select).addClass(s.option.cursor.open)
                }
                e.bind('mousedown',function (ev) {
                    if(ev.button == 2)return;
                    if(s.option.isdrag){
                        e.pageY = ev.pageY;
                        e.pageX = ev.pageX;
                        s.option.select && d.removeClass(s.option.cursor.open).addClass(s.option.cursor.close);
                        e.bind('mousemove',function (ev) {
                            var desY = (ev.pageY - e.pageY)/s.option.speed;
                            var desX = (ev.pageX - e.pageX)/s.option.speed;
                            if(desY !== 0){
                                e.scrollTop(e.scrollTop() - desY)
                            }
                            if(desX !== 0){
                                e.scrollLeft(e.scrollLeft() - desX)
                            }
                        })
                    }
                });
                e.bind('mouseup',function (ev) {
                    s.option.select && d.removeClass(s.option.cursor.close).addClass(s.option.cursor.open);
                    e.unbind('mousemove')
                })
            }
        }
    })

})

/*
.closedhand{
    cursor:url(../locationmanage/img/closedhand.cur) 8 8, move!important;
}
.openhand{
    cursor:url(../locationmanage/img/openhand.cur) 8 8, default!important;
}*/
