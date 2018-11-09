const express = require('express');
const asyncMiddleware = require('../utils/async-middleware');
const graph = require('../db/credit-network-graph');

const router = express.Router();

/* GET */
router.get('/', asyncMiddleware(async (req, res) => {
  const receivedReqs = await graph.getReceivedConnectionRequests(req.user.id);
  const sentReqs = await graph.getSentConnectionRequests(req.user.id);
  res.render('users/connection-requests/connection-requests-index', {
    user: req.user,
    receivedReqs,
    sentReqs,
  });
}));

/* GET find-person */
router.get('/find-person', asyncMiddleware(async (req, res) => {
  const others = await graph.listUsersNotRelatedTo(req.user.id);
  res.render('users/connection-requests/find-person', {
    user: req.user,
    others,
  });
}));

/* GET define-limit */
router.get('/to/:otherId/define-limit', asyncMiddleware(async (req, res) => {
  const other = await graph.getUser(req.params.otherId);
  res.render('users/connection-requests/define-limit', {
    user: req.user,
    other,
  });
}));

/* POST */
router.post('/to/:otherId', asyncMiddleware(async (req, res) => {
  const other = await graph.getUser(req.params.otherId);
  await graph.createConnectionRequest(req.user.id, other.id, req.body.limit);
  res.redirect(`/users/${req.user.id}`);
}));

module.exports = router;
