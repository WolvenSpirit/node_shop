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
const chai_1 = __importDefault(require("chai"));
const chai_http_1 = __importDefault(require("chai-http"));
const dotenv = __importStar(require("dotenv"));
const main_1 = require("../main");
const mysql2_1 = __importDefault(require("mysql2"));
dotenv.config();
chai_1.default.use(chai_http_1.default);
chai_1.default.should();
describe("React-Shop", () => {
    main_1.setDbMock(mysql2_1.default.createPool({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10),
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    }));
    describe("GET /", () => {
        it("Serve the front-end app", (done) => {
            let agent = chai_1.default.request(main_1.app);
            agent.get('/').end((err, res) => {
                res.should.have.status(200);
                done();
            });
        });
    });
    describe("POST /login no credentials = 403", () => {
        it("Fail to login", (done) => {
            let agent = chai_1.default.request(main_1.app);
            agent.post('/login').end((err, res) => {
                if (err) {
                    console.log(err.message);
                }
                res.should.have.status(403);
                done();
            });
        });
    });
    describe("POST /loginwith credentials = 200", () => {
        it("Authenticate successfully", (done) => {
            main_1.setDbMock(mysql2_1.default.createPool({
                host: process.env.DB_HOST,
                port: parseInt(process.env.DB_PORT, 10),
                database: process.env.DB_NAME,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD
            }));
            let agent = chai_1.default.request(main_1.app);
            agent.post('/login').set('Content-Type', 'application/json').send(JSON.stringify({ email: "admin3@mail.com", password: "toor" })).end((err, res) => {
                if (err) {
                    console.log(err.message);
                }
                res.should.have.status(200);
                done();
            });
        });
    });
    describe("POST /register no credentials = 403", () => {
        it("Fail to register", (done) => {
            let agent = chai_1.default.request(main_1.app);
            agent.post('/register').end((err, res) => {
                if (err) {
                    console.log(err.message);
                }
                res.should.have.status(403);
                done();
            });
        });
    });
    describe("POST /register valid = 200", () => {
        it("Successfully register", (done) => {
            let agent = chai_1.default.request(main_1.app);
            let c = ['a', 'b', 'c', 'd', 'e', 'f', 'h', 'i', 'j'];
            let randFakeEmail = () => {
                let s = "";
                for (let char of c) {
                    s += c[Math.round(Math.random() * c.length)];
                }
                return [s + "@mail.com", s];
            };
            let creds = randFakeEmail();
            agent.post('/register').set('Content-Type', 'application/json').send({ email: creds[0], password: creds[1] }).end((err, res) => {
                if (err) {
                    console.log(err.message);
                }
                console.log(res);
                res.should.have.status(200);
                done();
            });
        });
    });
});
after(async () => {
    main_1.server.close();
    main_1.shutdown();
    main_1.db.end();
});
