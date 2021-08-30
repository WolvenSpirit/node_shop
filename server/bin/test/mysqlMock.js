"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mysqlMock = void 0;
class mysqlMock {
    err;
    result;
    fields;
    constructor(err, result, fields) {
        this.err = err;
        this.result = result;
        this.fields = fields;
    }
    getConnection(fn) {
        var err, conn = {};
        conn.query = (query, params, cb) => {
            if (typeof cb === 'function') {
                cb(this.err, this.result, this.fields);
            }
        };
        conn.release = () => { };
        return fn(err, conn);
    }
    removeAllListeners() {
        return;
    }
    end() {
        return;
    }
}
exports.mysqlMock = mysqlMock;
