/**
 * Created by Administrator on 2016/1/24.
 */
var Schema = require('wlanpub').dbhd.Schema;

var schema_findpwd = new Schema({
    Tel:String,
    AuthNum: Number,
    SendTime: Date,
    Status: Number
});

exports.schema_findpwd = schema_findpwd;
