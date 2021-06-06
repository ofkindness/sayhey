import Bugsnag from '@bugsnag/js';
import BugsnagPluginExpress from '@bugsnag/plugin-express';
import { config } from 'dotenv';

config();

const { BUGSNAG_API_KEY = '' } = process.env;

Bugsnag.start({
  apiKey: BUGSNAG_API_KEY,
  plugins: [BugsnagPluginExpress],
});

export default Bugsnag;
