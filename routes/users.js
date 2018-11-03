const express = require('express');

const router = express.Router();
const connectionRequestsRouter = require('./connection-requests');
const connectionsRouter = require('./connections');

const graph = require('../db/credit-network-graph');

/* GET user */
router.get('/:userId', (req, res) => {
  res.redirect(`/users/${req.params.userId}/connections`);
});

/* NESTED ROUTES /users/:id/connection-requests */
router.use('/:userId/connection-requests', (req, res, next) => {
  graph.getUser(req.params.userId)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch(next);
}, connectionRequestsRouter);

/* NESTED ROUTES /users/:id/connections */
router.use('/:userId/connections', (req, res, next) => {
  graph.getUser(req.params.userId)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch(next);
}, connectionsRouter);

module.exports = router;
