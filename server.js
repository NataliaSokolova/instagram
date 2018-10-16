const mongoose = require('mongoose');
const express = require('express');
require('./models/User');
const posts = require('./routes/api/posts');
const bodyParser = require('body-parser');
const users = require('./routes/api/users');
const passport = require('passport');
const profile = require('./routes/api/profile');

const app = express();

//Body Parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//DB Config
const db = require('./keys').mongoURI;
//Connect to DB using mongoose
mongoose
    .connect(db)
    .then(() => console.log('DB connected'))
    .catch(err => console.log(err));

//app.get('/',(req, res) => res.send('Hello World!!!!!!!!'));

//passport middleware
app.use(passport.initialize());

//Passport config
require('./config/passport')(passport);


//User routes
app.use('/api/users', users);
//posts routes
app.use('/api/posts', posts);
//profile routes
app.use('/api/profile', profile);


const port = 9001;
app.listen(port,() => console.log(`Server running on port: ${port}`));








