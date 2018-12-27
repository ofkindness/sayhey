const { dispatcher } = require('../bot');

dispatcher.command('default', (req, res) => {
  const { chat: { id: chatId } } = req;
  return res.sendMessage(chatId, 'Нет такой команды');
});
