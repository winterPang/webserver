/*
    Document   : Page Custom
    Created on : 2015-5-19
    Author     : kf2685
    Description: 页面定制功能的主要JS文件，为避免与其他脚本的命名冲突，函数命名请以Canvas开头。
                 主要分为4个部分：CanvasControl(脚本入口，主函数)、CanvasUi(负责所有对Ui的操作)、CanvasWidget(负责对所有插件的操作)、CanvasLib(存放公共函数的对象)。
 */
(function(jq, undefined) {
    var canvasControl;

    // 存放插件拓展功能菜单对象
    jq.canvasControl = {
        uiRoles : {},
        widgetRoles : {
            editMain : [],
            editRich : [],
            editMulti : []
        },
        ctrlRoles : {},
        ui : {}
    };

    /*
    * 主控制函数。
    * options {}类型的对象，对整体功能的参数设置。
    */
    function CanvasControl(options) {
        this.opts = jq.extend( {
            // 画布语言，外部传入，默认为en
            lang : "zh",
            imageUploadPath : "",
            selectable : true,
            sortable : true,
            canvasSelector : "",
            // default edit tags
            editTags : ["div", "label", "span"],
            jsonCfg: {}
        }, options || {});
        // default panel style, can replace
        this.widgetStyle = {
            textPanelStyle : "",
            imagePanelStyle : ""
        };
        this.canvasContent;
        this.canvasForm;
        this.canvasUi;
        // 标识当前session是否过期1：未过期 0：过期
        this.session_expired = 1;
        // 绘制类型 PC/PHONE
        this.ctrlType;
    }

    /*
     * 初始化函数，负责页面所有UI的初始化
     */
    CanvasControl.prototype.init = function(jqContent) {
        this.canvasContent = jqContent;
        // 增加画布的处理表单对象，方便后续扩展
        this.canvasForm = jq('<form id="canvasForm" name="canvasForm" method="post"></form>');
        jq('#tools').append(this.canvasForm);
        // 为每个可编辑的元素增加标记
        this.opts.canvasSelector = jq.map(this.opts.editTags, function(value) {
            return value + ".canvas-edited-text";
        }).join(",");
        // 初始化画布UI
        if (!this.canvasUi) {
            this.canvasUi = new CanvasUi();
            this.canvasUi.init();
        }
        // 增加排序
        if(this.opts.sortable){
        	this.canvasContent.sortable({
        		items: "div[class*='canvas-event-draggable']:not('.ui-state-disabled')",
        	    axis: "y",
        	    diatance: 5,
        	    cursor: "move"
        	});
        }
        // 屏蔽掉超链接
        jq("div[class*='canvas-edited-text']").on("click", "a", function(event) {
            event.preventDefault();
        });

        // 屏蔽系统右键菜单
        jq(document).bind("contextmenu", function() {
            return false;
        });
    }

    // 获取画布内容
    CanvasControl.prototype.getFinalHtml = function() {
    	// 移除修改toolbar
    	if(jq(canvasControl.canvasContent).find('.canvas-toolbar-div')){
    		jq(canvasControl.canvasContent).find('.canvas-toolbar-div').remove();
    	}
    	// 移除删除toolbar
    	if(jq(canvasControl.canvasContent).find('.canvas-toolbar-div-delete')){
    		jq(canvasControl.canvasContent).find('.canvas-toolbar-div-delete').remove();
    	}
        return jq(canvasControl.canvasContent).html();
    }

    // 获取画布配置
    CanvasControl.prototype.getFinalCfg = function() {
        return canvasControl.canvasUi.getCfg();
    }

    /*
     * 所有对所有UI的定义、创建、引用及销毁。
     * UI中类名中含有canvas-edited-text的对象为受画布的控制对象
     * UI中类名中含有canvas-edited-notsync的对象在整体修改样式的时候不同步
     * UI中类名中含有canvas-event-resizable的对象可缩放
     * UI中类名中含有canvas-event-draggable的对象可拖动
     * UI中类名中含有canvas-event-click的对象可点击
     * UI中类名中含有canvas-event-selectable的对象可选取
     */
    function CanvasUi() {
    	this.curElm;
    	this.selecting = false;
    	// 富文本编辑器，为的是全局只保存一个实例
    	this.ueEdit;
    	// 文本内容，为的是全局只保存一个实例
        this.textPanel;
        // 上传图片，为的是全局只保存一个实例
        this.imgPanel;
        // 最多上传图片文件个数
        this.imgMax = 3;
        // 当前画布是否有改动
        this.isModify = false;
        // 图片是否自动保存过
        this.imageSaved = true;
        // 存放所有实例功能对象
        this.uis = {};
        // 左侧菜单的角色对象定义，不同的key对应不同的menuRole,menuRole在初始化canvasControl时传入，暂时不支持菜单
        this.uiRoles = {};
        // 画布拥有的所有菜单功能，目前暂时不支持，所以先不扩展
        this.uiRoles['phonedefault'] = {
            //drawMain : [ "canvas-ui-addText", "canvas-ui-addImage"]
            drawMain : [ ]
        };
    }

    // 初始化画布控件，不同的手机，pc对应的左侧菜单也不一样，目前暂时不支持，所以先不扩展
    CanvasUi.prototype.init = function() {
        // 为每个元素添加事件
        this.addEventForRoles();
        // 增加组件
        this.addMenu();
    }

    CanvasUi.prototype.addMenu = function(){
        var parent = this;
        //增加文字消息
        this.canvasMenuText = jq('<form id="canvasMenuText" name="canvasMenuText" method="post" title="文字" class="mousepointer"><img src="../resources/images/text.png"  style="vertical-align:middle;"><span>文字</span></form>');
        this.canvasMenuText.unbind("click").click(function(event) {
            var wenziMenu = jq('<div id="text'+jq.getRandomDateBetween(new Date())+'" class="canvas-edited-text canvas-event-selectable canvas-event-draggable '

                 +'canvas-event-click widget-body canvas-event-dbclick ui-draggable ui-selectee ui-selected" data-canvasrole="text-role-panel"    style="box-shadow: none; position: '

                 +'relative; word-break: break-word"><span word-break:break-word;><p style="text-align: left;">文字区域</p></span></div>');
             parent.addEvent(jq(wenziMenu));

             // 如果能找到可编辑区域，则增加编辑区域后面
             if(undefined != canvasControl.canvasContent.find("div[class*='canvas-edited-text']").last() &&
            		 undefined != canvasControl.canvasContent.find("div[class*='canvas-edited-text']").last().html()){
            	 canvasControl.canvasContent.find("div[class*='canvas-edited-text']").last().after(wenziMenu);
             } else {
            	 canvasControl.canvasContent.find("div").first().append(wenziMenu);
             }
         });
         jq("#menus").append(this.canvasMenuText);
         //增加图文消息
         this.canvasMenuImg = jq('<form id="canvasMenuImg" name="canvasMenuImg" method="post" style="margin-top:20px;" title="图片"  class="mousepointer" ><img src="../resources/images/img.png" style="vertical-align:middle;" ><span>图片</span></div></form>');
         this.canvasMenuImg.unbind("click").click(function(event) {
             var imgMenu = jq('<div style="position: relative;" id="image'+jq.getRandomDateBetween(new Date())+'"  class="canvas-edited-text canvas-event-selectable '

                  +'canvas-event-draggable canvas-event-click canvas-event-dbclick ui-draggable ui-selectee ui-selected"  data-canvasrole="image-role-panel" '

                 +'data-role="page"><img class="canvas_img_replace" alt="" src="../resources/images/add.gif" width="100%"> </div>');
             parent.addEvent(imgMenu);

             if(undefined != canvasControl.canvasContent.find("div[class*='canvas-edited-text']").last() &&
            		 undefined != canvasControl.canvasContent.find("div[class*='canvas-edited-text']").last().html()){
            	 canvasControl.canvasContent.find("div[class*='canvas-edited-text']").last().after(imgMenu);
             } else {
            	 canvasControl.canvasContent.find("div").first().append(imgMenu);
             }
         });
         jq("#menus").append(this.canvasMenuImg);
   }

    // 在进入画布的时候为已有的对象增加相应的事件
    CanvasUi.prototype.addEventForRoles = function() {
        var parent = this;
        jq(canvasControl.opts.canvasSelector).each(function() {
            var jqObj = jq(this);
            parent.addEvent(jqObj);
            // button禁用
            jqObj.find("input.canvas-edited-text").unbind("click").click(function(event) {
                event.preventDefault();
            });
        });
    }

    // 为画布对象增加缩放，移动，单击事件，目前只支持单击事件
    CanvasUi.prototype.addEvent = function(jqElem) {
        // 增加相应的事件
        if (jqElem.hasClass("canvas-event-resizable")) {
        	//canvasControl.canvasUi.addResizable(jqElem);
        }
        if (jqElem.hasClass("canvas-event-draggable")) {
        	//canvasControl.canvasUi.addDraggable(jqElem);
        }
        if (jqElem.hasClass("canvas-event-click")
        	&& undefined != jq(jqElem).attr("data-canvasrole")
        	&& "innernet-role-panel" != jq(jqElem).attr("data-canvasrole")) {
        	canvasControl.canvasUi.addClick(jqElem);
        	canvasControl.canvasUi.addSelectedTags(jqElem);
        }
        return jqElem;
    }

    // 类名中具有 canvas-event-click的对象
    CanvasUi.prototype.addClick = function(jqElm) {
        jqElm.click(function(event) {
            jqSelf = jq(this);
            // 移除区域的选取的标识
            canvasControl.canvasUi.removeSelectedTags();
            // 标识当前画布状态为改动
            canvasControl.canvasUi.isModify = true;
            if (jqSelf.hasClass("canvas-event-selectable")) {
                if (jqSelf.hasClass("ui-selected")) {
                    jqSelf.removeClass("ui-selecting ui-selected");
                    jqSelf.trigger("hideSelected");
                } else {
                    jqSelf.addClass("ui-selected");
                }

                //canvasControl.canvasUi.curElm = jqSelf;

                jqSelf.addClass("ui-selected");
                jqSelf.trigger("showSelected");
            }
            event.stopPropagation();
        });
        return jqElm;
    }

    // 为每个区域增加选取的标识
    CanvasUi.prototype.addSelectedTags = function(jqElm) {
    	// 添加之前先移除所有的标识
    	canvasControl.canvasUi.removeSelectedTags();

		if (jqElm.hasClass("canvas-event-click")) {
            jqElm.bind({
                showSelected : function() {
                	jqElm.trigger("hideSelected");
                	jq(jqElm).addClass('canvas-selected-border').css('position','relative');

                	var toolbar = jq('<div class="canvas-toolbar-div"><span class="canvas-toolbar-span">修改</span></div>');
                	toolbar.bind({
    	        	    click : function(event){

    	        	    	// 自动保存图片的配置
    	        	    	canvasControl.canvasUi.getCfg();
    	                    canvasControl.canvasUi.curElm = jqSelf;

    	        	    	canvasControl.canvasUi.hideEdit();
    	        	    	if("text-role-panel" == jqElm.attr("data-canvasrole")){
    	        	    		// 出现右侧编辑内容，文本内容
    	        	    		jq(this).textEdit();
    	        	    		canvasControl.canvasUi.textPanel.setContent();
    	        	    	} else if("image-role-panel" == jqElm.attr("data-canvasrole")){
    	        	    		// 出现右侧编辑内容，图片列表
    	        	    		canvasControl.canvasUi.imageSaved = false;
    	        	    		jq(this).imgList();
    	        	    		canvasControl.canvasUi.imgPanel.setContent();
    	        	    	} else if("innernet-role-panel" == jqElm.attr("data-canvasrole")){
    	        	    		// 首页，点击上网处理
    	        	    	} else if("login-role-panel" == jqElm.attr("data-canvasrole")){
    	        	    		// 登录框，点击上网处理
    	        	    	}
    	        	    	event.stopPropagation();
                        }
    	        	});
                	// 登录框暂时不支持修改
                	if("login-role-panel" != jq(jqElm).attr("data-canvasrole")
                		&& "innernet-role-panel" != jq(jqElm).attr("data-canvasrole")){
                		jq(jqElm).append(toolbar);
                	}
                	var deleToolbar = jq('<div class="canvas-toolbar-div-delete"><span class="canvas-toolbar-span">删除</span></div>');
                	deleToolbar.bind({
    	        	    click : function(event){
    	        	    	canvasControl.canvasUi.hideEdit();
    	        	    	canvasControl.canvasUi.deleteElm(jqElm);
    	        	    	event.stopPropagation();
                        }
    	        	});
                	// 登录框不支持删除
                	if("login-role-panel" != jq(jqElm).attr("data-canvasrole")
                		&& "innernet-role-panel" != jq(jqElm).attr("data-canvasrole")){
                		jq(jqElm).append(deleToolbar);
                	}
                },
		        hideSelected : function() {
		        	jq(jqElm).removeClass('canvas-selected-border');
		        	jq(jqElm).remove('div.canvas-toolbar-div');
		        	jq(jqElm).remove('div.canvas-toolbar-div-delete');
		        }
            });
		}
    }

    // 移除所有区域的选取的标识
    CanvasUi.prototype.removeSelectedTags = function(jqElm) {
    	// 添加之前先隐藏所有的标识
    	jq('div').removeClass('canvas-selected-border');
    	jq('div.canvas-toolbar-div').remove();
    	jq('div.canvas-toolbar-div-delete').remove();
    }

    // 隐藏所有编辑区域
    CanvasUi.prototype.hideEdit = function(){
    	jq(this).textEdit("close");
    	jq(this).imgList("close");

    }

    // 删除某个元素
    CanvasUi.prototype.deleteElm = function(jqElm){
    	var jsonCfg = {};
    	if(null != canvasControl.opts.jsonCfg && '' != canvasControl.opts.jsonCfg){
    		jsonCfg = JSON.parse(canvasControl.opts.jsonCfg);
    	}
    	if(null != jqElm && null != jsonCfg[jqElm.attr('id')] && undefined != jsonCfg[jqElm.attr('id')]){
    		delete jsonCfg[jqElm.attr('id')];
    	}
    	canvasControl.opts.jsonCfg = JSON.stringify(jsonCfg);

    	jqElm.remove();
    }

    // 获取图片配置信息
    CanvasUi.prototype.getCfg = function(){
		if(canvasControl.canvasUi.imageSaved || !canvasControl.canvasUi.isModify ||
				undefined == canvasControl.canvasUi.imgPanel || undefined == canvasControl.canvasUi.imgPanel.iContent){
    		return canvasControl.opts.jsonCfg;
    	}
		canvasControl.canvasUi.imageSaved = true;
    	var jsonCfg = {};
    	if(null != canvasControl.opts.jsonCfg && '' != canvasControl.opts.jsonCfg){
    		jsonCfg = JSON.parse(canvasControl.opts.jsonCfg);
    	}
    	var aArray = new Array();
		canvasControl.canvasUi.imgPanel.iContent.find("div.canvas-eachItem").each(function(i){
			// 必须上传图片，才认为是完整记录
			jq(this).find('.getImg').each(function(i){
			  if(null != jq(this).attr("src") && '' != jq(this).attr("src") &&
				jq(this).attr("src").indexOf("resources/images/add.gif") == -1){
				  var bArray = new Array();
				  bArray.push(jq(this).attr("src"));
				  jq(this).parent().parent().find('.getTxt').each(function(i){
					  if(null != jq(this).val() && '' != jq(this).val()){
						  bArray.push(jq(this).val());
					  } else {
						  bArray.push("-1");
					  }
				  });
				  aArray.push(bArray);
			  }
			});
	    });
		jsonCfg[canvasControl.canvasUi.curElm.attr("id")] = aArray;

		canvasControl.opts.jsonCfg = JSON.stringify(jsonCfg);
		return JSON.stringify(jsonCfg);
        //{"img100":[[imgurl1, starttime, endtime, linkurl], [imgurl2, starttime, endtime, linkurl]]}
    }

    /*
     * 所有对所有插件的定义。
     * 但是插件的创建、引用及销毁尽可能由其本身定义及控制。
     */
    var CanvasWidget = {
		// 文字面板的定义
        TextPanel : function(el, options) {
        	this.tPanel;
        	this.uePanel;
        	this.ueEdit;
            this.tContent;
        },
        // 图片面板的定义
        ImgPanel : function(el, options) {
        	this.iPanel;
        	// 最多上传图片个数
        	this.iCount = 0;
        	this.iButton;
            this.imagesArr = [];
            this.iContent;
        }
    }

    jq.extend(CanvasWidget.TextPanel.prototype, {
    	init : function() {
    		this.tPanel = jq('<div class="canvas-edit-box"></div>');
    		var title = jq('<div class="canvas-widget-header"><i class="widget-icon fa fa-tasks fa-lg themeprimary"></i> <span class="widget-caption themeprimary">文字编辑</span></div>');
    		this.tPanel.append(title);
    		canvasControl.canvasForm.append(this.tPanel);
    		this.tPanel.hide();
            return this.tPanel;
        },
        _extendOpts : function(options) {
            this.opts = jq.extend(this.opts, options || {});
        },
        open : function(obj) {
            this.tPanel.show();
            return this.tPanel;
        },
        close : function() {
            this.tPanel.hide();
            return this.tPanel;
        },
        setContent : function(){
        	parent = this;
        	// 因为ue的设置内容必须在ready的时候加载，所以每次都要动态生成ue
        	if(parent.uePanel){
        		parent.uePanel.remove();
        	}
        	var editorId = jq.getRandomDateBetween(new Date());
            parent.uePanel = jq('<div><script id="editor'+editorId+'" type="text/plain" class="canvas-widget-editor"></script></div>').addClass(canvasControl.widgetStyle.textPanelStyle);
            parent.tPanel.append(parent.uePanel);
            parent.ueEdit = UE.getEditor("editor"+editorId);

            // 解析jsonCfg配置，如果没有文字内容，则为空
            var curElm = canvasControl.canvasUi.curElm;

            // 必须插件创建完成后才能使用对象，否则会报错。
            parent.ueEdit.addListener("ready", function () {
            	if(null != jq(curElm).children("span").first().html() &&
            	    undefined != jq(curElm).children("span").first().html()	){
            		this.setContent(jq(curElm).children("span").first().html(), false);
            	}
        	});
            // 当编辑器内容改变的时候，画布中的内容跟着变化。
            parent.ueEdit.addListener("contentchange", function () {
            	jq(curElm).children("span").first().html(parent.getContent());
        	});
        },
        getContent : function(){
        	parent = this;
        	return parent.ueEdit.getContent();
        }
    });

    jq.extend(CanvasWidget.ImgPanel.prototype, {
    	init : function() {
    		this.iPanel = jq('<div class="canvas-edit-box"></div>');
    		var title = jq('<div class="canvas-widget-header"><i class="widget-icon fa fa-tasks fa-lg themeprimary"></i> <span class="widget-caption themeprimary">图片编辑</span></div>');
    		this.iPanel.append(title);
            this.iContent = jq('<div id="imgTool" style="margin-top: 10px;"></div>');
            this.iButton = jq('<div class="canvas-widget-content"></div>');
            var addBtn = jq('<a href="#" style="margin-left:10px;"><i class="fa fa-plus-circle fa-lg"></i>&nbsp;增加</a>').unbind().bind( {
            	click : function() {
            		if(canvasControl.canvasUi.imgPanel.iCount == canvasControl.canvasUi.imgMax){
            			alert('已达到最大限制');
            			return;
            		}
            		//group1/M00/04/02/rBsMP1fI21OAOJarAAAA4bqpLMQ066.gif
            		parent.iCount++;
            		canvasControl.canvasUi.imgPanel.iContent.append(jq('<div class="canvas-eachItem">' +
            				  '<div class="canvas-imgcontent-left"><img title="上传图片" id="'+canvasControl.canvasUi.curElm.attr("id")+'_'+jq.getRandomDateBetween(new Date()) +'" class="getImg" src="../resources/images/add.gif" width="100px" height="100px"/></div>' +
            				  '<div class="canvas-imgcontent-right">' +
            				    '<div style="height:45px;margin-left:5px;">' +
            				                       '投放时间：<input type="text" readonly class="ui_timepicker canvas-text-35 getTxt"/>-<input type="text" readonly class="ui_timepicker canvas-text-35 getTxt"/>' +
            				    '</div>' +
            				    '<div style="height:50px;margin-left:5px;">' +
            				                       '图片链接：<input type="text" maxlength="128" class="canvas-text-80 getTxt"/>' +
            				    '</div>' +
            				  '</div>' +
            				  '<div class="canvas-imgdel-link"><a href="#" name="canvasFile"><i class="fa fa-trash-o fa-lg"></i></a></div>' +
            				'</div>'));
            		parent.addEvent();
            	}
            });

            this.iPanel.append(this.iButton.append(addBtn));
            canvasControl.canvasForm.append(this.iPanel);
            this.iPanel.hide();
            return this.iPanel;
        },
        _extendOpts : function(options) {
            this.opts = jq.extend(this.opts, options || {});
        },
        open : function(obj) {
        	this.iPanel.show();
            return this.iPanel;
        },
        close : function() {
            this.iPanel.hide();
            return this.iPanel;
        },
        addEvent : function() {
        	parent = this;
        	// 写多个是因为写一个不起作用，带后续查看能否使用一个
        	parent.iContent.find("a[name=canvasFile]").unbind().bind({
        	    click : function(){
        	    	if(!confirm('确定删除吗？')) {
        	    		return false;
        	    	} else {
        	    		if(1 == canvasControl.canvasUi.imgPanel.iCount){
        	    			alert('至少有一条记录，不能删除。');
            	    		return;
            	    	}
            	    	canvasControl.canvasUi.imgPanel.iCount--;
                        jq(this).parent().parent().remove();
                        parent.refreshCanvasImg();
                        return false;
        	    	}
                }
        	});
			parent.iContent.find(".getImg").css({
				cursor: 'pointer'
			}).unbind().bind({
        	    click : function(){
        	    	uploadImg(canvasControl.canvasUi.curElm.attr("id"),jq(this).attr("id"));
                }
        	});
			parent.iContent.find(".ui_timepicker").datetimepicker({
    	        showTime: false,
    	        showTimepicker:false
    	    });
        },
        refreshCanvasImg : function() {
        	parent = this;
        	parent.iContent.find("div.canvas-eachItem").each(function(i){
        		// 必须上传图片，才认为是完整记录
    			jq(this).find('.getImg').each(function(i){
    				if(null != jq(this).attr("src") && '' != jq(this).attr("src") &&
        	    	    (jq(this).attr("src").indexOf("resources/images/add.gif") == -1)){
					  if(jq(canvasControl.canvasUi.curElm).find('.canvas_img_replace')){
					    jq(canvasControl.canvasUi.curElm).find('.canvas_img_replace')[0].src = jq(this).attr("src");
					  }
                      return;
        			}
    			});
    	    });
        },
        setContent : function() {
        	parent = this;
        	parent.iContent.html('');
        	parent.iCount = 0;
        	// 解析jsonCfg配置，如果没有文字内容，则为空，格式如下
        	// {"image100":[["imgurl2","starttime"],["imgurl2","starttime"]]}
        	var jsonCfg = {};
            if(null != canvasControl.opts.jsonCfg && '' != canvasControl.opts.jsonCfg){
        		jsonCfg = JSON.parse(canvasControl.opts.jsonCfg);
        	}
            if(null == canvasControl.canvasUi.curElm || undefined == canvasControl.canvasUi.curElm){
            	return;
            }
        	// 获取当前区域配置信息
        	var content = jsonCfg[canvasControl.canvasUi.curElm.attr("id")];
        	var tracker = jq.getUrlParams('tracker');
        	if('' != content && null != content && undefined != content){
                // 遍历数据，然后分别显示每个上传文件内容
        		for (var i in content) {
        			parent.iCount++;
        			parent.iContent.append(jq('<div class="canvas-eachItem">' +
            				  '<div class="canvas-imgcontent-left"><img title="上传图片" id="'+canvasControl.canvasUi.curElm.attr("id")+'_'+jq.getRandomDateBetween(new Date()) +'" class="getImg" src="'+ (undefined == content[i][0] ? "": tracker+'/'+content[i][0]) + '" width="100px" height="100px"/></div>' +
            				  '<div class="canvas-imgcontent-right">' +
          				    '<div style="height:45px;margin-left:5px;">' +
          				                       '投放时间：<input type="text" readonly class="ui_timepicker canvas-text-35 getTxt" value="'+(undefined == content[i][1] || "-1" == content[i][1] ? "":content[i][1])+'"/>-<input type="text" readonly class="ui_timepicker canvas-text-35 getTxt" value="'+(undefined == content[i][2]  || "-1" == content[i][2]? "":content[i][2])+'"/>' +
          				    '</div>' +
          				    '<div style="height:50px;margin-left:5px;">' +
          				                       '图片链接：<input type="text" maxlength="128" class="canvas-text-80 getTxt" value="'+(undefined == content[i][3] || "-1" == content[i][3] ? "":content[i][3])+'"/>' +
          				    '</div>' +
          				  '</div>' +
          				  '<div class="canvas-imgdel-link"><a href="#" name="canvasFile"><i class="fa fa-trash-o fa-lg"></i></a></div>' +
          				'</div>'));
        			parent.addEvent();
        		}
            } else {
            	// 仅显示一个文件上传
            	parent.iCount++;
            	parent.iContent.append(jq('<div class="canvas-eachItem">' +
        				  '<div class="canvas-imgcontent-left"><img title="上传图片" id="'+canvasControl.canvasUi.curElm.attr("id")+'_'+jq.getRandomDateBetween(new Date()) +'" class="getImg" src="../resources/images/add.gif" width="100px" height="100px"/></div>' +
        				  '<div class="canvas-imgcontent-right">' +
        				    '<div style="height:45px;margin-left:5px;">' +
        				                       '投放时间：<input type="text" readonly class="ui_timepicker canvas-text-35 getTxt"/>-<input type="text" readonly class="ui_timepicker canvas-text-35 getTxt"/>' +
        				    '</div>' +
        				    '<div style="height:50px;margin-left:5px;">' +
        				                       '图片链接：<input type="text" maxlength="128" class="canvas-text-80 getTxt"/>' +
        				    '</div>' +
        				  '</div>' +
        				  '<div class="canvas-imgdel-link"><a href="#" name="canvasFile"><i class="fa fa-trash-o fa-lg"></i></a></div>' +
        				'</div>'));
            	parent.addEvent();
            }
        	parent.iButton.append(parent.iContent);
        }
    });

    /*
     * 定义jQuery扩展函数，供jQuery对象调用。
     * 请注意函数的返回值一定要是jQuery对象，使其能支持链式操作。
     */
    jq.fn.extend({
        // 创建适用于PHONE的画布插件对象
        phoneControl : function(options) {
            if (!canvasControl) {
                canvasControl = new CanvasControl(options);
                canvasControl.ctrlType = "PHONE";
            }
            var otherArgs = Array.prototype.slice.call(arguments, 1);
            if ("string" == typeof(options) && "function" == typeof(canvasControl[options])) {
                return canvasControl[options].apply(canvasControl, otherArgs)
            } else if ("option" == options && arguments.length == 2 && typeof arguments[1] == 'string') {
                return canvasControl.getOpts.apply(canvasControl, otherArgs);
            } else {
            	canvasControl.init(this);
            	canvasControl.canvasContent.attr("unselectable","on");
                return canvasControl;
            }
        },
        // 文本内容面板
        textEdit : function(options) {
            return this.each(function() {
            	// 采用单例模式，全局只保存一个实例对象
                var inst = canvasControl.canvasUi.textPanel;
                if (!inst) {
                	canvasControl.canvasUi.textPanel = new CanvasWidget.TextPanel(this, options);
                    inst = canvasControl.canvasUi.textPanel;
                    inst.init();
                }
                // 单例对象在调用过程中要覆盖原有的属性
                if ("object" === typeof(options)) {
                    inst._extendOpts(options);
                }
                var otherArgs = Array.prototype.slice.call(arguments, 1);
                if ("string" == typeof(options) && "function" == typeof(inst[options])) {
                    inst[options].apply(inst, [ this ].concat(otherArgs));
                } else {
                    inst.open(this);
                }
                return inst;
            });
        },
        // 图片列表面板
        imgList : function(options) {
            return this.each(function() {
            	// 采用单例模式，全局只保存一个实例对象
                var inst = canvasControl.canvasUi.imgPanel;
                if (!inst) {
                	canvasControl.canvasUi.imgPanel = new CanvasWidget.ImgPanel(this, options);
                    inst = canvasControl.canvasUi.imgPanel;
                    inst.init();
                }
                // 单例对象在调用过程中要覆盖原有的属性
                if ("object" === typeof(options)) {
                    inst._extendOpts(options);
                }
                var otherArgs = Array.prototype.slice.call(arguments, 1);
                if ("string" == typeof(options) && "function" == typeof(inst[options])) {
                    inst[options].apply(inst, [ this ].concat(otherArgs));
                } else {
                    inst.open(this);
                }
                return inst;
            });
        }
    });

    /*
     * 定义jQuery工具函数扩展
     */
    jq.extend({
        // 获取Url中传递的参数  by RegExp
        getUrlParams : function(paramName) {
            var re = new RegExp("(^|\\?|&)"+ paramName + "=([^&]*)(&|$)",'g');
            re.exec(window.location.href);
            return RegExp.$2;
        },
        getRandomDateBetween : function(a) {
        	var date = new Date();
	    	a = a.getTime();
	    	// 1427082029916 2038-01-01
    	    date.setTime(Math.random(new Date(1427082029916).getTime() - a) + a);
    	    return date.getTime();
        },
        getJsonLength: function(jsonData) {
        	var jsonLength = 0;
        	for(var item in jsonData){
        		jsonLength++;
        	}
        	return jsonLength;
        }
    });
})(jQuery);
