const datafire = require('datafire');
const spotify = require('@datafire/spotify').actions;
const reddit = require('@datafire/reddit_rss').actions;

module.exports = new datafire.Action({
  title: "Create a Spotify playlist from r/listenToThis",
  description: "Create a new playlist every day using suggestions from Reddit",
  handler: (input, context) => {
    return datafire.flow(context)
      .then(_ => spotify.me.get({}, context))
      .then(spotifyUser => reddit.subreddit({subreddit: 'listentothis'}))
      .then(posts => {
        let entries = posts.feed.entries.slice(0, 10);
        return Promise.all(entries.map(entry => {
          return spotify.search.get({
            type: 'track',
            q: entry.title.replace(/\[.*\]/g, '').replace(/\(.*\)/g, ''),
          }, context)
        }))
      })
      .then(searchResults => {
        return spotify.users.user_id.playlists.post({
          user_id: context.results.spotifyUser.id,
          body: {
            name: "r/listentothis for " + new Date().toISOString().slice(0,10),
          },
        }, context)
      })
      .then(playlist => {
        return spotify.users.user_id.playlists.playlist_id.tracks.post({
          user_id: context.results.spotifyUser.id,
          playlist_id: playlist.id,
          uris: context.results.searchResults.filter(function(searchResult) {
              return searchResult.tracks.items.length;
            }).map(function(searchResult) {
              return searchResult.tracks.items[0].uri;
            }).join(','),
        }, context)
      })
  }
})
