;(function($)
{
    var UTILNAME = "Ip";

    function isLocalIpv6(sIp)
    {
        if(isIpv6(sIp))
        {
            var aIpv6 = ipv6ToIntArry(sIp);
            if (aIpv6 && (aIpv6[0] == 0xfe) && ((aIpv6[1] & 0xc0) == 0x80))
            {
                return true;
            }
        }
        
        return false;
    }

    function ipv6ToIntArry(sSrc)
    {
        var NS_IN6ADDRSZ = 16;
        var NS_INT16SZ = 2;
        var NS_INADDRSZ = 4;
        var iLen = 0;
        var sCh = null;
        var iCurTok = 0;
        var sDigits = "0123456789abcdef";
        sSrc = sSrc.toLowerCase();

        if (sSrc[iLen] == ":" && sSrc[++iLen] != ":")
        {
            return null;
        }

        iCurTok = iLen;
        var iVal = 0;
        var iSeen_xdigits = 0;
        var aDest = [];
        var iDestCur = 0;
        var iDestMax = NS_IN6ADDRSZ;
        var iColonp = 0;

        while (iLen < sSrc.length)
        {
            sCh = sSrc[iLen];
            iLen++;

            var iChVal = sDigits.indexOf(sCh);
            if (iChVal != -1)
            {
                iVal <<= 4;
                iVal |= iChVal;
                if (++iSeen_xdigits > 4) {
                    return null;
                }
                continue;
            }

            if (sCh == ':')
            {
                iCurTok = iLen;
                if (0 == iSeen_xdigits) 
                {
                    if (0 != iColonp) 
                    {
                        return null;
                    }
                    iColonp = iDestCur;
                    continue;
                }
                else if (iLen == sSrc.length)
                {
                    return null;
                }
                else
                {
                }

                if (iDestCur + NS_INT16SZ > iDestMax)
                {
                    return null;
                }
                aDest[iDestCur++] = (iVal >> 8) & 0xff;
                aDest[iDestCur++] = iVal & 0xff;

                iSeen_xdigits = 0;
                iVal = 0;
                continue;
            }

            var sIPv4 = sSrc.substring(iCurTok);
            var aIpv4 = ipv4ToIntArry(sIPv4);
            if (sCh == '.' && ((iDestCur + NS_INADDRSZ) <= iDestMax) && aIpv4 != null)
            {
                $.merge(aDest, aIpv4);
                iDestCur += NS_INADDRSZ;
                iSeen_xdigits = 0;
                break;
            }
            return null;
        }

        if (0 != iSeen_xdigits)
        {
            if (iDestCur + NS_INT16SZ > iDestMax)
            {
                return null;
            }
            aDest[iDestCur++] = (iVal >> 8) & 0xff;
            aDest[iDestCur++] = iVal & 0xff;
        }

        if (iColonp != 0)
        {
            var n = iDestCur - iColonp;

            if (iDestCur == iDestMax)
            {
                return null;
            }

            for (var i = 1; i <= n; i++)
            {
                aDest[iDestMax - i] = aDest[iColonp + (n - i)];
                aDest[iColonp + (n - i)] = 0;
            }
            iDestCur = iDestMax;
        }

        if (iDestCur != iDestMax)
        {
            return null;
        }

        return aDest;
    }

    function ipv4ToIntArry(sSrc)
    {
        var aIntIp = [];
        var aSrc = sSrc.split(".");

        if (aSrc.length != 4)
        {
            return null;
        }

        for (var i = 0; i < 4; i++)
        {
            var iInt = parseInt(aSrc[i]);
            if (iInt != NaN && iInt < 255)
            {
                aIntIp[i] = iInt;
            }
            else
            {
                return null;
            }
        }
        return aIntIp;
    }

    function isIp(sValue)
    {
        return (isIpv4(sValue) || isIpv6(sValue));
    }

    function isIpv4(sValue)
    {
        return /^((25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)\.){3}(25[0-5]|2[0-4][0-9]|1\d\d|[1-9]\d|\d)$/.test(sValue);
    }

    function isIpv6(sValue)
    {
        var bOK;
        var aIp = sValue.split("::");
        if(aIp.length > 2)
        {
            return false;
        }

        if(aIp.length == 1)
        {
            var reg = (-1!=sValue.indexOf('.'))
                ? /^([a-fA-F0-9]{1,4}:){6}(((25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)\.){3}(25[0-5]|2[0-4][0-9]|1\d\d|[1-9]\d|\d))$/
                : /^([a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}$/;
            return reg.test(sValue);
        }

        var sLeft = (""==aIp[0]) ? "0" : aIp[0];
        var sRight = (""==aIp[1]) ? "0" : aIp[1];
        var sIp = sLeft + ":" + sRight;
        var reg = (-1!=sRight.indexOf('.'))
            ? /^([a-fA-F0-9]{1,4}:){1,5}(((25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)\.){3}(25[0-5]|2[0-4][0-9]|1\d\d|[1-9]\d|\d))$/
            : /^([a-fA-F0-9]{1,4}:){1,6}[a-fA-F0-9]{1,4}$/;
        return reg.test(sIp);
    }

    var oIp = {
    	isLocalIpv6 : isLocalIpv6,
        isIpv6 : isIpv6,
        isIpv4 : isIpv4,
        isIp : isIp
    };

    Utils.regUtil(UTILNAME, oIp, {"widgets": [], "utils":[]});
})(jQuery);