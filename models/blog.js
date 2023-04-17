const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  abstract: {
    type: String,
    required: true
  },
  blogBody: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: false
  },
  imageAltText: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('Blog', blogSchema); 
