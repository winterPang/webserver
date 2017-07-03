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
var defaul             = require('./default');

router.use('/wips_ap', old_wips_ap);
router.use('/wips_client', old_wips_client);
router.use('/wips_statistics', old_wips_statistics);
router.use('/probeclient', old_probeclient);
router.use('/probeap', old_probeap);
router.use('/clientprobe_client', clientprobe_client);
router.use('/dpi_app', old_dpi_app);
router.use('/dpi_url', old_dpi_url);
router.use('/', defaul);

module.exports = router;