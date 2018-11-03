const express = require('express');

const router = express.Router();

const graph = require('../db/credit-network-graph');

/* GET */
router.get('/', (req, res, next) => {
  graph.getReceivedConnectionRequests(req.user.id)
    .then((receivedReqs) => {
      req.receivedReqs = receivedReqs;
      return receivedReqs;
    })
    .then(() => graph.getSentConnectionRequests(req.user.id))
    .then((sentReqs) => {
      res.render('users/connection-requests/connection-requests-index', {
        user: req.user,
        sentReqs,
        receivedReqs: req.receivedReqs,
      });
    })
    .catch(next);
});

/* GET find-person */
router.get('/find-person', (req, res, next) => {
  graph.listUsersNotRelatedTo(req.user.id)
    .then((others) => {
      res.render('users/connection-requests/find-person', {
        user: req.user,
        others,
      });
    })
    .catch(next);
});

/* GET define-limit */
router.get('/to/:otherId/define-limit', (req, res, next) => {
  graph.getUser(req.params.otherId)
    .then(other => res.render('users/connection-requests/define-limit', {
      user: req.user,
      other,
    }))
    .catch(next);
});

/* POST */
router.post('/to/:otherId', (req, res, next) => {
  graph.getUser(req.params.otherId)
    .then(other => graph.createConnectionRequest(req.user.id, other.id, req.body.limit))
    .then(() => {
      res.redirect(`/users/${req.user.id}`);
    })
    .catch(next);
});

module.exports = router;
