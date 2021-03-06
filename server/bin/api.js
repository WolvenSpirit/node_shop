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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = exports.verify = exports.handleSelectAll = exports.handleUrlParamReq = exports.handleError = exports.cfg = void 0;
const config_1 = require("./config");
const main_1 = require("./main");
const auth_1 = require("./auth");
const jwt = __importStar(require("jsonwebtoken"));
const smtp_connection_1 = __importDefault(require("nodemailer/lib/smtp-connection"));
exports.cfg = new config_1.config();
let connection = new smtp_connection_1.default({
    port: parseInt(process.env.SMTP_PORT, 10),
    host: process.env.SMTP_HOST,
    secure: true
});
function handleError(err, conn, wr) {
    if (err) {
        console.log(err.message);
        conn.release();
        wr.end();
    }
}
exports.handleError = handleError;
function handleUrlParamReq(r, wr, queryType, resource) {
    console.log(r.params);
    let n = parseInt(r.params.id, 10);
    main_1.db.getConnection((err, conn) => {
        if (err) {
            handleError(err, conn, wr);
            return;
        }
        conn.query(exports.cfg.schema.queries[queryType][resource], n, (err, result, fields) => {
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
exports.handleUrlParamReq = handleUrlParamReq;
function handleSelectAll(r, wr, resource) {
    main_1.db.getConnection((err, conn) => {
        if (err) {
            handleError(err, conn, wr);
            return;
        }
        conn.query(exports.cfg.schema?.queries?.select[resource], (err, result, fields) => {
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
exports.handleSelectAll = handleSelectAll;
function verify(r, wr) {
    try {
        if (jwt.verify(r.headers?.authorization?.split(' ')[1], exports.cfg.secret) === undefined) {
            wr.writeHead(403, "Forbidden");
            console.log('jwt invalid token');
            wr.end();
            return false;
        }
        return true;
    }
    catch (e) {
        console.log(e);
        wr.writeHead(403, "Forbidden");
        console.log('jwt invalid token');
        wr.end();
        return false;
    }
}
exports.verify = verify;
function insertImage(r, wr, url) {
    let values = {
        item_id: r.body.item_id,
        url: url
    };
    main_1.db.getConnection((err, conn) => {
        if (err) {
            handleError(err, conn, wr);
            return;
        }
        conn.query(exports.cfg.schema.queries?.insert?.image, values, (err, result, fields) => {
            if (err) {
                handleError(err, conn, wr);
                return;
            }
            console.log(result);
            wr.setHeader("Content-Type", "application/json");
            wr.write(JSON.stringify({ result, values }));
            wr.end();
        });
        conn.release();
    });
}
class api {
    constructor() {
    }
    async getItems(r, wr) {
        handleSelectAll(r, wr, 'all_items');
    }
    async getOrders(r, wr) {
        if (!verify(r, wr)) {
            return;
        }
        handleSelectAll(r, wr, 'all_orders');
    }
    async index(r, wr) {
        console.log(exports.cfg.template);
        wr.write(`${exports.cfg.template}`);
        wr.end();
    }
    /*
    
    serveBundleJS(r: Request, wr: Response) {
        wr.setHeader("Content-Type","application/javascript");
        wr.write(cfg.appjs);
        wr.end();
    }
    */
    async getItem(r, wr) {
        handleUrlParamReq(r, wr, 'select', 'item');
    }
    async getUser(r, wr) {
        if (!verify(r, wr)) {
            return;
        }
        handleUrlParamReq(r, wr, 'select', 'user');
    }
    async getUsers(r, wr) {
        if (!verify(r, wr)) {
            return;
        }
        handleSelectAll(r, wr, 'all_users');
    }
    async deleteItem(r, wr) {
        if (!verify(r, wr)) {
            return;
        }
        handleUrlParamReq(r, wr, 'delete', 'item');
    }
    async getOrder(r, wr) {
        if (!verify(r, wr)) {
            return;
        }
        handleUrlParamReq(r, wr, 'select', 'order');
    }
    async deleteOrder(r, wr) {
        if (!verify(r, wr)) {
            return;
        }
        handleUrlParamReq(r, wr, 'delete', 'order');
    }
    async postItem(r, wr) {
        let q = exports.cfg.schema.queries.insert.item;
        if (!verify(r, wr)) {
            return;
        }
        main_1.db.getConnection((err, conn) => {
            conn.query(q, r.body, (err, result, fields) => {
                if (err) {
                    handleError(err, conn, wr);
                    return;
                }
                wr.write(JSON.stringify(result));
                wr.end();
            });
            conn.release();
        });
    }
    async patchItem(r, wr) {
        console.log(r.body);
        if (!verify(r, wr)) {
            return;
        }
        main_1.db.getConnection((err, conn) => {
            if (err) {
                handleError(err, conn, wr);
                return;
            }
            conn.query(exports.cfg.schema.queries.update.item, r.body, (err, result, fields) => {
                if (err) {
                    handleError(err, conn, wr);
                    return;
                }
                console.log(result);
                wr.setHeader("Content-Type", "application/json");
                wr.write(JSON.stringify(result));
                wr.end();
            });
            conn.release();
        });
    }
    async postOrder(r, wr) {
        main_1.db.getConnection((err, conn) => {
            handleError(err, conn, wr);
            conn.query(exports.cfg.schema.queries.insert.order, r.body, (err, result, fields) => {
                if (err) {
                    handleError(err, conn, wr);
                    return;
                }
                try {
                    connection.connect((err) => {
                        if (err) {
                            console.log("Connection error:", err);
                            return;
                        }
                        if (connection.alreadySecured) {
                            console.log('Secure connection to SMTP server established');
                        }
                        connection.login({ credentials: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } }, (err) => {
                            if (err) {
                                console.log("Login error:", err);
                                return;
                            }
                            console.log(r.body);
                            let details = JSON.parse(r.body.details);
                            let units = "";
                            for (let i = 0; i < details.items.length; i++) {
                                units += `\n
                            Name: ${details?.items[i]?.name} Price/unit: ${details?.items[i]?.price} Amount: ${details?.items[i]?.count} \n`;
                            }
                            connection.send({
                                from: process.env.SMTP_USER,
                                to: details.email,
                            }, `Subject: Order ${r.body.name} 
                        \n\n\n
                        Transaction status: ${details.transaction.details.status} \n
                        Transaction ID: ${details.transaction.details.id} \n
                        Details:
                        ${units} \n
                        Total: ${details?.total} ${details?.transaction?.details?.purchase_units[0]?.amount?.currency_code} \n
                        `, (err, info) => {
                                if (err) {
                                    console.log("Send error:", err);
                                }
                                console.log(info);
                                connection.quit();
                            });
                        });
                    });
                }
                catch (e) {
                    console.log(e.message);
                }
                console.log(result);
                wr.setHeader("Content-Type", "application/json");
                wr.write(JSON.stringify(result));
                wr.end();
            });
            conn.release();
        });
    }
    async patchOrder(r, wr) {
        console.log(r.body);
        main_1.db.getConnection((err, conn) => {
            if (err) {
                handleError(err, conn, wr);
                return;
            }
            conn.query(exports.cfg.schema.queries.patch.order_paid, r.body, (err, result, fields) => {
                if (err) {
                    handleError(err, conn, wr);
                    return;
                }
                console.log(result);
                wr.setHeader("Content-Type", "application/json");
                wr.write(JSON.stringify(result));
                wr.end();
            });
            conn.release();
        });
    }
    async login(r, wr) {
        console.log(r.body);
        main_1.db.getConnection((err, conn) => {
            if (err || !r.body.email || !r.body.password) {
                console.log(err);
                err ? wr.writeHead(500, 'Internal server error') : wr.writeHead(403, 'Invalid credentials');
                wr.end();
                return;
            }
            console.log("query", exports.cfg.schema.queries.select.login);
            conn.query(exports.cfg.schema.queries.select.login, r.body.email, (err, result, fields) => {
                if (err) {
                    console.log("login email query for hash", err);
                    wr.writeHead(403, 'Forbidden');
                    wr.end();
                    return;
                }
                if (result[0].password !== undefined && auth_1.compare(r.body?.password, result[0].password)) {
                    let token = jwt.sign({ id: result.id, email: result.email }, exports.cfg.secret);
                    wr.setHeader("Content-Type", "application/json");
                    wr.write(JSON.stringify({ Authorization: token }));
                    wr.end();
                }
                else {
                    wr.writeHead(403, "Forbidden");
                    wr.end();
                }
                conn.release();
            });
        });
    }
    async register(r, wr) {
        console.log(r.body);
        main_1.db.getConnection((err, conn) => {
            if (err || !r.body.password) {
                console.log(err);
                err ? wr.writeHead(500, 'Internal server error') : wr.writeHead(403, 'No password provided');
                wr.end();
                return;
            }
            ;
            r.body.password = auth_1.hash(r.body.password.trimLeft().trimRight());
            conn.query(exports.cfg.schema.queries.insert.user, { email: r.body.email, password: r.body.password, role: 0 }, (err, result, fields) => {
                if (err) {
                    console.log(err);
                    wr.writeHead(403, 'Forbidden');
                    wr.end();
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
    // local server filesystem
    async uploadImages(r, wr) {
        if (!verify(r, wr)) {
            return;
        }
        console.log(r);
        insertImage(r, wr, `/images/${r.file?.filename}`);
    }
    // S3 compatible storage
    async uploadImagesS3(r, wr) {
        if (r.file && verify(r, wr)) {
            console.log(r.file);
            try {
                await main_1.s3Client.putObject(process.env.S3_BUCKET, r.file?.originalname, r.file?.buffer);
                const url = await main_1.s3Client.presignedGetObject(process.env.S3_BUCKET, r.file?.originalname);
                insertImage(r, wr, url);
            }
            catch (e) {
                console.log('uploadImagesS3 failed:', e);
            }
        }
    }
    async verify(r, wr) {
        if (!verify(r, wr)) {
            return;
        }
        wr.write(JSON.stringify({ status: 'valid' }));
        wr.end();
    }
}
exports.api = api;
