const TelegramBot = require('node-telegram-bot-api');

const { Dispatcher } = require('./dispatcher');

const token = process.env.TELEGRAM_TOKEN || '';
const url = process.env.WEBHOOK_URL || '';

const bot = new TelegramBot(token);

bot.setWebHook(`${url}/bot${token}`);

module.exports = { dispatcher: Dispatcher(bot) };
