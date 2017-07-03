;(function($){

	var MODULE_NAME = "b_device.wlanser_detail";

	function _doChange(){

	}

	function getRcText(sRcId)
	{
	    return Utils.Base.getRcString("wlanser_detail_rc", sRcId);
	}

	function onRowSubmit(oData,oPara)
	{
	    function check()
	    {
	        if(oRowData.FriendlyName=="" || oRowData.DescStr=="" || oRowData.IconType=="" || oRowData.IconName=="")
	            return false;
	        else
	            return true;
	    }

	    if(oData.type=="delete")
	    {
	        oPara.onSuccess(oData.type);
	        return true;
	    }

	    var oRowData = oData.curdata || {};

	    if(!check())
	    {
	        oPara.onFailed(getRcText ("fail_info"),oData.type,"FriendlyName");
	        oPara.onFailed(getRcText ("fail_info"),oData.type,"DescStr");
	        if(oRowData.IconName=="")
	        {
	            oPara.onFailed(getRcText ("fail_info"),oData.type,"IconName");
	        }
	        else
	        {
	            oPara.onFailed(getRcText ("fail_info"),oData.type,"IconType");
	        }
	        return false;
	    }
	    oPara.onSuccess(oData.type);
	    return true;  
	}
	function OSUFriendlyName_initGrid()
	{
	    var aLanguage = [];
	    var g_oLangCode = {"0":{"str2":"az","str3":"aze","help":"Azerbaijani"},"1":{"str2":"be","str3":"bel","help":"Belarusian"},"2":{"str2":"bg","str3":"bul","help":"Bulgarian"},"3":{"str2":"bi","str3":"bis","help":"Bislama"},"4":{"str2":"bn","str3":"ben","help":"Bengali"},"5":{"str2":"bs","str3":"","help":"Bosnian"},"6":{"str2":"ca","str3":"cat","help":"Catalan"},"7":{"str2":"cs","str3":"cze","help":"Czech"},"8":{"str2":"cy","str3":"wel","help":"Welsh"},"9":{"str2":"da","str3":"dan","help":"Danish"},"10":{"str2":"de","str3":"ger","help":"German"},"11":{"str2":"dv","str3":"div","help":"Divehi"},"12":{"str2":"dz","str3":"","help":"Bhutani"},"13":{"str2":"el","str3":"gre","help":"Greek"},"14":{"str2":"en","str3":"eng","help":"English"},"15":{"str2":"es","str3":"spa","help":"Spanish"},"16":{"str2":"et","str3":"est","help":"Estonian"},"17":{"str2":"fa","str3":"per","help":"Persian"},"18":{"str2":"fi","str3":"fin","help":"Finnish"},"19":{"str2":"fj","str3":"fij","help":"Fijian"},"20":{"str2":"fo","str3":"fao","help":"Faroese"},"21":{"str2":"fr","str3":"fre","help":"French"},"22":{"str2":"fy","str3":"fry","help":"Frisian"},"23":{"str2":"ga","str3":"gle","help":"Irish"},"24":{"str2":"gn","str3":"grn","help":"Guarani"},"25":{"str2":"he","str3":"heb","help":"Hebrew"},"26":{"str2":"hi","str3":"hin","help":"Hindi"},"27":{"str2":"ho","str3":"hmo","help":"Hiri Muto"},"28":{"str2":"hr","str3":"scr","help":"Croatian"},"29":{"str2":"ht","str3":"","help":"Haitian"},"30":{"str2":"hu","str3":"hun","help":"Hungarian"},"31":{"str2":"hy","str3":"arm","help":"Armenian"},"32":{"str2":"id","str3":"ind","help":"Indonesian"},"33":{"str2":"is","str3":"ice","help":"Icelandic"},"34":{"str2":"it","str3":"ita","help":"Italian"},"35":{"str2":"iu","str3":"iku","help":"Inuktitut"},"36":{"str2":"ja","str3":"jpn","help":"Japanese"},"37":{"str2":"ka","str3":"geo","help":"Georgian"},"38":{"str2":"kk","str3":"kaz","help":"Kazakh"},"39":{"str2":"km","str3":"khm","help":"Khmer"},"40":{"str2":"ko","str3":"kor","help":"Korean"},"41":{"str2":"ky","str3":"kir","help":"Kirghiz"},"42":{"str2":"la","str3":"lat","help":"Latin"},"43":{"str2":"lb","str3":"","help":"Luxembourgish"},"44":{"str2":"lo","str3":"lao","help":"Lao"},"45":{"str2":"lt","str3":"lit","help":"Lithuanian"},"46":{"str2":"lv","str3":"lav","help":"Latvian"},"47":{"str2":"mg","str3":"mlg","help":"Malagasy"},"48":{"str2":"mh","str3":"mah","help":"Marshallese"},"49":{"str2":"mi","str3":"mao","help":"Maori"},"50":{"str2":"mk","str3":"mac","help":"Mongolian"},"51":{"str2":"mn","str3":"mon","help":"Mongolian"},"52":{"str2":"ms","str3":"may","help":"Malay"},"53":{"str2":"mt","str3":"mlt","help":"Maltese"},"54":{"str2":"my","str3":"bur","help":"Burmese"},"55":{"str2":"na","str3":"nau","help":"Nauru"},"56":{"str2":"nb","str3":"","help":"Norwegian Bokmal"},"57":{"str2":"ne","str3":"nep","help":"Nepali"},"58":{"str2":"nl","str3":"dut","help":"Dutch"},"59":{"str2":"nn","str3":"","help":"Norwegian Nynorsk"},"60":{"str2":"no","str3":"nor","help":"Norwegian"},"61":{"str2":"nr","str3":"nbl","help":"Ndebele South"},"62":{"str2":"ny","str3":"","help":"Chichewa;chewa;nyanja"},"63":{"str2":"","str3":"nya","help":"nyanja"},"64":{"str2":"pl","str3":"pol","help":"Polish"},"65":{"str2":"ps","str3":"pus","help":"Pushto"},"66":{"str2":"pt","str3":"por","help":"Portuguese"},"67":{"str2":"qu","str3":"que","help":"Quechua"},"68":{"str2":"rn","str3":"run","help":"Rundi"},"69":{"str2":"ro","str3":"rum","help":"Romanian"},"70":{"str2":"ru","str3":"rus","help":"Russian"},"71":{"str2":"rw","str3":"kin","help":"Kinyarwanda"},"72":{"str2":"se","str3":"","help":"Northern Sami"},"73":{"str2":"si","str3":"sin","help":"Sinhalese"},"74":{"str2":"sk","str3":"slo","help":"Slovak"},"75":{"str2":"sl","str3":"slv","help":"Slovenian"},"76":{"str2":"sm","str3":"smo","help":"Samoan"},"77":{"str2":"so","str3":"som","help":"Somali"},"78":{"str2":"sq","str3":"alb","help":"Albanian"},"79":{"str2":"sr","str3":"scc","help":"Serbian"},"80":{"str2":"ss","str3":"ssw","help":"Swati"},"81":{"str2":"st","str3":"sot","help":"Sotho Southern"},"82":{"str2":"sv","str3":"swe","help":"Swedish"},"83":{"str2":"sw","str3":"swa","help":"Swahili"},"84":{"str2":"ta","str3":"tam","help":"Tamil"},"85":{"str2":"tg","str3":"tgk","help":"Tajik"},"86":{"str2":"th","str3":"tha","help":"Thai"},"87":{"str2":"ti","str3":"tir","help":"Tigrinya"},"88":{"str2":"tk","str3":"tuk","help":"Turkmen"},"89":{"str2":"tl","str3":"tgl","help":"Tagalog"},"90":{"str2":"tn","str3":"tsn","help":"Tswana"},"91":{"str2":"to","str3":"ton","help":"Tonga (Tonga Islands)"},"92":{"str2":"tr","str3":"tur","help":"Turkish"},"93":{"str2":"ts","str3":"tso","help":"Tsonga"},"94":{"str2":"uk","str3":"ukr","help":"Ukrainian"},"95":{"str2":"ur","str3":"urd","help":"Urdu"},"96":{"str2":"uz","str3":"uzb","help":"Uzbek"},"97":{"str2":"ve","str3":"ven","help":"Venda"},"98":{"str2":"vi","str3":"vie","help":"Vietnamese"},"99":{"str2":"xh","str3":"xho","help":"Xhosa"},"100":{"str2":"zh","str3":"chi","help":"Chinese"},"101":{"str2":"zu","str3":"zul","help":"Zulu"},"102":{"str2":"af","str3":"afr","help":"Afrikaans"},"103":{"str2":"am","str3":"amh","help":"Amharic"},"104":{"str2":"ar","str3":"ara","help":"Arabic"},"105":{"str2":"ay","str3":"aym","help":"Aymara"}}
	    for(var i in g_oLangCode){
	        aLanguage.push(g_oLangCode[i].help);
    }

    var opt = {
        colNames: getRcText("OSUFriendlyName_HEADER"),
        errorId:null,
        procData: onRowSubmit,
        maxCount:32,
        colModel:[
            //{name:'FriendlyName', required:false,width:25,min:1,maxLen:252,datatype:"String"},
            {name:'LangCode', required:false,width:25,datatype:"Order",data:{start:0,items:aLanguage}}
        ]
    };
    $("#OSUFriendlyName_edittable").EditTable("setOption", opt);
}
	function initGrid(){

	}

	function initForm(){
		var jFormSsid = $("#toggle_form");
		var oEdit =  {"title": getRcText("title"), "btn_apply": _doChange};
        jFormSsid.form("init", "edit", oEdit);

    $("input[name=AccPwdStaff]").bind("change",function(){
        var aContent = $(this).attr("content");
        var sCtrlBlock = $(this).attr("ctrlBlock") || "";
        $(sCtrlBlock).hide();

        if(!aContent) return true;

        aContent = aContent.split(",");
        for(var i=0;i<aContent.length;i++)
        {
            if(!aContent[i])continue;
            $(aContent[i]).show();
        }
    });
     $("input[name=devicegroup]").bind("change",function(){
        var aContent = $(this).attr("content");
        var sCtrlBlock = $(this).attr("ctrlBlock") || "";
        $(sCtrlBlock).hide();

        if(!aContent) return true;

        aContent = aContent.split(",");
        for(var i=0;i<aContent.length;i++)
        {
            if(!aContent[i])continue;
            $(aContent[i]).show();
        }
    });  

    $('#cancel').click(function(){
    	history.back();
    });
	}

	function initData(){

	}

	function _init(){
		initGrid();
		initForm();
		initData();
		OSUFriendlyName_initGrid();
	}

	function _destroy(){

	}

	function _resize(){

	}

	Utils.Pages.regModule (MODULE_NAME, {
	    "init": _init,
	    "destroy": _destroy,
	    "resize": _resize,
	    "widgets": ["Form", "EditTable","Minput"],
	    "utils": ["Request","Base"],
	});


})(jQuery)