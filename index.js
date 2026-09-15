import { LEVEL, OBJECT_TYPE as O } from './setup.js';
import { randomMovement } from './ghostMoves.js';
import GameBoard from './GameBoard.js';
import Pacman from './Pacman.js';
import Ghost from './Ghost.js';

const board = GameBoard.createGameBoard(document.querySelector('#game'), LEVEL);
const start = document.querySelector('#start-button');
const pause = document.querySelector('#pause-button');
const status = document.querySelector('#status');
const scoreText = document.querySelector('#score');
const bestText = document.querySelector('#best');
let pacman, ghosts = [], score = 0, timer, powerUntil = 0, pausedAt = 0, state = 'ready', muted = true, best = 0;
try { best = Number(localStorage.getItem('pacman-best')) || 0; } catch {}
bestText.textContent = best;
const audio = Object.fromEntries(['munch','pill','game_start','death','eat_ghost'].map(name=>[name,new Audio('./sounds/'+name+'.wav')]));
function sound(name) {
  if (muted) return;
  audio[name].currentTime = 0;
  audio[name].play().catch(()=>{});
}
function updateScore() {
  scoreText.textContent = score;
  if (score > best) {
    best = score; bestText.textContent = best;
    try { localStorage.setItem('pacman-best',String(best)); } catch {}
  }
}
function finish(won) {
  if (state !== 'running') return;
  state = 'ended'; clearInterval(timer); powerUntil = 0;
  sound(won ? 'game_start' : 'death');
  status.textContent = won ? 'Maze cleared. Beautiful run!' : 'Caught! Ready for another run?';
  board.showGameStatus(won);
  pause.disabled = true; start.textContent = 'Play again';
}
function collide() {
  for (const ghost of ghosts) {
    if (ghost.pos !== pacman.pos) continue;
    if (!pacman.powerPill) { finish(false); return true; }
    sound('eat_ghost');
    board.removeObject(ghost.pos,[O.GHOST,O.SCARED,ghost.name]);
    ghost.pos = ghost.startPos;
    ghost.timer = 0;
    board.addObject(ghost.pos,[O.GHOST,ghost.name,O.SCARED]);
    score += 100; updateScore();
  }
  return false;
}
function tick() {
  if (state !== 'running') return;
  pacman.powerPill = performance.now() < powerUntil;
  ghosts.forEach(g=>{
    g.isScared = pacman.powerPill;
    board.grid[g.pos].classList.toggle(O.SCARED,g.isScared);
  });
  board.moveCharacter(pacman);
  // Collect before collision: a pellet protects the player on this very step.
  if (board.objectExist(pacman.pos,O.DOT)) {
    board.removeObject(pacman.pos,[O.DOT]); board.dotCount--; score += 10; sound('munch');
  }
  if (board.objectExist(pacman.pos,O.PILL)) {
    board.removeObject(pacman.pos,[O.PILL]); score += 50; sound('pill');
    powerUntil = performance.now()+10000; pacman.powerPill = true;
    ghosts.forEach(g=>{g.isScared=true; board.addObject(g.pos,[O.SCARED]);});
  }
  updateScore();
  if (collide()) return;
  for (const ghost of ghosts) {
    board.moveCharacter(ghost);
    if (collide()) return;
  }
  const pillsRemain = board.grid.some(cell=>cell.classList.contains(O.PILL));
  if (board.dotCount === 0 && !pillsRemain) return finish(true);
  status.textContent = pacman.powerPill ? 'Power up · chase the ghosts!' : 'Collect every dot and power pellet.';
}
function startGame() {
  clearInterval(timer); powerUntil=0; score=0;
  board.createGrid(LEVEL); pacman = new Pacman(2,287);
  board.addObject(pacman.pos,[O.PACMAN]);
  ghosts = [
    new Ghost(5,188,randomMovement,O.BLINKY),
    new Ghost(4,209,randomMovement,O.PINKY),
    new Ghost(3,230,randomMovement,O.INKY),
    new Ghost(2,251,randomMovement,O.CLYDE),
  ];
  ghosts.forEach(g=>board.addObject(g.pos,[O.GHOST,g.name]));
  state='running'; start.textContent='Restart'; pause.disabled=false; pause.textContent='Pause';
  updateScore(); status.textContent='Use arrow keys, WASD, or the direction buttons.'; sound('game_start');
  timer=setInterval(tick,80);
}
function togglePause() {
  if (state==='running') {
    state='paused'; pausedAt=performance.now(); pause.textContent='Resume'; status.textContent='Paused · take your time.';
  } else if (state==='paused') {
    powerUntil += performance.now()-pausedAt; state='running'; pause.textContent='Pause';
  }
}
start.addEventListener('click',startGame);
pause.addEventListener('click',togglePause);
document.querySelector('#sound-button').addEventListener('click',e=>{
  muted=!muted; e.currentTarget.textContent=muted?'Sound off':'Sound on'; e.currentTarget.setAttribute('aria-pressed',String(!muted));
  if(muted) Object.values(audio).forEach(a=>a.pause());
});
document.addEventListener('keydown',e=>{
  if (e.target.matches('input,textarea,select')) return;
  if (e.code==='Space' && e.target.tagName!=='BUTTON') {e.preventDefault();togglePause();return;}
  if (state==='running') pacman.handleKeyInput(e,board.objectExist);
});
document.querySelectorAll('[data-direction]').forEach(button=>button.addEventListener('pointerdown',e=>{
  e.preventDefault();
  if(state==='running') pacman.handleKeyInput({key:button.dataset.direction,preventDefault(){}},board.objectExist);
}));
document.addEventListener('visibilitychange',()=>{if(document.hidden && state==='running') togglePause();});
