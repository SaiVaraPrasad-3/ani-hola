

(function() {
	
	
	
})();
(function () {
	
	// selector function   
	var getNode = function(s) {
        return document.querySelector(s);   
    };

   // get the form nodes
   var  user_name_input = getNode('#user_name'),    
		mobileNo_input=getNode('#mobile_No'),
		user_status_input=getNode('#user_personal_status'),
		fpass_input=getNode('#password_first');
		// attempt a connection to the server
    try {
        var server = io.connect(localStorage.getItem('HolaCloudUrl'));
		//var server = io.connect("http://127.0.0.1:8082/");
    }
    catch(e) {
        alert('Sorry, we couldn\'t connect. Please try again later \n\n' + e);
    }
	
	// if connection is successful
	if(server !== undefined) {
		
		server.emit('getUserDetails',{ user_email:localStorage.getItem('LoggedInUserID')});
		server.on('bindUserDetails', function(data){
			
			user_name_input.value=data[0].user_name;
			mobileNo_input.value=data[0].user_mobileNo;
			user_status_input.value=data[0].user_status;
			fpass_input.value=data[0].password;
			
		});
        server.on('alert', function(msg){
            alert(msg);
        });
		btnUpdate.addEventListener('click', function(event){
			
			server.emit('updateProfile',{
				
			user_email:localStorage.getItem('LoggedInUserID'),
			user_status:user_status_input.value,
			user_name:user_name_input.value,
			user_mobileNo:mobileNo_input.value,
			password:fpass_input.value
			
			});
		});
		server.on('updateLocalStorage', function(msg){
			
			localStorage.setItem("LoggedInUserName", msg.user_name);
			localStorage.setItem("LoggedInUserMobNo", msg.user_mobileNo);
			localStorage.setItem("LoggedInUserStatus", msg.user_status);
		});

	}
}) ();