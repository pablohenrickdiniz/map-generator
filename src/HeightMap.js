(function(w){
    let HeightMap = function(options){
        let self = this;
        initialize(self);
        options = options || {};
        self.seed = options.seed;
        self.iterations = options.iterations ;
        self.scale = options.scale;
    };

    HeightMap.prototype.get =   function get(x,y){
        let self = this;
        let nx = x /self.scale;
        let ny = y /self.scale;
        let val = 0;
        let e = 0;
        for(let k =1 ; k<= self.iterations;k++){
            e = Math.pow(2,k);
            val += 1/k*noise.perlin2(nx*e,ny*e);
        }
        val = Math.abs(val);
        return val;
    };


    function initialize(self){
        let seed = Math.random();
        let scale = 1;
        let iterations = 8;

        Object.defineProperty(self,'seed',{
           get:function(){
               return seed;
           },
           set:function(s){
               s = parseFloat(s);
               if(!isNaN(s) && s !== seed){
                   seed = s;
               }
           }
        });

        Object.defineProperty(self,'scale',{
            get:function(){
                return scale;
            },
            set:function(s){
                s = parseInt(s);
                if(!isNaN(s) && s >= 1 && s !== scale){
                    scale = s;
                }
            }
        });

        Object.defineProperty(self,'iterations',{
            get:function(){
                return iterations;
            },
            set:function(i){
                i = parseInt(i);
                if(!isNaN(i) && i >= 1 && i !== iterations){
                    iterations = i;
                }
            }
        });
    }


    w.HeightMap = HeightMap;
})(window);