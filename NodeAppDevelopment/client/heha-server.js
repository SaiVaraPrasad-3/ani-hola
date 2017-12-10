var express = require('express');
var app = express();
app.use(express.static('/'));
var mongo=require('mongodb').MongoClient;
//var mongo=require('mongodb').mongoClient;
var server= require('http').createServer(app);
var io= require('socket.io').listen(server);
server.listen(process.env.PORT || 8082);

io.sockets.on('connection', function (socket) {
  socket.on('location', function (data) {
	  
	  socket.join(data.groupId);
    io.sockets.in(data.groupId).emit('location', data);
  });
});


//mongo.connect('mongodb://heharide:ohhoo123@apollo.modulusmongo.net:27017/oV4udavo', function(err,db)
{
	io.on('connection', function(socket){
		
		socket.on('join', function(data){
			
			mongo.connect('mongodb://heharide:ohhoo123@apollo.modulusmongo.net:27017/oV4udavo', function(err,db)
			{
				if (err) {
					console.log('Unable to connect to the mongoDB server. Error:', err);
				}
				else
				{
			var user_email = data.user_email,
                user_name = data.user_name,
				fpass = data.fpass,
                cpass = data.cpass,
				user_mobileNo=data.user_mobileNo,
				user_status=data.user_status;

            // check for empty fields
            if (user_email === '' || cpass === '' || fpass === '' || user_mobileNo === '' ){
                socket.emit('alert', 'Whoops, you missed one!');
                return;
            }
			function validateEmail(email) {
				var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				return re.test(email);
			}
			function IsMobileNumber(mobileNum) {
				var mob = /^[1-9]{1}[0-9]{9}$/;
				if (mob.test(mobileNum) == false) {
					return false;
				}
				return true;
			}
			
			if(!IsMobileNumber(user_mobileNo))
			{
				socket.emit('alert','Please check your Mobile number');
				return;
			}
			
			if(!validateEmail(user_email))
			{
				socket.emit('alert', 'Plase check your email address');
                return;
			}
            // check for matching passwords
            if (fpass !== cpass) {
                socket.emit('alert', 'Your passwords don\'t match.');
                return;
            }
		
            // create a database variable
            var users = db.collection('users');

            // create a variable to hold the data object
			var regExpUsr= new RegExp('^' + data.user_email + '$',"i");
				
              
            users.find({user_email:{$regex: regExpUsr}}).toArray(function(err, res){
                if(err) throw err;

                // create a flag variable
                var newUser = user_email;

                var doesUserExist = function(newUser, res) {
                    if (res.length) {
                        for(var i = 0; i < res.length; i++){

                            var answer;

                            if(newUser === res[i].user_email){
                                answer = "exists";
                                break;
                            } else {
                                answer = "does not exist";   
                            }
                        }
                        return answer;
                    } else {

                        return answer = "does not exist";

                    }
                };

                var found = doesUserExist(newUser, res);

                if (found !== "exists"){
                    // if not found, push the user into the db
                    users.insert({
                        user_email: user_email,
                        user_name: user_name,
                        password: cpass,
						user_mobileNo:user_mobileNo,
						user_status:user_status
                    }, function() {
						//socket.emit('alert','im here');
						//socket.emit('alert',data.user_email);
						var new_user = { 
						
						user_email:data.user_email,
						user_name:data.user_name,
						user_mobileNo:data.user_mobileNo,
						user_status:data.user_status
						};
                        socket.emit('toggle-form',[new_user]);
                        return found;
                    }); 
                } else {
                    socket.emit('alert', 'Username already exists. Please use another one.');   
                }
				db.close();
				console.log('dbconnection Closed');
            });

			
			}
			
			});
		});
		
		socket.on('signIn', function (login_info) {
			
			mongo.connect('mongodb://heharide:ohhoo123@apollo.modulusmongo.net:27017/oV4udavo', function(err,db)
			{
				if (err) {
						console.log('Unable to connect to get mongoDB collection. Error:', err);
					}
					else
					{
            var this_user_email = login_info.user_email,
                this_user_password = login_info.user_password;

            if (this_user_email === '' || this_user_password === '') {
                socket.emit('alert', 'You must fill in both fields');
            } else {
                var users = db.collection('users');
				var regExpUsr= new RegExp('^' + login_info.user_email + '$',"i");
				//socket.emit('alert',login_info.user_email);
                users.find({user_email:{$regex: regExpUsr}}).toArray(function (err, res) {
                    if (err) throw err;
					console.log(res.length);
                    var found = false,
                        location = -1;
				  //socket.emit('alert',res.length);
                    if (res.length) {
                        for (i = 0; i < res.length; i++) {
                            if (res[i].user_email === this_user_email) {
                                found = true;
								//socket.emit('alert',this_user_email);
                                if (res[i].password === this_user_password) {
									// socket.emit('alert','im at pwd');
                                     socket.emit('redirect', { login_status:'success',user_email:res[i].user_email, user_mobileNo: res[i].user_mobileNo,user_name:res[i].user_name,user_status:res[i].user_status});
                                } else {
                                    socket.emit('alert', 'Please retry password');
                                }
                                break;
                            }
                        }

                        if (!found) {

                            socket.emit('alert', 'Sorry, could not find you. Please sign up.');
                           // socket.emit('redirect', 'success|signup.html');
                        }
                    }
					else
					{
						 socket.emit('alert', 'Sorry, could not find you. Please sign up.');
					}
					db.close();
					console.log('dbconnection Closed');
                });
            }
        
		
			}
		});
		
		});
		socket.on('createHolaGroup', function(data){

		mongo.connect('mongodb://heharide:ohhoo123@apollo.modulusmongo.net:27017/oV4udavo', function(err,db)
		{
			if (err) {
					console.log('Unable to connect to the mongoDB server. Error:', err);
				}
				else
				{
        var group_name = data.group_name,
                group_note = data.group_note,
				group_owner = data.group_owner;
                

            // check for empty fields
            if (group_name === ''){
                socket.emit('alert', 'You must provide group name');
                return;
            }
			
            // create a database variable
            var groups = db.collection('HolaGroups');
			var regex= new RegExp(["^",group_name,"$"].join(""),"i");
			
            // create a variable to hold the data object
            groups.find({group_name:regex}).toArray(function(err, res){
                if(err) throw err;

                // create a flag variable
                var newGroup = group_name;

                var doesGroupExist = function(newGroup, res) {
                    if (res.length) {
                        for(var i = 0; i < res.length; i++){

                            var answer;

                            if(newUser === res[i].group_name){
                                answer = "exists";
                                break;
                            } else {
                                answer = "does not exist";   
                            }
                        }
                        return answer;
                    } else {

                        return answer = "does not exist";

                    }
                };

                var found = doesGroupExist(newGroup, res);

                if (found !== "exists"){
                    // if not found, push the user into the db
                    groups.insert({
                        group_name: group_name,
                        group_note: group_note,
                        group_owner: group_owner
                    }, function() {
                        socket.emit('groupCreationSuccess', group_name);
                        return found;
                    }); 
                } else {
                    socket.emit('alert', 'Group name already exists. Please use another one.');   
                }
				db.close();
				console.log('dbconnection Closed');
            });

		}
		});
		});
		socket.on('loadGroupddl', function () {
		mongo.connect('mongodb://heharide:ohhoo123@apollo.modulusmongo.net:27017/oV4udavo', function(err,db)
		{
			
			if (err) {
					console.log('Unable to connect to the mongoDB server. Error:', err);
				}
				else
				{
					var groups= db.collection('HolaGroups');
					groups.find({}).toArray(function(err,res)
					{
					
					if(err) throw err;
					socket.emit('loadHolaGroups',res);
					db.close();
					console.log('dbconnection Closed');
					});
				}
		});
        });
		socket.on('getUserDetails',function(data){
			mongo.connect('mongodb://heharide:ohhoo123@apollo.modulusmongo.net:27017/oV4udavo', function(err,db)
			{
				if (err) {
					console.log('Unable to connect to the mongoDB server. Error:', err);
				}
				else
				{
					var holaUsers = db.collection('users');
					var regExpUsr= new RegExp('^' + data.user_email + '$',"i");
					holaUsers.find({user_email:{$regex: regExpUsr}}).toArray(function(err, res){
					if(err) throw err;
				
					socket.emit('bindUserDetails',res);
					db.close();
					console.log('dbconnection Closed');
					});
				}
			});
		});
	
		socket.on('updateProfile', function(data){
			
			mongo.connect('mongodb://heharide:ohhoo123@apollo.modulusmongo.net:27017/oV4udavo', function(err,db)
			{
				if (err) {
					console.log('Unable to connect to the mongoDB server. Error:', err);
				}
				
				else
				{
			var userProfiles = db.collection('users');
			var regExpUsrProfile= new RegExp('^' + data.user_email + '$',"i");
			userProfiles.update({user_email:{ $regex: regExpUsrProfile}}, {$set: {user_mobileNo:data.user_mobileNo, user_name:data.user_name,password:data.password,user_status:data.user_status}
			
			}, function(err,res){
				
				db.close();
					console.log('dbconnection Closed');
			});
			
			socket.emit('updateLocalStorage', data);
			socket.emit('alert','Profile Updates Successfully');
			
			}
			});
		});
	
		socket.on('chat-connection',function(chatroom){
			
			socket.join(chatroom);
			
			socket.on('input', function(data){
				sendStatus= function(s){ socket.emit('status',s);};
				var email= data.email;
				var new_msg = { 
				email:data.email,
				user_name:data.userName,
				message:data.message,
				chatAudience:data.chatAudience
				};
				if(data.message !=='')
				{
					io.sockets.in(chatroom).emit('output',[new_msg]);
					sendStatus({message:"Message Sent", clear: true});
					
				}
				else
				{
					sendStatus('Name or Message is missing');
				}
				
				
			});
		});
	
	});
}
//app.use(require('express').static(__dirname+'/client'));