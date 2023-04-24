const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif']; 

function saveImage(blog, blogImageEncoded) {
  if (blogImageEncoded == null) return;
  const newBlogImage = JSON.parse(blogImageEncoded);

  if (newBlogImage != null && IMAGE_MIME_TYPES.includes(newBlogImage.type)) {
    blog.blogImage = new Buffer.from(newBlogImage.data, 'base64');
    blog.blogImageType = newBlogImage.type;
  }
}

module.exports = saveImage;
