;(function ($) {
    var Carousel = function (poster) {
        var self = this;
        //保存单个旋转木马对象
        this.poster = poster;
        this.posterItemMain = poster.find("ul.poster-list");
        this.nextBtn = poster.find("div.poster-next-btn");
        this.prevBtn = poster.find("div.poster-prev-btn");
        this.posterItems = poster.find("li.poster-item");
        if (this.posterItems.size() == 2) {
            this.posterItemMain.append(this.posterItems.eq(0).clone());
            this.posterItems = this.posterItemMain.children();
        }
        if(this.posterItems.size() == 1){
            this.posterItemMain.append(this.posterItems.eq(0).clone());
            this.posterItems = this.posterItemMain.children();
            this.posterItemMain.append(this.posterItems.eq(0).clone());
            this.posterItems = this.posterItemMain.children();
        }
        /*if (this.posterItems.size() % 2 == 0) {
            this.posterItemMain.append(this.posterItems.eq(0).clone());
            this.posterItems = this.posterItemMain.children();
        }
        ;*/
        this.posterFirstItem = this.posterItems.first();
        this.posterLastItem = this.posterItems.last();
        this.posterSecondItem = this.posterItems.eq(1);
        /*if (this.posterItems.size() >=3) {

        }else{
            this.posterSecondItem = this.posterLastItem;
        }
        ;*/
        this.rotateFlag = true;
        //默认配置参数
        this.setting = {
            "width": 1000,			//幻灯片的宽度
            "height": 270,			//幻灯片的高度
            "posterWidth": 640,	//幻灯片第一帧的宽度
            "posterHeight": 270,	//幻灯片第一帧的高度
            "scale": 0.9,			//记录显示比例关系
            "speed": 500,
            "autoPlay": false,
            "delay": 5000,
            "verticalAlign": "middle" //top bottom
        };
        $.extend(this.setting, this.getSetting());

        //设置配置参数值
        this.setSettingValue();
        //初始化幻灯片位置
        /*this.setPosterPos();*/
        //左旋转按钮
        this.nextBtn.click(function () {
            if (self.rotateFlag) {
                self.rotateFlag = false;
                self.carouseRotate("left");
            }
            ;
        });
        //右旋转按钮
        this.prevBtn.click(function () {
            if (self.rotateFlag) {
                self.rotateFlag = false;
                self.carouseRotate("right");
            }
            ;
        });
        //是否开启自动播放
        if (this.setting.autoPlay) {
            this.autoPlay();
            this.poster.hover(function () {
                //self.timer是setInterval的种子
                window.clearInterval(self.timer);
            }, function () {
                self.autoPlay();
            });
        }
        ;
    };
    Carousel.prototype = {
        autoPlay: function () {
            var self = this;
            this.timer = window.setInterval(function () {
                // self.nextBtn.click();
                if (self.rotateFlag) {
                    self.rotateFlag = false;
                    self.carouseRotate("left");
                }
            }, this.setting.delay);
        },
        //旋转
        carouseRotate: function (dir) {
            var _this_ = this;
            var zIndexArr = [];
            //左旋转
            if (dir === "left") {
                var activeChange1 = false;
                this.posterItems.each(function () {
                    var self = $(this),
                        prev = self.prev().get(0) ? self.prev() : _this_.posterLastItem,
                        width = prev.width(),
                        height = prev.height(),
                        opacity = prev.css("opacity"),
                        left = prev.css("left"),
                        top = prev.css("top"),
                        zIndex = prev.css("zIndex");

                    zIndexArr.push(zIndex);
                    self.animate({
                        width: width,
                        height: height,
                        //zIndex :zIndex,
                        opacity: opacity,
                        left: left,
                        top: top
                    }, _this_.setting.speed, function () {
                        _this_.rotateFlag = true;
                    });
                    var index = self.parent().children().index(self);
                    var prevIndex = self.parent().children().index(prev);
                    var oCircle = $(".circle").children("li");
                    if(oCircle.eq(prevIndex).hasClass("active") && !activeChange1){
                        activeChange1 = true;
                        oCircle.eq(prevIndex).removeClass("active");
                        oCircle.eq(index).addClass("active");
                    }
                    /*var index = self.parent().children().index(prev);
                    if($(".circle").children("li").eq(index).hasClass("active")){

                    }*/

                });
                //zIndex需要单独保存再设置，防止循环时候设置再取的时候值永远是最后一个的zindex
                this.posterItems.each(function (i) {
                    $(this).css("zIndex", zIndexArr[i]);
                });
            } else if (dir === "right") {//右旋转
                var activeChange2 = false;
                this.posterItems.each(function () {
                    var self = $(this),
                        next = self.next().get(0) ? self.next() : _this_.posterFirstItem,
                        width = next.width(),
                        height = next.height(),
                        opacity = next.css("opacity"),
                        left = next.css("left"),
                        top = next.css("top"),
                        zIndex = next.css("zIndex");

                    zIndexArr.push(zIndex);
                    self.animate({
                        width: width,
                        height: height,
                        //zIndex :zIndex,
                        opacity: opacity,
                        left: left,
                        top: top
                    }, _this_.setting.speed, function () {
                        _this_.rotateFlag = true;
                    });
                    var index = self.parent().children().index(self);
                    var nextIndex = self.parent().children().index(next);
                    var oCircle = $(".circle").children("li");
                    if(oCircle.eq(nextIndex).hasClass("active") && !activeChange2){
                        activeChange2 = true;
                        oCircle.eq(nextIndex).removeClass("active");
                        oCircle.eq(index).addClass("active");
                    }
                });
                //zIndex需要单独保存再设置，防止循环时候设置再取的时候值永远是最后一个的zindex
                this.posterItems.each(function (i) {
                    $(this).css("zIndex", zIndexArr[i]);
                });
            }
            ;
        },
        //设置剩余的帧的位置关系
        /*setPosterPos: function () {
            var self = this,
                sliceItems = this.posterItems.slice(1),
                sliceSize = sliceItems.size() / 2,
                rightSlice = sliceItems.slice(0, sliceSize),
                //存在图片奇偶数问题
                level = Math.floor(this.posterItems.size() / 2),
                leftSlice = sliceItems.slice(sliceSize);

            //设置右边帧的位置关系和宽度高度top
            var firstLeft = (this.poster.width() - this.poster.width() * 0.75) / 2;
            var rw = this.poster.width() * 0.75,
                fixOffsetLeft = firstLeft + rw,
                rh = this.poster.width() * 0.32 * 0.75,
                gap = ((this.poster.width() - this.poster.width() * 0.75) / 2);

            //设置右边位置关系
            rightSlice.each(function (i) {
                level--;
                rw = rw * self.setting.scale;
                rh = rh * self.setting.scale;
                if (i == 0) {
                    $(this).css({
                        zIndex: level,
                        width: rw,
                        height: rh,
                        opacity: 1,
                        left: fixOffsetLeft + (++i) * gap - rw,
                        top: self.setVerticalAlign(rh / 0.75)
                    });
                } else {
                    $(this).css({
                        zIndex: level,
                        width: rw,
                        height: rh,
                        opacity: 0,
                        left: 0,
                        top: self.setVerticalAlign(rh / 0.75)
                    });
                }
            });

            //设置左边的位置关系
            var lw = rightSlice.last().width(),
                lh = rightSlice.last().height(),
                oloop = Math.floor(this.posterItems.size() / 2);
            leftSlice.each(function (i) {
                if (i == sliceSize - 1) {
                    $(this).css({
                        zIndex: i,
                        width: lw,
                        height: lh,
                        opacity: 1,
                        left: i * gap / level,
                        top: self.setVerticalAlign(lh / 0.75)
                    });
                } else {
                    $(this).css({
                        zIndex: i,
                        width: lw,
                        height: lh,
                        opacity: 0,
                        left: 0,
                        top: self.setVerticalAlign(lh / 0.75)
                    });
                }

                lw = lw / self.setting.scale;
                lh = lh / self.setting.scale;
                oloop--;
            });
        },*/

        //设置垂直排列对齐
        setVerticalAlign: function (height) {
            var verticalType = this.setting.verticalAlign,
                top = 0;
            if (verticalType === "middle") {
                top = (this.poster.width() * 0.32 - height) / 2 * 0.75;
            } else if (verticalType === "top") {
                top = 0;
            } else if (verticalType === "bottom") {
                top = this.poster.width() * 0.32 - height;
            } else {
                top = (this.poster.width() * 0.32 - height) / 2;
            }
            ;
            return top;
        },

        //设置配置参数值去控制基本的宽度高度。。。
        setSettingValue: function () {
            var self = this;
            this.poster.css({
                width: "100%",
                height: this.poster.width() * 0.32 * 0.75
            });
            this.posterItemMain.css({
                width: "100%",
                height: this.poster.width() * 0.32 * 0.75
            });
            //计算上下切换按钮的宽度
            var w = (this.poster.width() - this.poster.width() * 0.75) / 2;
            //设置切换按钮的宽高，层级关系
            this.nextBtn.css({
                width: w,
                height: this.poster.width() * 0.32 * 0.75,
                zIndex: Math.ceil(this.posterItems.size() / 2)
            });
            this.prevBtn.css({
                width: w,
                height: this.poster.width() * 0.32 * 0.75,
                zIndex: Math.ceil(this.posterItems.size() / 2)
            });
            this.posterItems.each(function (i) {
                if(i != 0 && i!=1 && i != self.posterItems.size()-1){
                    $(this).css({
                        zIndex: 0,
                        width: self.poster.width() * 0.75 * self.setting.scale,
                        height: self.poster.width() * 0.32 * 0.75 * self.setting.scale,
                        opacity: 0,
                        left: (self.poster.width() - self.poster.width() * 0.75)/2,
                        top: self.setVerticalAlign((self.poster.width() * 0.32 * 0.75 * self.setting.scale) / 0.75)
                    })
                }
                /*if(self.posterItems.size()>=3){

                }*//*else{
                    if(i!=0 && i !=self.posterItems.size()-1){
                        $(this).css({
                            zIndex: 0,
                            width: self.poster.width() * 0.75 * self.setting.scale,
                            height: self.poster.width() * 0.32 * 0.75 * self.setting.scale,
                            opacity: 0,
                            left: (self.poster.width() - self.poster.width() * 0.75)/2,
                            top: self.setVerticalAlign((self.poster.width() * 0.32 * 0.75 * self.setting.scale) / 0.75)
                        })
                    }
                }*/

            });
            this.posterFirstItem.css({
                width: this.poster.width() * 0.75,
                height: this.poster.width() * 0.32 * 0.75,
                left: w,
                top: 0,
                zIndex: 2,
                opacity: 1
            });
            this.posterLastItem.css({
                width: this.poster.width() * 0.75 * this.setting.scale,
                height: this.poster.width() * 0.32 * 0.75 * this.setting.scale,
                left: 0,
                top: this.setVerticalAlign((this.poster.width() * 0.32 * 0.75 * this.setting.scale) / 0.75),
                zIndex: 1,
                opacity: 1
            });
            this.posterSecondItem.css({
                width: this.poster.width() * 0.75 * this.setting.scale,
                height: this.poster.width() * 0.32 * 0.75 * this.setting.scale,
                left: this.poster.width() - this.poster.width() * 0.75 *this.setting.scale,
                top: this.setVerticalAlign((this.poster.width() * 0.32 * 0.75 * this.setting.scale) / 0.75),
                zIndex: 1,
                opacity: 1
            })
        },

        //获取人工配置参数
        getSetting: function () {
            var setting = this.poster.attr("data-setting");
            if (setting && setting != "") {
                return $.parseJSON(setting);
            } else {
                return {};
            }
            ;
        },
        toggleImg: function (from, to, posters) {
            var items = posters.children("ul").children("li");
            var prevIndex;
            var itemsLength = items.length;
            var count;
            var zIndexArr = [];
            var oCircle = $(".circle").children("li");
            var activeChange = false;
            if (from < to) {
                count = to - from;
                count = itemsLength - count;
                items.each(function (index) {
                    prevIndex = (index + count) >= itemsLength ? (index + count - itemsLength) : (index + count);
                    var self = $(this),
                        prev = self.parent().children("li").eq(prevIndex),
                     width = prev[0].style.width,
                     height = prev[0].style.height,
                     opacity = prev.css("opacity"),
                     left = prev[0].style.left,
                     top = prev[0].style.top,
                     zIndex = prev.css("zIndex");

                     zIndexArr.push(zIndex);
                     self.animate({
                     width: width,
                     height: height,
                     //zIndex :zIndex,
                     opacity: opacity,
                     left: left,
                     top: top
                     }, 500);
                    if(oCircle.eq(prevIndex).hasClass("active") && !activeChange){
                        activeChange = true;
                        oCircle.eq(prevIndex).removeClass("active");
                        oCircle.eq(index).addClass("active");
                    }
                });
                //zIndex需要单独保存再设置，防止循环时候设置再取的时候值永远是最后一个的zindex
                items.each(function (i) {
                 $(this).css("zIndex", zIndexArr[i]);
                 });
                // posters.find("div.poster-next-btn").click();
            } else if (from > to) {
                count = from - to;
                items.each(function (index) {
                    prevIndex = (index + count) >= itemsLength ? (index + count - itemsLength) : (index + count);
                    var self = $(this),
                        prev = self.parent().children("li").eq(prevIndex),
                        width = prev[0].style.width,
                        height = prev[0].style.height,
                        opacity = prev.css("opacity"),
                        left = prev[0].style.left,
                        top = prev[0].style.top,
                        zIndex = prev.css("zIndex");

                    zIndexArr.push(zIndex);
                    self.animate({
                        width: width,
                        height: height,
                        //zIndex :zIndex,
                        opacity: opacity,
                        left: left,
                        top: top
                    }, 500);
                    if(oCircle.eq(prevIndex).hasClass("active") && !activeChange){
                        activeChange = true;
                        oCircle.eq(prevIndex).removeClass("active");
                        oCircle.eq(index).addClass("active");
                    }
                });
                //zIndex需要单独保存再设置，防止循环时候设置再取的时候值永远是最后一个的zindex
                items.each(function (i) {
                    $(this).css("zIndex", zIndexArr[i]);
                });
                // posters.find("div.poster-next-btn").click();
            }

        }
    };

    Carousel.init = function (posters) {
        var _this_ = this;
        posters.each(function () {
            var car = new _this_($(this));
            if (!Array.isArray(window.cars)){
                window.cars = [];
            }
            window.cars.push(car);

        });
    };
    //挂载到window下
    window["Carousel"] = Carousel;

    window.addEventListener('resize',function () {
        if (Array.isArray(window.cars)){
            $.each(window.cars,function (i, c) {
                window.clearInterval(c.timer);
                c.setSettingValue();
                c.autoPlay();
            });
        }
    });

})(jQuery);