# playlist-pals-vinyl

<img src="https://pbs.twimg.com/media/DvojGqqUwAApbmr.jpg:large" />

This prototype was developed in winter 2018, when [I made playlists for all my Twitter friends for Christmas](https://twitter.com/lilytried/status/1077112906544607232). It takes a 4-panel Spotify playlist cover art and picks a color in each quadrant to create a gradient. 

## How to run

Requires Node >= 8. First, install dependencies:

### With Yarn

```
yarn
```

### With npm

```
npm install
```

Then, serve the folder with your tool of choice (I like python's `SimpleHTTPServer`)

```
python -m SimpleHTTPServer 3000
```

Open in a browser at localhost://3000 and you should see things up and running!

To use your own artwork, put it into the `/original` folder.

## Things to know

- This demo only works in new versions of Chrome (those that support the `conic-gradient` syntax. Sorry to disappoint.
- This demo doesn't actually use the raw generated colors. It uses #EAF0F0 as the base, blending the gradient with a hard light blending mode, 80% opacity
- I'm not taking feature requests for now, sorry
