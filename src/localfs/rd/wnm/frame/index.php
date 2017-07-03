<!DOCTYPE html>  
<html lang="en">
<head>
	<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
	<title></title>
	<meta content="width=device-width, initial-scale=1.0" name="viewport" />  
	<meta content="" name="description" />  
	<meta content="" name="author" />
	<link href="../../web/frame/libs/css/bootstrap.css" rel="stylesheet" type="text/css"/>  
	<link href="../../web/frame/libs/css/bootstrap-responsive.css" rel="stylesheet" type="text/css"/>  
	<link id="mytheme" rel="stylesheet" type="text/css"/>  
	<link href="../../web/frame/libs/css/style-responsive.css" rel="stylesheet" type="text/css"/>  

	<script type="text/javascript">
	var FrameInfo = {};
	</script>
<script>
var FrameInfo = 
{
	sessionid: "abcd1234",
	/*oem: "001",
	uname: "admin",
	devname: "V7 Web Demo 0711",
	vid: "1",
	ns:
	{
		base: "http://www.h3c.com/netconf/base:1.0",
		data: "http://www.h3c.com/netconf/data:1.0",
		config: "http://www.h3c.com/netconf/config:1.0",
		action: "http://www.h3c.com/netconf/action:1.0"
	}*/
};
</script>
	<!--wnm:FrameInfo-->
	
	<!--[if IE 8]>
	<link rel="stylesheet" href="../../web/frame/libs/css/font-awesome-ie7.min.css">
	<script type="text/javascript" src="../../web/frame/utils/respond.js"></script>
	<![endif]-->
</head>  
<!-- END HEAD -->  
<!-- BEGIN BODY -->  
<body>

<div class="user-panel">
	<ul class="nav pull-right user">
		<li class="dropdown">
			<a class="dropdown-toggle transparent pull-right" data-toggle="dropdown" id="tbarUser">
				<i class="menu-icon menu-icon-user"></i><span id="username" class="PC-username"></span>
			</a>
			<ul class="dropdown-menu shortcut">
				<li class="phone-show" id="tbarUser" class="admin-label label-wrap">
					<a><i class="menu-icon menu-icon-user"></i><span id="username-phone" class="admin-label label-wrap"></span></a>
				</li>
				<li class="divider"><hr/></li>
          		<li id="change_language" class="">
              		<i class="menu-icon menu-icon-lan"></i><span id="language_label" class="span-width">Language</span>
    				<div class="lang-contrainer">
    					<select>
			    		    <option data="cn" value="cn">中文</option>
			    		    <option data="en" value="en" checked >English</option>
			    		</select>
					</div>
                </li>
	            <li id="tbarSave" class="menu-save PC-show">
	            	<a href="#"><i class="menu-icon menu-icon-save PC-show"></i><span id="save_label"></span></a>
	            </li>
	            <li id="tbarLogout" class="menu-save PC-show">
	            	<a id="tbarLogout" class="action-btn" href="#"><i class="menu-icon menu-icon-logout"></i><span id="lougout_label"></span></a>
	            </li>
                <li id="change_password" class="menu-save PC-show">
                	<a href="#"><i class="menu-icon menu-icon-pwd"></i><span id="password_label">Change Password</span></a>
                </li>
                <li id="webmap" class="menu-save PC-show">
                	<a href="?np=WebMap"><i class="menu-icon menu-icon-pwd"></i><span id="map_label">Wabmap</span></a>
                </li>
                <li class="divider"><hr/></li>
				<li id="tbarSavePhone" class="phone-show">
					<a href="#"><i class="menu-icon menu-icon-save phone-show"></i><span id="save_label" class="save-label label-wrap"></span></a>
				</li>
                <li class="divider phone-show"><hr/></li>
          		<li id="tbarLogoutPhone" class="phone-show">
              		<a href="#"><i class="menu-icon menu-icon-logout"></i><span id="lougout_label" class="logout-label label-wrap"></span></a>
          		</li>
	      		<li  class="lan-wrap hide">
	      			<div id="themestatus" class="theme-status"></div>
					<div id="menuTheme">
						<a class="theme" href="#blue" data-style="blue">blue</a>
						<a class="theme" href="#green" data-style="green">green</a>
					</div>
	            </li>
            </ul>
		</li>
	</ul>
</div>
<!-- manually attach allowOverflow method to pane -->
<div class="ui-layout-north logo-panel">

	<!-- BEGIN LOGO -->  
	<div class="header">
		<a class="brand">  
			<!--<img id="logo" src="../../web/frame/oem/000/images/logo.png">-->
			<img  src="../../web/frame/oem/000/images/logo.png">
		</a>
		<span id="devicename"></span>
	</div>
</div>

<div class="ui-layout-west menu-panel">
	<!-- BEGIN SIDEBAR  
	<div id="switch_bar" class="open"><div class="bar-btn"></div></div> -->
	<div id="side_menu" class="page-sidebar">

		<!--<div class="tree-block sub-block hide">
			<div class="tree-title menu-title">
				<i class="menu-icon"></i>
				<span></span>
			</div>
			<div class="menu-tree">
				<div class="search">
					<span class="input-clear">
						<input class="tree-search" type="text" placeholder="Search Network" title="Search Network" />
						<i class="clear-icon hide"></i>
					</span>
				</div>
				<div class="tree-body"></div>
			</div>
		</div>-->

		<div class="menu-block sub-block">
			<div class="main-title menu-title">
				<i class="menu-icon"></i>
				<span></span>
			</div>
			<div class="menu-main"></div>
		</div>
	</div>
	<!-- END SIDEBAR -->  
