if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();

// Imports 
const expressLayouts = require('express-ejs-layouts');
const favicon = require('express-favicon');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const indexRouter = require('./routes/index.js');
const blogsRouter = require('./routes/blogs.js');
const selectedBlogRouter = require('./routes/selected-blog.js');
const aboutMeRouter = require('./routes/about-me.js');
// /Imports 

// Settings 
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views'); 
app.set('layout', 'layouts/layout'); 
// /Settings 

// Middleware 
app.use(express.static('public'));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(expressLayouts);
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));
app.use(express.json());
app.use(methodOverride('_method'));
// /Middleware 

// Routes 
app.use('/', indexRouter);
app.use('/blogs', blogsRouter);
app.use('/selected-blog', selectedBlogRouter);
app.use('/about-me', aboutMeRouter);
app.use((req, res) => {
  res.status(404);
  res.render('page-not-found', { title: 'Page Not Found' });
});
// /Routes 

// Database connection 
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', err => console.error(err));
db.once('open', () => console.log('Connected to Mongoose'));
// /Database connection 

app.listen(process.env.PORT || 3000);
