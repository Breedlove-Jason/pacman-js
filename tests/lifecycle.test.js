import test from 'node:test';
import assert from 'node:assert/strict';

test('restart retains one input handler and one timer; pause freezes play', async()=>{
 const listeners=new Map(), buttons=new Map();
 function element(){
  const classes=new Set();
  return {style:{},children:[],textContent:'',disabled:false,classList:{add(...xs){xs.forEach(x=>classes.add(x));},remove(...xs){xs.forEach(x=>classes.delete(x));},contains(x){return classes.has(x);},toggle(x,on){on?classes.add(x):classes.delete(x);}},appendChild(x){this.children.push(x);},addEventListener(type,fn){this[type]=fn;},setAttribute(){}};
 }
 for(const id of ['#game','#start-button','#pause-button','#status','#score','#best','#sound-button'])buttons.set(id,element());
 globalThis.document={querySelector:s=>buttons.get(s),querySelectorAll:()=>[],createElement:element,addEventListener:(type,fn)=>{const a=listeners.get(type)||[];a.push(fn);listeners.set(type,a);}};
 globalThis.Audio=class {play(){return Promise.resolve();}pause(){}};
 globalThis.localStorage={getItem:()=>null,setItem(){}};
 const timers=new Map();let id=0;
 globalThis.setInterval=fn=>{timers.set(++id,fn);return id;};
 globalThis.clearInterval=id=>timers.delete(id);
 await import('../index.js');
 for(let i=0;i<5;i++)buttons.get('#start-button').click();
 assert.equal(listeners.get('keydown').length,1);
 assert.equal(timers.size,1);
 buttons.get('#pause-button').click();
 assert.equal(buttons.get('#pause-button').textContent,'Resume');
 const before=buttons.get('#score').textContent;
 [...timers.values()][0]();
 assert.equal(buttons.get('#score').textContent,before);
 buttons.get('#pause-button').click();
 assert.equal(buttons.get('#pause-button').textContent,'Pause');
});
