const express = require('express');
const router = express.Router();
const { editSelectedBlog, getSelectedBlog, deleteSelectedBlog } = require('../controllers/selectedBlogController');

router.put('/', editSelectedBlog);
router.get('/:id', getSelectedBlog);
router.delete('/:id', deleteSelectedBlog);

module.exports = router;
