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
function handleError(err, conn, wr) {
    if (err) {
        console.log(err.message);
        conn.release();
        wr.end();
    }
}
function handleUrlParamReq(r, wr, queryType, resource) {
    console.log(r.params);
    let n = parseInt(r.params.id, 10);
    main_1.db.getConnection((err, conn) => {
        if (err) {
            handleError(err, conn, wr);
            return;
        }
        conn.query(cfg.schema.queries[queryType][resource], n, (err, result, fields) => {
            if (err) {
                handleError(err, conn, wr);
                return;
            }
            console.log(result);
            wr.setHeader("Content-Type", "application/json");
            wr.write(JSON.stringify(result));
            wr.end();
        });
    });
}
function handleSelectAll(r, wr, resource) {
    main_1.db.getConnection((err, conn) => {
        if (err) {
            handleError(err, conn, wr);
            return;
        }
        conn.query(cfg.schema?.queries?.select[resource], (err, result, fields) => {
            if (err) {
                handleError(err, conn, wr);
                return;
            }
            console.log(result);
            wr.setHeader("Content-Type", "application/json");
            wr.write(JSON.stringify(result));
            conn.release();
            wr.end();
        });
    });
}
class api {
    constructor() {
    }
    async getItems(r, wr) {
        handleSelectAll(r, wr, 'all_items');
    }
    async getOrders(r, wr) {
        handleUrlParamReq(r, wr, 'select', 'all_orders');
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
    async getItem(r, wr) {
        handleUrlParamReq(r, wr, 'select', 'item');
    }
    async deleteItem(r, wr) {
        handleUrlParamReq(r, wr, 'delete', 'item');
    }
    async getOrder(r, wr) {
        handleUrlParamReq(r, wr, 'select', 'order');
    }
    async deleteOrder(r, wr) {
        handleUrlParamReq(r, wr, 'delete', 'order');
    }
    async postItem(r, wr) {
        let q = cfg.schema.queries.insert.item;
        main_1.db.getConnection((err, conn) => {
            conn.query(q, r.body, (err, result, fields) => {
                if (err) {
                    handleError(err, conn, wr);
                    return;
                }
                wr.write(JSON.stringify(result));
                wr.end();
            });
        });
    }
    async patchItem(r, wr) {
        console.log(r.body);
        main_1.db.getConnection((err, conn) => {
            if (err) {
                handleError(err, conn, wr);
                return;
            }
            conn.query(cfg.schema.queries.update.item, r.body, (err, result, fields) => {
                if (err) {
                    handleError(err, conn, wr);
                    return;
                }
                console.log(result);
                wr.setHeader("Content-Type", "application/json");
                wr.write(JSON.stringify(result));
                wr.end();
            });
        });
    }
    async postOrder(r, wr) {
        console.log(r.body);
        main_1.db.getConnection((err, conn) => {
            handleError(err, conn, wr);
            conn.query(cfg.schema.queries.insert.order, r.body, (err, result, fields) => {
                if (err) {
                    handleError(err, conn, wr);
                    return;
                }
                console.log(result);
                wr.setHeader("Content-Type", "application/json");
                wr.write(JSON.stringify(result));
                wr.end();
            });
        });
    }
    async patchOrder(r, wr) {
        console.log(r.body);
        main_1.db.getConnection((err, conn) => {
            if (err) {
                handleError(err, conn, wr);
                return;
            }
            conn.query(cfg.schema.queries.patch.order_paid, r.body, (err, result, fields) => {
                if (err) {
                    handleError(err, conn, wr);
                    return;
                }
                console.log(result);
                wr.setHeader("Content-Type", "application/json");
                wr.write(JSON.stringify(result));
                wr.end();
            });
        });
    }
    async login(r, wr) {
        // TODO
    }
    async register(r, wr) {
        // TODO
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
], api.prototype, "getOrders", null);
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
], api.prototype, "getItem", null);
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
], api.prototype, "getOrder", null);
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
], api.prototype, "postItem", null);
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
], api.prototype, "postOrder", null);
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
], api.prototype, "login", null);
__decorate([
    decorators_1.log(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], api.prototype, "register", null);
exports.api = api;
