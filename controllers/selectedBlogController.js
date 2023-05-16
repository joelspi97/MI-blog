const Blog = require('../models/blog');
const saveImage = require('../utils/saveImage');
const mongoose = require('mongoose');

// Edit selected blog 
async function editSelectedBlog(req, res) {
  const { title,
          abstract,
          blogBody,
          blogImage,
          blogImageAltText,
          id } = req.body;

  // Validate if inputs were filled correctly 
  const checkValues = [title, abstract, blogBody];
  if (checkValues.some(value => value === '') || title.length > 35 || abstract > 35) {
    return res.status(403).end();
  }
  // /Validate if inputs were filled correctly 

  try {
    const updatedBlog = await Blog.findById(id);

    // In case the id wasn't found
    if (!updatedBlog) {
      return res.redirect('/page-not-found');
    }
    
    updatedBlog.title = title;
    updatedBlog.abstract = abstract;
    updatedBlog.blogBody = blogBody;
    updatedBlog.blogImageAltText = blogImageAltText;

    if (blogImage != null && blogImage !== '' && !Array.isArray(blogImage)) {
      saveImage(updatedBlog, blogImage);
    }

    await updatedBlog.save(); 
    res.status(200).redirect(`selected-blog/${updatedBlog.id}`);
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
}
// /Edit selected blog 

// Get selected blog 
async function getSelectedBlog(req, res) {
  const id = req.params.id;

  // Validate id 
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.redirect('/page-not-found');
  }
  // /Validate id 

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
}
// /Get selected blog 

// Delete selected blog 
async function deleteSelectedBlog(req, res) {
  const id = req.params.id;

  // Validate id 
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.redirect('/page-not-found');
  }
  // /Validate id 

  try {
    await Blog.findByIdAndDelete(id);
    res.status(200).end();
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
}
// /Delete selected blog 

module.exports = { editSelectedBlog, getSelectedBlog, deleteSelectedBlog };
