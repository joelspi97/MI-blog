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
  blogImage: {
    type: Buffer,
    required: false
  },
  blogImageType: {
    type: String,
    required: false
  },
  blogImageAltText: {
    type: String,
    required: false
  }
});

blogSchema.virtual('blogImagePath').get(function() {
  if (this.blogImage != null && this.blogImageType != null) {
    return `data:${this.blogImageType};charset=utf-8;base64,${this.blogImage.toString('base64')}`
  }
});

module.exports = mongoose.model('Blog', blogSchema); 
