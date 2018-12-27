const crypto = require('crypto');

const getId = ({ id = '' }) => crypto.createHash('sha1').update(id.toString()).digest('hex').slice(0, 18);
/* based on realmyst/gist:1262561
   Alexander Shcherbinin */
const declOfNum = (num, titles) => {
  const absNum = Math.abs(num);
  const cases = [0, 1];
  const absNum0 = absNum % 100 > 4 && absNum % 100 < 20;
  const absNumInner = absNum % 10 > 1 ? 1 : 0;
  return titles[absNum0
    ? 0 : cases[(absNum % 10 < 2) ? absNumInner : 1]];
};

const declOfNum3 = (num, titles) => {
  const absNum = Math.abs(num);
  const cases = [2, 0, 1, 1, 1, 2];
  return titles[(absNum % 100 > 4 && absNum % 100 < 20) ? 2 : cases[(absNum % 10 < 5) ? absNum % 10 : 5]];
};

const getName = (user) => {
  if (user && user.username) {
    return user.username;
  }
  return `${user.first_name} ${(user.last_name || '')}`;
};

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
// serialize pollling options to inline keyboard
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
    const result = Number.isNaN(results[option]) ? 0 : parseInt(results[option], 10);
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
const getFormattedResult = (question, options, results) => `<strong>${question}</strong>${generateResults(options, results)}`; // eslint-disable-line

module.exports = {
  msgOptions,
  generateResults,
  getFormattedResult,
  getId,
  getName,
  declOfNum,
  declOfNum3
};
