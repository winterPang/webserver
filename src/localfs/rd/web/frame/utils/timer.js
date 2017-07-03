;(function($)
{
    var UTILNAME = "Timer";
    var _oTimerManger = new timeManger();

    function createLoopTimer(sName, iTime, pfCallBack, oPara)
    {
        return new timer(sName, iTime, true, pfCallBack, oPara);
    }

    function createNonLoopTimer(sName, iTime, pfCallBack, oPara)
    {
        return new timer(sName, iTime, false, pfCallBack, oPara);
    }

    function timeManger()
    {
        var oTimers = {};
        this.addTimer = addTimer;
        this.delTimer = delTimer;

        function addTimer(sName, oTimer)
        {
            oTimers[sName] = oTimer;
        }

        function delTimer(sName)
        {
            oTimers[sName] = null;
        }

        function getTimer(sName)
        {
            return sName in oTimers ? oTimers[sName] : null;
        }
    }

    function timer(sName, iTime, bLoop, pfCallBack, oPara)
    {
        this.destroy = destroy;

        var oTimer = setTimeout(callBack, iTime);
        _oTimerManger.addTimer(sName, oTimer);

        Frame.Debuger.info("Timer create: " + sName);

        function callBack()
        {
            if(!bLoop && oTimer)
            {
                destroy (oTimer);
            }
            pfCallBack(oPara);
            oTimer = setTimeout(callBack, iTime);
            _oTimerManger.addTimer(sName, oTimer);
        }

        function destroy ()
        {
            clearTimeout(oTimer);
            _oTimerManger.delTimer(sName, oTimer);
            Frame.Debuger.info("Timer destroy: " + sName);
        }
    }

    var _oTimer = {
        createLoopTimer : createLoopTimer,
        createNonLoopTimer : createNonLoopTimer
    };

    Utils.regUtil(UTILNAME, _oTimer, {"widgets": [], "utils":[]});
})(jQuery);