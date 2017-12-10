(function () {

var getNode= function(s){return document.querySelector(s);};

var user_email_input=getNode('#userId');
var user_password_input=getNode('#passWd');

try
{
var server = io.connect("http://firstmodulsapp-58022.onmodulus.net/")
//var server = io.connect("http://127.0.0.1:8082/");
}
catch(e){
alert('Sorry,We could not connect. Please try again later' +e );
}
if(server !== undefined)
{
  signIn.addEventListener('click', function(event) {
   
   var user_email= user_email_input.value.toLowerCase().trim();
   var user_password= user_password_input.value;
   
   server.emit('signIn', { user_email:user_email, user_password: user_password});
    event.preventDefault;
  });
  
   server.on('alert', function(msg){ alert(msg);});
   server.on('redirect', function(msg){
	   
	var status= msg.login_status;
	localStorage.setItem("LoggedInUserID", msg.user_email);
	localStorage.setItem("LoggedInUserName", msg.user_name);
	localStorage.setItem("LoggedInUserMobNo", msg.user_mobileNo);
	localStorage.setItem("LoggedInUserStatus", msg.user_status);
	if(status ==='success'){window.location.href="signUp.html?status=loginsuccess&userName="+msg.user_email;}
	else {alert('check your User name and password');}
   });
  
}

}) ();