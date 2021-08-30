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
const main_1 = require("../main");
const mock = __importStar(require("node-mocks-http"));
const assert_1 = __importDefault(require("assert"));
const mysqlMock_1 = require("./mysqlMock");
const api_1 = require("../api");
before(() => {
    main_1.setDbMock(new mysqlMock_1.mysqlMock(null, '{}', []));
});
it('Login mocked pass through', () => {
    const req = mock.createRequest({ url: '/login' });
    const res = mock.createResponse();
    main_1._api.login(req, res);
    assert_1.default(res.status.toString, '200');
});
it('Register mocked pass through', () => {
    const req = mock.createRequest({ url: '/register' });
    const res = mock.createResponse();
    main_1._api.login(req, res);
    assert_1.default(res.status.toString, '200');
});
it('getItems mock', () => {
    const req = mock.createRequest({ url: '/items' });
    const res = mock.createResponse();
    main_1._api.getItems(req, res);
    assert_1.default(res.status.toString, '200');
});
it('getOrders mock', () => {
    const req = mock.createRequest({ url: '/orders' });
    const res = mock.createResponse();
    main_1._api.getOrders(req, res);
    assert_1.default(res.status.toString, '200');
});
it('getUsers mock', () => {
    const req = mock.createRequest({ url: '/orders' });
    const res = mock.createResponse();
    main_1._api.getUsers(req, res);
    assert_1.default(res.status.toString, '200');
});
it('handleError mock - no err', () => {
    const req = mock.createRequest({ url: '/some-url' });
    const res = mock.createResponse();
    main_1.db.getConnection((err, conn) => {
        api_1.handleError(undefined, conn, res);
    });
    assert_1.default(res.status.toString, '200');
});
it('handleError mock - err', () => {
    const req = mock.createRequest({ url: '/some-url' });
    const res = mock.createResponse();
    main_1.db.getConnection((err, conn) => {
        api_1.handleError(new Error('some error'), conn, res);
    });
    assert_1.default(res.status.toString, '403');
});
it('handleSelectAll mock - err', () => {
    const req = mock.createRequest({ url: '/some-url' });
    const res = mock.createResponse();
    api_1.handleSelectAll(req, res, "items");
    assert_1.default(res.status.toString, '200');
});
it('handleUrlParamReq mock - err', () => {
    main_1.setDbMock(new mysqlMock_1.mysqlMock(null, '{}', []));
    const req = mock.createRequest({ url: '/some-url' });
    req.params = { id: "3" };
    const res = mock.createResponse();
    api_1.handleUrlParamReq(req, res, "select", "orders");
    assert_1.default(res.status.toString, '200');
});
