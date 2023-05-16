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

  // Validate id 
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).render('error', { 
      title: 'Bad request',
      errorCode: '400',
      errorMessage: "The provided blogpost ID is not valid." 
    });
  }
  // /Validate id 

  // Validate if inputs were filled correctly 
  const checkValues = [title, abstract, blogBody];
  if (checkValues.some(value => value === '') || title.length > 35 || abstract > 35) {
    return res.status(400).render('error', { 
      title: 'Bad request',
      errorCode: '400',
      errorMessage: 'Please fill in all the required fields, keep to the maximum of characters and then try again.' 
    });
  }
  // /Validate if inputs were filled correctly 

  try {
    const updatedBlog = await Blog.findById(id);

    // In case the id wasn't found
    if (!updatedBlog) {
      return res.status(404).render('error', { 
        title: 'Blog not found',
        errorCode: '404',
        errorMessage: "It seems like the blogpost you were trying to edit doesn't exist anymore." 
      });
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
    return res.status(500).render('error', { 
      title: 'Server error',
      errorCode: '500',
      errorMessage: 'An error has occurred on the server. Please, try again later.' 
    });
  }
}
// /Edit selected blog 

// Get selected blog 
async function getSelectedBlog(req, res) {
  const id = req.params.id;

  // Validate id 
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).render('error', { 
      title: 'Bad request',
      errorCode: '400',
      errorMessage: "The provided blogpost ID is not valid." 
    });
  }
  // /Validate id 

  try {
    const selectedBlog = await Blog.findById(id);

    if (!selectedBlog) {
      return res.status(404).render('error', { 
        title: 'Blog not found',
        errorCode: '404',
        errorMessage: "We couldn't find the blogpost you were looking for." 
      });
    }

    res.render('blogs/selectedBlog', { 
      title: selectedBlog.title, 
      blog: selectedBlog
    });
  } catch (err) {
    return res.status(500).render('error', { 
      title: 'Server error',
      errorCode: '500',
      errorMessage: 'An error has occurred on the server. Please, try again later.' 
    });
  }
}
// /Get selected blog 

// Delete selected blog 
async function deleteSelectedBlog(req, res) {
  const id = req.params.id;

  // Validate id 
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).render('error', { 
      title: 'Bad request',
      errorCode: '400',
      errorMessage: "The provided blogpost ID is not valid." 
    });
  }
  // /Validate id 

  try {
    await Blog.findByIdAndDelete(id);
    res.status(200).end();
  } catch (err) {
    return res.status(500).render('error', { 
      title: 'Server error',
      errorCode: '500',
      errorMessage: 'An error has occurred on the server. Please, try again later.' 
    });
  }
}
// /Delete selected blog 

module.exports = { editSelectedBlog, getSelectedBlog, deleteSelectedBlog };
