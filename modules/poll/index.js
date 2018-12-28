const i18next = require('i18next');
const i18nextBackend = require('i18next-node-fs-backend');
const uniq = require('lodash.uniq');

const { dispatcher } = require('../bot');
const { generateResults } = require('./choice');
const Poll = require('../models/poll');
const { notify } = require('../logger');
const { msgOptions } = require('../utils');

const i18nextOptions = {
  backend: {
    loadPath: `${__dirname}/../locales/{{lng}}/{{ns}}.json`
  },
  fallbackLng: 'en',
  ns: ['poll'],
  defaultNS: 'poll',
  debug: true
};

const defaultOptions = {
  0: i18next.t('default0'),
  1: i18next.t('default1'),
  3: i18next.t('default3')
};
const defaultQuestion = i18next.t('defaultQuestion');

// create polling according to request, expects input in match as:
// /poll question? answer1, answer2, ...
dispatcher.command('/poll', async (req, res) => {
  const { chat: { id: chatId }, from: { language_code: lng } } = req;

  await i18next.use(i18nextBackend).init(Object.assign(i18nextOptions, lng));

  let { text: input = '' } = req;

  // default options needed to create fun poll.
  let question = defaultQuestion;
  let options = defaultOptions;

  input = input.replace('/poll', '').trim();
  // console.log(input);
  if (input.length > 0) {
    // check if any question in request
    if (input.indexOf('?') < 1) {
      return res.sendMessage(chatId, i18next.t('emptyQuestion'));
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
      `<strong>${question}</strong>${generateResults(options, [])}`,
      msgOptions(options)
    );
    const poll = new Poll(chatId, voteId);
    return poll.create(question, options);
  } catch (e) {
    return notify(e);
  }
});
