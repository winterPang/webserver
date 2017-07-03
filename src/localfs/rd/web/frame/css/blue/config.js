window.ThemeConfig = 
{
	name: "blue",
	ver: "1.0.0",
	Plot:
	{
		bgColor: "rgba(225,243,253,1)",
		maxPoint: 100,
		width: 250
	},
	Sysinfo:
    {
        Utilization:
        {
            Pie:
            {
                Color: "#b5e583",
                ColorThreshold: "#f88e98",
                backgroundColor : "transparent",
    		    bgColor: "#f3ffe7"  
            }
        },
        Resource:
        {
            Pie:
            {
                Color: "#5fcbf1",
                backgroundColor : "transparent"
            },
            Area:
            {
                color: "#5fcbf1",
                XlineStyle_Color : "#294b79",
                YlineStyle_Color : "#294b79"
            }            
        }
	},
	Context:
    {
        Usage:
        {
            CPU:
            {
                Pie:
                {
                    Color: "#5fcbf0",
                    backgroundColor : "transparent",
        		    bgColor: "#f3ffe7"  
                },
                Area:
                {
                    color: "#5fcbf0",
                    XlineStyle_Color : "rgba(255,255,255,0.1)",
                    YlineStyle_Color : "rgba(255,255,255,0.1)",
                    XAxis_axisLabel_Color : "#abbbde"
                }
            },
            Memory:
            {
                Pie:
                {
                    Color: "#b5e583",
                    backgroundColor : "transparent",
        		    bgColor: "#f3ffe7"  
                },
                Area:
                {
                    color: "#b5e583",
                    XlineStyle_Color : "rgba(255,255,255,0.1)",
                    YlineStyle_Color : "rgba(255,255,255,0.1)",
                    XAxis_axisLabel_Color : "#abbbde"
                }
            }           
            
        }
	},
	Syslog:
	{
        Bar:
        {
            grid_backgroundColor: "rgba(0,0,0,0.1)",
		    Axis_textStyle_color: "#abbbde",
            Axis_splitLine_lineStyle_color: "rgba(255,255,255,0.1)"
        }
	},
	MList:
	{
	},
	init: function ()
	{
        var k = 0;
		var jTheme = $("#themestatus");
		var hTimer = setInterval(function()
		{
			var sName = "blue";
            if ((sName != ThemeConfig.name) || (k++ > 200))
            {
                // theme has changed
                clearInterval(hTimer);
            }

			if ("#abcdef" == Frame.Util.getHexColor(jTheme.css("color")))
			{
				// ready
				clearInterval(hTimer);
				Frame.Theme.onChanged (sName);
			}
		}, 20);
	}
}
