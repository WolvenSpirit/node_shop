"use strict";
var doc = document;
var app = /** @class */ (function () {
    function app() {
        this.load();
    }
    ;
    app.prototype.load = function () {
        if (document !== null) {
            // @ts-ignore: Object is possibly 'null'.
            document.getElementById('1').innerHTML += "Hello TS!";
        }
    };
    return app;
}());
var myApp = new app();
