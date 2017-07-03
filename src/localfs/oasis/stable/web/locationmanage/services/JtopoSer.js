define(['angularAMD','../libs/jtopo-0.4.8-min'],function (app) {
    app.factory('jtopoSer',['$timeout',function ($timeout) {
        function getRandom (n,m){
            return Math.round(Math.random()*(m-n)+n)
        }
        function resizeCavas(selector,imagePath,suc) {
            $("<img/>").attr("src", imagePath).load(function () {
                $(selector).attr('width', this.width).attr('height', this.height).css('background','url(' + imagePath + ')')
                suc && suc(this.width,this.height)
            });
        }
        function addAp(scene, x, y, text, model,opt,nodeListener) {
            var def = {
                fontColor : '0,0,0',
                selected : false,
                dragable : true,
                image : ''
            };
            for(var attr in opt){
                if(opt.hasOwnProperty(attr)){
                    def[attr] = opt[attr]
                }
            }
            var node;
            if(def.type === 'circle'){
                node = new JTopo.CircleNode(text);
                node.radius = 4;
            }else{
                node = new JTopo.Node(text)
            }
            node.font = model;
            node.fontColor = def.fontColor;
            node.selected = def.selected;
            node.dragable = def.dragable;

            //'../locationmanage/img/smallAp.png'
            node.setImage(def.image, true);
            node.setLocation(parseInt(x), parseInt(y));
            nodeListener && nodeListener.call(node,scene);
            scene.add(node);
            return node;
        }
        function addArea(scene, areaTypeName, motal, nodeColor,nodeListener) {
            var nodes = [];
            for (var i = 0; i < parseInt(motal); i++) {
                var cnode = new JTopo.CircleNode(areaTypeName);
                cnode.radius = 6;
                cnode.fontColor = "176,23,31";
                cnode.setLocation(getRandom(200,100) , getRandom(200,100));
                cnode.fillColor = nodeColor;
                scene.add(cnode);
                nodes.push(cnode);
                nodeListener && nodeListener.call(cnode, scene);
            }
            // 连接节点
            var links = [];
            for (var i = 1; i < nodes.length; i++) {
                var link = new JTopo.Link(nodes[i - 1], nodes[i]);
                link.strokeColor = nodeColor;
                scene.add(link);
                links.push(link);
            }
            // 首尾相连
            var link = new JTopo.Link(nodes[nodes.length - 1], nodes[0]);
            scene.add(link);
            link.strokeColor = nodeColor;
            links.push(link);
        }
        function showApNodesInfo(scene,apList,opt,nodeListener,interval) {
            return apList.map(function (apInfo,idx) {
                    if(interval){
                        return $timeout(function () {
                            addAp(scene,apInfo.posX,apInfo.posY,apInfo.apName,apInfo.apSn,opt,nodeListener)
                        },idx*interval);
                    }
                    return addAp(scene,apInfo.posX,apInfo.posY,apInfo.apName,apInfo.apSn,opt,nodeListener)
            })
        }
        function showAreaInfo(scene,areaList,nodeListener) {
            areaList.forEach(function (areaValue) {
                var areaTypeName,nodeColor;
                if (areaValue.areaType == 5) {
                    areaTypeName = "障碍物";
                    nodeColor = "255,0,0";
                } else if (areaValue.areaType == 4) {
                    areaTypeName = "定位区域";
                    nodeColor = "255,255,0";
                } else {
                    areaTypeName = "数字围栏";
                    nodeColor = "60,179,113";
                }
                var nodeName = areaValue.areaName + "_" + areaTypeName;
                var nodes = [];
                var areaNodeXYPos = areaValue.areaPoint.split("_");
                areaNodeXYPos.forEach(function (nodeXYpos) {
                    var xPos = parseFloat(nodeXYpos.split(",")[0]);
                    var yPos = parseFloat(nodeXYpos.split(",")[1]);
                    var cnode = new JTopo.CircleNode(nodeName);
                    cnode.radius = 6;
                    cnode.fillColor = nodeColor;
                    cnode.dragable = false;
                    cnode.fontColor = '0,0,0';
                    scene.add(cnode);
                    cnode.setLocation(xPos, yPos);
                    nodes.push(cnode);
                    nodeListener && nodeListener.call(cnode,scene)
                });
                //连接节点
                for (var i = 1; i < nodes.length; i++) {
                    var link = new JTopo.Link(nodes[i - 1], nodes[i]);
                    link.strokeColor = nodeColor;
                    scene.add(link);
                }
                // 首尾相连
                var link = new JTopo.Link(nodes[nodes.length - 1], nodes[0]);
                link.strokeColor = nodeColor;
                scene.add(link);
            })
        }
        function resizeCavas(selector,imagePath,suc) {
            $("<img/>").attr("src", imagePath).load(function () {
                $(selector).attr('width', this.width).attr('height', this.height).css('background-image','url(' + imagePath + ')')
                suc && suc(this.width,this.height)
            });
        }

        /*function linkNode(scene,nodeA, nodeZ, text, dashedPattern){
            var link = new JTopo.Link(nodeA, nodeZ, text);
            link.lineWidth = 3; // 线宽
            link.dashedPattern = dashedPattern; // 虚线
            link.bundleOffset = 60; // 折线拐角处的长度
            link.bundleGap = 20; // 线条之间的间隔
            link.textOffsetY = 3; // 文本偏移量（向下3个像素）
            link.strokeColor = '0,200,255';
            scene.add(link);
            return nodeZ;
        }

        function desToLink(scene,stepList,nodeOpt){
            if(Object.prototype.toString.call(stepList) === '[object Array]'){
                stepList.reduce(function(p,n){

                })
            }
        }*/

        return {
            showAreaInfo:showAreaInfo,
            showApNodesInfo:showApNodesInfo,
            addAp:addAp,
            addArea:addArea,
            resizeCavas:resizeCavas
        }
    }])
})