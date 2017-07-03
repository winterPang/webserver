/**
 * Created by Administrator on 2016/3/1.
 */
$(function($F){
        var _oCheckTypes = {
            "text" : checkEleText,
            "string" : checkEleStr,
            "tel" : checkEleTel,
            "estring" : checkEleEStr,
            "istring" : checkEleIStr,
            "namestring": checkNameString,
            "astring" : checkEleAStr, // a string start with a-zA-Z
            "digits" : checkEleDigits,
            "ip" : checkEleIp,
            "ipv4" : checkEleIpv4,
            "ipv6" : checkEleIpv6,
            "mac" : checkEleMac,
            "mask" : checkEleMask,
            "mask6" : checkEleMask6,
            "email" : checkEleEmail,
            "url" : checkEleUrl,
            "vlanlist": checkVlanlist,
            "time": checkTime,
            "date": checkDate,
            "hexa":checkHexa,
            "anumber": checkANumber
        };
    var Validator=
    {
        required: "该参数必须配置。",
        url: "参数输入错误。",
        date: "参数输入错误。",
        number: "参数输入错误。",
        ip:"请输入正确的IPv4或者IPv6地址。",
        ipv4:"IPv4地址输入错误。",
        ipv6:"IPv6地址输入错误。",
        mask:"IPv4地址掩码输入错误。",
        text: "不能以空格或制表符开头，且不能包含“？”。",
        string: "不能包含“?”。",
        nulls:"参数不能为空格",
        tel:"电话号码错误",
        astring: "输入参数必须以字母开头。",
        mac: "MAC地址输入错误。",
        digits: "请输入整数。",
        vlanlist: "参数输入错误。",
        equalTo: "参数输入错误。",
        maxlength: "参数输入错误。",
        minlength: "参数输入错误。",
        rangelength: "参数输入错误。",
        range: "参数输入错误。",
        max: "参数输入错误。",
        min: "参数输入错误。",
        except: "输入参数不能包含%s。",
        defmsg: "参数输入错误。",
        chinesexist: "参数长度错误，1个汉字或中文符号需要占用2个字符空间，请确认输入字符是否超出长度限制。",
        Tip:
        {
            strRange:"%s－%s个字符",
                intRange:"%s－%s"
        }
    };
        function setErrorStr (jEle, sErrStr, aParas)
        {
            var jErr;
            var jForm = jEle.closest("form");
            var sErrId = jEle.attr("errid") || (jEle.attr("id")+"_error");
            var sErrMsg = jEle.attr("errMsg") || sErrStr;

            sErrId = sErrId.replace(/\./g, "\\.");
            jErr = ('_' == sErrId[0]) ? false : jForm.find("#"+sErrId);

            if ("_pop" == sErrId)
            {
            }

            if (sErrMsg)
            {
                // show error
                jEle.addClass("text-error");
                jErr && jErr.text(sErrMsg).show();
            }
            else
            {
                // no error
                jEle.removeClass("text-error");
                jErr && jErr.empty().hide();
            }
            return;
        }

        function getByteLength(sValue)
        {
            return sValue.replace(/[^\x00-\xff]/g,"**").length;
        }

        function isIp4Addr(sValue)
        {
            return /^((25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)\.){3}(25[0-5]|2[0-4][0-9]|1\d\d|[1-9]\d|\d)$/.test(sValue);
        }

        function isIp6Addr(sValue)
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

        function checkEleByRegx (jEle, oRegx, aParas)
        {
            var pfCustomCheck = jEle.data("checkValue");
            if (pfCustomCheck)
            {
                if (false === pfCustomCheck.apply(jEle[0]))
                {
                    return "string";
                }
            }

            var sValue = getJEleValue(jEle);
            if (!oRegx.test(sValue))
            {
                return "string";
            }
            if ($.trim(sValue) == "")
            {
                return "nulls";
            }

            var nStrLen = getByteLength(sValue);

            var iMaxLen = jEle.attr("maxLength");
            if (nStrLen > iMaxLen)
            {
                aParas.push(iMaxLen);
                return "max";
            }

            var iMinLen = jEle.attr("min");
            if (nStrLen < iMinLen)
            {
                aParas.push(iMinLen);
                return "min";
            }

            var sExcept = jEle.attr("except") || jEle.attr("exclude");
            if(sExcept)
            {
                // ignore case
                if("true" != jEle.attr("case"))
                {
                    sValue = sValue.toLowerCase();
                }
                if(-1 != $.inArray(sValue, sExcept.split(",")))
                {
                    aParas.push(sExcept);
                    return "except";
                }
            }

            var sPattern = jEle.attr("pattern");
            if (sPattern)
            {
                try{
                    oRegx = new RegExp(sPattern);
                    if (!oRegx.test(sValue))
                    {
                        return "string";
                    }
                }
                catch(e)
                {
                    Frame.Debuger.info("catch: " + sPattern)
                }
            }

            return null;
        }

        // String: "^[^?&#x09;&#x0d;&#x0a;]*$"
        // 不能有‘？’和Tab键字符,不支持\r\n；支持转义。
        function checkEleStr(jEle, aParas)
        {
            var oRegx = /^[^?	\r\n]*$/;
            return checkEleByRegx (jEle, oRegx, aParas);
        }

        // String: "^[^?&#x09;&#x0d;&#x0a;]*$"
        // 不能有‘？’和Tab键字符,不支持\r\n；支持转义。
        function checkEleTel(jEle, aParas)
        {
            var oRegx = /^[0-9]{11}$/;//正则表达式
            var sValue = getJEleValue(jEle);
            if (!oRegx.test(sValue))
            {
                return "tel";
            }
            var nStrLen = getByteLength(sValue);
            var iMaxLen = jEle.attr("maxLength");
            if (nStrLen > iMaxLen)
            {
                aParas.push(iMaxLen);
                return "max";
            }

            var iMinLen = jEle.attr("min");
            if (nStrLen < iMinLen)
            {
                aParas.push(iMinLen);
                return "min";
            }
            return null;
        }
        // EString: "^[^?]*$"
        function checkEleEStr(jEle, aParas)
        {
            var oRegx = /^[^?]*$/;
            return checkEleByRegx (jEle, oRegx, aParas);
        }

        // IString: "^[^?&#x09;&#x0d;&#x0a;][^&#x09;&#x0d;&#x0a;]*$"
        // 可以有‘？’字符；但头一个字符不能是'?', 不能有Tab键、回车、换行字符；不支持转义
        function checkEleIStr(jEle, aParas)
        {
            var oRegx = /^[^?	\r\n][^	\r\n]*$/;
            return checkEleByRegx (jEle, oRegx, aParas);
        }

        // ^([^?&#x09;&#x0d;&#x0a;|&gt;]|[^?&#x09;&#x0d;&#x0a;&gt;]{2,2}|[^?&#x09;&#x0d;&#x0a;]{3,})$
        // 不能有‘？’和Tab键字符,不支持\r\n；支持转义。不能为> >> |
        function checkNameString(jEle, aParas)
        {
            var oReg = /^([^?\t\r\n|>]|[^?\t\r\n>]{2,2}|[^?\t\r\n]{3,})$/;
            var sValue = getJEleValue(jEle);

            if (!oReg.test(sValue))
            {
                return "namestring";
            }

            return checkEleStr(jEle, aParas);
        }

        // Text: "^([^?&#x09;&#x0d;&#x0a; ][^?&#x09;&#x0d;&#x0a;]*[^?&#x09;&#x0d;&#x0a; ]|[^?&#x09;&#x0d;&#x0a; ])$"
        // 不能有‘？’、Tab键、回车、换行字符；不支持转义,首尾不能为空格。
        function checkEleText(jEle, aParas)
        {
            var oReg = /^([^ ?	\r\n][^?\r\n]*[^ ?	\r\n]|[^?	 \r\n])$/;
            var sValue = getJEleValue(jEle);
            var iMaxLen = jEle.attr("maxLength");

            if (!oReg.test(sValue))
            {
                return "text";
            }

            if (getByteLength(sValue) > iMaxLen)
            {
                aParas.push(iMaxLen);
                return "max";
            }
            return null;
        }
        // 支持hh:mm:ss、 hh:mm、 mm:ss 三种格式的时间输入，默认hh:mm
        function checkTime (jEle)
        {
            var sValue = $.trim(getJEleValue(jEle));
            var sDateFmt = jEle.attr("dateFmt");
            if (("hh:mm:ss" == sDateFmt) && (/^(?:(?:[0-2][0-3])|(?:[0-1][0-9])|(?:[0-9])):(?:(?:[0-5][0-9])|(?:[0-9])):(?:(?:[0-5][0-9])|(?:[0-9]))$/.test(sValue)))
            {
                return null;
            }
            else if(("mm:ss" == sDateFmt) && (/^(?:(?:[0-5][0-9])|(?:[0-9])):(?:(?:[0-5][0-9])|(?:[0-9]))$/.test(sValue)))
            {
                return null;
            }
            if(/^(?:(?:[0-2][0-3])|(?:[0-1][0-9])|(?:[0-9])):(?:(?:[0-5][0-9])|(?:[0-9]))$/.test(sValue))
            {
                return null;
            }
            return "time";
        }
        // 支持YYYY-MM-DD、 YYYY-MM、 MM-DD 三种格式的日期输入，默认YYYY-MM-DD
        function checkDate(jEle)
        {
            var a, y, m, d;
            var sValue = $.trim(getJEleValue(jEle));
            var sDateFmt = jEle.attr("dateFmt");

            // YYYY-MM
            if ("YYYY-MM" == sDateFmt)
            {
                if (!/^[0-9]{4}-[0-9]{2}$/.test(sValue))
                {
                    return "date";
                }
                a = sValue.split ('-');
                y=parseInt(a[0],10), m=parseInt(a[1],10), d=1;
            }

            // MM-DD
            else if ("MM-DD" == sDateFmt)
            {
                if (!/^[0-9]{2}-[0-9]{2}$/.test(sValue))
                {
                    return "date";
                }
                a = sValue.split ('-');
                y=2014, m=parseInt(a[0],10), d=parseInt(a[1],10);
            }

            // YYYY-MM-DD
            else if ("YYYY-MM-DD" == sDateFmt)
            {
                if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(sValue))
                {
                    return "date";
                }
                a = sValue.split ('-');
                y=parseInt(a[0],10), m=parseInt(a[1],10), d=parseInt(a[2],10);
            }

            // YYYY/MM
            else if ("YYYY/MM" == sDateFmt)
            {
                if (!/^[0-9]{4}\/[0-9]{2}$/.test(sValue))
                {
                    return "date";
                }
                a = sValue.split ('/');
                y=parseInt(a[0],10), m=parseInt(a[1],10), d=1;
            }

            // MM/DD
            else if ("MM/DD" == sDateFmt)
            {
                if (!/^[0-9]{2}\/[0-9]{2}$/.test(sValue))
                {
                    return "date";
                }
                a = sValue.split ('/');
                y=2014, m=parseInt(a[0],10), d=parseInt(a[1],10);
            }

            // default format is "YYYY/MM/DD"
            else
            {
                if (!/^[0-9]{4}\/[0-9]{2}\/[0-9]{2}$/.test(sValue))
                {
                    return "date";
                }
                a = sValue.split ('/');
                y=parseInt(a[0],10), m=parseInt(a[1],10), d=parseInt(a[2],10);
            }

            if (y<0 || m<1 || m>12 || d<1 || d>31)
            {
                return "date";
            }

            // check range
            var min = jEle.attr("min")||"0000-01-01";
            var max = jEle.attr("max")||"2035-12-31";
            var sCmpDate = sValue.replace(/\//g,'-');
            if ((min&&(sCmpDate<min)) || (max&&(sCmpDate>max)))
            {
                return "date";
            }

            return null;
        }

        function checkVlanlist(jEle)
        {
            function getVlanId(sValue)
            {
                if (! /0|[0-9]+/.test(sValue))
                {
                    return false;
                }

                var nVal = parseInt(sValue);
                if (nVal<iMin || nVal>iMax)
                {
                    return false;
                }

                return nVal;
            }
            var sValue = $.trim(getJEleValue(jEle));

            if (!(/^(([1-9][0-9]{0,2})|([1-3][0-9]{3})|([4][0][0-8][0-9])|([4][0][9][0-4]))((,|-)(([1-9][0-9]{0,2})|([1-3][0-9]{3})|([4][0][0-8][0-9])|([4][0][9][0-4]))){0,}$/i.test(sValue)))
            {
                return "vlanlist";
            }

            var aVlans = sValue.split(',');
            var iMin = parseInt(jEle.attr("min")) || 0;
            var iMax = parseInt(jEle.attr("max")) || 4094;
            var Flag = null;
            for (var i = 0; i <aVlans.length; i++)
            {
                var aListTemp=aVlans[i].split("-");
                var nLen = aListTemp.length;
                var nVlanId1 = iMin, nVlanId2 = iMax;

                if(nLen > 2)
                {
                    Flag = "vlanlist";
                    break;
                }

                nVlanId1 = getVlanId(aListTemp[0]);
                if(2 == nLen)
                {
                    nVlanId2 = getVlanId(aListTemp[1]);
                }

                if ((false===nVlanId1) || (false===nVlanId2) || (nVlanId1>nVlanId2))
                {
                    Flag = "vlanlist";
                    break;
                }
            }

            jEle.val(sValue);
            return Flag;
        }

        function checkEleAStr(jEle, aParas)
        {
            var oReg = /^[a-zA-Z]/;
            var sValue = getJEleValue(jEle);
            var sError = "";

            if (!oReg.test(sValue))
            {
                return "astring";
            }

            return checkEleStr(jEle, aParas);
        }

        function checkEleDigits(jEle, aParas)
        {
            var sValue = $.trim(jEle.val());
            var iMin = parseInt(jEle.attr("min"));
            var iMax = parseInt(jEle.attr("max"));

            if(/^0+$/.test(sValue))
            {
                sValue = "0";
            }

            if(!(("0" == sValue) ? true : /^[0-9]+$/.test(sValue)))
            {
                return "digits";
            }

            var iValue = parseInt(sValue);
            if(!isNaN(iMin) && (iValue < iMin))
            {
                aParas.push(iMin);
                return "min";
            }
            if(!isNaN(iMax) && (iValue > iMax))
            {
                aParas.push(iMax);
                return "max";
            }

            jEle.val(sValue);
            return null;
        }

        function checkEleIp(jEle)
        {
            sValue = $.trim(getJEleValue(jEle));

            if (!isIp4Addr(sValue) && !isIp6Addr(sValue))
            {
                return "ip";
            }

            jEle.val(sValue);
            return null;
        }

        function checkEleIpv4(jEle)
        {
            var sValue = $.trim(getJEleValue(jEle));

            if (!isIp4Addr(sValue))
            {
                return "ipv4";
            }

            jEle.val(sValue);
            return null;
        }

        function checkEleIpv6(jEle)
        {
            var sValue = $.trim(getJEleValue(jEle));

            if (!isIp6Addr(sValue))
            {
                return "ipv4";
            }

            jEle.val(sValue);
            return null;
        }

        function checkEleMac(jEle)
        {
            var sValue = $.trim(getJEleValue(jEle));

            if (!(/^([0-9a-f]{1,2}-){5}[0-9a-f]{1,2}$/i.test(sValue)))
            {
                return "mac";
            }

            jEle.val(sValue);
            return null;
        }

        function checkEleMask(jEle)
        {
            function transMaskNum(sIntValue)
            {
                for (var sIpStr in aMask)
                {
                    if (aMask[sIpStr] == sIntValue)
                    {
                        return sIpStr;
                    }
                }
                return null;
            }

            if (jEle.is(".focus"))
            {
                return;
            }

            var sMaskStr = $.trim(getJEleValue(jEle));
            var aMask = {
                "0.0.0.0": "0",
                "128.0.0.0": "1", "255.128.0.0": "9", "255.255.128.0": "17", "255.255.255.128": "25",
                "192.0.0.0": "2", "255.192.0.0": "10", "255.255.192.0": "18", "255.255.255.192": "26",
                "224.0.0.0": "3", "255.224.0.0": "11", "255.255.224.0": "19", "255.255.255.224": "27",
                "240.0.0.0": "4", "255.240.0.0": "12", "255.255.240.0": "20", "255.255.255.240": "28",
                "248.0.0.0": "5", "255.248.0.0": "13", "255.255.248.0": "21", "255.255.255.248": "29",
                "252.0.0.0": "6", "255.252.0.0": "14", "255.255.252.0": "22", "255.255.255.252": "30",
                "254.0.0.0": "7", "255.254.0.0": "15", "255.255.254.0": "23", "255.255.255.254": "31",
                "255.0.0.0": "8", "255.255.0.0": "16", "255.255.255.0": "24", "255.255.255.255": "32"
            };

            var nMaskLen = parseInt (sMaskStr);
            if (nMaskLen == sMaskStr)
            {
                // integer, trans to mask string(255.255.255.0)
                sMaskStr = transMaskNum(nMaskLen);
                if (!sMaskStr)
                {
                    return "mask";
                }
            }

            // invalidate format
            if (!aMask[sMaskStr])
            {
                return "mask";
            }

            var nMax = jEle.attr("max")||32;
            var nMin = jEle.attr("min")||0;

            nMaskLen = parseInt (aMask[sMaskStr]);
            if ( (nMaskLen>nMax) || (nMaskLen<nMin))
            {
                return "mask";
            }

            jEle.val(sMaskStr);
            return null;
        }

        function checkEleMask6(jEle)
        {
            var aParas = [];
            var sRet = null;

            jEle.attr("min", 1);
            jEle.attr("max", 128);
            if (checkEleDigits(jEle, aParas))
            {
                sRet = "mask6";
            }

            return sRet;
        }

        function checkEleEmail(jEle)
        {
            var sValue = $.trim(getJEleValue(jEle));
            if (!(/^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$/.test(sValue)))
            {
                return "email";
            }

            return null;
        }

        function checkEleUrl(jEle)
        {
            var sValue = $.trim(getJEleValue(jEle));
            if (!(/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(sValue)))
            {
                return "url";
            }

            return null;
        }

        function checkANumber(jEle, aParas)
        {
            var sValue = $.trim(getJEleValue(jEle));
            if (!(/^[a-zA-Z0-9]+$/i.test(sValue)))
            {
                return "anumber";
            }

            return checkEleStr(jEle, aParas);
        }

        function checkHexa(jEle, aParas)
        {
            var sValue = $.trim(getJEleValue(jEle));
            if (!(/^[a-fA-F0-9]+$/i.test(sValue)))
            {
                return "hexa";
            }

            return checkEleStr(jEle, aParas);
        }

        function checkEleByType(sType, jEle)
        {
            var pfCheck = _oCheckTypes[sType];
            var bRight = true;
            if (pfCheck)
            {
                var aParas = [];
                var sErrType = pfCheck(jEle, aParas);
                if(null != sErrType)
                {
                    bRight = false;
                    sErrType = "defmsg";
                    setErrorStr(jEle, $.MyLocale.Validator[sErrType], aParas);
                }
            }
            return bRight;
        }

        function checkEle(jEle)
        {
            var bRight = true;
            var oValue = getJEleValue(jEle);
            var sError = "";

            var validateEle = function(pfCheck, jEle)
            {
                var bRight = true;
                var aParas = [];
                var sErrType = pfCheck(jEle, aParas);
                if(null != sErrType)
                {
                    bRight = false;
                    var sMsg = Validator[sErrType];
                    setErrorStr(jEle, sMsg, aParas);
                }

                return bRight;
            }

            if (jEle.attr("ctrl"))
            {
                if (!jEle.is(":visible"))
                {
                    return true;
                }
            }
            else
            {
                if (jEle.attr("disabled") || jEle.attr("readonly") || !jEle.is(":visible") || jEle.attr("nocheck"))
                {
                    return true;
                }
            }

            if (jEle.hasClass("required") && !oValue)
            {
                sError =  Validator["required"]; // "This field is required.";
                setErrorStr (jEle, sError);
                return false;
            }

            if (!oValue)
            {
                setErrorStr (jEle, "");
                return true;
            }

            var sCtrlName = jEle.attr("ctrl");
            if(sCtrlName)
            {
                bRight = (jEle.data(sCtrlName)["check"]) ? jEle[sCtrlName]("check") : true;
            }
            else
            {
                for (var sKey in _oCheckTypes)
                {
                    if (jEle.hasClass(sKey))
                    {
                        bRight = validateEle(_oCheckTypes[sKey], jEle);
                        break;
                    }
                }
            }

            if (bRight)
            {
                setErrorStr (jEle, "");
            }
            return bRight;
        }

        function getJEleValue(jEle)
        {
            var oValue = null;
            var jObj = jEle;
            var bHidden = true;

            if (!jObj.length)
            {
                var sEleName = jEle.selector.split("#")[1];
                jObj = $("[name='" + sEleName + "']");
                if (!jObj.length)
                {
                    return oValue;
                }
            }

            for (var i = 0, j = jObj.length; i < j; i++)
            {
                var jTem = $(jObj.get(i));
                if (!jTem.is(":hidden") || jTem.is("input[type=hidden]") || jTem.attr("allowgetvalue") == "true")
                {
                    bHidden = false;
                    break;
                }
            }

            if (bHidden == true)
            {
                return oValue;
            }

            var sCtrlName = jObj.attr("ctrl");
            if (sCtrlName)
            {
                oValue = jObj[sCtrlName]("value");
            }
            else if (jObj.is("input[type='radio']"))
            {
                oValue = jObj.filter("[checked]").val();
            }
            else if (jObj.is("input[type='checkbox']"))
            {
                oValue = jObj[0].checked + "";
            }
            else
            {
                oValue = jObj[0].value;
            }

            return oValue;
        }

        function setJEleValue(jEle, oValue)
        {
            var iRet = 1;
            var jObj = jEle;

            if (!jObj.length)
            {
                var sEleName = jEle.selector.split("#")[1];
                jObj = $("[name='" + sEleName + "']");
                if (!jObj.length)
                {
                    return iRet;
                }
            }

            if (jObj)
            {
                if(jObj.attr("ctrl"))
                {
                    jObj[jObj.attr("ctrl")]("value", oValue);
                }
                else if(jObj.is("input[type='checkbox']"))
                {
                    //jObj.attr("checked", "true"==oValue);
                    //jObj.change();
                    jObj.MCheckbox("setState","true"==oValue);
                }
                else if(jObj.is("input[type='radio']"))
                {
                    //now use minput radio
                    //jObj.filter("[value=" + oValue + "]").attr("checked", true);
                    jObj.MRadio("setValue",oValue,true);
                }
                else
                {
                    jObj.val(oValue);
                    jObj.change();
                }
                iRet = 0;
            }
            return iRet;
        }

        function autoCheckForm(jForm)
        {
            function removeDisable(jForm)
            {
                var parent = jForm.parent();
                if($(".text-error",jForm)&&$(".text-error",jForm).length>0){
                    $(".btn-primary",parent.next()).attr("disabled","disabled");
                    return false;
                }
                $(".btn-primary",parent.next()).removeAttr("disabled");
            }

            $("input, select, [ctrl]", jForm).bind("focusout", function (evetn)
            {
                checkEle($(this));
                return;
            });
            $(".singleSelect",jForm).bind("change",function(){
                checkEle($(this));
                return;
            })

            //enable apply button
            //radio checkbox select
            $("input:[type='radio'], input:[type='checkbox'], select,.port-list", jForm).on("change.form",function(){
                removeDisable(jForm);
            });

            //edittable
            $(".edittable", jForm).bind("myRemove",function(){
                removeDisable(jForm);
            });
            $(".datewidget").bind("changeDate",function(){
                removeDisable(jForm);
            });

            //input textarea
           /* $("input ,textarea", jForm).live("keyup",function(){
                removeDisable(jForm);
            });*/
           /* $(".btn-primary", jForm.parent().next()).bind("click",function(){
                removeDisable(jForm);
            });*/

          /*  //file
            $("input[type='file'],input.typehead", jForm).change(function(){
                removeDisable(jForm);
            })*/

        }

        var oWidget = {
            getJEleValue : getJEleValue,
            setJEleValue : setJEleValue,
            checkEleByType : checkEleByType,
            checkEle : checkEle,
            setError : setErrorStr,
            autoCheckForm : autoCheckForm
        };

        $F.oWidget=oWidget;
}(Frame))