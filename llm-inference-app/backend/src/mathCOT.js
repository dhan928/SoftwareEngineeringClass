function isMathQuery(message) {
  const mathKeywords = /(\d+[\+\-\*\/\%]\d+|percent|calculate|solve|equation|what is \d)/i;
  return mathKeywords.test(message);
}
function enhancePrompt(message) {
  return message + "\n\nPlease solve this step by step, showing all intermediate steps before giving the final answer.";
}
function parseSteps(response) {
  return response.split('\n').filter(line => line.trim().length > 0);
}
module.exports = { isMathQuery, enhancePrompt, parseSteps };
