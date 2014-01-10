/*
####### mrReiha is here !
####### @mrReiha
####### www.reiha.net
*/
(function(_){
	'use strict';
	var	requestAnim,cancelAnim,e,
	gradext=({
		__init:function(){
			var r=~~(Math.random()*5),arg;
			e=new Array;
			requestAnim=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame;
			cancelAnim=window.cancelAnimationFrame||window.mozCancelAnimationFrame||window.webkitCancelAnimationFrame||window.CancelAnimationFrame||window.msCancelAnimationFrame;
			return arg=({
				animation:this.animation||0,
				startColor:this.startColor||['#0b2b87','#0a6b51','#dbd952','#c31fc1','#f1676e'][r],
				elemID:this.elemID||0,
				rgb:this.rgb||0,
				endColor:this.endColor||['#244ec5','#39daaf','#6c6b0f','#5d0c5c','#6f0e13'][r],
				startPosition:(this.startPosition)?(this.startPosition-1):0,
				endPosition:(this.endPosition)?(this.endPosition-1):0,
				radius:this.radius||15,
				delay:this.delay*1000||0,
				quality:this.quality||20,
				mode:this.mode||'horizontal',
				direction:this.direction||'rtl'
			});
		},
		__make:function(self,wantMouse){
			var	args=this,elem,obj;
			if(typeof(args)!='object')
				args=(typeof(args)=='string')?({elemID:args}):({});
				
			args=self.__init.apply(args);
			e['whichID?']=args.elemID?0:1;
			if(e['whichID?']) 
				throw new Error('You Have to Specify an "elemID" for Me :(');
			
			elem=document.getElementById(args.elemID);
			e['invalidID']=elem?0:1;
			if(e['invalidID'])
				throw new Error('I Think your "elemID" wasn\'t Right ; Gimme Another Please ... :(');
			
			e['invalidMode']=args.mode=='vertical'?0:(args.mode=='horizontal'?0:1);
			if(e['invalidMode'])
				throw new Error('Your Provided "mode" Has to be horizontal or vertical :(');
			
			var	startCode=self.__normalizeColor(self.__removeHex.apply(args.startColor)),
				endCode=self.__normalizeColor(self.__removeHex.apply(args.endColor)),
				str=elem.textContent.trim(),
				txtArr=str.split(''),
				total=(args.mode=='vertical')?args.quality:txtArr.length,
				frag=document.createDocumentFragment(),
				center=getComputedStyle(elem).textAlign=='center'?1:0;
			e['emptyID']=str==''?1:0;
			if(e['emptyID'])
				throw new Error('Your Element Must Contains a Text :(');
				
			e['invalidStartPosition']=args.startPosition+1>=total?(args.mode=='vertical'?0:1):0;
			if(e['invalidStartPosition'])
				throw new Error('"startPosition" Has to be Less than the Length of Your String :(');
			
			e['invalidEndPosition']=args.endPosition>args.startPosition?0:(args.endPosition==0?0:1);
			if(e['invalidEndPosition'])
				throw new Error('"endPosition" Has to be Greater than "startPosition :("');
			
			e['invalidColor']=startCode.length<6?(startCode.length>3?1:(startCode.length==3?0:1)):(startCode.length==6?0:1);
			if(!e['invalidColor'])
				e['invalidColor']=endCode.length<6?(endCode.length>3?1:(endCode.length==3?0:1)):(endCode.length==6?0:1);

			if(e['invalidColor'])
				throw new Error('Please Gimme a Valid and Standard Hexadecimal Code for Your Color; I Can\'t Read This one :(');
			
			e['duplicateColor1']=startCode==endCode
			if(e['duplicateColor1'])
				throw new Error('"startColor" is equal to "endColor"');
			
			e['invalidQuality']=~~args.quality==args.quality?0:1;
			if(e['invalidQuality'])
				throw new Error('"quality" can\'t be a float number :(');
				
			obj={
				elem:elem,
				total:total,
				count:0,
				rev:args.direction=='ltr',
				args:args,
				rgb:args.rgb,
				rTotal:args.radius*2,
				startColor:{
					red:parseInt(startCode.substring(0,2),16),
					green:parseInt(startCode.substring(2,4),16),
					blue:parseInt(startCode.substring(4,6),16)
				},
				endColor:{
					red:parseInt(endCode.substring(0,2),16),
					green:parseInt(endCode.substring(2,4),16),
					blue:parseInt(endCode.substring(4,6),16)
				},
				vert:args.mode=='vertical',
				self:self,
				elemHeight:elem.offsetHeight,
				center:center
			};
			elem.innerHTML='';
			switch(args.mode){
				case'horizontal':{
					for(var i=0;i<total;i++){
						var span=document.createElement('span');
						span.innerHTML=txtArr[i];
						span.setAttribute('data-index',i);
						span.style.color=args.startColor;
						frag.appendChild(span);
					}
					break;
				}
				case'vertical':{
					elem.style.position='relative';
					for(var i=0;i<total;i++){
						var span=document.createElement('span');
						span.setAttribute('data-index',i);
						span.innerHTML=str;
						span.style.color=args.startColor;
						span.style.position='absolute';
						span.style.zIndex=total-i;
						span.style.overflow='hidden';
						if(!wantMouse)
							span.style.pointerEvents=span.style.mozPointerEvents=span.style.webkitPointerEvents=span.style.msPointerEvents='none';
						
						if(i==total-1&&!wantMouse)
							span.style.pointerEvents=span.style.mozPointerEvents=span.style.webkitPointerEvents=span.style.msPointerEvents='initial';
						
						frag.appendChild(span);
					}
					break;
				}
			}
			elem.appendChild(frag);
			return obj;
		},
		hoverable:function(args){
			var _args=this.__make.apply(args,[this,1]),
				args=_args.args;
			for(var i=_args.elem.children.length;i--;){
				if(args.animation)
					_args.elem.children[i].style.transition=_args.elem.children[i].style.msTransition=_args.elem.children[i].style.webkitTransition=_args.elem.children[i].style.mozTransition=_args.elem.children[i].style.oTransition='color .25s ease';
				
				if(_args.vert){
					_args.elem.children[i].style.height=_args.self.__genHeight(_args.elemHeight,i,_args.total);
					if(_args.center)
							_args.elem.children[i].style.marginLeft='-'+_args.elem.children[i].offsetWidth/2+'px';
							
					if(i==_args.total-1)
						_args.elem.style.minHeight=_args.elem.children[i].offsetHeight+'px';
							
				}
				_args.elem.children[i].onmouseover=function(e){
					args.startPosition=this.getAttribute('data-index')-args.radius;
					if(args.startPosition<0)
						var k=-args.startPosition;
						
					else
						var k=0;
						
					for(var j=0;j<_args.total;j++){
						if(j>=args.startPosition){
							_args.elem.children[j].style.color=_args.self.__genColor(_args.startColor,k,_args.endColor,_args.rTotal,args.radius,'radial',args.rgb);
							k++;
						}else
							_args.elem.children[j].style.color=_args.self.__genColor(_args.startColor,0,_args.endColor,_args.rTotal,args.radius,'radial',args.rgb);
					
					}
				}
			}
			_args.elem.onmouseout=function(e){
				for(var i=0;i<_args.total;i++)
					_args.elem.children[i].style.color=_args.self.__genColor(_args.startColor,0,_args.endColor,_args.total,args.radius,'linear',args.rgb);
				
			}
		},
		linear:function(args){
			var	_args=this.__make.apply(args,[this]),
				args=_args.args;
			for(var i=0,j=_args.count;i<_args.total;i++){
				if((args.startPosition)?(args.endPosition?(i>=args.startPosition&&i<args.endPosition):i>=args.startPosition):(args.endPosition?i<args.endPosition:1)){
					_args.elem.children[i].style.color=_args.self.__genColor(_args.startColor,j,_args.endColor,(args.endPosition)?(args.endPosition-args.startPosition):(_args.total-args.startPosition),args.radius,'linear',args.rgb);		
					j++;
				}else if((args.endPosition)?(i>=args.endPosition):0)
					_args.elem.children[i].style.color=_args.self.__genColor(_args.startColor,_args.total,_args.endColor,_args.total,args.radius,'linear',args.rgb);
				
				else
					_args.elem.children[i].style.color=_args.self.__genColor(_args.startColor,0,_args.endColor,_args.total,args.radius,'linear',args.rgb);
			
				if(_args.vert){
					_args.elem.children[i].style.height=_args.self.__genHeight(_args.elemHeight,i,_args.total);
					if(_args.center)
							_args.elem.children[i].style.marginLeft='-'+_args.elem.children[i].offsetWidth/2+'px';
							
					if(i==_args.total-1)
						_args.elem.style.minHeight=_args.elem.children[i].offsetHeight+'px';
				
				}
			}
		},
		radial:function(args){
			var _args=this.__make.apply(args,[this]),
				args=_args.args;
				alert('sadas');
			(function __anim(){
				var j=_args.count;
				if(!args.animation&&_args.rev) j=_args.total;
				if(args.animation) args.startPosition=0;
				for(var i=0;i<_args.total;i++){
					if(i>=args.startPosition){
						_args.elem.children[i].style.color=_args.self.__genColor(_args.startColor,j,_args.endColor,_args.rTotal,args.radius,'radial',args.rgb);
						_args.rev?j--:j++;
					}else
						_args.elem.children[i].style.color=_args.self.__genColor(_args.startColor,0,_args.endColor,_args.rTotal,args.radius,'radial',args.rgb);
				
					if(_args.vert){
						_args.elem.children[i].style.height=_args.self.__genHeight(_args.elemHeight,i,_args.total);
						if(_args.center)
							_args.elem.children[i].style.marginLeft='-'+_args.elem.children[i].offsetWidth/2+'px';
							
						if(i==_args.total-1)
							_args.elem.style.minHeight=_args.elem.children[i].offsetHeight+'px';
						
					}	
				}
				_args.count++;
				if(args.animation){
					if(_args.rev?_args.count<=_args.total+_args.rTotal:_args.count<=_args.rTotal)
						requestAnim(__anim);
					
					else{
						_args.count=_args.rev?-args.radius:-_args.total;
						var id=setTimeout(function(){
							requestAnim(__anim);
						},args.delay);
					}
				}
			})();
		},
		__removeHex:function(){
			return this.charAt(0)=='#'?this.substring(1,this.length):this;
		},
		__normalizeColor:function(code){
			if(code.length==3){
				var arr=code.split(''),
					i=0;
				while(arr[i]){
					arr[i]=arr[i]+arr[i];
					i++;
				}
				return arr.join('');
			}
			return code;
		},
		__genHeight:function(height,i,total){
			return (i+1)*(height/total)+'px';
		},
		__genColor:function(sColor,i,eColor,total,radius,fn,wantRGB){
			var	toHex=function(num){
					var n=parseInt(num,10);
					if(isNaN(n)) return '00';
					n=Math.max(0,Math.min(n,255));
					return '0123456789ABCDEF'.charAt((n-n%16)/16)+"0123456789ABCDEF".charAt(n%16);
				},
				diff={
					red:Math.abs(sColor.red-eColor.red),
					green:Math.abs(sColor.green-eColor.green),
					blue:Math.abs(sColor.blue-eColor.blue)
				},hex;
			e['duplicateColor2']=(diff.red==0)?((diff.green==0)?((diff.blue==0)?1:0):0):0;
			if(e['duplicateColor2']){
				throw new Error('"startColor" is equal to "endColor"');
			}
			/* sR = staticRadial & sL = staticLinear and it means a static number for linear function and same for sR :D */
			var sR={
					red:(diff.red/radius).toFixed(2),
					blue:(diff.blue/radius).toFixed(2),
					green:(diff.green/radius).toFixed(2)
				},
				sL={
					red:(diff.red/total).toFixed(2),
					blue:(diff.blue/total).toFixed(2),
					green:(diff.green/total).toFixed(2)
				},
				linear=function(){
					if(i==0){
						var	red=sColor.red,
							green=sColor.green,
							blue=sColor.blue;
					}else if(i==total-1){
						var	red=eColor.red,
							green=eColor.green,
							blue=eColor.blue;
					}else{
						var	red=Math.abs((i*sL.red)+(sColor.red<eColor.red?sColor.red:-sColor.red)),
							green=Math.abs((i*sL.green)+(sColor.green<eColor.green?sColor.green:-sColor.green)),
							blue=Math.abs((i*sL.blue)+(sColor.blue<eColor.blue?sColor.blue:-sColor.blue));
					}
					hex=toHex(red)+toHex(green)+toHex(blue);
					return wantRGB?('rgb('+~~red+','+~~green+','+~~blue+')'):('#'+hex);
				},
				radial=function(){
					if(i<=0||i>=total){
						var red=sColor.red,
							blue=sColor.blue,
							green=sColor.green;
					}else{
						if(i<radius){
							var red=Math.abs((i*sR.red)+(sColor.red<eColor.red?sColor.red:-sColor.red)),
								blue=Math.abs((i*sR.blue)+(sColor.blue<eColor.blue?sColor.blue:-sColor.blue)),
								green=Math.abs((i*sR.green)+(sColor.green<eColor.green?sColor.green:-sColor.green));
						}else{
							var red=Math.abs(((total-i)*sR.red)+(sColor.red<eColor.red?sColor.red:-sColor.red)),
								blue=Math.abs(((total-i)*sR.blue)+(sColor.blue<eColor.blue?sColor.blue:-sColor.blue)),
								green=Math.abs(((total-i)*sR.green)+(sColor.green<eColor.green?sColor.green:-sColor.green));
						}
					}
					hex=toHex(red)+toHex(green)+toHex(blue);
					return wantRGB?('rgb('+~~red+','+~~green+','+~~blue+')'):('#'+hex);
				}
			switch(fn){
				case('linear'):return linear();
				case('radial'):return radial();
			}
		}
	});
	_.gradext=_.Gradext=gradext;
})(this);
