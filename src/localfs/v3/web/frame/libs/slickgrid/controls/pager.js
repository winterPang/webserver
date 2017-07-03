(function ($) {
  function SlickGridPager(dataView, grid, $container) {
    var $status;

    function init() {
      dataView.onPagingInfoChanged.subscribe(function (e, pagingInfo) {
        updatePager(pagingInfo);
      });

      constructPagerUI();
      updatePager(dataView.getPagingInfo());
    }

    function getNavState() {
      var cannotLeaveEditMode = !Slick.GlobalEditorLock.commitCurrentEdit();
      var pagingInfo = dataView.getPagingInfo();
      var lastPage = pagingInfo.totalPages - 1;

      return {
        canGotoFirst: !cannotLeaveEditMode && pagingInfo.pageSize != 0 && pagingInfo.pageNum > 0,
        canGotoLast: !cannotLeaveEditMode && pagingInfo.pageSize != 0 && pagingInfo.pageNum != lastPage,
        canGotoPrev: !cannotLeaveEditMode && pagingInfo.pageSize != 0 && pagingInfo.pageNum > 0,
        canGotoNext: !cannotLeaveEditMode && pagingInfo.pageSize != 0 && pagingInfo.pageNum < lastPage,
        pagingInfo: pagingInfo
      }
    }

    function _setPageSize(n) {
      dataView.setRefreshHints({
        isFilterUnchanged: true
      });
      dataView.setPagingOptions({pageSize: n});
      /*
       *Modify by wangbingzhi
       *2015-06-18
       *if have no this code,will no show all rows.
      */
      grid.resizeCanvas();
    }

    function gotoFirst() {
      if (getNavState().canGotoFirst) {
        dataView.setPagingOptions({pageNum: 0});
      }
    }

    function gotoLast() {
      var state = getNavState();
      if (state.canGotoLast) {
        dataView.setPagingOptions({pageNum: state.pagingInfo.totalPages - 1});
      }
    }

    function gotoPrev() {
      var state = getNavState();
      if (state.canGotoPrev) {
        dataView.setPagingOptions({pageNum: state.pagingInfo.pageNum - 1});
      }
    }

    function gotoNext() {
      var state = getNavState();
      if (state.canGotoNext) {
        dataView.setPagingOptions({pageNum: state.pagingInfo.pageNum + 1});
      }
    }

    this.setPageSize = function(nPageSize)
    {
      var $settings = $(".slick-pager-settings-expanded", $container);
      $settings.show();
      _setPageSize(parseInt(nPageSize));

      $("a.active", $settings).removeClass("active");
      $("a[data="+nPageSize+"]", $settings).addClass("active");
    }

    function constructPagerUI() {
      $container.empty();

      var $nav = $("<span class='slick-pager-nav' />").appendTo($container);
      var $settings = $("<span class='slick-pager-settings' />").appendTo($container);
      $status = $("<span class='slick-pager-status' />").appendTo($container);

      $settings
          .append("<span class='slick-pager-settings-expanded' style='display:none'>Show: <a data=0>All</a><a data='-1'>Auto</a><a data=10>10</a></a><a data=20>20</a><a data=50>50</a></span>");

      $settings.find("a[data]").click(function (e) {
        var pagesize = $(e.target).attr("data");
        if (pagesize != undefined) {
          if (pagesize == -1) {
            var vp = grid.getViewport();
            _setPageSize(vp.bottom - vp.top);
          } else {
            _setPageSize(parseInt(pagesize));
          }
          $("a.active", $settings).removeClass("active");
          $("a[data='"+pagesize+"']", $settings).addClass("active");
        }
      });

      var icon_prefix = "<span class='ui-state-default ui-corner-all ui-icon-container'><span class='ui-icon ";
      var icon_prefix_end = "' ></span><span class='text-span'>";
      var icon_suffix = "</span></span>";
      var text_first = $.MyLocale.MList.Page.FIRST;
      var text_prev = $.MyLocale.MList.Page.PREV;
      var text_next = $.MyLocale.MList.Page.NEXT;
      var text_last = $.MyLocale.MList.Page.LAST;
      
      $(icon_prefix + "ui-icon-lightbulb" + icon_prefix_end + icon_suffix)
          .click(function () {
            $(".slick-pager-settings-expanded").toggle()
          })
          .appendTo($settings);

      $(icon_prefix + "ui-icon-seek-first" + icon_prefix_end + text_first + icon_suffix)
          .click(gotoFirst)
          .appendTo($nav);

      $(icon_prefix + "ui-icon-seek-prev" + icon_prefix_end + text_prev + icon_suffix)
          .click(gotoPrev)
          .appendTo($nav);

      $(icon_prefix + "ui-icon-seek-next" + icon_prefix_end + text_next + icon_suffix)
          .click(gotoNext)
          .appendTo($nav);

      $(icon_prefix + "ui-icon-seek-end" + icon_prefix_end + text_last + icon_suffix)
          .click(gotoLast)
          .appendTo($nav);

      $container.find(".ui-icon-container")
          .hover(function () {
            $(this).toggleClass("ui-state-hover");
          });

      $container.children().wrapAll("<div class='slick-pager' />");
    }


    function updatePager(pagingInfo) {
      var state = getNavState();
      var selectNum = grid.getSelectedRows().length;

      $container.find(".slick-pager-nav span").removeClass("ui-state-disabled");
      if (!state.canGotoFirst) {
        $container.find(".ui-icon-seek-first")
            .addClass("ui-state-disabled")
            .parent().addClass("ui-state-disabled");
      }
      if (!state.canGotoLast) {
        $container.find(".ui-icon-seek-end")
            .addClass("ui-state-disabled")
            .parent().addClass("ui-state-disabled");
      }
      if (!state.canGotoNext) {
        $container.find(".ui-icon-seek-next")
            .addClass("ui-state-disabled")
            .parent().addClass("ui-state-disabled");
      }
      if (!state.canGotoPrev) {
        $container.find(".ui-icon-seek-prev")
            .addClass("ui-state-disabled")
            .parent().addClass("ui-state-disabled");
      }

      if (pagingInfo.pageSize == 0) {
        $status.html($.MyLocale.DATAINFO);
      } else {
        $status.html($.MyLocale.DATAINFO + $.MyLocale.PAGEINFO);
        $('.page-num',$status).html(pagingInfo.pageNum + 1);
        $('.page-count',$status).html(pagingInfo.totalPages);
      }

      $('.data-count',$status).html(pagingInfo.totalRows);
      $('.selected-count',$status).html(selectNum);
    }

    init();
  }

  // Slick.Controls.Pager
  $.extend(true, window, { Slick:{ Controls:{ Pager:SlickGridPager }}});
})(jQuery);