</div>

<div class="ui-layout-south status-panel">
	<div id="tree_switch" class="col-xs-6">
		<ul>
			<!--<li class="full-menu switch" val="2"><i></i></li>-->
			<li class="action switch active" val="1"><i></i></li>
			<li class="full-screen switch" val="0"><i></i></li>
		</ul>
	</div>
	<!--<div id="statusbar" class="statusbar marginTop"></div>-->

	<!--<div class="view-switch" id="view_switch">
		<ul class="switch-btn">
			<li class="switch system">
				<a class="btn-bar">
				<span class="btn-font">System View</span>
				</a>				
			</li>
			<li class="switch network active">
				<a class="btn-bar">
				<span class="btn-font">Network View</span>
				</a>				
			</li>
		</ul>
	</div>-->

	<div id="copyright" class="copyright hide">Copy right</div>
</div>
<!--main container -->
<div id="layout_center" class="ui-layout-center content-panel">
	<div id="frame_nav" class="ui-layout-north path">
		<ul id="frame_tablist" tab-content="tabContent" class="nav nav-tabs"></ul>
		<ul id="global_btns"></ul>
	</div>
	<div id="page_container" class="ui-layout-center page-container">
		<div id="tabContent" class="tab-content row-fluid sub-page portlet"></div>
	</div>
</div>

	<!-- END CONTAINER -->  
	<!-- BEGIN JAVASCRIPTS(Load javascripts at bottom, this will reduce page load time) -->  
	<!-- BEGIN CORE PLUGINS -->  
	<script src="../../web/frame/libs/js/jquery.js" type="text/javascript"></script>  
	<script src="../../web/frame/libs/js/jquery-ui.js" type="text/javascript"></script>
	<script src="../../web/frame/libs/js/bootstrap.min.js" type="text/javascript"></script>  
	<script type="text/javascript" src="../../web/frame/libs/js/jquery.event.drag-2.2.js"></script>
	<!--[if lt IE 9]>  
	<script src="../../web/frame/libs/js/excanvas.min.js"></script>  
	<script src="../../web/frame/libs/js/respond.min.js"></script>    
	<![endif]-->     
	<!-- END CORE PLUGINS -->  

	<!-- BEGIN bootstrap PLUGINS -->  
	<script type="text/javascript" src="../../web/frame/libs/js/bootstrap-modal.js" ></script>
	<script type="text/javascript" src="../../web/frame/libs/js/bootstrap-modalmanager.js" ></script> 
	<script type="text/javascript" src="../../web/frame/libs/js/bootstrap-carousel.js" ></script> 
	<!-- END bootstrap PLUGINS --> 
	
	<!-- BEGIN PAGE LEVEL SCRIPTS -->
	<script type="text/javascript" src="../../web/frame/config.js"></script>
	<script type="text/javascript" src="../../web/frame/libs/jstree/jstree.js" ></script> 
	<script type="text/javascript" src="../../web/frame/libs/js/mainframe.js"></script>
	<script type="text/javascript" src="../../web/frame/js/menu.js"></script>	

	<script type="text/javascript" src="../../web/frame/widgets/echart/esl.js"></script>
	<script type="text/javascript" src="../../web/frame/widgets/echart/echarts.js"></script>
	<script type="text/javascript" src="../../web/frame/widgets/debuger.js"></script>
	<script type="text/javascript" src="../../web/frame/widgets/frame.js"></script>
	<script type="text/javascript" src="../../web/frame/js/mjs.js"></script>
	<!--<script type="text/javascript" src="../../web/frame/nc.js"></script>-->
	<script type="text/javascript" src="../../web/frame/widgets/util.js"></script>
	<script type="text/javascript" src="../../web/frame/widgets/dialog.js"></script>
	<script type="text/javascript" src="../../web/frame/widgets/dbm.js"></script>
	<script type="text/javascript" src="../../web/frame/utils/base.js"></script>

	<!--<script type="text/javascript" src="../../web/frame/utils/request.js"></script>-->
	<!--<script type="text/javascript" src="../../web/frame/utils/system.js"></script>-->
	<script type="text/javascript" src="../../web/frame/widgets_new/layout.js"></script> 
    <!-- <script type="text/javascript" src="../../web/frame/widgets/echart/esl.js"></script> 
    <script type="text/javascript">
    require.config({
        paths:{
            echarts:'../../web/frame/widgets/echart/echarts'
        }
    });
    require(['echarts'], function(ec){});
    </script> -->
</body>
<!-- END BODY -->  
</html>
<script>
document.cookie = "abcd1234=true; path=/;";
MyConfig.config.local = true;
MyConfig.useXmlMenu = (window.navigator.userAgent.indexOf("MSIE")==-1);
//window.navigator.userAgent判断浏览器的类型和版本号
</script>
