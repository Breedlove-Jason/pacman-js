import test from 'node:test';
import assert from 'node:assert/strict';
import {randomMovement} from '../ghostMoves.js';
import Pacman from '../Pacman.js';
import {LEVEL,GRID_SIZE,DIRECTIONS,OBJECT_TYPE as O} from '../setup.js';
const exists=(p,o)=> o===O.WALL ? p<0 || p>=LEVEL.length || LEVEL[p]===1 : o===O.GHOSTLAIR && LEVEL[p]===9;
test('enclosed ghost waits without looping',()=>{
 const result=randomMovement(188,DIRECTIONS.ArrowRight,()=>true);
 assert.equal(result.nextMovePos,188);
});
test('ghost chooses the only open direction',()=>{
 const result=randomMovement(188,DIRECTIONS.ArrowRight,(p)=>p!==168);
 assert.equal(result.nextMovePos,168);
});
test('blocked player stays in place',()=>{
 const p=new Pacman(2,21);p.dir=DIRECTIONS.ArrowUp;
 assert.equal(p.getNextMove(exists).nextMovePos,21);
});
test('queued turn is preserved until a junction',()=>{
 const p=new Pacman(2,21);p.dir=DIRECTIONS.ArrowRight;
 p.handleKeyInput({key:'s',preventDefault(){}},exists);
 p.pos=22;assert.equal(p.getNextMove(exists).nextMovePos,23);
 p.pos=24;assert.equal(p.getNextMove(exists).nextMovePos,44);
});
test('every collectible is reachable from the player spawn',()=>{
 const seen=new Set([287]),queue=[287];
 for(const pos of queue) for(const dir of Object.values(DIRECTIONS)){
  const next=pos+dir.movement;
  if(Math.abs(dir.movement)===1 && Math.floor(next/GRID_SIZE)!==Math.floor(pos/GRID_SIZE))continue;
  if(!seen.has(next)&&!exists(next,O.WALL)&&!exists(next,O.GHOSTLAIR)){seen.add(next);queue.push(next);}
 }
 LEVEL.forEach((tile,i)=>{if(tile===2||tile===7)assert.ok(seen.has(i),'Unreachable collectible '+i);});
});
