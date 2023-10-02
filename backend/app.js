const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');


const MONGODB_URI = 'mongodb+srv://thanadilok:' + process.env.MONGO_ATLAS_PW + '@cluster0.styglyy.mongodb.net/post';
const app = express();

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(err => {
    console.log('Connection failed! ' + err);
  });


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
/** Make images folder statically accessible, It's means any requests targeting that folder should be allowed to continue and fetch their files from there */
app.use('/images', express.static(path.join('backend/images')));


// ───────────────────────────────Routes──────────────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/api/posts', postsRoutes);
app.use('/api/user', userRoutes);


// app.use((error, req, res, next) => {
//   console.log("🚀 ~ file: app.js:30 ~ app.use ~ error:", error)

//   const status = error.statusCode;
//   const message = error.message;
//   const data = error.data;
//   res.status(status).json({
//     message: message,
//     data: data
//   });
// });

module.exports = app;
