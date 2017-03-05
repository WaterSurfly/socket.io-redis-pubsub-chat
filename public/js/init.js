
var socket = io();
var channel = $('#ch').val();
var uid = $('#uid').val();
var uname = $('#uname').val();

var rooms = ['CH1','CH2','CH3'];	

socket.on('connect', function(){
	socket.emit('adduser', uid, uname,channel);
});

socket.on('reload', function () {
	switchRoom('CH1');
});

socket.on(channel, function (msg) {
	console.log(channel);
	var message = JSON.parse(msg);
	var action = message.action;
	
	switch (action) {
		case 'message':
					if(message.uid == uid){
						$('#conversation').append('<div class="bubbledRight">' + message.msg + '</div>');	
					}else{
						$('#conversation').append('<div class="bubbledLeft"><font color="#58ACFA"><b>'+message.user + '</b></font>   ' + message.msg + '</div>');	
					}
				break;
		case 'control': 
					$('#conversation').append('<div class="bubbledRightSystem"><b>'+ message.msg + '</b></div>');	
				break;
		case 'system': 
					$('#conversation').append('<div class="SystemNotice">'+ message.msg + '</div>');	
				break;		
	}
		
	$('#info').html(channelStr(channel));
		
	conversation_id = document.getElementById("conversation"); 
	conversation_id.scrollTop = conversation_id.scrollHeight; 
	
});	

function channelStr(channel){
	
	var str;
	
	switch(channel){
		case 'CH1':
				str='Channel 1';
			break;
		case 'CH2':
				str='Channel 2';
			break;
		case 'CH3':
				str='Channel 3';
			break;
		default :
				str = 'Channel';
			break;
	}
	
	return str;
}

function switchRoom(room){
	
	if(!room){
		alert('Again!');
		return;
	}else{
		
		location.href="/chat/" + uid + "/" + uname + "/" + room;
	}

}



$(function(){   
		
		$('#datasend').click( function() {
				var message = $('#data').val();
				$('#data').val('');
				if(message){
					var send_json = JSON.stringify({'action' : 'message', 'uid' : uid, 'uname' : uname, 'msg' : message});	
					socket.emit('chat', send_json);
					$('#data').focus();
				}
		});

		$('#data').keypress(function(e) {
		        var msg = $('#data').val();
				if(e.which == 13 && msg != '') {
						$(this).blur();
						$('#datasend').click();
				}
		});
});
