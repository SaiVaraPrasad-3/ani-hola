function onDeviceReady() {

    // Bind events
    $(document).on("resume", onResume);

   // $('#location-settings').on("click", function(){
   //     cordova.plugins.diagnostic.switchToLocationSettings();
   // });


    function onRequestSuccess(accuracyName, success){
       // var msg = "Successfully requested accuracy '"+accuracyName+"': "+success.message;
        //console.log(msg);
        //alert(msg);
       // checkState();
    }

    function onRequestFailure(error){
        var msg = "GPS Enabling request failed. Please Enable GPS";
       // console.error(msg);
        alert(msg);
       // checkState();
    }

	$(document).ready(function(){
		var accuracy = "3",
            accuracyName  =  "High Accuracy";
        cordova.plugins.locationAccuracy.request(onRequestSuccess.bind(this, accuracyName), onRequestFailure, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
	});
  //  $('#request-accuracy').on("click", function(){
        
    //});

    checkState();
}


function checkState(){
    console.log("Checking location state...");

    function evaluateMode(mode){
      //  $('#location-mode').text(mode.toUpperCase());
    }
    cordova.plugins.diagnostic.getLocationMode(evaluateMode, onError);
}

function onError(error){
    console.error("An error occurred: "+error);
}

function onResume(){
    checkState();
}

$(document).on("deviceready", onDeviceReady);