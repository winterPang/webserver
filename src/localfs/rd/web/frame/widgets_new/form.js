;(function($)
{
	var WIDGETNAME = "Form";
	var _IsSave = false;

	function portletForm(jPortLet, bNeedTitle)
	{
		this.setCaption = setCaption;
		this.appendTool = appendTool;
		this.close = close;
		var _jCaption = null;
		var _jTools = null;
		var _jWaring = null;
		var _bNeedTitle = bNeedTitle;

		function close(pfClosed)
		{
			//Frame.Button.onCancel();
			history.back();

			pfClosed && $.isFunction(pfClosed) && pfClosed();
		}

		function init (jPortLet)
		{
            var jTitle = $(".headline", jPortLet);
            if (jTitle.length > 0)
            {
            	jTitle.html("");
            }
            else
            {
            	jTitle = $('<div class="headline wlan-headline"></div>');
            }
            _jCaption = $('<div class="caption"><a class="back"></a><span class="title"></span></div>');

            _jTools = $(".form-actions", jPortLet).empty();
            if(_jTools.length == 0)
            {
            	_jTools = $('<div class="form-actions"></div>').appendTo ($("form", jPortLet).first());
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

            jTitle.append(_jCaption);

            jPortLet.prepend(_jWaring);
            _bNeedTitle && jPortLet.prepend(jTitle);
            $(".headline .back").click(function(){close();});
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
            	if(oParent.hasClass("portlet"))
            	{
                	_oCase = new portletForm(oParent, true);
            	}
            	else if(oParent.hasClass("tab-pane"))
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
			function makeButton(oButton, jForm)
			{
				var sColor = oButton.color ? oButton.color : "";
				var sClass = oButton.className ? oButton.className : "";
				//sClass = oButton.
				var sAHead = '<a href="#" class="btn ' + sColor +' '+sClass+'">';
				var sAEnd = oButton.text + '</a>';
				var sIconHtml = oButton.icon ? '<i class="' + oButton.icon + '"></i> ' : "";
				var jButton = $(sAHead+sIconHtml+sAEnd);
				jButton.attr("form", _sFormName);

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
					jButton.click(function(e){oButton.action.apply(this);return false;});
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
			function onSave()
			{
				_IsSave = true;
				_jForm.submit();
				return false;
			}
			function onCancel()
			{
				close();
				return false;
			}

			var _oBtnRc = $.MyLocale.Buttons;
			_oBtnRc.SAVE = _oBtnRc.SAVE || "Apply and Save";
			var oToolMds = {
				"btn_apply" : {"color" : "btn-primary", "icon" : "icon-ok", "bSubmit" : true,"text" : _oBtnRc.OK},
				"btn_save" : {"color" : "btn-primary", "icon" : "fa-save", "text" : _oBtnRc.SAVE, "action": onSave},
				"btn_cancel" : {"color" : "", "icon" : "icon-remove", "text" : _oBtnRc.CANCEL, "action" : onCancel},
				"btn_edit" : {"color" : "btn-primary", "icon" : "icon-ok", "bSubmit" : true, "text" : _oBtnRc.OK, "action" : onEdit}
			};

			var iToolNum = 0;
			for(var sType in oTools)
			{
				var oUserBtn = oTools[sType];
				if (!oToolMds[sType] || !oUserBtn)
				{
					continue;
				}

				if ($.isFunction(oUserBtn))
				{
					oUserBtn = {"action" : oUserBtn};
				}
				if(sType == "btn_apply" || sType == "btn_save")
				{
					oToolMds[sType].className = "disabled";
				}
				//by wkf4808
				if(window.location.href.split("?")[2] == "np=Syslog.Syslog")
				{
					oToolMds[sType].className = "";
				}

				var oNewBtn = $.extend({}, oToolMds[sType], oUserBtn);
				var oNewTool = makeButton(oNewBtn, _jForm);
				iToolNum++;

				if (iToolNum > 1)
				{
					_oCase.appendTool($("<span>&nbsp;</span>"));
				}

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
				"btn_save" : false,
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
						oSelf._aOnSubmit[i].apply(this,[_IsSave]);
					}
				}

				_IsSave = false;

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
			$("input:[type='radio'], input:[type='checkbox'], select", jForm).die("change");
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
        	$("input:[type='radio'], input:[type='checkbox'],select", jForm).live("change",function(){
        		var oParent = jForm.parent();
        		var oBody = $("body");
        		while (!oParent.is(oBody))
	        	{
	            	oParent  = oParent.parent();
	        	}
				$(".form-actions a",oParent).removeClass("disabled");
			});
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