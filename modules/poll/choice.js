const bugsnag = require('@bugsnag/js');
const Poll = require('../models/poll');
const { msgOptions, getFormattedResult } = require('../utils');

const { notify } = bugsnag(process.env.BUGSNAG_API_KEY);

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
      getFormattedResult(question, options, results), Object.assign(msgOptions(options), {
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
      from: { id: userId }
    },
    data: choiceId
  } = req;
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
        return res.answerCallbackQuery(id,
          `Поздравляю! Ты успешно голосунул за "${choice}"`);
      }
      // no user already voted, no changing mind allowed!
      const choice = await poll.getOption(optionId);
      return res.answerCallbackQuery(id,
        `Так не пойдет, переголосунуть нельзя, живи с ответом "${choice}"`);
    }

    return null;
  } catch (e) {
    return notify(e);
  }
};


module.exports = { makeChoice };
