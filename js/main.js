const keys={};let player;
window.addEventListener('DOMContentLoaded',()=>{
player=new Player();
document.getElementById('startBtn').onclick=()=>{
document.getElementById('menu').style.display='none';
document.getElementById('game').style.display='block';
};
document.addEventListener('keydown',e=>keys[e.key.toLowerCase()]=true);
document.addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
loop();
});
function loop(){if(player)player.update(keys);requestAnimationFrame(loop);}
