;(function($)
{
var WIDGETNAME = "SList";
var _hTimer = null,_nResizeCount = 0;

function getFormatter (oColDef)
{
    return (oColDef.formatter || Frame.Formatters.Default);
}

var Sorter =
{
    create: function(opt)
    {
    },

    String: function(a, b, oColDef, isDesc)
    {
        var x = a[oColDef]||"", y = b[oColDef]||"";
        //var x = a[oColDef.field]||"", y = b[oColDef.field]||"";
        var nFlag = (x == y ? 0 : (x > y? 1 : -1));
        return isDesc ? -nFlag : nFlag;
    },

    Integer: function(a, b, oColDef, isDesc)
    {
        var x = parseInt(a[oColDef])||-999, y = parseInt(b[oColDef])||-999;

        var nFlag = (x == y ? 0 : (x > y? 1 : -1));
        return isDesc ? -nFlag : nFlag;
    },

    // port, eg: Ethnet2/01, Vlan-Interface3, Loopback10
    Port: function(a, b, oColDef, isDesc)
    {
        var x = a[oColDef]||"", y = b[oColDef]||"";

        var nFlag = (x == y ? 0 : (x > y? 1 : -1));
        return isDesc ? -nFlag : nFlag;
    },

    // ipv4
    IPv4: function(a, b, oColDef, isDesc)
    {
        var x = Frame.Util.IpStr2Integer(a[oColDef]), y = Frame.Util.IpStr2Integer(b[oColDef]);

        var nFlag = (x == y ? 0 : (x > y? 1 : -1));
        return isDesc ? -nFlag : nFlag;
    },

    // Ipv6
    IPv6: function(a, b, oColDef, isDesc)
    {
        var x = a[oColDef], y = b[oColDef];

        var nFlag = (x == y ? 0 : (x > y? 1 : -1));
        return isDesc ? -nFlag : nFlag;
    }
};

function mergeButton(aSrc,aUser)
{
    var aNewBtns = [],
        oSupportBtn = {"add":true,"delete":true,"open":true};
    for(var i=0;i<aUser.length;i++)
    {
        var oTempBtn = null;
        for(var j=0;j<aSrc.length;j++)
        {
            if(aUser[i].name == aSrc[j].name)
            {
                oTempBtn = $.extend({},aSrc[j],aUser[i]);
                break;
            }
        }

        if(oTempBtn)
        {
            aNewBtns.push(oTempBtn);
        }
        else if(!oSupportBtn[aUser[i].name])
        {
            aNewBtns.push($.extend({},aUser[i]));
        }
    }
    return aNewBtns;
}
function getDefButtons()
{
    return [
        {id:"slist_add",    no:999, name:"add",     value:$.MyLocale.Buttons.ADD,         enable:true, icon:"slist-add",   action:function add(){},},
        {id:"slist_del",    no:999, name:"delete",  value:$.MyLocale.Buttons.BATCHDEL,    enable:">0", icon:"slist-del"},
        {id:"slist_open",   no:999, name:"open",    value:$.MyLocale.Buttons.OPEN,         enable:true, icon:"slist-open",   action:function open(){}},
    ];
}

Frame.SimpleList = function (_jSlist)
{
    var _options = {
        data : [],
        curData : [],
        showHeader : true,
        rowHeight : 25,
        minWidth : 30,
        pageNum : 1,
        pageSize : 0,    // 0 ghost no page
        search : true,
        multiSelect : false,
        sortable : true,
        showTip : true,
        onToggle : false,
        columnResize : true
    };
    var _jTable, _jDateView;

    function _create (opt)
    {
        parseOpt (opt);

        var sBodyID = Frame.Util.generateID("slistbody");
        _jTable = $('<div id="'+sBodyID+'" class="slist-body"></div>').appendTo(_jSlist);
        
        _options.showHeader && createHeader (_jTable);
        if(!_options.onToggle)
        {
            createSearch(_options.search, _jTable);
        }
        var sClassName = "";

        _jDateView = $('<div class="slist-center '+sClassName+'"></div>').appendTo(_jTable);
        createPageBar(_options, _jTable);
        createButtons(_options,_jTable);

        if(_options.height || _options.pageSize)
        {
            var nHeight = false;
            nHeight  = _options.pageSize ? _options.rowHeight*(_options.pageSize) +3: nHeight;
            _options.height = nHeight || _options.height;
            _jDateView.css({'height' : _options.height}).addClass("scroll-able");
        }
    }

    function parseOpt (opt) 
    {
        $.extend (_options, opt);

        var aColMod = _options.colModel;
        var aColName = opt.colNames;

        if("string"==typeof(aColName))
        {
            aColName = aColName.split(",");
        }

        _options.colModel = [];

        for (var i = 0; i < aColMod.length; i++) 
        {
            var oColDef = aColMod[i];
            oColDef.field = oColDef.id = oColDef.name;
            oColDef.title = aColName[i];
            oColDef.showTip = oColDef.showTip || true;
            if(i != aColMod.length-1)
            {
                oColDef.resizable = true;
            }
            _options.colModel.push (oColDef);
        };
        setColWidth(_options.colModel);
    }

    function setColWidth(aColDef)
    {
        aColDef = aColDef || [];
        var nSearchColWidth = 25, nCheckboxColWidth = 20 ,nScrollBarWidth = 0;
        var nTotal = _jSlist.width()-nSearchColWidth-nScrollBarWidth,
            nCustom = 0, nMin = 0,
            nMinCount = 0 , nTemp = 0;
        var nCol = aColDef.length;

        if(_options.multiSelect)nTotal -= nCheckboxColWidth;

        for(var i=0;i<nCol;i++)
        {
            var oColMod = aColDef[i];
            if(oColMod.width && oColMod.width > _options.minWidth)
            {
                nCustom += oColMod.width;
            }
            else
            {
                oColMod.width = false;
                nMin += _options.minWidth;
                nMinCount ++ ;
            }
        }

        //true is normal, false is too large.
        var bFlag = (nCustom + nMin <= nTotal && nMinCount);
        nTemp = bFlag ? nTotal - nCustom : nTotal - nMin; 

        for (var i = 0; i < nCol; i++) 
        {
            if(bFlag)
            {
                aColDef[i].finalWidth = aColDef[i].width || nTemp/nMinCount;
            }
            else
            {
                aColDef[i].finalWidth = aColDef[i].width/nCustom*nTemp || _options.minWidth;
            }
        };
    }

    function createHeader (jTable) 
    {
        var jHead = $('<div class="slist-head"></div>').appendTo (jTable);
        var aColumns = _options.colModel;
        var nCol = aColumns.length;

        if(_options.multiSelect)
        {
            var jHeadCheck = $('<div class="head-check check-column"><input type="checkbox"/></div>').appendTo (jHead);
            $('input',jHeadCheck).change(function(){
                $('input',_jTable).attr("checked",this.checked);
                if(this.checked)
                {
                    $('.slist-row',_jDateView).addClass('active');
                }
                else
                {
                    $('.slist-row',_jDateView).removeClass('active');
                }
            });
        }

        for (var i = 0; i < nCol; i++)
        {
            var sName = aColumns[i].title;
            var jTd = $('<div class="head-column sl'+i+'" sid="'+aColumns[i].id+'"></div>').appendTo (jHead);
            jTd.width(aColumns[i].finalWidth);
            $('<span class="head-name" title="'+sName+'">'+sName+'</span><span class="sort-icon"></span>').appendTo (jTd);
        }

        $('<div class="search-column hide" title="'+$.MyLocale.MList.search.SEARCH+'"><span class="search-icon"></span></div>').appendTo(jHead);
        if(_options.sortable && !_options.onToggle)
        {
            // $('.head-column', jHead).addClass('head-hover').click(function(){
            //     var jSort = $(this).children('span.sort-icon');
            //     var bFlag = jSort.hasClass('sort-asc');

            //     $(this).parent().children().children('.sort-icon').removeClass('sort-desc sort-asc');

            //     if(bFlag)   //current is asc
            //     {
            //         jSort.addClass('sort-desc');
            //     }
            //     else    //current is desc or no sort
            //     {
            //         jSort.addClass('sort-asc');
            //     }

            //     onSort(bFlag,$(this).attr("sid"));
            // });
        }

        if(_options.columnResize)
        {
            setupColumnResize(jHead);
        }
    }

    function createSearch(bFlag, jTable)
    {
        if(!bFlag)
        {
            return ;
        }

        var aColDef = _options.colModel;
        var jSearch = $('<div class="slist-search hide"></div>').insertBefore($('.slist-head', jTable));

        for(var i=0;i<aColDef.length;i++)
        {
            var sName = aColDef[i].title;
            sName.replace(/\'/g,'&apos;').replace(/\'/g,'&quot;');
            var jTd = $('<div class="head-search"><input type="input" sid="'+aColDef[i].id+'" class="search-input sl'+i+'" placeholder="'+sName+'" title="'+sName+'" /></div>').appendTo (jSearch);
            jTd.width(aColDef[i].finalWidth);
        }

        var jCancel = $('<div class="cancel-column" title="'+$.MyLocale.Buttons.CANCEL+'"><span class="cancel-icon"></span></div>').appendTo(jSearch);

        jCancel.click(function(){
            $(this).parent().hide();
            $(this).parent().next('.slist-head').show();
            $(this).parent().find('input').val("");
            appendRows(_options.data,_jDateView);
        });

        $('.search-column',jTable)
            .show()
            .click(function(){
                $(this).parent().hide();
                $(this).parent().prev('.slist-search').show();
            });
        var oTimer  = false;
        jSearch.on('keyup','.search-input',function(e){
            var jEle = $(this);
            if(oTimer)
            {
                clearTimeout(oTimer);
            }
            oTimer = setTimeout(function(){
                onSearch(jEle);
            },200);

        });
    }

    function createPageBar(opt, jTable)
    {
        if(!opt.pageSize)
        {
            return ;
        }

        var jBar = $('<div class="page-bar"><div class="page-status"><span class="page-num"></span>/<span class="page-total"></span></div></div>');
        var jBtnGroup = $('<ul class="page-btn"></ul>').appendTo(jBar);
        var aBtn = [
            {Name:"First", ClassName: "page-first btn-item"},
            {Name:"Prev", ClassName: "page-prev btn-item"},
            {Name:"Next", ClassName: "page-next btn-item"},
            {Name:"Last", ClassName: "page-last btn-item"}
        ];

        for(var i=0;i<aBtn.length;i++)
        {
            $('<li class="'+aBtn[i].ClassName+'" title="'+aBtn[i].Name+'" val="'+i+'"><i></i></li>').appendTo(jBtnGroup);
        }

        jBtnGroup.on('click', 'li.btn-item', onPageChange);

        $('.page-num',jBar).text("0");
        $('.page-total',jBar).text("0");

        jTable.append(jBar);
    }

    function setupColumnResize(jHead)
    {
        var $headColumns = $('.head-column',jHead);
        var columns = _options.colModel;
        var pageX;

        $headColumns.each(function(n,ele){
            if(!columns[n].resizable)
            {
                return true;
            }
            
            $('<div class="slist-resize-handle"></div>')
                .appendTo(ele)
                .bind("dragstart",function(e){
                    pageX = e.pageX;
                    $headColumns.each(function (i, e) {
                        columns[i].previousWidth = $(e).outerWidth();
                    });
                })
                .bind("drag",function(e){
                    var $this = $(this).parent(), $brother = $this.next();
                    var d = e.pageX-pageX,
                        minWidth = _options.minWidth,
                        thisWidth = columns[n].previousWidth+d, 
                        brotherWidth = columns[n+1].previousWidth-d;

                    if(thisWidth > minWidth && brotherWidth > minWidth)
                    {
                        $this.width(columns[n].previousWidth+d);
                        $brother.width(columns[n+1].previousWidth-d);
                    }
                   
                })
                .bind("dragend",function(e){
                    $headColumns.each(function (i, e) {
                        columns[i].finalWidth = $(e).outerWidth();
                    });
                    resetColumnWidth();
                });
        });
    }

    function createButtons(opt, jTable)
    {
        if(!opt.buttons)
        {
            return ;
        }

        var aButton = mergeButton(getDefButtons(), opt.buttons);
        var jBtnBar = $('<div class="slist-toolbar-top"></div>').appendTo(jTable);

        for(var i=0;i<aButton.length;i++)
        {
            var oMode = aButton[i];
            oMode.value = oMode.value || "";
            var jBtn = $('<a class="slist-button" state="enable" href="#"><i class="btn-icon '+oMode.icon+'"></i><span>'+oMode.value+'</span></a>');
            jBtn.click (onBtnClick)
                .attr("title",oMode.description || oMode.value)
                .data("colDef", oMode)
                .appendTo (jBtnBar);
        }

        jTable.addClass('with-button');
    }

    function appendRows(aData, jTable)
    {
        aData = aData || _options.curData;
        _options.curData = aData;
        jTable.empty();
        var pageNum = _options.pageNum, 
            pageSize = _options.pageSize || aData.length,
            nStar = (pageNum-1)*pageSize,
            nEnd = pageSize*pageNum;

        _options.total = Math.ceil(aData.length/pageSize);
        pageNum  = pageNum > _options.total ? _options.total : pageNum;

        var aTemp = aData.slice(nStar,nEnd);
        for (var i=0; i<aTemp.length; i++)
        {
            var oData = aTemp[i];
            var jTr = addRow (_options, i, oData);
            jTr.appendTo (jTable);
        }

        jTable.on('click.slist','.slist-row',function(){
            var jRow = $(this);
            var bFlag = $('.slist-row.active',_jDateView).length > 1 ;
                !bFlag && (bFlag = !jRow.hasClass('active'));

            $('.slist-row.active input',_jDateView).attr("checked",false);
            $('.slist-row.active',_jDateView).removeClass('active');

            $('input',this).attr("checked",bFlag);
            $('.head-check input',_jTable).attr("checked",false);
            bFlag ? jRow.addClass('active') : jRow.removeClass('active');

            if(_options.onToggle)
            {
                var target = $('.toggle-column .toggle-btn',jRow).get(0);
                target && onToggleChange.call(target);
            }

            onRowChanged.call(this);
        });

        $('.slist-row input',jTable).click(function(e){
            var jRow = $(this).closest('.slist-row');
            jRow.toggleClass('active');
            onRowChanged.call(jRow);
            e && e.stopPropagation && e.stopPropagation();
        });

        var jPageBar = jTable.next();
        $('.page-num',jPageBar).text(pageNum);
        $('.page-total',jPageBar).text(_options.total);
    }

    function addRow(options, nRow, oData) 
    {
        var aColumns = options.colModel;
        var sClass = (nRow % 2 == 0) ? "odd" : "even";
        var jRow = $('<div class="slist-row '+sClass+'" rindex="'+nRow+'"></div>');

        if(_options.multiSelect)
        {
            var jHeadCheck = $('<div class="slist-cell check-column"><input type="checkbox"/></div>').appendTo (jRow);
        }

        for (var i=0; i<aColumns.length; i++)
        {
            var oColDef = aColumns[i];
            addCell (jRow, nRow, i, oData, oColDef);
        }

        if(_options.onToggle)
        {
            var jToggleCol = $('<div class="slist-cell toggle-column"><span class="toggle-btn"></span></div>').appendTo (jRow);
            jToggleCol.on('click','span.toggle-btn',onToggleChange);
        }

        jRow.data("rowData", oData).addClass(sClass);
        return jRow;
    }

    function addCell(jRow, nRow, nCell, oData, oColDef) 
    {
        var jCell = $('<div class="slist-cell sl'+nCell+' sr'+nRow+'"></div>');
        var sVal = oData[oColDef.name];
        var pfFormater = getFormatter (oColDef);
        var sHtml = pfFormater(nRow, nCell, sVal, oColDef, oData, "html");

        if (oColDef.showTip)
        {
            var sTip = pfFormater(nRow, nCell, sVal, oColDef, oData, "text") +"";
            sTip = sTip.replace(/\'/g,'&#39;').replace(/\"/g,'&quot;');
            jCell.attr ("title", sTip);
        }

        jCell.html (sHtml)
             .width(oColDef.finalWidth)
             .appendTo(jRow);
    }

    function onToggleChange(e)
    {
        var jEle = $(this), jToBlock;
        var jRow = jEle.closest('.slist-row');
        if(jEle.hasClass('row-open'))
        {
            jEle.removeClass('row-open');
            jRow.next('.toggle-block').slideUp(200);
        }
        else
        {
            var jScope = _options.onToggle.jScope.removeClass('hide');
            var jListCenter = jEle.closest(".slist-center");
            var jContent = $('.toggle-block',jListCenter);
            if(!jContent.length)
            {
                jContent = $('<div class="form-horizontal toggle-block hide"><div class="tool-bar"><span class="del-icon pull-right" title="'+$.MyLocale.Buttons.DEL+'"></span></div></div>');
            }
            $('.toggle-btn',jListCenter).removeClass('row-open');
            jEle.addClass('row-open');
            
            jContent.append(jScope).insertAfter(jRow).slideDown(200);

            _options.onToggle.action && _options.onToggle.action(jRow.data("rowData"),jToBlock);
        }

        e && e.stopPropagation && e.stopPropagation();
    }

    function onSort(isDesc,sId)
    {
        _options.pageNum = 1;

        var oColMod ,pfCompare
            aData = _options.data;

        for(var i=0;i<_options.colModel.length;i++)
        {
            if(sId == _options.colModel[i].id)
            {
                oColMod = _options.colModel[i];
                break;
            }
        }

        pfCompare = Sorter[oColMod.datatype];

        pfCompare && aData.sort(function comparer(a, b){
            return pfCompare(a, b, oColMod, isDesc);
        });

        appendRows(aData,_jDateView);
    }

    function onSearch(jEle)
    {
        function escapeRegex( value ) 
        {
            return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        }

        var oFiletr = {};
        var aData = _options.data;
        var aMode = _options.colModel;
        var oColMod;
        var aNewData = [];
        var bMatch = true;

        $('.head-search .search-input',_jTable).each(function(){
            var sKey = $(this).attr("sid");
            oFiletr[sKey] = $.trim($(this).val());
        });

        for(var i=0;i<aData.length;i++)
        {
            var oRow = aData[i];
            bMatch = true;
            for(var ii=0;ii<aMode.length;ii++)
            {
                var oColMod = aMode[ii];
                var sCellData = oRow[oColMod.name];

                if(!oFiletr[oColMod.name]) continue;

                if(oColMod.formatter && ("Order"!=oColMod.datatype))
                {
                    sCellData = oColMod.formatter(-1, -1, sCellData, oColMod, oRow, "text");
                }

                bMatch = (new RegExp(escapeRegex(oFiletr[oColMod.name]), "gi")).test(sCellData);
                
                if(!bMatch) break;
            }

            bMatch && aNewData.push(oRow);
        }

        appendRows(aNewData,_jDateView);
    }

    function onRowChanged()
    {
        var jRow = $(this);
        var aData = getSelectRow();
        $('.slist-toolbar-top .slist-button',_jTable).each(function(){
            onStatusChange.call(this,aData);
        });
    }

    function onStatusChange(aData)
    {
        var jBtn = $(this);
        var bEnable = true,nLen = aData.length;
        var oColDef = jBtn.data("colDef");

        if (!oColDef)
        {
            return false;
        }

        var v = oColDef.enable;
        switch($.type(v))
        {
        case "function":
            bEnable = v.apply(this,[aData]);
            break;
        case "array":
            bEnable = (-1 < $.inArray(nLen, v));
            break;
        case "string": // v=">0", "<10"
            bEnable = eval(nLen + "" + v);
            break;
        case "number":
            bEnable = (nLen == v);
            break;
        case "boolean":
            bEnable = v;
            break;
        }

        if(true === bEnable)
        {
            jBtn.attr("disabled", false).removeClass("disabled").attr("state", "enable");
        }
        else
        {
            jBtn.attr("disabled", true).addClass("disabled").attr("state", "disable");
        }
        return bEnable;
    }

    function onPageChange()
    {
        var sType = $(this).attr('val');
        var nNum = _options.pageNum;
        //var jTable = $('table.table', jContainer);
        var jPageBar = $('div.page-bar', _jTable);
        switch(sType)
        {
            case "0":
                _options.pageNum = 1;
            break;
            case "1":
                _options.pageNum --;
            break;
            case "2":
                _options.pageNum ++;
            break;
            case "3":
                _options.pageNum  = _options.total;
            break;
        }
        onChangeColor(_options.pageNum,_options.total,$(this.parentElement));

        if(_options.pageNum < 1 || _options.pageNum > _options.total || nNum == _options.pageNum)
        {
            _options.pageNum  = _options.pageNum < 1 ? 1 : _options.pageNum > _options.total ? _options.total : _options.pageNum;
            return false;
        }
        
        $('.page-num',jPageBar).text(_options.pageNum);
        $('.page-total',jPageBar).text(_options.total);
        appendRows(false, _jDateView);
    }

    function onBtnClick(e)
    {
        var jBtn = $(this);
        var oBtnDef = jBtn.data("colDef");
        if ("enable" == jBtn.attr("state") && oBtnDef.action)
        {
            var aSelectedData = getSelectRow();
           
            oBtnDef.action.call (this, aSelectedData);
        }
        return false;
    }

    function onChangeColor(curentpage,totalpage,that)
    {
        jBtn = that.find(".btn-item");
        jBtn.removeClass("btn-active");
        if(curentpage > 1)
        {
            $(jBtn[0]).addClass("btn-active");
        }
        if(curentpage > 1)
        {
            $(jBtn[1]).addClass("btn-active");
        }
        if(curentpage < totalpage)
        {
            $(jBtn[2]).addClass("btn-active");
        }
        if(curentpage < totalpage)
        {
            $(jBtn[3]).addClass("btn-active");
        }
    }

    function getSelectRow()
    {
        var aRows = [];
        $('.slist-row.active',_jDateView).each(function(index,item){
            aRows.push($(this).data('rowData'));
        });

        return aRows;
    }

    function resetColumnWidth()
    {
        var aColumns = _options.colModel;
        var oColClass = {};

        $('.slist-head .head-column', _jTable).each(function(index,item){
            var nWidth = aColumns[index].finalWidth;
            $(item).width(nWidth);
            oColClass["sl"+index] = nWidth;
        });
        $('.slist-search .head-search', _jTable).each(function(index,item){
            var nWidth = aColumns[index].finalWidth;
            $(item).width(nWidth);
        });

        for(key in oColClass)
        {
            $('.slist-row .'+key, _jDateView).width(oColClass[key]);
        }
    }

    function resize()
    {
    	if(!_jSlist.is(':visible') && _nResizeCount < 10)
    	{
    		_hTimer && clearTimeout(_hTimer);
    		_hTimer = setTimeout(function(){
    			resize();
                _nResizeCount ++;
    		},200);
    		return ;
    	}

        _nResizeCount = 0;
        _hTimer = null;

        var jSearch = $(".slist-search",_jTable).hide();
        jSearch.next('.slist-head').show();
        jSearch.find('input').val("");

        onChangeColor(_options.pageNum,_options.total,_jTable.find(".page-btn"));

    	setColWidth(_options.colModel);
        resetColumnWidth();
    }

    function refresh (aData) 
    {
        var oColMod ,pfCompare, sid;
        oColMod = this.opt.colModel[0];
        if(this.opt.sortable)
        {
            pfCompare = Sorter[oColMod.datatype];
            sid = this.opt.colModel[0].id;
            pfCompare && aData.sort(function comparer(a, b){
                return pfCompare(a, b, sid, false);
            });
        }
        this.opt.data = aData || this.opt.data;
        appendRows (this.opt.data, _jDateView);
        resize();
    }

    this._create = _create;
    this.refresh = refresh;
    this.resize = resize;
    this.opt = _options;
    this.getSelectRow = getSelectRow;
};

var Instance = {
    _create: function()
    {
        var oHandle = this;
        oHandle.oInstance = new Frame.SimpleList(this.element);
        Frame.regNotify(WIDGETNAME, "resize",  function(){
            oHandle.resize();
        });
    },
    destroy:function()
    {
        this.reset();
        this.oInstance._destroy();
        this.oInstance = null;

        $.Widget.prototype.destroy.call(this);
    },
    head: function(oOption)
    {
        return this.oInstance._create(oOption);
    },
    refresh: function(aData)
    {
        this.oInstance.refresh(aData);
    },
    getSelectRow: function ()
    {
        return this.oInstance.getSelectRow ();
    },
    resize: function()
    {
        this.oInstance.resize();
    },
    enable: function(bEable)
    {
        this.oInstance.enable(bEable);
    },
    reset: function()
    {
    }
};

function _init(oFrame)
{
    $(".simple-list", oFrame).SList();
}

function _destroy()
{

}

$.widget("ui.SList", Instance);
Widgets.regWidget(WIDGETNAME, {
    "init": _init, "destroy": _destroy, 
    "widgets": [], 
    "utils":[],
    "libs": ["Libs.slickgrid.editors", "Widgets.MList"]
});

})(jQuery);
