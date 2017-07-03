(function($){
	var MODULE_NAME = "h_guestinfo.index";

	function getRcText (argument) {
		return Utils.Base.getRcString("guest_rc", argument);
	}
	function onOpenEdit (argument) {
		// body...
		var jForm = $("#edit_black_form");
    	var sPassword = $("#password3", jForm).val();
    	var sNewpassword = $("#newpassword", jForm).val();
    	var sNewpassword2 = $("#newpassword2", jForm).val();

		Utils.Pages.closeWindow (Utils.Pages.getWindow (jForm));
	}
	function onOpenEditDlg(aRowData)
    {
		// body...
		var jForm = $("#edit_black_form");
		jForm.form("init", "edit", {"title":getRcText("EDIT_FORM_TITLE"), "btn_apply": onOpenEdit});
    	Utils.Base.openDlg(null, null, {scope:$("#edit_black_dlg"),className:"modal-large"});
    }
    function onOpenAdd (argument) {
    	// body...
    	var jForm = $("#add_black_form");
    	var sName = $("#name", jForm).val();
    	var sPassword = $("#password", jForm).val();
    	var sPassword2 = $("#password2", jForm).val();

    	Utils.Pages.closeWindow (Utils.Pages.getWindow (jForm));
    }
    function onOpenAddDlg (argument) {
    	// body...
    	var jForm = $("#add_black_form");
		jForm.form("init", "edit", {"title":getRcText("ADD_FORM_TITLE"), "btn_apply": onOpenAdd});
    	Utils.Base.openDlg(null, null, {scope:$("#add_black_dlg"),className:"modal-large"});
    }
    function addBlack (argument) {
    	// body...
    }
    function delBlack (argument) {
    	// body...
    }
    function putLog (argument) {
    	// body...
    }
    function checkLog (argument) {
    	// body...
    }
	function initGrid (argument) {
		var opt = {
			showOperation:true,
            showHeader: true,
            multiSelect: true,
            pageSize : 8,
            colNames: getRcText ("GUEST_HEAD"),
            colModel: [
                {name: "name", datatype: "String"},
                {name: "type", datatype: "String"},
                {name: "time", datatype: "String"}
            ],
            buttons:[
            	{name: "add", action: onOpenAddDlg},
                {name: "edit", action: onOpenEditDlg},
                {name: "delet", value:getRcText ("DELETE"),enable: ">0",action:Utils.Msg.deleteConfirm( onOpenAdd)},
                {name: "default", value:getRcText ("ADD_BLACK"), enable: ">0",action: addBlack},
                {name: "default", value:getRcText ("DEL_BLACK"), enable: ">0",action: delBlack},
                {name: "default", value:getRcText ("PUTOUT"), action: putLog},
                {name: "default", value:getRcText ("CHECK_PUTOUT"), action: checkLog}
            ]
        };
        $("#guest_list").SList ("head", opt);
	}
	function initData (argument) {
		// body...
		var tempData1 = [];
	        tempData1.push(
	        {
	        	name:"qin",
	        	type:getRcText("test1"),
	        	time:"2016-02-23 17:27:09"
	        },
	        {
	        	name:"qin2",
	        	type:getRcText("test1"),
	        	time:"2016-02-23 12:27:29"
	        },
	        {
	        	name:"qin3",
	        	type:getRcText("test1"),
	        	time:"2016-02-23 13:27:39"
	        },
	        {
	        	name:"qin4",
	        	type:getRcText("test1"),
	        	time:"2016-02-23 14:27:49"
	        },
	        {
	        	name:"qin5",
	        	type:getRcText("test1"),
	        	time:"2016-02-23 15:27:59"
	        }
        );
        $("#guest_list").SList ("refresh", tempData1);
	}
	function _init (argument) {
		// body...
		initGrid();
		initData();
	}
	function _destroy (argument) {
		// body...
	}
	function _resize (argument) {
		// body...
	}
	Utils.Pages.regModule (MODULE_NAME,{
		"init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["Echart","Minput","SList","Form"],
        "utils": ["Base", "Device"]
	});
})(jQuery);