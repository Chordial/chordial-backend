var Promise = require('promise');
var SpotifyWebApi = require('spotify-web-api-node');
var User = require('../models/user.js');
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
       res.redirect(url);
       res.json({ message: 'hi' });
 }

function authorizeUser(req, res) {
  var id , name, chordialID;
  var code = req.swagger.params.code.value; //spotify code
  var p1 = new Promise(function(resolve,reject){  //does not handle reject
    spotifyApi.authorizationCodeGrant(code)   //trades code
    .then(function(data){
      spotifyApi.setAccessToken(data.body.access_token);  //gets access
      spotifyApi.setRefreshToken(data.body.refresh_token);
      resolve();    //resolves promise
    });
  });           //End of authorization promise
  p1.then(function(){
    spotifyApi.getMe()    //Gets information about authorized user
    .then(function(data) {
      if (data.body.display_name === null)  //Spotify user no display name
        name = data.body.id;    //So chordial username is id
      else
        name = data.body.display_name; //Facebook user display name
      id = data.body.id;
      User.find({spotifyID:id}, function(err, sUser) {
        if (err)
            res.send(err);
        if (!Object.keys(sUser).length){    //User not in database
            console.log('making new user');
            var user = new User();        //
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
            console.log(sUser);   //displays existing user
          }
        }).then(function(){     //End of User.find -> then respond to server
          res.json({ message:'200'});   //Send 200 or user ID
        });           // End of User.find.then
      }, function(err) {
        console.log('Something went wrong!', err);
      });   //End of getMe .then
  });   //End of promise p1 .then
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
