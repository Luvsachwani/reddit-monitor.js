// Reddit Job Monitor for Video Editing Agency
// Searches subreddits for video editing opportunities

const axios = require('axios');

const config = {
  clientId: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET',
  userAgent: 'JobMonitor/1.0 by /u/Amano_kun_',
  subreddits: ['forhire', 'VideoEditing', 'freelance'],
  keywords: ['video editor', 'video editing', 'youtube editor']
};

// Get Reddit OAuth token
async function getAccessToken() {
  const auth = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64');
  const response = await axios.post('https://www.reddit.com/api/v1/access_token',
    'grant_type=client_credentials',
    { headers: { 'Authorization': `Basic ${auth}`, 'User-Agent': config.userAgent } }
  );
  return response.data.access_token;
}

// Search subreddit for keywords
async function searchSubreddit(subreddit, token) {
  const keywords = config.keywords.join(' OR ');
  const url = `https://oauth.reddit.com/r/${subreddit}/search?q=${keywords}&restrict_sr=1&sort=new&limit=25`;
  
  const response = await axios.get(url, {
    headers: { 'Authorization': `Bearer ${token}`, 'User-Agent': config.userAgent }
  });
  
  return response.data.data.children;
}

// Main monitoring function
async function monitorJobs() {
  console.log('Starting job monitoring...');
  const token = await getAccessToken();
  
  for (const subreddit of config.subreddits) {
    const posts = await searchSubreddit(subreddit, token);
    posts.forEach(post => {
      console.log(`Found: ${post.data.title} - r/${subreddit}`);
      // Manual review required before responding
    });
  }
}

// Run every 2 hours
setInterval(monitorJobs, 2 * 60 * 60 * 1000);
monitorJobs();
