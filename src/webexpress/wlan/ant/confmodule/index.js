var user = require('wlanpub').user;
var router  = require('express').Router();
var devlogProc = require('./devlog');

const LOG_HEAD = "[CONFMODULE]";

var methodMap = {
	getdevlogstatus: devlogProc.getConfiguration,
	setdevlogstatus: devlogProc.setConfiguration
};

router.post("/:method", function(req, res, next)
{
	console.log(LOG_HEAD, "router come in," , req.body);
	try{
		checkPermission(req, res, function(){
			if(!methodMap[req.params.method])
			{
				res.json({retCode:1, message:"method error"});
				res.end();
				return;
			}
			methodMap[req.params.method](req.body, function(doc){
				console.log(LOG_HEAD, "router come finish," , doc);
				res.json(doc);
				res.end();
			});		
		});
	}
	catch(e)
	{
		console.error(LOG_HEAD, "catch error!");
		res.json({retCode : -1, message : e.name});
		res.end();
	}
});

function checkPermission(req, res, cb)
{
	if(!req.body || !req.body.devSN || !req.cookies || !req.session)
	{
		res.json({retCode:1, message:"permission param error"});
		res.end();
		return;
	}

	user.getDevPermission(req.cookies, req.session, req.body.devSN, function(oResult, retCode){
		if(!retCode && oResult.permission && oResult.permission.MONITOR_EXEC) {
			cb();
		}
		else
		{
			res.json({retCode:1, message:"permission deny"});
			res.end();
			return;
		}
	});
	
	// cb();
}
module.exports = router;