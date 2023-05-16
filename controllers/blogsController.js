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
    console.error(err);
    res.redirect('/');
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
    return res.status(403).end();
  }
  // /Validate if inputs were filled correctly

  const blog = new Blog({
    title: title,
    abstract: abstract,
    blogBody: blogBody,
    blogImageAltText: blogImageAltText
  });

  if (!blog) {
    return res.status(500).end();
  }

  if (blogImage != null && blogImage !== '' && !Array.isArray(blogImage)) {
    saveImage(blog, blogImage);
  }

  try {
    const newBlog = await blog.save();
    res.redirect(`selected-blog/${newBlog.id}`);
  } catch (err) {
    console.error(err);
    res.redirect('blogs');
  }
}
// /Create a blog

module.exports = { getAllBlogs, createBlog };
