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

    var Paddle = cc.Layer.extend({
        beginNode: null,
        endNode: null,
        point: null,
        ctor: function () {
            this._super();
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: this.onTouchBegan,
                onTouchMoved: this.onTouchMoved,
                onTouchEnded: this.onTouchEnded
            }, this);
        },

        onTouchBegan: function (touch, event) {
            var pos = touch.getLocation();
            var id = touch.getID();
            cc.log("onTouchBegan at: " + pos.x + " " + pos.y + " Id:" + id);
            g_Layer.beginNode = new cc.DrawNode();
            g_Layer.addChild(g_Layer.beginNode);
            g_Layer.point = pos;
            return true;
        },
        onTouchMoved: function (touch, event) {
            var pos = touch.getLocation();
            var id = touch.getID();
            cc.log("onTouchMoved at: " + pos.x + " " + pos.y + " Id:" + id);
            //1. rotate
            
            //2. draw
            
            //1.remove child
            g_Layer.removeChild(g_Layer.beginNode);
            g_Layer.beginNode = null;
            g_Layer.beginNode = new cc.DrawNode();
            g_Layer.addChild(g_Layer.beginNode);
            g_Layer.beginNode.drawSegment(g_Layer.point, pos, 1, cc.color(255, 0, 255, 255));
        },
        onTouchEnded: function (touch, event) {
            var pos = touch.getLocation();
            var id = touch.getID();
            cc.log("onTouchEnded at: " + pos.x + " " + pos.y + " Id:" + id);
        },
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
            this.addChild(layer);
            
            var layer_1 = new Paddle();
            g_Layer = layer_1;
            this.addChild(layer_1);
        }
    });
    cc.game.onStart = function () {
        cc.LoaderScene.preload(g_resources, function () {
            cc.director.runScene(new HelloWorldScene());
        }, this);
    };
    cc.game.run("gameCanvas");
});