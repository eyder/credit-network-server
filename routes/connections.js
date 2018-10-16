var express = require('express');

var router = express.Router();

var connections = require('../repositories/connections');

/* GET */
router.get('/', function(req, res, next) {
  const userConnections = connections.filter(connection => connection.from.id == req.user.id);
  res.render('users/connections/connections-index', { 
    network: req.network, 
    user: req.user,
    connections: userConnections
  });
});

module.exports = router;
