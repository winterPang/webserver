;(function ($) {
    var MODULE_BASE = "natdetect";
    var MODULE_NAME = MODULE_BASE+".natdetect";
    var LIST_NAME = "natdetect_mlist";
	var strAnt = MyConfig.path + '/ant';

	 var natDetectData = {
        url:strAnt+"/nat_detect",
        data:{
            Method:"GetClient",
            Param:{
				ACSN:FrameInfo.ACSN
            },
            Return:[
					"ACSN",
					"ClientMAC",
					"FirstTime",
                    "LastTime",
                    "DetectTimes",
					"Duration",
                    "OSVersion"
				]
        }
    };
   
    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("client_rc", sRcName);
    }

    function initGrid()
    {
        var opt = {
            colNames: getRcText ("LIST_HEADER").split(","),
            showHeader: true,
            search:true,
            pageSize:12,
            colModel: [
                {name: "ClientMAC", datatype: "String"},
                {name: "FirstTime"},
                {name: "LastTime"},
                {name: "DetectTimes"},
				{name: "Duration"},
                {name: "OSVersion", datatype: "String"}

            ]
        };
        $("#"+LIST_NAME).SList("head", opt);

    }


    function initData()
    {
        function mycallback(adata){
			$.each(adata, function( i,temp){
				adata[i].FirstTime =string2date(adata[i].FirstTime);
				adata[i].LastTime =string2date(adata[i].LastTime);
				adata[i].Duration = second2Time(temp.Duration);
			})
			$("#"+LIST_NAME).SList("refresh", adata);
		}
		
		$.ajax({
                url:natDetectData.url,
                dataType: "json",
                type:"post",
                data:natDetectData.data,
                success: function (Data)
                {
                    mycallback(Data);
                },
                error: function(error){

                    onError(error);

                }
            });

    }
	
	function onError(error){}
	function second2Time(timedata){
		if(timedata == 0){
			return '0';
		}
		var dayss = 24*60*60;
		var aDate = new Date(timedata);
		var nDays = parseInt(timedata/dayss);
		var nHours = aDate.getUTCHours();
		var nMin = aDate.getUTCMinutes();
		var nSec = aDate.getUTCSeconds();
		var strName = getRcText("LIST_DATE").split(",");
		return (nDays?(nDays+strName[0]):'') +
				(nHours?(nHours+strName[1]):'')+
				(nMin?(nMin+strName[2]):'')+
				(nSec?(nSec+strName[2]):'');
				
		
	}
    function string2date(data){
        var date1 = new Date(data * 1000);
        return date1.toLocaleString();
    }



    function _init()
    {
        initGrid();
        initData();
    }

    function _destroy()
    {
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init, 
        "destroy": _destroy, 
        "widgets": ["SList"], 
        "utils":["Request","Base"]
    });
})( jQuery );

