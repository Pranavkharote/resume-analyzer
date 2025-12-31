module.exports = async function generateWithRetry(fn, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (err.message.includes("503") && i < retries - 1) {
        await new Promise(r => setTimeout(r, 1000 * (i + 1)));
      } else {
        throw err;
      }
    }
  }
};
