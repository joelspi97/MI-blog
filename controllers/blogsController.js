const Blog = require('../models/blog');
const saveImage = require('../utils/saveImage');

// Get all blogs
const REGEX_CHARS = ['\\', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '^', '$']; // Special characters for regex  

async function getAllBlogs(req, res) {
  let searchOptions = {};
  const { search } = req.query;
 
  if (search) {
    // Escape special characters so that they don't affect searching on the database
    const userSearch = search.split('').map(char => REGEX_CHARS.includes(char) ? '\\' + char : char).join('');
    searchOptions.title = { $regex: userSearch, $options: "i" };
  }

  try {
    const blogs = await Blog.find(searchOptions);
    res.render('blogs/blogs', {
      title: 'All blogs',
      blogs,
      blog: {}, // Necessary to open blogForm modal
      searchQuery: search
    });
  } catch (err) {
    res.status(500).render('error', { 
      title: 'Server error',
      errorCode: '500',
      errorMessage: 'An error has occurred on the server. Please, try again later.' 
    });
  }
}
// Get all blogs

// Create a blog
async function createBlog(req, res) {
  const { title,
          abstract,
          blogBody,
          blogImage,
          blogImageAltText } = req.body;

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

  const blog = new Blog({
    title: title,
    abstract: abstract,
    blogBody: blogBody,
    blogImageAltText: blogImageAltText
  });

  if (!blog) {
    return res.status(500).render('error', { 
      title: 'Server error',
      errorCode: '500',
      errorMessage: 'An error has occurred on the server. Please, try again later.' 
    });
  }

  if (blogImage != null && blogImage !== '' && !Array.isArray(blogImage)) {
    saveImage(blog, blogImage);
  }

  try {
    const newBlog = await blog.save();
    res.redirect(`selected-blog/${newBlog.id}`);
  } catch (err) {
    res.status(500).render('error', { 
      title: 'Server error',
      errorCode: '500',
      errorMessage: 'An error has occurred on the server. Please, try again later.' 
    });
  }
}
// /Create a blog

module.exports = { getAllBlogs, createBlog };
