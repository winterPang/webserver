(function ($) {
  // register namespace
  $.extend(true, window, {
    "Slick": {
      "CheckboxSelectColumn": CheckboxSelectColumn
    }
  });

  var idProperty = "_id";  // property holding a unique row id

  function CheckboxSelectColumn(options) {
    var _grid;
    var _self = this;
    var _handler = new Slick.EventHandler();
    var _selectedRowsLookup = {};
    var _selectedRowsIdLookup = {};
    var _defaults = {
      columnId: "_checkbox_selector",
      cssClass: null,
      toolTip: $.MyLocale.MList.selectAll || "Select/Deselect All",
      width: 32
    };

    var _options = $.extend(true, {}, _defaults, options);

    function init(grid) {
      _grid = grid;
      _handler
        .subscribe(_grid.onSelectedRowsChanged, handleSelectedRowsChanged)
        .subscribe(_grid.getData().onRowCountChanged, updateSelectAllCheckbox)
        .subscribe(_grid.onClick, handleClick)
        .subscribe(_grid.onHeaderClick, handleHeaderClick)
        .subscribe(_grid.onKeyDown, handleKeyDown);
    }

    function destroy() {
      _handler.unsubscribeAll();
    }

    function updateSelectAllCheckbox()
    {
      _grid.updateSelectedRangesChanged();
      var selectedRows = _grid.getSelectedRows();
      if (selectedRows.length && selectedRows.length == _grid.getDataLength()) {
        _grid.updateColumnHeader(_options.columnId, "<input type='checkbox' checked='checked'>", _options.toolTip);
      } else {
        _grid.updateColumnHeader(_options.columnId, "<input type='checkbox'>", _options.toolTip);
      }
    }

    function handleSelectedRowsChanged(e, args) {
      var selectedRows = _grid.getSelectedRows();
      var lookup = {}, lookupId = {}, row, rowId, i;
      for(var m=0, l=_grid.getData().getLength(); m<l; m++)
      {
        var id = _grid.getDataItem(m)[idProperty];
        if(_selectedRowsIdLookup[id])
        {
          _selectedRowsLookup[m] = true;
        }
      }
      
      for (i = 0; i < selectedRows.length; i++) {
        row = selectedRows[i];
        rowId = _grid.getDataItem(row)[idProperty];
        lookup[row] = true;
        lookupId[rowId] = true;
        if (lookup[row] !== _selectedRowsLookup[row]) {
          _grid.invalidateRow(row);
          delete _selectedRowsLookup[row];
          delete _selectedRowsIdLookup[rowId];
        }
      }
      for (i in _selectedRowsLookup) {
        _grid.invalidateRow(i);
      }
      _selectedRowsLookup = lookup;
      _selectedRowsIdLookup = lookupId;
      _grid.render();

      if (selectedRows.length && selectedRows.length == _grid.getDataLength()) {
        _grid.updateColumnHeader(_options.columnId, "<input type='checkbox' checked='checked'>", _options.toolTip);
      } else {
        _grid.updateColumnHeader(_options.columnId, "<input type='checkbox'>", _options.toolTip);
      }
    }

    function handleKeyDown(e, args) {
      if (e.which == 32) {
        if (_grid.getColumns()[args.cell].id === _options.columnId) {
          // if editing, try to commit
          if (!_grid.getEditorLock().isActive() || _grid.getEditorLock().commitCurrentEdit()) {
            toggleRowSelection(args.row);
          }
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      }
    }

    function handleClick(e, args) {
      // clicking on a row select checkbox
      if (_grid.getColumns()[args.cell].id === _options.columnId && ($(e.target).is(":checkbox") || $(e.target).find(":checkbox").length)) {
        // if editing, try to commit
        if (_grid.getEditorLock().isActive() && !_grid.getEditorLock().commitCurrentEdit()) {
          e.preventDefault();
          e.stopImmediatePropagation();
          return;
        }

        toggleRowSelection(args.row);
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    }

    function toggleRowSelection(row) {
      if (_selectedRowsLookup[row]) {
        _grid.setSelectedRows($.grep(_grid.getSelectedRows(), function (n) {
          return n != row
        }));
      } else {
        _grid.setSelectedRows(_grid.getSelectedRows().concat(row));
      }
    }

    function handleHeaderClick(e, args) {
      if (args.column.id == _options.columnId && ($(e.target).is(":checkbox") || $(e.target).find(":checkbox").length)) {
        // if editing, try to commit
        if (_grid.getEditorLock().isActive() && !_grid.getEditorLock().commitCurrentEdit()) {
          e.preventDefault();
          e.stopImmediatePropagation();
          return;
        }

        if ($(e.target).is(":checked") || (!$(e.target).is(":checkbox") && !$(e.target).find(":checkbox").is(":checked"))) {
          var rows = [];
          for (var i = 0; i < _grid.getDataLength(); i++) {
            rows.push(i);
          }
          _grid.setSelectedRows(rows);
        } else {
          _grid.setSelectedRows([]);
        }
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    }

    function getColumnDefinition() {
      return {
        id: _options.columnId,
        name: "<input type='checkbox'>",
        toolTip: _options.toolTip,
        field: "sel",
        width: _options.width,
        resizable: false,
        sortable: false,
        cssClass: _options.cssClass,
        formatter: checkboxSelectionFormatter
      };
    }

    function checkboxSelectionFormatter(row, cell, value, columnDef, dataContext) {
      var rowId = _grid.getDataItem(row)[idProperty];
      if (dataContext) {
        return _selectedRowsIdLookup[rowId]
            ? "<input type='checkbox' checked='checked'>"
            : "<input type='checkbox'>";
      }
      return null;
    }

    $.extend(this, {
      "init": init,
      "destroy": destroy,

      "getColumnDefinition": getColumnDefinition
    });
  }
})(jQuery);