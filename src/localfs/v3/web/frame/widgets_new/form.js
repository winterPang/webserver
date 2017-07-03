;(function($)
{
	var WIDGETNAME = "Form";

	function portletForm(jPortLet, isToggle)
	{
		this.setCaption = setCaption;
		this.appendTool = appendTool;
		this.close = close;
		this.type = "box";
		var _jCaption = null;
		var _jTools = null;
		var _jWaring = null;
		var _isToggle = isToggle;
		var _jTopBtn = null;

		function close(pfClosed)
		{
			//Frame.Button.onCancel();
			//history.back();

			pfClosed && $.isFunction(pfClosed) && pfClosed();
		}

		function init (jPortLet)
		{
			var jContainer ;
			if(isToggle)
				jContainer = jPortLet.closest('.toggle-block').find('.toggle-tool-bar');
			else
				jContainer = jPortLet.closest('.app-box').find('.box-footer');


            _jTools = $(".form-actions.bottom", jPortLet).empty();
			$(".form-actions.top",jPortLet).remove();
            if(_jTools.length == 0)
            {
            	_jTools = $('<div class="form-actions bottom hide"></div>').appendTo ($("form",jPortLet));
            }

            _jWaring = $(".editor-alert", jPortLet).first();
            if (_jWaring.length > 0)
            {
            	_jWaring.html("");
            }
            else
            {
            	_jWaring = $('<div class="editor-alert"></div>');
            }

            jPortLet.prepend(_jWaring);
			makeTopBtn(jPortLet);
        }

		function makeTopBtn(jParent)
		{
			var jContainer, jTop, jButtom;
			if(isToggle)
			{
				jContainer = jParent.closest('.toggle-block').find('.toggle-tool-bar');
			}
			else
			{
				jContainer = jParent.closest('.app-box').find('.box-footer');
			}
			_jTopBtn = $(".form-actions.top",jParent).empty();
			if(_jTopBtn.length == 0)
			{
				var sHtml = '<div class="form-actions top hide">'+
						        '<a href="javascript:void(0)" class="form-btn icon-ok title="' + $.MyLocale.Buttons.OK +'"></a>' +
					            '<a href="javascript:void(0)" class="form-btn icon-remove title="' + $.MyLocale.Buttons.CANCEL + '"></a>'+
						     '</div>';
				_jTopBtn = $(sHtml).appendTo(jContainer);
			}
			$('a.form-btn',_jTopBtn).click(function(){
				var jBottmoBtn = $(".form-actions.bottom a",jParent);
				if($(this).hasClass('icon-ok'))
				{
					jBottmoBtn.first().click();
				}
				else
				{
					jBottmoBtn.last().click();
				}
			});
		}

		function appendTool(jTool)
		{
			if (_jTools && jTool)
			{
				_jTools.append(jTool);
			}
		}

		function setCaption(sCaption)
		{
			if (_jCaption && sCaption)
			{
				$("span",_jCaption).text(sCaption);
			}
		}

		init (jPortLet);
	}

	function modalForm(jModal, opt)
	{
		this.setCaption = setCaption;
		this.appendTool = appendTool;
		this.close = close;
		this.type = "modal";
		var _jCaption = null;
		var _jTools = null;
		var _jWaring = null;
		var _jModal = null;

		function close(pfClosed)
		{
			jModal.modal("hide");
		}

		function _onDlgHide()
		{
			// 
			if (opt && opt.onClose)
			{
				opt.onClose ();
			}

			jModal.unbind ("hide");
		}

		function init (jModal)
		{
			var jTitle = $(".modal-header", jModal);
			if (jTitle.length > 0)
			{
				jTitle.html("");
			}
			else
			{
				jTitle = $('<div class="modal-header"></div>');
				jModal.prepend(jTitle);
			}

            var jCloseBtn = $('<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>');
            _jCaption = $('<h3></h3>');
            _jModal = jModal;
            jTitle.append(jCloseBtn);
            jTitle.append(_jCaption);

            _jTools = $(".modal-footer", jModal);
			$(".form-actions.bottom", jModal).empty();
            if (_jTools.length > 0)
            {
            	_jTools.html("");
            }
            else
            {
            	_jTools = $('<div class="modal-footer form-actions"></div>');
            	jModal.append(_jTools);
            }

            _jWaring = $(".editor-alert", jModal);
            if (_jWaring.length > 0)
            {
            	_jWaring.html("");
            }
            else
            {
            	_jWaring = $('<div class="editor-alert"></div>');
            	jModal.append(_jWaring);
            }

            jModal.bind("hide", _onDlgHide);
		}

		function appendTool(jTool)
		{
			if (_jTools && jTool)
			{
				_jTools.append(jTool);
			}
		}

		function setCaption(sCaption)
		{
			if (_jCaption && sCaption)
			{
				_jCaption.text(sCaption);
			}
		}

		init (jModal);
	}

	function settingForm(jSetting)
	{
		this.setCaption = setCaption;
		this.appendTool = appendTool;
		this.close = close;
		var _jWaring = null;
		var _jSetting = null;

		function close(pfClosed)
		{
			jSetting.addClass ("hide");

			pfClosed && $.isFunction(pfClosed) && pfClosed();
		}

		function init (jSetting)
		{
            return;
		}

		function appendTool(jTool)
		{
			if (!jTool || (0 == jTool.length))
			{
				return;
			}

            var jTools = $(".form-actions", jSetting);
            if (0 == jTools.length)
            {
            	jTools = $('<div class="form-actions"></div>').appendTo ($("form", jSetting));
            }

			jTools.append(jTool);
		}

		function setCaption(sCaption)
		{
			return;
		}

		init (jSetting);
	}

	function formHead (jForm, opt)
	{
		this.setCaption = setCaption;
		this.appendTools = appendTools;
		this.close = close;
		var _sFormName = null;
		var _jForm = null;
		var _oCase = null;

		function init (oFrom)
		{
			var oParent = oFrom.parent();
			var oBody = $("body");
			_sFormName = jForm.attr("name");
			_jForm = jForm;

        	while (!oParent.is(oBody))
        	{
            	if(oParent.hasClass("toggle-block"))
            	{
                	_oCase = new portletForm(oParent, true);
            	}
            	else if(oParent.hasClass("box-body"))
            	{
            		_oCase = new portletForm(oParent,false);
            	}
            	else if(oParent.hasClass("modal"))
            	{
            		_oCase = new modalForm(oParent, opt);
            	}
            	else if(oParent.hasClass("setting"))
            	{
            		_oCase = new settingForm(oParent, opt);
            	}
            	if(_oCase)
            	{
            		oParent.addClass("page");
            		break;
            	}
            	oParent  = oParent.parent();
        	}
		}

		function close(pfClosed)
		{
			_oCase.close(pfClosed);
		}

		function appendTools (oTools)
		{
			function makeButton(oButton, jForm,sType)
			{
				function box()
				{
					var sColor = oButton.color ? oButton.color : "";
					var sClass = oButton.className ? oButton.className : "";
					var sAHead = '<a href="javascript:void(0)" class="btn '+ sColor +' '+ sClass + '">';
					var sAEnd = oButton.text + '</a>';
					jButton = $(sAHead+sAEnd);
				}

				function modal()
				{
					var sColor = oButton.color ? oButton.color : "";
					var sClass = oButton.className ? oButton.className : "";
					//sClass = oButton.
					var sAHead = '<a href="javascript:void(0)" class="btn ' + sColor +' '+sClass+'">';
					var sAEnd = oButton.text + '</a>';
					//var sIconHtml = oButton.icon ? '<i class="' + oButton.icon + '"></i> ' : "";
                    			var sIconHtml = "";
					jButton = $(sAHead+sIconHtml+sAEnd);
					//jButton.attr("form", _sFormName);
				}

				var jButton ;
				
				eval(sType)();

				if (oButton.bSubmit)
				{
					jForm.form("appendToSubmit", oButton.action);
					jButton.click(function(e){
						if(!$(this).hasClass('disabled'))
						{
							onApply.apply(this);
						}
						return false;
					});
				}
				else
				{
					jButton.click(function(e){
						oButton.action.apply(this);
						$(this).prev('a').addClass("disabled");
						$(this).closest('.app-box').find('.form-actions').addClass("hide");
						if($(this).closest(".box-footer").length || $(this).closest(".toggle-block").length)
						{
							$(this).closest('.form-actions').addClass("hide");
						}
						return false;
					});
				}

				return jButton;
			}
			function onApply()
			{
				_jForm.submit();
				return false;
			}
			function onEdit()
			{
				_jForm.form("changeType", "edit");
				return false;
			}
			function onCancel()
			{
				close();
				return false;
			}

			var _oBtnRc = $.MyLocale.Buttons;
			var oToolMds = {
				"btn_apply" : {"color" : "btn-apply", "icon" : "icon-ok", "bSubmit" : true,"text" : _oBtnRc.OK},
				"btn_cancel" : {"color" : "btn-cancel", "icon" : "icon-remove", "text" : _oBtnRc.CANCEL, "action" : onCancel},
				"btn_edit" : {"color" : "btn-primary", "icon" : "icon-ok", "bSubmit" : true, "text" : _oBtnRc.OK, "action" : onEdit}
			};

			var iToolNum = 0;
			for(var sType in oTools)
			{
				var oUserBtn = oTools[sType];
				if($.isFunction(oUserBtn))
				{
					oUserBtn = {
						"action" : oUserBtn,
						"show"   : true
					};
				}
				else
				{
					oUserBtn = {
						"enable" : oUserBtn.enable,
						"action": oUserBtn.action,
						"show" : oUserBtn
					};
				}

				if (!oToolMds[sType] || !oUserBtn["show"])
				{
					continue;
				}
				
				if(!oUserBtn.enable && (sType == "btn_apply" || sType == "btn_save"))
				{
					oToolMds[sType].className = "disabled";
				}

				var oNewBtn = $.extend({}, oToolMds[sType], oUserBtn);
				var oNewTool = makeButton(oNewBtn, _jForm,_oCase.type);
				iToolNum++;
				oNewTool.attr("form", _sFormName);
				_oCase.appendTool(oNewTool);
			}
		}

		function setCaption(sCaption)
		{
			_oCase.setCaption(sCaption);
		}

		init (jForm);
	}

	function addForm (oForm, sType, oOpt)
	{
		this.close = close;
		var _oFormHead = null;

		function close (pfClosed)
		{
			_oFormHead.close(pfClosed);
		}

		function init (oForm, sType, oOpt)
		{
			var oButtonList = {
				"btn_apply" : true,
				"btn_cancel" : true
			};

			for (var sType in oButtonList)
			{
				if (typeof oOpt[sType] !== "undefined")
				{
					oButtonList[sType] = oOpt[sType];
				}
			}

			_oFormHead = new formHead (oForm, oOpt);
			_oFormHead.setCaption(oOpt.title);
			_oFormHead.appendTools(oButtonList);
		}

		init (oForm, sType, oOpt);
	}

	function viewForm (oForm, sType, oOpt)
	{
		this.close = close;
		var _oFormHead = null;

		function close (pfClosed)
		{
			_oFormHead.close(pfClosed);
		}

		function init (oForm, sType, oOpt)
		{
			var oButtonList = {
				"btn_edit" : null,
				"btn_cancel" : null
			};

			if ("show-only" == sType)
			{
				oButtonList = {
				"btn_apply" : close
				};
			}

			for (var sType in oButtonList)
			{
				if (oOpt[sType])
				{
					oButtonList[sType] = oOpt[sType];
				}
			}

			_oFormHead = new formHead (oForm);
			_oFormHead.setCaption(oOpt.title);
			_oFormHead.appendTools(oButtonList);
		}

		init (oForm, sType, oOpt);
	}

	function customForm (oForm, sType, oOpt)
	{
		this.close = close;
		var _oFormHead = null;

		function close (pfClosed)
		{
			_oFormHead.close(pfClosed);
		}

		function init (oForm, sType, oOpt)
		{
			_oFormHead = new formHead (oForm);
			_oFormHead.setCaption(oOpt.title);
			_oFormHead.appendTools(oOpt.customBtns);
		}

		init (oForm, sType, oOpt);
	}

	function configForm (oForm, sType, oOpt)
	{
		this.close = close;
		var _oFormHead = null;

		function close (pfClosed)
		{
			_oFormHead.close(pfClosed);
		}

		function init (oForm, sType, oOpt)
		{
			return;
		}

		init (oForm, sType, oOpt);
	}

	var oForm = {
		options:{
            submit : "self"
        },
		_create: function(){
			this._oForm = this.element;
			this._aOnSubmit = [];
			this._sType = null;
			this._oFormHead = null;
		},
		init: function (sType, oOpt)
		{
			var oFormTypes = {
				"add" : addForm,
				"edit" : addForm,
				"copy" : addForm,
				"setting" : configForm,
				"confirm" : addForm,
				"show-edit" : viewForm,
				"show-only" : viewForm,
				"custom" : customForm,
				"update" : configForm
			};
			var oSelf = this;

			function onSubmit ()
			{
				if (oSelf.options.submit == "system")
				{
					return true;
				}
				
				if (oSelf.checkTable())
				{
					for (var i = 0; i < oSelf._aOnSubmit.length; i++)
					{
						oSelf._aOnSubmit[i].apply(this);
					}
				}

				return false;
			}

			this._oFormHead = new oFormTypes[sType](this._oForm, sType, oOpt);
			this._oForm.unbind().submit(onSubmit);
			Utils.Widget.autoCheckForm(this._oForm);
		},
        changeButtons: function(oNewBtns)
        {
            if((!oNewBtns) || (!$.isPlainObject(oNewBtns)))
            {
                return;
            }
            var jModal = this.element.parents(".modal");
            var jFooter = $(".modal-footer",jModal);
            if(jFooter.length != 0)
            {
            	this._aOnSubmit = [];
                jFooter.empty();
                var sCaption = $(".modal-header h3",jModal).text();
                /* append new buttons */
                var oTmpForm = new formHead (this.element);
                oTmpForm.setCaption(sCaption);
                oTmpForm.appendTools(oNewBtns);
            }
            return;
        },
		checkTable: function()
		{
			var aEles = this._oForm.get(0);
			var bRet = true;
			for (var i = 0; i < aEles.length; i++)
			{
				bRet = (Utils.Widget.checkEle($(aEles[i])) && bRet);
			}
			return bRet;
		},
		_getEleByKey: function(sKey)
		{
			//
			sKey = sKey.replace (".", "\\.");
			var jEle = $("#"+sKey, this._oForm);
			if(jEle.length == 0)
			{
				// is radio, get by name
				jEle = $("[name='"+sKey+"']", this._oForm);
			}
			return jEle;
		},
		getTableValue: function(oTable, para)
		{
			var aTotalCol = [];
			var oData = {};
			var oEmptyData = {};
			var option = {prefixId: "", onlyEmpty: false};
			
			if($.isPlainObject(para))
			{
				$.extend(option, para);
			}
			else
			{
				option.onlyEmpty = para||false;
			}

			$.merge(aTotalCol, oTable.index);
			$.merge(aTotalCol, oTable.column);
			for (var i = 0; i < aTotalCol.length; i++)
			{
				var sKey = aTotalCol[i];
				var jEle = this._getEleByKey(option.prefixId+sKey);
				var oValue = Utils.Widget.getJEleValue(jEle);
				if (oValue)
				{
					oData[sKey] = oValue;
				}
				else if (jEle.attr("allowempty") == "true")
				{
					oData[sKey] = "";
				}
				else
				{
					oEmptyData[sKey] = "";
				}
			}
			return option.onlyEmpty ? oEmptyData : oData;
		},
		updateForm: function(oData, para)
		{
			var jForm = this._oForm;
			var oParent = jForm.parent();
			function removehide(){

			var oBody = $("body");
			while (!oParent.is(oBody) && !oParent.is('.app-box'))
			{
			oParent  = oParent.parent();
			}
			$(".form-actions",oParent).removeClass("hide");
			$(".form-actions a",oParent).removeClass("disabled");
			}

			$("input:[type='radio'], input:[type='checkbox'], input:[type='text'], select", jForm).off("change.form");
			if (oParent.hasClass("toggle-body")) {
				$(".form-actions",oParent).addClass("hide");
				$(".form-actions a",oParent).addClass("disabled");
			}
			var option = {prefixId: ""};
			
			if($.isPlainObject(para))
			{
				$.extend(option, para);
			}
			else
			{
				option.prefixId = para||"";
			}

			for(var sKey in oData)
        	{
            	var jEle = this._getEleByKey(option.prefixId+sKey);
            	Utils.Widget.setJEleValue(jEle, oData[sKey]);
        	}
        	$(jForm).on("change.form",removehide);
		},
		appendToSubmit: function(pfOnSubmit)
		{
			var bFlag = true;
			for(var i=0;i<this._aOnSubmit.length;i++)
			{
				if(this._aOnSubmit[i].constructor == pfOnSubmit.constructor)
				{
					this._aOnSubmit[i] = pfOnSubmit;
					bFlag = false;
					break;
				}
			}
			if(bFlag)
			{
				this._aOnSubmit.push(pfOnSubmit);
			}
		},
		close : function (pfClosed)
		{
			this._oFormHead.close(pfClosed);
		},
		_destory:function()
        {
            this._oForm = null;
			this._aOnSubmit = null;
			this._sType = null;
			this._oFormHead = null;
            $.Widget.prototype.destroy.call(this);
        }
	};

    $.widget("ui.form", oForm);

    function _init(oFrame)
    {
        $(".form", oFrame).form();
    }

    function _destroy()
    {

    }

    Widgets.regWidget(WIDGETNAME, {"init": _init, "destroy": _destroy, "widgets": [], "utils":["Widget"]});
})(jQuery);