"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.authenticate = exports.log = exports.route = exports.router = void 0;
const express_1 = __importDefault(require("express"));
exports.router = express_1.default.Router();
/**
 * @route(path: string, method: string)
 *
 * @returns {MethodDecorator}
 */
function route(path, method) {
    return function (target, propertyKey, descriptor) {
        let original = descriptor;
        switch (method) {
            case "get":
                exports.router.get(path, function (req, resp) {
                    descriptor.value(req, resp);
                });
            case "post":
                exports.router.post(path, function (req, resp) {
                    descriptor.value(req, resp);
                });
            case "put":
                exports.router.put(path, function (req, resp) {
                    descriptor.value(req, resp);
                });
            case "patch":
                exports.router.patch(path, function (req, resp) {
                    descriptor.value(req, resp);
                });
            case "delete":
                exports.router.delete(path, function (req, resp) {
                    descriptor.value(req, resp);
                });
            default:
                exports.router.get(path, function (req, resp) {
                    descriptor.value(req, resp);
                });
        }
        return original;
    };
}
exports.route = route;
function log() {
    return function (target, propertyKey, descriptor) {
        let original = descriptor.value;
        descriptor.value = function (...args) {
            const r = args[0];
            const wr = args[1];
            let t = new Date().toDateString();
            console.log(`${t} - Method:[${r.method}] Path:[${r.path}]`);
        };
        return original;
    };
}
exports.log = log;
function authenticate() {
    return function (target, propertyKey, descriptor) {
        let original = descriptor.value;
        descriptor.value = function (...args) {
            const r = args[0];
            const wr = args[1];
            console.table(args);
            // TODO ...
        };
    };
}
exports.authenticate = authenticate;
function validate() {
    return function (target, propertyKey) {
        console.log(target, propertyKey);
    };
}
exports.validate = validate;
