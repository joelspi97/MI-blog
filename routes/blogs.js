const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');

const REGEX_CHARS = ['\\', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '^', '$']; // Special characters for regex  

router.get('/', async (req, res) => {
  let searchOptions = {};
  
  if (req.query.search) {
    // Escape special characters so that they don't affect searching on the database 
    const userSearch = req.query.search.split('').map(char => REGEX_CHARS.includes(char) ? '\\' + char : char).join(''); 
    searchOptions.title = { $regex: userSearch, $options: "i" };
  }

  try {
    const blogs = await Blog.find(searchOptions);
    res.render('blogs/blogs', { 
      title: 'All blogs', 
      blogs, 
      blog: {},
      searchQuery: req.query.search 
    });
  } catch (error) {
    console.log(error);
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
    res.redirect(`blogs/${newBlog.id}`);
  } catch (err) {
    res.redirect('blogs');
  }
});

router.put('/', async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.body.id, {
      title: req.body.title,
      abstract: req.body.abstract,
      blogBody: req.body.blogBody,
      imageAltText: req.body.imageAltText
    }, { new: true });
    
    if (!updatedBlog) {
      return res.status(404).json({ error: 'Blogpost not found' });
    }

    res.status(200).end();
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const selectedBlog = await Blog.findById(id);

    res.render('blogs/selectedBlog', { 
      title: selectedBlog.title, 
      blog: selectedBlog
    });
  } catch (err) {
    console.error(err);
    res.redirect('/page-not-found');
  }
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    await Blog.findByIdAndDelete(id);
    res.status(200).end();
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
});

module.exports = router;
