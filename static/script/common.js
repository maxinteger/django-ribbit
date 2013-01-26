DEBUG = true;

/** Global universal log function */
function log(){var w=window,c=w.console,a=arguments;return !w.DEBUG||(c&&c.log&&c.log.apply&&(c.log.apply(c,a)||true))||alert(a[0]),a};

/** Universal type check */
is = function (obj, type/*optional*/) {
    var cls = Object.prototype.toString.call(obj).slice(8, -1);
    return type ? (obj !== undefined && obj !== null && cls === type) : cls;
};

/** Set new prototype method */
Function.prototype.method = function (name, func, override) {
    if (!this.prototype[name] || override) {
        this.prototype[name] = func;
    }
    return this;
};

/**
 * Create Module
 *
 * @param module:Object|String	module name (separated with point) or module object
 * @param func:Function         module constructor: func(args) and func this === module
 * @param args                  extra module construction parameters
 * @return						module object
 */
var Module = function(mod, func /*, args */) {
    var module = func && mod || window,
        fn = func || mod || undefined;
    if (typeof module === 'string'){
        var arr = module.split('.'),
            submodule;
        module = window;
        while ( arr.length ){
            submodule = arr.shift();
            if ( !submodule ){
                break;
            } else {
                module = (module[submodule] = module[submodule] || {});
            }
        }
    }

    fn.apply(module, Array.prototype.slice.call(arguments, func && mod ? 2 : 1));
    return module;
};
Module.method = Function.prototype.method;

/** New method */
Function.method('new', function ( ) {
    // Create a new object that inherits from the
    // constructor's prototype.
    var that = Object.create(this.prototype);
    // Invoke the constructor, binding –this- to
    // the new object.
    var other = this.apply(that, arguments);
    // If its return value isn't an object,
    // substitute the new object.
    return (typeof other === 'object' && other) || that;
});

Function.method('inherits', function (Parent) {
    this.prototype = new Parent( );
    return this;
});



Math.randomInt = function(base, num){
    return (num && base || 0) + Math.floor(Math.random() * (num || base || 1));
}

Array.method('forEach', function (callback) {
    var len = this.length, i;
    for (i = 0; i < len; i += 1){
        callback(this[i], i, this);
    }
});

Array.create = function(dim, def) {
    dim = util.is(dim, 'array') ? dim : [dim === undefined ? 1 : dim];
    if (dim.length === 0){
        return util.is(def, 'function') ? def() : def;
    } else {
        var ret = [],
            curDimCount = dim[0],
            nextDim = dim.slice(1);
        for (var i = 0; i < curDimCount; i++){
            ret.push(Array.create(nextDim, def));
        }
        return ret;
    }
};

Module('util', function () {
    this.is = function (obj, type) {
        var cls = Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
        return type ? (obj !== undefined && obj !== null && cls === type.toLowerCase()) : cls;
    };

    this.isNumber = function (value) {
        return typeof value === 'number' && isFinite(value);
    }

    this.choise = function (item, list, def) {
        return list[item] || def;
    }

    var vendors = ['', 'ms', 'moz', 'webkit', 'o'];
    this.vendorCheck = function (obj, item, def) {
        var items = {'array': item, 'string': [item]}[this.is(item)],
            itemName, vend;

        if (itemName){
            for (vendor in vendors){
                vend = vendors[vendor];
                for (item in items){
                    itemName = vend ? items[item].toFirstUpperCase : items[item];
                    if (obj[vend + itemName]){
                        return obj[vend + itemName];
                    }
                }
            }
        }
        return def || null;
    }

    /** Get whole or one piece of cookie in object form */
    this.getCookie = function (key/*optional*/){
        if (key){
            var value = (document.cookie.match(RegExp('(?:^|;)\\s*' + key + '\\s*=([^;]*)(?:;|$)')) || [])[1];
            return value ? unescape(value) : value;
        } else {
            var items = document.cookie.split(';'), out = {};
            for (i = items.length-1; i >= 0; i--){
                var item = items[i].split('=');
                out[item[0]] = unescape(item[1]);
            }
            return out;
        }
    }

    /** Set a cookie with expire date */
    this.setCookie = function (key, value, exdays/*optional*/) {
        var exdate = new Date();
        document.cookie = [key, "=", escape(value), ((!exdays) ? "" : "; expires="+((exdate.setDate(exdate.getDate() + exdays), exdate).toUTCString())), "; path=/"].join('');
    }
});

Module('util.array', function () {
    this.sum = function (arr) {
        var sum = 0;
        arr.forEach(function (val, idx, arr) { sum += (+val); });
        return sum;
    };
});


Module(function () {
    String.prototype.toFirstLowerCase = function(first_argument) {
        return this.charAt(0).toLowerCase() + this.slice(1);
    };

    String.prototype.toFirstUpperCase = function(first_argument) {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };

    String.prototype.reverse = ( String.prototype.reverse || function() {
        return this.split('').reverse().join('');
    });

    String.prototype.times = ( String.prototype.times || function(n) {
        return Array((n || 0) + 1).join(this);
    });

    String.prototype.pad = (String.prototype.pad || function(length, character, align){
        var p = (character || ' ').times((this.length > length) ? 0 : length - this.length);
        return ('left' == align ? p : '') + this.substr(0, length) + ('left' != align ? p : '');
    });
});

Module('ui', function(){
   this.ParametricTemplate = function(template){
       this.template = $(template);
       this.cache = {};
       if (!this.template.length) throw "Invalid template";
   }
   this.ParametricTemplate.method('get', function(key){
       if(key){
           return (this.cache[key] = this.cache[key] || this.template.find('.'+key)).text()
       }
   });

   this.ParametricTemplate.method('set', function(){

   });
});