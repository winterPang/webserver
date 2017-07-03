/**
 * Created by Administrator on 2016/6/27.
 */
(function ($)
{
    var MODULE_NAME = "a_dataanalysis.export";
    var g_placeMapdevSN = {};
    var g_devSNMapPlace = {};
    var g_devSNList = {devSNList:[]};
    var g_placeInfo = "所有场所";
    var g_interval = {
        //startDay: new Date().format('YYYY/MM/DD'),
        //endDay: new Date().format('YYYY/MM/DD')
    };

    function initDate()
    {
        function cb(start, end)
        {
            //$('#reportrange_span').html(start.format('YYYY/MM/DD') + ' - ' + end.format('YYYY/MM/DD'));
            $('#daterange').val(start.format('YYYY/MM/DD') + ' - ' + end.format('YYYY/MM/DD'));
            g_interval.startDay = start.format('YYYY/MM/DD');
            g_interval.endDay = end.format('YYYY/MM/DD');
        }

        cb(moment().subtract(0, 'days'), moment());


        $('#reportrange').daterangepicker({
            ranges: {
                '今天': [moment(), moment()],
                '昨天': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                '最近7天': [moment().subtract(6, 'days'), moment()],
                '最近30天': [moment().subtract(29, 'days'), moment()],
                '本月': [moment().startOf('month'), moment().endOf('month')],
                '上月': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        }, cb);
    }

    function changeChangShuo()
    {
        function showAreaList(data)
        {
            g_devSNList.devSNList = [];
            var btn_area = ["所有区域"];
            var areaList = data.areaList;
            for(var i = 0, l = areaList.length; i < l; i++)
            {
                btn_area.push(areaList[i].areaName);
            }

            $("#select2").singleSelect("InitData", btn_area);
            $("#changdiselect").singleSelect("InitData", btn_area);

            g_placeInfo = $("#changshuoselect").val();
        }

        var changshuo = $(this).val();
        var devSN = g_placeMapdevSN[changshuo];
        $.ajax({
            url:MyConfig.path +'/data_analysis_read/getspecialareainfo' + '?devSN=' + devSN,
            type:'get',
            dataType:'json',
            success:showAreaList,
            error:function(){
                Frame.Msg.error("数据获取失败，请联系客服");
            }
        });
    }

    function exporttiming()
    {
        Utils.Base.openDlg(null, {}, {scope: $("#tableDlg"), className: "modal-super"});
        //$("#selectall").html("全选");
        //$("#selectall").text("全选");
    }

    function selectall()
    {

        var checkId = ['zkll', 'dfkll', 'zlkll', 'dfl', 'zll',
            'pjzlsc', 'xzgks', 'sywfbl', 'pjdfcs', 'dzl', 'zzl', 'gzl'];

        if ($(this).html() == "全选")
        {
            $("#selectall").html("取消全选");
            //$("input[name=checkitem][checked!=checked]").click();
            checkId.forEach(function (id) {
                $('#' + id).next().addClass('checked');
            });
        }
        else
        {
            $("#selectall").html("全选");
            checkId.forEach(function (id) {
                $('#' + id).next().removeClass('checked');
            });
            //$("input[name=checkitem]").attr("checked", false);
        }
    }

    function exportList()
    {
        function exportSuc(data){
            if(data.retCode == 0)
            {
                $("#exportFile").get(0).src = data.fileName;
            }else{

            }
        }

        function exportFail(error){
            Frame.Msg.error("export file with error: " + error);
        }

        var  postData = {
            interval: g_interval,
            devSNList: g_devSNList
        };
        var exportOpt = {
            url: "/v3/fs/exportAnalysisDetailList",
            type: "POST",
            dataType: "json",
            data:  postData,
            onSuccess: exportSuc,
            onFailed: exportFail
        };

        Utils.Request.sendRequest(exportOpt);
    }

    function initEvent()
    {
        $("#select1").change(changeChangShuo);
        $("#changshuoselect").change(changeChangShuo);
        $("#timeing").on("click", exporttiming);
        $("#selectall").on("click", selectall);
        $("#daterange").on("inputchange.datarange", function(){
            var orange = $(this).daterange("getRangeData");
            g_interval.startDay = orange.startData;
            g_interval.endDay = orange.endData;
        });

        $("#export").on("click", exportList)
    }

    function initCheckBox()
    {

        var checkId = ['all', 'zhongkeliuliang', 'daofangkeliuliang', 'zhuliukeliuliang', 'daofanglv', 'zhuliulv',
            'pingjunzhuliushichang', 'xinzhengguke', 'wifishiyonglv', 'pingjunfangwen', 'dizhuliu',
            'zhongzhuliu', 'gaozhuliu'];
        $("#all").on("click", function () {
            var all_check = this.checked;
            checkId.forEach(function (id) {
                document.getElementById(id).checked = all_check;
                if(all_check){
                    $('#' + id).next().addClass('checked');
                }else{
                    $('#' + id).next().removeClass('checked');
                }
            });
        });
    }

    function initSelectBox()
    {
        function showPlaceList(data)
        {
            g_devSNList.devSNList = [];
            var btn_loupan = ["所有场所"];
            var devSNList = data.devSNList;
            for(var i = 0; i < devSNList.length; i++)
            {
                btn_loupan.push(devSNList[i].placeName);
                g_placeMapdevSN[devSNList[i].placeName] = devSNList[i].devSN;
                g_devSNMapPlace[devSNList[i].devSN] = devSNList[i].placeName;
                g_devSNList.devSNList.push({devSN:devSNList[i].devSN});
            }

            $("#changshuoselect").singleSelect("InitData", btn_loupan);
            $("#select1").singleSelect("InitData", btn_loupan);

            var btn_area = ["所有区域"];
            $("#select2").singleSelect("InitData", btn_area);
            $("#changdiselect").singleSelect("InitData", btn_area);

            //g_placeInfo = $("#changshuoselect").val();
        }

        $.ajax({
            url:MyConfig.path +'/data_analysis_read/getdevsn',
            type:'get',
            dataType:'json',
            success:showPlaceList,
            error:function(){
                Frame.Msg.error("数据获取失败，请联系客服");
            }
        });

        var data_select2 = ["所有场地"];
        $("#select2").singleSelect("InitData", data_select2);
        $("#changdiselect").singleSelect("InitData", data_select2);

        var timeinterval = ["5分钟","10分钟","20分钟","30分钟","1小时","6小时","12小时","1天","1月","1年"];
        $("#timeinterval").singleSelect("InitData", timeinterval);
    }

    function _init()
    {
        initDate();
        initEvent();
        initCheckBox();
        initSelectBox();
    }

    function _destroy()
    {

    }

    function _resize()
    {

    }
    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["Echart", "DateRange", "SingleSelect", "DateTime", "Minput"],
        "utils": ["Base", "Request"]
    });
}) (jQuery);