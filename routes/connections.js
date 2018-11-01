var express = require('express');

var router = express.Router();

var graph = require('../db/credit-network-graph');

/* GET */
router.get('/', function(req, res, next) {
  graph.getUserConnections(req.user.id)
  .then(connections => {
    res.render('users/connections/connections-index', {
      user: req.user,
      connections: connections
    });
  })
  .catch(next);
});

module.exports = router;
