<!DOCTYPE html>  
<html lang="en">
<head>
	<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
	<title></title>
	<meta content="width=device-width, initial-scale=1.0" name="viewport" />  
	<meta content="" name="description" />  
	<meta content="" name="author" />
	<link id="link_id" href="../../web/frame/libs/css/bootstrap.css" rel="stylesheet" type="text/css"/>  
	<link id="link_id" href="../../web/frame/libs/css/bootstrap-responsive.css" rel="stylesheet" type="text/css"/>  
	<link id="link_id" href="../../web/frame/css/blue/index.css" rel="stylesheet" type="text/css"/>  
	<link id="link_id" href="../../web/frame/libs/css/style-responsive.css" rel="stylesheet" type="text/css"/>  
	<link id="link_id" href="../../uitools/css/main.css" rel="stylesheet" type="text/css"/>  
	
	<!--[if IE 8]>
	<link rel="stylesheet" href="../../web/frame/libs/css/font-awesome-ie7.min.css">
	<script type="text/javascript" src="../../web/frame/utils/respond.js"></script>
	<![endif]-->

<script>
var FrameInfo = 
{
	sessionid: "abcd1234",
	oem: "000",
	uname: "admin",
	devname: "V7 Web Demo 0711",
	vid: "1",
	ns:
	{
		base: "http://www.h3c.com/netconf/base:1.0",
		data: "http://www.h3c.com/netconf/data:1.0",
		config: "http://www.h3c.com/netconf/config:1.0",
		action: "http://www.h3c.com/netconf/action:1.0"
	}
};
</script>
</head>  
<!-- END HEAD -->  
<!-- BEGIN BODY -->  
<body>  
	<div class="bg">
		<img src="../../web/frame/css/blue/image/background.jpg" class="bg-img"></img>
	</div>
	<!-- menu -->
	<div id="menu_div" class="frame-block menu">  
		<div id="frame_top" class="header navbar navbar-fixed-top">  
			<a href="#menu_div" id="menu-toggle" class="toggle menu-toggle" contents="#frame_menu">  
				<span class="toggle-bg"></span>  
			</a>
			<!-- BEGIN LOGO -->  
			<a class="brand">  
				<img id="logo">
			</a>  
			<!-- END LOGO -->  
			<!-- BEGIN RESPONSIVE MENU TOGGLER -->  
			<DIV class="nav-collapse navbar-responsive-collapse">
				<ul class="nav pull-left">
					<li class="dropdown">
						<a href="#user" class="dropdown-toggle transparent" data-toggle="dropdown" id="tbarUser">
							<i class="menu-icon menu-icon-user"></i><span id="username" class="PC-username"></span>
						</a>
						<ul class="dropdown-menu shortcut">
							<li class="phone-show" id="tbarUser" class="admin-label label-wrap">
								<a><i class="menu-icon menu-icon-user"></i><span id="username-phone" class="admin-label label-wrap"></span></a>
							</li>
							<li class="divider"><hr/></li>
                      		<li id="change_language" class="lan-wrap">
                          		<i class="menu-icon menu-icon-lan"></i><span id="language_label" class="span-width">Language</span>
		        				<div class="lang-contrainer">
		        					<select>
						    		    <option data="cn" value="cn">中文</option>
						    		    <option data="en" value="en" checked >English</option>
						    		</select>
								</div>
	                        </li>
                      		<li class="divider"><hr/></li>
                      		<li id="change_password">
                          		<a href="#"><i class="menu-icon menu-icon-pwd"></i><span id="password_label" class="password-label label-wrap">Change Password</span></a>
                      		</li>
                      		<li class="divider"><hr/></li>
							<li id="tbarSavePhone" class="phone-show">
								<a href="#"><i class="menu-icon menu-icon-save phone-show"></i><span id="save_label" class="save-label label-wrap"></span></li></a>
                      		<li class="divider phone-show"><hr/></li>
                      		<li id="tbarLogoutPhone" class="phone-show">
                          		<a href="#"><i class="menu-icon menu-icon-logout"></i><span id="lougout_label" class="logout-label label-wrap"></span></a>
                      		</li>
                    	</ul>
					</li>
					<li class="divide-li PC-show"><span class="divide-line">|</span></li>
					<li id="tbarSave" class="menu-save PC-show"><i class="menu-icon menu-icon-save PC-show"></i><span id="save_label"></span></li>
					<li class="divide-li PC-show"><span class="divide-line">|</span></li>
					<li id="tbarLogout" class="menu-save PC-show"><a id="tbarLogout" class="action-btn" href="#"><i class="menu-icon menu-icon-logout"></i></a></li>
					
				</ul>
			</DIV>
		</div>
		<!-- BEGIN SIDEBAR -->  
		<div id="frame_menu" class="page-sidebar" style="heigth:685px;">
			<div class="devices">
				<div class="device-wrap">
					<img class="device-dis" />
				</div>
				<div id="DeviceCarousel" class="device carousel slide">
					<div class="carousel-inner">
	            		<div class="active item" next="devname-item" prev="time-item" id="sysname-item">
							<div class="devices-sysname">
								<span id="sysname"></span>
							</div>
	    				 </div>
	            		<div class="item" next="time-item" prev="sysname-item" id="devname-item">
							<div class="devices-name">
								<span id="devicename"></span>
							</div>
	    				 </div>
	            		<div class="item" next="sysname-item" prev="devname-item" id="time-item">
							<div class="devices-time">
								<span id="day"></span><span id="day_unit"></span><span class="devices-line">|</span><span id="current_time" name="cur_time" class="time"></span>
							</div>
	    				 </div>
					</div>
					<a class="icon-chevron-left prev-carousel carousel-control left" href="#DeviceCarousel" data-slide="prev"></a>
					<a class="icon-chevron-right next-carousel carousel-control right" href="#DeviceCarousel" data-slide="next"></a>
				</div>
			</div>
			<div class="menu-container">
				<div class="sidebar">
					<ul class="nav nav-tabs" id="navTabs">
						<li class="active"><a href="#"><i class="icon-th-large"></i></a></li>
						<li><a href="#"><i class="icon-list"></i></a></li>
					</ul>
					<div class="tab-content">
						<ul class="nav-list grid-view" id="navList">
							<li class="active">
								<div class="list-header">
									<i class="icon-cubes"></i><span>页面模板</span>
								</div>
								<div class="list-box">
									<!-- template start -->
									<div class="drag-tpl" data-remove="true">
										<div class="preview drag" data-clear="true">
											<img src="" alt="">
											<p class="title">tabs切换模板</p>
										</div>
										<div class="ui-widget-content">
										    <dl class="headline" data-mask="false"  data-nodetype="headline">
										    	<dt>
										    		<span class="title">模块标题1</span>
										    		<span class="headbutton">
										    		</span>
										    	</dt>
										    	<dd></dd>
										    </dl>
										    <div class="view mytabs" data-remove="true" data-mask="false" data-nodetype="tabs">
											    <ul class="nav nav-tabs">
											        <li class="active">
											            <a href="#tab1" data-toggle="tab"><span  contenteditable="true" data-remove="true">tab标题1</span></a>
											        </li>
											        <li>
											            <a href="#tab2" data-toggle="tab"><span contenteditable="true" data-remove="true">tab标题2</span></a>
											        </li>
											    </ul>
											    <div class="tab-content">
											    	<div class="tab-pane full unit-droppable active" id="tab1" style="min-height:120px;">
								                    	<div class="edittable drag-unit " data-nodetype="edittable" data-empty="true"></div>
								                    </div>
								                    <div class="tab-pane full unit-droppable" id="tab2"  style="min-height:120px;">
								                    	<div class="edit-list drag-unit " data-nodetype="editlist" data-empty="true"></div>
								                    </div>
											    </div>
										    </div>
										</div>
									</div>
									<!-- template start -->
									<div class="drag-tpl" data-remove="true">
										<div class="preview drag" data-clear="true">
											<img src="" alt="">
											<p class="title">单个数据表格模板</p>
										</div>
										<div class="ui-widget-content">
										    <dl class="headline" data-mask="false"  data-nodetype="headline">
										    	<dt>
										    		<span class="title">模块标题1</span>
										    		<span class="headbutton">
										    		</span>
										    	</dt>
										    	<dd></dd>
										    </dl>
										    <div class="mlist" data-nodetype="mlist" data-empty="true"></div>
										</div>
									</div>
									<!-- template start -->
									<div class="drag-tpl" data-remove="true">
										<div class="preview drag" data-clear="true">
											<img src="" alt="">
											<p class="title">Editlist模板</p>
										</div>
										<div class="ui-widget-content">
										    <dl class="headline" data-mask="false"  data-nodetype="headline">
										    	<dt>
										    		<span class="title">模块标题1</span>
										    		<span class="headbutton">
										    		</span>
										    	</dt>
										    	<dd></dd>
										    </dl>
										    <div class="edit-list" data-nodetype="editlist" data-empty="true"></div>
										</div>
									</div>
									<!-- template start -->
									<div class="drag-tpl" data-remove="true">
										<div class="preview drag" data-clear="true">
											<img src="" alt="">
											<p class="title">Edittable模板</p>
										</div>
										<div class="ui-widget-content">
										    <dl class="headline" data-mask="false"  data-nodetype="headline">
										    	<dt>
										    		<span class="title">模块标题1</span>
										    		<span class="headbutton">
										    		</span>
										    	</dt>
										    	<dd></dd>
										    </dl>
										    <div class="edittable" data-nodetype="edittable" data-empty="true"></div>
										</div>
									</div>
									<!-- template start -->
									<div class="drag-tpl" data-remove="true">
										<div class="preview drag" data-clear="true">
											<img src="" alt="">
											<p class="title">选框下的Edittable模板</p>
										</div>
										<div class="ui-widget-content page">
										    <dl class="headline" data-mask="false"  data-nodetype="headline">
										    	<dt>
										    		<span class="title">模块标题1</span>
										    		<span class="headbutton">
										    		</span>
										    	</dt>
										    	<dd></dd>
										    </dl>
										    <div>
										    	<select name="" id="" data-nodetype="singleSelect"></select>
										    </div>
										    <div class="edittable" data-nodetype="edittable" data-empty="true"></div>
										</div>
									</div>
									<!-- template start -->
									<div class="drag-tpl" data-remove="true">
										<div class="preview drag" data-clear="true">
											<img src="" alt="">
											<p class="title">编辑表单</p>
										</div>
										<div class="content portlet sub-page" data-remove="true">
											<div class="portlet-title" data-delete="true">
												<div class="caption" contenteditable="true"><a class="back"></a><span>表单标题</span></div>
											</div>
											<form class="form-horizontal form-bordered form edit page">
												<div data-nodetype="formgroup" class="formgroup" data-remove="true" ></div>
												<div data-nodetype="formgroup" class="formgroup" data-remove="true"></div>
												<div data-nodetype="formgroup" class="formgroup" data-remove="true"></div>
											<form>
										</div>
									</div>
									<!-- template start -->
									<div class="drag-tpl" data-remove="true">
										<div class="preview drag" data-clear="true">
											<img src="" alt="">
											<p class="title">配置group模板</p>
										</div>
									    <div class="content portlet sub-page settings" data-remove="true">
										    <dl class="headline" data-mask="false"  data-nodetype="headline">
										    	<dt>
										    		<span class="title">模块标题1</span>
										    		<span class="headbutton">
										    		</span>
										    	</dt>
										    	<dd></dd>
										    </dl>
										    <div class="view" data-remove="true">
											    <dl class="sub-headline maxwidth">
											        <dt contenteditable="true">配置组名</dt>
											    </dl>
											    <div class="index-group maxwidth">
											        <div class="row" data-nodetype="listrow" data-listMode="switch" data-empty="true"></div>
										            <div class="row" data-nodetype="listrow" data-listMode="count"  data-empty="true"></div>
										            <div class="row" data-nodetype="listrow" data-listMode="value" data-empty="true"></div>
										            <div class="row" data-nodetype="listrow" data-listMode="link" data-empty="true" data-listline="false"></div>
											    </div>
											</div>
										</div>
									</div>
									<!-- template start -->
									<div class="drag-tpl" data-remove="true">
										<div class="preview drag" data-clear="true">
											<img src="" alt="">
											<p class="title">空白模板</p>
										</div>
									    <div class="content portlet sub-page settings" data-remove="true">
										    <dl class="headline" data-mask="false"  data-nodetype="headline">
										    	<dt>
										    		<span class="title">模块标题1</span>
										    		<span class="headbutton">
										    		</span>
										    	</dt>
										    	<dd></dd>
										    </dl>
										    <div class="view droppable full" data-remove="true"></div>
										</div>
									</div>
								</div>

							</li>
							<li>
								<div class="list-header">
									<i class="icon-cubes"></i><span>控件组件列表</span>
								</div>
								<div class="list-box">
									<div class="drag-unit listgroup" data-remove="true">
										<div class="preview drag" data-clear="true">
											<img src="" alt="">
											<p class="title">list group</p>
										</div>
										<div class="view" data-remove="true">
											<dl class="sub-headline maxwidth">
										        <dt contenteditable="true">配置组名</dt>
										    </dl>
											<div class="index-group maxwidth">
										        <div class="row" data-nodetype="listrow" data-listMode="switch" data-empty="true"></div>
									            <div class="row" data-nodetype="listrow" data-listMode="count"  data-empty="true"></div>
									            <div class="row" data-nodetype="listrow" data-listMode="value" data-empty="true"></div>
									            <div class="row" data-nodetype="listrow" data-listMode="link" data-empty="true" data-listline="false"></div>
										    </div>
										</div>
									</div>
									<div class="listrow" data-remove="true">
										<div class="preview drag" data-clear="true">
											<img src="" alt="">
											<p class="title">list row</p>
										</div>
										<div class="row" data-nodetype="listrow" data-listMode="switch" data-empty="true"></div>
									</div>

									<div class="drag-unit" data-remove="true">
										<div class="preview drag" data-clear="true">
											<img src="" alt="">
											<p class="title">Datagrid</p>
										</div>
										<div class="mlist" data-nodetype="mlist" data-empty="true"></div>
									</div>
									<div class="drag-unit" data-remove="true">
										<div class="preview drag" data-clear="true">
											<img src="" alt="">
											<p class="title">Editlist</p>
										</div>
										<div class="edit-list" data-nodetype="editlist" data-empty="true"></div>
									</div>
									<div class="drag-unit" data-remove="true">
										<div class="preview drag" data-clear="true">
											<img src="" alt="">
											<p class="title">EditTable</p>
										</div>
										<div class="edittable" data-nodetype="edittable" data-empty="true"></div>
									</div>
									<div class="drag-unit" data-remove="true">
										<div class="preview drag" data-clear="true">
											<img src="" alt="">
											<p class="title">form表单</p>
										</div>
										<div class="view" data-remove="true">
											<div class="btn-group handler-btn" data-delete="true">
												<a class="btn drag" role="button"><i class="icon-move"></i></a>
												<a class="btn remove" role="button"><i class="icon-remove"></i></a>
											</div>
											<form class="form-horizontal form-bordered form page" id="myForm">
												<div data-nodetype="formgroup" data-remove="true"></div>
												<div data-nodetype="formgroup" data-remove="true"></div>
												<div data-nodetype="formgroup" data-remove="true"></div>
											<form>
										</div>
									</div>
									<div class="drag-unit formgroup" data-remove="true">
										<div class="preview drag" data-clear="true">
											<img src="" alt="">
											<p class="title">form group</p>
										</div>
										<div class="view" data-remove="true" data-nodetype="formgroup"></div>
									</div>
									<div class="drag-unit" data-remove="true">
										<div class="preview drag" data-clear="true">
											<img src="" alt="">
											<p class="title">Mselect</p>
										</div>
										<select data-nodetype="mselect" selectedId="mselect_id"></select>
									</div>
									<div class="drag-unit" data-remove="true">
										<div class="preview drag" data-clear="true">
											<img src="" alt="">
											<p class="title">SingleSelect</p>
										</div>
										<div class="view" data-remove="true" data-nodetype="singleSelect">
											
										</div>
										<!-- <select data-nodetype="singleSelect" data-empty="true"></select> -->
									</div>
								</div>
							</li>
							<li>
								<div class="list-header">
									<i class="icon-cubes"></i><span>常用控件列表</span>
								</div>
								<div class="list-box">
									<div class="drag-item" data-remove="true">
										<div class="preview drag" data-clear="true">
											<img src="" alt="">
											<p class="title">Tabs切换卡</p>
										</div>
										<div class="view myTabs" data-remove="true">
											<div class="btn-group handler-btn" data-delete="true">
												<a class="btn drag" role="button"><i class="icon-move"></i></a>
												<a class="btn remove" role="button"><i class="icon-remove"></i></a>
											</div>
											<ul class="nav nav-tabs">
							                    <li class="active"><a href="#tab1" data-toggle="tab" contenteditable="true">第一部分</a></li>
							                    <li><a href="#tab2" data-toggle="tab" contenteditable="true">第二部分</a></li>
							                </ul>
							                <div class="tab-content">
							                    <div class="tab-pane unit-droppable active" id="tab1" contenteditable="true">
							                      <p>第一部分内容.</p>
							                    </div>
							                    <div class="tab-pane unit-droppable" id="tab2" contenteditable="true">
							                      <p>第二部分内容.</p>
							                    </div>
							                </div>
										</div>
									</div>
									<div class="drag-item" data-remove="true">
										<div class="preview drag" data-clear="true">
											<img src="" alt="">
											<p class="title">button group</p>
										</div>
										<div class="btn-group">
											<a class="btn" data-nodetype="btn" data-btnmode="text"></a>
						                   	<a class="btn" data-nodetype="btn" data-btnmode="text"></a>
						                   	<a class="btn" data-nodetype="btn" data-btnmode="text"></a>
										</div>
									</div>
									<div class="drag-item" data-remove="true">
										<div class="preview drag" data-clear="true">
											<img src="" alt="">
											<p class="title">label</p>
										</div>
										<div class="view" data-remove="true">
											<div class="btn-group handler-btn" data-delete="true">
												<a class="btn drag" role="button"><i class="icon-move"></i></a>
												<a class="btn remove" role="button"><i class="icon-remove"></i></a>
											</div>
											<label contenteditable="true">label</label>
										</div>
									</div>
									<div class="drag-item" data-remove="true">
										<div class="preview drag" data-clear="true">
											<img src="" alt="">
											<p class="title">input</p>
										</div>
										<div class="view" data-remove="true" data-nodetype="input">
											<!-- <div class="btn-group handler-btn" data-delete="true">
												<a class="btn drag" role="button"><i class="icon-move"></i></a>
												<a class="btn remove" role="button"><i class="icon-remove"></i></a>
											</div> -->
											<!-- <div data-nodetype="input"></div> -->
										</div>
									</div>
									<div class="drag-item" data-remove="true">
										<div class="preview drag" data-clear="true">
											<img src="" alt="">
											<p class="title">checkbox</p>
										</div>
										<div class="view" data-remove="true">
											<div class="btn-group handler-btn" data-delete="true">
												<a class="btn drag" role="button"><i class="icon-move"></i></a>
												<a class="btn remove" role="button"><i class="icon-remove"></i></a>
											</div>
											<input type="checkbox" >
										</div>
									</div>
									<div class="drag-item" data-remove="true">
										<div class="preview drag" data-clear="true">
											<img src="" alt="">
											<p class="title">radio</p>
										</div>
										<div class="view" data-remove="true">
											<div class="btn-group handler-btn" data-delete="true">
												<a class="btn drag" role="button"><i class="icon-move"></i></a>
												<a class="btn remove" role="button"><i class="icon-remove"></i></a>
											</div>
										</div>
									</div>
									<div class="drag-item" data-remove="true">
										<div class="preview drag" data-clear="true">
											<img src="" alt="">
											<p class="title">select</p>
										</div>
										<div class="view" data-remove="true" data-nodetype="select">
											
										</div>
										<!-- <select data-nodetype="select" data-empty="true"></select> -->
										<!-- <div class="view" data-remove="true">
											<div class="btn-group handler-btn" data-delete="true">
												<a class="btn drag" role="button"><i class="icon-move"></i></a>
												<a class="btn remove" role="button"><i class="icon-remove"></i></a>
											</div>
											<div data-nodetype="input"></div>
										</div> -->
									</div>
									<div class="drag-item" data-remove="true">
										<div class="preview drag" data-clear="true">
											<img src="" alt="">
											<p class="title">标题</p>
										</div>
										<div class="view" data-remove="true">
											<div class="btn-group handler-btn" data-delete="true">
												<a class="btn drag" role="button"><i class="icon-move"></i></a>
												<a class="btn remove" role="button"><i class="icon-remove"></i></a>
											</div>
											<h1 contenteditable="true">h1:标题</h1>
										</div>
									</div>
									<div class="drag-item" data-remove="true">
										<div class="preview drag" data-clear="true">
											<img src="" alt="">
											<p class="title">段落</p>
										</div>
										<div class="view" data-remove="true">
											<div class="btn-group handler-btn" data-delete="true">
												<a class="btn drag" role="button"><i class="icon-move"></i></a>
												<a class="btn remove" role="button"><i class="icon-remove"></i></a>
											</div>
											<p contenteditable="true">p:段落</p>
										</div>
									</div>
									<div class="drag-item" data-remove="true">
										<div class="preview drag" data-clear="true">
											<img src="" alt="">
											<p class="title">文本按钮</p>
										</div>
										<a class="btn" data-nodetype="btn" data-btnmode="text"></a>
									</div>
									<div class="drag-item" data-remove="true">
										<div class="preview drag" data-clear="true">
											<img src="" alt="">
											<p class="title">icon图标按钮</p>
										</div>
										<a class="btn" data-nodetype="btn" data-btnmode="icon"></a>
									</div>
									<div class="drag-item" data-remove="true">
										<div class="preview drag" data-clear="true">
											<img src="" alt="">
											<p class="title">图文按钮</p>
										</div>
										<a class="btn" data-nodetype="btn"></a>
									</div>
									<div class="drag-item" data-remove="true">
										<div class="preview drag" data-clear="true">
											<img src="" alt="">
											<p class="title">按钮组</p>
										</div>
										<div class="btn-group">
											<a class="btn" data-nodetype="btn"></a>
											
										</div>
									</div>
									<div class="drag-item" data-remove="true">
										<div class="preview drag" data-clear="true">
											<img src="" alt="">
											<p class="title">无序列表</p>
										</div>
										<div class="view" data-remove="true">
											<div class="btn-group handler-btn" data-delete="true">
												<a class="btn drag" role="button"><i class="icon-move"></i></a>
												<a class="btn remove" role="button"><i class="icon-remove"></i></a>
											</div>
											<ul contenteditable="true">
												<li>新闻资讯</li>
												<li>体育竞技</li>
												<li>娱乐八卦</li>
												<li>前沿科技</li>
												<li>环球财经</li>
												<li>天气预报</li>
												<li>房产家居</li>
												<li>网络游戏</li>
							                </ul>
										</div>
									</div>
									<div class="drag-item" data-remove="true">
										<div class="preview drag" data-clear="true">
											<img src="" alt="">
											<p class="title">有序列表</p>
										</div>
										<div class="view" data-remove="true">
											<div class="btn-group handler-btn" data-delete="true">
												<a class="btn drag" role="button"><i class="icon-move"></i></a>
												<a class="btn remove" role="button"><i class="icon-remove"></i></a>
											</div>
											<ol contenteditable="true">
												<li>新闻资讯</li>
												<li>体育竞技</li>
												<li>娱乐八卦</li>
												<li>前沿科技</li>
												<li>环球财经</li>
												<li>天气预报</li>
												<li>房产家居</li>
												<li>网络游戏</li>
							                </ol>
										</div>
									</div>
									<div class="drag-item" data-remove="true">
										<div class="preview drag" data-clear="true">
											<img src="" alt="">
											<p class="title">有序列表</p>
										</div>
										<div class="view" data-remove="true">
											<div class="btn-group handler-btn" data-delete="true">
												<a class="btn drag" role="button"><i class="icon-move"></i></a>
												<a class="btn remove" role="button"><i class="icon-remove"></i></a>
											</div>
											<dl contenteditable="true">
												<dt>Rolex</dt>
												<dd>劳力士创始人为汉斯.威尔斯多夫，1908年他在瑞士将劳力士注册为商标。</dd>
												<dt>Vacheron Constantin</dt>
												<dd>始创于1775年的江诗丹顿已有250年历史，</dd>
												<dd>是世界上历史最悠久、延续时间最长的名表之一。</dd>
												<dt>IWC</dt>
												<dd>创立于1868年的万国表有“机械表专家”之称。</dd>
												<dt>Cartier</dt>
												<dd>卡地亚拥有150多年历史，是法国珠宝金银首饰的制造名家。</dd>
							                </dl>
										</div>
									</div>
									<div class="drag-item" data-remove="true">
										<div class="preview drag" data-clear="true">
											<img src="" alt="">
											<p class="title">table表格</p>
										</div>
										<div class="view" data-remove="true">
											<div class="btn-group handler-btn" data-delete="true">
												<a class="btn drag" role="button"><i class="icon-move"></i></a>
												<a class="btn remove" role="button"><i class="icon-remove"></i></a>
											</div>
											<table class="table" contenteditable="true">
												<thead>
													<tr>
														<th>
															编号
														</th>
														<th>
															产品
														</th>
														<th>
															交付时间
														</th>
														<th>
															状态
														</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<td>
															1
														</td>
														<td>
															TB - Monthly
														</td>
														<td>
															01/04/2012
														</td>
														<td>
															Default
														</td>
													</tr>
													<tr class="success">
														<td>
															1
														</td>
														<td>
															TB - Monthly
														</td>
														<td>
															01/04/2012
														</td>
														<td>
															Approved
														</td>
													</tr>
													<tr class="error">
														<td>
															2
														</td>
														<td>
															TB - Monthly
														</td>
														<td>
															02/04/2012
														</td>
														<td>
															Declined
														</td>
													</tr>
													<tr class="warning">
														<td>
															3
														</td>
														<td>
															TB - Monthly
														</td>
														<td>
															03/04/2012
														</td>
														<td>
															Pending
														</td>
													</tr>
													<tr class="info">
														<td>
															4
														</td>
														<td>
															TB - Monthly
														</td>
														<td>
															04/04/2012
														</td>
														<td>
															Call in to confirm
														</td>
													</tr>
												</tbody>
											</table>
										</div>
									</div>
									<div class="drag-item" data-remove="true">
										<div class="preview drag" data-clear="true">
											<img src="" alt="">
											<p class="title">表单</p>
										</div>
										<div class="view" data-remove="true">
											<div class="btn-group handler-btn" data-delete="true">
												<a class="btn drag" role="button"><i class="icon-move"></i></a>
												<a class="btn remove" role="button"><i class="icon-remove"></i></a>
											</div>
											<form>
												<div class="view" data-remove="true" data-nodetype="formgroup"></div>
												<div class="view" data-remove="true" data-nodetype="formgroup"></div>
												<div class="view" data-remove="true" data-nodetype="formgroup"></div>
												<div class="view" data-remove="true" data-nodetype="formgroup"></div>
											<form>
										</div>
									</div>
								</div>
							</li>
						</ul>
					</div>
				</div>

			</div>
		</div>
		<!-- END SIDEBAR -->  
	</div>

	
	<div id="page_container">
		<!-- summary PAGE -->
		<div id="summary_div" class="frame-block summary">
			<div id="frame_nav" class="path" style="display:none">
				<ul id="frame_tablist" tab-content="tabContent" class="hide nav nav-tabs"></ul>
			</div>
			<div id="tabContent" class="tab-content row-fluid sub-page">
				<div id="uitool_page">
					<div class="viewport" style="min-height:240px;"></div>
					<div style="position:absolute;bottom:0;" class="page-toolbar">
				        <span class="headbutton">
				            <div class="btn-group">
				            <a role="button" class="btn btn-default" title="新建页面" id="pageCreate"><i class="icon-plus"></i><span>新建页面</span></a>
								<a role="button" class="btn btn-default" title="编辑" id="pageEdit"><i class="icon-edit"></i><span>编辑</span></a>
								<a role="button" class="btn btn-default" title="清空" id="pageClear"><i class="icon-remove"></i><span>清空</span></a>
								<a role="button" class="btn btn-default" title="预览" id="pagePreview"><i class="icon-eye-open"></i><span>预览</span></a>
								<a href="#saveAsFileModal" class="btn btn-default" title="生成页面文件" data-toggle="modal" data-target="#saveAsFileModal"><i class="icon-file"></i><span>生成页面文件</span></a>
								<a role="button" class="btn btn-default" title="保存为页面模板" id="saveAsTpl"><i class="icon-file-o-alt"></i><span>保存为页面模板</span></a>
								<a role="button" class="btn btn-default" title="保存当前页面" data-toggle="modal" data-target="#saveModal"><i class="icon-save"></i>保存</a>
				            </div>
				            <div class="btn-group shortcut">
								<a role="button" class="btn btn-default" title="使用帮助"><i class="icon-book"></i></a>
				            </div>
				        </span>
				    </div>
				</div>
			</div>
			<div id="copyright" class="copyright">Copy right</div>
		</div>

		<!-- edit PAGE -->
		<div id="edit_div" class="frame-block">
			<div class="inner-border">
				<div class="content portlet sub-page"></div>
			</div>
		</div>
	</div>
	<div class="menu-switch">
		<div class="menu-themb opened"></div>
	</div>
	<div id="pageHtml" class="hide"></div>
