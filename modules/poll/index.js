const bugsnag = require('@bugsnag/js');
const uniq = require('lodash.uniq');

const { dispatcher } = require('../bot');
const Poll = require('../models/poll');
const { msgOptions, getFormattedResult } = require('../utils');

const { notify } = bugsnag(process.env.BUGSNAG_API_KEY);

const defaultOptions = {
  0: 'Да',
  1: 'Нет',
  3: 'Я - томат'
};
const defaultQuestion = 'Ты меня уважаешь?';

// create polling according to request, expects input in match as:
// /poll question? answer1, answer2, ...
dispatcher.command('/poll', async (req, res) => {
  const { chat: { id: chatId } } = req;
  let { text: input = '' } = req;

  // default options needed to create fun poll.
  let question = defaultQuestion;
  let options = defaultOptions;

  input = input.replace('/poll', '').trim();
  // console.log(input);
  if (input.length > 0) {
    // check if any question in request
    if (input.indexOf('?') < 1) {
      return res.sendMessage(chatId, 'Нет вопроса - нет голосувания!');
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
        el => el.trim().length !== 0
      );
      optionsData = uniq(optionsData.map(
        s => s.trim()
      ));
      if (optionsData.length > 0) {
        options = {};
        optionsData.forEach((element, index) => {
          options[index.toString()] = element;
        });
      }
    }
  }
  // send message with results and buttons
  try {
    const { message_id: voteId } = await res.sendMessage(
      chatId,
      getFormattedResult(question, options, []),
      msgOptions(options)
    );
    const poll = new Poll(chatId, voteId);
    return poll.create(question, options);
  } catch (e) {
    return notify(e);
  }
});
