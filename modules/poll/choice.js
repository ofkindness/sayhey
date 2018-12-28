const bugsnag = require('@bugsnag/js');
const i18next = require('i18next');
const i18nextBackend = require('i18next-node-fs-backend');
const { format } = require('util');

const Poll = require('../models/poll');
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
const { notify } = bugsnag(process.env.BUGSNAG_API_KEY);

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
    const result = Number.isNaN(parseInt(results[option], 10)) ? 0 : parseInt(results[option], 10);
    const percentage = total > 0 ? ((result / total) * 100).toFixed(0) : 0;
    const pooCount = ((percentage / 10) + 1).toFixed(0);
    const bar = pooBarItem.repeat(pooCount);
    resultStr = resultStr.concat(`
        <b>${options[option]}</b> - ${result}
         ${bar} <b>${percentage} %</b>
        `);
  });
  resultStr = resultStr.concat(format(i18next.t('totalVotes'), total));
  return resultStr;
};

// Update message after user vote
const updateMessage = (req, res) => {
  const { chat: { id: chatId }, message_id: voteId } = req;
  const poll = new Poll(chatId, voteId);

  return Promise.all([
    poll.getOptions(),
    poll.getResults(),
    poll.getQuestion()
  ])
    .then(([options, results, question]) => res.editMessageText(
      `<strong>${question}</strong>${generateResults(options, results)}`,
      Object.assign(msgOptions(options), {
        message_id: voteId,
        chat_id: chatId
      })
    ))
    .catch(e => notify(e));
};

// voting handler,
const makeChoice = async (req, res) => {
  const {
    id,
    message: {
      chat: { id: chatId },
      message_id: voteId,
      from: { id: userId, language_code: lng }
    },
    data: choiceId
  } = req;

  await i18next.use(i18nextBackend).init(Object.assign(i18nextOptions, lng));

  const poll = new Poll(chatId, voteId);

  try {
    // check if this is our voting
    if (await poll.known()) {
      // check if user already voted
      const { optionId, userNotVoted } = await poll.getUserResult(userId);
      if (userNotVoted) {
        // ok processing vote
        await poll.vote(choiceId, userId);
        const choice = await poll.getOption(parseInt(choiceId, 10));
        await updateMessage(req.message, res);
        return res.answerCallbackQuery(id, format(i18next.t('voted'), choice));
      }
      // no user already voted, no changing mind allowed!
      const choice = await poll.getOption(optionId);
      return res.answerCallbackQuery(id, format(i18next.t('alreadyVoted'), choice));
    }

    return null;
  } catch (e) {
    return notify(e);
  }
};


module.exports = { makeChoice, generateResults };
