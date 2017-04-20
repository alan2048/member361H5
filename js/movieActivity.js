$(function () {
	GetSchoolJYIds_port();
	courseName();
});  
function courseName() {
	// 校园选项卡切换
	$("#myTab").on("click",">li >a",function () {
		var schoolId=$(this).attr("data-school");
		if($("#myTabContent >div.tab-pane[data-school="+schoolId+"]").children().length ==0){
			GetSchoolCourses_port(schoolId);
		}
	});

	// 预定课程
	$("#myTabContent").on("click",".courseBtn",function (e) {
		e.stopPropagation();    
		if($(this).hasClass("current")){
			$("#modal01").modal("show");
			$("#success01").attr("data-id",$(this).attr("data-id")).attr("data-time",$(this).attr("data-time"));
		}else{
			BookCourse_port($(this).attr("data-id"),$(this).attr("data-time"));
		};
	});

	// 取消预定
	$("#success01").on("click",function () {
		UnbookCourse_port($(this).attr("data-id"),$(this).attr("data-time"));
	});

	// 课程详情
	$("#myTabContent").on("click",".row",function () {
		$(this).parents("#course").removeClass("current").next("section").addClass("current");
		GetCourseDetails_port($(this).attr("data-id"));
	});

	// 返回课程列表
	$("#detail").on("click","#backBtn",function () {
		$(this).parents("#detail").removeClass("current").prev("section").addClass("current");
	});

	// 详情 预约
	$("#detail").on("click","#order",function () {
     	if($(this).hasClass("current")){
     		UnbookCourse_port($(this).attr("data-id"),$(this).attr("data-time"),1);
     	}else{
     		BookCourse_port($(this).attr("data-id"),$(this).attr("data-time"),1);
     	}
    });

    // 介绍详情
    $("#detail").on("click",".detailText01",function () {
        $(this).hide().next(".detailText02").show(); 
    });
};


// 获取园区ID
function GetSchoolJYIds_port() {
    var data={
            useruuid:user.useruuid
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.GetSchoolJYIds,param,GetSchoolJYIds_callback);
};
function GetSchoolJYIds_callback(res) {
    if(res.code==200){
        if(res.data =="[]"){
            $("#modal03").modal("show");
        }else{
            var data=JSON.parse(res.data);
            var data01={data:data};
            var html=template("myTab_script",data01);
            $("#myTab").empty().append(html);

            var html01=template("myTabContent_script",data01);
            $("#myTabContent").empty().append(html01);
            GetSchoolCourses_port($("#myTab >li.active >a").attr("data-school"));
        }
    }else{
        // alert("系统故障，请稍候重试。。");
        // console.log('请求错误，返回code非200');
    }
};


// 获取学校课程
function GetSchoolCourses_port(id) {
    var data={
    		schoolId:id,
            useruuid:user.useruuid
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.GetSchoolCourses,param,GetSchoolCourses_callback,id);
};
function GetSchoolCourses_callback(res,id) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        for(var i=0;i<data.length;i++){
        	data[i].pic=httpUrl.path_img+data[i].pic
        };
        var data01={data:data}
        var html=template("course_script",data01);
		$("#myTabContent >div.tab-pane[data-school="+id+"]").empty().append(html);
       
    }else{
        // console.log('请求错误，返回code非200');
    }
};


// 课程详情 
function GetCourseDetails_port(id) {
    var data={
            courseId:id,
            useruuid:user.useruuid
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.GetCourseDetails,param,GetCourseDetails_callback);
};
function GetCourseDetails_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        data.pic=httpUrl.path_img+data.pic;
        if(data.coursePics){
            data.coursePics=JSON.parse(data.coursePics);
        };
        for(var i=0;i<data.coursePics.length;i++){
            if(data.coursePics){
                data.coursePics[i]=httpUrl.path_img+data.coursePics[i];
            };
        };
        
        var w=Math.floor((window.screen.width-30)/16.5);
        if(data.detailContent.length >w){
            data.detailType=1;
            data.detailContent01=data.detailContent.slice(0,w);
            data.detailContent02=data.detailContent.slice(w);
        }else{
            data.detailType=0;
        }
        template.defaults.escape=false;
        var html=template("detail_script",data);
        $("#detail >.container").empty().append(html);

        $("#detail .row.content .detailPic >div").width(data.coursePics.length*250+10);

    }else{
        // console.log('请求错误，返回code非200');
    }
};


// 预约课程
function BookCourse_port(id,time,type) {
    var data={
    		courseId:id,
    		time:time,
            useruuid:user.useruuid
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.BookCourse,param,BookCourse_callback,id,type);
};
function BookCourse_callback(res,id,type) {
    if(res.code==200){
        GetSchoolCourses_port($("#myTab >li.active >a").attr("data-school"));
        tip(res.data);
        if(type==1){
        	GetCourseDetails_port(id);
        }
    }else{
        // console.log('请求错误，返回code非200');
    }
};

// 取消预约课程
function UnbookCourse_port(id,time,type) {
    var data={
    		courseId:id,
    		time:time,
            useruuid:user.useruuid
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.UnbookCourse,param,UnbookCourse_callback,id,type);
};
function UnbookCourse_callback(res,id,type) {
    if(res.code==200){
        $("#modal01").modal("hide");
       	GetSchoolCourses_port($("#myTab >li.active >a").attr("data-school"));
       	if(type==1){
        	GetCourseDetails_port(id);
        	tip(res.data);
        }
    }else{
        // console.log('请求错误，返回code非200');
    }
};


function tip(text) {
	$("#modal04 >span").html(text);
	$("#modal04").show();
	setTimeout("tipHide()",1500);
}
function tipHide() {
	$("#modal04").hide()
};