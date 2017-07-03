;(function ($) {

	function resetActive()
	{
		var sHash = window.location.hash;
		if(!sHash) return ;

		var sBrowser = navigator.userAgent;
		var sSelector = '#doc_menu>li>a[href="'+sHash+'"]';

		$('#doc_menu>li').removeClass('active');

        if(sBrowser.search('Safari') != -1)
        {
            var myEvent = document.createEvent("MouseEvent");
            myEvent.initEvent("click");
            document.querySelector(sSelector).dispatchEvent(myEvent);
        }
        else
        {
            $(sSelector).find('span').click();
        }
	}

	function onPageScroll()
	{
		var scrollY = $(this).scrollTop();

		var jAnchor = $('.doc_anchor');
		$.each(jAnchor,function(index,item){
			var jNext = jAnchor.get(index+1);
			var nTop = $(this).offset().top-100;
			var nNextTop = jNext ? $(jNext).offset().top-100 : 10000;
			if(scrollY > nTop && scrollY < nNextTop)
			{
				var jMenus =  $('#doc_menu>li');
				var sName = $(this).attr('name');
				jMenus.removeClass('active')
					  .find('[href="#'+sName+'"]')
					  .parent()
					  .addClass('active');
				return false;
			}
		});
	}

	function onMenuClick()
	{
		if($(this).hasClass('operation-li'))
		{	
			var action = $(this).attr('action');

			Page[action] && Page[action]();
			return false;
		}

		$(this).siblings().removeClass('active');
		$(this).addClass('active');
	}

	function initMenu()
	{
		$('#doc_menu').on('click','li',onMenuClick);
		$(window).scroll(onPageScroll);
		resetActive();
	}

	function _waitVar(pfReady, pfExcute)
    {
        var hTimer = setInterval(function()
        {
            if(true===pfReady())
            {
                clearInterval(hTimer);
                pfExcute();
            }
        }, 10)
    }

    _waitVar(
    	function(){
    		return window._isMenuReady;
	    },
	    function(){
	    	initMenu();
	    }
	);


})( jQuery );