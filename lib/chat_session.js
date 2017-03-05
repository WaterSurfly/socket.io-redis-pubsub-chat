"use strict"

var redis = require('redis');
var redisInfo = {
	    host: '127.0.0.1',
	    port: 10063
};

module.exports = {

	init : function(user,name,channel){
		this.sub = redis.createClient(redisInfo.port, redisInfo.host);
		this.pub = redis.createClient(redisInfo.port, redisInfo.host);
		
		this.user = user;
		this.name = name;
		this.channel = channel;

		return this;
	},

	changeChannel : function(channel){
		this.sub = redis.createClient(redisInfo.port, redisInfo.host);
		this.pub = redis.createClient(redisInfo.port, redisInfo.host);
		this.channel = channel;
	},

	subscribe : function(socket,user_id,nickname,channel){

		if(channel != undefined){
			this.sub.on('message', function(channel, message) {
				socket.emit(channel, message);
			});
			var current = this;
			this.sub.on('subscribe', function(channel,count) {
				if(!channel){
					console.log(channel);
				}else{
					if(current.name == undefined){
						socket.emit('reload');
					}else{
						var joinMessage = JSON.stringify({action: 'control', user: user_id, msg: '[Notice] <b>'+ nickname +'</b> join here!! :)', current_room : channel });
						current.publish(channel,joinMessage);
					}
				}
			});
			this.sub.subscribe(channel);
		}else{
			console.log('channel error');
			console.log(channel);
		}

	},

	unsubscribe : function(channel){
		this.sub.unsubscribe(channel);
	},

	publish : function(channel,message){
		this.pub.publish(channel,message);
	},

	left : function(){
		if (this.sub !== null) this.sub.quit();
		if (this.pub !== null) this.pub.quit();
	}

};
