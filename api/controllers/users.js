var User = require('/models/user.js');

module.exports = {
  authorize: authorize
};

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */

function authorize(req, res) {
  var spotifytoken = req.swagger.params.spotifytoken.value;
  res.send(200);
}
