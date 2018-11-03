const express = require('express');

const router = express.Router();

const graph = require('../db/credit-network-graph');

/* GET */
router.get('/', (req, res, next) => {
  graph.getUserConnections(req.user.id)
    .then((connections) => {
      res.render('users/connections/connections-index', {
        user: req.user,
        connections,
      });
    })
    .catch(next);
});

module.exports = router;
