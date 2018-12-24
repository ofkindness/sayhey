const { dispatcher } = require('../bot');

dispatcher.command('default', (req, res) => {
  const { chat: { id } } = req;
  return res.sendMessage(id, 'Нет такой команды');
});
