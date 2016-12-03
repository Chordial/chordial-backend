var SpotifyWebApi = require('spotify-web-api-node');
var User = (require('../models/user.js')).User;

module.exports = function(){
  this.myUser = function (spotifyApi, callback) {
    spotifyApi.getMe()
    .then(function (data) {
      var id = data.body.id;
      User.findOne({spotifyID : id}, function(err,user) {
        callback(err,user);
      });
    });
  };
};
