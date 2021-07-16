"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
var fs = __importStar(require("fs"));
var config = /** @class */ (function () {
    function config() {
        var _this = this;
        this.schema = "";
        this.template = "";
        fs.readFile("./schema.json", 'utf8', function (err, data) {
            if (err)
                throw err;
            if (data === undefined) {
                console.log("schema json read fail");
                return;
            }
            _this.schema = data;
        });
        fs.readFile("../client/index.html", 'utf8', function (err, data) {
            if (data === undefined) {
                console.log("index.html read fail");
                return;
            }
            _this.template = data;
        });
    }
    return config;
}());
exports.config = config;
