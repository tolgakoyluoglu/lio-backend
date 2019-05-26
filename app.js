const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config()
const cors = require('cors');
const authMiddleware = require('./middleware/checkAuth');
const rejectExpiredToken = require('./middleware/rejectExpiredToken');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const profileRouter = require('./routes/profile');
const authRouter = require('./routes/auth');
const feedRouter = require('./routes/feed');
const adRouter = require('./routes/ad');
const adminRouter = require('./routes/admin');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(rejectExpiredToken);
app.use(authMiddleware);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/profile', profileRouter);
app.use('/auth', authRouter);
app.use('/feed', feedRouter);
app.use('/ads', adRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

//Connect to mongodb
mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useCreateIndex: true }, function (err) {
    if (err) {
        throw err;
    } else {
        console.log(`Successfully connected to ${process.env.MONGO}`);
    }
});

module.exports = app;
