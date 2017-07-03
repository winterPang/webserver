; (function ($) {
	var MODULE_NAME = "classroom.classmanage";
    var g_mapScene;
    var g_bgLayerClass;
    var g_ClientLayerClass;
    var g_areaLayerClass;
    var g_areaArrayClassClass;
    var g_StudentLayerClass;
	var g_classdata;
	var monthType = null;
	var schoolType = null;
	var aGradeConf = [];

	function getRcText(sRcName) {
		return Utils.Base.getRcString("device_rc", sRcName);
	}

	function getMapList(suc) {
        var option = {
            type: 'POST',
            url: MyConfig.v2path + '/location/LocationImage',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                userId: FrameInfo.g_user.user,
                shopName: Utils.Device.deviceInfo.shop_name
            }),
            onFailed: function () {
            }
        }
        return Utils.Request.sendRequest(option);
    }
    function getLocationArea(locationName) {
        var option = {
            type: 'POST',
            url: MyConfig.v2path + '/location/locationArea',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                userId: FrameInfo.g_user.user,
                shopName: Utils.Device.deviceInfo.shop_name,
                locationName: locationName
            }),
            onFailed: function () {
            }
        }
        return Utils.Request.sendRequest(option);
    }
	//年级配置获取接口
	function getGradeConf(onSuccess){
		var Option = {
			type:"POST",
			url:MyConfig.path+"/smartcampusread",
			contentType:"application/json",
			data:JSON.stringify({
				devSN: FrameInfo.ACSN,
				Method: "getGradeConfig",
				Param: {
					devSn: FrameInfo.ACSN
				}
			}),
			onSuccess: onSuccess,
			onFailed: function (jqXHR, textstatus, error) {				
				Frame.Msg.info("数据更新失败", "error");
			}
		};
		Utils.Request.sendRequest(Option);
	}

	//年级配置添加接口
	function setGradeConfiguration(oParam,onSuccess){
		var oParam1 = {
			devSn:FrameInfo.ACSN,
		}
		$.extend(oParam1,oParam);
		var Option = {
			type:"POST",
			url:MyConfig.path+"/smartcampuswrite",
			contentType:"application/json",
			data:JSON.stringify({
				devSN:FrameInfo.ACSN,
				Method:"setGradeConfig",
				Param:oParam1
			}),
			onSuccess:onSuccess,
			onFailed:function(jqXHR,textstatus,error){
				initConfig();
				Frame.Msg.info("年级配置失败", "error");
			}
		}
		Utils.Request.sendRequest(Option);
	}


	function getClassData(pageSize, pageNum, oFilter) {
		pageSize = pageSize || 10;
		pageNum = pageNum || 1;
		oFilter = oFilter || {};
		var Param = {
			devSn: FrameInfo.ACSN,
			gradeConf: aGradeConf,
			startRowIndex: pageSize * (pageNum-1),
			maxItem: pageSize
		}

		$.extend(Param, oFilter);

		var option = {
			type: 'POST',
			url: MyConfig.path + '/smartcampusread',
			contentType: 'application/json',
			dataType: 'json',
			data: JSON.stringify({
				devSN: FrameInfo.ACSN,
				Method: 'getClass',
				Param: Param
			}),
			onSuccess: function (data) {
				//classId 班级
				//classRoom 教室
				//studentCnt 学生数量
				//teacher 老师
				//teacherTel 老师电话
				for(var i=0; i<data.result.data.length;i++){
					data.result.data[i].classroom = data.result.data[i].classroom || "未关联";
				}
				$("#classList").SList("refresh", { data: data.result.data, total: data.result.rowCount });
			},
			onFailed: function (err) {

			}
		}
		Utils.Request.sendRequest(option);
	}

	function addClassData(schoolType,oStData) {
		var Param = {
			devSn: FrameInfo.ACSN,
			gradeType:schoolType,
			addTime: (new Date()).getTime()
		}
		$.extend(Param, oStData);

		var option = {
			type: 'POST',
			url: MyConfig.path + '/smartcampuswrite',
			contentType: 'application/json',
			dataType: 'json',
			data: JSON.stringify({
				devSN: FrameInfo.ACSN,
				Method: 'addClass',
				Param: Param
			}),
			onSuccess: function (data) {
				if(data.retCode != 0){
					if(data.retCode == -2){
						Utils.Base.refreshCurPage();
						Frame.Msg.info("不能重复添加班级！");
						return;
					}
					Utils.Base.refreshCurPage();
					Frame.Msg.info("添加班级失败！");
					return;
				}
				Utils.Base.refreshCurPage();
				Frame.Msg.info("添加班级成功！");
			},
			onFailed: function () {
				Utils.Base.refreshCurPage();
				Frame.Msg.info("添加班级失败！");
			}
		}
		Utils.Request.sendRequest(option);
	}

	function modifyClassData(classinfo) {
		var Param = {
			devSn: FrameInfo.ACSN,
			gradeType: classinfo.schoolType,
			years: classinfo.years,
			baseGrade: classinfo.baseGrade,
			classId: classinfo.classId,
            teacher: classinfo.teacher,
            teacherTel: classinfo.teacherTel,
			addTime: 0
		}
		if (typeof classinfo.classroom !== 'undefined') {
			Param.classroom = classinfo.classroom
		}
		var option = {
			type: 'POST',
			url: MyConfig.path + '/smartcampuswrite',
			contentType: 'application/json',
			dataType: 'json',
			data: JSON.stringify({
				devSN: FrameInfo.ACSN,
				Method: 'addClass',
				Param: Param
			}),
			onSuccess: function (data) {
				if(data.retCode != 0){
					Frame.Msg.info("编辑班级失败！");
					Utils.Base.refreshCurPage();
					return;
				}
				Utils.Pages.closeWindow(Utils.Pages.getWindow($("#selectClassroom")));
				Frame.Msg.info("编辑班级成功！");
				Utils.Base.refreshCurPage();
			},
			onFailed: function () {
				
			}
		}
		Utils.Request.sendRequest(option);
	}
	function delClassData(arr) {
		//unknown
		var len=arr.length;
		function delClass(opt,onSuc,onFail) {
			var opt = opt || {};
			var Param = {
				devSn: FrameInfo.ACSN,
				delTime: (new Date()).getTime()
			}
			$.extend(Param, opt)
			var option = {
				type: 'POST',
				url: MyConfig.path + '/smartcampuswrite',
				contentType: 'application/json',
				dataType: 'json',
				data: JSON.stringify({
					devSN: FrameInfo.ACSN,
					Method: 'delClass',
					Param: Param
				}),
				onSuccess: onSuc,
				onFailed: onFail
			}
			Utils.Request.sendRequest(option);
		}
		function onSuc(aData){
			len--
			var aResult = aData.result;
			if(aData.retCode != 0){
				Frame.Msg.info("删除班级失败！");
				Utils.Base.refreshCurPage();
				return;
			}
			//Frame.Msg.info("删除班级成功！");
			if(len==0){
				Utils.Base.refreshCurPage();
			}

		}
		function onFail(){
			Frame.Msg.info("删除班级失败！");
			Utils.Base.refreshCurPage();
		}

		Frame.Msg.confirm("是否确定删除？",function(){
			$.each(arr,function(index,para){
				delClass({
					classId: para.classId,
					gradeType: para.gradeType,
					baseGrade:para.baseGrade,
					years:para.years
				},onSuc,onFail)
			})
		})

	}

	function addClassHandle(param,para) {
		var aYear = [];
		var thisYear = (new Date()).getFullYear();
		var i=20;
		for(;--i;)
		{
			aYear.push(thisYear);
			thisYear--;
		}
		var closeWindow = function () {
			Utils.Pages.closeWindow(Utils.Pages.getWindow($("#addClass_form")));
		}

		if(param.length>0&&para!="add") {
			var oTempTableedit = {
				index: [],
				column: [
					'years',
					'baseGrade',
					'classId',
					'teacher',
					'teacherTel'
				]
			}
			$("#addClass_form").form("init", "edit", {
				"title": "修改班级",
				"btn_apply": function () {
					var oStData = $("#addClass_form").form("getTableValue", oTempTableedit);
					oStData.baseGrade = parseInt(oStData.baseGrade);
					var month = $("#months").val();
					oStData.years = new Date($("#years").singleSelect("value") + "/" + month + "/01") - 0;
					oStData.schoolType = schoolType;
					oStData.classId = oStData.classId;
					oStData.teacher = oStData.teacher;
					oStData.teacherTel = oStData.teacherTel;
					modifyClassData(oStData);
					Utils.Pages.closeWindow(Utils.Pages.getWindow($("#addClass_form")));
				}, "btn_cancel": closeWindow
			});
			$("label.error").attr("style","display:none");
			$("input.required.text-error").removeClass("text-error");
			$("#addClass_form").form('updateForm', {
				'years': (new Date(param[0].years)).getFullYear(),
				'months':(new Date(param[0].years)).getMonth()+1,
				'baseGrade':'',
				'classId': param[0].classId,
				'teacher': param[0].teacher,
				'teacherTel': param[0].teacherTel
			});
			var aGradeString = [];
			$.each(aGradeConf,function(index,item){
				aGradeString.push({valueField:index,displayField:item.gradeString});
			});

			$("#baseGrade").singleSelect("InitData",aGradeString);
			$("#baseGrade").singleSelect("value",""+param[0].baseGrade);
			Utils.Base.openDlg(null, {}, { scope: $("#EditClassDlg"), className: "modal-super" });
			$("#years").singleSelect("disable");
			$("#baseGrade").singleSelect("disable");
			$("#months").attr("disabled","disabled");
			$("#classId").attr("disabled","disabled");
			//$("#years").singleSelect("InitData",aYear);
		}else{
			var oTempTable = {
				index: [],
				column: [
					'years',
					'baseGrade',
					'classId',
					'teacher',
					'teacherTel'
				]
			}
			$("#addClass_form").form("init", "edit", {
				"title": "新增班级",
				"btn_apply": function () {
					var oStData = $("#addClass_form").form("getTableValue", oTempTable);
					oStData.baseGrade = parseInt(oStData.baseGrade);
					var month = $("#months").val();
					oStData.years = new Date($("#years").singleSelect("value")+"/"+month+"/01")-0;
					addClassData(schoolType,oStData);
					closeWindow();
				}, "btn_cancel": closeWindow
			});
			$("label.error").attr("style","display:none");
			$("input.required.text-error").removeClass("text-error");
			$("#addClass_form").form('updateForm', {
				'years': (new Date()).getFullYear(),
				'months':(new Date()).getMonth()+1,
				'baseGrade': '',
				'classId': '',
				'teacher': '',
				'teacherTel': ''
			});
			Utils.Base.openDlg(null, {}, { scope: $("#EditClassDlg"), className: "modal-super" });
			$("#s2id_baseGrade span.select2-chosen").html("");
			$("#years").singleSelect("enable");
			$("#baseGrade").singleSelect("enable");
			$("#months").removeAttr("disabled");
			$("#classId").removeAttr("disabled");
			//$("#years").singleSelect("InitData",aYear);
		}


	}

	function selectClassroom(params) {
		var imgPath = MyConfig.path + '/wloc/map' + $('#MapSelect').singleSelect('value');
		var img = new Image();
		g_classdata = JSON.parse($(params.toElement).attr('data'));
        img.onload = function () {
            var img = this,
                imgW = img.width,
                imgH = img.height;
            var canvas = document.getElementById('classCanvas'),
                canvasW = 800,
                canvasH = imgH * (canvasW / imgW);
            var canvasCocos = document.getElementById('Cocos2dGameContainer');
            canvasCocos.style.width = canvasW + "px";
            canvasCocos.style.height = canvasH + "px";
            cc.director._winSizeInPoints.width = canvasW;
            cc.director._winSizeInPoints.height = canvasH;
            canvas.width = canvasW;
            canvas.height = canvasH;
            var canv = document.createElement('canvas');
            canv.width = canvasW;
            canv.height = canvasH;
            var cxt = canv.getContext('2d');
            //cxt.drawImage(img, 0, 0, canvasW, canvasH);
            cxt.drawImage(img, 0, 0, imgW, imgH, 0, 0, canvasW, canvasH);
            //var imagebase64 = canv.toDataURL("image/jpeg");
            var imagebase64 = canv.toDataURL();
            cc.loader.loadImg(imagebase64, { isCrossOrigin: false }, function (err, img) {
                g_bgLayerClass.setBackgroundImage(img);
				var locationName = $("#s2id_MapSelect span").html();
				getLocationArea(locationName).done(function (areadata) {
					var areaArray = analysisAreaInfo(areadata, locationName);
					g_areaLayerClass.clean();
					for (var i = 0; i < areaArray.length; i++) {
						for (var j = 0; j < areaArray[i].positionArea.length; j++) {
							areaArray[i].positionArea[j].x = areaArray[i].positionArea[j].x * (canvasW / imgW);
							areaArray[i].positionArea[j].y = areaArray[i].positionArea[j].y * (canvasW / imgW);
						}
					}
					g_areaArrayClassClass = areaArray;
					/* 画区块 */
					g_areaLayerClass.setAreaNode(g_areaArrayClassClass);
					g_areaLayerClass.addAreaNode();
				});
            });
        }
        img.src = imgPath;
		Utils.Base.openDlg(null, {}, { scope: $("#selectClassroom"), className: "modal-super" });
	}
	function initForm() {
		getGradeConf(function(aData,textStatus,jqXHR){
			if(aData.retCode != 0){
				Frame.Msg.Info("更新学生数据失败！");
			}
			//获取 升级月份、年级类型、年级
			monthType = aData.result.gradeMonth;
			schoolType = aData.result.gradeType;
			aGradeConf = aData.result.gradeConf;
		});
		var closeWindowselect = function () {
			Utils.Pages.closeWindow(Utils.Pages.getWindow($("#selectClassroom")));
		}
		var setClassroom = function () {
			modifyClassData(g_classdata);
		}
		$("#select_from").form("init", "edit", {
			"title": "选择地图",
			"btn_apply": setClassroom,
			"btn_cancel": closeWindowselect
		});

	}

	function initEvent() {
        
        function setBreadContent(paraArr){
            
            if(paraArr[0].text != ""){
                $("#bread_1").css("display",'inline');
                $("#bread_1 a").attr("href",paraArr[0].href);
                $("#bread_1 a").text(paraArr[0].text);
            }else{
                $("#bread_1").css("display",'none');
            }
            
            if(paraArr[1].text != ""){
                $("#bread_2").css("display",'inline');
                $("#bread_2 a").attr("href",paraArr[1].href);
                $("#bread_2 a").text(paraArr[1].text);
            }else{
                $("#bread_2").css("display",'none');
            }
            
            if(paraArr[2].text != ""){
                $("#bread_active").css("display",'inline');
                $("#bread_active").text(paraArr[2].text);
            }else{
                $("#bread_active").css("display",'none');
            }
        }
        setBreadContent([{text:'',href:''},
                        {text:'',href:''},
                        {text:'班级管理',href:''}]);
                        
		$("input[name=SchoolType]").on("click",function(){
			$(".editGrade").css("display","none");
		});
		$("#Diy").on("click",function(){
			//$("#diyGradeName").children().has(".minput-remove").remove();
			$(".editGrade").css("display","block");
		});
		$("#gradetype_form a#filter_ok").on("click",function(){
			monthType = $("input[name=Month]:checked").attr("value");
			schoolType = $("input[name=SchoolType]:checked").attr("value");
			aGradeConf = [];
			switch(schoolType){
				case "1":{
					var sType= $("#primarySpan").html().split(",");break;

				}
				case "2":{
					var sType= $("#juniorSpan").html().split(",");break;
				}
				case "3":{
					var sType = $("#seniorSpan").html().split(",");break;
				}
				case "4":{
					var sType = $("#midSpan").html().split(",");break;
				}
				case "5":{
					var sType = $("#diyGradeName").Minput("value");break;
				}
				default:
					break;
			}

			$.each(sType,function(index,item){
				var oGradeConf = {};
				oGradeConf.gradeString = item;
				oGradeConf.gradeSequence = index;
				aGradeConf.push(oGradeConf);
			});
			var oParam = {
				gradeType:schoolType,
				gradeConf:aGradeConf,
				gradeMonth:parseInt(monthType)
			};
			function onSuccess(aData,textstatus,jqXHR){
				if(aData.retCode != 0){
					Frame.Msg.info("年级配置失败！");
				}
				Frame.Msg.info("年级配置成功！");
				initConfig();
				$(".top-box").css("display","none");
				Utils.Base.refreshCurPage();
			}
			setGradeConfiguration(oParam,onSuccess);
		});
		$("#gradetype_form a#filter_Remove").on("click",function(){
			$(".top-box").css("display","none");
		});
		$("#CurType").unbind("click").on("click",function(){
			$(".top-box").toggle();
		});
	}

	function initData() {
		function onSuccess(aData,textstatus,jqXHR){
			if(aData.retCode != 0){
				Frame.Msg.Info("更新学生数据失败！");
			}
			//获取 升级月份、年级类型、年级
			monthType = aData.result.gradeMonth;
			schoolType = aData.result.gradeType;
			aGradeConf = aData.result.gradeConf;
			getClassData();
		}
		getGradeConf(onSuccess);

	}


	function initSlist() {
		function formate(row, cell, value, columnDef, dataContext, type) {
			if (type == 'text') {
				return value;
			}
			switch(cell) {
				case 0:{
					var years = (new Date(dataContext["years"]-0)).getFullYear();
					return "<p>"+value+"("+years+"级)"+"</p>"
				}
				case 1:
					return "<p>"+value+"班</p>";
					break;
				case 2:
					var value = "未指定";
					if (typeof dataContext.classroom !== "undefined") {
						value = dataContext.classroom;
					}
					var classdate = JSON.stringify(dataContext);
					return "<a href='javascript:;'  class='slist-link class-name'  value=" + value + " data=" + classdate + ">" + value + "</a>";
					break;
				case 3:
					return  "<a href='javascript:;' class='slist-link stu-count' grade='"+dataContext['grade']+"' classId='"+dataContext['classId']+"' years= "+dataContext['years']+" gradeType="+dataContext['gradeType']+" baseGrade="+dataContext['baseGrade']+">" + value + "</a>";
					break;
				default:
					break;
			}
		}

		function enterStuList(){
			var oPara = {
				classId:$(this).attr("classId"),
				years:$(this).attr("years"),
				gradeType:$(this).attr("gradeType"),
				baseGrade:$(this).attr("baseGrade"),
				grade:$(this).attr("grade")
			}
			Utils.Base.redirect({np:"classroom.studentmanage",classId:oPara.classId,years:oPara.years,gradeType:oPara.gradeType,baseGrade:oPara.baseGrade,grade:oPara.grade});

		}

		var option = {
			colNames: '年级,班号,教室,学生数,班主任,班主任联系方式'.split(','),
			showHeader: true,
			multiSelect: true,
			showOperation: true,
			pageSize: 10,
			asyncPaging: true,
			sort:false,
			onSearch: function (oFilter, oSorter) {
				if(oFilter != null)
				{
					var oFilt = {
						grade:oFilter.grade,
						classIdWeak:oFilter.classId,
						classroomWeak:oFilter.classroom,
						studentCnt:oFilter.studentCnt,
						teacherWeak:oFilter.teacher,
						teacherTelWeak:oFilter.teacherTel
					};
				}
				getClassData(0, 10, oFilt);
			},
			onPageChange: function (pageSize, pageNum, oFilter) {
				if(oFilter != null)
				{
					var oFilt = {
						grade:oFilter.grade,
						classIdWeak:oFilter.classId,
						classroomWeak:oFilter.classroom,
						studentCnt:oFilter.studentCnt,
						teacherWeak:oFilter.teacher,
						teacherTelWeak:oFilter.teacherTel
					};
				}
				getClassData(pageNum, pageSize, oFilt);
			},
			colModel: [
				{name:'grade',formatter:formate},
				{ name: 'classId',formatter:formate },
				{ name: 'classroom', formatter: formate }, // 这里可以配置 参数datatype为 order  需要后台的支持
				{ name: 'studentCnt', formatter: formate },
				{ name: 'teacher' },
				{ name: 'teacherTel' }
			],
			buttons: [
				{ name: 'add',enable:"<1",action: addClassHandle},
				{ name: 'default', value: '删除', enable: ">0", icon: 'slist-del', action: delClassData },
				//{ name: 'default', value: '导出', icon: 'fa fa-arrow-circle-o-down' },
				{ name: 'edit' ,action:addClassHandle},
				{ name: 'delete', action: delClassData },
			]
		};

		$("#classList").on('click','a.stu-count',enterStuList);
		$("#classList").on('click', 'a.class-name', selectClassroom);
		$("#classList").SList("head", option);
		$("#classList span.sort-icon").remove();
	}
	
	function initSingleSelect() {
		var year = (new Date()).getFullYear();
		var arr = [];
		for (var i = 0 ;i < 100; i++) {
			arr.push(year - 20 + i + '');
		}
		$('#years').singleSelect('InitData', arr);
		function onSuccess(aData,textstatus,jqXHR){			
			if(aData.retCode != 0){				
				Frame.Msg.Info("更新学生数据失败！");
			}
			//获取 升级月份、年级类型、年级
			monthType = aData.result.gradeMonth;
			schoolType = aData.result.gradeType;
			aGradeConf = aData.result.gradeConf;

			var aBeginGrade = [];
			$.each(aGradeConf,function(index,item){
				aBeginGrade.push({"displayField":item.gradeString,"valueField":index});
			});

			$("#baseGrade").singleSelect('InitData',aBeginGrade,{displayField:"displayField",valueField:"valueField"})

			getClassData();
		}
		getGradeConf(onSuccess);


		var layer = 1;
		var room = 1;
		var roomArr = [];
		for (var i = 0; i < 5; i ++){
			for (var j = 0; j < 10; j++) {
				var roomNum = room + j + '';
				roomNum = roomNum.length > 1 ? roomNum : '0' + roomNum;
				roomArr.push('' + (layer + i) + roomNum);
			}
		}
		$('#classroom').singleSelect('InitData', roomArr);
	}

	function initConfig(){
		function onSuccess(aData,textstatus,jqXHR){
			if(aData.retCode != 0){				
				if(aData.retCode = -2){
					var oParam = {
						gradeType:1,
						gradeConf:[
							{"gradeString":"一年级","gradeSequence":1},
							{"gradeString":"二年级","gradeSequence":2},
							{"gradeString":"三年级","gradeSequence":3},
							{"gradeString":"四年级","gradeSequence":4},
							{"gradeString":"五年级","gradeSequence":5},
							{"gradeString":"六年级","gradeSequence":6}
						],
						gradeMonth:9
					};
					function onSuc(aData,textStatus,jqXHR){
						if(aData.retCode != 0){
							Frame.Msg.Info("获取配置信息失败！");
						}
						initConfig();
					}
					setGradeConfiguration(oParam,onSuc);
				}
				Frame.Msg.Info("更新学生数据失败！");
			}
			//获取 升级月份、年级类型、年级
			monthType = aData.result.gradeMonth;
			schoolType = aData.result.gradeType;//1 小学六年制  2 初中三年制  3高中三年制   4综合中学   5自定义
			aGradeConf = aData.result.gradeConf;
			var aGradeString = [];
			$.each(aGradeConf,function(index,item){
				aGradeString.push(item.gradeString);
			})
			initData();
			switch(schoolType){
				case 1:
					$("#CurType").html("六年制小学");
					$("input[name=SchoolType]").MCheckbox("setState",false);
					$("#Primary").MCheckbox("setState",true);
					break;
				case 2:
					$("#CurType").html("三年制初中");
					$("input[name=SchoolType]").MCheckbox("setState",false);
					$("#Junior").MCheckbox("setState",true);
					break;
				case 3:
					$("#CurType").html("三年制高中");
					$("input[name=SchoolType]").MCheckbox("setState",false);
					$("#Senior").MCheckbox("setState",true);
					break;
				case 4:
					$("#CurType").html("综合中学");
					$("input[name=SchoolType]").MCheckbox("setState",false);
					$("#MidSchool").MCheckbox("setState",true);
					break;
				case 5:
					$("#CurType").html("自定义");
					$("input[name=SchoolType]").MCheckbox("setState",false);
					$("#Diy").MCheckbox("setState",true);
					$("#diyGradeName").children().has(".minput-remove").remove();
					$("#diyGradeName").Minput("value",[]);
					$("#diyGradeName").Minput("value",aGradeString);
					//$("#diyGradeName").children().has(".minput-remove").remove();
					$(".editGrade").css("display","block");
					break;
				default:
					break;
			}

			switch(monthType){
				case 1:
					$("input[name=Month]").MCheckbox("setState",false);
					$("#Janu").MCheckbox("setState",true);
					break;
				case 2:
					//$("input[name=Month]").removeAttr("checked");
					$("input[name=Month]").MCheckbox("setState",false);
					//$("#Feb").attr("checked");
					$("#Feb").MCheckbox("setState",true);
					break;
				case 3:
					$("input[name=Month]").MCheckbox("setState",false);
					$("#March").MCheckbox("setState",true);
					break;
				case 4:
					$("input[name=Month]").MCheckbox("setState",false);
					$("#Apr").MCheckbox("setState",true);
					break;
				case 5:
					$("input[name=Month]").MCheckbox("setState",false);
					$("#May").MCheckbox("setState",true);
					break;
				case 6:
					$("input[name=Month]").MCheckbox("setState",false);
					$("#June").MCheckbox("setState",true);
					break;
				case 7:
					$("input[name=Month]").MCheckbox("setState",false);
					$("#July").MCheckbox("setState",true);
					break;
				case 8:
					$("input[name=Month]").MCheckbox("setState",false);
					$("#Aug").MCheckbox("setState",true);
					break;
				case 9:
					$("input[name=Month]").MCheckbox("setState",false);
					$("#Sept").MCheckbox("setState",true);
					break;
				case 10:
					$("input[name=Month]").MCheckbox("setState",false);
					$("#Oct").MCheckbox("setState",true);
					break;
				case 11:
					$("input[name=Month]").MCheckbox("setState",false);
					$("#Nove").MCheckbox("setState",true);
					break;
				case 12:
					$("input[name=Month]").MCheckbox("setState",false);
					$("#Dec").MCheckbox("setState",true);
					break;
				default:
					break;
			}
			console.log("getGradeConf:"+new Date()+":monthType:"+monthType+"schoolType:"+schoolType+"aGradeConf:"+aGradeConf);

		}
		getGradeConf(onSuccess);
	}

	function changeLoadImg(imagePath) {
        var img = new Image();
        img.onload = function () {
            var img = this,
                imgW = img.width,
                imgH = img.height;
            var canvas = document.getElementById('classCanvas'),
                canvasW = canvas.parentElement.offsetWidth,
                canvasH = imgH * (canvasW / imgW);
            var canvasCocos = document.getElementById('Cocos2dGameContainer');
            canvasCocos.style.width = canvasW + "px";
            canvasCocos.style.height = canvasH + "px";
            cc.director._winSizeInPoints.width = canvasW;
            cc.director._winSizeInPoints.height = canvasH;
            canvas.width = canvasW;
            canvas.height = canvasH;
            var canv = document.createElement('canvas');
            canv.width = canvasW;
            canv.height = canvasH;
            var cxt = canv.getContext('2d');
            cxt.drawImage(img, 0, 0, canvasW, canvasH);
            //cxt.drawImage(img, 0, 0, imgW, imgH, 0, 0, canvasW, canvasH);
            //var imagebase64 = canv.toDataURL("image/jpeg");
            var imagebase64 = canv.toDataURL();
            cc.loader.loadImg(imagebase64, { isCrossOrigin: false }, function (err, img) {
				g_areaLayerClass.clean();
                g_bgLayerClass.setBackgroundImage(img);
				var locationName = $("#s2id_MapSelect span").html();
				getLocationArea(locationName).done(function (areadata) {
					var areaArray = analysisAreaInfo(areadata, locationName);
					// for (var i = 0; i < areaArray.length; i++) {
					// 	for (var j = 0; j < areaArray[i].positionArea.length; j++) {
					// 		areaArray[i].positionArea[j].x = areaArray[i].positionArea[j].x * (canvasW / imgW);
					// 		areaArray[i].positionArea[j].y = areaArray[i].positionArea[j].y * (canvasW / imgW);
					// 	}
					// }
					g_areaArrayClassClass = areaArray;
					/* 画区块 */
					g_areaLayerClass.setAreaNode(g_areaArrayClassClass);
					g_areaLayerClass.addAreaNode();
				});
            });
        }
        img.src = imagePath;
		var locationName = $("#s2id_MapSelect span").html();
    }
	function initCocos(imagePath, areaArray, data) {
		var img = new Image();
        // img.crossOrigin = "anonymous";
        img.onload = function () {
            // get image size
            var img = this,
                imgW = img.width,
                imgH = img.height;
            // get parent size;
            var canvas = document.getElementById('classCanvas'),
                canvasW = canvas.parentElement.offsetWidth,
                canvasH = imgH * (canvasW / imgW);
            for (var i = 0; i < areaArray.length; i++) {
                for (var j = 0; j < areaArray[i].positionArea.length; j++) {
                    areaArray[i].positionArea[j].x = areaArray[i].positionArea[j].x * (canvasW / imgW);
                    areaArray[i].positionArea[j].y = areaArray[i].positionArea[j].y * (canvasW / imgW);
                }
            }
            // set canvas size;    
            canvas.width = canvasW;
            canvas.height = canvasH;
            // begin cocos
            var BackgroundLayer = $("canvas").cocos("BackgroundLayer");
            var DrawNode = cc.Node.extend({
                ctor: function (position, areaName, locationName) {
                    this._super();
                    var winSize = cc.director.getWinSize();
                    this.areaName = areaName;
                    this.locationName = locationName;
                    //node.drawRect(cc.p(0,0), cc.p(100, 100), cc.color(255, 0, 0), 1, cc.color(0, 0, 0, 0));
                    var points = [];
                    this.points = points;
                    for (var i = 0; i < position.length; i++) {
                        points.push(cc.p(position[i].x, winSize.height - position[i].y));
						var myLabel = new cc.LabelTTF(this.areaName, 'Georgia', /*80*/20, cc.size(0, 0));
						myLabel.setPosition(cc.p(position[i].x, winSize.height - position[i].y));
						myLabel.setColor(cc.color(0, 0, 0, 255));
						this.addChild(myLabel);
                    }
                    var node = new cc.DrawNode();
                    this.areaLayer = node;
                    node.drawDots(points, 4, cc.color(255, 0, 0, 100));
                    node.drawPoly(points, cc.color(255, 0, 0, 0), 1.5, cc.color(0, 0, 255));
                    this.addChild(node);
                    cc.eventManager.addListener({
                        event: cc.EventListener.MOUSE,
                        swallowTouches: true,
                        onMouseMove: this.onMouseMove.bind(this),
                        onMouseDown: this.onMouseDown.bind(this)
                    }, this);
                },
                onMouseDown: function (e) {
                    console.log("1111");
                    console.log(this.areaName);
                    var positon = e.getLocation();
                    if (isInsidePolygon(positon, this.points)) {
                        var areaName = this.areaName;
                        if (typeof this.fullLayer === "undefined") {
                            var node = new cc.DrawNode();
                            this.fullLayer = node;
                            node.drawPoly(this.points, cc.color(160, 158, 165, 100), 2, cc.color(0, 0, 255, 0));
                            this.addChild(node);
							g_classdata.classroom = this.areaName;
                        }
                        console.log(areaName);
                    }
                    else {
                        this.removeChild(this.fullLayer);
                        delete this.fullLayer;
                    }
                    console.log(positon);
                },
                onMouseMove: function (e) {
                    var node = new cc.DrawNode();
                    var positon = e.getLocation();
                    if (isInsidePolygon(positon, this.points)) {
						// this.removeChild(this.myLabel);
						// var myLabel = new cc.LabelTTF(this.areaName, 'Arial', /*80*/30, cc.size(0, 0));
						// this.myLabel = myLabel;
						// myLabel.setPosition(positon);
						// myLabel.setColor(cc.color(128, 128, 128, 255));
						// this.addChild(myLabel);
                    }
                },
                getareaLayer: function () {
                    return this.areaLayer;
                }
            });
            var AreaLayer = cc.Layer.extend({
                areaNodeList: [],
                ctor: function (areaNodeList) {
                    this._super();
                    this.areaNodeList = areaNodeList;
                },
                clean: function () {
                    this.areaNodeList = [];
                    this.removeAllChildrenWithCleanup(false);
                },
                addAreaNode: function () {
                    for (var i = 0; i < this.areaNodeList.length; i++) {
                        var areaNode = new DrawNode(this.areaNodeList[i].positionArea, this.areaNodeList[i].areaName, this.areaNodeList[i].areaLocation);
                        this.addChild(areaNode);
                    }
                },
                setAreaNode: function (areaNodeList) {
                    this.areaNodeList = areaNodeList;
                }
            });
            var MapScene = cc.Scene.extend({
                onEnter: function () {
                    this._super();
                    cc.director.setDisplayStats(false);
                    /*添加背景层*/
                    var bgLayer = new BackgroundLayer(false);
                    this.bgLayer = bgLayer;
                    this.addChild(bgLayer);
                    g_bgLayerClass = bgLayer;
                    var canv = document.createElement('canvas');
                    canv.width = canvasW;
                    canv.height = canvasH;
                    var cxt = canv.getContext('2d');
                    cxt.drawImage(img, 0, 0, canvasW, canvasH);
                    var imagebase64 = canv.toDataURL();
                    cc.loader.loadImg(imagebase64, { isCrossOrigin: false }, function (err, img) {
                        g_bgLayerClass.setBackgroundImage(img);
                    });
                    /*添加区块层*/
                    var areaLayer = new AreaLayer(areaArray);
                    //areaLayer.addAreaNode();
                    this.areaLayer = areaLayer;
                    g_areaLayerClass = areaLayer;
                    this.addChild(areaLayer);
                    // bind event here
                    /* 获取追踪轨迹开关的状态 */
                }
            });
            cc.game.onStart = function () {
                cc.LoaderScene.preload([], function () {
                    g_mapScene = new MapScene();
                    cc.director.runScene(g_mapScene);
                }, this);
            }
            cc.game.run("classCanvas");
        }
		img.src = imagePath;
	}
	function analysisAreaInfo(areadata, locationName) {
        var areaArray = [];
        for (var i = 0; i < areadata.locatinArea.length; i++) {
            var areaPoint = areadata.locatinArea[i].areaPoint.substring(1, areadata.locatinArea[i].areaPoint.length - 1);
            var areaA = areaPoint.split("L");
            var positionArea = [];
            for (var j = 0; j < areaA.length; j++) {
                var point = areaA[j].split(" ");
                var position = {
                    x: point[0] * 1,
                    y: point[1] * 1
                };
                positionArea.push(position);
            }
            var areaInfo = {
                positionArea: positionArea,
                areaName: areadata.locatinArea[i].areaName,
                areaLocation: locationName
            };
            areaArray.push(areaInfo);
        }
        return areaArray;
    };
	function isInsidePolygon(pt, poly) {
        for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
            ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
                && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
                && (c = !c);
        return c;
    }
	function initMapList() {
		$('#classCanvas').click(function (e) {
            e.stopPropagation();
            $('#testhide').click();
        });
        getMapList().done(function (data) {
            // init singleselect data;
            var aData = data.locationImage;
            var oOpt = {
                displayField: 'locationName',
                valueField: 'imagePath'
            };
            $('#MapSelect').singleSelect('InitData', aData, oOpt);
            $('#MapSelect').on('change', function (e) {
                var imgPath = $('#MapSelect').singleSelect('value');
                changeLoadImg(MyConfig.path + '/wloc/map' + imgPath);
            });
			getLocationArea(aData[0].locationName).done(function (areadata) {
                var areaArray = analysisAreaInfo(areadata, aData[0].locationName);
                g_areaArrayClassClass = areaArray;
                initCocos(MyConfig.path + '/wloc/map' + aData[0].imagePath, areaArray, data);
            });
        });
    }
	function _init() {
		initSingleSelect();
		initSlist();
		initConfig();
		initForm();
		initEvent();
		initMapList();
	}

	function _destroy() {
		monthType = null;
		schoolType = null;
		aGradeConf = [];
	}

	Utils.Pages.regModule(MODULE_NAME, {
		"init": _init,
		"destroy": _destroy,
		"widgets": ["SList", "Minput", "Form", 'SingleSelect', "DateTime", "DateRange", "Echart", "Minput", "Switch", 'Cocos'],
		"utils": ["Request", "Base", "Timer", 'Device']
	});
})(jQuery);

