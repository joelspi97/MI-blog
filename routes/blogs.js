const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');

router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({});
    res.render('blogs/blogs', { title: 'All blogs', blogs });
  } catch (error) {
    res.redirect('/');
  }
});

router.post('/', async (req, res) => {
  const blog = new Blog({
    title: req.body.title,
    abstract: req.body.abstract,
    blogBody: req.body.blogBody,
    imageAltText: req.body.imageAltText
  });

  try {
    const newBlog = await blog.save();
    res.render('blogs/selectedBlog', { title: 'Selected blog' });
  } catch (err) {
    res.redirect('blogs');
  }
});

router.get('/blog', (req, res) => {
  res.render('blogs/selectedBlog', { title: 'Selected blog' });
});

module.exports = router;