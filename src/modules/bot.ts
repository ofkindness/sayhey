import TelegramBot from 'node-telegram-bot-api';

const token = process.env.TELEGRAM_TOKEN || '';

const bot = new TelegramBot(token);

module.exports = (webhookUrl = null) => {
  if (webhookUrl) {
    bot.setWebHook(`${webhookUrl}/bot${token}`);
  }

  return bot;
};
