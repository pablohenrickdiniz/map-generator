(function(w){
    w.MapGenerator = {
        map_seed:Math.random(),
        portions:[],
        iterations:8,
        scale:1000,
        seed:function(){
            var self = this;
            if(arguments.length == 1){
                self.map_seed = arguments[0];
            }
            else{
                return self.map_seed;
            }
        },
        setPortion:function(name,min,max){
            var self = this;
            min = parseFloat(min);
            if(!isNaN(min)){
                var portion = [];
                portion[0] = min;
                max = parseFloat(max);
                if(isNaN(max)){
                    max = null;
                }
                portion[1] = max;
                self.portions[name] = portion;
            }
        },
        removePortion:function(name){
            var self = this;
            if(self.portions[name] != undefined){
                delete self.portions[name];
            }
        },
        generate2d:function(sx,sy,width,height){
            var self = this;
            var map = [];
            noise.seed(self.map_seed);
            for(var x = sx,dx=0; x < sx+width;x++,dx++){
                for(var y = sy,dy=0; y < sy+height;y++,dy++){
                    var nx = x /self.scale;
                    var ny = y /self.scale;
                    var val = 0;
                    var e = 0;

                    for(var i =1 ; i<= self.iterations;i++){
                        e = Math.pow(2,i);
                        val += 1/i*noise.perlin2(nx*e,ny*e);
                    }

                    val = Math.abs(val);
                    if(map[dx] == undefined){
                        map[dx] = [];
                    }
                    map[dx][dy] = self.getPortionData(val);
                }
            }
            return map;
        },
        generate3d:function(sx,sy,sz,width,height,length){
            var self = this;
            var map = [];
            noise.seed(self.map_seed);
            for(var x = sx,dx=0; x < sx+width;x++,dx++){
                for(var y = sy,dy=0; y < sy+height;y++,dy++){
                    for(var z = sz, dz=0; z < sz+length;z++,dz++){
                        var nx = x /self.scale;
                        var ny = y /self.scale;
                        var nz = z /self.scale;
                        var val = 0;
                        var e = 0;

                        for(var i =1 ; i<= self.iterations;i++){
                            e = Math.pow(2,i);
                            val += 1/i*noise.perlin3(nx*e,ny*e,nz*e);
                        }

                        val = Math.abs(val);
                        if(map[dx] == undefined){
                            map[dx] = [];
                        }

                        if(map[dx][dy] == undefined){
                            map[dx][dy] = [];
                        }

                        map[dx][dy][dz] = self.getPortionData(val);
                    }

                }
            }
            return map;
        },
        getPortionData:function(val){
            var self = this;
            var keys =   Object.keys(self.portions);
            for(var i = 0; i < keys.length;i++){
                var key = keys[i];
                var min = self.portions[key][0];
                var max = self.portions[key][1];
                if(val >= min && (max == null || val < max)){
                    return {
                        type:key,
                        value:val
                    };
                }
            }
            return {
                type:'none',
                value:val
            };
        }
    };
})(window);