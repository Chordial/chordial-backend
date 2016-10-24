var Promise = require('promise');
var SpotifyWebApi = require('spotify-web-api-node');
var User = require('../models/user.js');
var spotifyApi = new SpotifyWebApi({
  clientId : 'c0be0c89a1e241898635418ad5fbbbef',
  clientSecret : '5adebeaaee924c3cad12ed37545a8489',
  redirectUri : 'http://localhost:10010/user/callback'
});

module.exports = {authorizeUser, authorizeTesting, detailMe, detailFriends, addFriend, myMusic, shareCommon, deleteThemAll};

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
  var id , name;
  console.log('ive been called');
  var code = req.swagger.params.code.value;
  //var p1 = new Promise(function(resolve,reject){
  spotifyApi.authorizationCodeGrant(code)
  .then(function(data){
    spotifyApi.setAccessToken(data.body.access_token);
    console.log('I"VE REALLY SET IT CMON');
    spotifyApi.setRefreshToken(data.body.refresh_token);
  //  resolve();
  });
//});
/*p1.then(function(){
  console.log('access token set');
  spotifyApi.getMe()
  .then(function(data) {
    console.log('me gotten');
    name = data.body.display_name;
    id = data.body.id;
    User.find({spotifyID:id}, function(err, sUser) {
        if (err)
            res.send(err);
        if (sUser === null){
            console.log('making new user');
            var user = new User();
            user.spotifyID = id;
            console.log("id" + id);
            user.name = name;
            user.save(function(err) {
                if (err)
                    res.send(err);
                console.log('New Chordial User Created?!');
                res.json({ message:'New Chordial User Created?!'});
            });
            console.log('maybe');
            console.log(user.id);
            res.json(user.id);
          }
        else {
          console.log('else');
          console.log(sUser);
          res.json(sUser);
        }
    });
    console.log('things happened');
    res.json({ message:'400'});
  }, function(err) {
    console.log('Something went wrong!', err);
  });
});*/
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

function deleteThemAll(req,res){
  User.remove({} , function(err, user) {
    if (err)
      res.send(err);

    res.json({ message: 'Database Successfully cleared'});
  });
}
