var cc;

; (function ($) {
    var WIDGETNAME = "Cocos";

    var g_Res = {
        Scale_png: "../position/cocos/res/scale.jpg",
        Ap_png: "../position/cocos/res/ap.jpg",
        WhiteBoard_png: "../position/cocos/res/whiteBoard.png",
        Client_png: "../position/cocos/res/client.png",
        Ap_Client_png: "../position/cocos/res/client_ap01.png",
        Client_white_png: "../position/cocos/res/client_ap_white.png"
    };


    function init_WallLayer(Cocos) {
        var DrawWallLine = cc.Node.extend({
            beginPos: null,
            ctor: function (beginPos) {
                this._super();
                this.beginPos = beginPos;
                this.drawNode = new cc.DrawNode();
                this.addChild(this.drawNode);

            },
            drawLine: function (endPos) {
                this.drawNode.clear();
                this.drawNode.drawSegment(this.beginPos, endPos, 1, cc.color(255, 0, 255, 255));
                this.endPos = endPos;
            }
        });

        var DrawWallRect = cc.Node.extend({
            ctor: function (beginPos, endPos, wallWidth, wallName, editAble) {
                this._super();

                var centerX = (beginPos.x + endPos.x) / 2;
                var centerY = (beginPos.y + endPos.y) / 2;

                this.wallWidth = wallWidth;

                var x1 = beginPos.x - centerX;
                var y1 = beginPos.y - centerY;
                var x2 = endPos.x - centerX;
                var y2 = endPos.y - centerY;

                var sin, cos;
                if (x1 == x2) {
                    sin = 1;
                    cos = 0;
                }
                else {
                    var k = (y2 - y1) / (x2 - x1);//warning x2 === x1
                    cos = Math.sqrt(1 / (1 + k * k)) * (k >= 0 ? 1 : -1);
                    sin = Math.sqrt(1 - 1 / (1 + k * k));
                }
                var detY = wallWidth / 2 * cos; //有可能小于0
                var detX = wallWidth / 2 * sin; //恒大于0

                var vertices = [
                    cc.p(x1 - detX, y1 + detY),
                    cc.p(x1 + detX, y1 - detY),
                    cc.p(x2 + detX, y2 - detY),
                    cc.p(x2 - detX, y2 + detY),
                ];

                var maxPoint = {
                    x: vertices[0].x,
                    y: vertices[0].y
                };
                var minPoint = {
                    x: vertices[0].x,
                    y: vertices[0].y
                };
                vertices.forEach(function (point) {
                    if (point.x >= maxPoint.x) {
                        maxPoint.x = point.x;
                    }
                    if (point.x < minPoint.x) {
                        minPoint.x = point.x;
                    }
                    if (point.y >= maxPoint.y) {
                        maxPoint.y = point.y;
                    }
                    if (point.y < minPoint.y) {
                        minPoint.y = point.y;
                    }
                });

                this.attr({
                    anchorX: 0.5,
                    anchorY: 0.5,
                    x: centerX,//画线中点坐标为 中心坐标
                    y: centerY,
                });

                this.beginPos = {//相对坐标
                    x: beginPos.x - centerX,
                    y: beginPos.y - centerY
                };
                this.endPos = {//相对坐标
                    x: endPos.x - centerX,
                    y: endPos.y - centerY
                };

                this.h3c = {
                    wallName: wallName,
                    wallWidth: wallWidth,
                    beginPos: beginPos,
                    endPos: endPos
                };

                this.drawNode = new cc.DrawNode();
                this.addChild(this.drawNode);
                this.drawNode.drawWall(vertices, cc.color(255, 0, 0), 1, cc.color(0, 0, 0, 0));

                this.editAble = editAble || false;
            },
            onEnter: function () {
                this._super();
                if (this.editAble) {
                    //console.log("enable wall rect");
                    cc.eventManager.addListener({
                        event: cc.EventListener.TOUCH_ONE_BY_ONE,
                        swallowTouches: true,
                        onTouchBegan: this.onTouchBegan,
                        onTouchMoved: this.onTouchMoved,
                        onTouchEnded: this.onTouchEnded
                    }, this);
                }
            },
            onTouchBegan: function (touch, event) {
                var node = this._node;
                var position = node.getPosition();
                var touchPoint = touch.getLocation();
                var x0 = touchPoint.x - position.x;
                var y0 = touchPoint.y - position.y;
                var x1 = node.beginPos.x;
                var y1 = node.beginPos.y;
                var x2 = node.endPos.x;
                var y2 = node.endPos.y;
                var k = (y1 - y2) / (x1 - x2);
                var dis = (k * (x0 - x1) + y1 - y0) / (Math.sqrt(k * k + 1));
                if (Math.abs(dis) < node.wallWidth / 2) {//这里有很大的问题啊 ！！！！！
                    return true;
                }
                return false;
            },
            onTouchMoved: function (touch, event) {
                var node = this._node;
                var touchPoint = touch.getLocation();
                node.setPosition(touchPoint.x, touchPoint.y);

                node.h3c.beginPos = cc.p(touchPoint.x + node.beginPos.x, touchPoint.y + node.beginPos.y);//转换为绝对坐标
                node.h3c.endPos = cc.p(touchPoint.x + node.endPos.x, touchPoint.y + node.endPos.y);
            },
            onTouchEnded: function (touch, event) {

            }
        });

        var WallLayer = cc.Layer.extend({
            WallNodeList: {},
            wallIndex: 0,
            baseLine: null,
            ctor: function (editAble) {
                this._super();

                this._listener = cc.EventListener.create({
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: true,
                    onTouchBegan: this.onTouchBegan,
                    onTouchMoved: this.onTouchMoved,
                    onTouchEnded: this.onTouchEnded
                });

                this.setEditAble(editAble);
            },
            onEnter: function () {
                this._super();
            },
            setEditAble: function (editAble) {
                this.editAble = editAble || false;
                if (this.editAble) {
                    cc.eventManager.addListener(this._listener, this);
                }
                else {
                    cc.eventManager.removeListener(this._listener);
                }
            },
            getEditAble: function () {
                return this.editAble
            },
            onTouchBegan: function (touch, event) {
                var pos = touch.getLocation();
                var line = new DrawWallLine(pos);
                this._node.addChild(line);
                this._node.baseLine = line;
                return true;
            },
            onTouchMoved: function (touch, event) {
                var line = this._node.baseLine;
                line.drawLine(touch.getLocation());
            },
            onTouchEnded: function (touch, event) {
                var line = this._node.baseLine;
                var beginPos = line.beginPos;
                var endPos = line.endPos;

                if (!endPos) {
                    return;
                }

                var rect = new DrawWallRect(beginPos, endPos, 5, this._node.wallIndex, true);
                this._node.addChild(rect);
                this._node.removeChild(line, false);
                this._node.baseLine = null;
            },
            clean: function () {
                this.removeAllChildren(false);
                this.wallIndex = 0;
                this.wallNodeList = {};
            },
            drawWallNodes: function (wallList, editAble) {
                var layer = this;

                wallList.forEach(function (wallNode) {
                    var beginPos = wallNode.beginPos;
                    var endPos = wallNode.endPos;
                    var rect = new DrawWallRect(beginPos, endPos, 5, wallNode.wallName, editAble || false);
                    layer.addChild(rect);
                });
            },
            addChild: function (child, zOrder, tag) {
                if (child instanceof DrawWallRect) {
                    this.wallNodeList[child.h3c.wallName] = child;
                    this.wallIndex = (this.wallIndex < child.h3c.wallName ? child.h3c.wallName : this.wallIndex);
                    this.wallIndex++;
                    //console.log("add wall , wallName: " + child.h3c.wallName);
                    //console.log("wallIndex: " + this.wallIndex);
                }
                this._super(child, zOrder, tag);
            },
            removeChild: function (sprite, cleanup) {
                //console.log("removeChild");
                if (sprite instanceof DrawWallRect) {
                    delete this.wallNodeList[sprite.h3c.wallName];
                    //this.wallIndex--;
                    //console.log("delete wall , wallName: " + sprite.h3c.wallName);
                    //console.log("wallIndex: " + this.wallIndex++);
                }
                this._super(sprite, cleanup);
            },
            getWallList: function () {
                var wallList = [];
                var wallNodeList = this.wallNodeList;
                for (var wallName in wallNodeList) {
                    var wallNode = wallNodeList[wallName];
                    wallList.push(wallNode.h3c);
                }
                return wallList;
            }
        });

        Cocos.WallLayer = function () {
            return WallLayer
        }

        Cocos.DrawWallLine = function () {
            return DrawWallLine;
        }

        Cocos.DrawWallRect = function () {
            return DrawWallRect;
        }
    }

    function init_ApLayer(Cocos) {
        var ApNode = cc.Sprite.extend({
            ctor: function (x, y, apName, macAddr, status, editAble) {
                this.h3c = {
                    apName: apName,
                    macAddr: macAddr,
                    XCord: x,
                    YCord: y,
                    status: status || 2//1-在线 2-离线 3-版本下载
                };
                switch (this.h3c.status) {
                    case 1:
                        this._super(g_Res.Ap_Client_png, cc.rect(138, 220, 66, 60));
                        break;
                    case 2:
                        this._super(g_Res.Ap_Client_png, cc.rect(138, 100, 66, 60));
                        break;
                    default:
                        break;
                }
                this.attr({
                    x: x,
                    y: y,
                    anchorX: 0.5,
                    anchorY: 0.3,
                    scale: 0.4
                });


                if (this.h3c.status == 2) {
                    this.setColor(cc.color(128, 128, 128, 100));
                }

                this.editAble = editAble || false;
                var myLabel = new cc.LabelTTF(apName, 'Arial', /*80*/30, cc.size(0, 0));
                myLabel.setPosition(cc.p(35, -20));
                myLabel.setColor(cc.color(128, 128, 128, 255));
                this.addChild(myLabel);
            },
            onEnter: function () {
                this._super();
                if (this.editAble) {
                    cc.eventManager.addListener({
                        event: cc.EventListener.TOUCH_ONE_BY_ONE,
                        swallowTouches: true,
                        onTouchBegan: this.onTouchBegan,
                        onTouchMoved: this.onTouchMoved,
                        onTouchEnded: this.onTouchEnded
                    }, this);
                }
            },
            onTouchBegan: function (touch, event) {
                var node = this._node;
                if (cc.rectContainsPoint(node.getBoundingBox(), touch.getLocation())) {
                    //添加label 显示当前坐标
                    var pos = node.getPosition();
                    var realPosX = (pos.x - 50) * cc.scale;
                    var realPosY = (pos.y - 50) * cc.scale;
                    //var labelStr = "x: " + parseInt(realPosX) + "m" + "\n" + "y: " + parseInt(realPosY) + "m";
                    //var labelStr = "x: " + realPosX.toFixed(2) + "m" + "\n" + "y: " + realPosY.toFixed(2) + "m";
                    var labelStr = "(" + realPosX.toFixed(2) + "," + realPosY.toFixed(2) + ")";
                    var label = new cc.LabelTTF(labelStr, 'Arial', 30, cc.size(0, 0));
                    //label.setPosition(cc.p(35, 60));
                    label.setPosition(cc.p(150, 20));
                    label.setColor(cc.color(128, 128, 128, 255));
                    node.addChild(label);
                    node.posLabel = label;
                    $("#gameCanvas").css("cursor", "pointer");
                    return true;
                }
                return false;
            },
            onTouchMoved: function (touch, event) {
                var node = this._node;
                var pos = touch.getLocation();
                this._node.attr({
                    x: pos.x,
                    y: pos.y
                });
                this._node.h3c.XCord = pos.x;
                this._node.h3c.YCord = pos.y;

                var realPosX = (pos.x - 50) * cc.scale;
                var realPosY = (pos.y - 50) * cc.scale;
                //var labelStr = "x: " + realPosX.toFixed(2) + "m" + "\n" + "y: " + realPosY.toFixed(2) + "m";
                var labelStr = "(" + realPosX.toFixed(2) + "," + realPosY.toFixed(2) + ")";
                node.posLabel.setString(labelStr);
            },
            onTouchEnded: function (touch, event) {
                var node = this._node;
                var posLabel = node.posLabel;
                node.removeChild(posLabel);
                $("#gameCanvas").css("cursor", "");
                //删除当前坐标
            },
            removeFromParent: function (cleanup) {
                this._super(cleanup);//会调用父类的removeChild函数  所以不用搞
            }
        });

        var ApLayer = cc.Layer.extend({
            apNodeList: {},
            ctor: function (editAble) {
                this._super();
                //this.apNodeList = {};//不用array 因为删除比较麻烦
                this.editAble = editAble || false;
            },
            clean: function () {
                this.apNodeList = {};
                this.removeAllChildrenWithCleanup(false);
            },
            drawApNodes: function (apList, opacity) {
                var layer = this;
                apList.forEach(function (apNode) {
                    var apName = apNode.apName;
                    var macAddr = apNode.macAddr;
                    var XCord = apNode.XCord;
                    var YCord = apNode.YCord;
                    var status = apNode.status;
                    var ap = new ApNode(XCord, YCord, apName, macAddr, status, layer.editAble);
                    ap.setOpacity(opacity || 255);
                    layer.addChild(ap);
                });
            },
            addChild: function (child, zOrder, tag) {
                var apNodeList = this.apNodeList;
                var apName = child.h3c.apName;
                if (apName in apNodeList) {
                    //console.log("error:  apName: " + apName + " exist in apNodeList");
                    return;
                }
                this.apNodeList[apName] = child;
                this._super(child, zOrder, tag);
            },
            removeChild: function (sprite, cleanup) {
                this._super(sprite, cleanup);
                delete this.apNodeList[sprite.h3c.apName];
            },
            getApList: function () {
                var apList = [];
                var apNodeList = this.apNodeList;
                for (var apName in apNodeList) {
                    var apNode = apNodeList[apName];
                    apList.push(apNode.h3c);
                }
                return apList;
            }
        });

        Cocos.ApNode = function () {
            return ApNode;
        }
        Cocos.ApLayer = function () {
            return ApLayer;
        }
    }

    function init_ClientLayer(Cocos) {
        var ClientNode = cc.Sprite.extend({
            ctor: function (x, y, clientMac, status) {
                this.h3c = {
                    clientMac: clientMac,
                    XCord: x,
                    YCord: y,
                    status: status || 0//0-不在线 1-在线
                };
                switch (this.h3c.status) {
                    case 0:
                        this._super(g_Res.Ap_Client_png, cc.rect(255, 102, 35, 60));
                        break;
                    case 1:
                        this._super(g_Res.Ap_Client_png, cc.rect(255, 222, 35, 60));
                        break;
                    default:
                        break;
                }
                this.attr({
                    x: x,
                    y: y,
                    scale: 0.4
                });

                var myLabel = new cc.LabelTTF(clientMac, 'Arial', /*80*/35, cc.size(0, 0));
                myLabel.setPosition(cc.p(30, -20));
                myLabel.setColor(cc.color(128, 128, 128, 255));
                this.addChild(myLabel);

                if (this.h3c.status == 0) {// 不在线
                    this.setColor(cc.color(128, 128, 128, 100));
                }

                var width = this.width;
                var height = this.height;
                //console.log("width: " + width);
                //console.log("height: " + height);

                var drawNode = new cc.DrawNode();
                drawNode.drawRect(cc.p(4, 0), cc.p(30, 50), cc.color(255, 255, 255), 1, cc.color(255, 255, 255));
                drawNode.attr({ zIndex: -1 })
                this.addChild(drawNode);
            }
        });

        var ClientLayer = cc.Layer.extend({
            clientNodeList: {},
            ctor: function () {
                this._super();
            },
            onExist: function () {
                //这里还没做
                //console.log("onExist");
                this._scheduler.unscheduleCallbackForTarget(this, this.updateClientNode);
            },
            clean: function () {
                this.clientNodeList = {};
                this.removeAllChildrenWithCleanup(false);
            },
            drawClientNodes: function (clientList) {
                var layer = this;
                clientList.forEach(function (Node) {
                    var clientMac = Node.clientMac;
                    var XCord = Node.XCord;
                    var YCord = Node.YCord;
                    var clientStatus = Node.clientStatus;
                    var client = new ClientNode(XCord, YCord, clientMac, clientStatus);
                    layer.addChild(client);
                });
            },
            addChild: function (child, zOrder, tag) {
                var clientNodeList = this.clientNodeList;
                var clientMac = child.h3c.clientMac;
                if (clientMac in clientNodeList) {
                    return;
                }
                this.clientNodeList[clientMac] = child;
                this._super(child, zOrder, tag);
            },
            removeChild: function (sprite, cleanup) {
                this._super(sprite, cleanup);
                delete this.clientNodeList[sprite.h3c.clientMac];
            },
            startUpDate: function (getClientNode, mapName) {
                this.getClientNode = getClientNode;
                this.mapName = mapName;
                this.updateClientNode();// 先更新一次
                this._scheduler.scheduleCallbackForTarget(this, this.updateClientNode, 2, cc.REPEAT_FOREVER, 0);
            },
            updateClientNode: function (dt) {
                this.getClientNode();
            },
            stopUpDate: function () {
                this._scheduler.unscheduleCallbackForTarget(this, this.updateClientNode);
            }
        });

        var ClientMoveToAction = cc.MoveTo.extend({
            ctor: function (duration, begPoint, endPoint, layer) {
                this._super(duration, endPoint);
                this.endPosX = endPoint.x;
                this.endPosY = endPoint.y;
                this.layer = layer;
                this.beginPos = begPoint;

                this.drawNode = new cc.DrawNode();
                this.layer.addChild(this.drawNode, -2);
                this.lastBeginPoint = begPoint;
            },
            update: function (dt) {
                this._super(dt);
                if (this.target) {
                    var curPosX = this.target.getPositionX();
                    var curPosY = this.target.getPositionY();
                    if (Math.abs(this.endPosX - curPosX) < 0.1 && Math.abs(this.endPosY - curPosY) < 0.1) {
                        //console.log("action done");
                        /*
                        var clientNode = new ClientNode(this.endPosX, this.endPosY, "");
                        clientNode.setColor(cc.color(231, 231, 233));
                        this.layer.addChild(clientNode);
                        */
                    }
                }

                var drawNode = this.drawNode;
                var tarPos = this.target.getPosition();
                var tarPosX = tarPos.x;
                var tarPosY = tarPos.y;
                var lastBeginPoint = this.lastBeginPoint;
                var lastBeginPointX = lastBeginPoint.x;
                var lastBeginPointY = lastBeginPoint.y;

                var distance = Math.sqrt((tarPosX - lastBeginPointX) * (tarPosX - lastBeginPointX) + (tarPosY - lastBeginPointY) * (tarPosY - lastBeginPointY));
                if (distance <= 5) {
                    drawNode.clear();
                    drawNode.drawSegment(lastBeginPoint, tarPos, 1, cc.color(254, 128, 139, 255));
                }
                else if (distance >= 12) {
                    this.drawNode = new cc.DrawNode();
                    this.layer.addChild(this.drawNode, -2);
                    this.lastBeginPoint = tarPos;
                }
            }
        });

        var ClientMoveToAction_new = cc.MoveTo.extend({
            ctor: function (duration, begPoint, endPoint, layer) {
                this._super(duration, endPoint);
                this.layer = layer;

                this.drawNode = new cc.DrawNode();
                this.layer.addChild(this.drawNode, -2);
                this.lastBeginPoint = begPoint;
            },
            update: function (dt) {
                this._super(dt);
                if (this.target) {

                }
            }
        })

        var ConnectLineNode = cc.Node.extend({
            ctor: function (beginPos, endPos) {
                this._super();
                this.beginPos = beginPos;
                this.endPos = endPos;
                /*
                var drawNode = new cc.DrawNode();
                drawNode.drawSegment(beginPos, endPos, 1, cc.color(255, 0, 255, 255));

                this.drawNode = drawNode;
                this.addChild(drawNode);
                */

                var x1 = beginPos.x;
                var y1 = beginPos.y;
                var x2 = endPos.x;
                var y2 = endPos.y;

                var xLen = x2 - x1;
                var yLen = y2 - y1;

                var k = yLen / xLen;//
                
                var detX1 = (x2 - x1 >= 0 ? Math.sqrt(12 * 12 / (k * k + 1)) : -Math.sqrt(12 * 12 / (k * k + 1)));//Math.sqrt(12*12/(k*k + 1));
                var detY1 = detX1 * k;

                var detX2 = (x2 - x1 >= 0 ? Math.sqrt(7 * 7 / (k * k + 1)) : -Math.sqrt(7 * 7 / (k * k + 1)));//Math.sqrt(7*7/(k*k + 1));
                var detY2 = detX2 * k;

                var lineLen = Math.sqrt(xLen * xLen + yLen * yLen);
                var t = lineLen / 12;

                var drawNode = new cc.DrawNode();
                this.drawNode = drawNode;
                this.addChild(drawNode);

                for (var i = 0; i < t - 1; i++) {
                    var beginPosX = x1 + i * detX1;
                    var beginPosY = y1 + i * detY1;

                    var endPosX = beginPosX + detX2;
                    var endPosY = beginPosY + detY2;

                    drawNode.drawSegment(cc.p(beginPosX, beginPosY), cc.p(endPosX, endPosY), 1, cc.color(255, 0, 255, 255));
                }

                var beginPosX = x1 + i * detX1;
                var beginPosY = y1 + i * detY1;
                var endPosX = x2;
                var endPosY = y2;
                drawNode.drawSegment(cc.p(beginPosX, beginPosY), cc.p(endPosX, endPosY), 1, cc.color(255, 0, 255, 255));
                
                
                /*
                var beginPosX = beginPos.x;
                var beginPosY = beginPos.y;
                var endPosX = endPos.x;
                var endPosY = endPos.y;
                //var xLen = Math.abs(beginPosX - endPosX);
                //var yLen = Math.abs(beginPosY - endPosY);
                var xLen = beginPosX - endPosX;
                var yLen = beginPosY - endPosY;
                var lineLen = Math.sqrt(xLen*xLen + yLen*yLen);
                var k = 12/lineLen;
                
                var detX = xLen*k;
                var detY = yLen*k;
                
                
                
                var drawNode = new cc.DrawNode();
                for (var i  = 0; i < lineLen/12; ++i){
                    beginPos = cc.p(beginPosX + i*detX, beginPosY + i*detY);
                    endPos = cc.p(beginPosX + (i+1)*detX - 7/12*detX, beginPosY + (i+1)*detY - 7/12*detY);
                    
                    drawNode.drawSegment(beginPos, endPos, 1, cc.color(255, 0, 255, 255));
                }
                //drawNode.drawSegment(beginPos, endPos, 1, cc.color(255, 0, 255, 255));

                this.drawNode = drawNode;
                this.addChild(drawNode);
*/
            }
        })

        var TimeLayer = cc.Layer.extend({
            ctor: function () {
                this._super();

            },
            clean: function () {
                this.removeAllChildrenWithCleanup(false);
            },
            drawClientTimeNodes: function (clientArr) {//这里是画线的代码  等下要重写
            /*
                clientArr = [
                    { time: 10, XCord: 50, YCord: 50, clientMac: "0-0-0-0" },
                    { time: 20, XCord: 190, YCord: 10, clientMac: "0-0-0-0" },
                    { time: 30, XCord: 20, YCord: 280, clientMac: "0-0-0-0" },
                    { time: 40, XCord: 10, YCord: 140, clientMac: "0-0-0-0" },
                    { time: 50, XCord: 50, YCord: 550, clientMac: "0-0-0-0" },
                    { time: 60, XCord: 160, YCord: 60, clientMac: "0-0-0-0" },
                    { time: 70, XCord: 70, YCord: 270, clientMac: "0-0-0-0" },
                    { time: 80, XCord: 80, YCord: 180, clientMac: "0-0-0-0" },
                    { time: 90, XCord: 90, YCord: 190, clientMac: "0-0-0-0" },
                ]
                */
                
                var layer = this;
                var clientList = {};
                clientArr.forEach(function (client) {
                    if ((client.XCord > 0 && client.XCord < 700) && (client.YCord > 0 && client.YCord < 350)){
                        clientList[client.time] = client;
                    }
                    
                    
                    
                });
                var timeArr = [];
                for (var time in clientList) {
                    timeArr.push(time);
                    var client = clientList[time];
                    /*
                    var clientNode = new ClientNode(client.XCord, client.YCord, "");
                    clientNode.setColor(cc.color(231, 231, 233));
                    layer.addChild(clientNode);
                    */
                }
                if (timeArr.length === 0) {
                    return;
                }
                timeArr.reduce(function (x, y) {
                    var xTime = clientList[x];
                    var yTime = clientList[y];

                    var xPos = cc.p(xTime.XCord, xTime.YCord);
                    var yPos = cc.p(yTime.XCord, yTime.YCord);
                    var connectNode = new ConnectLineNode(xPos, yPos);
                    layer.addChild(connectNode, -1);
                    return y;
                });
                var lastTime = timeArr[timeArr.length - 1];
                var client = clientList[lastTime];
                this.actionClientNode = new ClientNode(client.XCord, client.YCord, client.clientMac)
                this.addChild(this.actionClientNode, 10);
            },

            startUpDate: function (getClientNode, interval) {
                this.interval = interval;
                this.getClientNode = getClientNode;
                this.updateClientNode();// 先更新一次
                this._scheduler.scheduleCallbackForTarget(this, this.updateClientNode, interval, cc.REPEAT_FOREVER, 0);
            },
            updateClientNode: function (dt) {
                this.getClientNode();
            },

            updateCallback: function (clientMsg) {
                var duration = this.interval;
                var endPoint = cc.p(clientMsg.XCord, clientMsg.YCord);
                if (this.actionClientNode) {
                    var begPoint = this.actionClientNode.getPosition();
                    var action = new ClientMoveToAction(duration, begPoint, endPoint, this);
                    this.actionClientNode.actionManager.addAction(action, this.actionClientNode, false);
                }
                else {
                    //console.log("no action node exist");
                }
            },
            stopUpDate: function () {
                delete this.actionClientNode;
                this._scheduler.unscheduleCallbackForTarget(this, this.updateClientNode);
            }
        });

        Cocos.ClientNode = function () {
            return ClientNode;
        }
        Cocos.ClientLayer = function () {
            return ClientLayer;
        }
        Cocos.TimeLayer = function () {
            return TimeLayer;
        }
    }


    function init_CircleLayer(Cocos) {
        var Circle = cc.Node.extend({
            ctor: function () {
                this._super();

                var drawNode = new cc.DrawNode();
                drawNode.drawCircle(cc.p(100, 100), 50, 0, 1000, false, 7, cc.color(128, 128, 128));
                //drawNode.drawSegment(cc.p(100,100), cc.p(200,200), 1, cc.color(255, 0, 255, 255));



                this.addChild(drawNode);
                this.drawNode = drawNode;
            }
        })


        var CircleLayer = cc.Layer.extend({
            ctor: function () {
                this._super();

                var circle = new Circle();
                this.addChild(circle);
            },

        });

        Cocos.CircleLayer = function () {
            return CircleLayer;
        }

    }

    function init_BackgroundLayer(Cocos) {
        var BackgroundImage = cc.Sprite.extend({
            ctor: function (res, editAble) {
                this._super(res);
                var winSize = cc.director.getWinSize();
                this.attr({
                    anchorX: 0.5,
                    anchorY: 0.5,
                    x: winSize.width / 2,
                    y: winSize.height / 2,
                });

                this._listener = cc.EventListener.create({
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: true,
                    onTouchBegan: this.onTouchBegan,
                    onTouchMoved: this.onTouchMoved,
                    onTouchEnded: this.onTouchEnded
                });

                this.editAble = editAble || false;
                this.setEditAble(this.editAble);
            },
            setScale: function (value) {
                var scale = this.getScale();
                this._super(scale + value);
            },
            setEditAble: function (editAble) {
                this.editAble = editAble || false;
                if (this.editAble) {
                    cc.eventManager.addListener(this._listener, this);
                }
                else {
                    cc.eventManager.removeListener(this._listener);
                }
            },
            getEditAble: function () {
                return this.editAble;
            },
            onEnter: function () {
                this._super();
            },
            onTouchBegan: function (touch, event) {
                var node = this._node;
                var pos = touch.getLocation();
                var nodePos = node.getPosition();
                var detPos = cc.p(pos.x - nodePos.x, pos.y - nodePos.y);
                node.detPos = detPos;
                return true;
            },
            onTouchMoved: function (touch, event) {
                var pos = touch.getLocation();
                var node = this._node;
                var detPos = node.detPos;
                node.setPosition(pos.x - detPos.x, pos.y - detPos.y);
            },
            onTouchEnded: function (touch, event) {

            }
        });



        var BackgroundLayer = cc.LayerColor.extend({
            modified: false,
            ctor: function (editAble) {
                var size = cc.winSize;
                this._super(cc.color(255, 255, 255, 255), size.width, size.height);
                //this.editAble = editAble || false;
                this.setEditAble(editAble);
            },
            clean: function () {
                this.modified = false;
                this.removeAllChildrenWithCleanup(true);
            },
            setBgScale: function (value) {
                if (this._bgSprite) {
                    this._bgSprite.setScale(value);
                }
            },
            setEditAble: function (editAble) {
                this.editAble = editAble || false;
                if (this._bgSprite) {
                    this._bgSprite.setEditAble(this.editAble);
                }
            },
            getEditAble: function () {
                return this.editAble;
            },
            initBackgroundImage: function (res) {
                var bgSprite = new BackgroundImage(res, this.editAble);
                this.addChild(bgSprite);
                this._bgSprite = bgSprite;
            },
            setBackgroundImage: function (res) {
                this.clean();
                var bgSprite = new BackgroundImage(res, this.editAble);
                this.addChild(bgSprite);
                this.modified = true;
                this._bgSprite = bgSprite;
            },
            setBackgroundInfo: function (bgInfo) {
                if (this._bgSprite && bgInfo) {
                    this._bgSprite.setScale(bgInfo.scale);
                    this._bgSprite.setPosition(bgInfo.posX, bgInfo.posY);
                }
            },
            getBackgroundInfo: function () {
                var bgInfo = {

                }
                if (this._bgSprite) {
                    bgInfo.scale = this._bgSprite.getScale();
                    bgInfo.posX = this._bgSprite.getPositionX();
                    bgInfo.posY = this._bgSprite.getPositionY();
                }
                return bgInfo;
            }
        });


        var TopLayer = cc.Layer.extend({
            ctor: function () {
                this._super();

                var color = cc.color(255, 255, 255, 200);
                var width = 97;//100
                /*
                var drawNodeLeft = new cc.DrawNode();
                drawNodeLeft.drawRect(cc.p(0, 0 + width), cc.p(width+1, 450), color, 0, color);
                this.addChild(drawNodeLeft);

                var drawNodeTop = new cc.DrawNode();
                drawNodeTop.drawRect(cc.p(width, 450), cc.p(800, 450-width), color, 0, color);
                this.addChild(drawNodeTop);
                */

                var drawNodeTop = new cc.DrawNode();
                drawNodeTop.drawRect(cc.p(0, 0), cc.p(800, 450), cc.color(0, 0, 0, 0), width, color);
                this.addChild(drawNodeTop);

                var drawNodeBorder = new cc.DrawNode();
                drawNodeBorder.drawRect(cc.p(0 + width / 2, 0 + width / 2), cc.p(800 - width / 2, 450 - width / 2), cc.color(255, 255, 255, 0), 2, cc.color(237, 240, 242));
                this.addChild(drawNodeBorder);

            }
        });
        Cocos.TopLayer = function () {
            return TopLayer;
        }

        Cocos.BackgroundLayer = function () {
            return BackgroundLayer;
        }
    }

    var res = {
        HelloWorld_png: "../position/libs/picture/HelloWorld.png",
        CloseNormal_png: "../position/cocos/res/CloseNormal.png",
        CloseSelected_png: "../position/cocos/res/CloseSelected.png",
        Scale_png: "../position/cocos/res/scale.jpg",
        Ap_png: "../position/cocos/res/ap.jpg",
        Client_png: "../position/cocos/res/client.png"
    };

    var Cocos = {
        _create: function () {
        },
        _destory: function () {
            this._oDatetime.remove();
            $.Widget.prototype.destroy.call(this);
        },
    };

    function _init(oFrame) {
        cc = liuchao();
        cc.scale = 0.1; //30px = 3m
        init_BackgroundLayer(Cocos);
        init_ApLayer(Cocos);
        init_WallLayer(Cocos);
        init_ClientLayer(Cocos);
        init_CircleLayer(Cocos);
        $.widget("ui.cocos", Cocos);
        $("canvas", oFrame).cocos();
    }

    function _destroy() {

    }

    Widgets.regWidget(WIDGETNAME, {
        "init": _init, "destroy": _destroy,
        "widgets": [],
        "utils": ["Widget"],
        "libs": ["Libs.Position.Cocos2d_lib"]
    });
})(jQuery);
