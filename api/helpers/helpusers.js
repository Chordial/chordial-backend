var SpotifyWebApi = require('spotify-web-api-node');
var User = require('../models/user.js');

module.exports = function(){
  this.myUser = function (spotifyApi) {
    spotifyApi.getMe()
    .then(function (data) {
      var id = data.body.id;
      var query = User.findOne({spotifyID : id});
      console.log(typeof query);
      console.log(query);
      return query;
    }, function(err){
      console.log(err);
    });
  };
};
