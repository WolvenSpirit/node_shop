"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const config_1 = require("../config");
const main_1 = require("../main");
const mysqlMock_1 = require("./mysqlMock");
let cfg;
before(() => {
    cfg = new config_1.config();
    main_1.setDbMock(new mysqlMock_1.mysqlMock(undefined, {}, []));
});
describe('Config tests', () => {
    it('migrate', () => {
        assert_1.default.ifError(cfg.migrate(cfg.schema.migrate_up));
    });
});
