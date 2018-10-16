var express = require('express');

var router = express.Router();

var users = require('../repositories/users');
var connections = require('../repositories/connections');
var connectionRequests = require('../repositories/connection-requests');

/* GET */
router.get('/', function(req, res, next) {
  const sentReqs = connectionRequests.filter(request => request.from.id == req.user.id);
  const receivedReqs = connectionRequests.filter(request => request.to.id == req.user.id);
  res.render('users/connection-requests/connection-requests-index', { 
    network: req.network, 
    user: req.user,
    sentReqs: sentReqs,
    receivedReqs: receivedReqs
  });
});

/* GET find-person */
router.get('/find-person', function(req, res, next) {
  const alreadyConnectedIds = connections
    .filter(connection => connection.from.id === req.user.id)
    .map(connection => connection.to.id);
  const requestsSentIds = connectionRequests
    .filter(request => request.from.id === req.user.id)
    .map(request => request.to.id);
  const requestsReceivedIds = connectionRequests
    .filter(connection => connection.to.id === req.user.id)
    .map(connection => connection.from.id);
  const networkUsers = users
    .filter(user => user.networkId === req.network.id);
  const others = networkUsers
    .filter(user => user.id !== req.user.id)
    .filter(user => !alreadyConnectedIds.includes(user.id))
    .filter(user => !requestsSentIds.includes(user.id))
    .filter(user => !requestsReceivedIds.includes(user.id));
  res.render('users/connection-requests/find-person', { 
    network: req.network, 
    user: req.user,
    others: others
  });
});

/* GET define-limit */
router.get('/to/:otherId/define-limit', function(req, res, next) {
  const other = users.find(user => user.networkId == req.network.id && user.id == req.params.otherId);  
  res.render('users/connection-requests/define-limit', { 
    network: req.network, 
    user: req.user,
    other: other
  });
});

/* POST */
router.post('/to/:otherId', function(req, res, next) {
  const other = users.find(user => user.networkId == req.network.id && user.id == req.params.otherId);
  connectionRequests.push({from: req.user, to: other, limit: req.body.limit});
  res.redirect('/networks/' + req.network.id + '/users/' + req.user.id);
});

module.exports = router;
