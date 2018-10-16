var express = require('express');

var router = express.Router();
var connectionRequestsRouter = require('./connection-requests');
var connectionsRouter = require('./connections');

var users = require('../repositories/users');

var generateRandomUser = require('../services/generate-random-user');

/* POST user */
router.post('/', function(req, res, next) {
  generateRandomUser()
    .then(
      user => {
        user.networkId = req.network.id;
        users.push(user);
        res.redirect('/networks/' + req.network.id);
      }
    )
    .catch(next);
});

/* GET user */
router.get('/:userId', function(req, res, next) {
  const user = users.find(user => user.networkId == req.network.id && user.id == req.params.userId);
  res.redirect('/networks/' + req.network.id + '/users/' + user.id + '/connections');
});

/* NESTED ROUTES /networks/:id/users/:id/connection-requests */
router.use('/:userId/connection-requests', function(req, res, next) { 
  req.user = users.find(user => user.networkId == req.network.id && user.id == req.params.userId);  
  next();
}, connectionRequestsRouter);

/* NESTED ROUTES /networks/:id/users/:id/connections */
router.use('/:userId/connections', function(req, res, next) { 
  req.user = users.find(user => user.networkId == req.network.id && user.id == req.params.userId);  
  next();
}, connectionsRouter);

module.exports = router;
