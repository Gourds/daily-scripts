// Host
var baseUrl = 'http://{{api_site}}';


// 初始化加载
$(function() {
	// 支持Crossdomain
	$.support.cors = true;
		
	// 显示已登录用户nd
	$('#user_info').html('<small>Welcome,</small>'+$.cookie('cuserName'));
		
	// 注册按钮状态
	$("#agreeCBox").bind("click", function () {
		if($('#agreeCBox').attr('checked')){
			$('#formSubBtn').addClass('btn-success');
			$('#formSubBtn').disabled = false;
		} else {
			$('#formSubBtn').removeClass('btn-success');
			$('#formSubBtn').disabled = true;
		}
	});
	if($('#agreeCBox').attr('checked')){
		$('#formSubBtn').addClass('btn-success');
		$('#formSubBtn').disabled = false;
	} else {
		$('#formSubBtn').removeClass('btn-success');
		$('#formSubBtn').disabled = true;
	}
}) 

// 全角转换成半角
function ToCDB(str) {
	var tmp = "";
	for(var i=0;i<str.length;i++) {
		if(str.charCodeAt(i)>65248&&str.charCodeAt(i)<65375) {
			tmp += String.fromCharCode(str.charCodeAt(i)-65248);
		} else {
			tmp += String.fromCharCode(str.charCodeAt(i));
		}
	}

	return tmp
}

// 获取url参数
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]); return null;
}

// 获得token
function getToken() {
	var access_token = $.cookie('access_token');
	return access_token;
}

// app概况也显示代码
function showCode(boxId){
	// IOS
	if('iosTab' == boxId){
		$('#iosTab').addClass('visible');
		
		var androidTabClassVal = $('#androidTab').attr('class');
		if(androidTabClassVal.indexOf("visible") > -1){
			$('#androidTab').removeClass('visible');
		}
	}
	// Android
	if('androidTab' == boxId){
		$('#androidTab').addClass('visible');
		
		var iosTabClassVal = $('#iosTab').attr('class');
		if(iosTabClassVal.indexOf("visible") > -1){
			$('#iosTab').removeClass('visible');
		}
	}
}

// 显示不同窗口
function show_box(boxId){
	// 登录
	if('login-box' == boxId){
		$('#login-box').addClass('visible');
		
		var oldSignupClassVal = $('#signup-box').attr('class');
		if(oldSignupClassVal.indexOf("visible") > -1){
			$('#signup-box').removeClass('visible');
		}
		
		var oldForgotClassVal = $('#forgot-box').attr('class');
		if(oldForgotClassVal.indexOf("visible") > -1){
			$('#forgot-box').removeClass('visible');
		}
	}
	// 注册
	if('signup-box' == boxId){
		$('#signup-box').addClass('visible');
		
		var oldLoginClassVal = $('#login-box').attr('class');
		if(oldLoginClassVal.indexOf("visible") > -1){
			$('#login-box').removeClass('visible');
		}
		
		var oldForgotClassVal = $('#forgot-box').attr('class');
		if(oldForgotClassVal.indexOf("visible") > -1){
			$('#forgot-box').removeClass('visible');
		}
	}
	// 找回密码
	if('forgot-box' == boxId){
		$('#forgot-box').addClass('visible');
		
		var oldLoginClassVal = $('#login-box').attr('class');
		if(oldLoginClassVal.indexOf("visible") > -1){
			$('#login-box').removeClass('visible');
		}
		
		var oldSignupClassVal = $('#signup-box').attr('class');
		if(oldSignupClassVal.indexOf("visible") > -1){
			$('#signup-box').removeClass('visible');
		}
	}
}
 
// 找回密码表单校验
function resetPasswdFormValidate(){
	// 表单校验
	var email = $('#email').val();
	
	if('' == email){
		$('#emailEMsg').text('请填写正确的企业管理员用户名！');
		$('#email').focus();
		return false;
	}
 	
 	$('#emailEMsg').text();
 	return true;
}

