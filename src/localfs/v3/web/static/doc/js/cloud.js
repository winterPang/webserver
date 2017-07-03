;(function ($) {

	var _jMenu = $("#doc_menu");
	var _jContent = $("#doc_content");
	var _jDocList = $("#DocList");
	var _aAllItem = null;
	var _aDocName = null;
	var _aItemName = null;

	var EditBox = function()
	{
		var _jBox = null;
		var _jItem = null;
		var _isFirstIn = true;
		var i=0;

		function onDel()
		{
			console.log(2);
		}

		function onEdit()
		{
			console.log(1);
		}

		function onBtnClick(e){
			var nIndex = $(this).attr('index');
			var aFun = [onEdit,onDel];
			aFun[nIndex] && aFun[nIndex]();
		}

		function onLeave(e)
		{
			_jBox.hide();
		}

		function onEnter(e)
		{
			var jTarget = _jItem = $(this);

			if(jTarget.hasClass('no-edit'))
			{
				return false;
			}

			var nWidth = jTarget.outerWidth(),
				nHeight = jTarget.outerHeight(),
				nTop = jTarget.offset().top,
				nLeft = jTarget.offset().left;
			_jBox.css({'top':nTop, 'left':nLeft, 'width':nWidth, 'height':nHeight}).show();
		}

		function _init()
		{
			var sHtml = '<div class="edit-box">'+
							'<div class="tool-bar">'+
								'<span><i class="fa fa-edit" index="0"></i></span>'+
								'<span><i class="fa  fa-trash" index="1"></i></span></span>'+
							'</div>'+
						'</div>';
			$('.cloud-doc-explain.editable').mouseenter(onEnter);
			_jBox = $(sHtml).appendTo('body').mouseleave(onLeave);
			_jBox.find('.tool-bar').on('click','i.fa',onBtnClick);
		}

		this.init = _init;
	};

	function makeXml(o)
	{
		var aXml = [];
		for(var k in o)
		{
			if($.isArray(o[k]))
			{
				aXml.push('<'+k+'>');
				for(var i=0;i<o[k].length;i++)
				{
					aXml.push(makeXml(o[k][i]));
				}
				aXml.push('</'+k+'>');
			}
			else if(typeof o[k] == 'object')
			{
				aXml.push('<'+k+'>');
				aXml.push(formatData(o[k]));
				aXml.push('</'+k+'>');
			}
			else if(!o[k])
			{
				aXml.push('<'+k+'/>');
			}
			else
			{
				aXml.push('<'+k+'>'+o[k]+'</'+k+'>');
			}
		}

		return aXml.join('');
	}

	function getFormData(jScope,aId)
	{
		var oData = {};
		for(var i=0;i<aId.length;i++)
		{
			var jEle = $('#'+aId[i],jScope);
			var sVal = $.trim(jEle.val());
			if(jEle.hasClass('required') && !sVal)
			{
				$('#'+aId[i]+'_error').html("required").show();
				return null;
			}

			if(jEle.hasClass('json') && sVal)
			{
				try
				{
					sVal = JSON.parse(sVal);
				}
				catch(ex)
				{
					$('#'+aId[i]+'_error').html("wrong json").show();
					return null;
				}
			}

			oData[aId[i]] = sVal;
		}

		return oData;
	}

	function generateID(sPrefix)
	{
	    sPrefix = sPrefix||"webid";

	    return sPrefix+"_"+(""+Math.random()).substring(2);
	}

	/* 格式化JSON源码(对象转换为JSON文本) */ 
	function formatJson(txt,compress/*是否为压缩模式*/)
	{ 
      var indentChar = '    ';   
      if(/^\s*$/.test(txt)){   
          alert('数据为空,无法格式化! ');   
          return;   
      }   
      try{var data=eval('('+txt+')');}   
      catch(e){   
          alert('数据源语法错误,格式化失败! 错误信息: '+e.description,'err');   
           return;   
       };   
       var draw=[],last=false,This=this,line=compress?'':'\n',nodeCount=0,maxDepth=0;   
          
       var notify=function(name,value,isLast,indent/*缩进*/,formObj){   
           nodeCount++;/*节点计数*/  
           for (var i=0,tab='';i<indent;i++ )tab+=indentChar;/* 缩进HTML */  
           tab=compress?'':tab;/*压缩模式忽略缩进*/  
           maxDepth=++indent;/*缩进递增并记录*/  
           if(value&&value.constructor==Array){/*处理数组*/  
               draw.push(tab+(formObj?('"'+name+'":'):'')+'['+line);/*缩进'[' 然后换行*/  
               for (var i=0;i<value.length;i++)   
                   notify(i,value[i],i==value.length-1,indent,false);   
               draw.push(tab+']'+(isLast?line:(','+line)));/*缩进']'换行,若非尾元素则添加逗号*/  
           }else   if(value&&typeof value=='object'){/*处理对象*/  
                   draw.push(tab+(formObj?('"'+name+'":'):'')+'{'+line);/*缩进'{' 然后换行*/  
                   var len=0,i=0;   
                   for(var key in value)len++;   
                   for(var key in value)notify(key,value[key],++i==len,indent,true);   
                   draw.push(tab+'}'+(isLast?line:(','+line)));/*缩进'}'换行,若非尾元素则添加逗号*/  
               }else{   
                       if(typeof value=='string')value='"'+value+'"';   
                       draw.push(tab+(formObj?('"'+name+'":'):'')+value+(isLast?'':',')+line);   
               };   
       };   
        var isLast=true,indent=0;   
        notify('',data,isLast,indent,false);
        return draw.join('').replace(/(\/\/.*)\"\,/g,'",<code>$1</code>').replace(/(\/\/.*)\"/g,'"<code>$1</code>');   
    }

	function parseXml(sCode) {
		
		var getNodeName = function(sNode){
			var sUpCase = sCode.toUpperCase();
			var sStart = sUpCase.search(sNode);
			var sEnd = sNode.length;
			return sCode.substr(sStart,sEnd);
		};

		var oData = {};
		$(sCode).each(function(i,item){
			var skey = getNodeName(item.nodeName);
			if(item.children.length)
			{
				var sFlag = item.firstChild.nodeName;
				var nCount = -1;
				oData[skey] = [];
				$(item.children).each(function(j,child){
					if(sFlag  == child.nodeName)
					{
						var oChild = {};
						oChild[getNodeName(child.nodeName)] = child.innerHTML;
						oData[skey].push(oChild);
						nCount ++;
					}
					else
					{
						oData[skey][nCount][getNodeName(child.nodeName)] = child.innerHTML;
					}
				});
			}
			else
			{
				oData[skey] = item.innerHTML;
			}
		});

		return oData;
	}

	function addErrorCode(sCode,arr)
	{
		if(!sCode)
		{ 
			arr.push('<span class="null">N/A</span>');
			return ;
		}
		var oError = parseXml(sCode);
        var key;
		arr.push('<ul class="level-2">');
            		
        for(key in oError)
        {
        	arr.push('<li><code>'+key.substr(1)+'</code><span>'+oError[key]+'</span></li>');
        }

        arr.push('</ul>');

        return oError
	}

	function parseJson(sCode,arr)
	{
		if(!sCode)
		{ 
			arr.push('<span class="null">N/A</span>');
			return ;
		}

		var oReturn = parseXml(sCode);
        var sHtml = formatJson(JSON.stringify(oReturn));
        arr.push('<pre>'+sHtml+'</pre>');

        return oReturn;
	}

	function addParameters(sCode,arr)
	{
		if(!sCode)
		{ 
			arr.push('<span class="null">N/A</span>');
			return ;
		}

        var oPara = parseXml(sCode);
        var key;

        arr.push('<ul class="level-2">');

        for(key in oPara)
        {
        	arr.push('<li><code>'+key+'</code>');
        	if($.isArray(oPara[key]))
        	{
        		arr.push('<pre>'+formatJson(JSON.stringify(oPara[key]))+'</pre></li>');
        	}
        	else
        	{
        		arr.push('<span>'+oPara[key]+'</span></li>');
        	}
        }

        arr.push('</ul>');

        return oPara;
	}

	function makeItem(html,index,itme)
	{
		 html.push('<div class="cloud-doc-explain editable" item="'+itme.SubItem+'">');
			 html.push('<div class="cloud-doc-exp-head">');
				 html.push('<span class="cloud-doc-exp-label"><strong>'+itme.SubItem+'</strong></span>');
             html.push('</div>');
             html.push('<ul class="level-1">');
            	 html.push('<li><code><strong>Path</strong></code><span>'+itme.Path+'<span></li>');
            	 html.push('<li><code><strong>Method</strong></code><span>'+itme.Method+'</span></li>');
            	 html.push('<li><code><strong>Parameters</strong></code>');
                				//Loop to Add Parameters
                				addParameters(itme.Parameters,html);
                 html.push('</li>');
                 html.push('<li><span class="li-label">返回数据格式（JSON）</span>');
	                        	//Prase the Json Code
	                        	parseJson(itme.Return,html);
                 html.push('</li>');
                 html.push('<li><span class="li-label">错误码</span>');
                        		//Loop to Add Error Code
                        		addErrorCode(itme.Error,html);
                 html.push('</li>');
             html.push('</ul>');
         html.push('</div>');
	}

	function makeTitle(html,index,name)
	{
		html.push('<div class="cloud-doc-title"><strong>'+name+'</strong><a name="cloud_'+index+'" class="doc_anchor"><span></span></a></div>');
	}

	function makeMenu(html,index,name)
	{
		html.push('<li><a href="#cloud_'+index+'">'+name+'<span></span></a></li>');
	}

	function initPage(aData,sType)
	{
		var aItems = _aAllItem = aData;
		var oFilter = {}, aMenuHtml = [], aConHtml = [];
		_aItemName = [];
		for(var i=0;i<aItems.length;i++)
		{
			var sName = aItems[i].ItemName;

			if(oFilter[sName])
			{
				makeItem(aConHtml,i,aItems[i]);
				continue;
			}

			//make menus
			oFilter[sName] = true;
			_aItemName.push({'text':sName,'id':sName,'name':sName});
			makeMenu(aMenuHtml,i,sName);
			makeTitle(aConHtml,i,sName);
			makeItem(aConHtml,i,aItems[i]);
		}

		aMenuHtml.push('<li class="operation-li" action="onAddItem"><a><i class="fa fa-plus"></i></a></li>');
		_jMenu.append(aMenuHtml.join(''));
		_jContent.empty().append(aConHtml.join(''));

		//then call init menu
		window._isMenuReady = true;

		var oEditBox = new EditBox;

		oEditBox.init();
	}

	function onAddItem()
	{
		var onOk = function (){
			
			var aKey = ['ItemName','SubItem','Path','Method','Parameters','Error','Return']
			var oData = getFormData(jDlg,aKey);

			if(!oData)
			{
				return ;
			}

			var sItem = oData.ItemName, sSub = oData.SubItem;
			var isNew = true;

			for(var i=4;i<aKey.length;i++)
			{
				oData[aKey[i]] = makeXml(oData[aKey[i]]);
			}

			for(var i=0;i<_aAllItem.length;i++)
			{
				if(sItem == _aAllItem[i].ItemName && sSub == _aAllItem[i].SubItem)
				{
					isNew = false;
					$.extend(_aAllItem[i],oData)
					break;
				}
			}

			if(isNew)
			{
				_aAllItem.push(oData);
			}


			$.ajax({
				type : 'post',
				url : '/v3/web/doc/addapi',
				dataType:'json',
				data : JSON.stringify(_aAllItem),
				success:function()
				{

				},
				error:function()
				{

				}
			});
		};

		var onCancel  = function(){

		};

		var jDlg = $('#addItemDlg').modal({backdrop:true});
		
		$('.btn-primary',jDlg).click(onOk);
		var oOpt = {
			source:_aItemName,
			valueFiled:'id',
			itemField:'text',
			items:_aItemName.length
		};
		$("#ItemName").typeahead(oOpt);

	}

	function onAddDoc()
	{
		
		var onOk = function (){
			var sName = $.trim($('#NewDocName').val());
			var oData = {
				Name :sName,
				Docindex : generateID('doc'),
				AllItems : []
			};

			$.ajax({
				type : 'post',
				//url : '/v3/web/doc/addapi',
				url : 'data/cloud.json',
				dataType:'json',
				data : JSON.stringify(oData),
				success:function()
				{

				},
				error:function()
				{

				}
			});
		};

		var onCancel  = function(){

		};

		var jDlg = $('#addDocDlg').modal({backdrop:true});
		
		$('.btn-primary',jDlg).click(onOk);
	}

	function onDocChanged(index)
	{
		$.ajax({
			type:'get',
			//url:'/v3/web/doc/getdocapi? Docindex='+index,
			url:'data/cloud.json',
			success:function(data){
				initPage(data.AllItems);
			},
			error:function(){
				console.error(sType+";"+oError.name+":"+oError.message);
			}
		});
	}

	function initList(aData,sType)
	{
		var aList = [];
		_aDocName = aData;
		for(var i=0;i<_aDocName.length;i++)
		{
			aList.push('<option value="'+_aDocName[i].Docindex+'">'+_aDocName[i].Name+'</option>');
		}

		_jDocList.html(aList.join('')).change(function(){

		});

		$('#AddDoc').click(onAddDoc);
		onDocChanged(_aDocName[0].Docindex);
	}

	//get DOC List
	$.ajax({
		type:'get',
		//url:'/v3/web/doc/getdoclist',
		url:'data/cloud.json',
		success:function(data){
			initList(data.doclist);
		},
		error:function(){
			console.error(sType+";"+oError.name+":"+oError.message);
		}
	});

	/*$.when($.ajax('data/cloud.json'), $.ajax('data/cloud.json'))
	 .done(function(aRes1,aRes2){
	 	initList(aRes1[0],aRes1[1]);
	 	initPage(aRes2[0],aRes2[1]);
	 })
	 .fail(function(oAjax,sType,oError){
	 	console.error(sType+";"+oError.name+":"+oError.message);
	 });*/

	 window.Page = {
	 	onAddItem : onAddItem
	 };
 
})( jQuery );