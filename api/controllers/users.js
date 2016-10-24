var Promise = require('promise');
var SpotifyWebApi = require('spotify-web-api-node');
var User = require('../models/user.js');
var spotifyApi = new SpotifyWebApi({
  clientId : 'c0be0c89a1e241898635418ad5fbbbef',
  clientSecret : '5adebeaaee924c3cad12ed37545a8489',
  redirectUri : 'http://localhost:10010/user/callback'
});

module.exports = {authorizeUser, authorizeTesting, detailMe, detailFriends, addFriend, myMusic, shareCommon, getAll, deleteThemAll};

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */
 function authorizeTesting(req,res) {
   var scopes = ['user-follow-read'],
       redirectUri = 'http://localhost:10010/user/authorize',
       clientId = 'c0be0c89a1e241898635418ad5fbbbef';
   var url = 'https://accounts.spotify.com/authorize?client_id=' + clientId +
       '&response_type=token' +
       '&scope=' + encodeURIComponent(scopes) +
       '&redirect_uri=' + encodeURIComponent(redirectUri);
       res.redirect(url);
       res.json({ message: 'hi' });
 }

function authorizeUser(req, res) {
  var id , name, chordialID;
  var code = req.swagger.params.code.value;
  var p1 = new Promise(function(resolve,reject){
    spotifyApi.authorizationCodeGrant(code)
    .then(function(data){
      spotifyApi.setAccessToken(data.body.access_token);
      spotifyApi.setRefreshToken(data.body.refresh_token);
      resolve();
    });
  });
  p1.then(function(){
    spotifyApi.getMe()
    .then(function(data) {
      if (data.body.display_name === null)
        name = data.body.id;
        else
        name = data.body.display_name;
      id = data.body.id;
      User.find({spotifyID:id}, function(err, sUser) {
        if (err)
            res.send(err);
        if (!Object.keys(sUser).length){
            console.log('making new user');
            var user = new User();
            user.spotifyID = id;
            console.log("id" + id);
            user.name = name;
            user.chordialID = user.id;
            user.save(function(err) {
              if (err)
                res.send(err);
              console.log('New Chordial User Created?!');
            });
          }
          else {
            console.log(sUser);
          }
        }).then(function(){
          res.json({ message:'200'});
        });
      }, function(err) {
        console.log('Something went wrong!', err);
      });
  });
}

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

}

function myMusic(req,res){

}

function shareCommon(req,res){

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
