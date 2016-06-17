(function(w){
    var Matrix = function(r, c) {
        var self = this;
        self.rows = isNaN(r) ? 3 : parseInt(r);
        self.cols = isNaN(c) ? 3 : parseInt(c);
        self.determinant = null;
        self.cofactor = null;
        self.transpose = null;
        self.adjunct = null;
        self.inverse = null;
        self.mat = [];

        for (var i = 0; i < self.rows; i++) {
            self.mat[i] = [];
            for (var j = 0; j < self.cols; j++) {
                self.mat[i][j] = 0;
            }
        }
    };

    Matrix.prototype.getValue = function(r, c){
        var self = this;
        if (r >= 0 && r < self.rows && c >= 0 && c < self.cols) {
            return self.mat[r][c];
        }
        else {
            throw new TypeError('Indice de matriz inválido:[' + r + '][' + c + ']');
        }
    };

    Matrix.prototype.setValue = function(r, c, v){
        var self = this;
        if (r >= 0 && r < self.rows && c >= 0 && c < self.cols) {
            if (!isNaN(v)) {
                self.mat[r][c] = v;
                self.determinant = null;
            }
            else {
                throw new TypeError("O valor passado como parâmetro deve ser um numero");
            }
        }
        else {
            throw new TypeError('Indice de matriz inválido:[' + r + '][' + c + ']');
        }
    };

    Matrix.prototype.setRow = function(r, vls){
        var self = this;
        if (r >= 0 && r < self.rows) {
            if (vls instanceof Array && vls.length == self.cols) {
                self.mat[r] = vls;
                self.determinant = null;
            }
            else {
                throw new TypeError("A quantidade de colunas deve ser a mesma da matriz");
            }
        }
        else {
            throw new TypeError("Indice de linha invalido[" + r + "]");
        }
    };

    Matrix.prototype.setCol = function(c,vls){
        var self = this;
        if (c >= 0 && c < self.cols) {
            if (vls instanceof Array && vls.length == self.rows) {
                for (var i = 0; i < self.mat.length; i++) {
                    self.mat[i][c] = vls[i];
                }
                self.determinant = null;
            }
            else {
                throw new TypeError("A quantidade de colunas deve ser a mesma da matriz");
            }
        }
        else {
            throw new TypeError("Indice de coluna invalido[i][" + c + "]");
        }
    };

    Matrix.prototype.getRow = function(r){
        var self = this;
        if (r >= 0 && r <= self.rows) {
            return self.mat[r];
        }
        return null;
    };

    Matrix.prototype.getCol = function(c){
        var self = this;
        if (c >= 0 && c <= self.cols) {
            var aux = [];
            for (var i = 0; i < self.mat.length; i++) {
                aux[i] = self.mat[i][c];
            }
            return aux;
        }
        return null;
    };

    Matrix.prototype.cofactor = function(){
        var self = this;
        if(arguments.length == 2){
            var row = arguments[0];
            var col = arguments[1];
            if (row >= 0 && row < self.rows && col >= 0 && col < self.cols) {
                return Math.pow(-1, row + col) * self.subMat(row, col).determinant()
            }
            else {
                throw new TypeError("Indice inexistente[" + row + "][" + col + "]");
            }
        }
        else{
            if (self.cofactor == null) {
                self.cofactor = new Matrix(self.rows, self.cols);
                for (var i = 0; i < self.rows; i++) {
                    for (var j = 0; j < self.cols; j++) {
                        self.cofactor.setValue(i, j, self.obterCofator(i, j));
                    }
                }
            }
            return self.cofactor;
        }
    };


    Matrix.prototype.subMat = function(r, c){
        var self = this;
        if (r >= 0 && r < self.rows && c >= 0 && c < self.cols) {
            var subord = self.rows - 1;
            var submat = new Matrix(subord, subord);
            var subi = 0;
            var subj = 0;
            for (var i = 0; i < self.mat.length; i++) {
                if (i != r) {
                    for (var j = 0; j < self.mat[i].length; j++) {
                        if (j != c) {
                            submat.setValue(subi, subj, self.mat[i][j]);
                            subj++;
                            if (subj == subord) {
                                subj = 0;
                                subi++;
                            }
                        }
                    }
                }
            }
            return submat;
        }
        else {
            throw new TypeError("Indice inexistente[" + r + "][" + c + "]");
        }
    };


    Matrix.prototype.transpose = function(){
        var self = this;
        if (self.transpose == null) {
            self.transpose = new Matrix(self.cols, self.rows);
            for (var i = 0; i < self.mat.length; i++) {
                var row = self.getRow(i);
                self.transpose.setCol(i, row);
            }
        }
        return self.transpose;
    };

    Matrix.prototype.adjunct = function(){
        var self = this;
        if (self.adjunct == null) {
            self.adjunct = self.cofactor().transpose();
        }
        return self.adjunct;
    };

    Matrix.prototype.inverse = function(){
        var self = this;
        if (self.inverse == null) {
            if (self.determinant() != 0) {
                self.inverse = Matrix.scale(self.adjunct(), 1 / self.determinant());
            }
            else {
                console.log("A matriz não possui matriz inversa");
            }
        }
        return self.inverse;
    };

    Matrix.prototype.determinant = function(){
        var self = this;
        if (self.determinant == null) {
            if (self.rows == self.cols) {
                if (self.rows == 1) {
                    self.determinant = self.getValue(0, 0);
                }
                else if (self.rows <= 3) {
                    self.determinant = self.determinantBySarrus();
                }
                else {
                    self.determinant = self.determinantByLaplace();
                }
            }
            else {
                throw new TypeError("Não é possivel calcular a determinate porque a matriz nao e quadrada:" + self.rows + "," + self.cols);
            }
        }
        return self.determinant;
    };

    Matrix.prototype.determinantByLaplace = function(){
        var self = this;
        var i = parseInt(Math.floor(Math.random() * self.rows));
        var det = 0;
        for (var j = 0; j < self.mat[i].length; j++) {
            det += self.mat[i][j] * self.obterCofator(i, j);
        }
        return det;
    };

    Matrix.prototype.determinantBySarrus = function(){
        var self = this;
        var sum = 0;
        if (self.cols == 2) {
            sum = self.getValue(0, 0) * self.getValue(1, 1) - self.getValue(0, 1) * self.getValue(1, 0);
        }
        else {
            for (var j = 0; j < 3; j++) {
                var da = 0;
                var aux = 1;
                for (var jAux = j, i = 0, count = 0; count < 3; jAux++, i++, count++) {
                    jAux = jAux >= self.cols ? 0 : jAux;
                    i = i >= self.rows ? 0 : i;
                    aux *= self.getValue(i, jAux);
                }

                da = aux;
                aux = 1;

                for (jAux = j, i = 0, count = 0; count < 3; jAux--, i++, count++) {
                    jAux = jAux < 0 ? self.cols - 1 : jAux;
                    i = i >= self.rows ? 0 : i;
                    aux *= self.getValue(i, jAux);
                }

                sum += (da - aux);
            }
        }
        return sum;
    };


    Matrix.prototype.toString = function(){
        var self = this;
        var str = "";
        for (var i = 0; i < self.mat.length; i++) {
            str += "\n";
            for (var j = 0; j < self.mat[i].length; j++) {
                str += "[" + self.getValue(i, j) + "]";
            }

        }
        return str;
    };

    Matrix.sum = function (ma, mb) {
        if (ma instanceof Matrix && mb instanceof Matrix) {
            if (ma.rows == mb.rows && ma.cols == mb.cols) {
                var mal = ma.rows;
                var mbc = mb.cols;
                var mat = new Matrix(mal, mbc);
                var i;
                var j;
                for (i = 0; i < mal; i++) {
                    for (j = 0; j < mbc; j++) {
                        mat.setValue(i, j, ma.getValue(i, j) + mb.getValue(i, j));
                    }
                }
                return mat;
            }
        }
        return null;
    };

    Matrix.sub = function (ma, mb) {
        if (ma instanceof Matrix && mb instanceof Matrix) {
            if (ma.rows == mb.cols && ma.rows == mb.cols) {
                var mal = ma.rows;
                var mbc = mb.cols;
                var mat = new Matrix(mal, mbc);
                var i;
                var j;
                for (i = 0; i < mal; i++) {
                    for (j = 0; j < mbc; j++) {
                        mat.setValue(i, j, ma.getValue(i, j) - mb.getValue(i, j));
                    }
                }
                return mat;
            }
        }
        return null;
    };

    Matrix.scale = function (m, s) {
        if (m instanceof Matrix && !isNaN(s)) {
            var mat = new Matrix(m.rows, m.cols);
            var i;
            var j;
            for (i = 0; i < m.rows; i++) {
                for (j = 0; j < m.cols; j++) {
                    mat.setValue(i, j, m.getValue(i, j) * s);
                }
            }
            return mat;
        }
        return null;
    };

    Matrix.mxm = function (ma, mb) {
        if (ma instanceof Matrix && mb instanceof Matrix) {
            if (ma.cols == mb.rows) {
                var mat = new Matrix(ma.rows, mb.cols);
                var i;
                var j;
                var row;
                var col;
                var sum = 0;
                var k;
                for (i = 0; i < ma.rows; i++) {
                    for(j = 0; j < mb.cols; j++) {
                        row = ma.getRow(i);
                        col = mb.getCol(j);
                        sum = 0;
                        for (k = 0; k < row.length; k++) {
                            sum += row[k] * col[k];
                        }
                        mat.setValue(i, j, sum);
                    }
                }
                return mat;
            }
        }
        return null;
    };

    w.Matrix = Matrix;
})(window);

