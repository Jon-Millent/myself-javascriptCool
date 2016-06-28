(function(root){

	function Factory(node){
		this.node=node;
	};
	Factory.prototype.mousedown=function(fn){
		this.on('touchstart',function(event){
			if(event.targetTouches.length == 1){
				fn(event.targetTouches[0]);
			}
		})
	};
	Factory.prototype.mouseup=function(fn){
		this.on('touchend',function(event){
			fn(event.targetTouches[0]);
		})
	};
	Factory.prototype.mousemove=function(fn){
		this.on('touchmove',function(event){
			if(event.targetTouches.length == 1){
				
				fn(event.targetTouches[0]);
			}
		})
	};
	Factory.prototype.scroll=function(fn,fn2){
		var root=this;
		this.mousedown(function(e){
			root.on('scroll',function(e){
				fn(e);
			})
			if(fn2){
				var first=document.body.scrollTop || document.documentElement.scrollTop;
				root.mouseup(function(e){
					
					var last=first-document.body.scrollTop || document.documentElement.scrollTop;
					if(last>0){
						fn2(e,1);
					}else if(last==0){
						fn2(e,0);
					}else{
						fn2(e,-1);
					}
					
					root.off(root.node,'touchend');
					root.off(root.node,'scroll')

				})	
			}
			
		})
	};
	Factory.prototype.on=function(type,fn){
		this.node.lib=this.node.lib||{};
		this.node.lib[type]=this.node.lib[type]||[];
		var g=function(event){
			fn(event)
		}
		this.node.lib[type].push(g)

		this.node.addEventListener(type,g,false)
	};
	Factory.prototype.off=function(node,type){
		for(var i=0;i<node.lib[type].length;i++){
			node.removeEventListener(type,node.lib[type][i],false);
		}
		node.lib[type]=[];
	};
	Factory.prototype.css=function(attr,value) {
	    switch (arguments.length) {
	        case 1:
	            if (typeof arguments[0] == "object") { 
	                for (var i in attr) this.node.style[i] = attr[i]
	                return this;  
	            }
	            else { 
	                return getComputedStyle(this.node, null)[attr]
	            }
	            break;
	        case 2:
	            this.node.style[attr] = value;
	        	return this;    
	            break;
	        default:
	            return "";
	    }

	};
	Factory.prototype.hasClass=function(name,type){
	    var arr=this.node.className.split(' ');
	    var isFind=false;
	    for(var i =0;i<arr.length;i++){
	        if(arr[i]==name){
	            isFind=true;
	        }
	    }
	    if(type){
	        return [isFind,arr];
	    }else{
	        return isFind;
	    }
	};
	Factory.prototype.addClass=function(cls){
	    if(!this.hasClass(cls)){
	        this.node.className+=(" "+cls);
	    }
	    return this;
	};
	Factory.prototype.removeClass=function(name){
	    if(this.hasClass(name,true)[0]){
	        var arr=this.hasClass(name,true)[1];
	        for(var i=0;i<arr.length;i++){
	            if(arr[i]==name){
	                arr.splice(i,1);
	            }
	        }
	        this.node.className=arr.join(' ');
	    }
	    return this;
	};
	root.$=function(node){
		if(typeof node=='object'){
			return new Factory(node)
		}else if(typeof node == 'function'){
			if (document.addEventListener) {
		        document.addEventListener('DOMContentLoaded', function () {
		            document.removeEventListener('DOMContentLoaded', arguments.callee, false);
		            node();
		        }, false)
		    }
		}
		
	}
})(window)