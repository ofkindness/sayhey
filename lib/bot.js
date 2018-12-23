const token = process.env.TELEGRAM_TOKEN || '';

const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(token);

module.exports = bot;
