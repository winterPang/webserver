
function showMemUsed(str)
{
    var memuse = process.memoryUsage();
    console.log("[Show Memory]:");
    console.log(str);
    console.log(JSON.stringify(memuse));
}

if (global.gc)
{
    console.log("[Memory gc]open auto gc.");
    setInterval(function(){
        try{
            var memuse = process.memoryUsage();
            if (memuse.heapUsed < 800*1000*1000)
            {
                console.log("heapUsed: %s less than 800M. ignore gc.", memuse.heapUsed);
                return;
            }

            console.log("[Show Memory]:");
            console.log("before gc");
            console.log(JSON.stringify(memuse));
            global.gc();
            memuse = process.memoryUsage();
            console.log("[Show Memory]:");
            console.log("after gc");
            console.log(JSON.stringify(memuse));
        }
        catch(err)
        {
            console.log("gc failed : %s", JSON.stringify(err));
        }
    }, 600000);
}