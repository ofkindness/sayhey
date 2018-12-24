const { dispatcher } = require('../../bot');

dispatcher.command('/hey', (req, res) => {
  const { chat: { id }, from: { username } } = req;
  return res.sendMessage(id, `Hey, ${username}`);
});

dispatcher.command('/heynour', (req, res) => {
  const { chat: { id }, from: { username } } = req;
  return res.sendMessage(id, `Hey, ${username}`);
});
