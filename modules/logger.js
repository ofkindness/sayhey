const bugsnag = require('@bugsnag/js');
const bugsnagExpress = require('@bugsnag/plugin-express');

let bugsnagClient = {};

const emptyHandler = (req, res, next) => {
  next();
};

let errorHandler = emptyHandler;
let requestHandler = emptyHandler;

if (['development', 'staging', 'production'].includes(process.env.NODE_ENV)) {
  (bugsnagClient = bugsnag(process.env.BUGSNAG_API_KEY));
  bugsnagClient.use(bugsnagExpress);
  ({ errorHandler, requestHandler } = bugsnagClient.getPlugin('express'));
}

const { notify = console.error } = bugsnagClient; // eslint-disable-line no-console

module.exports = { notify, errorHandler, requestHandler };
