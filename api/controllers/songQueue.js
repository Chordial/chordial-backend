var Queue = (require('../models/user.js')).Queue;
var User = (require('../models/user.js')).User;
var Session = (require('../models/user.js')).Session;
var Track = (require('../models/user.js')).Track;
var userDB = require('./users.js');
require('../helpers/helpusers.js')();

module.exports = {
  createSession : createSession,
  findSession : findSession,
  joinSession : joinSession,
  deleteSession : deleteSession,
  startSession : startSession,
  queueStoreData : queueStoreData,
  queueGetData : queueGetData,
  addToQueue : addToQueue,
  deleteFromQueue : deleteFromQueue,
  isSession : isSession
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function createSession(req,res) {
  Session.create({
    sessionID : getRandomInt(10000,50000).toString(),
    sessionName : "testing",
    users : [],
    queue : null
  }, function(err, session){
      if (err) {
        console.log(err);
        return;
      }
      console.log("Session created with id " + session.sessionID);
      return res.json(session.sessionID);
    });
}

function startSession(req,res) {
  Session.findOne({sessionID:req.swagger.params.sessionId.value} , function(err, session) {
    if(err)
      console.log(err);
    userDB.recommend(req,res);
  });
}

function findSession(req,res) {
  Session.findOne({sessionID:req.swagger.params.sessionId.value}).select('-_id').select('-__v')
  .exec(function(err,session) {
    if (err)
      console.log(err);
    res.json(session);
  });
}

function joinSession(req,res) {
  Session.findOne({sessionID : req.swagger.params.sessionId.value}, function(err, session) {
    if(err)
      console.log(err);
    if(req.swagger.params.guestName !== undefined){
      session.guests.push(guestName);
      session.save(function(err) {
        if(err)
          console.log(err);
      });
    }
    else {
      User.findOne({spotifyID:req.swagger.params.userName.value} , function(err, user) {
        session.users.push(user);
        session.save(function(err) {
          if(err)
            console.log(err);
          console.log("user " + user.spotifyID + " added to session " + session.sessionID);
        });
      });
    }
  });
}

function deleteSession(req,res) {
  console.log("Removing session with id " + req.swagger.params.sessionId.value + " ...");
  Session.remove({sessionID : req.swagger.params.sessionId.value} , function(err) {
    if (err)
      console.log(err);
    res.json("200");
    console.log(" Complete!");
  });
}

function queueStoreData(req,res) {
  Session.findOne({sessionID : req.swagger.params.sessionId.value} , function(err, session) {
    if (err)
      console.log(err);
    switch(req.swagger.params.storeActionId) {
      case "pause":
        session.queue.isPaused = true;
        res.json({message:'200'});
        break;
      case "currentTrack":
        session.queue.currentTrackName = req.swagger.params.actionData;
        res.json({message:'200'});
        break;
      case "saveTime":
        session.queue.seekTime = req.swagger.params.actionData;
        res.json({message:'200'});
        break;
      default :
        res.json({message:'404'});
    }
    session.save(function(err){
      if(err)
        console.log(err);
      console.log("data saved");
    });
  });
}

function queueGetData(req,res) {
  Session.findOne({sessionID : req.swagger.params.sessionId.value} , function(err, session) {
    if(err)
      console.log(err);
    var data = [session.queue.isPaused, session.queue.currentTrackName, session.queue.saveTime];
  });
}

function addToQueue(req,res) {
  Session.findOne({sessionID : req.swagger.params.sessionId.value} , function(err, session) {
    if(err)
      console.log(err);
    session.queue.trackList.unshift(req.swagger.params.trackId.value);
    session.save(function(err){
      if(err)
        console.log(err);
      console.log("track added");
      res.json("200");
    });
  });
}

function deleteFromQueue(req,res) {
  Session.findOne({sessionID : req.swagger.params.sessionId.value} , function(err, session) {
    if(err)
      console.log(err);
    session.queue.trackList.splice(req.swagger.params.trackPosition.value,req.swagger.params.trackPosition.value+1);
    session.save(function(err) {
      if(err)
        console.log(err);
      res.json("200");
    });
  });
}

function isSession(req,res) {
  Session.findOne({sessionID : req.swagger.params.sessionID.value} , function(err,session) {
    if(err)
      console.log(err);
    res.json(session === null);
  });
}

function getAllSessions(req,res) {
  Session.find().select('-_id').select('-__v').exec(function(err, sessions) {
      if (err)
          res.send(err);
      res.json(sessions);
  });
}
