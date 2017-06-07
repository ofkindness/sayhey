import _ from 'lodash';

import Poll from './models/poll';
import bot from './bot';

const defaultOptions = {
  0: 'Да',
  1: 'Нет',
  3: 'Я - томат'
};
const defaultQuestion = 'Ты меня уважаешь?';
// serialize pollling options to inline keyboard
const options2buttons = (options) => {
  const buttons = {
    inline_keyboard: []
  };
  Object.keys(options).forEach((option) => {
    buttons.inline_keyboard.push([{
      text: options[option],
      callback_data: option
    }]);
  });
  return buttons;
};

const msgOptions = options => ({
  parse_mode: 'HTML',
  reply_markup: JSON.stringify(options2buttons(options))
});

// get marked up results with percentage and poo bars.
const generateResults = (options, results) => {
  let resultStr = '\n';
  let total = 0;
  // get total votes count
  Object.keys(results).forEach((result) => {
    total += parseInt(results[result], 10);
  });
  const pooBarItem = String.fromCodePoint(0x0001F4A9);
  Object.keys(options).forEach((option) => {
    const result = isNaN(results[option]) ? 0 : parseInt(results[option], 10);
    const percentage = total > 0 ? ((result / total) * 100).toFixed(0) : 0;
    const pooCount = ((percentage / 10) + 1).toFixed(0);
    const bar = pooBarItem.repeat(pooCount);
    resultStr = resultStr.concat(`
        <b>${options[option]}</b> - ${result}
         ${bar} <b>${percentage} %</b>
        `);
  });
  resultStr = resultStr.concat(`
      Всего бездельников: ${total}.`);
  return resultStr;
};

// format message with results to look fine.
const getFormattedResult =
  (question, options, results) => `<strong>${question}</strong>${generateResults(options, results)}`;

// create polling according to request, expects input in match as:
// /poll question? answer1, answer2, ...
const createPoll = (msg) => {
  const chatId = msg.chat.id;
  let input = (msg.text || '');
  // default options needed to create fun poll.
  let question = defaultQuestion;
  let options = defaultOptions;

  input = input.replace('/poll', '').trim();
  // console.log(input);
  if (input.length > 0) {
    // check if any question in request
    if (input.indexOf('?') < 1) {
      return bot.sendMessage(msg.chat.id, 'Нет вопроса - нет голосувания!');
    }
    // getting question from request
    question = input.substr(0, input.indexOf('?') + 1);
    let strOpts = input.substr(input.indexOf('?') + 1);

    while (strOpts.charAt(0) === '?') {
      strOpts = strOpts.substr(1);
    }

    // getting options of polling from request
    if (strOpts.length > 0) {
      let optionsData = strOpts.split(/,/).filter(
        el => el.trim().length !== 0);
      optionsData = _.uniq(optionsData.map(
        s => s.trim()
      )
      );
      if (optionsData.length > 0) {
        options = {};
        optionsData.forEach((element, index) => {
          options[index.toString()] = element;
        });
      }
    }
  }

  // send message with results and buttons
  return bot.sendMessage(msg.chat.id,
    getFormattedResult(question, options, []), msgOptions(options))
    .then((sended) => {
      const voteId = sended.message_id;
      const poll = new Poll(chatId, voteId);
      return poll.create(question, options);
    });
};

// Update message after user vote
const updateMessage = (msg) => {
  const chatId = msg.chat.id;
  const voteId = msg.message_id;
  const poll = new Poll(chatId, voteId);
  const resultsPromise = [];
  resultsPromise.push(poll.getOptions());
  resultsPromise.push(poll.getResults());
  resultsPromise.push(poll.getQuestion());
  return Promise.all(resultsPromise).then((data) => {
    const options = data[0];
    const results = data[1];
    const question = data[2];
    const msgOps = msgOptions(options);
    msgOps.message_id = voteId;
    msgOps.chat_id = chatId;
    return bot.editMessageText(getFormattedResult(question, options, results), msgOps);
  });
};

// voting handler,
const makeChoice = (msg) => {
  const { id, message } = msg;

  const chatId = message.chat.id;
  const voteId = message.message_id;
  const userId = msg.from.id;
  const choiceId = msg.data;

  const poll = new Poll(chatId, voteId);
  // check if this is our voting
  return poll.known().then((known) => {
    const _id = id;
    const _msg = message;
    if (parseInt(known, 10) > 0) {
      // check if user already voted
      return poll.getUserResult(userId).then(
        (opt) => {
          const optionId = parseInt(opt, 10);
          const mid = _id;
          if (isNaN(optionId)) {
            // ok processing vote
            return poll.vote(choiceId, userId).then(
              () => poll.getOption(parseInt(choiceId, 10))
            ).then(res => updateMessage(_msg)
              .then(() => bot.answerCallbackQuery(mid,
                `Поздравляю! Ты успешно голосунул за "${res}"`)));
          }
          // no user already voted, no changing mind allowed!
          return poll.getOption(optionId).then(res => bot.answerCallbackQuery(mid,
            `Так не пойдет, переголосунуть нельзя, живи с ответом "${res}"`));
        });
    }
    return Promise.reject(new Error('not known'));
  });
};

export { createPoll, makeChoice };
