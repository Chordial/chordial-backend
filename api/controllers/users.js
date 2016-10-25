var Promise = require('promise');
var SpotifyWebApi = require('spotify-web-api-node');
var User = require('../models/user.js');
require('../helpers/helpusers.js')();
var spotifyApi = new SpotifyWebApi({
  clientId : 'c0be0c89a1e241898635418ad5fbbbef',
  clientSecret : '5adebeaaee924c3cad12ed37545a8489',
  redirectUri : 'http://localhost:10010/user/callback'
});

module.exports = {authorizeUser, authorizeTesting, detailMe, detailFriends, addFriend, myMusic, shareCommon, getAll, deleteThemAll}; // jshint ignore:line


 function authorizeTesting(req,res) {
   var scopes = ['user-follow-read'],
       redirectUri = 'http://localhost:10010/user/authorize',
       clientId = 'c0be0c89a1e241898635418ad5fbbbef';
   var url = 'https://accounts.spotify.com/authorize?client_id=' + clientId +
       '&response_type=token' +
       '&scope=' + encodeURIComponent(scopes) +
       '&redirect_uri=' + encodeURIComponent(redirectUri);
       res.setHeader('Content-Type','text/html');
       res.redirect(url);
       res.end();
 }

function authorizeUser(req, res) {
  var id , name, chordialID;
  var code = req.swagger.params.code.value; //spotify code
  spotifyApi.authorizationCodeGrant(code)   //trades code
  .then(function(data){
    spotifyApi.setAccessToken(data.body.access_token);  //gets access
    res.json(data.body.access_token);
    spotifyApi.setRefreshToken(data.body.refresh_token);
    spotifyApi.getMe()    //Gets information about authorized user
    .then(function(data) {
      if (data.body.display_name === null)  //Spotify user no display name
        name = data.body.id;    //So chordial username is id
      else
        name = data.body.display_name; //Facebook user display name
      id = data.body.id;
      User.findOne({spotifyID:id}, function(err, user) {
        if (err)
            res.send(err);
        if (user === null){    //User not in database
            console.log('making new user');
            user = new User();        //
            user.spotifyID = id;          //
            console.log("id" + id);       //  These lines set up new user
            user.name = name;             //
            user.chordialID = user.id;    //
            user.save(function(err) {     //
              if (err)
                res.send(err);
              console.log('New Chordial User Created?!');
            });       // end of user save function
          }   //end of creating new user
          else {
            //console.log(user);   //displays existing user
          }
        }).then(function(){     //End of User.find -> sync top tracks and respond to server
          User.findOne({spotifyID:id}, function(err,user) {
            user.tracks = [];
            spotifyApi.getMyTopTracks({limit:50})
            .then(function(toptracks) {
              toptracks.body.items.forEach(function(track){
                user.tracks.push(track.name);
              });//Populates user tracks with id of top tracks
              user.save(function(err){
                console.log(err);
              });
            },function(err) {
              console.log('Something went wrong!', err);
            });
          });
          res.json({ message:'200'});   //Send 200 or user ID
        });           // End of User.find.then
      }, function(err) {
        console.log('Something went wrong!', err); //Error of getMe .then
    });   //End of getMe .then
  });
} //End of authorization

function detailMe(req,res){
  spotifyApi.getMe()
  .then(function(data) {
    console.log('Some information about the authenticated user', data.body);
  }, function(err) {
    console.log('Something went wrong!', err);
  });
}

function detailFriends(req,res){

}

function addFriend(req,res){
  var id;
  spotifyApi.setAccessToken(req.swagger.params.access_token);
  spotifyApi.getMe()
  .then(function (data) {
    id = data.body.id;
    User.findOne({spotifyID : id})
    .exec(function(err, user) {
      User.findOne({name : req.swagger.params.friendName.value}, function(err, userF) {
        if(err)
          res.send(err);
        if(userF === null)
          res.json({ message: "Sorry, that user does not exist"});
        else {
        user.friends.push(userF.name);
        user.save(function(err) {
          if(err)
            res.send(err);
          console.log("New friend " + req.swagger.params.friendName.value + " added");
          res.json({ message:'200'});
        });
      }
    });
    });
  }, function(err) {
    console.log('Something went wrong!', err);
  });/*
  myUser(spotifyApi)
  .exec(function(err, user) {
    User.findOne({name : req.swagger.params.friendName.value}, function(err, userF) {
      if(err)
        res.send(err);
      if(userF === null)
        res.json({ message: "Sorry, that user does not exist"});
      else {
      user.friends.push(userF.name);
      user.save(function(err) {
        if(err)
          res.send(err);
        console.log("New friend " + req.swagger.params.friendName.value + " added");
        res.json({ message:'200'});
      });
    }
  });
});*/

}

function myMusic(req,res){

}

function shareCommon(req,res){
  var common = [];
  spotifyApi.setAccessToken(req.swagger.params.accessToken);
  spotifyApi.getMe()
  .then(function(err,data) {
    User.findOne({spotifyID : data.body.id})
    .exec(function(err, user) {
      User.findOne({spotifyID : req.swagger.params.idC}, function(err, userF) {
        if(err)
          res.send(err);
        for (var i = 0 ; i < user.tracks.length; i++)
          for (var j = 0; j < userF.tracks.length; j++)
            if(user.tracks[i].equals(userF.tracks[j]))
              common.push(user.tracks[i]);
      })
      .then(res.json(common));
    });
  });
}

function getAll(req,res){
  User.find().select('-_id').select('-__v').exec(function(err, users) {
      if (err)
          res.send(err);
      res.json(users);
  });
}

function deleteThemAll(req,res){
  User.remove({} , function(err, user) {
    if (err)
      res.send(err);
    res.json({ message: 'Database Successfully cleared'});
  });
}
