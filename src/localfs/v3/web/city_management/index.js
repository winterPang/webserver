(function ($) {
    var MODULE_NAME = "city_management.index";
	var MODULE_RC = "management_indexConfigure";
	var option;
	var myCharts;

	var areaType = ["其他","景区","公园、广场","写字楼","体育场馆","各级政府、行政单位","住宅区","医院","火车站","学校","购物中心、集市","展馆、剧院","星级酒店"]

    function getRcText(sRcName)
    {
		return Utils.Base.getRcString(MODULE_RC, sRcName);
    }
    /*********************SLIST表格 初始化********************************/
    function initSlist() {
        var managementslist = {
			height:"70",
            showOperation: true,
            showHeader: true,
            multiSelect :true,
			sortable:true,
            pageSize: 5,
			colNames: getRcText("MANAGEMENT_HEADER"),
            colModel: [
                {name: 'area_name', value: 'String',width:100},
                {name: 'area_type', value: 'String',width:100}
                ],
            // {name: 'operation', value: 'String',formatter:showLinkAP}],//表格里带有链接的元素
            buttons:[
                {name:"edit",enable:true,action:editTest}, //编辑
				{name:"detail",enable:true,action:detailsTest}, //详情
                {name:"delete",enable:true,action:Utils.Msg.deleteConfirm(delTest),},//删除
                {name:"add",value:getRcText("ADD"),action:addcity},//添加
                {name:"syn",value:getRcText("SYN"),action:syncity},//同步
                {name:"del",value:getRcText("DEL"),action:Utils.Msg.deleteConfirm(delcity),},//删除
            ],                                
        };
        $("#area_make").SList('head', managementslist); //刷新表头
    } 
	function getBranchList() //获取分支列表
	{
		function getBranchListSuc(data)
		{
			var branchListArr = [];
			if (data.branchList && data.branchList.length)
			{
				for (var i in data.branchList)
				{
					var temp = {};
					temp.area_name = data.branchList[i].branchName;
					temp.area_type =data.branchList[i].location;
					branchListArr.push(temp);
				}
				$("#area_make").SList('refresh', branchListArr);
			}
		}
		var getBranchListOpt = {
			url: MyConfig.path+"/apmonitor/getBranchList?devSN="+ /*"210235A1JTB15A000007",*/FrameInfo.ACSN,
			type: "GET",
			dataType: "json",
			contentType: "application/json",
			onSuccess: getBranchListSuc,
			onFailed: null,
		};
		Utils.Request.sendRequest(getBranchListOpt);
	}
	
	var make_area_name,make_area_alias,make_area_select;
	var area_apgroup_tmp=[];
	
	function editTest(data)//编辑
	{
		var details_dlg=$("#make_domal_form");
        details_dlg.form ("init", "edit", {"title":"详情","btn_apply":false, "btn_cancel":false});
		Utils.Base.openDlg(null, {}, {scope:$("#makeDlg"),className:"modal-large"});
		
		$("#make_apgroup_id1").empty();
		$("#Channel_select").empty();
		
		var single_data=["景区","公园、广场","写字楼","体育场馆","各级政府、行政单位","住宅区","医院","火车站","学校","购物中心、集市","展馆、剧院","星级酒店","其他"]
		for(i=0;i<single_data.length;i++)
		{
			var y=document.createElement("option");
			y.text=single_data[i];
			x=document.getElementById("make_select_id");
			x.add(y,null);
		}
		$("#make_name_id").val(data[0].area_name);//获取区域名称 并显示到修改页面上
		$("#make_name_id").attr("readonly",true);
		var name_temp=data[0].area_name;
		var branchArr=[];
		area_apgroup_tmp.length=0;
		branchArr.length=0;
		function getApGrpListByBranchSuc(data) //获取本身绑定的AP组
		{
			var skipNo;
			if(data.apGroupList)
			{
				var apgroup_temp="";
				for (var i in data.apGroupList)
				{
					branchArr.push(data.apGroupList[i].apGroupName);
					var temp={};
					temp.apGroupName=data.apGroupList[i].apGroupName;
					area_apgroup_tmp.push(temp);
				}
				getApGroupList(0);
			}			
			if(data.leftCount>0)
			{
				skipNo=data.totalCount-data.leftCount;
				getApGroupList(skipNo);
			}
		}
		function getApGrpListByBranch(num)
		{
			var getApGrpListByBranchOpt = {
				url: MyConfig.path+"/apmonitor/getBranchInfoByBranch?devSN="+ /*"210235A1JTB15A000007"*/FrameInfo.ACSN+"&branchName=" +name_temp+"&skipnum="+num+"&limitnum=100",
				type: "POST",
				dataType: "json",
				contentType: "application/json",
				onSuccess: getApGrpListByBranchSuc,
				onFailed: null
			};
			Utils.Request.sendRequest(getApGrpListByBranchOpt);
		}	
		function getApGroupListSuc(data)  //获取未绑定的AP组
		{
			var skipNo;
			if(data.apGroupList)
			{
				for(var i in data.apGroupList)
				{
					if(data.apGroupList[i].branch==""){
						branchArr.push(data.apGroupList[i].apGroupName);	
					}
				}
				$("#make_apgroup_id1").mselect("InitData",branchArr);
			}
			if(data.leftCount>0)
			{
				skipNo=data.totalCount-data.leftCount;
				getApGroupList(skipNo);
			}
		}
		function getApGroupList(num)
		{
			var getBranchListOpt = {
				url: MyConfig.path+"/apmonitor/getApGrpDesBranch?devSN="+ /*"210235A1JTB15A000007"*/FrameInfo.ACSN +"&skipnum="+num+"&limitnum=100",
				type: "POST",
				dataType: "json",
				contentType: "application/json",
				onSuccess: getApGroupListSuc,
				onFailed: null
				};
			Utils.Request.sendRequest(getBranchListOpt);
		}
		getApGrpListByBranch(0);
	}
	function make_sure()
	{
		$('#make_sure_id').on("click",function(){
			
			var apgroup_list=[];
			var make_select=$('#make_select_id').val();  //取出区域选择的值
			var make_name=$("#make_name_id").val(); //获取分支名称
			var make_apgroup=$('#make_apgroup_id1').mselect("value"); //获取用户修改绑定的AP组
			if(make_apgroup=="")
			{
				apgroup_list=area_apgroup_tmp;
			}
			else
			{
				for(var i in make_apgroup)
				{
					var temp={};
					temp.apGroupName=make_apgroup[i];
					apgroup_list.push(temp);
				}
			}
			
			function makeBranchSuc(data)
			{
				if(data.result == "success"){
					getBranchList();
					Frame.Msg.info("修改成功");
				}
				if(data.result == "faild"){
					Frame.Msg.info("修改失败","error");
				}
			}
			function makeBranch()
			{
				var makeBranchOpt = {
					type: "POST",
					url: MyConfig.path + "/ant/confmgr",
					dataType: "json",
					contentType: "application/json",
					data: JSON.stringify({
						devSN: /*"210235A1JTB15A000007",*/FrameInfo.ACSN,
						configType: 0,
						cloudModule: "apmgr",
						deviceModule: "apmgr",
						method: "ModifyBranch",
						policy: "cloudFirst",
						param:[{
								acSN: /*"210235A1JTB15A000007",*/FrameInfo.ACSN,
								branchName: make_name,	
								location:make_select,
								apGroupList:apgroup_list,
						}]
					}),
					onSuccess: makeBranchSuc,
					onFailed: null
				}
				Utils.Request.sendRequest(makeBranchOpt);		
			}
			makeBranch();
			$("#makeDlg").modal ('hide');	
		})	
	}
	function make_exit() //编辑弹出框的取消按钮
    {
		$('#make_exit_id').on("click",function(){
			$("#makeDlg").modal ('hide');
		})
	}
	function init_make()
	{
		make_sure();
		make_exit();
	}
	/************************详情***************************/
	function detailsTest(data) //详情
	{
		var details_dlg=$("#details_domal_form");
        details_dlg.form ("init", "edit", {"title":"详情","btn_apply":false, "btn_cancel":false});
		Utils.Base.openDlg(null, {}, {scope:$("#detailsDlg"),className:"modal-small"});
		$("#area_name_details").html(data[0].area_name);//获取区域名称 并显示到修改页面上
		$("#area_type_details").html(data[0].area_type);//获取区域类别
		var name_temp= data[0].area_name;
		function getApGrpListByBranchSuc(data)
		{
			var skipNo;
			if(data.apGroupList)
			{
				var apgroup_temp="";
				for (var i in data.apGroupList)
				{
					apgroup_temp += data.apGroupList[i].apGroupName + "<br/>";
				}
				$("#area_apgroup_details").html(apgroup_temp);
			}
			if(data.leftCount>0)
			{
				skipNo=data.totalCount-data.leftCount;
				getApGroupList(skipNo);
			}
		}
		function getApGrpListByBranch(num)
		{
			var getApGrpListByBranchOpt = {
				url: MyConfig.path+"/apmonitor/getBranchInfoByBranch?devSN="+ /*"210235A1JTB15A000007"*/FrameInfo.ACSN +"&branchName=" +name_temp+"&skipnum="+num+"&limitnum=100",
				type: "POST",
				dataType: "json",
				contentType: "application/json",
				onSuccess: getApGrpListByBranchSuc,
				onFailed: null
			};
			Utils.Request.sendRequest(getApGrpListByBranchOpt);
		}	
		getApGrpListByBranch(0);	
	}
	
	/*************************单行删除******************************/
	function delTest(data) //删除  单行
	{
		function delBranchSuc(data)  
		{		
			if(data.result=="success"){
				getBranchList();
				Frame.Msg.info("删除成功");
			}
			if(data.result=="fail"){
				Frame.Msg.info("删除失败","error");
			}	
		}
		var delBranchOpt = {
			type: "POST",
			url: MyConfig.path + "/ant/confmgr",
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify({
				devSN:/* "210235A1JTB15A000007",*/FrameInfo.ACSN,
				configType: 0,
				cloudModule: "apmgr",
				deviceModule: "apmgr",
				method: "DelBranch",
				policy: "cloudFirst",
				param:[{
						acSN:/* "210235A1JTB15A000007",*/FrameInfo.ACSN,
						branchName: data[0].area_name,				   
				}]
			}),
			onSuccess: delBranchSuc,
			onFailed: null
		}
		Utils.Request.sendRequest(delBranchOpt);
	}
	/*****************************添加*******************************/
	function addcity() //添加
	{
		var add_dlg=$("#add_domal_form");
        add_dlg.form ("init", "edit", {"title":"添加区域","btn_apply":false, "btn_cancel":false});
		Utils.Base.openDlg(null, {}, {scope:$("#addDlg"),className:"modal-large"});
		$('#add_name_id').removeClass("text-error");   
		$("#area_name_error").hide();  
		$("#add_apgroup_id").empty();
		$("#add_select").empty();
        $('#add_name_id').val("");
		
		function getApGroupListSuc(data) //获取未绑定的AP组
		{	
			var unbindArr=[];
			var skipNo;
			if(data.apGroupList)
			{
				for(var i in data.apGroupList)
				{
					if(data.apGroupList[i].branch==""){
						unbindArr.push(data.apGroupList[i].apGroupName);
					}
				}
				$("#add_apgroup_id").mselect("InitData",unbindArr);
			}
			if(data.leftCount>0)
			{
				skipNo=data.totalCount-data.leftCount;
				getApGroupList(skipNo);
			}
		}
		function getApGroupList(num)
		{
			var getBranchListOpt = {
			url: MyConfig.path+"/apmonitor/getApGrpDesBranch?devSN="+/* "210235A1JTB15A000007"*/FrameInfo.ACSN +"&skipnum="+num+"&limitnum=100",
			type: "POST",
			dataType: "json",
			contentType: "application/json",
			onSuccess: getApGroupListSuc,
			onFailed: null
			};
			Utils.Request.sendRequest(getBranchListOpt);
		}
		getApGroupList(0);
	}
	function add_sure()
	{
		$('#add_sure_id').on("click",function(){
			var add_select=$('#add_select_id').val();//获取区域类别
			var add_name=$('#add_name_id').val();//获取区域名称  
			if(!add_name) //名字不能为空
			{  
				$("#area_name_error").html("必须填写该参数");
				$("#area_name_error").show();
				$('#add_name_id').addClass("text-error");
				return false;   
			}
			var apgroup_temp=$('#add_apgroup_id').mselect("value");
			var add_apgroup=[];
			for(var i in apgroup_temp)
			{
				var temp={};
				temp.apGroupName=apgroup_temp[i];
				add_apgroup.push(temp);
			}
			{
			function addBranchflagSuc(data) //获取分支创建标记
			{
				if(data.addBranch == true)
				{                                   //创建分支  
					function greateBranchSuc(data)  
					{	
						if(data.result=="success"){
							getBranchList();//刷新数据	
							Frame.Msg.info("添加成功");
						}
						if(data.result=="fail"){
							Frame.Msg.info("添加失败","error");
						}	
					}
					var greateBranchOpt = {
						type: "POST",
						url: MyConfig.path + "/ant/confmgr",
						dataType: "json",
						contentType: "application/json",
						data: JSON.stringify({
							devSN: /*"210235A1JTB15A000007",*/FrameInfo.ACSN,
							configType: 0,
							cloudModule: "apmgr",
							deviceModule: "apmgr",
							method: "AddBranch",
							param:[{
								acSN: /*"210235A1JTB15A000007",*/FrameInfo.ACSN,
								branchName: add_name,
								location:add_select,
								branchType: 0,
								apGroupList:add_apgroup 
							}]
						}),
						onSuccess:greateBranchSuc,
						onFailed:null
					};
					Utils.Request.sendRequest(greateBranchOpt);
				}
				if(data.addBranch == false)
				{
					Frame.Msg.alert("分支创建失败  分支重命名");
				}
			}
			var addBranchflagOpt = {
			url: MyConfig.path+"/apmonitor/getBranchAddFlag?devSN="+ /*"210235A1JTB15A000007"*/FrameInfo.ACSN +"&branchName=" + add_name,
			type: "GET",
			dataType: "json",
			contentType: "application/json",
			onSuccess: addBranchflagSuc,
			onFailed: null
			};
		}
		Utils.Request.sendRequest(addBranchflagOpt);
		
		$("#addDlg").modal ('hide');//隐藏添加 模态框
		});
	}
	function add_exit() //添加弹窗里的取消按钮
    {
		$('#add_cancel_id').on("click",function(){
		   $("#addDlg").modal ('hide');
        })
	}
	function add_continue() //添加弹窗里的继续添加按钮  
	{
		$('#add_continue_id').on("click",function(){
			alert("ssss");
			$('#add_name_id').removeClass("text-error"); //移除因为输入错误产生的红框  
			$('#add_alias_id').removeClass("text-error"); 
			$("#area_name_error").hide();//隐藏错误提示
			$("#area_alias_error").hide();//隐藏错误提示、
			var continue_select=$('#add_select_id').val();//获取区域类别
			var continue_name=$('#add_name_id').val();//获取区域名称
			if(!continue_name)  //区域名称为空的情况
				{
					$("#area_name_error").html("必须填写该参数");
					$("#area_name_error").show();
					$('#add_name_id').addClass("text-error");
					return false;
				}
			var apgroup_temp=$('#add_apgroup_id').mselect("value");
			var continue_apgroup=[];
			for(var i in apgroup_temp)
			{
				var temp={};
				temp.apGroupName=apgroup_temp[i];
				continue_apgroup.push(temp);
			}
			{
			function addBranchflagSuc(data) //获取分支创建标记
			{
				if(data.addBranch == true)
				{                                   //创建分支  
					function greateBranchSuc(data)  
					{	
						if(data.result=="success"){
							getBranchList();//刷新数据	
							Frame.Msg.info("添加成功");
						}
						if(data.result=="fail"){
							Frame.Msg.info("添加失败","error");
						}	
					}
					var greateBranchOpt = {
						type: "POST",
						url: MyConfig.path + "/ant/confmgr",
						dataType: "json",
						contentType: "application/json",
						data: JSON.stringify({
							devSN:/* "210235A1JTB15A000007",*/FrameInfo.ACSN,
							configType: 0,
							cloudModule: "apmgr",
							deviceModule: "apmgr",
							method: "AddBranch",
							param:[{
								acSN: /*"210235A1JTB15A000007",*/FrameInfo.ACSN,
								branchName: continue_name,
								location:continue_select,
								branchType: 0,
								apGroupList:continue_apgroup 
							}]
						}),
						onSuccess:greateBranchSuc,
						onFailed:null
					};
					Utils.Request.sendRequest(greateBranchOpt);
				}
				if(data.addBranch == false)
				{
					Frame.Msg.alert("分支创建失败  分支重命名");
				}
			}
			var continueBranchflagOpt = {
			url: MyConfig.path+"/apmonitor/getBranchAddFlag?devSN="+ /*"210235A1JTB15A000007"*/FrameInfo.ACSN +"&branchName=" + continue_name,
			type: "GET",
			dataType: "json",
			contentType: "application/json",
			onSuccess: addBranchflagSuc,
			onFailed: null
			};
		}
		Utils.Request.sendRequest(continueBranchflagOpt);
		$('#add_select_id').val("");
		$('#add_name_id').val("");
		$('#add_apgroup_id').val("");
		$('#add_select').empty("");
		});	
	}
	
	function init_add()
	{
		add_sure();
		add_exit();
		add_continue();
	}
	function syncity() //同步
	{
		getBranchList();
	}
	function delcity(data) //删除 多行
	{
		for(var i in data)
		{
			function delBranchSuc(data)  
			{		
				if(data.result=="success"){
					getBranchList();
					Frame.Msg.info("删除成功");
				}
				if(data.result=="fail"){
					Frame.Msg.info("删除失败","error");
				}	
			}
			var delBranchOpt = {
				type: "POST",
				url: MyConfig.path + "/ant/confmgr",
				dataType: "json",
				contentType: "application/json",
				data: JSON.stringify({
					devSN: /*"210235A1JTB15A000007",*/FrameInfo.ACSN,
					configType: 0,
					cloudModule: "apmgr",
					deviceModule: "apmgr",
					method: "DelBranch",
					policy: "cloudFirst",
					param:[{
							acSN: /*"210235A1JTB15A000007",*/FrameInfo.ACSN,
							branchName: data[i].area_name,				   
					}]
				}),
				onSuccess: delBranchSuc,
				onFailed: null
			}
			Utils.Request.sendRequest(delBranchOpt);
		}
	}
	
	function init_sList_function()
	{
		init_add();
		init_make();
	}
	function initData()
    {
		 getBranchList();
		$("#area_make").SList('resize');
        $("#dongtai_id").show();
    }
	 var arr = new  Array();
		arr[0]="请选择市"
        arr[1 ]="北京"
        arr[2 ]="上海"
        arr[3 ]="天津"
        arr[4 ]="重庆"
        arr[5 ]="石家庄,邯郸,邢台,保定,张家口,承德,廊坊,唐山,秦皇岛,沧州,衡水"
        arr[6 ]="太原,大同,阳泉,长治,晋城,朔州,吕梁,忻州,晋中,临汾,运城"
        arr[7 ]="呼和浩特,包头,乌海,赤峰,呼伦贝尔盟,阿拉善盟,哲里木盟,兴安盟,乌兰察布盟,锡林郭勒盟,巴彦淖尔盟,伊克昭盟"
        arr[8 ]="沈阳,大连,鞍山,抚顺,本溪,丹东,锦州,营口,阜新,辽阳,盘锦,铁岭,朝阳,葫芦岛"
        arr[9 ]="长春,吉林,四平,辽源,通化,白山,松原,白城,延边"
        arr[10 ]="哈尔滨,齐齐哈尔,牡丹江,佳木斯,大庆,绥化,鹤岗,鸡西,黑河,双鸭山,伊春,七台河,大兴安岭"
        arr[11 ]="南京,镇江,苏州,南通,扬州,盐城,徐州,连云港,常州,无锡,宿迁,泰州,淮安"
        arr[12 ]="杭州,宁波,温州,嘉兴,湖州,绍兴,金华,衢州,舟山,台州,丽水"
        arr[13 ]="合肥,芜湖,蚌埠,马鞍山,淮北,铜陵,安庆,黄山,滁州,宿州,池州,淮南,巢湖,阜阳,六安,宣城,亳州"
        arr[14 ]="福州,厦门,莆田,三明,泉州,漳州,南平,龙岩,宁德"
        arr[15 ]="南昌市,景德镇,九江,鹰潭,萍乡,新馀,赣州,吉安,宜春,抚州,上饶"
        arr[16 ]="济南,青岛,淄博,枣庄,东营,烟台,潍坊,济宁,泰安,威海,日照,莱芜,临沂,德州,聊城,滨州,菏泽"
        arr[17 ]="郑州,开封,洛阳,平顶山,安阳,鹤壁,新乡,焦作,濮阳,许昌,漯河,三门峡,南阳,商丘,信阳,周口,驻马店,济源"
        arr[18 ]="武汉,宜昌,荆州,襄樊,黄石,荆门,黄冈,十堰,恩施,潜江,天门,仙桃,随州,咸宁,孝感,鄂州"
        arr[19 ]="长沙,常德,株洲,湘潭,衡阳,岳阳,邵阳,益阳,娄底,怀化,郴州,永州,湘西,张家界"
        arr[20 ]="广州,深圳,珠海,汕头,东莞,中山,佛山,韶关,江门,湛江,茂名,肇庆,惠州,梅州,汕尾,河源,阳江,清远,潮州,揭阳,云浮"
        arr[21 ]="南宁,柳州,桂林,梧州,北海,防城港,钦州,贵港,玉林,南宁地区,柳州地区,贺州,百色,河池"
        arr[22 ]="海口,三亚"
        arr[23 ]="成都,绵阳,德阳,自贡,攀枝花,广元,内江,乐山,南充,宜宾,广安,达川,雅安,眉山,甘孜,凉山,泸州"
        arr[24 ]="贵阳,六盘水,遵义,安顺,铜仁,黔西南,毕节,黔东南,黔南"
        arr[25 ]="昆明,大理,曲靖,玉溪,昭通,楚雄,红河,文山,思茅,西双版纳,保山,德宏,丽江,怒江,迪庆,临沧"
        arr[26 ]="拉萨,日喀则,山南,林芝,昌都,阿里,那曲"
        arr[27 ]="西安,宝鸡,咸阳,铜川,渭南,延安,榆林,汉中,安康,商洛"
        arr[28 ]="兰州,嘉峪关,金昌,白银,天水,酒泉,张掖,武威,定西,陇南,平凉,庆阳,临夏,甘南"
        arr[29 ]="银川,石嘴山,吴忠,固原"
        arr[30 ]="西宁,海东,海南,海北,黄南,玉树,果洛,海西"
        arr[31 ]="乌鲁木齐,石河子,克拉玛依,伊犁,巴音郭勒,昌吉,克孜勒苏柯尔克孜,博 尔塔拉,吐鲁番,哈密,喀什,和田,阿克苏"
        arr[32 ]="香港"
        arr[33 ]="澳门"
		arr[34 ]="台北,高雄,台中,新竹,基隆,台南,嘉义"
     function getCity()
    {
		$("#province").change(function(){
			var pro = document.getElementById("province");
			var city = document.getElementById("city");
			var index = pro.selectedIndex;
			var cityArr = arr[index].split(",");
			city.length = 0; //清空市列表
				//将城市数组中的值填充到城市下拉框中
			for(var i=0;i<cityArr.length;i++)
			{
				city[i]=new Option(cityArr[i],cityArr[i]);
			}
		})
    }
	function area__dong_look()//上传文件 浏览按钮
	{
		$('#button_dong_AP_id').click(function(){
            $("#file_dong_AP_id").trigger("click");
        })
		$("#file_dong_AP_id").change(function(){
			var str=this.value;//以下是给用户显示看的
			var str1=str.replace(/C:\\fakepath\\/,"");
			$("#text_dong_AP_id").val(str1);
		})
	}
	function down_demo()  //模板下载
	{
		$('#mobanxiazai1').click(function(){
           $("#filerecive").get(0).src = "/v3/fs/downloadcloudapgrouptemplate";
		  // $("#filerecive").get(0).src = "/v3/fs/downloadappositiontemplate";
        })
	}
	function area_sure()  //点击动态地图下的 右下角确定按钮 隐藏“确定”和“取消”按钮  显示“显示AP位置”按钮
    {
        $('#sure_AP_id').click(function(){

			//获取数据
			var sheng=$('#province').val();//获取省
			{
				if(sheng==0)
				{
					$('#province').addClass("text-error");
					$('#city').addClass("text-error");
					return false;
				}
				else
				{
					$('#province').removeClass("text-error");
					$('#city').removeClass("text-error");
					var shi=$('#city').val();
				}
			}
			var inputap=$('#file_dong_AP_id').val(); //获取文件路径
			{
				if(inputap=="")
				{
					$('#text_dong_AP_id').addClass("text-error");
					return false;
				}
				else
				{
					$('#text_dong_AP_id').removeClass("text-error");
				}
			}
			function divSuc(data)
			{
				if(0==data.retCode)
				{
					Frame.Msg.info("省市上传成功");
				}
				if(-1 == data.retCode)
				{
					Frame.Msg.info("省市上传失败","error");
				}
			}
			function divFail(err)
			{
				Frame.Msg.error(err);
			}
			
			divopt={
				url: "/v3/position/setplacedata",
				type: "POST",
				dataType: "json",
				timeout: 2000, //这是什么
				data:{
					NASID: FrameInfo.Nasid,
					province_up: sheng , 
					city_up:shi
				},
				onSuccess: divSuc,
				onFailed: divFail
			}
			Utils.Request.sendRequest(divopt);
		
            $('#display_AP_id').show(); //显示AP位置按钮出现
            $('#sure_AP_id').hide();//确定按钮隐藏
			$('#cancel_AP_id').hide(); //取消按钮隐藏
			form_upload();
        })
    }
	function form_upload()//AP
	{
		var inputFile = $("#file_dong_AP_id")[0].files[0]
		var area_form=$('#area_form_id')[0];
		var formdata=new FormData(area_form);
		
		//formdata.append("Method","uploadfile");
		formdata.append("Method","uploadCloudapgroup");
		
		var xhr = new XMLHttpRequest();
		xhr.open('POST',area_form.action+ FrameInfo.ACSN);
		xhr.send(formdata);
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4 && xhr.status == 200){
				var data = JSON.parse(xhr.responseText);           
				if(data.retCode == 0)
				{
					Frame.Msg.alert("文件上传成功！");
				}
				else
				{
					Frame.Msg.alert("文件上传失败！");	 //aaa
				}
			}
		}
	}
	function area_flush() //当重新选择城市或重新导入地图模板时，“显示AP位置”按钮隐藏，“确定”和“取消”按钮显示
	{	$('select,#file_dong_AP_id').change( function(){
			$('#display_AP_id').hide();
            $('#sure_AP_id').show();
			$('#cancel_AP_id').show();
		})
	}
	function area_cancel()//取消按钮函数
	{
		$('#cancel_AP_id').click(function(){
			$("#text_dong_AP_id").empty();
			$("#file_dong_AP_id").empty();
			$('#province').removeClass("text-error");
			$('#city').removeClass("text-error");
			$('#text_dong_AP_id').removeClass("text-error");			
		})
	}
	function init_dong_function() //动态地图函数集合
	{
		getCity();
		area__dong_look();
		down_demo();
		area_sure();
		area_flush();
		area_cancel();
	}
	/*******************************静态地图部分  功能未定************************************************/
	 function select_jing_dong() //切换静态/动态  地图函数
    {
        $('input:radio').change( function(){
            var aa = $("input:radio:checked").val();//获取radio的value值
            if(aa=="city_type1"){$("#jingtai_id").show();$("#dongtai_id").hide();}
            if(aa=="city_type2"){$("#dongtai_id").show();$("#jingtai_id").hide();}
        });
    }
	function area_jing_look()//请选择地图 上传文件 浏览按钮
	{
		$('#button_map_id').click(function(){
            $("#file_map_id").trigger("click");

        })	
		$("#file_map_id").change(function(){	
			var str=this.value;//以下是给用户显示看的
			var str1=str.replace(/C:\\fakepath\\/,"");
			$("#text_map_id").val(str1);	

        })
		$("#file_map_id").change(function(){

			var str=this.value;//以下是给用户显示看的
			var str1=str.replace(/C:\\fakepath\\/,"");
			$("#text_map_id").val(str1);


		})
	}
	function area_jingAP_look()//AP位置列表 上传文件 浏览按钮
	{
		$('#button_jing_AP_id').click(function(){
            $("#file_jing__AP_id").trigger("click");
		})	
		$("#file_jing__AP_id").change(function(){	
			var str=this.value;//以下是给用户显示看的
			var str1=str.replace(/C:\\fakepath\\/,"");
			$("#text_jing_AP_id").val(str1);	

        })

		$("#file_jing__AP_id").change(function(){

			var str=this.value;//以下是给用户显示看的
			var str1=str.replace(/C:\\fakepath\\/,"");
			$("#text_jing_AP_id").val(str1);


		})
	}
	function init_jing_function()
	{
		area_jing_look();
		area_jingAP_look();
	}
	
	function initForm()
    {
		init_dong_function();
		init_sList_function();
		init_jing_function();
		select_jing_dong();
    }
    function initGrid()
    {
		initSlist();
    }
	function init_city()
    {
        var city = document.getElementById("city");
        var cityArr = arr[0].split(",");
        for(var i=0;i<cityArr.length;i++)
        {
            city[i]=new Option(cityArr[i],cityArr[i]);
        }
    }
	
	function _init()
    {
		initGrid();
		initForm();
        initData();
		init_city();
    }
	
    function _destroy()
    {
        console.log("*******destory*******");
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }
    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["Minput","SList","Form","SingleSelect","MSelect"],
        "utils":["Request","Base"]
    });
})( jQuery );


