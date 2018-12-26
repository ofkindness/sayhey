const bugsnag = require('@bugsnag/js');
const bugsnagExpress = require('@bugsnag/plugin-express');
const cookieParser = require('cookie-parser');
const express = require('express');
const httpErrors = require('http-errors');
const logger = require('morgan');
const path = require('path');

const indexRouter = require('./routes/index');
const webhookRouter = require('./routes/webhook');

const bugsnagClient = bugsnag(process.env.BUGSNAG_API_KEY);
bugsnagClient.use(bugsnagExpress);

const app = express();
const { errorHandler, requestHandler } = bugsnagClient.getPlugin('express');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use(requestHandler);

app.use('/', indexRouter);
app.use('/', webhookRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(httpErrors(404));
});

// error handler
app.use(errorHandler);

app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err);
});

module.exports = app;
