/**
 * Created by Administrator on 2017/5/8.
 */
var express    = require('express');
var router = express.Router();

router.use('/education*', function(req, res) {
    res.sendfile('/iot/web/education/index.html',
        {root : __dirname + '../../../../../localfs'});
});

module.exports = router;