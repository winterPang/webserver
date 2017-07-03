/*
    Document   : Page Custom
    Created on : 2016-6-3
    Author     : hkf6496
    Description: 页面定制功能的主要JS文件，为避免与其他脚本的命名冲突，函数命名请以Canvas开头。
                 主要分为4个部分：CanvasControl(脚本入口，主函数)、CanvasUi(负责所有对Ui的操作)。
 */
(function(jq, undefined) {
    var canvasControl;
    
    //保存可以编辑的文字
    var jsonCfgText = {};

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
            // default edit tags 
            jsonCfg: {}
        }, options || {});
        this.canvasContent;
        this.canvasForm;
        this.canvasUi;
        // 绘制类型 PC/PHONE
        this.ctrlType;
    }
    
    /*
     * 初始化函数，负责页面所有UI的初始化
     * 
     * prototype 属性使您有能力向对象添加属性和方法
     */
    CanvasControl.prototype.init = function(jqContent) {
        this.canvasContent = jqContent;
        // 初始化画布UI
        if (!this.canvasUi) {
            this.canvasUi = new CanvasUi();
            this.canvasUi.init();
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
        return jq(canvasControl.canvasContent).html();
    }

    // 获取画布配置
    CanvasControl.prototype.getFinalCfg = function() {
    	var newJsonCfg = {};
        canvasControl.canvasForm.find("div.canvas-eachItem").each(function(i){
				var key = jq(this).find('.getImg').attr("id");
				key = key.slice(0,key.indexOf("edit"));
				var aArray = new Array();
			    aArray.push(jq(this).find('.getImg').attr("src"));
			    aArray.push(jq(this).find('.getTxt').val());
			    aArray.push(jq(this).find('.getImg').attr("imgcfg"));
			    //判断是否是带有标题，内容的图片
			     var istrue = jq(this).find('.getImg').attr("imgcfg").indexOf("isLogo=2");
			    if(istrue > 0){
			    	var title = jq(this).find('.getTitle').val();
			    	var content = jq(this).find('.getContent').val();
			    	aArray.push(title);
			        aArray.push(content);
			        jq(canvasControl.canvasContent).find("#"+key+"Title").html(title);
			        jq(canvasControl.canvasContent).find("#"+key+"TitleDetail").html(content);
			    }
			    if(jsonCfgText[key] != ""){
			    	aArray.push(jsonCfgText[key]);
			    };
				newJsonCfg[key] =aArray;
		});
        canvasControl.canvasUi.isModify = false;
		canvasControl.opts.jsonCfg = JSON.stringify(newJsonCfg);
		return JSON.stringify(newJsonCfg);
    }

    /*
     * 所有对所有UI的定义、创建、引用及销毁。
     */
    function CanvasUi() {
    	this.curElm;
    	this.selecting = false;
    	// 文本内容，为的是全局只保存一个实例
        this.textPanel;
        // 上传图片，为的是全局只保存一个实例
        this.imgPanel;
        // 当前画布是否有改动
        this.isModify = false;
        this.iContent;
    }

    // 初始化画布控件，不同的手机，pc对应的左侧菜单也不一样，目前暂时不支持，所以先不扩展
    CanvasUi.prototype.init = function() {
    	 jsonCfgText = {};
        // 增加组件
    	this.showHtmlImg();
        this.showCfg();
    }
    
    CanvasUi.prototype.showHtmlImg = function(){
    	var imageInfo= JSON.parse(canvasControl.opts.jsonCfg);
    	for (var key in imageInfo)
	    {	
			if(key == "logoImg" || key == "header"){
				jq('#'+key).attr("src",imageInfo[key][0]);
			}else{
				jq('#'+key).css('background-image', 'url(' + imageInfo[key][0] + ')');
			}
	    }
    }
    CanvasUi.prototype.showCfg = function(){
    	this.imgPanel = jq('<div class="canvas-edit-box"></div>');
		var title = jq('<div class="canvas-widget-header"><i class="widget-icon fa fa-tasks fa-lg themeprimary"></i> <span class="widget-caption themeprimary">图片编辑</span></div>');
		this.imgPanel.append(title);
		
		this.iContent = jq('<div class="canvas-widget-content"></div>');
		
		var imgTool = jq('<div id="imgTool" style="margin-top: 10px;"></div>');
		this.iContent.append(imgTool);
		this.imgPanel.append(this.iContent);
    	// 增加画布的处理表单对象，方便后续扩展
    	canvasControl.canvasForm = jq('<form id="canvasForm" class="form-horizontal" role="form" name="canvasForm" style="position: absolute;top: 5px;right:50px; " method="post"></form>');
    	var cfg= JSON.parse(canvasControl.opts.jsonCfg);
    	for(var id in cfg){
    		
	    	//正方形图片
	    	var item1 = jq('<div class="canvas-eachItem">' +
  				  '<div class="canvas-imgcontent-left">'+
  				'  <img title="上传图片" id="'+id+'edit'+'" onclick=uploadImg('+JSON.stringify(id)+',"'+cfg[id][2]+'") class="getImg" src="'+cfg[id][0]+'" width="100px" height="100px" style="cursor:pointer" imgcfg="'+cfg[id][2]+'"/>'+
				  '</div><div class="canvas-imgcontent-right">' +
				    '<div style="height:50px;margin-left:5px;padding-top:20px;">' +
				        '图片链接：<input type="text"  maxlength="128" placeholder="http 或 https开头" class="canvas-text-80 getTxt" value="'+cfg[id][1]+'"/>' +
				    '</div>' +
				  '</div>' +
				'</div>');
	    	//圆型图片
	    	var item2 = jq('<div class="canvas-eachItem">' +
	  				  '<div class="canvas-imgcontent-left">'+
	  				'  <img title="上传图片" id="'+id+'edit'+'" onclick=uploadImg('+JSON.stringify(id)+',"'+cfg[id][2]+'") class="getImg img-circle" src="'+cfg[id][0]+'" width="100px" height="100px" style="cursor:pointer" imgcfg="'+cfg[id][2]+'"/>'+
					  '</div><div class="canvas-imgcontent-right">' +
					    '<div style="height:50px;margin-left:5px;padding-top:20px;">' +
					        '图片链接：<input type="text" maxlength="128" placeholder="http 或 https开头" class="canvas-text-80 getTxt" value="'+cfg[id][1]+'"/>' +
					    '</div>' +
					  '</div>' +
					'</div>');
	    	var item3;
	    	//带有标题和内容的图片
	    	if(cfg[id][2].indexOf("isLogo=2") > 0){
	    		
	    	 item3 = jq('<div class="canvas-eachItem">' +
	  				  '<div class="canvas-imgcontent-left">'+
	  				'  <img title="上传图片" id="'+id+'edit'+'" onclick=uploadImg('+JSON.stringify(id)+',"'+cfg[id][2]+'") class="getImg" src="'+cfg[id][0]+'" width="100px" height="100px" style="cursor:pointer" imgcfg="'+cfg[id][2]+'"/>'+
					  '</div><div class="canvas-imgcontent-right">' +
					  
					  '<div style="height:30px;margin-left:5px;">' +
                      '标题：<input type="text" maxlength="64" class="canvas-text-35 getTitle" value="'+cfg[id][3]+'"/>' +
                      '</div>' +
                      
					  '<div style="height:35px;margin-left:5px;">' +
                      '内容：<input type="text" maxlength="128" class="canvas-text-90 getContent" value="'+cfg[id][4]+'"/>' +
                      '</div>' +
                      
				      '<div style="height:30px;margin-left:5px;">' +
				        '图片链接：<input type="text" maxlength="128"  placeholder="http 或 https开头" class="canvas-text-80 getTxt" value="'+cfg[id][1]+'"/>' +
				      '</div>' +
					  '</div>' +
					'</div>');
	    	}
	    	var cirIndex = cfg[id][2].indexOf("isLogo=1");
	    	if(cirIndex > 0){
	    		this.imgPanel.append(item2);
	    	}
	    	if(cfg[id][2].indexOf("isLogo=2") > 0){
	    		this.imgPanel.append(item3);
	    	}
	    	if(cfg[id][2].indexOf("isLogo=0") > 0){
	    		this.imgPanel.append(item1);
	    	}
	    	
	    	if(cfg[id][3] != undefined && cfg[id][2].indexOf("isLogo=0") > 0){
	    		var item4 = jq('<div class="canvas-edit-box" style="margin-top:20px;margin-right: -60px;">'+
		    			'<div><script id="editor'+cfg[id][3]+'" type="text/plain" class="canvas-widget-editor"></script></div>'+
		    			'</div>');
	    		var textId= cfg[id][3];
	    		var ueEdit = UE.getEditor("editor"+cfg[id][3]);
	    		
	    		// 必须插件创建完成后才能使用对象，否则会报错。
	    		ueEdit.addListener("ready", function () {
	    			var ueHtml = jq(canvasControl.canvasContent).find("#"+textId).children("span").first().html();
		    		ueEdit.setContent(ueHtml);
		    		jq("#edui1").addClass("edui1Temp2");
		    		jq("#edui1_iframeholder").addClass("edui1_iframeholderTemp2");
	        	});
	    		ueEdit.addListener("contentchange", function () {
		    		jq(canvasControl.canvasContent).find("#"+textId).children("span").first().html(ueEdit.getContent());
		    	});
	    		this.imgPanel.append(item4);
		    	jsonCfgText[id] = cfg[id][3];
	    	}else{
	    		jsonCfgText[id] = "";
	    	}
	    	
    	}
    	canvasControl.canvasForm.append(this.imgPanel);
    	jq('#tools').append(canvasControl.canvasForm);
    	
    }

    /*
     * 
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
        }
    });

    /*
     * 定义jQuery工具函数扩展
     * 
     * 类级别扩展,拓展jquery类   ,调用  jq.getRandomDateBetween()；
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