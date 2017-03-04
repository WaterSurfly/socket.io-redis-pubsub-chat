"use strict";

var express = require('express');
var fs = require('fs');
var router = express.Router();

/* GET home page. */
router.get('/:uid/:uname', function(req, res, next) {

	var uid = req.params.uid;
	var uname = req.params.uname;
	
	var rooms = ['CH1','CH2','CH3'];	
	var room_number = Math.floor(Math.random() * 3);
	room_number = parseInt(room_number);
	var channel = rooms[room_number-1];
	
	if(channel == undefined){
		channel = "CH1";
	}
	
	res.render('index',{uid: uid, uname: uname, ch : channel});

});

router.get('/:uid/:uname/:ch', function(req, res, next){
	
	var uid = req.params.uid;
	var uname = req.params.uname;
	var channel = req.params.ch;
	res.render('index',{uid: uid, uname: uname, ch : channel});

});

module.exports = router;