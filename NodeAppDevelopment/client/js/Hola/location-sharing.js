function initLocationSharing(location_callback, error_callback)
{
	function guid() {
    function s4() { return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16).substring(1); 
    }
	var userName= localStorage.getItem('LoggedInUserID');
    return userName;
}
function getParameterByName(name){
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( location.search );
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
var userInfo = {
    id: guid(),
	groupId: getParameterByName('GroupId'),
	holaUsrName:localStorage.getItem('LoggedInUserName'),
	holaUsrMobileNo:localStorage.getItem('LoggedInUserMobNo'),
	holaUsrStatus:localStorage.getItem('LoggedInUserStatus'),
	holaUsrId:localStorage.getItem('LoggedInUserID'),
	holaRole:localStorage.getItem('HolaRole'),
    name:  getParameterByName('userName') 
}
	var socket = io.connect(localStorage.getItem('HolaCloudUrl'));
	//var socket = io.connect('http://127.0.0.1:8082/');
socket.on('connect', function () {
    socket.on('location', function(location){
        if(location.id != userInfo.id) {
            location_callback(location);
        }
    })
});
function geo_success(position) {
    userInfo.latitude  = position.coords.latitude;
    userInfo.longitude = position.coords.longitude;
    location_callback(userInfo);
    sendLocation();
}

function geo_error() {
    error_callback();
}

var sendLocationTimeout = null;
function sendLocation(){
    socket.emit('location', userInfo);
    clearTimeout(sendLocationTimeout);
    sendLocationTimeout = setTimeout(sendLocation, 1000*5);
}

var geo_options = { enableHighAccuracy: true };
navigator.geolocation.watchPosition(geo_success, geo_error, geo_options);
navigator.geolocation.getCurrentPosition(geo_success, geo_error, geo_options);
return userInfo;
	
}