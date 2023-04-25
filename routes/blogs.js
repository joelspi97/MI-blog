const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');
const saveImage = require('../utils/saveImage');

const REGEX_CHARS = ['\\', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '^', '$']; // Special characters for regex  

// Routes logic 
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
      blog: {}, // Necessary to open blogForm modal 
      searchQuery: req.query.search 
    });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

router.post('/', async (req, res) => {
  // Validate if inputs were filled correctly 
  const checkValues = [req.body.title, req.body.abstract ,req.body.blogBody];
  if (checkValues.some(value => value === '') || req.body.title.length > 35 || req.body.abstract > 35) {
    return res.status(403).end();
  }
  // /Validate if inputs were filled correctly 

  const blog = new Blog({
    title: req.body.title,
    abstract: req.body.abstract,
    blogBody: req.body.blogBody,
    blogImageAltText: req.body.blogImageAltText
  });

  if (req.body.blogImage != null && req.body.blogImage !== '' && !Array.isArray(req.body.blogImage)) {
    saveImage(blog, req.body.blogImage);
  }

  try {
    const newBlog = await blog.save();
    res.redirect(`selected-blog/${newBlog.id}`);
  } catch (err) {
    res.redirect('blogs');
  }
});

module.exports = router;
