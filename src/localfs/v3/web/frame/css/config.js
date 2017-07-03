window.ThemeConfig = 
{
	name: "green",
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
                ColorThreshold: "#f88e98",
                Color: "#90c35c",
                backgroundColor : "#fff",
    		    bgColor: "#f2ffe5"  
            }
        },
        Resource:
        {
            Pie:
            {
                Color: "#5fcbf1",
                backgroundColor : "#fff"
            },
            Area:
            {
                color: "#5fcbf1",
                XlineStyle_Color : "#e6e6e6",
                YlineStyle_Color : "#e6e6e6"
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
                    Color: "#5fcbf1",
                    backgroundColor : "#fff",
        		    bgColor: "#e0f9fe"  
                },
                Area:
                {
                    color: "#5fcbf1",
                    XlineStyle_Color : "#c2c2c2",
                    YlineStyle_Color : "#c2c2c2",
                    XAxis_axisLabel_Color : "#000"
                }
            },
            Memory:
            {
                Pie:
                {
                    Color: "#8ec65b",
                    backgroundColor : "#fff",
        		    bgColor: "#f2ffe5"  
                },
                Area:
                {
                    color: "#8ec65b",
                    XlineStyle_Color : "#c2c2c2",
                    YlineStyle_Color : "#c2c2c2",
                    XAxis_axisLabel_Color : "#000"
                }
            }           
            
        }
	},
	Syslog:
	{
        Bar:
        {
            grid_backgroundColor: "#e5e8e8",
		    Axis_textStyle_color: "#000",
            Axis_splitLine_lineStyle_color: "#d2d5e8"
        }
	},
	init: function ()
	{
        // set MyConfig
        $.extend(MyConfig.MList, {
            ROW_MARGIN: 20, // padding-top and padding-bottom of ".slick-cell"
            rowHeight: 18,
            pageBar: true,
            statusBar: true
        });
	}
}
