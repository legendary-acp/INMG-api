const express = require('express');

const crud = require('./crud');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/crud', crud);

module.exports = router;
