import {mkdir, copyFile, cp, rm} from 'node:fs/promises';
await rm('dist', {recursive:true, force:true});
await mkdir('dist');
for (const file of ['index.html','index.js','style.css','setup.js','GameBoard.js','Ghost.js','Pacman.js','ghostMoves.js']) await copyFile(file, 'dist/'+file);
await cp('sounds','dist/sounds',{recursive:true,filter:source=>!source.endsWith('.DS_Store')});
