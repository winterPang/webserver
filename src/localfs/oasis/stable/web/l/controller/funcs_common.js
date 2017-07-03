/**
 * Created by Administrator on 2016/11/4.
 */
var timedata = [];

function randomTime() {
    timedata=[];
    var now=new Date();
    var timedata_num=null;
    var todayFlag=true;
    todayFlag?(timedata_num=Math.floor((now.getHours()*60+now.getMinutes())/2)):(timedata_num=720);
    for (var i = 0; i <= timedata_num; i++) {
        timedata.push(2 * i);
    }

    return timedata.map(function (val) {
        var hour=Math.floor(val / 60);
        return (hour<10?('0'+hour):hour) +
            ':' +
            ((val - hour * 60)<10?('0'+(val - hour * 60)):(val - hour * 60));
    });
}

function randomData() {
    var datalist = [];
    for (var i = 0; i <= timedata.length-1; i++) {
        datalist.push(parseInt(Math.random() * 100 + 1));
    }
    return datalist;
}