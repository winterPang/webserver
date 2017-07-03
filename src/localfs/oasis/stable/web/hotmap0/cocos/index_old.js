
$(function () {

    var res = {
        HelloWorld_png: "./res/HelloWorld.png",
        CloseNormal_png: "./res/CloseNormal.png",
        CloseSelected_png: "./res/CloseSelected.png",
        Scale_png: "./res/scale.jpg"
    };

    var g_resources = [];
    for (var i in res) {
        g_resources.push(res[i]);
    }

    var myLayer = cc.Layer.extend({
        sprite: null,
        ctor: function () {
            this._super();
            var size = cc.winSize;
            this.sprite = new cc.Sprite(res.Scale_png);
            this.sprite.attr({
                x: size.width / 2,
                y: size.height / 2,
            });
            this.addChild(this.sprite, 0);
            return true;
        }
    });

    var touchEvent = cc.Layer.extend({
        ctor: function() {
            this._super();
            this.init();
        },
        init: function () {
            this._super();
            if ('touches' in cc.sys.capabilities) {
                cc.eventManager.addListener({
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: true,
                    onTouchBegan: this.onTouchBegan,
                    onTouchMoved: this.onTouchMoved,
                    onTouchEnded: this.onTouchEnded,
                    onTouchCancelled: this.onTouchCancelled
                }, this);
            } else {
                cc.log("TOUCH-ONE-BY-ONE test is not supported on desktop");
            }
        },
        onTouchBegan: function (touch, event) {
            /*
            var pos = touch.getLocation();
            var id = touch.getID();
            cc.log("onTouchBegan at: " + pos.x + " " + pos.y + " Id:" + id);
            if (pos.x < winSize.width / 2) {
                event.getCurrentTarget().new_id(id, pos);
                return true;
            }
            */
            console.log("began");
            return false;
        },
        onTouchMoved: function (touch, event) {
            /*
            var pos = touch.getLocation();
            var id = touch.getID();
            cc.log("onTouchMoved at: " + pos.x + " " + pos.y + " Id:" + id);
            event.getCurrentTarget().update_id(id, pos);
            */
            console.log("move");
        },
        onTouchEnded: function (touch, event) {
            /*
            var pos = touch.getLocation();
            var id = touch.getID();
            cc.log("onTouchEnded at: " + pos.x + " " + pos.y + " Id:" + id);
            event.getCurrentTarget().release_id(id, pos);
            */
            console.log("end");
        },
        onTouchCancelled: function (touch, event) {
            /*
            var pos = touch.getLocation();
            var id = touch.getID();
            cc.log("onTouchCancelled at: " + pos.x + " " + pos.y + " Id:" + id);
            event.getCurrentTarget().update_id(id, pos);
            */
            console.log("cancelled");
        }
    })

    var wallLayer = cc.Layer.extend({
        sprite: null,
        ctor: function () {
            this._super();


            var winSize = cc.director.getWinSize();

            var draw = new cc.DrawNode();
            this.addChild(draw);
            draw.drawSegment(cc.p(0, 0), cc.p(winSize.width, winSize.height), 1, cc.color(255, 255, 255, 255));

            return true;
        }
    });

    var HelloWorldLayer = cc.Layer.extend({
        sprite: null,
        ctor: function () {
            //////////////////////////////
            // 1. super init first
            this._super();

            /////////////////////////////
            // 2. add a menu item with "X" image, which is clicked to quit the program
            //    you may modify it.
            // ask the window size
            var size = cc.winSize;

            // add a "close" icon to exit the progress. it's an autorelease object
            var closeItem = new cc.MenuItemImage(
                res.CloseNormal_png,
                res.CloseSelected_png,
                function () {
                    cc.log("Menu is clicked!");
                }, this);
            closeItem.attr({
                x: size.width - 20,
                y: 20,
                anchorX: 0.5,
                anchorY: 0.5
            });

            var menu = new cc.Menu(closeItem);
            menu.x = 0;
            menu.y = 0;
            this.addChild(menu, 1);

            /////////////////////////////
            // 3. add your codes below...
            // add a label shows "Hello World"
            // create and initialize a label
            var helloLabel = new cc.LabelTTF("Hello World", "Arial", 38);
            // position the label on the center of the screen
            helloLabel.x = size.width / 2;
            helloLabel.y = 0;
            // add the label as a child to this layer
            this.addChild(helloLabel, 5);

            // add "HelloWorld" splash screen"
            this.sprite = new cc.Sprite(res.HelloWorld_png);
            this.sprite.attr({
                x: size.width / 2,
                y: size.height / 2,
                scale: 0.5,
                rotation: 180
            });
            this.addChild(this.sprite, 0);

            this.sprite.runAction(
                cc.sequence(
                    cc.rotateTo(2, 0),
                    cc.scaleTo(2, 1, 1)
                    )
                );
            helloLabel.runAction(
                cc.spawn(
                    cc.moveBy(2.5, cc.p(0, size.height - 40)),
                    cc.tintTo(2.5, 255, 125, 0)
                    )
                );
            return true;
        }
    });
    var g_Layer;
    var HelloWorldScene = cc.Scene.extend({
        onEnter: function () {
            this._super();
            var layer = new HelloWorldLayer();
            g_Layer = layer;
            this.addChild(layer);

            var layer1 = new myLayer();
            this.addChild(layer1);

            var wall = new wallLayer();
            this.addChild(wall);
            
            var touch = new touchEvent();
            this.addChild(touch);
        }
    });


    $("#upload_file").change(function (e) {
        //console.log(e);
        var reader = new FileReader();
        reader.onload = function (e) {
            var logoData = e.target.result;
            cc.loader.loadImg(logoData, { isCrossOrigin: false }, function (err, img) {
                console.log("Hello");
                var size = cc.winSize;
                var logoWidth = img.width;
                var logoHeight = img.height;
                var sprite = new cc.Sprite(img);
                sprite.attr({
                    x: size.width / 2,
                    y: size.height / 2,
                });
                g_Layer.addChild(sprite);
            });
        }
        reader.readAsDataURL(e.target.files[0]);
    });

    cc.game.onStart = function () {
        cc.LoaderScene.preload(g_resources, function () {
            cc.director.runScene(new HelloWorldScene());
        }, this);
    };
    cc.game.run("gameCanvas");
    /*
        cc.game.onStart = function () {
            //load resources
            cc.LoaderScene.preload(["HelloWorld.png"], function () {
                var MyScene = cc.Scene.extend({
                    onEnter: function () {
                        this._super();
                        var size = cc.director.getWinSize();
                        var sprite = cc.Sprite.create("HelloWorld.png");
                        sprite.setPosition(size.width / 2, size.height / 2);
                        sprite.setScale(0.8);
                        this.addChild(sprite, 0);
    
                        var label = cc.LabelTTF.create("Hello World", "Arial", 40);
                        label.setPosition(size.width / 2, size.height / 2);
                        this.addChild(label, 1);
                    }
                });
                cc.director.runScene(new MyScene());
            }, this);
        };
        cc.game.run("gameCanvas");
        */
})