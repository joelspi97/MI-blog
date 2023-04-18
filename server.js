if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();

const expressLayouts = require('express-ejs-layouts');
const favicon = require('express-favicon');
const bodyParser = require('body-parser');
const blogsRouter = require('./routes/blogs.js');
const indexRouter = require('./routes/index.js');
const aboutMeRouter = require('./routes/about-me.js');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views'); 
app.set('layout', 'layouts/layout'); 

app.use(express.static('public'));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(expressLayouts);
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));
app.use('/blogs', blogsRouter);
app.use('/about-me', aboutMeRouter);
app.use('/', indexRouter);

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', err => console.error(err));
db.once('open', () => console.log('Connected to Mongoose'));

app.listen(process.env.PORT || 3000);
