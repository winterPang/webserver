;(function ($) {
	var MODULE_BASE = "classroom";
	var MODULE_NAME = MODULE_BASE + ".infor";
    var g_aBrace = null;
    var SN = "";
	
	function getRcText (sRcName) 
	{
		return Utils.Base.getRcString("c_bracelet_rc",sRcName);
	}

    function $get(sUrl,onSuccessed,onFailed)
    {
        return $.ajax({
            type:'get',
            url:'/v3/wloc/wristband/'+sUrl,
            dataType:'json',
            success:function(data){
                onSuccessed && onSuccessed(data);
            },
            error:function(){
                console.error('Get Data Error');
                onFailed && onFailed(arguments);
            }
        });
    }

    function $set(oPara,onSuccessed,onFailed)
    {
        $.ajax({
            type:'post',
            url:'/v3/wloc/wristband/bind',
            dataType:'json',
            data : oPara,
            success:function(data){
                onSuccessed && onSuccessed(data);
            },
            error:function(){
                console.error('Set Data Error');
                onFailed && onFailed(arguments);
            }
        });
    }

	function onDel(aData)
	{
        $get("unbind?WristbandMac="+aData[0].WristbandMac+"&devSN="+SN,function(){
            Frame.Msg.info("Success");
            Utils.Base.refreshCurPage();
        });
	}

    function onSetSubmit()
    {
        var oPara = {
            devSN : SN,
            WristbandInfo:[{
                WristbandMac:$.trim($('#WristbandMac').val()),
                UserName:$.trim($('#UserName').val())
            }]
        };

        $set(oPara,function(){
            Frame.Msg.info("Success");
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#Brace_form")));
            Utils.Base.refreshCurPage();
        });
    }

    function onEdit(aData)
    {
        $("#head_block").show();
        $('#HeadIcon').attr("src",aData[0].HeadIcon);
        $("#Brace_form").form("init", "edit", {"title":getRcText("ADD_TITLE"),"btn_apply": onSetSubmit});
        $("#Brace_form").form("updateForm",aData[0]);
        Utils.Base.openDlg(null, {}, {scope:$("#AddBraceDlg"),className:"modal-super"});
    }

    function onAdd()
    {
       $("#head_block").hide();
       $("#Brace_form").form("init", "edit", {"title":getRcText("ADD_TITLE"),"btn_apply": onSetSubmit});
       Utils.Base.openDlg(null, {}, {scope:$("#AddBraceDlg"),className:"modal-super"});
    }

    function showSex(row, cell, value, columnDef, dataContext, type)
    {
        return getRcText("STU_SEX").split(",")[value];
    }

    function showIcon(row, cell, value, columnDef, dataContext, type)
    {
        var sStyle = 'width: 32px;border-radius: 16px;margin-top: -4px;border:1px solid #EDF9F7';
        if("text" == type)
        {
            return value;
        }

        return '<img src="'+value+'" name="'+dataContext.BraceName+'" style="'+sStyle+'"/>';
    }

	function initData()
	{
        function callback(oData)
        {
            var aBrace = oData.WristbandInfo;
            ////////////////for test//////////////////
            for(var i=0;i<aBrace.length;i++)
            {
                $.extend(aBrace[i],{
                    BraceName : 'Bracelet_'+i,
                    BraceName : 'Bracelet_'+i,
                    HeadIcon : '../../web/classroom/image/'+(i+1)%22+'.jpg',
                    Age : parseInt(Math.random()*20)+10+"",
                    Sex : parseInt(Math.random()*2)+"",
                    Grade : parseInt(Math.random()*6)+1+""
                })
            }
            ////////////////for test//////////////////
            g_aBrace = aBrace;
            $("#BraceList").SList ("refresh", aBrace);
        }

        //get stu
        $get("bindinfo?WristbandMac=all&devSN="+SN,callback);
	}

	function initGrid()
	{
		var optBrace = {
            colNames: getRcText ("BRACE_HEADER"),
            multiSelect: false,
            showOperation:true,
            colModel: [
                {name:'WristbandMac', datatype:"String"},
                {name:'BraceName', datatype:"String"},
                {name:'UserName', datatype:"String"},
                {name:'HeadIcon', datatype:"String",formatter:showIcon},
                {name:'Age', datatype:"String"},
                {name:'Sex', datatype:"String",formatter:showSex},
                {name:'Grade', datatype:"String"},

            ],
            buttons:[
                {name: "add", action: onAdd},
                {name:"edit", action:onEdit},
                {name:"delete",action:Utils.Msg.deleteConfirm(onDel)}
            ]

        };
        $("#BraceList").SList ("head", optBrace);
	}
    	
	function _init ()
	{
        SN = window.location.href;
        SN = SN.split("?")[1];
        SN = SN.split("&")[1];
        SN = SN.split("=")[1];

		initGrid();
		initData();
	}

	function _destroy ()
	{
        g_aBrace = null;
	}

	Utils.Pages.regModule(MODULE_NAME, {
		"init": _init, 
		"destroy": _destroy, 
		"widgets": ["SList","Minput","Form"],
		"utils":["Request","Base"]
	});   
})( jQuery );