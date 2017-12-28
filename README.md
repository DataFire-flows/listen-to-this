# Listen to This
Creates a Spotify playlist from the top tracks submitted to Reddit's r/listentothis

## Run on DataFire.io

[Click here](https://app.datafire.io/projects?baseRepo=https:%2F%2Fgithub.com%2FDataFire-flows%2Flisten-to-this) to run this project on DataFire.io

Once your project is loaded, go to the **Accounts** tab to link your Spotify account. Then deploy to `prod` and you'll get a new playlist every day.

## Run Manually

Clone the repository and run:
```bash
npm install
npm install -g datafire
datafire authenticate spotify

datafire run ./create-playlist.js
```