<div id="pageJS" class="hide"></div>

<div id="parasModal" aria-hidden="true" class="paras-wrap modal hide fade" role="dialog">
	<div class="modal-header"><h1>控件参数</h1></div>
	<div class="modal-body"><form id="paras_form"></form></div>
	<div class="modal-footer">
		<a role="button" class="btn btn-primary" data-dismiss="modal" id="saveCfgBtn">Apply</a>
		<a role="button" class="btn" data-dismiss="modal">Cancel</a>
	</div>
</div>

<div class="modal hide fade" role="dialog" id="editorModal">
  <div class="modal-header"> <a class="close" data-dismiss="modal"></a>
    <h3>编辑</h3>
  </div>
  <div class="modal-body">
    <textarea id="editcontent"></textarea>
  	<p class="hide">
      <textarea id="contenteditor"></textarea>
    </p>

  </div>
  <div class="modal-footer"> <a id="savecontent" class="btn btn-primary" data-dismiss="modal">保存</a> <a class="btn" data-dismiss="modal">关闭</a> </div>
</div>    


<div aria-hidden="true" class="modal hide fade" role="dialog" id="saveAsFileModal">
  <div class="modal-header"><a class="close" data-dismiss="modal"></a>
    <h3>保存</h3>
  </div>
  <div class="modal-body">
	<ul class="nav nav-tabs">
		<li class="active"><a href="#htmlFilePane" data-toggle="tab">HTML</a></li>
		<li><a href="#jsFilePane" data-toggle="tab">JS</a></li>
	</ul>
	<div class="tab-content">
		<div class="tab-pane active" id="htmlFilePane">
			<textarea style="width:500px;"></textarea>
		</div>
		<div class="tab-pane" id="jsFilePane">
			
		</div>
	</div>
  </div>
  <div class="modal-footer"><a class="btn" data-dismiss="modal">Close</a></div>
