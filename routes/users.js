var express = require('express');

var router = express.Router();
var connectionRequestsRouter = require('./connection-requests');
var connectionsRouter = require('./connections');

var graph = require('../db/credit-network-graph');

/* GET user */
router.get('/:userId', function(req, res, next) {
  res.redirect('/users/' + req.params.userId + '/connections');
});

/* NESTED ROUTES /users/:id/connection-requests */
router.use('/:userId/connection-requests', function(req, res, next) { 
  graph.getUser(req.params.userId)
  .then(user => {
    req.user = user;
    next();
  })
  .catch(next);
}, connectionRequestsRouter);

/* NESTED ROUTES /users/:id/connections */
router.use('/:userId/connections', function(req, res, next) { 
  graph.getUser(req.params.userId)
  .then(user => {
    req.user = user;
    next();
  })
  .catch(next);
}, connectionsRouter);

module.exports = router;
