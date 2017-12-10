
var chatAudience="ALL";
function loadChat()
{
	
	function getParameterByName( name ){
		name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
		var regexS = "[\\?&]"+name+"=([^&#]*)";
		var regex = new RegExp( regexS );
		var results = regex.exec( location.search );
		return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}
	
	
	var getNode = function(s) {
        return document.querySelector(s);   
    },
	
	session_username=localStorage.getItem('LoggedInUserID'),
	session_groupId=getParameterByName('GroupId'),
	chat_title=getNode('#chat-title'),
	textarea=getNode('.chat-app textarea'),
	messages= getNode('.chat-messages');
	var joinedMsg = document.createElement('div');
	//joinedMsg.setAttribute('class','chat-message');
	joinedMsg.innerHTML='<span class="label label-default" style="padding-top:5px; padding-bottom:5px; font-weight:normal;"> ' +localStorage.getItem('LoggedInUserName') + '</span>&nbsp; Joined  <span class="glyphicon glyphicon-comment" aria-hidden="true" style="display:inline; vertical-align:middle;"></span> </br></br>';
	messages.appendChild(joinedMsg);
	
	 try {
        var server = io.connect(localStorage.getItem('HolaCloudUrl'));
		//var server = io.connect("http://127.0.0.1:8082/");
    }
    catch(e) {
        alert('Sorry, we couldn\'t connect. Please try again later \n\n' + e);
    }
	if(server !== undefined)
	{
		
		server.emit('chat-connection',session_groupId);
		server.on('output', function(svdata){
			
			if(svdata.length)
			{
				
				for(var i=0; i < svdata.length; i++){
					var chatType;
					if(svdata[i].chatAudience ==="ALL")
						{
							chatType='<span class="label label-info"  style="display:inline;">Group Message</span>';
						}
						else {
							
							chatType='<span class="label label-danger" style="display:inline;">Private Message</span>';
						}
					
					
					if(svdata[i].chatAudience ==="ALL" || svdata[i].chatAudience ===session_username || svdata[i].chatAudience === localStorage.getItem('LoggedInUserID') || svdata[i].email === localStorage.getItem('LoggedInUserID'))
					{
					var wrapper= document.createElement('div');
					wrapper.setAttribute('class','chat-wrapper');
					var message = document.createElement('div');
					
					
					var msg='<span>';
					if(svdata[i].email === session_username)
					{
						
						msg +=chatType +'<span style="padding-top:5px">You:</span></span>';
						message.setAttribute('class','chat-message');
					}
					else{
						message.setAttribute('class','chat-message-received');
						msg += chatType +'</br><span style="padding-top:5px"><b>'+ svdata[i].user_name+' : </b></span><br></span>';
						
						}
					message.innerHTML=msg+' <span class="glyphicon glyphicon-ok" aria-hidden="true" style="display:inline"></span>  ';
					message.innerHTML +=svdata[i].message;
					
					wrapper.appendChild(message);
					wrapper.scrollTop= messages.scrollHeight;
					messages.appendChild(wrapper);
					messages.scrollTop= messages.scrollHeight;
					}
				}
				
			}
			
		});
		
		server.on('status', function(c){
			
			if(c.clear === true){textarea.value ='';}
		});
		chatBox.addEventListener('keydown', function(event){
			
			if(event.which === 13 && event.shiftKey === false){
				server.emit('input', {
					
					email: session_username,
					message: this.value,
					userName:localStorage.getItem('LoggedInUserName'),
					chatAudience:chatAudience
				});
				event.preventDefault;
			}
		});
		//chatBox.addEventListener('keypress', function(event){
			
			//event.preventDefault;
			
	//	});
		server.on('alert', function(msg){alert(msg);});
		
		server.on('openChatWindow', function(msg){
			
			$('#profileWindow').toggle(1000);
			$('#chatWindow').toggle(1000);
		});
	}
}



function onDeviceReady() {
	
	document.addEventListener('showkeyboard', function(){ alert(1)}, false);
	document.addEventListener('hidekeyboard', function(){ alert(2)}, false);
}
$(document).on("deviceready", onDeviceReady);