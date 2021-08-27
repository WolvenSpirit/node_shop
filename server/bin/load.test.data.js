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
exports.migrate = void 0;
const main_1 = require("./main");
const fs = __importStar(require("fs"));
function migrate() {
    let q = JSON.parse(fs.readFileSync('./test/test_seed.sql').toString());
    main_1.db.getConnection((err, conn) => {
        if (err) {
            console.log(err.message);
            return;
        }
        conn.beginTransaction((err) => {
            if (err) {
                console.log(err.message);
                conn.release();
                return;
            }
            q.forEach((insert) => {
                conn.query(insert, (err, result) => {
                    if (err) {
                        console.warn(err.message);
                        conn.rollback(() => {
                            conn.release();
                        });
                        return;
                    }
                    // console.log(result);
                });
            });
        });
        conn.commit((err) => err ? console.log(err.message) : console.log("test migrate success"));
    });
}
exports.migrate = migrate;
