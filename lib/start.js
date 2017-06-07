import bot from './bot';

const start = (msg) => {
  const text = `<strong>Приветствуем Вас в игре Эгегей дня!</strong>
Для получения помощи воспользуйтесь командой <strong>/help</strong>`;

  return bot.sendMessage(msg.chat.id, text, {
    parse_mode: 'HTML'
  });
};

export default start;
