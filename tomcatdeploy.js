var path = require('path');
var tl = require('vso-task-lib');

var echo = new tl.ToolRunner(tl.which('echo', true));


var tomcatUrl = tl.getInput('tomcatUrl', true);
var userName = tl.getInput('userName',true);
var password = tl.getInput('password', true);
var warFile = tl.getInput('warFile', true);
var context = tl.getInput('context', true);
var serverVersion = tl.getInput('serverVersion', true);
/*
var tomcatUrl = 'https://localhost:8080/tomcat';
var userName = 'vmAdmin';
var password = 'P2ssw0rd';
var warFile = 'sample.war';
var context = 'myshuttledev';
var serverVersion = '7.0';
*/

tomcatUrl = tomcatUrl.trim();
context = context.trim();
userName = userName.trim();
password = password.trim();
warFile = warFile.trim();

echo.arg(tomcatUrl);
echo.arg(userName);
echo.arg(password);
echo.arg(warFile);
echo.arg(context);
echo.arg(serverVersion);
//change backslashes to forward slashes on the WAR file
warFile = warFile.replace(/\\/g, "/");

// Define error handler
var onError = function (errorMsg) {
    tl.error(errorMsg);
    tl.exit(1);
   // echo (errorMsg);
}
// Find location of curl 
var curlPath = tl.which('curl');
if (!curlPath) {
    onError('curl was not found in the path.');
}

// Prepare curl upload command line
var curlRunner = tl.createToolRunner('curl');

if (context.indexOf("/") != 0){
    onError('Context should start with "/" character');
   }
   
 if(serverVersion =='6.x'){
     var URL = tomcatUrl + "/manager/deploy" + "?path=" + context + "&update=true";
 }  
 else {
     var URL = tomcatUrl + "/manager/text/deploy" + "?path=" + context + "&update=true";
 }
 
 curlRunner.arg('-T');
 curlRunner.arg([warFile]);
  curlRunner.arg(URL);
 echo.arg(URL);
 
 if (userName || password) {
    var userPassCombo = "";
    if (userName) {
        userPassCombo += userName;
    }

    userPassCombo += ":";

    if (password) {
        userPassCombo += password;
    }

    curlRunner.arg('-u');
    curlRunner.arg(userPassCombo);
}

// Execute build
curlRunner.exec()
