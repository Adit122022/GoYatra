const express = require('express');
const {
  checkAuth,
} = require('../controllers/user.controller');
const router = express.Router();

router.get('/check-auth', checkAuth);

module.exports = router;
