
function onPageInit()
		{
			onInitContent();

			$("#text").keyup(function(){
						
				$("#password").val($("#text").val());					
						
			});
		}

		
		function onInitContent()
		{
			function changeAdImg()
			{
				bFlag++;
				var jAdList = $('#adPanel ul');
				var jItem = $('li',jAdList);
				var nLeft = jAdList.css('left').replace("px","")*1;
				nLeft -= jItem.width();
				jAdList.animate({left:nLeft},400,function(e){
					var jFirst = $('li',this).first();
					if (jFirst[0].id != 'adv' + bFlag) {
						jFirst.before($('#adv'+(bFlag)));
					}
					$(this).css({left:0});
				});
				if (bFlag == obj2.length)
				{
					bFlag = 0;
				}
				for(var j=0;j<obj2.length;j++)
				{
					obj2[j].style.backgroundColor="#eeeeee";
				}
				obj2[bFlag].style.backgroundColor="#4ec1b2";

			}

			var oTimer = setInterval(changeAdImg,4000);
			var bFlag = 0;
			var obj2 = document.getElementsByTagName("i");
			obj2[0].style.backgroundColor ="#4ec1b2";
			 $("#i1").on("click", function(){
				 clearInterval(oTimer);
				 bFlag = -1;
				 changeAdImg();
				 bFlag = 0;
				 oTimer = setInterval(changeAdImg,4000);
		     });
			obj2[1].style.backgroundColor ="#eeeeee";
			 $("#i2").on("click", function(){
				 clearInterval(oTimer);
				 bFlag = 0;
				 changeAdImg();
				 bFlag = 1;
				 oTimer = setInterval(changeAdImg,4000);
		     });
			obj2[2].style.backgroundColor ="#eeeeee";
			 $("#i3").on("click", function(){
				 clearInterval(oTimer);
				 bFlag = 1;
				 changeAdImg();
				 bFlag = 2;
				 oTimer = setInterval(changeAdImg,4000);
		     });
		    $("#adPanel").on('mouseenter','ul>li',function(){value = 0})
		    			 .on('mouseleave','ul>li',function(){value = 1});
		}

		function clickAdv(index) {
			var obj2 = document.getElementsByTagName("i");
			for(var j=0;j<obj2.length;j++)
			{
				obj2[j].style.backgroundColor="#eeeeee";
			}
			bFlag = index;
			obj2[bFlag].style.backgroundColor="#4ec1b2";
		}
		
		function onMyLoad()
		{
			onPageInit();
		}

		function loginInit() {
			onMyLoad();
		}
		
		function loginResize (nHeight) {
			var sClass = "height_1";
        	if (nHeight < 480)
        	{
        		sClass = "height_2";
        	}
        	else if (nHeight < 790)
        	{
        		sClass = "height_3";
        	}
        	else if (nHeight < 1024)
        	{
        		sClass = "height_4";
        	}
        	$("body").removeClass("height_1 height_2 height_3 height_4").addClass (sClass);
		}

	$(window).resize(function ()
	{
		loginResize($(window).height());
	});
		$(function() {
			loginInit();
		    });

		