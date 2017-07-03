define(['angularAMD',
        'jquery',
        '../libs/jquery.mousewheel'],function (app,$) {
    app.directive('bsScale',function () {
        return {
            restrict: 'A',
            scope:{
                option:'=bsScale'
            },
            link:function (s, e ) {
                var option = s.option;
                // if(!option)return;
                var def = {
                    style : {
                        transition : 'all .1s',
                        transform : 'scale(1,1)',
                        "background-size" : 'cover'
                    },
                    maxX : 2,
                    Maxy : 2,
                    speed : .2
                };
                var opt = $.extend({},def,option);
                e.css(opt.style);
                /*e.css(option.style && typeof option.style === 'object'
                                                                    ? $.extend({},def.style,option.style)
                                                                    : def.style);*/
                var isCanvas = e.get(0).nodeName === 'CANVAS' ? true : false ;
                if(isCanvas)
                {
                    e.data('scale',
                    {
                        cW : 1,
                        cH : 1
                    })
                    e.bind('mousewheel', function(event, delta, deltaX, deltaY) {
                        event.bubbles = false;
                        var toX,toY,minX = 1,minY = 1,maxX = opt.maxX,maxY = opt.maxY,curX = e.data('scale').cW,curY = e.data('scale').cH;
                        if(delta > 0)
                        {
                            toX = curX + opt.speed;
                            toY = curY + opt.speed;
                        }
                        else
                        {
                            toX = curX - opt.speed;
                            toY = curY - opt.speed;
                        }
                        if((toX >= minX || toY >= minY) && (toX <= maxX || toY <= maxY))
                        {
                            e.animate(
                            {
                                width : event.target.width * toX,
                                height: event.target.height * toY
                            },.1);
                            e.data('scale',
                            {
                                cW : toX,
                                cH : toY
                            });
                        }
                        return false
                    });
                }
                else
                {
                    e.bind('mousewheel', function(event, delta, deltaX, deltaY) {
                        event.bubbles = false;
                        var $target = $(event.target);
                        var current = /matrix\((\S*), 0, 0, (\S*), 0, 0\)/.exec($target.css('transform')).slice(1).map(function(item){return parseFloat(item)});
                        var toX,toY,minX = 1,minY = 1,maxX = opt.maxX,maxY = opt.maxY,curX = current[0],curY = current[1];
                        if(delta > 0)
                        {
                            toX = curX + opt.speed;
                            toY = curY + opt.speed;
                            if(toX <= maxX || toY <= maxY)
                            {
                                e.css('transform','scale(' + toX + ',' + toY +')')
                                e.get(0).width = 1300
                            }
                            return false
                        }
                        else
                        {
                            toX = curX - opt.speed;
                            toY = curY - opt.speed;
                            if(toX >= minX || toY >= minY)
                            {
                                e.css('transform','scale(' + toX + ',' + toY +')')
                            }
                            return false
                        }
                    });
                }
                // using bind

            }
        }
    })

})
