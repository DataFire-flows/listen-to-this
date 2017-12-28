const datafire = require('datafire');
const accounts = datafire.Project.main().accounts;
const spotify = require('@datafire/spotify').create(accounts.spotify);
const reddit = require('@datafire/reddit_rss').create();

module.exports = new datafire.Action({
  title: "Create a Spotify playlist from r/listenToThis",
  description: "Create a new playlist every day using suggestions from Reddit",
  handler: async (input, context) => {
    let spotifyUser = await spotify.me.get({});
    let posts = await reddit.subreddit({subreddit: 'listentothis'});
    let entries = posts.feed.entries.slice(0, 10);
    let searchResults = await Promise.all(entries.map(entry => {
      return spotify.search.get({
        type: 'track',
        q: entry.title.replace(/\[.*\]/g, '').replace(/\(.*\)/g, ''),
      })
    }))
    let playlist = await spotify.users.user_id.playlists.post({
      user_id: spotifyUser.id,
      body: {
        name: "r/listentothis for " + new Date().toISOString().slice(0,10),
      },
    });
    let addedTracks = await spotify.users.user_id.playlists.playlist_id.tracks.post({
      user_id: spotifyUser.id,
      playlist_id: playlist.id,
      uris: searchResults.filter(function(searchResult) {
          return searchResult.tracks.items.length;
        }).map(function(searchResult) {
          return searchResult.tracks.items[0].uri;
        }).join(','),
    });

    return "Success";
  }
})
