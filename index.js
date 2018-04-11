var awsIot = require('aws-iot-device-sdk');

var SerialPort = require("serialport");
var serialPort = new SerialPort('/dev/tty-usbserial1', {
  baudRate: 57600);

var status='0';
var data;

const express = require("express");
const app = express();
const  server = require("http").Server(app);
const io = require("socket.io")(server);

app.use(express.static("./public"));  //noi dat cac file css, script.js
app.set("view engine","ejs");   //File html cua minh se la ejs
app.set('views',__dirname +'/views');     //dat vao tong thu muc views

var thingShadows = awsIot.thingShadow({
   keyPath: './certs/ef21fe66d7-private.pem.key',
  certPath: './certs/ef21fe66d7-certificate.pem.crt',
    caPath: './certs/root-CA.crt',
  clientId: 'nameThang',
      host: 'aupu5tnzgckec.iot.ap-southeast-1.amazonaws.com'
});
var clientTokenUpdate;
//
// Simulated device values
//
var den1="on";
var den2="off";
// thingShadows.on('connect', function() {
// //
// // After connecting to the AWS IoT platform, register interest in the
// // Thing Shadow named 'RGBLedLamp'.
// //
//     thingShadows.register( 'Thang-Test', {}, function() {
// // Once registration is complete, update the Thing Shadow named
// // 'RGBLedLamp' with the latest device state and save the clientToken
// // so that we can correlate it with status or timeout events.
//
// // Thing shadow state
// //
//        var rgbLedLampState = {
//          "state":{
//            "desired":{"den1": den1,"den2": den2}
//          }
//        };
//
//        clientTokenUpdate = thingShadows.update('Thang-Test', rgbLedLampState  );
//        // The update method returns a clientToken; if non-null, this value will
//        // be sent in a 'status' event when the operation completes, allowing you
//        // to know whether or not the update was successful.  If the update method
//        // returns null, it's because another operation is currently in progress and
//        // you'll need to wait until it completes (or times out) before updating the
//        // shadow.
//        //
//               if (clientTokenUpdate === null)
//               {
//                  console.log('update shadow failed, operation still in progress');
//               }
//            });
//        });
//
//        thingShadows.on('delta',
//            function(thingName, stateObject) {
//               console.log(stateObject.state.den1);
//               serialPort.write(stateObject.state.den1); // Gui gia tri tu aws shadow ve cong serial
//
//            });
//
//        thingShadows.on('timeout',
//            function(thingName, clientToken) {
//               console.log('received timeout on '+thingName+
//                           ' with token: '+ clientToken);
//        //
//        // In the event that a shadow operation times out, you'll receive
//        // one of these events.  The clientToken value associated with the
//        // event will have the same value which was returned in an earlier
//        // call to get(), update(), or delete().
//        //
//  });

server.listen(3000,function(){
  console.log("server is running on port 3000");
});  //cong port 3000

 //*********su dung module serialport*******?//

app.get('/',(req, res) => {
   res.render("home");
});

serialPort.on('open',onOpen);
console.log('open',onOpen);

function onOpen(){
  console.log("Open connected");
}


io.on('connection', function (socket) {   //khi cac client ket noi

  serialPort.on('data', function(onData){
    console.log("data: " + onData);
    if(onData=='@O1D1L29%'){ //so sanh chuoi
      socket.emit('sv2cl',{value:'1'});
    }
    else {
      socket.emit('sv2cl',{value:'0'});
    }
  })

        console.log("client connected");
        socket.emit('sv2cl',{value: status}); //mac dinh khi bat server len thi tat ca cac client co trang thai bang 0
      //  serialPort.write(status); //nt

        socket.on('cl2sv',function(msg)
        {

      //  serialPort.on('open',onOpen);
      //  serialPort.on('data',onData);
        console.log("On data"+ data);
          if(msg.status[0] == '1'){
            console.log("Status 1: " + msg.status);
            serialPort.write(msg.status); //gui du lieu cho serrial port
            //sockets.emit('led', {value: msg.status });  //phat cho tat cac cac client
          }
          else {
            console.log("Status 0: "+msg.status);
            serialPort.write(msg.status);
            //socket.emit('led',{value: msg.status });
          }
          //serialPort.write(msg.status);
          socket.emit('led',{value: msg.status});
      });

});
thingShadows.on('connect', function() {
//
// After connecting to the AWS IoT platform, register interest in the
// Thing Shadow named 'RGBLedLamp'.
  var rgbLedLampState = {
    "state":{
      "desired":{"den1": den1,"den2": den2}
    }
  }
    module.exports = rgbLedLampState;
    thingShadows.register( 'Thang-Test', {}, function() {
// Once registration is complete, update the Thing Shadow named
// 'RGBLedLamp' with the latest device state and save the clientToken
// so that we can correlate it with status or timeout events.
// Thing shadow state
//


//var lame = require('rgbLedLampState');
       clientTokenUpdate = thingShadows.update('Thang-Test', rgbLedLampState  );
       // The update method returns a clientToken; if non-null, this value will
       // be sent in a 'status' event when the operation completes, allowing you
       // to know whether or not the update was successful.  If the update method
       // returns null, it's because another operation is currently in progress and
       // you'll need to wait until it completes (or times out) before updating the
       // shadow.
       //
              if (clientTokenUpdate === null)
              {
                 console.log('update shadow failed, operation still in progress');
              }
           });
       });

       thingShadows.on('delta',
           function(thingName, stateObject) {
              console.log(stateObject.state.den1);
              //serialPort.write(stateObject.state.den1); // Gui gia tri tu aws shadow ve cong serial

           });

       thingShadows.on('timeout',function(thingName, clientToken) {
              console.log('received timeout on '+thingName+
                          ' with token: '+ clientToken);
       //
       // In the event that a shadow operation times out, you'll receive
       // one of these events.  The clientToken value associated with the
       // event will have the same value which was returned in an earlier
       // call to get(), update(), or delete().
       //
 });
