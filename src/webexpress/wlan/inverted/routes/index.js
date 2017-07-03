var express = require('express');
var router  = express.Router();

router.use('/', function(req,res,next) {
    console.log('access inverted...');
    console.log('should be never accessed');
    res.end();
});

module.exports = router;