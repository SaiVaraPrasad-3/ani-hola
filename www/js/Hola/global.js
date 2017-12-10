var holaUsrId, holaUsrName,holaUsrMobileNo, holaUsrStatus;
function getParameterByName( name ){
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( location.search );
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

(function(){
	
try
{
	var server = io.connect(localStorage.getItem('HolaCloudUrl'));
	//var server = io.connect("http://127.0.0.1:8082/");
}
catch(e){
	alert('Sorry,We could not connect. Please try again later' +e );
}
if(server !== undefined)
{
	server.emit('getUserDetails',{user_email:localStorage.getItem('LoggedInUserID')});
	server.on('alert',function(msg){alert(msg)});
	server.on('bindUserDetails',function(res){
		
		holaUsrId=res[0].user_email;
		holaUsrName=res[0].user_name;
		holaUsrMobileNo=res[0].user_mobileNo;
		holaUsrStatus=res[0].user_status;
	});
	
}
	
})();