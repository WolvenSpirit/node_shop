"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compare = exports.hash = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
function hash(plain) {
    return bcryptjs_1.default.hashSync(plain, 11);
}
exports.hash = hash;
function compare(plain, h) {
    return bcryptjs_1.default.compareSync(plain, h);
}
exports.compare = compare;
