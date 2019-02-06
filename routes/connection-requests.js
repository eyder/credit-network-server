const express = require('express');
const asyncMiddleware = require('../utils/async-middleware');
const connectionRequests = require('../repositories/connection-requests');
const connections = require('../repositories/connections');
const users = require('../repositories/users');

const router = express.Router();

/* GET */
router.get('/', asyncMiddleware(async (req, res) => {
  const receivedReqs = await connectionRequests.findReceivedByUserId(req.user.id);
  const sentReqs = await connectionRequests.findSentByUserId(req.user.id);
  res.render('users/connection-requests/index', {
    user: req.user,
    receivedReqs,
    sentReqs,
  });
}));

/* GET find-person */
router.get('/find-person', asyncMiddleware(async (req, res) => {
  const others = await users.findUsersNotRelatedTo(req.user.id);
  res.render('users/connection-requests/find-person', {
    user: req.user,
    others,
  });
}));

/* GET confirm */
router.get('/to/:otherId/confirm', asyncMiddleware(async (req, res) => {
  const other = await users.findById(req.params.otherId);
  res.render('users/connection-requests/confirm', {
    user: req.user,
    other,
  });
}));

/* POST */
router.post('/to/:otherId', asyncMiddleware(async (req, res) => {
  await connectionRequests.create(req.user.id, req.params.otherId);
  res.redirect(`/users/${req.user.id}/connection-requests`);
}));

/* POST delete */
router.post('/to/:otherId/delete', asyncMiddleware(async (req, res) => {
  await connectionRequests.delete(req.user.id, req.params.otherId);
  res.redirect(`/users/${req.user.id}/connection-requests`);
}));

/* POST decline */
router.post('/from/:otherId/decline', asyncMiddleware(async (req, res) => {
  await connectionRequests.decline(req.params.otherId, req.user.id);
  res.redirect(`/users/${req.user.id}/connection-requests`);
}));

/* POST accept */
router.post('/from/:otherId/accept', asyncMiddleware(async (req, res) => {
  await connections.create(req.params.otherId, req.user.id);
  await connectionRequests.accept(req.params.otherId, req.user.id);
  res.redirect(`/users/${req.user.id}/connections`);
}));

module.exports = router;
