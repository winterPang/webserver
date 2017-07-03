define('angularAMD',function(angularAMD) {
	// body...
	angularAMD.("myCache", function($cacheFactory){
        return $cacheFactory("me");
    })
})