// 找回密码
function resetPasswd(){
	var email = $('#email').val();
	var orgName = $('#orgName').val();
	
	if(resetPasswdFormValidate()){
		$.ajax({
			url:baseUrl + '/management/users/' + email + '/resetpw',
			type:'PUT',
			data:{},
			crossDomain:true,
			success:function(respData){
				if(respData.status && respData.status == 'ok') {
					alert('提示!\n\n邮件已发送,请前往邮箱继续找回密码.');
				}
			},
			error:function(respData){
				var str = JSON.stringify(respData.responseText).replace('}','').replace('{','').split(',');
				var tmpArr = new Array();
				var errorMsg = '';
				for(var i = 0; i < str.length; i++) {
					tmpArr.push(str[i].replace(/\\/g,'').replace(/\"/g,'').split(':'));
				}
				for(var i = 0; i < tmpArr.length; i++) {
					if('error_description' == tmpArr[i][0]){
						if(tmpArr[i][1].indexOf("Could not find organization for email") > -1 || tmpArr[i][1].indexOf("Could not find organization for username") > -1) {
							errorMsg = '该邮箱未注册过环信!';
						} else if(tmpArr[i][1].indexOf("username") > -1) {
							errorMsg = '请联系系统管理员 !';
						}
					}
				}
				
				alert('提示\n\n' + errorMsg);
			}
		});
	}
}

// 找回密码表单校验
function resetPasswdReqFormValidate(){
	// 表单校验
	var password1 = $('#password1').val();
	var password2 = $('#password2').val();
	
 	if('' == password1){
		alert('提示\n\n密码不能为空！');
		$('#password1').focus();
		return false;
	}
	if(password1.length < 6 || password1.length > 20){
		$('#password1').focus();
		alert('提示\n\n密码长度在6-20个字符之间！');
		return false;
	}
		if(password2 != password1){
		alert('提示\n\n两次输入密码不一致！');
		$('#password2').focus();
		return false;
	}
 	
 	return true;
}

// 设置新密码
function resetPasswdReq(token,uuid){
	var password1=$('#password1').val();
	var	password2=$('#password2').val();
	var d = {
		'password1':password1,
		'password2':password2,
		'token':token
	}
	if(resetPasswdReqFormValidate()){
		$.ajax({
			url:baseUrl + '/management/users/'+uuid+'/resetpw',
			type:'POST',
			data:JSON.stringify(d),
			headers:{
				'Content-Type':'multipart/form-data'
			},
			success:function(respData){
				alert('提示!\n重置密码成功!');
				window.location.href = 'index.html';
			},
			error:function(data){
				alert('提示!\n重置密码失败!');
			}
		});
	}
}

// 注册表单校验
function regsFormValidate(){
	// 表单校验
	var regOrgName = $('#regOrgName').val();
	var regUserName = $('#regUserName').val();
	var regEmail = $('#regEmail').val();
	var regPassword = $('#regPassword').val();
	var regRePassword = $('#regRePassword').val();
	var regCompanyName = $('#regCompanyName').val();
	var regTel = $('#regTel').val();
	var comefrom = $('input:radio[name="comefrom"]:checked').val();
	
	if('' == regOrgName){
		$('#regOrgNameSMsg').css('display','none');
		$('#regOrgNameEMsg').text('企业ID名不能为空！');
		return false;
	}
	var regOrgNameRegex = /^(?!-)(?!.*?-$)[a-zA-Z0-9-]+$/;
	if(!regOrgNameRegex.test(regOrgName)){
		$('#regOrgNameSMsg').css('display','none');
	 	$('#regOrgNameEMsg').text('只能使用数字,字母,横线,且不能以横线开头和结尾！');
		return false;
 	}
 	if(regOrgName != '' && regOrgName.length < 1){
		$('#regOrgNameSMsg').css('display','none');
		$('#regOrgNameEMsg').text('企业ID长度至少一个字符！');	
		return false;
	}
	$('#regOrgNameSMsg').css('display','block');
	
	if('' == regUserName){
		$('#regUserNameSMsg').css('display','none');
		$('#regUserNameEMsg').text('用户名不能为空！');
		return false;
	}
	var regUserNameRegex = /^[a-zA-Z0-9_\-./]*$/;
	if(!regUserNameRegex.test(regUserName)){
		$('#regUserNameEMsg').text('用户名至少一个字符，包括[字母,数字,下划线,横线,斜线,英文点]');
		return false;
 	}
 	if(regUserName != '' && regUserName.length < 1){
		$('#regUserNameSMsg').css('display','none');
		$('#regUserNameEMsg').text('用户长度至少一个字符！');	
		return false;
	}
	$('#regUserNameSMsg').css('display','block');
	if('' == regPassword){
		$('#regPasswordSMsg').css('display','none');
		$('#regPasswordEMsg').text('密码不能为空！');
		return false;
	}
	if(regPassword.length < 1){
		$('#regPasswordEMsg').text('密码长度至少一个字符！');
		return false;
	}
	$('#regPasswordSMsg').css('display','block');
	if('' == regRePassword){
		$('#regRePasswordEMsg').text('请再次输入密码！');
		return false;
	}
	if('' != regRePassword && regPassword != regRePassword){
		$('#regRePasswordEMsg').text('两次密码不一致!');
		return false;
	}
	var emailReg = /^([a-zA-Z0-9]+[_|\_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z0-9]{1,10}$/;
	if('' == regEmail){
		$('#regEmailEMsg').text('请输入邮箱！');
		return false;
	}
	if(regEmail != '' && !emailReg.test(regEmail)){
		$('#regEmailEMsg').text('请输入有效的邮箱！');
		return false;
	}
	
	if('' == regCompanyName){
		$('#regCompanyNameSEMsg').css('display','none');
		$('#regCompanyNameEMsg').text('请输入企业名称！');
		return false;
	}
	
	if('' == regTel){
		$('#regTelSEMsg').css('display','none');
		$('#regTelEMsg').text('请输入联系电话！');
		return false;
	}
	if(!checkTel(regTel)){
		$('#regTelSEMsg').css('display','none');
		$('#regTelEMsg').text('电话号码格式不正确！');
		return false;
	}
	
	if(typeof(comefrom) == 'undefined'){
		$('#comeFromEMsg').text('请选择获知渠道！');
		return false;
	}
	$('#comeFromEMsg').css('display','none');
	$('#comeFromEMsg').text('');
	
	if(!$("#agreeCBox").prop("checked")) {
		$('#agreeCBoxEMsg').text('请先同意环信开发者平台服务协议！');
		return false;
	}
		
		
	$('#regOrgNameEMsg').text('');
	$('#regUserNameEMsg').text('');	
	$('#regPasswordEMsg').text('');
	$('#regRePasswordEMsg').text('');	
	$('#regEmailEMsg').text('');
	$('#regCompanyNameEMsg').text('');
	$('#regTelEMsg').text('');
	$('#agreeCBoxEMsg').text('');
	
	return true;
}

function checkTel(value)  {
	var isChinaPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
	var isChina = /^(((\+?86)|(\(\+86\)))?(13[0123456789][0-9]{8}|15[0123456789][0-9]{8}|18[0123456789][0-9]{8}|14[0123456789][0-9]{8}))$/;
	var isMalaysia = /^(((\+?60)|(\(\+60\)))?([0123456789]{7}|[0123456789]{8}|[0123456789]{9}))$/;
	var isSingapore = /^(((\+?65)|(0065)|(\+0065)|(\(\+65\)))?[0123456789]{7,10})$/;
    if(isChinaPhone.test(value) || isSingapore.test(value) || isChina.test(value) || isMalaysia.test(value)) {
        return true;
    } else{
        return false;
    }
}


//注册表单清空
function resetForm(){
		$('#regOrgName').val('');
		$('#regUserName').val('');	
		$('#regPassword').val('');
		$('#regRePassword').val('');	
		$('#regEmail').val('');
		$('#regCompanyName').val('');
		$('#regTel').val('');
		
		$('#regOrgNameEMsg').text('');
		$('#regUserNameEMsg').text('');	
		$('#regPasswordEMsg').text('');
		$('#regRePasswordEMsg').text('');	
		$('#regEmailEMsg').text('');
		$('#regCompanyNameEMsg').text('');
		$('#regTelEMsg').text('');
}

// 注册
function formSubmit(){
	var regOrgName = $('#regOrgName').val();
	var regUserName = $('#regUserName').val();
	var regEmail = $('#regEmail').val();
	var regPassword = $('#regPassword').val();
	var regCompanyName = $('#regCompanyName').val();
	var regTel = $('#regTel').val();
	//var comefrom = $('#comefrom').val();
	var mailSuffix = regEmail.substring(regEmail.indexOf('@')+1);
	var comefrom = $('input:radio[name="comefrom"]:checked').val();
	
	
	var d = {
		organization:regOrgName,
		username:regUserName,
		email:regEmail,
		password:regPassword,
		companyName:regCompanyName,
		telephone:regTel,
		comefrom:comefrom
	};
	
	if(regsFormValidate()){
		// 注册用户信息
		$.ajax({
			url:baseUrl + '/management/organizations',
			type:'POST',
			crossDomain:true,
			headers:{
				'Content-Type':'application/json'
			},
			data:JSON.stringify(d),
			success: function(respData, textStatus, jqXHR) {
				$('#signup-box').removeClass('visible');
				$('#login-box').addClass('visible');
				$('#username').val(regUserName);
			
				window.location.href = 'regist_org_success.html?mailSuffix='+mailSuffix+'&regEmail='+regEmail;
			},
			error: function(respData, textStatus, jqXHR) {
				var str = JSON.stringify(respData.responseText).replace('}','').replace('{','').split(',');
				var tmpArr = new Array();
				var errorMsg = '';
				for(var i = 0; i < str.length; i++) {
					tmpArr.push(str[i].replace(/\\/g,'').replace(/\"/g,'').split(':'));
				}
				for(var i = 0; i < tmpArr.length; i++) {
					if('error_description' == tmpArr[i][0]){
						if(tmpArr[i][1].indexOf("path") > -1) {
							errorMsg = '企业ID重复！';
						}
						if(tmpArr[i][1].indexOf("username") > -1) {
							errorMsg = '用户名重复 !';
						}
						if(tmpArr[i][1].indexOf("email") > -1) {
							errorMsg = '邮箱账户重复 !';
						}
					}
				}
				alert('注册失败!\n\n' + errorMsg);
			}
		});
	}
}

// 登录表单校验
function loginFormValidate(){
	// 表单校验
	var loginUserName = $('#username').val();
	var loginPassword = $('#password').val();
	if('' == loginUserName){
		$('#usernameEMsg').text('用户名不能为空！');
		$('#username').focus();
		return false;
	}
	if('' == loginPassword){
		$('#passwordEMsg').text('密码不能为空！');
		$('#password').focus();
		return false;
	}
	
	$('#usernameEMsg').text('');
	$('#passwordEMsg').text('');
	return true;
}

// ORG管理员登录
function orgAdminLogin() {
	var loginUser = $('#username').val();
	var d = {
		'grant_type':'password',
		'username':loginUser,
		'password':$('#password').val()
	};
		if($('#rememberme:checked').length>0){
           $.cookie('tvs-cookies-userName',$('#username').val());
		   $.cookie('tvs-cookies-password',$('#password').val());
		}else{
           $.cookie('tvs-cookies-userName','');
		   $.cookie('tvs-cookies-password','');
		}
	if(loginFormValidate()){
			$('#cont').text('登录中...');
			$('#loginBtn').attr("disabled",true); 
					
			// 登录获取token
			$.ajax({
				url:baseUrl+'/management/token',
				type:'POST',
				data:JSON.stringify(d),
				headers:{
					'Content-Type':'application/json'
				},
				crossDomain:true,
				error: function(respData, textStatus, errorThrown) {
					$('#cont').text('登录');
					$('#loginBtn').attr("disabled",false);

					var str = JSON.stringify(respData.responseText).replace('}','').replace('{','').split(',');
					var tmpArr = new Array();
					var errorMsg = '';
					for(var i = 0; i < str.length; i++) {
						tmpArr.push(str[i].replace(/\\/g,'').replace(/\"/g,'').split(':'));
					}
					for(var i = 0; i < tmpArr.length; i++) {
						if('error_description' == tmpArr[i][0]){
							if(tmpArr[i][1].indexOf("User must be confirmed to authenticate") > -1) {
								errorMsg = '登陆失败，账户未激活!';
							}
							if(tmpArr[i][1].indexOf("invalid username or password") > -1) {
								errorMsg = '登陆失败，用户名或者密码错误!';
							}
						}
					}
					alert(errorMsg);
				},
				success: function(respData, textStatus, jqXHR) {
					var access_token = respData.access_token;
					var cuser = respData.user.username;
					var cuserName = respData.user.username;
					var email = respData.user.email;
					var companyName = respData.user.properties.companyName;
					var telephone = respData.user.properties.telephone;
					var orgName = '';
					var orgs = respData.user.organizations;

					$.each(orgs, function(i) {
					    orgName = i;
					});

					if(orgName == '') {
						alert('抱歉,系统找不到该用户对应的企业ID.\n请联系系统管理员!');
						window.location.href = 'index.html';
					} else {
						var date = new Date();
						date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
						$.cookie('access_token', access_token,{path:'/',expires:date});
						$.cookie('cuser', cuser,{path:'/',expires:date});
						$.cookie('cuserName', cuserName,{path:'/',expires:date});
						$.cookie('email', email,{path:'/',expires:date});
						$.cookie('orgName', orgName,{path:'/',expires:date});
						$.cookie('companyName', companyName,{path:'/',expires:date});
						$.cookie('telephone', telephone,{path:'/',expires:date});

						window.location.href = 'app_list.html';
						location.replace('app_list.html');
					}
				}
		});
	} else {
		$('#cont').text('登录');
		$('#loginBtn').attr("disabled",false);
	}
}


// 退出登录
function logout() {
	// 销毁cookie
	$.cookie("access_token",null,{path:"/"});
	$.cookie("cuser",null,{path:"/"});
	$.cookie("cuserName",null,{path:"/"});
	$.cookie("orgName",null,{path:"/"});
	$.cookie("email",null,{path:"/"});
	$.cookie("companyName",null,{path:"/"});
	$.cookie("telephone",null,{path:"/"});
	// 转到登陆页面
	window.location.href = "index.html";
}

// 时间格式转换 1399434332770 -> 
function add0(m){
	return m<10 ? '0'+m : m;
}
function format(timeST){
	var time = new Date(parseInt(timeST));
	var y = time.getFullYear();
	var m = time.getMonth()+1;
	var d = time.getDate();
	var h = time.getHours();
	var mm = time.getMinutes();
	var s = time.getSeconds();
	return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
}

// 登录用户信息
function loginAdminInfo(){
	// get org admin token
	var access_token = $.cookie('access_token');
	var cuser = $.cookie('cuser');
	var orgName = $.cookie('orgName');
	var companyName = $.cookie('companyName');
	var telephone = $.cookie('telephone');
	var email = $.cookie('email');
	if(!access_token || access_token==''){
		alert('提示\n\n会话已失效,请重新登录!');
		window.location.href = 'index.html';
	} else {
		$('#username').text(cuser);
		$('#email').text(email);
		$('#companyName').text(companyName);
		$('#telephone').text(telephone);
	}
}

// 修改登录用户信息
function updateAdminInfo(username, companyName, telephone){
	// get org admin token
	var access_token = $.cookie('access_token');
	var cuser = $.cookie('cuser');
	var orgName = $.cookie('orgName');
	var d = {};
	if(companyName != '' && companyName != null){
		d.companyName = companyName;
	}
	if(telephone != '' && telephone != null){
		d.telephone = telephone;
	}

	if(!access_token || access_token==''){
		alert('提示\n\n会话已失效,请重新登录!');
		window.location.href = 'index.html';
	} else {
		$.ajax({
			url: baseUrl + '/management/users/' + username,
			type:'PUT',
			data:JSON.stringify(d),
			headers:{
				'Authorization':'Bearer ' + access_token,
				'Content-Type':'application/json'
			},
			error:function(respData, textStatus, jqXHR){
			},
			success:function(respData, textStatus, jqXHR){
				alert('修改成功!');
				
				$('#companyNameInput').val('');
				$('#telephoneInput').val('');
				$('#companyNameInput').hide();
				$('#telephoneInput').hide();
				$('#showEditBtn').show();
				$('#saveAdminInfoBtn').hide();
				$('#cancelSaveAdminInfoBtn').hide();
				$('#telephone').show();
				$('#companyName').show();

				var date = new Date();
				date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
				$.cookie('companyName', companyName,{path:'/',expires:date});
				$.cookie('telephone', telephone,{path:'/',expires:date});

				loginAdminInfo();
			}
		});
	}
}

// 修改登录用户密码表单校验
function updateAdminPasswdFormValidate(){
	// 表单校验
	var oldpassword = $('#oldpassword').val();
	var newpassword = $('#newpassword').val();
	var renewpassword = $('#renewpassword').val();
	
	if('' == oldpassword){
		$('#oldpasswordEMsg').text('原密码不能为空！');
		$('#oldpassword').focus();
		return false;
	}
	$('#oldpasswordEMsg').text('');
	if('' == newpassword){
		$('#newpasswordEMsg').text('新密码不能为空！');
		$('#newpassword').focus();
		return false;
	}
	
	if(newpassword.length < 6 || newpassword.length > 20){
		$('#newpasswordEMsg').text('新密码长度在6-20个字符之间！');
		$('#newpassword').focus();
		return false;
	}
	$('#newpasswordEMsg').text('');
	if(renewpassword != newpassword){
		$('#renewpasswordEMsg').text('两次新密码不一致');
		return false;
	}
	
	$('#renewpasswordEMsg').text('');
	return true;
}

// 修改登录用户密码
validateAccessToken = '';
function updateAdminPasswd() {
	var access_token = $.cookie('access_token');
	var oldpassword = $('#oldpassword').val();
	var	newpassword = $('#newpassword').val();
	var username = $.cookie('cuser');
	var d = {
		'oldpassword':oldpassword,
		'newpassword':newpassword
	}
	var dtoken = {
		'grant_type':'password',
		'username':username,
		'password':oldpassword
	}
	if(updateAdminPasswdFormValidate()){
		//校验旧密码
		$.ajax({
			url:baseUrl+'/management/token',
			type:'POST',
			data:JSON.stringify(dtoken),
			error: function(jqXHR, textStatus, errorThrown) {
				$('#oldpasswordEMsg').text('原密码不正确!');
			},
			success: function(respData, textStatus, jqXHR) {
				if(respData.access_token == ''){
					return ;
				}
				
				$.ajax({
					url:baseUrl + '/management/users/' + username + '/password',
					type:'POST',
					data:JSON.stringify(d),
					headers:{
						'Content-Type':'application/json'
					},
					success:function(respData){
						alert('提示!\n密码修改成功!');
					},
					error:function(data){
						alert('提示!\n密码修改失败!');
					}
				});
			}
		});
	}
	
}

// app列表页
function toAppList(){
	window.location.href = "app_list.html";
}

// 创建应用表单校验
function createAppFormValidate(){
	// 表单校验
	var appName = $('#appName').val();
	var nick = $('#nick').val();
	var appDesc = $('#appDesc').val();
	
	if('' == appName){
		$('#appNameMsg').text('应用名不能为空！');
		$('#appNameMsg').css('color','red');
		$('#appName').focus();
		return false;
	}
	var appNameRegex = /^[0-9a-zA-Z]*$/;
	if(!appNameRegex.test(appName)){
		$('#appNameMsg').text('作为环信体系中的一个app唯一标识,只能是字母,数字或字母数字组合!');
		$('#appNameMsg').css('color','red');
 		$('#appName').focus();
		return false;
 	}
 	$('#appNameMsg').text('输入正确！');
	$('#appNameMsg').css('color','blue');
 	
	if('' == nick){
		$('#nickMsg').text('产品名称不能为空！');
		$('#nickMsg').css('color','red');
		$('#nick').focus();
		return false;
	}
 	var nickRegex = /^[0-9a-zA-Z-_\u4e00-\u9faf]*$/;
 	if(!nickRegex.test(nick)){
		$('#nickMsg').text('您的这款app对应的产品叫什么? 只能是汉字,字母,数字、横线、下划线及其组合!');
		$('#nickMsg').css('color','red');
 		$('#nick').focus();
		return false;
 	}
 	$('#nickMsg').text('输入正确！');
	$('#nickMsg').css('color','blue');
 
	if('' == appDesc){
		$('#appDescMsg').text('应用描述不能为空！');
		$('#appDescMsg').css('color','red');
		$('#appDesc').focus();
		return false;
	}
 	var appDescReg = /^[0-9a-zA-Z,.?。，？、\/'":\u4e00-\u9faf]{0,100}$/;
	if(!appDescReg.test(appDesc)){
		$('#appDescMsg').text('应用描述只能输入字母，数字或者汉字,字数在一百字以内!');
		$('#appDescMsg').css('color','red');
		$('#appDesc').focus();
		return false;
	}
	
	$('#appDescMsg').text('输入正确！');
	$('#appDescMsg').css('color','blue');
 	
	return true;
}

// 创建app
function saveNewApp(){
	// get org admin token
	var access_token = $.cookie('access_token');
	var cuser = $.cookie('cuser');
	var orgName = $.cookie('orgName');
	var appname = $('#appName').val();
	var allow_open_registration = $('input[name="allow_open_registration"]:checked').val();
	var appDesc = $('#appDesc').val();
	
	var dataBody = {
		'name':appname,
		'allow_open_registration':allow_open_registration,
		'appDesc':appDesc
	};
	
	if(!access_token || access_token==''){
		alert('提示\n\n会话已失效,请重新登录!');
		window.location.href = 'index.html';
	} else {
		if(createAppFormValidate()){
			// 保存数据
			$.ajax({
				url:baseUrl+'/management/organizations/'+ orgName +'/applications',
				type:'POST',
				headers:{
					'Authorization':'Bearer '+access_token,
					'Content-Type':'application/json'
				},
				data:JSON.stringify(dataBody),
				error: function(jqXHR, textStatus, errorThrown) {
					alert('提示\n\n应用创建失败!\n更换应用名?');
				},
				success: function(respData, textStatus, jqXHR) {
					alert('app创建成功!');
					$(respData.entities).each(function(){
						window.location.href = 'app_profile.html?appUuid=' + this.uuid;
					});
				}
			});
		}
	}
}

// 分页基础数据
var cursors = {};
var pageNo = 1;
cursors[1] = '';
var total = 0;
var cursors1 = {};
cursors1[1] = '';

// 分页条更新
function updateUsersPageStatus(){
	var pageLi = $('#paginau').find('li');
	
	// 获取token
	var access_token = $.cookie('access_token');
	var cuser = $.cookie('cuser');
	var orgName = $.cookie('orgName');
	if(!access_token || access_token==''){
		alert('提示\n\n会话已失效,请重新登录!');
		window.location.href = 'index.html';
	} else {
		$.ajax({
			url:baseUrl+'/'+ orgName +'/' + appUuid + '/users?limit=1000',
			type:'GET',
			headers:{
				'Authorization':'Bearer '+access_token,
				'Content-Type':'application/json'
			},
			error: function(jqXHR, textStatus, errorThrown) {
			},
			success: function(respData, textStatus, jqXHR) {
				total = respData.count;
				var totalPage = (total % 10 == 0) ? (parseInt(total / 10)) : (parseInt(total / 10) + 1);
				
				var ulB = '<ul>';
				var ulE = '</ul>';
				var textOp1 = '<li> <a href="javascript:void(0);" onclick="getPrevAppUserList();">上一页</a> </li>';
				var textOp2 = '<li> <a href="javascript:void(0);" onclick="getNextAppUserList();">下一页</a> </li>';
				$('#paginau').html('');
				// 首页
				if(pageNo == 1){
					if(totalPage == 1){
						$('#paginau').append(ulB + ulE);
					} else {
						$('#paginau').append(ulB + textOp2 + ulE);
					}
					// 尾页
				} else if(totalPage ==  pageNo){
					$('#paginau').append(ulB + textOp1 + ulE);
				} else {
					$('#paginau').append(ulB + textOp1 + textOp2 + ulE);
				}
			}
		});
	}
}

// 管理员分页条更新
function updateUsersAdminPageStatus(){
	var pageLi = $('#paginau').find('li');
	
	// 获取token
	var access_token = $.cookie('access_token');
	var cuser = $.cookie('cuser');
	var orgName = $.cookie('orgName');
	if(!access_token || access_token==''){
		alert('提示\n\n会话已失效,请重新登录!');
		window.location.href = 'index.html';
	} else {
		$.ajax({
			url:baseUrl+'/'+ orgName +'/' + appUuid +'/roles/admin/users?limit=1000',
			type:'GET',
			headers:{
				'Authorization':'Bearer '+access_token,
				'Content-Type':'application/json'
			},
			error: function(jqXHR, textStatus, errorThrown) {
			},
			success: function(respData, textStatus, jqXHR) {
				total = respData.entities.length;
				var totalPage = (total % 10 == 0) ? (parseInt(total / 10)) : (parseInt(total / 10) + 1);
				
				var ulB = '<ul>';
				var ulE = '</ul>';
				var textOp1 = '<li> <a href="javascript:void(0);" onclick="getPrevAppUserList();">上一页</a> </li>';
				var textOp2 = '<li> <a href="javascript:void(0);" onclick="getNextAppUserList();">下一页</a> </li>';
				$('#paginau').html('');
				// 首页
				if(pageNo == 1){
					if(totalPage == 1){
						$('#paginau').append(ulB + ulE);
					} else {
						$('#paginau').append(ulB + textOp2 + ulE);
					}
				} else if(totalPage ==  pageNo){
					$('#paginau').append(ulB + textOp1 + ulE);
				} else {
					$('#paginau').append(ulB + textOp1 + textOp2 + ulE);
				}
			}
		});
	}
}
// 好友分页条更新
function updateIMPageStatus(owner_username){
	var pageLi = $('#paginau').find('li');
	
	// 获取token
	var access_token = $.cookie('access_token');
	var cuser = $.cookie('cuser');
	var orgName = $.cookie('orgName');
	if(!access_token || access_token==''){
		alert('提示\n\n会话已失效,请重新登录!');
		window.location.href = 'index.html';
	} else {
		$.ajax({
			url:baseUrl+'/'+ orgName +'/' + appUuid + '/users/'+owner_username+'/contacts/users?limit=1000',
			type:'GET',
			headers:{
				'Authorization':'Bearer '+access_token,
				'Content-Type':'application/json'
			},
			error: function(jqXHR, textStatus, errorThrown) {
			},
			success: function(respData, textStatus, jqXHR) {
				total = respData.entities.length;
				var totalPage = (total % 10 == 0) ? (parseInt(total / 10)) : (parseInt(total / 10) + 1);
				var ulB = '<ul>';
				var ulE = '</ul>';
				var textOp1 = '<li> <a href="javascript:void(0);" onclick="getPrevAppUserList();">上一页</a> </li>';
				var textOp2 = '<li> <a href="javascript:void(0);" onclick="getNextAppUserList();">下一页</a> </li>';
				$('#paginau').html('');
				// 首页
				if(pageNo == 1){
					if(totalPage == 1){
						$('#paginau').append(ulB + ulE);
					} else {
						$('#paginau').append(ulB + textOp2 + ulE);
					}
					// 尾页
				} else if(totalPage ==  pageNo){
					$('#paginau').append(ulB + textOp1 + ulE);
				} else {
					$('#paginau').append(ulB + textOp1 + textOp2 + ulE);
				}
			}
		});
	}
}

// 获取app列表
function getAppList(){
	// get org admin token
	var access_token = $.cookie('access_token');
	var cuser = $.cookie('cuser');
	var orgName = $.cookie('orgName');
	userCount = 0;
	if(!access_token || access_token=='') {
		alert('提示\n\n会话已失效,请重新登录!');
		window.location.href = 'index.html';
	} else {
		var loading = '<tr id="tr_loading"><td class="text-center" colspan="9"><img src ="assets/img/loading.gif">&nbsp;&nbsp;&nbsp;<span>正在读取数据...</span></td></tr>';
		$('#appListBody').empty();
		$('#appListBody').append(loading);
		$.ajax({
			url:baseUrl+'/management/organizations/'+ orgName +'/applications',
			type:'GET',
			crossDomain:true,
			headers:{
				'Authorization':'Bearer '+access_token,
				'Content-Type':'application/json'
			},
			error: function(jqXHR, textStatus, errorThrown) {
			},
			success: function(respData, textStatus, jqXHR) {
				var appData = jQuery.parseJSON(JSON.stringify(respData.data));
				var uuidArr = [];
				var nameArr = [];
				var option = '';
				$.each(appData, function(key,value){
					nameArr.push(key);
					uuidArr.push(value);
					key = key.substring(key.indexOf('/')+1);
					userCount = 0;
					$.ajax({
						url:baseUrl+'/'+ orgName +'/' + value + '/counters?counter=application.collection.users&pad=true',
						type:'GET',
						async:false,
						headers:{
							'Authorization':'Bearer '+access_token,
							'Content-Type':'application/json'
						},
						error: function(jqXHR, textStatus, errorThrown) {
						},
						success: function(respData, textStatus, jqXHR) {
							$.each(respData.counters, function(){
								if(this.values.lenght == 0){
									userCount = 0;
								} else {
									$.each(this.values,function(){
										var userValue = parseInt(this.value);
										if(userValue < 0){
											userValue = 0;	
										}
										userCount = userValue;
									});
								}
							});
						}
					});
					
					option += '<tr><td class="text-center"><a href="app_profile.html?appUuid='+key+'&Application='+key+'">'+key+'</a></td>'+
						 	'<td class="text-center">'+userCount+'</td>'+
						 	'<td class="text-center">上线运行中</td>'+
				 		'</tr>';
					
				});
				$('#tr_loading').remove();
				$('#appListBody').append(option);
				// 无数据
				var tbody = document.getElementsByTagName("tbody")[0];
				if(!tbody.hasChildNodes()){
					var option = '<tr><td class="text-center" colspan="7">无数据!</td></tr>';
					$('#appListBody').append(option);
				}
			}
		});
	}
}


// 获取app详情:org管理员登录
function getAppProfile(appUuid){
	// 获取token
	var access_token = $.cookie('access_token');
	var cuser = $.cookie('cuser');
	var orgName = $.cookie('orgName');
	if(!access_token || access_token==''){
		alert('提示\n\n会话已失效,请重新登录!');
		window.location.href = 'index.html';
	} else {
		// 获取app基本信息
		$.ajax({
			url:baseUrl + '/management/organizations/' + orgName + '/applications/' + appUuid,
			type:'GET',
			headers:{
				'Authorization':'Bearer ' + access_token,
				'Content-Type':'application/json'
			},
			error: function(jqXHR, textStatus, errorThrown) {
			},
			success: function(respData, textStatus, jqXHR) {
				$(respData.entities).each(function(){
					var uuid = this.uuid;
					var name = this.name;
					var created = format(this.created);
					var modified = format(this.modified);
					var applicationName = this.applicationName;
					var organizationName = this.organizationName;
					var allowOpen = this.allow_open_registration?'开放注册':'授权注册';
					var tag = this.allow_open_registration?'0':'1';
					var image_thumbnail_width = '170';
					if(this.image_thumbnail_width != null && this.image_thumbnail_width != undefined){
						image_thumbnail_width = this.image_thumbnail_width;
						}
					var image_thumbnail_height = '170';
					if(this.image_thumbnail_height != null && this.image_thumbnail_height!= undefined){
						image_thumbnail_height=this.image_thumbnail_height;
					}
					$('#appKey').text(organizationName+'#'+applicationName);
					$('#xmlandroidAppkey').text(organizationName+'#'+applicationName);
					$('#created').text(created);
					$('#modified').text(modified);
					$('#allowOpen').text(allowOpen);
					$('#allowOpenHdd').val(tag);
					$('#image_thumbnail_width').text(image_thumbnail_width+'px');
					$('#image_thumbnail_height').text(image_thumbnail_height+'px');
					$('#imageHeightHide').val(image_thumbnail_width);
					$('#imageWidthHide').val(image_thumbnail_height);
				});
				
				$('#showName').text(respData.applicationName);
			}
		});
		
		$.ajax({
			url: baseUrl + '/' + orgName + '/' + appUuid + '/credentials',
			type:'GET',
			headers:{
				'Authorization':'Bearer ' + access_token,
				'Content-Type':'application/json'
			},
			error: function(jqXHR, textStatus, errorThrown) {
			},
			success: function(respData, textStatus, jqXHR) {
				$('#client_id').text(respData.credentials.client_id);
				$('#client_secret').text(respData.credentials.client_secret);
			}
		});
		
	}
}


//修改缩略图大小
function updateImage(appUuid){
	var access_token = $.cookie('access_token');
	var cuser = $.cookie('cuser');
	var orgName = $.cookie('orgName');
	var imgReg =  /^[0-9]*$/;
	var imgwidth = $('#imageWidth').val();
	var imgheight = $('#imageHeight').val();

	if(imgwidth == ''){
		$('#imageWidthSpan').text('缩略图高度不能为空!');
		return;
	}
	if(imgheight == ''){
		$('#imageHeightSpan').text('缩略图长度不能为空!');
		return;
	}

	$('#imageWidthSpan').text('');
	$('#imageHeightSpan').text('');

	if(!imgReg.test(imgheight)){
		$('#imageHeightSpan').text('缩略图长宽只能是正整数');
	}else if(!imgReg.test(imgwidth)){
		$('#imageWidthSpan').text('缩略图长宽只能是正整数');
	}else{
		
		var d ={
			image_thumbnail_width:parseInt(imgwidth), 
			image_thumbnail_height:parseInt(imgheight)
		};
		$.ajax({
			url: baseUrl + '/' + orgName + '/' + appUuid ,
			type:'PUT',
			data:JSON.stringify(d),
			headers:{
				'Authorization':'Bearer ' + access_token,
				'Content-Type':'application/json'
			},
			error: function(jqXHR, textStatus, errorThrown) {
				alert('修改失败!');
			},
			success: function(respData, textStatus, jqXHR) {
				alert('修改成功!');
				location.replace(location.href);
			}
		});
	}
}

// 获取app详情:app管理员登录
function getAppProfileforAppAdmin(appUuid){
	// 获取token
	var access_token = $.cookie('access_token');
	var cuser = $.cookie('cuser');
	var orgName = $.cookie('orgName');
	if(!access_token || access_token==''){
		alert('提示\n\n会话已失效,请重新登录!');
		window.location.href = 'index.html';
	} else {
		$.ajax({
			url:baseUrl+'/management/organizations/'+ orgName +'/applications/' + appUuid,
			type:'GET',
			headers:{
				'Authorization':'Bearer '+access_token,
				'Content-Type':'application/json'
			},
			error: function(jqXHR, textStatus, errorThrown) {
			},
			success: function(respData, textStatus, jqXHR) {
				$(respData.entities).each(function(){
					var uuid = this.uuid;
					var name = this.name;
					var created = format(this.created);
					var modified = format(this.modified);
					var applicationName = this.applicationName;
					var organizationName = this.organizationName;
					var allowOpen = this.allow_open_registration?'自由注册':'仅管理员可注册';
					var tag = this.allow_open_registration?'0':'1';
					$('#appKey').text(organizationName+'#'+applicationName);
					$('#xmlandroidAppkey').text(organizationName+'#'+applicationName);
					$('#xmliosAppkey').text(organizationName+'#'+applicationName);
					$('#created').text(created);
					$('#modified').text(modified);
					$('#allowOpen').text(allowOpen);
					$('#allowOpenHdd').val(tag);
				});
				
				$('#showName').text(respData.applicationName);
			}
		});
	}
}

// 切换app注册模式
function changeAllowOpen(){
	var access_token = $.cookie('access_token');
	var orgName = $.cookie('orgName');
	var appKey = $('#appKey').text().replace('#','/');
	var tag = $('#allowOpenHdd').val();

	if(tag == 0){
		allow_open_registration = false;
	} else {
		allow_open_registration = true;
	}
	
	var d = {
		'allow_open_registration':allow_open_registration	
	}

	$.ajax({
		url:baseUrl+'/'+ appKey,
		type:'PUT',
		data:JSON.stringify(d),
		headers:{
			'Authorization':'Bearer ' + access_token,
			'Content-Type':'application/json'
		},
		success:function(respData){
			alert('提示!\n\模式切换成功!');
			//toApppofile();
			$(respData.entities).each(function(){
				var tag = this.allow_open_registration?'0':'1';
				var modified = format(this.modified);
				$('#modified').text(modified);
				$('#allowOpenHdd').val(tag);
				if(this.allow_open_registration){
					$('#allowOpen').text('开放注册');	
				}else {
					$('#allowOpen').text('授权注册');
				}
			});
		},
		error:function(data){
			alert('提示!\n\模式切换失败!');
		}
	});
	
}

// 创建app管理员
// 用户名
function onBlurCheckUsername(appAdminUsername){
	var appAdminUsernameReg =  /^[a-zA-Z0-9_\-./]*$/;
	if('' == appAdminUsername) {
		$('#appAdminUsernameMsg').text('请输入用户名');
		return false;
	}
	
	if(!appAdminUsernameReg.test(appAdminUsername)){
		$('#appAdminUsernameMsg').text('用户名至少一个字符(包括英文字母,数字,下划线,横线,斜线,英文点)！');
		return false;
	}
	
	$('#appAdminUsernameMsg').text('');
	return true;
}
// 一次密码
function onBlurCheckPassword(password){
	var passwordReg =  /^[\s\S]{1,1000}$/;
	if('' == password) {
		$('#passwordMsg').text('请输入密码');
		return false;
	}
	if(!passwordReg.test(password)){
		$('#passwordMsg').text('密码至少一个字符');
		return false;
	}
	$('#passwordMsg').text('');
	return true;
}

// 二次密码
function onBlurCheckConfirmPassword(confirmPassword){
	var password = $('#password').val();
	if('' == confirmPassword) {
		$('#confirmPasswordMsg').text('请再次输入密码！');
		return false;
	}
	if(password != confirmPassword){
		$('#confirmPasswordMsg').text('您两次输入的账号密码不一致!');
		return false;
	}
	
	$('#confirmPasswordMsg').text('');
	return true;
}

// 提交表单
function saveNewAppAdmin(appUuid){
	var appAdminUsername = $('#appAdminUsername').val();
	var password = $('#password').val();
	var confirmPassword = $('#confirmPassword').val();

	var token = $.cookie('access_token');
	var orgName = $.cookie('orgName');

	var flag = onBlurCheckUsername(appAdminUsername) && onBlurCheckPassword(password) && onBlurCheckConfirmPassword(confirmPassword);
	if(flag){
		// Create a user
		var d ={
			username:appAdminUsername,
			password:password
		};
		$.ajax({
			url:baseUrl + '/' + orgName + '/' + appUuid + '/users',
			type:'POST',
			data:JSON.stringify(d),
			headers:{
				'Authorization':'Bearer ' + token,
				'Content-Type':'application/json'
			},
			success:function(respData){
				// update role
				$.ajax({
					url:baseUrl + '/' + orgName + '/' + appUuid + '/users/'+ appAdminUsername +'/roles/admin',
					type:'POST',
					data:{},
					headers:{
						'Authorization':'Bearer ' + token,
						'Content-Type':'application/json'
					},
					success:function(respData){
						// if success , to app user list
						alert('添加管理员成功!')
						toAppUserAdmin();
					},
					error:function(data){
						// if failure , delete the user
						$.ajax({
							url:baseUrl + '/' + orgName + '/' + appUuid + '/users/'+ appAdminUsername,
							type:'DELETE',
							headers:{
								'Authorization':'Bearer ' + token,
								'Content-Type':'application/json'
							},
							success:function(respData){
								alert('添加管理员失败!')
							},
							error:function(data){
							}
						});	
					}
				});	
			},
			error:function(data){
				var str = JSON.stringify(data.responseText).replace('}','').replace('{','').split(',');
				var tmpArr = new Array();
				var errorMsg = '';
				for(var i = 0; i < str.length; i++) {
					tmpArr.push(str[i].replace(/\\/g,'').replace(/\"/g,'').split(':'));
				}
				for(var i = 0; i < tmpArr.length; i++) {
					if('error_description' == tmpArr[i][0]){
						if(tmpArr[i][1].indexOf("Entity user requires that property named username be unique") > -1) {
							errorMsg = '提示!\n\n用户名已存在!';
						} else {
							errorMsg = '添加APP管理员失败!';
						}
					}
				}
				alert(errorMsg);

			}
		});	
	}
}

//===================================================== User ==================================================================================
// 创建IM用户
// 用户名
function onBlurCheckIMUsername(imUsername){
	var imUsernameReg =  /^[a-zA-Z0-9_\-./]*$/;
	if('' == imUsername) {
		$('#imUsernameMsg').text('请输入用户名');
		return false;
	}
	
	if(!imUsernameReg.test(imUsername)){
		$('#imUsernameMsg').text('用户名至少一个字符(包括英文字母,数字,下划线,横线,斜线,英文点)！');
		return false;
	}
	
	$('#imUsernameMsg').text('');
	return true;
}
// 一次密码
function onBlurCheckIMPassword(password){
	var passwordReg =  /^[\s\S]*$/;
	if('' == password) {
		$('#passwordMsg').text('请输入密码');
		return false;
	}
	if(!passwordReg.test(password)){
		$('#passwordMsg').text('密码至少一个字符');
		return false;
	}
	$('#passwordMsg').text('');
	return true;
}

// 二次密码
function onBlurCheckIMConfirmPassword(confirmPassword){
	var password = $('#password').val();
	if('' == confirmPassword) {
		$('#confirmPasswordMsg').text('请再次输入密码！');
		return false;
	}
	if(password != confirmPassword){
		$('#confirmPasswordMsg').text('您两次输入的账号密码不一致!');
		return false;
	}
	
	$('#confirmPasswordMsg').text('');
	return true;
}

// 提交表单
function saveNewIMUser(appUuid){
	var imUsername = $('#imUsername').val();
	var password = $('#password').val();
	var confirmPassword = $('#confirmPassword').val();

	var token = $.cookie('access_token');
	var orgName = $.cookie('orgName');

	var flag = onBlurCheckIMUsername(imUsername) && onBlurCheckIMPassword(password) && onBlurCheckIMConfirmPassword(confirmPassword);
	if(flag){
		// Create a user
		var d ={
			username:imUsername,
			password:password
		};
		$.ajax({
			url:baseUrl + '/' + orgName + '/' + appUuid + '/users',
			type:'POST',
			data:JSON.stringify(d),
			headers:{
				'Authorization':'Bearer ' + token,
				'Content-Type':'application/json'
			},
			success:function(respData){
				alert('添加用户成功!');
				window.location.href = 'app_users.html?appUuid='+appUuid;
			},
			error:function(data){
				var str = JSON.stringify(data.responseText).replace('}','').replace('{','').split(',');
				var tmpArr = new Array();
				var errorMsg = '';
				for(var i = 0; i < str.length; i++) {
					tmpArr.push(str[i].replace(/\\/g,'').replace(/\"/g,'').split(':'));
				}
				for(var i = 0; i < tmpArr.length; i++) {
					if('error_description' == tmpArr[i][0]){
						if(tmpArr[i][1].indexOf("Entity user requires that property named username be unique") > -1) {
							errorMsg = '提示!\n\n用户名已存在!';
						} else {
							errorMsg = '提示!\n\n添加用户失败!';
						}
					}
				}
				alert(errorMsg);
			}
		});	
	}
}


function selectAppUser(sel,appUuid,username){
		var value = sel.value;
		
		if(value == 'appIMList'){
			toAppIMList(username);
		}else if(value == 'setUsername'){
			setUsername(appUuid, username);
		}else if(value == 'sendMsg'){
			sendMessgeOne(appUuid, username);
		}else if(value == 'deleteUAdmin'){
			deleteAppUser(appUuid, username);
		}else if(value == 'excute'){
			excute(appUuid, username);
		}
}

// 获取某个app下的用户
function getAppUserList(appUuid, pageAction){
	
	fakePageOne = 1;
	
	// 获取token
	document.getElementById('checkAll').checked = false;
	$('#paginau').html('');
	var access_token = $.cookie('access_token');
	var cuser = $.cookie('cuser');
	var orgName = $.cookie('orgName');
	if(!access_token || access_token==''){
		alert('提示\n\n会话已失效,请重新登录!');
		window.location.href = 'index.html';
	} else {
		var loading = '<tr id="tr_loading"><td class="text-center" colspan="9"><img src ="assets/img/loading.gif">&nbsp;&nbsp;&nbsp;<span>正在读取数据...</span></td></tr>';
		$('#appUserBody').empty();
		$('#appUserBody').append(loading);
		var userPage = $.cookie('userPage');
		if('next' == pageAction){
			pageNo += 1;
		} else if('forward' == pageAction){
			if(pageNo >= 2) {
				pageNo -= 1;
			} else {
				pageNo = 1;
			}
		}
		var temp = '';
		if(typeof(pageAction) != 'undefined' && pageAction != '' || pageAction == 'no'){	
			temp = '&cursor=' + cursors[pageNo];
		}
		$.ajax({
			url:baseUrl+'/'+ orgName +'/' + appUuid + '/users?limit=10' + temp,
			type:'GET',
			headers:{
				'Authorization':'Bearer ' + access_token,
				'Content-Type':'application/json'
			},
			error: function(jqXHR, textStatus, errorThrown) {
			},
			success: function(respData, textStatus, jqXHR) {
				// 缓存游标
				if(pageAction != 'forward'){
					if(respData.cursor){
						cursors[pageNo+1] = respData.cursor;
					}else{
						cursors[pageNo+1] = null;
					}
				}
				
				if(respData.entities.length == 0 && respData.cursor == '' && (pageAction == 'next' || typeof(pageAction) == 'undefined')){
					getNextAppUserList();
				} else if(respData.entities.length == 0 && pageAction == 'forward'){
					if(pageNo >= 2){
						getPrevAppUserList();
					} else if(pageNo == 1){
						getNextAppUserList();
					}
				} else {
					$('tbody').html('');
					var selectOptions = '';
					$(respData.entities).each(function(){
						var username = this.username;
						var created = format(this.created);
						var notification_display_style = '';
						if(this.notification_display_style == 0){
							notification_display_style='仅通知';
						}else if(this.notification_display_style == 1){
							notification_display_style='发送详情';
						}
						var nickname = this.nickname;
						if(nickname == undefined){
							nickname='';
						}
						var notification_no_disturbing=this.notification_no_disturbing;
						if(this.notification_no_disturbing){
							var notification_no_disturbing='已开启';
							var notification_no_disturbing_time = this.notification_no_disturbing_start + ':00'+'--'+this.notification_no_disturbing_end + ':00';
						}else{
							var notification_no_disturbing='未开启';
							var notification_no_disturbing_time='----';
						}
						var notifier_name = this.notifier_name;
						if(notifier_name == undefined){
							notifier_name='';
						}
						var userAdmin = '';
						var excute = '';
						var user_name_show = username;
						
								selectOptions += '<tr>'+
									'<td class="text-center"><label><input style="opacity:1;" name="checkbox" type="checkbox" value="'+username+'" />&nbsp;&nbsp;&nbsp;</label></td>'+	
									'<td class="text-center">'+user_name_show+'</td>'+
									'<td class="text-center">'+notification_display_style+'</td>'+
									'<td class="text-center">'+nickname+'</td>'+
									'<td class="text-center">'+notification_no_disturbing+'</td>'+
									'<td class="text-center">'+notification_no_disturbing_time+'</td>'+
									'<td class="text-center">'+notifier_name+'</td>'+
									'<td class="text-center">'+created+'</td>'+
									'<td class="text-center">'+
										'<ul class="nav-pills" style="list-style-type:none">'+
										'<li class="dropdown all-camera-dropdown"><a class="dropdown-toggle" data-toggle="dropdown" href="#">操作<b class="caret"></b></a>'+
											'<ul class="dropdown-menu">'+
										'<li data-filter-camera-type="all"><a href="javascript:toAppIMList(\''+username+'\')">查看用户好友</a></li>'+
										  '<li data-filter-camera-type="Alpha"><a href="#passwordMondify" id="passwdMod${status.index }" onclick="setUsername(\'' + appUuid + '\',\''+ username +'\');" data-toggle="modal" role="button">重置密码</a></li>'+
										  '<li data-filter-camera-type="Zed"><a href="javascript:showUpdateInfo(\''+appUuid+'\',\''+username+'\')">修改信息</a></li>'+
										  '<li data-filter-camera-type="Zed"><a href="javascript:deleteAppUser(\''+appUuid+'\',\''+username+'\')">删除</a></li>'+
										  '<li data-filter-camera-type="Zed"><a href="javascript:sendMessgeOne(\''+appUuid+'\',\''+username+'\')">发送消息</a></li>'+
										  
											'</ul>'+
										'</li>'+
									'</ul>'+
									'</td>'+
								'</tr>';
						
						
					});
					$('#tr_loading').remove();	
					$('#appUserBody').append(selectOptions);
				}
				// 无数据
				var tbody = document.getElementsByTagName("tbody")[0];
				if(!tbody.hasChildNodes()){
					var option = '<tr><td class="text-center" colspan="9">无数据!</td></tr>';
					$('#tr_loading').remove();	
					$('#appUserBody').append(option);
					var pageLi = $('#paginau').find('li');
					for(var i=0;i<pageLi.length;i++){
						$(pageLi[i]).hide();
					}
				} else {
					var ulB = '<ul>';
					var ulE = '</ul>';
					var textOp1 = '<li> <a href="javascript:void(0);" onclick="getPrevAppUserList();">上一页</a> </li>';
					var textOp2 = '<li> <a href="javascript:void(0);" onclick="getNextAppUserList();">下一页</a> </li>';
					$('#paginau').html('');
				
					
					// 首页
					if(pageNo == 1){
						if(respData.cursor == null){
							$('#paginau').append(ulB + ulE);
						} else {
							if(pageAction == 'no'){
								$('#paginau1').append(ulB + textOp2 + ulE);
							} else {
								$('#paginau').append(ulB + textOp2 + ulE);
							}
						}
						// 尾页
					} else if(cursors.length != 0 && respData.cursor == null){
						$('#paginau').append(ulB + textOp1 + ulE);
					} else {
						$('#paginau').append(ulB + textOp1 + textOp2 + ulE);
					}	
				}
			}
		});
	}
}


// 获取orgadmin列表
function getOrgAdminList(){
	// 获取token
	var access_token = $.cookie('access_token');
	var orgName = $.cookie('orgName');
	var loginUser = $.cookie('cuser');
	if(!access_token || access_token==''){
		alert('提示\n\n会话已失效,请重新登录!');
		window.location.href = 'index.html';
	} else {
		var loading = '<tr id="tr_loading"><td class="text-center" colspan="9"><img src ="assets/img/loading.gif">&nbsp;&nbsp;&nbsp;<span>正在读取数据...</span></td></tr>';
		$('#orgadminsBody').empty();
		$('#orgadminsBody').append(loading);

		$.ajax({
			url:baseUrl+'/management/organizations/'+ orgName +'/users',
			type:'GET',
			headers:{
				'Authorization':'Bearer ' + access_token,
				'Content-Type':'application/json'
			},
			error: function(jqXHR, textStatus, errorThrown) {
			},
			success: function(respData, textStatus, jqXHR) {
				$('tbody').html('');
				var selectOptions = '';
				$(respData.data).each(function(){
					var username = this.username;
					var confirmedStr = (this.confirmed == true) ? "已激活" : "未激活";
					var email = this.email;
					var companyName = this.properties.companyName;
					var telephone = this.properties.telephone;

					var ops = '';
					if(username != loginUser){
						ops = '<li class="dropdown all-camera-dropdown"><a class="dropdown-toggle" data-toggle="dropdown" href="#">操作<b class="caret"></b></a>'+
						'<ul class="dropdown-menu">'+'<li data-filter-camera-type="all"><a href="javascript:disConnAdminAndOrg(\''+username+'\')">移出管理员</a></li>';
					} else {
						ops = '当前登录账户禁止操作';
					}

					selectOptions += '<tr>'+
						'<td class="text-center">'+username+'</td>'+
						'<td class="text-center">'+email+'</td>'+
						'<td class="text-center">'+companyName+'</td>'+
						'<td class="text-center">'+telephone+'</td>'+
						'<td class="text-center">'+confirmedStr+'</td>'+
						'<td class="text-center">'+
						'<ul class="nav-pills" style="list-style-type:none">'+ ops
						'</ul>'+
						'</li>'+
						'</ul>'+
						'</td>'+
						'</tr>';
				});
				$('#tr_loading').remove();
				$('#orgadminsBody').append(selectOptions);
				// 无数据
				var tbody = document.getElementsByTagName("tbody")[0];
				if(!tbody.hasChildNodes()){
					var option = '<tr><td class="text-center" colspan="9">无数据!</td></tr>';
					$('#tr_loading').remove();
					$('#orgadminsBody').append(option);
				}
			}
		});
	}
}

// remove user from organization
function disConnAdminAndOrg(adminUserName){
	var access_token = $.cookie('access_token');
	var orgName = $.cookie('orgName');
	var loginUser = $.cookie('cuser');
	if(!access_token || access_token==''){
		alert('提示\n\n会话已失效,请重新登录!');
		window.location.href = 'index.html';
	} else {
		if(adminUserName != ''){
			if(loginUser == adminUserName){
				alert('当前登录账户禁止操作');
				return;
			} else {
				if(confirm("确定要移出该管理员吗?")){
					$.ajax({
						url:baseUrl　+　'/management/users/' + adminUserName + '/orgs/' + orgName,
						type:'DELETE',
						headers:{
							'Authorization':'Bearer ' + access_token,
							'Content-Type':'application/json'
						},
						error: function(respData, textStatus, jqXHR) {
							var error_description = jQuery.parseJSON(respData.responseText).error_description;
							if('Organizations must have at least one member.' == error_description){
								alert('企业管理员至少要有一个!!');
							} else {
								alert('移出管理员失败!');
							}
						},
						success: function(respData, textStatus, jqXHR) {
							var orgname = respData.data.name;
							if(orgName == orgname){
								alert('移出管理员成功!');
								window.location.href = 'admin_list.html';
							}
						}
					});
				}
			}
		}
	}
}

// 增加orgadminuser表单校验
function createAdminUserFormValidate(){
	// 表单校验
	$('#adminUserName').val($('#adminUserName').val().trim());
	var adminUserName = $('#adminUserName').val();
	if(adminUserName == ''){
		$('#adminUserNameMsg').hide();
		$('#adminUserNameEEMsg').hide();
		$('#adminUserNameEMsg').show();
		$('#adminUserNameOMsg').hide();
		return false;
	}
	var adminUserNameRegex = /^[0-9a-zA-Z]*$/;
	if(adminUserName != '' && !adminUserNameRegex.test(adminUserName)){
		$('#adminUserNameMsg').hide();
		$('#adminUserNameOMsg').hide();
		$('#adminUserNameEEMsg').hide();
		$('#adminUserNameEMsg').show();
		return false;
	}

	$('#adminPassword').val($('#adminPassword').val().trim());
	var adminPassword = $('#adminPassword').val();
	if(adminPassword == ''){
		$('#adminPasswordMsg').show();
		$('#adminPasswordOMsg').hide();
		return false;
	}

	$('#adminRePassword').val($('#adminRePassword').val().trim());
	var adminRePassword = $('#adminRePassword').val();
	var adminPassword = $('#adminPassword').val();

	if(adminRePassword == ''){
		$('#adminRePasswordMsg').hide();
		$('#adminRePasswordEMsg').show();
		$('#adminRePasswordEMsg').show();
		return false;
	}
	if('' != adminRePassword && adminPassword != adminRePassword){
		$('#adminRePasswordMsg').hide();
		$('#adminRePasswordEMsg').show();
		$('#adminRePasswordOMsg').hide();
		return false;
	}

	$('adminEmail').val($('#adminEmail').val().trim());
	var adminEmail = $('#adminEmail').val();
	if(adminEmail == ''){
		$('#adminEmailMsg').show();
		$('#adminEmailEMsg').hide();
		$('#adminEmailEEMsg').hide();
		$('#adminEmailOMsg').hide();
		return false;
	}
	var adminEmailRegex = /^([a-zA-Z0-9]+[_|\_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z0-9]{1,10}$/;
	if(adminEmail != '' && !adminEmailRegex.test(adminEmail)){
		$('#adminEmailMsg').hide();
		$('#adminEmailEMsg').show();
		$('#adminEmailEEMsg').hide();
		$('#adminEmailOMsg').hide();
		return false;
	}

	var adminCompany = $('#adminCompany').val();
	if(adminCompany == ''){
		$('#adminCompanyMsg').show();
		$('#adminCompanyEMsg').hide();
		$('#adminCompanyOMsg').hide();
		return false;
	}
	var adminCompanyRegex = /^[0-9a-zA-Z\-_\u4e00-\u9faf]*$/;
	if (adminCompany != '' && !adminCompanyRegex.test(adminCompany)) {
		$('#adminCompanyMsg').hide();
		$('#adminCompanyEMsg').show();
		$('#adminCompanyOMsg').hide();
		return false;
	}

	$('#adminTel').val($('#adminTel').val().trim());
	var regTel = $('#adminTel').val();
	if(regTel == ''){
		$('#adminTelMsg').show();
		$('#adminTelEMsg').hide();
		$('#adminTelOMsg').hide();
		return false;
	}

	if(regTel != '' && !checkTel(regTel)){
		$('#adminTelMsg').hide();
		$('#adminTelEMsg').show();
		$('#adminTelOMsg').hide();
		return false;
	}

	return true;
}

// 添加企业管理员
function saveNewAdminUserSubmit(adminUsername, adminPassword, adminEmail, adminCompany, adminTel){
	var access_token = $.cookie('access_token');
	var orgName = $.cookie('orgName');

	if(!access_token || access_token=='') {
		alert('提示\n\n会话已失效,请重新登录!');
		window.location.href = 'index.html';
	} else {
		if(createAdminUserFormValidate()){
			if(confirm("确定提交?")) {
				var data ={
					username:adminUsername,
					password:adminPassword,
					email:adminEmail,
					companyName:adminCompany,
					telephone:adminTel,
					category:'admin_append'
				};

				// 创建管理员用户
				$.ajax({
					url:baseUrl+'/management/users',
					type:'POST',
					headers:{
						'Authorization':'Bearer ' + access_token,
						'Content-Type':'application/json'
					},
					async:false,
					data:JSON.stringify(data),
					error: function(respData, textStatus, errorThrown) {
						var error_description = jQuery.parseJSON(respData.responseText).error_description;
						if(error_description.indexOf("Entity user requires that property named username be unique") > -1) {
							$('#adminUserNameEEMsg').show();
							$('#adminUserNameEMsg').hide();
							$('#adminUserNameOMsg').hide();
						} else if(error_description.indexOf("Entity user requires that property named email be unique") > -1) {
							$('#adminEmailEEMsg').show();
							$('#adminEmailOMsg').hide();
							$('#adminEmailEMsg').hide();
						} else {
							alert('添加APP管理员失败!');
						}
					},
					success: function(respData, textStatus, jqXHR) {
						clearNewAdminUserBox();
						var adminUserName = respData.data.username;
						if(adminUserName != '') {
							//　建立关系
							$.ajax({
								url:baseUrl　+　'/management/users/' + adminUserName + '/orgs/' + orgName,
								type:'PUT',
								headers:{
									'Authorization':'Bearer ' + access_token,
									'Content-Type':'application/json'
								},
								error: function(jqXHR, textStatus, errorThrown) {
									alert('管理员添加失败!');
								},
								success: function(respData, textStatus, jqXHR) {
									var orgname = respData.data.name;
									if(orgName == orgname){
										alert('添加管理员成功!\n请查收邮件并激活该账户,确保正常使用!');
										window.location.href = 'admin_list.html';
									}
								}
							});
						}
					}
				});
			}
		}
	}
}

//弹出修改信息框
function showUpdateInfo(appUuid, username){
	// 获取token
	var access_token = $.cookie('access_token');
	var cuser = $.cookie('cuser');
	var orgName = $.cookie('orgName');
	
	if(!access_token || access_token=='') {
		alert('提示\n\n会话已失效,请重新登录!');
		window.location.href = 'index.html';
	} else {
		$.ajax({
			url:baseUrl+'/'+ orgName +'/' + appUuid + '/users/' + username,
			type:'GET',
			headers:{
				'Authorization':'Bearer '+access_token,
				'Content-Type':'application/json'
			},
			error: function(jqXHR, textStatus, errorThrown) {
			},
			success: function(respData, textStatus, jqXHR) {
				$(respData.entities).each(function(){
					var username = this.username;
					var notification_display_style = this.notification_display_style;
					var nickname = this.nickname;
					var notification_no_disturbing=this.notification_no_disturbing;
					var notification_no_disturbing_start = this.notification_no_disturbing_start;
					var notification_no_disturbing_end = this.notification_no_disturbing_end ;
					$('#username').text(username);
					document.getElementById('messageType_0').checked=false;
					document.getElementById('messageType_1').checked=false;
					if(notification_display_style == 0){
						document.getElementById('messageType_0').checked='checked';
					}else if(notification_display_style == 1){
						document.getElementById('messageType_1').checked='checked';
					}
					$('#nickname').val(nickname);
					document.getElementById('notification_true').checked=false;	
					document.getElementById('notification_false').checked=false;	
					if(notification_no_disturbing){
						document.getElementById('notification_true').checked='checked';	
						document.getElementById('notification_time_div').style.display="block";
						$('#notification_starttime').val(notification_no_disturbing_start);
						$('#notification_endtime').val(notification_no_disturbing_end);
					}else if(!notification_no_disturbing){
						document.getElementById('notification_false').checked='checked';	
						document.getElementById('notification_time_div').style.display="none";
						$('#notification_starttime').val('');
						$('#notification_endtime').val('');
					}
					$('#showUpdateInfoA').click();
				});
			}
		});
	}
}

//修改信息
function updateInfo(appUuid){
	var access_token = $.cookie('access_token');
	var cuser = $.cookie('cuser');
	var orgName = $.cookie('orgName');
	var username =$('#username').text();
	var notification_display_style;
	if(document.getElementById('messageType_0').checked){
		notification_display_style = 0;
	}else if(document.getElementById('messageType_1').checked){
		notification_display_style = 1;
	}else{
		notification_display_style = '';
	}
	var nickname =$('#nickname').val();
	var notification_no_disturbing;
	var notification_no_disturbing_start;
	var notification_no_disturbing_end;
	if(document.getElementById('notification_true').checked){
		notification_no_disturbing = true;
		notification_no_disturbing_start = $('#notification_starttime').val();
		notification_no_disturbing_end = $('#notification_endtime').val();
	}else if(document.getElementById('notification_false').checked){
		notification_no_disturbing = false;
		notification_no_disturbing_start = '';
		notification_no_disturbing_end = '';
	}else{
		
	}
	var flag = true;
	if(nickname.length>20){
		flag =false;
	}
	
	if(document.getElementById('notification_true').checked){
		var numReg = /^[0-9]*$/;
		if(numReg.test(notification_no_disturbing_start) && numReg.test(notification_no_disturbing_end)){
			
			notification_no_disturbing_end = parseInt(notification_no_disturbing_end);
			notification_no_disturbing_start = parseInt(notification_no_disturbing_start);
			
			if(notification_no_disturbing_end >= 0 && notification_no_disturbing_end<=24 && notification_no_disturbing_start >= 0 && notification_no_disturbing_start <= 24){
				var d ={
					notification_display_style : notification_display_style,
					nickname : nickname,
					notification_no_disturbing :  notification_no_disturbing,
					notification_no_disturbing_start : notification_no_disturbing_start,
					notification_no_disturbing_end : notification_no_disturbing_end
				};
				var layerNum = layer.load('正在修改...');
				if(flag){
					$.ajax({
							url:baseUrl+'/'+ orgName +'/' + appUuid + '/users/' + username,
							type:'PUT',
							headers:{
								'Authorization':'Bearer '+access_token,
								'Content-Type':'application/json'
							},
							data:JSON.stringify(d),
							error: function(jqXHR, textStatus, errorThrown) {
								layer.close(layerNum);
								alert('修改失败!');
							},
							success: function(respData, textStatus, jqXHR) {
								layer.close(layerNum);
								alert('修改成功!');
								$('#infoCloseButn').click();
								getAppUserList(appUuid,'no');
							}
					});
				}else{
					alert('昵称不能超过20个字符!');	
				}
			}else{
				alert('时间格式不正确，请输入00 ~ 24！');
			}
			
		}else{
			alert('时间格式不正确，请输入00 ~ 24！');
		}
		
	}else if(!document.getElementById('notification_true').checked){
		var d ={
				notification_display_style : notification_display_style,
				nickname : nickname,
				notification_no_disturbing :  notification_no_disturbing,
				notification_no_disturbing_start : notification_no_disturbing_start,
				notification_no_disturbing_end : notification_no_disturbing_end
				};
				if(flag){
					$.ajax({
							url:baseUrl+'/'+ orgName +'/' + appUuid + '/users/' + username,
							type:'PUT',
							headers:{
								'Authorization':'Bearer '+access_token,
								'Content-Type':'application/json'
							},
							data:JSON.stringify(d),
							error: function(jqXHR, textStatus, errorThrown) {
								alert('修改失败!');
							},
							success: function(respData, textStatus, jqXHR) {
								alert('修改成功!');
								$('#infoCloseButn').click();
								getAppUserList(appUuid,'no');
							}
					});
				}else{
					alert('昵称不能超过20个字符!');	
				}
		
	}

}


// 搜索IM用户
function searchUser(appUuid, queryString){
	// 获取token
	var access_token = $.cookie('access_token');
	var cuser = $.cookie('cuser');
	var orgName = $.cookie('orgName');
	
	if(!access_token || access_token=='') {
		alert('提示\n\n会话已失效,请重新登录!');
		window.location.href = 'index.html';
	} else {
		
		$.ajax({
			url:baseUrl+'/'+ orgName +'/' + appUuid + '/users/' + queryString,
			type:'GET',
			headers:{
				'Authorization':'Bearer '+access_token,
				'Content-Type':'application/json'
			},
			error: function(jqXHR, textStatus, errorThrown) {
				$('tbody').html('');
				var option = '<tr><td class="text-center" colspan="9">用户不存在!</td></tr>';
				$('#appUserBody').append(option);
				$('#paginau').hide();
			},
			success: function(respData, textStatus, jqXHR) {
				$('tbody').html('');
				$(respData.entities).each(function(){
					var username = this.username;
					var created = format(this.created);
					var notification_display_style='';
					if(this.notification_display_style == 0){
						notification_display_style='仅通知';
					}else if(this.notification_display_style == 1){
						notification_display_style='发送详情';
					}
					var nickname = this.nickname;
					if(nickname == undefined){
						nickname='';
					}
					var notification_no_disturbing=this.notification_no_disturbing;
					if(this.notification_no_disturbing){

						var notification_no_disturbing='已开启';
						var notification_no_disturbing_time = this.notification_no_disturbing_start + ':00'+'--'+this.notification_no_disturbing_end + ':00';
					}else{
						var notification_no_disturbing='未开启';
						var notification_no_disturbing_time='----';
					}
					var notifier_name = this.notifier_name;
					if(notifier_name == undefined){
						notifier_name='';
					}
					var userAdmin = '';
					var excute = '';
					var user_name_show = username;
					var option = '<tr>'+
								'<td class="text-center"><label><input style="opacity:1;" name="checkbox" type="checkbox" value="'+username+'" />&nbsp;&nbsp;&nbsp;</label></td>'+	
								'<td class="text-center">'+user_name_show+'</td>'+																'<td class="text-center">'+notification_display_style+'</td>'+
								'<td class="text-center">'+nickname+'</td>'+
								'<td class="text-center">'+notification_no_disturbing+'</td>'+
								'<td class="text-center">'+notification_no_disturbing_time+'</td>'+
								'<td class="text-center">'+notifier_name+'</td>'+
							 	'<td class="text-center">'+created+'</td>'+
							 	'<td class="text-center"><a href="javascript:toAppIMList(\''+username+'\')" class="btn btn-mini btn-info">查看用户好友</a>'+
							 	' | <a href="#passwordMondify" id="passwdMod${status.index }" onclick="setUsername(\'' + appUuid + '\',\''+ username +'\');" data-toggle="modal" role="button" class="btn btn-mini btn-info">重置密码</a>'+
								'<li data-filter-camera-type="Zed"><a href="javascript:showUpdateInfo(\''+appUuid+'\',\''+username+'\')">修改信息</a></li>'+
							 	' | <a  class="btn btn-mini btn-info" href="javascript:deleteAppUser(\''+appUuid+'\',\''+username+'\')">删除</a>'+
								' | <a  class="btn btn-mini btn-info" href="javascript:sendMessgeOne(\''+appUuid+'\',\''+username+'\')">发送消息</a>'+
								'</td>'+
					 		'</tr>';
					 		var selectOptions = '<tr>'+
								'<td class="text-center"><label><input style="opacity:1;" name="checkbox" type="checkbox" value="'+username+'" />&nbsp;&nbsp;&nbsp;</label></td>'+	
								'<td class="text-center">'+user_name_show+'</td>'+
								'<td class="text-center">'+notification_display_style+'</td>'+
								'<td class="text-center">'+nickname+'</td>'+
								'<td class="text-center">'+notification_no_disturbing+'</td>'+
								'<td class="text-center">'+notification_no_disturbing_time+'</td>'+
								'<td class="text-center">'+notifier_name+'</td>'+
							 	'<td class="text-center">'+created+'</td>'+
							 	'<td class="text-center">'+
									'<ul class="text-center" class="nav-pills" style="list-style-type:none">'+
				    				'<li class="dropdown all-camera-dropdown"><a class="dropdown-toggle" data-toggle="dropdown" href="#">操作<b class="caret"></b></a>'+
				    					'<ul class="dropdown-menu">'+
					          		'<li data-filter-camera-type="all"><a href="javascript:toAppIMList(\''+username+'\')">查看用户好友</a></li>'+
							          '<li data-filter-camera-type="Alpha"><a href="#passwordMondify" id="passwdMod${status.index }" onclick="setUsername(\'' + appUuid + '\',\''+ username +'\');" data-toggle="modal" role="button">重置密码</a></li>'+
								'<li data-filter-camera-type="Zed"><a href="javascript:showUpdateInfo(\''+appUuid+'\',\''+username+'\')">修改信息</a></li>'+
							          '<li data-filter-camera-type="Zed"><a href="javascript:deleteAppUser(\''+appUuid+'\',\''+username+'\')">删除</a></li>'+
							          '<li data-filter-camera-type="Zed"><a href="javascript:sendMessgeOne(\''+appUuid+'\',\''+username+'\')">发送消息</a></li>'+
							          
							     		'</ul>'+
							     	'</li>'+
						     	'</ul>'+
								'</td>'+
					 		'</tr>';
					 		
					$('#appUserBody').append(selectOptions);
					
					$('#paginau').hide();
				});
			}
		});
	}
}

function setUsername(appUuid,username){
	$('#usernameMondify').val(username);
	$('#appUuidHidd').val(appUuid);
	$('#pwdMondify').val('');
}

//弹出发送消息
function sendMessge(appUuid){
	var checkbox=document.getElementsByName("checkbox");
	var num=0;
	for (var i=0;i<checkbox.length;i++){
		if(checkbox[i].checked){
			num++;
		}
	}
	if(num>0){
		var users = new Array();
		for (var i=0;i<checkbox.length;i++){
			if(checkbox[i].checked){
				users.push(checkbox[i].value);
			}
		}
		$('#usernameMessage').val(users);
		$('#appUuidMessage').val(appUuid);
		$('#messegeContent').val('');
		document.getElementById('messegeContent').style.display="block";
		$('#img1').remove();
		$('#share-secret').val('');
		$('#file').val('');
		$('#f_file').val('');
		$('#sendMessageA').click();
	}else{
		alert('至少选择一个用户!');	
	}
}

//单个消息发送
function sendMessgeOne(appUuid,users){
	$('#usernameMessage').val(users);
	$('#appUuidMessage').val(appUuid);
	$('#messegeContent').val('');
	document.getElementById('messegeContent').style.display="block";
	$('#img1').remove();
	$('#share-secret').val('');
	$('#file').val('');
	$('#f_file').val('');
	$('#sendMessageA').click();
}

//发送消息
function sendUserMessage1(){
	var users = document.getElementById('usernameMessage').value;
	var appUuid = document.getElementById('appUuidMessage').value;
	var orgName = $.cookie('orgName');
	var token = $.cookie('access_token');
	var messageContent = $('#messegeContent').val().trim();
	var target = users.split(',');
	if ( messageContent ==''){
		alert('消息不能为空');
	}else{
		var d = {
		  "target_type" : "users",
		  "target" : target,
		  
		  "msg" : {
			  "type" : "txt",
			  "msg" : messageContent //消息内容
			  }
		 }
		 var layerNum = layer.load('正在发送...');
		 $.ajax({
				url:baseUrl+'/'+ orgName + "/" + appUuid + '/messages',
				type:'POST',
				headers:{
					'Authorization':'Bearer '+token,
					'Content-Type':'application/json'
				},	
				data:JSON.stringify(d),
				error:function(respData){
				layer.close(layerNum);
					//alert('发送失败');
				},
				success:function(respData){
					layer.close(layerNum);
					$('#closeButn').click();
					//alert('发送成功');
				}
		 });
	}
	
}

//发送消息
function sendUserMessage(){
	var users = document.getElementById('usernameMessage').value;
	var appUuid = document.getElementById('appUuidMessage').value;
	var orgName = $.cookie('orgName');
	var token = $.cookie('access_token');
	var messageContent = $('#messegeContent').val().trim();
	var target = users.split(',');
	if ( messageContent ==''){
		alert('消息不能为空');
	}else{
		var d = {
		  "target_type" : "users",
		  "target" : target,
		  
		  "msg" : {
			  "type" : "txt",
			  "msg" : messageContent //消息内容
			  }
		 }
		 var layerNum = layer.load('正在发送...');
		 $.ajax({
				url:baseUrl+'/'+ orgName + "/" + appUuid + '/messages',
				type:'POST',
				headers:{
					'Authorization':'Bearer '+token,
					'Content-Type':'application/json'
				},	
				data:JSON.stringify(d),
				error:function(respData){
				layer.close(layerNum);
				alert('发送失败');
				},
				success:function(respData){
					layer.close(layerNum);
					$('#closeButn').click();
					alert('发送成功');
				}
		 });
	}
	
}
//发送图片
function sendUserImgMessage(){
	if($('#sndBtn').attr('disabled') == 'disabled'){
		return ;
	}
	
	if( $('#share-secret').val() == ''|| $('#share-secret').val() == null){
		alert('请先选择图片');	
	} else {
		var users = document.getElementById('usernameMessage').value;
		var appUuid = document.getElementById('appUuidMessage').value;
		var orgName = $.cookie('orgName');
		var token = $.cookie('access_token');
		var target = users.split(',');
		var str = $('#share-secret').val().split(',');
		var d = {
		  "target_type" : "users", //or chatgroups
		  "target" : target, //注意这里需要用数组, 即使只有一个用户, 也要用数组 ['u1']
		  "msg" : {
			  "type":"img","filename":str[0], "secret": str[1],"url":$('#imgUuid').val()
	       }
		 }
		 var layerNum = layer.load('正在发送...');
		 $.ajax({
				url:baseUrl+'/'+ orgName + "/" + appUuid + '/messages',
				type:'POST',
				headers:{
					'Authorization':'Bearer '+token,
					'Content-Type':'application/json'
				},	
				data:JSON.stringify(d),
				error:function(respData){
					layer.close(layerNum);
					alert('发送失败');
				},
				success:function(respData){
					layer.close(layerNum);
					$('#closeButn').click();
					alert('发送成功');
					// 清空图片元素
					$('#uploadresspan').text('等待上传图片');
					$('#img2').attr("src","assets/img/140144.jpg");
				}
		 });
	}
	
}


// 重置app用户密码
function updateAppUserPassword(){
	var username = $('#usernameMondify').val();
	var orgName = $.cookie('orgName');
	var cname = $.cookie('cuser');
	var token = $.cookie('access_token');
	var appUuid = $('#appUuidHidd').val();
	
  var pwdMondifyVal = $('#pwdMondify').val();
  var pwdMondifytwoVal = $('#pwdMondifytwo').attr('value');
	
	var passwordReg = /^[0-9a-zA-Z]{1,100}$/;
  if(pwdMondifyVal == ''){
  	$('#pwdMondify').focus();
		$('#pwdMondifySpan').html('请输入新密码');
		return;
	} else if(!passwordReg.test(pwdMondifyVal)){
		$('#pwdMondify').focus();
		$('#pwdMondifySpan').html('只能输入1~100位字母或者数字');
		return;
	} else {
		$('#pwdMondifySpan').html('');
		
		if(pwdMondifytwoVal == ''){
			$('#pwdMondifytwo').focus();
			$('#pwdMondifytwoSpan').html('请再次输入新密码');
			return;
		}else if(pwdMondifytwoVal != pwdMondifyVal){
			$('#pwdMondifytwo').focus();
			$('#pwdMondifytwoSpan').html('两次密码不一致');
			return;
		}else {
			$('#pwdMondifySpan').text('');
			$('#pwdMondifytwoSpan').text('');
			
			var d ={
				newpassword:pwdMondifyVal
			};
			var layerNum = layer.load('正在修改密码...');
			$.ajax({
				url:baseUrl + '/' + orgName + '/' + appUuid + '/users/' + username + '/password',
				type:'POST',
				data:JSON.stringify(d),
				headers:{
					'Authorization':'Bearer ' + token,
					'Content-Type':'application/json'
				},
				success:function(respData){
					layer.close(layerNum);
					alert('提示!\n\密码重置成功!');
					$('#pwdMondifySpan').text('');
					$('#pwdMondifytwoSpan').text('');
			    $('#pwdMondify').val('');
			    $('#pwdMondifytwo').val('');
					$('#passwordMondify').modal('hide');
				},
				error:function(data){
					layer.close(layerNum);
					alert('提示!\n\密码重置失败!');
				}
			});
		}
		
	}
}

// 删除app下的用户
function deleteAppUser(appUuid,username){
	var access_token = $.cookie('access_token');
	var orgName = $.cookie('orgName');
	if(confirm('确定要删除此用户吗?')){
		var layerNum = layer.load('正在删除...');
		$.ajax({
			url:baseUrl + '/' + orgName +'/' + appUuid + '/users/' + username,
			type:'DELETE',
			headers:{
				'Authorization':'Bearer ' + access_token,
				'Content-Type':'application/json'
			},		
			error:function(){
				layer.close(layerNum);
				alert('提示\n\n删除失败!');
			},
			success:function(respData){
				layer.close(layerNum);
				alert('提示\n\n删除成功!');
				getAppUserList(appUuid,'no');
			}
		});
	}
}
//批量删除app下的用户
function deleteAppUserCheckBox(appUuid){
		var checkbox=document.getElementsByName("checkbox");
		var num=0;
		for (var i=0;i<checkbox.length;i++){
			if(checkbox[i].checked){
				num++;
			}
		}
		if(num>0){
			if(confirm('确定要删除这些用户吗?')){
				var layerNum = layer.load('正在删除...');
				var success = 0;
				var fail = 0;
				for (var i=0;i<checkbox.length;i++){
					if(checkbox[i].checked){
						var flag = deleteAppUsers(appUuid,checkbox[i].value);
						if(flag){
							success ++;	
						}else{
							fail ++;	
						}
					}
				}
				layer.close(layerNum);
				alert('删除完成！'+success+'个成功，'+fail+'个失败!')
				getAppUserList(appUuid);
			}
		}else{
			alert('至少选择一个用户!');	
		}
}


//群组发送消息
function sendUserMessages(){
	var users = document.getElementById('usernameMessage').value;
	var appUuid = document.getElementById('appUuidMessage').value;
	var orgName = $.cookie('orgName');
	var token = $.cookie('access_token');
	var messageContent = $('#messegeContent').val().trim();
	var target = users.split(',');
	if ( messageContent ==''){
		alert('消息不能为空');
	}else{
		var d = {
		  "target_type" : "chatgroups", //or chatgroups
		  "target" : target, //注意这里需要用数组, 即使只有一个用户, 也要用数组 ['u1']
		  
		  "msg" : {
			  "type" : "txt",
			  "msg" : messageContent //消息内容，参考[聊天记录](http://developer.easemob.com/docs/emchat/rest/chatmessage.html)里的bodies内容
			  }
		 }
		 var layerNum = layer.load('正在发送...');
		 $.ajax({
				url:baseUrl+'/'+ orgName + "/" + appUuid + '/messages',
				type:'POST',
				headers:{
					'Authorization':'Bearer '+token,
					'Content-Type':'application/json'
				},	
				data:JSON.stringify(d),
				error:function(respData){
				layer.close(layerNum);
					//alert('发送失败');
				},
				success:function(respData){
					layer.close(layerNum);
					$('#closeButn').click();
					//alert('发送成功');
				}
		 });
	}
	
}
//群组发送图片
function sendUserImgMessages(){
	if( $('#share-secret').val() == ''|| $('#share-secret').val() == null){
		alert('请先选择图片');	
	}else{
		var users = document.getElementById('usernameMessage').value;
		var appUuid = document.getElementById('appUuidMessage').value;
		var orgName = $.cookie('orgName');
		var token = $.cookie('access_token');
		var messageContent = $('#messegeContent').val();
		var target = users.split(',');
		var str = $('#share-secret').val().split(',');
		var d = {
		  "target_type" : "chatgroups",
		  "target" : target,
		   "msg" : {
			  "type":"img","filename":str[0], "secret": str[1],"url":$('#imgUuid').val()
	           }
		 }
		 var layerNum = layer.load('正在发送...');
		 $.ajax({
				url:baseUrl+'/'+ orgName + "/" + appUuid + '/messages',
				type:'POST',
				headers:{
					'Authorization':'Bearer '+token,
					'Content-Type':'application/json'
				},	
				data:JSON.stringify(d),
				error:function(respData){
				layer.close(layerNum);
				alert('发送失败');
				},
				success:function(respData){
					layer.close(layerNum);
					$('#closeButn').click();
					$('#uploadresspan').text('等待上传图片');
					alert('发送成功');
				}
		 });
	}
	
}


//调用方法
function deleteAppUsers(appUuid,username){
	var access_token = $.cookie('access_token');
	var orgName = $.cookie('orgName');
	var flag ;
		$.ajax({
			async: false, 
			url:baseUrl + '/' + orgName +'/' + appUuid + '/users/' + username,
			type:'DELETE',
			headers:{
				'Authorization':'Bearer ' + access_token,
				'Content-Type':'application/json'
			},		
			error:function(){
				flag =false;
			},
			success:function(respData){
				flag =true;
			}
		});
		return flag;
}

// 获取app群组列表
function getAppChatrooms(appUuid, pageAction){

	// 获取token
	var access_token = $.cookie('access_token');
	var cuser = $.cookie('cuser');
	var orgName = $.cookie('orgName');
	if(!access_token || access_token==''){
		alert('提示\n\n会话已失效,请重新登录!');
		window.location.href = 'index.html';
	} else {
		if('next' == pageAction){
			pageNo += 1;
		} else if('forward' == pageAction){
			pageNo -= 1;
		}
		
		var tmp = '';
		if(typeof(pageAction) != 'undefined' && pageAction != '' && cursors[pageNo] != ''){	
			tmp = '&cursor=' + cursors[pageNo];
		}
		var loading = '<tr id="tr_loading"><td class="text-center" colspan="4"><img src ="assets/img/loading.gif">&nbsp;&nbsp;&nbsp;<span>正在读取数据...</span></td></tr>';
		$('#appChatroomBody').empty();
		$('#appChatroomBody').append(loading);
		$.ajax({
			url:baseUrl+'/'+ orgName + "/" + appUuid + '/chatgroups?limit=10' + tmp,
			type:'GET',
			headers:{
				'Authorization':'Bearer '+access_token,
				'Content-Type':'application/json'
			},		
			error:function(respData){

			},
			success:function(respData){
				
				$('tbody').html('');
				$(respData.data).each(function(){
					var groupid = $.trim(this.groupid);
					var groupname = $.trim(this.groupname);
					if(groupname == '' || groupname == null){
						groupname = '-';
					}
					var nums = 0;
					var admin='';
					var selectOptions = '<tr>'+
					'<td class="text-center"><label><input style="opacity:1;" name="checkbox" type="checkbox" value="'+groupid+'" />&nbsp;&nbsp;&nbsp;</label></td>'+	
					'<td class="text-center" width="222px" style="word-break:break-all">'+ groupid +'</td>'+
					'<td class="text-center" width="666px" style="word-break:break-all">'+ groupname +'</td>'+
					'<td class="text-center">'+
					'<ul class="text-center" class="nav-pills" style="list-style-type:none">'+
			    		'<li class="dropdown all-camera-dropdown"><a class="dropdown-toggle" data-toggle="dropdown" href="#">操作<b class="caret"></b></a>'+
				    	'<ul class="dropdown-menu">'+
				        '<li data-filter-camera-type="all"><a href="javascript:togroupaddAppAdminuserusers(\''+appUuid+'\',\''+groupid+'\')">查看群组成员</a></li>'+
				        '<li data-filter-camera-type="Alpha"><a href="javascript:deleteAppChatroom(\''+appUuid+'\',\''+groupid+'\')">删除</a></li>'+
				        '<li data-filter-camera-type="Zed"><a href="javascript:sendMessgeOne(\''+appUuid+'\',\''+groupid+'\')">发送消息</a></li>'+
					'</ul>'+
					'</li>'+
				        '</ul>'+
					'</td>'+
					'</tr>';
					$('#tr_loading').remove();
					$('#appChatroomBody').append(selectOptions);
				});

				var tbody = document.getElementsByTagName("tbody")[0];
				if(!tbody.hasChildNodes()){
					var option = '<tr><td class="text-center" colspan="7">无数据!</td></tr>';
					$('#appChatroomBody').append(option);
					var pageLi = $('#pagina').find('li');
					for(var i=0;i<pageLi.length;i++){
						$(pageLi[i]).hide();
					}
				}
				
				var ulB = '<ul>';
				var ulE = '</ul>';
				var textOp1 = '<li> <a href="javascript:void(0);" onclick="getAppChatrooms(\'' + appUuid + '\',\'forward\')">上一页</a> </li>';
				var textOp2 = '<li> <a href="javascript:void(0);" onclick="getAppChatrooms(\'' + appUuid + '\',\'next\')">下一页</a> </li>';
				$('#paginau').html('');
				var hasNext = (respData.cursor != undefined);
				cursors[pageNo+1] = respData.cursor;
				if(pageNo == 1){
					if(hasNext){
						$('#paginau').append(ulB + textOp2 + ulE);
					} else {
						$('#paginau').append(ulB + ulE);
					}
				} else {
					if(hasNext){
						$('#paginau').append(ulB + textOp1 + textOp2 + ulE);
					} else {
						$('#paginau').append(ulB + textOp1 + ulE);
					}
				}
			}
		});
	}
}

function selectFunqunzu(sel,appUuid,groupid){
		var value=sel.value;
		if(value == '查看群组成员'){
			togroupaddAppAdminuserusers(appUuid,groupid);
		}else if(value == '删除'){
			deleteAppChatroom(appUuid,groupid);
		}else if(value == '发送消息'){
			sendMessgeOne(appUuid,groupid);
		}
}
				
// 搜索app群组
function getAppChatgroups(appUuid, groupid, pageAction){
	$('#paginau').html('');
	var access_token = $.cookie('access_token');
	var cuser = $.cookie('cuser');
	var orgName = $.cookie('orgName');
	if(!access_token || access_token==''){
		alert('提示\n\n会话已失效,请重新登录!');
		window.location.href = 'index.html';
	} else {
		if('forward' == pageAction){
			pageNo += 1;
		} else if('next' == pageAction){
			pageNo -= 1;
		}
		
		var tmp = '';
		if(typeof(pageAction)!='undefined' && pageAction != ''){	
			tmp = '&cursor=' + cursors[pageNo];
		}
		var loading = '<tr id="tr_loading"><td class="text-center" colspan="4"><img src ="assets/img/loading.gif">&nbsp;&nbsp;&nbsp;<span>正在读取数据...</span></td></tr>';
		$('#appChatroomBody').empty();
		$('#appChatroomBody').append(loading);
		$.ajax({
			url:baseUrl+'/'+ orgName + "/" + appUuid + '/chatgroups/'+groupid,
			type:'GET',
			headers:{
				'Authorization':'Bearer '+access_token,
				'Content-Type':'application/json'
			},		
			error:function(respData){
				var error = jQuery.parseJSON(respData.responseText).error;
				$('tbody').html('');
				if('service_resource_not_found' == error || 'illegal_argument' == error){
					var option = '<tr><td class="text-center" colspan="4">该群id不存在，请重新输入!</td></tr>';
					$('#appChatroomBody').append(option);
				}
			},
			success:function(respData){
				// 缓存游标,下次next时候存新的游标
				if(pageAction!='forward'){
					cursors[pageNo+1] =	respData.cursor;
				} else {
					cursors[pageNo+1] = null;
				}
				$('tbody').html('');
				var groupid = respData.data[0].id;
				var groupname = respData.data[0].name;
				var errors=respData.data[0].error;
				if(errors != null){
					var option = '<tr><td class="text-center" colspan="4">该群id不存在，请重新输入!</td></tr>';
					$('#appChatroomBody').append(option);
					return;
				}
				if(groupname == '' || groupname == null){
					groupname = '-';
				}

				var selectOptions = '<tr>'+
					'<td class="text-center"><label><input style="opacity:1;" name="checkbox" type="checkbox" value="'+groupid+'" />&nbsp;&nbsp;&nbsp;</label></td>'+
					'<td class="text-center">'+groupid+'</td>'+
					'<td class="text-center">'+ groupname +'</td>'+
					'<td class="text-center">'+
						'<ul class="text-center" class="nav-pills" style="list-style-type:none">'+
							'<li class="dropdown all-camera-dropdown"><a class="dropdown-toggle" data-toggle="dropdown" href="#">操作<b class="caret"></b></a>'+
								'<ul class="dropdown-menu">'+
							'<li data-filter-camera-type="all"><a href="javascript:togroupaddAppAdminuserusers(\''+appUuid+'\',\''+groupid+'\')">查看群组成员</a></li>'+
							'<li data-filter-camera-type="Alpha"><a href="javascript:deleteAppChatroom(\''+appUuid+'\',\''+groupid+'\')">删除</a></li>'+
							'<li data-filter-camera-type="Zed"><a href="javascript:sendMessgeOne(\''+appUuid+'\',\''+groupid+'\')">发送消息</a></li>'+
								'</ul>'+
							'</li>'+
					'</ul>'+
					'</td>'+
				'</tr>';

				$('#tr_loading').remove();
				$('#appChatroomBody').append(selectOptions);
			}
		});
	}
	
}
// 查看群组成员
function togroupaddAppAdminuserusers(appUuid,groupid){
	window.location.href = 'app_chatgroup_users.html?appUuid=' + appUuid + '&groupid=' + groupid;
}
	
// 获取群组成员列表
function getAppChatroomsuser(appUuid,groupid,pageAction){
	// 获取token
	$('#paginau').html('');
	var access_token = $.cookie('access_token');
	var cuser = $.cookie('cuser');
	var orgName = $.cookie('orgName');
	if(!access_token || access_token==''){
		alert('提示\n\n会话已失效,请重新登录!');
		window.location.href = 'index.html';
	} else {
		if('forward' == pageAction){
			pageNo += 1;
		} else if('next' == pageAction){
			pageNo -= 1;
		}
		
		var tmp = '';
		if(typeof(pageAction)!='undefined' && pageAction != ''){	
			tmp = '&cursor=' + cursors[pageNo];
		}
		$.ajax({
			url:baseUrl + '/' +orgName +'/'+appUuid+'/chatgroups/' +groupid+'/users',
			type:'GET',
			headers:{
				'Authorization':'Bearer '+access_token,
				'Content-Type':'application/json'
			},		
			error:function(respData){
			},
			success:function(respData){
				if(pageAction!='forward'){
					cursors[pageNo+1] = respData.cursor;
				} else {
					cursors[pageNo+1] = null;
				}
				if(respData.entities.length ==0 && pageAction == 'no'){
					getAppChatroomsuser(appUuid,groupid,'forward' );
				}else{
					$('#showUsername').text(cuser)
					$('tbody').html('');
					$(respData.data).each(function(){
						
						var members = this.member;
						var owner = this.owner;
						if(owner !=undefined){
							$.cookie('owner',owner);
							
							var selectOptions = '<tr>'+
								'<td class="text-center" style="color:#FF0000;"><i class="icon-user"></i>&nbsp;'+owner+'</td>'+
								'<td class="text-center">对群主禁用'+
								'</td>'+
							'</tr>';
							
							$('#appIMBody').append(selectOptions);
						} 
						
						if(members != undefined) {
							var selectOptions = '<tr>'+
								'<td class="text-center">'+members+'</td>'+
								'<td class="text-center">'+
									'<ul class="text-center" class="nav-pills" style="list-style-type:none">'+
									'<li class="dropdown all-camera-dropdown"><a class="dropdown-toggle" data-toggle="dropdown" href="#">操作<b class="caret"></b></a>'+
										'<ul class="dropdown-menu" style="left:200px">'+
									'<li><a href="javascript:deleteAppChatroomUsers(\''+appUuid+'\',\''+groupid+'\',\''+members+'\')">移除</a></li>'+
										'</ul>'+
									'</li>'+
								'</ul>'+
								'</td>'+
							'</tr>';
							$('#appIMBody').append(selectOptions);
							
						}
					});
				}
				var tbody = document.getElementsByTagName("tbody")[0];
				if(!tbody.hasChildNodes()){
					var option = '<tr><td class="text-center" colspan="3">无数据!</td></tr>';
					$('#appIMBody').append(option);
					var pageLi = $('#pagina').find('li');
					for(var i=0;i<pageLi.length;i++){
						$(pageLi[i]).hide();
					}
				}
			}
		});
	}
	
}
// 删除app下的群组
function deleteAppChatroom(appUuid,groupuuid){
	var access_token = $.cookie('access_token');
	var orgName = $.cookie('orgName');
	
	if(confirm('确定要删除此群组吗?')){
		$.ajax({
			url:baseUrl + '/' +orgName +'/'+appUuid+'/chatgroups/' + groupuuid,
			type:'DELETE',
			headers:{
				'Authorization':'Bearer ' + access_token,
				'Content-Type':'application/json'
			},
			error:function(){
				alert('提示\n\n删除失败!');
			},
			success:function(respData){
				alert('提示\n\n删除成功!');
				window.location.href = 'app_chatgroups.html?appUuid='+appUuid;
			}
		});
	}
}
// 移除群组下的成员
function deleteAppChatroomUsers(appUuid,groupuuid,usersname){
	var access_token = $.cookie('access_token');
	var orgName = $.cookie('orgName');
	
	if(confirm('确定要把该成员移除此群组吗?')){
		$.ajax({
			url:baseUrl + '/' +orgName +'/'+appUuid+'/chatgroups/' +groupuuid+'/users/'+usersname,
			type:'DELETE',
			headers:{
				'Authorization':'Bearer ' + access_token,
				'Content-Type':'application/json'
			},
			error:function(){
				alert('提示\n\n移除失败!');
			},
			success:function(respData){
				alert('提示\n\n移除成功!');
				location.replace(location.href);
			}
		});
	}
}
// 添加群内成员
function addChatgroupMember(appUuid, groupid, newmember) {
	var orgName = $.cookie('orgName');
	var access_token = $.cookie('access_token');
	if (newmember == ''){
		$('#newmemberEMsg').text('请输入有效用户名!');	
	}else{
		$.ajax({
			url:baseUrl+'/'+ orgName +'/' + appUuid +'/users/' + newmember,
			type:'POST',
			headers:{
				'Authorization':'Bearer '+access_token,
				'Content-Type':'application/json'
			},
			error: function(jqXHR, textStatus, errorThrown) {
				$('#newmemberEMsg').text('该用户不存在，请检查输入!');
			},
			success: function(respData, textStatus, jqXHR) {
				var owner = $.cookie('owner');
				if(newmember != owner){
					$.ajax({
						url:baseUrl + '/' +orgName +'/' + appUuid+'/chatgroups/' + groupid + '/users/' + newmember,
						type:'POST',
						headers:{
							'Authorization':'Bearer '+access_token,
							'Content-Type':'application/json'
						},
						error: function(jqXHR, textStatus, errorThrown) {
						
						},
						success: function(respData, textStatus, jqXHR) {
							alert('添加成功');
							//getAppChatroomsuser(appUuid, groupid);
							location.replace(location.href);
						}
					});
				}else{
					$('#newmemberEMsg').text('该用户已经是管理员不能添加!');
				}
			}
		});
	}
}

// 添加群组
function createNewChatgroups(appUuid,qunzuname,qunzumiaosu,approval,publics,qunzuguan){
	var orgName = $.cookie('orgName');
	var access_token = $.cookie('access_token');
	var owner_username = $('#usernameFriend').val();
	var maxusers = $('#maxusers').val();
	var friend_username = $('#friendUsername').val();

	if (qunzuname == ''){
		$('#groupnameSpan').text('群组名称不能为空!');
	    return false;
	}
	
	if(qunzumiaosu ==''){
		$('#groupnameSpan').text('');
		$('#groupdescSpan').text('群组描述不能为空!');
	    return false;
    }
	var maxusersReg = /^[0-9]+$/;           
	if (maxusers == ''){
		$('#groupnameSpan').text('');
		$('#groupdescSpan').text('');
	   	$('#groupmaxuserSpan').text('请输入群组最大成员数!');
		return false;
	} else if(!(maxusersReg.test(maxusers) && parseInt(maxusers) >= 1)) {
		$('#groupmaxuserSpan').text('群组最大成员数只能是>1的数值!');
	}else if(qunzuguan==''){
		$('#groupnameSpan').text('');
		$('#groupdescSpan').text('');
	   	$('#groupmaxuserSpan').text('');
	    $('#qunzuguanSpan').text('群组管理员不能为空');
		return false;
	}else{
		$('#groupnameSpan').text('');
		$('#groupdescSpan').text('');
		$('#groupmaxuserSpan').text('');
		$('#qunzuguanSpan').text('');
		var qun={
	    		"groupname":qunzuname,
	    		"desc":qunzumiaosu, 
	    		"public":publics, 
	    		"owner":qunzuguan,
	    		"maxusers":parseInt(maxusers)
		}; 
		if(publics==true){
	    		qun.approval=approval;
		}
		$.ajax({
				url:baseUrl + '/' +orgName +'/'+appUuid+'/chatgroups',
				type:'POST',
			    	data:JSON.stringify(qun),
				headers:{
					'Authorization':'Bearer '+access_token,
					'Content-Type':'application/json'
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#qunzuguanSpan').text('该用户不存在，请检查用户名!');
				},
				success: function(respData, textStatus, jqXHR) {
					$('#qunzuguanSpan').text('');
					location.replace(location.href);
				}
		});		
	}
}
// 批量删除app下的群组的Ajax
function deleteAppChatrooms(appUuid,groupuuid){
	var access_token = $.cookie('access_token');
	var orgName = $.cookie('orgName');
		$.ajax({
			async: false, 
			url:baseUrl + '/' +orgName +'/'+appUuid+'/chatgroups/' + groupuuid,
			type:'DELETE',
			headers:{
				'Authorization':'Bearer ' + access_token,
				'Content-Type':'application/json'
			},
			error:function(){
			},
			success:function(respData){
			}
		});
	
}
//批量删除app下的群组调用
function deleteAppChatgroupsCheckBox(appUuid){
	var checkbox = document.getElementsByName("checkbox");
	var num = 0;
	for (var i=0;i<checkbox.length;i++){
		if(checkbox[i].checked){
			num++;
		}
	}
	if(num>0){
		if(confirm('确定要删除这些群组吗?')){
			for (var i=0;i<checkbox.length;i++){
				if(checkbox[i].checked){
					deleteAppChatrooms(appUuid, checkbox[i].value);
				}
			}
			location.replace(location.href);
		}
	}else{
		alert('至少选择一个群组!');	
	}
}
//============================================================证书 ========================================================================
// 上传证书
// 分页条更新
function updatequnzuPageStatus(){
	var pageLi = $('#paginau').find('li');
	
	// 获取token
	var access_token = $.cookie('access_token');
	var cuser = $.cookie('cuser');
	var orgName = $.cookie('orgName');
	if(!access_token || access_token==''){
		alert('提示\n\n会话已失效,请重新登录!');
		window.location.href = 'index.html';
	} else {
		$.ajax({
			url:baseUrl+'/'+ orgName +'/' + appUuid + '/notifiers?limit=1000',
			type:'GET',
			headers:{
				'Authorization':'Bearer '+access_token,
				'Content-Type':'application/json'
			},
			error: function(jqXHR, textStatus, errorThrown) {
			},
			success: function(respData, textStatus, jqXHR) {
				total = respData.entities.length;
				var totalPage = (total % 5 == 0) ? (parseInt(total / 5)) : (parseInt(total / 5) + 1);
				var ulB = '<ul>';
				var ulE = '</ul>';
				var textOp1 = '<li> <a href="javascript:void(0);" onclick="getPrevAppUserList();">上一页</a> </li>';
				var textOp2 = '<li> <a href="javascript:void(0);" onclick="getNextAppUserList();">下一页</a> </li>';
				$('#paginau').html('');
				// 首页
				if(pageNo == 1){
					if(totalPage == 1){
						$('#paginau').append(ulB + ulE);
					} else {
						$('#paginau').append(ulB + textOp2 + ulE);
					}
					// 尾页
				} else if(totalPage ==  pageNo){
					$('#paginau').append(ulB + textOp1 + ulE);
				} else {
					$('#paginau').append(ulB + textOp1 + textOp2 + ulE);
				}
			}
		});
	}
}

// 查询证书信息
function getAppNotifiers(appUuid, pageAction){
	$('#paginau').html('');
	var access_token = $.cookie('access_token');
	var orgName = $.cookie('orgName');
	if('next' == pageAction){
			pageNo += 1;
		} else if('forward' == pageAction){
			pageNo -= 1;
		}
		var temp = '';
		if(typeof(pageAction)!='undefined' && pageAction != ''){	
			temp = '&cursor='+cursors[pageNo];
		}
	
		var loading = '<tr id="tr_loading"><td class="text-center" colspan="6"><img src ="assets/img/loading.gif">&nbsp;&nbsp;&nbsp;<span>正在读取数据...</span></td></tr>';
		$('#appCredentialBody').empty();
		$('#appCredentialBody').append(loading);
		$.ajax({
			url:baseUrl+'/'+ orgName +'/' + appUuid + '/notifiers?limit=8'+temp,
			type:'GET',
			headers:{
				'Authorization':'Bearer ' + access_token,
				'Content-Type':'application/json'
			},
			error: function(jqXHR, textStatus, errorThrown) {
				
			},
			success: function(respData, textStatus, jqXHR) {
				if(pageAction != 'forward'){
					cursors[pageNo + 1] =	respData.cursor;
				} else {
					cursors[pageNo + 1] = null;
				}
				
				var option = '';
				$(respData.entities).each(function(){
					var statusStr = '异常';

					var name = this.name;
					var credentialUuid = this.uuid;
					var credentialId = this.uuid;
					var passphrase = this.passphrase;
					var environment = '';
					if(this.environment == 'DEVELOPMENT') {
						environment = '开发';
					} else if(this.environment == 'PRODUCTION'){
						environment = '生产';
					}

					var created = format(this.created);
					var modified = format(this.modified);
					option += '<tr>'+
						'<td class="text-center">'+name+'</td>'+
						'<td class="text-center">'+environment+'</td>'+
						'<td class="text-center">'+created+'</td>'+
						'<td class="text-center">'+modified+'</td>'+
						'<td class="text-center">&nbsp;<a href="javascript:deleteAppNotifiers(\''+ credentialId + '\',\''+ appUuid +'\')">删除</a></td>'+
						'</tr>';

				});
				$('#appCredentialBody').html('');
				$('#appCredentialBody').append(option);
				
				// 无数据
				var tbody = document.getElementsByTagName("tbody")[0];
				if(!tbody.hasChildNodes()){
					var option = '<tr><td class="text-center" colspan="6">无数据!</td></tr>';
					$('#tr_loading').remove();
					$('#appUserAdminBody').append(option);
					var pageLi = $('#paginau').find('li');
					for(var i=0;i<pageLi.length;i++){
						$(pageLi[i]).hide();
					}
				} else {
					var ulB = '<ul>';
					var ulE = '</ul>';
					var textOp1 = '<li> <a href="javascript:void(0);" onclick="getPrevAppNotifiers();">上一页</a> </li>';
					var textOp2 = '<li> <a href="javascript:void(0);" onclick="getNextAppNotifiers();">下一页</a> </li>';
					$('#paginau').html('');
						
					// 首页
					if(pageNo == 1){
						if(respData.cursor == null){
							$('#paginau').append(ulB + ulE);
						} else {
							$('#paginau').append(ulB + textOp2 + ulE);
						}
						// 尾页
					} else if(cursors.length != 0 && respData.cursor == null){
						$('#paginau').append(ulB + textOp1 + ulE);
					} else {
						$('#paginau').append(ulB + textOp1 + textOp2 + ulE);
					}	
				}
				if(respData.entities.length == 0){
					var option = '<tr><td class="text-center" colspan="6">暂无证书!</td></tr>';
					$('#appCredentialBody').append(option);
				}
			}
		});
}

// 证书验证
function verifyCredential(credentialUuid,appUuid){
        $('#'+credentialUuid).html('......');
	var access_token = $.cookie('access_token');
	var orgName = $.cookie('orgName');
	$.ajax({
		url:baseUrl + '/' +orgName +'/'+appUuid+'/verify/' + credentialUuid,
		type:'GET',
		headers:{
			'Authorization':'Bearer ' + access_token
		},
		error:function(){
			$('#'+credentialUuid).html('异常');
		},
		success:function(respData){
			var creStatus = respData.status;
			if(creStatus == 'ok'){
				$('#'+credentialUuid).html('正常');
			} else {
				$('#'+credentialUuid).html('异常');
			}
		}
	});
}

// 删除开发者推送证书
function deleteAppNotifiers(credentialId,appUuid){
	var access_token = $.cookie('access_token');
	var orgName = $.cookie('orgName');
	if(confirm('确定删除这个证书吗?')){
		var layerNum = layer.load('正在删除...');
		$.ajax({
			url:baseUrl+'/'+ orgName +'/' + appUuid + '/notifiers/' + credentialId,
			type:'DELETE',
			headers:{
				'Authorization':'Bearer ' + access_token,
				'Content-Type':'application/json'
			},
			error: function(jqXHR, textStatus, errorThrown) {
				layer.close(layerNum);
				alert('证书删除失败!')	
			},
			success: function(respData, textStatus, jqXHR) {
					layer.close(layerNum);
					alert('证书已删除!')	
					getAppNotifiers(appUuid,'no');
			}
		});	
	}
}

//==============================================================IM=======================================================================
// 用户好友列表
function toAppIMList(owner_username){
	window.location.href = 'app_users_contacts.html?appUuid='+appUuid+'&owner_username='+owner_username;
}
//获取用户好友列表
function getAppIMList(appUuid, owner_username){
	// 获取token
	var access_token = $.cookie('access_token');
	var cuser = $.cookie('cuser');
	var orgName = $.cookie('orgName');
	if(!access_token || access_token==''){
		alert('提示\n\n会话已失效,请重新登录!');
		window.location.href = 'index.html';
	} else {
		var loading = '<tr id="tr_loading"><td class="text-center" colspan="3"><img src ="assets/img/loading.gif">&nbsp;&nbsp;&nbsp;<span>正在读取数据...</span></td></tr>';
		$('#appIMBody').empty();
		$('#appIMBody').append(loading);
		$.ajax({
			url:baseUrl+'/'+ orgName +'/' + appUuid + '/users/'+owner_username+'/contacts/users',
			type:'GET',
			headers:{
				'Authorization':'Bearer '+access_token,
				'Content-Type':'application/json'
			},
			error: function(jqXHR, textStatus, errorThrown) {
			},
			success: function(respData, textStatus, jqXHR) {
				
				$('tbody').html('');
				var i=0;
				var selectOptions = '';
				$(respData.data).each(function(){
					selectOptions += '<tr>'+
							'<td style=" visibility:visible;"><input type="checkbox" value="fff"  style="width:100px; height:20px;border:1px solid #F00;"/>'+(i+1)+'</td>'+
							'<td>'+respData.data[i]+'</td>'+
						 	'<td class="text-center">'+
								'<ul class="text-center" class="nav-pills" style="list-style-type:none">'+
			    				'<li class="dropdown all-camera-dropdown"><a class="dropdown-toggle" data-toggle="dropdown" href="#">操作<b class="caret"></b></a>'+
			    					'<ul class="dropdown-menu" style="left:150px;">'+
				          		'<li><a href="javascript:deleteAppIMFriend(\''+appUuid+'\', \''+owner_username+'\',\''+respData.data[i]+'\')">解除好友关系</a></li>'+
						     		'</ul>'+
						     	'</li>'+
					     	'</ul>'+
							'</td>'+
				 		'</tr>';
					i++;
					
				});
				$('#tr_loading').remove();
				$('#appIMBody').append(selectOptions);
				// 无数据
				var tbody = document.getElementsByTagName("tbody")[0];
				if(!tbody.hasChildNodes()){
					var option = '<tr><td class="text-center" colspan="3">无数据!</td></tr>';
					$('#appIMBody').append(option);
					var pageLi = $('#paginau').find('li');
					for(var i=0;i<pageLi.length;i++){
						$(pageLi[i]).hide();
					}
				}
			}
		});
	}
}


//删除某个好友
function deleteAppIMFriend(appUuid, owner_username, friend_username){
	//获取token
	var orgName = $.cookie('orgName');
	var access_token = $.cookie('access_token');
	if(!access_token || access_token==''){
		alert('提示\n\n会话已失效,请重新登录!');
		window.location.href = 'index.html';
	} else {
		if(window.confirm('确定删除此好友？')){
			$.ajax({
				url:baseUrl+'/'+ orgName +'/' + appUuid + '/users/'+owner_username+'/contacts/users/'+friend_username,
				type:'DELETE',
				headers:{
					'Authorization':'Bearer '+access_token,
					'Content-Type':'application/json'
				},
				error: function(jqXHR, textStatus, errorThrown) {
				},
				success: function(respData, textStatus, jqXHR) {
					location.replace(location.href);
				}
			});
		}
	}

}

//弹出添加好友页面
function showAddFriend(appUuid,username){
	$('#usernameFriend').val(username);
	$('#appUuidFriend').val(appUuid);
	$('#friendUsername').val('');
	$('#showAddFriend').click();
}

//添加好友
function addIMFriend(){
	var orgName = $.cookie('orgName');
	var access_token = $.cookie('access_token');
	var owner_username = $('#usernameFriend').val();
	var appUuid = $('#appUuidFriend').val();
	var friend_username = $('#friendUsername').val();
	if (friend_username == ''){
		alert('好友名称不能为空!');	
	}else{
		var layerNum = layer.load('正在验证名称...');
		$.ajax({
				url:baseUrl+'/'+ orgName +'/' + appUuid +'/users/' + friend_username,
				type:'POST',
				headers:{
					'Authorization':'Bearer '+access_token,
					'Content-Type':'application/json'
				},
				error: function(jqXHR, textStatus, errorThrown) {
					layer.close(layerNum);
					alert('提示\n\n该用户不存在，请检查用户名!');
				},
				success: function(respData, textStatus, jqXHR) {
					var layerNum = layer.load('正在添加好友...');
					$.ajax({
						url:baseUrl+'/'+ orgName +'/' + appUuid +'/users/' + owner_username + '/contacts/users/' + friend_username,
						type:'POST',
						headers:{
							'Authorization':'Bearer '+access_token,
							'Content-Type':'application/json'
						},
						error: function(jqXHR, textStatus, errorThrown) {
							
						},
						success: function(respData, textStatus, jqXHR) {
							layer.close(layerNum);
							alert('添加好友成功!');
							location.replace(location.href);
						}
					});
				}
		});
	
		
	}
	
}


//=====================================================================管理员===============================================================

//获取管理员列表
function getAppUsersAdminList(appUuid, pageAction){
	// 获取token
	$('#paginau').html('');
	var access_token = $.cookie('access_token');
	var cuser = $.cookie('cuser');
	var orgName = $.cookie('orgName');
	if(!access_token || access_token==''){
		alert('提示\n\n会话已失效,请重新登录!');
		window.location.href = 'index.html';
	} else {
		if('next' == pageAction){
			pageNo += 1;
		} else if('forward' == pageAction){
			pageNo -= 1;
		}
		var temp = '';
		if(typeof(pageAction)!='undefined' && pageAction != ''){	
			temp = '&cursor='+cursors[pageNo];
		}
		var loading = '<tr id="tr_loading"><td class="text-center" colspan="4"><img src ="assets/img/loading.gif">&nbsp;&nbsp;&nbsp;<span>正在读取数据...</span></td></tr>';
		$('#appUserAdminBody').empty();
		$('#appUserAdminBody').append(loading);
		$.ajax({
			url:baseUrl+'/'+ orgName +'/' + appUuid +'/roles/admin/users?limit=10' + temp,
			type:'GET',
			headers:{
				'Authorization':'Bearer '+access_token,
				'Content-Type':'application/json'
			},
			error: function(jqXHR, textStatus, errorThrown) {
			},
			success: function(respData, textStatus, jqXHR) {
				if(pageAction!='forward'){
					if(respData.cursor){
						cursors[pageNo+1] = respData.cursor;
					}else{
						cursors[pageNo+1] = null;
					}
				}
				if(respData.entities.length ==0 && pageAction == 'no'){
					getAppUsersAdminList(appUuid,'forward' );
				}else{
					$('tbody').html('');
					var i=0;
					var selectOptions = '';
					$(respData.entities).each(function(){
						var username = this.username;
						var created = format(this.created);
						selectOptions += '<tr>'+
								'<td class="text-center">'+(i+1)+'</td>'+	
								'<td class="text-center">'+username+'</td>'+
								'<td class="text-center">'+created+'</td>'+
								'<td class="text-center">'+
									'<ul class="text-center" class="nav-pills" style="list-style-type:none">'+
									'<li class="dropdown all-camera-dropdown"><a class="dropdown-toggle" data-toggle="dropdown" href="#">操作<b class="caret"></b></a>'+
										'<ul class="dropdown-menu">'+
									'<li><a href="javascript:deleteUserAdmin(\''+appUuid+'\',\''+username+'\')">撤销管理员</a></li>'+
										'</ul>'+
									'</li>'+
								'</ul>'+
								'</td>'+
							'</tr>';
						i++;
						
					});
					$('#tr_loading').remove();
					$('#appUserAdminBody').append(selectOptions);
				}
				// 无数据
				var tbody = document.getElementsByTagName("tbody")[0];
				if(!tbody.hasChildNodes()){
					var option = '<tr><td class="text-center" colspan="4">无数据!</td></tr>';
					$('#tr_loading').remove();
					$('#appUserAdminBody').append(option);
					var pageLi = $('#paginau').find('li');
					for(var i=0;i<pageLi.length;i++){
						$(pageLi[i]).hide();
					}
				} else {
					var ulB = '<ul>';
					var ulE = '</ul>';
					var textOp1 = '<li> <a href="javascript:void(0);" onclick="getPrevAppUserList();">上一页</a> </li>';
					var textOp2 = '<li> <a href="javascript:void(0);" onclick="getNextAppUserList();">下一页</a> </li>';
					$('#paginau').html('');
						
					// 首页
					if(pageNo == 1){
						if(respData.cursor == null){
							$('#paginau').append(ulB + ulE);
						} else {
							$('#paginau').append(ulB + textOp2 + ulE);
						}
						// 尾页
					} else if(cursors.length != 0 && respData.cursor == null){
						$('#paginau').append(ulB + textOp1 + ulE);
					} else {
						$('#paginau').append(ulB + textOp1 + textOp2 + ulE);
					}	
				}
			}
		});
	}
}


//设置管理员
function setUserAdmin(appUuid,user_name){
	//获取token
	var token = $.cookie('access_token');
	var orgName = $.cookie('orgName');
	$.ajax({
		url:baseUrl + '/' + orgName + '/' + appUuid + '/users/'+ user_name +'/roles/admin',
		type:'POST',
		data:{},
		headers:{
			'Authorization':'Bearer ' + token,
			'Content-Type':'application/json'
		},
		success:function(respData){
			alert('设置管理员成功!')
			getAppUserList(appUuid,'no');
		},
			error:function(data){
			alert('设置管理员失败!')
		}
	});
}
	
//撤销管理员
function deleteUserAdmin(appUuid,user_name){
	var token = $.cookie('access_token');
	var orgName = $.cookie('orgName');
	var url=window.location.href;
	var str=url.substring(url.lastIndexOf('app_u'),url.lastIndexOf('.html'));
	if(confirm('您确定要撤销此用户管理员身份么?')){
		$.ajax({
			url:baseUrl +'/' +orgName+'/'+appUuid+ '/roles/admin/users/'+user_name,
	
			type:'DELETE',
			data:{},
			headers:{
				'Authorization':'Bearer ' + token,
				'Content-Type':'application/json'
			},
			success:function(respData){
				alert('撤销管理员成功!')
				if(str == 'app_users_admin'){
					getAppUsersAdminList(appUuid,'no');
				}else if(str == 'app_users'){
					getAppUsersAdminList(appUuid,'no');
				}
				
			},
				error:function(data){
				alert('撤销管理员失败!')
			}
		});
	}
	
}
//撤销管理员For搜索页面
function deleteUserAdminForSearch(appUuid,user_name){
	var token = $.cookie('access_token');
	var orgName = $.cookie('orgName');
	var url=window.location.href;
	var str=url.substring(url.lastIndexOf('app_u'),url.lastIndexOf('.html'));
	if(confirm('您确定要撤销此用户管理员身份么?')){
		$.ajax({
			url:baseUrl +'/' +orgName+'/'+appUuid+ '/roles/admin/users/'+user_name,
	
			type:'DELETE',
			data:{},
			headers:{
				'Authorization':'Bearer ' + token,
				'Content-Type':'application/json'
			},
			success:function(respData){
				alert('撤销管理员成功!')
				searchUser(appUuid, user_name);		
			},
				error:function(data){
				alert('撤销管理员失败!')
			}
		});
	}
	
}
//设置管理员For搜索页面
function setUserAdminForSearch(appUuid,user_name){
	var token = $.cookie('access_token');
	var orgName = $.cookie('orgName');
	$.ajax({
		url:baseUrl + '/' + orgName + '/' + appUuid + '/users/'+ user_name +'/roles/admin',
		type:'POST',
		data:{},
		headers:{
			'Authorization':'Bearer ' + token,
			'Content-Type':'application/json'
		},
		success:function(respData){
			alert('设置管理员成功!')
			searchUser(appUuid, user_name);
		},
			error:function(data){
			alert('设置管理员失败!')
		}
	});
}


String.prototype.Trim = function() { 
	var m = this.match(/^\s*(\S+(\s+\S+)*)\s*$/); 
	return (m == null) ? "" : m[1]; 
} 
String.prototype.isMobile = function() { 
	return (/^(?:13\d|15[89])-?\d{5}(\d{3}|\*{3})$/.test(this.Trim())); 
} 
String.prototype.isTel = function() { 
	//"兼容格式: 国家代码(2到3位)-区号(2到3位)-电话号码(7到8位)-分机号(3位)" 
	return (/^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test(this.Trim())); 
}

