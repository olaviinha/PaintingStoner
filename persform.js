(function(a){a(function(){function b(e,f,c,d){this.element=e;this.style=e.style;this.computedStyle=window.getComputedStyle(e);this.width=f;this.height=c;this.useBackFacing=!!d;this.topLeft={x:0,y:0};this.topRight={x:f,y:0};this.bottomLeft={x:0,y:c};this.bottomRight={x:f,y:c}}b.useDPRFix=false;b.dpr=1;b.prototype=(function(){var d={stylePrefix:""};var f;var k;var c;var m=[[0,0,1,0,0,0,0,0],[0,0,1,0,0,0,0,0],[0,0,1,0,0,0,0,0],[0,0,1,0,0,0,0,0],[0,0,0,0,0,1,0,0],[0,0,0,0,0,1,0,0],[0,0,0,0,0,1,0,0],[0,0,0,0,0,1,0,0]];var i=[0,0,0,0,0,0,0,0];function n(){var o=document.createElement("div").style;d.stylePrefix="webkitTransform" in o?"webkit":"MozTransform" in o?"Moz":"msTransform" in o?"ms":"";f=d.stylePrefix+(d.stylePrefix.length>0?"Transform":"transform");c="-"+d.stylePrefix.toLowerCase()+"-transform-origin"}function h(){var p=this.topLeft.x-this.topRight.x;var o=this.topLeft.y-this.topRight.y;if(Math.sqrt(p*p+o*o)<=1){return true}p=this.bottomLeft.x-this.bottomRight.x;o=this.bottomLeft.y-this.bottomRight.y;if(Math.sqrt(p*p+o*o)<=1){return true}p=this.topLeft.x-this.bottomLeft.x;o=this.topLeft.y-this.bottomLeft.y;if(Math.sqrt(p*p+o*o)<=1){return true}p=this.topRight.x-this.bottomRight.x;o=this.topRight.y-this.bottomRight.y;if(Math.sqrt(p*p+o*o)<=1){return true}p=this.topLeft.x-this.bottomRight.x;o=this.topLeft.y-this.bottomRight.y;if(Math.sqrt(p*p+o*o)<=1){return true}p=this.topRight.x-this.bottomLeft.x;o=this.topRight.y-this.bottomLeft.y;if(Math.sqrt(p*p+o*o)<=1){return true}return false}function j(q,p,o){return q.x*p.y+p.x*o.y+o.x*q.y-q.y*p.x-p.y*o.x-o.y*q.x}function l(){var p=j(this.topLeft,this.topRight,this.bottomRight);var o=j(this.bottomRight,this.bottomLeft,this.topLeft);if(this.useBackFacing){if(p*o<=0){return true}}else{if(p<=0||o<=0){return true}}var p=j(this.topRight,this.bottomRight,this.bottomLeft);var o=j(this.bottomLeft,this.topLeft,this.topRight);if(this.useBackFacing){if(p*o<=0){return true}}else{if(p<=0||o<=0){return true}}return false}function g(){if(h.apply(this)){return 1}if(l.apply(this)){return 2}return 0}function e(){var x=this.width;var v=this.height;var E=0;var D=0;var t=this.computedStyle.getPropertyValue(c);if(t.indexOf("px")>-1){t=t.split("px");E=-parseFloat(t[0]);D=-parseFloat(t[1])}else{if(t.indexOf("%")>-1){t=t.split("%");E=-parseFloat(t[0])*x/100;D=-parseFloat(t[1])*v/100}}var G=[this.topLeft,this.topRight,this.bottomLeft,this.bottomRight];var q=[0,1,2,3,4,5,6,7];for(var B=0;B<4;B++){m[B][0]=m[B+4][3]=B&1?x+E:E;m[B][1]=m[B+4][4]=(B>1?v+D:D);m[B][6]=(B&1?-E-x:-E)*(G[B].x+E);m[B][7]=(B>1?-D-v:-D)*(G[B].x+E);m[B+4][6]=(B&1?-E-x:-E)*(G[B].y+D);m[B+4][7]=(B>1?-D-v:-D)*(G[B].y+D);i[B]=(G[B].x+E);i[B+4]=(G[B].y+D);m[B][2]=m[B+4][5]=1;m[B][3]=m[B][4]=m[B][5]=m[B+4][0]=m[B+4][1]=m[B+4][2]=0}var y,r;var u;var s=[];var B,A,z,F;for(var A=0;A<8;A++){for(var B=0;B<8;B++){s[B]=m[B][A]}for(B=0;B<8;B++){u=m[B];y=B<A?B:A;r=0;for(var z=0;z<y;z++){r+=u[z]*s[z]}u[A]=s[B]-=r}var w=A;for(B=A+1;B<8;B++){if(Math.abs(s[B])>Math.abs(s[w])){w=B}}if(w!=A){for(z=0;z<8;z++){F=m[w][z];m[w][z]=m[A][z];m[A][z]=F}F=q[w];q[w]=q[A];q[A]=F}if(m[A][A]!=0){for(B=A+1;B<8;B++){m[B][A]/=m[A][A]}}}for(B=0;B<8;B++){q[B]=i[q[B]]}for(z=0;z<8;z++){for(B=z+1;B<8;B++){q[B]-=q[z]*m[B][z]}}for(z=7;z>-1;z--){q[z]/=m[z][z];for(B=0;B<z;B++){q[B]-=q[z]*m[B][z]}}var C="matrix3d("+q[0].toFixed(9)+","+q[3].toFixed(9)+", 0,"+q[6].toFixed(9)+","+q[1].toFixed(9)+","+q[4].toFixed(9)+", 0,"+q[7].toFixed(9)+",0, 0, 1, 0,"+q[2].toFixed(9)+","+q[5].toFixed(9)+", 0, 1)";if(b.useDPRFix){var o=b.dpr;C="scale("+o+","+o+")perspective(1000px)"+C+"translateZ("+((1-o)*1000)+"px)"}return this.style[f]=C}n();d.update=e;d.checkError=g;return d})();return b})}(typeof define==="function"&&define.amd?define:function(a){window.PerspectiveTransform=a()}));
