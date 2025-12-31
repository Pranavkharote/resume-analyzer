module.exports = function chunkText(text, maxLength = 2000) {
  const words = text.split(/\s+/);
  const chunks = [];
  let current = [];
  let length = 0;

  for (const word of words) {
    current.push(word);
    length += word.length + 1;
    if (length >= maxLength) {
      chunks.push(current.join(" "));
      current = [];
      length = 0;
    }
  }

  if (current.length) chunks.push(current.join(" "));
  return chunks;
};
