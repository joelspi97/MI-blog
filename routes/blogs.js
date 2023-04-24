const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');

const REGEX_CHARS = ['\\', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '^', '$']; // Special characters for regex  
const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif']; 

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
  if (checkValues.some(value => value === '') || req.body.title.length > 15 || req.body.abstract > 15) {
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
    res.redirect(`blogs/${newBlog.id}`);
  } catch (err) {
    res.redirect('blogs');
  }
});

router.put('/', async (req, res) => {
  // Validate if inputs were filled correctly 
  const checkValues = [req.body.title, req.body.abstract ,req.body.blogBody];
  if (checkValues.some(value => value === '') || req.body.title.length > 15 || req.body.abstract > 15) {
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
    res.status(200).redirect(`blogs/${updatedBlog.id}`);
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

// Helper functions 
function saveImage(blog, blogImageEncoded) {
  if (blogImageEncoded == null) return;
  const newBlogImage = JSON.parse(blogImageEncoded);

  if (newBlogImage != null && IMAGE_MIME_TYPES.includes(newBlogImage.type)) {
    blog.blogImage = new Buffer.from(newBlogImage.data, 'base64');
    blog.blogImageType = newBlogImage.type;
  }
}
// /Helper functions 

module.exports = router;
