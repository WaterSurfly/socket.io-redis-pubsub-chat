"use strict"

var settings = require('../settings');
var fs = require('fs');
var socketio = require('socket.io');
var chatSession = require('./chat_session');

module.exports = function(server){

	var io = socketio(server);
	var csobj;

	io.on('connection', function (socket) {
		
		socket.on('adduser', function(trn_user_id,username,ch){

			csobj = new chatSession(trn_user_id,username,ch);
			//console.log(csobj);
			socket.csobj = csobj;
			socket.csobj.subscribe(socket,trn_user_id,username,ch);

		});
		
		socket.on('chat', function (data) {
			var msg = JSON.parse(data);
			console.log(msg);
			

				if (csobj === null) {
					console.log('LOST');
					return;
				} else {
				
					fs.readFile(settings.filter_file, 'utf8', function (err, data) {
						  if (err) {
							console.log('Error: ' + err);
							return;
						  }
						  
							var YokData = JSON.parse(data);
							var YokList = YokData['data'];
							var Tmp;
							var changeMsg;
							var msg_str = msg.msg;
							
							 for(var i=0 ; i<YokList.length ; i++){
								 
								 Tmp = msg_str.toLowerCase().indexOf(YokList[i]);
								  if(Number(Tmp) >= 0){
									  var star = '';
									  for(var j=0;j<YokList[i].length; j++){
										  star += '*';
									  }
									  
									  changeMsg = msg_str.replace(YokList[i], star);
									  msg_str = changeMsg;
									  continue;
								  }else{
									  changeMsg = msg_str;
								  }
							 }
							 
							var reply = JSON.stringify({action: 'message', user: msg.uname, uid : msg.uid, msg: changeMsg, current_room : socket.csobj.channel });
							socket.csobj.publish(socket.csobj.channel,reply);
					});
			
				}

			

		});

		socket.on('disconnect', function(){

				//console.log(csobj);

				if (socket.csobj ===  null ){ 
					return;
				}else{
					socket.csobj.unsubscribe(csobj.channel);
					var leaveMessage = JSON.stringify({action: 'control', user: socket.csobj.user, msg: '[Notice] <b>'+ socket.csobj.name +'</b> left!', current_room : socket.csobj.channel });
					socket.csobj.publish(csobj.channel,leaveMessage);
					socket.csobj.endsession();
				}

		});
		
	});

	return io;
}