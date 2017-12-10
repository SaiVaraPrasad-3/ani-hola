

(function() {
	
	var loggedInstatus = getParameterByName('status');
	if(loggedInstatus ==='loginsuccess')
	{
		$("#signUpForm").toggle();
		$("#groupSelection").toggle();
		$("#newgroupForm").toggle();
	}
	else
	{
		$("#groupSelection").hide();
		$("#newgroupForm").hide();
	}
	
	
	function getParameterByName( name ){
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( location.search );
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
	
})();
(function () {
	
	// selector function   
	var getNode = function(s) {
        return document.querySelector(s);   
    };

   // get the form nodes
   var user_email_input = getNode('#user_email'),
        user_name_input = getNode('#user_name'),    
        fpass_input = getNode('#password_first'),
        cpass_input = getNode('#password_confirm');
		mobileNo_input=getNode('#mobile_No');
		user_status_input=getNode('#user_personal_status');
		
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
		
		var loggedInstatus = getParameterByName('status');
		function getParameterByName( name ){
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( location.search );
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
		if(loggedInstatus ==='loginsuccess')
		{
			//loadGroups();
		}
		function loadGroups()
		{
			server.emit('loadGroupddl');
		}
    // add the event listener for the login submit button
        submit_button.addEventListener('click', function(event){

            // create variables to send to the server and assign them values
            var user_email = user_email_input.value.toLowerCase().trim(),
                user_name = user_name_input.value,
                fpass = fpass_input.value,
                cpass = cpass_input.value,
				user_mobileNo = mobileNo_input.value;
				user_status = user_status_input.value;


            // send the values to the server
            server.emit('join', {
                user_email: user_email,
                user_name: user_name,
				fpass: fpass,
                cpass: cpass,
				user_mobileNo:user_mobileNo,
				user_status:user_status
            });
            event.preventDefault;
        });
		newgroup_button.addEventListener('click', function(event){
			 var group_name = $("#group_name").val(),
				 group_note=$("#group_note").val();
				 
				 server.emit('createHolaGroup',{
					 
					 group_name:group_name,
					 group_note:group_note,
					 group_owner:localStorage.getItem('LoggedInUserID')
				 });
			event.preventDefault;
		});
		// alert error messages returned from the server
        server.on('alert', function(msg){
            alert(msg);
        });
		server.on('toggle-form', function(res)
		{
			$("#signUpForm").toggle();
			$("#groupSelection").show();
			$("#newgroupForm").hide();		
			localStorage.setItem("LoggedInUserID", res[0].user_email);			
			localStorage.setItem("LoggedInUserName", res[0].user_name);
			localStorage.setItem("LoggedInUserMobNo", res[0].user_mobileNo);
			localStorage.setItem("LoggedInUserStatus", res[0].user_status);
			
			loadGroups();
		});
		server.on('groupCreationSuccess' , function(data){
			
			$("#signUpForm").hide();
			$("#groupSelection").toggle();
			$("#newgroupForm").toggle();
			document.getElementById('search-box').value=$("#group_name").val();
			//$('#search-box').value =$("#group_name").val();
			//$('#ddlGroup').append('<option value="'+data+'" selected="selected">'+data+'</option>');
			//$('#ddlGroup').selectpicker('refresh');
			$('#createGrp').hide();
		});
		server.on('loadHolaGroups', function(res){
			
			var htmlStr='<ul id="holagroup-list">';
			if(res.length > 0)
			{
				for(var i=0; i < res.length; i++)
				{
					
					var tempstr="selectHolaGroup('"+ res[i].group_name+"');"
					htmlStr +='<li onclick="'+ tempstr +'">' + res[i].group_name +'</li>';
				}
				htmlStr +='</ul>'
				
			}
			else
			{
				htmlStr +='</ul>';
			}
			$('#suggestion-box').show();
			$('#suggestion-box').html(htmlStr);
			$('#search-box').css('background', '#fff');
			
		});
		
		
		$(document).ready(function(){
			$('#search-box').keyup(function(){
				$('#holaDriveOptions').hide();
				$('#search-box').css('background','#fff url(img/LoaderIcon.gif) no-repeat 265px');
				server.emit('loadGroupddl',$(this).val());
				
			});
			
		});
		
	}
}) ();

function selectHolaGroup(val)
		{
			$('#search-box').val(val);
			$('#suggestion-box').hide();
			$('#holaDriveOptions').show();
		}