</div>

<!-- <div aria-hidden="true" class="modal hide fade" role="dialog" id="mlistColumnModal">
  <div class="modal-header"><a class="close" data-dismiss="modal"></a>
    <h3>列参数</h3>
  </div>
  <div class="modal-body">
	<div class="form-group">
		<label class="col-sm-4 control-label">列标题</label>
		<div class="col-sm-8">
			<input type="text" id="name" name="name">
			<label class="help-explain">（info）</label>
		</div>
	</div>
	<div class="form-group">
		<label class="col-sm-4 control-label">列数据类型</label>
		<div class="col-sm-8">
			<select name="datatype" id="datatype">
				<option value="String">String</option>
				<option value="Integer">Integer</option>
				<option value="Ipv4">Ipv4</option>
				<option value="Ipv6">Ipv6</option>
			</select>
			<label class="help-explain">（info）</label>
		</div>
	</div>
  </div>
  <div class="modal-footer"><a class="btn" data-dismiss="modal">Close</a> </div>
</div> -->

<div aria-hidden="true" class="modal hide fade" role="dialog" id="saveModal">
  <div class="modal-header"> <a class="close" data-dismiss="modal"></a>
    <h3>保存</h3>
  </div>
  <div class="modal-body">保存成功</div>
  <div class="modal-footer"> <a class="btn" data-dismiss="modal">Close</a> </div>
