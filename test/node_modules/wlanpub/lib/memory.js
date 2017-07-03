var config     = require('config');
var fs         = require('fs');
var heapdump;
var memwatch;
var memoryConfig;
var heapdumpConfig;
var memwatchConfig;

if (config.has('memoryConfig')) {
    memoryConfig = config.get('memoryConfig');
    heapdumpConfig = memoryConfig.heapdump;
    memwatchConfig = memoryConfig.memwatch;

    if(heapdumpConfig == true)
    {
        heapdump = require('heapdump');
    }

    if(memwatchConfig == true)
    {
        memwatch = require('memwatch-next');
        memwatch.on('stats',function(stats){
            console.log('memory stats:');
            console.log(stats);
        });
        memwatch.on('leak',function(info){
            console.warn('memory leak:');
            console.warn(info);
        });
    }
}

module.exports.memoryConfig = memoryConfig;
module.exports.heapdump = heapdump;
module.exports.memwatch = memwatch;
