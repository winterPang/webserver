/**
 * 该文件由ant组件提供路由功能.
 */
var express    = require('express');
var router = express.Router();

var clientprobe_client = require('./clientprobe_client');
var old_dpi_app        = require('./old_dpi_app');
var old_dpi_url        = require('./old_dpi_url');
var old_wips_ap        = require('./old_wips_ap');
var old_wips_client    = require('./old_wips_client');
var old_wips_statistics= require('./old_wips_statistics');
var old_probeclient    = require('./old_probeclient');
var old_probeap        = require('./old_probeap');
var dpi_app            = require('./dpi_app');
var dpi_url            = require('./dpi_url');
var dpi_signature      = require('./dpi_signature');
var wips_ap            = require('./wips_ap');
var wips_client        = require('./wips_client');
var wips_statistics    = require('./wips_statistics');
var nat_detect         = require('./nat_detect');
var confmgr            = require('./confmgr');
var rollback           = require('./rollback');
var read_rollback      = require('./read_rollback');
var logmgr             = require('./logmgr');
var read_logmgr        = require('./read_logmgr');
var probeclient        = require('./probeclient');
var probeap            = require('./probeap');
var appstatistics      = require('./appstatistics');
var defaul             = require('./default');
var old_index          = require('./old_index');
var oasishealth        = require('./oasishealth');
var configtemplate     = require('./configtemplate');
var rdmenuaccess		   = require('./rdmenuaccess');
var errorRecord        = require('./errorRecord');
var devstatus          = require('./devstatus');
var confmodule         = require('../confmodule');


//router.use('/test', hdfsTest);
//router.use('/clientprobe_client', clientprobe_client);
//router.use('/dpi_app', old_dpi_app);
//router.use('/dpi_url', old_dpi_url);
//router.use('/wips_ap', old_wips_ap);
//router.use('/wips_client', old_wips_client);
//router.use('/wips_statistics', old_wips_statistics);
//router.use('/probeclient', old_probeclient);
//router.use('/probeap', old_probeap);
router.use('/confmgr', confmgr);
router.use('/rollback', rollback);
router.use('/read_rollback', read_rollback);
router.use('/logmgr', logmgr);
router.use('/read_logmgr', read_logmgr);
router.use('/dpi_signature', dpi_signature);
router.use('/read_dpi_app', dpi_app);
router.use('/read_dpi_url', dpi_url);
router.use('/read_wips_ap', wips_ap);
router.use('/read_wips_client', wips_client);
router.use('/read_wips_statistics', wips_statistics);
router.use('/nat_detect', nat_detect);
router.use('/read_probeclient', probeclient);
router.use('/read_probeap', probeap);
router.use('/appstatistics', appstatistics);
router.use('/configtemplate', configtemplate);
router.use('/rdmenuaccess', rdmenuaccess);
router.use('/confmodule', confmodule);

router.use('/oasishealth', oasishealth);
router.use('/error_record', errorRecord);
router.use('/devstatus', devstatus);

router.use('/', old_index);
//router.use('/', defaul);

module.exports = router;
