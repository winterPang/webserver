/**
 * ANT默认路由处理，防止走进ANT路由分支后找不到相应的路由
 */
var express    = require('express');
var router     = express.Router();

router.all('/*', function(req, res, next) {
    res.status(404).end();
});

module.exports = router;