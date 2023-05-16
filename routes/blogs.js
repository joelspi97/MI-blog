const express = require('express');
const router = express.Router();
const { getAllBlogs, createBlog } = require('../controllers/blogsController');

router.get('/', getAllBlogs);
router.post('/', createBlog);

module.exports = router;
