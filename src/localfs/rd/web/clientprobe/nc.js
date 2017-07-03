;(function ($) {
var MODULE_NAME = "clientprobe.NC";

var PageInfo = {
    NC:
    {
        ProbeRadioConfigures: {
            nodes:["WIPS","ProbeRadioConfigures"],
            row:"ProbeRadioConfigure",
            index:["ApName","RadioId"],
            column:["State"],
            menus:["M_Probe"]
        }
        ,ClientProbes:{
            nodes:["WIPS","ClientProbes"],
            row:"ClientProbe",
            index:["MacAddress"],
            column:["Ssid","DissociativeStatus","Status","StatusDurationTime","Vendor","ReportSensorNum","Channel","RssiMax","RssiMin","Rssi","FirstReportTime","LastReportTime"],
            menus:["M_MonProbe"]
        }
        ,ProbeStatistics:{
            nodes:["WIPS","ProbeStatistics"],
            row:"ProbeStatistic",
            index:[],
            column:["Time","TotalNum","RssiMaxNum","RssiMiddleNum","RssiMinNum","AssocNum","DissocNum"],
            menus:["M_MonProbe"]
        },
        RadioOfRunAP: {
            nodes: ["AP", "RadioOfRunAP"],
            row: "Radio",
            index: ["ApName","RadioID"],
            column: ["Mode","Bandwidth","SecondaryOffSet","Channel","MaxPower"],
            menus:["M_Probe","M_MonProbe"]
        },
        ProbeReportSensors:{
            nodes:["WIPS","ProbeReportSensors"],
            row:"ProbeReportSensor",
            index:["DeviceMacAddress","SensorName"],
            column:["RadioId","Rssi","Channel","FirstReportTime","LastReportTime","AssociatedMacAddress"],
            menus:["M_MonProbe"]
        },
        ResetProbeDevices:{
            nodes:["WIPS","ResetProbeDevices"],
            row:"ResetProbeDevice",
            index:["MacAddress"],
            column:[],
            menus:["M_MonProbe"]
        }        
    }  
};
Utils.Pages[MODULE_NAME] = PageInfo;
})( jQuery );
