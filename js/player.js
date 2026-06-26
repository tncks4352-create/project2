class Player{
constructor(){this.el=document.getElementById('player');this.x=150;}
update(keys){
if(keys['a'])this.x-=4;
if(keys['d'])this.x+=4;
this.x=Math.max(0,Math.min(1000,this.x));
this.el.style.left=this.x+'px';
}}
