"use strict"

var redis = require('redis');

module.exports = {

	init : function(user,name,channel){
		this.sub = redis.createClient();
		this.pub = redis.createClient();
		
		this.user = user;
		this.name = name;
		this.channel = channel;

		return this;
	},

	changeChannel : function(channel){
		this.sub = redis.createClient();
		this.pub = redis.createClient();
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
			return;
		}

	},

	unsubscribe : function(channel){
		this.sub.unsubscribe(channel);
	},

	publish : function(channel,message){
		this.pub.publish(channel,message);
	},

	destroyRedis : function(){
		if (this.sub !== null) this.sub.quit();
		if (this.pub !== null) this.pub.quit();
	}

};
