const express = require('express');
const createHttpError = require('http-errors');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(morgan('dev'));
app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', require('./routes/index.route'));
app.use('/auth', require('./routes/auth.route'));
app.use('/user', require('./routes/user.route'));

app.use((req, res, next) => {
    next(createHttpError.NotFound())
});

app.use((error, req, res, next) => {
    error.status = error.status || 500
    res.status(error.status);
    res.render('error_40x', { error });
})

const PORT = process.env.PORT || 5000;


mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.DB_NAME,
}).then(() => {
    console.log('Database connected');
    app.listen(PORT, () => console.log(`Flying on port ${PORT}`));
}).catch(err => console.log(err.message));
