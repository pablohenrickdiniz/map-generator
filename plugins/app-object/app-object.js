(function(window){
    var AppObject = function () {
        var self = this;
        self._changeCallbacks = [];
        self._bfrSet = [];
        self._changed = [];
        self._aftChange = [];
        self._acc = [];
    };

    AppObject.prototype.set = function (options) {
        var self = this;
        if (options instanceof Object) {
            Object.keys(options).forEach(function(key){
                var newValue = options[key];
                var oldValue = self[key];
                if (oldValue !== newValue) {
                    if (self._bfrSet === undefined) {
                        self._bfrSet = {};
                    }

                    if (self._bfrSet[key] !== undefined) {
                        newValue = self._bfrSet[key](oldValue, newValue);
                    }
                    if (oldValue !== newValue) {
                        if(self[key] !== undefined){
                            self[key] = newValue;
                        }

                        if (self._changed === undefined) {
                            self._changed = {};
                        }
                        self._changed[key] = true;


                        if (self._changeCallbacks[key] !== undefined) {
                            self._changeCallbacks[key](newValue);
                        }
                    }
                }
            });


            if (self._aftChange !== undefined && self._aftChange.length > 0 && Object.keys(self._changed).length > 0) {
                self._aftChange.forEach(function (callback) {
                    callback();
                });
            }
            self._changed = [];
        }
        return self;
    };

    AppObject.prototype._afterChange = function (callback) {
        var self = this;
        if (self._aftChange === undefined) {
            self._aftChange = [];
        }
        self._aftChange.push(callback);
    };

    AppObject.prototype._isChanged = function (key) {
        var self = this;
        return self._changed[key] !== undefined;
    };

    AppObject.prototype._beforeSet = function (key, callback) {
        var self = this;
        if (self[key] !== undefined || self[key] === null) {
            if (self._bfrSet === undefined) {
                self._bfrSet = {};
            }
            self._bfrSet[key] = callback;
        }
        return self;
    };

    AppObject.prototype._onChange = function (key, callback) {
        var self = this;
        if (self[key] !== undefined || self[key] === null) {
            if (self._changeCallbacks === undefined) {
                self._changeCallbacks = {};
            }

            self._changeCallbacks[key] = callback;
        }
        return self;
    };

    AppObject.prototype._unbindChange = function (key) {
        var self = this;
        if (self._changeCallbacks !== undefined && self._changeCallbacks[key] !== undefined) {
            delete self._changeCallbacks[key];
        }
    };

    AppObject.prototype.props = function () {
        return Object.keys(this);
    };

    window.AppObject = AppObject;
})(window);