const express = require('express');
const asyncMiddleware = require('../utils/async-middleware');
const connectionRequestsRouter = require('./connection-requests');
const connectionsRouter = require('./connections');
const graph = require('../db/credit-network-graph');

const router = express.Router();

/* GET user */
router.get('/:userId', (req, res) => {
  res.redirect(`/users/${req.params.userId}/connections`);
});

/* NESTED ROUTES /users/:id/connection-requests */
router.use('/:userId/connection-requests', asyncMiddleware(async (req, res, next) => {
  const user = await graph.getUser(req.params.userId);
  req.user = user;
  next();
}), connectionRequestsRouter);

/* NESTED ROUTES /users/:id/connections */
router.use('/:userId/connections', asyncMiddleware(async (req, res, next) => {
  const user = await graph.getUser(req.params.userId);
  req.user = user;
  next();
}), connectionsRouter);

module.exports = router;
