const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

//Import Routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');


//connect to DB
mongoose.connect(process.env.DB_CONNECT_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true},
     () => { console.log('Connected to DB!') })

//Middleware
app.use(express.json());
app.use(cors());


//Routes Middleware
app.use('/api/v1/user', authRoute);
app.use('/api/v1/posts', postRoute);


app.listen(process.env.PORT || 3000, () => console.log(`Server Up and Running on port ${process.env.PORT}`));
