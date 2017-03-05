"use strict"

var redis = require('redis');
var redisInfo = {
	    host: '127.0.0.1',
	    port: 10063
};

var ChatSession = function (user,name,channel){

	this.sub = redis.createClient(redisInfo.port, redisInfo.host);
	this.pub = redis.createClient(redisInfo.port, redisInfo.host);
	this.user = user;
	this.name = name;
	this.channel = channel;

};

ChatSession.prototype.subscribe = function (socket,uid,uname,channel){

		if(channel != undefined){
			this.sub.on('message', function(channel, message) {
				socket.emit(channel, message);
			});
			var currentObj = this;
			this.sub.on('subscribe', function(channel,count) {
				if(!channel){
					console.log(channel);
				}else{
					var msg = JSON.stringify({action: 'control', user: uid, msg: '[Notice] <b>'+ uname +'</b> join here!! :)', current_room : channel });
					currentObj.publish(channel,msg);
				}
			});
			this.sub.subscribe(channel);
		}else{
			console.log('channel error : ' + channel);
		}

};

ChatSession.prototype.unsubscribe = function (channel){
	this.sub.unsubscribe(channel);
};

ChatSession.prototype.publish = function (channel,msg){
	this.pub.publish(channel,msg);
};

ChatSession.prototype.endsession = function(){
		if (this.sub !== null) this.sub.quit();
		if (this.pub !== null) this.pub.quit();
};

module.exports = ChatSession;