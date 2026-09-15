# Pacman JS
A vanilla JavaScript maze arcade project by Jason Breedlove, originally published in 2022.

## Play
Arrow keys or WASD to move; direction buttons support touch. Collect every dot and power pellet to clear the maze. Power pellets grant ten seconds of protection. Space or Pause freezes play; switching tabs pauses automatically. Sound starts muted and can be enabled explicitly. Personal best is stored only in your browser.

## Develop and deploy
Use Node 22 or later:
```sh
npm ci
npm test
npm run build
python3 -m http.server 8000 --directory dist
```
Open http://localhost:8000. This is a static ES-module app, so use an HTTP server rather than opening the file directly.

Import this repository into Vercel. The included configuration builds with `npm run build` and serves `dist`. No environment variables or server are required.

## Modernization
- Preserves the original maze and CSS characters.
- Replaces Parcel 1 and Babel with native ES modules and a dependency-free build.
- Uses one keyboard listener across restarts.
- Bounds ghost direction selection, including blocked ghosts.
- Buffers turns until an open junction.
- Resolves pellet collection before collisions and stops ticks immediately after losing.
- Adds pause, touch controls, sound controls, responsive layout, and local personal best.
- Tests blocked movement, buffered turns, and full collectible reachability.

The ghosts use simple randomized movement, not the original arcade game's targeting AI. This remains a visual game and is not fully playable through a screen reader. Pac-Man and related characters belong to their respective owners; this is an unofficial educational tribute. Existing sound assets are retained from the original repository; no ownership of third-party assets is claimed.
