;(function($)
{
var WIDGETNAME = "SList";
var _hTimer = null,_nResizeCount = 0;

var Formatters =
{
    "Order": function (row, cell, value, colDef, dataContext, sType)
    {
        if (value == null || value === "") {
          return $.MyLocale.EMPTY;
        }

        var d = colDef["data"];
        if(!d)
        {
            return Utils.Base.encode(value);
        }

        var aData = Frame.ListString.format(d);
        var sText = Frame.ListString.getTextByValue(aData, value);
        return Utils.Base.encode(sText);
    },
    "Percent": function (row, cell, value, colDef, dataContext)
    {
        if (value == null || value === "")
            return "-";
        if (value < 50) {
            return "<span style='color:red;font-weight:bold;'>" + value + "%</span>";
        }
        return "<span style='color:green'>" + value + "%</span>";
    },
    "Checkbox": function(row, cell, value, colDef, dataContext, type)
    {
        if("text" == type)
        {
            return value;
        }
        return ("true"==value) ? "<i class='icon-ok'></i>" : "";
    },
    "PercentCompleteBar": function (row, cell, value, colDef, dataContext)
    {
        var progressBar,text;
        if (value == null || value === "") {
            return "";
        }

        if('text' === arguments[arguments.length-1]){
            return value + '%';
        }
        // if(value == 0){
        //     text = 'N/A';
        // }else{
        //     text = value + "%";
        // }
        text = 'N/A';
        progressBar = '<div class="progress "' +
                      'style="box-shadow:inset 0 1px 2px rgba(0,0,0,0);margin:10px auto;"' + 
                      '><div class="progress-bar progress-bar-success" style="' + 
                      'color:#80878c;height:100%;' + 
                      'width:' + 0 + '%;">' + text + '</div>'+
                      '</div>';
        return  progressBar;
    },
    "Checkmark": function (row, cell, value, colDef, dataContext)
    {
        return value ? "<span class='ui-icon ui-icon-check'></span>" : "";
    },
    "Operator": function (row, cell, value, colDef, dataContext)
    {
        //var oIcons = colDef.icons;
        //return makeIconsHtml(oIcons);

        var optBtn = "";
        var aBtns = colDef.buttons;
        for(var i=0; i < aBtns.length; i++)
        {
            if( (typeof aBtns[i].enable) == "function")
            {
                aBtns[i].Show = aBtns[i].enable([dataContext]);
            }
            else
            {
                aBtns[i].Show = aBtns[i].enable;
            }
        }

        optBtn += Operators.makeOperBtn(aBtns);

        return optBtn;
    },
    "Default": function (row, cell, value, colDef, dataContext, type)
    {
        var val = "";

        if(value=="0"){
            val = "0";
        }else{
            val =  (value||$.MyLocale.EMPTY);
        }
        if("text" == type)
        {
            return val;
        }

        return Utils.Base.encode(val);
    },
    "Group": function (row, cell, value, colDef, dataContext, type)
    {
        value = value||"";
        if("text" == type)
        {
            return value;
        }

        var sHtml;
        var oAttr = dataContext._attr;
        var nIndent = oAttr["indent"];
        var spacer = "";

        value = value.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
        if (colDef.groupFormatter)
        {
            value = colDef.groupFormatter(row, cell, value, colDef, dataContext, type);
        }

        if(nIndent && (nIndent>0))
        {
            spacer = "<span style='display:inline-block;height:1px;width:" + (15 * nIndent) + "px'></span>";
        }
        if (oAttr.children)
        {
            var aChildren = $.isArray(oAttr.children) ? oAttr.children : oAttr.children[colDef.id];

            var sEmpty = " <span class='toggle empty parent'></span>&nbsp;" + value;
            var sExpand = " <span class='toggle expand' column='"+colDef.id+"'></span>&nbsp;" + value;
            var sCollapse = " <span class='toggle collapse' column='"+colDef.id+"'></span>&nbsp;" + value;

            if ($.type(aChildren)=="object") sHtml = sEmpty;
            else if (0 === aChildren.length) sHtml = sEmpty;
            else if (!oAttr.collapsed)        sHtml = sCollapse;
            else if (oAttr.collapsedNode==colDef.id) sHtml = sExpand;
            else                             sHtml = sExpand;
        }
        else
        {
            sHtml = value;
        }

        return spacer + sHtml;
    }
};

function getFormatter (oColDef)
{
    return (oColDef.formatter || Formatters[oColDef.datatype] || Formatters.Default);
}

var Sorter =
{
    create: function(opt)
    {
    },

    String: function(a, b, oColDef, isDesc)
    {
        var x = a[oColDef.field]||"", y = b[oColDef.field]||"";

        var nFlag = (x == y ? 0 : (x > y? 1 : -1));
        return isDesc ? -nFlag : nFlag;
    },

    Integer: function(a, b, oColDef, isDesc)
    {
        var x = parseInt(a[oColDef.field])||-999, y = parseInt(b[oColDef.field])||-999;

        var nFlag = (x == y ? 0 : (x > y? 1 : -1));
        return isDesc ? -nFlag : nFlag;
    },

    // port, eg: Ethnet2/01, Vlan-Interface3, Loopback10
    Port: function(a, b, oColDef, isDesc)
    {
        var x = a[oColDef.field]||"", y = b[oColDef.field]||"";

        var nFlag = (x == y ? 0 : (x > y? 1 : -1));
        return isDesc ? -nFlag : nFlag;
    },

    // ipv4
    IPv4: function(a, b, oColDef, isDesc)
    {
        var x = Frame.Util.IpStr2Integer(a[oColDef.field]), y = Frame.Util.IpStr2Integer(b[oColDef.field]);

        var nFlag = (x == y ? 0 : (x > y? 1 : -1));
        return isDesc ? -nFlag : nFlag;
    },

    // Ipv6
    IPv6: function(a, b, oColDef, isDesc)
    {
        var x = a[oColDef.field], y = b[oColDef.field];

        var nFlag = (x == y ? 0 : (x > y? 1 : -1));
        return isDesc ? -nFlag : nFlag;
    }
};
var Operators =
{
   oActMap :{},
    onBtnClick: function(jTarget,oRow)
    {
        var type = jTarget.attr("type");
        var action = this.oActMap[type];
        action && action([oRow]);
    },
    makeOperBtn: function(buttons)
    {
        var optButtons = [];
        for(var i=0; i<buttons.length; i++)
        {
            var oBtn = buttons[i];
            var btn = '';
            if(!oBtn.Show)
            {
                continue;
            }
            btn = "<a class='oper-btn' title='"+oBtn.value+"'>" +  "<i class='icon mlist-opt-icon "+oBtn.icon+"' " + "type='"+oBtn.name+"'></i></a>";
            optButtons.push(btn);
        }
        return optButtons.join("");
    },
    mergeButton: function(aSrc,aUser)
    {
        var aNewBtns = [],
            oSupportBtn = {"detail": true, "delete": true, "edit": true,"reboot":true,"download":true,"upgrade":true,"import":true};
        for (var i = 0; i < aUser.length; i++) {
            var oBtn = aUser[i];
            var oTempBtn = null;
            if (oSupportBtn[oBtn.name] && oBtn.enable != false) {
                for (var j = 0; j < aSrc.length; j++) {
                    if (oBtn.name == aSrc[j].name) {
                        oTempBtn = aSrc[j];
                        break;
                    }
                }
                this.oActMap[oBtn.name] = oBtn.action;
                aNewBtns.push($.extend(oTempBtn, oBtn))
            }
        }

        return aNewBtns;
    }
};

Frame.SimpleList = function (_jSlist)
{
    var _options = {
        element: _jSlist,
        data : [],
        curData : [],
        dataCount: 0,
        showHeader : true,
        showOperation:false,
        rowHeight : 43,
        minWidth : 40,
        pageNum : 1,
        pageSize : 0,    // 0 ghost no page
        total: 0,
        asyncPaging: false,
        onPageChange: null,
        /****************************
        function (pageSize,pageNum,oFilter)
        {
            var jList = $(this);
            $.ajax('a.json')
             .done(function(oBack){
                jList.("refresh",{total:oBack.total,data:oBack.data})
             });
        }
        ****************************/
        search : true,
        filter:null,
        onSearch: null,
        /****************************
        function (oFilter,oSorter)
        {
            var jList = $(this);
            $.ajax('a.json')
             .done(function(oBack){
                jList.("refresh",{total:oBack.total,data:oBack.data})
             });
        }
        ****************************/
        multiSelect : false,
        sortable : true,
        sortFilter:null,
        /****************************
        sortFilter:
        {
            name:sName,
            isDesc: Boolean
        }
        ****************************/
        onSort: null,
        /****************************
        function (sName,isDesc)
        {
            var jList = $(this);
            $.ajax('a.json')
             .done(function(oBack){
                jList.("refresh",{total:oBack.total,data:oBack.data})
             });
        }
        ****************************/
        showTip : true,
        onToggle : false,
        /****************************
        onToggle:
        {
            acttion:function(oRowData){},
            jScope:Jquery Element,
            BtnDel:{
                Show:false,
                action:function(oRowData){}
            }
        }
        ****************************/
        columnResize : true,
        onRowSelect:null //function(aSelectData){}
    };
    var _jTable, _jDateView;

    function _create (opt)
    {
        var sBodyID = Frame.Util.generateID("slistbody");
        _jTable = $('<div id="'+sBodyID+'" class="slist-body"></div>').appendTo(_jSlist);
        var aBtn = createDefButtons(opt,_jTable);
        var opercol = {
            id:"slist_operation",
            name:$.MyLocale.MList.operation,
            field:"Operation",
            title:$.MyLocale.MList.operation,
            showTip:false,
            width: 100,
            buttons:aBtn,
            fltFormatter: false,
            briefOrder: 999,
            visible:true,
            formatter: Formatters.Operator
        };
        parseOpt (opt);

        _options.showOperation && _options.colModel.push(opercol);
        setColWidth(_options.colModel);
        _options.showHeader && createHeader (_jTable);
        if(!_options.onToggle)
        {
            createSearch(_options.search, _jTable);
        }
        var sClassName = "";

        _jDateView = $('<div class="slist-center '+sClassName+'"></div>').appendTo(_jTable);
        createPageBar(_options, _jTable);


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
       //setColWidth(_options.colModel);
    }

    function setColWidth(aColDef)
    {
        aColDef = aColDef || [];
        var nSearchColWidth = 25, nCheckboxColWidth = 20 ,nScrollBarWidth = 0;
        var nTotal = _jSlist.width()-nSearchColWidth-nScrollBarWidth-nCheckboxColWidth,
            nCustom = 0, nMin = 0,
            nMinCount = 0 , nTemp = 0;
        var nCol = aColDef.length;

        if(_options.multiSelect)nTotal -= 16;

        for(var i=0;i<nCol;i++)
        {
            var oColMod = aColDef[i];
            if(oColMod.width && oColMod.width >= _options.minWidth)
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

        var jHeadCheck = $('<div class="head-check check-column"></div>').appendTo (jHead);
        if(_options.multiSelect)
        {
            jHeadCheck.append('<span class="check-icon"></span>');
            $('.check-icon',jHeadCheck).on('click',function(){
                
                if($(this).hasClass("checked"))
                {
                    $('.slist-row',_jDateView).removeClass('active');
                    $('.check-icon',jTable).removeClass("checked");
                }
                else
                {
                    $('.slist-row',_jDateView).addClass('active');
                    $('.check-icon',jTable).addClass("checked");
                }
                onRowChanged.call(this);
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
            $('.head-column', jHead).addClass('head-hover').click(function(e){
                if($(e.target).is('.slist-resize-handle'))
                {
                    return false;
                }

                $(this).parent().children().removeClass('head-sort');
                $(this).addClass('head-sort');
                var jSort = $(this).children('span.sort-icon');
                var bFlag = jSort.hasClass('sort-asc');
                var oFilter = {};

                $(this).parent().children().children('.sort-icon').removeClass('sort-desc sort-asc');

                if(bFlag)   //current is asc
                {
                    jSort.addClass('sort-desc');
                }
                else    //current is desc or no sort
                {
                    jSort.addClass('sort-asc');
                }

                oFilter.name = $(this).attr("sid");
                oFilter.isDesc = bFlag;
                if(_options.asyncPaging)
                {
                    _options.filter = null;
                    _options.pageNum = 1;
                    _options.onSort && _options.onSort.call(_options.element,oFilter.name ,bFlag);
                }
                else
                {
                    onSort(bFlag,$(this).attr("sid"));
                }
                _options.sortFilter = oFilter;
            });
        }

        if(_options.columnResize)
        {
            setupColumnResize(jHead);
        }
    }

    function createSearch(bFlag, jTable)
    {
        function makeSelect(oMod,jparent)
        {
            var jSelect = $('<select class="search-select" sid="'+oMod.id+'"></select>').appendTo(jparent);
            var aOptions = [];
            var d = oMod.data || [];
            var aData = Frame.ListString.format(d);

            aOptions.push('<option value="null"></option>');

            for(var i=0;i<aData.length;i++)
            {
                var curItem = aData[i];
                aOptions.push('<option value="'+curItem.value+'">'+curItem.text+'</option>');
            }

            jSelect.append(aOptions.join(''));
            jSelect.select2({
                allowClear: true,
                placeholder: oMod.title,
                placeholderOption: "first"
            });
        }

        var oTimer = false;
        function onSearchFired()
        {
            if(oTimer)
            {
                clearTimeout(oTimer);
            }
            oTimer = setTimeout(onSearch,500);
        }

        if(!bFlag)
        {
            return ;
        }

        var aColDef = _options.colModel;
        var jSearch = $('<div class="slist-search hide"><div class="head-check check-column"></div></div>').insertBefore($('.slist-head', jTable));

        for(var i=0;i<aColDef.length;i++)
        {
            var sName = aColDef[i].title;
            var jTd = $('<div class="head-search"></div>').appendTo(jSearch);

            if(aColDef[i].id == "slist_operation" || aColDef[i].searchHide)
            {
                continue;
            }

            sName.replace(/\'/g,'&apos;').replace(/\'/g,'&quot;');

            if(aColDef[i].datatype == "Order")
            {
                makeSelect(aColDef[i],jTd);
            }
            else
            {
                if(("searcher" in aColDef[i])&&!aColDef[i].searcher){

                }else{
                    jTd.append('<input type="input" sid="'+aColDef[i].id+'" class="search-input sl'+i+'" placeholder="'+sName+'" title="'+sName+'" />');
                }
            }

            jTd.width(aColDef[i].finalWidth);
        }

        var jCancel = $('<div class="cancel-column" title="'+$.MyLocale.Buttons.CANCEL+'"><span class="cancel-icon"></span></div>').appendTo(jSearch);

        jCancel.click(function(){
            $(this).parent().hide();
            $(this).parent().next('.slist-head').show();
            $(this).parent().find('input').val("");

            if(_options.asyncPaging)
            {
                _options.filter = null;
                _options.pageNum = 1;
                _options.onSearch && _options.onSearch.call(_options.element,_options.filter,_options.sortFilter);
            }
            else
            {
                appendRows(_options.data,_jDateView);
            }
        });

        $('.search-column',jTable)
            .show()
            .click(function(){
                $(this).parent().hide();
                $(this).parent().prev('.slist-search').show();
            });

        jSearch.on('keyup','.search-input',onSearchFired);
        jSearch.on('change','.search-select',onSearchFired);
    }

    function createPageBar(opt, jTable)
    {
        if(!opt.pageSize)
        {
            return ;
        }

        var jBar = $('<div class="page-bar"><div class="page-status"><input type="text" class="page-num"/>/<span class="page-total"></span></div></div>');
        var jBtnGroup = $('<ul class="page-btn"></ul>').appendTo(jBar);
        var PageLocal = $.MyLocale.MList.Page;
        var aBtn = [
            {Name:"FIRST", ClassName: "page-first btn-item"},
            {Name:"PREV", ClassName: "page-prev btn-item"},
            {Name:"NEXT", ClassName: "page-next btn-item"},
            {Name:"LAST", ClassName: "page-last btn-item"}
        ];

        for(var i=0;i<aBtn.length;i++)
        {
            $('<li class="'+aBtn[i].ClassName+'" title="'+PageLocal[aBtn[i].Name]+'" val="'+i+'"><i></i></li>').appendTo(jBtnGroup);
        }

        var oTimer = false;
        jBtnGroup.on('click', 'li.btn-item', onPageChange);
        jBar.on('keyup','input.page-num',function(e){
            var sVal = Number(this.value);

            if(oTimer)
            {
                clearTimeout(oTimer);
            }

            if(sVal !== sVal)
            {
                return false;
            }

            oTimer = setTimeout(function(){
                onPageChange(sVal);
            },500);
        });

        $('.page-num',jBar).val("0");
        $('.page-total',jBar).text("0");

        jTable.append(jBar).addClass('with-page');
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

    function createDefButtons(opt, jTable)
    {
        if(!opt.buttons)
        {
            return ;
        }
        var aDefBtn = [
                {id:"slist_reboot",    no:999, name:"reboot",  value:$.MyLocale.Buttons.REBOOT,    enable:false, icon:"slist-reboot", Show:true},
                {id:"slist_download",   no:999, name:"download",    value:$.MyLocale.Buttons.DOWNLOAD, enable:true, icon:"slist-download",   Show:true},
                {id:"slist_detail",    no:999, name:"detail",     value:$.MyLocale.Buttons.DETAIL,      enable:true, icon:"slist-detail",   Show:true},
                {id:"slist_del",    no:999, name:"delete",  value:$.MyLocale.Buttons.BATCHDEL,    enable:">0", icon:"slist-del", Show:true},
                {id:"slist_edit",   no:999, name:"edit",    value:$.MyLocale.Buttons.MDF,         enable:true, icon:"slist-pencil",   Show:true},
                {id:"slist_add",     no:999, name:"add",    value: $.MyLocale.Buttons.ADD,     enable:true, icon:"slist-add", Show:true},
                {id:"slist_refresh",  no:10, name:"search",value: $.MyLocale.Buttons.SEARCH, enable:true,  icon:"slist-search",   Show:true},
                {id:"slist_upgrade",   no:999, name:"upgrade",    value:$.MyLocale.Buttons.UPGRADE, enable:false, icon:"slist-upgrade",   Show:true},
                {id:"slist_import",   no:999, name:"import",    value:$.MyLocale.Buttons.IMPORT, enable:false, icon:"icon-font fa fa-sign-in",   Show:true}
            ];

        var aButton = Operators.mergeButton(aDefBtn, opt.buttons);
        var jBtnBar = $('<div class="slist-toolbar-top"></div>').appendTo(jTable);
        var oSupportBtn = {"detail": true, "delete": true, "edit": true,"reboot":true,"download":true,"upgrade":true,"import":true};
        for(var i=0;i<opt.buttons.length;i++)
        {
            var oMode = opt.buttons[i];
            if (!oSupportBtn[oMode.name] && oMode.enable != false)
            {
                var oTempBtn = {};
                for (var j = 0; j < aDefBtn.length; j++) {
                    if (oMode.name == aDefBtn[j].name) {
                        oTempBtn = aDefBtn[j];
                        break;
                    }
                }

                $.extend(oMode, oTempBtn)
                oMode.value = oMode.value || oMode.name || "";
                if(oMode.mode)
                {
                    oMode.icon = oMode.mode.icons.primary;
                }
                if(oMode.icon)
                {
                    if(oMode.name === "default"){
                        var jBtn = $('<a class="slist-button disabled" state="enable" href="#"><i class="btn-icon ' + oMode.icon + '"></i><span class="text">' + oMode.value + '</span></a>');

                    }else{
                        var jBtn = $('<a class="slist-button" state="enable" href="#"><i class="btn-icon ' + oMode.icon + '"></i><span class="text">' + oMode.value + '</span></a>');
                    }
                }
                else{
                    if(oMode.name === "default"){
                        var jBtn = $('<a class="slist-button disabled" state="enable" href="#"><span class="text">' + oMode.value + '</span></a>');

                    }else{
                        var jBtn = $('<a class="slist-button " state="enable" href="#"><span class="text">' + oMode.value + '</span></a>');
                    }
                      }

                jBtn.click(onBtnClick)
                    .attr("title", oMode.description || oMode.value)
                    .data("colDef", oMode)
                    .appendTo(jBtnBar);

            }
        }

        jTable.addClass('with-button');
        return aButton;
    }

    function appendRows(aData, jTable)
    {
        aData = aData || _options.curData;
        _options.curData = aData;
        jTable.find('.slist-row').remove();
        if(!aData.length)
        {
            $('.page-num').val(1);
            $('.page-total').text(1);
            return false;
        }
        
        var pageNum = _options.pageNum; 
        var pageSize = _options.pageSize || aData.length;
        var nStar, nEnd;

        if(_options.asyncPaging)
        {
            nStar = 0;
            nEnd = pageSize;
            _options.total = Math.ceil(_options.dataCount/pageSize);
            _options.pageNum = pageNum  = pageNum > _options.total ? _options.total : pageNum;
        }
        else
        {
            _options.total = Math.ceil(aData.length/pageSize);
            _options.pageNum = pageNum  = pageNum > _options.total ? _options.total : pageNum;
            nStar = (pageNum-1)*pageSize,
            nEnd = pageSize*pageNum;
        }
        

        var aTemp = aData.slice(nStar,nEnd);
        for (var i=0; i<aTemp.length; i++)
        {
            var oData = aTemp[i];
            var bBlackRegister = false;
            if(oData.isBlackUser == true)
            {
                var bBlackRegister = true;
            }
            var jTr = addRow (_options, i, oData,bBlackRegister);
            jTr.appendTo (jTable);
            if($("input[type=checkbox]",jTr).length > 0)
            {
                var sCheckBoxValue = '';
                $("input[type=checkbox]",jTr).MCheckbox();
                $("input[type=checkbox]",jTr).attr("value") === "true" ? sCheckBoxValue=true : sCheckBoxValue=false;
                $("input[type=checkbox]",jTr).MCheckbox("setState",sCheckBoxValue);
            }
        }

        jTable.off('click.slist').on('click.slist','.slist-row',function(){
            var jRow = $(this);
            var bFlag = $('.slist-row.active',_jDateView).length > 1 ;
                !bFlag && (bFlag = !jRow.hasClass('active'));

            var jTarget = $(arguments[0].target);
            var sClass = jTarget.attr("class") || "";
            if(-1 != sClass.indexOf("mlist-opt-icon"))
            {
                Operators.onBtnClick(jTarget, jRow.data("rowData"));
                arguments[0].stopPropagation();
                return ;
            }

            $('.slist-row.active .check-icon',_jDateView).removeClass("checked");
            $('.slist-row.active',_jDateView).removeClass('active');

            if(bFlag) $('.check-icon',this).addClass("checked");

            $('.head-check .check-icon',_jTable).removeClass("checked");
            bFlag ? jRow.addClass('active') : jRow.removeClass('active');

            if(_options.onToggle)
            {
                var target = $('.toggle-column .toggle-btn',jRow).get(0);
                target && onToggleChange.call(target);
            }

            onRowChanged.call(this);
        });

        $('.slist-row .check-icon',jTable).click(function(e){
            var jRow = $(this).closest('.slist-row');
            jRow.toggleClass('active');
            $(this).toggleClass('checked');
            onRowChanged.call(jRow);
            e && e.stopPropagation && e.stopPropagation();
        });


        var jPageBar = jTable.next();
        $('.page-num',jPageBar).val(pageNum);
        $('.page-total',jPageBar).text(_options.total);
    }

    function addRow(options, nRow, oData, bBlackRegister)
    {
        var aColumns = options.colModel;
        var sClass = (nRow % 2 == 0) ? "odd" : "even";
        var jRow = $('<div class="slist-row '+sClass+'" rindex="'+nRow+'"></div>');

        var jHeadCheck = $('<div class="slist-cell check-column"></div>').appendTo (jRow);
        if(_options.multiSelect)
        {
            jHeadCheck.append('<span class="check-icon hide"></span>');
        }

        for (var i=0; i<aColumns.length; i++)
        {
            var oColDef = aColumns[i];
            addCell (jRow, nRow, i, oData, oColDef, bBlackRegister);

        }

        if(_options.onToggle)
        {
            var jToggleCol = $('<div class="slist-cell toggle-column"><span class="toggle-btn"></span></div>').appendTo (jRow);
            jToggleCol.on('click','span.toggle-btn',onToggleChange);
        }

        jRow.data("rowData", oData).addClass(sClass);
        return jRow;
    }

    function addCell(jRow, nRow, nCell, oData, oColDef, bBlackRegister)
    {
        var jCell = $('<div class="slist-cell sl'+nCell+' sr'+nRow+'"></div>');
        if(nCell == 0 && bBlackRegister == true)
        {
            var jCell = $('<div class="slist-cell black sl'+nCell+' sr'+nRow+'"></div>');
        }
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

        $(".switch",jCell).bind("minput.changed",function(){
            oColDef.action(oData);
        });
    }

    function onToggleChange(e)
    {
        var writeFlag = false;
        var curPermission = Frame.Permission.getCurPermission();
        for (var i = 0; i<curPermission.length; i++)
        {
            if (curPermission[i].split('_')[1] == "WRITE")
            {
                writeFlag = true;
            }
        }

        var addDel = function(opt,container,oData){
            if(!opt || !opt.show || !writeFlag)
            {
                return ;
            }

            var $del = $('.del-icon',container), bShow = opt.show;
            var $toolbar = $('.toggle-tool-bar',container);
            if(!$del.length)
            {
                $del = '<span class="del-icon pull-left" title="'+$.MyLocale.Buttons.DEL+'"></span>';
                $del = $($del).appendTo($toolbar);

            }
            $($del).off().on('click',function(){
                Utils.Msg.deleteConfirm(opt.action)(oData);
            });

            if($.type(bShow) == "function")
            {
                bShow = bShow(oData);
            }
            
            bShow ? $del.show() : $del.hide();
        };

        var init = function(opt){
            var $scope = opt.jScope.removeClass('hide').addClass("toggle-body"),
                $listBody = $button.closest(".slist-center"),
                $container = $('.toggle-block',$listBody);
            var oData = $row.data("rowData");

            if(!$container.length)
            {
                $container = $('<div class="form-horizontal toggle-block hide"><div class="toggle-tool-bar"></div></div>');
            }
            addDel(opt.BtnDel,$container,oData);

            $('.toggle-btn',$listBody).removeClass('row-open');
            $button.addClass('row-open');
            $container.data("rowData",oData);

            if($container.is(':visible'))
            {
                $container.hide(100,function(){
                    $container.append($scope).insertAfter($row).slideDown(200);
                    opt.action && opt.action(oData);
                });
            }
            else
            {
                if (writeFlag == false)
                {
                    $("input", $scope).attr("disabled","disabled");
                    $(".input-label",$scope).unbind();
                }
                $container.append($scope).insertAfter($row).slideDown(200);
                opt.action && opt.action(oData);
            }
        }

        var $button = $(this), $row = $button.closest('.slist-row');

        if($button.hasClass('row-open'))
        {
            $button.removeClass('row-open');
            $row.next('.toggle-block').slideUp(200);
        }
        else
        {
            init(_options.onToggle);
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

        function getFilter()
        {
            var oFiletr = {};
            $('.head-search .search-input',_jTable).each(function(){
                var sKey = $(this).attr("sid");
                var sVlaue = $.trim($(this).val());
                if(sVlaue)
                {
                    oFiletr[sKey] = sVlaue;
                }
            });

            $('.head-search select.search-select',_jTable).each(function(){
                var sKey = $(this).attr("sid");
                var sVlaue = $.trim($(this).val());
                if(sVlaue !== "null")
                {
                    oFiletr[sKey] = sVlaue;
                }
            });

            return oFiletr;
        }

        if(_options.asyncPaging)
        {
            _options.pageNum = 1;
            _options.filter = getFilter();
            _options.onSearch && _options.onSearch.call(_options.element,_options.filter,_options.sortFilter);
            return ;
        }

        var aNewData = [], bMatch = true;
        var aData = _options.data, aMode = _options.colModel;
        var oFiletr = getFilter();

        $('.head-search .search-input',_jTable).each(function(){
            var sKey = $(this).attr("sid");
            oFiletr[$(this).attr("sid")] = $.trim($(this).val());
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

        _options.onRowSelect && _options.onRowSelect(aData);
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

    function getPageNum()
    {
        var sType = $(this).attr('val');
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

        return _options.pageNum;
    }

    function onPageChange(nNum)
    {
        var nOld = _options.pageNum;
        var jPageBar = $('div.page-bar', _jTable);

        if(typeof nNum != "number")
        {
            nNum = getPageNum.call(this);
        }

        _options.pageNum = nNum =nNum < 1 ? 1 : nNum > _options.total ? _options.total : nNum;
        if(nOld ==nNum)
        {
            $('.page-num',jPageBar).val(_options.pageNum);
            return false;
        }

        if(_options.asyncPaging)
        {
            _options.onPageChange && _options.onPageChange.call(_options.element,_options.pageNum,_options.pageSize,_options.filter,_options.sortFilter);
        }
        else
        {
            closeToggle();
            $('.page-num',jPageBar).val(_options.pageNum);
            $('.page-total',jPageBar).text(_options.total);
            _jTable.find('.slist-head .check-icon').removeClass("checked");
            appendRows(false, _jDateView);
        }
    }

    function onBtnClick(e)
    {
        var jBtn = $(this);
        var oBtnDef = jBtn.data("colDef");
        if ("enable" == jBtn.attr("state") && oBtnDef.action)
        {
            var aSelectedData = getSelectRow();
            closeToggle();
            oBtnDef.action.call (this, aSelectedData,oBtnDef.name);
        }
        return false;
    }

    function getSelectRow()
    {
        var aRows = [];
        $('.slist-row.active',_jDateView).each(function(index,item){
            aRows.push($(this).data('rowData'));
        });

        return aRows;
    }

    function getAllData()
    {
        return _options.data;
    }

    function extend(aData)
    {
        if(typeof aData !== "object")
        {
            throw new Error('Paramenter Error');
            return false;
        }

        if(!$.isArray(aData))
        {
            aData = [aData];
        }
        this.opt.data = this.opt.data || [];
        this.opt.data = this.opt.data.concat(aData);
        appendRows (this.opt.data, _jDateView);
        resize();
    }

    function closeToggle()
    {
        _jDateView.find('.slist-row .row-open').removeClass('row-open');
        _jDateView.find('.toggle-block').hide();
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

    function resize(isManual)
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

        if(isManual && 0 )
        {
            var jSearch = $(".slist-search",_jTable).hide();
            jSearch.next('.slist-head').show();
            jSearch.find('input').val("");
            _options.filter = null;
            _options.onSearch && _options.onSearch.call(_options.element,_options.filter,_options.sortFilter);
        }

        setColWidth(_options.colModel);
        resetColumnWidth();
    }

    function refresh (aData) 
    {
        if(this.opt.asyncPaging && $.isPlainObject(aData))
        {
            /*************************************
            aData = {
                total: Number,
                pageNum: Number,
                data: Array
            };
            *************************************/
            this.opt.dataCount = aData.total;
            this.opt.pageNum = aData.pageNum || this.opt.pageNum;
            this.opt.data = aData.data || this.opt.data;
        }
        else
        {
            this.opt.data = aData || this.opt.data;
        }

        /*====cancel sort first col===*/
       /* var oColMod ,pfCompare, sid;
        oColMod = this.opt.colModel[0];
        pfCompare = Sorter[oColMod.datatype];
        sid = this.opt.colModel[0].id;
        pfCompare && this.opt.data.sort(function comparer(a, b){
            return pfCompare(a, b, sid, false);
        });*/

        appendRows (this.opt.data, _jDateView);
        $('.head-check .check-icon',_jTable).removeClass("checked");
        onRowChanged();
        resize();
    }
  /*  function refresh (aData)
    {

        this.opt.data = aData || this.opt.data;
        appendRows (this.opt.data, _jDateView);
        resize();
    }*/
    this._create = _create;
    this.refresh = refresh;
    this.extend = extend;
    this.resize = resize;
    this.opt = _options;
    this.getSelectRow = getSelectRow;
    this.getAllData = getAllData;
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
    extend: function(aData)
    {
        this.oInstance.extend(aData);
    },
    getSelectRow: function ()
    {
        return this.oInstance.getSelectRow ();
    },
    getAll: function()
    {
        return this.oInstance.getAllData ();
    },
    resize: function()
    {
        this.oInstance.resize(true);
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
    "init": _init, 
    "destroy": _destroy, 
    "widgets": ["Minput"],
    "utils":[],
    "libs": ["Libs.Select2.Select2"]
});

})(jQuery);