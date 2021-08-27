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
const load_test_data_1 = require("./load.test.data");
dotenv.config();
// Wait until the object is populated, wait() will return the object when it is populated;
function wait(obj, fn, checkInterval) {
    checkInterval ? checkInterval : checkInterval = 300;
    let i = setInterval(() => {
        obj !== undefined ? (() => { clearInterval(i); fn(obj); }) : null;
    }, checkInterval);
}
class config {
    schema = {};
    template = "";
    secret = "";
    constructor() {
        let data = fs.readFileSync(process.env.DB_Q, 'utf8');
        this.schema = JSON.parse(data);
        this.template = fs.readFileSync(process.env.ENTRYPOINT, 'utf8');
        this.secret = process.env.SECRET;
        wait(main_1.db, (pool) => {
            this.migrate(this.schema.migrate_up);
            main_1.testRun ? load_test_data_1.migrate() : null;
        });
    }
    migrate(obj) {
        let keys = Object.keys(obj);
        keys.forEach((v, i) => {
            // console.log(`Creating table ${v}`);
            main_1.db.query(obj[v], (err, result, fields) => {
                if (err) {
                    // console.log(err.message);
                }
            });
        });
    }
}
exports.config = config;
