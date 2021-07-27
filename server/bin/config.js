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
const fs = __importStar(require("fs"));
const dotenv = __importStar(require("dotenv"));
const main_1 = require("./main");
dotenv.config();
class config {
    schema = {};
    template = "";
    appjs = "";
    secret = "";
    constructor() {
        let data = fs.readFileSync(process.env.DB_Q, 'utf8');
        this.schema = JSON.parse(data);
        this.template = fs.readFileSync(process.env.ENTRYPOINT, 'utf8');
        this.appjs = fs.readFileSync(process.env.JS_BUNDLE, 'utf8');
        this.secret = process.env.SECRET;
        this.migrate(this.schema.migrate_up);
    }
    migrate(obj) {
        setTimeout(() => {
            let keys = Object.keys(obj);
            keys.forEach((v, i) => {
                console.log(`Creating table ${v}`);
                main_1.db.query(obj[v], (err, result, fields) => {
                    if (err) {
                        console.log(err.message);
                    }
                });
            });
        }, 3000);
    }
}
exports.config = config;
