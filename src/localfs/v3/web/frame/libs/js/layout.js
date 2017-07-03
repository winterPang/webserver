/**
 * @preserve jquery.layout 1.3.0 - Release Candidate 29.14
 * $Date: 2011-02-13 08:00:00 (Sun, 13 Feb 2011) $
 * $Rev: 302914 $
 *
 * Copyright (c) 2010 
 *   Fabrizio Balliano (http://www.fabrizioballiano.net)
 *   Kevin Dalman (http://allpro.net)
 *
 * Dual licensed under the GPL (http://www.gnu.org/licenses/gpl.html)
 * and MIT (http://www.opensource.org/licenses/mit-license.php) licenses.
 *
 * Changelog: http://layout.jquery-dev.net/changelog.cfm#1.3.0.rc29.13
 *
 * Docs: http://layout.jquery-dev.net/documentation.html
 * Tips: http://layout.jquery-dev.net/tips.html
 * Help: http://groups.google.com/group/jquery-ui-layout
 */

// NOTE: For best readability, view with a fixed-width font and tabs equal to 4-chars

;(function ($) {

$.fn.layout = function (opts) {

/*
 * ###########################
 *   WIDGET CONFIG & OPTIONS
 * ###########################
 */

	// LANGUAGE CUSTOMIZATION - will be *externally customizable* in next version
	var lang = {
		Pane:		"Pane"
	,	Open:		"Open"	// eg: "Open Pane"
	,	Close:		"Close"
	,	Slide:		"Slide Open"
	,	selector:	"selector"
	,	errCenterPaneMissing:	"UI Layout Initialization Error\n\nThe center-pane element does not exist."
	};

	var options = {
		name:						""			// Not required, but useful for buttons and used for the state-cookie
	,	containerClass:				"ui-layout-container" // layout-container element
	,	north: {
			paneSelector:			".ui-layout-north"
		,	size:					"auto"		// eg: "auto", "30%", 200
		,	resizerCursor:			"n-resize"	// custom = url(myCursor.cur)
		,	customHotkey:			""			// EITHER a charCode OR a character
		}
	,	south: {
			paneSelector:			".ui-layout-south"
		,	size:					"auto"
		,	resizerCursor:			"s-resize"
		,	customHotkey:			""
		}
	,	east: {
			paneSelector:			".ui-layout-east"
		,	size:					200
		,	resizerCursor:			"e-resize"
		,	customHotkey:			""
		}
	,	west: {
			paneSelector:			".ui-layout-west"
		,	size:					200
		,	resizerCursor:			"w-resize"
		,	customHotkey:			""
		}
	,	center: {
			paneSelector:			".ui-layout-center"
		,	minWidth:				0
		,	minHeight:				0
		}
   }

	// DYNAMIC DATA - IS READ-ONLY EXTERNALLY!
	var state = {
		// generate unique ID to use for event.namespace so can unbind only events added by 'this layout'
		id:			"layout"+ new Date().getTime()	// code uses alias: sID
	,	initialized: false
	,	container:	{} // init all keys
	,	north:		{}
	,	south:		{}
	,	east:		{}
	,	west:		{}
	,	center:		{}
	,	cookie:		{} // State Managment data storage
	};

	var getPane = function (pane) {
		var sel = options[pane].paneSelector
		return $(sel);
	};

/*
 * ###########################
 *   INITIALIZATION METHODS
 * ###########################
 */

	/**
	* Initialize the layout - called automatically whenever an instance of layout is created
	*
	* @see  none - triggered onInit
	* @return  An object pointer to the instance created
	*/
	var _create = function () {
		// a center pane is required, so make sure it exists
		if (!getPane('center').length) {
			alert( lang.errCenterPaneMissing );
			return false;
		}

        return true;
	};

	/**
	*	Destroy this layout and reset all elements
	*/
	var destroy = function () 
	{
	    $Container.removeData("layout");
	};

/*
 * ###########################
 *       ACTION METHODS
 * ###########################
 */

	/**
	* Toggles a pane open/closed by calling either open or close
	*
	* @param {string}	pane   The pane being toggled, ie: north, south, east, or west
	* @param {boolean=}	slide
	*/
	var toggle = function (pane, slide) {
		var 
			o		= options[pane]
		,	s		= state[pane]
		;
        if(s.isClosed)
        {
            open(pane);
        }
        else
        {
            close(pane);
        }
	};


	/**
	* Close the specified pane (animation optional), and resize all other panes as needed
	*
	* @param {string}	pane		The pane being closed, ie: north, south, east, or west
	* @param {boolean=}	force	
	* @param {boolean=}	noAnimation	
	* @param {boolean=}	skipCallback	
	*/
	var close = function (pane, force, noAnimation, skipCallback) {
		var 
			o		= options[pane]
		,	s		= state[pane]
		;

        getPane(pane).hide();
        s.isClosed = true;

        resizeAll.apply(this);
	};

	/**
	* Open the specified pane (animation optional), and resize all other panes as needed
	*
	* @param {string}	pane		The pane being opened, ie: north, south, east, or west
	* @param {boolean=}	slide	
	* @param {boolean=}	noAnimation	
	* @param {boolean=}	noAlert	
	*/
	var open = function (pane, slide, noAnimation, noAlert) {
		var 
			o		= options[pane]
		,	s		= state[pane]
		;

		getPane(pane).show();
		s.isClosed = false;

        resizeAll.apply(this);
	};

	/**
	* @param {string}		pane			The pane being resized
	* @param {number}		size			The *desired* new size for this pane - will be validated
	* @param {boolean=}		skipCallback	Should the onresize callback be run?
	* @param {boolean=}		force			Force resizing even if does not seem necessary
	*/
	var sizePane = function (pane, size, skipCallback, force) {
	};

	/**
	* @see  window.onresize(), callbacks or custom code
	*/
	var resizeAll = function () 
	{
	    if(options.center.onresize)
        {
            options.center.onresize();
        }
	};

/*
 * #####################
 * CREATE/RETURN LAYOUT
 * #####################
 */

	// validate that container exists
	var $Container = $(this).eq(0); // FIRST matching Container element
	if (!$Container.length) {
		return null;
	};
	// Users retreive Instance of a layout with: $Container.layout() OR $Container.data("layout")
	// return the Instance-pointer if layout has already been initialized
	if ($Container.data("layout"))
		return $Container.data("layout"); // cached pointer

	opts = opts || {};
    if(opts.center__onresize)
    {
        options.center.onresize = opts.center__onresize;
    }

	// create Instance object to expose data & option Properties, and primary action Methods
	var Instance = {
		options:		options			// property - options hash
	,	container:		$Container		// property - object pointers for layout container
	,	getPane:		getPane 		// 
	,	open:			open			// method - ditto
	,	close:			close			// method - ditto
	,	sizePane:		sizePane		// method - pass a 'pane' AND an 'outer-size' in pixels or percent, or 'auto'
	,	resizeAll:		resizeAll		// method - no parameters
	,	destroy:		destroy			// method - no parameters
	};

	// create the border layout NOW
	_create();

    // cache the Instance pointer
    $Container.data("layout", Instance);

	// return the Instance object
	return Instance;
}
})( jQuery );
