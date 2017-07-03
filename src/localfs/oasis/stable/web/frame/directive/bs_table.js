define(['jquery', 'angularAMD', 'frame/directive/lang/bs_table', 'utils',
        'bootstrapTable', 'select2', 'bootstrap-daterangepicker', 'css!bootstrap_daterangepicker_css',
        'bootstrapDatepicker', 'rangepicker'],
    function ($, app, bsTableLang, utils) {
        if (!$ || !$.fn || !$.fn.bootstrapTable) {
            console.warn('bootstrapTable组件还没有初始化!');
            return;
        }
        // 表格默认值
        app.constant('bsTableDef', $.extend(true, {}, $.fn.bootstrapTable.defaults, {
            tId: null, //  唯一标示table，页面有多个表格可以使用事件和方法的隔离
            showCheckBox: false,  //  显示表头的复选框
            showRowNumber: false,  //  显示行号
            showPageList: true,  //  显示分页大小切换
            pagination: true,   //  显示分页
            paginationLoop: false,   //  禁止分页循环
            showToolbar: false,  //  显示工具条
            paginationPreText: '&lsaquo;',  //    分页条上一页显示的文本
            paginationNextText: '&rsaquo;',  //   分页条下一页显示的文本
            paginationFirstText: '&laquo;',    //   第一页显示的文本  默认是两个小于号
            paginationLastText: '&raquo;',   //  最后一页显示的文本  默认是两个大于号
            paginationSize: 'normal',  //  分页条显示大小，normal正常样式，sm是只显示上一页下一页第一页最后一页
            clickToSelect: true,  //   点击行选中
            undefinedText: '',  //  数据是undefined显示''
            searchable: false,  //  是否支持搜索功能
            striped: true,   //  显示斑马线效果
            cache: false,  //  是否缓存数据
            pageList: [10, 20, 50, 100],
            apiVersion: 'v2',  //  适配原来的v3接口，默认是v2，v3会有以下默认值，例如：分页参数路径化
            operateWidth: 240,  //  操作列宽度
            operate: false,  //  是否显示操作，是一个对象
            lang: utils.getLang(), // 语言配置  目前只支持en和cn
            extraCls: '', //  扩展类 ，直接加在最外层的容器上，为了适应单个需求和表格的个性化
            // refreshUnCheck: true, //  刷新后清空选择
            icons: {  //  操作列对应的图标，见名知意
                reboot: 'fa fa-refresh',
                download: 'fa fa-download',
                detail: 'fa fa-mydetail',  //completed
                remove: 'fa fa-del',       //completed
                edit: 'fa fa-myedit',      //completed
                add: 'fa fa-plus',
                search: 'fa fa-search',
                upgrade: 'fa fa-upload',
                imports: 'fa fa-sign-in',
                custom: 'fa fa-cab',
                detailOpen: 'glyphicon-chevron-down',  //  展开详情图标
                detailClose: 'glyphicon-chevron-up'   //  折叠详情图标
            },
            pageListChange: {
                pageNumber: 'auto'
            }
        })).directive('bsTable', ['bsTableDef', '$alertService', function (def, $alert) {
            var _picker = {
                option: {
                    locale: bsTableLang[utils.getLang()]['daterangepicker'],
                    autoUpdateInput: false
                },
                eventHandle: function (ev, picker) {
                    var $this = $(this),
                        v = picker.startDate.format(picker.locale.format) + picker.locale.separator + picker.endDate.format(picker.locale.format);
                    var _old = $this.val();
                    if (picker.singleDatePicker) {
                        v = picker.startDate.format('YYYY-MM-DD');
                    }
                    $this.val(v);
                    return {old: _old, now: v};
                },
                editor: 'daterangepicker'
            };
            var _searcherDef = {
                date: $.extend(true, {
                    option: {
                        singleDatePicker: true,
                        format: 'yyyy-mm-dd'
                    },
                    event: 'hide.daterangepicker'
                }, _picker),
                daterange: $.extend(true, {
                    event: 'apply.daterangepicker'
                }, _picker),
                numberange: {
                    option: $.extend(true, {}, bsTableLang[utils.getLang()]['rangepicker']),
                    event: 'okclick.range',
                    editor: 'rangepicker'
                }
            };

            def = $.extend(true, {}, def, bsTableLang[utils.getLang()]['table']);

            /**
             *
             * @param tpl 模板   {field}  会替换为row[field]的值
             * @param row
             * @description 渲染文本，可以作为字符串的拼接。可以作为link和显示的格式化
             * @example
             *
             * ```
             *  var tpl = 'my name is {name}, I\'m {age} years old.';
             *  var row = {name:'zhangsan',age:26};
             *  render(tpl,row) == 'my name is zhangsan, I\'m 26 years old.'
             * ```
             */
            function render(tpl, row) {
                var vars = tpl.match(/{[a-zA-Z0-9]*}/g);
                if (!vars || !vars.length) {
                    return tpl;
                }
                vars = $.map(vars, function (v) {
                    return v.replace(/{|}/g, '').trim();
                });
                $.each(vars, function () {
                    var v = this;
                    var rv = row[v] || '';
                    var reg = new RegExp('{' + v + '}', 'g');
                    tpl = tpl.replace(reg, rv);
                });

                return tpl;
            }

            /**
             *
             * @param $ele  表格dom元素
             * @param options   表格配置参数
             * @description 创建表格
             */
            function createTable($ele, options) {

                var _searcher = {};

                $ele.on('searcher-change.bs.table', function (e) {
                    //  服务器搜索延迟1秒请求
                    if (opts.sidePagination == 'server') {
                        //  输入结束1s中请求一次后台
                        clearTimeout($ele._searchTimeOut);
                        $ele._searchTimeOut = setTimeout(function () {
                            search();
                        }, 1000);
                    } else {
                        // 本地立即搜索
                        search();
                    }

                    // 修改查询条件后，查询第一页数据
                    function search() {
                        var $searcher = $ele.$searcher;
                        var bsOptions = $ele.bootstrapTable('getOptions');
                        var searchText = bsOptions.searchText;
                        var showToolbar = bsOptions.showToolbar;

                        if (showToolbar) {
                            // 判断分页类型
                            if (bsOptions.sidePagination == 'server') {
                                //  服务器搜索
                                $ele.bootstrapTable('getOptions').pageNumber = 1;
                                $ele.bootstrapTable('refresh');
                            } else {
                                var allData = $ele.data('allData');
                                var grepData = [];
                                if (allData && allData.length) {
                                    grepData = $.grep(allData, function (d) {
                                        var exist = false;
                                        $.each(d, function (k, f) {
                                            if (String(f).toUpperCase().indexOf(searchText.toUpperCase()) != -1) {
                                                exist = true;
                                                return false;
                                            }
                                        });
                                        return exist;
                                    });
                                }
                                $ele.bootstrapTable('load', {type: 'search', data: grepData});
                            }
                        } else {
                            var params = {};
                            $searcher.find('input,select').each(function () {
                                if ($(this).data('range')) {
                                    params[$(this).attr('search-field')] = $(this).data('range');
                                } else if ($(this).val() || ($(this).val() + '') === '0') {
                                    params[$(this).attr('search-field')] = $(this).val();
                                }
                            });
                            // 判断分页类型
                            if (opts.sidePagination == 'server') {
                                //  服务器搜索
                                $ele.bootstrapTable('getOptions').pageNumber = 1;
                                $ele.bootstrapTable('refresh');
                                $ele.trigger('search-server.bs.table', params);
                            } else {
                                var data = $ele.data('allData');
                                var newData = [];
                                if (data && data.length) {
                                    newData = $.grep(data, function (d) {
                                        var exist = true;
                                        $.each(params, function (k, v) {
                                            d[k] = d[k] == undefined ? '' : d[k];
                                            // 如果是下拉框，全值匹配，文本框模糊匹配
                                            if ($ele.$searcher.find('[search-field=' + k + ']').is('select')) {
                                                if ((d[k] + '').toUpperCase() != (v + '').toUpperCase()) {
                                                    exist = false;
                                                }
                                            } else if ($ele.$searcher.find('[search-field=' + k + ']').is('[search-role="numberange"]')) {
                                                // 包含开始不包含结束
                                                var _val = isNaN(d[k]) ? 0 : Number(d[k]);
                                                if (v.start != null && v.end != null && (_val < v.start || _val >= v.end)) {
                                                    exist = false;
                                                } else if (v.start != null && _val < v.start) {
                                                    exist = false;
                                                } else if (v.end != null && _val >= v.end) {
                                                    exist = false;
                                                }
                                            } else {
                                                if ((d[k] + '').toUpperCase().indexOf((v + '').toUpperCase()) == -1) {
                                                    exist = false;
                                                }
                                            }
                                        });
                                        return exist;
                                    });
                                }
                                $ele.bootstrapTable('load', {type: 'search', data: newData});
                                $ele.trigger('search-local.bs.table', params);
                            }
                        }
                    }
                });

                // v3默认值
                if (options.apiVersion === 'v3' && !options.pageParamsType) {
                    options.pageParamsType = 'path';
                }
                if (options.apiVersion === 'v3' && !options.startField && !options.limitField) {
                    options.startField = 'skipnum';
                    options.limitField = 'limitnum';
                }

                if (options.showToolbar) {
                    options.searchable = false;
                }
                // concat a configurations
                var opts = $.extend(true, {}, def, options);

                if (opts.tId && /^[0-9]/.test(opts.tId)) {
                    console.warn('tId不建议使用数字。');
                }

                /**
                 * 遍历渲染列数据模板
                 * render  基本渲染
                 * link    链接渲染
                 * linkNewPage   新标签页面打开渲染链接，link存在生效
                 */
                $.each(opts.columns, function () {
                    var cm = this;

                    function filterSpace(input) {
                        input = input == undefined ? '' : input + '';
                        return input.replace(/ /g, '&nbsp;')
                    }

                    if (cm.render && typeof cm.render == 'string') {
                        cm.formatter = function (val, row) {
                            return render(cm.render, row);
                        }
                    }
                    if (cm.link == true) {
                        cm.clickToSelect = false;
                        cm.formatter = function (val, row) {
                            var text = (cm.render && typeof cm.render == 'string') ? render(cm.render, row) : val;
                            text = text || '';
                            return '<a style="cursor: pointer;text-decoration: none">' + filterSpace(text) + '</a>'
                        };
                    } else if (typeof cm.link == 'string') {
                        cm.clickToSelect = false;
                        this.formatter = function (val, row) {
                            var text = (cm.render && typeof cm.render == 'string') ? render(cm.render, row) : val;
                            text = text || '';
                            return '<a ' + (cm.linkNewPage ? ' target="_blank" ' : '') + ' href="' + render(cm.link, row) + '" style="cursor: pointer;text-decoration: none">' + filterSpace(text) + '</a>'
                        };
                    }

                    var _formatter = cm.formatter;
                    if (!_formatter) {
                        cm.formatter = filterSpace;
                    }
                });
                // 显示行号和checkbox
                if (opts.showRowNumber) {
                    opts.columns = [{
                        width: 36,
                        align: 'center',
                        field: 'bs-rownumber',
                        formatter: function (val, row, index) {
                            return '<span>' + ((opts.pageNumber - 1) * opts.pageSize + (index + 1)) + '</span>'
                        }
                    }].concat(opts.columns);
                }

                // 多选
                if (opts.showCheckBox && !opts.singleSelect) {
                    opts.columns = [{
                        checkbox: true//,
                        // field: 'bs-checkbox'
                    }].concat(opts.columns);
                } else if (opts.singleSelect) {
                    // 单选不显示多选框
                    opts.columns = [{
                        checkbox: true,
                        // field: 'bs-checkbox',
                        class: opts.showCheckBox ? '' : 'hidden'  //  是否显示多选框checkbox
                    }].concat(opts.columns);
                }

                if (opts.showToolbar) {
                    opts.showPageList = false;
                    var toolbar = [];
                    toolbar.push(
                        '<div style="height:34px;line-height:30px;margin-bottom: 10px">',
                        '<div class="pull-left col-xs-6">',
                        opts.pageListLabelPrefix + ' <select style="width: 80px;" select2>'
                    );

                    $.each(opts.pageList, function () {
                        toolbar.push('<option value="', this, '">', this, '</option>');
                    });

                    toolbar.push(
                        '</select> ' + opts.pageListLabelSuffix,
                        '</div>',
                        '<div class="pull-right col-xs-4">',
                        '<div class="col-xs-4 text-right">' + opts.searchLabel + '：</div>',
                        '<div class="col-xs-8"><input type="text"></div>',
                        '</div>',
                        '</div>'
                    );
                    $ele.toolbar = $(toolbar.join(''));
                    $ele.toolbar.find('[select2]').val(opts.pageSize).off('change').on('change', function () {
                        var bsOpts = $ele.bootstrapTable('getOptions');
                        bsOpts.pageSize = $(this).val();

                        if (bsOpts.sidePagination == 'server') {
                            $ele.bootstrapTable('refresh');
                        } else {
                            var currData = $ele.bootstrapTable('getData');
                            $ele.bootstrapTable('load', currData);
                        }
                    })/*.select2({allowClear: false, minimumResultsForSearch: -1})*/;

                    //searcher-change.bs.table
                    $ele.toolbar.find('input').off('keyup').on('keyup', function () {
                        $ele.bootstrapTable('getOptions').searchText = $(this).val();
                        $ele.trigger('searcher-change.bs.table');
                    });
                    $ele.before($ele.toolbar);
                }

                // 显示操作列
                if (opts.operate && typeof opts.operate === 'object') {

                    var operaColumn = {
                        clickToSelect: false,
                        field: +new Date(),
                        width: opts.operateWidth,
                        title: opts.operateTitle
                    };

                    operaColumn.formatter = function (val, row) {
                        var operaHtml = ['<div>'];
                        $.each(opts.operate, function (k, v) {
                            if ($.isFunction(v) && v !== $.noop) {
                                operaHtml.push('<button role="opera_', k, '" class="table_opera list-link" title="', opts.tips[k], '" >',
                                    '<i class="', opts.icons[k], '"></i>',
                                    '</button>');
                            } else if (typeof v === 'object') {
                                // 如果没有配置就是true
                                var enable = v.enable || true;
                                if ($.isFunction(enable)) {
                                    enable = enable(val, row);
                                }
                                if (v.click && v.click != $.noop) {
                                    operaHtml.push('<button role="opera_', k, '" class="table_opera  list-link" title="', opts.tips[k], '" ', enable ? '' : 'disabled="disabled"', '>',
                                        '<i class="', opts.icons[k], '"></i>',
                                        '</button>');
                                }
                            }
                        });
                        operaHtml.push('</div>');
                        return operaHtml.join('');
                    };
                    opts.columns.push(operaColumn);
                    /**
                     * 操作列的配置，jquery事件代理模式
                     *
                     */
                    $ele.delegate('button[role^=opera_]', 'click', function (e) {
                        var actionName = $(this).attr('role').replace('opera_', '');
                        var index = $(this).parents('tr').attr('data-index');
                        // 获取数据
                        var data = $ele.bootstrapTable('getData')[Number(index)];
                        // 执行操作
                        if ($.isFunction(opts.operate[actionName])) {
                            opts.operate[actionName].call(this, e, data, $(this));
                        } else if (opts.operate[actionName] && opts.operate[actionName].click && $.isFunction(opts.operate[actionName].click)) {
                            opts.operate[actionName].click.call(this, e, data, $(this));
                        }
                    });
                }


                // 如果detailView为true
                if (opts.detailView) {
                    // 点击行展开详情
                    $ele.on('expand-row.bs.table', function (e, index, row, $detail) {
                        $ele.find('tbody>tr[data-index!=' + index + ']').each(function () {
                            $ele.bootstrapTable('collapseRow', Number($(this).attr('data-index')));
                        });
                        $ele.find('tbody>tr[data-index=' + index + ']').data('expand', true);
                        $ele.trigger('expanded-row.bs.table', {index: index, row: row, el: $detail});
                    }).on('collapse-row.bs.table', function (e, index, row, $detail) {
                        $ele.find('tbody>tr[data-index=' + index + ']').data('expand', false);
                        $ele.trigger('collapsed-row.bs.table', {index: index, row: row, el: $detail});
                    });
                }

                // 显示搜索头部信息
                if (opts.searchable) {
                    opts.columns.push({
                        width: 20,
                        align: 'center',
                        field: 'bs-search',
                        title: '<i class="glyphicon glyphicon-search"></i>'
                    });

                    var extraFn = {
                        getTable: function () {
                            return $ele.data('bootstrap.table');
                        },
                        showSearcher: function () {
                            var $container = extraFn.getTable().$tableContainer;
                            var $thead = $container.find('thead>tr');
                            var $search = $thead.next();
                            var columns = extraFn.getTable().columns;
                            $.each(columns, function (i, c) {
                                $thead.find('[search-field="' + c.field + '"]').parents('th')[c.visible ? 'show' : 'hide']();
                            });
                            $thead.find('th').each(function (i) {
                                var $th = $(this);
                                if ($th.attr('style')) {
                                    $search.find('th').eq(i).attr('style', $th.attr('style'));
                                } else {
                                    $search.find('th').eq(i).width($th.width() - 16);
                                }
                            });
                            $thead.hide().next().show();
                            // 触发查询事件
                            $ele.trigger('searcher-show.bs.table')
                        },
                        /**
                         * 隐藏搜索表头
                         * @param autoLoad 是否重新加载数据
                         */
                        hideSearcher: function (autoLoad) {
                            var $container = extraFn.getTable().$tableContainer;
                            var $searcher = $container.find('thead>tr').next();
                            autoLoad = autoLoad != undefined ? autoLoad : true;
                            if ($searcher.attr('style') != 'display: none;') { //  如果搜索表头在显示状态
                                $searcher.hide().prev().show();  //  隐藏
                                if (autoLoad) {
                                    // 触发查询事件
                                    $ele.trigger('searcher-hide.bs.table');
                                }
                            }
                        }
                    };

                    $ele.data('extraFn', extraFn);

                    function initSearcher(table) {
                        // 查询支持
                        var $container = table.$tableContainer;
                        var $thead = $container.find('thead');  //  获取第一个表头
                        if ($thead.find('tr.header-search').length) {  //  已经渲染了搜索直接返回
                            return;
                        }
                        opts = table.options;
                        var tr = ['<tr class="header-search" style="display: none">'];
                        $.each(opts.columns[0], function (i, cln) {
                            if (!cln.visible) {
                                return;
                            }
                            // tr.push('<th>');
                            if (opts.singleSelect && !opts.showCheckBox && cln.checkbox) {  //  如果是单选并且不显示checkbox渲染空列
                                tr.push('<th class="hidden">');
                            } else {
                                tr.push('<th>');
                            }
                            if (cln.field === 'bs-search') {
                                tr.push('<i class="glyphicon glyphicon-remove searcher-hide"></i>');
                            } else if (cln.searcher) {
                                var types = ['text', 'number'];
                                _searcher[cln.field] = cln.searcher.option || null;  //   缓存查询组件的配置
                                cln.searcher.type = cln.searcher.type || 'text';
                                if (types.indexOf(cln.searcher.type) != -1) {
                                    tr.push('<input search-field="', cln.field, '" type="', cln.searcher.type, '" placeholder="', cln.title, '">');
                                } else if (cln.searcher.type == 'select') {
                                    tr.push('<select style="width:100%" search-field="', cln.field, '" placeholder="', cln.title, '">');
                                    // 数据处理
                                    cln.searcher.valueField = cln.searcher.valueField || 'value';
                                    cln.searcher.textField = cln.searcher.textField || 'text';
                                    tr.push('<option value="">请选择</option>');
                                    if ($.isArray(cln.searcher.data)) {
                                        $.each(cln.searcher.data, function () {
                                            tr.push('<option value="', this[cln.searcher.valueField], '">', this[cln.searcher.textField], '</option>');
                                        });
                                    } else if ($.isFunction(cln.searcher.data)) {
                                        var data = cln.searcher.data();
                                        if ($.isArray(data)) {
                                            $.each(data, function () {
                                                tr.push('<option value="', this[cln.searcher.valueField], '">', this[cln.searcher.textField], '</option>');
                                            });
                                        } else if ($.isFunction(data.then)) {
                                            data.then(function (d) {
                                                var $select = $ele.$searcher.find('select[search-field="' + cln.field + '"]');
                                                $.each(d, function () {
                                                    $(['<option value="',
                                                        this[cln.searcher.valueField],
                                                        '">',
                                                        this[cln.searcher.textField],
                                                        '</option>'].join('')).appendTo($select);
                                                });
                                            });
                                        }
                                    }
                                    tr.push('</select>');
                                } else if (cln.searcher.type == 'daterange' || cln.searcher.type == 'date' || cln.searcher.type == 'numberange') {  //  时间范围的处理
                                    tr.push('<input readonly search-role="', cln.searcher.type, '" search-field="', cln.field, '" type="text" placeholder="', cln.title, '">');
                                }
                            } else {
                                tr.push('<div class="search-plain">', cln.title, '</div>');
                            }
                            tr.push('</th>');
                        });
                        if (opts.detailView) {
                            tr.push('<th></th>');
                        }
                        tr.push('</tr>');
                        $(tr.join('')).appendTo($thead);

                        $ele.$searcher = $container.find('.header-search');
                        $ele.$searcher.find('select').each(function () {
                            $(this).select2({
                                allowClear: true,
                                placeholder: $(this).attr('placeholder'),
                                minimumResultsForSearch: -1
                            });
                        });
                        // 绑定编辑器
                        var _selector = [];
                        $.each(_searcherDef, function (k, v) {
                            _selector.push('[search-role="' + k + '"]');
                        });
                        // 查询匹配的编辑器
                        $ele.$searcher.find(_selector.join(',')).each(function () {
                            var _this = $(this),
                                _role = _this.attr('search-role'),
                                _field = _this.attr('search-field'),
                                _option = _searcher[_field] || {},
                                _def = _searcherDef[_role];
                            _this.off(_def.event).on(_def.event, function () {
                                if (_def.eventHandle) {
                                    var _val = _def.eventHandle.apply(this, arguments);
                                    if (_val.now != _val.old) {
                                        $ele.trigger('searcher-change.bs.table', [_field, _val.now]);
                                    }
                                } else {
                                    $ele.trigger('searcher-change.bs.table', [_field]);
                                }
                            })[_def.editor]($.extend(true, {}, _def.option || {}, _option));
                        });

                        /**
                         * 表头搜索处理，自动查询
                         */
                        $container.undelegate('[data-field="bs-search"] i', 'click')
                            .delegate('[data-field="bs-search"] i', 'click', extraFn.showSearcher)
                            .undelegate('i.searcher-hide', 'click')
                            .delegate('i.searcher-hide', 'click', extraFn.hideSearcher)
                            .undelegate('.header-search select', 'change')
                            .delegate('.header-search select', 'change', function (e) {
                                var $target = $(e.target);
                                $ele.trigger('searcher-change.bs.table', [$target.attr('search-field'), $target.val()]);
                            })
                            .undelegate('.header-search input', 'keyup')
                            .delegate('.header-search input', 'keyup', function (e) {
                                var $target = $(e.target);
                                $ele.trigger('searcher-change.bs.table', [$target.attr('search-field'), $target.val()]);
                            });
                    }

                    $ele.on('post-body.bs.table', function (e, table) {
                        initSearcher(table);
                    }).on('searcher-hide.bs.table', function (e) {
                        $ele.$searcher.find('input').val('');
                        $ele.$searcher.find('select').select2('val', Infinity);   //  清空数据
                        $ele.trigger('searcher-change.bs.table');
                    });
                }

                $ele
                    .on('loading.bs.table', function (e, tableObj) { //  不显示无数据
                        tableObj.$tableContainer.find('.no-records-found').find('div').css('visibility', 'hidden');
                    })
                    .on('loaded.bs.table', function (e, tableObj) {  //  显示无数据
                        tableObj.$tableContainer.find('.no-records-found').find('div').css('visibility', tableObj.data.length ? 'hidden' : 'visible');
                    })
                    .on('page-change.bs.table', function () {
                        $(window).trigger('resize');
                    })
                    .on('load-success.bs.table', function (e, data) {
                        //如果当前页没有数据，直接查询上一页
                        var table = $ele.data('bootstrap.table');
                        var options = table.options;
                        var dataField = options.dataField;
                        var totalField = options.totalField;
                        var totalRows = data[totalField], dataArray = data[dataField];

                        if (totalField.split('.').length == 2) {
                            var ss = totalField.split('.');
                            if (data[ss[0]] && data[ss[0]][ss[1]]) {
                                totalRows = data[ss[0]][ss[1]];
                            } else {
                                totalRows = 0;
                            }
                        }
                        if (dataField.split('.').length == 2) {
                            var ss2 = dataField.split('.');
                            if (data[ss2[0]] && data[ss2[0]][ss2[1]]) {
                                dataArray = data[ss2[0]][ss2[1]];
                            } else {
                                dataArray = [];
                            }
                        }

                        dataArray && !dataArray.length && totalRows && options.pageNumber > 0 && table.refresh({pageNumber: options.pageNumber});
                        $(window).trigger('resize');
                        // if (options.refreshUnCheck) {
                        //     // 如果有选择的数据 ，刷新后取消所有的选择
                        //     // $ele.bootstrapTable('uncheckAll');  //  取消选择
                        //     // var arr = $ele.bootstrapTable('getSelections');
                        //     // $.each(arr, function (i, a) {
                        //     //     $ele.bootstrapTable('uncheck');
                        //     // });
                        // }
                    })
                    .on('column-switch.bs.table', function (e, field, show) {
                        initSearcher($ele.data('bootstrap.table'));
                    });

                // 如果表格存在，直接刷新options
                return !!$ele.data('bootstrap.table') ? $ele.bootstrapTable('refreshOptions', opts) : $ele.bootstrapTable(opts);
            }

            /**
             * @param $ele
             * @param scope
             * @param tId
             * @description  表格的事件监听
             * @example
             * ```
             *      $scope.$on('click-row.bs.table',function(){
             *          // code
             *      });
             * ```
             */
            function listenEvent($ele, scope, tId) {
                var events = ['all.bs.table', 'click-row.bs.table',
                    'dbl-click-row.bs.table', 'click-cell.bs.table',
                    'dbl-click-cell.bs.table', 'sort.bs.table',
                    'check.bs.table', 'uncheck.bs.table',
                    'check-all.bs.table', 'uncheck-all.bs.table',
                    'check-some.bs.table', 'uncheck-some.bs.table',
                    'load-success.bs.table', 'load-error.bs.table',
                    'column-switch.bs.table', 'column-search.bs.table',
                    'page-change.bs.table', 'search.bs.table',
                    'toggle.bs.table', 'pre-body.bs.table',
                    'post-body.bs.table', 'post-header.bs.table',
                    'expand-row.bs.table', 'collapse-row.bs.table',
                    'expanded-row.bs.table', 'collapsed-row.bs.table',
                    'searcher-change.bs.table', 'searcher-hide.bs.table',
                    'searcher-show.bs.table', 'refresh-options.bs.table',
                    'refresh.bs.table', 'search-local.bs.table',
                    'search-server.bs.table'];

                $.each(events, function () {
                    var self = this.toString();
                    var e = tId ? self + '#' + tId : self;
                    $ele.off(self).on(self, function () {
                        var args = Array.prototype.slice.call(arguments, 1);
                        scope.$emit.apply(scope, [e.toString()].concat(args).concat(arguments[0]));
                    });
                });
            }

            /**
             *
             * @param $ele
             * @param scope
             * @param tId
             * @description 方法处理
             * @example
             * ```
             *      $scope.$broadcast('load',[data]);
             *      $scope.$broadcast('getSelections',function(data){
             *          //  code
             *      });
             * ```
             */
            function bindEvent($ele, scope, tId) {
                var events = ['getOptions', 'getSelections',
                    'getAllSelections', 'getData', 'getRowByUniqueId',
                    'getRowsHidden', 'getHiddenColumns', 'getVisibleColumns',
                    'getScrollPosition', 'collapseAllRows', 'expandAllRows',
                    'collapseRow', 'expandRow', 'toggleView',
                    'togglePagination', 'nextPage', 'prevPage',
                    'selectPage', 'filterBy', 'scrollTo',
                    'hideColumn', 'showColumn', 'resetWidth',
                    'resetView', 'uncheckBy', 'checkBy',
                    'uncheck', 'check', 'uncheckAll', 'load',
                    'checkAll', 'hideLoading', 'showLoading',
                    'resetSearch', 'refresh', 'updateCell',
                    'mergeCells', 'hideRow', 'showRow',
                    'updateRow', 'insertRow', 'removeByUniqueId',
                    'removeAll', 'remove', 'prepend', 'refreshOptions',
                    'append', 'hideAllColumns', 'showAllColumns'];

                $.each(events, function () {
                    var self = this.toString();
                    var e = tId ? self + '#' + tId : self;
                    scope.$on(e.toString(), function (e, p, call) {
                        if (arguments.length == 2 && p instanceof Function) {
                            p.call($ele, $ele.bootstrapTable(self));
                        } else if (arguments.length == 3) {
                            call.call($ele, $ele.bootstrapTable(self, p));
                        } else {
                            $ele.bootstrapTable(self, p);
                        }
                    });
                });
                // 自定义方法，显示或隐藏搜索框
                scope.$on(tId ? 'showSearcher#' + tId : 'showSearcher', function (e) {
                    $ele.data('extraFn').showSearcher();
                });
                scope.$on(tId ? 'hideSearcher#' + tId : 'hideSearcher', function (e, autoLoad) {
                    $ele.data('extraFn').hideSearcher(autoLoad);
                });
            }

            return {
                restrict: 'EA',
                scope: {
                    options: '=bsTable'
                },
                template: '<table></table>',
                replace: true,
                link: function ($scope, $ele) {
                    if (!($ele instanceof jQuery)) {
                        $ele = $($ele);
                    }
                    $scope.$watch('options', function (options) {
                        if (options) {
                            listenEvent($ele, $scope, options.tId);
                            createTable($ele, options);
                            bindEvent($ele, $scope, options.tId);
                        }
                    });
                }
            };
        }]);
    });