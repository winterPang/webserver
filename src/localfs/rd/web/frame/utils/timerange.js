;(function($)
{
    var SUPPORT_TR = true;

    var UTILNAME = "Timerange";
    var NC = Utils.Pages["Frame.NC"].NC_Timerange;

    function createDB()
    {
        return new TimerangeDB();
    }

    function TimerangeDB()
    {
        this.getRequestTable = getRequestTable;
        this.getAllData = getAllData;
        this.addToSingleSelect = addToSingleSelect;

        function getRequestTable()
        {
            var oRequest = Utils.Request.getTableInstance(NC.TrangeTable);

            if(false === SUPPORT_TR)
            {
                oRequest = null;
            }

            return oRequest;
        }

        function getAllData(oInfos)
        {
            var aTemData = Utils.Request.getTableRows(NC.TrangeTable, oInfos);

            if(false === SUPPORT_TR)
            {
                aTemData = [{Name:"tr1", Status:"1"}
                         ,{Name:"test1", Status:"0"}
                         ,{Name:"test2", Status:"0"}
                         ,{Name:"This_is_the_long_timerange_name", Status:"1"}
                         ];
            }

            return aTemData;
        }

        function addToSingleSelect(sSelector, aData)
        {
            $(sSelector).singleSelect("InitData", aData, {displayField:"Name",valueField:"Name"});
        }

        function init()
        {
        }

        init();
    }

    var oTimerange = {
        createDB : createDB
    };

    Utils.regUtil(UTILNAME, oTimerange, {"widgets": [], "utils":["Request"]});
})(jQuery);