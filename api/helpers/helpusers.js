var SpotifyWebApi = require('spotify-web-api-node');
require('../models/user.js');

module.exports = function(){
  this.myUser = function (spotifyApi, User, callback) {
    spotifyApi.getMe()
    .then(function (data) {
      var id = data.body.id;
      User.findOne({spotifyID : id}, function(err,user) {
        if (err) {
          callback(err , null);
        }
        else {
          callback(null,user);
        }
      });
    });
  };
};
