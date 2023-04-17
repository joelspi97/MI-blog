const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('about-me', {
    title: 'About me'
  });
});

module.exports = router;
