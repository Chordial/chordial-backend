var User = require('/models/user.js');
var spotifyApi = new SpotifyWebApi({
  clientId : 'c0be0c89a1e241898635418ad5fbbbef',
  clientSecret : '5adebeaaee924c3cad12ed37545a8489',
  redirectUri : 'http://localhost:10010/user/authorize'
});

module.exports = {
  authorizeUser : authorizeUser
};

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
       res.writeHead(301,{Location: url});
 }

function authorizeUser(req, res) {
  var spotifyCode = req.swagger.params.spotifyCode.value;
  spotifyApi.authorizationCodeGrant(spotifyCode);
  spotifyApi.getMe()
  .then(function(data) {
    var name = data.body.display_name;
    var id = data.body.id;
  }, function(err) {
    console.log('Something went wrong!', err);
  });
  User.find({spotifyID:id}, function(err, sUser) {
      if (err)
          res.send(err);
      if (sUser === null){
          var user = new User();
          user.spotifyID = id;
          user.name = name;
          user.friends = [];
          user.save(function(err) {
              if (err)
                  res.send(err);

              res.send('New Chordial User Created?!');
          });
          res.send(user.id);
        }
      else {
        res.send(sUser.id);
      }
  });
  res.send(200);
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
