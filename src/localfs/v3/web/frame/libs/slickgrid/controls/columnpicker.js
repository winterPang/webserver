(function ($) {
  function SlickColumnPicker(columns, grid, options) {
    var $menu;
    var columnCheckboxes;

    var defaults = {
      fadeSpeed:250
    };

    function init() 
    {
      options = $.extend({}, defaults, options);
      if(options.menuBtn && options.menuBtn.bind)
      {
        options.menuBtn.bind("click", function(e)
          {
            if($menu.is(":visible"))
            {
              hidePopMenu(e);
            }
            else
            {
              handleHeaderContextMenu(e);
            }
          });
      }

      //grid.onHeaderContextMenu.subscribe(handleHeaderContextMenu);
      grid.onColumnsReordered.subscribe(updateColumnOrder);

      $menu = $("<span class='slick-columnpicker' style='display:none;position:absolute;z-index:999;' />").appendTo(document.body);
      //$menu.bind("mouseleave", hidePopMenu);
      $menu.bind("click", updateColumn);

      $("body").bind("click",hidePopMenu);
    }
    function _destroy()
    {
      $menu.hide ();
      $("body").unbind("click",hidePopMenu);
    }
    function hidePopMenu(e)
    {
        if (($(e.target).closest(".slick-columnpicker").length>0))
        {
            return;
        }
        else 
        {
            $menu.fadeOut(options.fadeSpeed);    
        }
    }
    function handleHeaderContextMenu(e) 
    {
      e.stopImmediatePropagation()
      $menu.empty();
      updateColumnOrder();
      columnCheckboxes = [];

      var $li, $input;
      for (var i = 0; i < columns.length; i++) 
      {
        $li = $('<li/>');
        if(columns[i].visible === true)
        {
          $li.hide();
        }
        $li.appendTo($menu);
        $input = $("<input type='checkbox' />").data("column-id", columns[i].id);
        columnCheckboxes.push($input);

        if (grid.getColumnIndex(columns[i].id) != null) {
          $input.attr("checked", "checked");
        }

        $("<label />")
            .text(columns[i].name)
            .prepend($input)
            .appendTo($li);
      }

      if(true === options.showOption)
      {
        $("<hr/>").appendTo($menu);
        $li = $("<li />").appendTo($menu);
        $input = $("<input type='checkbox' />").data("option", "autoresize");
        $("<label />")
            .text("Force fit columns")
            .prepend($input)
            .appendTo($li);
        if (grid.getOptions().forceFitColumns) {
          $input.attr("checked", "checked");
        }

        $li = $("<li />").appendTo($menu);
        $input = $("<input type='checkbox' />").data("option", "syncresize");
        $("<label />")
            .text("Synchronous resize")
            .prepend($input)
            .appendTo($li);
        if (grid.getOptions().syncColumnCellResize) {
          $input.attr("checked", "checked");
        }
      }

      var w = $("body").width();
      var mw = $menu.width();
      var left = ((w-e.pageX-mw)<30) ? (e.pageX-mw) : (e.pageX);
      var c = Frame.UI.coord($(e.target).closest(".slick-header-column").get(0));
      $menu
          .css("top", c.y+1)
          .css("left", left)
          .fadeIn(options.fadeSpeed);
    }

    function updateColumnOrder() {
      // Because columns can be reordered, we have to update the `columns`
      // to reflect the new order, however we can't just take `grid.getColumns()`,
      // as it does not include columns currently hidden by the picker.
      // We create a new `columns` structure by leaving currently-hidden
      // columns in their original ordinal position and interleaving the results
      // of the current column sort.
      var current = grid.getColumns().slice(0);
      var ordered = new Array(columns.length);
      for (var i = 0; i < ordered.length; i++) {
        if ( grid.getColumnIndex(columns[i].id) === undefined ) {
          // If the column doesn't return a value from getColumnIndex,
          // it is hidden. Leave it in this position.
          ordered[i] = columns[i];
        } else {
          // Otherwise, grab the next visible column.
          ordered[i] = current.shift();
        }
      }
      columns = ordered;
    }

    function updateColumn(e) {
      if ($(e.target).data("option") == "autoresize") {
        if (e.target.checked) {
          grid.setOptions({forceFitColumns:true});
          grid.autosizeColumns();
        } else {
          grid.setOptions({forceFitColumns:false});
        }
        return;
      }

      if ($(e.target).data("option") == "syncresize") {
        if (e.target.checked) {
          grid.setOptions({syncColumnCellResize:true});
        } else {
          grid.setOptions({syncColumnCellResize:false});
        }
        return;
      }

      if ($(e.target).is(":checkbox")) {
        var visibleColumns = [];
        $.each(columnCheckboxes, function (i, e) {
          if ($(this).is(":checked")) {
            visibleColumns.push(columns[i]);
          }
        });

        var nMinLen = (grid.getOptions().multiSelect) ? 2 : 1;
        if (visibleColumns.length < nMinLen) {
          $(e.target).attr("checked", "checked");
          return;
        }

        grid.setColumns(visibleColumns);
      }
    }

    function getAllColumns() {
      return columns;
    }

    init();

    return {
      "getAllColumns": getAllColumns,
      "destroy": _destroy
    };
  }

  // Slick.Controls.ColumnPicker
  $.extend(true, window, { Slick:{ Controls:{ ColumnPicker:SlickColumnPicker }}});
})(jQuery);
