var express = require('express');

var router = express.Router();

var users = require('../repositories/users');
var connections = require('../repositories/connections');
var connectionRequests = require('../repositories/connection-requests');

/* GET find-person */
router.get('/find-person', function(req, res, next) {
  const friendsIds = connections
    .filter(connection => connection.from.id === req.user.id)
    .map(connection => connection.to.id);
  const networkUsers = users
    .filter(user => user.networkId === req.network.id);
  const others = networkUsers
    .filter(user => !friendsIds.includes(user.id) && user.id !== req.user.id);
  res.render('connection-requests/find-person', { 
    network: req.network, 
    user: req.user,
    others: others
  });
});

module.exports = router;
