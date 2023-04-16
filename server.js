const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
const fs = require('fs');

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Home'
  });
});

app.get('/blogs', (req, res) => {
  fs.readFile('blogs.json', (error, data) => {
    if (error) {
      res.status(500).end();
    } else {
      res.render('blogs', {
        title: 'All blogs',
        blogs: JSON.parse(data)
      });
    }
  });
});

app.get('/profile', (req, res) => {
  res.render('profile', {
    title: 'About me'
  });
});

app.get('/blog', (req, res) => {
  res.render('blog', {
    title: 'Selected blog'
  });
});

app.listen(3000);
