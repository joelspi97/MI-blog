const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');
const saveImage = require('../utils/saveImage');

// Routes logic 
router.put('/', async (req, res) => {
  // Validate if inputs were filled correctly 
  const checkValues = [req.body.title, req.body.abstract ,req.body.blogBody];
  if (checkValues.some(value => value === '') || req.body.title.length > 35 || req.body.abstract > 35) {
    return res.status(403).end();
  }
  // /Validate if inputs were filled correctly 

  try {
    const updatedBlog = await Blog.findById(req.body.id);
    // In case the id wasn't found
    if (!updatedBlog) {
      res.redirect('/page-not-found');
      return;
    }
    
    updatedBlog.title = req.body.title;
    updatedBlog.abstract = req.body.abstract;
    updatedBlog.blogBody = req.body.blogBody;
    updatedBlog.blogImageAltText = req.body.blogImageAltText;

    if (req.body.blogImage != null && req.body.blogImage !== '' && !Array.isArray(req.body.blogImage)) {
      saveImage(updatedBlog, req.body.blogImage);
    }

    await updatedBlog.save(); 
    res.status(200).redirect(`selected-blog/${updatedBlog.id}`);
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
// /Routes logic 

module.exports = router;
