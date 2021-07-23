if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();;
}
const express = require('express');
const app = express();
const cors = require('cors');

//Import database connection config
const connection = require('./db');

//Import Routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

//connect to DB
connection();

//Middleware
app.use(express.json());
app.use(cors());

//Routes Middleware
app.use('/api/v1/user', authRoute);
app.use('/api/v1/posts', postRoute);

app.listen(process.env.PORT || 3000, () => console.log(`Server Up and Running on port ${process.env.PORT}`));
