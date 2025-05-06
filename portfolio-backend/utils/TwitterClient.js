const Twitter = require('twitter');

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

exports.postTweet = async (message) => {
  try {
    await client.post('statuses/update', { status: message });
    console.log('Tweet publicado:', message);
  } catch (error) {
    console.error('Error al publicar el tweet:', error);
    throw error;
  }
};
