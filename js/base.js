var user={
		useruuid:GetQueryString("useruuid") || "b0520db6-014e-49d9-8db1-206ae3530d58"
};
if(!user.useruuid){
	alert("UUid为空");
};
var serverUrl01="http://www.member361.com";//84正式服务器
var serverUrl02="http://121.43.150.38";//38测试服务器
var serverUrl03="http://172.168.90.102:8080";//38测试服务器

var path=serverUrl01; //更改服务器地址可设置此值

var httpUrl={
		path_img:path+"/jfinal_mbjy_basic/file/showImg?fileMd5=", // 图片地址

		GetSchoolIds:path+":15001/imsInterface/TSCourse_GetSchoolIds",//获取学校课程id
        GetSchoolJYIds:path+":15001/imsInterface/TSCourse_GetSchoolJYIds",//剧场活动 id
		GetSchoolCourses:path+":15001/imsInterface/TSCourse_GetSchoolCourses",//获取学校课程
		GetCourseDetails:path+":15001/imsInterface/TSCourse_GetCourseDetails",//获取学校课程详情
		BookCourse:path+":15001/imsInterface/TSCourse_BookCourse",//获取学校课程 预定
		UnbookCourse:path+":15001/imsInterface/TSCourse_UnbookCourse",//获取学校课程 取消预定
		CommentCourse:path+":15001/imsInterface/TSCourse_CommentCourse",//获取学校 评论

		// 08设置
		setting:'' 
};
function initAjax(url,param,callback,callback01,callback02) {
	$.ajax({
            type:"POST",
            url:url,
            data:param,
            dataType:"json",
            statusCode:{
                404:function(){
                    alert("访问地址不存在或接口参数有误 错误代码404");
                },
                500:function(){
                    console.log("因为意外情况，服务器不能完成请求 错误代码500");
                    // window.location.href=httpUrl.loginHttp;
                },
                405:function(){
                    alert("资源被禁止 错误代码405");
                }
            },
            beforeSend:function () {
            	// loadingIn();// loading载入
            },	
            success:function(result){
                callback(result,callback01,callback02);
                // loadingOut(); // loading退出
            },
            error:function(result){
                console.log("请求失败 error!");
                // window.location.href=httpUrl.loginHttp;
            }
        });	
};

// 地址栏search参数筛选函数
function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var result = window.location.search.substr(1).match(reg);
     return result?decodeURIComponent(result[2]):null;
};


