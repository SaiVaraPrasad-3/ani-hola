cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-request-location-accuracy/www/RequestLocationAccuracy.js",
        "id": "cordova-plugin-request-location-accuracy.RequestLocationAccuracy",
        "pluginId": "cordova-plugin-request-location-accuracy",
        "clobbers": [
            "cordova.plugins.locationAccuracy"
        ]
    },
    {
        "file": "plugins/cordova-plugin-whitelist/whitelist.js",
        "id": "cordova-plugin-whitelist.whitelist",
        "pluginId": "cordova-plugin-whitelist",
        "runs": true
    },
    {
        "file": "plugins/cordova.plugins.diagnostic/www/android/diagnostic.js",
        "id": "cordova.plugins.diagnostic.Diagnostic",
        "pluginId": "cordova.plugins.diagnostic",
        "clobbers": [
            "cordova.plugins.diagnostic"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-request-location-accuracy": "1.0.1",
    "cordova-plugin-whitelist": "1.2.1",
    "cordova.plugins.diagnostic": "2.3.10"
}
// BOTTOM OF METADATA
});