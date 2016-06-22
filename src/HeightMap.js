(function(w){
    var getType = function(val){
        var self = this;
        var keys =   Object.keys(self.portions);
        for(var i = 0; i < keys.length;i++){
            var key = keys[i];
            var min = self.portions[key][0];
            var max = self.portions[key][1];
            if(val >= min && (max == null || val < max)){
                return key;
            }
        }
        return 'none';
    };

    var getLayer = function(val){
        var self = this;
        var keys =   Object.keys(self.portions);
        for(var i = 0; i < keys.length;i++){
            var key = keys[i];
            var min = self.portions[key][0];
            var max = self.portions[key][1];
            if(val >= min && (max == null || val < max)){
                return  self.portions[key][2];
            }
        }
        return 0;
    };

    var get = function(x,y){
        var self = this;
        var nx = x /self.scale;
        var ny = y /self.scale;
        var val = 0;
        var e = 0;

        for(var k =1 ; k<= self.iterations;k++){
            e = Math.pow(2,k);
            val += 1/k*noise.perlin2(nx*e,ny*e);
        }
        val = Math.abs(val);
        return val;
    };

    var HeightMap = function(sx,sy,width,height){
        var self = this;
        self.seed = Math.random();
        self.portions = [];
        self.iterations = 8;
        self.scale = 1;
        self.sx = sx;
        self.sy = sy;
        self.width = width;
        self.height = height;
        self.map = [];
    };

    HeightMap.prototype.setSeed = function(seed){
        var self  = this;
        self.seed = seed;
    };

    HeightMap.prototype.getSeed = function(){
        var self =this;
        return seed;
    };

    HeightMap.prototype.setPortion = function(name,min,max,layer){
        var self = this;
        min = parseFloat(min);
        if(!isNaN(min)){
            var portion = [];
            layer = layer == undefined?0:layer;
            portion[0] = min;
            max = parseFloat(max);
            if(isNaN(max)){
                max = null;
            }
            portion[1] = max;
            portion[2] = layer;
            self.portions[name] = portion;
        }
    };

    HeightMap.prototype.removePortion = function(name){
        var self = this;
        if(self.portions[name] != undefined){
            delete self.portions[name];
        }
    };

    HeightMap.prototype.getData = function(i,j){
        var self = this;
        noise.seed(self.seed);
        if(self.map[i] == undefined){
            self.map[i] = [];
        }
        if(self.map[i][j] == undefined){
            var data = self.get(j,i);
            data.similiar = [];
            data.similiar[0] = self.get(j,i-1).type == data.type;
            data.similiar[1] = self.get(j+1,i-1).type == data.type;
            data.similiar[2] = self.get(j+1,i).type == data.type;
            data.similiar[3] = self.get(j+1,i+1).type == data.type;
            data.similiar[4] = self.get(j,i+1).type == data.type;
            data.similiar[5] = self.get(j-1,i+1).type == data.type;
            data.similiar[6] = self.get(j-1,i).type == data.type;
            data.similiar[7] = self.get(j-1,i-1).type == data.type;

            self.map[i][j] = data;

        }
        return self.map[i][j];
    };

    HeightMap.prototype.get = function(x,y){
        var self = this;
        var val = get.apply(self,[x,y]);
        var k =  getLayer.apply(self,[val]);
        var type = getType.apply(self,[val]);


        return {
            layer:k,
            type:type
        };
    };

    HeightMap.prototype.setScale = function(scale){
        var self= this;
        self.scale = scale;
    };

    w.HeightMap = HeightMap;
})(window);