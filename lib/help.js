import bot from './bot';

const help = (msg) => {
  const text = `<strong>Правила игры Эгегей дня:</strong>
- Запустите розыгрыш по команде /hey
Розыгрыш проходит только раз в день, повторная команда выведет лишь результат.
Вы всегда можете просмотреть результат с помощью команды /heynour
Сброс розыгрыша происходит каждый день в 12 часов ночи по московскому времени.`;

  return bot.sendMessage(msg.chat.id, text, {
    parse_mode: 'HTML'
  });
};

export default help;