</div>

	<!-- END CONTAINER -->  
	<!-- BEGIN JAVASCRIPTS(Load javascripts at bottom, this will reduce page load time) -->  
	<!-- BEGIN CORE PLUGINS -->  
	<script src="../../web/frame/libs/js/jquery.js" type="text/javascript"></script>  
	<script src="../../web/frame/libs/js/jquery-ui.js" type="text/javascript"></script>
	<script src="../../web/frame/libs/js/bootstrap.min.js" type="text/javascript"></script>  
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
	<script type="text/javascript" src="../../web/frame/libs/js/mainframe.js"></script>

	<script type="text/javascript" src="../../web/frame/libs/js/jquery.event.drag-2.2.js"></script>
	<script type="text/javascript" src="../../web/frame/widgets/debuger.js"></script>
	<script type="text/javascript" src="../../web/frame/utils/base.js"></script>
	<script type="text/javascript" src="../../web/frame/widgets/util.js"></script>
	<script type="text/javascript" src="../../web/frame/widgets/frame.js"></script>
	<script type="text/javascript" src="../../web/frame/js/mjs.js"></script>	
	<script type="text/javascript" src="../../web/frame/nc.js"></script>
	<script type="text/javascript" src="../../uitools/menu.js"></script>	

	<script type="text/javascript" src="../../web/frame/utils/widget.js"></script>	
	<script type="text/javascript" src="../../uitools/widgets.js"></script>
	<script type="text/javascript" src="../../web/frame/utils/request.js"></script>	
	<script type="text/javascript" src="../../web/frame/utils/base.js"></script>	
	<script type="text/javascript" src="../../web/frame/utils/ip.js"></script>	
	<script type="text/javascript" src="../../web/frame/utils/msg.js"></script>	

	<script type="text/javascript" src="../../web/frame/widgets/dbm.js"></script>
	<script type="text/javascript" src="../../web/frame/widgets/dialog.js"></script>
	<script type="text/javascript" src="../../web/frame/libs/slickgrid/editors.js"></script>

    <script src="../../web/frame/libs/js/jquery.tmpl.min.js"></script>
    <script src="../../web/frame/libs/slickgrid/core.js"></script>
    <script src="../../web/frame/libs/slickgrid/plugins/rowselectionmodel.js"></script>
    <script src="../../web/frame/libs/slickgrid/plugins/checkboxselectcolumn.js"></script>
    <script src="../../web/frame/libs/slickgrid/dataview.js"></script>
    <script src="../../web/frame/libs/slickgrid/controls/pager.js"></script>
    <script src="../../web/frame/libs/slickgrid/controls/columnpicker.js"></script>
    <script src="../../web/frame/libs/slickgrid/grid.js"></script>
    <script src="../../web/frame/libs/slickgrid/editors.js"></script>

	<script type="text/javascript" src="../../web/frame/widgets/mlist.js"></script>	
	<script type="text/javascript" src="../../web/frame/widgets_new/mlist.js"></script>	
	<script type="text/javascript" src="../../web/frame/widgets_new/form.js"></script>	
	<script type="text/javascript" src="../../web/frame/widgets_new/mselect.js"></script>	
	<script type="text/javascript" src="../../web/frame/widgets_new/singleselect.js"></script>	
	<script type="text/javascript" src="../../web/frame/widgets_new/edittable.js"></script>	
	<script type="text/javascript" src="../../web/frame/widgets_new/editlist.js"></script>	
	<script type="text/javascript" src="../../web/frame/widgets_new/toggle.js"></script>	
	<script type="text/javascript" src="../../web/frame/widgets_new/default.js"></script>	
	<script type="text/javascript" src="../../web/frame/widgets_new/switch.js"></script>


	<script type="text/javascript" src="../../uitools/webui.js"></script>	
	<script type="text/javascript" src="../../uitools/htmlclean.js"></script>	
	<script type="text/javascript" src="../../uitools/index.js"></script>	
	
</body>
<!-- END BODY -->  
</html>
<script>
document.cookie = "abcd1234=true; path=/;";
MyConfig.config.local = true;
</script>

