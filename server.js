const express = require('express');
const app = express();
const path = require('path');
// const cors = require('cors');

const postRouter = require('./routes/post_controller');

const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

// Local MongoDB --> For testing purposes.
// const mongoEndpoint = 'mongodb://127.0.0.1/news_posts'

// Cloud Atlast MongoDB_URI  --> Should remove later.
// const mongoEndpoint = 'mongodb+srv://devUser:devPassword@webdevcluster.xv0sv.mongodb.net/news_posts?retryWrites=true&w=majority'

// Connects to Cloud Atlas URI via Heroku. Use this in final submission.
const mongoEndpoint = process.env.MONGODB_URI || 'mongodb://127.0.0.1/news_posts';
mongoose.connect(mongoEndpoint, { useNewUrlParser: true, useUnifiedTopology: true });

// Gets connection string
const db = mongoose.connection;

// Creates connection and throw error if it doesn't work.
db.on('error', console.error.bind(console, 'Error connecting to MongoDB'));


app.use(express.static(path.join(__dirname, 'build')));

// Bandaid fix for cors, but not secure.
// Will ask Hunter or TAs about fixes later
// app.use(cors({
//     origin: '*',
// }));

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sets the base url path.
// Postman: http://localhost:8000/api/posts/...
app.use('/api/posts', postRouter);

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// process.env.PORT --> Heroku
// port 8000 --> Local
app.listen(process.env.PORT || 8000, () => {
  console.log('Starting server');
});