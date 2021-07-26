"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const config_1 = require("./config");
const main_1 = require("./main");
const decorators_1 = require("./decorators");
const cfg = new config_1.config();
class api {
    constructor() {
    }
    async getItems(r, wr) {
        main_1.db.getConnection((err, conn) => {
            if (err) {
                console.log(err.message);
                conn.release();
                wr.end();
                return;
            }
            conn.query(cfg.schema?.queries?.select.all_items, (err, result, fields) => {
                if (err) {
                    console.log(err.message);
                    conn.release();
                    wr.end();
                }
                console.log(result);
                wr.setHeader("Content-Type", "application/json");
                wr.write(JSON.stringify(result));
                wr.end();
            });
            conn.release();
        });
        wr.end();
    }
    async index(r, wr) {
        console.log(cfg.template);
        wr.write(`${cfg.template}`);
        wr.end();
    }
    serveBundleJS(r, wr) {
        wr.setHeader("Content-Type", "application/javascript");
        wr.write(cfg.appjs);
        wr.end();
    }
    async postItem(r, wr) {
        console.log(r.body);
        wr.end();
    }
    async getItem(r, wr) {
        console.log(r.body);
        main_1.db.getConnection((err, conn) => {
            if (err) {
                console.log(err.message);
                conn.release();
                wr.end();
                return;
            }
            conn.query(cfg.schema.queries.select.item, { id: r.body.id }, (err, result, fields) => {
                if (err) {
                    console.log(err.message);
                    return err;
                }
                else {
                    console.log(result);
                    wr.setHeader("Content-Type", "application/json");
                    wr.write(JSON.stringify(result));
                }
            });
        });
        wr.end();
    }
    async patchItem(r, wr) {
        // TODO
        wr.end();
    }
    async deleteItem(r, wr) {
        // TODO
        wr.end();
    }
    async postOrder(r, wr) {
        // TODO
        wr.end();
    }
    async getOrder(r, wr) {
        // TODO
        wr.end();
    }
    async patchOrder(r, wr) {
        // TODO
        wr.end();
    }
    async deleteOrder(r, wr) {
        // TODO
        wr.end();
    }
    async getOrders(r, wr) {
        // TODO
        wr.end();
    }
}
__decorate([
    decorators_1.log(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], api.prototype, "getItems", null);
__decorate([
    decorators_1.log(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], api.prototype, "index", null);
__decorate([
    decorators_1.log(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], api.prototype, "serveBundleJS", null);
__decorate([
    decorators_1.log(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], api.prototype, "postItem", null);
__decorate([
    decorators_1.log(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], api.prototype, "getItem", null);
__decorate([
    decorators_1.log(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], api.prototype, "patchItem", null);
__decorate([
    decorators_1.log(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], api.prototype, "deleteItem", null);
__decorate([
    decorators_1.log(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], api.prototype, "postOrder", null);
__decorate([
    decorators_1.log(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], api.prototype, "getOrder", null);
__decorate([
    decorators_1.log(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], api.prototype, "patchOrder", null);
__decorate([
    decorators_1.log(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], api.prototype, "deleteOrder", null);
__decorate([
    decorators_1.log(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], api.prototype, "getOrders", null);
exports.api = api;
